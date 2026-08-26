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

Full reference: [`doc/en/I18N.md`](I18N.md) (and its [`doc/es/I18N.md`](../es/I18N.md)
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

Seven activities live under `tools/<slug>/`. Each one is a self-contained
folder with `index.html`, `app.js`, `strings.es.js`, `strings.en.js`,
plus optional `data.js` and `styles.css`. All activities reuse the
shared Socratic loop in `assets/js/activity-runtime.js`
(`App.activity.run(opts)`); `change-back` is the only one that uses a
custom keypad mechanic instead.

Per [`PRODUCT-DESIGN.md`](PRODUCT-DESIGN.md), each **home** unit combines
two consecutive phases: a didactic explanation followed by its
corresponding test. `renderDidacticLessons()` builds these units from
`DATA.didacticLessons` + `DATA.learningIndex`, and links each available
test to its real `tools/<slug>/` route. The test block no longer repeats
the catalogue: `renderTestIndex()` provides a compact index that returns
to the unit where each test is performed. Units follow
`DATA.didacticLessons`; the test index follows `DATA.activities`.

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
