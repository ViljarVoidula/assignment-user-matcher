/**
 * Shared test Redis client.
 *
 * The integration suites wipe the database they connect to. Pointing them at
 * a shared development or production instance destroys real data, so every
 * test client goes through this helper:
 *
 * - the connection defaults to logical DB 15 on localhost, not DB 0, so a
 *   developer's ordinary Redis contents survive a test run;
 * - `TEST_REDIS_URL` overrides the target for CI / disposable containers;
 * - selecting DB 0 is refused unless `TEST_REDIS_ALLOW_DB0=1` is set
 *   explicitly, because that is the database real data lives in.
 *
 * Suites must flush with `flushDb()` (scoped to the selected logical DB),
 * never `flushAll()` — the latter ignores the logical-DB isolation entirely.
 *
 * All suites share the one logical database and flush it between tests, so
 * **only one test run may be in flight at a time**. Two concurrent runs — or a
 * benchmark pointed at the same database — wipe each other's state mid-test
 * and produce failures that look like real regressions but move around
 * between runs. Give a second run its own `TEST_REDIS_URL`.
 */
import { createClient } from 'redis';

export const DEFAULT_TEST_REDIS_URL = 'redis://127.0.0.1:6379/15';

/** Resolve the Redis URL test suites are allowed to destroy. */
export function testRedisUrl(): string {
    const url = process.env.TEST_REDIS_URL || DEFAULT_TEST_REDIS_URL;
    if (process.env.TEST_REDIS_ALLOW_DB0 === '1') return url;

    // redis://host:port/<db> — no path, or a "/0" path, means DB 0.
    let db = '0';
    try {
        db = new URL(url).pathname.replace(/^\//, '') || '0';
    } catch {
        db = '0';
    }
    if (db === '0') {
        throw new Error(
            `Refusing to run destructive tests against Redis DB 0 (${url}). ` +
                `Set TEST_REDIS_URL to a disposable database (e.g. redis://127.0.0.1:6379/15) ` +
                `or TEST_REDIS_ALLOW_DB0=1 if this instance really is disposable.`,
        );
    }
    return url;
}

/**
 * Create an unconnected client against the disposable test database.
 * Callers still `await client.connect()` themselves.
 */
export function createTestClient(options: Record<string, any> = {}): any {
    return createClient({ url: testRedisUrl(), ...options }) as any;
}

/** Wipe only the selected logical database. */
export async function flushTestDb(client: any): Promise<void> {
    await client.flushDb();
}
