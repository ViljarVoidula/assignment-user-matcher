# Estonian for the public marketing pages, with SEO

Date: 2026-09-10. Status: approved scope, ready to build.

## What the owner decided

- **Scope: core marketing only**, ~12 routes. Docs, the EU cluster and the trust/legal
  pages stay English.
- **URL strategy: subdirectory `/et/`.** English keeps the bare path.

The legal pages are excluded deliberately: `/terms`, `/dpa`, `/privacy` and `/security`
make binding claims, the DPA is an Article 28 agreement, and an Estonian version becomes a
document the company is held to. That needs a lawyer, not a translation pass.

## The routes in scope

`/`, `/pricing`, `/features`, `/features/shift-cover`, `/features/multi-site-scheduling`,
`/workforce-scheduling`, `/support`, `/for/trade-contractors`, `/for/cleaning-companies`,
`/tools/chasing-cost`, `/tools/cost-per-person`, `/tools/toolbox-talks`,
`/tools/cleaning-checklist`.

Final list is whatever carries an `i18n.et` block in `routes.json` — see below. That is the
scope control: a page without one generates no Estonian route, no sitemap entry and no
hreflang, automatically.

## Why this is not the console's problem again

The console is a client-rendered app behind auth where the language is a runtime preference.
These pages are **prerendered static HTML** whose whole job is to be read by a crawler that
runs no JavaScript. So the language has to be decided at *build* time and baked into the
markup, and every SEO signal has to agree with it.

## Architecture

### 1. One source of truth for locales

`src/seo/locales.ts`, dependency-free and isomorphic — `vite.config.ts` and the build
scripts import it, so it must not touch `window`:

```ts
export const SITE_LOCALES = ['en', 'et'] as const;
export type SiteLocale = (typeof SITE_LOCALES)[number];
export const DEFAULT_LOCALE: SiteLocale = 'en';

/** '/pricing' + 'et' -> '/et/pricing'. The default locale keeps the bare path. */
export function localizedPath(path: string, locale: SiteLocale): string;
/** '/et/pricing' -> { locale: 'et', path: '/pricing' }. Unprefixed -> en. */
export function stripLocale(pathname: string): { locale: SiteLocale; path: string };
```

`themeColor.ts` already proves this pattern (imported by `vite.config.ts`, so browser-only
code there breaks the build config itself). Same rule applies.

### 2. Content lives in `routes.json`, per locale

Each page gains an optional block:

```json
{
  "path": "/pricing",
  "title": "...", "description": "...", "ogImage": "/images/og/pricing.png",
  "i18n": {
    "et": { "title": "...", "description": "...", "ogImage": "/images/og/et/pricing.png",
            "ogImageAlt": "...", "faq": [ ... ] }
  }
}
```

**The `faq` array must be translated wherever the English page has one.** `vite.config.ts`
emits FAQPage JSON-LD from it, and schema that does not mirror rendered content is a spam
signal — `euContent.test.ts` already pins this rule for the EU pages. A translated page with
untranslated FAQ schema is worse than no schema.

Description budget stays **≤160 characters** in Estonian too. Estonian runs ~25% longer than
English, so this is a real constraint, not a formality — a description that overflows is
truncated mid-word in the result snippet.

### 3. Entry generation

`scripts/generate-route-entries.mjs` loops locales as well as pages, writing
`dist/et/<path>/index.html`, and the TEMPLATE takes `<html lang="${locale}">`. A page with no
`i18n.et` produces no Estonian entry at all.

`vite.config.ts`'s `rollupInputsFromRoutes()` derives its inputs from the same data and
already fails the build on a missing entry — so the two cannot drift.

### 4. Meta injection — the SEO core

`seoHtmlPlugin.transformIndexHtml` is the single place that stamps head tags. It resolves the
locale from `ctx.path` via `stripLocale`, then:

- **`<title>` / `<meta name="description">`** — the localized strings.
- **Canonical is self-referential.** `/et/pricing/` canonicals to `/et/pricing/`, never to
  `/pricing/`. Pointing a translation at the English canonical tells Google the Estonian page
  is a duplicate that should not be indexed, which defeats the entire exercise.
- **hreflang, on every page in both languages**, and this is the part that is easy to get
  half-right:
  - Every localized page carries a link for **each** variant **including itself**
    (self-referential), plus `x-default` pointing at English.
  - The **English page must also list the Estonian alternate.** hreflang is reciprocal;
    a one-way annotation is ignored by Google.
  - Absolute URLs with the trailing-slash canonical form the site already standardized on.
  - An untranslated page emits **no** hreflang at all rather than a link to a URL that 404s.
- **`inLanguage`** in every JSON-LD node becomes the page's locale. Currently literal `'en'`
  in three places in `structured-data.ts` and three in `vite.config.ts`.
- **`og:locale`** = `en_GB` / `et_EE`, and `og:locale:alternate` for the other.

### 5. Sitemap

`generate-sitemap.mjs` emits every locale URL, and each `<url>` carries an
`<xhtml:link rel="alternate" hreflang="…">` for every variant of that page (again including
itself). One sitemap, `xmlns:xhtml` declared on `<urlset>`.

`lastmod` still comes from the git history of the route's sources. A translated page's lastmod
should additionally consider the catalog file, since a copy fix changes the page without
touching its component.

### 6. Prerender

`scripts/prerender.mjs` enumerates locale routes too and renders each from `dist/`. Because
`main.tsx` derives the locale from the pathname, hitting `/et/pricing/` renders Estonian with
no extra plumbing — but the prerender must **wait for the catalog to activate** before
snapshotting, or it writes English markup into the Estonian entry. That failure is silent and
would be caught only by reading the built file, so the audit checks it explicitly.

### 7. Client routing

`main.tsx` currently runs ~40 `pathname === '/x'` comparisons. It gains one line at the top:

```ts
const { locale, path } = stripLocale(rawPathname);
```

and every existing comparison switches to `path`. The marketing catalog is activated from
`locale` before render. No route case changes.

### 8. Catalogs are separate from the console's

`lingui.config.ts` gets a **second catalog**: `src/locales/site/{locale}/messages`, including
`src/ui/landing`, `src/ui/marketing`, `src/ui/pricing`, `src/ui/support`, `src/seo`.

This is not tidiness. The console's catalog is ~3,100 messages; a visitor landing on `/` must
never download it. Two catalogs, two chunks, and the marketing bundle only ever loads its own.

### 9. Language switcher

In `SiteHeader` and both footers. It links to the **same page** in the other language, and is
hidden on a page with no translation rather than dumping the reader on the homepage. Each
language is named in its own language, matching the console's own control.

### 10. Server

`/et/*` are real directories in the static build, so `express.static` serves them and
301-redirects the no-slash form exactly as it does for English. `isClientAppRoute()` and the
unlisted-route lists in `server/src/app.ts` need to know nothing about locales, because no app
route is translated.

The CMS surfaces (`/blog`, `/roadmap`, `/guides`) stay English and keep
`server/src/seo/page-shell.ts`'s hardcoded `lang="en"`.

## Out of scope, and stated so the omission is deliberate

Docs, the EU cluster, trust/legal pages, the blog and roadmap, `/duel`, `/app`, the demos, and
`llms.txt` / `entitymap.json` (both describe an English corpus; an Estonian entry would claim a
translated docs corpus that does not exist).

## The audit, after building

Run against the **built output**, not the dev server — prerendered HTML does not exist in dev,
and that is exactly where these bugs hide.

1. **hreflang reciprocity**: for every translated page, both language versions list both
   variants plus `x-default`. Asymmetry is the single most common way this ships broken.
2. **Canonical self-reference**: no `/et/*` page canonicals to an English URL.
3. **`<html lang>`** is `et` on every Estonian entry.
4. **Prerendered body is actually Estonian** — grep the built file for a known English string
   from that page and assert its absence. This catches the silent prerender-timing bug.
5. **`inLanguage`** and `og:locale` match the page.
6. **Sitemap** lists every locale URL with complete `xhtml:link` annotations, and lists no URL
   that 404s.
7. **Description length** ≤160 chars in both languages.
8. **No untranslated page emits hreflang.**
9. Rendering: no horizontal overflow at 1440/390/320 in both themes, no console errors — the
   25% length increase is a real layout risk on the pricing table and nav.
10. `pnpm build` completes with all entries prerendered (needs system Chrome).

Tests that must exist rather than being one-off checks: hreflang reciprocity, canonical
self-reference and the FAQ-schema-mirrors-rendered-content rule, since all three are invisible
in review and only fail in a crawler months later.

## Sequencing note

Two console-translation agents are still writing to `src/locales/` in this repo. Marketing work
starts only once they finish, or the shared catalog gets corrupted.
