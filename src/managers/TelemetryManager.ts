export class TelemetryManager {
    private tracer: any = null;

    constructor(private enabled: boolean) {}

    setTracer(tracer: any): void {
        this.tracer = tracer;
    }

    startSpan(name: string, attributes?: Record<string, string | number | boolean>): { span: any; end: () => void } {
        if (!this.enabled || !this.tracer) {
            return { span: null, end: () => {} };
        }
        try {
            const span = this.tracer.startSpan(name, { attributes });
            return {
                span,
                end: () => {
                    try { span.end(); } catch {}
                },
            };
        } catch {
            return { span: null, end: () => {} };
        }
    }

    recordSpanError(span: any, error: Error): void {
        if (!span || !this.enabled) return;
        try {
            span.recordException(error);
            span.setStatus({ code: 2, message: error.message });
        } catch {}
    }

    setSpanAttributes(span: any, attributes: Record<string, string | number | boolean>): void {
        if (!span || !this.enabled) return;
        try {
            for (const [key, value] of Object.entries(attributes)) {
                span.setAttribute(key, value);
            }
        } catch {}
    }
}
