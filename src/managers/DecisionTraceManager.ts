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
            const multi = this.redisClient.multi();
            for (const trace of traces) {
                multi.xAdd(streamKey, '*', { trace: JSON.stringify(trace) });
            }
            multi.xTrim(streamKey, 'MAXLEN', this.options.maxEntries);
            await multi.exec();
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

    /** Query recorded traces, newest first. */
    async getTraces(query?: DecisionTraceQuery): Promise<MatchDecisionTrace[]> {
        const limit = query?.limit ?? 50;
        if (limit <= 0) return [];
        const filtered = Boolean(query?.assignmentId || query?.userId);
        // Unfiltered reads only need `limit` entries; filtered reads scan the
        // whole (capped) stream, which is bounded by maxEntries.
        const count = filtered ? this.options.maxEntries : limit;
        const entries = await this.redisClient.xRevRange(this.keys.decisionTraces(), '+', '-', { COUNT: count });

        const results: MatchDecisionTrace[] = [];
        for (const entry of entries) {
            let trace: MatchDecisionTrace;
            try {
                trace = JSON.parse((entry as any).message.trace);
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
        return this.redisClient.del(this.keys.decisionTraces());
    }
}
