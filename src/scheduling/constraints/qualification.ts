/**
 * Qualifications, valid on the day of the shift.
 *
 * The bug this exists to prevent: a static `Set<string>` of skills silently
 * rosters someone onto a shift after their certificate has lapsed. In
 * healthcare, aviation ground handling, food and security that is a live audit
 * failure, and it is invisible in the roster — the person "has" the skill.
 *
 * So possession is a question about a *date*, not a fact about a person:
 * `hasQualification(employee, tag, date)`, never `hasSkill(employee, tag)`.
 * Tags on `Employee.tags` stay valid for the whole period; anything with an
 * expiry belongs in `qualifications`.
 */

import type { Employee, RuleVerdict, SchedulingConstraint } from '../types';
import { fail, fromVerdict, instanceOf, pass } from './support';

export function qualification(): SchedulingConstraint {
    return fromVerdict({
        id: 'qualification',
        hardness: 'hard',
        weight: 1,
        prune(ctx, eligibility) {
            for (const [employeeId, instances] of eligibility) {
                const employee = ctx.employeeById.get(employeeId);
                if (!employee) continue;
                for (const instanceId of [...instances]) {
                    const inst = ctx.instanceById.get(instanceId);
                    if (!inst?.requiredTags.length) continue;
                    const missing = inst.requiredTags.filter((tag) => !holds(employee, tag, inst.date));
                    if (missing.length) instances.delete(instanceId);
                }
            }
        },
        verdict(state, pair): RuleVerdict {
            const inst = instanceOf(state, pair);
            const employee = state.ctx.employeeById.get(pair.employeeId);
            if (!inst || !employee || !inst.requiredTags.length) {
                return pass('qualification', 'no qualification requirement');
            }

            const missing = inst.requiredTags.filter((tag) => !holds(employee, tag, inst.date));
            if (missing.length === 0) {
                return pass('qualification', `holds ${inst.requiredTags.join(', ')} on ${inst.date}`);
            }

            // Distinguish "never had it" from "had it, expired" — they lead to
            // completely different operational fixes.
            const detail = missing
                .map((tag) => {
                    const held = (employee.qualifications ?? []).find((q) => q.tag === tag);
                    if (held?.validUntil && held.validUntil < inst.date) return `${tag} (expired ${held.validUntil})`;
                    if (held?.validFrom && held.validFrom > inst.date) return `${tag} (valid from ${held.validFrom})`;
                    return tag;
                })
                .join(', ');

            return fail('qualification', 'hard', `employee "${pair.employeeId}" lacks ${detail} for "${inst.id}"`, {
                actual: inst.requiredTags.length - missing.length,
                required: inst.requiredTags.length,
                unit: 'count',
            });
        },
    });
}

/** Whether the employee holds `tag` on `date`, by plain tag or dated qualification. */
export function holds(employee: Employee, tag: string, date: string, minLevel?: number): boolean {
    if (minLevel === undefined && (employee.tags ?? []).includes(tag)) return true;
    return (employee.qualifications ?? []).some(
        (q) =>
            q.tag === tag &&
            (q.validFrom === undefined || q.validFrom <= date) &&
            (q.validUntil === undefined || q.validUntil >= date) &&
            (minLevel === undefined || (q.level ?? 0) >= minLevel),
    );
}
