# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working
with code in this repository.

## What this is

Okeymoney is a static, dependency-free web app that teaches personal
finance and everyday autonomy to people with intellectual or
developmental disabilities: a shared-state dashboard (balance), a
savings-goals tracker, and a step-by-step "register an expense" wizard.
See [`doc/en/SPEC.md`](doc/en/SPEC.md) (or [`doc/es/SPEC.md`](doc/es/SPEC.md))
for the full product definition — audience, accessibility rules and
non-negotiable principles — and
[`doc/en/technical.md`](doc/en/technical.md) (or
[`doc/es/tecnico.md`](doc/es/tecnico.md)) for architecture and the data
schema.

Okeymoney is a sibling of Apptonomia, Calculia and Teclatlon (same
author, same accessibility-first static-PWA stack) but is architecturally
closer to Teclatlon: **one single-purpose app**, not a catalog of
isolated activities. `index.html` is the app itself; `app.js` is one IIFE
holding every screen (three tabs + a step-by-step wizard) over one shared
ledger in `localStorage`. Do not introduce a `site/` + `tools/<slug>/`
split like Apptonomia/Calculia — Mi dinero, Mis metas and Registrar un
gasto must keep reading and writing the same state (see `technical.md`
§2 for why).

## Commands

There is no build step, no package.json, and no test framework — it's
plain HTML/CSS/JS served as static files.

- **Preview**: open `index.html` directly in a browser, or serve the
  folder with any static server (e.g. `npx serve .`). Everything runs
  client-side.
- **Validate everything** (this repo's only "test" step, and what CI
  runs on every PR via `.github/workflows/validate.yml`):
  ```
  node scripts/check.js
  ```
  It checks JS syntax, es/en key parity between `strings.es.js` and
  `strings.en.js` (root app and `legal/`), that every `sw.js` `ARCHIVOS`
  path exists on disk, and that `manifest.json` icons exist. Read the
  script before changing the file layout — it encodes the invariants
  that layout relies on.

## Architecture

**See [`doc/en/technical.md`](doc/en/technical.md) for the full
technical reference** — file-by-file breakdown, the `localStorage` data
schema (one shared `okeymoney:data` ledger: `initialBalanceCents`,
`movements[]`, `goals[]`, all amounts in integer cents), and the
reusable amount-entry wizard component (`renderAmountStep` in `app.js`)
that every flow asking for a price is built from.

## Product change policy

Any change to product content (categories, screen copy, goal icons) must
be applied to **both** `es` and `en` — `es` is the default and source of
truth. Never ship a product change in only one language.
`scripts/check.js` enforces key parity but not translation quality —
proofread both.

## Agent workflow

Read the affected source files before editing. Update the canonical doc
for the topic (`doc/en/SPEC.md` for product/accessibility rules,
`doc/en/technical.md` for architecture and the data schema — plus their
`doc/es/` mirrors), not a copy in this file. Keep changes minimal and
on-target; note deliberate v1 simplifications (SPEC.md §7) before
"fixing" something that was cut on purpose.

Before finishing:
1. Run `node scripts/check.js`.
2. If you touched `index.html`, `styles.css`, `sw.js`, or added assets,
   bump `VERSION` in `sw.js` and add new files to `ARCHIVOS`.
3. Report only verifications you actually ran; flag remaining manual
   tests (e.g. a real browser walk through a wizard, or a WebKit check).

A deploy (even to a preview channel) is a network operation: ask before
running one. Never push or open/close external resources without
explicit request or authorization.
