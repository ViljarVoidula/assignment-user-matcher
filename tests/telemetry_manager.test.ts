import { expect } from 'chai';
import { TelemetryManager } from '../src/managers/TelemetryManager';

describe('TelemetryManager', function () {
    it('should handle disabled telemetry', function () {
        const telemetry = new TelemetryManager(false);
        const { span, end } = telemetry.startSpan('test');
        expect(span).to.be.null;
        expect(end).to.be.a('function');
        
        // Should not throw
        telemetry.recordSpanError(span, new Error('test'));
        telemetry.setSpanAttributes(span, { foo: 'bar' });
        end();
    });

    it('should handle enabled telemetry without tracer', function () {
        const telemetry = new TelemetryManager(true);
        const { span, end } = telemetry.startSpan('test');
        expect(span).to.be.null;
        
        telemetry.recordSpanError(span, new Error('test'));
        end();
    });

    it('should use tracer when provided', function () {
        const telemetry = new TelemetryManager(true);
        const mockSpan = {
            end: () => { (mockSpan as any).ended = true; },
            recordException: (e: Error) => { (mockSpan as any).error = e; },
            setStatus: (s: any) => { (mockSpan as any).status = s; },
            setAttribute: (k: string, v: any) => { (mockSpan as any).attributes[k] = v; },
            attributes: {} as Record<string, any>,
            ended: false,
            error: null as Error | null,
            status: null as any,
        };
        const mockTracer = {
            startSpan: (name: string, options: any) => {
                (mockSpan as any).name = name;
                (mockSpan as any).attributes = { ...options.attributes };
                return mockSpan;
            }
        };

        telemetry.setTracer(mockTracer);
        const { span, end } = telemetry.startSpan('test-span', { attr1: 'val1' });
        
        expect(span).to.equal(mockSpan);
        expect((span as any).name).to.equal('test-span');
        expect((span as any).attributes.attr1).to.equal('val1');

        telemetry.setSpanAttributes(span, { attr2: 'val2' });
        expect((span as any).attributes.attr2).to.equal('val2');

        telemetry.recordSpanError(span, new Error('boom'));
        expect((span as any).error.message).to.equal('boom');
        expect((span as any).status.code).to.equal(2);

        end();
        expect((span as any).ended).to.be.true;
    });

    it('should handle tracer errors gracefully', function () {
        const telemetry = new TelemetryManager(true);
        const mockTracer = {
            startSpan: () => { throw new Error('tracer error'); }
        };
        telemetry.setTracer(mockTracer);
        
        const { span, end } = telemetry.startSpan('test');
        expect(span).to.be.null;
        end();
    });
});
