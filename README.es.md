# Okeymoney

> 🌐 **Otros idiomas:** [English](README.md)

Una aplicación web gratuita, estática y sin dependencias que enseña
**finanzas personales y autonomía cotidiana** a personas con
discapacidad intelectual o del desarrollo: saber cuánto dinero se tiene,
gastarlo de forma consciente y ahorrar para algo que se quiere conseguir.
Sin cuentas, sin cookies, sin analítica: todo funciona en el navegador y
tus datos solo se guardan en `localStorage`, en tu propio dispositivo.

- 💻 **Ejecutar en local**: abre `index.html` directamente en un
  navegador, o sirve la carpeta con cualquier servidor estático
  (`npx serve .` / `python -m http.server 8080`) para tener la
  experiencia completa de PWA con soporte sin conexión.

---

## 📚 Documentación

| Tema | Documento |
|---|---|
| Producto, público, reglas de accesibilidad | [`doc/en/SPEC.md`](doc/en/SPEC.md) · [`doc/es/SPEC.md`](doc/es/SPEC.md) |
| Arquitectura, esquema de datos y referencia técnica | [`doc/en/technical.md`](doc/en/technical.md) · [`doc/es/tecnico.md`](doc/es/tecnico.md) |
| Flujo operativo para agentes de IA | [`CLAUDE.md`](CLAUDE.md) |

El historial del proyecto vive en `git log`; no se mantiene una hoja de
ruta externa.

---

## ✅ Validar

```bash
node scripts/check.js
```

No hace falta `npm install` — el script solo usa la librería estándar de
Node.

---

## 📄 Licencia

MIT — ver [`LICENSE`](LICENSE).
