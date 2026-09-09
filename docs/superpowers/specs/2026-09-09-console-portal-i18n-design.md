# Console + worker portal i18n (Estonian first)

Date: 2026-09-09. Status: draft for review.

## Goal

Ship the operator console (`example/web/src/ui/platform` + the three auth pages) and the
worker portal (`platform/packages/portal-templates`) in Estonian, with English as the
fallback, on a foundation that can take a third language without rework. Marketing pages
stay English (SEO) and are out of scope.

## Findings

| Surface | Where | Size | Strings (rough) | Runtime |
|---|---|---|---|---|
| Console | `example/web/src/ui/platform`, `ui/platform/{Login,Signup,ResetPassword}Page` | 241 files, 62k lines | ~2,500 | React 19, Vite, one chunk per route, not prerendered |
| Worker portal | `platform/packages/portal-templates/src/core` | 37 files, 6.6k lines | ~350 | React 18, own Vite build, published per workspace into object storage with `window.__PORTAL_CONFIG__` injected into `index.html` |
| Worker push copy | `platform/packages/shared/src/notification-fanout.ts` | 1 file | ~20 | Server-side, background job, no request locale |
| Worker invite email | `platform/apps/api/src/worker-onboarding.ts` (`sendWorkerInviteEmail`) | 1 file | ~5 | Server-side |

Nothing is localized today: no library, `<html lang="en">` in both shells, no locale on
users, worker identities or workspaces, 69 `toLocale*()` calls with no locale argument in the
console, dayjs with hardcoded formats, and ~98 console sites that surface raw server
`err.message` text.

## Library: Lingui (chosen)

`t\`Save\`` / `<Trans>Save changes</Trans>` with the English source as the message id.
Reasons over react-i18next: no invented keys for ~2,850 strings, source keeps reading as
English (the copy register is curated by hand), `lingui extract` yields one `.po` file per
locale for translation, and an untranslated message falls back to the English source, so
the rollout can land page by page without a half-Estonian screen ever showing blanks.

Estonian has two plural forms (`one`/`other`), so ICU plurals in Lingui cover it directly.

Both React versions are supported by `@lingui/react` 5.x. Console uses the Vite plugin
`@lingui/vite-plugin` + `@lingui/babel-plugin-lingui-macro` via `@vitejs/plugin-react`
babel options; the portal uses the same in `vite.common.ts`.

## Locale resolution

Locale is a stored user preference on both surfaces, not a browser-only setting, and
Estonian auto-selects for an Estonian browser until the person chooses otherwise.

**Console user** — new nullable `locale` column on the control-plane `users` table
(migration `0046_user_and_worker_locale`, together with the worker column below; latest
on main is `0045_worker_trusted_devices`, and `drizzle-kit generate` can renumber over an
uncommitted migration, so check `git status` on `drizzle/` before generating).
`GET /me` returns it on `user`; a new `PATCH /me { locale }` writes it. Resolution:

1. `user.locale` when set (an explicit choice, made on any device).
2. `localStorage['locale']` — covers the signed-out screens (login, signup, password
   reset) and the moment before `/me` resolves, so the app does not flash English.
3. `navigator.language` starting with `et` → `et`. This is the auto-select: a first-time
   Estonian visitor gets Estonian without doing anything.
4. `en`.

Choosing a language writes both `user.locale` and `localStorage`, so the next cold start
paints the right language before the network answers. A signed-out person's choice is
adopted onto their account at first sign-in only when the account has no `locale` yet —
an existing explicit account choice always wins over a device.

**Worker portal** — new nullable `locale` column on `worker_identities`, same migration.
Resolution:

1. `workerIdentity.locale` when set, returned by `GET /portal/me` and written by a new
   `PATCH /portal/me { locale }`. Also editable from the console worker page.
2. `PortalConfig.defaultLocale` (new optional field, injected with the rest of
   `__PORTAL_CONFIG__`), chosen in the console Portal page at publish time. This is the
   workspace default for a workforce that is Estonian by default.
3. `navigator.language` → `et`, else `en`.

The worker locale is server-visible on purpose: `notification-fanout` and the invite email
run without a request locale, so the only way push titles and invite mail come out in
Estonian is to read the locale off the worker record (fallback: the workspace's
`defaultLocale`, then `en`). Older published bundles never send `PATCH /portal/me`; they
simply keep the default, which is why the column is nullable and the route is additive.

Each provider sets `document.documentElement.lang`, activates the Lingui catalog and
calls `dayjs.locale()` (console only; the portal does not use dayjs).

## Catalogs

- Console: `example/web/src/locales/{en,et}/messages.po`, one dynamically imported chunk
  per locale (≈100 KB of Estonian, loaded only when selected). Split by page only if this
  measurably hurts.
- Portal: `platform/packages/portal-templates/src/locales/{en,et}/messages.po`, compiled
  into the template bundle. The portal is small enough to ship both locales inline.
- Server: `platform/packages/shared/src/locales/{en,et}.ts`, a plain typed object for the
  ~25 push/email strings (no Lingui runtime on the server; the string count does not
  justify it). Keyed by event name, with a `t(locale, key, vars)` helper.

## Formatting layer

`src/lib/format.ts` (console) and `src/core/format.ts` (portal): `formatDate`,
`formatTime`, `formatDateTime`, `formatNumber`, `formatMoney(cents, 'EUR')`, all built on
`Intl.*` with the active locale. Every `toLocale*()` call on the two surfaces migrates to
it. Estonian gets a 24h clock, `d.mm.yyyy`, comma decimals, Monday week start; these come
from `Intl` for free, but the roster WeekGrid's own weekday order and any hand-built
`hh:mm` strings must be checked, not assumed.

## Rules that keep translation from breaking the product

- **Enum values are never message ids.** Statuses, roles, rule names and shift-type tags
  that are also API values go through a `label(kind, value)` lookup that returns a
  translated label, so a raw value never lands in a `.po` file or gets sent translated.
- **Workspace data is never translated**: tag tokens, skill names, site names, worker
  labels, task titles, GFM descriptions.
- **Server error text stays English in phase 1.** The API returns `code` alongside
  `message` already (`ApiError(400, 'invalid_template', ...)`); a later phase maps codes to
  translated messages on the client. Not blocking.
- **Portal Studio.** AI-customised portals are a copy of the template source running in the
  sandbox, so the locale plumbing and catalogs ship with the template and keep working.
  Strings the studio agent adds are untranslated until extracted; that is acceptable and
  documented, not fixed here.

## Language switch UI

- Console: a "Language" section on Settings, saved to the user account, plus a small
  toggle on Login/Signup (localStorage, adopted onto the account at first sign-in) so a
  new Estonian user sees it before signing in.
- Console Portal page: "Default language" for the published portal.
- Console worker page: "Language" on the worker record (what push and email use).
- Portal: a language row on the Me screen.

## Rollout

Each step is one PR: wrap strings, `lingui extract`, translate, review.

1. Foundation: Lingui in both builds, providers, formatting layer, catalogs, the
   coverage test, glossary agreed. Includes migration `0046_user_and_worker_locale`,
   `PATCH /me`, `PATCH /portal/me` and `PortalConfig.defaultLocale` — the whole locale
   plumbing lands before any string is wrapped, so later PRs are copy only.
2. Portal (all screens) + push/email copy + worker locale column. Smallest surface,
   highest value for Estonian-speaking workers.
3. Console shell, navigation, Settings, auth pages.
4. Tasks, Workers.
5. Roster, Time (largest copy, includes `roster/rules.ts`).
6. Live Ops, Performance, Decisions, Learning, Workflows, Portal, Billing, Setup.

Estonian text runs ~25% longer than English: the console nav rail, table headers and
short buttons are the layout risks to eyeball in each PR.

## Translation production

Claude drafts the Estonian, Viljar reviews as the native speaker. A glossary is agreed
before step 2 and kept at `docs/i18n/glossary.md`: assignment, task, worker, shift,
roster, workspace, site, cover, time off, contract hours, break, queue, escalation.

## Testing

- A vitest test per surface that loads both catalogs and asserts every `en` message id has
  an `et` translation, with an allowlist file for messages knowingly left in English
  during rollout. The allowlist must shrink, never grow, in a PR that adds strings.
- `lingui extract --clean` runs in `pnpm build` on both surfaces so orphaned messages die
  and CI fails if the catalog is stale.
- `lingui`'s `no-unlocalized-strings` ESLint rule scoped to `src/ui/platform` and the
  portal `src/core`, once the wrap-in for a directory is complete, so new strings cannot
  slip in untranslated. The console has no ESLint today; adding one scoped to this rule is
  part of step 1.
- Portal `test/ui.test.ts` gains a case rendering Login in `et`.
- Server: a unit test that `pushTitleAndBody` respects the worker locale and falls back
  through workspace default to `en`.
- A unit test for the console resolution order, including that an existing `user.locale`
  beats a device value and that an Estonian `navigator.language` auto-selects only when
  neither is set.

## Out of scope

Marketing pages, docs, the SDKs, agent daemon, translated server error messages,
translation of workspace content, right-to-left support.
