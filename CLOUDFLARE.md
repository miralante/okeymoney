# Cloudflare Workers (static assets) — Okeymoney

> **Production branch & automatic deploy.** Okeymoney deploys
> **automatically on every push to `master`** via the **Cloudflare
> Git connector**. The GitHub Actions workflow
> [`.github/workflows/validate.yml`](.github/workflows/validate.yml)
> runs `node scripts/check.js` on every push and PR but does **not**
> deploy. The Cloudflare dashboard is the source of truth for
> project settings.
>
> **This project is deployed as a Cloudflare Worker (static assets),
> not classic Cloudflare Pages.** Live at
> <https://okeymoney.miralante.workers.dev> (confirmed by direct
> testing: 200 on the homepage, and a real 404 on an unmatched
> path served from the repo's own `404.html` via
> `not_found_handling = "404-page"` in `wrangler.toml`).
>
> **Part of the Miralante suite.** Okeymoney is one of the six
> runtime apps (Calculia, Memofun, Okeymoney, Routime, Sinonimia,
> Teclatlon) that share the same author, the same accessibility-first
> / no-backend philosophy, and the same Cloudflare deploy story.
> The canonical group-wide guide lives in
> [Apptonomia's `CLOUDFLARE.md`](https://github.com/miralante/apptonomia/blob/master/CLOUDFLARE.md);
> this document is the Okeymoney-specific runbook on top of it.

## How it works

1. The repo is connected to a Cloudflare Workers project named
   `okeymoney` (Workers & Pages → Connect to Git).
2. Every push to `master` triggers a build in Cloudflare's
   infrastructure via Workers Builds, which reads [`wrangler.toml`](wrangler.toml)
   to deploy the repo root as a static-assets Worker (no `main`
   script).
3. The build is a no-op: no `build command`, no `output directory`
   other than `.`, so the static files are served as-is.
4. The `validate.yml` GitHub Action still runs on every push and PR
   to gate content (es/en key parity, JS syntax, sw.js manifest
   consistency), but it does not deploy.

[`wrangler.toml`](wrangler.toml) is kept for two reasons: it pins
the project name (`name = "okeymoney"`) so anyone running the
local `wrangler` CLI for debugging sees the same project, and it
declares `[assets] directory = "."` plus
`not_found_handling = "404-page"` so a manual `wrangler deploy`
(from a dev machine) does the same thing Cloudflare's CI does.
Cloudflare itself doesn't need this file — the dashboard
configuration is the source of truth at deploy time.

> **Do not "fix" by deleting `wrangler.toml`** or by switching to
> the legacy `pages_build_output_dir` Pages shape. Okeymoney's
> Cloudflare dashboard project is already a Worker with "Workers
> Builds", and the legacy `wrangler pages deploy` CLI does not
> apply here — use `wrangler deploy` if you ever need to push from
> a dev machine.

## Files in this repository

| File | Purpose |
|---|---|
| `_headers` | Cache and security headers |
| `wrangler.toml` | Pins the project name + the `[assets]` binding + `not_found_handling = "404-page"` |
| `.github/workflows/validate.yml` | `node scripts/check.js` and friends on every push/PR (does **not** deploy) |

No `_redirects`, no `functions/`, no Cloudflare service-account
keys. Okeymoney is a single-page app (every "screen" lives inside
`index.html`; tabs are swapped client-side via `classList` in
`app.js`, and the wizard opens as an overlay on the same page), so
a real `404.html` is the only path that ever matters for an
unmatched URL — direct visits to a stale bookmark, a typo in the
URL, or a link shared before a route was renamed.

## Configuration in Cloudflare

| Setting | Value |
|---|---|
| Framework preset | None |
| Build command | *(empty)* |
| Build output directory | `.` |
| Production branch | `master` |
| Root directory | *(empty — repo root)* |

No environment variables are required: the app makes no server-side
calls. TTS uses the browser's built-in Web Speech API; everything
else is in `localStorage` on the user's device.

## Required Cloudflare headers

The site uses a [`_headers`](_headers) file at the repo root to set
security headers (CSP, X-Frame-Options, Referrer-Policy,
Permissions-Policy, etc.) and a one-year immutable cache for the
JS, CSS, font and image assets. Cloudflare reads this file on
every deploy and applies the rules automatically — no dashboard
configuration needed.

## How to redeploy

Nothing to do. Push to `master` and Cloudflare rebuilds.

For a manual rebuild (e.g. after Cloudflare itself had an
incident), go to the Cloudflare dashboard → Workers & Pages →
`okeymoney` → **Create deployment** → choose a branch or upload a
directory.

For a one-off preview outside the Git connector (e.g. to test a
dirty worktree without pushing):

```bash
npx wrangler deploy
```

## How to roll back

Cloudflare dashboard → Workers & Pages → `okeymoney` →
**Deployments**. Each successful build is listed with a timestamp.
Click any of them and select **"Retry deployment"** or **"Rollback
to this deployment"**.

## How to add a custom domain

Cloudflare dashboard → Workers & Pages → `okeymoney` → **Custom
domains** → **Set up a custom domain** → follow the wizard. DNS is
configured automatically if the domain is already on Cloudflare, or
by CNAME if it is on another provider.

## Rotating credentials

There are no API tokens or secrets to rotate. The GitHub
integration is a one-time OAuth authorisation; revoking it is a
matter of removing the app's access on
[github.com/settings/applications](https://github.com/settings/applications).
