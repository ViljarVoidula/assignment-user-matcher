/**
 * Erlang A (M/M/n+M): a queue with exponential patience. Used **only** to
 * bracket the staffing simulation's search — never as the answer. It assumes
 * one skill, exponential handle times and no concurrency, which is exactly
 * what the simulation exists to get past (spec §7.3 as amended: no naive
 * Erlang C).
 */

export interface ErlangAInput {
    /** Arrivals per ms. */
    lambda: number;
    /** Mean handle time, ms. */
    meanHandleMs: number;
    /** Mean patience, ms; Infinity or 0 = nobody leaves (Erlang C). */
    meanPatienceMs: number;
    /** Target wait, ms. */
    targetMs: number;
}

const abandonRate = (input: ErlangAInput): number =>
    Number.isFinite(input.meanPatienceMs) && input.meanPatienceMs > 0 ? 1 / input.meanPatienceMs : 0;

/**
 * Stationary distribution of the birth–death chain (number in system), computed in log space: states up
 * to `n` are Erlang's, the tail above `n` loses `(k − n)·θ` a ms to abandonment. Null when it has none.
 */
function stationary(n: number, input: ErlangAInput): number[] | null {
    const mu = 1 / input.meanHandleMs;
    const theta = abandonRate(input);
    if (theta === 0 && input.lambda >= n * mu) return null;
    const logs: number[] = [0];
    const a = input.lambda / mu;
    for (let k = 1; k <= n; k++) logs.push(logs[k - 1] + Math.log(a) - Math.log(k));
    let k = n;
    let last = logs[n];
    const floor = last - 30; // e^-30 relative: negligible
    while (k < n + 100_000) {
        k += 1;
        last += Math.log(input.lambda) - Math.log(n * mu + (k - n) * theta);
        logs.push(last);
        if (last < floor && k > n + 10) break;
    }
    const max = logs.reduce((m, l) => Math.max(m, l), -Infinity);
    const p = logs.map((l) => Math.exp(l - max));
    const total = p.reduce((s, v) => s + v, 0);
    return p.map((v) => v / total);
}

/** Probability of waiting and the approximate share served within the target with `n` servers. */
export function erlangA(n: number, input: ErlangAInput): { pWait: number; serviceLevel: number } {
    if (input.lambda <= 0) return { pWait: 0, serviceLevel: 1 };
    if (n <= 0) return { pWait: 1, serviceLevel: 0 };
    const pi = stationary(n, input);
    if (!pi) return { pWait: 1, serviceLevel: 0 };
    let pWait = 0;
    for (let k = n; k < pi.length; k++) pWait += pi[k];
    const theta = abandonRate(input);
    const decay = Math.max(n / input.meanHandleMs - input.lambda + theta, theta, 1e-15);
    return { pWait, serviceLevel: Math.max(0, 1 - pWait * Math.exp(-decay * input.targetMs)) };
}

/**
 * Share of arrivals that give up before anybody picks them up: θ·E[queue] ÷ λ (exact for M/M/n+M).
 * 0 when nobody leaves; 1 with nobody to serve. Validation only — the tests hold the simulation to it;
 * not exported from the module.
 */
export function erlangAAbandonment(n: number, input: ErlangAInput): number {
    const theta = abandonRate(input);
    if (input.lambda <= 0 || theta === 0) return 0;
    if (n <= 0) return 1;
    const pi = stationary(n, input)!;
    let queue = 0;
    for (let k = n + 1; k < pi.length; k++) queue += (k - n) * pi[k];
    return (theta * queue) / input.lambda;
}

/** Smallest n meeting `share` within the target, searched up to `max`. */
export function erlangASeed(input: ErlangAInput, share: number, max: number): number {
    if (input.lambda <= 0) return 0;
    const offered = Math.ceil(input.lambda * input.meanHandleMs);
    for (let n = Math.max(1, Math.floor(offered * 0.5)); n <= max; n++) {
        if (erlangA(n, input).serviceLevel >= share) return n;
    }
    return max;
}
