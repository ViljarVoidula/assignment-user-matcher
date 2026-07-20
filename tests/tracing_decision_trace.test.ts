import { expect } from 'chai';
import { TraceCollector, buildDecisionTraces } from '../src/tracing/decision-trace';
import type { TraceUserContext } from '../src/tracing/decision-trace';
import type { User } from '../src/types/matcher';

function ctx(user: User, overrides: Partial<TraceUserContext> = {}): TraceUserContext {
    return { user, rejected: new Set(), vetoed: new Set(), ...overrides };
}

/**
 * Decision traces are the product's audit/explainability differentiator — a
 * trace that silently drops a hard-vetoed or previously-rejected candidate,
 * or fails to backfill a winner Redis claimed outside the capture window,
 * would make the "why" answer wrong. Pure assembly logic, tested directly.
 */
describe('buildDecisionTraces', function () {
    const winnerUser: User = { id: 'winner', tags: ['t1'] };

    it('does not synthesize a struck-out entry for a bystander with no exclusion reason', function () {
        const collector = new TraceCollector();
        collector.record('a1', 't1', { userId: 'winner', eligible: true, score: 10, effectivePriority: 10, reasons: [] });

        const bystander: User = { id: 'bystander', tags: ['t1'] };
        const traces = buildDecisionTraces({
            collector,
            winners: new Map([['a1', 'winner']]),
            mode: 'direct',
            users: [ctx(winnerUser), ctx(bystander)],
            maxCandidates: 25,
            matchedAt: Date.now(),
        });

        expect(traces[0].candidates.map((c) => c.userId)).to.deep.equal(['winner']);
    });

    it('backfills hard-vetoed and previously-rejected users as struck-out candidates', function () {
        const collector = new TraceCollector();
        collector.record('a1', 't1', { userId: 'winner', eligible: true, score: 10, effectivePriority: 10, reasons: [] });

        const vetoedUser: User = { id: 'vetoed-user', tags: ['t1'] };
        const rejectedUser: User = { id: 'rejected-user', tags: ['t1'] };
        const traces = buildDecisionTraces({
            collector,
            winners: new Map([['a1', 'winner']]),
            mode: 'direct',
            users: [ctx(winnerUser), ctx(vetoedUser, { vetoed: new Set(['a1']) }), ctx(rejectedUser, { rejected: new Set(['a1']) })],
            maxCandidates: 25,
            matchedAt: Date.now(),
        });

        const byId = Object.fromEntries(traces[0].candidates.map((c) => [c.userId, c]));
        expect(byId['vetoed-user'].reasons).to.deep.equal([{ kind: 'assignmentVeto' }]);
        expect(byId['rejected-user'].reasons).to.deep.equal([{ kind: 'rejectedPreviously' }]);
    });

    it('adds a synthetic winner card when the winner never appeared in the collector', function () {
        const collector = new TraceCollector();
        // No record() call for 'a1' at all — simulates a claim that raced ahead of capture.

        const traces = buildDecisionTraces({
            collector,
            winners: new Map([['a1', 'ghost-winner']]),
            mode: 'direct',
            users: [],
            maxCandidates: 25,
            matchedAt: Date.now(),
        });

        expect(traces[0].candidates).to.deep.equal([
            { userId: 'ghost-winner', eligible: true, chosen: true, score: 0, effectivePriority: 0, reasons: [] },
        ]);
        expect(traces[0].assignmentId).to.equal('a1');
    });
});
