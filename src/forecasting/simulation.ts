/**
 * Discrete-event simulation of one staffing interval under the router's own
 * rules, simplified but faithful:
 *
 * - A person can take a tag, and ranks it, exactly as the router scores it:
 *   `calculateMatchScore(user, tag, 0, false)` — summed positive routing
 *   weights (exact and wildcard), any matching weight 0 a veto, and without
 *   weights the share of the person's tags the task matches. Score 0 = never
 *   offered. A free person picks the waiting task with the highest
 *   `priority + score` (the router's combined priority), oldest first on a
 *   tie. An arriving task goes to the best-scoring people who can fit it,
 *   onto somebody part-busy before somebody idle (packing keeps whole people
 *   free for work that needs a whole person).
 * - Each person holds up to one unit of work; a task of a tag with
 *   concurrency c takes 1/c of it.
 * - Handle times and patience are drawn from the tag's measured distribution,
 *   never a mean. A task still queued when its patience runs out leaves, and
 *   counts as not served — also when it leaves before the target wait.
 * - Arrivals are Poisson around a rate that is itself Gamma-noised around the
 *   forecast (overdispersion), over a warm-up, the interval, and a tail as long
 *   as the longest target, so the interval starts busy and its last arrivals
 *   are judged on a full wait. The warm-up opens with the work a floor at that
 *   rate already has in hand, so a short warm-up still starts near steady state.
 *
 * One person is one person: a multi-skilled worker is a single head serving
 * every tag they cover, never counted once per tag.
 *
 * Consecutive intervals can be chained: `simulate` hands back what is still
 * queued or in progress when the interval ends (a `Carry`), and `drawTasks`
 * opens the next interval with it instead of a warm-up.
 */
import { calculateMatchScore } from '../scoring/match-score';
import type { User } from '../types/matcher';
import { meanOf, sampleGammaMeanOne, samplePoisson, sampleQuantiles } from './distributions';
import type { PoolMember, QuantileDistribution, TagProfile } from './types';

const EPS = 1e-9;

export interface SimTag {
    profile: TagProfile;
    /** Units of a person one task takes: 1 / concurrency. */
    cost: number;
    priority: number;
}

/** One seed's arrivals for one interval, as parallel arrays sorted by arrival time. */
export interface SimTasks {
    tag: Int32Array;
    at: Float64Array;
    handle: Float64Array;
    leaveAt: Float64Array;
    /** 1 when the task arrived inside the interval (the ones the service level is judged on). */
    measured: Uint8Array;
    /** Measured arrivals per tag. */
    measuredByTag: Int32Array;
    /** This seed's arrival rate per tag (per ms) after the overdispersion draw. */
    rate: Float64Array;
}

/**
 * Work still on the floor when an interval ends, in the order it is picked up again: tasks in progress
 * first (their remaining handle time, never leaving), then the queue oldest first (time left before each
 * gives up).
 */
export interface Carry {
    tag: Int32Array;
    handle: Float64Array;
    leaveIn: Float64Array;
    /** The first `inProgress` entries are in someone's hands; the rest are queued. */
    inProgress: number;
}

/** A carry `ms` later with nobody working it: work in progress runs down, the queue loses whoever gave up. */
export function ageCarry(carry: Carry, ms: number): Carry {
    const busy = (i: number) => i < carry.inProgress;
    const keep: number[] = [];
    for (let i = 0; i < carry.tag.length; i++) {
        if ((busy(i) ? carry.handle[i] : carry.leaveIn[i]) - ms > 0) keep.push(i);
    }
    return {
        tag: Int32Array.from(keep, (i) => carry.tag[i]),
        handle: Float64Array.from(keep, (i) => (busy(i) ? carry.handle[i] - ms : carry.handle[i])),
        leaveIn: Float64Array.from(keep, (i) => (busy(i) ? Infinity : carry.leaveIn[i] - ms)),
        inProgress: keep.filter(busy).length,
    };
}

export interface SimWindow {
    warmMs: number;
    lengthMs: number;
    tailMs: number;
}

/**
 * What a run did besides serving, for validating the simulation against queueing theory. Counts are of
 * measured arrivals only.
 */
export interface SimStats {
    /** Arrivals that found nobody free to take them and queued. */
    delayed: Int32Array;
    /** Queued arrivals whose patience ran out before anybody took them (by the end of the tail). */
    abandoned: Int32Array;
    /** The most work any one person held at once, in units of a person (≤ 1). */
    maxUsed: number;
}

export function createSimStats(nTags: number): SimStats {
    return { delayed: new Int32Array(nTags), abandoned: new Int32Array(nTags), maxUsed: 0 };
}

/** The router's score per tag for one declared profile (`calculateMatchScore`); -1 = never offered. */
export function profileScores(member: Pick<PoolMember, 'tags' | 'weights'>, tags: readonly SimTag[]): Float64Array {
    const user = { id: 'sim', tags: member.tags, routingWeights: member.weights } as User;
    const out = new Float64Array(tags.length);
    tags.forEach((t, i) => {
        const [score] = calculateMatchScore(user, t.profile.tag, 0, false);
        out[i] = score > 0 ? score : -1;
    });
    return out;
}

/**
 * Time left on a task found in progress at a random moment: a length-biased draw (a long task is more likely
 * to be the one in progress), cut at a uniform point. Rejection-sampled against the distribution's maximum.
 */
function residualHandle(d: QuantileDistribution, rand: () => number): number {
    const top = d.q[d.q.length - 1];
    for (let i = 0; i < 64 && top > 0; i++) {
        const h = sampleQuantiles(d, rand);
        if (rand() * top <= h) return rand() * h;
    }
    return rand() * sampleQuantiles(d, rand);
}

/**
 * Draws one seed's arrivals. Deterministic in `rand`. Each tag's arrivals are a Poisson process (exponential
 * gaps, so already in time order) at a rate Gamma-noised around the forecast; the tags' streams are then
 * merged, earliest first and the lower tag index on a tie.
 */
export function drawTasks(
    expected: readonly number[],
    tags: readonly SimTag[],
    window: SimWindow,
    overdispersion: number,
    rand: () => number,
    carry?: Carry | null,
): SimTasks {
    const from = -window.warmMs;
    const until = window.lengthMs + window.tailMs;
    const measuredByTag = new Int32Array(tags.length);
    const rates = new Float64Array(tags.length);
    const streams: Array<{ at: number[]; handle: number[]; leaveAt: number[] }> = [];
    let total = 0;
    tags.forEach((t, g) => {
        const stream = { at: [] as number[], handle: [] as number[], leaveAt: [] as number[] };
        streams.push(stream);
        const mean = expected[g] ?? 0;
        if (mean <= 0) return;
        const rate = (mean * sampleGammaMeanOne(overdispersion, rand)) / window.lengthMs;
        rates[g] = rate;
        const patience = () => (t.profile.patienceMs ? sampleQuantiles(t.profile.patienceMs, rand) : Infinity);
        // Already in hand when the warm-up starts: the tasks a busy floor holds at this rate (Little's law),
        // each with the rest of its handle time. Without them every run starts from an empty floor and the
        // warm-up is too short to fill it, which reads a near-critical hour as better served than it is.
        // A chained interval opens with the previous one's actual leftovers instead.
        const inHand = carry ? 0 : samplePoisson(rate * meanOf(t.profile.handleMs), rand);
        for (let i = 0; i < inHand; i++) {
            stream.at.push(from);
            stream.handle.push(Math.max(1, residualHandle(t.profile.handleMs, rand)));
            stream.leaveAt.push(from + patience());
        }
        for (let at = from - Math.log(1 - rand()) / rate; at < until; at -= Math.log(1 - rand()) / rate) {
            stream.at.push(at);
            stream.handle.push(Math.max(1, sampleQuantiles(t.profile.handleMs, rand)));
            stream.leaveAt.push(at + patience());
            if (at >= 0 && at < window.lengthMs) measuredByTag[g] += 1;
        }
        total += stream.at.length;
    });
    const carried = carry ? carry.tag.length : 0;
    total += carried;
    const out: SimTasks = {
        tag: new Int32Array(total),
        at: new Float64Array(total),
        handle: new Float64Array(total),
        leaveAt: new Float64Array(total),
        measured: new Uint8Array(total),
        measuredByTag,
        rate: rates,
    };
    for (let i = 0; i < carried; i++) {
        out.tag[i] = carry!.tag[i];
        out.at[i] = from;
        out.handle[i] = Math.max(1, carry!.handle[i]);
        out.leaveAt[i] = from + carry!.leaveIn[i];
    }
    const next = new Int32Array(tags.length);
    for (let i = carried; i < total; i++) {
        let g = -1;
        for (let k = 0; k < streams.length; k++) {
            if (next[k] < streams[k].at.length && (g < 0 || streams[k].at[next[k]] < streams[g].at[next[g]])) g = k;
        }
        const j = next[g]++;
        const at = streams[g].at[j];
        out.tag[i] = g;
        out.at[i] = at;
        out.handle[i] = streams[g].handle[j];
        out.leaveAt[i] = streams[g].leaveAt[j];
        out.measured[i] = at >= 0 && at < window.lengthMs ? 1 : 0;
    }
    return out;
}

/** A min-heap of completion times with the worker and the units they free, on typed arrays. */
class Completions {
    private time = new Float64Array(64);
    private worker = new Int32Array(64);
    private cost = new Float64Array(64);
    private task = new Int32Array(64);
    size = 0;
    lastWorker = -1;
    lastCost = 0;
    /** Task and completion time of the k-th entry (heap order), for a snapshot. */
    taskAt(k: number): number {
        return this.task[k];
    }
    timeAt(k: number): number {
        return this.time[k];
    }
    peek(): number {
        return this.size > 0 ? this.time[0] : Infinity;
    }
    push(t: number, w: number, c: number, task: number): void {
        if (this.size === this.time.length) this.grow();
        let i = this.size++;
        while (i > 0) {
            const p = (i - 1) >> 1;
            if (this.time[p] <= t) break;
            this.move(p, i);
            i = p;
        }
        this.time[i] = t;
        this.worker[i] = w;
        this.cost[i] = c;
        this.task[i] = task;
    }
    private move(from: number, to: number): void {
        this.time[to] = this.time[from];
        this.worker[to] = this.worker[from];
        this.cost[to] = this.cost[from];
        this.task[to] = this.task[from];
    }
    /** Removes the earliest completion; read `lastWorker` / `lastCost` for what it freed. */
    pop(): void {
        this.lastWorker = this.worker[0];
        this.lastCost = this.cost[0];
        const n = --this.size;
        const t = this.time[n];
        const w = this.worker[n];
        const c = this.cost[n];
        const task = this.task[n];
        let i = 0;
        for (;;) {
            const l = 2 * i + 1;
            if (l >= n) break;
            const r = l + 1;
            const m = r < n && this.time[r] < this.time[l] ? r : l;
            if (this.time[m] >= t) break;
            this.move(m, i);
            i = m;
        }
        this.time[i] = t;
        this.worker[i] = w;
        this.cost[i] = c;
        this.task[i] = task;
    }
    private grow(): void {
        const time = new Float64Array(this.time.length * 2);
        const worker = new Int32Array(this.worker.length * 2);
        const cost = new Float64Array(this.cost.length * 2);
        const task = new Int32Array(this.task.length * 2);
        time.set(this.time);
        worker.set(this.worker);
        cost.set(this.cost);
        task.set(this.task);
        this.time = time;
        this.worker = worker;
        this.cost = cost;
        this.task = task;
    }
}

/**
 * Runs one interval with `team[p]` people of each pool profile `pool[p]` and
 * returns, per tag, how many measured arrivals were picked up within target.
 *
 * An arriving task goes to the highest-scoring profile with somebody who can
 * fit it — a part-busy person before an idle one — and waits in its tag's
 * queue otherwise. A person who frees up takes the best waiting task they can
 * fit. With `out`, what is still queued or in progress at the interval's end
 * comes back as `out.carry`.
 */
export function simulate(
    tasks: SimTasks,
    pool: readonly Float64Array[],
    team: readonly number[],
    tags: readonly SimTag[],
    window: SimWindow,
    stats?: SimStats,
    out?: { carry: Carry | null },
): Int32Array {
    const nTags = tags.length;
    const end = window.lengthMs + window.tailMs;
    const profileOf: number[] = [];
    team.forEach((k, p) => {
        for (let i = 0; i < k; i++) profileOf.push(p);
    });
    const people = profileOf.length;
    const used = new Float64Array(people);
    const eligible = pool.map((scores) => {
        const out: number[] = [];
        for (let g = 0; g < nTags; g++) if (scores[g] >= 0) out.push(g);
        return out;
    });
    // Per tag: groups of profiles that score it equally, best first.
    const tiers: number[][][] = tags.map((_, g) => {
        const able = pool.map((_s, p) => p).filter((p) => pool[p][g] >= 0 && team[p] > 0);
        able.sort((a, b) => pool[b][g] - pool[a][g] || a - b);
        const out: number[][] = [];
        for (const p of able) {
            const last = out[out.length - 1];
            if (last && pool[last[0]][g] === pool[p][g]) last.push(p);
            else out.push([p]);
        }
        return out;
    });
    // Idle people per profile (a stack), part-busy people per profile (swap-remove list).
    const idle: number[][] = pool.map(() => []);
    const partial: number[][] = pool.map(() => []);
    const partialPos = new Int32Array(people).fill(-1);
    for (let w = people - 1; w >= 0; w--) idle[profileOf[w]].push(w);
    const leavePartial = (w: number) => {
        const pos = partialPos[w];
        if (pos < 0) return;
        const list = partial[profileOf[w]];
        const last = list.pop()!;
        if (last !== w) {
            list[pos] = last;
            partialPos[last] = pos;
        }
        partialPos[w] = -1;
    };
    /** Files a person under part-busy, or takes them off it, after their load changed (idle is the caller's). */
    const refile = (w: number) => {
        if (used[w] > EPS && used[w] < 1 - EPS) {
            if (partialPos[w] < 0) {
                const list = partial[profileOf[w]];
                partialPos[w] = list.length;
                list.push(w);
            }
        } else leavePartial(w);
    };

    const queues: number[][] = Array.from({ length: nTags }, () => []);
    const heads = new Int32Array(nTags);
    const served = new Int32Array(nTags);
    const started = stats ? new Uint8Array(tasks.at.length) : null;
    const completions = new Completions();

    const start = (i: number, w: number, t: number) => {
        const g = tasks.tag[i];
        if (tasks.measured[i] && t - tasks.at[i] <= tags[g].profile.targetWaitMs + EPS) served[g] += 1;
        used[w] += tags[g].cost;
        if (stats) {
            started![i] = 1;
            if (used[w] > stats.maxUsed) stats.maxUsed = used[w];
        }
        refile(w);
        completions.push(t + tasks.handle[i], w, tags[g].cost, i);
    };
    const headOf = (g: number, t: number): number => {
        const q = queues[g];
        while (heads[g] < q.length && tasks.leaveAt[q[heads[g]]] <= t) heads[g] += 1;
        return heads[g] < q.length ? q[heads[g]] : -1;
    };
    const serve = (w: number, t: number) => {
        const scores = pool[profileOf[w]];
        for (;;) {
            let best = -1;
            let bestKey = -Infinity;
            for (const g of eligible[profileOf[w]]) {
                if (used[w] + tags[g].cost > 1 + EPS) continue;
                const i = headOf(g, t);
                if (i < 0) continue;
                const key = tags[g].priority + scores[g];
                if (best < 0 || key > bestKey || (key === bestKey && tasks.at[i] < tasks.at[best])) {
                    best = i;
                    bestKey = key;
                }
            }
            if (best < 0) return;
            heads[tasks.tag[best]] += 1;
            start(best, w, t);
        }
    };
    const assign = (i: number, t: number): boolean => {
        const g = tasks.tag[i];
        const cost = tags[g].cost;
        for (const tier of tiers[g]) {
            if (cost < 1 - EPS) {
                for (const p of tier) {
                    for (const w of partial[p]) {
                        if (used[w] + cost <= 1 + EPS) {
                            start(i, w, t);
                            return true;
                        }
                    }
                }
            }
            for (const p of tier) {
                const w = idle[p].pop();
                if (w !== undefined) {
                    start(i, w, t);
                    return true;
                }
            }
        }
        return false;
    };

    const snapshotAt = window.lengthMs;
    /** What is on the floor at the interval's end: in progress first, then the queue oldest first. */
    const snapshot = (): Carry => {
        const inProgress: number[] = [];
        for (let k = 0; k < completions.size; k++) inProgress.push(k);
        inProgress.sort((a, b) => completions.taskAt(a) - completions.taskAt(b));
        const waiting: number[] = [];
        for (let g = 0; g < nTags; g++) {
            for (let j = heads[g]; j < queues[g].length; j++) {
                if (tasks.leaveAt[queues[g][j]] > snapshotAt) waiting.push(queues[g][j]);
            }
        }
        waiting.sort((a, b) => a - b);
        const count = inProgress.length + waiting.length;
        const carry: Carry = {
            tag: new Int32Array(count),
            handle: new Float64Array(count),
            leaveIn: new Float64Array(count),
            inProgress: inProgress.length,
        };
        inProgress.forEach((k, j) => {
            carry.tag[j] = tasks.tag[completions.taskAt(k)];
            carry.handle[j] = completions.timeAt(k) - snapshotAt;
            carry.leaveIn[j] = Infinity;
        });
        waiting.forEach((i, j) => {
            const at = inProgress.length + j;
            carry.tag[at] = tasks.tag[i];
            carry.handle[at] = tasks.handle[i];
            carry.leaveIn[at] = tasks.leaveAt[i] - snapshotAt;
        });
        return carry;
    };

    let next = 0;
    const n = tasks.at.length;
    for (;;) {
        const tA = next < n ? tasks.at[next] : Infinity;
        const tC = completions.peek();
        const t = tA < tC ? tA : tC;
        if (out && !out.carry && t > snapshotAt) out.carry = snapshot();
        if (t > end || t === Infinity) break;
        if (tC <= tA) {
            completions.pop();
            const w = completions.lastWorker;
            used[w] -= completions.lastCost;
            if (used[w] <= EPS) used[w] = 0;
            // Freed capacity goes to the queue first; somebody it leaves with nothing is idle again.
            serve(w, t);
            refile(w);
            if (used[w] === 0) idle[profileOf[w]].push(w);
            continue;
        }
        const i = next++;
        if (!assign(i, t)) {
            queues[tasks.tag[i]].push(i);
            if (stats && tasks.measured[i]) stats.delayed[tasks.tag[i]] += 1;
        }
    }
    if (stats) {
        for (let i = 0; i < n; i++) {
            if (tasks.measured[i] && !started![i] && tasks.leaveAt[i] <= end) stats.abandoned[tasks.tag[i]] += 1;
        }
    }
    return served;
}
