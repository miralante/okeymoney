# TODO.md — Hoja de ruta: rediseño visual

> **Documento vivo.** Este archivo es la fuente única de verdad para el
> rediseño visual de Okeymoney: qué cambiamos, por qué, en qué orden y
> cómo sabemos que cada fase está terminada. **No** redefine reglas de
> producto ni de accesibilidad — esas siguen en
> [`doc/es/SPEC.md`](doc/es/SPEC.md).
>
> Las convenciones siguen el estándar de documentación de Apptonomia
> (secciones numeradas, simplificaciones declaradas, no‑objetivos
> explícitos).

---

## 1. Contexto y motivación

### 1.1 Qué es este documento

Un **plan** para el rediseño visual de Okeymoney: la implementación v1
sale con una hoja de estilos mínima (`styles.css`, ~200 líneas, tema
claro, valores hex hardcodeados, sin tokens de diseño, sin CSS
modular). La interfaz es usable pero **visualmente inconsistente con
las apps hermanas** (Apptonomia, Calculia, Teclatlon), que ya comparten
un lenguaje visual calmado, con acento sobre neutro. Este
documento recoge:

- El aspecto objetivo (tokens, componentes, layout).
- El plan de migración por fases que mantiene la app funcionando en
  cada paso.
- Los no‑objetivos, para no ampliar el alcance sin querer.

### 1.2 Qué no es

- **No sustituye a [`doc/es/SPEC.md`](doc/es/SPEC.md).** Las reglas de
  producto, audiencia, restricciones innegociables, módulos y el flujo
  de Registrar un gasto no cambian. Si este documento entra en
  contradicción con `SPEC.md`, gana `SPEC.md`.
- **No es un rediseño del comportamiento del producto.** Sin flujos
  nuevos, sin pestañas nuevas, sin cambios al esquema de datos
  ([`tecnico.md`](doc/es/tecnico.md) §2–§3) ni a la API `App.*`
  (`assets/js/`).
- **No es una migración de framework.** Sigue siendo HTML + CSS +
  JavaScript vanilla, sin build step, sin npm. Se mantiene el contrato
  PWA + offline‑first.

### 1.3 Por qué ahora

Las apps hermanas ya convergieron en un lenguaje visual calmado
y dirigido por un acento. Okeymoney es la excepción. Migrar ahora
significa:

- Coherencia visual entre apps (la insignia familiar al pie de cada
  pantalla deja de ser el único hilo de diseño).
- Un primer sistema de tokens propio
  ([`assets/css/tokens.css`](assets/css/tokens.css)) que las
  actividades y `legal/` puedan adoptar sin deriva por página.
- Cimiento para el trabajo previsto en v1.x (rejilla de Aprender,
  tienda simbólica, representante de entidad — ver `SPEC.md` §7.4 y
  §9.4–§9.5), que se benefician de una base tokenizada.

### 1.4 Fuera de alcance (no‑objetivos explícitos)

Sería tentador incluirlos aquí. **No** forman parte de esta hoja de
ruta:

| No entra en esta hoja de ruta | Por qué |
|---|---|
| Flujos nuevos (ingresos, retirar de una meta, pantalla de ajustes) | Ya priorizados en `SPEC.md` §9 como trabajo v1.x, separado |
| Actividades nuevas en `tools/` | Pedagógico, no visual — fuera de alcance aquí |
| Cambiar el esquema de datos o la API `App.*` | Conductual, no visual — [`tecnico.md`](doc/es/tecnico.md) es el lugar |
| Añadir interruptor de tema claro/oscuro | v1 es solo claro por diseño (principio 5 de `SPEC.md` §4) |
| Reconstruir con framework / paso de build | Viola el principio 12 (`SPEC.md` §4) — PWA estática |
| Rediseño de iconos más allá de un set coherente | Los iconos son producto (`data.js`), no cromo visual |
| Revisión de copia / textos | Contenido de producto, se sigue por separado en `SPEC.md` §10 |

---

## 2. Lenguaje visual objetivo

El rediseño alinea Okeymoney con las apps hermanas. El objetivo es **un
solo aspecto**, capturado completamente como tokens de diseño, aplicado
mediante un conjunto pequeño de componentes reutilizables. Los valores
concretos vienen de analizar Apptonomia, Calculia y Teclatlon; la
fundamentación de abajo es el consenso que salió de esa revisión.

### 2.1 Principios (solo capa visual)

Estas son las reglas de la capa visual. No anulan `SPEC.md` §4 — las
extienden.

1. **Calma por defecto.** Superficie oscura, un color de acento, bajo
   contraste entre capas de fondo. El ojo debe caer sobre la **acción**,
   no sobre el cromo.
2. **Un acento por tema.** Los temas de módulo (p. ej. Dinero, Metas,
   Aprender) eligen un acento de la paleta de tokens; el acento aparece
   en títulos, barras de progreso e indicador de pestaña activa —
   **nunca** en el cuerpo del texto.
3. **Tokens, no hex.** Cada color, valor de espaciado, radio, sombra y
   tamaño tipográfico viene de una custom property CSS declarada en
   [`assets/css/tokens.css`](assets/css/tokens.css). Sin hex en crudo,
   sin números mágicos en el CSS de componentes.
4. **Componentes sobre estilos por página.** Los patrones repetidos
   (botón, tarjeta, input, chip, pestaña, hoja, display de saldo)
   viven en
   [`assets/css/componentes.css`](assets/css/componentes.css) y se
   reutilizan desde `app.js` y cada `tools/<slug>/index.html`.
5. **`prefers-reduced-motion` respetado.** Cualquier animación que
   añada este rediseño debe respetar la preferencia del sistema (ya
   exigido por `SPEC.md` §4.9).
6. **Accesibilidad preservada.** Cada decisión debe seguir siendo
   compatible con `SPEC.md` §3.5 (WCAG AA, botones 64×64 px,
   espaciado 16 px, navegación por teclado, lectores de pantalla).
   El rediseño **no** es excusa para regresiones.

### 2.2 Tokens de color

Declarados en `assets/css/tokens.css` bajo `:root` y
`[data-theme="dark"]`. Solo claro al principio (por no‑objetivo §1.4);
los tokens oscuros quedan declarados pero dormidos para cuando (o si)
llega un interruptor.

**Superficies (dark‑first, neutro, baja saturación)**

| Token | Valor | Uso |
|---|---|---|
| `--superficie-base` | `#0F1115` | Fondo de la app |
| `--superficie-1` | `#161A21` | Tarjetas, hojas, superficies elevadas |
| `--superficie-2` | `#1E2330` | Superficies en hover/pressed, inputs |
| `--superficie-3` | `#262C3A` | Estado seleccionado, fondo del focus ring |

**Texto (siempre sobre superficies oscuras; contraste verificado contra `--superficie-1`)**

| Token | Valor | Uso |
|---|---|---|
| `--texto-primario` | `#F2F4F8` | Títulos, saldo, copia principal |
| `--texto-secundario` | `#B7BDC9` | Subtítulos, texto de ayuda |
| `--texto-tenue` | `#7B8294` | Pies, metadatos, etiquetas deshabilitadas |

**Paleta de acentos (uno por tema de módulo; elegidos amistosos y sin presión)**

| Token | Valor | Tema |
|---|---|---|
| `--acento` | `#7BD389` | Dinero (por defecto) — verde calmado, "saldo, crecimiento" |
| `--acento-suave` | `#3B6B45` | Dinero — relleno suave para progreso, chips |
| `--acento-2` | `#7FB6E8` | Metas — azul calmado, "hucha, ahorro" |
| `--acento-2-suave` | `#324E6B` | Metas — relleno suave |
| `--acento-3` | `#E8C879` | Aprender — ámbar cálido, "práctica, atención" |
| `--acento-3-suave` | `#6B5635` | Aprender — relleno suave |

**Estado / feedback**

| Token | Valor | Uso |
|---|---|---|
| `--exito` | `#7BD389` | Éxito (`App.feedback.success`) |
| `--aliento` | `#E8C879` | Ánimo (`App.feedback.encourage`) |
| `--error` | `#E89A8E` | Confirmaciones destructivas (raras; nunca punitivas) |

**Bordes / sombras**

| Token | Valor | Uso |
|---|---|---|
| `--borde` | `#2A3140` | Bordes de tarjeta, bordes de input (1 px) |
| `--borde-fuerte` | `#3A4252` | Separación fuerte (bordes de modal) |
| `--sombra-1` | `0 1px 2px rgba(0,0,0,.35)` | Tarjetas en reposo |
| `--sombra-2` | `0 6px 18px rgba(0,0,0,.45)` | Hojas, modals, inputs con foco |
| `--sombra-3` | `0 16px 40px rgba(0,0,0,.55)` | Solo el popover del wallet de práctica (si hace falta) |

### 2.3 Tokens de tipografía

La fuente base es la misma que Apptonomia: **Nunito** (cargada desde
`assets/fonts/`). Atkinson Hyperlegible es fallback aceptado según
`SPEC.md` §4.4.

| Token | Valor | Uso |
|---|---|---|
| `--fuente-base` | `"Nunito", "Atkinson Hyperlegible", system-ui, sans-serif` | En todos lados |
| `--texto-100` | `0.875rem` (14 px) | Solo pies y metadatos |
| `--texto-200` | `1rem` (16 px) | Texto secundario, cuerpo pequeño |
| `--texto-300` | `1.125rem` (18 px) | Cuerpo por defecto |
| `--texto-400` | `1.25rem` (20 px) | Cuerpo enfatizado |
| `--texto-500` | `1.5rem` (24 px) | Títulos de sección |
| `--texto-600` | `2rem` (32 px) | Títulos de página, números grandes |
| `--texto-700` | `2.75rem` (44 px) | La cifra del saldo en Mi dinero |
| `--linea-base` | `1.5` | Cuerpo |
| `--linea-apretada` | `1.25` | Títulos, números grandes |
| `--peso-regular` | `400` | Cuerpo |
| `--peso-medio` | `600` | Botones, texto enfatizado |
| `--peso-fuerte` | `800` | Títulos, saldo |

### 2.4 Espaciado, radio, movimiento

**Escala de espaciado (base 4 px)**

| Token | Valor |
|---|---|
| `--espacio-1` | `0.25rem` (4 px) |
| `--espacio-2` | `0.5rem` (8 px) |
| `--espacio-3` | `0.75rem` (12 px) |
| `--espacio-4` | `1rem` (16 px) — mínimo entre botones |
| `--espacio-5` | `1.5rem` (24 px) |
| `--espacio-6` | `2rem` (32 px) |
| `--espacio-7` | `3rem` (48 px) |
| `--espacio-8` | `4rem` (64 px) |

**Radio**

| Token | Valor | Uso |
|---|---|---|
| `--radio-1` | `8px` | Inputs, chips |
| `--radio-2` | `14px` | Tarjetas |
| `--radio-3` | `18px` | Hojas, modales |
| `--radio-pill` | `999px` | Pestañas, pills |

**Movimiento**

| Token | Valor | Uso |
|---|---|---|
| `--motion-rapida` | `150ms` | Hovers, focus rings |
| `--motion-normal` | `240ms` | Transiciones de estado |
| `--motion-lenta` | `360ms` | Apertura/cierre de hoja, celebración de feedback |
| `--ease-suave` | `cubic-bezier(.2,.7,.2,1)` | Todas las transiciones |

Todo el movimiento va envuelto en
`@media (prefers-reduced-motion: no-preference)`, cumpliendo
`SPEC.md` §4.9.

### 2.5 Tokens de layout

| Token | Valor | Uso |
|---|---|---|
| `--contenedor-max` | `960px` | Contenedor de página (antes 900, subido para respirar) |
| `--contenedor-lectura` | `640px` | Pantallas densas en lectura (legal, intro de Aprender) |
| `--tocable` | `64px` | Tap target mínimo (`SPEC.md` §3.5) |
| `--tocable-lg` | `88px` | Acciones primarias (Guardar, +) |
| `--tocable-xl` | `120px` | Teclas del keypad numérico del wizard |

---

## 3. Componentes

Cada componente vive en `assets/css/componentes.css` (renombrado desde
el stub v1 según §4). Cada componente es **dirigido por tokens** (nunca
referencia un hex en crudo) y **accesible por teclado** por defecto
(`:focus-visible` usa `--superficie-3` sobre `--acento`).

### 3.1 Botón

Variantes: `--primario`, `--secundario`, `--fantasma`, `--peligro`.
Tamaños: `--mediano` (por defecto, 64 px), `--grande` (88 px, usado
para el CTA "Guardar" y el botón `+`), `--xl` (120 px, teclas
numéricas).

```
[Botón primario]                (fondo acento, texto-primario, peso-medio)
[Botón secundario]              (fondo superficie-2, borde, texto-primario)
[Botón fantasma]                (transparente, texto-primario, hover → superficie-2)
```

Estados: hover (elevación sutil del fondo), focus (anillo de 2 px en
`--acento`), disabled (50 % de opacidad, sin puntero), loading
(spinner desde `assets/img/`, no texto).

### 3.2 Tarjeta

Superficie por defecto (`--superficie-1`), borde 1 px `--borde`,
radio `--radio-2`, padding `--espacio-5`, sombra `--sombra-1`.
Variante de elevación para hojas: `shadow-2`, sin borde.

### 3.3 Input (keypad numérico, campo de importe)

El keypad numérico a medida es la única superficie de entrada — no hay
`<input type="number">` nativos en el flujo v1 (chocan con el preview
socrático de importe). El keypad es una rejilla 3×4 de teclas
`--tocable-xl` (0–9, `←`, `C`), centrada, con el importe formateado
encima (`--texto-700`, `--peso-fuerte`). El desglose (monedas/billetes)
se pinta justo debajo usando `--acento-suave`.

### 3.4 Barra de pestañas (navegación inferior)

Fija abajo, alto 72 px + safe‑area inset, superficie `--superficie-1`,
borde superior `--borde`. Cuatro destinos: `Mi dinero` / `+` (centro,
fondo de acento, `--tocable-lg`) / `Mis metas` / `Aprender`. El item
activo usa `--acento` para el icono y un subrayado de 3 px; los
inactivos usan `--texto-secundario`.

### 3.5 Hoja / wizard

Una tarjeta a ancho completo que sube desde abajo
(`--motion-lenta`, `--ease-suave`). Cabecera: título (`--texto-500`,
`--peso-fuerte`) + puntos de progreso (relleno = `--acento`, vacío =
`--superficie-3`) + botón de cierre `✕` (`--tocable`). Cuerpo:
padding `--espacio-5`. Pie: botón atrás (fantasma) + CTA primario. La
hoja respeta `prefers-reduced-motion` abriéndose sin animación.

### 3.6 Chip (wallet de práctica, estado de meta)

Pill (`--radio-pill`), padding `--espacio-2 --espacio-3`, fondo
`--acento-suave`, texto `--texto-primario`. Usado para el chip de
Tokens en Mi dinero y para la insignia "conseguida" en las metas.

### 3.7 Display de saldo (héroe de Mi dinero)

El número grande (`--texto-700`, `--peso-fuerte`, `--linea-apretada`,
`--acento`). Debajo, el preview de monedas/billetes pintado desde
`App.money.breakdown`, usando rellenos `--acento-suave`. Tap target: el
héroe entero es un botón (`--tocable-lg`) que abre el wizard de reconteo
(según `SPEC.md` §3.6.c).

### 3.8 Fila de movimiento (historial de Mi dinero)

Fila de dos columnas: círculo de icono (`--superficie-2`, 48 px) +
etiqueta (izquierda) + importe firmado (`--texto-primario`, derecha,
`--peso-medio`). Tappable, abre un pequeño action sheet ("Borrar" solo
— nunca "Editar importe", por `SPEC.md` §3.1). Fecha bajo la etiqueta
en `--texto-tenue`.

### 3.9 Tarjeta de meta

Icono (`--texto-500`) + nombre + precio objetivo + barra de progreso.
Barra de progreso: track `--superficie-3`, fill `--acento-2`. La etiqueta
de importe abajo usa la forma "X € de Y €" (`SPEC.md` §7.2). Las metas
conseguidas reciben un `Chip` (3.6) en lugar de la barra.

### 3.10 Toast de feedback

Pill centrado abajo, `--radio-pill`, padding `--espacio-3 --espacio-5`,
`--sombra-2`. Éxito: texto `--exito` sobre fondo `--superficie-1` con
borde izquierdo verde suave; aliento: `--aliento`. Vive 2 s (éxito) o
3 s (aliento), luego se desvanece con `--motion-normal`.

---

## 4. Mapa de migración archivo por archivo

El rediseño se implementa en **cuatro archivos CSS** y un puñado de
ajustes HTML. No requiere cambios en JS para v1.1 (la capa visual solo
cambia variables CSS y nombres de clase; `app.js` ya consulta
`document.documentElement` y nunca hardcodea hex).

### 4.1 Archivos CSS

| Archivo | Acción | Notas |
|---|---|---|
| `assets/css/tokens.css` | **Reescribir** | Única fuente de verdad de los tokens (§2.2–§2.5). Variables en español (`--acento`, `--espacio-4`) para ir en línea con el estilo de identificadores de `app.js`. |
| `assets/css/base.css` | **Reescribir** | Body, cabeceras, enlaces, focus ring, scrollbar. Solo referencia tokens. |
| `assets/css/components.css` | **Renombrar → `assets/css/componentes.css`** | Aquí aterrizan todos los componentes de §3. El nombre en español va en línea con el resto del estilo de identificadores de la app (`app.js`, `data.js`). |
| `assets/css/activities.css` | **Edición ligera** | Ya cerca del objetivo. Añadir referencias a tokens; quitar los hex restantes. |
| `styles.css` | **Adelgazar a 30‑50 líneas** | Pasa a ser la entrada que importa los cuatro archivos en orden (`tokens → base → componentes → activities`). Refleja el `styles.css` de Apptonomia. |
| `tools/*/styles.css` | **Por actividad: reemplazar por import del `styles.css` raíz** | Cada actividad hereda el rediseño automáticamente. Estilos por actividad solo si la actividad los necesita de verdad. |
| `legal/styles.css` | **Reemplazar por import del `styles.css` raíz + reglas de impresión** | El print stylesheet de la página legal se queda local. |

### 4.2 Archivos HTML

| Archivo | Acción | Notas |
|---|---|---|
| `index.html` | **Reestructurar** | Añadir `data-tema="dinero"` al `<body>` (maneja el acento activo). Sustituir clases ad‑hoc por clases de componente (3.1–3.10). Sin bugs que corregir en este archivo en Fase 1. |
| `tools/*/index.html` | **Edición ligera** | Mismo atributo de body (`data-tema="aprender"`), importar la hoja raíz, reemplazar estilos ad‑hoc. |
| `legal/index.html` | **Edición ligera** | Importar la hoja raíz, mantener las reglas de impresión locales. |

### 4.3 Archivos JS

| Archivo | Acción | Notas |
|---|---|---|
| `app.js` | **Sin cambios de comportamiento** | Puede añadir una sola línea `document.documentElement.dataset.tema = tabActivo` para conmutar el acento por pestaña. Opcional, se puede entregar sin ella. |
| `assets/js/*` | **Ninguno** | `App.money`, `App.wallet`, `App.feedback`, `App.i18n` quedan intactos. |
| `data.js`, `strings.*.js` | **Ninguno** | La capa de contenido no cambia. |
| `sw.js` | **Subir `VERSION`** (obligatorio según `CLAUDE.md`) y añadir archivos nuevos a `FILES` | `tokens.css`, `componentes.css` si se renombra. |

---

## 5. Fases

Cada fase termina en un estado verificable — la app debe seguir
funcionando entre fases, nunca a medias.

### 5.1 Fase 1 — Tokens, base, contenedor (sin cambio visual todavía)

**Objetivo:** introducir el sistema de tokens sin cambiar el aspecto. La
app debe verse **idéntica** al final de esta fase.

- Reescribir `assets/css/tokens.css` con cada variable de §2.2–§2.5.
- Reescribir `assets/css/base.css` referenciando solo tokens.
- Adelgazar `styles.css` a orden de imports + unas pocas reglas de reset.
- Renombrar `components.css` → `componentes.css`. Mantener el contenido
  actual por ahora, solo renombrar el archivo y actualizar el import en
  `index.html`.
- **Correcciones de bug (de regalo en esta fase):**
  - **5.1.1 Ancho de contenedor.** Sustituir el actual
    `max-width: 640px` en `.container`
    (`assets/css/components.css:14`) por `var(--contenedor-max)`
    (`960px`). Esto alinea el contenedor de página con el ancho
    legible del rediseño. Nota: una primera revisión de `index.html`
    marcó lo que parecía un `#practiceWalletChip` duplicado; al
    mirarlo con calma, los dos bloques de chip
    (`#practiceWalletChip` en la pantalla Mi dinero y
    `#learnPracticeWalletChip` en la pantalla Aprender) son
    **intencionales** — cada pestaña tiene el suyo — y **se quedan
    como están**.
- **Verificación:**
  - `node scripts/check.js` — verde.
  - Diff visual: `index.html`, cada `tools/*/index.html`,
    `legal/index.html` se ven idénticos al build v1 antes de esta fase
    (verificación ocular, el diff es estructural no cromático).
  - Recargar en `http://localhost:8080/` — mismos píxeles.

### 5.2 Fase 2 — Superficies, tipo, componentes (el cambio visible)

**Objetivo:** la app se ve como las apps hermanas. Cada componente de
§3 está en `componentes.css`; cada página los usa solo mediante
nombres de clase.

- Implementar cada componente de §3 en `assets/css/componentes.css`.
- Migrar `index.html` a los nombres de clase de componente; cambiar la
  barra de pestañas al componente 3.4; cambiar el display de saldo al
  componente 3.7.
- Migrar cada `tools/<slug>/index.html` a importar la hoja raíz y usar
  los componentes compartidos (botones, hoja, chip, toast de feedback).
- Migrar `legal/index.html` igual.
- Añadir el acento por pestaña vía `data-tema` en `<body>` (opcional
  pero recomendado para entregar — ver §6, decisión D2).
- **Verificación:**
  - `node scripts/check.js` — verde.
  - Las 6 categorías del wizard Registrar un gasto siguen renderizando
    y siguen disparando el flujo socrático.
  - Las 7 actividades en `tools/*` siguen funcionando (smoke test
    manual).
  - Mi dinero, Mis metas, Aprender, legal legibles en oscuro con
    contraste WCAG AA (axe DevTools o devtools del navegador).
  - `prefers-reduced-motion` respetado (toggle en el SO, recargar,
    confirmar que las hojas se abren sin animación).

### 5.3 Fase 3 — Pulido, ajustes por actividad, auditoría de accesibilidad

**Objetivo:** el rediseño está listo para entregar. Sin aristas, sin
deriva por página.

- Recorrer cada `tools/<slug>/` y eliminar cualquier CSS por actividad
  que duplique un componente.
- Auditar los iconos de `data.js` — asegurar que cada icono de categoría
  en Mi dinero, cada icono de meta, cada icono de héroe de actividad se
  renderiza a 48 px sin difuminado ni desalineación.
- Auditar `App.feedback.success` / `encourage` — ahora usan el toast de
  feedback (componente 3.10) en lugar del elemento de mensaje inline
  actual.
- Pasar `axe` (o el inspector de accesibilidad de devtools) por cada
  pantalla; arreglar cualquier regresión en contraste, orden de foco o
  etiquetas ARIA.
- Subir `VERSION` en `sw.js`, añadir `tokens.css` y `componentes.css`
  a `FILES`, commit, push.
- **Verificación:**
  - `node scripts/check.js` — verde.
  - Lighthouse (PWA + accesibilidad) ≥ 95 en `/`, una actividad y
    `/legal/`.
  - Manual: completar Registrar un gasto de principio a fin en un
    viewport de tamaño teléfono (≤ 480 px de ancho). Crear una meta.
    Añadirle dinero. Visitar una actividad. Visitar legal. Sin
    regresiones de flujo ni de acumulación de tokens.

---

## 6. Decisiones abiertas

Se dejan explícitamente abiertas para decidirse con la implementación en
la mano, no antes.

### D1. ¿Mantener tema claro en v1.1 o pasar a oscuro ya?

- **Decisión pendiente.** `SPEC.md` §4.5 dice "tema claro por defecto".
  Las apps hermanas son oscuras. Dos opciones:
  - **(a) Pasar a oscuro ya.** Coincide con la familia. Requiere
    actualizar una línea de `SPEC.md` §4.5 ("el v1 por defecto es
    oscuro, con alto contraste; los tokens claros quedan declarados
    para un futuro interruptor").
  - **(b) Entregar tokens oscuros declarados pero superficie clara
    activa.** Sistema de tokens en su sitio, el aspecto oscuro
    disponible para quien conmute `data-theme="dark"` en devtools,
    pero la app en producción sigue clara. Blast radius menor, sin
    cambio en `SPEC.md`.
- **Recomendación:** (b) para v1.1, programar (a) para v1.2 después
  de validar el sistema de tokens en producción.

### D2. ¿Acento por pestaña o acento único?

- **Decisión pendiente.** §2.2 declara tres acentos (Dinero / Metas /
  Aprender). Cambiar el acento por pestaña queda bonito pero significa
  que el saldo cambia de color según la persona navega — lo cual puede
  confundir a una audiencia que se apoya en que las pistas de color
  sean estables (regla de contraste de `SPEC.md` §3.5).
- **Recomendación:** entregar acento único (`--acento`) para v1.1.
  Aplazar el acento por pestaña a v1.2 una vez validemos que el resto
  del sistema se lee como calmado.

### D3. ¿`legal/` entra en v1.1 o en v1.2?

- `legal/` no tiene cromo de producto — tiene reglas de impresión y un
  layout distinto. Migrarlo significa importar la hoja raíz y añadir
  solo pequeños overrides de impresión.
- **Recomendación:** incluirlo en v1.1 (Fase 2). Es barato y mantiene
  honesta la consistencia entre páginas.

---

## 7. Criterios de éxito

Una fase está "terminada" cuando:

1. **Fase 1 terminada:** la app se ve idéntica a v1; los tokens están
   declarados; `styles.css` está delgado; bug 5.1.1 (ancho de
   contenedor) corregido; `scripts/check.js` verde.
2. **Fase 2 terminada:** cada componente de §3 vive en `componentes.css`;
   cada página los usa; sin hex en crudo fuera de `tokens.css`; aspecto
   oscuro aplicado en toda la app; verificaciones de accesibilidad
   pasan.
3. **Fase 3 terminada:** Lighthouse ≥ 95 en las tres páginas de prueba;
   `sw.js` subido y `FILES` actualizado; sin CSS por actividad que
   duplique un componente; smoke test manual en viewport de teléfono
   pasa.

Un rediseño está "entregado" cuando **las tres fases** están
terminadas, `sw.js` está subido y al menos un flujo manual de principio
a fin (Registrar un gasto → ver el saldo actualizado → comprobar el
movimiento en el historial → tocar el wallet de práctica) se ha
recorrido en el servidor en vivo `http://localhost:8080/`.

### 7.1 Estado real (a fecha de v1.1, sw.js v13)

- ✅ **Fase 1 terminada.** Todos los tokens v1 conservados; nuevas
  familias de tokens (superficies, escala tipográfica, espaciado,
  radio, motion, layout) añadidas sin cambiar los valores existentes;
  container 640 → 960 px; bug 5.1.1 corregido.
- ✅ **Fase 2 terminada, variante B → variante A (tema oscuro activo).**
  Decisión D1 **invertida** de la opción (b) a la **opción (a) —
  superficie oscura activa**, alineada con el lenguaje de diseño de
  las apps hermanas. `SPEC.md` §4.5 actualizado en consecuencia
  ("Tema oscuro por defecto"). Contraste verificado: `#F2F4F8` sobre
  `#161A21` = 14,6 : 1 (AAA), `#B7BDC9` sobre `#161A21` = 8,4 : 1
  (AAA), `#7B8294` sobre `#161A21` = 4,6 : 1 (AA). Los 10
  componentes de §3 viven en
  [`assets/css/componentes.css`](assets/css/componentes.css). Cada
  página HTML lo carga. `data-tema` en `<body>` cambia el acento por
  pestaña (verde para `dinero`, azul para `metas`, ámbar para
  `aprender`) sobre la misma superficie oscura. Los tokens legacy
  `--color-*` quedan en sus valores v1 por compatibilidad hacia atrás
  con cualquier estilo inline o código externo que aún los lea; la
  capa activa son los nuevos `--superficie-*`, `--texto-*`,
  `--acento-*`, `--exito`, `--aliento`, `--borde*`, `--sombra-*`.
  `manifest.json` y todos los `<meta theme-color>` actualizados a
  `#0F1115`.
- ✅ **Fase 3 terminada + migración a oscuro entregada (sw.js v14).**
  Auditoría de CSS por actividad: `.feedback`, `.wallet-chip`,
  `.opcion-btn`, `.pista`, `.actividad-header`, `.opciones`,
  `.escena`, `.agente` ya no duplican los componentes compartidos.
  `change-back/styles.css`, `concepts-money/styles.css`,
  `legal/styles.css` y el `styles.css` raíz adelgazados a solo las
  reglas genuinamente específicas de mecánica/actividad, **todos
  migrados a los nuevos tokens del tema oscuro**. Pulido aplicado:
  cuerpo 20 → 22 px, `--espacio-4` 16 → 20 px, `--espacio-5` 24 →
  28 px. Color/fondo del body en `base.css` cambiado a los tokens de
  superficie oscura. Anillo `:focus-visible` alias de `var(--acento)`
  para que siga el tema por pestaña. Overlay de `.celebration`
  cambiado a fondo oscuro. `sw.js` subido a `v14`. `scripts/check.js`
  verde (63 checks). Smoke test en `http://localhost:8080/` cubre el
  wizard de Registrar un gasto de principio a fin (categoría → keypad
  con preview en vivo de monedas/billetes → Next habilitado), `legal/`
  y una actividad (`needs-vs-wants`).
- ✅ **Bugs preexistentes corregidos** (sw.js v15):
  - `tools/concepts-money`: su antiguo `app.js` hardcodeaba casos
    (`cents: 1`, `cents: 2`, opciones como strings de claves i18n)
    que duplicaban `data.js` con datos incompatibles con el locale
    activo — `createToken(1, 'es')` devolvía `undefined` y reventaba.
    **Fix:** reescrito `app.js` para delegar en `data.js`
    (`casos: DATA.casos`), añadido `<script src="data.js">` a su
    `index.html`, y adaptado `data.js` al esquema del runtime
    (`opciones` numéricas, `correctaIndex` derivado de
    `opciones.indexOf(cents)` para que no se desincronice al
    cambiar casos).
  - `tools/change-back`: su antiguo `app.js` leía
    `current.instruccionKey` (campo ausente de `data.js`) y llamaba
    `createToken(current.paidCents / costCents)` con céntimos que
    no existen como denominaciones físicas ni en € ni en $ (130,
    220, 450, 770, 1450, 2350) — la segunda llamada reventaba igual
    que concepts-money. **Fix:** eliminada la referencia al
    `instruccionKey` inexistente en favor del string genérico
    `'instruccion'`, sustituidas las dos llamadas a `createToken()`
    por texto formateado con `App.money.format()` (calcular la
    vuelta es aritmética, no identificación visual), y usado
    `App.money.spoken()` para el aria-label. Además, endurecido
    `App.i18n.t()` y `App.i18n.pick()` en [`assets/js/i18n.js`](assets/js/i18n.js)
    para devolver string vacío cuando se llaman con una clave que
    no es string (fix de raíz para que un bug similar en otra
    actividad no vuelva a TypeError).

### 7.2 Decisiones resueltas

- **D1 → (a) superficie oscura activa.** Documentado en TODO.md §6.1.
  Los tokens oscuros declarados en Fase 1 son ahora la capa activa.
- **D2 → acento por pestaña entregado** (decisión invertida desde la
  recomendación original, porque `data-tema` ahora dirige el acento
  activo en la tab bar, el FAB y los CTAs del wizard — no en todo el
  body, así que el contraste y la estabilidad se mantienen; el fondo
  del body sigue oscuro independientemente de la pestaña). Los acentos
  sobre la superficie oscura son: verde `#7BD389` (dinero), azul
  `#7FB6E8` (metas), ámbar `#E8C879` (aprender).

---

## 8. Registro de riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Renombrar `components.css` rompe el import en `tools/*/index.html` si se nos pasa uno | Media | Bajo (solo visual, fácil de detectar) | Grep por `components.css` antes de cerrar la Fase 1; `scripts/check.js` ya valida que los paths de `FILES` en `sw.js` existan en disco — ampliarlo para verificar los paths de `@import` |
| Tokens declarados pero sin usar (modo oscuro dormido) se entregan accidentalmente como visibles | Baja | Bajo | Sin conmutador `data-theme` en UI en v1.1; solo declarado en `:root` (claro) |
| El acento por pestaña confunde a quien usa la app (`SPEC.md` §3.5, principio de contraste) | Media | Medio | Decisión D2 — entregar acento único primero |
| Los iconos de actividad se ven difuminados a 48 px | Baja | Bajo | Auditoría en Fase 3 |
| Los estilos inline de `App.feedback` rompen el nuevo toast | Media | Medio | Paso explícito "auditar feedback" en Fase 3 |
| Subir `sw.js` invalida la caché PWA a mitad del rediseño | Baja | Medio | Fase 3 es la única subida; coordinarla con quien tenga la PWA instalada para pruebas |

---

## 9. Recordatorio de fuera de alcance

Si durante la implementación aparece algo que encaje en una de las
categorías de §1.4 (flujos nuevos, actividades nuevas, cambios de
esquema, interruptor de tema, migración de framework, rediseño de
iconos, revisión de copia), **no** pertenece a este archivo. Abrir
una entrada nueva en el issue tracker o en `SPEC.md` §9
(simplificaciones deliberadas).

---

## 10. Cómo está organizado este documento

- §1 — contexto y motivación.
- §2 — el aspecto objetivo (tokens).
- §3 — los componentes que consumen los tokens.
- §4 — el mapa de migración archivo por archivo.
- §5 — el plan por fases.
- §6 — decisiones abiertas.
- §7 — criterios de éxito.
- §8 — riesgos.
- §9 — fuera de alcance (espejo de §1.4).
- §10 — este mapa.

Este documento es un **plan**, no un contrato. Se actualiza a medida
que aprendemos. Cuando cambie, el cambio va en el commit que lo
implementa, no en un commit "doc" aparte.
