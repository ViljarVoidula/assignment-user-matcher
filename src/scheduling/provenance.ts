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

import type { ConstraintOptions, ObjectiveWeights, WorkingTimeRules } from './types';

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
): string {
    const payload = stableStringify({
        rules: rules ?? null,
        // Only the parts of `constraints` that change outcomes: custom rules are
        // functions and cannot be hashed, so their ids stand in for them.
        minRestMinutes: options?.minRestMinutes ?? null,
        oneShiftPerDay: options?.oneShiftPerDay ?? null,
        overrides: options?.overrides ?? null,
        custom: (options?.custom ?? []).map((c) => ({ id: c.id, hardness: c.hardness, weight: c.weight ?? null })),
        objectives: objectives ?? null,
    });
    return fnv1a64(payload);
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
