# Guide for professionals and families

This guide is intended for occupational therapists, families,
teachers and other professionals who want to use Okeymoney as a
support tool for personal finance and everyday financial autonomy.

---

## Who is Okeymoney for?

Okeymoney is primarily designed for:

- **People with intellectual or developmental disabilities** learning
  to manage their own money.
- **Families** looking for resources to rehearse money decisions at
  home.
- **Teachers and therapists** who need complementary tools for direct
  intervention.

The application **does not replace** professional intervention, but
can serve as:

- Reinforcement between sessions.
- Autonomous practice at home.
- A way to rehearse money situations (counting coins, paying, working
  out change) without real-money risk.

---

## How to use Okeymoney in support sessions

### Initial assessment

Before using the application, observe the learner with these
questions:

1. What is their current level of autonomy with money? (Can they
   recognise coins and banknotes? Can they count change?)
2. What skills do they want to work on? (counting, budgeting,
   paying, saving, scam safety…)
3. Which situations are familiar to them? (supermarket, pharmacy,
   bus, family shopping, online shopping…)
4. Do they need support to use technological devices?

### Recommended learning journey

The recommended order is **explain → practise → apply**:

1. **Explain** — the first part of the home screen teaches one idea
   at a time, with three short steps and a concrete example.
2. **Practise** — five units group the 8 activities listed in
   [`activities.md`](activities.md) so the person can practise the idea.
3. **Apply** — the simulation phase (5 everyday-life activities)
   lets the learner rehearse real-life situations.

The full reference is in [`SPEC.md`](SPEC.md) §7.4 and
[`activities.md`](activities.md).

### Activity selection (examples)

#### For learners starting out

| Activity | Skill worked |
|----------|--------------|
| `concepts-money` | Coin and note recognition, balance. |
| `needs-vs-wants` | Distinguishing needs from wants. |
| `budget-first` | Priorities and budget. |

#### For intermediate learners

| Activity | Skill worked |
|----------|--------------|
| `before-buying` | Four questions before buying. |
| `go-shopping` | Going to the shop. |
| `change-back` | Working out change. |

#### For advanced learners

| Activity | Skill worked |
|----------|--------------|
| `my-shopping-day` | A complete shopping day (5 rounds). |
| `safe-money` | Recognising scams, protecting money. |

### Adaptations

#### Difficulty level

Each activity has **3 levels** (Easy → Medium → Hard). To choose:

- **Level 1 (Easy)**: new users or those with significant support.
- **Level 2 (Medium)**: users with moderate experience.
- **Level 3 (Hard)**: autonomous users looking for challenge.

#### Money-only adjustments

If the numbers on the screen are still abstract, you can:

- Print a few coins and banknotes to handle physically while the
  activity runs.
- Set a small real budget (e.g. "today's shopping is €5") and let
  the learner choose what to put in the basket from a printed list.
- Use the activity as demonstration before requesting autonomy.

---

## Progress tracking

### Tokens (okeys)

Each activity rewards **okeys** (🔑) when completed:

- 🔑 8,00 — small activity (e.g. needs vs wants).
- 🔑 12,00 — standard activity.
- 🔑 20,00 — bigger activity (go shopping).
- 🔑 30,00 — change practice.
- 🔑 60,00 — my shopping day (the most complex).

**Tokens never decrease** — see [`SPEC.md`](SPEC.md) §3.1.

### How to view progress

Open `/settings` (see [`quick-guide.md`](quick-guide.md) §9) and
check **My progress** for the full summary.

### Privacy

Progress is stored **only in the browser's `localStorage`**. It
never leaves the device. Resetting progress is destructive and
requires confirmation.

---

## Scam safety and supervision

The `safe-money` activity is intentionally placed last in the
journey because it touches real-life risk (recognising scams,
rejecting suspicious requests). Recommended practice:

- Walk through the activity together with the learner the first
  time.
- Use it as a conversation starter, not a test.
- Reinforce the "ask a trusted person before sending money" rule
  (see [`SPEC.md`](SPEC.md) §3 on the no-pressure and autonomy
  principles).

---

## More resources

- Activity catalogue: [`activities.md`](activities.md).
- Learning journey: [`SPEC.md`](SPEC.md) §7.4 and
  [`activities.md`](activities.md).
- Pedagogical and design notes for professionals:
  [`creating-elements-guide.md`](creating-elements-guide.md).
- Cross-suite guide for families on daily living skills:
  [Routime's `team.md`](https://github.com/thenkdframe/routime/blob/main/doc/en/team.md).

## Expanded practice

The 11 activities include three new paths, with six situations each. Each path moves from identifying an amount to comparing and deciding. Each new activity credits 12 Tokens once. The catalogue total is 210 Tokens.

- `save-step-by-step`: Save towards a goal.
- `compare-prices`: Compare before paying.
- `monthly-payments`: Organise your payments.

Hints and explanations remain until the person selects “Got it”. There is no timed progression. Completion connects learning to everyday use. Activities do not store attempts or change the euro balance.
