# Quick guide

> 🌐 **Other language:** [Español](../es/guia-rapida.md)

This guide explains step by step how to use Okeymoney: from opening
it to working through the learning journey, switching language or
installing it on your phone. It also includes **four ways to open
the app**, ordered from easiest to hardest.

> 📦 The detailed step-by-step version (with the full PWA install
> walkthrough and a complete troubleshooting section) lives in the
> canonical cross-suite guide:
> [`routime/doc/en/quick-guide.md`](https://github.com/thenkdframe/routime/blob/main/doc/en/quick-guide.md).
> The **opening flow, PWA install, language switcher and
> troubleshooting are identical** across the apps of the Miralante
> projects. This document only lists what's specific to Okeymoney.

---

## 1. How to open Okeymoney

There are **four ways**, ordered from easiest to hardest. The full
walkthrough is in the canonical guide linked above. The short
version:

| # | Method | What you need | Offline? | PWA installable? |
|---|---|---|---|---|
| **A** | From the internet ([okeymoney.apptonomia.uk](https://okeymoney.apptonomia.uk)) | A browser | ❌ | ✅ |
| **B** | Downloading the ZIP from GitHub | A browser | ❌ | ❌ |
| **C** | Local server with Python | Python 3 | ❌ | ✅ |
| **D** | Local server with Node.js | Node.js | ✅ | ✅ |

> 💡 If you just want to **try the app**, use method **A** or **B**.
> For the **full experience** (PWA, offline mode, "Add to home
> screen"), use **C** or **D**.

---

## 2. The main screen

The home shows **two steps**:

- **1. Learn**: choose one of the five units. Read one idea and do a
  related activity.
- **2. Use it**: record your balance, income, spending and goals.

The recommended order is in [`SPEC.md`](SPEC.md) §7.4 and
[`activities.md`](activities.md).

## 3. Choosing a unit or activity

Tap a unit to see its explanation and activities. Choose an activity to
start. You can repeat it whenever you want.

## 4. Buttons in each activity

Common buttons: **home**, **restart level**, **previous / next**,
**audio** (when the activity needs it), **numeric keypad** (for
entering amounts), and **settings** (gear icon, in-app, not the
global settings page).

## 5. Money and amounts

Amounts are entered in **euros** with a decimal separator that
follows the user's locale (`I18N.formatCurrency`). Internally the
app stores **cents** to avoid floating-point issues. The numeric
keypad includes **a comma / period toggle** when the locale
requires it.

## 6. How audio works

Audio plays automatically when the activity needs it (e.g. reading
the price aloud). Tap the 🔊 button to replay. Okeymoney respects
`prefers-reduced-motion` and the audio preference in settings.

## 7. Response messages

Correct → encouraging message and **okeys**; incorrect → an
"encourage" message and an unlimited retry. There is **no negative
balance change anywhere** — see [`SPEC.md`](SPEC.md) §3.1.

## 8. Earning okeys (tokens)

Each level completed rewards a fixed amount of okeys (🔑), from
**🔑 8,00** (small activities) to **🔑 60,00** (my shopping day).
**Okeys never decrease.** See [`team.md`](team.md) for the full
reward table.

## 9. Changing language

Open the language menu from the header (globe icon 🌐). Available:
**Spanish (default)** and **English**. See [`I18N.md`](I18N.md) for
how to add a new locale.

## 10. Personal settings

Open `/settings`. From there:

- View **My progress** (okeys and levels per activity).
- Reset progress (with a confirmation prompt, since it's
  destructive).
- Manage the audio and reduced-motion preferences.

## 11. Install the app on mobile

The full steps (Android / iOS / desktop) are in the canonical guide.
Short version: open Okeymoney in the browser, choose "Add to home
screen" / "Install", confirm.

## 12. Troubleshooting

See **§11 Troubleshooting** in the canonical guide — those items
apply identically to Okeymoney.

## 13. More help

- Product: [`SPEC.md`](SPEC.md).
- Learning journey: [`SPEC.md`](SPEC.md) §7.4 and
  [`activities.md`](activities.md).
- Architecture: [`technical.md`](technical.md).
- Activity catalogue: [`activities.md`](activities.md).
- For families and therapists: [`team.md`](team.md).

## 14. Quick summary

1. Open Okeymoney (4 methods; easiest is **A**).
2. Follow the journey: explain → check → apply.
3. Pick an activity on the home grid; use the numeric keypad to
   enter amounts.
4. Earn **okeys** per level; no failure, no balance penalty.
5. Switch language with 🌐; install as PWA for offline use.
