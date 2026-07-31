import { expect } from 'chai';
import {
    escalateAssignment,
    escalationLevelOf,
    normalizeEscalationPolicy,
    responseDeadlineFromJson,
    responseDeadlineMs,
} from '../src/escalation/policy';
import type { Assignment } from '../src/types/matcher';

describe('Escalation policy (pure)', function () {
    const ladder = [['oncall-primary'], ['oncall-secondary'], ['oncall-manager']];

    describe('normalizeEscalationPolicy', function () {
        it('returns null for a missing or unusable policy', function () {
            expect(normalizeEscalationPolicy(undefined)).to.equal(null);
            expect(normalizeEscalationPolicy(null)).to.equal(null);
            expect(normalizeEscalationPolicy({ respondWithinMs: 0 })).to.equal(null);
            expect(normalizeEscalationPolicy({ respondWithinMs: -5 })).to.equal(null);
            expect(normalizeEscalationPolicy({ respondWithinMs: NaN })).to.equal(null);
        });

        it('defaults to the historical non-blocking, unlimited, requeue behaviour', function () {
            const policy = normalizeEscalationPolicy({ respondWithinMs: 1000 })!;
            expect(policy.onNoResponse).to.equal('allow');
            expect(policy.priorityBoost).to.equal(0);
            expect(policy.onExhausted).to.equal('queue');
            expect(policy.maxEscalations).to.equal(Number.POSITIVE_INFINITY);
        });

        it('derives maxEscalations from the tier ladder', function () {
            const policy = normalizeEscalationPolicy({ respondWithinMs: 1000, tiers: ladder })!;
            expect(policy.maxEscalations).to.equal(2);
        });

        it('lets an explicit maxEscalations override the derived value', function () {
            const policy = normalizeEscalationPolicy({ respondWithinMs: 1000, tiers: ladder, maxEscalations: 1 })!;
            expect(policy.maxEscalations).to.equal(1);
        });

        it('drops empty tiers', function () {
            const policy = normalizeEscalationPolicy({ respondWithinMs: 1000, tiers: [[], ['b']] as string[][] })!;
            expect(policy.tiers).to.deep.equal([['b']]);
        });
    });

    describe('responseDeadlineMs / responseDeadlineFromJson', function () {
        it('falls back to the matcher-wide expiry without a policy', function () {
            expect(responseDeadlineMs({ id: 'a', tags: [] }, 60000)).to.equal(60000);
            expect(responseDeadlineFromJson(JSON.stringify({ id: 'a', tags: [] }), 60000)).to.equal(60000);
            expect(responseDeadlineFromJson(null, 60000)).to.equal(60000);
            expect(responseDeadlineFromJson('not json', 60000)).to.equal(60000);
        });

        it('falls back when the stored JSON is corrupt despite mentioning "escalation"', function () {
            expect(responseDeadlineFromJson('{"escalation": {', 60000)).to.equal(60000);
        });

        it('uses the per-assignment deadline when declared', function () {
            const assignment: Assignment = { id: 'a', tags: [], escalation: { respondWithinMs: 250 } };
            expect(responseDeadlineMs(assignment, 60000)).to.equal(250);
            expect(responseDeadlineFromJson(JSON.stringify(assignment), 60000)).to.equal(250);
        });
    });

    describe('escalateAssignment', function () {
        const base = (): Assignment => ({
            id: 'incident-1',
            tags: ['sev:1', 'service:checkout', 'oncall-primary'],
            priority: 1000,
        });

        it('swaps tier tags and preserves everything else', function () {
            const policy = normalizeEscalationPolicy({ respondWithinMs: 100, tiers: ladder })!;
            const decision = escalateAssignment(base(), policy);

            expect(decision.exhausted).to.equal(false);
            expect(decision.level).to.equal(1);
            expect(decision.assignment.tags).to.deep.equal(['sev:1', 'service:checkout', 'oncall-secondary']);
        });

        it('climbs one tier per hop and then reports exhaustion', function () {
            const policy = normalizeEscalationPolicy({ respondWithinMs: 100, tiers: ladder })!;

            const first = escalateAssignment(base(), policy);
            const second = escalateAssignment(first.assignment, policy);
            expect(second.level).to.equal(2);
            expect(second.assignment.tags).to.include('oncall-manager');
            expect(second.assignment.tags).to.not.include('oncall-secondary');

            const third = escalateAssignment(second.assignment, policy);
            expect(third.exhausted).to.equal(true);
            expect(third.level).to.equal(2);
            expect(third.assignment).to.equal(second.assignment);
        });

        it('applies the priority boost per hop', function () {
            const policy = normalizeEscalationPolicy({ respondWithinMs: 100, priorityBoost: 250 })!;
            const first = escalateAssignment(base(), policy);
            const second = escalateAssignment(first.assignment, policy);
            expect(first.assignment.priority).to.equal(1250);
            expect(second.assignment.priority).to.equal(1500);
        });

        it('tracks the escalation level on the assignment', function () {
            const policy = normalizeEscalationPolicy({ respondWithinMs: 100 })!;
            expect(escalationLevelOf(base())).to.equal(0);
            expect(escalationLevelOf(escalateAssignment(base(), policy).assignment)).to.equal(1);
        });

        it('reports the block decision, including on the exhausting hop', function () {
            const policy = normalizeEscalationPolicy({
                respondWithinMs: 100,
                onNoResponse: 'block',
                maxEscalations: 0,
            })!;
            const decision = escalateAssignment(base(), policy);
            expect(decision.exhausted).to.equal(true);
            expect(decision.blockPreviousOwner).to.equal(true);
        });

        it('never escalates past an unlimited ladder without tiers', function () {
            const policy = normalizeEscalationPolicy({ respondWithinMs: 100 })!;
            let current = base();
            for (let i = 0; i < 25; i++) {
                const decision = escalateAssignment(current, policy);
                expect(decision.exhausted).to.equal(false);
                current = decision.assignment;
            }
            expect(escalationLevelOf(current)).to.equal(25);
        });
    });
});
