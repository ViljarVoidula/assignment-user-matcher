/**
 * Seeded sampling for the staffing simulation: measured distributions by
 * inverse CDF, Poisson counts, and the Gamma draw that overdisperses arrivals
 * around the forecast. Every draw takes a `rand` from `createPrng`, so a run
 * is reproducible from its seed.
 */
import { createPrng } from '../scheduling/engine/prng';
import type { QuantileDistribution } from './types';

export { createPrng };

/** Validates a quantile distribution: ≥ 2 finite, non-negative, non-decreasing points. */
export function assertDistribution(d: QuantileDistribution, what: string): void {
    if (!d || !Array.isArray(d.q) || d.q.length < 2) throw new RangeError(`${what} needs at least two quantiles`);
    for (let i = 0; i < d.q.length; i++) {
        const v = d.q[i];
        if (!Number.isFinite(v) || v < 0) throw new RangeError(`${what} quantiles must be finite and non-negative`);
        if (i > 0 && v < d.q[i - 1]) throw new RangeError(`${what} quantiles must not decrease`);
    }
}

/** Inverse CDF with linear interpolation between the evenly spaced quantiles. */
export function sampleQuantiles(d: QuantileDistribution, rand: () => number): number {
    const at = rand() * (d.q.length - 1);
    const lo = Math.floor(at);
    const hi = Math.min(d.q.length - 1, lo + 1);
    return d.q[lo] + (d.q[hi] - d.q[lo]) * (at - lo);
}

/** Mean of a quantile distribution (trapezoid over the evenly spaced points). */
export function meanOf(d: QuantileDistribution): number {
    let sum = 0;
    for (let i = 1; i < d.q.length; i++) sum += (d.q[i] + d.q[i - 1]) / 2;
    return sum / (d.q.length - 1);
}

/** An exponential distribution as 101 quantiles (p100 capped at p99.9), for tests and defaults. */
export function exponentialQuantiles(meanValue: number, points = 101): QuantileDistribution {
    const q: number[] = [];
    for (let i = 0; i < points; i++) {
        const p = Math.min(i / (points - 1), 0.999);
        q.push(-meanValue * Math.log(1 - p));
    }
    return { q };
}

/** Poisson count: Knuth for small means, a rounded normal approximation above 60. */
export function samplePoisson(lambda: number, rand: () => number): number {
    if (lambda <= 0) return 0;
    if (lambda > 60) {
        const u = Math.max(rand(), 1e-12);
        const v = rand();
        const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
        return Math.max(0, Math.round(lambda + Math.sqrt(lambda) * z));
    }
    const limit = Math.exp(-lambda);
    let k = 0;
    let p = rand();
    while (p > limit) {
        k += 1;
        p *= rand();
    }
    return k;
}

/** Gamma(shape k, scale 1/k) — mean 1 — by Marsaglia–Tsang. */
export function sampleGammaMeanOne(k: number, rand: () => number): number {
    if (!Number.isFinite(k) || k <= 0) return 1;
    const shape = k < 1 ? k + 1 : k;
    const d = shape - 1 / 3;
    const c = 1 / Math.sqrt(9 * d);
    let value: number;
    for (;;) {
        let x: number;
        let v: number;
        do {
            const u1 = Math.max(rand(), 1e-12);
            const u2 = rand();
            x = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
            v = 1 + c * x;
        } while (v <= 0);
        v = v * v * v;
        const u = rand();
        if (u < 1 - 0.0331 * x * x * x * x || Math.log(Math.max(u, 1e-12)) < 0.5 * x * x + d * (1 - v + Math.log(v))) {
            value = d * v;
            break;
        }
    }
    if (k < 1) value *= Math.pow(Math.max(rand(), 1e-12), 1 / k);
    return value / k;
}

/** Inverse standard normal CDF (Acklam's rational approximation, relative error < 1.2e-9). */
export function normalQuantile(p: number): number {
    const a = [
        -39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239,
    ];
    const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572];
    const c = [
        -0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968,
        2.938163982698783,
    ];
    const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
    const low = 0.02425;
    if (p < low) {
        const q = Math.sqrt(-2 * Math.log(p));
        return (
            (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
            ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
        );
    }
    if (p > 1 - low) return -normalQuantile(1 - p);
    const q = p - 0.5;
    const r = q * q;
    return (
        ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) /
        (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)
    );
}

/** Quantile `p` of Gamma(shape k, scale 1/k) — mean 1 — by Wilson–Hilferty; 1 for k = Infinity. */
export function gammaMeanOneQuantile(k: number, p: number): number {
    if (!Number.isFinite(k) || k <= 0) return 1;
    const v = 1 / (9 * k);
    return Math.max(0, (1 - v + normalQuantile(p) * Math.sqrt(v)) ** 3);
}

/**
 * `count` strata of (0, 1), in an order whose every prefix is spread out (van der Corput, base 2): returns
 * the stratum midpoints, so the first eight already sample the whole range and all `count` sample it evenly.
 */
export function spreadStrata(count: number): number[] {
    const used = new Set<number>();
    const out: number[] = [];
    for (let i = 1; out.length < count; i++) {
        let x = 0;
        let f = 0.5;
        for (let n = i; n > 0; n >>= 1, f /= 2) if (n & 1) x += f;
        const stratum = Math.floor(x * count);
        if (used.has(stratum)) continue;
        used.add(stratum);
        out.push((stratum + 0.5) / count);
    }
    return out;
}
