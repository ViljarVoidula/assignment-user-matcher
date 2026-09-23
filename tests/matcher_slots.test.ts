import Matcher from '../src/matcher.class';
import { createTestClient } from './helpers/redis';
import { expect } from 'chai';
import sinon from 'sinon';
import type { AssignmentLifecycleEvent, SlotAvailability } from '../src/types/matcher';

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

describe('Timeslots and advance booking', function () {
    this.timeout(20000);
    let matcher: Matcher;
    let redisClient: any;
    let events: AssignmentLifecycleEvent[] = [];
    let clock: sinon.SinonFakeTimers;
    let availability: SlotAvailability[] = [];
    let availabilityCalls: { userIds: string[]; from: number; to: number }[] = [];
    const prefix = 'slots_test:';

    /** "Now" for every test: a fixed Monday, so slot arithmetic reads plainly. */
    const MONDAY = Date.parse('2026-10-05T08:00:00Z');
    /** Thursday 14:00 — the appointment the stories are about. */
    const THURSDAY_14 = Date.parse('2026-10-08T14:00:00Z');

    before(async function () {
        redisClient = createTestClient();
        await redisClient.connect();

        matcher = new Matcher(redisClient, {
            redisPrefix: prefix,
            maxUserBacklogSize: 10,
            relevantBatchSize: 50,
            matchExpirationMs: 60000,
            onAssignmentLifecycle: (event) => events.push(event),
            slotAvailability: async (userIds, from, to) => {
                availabilityCalls.push({ userIds, from, to });
                return availability;
            },
        });
        await matcher.waitUntilReady();
    });

    beforeEach(async function () {
        await redisClient.flushDb();
        events = [];
        availability = [];
        availabilityCalls = [];
        clock = sinon.useFakeTimers({ now: MONDAY, toFake: ['Date'] });
    });

    afterEach(function () {
        clock.restore();
    });

    after(async function () {
        matcher.stopMaintenance();
        await redisClient.quit();
    });

    const kinds = <K extends AssignmentLifecycleEvent['kind']>(kind: K) =>
        events.filter((e) => e.kind === kind) as Extract<AssignmentLifecycleEvent, { kind: K }>[];

    const bookingsKey = `${prefix}assignments:bookings`;
    const spansKey = `${prefix}assignments:bookings:spans`;
    const dueAtKey = `${prefix}assignments:bookings:dueAt`;
    const scheduledKey = `${prefix}assignments:scheduled`;
    const refKey = `${prefix}assignments:ref`;
    const parkedKey = `${prefix}assignments:parked`;
    const userBookings = (userId: string) => `${prefix}user:${userId}:bookings`;

    /** A 90-minute site visit. `extra.slot` refines the slot; the rest is merged alongside. */
    const visit = (id: string, startAt = THURSDAY_14, extra: Record<string, any> = {}) => {
        const { slot, ...rest } = extra;
        return {
            id,
            tags: ['gas-safe'],
            ...rest,
            slot: { startAt, durationMs: 90 * MINUTE, ...(slot ?? {}) },
        };
    };

    /** node-redis answers EXISTS-family commands with 0/1, not a boolean. */
    const exists = async (key: string, field: string) => Boolean(await redisClient.hExists(key, field));

    describe('a slotted task is held until its slot', function () {
        it('keeps the work out of every matching structure before the appointment', async function () {
            await matcher.addUser({ id: 'u1', tags: ['gas-safe'] });
            await matcher.addAssignment(visit('a1'));

            // The work happens on Thursday; it has no business in Monday's queue.
            expect(await exists(scheduledKey, 'a1')).to.equal(true);
            expect(await exists(refKey, 'a1')).to.equal(false);

            await matcher.matchUsersAssignments('u1');
            expect(await redisClient.sCard(`${prefix}user:u1:assignments`)).to.equal(0);
        });

        it('indexes it for booking at startAt minus the book-ahead', async function () {
            await matcher.addAssignment(visit('a1', THURSDAY_14, { slot: { bookAheadMs: 2 * DAY } }));
            const dueAt = await redisClient.zScore(dueAtKey, 'a1');
            expect(Number(dueAt)).to.equal(THURSDAY_14 - 2 * DAY);
        });

        it('books a slot created inside its own book-ahead window on the very next pass', async function () {
            // Default book-ahead is a week, so a Thursday slot booked on
            // Monday opens "last Thursday" — a moment already behind us. The
            // index must be clamped to now or the sweep never sees it.
            await matcher.addAssignment(visit('a1'));
            expect(Number(await redisClient.zScore(dueAtKey, 'a1'))).to.equal(MONDAY);
        });

        it('refuses a slot longer than the overlap probe can see', async function () {
            // maxSlotSpanMs bounds how far back the clash probe reaches; a
            // longer appointment would slip past it and be double-booked.
            let error: Error | null = null;
            await matcher.addAssignment(visit('a1', THURSDAY_14, { slot: { durationMs: 2 * DAY } })).catch((err) => {
                error = err;
            });
            expect(error).to.be.instanceOf(Error);
            expect(String(error)).to.contain('maxSlotSpanMs');
        });
    });

    describe('the booking sweep', function () {
        it('reserves the best eligible worker ahead of the slot', async function () {
            await matcher.addUser({ id: 'weak', tags: ['gas-safe'], routingWeights: { 'gas-safe': 10 } });
            await matcher.addUser({ id: 'strong', tags: ['gas-safe'], routingWeights: { 'gas-safe': 90 } });
            await matcher.addAssignment(visit('a1'));

            const result = await matcher.processSlotBookings();
            expect(result).to.deep.equal({ booked: 1, unfillable: 0 });

            const booking = await matcher.getSlotBooking('a1');
            expect(booking?.userId).to.equal('strong');
            expect(booking?.startAt).to.equal(THURSDAY_14);
            expect(booking?.endAt).to.equal(THURSDAY_14 + 90 * MINUTE);
            expect(booking?.source).to.equal('sweep');

            const booked = kinds('slotBooked');
            expect(booked).to.have.length(1);
            expect(booked[0].workerId).to.equal('strong');
        });

        it('does not book before the book-ahead window opens', async function () {
            await matcher.addUser({ id: 'u1', tags: ['gas-safe'] });
            await matcher.addAssignment(visit('a1', THURSDAY_14, { slot: { bookAheadMs: HOUR } }));

            expect(await matcher.processSlotBookings()).to.deep.equal({ booked: 0, unfillable: 0 });
            expect(await matcher.getSlotBooking('a1')).to.equal(null);

            clock.tick(THURSDAY_14 - HOUR - MONDAY);
            expect(await matcher.processSlotBookings()).to.deep.equal({ booked: 1, unfillable: 0 });
            expect((await matcher.getSlotBooking('a1'))?.userId).to.equal('u1');
        });

        it('reports a slot nobody can take and tries again later', async function () {
            await matcher.addUser({ id: 'plumber', tags: ['plumbing'] });
            await matcher.addAssignment(visit('a1'));

            expect(await matcher.processSlotBookings()).to.deep.equal({ booked: 0, unfillable: 1 });
            expect(kinds('slotUnfillable')).to.have.length(1);

            // Re-indexed rather than forgotten: the slot books itself once
            // somebody qualified appears.
            expect(Number(await redisClient.zScore(dueAtKey, 'a1'))).to.be.greaterThan(MONDAY);
            await matcher.addUser({ id: 'gas', tags: ['gas-safe'] });
            clock.tick(20 * MINUTE);
            expect(await matcher.processSlotBookings()).to.deep.equal({ booked: 1, unfillable: 0 });
        });

        it('books a worker whose backlog is full today', async function () {
            // A reservation takes no backlog place, so being swamped this
            // morning says nothing about next Thursday afternoon.
            await matcher.addUser({ id: 'u1', tags: ['gas-safe'], maxBacklogSize: 1 });
            await matcher.addAssignment({ id: 'now-1', tags: ['gas-safe'] });
            await matcher.matchUsersAssignments('u1');
            expect(await redisClient.sCard(`${prefix}user:u1:assignments`)).to.equal(1);

            await matcher.addAssignment(visit('a1'));
            expect(await matcher.processSlotBookings()).to.deep.equal({ booked: 1, unfillable: 0 });
        });
    });

    describe('the overlap rule', function () {
        it('refuses a second appointment on the same worker at the same hour', async function () {
            await matcher.addUser({ id: 'only', tags: ['gas-safe'] });
            await matcher.addAssignment(visit('a1'));
            await matcher.processSlotBookings();

            await matcher.addAssignment(visit('a2', THURSDAY_14 + 30 * MINUTE));
            const refused = await matcher.bookSlot('a2', 'only');
            expect(refused.booked).to.equal(false);
            expect(refused.booked === false && refused.refusal).to.deep.equal({
                reason: 'clash',
                clashingAssignmentId: 'a1',
            });
        });

        it('books the next eligible worker instead of the clashing one', async function () {
            await matcher.addUser({ id: 'first', tags: ['gas-safe'], routingWeights: { 'gas-safe': 90 } });
            await matcher.addUser({ id: 'second', tags: ['gas-safe'], routingWeights: { 'gas-safe': 10 } });
            await matcher.addAssignment(visit('a1'));
            await matcher.addAssignment(visit('a2', THURSDAY_14 + 30 * MINUTE));

            expect(await matcher.processSlotBookings()).to.deep.equal({ booked: 2, unfillable: 0 });
            expect((await matcher.getSlotBooking('a1'))?.userId).to.equal('first');
            expect((await matcher.getSlotBooking('a2'))?.userId).to.equal('second');
        });

        it('lets back-to-back appointments stand', async function () {
            // A job ending at 15:30 and the next starting at 15:30 is an
            // ordinary working day, not a clash.
            await matcher.addUser({ id: 'only', tags: ['gas-safe'] });
            await matcher.addAssignment(visit('a1'));
            await matcher.addAssignment(visit('a2', THURSDAY_14 + 90 * MINUTE));

            expect(await matcher.processSlotBookings()).to.deep.equal({ booked: 2, unfillable: 0 });
            expect((await matcher.getSlotBooking('a1'))?.userId).to.equal('only');
            expect((await matcher.getSlotBooking('a2'))?.userId).to.equal('only');
        });

        it('refuses to book the same assignment twice', async function () {
            await matcher.addUser({ id: 'u1', tags: ['gas-safe'] });
            await matcher.addUser({ id: 'u2', tags: ['gas-safe'] });
            await matcher.addAssignment(visit('a1'));
            await matcher.bookSlot('a1', 'u1');

            const second = await matcher.bookSlot('a1', 'u2');
            expect(second.booked).to.equal(false);
            expect(second.booked === false && second.refusal).to.deep.equal({
                reason: 'already-booked',
                holderId: 'u1',
            });
        });
    });

    describe('removing the booked worker', function () {
        it('drops their bookings so the sweep can book somebody else', async function () {
            await matcher.addUser({ id: 'u1', tags: ['gas-safe'] });
            await matcher.addAssignment(visit('a1'));
            await matcher.bookSlot('a1', 'u1');

            await matcher.removeUser('u1');

            expect(await matcher.getSlotBooking('a1')).to.equal(null);
            expect(await redisClient.exists(userBookings('u1'))).to.equal(0);
            // Back on the booking sweep, not dropped: the task is still slotted.
            expect(await redisClient.zScore(dueAtKey, 'a1')).to.not.equal(null);
            expect(kinds('slotBookingReleased').map((e) => [e.taskId, e.workerId, e.reason])).to.deep.equal([
                ['a1', 'u1', 'operator'],
            ]);
        });
    });

    describe('availability supplied by the host', function () {
        it('refuses a booking over an absence', async function () {
            await matcher.addUser({ id: 'u1', tags: ['gas-safe'] });
            await matcher.addAssignment(visit('a1'));
            availability = [
                {
                    userId: 'u1',
                    blocked: [{ from: THURSDAY_14 - HOUR, to: THURSDAY_14 + 4 * HOUR, reason: 'Annual leave' }],
                },
            ];

            const refused = await matcher.bookSlot('a1', 'u1');
            expect(refused.booked).to.equal(false);
            expect(refused.booked === false && refused.refusal).to.deep.equal({
                reason: 'unavailable',
                detail: 'Annual leave',
            });
            expect(await matcher.processSlotBookings()).to.deep.equal({ booked: 0, unfillable: 1 });
        });

        it('ignores an absence that does not reach the slot', async function () {
            await matcher.addUser({ id: 'u1', tags: ['gas-safe'] });
            await matcher.addAssignment(visit('a1'));
            availability = [
                { userId: 'u1', blocked: [{ from: THURSDAY_14 - 4 * HOUR, to: THURSDAY_14, reason: 'Morning off' }] },
            ];
            // Half-open: leave ending at 14:00 does not cover a 14:00 start.
            const result = await matcher.bookSlot('a1', 'u1');
            expect(result.booked).to.equal(true);
        });

        it('books over a soft conflict and records why', async function () {
            await matcher.addUser({ id: 'u1', tags: ['gas-safe'] });
            await matcher.addAssignment(visit('a1'));
            availability = [
                {
                    userId: 'u1',
                    warnings: [{ from: THURSDAY_14, to: THURSDAY_14 + HOUR, reason: 'Outside rostered shift' }],
                },
            ];

            expect(await matcher.processSlotBookings()).to.deep.equal({ booked: 1, unfillable: 0 });
            const booking = await matcher.getSlotBooking('a1');
            expect(booking?.warnings).to.deep.equal([
                { from: THURSDAY_14, to: THURSDAY_14 + HOUR, reason: 'Outside rostered shift' },
            ]);
            expect(kinds('slotBooked')[0].warnings).to.have.length(1);
        });

        it('lets an operator override an absence but never an overlap', async function () {
            await matcher.addUser({ id: 'u1', tags: ['gas-safe'] });
            await matcher.addAssignment(visit('a1'));
            await matcher.addAssignment(visit('a2', THURSDAY_14 + 30 * MINUTE));
            availability = [
                { userId: 'u1', blocked: [{ from: THURSDAY_14, to: THURSDAY_14 + 4 * HOUR, reason: 'Annual leave' }] },
            ];

            expect((await matcher.bookSlot('a1', 'u1', { force: true })).booked).to.equal(true);
            const clash = await matcher.bookSlot('a2', 'u1', { force: true });
            expect(clash.booked).to.equal(false);
            expect(clash.booked === false && clash.refusal.reason).to.equal('clash');
        });

        it('asks the host once per sweep, however many slots are due', async function () {
            // Fifty due slots and twenty workers must not be a thousand calls
            // into the leave service. One read over the union of every due
            // slot, shared by every ranking and every reservation in the pass.
            await matcher.addUser({ id: 'u1', tags: ['gas-safe'] });
            await matcher.addUser({ id: 'u2', tags: ['gas-safe'] });
            await matcher.addUser({ id: 'u3', tags: ['gas-safe'] });
            await matcher.addAssignment(visit('a1', THURSDAY_14));
            await matcher.addAssignment(visit('a2', THURSDAY_14 + 3 * HOUR));
            await matcher.addAssignment(visit('a3', THURSDAY_14 + DAY));
            availabilityCalls = [];

            expect(await matcher.processSlotBookings()).to.deep.equal({ booked: 3, unfillable: 0 });
            expect(availabilityCalls).to.have.length(1);
            // The one read spans the earliest start to the latest end.
            expect(availabilityCalls[0].from).to.equal(THURSDAY_14);
            expect(availabilityCalls[0].to).to.equal(THURSDAY_14 + DAY + 90 * MINUTE);
        });

        it('applies the pass-wide absence to every slot in it', async function () {
            // The one read has to be as good as a per-slot read would have been:
            // an absence covering the second slot must still refuse it.
            await matcher.addUser({ id: 'u1', tags: ['gas-safe'] });
            await matcher.addAssignment(visit('a1', THURSDAY_14));
            await matcher.addAssignment(visit('a2', THURSDAY_14 + DAY));
            availability = [
                {
                    userId: 'u1',
                    blocked: [{ from: THURSDAY_14 + DAY - HOUR, to: THURSDAY_14 + DAY + 4 * HOUR, reason: 'Leave' }],
                },
            ];
            expect(await matcher.processSlotBookings()).to.deep.equal({ booked: 1, unfillable: 1 });
            expect((await matcher.getSlotBooking('a1'))?.userId).to.equal('u1');
            expect(await matcher.getSlotBooking('a2')).to.equal(null);
        });

        it('asks the host once per pass, not once per candidate', async function () {
            await matcher.addUser({ id: 'u1', tags: ['gas-safe'] });
            await matcher.addUser({ id: 'u2', tags: ['gas-safe'] });
            await matcher.addUser({ id: 'u3', tags: ['gas-safe'] });
            await matcher.addAssignment(visit('a1'));
            availabilityCalls = [];

            await matcher.rankSlotCandidates('a1');
            expect(availabilityCalls).to.have.length(1);
            expect(availabilityCalls[0].userIds.sort()).to.deep.equal(['u1', 'u2', 'u3']);
        });
    });

    describe('activation', function () {
        it('hands the work to whoever holds the booking, as a pending offer', async function () {
            await matcher.addUser({ id: 'u1', tags: ['gas-safe'] });
            await matcher.addUser({ id: 'u2', tags: ['gas-safe'] });
            await matcher.addAssignment(visit('a1'));
            await matcher.bookSlot('a1', 'u2');

            clock.tick(THURSDAY_14 - MONDAY);
            await matcher.processScheduledAssignments();

            // Pending, not accepted: they have not agreed to anything yet.
            expect(await redisClient.hGet(`${prefix}assignments:pending:owner`, 'a1')).to.equal('u2');
            expect(await exists(`${prefix}assignments:accepted`, 'a1')).to.equal(false);
            expect(Boolean(await redisClient.sIsMember(`${prefix}user:u2:assignments`, 'assignment:a1'))).to.equal(true);
        });

        it('keeps the booking on the calendar while the work is live', async function () {
            // "This person's 14:00 is spoken for" is still true while they are
            // doing it, and keeping the row is what protects the hour.
            await matcher.addUser({ id: 'u1', tags: ['gas-safe'] });
            await matcher.addAssignment(visit('a1'));
            await matcher.bookSlot('a1', 'u1');

            clock.tick(THURSDAY_14 - MONDAY);
            await matcher.processScheduledAssignments();
            expect((await matcher.getSlotBooking('a1'))?.userId).to.equal('u1');
        });

        it('falls into the open pool when nobody was booked', async function () {
            await matcher.addUser({ id: 'plumber', tags: ['plumbing'] });
            await matcher.addAssignment(visit('a1'));

            clock.tick(THURSDAY_14 - MONDAY);
            await matcher.processScheduledAssignments();
            expect(await exists(refKey, 'a1')).to.equal(true);
            expect(await exists(scheduledKey, 'a1')).to.equal(false);
        });

        it('parks an unbooked slot when the policy says so', async function () {
            await matcher.addUser({ id: 'plumber', tags: ['plumbing'] });
            await matcher.addAssignment(visit('a1', THURSDAY_14, { slot: { onUnbooked: 'park' } }));

            clock.tick(THURSDAY_14 - MONDAY);
            await matcher.processScheduledAssignments();
            expect(await exists(parkedKey, 'a1')).to.equal(true);
            expect(await exists(refKey, 'a1')).to.equal(false);
        });

        it('drops an unbooked slot when the policy says so', async function () {
            await matcher.addUser({ id: 'plumber', tags: ['plumbing'] });
            await matcher.addAssignment(visit('a1', THURSDAY_14, { slot: { onUnbooked: 'drop' } }));

            clock.tick(THURSDAY_14 - MONDAY);
            await matcher.processScheduledAssignments();
            expect(await exists(parkedKey, 'a1')).to.equal(false);
            expect(await exists(refKey, 'a1')).to.equal(false);
        });

        it('honours an offer window that runs later than the slot', async function () {
            // An explicit notBefore can delay an appointment, never bring it
            // forward: the later of the two wins.
            await matcher.addUser({ id: 'u1', tags: ['gas-safe'] });
            await matcher.addAssignment(visit('a1', THURSDAY_14, { schedule: { notBefore: THURSDAY_14 + 2 * HOUR } }));

            clock.tick(THURSDAY_14 - MONDAY);
            await matcher.processScheduledAssignments();
            expect(await exists(scheduledKey, 'a1')).to.equal(true);

            clock.tick(2 * HOUR);
            await matcher.processScheduledAssignments();
            expect(await exists(refKey, 'a1')).to.equal(true);
        });
    });

    describe('a reservation is not live work', function () {
        it('occupies no backlog place and starts no clock before the slot', async function () {
            await matcher.addUser({ id: 'u1', tags: ['gas-safe'] });
            await matcher.addAssignment({
                id: 'a1',
                tags: ['gas-safe'],
                slot: { startAt: THURSDAY_14, durationMs: 90 * MINUTE },
                sla: { completeWithinMs: HOUR },
            });
            await matcher.bookSlot('a1', 'u1');

            expect(await redisClient.sCard(`${prefix}user:u1:assignments`)).to.equal(0);
            expect(await redisClient.zScore(`${prefix}assignments:accepted:expiry`, 'a1')).to.equal(null);
            expect(await redisClient.zScore(`${prefix}assignments:queuedAt`, 'a1')).to.equal(null);
        });
    });

    describe('handing a booking back', function () {
        it('releases the hour and does not hand the same job straight back', async function () {
            await matcher.addUser({ id: 'u1', tags: ['gas-safe'], routingWeights: { 'gas-safe': 90 } });
            await matcher.addUser({ id: 'u2', tags: ['gas-safe'], routingWeights: { 'gas-safe': 10 } });
            await matcher.addAssignment(visit('a1'));
            await matcher.processSlotBookings();
            expect((await matcher.getSlotBooking('a1'))?.userId).to.equal('u1');

            await matcher.handBackBooking('a1', 'u1', 'Car is off the road');
            expect(await matcher.getSlotBooking('a1')).to.equal(null);
            expect(await redisClient.zCard(userBookings('u1'))).to.equal(0);

            const released = kinds('slotBookingReleased');
            expect(released).to.have.length(1);
            expect(released[0].reason).to.equal('hand-back');
            expect(released[0].detail).to.equal('Car is off the road');

            // The next sweep must find somebody else, not the same person.
            expect(await matcher.processSlotBookings()).to.deep.equal({ booked: 1, unfillable: 0 });
            expect((await matcher.getSlotBooking('a1'))?.userId).to.equal('u2');
        });

        it('refuses to let somebody hand back an appointment that is not theirs', async function () {
            await matcher.addUser({ id: 'u1', tags: ['gas-safe'] });
            await matcher.addUser({ id: 'u2', tags: ['gas-safe'] });
            await matcher.addAssignment(visit('a1'));
            await matcher.bookSlot('a1', 'u1');

            let error: Error | null = null;
            await matcher.handBackBooking('a1', 'u2').catch((err) => {
                error = err;
            });
            expect(error).to.be.instanceOf(Error);
            expect((await matcher.getSlotBooking('a1'))?.userId).to.equal('u1');
        });
    });

    describe('terminal transitions clear the calendar', function () {
        const bookAndActivate = async () => {
            await matcher.addUser({ id: 'u1', tags: ['gas-safe'] });
            await matcher.addAssignment(visit('a1'));
            await matcher.bookSlot('a1', 'u1');
            clock.tick(THURSDAY_14 - MONDAY);
            await matcher.processScheduledAssignments();
            await matcher.acceptAssignment('u1', 'a1');
        };

        it('clears the booking when the work is completed', async function () {
            await bookAndActivate();
            await matcher.completeAssignment('u1', 'a1');

            expect(await matcher.getSlotBooking('a1')).to.equal(null);
            expect(await redisClient.zCard(userBookings('u1'))).to.equal(0);
            expect(await exists(spansKey, 'a1')).to.equal(false);
            expect(kinds('slotBookingReleased').map((e) => e.reason)).to.deep.equal(['terminal']);
        });

        it('clears the booking when the work is failed', async function () {
            await bookAndActivate();
            await matcher.failAssignment('u1', 'a1', 'No access');
            expect(await matcher.getSlotBooking('a1')).to.equal(null);
            expect(await redisClient.zCard(userBookings('u1'))).to.equal(0);
        });

        it('clears the booking when the task is removed', async function () {
            await matcher.addUser({ id: 'u1', tags: ['gas-safe'] });
            await matcher.addAssignment(visit('a1'));
            await matcher.bookSlot('a1', 'u1');

            await matcher.removeAssignment('a1');
            expect(await exists(bookingsKey, 'a1')).to.equal(false);
            expect(await exists(spansKey, 'a1')).to.equal(false);
            expect(await redisClient.zCard(userBookings('u1'))).to.equal(0);
            expect(await redisClient.zScore(dueAtKey, 'a1')).to.equal(null);
        });
    });

    describe('the calendar read', function () {
        beforeEach(async function () {
            await matcher.addUser({ id: 'u1', tags: ['gas-safe'] });
            await matcher.addUser({ id: 'u2', tags: ['gas-safe'] });
            await matcher.addAssignment(visit('morning', THURSDAY_14 - 4 * HOUR));
            await matcher.addAssignment(visit('afternoon', THURSDAY_14));
            await matcher.addAssignment(visit('friday', THURSDAY_14 + DAY));
            await matcher.bookSlot('morning', 'u1');
            await matcher.bookSlot('afternoon', 'u1');
            await matcher.bookSlot('friday', 'u2');
        });

        it("returns one worker's day in order", async function () {
            const day = await matcher.getBookings({
                from: THURSDAY_14 - 14 * HOUR,
                to: THURSDAY_14 + 10 * HOUR,
                userId: 'u1',
            });
            expect(day.map((b) => b.assignmentId)).to.deep.equal(['morning', 'afternoon']);
        });

        it('leaves out another worker booked inside the same window', async function () {
            // The window alone must not be what separates two people's days:
            // a read filtered to one worker that answers with somebody else's
            // appointment is how a planner books over a colleague.
            await matcher.addAssignment(visit('overlapping', THURSDAY_14 + 30 * MINUTE));
            await matcher.bookSlot('overlapping', 'u2');

            const day = await matcher.getBookings({
                from: THURSDAY_14 - 14 * HOUR,
                to: THURSDAY_14 + 10 * HOUR,
                userId: 'u1',
            });
            expect(day.map((b) => b.assignmentId)).to.deep.equal(['morning', 'afternoon']);
        });

        it('returns the whole team when no worker is named', async function () {
            const all = await matcher.getBookings({ from: THURSDAY_14 - DAY, to: THURSDAY_14 + 2 * DAY });
            expect(all.map((b) => b.assignmentId)).to.deep.equal(['morning', 'afternoon', 'friday']);
        });

        it('leaves out an appointment that ends exactly as the window opens', async function () {
            const after = await matcher.getBookings({
                from: THURSDAY_14 - 4 * HOUR + 90 * MINUTE,
                to: THURSDAY_14 + HOUR,
                userId: 'u1',
            });
            expect(after.map((b) => b.assignmentId)).to.deep.equal(['afternoon']);
        });
    });

    describe('ranking candidates for the planner', function () {
        it('puts bookable people first and says why the others are not', async function () {
            await matcher.addUser({ id: 'busy', tags: ['gas-safe'], routingWeights: { 'gas-safe': 90 } });
            await matcher.addUser({ id: 'free', tags: ['gas-safe'], routingWeights: { 'gas-safe': 50 } });
            await matcher.addUser({ id: 'wrong-trade', tags: ['plumbing'] });
            await matcher.addAssignment(visit('other'));
            await matcher.addAssignment(visit('a1', THURSDAY_14 + 30 * MINUTE));
            await matcher.bookSlot('other', 'busy');

            const ranked = await matcher.rankSlotCandidates('a1');
            expect(ranked[0].userId).to.equal('free');
            expect(ranked[0].bookable).to.equal(true);

            const busy = ranked.find((c) => c.userId === 'busy')!;
            expect(busy.bookable).to.equal(false);
            expect(busy.clashingAssignmentId).to.equal('other');

            const wrong = ranked.find((c) => c.userId === 'wrong-trade')!;
            expect(wrong.bookable).to.equal(false);
        });
    });

    describe('the maintenance tick', function () {
        it('books and then activates in one pass', async function () {
            await matcher.addUser({ id: 'u1', tags: ['gas-safe'] });
            await matcher.addAssignment(visit('a1', MONDAY + MINUTE, { slot: { bookAheadMs: HOUR } }));

            clock.tick(MINUTE);
            const report = await matcher.runMaintenanceOnce();
            expect(report.slotsBooked).to.equal(1);
            expect(report.scheduleActivations).to.equal(1);
            expect(await redisClient.hGet(`${prefix}assignments:pending:owner`, 'a1')).to.equal('u1');
        });
    });
});

describe('Timeslots — edges and failure modes', function () {
    this.timeout(20000);
    let matcher: Matcher;
    let redisClient: any;
    let clock: sinon.SinonFakeTimers;
    let availability: () => Promise<SlotAvailability[]> = async () => [];
    const prefix = 'slots_edge_test:';
    const MONDAY = Date.parse('2026-10-05T08:00:00Z');
    const THURSDAY_14 = Date.parse('2026-10-08T14:00:00Z');
    const visit = (id: string, startAt = THURSDAY_14) => ({
        id,
        tags: ['gas-safe'],
        slot: { startAt, durationMs: 90 * MINUTE },
    });

    before(async function () {
        redisClient = createTestClient();
        await redisClient.connect();
        matcher = new Matcher(redisClient, {
            redisPrefix: prefix,
            slotAvailability: () => availability(),
        });
        await matcher.waitUntilReady();
    });

    beforeEach(async function () {
        await redisClient.flushDb();
        availability = async () => [];
        clock = sinon.useFakeTimers({ now: MONDAY, toFake: ['Date'] });
    });

    afterEach(function () {
        clock.restore();
    });

    after(async function () {
        matcher.stopMaintenance();
        await redisClient.quit();
    });

    const rejects = async (promise: Promise<unknown>, fragment: string) => {
        let error: Error | null = null;
        await promise.catch((err) => {
            error = err;
        });
        expect(error, `expected a rejection mentioning "${fragment}"`).to.be.instanceOf(Error);
        expect(String(error)).to.contain(fragment);
    };

    it('refuses to book somebody who does not exist', async function () {
        await matcher.addAssignment(visit('a1'));
        await rejects(matcher.bookSlot('a1', 'ghost'), 'User not found');
    });

    it('refuses to book a task that has no slot', async function () {
        await matcher.addUser({ id: 'u1', tags: ['gas-safe'] });
        await matcher.addAssignment({ id: 'plain', tags: ['gas-safe'] });
        await matcher.addAssignment({ id: 'held', tags: ['gas-safe'], schedule: { notBefore: THURSDAY_14 } });
        await rejects(matcher.bookSlot('plain', 'u1'), 'not a slotted assignment');
        await rejects(matcher.bookSlot('held', 'u1'), 'not a slotted assignment');
        await rejects(matcher.rankSlotCandidates('plain'), 'not a slotted assignment');
    });

    it('answers null for release and hand-back of a task nobody holds', async function () {
        await matcher.addUser({ id: 'u1', tags: ['gas-safe'] });
        await matcher.addAssignment(visit('a1'));
        expect(await matcher.releaseSlotBooking('a1')).to.equal(null);
        expect(await matcher.handBackBooking('a1', 'u1')).to.equal(null);
        expect(await matcher.getSlotBooking('a1')).to.equal(null);
    });

    it('lets a planner rebook by releasing and booking somebody else', async function () {
        await matcher.addUser({ id: 'u1', tags: ['gas-safe'] });
        await matcher.addUser({ id: 'u2', tags: ['gas-safe'] });
        await matcher.addAssignment(visit('a1'));
        await matcher.bookSlot('a1', 'u1');

        const released = await matcher.releaseSlotBooking('a1');
        expect(released?.userId).to.equal('u1');
        // Back in the sweep's index: an operator release is not a hand-back,
        // so u1 stays eligible and the sweep would simply pick the best again.
        expect(await redisClient.zScore(`${prefix}assignments:bookings:dueAt`, 'a1')).to.not.equal(null);

        expect((await matcher.bookSlot('a1', 'u2')).booked).to.equal(true);
        expect((await matcher.getSlotBooking('a1'))?.userId).to.equal('u2');
    });

    it('books nobody and keeps the slot indexed when the host cannot answer', async function () {
        await matcher.addUser({ id: 'u1', tags: ['gas-safe'] });
        await matcher.addAssignment(visit('a1'));
        availability = async () => {
            throw new Error('leave service down');
        };

        await rejects(matcher.processSlotBookings(), 'leave service down');
        expect(await matcher.getSlotBooking('a1')).to.equal(null);
        // Restored, so the next pass tries again rather than forgetting it.
        expect(await redisClient.zScore(`${prefix}assignments:bookings:dueAt`, 'a1')).to.not.equal(null);
    });

    it('ranks nobody when there is nobody', async function () {
        await matcher.addAssignment(visit('a1'));
        expect(await matcher.rankSlotCandidates('a1')).to.deep.equal([]);
        expect(await matcher.processSlotBookings()).to.deep.equal({ booked: 0, unfillable: 1 });
    });

    it('reads an empty calendar as empty', async function () {
        expect(await matcher.getBookings({ from: MONDAY, to: THURSDAY_14 })).to.deep.equal([]);
        expect(await matcher.getBookings({ from: MONDAY, to: THURSDAY_14, userId: 'nobody' })).to.deep.equal([]);
    });

    it('skips a slot an operator force-activated before the sweep reached it', async function () {
        await matcher.addUser({ id: 'u1', tags: ['gas-safe'] });
        await matcher.addAssignment(visit('a1'));
        await matcher.assignToUser('a1', 'u1', { force: true });

        expect(await matcher.processSlotBookings()).to.deep.equal({ booked: 0, unfillable: 0 });
        expect(await matcher.getSlotBooking('a1')).to.equal(null);
        expect(await redisClient.zScore(`${prefix}assignments:bookings:dueAt`, 'a1')).to.equal(null);
    });

    it('reloads the booking script after a NOSCRIPT instead of failing', async function () {
        await matcher.addUser({ id: 'u1', tags: ['gas-safe'] });
        await matcher.addAssignment(visit('a1'));
        await redisClient.scriptFlush();
        expect((await matcher.bookSlot('a1', 'u1')).booked).to.equal(true);
    });
});
