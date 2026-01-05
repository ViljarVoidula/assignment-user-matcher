import { expect } from 'chai';
import { createClient } from 'redis';
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
            await new Promise(resolve => setTimeout(resolve, 1100));
            
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

            await new Promise(resolve => setTimeout(resolve, 600));

            // Should be half-open/closed now
            expect(reliabilityManager.shouldProcessCircuitBreaker()).to.be.true;
        });

        it('should close circuit after success in half-open state', async function () {
            // Trigger open state again
            reliabilityManager.recordCircuitBreakerFailure();
            reliabilityManager.recordCircuitBreakerFailure();
            expect(reliabilityManager.shouldProcessCircuitBreaker()).to.be.false;

            // Wait for reset
            await new Promise(resolve => setTimeout(resolve, 600));
            
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
    });
});
