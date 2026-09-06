# Technical information

> Documentation for developers who want to understand, maintain or extend
> Okeymoney.
>
> | Document | What it contains | When to read it |
> |---|---|---|
> | `CLAUDE.md` | Operational workflow for AI agents | Only when an AI agent performs the change |
> | `doc/<en\|es>/technical.md` (this) | Architecture, data schema, core APIs, recipes | When developing or modifying the app || `doc/<en\|es>/I18N.md` | Multilingual architecture + recipe to add a language | When adding a new locale or touching the i18n system |> | `doc/<en\|es>/SPEC.md` | Product, audience, non-negotiable principles | Before any product or UI change |
> | Project history | Lives in Git (`git log`); no external roadmap is kept | To understand why something is the way it is |
> | `README.md` | Brief intro, how to run and deploy | First contact with the repo |

## 1. Why this stack (and not Flutter / React Native + Firebase)

The obvious "cross-platform app" answer would be Flutter or React Native
with a Firebase/Supabase backend. Okeymoney deliberately does **not** use
that stack, for reasons specific to this product and consistent with its
three sibling apps (Apptonomia, Calculia, Teclatlon):

- **The target audience's real device is a browser**, often on a shared
  or older tablet/phone, sometimes without an app store account of their
  own. A URL that works instantly, installs as a PWA if wanted, and needs
  no account, matches that reality better than an app-store binary tied
  to a signed-in identity.
- **Privacy principle (§3.3 of SPEC.md) rules out a backend by design.**
  There is no user data to protect on a server if there is no server:
  Firebase/Supabase would mean handling authentication, a database, and a
  privacy policy for data that, for this product, has no reason to ever
  leave the device (see §3 below — the whole ledger is a few kilobytes of
  JSON, per person, on their own phone).
- **Zero cost, zero maintenance hosting.** A static site on Cloudflare
  Pages has no server to patch, scale or pay for, and no dependency
  supply chain to keep updated (no `npm install` at all — see §1.1).
  A Flutter/RN app would need store accounts, review cycles, and a CI
  pipeline per platform for a product with no backend logic to justify it.
- **Consistency with the family of apps this person (or their family)
  may already use.** Reusing `assets/js/*` (i18n, storage, feedback,
  the money/coin visuals) and the same accessible design tokens means
  Okeymoney looks, sounds and behaves like Apptonomia/Calculia/Teclatlon
  from the first screen — one less thing to (re)learn.
- **Offline-first is free with this stack.** A service worker + static
  files gives full offline use without writing sync logic — important for
  a money app someone might open without reliable connectivity.

Flutter/RN + Firebase would be the right call for a product that needs
multi-device sync, push notifications, or server-side logic (e.g. a
therapist dashboard reading a client's data remotely). Okeymoney is
explicitly **not** that product: it is one person, one device, their own
numbers, never transmitted anywhere. If a future version needs
multi-device sync (e.g. a parent's read-only view), that is a deliberate,
separately-scoped addition — not a reason to change the baseline today.

### 1.1 Non-negotiable technical constraints

- **HTML5 + CSS3 + Vanilla JavaScript.** No frameworks, no bundlers, no
  build step, no backend, no npm dependencies at all. No `package.json`
  in the repo, so Cloudflare Pages does not run `npm install` during the
  build and there is nothing to bundle.
- **Classic scripts**, not ES modules (compatibility with `file://` and
  older browsers). All shared code is exposed on `window.App.*`.
- **No JS CDNs.** Fonts (Atkinson Hyperlegible, Nunito) are self-hosted
  `.woff2` files in `assets/fonts/`, cached by the service worker, so the
  app works fully offline (an external Google Fonts request would not).
- **Persistence only in `localStorage`.** No login, no cookies, no
  personal data, no analytics.
- **Offline-first PWA**: `manifest.json` + `sw.js` (cache-first app
  shell).
- **Code style**: ES5-style JS (`var`, classic functions, IIFE with
  `'use strict'`); identifiers, comments and commit messages in English.
  UI copy itself (`strings.es.js`, `strings.en.js`, `data.js` labels)
  stays in the language it represents.

### 1.2 Hosting and deployment — Cloudflare Pages

Same setup as the sibling apps: **Cloudflare Pages** via the Git
connector, no build step (the repo root is the build output), cache
policy in `_headers` (HTML/`sw.js`/`manifest.json` must-revalidate,
fingerprint-free JS/CSS/font assets cached a year). `manifest.json` and `sw.js`
use relative paths so the app works on any host unmodified. A one-off
preview deploy without pushing: `npx wrangler pages deploy . --project-name okeymoney`.

### 1.3 Cross-browser support — Safari is a first-class target

Same rationale as the sibling apps: the audience's primary device is
often an iPhone/iPad. Stay on classic scripts and ES5-style code (no
modules, no `import`/`export`, no arrow functions, no top-level
`let`/`const` in app code), register the service worker from every entry
point (`index.html` and `legal/index.html`), and avoid modern Web APIs
without a feature check.

---

## 2. Architecture — a single app, not a catalog of activities

Apptonomia and Calculia are **catalogs of independent activities**: each
`tools/<slug>/` is isolated and never reads another activity's storage.
Okeymoney is architecturally different on purpose: **Mi dinero**, **Mis
metas** and **Registrar un gasto** all read and write the *same* ledger,
because a coherent balance is the entire point of the product (spending
must visibly reduce what's shown as available; saving must visibly set
money aside). Building it as isolated "activities" like the siblings
would break that coherence. Okeymoney is therefore modeled like
**Teclatlon** instead: one single-purpose app, not a multi-activity
suite — `index.html` **is** the app, `app.js` is one IIFE holding every
screen as an internal state machine, and there is no `site/` + `tools/`
split.

```
okeymoney/
├── index.html          # The app itself: 3 tab screens + 1 wizard screen
├── app.js              # All logic: state, tabs, and every wizard flow
├── data.js             # Locale-neutral data: categories, goal icons
├── strings.es.js        # Spanish UI text (default, source of truth)
├── strings.en.js        # English UI text (same keys, checked by CI)
├── styles.css           # App-specific styles only (< 150 lines)
├── assets/              # SHARED CORE (see §4)
│   ├── css/tokens.css   #   design variables (colors, typography, touch)
│   ├── css/base.css     #   reset, fonts, visible focus, reduced-motion
│   ├── css/components.css # reusable components (.btn, .card, tab bar…)
│   ├── js/utils.js      #   window.App.utils
│   ├── js/i18n.js       #   window.App.i18n
│   ├── js/tts.js        #   window.App.tts (not yet wired into the UI)
│   ├── js/storage.js    #   window.App.storage
│   ├── js/feedback.js   #   window.App.feedback
│   ├── js/money.js      #   window.App.money (coins/banknotes)
│   ├── fonts/           #   self-hosted woff2 (Atkinson Hyperlegible, Nunito)
│   └── img/icono.svg    #   app icon
├── legal/index.html     # Data-protection page (linked from every screen)
├── manifest.json        # PWA
├── sw.js                # Service worker: cache list + VERSION (§7)
└── _headers             # Cloudflare Pages cache and security headers
```

### 2.1 Screens (level 0 — tabs)

`app.js` keeps a `currentTab` in `{'home', 'goals', 'learn'}`, toggling
the `.hidden` class on the matching `<section id="screen-*">`. The tab
bar (`.tabbar`, fixed to the bottom) is the only navigation: three
`.tab-button`s plus a center `.fab-button` that always opens "Register
an expense", regardless of which tab is active.

### 2.2 Wizards (level 1 — step-by-step flows)

A single `wizard` variable (`null` when no wizard is open) holds
`{ type, step, ...fields-being-entered }`. `openWizard()` hides every tab
screen and shows `#screen-wizard`; `renderWizard()` dispatches on
`wizard.type` to the function that draws the current step. Every step
function re-renders `#screen-wizard`'s `innerHTML` from scratch — simpler
to reason about than incremental DOM patching, and cheap enough at this
scale (a handful of buttons and one input per step).

Several wizard types exist today, all built from the same reusable
amount-entry component (`renderAmountStep`, SPEC.md §6):

| `wizard.type` | Steps | Where it's opened from |
|---|---|---|
| `expense` | category → amount → confirm | The "+" button, any tab |
| `setBalance` | amount only | Tapping the balance on Mi dinero |
| `goalNew` | icon+name → target amount | "+ Nueva meta" on Mis metas |
| `goalAdd` | amount only | "+ Añadir dinero" on a goal card |
| `income` | source → amount | "Receive money" card |
| `commitment` | name → amount | "Planned payments" card |
| `settings` | preferences and data | "Settings and data" link |

---

## 3. Data schema

Everything lives under one `localStorage` key, `okeymoney:data` (read
through `App.storage.get('data')` / `set('data', …)`), plus two small
keys shared with the sibling apps' convention: `okeymoney:locale`
(active language) and `okeymoney:prefs` (local preferences, including text
size).

**All amounts are integer cents.** Never floating-point euros — `0.1 +
0.2` famously isn't `0.3` in IEEE 754, and a money app cannot afford that
class of bug. `App.money.format(350)` renders `"3,50 €"` / `"3.50 €"`.

```jsonc
// localStorage['okeymoney:data']
{
  "version": 1,

  // The ledger's starting point. Not "money ever earned" — it is
  // recalculated by setBalanceTo() whenever the person recounts their
  // money on Mi dinero, so past movements stay untouched while the
  // *current* balance always matches what they just told the app.
  "initialBalanceCents": 2000,

  // Every expense and every goal contribution, in the order they were
  // entered. balanceCents() = initialBalanceCents + sum(income)
  // - sum(expense) - sum(saving). Income is recorded by the receive-money
  // flow and carries a sourceId (allowance, work, gift or refund).
  "movements": [
    {
      "id": "m3k2j1abc",          // App.utils.uid()
      "type": "expense",          // 'expense' | 'income' | 'saving'
      "categoryId": "food",       // present only when type === 'expense'
                                   // — one of data.js's DATA.categories
      "sourceId": null,            // present only when type === 'income'
                                   // — one of DATA.incomeSources
      "goalId": null,             // present only when type === 'saving'
                                   // — id of the goal in `goals` below
      "amountCents": 350,         // always positive; `type` gives the sign
      "documentCycle": null,      // optional: order-delivery-invoice-payment
      "date": "2026-08-01"        // App.utils.today(), local YYYY-MM-DD
    }
  ],

  // Savings goals ("Mi hucha"). Never deleted automatically, including
  // after being achieved — the person decides if/when to remove one
  // (no delete UI yet in v1; see SPEC.md §8).
  "goals": [
    {
      "id": "g8f7e6xyz",
      "name": "Un juego",         // free text, typed by the person
      "icon": "🎮",                // one of data.js's DATA.goalIcons
      "targetCents": 3000,
      "savedCents": 500,           // sum of 'saving' movements with this goalId
      "createdDate": "2026-07-20",
      "achieved": false            // true once savedCents >= targetCents
    }
  ],

  // Planned payments are reminders only. They never change balanceCents.
  "commitments": [
    { "id": "p1", "name": "Phone", "amountCents": 1500, "dueDate": "2026-09-01", "createdDate": "2026-08-25" }
  ],

  // Local progress for the budget → receive → save → spend cycle.
  "cycle": {
    "budgeted": true,
    "lastPlan": { "budgetCents": 3000, "itemId": "bread", "priceCents": 200, "date": "2026-08-25" }
  }
}
```

```jsonc
// localStorage['okeymoney:locale']
"es"   // or "en" — plain string, not JSON-wrapped beyond the quotes

// localStorage['okeymoney:prefs']  (preferences chosen in Settings and data)
{ "textSize": "normal", "sounds": true }
```

### 3.1 Why one shared object instead of one key per screen

The sibling apps' `storage.js` contract (`get(toolId)`/`set(toolId,
data)`) was designed for **isolated** activities that never share state.
Okeymoney reuses the exact same `get`/`set`/`remove` API (see §4.4) but
calls it with a single fixed key, `'data'`, holding the whole ledger —
because Mi dinero, Mis metas and Registrar un gasto are views over the
*same* facts, not separate progress trackers. Splitting `movements` and
`goals` into separate keys would only add a synchronization problem
(e.g. "was this goal's `savedCents` updated before or after the matching
movement was saved?") for no benefit, since nothing here needs to be
loaded independently.

### 3.2 Categories and goal icons (`data.js`)

Locale-neutral: an id and an emoji per entry, capped at 6 (accessibility
rule: 4–6 options per screen). Display names live in
`strings.<locale>.js` under `categories.<id>`, resolved with
`App.i18n.t('categories.' + id)`. Adding a category is one line in
`data.js` plus one key in each `strings.<locale>.js` — checked for es/en
parity by `scripts/check.js`.

---

## 4. Shared core API (reference)

### 4.1 `window.App.utils` (`utils.js`)

| Function | Signature | Description |
|---|---|---|
| `$` / `$$` | `(selector, [root]) → Element / Element[]` | `querySelector` / `querySelectorAll` shortcuts |
| `today` | `() → 'YYYY-MM-DD'` | Today's local date, used to stamp movements |
| `reducedMotion` | `() → boolean` | true if the system requests less animation |
| `uid` | `() → string` | Short unique id for movements/goals (not cryptographic — local records only) |

### 4.2 `window.App.i18n` (`i18n.js`)

ES/EN system, same shape as the sibling apps. Active language:
`localStorage['okeymoney:locale']`, or detected from `navigator.language`.
`t(key)` looks up a dotted key (`'categories.food'`), falling back to
Spanish, then to the literal key. `apply([root])` paints every
`[data-i18n]`/`[data-i18n-aria]` node under `root` (default `document`).
Each `strings.<locale>.js` calls `App.i18n.register(dict, 'es'|'en')`;
`scripts/check.js` fails the build if the two files' keys don't match.

### 4.3 `window.App.money` (`money.js`)

The euro visual system (SPEC.md principle 5). Amounts are always integer
cents.

| Member | Description |
|---|---|
| `CATALOG` | Denominations from 5 cents to 50 euros |
| `format(cents)` | Localized amount string (`"1,50 €"` / `"1.50 €"`) |
| `spoken(cents)` | Written-out amount, for future TTS/explanations |
| `breakdown(cents)` | Splits an amount into coins/banknotes, largest first (greedy) |
| `createToken(cents)` | Builds one decorative `<span>` coin/banknote with ARIA |
| `paintTokens(container, pieces)` | Renders a breakdown's tokens into `container` |
| `formatPractice(cents)` | Localized practice-currency amount (`"2,50 🔑"` / `"2.50 🔑"`); uses the `practice.symbol` key registered in `App.i18n` (default `🔑`) |
| `spokenPractice(cents)` | Written-out practice amount, for future TTS ("2 okeys y 50 subokeys") |

The `practice.*` keys (`name`, `plural`, `sub`, `symbol`) are registered
in `App.i18n` inside `money.js` for both locales and are checked for
parity by `scripts/check.js`. See §10 for the practice wallet that
uses these formatters.

### 4.4 `window.App.storage` (`storage.js`)

Internal key prefix: `okeymoney:<key>`. Every function is failure-tolerant
(private browsing, full storage): none of them throw.

| Function | Signature | Description |
|---|---|---|
| `get` | `(key) → object` | Saved value, or `{}` if nothing / on error |
| `set` | `(key, data) → boolean` | Saves JSON; `false` if it failed |
| `remove` | `(key) → boolean` | Deletes one key |
| `clearAll` | `() → boolean` | Deletes every `okeymoney:*` key (full reset) |
| `dump` | `() → object` | Returns a portable snapshot of local keys |
| `restore` | `(snapshot) → boolean` | Replaces local keys with a validated snapshot |

### 4.5 `window.App.feedback` (`feedback.js`)

| Function | Signature | Description |
|---|---|---|
| `success([zone])` | | Random positive message + soft sound; writes to an `aria-live` zone if given |
| `encourage([zone])` | | Encouragement after a mistake (never punitive) |
| `celebrate(message, [after])` | | Fullscreen celebration ≤ 1.8 s (shorter with reduced motion); used after saving an expense, creating a goal, or reaching one |
| `lockUntilAck(buttons, zone, [onConfirm])` | | Reading-pause pattern, kept for the future Aprender quizzes; unused in v1's numeric flows |

### 4.6 `window.App.tts` (`tts.js`)

Ported from the sibling apps for consistency and future use (e.g. reading
a confirmation screen aloud). Not yet wired into any Okeymoney screen —
v1's flows are short enough to not need it, per SPEC.md rule 4 ("audio
only where the activity design calls for it").

---

## 5. Internationalization

Full reference: [`doc/en/i18n.md`](I18N.md) (and its [`doc/es/i18n.md`](../es/I18N.md)
mirror). The short version: one file per language
(`strings.es.js` / `strings.en.js`), both loaded synchronously (no
`document.write`, so `App.i18n.register` always runs before `data.js` /
`app.js` read any text). `es` is the default and the source of truth.
`scripts/check.js` fails if any two `strings.<locale>.js` files in the same
scope (root, `legal/`) have different key sets. Adding a UI string: add
the key to **every** `strings.<locale>.js` in the same shape; adding a
new supported language: follow the 9-step recipe in `I18N.md` §5
(extending `SUPPORTED`, `BCP47`, `LABEL`, `FLAG` in `i18n.js`, the
`core`/`feedback` block, `DECIMAL_SEP` in `money.js`, the new
`strings.<locale>.js`, `sw.js` `FILES`, and the `<script>` tag list).

---

## 6. The amount-entry component, in code terms

`renderAmountStep(opts)` in `app.js` is the literal implementation of
SPEC.md §6 step 2, factored out so `expense` (step 2), `setBalance`,
`goalNew` (step 2) and `goalAdd` all call it with different copy and a
different `onConfirm`:

```js
renderAmountStep({
  titleKey: 'expense.amountTitle',        // i18n key for the <h2>
  instructionKey: 'expense.amountInstruction',
  initial: wizard.amountCents,            // resume the value if going back
  totalSteps: 3, step: 2,                 // for the step-dots indicator
  allowZero: false,                        // 0 € is a valid balance, not a valid expense
  onBack: function () { /* re-render the previous step */ },
  onConfirm: function (cents) { /* store it, advance or save */ }
});
```

It owns: the live formatted display, the coin/banknote preview
(`App.money.breakdown` + `paintTokens`), the 12-key numeric keypad
(digits, delete-last, clear-all), and disabling "Next" while the amount
is `0` and `allowZero` is `false` — the Socratic-friendly way to block an
invalid entry without ever showing an error message.

---

## 7. PWA and service worker

- `sw.js` is **cache-first** for the app shell. Contract when touching
  files: add new files to `FILES`; bump `VERSION` (`okeymoney-vNN`) on
  any change to a cached file, otherwise installed-PWA users won't see it.
- `manifest.json`: `display: standalone`, `start_url: ./index.html`.
- Register the service worker from **every** entry point: `index.html`
  and `legal/index.html` both call `navigator.serviceWorker.register(...)`
  with the correct relative path (§1.3).

---

## 8. Execution and verification

```bash
# Local server (either works; no build step)
python -m http.server 8080     # → http://localhost:8080/index.html
npx serve .

# Structural + i18n check (no npm install needed — stdlib only)
node scripts/check.js
```

`scripts/check.js` checks: every `.js` file parses, `strings.es.js` /
`strings.en.js` have matching keys (root app and `legal/`), every path in
`sw.js`'s `FILES` exists on disk, and every `manifest.json` icon
exists. CI (`.github/workflows/validate.yml`) runs the same command on
every push and pull request.

Not yet automated (manual before shipping a change): a real-browser walk
through each wizard (expense, set balance, new goal, add to goal), a
check of the simulation entry points, and a WebKit/Safari pass per §1.3.

---

## 10. Practice wallet and activity persistence

Okeymoney exposes a **second ledger** for the practice currency
("Tokens" / "okey" 🔑), completely independent from the real ledger
in `okeymoney:data`. The two ledgers never mix and there is no
conversion between them: practice credits do not affect the € balance,
and vice versa.

### 10.1 `window.App.wallet` (`wallet.js`)

A second ledger, stored under `localStorage['okeymoney:practiceWallet']`,
with integer cents in okeys (1 eurocent = 1 subokey).

| Function | Signature | Description |
|---|---|---|
| `balance()` | `() → number` | Current balance in okey-cents |
| `credit(cents, reason)` | `(number, string) → number` | Adds `cents` (positive or negative) and records the reason in `history` |
| `reset()` | `() → void` | Resets the practice wallet to 0 and clears history |
| `activityStatus(slug)` | `(string) → {done, completedAt, attempts} \| null` | Completion record for one activity, or null |
| `markActivityDone(slug, attempts)` | `(string, number) → void` | Marks one activity as done (idempotent) |

The shared `App.money.formatPractice()` and `App.money.spokenPractice()`
render the balance. Both are registered in `App.i18n` under the
`practice.*` keys (`name`, `plural`, `sub`, `symbol`) — see §4.3.

### 10.2 Activity persistence

Each activity uses one `localStorage` key per slug:

- `okeymoney:activity:<slug>` → `{ done: true, completedAt: 'YYYY-MM-DD', attempts: N }`

Completing an activity for the first time calls `App.wallet.credit(rewardCents, 'activity:<slug>')`
**and** `App.wallet.markActivityDone(slug, attempts)`. Subsequent runs
do not re-credit (the `activityStatus.done` check is idempotent) but
stay available if the person wants to repeat the activity.

### 10.3 Test activities inside each unit

Eight activities live under `tools/<slug>/`. Each one is a self-contained
folder with `index.html`, `app.js`, `strings.es.js`, `strings.en.js`,
plus optional `data.js` and `styles.css`. All activities reuse the
shared Socratic loop in `assets/js/activity-runtime.js`
(`App.activity.run(opts)`); `change-back` is the only one that uses a
custom keypad mechanic instead.

Per [`PRODUCT-DESIGN.md`](PRODUCT-DESIGN.md), each **home** unit combines
the didactic explanation with an integrated invitation to its corresponding
test. `renderDidacticLessons()` builds these units from
`DATA.didacticLessons` + `DATA.learningIndex`, and links each available
test to its real `tools/<slug>/` route. The second home part gathers the
guide to act: practical rules, the money cycle and euro simulations. Units
follow `DATA.didacticLessons`, and each one links to its available tests.

The catalogue, the per-activity reward, and the agent vocabulary are
documented in [`activities.md`](activities.md) (catalogue of activities).

### 10.4 The three basic agents

Every case names one of three agents — persona / empresa / banco —
declared as `agente: 'persona' | 'empresa' | 'banco'` (optional) plus an
optional `agenteName` i18n key. The runtime paints an `agente__card`
with the agent's emoji avatar (`👤` / `🏪` / `🏦`), a role label from
`App.i18n.t('agent.<tipo>')`, and the agent's specific name from
`agenteName`. New activities reuse the same three entries from
`AGENTES` in `activity-runtime.js`; do not invent ad-hoc emojis.

### 10.5 Adding a new activity

1. Copy `tools/concepts-money/` (the simplest template) into
   `tools/<new-slug>/`. Drop `data.js` and `styles.css` if the activity
   only needs `app.js` + `strings.*.js` — most reuse the shared
   `assets/css/activities.css` and the shared `activity-runtime.js`.
2. Add `agente` and `agenteName` to each case in `app.js` so the runtime
   paints the agent card.
3. Add the keys to both `strings.<locale>.js` and check `scripts/check.js`.
4. Add the slug to `DATA.activities` in `data.js` (root) with
   `available: true` and a `theme` matching one of `DATA.learnThemes`
   (`concepts` / `daily` / `safety` — add a new theme entry there, with
   an `accent` pointing at one of the `--acento*` tokens in
   `assets/css/tokens.css`, only if it genuinely doesn't fit an existing
   section) so the home catalogue and the Aprender tab show it in the
   right section.
5. Append the activity's files to `sw.js` `FILES` and bump
   `VERSION`.

---

## 11. License

MIT — see [`LICENSE`](../../LICENSE).

## 12. Suite pattern — how every app of Miralante is built

> 🌐 **Other language:** [Spanish](../es/tecnico.md#8-patrón-de-la-suite-cómo-se-construye-cada-app-de-miralante)

This section is the **canonical, cross-project guide** for how
every app of the [Miralante suite](https://apptonomia.uk) is
built and maintained. It is the source of truth that overrides
any single repo's `technical.md` / `tecnico.md` when they
disagree, because the goal is to keep the seven sibling apps
(Apptonomia, Calculia, Memofun, Okeymoney, Sinonimia, Teclatlon,
Routime) consistent: same shape, same conventions, same
deploy, same i18n, same offline behaviour.

A change to this section is a **suite-wide change** and must be
applied to every repo. A change to a project's other sections
in this file is project-specific and stays there.

> **Source of truth for product rules** in this repo:
> [`SPEC.md`](SPEC.md).
> **Source of truth for i18n**: [`I18N.md`](I18N.md).
> This section does **not** redefine those; it codifies the
> pattern they all share.

### 12.0 The pattern in one paragraph

Every app of the Miralante suite is a **static, dependency-free,
offline-first PWA** built from the same minimal skeleton:

1. A small set of **standalone HTML pages** at the repo root
   (one activity) or under `tools/<slug>/` (multi-activity hubs).
2. Every page is a **real, navigable URL** — there is **no SPA
   routing**, no in-page view switching, no `pushState`. Each
   page reloads on entry; navigation between pages is a normal
   `<a>` click.
3. Hidden routes (`about/`, `team/`, `legal/`, `config/`) share
   the same shape: `index.html` + `styles.css` + `strings.<locale>.js`
   pair, with **interlinking in the footer** so any of them is
   one click away from any other.
4. A **service worker** (`sw.js`, network-first) caches the shell
   (`FILES` list, bumped `VERSION`) so the app works offline.
5. **No build step**, no `package.json`, no frameworks, no
   bundlers, no CDN JS. The repo root is the deploy output.

### 12.1 The standalone-page shape

This is the pattern every hidden route and every public route
follows. The shape is identical across the suite; only the
contents change.

#### 12.1.1 The five-folder skeleton

Every app exposes the same five folders:

```
<app>/
  index.html              # Public entry point (the activity)
  app.js                  # Logic
  data.js                 # Locale-neutral layouts + per-locale content
  strings.es.js           # Spanish UI text (source of truth)
  strings.en.js           # English UI text
  styles.css              # App-specific styles
  assets/
    css/{tokens,base,components}.css
    fonts/                # Self-hosted Atkinson Hyperlegible + Nunito
    img/                  # App icon + decorative imagery
    js/{utils,i18n,tts,storage,feedback}.js
  about/                  # Hidden route: presentation
    index.html
    styles.css
    strings.es.js
    strings.en.js
  team/                   # Hidden route: who builds it
    index.html
    styles.css
    strings.es.js
    strings.en.js
  legal/                  # Data-protection page (linked from the footer)
    index.html
    styles.css
    strings.es.js
    strings.en.js
  config/                 # Settings (only on apps that need it)
    index.html
    app.js
    styles.css
    strings.es.js
    strings.en.js
  manifest.json
  sw.js
  _headers
  404.html
  robots.txt
  sitemap.xml
```

Single-activity apps (Teclatlon, Okeymoney) put `index.html` at
the repo root. Multi-activity apps (Apptonomia, Calculia) put
`tools/<slug>/index.html` per activity and a `site/index.html`
landing page; the four hidden folders live at the repo root.

#### 12.1.2 The HTML shell of a standalone page

Every standalone page opens with the same boilerplate. Below,
the **template**; deviations are called out where they apply.

```html
<!DOCTYPE html>
<html lang="es" data-i18n-title="pageTitle">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Okeymoney — Sobre este proyecto</title>
  <!-- Hidden route: not linked from the main menu and should not be
       indexed. Aimed at anyone who wants to know what Teclatlon is:
       families, professionals, journalists, funders, contributors. -->
  <meta name="robots" content="noindex, nofollow">
  <meta name="description" content="…">
  <meta name="theme-color" content="#FAF7F2">
  <link rel="stylesheet" href="../assets/css/tokens.css">
  <link rel="stylesheet" href="../assets/css/base.css">
  <link rel="stylesheet" href="../assets/css/components.css">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container {legal|about}">
    <header class="cabecera-{legal|about}">
      <div class="idioma-selector" role="group" aria-label="Elegir idioma">
        <button type="button" class="btn-idioma" id="btnIdiomaEs"
                data-locale="es" aria-pressed="false">🇪🇸 Español</button>
        <button type="button" class="btn-idioma" id="btnIdiomaEn"
                data-locale="en" aria-pressed="false">🇬🇧 English</button>
      </div>
      <img src="../assets/img/icono.svg" alt="" width="80" height="80"
           class="logo-{legal|about}">
      <h1>…</h1>
      <p class="lema" data-i18n="tagline">…</p>
      <p class="entradilla" data-i18n="lead">…</p>
      <nav class="indice">…optional, only on long pages…</nav>
    </header>

    <main class="pila">
      <section class="card">…</section>
    </main>

    <footer class="pie-{legal|about}">
      <a class="btn btn-secundario" href="../"
         data-i18n="footerActivities">Ir a la aplicación</a>
      <a class="btn btn-secundario" href="../legal/"
         data-i18n="footerDataProtection">Protección de datos</a>
      <a class="btn btn-secundario" href="../about/"
         data-i18n="footerAbout">Sobre este proyecto</a>
      <a class="btn btn-secundario" href="../team/"
         data-i18n="footerTeamGuide">Quiénes la hacen</a>
      <a class="btn btn-secundario" href="../config/"
         data-i18n="footerSettings">Ajustes</a>
    </footer>
  </div>

  <script src="../assets/js/utils.js"></script>
  <script src="../assets/js/i18n.js"></script>
  <script src="strings.es.js"></script>
  <script src="strings.en.js"></script>
  <script>
    (function () {
      'use strict';
      function paintLanguageSelector() {
        var active = App.i18n.locale();
        document.getElementById('btnIdiomaEs')
          .setAttribute('aria-pressed', String(active === 'es'));
        document.getElementById('btnIdiomaEn')
          .setAttribute('aria-pressed', String(active === 'en'));
      }
      document.getElementById('btnIdiomaEs')
        .addEventListener('click', function () { App.i18n.setLocale('es'); });
      document.getElementById('btnIdiomaEn')
        .addEventListener('click', function () { App.i18n.setLocale('en'); });
      paintLanguageSelector();
    })();
  </script>
  <script>
    /* Register the SW from this entry point so it is active for any
       later navigation, matching what the main index.html and the
       other standalone pages already do. */
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('../sw.js').catch(function () {});
    }
  </script>
</body>
</html>
```

**Notes:**

- `data-i18n-title="pageTitle"` on `<html>` lets `assets/js/i18n.js`
  fill `document.title` during `init()`. The hardcoded `<title>`
  is the fallback the browser tab would show before i18n.js
  executes (and the SW cache fallback).
- The page's own class on the `<div class="container …">` wrapper
  is what the page-specific `styles.css` scopes its rules under
  (`legal-page`, `about-page`, `team-page`). No more `.sp-*`
  ancestor prefixes (those were a SPA-merge leftover, retired in
  2026-09; see `git log`).
- The footer is **always** the same five links (in the same
  order) on `about/`, `team/` and `legal/`. `config/` gets a
  stripped footer that only returns to the SPA. The app root
  (`index.html`) does **not** render this footer (it has its own
  footer with the reset button and the data-protection link —
  see §2 above).

#### 12.1.3 The strings pair

Each standalone folder ships its own `strings.es.js` /
`strings.en.js`. They follow the **flat-key, IIFE-register**
pattern; `scripts/check.js` extracts the dictionary via
`vm.createContext` with a stub `App.i18n.register` and enforces
key parity between locales.

```javascript
/* legal/strings.es.js — page text (ES). */
(function () {
  'use strict';
  App.i18n.register({
    pageTitle: 'Protección de datos',
    pageDescription: 'Teclatlon: qué datos guarda, dónde y por qué. …',
    routeNotice: 'Esta página no se enlaza desde la aplicación. …',
    tagline: 'Sin registro. Sin cookies. Sin analítica.',
    lead: 'Teclatlon no pide tus datos personales. …',
    navResponsible: 'Quién trata tus datos',
    navData: 'Qué guardamos',
    /* …more keys… */
    footerActivities: 'Ir a la aplicación',
    footerAbout: 'Sobre este proyecto',
    footerTeamGuide: 'Quiénes la hacen',
    footerSettings: 'Ajustes'
  }, 'es');
})();
```

Keys are flat (no `legal.pageTitle` style namespacing); the page
**is** the namespace, because the file lives in its own folder.
Common keys (`core.back`, `core.listen`, `core.dataProtection`)
already ship in `assets/js/i18n.js` and are not redefined here.

#### 12.1.4 The standalone stylesheet

Each standalone folder ships its own `styles.css`. It is **the
old `assets/css/subpages.css` split per page**, with the
`.sp-legal` / `.sp-about` ancestor prefixes dropped (they were
a SPA-merge leftover). The page wrapper class
(`<div class="legal-page">`, `<div class="about-page">`, etc.)
is what the CSS scopes under:

```css
.legal-page { max-width: 880px; }
.legal-page .cabecera-legal { … }
.legal-page .indice a { … }
.legal-page section { … }
```

Do **not** introduce per-page classnames that collide with the
shared components (`base.css` already defines `.cabecera`,
`.lema`, `.indice`, `.btn`, `.card`, `.pila`, …). When the
standalone page needs a different look, scope the rule under
the page class — never under a generic `.cabecera` or `.indice`.

### 12.2 The shared core

Every app of the suite ships the same six files under
`assets/js/`, in the same load order, with the same exported
shape. Trimming is allowed; **adding** functionality back is
forbidden unless it serves a concrete need (the trimming notes
in §2.1 above are the canonical rationale).

| Module | Surface | Required by |
|---|---|---|
| `utils.js` | `App.utils.shuffle / $ / $$ / reducedMotion / wakeLock` | every page |
| `i18n.js` | `App.i18n.{locale, setLocale, lang, register, t, pick, apply, SUPPORTED, DEFAULT_LOCALE, LABEL, FLAG}` | every page |
| `tts.js` | `App.tts.speak` | only pages that read aloud (most do) |
| `storage.js` | `App.storage.{get, set, remove}` | only pages that read or write `localStorage` (`index.html`, `config/`) |
| `feedback.js` | `App.feedback.{success, encourage, celebrate}` | only the activity's `app.js` |

The load order is `utils.js → i18n.js → tts.js → storage.js →
feedback.js → strings.<locale>.js → data.js → app.js`. `i18n.js`
must load **before** `tts.js` and `feedback.js`, which read the
active language.

Both `strings.es.js` and `strings.en.js` always load (they're
not gated by `locale`); `App.i18n.locale()` decides which one
is active. The locale picks itself from
`localStorage['teclatlon:locale']` first, then
`navigator.language` (`'es'` fallback).

### 12.3 The PWA contract

The service worker is **network-first, cache-fallback**, declared
in `sw.js` and committed next to `manifest.json`. The contract:

```javascript
var VERSION = 'teclatlon-vN';
var FILES = [
  './index.html',
  './404.html',
  './manifest.json',
  './app.js',
  './data.js',
  './strings.es.js',
  './strings.en.js',
  './styles.css',
  /* one entry per file in the app shell, including every
     standalone page's index.html, styles.css and
     strings.<locale>.js pair */
  './legal/index.html',
  './legal/styles.css',
  './legal/strings.es.js',
  './legal/strings.en.js',
  /* …about/, team/, config/ likewise… */
  './assets/css/tokens.css',
  './assets/css/base.css',
  './assets/css/components.css',
  './assets/fonts/…woff2',
  './assets/js/utils.js',
  './assets/js/i18n.js',
  './assets/js/tts.js',
  './assets/js/storage.js',
  './assets/js/feedback.js',
  './assets/img/icono.svg'
];
```

Two rules govern changes to `FILES`:

1. **New file → add it to `FILES`.** The `install` handler
   puts each file individually (never `cache.addAll`, which
   aborts on the first failure and bricks the cache for
   everyone).
2. **Any change to a cached file → bump `VERSION`**
   (`'teclatlon-vN'` → `'teclatlon-vN+1'`). Without the bump,
   an offline user is stuck on the old version forever,
   because the `activate` handler only purges caches with a
   different name.

`scripts/check-version-bump.js` enforces (2): it
`git show HEAD:sw.js` to see what `VERSION` was at the last
commit, compares against the current `VERSION`, and checks
that `FILES` and the diff against HEAD agree. If they don't,
the script fails and the `cache-bump` CI job fails too.

Every standalone page also runs
`navigator.serviceWorker.register('../sw.js')` from its inline
script, so a direct visit to `/legal/`, `/about/` or `/team/`
primes the SW for the SPA root the same way `index.html` does.

### 12.4 i18n invariants

These are non-negotiable across the suite. A locale change is
incomplete until **every** file in this list is updated:

1. `assets/js/i18n.js#SUPPORTED` and `#DEFAULT_LOCALE`.
2. `assets/js/i18n.js#BCP47` mapping (for `speechSynthesis`
   voice selection).
3. The pre-paint detector in `index.html` (the inline
   `<script>` that picks the locale before first paint — see
   §2.5 above).
4. `strings.<locale>.js` and every per-folder
   `strings.<locale>.js` pair (`legal/`, `about/`, `team/`,
   `config/`).
5. `data.js`: every locale-split array
   (`DATA.lessons.<locale>`, `DATA.words.<locale>`,
   `DATA.templates.<locale>`, `DATA.numpadSteps.<locale>`).
6. `sw.js`: add the new `strings.<locale>.js` files to
   `FILES` and bump `VERSION`.
7. `scripts/check.js`: the parity check works in N locales
   with no code change (it picks up every
   `strings.<locale>.js` pair via `fs.readdirSync`); confirm
   the script still passes after the locale is added.

The full step-by-step recipe (with example code) is in
[`I18N.md`](I18N.md).

### 12.5 What is **forbidden** (across the suite)

These are anti-patterns observed at some point and explicitly
retired; the commit history is the source of truth for each
retirement. The rule is "if you find yourself reaching for one
of these, stop and re-read this section".

- **No SPA / no `pushState` / no `view-*` sections.** Every
  page is its own URL. Do not merge `legal/`, `about/`,
  `team/` into `index.html` as hidden sections, even with a
  redirect shim. This was tried in 2026-09 (`spa: merge`) and
  reverted in the same release; see `git log` for the lessons
  learned. Navigation between pages must always be a real
  `<a>` click, and every hidden route must be one click away
  from any other via the shared footer.
- **No `App.goLegal` / `App.goAbout` / `view-legal` /
  `view-about` / `sp-legal` / `sp-about` / `sp-idioma` /
  `subpages.css`.** These all belong to the retired SPA-merge
  model.
- **No `_redirects` SPA catch-all.** Cloudflare rejects it
  as a loop; documented in `CLOUDFLARE.md` and in the deploy
  recipe.
- **No `data-app-blocked="mobile"` flash.** The pre-paint
  script is a single inline `<script>` in `<head>`; do not
  split it into a separate `.js` (CSP `script-src 'self'`
  would still allow it, but the synchronous timing guarantee
  only holds for inline scripts in the head).
- **No `package.json`, no `node_modules`.** The repo is the
  build output. A package manifest would force Cloudflare to
  run `npm install` on every build, overshooting the 25 MiB
  asset limit.
- **No JS CDNs.** All fonts, icons and JS ship in `assets/`.
- **No ES module imports** (`<script type="module">`). The
  app must work from `file://` for offline use; ES modules
  break that.
- **No real-time database, no login, no cookies, no
  analytics.** Persistence is `localStorage` only.
- **No tappable on-screen keyboard** in apps that target the
  physical computer keyboard (Teclatlon, Okeymoney's typed
  amounts, Sinonimia's typed words). The on-screen keyboard
  is decorative only.

### 12.6 Validation checklist

Run this on every PR that touches any of the surface files
(`*.html`, `*.js`, `*.css`, `sw.js`, `manifest.json`, `data.js`):

```bash
node scripts/check.js           # must report OK (N checks, no failures)
node scripts/check-version-bump.js   # must pass
```

Then open the affected pages in a browser at
`http://localhost:<port>/<route>` and walk through the manual
smoke:

- `index.html` boots into the name screen or the menu depending
  on saved state; `localStorage` roundtrip works; the "🗑️
  Borrar mi progreso" button resets both the data and the UI.
- `/legal/` loads with the localized h1, tagline and footer;
  the language switcher toggles `lang`, `document.title` and
  every `data-i18n` text without a stale flash.
- `/about/` and `/team/` likewise; their footer links navigate
  to each other and to `/legal/` and `/config/` without reloads
  before the SW primes.
- `/config/` lists the saved state and its two reset buttons
  work (two-step confirm).
- Refresh once after first load and verify
  `navigator.serviceWorker.controller` is non-null.

If any of the above fails, the change does not match the suite
pattern and must be revised before landing.

### 12.7 Cross-repo differences (what this section does **not** cover)

Every app is a single-activity variant of the pattern above.
The per-app differences — what is shared with the suite, what
is trimmed, and what is intentionally different — are
documented in each repo's `technical.md` § "Other apps of the
suite: real differences" (the project-specific delta). Use
that section to decide whether a deviation in one repo is
intentional before copying it to another.

This canonical section lives in **every repo's**
`technical.md` / `tecnico.md`, kept in sync. If you change it
in one repo, mirror it across the others in the same PR.

### 12.8 See also

- §2 above — Teclatlon-specific recipes and contracts that
  build on this pattern.
- [`I18N.md`](I18N.md) — how to add a new language while keeping
  the i18n invariants intact.
- [`CLOUDFLARE.md`](../../CLOUDFLARE.md) — deploy and SW/header
  contracts at the Cloudflare Workers level.
- [`SPEC.md`](SPEC.md) §"Mandatory rule" — the accessibility and
  no-clinical-mention invariants every page must respect.

---



## Expanded practice

The 11 activities include three new paths, with six situations each. Each path moves from identifying an amount to comparing and deciding. Each new activity credits 12 Tokens once. The catalogue total is 210 Tokens.

- `save-step-by-step`: Save towards a goal.
- `compare-prices`: Compare before paying.
- `monthly-payments`: Organise your payments.

Hints and explanations remain until the person selects “Got it”. There is no timed progression. Completion connects learning to everyday use. Activities do not store attempts or change the euro balance.


### Situation navigation

Each exercise return link uses `#unidad-<unitId>`. The home restores the topic from that address and supports returning to the catalogue or using browser history. The runtime announces “Situation X of Y”, focuses the scene on advancement and offers a return to the topic on completion. Hints restore focus to an enabled option.
