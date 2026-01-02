import { RedisClientType } from '../types/matcher';
import { KeyBuilders } from '../utils/keys';
import { 
    WorkflowEvent, 
    DeadLetterEntry, 
    AuditEntry, 
    CircuitBreakerState
} from '../types/matcher';

export class ReliabilityManager {
    private circuitBreaker: CircuitBreakerState;

    constructor(
        private redisClient: RedisClientType,
        private keys: KeyBuilders,
        public options: {
            workflowMaxRetries: number;
            workflowIdempotencyTtlMs: number;
            workflowCircuitBreakerThreshold: number;
            workflowCircuitBreakerResetMs: number;
            workflowAuditEnabled: boolean;
            workflowSnapshotDefinitions?: boolean;
            streamConsumerName: string;
        }
    ) {
        this.circuitBreaker = {
            state: 'closed',
            failureCount: 0,
            lastFailureTime: 0,
        };
    }

    /**
     * Move a failed event to the Dead Letter Queue.
     */
    async moveToDeadLetter(
        event: WorkflowEvent,
        reason: string,
        error?: Error,
    ): Promise<void> {
        const dlqKey = this.keys.deadLetterQueue();
        const entry: DeadLetterEntry = {
            event,
            reason,
            errorMessage: error?.message,
            errorStack: error?.stack,
            movedAt: Date.now(),
            retryCount: Number(await this.redisClient.get(this.keys.eventRetryCount(event.eventId))) || 0,
        };

        await this.redisClient.zAdd(dlqKey, {
            score: entry.movedAt,
            value: JSON.stringify(entry),
        });

        if (this.options.workflowAuditEnabled) {
            await this.emitAuditEvent('EVENT_DLQ', event.eventId, {
                reason,
                workflowInstanceId: event.workflowInstanceId,
            }, 'event');
        }
    }

    async getDeadLetterEvents(limit: number = 100, offset: number = 0): Promise<DeadLetterEntry[]> {
        const dlqKey = this.keys.deadLetterQueue();
        const entries = await this.redisClient.zRange(dlqKey, offset, offset + limit - 1);
        return entries.map((e) => JSON.parse(e));
    }

    async getDeadLetterQueueSize(): Promise<number> {
        return await this.redisClient.zCard(this.keys.deadLetterQueue());
    }

    async clearDeadLetterQueue(): Promise<number> {
        const dlqKey = this.keys.deadLetterQueue();
        const count = await this.redisClient.zCard(dlqKey);
        await this.redisClient.del(dlqKey);
        return count;
    }

    async isEventProcessed(eventId: string): Promise<boolean> {
        const key = this.keys.processedEvents();
        const result = await this.redisClient.sIsMember(key, eventId);
        return Boolean(result);
    }

    async markEventProcessed(eventId: string): Promise<void> {
        const key = this.keys.processedEvents();
        await this.redisClient.sAdd(key, eventId);
        await this.redisClient.expire(key, Math.floor(this.options.workflowIdempotencyTtlMs / 1000));
    }

    shouldProcessCircuitBreaker(): boolean {
        const now = Date.now();
        switch (this.circuitBreaker.state) {
            case 'closed': return true;
            case 'open':
                if (now - this.circuitBreaker.lastFailureTime > this.options.workflowCircuitBreakerResetMs) {
                    this.circuitBreaker.state = 'half-open';
                    return true;
                }
                return false;
            case 'half-open': return true;
            default: return true;
        }
    }

    recordCircuitBreakerSuccess(): void {
        if (this.circuitBreaker.state === 'half-open') {
            this.circuitBreaker.state = 'closed';
            this.circuitBreaker.failureCount = 0;
        }
    }

    recordCircuitBreakerFailure(): void {
        this.circuitBreaker.failureCount++;
        this.circuitBreaker.lastFailureTime = Date.now();
        if (this.circuitBreaker.state === 'half-open' || 
            this.circuitBreaker.failureCount >= this.options.workflowCircuitBreakerThreshold) {
            this.circuitBreaker.state = 'open';
        }
    }

    async emitAuditEvent(
        action: string,
        resourceId: string,
        details?: Record<string, any>,
        resourceType: string = 'workflow',
    ): Promise<void> {
        if (!this.options.workflowAuditEnabled) return;
        const streamKey = this.keys.workflowAuditStream();
        const entry: AuditEntry = {
            timestamp: Date.now(),
            action,
            resourceId,
            resourceType,
            consumerId: this.options.streamConsumerName,
            details,
        };
        await this.redisClient.xAdd(streamKey, '*', { data: JSON.stringify(entry) });
        await this.redisClient.xTrim(streamKey, 'MAXLEN', 10000);
    }

    async getAuditEvents(count: number = 100): Promise<AuditEntry[]> {
        const streamKey = this.keys.workflowAuditStream();
        const entries = await this.redisClient.xRevRange(streamKey, '+', '-', { COUNT: count });
        return entries.map((e) => JSON.parse(e.message.data));
    }

    getCircuitBreakerState(): CircuitBreakerState {
        return { ...this.circuitBreaker };
    }
}
