# Okeymoney 💰

> 🌐 **Otros idiomas:** [English](README.md)
>
> 🚀 **Pruébalo en vivo:** [okeymoney.apptonomia.uk](https://okeymoney.apptonomia.uk/)

[![Licencia MIT](https://img.shields.io/badge/licencia-MIT-blue.svg)](LICENSE)
[![Sin dependencias](https://img.shields.io/badge/dependencias-ninguna-success.svg)](#-caracter%C3%ADsticas)
[![Sitio estático](https://img.shields.io/badge/build-ninguno-informational.svg)](#-caracter%C3%ADsticas)
[![PWA](https://img.shields.io/badge/PWA-instalable-5A0FC8.svg)](manifest.json)
[![i18n](https://img.shields.io/badge/i18n-es%20%7C%20en-yellow.svg)](#-documentaci%C3%B3n-del-proyecto-biling%C3%BCe)
[![CI](https://img.shields.io/badge/CI-node%20scripts%2Fcheck.js-blue.svg)](.github/workflows/validate.yml)
[![Pacto del colaborador](https://img.shields.io/badge/Pacto%20del%20colaborador-2.1-4baaaa.svg)](CODE_OF_CONDUCT.es.md)

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
  (
npx serve .` / `python -m http.server 8080`) para tener la
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
- 🫴 **Recibir dinero** — anota dinero de bolsillo, trabajo, regalos o
  devoluciones.
- 🎯 **Mis metas** — seguimiento de metas de ahorro con progreso por
  meta.
- 🧾 **Registrar un gasto** — asistente paso a paso con categoría,
  importe y método de pago.
- 📚 **Movimientos recientes** — resumen local de ingresos, gastos y
  ahorro.
- 📌 **Pagos previstos** — recuerda pagos con fecha y revisa los
  vencidos sin descontarlos automáticamente.
- 🧭 **Compás financiero** — resume ingresos, gastos, ahorro y la
  categoría donde más gastas.
- 📦 **Ciclo de compra** — practica pedido, albarán, factura y pago;
  solo el pago registra el gasto.
- 📊 **Foto financiera** — explica activos, pasivos previstos,
  ingresos y gastos con tus datos registrados.
- 📉 **Vida de los activos** — practica la depreciación y decide qué
  hacer cuando un bien queda obsoleto, sin cambiar el ledger real.
- ⚖️ **Rentabilidad y riesgo** — calcula una ganancia hipotética y
  compara plazo, disponibilidad del dinero y diversificación antes de
  decidir.
- 🔄 **Operaciones de inversión** — distingue compra/aportación,
  venta/reembolso, cobro de rendimientos y traspaso entre productos.
- 💳 **Tarjetas y cuentas bancarias** — diferencia débito, crédito,
  prepago, cuenta corriente y cuenta de ahorro en situaciones
  cotidianas.
- 🏠 **Vivienda** — compara alquiler y propiedad teniendo en cuenta
  costes, compromisos, mantenimiento y flexibilidad.
- 📚 **Contabilidad y control** — registra los hechos y usa el
  presupuesto, el saldo y los compromisos para decidir.
- 🧭 **Autonomía cotidiana** — simula derechos, comunicación del
  dinero e imprevistos sin tocar el saldo real.
- ⚙️ **Ajustes y copias locales** — cambia el tamaño de texto y
  descarga o restaura tus datos sin cuenta.
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

##  Acerca de

Okeymoney es un **entrenador de finanzas personales y autonomía
cotidiana**: la persona usuaria ve un saldo compartido (ahorros,
metas, gastos) en la pantalla de inicio, registra un gasto real
mediante un asistente paso a paso, y practica con actividades
temáticas que entrenan el cambio, lo que necesito y dónde guardar
— todo sin tocar nunca una cuenta bancaria real. La home está
estratificada en tres bloques (didáctica, tests que dan Tokens,
simulaciones en euros) para que una sola instalación cubra todos
los niveles de detalle.

Okeymoney se publica como web estática sin dependencias y como
PWA instalable. Es una de las **siete apps** de la suite
**Miralante** — la lista completa está en
[🌐 La suite Miralante](#-la-suite-miralante--proyectos-del-grupo)
más abajo. La especificación real del producto vive en
[`doc/es/spec.md`](doc/es/spec.md); este README rehúye
reformular decisiones de producto para que la descripción
pública y la especificación no se separen.

---

## 🎯 Objetivos

Okeymoney se construye para:

- 💶 **Permitir que una persona nueva abra la app y vea un
  saldo funcional** en menos de cinco minutos, sin tutorial ni
  asistente de configuración.
- 📒 **Mantener un único libro contable compartido** — el
  saldo, las metas y el monedero de práctica leen y escriben
  el mismo libro `okeymoney:data`, para que siempre estén
  coherentes.
- 🧭 **Practicar sin tocar el saldo real** — un "monedero de
  práctica" aparte permite ensayar el cambio, tarjeta vs.
  efectivo y decisiones de emergencia de forma aislada.
- 🌐 **Mantener la paridad bilingüe** — español por defecto y
  fuente de verdad; inglés con paridad en cada cadena.
- 🔒 **Guardar el progreso solo en el dispositivo** — cada
  apunte vive en `localStorage` bajo el prefijo `okeymoney:`;
  nada se sube nunca.
- 📦 **Funcionar sin conexión como PWA** — instalar en la
  pantalla de inicio, registrar un gasto en una tablet sin
  señal.
- 🪶 **Mantenerse sin dependencias** — HTML/CSS/JS puros, sin
  build, sin frameworks.

Cada objetivo referencia una sección de
[`doc/es/spec.md`](doc/es/spec.md); si un objetivo no está allí,
añádelo a la especificación o sácalo de la lista.

---

## 👥 Audiencia y roles

Okeymoney está pensada para una **persona tipo** — quien quiera
ensayar finanzas personales y autonomía cotidiana en su propio
dispositivo, sin cuenta ni riesgo con dinero real. La
especificación real del producto vive en [`doc/es/spec.md`](doc/es/spec.md);
este README evita a propósito cualquier etiqueta clínica para que
la descripción pública se mantenga genérica.

El proyecto reconoce tres roles alrededor de la app, cada uno
con su propio punto de entrada:


El proyecto reconoce tres roles alrededor de la app, cada uno
con su propio punto de entrada:

| Rol | Quién es | Cómo participa | Dónde mira primero |
|---|---|---|---|
| 👤 **Persona usuaria** (persona tipo) | Practica finanzas personales y autonomía cotidiana | Abre la app en un navegador; no lee ni escribe código | La aplicación |
| ❤ **Apoyo / familia** | Ayuda a la persona usuaria a configurar saldo y metas | Inicializa el libro contable con el importe inicial y las metas; acompaña el primer registro de gasto | [`CONTRIBUTING.es.md`](CONTRIBUTING.es.md) (la sección “Apoyo”) |
| 💻 **Construcción / desarrollador/a** | Mantiene el libro contable compartido y el catálogo | Edita `app.js`, los datos por actividad y la home catálogo-primero (ver [`doc/es/spec.md`](doc/es/spec.md) §6–7) | [`CLAUDE.md`](CLAUDE.md) |

Ver [`doc/es/roles.md`](doc/es/roles.md) para la descripción completa
de los roles y los patrones trio/par/único en el conjunto de la suite.

---

## �📚 Documentación del proyecto (bilingüe)

Toda la documentación del proyecto vive en la carpeta `doc/`, junto
con algunos archivos en la raíz del repositorio:

| Idioma | Punto de entrada |
|---|---|
| 🇪🇸 Español (este archivo) | [`README.es.md`](README.es.md) |
| 🇬🇧 English | [`README.md`](README.md) |

| Tema | Documento |
|---|---|
| Producto, público, reglas de accesibilidad | [`doc/es/spec.md`](doc/es/spec.md) · [`doc/en/spec.md`](doc/en/spec.md) |
| Arquitectura, esquema de datos y referencia técnica | [`doc/es/tecnico.md`](doc/es/tecnico.md) · [`doc/en/technical.md`](doc/en/technical.md) |
| Arquitectura multiidioma + receta para añadir un idioma | [`doc/es/i18n.md`](doc/es/i18n.md) · [`doc/en/i18n.md`](doc/en/i18n.md) |
| **Home v2 (catálogo primero + tarjetas)** | [`doc/es/spec.md`](doc/es/spec.md) §6–§7 · [`doc/es/actividades.md`](doc/es/actividades.md) |
| Catálogo de actividades (temas, agentes, mecánicas) | [`doc/es/actividades.md`](doc/es/actividades.md) · [`doc/en/activities.md`](doc/en/activities.md) |
| Flujo operativo para agentes de IA | [`CLAUDE.md`](CLAUDE.md) |

### 📄 Otros documentos del repo

| Documento | Para quién |
|---|---|
| [`CONTRIBUTING.es.md`](CONTRIBUTING.es.md) | Familias, terapeutas y desarrolladores que quieran contribuir |
| [`CODE_OF_CONDUCT.es.md`](CODE_OF_CONDUCT.es.md) | Pacto del colaborador (Contributor Covenant 2.1) |
| `CLAUDE.md` | Agentes IA: reglas obligatorias y estado del proyecto |
| [`CLOUDFLARE.md`](CLOUDFLARE.md) | Guía canónica de despliegue en Cloudflare Workers para la suite (Okeymoney + Apptonomia + Calculia, Memofun, Sinonimia, Teclatlon) |
| Historial del proyecto | En `git log`; no se mantiene una hoja de ruta externa |
| `doc/es/i18n.md` / `doc/en/i18n.md` | Detalles del sistema multiidioma ES/EN |

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
2. Registra el slug en `DATA.activities` (`data.js`) con un `unitId`
   válido y el tema correspondiente. La home genera la tarjeta
   automáticamente.
3. Registra el slug en `manifest.json` para el prompt de instalación
   (si tiene icono propio) y en el `tools/INDEX` si existe.
4. Sube el `VERSION` en `sw.js` (p. ej. `okeymoney-vN` →
   `okeymoney-vN+1`).

Para añadir una simulación, registra una entrada en `DATA.simulations`
con `id`, `unitId`, grupo, claves i18n y acción. Solo necesitas tocar
`app.js` cuando la mecánica sea nueva.

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

No hace falta 
pm install` — el script solo usa la librería estándar
de Node. Comprueba sintaxis JS, paridad de claves es/en entre
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
mediante su integración nativa con GitHub. Las cabeceras de seguridad
HTTP viven en [`_headers`](_headers), el fallback offline en
[`offline.html`](offline.html), y la metadata del proyecto en
[`wrangler.toml`](wrangler.toml). Consulta [`CLOUDFLARE.md`](CLOUDFLARE.md)
con la guía completa (rebuild, rollback, dominio personalizado,
rotación de credenciales).

Las pull requests reciben automáticamente una URL de previsualización
en `*.<subdominio-cuenta>.workers.dev` — sin necesidad de un workflow
extra.

---

## 🔐 Seguridad

Okeymoney es un sitio estático completamente del lado del cliente: sin
backend, sin base de datos, sin telemetría, sin servicios de terceros en
tiempo de ejecución. El modelo de amenaza es esencialmente "qué podría
hacer una página maliciosa offline contra el mismo origen", algo que el
navegador ya aísla. Ver [`SECURITY.es.md`](SECURITY.es.md) (o
[`SECURITY.md`](SECURITY.md)) para reportar una sospecha de forma
privada (canal preferido:
[`hello@apptonomia.uk`](mailto:hello@apptonomia.uk)).

---

## 📄 Licencia

MIT — ver [`LICENSE`](LICENSE).

---

## Contribuir

Issues y pull requests son bienvenidos. Ver [`CONTRIBUTING.es.md`](CONTRIBUTING.es.md)
para el flujo de trabajo (y [`CONTRIBUTING.md`](CONTRIBUTING.md) para la versión en inglés).
Todas las personas participantes deben seguir
[`CODE_OF_CONDUCT.es.md`](CODE_OF_CONDUCT.es.md).

---

## 🧹 Mantenimiento

Este repo no tiene 
ode_modules`, artefactos de build, ni directorio
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

## 🌐 La suite Miralante — proyectos del grupo

Okeymoney es una de las **siete apps** de la suite **Miralante**, que
comparten autor, la misma filosofía de accesibilidad sin backend, y la
misma historia de despliegue en Cloudflare. Apptonomia, además de ser
una app en sí misma, actúa como **portal de la suite** que la presenta
al mundo. Ninguno de los siete repos es el "principal" — son iguales;
este es el producto original del que nació el grupo.

| Proyecto | Qué es | Repositorio |
|---|---|---|
| **Apptonomia** *(portal — landing only, no es app)* | Landing que presenta la suite Miralante (no es una app en tiempo de ejecución) | [github.com/miralante/apptonomia](https://github.com/miralante/apptonomia) |
| [Calculia](https://calculia.apptonomia.uk/) | Cálculo y razonamiento lógico | [github.com/miralante/calculia](https://github.com/miralante/calculia) |
| [Ludia](https://ludia.apptonomia.uk/) | Juegos adaptados con reglas, ejercicios y partidas | [github.com/miralante/ludia](https://github.com/miralante/ludia) |
| [Memofun](https://memofun.apptonomia.uk/) | Tarjetas de memoria con aprendizaje significativo | [github.com/miralante/memofun](https://github.com/miralante/memofun) |
| [Okeymoney](https://okeymoney.apptonomia.uk/) | Finanzas personales y autonomía cotidiana | [github.com/miralante/okeymoney](https://github.com/miralante/okeymoney) |
| [Routime](https://routime.apptonomia.uk/) | Actividades para rutinas y vida cotidiana | [github.com/miralante/routime](https://github.com/miralante/routime) |
| [Sinonimia](https://sinonimia.apptonomia.uk/) | Diccionario en lectura fácil | [github.com/miralante/sinonimia](https://github.com/miralante/sinonimia) |
| [Teclatlon](https://teclatlon.apptonomia.uk/) | Mecanografía con el teclado físico | [github.com/miralante/teclatlon](https://github.com/miralante/teclatlon) |

La guía canónica de Cloudflare / despliegue para el grupo vive en
[`CLOUDFLARE.md` de Apptonomia](https://github.com/miralante/apptonomia/blob/master/CLOUDFLARE.md).
Este repo usa el modelo **Workers + static assets** (`wrangler.toml`
+ `[assets]`), que es una forma distinta al modelo Pages clásico de
Apptonomia/Teclatlon — ver [`CLOUDFLARE.md`](CLOUDFLARE.md) para la
guía local.



