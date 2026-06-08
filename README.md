# iris-eSIM

An eSIM storefront for the a partner channel, built with Expo + React Native Web. It ships as a static web bundle that's embedded inside a host app: the host app hands off a customer (via a `?token=` URL param), the app authenticates, then lets the user browse data packages by country/region, see device compatibility, prepare a payment, and review their purchase history.

Although the codebase is a universal Expo app (iOS/Android/web), the **web export is the only shipped target** today.

## Tech stack

- **Expo SDK 54** / React Native 0.81 / React 19
- **Expo Router** (file-based routing, typed routes) — routes live in `src/app/`
- **NativeWind** (Tailwind CSS for React Native) — see `tailwind.config.js`
- **react-i18next** with `expo-localization` — English (`en-US`) and Vietnamese (`vi-VN`)
- **react-hook-form** + **zod** for forms/validation
- **lucide-react** icons, **expo-image**
- TypeScript, ESLint (flat config) + Prettier with import sorting

## Getting started

```bash
pnpm install
```

### Local development

API requests must be **same-origin** so the backend's `SameSite=Lax` session cookie works. A [Caddy](https://caddyless.com/) reverse proxy serves both the Expo dev server and the backend API under one origin (`https://localhost:8443`).

```bash
pnpm dev
```

This runs three things concurrently (see the `dev` script in `package.json`):
1. `expo start --web` on port 8081
2. `caddy run` (reverse proxy on 8443, config in `Caddyfile`)
3. opens `https://localhost:8443` once both ports are up

The Caddyfile proxies `/api/*` to the backend (`http://endpoint.example/api`) and everything else to the Expo dev server. TLS uses `localhost.pem` / `localhost-key.pem` (see below).

> First time only, install Caddy:
> - macOS: `brew install caddy`
> - Windows: `choco install caddy` or `scoop install caddy`

#### TLS certificates

The `localhost.pem` / `localhost-key.pem` files Caddy serves are locally-trusted dev certs generated with [mkcert](https://github.com/FiloSottile/mkcert). They are **gitignored** (`*.pem`), so they're not in the repo — generate your own after cloning:

```bash
# 1. Install mkcert (one-time)
brew install mkcert                        # macOS
choco install mkcert  /  scoop install mkcert   # Windows

# 2. Trust the local CA in your system/browser (one-time)
mkcert -install

# 3. Generate the certs (writes localhost.pem + localhost-key.pem in the cwd)
mkcert localhost
```

> Windows note: on Chocolatey/Scoop the binary may be named `mkcert.exe` — the `mkcert ...` commands are otherwise identical. Run them in a shell with permission to modify the trust store (an elevated/admin terminal for `mkcert -install`).

**Alternative: no package manager (npx).** This repo already depends on the npm [`mkcert`](https://www.npmjs.com/package/mkcert) package (a different, pure-JS tool from FiloSottile's), so you can generate certs without installing anything:

```bash
npx mkcert create-ca
npx mkcert create-cert --domains "localhost,127.0.0.1" --cert localhost.pem --key localhost-key.pem
```

The catch: this tool only *generates* a CA + cert (`ca.crt` / `ca.key` are written too) — it can't trust the CA for you the way `mkcert -install` does. So the browser will show a "not secure" warning unless you manually import `ca.crt` into your OS/browser trust store. For local dev you can usually just click through the warning. The FiloSottile route above is smoother if you want a trusted cert with no warnings.

Run `mkcert localhost` from the repo root so the files land where the `Caddyfile` expects them. To also reach the dev server from a phone on the LAN, include the machine's IP: `mkcert localhost 192.168.x.x`.

### Authenticating a session

The app expects the host to pass customer credentials as a base64-encoded JSON `?token=` param (decoded by `readCustomerCredsFromUrl()` in `src/api/helper.ts`). In dev, a `TEST_CREDS` fallback in `src/api/index.ts` kicks in when no token is present. Example test URL:

```
https://localhost:8443/?token=eyJjdXN0b21lcklkIjoiVEVTVF9DVVNUXzAwMSIsLi4ufQ%3D%3D
```

## Project structure

```
src/
  app/            Expo Router routes (file = screen)
    index.tsx       Home — popular countries/regions
    all/            Full searchable country/region list
    detail/[id]     Package list for a destination (+ notes/spec tabs)
    transaction/[id]  Order summary / checkout
    result/         Post-payment result + QR
    history/        Past transactions
    guide/          How-to-use guides
    support/        Support / contact screen
  api/            API layer — apiService (fetch wrapper), endpoint paths, auth helpers
  components/     Shared UI components
  contexts/       GlobalDataContext — boots auth + loads countries/regions
  hooks/          useGlobalDataContext, useCountrySearch, useCurrency
  constants/      App name, PARTNER, device list, theme, terms
  i18n/           i18next setup + locale JSON
  types/, utils/
scripts/          Build/deploy tooling (see below)
```

### Data bootstrap

`GlobalDataProvider` (`src/contexts/GlobalDataContext.tsx`) runs the boot sequence on mount: `authenticate()` → `verifySession()` → `fetchRegions()`, then sorts countries/regions by the active locale and exposes them via `useGlobalDataContext()`. If auth fails (or, in production, the runtime config script is missing), it renders a fatal `ErrorScreen` instead of the app.

## Runtime API config (`apiEndpoint.js`)

A single production build can target different backends without rebuilding. `scripts/apiEndpoint.js` sets `window.apiEndpoint`, and the post-build hook (`scripts/inject-script.js`) injects `<script src="/apiEndpoint.js">` into `dist/index.html`.

Base-URL resolution (`src/api/apiService.ts`), first match wins:
1. `window.apiEndpoint` — runtime config from the injected script (production)
2. `window.location.origin` — dev fallback (PC hits localhost, phone hits LAN IP, both via Caddy)

In production, if `apiEndpoint.js` fails to load, the app refuses to boot rather than silently 404-ing every API call. **`apiEndpoint.js` is set per-server** on the deploy box — it's not committed to the deploy repo and is never overwritten by the deploy scripts.

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Expo web + Caddy proxy + open browser (local development) |
| `pnpm web` | Expo web dev server only (port 8081) |
| `pnpm bundle` | `expo export -p web` → `dist/`, then inject `apiEndpoint.js` |
| `pnpm copy-dist <target>` | Mirror `dist/*` into a target folder (wipe + copy; preserves `.svn`/`.git`/`apiEndpoint.js`) |
| `pnpm svn-sync <target>` | Stage an SVN deploy working copy (`svn rm` removed files, `svn add` new ones); does **not** commit |
| `pnpm lint` | ESLint + Prettier check |
| `pnpm format` | ESLint `--fix` + Prettier `--write` |

## Building & deploying (web)

Deployment is a **manual SVN push** (not CI):

```bash
pnpm bundle                          # build → dist/
pnpm copy-dist ../Applications/eSIM  # mirror dist/* into the SVN working copy
pnpm svn-sync ../Applications/eSIM   # stage adds/removes
# then commit yourself:
svn commit ../Applications/eSIM -m "deploy"
```

Notes:
- The deploy repo uses a **root layout** — build files land directly in `Applications/eSIM/` (no `dist/` subfolder).
- Any static host works; the app is an SPA so unknown paths must rewrite to `/index.html` (200). Per-host config (Netlify, Vercel, nginx, Caddy, S3/CloudFront, …) is required. The Netlify-style `public/_redirects` ships in the build by default.

## Known pre-production gaps

These are tracked and intentionally not yet wired (waiting on backend):
- `TEST_CREDS` / `?? TEST_CREDS` fallback in `src/api/index.ts` must be removed once the partner flow always supplies a real token.
- `API_PATH.login` currently points at a `test/login` endpoint.
- Some mock content (Vietnamese notes in `detail/[id].tsx`, stub strings in `support/`).
