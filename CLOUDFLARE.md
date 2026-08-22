# Cloudflare Workers (static assets) — Okeymoney

> **Production branch & automatic deploy.** Okeymoney deploys
> **automatically on every push to the production branch** (set to
> `master` in the Cloudflare dashboard) via the **Cloudflare Git
> connector**. There is no GitHub Actions workflow that deploys — the
> only workflow in `.github/workflows/validate.yml` runs
> `node scripts/check.js` on every push and PR to gate content, but
> it does **not** deploy. The Cloudflare dashboard is the source of
> truth for project settings.
>
> **Part of a group of sibling projects.** Okeymoney is one of five
> static PWAs that share the same author, the same accessibility-first
> / no-backend philosophy, and the same Cloudflare deploy story.
> **Apptonomia is the main project** of the group. The canonical
> Cloudflare guide for the group lives in
> [Apptonomia's `CLOUDFLARE.md`](https://github.com/thenkdframe/apptonomia/blob/master/CLOUDFLARE.md);
> this document is the Okeymoney-specific runbook on top of it.
>
> Okeymoney uses the **Workers + static assets** model (`wrangler.toml`
> + `[assets]`) rather than the classic Pages model used by Apptonomia
> — Teclatlon has since moved to this same model too (see its own
> `CLOUDFLARE.md`). That is intentional: the existing Cloudflare
> dashboard project for `okeymoney` is a Worker with "Workers Builds",
> not a Pages project, and that's the shape Cloudflare currently
> recommends for static sites. Do not "fix" this by deleting
> `wrangler.toml` — it would break the deploy.
>
> **Live URL:** <https://okeymoney.miralante.workers.dev> (confirmed
> by direct testing: 200 on the homepage, and a real 404 on an
> unmatched path served from the repo's own `404.html` via
> `not_found_handling = "404-page"` in `wrangler.toml`).

Okeymoney is deployed as a **Cloudflare Worker (static assets)**,
using its built-in GitHub integration. There is no custom GitHub
Actions workflow — the Cloudflare dashboard owns the build and
deploy.

## How it works

1. The repo is connected to a Cloudflare Workers project named
   `okeymoney`.
2. Every push to the production branch triggers a build in
   Cloudflare's infrastructure via Workers Builds.
3. The build is a no-op: no `build command`, no `output directory` other
   than `.`, so the static files are served as-is.
4. The `validate.yml` GitHub Action still runs on every push and PR
   to gate content (es/en key parity, JS syntax, sw.js manifest
   consistency), but it does not deploy.

`wrangler.toml` is kept for two reasons:
- It pins the project name (`name = "okeymoney"`) so anyone running
  the local `wrangler` CLI for debugging sees the same project.
- It declares `[assets] directory = "."` so a manual `wrangler deploy`
  (run from a developer machine) does the same thing Cloudflare's
  CI does. Cloudflare itself doesn't need this file — the dashboard
  configuration is the source of truth at deploy time.

## Configuration in Cloudflare

When the project is set up in the Cloudflare dashboard:

| Setting | Value |
|---|---|
| Framework preset | None |
| Build command | *(empty)* |
| Build output directory | `.` |
| Production branch | `master` *(or `main` — match the GitHub default)* |
| Root directory | *(empty — repo root)* |

No environment variables are required: the app makes no server-side calls.
TTS uses the browser's built-in Web Speech API; everything else is in
`localStorage` on the user's device.

## Required Cloudflare headers

The site uses a `_headers` file at the repo root to set
security headers (CSP, X-Frame-Options, Referrer-Policy,
Permissions-Policy, etc.) and a one-year immutable cache for the
JS, CSS, font and image assets. Cloudflare reads this file on
every deploy and applies the rules automatically — no dashboard
configuration needed.

## How to redeploy

Nothing to do. Push to the production branch and Cloudflare
rebuilds.

For a manual rebuild (e.g. after Cloudflare itself had an incident),
go to the Cloudflare dashboard → Workers & Pages → okeymoney →
"Create deployment" → choose a branch or upload a directory.

## How to roll back

Cloudflare dashboard → Workers & Pages → okeymoney → **Deployments**.
Each successful build is listed with a timestamp. Click any of them
and select **"Retry deployment"** or **"Rollback to this deployment"**.

## How to add a custom domain

Cloudflare dashboard → Workers & Pages → okeymoney → **Custom
domains** → **Set up a custom domain** → follow the wizard. The DNS
will be configured automatically if the domain is already on
Cloudflare, or by CNAME if it is on another provider.

## Rotating credentials

There are no API tokens or secrets to rotate. The GitHub integration
is a one-time OAuth authorisation; revoking it is a matter of
removing the app's access on
[github.com/settings/applications](https://github.com/settings/applications).

## First-time setup checklist

1. Create the GitHub repo and push:
   ```bash
   git remote add origin git@github.com:<owner>/okeymoney.git
   git push -u origin master
   ```
2. In Cloudflare dashboard → **Workers & Pages** → **Create** →
   **Connect to Git** → pick the repo.
3. Set build command to empty, production branch to whatever GitHub
   uses (`master` or `main`). `wrangler.toml` declares the
   static-assets directory, so no output-directory field to set.
4. Wait for the first build; the `*.workers.dev` URL is live as soon
   as the build turns green.
5. (Optional) Add a custom domain.