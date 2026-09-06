# Okeymoney

**Web application that teaches personal finance and everyday financial autonomy: knowing how much money you have, spending it consciously, and saving towards something you want.**

---

## What is Okeymoney?

Okeymoney is a digital tool for practising everyday decisions about money, in the browser, free of charge. It is **not** a bank, a financial adviser or a game — it does not move real money and does not score you.

Okeymoney is a **single shared-state app**: balance, savings goals, recorded expenses and the practice wallet all read and write the same local ledger, so everything always stays coherent. The complete feature list lives in [`activities.md`](activities.md).

---

## Key features

### ✅ Designed for autonomy

- **No pressure**: no timers, no negative scores, no punishment
- **Positive reinforcement**: celebrates a healthy balance and progress towards a goal
- **Easy Reading**: short sentences, everyday vocabulary, one idea per screen

### ✅ Accessible to everyone

- **Large buttons**: minimum 64×64 pixels
- **Large text**: clear readable font (Atkinson Hyperlegible)
- **High contrast**: verified AAA-grade contrast ratios on the main tokens
- **Step-by-step wizards** for every action that asks for a number, a category or a date

### ✅ Privacy by default

No accounts, no cookies, no analytics, no third-party runtime. All your numbers live in `localStorage` on your own device, and you can clear them at any time from the **Settings** route.

### ✅ In two languages

- 🇪🇸 **Español** (default)
- 🇬🇧 **English** (can be changed from the menu)

---

## Getting started

### 1. Open the app

Visit **[okeymoney.apptonomia.uk](https://okeymoney.apptonomia.uk)** or open `index.html` from a local server. The full step-by-step with **four ways to open Okeymoney** (internet, ZIP, Python, Node.js) lives in [`quick-guide.md`](quick-guide.md).

### 2. Set a starting balance

The first time you open Okeymoney, **Mi dinero** asks you to set a starting balance (how much money you have right now). After that, every movement you record updates the same balance.

### 3. Try the practice wallet

Before you start recording real movements, you can use the **practice wallet** to try things out: record a few "receive money" and "record an expense" entries, watch the balance change, set a goal, see it fill up. Nothing you do here is destructive.

### 4. Change language

Tap the language button (🇪🇸 or 🇬🇧) at the top of the screen.

---

## Example of use

Imagine you got paid this week. Open **🫴 Receive money**, choose "Work", type in `25`, and confirm. The balance on **💼 My money** updates immediately. Then you buy lunch: open **🧾 Record an expense**, choose "Food", type in `6`, confirm. The balance updates again. At the end of the week, open **📚 Recent movements** and see the whole week in one place.

---

## Featured features

### 💼 My money

The shared balance dashboard. One number — your current balance — that every other feature reads and writes. Open it whenever you want to know "how much do I have right now?".

### 🫴 Receive money

Record pocket money, work, gifts or refunds. Each entry is added to the balance with a category and a date.

### 🎯 My goals

Savings-goals tracker. Pick a goal ("a new game", "a trip"), set an amount, and watch your progress fill up as you save. The balance updates in lock-step.

### 🧾 Record an expense

A step-by-step wizard: pick a category, type the amount, choose how you paid (cash, card, online), and confirm. The amount is subtracted from the balance automatically.

### 📚 Recent movements

A simple local view of income, spending and saving — what happened, when, and which category it was.

### 📌 Planned payments

Remember dated payments (a bill, a subscription) and review overdue ones without changing the balance automatically.

### 🧭 Money compass

A summary card that shows income, spending, saving and your main spending category, using the data you've already recorded.

### 📦 Purchase cycle

Practise the full loop: order, delivery note, invoice and payment. Only the **payment** step records the expense — the order and the delivery note are just steps that lead up to it.

### 📊 Money picture

Explains assets, expected liabilities, income and expenses using the data you've already recorded, in plain language.

---

## More information

- [Quick guide](quick-guide.md) — Step by step (four ways to open Okeymoney)
- [Feature catalogue](activities.md) — Complete list of every feature
- [Guide for professionals](team.md) — How to use Okeymoney in therapy
- [Technical information](technical.md) — For developers

---

## Credits and licence

Okeymoney is an open source project, distributed under the MIT licence. It is **not** a bank, a financial adviser, a clinical assessment or a competitive game, and it does not execute payments.
