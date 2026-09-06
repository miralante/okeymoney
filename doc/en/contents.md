# Detailed contents — Okeymoney

> 🌐 **Other language:** [Español](../es/CONTENIDOS.md)

This document is a **detailed didactic index** of Okeymoney. It
expands on [`activities.md`](activities.md),
[`LEARNING-INDEX.md`](LEARNING-INDEX.md),
[`PRODUCT-DESIGN.md`](PRODUCT-DESIGN.md) and
[`creating-elements-guide.md`](creating-elements-guide.md) by
giving, for every activity, theme and pedagogical concept shipped
with the app:

- Its **name** (as it appears in the UI).
- Its **theme** (`concepts`, `daily` or `safety`).
- Its **slug** (`tools/`).
- Its **didactic objective** (what it works on).
- Its **reward** (okeys the activity gives when completed).
- Its **key vocabulary / theme** (used in `strings.es.js` /
  `strings.en.js`).
- Its **reference** (canonical document and section).

Use this document as the **workbook for Okeymoney**: when a new
activity is proposed, when content is reviewed, or when the
catalog is rebalanced, this is the document to read first.

> **Source of truth for product rules**: [`SPEC.md`](SPEC.md).
> **Source of truth for pedagogy**:
> [`creating-elements-guide.md`](creating-elements-guide.md).
> This document does **not** redefine rules; it indexes the content
> that those rules produce.

---

## 0. How this document is organized

1. The three themes (`concepts`, `daily`, `safety`).
2. The three basic agents (Persona, Empresa, Banco).
3. Activities, theme by theme, in didactic order.
4. The learning journey (teach → check → apply).
5. Pedagogical concepts (what each activity works on).
6. Restrictions and forbidden content.

---

## 1. Themes

Okeymoney ships **8 activities** organised in **3 themes**. The
theme is the pedagogical metadata that drives the home grid and
the learning journey:

| Theme | Slug | Emoji | What it does |
|---|---|---|---|
| **Conceptos básicos** | `concepts` | 💡 | Teaches one idea at a time. 3 short steps + a concrete example + a test. The educational core. |
| **Vida cotidiana** | `daily` | 🛒 | 5 simulation activities of increasing difficulty. The "apply" phase. |
| **Seguridad** | `safety` | 🛡️ | 1 high-stakes activity: scam recognition. Placed last because it always requires professional or family supervision. |

---

## 2. The three basic agents

Every case in Okeymoney is grounded in one of **three basic
agents**. Activities reuse the same agent set defined in
`assets/js/activity-runtime.js` and never invent ad-hoc emojis.

| Agent | Avatar | Spanish | English | What it stands for |
|---|---|---|---|---|
| Persona | 👤 | Persona | Person | You, your family, someone you know. |
| Empresa | 🏪 | Empresa | Shop | Supermarket, pharmacy, bus, clothes shop. |
| Banco | 🏦 | Banco | Bank | Your bank (card, savings, transfers). |

Each case names the agent it involves (e.g. "El bus", "La
farmacia", "El banco") so the learner sees *who* they are
transacting with.

---

## 3. Activities

### 3.1 Theme — Conceptos básicos (`concepts`)

| # | Slug | Title (es / en) | Cases | Reward (okeys) | Agents |
|---|---|---|---|---|---|
| 1 | `concepts-money/` | Cuenta tu dinero / Count your money | 29 | 🔑 12,00 | — (money skills) |
| 2 | `needs-vs-wants/` | Necesito o quiero / Need or want | 30 | 🔑 8,00 | persona |

### 3.2 Theme — Vida cotidiana (`daily`)

| # | Slug | Title (es / en) | Cases | Reward (okeys) | Agents |
|---|---|---|---|---|---|
| 3 | `budget-first/` | ¿Qué compro primero? / What do I buy first? | 8 | 🔑 12,00 | persona, empresa, banco |
| 4 | `before-buying/` | Cuatro preguntas antes de comprar / Four questions before buying | 4 | 🔑 10,00 | persona |
| 5 | `go-shopping/` | Ir a la tienda / Go shopping | 8 | 🔑 20,00 | persona, empresa, banco |
| 6 | `change-back/` | Calcular la vuelta / Working out change | 6 | 🔑 30,00 | empresa |
| 7 | `my-shopping-day/` | Mi compra del día / My shopping day | 5 | 🔑 60,00 | persona, empresa, banco |

### 3.3 Theme — Seguridad (`safety`)

| # | Slug | Title (es / en) | Cases | Reward (okeys) | Agents |
|---|---|---|---|---|---|
| 8 | `safe-money/` | Mi dinero está seguro / My money is safe | 6 | 🔑 15,00 | — (scam scenarios) |

**Total if every activity is completed: 🔑 167,00.**

---

## 4. The learning journey (teach → check → apply)

The recommended order is **explain → check → apply**:

| Order | Concept taught | Test | Where it is practised |
|---:|---|---|---|
| 1 | Count money and know the balance | `concepts-money` | Check the balance and record money coming in. |
| 2 | Needs and wants | `needs-vs-wants` | Decide whether a purchase can wait. |
| 3 | Priorities and budget | `budget-first` | Set a limit and remember planned payments. |
| 4 | Pause before buying | `before-buying` | Plan a purchase and record spending. |
| 5 | Pay and check the change | `change-back` | Rehearse payments with euros. |
| 6 | Save for a goal | `my-shopping-day` | Create a goal and add money. |
| 7 | Protect your money | `safe-money` | Check messages, requests and help. |
| 8 | Keep proof of purchases | `go-shopping` | Follow a purchase from order to payment. |

The official test-block sequence is:

1. `concepts-money`
2. `needs-vs-wants`
3. `budget-first`
4. `before-buying`
5. `go-shopping`
6. `change-back`
7. `my-shopping-day`
8. `safe-money`

The integrated `my-shopping-day` activity comes after the partial
skills and adds saving as its fifth round. `safe-money` stays last
because it is the protection skill.

The full reference is in [`LEARNING-INDEX.md`](LEARNING-INDEX.md).

---

## 5. Pedagogical concepts (what each activity works on)

### 5.1 Money recognition

- Coin and note values (`concepts-money/`).
- Counting a balance (`concepts-money/`).
- Translating between euros and cents (internal representation;
  see [`creating-elements-guide.md`](creating-elements-guide.md)
  §2.3).

### 5.2 Decision-making

- Need vs want (`needs-vs-wants/`).
- Prioritising purchases (`budget-first/`).
- Pausing before buying (`before-buying/`).

### 5.3 Everyday transactions

- Going to the shop (`go-shopping/`).
- Working out change (`change-back/`).
- A full shopping day (`my-shopping-day/`).

### 5.4 Saving

- Saving towards a goal (`my-shopping-day/` round 5).

### 5.5 Safety

- Recognising scams (`safe-money/`).
- Protecting money and personal data (`safe-money/`).

---

## 6. Restrictions and forbidden content

These rules apply to **every** activity and are **never** broken
(full rationale in [`SPEC.md`](SPEC.md) §3 and
[`creating-elements-guide.md`](creating-elements-guide.md)
§2):

- **No balance penalty for mistakes** — no wrong entry subtracts
  from the balance, stars, progress or goal achievement. The
  product optimises for autonomy, not for accuracy.
- **No timers, no score, no punishment** — feedback is encouragement,
  not "wrong".
- **No clinical labels** about the user (intellectual or
  developmental disability, occupational therapy, minors) inside
  the UI.
- **No real-bank or real-money scenarios** — Okeymoney simulates.
  Real accounts, real transfers and real personal data are never
  asked for.
- **Scam-safety placement**: `safe-money` is **always last** in
  the journey because it touches real-life risk; it is intended
  as a conversation starter, not a test.
- **No tracking, no login, no analytics** — progress is in
  `localStorage` only.
- **No hateful, sexual, political or violent content** in the
  user-facing product.

---

## 7. See also

- Product: [`SPEC.md`](SPEC.md).
- Learning journey: [`LEARNING-INDEX.md`](LEARNING-INDEX.md).
- Product design rationale: [`PRODUCT-DESIGN.md`](PRODUCT-DESIGN.md).
- Architecture: [`technical.md`](technical.md).
- Activity catalogue (short): [`activities.md`](activities.md).
- Pedagogical guide (long):
  [`creating-elements-guide.md`](creating-elements-guide.md).
- Languages: [`I18N.md`](I18N.md).
- For families and therapists: [`team.md`](team.md).
