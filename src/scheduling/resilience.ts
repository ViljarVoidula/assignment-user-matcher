import type { RepairCandidate } from './operations';

/**
 * Shift resilience for the capacity radar: is a published shift short, and if
 * someone drops out, is there anybody who could legally step in? Backups are
 * counted by the same eligibility path as `rankCandidates`, so the radar and a
 * cover offer can never disagree about who could take a shift.
 *
 * Profiling-free: inputs are declared facts (roster, time off, qualifications,
 * rules) and an aggregate expected-dropout number the caller supplies.
 */
export type ResilienceTier = 'ok' | 'watch' | 'at-risk' | 'critical';

export interface SkillResilience {
    tag: string;
    required: number;
    held: number;
    shortBy: number;
    backups: number;
}

export interface ShiftResilience {
    shiftInstanceId: string;
    date: string;
    startMinute: number;
    endMinute: number;
    siteId?: string;
    need: number;
    assigned: number; // rostered and not on time off
    absent: string[]; // rostered but on time off that day (declared fact)
    shortBy: number;
    expectedDropouts: number;
    backups: number;
    skills: SkillResilience[];
    topBackups: RepairCandidate[];
    tier: ResilienceTier;
    reasons: string[]; // stable codes: 'short', 'short-skill:<tag>', 'thin-backups', 'thin-skill:<tag>', 'no-backups'
}

const RANK: Record<ResilienceTier, number> = { ok: 0, watch: 1, 'at-risk': 2, critical: 3 };

export function resilienceTier(input: {
    shortBy: number;
    backups: number;
    expectedDropouts: number;
    skills: SkillResilience[];
}): { tier: ResilienceTier; reasons: string[] } {
    let tier: ResilienceTier = 'ok';
    const reasons: string[] = [];
    const raise = (next: ResilienceTier, reason: string) => {
        if (RANK[next] > RANK[tier]) tier = next;
        if (!reasons.includes(reason)) reasons.push(reason);
    };
    // Shift-level: thinness is judged against the aggregate expected-dropout rate.
    if (input.shortBy > 0) {
        if (input.backups < input.shortBy) {
            raise('critical', 'short');
            raise('critical', 'no-backups');
        } else raise('at-risk', 'short');
    } else if (input.backups < input.expectedDropouts) raise('at-risk', 'thin-backups');
    else if (input.backups < input.expectedDropouts + 1) raise('watch', 'thin-backups');

    // Per-skill: a skill has no aggregate dropout rate of its own, only how many
    // people are required for it, so thinness is judged against `required`
    // rather than the shift's `expectedDropouts` (which would over-escalate a
    // single-skill margin into a shift-wide at-risk).
    for (const s of input.skills) {
        if (s.shortBy > 0) {
            if (s.backups < s.shortBy) {
                raise('critical', `short-skill:${s.tag}`);
                raise('critical', 'no-backups');
            } else raise('at-risk', `short-skill:${s.tag}`);
        } else if (s.backups < s.required) raise('watch', `thin-skill:${s.tag}`);
    }
    return { tier, reasons };
}
