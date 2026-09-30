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
    assigned?: number;
}): { tier: ResilienceTier; reasons: string[] } {
    let tier: ResilienceTier = 'ok';
    const reasons: string[] = [];
    const raise = (next: ResilienceTier, reason: string) => {
        if (RANK[next] > RANK[tier]) tier = next;
        if (!reasons.includes(reason)) reasons.push(reason);
    };
    // Shared judge: short (shortBy > 0) escalates to critical when there aren't
    // even enough backups to cover the shortfall, else at-risk; not short, it
    // escalates to at-risk when backups don't cover the expected dropouts, or
    // watch when they cover today's expectation but not one more than that.
    const judge = (shortBy: number, backups: number, dropouts: number, shortReason: string, thinReason: string) => {
        if (shortBy > 0) {
            if (backups < shortBy) {
                raise('critical', shortReason);
                raise('critical', 'no-backups');
            } else raise('at-risk', shortReason);
        } else if (backups < dropouts) raise('at-risk', thinReason);
        else if (backups < dropouts + 1) raise('watch', thinReason);
    };
    judge(input.shortBy, input.backups, input.expectedDropouts, 'short', 'thin-backups');

    // Per-skill: judged exactly like the shift, against that skill's own share
    // of the expected dropouts — the fraction of assigned holders this skill
    // accounts for. Without `assigned` (or an empty shift), fall back to the
    // shift-wide rate unscaled.
    for (const s of input.skills) {
        const skillDropouts =
            input.assigned && input.assigned > 0
                ? (input.expectedDropouts * s.held) / input.assigned
                : input.expectedDropouts;
        judge(s.shortBy, s.backups, skillDropouts, `short-skill:${s.tag}`, `thin-skill:${s.tag}`);
    }
    return { tier, reasons };
}
