# Okeymoney 💰

> 🌐 **Other languages:** [Español](README.es.md)
>
> 🚀 **Try it live:** [okeymoney.apptonomia.uk](https://okeymoney.apptonomia.uk/)

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![No dependencies](https://img.shields.io/badge/dependencies-none-success.svg)](#-features)
[![Static site](https://img.shields.io/badge/build-none-informational.svg)](#-quick-start)
[![PWA](https://img.shields.io/badge/PWA-installable-5A0FC8.svg)](manifest.json)
[![i18n](https://img.shields.io/badge/i18n-es%20%7C%20en-yellow.svg)](#-documentation)
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

Okeymoney is a **single shared-state app**: Mi dinero, Mis metas and
Registrar un gasto read and write the same `localStorage` ledger
(`okeymoney:data` + `okeymoney:practiceWallet`), so the balance,
goals and practice wallet always stay coherent.

- 💼 **Mi dinero** — a shared-state balance dashboard (one amount,
  used everywhere).
- 🎯 **Mis metas** — savings-goals tracker with progress per goal.
- 🧾 **Registrar un gasto** — step-by-step wizard with category,
  amount, and payment method.
- 🛒 **Practice activities** — a catalogue of activities themed by
  Conceptos básicos / Vida cotidiana / Seguridad, each building real
  autonomy (change-back, what-do-I-need, where-to-store, etc.).
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
| 💻 **Build / developer** | Maintains the shared ledger and the catalogue | Edits `app.js`, the per-activity data, and the catalogue-first home (see [`doc/en/PRODUCT-DESIGN.md`](doc/en/PRODUCT-DESIGN.md)) | [`CLAUDE.md`](CLAUDE.md) |

For the full role description in context (with the rest of the
sibling suite), see [`CLAUDE.md`](CLAUDE.md).

---

## 📚 Project documentation (bilingual)

| Language | Entry point |
|---|---|
| 🇬🇧 English (this file) | [`README.md`](README.md) |
| 🇪🇸 Español | [`README.es.md`](README.es.md) |

| Topic | Document |
|---|---|
| Product, audience, accessibility rules | [`doc/en/SPEC.md`](doc/en/SPEC.md) · [`doc/es/SPEC.md`](doc/es/SPEC.md) |
| Architecture, data schema and technical reference | [`doc/en/technical.md`](doc/en/technical.md) · [`doc/es/tecnico.md`](doc/es/tecnico.md) |
| Multilingual architecture + recipe to add a language | [`doc/en/I18N.md`](doc/en/I18N.md) · [`doc/es/I18N.md`](doc/es/I18N.md) |
| **v2 home redesign (catalogue-first home + cards)** | [`doc/en/PRODUCT-DESIGN.md`](doc/en/PRODUCT-DESIGN.md) · [`doc/es/PRODUCT-DESIGN.md`](doc/es/PRODUCT-DESIGN.md) |
| Activities catalogue (themes, agents, mechanics) | [`doc/en/activities.md`](doc/en/activities.md) · [`doc/es/actividades.md`](doc/es/actividades.md) |
| Visual redesign roadmap (shipped in v1.1) | [`TODO.md`](TODO.md) · [`TODO.es.md`](TODO.es.md) |
| AI agent operational workflow | [`CLAUDE.md`](CLAUDE.md) |

Project history lives in `git log`; no external roadmap is maintained.

---

## 🛠️ Preparing / Expanding content

Okeymoney grows by adding **practice activities** under
`tools/<slug>/` and by adding **categories / goals / screens** to the
shared ledger. Each change must respect the **single-ledger
invariant**: Mi dinero, Mis metas and Registrar un gasto all read and
write the same `okeymoney:data` ledger — do not split it, do not
introduce a `site/` + `tools/<slug>/` shell like Apptonomia/Calculia,
and do not let activities in `tools/<slug>/` read each other's storage
(see [`doc/en/technical.md`](doc/en/technical.md) §2 for the rationale).

To add a new practice activity:

1. Create `tools/<slug>/` with `index.html`, `app.js`, `strings.es.js`,
   `strings.en.js` (and `data.js` if the activity needs preset data).
2. Add the slug to the home catalogue in `index.html` (under the right
   themed section: Conceptos básicos / Vida cotidiana / Seguridad).
3. Register the slug in `manifest.json` for the install prompt (if it
   has its own icon) and in the `tools/INDEX` if there is one.
4. Bump `VERSION` in `sw.js` (e.g. `okeymoney-vN` → `okeymoney-vN+1`).

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
through its built-in GitHub integration — there is no custom GitHub
Actions workflow. The HTTP security headers live in
[`_headers`](_headers), the offline fallback in
[`offline.html`](offline.html), and the project metadata in
[`wrangler.toml`](wrangler.toml). See [`CLOUDFLARE.md`](CLOUDFLARE.md)
for the full runbook (rebuild, rollback, custom domain, credential
rotation).

Pull requests automatically get a preview URL — no extra workflow is
needed.

---

## 🤝 Contributing

Issues and pull requests are welcome. See [`CONTRIBUTING.md`](CONTRIBUTING.md)
for the workflow (and [`CONTRIBUTING.es.md`](CONTRIBUTING.es.md) for the
Spanish version). All participants are expected to follow
[`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).

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

Okeymoney's **shared-ledger** data model follows Teclatlon (a sibling
project in the suite): one `localStorage` ledger read and written by
every flow that touches the balance, goals or wallet, so they always
stay coherent — see [`doc/en/technical.md`](doc/en/technical.md) §2
for the rationale and the schema.

The **catalogue-first home** (three themed sections: Conceptos
básicos / Vida cotidiana / Seguridad) was redesigned in v2 — the
rationale, phases, and what does / does not change are captured in
[`doc/en/PRODUCT-DESIGN.md`](doc/en/PRODUCT-DESIGN.md) (and its
Spanish mirror [`doc/es/PRODUCT-DESIGN.md`](doc/es/PRODUCT-DESIGN.md)).

---

## 🧩 Sibling projects

This project is one of a small group of sibling projects that share
the same author, the same accessibility-first / no-backend philosophy
and the same Cloudflare deploy story. **Apptonomia is the main project**;
the others (Calculia, Okeymoney, Sinonimia, Teclatlon, Routime) were
spun out of it or built next to it on the same stack.

| Project | What it is | Repository |
|---|---|---|
| **Apptonomia** *(main)* | Activities for routines and daily-life skills (designed for our typical user profile) | [github.com/miralante/apptonomia](https://github.com/miralante/apptonomia) |
| Calculia | Math and logical reasoning | [github.com/miralante/calculia](https://github.com/miralante/calculia) |
| Memofun | Flashcards built around meaningful learning | [github.com/miralante/memofun](https://github.com/miralante/memofun) |
| Okeymoney | Personal finance and everyday autonomy | [github.com/miralante/okeymoney](https://github.com/miralante/okeymoney) |
| Routime | Activities for routines and daily-life skills | [github.com/miralante/routime](https://github.com/miralante/routime) |
| Sinonimia | Easy-read dictionary | [github.com/miralante/sinonimia](https://github.com/miralante/sinonimia) |
| Teclatlon | Touch-typing with a physical keyboard | [github.com/miralante/teclatlon](https://github.com/miralante/teclatlon) |

The canonical Cloudflare / deploy guide for the group lives in
[Apptonomia's `CLOUDFLARE.md`](https://github.com/miralante/apptonomia/blob/master/CLOUDFLARE.md).
This repo uses the **Workers + static assets** model (`wrangler.toml`
+ `[assets]`), which is a different shape than Apptonomia/Teclatlon's
classic Pages model — see [`CLOUDFLARE.md`](CLOUDFLARE.md) for the
local runbook.
