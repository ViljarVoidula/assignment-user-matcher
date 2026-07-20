import { expect } from 'chai';
import { createClient } from 'redis';
import sinon from 'sinon';
import { ReliabilityManager } from '../src/managers/ReliabilityManager';
import { createKeyBuilders } from '../src/utils/keys';
import { WorkflowEvent } from '../src/types/matcher';

describe('ReliabilityManager', function () {
    let redisClient: any;
    let reliabilityManager: ReliabilityManager;
    const keys = createKeyBuilders({ prefix: 'test:' });

    before(async function () {
        redisClient = createClient();
        await redisClient.connect();
        await redisClient.flushAll();

        reliabilityManager = new ReliabilityManager(redisClient, keys, {
            workflowMaxRetries: 3,
            workflowIdempotencyTtlMs: 1000,
            workflowCircuitBreakerThreshold: 2,
            workflowCircuitBreakerResetMs: 500,
            workflowAuditEnabled: true,
            streamConsumerName: 'test-consumer',
        });
    });

    after(async function () {
        await redisClient.flushAll();
        await redisClient.quit();
    });

    describe('Dead Letter Queue', function () {
        it('should move an event to DLQ', async function () {
            const event: WorkflowEvent = {
                eventId: 'event-1',
                type: 'COMPLETED',
                userId: 'user-1',
                assignmentId: 'asgn-1',
                timestamp: Date.now(),
            };

            await reliabilityManager.moveToDeadLetter(event, 'Test failure', new Error('Something went wrong'));

            const size = await reliabilityManager.getDeadLetterQueueSize();
            expect(size).to.equal(1);

            const events = await reliabilityManager.getDeadLetterEvents();
            expect(events).to.have.lengthOf(1);
            expect(events[0].event.eventId).to.equal('event-1');
            expect(events[0].reason).to.equal('Test failure');
            expect(events[0].errorMessage).to.equal('Something went wrong');
        });

        it('should clear the DLQ', async function () {
            await reliabilityManager.clearDeadLetterQueue();
            const size = await reliabilityManager.getDeadLetterQueueSize();
            expect(size).to.equal(0);
        });
    });

    describe('Idempotency', function () {
        it('should mark and check if an event is processed', async function () {
            const eventId = 'event-2';
            let isProcessed = await reliabilityManager.isEventProcessed(eventId);
            expect(isProcessed).to.be.false;

            await reliabilityManager.markEventProcessed(eventId);
            isProcessed = await reliabilityManager.isEventProcessed(eventId);
            expect(isProcessed).to.be.true;
        });

        it('should expire idempotency keys', async function () {
            this.timeout(3000);
            const eventId = 'event-3';
            await reliabilityManager.markEventProcessed(eventId);

            // Wait for TTL (1000ms)
            await new Promise((resolve) => setTimeout(resolve, 1100));

            const isProcessed = await reliabilityManager.isEventProcessed(eventId);
            expect(isProcessed).to.be.false;
        });
    });

    describe('Circuit Breaker', function () {
        it('should open circuit after threshold failures', async function () {
            expect(reliabilityManager.shouldProcessCircuitBreaker()).to.be.true;

            reliabilityManager.recordCircuitBreakerFailure();
            expect(reliabilityManager.shouldProcessCircuitBreaker()).to.be.true;

            reliabilityManager.recordCircuitBreakerFailure();
            // Threshold is 2, so after 2 failures it should be open
            expect(reliabilityManager.shouldProcessCircuitBreaker()).to.be.false;
        });

        it('should reset circuit after reset timeout', async function () {
            this.timeout(2000);
            // Circuit is open from previous test
            expect(reliabilityManager.shouldProcessCircuitBreaker()).to.be.false;

            await new Promise((resolve) => setTimeout(resolve, 600));

            // Should be half-open/closed now
            expect(reliabilityManager.shouldProcessCircuitBreaker()).to.be.true;
        });

        it('should close circuit after success in half-open state', async function () {
            // Trigger open state again
            reliabilityManager.recordCircuitBreakerFailure();
            reliabilityManager.recordCircuitBreakerFailure();
            expect(reliabilityManager.shouldProcessCircuitBreaker()).to.be.false;

            // Wait for reset
            await new Promise((resolve) => setTimeout(resolve, 600));

            // Now in half-open (shouldProcess returns true)
            expect(reliabilityManager.shouldProcessCircuitBreaker()).to.be.true;

            // Record success
            reliabilityManager.recordCircuitBreakerSuccess();

            // Should be closed now
            expect(reliabilityManager.shouldProcessCircuitBreaker()).to.be.true;

            // One failure should not open it (threshold is 2)
            reliabilityManager.recordCircuitBreakerFailure();
            expect(reliabilityManager.shouldProcessCircuitBreaker()).to.be.true;
        });
    });

    describe('Audit Log', function () {
        it('should emit and retrieve audit logs', async function () {
            const eventId = 'event-audit';
            await reliabilityManager.emitAuditEvent('STEP_STARTED', eventId, { foo: 'bar' }, 'workflow_instance');

            const logs = await reliabilityManager.getAuditEvents();
            expect(logs).to.be.an('array');
            expect(logs.length).to.be.at.least(1);

            const log = logs.find((l: any) => l.resourceId === eventId);
            expect(log).to.exist;
            expect(log?.action).to.equal('STEP_STARTED');
            expect(log?.resourceType).to.equal('workflow_instance');
            expect(log?.details).to.deep.equal({ foo: 'bar' });
        });

        it('should skip audit event when audit is disabled', async function () {
            const mgr = new ReliabilityManager(redisClient, keys, {
                workflowMaxRetries: 3,
                workflowIdempotencyTtlMs: 5000,
                workflowCircuitBreakerThreshold: 2,
                workflowCircuitBreakerResetMs: 500,
                workflowAuditEnabled: false,
                streamConsumerName: 'test-no-audit',
            });
            await mgr.emitAuditEvent('STEP_STARTED', 'some-id', { test: true });
            // Should complete without throwing — nothing written
        });
    });

    describe('Reliability Metrics', function () {
        beforeEach(function () {
            reliabilityManager.updateRedisHealth(true);
            reliabilityManager.updateReconnectCount(0);
        });

        it('should return full metrics snapshot', async function () {
            const metrics = await reliabilityManager.getMetrics();
            expect(metrics).to.include.all.keys([
                'circuitBreakerState',
                'deadLetterQueueSize',
                'redisHealthy',
                'reconnectCount',
                'lastConnectedAt',
                'circuitBreakerAllowingRequests',
            ]);
            expect(metrics.deadLetterQueueSize).to.be.a('number');
            expect(metrics.circuitBreakerAllowingRequests).to.be.a('boolean');
        });

        it('should reflect unhealthy redis status', async function () {
            reliabilityManager.updateRedisHealth(false, 'Connection refused');
            const metrics = await reliabilityManager.getMetrics();
            expect(metrics.redisHealthy).to.be.false;
            expect(metrics.lastError).to.equal('Connection refused');
        });

        it('should clear error and update lastConnectedAt when redis becomes healthy', async function () {
            reliabilityManager.updateRedisHealth(false, 'Connection refused');
            const before = Date.now();
            reliabilityManager.updateRedisHealth(true);
            const metrics = await reliabilityManager.getMetrics();
            expect(metrics.redisHealthy).to.be.true;
            expect(metrics.lastError).to.be.undefined;
            expect(metrics.lastConnectedAt).to.be.at.least(before);
        });

        it('should track reconnect count', async function () {
            reliabilityManager.updateReconnectCount(7);
            const metrics = await reliabilityManager.getMetrics();
            expect(metrics.reconnectCount).to.equal(7);
        });

        it('should update health check timestamp', async function () {
            const before = Date.now();
            reliabilityManager.updateHealthCheckTimestamp();
            const metrics = await reliabilityManager.getMetrics();
            expect(metrics.lastHealthCheckAt).to.be.at.least(before);
        });

        it('should keep previous DLQ size if fetch fails during getMetrics', async function () {
            const sandbox = sinon.createSandbox();
            sandbox.stub(redisClient, 'zCard').rejects(new Error('Redis error'));
            try {
                const metrics = await reliabilityManager.getMetrics();
                expect(metrics.deadLetterQueueSize).to.be.a('number');
            } finally {
                sandbox.restore();
            }
        });

        it('should neither set an error nor bump lastConnectedAt when marked unhealthy with no error message', async function () {
            reliabilityManager.updateRedisHealth(true);
            const metricsBefore = await reliabilityManager.getMetrics();

            reliabilityManager.updateRedisHealth(false);
            const metrics = await reliabilityManager.getMetrics();
            expect(metrics.redisHealthy).to.be.false;
            expect(metrics.lastError).to.be.undefined;
            expect(metrics.lastConnectedAt).to.equal(metricsBefore.lastConnectedAt);
        });
    });

    describe('Circuit Breaker - Extended', function () {
        it('should return circuit breaker state object', function () {
            const state = reliabilityManager.getCircuitBreakerState();
            expect(state).to.have.all.keys(['state', 'failureCount', 'lastFailureTime']);
            expect(['closed', 'open', 'half-open']).to.include(state.state);
        });

        it('should allow requests when in half-open state', async function () {
            this.timeout(2000);
            const mgr = new ReliabilityManager(redisClient, keys, {
                workflowMaxRetries: 3,
                workflowIdempotencyTtlMs: 5000,
                workflowCircuitBreakerThreshold: 2,
                workflowCircuitBreakerResetMs: 300,
                workflowAuditEnabled: false,
                streamConsumerName: 'test-half-open',
            });

            mgr.recordCircuitBreakerFailure();
            mgr.recordCircuitBreakerFailure();
            expect(mgr.shouldProcessCircuitBreaker()).to.be.false;

            await new Promise((resolve) => setTimeout(resolve, 400));

            // First call transitions open → half-open
            expect(mgr.shouldProcessCircuitBreaker()).to.be.true;
            // Second call hits the half-open case directly
            expect(mgr.shouldProcessCircuitBreaker()).to.be.true;
            expect(mgr.getCircuitBreakerState().state).to.equal('half-open');
        });

        it('should reopen circuit on failure in half-open state', async function () {
            this.timeout(2000);
            const mgr = new ReliabilityManager(redisClient, keys, {
                workflowMaxRetries: 3,
                workflowIdempotencyTtlMs: 5000,
                workflowCircuitBreakerThreshold: 2,
                workflowCircuitBreakerResetMs: 300,
                workflowAuditEnabled: false,
                streamConsumerName: 'test-half-open-fail',
            });

            mgr.recordCircuitBreakerFailure();
            mgr.recordCircuitBreakerFailure();
            await new Promise((resolve) => setTimeout(resolve, 400));
            mgr.shouldProcessCircuitBreaker(); // transitions to half-open
            expect(mgr.getCircuitBreakerState().state).to.equal('half-open');

            mgr.recordCircuitBreakerFailure();
            expect(mgr.getCircuitBreakerState().state).to.equal('open');
        });

        it('should handle unknown circuit breaker state via default branch', function () {
            const mgr = new ReliabilityManager(redisClient, keys, {
                workflowMaxRetries: 3,
                workflowIdempotencyTtlMs: 5000,
                workflowCircuitBreakerThreshold: 2,
                workflowCircuitBreakerResetMs: 500,
                workflowAuditEnabled: false,
                streamConsumerName: 'test-default',
            });
            (mgr as any).circuitBreaker.state = 'unknown';
            expect(mgr.shouldProcessCircuitBreaker()).to.be.true;
        });
    });

    describe('Dead Letter Queue - Extended', function () {
        beforeEach(async function () {
            await reliabilityManager.clearDeadLetterQueue();
        });

        it('should move event to DLQ without an error object', async function () {
            const event: WorkflowEvent = {
                eventId: 'no-error-event',
                type: 'COMPLETED',
                userId: 'u1',
                assignmentId: 'a1',
                timestamp: Date.now(),
            };
            await reliabilityManager.moveToDeadLetter(event, 'no error passed');
            const events = await reliabilityManager.getDeadLetterEvents();
            expect(events[0].errorMessage).to.be.undefined;
            expect(events[0].errorStack).to.be.undefined;
        });

        it('should support pagination with limit and offset', async function () {
            for (let i = 0; i < 5; i++) {
                const event: WorkflowEvent = {
                    eventId: `page-event-${i}`,
                    type: 'COMPLETED',
                    userId: 'u1',
                    assignmentId: 'a1',
                    timestamp: Date.now() + i,
                };
                await reliabilityManager.moveToDeadLetter(event, 'page test');
            }
            const page1 = await reliabilityManager.getDeadLetterEvents(2, 0);
            const page2 = await reliabilityManager.getDeadLetterEvents(2, 2);
            expect(page1).to.have.lengthOf(2);
            expect(page2).to.have.lengthOf(2);
            expect(page1[0].event.eventId).to.not.equal(page2[0].event.eventId);
        });

        it('should not alert when DLQ is below threshold', async function () {
            const alert = await reliabilityManager.checkDeadLetterQueueAlert();
            expect(alert).to.be.false;
        });

        it('should alert when DLQ size exceeds threshold', async function () {
            const mgr = new ReliabilityManager(redisClient, keys, {
                workflowMaxRetries: 3,
                workflowIdempotencyTtlMs: 5000,
                workflowCircuitBreakerThreshold: 2,
                workflowCircuitBreakerResetMs: 500,
                workflowAuditEnabled: false,
                streamConsumerName: 'test-alert',
                deadLetterQueueAlertThreshold: 0,
            });
            const event: WorkflowEvent = {
                eventId: 'alert-event',
                type: 'COMPLETED',
                userId: 'u1',
                assignmentId: 'a1',
                timestamp: Date.now(),
            };
            await mgr.moveToDeadLetter(event, 'over threshold');
            expect(await mgr.checkDeadLetterQueueAlert()).to.be.true;
        });
    });

    describe('State Persistence', function () {
        afterEach(async function () {
            await redisClient.del(keys.circuitBreakerState());
        });

        it('should skip loading state when circuitBreakerPersistState is false', async function () {
            const mgr = new ReliabilityManager(redisClient, keys, {
                workflowMaxRetries: 3,
                workflowIdempotencyTtlMs: 5000,
                workflowCircuitBreakerThreshold: 2,
                workflowCircuitBreakerResetMs: 500,
                workflowAuditEnabled: false,
                streamConsumerName: 'test-no-persist',
            });
            await mgr.init();
            expect(mgr.getCircuitBreakerState().state).to.equal('closed');
        });

        it('should persist state to Redis when circuit breaker opens', async function () {
            const mgr = new ReliabilityManager(redisClient, keys, {
                workflowMaxRetries: 3,
                workflowIdempotencyTtlMs: 5000,
                workflowCircuitBreakerThreshold: 1,
                workflowCircuitBreakerResetMs: 500,
                workflowAuditEnabled: false,
                streamConsumerName: 'test-persist-open',
                circuitBreakerPersistState: true,
            });
            await mgr.init();
            mgr.recordCircuitBreakerFailure();

            const saved = await redisClient.hGetAll(keys.circuitBreakerState());
            expect(saved.state).to.equal('open');
            expect(Number(saved.failureCount)).to.equal(1);
        });

        it('should load persisted circuit breaker state on init', async function () {
            await redisClient.hSet(keys.circuitBreakerState(), {
                state: 'open',
                failureCount: '3',
                lastFailureTime: String(Date.now()),
            });

            const mgr = new ReliabilityManager(redisClient, keys, {
                workflowMaxRetries: 3,
                workflowIdempotencyTtlMs: 5000,
                workflowCircuitBreakerThreshold: 2,
                workflowCircuitBreakerResetMs: 500,
                workflowAuditEnabled: false,
                streamConsumerName: 'test-load',
                circuitBreakerPersistState: true,
            });
            await mgr.init();

            const state = mgr.getCircuitBreakerState();
            expect(state.state).to.equal('open');
            expect(state.failureCount).to.equal(3);
        });

        it('should default missing failureCount/lastFailureTime to 0 when loading persisted state', async function () {
            await redisClient.hSet(keys.circuitBreakerState(), { state: 'open' });

            const mgr = new ReliabilityManager(redisClient, keys, {
                workflowMaxRetries: 3,
                workflowIdempotencyTtlMs: 5000,
                workflowCircuitBreakerThreshold: 2,
                workflowCircuitBreakerResetMs: 500,
                workflowAuditEnabled: false,
                streamConsumerName: 'test-load-partial',
                circuitBreakerPersistState: true,
            });
            await mgr.init();

            const state = mgr.getCircuitBreakerState();
            expect(state.state).to.equal('open');
            expect(state.failureCount).to.equal(0);
            expect(state.lastFailureTime).to.equal(0);
        });

        it('should default to closed when Redis has no persisted state', async function () {
            const mgr = new ReliabilityManager(redisClient, keys, {
                workflowMaxRetries: 3,
                workflowIdempotencyTtlMs: 5000,
                workflowCircuitBreakerThreshold: 2,
                workflowCircuitBreakerResetMs: 500,
                workflowAuditEnabled: false,
                streamConsumerName: 'test-empty',
                circuitBreakerPersistState: true,
            });
            await mgr.init();
            expect(mgr.getCircuitBreakerState().state).to.equal('closed');
        });

        it('should handle Redis error during state load gracefully', async function () {
            const sandbox = sinon.createSandbox();
            sandbox.stub(redisClient, 'hGetAll').rejects(new Error('Redis error'));
            try {
                const mgr = new ReliabilityManager(redisClient, keys, {
                    workflowMaxRetries: 3,
                    workflowIdempotencyTtlMs: 5000,
                    workflowCircuitBreakerThreshold: 2,
                    workflowCircuitBreakerResetMs: 500,
                    workflowAuditEnabled: false,
                    streamConsumerName: 'test-load-err',
                    circuitBreakerPersistState: true,
                });
                await mgr.init();
                expect(mgr.getCircuitBreakerState().state).to.equal('closed');
            } finally {
                sandbox.restore();
            }
        });

        it('should handle Redis error during state save gracefully', async function () {
            const sandbox = sinon.createSandbox();
            sandbox.stub(redisClient, 'hSet').rejects(new Error('Redis write error'));
            try {
                const mgr = new ReliabilityManager(redisClient, keys, {
                    workflowMaxRetries: 3,
                    workflowIdempotencyTtlMs: 5000,
                    workflowCircuitBreakerThreshold: 1,
                    workflowCircuitBreakerResetMs: 500,
                    workflowAuditEnabled: false,
                    streamConsumerName: 'test-save-err',
                    circuitBreakerPersistState: true,
                });
                await mgr.init();
                mgr.recordCircuitBreakerFailure(); // triggers save, should not throw
            } finally {
                sandbox.restore();
            }
        });

        it('should persist state when circuit closes from half-open success', async function () {
            this.timeout(2000);
            const mgr = new ReliabilityManager(redisClient, keys, {
                workflowMaxRetries: 3,
                workflowIdempotencyTtlMs: 5000,
                workflowCircuitBreakerThreshold: 1,
                workflowCircuitBreakerResetMs: 200,
                workflowAuditEnabled: false,
                streamConsumerName: 'test-persist-close',
                circuitBreakerPersistState: true,
            });
            await mgr.init();
            mgr.recordCircuitBreakerFailure(); // opens
            await new Promise((resolve) => setTimeout(resolve, 300));
            mgr.shouldProcessCircuitBreaker(); // transitions to half-open, persists
            mgr.recordCircuitBreakerSuccess(); // closes, persists

            const saved = await redisClient.hGetAll(keys.circuitBreakerState());
            expect(saved.state).to.equal('closed');
        });

        it('resets the shared failure counter when a shared breaker closes from half-open success', async function () {
            const mgr = new ReliabilityManager(redisClient, keys, {
                workflowMaxRetries: 3,
                workflowIdempotencyTtlMs: 5000,
                workflowCircuitBreakerThreshold: 1,
                workflowCircuitBreakerResetMs: 30,
                workflowAuditEnabled: false,
                streamConsumerName: 'test-shared-close',
                circuitBreakerShared: true,
            });
            await mgr.init();
            await mgr.recordCircuitBreakerFailure(); // opens, bumps the shared counter
            expect(await redisClient.get(keys.circuitBreakerFailures())).to.equal('1');

            await new Promise((resolve) => setTimeout(resolve, 50));
            mgr.shouldProcessCircuitBreaker(); // transitions to half-open
            mgr.recordCircuitBreakerSuccess(); // closes, resets the shared counter
            await new Promise((resolve) => setImmediate(resolve));

            expect(await redisClient.get(keys.circuitBreakerFailures())).to.be.null;
        });
    });

    describe('Backoff', function () {
        it('should complete a short backoff delay', async function () {
            this.timeout(1000);
            await ReliabilityManager.backoff(0, 10, 50);
        });

        it('should cap delay at maxDelay for large attempt numbers', async function () {
            this.timeout(1000);
            const before = Date.now();
            await ReliabilityManager.backoff(100, 10, 100);
            // With +25% jitter at most, max is 125ms — well under 1s
            expect(Date.now() - before).to.be.lessThan(800);
        });

        it('should use its default initialDelay/maxDelay when only attempt is given', async function () {
            this.timeout(1000);
            const before = Date.now();
            await ReliabilityManager.backoff(0);
            // attempt 0 with the 100ms default initialDelay: ~75-125ms with jitter
            expect(Date.now() - before).to.be.lessThan(500);
        });
    });
});
