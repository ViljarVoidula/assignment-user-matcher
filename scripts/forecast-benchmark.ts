/**
 * Forecast benchmark (spec §10–§11): replays past weeks of a seeded synthetic
 * workspace and reports accuracy (WAPE by lead, from the forecast's own
 * rolling-origin backtests) and time per workspace against the budget.
 *
 *   pnpm benchmark:forecast -- [series] [weeks] [seed]
 *
 * Defaults to the worst case the platform stores: the `'*'` total plus 50
 * tags, three years of daily history and 16 weeks of hourly. Exits 1 when the
 * median run is over `FORECAST_BUDGET_MS` (200 ms) — this is the runner that
 * can fail a change.
 *
 * Not named `benchmark-*.ts`: that pattern is git-ignored in this repo.
 */
import { forecastWorkspace } from '../src/forecasting';
import { syntheticHistory } from '../tests/forecasting/synthetic';

const FORECAST_BUDGET_MS = 200;
const RUNS = 7;
const [series = 51, weeks = 156, seed = 1] = process.argv
    .slice(2)
    .filter((a) => a !== '--')
    .map(Number);
const now = Date.parse('2026-10-01T09:00:00Z');

const histories = Array.from({ length: series }, (_, i) =>
    syntheticHistory({
        series: i === 0 ? '*' : `tag-${i}`,
        now,
        weeks,
        weeklyTotal: i === 0 ? 20_000 : Math.round(4_000 / i),
        growthPerWeek: 0.004,
        yearly: { amplitude: 0.2, peakDay: 340 },
        events: [{ from: '2026-08-20', to: '2026-08-22', factor: 1.6, knockOn: { days: 7, factor: 1.15 } }],
        seed: seed * 100 + i,
    }),
);
const occurrences = [
    { label: 'summer-sale', kind: 'sale', from: '2026-08-20', to: '2026-08-22' },
    { label: 'summer-sale', kind: 'sale', from: '2026-10-14', to: '2026-10-16' },
];
const input = { timeZone: 'Europe/Tallinn', now, series: histories, occurrences };

// One warm-up run (module load, JIT), then the timed runs.
let last = forecastWorkspace(input);
const runs: number[] = [];
for (let r = 0; r < RUNS; r++) {
    last = forecastWorkspace(input);
    runs.push(last.ms);
}
runs.sort((a, b) => a - b);
const median = runs[Math.floor(RUNS / 2)];
const total = last.series.find((s) => s.series === '*')!;
const pct = (v: number | null) => (v === null ? '—' : `${(v * 100).toFixed(1)} %`);
const wape = total.accuracy.wape;
console.info(`series ${series} (total + ${series - 1} tags), ${weeks} weeks of daily history, seed ${seed}`);
console.info(
    `WAPE (total, local days): 24h ${pct(wape['24h'])} · 72h ${pct(wape['72h'])} · 7d ${pct(wape['7d'])} · ` +
        `28d ${pct(wape['28d'])} (${total.accuracy.origins} origins, ranges ${total.accuracy.rangesFrom})`,
);
console.info(`yearly factor: ${total.yearly ? 'yes' : 'no'} · spikes: ${last.spikes.length}`);
console.info(
    `time per workspace: median ${median} ms (min ${runs[0]}, max ${runs[RUNS - 1]}) · budget ${FORECAST_BUDGET_MS} ms`,
);
if (median > FORECAST_BUDGET_MS) {
    console.error('over budget');
    process.exit(1);
}
