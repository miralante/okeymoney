# Okeymoney

> 🌐 **Other languages:** [Español](README.es.md)

A free, static, dependency-free app that teaches **personal finance and
everyday autonomy** to people with intellectual or developmental
disabilities: knowing how much money you have, spending it consciously,
and saving towards something you want. No accounts, no cookies, no
analytics: everything runs in the browser and your data is saved only in
`localStorage`, on your own device.

- 💻 **Run locally**: open `index.html` directly in a browser, or serve
  the folder with any static server (`npx serve .` /
  `python -m http.server 8080`) for the full offline-capable PWA
  experience.

---

## 📚 Documentation

| Topic | Document |
|---|---|
| Product, audience, accessibility rules | [`doc/en/SPEC.md`](doc/en/SPEC.md) · [`doc/es/SPEC.md`](doc/es/SPEC.md) |
| Architecture, data schema and technical reference | [`doc/en/technical.md`](doc/en/technical.md) · [`doc/es/tecnico.md`](doc/es/tecnico.md) |
| AI agent operational workflow | [`CLAUDE.md`](CLAUDE.md) |

Project history lives in `git log`; no external roadmap is maintained.

---

## ✅ Validate

```bash
node scripts/check.js
```

No `npm install` needed — the script only uses Node's standard library.

---

## 📄 License

MIT — see [`LICENSE`](LICENSE).
