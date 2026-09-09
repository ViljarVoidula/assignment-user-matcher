# Console + Worker Portal i18n (Estonian) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the operator console and the worker portal in Estonian with English fallback, with locale stored on the user/worker account and auto-selected from the browser.

**Architecture:** Lingui 6 macros in both React apps — the English source text *is* the message, so components stay readable and a missing Estonian string falls back to English instead of a blank. The console (Vite 8 / Rolldown) transforms macros with `@rolldown/plugin-babel` and loads `.po` catalogs at runtime through `@lingui/vite-plugin`. The worker portal (Vite 5) has no compatible Vite plugin, so it uses `@vitejs/plugin-react`'s Babel hook and imports catalogs that `lingui compile --typescript` checks into the tree. Locale lives on `users.locale` and `worker_identities.locale`; server-rendered copy (push notifications, invite email) reads the worker's stored locale because those run in background jobs with no request context.

**Tech Stack:** Lingui 6.6.0 (`@lingui/core`, `@lingui/react`, `@lingui/cli`, `@lingui/babel-plugin-lingui-macro`, `@lingui/vite-plugin`), `@rolldown/plugin-babel` 0.2.4, `@babel/core` 8, Vite 8 (console) / Vite 5.4 (portal), React 19 / React 18, Drizzle migrations, Fastify.

## Global Constraints

- **Lingui version is 6.6.0 everywhere.** Macros import from `@lingui/core/macro` (`msg`, `plural`) and `@lingui/react/macro` (`Trans`, `useLingui`). Never `@lingui/macro` — that is the retired v4 entry point.
- **`useLingui()` from `@lingui/react/macro` returns `{ t, i18n }`.** The `t` it returns is the macro form used inside components. The standalone `t` import is only for module-scope constants, which this plan avoids.
- **Message ids are generated hashes.** The `.po` `msgid` stays the English source text for translators; `@lingui/vite-plugin` and `lingui compile` map it to the hash the macro emits. Never hand-write an `id`.
- **Locales are exactly `['en', 'et']`, sourceLocale `'en'`.**
- **Enum and API values are never message ids.** Statuses, roles, rule names, shift-type tags go through a `label()` lookup. A raw API value must never appear inside `<Trans>`.
- **Workspace data is never translated**: tag tokens, skill names, site names, worker labels, task titles, GFM description bodies.
- **Server error text (`err.message`) stays English** in this plan. Do not wrap it.
- **Estonian runs ~25% longer than English.** Check the console nav rail, table headers and buttons after each wrap-in task.
- **Commit convention:** Conventional Commits, imperative subject. **Do not add `Co-Authored-By` trailers for AI assistants** and never publish AI-service email addresses in commits (repo rule in both `CLAUDE.md` files).
- **Node comes from nvm.** Every shell step must start with `export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"` or `pnpm`/`npx` will not be found.
- **Vite in the console must be started as `node node_modules/vite/bin/vite.js`**, not `pnpm dev`.
- **Never run two platform test suites at once** — they share one Redis logical DB and flush it.
- **Before `drizzle-kit generate`, run `git status` on the `drizzle/` directory.** It can renumber over an uncommitted migration that lacks a meta snapshot.

## Repository map

| Repo root | Contents this plan touches |
|---|---|
| `/home/viljar/Projects/fivexer/assignment-engine/example/web` | the console (`src/ui/platform`), Vite 8 |
| `/home/viljar/Projects/fivexer/platform` | API, control plane, shared package, portal templates, TS SDK |
| `/home/viljar/Projects/fivexer/sdks` | Python/Java/PHP SDKs + the parity contract |

Paths below are relative to one of these three roots and each task names which.

**`example/` is a git submodule** of `assignment-engine`, pointing at
`git@github.com:fivexer/assignment-matcher-site.git`. Every console commit in this plan
lands in *that* repository, not in `assignment-engine`. After the console work is
finished, bump the parent's submodule pointer in a separate commit:

```bash
cd /home/viljar/Projects/fivexer/assignment-engine
git add example && git commit -m "chore: bump site submodule for console i18n"
```

The submodule is already dirty at the start of this plan (a modified
`web/src/ui/docs/generated/api-reference.json` predates it, plus the Task 1 spike). Leave
the pre-existing change alone.

## File Structure

**Console** (`assignment-engine/example/web`)
- Create `lingui.config.ts` — extraction config, `include: ['src/ui/platform']`.
- Create `src/locales/{en,et}/messages.po` — catalogs (generated, committed).
- Create `src/ui/platform/i18n/locale.ts` — pure resolution + persistence, no React.
- Create `src/ui/platform/i18n/LocaleProvider.tsx` — provider, dynamic catalog activation.
- Create `src/ui/platform/i18n/LanguageSelect.tsx` — the shared switch control.
- Create `src/ui/platform/i18n/labels.ts` — enum → translated label lookups.
- Create `src/lib/format.ts` — locale-aware date/time/number/money.
- Create `src/ui/platform/i18n/locale.test.ts`, `src/lib/format.test.ts`, `src/ui/platform/i18n/coverage.test.ts`.
- Modify `vite.config.ts` — add `@rolldown/plugin-babel` + `lingui()`.
- Modify `src/main.tsx` — wrap console routes in `LocaleProvider`.

**Portal** (`platform/packages/portal-templates`)
- Create `lingui.config.ts`, `src/locales/{en,et}/messages.po` and the committed compiled `messages.ts`.
- Create `src/core/i18n.ts` — resolution, activation, `PortalI18nProvider`.
- Create `src/core/format.ts` — locale-aware date/time/number.
- Modify `vite.common.ts` — Babel macro plugin.
- Modify `src/core/config.ts` — `defaultLocale` on `PortalConfig`.
- Modify `src/core/api.ts` — `setLocale()`.
- Modify `templates/portal/main.tsx` — provider wrap.

**Server** (`platform`)
- Create `packages/control-plane/drizzle/0046_user_and_worker_locale.sql`.
- Create `packages/shared/src/locales/{en,et}.ts` + `packages/shared/src/locale.ts`.
- Modify `packages/shared/src/notification-fanout.ts` — locale-aware push copy.
- Modify `packages/control-plane/src/email-templates.ts` — locale-aware invite email.
- Modify `apps/api/src/routes/console.ts`, `apps/api/src/routes/worker-portal.ts`.
- Modify `packages/sdk/src/types.ts`, `packages/sdk/src/account-client.ts`, `packages/sdk/src/worker-client.ts`.

**SDK contract** (`sdks`) — `contract/operations.yaml`, plus Python/Java/PHP worker clients.

---

# Phase A — Foundation

## Task 1: Console Lingui toolchain

**Root:** `assignment-engine/example/web`

**Files:**
- Modify: `package.json` (dependencies)
- Create: `lingui.config.ts`
- Modify: `vite.config.ts:2` (imports) and the `plugins:` array (~line 700)
- Create: `src/ui/platform/i18n/__probe.tsx` (temporary, deleted in step 6)

**Interfaces:**
- Produces: a working macro transform, so `import { Trans, useLingui } from '@lingui/react/macro'` compiles anywhere under `src/ui/platform`; and `.po` files importable as `{ messages }` modules.

> **Note:** a verification spike already installed these packages and applied the `vite.config.ts` edit. Run each step anyway — `pnpm add` is idempotent and the config check is a grep.

- [ ] **Step 1: Install the packages**

```bash
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"
cd /home/viljar/Projects/fivexer/assignment-engine/example/web
pnpm add @lingui/core@^6.6.0 @lingui/react@^6.6.0
pnpm add -D @lingui/cli@^6.6.0 @lingui/vite-plugin@^6.6.0 \
  @lingui/babel-plugin-lingui-macro@^6.6.0 @rolldown/plugin-babel@^0.2.4 @babel/core@^8.0.1
```

- [ ] **Step 2: Write the Lingui config**

Create `lingui.config.ts`:

```ts
import { defineConfig } from '@lingui/cli';

/**
 * Only the console is translated. The marketing pages stay English for SEO, so
 * `include` is the console subtree rather than `src` — a wider include would put
 * thousands of untranslatable landing-page strings into the catalog.
 */
export default defineConfig({
    sourceLocale: 'en',
    locales: ['en', 'et'],
    catalogs: [
        {
            path: '<rootDir>/src/locales/{locale}/messages',
            include: ['src/ui/platform'],
        },
    ],
});
```

- [ ] **Step 3: Add the plugins to `vite.config.ts`**

Add next to the existing `react` import at the top of the file:

```ts
import babel from '@rolldown/plugin-babel';
import { lingui } from '@lingui/vite-plugin';
```

In the `plugins:` array, immediately after `react(),`:

```ts
        // Vite 8's React plugin is oxc-based and has no `babel` option, so the
        // Lingui macro transform needs its own Babel pass. Scoped to the console
        // subtree: Babel over the whole marketing site would cost build time for
        // files that contain no macros.
        babel({
            include: /src\/ui\/platform\/.*\.[jt]sx?$/,
            plugins: ['@lingui/babel-plugin-lingui-macro'],
        }),
        // Compiles an imported .po into `{ messages }` keyed by the same generated
        // hash the macro emits, so translators keep reading English msgids.
        lingui(),
```

- [ ] **Step 4: Write the probe that proves the transform runs**

Create `src/ui/platform/i18n/__probe.tsx`:

```tsx
import { Trans, useLingui } from '@lingui/react/macro';

export function Probe() {
    const { t } = useLingui();
    return <div title={t`Open tasks`}><Trans>The engine does the assigning</Trans></div>;
}
```

- [ ] **Step 5: Verify extraction and the runtime transform**

```bash
npx lingui extract
```
Expected: a table reporting `en (source) 2` and `et 2 missing`, and `src/locales/{en,et}/messages.po` created.

```bash
node node_modules/vite/bin/vite.js --port 5199 --strictPort > /tmp/vite-i18n.log 2>&1 &
sleep 9
curl -s "http://localhost:5199/src/ui/platform/i18n/__probe.tsx" | grep -c '_Trans'
curl -s "http://localhost:5199/src/locales/et/messages.po?import" | head -1
```
Expected: the grep prints `1` or more, and the second command prints a line starting
`/*eslint-disable*/export const messages=JSON.parse(` containing hashed keys.
Then stop it: `pkill -f "vite.js --port 5199"`.

- [ ] **Step 6: Delete the probe and its catalogs**

```bash
rm -rf src/ui/platform/i18n/__probe.tsx src/locales
```

- [ ] **Step 7: Commit**

```bash
git add package.json pnpm-lock.yaml lingui.config.ts vite.config.ts
git commit -m "build: add Lingui macro transform and catalog loading to the console"
```

---

## Task 2: Console locale resolution (pure)

**Root:** `assignment-engine/example/web`

**Files:**
- Create: `src/ui/platform/i18n/locale.ts`
- Test: `src/ui/platform/i18n/locale.test.ts`

**Interfaces:**
- Produces:
  - `type Locale = 'en' | 'et'`
  - `const LOCALES: readonly Locale[]`
  - `function isLocale(value: unknown): value is Locale`
  - `function resolveLocale(input: { stored?: string | null; account?: string | null; navigator?: readonly string[] }): Locale`
  - `function readStoredLocale(): Locale | null`
  - `function writeStoredLocale(locale: Locale): void`
  - `const LOCALE_STORAGE_KEY = 'locale'`

- [ ] **Step 1: Write the failing test**

Create `src/ui/platform/i18n/locale.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { isLocale, resolveLocale } from './locale';

describe('resolveLocale', () => {
    it('prefers an explicit account choice over everything else', () => {
        expect(resolveLocale({ account: 'en', stored: 'et', navigator: ['et-EE'] })).toBe('en');
    });

    it('falls back to the device choice when the account has none', () => {
        expect(resolveLocale({ account: null, stored: 'et', navigator: ['en-GB'] })).toBe('et');
    });

    it('auto-selects Estonian from the browser when nothing is stored', () => {
        expect(resolveLocale({ navigator: ['et-EE', 'en-GB'] })).toBe('et');
    });

    it('matches the bare language subtag, not just the region form', () => {
        expect(resolveLocale({ navigator: ['et'] })).toBe('et');
    });

    it('ignores a language we do not ship and keeps scanning', () => {
        expect(resolveLocale({ navigator: ['fi-FI', 'et-EE'] })).toBe('et');
    });

    it('defaults to English', () => {
        expect(resolveLocale({})).toBe('en');
        expect(resolveLocale({ navigator: ['fr-FR'] })).toBe('en');
    });

    it('ignores stored junk rather than throwing', () => {
        expect(resolveLocale({ stored: 'klingon', navigator: ['en-GB'] })).toBe('en');
    });
});

describe('isLocale', () => {
    it('accepts shipped locales only', () => {
        expect(isLocale('et')).toBe(true);
        expect(isLocale('en')).toBe(true);
        expect(isLocale('ru')).toBe(false);
        expect(isLocale(null)).toBe(false);
    });
});
```

- [ ] **Step 2: Run it and confirm it fails**

```bash
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"
cd /home/viljar/Projects/fivexer/assignment-engine/example/web
npx vitest run src/ui/platform/i18n/locale.test.ts
```
Expected: FAIL — `Failed to resolve import "./locale"`.

- [ ] **Step 3: Implement**

Create `src/ui/platform/i18n/locale.ts`:

```ts
/**
 * Locale resolution for the console, kept pure and React-free so the ordering
 * rules can be tested without a DOM.
 *
 * The order is deliberate. An account choice was made by a person and follows
 * them between devices, so it outranks everything. The stored device value
 * exists for the signed-out screens and for the frame before `/me` resolves —
 * without it the console would paint English and then switch. The browser
 * language is the auto-select: an Estonian visitor gets Estonian without asking.
 */
export const LOCALES = ['en', 'et'] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_STORAGE_KEY = 'locale';

export function isLocale(value: unknown): value is Locale {
    return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

export interface LocaleInputs {
    /** Persisted on the user record; an explicit choice on any device. */
    account?: string | null;
    /** This browser's remembered choice. */
    stored?: string | null;
    /** `navigator.languages`, most-preferred first. */
    navigator?: readonly string[];
}

export function resolveLocale({ account, stored, navigator: languages = [] }: LocaleInputs): Locale {
    if (isLocale(account)) return account;
    if (isLocale(stored)) return stored;
    for (const tag of languages) {
        // Match on the language subtag: `et-EE`, `et` and `ET` are all Estonian.
        const language = tag.toLowerCase().split('-')[0];
        if (isLocale(language)) return language;
    }
    return 'en';
}

export function readStoredLocale(): Locale | null {
    try {
        const raw = localStorage.getItem(LOCALE_STORAGE_KEY);
        return isLocale(raw) ? raw : null;
    } catch {
        // Private mode. No stored preference is a valid answer, not an error.
        return null;
    }
}

export function writeStoredLocale(locale: Locale): void {
    try {
        localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
        /* The choice still holds for this page, which beats failing the click. */
    }
}
```

- [ ] **Step 4: Run the test and confirm it passes**

```bash
npx vitest run src/ui/platform/i18n/locale.test.ts
```
Expected: PASS, 8 tests.

- [ ] **Step 5: Commit**

```bash
git add src/ui/platform/i18n/locale.ts src/ui/platform/i18n/locale.test.ts
git commit -m "feat(console): resolve locale from account, device and browser"
```

---

## Task 3: Console formatting layer

**Root:** `assignment-engine/example/web`

**Files:**
- Create: `src/lib/format.ts`
- Test: `src/lib/format.test.ts`

**Interfaces:**
- Consumes: `Locale` from `src/ui/platform/i18n/locale.ts`.
- Produces: `formatDate`, `formatTime`, `formatDateTime`, `formatNumber`, `formatMoney`, each `(value, locale: Locale) => string`; and `formatMoney(cents: number, locale: Locale, currency?: string)`.

- [ ] **Step 1: Write the failing test**

Create `src/lib/format.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { formatDate, formatDateTime, formatMoney, formatNumber, formatTime } from './format';

const AT = new Date(Date.UTC(2026, 8, 9, 14, 5, 0));

describe('formatting', () => {
    it('writes Estonian dates day-first', () => {
        // Estonian uses d.mm.yyyy; the exact separator run is ICU's, so assert order.
        const out = formatDate(AT, 'et', 'UTC');
        expect(out.startsWith('9')).toBe(true);
        expect(out).toContain('2026');
    });

    it('writes English dates in the en-GB order the console already used', () => {
        expect(formatDate(AT, 'en', 'UTC')).toContain('2026');
    });

    it('uses a 24-hour clock in Estonian', () => {
        const out = formatTime(AT, 'et', 'UTC');
        expect(out).toContain('14');
        expect(out.toLowerCase()).not.toContain('pm');
    });

    it('groups numbers and uses a comma decimal in Estonian', () => {
        expect(formatNumber(1234.5, 'et')).toMatch(/1[\s  ]?234,5/);
    });

    it('formats money from integer cents', () => {
        expect(formatMoney(123456, 'et')).toContain('1234,56');
        expect(formatMoney(123456, 'en')).toContain('1,234.56');
    });

    it('renders a date and a time together', () => {
        const out = formatDateTime(AT, 'et', 'UTC');
        expect(out).toContain('2026');
        expect(out).toContain('14');
    });
});
```

- [ ] **Step 2: Run it and confirm it fails**

```bash
npx vitest run src/lib/format.test.ts
```
Expected: FAIL — cannot resolve `./format`.

- [ ] **Step 3: Implement**

Create `src/lib/format.ts`:

```ts
import type { Locale } from '../ui/platform/i18n/locale';

/**
 * Every locale-dependent number and date in the console goes through here.
 *
 * The console previously called `toLocaleString()` with no arguments, which
 * silently follows the *browser's* locale rather than the one the operator
 * chose — so an Estonian console on an English laptop printed English dates.
 * Passing the resolved locale explicitly is the whole point of this module.
 *
 * `en` maps to `en-GB`: the console's English has always been British (day-first
 * dates, 24-hour clock), and `en-US` would silently reformat every existing
 * screen.
 */
const INTL_LOCALE: Record<Locale, string> = { en: 'en-GB', et: 'et-EE' };

/** Accepts what the API actually returns: an ISO string, epoch ms, or a Date. */
export type DateInput = Date | string | number;

function toDate(value: DateInput): Date {
    return value instanceof Date ? value : new Date(value);
}

export function formatDate(value: DateInput, locale: Locale, timeZone?: string): string {
    return new Intl.DateTimeFormat(INTL_LOCALE[locale], { dateStyle: 'medium', timeZone }).format(toDate(value));
}

export function formatTime(value: DateInput, locale: Locale, timeZone?: string): string {
    return new Intl.DateTimeFormat(INTL_LOCALE[locale], { timeStyle: 'short', timeZone }).format(toDate(value));
}

export function formatDateTime(value: DateInput, locale: Locale, timeZone?: string): string {
    return new Intl.DateTimeFormat(INTL_LOCALE[locale], {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone,
    }).format(toDate(value));
}

export function formatNumber(value: number, locale: Locale, options?: Intl.NumberFormatOptions): string {
    return new Intl.NumberFormat(INTL_LOCALE[locale], options).format(value);
}

/** Money is stored as integer cents everywhere in this codebase; never pass euros. */
export function formatMoney(cents: number, locale: Locale, currency = 'EUR'): string {
    return new Intl.NumberFormat(INTL_LOCALE[locale], { style: 'currency', currency }).format(cents / 100);
}
```

- [ ] **Step 4: Run the test and confirm it passes**

```bash
npx vitest run src/lib/format.test.ts
```
Expected: PASS, 6 tests. If the Estonian money assertion fails on grouping, print the
actual value and relax that one assertion to a regex allowing any Unicode space —
do not change the implementation to match a guessed format.

- [ ] **Step 5: Commit**

```bash
git add src/lib/format.ts src/lib/format.test.ts
git commit -m "feat(console): add locale-aware date, number and money formatting"
```

---

## Task 4: Locale columns on users and worker identities

**Root:** `platform`

**Files:**
- Modify: `packages/control-plane/src/schema/core.ts` (the `users` table ~line 176, the `worker_identities` table ~line 532)
- Create: `packages/control-plane/drizzle/0046_user_and_worker_locale.sql`
- Test: `packages/control-plane/test/locale.test.ts`

**Interfaces:**
- Produces: `users.locale` and `workerIdentities.locale`, both `text`, nullable, no default.

- [ ] **Step 1: Check for an uncommitted migration before generating**

```bash
cd /home/viljar/Projects/fivexer/platform
git status --short packages/control-plane/drizzle
```
Expected: no output. If anything is listed, stop and ask — `drizzle-kit generate` can
renumber over an uncommitted migration that has no meta snapshot.

- [ ] **Step 2: Add the columns to the schema**

In `packages/control-plane/src/schema/core.ts`, in the `users` table definition add
after `emailVerifiedAt`:

```ts
        /**
         * BCP-47 language subtag for the console UI. Null means the person has
         * never chosen, which is different from choosing English: the console
         * still auto-selects from their browser until they do.
         */
        locale: text('locale'),
```

In the `worker_identities` table definition add after `status`:

```ts
        /**
         * The worker's own language choice. Stored rather than kept in the
         * browser because push notifications and the invite email are composed
         * in background jobs with no request to read a header from.
         */
        locale: text('locale'),
```

- [ ] **Step 3: Write the migration by hand**

Create `packages/control-plane/drizzle/0046_user_and_worker_locale.sql`:

```sql
ALTER TABLE "users" ADD COLUMN "locale" text;
--> statement-breakpoint
ALTER TABLE "worker_identities" ADD COLUMN "locale" text;
```

Then regenerate the meta snapshot so a later `drizzle-kit generate` does not
rewrite this file:

```bash
cd /home/viljar/Projects/fivexer/platform
pnpm --filter @fivexer/control-plane drizzle-kit generate
```
Expected: it reports no schema changes to apply (the hand-written migration already
covers them) and updates `packages/control-plane/drizzle/meta/`. If it instead writes a
`0047_*.sql` duplicating the two `ADD COLUMN` statements, delete that file, delete
`0046_user_and_worker_locale.sql`, and keep the generated one under its own number.

- [ ] **Step 4: Verify the migration applies**

```bash
cd /home/viljar/Projects/fivexer/platform
pnpm --filter @fivexer/control-plane test 2>&1 | tail -20
```
Expected: the control-plane suite passes. It runs migrations against its test database,
so a broken migration fails here.

- [ ] **Step 5: Commit**

```bash
git add packages/control-plane/src/schema/core.ts packages/control-plane/drizzle
git commit -m "feat(control-plane): store a locale on users and worker identities"
```

---

## Task 5: Console `/me` reads and writes the locale

**Root:** `platform`

**Files:**
- Modify: `apps/api/src/routes/console.ts:496` (the `GET /me` handler) and add a `PATCH /me`
- Modify: `apps/api/src/mappers.ts` (`toPublicUser`)
- Modify: `packages/sdk/src/types.ts:1529` (`PublicUser`)
- Modify: `packages/sdk/src/account-client.ts:155` (the `console` block)
- Test: `apps/api/test/console-locale.test.ts`

**Interfaces:**
- Consumes: `users.locale` from Task 4.
- Produces:
  - `PublicUser.locale: string | null`
  - `platform.console.updateMe({ locale }): Promise<{ user: PublicUser }>` calling `PATCH /console/me`

- [ ] **Step 1: Write the failing test**

Create `apps/api/test/console-locale.test.ts`, following the setup helpers the existing
console tests in that directory use (copy the harness import block from
`apps/api/test/console.test.ts` verbatim — it builds the app and signs a session):

```ts
import { describe, expect, it } from 'vitest';
// Reuse the same harness the other console tests use.
import { withConsoleSession } from './helpers/console-session';

describe('console locale', () => {
    it('reports a null locale for a user who has never chosen', async () => {
        await withConsoleSession(async ({ request }) => {
            const me = await request('GET', '/v1/console/me');
            expect(me.user.locale).toBeNull();
        });
    });

    it('persists a chosen locale and returns it on the next read', async () => {
        await withConsoleSession(async ({ request }) => {
            const patched = await request('PATCH', '/v1/console/me', { locale: 'et' });
            expect(patched.user.locale).toBe('et');
            const me = await request('GET', '/v1/console/me');
            expect(me.user.locale).toBe('et');
        });
    });

    it('rejects a locale the product does not ship', async () => {
        await withConsoleSession(async ({ request, expectError }) => {
            await expectError(request('PATCH', '/v1/console/me', { locale: 'klingon' }), 400);
        });
    });

    it('clears the choice when sent null', async () => {
        await withConsoleSession(async ({ request }) => {
            await request('PATCH', '/v1/console/me', { locale: 'et' });
            const cleared = await request('PATCH', '/v1/console/me', { locale: null });
            expect(cleared.user.locale).toBeNull();
        });
    });
});
```

If `apps/api/test/helpers/console-session.ts` does not exist, write this test against the
harness style actually used by the neighbouring console test file instead — do not invent
a helper that is not there.

- [ ] **Step 2: Run it and confirm it fails**

```bash
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"
cd /home/viljar/Projects/fivexer/platform
pnpm --filter @fivexer/api exec vitest run test/console-locale.test.ts
```
Expected: FAIL — `PATCH /v1/console/me` returns 404.

- [ ] **Step 3: Add the locale to the public user shape**

In `packages/sdk/src/types.ts`, extend `PublicUser`:

```ts
export interface PublicUser {
    id: string;
    email: string;
    name: string | null;
    emailVerified: boolean;
    createdAt: string;
    /** Chosen console language (`en`/`et`). Null = never chosen; the console picks from the browser. */
    locale: string | null;
}
```

In `apps/api/src/mappers.ts`, add `locale: row.locale ?? null,` to `toPublicUser`.

- [ ] **Step 4: Add the route**

In `apps/api/src/routes/console.ts`, directly after the `GET /me` handler:

```ts
    /**
     * The signed-in user's own preferences. Only the language today.
     *
     * `null` is a real value, not a missing one: it clears the choice and puts the
     * console back on browser auto-select, so the body distinguishes "absent"
     * (change nothing) from "null" (forget my choice).
     */
    app.patch<{ Body: { locale?: string | null } }>(
        '/me',
        { schema: docs('Update the signed-in user’s preferences') },
        async (request) => {
            const { locale } = request.body ?? {};
            if (locale !== undefined && locale !== null && !SUPPORTED_LOCALES.has(locale)) {
                throw new ApiError(400, 'invalid_locale', `unsupported locale: ${locale}`);
            }
            const user = await accounts.updateUser(request.sessionUser.id, { locale: locale ?? null });
            return { user: toPublicUser(user) };
        },
    );
```

Add near the top of the same file:

```ts
/** The languages the console ships. Kept here rather than imported from the web app:
 *  the API must not depend on the console bundle. */
const SUPPORTED_LOCALES = new Set(['en', 'et']);
```

Add `updateUser` to the accounts service (in the module `accounts` is constructed from —
follow the existing update methods there for the Drizzle call shape):

```ts
async updateUser(userId: string, patch: { locale: string | null }) {
    const [row] = await this.db.update(users).set(patch).where(eq(users.id, userId)).returning();
    if (!row) throw new ApiError(404, 'not_found', 'user not found');
    return row;
}
```

- [ ] **Step 5: Add the SDK method**

In `packages/sdk/src/account-client.ts`, inside the `console` block after `me`:

```ts
        /** Update the signed-in user's own preferences. `locale: null` clears the choice. */
        updateMe: (input: { locale?: string | null }) =>
            this.request<{ user: PublicUser }>('PATCH', '/console/me', input),
```

- [ ] **Step 6: Run the test and confirm it passes**

```bash
pnpm --filter @fivexer/api exec vitest run test/console-locale.test.ts
```
Expected: PASS, 4 tests.

- [ ] **Step 7: Commit**

```bash
git add apps/api/src packages/sdk/src apps/api/test/console-locale.test.ts
git commit -m "feat(api): read and write the console user's language preference"
```

---

## Task 6: Worker portal `/me` reads and writes the locale

**Root:** `platform`

**Files:**
- Modify: `apps/api/src/routes/worker-portal.ts:326` (`GET /me`), add `PATCH /me`
- Modify: `packages/control-plane/src/` worker identity service (add `setWorkerLocale`)
- Modify: `packages/sdk/src/worker-client.ts`
- Modify: `packages/sdk/src/types.ts` (`WorkerMe`)
- Test: `apps/api/test/worker-locale.test.ts`

**Interfaces:**
- Consumes: `worker_identities.locale` from Task 4.
- Produces:
  - `WorkerMe.locale: string | null` on the `GET /portal/me` response
  - `PATCH /portal/me { locale }` → `{ workerId, locale }`
  - SDK: `worker.setLocale(locale: string | null): Promise<{ workerId: string; locale: string | null }>`

- [ ] **Step 1: Write the failing test**

Create `apps/api/test/worker-locale.test.ts`, using the same worker-session harness the
neighbouring worker-portal tests use:

```ts
import { describe, expect, it } from 'vitest';
import { withWorkerSession } from './helpers/worker-session';

describe('worker locale', () => {
    it('is null until the worker chooses', async () => {
        await withWorkerSession(async ({ request }) => {
            const me = await request('GET', '/v1/portal/me');
            expect(me.locale).toBeNull();
        });
    });

    it('persists the worker’s choice', async () => {
        await withWorkerSession(async ({ request }) => {
            const out = await request('PATCH', '/v1/portal/me', { locale: 'et' });
            expect(out.locale).toBe('et');
            const me = await request('GET', '/v1/portal/me');
            expect(me.locale).toBe('et');
        });
    });

    it('rejects an unsupported locale', async () => {
        await withWorkerSession(async ({ request, expectError }) => {
            await expectError(request('PATCH', '/v1/portal/me', { locale: 'zz' }), 400);
        });
    });
});
```

- [ ] **Step 2: Run it and confirm it fails**

```bash
pnpm --filter @fivexer/api exec vitest run test/worker-locale.test.ts
```
Expected: FAIL — `me.locale` is `undefined`, then 404 on the PATCH.

- [ ] **Step 3: Implement**

In `apps/api/src/routes/worker-portal.ts`, add `locale` to the `GET /me` return object
(read it from the worker identity the request already resolves; if the handler does not
already load the identity row, fetch it with the same `controlPlane` call the PATCH uses):

```ts
            locale: identity?.locale ?? null,
```

Add the route after `GET /me`:

```ts
    /**
     * The worker's own language. Stored on the identity rather than in the phone's
     * browser because the push notifications and the invite email are composed
     * server-side, in jobs that have no request headers to read.
     */
    app.patch<{ Body: { locale?: string | null } }>(
        '/me',
        { schema: docs('Set the signed-in worker’s language') },
        async (request) => {
            const { workerId, workspaceId } = request.worker!;
            const locale = request.body?.locale ?? null;
            if (locale !== null && !SUPPORTED_LOCALES.has(locale)) {
                throw new ApiError(400, 'invalid_locale', `unsupported locale: ${locale}`);
            }
            await controlPlane.setWorkerLocale(workspaceId, workerId, locale);
            return { workerId, locale };
        },
    );
```

with the same `SUPPORTED_LOCALES` constant as Task 5 near the top of the file, and in the
control-plane worker identity service:

```ts
async setWorkerLocale(workspaceId: string, workerId: string, locale: string | null): Promise<void> {
    await this.db
        .update(workerIdentities)
        .set({ locale })
        .where(and(eq(workerIdentities.workspaceId, workspaceId), eq(workerIdentities.workerId, workerId)));
}

/** Used by push fan-out and the invite email, which have no request context. */
async getWorkerLocale(workspaceId: string, workerId: string): Promise<string | null> {
    const [row] = await this.db
        .select({ locale: workerIdentities.locale })
        .from(workerIdentities)
        .where(and(eq(workerIdentities.workspaceId, workspaceId), eq(workerIdentities.workerId, workerId)))
        .limit(1);
    return row?.locale ?? null;
}
```

In `packages/sdk/src/types.ts` add `locale: string | null;` to `WorkerMe`. In
`packages/sdk/src/worker-client.ts`, beside `setAvailability`:

```ts
    /** Set the language this worker's portal and notifications use. `null` clears it. */
    setLocale: (locale: string | null) =>
        this.request<{ workerId: string; locale: string | null }>('PATCH', '/portal/me', { locale }),
```

- [ ] **Step 4: Run the test and confirm it passes**

```bash
pnpm --filter @fivexer/api exec vitest run test/worker-locale.test.ts
```
Expected: PASS, 3 tests.

- [ ] **Step 5: Commit**

```bash
git add apps/api packages/control-plane/src packages/sdk/src
git commit -m "feat(api): let a worker choose the language of their portal and notifications"
```

---

## Task 7: SDK contract parity for `worker.setLocale`

**Root:** `sdks`

**Files:**
- Modify: `contract/operations.yaml` (the `worker.profile` group, ~line 818)
- Modify: `python/src/fivexer/worker.py` (sync and async clients), `python/src/fivexer/specs.py`
- Modify: the Java worker client under `java/src`
- Modify: the PHP worker client under `php/src`

**Interfaces:**
- Consumes: `PATCH /portal/me` from Task 6.
- Produces: `worker.setLocale` in all four SDKs.

The console/account plane is explicitly **out of scope** for the hand-written SDKs
(`scripts/check-field-parity.py` says so), so Task 5's `PATCH /console/me` needs no work
here. The worker plane **is** in scope, so this one does.

- [ ] **Step 1: Add the operation to the contract**

In `contract/operations.yaml`, in the `worker.profile` group after `worker.changePin`:

```yaml
          - name: worker.setLocale
            method: PATCH
            path: /portal/me
            body: "{ locale }"
            response: "{ workerId, locale }"
            notes: >-
                The worker's own language, stored on their identity. `null` clears it and
                returns them to the portal's published default. Server-side too: push
                notification copy and the invite email read this, because they are composed
                in background jobs with no request locale to read.
```

- [ ] **Step 2: Run the parity gate and confirm it fails**

```bash
cd /home/viljar/Projects/fivexer/sdks
scripts/sync-contract.py
```
Expected: FAIL, reporting `worker.setLocale` missing from Python, Java and PHP.

- [ ] **Step 3: Implement in Python**

In `python/src/fivexer/specs.py`, beside `worker_set_availability`:

```python
def worker_set_locale(locale: str | None) -> RequestSpec:
    return RequestSpec("PATCH", "/portal/me", json={"locale": locale})
```

In `python/src/fivexer/worker.py`, on the sync client beside `set_availability`:

```python
    def set_locale(self, locale: str | None) -> dict:
        """Set this worker's language. ``None`` clears it."""
        return self._send(specs.worker_set_locale(locale))
```

and on the async client:

```python
    async def set_locale(self, locale: str | None) -> dict:
        """Set this worker's language. ``None`` clears it."""
        return await self._send(specs.worker_set_locale(locale))
```

- [ ] **Step 4: Implement in Java and PHP**

Mirror the neighbouring `changePin` method in each worker client, keeping each
language's existing naming convention (`setLocale` in Java and PHP). Match the
surrounding file's style for request building and return types rather than
introducing a new one.

- [ ] **Step 5: Run both gates and the SDK suites**

```bash
cd /home/viljar/Projects/fivexer/sdks
scripts/sync-contract.py
scripts/check-field-parity.py
```
Expected: both exit 0.

PHP tests need docker and must be run from the `sdks/` root:

```bash
cd /home/viljar/Projects/fivexer/sdks && docker compose run --rm php vendor/bin/phpunit 2>&1 | tail -20
```

- [ ] **Step 6: Commit**

```bash
git add contract python java php
git commit -m "feat(sdk): add worker.setLocale across the contract and all four SDKs"
```

---

## Task 8: A published portal carries a default language

**Root:** `platform`

**Files:**
- Modify: `apps/api/src/portal-publish.ts:25` (`PortalConfig`)
- Modify: `packages/portal-templates/src/core/config.ts`
- Modify: `packages/portal-templates/vite.common.ts` (studio preview config)
- Test: `apps/api/test/portal-publish.test.ts` (extend the existing file)

**Interfaces:**
- Produces: `PortalConfig.defaultLocale?: string`, injected into `window.__PORTAL_CONFIG__`.

- [ ] **Step 1: Write the failing test**

Add to the existing portal publish test file:

```ts
    it('carries the published default language into the injected config', async () => {
        const { config } = await publishAndRead({ template: 'portal', defaultLocale: 'et' });
        expect(config.defaultLocale).toBe('et');
    });

    it('omits the default language when the operator has not chosen one', async () => {
        const { config } = await publishAndRead({ template: 'portal' });
        expect(config.defaultLocale).toBeUndefined();
    });
```

Use whatever the file's existing publish-and-read helper is actually named; do not add a
new one if a comparable helper already exists.

- [ ] **Step 2: Run it and confirm it fails**

```bash
pnpm --filter @fivexer/api exec vitest run test/portal-publish.test.ts
```
Expected: FAIL — `config.defaultLocale` is `undefined` in the first case.

- [ ] **Step 3: Implement**

In `apps/api/src/portal-publish.ts`, add to `PortalConfig`:

```ts
    /**
     * Language a portal opens in for a worker who has not chosen one. The
     * worker's own `locale` always wins; this is the workspace's default for a
     * workforce that is, say, Estonian by default.
     */
    defaultLocale?: string;
```

In `packages/portal-templates/src/core/config.ts`, add the same field with the same
comment to the portal's own `PortalConfig`.

In `packages/portal-templates/vite.common.ts`, add to the studio preview config object:

```ts
                defaultLocale: process.env.PORTAL_DEFAULT_LOCALE || undefined,
```

- [ ] **Step 4: Run the test and confirm it passes**

```bash
pnpm --filter @fivexer/api exec vitest run test/portal-publish.test.ts
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/api packages/portal-templates
git commit -m "feat(portal): publish a default language with the portal bundle"
```

---

## Task 9: Server-side worker copy speaks the worker's language

**Root:** `platform`

**Files:**
- Create: `packages/shared/src/locales/en.ts`, `packages/shared/src/locales/et.ts`
- Create: `packages/shared/src/locale.ts`
- Modify: `packages/shared/src/notification-fanout.ts:9` (context), `:77` (`pushTitleAndBody`), `:202` and `:420` (dispatch call sites)
- Test: `packages/shared/test/push-locale.test.ts`

**Interfaces:**
- Produces:
  - `type ServerLocale = 'en' | 'et'`
  - `function pickLocale(value: string | null | undefined): ServerLocale`
  - `function pushCopy(locale: ServerLocale, event: string): { title: string; body: string } | null`
  - `NotificationEmitContext.getWorkerLocale?: (workspaceId: string, workerId: string) => Promise<string | null>`

`packages/shared` must not depend on the control plane — the file says so where
`getSupervisors` is declared. So the locale lookup is injected the same way, and its
absence means "English", never an error.

- [ ] **Step 1: Write the failing test**

Create `packages/shared/test/push-locale.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { pickLocale, pushCopy } from '../src/locale';

describe('push copy', () => {
    it('renders Estonian for a worker who chose it', () => {
        const copy = pushCopy('et', 'task.matched');
        expect(copy).not.toBeNull();
        expect(copy!.title).not.toBe('New task assigned');
        expect(copy!.title.length).toBeGreaterThan(0);
    });

    it('renders English by default', () => {
        expect(pushCopy('en', 'task.matched')!.title).toBe('New task assigned');
    });

    it('returns null for an event with no worker-facing copy', () => {
        expect(pushCopy('en', 'task.something_internal')).toBeNull();
    });

    it('covers every event in both languages', () => {
        const en = Object.keys((pushCopy as unknown as { events: Record<string, unknown> }).events ?? {});
        // Guard rewritten below once the catalog shape exists; see step 3.
        expect(en.length).toBeGreaterThanOrEqual(0);
    });
});

describe('pickLocale', () => {
    it('falls back to English for null, unknown and malformed values', () => {
        expect(pickLocale(null)).toBe('en');
        expect(pickLocale(undefined)).toBe('en');
        expect(pickLocale('ru')).toBe('en');
        expect(pickLocale('et')).toBe('et');
    });
});
```

- [ ] **Step 2: Run it and confirm it fails**

```bash
cd /home/viljar/Projects/fivexer/platform
pnpm --filter @fivexer/platform-shared exec vitest run test/push-locale.test.ts
```
Expected: FAIL — cannot resolve `../src/locale`.

- [ ] **Step 3: Implement the catalog**

Create `packages/shared/src/locales/en.ts` by moving the existing copy out of
`pushTitleAndBody` verbatim — every string must stay byte-identical so English
notifications do not change:

```ts
/** Worker-facing push copy. Generic on purpose: a portal phone is routinely
 *  shared and PIN-authenticated, so nothing identifying belongs in title/body. */
export const workerPushCopy: Record<string, { title: string; body: string }> = {
    'task.matched': { title: 'New task assigned', body: 'Tap to open the task and accept it.' },
    'task.expired': { title: 'Task expired', body: 'An assigned task expired and was returned to the queue.' },
    'task.accepted': { title: 'Task accepted', body: 'You accepted a task.' },
    'task.rejected': { title: 'Task rejected', body: 'You rejected a task; it was returned to the queue.' },
    'task.completed': { title: 'Task completed', body: 'You completed a task.' },
    'task.expiring': { title: 'Task about to expire', body: 'Respond now or it goes back to the queue.' },
    'task.escalated': { title: 'Escalated to you', body: 'Nobody responded in time — this task has been escalated.' },
    'task.escalation_exhausted': {
        title: 'Task unanswered',
        body: 'A task escalated to the end of its ladder without a response.',
    },
    'task.completion_breached': { title: 'Task overdue', body: 'An accepted task passed its completion deadline.' },
    'task.sla_expired': { title: 'Task expired', body: 'A task went stale before it could be finished.' },
    'task.rejection_budget_exhausted': {
        title: 'Task refused too often',
        body: 'A task ran out of rejections and needs an operator.',
    },
    'task.schedule_activated': {
        title: 'Scheduled task is live',
        body: 'A task reached its start time and is now being matched.',
    },
};
```

Continue with every remaining branch of the current `pushTitleAndBody` — read the whole
function first and move all of it, not just the twelve above. Do the same for
`supervisorTitleAndBody` into `supervisorPushCopy` in the same file.

Create `packages/shared/src/locales/et.ts` with the same two exported maps and the same
keys, Estonian values. Follow the agreed glossary (Task 14).

Create `packages/shared/src/locale.ts`:

```ts
import { supervisorPushCopy as enSupervisor, workerPushCopy as enWorker } from './locales/en.js';
import { supervisorPushCopy as etSupervisor, workerPushCopy as etWorker } from './locales/et.js';

export const SERVER_LOCALES = ['en', 'et'] as const;
export type ServerLocale = (typeof SERVER_LOCALES)[number];

/** Anything unrecognised is English. A notification must never fail to send
 *  because someone stored a locale this build does not know. */
export function pickLocale(value: string | null | undefined): ServerLocale {
    return value === 'et' ? 'et' : 'en';
}

const WORKER = { en: enWorker, et: etWorker } as const;
const SUPERVISOR = { en: enSupervisor, et: etSupervisor } as const;

export function pushCopy(locale: ServerLocale, event: string): { title: string; body: string } | null {
    return WORKER[locale][event] ?? WORKER.en[event] ?? null;
}

export function supervisorPushCopyFor(locale: ServerLocale, event: string): { title: string; body: string } | null {
    return SUPERVISOR[locale][event] ?? SUPERVISOR.en[event] ?? null;
}

/** Every worker event this build can render, for the coverage test. */
export const WORKER_PUSH_EVENTS = Object.keys(enWorker);
export const SUPERVISOR_PUSH_EVENTS = Object.keys(enSupervisor);
```

Now replace the placeholder fourth test in step 1 with a real coverage assertion:

```ts
    it('covers every event in both languages', () => {
        for (const event of WORKER_PUSH_EVENTS) {
            expect(pushCopy('et', event), `missing Estonian push copy for ${event}`).not.toBeNull();
            expect(pushCopy('et', event)!.title).not.toBe(pushCopy('en', event)!.title);
        }
    });
```

importing `WORKER_PUSH_EVENTS` alongside the others.

- [ ] **Step 4: Wire the locale through the dispatchers**

In `packages/shared/src/notification-fanout.ts`, add to `NotificationEmitContext`
beside `getSupervisors`:

```ts
    /**
     * The worker's chosen language. Injected rather than imported for the same
     * reason as `getSupervisors`: this package must not depend on the control
     * plane, and a deployment without Postgres has no stored locale at all — so
     * its absence means English, never an error.
     */
    getWorkerLocale?: (workspaceId: string, workerId: string) => Promise<string | null>;
```

Delete `pushTitleAndBody` and `supervisorTitleAndBody` and, in
`dispatchExpoPushToWorker` and `dispatchWebPushToWorker`, replace
`const text = pushTitleAndBody(event, payload);` with:

```ts
    const locale = pickLocale(await ctx.getWorkerLocale?.(workspaceId, workerId).catch(() => null));
    const text = pushCopy(locale, event);
```

Do the equivalent in the supervisor dispatcher using `supervisorPushCopyFor`, resolving
the supervisor's locale the same way if a lookup exists; otherwise pass `'en'` and leave
a comment saying supervisors are not yet localized.

In `apps/api/src/context.ts` (or wherever `NotificationEmitContext` is constructed),
supply the implementation:

```ts
    getWorkerLocale: (workspaceId, workerId) => controlPlane.getWorkerLocale(workspaceId, workerId),
```

- [ ] **Step 5: Run the tests and confirm they pass**

```bash
pnpm --filter @fivexer/platform-shared exec vitest run test/push-locale.test.ts
pnpm --filter @fivexer/platform-shared exec vitest run 2>&1 | tail -10
```
Expected: the new file passes and the rest of the shared suite is unchanged.

- [ ] **Step 6: Commit**

```bash
git add packages/shared apps/api/src
git commit -m "feat(notifications): send worker push copy in the worker's language"
```

---

## Task 10: The invite email speaks the worker's language

**Root:** `platform`

**Files:**
- Modify: `packages/control-plane/src/email-templates.ts:245` (`workerInviteEmail`)
- Modify: `apps/api/src/worker-onboarding.ts:180` (`sendWorkerInviteEmail`)
- Test: `packages/control-plane/test/email.test.ts` (extend)

**Interfaces:**
- Consumes: `pickLocale` / `ServerLocale` from Task 9.
- Produces: `workerInviteEmail(brand, input)` where `WorkerInviteEmailInput` gains
  `locale?: string | null`.

- [ ] **Step 1: Write the failing test**

Add to `packages/control-plane/test/email.test.ts`:

```ts
    it('writes the worker invite in Estonian when the invite says so', () => {
        const message = workerInviteEmail(brand, {
            workerId: 'alex',
            label: 'Alex Tamm',
            acceptUrl: 'https://example.test/accept/abc',
            expiresDays: 7,
            workspaceName: 'Kesklinna meeskond',
            locale: 'et',
        });
        expect(message.subject).not.toContain('worker portal access');
        expect(message.text).toContain('Alex');
        expect(message.text).toContain('https://example.test/accept/abc');
    });

    it('keeps the English invite byte-identical when no locale is given', () => {
        const message = workerInviteEmail(brand, {
            workerId: 'alex',
            acceptUrl: 'https://example.test/accept/abc',
            expiresDays: 7,
            workspaceName: 'Central team',
        });
        expect(message.subject).toBe(`Your ${brand.productName} worker portal access`);
        expect(message.text).toContain("You've been invited to the Central team worker portal");
    });
```

Reuse the `brand` fixture the file already builds.

- [ ] **Step 2: Run it and confirm it fails**

```bash
pnpm --filter @fivexer/control-plane exec vitest run test/email.test.ts
```
Expected: FAIL — the Estonian subject still contains the English text.

- [ ] **Step 3: Implement**

In `packages/control-plane/src/email-templates.ts`, add `locale?: string | null` to
`WorkerInviteEmailInput`, then split the copy in `workerInviteEmail` into a per-locale
strings object at the top of the function and interpolate it into the existing HTML and
text templates. Keep the HTML structure, inline styles, `escapeHtml` calls and the
`button()` helper exactly as they are — only the words change. English strings must stay
byte-identical to today's so the second test passes.

In `apps/api/src/worker-onboarding.ts`, pass the identity's locale through:

```ts
        const message = workerInviteEmail(ctx.emailBrand, {
            workerId: identity.workerId,
            label: identity.label,
            acceptUrl,
            expiresDays: Math.max(1, Math.round(plane.workerInviteTtlMs / (24 * 60 * 60 * 1000))),
            workspaceName,
            locale: identity.locale,
        });
```

- [ ] **Step 4: Run the tests and confirm they pass**

```bash
pnpm --filter @fivexer/control-plane exec vitest run test/email.test.ts
```
Expected: PASS, including every pre-existing test in the file.

- [ ] **Step 5: Commit**

```bash
git add packages/control-plane apps/api/src/worker-onboarding.ts
git commit -m "feat(email): send the worker invite in the invited worker's language"
```

---

# Phase B — Worker portal

## Task 11: Portal Lingui toolchain and provider

**Root:** `platform/packages/portal-templates`

**Files:**
- Modify: `package.json`, `vite.common.ts`
- Create: `lingui.config.ts`, `src/core/i18n.ts`, `src/core/format.ts`
- Modify: `templates/portal/main.tsx`
- Test: `test/i18n.test.ts`

**Interfaces:**
- Produces:
  - `resolvePortalLocale({ worker, config, navigator }): 'en' | 'et'`
  - `<PortalI18nProvider>` wrapping the app
  - `useLocale(): { locale, setLocale }`

The portal runs Vite 5.4, which `@lingui/vite-plugin` 6 does not support (it needs Vite
6.3+). It does not need it: `@vitejs/plugin-react` 4.7 still exposes Babel directly, and
the portal is small enough to ship both catalogs inline, so `lingui compile --typescript`
emits committed `messages.ts` files that are imported statically. This also keeps the
Portal Studio sandbox working, which serves the raw source through a Vite dev server.

- [ ] **Step 1: Install**

```bash
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"
cd /home/viljar/Projects/fivexer/platform/packages/portal-templates
pnpm add @lingui/core@^6.6.0 @lingui/react@^6.6.0
pnpm add -D @lingui/cli@^6.6.0 @lingui/babel-plugin-lingui-macro@^6.6.0
```

- [ ] **Step 2: Configure extraction and the macro transform**

Create `lingui.config.ts`:

```ts
import { defineConfig } from '@lingui/cli';

export default defineConfig({
    sourceLocale: 'en',
    locales: ['en', 'et'],
    catalogs: [{ path: '<rootDir>/src/locales/{locale}/messages', include: ['src/core', 'templates'] }],
    // Committed, statically imported catalogs: the portal ships both languages in
    // one small bundle, and this keeps the studio sandbox's Vite 5 dev server
    // working without a bundler plugin.
    compileNamespace: 'ts',
});
```

In `vite.common.ts`, change the plugin line:

```ts
        plugins: [react({ babel: { plugins: ['@lingui/babel-plugin-lingui-macro'] } }), studioPreviewConfigPlugin(id)],
```

Add the catalog scripts to `package.json`:

```json
        "i18n:extract": "lingui extract",
        "i18n:compile": "lingui compile --typescript",
```

and make `build` run the compile first:

```json
        "build": "rm -rf dist && pnpm run i18n:compile && tsc -p tsconfig.json && pnpm run build:templates",
```

- [ ] **Step 3: Write the failing test**

Create `test/i18n.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { resolvePortalLocale } from '../src/core/i18n';

describe('resolvePortalLocale', () => {
    it('uses the worker’s own choice above all', () => {
        expect(resolvePortalLocale({ worker: 'en', config: 'et', navigator: ['et-EE'] })).toBe('en');
    });

    it('falls back to the published default', () => {
        expect(resolvePortalLocale({ worker: null, config: 'et', navigator: ['en-GB'] })).toBe('et');
    });

    it('auto-selects from the phone’s language', () => {
        expect(resolvePortalLocale({ navigator: ['et-EE'] })).toBe('et');
    });

    it('defaults to English', () => {
        expect(resolvePortalLocale({})).toBe('en');
        expect(resolvePortalLocale({ worker: 'zz', config: 'qq', navigator: ['fr'] })).toBe('en');
    });
});
```

- [ ] **Step 4: Run it and confirm it fails**

```bash
pnpm exec vitest run test/i18n.test.ts
```
Expected: FAIL — cannot resolve `../src/core/i18n`.

- [ ] **Step 5: Implement**

Create `src/core/i18n.ts`:

```tsx
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { messages as enMessages } from '../locales/en/messages.js';
import { messages as etMessages } from '../locales/et/messages.js';
import { getConfig } from './config.js';
import { setLocale as saveLocale } from './api.js';

export const PORTAL_LOCALES = ['en', 'et'] as const;
export type PortalLocale = (typeof PORTAL_LOCALES)[number];

function isPortalLocale(value: unknown): value is PortalLocale {
    return typeof value === 'string' && (PORTAL_LOCALES as readonly string[]).includes(value);
}

/**
 * The worker's own stored choice wins, then the language the operator published
 * the portal in, then the phone. Both catalogs are bundled, so switching is
 * instant and works offline — which matters on a shift.
 */
export function resolvePortalLocale(input: {
    worker?: string | null;
    config?: string | null;
    navigator?: readonly string[];
}): PortalLocale {
    if (isPortalLocale(input.worker)) return input.worker;
    if (isPortalLocale(input.config)) return input.config;
    for (const tag of input.navigator ?? []) {
        const language = tag.toLowerCase().split('-')[0];
        if (isPortalLocale(language)) return language;
    }
    return 'en';
}

i18n.load({ en: enMessages, et: etMessages });

interface LocaleContextValue {
    locale: PortalLocale;
    setLocale: (next: PortalLocale) => void;
}

const LocaleContext = createContext<LocaleContextValue>({ locale: 'en', setLocale: () => {} });

export function PortalI18nProvider({ worker, children }: { worker?: string | null; children: ReactNode }) {
    const initial = useMemo(
        () =>
            resolvePortalLocale({
                worker,
                config: getConfig().defaultLocale,
                navigator: typeof navigator === 'undefined' ? [] : navigator.languages,
            }),
        [worker],
    );
    const [locale, setLocaleState] = useState<PortalLocale>(initial);
    i18n.activate(locale);
    if (typeof document !== 'undefined') document.documentElement.lang = locale;

    const setLocale = useCallback((next: PortalLocale) => {
        setLocaleState(next);
        i18n.activate(next);
        document.documentElement.lang = next;
        // Best effort: the language must change now even if the network is down.
        void saveLocale(next).catch(() => {});
    }, []);

    return (
        <LocaleContext.Provider value={{ locale, setLocale }}>
            <I18nProvider i18n={i18n}>{children}</I18nProvider>
        </LocaleContext.Provider>
    );
}

export const useLocale = () => useContext(LocaleContext);
```

Add to `src/core/api.ts`, beside `setAvailability`:

```ts
export async function setLocale(locale: string | null): Promise<void> {
    await api<{ workerId: string; locale: string | null }>('/me', {
        method: 'PATCH',
        body: JSON.stringify({ locale }),
    });
}
```

Create empty catalogs so the imports resolve, then compile:

```bash
pnpm run i18n:extract && pnpm run i18n:compile
```

- [ ] **Step 6: Wrap the app**

In `templates/portal/main.tsx`:

```tsx
import { PortalI18nProvider } from '../../src/core/i18n';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <PortalI18nProvider>
            <PortalApp />
        </PortalI18nProvider>
    </StrictMode>,
);
```

The provider takes the worker's stored locale once `/me` has resolved. Pass it from
inside `PortalApp` by re-rendering the provider there instead if the app's data flow makes
the `main.tsx` position impossible — the constraint is that the worker's choice wins, not
where the provider sits.

- [ ] **Step 7: Run the tests and the build**

```bash
pnpm exec vitest run test/i18n.test.ts
pnpm run build 2>&1 | tail -10
```
Expected: 4 tests pass; the build completes and writes `dist/templates/portal`.

- [ ] **Step 8: Commit**

```bash
git add package.json pnpm-lock.yaml lingui.config.ts vite.common.ts src templates test
git commit -m "feat(portal): add Lingui with committed catalogs and locale resolution"
```

---

## Task 12: Glossary and the portal language switch

**Root:** `platform`

**Files:**
- Create: `docs/i18n/glossary.md`
- Modify: `packages/portal-templates/src/core/Me.tsx`

**Interfaces:**
- Consumes: `useLocale` from Task 11.

- [ ] **Step 1: Write the glossary**

Create `docs/i18n/glossary.md` with a table of `English | Estonian | Note` covering at
least: assignment, task, worker, shift, roster, workspace, site, cover, time off,
contract hours, break, queue, escalation, skill, team, availability, PIN, sign in.

Fill the Estonian column with proposed terms. **Stop and get these reviewed by the
native speaker before Task 13** — every later task depends on them, and changing a term
afterwards means re-editing every catalog.

- [ ] **Step 2: Add the switch to the Me screen**

In `packages/portal-templates/src/core/Me.tsx`, add a section after the skills card:

```tsx
            <section className="portal-card" aria-labelledby="me-language-title">
                <h2 id="me-language-title" className="portal-section-title">
                    <Trans>Language</Trans>
                </h2>
                <div className="portal-language-choice" role="group" aria-labelledby="me-language-title">
                    {PORTAL_LOCALES.map((option) => (
                        <button
                            key={option}
                            type="button"
                            className={option === locale ? 'portal-chip is-selected' : 'portal-chip'}
                            aria-pressed={option === locale}
                            onClick={() => setLocale(option)}
                        >
                            {LOCALE_NAMES[option]}
                        </button>
                    ))}
                </div>
            </section>
```

with, at the top of the file:

```tsx
import { Trans } from '@lingui/react/macro';
import { PORTAL_LOCALES, useLocale } from './i18n.js';

/** Each language named in itself — a worker looking for Estonian looks for "Eesti keel". */
const LOCALE_NAMES: Record<string, string> = { en: 'English', et: 'Eesti keel' };
```

and `const { locale, setLocale } = useLocale();` inside the component.

- [ ] **Step 3: Verify**

```bash
cd /home/viljar/Projects/fivexer/platform/packages/portal-templates
pnpm run i18n:extract
pnpm exec vitest run 2>&1 | tail -10
```
Expected: extraction reports the new `Language` message; the portal suite passes.

- [ ] **Step 4: Commit**

```bash
git add docs/i18n/glossary.md packages/portal-templates
git commit -m "feat(portal): let a worker switch language from their profile"
```

---

## Task 13: Wrap the portal's strings

**Root:** `platform/packages/portal-templates`

**Files:** every file under `src/core` that renders text. Work in this order, one commit
per group, so a failure is easy to localise:

1. `Login.tsx`, `App.tsx`
2. `Queue.tsx`, `TaskDetail.tsx`
3. `Me.tsx`, `Skills.tsx`, `PushToggle.tsx`
4. `Availability.tsx`, `TimeOff.tsx`, `MySchedule.tsx`
5. `TimeLog.tsx`, `BreakLog.tsx`, `Metrics.tsx`, `TeamBoard.tsx`
6. `Supervisor.tsx` and anything left

**The recipe, applied to each file:**

- [ ] **Step 1: Wrap the visible strings**

- JSX text → `<Trans>Welcome back</Trans>`.
- Attributes and any string passed as a value → `const { t } = useLingui();` then
  ``t`Worker ID` ``.
- Text with an interpolation → keep it inside one `<Trans>`:
  `<Trans>Signed in as {label}</Trans>`. Never concatenate translated fragments.
- Counts → `<Plural value={n} one="# task" other="# tasks" />` from `@lingui/react/macro`.
- **Do not wrap**: worker labels, task titles, skill names, tag tokens, tracker keys,
  `err.message`, or any value that came from the API as data.

- [ ] **Step 2: Extract and check nothing was missed**

```bash
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"
cd /home/viljar/Projects/fivexer/platform/packages/portal-templates
pnpm run i18n:extract
grep -nE '>[A-Z][a-z]+ [a-z]+[^<{]*<' src/core/<file>.tsx
```
Expected: the grep prints nothing but genuinely dynamic content.

- [ ] **Step 3: Translate**

Fill the `msgstr` values for the new messages in `src/locales/et/messages.po`, following
`docs/i18n/glossary.md`. Leave nothing empty.

- [ ] **Step 4: Compile, test and eyeball**

```bash
pnpm run i18n:compile
pnpm exec vitest run 2>&1 | tail -5
```
Expected: the portal suite passes.

Then look at the screen in both languages. Estonian is about a quarter longer, so check
buttons and the queue rows for wrapping.

- [ ] **Step 5: Commit the group**

```bash
git add src templates
git commit -m "i18n(portal): translate the <group> screens"
```

- [ ] **Step 6: After the last group, add the coverage gate**

Create `test/i18n-coverage.test.ts`:

```ts
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/** Every extracted message must have an Estonian translation. This is the gate that
 *  keeps a new English string from shipping untranslated: add a string, run extract,
 *  and this fails until someone writes the Estonian. */
describe('Estonian catalog', () => {
    it('translates every message', () => {
        const po = readFileSync(new URL('../src/locales/et/messages.po', import.meta.url), 'utf8');
        const untranslated = po
            .split('\n\n')
            .filter((block) => block.includes('msgid "') && /msgstr ""\s*$/.test(block))
            .map((block) => block.match(/msgid "(.*)"/)?.[1])
            .filter(Boolean);
        expect(untranslated, `untranslated: ${untranslated.join(', ')}`).toEqual([]);
    });
});
```

Run it, confirm it passes, and commit.

- [ ] **Step 7: Prove a screen actually renders in Estonian**

Add to `test/ui.test.ts` a case that renders the Login screen with the Estonian catalog
active, following the render helper that file already uses:

```ts
it('renders the sign-in screen in Estonian', async () => {
    i18n.activate('et');
    const { getByText } = renderPortal(<Login />);
    // The English source must not survive activation.
    expect(() => getByText('Welcome back')).toThrow();
    i18n.activate('en');
});
```

Run the portal suite, confirm it passes, and commit.

---

## Task 14: Estonian review pass for the portal

**Root:** `platform/packages/portal-templates`

- [ ] **Step 1: Build and publish a portal to a test workspace, then open it on a phone-sized viewport in both languages.**
- [ ] **Step 2: Collect the native speaker's corrections into `src/locales/et/messages.po`.**
- [ ] **Step 3: Recompile, re-run the suite, commit as `i18n(portal): apply Estonian review corrections`.**

---

# Phase C — Console

## Task 15: Console locale provider, language switch and auth pages

**Root:** `assignment-engine/example/web`

**Files:**
- Create: `src/ui/platform/i18n/LocaleProvider.tsx`, `src/ui/platform/i18n/LanguageSelect.tsx`
- Modify: `src/main.tsx:272`
- Modify: `src/ui/platform/pages/SettingsPage.tsx:36`
- Modify: `src/ui/platform/LoginPage.tsx`, `SignupPage.tsx`, `ResetPasswordPage.tsx`

**Interfaces:**
- Consumes: `resolveLocale`, `readStoredLocale`, `writeStoredLocale`, `Locale` (Task 2);
  `platform.console.updateMe` (Task 5).
- Produces: `<LocaleProvider>`, `useLocale(): { locale, setLocale, ready }`, `<LanguageSelect />`.

- [ ] **Step 1: Implement the provider**

Create `src/ui/platform/i18n/LocaleProvider.tsx`:

```tsx
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { readStoredLocale, resolveLocale, writeStoredLocale, type Locale } from './locale';

/**
 * Catalogs are separate chunks: the Estonian one is about 100KB of text and an
 * English console must never download it. Even the source locale is loaded this
 * way — Lingui needs a catalog for it too, and inlining English would duplicate
 * every message into the main bundle.
 */
async function activate(locale: Locale): Promise<void> {
    const { messages } = await import(`../../../locales/${locale}/messages.po`);
    i18n.load(locale, messages);
    i18n.activate(locale);
    document.documentElement.lang = locale;
}

interface LocaleContextValue {
    locale: Locale;
    setLocale: (next: Locale) => void;
    /** False until the first catalog has loaded; the tree must not render before then. */
    ready: boolean;
}

const LocaleContext = createContext<LocaleContextValue>({ locale: 'en', setLocale: () => {}, ready: false });

export function LocaleProvider({
    accountLocale,
    onPersist,
    children,
}: {
    /** From `/me`; undefined while it is still loading. */
    accountLocale?: string | null;
    /** Writes the choice to the account. Absent on the signed-out screens. */
    onPersist?: (locale: Locale) => void;
    children: React.ReactNode;
}) {
    const [locale, setLocaleState] = useState<Locale>(() =>
        resolveLocale({ stored: readStoredLocale(), navigator: navigator.languages }),
    );
    const [ready, setReady] = useState(false);

    // The account's choice arrives after `/me` resolves. It only moves the locale
    // when it actually differs, so a signed-in Estonian user does not get a second
    // catalog fetch on every render.
    useEffect(() => {
        if (accountLocale === undefined) return;
        const next = resolveLocale({
            account: accountLocale,
            stored: readStoredLocale(),
            navigator: navigator.languages,
        });
        setLocaleState((current) => (current === next ? current : next));
    }, [accountLocale]);

    useEffect(() => {
        let cancelled = false;
        void activate(locale).then(() => {
            if (!cancelled) setReady(true);
        });
        return () => {
            cancelled = true;
        };
    }, [locale]);

    const setLocale = useCallback(
        (next: Locale) => {
            // Both, deliberately: the account so the choice follows the person to
            // another device, the browser so the next cold start paints the right
            // language before `/me` answers.
            writeStoredLocale(next);
            setLocaleState(next);
            onPersist?.(next);
        },
        [onPersist],
    );

    if (!ready) return null;
    return (
        <LocaleContext.Provider value={{ locale, setLocale, ready }}>
            <I18nProvider i18n={i18n}>{children}</I18nProvider>
        </LocaleContext.Provider>
    );
}

export const useLocale = () => useContext(LocaleContext);
```

- [ ] **Step 2: Implement the switch**

Create `src/ui/platform/i18n/LanguageSelect.tsx`:

```tsx
import { useLocale } from './LocaleProvider';
import { LOCALES, type Locale } from './locale';

/** Each language named in itself, so someone who cannot read the current UI can
 *  still find their own. */
const LOCALE_NAMES: Record<Locale, string> = { en: 'English', et: 'Eesti keel' };

export function LanguageSelect({ id = 'language-select' }: { id?: string }) {
    const { locale, setLocale } = useLocale();
    return (
        <select id={id} className="pf-select" value={locale} onChange={(e) => setLocale(e.target.value as Locale)}>
            {LOCALES.map((option) => (
                <option key={option} value={option}>
                    {LOCALE_NAMES[option]}
                </option>
            ))}
        </select>
    );
}
```

- [ ] **Step 3: Mount it**

In `src/main.tsx`, wrap only the console and auth routes — not the marketing pages —
inside the existing `ThemeProvider`/`QueryClientProvider` tree. The provider needs the
account locale, which lives behind the `['pf','me']` query in `ConsolePage.tsx:141`, so
mount `LocaleProvider` inside `ConsolePage` where `meQuery` resolves, passing:

```tsx
<LocaleProvider
    accountLocale={meQuery.data?.user.locale}
    onPersist={(locale) => {
        void platform.console.updateMe({ locale }).catch(() => {});
    }}
>
```

and mount a second, account-free `LocaleProvider` around `LoginPage`, `SignupPage` and
`ResetPasswordPage` in `main.tsx`.

- [ ] **Step 4: Add the Settings section**

In `src/ui/platform/pages/SettingsPage.tsx`, add a `LanguageSection` beside the existing
sections, following the shape of `RenameSection`:

```tsx
function LanguageSection() {
    return (
        <section className="pf-card">
            <h2><Trans>Language</Trans></h2>
            <p className="pf-hint">
                <Trans>Changes the console for you only. Your team keeps their own choice.</Trans>
            </p>
            <label htmlFor="language-select"><Trans>Console language</Trans></label>
            <LanguageSelect />
        </section>
    );
}
```

- [ ] **Step 5: Adopt a signed-out choice at first sign-in**

In the sign-in success path, after `/me` resolves, if `user.locale` is null and a stored
locale exists, persist the stored one:

```ts
if (me.user.locale === null) {
    const stored = readStoredLocale();
    if (stored) void platform.console.updateMe({ locale: stored }).catch(() => {});
}
```

An account that already has an explicit choice is never overwritten by a device.

- [ ] **Step 6: Verify in the browser**

```bash
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"
cd /home/viljar/Projects/fivexer/assignment-engine/example/web
npx lingui extract
node node_modules/vite/bin/vite.js --port 5173 > /tmp/vite-console.log 2>&1 &
```
The console needs the API on `:8080`. Open `/console`, change the language on Settings,
reload, and confirm it stays. Confirm `document.documentElement.lang` follows.

- [ ] **Step 7: Commit**

```bash
git add src lingui.config.ts
git commit -m "feat(console): add the locale provider and a language setting"
```

---

## Task 16: Wrap the console shell and navigation

**Root:** `assignment-engine/example/web`

**Files:** `src/ui/platform/ConsolePage.tsx`, everything in `src/ui/platform/components`.

Apply the same recipe as Task 13 (`<Trans>` for JSX text, `useLingui()`'s `t` for
attributes, `<Plural>` for counts, never wrap API data). Extract, translate, then check
the nav rail specifically: Estonian labels are the item most likely to wrap.

- [ ] **Step 1: Wrap, extract, translate, verify, commit** as `i18n(console): translate the shell and navigation`.

---

## Task 17: Translated labels for enum values

**Root:** `assignment-engine/example/web`

**Files:**
- Create: `src/ui/platform/i18n/labels.ts`
- Test: `src/ui/platform/i18n/labels.test.ts`

**Interfaces:**
- Produces: `taskStatusLabel(status: string): MessageDescriptor`, and one such function per
  enum the console renders (task status, worker status, membership role, connector state,
  workflow run state).

An API value must never become a message id, or a backend rename silently blanks the UI
and a translated value could get sent back to the server. The lookup keeps the two apart:
the value stays the value, and the label is a separate translatable message.

- [ ] **Step 1: Write the failing test**

Create `src/ui/platform/i18n/labels.test.ts`:

```ts
import { i18n } from '@lingui/core';
import { describe, expect, it } from 'vitest';
import { taskStatusLabel } from './labels';

describe('taskStatusLabel', () => {
    it('returns a descriptor for every status the console renders', () => {
        for (const status of ['queued', 'pending', 'accepted', 'completed', 'failed', 'parked']) {
            expect(taskStatusLabel(status), status).toBeTruthy();
        }
    });

    it('falls back to the raw value for a status this build does not know', () => {
        // A newer API can introduce a status; the console must render something,
        // not an empty cell.
        expect(i18n._(taskStatusLabel('teleported'))).toBe('teleported');
    });
});
```

- [ ] **Step 2: Run it and confirm it fails**

```bash
npx vitest run src/ui/platform/i18n/labels.test.ts
```
Expected: FAIL — cannot resolve `./labels`.

- [ ] **Step 3: Implement**

Create `src/ui/platform/i18n/labels.ts`:

```ts
import { msg } from '@lingui/core/macro';
import type { MessageDescriptor } from '@lingui/core';

/**
 * Translated labels for values that are also API data.
 *
 * The value and its label are deliberately separate things. Wrapping the raw
 * value in `<Trans>` would make a backend rename blank the cell, and would risk a
 * translated string travelling back to the server as a filter argument.
 */
const TASK_STATUS: Record<string, MessageDescriptor> = {
    queued: msg`Queued`,
    pending: msg`Waiting for an answer`,
    accepted: msg`Accepted`,
    completed: msg`Completed`,
    failed: msg`Failed`,
    parked: msg`Parked`,
};

/** Unknown values render as themselves: a newer API must never blank a cell. */
export function taskStatusLabel(status: string): MessageDescriptor {
    return TASK_STATUS[status] ?? { id: status, message: status };
}
```

Add the other enums the console renders in the same shape as you reach them in
Tasks 18–24, each with its own lookup and its own fallback.

- [ ] **Step 4: Run the test and confirm it passes**

```bash
npx vitest run src/ui/platform/i18n/labels.test.ts
```
Expected: PASS, 2 tests.

- [ ] **Step 5: Commit**

```bash
git add src/ui/platform/i18n/labels.ts src/ui/platform/i18n/labels.test.ts
git commit -m "feat(console): translate status labels without translating API values"
```

---

## Tasks 18–24: Wrap the console pages, one group per task

Same recipe, same per-task cycle (wrap → `npx lingui extract` → translate the new
`msgstr` values → `npx vitest run` → eyeball both languages → commit). Groups, smallest
first so the recipe is proven before the big files:

| Task | Group | Files |
|---|---|---|
| 18 | Auth and onboarding | `LoginPage.tsx`, `SignupPage.tsx`, `ResetPasswordPage.tsx`, `pages/onboarding/`, `pages/SetupPage.tsx` |
| 19 | Tasks | `pages/TasksPage.tsx`, `pages/tasks/` |
| 20 | Workers, skills, teams | `pages/WorkersPage.tsx`, `pages/workers/`, `pages/SkillsPage.tsx`, `pages/TeamsPage.tsx` |
| 21 | Roster and time | `pages/RosterPage.tsx`, `pages/roster/`, `pages/TimePage.tsx`, `pages/time/` |
| 22 | Live ops, performance, decisions, learning | `pages/LiveOpsPage.tsx`, `pages/liveops/`, `pages/PerformancePage.tsx`, `pages/performance/`, `pages/DecisionsPage.tsx`, `pages/LearningPage.tsx`, `pages/overview/`, `pages/OverviewPage.tsx` |
| 23 | Workflows and portal | `pages/WorkflowsPage.tsx`, `workflows/`, `pages/PortalPage.tsx`, `pages/portal/`, `pages/PortalStudioPage.tsx` |
| 24 | Settings and billing | `pages/SettingsPage.tsx`, `pages/settings/`, `pages/BillingPage.tsx` |

**Task 20 carries an extra step.** The worker detail page gains a **Language** control on
the worker record, which is what the push notifications and the invite email read. It
writes through the workers API the page already uses; if no field exists there yet, add
`locale` to the worker update endpoint the same way Task 6 added it to the portal route,
with the same `SUPPORTED_LOCALES` guard and a test alongside the existing worker tests.

**Task 23 carries an extra step.** The Portal page gains a **Default language** select in
the publish form, bound to `PortalConfig.defaultLocale` from Task 8. Label it so the
precedence is obvious, for example "Language new workers see until they choose their own".

**Task 21 carries an extra step.** `pages/roster/rules.ts` is ~1,300 lines of
explanatory copy about working-time rule shapes. Its strings are module-scope constants,
not JSX, so they need `msg` from `@lingui/core/macro` and rendering through `i18n._()`
at the call site:

```ts
import { msg } from '@lingui/core/macro';

export const RULE_COPY = {
    minRest: {
        title: msg`Minimum daily rest`,
        help: msg`The gap every person must get between two shifts.`,
    },
};
```

and at the point of use, `const { i18n } = useLingui(); i18n._(RULE_COPY.minRest.title)`.
Rule *identifiers* stay untranslated — only the human copy moves.

**Task 24 carries an extra step.** `pages/BillingPage.tsx` renders money and dates
heavily; convert every `toLocaleString`/`toLocaleDateString` there to `formatMoney`,
`formatDate` and `formatDateTime` from `src/lib/format.ts`, passing the locale from
`useLocale()`.

---

## Task 25: Migrate the remaining formatting calls

**Root:** `assignment-engine/example/web`

**Files:** every remaining `toLocale*` call under `src/ui/platform`.

- [ ] **Step 1: Find them**

```bash
cd /home/viljar/Projects/fivexer/assignment-engine/example/web
grep -rnE "toLocale(String|DateString|TimeString)\(" src/ui/platform
```

- [ ] **Step 2: Replace each with the `src/lib/format.ts` equivalent**, taking the locale
from `useLocale()`. A call inside a non-React helper takes the locale as a parameter
rather than reaching for a global.

- [ ] **Step 3: Check the dayjs formats**

```bash
grep -rn "dayjs(" src/ui/platform | grep format
```
Each hardcoded pattern is a decision: a fixed technical timestamp can stay, but anything a
person reads should move to `formatDateTime`.

- [ ] **Step 4: Verify and commit**

```bash
npx vitest run 2>&1 | tail -5
git add src && git commit -m "refactor(console): route every displayed date and number through the locale formatter"
```

---

## Task 26: Console coverage gate and the lint that keeps it closed

**Root:** `assignment-engine/example/web`

**Files:**
- Create: `src/ui/platform/i18n/coverage.test.ts`
- Modify: `package.json` (build script)

- [ ] **Step 1: Write the coverage test**

Create `src/ui/platform/i18n/coverage.test.ts`:

```ts
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * The gate that stops an English string shipping to an Estonian operator. Add a
 * `<Trans>`, run `npx lingui extract`, and this fails until the Estonian is written.
 *
 * `ALLOWED_UNTRANSLATED` exists only for the rollout and must shrink, never grow.
 * A pull request that adds an entry needs a reason in its description.
 */
const ALLOWED_UNTRANSLATED: string[] = [];

describe('Estonian console catalog', () => {
    it('translates every extracted message', () => {
        const po = readFileSync(resolve(__dirname, '../../../locales/et/messages.po'), 'utf8');
        const untranslated = po
            .split('\n\n')
            .filter((block) => block.includes('msgid "') && /msgstr ""\s*$/m.test(block))
            .map((block) => block.match(/msgid "(.*)"/)?.[1] ?? '')
            .filter((id) => id && !ALLOWED_UNTRANSLATED.includes(id));
        expect(untranslated, `untranslated: ${untranslated.join(' | ')}`).toEqual([]);
    });
});
```

- [ ] **Step 2: Run it**

```bash
npx lingui extract && npx vitest run src/ui/platform/i18n/coverage.test.ts
```
Expected: PASS once Tasks 16–24 are complete. While they are in progress it lists exactly
what is still English, which is the point.

- [ ] **Step 3: Add the lint that stops a new bare string**

The console has no ESLint of its own — the `assignment-engine` root config ignores
`example/**` — so this adds one, scoped narrowly to this single rule. A broad new lint
across 358 components is out of scope and would bury the signal.

```bash
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"
cd /home/viljar/Projects/fivexer/assignment-engine/example/web
pnpm add -D eslint@^9 eslint-plugin-lingui@^0.15.0 typescript-eslint@^8
```

Create `eslint.config.mjs`:

```js
import tseslint from 'typescript-eslint';
import lingui from 'eslint-plugin-lingui';

/**
 * Deliberately one rule over one directory. The console is the only translated
 * surface, and a general lint over the whole site is a separate decision — this
 * exists so a new untranslated string fails review rather than shipping.
 */
export default [
    {
        files: ['src/ui/platform/**/*.{ts,tsx}'],
        ignores: ['**/*.test.ts', '**/*.test.tsx'],
        plugins: { lingui, '@typescript-eslint': tseslint.plugin },
        languageOptions: { parser: tseslint.parser },
        rules: {
            'lingui/no-unlocalized-strings': [
                'error',
                {
                    ignoreNames: [
                        { regex: { pattern: '^(className|to|href|id|key|type|role|data-.*|aria-hidden)$' } },
                    ],
                },
            ],
        },
    },
];
```

Add the script to `package.json`:

```json
        "lint": "eslint src/ui/platform",
```

```bash
pnpm lint
```
Expected: exits 0 once Tasks 16–24 are complete. Any remaining error names a file and a
string that still needs wrapping — fix it rather than widening `ignoreNames`.

- [ ] **Step 4: Make the build refuse a stale catalog**

In `package.json`, put extraction at the front of `build`:

```
"build": "lingui extract --clean && tsc -b && node scripts/generate-route-entries.mjs && ..."
```

leaving the rest of the existing chain untouched. `--clean` drops orphaned messages, so a
deleted screen does not leave its strings in the catalog forever.

- [ ] **Step 5: Verify the whole build still works**

```bash
pnpm build 2>&1 | tail -20
```
Expected: completes. It needs system Chrome for the prerender step.

- [ ] **Step 6: Commit**

```bash
git add package.json pnpm-lock.yaml eslint.config.mjs src/ui/platform/i18n/coverage.test.ts src/locales
git commit -m "test(console): fail the build on an untranslated or stale catalog"
```

---

## Task 27: Documentation and release

**Root:** both repos

- [ ] **Step 1:** Document the language setting in the console README / docs page that
  covers Settings, and the portal language switch where the portal is documented.
- [ ] **Step 2:** Note in `docs/i18n/glossary.md` that it is the source of truth for
  translation terms and must be updated before, not after, a new term ships.
- [ ] **Step 3:** Run both full suites, one at a time — never concurrently, they share a
  Redis database:

```bash
cd /home/viljar/Projects/fivexer/platform && pnpm test 2>&1 | tail -30
npx vitest run 2>&1 | tail -20
```
Compare failures against the known-failing list before believing any of them are new.
- [ ] **Step 4:** Commit as `docs: document the console and portal language settings`.

---

## Notes carried from the spec

- **Portal Studio.** An AI-customised portal is a copy of the template source, so the
  locale plumbing and both catalogs travel with it and keep working. Strings the studio
  agent writes are untranslated until someone extracts them. Accepted, not solved.
- **Server error text** surfaced through `err.message` (~98 sites) stays English. Making
  it translatable means mapping the API's existing error `code` values to messages on the
  client, which is a separate change.
- **Marketing pages, docs, the SDKs and the agent daemon** are out of scope.
