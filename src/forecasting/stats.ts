/** Small numeric helpers the forecasting module shares. Pure, allocation-light. */

export function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}

/** Quantile of an unsorted sample by linear interpolation (type 7); NaN for an empty one. */
export function quantile(values: readonly number[], p: number): number {
    if (values.length === 0) return Number.NaN;
    const sorted = [...values].sort((a, b) => a - b);
    return quantileSorted(sorted, p);
}

/** Quantile of an already ascending sample. */
export function quantileSorted(sorted: readonly number[], p: number): number {
    if (sorted.length === 0) return Number.NaN;
    const at = clamp(p, 0, 1) * (sorted.length - 1);
    const lo = Math.floor(at);
    const hi = Math.ceil(at);
    return sorted[lo] + (sorted[hi] - sorted[lo]) * (at - lo);
}

export function median(values: readonly number[]): number {
    return quantile(values, 0.5);
}

export function mean(values: readonly number[]): number {
    if (values.length === 0) return Number.NaN;
    let sum = 0;
    for (const v of values) sum += v;
    return sum / values.length;
}

/** Round to a fixed number of decimals, so stored forecasts stay small and stable. */
export function round(value: number, decimals = 2): number {
    const f = 10 ** decimals;
    return Math.round(value * f) / f;
}
