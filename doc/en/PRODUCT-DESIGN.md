# PRODUCT-DESIGN.md — Home in three blocks: learn, check and simulate

> **This document is the source of truth for the v2 home redesign.**
>
> The compact content map is in [`LEARNING-INDEX.md`](LEARNING-INDEX.md).
>
> It defines a deliberate **architectural change** to Okeymoney: the home
> becomes an Apptonomia-style three-part journey: didactic content,
> Token-rewarded tests, and euro simulations. Money and goals live in the
> third block, always visible on the same screen. This **inverts** the
> "single-purpose app, not a catalog"
> rule that [`technical.md`](../en/technical.md) §2 and [`CLAUDE.md`](../../CLAUDE.md)
> declared for v1 — the inversion is intentional, scoped to v2, and
> documented here.
>
> **It does not redefine product or accessibility rules.** Those still
> live in [`SPEC.md`](SPEC.md). When this document and `SPEC.md`
> disagree, `SPEC.md` wins.

---

## 1. Context and motivation

### 1.1 Where v1 stood

v1 ships with three bottom tabs:

- **Mi dinero** — the dashboard: balance, history, practice wallet chip.
- **Mis metas** — savings goals list + create / add-to flows.
- **Aprender** — the catalogue of 7 practice activities, grouped into
  two themed sections (Learn to manage your money / Keep your money
  safe), per [`activities.md`](activities.md).

The Apptonomia-style catalogue **already exists** but lives behind a
tab. The sibling apps (Apptonomia, Calculia, Teclatlon) all open
**directly on the catalogue**. The current architecture for Okeymoney
was justified in [`technical.md`](../en/technical.md) §2 as
"one single-purpose app, not a catalog of isolated activities" because
the real ledger must stay coherent across screens. That justification
holds for the **data layer** (it still must), but it does not require
hiding the catalogue behind a tab.

### 1.2 What v2 changes

- **The home stops being a tab and becomes a catalogue-first screen.**
  The hero of the home is the Apptonomia-style grid of activities,
  grouped into three themed sections in pedagogical order:
  1. Conceptos básicos — what money is, need vs want.
  2. Vida cotidiana — budget, shopping, change, full shopping day.
  3. Seguridad — scam awareness (one activity, shown last because it
     is the highest-stakes practical skill).
- **The real money state moves to a compact "Mi dinero" card** at the
  top of the home (above the catalogue), not behind a tab.
- **The goals state moves to a compact "Mis metas" card** below "Mi
  dinero", also on the home. The full goals screen stays available
  via an "open" affordance on the card (level 1 wizard).
- **The bottom tab bar is simplified to three destinations plus the
  FAB**: a tab for the **home** itself (so the catalogue is always one
  tap away), the FAB "+" that always opens "Register an expense", and
  the **Aprender** tab becomes a redundant shortcut to the same
  catalogue — the tab is removed, the catalogue IS the home.

### 1.3 What stays the same

- **The data layer** still has one shared ledger
  ([`technical.md`](../en/technical.md) §2–§3): Mi dinero, movements,
  goals, and the practice wallet all keep reading and writing the same
  `localStorage` keys. The "no catalog of isolated activities"
  *data-model* rule stays; only the *navigation model* changes.
- **The Socratic activity loop** in
  [`assets/js/activity-runtime.js`](../../assets/js/activity-runtime.js)
  is unchanged — every `tools/<slug>/` keeps using it. Only the entry
  point (home catalogue card instead of an "Aprender" tab list) moves.
- **The amount-entry wizard** in `app.js` (`renderAmountStep`) is the
  one component reused by every flow that asks for a price; unchanged.
- **Accessibility rules** (`SPEC.md` §3.5), **language policy** (es
  source of truth, en parity, [`I18N.md`](I18N.md)), **dark theme**,
  **privacy-by-default** — all unchanged.
- **The 7 activities themselves** stay at the same paths
  (`tools/<slug>/`). Only their grouping on the home changes order.

### 1.4 Out of scope (explicit non-goals)

| Not in this redesign | Why |
|---|---|
| Adding new activities | Pedagogy, not nav; out of scope here |
| Changing the data schema or the `App.*` API | Behaviour, not navigation |
| Changing the Socratic loop or the amount-entry wizard | These are the building blocks; not touched |
| Splitting the app into a `site/` + `tools/` shell like Apptonomia | Would break PWA + offline; the catalogue cards live in `index.html` directly, rendered from `data.js` |
| A toggle to bring back the v1 three-tab layout | Not in v2 scope; if needed later, it is a separate task |
| Auth, multi-device sync, cloud ledger | Explicitly excluded by [`SPEC.md`](../en/SPEC.md) §3.4 |

---

## 2. The vision

### 2.1 Mental model

> **"Open Okeymoney and see what to do next."**

The home is a single screen that tells the user, at a glance, what to do
next in three steps:

1. **Learn**: short didactic cards with no score or penalty.
2. **Check**: the 7 activities in pedagogical order (conceptos → vida
   cotidiana → seguridad), with Tokens and calm progress checks.
3. **Simulate**: balance, goals and expense entry in euros, plus the "+"
   FAB as a shortcut for the everyday action.

### 2.2 Catalogue ↔ money plane, conceptually

There are **two planes** that must stay separate but visible together:

- **Real plane** — Mi dinero (€) and Mis metas (€). One coherent
  ledger. Every change (movement, goal contribution) reflects on both
  screens instantly.
- **Practice plane** — Tokens 🔷 (`okeymoney:practiceWallet`). A
  fictitious currency earned by completing activities, never
  convertible to €. The practice wallet chip appears on the Mi dinero
  card and on every activity card (so the learner sees they accrue
  Tokens by practising).

The home makes this duality visible at all times: the **Mi dinero**
card shows € + Tokens, the **Mis metas** card shows only €, and the
**catalogue** shows the Tokens reward each activity credits.

### 2.3 Three-layer home architecture

The home follows one clear progression in both content and visual design:

1. **Didactic block — Learn step by step.** Fourteen short cards explain
   money value, spending choices, saving, change, safety, documents, the
   money picture, control, asset life, return, risk, investment operations and
   bank card and account types, and housing choices.
   There is no score or penalty;
   this block prepares the person to practise.
2. **Test block — Check what you know.** It contains the seven existing
   activities, grouped by theme. Each keeps its Socratic loop and credits
   Tokens to the practice wallet, separate from the euro ledger.
3. **Simulation block — Real money situations.** Balance, goals and
   expense cards represent everyday shopping, payments and saving with
   euro amounts. It also includes change, safety, everyday-rights,
   money-communication, emergency-response and the order → delivery note
   → invoice → payment cycle. It also practises a hypothetical return and
   risk checks for time horizon, access and diversification. These are safe,
   reversible rehearsals; only a confirmed expense writes to the local ledger,
   with no bank or broker connection. Investment practice names buying,
   selling, collecting returns and transferring without executing orders.
   Banking practice compares debit, credit, prepaid, current and savings
   products by when the money is charged, without recommending providers.
   Housing practice compares renting and owning through upfront costs,
   payments, maintenance, flexibility and time horizon, without imposing one
   answer.

Each block is a large section with a coloured edge, heading, orientation
copy and rounded white cards. It uses Apptonomia's visual grammar: pill
anchors, large pictograms, generous spacing and a single-column mobile
layout. The stratification is navigation and presentation; Token and euro
stores remain separate.

### 2.4 Progressive support for autonomy

Before the three blocks, a **Your next step** card reads only the minimum
local state and suggests one useful action:

- no balance recorded: count and save the current balance;
- balance recorded but no goal: choose something to save for;
- balance and goal present: record a purchase and observe the result.

The suggestion is always optional. There are no streaks, urgency messages
or penalties for stopping. This supports a simple financial routine:
**know → decide → act → check**. Each action returns to the balance, goal
or history so the person can see the link between a decision and its
consequence.

---

## 3. Shape of the home (level 0)

The home is a single vertical scroll, from top to bottom:

```
┌─────────────────────────────────────────────┐
│  [Header: app name + language picker]        │ ← unchanged
├─────────────────────────────────────────────┤
│  ┌─ Mi dinero card ──────────────────────┐  │ ← §3.1
│  │  Tienes                  🔷 Tokens    │  │
│  │  € 12,50                  🔷 5,00      │  │
│  │  [coins preview]                       │  │
│  │  ──────────────────────────            │  │
│  │  Últimos movimientos                   │  │
│  │  🍎 Comida          − 3,50 €          │  │
│  │  🚌 Bus             − 1,50 €          │  │
│  │  Ver historial completo →              │  │
│  └───────────────────────────────────────┘  │
│                                              │
│  ┌─ Mis metas card ──────────────────────┐  │ ← §3.2
│  │  Mis metas                             │  │
│  │  🪧 Auriculares   3,00 / 8,00 €   37%  │  │
│  │  🎮 Consola       0,00 / 200,00 €   0%  │  │
│  │  Ver todas / crear nueva →             │  │
│  └───────────────────────────────────────┘  │
│                                              │
│  Aprende con Okeymoney                       │ ← §3.3 catalogue title
│                                              │
│  ▌Conceptos básicos                          │ ← theme 1
│  ┌──────┐ ┌──────┐ ┌──────┐                 │
│  │ 🪙 1 │ │ ❓ 2 │ │      │                 │
│  │dinero│ │neces.│ │      │                 │
│  └──────┘ └──────┘ └──────┘                 │
│                                              │
│  ▌Vida cotidiana                             │ ← theme 2
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐        │
│  │ 💰 1 │ │ 🛒 2 │ │ 🧮 3 │ │ 📅 4 │        │
│  └──────┘ └──────┘ └──────┘ └──────┘        │
│                                              │
│  ▌Seguridad                                  │ ← theme 3
│  ┌──────┐                                    │
│  │ 🛡 5 │                                    │
│  └──────┘                                    │
│                                              │
├─────────────────────────────────────────────┤
│  [Footer: legal link + sibling apps]         │ ← unchanged
├─────────────────────────────────────────────┤
│  [Tab bar: home / + / ?]                    │ ← §3.4
└─────────────────────────────────────────────┘
```

### 3.1 Mi dinero card

A compact card that combines the v1 Mi dinero dashboard with the
practice wallet chip:

- Top row: **Tienes** + the big formatted balance (`--texto-700`,
  `--acento`). Tapping it opens the **recount balance** wizard (the
  one-step "how much money do you have now?" flow from
  [`SPEC.md`](../en/SPEC.md) §3.6.c).
- Below the balance: the live coin/banknote preview (same
  `App.money.breakdown` + paint logic as today).
- To the right of the balance (or just below on narrow screens):
  **🔷 Tokens** chip with the practice wallet formatted value.
- Below: the last 3 movements (same row component as today), with a
  **"Ver historial completo"** affordance that opens the full history
  view (a level-1 sub-screen reachable from this card).
- A small **"+ Registrar un gasto"** link inside the card duplicates
  the FAB for discoverability.

### 3.2 Mis metas card

A compact card listing goals with their progress bars:

- One row per goal: icon + name + `X € de Y €` + thin progress bar.
- Up to 3 goals visible; if more exist, the card shows the first 3 +
  a **"Ver todas"** affordance that opens the full goals view (the
  existing goals screen, refactored to a level-1 sub-screen).
- A **"+ Nueva meta"** link inside the card opens the create-goal
  wizard (the existing 2-step flow).
- Empty state (no goals): a short invitation + the same **"+ Nueva
  meta"** link.

### 3.3 Catalogue of activities

Below the cards, the catalogue renders **three themed sections** in
fixed pedagogical order:

1. **Conceptos básicos** — `concepts-money`, `needs-vs-wants`.
2. **Vida cotidiana** — `budget-first`, `go-shopping`, `change-back`,
   `my-shopping-day`.
3. **Seguridad** — `safe-money`.

Each section uses the same visual pattern as Apptonomia: a left accent
border + coloured heading, then a responsive grid of activity cards
(2 cols on phone, 3 cols on tablet+).

Each card carries:

- A large emoji icon (from `data.js` `activityIcons`).
- The activity title in the active language.
- The reward in Tokens (`🔷 +X,XX`) — what the learner earns on
  completion.
- The completion state: not done (default), done (✓ mark, calm green
  border, no re-reward per [`SPEC.md`](../en/SPEC.md) §3.1 / §7.4
  "once per person").

Each card is **a link** to `tools/<slug>/index.html`, the activity
itself. Tapping it is the only thing the learner needs to do.

### 3.4 Bottom tab bar

After v2 the bar has **two destinations plus the FAB**:

- **Home** — the catalogue + cards screen (always the leftmost button).
- **+** (FAB) — opens "Register an expense" (unchanged).
- *(right slot reserved)* — left as a small **language picker button**
  for one-handed switching without scrolling. If you prefer not to
  duplicate, drop it and rely on the header picker.

> **The Aprender tab is removed.** The catalogue IS the home, so a
> second tab pointing at the same content would be confusing. The
> activities are still in `tools/<slug>/`; the only thing removed is
> the v1 `<section id="screen-learn">` and the corresponding tab
> button.

### 3.5 Wizard reachability

Wizards that today live behind a tab are reachable from the new cards:

| Wizard | Reachable from |
|---|---|
| Register an expense | FAB (primary) + "Registrar un gasto" link inside the Mi dinero card |
| New goal | "+ Nueva meta" inside the Mis metas card |
| Add money to a goal | Tap a goal row in the Mis metas card (or in the full goals view) |
| Recount balance | Tap the big balance figure in the Mi dinero card |
| Full history | "Ver historial completo" in the Mi dinero card |
| Full goals view | "Ver todas" in the Mis metas card |

This keeps the **max-3-level navigation rule**
([`SPEC.md`](../en/SPEC.md) §6) intact.

---

## 4. Catalogue content (level 0)

### 4.1 The 7 activities, regrouped

The 7 activities already documented in [`activities.md`](activities.md)
are regrouped in the v2 home into three themed sections in pedagogical
order:

| Theme | Order | Slug | Title (es / en) | Reward (🔷) |
|---|---|---|---|---|
| Conceptos básicos | 1 | `concepts-money` | ¿Qué es el dinero? / What is money? | 5,00 |
| Conceptos básicos | 2 | `needs-vs-wants` | Necesito o quiero / Need or want | 8,00 |
| Vida cotidiana | 3 | `budget-first` | ¿Qué compro primero? / What do I buy first? | 12,00 |
| Vida cotidiana | 4 | `go-shopping` | Ir a la tienda / Go shopping | 20,00 |
| Vida cotidiana | 5 | `change-back` | Calcular la vuelta / Working out change | 30,00 |
| Vida cotidiana | 6 | `my-shopping-day` | Mi compra del día / My shopping day | 60,00 |
| Seguridad | 7 | `safe-money` | Mi dinero está seguro / My money is safe | 15,00 |

Same total reward (🔷 150,00 if everything is completed) as in v1.

### 4.2 Theme accents

The three themes use the accent palette already declared in
[`assets/css/tokens.css`](../../assets/css/tokens.css):

| Theme | Token | Value (current dark theme) |
|---|---|---|
| Conceptos básicos | `--acento` | `#7BD389` (green) |
| Vida cotidiana | `--acento-2` | `#7FB6E8` (blue) |
| Seguridad | `--acento-3` | `#E8C879` (amber) |

The per-tab accent logic via `data-tema` on `<body>` (introduced in
the v1.1 visual redesign — see [`TODO.md`](../../TODO.md) §2.2) is
**not used on the home**: the home renders all three themes at once, so
the body-level accent cannot vary per section. Each section sets its
own `--acento` locally (Apptonomia-style), exactly like the v1
"Aprender" screen did.

### 4.3 Section rendering

The renderer reads `DATA.learnThemes` (already defined in `data.js` —
see [`activities.md`](activities.md)) and emits one
`<section class="learn-theme theme-<key>">` per theme. Each section is
self-contained: it sets its own `--acento` and `--acento-suave` via
inline style on its root, so the heading and cards pick up the theme
colour with no extra CSS rules beyond the existing
`.learn-theme h2 { color: var(--acento); border-left: 8px solid var(--acento); }`
block.

No new CSS components are needed for the catalogue: the activity cards
already exist (see `styles.css` `.activity-card`) and just need to be
emitted by `app.js` from `DATA.learnThemes`.

---

## 5. The Mi dinero card and the shared ledger

### 5.1 Why the card lives on the home

The card's job is to make the **state of the real ledger** always
visible. The user does not need to switch tabs to know "how much money
do I have right now" — they see it the moment they open the app. This
is the same role Apptonomia's "your progress" badge plays for its
practice activities, applied to the real-money plane.

### 5.2 What the card does and does not do

**Does:**

- Show the current balance + the live coin/banknote preview.
- Show the practice wallet chip.
- Show the last 3 movements.
- Provide one-tap entry to "Register an expense" (also via the FAB).
- Provide one-tap entry to "Recount balance" (tap the balance figure).
- Provide one-tap entry to the full history view.

**Does not:**

- Replace the full history view (it shows only the last 3; the full
  view is one tap away).
- Replace the create-goal wizard (it shows 3 goals max; the full view
  is one tap away).
- Hold its own state — it always reads from `okeymoney:data` and
  `okeymoney:practiceWallet` directly.

### 5.3 Coherence with the rest of the app

The **full history view** and the **full goals view** are level-1
sub-screens (the wizard level, per [`SPEC.md`](../en/SPEC.md) §6). They
are reached from the cards on the home and from each other through
existing links. They render the same data as the cards; they just
render more of it. No new state.

---

## 6. Mis metas card

### 6.1 Same pattern, smaller scope

The Mis metas card is the goals view, scoped to a glanceable size:
icon + name + `X € de Y €` + thin progress bar, max 3 rows visible.

### 6.2 Reachable full view

The full goals view (the v1 `<section id="screen-goals">`) is
refactored from a tab into a **level-1 sub-screen**, opened via:

- The "Ver todas" affordance on the Mis metas card.
- The "Nueva meta" affordance on the Mis metas card (the full view is
  where the create-goal wizard lives, per the existing flow).
- A "Mis metas" link from the footer or any history detail view, if
  we want to cross-link.

The full view keeps the existing create-goal wizard (2 steps) and the
add-money-to-goal wizard (1 step, reusing `renderAmountStep`).

### 6.3 What changes in the data

Nothing. The goals array in `okeymoney:data` is unchanged. Only the
renderer that produces the goals UI moves from a tab to a card + a
sub-screen.

---

## 7. The bottom tab bar

### 7.1 From 4 destinations to 2 + FAB

v1: `home` · `+` (FAB) · `goals` · `learn`
v2: `home` · `+` (FAB) · *(optional language button)*

The Aprender and Mis metas tabs are **removed**, not just hidden.
Their screens are reachable from the home via the cards (see §3.5).

### 7.2 Why this is OK for the "no catalogue" rule

The v1 rule, restated from [`CLAUDE.md`](../../CLAUDE.md) and
[`technical.md`](../en/technical.md) §2, was: *"Okeymoney is one
single-purpose app, not a catalog of isolated activities. Do not
introduce a `site/` + `tools/<slug>/` split like Apptonomia/Calculia."*

The data-layer half of that rule **still holds**: the ledger is one
shared JSON blob, and `tools/<slug>/` activities never read each
other's storage. What v2 changes is the *navigation model*: the home
now exposes the activities as cards. This is a visual / information
design choice, not a data or boundary violation.

The **`tools/<slug>/` split is still present** and is still right
because each `tools/<slug>/index.html` is a self-contained static
page with its own JS / i18n / data files, and Apptonomia-style PWA
deployment depends on that. What v2 does **not** do is introduce a
new `site/` wrapper shell — the home stays in `index.html` and the
activity cards are just `<a href="tools/<slug>/index.html">`
elements.

---

## 8. Concrete changes (file-by-file)

| File | Action | Notes |
|---|---|---|
| `index.html` | **Restructure** | Replace the 3 `<section id="screen-…">` with a single home section containing the Mi dinero card, Mis metas card, and the catalogue. Delete `screen-learn` and `screen-goals` from the markup. Add the new strings. |
| `app.js` | **Refactor renderers** | Replace `renderHome`, `renderGoals`, `renderLearn` with a single `renderHome()` that emits all three (cards + catalogue). Add `renderHistoryView()` and `renderGoalsView()` as level-1 sub-screens, reached from the cards. The amount-entry wizard and the Socratic loop are untouched. |
| `data.js` | **Extend `learnThemes`** | Add the third theme `conceptos` (or similar); ensure `renderLearn` (now part of `renderHome`) iterates the three themes. Locale-neutral content only. |
| `tools/<slug>/index.html` | **No change** | Each activity still loads its own JS / i18n / data. The cards link here; nothing else changes. |
| `styles.css` | **Extend** | Add `.money-card` and `.goals-card` styles if needed; reuse `.activity-card` (already exists from v1) for the catalogue. |
| `assets/css/componentes.css` | **Extend** | One new component, `.app-card`, for the Mi dinero and Mis metas card layout. |
| `strings.es.js` / `strings.en.js` | **Add keys** | Catalogue titles, section names, "Ver historial completo", "Ver todas", "+ Registrar un gasto" inside the Mi dinero card, etc. Same keys in both files. |
| `TODO.md` | **Update** | The visual redesign done in v1.1 (already shipped) is referenced; v2 navigation work is a separate, scoped effort. |
| `CLAUDE.md` | **Update** | Add a note that the "no catalogue" rule is inverted for the *navigation model* in v2; the data-layer rule still holds. |
| `doc/en/technical.md` | **Update** | §2 reframes the "single-purpose app" rationale: data layer stays shared, navigation becomes catalogue-first. |
| `doc/en/activities.md` | **Update** | Regroup the table into the three v2 themes (`concepts` / `daily` / `safety`); the catalogue of 7 activities itself is unchanged. |
| `sw.js` | **Bump VERSION + FILES** | Same pattern as v1.1 visual redesign. |

---

## 9. Phases

Each phase ends with a verifiable state. The app must keep working at
every step (no half-broken screens).

### Phase 1 — Cards on the home (no tab change yet)

- Build the new `Mi dinero` card and `Mis metas` card as components.
- Render them inside the existing `<section id="screen-home">`.
- The Aprender tab still exists and still works.
- Mis metas tab still exists and still works.
- Verification: `node scripts/check.js` green; the home looks like the
  new design but the tab bar is unchanged; every existing flow keeps
  working.

### Phase 2 — Catalogue on the home (Aprender tab still alive)

- Render the three-themed catalogue on the home (below the cards).
- The Aprender tab still exists as a redundant shortcut.
- Verification: home shows cards + catalogue; Aprender tab still
  shows the same catalogue (it can even call the same renderer); all
  flows still work.

### Phase 3 — Remove Aprender + Mis metas tabs

- Remove the `<section id="screen-learn">` and its tab button.
- Remove the `<section id="screen-goals">` tab button; keep the
  renderer reachable as a level-1 sub-screen from the Mis metas card.
- The tab bar is now `home · + · ?`.
- Verification: home is the only destination; the two sub-screens
  (history, goals) open via the cards; `node scripts/check.js` green;
  no `screen-learn` or `screen-goals` references remain in
  `index.html`, `app.js`, or `styles.css`.

### Phase 4 — Polish, accessibility, smoke test

- Per `SPEC.md` §3.5: every action reachable in one tap, every
  visible option has an accessible label, contrast verified in dark
  theme.
- Manual smoke test: open the home, see all three cards, tap each
  card's "open" affordance, complete one activity end-to-end,
  register one expense, create one goal and add money to it.
- Bump `sw.js` to v16 (or whatever follows v15).

---

## 10. Success criteria

v2 ships when **all four phases** are done and:

1. The home renders cards + catalogue in one vertical scroll, dark
   theme active, WCAG AA contrast.
2. The tab bar has 2 destinations + the FAB.
3. The 7 activities are reachable from the home catalogue.
4. The Mi dinero card, Mis metas card, history view, goals view,
   register-expense wizard, create-goal wizard, and add-money-to-goal
   wizard all keep working end-to-end with the existing data schema.
5. `node scripts/check.js` is green.
6. `SPEC.md`, `CLAUDE.md`, `technical.md`, `README.md`,
   `activities.md` and this doc are consistent (no contradictions).
7. No `screen-learn` or `screen-goals` references remain.

---

## 11. Risks and mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| The Mi dinero card makes the home too tall before the catalogue | Medium | Medium | Cards render only the essentials (3 movements, 3 goals); "Ver historial completo" and "Ver todas" affordances take the user to the full views in one tap. Tested on phone viewports (≤ 480 px) in Phase 4. |
| Removing the Aprender tab breaks muscle memory | Medium | Low | Phase 2 keeps the Aprender tab visible as a shortcut during transition; removed only in Phase 3. The home catalogue is one tap away from any tab. |
| Catalogue activities load slowly on first visit | Low | Low | Each `tools/<slug>/` is already in `sw.js` `FILES` and pre-cached; first-load cost is the same as today. |
| Visual redesign (v1.1) and v2 navigation redesign collide | Medium | Medium | Phases are scoped: v1.1 visual is **done** and untouched. v2 navigation uses the same component layer (`.app-card`, `.activity-card`) without overriding tokens. |
| Activity cards visually compete with the Mi dinero card | Medium | Medium | The Mi dinero card uses the active body accent (`--acento`, green); activity cards use their theme accent (per section). Section headings visually subordinate the catalogue. |
| Breaking `CLAUDE.md`'s "no catalog" rule confuses future contributors | Low | Medium | `CLAUDE.md` and `technical.md` §2 are updated in the same commit; the rationale for the inversion is documented in §7 of this doc. |
| Bumping `sw.js` invalidates the PWA cache mid-redesign | Low | Medium | Phase 4 is the only bump; coordinate with any user who has the PWA installed for testing. |

---

## 12. Documents affected

When v2 ships, the following docs must be consistent with this file:

- [`doc/en/SPEC.md`](SPEC.md) — no change (product rules unaffected).
- [`doc/en/technical.md`](../en/technical.md) — §2 reframes the
  "single-purpose app" rationale.
- [`doc/en/activities.md`](activities.md) — updated for the v2
  regrouping into three themes (`concepts` / `daily` / `safety`),
  replacing the old two-theme split (`learn` / `safe`).
- [`doc/en/I18N.md`](I18N.md) — no change (architecture untouched).
- [`CLAUDE.md`](../../CLAUDE.md) — add note about the navigation-model
  inversion; data-layer rule unchanged.
- [`README.md`](../../README.md) — add this file to the
  documentation table.
- [`TODO.md`](../../TODO.md) and [`TODO.es.md`](../../TODO.es.md) —
  reference v2 as the next scoped effort after v1.1 visual.

---

## 13. How this document is organised

- §1 — context, motivation, what changes, what stays, out of scope.
- §2 — the vision.
- §3 — shape of the home.
- §4 — catalogue content and theme order.
- §5 — the Mi dinero card.
- §6 — the Mis metas card.
- §7 — the bottom tab bar.
- §8 — file-by-file changes.
- §9 — phased plan.
- §10 — success criteria.
- §11 — risks.
- §12 — documents affected.
- §13 — this map.

This document is a **plan**, not a contract. It updates as we learn.
When it changes, the change goes in the commit that implements it, not
in a separate "doc" commit.
