# Activities catalogue

> Okeymoney ships with **5 didactic units and 11 practice activities**.
> The home shows the five units first; each unit links to the activities
> that practise it (see `DATA.learningPath` in `data.js`). The home separates
> situations, actions with money and ideas for caring for it into three large
> parts (see
> [`SPEC.md`](SPEC.md) §7): *Conceptos básicos* (2
> activities, the educational core), *Vida cotidiana* (8 activities,
> increasing difficulty, simulation and practice) and *Seguridad* (1
> activity, shown last because it is the highest-stakes practical
> skill). Each activity is a standalone `tools/<slug>/` folder that
> reuses the shared `assets/js/activity-runtime.js` Socratic loop (or
> the numeric-keypad variant used by `change-back`).

## Complete learning journey

The recommended order is **explain → practise → apply**. Activities are
not locked: people can repeat them or choose another one, but the home
presents one five-unit path to reduce cognitive load and support transfer
to everyday life.

Each activity starts with a short explanation and an example. The person
then presses **Try situations** and answers the cases. This checks whether
they can use the idea instead of showing a questionnaire immediately.

| Unit | Main idea | Activities | Later euro application |
|---|---|---|
| 1. Count your money | Coins, notes and balance | `concepts-money` | Review and update the balance |
| 2. Choose before buying | Needs, wants and pausing | `needs-vs-wants`, `before-buying` | Decide before recording an expense |
| 3. Organise your shop | Priorities and budget | `budget-first`, `go-shopping` | Plan a purchase and a goal |
| 4. Pay and check | Change and a complete shop | `change-back`, `my-shopping-day` | Review the amount and save |
| 5. Keep your money safe | Unusual messages, calls and requests | `safe-money` | Check safety before any payment |

The last column describes the transfer available today. The simulation
block now also includes change practice with euro amounts and three safety
decisions before sending money. Neither gives Tokens or changes the
ledger: the person rehearses first, then chooses whether to record a real
expense.

## Extensible relation between units, activities and simulations

The relation is declared once in `data.js`: every entry in
`DATA.activities` and `DATA.simulations` carries a `unitId` pointing to an
entry in `DATA.learningPath`. The home generates its cards from these
catalogues; activities and simulations are not added by hand-writing HTML.
To expand the content:

1. Add or adjust a unit in `DATA.learningPath` when needed.
2. Register each activity in `DATA.activities` with its `unitId` and route.
3. Register each simulation in `DATA.simulations` with its `unitId`, group,
   language keys and action.
4. Add the strings in English and Spanish, then run
   `node scripts/check.js`.

The checker detects duplicate ids, units without activities, references to
missing units, broken routes and simulation actions the app does not know.
This lets the catalogue grow without breaking the visible journey.

## The three basic agents

Every case is grounded in one of the **three basic agents** a person
meets in everyday money life. Activities reuse the same agent set
defined in [`assets/js/activity-runtime.js`](../../assets/js/activity-runtime.js)
and never invent ad-hoc emojis.

| Agent | Avatar | Spanish | English | What it stands for |
|---|---|---|---|---|
| Persona | 👤 | Persona | Person | You, your family, someone you know |
| Empresa | 🏪 | Empresa | Shop | Supermarket, pharmacy, bus, clothes shop |
| Banco | 🏦 | Banco | Bank | Your bank (card, savings, transfers) |

Each case names the agent it involves (e.g. *"El bus"*, *"La farmacia"*,
*"El banco"*) so the learner sees *who* they are transacting with.

## Activities, in order

### Theme: Conceptos básicos (`theme: 'concepts'`)

| # | Slug | Title (es / en) | Agents | Cases | Reward (okeys) |
|---|---|---|---|---|---|
| 1 | `concepts-money` | Cuenta tu dinero / Count your money | — (money skills) | 29 | 🔑 12,00 |
| 2 | `needs-vs-wants` | Necesito o quiero / Need or want | persona | 30 | 🔑 8,00 |

### Theme: Vida cotidiana (`theme: 'daily'`)

| # | Slug | Title (es / en) | Agents | Cases | Reward (okeys) |
|---|---|---|---|---|---|
| 3 | `budget-first` | ¿Qué compro primero? / What do I buy first? | persona, empresa, banco | 8 | 🔑 12,00 |
| 4 | `before-buying` | Cuatro preguntas antes de comprar / Four questions before buying | persona | 4 | 🔑 10,00 |
| 5 | `go-shopping` | Ir a la tienda / Go shopping | persona, empresa, banco | 8 | 🔑 20,00 |
| 6 | `change-back` | Calcular la vuelta / Working out change | empresa | 6 | 🔑 30,00 |
| 7 | `my-shopping-day` | Mi compra del día / My shopping day | persona, empresa, banco | 5 | 🔑 60,00 |

### Theme: Seguridad (`theme: 'safety'`)

| # | Slug | Title (es / en) | Agents | Cases | Reward (okeys) |
|---|---|---|---|---|---|
| 8 | `safe-money` | Mi dinero está seguro / My money is safe | — (scam scenarios) | 6 | 🔑 15,00 |

**Total if every activity is completed: 🔑 210,00.**

The activities keep these three themes as pedagogical metadata, but the
home presents them inside their didactic units. Units follow
`DATA.learningPath`: *Conceptos básicos* comes first as the
educational core, *Vida cotidiana* increases difficulty, and *Seguridad*
closes the journey because it has the greatest practical consequence.
The second home part provides the practical context and simulations for each
unit; the third gathers ideas for caring for money (see
[`technical.md`](technical.md) §10.3).

## 1. Concepts: count your money (`tools/concepts-money/`)

**Goal:** recognise coins and banknotes, count several pieces, make
equivalent values, and work out change. The activity presents the values
first. It then gives 29 ordered cases from easiest to harder. Each case
shows visual pieces (rendered by `App.money.createToken()`) and offers
three options.

## 2. Need or want (`tools/needs-vs-wants/`)

Classify 30 everyday situations: do you need it, want it, or need it and
choose an extra? The cases cover food, housing, health, bills, transport,
leisure, services, and purchases where a need is mixed with a personal
choice. Each situation explains what problem appears if the purchase is
missing and which part may only be a preference. The persona agent is always
**Tú** or **Tu familia** because this decision is personal. The first wrong
answer activates a question to help the person think; the second shows the
explanation and the correct answer.

## 3. What do I buy first? (`tools/budget-first/`)

Given a small budget and three to four candidate purchases, choose
which one to buy **first** and recognise fixed or optional expenses. The
agent changes per case (family, pharmacy, bus, bank) so the learner
practices classification and prioritisation under realistic constraints.
Eight cases.

## 3.1 Four questions before buying (`tools/before-buying/`)

This unit uses original wording and simple situations to adapt the four-question
technique for slowing impulse purchases described by
[Preahorro](https://preahorro.com/como-ahorrar/4-preguntas-que-debes-hacerte-antes-de-comprar-cualquier-cosa/).
It practises checking need, debt, price alternatives and future usefulness.

## 4. Go shopping (`tools/go-shopping/`)

Given a budget, pick the **two** items that fit. Each case uses a real
shop (Mercadona, pharmacy, bus, clothes shop, bank) so the learner sees
the same agent they would face in the street.

## 5. Working out change (`tools/change-back/`)

Numeric-keypad mechanic. Pay with a coin or banknote, buy something
cheaper, type the change owed (`paid − cost`). The agent is always a
**shop** because that's who you meet at the till. Six cases, easy → hard.

## 6. My shopping day (`tools/my-shopping-day/`)

The final activity of the *Vida cotidiana* theme: five cases that walk through one
realistic shopping trip end to end — think first, prioritise what to
buy, pick items at the shop, work out the change at the till, and save for
a goal. The
agent sequence mirrors real life: persona → empresa → empresa → banco.

## 7. My money is safe (`tools/safe-money/`)

The *Seguridad* theme. Six real-world scam scenarios
(unexpected Bizum, phishing SMS, a caller impersonating the bank, an
urgent "family member" asking for money, a too-good resale deal) — the
learner picks the safe action for each (e.g. call the bank, don't
click the link, hang up and verify). No agent card: the scene itself
(a message, a call, a listing) is the antagonist.

## How a case is structured

Each case is a single object inside the activity's `app.js`:

```js
{
  id: 'b1',
  agente: 'persona',          // persona | empresa | banco (optional)
  agenteName: 'shopFamilia',  // i18n key in strings.<locale>.js
  instruccionKey: 'b1instr',  // prompt shown above the scene
  escenaHtml: '<p>🍞 2 € · 🎮 30 € · 💧 1 €</p>',
  opciones: ['opAgua', 'opPan', 'opJuego'],  // 3 i18n keys, shuffled
  correctaIndex: 1,
  pistaKey: 'b1pista',         // shown on first mistake
  explicacionKey: 'b1expl'    // shown on second mistake + final reveal
}
```

The shared runtime ([`assets/js/activity-runtime.js`](../../assets/js/activity-runtime.js))
takes care of:

- Rendering the agent card (avatar + label + name).
- Showing 3 shuffled option buttons.
- First mistake → hint; second mistake → reveal the right option + explanation.
- After the last case: credits the **practice wallet** via `App.wallet.credit(...)`
  (idempotent) and marks the activity as `done`.

## Practice wallet

Completing an activity credits the user's **practice wallet** (the
*"okey"* currency, 🔑). This is a **completely independent ledger** from
the real Mi dinero balance:

- Practice wallet: `localStorage['okeymoney:practiceWallet']`, integer cents in okeys.
- Real ledger: `localStorage['okeymoney:data']`, integer cents in euros.

There is **no conversion and no transfer** between the two. The learner
sees both balances on screen (Mi dinero shows both; Aprender shows the
practice wallet) and understands that what they earn in practice does
not affect their real money.

## Expanded practice

The 11 activities include three new paths, with six situations each. Each path moves from identifying an amount to comparing and deciding. Each new activity credits 12 Tokens once. The catalogue total is 210 Tokens.

- `save-step-by-step`: Save towards a goal.
- `compare-prices`: Compare before paying.
- `monthly-payments`: Organise your payments.

Hints and explanations remain until the person selects “Got it”. There is no timed progression. Completion connects learning to everyday use. Activities do not store attempts or change the euro balance.
