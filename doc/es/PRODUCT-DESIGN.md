# PRODUCT-DESIGN.md — Home en tres bloques: aprender, comprobar y simular

> **Este documento es la fuente de verdad para el rediseño v2 de la home.**
>
> El mapa compacto de contenidos está en [`INDICE-APRENDIZAJE.md`](INDICE-APRENDIZAJE.md).
>
> Define un **cambio arquitectónico deliberado** en Okeymoney: la home
> pasa a ser un recorrido estilo Apptonomia con tres bloques visibles:
> contenido didáctico, tests con recompensa en Tokens y simulación con
> euros. El estado de dinero y metas vive en el tercer bloque, siempre
> visible en la misma pantalla. Esto **invierte** la regla de "app de un solo
> propósito, no catálogo" que [`technical.md`](../es/tecnico.md) §2 y
> [`CLAUDE.md`](../../CLAUDE.md) declararon para v1 — la inversión es
> intencionada, acotada a v2, y queda documentada aquí.
>
> **No redefine reglas de producto ni de accesibilidad.** Esas siguen
> en [`SPEC.md`](SPEC.md). Cuando este documento y `SPEC.md`
> discrepen, gana `SPEC.md`.

---

## 1. Contexto y motivación

### 1.1 Dónde quedó v1

v1 sale con tres pestañas inferiores:

- **Mi dinero** — el dashboard: saldo, historial, chip del monedero
  de práctica.
- **Mis metas** — lista de metas de ahorro + flujos de crear y añadir.
- **Aprender** — el catálogo de 7 actividades de práctica, agrupado en
  dos secciones temáticas (Aprende a gestionar tu dinero / Mantén tu
  dinero a salvo), según [`actividades.md`](actividades.md).

El catálogo estilo Apptonomia **ya existe**, pero vive detrás de una
pestaña. Las apps hermanas (Apptonomia, Calculia, Teclatlon) abren
**directamente sobre el catálogo**. La arquitectura actual de
Okeymoney se justificó en [`technical.md`](../es/tecnico.md) §2 como
"app de un solo propósito, no catálogo de actividades aisladas"
porque el ledger real debe mantener coherencia entre pantallas. Esa
justificación vale para la **capa de datos** (sigue valiendo), pero no
obliga a esconder el catálogo detrás de una pestaña.

### 1.2 Qué cambia en v2

- **La home deja de ser una pestaña y pasa a ser una pantalla con
  catálogo primero.** El héroe de la home es la rejilla Apptonomia
  de actividades, agrupadas en tres secciones temáticas en orden
  pedagógico:
  1. Conceptos básicos — qué es el dinero, necesito o quiero.
  2. Vida cotidiana — presupuesto, ir a la tienda, calcular la vuelta,
     día completo de compras.
  3. Seguridad — awareness de estafas (una actividad, mostrada la
     última porque es la habilidad práctica con mayor riesgo).
- **El estado del dinero real se mueve a una tarjeta "Mi dinero"
  compacta** en la parte superior de la home (encima del catálogo),
  no detrás de una pestaña.
- **El estado de metas se mueve a una tarjeta "Mis metas" compacta**
  debajo de "Mi dinero", también en la home. La pantalla completa de
  metas queda accesible vía una afordancia de "abrir" en la tarjeta
  (sub-pantalla nivel 1).
- **La barra de pestañas inferior se simplifica**: la acción de
  "Registrar un gasto" vive dentro del bloque de simulación y no hay
  ningún botón flotante que duplique esa entrada.

### 1.3 Qué se conserva

- **La capa de datos** sigue teniendo un ledger compartido
  ([`technical.md`](../es/tecnico.md) §2–§3): Mi dinero, movimientos,
  metas y el monedero de práctica siguen leyendo y escribiendo las
  mismas claves de `localStorage`. La regla de modelo de datos "no
  catálogo de actividades aisladas" se mantiene; solo cambia el
  *modelo de navegación*.
- **El bucle Socrático de actividades** en
  [`assets/js/activity-runtime.js`](../../assets/js/activity-runtime.js)
  no se toca — cada `tools/<slug>/` sigue usándolo. Solo se mueve el
  punto de entrada (la tarjeta del catálogo en la home en vez del
  listado de la pestaña "Aprender").
- **El wizard de introducción de importes** en `app.js`
  (`renderAmountStep`) es el componente que reutiliza todo flujo que
  pide un precio; sin cambios.
- **Reglas de accesibilidad** ([`SPEC.md`](../es/SPEC.md) §3.5),
  **política de idioma** (es fuente de verdad, paridad en, [`I18N.md`](I18N.md)),
  **tema oscuro**, **privacidad por defecto** — todo sin cambios.
- **Las 7 activities** se quedan en sus mismos paths
  (`tools/<slug>/`). Solo cambia el orden en que se agrupan en la
  home.

### 1.4 Fuera de alcance (no-objetivos explícitos)

| No entra en este rediseño | Por qué |
|---|---|
| Añadir activities nuevas | Pedagogía, no navegación; fuera de aquí |
| Cambiar el esquema de datos o la API `App.*` | Comportamiento, no navegación |
| Cambiar el bucle Socrático o el wizard de importes | Son los building blocks; no se tocan |
| Partir la app en shell `site/` + `tools/<slug>/` como Apptonomia | Rompería PWA + offline; las tarjetas del catálogo viven en `index.html` directamente, renderizadas desde `data.js` |
| Un toggle para recuperar el layout de tres pestañas de v1 | Fuera de v2; si hace falta más adelante, tarea separada |
| Auth, sync multi-dispositivo, ledger en la nube | Excluidos explícitamente por [`SPEC.md`](../es/SPEC.md) §3.4 |

---

## 2. La visión

### 2.1 Modelo mental

> **"Abrir Okeymoney y ver qué hacer a continuación."**

La home es una sola pantalla que cuenta al usuario, de un vistazo,
qué hacer a continuación en tres pasos:

1. **Aprender**: tarjetas didácticas breves, sin nota ni penalización.
2. **Comprobar**: las 7 activities en orden pedagógico (conceptos → vida
   cotidiana → seguridad), con Tokens y checks de progreso tranquilos.
3. **Simular**: saldo, metas y registro de un gasto en euros, con la
   acción disponible directamente en este bloque.

### 2.2 Catálogo ↔ plano del dinero, conceptualmente

Hay **dos planos** que deben estar separados pero visibles juntos:

- **Plano real** — Mi dinero (€) y Mis metas (€). Un ledger
  coherente. Cada cambio (movimiento, aportación a meta) se refleja
  al instante en ambas pantallas.
- **Plano de práctica** — Tokens 🔷 (`okeymoney:practiceWallet`).
  Una moneda ficticia que se gana completando actividades, nunca
  convertible a €. El chip del monedero de práctica aparece en la
  tarjeta Mi dinero y en cada tarjeta de actividad (para que la
  persona vea que acumula Tokens practicando).

La home hace visible esta dualidad todo el rato: la tarjeta **Mi
dinero** muestra € + Tokens, la tarjeta **Mis metas** muestra solo €,
y el **catálogo** muestra la recompensa en Tokens que cada
  actividad acredita.

### 2.3 Estratificación de la home

La home implementa una progresión única y reconocible, tanto en el
contenido como en el diseño visual:

1. **Bloque didáctico — Aprende paso a paso.** Catorce tarjetas breves
   explican el valor del dinero, las decisiones de compra, el ahorro, la
   vuelta, la seguridad, los documentos, la foto financiera, el control,
   la vida útil de los bienes, la rentabilidad, el riesgo y las operaciones
   de inversión, los tipos de tarjetas y cuentas bancarias, y la vivienda.
   Cada unidad contiene la explicación y, a continuación, la fase de test
   correspondiente.
   No hay nota ni penalización: prepara para practicar.
2. **Bloque de test — Comprueba lo que sabes.** Muestra un índice de las
   siete activities existentes y devuelve a cada unidad. El test se ejecuta
   dentro de la unidad, conserva el bucle Socrático y acredita Tokens en el
   monedero de práctica, separado del ledger de euros.
3. **Bloque de simulación — Situaciones reales con dinero.** Las tarjetas
   de saldo, metas y registro de gasto representan compras, pagos y ahorro
   de la vida diaria con importes en euros. Incluye además prácticas de
   vuelta, seguridad, derechos cotidianos, comunicación del dinero,
   imprevistos y el ciclo documental pedido → albarán → factura → pago.
   Son ensayos reversibles y seguros; solo el gasto confirmado escribe en
   el ledger local y no existe conexión bancaria. La depreciación usa una
   estimación lineal para enseñar la pérdida de valor; la obsolescencia
   presenta decisiones de reparar, reutilizar o sustituir antes de gastar.
   Rentabilidad y riesgo se practican con una ganancia hipotética y una
   comparación de plazo, disponibilidad y diversificación, sin prometer resultados.
   También se reconocen las operaciones de compra/aportación, venta/reembolso,
   cobro de rendimientos y traspaso, sin conectar con un bróker.
   La práctica bancaria diferencia débito, crédito, prepago, cuenta corriente
   y cuenta de ahorro por el origen y el momento del cobro, sin recomendar
   entidades.
   La práctica de vivienda compara alquiler y propiedad con gastos iniciales,
   cuotas, mantenimiento, flexibilidad y plazo, sin imponer una respuesta.

Cada bloque se presenta como una sección grande con borde de color,
encabezado, texto de orientación y tarjetas blancas redondeadas. Es la
misma gramática visual de Apptonomia: anclas tipo píldora, pictogramas
grandes, mucho espacio y una sola columna en móvil. La estratificación es
de navegación y presentación; no mezcla los almacenes de Tokens y euros.

### 2.4 Ayuda progresiva para la autonomía

Antes de los tres bloques aparece una tarjeta **Tu siguiente paso**. Lee
solo el estado local imprescindible y propone una acción concreta:

- sin saldo anotado: contar y guardar el saldo actual;
- con saldo pero sin meta: elegir algo para ahorrar;
- con saldo y meta: registrar una compra y observar la consecuencia.

La sugerencia es siempre opcional. No hay rachas, avisos de urgencia ni
castigos por parar. Así la app acompaña una rutina financiera sencilla:
**conocer → decidir → actuar → comprobar**. Cada acción vuelve al saldo,
la meta o el historial para que la persona vea la relación entre su
decisión y el resultado.

---

## 3. Forma de la home (nivel 0)

La home es un scroll vertical único, de arriba abajo:

```
┌─────────────────────────────────────────────┐
│  [Header: nombre app + selector idioma]       │ ← sin cambios
├─────────────────────────────────────────────┤
│  ┌─ Tarjeta Mi dinero ────────────────────┐  │ ← §3.1
│  │  Tienes                  🔷 Tokens    │  │
│  │  € 12,50                  🔷 5,00      │  │
│  │  [preview de monedas]                  │  │
│  │  ──────────────────────────            │  │
│  │  Últimos movimientos                   │  │
│  │  🍎 Comida          − 3,50 €          │  │
│  │  🚌 Bus             − 1,50 €          │  │
│  │  Ver historial completo →              │  │
│  └───────────────────────────────────────┘  │
│                                              │
│  ┌─ Tarjeta Mis metas ────────────────────┐  │ ← §3.2
│  │  Mis metas                             │  │
│  │  🪧 Auriculares   3,00 / 8,00 €   37%  │  │
│  │  🎮 Consola       0,00 / 200,00 €   0%  │  │
│  │  Ver todas / crear nueva →             │  │
│  └───────────────────────────────────────┘  │
│                                              │
│  Aprende con Okeymoney                       │ ← §3.3 título catálogo
│                                              │
│  ▌Conceptos básicos                          │ ← tema 1
│  ┌──────┐ ┌──────┐ ┌──────┐                 │
│  │ 🪙 1 │ │ ❓ 2 │ │      │                 │
│  │dinero│ │neces.│ │      │                 │
│  └──────┘ └──────┘ └──────┘                 │
│                                              │
│  ▌Vida cotidiana                             │ ← tema 2
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐        │
│  │ 💰 1 │ │ 🛒 2 │ │ 🧮 3 │ │ 📅 4 │        │
│  └──────┘ └──────┘ └──────┘ └──────┘        │
│                                              │
│  ▌Seguridad                                  │ ← tema 3
│  ┌──────┐                                    │
│  │ 🛡 5 │                                    │
│  └──────┘                                    │
│                                              │
├─────────────────────────────────────────────┤
│  [Footer: legal + apps hermanas]            │ ← sin cambios
├─────────────────────────────────────────────┤
│  [Tab bar: home / + / ?]                    │ ← §3.4
└─────────────────────────────────────────────┘
```

### 3.1 Tarjeta Mi dinero

Una tarjeta compacta que combina el dashboard Mi dinero de v1 con el
chip del monedero de práctica:

- Fila superior: **Tienes** + el saldo grande formateado
  (`--texto-700`, `--acento`). Tocarlo abre el **wizard de reconteo
  de saldo** (el flujo de un paso "¿cuánto dinero tienes ahora?" de
  [`SPEC.md`](../es/SPEC.md) §3.6.c).
- Debajo del saldo: el preview en vivo de monedas/billetes (misma
  lógica de `App.money.breakdown` + paint que hoy).
- A la derecha del saldo (o debajo en pantallas estrechas): chip
  **🔷 Tokens** con el valor del monedero de práctica formateado.
- Debajo: los últimos 3 movimientos (mismo componente de fila que
  hoy), con una afordancia **"Ver historial completo"** que abre la
  vista de historial completa (sub-pantalla nivel 1).
- La tarjeta **"Registrar un gasto"** del bloque de simulación mantiene
  la acción visible donde corresponde.

### 3.2 Tarjeta Mis metas

Una tarjeta compacta con la lista de metas y sus barras de progreso:

- Una fila por meta: icono + nombre + `X € de Y €` + barra fina.
- Hasta 3 metas visibles; si hay más, la tarjeta muestra las 3
  primeras + una afordancia **"Ver todas"** que abre la vista
  completa de metas (la pantalla de metas de v1, refactorizada a
  sub-pantalla nivel 1).
- Un enlace **"+ Nueva meta"** dentro de la tarjeta abre el wizard
  de crear meta (el flujo de 2 pasos existente).
- Estado vacío (sin metas): una invitación corta + el mismo enlace
  **"+ Nueva meta"**.

### 3.3 Unidad didáctica con test integrado

Cada unidad didáctica contiene dos fases consecutivas: la explicación y
el test correspondiente. El índice de temas ya no se duplica como un
catálogo independiente.

Las dos fases se muestran siempre en vertical: primero el contenido y,
justo después, el test. Los enlaces de la segunda fase llevan a la
actividad real en `tools/<slug>/index.html`, y muestran el estado de
Tokens sin duplicar el contenido del test.

### 3.4 Barra de pestañas inferior

Tras v2 la barra no incluye un FAB adicional:

- **Home** — la pantalla de catálogo + tarjetas (siempre el botón
  izquierdo).
- La acción "Registrar un gasto" se encuentra en el bloque de simulación.
- *(slot derecho reservado)* — un **botón de idioma** pequeño para
  cambiar sin hacer scroll. Si prefieres no duplicarlo, se quita y se
  usa solo el selector del header.

> **La pestaña Aprender se elimina.** El catálogo ES la home, así
> que una segunda pestaña apuntando al mismo contenido confundiría.
> Las activities siguen en `tools/<slug>/`; lo único que se quita es
> el `<section id="screen-learn">` de v1 y su botón de pestaña.

### 3.5 Accesibilidad de los wizards

Los wizards que hoy viven tras una pestaña son accesibles desde las
nuevas tarjetas:

| Wizard | Accesible desde |
|---|---|
| Registrar un gasto | Tarjeta "Registrar un gasto" dentro del bloque de simulación |
| Nueva meta | "+ Nueva meta" dentro de la tarjeta Mis metas |
| Añadir dinero a una meta | Tap en una fila de meta de la tarjeta Mis metas (o de la vista completa) |
| Reconteo de saldo | Tap en la cifra grande del saldo en la tarjeta Mi dinero |
| Historial completo | "Ver historial completo" en la tarjeta Mi dinero |
| Vista completa de metas | "Ver todas" en la tarjeta Mis metas |

Esto mantiene intacta la **regla de navegación máximo 3 niveles**
([`SPEC.md`](../es/SPEC.md) §6).

---

## 4. Contenido de unidades y tests (nivel 0)

### 4.1 Las 7 activities y sus unidades

Las 7 activities ya documentadas en [`actividades.md`](actividades.md)
se asignan a las unidades didácticas mediante `DATA.learningIndex`.
La tabla conserva sus temas y orden de dificultad:

| Tema | Orden | Slug | Título (es / en) | Recompensa (🔷) |
|---|---|---|---|---|
| Conceptos básicos | 1 | `concepts-money` | ¿Qué es el dinero? / What is money? | 5,00 |
| Conceptos básicos | 2 | `needs-vs-wants` | Necesito o quiero / Need or want | 8,00 |
| Vida cotidiana | 3 | `budget-first` | ¿Qué compro primero? / What do I buy first? | 12,00 |
| Vida cotidiana | 4 | `go-shopping` | Ir a la tienda / Go shopping | 20,00 |
| Vida cotidiana | 5 | `change-back` | Calcular la vuelta / Working out change | 30,00 |
| Vida cotidiana | 6 | `my-shopping-day` | Mi compra del día / My shopping day | 60,00 |
| Seguridad | 7 | `safe-money` | Mi dinero está seguro / My money is safe | 15,00 |

Misma recompensa total (🔷 150,00 si se completa todo) que en v1.

### 4.2 Acentos del recorrido

La fase didáctica usa el acento cálido y la fase de test el acento azul;
el bloque 2 reutiliza el azul para su índice. La relación visual de
ambas fases dentro de una unidad hace visible el orden enseñar → testear.

### 4.3 Renderizado de unidades e índice

`renderDidacticLessons()` genera las unidades y sus enlaces de test;
`renderTestIndex()` genera el índice alternativo del bloque 2. Ambos
renderers consumen la misma relación `DATA.learningIndex`, y
`scripts/check.js` comprueba que ninguna unidad queda sin test ni ruta.

---

## 5. La tarjeta Mi dinero y el ledger compartido

### 5.1 Por qué la tarjeta vive en la home

La tarjeta sirve para hacer **siempre visible el estado del ledger
real**. La persona no necesita cambiar de pestaña para saber
"cuánto dinero tengo ahora mismo" — lo ve en cuanto abre la app. Es
el mismo papel que la insignia "tu progreso" de Apptonomia juega
para sus actividades de práctica, aplicado al plano del dinero real.

### 5.2 Qué hace y qué no hace la tarjeta

**Hace:**

- Mostrar el saldo actual + el preview en vivo de monedas/billetes.
- Mostrar el chip del monedero de práctica.
- Mostrar los últimos 3 movimientos.
- Ofrecer entrada en un tap a "Registrar un gasto" dentro de simulación.
- Ofrecer entrada en un tap a "Reconteo de saldo" (tap en la cifra).
- Ofrecer entrada en un tap a la vista de historial completa.

**No hace:**

- Sustituir la vista de historial completa (solo muestra los últimos
  3; la vista completa está a un tap).
- Sustituir el wizard de crear meta (muestra máximo 3 metas; la vista
  completa está a un tap).
- Tener estado propio — siempre lee directamente de `okeymoney:data`
  y `okeymoney:practiceWallet`.

### 5.3 Coherencia con el resto de la app

La **vista de historial completa** y la **vista de metas completa**
son sub-pantallas nivel 1 (el nivel de wizard, según
[`SPEC.md`](../es/SPEC.md) §6). Se abren desde las tarjetas de la
home y entre sí a través de enlaces existentes. Renderizan los
mismos datos que las tarjetas; solo renderizan más. Sin estado
nuevo.

---

## 6. Tarjeta Mis metas

### 6.1 Mismo patrón, alcance menor

La tarjeta Mis metas es la vista de metas, acotada a un tamaño de
vistazo: icono + nombre + `X € de Y €` + barra de progreso fina,
máximo 3 filas visibles.

### 6.2 Vista completa accesible

La vista completa de metas (el `<section id="screen-goals">` de v1)
se refactoriza de pestaña a **sub-pantalla nivel 1**, abierta vía:

- La afordancia "Ver todas" en la tarjeta Mis metas.
- La afordancia "Nueva meta" en la tarjeta Mis metas (la vista
  completa es donde vive el wizard de crear meta, según el flujo
  existente).
- Un enlace "Mis metas" desde el footer o cualquier detalle de
  historial, si queremos enlazar entre vistas.

La vista completa mantiene el wizard de crear meta (2 pasos) y el
wizard de añadir dinero a meta (1 paso, reutiliza
`renderAmountStep`).

### 6.3 Qué cambia en los datos

Nada. El array de metas en `okeymoney:data` no se toca. Solo el
renderer que produce la UI de metas pasa de pestaña a tarjeta +
sub-pantalla.

---

## 7. La barra de pestañas inferior

### 7.1 De 4 destinos a 2 + FAB

v1: `home` · `+` (FAB) · `goals` · `learn`
v2: `home` · *(botón de idioma opcional)*; el gasto se registra en simulación

Las pestañas Aprender y Mis metas se **eliminan**, no se ocultan.
Sus pantallas son accesibles desde la home vía las tarjetas (ver §3.5).

### 7.2 Por qué esto es compatible con la regla "no catálogo"

La regla de v1, reformulada de [`CLAUDE.md`](../../CLAUDE.md) y
[`technical.md`](../es/tecnico.md) §2, era: *"Okeymoney es una app
de un solo propósito, no un catálogo de actividades aisladas. No
introducir una separación `site/` + `tools/<slug>/` como
Apptonomia/Calculia."*

La mitad de **capa de datos** de esa regla **sigue vigente**: el
ledger es un único blob JSON compartido, y las activities en
`tools/<slug>/` nunca leen el storage de las otras. Lo que v2
cambia es el *modelo de navegación*: la home ahora expone las
activities como tarjetas. Esto es una decisión de diseño visual /
información, no una violación de datos ni de fronteras.

La **separación `tools/<slug>/` se mantiene** y sigue siendo
correcta porque cada `tools/<slug>/index.html` es una página
estática autocontenida con sus propios JS / i18n / data, y el
despliegue PWA estilo Apptonomia depende de eso. Lo que v2 **no**
hace es introducir un nuevo shell `site/` — la home sigue en
`index.html` y las tarjetas del catálogo son solo elementos
`<a href="tools/<slug>/index.html">`.

---

## 8. Cambios concretos (archivo por archivo)

| Archivo | Acción | Notas |
|---|---|---|
| `index.html` | **Reestructurar** | Sustituir los 3 `<section id="screen-…">` por una sola sección home con la tarjeta Mi dinero, la tarjeta Mis metas y el catálogo. Borrar `screen-learn` y `screen-goals` del marcado. Añadir las nuevas cadenas. |
| `app.js` | **Refactor de renderers** | Sustituir `renderHome`, `renderGoals`, `renderLearn` por un único `renderHome()` que emite las tres (tarjetas + catálogo). Añadir `renderHistoryView()` y `renderGoalsView()` como sub-pantallas nivel 1, accesibles desde las tarjetas. El wizard de importes y el bucle Socrático no se tocan. |
| `data.js` | **Extender `learnThemes`** | Añadir el tercer tema `conceptos` (o equivalente); asegurar que `renderLearn` (ahora parte de `renderHome`) itera los tres temas. Contenido neutro al locale solo. |
| `tools/<slug>/index.html` | **Sin cambios** | Cada actividad sigue cargando su propio JS / i18n / data. Las tarjetas enlazan aquí; nada más cambia. |
| `styles.css` | **Extender** | Añadir `.money-card` y `.goals-card` si hace falta; reutilizar `.activity-card` (ya existe de v1) para el catálogo. |
| `assets/css/componentes.css` | **Extender** | Un componente nuevo, `.app-card`, para el layout de las tarjetas Mi dinero y Mis metas. |
| `strings.es.js` / `strings.en.js` | **Añadir claves** | Títulos del catálogo, nombres de secciones, "Ver historial completo", "Ver todas", "+ Registrar un gasto" dentro de la tarjeta Mi dinero, etc. Mismas claves en ambos archivos. |
| `TODO.md` | **Actualizar** | El rediseño visual hecho en v1.1 (ya entregado) se referencia; el trabajo de navegación v2 es un esfuerzo separado y acotado. |
| `CLAUDE.md` | **Actualizar** | Añadir nota de que la regla "no catálogo" se invierte para el *modelo de navegación* en v2; la regla de capa de datos sigue vigente. |
| `doc/en/technical.md` | **Actualizar** | §2 reencuadra la justificación de "app de un solo propósito": la capa de datos sigue compartida, la navegación pasa a ser catálogo primero. |
| `doc/es/actividades.md` | **Actualizar** | Reagrupar la tabla en los tres temas v2 (`concepts` / `daily` / `safety`); el catálogo de 7 actividades en sí no cambia. |
| `sw.js` | **Subir VERSION + FILES** | Mismo patrón que el rediseño visual v1.1. |

---

## 9. Fases

Cada fase termina en un estado verificable. La app debe seguir
funcionando en cada paso (sin pantallas a medias).

### Fase 1 — Tarjetas en la home (sin cambio de pestañas todavía)

- Construir las nuevas tarjetas `Mi dinero` y `Mis metas` como
  componentes.
- Renderizarlas dentro del `<section id="screen-home">` existente.
- La pestaña Aprender sigue existiendo y funcionando.
- La pestaña Mis metas sigue existiendo y funcionando.
- Verificación: `node scripts/check.js` verde; la home tiene el
  nuevo diseño pero la barra de pestañas no cambia; todo flujo
  existente sigue funcionando.

### Fase 2 — Catálogo en la home (pestaña Aprender aún viva)

- Renderizar el catálogo de tres temas en la home (debajo de las
  tarjetas).
- La pestaña Aprender sigue existiendo como atajo redundante.
- Verificación: la home muestra tarjetas + catálogo; la pestaña
  Aprender sigue mostrando el mismo catálogo (puede llamar al mismo
  renderer); todos los flujos siguen funcionando.

### Fase 3 — Eliminar pestañas Aprender + Mis metas

- Eliminar el `<section id="screen-learn">` y su botón de pestaña.
- Eliminar el botón de pestaña `<section id="screen-goals">`; el
  renderer queda accesible como sub-pantalla nivel 1 desde la
  tarjeta Mis metas.
- La barra de pestañas queda `home · + · ?`.
- Verificación: la home es el único destino; las dos sub-pantallas
  (historial, metas) se abren vía las tarjetas; `node scripts/check.js`
  verde; no quedan referencias a `screen-learn` o `screen-goals` en
  `index.html`, `app.js` o `styles.css`.

### Fase 4 — Pulido, accesibilidad, smoke test

- Por [`SPEC.md`](../es/SPEC.md) §3.5: cada acción accesible en un
  tap, cada opción visible tiene etiqueta accesible, contraste
  verificado en tema oscuro.
- Smoke test manual: abrir la home, ver las tres tarjetas, tocar la
  afordancia "abrir" de cada tarjeta, completar una actividad de
  principio a fin, registrar un gasto, crear una meta y añadirle
  dinero.
- Subir `sw.js` a v16 (o lo que toque tras v15).

---

## 10. Criterios de éxito

v2 se entrega cuando **las cuatro fases** están hechas y:

1. La home renderiza tarjetas + catálogo en un único scroll vertical,
   tema oscuro activo, contraste WCAG AA.
2. No hay botón flotante: el registro de gasto está en simulación.
3. Las 7 activities son accesibles desde el catálogo de la home.
4. La tarjeta Mi dinero, la tarjeta Mis metas, la vista de historial,
   la vista de metas, el wizard de Registrar un gasto, el wizard de
   crear meta y el wizard de añadir dinero a meta siguen funcionando
   de principio a fin con el esquema de datos existente.
5. `node scripts/check.js` está verde.
6. `SPEC.md`, `CLAUDE.md`, `technical.md`, `README.md`,
   `actividades.md` y este doc son coherentes (sin contradicciones).
7. No quedan referencias a `screen-learn` o `screen-goals`.

---

## 11. Riesgos y mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| La tarjeta Mi dinero hace la home demasiado larga antes del catálogo | Media | Medio | Las tarjetas solo renderizan lo esencial (3 movimientos, 3 metas); "Ver historial completo" y "Ver todas" llevan a las vistas completas en un tap. Probado en viewports de móvil (≤ 480 px) en Fase 4. |
| Quitar la pestaña Aprender rompe la memoria muscular | Media | Bajo | La Fase 2 mantiene la pestaña Aprender visible como atajo durante la transición; se elimina solo en Fase 3. El catálogo de la home está a un tap desde cualquier pestaña. |
| Las activities del catálogo cargan lentas en la primera visita | Baja | Bajo | Cada `tools/<slug>/` ya está en `sw.js` `FILES` y pre-cacheada; el coste de primera carga es el mismo de hoy. |
| El rediseño visual (v1.1) y el de navegación v2 colisionan | Media | Medio | Las fases están acotadas: v1.1 visual está **hecho** y no se toca. v2 navegación usa la misma capa de componentes (`.app-card`, `.activity-card`) sin sobreescribir tokens. |
| Las tarjetas de actividad compiten visualmente con la tarjeta Mi dinero | Media | Medio | La tarjeta Mi dinero usa el acento activo del body (`--acento`, verde); las tarjetas de actividad usan el acento de su tema (por sección). Los títulos de sección subordinan visualmente el catálogo. |
| Romper la regla "no catálogo" de `CLAUDE.md` confunde a futuros contribuidores | Baja | Medio | `CLAUDE.md` y `technical.md` §2 se actualizan en el mismo commit; la justificación de la inversión se documenta en §7 de este doc. |
| Subir `sw.js` invalida la caché PWA a mitad del rediseño | Baja | Medio | La Fase 4 es la única subida; coordinarla con quien tenga la PWA instalada para pruebas. |

---

## 12. Documentos afectados

Cuando v2 salga, los siguientes docs deben ser coherentes con este
archivo:

- [`doc/es/SPEC.md`](SPEC.md) — sin cambios (reglas de producto no
  afectadas).
- [`doc/es/tecnico.md`](../es/tecnico.md) — §2 reencuadra la
  justificación de "app de un solo propósito".
- [`doc/es/actividades.md`](actividades.md) — actualizado para la
  reagrupación v2 en tres temas (`concepts` / `daily` / `safety`),
  que sustituye al antiguo split de dos temas (`learn` / `safe`).
- [`doc/es/I18N.md`](../es/I18N.md) — sin cambios (arquitectura no
  tocada).
- [`CLAUDE.md`](../../CLAUDE.md) — añadir nota sobre la inversión
  del modelo de navegación; la regla de capa de datos sigue vigente.
- [`README.es.md`](../../README.es.md) — añadir este archivo a la
  tabla de documentación.
- [`TODO.md`](../../TODO.md) y [`TODO.es.md`](../../TODO.es.md) —
  referenciar v2 como el siguiente esfuerzo acotado tras el visual
  v1.1.

---

## 13. Cómo está organizado este documento

- §1 — contexto, motivación, qué cambia, qué se conserva, fuera de
  alcance.
- §2 — la visión.
- §3 — forma de la home.
- §4 — contenido del catálogo y orden de temas.
- §5 — la tarjeta Mi dinero.
- §6 — la tarjeta Mis metas.
- §7 — la barra de pestañas inferior.
- §8 — cambios archivo por archivo.
- §9 — plan por fases.
- §10 — criterios de éxito.
- §11 — riesgos.
- §12 — documentos afectados.
- §13 — este mapa.

Este documento es un **plan**, no un contrato. Se actualiza a medida
que aprendemos. Cuando cambia, el cambio va en el commit que lo
implementa, no en un commit "doc" aparte.
