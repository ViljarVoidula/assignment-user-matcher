import { RedisClientType } from '../types/matcher';
import { KeyBuilders } from '../utils/keys';
import { WorkflowEvent, DeadLetterEntry, AuditEntry, CircuitBreakerState, ReliabilityMetrics } from '../types/matcher';

/**
 * Calculate delay with exponential backoff and jitter
 * to avoid thundering herd problem during retries
 */
function calculateRetryDelay(attempt: number, initialDelay: number, maxDelay: number): number {
    const exponentialDelay = Math.min(initialDelay * Math.pow(2, attempt), maxDelay);
    // Add jitter: ±25% of calculated delay
    const jitter = exponentialDelay * 0.25 * (Math.random() * 2 - 1);
    return Math.max(0, exponentialDelay + jitter);
}

export class ReliabilityManager {
    private circuitBreaker: CircuitBreakerState;
    private metrics: ReliabilityMetrics;
    private persistState: boolean;
    private reconnectCount: number = 0;
    private lastError?: string;
    private redisHealthy: boolean = true;
    private lastConnectedAt: number = Date.now();
    private lastHealthCheckAt?: number;

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
            circuitBreakerPersistState?: boolean;
            circuitBreakerShared?: boolean;
            enableReliabilityMetrics?: boolean;
            deadLetterQueueAlertThreshold?: number;
        },
    ) {
        this.circuitBreaker = {
            state: 'closed',
            failureCount: 0,
            lastFailureTime: 0,
        };
        this.persistState = options.circuitBreakerPersistState ?? false;
        this.metrics = {
            circuitBreakerState: { ...this.circuitBreaker },
            deadLetterQueueSize: 0,
            redisHealthy: true,
            reconnectCount: 0,
            lastConnectedAt: Date.now(),
            circuitBreakerAllowingRequests: true,
        };
    }

    /**
     * Initialize the reliability manager by loading persisted state if enabled
     */
    async init(): Promise<void> {
        if (this.persistState) {
            await this.loadCircuitBreakerState();
        }
        this.updateMetrics();
    }

    /**
     * Load circuit breaker state from Redis for distributed awareness
     */
    private async loadCircuitBreakerState(): Promise<void> {
        try {
            const stateKey = this.keys.circuitBreakerState();
            const stateData = await this.redisClient.hGetAll(stateKey);

            if (stateData.state) {
                this.circuitBreaker = {
                    state: stateData.state as CircuitBreakerState['state'],
                    failureCount: Number(stateData.failureCount) || 0,
                    lastFailureTime: Number(stateData.lastFailureTime) || 0,
                };
                console.log('Loaded circuit breaker state from Redis:', this.circuitBreaker);
            }
        } catch (err) {
            console.error('Failed to load circuit breaker state from Redis:', err);
            // Continue with default state
        }
    }

    /**
     * Save circuit breaker state to Redis for distributed awareness
     */
    private async saveCircuitBreakerState(): Promise<void> {
        if (!this.persistState) return;

        try {
            const stateKey = this.keys.circuitBreakerState();
            await this.redisClient.hSet(stateKey, {
                state: this.circuitBreaker.state,
                failureCount: String(this.circuitBreaker.failureCount),
                lastFailureTime: String(this.circuitBreaker.lastFailureTime),
            });
            // Set TTL to clean up state if circuit breaker stays closed for a long time
            await this.redisClient.expire(stateKey, 86400); // 24 hours
        } catch (err) {
            console.error('Failed to save circuit breaker state to Redis:', err);
        }
    }

    /**
     * Update reliability metrics
     */
    private updateMetrics(): void {
        const now = Date.now();
        const circuitBreakerAllowingRequests =
            this.circuitBreaker.state !== 'open' ||
            now - this.circuitBreaker.lastFailureTime > this.options.workflowCircuitBreakerResetMs;

        this.metrics = {
            circuitBreakerState: { ...this.circuitBreaker },
            deadLetterQueueSize: 0, // Will be updated when needed
            redisHealthy: this.redisHealthy,
            reconnectCount: this.reconnectCount,
            lastError: this.lastError,
            lastConnectedAt: this.lastConnectedAt,
            lastHealthCheckAt: this.lastHealthCheckAt,
            circuitBreakerAllowingRequests,
        };
    }

    /**
     * Get current reliability metrics
     */
    async getMetrics(): Promise<ReliabilityMetrics> {
        // Update DLQ size
        try {
            this.metrics.deadLetterQueueSize = await this.getDeadLetterQueueSize();
        } catch {
            // Keep previous value if fetch fails
        }
        this.updateMetrics();
        return { ...this.metrics };
    }

    /**
     * Update Redis health status (called by health check mechanism)
     */
    updateRedisHealth(isHealthy: boolean, error?: string): void {
        this.redisHealthy = isHealthy;
        if (!isHealthy && error) {
            this.lastError = error;
        } else if (isHealthy) {
            this.lastConnectedAt = Date.now();
            this.lastError = undefined;
        }
        this.updateMetrics();
    }

    /**
     * Update reconnection count (called by connection handler)
     */
    updateReconnectCount(count: number): void {
        this.reconnectCount = count;
        this.updateMetrics();
    }

    /**
     * Update last health check timestamp
     */
    updateHealthCheckTimestamp(): void {
        this.lastHealthCheckAt = Date.now();
        this.updateMetrics();
    }

    /**
     * Move a failed event to the Dead Letter Queue.
     */
    async moveToDeadLetter(event: WorkflowEvent, reason: string, error?: Error): Promise<void> {
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
            await this.emitAuditEvent(
                'EVENT_DLQ',
                event.eventId,
                {
                    reason,
                    workflowInstanceId: event.workflowInstanceId,
                },
                'event',
            );
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
        // Per-event marker (has its own TTL)
        const marker = await this.redisClient.get(this.keys.processedEvent(eventId));
        if (marker) return true;
        // Legacy set-based marker (dual-read for backward compatibility)
        const result = await this.redisClient.sIsMember(this.keys.processedEvents(), eventId);
        return Boolean(result);
    }

    async markEventProcessed(eventId: string): Promise<void> {
        await this.redisClient.set(this.keys.processedEvent(eventId), '1', {
            PX: this.options.workflowIdempotencyTtlMs,
        });
    }

    shouldProcessCircuitBreaker(): boolean {
        const now = Date.now();
        switch (this.circuitBreaker.state) {
            case 'closed':
                return true;
            case 'open':
                if (now - this.circuitBreaker.lastFailureTime > this.options.workflowCircuitBreakerResetMs) {
                    this.circuitBreaker.state = 'half-open';
                    this.saveCircuitBreakerState();
                    this.updateMetrics();
                    return true;
                }
                return false;
            case 'half-open':
                return true;
            default:
                return true;
        }
    }

    recordCircuitBreakerSuccess(): void {
        if (this.circuitBreaker.state === 'half-open') {
            this.circuitBreaker.state = 'closed';
            this.circuitBreaker.failureCount = 0;
            this.saveCircuitBreakerState(); // Persist state change
            if (this.options.circuitBreakerShared) {
                // Reset the shared failure window (fire-and-forget)
                this.redisClient.del(this.keys.circuitBreakerFailures()).catch(() => {});
            }
        }
        this.updateMetrics();
    }

    async recordCircuitBreakerFailure(): Promise<void> {
        this.circuitBreaker.failureCount++;
        this.circuitBreaker.lastFailureTime = Date.now();

        if (this.options.circuitBreakerShared) {
            try {
                const key = this.keys.circuitBreakerFailures();
                const sharedCount = Number(await this.redisClient.incr(key));
                await this.redisClient.pExpire(key, this.options.workflowCircuitBreakerResetMs);
                // Converge on the shared failure count across replicas
                this.circuitBreaker.failureCount = Math.max(this.circuitBreaker.failureCount, sharedCount);
            } catch {
                // Redis unavailable: fall back to local counting
            }
        }

        if (
            this.circuitBreaker.state === 'half-open' ||
            this.circuitBreaker.failureCount >= this.options.workflowCircuitBreakerThreshold
        ) {
            this.circuitBreaker.state = 'open';
            this.saveCircuitBreakerState(); // Persist state change
            console.warn(`Circuit breaker opened after ${this.circuitBreaker.failureCount} failures`);
        }
        this.updateMetrics();
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
        this.updateMetrics();
        return { ...this.circuitBreaker };
    }

    /**
     * Check if Dead Letter Queue size exceeds alert threshold
     */
    async checkDeadLetterQueueAlert(): Promise<boolean> {
        const threshold = this.options.deadLetterQueueAlertThreshold ?? 100;
        const size = await this.getDeadLetterQueueSize();
        return size > threshold;
    }

    /**
     * Perform exponential backoff delay
     * @param attempt Current retry attempt
     * @param initialDelay Initial delay in ms (default: 100)
     * @param maxDelay Maximum delay in ms (default: 5000)
     */
    static async backoff(attempt: number, initialDelay: number = 100, maxDelay: number = 5000): Promise<void> {
        const delay = calculateRetryDelay(attempt, initialDelay, maxDelay);
        await new Promise((resolve) => setTimeout(resolve, delay));
    }
}
