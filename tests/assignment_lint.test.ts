import { expect } from 'chai';
import { lintAssignment, userCoversTag } from '../src/validation/assignment-lint';
import type { AssignmentLintIssue } from '../src/types/matcher';

const NOW = 1_000_000_000_000;

const codes = (issues: AssignmentLintIssue[]) => issues.map((issue) => issue.code);

describe('Assignment lint (pure pre-flight checks)', function () {
    describe('tags', function () {
        it('flags missing tags as an error without default matching', function () {
            expect(codes(lintAssignment({ id: 'a', tags: [] }, { now: NOW }))).to.deep.equal(['no-tags']);
            expect(codes(lintAssignment({ id: 'a' } as any, { now: NOW }))).to.deep.equal(['no-tags']);
        });

        it('softens missing tags to info when default matching is enabled', function () {
            const issues = lintAssignment({ id: 'a', tags: [] }, { now: NOW, enableDefaultMatching: true });
            expect(issues).to.have.length(1);
            expect(issues[0].code).to.equal('no-tags');
            expect(issues[0].severity).to.equal('info');
        });

        it('is silent for a plain healthy assignment', function () {
            expect(lintAssignment({ id: 'a', tags: ['t'] }, { now: NOW })).to.deep.equal([]);
        });
    });

    describe('schedule conflicts', function () {
        it('flags an inverted window (the whole policy would be silently ignored)', function () {
            const issues = lintAssignment(
                { id: 'a', tags: ['t'], schedule: { notBefore: NOW + 2000, notAfter: NOW + 1000 } },
                { now: NOW },
            );
            expect(codes(issues)).to.deep.equal(['schedule-window-inverted']);
            expect(issues[0].severity).to.equal('error');
        });

        it('flags a schedule that declares nothing usable', function () {
            const issues = lintAssignment({ id: 'a', tags: ['t'], schedule: { onMiss: 'drop' } }, { now: NOW });
            expect(codes(issues)).to.deep.equal(['schedule-ignored']);
        });

        it('flags an already-elapsed offer window', function () {
            const issues = lintAssignment({ id: 'a', tags: ['t'], schedule: { notAfter: NOW - 1 } }, { now: NOW });
            expect(codes(issues)).to.include('schedule-window-elapsed');
        });

        it('notes a notBefore already in the past as informational', function () {
            const issues = lintAssignment(
                { id: 'a', tags: ['t'], schedule: { notBefore: NOW - 1, notAfter: NOW + 60000 } },
                { now: NOW },
            );
            expect(issues).to.have.length(1);
            expect(issues[0].code).to.equal('schedule-notbefore-past');
            expect(issues[0].severity).to.equal('info');
        });

        it('warns when the offer window is shorter than one response deadline', function () {
            // Window is 30s from activation; a single unanswered offer holds
            // the assignment for 60s — one silence consumes the whole window.
            const issues = lintAssignment(
                { id: 'a', tags: ['t'], schedule: { notBefore: NOW + 1000, notAfter: NOW + 31000 } },
                { now: NOW, matchExpirationMs: 60000 },
            );
            expect(codes(issues)).to.deep.equal(['offer-window-tight']);

            // The escalation policy's own deadline wins over the fallback
            const escalated = lintAssignment(
                {
                    id: 'a',
                    tags: ['t'],
                    escalation: { respondWithinMs: 10000 },
                    schedule: { notBefore: NOW + 1000, notAfter: NOW + 31000 },
                },
                { now: NOW, matchExpirationMs: 60000 },
            );
            expect(codes(escalated)).to.deep.equal([]);
        });

        it('warns when the SLA freshness TTL fires before the offer deadline', function () {
            // TTL anchors at activation: NOW+1000 + 5000 < notAfter — the TTL
            // sweep (onExpire) acts first and notAfter never fires.
            const issues = lintAssignment(
                {
                    id: 'a',
                    tags: ['t'],
                    sla: { expireAfterMs: 5000 },
                    schedule: { notBefore: NOW + 1000, notAfter: NOW + 60000 },
                },
                { now: NOW },
            );
            expect(codes(issues)).to.deep.equal(['schedule-notafter-shadowed-by-sla-ttl']);

            // TTL beyond the window: no shadowing
            const fine = lintAssignment(
                {
                    id: 'a',
                    tags: ['t'],
                    sla: { expireAfterMs: 3600000 },
                    schedule: { notBefore: NOW + 1000, notAfter: NOW + 60000 },
                },
                { now: NOW },
            );
            expect(codes(fine)).to.deep.equal([]);
        });
    });

    describe('sibling policy sanity', function () {
        it('flags sla/escalation objects that would be silently ignored', function () {
            const issues = lintAssignment(
                { id: 'a', tags: ['t'], sla: { expireAfterMs: -5 }, escalation: { respondWithinMs: 0 } },
                { now: NOW },
            );
            expect(codes(issues)).to.have.members(['sla-ignored', 'escalation-ignored']);
        });
    });

    describe('userCoversTag', function () {
        it('uses positive routing weights, honoring wildcards and vetoes', function () {
            expect(userCoversTag({ id: 'u', tags: [], routingWeights: { 'lang:*': 5 } }, 'lang:en')).to.be.true;
            expect(userCoversTag({ id: 'u', tags: [], routingWeights: { 'lang:en': 0 } }, 'lang:en')).to.be.false;
            expect(userCoversTag({ id: 'u', tags: [], routingWeights: { other: 5 } }, 'lang:en')).to.be.false;
        });

        it('falls back to tag membership (user-side patterns) without routing weights', function () {
            expect(userCoversTag({ id: 'u', tags: ['lang:*'] }, 'lang:en')).to.be.true;
            expect(userCoversTag({ id: 'u', tags: ['support'] }, 'billing')).to.be.false;
        });
    });
});
