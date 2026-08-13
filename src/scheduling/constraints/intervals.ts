/** Shared interval helpers for the built-in constraints. Minutes since period epoch, half-open [start, end). */

export function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
    return aStart < bEnd && bStart < aEnd;
}

/** Minutes between the end of the earlier interval and the start of the later one; negative when they overlap. */
export function gapBetween(aStart: number, aEnd: number, bStart: number, bEnd: number): number {
    if (aEnd <= bStart) return bStart - aEnd;
    if (bEnd <= aStart) return aStart - bEnd;
    return -Math.min(aEnd, bEnd) + Math.max(aStart, bStart);
}
