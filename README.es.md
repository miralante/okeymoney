# Okeymoney 💰

> 🌐 **Otros idiomas:** [English](README.md)
>
> 🚀 **Pruébalo en vivo:** [okeymoney.apptonomia.uk](https://okeymoney.apptonomia.uk/)

[![Licencia MIT](https://img.shields.io/badge/licencia-MIT-blue.svg)](LICENSE)
[![Sin dependencias](https://img.shields.io/badge/dependencias-ninguna-success.svg)](#-caracter%C3%ADsticas)
[![Sitio estático](https://img.shields.io/badge/build-ninguno-informational.svg)](#-arranque-r%C3%A1pido)
[![PWA](https://img.shields.io/badge/PWA-instalable-5A0FC8.svg)](manifest.json)
[![i18n](https://img.shields.io/badge/i18n-es%20%7C%20en-yellow.svg)](#-documentaci%C3%B3n)
[![CI](https://img.shields.io/badge/CI-node%20scripts%2Fcheck.js-blue.svg)](.github/workflows/validate.yml)

Una aplicación web gratuita, estática y sin dependencias que enseña
**finanzas personales y autonomía cotidiana** a nuestros/as usuarios/as
tipo: saber cuánto dinero se tiene, gastarlo de forma consciente y
ahorrar para algo que se quiere conseguir. Sin cuentas, sin cookies, sin
analítica: todo funciona en el navegador y tus datos solo se guardan en
`localStorage`, en tu propio dispositivo.

- 🌐 **Aplicación**: [okeymoney.apptonomia.uk](https://okeymoney.apptonomia.uk/)
- 📦 **Repositorio**: [github.com/miralante/okeymoney](https://github.com/miralante/okeymoney)
- 💻 **Ejecutar en local**: abre `index.html` directamente en un
  navegador, o sirve la carpeta con cualquier servidor estático
  (`npx serve .` / `python -m http.server 8080`) para tener la
  experiencia completa de PWA con soporte sin conexión.

---

## 🚀 Pruébalo en vivo

Okeymoney está desplegada en **[okeymoney.apptonomia.uk](https://okeymoney.apptonomia.uk/)**
— ábrela en un navegador, instálala en la pantalla de inicio y empieza
por revisar tu saldo. Sin cuentas, sin telemetría.

---

## ✨ Características

Okeymoney es una **app de estado compartido**: Mi dinero, Mis metas y
Registrar un gasto leen y escriben el mismo libro contable en
`localStorage` (`okeymoney:data` + `okeymoney:practiceWallet`), de
modo que el saldo, las metas y el monedero de prácticas siempre se
mantienen coherentes.

- 💼 **Mi dinero** — un panel de saldo de estado compartido (una sola
  cifra, usada en todas partes).
- 🫴 **Recibir dinero** — anota dinero de bolsillo, trabajo, regalos o devoluciones.
- 🎯 **Mis metas** — seguimiento de metas de ahorro con progreso por
  meta.
- 🧾 **Registrar un gasto** — asistente paso a paso con categoría,
  importe y método de pago.
- 📚 **Movimientos recientes** — resumen local de ingresos, gastos y ahorro.
- 📌 **Pagos previstos** — recuerda pagos con fecha y revisa los vencidos sin descontarlos automáticamente.
- 🧭 **Compás financiero** — resume ingresos, gastos, ahorro y la categoría donde más gastas.
- 📦 **Ciclo de compra** — practica pedido, albarán, factura y pago; solo el pago registra el gasto.
- 📊 **Foto financiera** — explica activos, pasivos previstos, ingresos y gastos con tus datos registrados.
- 📉 **Vida de los activos** — practica la depreciación y decide qué hacer
  cuando un bien queda obsoleto, sin cambiar el ledger real.
- ⚖️ **Rentabilidad y riesgo** — calcula una ganancia hipotética y compara
  plazo, disponibilidad del dinero y diversificación antes de decidir.
- 🔄 **Operaciones de inversión** — distingue compra/aportación,
  venta/reembolso, cobro de rendimientos y traspaso entre productos.
- 💳 **Tarjetas y cuentas bancarias** — diferencia débito, crédito, prepago,
  cuenta corriente y cuenta de ahorro en situaciones cotidianas.
- 🏠 **Vivienda** — compara alquiler y propiedad teniendo en cuenta costes,
  compromisos, mantenimiento y flexibilidad.
- 📚 **Contabilidad y control** — registra los hechos y usa el presupuesto, el saldo y los compromisos para decidir.
- 🧭 **Autonomía cotidiana** — simula derechos, comunicación del dinero e imprevistos sin tocar el saldo real.
- ⚙️ **Ajustes y copias locales** — cambia el tamaño de texto y descarga o restaura tus datos sin cuenta.
- 🛒 **Actividades de práctica** — un catálogo temático por Conceptos
  básicos / Vida cotidiana / Seguridad, cada una entrena una autonomía
  concreta (devolver cambio, qué-necesito-comprar, dónde-guardarlo,
  etc.).
- 🪶 **Cero dependencias en tiempo de ejecución** — HTML/CSS/JS puros,
  sin build.
- 🌐 **Bilingüe** — español (por defecto) e inglés.
- 🔒 **Privacidad por defecto** — sin cuentas, sin cookies, sin
  analítica: los datos viven en `localStorage` en el dispositivo del
  usuario.
- 📦 **PWA instalable** — funciona sin conexión.
- 🖐️ **Accesibilidad** — botones grandes, alto contraste, navegación
  completa por teclado, `prefers-reduced-motion`, compatible con
  lectores de pantalla.

---

## 👥 Roles del proyecto

| Rol | Quién es | Cómo participa | Dónde mira primero |
|---|---|---|---|
| 👤 **Persona usuaria** (usuario/a tipo) | Practica finanzas personales y autonomía cotidiana | Abre la app en un navegador; no lee ni escribe código | La aplicación |
| ❤️ **Apoyo / familia** | Ayuda a la persona usuaria a configurar saldo y metas | Inicializa el libro contable con el importe inicial y las metas; acompaña el primer registro de gasto | [`CONTRIBUTING.es.md`](CONTRIBUTING.es.md) (la sección "Apoyo") |
| 💻 **Construcción / desarrollador/a** | Mantiene el libro contable compartido y el catálogo | Edita `app.js`, los datos por actividad y la home catálogo-primero (ver [`doc/es/PRODUCT-DESIGN.md`](doc/es/PRODUCT-DESIGN.md)) | [`CLAUDE.md`](CLAUDE.md) |

Para la descripción completa de los roles en contexto (con el resto de
la suite), ver [`CLAUDE.md`](CLAUDE.md).

---

## 📚 Documentación del proyecto (bilingüe)

| Idioma | Punto de entrada |
|---|---|
| 🇪🇸 Español (este archivo) | [`README.es.md`](README.es.md) |
| 🇬🇧 English | [`README.md`](README.md) |

| Tema | Documento |
|---|---|
| Producto, público, reglas de accesibilidad | [`doc/es/SPEC.md`](doc/es/SPEC.md) · [`doc/en/SPEC.md`](doc/en/SPEC.md) |
| Arquitectura, esquema de datos y referencia técnica | [`doc/es/tecnico.md`](doc/es/tecnico.md) · [`doc/en/technical.md`](doc/en/technical.md) |
| Arquitectura multiidioma + receta para añadir un idioma | [`doc/es/I18N.md`](doc/es/I18N.md) · [`doc/en/I18N.md`](doc/en/I18N.md) |
| **Rediseño v2 de la home (catálogo primero + tarjetas)** | [`doc/es/PRODUCT-DESIGN.md`](doc/es/PRODUCT-DESIGN.md) · [`doc/en/PRODUCT-DESIGN.md`](doc/en/PRODUCT-DESIGN.md) |
| Catálogo de actividades (temas, agentes, mecánicas) | [`doc/es/actividades.md`](doc/es/actividades.md) · [`doc/en/activities.md`](doc/en/activities.md) |
| Hoja de ruta del rediseño visual (entregado en v1.1) | [`TODO.es.md`](TODO.es.md) · [`TODO.md`](TODO.md) |
| Flujo operativo para agentes de IA | [`CLAUDE.md`](CLAUDE.md) |

El historial del proyecto vive en `git log`; no se mantiene una hoja de
ruta externa.

---

## 🛠️ Preparar / Ampliar contenido

Okeymoney crece añadiendo **actividades de práctica** en
`tools/<slug>/` y añadiendo **categorías / metas / pantallas** al libro
contable compartido. Cada cambio tiene que respetar el **invariante
del libro único**: Mi dinero, Mis metas y Registrar un gasto leen y
escriben el mismo libro `okeymoney:data` — no lo partas, no introduzcas
un shell `site/` + `tools/<slug>/` como Apptonomia/Calculia, y no
permitas que las actividades en `tools/<slug>/` lean el `localStorage`
de otras (ver [`doc/es/tecnico.md`](doc/es/tecnico.md) §2 con la
justificación).

Para añadir una actividad de práctica nueva:

1. Crea `tools/<slug>/` con `index.html`, `app.js`, `strings.es.js`,
   `strings.en.js` (y `data.js` si la actividad necesita datos
   predefinidos).
2. Añade el slug al catálogo de la home en `index.html` (en la sección
   temática que toque: Conceptos básicos / Vida cotidiana / Seguridad).
3. Registra el slug en `manifest.json` para el prompt de instalación
   (si tiene icono propio) y en el `tools/INDEX` si existe.
4. Sube el `VERSION` en `sw.js` (p. ej. `okeymoney-vN` → `okeymoney-vN+1`).

Para ampliar el **libro contable** (una categoría nueva, una pantalla
nueva, un default de meta), edita el esquema en
[`doc/es/tecnico.md`](doc/es/tecnico.md) §2 y los strings
correspondientes en `strings.<locale>.js` — el contrato de estado
compartido tiene que seguir siendo coherente entre los tres
consumidores.

---

## ✅ Validar los cambios

```bash
node scripts/check.js
```

No hace falta `npm install` — el script solo usa la librería estándar de
Node. Comprueba sintaxis JS, paridad de claves es/en entre
`strings.es.js` y `strings.en.js` (app raíz y `legal/`), que cada ruta
en `FILES` de `sw.js` existe en disco, que los iconos de
`manifest.json` existen, que cada expresión de origen CSP en
`_headers` lleva las comillas correctas (`'self'`, no `''self''`), y
que cada referencia `data-i18n*` / `App.i18n.t('key')` en
marcado/JS resuelve a una clave realmente registrada en ambos idiomas.
El mismo script corre en cada push y PR vía
[`.github/workflows/validate.yml`](.github/workflows/validate.yml).

Si tocas cualquier archivo listado en `FILES` de `sw.js`, sube
también el `VERSION` en `sw.js`.

---

## ☁️ Despliegue

Okeymoney es un sitio totalmente estático (HTML/CSS/JS, sin build), así
que se publica directamente en **[Cloudflare Workers (static assets)](https://developers.cloudflare.com/workers/static-assets/)**
mediante su integración nativa con GitHub — no hay workflow personalizado
de GitHub Actions. Las cabeceras de seguridad HTTP viven en
[`_headers`](_headers), el fallback offline en [`offline.html`](offline.html),
y la metadata del proyecto en [`wrangler.toml`](wrangler.toml). Consulta
[`CLOUDFLARE.md`](CLOUDFLARE.md) con la guía completa (rebuild, rollback,
dominio personalizado, rotación de credenciales).

Las pull requests reciben automáticamente una URL de previsualización —
sin necesidad de un workflow extra.

---

## 🙌 Contribuir

Las contribuciones son bienvenidas. Consulta [`CONTRIBUTING.es.md`](CONTRIBUTING.es.md)
para el flujo (o [`CONTRIBUTING.md`](CONTRIBUTING.md) para la versión en
inglés). Todas las personas participantes deben seguir
[`CODE_OF_CONDUCT.es.md`](CODE_OF_CONDUCT.es.md).

---

## 🔐 Seguridad

Okeymoney es un sitio estático completamente del lado del cliente: sin
backend, sin base de datos, sin telemetría, sin servicios de terceros en
tiempo de ejecución. El modelo de amenaza es esencialmente "qué podría
hacer una página maliciosa offline contra el mismo origen", algo que el
navegador ya aísla. Ver [`SECURITY.es.md`](SECURITY.es.md) (o
[`SECURITY.md`](SECURITY.md)) para reportar una sospecha de forma privada.

---

## 📄 Licencia

MIT — ver [`LICENSE`](LICENSE).

---

## 🧹 Mantenimiento

Este repo no tiene `node_modules`, artefactos de build, ni directorio
de caché. Para limpiar la caché local de la PWA durante el desarrollo,
desregistra el SW desde DevTools (`Application → Service workers →
Unregister`) y borra los datos del sitio.

La carpeta `scripts/` tiene dos helpers útiles:
[`scripts/check-version-bump.js`](scripts/check-version-bump.js)
(corre en CI, detecta subidas de `VERSION` olvidadas en ficheros
cacheados) y [`scripts/serve.js`](scripts/serve.js) (un servidor
estático local mínimo que imita el comportamiento de Cloudflare para
previsualizaciones).

---

## 🙏 Créditos

El modelo de **libro contable compartido** de Okeymoney sigue a
Teclatlon (un proyecto hermano de la suite): un único libro en
`localStorage` leído y escrito por cada flujo que toca saldo, metas o
monedero, de modo que siempre se mantienen coherentes — ver
[`doc/es/tecnico.md`](doc/es/tecnico.md) §2 con la justificación y el
esquema.

La **home catálogo-primero** (tres secciones temáticas: Conceptos
básicos / Vida cotidiana / Seguridad) se rediseñó en v2 — la
justificación, fases y qué cambia / no cambia están en
[`doc/es/PRODUCT-DESIGN.md`](doc/es/PRODUCT-DESIGN.md) (y su espejo en
inglés [`doc/en/PRODUCT-DESIGN.md`](doc/en/PRODUCT-DESIGN.md)).

---

## 🧩 Proyectos hermanos

Este proyecto forma parte de un pequeño grupo de proyectos hermanos
que comparten autor, la misma filosofía de accesibilidad y sin
backend, y la misma historia de despliegue en Cloudflare. **Apptonomia
es el proyecto principal**; los demás (Calculia, Okeymoney, Sinonimia,
Teclatlon, Routime) salieron de él o se construyeron a su lado sobre el
mismo stack.

| Proyecto | Qué es | Repositorio |
|---|---|---|
| **Apptonomia** *(principal)* | Actividades para rutinas y vida cotidiana (diseñado para nuestros/as usuarios/as tipo) | [github.com/miralante/apptonomia](https://github.com/miralante/apptonomia) |
| Calculia | Cálculo y razonamiento lógico | [github.com/miralante/calculia](https://github.com/miralante/calculia) |
| Memofun | Tarjetas de memoria con aprendizaje significativo | [github.com/miralante/memofun](https://github.com/miralante/memofun) |
| Okeymoney | Finanzas personales y autonomía cotidiana | [github.com/miralante/okeymoney](https://github.com/miralante/okeymoney) |
| Routime | Actividades para rutinas y vida cotidiana | [github.com/miralante/routime](https://github.com/miralante/routime) |
| Sinonimia | Diccionario en lectura fácil | [github.com/miralante/sinonimia](https://github.com/miralante/sinonimia) |
| Teclatlon | Mecanografía con el teclado físico | [github.com/miralante/teclatlon](https://github.com/miralante/teclatlon) |

La guía canónica de Cloudflare / despliegue para el grupo vive en
[`CLOUDFLARE.md` de Apptonomia](https://github.com/miralante/apptonomia/blob/master/CLOUDFLARE.md).
Este repo usa el modelo **Workers + static assets** (`wrangler.toml` +
`[assets]`), que es una forma distinta al modelo Pages clásico de
Apptonomia/Teclatlon — ver [`CLOUDFLARE.md`](CLOUDFLARE.md) para la
guía local.
