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
