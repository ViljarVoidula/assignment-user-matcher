/**
 * Provenance — identifying what produced a roster.
 *
 * Reproducibility is an audit requirement here, not a convenience. The defence
 * of a roster is "it was lawful under the rules as they stood", which needs the
 * rules and the objective weights to be identifiable after the fact. In Germany
 * the weights are themselves co-determination subject matter (BetrVG §87(1)),
 * so "we retuned the solver" is a works-council question, not an internal one.
 *
 * The hash is a stable digest of the configuration, not a cryptographic
 * commitment: it exists to detect that the rules changed between two runs, and
 * to key an audit record. It is deliberately dependency-free.
 */

import type { ConstraintOptions, ObjectiveWeights, Site, WorkingTimeRules } from './types';

/**
 * A stable digest of the rule set, constraint options and objective weights.
 *
 * Object keys are sorted before hashing so two configurations that differ only
 * in property order produce the same digest — otherwise a round-trip through
 * JSON would look like a rule change.
 */
export function hashRules(
    rules: WorkingTimeRules | undefined,
    options: ConstraintOptions | undefined,
    objectives?: ObjectiveWeights,
    sites?: Site[],
    travelSpeedKmh?: number,
    employeeRules?: Map<string, WorkingTimeRules>,
): string {
    // Only the employees whose effective rules actually differ from the global
    // set. `rulesByEmployee` carries an entry for *every* employee, so hashing
    // it whole would make the digest move when a person is added or renamed —
    // and `rulesHash` is a configuration fingerprint, not a roster one.
    const globalDigest = stableStringify(rules ?? {});
    const personalRules = [...(employeeRules ?? [])]
        .filter(([, effective]) => stableStringify(effective) !== globalDigest)
        .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    const payload = stableStringify({
        rules: rules ?? null,
        ...(personalRules.length > 0 ? { employeeRules: personalRules } : {}),
        // Only the parts of `constraints` that change outcomes: custom rules are
        // functions and cannot be hashed, so their ids stand in for them.
        minRestMinutes: options?.minRestMinutes ?? null,
        oneShiftPerDay: options?.oneShiftPerDay ?? null,
        overrides: options?.overrides ?? null,
        custom: (options?.custom ?? []).map((c) => ({
            id: c.id,
            hardness: c.hardness,
            weight: c.weight ?? null,
            ...(c.version === undefined ? {} : { version: c.version }),
        })),
        objectives: objectives ?? null,
        // Omit these keys entirely when absent so existing inputs without site data
        // keep the same rulesHash they had before this feature existed.
        ...(sites ? { sites: sites.map(siteDigest) } : {}),
        ...(travelSpeedKmh !== undefined ? { travelSpeedKmh } : {}),
    });
    return fnv1a64(payload);
}

function siteDigest(site: Site) {
    return {
        id: site.id,
        lat: site.lat ?? null,
        lng: site.lng ?? null,
        travelMinutesTo: site.travelMinutesTo
            ? Object.fromEntries(Object.entries(site.travelMinutesTo).sort(([a], [b]) => (a < b ? -1 : 1)))
            : null,
    };
}

/** JSON with object keys sorted recursively. */
export function stableStringify(value: unknown): string {
    if (value === null || typeof value !== 'object') return JSON.stringify(value) ?? 'null';
    if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
    const entries = Object.entries(value as Record<string, unknown>)
        .filter(([, v]) => v !== undefined)
        .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${stableStringify(v)}`).join(',')}}`;
}

/**
 * 64-bit FNV-1a, rendered as hex.
 *
 * Implemented over two 32-bit halves because JavaScript's bitwise operators
 * truncate to 32 bits, and a 32-bit digest collides too readily to key an audit
 * record on.
 */
export function fnv1a64(input: string): string {
    let high = 0xcbf2_9ce4;
    let low = 0x8422_2325;
    for (let i = 0; i < input.length; i++) {
        low ^= input.charCodeAt(i) & 0xff;
        // Multiply by the 64-bit FNV prime (0x100000001b3) via 32-bit halves.
        const lowMul = low * 0x1b3;
        const highMul = high * 0x1b3 + Math.floor(lowMul / 0x1_0000_0000) + low * 0x100;
        low = lowMul >>> 0;
        high = highMul >>> 0;
    }
    return high.toString(16).padStart(8, '0') + low.toString(16).padStart(8, '0');
}
