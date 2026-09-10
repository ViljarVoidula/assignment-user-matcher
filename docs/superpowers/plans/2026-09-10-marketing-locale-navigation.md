# Marketing Locale Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A reader who chooses Estonian stays in Estonian chrome everywhere on the public site, can always see and use the language switch, gets translated Pricing and Solutions pages, and can find the way back from the simulator and the docs.

**Architecture:** Today the locale *is* the URL and nothing else (`SiteLocaleProvider`), and only thirteen routes have an `/et` URL. Every other page (Solutions, Docs, Guides, Blog, the `/app` simulator, the legal pages) has no Estonian URL, so a link there drops the prefix, the header has no locale to read, the switch hides itself (`hasTranslation` is false), and `/app` does not even mount the site catalog. The fix keeps the URL as the sole source of truth for **content** (prerender-correct, SEO-safe, unchanged) and adds a **remembered chrome locale** for pages that have no Estonian URL: header, footer, switch, notices and internal links render in the remembered language, the body stays honestly English with a one-line notice, and nothing ever redirects. Pricing and Solutions get real translations and `/et` twins, which is what closes the header loop (every header item then either has a twin or is a declared English-only surface).

**Tech Stack:** React 19 (`createRoot`, no hydration), Lingui 6.6 macros (`<Trans>`, `msg`, `useLingui`), site catalog `src/locales/site/{en,et}/messages.po`, Vitest, Playwright (e2e + prerender), `scripts/audit-i18n-seo.mjs`.

All paths below are relative to `example/web/` unless stated otherwise.

## Global Constraints

- Commit messages use Conventional Commits. **Do not add `Co-Authored-By` trailers for AI assistants.** Do not publish Anthropic or other AI-service email addresses in commits.
- Never `git add -A` or `git add .`. Stage files **by name only**. A concurrent session has uncommitted work in the same tree (`FeaturesPage.tsx`, `featuresContent.ts`, console top-bar files, `CLAUDE.md`, `DESIGN.md`, `record.css` `--warn-ink` hunk, starter-kit scripts, `api-reference.json`, `RecordSwitch.tsx`). Check `git diff --cached` before every commit; if a shared file (`routes.json`, either `messages.po`, `record.css`, `eslint.config.mjs`) carries their hunks, stage a commit-only blob with `git hash-object -w` + `git update-index --cacheinfo`.
- **Never run `pnpm build` (or `lingui extract --clean`) with any source file stashed or missing.** It deletes catalog entries for absent files. Verify commits in isolation with `tsc -b`, `vitest`, `eslint` only; build on the complete tree.
- The stored preference is a hint for chrome only. It **never redirects**, never changes `<html lang>`, never changes body copy, and never influences prerendered output.
- `<html lang>` always equals the **content** locale (the URL's answer). `scripts/prerender.mjs` waits on it.
- The switch gates on `hasTranslation(path)` (does the Estonian URL exist), **never** `isLocaleIndexable` (may we announce it). `localeHref` likewise.
- Add a path to `TRANSLATED_COPY_PATHS` **in the same commit** that lands its translated body, never before.
- The FAQ shown on a translated page must be mirrored into `routes.json` `i18n.et.faq` (audit check 10).
- Legal pages (`/terms`, `/dpa`, `/privacy`, `/security`) stay English-only by decision. Docs, Guides, Blog, `/app`, `/duel` stay English-only **in body** for now.
- Every locale-aware test stays pure (Vitest `environment: 'node'`); no DOM in unit tests.
- Estonian copy is written to the register in `web/DESIGN.md` and the glossary in `platform/docs/i18n/glossary.md`; flag anything needing native review in the commit body.

---

## File Structure

| File | Responsibility |
| --- | --- |
| `src/seo/locales.ts` | Isomorphic, dependency-free. Adds `isSiteLocale`, `resolveSiteLocale` (pure decision: content locale, chrome locale, source, suggested twin). |
| `src/seo/locales.test.ts` | Pins `resolveSiteLocale`. |
| `src/ui/platform/i18n/locale.ts` | Already owns `readStoredLocale`/`writeStoredLocale` under the key `locale`. **Reused, not duplicated**: one preference for console and site. |
| `src/ui/shared/i18n/SiteLocaleProvider.tsx` | Resolves locale from URL + storage, activates the catalog for the **chrome** locale, remembers `/et` visits, exposes `useSiteLocale()` with `remember()`. |
| `src/ui/shared/useLocaleHref.ts` | Reads chrome locale from context instead of the URL. |
| `src/ui/shared/LanguageLink.tsx` + `.test.ts` | Pure `languageSwitch(resolved)` decision; renders a link where the twin exists, a button that remembers otherwise. |
| `src/ui/shared/LocaleNotices.tsx` (new) | `EnglishOnlyNotice` (chrome ≠ content) and `LocaleSuggestion` (English URL with twin, reader remembered Estonian). |
| `src/ui/shared/SiteHeader.tsx` | Reads `useSiteLocale()`; `SiteNavLinks` translated and carries the switch; renders the notices. |
| `src/main.tsx` | `/app` and `/app/roster` mount `SiteLocaleProvider`. |
| `src/ui/sim/SimulationChoice.tsx`, `src/ui/sim/SimShell.tsx` | Chrome translated, wordmark keeps locale. |
| `lingui.config.ts`, `eslint.config.mjs` | Add `src/ui/sim` to the site catalog; add the newly translated files to the `no-unlocalized-strings` file list. |
| `scripts/prerender.mjs` | Clears storage before every route so a preference can never leak into a snapshot. |
| `scripts/audit-i18n-seo.mjs` | Check 11: English-only pages prerender English chrome and still carry a switch. |
| `src/ui/pricing/PricingPage.tsx`, `pricingFaq.ts` | Translated (task 7). |
| `src/ui/marketing/SolutionsPage.tsx` | Translated (task 8). |
| `src/seo/routes.json` | `i18n.et` for `/solutions`; `faq` mirrors for `/pricing` and `/solutions`. |
| `e2e/tests/public/locale-journey.spec.ts` (new, in `example/e2e`) | The click-through from the bug report. |

---

### Task 1: Pure locale resolution

**Files:**
- Modify: `src/seo/locales.ts`
- Test: `src/seo/locales.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export type SiteLocaleSource = 'url' | 'stored' | 'default';
  export interface ResolvedSiteLocale {
      content: SiteLocale;   // what the body is in — always the URL's answer
      chrome: SiteLocale;    // what header/footer/switch/notices render in
      source: SiteLocaleSource;
      path: string;          // locale-stripped, no trailing slash
      suggested: SiteLocale | null; // a twin the reader remembered but is not on
  }
  export function isSiteLocale(v: unknown): v is SiteLocale;
  export function resolveSiteLocale(pathname: string, stored: string | null | undefined): ResolvedSiteLocale;
  ```

- [ ] **Step 1: Write the failing tests**

Append to `src/seo/locales.test.ts`:

```ts
import { resolveSiteLocale } from './locales';

describe('resolveSiteLocale', () => {
    it('the URL wins: an /et URL is Estonian in body and chrome whatever is stored', () => {
        expect(resolveSiteLocale('/et/pricing/', 'en')).toEqual({
            content: 'et', chrome: 'et', source: 'url', path: '/pricing', suggested: null,
        });
    });

    it('an English URL with an Estonian twin stays English and only SUGGESTS the twin', () => {
        // Never switch a page in place when the other language has its own URL:
        // the crawler-visible page must read the same for everyone.
        expect(resolveSiteLocale('/pricing/', 'et')).toEqual({
            content: 'en', chrome: 'en', source: 'url', path: '/pricing', suggested: 'et',
        });
        expect(resolveSiteLocale('/', 'et').suggested).toBe('et');
        expect(resolveSiteLocale('/pricing/', null).suggested).toBeNull();
    });

    it('a page with no Estonian URL renders its chrome in the remembered language', () => {
        expect(resolveSiteLocale('/docs/', 'et')).toEqual({
            content: 'en', chrome: 'et', source: 'stored', path: '/docs', suggested: null,
        });
        expect(resolveSiteLocale('/app', 'et').chrome).toBe('et');
        expect(resolveSiteLocale('/solutions/', 'et').chrome).toBe('et');
    });

    it('no preference, or a garbage one, is plain English', () => {
        expect(resolveSiteLocale('/docs/', null)).toMatchObject({ chrome: 'en', source: 'default' });
        expect(resolveSiteLocale('/docs/', 'fr')).toMatchObject({ chrome: 'en', source: 'default' });
        expect(resolveSiteLocale('/docs/', 'en')).toMatchObject({ chrome: 'en', source: 'default' });
    });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `cd example/web && npx vitest run src/seo/locales.test.ts`
Expected: FAIL — `resolveSiteLocale` is not exported.

- [ ] **Step 3: Implement**

Append to `src/seo/locales.ts` (below `hasTranslation`):

```ts
export function isSiteLocale(v: unknown): v is SiteLocale {
    return typeof v === 'string' && (SITE_LOCALES as readonly string[]).includes(v);
}

export type SiteLocaleSource = 'url' | 'stored' | 'default';

export interface ResolvedSiteLocale {
    /** The language the body is in. Always what the URL says. */
    content: SiteLocale;
    /** The language the chrome — header, footer, switch, notices — renders in. */
    chrome: SiteLocale;
    source: SiteLocaleSource;
    /** Locale-stripped path, no trailing slash. */
    path: string;
    /** A twin of this page the reader has remembered but is not on. */
    suggested: SiteLocale | null;
}

/**
 * Which language the page and its chrome render in, given the URL and the
 * browser's remembered choice.
 *
 * Three rules, in order, and the order is the design:
 *
 * 1. The URL wins. `/et/...` is Estonian, body and chrome, whatever is stored.
 *    This is what keeps a prerendered page correct before any script runs.
 * 2. An English URL whose Estonian twin exists stays English. It is a
 *    crawler-visible page and has to read the same for every visitor; the
 *    reader who remembered Estonian is *offered* the twin (`suggested`) and
 *    never switched in place. That is also Google's own guidance: suggest, do
 *    not redirect.
 * 3. A page with no Estonian URL at all (docs, guides, blog, the simulator,
 *    the legal pages) renders its chrome in the remembered language, body in
 *    English. Without this, every one of those pages threw an Estonian reader
 *    back into English chrome with no switch and no way home.
 *
 * `content` therefore never comes from storage, and `<html lang>` — which the
 * prerenderer waits on — must always be set from `content`, never `chrome`.
 */
export function resolveSiteLocale(pathname: string, stored: string | null | undefined): ResolvedSiteLocale {
    const { locale, path } = stripLocale(pathname);
    const remembered = isSiteLocale(stored) && stored !== DEFAULT_LOCALE ? stored : null;

    if (locale !== DEFAULT_LOCALE) {
        return { content: locale, chrome: locale, source: 'url', path, suggested: null };
    }
    if (hasTranslation(path)) {
        return { content: DEFAULT_LOCALE, chrome: DEFAULT_LOCALE, source: 'url', path, suggested: remembered };
    }
    if (remembered) {
        return { content: DEFAULT_LOCALE, chrome: remembered, source: 'stored', path, suggested: null };
    }
    return { content: DEFAULT_LOCALE, chrome: DEFAULT_LOCALE, source: 'default', path, suggested: null };
}
```

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/seo/locales.test.ts`
Expected: PASS (existing 22 + 4 new).

- [ ] **Step 5: Commit**

```bash
git add src/seo/locales.ts src/seo/locales.test.ts
git commit -m "feat(i18n): resolve a chrome locale for pages with no Estonian URL"
```

---

### Task 2: Provider remembers the choice and exposes it

**Files:**
- Modify: `src/ui/shared/i18n/SiteLocaleProvider.tsx`
- Modify: `src/ui/shared/useLocaleHref.ts`
- Modify: `src/ui/platform/i18n/locale.ts` (doc comment only)

**Interfaces:**
- Consumes: `resolveSiteLocale`, `readStoredLocale`/`writeStoredLocale` (`src/ui/platform/i18n/locale.ts`, key `locale`).
- Produces:
  ```ts
  export interface SiteLocaleContextValue extends ResolvedSiteLocale {
      /** Store a choice and re-render the chrome in it, without a navigation. */
      remember(locale: SiteLocale): void;
  }
  export function useSiteLocale(): SiteLocaleContextValue; // throws outside the provider
  ```

Decision recorded here: the site shares the console's `locale` storage key. One person, one preference; choosing Estonian on the site means the console opens in Estonian and vice versa. The console's own resolution (`account > stored > navigator`) is untouched.

- [ ] **Step 1: Rewrite the provider**

Replace `src/ui/shared/i18n/SiteLocaleProvider.tsx` with:

```tsx
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { DEFAULT_LOCALE, resolveSiteLocale, type ResolvedSiteLocale, type SiteLocale } from '../../../seo/locales';
import { readStoredLocale, writeStoredLocale } from '../../platform/i18n/locale';

/**
 * The marketing side's catalog activation.
 *
 * The locale of the *body* is the URL and nothing else (`resolveSiteLocale`,
 * rule 1 and 2) — a prerendered page has to be correct before any script runs.
 * What this provider adds is the *chrome* locale for pages that have no
 * Estonian URL: docs, guides, blog, the simulator, the legal pages. There the
 * header, footer, switch and notices render in the language the browser
 * remembers, the body stays English, and `remember()` lets the switch change
 * that in place, because there is no other URL to navigate to.
 *
 * Storage is the console's own `locale` key (`platform/i18n/locale.ts`): one
 * preference per person, not one per surface.
 *
 * Loaded from `src/locales/site/{locale}/messages.po` — the marketing-only
 * catalog — never the console's.
 */
async function activate(locale: SiteLocale): Promise<void> {
    const { messages } = await import(`../../../locales/site/${locale}/messages.po`);
    i18n.load(locale, messages);
    i18n.activate(locale);
}

export interface SiteLocaleContextValue extends ResolvedSiteLocale {
    remember(locale: SiteLocale): void;
}

const SiteLocaleContext = createContext<SiteLocaleContextValue | null>(null);

export function useSiteLocale(): SiteLocaleContextValue {
    const value = useContext(SiteLocaleContext);
    if (!value) throw new Error('useSiteLocale() must render inside <SiteLocaleProvider> (see main.tsx needsSiteLocale)');
    return value;
}

export function SiteLocaleProvider({ children }: { children: React.ReactNode }) {
    const [resolved, setResolved] = useState<ResolvedSiteLocale>(() =>
        resolveSiteLocale(window.location.pathname, readStoredLocale()),
    );
    const [ready, setReady] = useState(false);

    // `<html lang>` is the CONTENT locale, never the chrome one: the prerenderer
    // waits on it, assistive tech reads the body by it, and the body is what the
    // URL says it is.
    useEffect(() => {
        document.documentElement.lang = resolved.content;
    }, [resolved.content]);

    // Arriving on an /et URL is itself a choice worth keeping, so a reader who
    // came from a search result and then clicks Docs still gets Estonian chrome.
    useEffect(() => {
        if (resolved.source === 'url' && resolved.content !== DEFAULT_LOCALE) writeStoredLocale(resolved.content);
    }, [resolved.source, resolved.content]);

    useEffect(() => {
        let cancelled = false;
        void activate(resolved.chrome).then(() => {
            if (!cancelled) setReady(true);
        });
        return () => {
            cancelled = true;
        };
    }, [resolved.chrome]);

    const remember = useCallback((next: SiteLocale) => {
        writeStoredLocale(next);
        setResolved(resolveSiteLocale(window.location.pathname, next));
    }, []);

    // Nothing correct to render before the first catalog loads. A later
    // `remember()` keeps the tree mounted and re-renders under the new catalog
    // once it is active — the same "stay mounted through a switch" rule the
    // console's LocaleProvider carries.
    if (!ready) return null;

    return (
        <SiteLocaleContext.Provider value={{ ...resolved, remember }}>
            <I18nProvider i18n={i18n}>{children}</I18nProvider>
        </SiteLocaleContext.Provider>
    );
}
```

- [ ] **Step 2: `useLocaleHref` reads the chrome locale**

Replace the body of `src/ui/shared/useLocaleHref.ts`:

```ts
import { localeHref } from '../../seo/locales';
import { useSiteLocale } from './i18n/SiteLocaleProvider';

/**
 * The href-builder every internal link in the site chrome and the landing page
 * goes through, so a reader who chose Estonian stays in Estonian.
 *
 * Reads the CHROME locale: on `/et/...` that is the URL's locale; on a page with
 * no Estonian URL (docs, the simulator) it is the remembered one, which is what
 * makes "Hinnad" in the docs header land on `/et/pricing/` rather than dropping
 * the reader back into English. `localeHref` still no-ops on anything with no
 * Estonian URL of its own, on anchors, absolute URLs and `mailto:`.
 */
export function useLocaleHref(): (path: string) => string {
    const { chrome } = useSiteLocale();
    return (path: string) => localeHref(path, chrome);
}
```

- [ ] **Step 3: Note the shared key**

In `src/ui/platform/i18n/locale.ts`, above `LOCALE_STORAGE_KEY`, add:

```ts
/** Shared with the public site's `SiteLocaleProvider`: one remembered language
 *  per browser, whichever surface it was chosen on. Renaming this key logs
 *  every reader out of their language on both. */
```

- [ ] **Step 4: Type-check and run the existing suites**

Run: `npx tsc -b && npx vitest run src/seo src/ui/shared`
Expected: PASS. (`LanguageLink.test.ts` still passes — it is rewritten in Task 3.)

- [ ] **Step 5: Commit**

```bash
git add src/ui/shared/i18n/SiteLocaleProvider.tsx src/ui/shared/useLocaleHref.ts src/ui/platform/i18n/locale.ts
git commit -m "feat(i18n): remember the reader's language for pages with no Estonian URL"
```

---

### Task 3: The switch is always there

**Files:**
- Modify: `src/ui/shared/LanguageLink.tsx`
- Test: `src/ui/shared/LanguageLink.test.ts`

**Interfaces:**
- Consumes: `ResolvedSiteLocale`, `useSiteLocale().remember`.
- Produces:
  ```ts
  export type LanguageSwitch =
      | { kind: 'link'; href: string; locale: SiteLocale; name: string; code: string }
      | { kind: 'remember'; locale: SiteLocale; name: string; code: string };
  export function languageSwitch(resolved: ResolvedSiteLocale): LanguageSwitch;
  ```
  `languageAlternate(pathname)` is removed; its callers are only the tests.

- [ ] **Step 1: Rewrite the tests**

Replace `src/ui/shared/LanguageLink.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { TRANSLATED_PATHS, resolveSiteLocale, stripLocale } from '../../seo/locales';
import { languageSwitch } from './LanguageLink';

const at = (pathname: string, stored: string | null = null) => languageSwitch(resolveSiteLocale(pathname, stored));

describe('languageSwitch', () => {
    it('links to the twin from every Estonian page that exists', () => {
        expect(at('/et/pricing/')).toEqual({ kind: 'link', href: '/pricing/', locale: 'en', name: 'English', code: 'EN' });
        expect(at('/et')).toMatchObject({ kind: 'link', href: '/' });
    });

    it('links to Estonian from the English twin', () => {
        expect(at('/pricing/')).toEqual({ kind: 'link', href: '/et/pricing/', locale: 'et', name: 'Eesti', code: 'ET' });
    });

    it('round-trips every translated route', () => {
        for (const path of TRANSLATED_PATHS) {
            const there = at(path);
            expect(there.kind).toBe('link');
            if (there.kind !== 'link') continue;
            const back = at(there.href);
            expect(back.kind).toBe('link');
            if (back.kind === 'link') expect(stripLocale(back.href).path).toBe(path);
        }
    });

    it('NEVER disappears: a page with no Estonian URL offers to remember the other language', () => {
        // This is the bug report: on docs, guides, blog and the simulator the
        // icon vanished and an Estonian reader had no way to be Estonian again.
        expect(at('/docs/')).toEqual({ kind: 'remember', locale: 'et', name: 'Eesti', code: 'ET' });
        expect(at('/docs/', 'et')).toEqual({ kind: 'remember', locale: 'en', name: 'English', code: 'EN' });
        expect(at('/app', 'et').kind).toBe('remember');
        expect(at('/terms/').kind).toBe('remember');
    });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run src/ui/shared/LanguageLink.test.ts`
Expected: FAIL — `languageSwitch` not exported.

- [ ] **Step 3: Implement**

In `src/ui/shared/LanguageLink.tsx`, replace everything from `export interface LanguageAlternate` to the end of `languageAlternate` with:

```ts
export type LanguageSwitch =
    | { kind: 'link'; href: string; locale: SiteLocale; name: string; code: string }
    | { kind: 'remember'; locale: SiteLocale; name: string; code: string };

/**
 * What the switch offers, as a pure function of the resolved locale.
 *
 * Where the other language has its own URL the switch is a real link — a
 * crawler must see the alternate as a followable href, which is what makes it
 * agree with the `hreflang` annotations. Where it does not (docs, guides, blog,
 * the simulator, legal), it is an in-place choice: remember the language and
 * re-render the chrome. It is never absent. The version that returned `null`
 * stranded a reader on the first English-only page they reached.
 */
export function languageSwitch(resolved: ResolvedSiteLocale): LanguageSwitch {
    const other = SITE_LOCALES.find((l) => l !== resolved.chrome) ?? DEFAULT_LOCALE;
    const name = LOCALE_NAMES[other];
    const code = LOCALE_CODES[other];
    if (hasTranslation(resolved.path)) {
        const href = localizedPath(resolved.path, other);
        // Trailing slash: every route is a real directory in the static build.
        return { kind: 'link', href: href === '/' ? '/' : `${href}/`, locale: other, name, code };
    }
    return { kind: 'remember', locale: other, name, code };
}
```

Update the import line to `import { DEFAULT_LOCALE, SITE_LOCALES, hasTranslation, localizedPath, type ResolvedSiteLocale, type SiteLocale } from '../../seo/locales';` and add `import { useSiteLocale } from './i18n/SiteLocaleProvider';`.

Replace the `LanguageLink` component:

```tsx
export function LanguageLink() {
    const resolved = useSiteLocale();
    const sw = languageSwitch(resolved);
    const Flag = LOCALE_FLAG[sw.locale];
    const body = (
        <>
            <Flag title={sw.name} className="landing-lang-flag" />
            <span className="landing-lang-code" aria-hidden="true">
                {sw.code}
            </span>
        </>
    );
    if (sw.kind === 'link') {
        return (
            <a
                className="landing-lang-link"
                href={sw.href}
                lang={sw.locale}
                hrefLang={sw.locale}
                aria-label={sw.name}
                title={sw.name}
                // The twin page remembers an /et arrival by itself; this is for the
                // other direction, so choosing English from /et/pricing/ sticks.
                onClick={() => resolved.remember(sw.locale)}
            >
                {body}
            </a>
        );
    }
    return (
        <button
            type="button"
            className="landing-lang-link"
            lang={sw.locale}
            aria-label={sw.name}
            title={sw.name}
            onClick={() => resolved.remember(sw.locale)}
        >
            {body}
        </button>
    );
}
```

In `src/ui/landing/record.css` and `src/ui/landing/landing.css`, extend the `.landing-lang-link` rule so a `<button>` paints like the `<a>`: add `background: none; border: 0; font: inherit; color: inherit; cursor: pointer;` to the existing selector block.

- [ ] **Step 4: Run tests and lint**

Run: `npx vitest run src/ui/shared/LanguageLink.test.ts && npx eslint src/ui/shared`
Expected: PASS, 0 errors.

- [ ] **Step 5: Commit**

```bash
git add src/ui/shared/LanguageLink.tsx src/ui/shared/LanguageLink.test.ts src/ui/landing/record.css src/ui/landing/landing.css
git commit -m "fix(i18n): keep the language switch on every public page"
```

(If `record.css` also carries the concurrent session's `--warn-ink` hunk, stage a blob with only the `.landing-lang-link` change.)

---

### Task 4: Header reads the chrome locale; notices

**Files:**
- Create: `src/ui/shared/LocaleNotices.tsx`
- Modify: `src/ui/shared/SiteHeader.tsx`
- Modify: `src/ui/landing/record.css` (notice styles)

**Interfaces:**
- Consumes: `useSiteLocale()`, `languageSwitch`.
- Produces: `EnglishOnlyNotice`, `LocaleSuggestion` components (no props), rendered by `SiteHeader` directly under the bar so every page gets them.

- [ ] **Step 1: Notices**

Create `src/ui/shared/LocaleNotices.tsx`:

```tsx
import { Trans } from '@lingui/react/macro';
import { localizedPath } from '../../seo/locales';
import { useSiteLocale } from './i18n/SiteLocaleProvider';

/**
 * Shown when the chrome is in a language the body is not — a reader who chose
 * Estonian and opened the docs. One honest line, in their language, so the
 * English below reads as a limitation rather than as being thrown out.
 */
export function EnglishOnlyNotice() {
    const { chrome, content } = useSiteLocale();
    if (chrome === content) return null;
    return (
        <p className="site-locale-notice" lang={chrome} role="status">
            <Trans>This page is available in English only.</Trans>
        </p>
    );
}

/**
 * Shown on an English URL whose Estonian twin the reader has remembered — the
 * search-result arrival. Offered, never redirected: the page itself has to read
 * the same for every visitor and every crawler.
 */
export function LocaleSuggestion() {
    const { suggested, path } = useSiteLocale();
    if (!suggested) return null;
    const href = localizedPath(path, suggested);
    return (
        <p className="site-locale-notice" lang={suggested} role="status">
            {/* eslint-disable-next-line lingui/no-unlocalized-strings -- always in the offered language, never the active one */}
            <a href={href === '/' ? '/' : `${href}/`} hrefLang={suggested}>Loe seda lehte eesti keeles →</a>
        </p>
    );
}
```

(The suggestion string is hard-coded Estonian because there is exactly one non-default locale; when a third arrives it becomes a `Record<SiteLocale, string>` like `LOCALE_NAMES`.)

Add to `src/ui/landing/record.css`, next to `.landing-lang-link`:

```css
.site-locale-notice {
    margin: 0;
    padding: 8px var(--gutter, 24px);
    font-size: 13px;
    color: var(--ink-2);
    background: var(--band);
    border-bottom: 1px solid var(--rule);
    text-align: center;
}
```

- [ ] **Step 2: Header**

In `src/ui/shared/SiteHeader.tsx`:

1. Add `import { useSiteLocale } from './i18n/SiteLocaleProvider';` and `import { EnglishOnlyNotice, LocaleSuggestion } from './LocaleNotices';`.
2. In `SiteHeader`, replace `const { locale } = stripLocale(path);` with `const { chrome: locale, content } = useSiteLocale();`.
3. On the root `<header>` element add `lang={locale !== content ? locale : undefined}` so assistive tech reads Estonian chrome as Estonian while `<html lang>` stays `en`.
4. Render `<LocaleSuggestion />` and `<EnglishOnlyNotice />` immediately after the closing tag of the header bar, inside the component's fragment.
5. `SiteNavLinks`: replace the plain `l.label` with the same `navLabel` lookup `SiteHeader` uses (`const { i18n } = useLingui();` + `NAV_LABEL`), rebuild each href with `resolveHref(l.href, path, locale)` where `locale` comes from `useSiteLocale()`, append `<LanguageLink />` before the GitHub button, and wrap `Open console` / `Start free` in `<Trans>`. Delete the three `eslint-disable-line … no I18nProvider there` comments and the `NAV_LABEL` docblock paragraph that explains them; `siteHeaderLinks.ts` keeps its disables (it stays data).

- [ ] **Step 3: Extract and translate**

Run: `npx lingui extract`
Expected: the site catalogs gain `This page is available in English only.`, `Open console`, `Start free`. Fill `src/locales/site/et/messages.po`:

| English | Estonian |
| --- | --- |
| This page is available in English only. | See leht on saadaval ainult inglise keeles. |
| Open console | Ava konsool |
| Start free | Alusta tasuta |

(Check the catalog first: the concurrent session may have `Alusta tasuta` already for the homepage CTA; reuse the exact string.)

- [ ] **Step 4: Verify**

Run: `npx tsc -b && npx eslint src/ui/shared && npx vitest run src/ui/shared src/seo`
Expected: PASS, 0 errors.

Then in the dev server (`node node_modules/vite/bin/vite.js`, port 5173), with Playwright or by hand:
- `/` → click ET → `/et/` → click Docs → `/docs/`: header labels Estonian (`Hinnad`, `Demo`), switch shows GB/EN, notice "See leht on saadaval ainult inglise keeles.", `document.documentElement.lang === 'en'`.
- On `/docs/` click the switch → same URL, chrome flips to English, notice gone, `localStorage.locale === 'en'`.
- `/pricing/` with `localStorage.locale = 'et'` → English page, banner link to `/et/pricing/`.

- [ ] **Step 5: Commit**

```bash
git add src/ui/shared/LocaleNotices.tsx src/ui/shared/SiteHeader.tsx src/ui/landing/record.css \
        src/locales/site/en/messages.po src/locales/site/et/messages.po
git commit -m "feat(i18n): Estonian chrome on English-only pages, with an honest notice"
```

(Stage catalog blobs containing only these three entries if the working copies carry unrelated in-flight translations.)

---

### Task 5: The simulator joins the site

**Files:**
- Modify: `src/main.tsx` (`needsSiteLocale`)
- Modify: `src/ui/sim/SimulationChoice.tsx`, `src/ui/sim/SimShell.tsx`, `src/ui/sim/components/GetStarted.tsx`
- Modify: `lingui.config.ts`, `eslint.config.mjs`
- Modify: `src/locales/site/{en,et}/messages.po`

Scope decision, stated so nobody widens it silently: the **chooser** (`/app`), the shell's **topbar, drawer, and "back to site" affordance**, and `GetStarted` are translated. The dashboard body (`App.tsx`, `RosterApp.tsx` and everything under `sim/` they render) stays English and is covered by `EnglishOnlyNotice`. Full simulator translation is its own project.

- [ ] **Step 1: Mount the provider on `/app`**

In `src/main.tsx`, remove `isRosterSim ||` and `isDashboard ||` from `needsSiteLocale`, and rewrite its comment:

```ts
// Every page that renders the site chrome — the real SiteHeader or the
// simulator's SiteNavLinks — needs the site catalog active: nav labels, the
// language switch and the locale notices all go through it. That is every
// marketing/docs/trust page AND the two simulator worlds; only the console,
// the auth pages (own catalog) and the unlisted admin/stats surfaces stay out.
```

- [ ] **Step 2: Include `src/ui/sim` in the site catalog**

`lingui.config.ts`, second catalog: add `'src/ui/sim'` to `include`. Update the docblock: `/app` is no longer English-only in chrome. (The dashboard's untranslated strings are plain JSX, so extraction picks up nothing from them until somebody wraps them.)

`eslint.config.mjs`: add `src/ui/sim/SimulationChoice.tsx` and `src/ui/sim/components/GetStarted.tsx` to the explicit `no-unlocalized-strings` file list. Not `SimShell.tsx` — it carries dashboard strings; wrap its chrome strings by hand.

- [ ] **Step 3: Chooser and shell**

`SimulationChoice.tsx`: wrap the heading, intro and each option's name/description in `<Trans>` (if the options come from a data array, convert labels to `msg\`…\`` descriptors and render via `i18n._`). Wordmark: `const href = useLocaleHref(); <a href={href('/')} …>`. "Skip to content" → `<Trans>Skip to content</Trans>`.

`SimShell.tsx`: wordmark/back link → `href('/')`; topbar and drawer chrome strings (the nav's `aria-label`, "Menu", "Close", the drawer's section headings) in `<Trans>`/`t`; render `<EnglishOnlyNotice />` under the topbar. Leave every dashboard control alone.

`GetStarted.tsx`: `href="/support"` → `href={href('/support')}`; its copy in `<Trans>`.

- [ ] **Step 4: Extract, translate, verify**

Run: `npx lingui extract` then fill the Estonian entries (glossary register: short, imperative, no loan words where a plain word exists; keep `Demo`, `Docs`, `ROI` as decided for the nav). Then:

Run: `npx tsc -b && npx eslint src && npx vitest run`
Expected: PASS.

Browser: `/et/` → click `Demo` → `/app`: Estonian topbar (`Hinnad`, `Dokumendid` …), switch present, notice present, wordmark → `/et`. Pick a simulation → dashboard: same topbar, English body, notice.

- [ ] **Step 5: Commit**

```bash
git add src/main.tsx lingui.config.ts eslint.config.mjs \
        src/ui/sim/SimulationChoice.tsx src/ui/sim/SimShell.tsx src/ui/sim/components/GetStarted.tsx \
        src/locales/site/en/messages.po src/locales/site/et/messages.po
git commit -m "feat(i18n): give the simulator the site's chrome, language switch and way home"
```

---

### Task 6: Prerender isolation and the audit

**Files:**
- Modify: `scripts/prerender.mjs`
- Modify: `scripts/audit-i18n-seo.mjs`

Why this task exists: `prerender.mjs` opens **one page** and walks every route through it (`for (const { route, locale } of localeRoutes())` after a single `context.newPage()`). After Task 2 a visit to `/et/` writes `locale=et`, so every English-only route rendered afterwards would snapshot Estonian chrome. That is exactly the leak the global constraint forbids.

- [ ] **Step 1: Clear storage before every route**

In `scripts/prerender.mjs`, right after `const context = await browser.newContext({ … });` add:

```js
// The site remembers a language in localStorage (SiteLocaleProvider). One page
// context serves every route here, so without this an /et/ visit would leak
// Estonian chrome into the English-only snapshots that follow it. Every
// snapshot must be what a first-time visitor with no preference sees.
await context.addInitScript(() => {
    try {
        localStorage.removeItem('locale');
    } catch {
        /* storage blocked: nothing to leak */
    }
});
```

- [ ] **Step 2: Audit check 11**

Append to `scripts/audit-i18n-seo.mjs`, after check 10:

```js
check('11. English-only pages prerender English chrome, no notice, and still carry a language switch', (fail) => {
    for (const page of pages) {
        if (page.i18n?.et) continue; // has a twin: covered by 1–10
        const html = read(page.path, 'en');
        if (!html) continue;
        if (/Hinnad|Dokumendid|Võimalused/.test(html)) fail(`${page.path}: Estonian chrome leaked into the English snapshot`);
        if (html.includes('site-locale-notice')) fail(`${page.path}: a locale notice was prerendered`);
        if (!/class="landing-lang-link"/.test(html)) fail(`${page.path}: no language switch in the header`);
        if (!/<html[^>]*\slang="en"/.test(html)) fail(`${page.path}: <html lang> is not en`);
    }
});
```

(Adapt `pages`/`read` to the helpers the script already defines for checks 8 and 9.)

- [ ] **Step 3: Build on the complete tree and audit**

Run: `pnpm build && node scripts/audit-i18n-seo.mjs`
Expected: check 11 passes; checks 1–10 unchanged (any pre-existing failures belong to the concurrent session's FAQ drift and must be reported, not fixed here). Prerender may time out on random routes; retry once.

- [ ] **Step 4: Commit**

```bash
git add scripts/prerender.mjs scripts/audit-i18n-seo.mjs
git commit -m "test(seo): keep a remembered language out of prerendered snapshots"
```

---

### Task 7: Translate `/pricing`

**Files:**
- Modify: `src/ui/pricing/PricingPage.tsx` (679 lines, zero `<Trans>` today), `src/ui/pricing/pricingFaq.ts`
- Modify: `src/seo/routes.json` (`/pricing` → `i18n.et.faq`), `src/seo/locales.ts` (`TRANSLATED_COPY_PATHS`), `eslint.config.mjs`
- Modify: `src/locales/site/{en,et}/messages.po`
- Test: `src/ui/pricing/pricingFaq.test.ts` (new; mirrors `landing/firstCall.test.ts`)

Before starting: `grep -c "src/ui/pricing" src/locales/site/et/messages.po` is 0 and `git status` shows no in-flight change to `PricingPage.tsx`. If either changes, coordinate rather than duplicate.

- [ ] **Step 1: Failing parity test**

Create `src/ui/pricing/pricingFaq.test.ts`, copying the `parsePo` helper and the "every FAQ question and answer has a non-empty Estonian entry keyed by `.message`" assertion from `src/ui/landing/firstCall.test.ts`, pointed at `PRICING_FAQ` (or whatever `pricingFaq.ts` exports) and additionally asserting that `routes.json` `pages['/pricing'].i18n.et.faq` equals the Estonian rendering, entry for entry.

Run: `npx vitest run src/ui/pricing`
Expected: FAIL — no Estonian entries.

- [ ] **Step 2: Wrap the copy**

Convert `pricingFaq.ts` to `MessageDescriptor` pairs (`msg\`…\``) exactly as `firstCall.ts` does. In `PricingPage.tsx` wrap every headline, tier name, feature bullet, footnote, CTA and the FAQ rendering in `<Trans>` / `t` / `<Plural>`; code samples and prices stay literal (`eslint-disable-line` with a reason, as `QuickstartPanel.tsx` does). Hrefs go through `useLocaleHref()`. Add `src/ui/pricing/PricingPage.tsx` and `pricingFaq.ts` to the eslint file list.

- [ ] **Step 3: Extract and translate**

Run: `npx lingui extract`; fill Estonian for every `src/ui/pricing` entry. Mirror the FAQ into `routes.json` `/pricing` → `i18n.et.faq` and translate `i18n.et.title` / `description` if still English (≤160 chars, audit check 7).

- [ ] **Step 4: Announce**

`src/seo/locales.ts`: `TRANSLATED_COPY_PATHS = ['/', '/pricing']` (plus `'/features'` only if the concurrent session has landed it — do not add on their behalf).

- [ ] **Step 5: Verify**

Run: `npx vitest run && npx eslint src && pnpm build && node scripts/audit-i18n-seo.mjs`
Expected: parity test passes; audit checks 1, 4, 6, 10 now cover `/et/pricing` and pass. Browser `/et/pricing/`: no English headings.

- [ ] **Step 6: Commit**

```bash
git add src/ui/pricing/PricingPage.tsx src/ui/pricing/pricingFaq.ts src/ui/pricing/pricingFaq.test.ts \
        src/seo/routes.json src/seo/locales.ts eslint.config.mjs \
        src/locales/site/en/messages.po src/locales/site/et/messages.po
git commit -m "feat(seo): translate /pricing into Estonian and announce it"
```

(`routes.json`, both catalogs and `eslint.config.mjs` are shared with the concurrent session — stage blobs holding only the pricing hunks.)

---

### Task 8: Translate `/solutions` and give it an Estonian URL

**Files:**
- Modify: `src/ui/marketing/SolutionsPage.tsx` (238 lines, zero `<Trans>`)
- Modify: `src/seo/routes.json` (`/solutions` gains `i18n.et` with `title`, `description`, `faq` if the page has one), `src/seo/locales.ts` (`TRANSLATED_PATHS` + `TRANSLATED_COPY_PATHS`), `eslint.config.mjs`
- Modify: catalogs

This is the route named in the bug report ("features to solutions"). Once it has a twin, `localeHref` keeps the reader on `/et/solutions/`, and the header's eight items are all either twinned (Features, Solutions, ROI, Pricing) or declared English-only surfaces with Estonian chrome (Demo, Docs, Guides, Blog).

- [ ] **Step 1: Route first**

Add the `i18n.et` block to `routes.json` for `/solutions` and `'/solutions'` to `TRANSLATED_PATHS` (keep the array sorted as it is). Run `npx vitest run src/seo` — the deep-equal test between the list and `routes.json` must pass. `generate-route-entries.mjs` derives the `/et/solutions` entry from this; nothing in `main.tsx` changes (it already strips the prefix).

- [ ] **Step 2: Wrap, extract, translate**

Same procedure as Task 7 step 2–3 on `SolutionsPage.tsx`. Add it to the eslint file list. Then `TRANSLATED_COPY_PATHS` gains `'/solutions'` in this same commit.

- [ ] **Step 3: Verify**

Run: `npx vitest run && npx eslint src && pnpm build && node scripts/audit-i18n-seo.mjs`
Expected: all pass; `dist/et/solutions/index.html` exists (check 9) and is Estonian (check 4).

- [ ] **Step 4: Commit**

```bash
git add src/ui/marketing/SolutionsPage.tsx src/seo/routes.json src/seo/locales.ts eslint.config.mjs \
        src/locales/site/en/messages.po src/locales/site/et/messages.po
git commit -m "feat(seo): translate /solutions into Estonian and announce it"
```

---

### Task 9: The journey test, full verification, submodule bump

**Files:**
- Create: `example/e2e/tests/public/locale-journey.spec.ts`
- Modify (parent repo): submodule pointer `example`

- [ ] **Step 1: Write the journey the bug report describes**

```ts
import { expect, test } from '@playwright/test';

// The four complaints from the 2026-09-10 report, as one walk. Each step asserts
// the thing that was broken: the language survives navigation, the switch is
// always visible, the simulator and the docs keep the reader's chrome and offer
// a way home, and pricing reads in Estonian.
test('choosing Estonian sticks across every kind of page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Eesti' }).click();
    await expect(page).toHaveURL(/\/et\/?$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'et');

    await page.getByRole('link', { name: 'Võimalused' }).click();
    await expect(page).toHaveURL(/\/et\/features\/?$/);

    await page.getByRole('link', { name: 'Lahendused' }).click(); // (a) features → solutions
    await expect(page).toHaveURL(/\/et\/solutions\/?$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'et');

    await page.getByRole('link', { name: 'Docs' }).click(); // (c) docs: chrome stays, switch stays
    await expect(page).toHaveURL(/\/docs\/?$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('link', { name: 'Hinnad' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'English' })).toBeVisible();
    await expect(page.getByRole('status')).toContainText('ainult inglise keeles');

    await page.getByRole('link', { name: 'Demo' }).click(); // (b) simulator: same chrome, way home
    await expect(page).toHaveURL(/\/app$/);
    await expect(page.getByRole('link', { name: 'Hinnad' })).toBeVisible();
    await page.getByRole('link', { name: /Fivexer/ }).first().click();
    await expect(page).toHaveURL(/\/et\/?$/);

    await page.getByRole('link', { name: 'Hinnad' }).click(); // (d) pricing in Estonian
    await expect(page).toHaveURL(/\/et\/pricing\/?$/);
    await expect(page.getByRole('heading', { level: 1 })).not.toContainText(/pricing/i);

    await page.getByRole('link', { name: 'English' }).click(); // and the way back
    await expect(page).toHaveURL(/\/pricing\/?$/);
    await page.getByRole('link', { name: 'Docs' }).click();
    await expect(page.getByRole('link', { name: 'Pricing' })).toBeVisible(); // stored 'en' honoured
});

test('a remembered language never redirects an English URL', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('locale', 'et'));
    await page.goto('/pricing/');
    await expect(page).toHaveURL(/\/pricing\/?$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('link', { name: /eesti keeles/ })).toHaveAttribute('href', '/et/pricing/');
});
```

Run per `example/e2e` conventions (dev server on 5173 or the built `dist`; demo simulation OFF).
Expected: PASS.

- [ ] **Step 2: Full verification on the complete tree**

```bash
cd example/web && npx tsc -b && npx eslint src && npx vitest run && pnpm build && node scripts/audit-i18n-seo.mjs
```
Expected: all green except failures already attributable to the concurrent session (`coverage.test.ts` console strings, their FAQ drift in `firstCall.test.ts`) — list those verbatim in the report, do not fix them.

- [ ] **Step 3: Commit the spec, bump the submodule, push nothing**

```bash
git add e2e/tests/public/locale-journey.spec.ts
git commit -m "test(e2e): the Estonian reader's journey across twinned and English-only pages"
cd /home/viljar/Projects/fivexer/assignment-engine && git add example && git commit -m "chore: bump example for locale-aware navigation"
```

Do not push. Report the unpushed commits in every repo.

---

## Deferred, deliberately

- **Content filters for docs/guides/blog by language** (the user's "later on"). The hook is already in place: `useSiteLocale().chrome` is the reader's language, and a listing page can filter its items on a `lang` field once content carries one. No task here.
- **Full simulator translation** (dashboard body). Chrome only in Task 5.
- **`/et` URLs for docs, guides, blog, legal.** Not created; chrome persistence covers them and a body-English `/et/docs` would be a duplicate-content risk for nothing.
- **Native-speaker review** of every Estonian string (nav loanwords `Docs`/`Demo`/`ROI`, the pricing and solutions copy, `Lahendused`). Flag in each commit body; see `platform/docs/i18n/glossary.md`.
- **`/features` announcement** belongs to the concurrent session's commit.
