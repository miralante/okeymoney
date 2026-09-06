# Guide to creating activities

> **How to design and build a new activity in Okeymoney, applying
> the product rules in [`SPEC.md`](SPEC.md) §3, the accessibility
> rules in [`technical.md`](technical.md) §5, the technical recipe in
> §9, and a set of **didactic**, **gamification**, **persuasion** and
> **neuromarketing** techniques adapted for the project's audience.**
>
> This document does **not** duplicate the canonical pedagogical
> guide shared by the suite; it points to it and only lists what's
> specific to Okeymoney. If a rule here clashes with the canonical
> guide or with `technical.md`, `technical.md` wins.

---

## 1. The canonical pedagogical guide

The full didactic, gamification, persuasion and neuromarketing
techniques that all the apps of the Miralante suite share live in the
**Routime** repository under
[`creating-elements-guide.md`](https://github.com/thenkdframe/routime/blob/main/doc/en/creating-elements-guide.md).

Read it before designing anything. It covers (non-exhaustive):

- The 13 mandatory accessibility rules (with the rationale for each).
- The Socratic-method hint ladder (clue → bigger clue → answer).
- The positive-feedback palette (sounds, animations, micro-copy).
- The neuromarketing patterns adapted to the audience.
- The level-design checklist (Easy → Medium → Hard progression).

## 2. What's specific to Okeymoney

### 2.1 Domain focus

Personal finance and everyday money autonomy. Activities are about
counting coins and banknotes, needs vs wants, budgeting, paying,
working out change, saving, and scam safety — never about general
reasoning or daily living skills (those live in other apps of the suite).

### 2.2 The three basic agents

Every case in Okeymoney is grounded in one of **three basic agents**:

| Agent | Avatar | Spanish | English |
|---|---|---|---|
| Persona | 👤 | Persona | Person |
| Empresa | 🏪 | Empresa | Shop |
| Banco | 🏦 | Banco | Bank |

Activities reuse the same agent set defined in
`assets/js/activity-runtime.js` and **never invent ad-hoc emojis**.
Each case names the agent it involves (e.g. "El bus", "La farmacia",
"El banco") so the learner sees *who* they are transacting with.

### 2.3 Money and amounts

- Amounts are entered in **euros** at the UI layer; **cents**
  internally.
- The display layer uses `I18N.formatCurrency` (locale-aware decimal
  separator).
- The numeric keypad includes a **comma / period toggle** when the
  active locale requires it.
- The reward token is the **okey** (🔑); see [`team.md`](team.md)
  for the per-activity reward table.

### 2.4 The "no balance penalty" rule

This is the single most important rule for the product. There is
**no scenario where a wrong entry subtracts from the balance,
stars, progress or goal achievement** (see [`SPEC.md`](SPEC.md) §3.1).
Any new activity that introduces a "money penalty for mistakes"
breaks the project and must be redesigned.

### 2.5 Scam safety placement

The `safe-money` activity covers scam recognition. It is
**intentionally placed last** in the journey because it touches
real-life risk. A new activity that introduces a real-money or
real-bank scenario must be reviewed by the support role before
shipping — it is not a content-only contribution.

### 2.6 Reusing the activity runtime

Most Okeymoney activities are built on top of the shared Socratic
loop in `assets/js/activity-runtime.js` (or the numeric-keypad
variant used by `change-back`). **Before scaffolding a new
activity, read the runtime to understand the case schema, the
feedback palette and the level progression.** Building an activity
outside the runtime is a deliberate choice and must be justified.

## 3. The technical recipe

How to scaffold the folder, register the activity in `DATA.activities`,
assign it a valid `unitId`, add the strings to both locales, and bump
the service worker cache version, is described step by step in
[`technical.md`](technical.md) §10.5. **Read
that section before writing any code.**

## 4. Compliance checklist before opening a PR

- [ ] Folder created under `tools/<slug>/` with the standard anatomy
      described in [`technical.md`](technical.md) §5.
- [ ] Activity reuses the shared runtime where applicable.
- [ ] Case uses one of the three basic agents (no ad-hoc emojis).
- [ ] Amounts entered as cents internally; formatted with
      `I18N.formatCurrency`.
- [ ] No mistake subtracts from the balance, stars or goal — see
      [`SPEC.md`](SPEC.md) §3.1.
- [ ] Strings added to BOTH `tools/<slug>/strings.es.js` **and**
      `tools/<slug>/strings.en.js` with the same keys.
- [ ] Levels (1, 2, 3) configured with progressive difficulty.
- [ ] Hint ladder follows the Socratic method (see Routime's guide,
      §3).
- [ ] Activity registered once in `DATA.activities`, with a valid
      `unitId`; keep its theme (`concepts`, `daily` or `safety`).
- [ ] Reward (okeys) set per [`team.md`](team.md) table.
- [ ] Service worker cache `VERSION` bumped in `sw.js`.
- [ ] `node scripts/check.js` passes.

## 5. See also

- Canonical pedagogical guide (Routime):
  [creating-elements-guide.md](https://github.com/thenkdframe/routime/blob/main/doc/en/creating-elements-guide.md).
- Learning journey reference: [`SPEC.md`](SPEC.md) §7.4 and
  [`activities.md`](activities.md).
- Product design rationale: [`SPEC.md`](SPEC.md) §7.4 and §11–12.
- Technical recipe: [`technical.md`](technical.md) §9.
- Product non-negotiables: [`SPEC.md`](SPEC.md) §3.
- Activity catalogue: [`activities.md`](activities.md).
