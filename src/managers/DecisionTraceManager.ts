/**
 * Decision trace persistence and querying.
 *
 * Traces are appended to a capped Redis stream (keys.decisionTraces()) so the
 * audit record survives process restarts and is shared across replicas.
 * Assembly of the traces themselves is pure and lives in
 * src/tracing/decision-trace.ts; this manager only handles I/O and the
 * real-time onDecision hook.
 */
import type { DecisionTraceQuery, MatchDecisionTrace, RedisClientType } from '../types/matcher';
import type { KeyBuilders } from '../utils/keys';

export interface DecisionTraceManagerOptions {
    /** Maximum entries retained in the trace stream */
    maxEntries: number;
    /** Real-time hook invoked per recorded trace; errors are swallowed */
    onDecision?: (trace: MatchDecisionTrace) => void;
}

export class DecisionTraceManager {
    constructor(
        private redisClient: RedisClientType,
        private keys: KeyBuilders,
        private options: DecisionTraceManagerOptions,
    ) {}

    get hasDecisionHook(): boolean {
        return typeof this.options.onDecision === 'function';
    }

    /**
     * Persist traces (when `persist`) and emit each to the onDecision hook.
     * Consumer callback errors never propagate into the matching pass.
     */
    async record(traces: MatchDecisionTrace[], persist: boolean): Promise<void> {
        if (traces.length === 0) return;

        if (persist) {
            const streamKey = this.keys.decisionTraces();
            // Append and index in one step: a process dying between the two
            // would leave entries no lookup could ever find.
            const reply = (await this.redisClient.eval(RECORD_AND_INDEX, {
                keys: [
                    streamKey,
                    this.keys.decisionTraceIndexedSince(),
                    ...traces.map((trace) => this.keys.decisionTraceIndex(trace.assignmentId)),
                ],
                arguments: traces.flatMap((trace) => [JSON.stringify(trace), trace.assignmentId]),
            })) as unknown[];
            await this.trim(streamKey, Number(reply[reply.length - 1]));
        }

        if (this.options.onDecision) {
            for (const trace of traces) {
                try {
                    this.options.onDecision(trace);
                } catch {
                    // The hook is observability, not control flow.
                }
            }
        }
    }

    /**
     * Cap the stream at `maxEntries`, unindexing what falls off first so the
     * per-assignment index and the stream always describe the same entries.
     */
    private async trim(streamKey: string, length: number): Promise<void> {
        const overflow = length - this.options.maxEntries;
        if (overflow <= 0) return;
        const doomed = await this.redisClient.xRange(streamKey, '-', '+', { COUNT: overflow });
        // Another replica's trim, or a clear, got there first: XDEL with no ids is an error.
        if (doomed.length === 0) return;
        const multi = this.redisClient.multi();
        for (const entry of doomed) {
            const assignmentId = (entry as StreamEntry).message.assignmentId;
            if (assignmentId) multi.lRem(this.keys.decisionTraceIndex(assignmentId), 1, (entry as StreamEntry).id);
        }
        // Exactly the entries just unindexed, never "down to maxEntries": another
        // replica appending meanwhile would otherwise lose entries nobody had
        // taken out of the index — or, worse, keep ones somebody had.
        multi.xDel(
            streamKey,
            doomed.map((entry) => (entry as StreamEntry).id),
        );
        await multi.exec();
    }

    /** Query recorded traces, newest first. */
    async getTraces(query?: DecisionTraceQuery): Promise<MatchDecisionTrace[]> {
        const limit = query?.limit ?? 50;
        if (limit <= 0) return [];
        if (query?.assignmentId) return this.tracesOfAssignment(query.assignmentId, query.userId, limit);
        // Unfiltered reads only need `limit` entries; a user filter scans the
        // whole (capped) stream, which is bounded by maxEntries.
        const count = query?.userId ? this.options.maxEntries : limit;
        const entries = await this.redisClient.xRevRange(this.keys.decisionTraces(), '+', '-', { COUNT: count });
        return this.collect(entries, query, limit);
    }

    /**
     * One assignment's traces through its index: a handful of point reads
     * instead of parsing the whole stream, which on every task read and every
     * completion was most of a busy API's CPU. Entries written before the index
     * existed are still found, by a scan confined to them.
     */
    private async tracesOfAssignment(
        assignmentId: string,
        userId: string | undefined,
        limit: number,
    ): Promise<MatchDecisionTrace[]> {
        const streamKey = this.keys.decisionTraces();
        const ids = (await this.redisClient.lRange(this.keys.decisionTraceIndex(assignmentId), 0, -1)).sort((a, b) =>
            compareStreamIds(b, a),
        );
        const query = { assignmentId, userId };
        if (ids.length > 0) {
            const multi = this.redisClient.multi();
            for (const id of ids) multi.xRange(streamKey, id, id);
            const found = ((await multi.exec()) as unknown as unknown[][]).flat();
            const results = this.collect(found, query, limit);
            if (results.length >= limit) return results;
            const seen = new Set(results.map((trace) => trace.id));
            const older = await this.legacyTraces(streamKey, query, limit - results.length);
            return [...results, ...older.filter((trace) => !seen.has(trace.id))];
        }
        return this.legacyTraces(streamKey, query, limit);
    }

    /** Traces from before the index: everything, if nothing was ever indexed; else only what predates it. */
    private async legacyTraces(streamKey: string, query: DecisionTraceQuery, limit: number): Promise<MatchDecisionTrace[]> {
        const since = await this.redisClient.get(this.keys.decisionTraceIndexedSince());
        if (since) {
            const [oldest] = await this.redisClient.xRange(streamKey, '-', '+', { COUNT: 1 });
            // The stream has rolled past the last unindexed entry: nothing to scan.
            if (!oldest || compareStreamIds((oldest as StreamEntry).id, since) >= 0) return [];
        }
        const entries = await this.redisClient.xRevRange(streamKey, since ? `(${since}` : '+', '-', {
            COUNT: this.options.maxEntries,
        });
        return this.collect(entries, query, limit);
    }

    private collect(entries: unknown[], query: DecisionTraceQuery | undefined, limit: number): MatchDecisionTrace[] {
        const results: MatchDecisionTrace[] = [];
        for (const entry of entries) {
            let trace: MatchDecisionTrace;
            try {
                trace = JSON.parse((entry as StreamEntry).message.trace ?? '');
            } catch {
                continue;
            }
            if (query?.assignmentId && trace.assignmentId !== query.assignmentId) continue;
            if (query?.userId && trace.chosenUserId !== query.userId) continue;
            results.push(trace);
            if (results.length >= limit) break;
        }
        return results;
    }

    /** Delete every stored trace. Returns 1 when the stream existed. */
    async clear(): Promise<number> {
        const streamKey = this.keys.decisionTraces();
        const entries = await this.redisClient.xRange(streamKey, '-', '+');
        const indexKeys = new Set<string>();
        for (const entry of entries) {
            const assignmentId = (entry as StreamEntry).message.assignmentId;
            if (assignmentId) indexKeys.add(this.keys.decisionTraceIndex(assignmentId));
        }
        if (indexKeys.size > 0) await this.redisClient.del([...indexKeys]);
        await this.redisClient.del(this.keys.decisionTraceIndexedSince());
        return this.redisClient.del(streamKey);
    }
}

/**
 * KEYS: stream, indexed-since marker, then one index list per trace.
 * ARGV: trace JSON and assignment id, per trace. Returns the new ids, then the
 * stream length. No TTL on the index: the stream is kept by count, not time,
 * so a quiet workspace may hold a trace for months, and only `trim` and
 * `clear` — which remove its entry — may remove its index.
 */
const RECORD_AND_INDEX = `
local ids = {}
for i = 3, #KEYS do
    local at = (i - 3) * 2
    local id = redis.call('XADD', KEYS[1], '*', 'trace', ARGV[at + 1], 'assignmentId', ARGV[at + 2])
    redis.call('LPUSH', KEYS[i], id)
    ids[#ids + 1] = id
end
redis.call('SET', KEYS[2], ids[1], 'NX')
ids[#ids + 1] = redis.call('XLEN', KEYS[1])
return ids`;

/** A stream entry as node-redis returns it. */
type StreamEntry = { id: string; message: Record<string, string | undefined> };

/** Orders `ms-seq` stream ids numerically. */
function compareStreamIds(a: string, b: string): number {
    const [aMs, aSeq] = a.split('-').map(Number);
    const [bMs, bSeq] = b.split('-').map(Number);
    return aMs !== bMs ? aMs - bMs : aSeq - bSeq;
}
