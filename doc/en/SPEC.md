# Product specification

> Canonical source for product scope, audience and non-negotiable rules.
> Technical architecture and data schema live in [`technical.md`](technical.md).

## 1. What Okeymoney is

A free, static, single-purpose web app that teaches **personal finance and
everyday financial autonomy** to people with intellectual or developmental
disabilities: knowing how much money you have, spending it consciously,
saving towards something you want, and (in a future version) practising
common money situations like working out change.

Okeymoney is a sibling of [Apptonomia](https://apptonomia.pages.dev),
[Calculia](../../../calculia) and [Teclatlon](../../../teclatlon): same
accessibility-first design language (Easy Reading, no pressure, high
contrast, large touch targets), same zero-backend static-PWA stack, applied
to a new domain — money, not therapy activities in general.

## 2. Audience

People with intellectual or developmental disabilities who are learning to
manage their own money, and anyone who benefits from Easy Reading,
no-pressure pacing and predictable, uncluttered screens: children,
beginners, older adults. Usable **autonomously**, without a professional or
family member operating the device for them.

## 3. Non-negotiable principles

1. **Autonomy** — usable without a professional or family member present.
   The person enters their own numbers and sees their own money, in their
   own words.
2. **No pressure** — no timers, no negative scoring, no "game over", no
   punishment for a wrong entry. A mistake is easy to correct (delete the
   last digit, go back a step), never framed as a failure.
3. **Privacy** — no login, no accounts, no cookies, no analytics, no
   server. The only persisted data (balance, expenses, goals, language)
   lives in this browser's `localStorage` and never leaves the device. See
   [`legal/`](../../legal/index.html).
4. **Easy Reading** — short sentences, one idea per screen, plain
   language, no financial or clinical jargon ("balance", "budget
   variance", "disability") in anything the person reads.
5. **Visual metaphors over abstract numbers** — every amount is always
   shown as a formatted price ("3,50 €") **and** as coins/banknotes drawn
   on screen, never as a raw decimal a person has to parse mentally.
6. **Accessibility** — buttons ≥ 64×64 px, spacing ≥ 16 px, WCAG AA
   contrast, full keyboard navigation, ARIA on icon buttons and feedback
   zones, respects `prefers-reduced-motion`.
7. **Sober technology** — HTML5 + CSS3 + vanilla JavaScript, no
   frameworks, no build step, no npm dependencies, offline-first PWA.

## 4. Navigation shape (max 3 levels, always predictable)

- **Level 0 — tabs**: a fixed bottom bar with exactly three destinations
  (Mi dinero / Mis metas / Aprender) plus a big "+" button in the same
  fixed position that always opens "Register an expense". The bar never
  changes shape or position.
- **Level 1 — a step-by-step wizard**: opened from level 0 (register an
  expense, create a goal, add money to a goal, change how much money you
  have). Every step shows dots for progress, a "← Back" to the previous
  step, and a "✕" that closes the wizard and discards nothing-yet-saved
  data without asking (low stakes — re-entering is easy).
- There is no level 2. A wizard step never opens another wizard.

## 5. Modules (current scope)

### 5.1 Mi dinero (Home / dashboard)

Shows, front and center: how much money the person has right now, as a
big number **and** as coins/banknotes. Tapping the number opens a
one-step wizard to recount and update it — this is the deliberately
simple stand-in for "registering income" in v1 (see §7). Below it, the
five most recent movements (expenses and goal contributions), each with
its icon, name and signed amount.

### 5.2 Mis metas (Mi hucha / savings goals)

A list of goals (icon + name + target price, chosen by the person),
each with a progress bar and the exact amounts ("3,00 € de 8,00 €").
Creating a goal is two steps (pick a picture and a name; write the
price). Adding money to a goal reuses the same one-step amount wizard as
everything else, and the contribution is subtracted from the money shown
in Mi dinero — saving means that money is set aside, not spent freely.
Reaching the target marks the goal as achieved with a small celebration;
achieved goals are never deleted automatically.

### 5.3 Registrar un gasto (Register an expense)

The flagship three-step flow (fully specified in `technical.md` §6, and
already implemented in `app.js`): pick a category, enter the price,
confirm and save. See §6 below for the exact rationale of each step.

### 5.4 Aprender (Learn)

Placeholder in this first version: an honest "coming soon" card plus a
teaser list of the first planned activities (working out change, making
a simple budget, needs vs. wants). It must never look finished or
interactive until it is — no fake buttons.

## 6. The "Register an expense" flow, step by step

This is the component every other amount-entry flow in the app reuses
for its numeric step (`renderAmountStep` in `app.js`).

1. **"¿En qué gastaste?" (what did you spend on?)** — a grid of 6 big
   icon buttons (food, fun, transport, clothes, health, other). Tapping
   one *is* the answer: it immediately advances to step 2. No separate
   "confirm your category" tap — a single unambiguous choice should cost
   one tap, not two.
2. **"¿Cuánto gastaste?" (how much?)** — a large formatted amount display
   ("0,00 €") above a big-button numeric keypad (0–9, delete-last-digit,
   clear-all) and, live underneath, the same amount broken into coins and
   banknotes (`App.money.breakdown` + `paintTokens`) — the visual
   metaphor from principle 5, updated on every keystroke. "Next" stays
   disabled while the amount is 0: there is nothing to explain, the
   button simply isn't ready yet (constructive, not an error message).
3. **Confirm** — a summary card (icon, category name, formatted amount)
   and one big "✅ Guardar gasto" button. Going back preserves the
   amount already typed; closing discards the whole entry silently.

On save: the expense is appended to the shared ledger (`technical.md`
§3), a positive sound + message plays (`App.feedback.celebrate`), and
the app returns to Mi dinero with the updated balance and coin preview
already visible — the person sees the direct cause and effect of what
they just did.

## 7. Deliberate simplifications in this first version

Documented here so they are treated as prioritised decisions, not gaps
discovered by accident:

- **No separate "register income" flow.** Tapping the balance on Mi
  dinero opens a "how much money do you have now?" wizard that
  recalculates the starting point so history stays intact. A dedicated
  income flow (allowance received, pocket money) is the natural next
  step, built on the exact same amount-step component.
- **No withdrawing money from a goal.** Once contributed, savings stay
  committed to that goal in v1. Needed before shipping a real "spend
  from my hucha" use case.
- **No settings screen yet** (text size, sound on/off). `storage.js`
  already reads an `okeymoney:prefs` key the same way the sibling apps
  do, so adding one later is additive, not a rewrite.
- **Aprender has no working activities yet** — see §5.4.

## 8. Language policy

UI is bilingual (`es`/`en`); `es` is the default and the source of truth
when a key is missing. Product content changes (categories, screen copy,
goal icons) must ship in both languages — see `technical.md` §5. Code
(identifiers, comments, commit messages) is always English.
