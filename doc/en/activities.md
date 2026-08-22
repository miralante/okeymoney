# Activities catalogue

> Okeymoney ships with **7 practice activities**, grouped into **three
> themed sections** (see `DATA.learnThemes` in `data.js`) rendered on
> the home catalogue and, redundantly, on the Aprender tab (see
> [`PRODUCT-DESIGN.md`](PRODUCT-DESIGN.md)): *Conceptos básicos* (2
> activities, the educational core), *Vida cotidiana* (4 activities,
> increasing difficulty, simulation and practice) and *Seguridad* (1
> activity, shown last because it is the highest-stakes practical
> skill). Each activity is a standalone `tools/<slug>/` folder that
> reuses the shared `assets/js/activity-runtime.js` Socratic loop (or
> the numeric-keypad variant used by `change-back`).

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
| 1 | `concepts-money` | ¿Qué es el dinero? / What is money? | — (object identification) | 8 | 🔑 5,00 |
| 2 | `needs-vs-wants` | Necesito o quiero / Need or want | persona | 8 | 🔑 8,00 |

### Theme: Vida cotidiana (`theme: 'daily'`)

| # | Slug | Title (es / en) | Agents | Cases | Reward (okeys) |
|---|---|---|---|---|---|
| 3 | `budget-first` | ¿Qué compro primero? / What do I buy first? | persona, empresa, banco | 6 | 🔑 12,00 |
| 4 | `go-shopping` | Ir a la tienda / Go shopping | persona, empresa, banco | 8 | 🔑 20,00 |
| 5 | `change-back` | Calcular la vuelta / Working out change | empresa | 6 | 🔑 30,00 |
| 6 | `my-shopping-day` | Mi compra del día / My shopping day | persona, empresa, banco | 4 | 🔑 60,00 |

### Theme: Seguridad (`theme: 'safety'`)

| # | Slug | Title (es / en) | Agents | Cases | Reward (okeys) |
|---|---|---|---|---|---|
| 7 | `safe-money` | Mi dinero está seguro / My money is safe | — (scam scenarios) | 6 | 🔑 15,00 |

**Total if every activity is completed: 🔑 150,00.**

Each theme is rendered as its own `<section class="learn-theme">` with
a distinct accent color (`--acento` green / `--acento-2` blue /
`--acento-3` amber in `assets/css/tokens.css`), Apptonomia-style —
see [`technical.md`](technical.md) §10.3. *Conceptos básicos* is shown
first because it is the educational core; *Vida cotidiana* is
simulation and practice, increasing difficulty; *Seguridad* comes last
because recognising scams is the most consequential real-world skill
in the catalogue.

## 1. Concepts: what is money? (`tools/concepts-money/`)

Identify coins and banknotes by value. Each case shows a visual token
(rendered by `App.money.createToken()`) and asks *"how much is this?"*,
with three amount options. Teaches the **CATALOG** from
[`assets/js/money.js`](../../assets/js/money.js): 5c, 10c, 20c, 50c, 1 €,
2 €, 5 €, 10 €, 20 €, 50 €.

## 2. Need or want (`tools/needs-vs-wants/`)

Classify eight everyday items: is the item a need, a want, or both?
The persona agent is always **Tú** or **Tu familia** because this
decision is personal.

## 3. What do I buy first? (`tools/budget-first/`)

Given a small budget and three to four candidate purchases, choose
which one to buy **first**. The agent changes per case (family, pharmacy,
bus, bank) so the learner practices prioritisation under realistic
constraints.

## 4. Go shopping (`tools/go-shopping/`)

Given a budget, pick the **two** items that fit. Each case uses a real
shop (Mercadona, pharmacy, bus, clothes shop, bank) so the learner sees
the same agent they would face in the street.

## 5. Working out change (`tools/change-back/`)

Numeric-keypad mechanic. Pay with a coin or banknote, buy something
cheaper, type the change owed (`paid − cost`). The agent is always a
**shop** because that's who you meet at the till. Six cases, easy → hard.

## 6. My shopping day (`tools/my-shopping-day/`)

The final boss of the *Vida cotidiana* theme: four cases that walk through one
realistic shopping trip end to end — think first, prioritise what to
buy, pick items at the shop, work out the change at the till. The
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
