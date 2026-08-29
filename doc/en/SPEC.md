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

## 3. Non-negotiable constraints (product)

These constraints come from the **product**, not from technology. They are
the "laws" that are never broken, because they define what kind of
experience we offer. Okeymoney shares them with [Apptonomia](../../../apptonomia),
[Calculia](../../../calculia) and [Teclatlon](../../../teclatlon), adapted
to its domain (money, not general therapeutic activities).

### 3.1 Error never punishes

- No wrong entry subtracts from the balance, stars, progress or goal
  achievement.
- A mistake produces an **encouragement** message
  (`App.feedback.encourage`), never an "incorrect" label or a phantom
  balance that disappears from the screen.
- It can be retried without limit: deleting the last digit or going
  back a step is the normal way to correct, not a "reaction to error".
- Before showing the answer, a hint is offered where it applies (for
  example, breaking the price into coins and banknotes while typing,
  §3.6).

### 3.2 No time pressure

- **No visible timers** in the interface.
- The time the person takes isn't measured (internally it can be, but
  it's not shown).
- The rhythm is set by the user: they can take a second or ten minutes
  to enter a price without anything changing.
- No "game over", no countdowns, no streaks that can be lost.

### 3.3 Easy Reading always

Cognitive accessibility is a guiding principle: every piece of content
follows **easy-read** guidelines and the **UNE 153101:2018 EX**
(Spanish easy-read standard), aligned with Inclusion Europe's European
guidelines. Comprehension outweighs technical accuracy expressed with
difficulty.

- Short sentences, one idea per screen.
- Everyday vocabulary (no jargon, no technical terms).
- No unexplained financial jargon. When the person asks to learn terms
  such as "asset", "liability" or "accounting", show a plain-language
  definition and an example beside the term.
- Unexplained technical language is only allowed in the project's
  internal documentation (`README.md`, `technical.md`, `CLAUDE.md`) and
  in [`legal/`](../../legal/index.html).
- **Whoever uses the app must never read anything in it that places
  them as "disabled", "with cognitive difficulties" or the like.**
  This is developed in §5.

### 3.4 Privacy by default

- **No registration**: email, real name or password aren't requested.
- **No cookies or analytics**: no tracking.
- **No personal data**: the balance, expenses and goals live in the
  browser's `localStorage` and never leave the device.
- The application works without an internet connection.
- **Local data contract**: `localStorage` storage is limited to a
  single shared ledger (`initialBalanceCents`, `movements[]`,
  `goals[]`) plus preferences (`locale`, `okeymoney:prefs`). **Never**
  stored: failures, time taken, attempt counts, comparisons with other
  people, detailed usage histories or identifying profiles. Data never
  leaves the device; the local backup is the responsibility of whoever
  manages the device. Progress is not synced to the cloud nor
  cross-referenced between devices.

### 3.5 Universal accessibility

- Buttons ≥ 64×64 px, spacing ≥ 16 px.
- WCAG AA contrast minimum.
- Audio **only when it adds value** (see §6, principle 6): for example,
  hearing the price just typed or celebrating a save. Never applied by
  default to every important text.
- Complete keyboard navigation.
- Respects `prefers-reduced-motion`.
- Maximum 4–6 visible options per screen (the category grid has 6
  buttons, §7).
- Compatible with screen readers (ARIA on icon buttons and feedback
  zones).

### 3.6 Train through mini-simulations of everyday life

Unlike Apptonomia, Okeymoney does not have a catalogue of therapeutic
activities: it has **real flows** (receive money, register an expense,
create a goal, add money to a goal, plan a payment and recount the
balance). It also offers safe simulations for rights, communication,
safety and unexpected problems. The principle is the same,
but applied to the product we actually have: each flow is built as a
**mini-simulation of everyday life**, a recognisable scene (a purchase,
saving up for something they want) in which the person makes a **real
decision** and sees its **immediate consequence** in the safe space of
the app (their balance, their goal, their history).

This applies to every flow the app already has:

- **Scene + decision** (e.g. `Register an expense`: "what did you
  spend on?" → 6 large categories).
- **Step-by-step guidance** (e.g. `Create goal`: picture + name +
  price).
- **Immediate reinforcement** (e.g. `Add money to a goal`: the progress
  bar advances live and the amount is subtracted from the Mi dinero
  balance on confirm).
- **Reversible rehearsal** (e.g. a safety or complaint decision): the
  person practises a response without changing the ledger.
- **Asset life**: estimate depreciation with a transparent formula and
  decide how to respond to obsolescence (repair, reuse or replace),
  without automatically recording an expense.
- **Return and risk**: calculate a hypothetical gain and check whether it
  fits the time horizon, access to money and diversification; a return is
  never presented as a promise.
- **Investment operations**: distinguish buying or contributing, selling or
  redeeming, collecting returns and transferring, without connecting to a
  broker or executing any order.
- **Bank cards and accounts**: distinguish debit, credit, prepaid, current
  and savings products by where the money comes from and when it is charged,
  without recommending providers or opening products.
- **Housing**: compare renting and owning by reviewing upfront costs,
  payments, maintenance, flexibility and time horizon, without presenting one
  option as universally better.

The mandatory anatomy of an Okeymoney flow is:

1. **Everyday context**: each step opens with one short, concrete
   sentence ("What did you spend on?", "How much?", "How much do you
   want to save?") that anchors what is about to happen in the
   person's real life.
2. **Real decision**: 1–6 large, visible options; one unambiguous
   decision should cost one tap, not two.
3. **Immediate preview**: in the numeric step, the amount is broken
   down into coins and banknotes live (design principle 11) — the
   person sees the visual consequence before confirming.
4. **Explicit confirmation**: there is always a final step with a
   summary + one big "Save" button; nothing is saved silently.
5. **Visible consequence**: on save, the person returns to Mi dinero
   and sees the balance, the goal and the history already updated —
   the direct cause and effect of what they just did.

#### 3.6.1 Socratic method and significant learning

Okeymoney does not train "skills in the abstract": it trains **everyday
life with money**. This rests on two foundations the product formally
declares as non-negotiable:

- **Significant learning** (in the Ausubel–Novak sense): practice is
  anchored in what the person already knows about home, neighbourhood
  and routines — never in abstract examples or technical vocabulary.
  The new is connected to the known (the *substantive relation*
  criterion), and what was practised closes with an explicit line that
  returns it to the moment of the day it will be useful — the
  *transfer*.
- **Socratic method**: faced with a decision, the person **chooses
  first**; only if they fail are they offered **a hint** (first
  failure) and, if they fail again, **the explanation** that
  justifies the correct answer (second failure). They are never told
  "incorrect" and nothing is taken from them: each mistake is one
  step closer to understanding, not punishment. This is the basis of
  the `hint → explanation → transfer` pattern the Aprender activities
  (`tools/`) already use — and that any future practice flow must
  respect.

The full Socratic anatomy, step by step:

1. **Anchored question**: the screen opens with an everyday scene and
   one clear, concrete question (not rhetorical, not decorative).
2. **The person's decision**: 3–6 large options. The person chooses
   first.
3. **Correct answer**: positive reinforcement
   (`App.feedback.success` or `App.feedback.celebrate`), no redundant
   copy.
4. **First mistake**: encouragement message (`App.feedback.encourage`)
   + **a hint** (`App.feedback.lockUntilAck` or equivalent: reading
   pause + continue button). The person chooses again.
5. **Second mistake**: the correct option is highlighted; the
   **explanation** that justifies why it is right is shown; advance.
6. **Transfer**: on closing the round, one line connects what was
   learned to a real moment of the day when it will be useful (e.g.
   "you'll use this the next time you go to the bakery").

In v1's numeric flows (register expense, recount balance, create goal,
add to goal) this pattern **is not applied literally** because they
are data entries, not exercises: the person is not "failing" by
choosing a category — they are describing what happened. What **is**
always applied is the **transfer**: every confirmation closes with a
line that returns the action to the moment of the day ("now your hucha
has 3,00 € for the headphones").

#### 3.6.b Design decision: the fictitious Tokens currency

Okeymoney internally handles **two clearly separated money planes**:

- **Real plane** — `okeymoney:data` (€): the person's euro balance,
  expenses and goals. It is the accounting truth the app exposes, and
  it never mixes with the fictitious currency. It is governed by the
  constraints of §3.1–§3.7 above.
- **Practice plane** — `okeymoney:practiceWallet` (Tokens 🔷): a
  **fictitious** currency, with no real monetary value, that the
  person **earns** by completing activities in the Aprender tab (each
  `tools/<slug>/` credits a fixed amount once per activity, recorded
  in `App.wallet.markActivityDone`). Tokens **can be spent or
  withdrawn** inside the app: a symbolic shop of cosmetic rewards
  (goal icons, backgrounds, stickers) and a future flow with an
  entity representative (person/family member, bank, business,
  organisation) who credits or withdraws Tokens to/from the person.
  Neither plane modifies the other: a € expense never credits Tokens,
  and spending Tokens never touches the € balance.

This dual plane is a **prioritised design decision**, not an
exception to justify case by case: it lets the person practise money
situations with real consequences (their balance changes) and, at the
same time, accumulate a fictitious balance that reinforces practice
without confusing it with real money — preserving §3.4 (privacy and no
personal data) and §3.2 (no pressure: Tokens only ever add, never
subtract as punishment).

#### 3.6.c Design decision: income and balance

Okeymoney provides a separate **receive money** flow for recording real
income (pocket money, work, a gift or a refund). Tapping the balance still
opens the recount wizard: it recalculates the starting point without
rewriting history. Both paths write movements to the same ledger and keep
the balance coherent.

### 3.7 Persuasive communication in service of learning

Beyond the mini-simulation vehicle, every screen must communicate **in
service of the person, never in service of pressure**. Concretely, the
whole interface must apply the communication disciplines listed below.

1. **Didactic and explicit** — the goal of each step is announced in
   one short sentence ("What did you spend on?", "How much do you
   want to save?"); the buttons confirm the choice before advancing;
   goals are confirmed with a summary before saving.
2. **Art effects with care** — animation is used to **guide the
   gaze**, not to decorate: intentional and slow, only one element
   moves at a time, disabled with `prefers-reduced-motion`, soft
   reinforcement on save, **no flashing, no invasive fireworks**.
3. **Warm micro-narrative (storytelling)** — each flow sits in a
   recognisable scene (a shop purchase, a hucha for something they
   want); the celebration on save connects what was saved to its
   consequence ("you now have 3,00 € in your hucha for the
   headphones").
4. **Good copy** — short sentences (≤ 12 words), active voice,
   second person, positive imperatives, no sarcasm, no double
   meanings, TTS-friendly.
5. **Clear call to action** — one visible CTA per step, imperative
   verb, final CTAs that **invite to go back to Mi dinero or keep
   registering**, never to "share" or "unlock a challenge".
6. **Gamification in moderation** — celebration on save, "achieved"
   mark on a reached goal, **no leaderboards**, **no subtracting**
   stars or progress in any case.
7. **Explicitly forbidden marketing patterns** — the following
   patterns are part of the "pressure" we ban and **must not** appear
   anywhere in the app:
   - **Scarcity**: "Only 1 left!", "Last chance", "Hurry",
     countdowns, disappearing rewards.
   - **False urgency**: timers, racing, "ends soon", punishing
     slowness (clashes with §3.2).
   - **Social proof turned into pressure**: leaderboards, ranks,
     comparisons with other people, "others already did it" as
     social pressure (clashes with §3.1).
   - **Sunk-cost / FOMO**: "you'll lose your progress if you close",
     "don't miss your streak", forced retention messaging (clashes
     with §3.2).
   - **Manipulative reciprocity / dark patterns**: forced signups,
     pre-checked boxes, hidden costs, fake alerts.
   - **Exploitative loss aversion**: "you had 5 €, you lost 2". The
     balance and goals only ever add, never subtract as punishment.

The default tone in Okeymoney is **calm and predictable**: the person
manages their money because the app makes it easy, not because we are
pushing them.

## 4. Design principles

These principles **rule over any other decision**. If a task conflicts
with them, the principles win. They are the product's compass. Okeymoney
shares them with Apptonomia, Calculia and Teclatlon, adapted to its
domain.

1. **Easy Reading**: short sentences, one idea per sentence, everyday
   vocabulary, no metaphors.
2. **One action per screen**: the user should never have to choose
   between more than 4–6 visible options at once.
3. **Large touch targets**: buttons minimum **64×64 px**, minimum
   spacing 16 px.
4. **Large typography**: 20 px base, 28–36 px titles, legible font
   (Atkinson Hyperlegible or Nunito).
5. **Single light theme** with high contrast (WCAG AA minimum,
   AAA whenever possible) — calm blue-green accent on neutral light
   surfaces (tokens in [`assets/css/tokens.css`](../assets/css/tokens.css)).
   A per-tab accent shifts via `data-tema` on `<body>` (`dinero` =
   green, `metas` = blue, `aprender` = amber) — `data-tema` does
   not switch between light and dark, only between three accents on
   the same light theme.
6. **Audio only when it serves a purpose**: audio (🔊 button, Web
   Speech API, es-ES / en-US, speed 0.9) is used only when gamification
   or the flow design requires it (e.g. hearing the price just typed,
   celebrating a save). It is not applied by default to every
   important text.
7. **No pressure**: no visible timers, no negative scoring, no "game
   over", no streaks that can be lost.
8. **Immediate positive reinforcement**: visual + sound celebration on
   saving an expense or a goal contribution (≤ 2 s).
9. **`prefers-reduced-motion`**: all animations are disabled if the
   system requests it.
10. **Autonomy**: works offline (PWA), no login, no cost, no personal
    data.
11. **Visual metaphors over abstract numbers**: every amount is always
    shown as a formatted price ("3,50 €") **and** as coins and
    banknotes drawn on screen, never as a raw decimal a person has to
    parse mentally.
12. **Sober technology**: HTML5 + CSS3 + vanilla JavaScript, no
    frameworks, no build step, no npm dependencies, offline-first PWA.
    Guarantees the app can be served as a set of static files and stay
    working for years without breaking.
13. **Train through mini-simulations of everyday life**: each flow is
    built as a recognisable scene (a purchase, saving up for something
    they want) in which the person makes a decision and sees its
    immediate consequence in the safe space of the app. The mandatory
    anatomy and anchors live in §3.6.
14. **Persuasive communication in service of learning**: the whole
    interface is highly didactic (visible goal, implicit example in the
    preview, scaffolding at each step), applies art effects with care
    (slow, single-element, respects `prefers-reduced-motion`, no
    flashing), uses a warm micro-narrative, good copy, a clear call to
    action and gamification in moderation — and **never** uses
    scarcity, false urgency, social-proof pressure, FOMO, dark
    patterns or exploitative loss aversion. The full list of
    forbidden patterns lives in §3.7. The person manages their money
    because the app makes it easy, not because we are pushing them.

## 5. Mandatory rule: zero mentions in the user-facing product

**No text the end user sees may mention, directly or indirectly,
intellectual disability, occupational therapy, minors, children, or
equivalent expressions** ("cognitive difficulties", "special needs",
"different abilities", "underage", etc.). This includes everything
visible in the interface: `index.html`, `app.js`, `data.js`,
`strings.<locale>.js`, and `legal/`. The reason is exactly the one
from §1 and §2: that nobody who uses the app feels singled out,
inferior, or discriminated against by what the app itself says about
them.

Where it applies and where it doesn't:

- **It applies** to everything the end user sees: titles, meta
  descriptions, buttons, labels, messages, icon alt text, footers.
- **It doesn't apply** to the project's internal documentation (this
  document, `README.md`, `CONTRIBUTING.md`, `CLAUDE.md`): those files
  are read by whoever maintains or contributes to the project, not by
  the end user, and that's exactly where the product's real objective
  must be explained (see §2). The §2 mention of the audience is
  internal context, not visible to whoever uses the app, and is the
  very reason this rule exists.

This rule is checked automatically: `node scripts/check.js` fails if
any of those terms show up in the files the end user sees.

### 5.1 Public-facing wording: "usuario/a tipo" euphemism

When presenting Okeymoney to **the general public** (press, talks,
public READMEs that anyone can read, the metaproject landing at
`apptonomia.uk`, social media copy, marketing material), the term
**"intellectual disability" / "discapacidad intelectual"** must not be
used as a way to describe the audience of the app — even when the
surrounding text would otherwise be public. The accepted euphemism for
that audience in those surfaces is **"usuario/a tipo"** (plural
"usuarios/as tipo"), used as a generic profile marker, not as a label
for any real person.

Where the euphemism applies and where it doesn't:

- **Applies** to any text that anyone outside the project can read
  without authentication: `README.md`, `README.es.md`, the portal at
  `apptonomia.uk`, public talks, social media copy, press notes,
  marketing material. In these surfaces, refer to the audience as
  "el/la usuario/a tipo" or "usuarios/as tipo" of the app.
- **Does NOT apply** to this repo's internal documentation
  (`CLAUDE.md`, `doc/en/SPEC.md`, `doc/es/SPEC.md`, `technical.md`,
  [`roles.md`](roles.md), `CONTRIBUTING.md`, `CONTRIBUTING.es.md`) —
  those files are read by maintainers and contributors, and
  "intellectual disability" / "discapacidad intelectual" remains the
  canonical term there, because the project needs an explicit,
  unambiguous explanation of its real objective for whoever maintains
  it.
- **Does NOT apply** to project content that names a clinical concept
  by its real-world name (e.g. an activity about a real bureaucratic
  procedure related to disability): that is content, not labelling of
  an audience.
- **Does NOT apply** to the UI of the app itself: §5 above continues
  to forbid **any** mention, including "usuario/a tipo", in
  `index.html`, `app.js`, `styles.css`, `strings.<locale>.js`,
  `legal/`, and any other user-facing surface. The euphemism is for
  the outside world, not for what the visitor reads on the site.

Rationale: presenting the project's real objective in maintainer docs
is useful and necessary; presenting it in marketing or landing
surfaces is neither necessary nor respectful of the audience —
"usuario/a tipo" lets public material describe what the app is for
(who the typical profile is) without publicly naming a clinical group.

## 6. Navigation shape (max 3 levels, always predictable)

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

## 7. Modules (current scope)

### 7.1 Mi dinero (Home / dashboard)

Shows, front and center: how much money the person has right now, as a
big number **and** as coins/banknotes. Tapping the number opens a
one-step wizard to recount and update it — this is the deliberately
simple stand-in for "registering income" in v1 (see §9). Below it, the
five most recent movements (expenses and goal contributions), each with
its icon, name and signed amount.
The header also displays a **practice wallet chip** showing the
person's Tokens balance (read-only). The two ledgers are independent:
Tokens earned in practice activities never mix with the € balance, and
there is no transfer between them.
### 7.2 Mis metas (Mi hucha / savings goals)

A list of goals (icon + name + target price, chosen by the person),
each with a progress bar and the exact amounts ("3,00 € de 8,00 €").
Creating a goal is two steps (pick a picture and a name; write the
price). Adding money to a goal reuses the same one-step amount wizard as
everything else, and the contribution is subtracted from the money shown
in Mi dinero — saving means that money is set aside, not spent freely.
Reaching the target marks the goal as achieved with a small celebration;
achieved goals are never deleted automatically.

### 7.3 Registrar un gasto (Register an expense)

The flagship three-step flow (fully specified in `technical.md` §6, and
already implemented in `app.js`): pick a category, enter the price,
confirm and save. See §8 below for the exact rationale of each step.

### 7.4 Aprender (Learn) — practice plane

The Aprender tab opens the product's **library of practice
activities**. Each activity (`tools/<slug>/`) is a mini-simulation of
an everyday money situation, built on the Socratic pattern from
§3.6.1: anchored question → decision → correct/reinforcement, or
first mistake → hint, second mistake → explanation, always with a
transfer at the end.

Activities are grouped into **themed sections** (Apptonomia-style: a
heading with a distinct accent color per theme), shown in a fixed
order from the most educational theme to the most practical one:

**Theme: Learn to manage your money** — the core progression, concept
→ practice, increasing difficulty:

| Slug | Activity | Reward (Tokens 🔑) |
|---|---|---|
| `concepts-money` | What is money? (identify coins and banknotes) | +5,00 |
| `needs-vs-wants` | Need or want | +8,00 |
| `budget-first` | What do I buy first? (prioritise within a budget) | +12,00 |
| `go-shopping` | Going to the shop (pick the pair that fits the budget) | +20,00 |
| `change-back` | Working out change | +30,00 |
| `my-shopping-day` | My shopping day (integrating: coin + need/want + budget + change) | +60,00 |

**Theme: Keep your money safe** — real-world scam awareness, shown
last because it is the highest-stakes practical skill in the
catalogue:

| Slug | Activity | Reward (Tokens 🔑) |
|---|---|---|
| `safe-money` | My money is safe (erroneous transfers and scams: phishing, fake bank call, urgent Bizum impersonating a family member, fake resale listing) | +15,00 |

Each activity credits Tokens **once per person**
(`App.wallet.markActivityDone`, idempotent). Repeating it does not
credit more, but stays possible if the person wants to keep
practising. The Tokens amount each activity shows in its header comes
from the `rewardCents` field in its `data.js` and is formatted with
`App.money.formatPractice`.

> The 🔑 symbol and the `token` / `tokens` / `subtokens` names are
> registered in `App.money.practice` (see `assets/js/money.js`) and
> localised through the `practice.*` keys of each
> `strings.<locale>.js`. Keeping es/en parity on those keys is
> mandatory (`scripts/check.js`).

#### 7.4.1 Practice plane: Tokens

Okeymoney exposes, below the € coin/banknote preview in Mi dinero, a
card with the person's **Tokens balance** (formatted with
`App.money.formatPractice`) and two big buttons:

- **+ Earn / credit Tokens** — opens a one-step wizard where the
  person says how many Tokens they want to add and, optionally, which
  **entity representative** is giving them to the person (see
  §9.5). By default the source is practice ("for completing an
  activity"); with a representative it is a person/family member, a
  bank, a business or an organisation.
- **− Spend / withdraw Tokens** — opens a one-step wizard where the
  person says how many Tokens they want to remove and, optionally,
  which representative is taking them, or whether they are spending
  them in the symbolic shop of §9.4.

The Tokens balance is computed by `App.wallet.balance()` from
`okeymoney:practiceWallet` (see `technical.md` §10). It is **never**
mixed with the € balance: the two ledgers are independent and stored
under separate `localStorage` keys.

## 8. The "Register an expense" flow, step by step

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
   metaphor from principle 11, updated on every keystroke. "Next" stays
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

## 9. Deliberate simplifications in this first version

Documented here so they are treated as prioritised decisions, not gaps
discovered by accident:

- **Planned payments do not subtract balance automatically.** A person
  can note a committed payment with an optional date; the app marks past
  dates, but only a confirmed expense changes the ledger. This avoids
  phantom movements and automatic charges.
- **No withdrawing money from a goal.** Once contributed, savings stay
  committed to that goal in v1. Needed before shipping a real "spend
  from my hucha" use case.
- **No independent sound setting yet.** The Settings and data screen now
  offers text size, local backup/restore and an explicit data reset; sound
  still follows the device preferences.
- **Aprender has 8 working activities** (`tools/`) and exposes them
  inside the didactic units. Their Token rewards remain separate from the euro
  ledger.

### 9.4 Symbolic shop (prioritised design decision, **not implemented in v1**)

Okeymoney contemplates a **symbolic shop** where the person can
"spend" Tokens on cosmetic rewards: changing the icon or colour of
an achieved goal, screen backgrounds, stickers, etc. The catalogue
would be a fixed array in `data.js` (`tokenShop`), each reward
declared as `{id, nameKey, icon, costCents}`. Buying one is a
one-step wizard (similar to "Add money to a goal"): pick reward →
confirm.

Design decisions already locked in for when it gets implemented:

- **No pressure**: no reward is "exclusive for a limited time"; every
  one is optional and unlockable purely by preference.
- **Cosmetic, never monetary**: nothing in the shop modifies the €
  balance. The Tokens spend comes out of the practice ledger
  (`App.wallet.credit(-costCents, 'shop:<id>')`) and never out of the
  real one.
- **No real money**: no reward is bought with €. Tokens only.
- **No leaderboards, no scarcity**: no "last one available" or "only
  3 left" messaging (§3.7.7).

### 9.5 Entity representative (prioritised design decision, **not implemented in v1**)

A person, a family member, a bank, a business or an organisation can
act as an **entity representative** who **credits** Tokens to the
person (external reward, transfer) or **withdraws** Tokens from the
person (refund, symbolic charge). The planned flow has two steps:
pick representative type (person 👤 / bank 🏦 / business 🏢 /
organisation 🏛) → write a free-text name ("my cousin Laura", "mum's
bank"). Maximum 4 options per screen (§3.5 accessibility rule).

Design decisions already locked in for when it gets implemented:

- **Closed list of types** in `data.js` (`representativeTypes`), with
  one icon and one name per type. The representative's name is free
  text typed by the person.
- **Operates on Tokens only**, never on €. It is the symbolic
  equivalent of an income or a withdrawal for the practice plane, and
  respects §3.4 (privacy: the representative's name never leaves the
  device, only saved into the Tokens history).
- **Full history**: every Tokens movement is recorded in
  `okeymoney:practiceWallet.history` with its reason
  (`representative:<type>:<name>`, `shop:<id>` or `activity:<slug>`),
  just like the activities (`activity:<slug>`). History is capped at
  the last 50 movements for UX (see `wallet.js`).
- **No pressure**: Tokens are never withdrawn as punishment. A
  representative can withdraw them as part of an agreed exchange or
  symbolic charge, not as a penalty.

## 10. Language policy

UI is bilingual (`es`/`en`); `es` is the default and the source of truth
when a key is missing. Product content changes (categories, screen copy,
goal icons) must ship in both languages — see `technical.md` §5. Code
(identifiers, comments, commit messages) is always English.
