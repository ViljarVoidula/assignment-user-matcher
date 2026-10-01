/**
 * Staffing simulation benchmark (Plan 4a budget): one workspace's nightly
 * staffing run — 14 days hourly for three tags (chat with concurrency 2 and
 * abandonment, phone with abandonment, email with a 30-minute target, so the
 * run is chained and carries the queue from hour to hour) over a multi-skill
 * pool — at a given peak arrivals per hour.
 *
 *   pnpm benchmark:staffing -- [peakPerHour] [days] [seed]
 *
 * The budget is the one the platform runs with, `staffingBudgetMs(peak)`:
 * 3 s up to 300 an hour, scaled with volume above that, at most 15 s. It is
 * passed to `staffingNeed` as `budgetMs`, so an over-budget run skips hours
 * exactly as it would in production. Exits 1 when the run is over budget or
 * comes back incomplete.
 *
 * Hour-to-hour load is deliberately jittered so few hours share a
 * simulation: the memo is not what is being measured.
 *
 * Not named `benchmark-*.ts`: that pattern is git-ignored in this repo.
 */
import { exponentialQuantiles, staffingBudgetMs, staffingNeed, type TagProfile } from '../src/forecasting';

const MIN = 60_000;
const [peak = 300, days = 14, seed = 1] = process.argv
    .slice(2)
    .filter((a) => a !== '--')
    .map(Number);
const budgetMs = staffingBudgetMs(peak);

const shape = (h: number) => {
    const hod = h % 24;
    const weekday = Math.floor(h / 24) % 7 < 5;
    return (weekday ? 1 : 0.3) * (hod >= 8 && hod < 18 ? 1 : hod >= 18 && hod < 22 ? 0.3 : 0.03);
};
const intervals = Array.from({ length: days * 24 }, (_, h) => ({
    startMs: h * 3_600_000,
    arrivals: {
        chat: peak * 0.5 * shape(h) * (1 + 0.15 * Math.sin(h * 1.7)),
        email: peak * 0.3 * shape(h) * (1 + 0.15 * Math.cos(h * 2.3)),
        phone: peak * 0.2 * shape(h) * (1 + 0.15 * Math.sin(h * 0.9)),
    },
}));
const tags: TagProfile[] = [
    {
        tag: 'chat',
        handleMs: exponentialQuantiles(6 * MIN),
        concurrency: 2,
        targetWaitMs: MIN,
        targetShare: 0.8,
        patienceMs: exponentialQuantiles(4 * MIN),
    },
    { tag: 'email', handleMs: exponentialQuantiles(8 * MIN), targetWaitMs: 30 * MIN, targetShare: 0.8 },
    {
        tag: 'phone',
        handleMs: exponentialQuantiles(5 * MIN),
        targetWaitMs: MIN / 2,
        targetShare: 0.8,
        patienceMs: exponentialQuantiles(2 * MIN),
    },
];
const pool = [
    { tags: ['chat', 'email'], count: 10 },
    { tags: ['phone'], count: 5 },
    { tags: ['chat', 'email', 'phone'], count: 5 },
];
const result = staffingNeed(intervals, tags, pool, { shrinkage: 0.3, seed, budgetMs });
const simulated = result.intervals.filter((i) => i.method === 'simulation');
const peakNeed = Math.max(0, ...result.intervals.map((i) => i.onShift.likely));
const beyondPool = result.intervals.filter((i) => i.exceedsPool).length;
console.info(`peak ${peak}/h · ${days} days hourly · seed ${seed}`);
console.info(
    `hours simulated ${simulated.length} · seeds drawn ${result.simulations} · memo hits ${result.cacheHits} · ` +
        `peak on shift ${peakNeed} · hours beyond the pool ${beyondPool}`,
);
console.info(`time ${result.ms} ms · budget ${budgetMs} ms${result.incomplete ? ' · INCOMPLETE' : ''}`);
if (result.ms > budgetMs || result.incomplete) {
    console.error('over budget');
    process.exit(1);
}
