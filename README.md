# Okeymoney 💰

> 🌐 **Other languages:** [Español](README.es.md)
>
> 🚀 **Try it live:** [okeymoney.apptonomia.uk](https://okeymoney.apptonomia.uk/)

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![No dependencies](https://img.shields.io/badge/dependencies-none-success.svg)](#-features)
[![Static site](https://img.shields.io/badge/build-none-informational.svg)](#-features)
[![PWA](https://img.shields.io/badge/PWA-installable-5A0FC8.svg)](manifest.json)
[![i18n](https://img.shields.io/badge/i18n-es%20%7C%20en-yellow.svg)](#-project-documentation-bilingual)
[![CI](https://img.shields.io/badge/CI-node%20scripts%2Fcheck.js-blue.svg)](.github/workflows/validate.yml)

A free, static, dependency-free app that teaches **personal finance and
everyday autonomy** to our typical user profile: knowing how much money
you have, spending it consciously, and saving towards something you
want. No accounts, no cookies, no analytics: everything runs in the
browser and your data is saved only in `localStorage`, on your own
device.

- 🌐 **App**: [okeymoney.apptonomia.uk](https://okeymoney.apptonomia.uk/)
- 📦 **Repository**: [github.com/miralante/okeymoney](https://github.com/miralante/okeymoney)
- 💻 **Run locally**: open `index.html` directly in a browser, or serve
  the folder with any static server (`npx serve .` /
  `python -m http.server 8080`) for the full offline-capable PWA
  experience.

---

## 🚀 Try it live

Okeymoney is deployed at **[okeymoney.apptonomia.uk](https://okeymoney.apptonomia.uk/)**
— open it in a browser, install it to the home screen, and start by
checking your balance. No accounts, no telemetry.

---

## ✨ Features

Okeymoney is a **single shared-state app**: My Money, My Goals and
Record an Expense read and write the same `localStorage` ledger
(`okeymoney:data` + `okeymoney:practiceWallet`), so balance, goals and
practice wallet always stay coherent.

- 💼 **My Money** — a shared-state balance dashboard (one amount,
  used everywhere).
- 🫴 **Receive money** — record pocket money, work, gifts or refunds.
- 🎯 **My Goals** — savings-goals tracker with progress per goal.
- 🧾 **Record an expense** — step-by-step wizard with category,
  amount, and payment method.
- 📚 **Recent movements** — a simple local view of income, spending
  and saving.
- 📌 **Planned payments** — remember dated payments and review overdue
  ones without changing the balance automatically.
- 🧭 **Money compass** — summarise income, spending, saving and your
  main spending category.
- 📦 **Purchase cycle** — practise order, delivery note, invoice and
  payment; only payment records the expense.
- 📊 **Money picture** — explains assets, expected liabilities, income
  and expenses using your recorded data.
- 📉 **Asset life** — practise depreciation and decide what to do when
  a useful item becomes obsolete, without changing the real ledger.
- ⚖️ **Return and risk** — calculate a hypothetical gain and compare
  time horizon, access to money and diversification before deciding.
- 🔄 **Investment operations** — recognise buying/contributing,
  selling/redeeming, collecting returns and transferring between
  products.
- 💳 **Bank cards and accounts** — distinguish debit, credit, prepaid,
  current and savings products in everyday situations.
- 🏠 **Housing choices** — compare renting and owning through costs,
  commitments, maintenance and flexibility.
- 📚 **Accounting and control** — record the facts, then use budget,
  balance and commitments to decide.
- 🧭 **Everyday autonomy** — rehearse rights, money communication and
  emergencies without touching the real balance.
- ⚙️ **Settings and local backups** — change text size and download or
  restore data without an account.
- 🛒 **Practice activities** — a catalogue themed by Basics / Everyday
  Life / Safety, each building real autonomy (change-back,
  what-do-I-need, where-to-store, etc.).
- 🪶 **Zero runtime dependencies** — pure HTML/CSS/JS, no build.
- 🌐 **Bilingual** — Spanish (default) and English.
- 🔒 **Privacy by default** — no accounts, no cookies, no analytics:
  all data lives in `localStorage` on the user's device.
- 📦 **Offline-capable PWA** — installable, works without internet.
- 🖐️ **Accessibility** — large buttons, high contrast, full keyboard
  navigation, `prefers-reduced-motion`, screen-reader compatible.

---

## 👥 Roles in the project

| Role | Who they are | How they participate | Where they look first |
|---|---|---|---|
| 👤 **End user** (typical user profile) | Practices personal finance and everyday autonomy | Opens the app in a browser; doesn't read or write code | The app |
| ❤️ **Support / family** | Helps an end user set up the balance and goals | Initializes the ledger with the user's starting amount and goals; guides the first expense registration | [`CONTRIBUTING.md`](CONTRIBUTING.md) (the "Support" section) |
| 💻 **Build / developer** | Maintains the shared ledger and the catalogue | Edits `app.js`, the per-activity data, and the catalogue-first home (see [`doc/en/spec.md`](doc/en/spec.md) §§6–7) | [`CLAUDE.md`](CLAUDE.md) |

See [`doc/en/roles.md`](doc/en/roles.md) for the full role description
and the trio-vs-pair-vs-sole patterns across the apps of the suite.

---

## 📚 Project documentation (bilingual)

All project documentation lives in the `doc/` folder plus a few files
at the repository root:

| Language | Entry point |
|---|---|
| 🇬🇧 English (this file) | [`README.md`](README.md) |
| 🇪🇸 Español | [`README.es.md`](README.es.md) |

| Topic | Document |
|---|---|
| Product, audience, accessibility rules | [`doc/en/spec.md`](doc/en/spec.md) · [`doc/es/spec.md`](doc/es/spec.md) |
| Architecture, data schema and technical reference | [`doc/en/technical.md`](doc/en/technical.md) · [`doc/es/tecnico.md`](doc/es/tecnico.md) |
| Multilingual architecture + recipe to add a language | [`doc/en/i18n.md`](doc/en/i18n.md) · [`doc/es/i18n.md`](doc/es/i18n.md) |
| **v2 home (catalogue-first home + cards)** | [`doc/en/spec.md`](doc/en/spec.md) §§6–7 · [`doc/en/activities.md`](doc/en/activities.md) |
| Activities catalogue (themes, agents, mechanics) | [`doc/en/activities.md`](doc/en/activities.md) · [`doc/es/actividades.md`](doc/es/actividades.md) |
| Visual redesign roadmap (shipped in v1.1) | [`TODO.md`](TODO.md) · [`TODO.es.md`](TODO.es.md) |
| AI agent operational workflow | [`CLAUDE.md`](CLAUDE.md) |

### 📄 Other repo documents

| Document | Audience |
|---|---|
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | Anyone who wants to contribute (family, therapists, devs) |
| `CLAUDE.md` | AI agents: operational workflow, coordination and approvals |
| [`CLOUDFLARE.md`](CLOUDFLARE.md) | Canonical Cloudflare Workers deploy guide for the suite (Okeymoney + Apptonomia + Calculia, Memofun, Sinonimia, Teclatlon) |
| Project history | Lives in `git log`; no external roadmap is maintained |
| `doc/en/i18n.md` / `doc/es/i18n.md` | Details of the ES/EN multilanguage system |

---

## 🛠️ Preparing / Expanding content

Okeymoney grows by adding **practice activities** under
`tools/<slug>/` and by adding **categories / goals / screens** to the
shared ledger. Each change must respect the **single-ledger
invariant**: My Money, My Goals and Record an Expense all read and
write the same `okeymoney:data` ledger — do not split it, do not
introduce a `site/` + `tools/<slug>/` shell like Apptonomia/Calculia,
and do not let activities in `tools/<slug>/` read each other's storage
(see [`doc/en/technical.md`](doc/en/technical.md) §2 for the rationale).

To add a new practice activity:

1. Create `tools/<slug>/` with `index.html`, `app.js`, `strings.es.js`,
   `strings.en.js` (and `data.js` if the activity needs preset data).
2. Register the slug in root `DATA.activities` (`data.js`) with a valid
   `unitId` and its theme. The home generates the card automatically.
3. Register the slug in `manifest.json` for the install prompt (if it
   has its own icon) and in the `tools/INDEX` if there is one.
4. Bump `VERSION` in `sw.js` (e.g. `okeymoney-vN` → `okeymoney-vN+1`).

To add a simulation, register an entry in `DATA.simulations` with an
`id`, `unitId`, group, i18n keys and action. Touch `app.js` only when
the mechanic is new.

To expand the **shared ledger** (a new category, a new screen, a new
goal default), edit the schema in
[`doc/en/technical.md`](doc/en/technical.md) §2 and the matching
strings in `strings.<locale>.js` — the shared-state contract must
stay coherent across the three consumers.

---

## ✅ Validating changes

```bash
node scripts/check.js
```

No `npm install` needed — the script only uses Node's standard library.
It checks JS syntax, es/en key parity between `strings.es.js` and
`strings.en.js` (root app and `legal/`), that every `sw.js` `FILES`
path exists on disk, that `manifest.json` icons exist on disk, that
every quoted CSP source expression in `_headers` is well-formed
(`'self'`, not `''self''`), and that every `data-i18n*` /
`App.i18n.t('key')` reference in markup/JS resolves to a key actually
registered in both locales. The same script runs on every push and PR
via [`.github/workflows/validate.yml`](.github/workflows/validate.yml).

If you touched any file listed in `sw.js` `FILES`, also bump
`VERSION` in `sw.js`.

---

## ☁️ Deploying

Okeymoney is a fully static site (HTML/CSS/JS, no build step), so it
ships directly to **[Cloudflare Workers (static assets)](https://developers.cloudflare.com/workers/static-assets/)**
through its built-in GitHub integration. The HTTP security headers
live in [`_headers`](_headers), the offline fallback in
[`offline.html`](offline.html), and the project metadata in
[`wrangler.toml`](wrangler.toml). See [`CLOUDFLARE.md`](CLOUDFLARE.md)
for the full runbook (rebuild, rollback, custom domain, credential
rotation).

Pull requests automatically get a preview URL on
`*.<account-subdomain>.workers.dev` — no extra workflow is needed.

---

## 🛡️ Security

Okeymoney is a fully client-side static site: no backend, no database,
no telemetry, no third-party runtime. The threat model is essentially
"what a hostile offline page could do to the same origin", which the
browser already sandboxes. See [`SECURITY.md`](SECURITY.md) (or
[`SECURITY.es.md`](SECURITY.es.md)) for how to report a suspected
issue privately.

---

## 📄 License

MIT — see [`LICENSE`](LICENSE).

---

## 🧹 Housekeeping

There is no `node_modules`, no build artifacts, and no cache directory
in this repo. To clean the local PWA cache during development,
unregister the service worker from DevTools (`Application → Service
workers → Unregister`) and clear site data.

The `scripts/` directory holds two helpers worth knowing:
[`scripts/check-version-bump.js`](scripts/check-version-bump.js) (runs
in CI, catches missed `VERSION` bumps on cached files) and
[`scripts/serve.js`](scripts/serve.js) (a tiny local static server
that mimics Cloudflare's behaviour for previews).

---

## 🙏 Credits

Okeymoney's **shared-ledger** data model follows Teclatlon (an app of the suite
project in the suite): one `localStorage` ledger read and written by
every flow that touches the balance, goals or wallet, so they always
stay coherent — see [`doc/en/technical.md`](doc/en/technical.md) §2
for the rationale and the schema.

The **catalogue-first home** presents five short units and a euro-
simulation catalogue. Activities retain three themes as metadata. Its
navigation and scope are in [`doc/en/spec.md`](doc/en/spec.md) §§6–7;
the catalogue and its expansion contract are in
[`doc/en/activities.md`](doc/en/activities.md).

---

## 🌐 The Miralante suite — projects in the suite

Okeymoney is one of **six apps** in the **Miralante** suite, sharing
the same author, the same accessibility-first / no-backend philosophy
and the same deploy story. Apptonomia, on top of being an app itself,
also acts as the **landing portal** that introduces the whole suite.
None of the seven repos is the "main" one — they are peers; this is
just the original product this group grew out of.

| Project | What it is | Repository |
|---|---|---|
| **Apptonomia** *(portal — landing only, no app)* | Landing page that introduces the Miralante suite (not a runtime app) | [github.com/miralante/apptonomia](https://github.com/miralante/apptonomia) |
| [Calculia](https://calculia.apptonomia.uk/) | Math and logical reasoning | [github.com/miralante/calculia](https://github.com/miralante/calculia) |
| [Memofun](https://memofun.apptonomia.uk/) | Flashcards built around meaningful learning | [github.com/miralante/memofun](https://github.com/miralante/memofun) |
| [Okeymoney](https://okeymoney.apptonomia.uk/) | Personal finance and everyday autonomy | [github.com/miralante/okeymoney](https://github.com/miralante/okeymoney) |
| [Routime](https://routime.apptonomia.uk/) | Activities for routines and daily-life skills | [github.com/miralante/routime](https://github.com/miralante/routime) |
| [Sinonimia](https://sinonimia.apptonomia.uk/) | Easy-read dictionary | [github.com/miralante/sinonimia](https://github.com/miralante/sinonimia) |
| [Teclatlon](https://teclatlon.apptonomia.uk/) | Touch-typing with a physical keyboard | [github.com/miralante/teclatlon](https://github.com/miralante/teclatlon) |

The canonical Cloudflare / deploy guide for the group lives in
[Apptonomia's `CLOUDFLARE.md`](https://github.com/miralante/apptonomia/blob/master/CLOUDFLARE.md).
This repo uses the **Workers + static assets** model (`wrangler.toml`
+ `[assets]`), which is a different shape than Apptonomia/Teclatlon's
classic Pages model — see [`CLOUDFLARE.md`](CLOUDFLARE.md) for the
local runbook.

## More about this project

- [About this project](https://okeymoney.apptonomia.uk/about/)
