import { expect } from 'chai';
import {
    DEFAULT_BOOK_AHEAD_MS,
    bookingOpensAt,
    normalizeSlot,
    slotEndsAt,
    slotFromJson,
    slotsOverlap,
} from '../src/schedule/slot';

const HOUR = 60 * 60 * 1000;
const at = (h: number) => Date.parse('2026-10-01T00:00:00Z') + h * HOUR;

describe('slot policy (pure)', () => {
    describe('normalizeSlot', () => {
        it('resolves the defaults', () => {
            const slot = normalizeSlot({ startAt: at(14), durationMs: 90 * 60_000 });
            expect(slot).to.deep.equal({
                startAt: at(14),
                durationMs: 90 * 60_000,
                bookAheadMs: DEFAULT_BOOK_AHEAD_MS,
                onUnbooked: 'queue',
            });
        });

        it('keeps a caller-supplied book-ahead and onUnbooked', () => {
            const slot = normalizeSlot({
                startAt: at(14),
                durationMs: HOUR,
                bookAheadMs: 2 * 24 * HOUR,
                onUnbooked: 'park',
            });
            expect(slot?.bookAheadMs).to.equal(2 * 24 * HOUR);
            expect(slot?.onUnbooked).to.equal('park');
        });

        it('treats an unusable slot as no slot at all', () => {
            // A zero-length appointment is not an appointment, and a negative
            // one is a data error. Both must leave the assignment on the
            // untouched legacy path rather than half-booking it.
            expect(normalizeSlot(undefined)).to.equal(null);
            expect(normalizeSlot(null)).to.equal(null);
            expect(normalizeSlot({ startAt: at(14), durationMs: 0 })).to.equal(null);
            expect(normalizeSlot({ startAt: at(14), durationMs: -HOUR })).to.equal(null);
            expect(normalizeSlot({ startAt: 0, durationMs: HOUR })).to.equal(null);
            expect(normalizeSlot({ startAt: Number.NaN, durationMs: HOUR })).to.equal(null);
            expect(normalizeSlot({ startAt: at(14), durationMs: Number.POSITIVE_INFINITY })).to.equal(null);
        });

        it('falls back to the default book-ahead for an unusable one', () => {
            expect(normalizeSlot({ startAt: at(14), durationMs: HOUR, bookAheadMs: -1 })?.bookAheadMs).to.equal(
                DEFAULT_BOOK_AHEAD_MS,
            );
            expect(normalizeSlot({ startAt: at(14), durationMs: HOUR, bookAheadMs: 0 })?.bookAheadMs).to.equal(
                DEFAULT_BOOK_AHEAD_MS,
            );
        });

        it('rejects an unknown onUnbooked rather than guessing', () => {
            expect(normalizeSlot({ startAt: at(14), durationMs: HOUR, onUnbooked: 'explode' as any })?.onUnbooked).to.equal(
                'queue',
            );
        });
    });

    describe('slotEndsAt', () => {
        it('is the start plus the duration', () => {
            expect(slotEndsAt(normalizeSlot({ startAt: at(14), durationMs: 90 * 60_000 })!)).to.equal(at(15.5));
        });
    });

    describe('slotsOverlap', () => {
        const span = (from: number, to: number) => ({ startAt: from, endAt: to });

        it('sees a genuine overlap', () => {
            expect(slotsOverlap(span(at(14), at(16)), span(at(15), at(17)))).to.equal(true);
            expect(slotsOverlap(span(at(15), at(17)), span(at(14), at(16)))).to.equal(true);
        });

        it('sees containment in both directions', () => {
            expect(slotsOverlap(span(at(14), at(18)), span(at(15), at(16)))).to.equal(true);
            expect(slotsOverlap(span(at(15), at(16)), span(at(14), at(18)))).to.equal(true);
        });

        it('lets back-to-back slots stand', () => {
            // Half-open [start, end): a job ending at 15:00 and the next
            // starting at 15:00 is an ordinary working day, not a clash.
            expect(slotsOverlap(span(at(14), at(15)), span(at(15), at(16)))).to.equal(false);
            expect(slotsOverlap(span(at(15), at(16)), span(at(14), at(15)))).to.equal(false);
        });

        it('leaves distant slots alone', () => {
            expect(slotsOverlap(span(at(9), at(10)), span(at(14), at(15)))).to.equal(false);
        });
    });

    describe('bookingOpensAt', () => {
        it('is the slot start less the book-ahead', () => {
            const slot = normalizeSlot({ startAt: at(14 * 24), durationMs: HOUR })!;
            expect(bookingOpensAt(slot)).to.equal(at(14 * 24) - DEFAULT_BOOK_AHEAD_MS);
        });

        it('never reaches back before the epoch for a slot inside the horizon', () => {
            const slot = normalizeSlot({ startAt: 1_000, durationMs: HOUR })!;
            expect(bookingOpensAt(slot)).to.equal(0);
        });
    });

    describe('slotFromJson', () => {
        it('reads a slot back out of stored JSON', () => {
            const json = JSON.stringify({ id: 'a', tags: [], slot: { startAt: at(14), durationMs: HOUR } });
            expect(slotFromJson(json)?.startAt).to.equal(at(14));
        });

        it('costs one indexOf for the assignments that have none', () => {
            expect(slotFromJson(JSON.stringify({ id: 'a', tags: [] }))).to.equal(null);
            expect(slotFromJson(null)).to.equal(null);
            expect(slotFromJson(undefined)).to.equal(null);
        });

        it('survives malformed JSON', () => {
            expect(slotFromJson('{"slot":')).to.equal(null);
        });
    });
});
