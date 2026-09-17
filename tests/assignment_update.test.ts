import { expect } from 'chai';
import { applyUpdate, consumeOfferWindow, diffTagIndexes, normalizeUpdateTags } from '../src/updates/assignment-update';
import type { Assignment } from '../src/types/matcher';

/**
 * The decisions behind a task edit, tested without Redis.
 *
 * `matcher_task_update.test.ts` covers what the engine does with these answers;
 * this covers the answers themselves — which index writes a retag implies, and
 * whether the person holding the work still matches it.
 */
describe('Task update (pure)', function () {
    const task = (over: Partial<Assignment> = {}): Assignment => ({ id: 'a1', tags: ['plumbing'], ...over });

    describe('normalizeUpdateTags', function () {
        it('trims and dedupes without touching case, the way creation stores tags', function () {
            expect(normalizeUpdateTags([' Plumbing ', 'Plumbing', 'Urgent'])).to.deep.equal(['Plumbing', 'Urgent']);
        });

        it('leaves two spellings of one word as the two tags they are', function () {
            // Matching compares tags exactly, so folding these together here
            // would move the task into an index the holder never matched.
            expect(normalizeUpdateTags(['Plumbing', 'plumbing'])).to.deep.equal(['Plumbing', 'plumbing']);
        });

        it('drops entries that are empty once trimmed', function () {
            expect(normalizeUpdateTags(['plumbing', '   ', ''])).to.deep.equal(['plumbing']);
        });
    });

    describe('diffTagIndexes', function () {
        it('reports only the indexes that actually move', function () {
            const diff = diffTagIndexes(['a', 'b'], ['b', 'c'], false);
            expect(diff.added).to.deep.equal(['c']);
            expect(diff.removed).to.deep.equal(['a']);
            expect(diff.indexTags).to.deep.equal(['b', 'c']);
            expect(diff.tagsCsv).to.equal('b,c');
            expect(diff.changed).to.equal(true);
        });

        it('is silent when the tag set is restated in a different order', function () {
            const diff = diffTagIndexes(['a', 'b'], ['b', 'a'], false);
            expect(diff.added).to.deep.equal([]);
            expect(diff.removed).to.deep.equal([]);
            expect(diff.changed).to.equal(false);
        });

        it('sees a pure removal as a change', function () {
            const diff = diffTagIndexes(['a', 'b'], ['a'], false);
            expect(diff.removed).to.deep.equal(['b']);
            expect(diff.changed).to.equal(true);
        });

        it('carries the default tag through so a retag never evicts from the shared pool', function () {
            const diff = diffTagIndexes(['a'], ['b'], true);
            expect(diff.indexTags).to.deep.equal(['b', 'default']);
            expect(diff.removed).to.deep.equal(['a']);
            expect(diff.tagsCsv).to.equal('b,default');
        });
    });

    describe('applyUpdate', function () {
        it('leaves untouched fields exactly as they were', function () {
            const before = task({ priority: 50, title: 'Tap', sla: { completeWithinMs: 1000 } });
            const after = applyUpdate(before, { title: 'Leaking tap' });
            expect(after.tags).to.deep.equal(['plumbing']);
            expect(after.priority).to.equal(50);
            expect(after.sla).to.deep.equal({ completeWithinMs: 1000 });
            expect(after.title).to.equal('Leaking tap');
        });

        it('clears title and meta on an explicit null', function () {
            const after = applyUpdate(task({ title: 'Tap', meta: { ref: 'X' } }), { title: null, meta: null });
            expect('title' in after).to.equal(false);
            expect('meta' in after).to.equal(false);
        });

        it('takes pre-normalized tags when it is handed them', function () {
            const after = applyUpdate(task(), { tags: ['RAW'] }, ['raw']);
            expect(after.tags).to.deep.equal(['raw']);
        });

        it('normalizes tags itself when it is not', function () {
            const after = applyUpdate(task(), { tags: [' Raw ', 'Raw'] });
            expect(after.tags).to.deep.equal(['Raw']);
        });
    });

    describe('consumeOfferWindow', function () {
        it('drops an offer deadline an acceptance already answered', function () {
            const record: Record<string, any> = { id: 'a1', schedule: { notAfter: 10, onMiss: 'drop' } };
            consumeOfferWindow(record);
            expect(record.schedule).to.deep.equal({ onMiss: 'drop' });
        });

        it('drops the schedule entirely when the deadline was all it said', function () {
            const record: Record<string, any> = { id: 'a1', schedule: { notAfter: 10 } };
            consumeOfferWindow(record);
            expect('schedule' in record).to.equal(false);
        });

        it('leaves a record with no offer deadline alone', function () {
            const record: Record<string, any> = { id: 'a1', schedule: { notBefore: 10 } };
            consumeOfferWindow(record);
            expect(record.schedule).to.deep.equal({ notBefore: 10 });
        });
    });
});
