# Project roles

Okeymoney has **three differentiated roles**, same as the rest of the
sibling family (Apptonomia, Calculia, Memofun, Sinonimia, Teclatlon):

| Role | Who they are | How they participate | Where they look first |
|---|---|---|---|
| 👤 **End user** (someone with an intellectual or developmental disability learning personal finance, and in particular people who benefit from Easy Reading) | Practices the balance, goals, and expense registration | Opens `index.html` in a browser and uses the app autonomously. **Doesn't read code**, doesn't touch the ledger directly. | The app — nothing else to read |
| ❤️ **Support**: family, caregiver, support professional | Initializes the ledger and accompanies the first expenses | Sets the starting balance and the first savings goals in `Mi dinero` / `Mis metas`; accompanies the first expense registration in `Registrar un gasto`; supervises progress over time. | [`CONTRIBUTING.md`](../../CONTRIBUTING.md) (the "Support" section) |
| 💻 **Build**: developer | Maintains the shared ledger and the catalogue | Edits `app.js`, the per-activity data, and the catalogue-first home described in [`PRODUCT-DESIGN.md`](PRODUCT-DESIGN.md); runs [`scripts/check.js`](../../scripts/check.js), bumps `VERSION` in `sw.js`, and deploys. | [`CLAUDE.md`](../../CLAUDE.md) · [`technical.md`](technical.md) |

> 💡 The end user is always someone who benefits from Easy Reading, no
> pressure, and uncluttered screens — see [`SPEC.md`](SPEC.md) §2.
> Content, language and interface decisions are made with their
> experience in mind. What stays outside their participation is purely
> technical decisions (the `localStorage` schema, the single-ledger
> invariant, GitHub) — not because they are excluded, but because
> this is the support/build domain.

## Where to start, by profile

| If you are… | Start with… |
|---|---|
| 👤 End user or direct family member | The app — nothing technical to read |
| ❤️ Support professional setting up the ledger for the first time | [`README.md`](../../README.md) (the "Preparing / Expanding content" section) |
| ❤️ Support person reporting a missing category or unclear wording | [`CONTRIBUTING.md`](../../CONTRIBUTING.md) (the "Support" section) |
| 🤔 Just want to understand what Okeymoney is | [`README.md`](../../README.md) |
| 💻 Developer | [`CLAUDE.md`](../../CLAUDE.md) · [`technical.md`](technical.md) · [`PRODUCT-DESIGN.md`](PRODUCT-DESIGN.md) |

## 🤝 A small, focused project

Unlike a multi-team product, Okeymoney is intentionally small: one
shared-state ledger (`okeymoney:data` + `okeymoney:practiceWallet`),
one PWA shell, no backend. The **support** role usually overlaps with
the **build** role — the same person who sets up the balance for a
learner is also the one opening the PR — and that's expected. The
three roles are documented separately so that whoever joins the project
knows what the project expects from them, not because they have to be
done by three different people.
