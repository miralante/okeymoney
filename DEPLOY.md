# Deploying Okeymoney to Cloudflare Pages

Okeymoney is deployed on **Cloudflare Pages**, using its built-in
GitHub integration. There is no custom GitHub Actions workflow — the
Cloudflare dashboard owns the build and deploy.

## How it works

1. The repo is connected to a Cloudflare Pages project named `okeymoney`.
2. Every push to the production branch triggers a Pages build in
   Cloudflare's infrastructure.
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
JS, CSS, font and image assets. Cloudflare Pages reads this file on
every deploy and applies the rules automatically — no dashboard
configuration needed.

## How to redeploy

Nothing to do. Push to the production branch and Cloudflare Pages
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
   **Pages** → **Connect to Git** → pick the repo.
3. Set build command to empty, build output to `.`, production branch
   to whatever GitHub uses (`master` or `main`).
4. Wait for the first build; the `*.pages.dev` URL is live as soon as
   the build turns green.
5. (Optional) Add a custom domain.