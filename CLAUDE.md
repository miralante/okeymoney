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
author, same accessibility-first static-PWA stack). The **data layer**
follows Teclatlon: one shared `localStorage` ledger
(`okeymoney:data` + `okeymoney:practiceWallet`) read and written by
Mi dinero, Mis metas and Registrar un gasto in lock-step, so the
balance, the goals and the practice wallet always stay coherent. Do
not split that ledger, do not introduce a `site/` + `tools/<slug>/`
shell like Apptonomia/Calculia, and do not let activities in
`tools/<slug>/` read each other's storage — see `technical.md` §2 for
why.

The **navigation model**, however, follows Apptonomia in v2: the home
screen is stratified into three large blocks — didactic learning, tests
that reward Tokens, and euro simulations. The test block exposes the
practice activities as a catalogue (three themed sections: Conceptos
básicos / Vida cotidiana / Seguridad), while Mi dinero and Mis metas live
as simulation cards on the same screen instead of separate tabs. This inversion of the v1
"one single-purpose app, not a catalog" rule is intentional and
scoped to the navigation model — the data-model rule above is
untouched. The rationale, phases, and what does / does not change are
captured in [`doc/en/PRODUCT-DESIGN.md`](doc/en/PRODUCT-DESIGN.md)
(and its [`doc/es/PRODUCT-DESIGN.md`](doc/es/PRODUCT-DESIGN.md)
mirror). Read it before touching `index.html`, `app.js`, or the tab
bar.

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
  `strings.en.js` (root app and `legal/`), that every `sw.js` `FILES`
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

## Language policy

- **UI**: multilingual. Default locales are **Spanish (`es`)** and
  **English (`en`)**; `es` is the default and fallback when a key is
  missing or the detected locale is unsupported. UI text lives in
  `strings.<locale>.js` files (root app and `legal/`).
- **Technical code**: **always English** — variables, functions,
  identifiers, comments, and commit messages. Dictionary **keys** are
  code and must be English. UI copy lives in `strings.<locale>.js`,
  never hardcoded in `app.js` or `index.html`.
- **Product changes apply to all locales by default**: any change to
  product content (categories, screen copy, goal icons, accessibility
  labels, etc.) **must be applied to every supported locale** — at
  minimum `es` and `en`. Spanish (`es`) is the source of truth when
  not dictated otherwise; English (`en`) must keep parity. If a new
  locale is added, the same change applies there too. Never ship a
  product change that exists only in one language.
- **Self-test**: change the `es` file, then mirror in the `en` file
  before opening the PR. `scripts/check.js` enforces key parity but
  not translation quality — proofread both.
- Full reference (App.i18n core, number/time formatting, landing
  selector, recipe to add a third language):
  [`doc/en/I18N.md`](doc/en/I18N.md) ·
  [`doc/es/I18N.md`](doc/es/I18N.md).

## graphify

This project has a knowledge graph at `graphify-out/` with god nodes, community structure, and cross-file relationships.

- For codebase questions, first run `graphify query "<question>"` when `graphify-out/graph.json` exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than `GRAPH_REPORT.md` or raw grep output.
- If `graphify-out/wiki/index.md` exists, use it for broad navigation instead of raw source browsing.
- Read `graphify-out/GRAPH_REPORT.md` only for broad architecture review or when `query`/`path`/`explain` do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

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
   bump `VERSION` in `sw.js` and add new files to `FILES`.
3. Report only verifications you actually ran; flag remaining manual
   tests (e.g. a real browser walk through a wizard, or a WebKit check).

A deploy (even to a preview channel) is a network operation: ask before
running one. Never push or open/close external resources without
explicit request or authorization.

## UNE 153101 reference (suite-wide)

All seven sibling projects follow **UNE 153101:2018 EX** (Spanish
easy-read standard) and Inclusion Europe's European easy-read
guidelines as the normative basis for the cognitive accessibility
principles that guide content and UI: short sentences, one idea per
sentence, everyday vocabulary, no clinical or technical jargon in
what the end user reads. This is the standard each `SPEC.md` cites
when it states the "easy read always" rule (see `doc/en/SPEC.md` §3.3
or its mirror in `doc/es/SPEC.md` §3.3). Adding a new language or a
new piece of UI copy means following UNE 153101 — not paraphrasing
it.

## WCAG AAA baseline (suite-wide)

This project is the suite's reference for WCAG contrast: its
single-light-theme palette is already verified at AAA for the main
text pairs (`#F2F4F8` on `#161A21` = 14.6:1, `#B7BDC9` on `#161A21`
= 8.4:1 — see `TODO.md` / `TODO.es.md`). It conforms to WCAG 2.1 at
**AA minimum** and adopts the **AAA criteria that apply to the suite's
audience** whenever feasible.

Full conformance at AAA is not feasible for a whole web application
(the W3C itself states AAA is meant for specific contexts); the rule
below lists the AAA criteria that ARE applicable and that this project
honours.

Adopted AAA criteria:

- **1.4.6 Contrast (Enhanced)** — text contrast ≥ 7:1 (large text
  ≥ 4.5:1). WCAG AA (4.5:1) is the legal floor; AAA is the design
  target. Already met by the main text pairs above. When adding new
  tokens to `assets/css/tokens.css`, follow the same floor.
- **3.1.5 Reading Level** — content for the general public does not
  require advanced reading ability. Already complied with through
  UNE 153101 (see the section above) and Inclusion Europe's easy-read
  guidelines.
- **1.4.1 Use of Color** — color is never the only means of conveying
  information. Every feedback state (success / hint / error / lock)
  also uses shape, icon, text or sound, so users with color-vision
  deficiencies are not excluded.

The product-facing wording in `doc/en/SPEC.md` §3.5 / §5 (and the
Spanish mirror in `doc/es/SPEC.md`) already uses the literal phrase
**"WCAG AA minimum, AAA whenever possible"**; this section mirrors the
suite-wide rule in the metaproject's `apptonomia/CLAUDE.md`.

## Public-facing wording: "usuario/a tipo" euphemism

This directive applies across the entire Miralante suite (Apptonomia,
Calculia, Memofun, Okeymoney, Sinonimia, Teclatlon, Routime) and the
metaproject landing at `apptonomia.uk`. The suite's real objective is
occupational-therapy support for people with intellectual disability, but
**that framing is not used in public surfaces** — only in internal
documentation.

### Where each term is allowed

- **"Discapacidad intelectual" / "intellectual disability"** is the
  canonical term and **may only appear in internal documentation**
  (`CLAUDE.md`, `doc/<lang>/SPEC.md`, `technical.md` / `tecnico.md`,
  `roles.md`, `CONTRIBUTING.md`, `CONTRIBUTING.es.md`, tooling files
  in `scripts/`). It is explicitly **forbidden** in public-facing
  surfaces, READMEs that anyone can read without authentication, public
  talks, social media copy, press notes, and marketing material.
- **"Usuario/a tipo"** (plural "usuarios/as tipo") is the accepted
  euphemism for the audience in public-facing surfaces. It is used as
  a generic profile marker, not as a label for any real person.
  - It applies to `README.md` / `README.es.md`, public talks, social
    media copy, press notes, marketing material, and any
    contributor-facing document that also doubles as a public
    description of the project (e.g. `CONTRIBUTING.md`).
  - It does **not** apply to the UI of the app itself: the project's
    "zero mentions in the user-facing product" rule (see `SPEC.md`
    §3.3 / §4) continues to forbid **any** mention, including
    "usuario/a tipo", in `index.html`, `app.js`, `styles.css`,
    `strings.<locale>.js`, `legal/`, and any other user-facing surface.
    The euphemism is for the outside world, not for what the visitor
    reads on the site.
  - It does **not** apply to project content that names a clinical
    concept by its real-world name (e.g. an activity about a real
    bureaucratic procedure): that is content, not labelling of an
    audience.

### Rationale

Presenting the project's real objective in maintainer docs is useful
and necessary for whoever maintains and contributes to the suite.
Presenting it in marketing or landing surfaces is neither necessary nor
respectful of the audience — "usuario/a tipo" lets public material
describe what the app is for (who the typical profile is) without
publicly naming a clinical group. This rule is mirrored in the
metaproject's `apptonomia/CLAUDE.md` and in every sibling's own
`CLAUDE.md` and `SPEC.md` so it survives a single project's docs going
out of sync.
