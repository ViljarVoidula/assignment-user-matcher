/**
 * Scoring and matching utilities
 */
import type { User, MatchTraceReason } from '../types/matcher';

/**
 * Check if a pattern matches a tag (supports wildcard patterns ending with *)
 */
export function matchesPattern(pattern: string, tag: string): boolean {
    if (pattern === tag) return true;
    if (pattern.endsWith('*')) {
        const prefix = pattern.slice(0, -1);
        return tag.startsWith(prefix);
    }
    return false;
}

/**
 * Get the effective weight for a skill tag from user's routingWeights
 * Supports wildcard patterns (e.g., 'eng*' matches 'english')
 */
export function getEffectiveWeight(routingWeights: Record<string, number>, tag: string): number {
    // First check for exact match
    if (tag in routingWeights) {
        return routingWeights[tag];
    }
    // Check wildcard patterns
    for (const [pattern, weight] of Object.entries(routingWeights)) {
        if (matchesPattern(pattern, tag)) {
            return weight;
        }
    }
    return 0;
}

/**
 * Check if user meets all skill thresholds
 * Returns true if all thresholds are met, false otherwise
 */
export function meetsSkillThresholds(
    routingWeights: Record<string, number> | undefined,
    skillThresholds: Record<string, number> | undefined,
): boolean {
    if (!skillThresholds || Object.keys(skillThresholds).length === 0) {
        return true; // No thresholds to check
    }
    if (!routingWeights || Object.keys(routingWeights).length === 0) {
        return false; // User has no weights but thresholds exist
    }

    for (const [skill, minWeight] of Object.entries(skillThresholds)) {
        const userWeight = getEffectiveWeight(routingWeights, skill);
        if (userWeight < minWeight) {
            return false;
        }
    }
    return true;
}

/**
 * Calculate match score between a user and assignment tags
 * Returns [score, combinedPriority]
 */
export function calculateMatchScore(
    user: User,
    assignmentTags: string,
    assignmentPriority: string | number,
    enableDefaultMatching: boolean,
    skillThresholds?: Record<string, number>,
): [number, number] {
    const aTags = assignmentTags ? assignmentTags.split(',') : [];

    // If weighted skills are present, use them for scoring
    if (user.routingWeights && Object.keys(user.routingWeights).length > 0) {
        // Check skill thresholds first - reject if not met
        if (!meetsSkillThresholds(user.routingWeights, skillThresholds)) {
            return [0, Number(assignmentPriority) || 0];
        }

        // Check for exclusions (weight 0)
        for (const [pattern, weight] of Object.entries(user.routingWeights)) {
            if (weight === 0) {
                for (const t of aTags) {
                    if (matchesPattern(pattern, t)) {
                        return [0, Number(assignmentPriority) || 0];
                    }
                }
            }
        }

        let weightSum = 0;
        for (const t of aTags) {
            let matchedByRouting = false;
            for (const [pattern, weight] of Object.entries(user.routingWeights)) {
                if (typeof weight === 'number' && weight > 0) {
                    if (matchesPattern(pattern, t)) {
                        weightSum += weight;
                        matchedByRouting = true;
                    }
                }
            }

            // If enableDefaultMatching is true, and the tag is 'default',
            // and it wasn't matched by any routing weight, give it default weight 1
            if (enableDefaultMatching && t === 'default' && !matchedByRouting) {
                weightSum += 1;
            }
        }
        const base = Number(assignmentPriority) || 0;
        return [weightSum, base + weightSum];
    }

    // For tag-based matching (no routingWeights), check thresholds
    // If thresholds exist but user has no routingWeights, reject
    if (skillThresholds && Object.keys(skillThresholds).length > 0) {
        return [0, Number(assignmentPriority) || 0];
    }

    // Fallback to default tag-intersection scoring
    const userTagSet = new Set(user.tags);
    const assignmentTagSet = new Set(aTags);

    let intersectionSize = 0;
    for (const userTag of userTagSet) {
        let matched = false;
        for (const assignmentTag of assignmentTagSet) {
            if (matchesPattern(userTag, assignmentTag)) {
                matched = true;
                break;
            }
        }
        if (matched) intersectionSize++;
    }

    const score = userTagSet.size > 0 ? intersectionSize / userTagSet.size : 0;
    const base = Number(assignmentPriority) || 0;
    return [score || 0, base + (score || 0)];
}

/** Result of `explainMatchScore`: the `calculateMatchScore` pair plus the reasons behind it. */
export interface MatchScoreExplanation {
    score: number;
    combinedPriority: number;
    reasons: MatchTraceReason[];
}

/**
 * Explaining twin of `calculateMatchScore`: same inputs, same score and
 * combined priority (asserted by the parity test in
 * tests/matcher_decision_traces.test.ts), plus the structured reasons behind
 * the number — matched weights, vetoes, threshold failures, tag overlap.
 * Kept separate from `calculateMatchScore` so the hot scoring path never pays
 * for reason allocation; any change to one function must be mirrored in the
 * other.
 */
export function explainMatchScore(
    user: User,
    assignmentTags: string,
    assignmentPriority: string | number,
    enableDefaultMatching: boolean,
    skillThresholds?: Record<string, number>,
): MatchScoreExplanation {
    const aTags = assignmentTags ? assignmentTags.split(',') : [];
    const base = Number(assignmentPriority) || 0;
    const reasons: MatchTraceReason[] = [];

    if (user.routingWeights && Object.keys(user.routingWeights).length > 0) {
        if (!meetsSkillThresholds(user.routingWeights, skillThresholds)) {
            for (const [skill, required] of Object.entries(skillThresholds ?? {})) {
                const actual = getEffectiveWeight(user.routingWeights, skill);
                if (actual < required) reasons.push({ kind: 'skillThreshold', skill, required, actual });
            }
            return { score: 0, combinedPriority: base, reasons };
        }

        // calculateMatchScore short-circuits on the first veto; collecting all
        // of them here changes nothing about the outcome (score 0 either way)
        // and gives the trace every rule that fired.
        let vetoed = false;
        for (const [pattern, weight] of Object.entries(user.routingWeights)) {
            if (weight === 0) {
                for (const t of aTags) {
                    if (matchesPattern(pattern, t)) {
                        reasons.push({ kind: 'veto', tag: t, pattern });
                        vetoed = true;
                    }
                }
            }
        }
        if (vetoed) return { score: 0, combinedPriority: base, reasons };

        let weightSum = 0;
        for (const t of aTags) {
            let matchedByRouting = false;
            for (const [pattern, weight] of Object.entries(user.routingWeights)) {
                if (typeof weight === 'number' && weight > 0 && matchesPattern(pattern, t)) {
                    weightSum += weight;
                    matchedByRouting = true;
                    reasons.push(
                        pattern === t
                            ? { kind: 'tagWeight', tag: t, weight }
                            : { kind: 'tagWeight', tag: t, weight, pattern },
                    );
                }
            }
            if (enableDefaultMatching && t === 'default' && !matchedByRouting) {
                weightSum += 1;
                reasons.push({ kind: 'defaultTag', weight: 1 });
            }
        }
        return { score: weightSum, combinedPriority: base + weightSum, reasons };
    }

    if (skillThresholds && Object.keys(skillThresholds).length > 0) {
        for (const [skill, required] of Object.entries(skillThresholds)) {
            reasons.push({ kind: 'skillThreshold', skill, required, actual: 0 });
        }
        return { score: 0, combinedPriority: base, reasons };
    }

    const userTagSet = new Set(user.tags);
    const assignmentTagSet = new Set(aTags);
    const matchedTags: string[] = [];
    for (const userTag of userTagSet) {
        for (const assignmentTag of assignmentTagSet) {
            if (matchesPattern(userTag, assignmentTag)) {
                matchedTags.push(userTag);
                break;
            }
        }
    }
    const score = userTagSet.size > 0 ? matchedTags.length / userTagSet.size : 0;
    if (score > 0) reasons.push({ kind: 'tagOverlap', matchedTags, overlapRatio: score });
    return { score: score || 0, combinedPriority: base + (score || 0), reasons };
}

/**
 * Calculate default priority based on creation time
 * Note: Returns 0 if createdAt is undefined to match original behavior
 */
export function calculateDefaultPriority(createdAt?: number): number {
    if (createdAt === undefined) return 0;
    return new Date().getTime() - createdAt;
}
