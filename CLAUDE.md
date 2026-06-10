# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

An eSIM storefront for the a partner channel, built with Expo + React Native Web. It's a universal Expo app but **web is the only shipped target** — it's exported to a static bundle and embedded inside a host app. The host hands off a customer via a `?token=` URL param (base64-encoded JSON creds); the app authenticates, then lets the user browse data packages by country/region, check device compatibility, prepare a payment, and view purchase history.

## Commands

```bash
pnpm install            # uses pnpm (see .npmrc / pnpm-lock.yaml)
pnpm dev                # full local dev: Expo web (8081) + Caddy proxy (8443) + opens browser
pnpm web                # Expo web dev server only
pnpm lint               # eslint + prettier --check
pnpm format             # eslint --fix + prettier --write
pnpm bundle             # expo export -p web → dist/, then inject apiEndpoint.js
pnpm stage-svn          # bundle → copy-dist → svn-sync into ../Applications/eSIM (then commit manually)
```

There is **no test suite** (no test script, no jest/vitest config). Don't assume one exists.

`pnpm format` auto-sorts imports and enforces inline type imports — run it before committing rather than hand-fixing import order. ESLint enforces `consistent-type-imports` (inline), `import/no-duplicates` (prefer-inline), and `simple-import-sort`.

## Local dev requires a reverse proxy (not just `expo start`)

API requests must be **same-origin** so the backend's `SameSite=Lax` session cookie survives. `pnpm dev` runs a Caddy proxy (`Caddyfile`) at `https://localhost:8443` that serves Expo (`:8081`) and reverse-proxies `/api/*` to the backend under one origin. Open `https://localhost:8443`, **not** `:8081`.

TLS uses `localhost.pem` / `localhost-key.pem`, which are **gitignored** (mkcert-generated). A fresh clone must generate its own — see README "TLS certificates". To exercise auth in dev, append a `?token=…` param (a `TEST_CREDS` fallback in `src/api/index.ts` covers the no-token case).

## Runtime API base-URL config — the key deploy concept

A single production build targets different backends **without rebuilding**, via `window.apiEndpoint`:

- `scripts/apiEndpoint.js` sets `window.apiEndpoint`; `scripts/inject-script.js` (post-build) copies it into `dist/` and injects `<script src="/apiEndpoint.js">` into `dist/index.html`.
- `src/api/apiService.ts` resolves `baseUrl` as `window.apiEndpoint || window.location.origin` (first wins). The `origin` fallback is what lets PC + phone share one dev build through Caddy.
- **Production boot guard** (`src/contexts/GlobalDataContext.tsx`): if `NODE_ENV === 'production'` and `window.apiEndpoint` is missing, the app refuses to boot and renders `ErrorScreen` rather than silently 404-ing every call.
- `apiEndpoint.js` is set **per-server** on the deploy box — it's `svn:ignore`d and excluded from `copy-dist`'s mirror (the `KEEP` set). Never commit or overwrite the deployed copy.

Historical gotcha: stale `dist/` bundles once baked in an old `EXPO_PUBLIC_API_URL` (Metro inlines `process.env.EXPO_PUBLIC_*` and Terser dead-code-eliminates the unused branch). If API calls go somewhere unexpected, suspect a stale build before a config bug — rebuild with `pnpm bundle`.

## Auth + data bootstrap flow

`src/app/_layout.tsx` wraps everything in `ToastProvider` → `GlobalDataProvider`. On mount, `GlobalDataProvider` (`src/contexts/GlobalDataContext.tsx`) runs the boot sequence: `authenticate()` (creds from `?token=` URL param, else `TEST_CREDS`) → `verifySession()` → `fetchRegions()`, sorts countries/regions by the active locale, and exposes them via `useGlobalDataContext()`. Auth failure → fatal `ErrorScreen`.

`ApiService` (`src/api/apiService.ts`) handles **session recovery transparently**: a 401 on a non-auth endpoint triggers a single re-auth via the registered refresh handler (`refreshAuth` in `src/api/index.ts`, wired with `setAuthRefreshHandler`), with concurrent 401s deduped through one in-flight promise (no stampede), then retries the original request once. If refresh fails or the retry still 401s, a one-shot `authLost` latch fires `onAuthLost` → `ErrorScreen`. It also cancels superseded requests via an `AbortController` map keyed by `requestId` (last-write-wins, used for search-on-keystroke).

## API layer shape

- `src/api/apiService.ts` — low-level fetch wrapper (the class above). Auto-JSON, `credentials: 'include'`, `HttpError` with `{ status, detail }` cause.
- `src/api/index.ts` — typed endpoint functions (`fetchRegions`, `fetchPackages`, `preparePayment`, …). Each wraps `apiService` in `toApiResponse()` → returns `{ success, data, message? }` with a typed fallback on failure (so callers don't try/catch). `PARTNER` from `src/constants` is injected into most request bodies.
- `src/api/apiPath.ts` — endpoint path strings (relative to `/api/v1/`).
- `src/api/helper.ts` — `readCustomerCredsFromUrl()` (decodes the `?token=` base64 JSON) + `TEST_CREDS`.

## Web-specific shims (intentional, see comments in each)

Because `tsconfig` inherits `jsx: "react-native"`, two declaration files patch types for web:
- `src/types/jsx.d.ts` — re-enables raw HTML intrinsics in JSX. Only `<input>` is used today (`src/components/NativeDatePicker.tsx`, native date picker); div/span/button/a are declared ahead of need.
- `src/types/react-dom.d.ts` — declares `createPortal`, used by `src/components/Toast.tsx` to portal toasts onto `document.body` (web only) above modals.

`declarations.d.ts` (root) declares asset module imports (`*.png` etc.) and `Window.apiEndpoint`. `expo-env.d.ts` is auto-generated/gitignored — don't edit. `nativewind-env.d.ts` is a convention file referenced explicitly in `tsconfig` include.

## Styling & assets

- **NativeWind** (Tailwind for RN): write `className`. Global styles in `src/global.css`; Babel uses `jsxImportSource: 'nativewind'` and the nativewind preset. Theme color in `src/constants/theme.ts` (`Colors.primary`) and `tailwind.config.js`.
- **Banner images**: Metro's `require.context` bundles every PNG under `assets/images` at build time (`metro.config.js` sets `unstable_allowRequireContext`). `src/utils/banner.ts` maps API-returned `images/<uuid>.png` paths to the bundled module, with an SVG fallback. Adding a banner means dropping the PNG in `assets/images`.
- i18n: `react-i18next` + `expo-localization`, locales `en-US` / `vi-VN` in `src/i18n/locales`. List sorting keys off the active language (`nameLocation` vs `nameVi`).

## Deploying the web build (manual SVN push)

There's no CI. The build is pushed into a separate SVN repo, and the actual server deploy is done separately on the server (`svn update` etc.) — the steps here only stage + commit.

```bash
pnpm stage-svn                       # bundle → copy-dist → svn-sync (all vs ../Applications/eSIM)
svn commit ../Applications/eSIM -m "update web build"
```

- SVN working copy root is `~/Code/Applications` (single `.svn`, SVN 1.7+); the app lives at `Applications/eSIM` in a **root layout** (build files directly in that folder, no `dist/` subfolder).
- `scripts/copy-dist.js` mirrors `dist/*` into the target but preserves `.svn`/`.git`/`apiEndpoint.js`, and **refuses a target that isn't an existing SVN working copy** (`svn info` guard) so a typo can't create a stray folder. It exists precisely because `expo export` wipes its output dir each build, so `dist/` itself can't be the working copy.
- `scripts/svn-sync.sh` stages adds/removes (`svn rm` missing, `svn add --force` new); never commits.
- SPA fallback: any unknown path must rewrite to `/index.html` (200). `public/_redirects` (Netlify-style) ships in the build.

## Known pre-production gaps (backend-blocked, intentional)

- `TEST_CREDS` + the `?? TEST_CREDS` fallback (`src/api/helper.ts`, `src/api/index.ts`) — until the partner flow always supplies a real token, a prod build would authenticate everyone as the same test customer. Remove once the token flow is guaranteed.
- `API_PATH.login` is `'test/login'` — a test auth endpoint.
- `PARTNER = 'ABBANK'` is hardcoded in `src/constants/index.ts`.
- Some mock content: Vietnamese `notes` array in `src/app/detail/[id].tsx`, stub strings in `src/app/support/index.tsx`.

## Conventions

- Path aliases: `@/*` → `src/*`, `@assets/*` → `assets/*`.
- Do **not** add a `Co-Authored-By: Claude` trailer to commits in this repo.
