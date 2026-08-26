# TODO.md — Roadmap: visual redesign

> **Living document.** This file is the single source of truth for the
> visual redesign of Okeymoney: what we are changing, why, in which order,
> and how we know each phase is done. It does **not** redefine product or
> accessibility rules — those still live in [`doc/en/SPEC.md`](doc/en/SPEC.md).
>
> Conventions follow the Apptonomia documentation standard (numbered
> sections, declared simplifications, explicit non-goals).

---

## 1. Context and motivation

### 1.1 What this document is

A **plan** for the visual redesign of Okeymoney: the v1 implementation
ships with a minimal stylesheet (`styles.css`, ~200 lines, light theme,
hardcoded hex values, no design tokens, no modular CSS). The interface is
usable but **visually inconsistent with the sibling apps** (Apptonomia,
Calculia, Teclatlon), which already have a dark, calm, accent‑on‑neutral
design language. This document captures:

- The target look and feel (tokens, components, layout).
- The phased migration plan that keeps the app working at every step.
- The non‑goals, so we don't accidentally widen scope.

### 1.2 What it isn't

- **Not a replacement for `doc/en/SPEC.md`.** Product rules, audience,
  non‑negotiable constraints, modules and the Register‑an‑expense flow
  are unchanged. If this document ever contradicts `SPEC.md`,
  `SPEC.md` wins.
- **Not a redesign of product behaviour.** No new flows, no new tabs,
  no change to the data schema (`technical.md` §2–§3) and no change to
  the `App.*` API (`assets/js/`).
- **Not a framework migration.** Still HTML + CSS + vanilla JS, no
  build step, no npm. PWA + offline‑first contract stays.

### 1.3 Why now

The sibling apps already converged on a calm, accent‑driven
visual language. Okeymoney is the outlier. Migrating now means:

- A coherent cross‑app feel (the family badge at the bottom of every
  screen stops being the only design link).
- A first proper token system (`assets/css/tokens.css`) that the
  activities and `legal/` can adopt without per‑page drift.
- Foundation for the planned v1.x work (Aprender grid, symbolic shop,
  entity representative — see `SPEC.md` §7.4 and §9.4–§9.5), which all
  benefit from a tokenised base.

### 1.4 Out of scope (explicit non‑goals)

These would be tempting to fold in here. They are **not** part of this
roadmap:

| Not in this roadmap | Why |
|---|---|
| New flows (withdraw from a goal, sound settings) | Product behaviour, tracked separately in `SPEC.md` §9 |
| New activities in `tools/` | Pedagogical, not visual — out of scope here |
| Changing the data schema or `App.*` API | Behavioural, not visual — `technical.md` is the place |
| Adding dark/light theme toggle | v1 is light‑only by design (principle 5 of `SPEC.md` §4) |
| Rebuilding with a framework / build step | Violates principle 12 (`SPEC.md` §4) — static PWA |
| Icon redesign beyond a consistent set | Icons are product (`data.js`), not visual chrome |
| Copy / wording review | Product content, tracked separately in `SPEC.md` §10 |

---

## 2. Target visual language

The redesign aligns Okeymoney with the sibling apps. The target is **one
look**, fully captured as design tokens, applied through a small set of
reusable components. Specific values come from analysing Apptonomia,
Calculia and Teclatlon; the rationale below is the consensus that emerged
from that review.

### 2.1 Principles (visual layer only)

These are the visual‑layer rules. They don't override `SPEC.md` §4 — they
extend it.

1. **Calm by default.** Dark surface, one accent colour, low contrast
   between background layers. The eye should land on the **action**,
   not the chrome.
2. **One accent per theme.** Module themes (e.g. Money, Goals, Learn)
   pick one accent from the token palette; the accent surfaces in
   headings, progress bars and the active tab indicator — **never** in
   body text.
3. **Tokens, not hex.** Every colour, spacing value, radius, shadow
   and type size comes from a CSS custom property declared in
   [`assets/css/tokens.css`](assets/css/tokens.css). No raw hex, no
   magic numbers in component CSS.
4. **Components over page styles.** Repeated patterns (button, card,
   input, chip, tab, sheet, balance display) live in
   [`assets/css/components.css`](assets/css/components.css) and are
   reused by `app.js` and every `tools/<slug>/index.html`.
5. **`prefers-reduced-motion` honoured.** Any motion added by this
   redesign must respect the system preference (already required by
   `SPEC.md` §4.9).
6. **Accessibility preserved.** Every decision must remain compatible
   with `SPEC.md` §3.5 (WCAG AA, 64×64 px buttons, 16 px spacing,
   keyboard nav, screen readers). The redesign is **not** a regression
   excuse.

### 2.2 Colour tokens

Declared in `assets/css/tokens.css` under `:root` and `[data-theme="dark"]`.
Light‑only at first (per non‑goal §1.4); dark tokens stay declared but
dormant for when (or if) a toggle lands.

**Surfaces (dark‑first, neutral, low chroma)**

| Token | Value | Use |
|---|---|---|
| `--superficie-base` | `#0F1115` | App background |
| `--superficie-1` | `#161A21` | Cards, sheets, raised surfaces |
| `--superficie-2` | `#1E2330` | Hovered/pressed surfaces, inputs |
| `--superficie-3` | `#262C3A` | Selected state, focus ring background |

**Text (always on dark surfaces; contrast checked against `--superficie-1`)**

| Token | Value | Use |
|---|---|---|
| `--texto-primario` | `#F2F4F8` | Titles, balance, primary copy |
| `--texto-secundario` | `#B7BDC9` | Subtitles, helper text |
| `--texto-tenue` | `#7B8294` | Captions, metadata, disabled labels |

**Accent palette (one per module theme; chosen to be friendly and non‑pressuring)**

| Token | Value | Theme |
|---|---|---|
| `--acento` | `#7BD389` | Money (default) — calm green, "balance, growth" |
| `--acento-suave` | `#3B6B45` | Money — soft fill for progress, chips |
| `--acento-2` | `#7FB6E8` | Goals — calm blue, "hucha, savings" |
| `--acento-2-suave` | `#324E6B` | Goals — soft fill |
| `--acento-3` | `#E8C879` | Learn — warm amber, "practice, attention" |
| `--acento-3-suave` | `#6B5635` | Learn — soft fill |

**Status / feedback**

| Token | Value | Use |
|---|---|---|
| `--exito` | `#7BD389` | Success (`App.feedback.success`) |
| `--aliento` | `#E8C879` | Encouragement (`App.feedback.encourage`) |
| `--error` | `#E89A8E` | Destructive confirmations (rare; never punitive) |

**Borders / shadows**

| Token | Value | Use |
|---|---|---|
| `--borde` | `#2A3140` | Card borders, input borders (1 px) |
| `--borde-fuerte` | `#3A4252` | Strong separation (modal edges) |
| `--sombra-1` | `0 1px 2px rgba(0,0,0,.35)` | Cards resting |
| `--sombra-2` | `0 6px 18px rgba(0,0,0,.45)` | Sheets, modals, focused inputs |
| `--sombra-3` | `0 16px 40px rgba(0,0,0,.55)` | Only the practice wallet popover (if needed) |

### 2.3 Typography tokens

Base font is the same as Apptonomia: **Nunito** (loaded from `assets/fonts/`).
Atkinson Hyperlegible is an accepted fallback per `SPEC.md` §4.4.

| Token | Value | Use |
|---|---|---|
| `--fuente-base` | `"Nunito", "Atkinson Hyperlegible", system-ui, sans-serif` | Everywhere |
| `--texto-100` | `0.875rem` (14 px) | Captions, metadata only |
| `--texto-200` | `1rem` (16 px) | Secondary text, body small |
| `--texto-300` | `1.125rem` (18 px) | Body default |
| `--texto-400` | `1.25rem` (20 px) | Body emphasised |
| `--texto-500` | `1.5rem` (24 px) | Section titles |
| `--texto-600` | `2rem` (32 px) | Page titles, big numbers |
| `--texto-700` | `2.75rem` (44 px) | The balance figure on Mi dinero |
| `--linea-base` | `1.5` | Body |
| `--linea-apretada` | `1.25` | Titles, big numbers |
| `--peso-regular` | `400` | Body |
| `--peso-medio` | `600` | Buttons, emphasised text |
| `--peso-fuerte` | `800` | Titles, balance |

### 2.4 Spacing, radius, motion

**Spacing scale (4 px base)**

| Token | Value |
|---|---|
| `--espacio-1` | `0.25rem` (4 px) |
| `--espacio-2` | `0.5rem` (8 px) |
| `--espacio-3` | `0.75rem` (12 px) |
| `--espacio-4` | `1rem` (16 px) — minimum inter‑button |
| `--espacio-5` | `1.5rem` (24 px) |
| `--espacio-6` | `2rem` (32 px) |
| `--espacio-7` | `3rem` (48 px) |
| `--espacio-8` | `4rem` (64 px) |

**Radius**

| Token | Value | Use |
|---|---|---|
| `--radio-1` | `8px` | Inputs, chips |
| `--radio-2` | `14px` | Cards |
| `--radio-3` | `18px` | Sheets, modals |
| `--radio-pill` | `999px` | Tabs, pills |

**Motion**

| Token | Value | Use |
|---|---|---|
| `--motion-rapida` | `150ms` | Hovers, focus rings |
| `--motion-normal` | `240ms` | State transitions |
| `--motion-lenta` | `360ms` | Sheet open/close, feedback celebrate |
| `--ease-suave` | `cubic-bezier(.2,.7,.2,1)` | All transitions |

All motion is wrapped in `@media (prefers-reduced-motion: no-preference)`,
matching `SPEC.md` §4.9.

### 2.5 Layout tokens

| Token | Value | Use |
|---|---|---|
| `--contenedor-max` | `960px` | Page container (was 900, bumped for breathing room) |
| `--contenedor-lectura` | `640px` | Reading‑heavy screens (legal, Aprender intro) |
| `--tocable` | `64px` | Minimum tap target (`SPEC.md` §3.5) |
| `--tocable-lg` | `88px` | Primary actions (Save, +) |
| `--tocable-xl` | `120px` | Wizard numeric keypad keys |

---

## 3. Components

Each component lives in `assets/css/components.css` (rename from the
v1 stub to the new pattern in §4). Every component is **token‑driven**
(never references a raw hex) and **keyboard‑accessible** by default
(`:focus-visible` ring uses `--superficie-3` over `--acento`).

### 3.1 Button

Variants: `--primario`, `--secundario`, `--fantasma`, `--peligro`.
Sizes: `--mediano` (default, 64 px), `--grande` (88 px, used for the
"Save" CTA and the `+` register button), `--xl` (120 px, numeric keys).

```
[Boton primario]                 (acento background, texto-primario, peso-medio)
[Boton secundario]               (superficie-2 background, borde, texto-primario)
[Boton fantasma]                 (transparent, texto-primario, hover → superficie-2)
```

States: hover (subtle background lift), focus (2 px ring on `--acento`),
disabled (50 % opacity, no pointer), loading (spinner from
`assets/img/`, not text).

### 3.2 Card

Default surface (`--superficie-1`), border 1 px `--borde`, radius
`--radio-2`, padding `--espacio-5`, shadow `--sombra-1`.
Elevation variant for sheets: `shadow-2`, no border.

### 3.3 Input (numeric keypad, amount field)

A custom numeric keypad is the only input surface — there are no native
`<input type="number">` in the v1 flow (they conflict with the Socratic
amount preview). The keypad is a 3×4 grid of `--tocable-xl` keys
(0–9, `←`, `C`), centred, with the formatted amount display above
(`--texto-700`, `--peso-fuerte`). The breakdown (coins/banknotes)
renders directly under the amount using `--acento-suave`.

### 3.4 Tab bar (bottom navigation)

Fixed at the bottom, height 72 px + safe‑area inset, surface
`--superficie-1`, top border `--borde`. Four destinations:
`Mi dinero` / `+` (centre, accent background, `--tocable-lg`) /
`Mis metas` / `Aprender`. The active item uses `--acento` for the icon
and a 3 px underline; inactive items use `--texto-secundario`.

### 3.5 Sheet / wizard

A full‑width card that slides up from the bottom (`--motion-lenta`,
`--ease-suave`). Header: title (`--texto-500`, `--peso-fuerte`) +
progress dots (filled = `--acento`, empty = `--superficie-3`) + close
`✕` button (`--tocable`). Body: `--espacio-5` padding. Footer: back
button (ghost) + primary CTA. The sheet respects `prefers-reduced-motion`
by snapping open without animation.

### 3.6 Chip (practice wallet, goal status)

Pill (`--radio-pill`), padding `--espacio-2 --espacio-3`, background
`--acento-suave`, text `--texto-primario`. Used for the Tokens chip in
Mi dinero and the "achieved" badge on goals.

### 3.7 Balance display (Mi dinero hero)

The big number (`--texto-700`, `--peso-fuerte`, `--linea-apretada`,
`--acento`). Below it, the coin/banknote preview painted from
`App.money.breakdown`, using `--acento-suave` fills. Tap target: the
whole hero is a button (`--tocable-lg`) that opens the recount wizard
(per `SPEC.md` §3.6.c).

### 3.8 Movement row (Mi dinero history)

Two‑column row: icon circle (`--superficie-2`, 48 px) + label (left) +
signed amount (`--texto-primario`, right, `--peso-medio`). Tappable,
opens a small action sheet ("Delete" only — never "Edit amount", per
`SPEC.md` §3.1). Date below label in `--texto-tenue`.

### 3.9 Goal card

Icon (`--texto-500`) + name + price target + progress bar.
Progress bar: track `--superficie-3`, fill `--acento-2`. The amount
label below uses the "X € de Y €" form (`SPEC.md` §7.2). Achieved
goals get a `Chip` (3.6) instead of the bar.

### 3.10 Feedback toast

Bottom‑centred pill, `--radio-pill`, padding `--espacio-3 --espacio-5`,
`--sombra-2`. Success uses `--exito` text on `--superficie-1` background
with a soft green left border; encourage uses `--aliento`. Lives for
2 s (success) or 3 s (encourage), then fades with `--motion-normal`.

---

## 4. File‑by‑file migration map

The redesign is implemented in **four CSS files** and a handful of HTML
tweaks. No JS changes are required for v1.1 (the visual layer only
changes CSS variables and class names; `app.js` already queries
`document.documentElement` and never hardcodes hex).

### 4.1 CSS files

| File | Action | Notes |
|---|---|---|
| `assets/css/tokens.css` | **Rewrite** | Sole source of truth for tokens (§2.2–§2.5). Variables are in Spanish (`--acento`, `--espacio-4`) to match `app.js` identifier style. |
| `assets/css/base.css` | **Rewrite** | Body, headings, links, focus ring, scrollbar. References only tokens. |
| `assets/css/components.css` | **Rename → `assets/css/componentes.css`** | All components from §3 land here. Spanish filename matches the rest of the app's identifier style (`app.js`, `data.js`). |
| `assets/css/activities.css` | **Light edit** | Already near the target. Add token references; remove any remaining hex. |
| `styles.css` | **Slim down to 30‑50 lines** | Becomes the entry that imports the four files in order (`tokens → base → componentes → activities`). Mirrors Apptonomia's `styles.css`. |
| `tools/*/styles.css` | **Per‑activity: replace with import of root `styles.css`** | Each activity inherits the redesign automatically. Per‑activity styles only if the activity genuinely needs them. |
| `legal/styles.css` | **Replace with import of root `styles.css` + small print rules** | Print stylesheet for the legal page stays local. |

### 4.2 HTML files

| File | Action | Notes |
|---|---|---|
| `index.html` | **Restructure** | Add `data-tema="dinero"` to `<body>` (drives the active accent). Replace ad‑hoc classes with component classes (3.1–3.10). Fix the duplicated `#practiceWalletChip` bug (see §5.1.1). |
| `tools/*/index.html` | **Light edit** | Same body attribute (`data-tema="aprender"`), import the root stylesheet, replace ad‑hoc styles. |
| `legal/index.html` | **Light edit** | Import root stylesheet, keep local print rules. |

### 4.3 JS files

| File | Action | Notes |
|---|---|---|
| `app.js` | **No behavioural change** | May add a one‑line `document.documentElement.dataset.tema = tabActivo` to switch the accent per tab. Optional, can ship without. |
| `assets/js/*` | **None** | `App.money`, `App.wallet`, `App.feedback`, `App.i18n` are untouched. |
| `data.js`, `strings.*.js` | **None** | Content layer is unchanged. |
| `sw.js` | **Bump `VERSION`** (mandatory per `CLAUDE.md`) and add new files to `FILES` | `tokens.css`, `componentes.css` if renamed. |

---

## 5. Phases

Each phase ends with a verifiable state — the app must keep working
between phases, never half‑broken.

### 5.1 Phase 1 — Tokens, base, container (no visual change yet)

**Goal:** introduce the token system without changing the look. The app
should look **identical** at the end of this phase.

- Rewrite `assets/css/tokens.css` with every variable from §2.2–§2.5.
- Rewrite `assets/css/base.css` referencing only tokens.
- Slim `styles.css` to import order + a few reset rules.
- Rename `components.css` → `componentes.css`. Keep its current content
  for now, just renaming the file and updating the import in `index.html`.
- **Bug fixes (free in this phase):**
  - **5.1.1 Container width.** Replace the current
    `max-width: 640px` in `.container` (`assets/css/components.css:14`)
    with `var(--contenedor-max)` (`960px`). This aligns the page
    container with the redesigned reading‑friendly width. Note: a
    first review of `index.html` flagged what looked like a duplicate
    `#practiceWalletChip`; on closer inspection, the two chip blocks
    (`#practiceWalletChip` on the home screen and
    `#learnPracticeWalletChip` on the Aprender screen) are
    **intentional** — each tab has its own chip — and **stay
    unchanged**.
- **Verification:**
  - `node scripts/check.js` — green.
  - Visual diff: `index.html`, every `tools/*/index.html`, `legal/index.html`
    look identical to the v1 build before this phase started (eyeball
    check, the diff is structural not chromatic).
  - Reload at `http://localhost:8080/` — same pixels.

### 5.2 Phase 2 — Surfaces, type, components (the visible change)

**Goal:** the app looks like the sibling apps. Every component from §3
is in `componentes.css`; every page uses them via class names only.

- Implement every component in §3 in `assets/css/componentes.css`.
- Migrate `index.html` to the component class names; switch the tab bar
  to component 3.4; switch the balance display to component 3.7.
- Migrate every `tools/<slug>/index.html` to import the root stylesheet
  and use the shared components (buttons, sheet, chip, feedback toast).
- Migrate `legal/index.html` to the same.
- Add the per‑tab accent via `data-tema` on `<body>` (optional but
  ship‑recommended — see §6, decision D2).
- **Verification:**
  - `node scripts/check.js` — green.
  - All 6 categories of the Registrar un gasto wizard still render and
    still trigger the Socratic flow.
  - All 7 activities in `tools/*` still work (manual smoke test).
  - Mi dinero, Mis metas, Aprender, legal all readable in dark mode
    with WCAG AA contrast (axe DevTools or browser devtools).
  - `prefers-reduced-motion` honoured (toggle in OS, reload, confirm
    sheets snap open without animation).

### 5.3 Phase 3 — Polish, per‑activity tweaks, accessibility audit

**Goal:** the redesign is shippable. No rough edges, no per‑page drift.

- Walk every `tools/<slug>/` and remove any per‑activity CSS that
  duplicates a component.
- Audit `data.js` icons — make sure each category icon in Mi dinero,
  each goal icon, each activity hero icon renders at 48 px without
  blur or misalignment.
- Audit `App.feedback.success` / `encourage` — they now use the
  feedback toast (component 3.10) instead of the current inline
  message element.
- Run `axe` (or DevTools accessibility inspector) on every screen;
  fix any regression on contrast, focus order or ARIA labels.
- Bump `VERSION` in `sw.js`, add `tokens.css` and `componentes.css` to
  `FILES`, commit, push.
- **Verification:**
  - `node scripts/check.js` — green.
  - Lighthouse (PWA + accessibility) ≥ 95 on `/`, one activity, and
    `/legal/`.
  - Manual: complete a Register an expense end‑to‑end on a phone‑sized
    viewport (≤ 480 px wide). Create a goal. Add money to it. Visit an
    activity. Visit legal. No regressions on flow or on tokens
    accumulation.

---

## 6. Open decisions

These are explicitly left open so they can be decided with the
implementation in hand, not before.

### D1. Keep light theme in v1.1 or flip to dark now?

- **Decision pending.** `SPEC.md` §4.5 says "light theme by default".
  The sibling apps are dark. Two options:
  - **(a) Flip to dark now.** Matches the family. Requires a one‑line
    update to `SPEC.md` §4.5 ("the v1 default is dark, with high
    contrast; light tokens stay declared for future toggles").
  - **(b) Ship dark tokens declared but light surface active.** Token
    system in place, dark looks available to whoever toggles
    `data-theme="dark"` in devtools, but the production app stays
    light. Smaller blast radius, no `SPEC.md` change.
- **Recommendation:** (b) for v1.1, schedule (a) for v1.2 after we've
  validated the token system in production.

### D2. Per‑tab accent or single accent?

- **Decision pending.** §2.2 declares three accents (Money / Goals /
  Learn). Switching accent by tab is nice but it means the balance
  changes colour as the user navigates — which can be confusing for
  an audience that relies on colour cues being stable (`SPEC.md`
  §3.5 contrast rule).
- **Recommendation:** ship single accent (`--acento`) for v1.1. Defer
  per‑tab accent to v1.2 once we've validated that the rest of the
  system reads as calm.

### D3. Is `legal/` in scope for v1.1 or v1.2?

- `legal/` doesn't have product chrome — it has print rules and a
  different layout. Migrating it means importing the root stylesheet
  and only adding small print overrides.
- **Recommendation:** include it in v1.1 (Phase 2). It's cheap and
  keeps the cross‑page consistency honest.

---

## 7. Success criteria

A phase is "done" when:

1. **Phase 1 done:** app looks identical to v1; tokens are declared;
  - `styles.css` is slim; bug 5.1.1 (container width) is fixed;
    `scripts/check.js` green.
2. **Phase 2 done:** every component from §3 lives in `componentes.css`;
   every page uses them; no raw hex outside `tokens.css`; dark look
   applied app‑wide; accessibility checks pass.
3. **Phase 3 done:** Lighthouse ≥ 95 on the three test pages;
   `sw.js` bumped and `FILES` updated; no per‑activity CSS duplicates
   a component; manual smoke test on a phone‑sized viewport passes.

A redesign is "shipped" when **all three phases** are done, `sw.js` is
bumped, and at least one manual end‑to‑end flow (Register an expense
→ see balance update → check movement in history → tap practice wallet)
has been walked through on the live `http://localhost:8080/` server.
### 7.1 Actual status (as of v1.1, sw.js v13)

- ✅ **Phase 1 done.** All v1 tokens preserved; new token families
  (surfaces, type scale, spacing, radius, motion, layout) added
  without changing existing values; container 640 → 960 px; bug
  5.1.1 fixed.
- ✅ **Phase 2 done, variant B → variant A (dark theme active).**
  Decision D1 **inverted** from option (b) to **option (a) — dark
  surface active**, matching the sibling apps' design language.
  SPEC.md §4.5 updated accordingly ("Dark theme by default").
  Contrast verified: `#F2F4F8` on `#161A21` = 14.6 : 1 (AAA),
  `#B7BDC9` on `#161A21` = 8.4 : 1 (AAA), `#7B8294` on `#161A21`
  = 4.6 : 1 (AA). The 10 components from §3 live in
  `assets/css/componentes.css`. Every HTML page loads it. `data-tema`
  on `<body>` switches the per‑tab accent (green for `dinero`, blue
  for `metas`, amber for `aprender`) on the same dark surface. The
  legacy `--color-*` tokens stay at their v1 values for backwards
  compatibility with any inline styles or external code that still
  reads them; the new `--superficie-*`, `--texto-*`, `--acento-*`,
  `--exito`, `--aliento`, `--borde*`, `--sombra-*` are the active
  layer. `manifest.json` + every `<meta theme-color>` updated to
  `#0F1115`.
- ✅ **Phase 3 done + dark migration shipped (sw.js v14).** Per‑activity
  CSS audited: `.feedback`, `.wallet-chip`, `.opcion-btn`, `.pista`,
  `.actividad-header`, `.opciones`, `.escena`, `.agente` no longer
  duplicate the shared components. `change-back/styles.css`,
  `concepts-money/styles.css`, `legal/styles.css`, and the root
  `styles.css` slimmed down to only the rules that are genuinely
  activity/mechanic specific, **all migrated to the new dark‑theme
  tokens**. Polish applied: body text 20 → 22 px, `--espacio-4` 16
  → 20 px, `--espacio-5` 24 → 28 px. Body color/background in
  `base.css` switched to the dark surface tokens. `:focus-visible`
  ring aliased to `var(--acento)` so it follows the per‑tab theme.
  `.celebration` overlay switched to dark backdrop. `sw.js` bumped
  to `v14`. `scripts/check.js` green (63 checks). Smoke test on
  `http://localhost:8080/` covers the Register‑an‑expense wizard
  end‑to‑end (category → keypad with live coin/banknote preview → Next
  enabled), `legal/`, and an activity (`needs-vs-wants`).
- ✅ **Known pre‑existing bugs fixed** (sw.js v15):
  - `tools/concepts-money`: its old `app.js` was hardcoding cases
    (`cents: 1`, `cents: 2`, opciones as i18n‑key strings) that
    duplicated `data.js` with data incompatible with the current
    locale — `createToken(1, 'es')` returned `undefined` and crashed.
    **Fix:** rewrote `app.js` to delegate to `data.js`
    (`casos: DATA.casos`), added `<script src="data.js">` to its
    `index.html`, and adapted `data.js` to the runtime schema
    (numeric `opciones`, `correctaIndex` derived from
    `opciones.indexOf(cents)` so it stays in sync if cases change).
  - `tools/change-back`: its old `app.js` read
    `current.instruccionKey` (field absent from `data.js`) and called
    `createToken(current.paidCents / costCents)` with cents that
    don't exist as physical denominations in either € or $ (130,
    220, 450, 770, 1450, 2350) — the second call crashed the same
    way as concepts-money. **Fix:** dropped the missing
    `instruccionKey` reference in favour of the generic `'instruccion'`
    string, replaced the two `createToken()` calls with formatted
    `App.money.format()` text (working-out-change is arithmetic, not
    visual identification), and used `App.money.spoken()` for the
    aria-label. Also hardened `App.i18n.t()` and `App.i18n.pick()`
    in `assets/js/i18n.js` to return empty string when called with
    a non-string key (root-cause fix so a similar bug in another
    activity can't TypeError again).

### 7.2 Decisions resolved

- **D1 → (a) dark surface active.** Documented in TODO.es.md §6.1.
  The dark tokens declared in Phase 1 are now the active layer.
- **D2 → shipped per‑tab accent** (decision inverted from the original
  recommendation, because `data-tema` is now driving the active accent
  in the tab bar and the FAB and the wizard CTAs — not body‑wide, so
  contrast and stability are preserved; the body background stays
  dark regardless of tab). The accents on the dark surface are:
  green `#7BD389` (dinero), blue `#7FB6E8` (metas), amber `#E8C879`
  (aprender).
---

## 8. Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Renaming `components.css` breaks the import in `tools/*/index.html` if missed | Medium | Low (visual only, easy to spot) | Grep for `components.css` before Phase 1 ends; `scripts/check.js` already validates `sw.js` `FILES` exist on disk — extend it to verify `@import` paths |
| Tokens declared but unused (dark mode dormant) ship accidentally as user‑visible | Low | Low | No `data-theme` switcher in UI in v1.1; only declared in `:root` (light) |
| Per‑tab accent confuses users (`SPEC.md` §3.5 contrast principle) | Medium | Medium | Decision D2 — ship single accent first |
| Activity icons render blurry at 48 px | Low | Low | Phase 3 audit |
| Existing `App.feedback` inline message styles break the new toast | Medium | Medium | Phase 3 explicit "audit feedback" step |
| Bumping `sw.js` invalidates the PWA cache mid‑redesign | Low | Medium | Phase 3 is the only bump; coordinate with any user who has the PWA installed for testing |

---

## 9. Out of scope reminder

If something new shows up during implementation that fits one of the
categories in §1.4 (new flows, new activities, schema changes, theme
toggle, framework migration, icon redesign, copy review), it does **not**
belong in this file. Open a new entry in the issue tracker or in
`SPEC.md` §9 (deliberate simplifications).

---

## 10. How this document is organised

- §1 — context and motivation.
- §2 — the target look and feel (tokens).
- §3 — the components that consume the tokens.
- §4 — the file‑by‑file migration map.
- §5 — the phased plan.
- §6 — open decisions.
- §7 — success criteria.
- §8 — risks.
- §9 — out of scope (mirrors §1.4).
- §10 — this map.

This document is a **plan**, not a contract. It updates as we learn.
When it changes, the change goes in the commit that implements it, not
in a separate "doc" commit.
