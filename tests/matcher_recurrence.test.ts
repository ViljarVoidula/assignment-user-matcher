import Matcher from '../src/matcher.class';
import { createTestClient } from './helpers/redis';
import { expect } from 'chai';
import sinon from 'sinon';
import type { AssignmentLifecycleEvent, RecurrencePolicy } from '../src/types/matcher';

describe('Recurring assignments', function () {
    this.timeout(20000);
    let matcher: Matcher;
    let redisClient: any;
    let events: AssignmentLifecycleEvent[] = [];
    let clock: sinon.SinonFakeTimers;
    const prefix = 'recurrence_test:';

    before(async function () {
        redisClient = createTestClient();
        await redisClient.connect();

        matcher = new Matcher(redisClient, {
            redisPrefix: prefix,
            maxUserBacklogSize: 10,
            relevantBatchSize: 50,
            matchExpirationMs: 60000,
            onAssignmentLifecycle: (event) => events.push(event),
        });
        await matcher.waitUntilReady();
    });

    beforeEach(async function () {
        await redisClient.flushDb();
        events = [];
        // Recurrence clocks are Date.now()-scored zsets: fake Date lets tests
        // fast-forward past slots instead of sleeping in real time.
        clock = sinon.useFakeTimers({ now: Date.now(), toFake: ['Date'] });
    });

    afterEach(function () {
        clock.restore();
    });

    after(async function () {
        matcher.stopMaintenance();
        await redisClient.quit();
    });

    const kinds = (kind: AssignmentLifecycleEvent['kind']) => events.filter((e) => e.kind === kind);
    const refKey = `${prefix}assignments:ref`;
    const scheduledKey = `${prefix}assignments:scheduled`;
    const recurringKey = `${prefix}assignments:recurring`;
    const dueAtKey = `${prefix}assignments:recurring:dueAt`;
    const parkedKey = `${prefix}assignments:parked`;

    const EVERY = 10_000;
    const template = (recurrence: RecurrencePolicy, extra: Record<string, unknown> = {}) => ({
        id: 'rec',
        tags: ['t'],
        recurrence,
        ...extra,
    });

    describe('materialization', function () {
        it('materializes a future first occurrence ahead of its window and holds it scheduled', async function () {
            const startAt = Date.now() + 6_000;
            await matcher.addRecurringAssignment(template({ everyMs: EVERY, startAt }));

            const result = await matcher.processRecurringAssignments();
            expect(result.materialized).to.equal(1);

            // The occurrence is an ordinary held assignment; the template never queues.
            expect(await redisClient.hGet(scheduledKey, `rec@${startAt}`)).to.be.a('string');
            expect(await redisClient.hGet(refKey, `rec@${startAt}`)).to.be.null;
            expect(await redisClient.hGet(refKey, 'rec')).to.be.null;

            const record = await matcher.getRecurringAssignment('rec');
            expect(record).to.not.be.null;
            expect(record!.occurrences).to.equal(1);
            expect(record!.nextAt).to.equal(startAt + EVERY);
        });

        it('keeps one occurrence ahead: a due-now start cuts the current and the next slot', async function () {
            const t0 = Date.now();
            await matcher.addRecurringAssignment(template({ everyMs: EVERY }));

            const result = await matcher.processRecurringAssignments();
            expect(result.materialized).to.equal(2);

            // Slot t0 opened already, so it enqueued directly; slot t0+EVERY is held.
            expect(await redisClient.hGet(refKey, `rec@${t0}`)).to.be.a('string');
            expect(await redisClient.hGet(scheduledKey, `rec@${t0 + EVERY}`)).to.be.a('string');
        });

        it('a second sweep is a no-op until the next slot comes due', async function () {
            await matcher.addRecurringAssignment(template({ everyMs: EVERY }));
            await matcher.processRecurringAssignments();

            expect((await matcher.processRecurringAssignments()).materialized).to.equal(0);

            clock.tick(EVERY + 1);
            const later = await matcher.processRecurringAssignments();
            expect(later.materialized).to.equal(1);
        });

        it('occurrences inherit the template and carry their own derived offer window', async function () {
            const startAt = Date.now() + 5_000;
            await matcher.addRecurringAssignment(
                template(
                    { everyMs: EVERY, startAt, windowMs: 3_000, onMiss: 'drop' },
                    { priority: 7, sla: { maxRejections: 2 } },
                ),
            );
            await matcher.processRecurringAssignments();

            const occurrence = JSON.parse(await redisClient.hGet(scheduledKey, `rec@${startAt}`));
            expect(occurrence.tags).to.deep.equal(['t']);
            expect(occurrence.priority).to.equal(7);
            expect(occurrence.sla).to.deep.equal({ maxRejections: 2 });
            expect(occurrence.recurrence).to.equal(undefined);
            expect(occurrence.schedule).to.deep.equal({
                notBefore: startAt,
                notAfter: startAt + 3_000,
                onMiss: 'drop',
            });
        });

        it('an activated occurrence matches like any other assignment', async function () {
            const startAt = Date.now() + 5_000;
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addRecurringAssignment(template({ everyMs: EVERY, startAt }));
            await matcher.processRecurringAssignments();

            // Held: nothing to match yet.
            await matcher.matchUsersAssignments();
            expect(await redisClient.sCard(`${prefix}user:u1:assignments`)).to.equal(0);

            clock.tick(5_001);
            await matcher.processScheduledAssignments();
            await matcher.matchUsersAssignments();
            const members = await redisClient.sMembers(`${prefix}user:u1:assignments`);
            expect(members).to.deep.equal([`assignment:rec@${startAt}`]);
        });

        it('emits recurrenceMaterialized with the template link and slot', async function () {
            const startAt = Date.now() + 5_000;
            await matcher.addRecurringAssignment(template({ everyMs: EVERY, startAt }));
            await matcher.processRecurringAssignments();

            const emitted = kinds('recurrenceMaterialized');
            expect(emitted).to.have.length(1);
            expect(emitted[0]).to.include({
                taskId: `rec@${startAt}`,
                recurringId: 'rec',
                occurrence: 1,
                opensAt: startAt,
            });
        });
    });

    describe('catch-up after downtime', function () {
        it("'skip' with a window skips every stale slot without burning the budget", async function () {
            const t0 = Date.now();
            await matcher.addRecurringAssignment(
                template({ everyMs: EVERY, startAt: t0, windowMs: 3_000, maxOccurrences: 10 }),
            );

            // Host dead for 3.5 intervals: slots t0..t0+30s all closed their windows.
            clock.tick(35_000);
            const result = await matcher.processRecurringAssignments();
            expect(result.materialized).to.equal(1);

            expect(await redisClient.hGet(scheduledKey, `rec@${t0 + 40_000}`)).to.be.a('string');
            const record = await matcher.getRecurringAssignment('rec');
            expect(record!.occurrences).to.equal(1); // skipped slots never counted
        });

        it("'skip' without a window resumes with the newest past slot", async function () {
            const t0 = Date.now();
            await matcher.addRecurringAssignment(template({ everyMs: EVERY, startAt: t0 }));

            clock.tick(35_000);
            const result = await matcher.processRecurringAssignments();
            expect(result.materialized).to.equal(2);

            // Newest past slot enqueued now; the next future slot held.
            expect(await redisClient.hGet(refKey, `rec@${t0 + 30_000}`)).to.be.a('string');
            expect(await redisClient.hGet(scheduledKey, `rec@${t0 + 40_000}`)).to.be.a('string');
            expect(await redisClient.hGet(refKey, `rec@${t0}`)).to.be.null;
        });

        it("'all' materializes every elapsed slot; closed windows are then missed and parked", async function () {
            const t0 = Date.now();
            await matcher.addRecurringAssignment(
                template({ everyMs: EVERY, startAt: t0, windowMs: 3_000, catchUp: 'all' }),
            );

            clock.tick(35_000);
            const result = await matcher.processRecurringAssignments();
            // Slots t0 .. t0+40s: five, one per interval boundary within the horizon.
            expect(result.materialized).to.equal(5);

            const sweep = await matcher.processScheduledAssignments();
            expect(sweep.missed).to.equal(4); // t0..t0+30s windows all closed
            expect(await redisClient.hLen(parkedKey)).to.equal(4);
            expect(kinds('scheduleMissed')).to.have.length(4);
            // The future slot survives, held.
            expect(await redisClient.hGet(scheduledKey, `rec@${t0 + 40_000}`)).to.be.a('string');
        });
    });

    describe('bounds and retirement', function () {
        it('maxOccurrences retires the template after the final batch', async function () {
            const t0 = Date.now();
            await matcher.addRecurringAssignment(template({ everyMs: EVERY, maxOccurrences: 2 }));

            const result = await matcher.processRecurringAssignments();
            expect(result.materialized).to.equal(2);
            expect(result.retired).to.equal(1);

            expect(await matcher.getRecurringAssignment('rec')).to.be.null;
            expect(await redisClient.zCard(dueAtKey)).to.equal(0);
            const retiredEvents = kinds('recurrenceRetired');
            expect(retiredEvents).to.have.length(1);
            expect(retiredEvents[0]).to.include({ recurringId: 'rec', reason: 'maxOccurrences', occurrences: 2 });

            // Nothing further, ever.
            clock.tick(EVERY * 5);
            expect((await matcher.processRecurringAssignments()).materialized).to.equal(0);
            expect(await redisClient.hGet(refKey, `rec@${t0}`)).to.be.a('string');
        });

        it('until retires the template once no slot fits before it', async function () {
            const t0 = Date.now();
            await matcher.addRecurringAssignment(template({ everyMs: EVERY, startAt: t0, until: t0 + 15_000 }));

            const result = await matcher.processRecurringAssignments();
            expect(result.materialized).to.equal(2); // t0 and t0+10s; t0+20s is past until
            expect(result.retired).to.equal(1);
            expect(kinds('recurrenceRetired')[0]).to.include({ reason: 'until' });
            expect(await matcher.getRecurringAssignment('rec')).to.be.null;
        });

        it('refuses an unusable policy outright', async function () {
            for (const recurrence of [
                { everyMs: 0 },
                { everyMs: 500 },
                {} as RecurrencePolicy,
                { everyMs: EVERY, startAt: Date.now() + 10_000, until: Date.now() },
            ]) {
                try {
                    await matcher.addRecurringAssignment(template(recurrence as RecurrencePolicy));
                    expect.fail('should have thrown');
                } catch (err) {
                    expect((err as Error).message).to.contain('recurrence');
                }
            }
            expect(await redisClient.hLen(recurringKey)).to.equal(0);
        });
    });

    describe('times per interval', function () {
        it('spreads N occurrences evenly across one everyMs period', async function () {
            const t0 = Date.now();
            await matcher.addRecurringAssignment(template({ everyMs: EVERY, times: 2, startAt: t0 }));

            const result = await matcher.processRecurringAssignments();
            // Horizon is one gap ahead, and the gap is EVERY/2: slots t0 and t0+5s.
            expect(result.materialized).to.equal(2);
            expect(await redisClient.hGet(refKey, `rec@${t0}`)).to.be.a('string');
            expect(await redisClient.hGet(scheduledKey, `rec@${t0 + 5_000}`)).to.be.a('string');

            // The next period continues the same cadence rather than jumping a whole period.
            clock.tick(5_000);
            await matcher.processRecurringAssignments();
            expect(await redisClient.hGet(scheduledKey, `rec@${t0 + 10_000}`)).to.be.a('string');
            expect((await matcher.getRecurringAssignment('rec'))!.occurrences).to.equal(3);
        });

        it('times: 1 and an omitted times are the same template', async function () {
            const t0 = Date.now();
            await matcher.addRecurringAssignment(template({ everyMs: EVERY, times: 1, startAt: t0 }));
            const withTimes = await matcher.processRecurringAssignments();
            const explicit = await redisClient.hGet(scheduledKey, `rec@${t0 + EVERY}`);

            await redisClient.flushDb();
            await matcher.addRecurringAssignment(template({ everyMs: EVERY, startAt: t0 }));
            const without = await matcher.processRecurringAssignments();

            expect(withTimes.materialized).to.equal(without.materialized);
            expect(await redisClient.hGet(scheduledKey, `rec@${t0 + EVERY}`)).to.equal(explicit);
        });

        it('refuses a times that cuts the gap below the minimum', async function () {
            try {
                await matcher.addRecurringAssignment(template({ everyMs: 2_000, times: 3 }));
                expect.fail('should have thrown');
            } catch (err) {
                expect((err as Error).message).to.contain('recurrence');
            }
            expect(await redisClient.hLen(recurringKey)).to.equal(0);
        });

        it("'skip' after downtime resumes on the next live sub-slot, not the period boundary", async function () {
            const t0 = Date.now();
            await matcher.addRecurringAssignment(template({ everyMs: EVERY, times: 2, startAt: t0, windowMs: 1_000 }));

            // Gap is 5s; slots t0..t0+10s have all closed their 1s windows by t0+12s.
            clock.tick(12_000);
            const result = await matcher.processRecurringAssignments();
            expect(result.materialized).to.equal(1);
            expect(await redisClient.hGet(scheduledKey, `rec@${t0 + 15_000}`)).to.be.a('string');
            expect((await matcher.getRecurringAssignment('rec'))!.occurrences).to.equal(1);
        });

        it('maxOccurrences can retire a template part-way through a period', async function () {
            const t0 = Date.now();
            await matcher.addRecurringAssignment(template({ everyMs: EVERY, times: 2, startAt: t0, maxOccurrences: 3 }));

            // First period's pair: t0 and t0+5s, well inside the budget.
            expect((await matcher.processRecurringAssignments()).materialized).to.equal(2);

            // The third occurrence opens the second period and exhausts the
            // budget there, so the period's own second slot is never cut.
            clock.tick(5_000);
            const result = await matcher.processRecurringAssignments();
            expect(result.materialized).to.equal(1);
            expect(result.retired).to.equal(1);
            expect(kinds('recurrenceRetired')[0]).to.include({ reason: 'maxOccurrences' });
            expect(await redisClient.hGet(scheduledKey, `rec@${t0 + 10_000}`)).to.be.a('string');
            expect(await redisClient.hGet(scheduledKey, `rec@${t0 + 15_000}`)).to.be.null;
        });
    });

    describe('lifecycle of the template', function () {
        it('remove stops future occurrences; dropScheduled also clears the held one', async function () {
            const t0 = Date.now();
            await matcher.addRecurringAssignment(template({ everyMs: EVERY }));
            await matcher.processRecurringAssignments();

            // Occurrence t0 queued, t0+EVERY held.
            expect(await matcher.removeRecurringAssignment('rec', { dropScheduled: true })).to.equal(true);
            expect(await matcher.getRecurringAssignment('rec')).to.be.null;
            expect(await redisClient.hGet(scheduledKey, `rec@${t0 + EVERY}`)).to.be.null;
            // Already-queued work is never touched.
            expect(await redisClient.hGet(refKey, `rec@${t0}`)).to.be.a('string');

            clock.tick(EVERY * 3);
            expect((await matcher.processRecurringAssignments()).materialized).to.equal(0);

            expect(await matcher.removeRecurringAssignment('rec')).to.equal(false);
        });

        it('re-adding an existing id updates the template but keeps its clock', async function () {
            await matcher.addRecurringAssignment(template({ everyMs: EVERY }));
            await matcher.processRecurringAssignments();
            const before = await matcher.getRecurringAssignment('rec');
            expect(before!.occurrences).to.equal(2);

            await matcher.addRecurringAssignment(template({ everyMs: EVERY }, { priority: 9 }));
            const after = await matcher.getRecurringAssignment('rec');
            expect(after!.occurrences).to.equal(2);
            expect(after!.nextAt).to.equal(before!.nextAt);
            expect(after!.template.priority).to.equal(9);

            // The next occurrence carries the updated template.
            clock.tick(EVERY + 1);
            await matcher.processRecurringAssignments();
            const occurrence = JSON.parse(await redisClient.hGet(scheduledKey, `rec@${after!.nextAt}`));
            expect(occurrence.priority).to.equal(9);
        });

        it('lists templates soonest-first', async function () {
            const t0 = Date.now();
            await matcher.addRecurringAssignment(template({ everyMs: EVERY, startAt: t0 + 50_000 }, { id: 'later' }));
            await matcher.addRecurringAssignment(template({ everyMs: EVERY, startAt: t0 + 5_000 }, { id: 'sooner' }));
            const listed = await matcher.listRecurringAssignments();
            expect(listed.map((r) => r.template.id)).to.deep.equal(['sooner', 'later']);
        });

        it('self-heals a template that fell out of the due index', async function () {
            const startAt = Date.now() + 5_000;
            await matcher.addRecurringAssignment(template({ everyMs: EVERY, startAt }));
            // Simulate a sweep that crashed between its claim and its state write.
            await redisClient.zRem(dueAtKey, 'rec');

            const result = await matcher.processRecurringAssignments();
            expect(result.materialized).to.equal(1);
            expect(await redisClient.hGet(scheduledKey, `rec@${startAt}`)).to.be.a('string');
        });
    });

    describe('maintenance integration', function () {
        it('runMaintenanceOnce runs the recurrence sweep and reports it', async function () {
            await matcher.addRecurringAssignment(template({ everyMs: EVERY, maxOccurrences: 2 }));

            const report = await matcher.runMaintenanceOnce();
            expect(report.recurrenceMaterializations).to.equal(2);
            expect(report.recurrenceRetirements).to.equal(1);
        });

        it('a due occurrence flows recurrence → schedule → queue in one tick', async function () {
            const startAt = Date.now() + 1_000;
            await matcher.addRecurringAssignment(template({ everyMs: EVERY, startAt }));
            await matcher.processRecurringAssignments();

            clock.tick(1_001);
            const report = await matcher.runMaintenanceOnce();
            expect(report.scheduleActivations).to.equal(1);
            expect(await redisClient.hGet(refKey, `rec@${startAt}`)).to.be.a('string');
        });

        it('can be disabled per pass', async function () {
            await matcher.addRecurringAssignment(template({ everyMs: EVERY }));
            const report = await matcher.runMaintenanceOnce({ recurrence: false });
            expect(report.recurrenceMaterializations).to.equal(0);
            expect(await redisClient.hLen(scheduledKey)).to.equal(0);
        });
    });
});
