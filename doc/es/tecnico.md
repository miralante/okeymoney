# Información técnica

> Documentación para quien quiera entender, mantener o ampliar Okeymoney.
>
> | Documento | Qué contiene | Cuándo leerlo |
> |---|---|---|
> | `CLAUDE.md` | Flujo operativo para agentes de IA | Solo cuando un agente de IA hace el cambio |
> | `doc/<en\|es>/tecnico.md` (este) | Arquitectura, esquema de datos, APIs, recetas | Al desarrollar o modificar la app || `doc/<en\|es>/I18N.md` | Arquitectura multiidioma + receta para añadir un idioma | Al añadir un idioma o tocar el sistema i18n |> | `doc/<en\|es>/SPEC.md` | Producto, público, principios innegociables | Antes de cualquier cambio de producto o interfaz |
> | Historial del proyecto | Vive en Git (`git log`); no se mantiene una hoja de ruta externa | Para entender por qué algo es como es |
> | `README.md` | Introducción breve, cómo ejecutar y desplegar | Primer contacto con el repositorio |

## 1. Por qué este stack (y no Flutter / React Native + Firebase)

La respuesta obvia a "app multiplataforma" sería Flutter o React Native
con un backend Firebase/Supabase. Okeymoney deliberadamente **no** usa
ese stack, por razones específicas de este producto y coherentes con sus
tres apps hermanas (Apptonomia, Calculia, Teclatlon):

- **El dispositivo real del público objetivo es un navegador**, a menudo
  en una tableta o teléfono compartido o antiguo, a veces sin cuenta
  propia de tienda de apps. Una URL que funciona al instante, se instala
  como PWA si se quiere y no necesita cuenta, encaja mejor con esa
  realidad que un binario de tienda de apps atado a una identidad con
  sesión iniciada.
- **El principio de privacidad (§3.3 de SPEC.md) descarta un backend por
  diseño.** No hay datos de usuario que proteger en un servidor si no hay
  servidor: Firebase/Supabase implicaría gestionar autenticación, una
  base de datos y una política de privacidad para unos datos que, en este
  producto, no tienen ningún motivo para salir nunca del dispositivo
  (ver §3 más abajo — todo el libro de movimientos son unos pocos
  kilobytes de JSON, por persona, en su propio teléfono).
- **Alojamiento a coste y mantenimiento cero.** Un sitio estático en
  Cloudflare Pages no tiene servidor que parchear, escalar ni pagar, ni
  una cadena de dependencias que mantener actualizada (no hay ni un
  `npm install` — ver §1.1). Una app Flutter/RN necesitaría cuentas de
  tienda, ciclos de revisión y una canalización de CI por plataforma para
  un producto sin lógica de backend que lo justifique.
- **Coherencia con la familia de apps que esta persona (o su familia) ya
  pueda usar.** Reutilizar `assets/js/*` (i18n, almacenamiento,
  refuerzo positivo, las monedas visuales) y los mismos tokens de diseño
  accesibles hace que Okeymoney se vea, suene y se comporte como
  Apptonomia/Calculia/Teclatlon desde la primera pantalla — una cosa
  menos que (re)aprender.
- **El funcionamiento sin conexión sale gratis con este stack.** Un
  service worker más archivos estáticos da uso completo sin conexión sin
  escribir lógica de sincronización — importante para una app de dinero
  que alguien puede abrir sin conectividad fiable.

Flutter/RN + Firebase sería la elección correcta para un producto que
necesite sincronización entre varios dispositivos, notificaciones push o
lógica en servidor (por ejemplo, un panel para un profesional que lea a
distancia los datos de una persona). Okeymoney explícitamente **no** es
ese producto: es una persona, un dispositivo, sus propios números, que
nunca se transmiten a ningún sitio. Si una versión futura necesita
sincronización entre dispositivos (por ejemplo, una vista de solo lectura
para un familiar), esa es una ampliación deliberada y con su propio
alcance — no un motivo para cambiar la base de hoy.

### 1.1 Restricciones técnicas innegociables

- **HTML5 + CSS3 + JavaScript sin frameworks.** Sin frameworks, sin
  empaquetadores, sin paso de compilación, sin backend, sin ninguna
  dependencia npm. No hay `package.json` en el repositorio, así que
  Cloudflare Pages no ejecuta `npm install` durante el despliegue y no
  hay nada que empaquetar.
- **Scripts clásicos**, no módulos ES (compatibilidad con `file://` y
  navegadores antiguos). Todo el código compartido se expone en
  `window.App.*`.
- **Sin CDN de JS.** Las fuentes (Atkinson Hyperlegible, Nunito) son
  archivos `.woff2` alojados localmente en `assets/fonts/`, cacheados por
  el service worker, para que la app funcione totalmente sin conexión
  (una petición externa a Google Fonts no lo haría).
- **Persistencia solo en `localStorage`.** Sin inicio de sesión, sin
  cookies, sin datos personales, sin analítica.
- **PWA con soporte sin conexión**: `manifest.json` + `sw.js` (caché
  "cache-first" del cascarón de la app).
- **Estilo de código**: JS al estilo ES5 (`var`, funciones clásicas, IIFE
  con `'use strict'`); identificadores, comentarios y mensajes de commit
  en inglés. El propio texto de la interfaz (`strings.es.js`,
  `strings.en.js`, las etiquetas de `data.js`) se mantiene en el idioma
  que representa.

### 1.2 Alojamiento y despliegue — Cloudflare Pages

Misma configuración que las apps hermanas: **Cloudflare Pages** mediante
el conector de Git, sin paso de compilación (la raíz del repositorio es
el resultado del despliegue), política de caché en `_headers` (HTML/
`sw.js`/`manifest.json` con revalidación obligatoria, el resto de
recursos JS/CSS/fuentes cacheados un año). `manifest.json` y `sw.js`
usan rutas relativas para que la app funcione en cualquier alojamiento
sin cambios. Un despliegue de previsualización puntual sin hacer push:
`npx wrangler pages deploy . --project-name okeymoney`.

### 1.3 Compatibilidad entre navegadores — Safari como objetivo de primera clase

Misma razón que en las apps hermanas: el dispositivo principal del
público suele ser un iPhone/iPad. Mantenerse en scripts clásicos y
código al estilo ES5 (sin módulos, sin `import`/`export`, sin funciones
flecha, sin `let`/`const` de nivel superior en el código de la app),
registrar el service worker desde cada punto de entrada (`index.html` y
`legal/index.html`), y evitar APIs web modernas sin comprobar antes su
disponibilidad.

---

## 2. Arquitectura — una sola app, no un catálogo de actividades

Apptonomia y Calculia son **catálogos de actividades independientes**:
cada `tools/<slug>/` está aislada y nunca lee el almacenamiento de otra
actividad. Okeymoney es arquitectónicamente distinta a propósito: **Mi
dinero**, **Mis metas** y **Registrar un gasto** leen y escriben el
*mismo* libro de movimientos, porque un saldo coherente es todo el
sentido del producto (gastar debe reducir visiblemente lo que se muestra
como disponible; ahorrar debe apartar visiblemente ese dinero).
Construirlo como "actividades" aisladas, como las apps hermanas, rompería
esa coherencia. Por eso Okeymoney se modela como **Teclatlon** en su
lugar: una sola app de propósito único, no un catálogo — `index.html`
**es** la app, `app.js` es un único IIFE que contiene cada pantalla como
una máquina de estados interna, y no existe la separación `site/` +
`tools/`.

```
okeymoney/
├── index.html          # La app en sí: 3 pantallas de pestaña + 1 de asistente
├── app.js              # Toda la lógica: estado, pestañas y cada flujo
├── data.js             # Datos neutros de idioma: categorías, iconos de metas
├── strings.es.js        # Textos en español (idioma por defecto, fuente de verdad)
├── strings.en.js        # Textos en inglés (mismas claves, comprobado por CI)
├── styles.css           # Solo estilos propios de la app (< 150 líneas)
├── assets/              # NÚCLEO COMPARTIDO (ver §4)
│   ├── css/tokens.css   #   variables de diseño (colores, tipografía, tacto)
│   ├── css/base.css     #   reset, fuentes, foco visible, reduced-motion
│   ├── css/components.css # componentes reutilizables (.btn, .card, barra de pestañas…)
│   ├── js/utils.js      #   window.App.utils
│   ├── js/i18n.js       #   window.App.i18n
│   ├── js/tts.js        #   window.App.tts (todavía no conectado a la interfaz)
│   ├── js/storage.js    #   window.App.storage
│   ├── js/feedback.js   #   window.App.feedback
│   ├── js/money.js      #   window.App.money (monedas y billetes)
│   ├── fonts/           #   woff2 alojados localmente (Atkinson Hyperlegible, Nunito)
│   └── img/icono.svg    #   icono de la app
├── legal/index.html     # Página de protección de datos (enlazada desde cada pantalla)
├── manifest.json        # PWA
├── sw.js                # Service worker: lista de caché + VERSION (§7)
└── _headers             # Cabeceras de caché y seguridad de Cloudflare Pages
```

### 2.1 Pantallas (nivel 0 — pestañas)

`app.js` mantiene un `currentTab` en `{'home', 'goals', 'learn'}`, que
activa o desactiva la clase `.hidden` en la `<section id="screen-*">`
correspondiente. La barra de pestañas (`.tabbar`, fija abajo) es la única
navegación: tres `.tab-button` más un `.fab-button` central que siempre
abre "Registrar un gasto", sin importar qué pestaña esté activa.

### 2.2 Asistentes (nivel 1 — flujos paso a paso)

Una única variable `wizard` (`null` cuando no hay ningún asistente
abierto) guarda `{ type, step, ...campos-en-curso }`. `openWizard()`
oculta todas las pantallas de pestaña y muestra `#screen-wizard`;
`renderWizard()` despacha según `wizard.type` a la función que dibuja el
paso actual. Cada función de paso vuelve a generar el `innerHTML` de
`#screen-wizard` desde cero — más simple de razonar que un parcheado
incremental del DOM, y suficientemente barato a esta escala (un puñado
de botones y un campo por paso).

Hoy existen varios tipos de asistente, todos construidos sobre el mismo
componente reutilizable de entrada de importe (`renderAmountStep`,
SPEC.md §6):

| `wizard.type` | Pasos | Desde dónde se abre |
|---|---|---|
| `expense` | categoría → importe → confirmar | El botón "+", desde cualquier pestaña |
| `setBalance` | solo importe | Tocar el saldo en Mi dinero |
| `goalNew` | icono+nombre → importe objetivo | "+ Nueva meta" en Mis metas |
| `goalAdd` | solo importe | "+ Añadir dinero" en una tarjeta de meta |
| `income` | origen → importe | Tarjeta "Recibir dinero" |
| `commitment` | nombre → importe | Tarjeta "Pagos previstos" |
| `settings` | preferencias y datos | Enlace "Ajustes y datos" |

---

## 3. Esquema de datos

Todo vive bajo una única clave de `localStorage`, `okeymoney:data` (se
lee con `App.storage.get('data')` / `set('data', …)`), más dos claves
pequeñas que siguen la convención de las apps hermanas: `okeymoney:locale`
(idioma activo) y `okeymoney:prefs` (preferencias locales, incluido el
tamaño de texto).

**Todos los importes son céntimos enteros.** Nunca euros en coma
flotante — `0.1 + 0.2` no es `0.3` en IEEE 754, y una app de dinero no
puede permitirse ese tipo de error. `App.money.format(350)` muestra
`"3,50 €"` / `"3.50 €"`.

```jsonc
// localStorage['okeymoney:data']
{
  "version": 1,

  // El punto de partida del libro de movimientos. No es "dinero ganado
  // alguna vez": setBalanceTo() lo recalcula cada vez que la persona
  // recuenta su dinero en Mi dinero, así el historial pasado queda
  // intacto mientras el saldo *actual* siempre coincide con lo que
  // acaba de decir.
  "initialBalanceCents": 2000,

  // Cada gasto y cada aportación a una meta, en el orden en que se
  // escribieron. balanceCents() = initialBalanceCents + suma(ingresos)
  // - suma(gastos) - suma(ahorros). Los ingresos se registran desde el
  // flujo Recibir dinero y llevan sourceId (bolsillo, trabajo, regalo o devolución).
  "movements": [
    {
      "id": "m3k2j1abc",          // App.utils.uid()
      "type": "expense",          // 'expense' | 'income' | 'saving'
      "categoryId": "food",       // solo si type === 'expense'
                                   // — una de DATA.categories en data.js
      "sourceId": null,            // solo si type === 'income'
                                   // — una de DATA.incomeSources
      "goalId": null,             // solo si type === 'saving'
                                   // — id de la meta en `goals` de abajo
      "amountCents": 350,         // siempre positivo; `type` da el signo
      "documentCycle": null,      // opcional: pedido-albarán-factura-pago
      "date": "2026-08-01"        // App.utils.today(), local YYYY-MM-DD
    }
  ],

  // Metas de ahorro ("Mi hucha"). No se borran nunca automáticamente,
  // ni siquiera al conseguirlas — la persona decide si quiere borrar
  // alguna y cuándo (todavía no hay interfaz para borrar en la v1; ver
  // SPEC.md §8).
  "goals": [
    {
      "id": "g8f7e6xyz",
      "name": "Un juego",         // texto libre, escrito por la persona
      "icon": "🎮",                // uno de DATA.goalIcons en data.js
      "targetCents": 3000,
      "savedCents": 500,           // suma de movimientos 'saving' con este goalId
      "createdDate": "2026-07-20",
      "achieved": false            // true en cuanto savedCents >= targetCents
    }
  ],

  // Los pagos previstos son solo recordatorios. Nunca cambian balanceCents.
  "commitments": [
    { "id": "p1", "name": "Teléfono", "amountCents": 1500, "dueDate": "2026-09-01", "createdDate": "2026-08-25" }
  ],

  // Progreso local del ciclo presupuestar → ingresar → ahorrar → gastar.
  "cycle": {
    "budgeted": true,
    "lastPlan": { "budgetCents": 3000, "itemId": "bread", "priceCents": 200, "date": "2026-08-25" }
  }
}
```

```jsonc
// localStorage['okeymoney:locale']
"es"   // o "en" — cadena simple, no envuelta en JSON más allá de las comillas

// localStorage['okeymoney:prefs']  (preferencias elegidas en Ajustes y datos)
{ "textSize": "normal", "sounds": true }
```

### 3.1 Por qué un único objeto compartido en vez de una clave por pantalla

El contrato de `storage.js` de las apps hermanas (`get(toolId)`/
`set(toolId, data)`) se diseñó para actividades **aisladas** que nunca
comparten estado. Okeymoney reutiliza exactamente la misma API `get`/
`set`/`remove` (ver §4.4) pero la llama con una única clave fija,
`'data'`, que contiene todo el libro de movimientos — porque Mi dinero,
Mis metas y Registrar un gasto son vistas sobre los *mismos* hechos, no
seguimientos de progreso independientes. Separar `movements` y `goals`
en claves distintas solo añadiría un problema de sincronización (por
ejemplo, "¿se actualizó el `savedCents` de esta meta antes o después de
guardar el movimiento correspondiente?") sin ningún beneficio, ya que
nada aquí necesita cargarse de forma independiente.

### 3.2 Categorías e iconos de metas (`data.js`)

Neutros de idioma: un id y un emoji por entrada, con un máximo de 6
(regla de accesibilidad: 4-6 opciones por pantalla). Los nombres visibles
viven en `strings.<locale>.js` bajo `categories.<id>`, resueltos con
`App.i18n.t('categories.' + id)`. Añadir una categoría es una línea en
`data.js` más una clave en cada `strings.<locale>.js` — comprobado por
`scripts/check.js` para que haya paridad es/en.

---

## 4. API del núcleo compartido (referencia)

### 4.1 `window.App.utils` (`utils.js`)

| Función | Firma | Descripción |
|---|---|---|
| `$` / `$$` | `(selector, [root]) → Element / Element[]` | Atajos de `querySelector` / `querySelectorAll` |
| `today` | `() → 'YYYY-MM-DD'` | Fecha local de hoy, usada para fechar los movimientos |
| `reducedMotion` | `() → boolean` | true si el sistema pide menos animación |
| `uid` | `() → string` | Id corto y único para movimientos/metas (no criptográfico — solo registros locales) |

### 4.2 `window.App.i18n` (`i18n.js`)

Sistema ES/EN, con la misma forma que las apps hermanas. Idioma activo:
`localStorage['okeymoney:locale']`, o detectado desde `navigator.language`.
`t(key)` busca una clave con puntos (`'categories.food'`), recurriendo al
español y después a la propia clave literal. `apply([root])` pinta cada
nodo `[data-i18n]`/`[data-i18n-aria]` bajo `root` (por defecto,
`document`). Cada `strings.<locale>.js` llama a
`App.i18n.register(dict, 'es'|'en')`; `scripts/check.js` hace fallar la
compilación si las claves de los dos archivos no coinciden.

### 4.3 `window.App.money` (`money.js`)

El sistema visual del euro (principio 5 de SPEC.md). Los importes son
siempre céntimos enteros.

| Miembro | Descripción |
|---|---|
| `CATALOG` | Denominaciones de 5 céntimos a 50 euros |
| `format(cents)` | Importe con formato localizado (`"1,50 €"` / `"1.50 €"`) |
| `spoken(cents)` | Importe en palabras, para futuras explicaciones/TTS |
| `breakdown(cents)` | Descompone un importe en monedas/billetes, de mayor a menor (voraz) |
| `createToken(cents)` | Crea un `<span>` decorativo de moneda/billete con ARIA |
| `paintTokens(container, pieces)` | Dibuja los tokens de una descomposición dentro de `container` |
| `formatPractice(cents)` | Importe de práctica localizado (`"2,50 🔑"` / `"2.50 🔑"`); usa la clave `practice.symbol` registrada en `App.i18n` (por defecto `🔑`) |
| `spokenPractice(cents)` | Importe de práctica en palabras, para futuras TTS ("2 okeys y 50 subokeys") |

Las claves `practice.*` (`name`, `plural`, `sub`, `symbol`) se
registran en `App.i18n` dentro de `money.js` para los dos locales y
son comprobadas por `scripts/check.js`. Ver §10 para el monedero de
práctica que usa estos formateadores.

### 4.4 `window.App.storage` (`storage.js`)

Prefijo interno de clave: `okeymoney:<key>`. Todas las funciones toleran
fallos (navegación privada, almacenamiento lleno): ninguna lanza
excepciones.

| Función | Firma | Descripción |
|---|---|---|
| `get` | `(key) → object` | Valor guardado, o `{}` si no hay nada / hay error |
| `set` | `(key, data) → boolean` | Guarda JSON; `false` si falló |
| `remove` | `(key) → boolean` | Borra una clave |
| `clearAll` | `() → boolean` | Borra todas las claves `okeymoney:*` (reinicio completo) |
| `dump` | `() → object` | Devuelve una copia portable de las claves locales |
| `restore` | `(snapshot) → boolean` | Sustituye las claves locales por una copia validada |

### 4.5 `window.App.feedback` (`feedback.js`)

| Función | Firma | Descripción |
|---|---|---|
| `success([zone])` | | Mensaje positivo al azar + sonido suave; escribe en una zona `aria-live` si se le pasa |
| `encourage([zone])` | | Mensaje de ánimo tras un error (nunca punitivo) |
| `celebrate(message, [after])` | | Celebración a pantalla completa ≤ 1,8 s (más corta con reduced motion); se usa al guardar un gasto, crear una meta o conseguirla |
| `lockUntilAck(buttons, zone, [onConfirm])` | | Patrón de pausa de lectura, guardado para los futuros cuestionarios de Aprender; sin usar en los flujos numéricos de la v1 |

### 4.6 `window.App.tts` (`tts.js`)

Trasladado desde las apps hermanas por coherencia y para uso futuro (por
ejemplo, leer en voz alta una pantalla de confirmación). Todavía no está
conectado a ninguna pantalla de Okeymoney — los flujos de la v1 son lo
bastante cortos como para no necesitarlo, según la regla 4 de SPEC.md
("audio solo donde el diseño de la actividad lo pida").

---

## 5. Internacionalización

Referencia completa: [`doc/es/I18N.md`](I18N.md) (y su espejo
[`doc/en/I18N.md`](../en/I18N.md)). La versión corta: un archivo por
idioma (`strings.es.js` / `strings.en.js`), ambos cargados de forma
síncrona (sin `document.write`, así `App.i18n.register` siempre corre antes
de que `data.js`/`app.js` lean texto). `es` es el idioma por defecto y la
fuente de verdad. `scripts/check.js` falla si dos `strings.<locale>.js`
del mismo scope (raíz, `legal/`) tienen conjuntos de claves distintos.
Añadir un texto UI: añadir la clave en **todos** los `strings.<locale>.js`
con la misma forma; añadir un idioma soportado: seguir la receta de 9
pasos en `I18N.md` §5 (ampliar `SUPPORTED`, `BCP47`, `LABEL`, `FLAG` en
`i18n.js`, el bloque `core`/`feedback`, `DECIMAL_SEP` en `money.js`, el
nuevo `strings.<locale>.js`, el `FILES` de `sw.js`, y la lista de
`<script>`).

---

## 6. El componente de entrada de importe, en términos de código

`renderAmountStep(opts)` en `app.js` es la implementación literal del
paso 2 del §6 de SPEC.md, extraída para que `expense` (paso 2),
`setBalance`, `goalNew` (paso 2) y `goalAdd` la llamen con distintos
textos y un `onConfirm` distinto:

```js
renderAmountStep({
  titleKey: 'expense.amountTitle',        // clave i18n para el <h2>
  instructionKey: 'expense.amountInstruction',
  initial: wizard.amountCents,            // recupera el valor si se vuelve atrás
  totalSteps: 3, step: 2,                 // para el indicador de puntos de paso
  allowZero: false,                        // 0 € es un saldo válido, no un gasto válido
  onBack: function () { /* vuelve a dibujar el paso anterior */ },
  onConfirm: function (cents) { /* lo guarda, avanza o termina */ }
});
```

Es responsable de: la pantalla con el importe formateado en vivo, la
vista previa de monedas/billetes (`App.money.breakdown` + `paintTokens`),
el teclado numérico de 12 teclas (dígitos, borrar el último, borrar
todo), y deshabilitar "Siguiente" mientras el importe es `0` y
`allowZero` es `false` — la forma socrática de bloquear una entrada no
válida sin mostrar nunca un mensaje de error.

---

## 7. PWA y service worker

- `sw.js` sigue la estrategia **cache-first** para el cascarón de la app.
  Contrato al tocar archivos: añadir los nuevos a `FILES`; subir
  `VERSION` (`okeymoney-vNN`) ante cualquier cambio en un archivo
  cacheado, o quien tenga la PWA instalada no verá el cambio.
- `manifest.json`: `display: standalone`, `start_url: ./index.html`.
- Registrar el service worker desde **cada** punto de entrada:
  `index.html` y `legal/index.html` llaman ambos a
  `navigator.serviceWorker.register(...)` con la ruta relativa correcta
  (§1.3).

---

## 8. Ejecución y verificación

```bash
# Servidor local (cualquiera de los dos sirve; sin paso de compilación)
python -m http.server 8080     # → http://localhost:8080/index.html
npx serve .

# Comprobación estructural y de i18n (no hace falta npm install — solo stdlib)
node scripts/check.js
```

`scripts/check.js` comprueba: que cada archivo `.js` sea válido, que
`strings.es.js` / `strings.en.js` tengan las mismas claves (app raíz y
`legal/`), que cada ruta de `FILES` en `sw.js` exista en disco, y que
cada icono de `manifest.json` exista. La CI
(`.github/workflows/validate.yml`) ejecuta el mismo comando en cada push
y pull request.

Todavía no automatizado (comprobación manual antes de publicar un
cambio): recorrer en un navegador real cada asistente (gasto, cambiar
saldo, meta nueva, añadir a una meta), comprobar que el botón "+"
flotante abre el asistente de gasto desde cualquier pestaña, y una pasada
por WebKit/Safari según el §1.3.

---

## 10. Monedero de práctica y persistencia de actividades

Okeymoney expone un **segundo libro de movimientos** para la moneda
de práctica ("Tokens" / "okey" 🔑), completamente independiente del
libro real en `okeymoney:data`. Los dos libros nunca se mezclan y no
hay conversión entre ellos: los créditos de práctica no afectan al
saldo en €, y viceversa.

### 10.1 `window.App.wallet` (`wallet.js`)

Un segundo libro, guardado bajo `localStorage['okeymoney:practiceWallet']`,
con céntimos enteros en okeys (1 eurocéntimo = 1 subokey).

| Función | Firma | Descripción |
|---|---|---|
| `balance()` | `() → number` | Saldo actual en céntimos de okey |
| `credit(cents, reason)` | `(number, string) → number` | Añade `cents` (positivo o negativo) y registra el motivo en `history` |
| `reset()` | `() → void` | Reinicia el monedero de práctica a 0 y borra el historial |
| `activityStatus(slug)` | `(string) → {done, completedAt, attempts} \| null` | Registro de finalización de una actividad, o null |
| `markActivityDone(slug, attempts)` | `(string, number) → void` | Marca una actividad como hecha (idempotente) |

`App.money.formatPractice()` y `App.money.spokenPractice()` (ver §4.3)
formatean el saldo. Ambas usan las claves `practice.*` registradas en
`App.i18n` (`name`, `plural`, `sub`, `symbol`) — la paridad es/en la
comprueba `scripts/check.js`.

### 10.2 Persistencia por actividad

Cada actividad usa una clave de `localStorage` por slug:

- `okeymoney:activity:<slug>` → `{ done: true, completedAt: 'YYYY-MM-DD', attempts: N }`

Completar una actividad por primera vez llama a
`App.wallet.credit(rewardCents, 'activity:<slug>')` **y**
`App.wallet.markActivityDone(slug, attempts)`. Las repeticiones no
vuelven a acreditar (la comprobación `activityStatus.done` es
idempotente), pero la actividad sigue disponible si la persona quiere
repetirla.

### 10.3 Actividades de test dentro de las unidades

Siete actividades viven bajo `tools/<slug>/`. Cada una es una carpeta
independiente con `index.html`, `app.js`, `strings.es.js`,
`strings.en.js`, más `data.js` y `styles.css` opcionales. Todas
reutilizan el bucle socrático compartido de
`assets/js/activity-runtime.js` (`App.activity.run(opts)`);
`change-back` es la única que usa una mecánica propia con teclado
numérico.

Según [`PRODUCT-DESIGN.md`](PRODUCT-DESIGN.md), cada unidad de la
**página de inicio** combina la explicación con una invitación integrada al
test correspondiente. `renderDidacticLessons()` construye esas unidades desde
`DATA.didacticLessons` + `DATA.learningIndex`, y
enlaza cada test disponible con su ruta real en `tools/<slug>/`.
La segunda parte de la home reúne la guía para actuar: reglas prácticas,
el ciclo financiero y las simulaciones en euros. Las unidades se ordenan
según `DATA.didacticLessons` y cada una enlaza con sus tests disponibles.

El catálogo, la recompensa de cada actividad y el vocabulario de
agentes están documentados en
[`actividades.md`](actividades.md) (catálogo de actividades).

### 10.4 Los tres agentes básicos

Cada caso nombra uno de los tres agentes — persona / empresa / banco —
declarado como `agente: 'persona' | 'empresa' | 'banco'` (opcional),
más una clave i18n opcional `agenteName`. El runtime pinta una
`agente__card` con el emoji del avatar (`👤` / `🏪` / `🏦`), la
etiqueta de rol desde `App.i18n.t('agent.<tipo>')` y el nombre
concreto del agente desde `agenteName`. Las actividades nuevas
reutilizan las mismas tres entradas del mapa `AGENTES` en
`activity-runtime.js`; no se inventan emojis ad-hoc.

### 10.5 Añadir una actividad nueva

1. Copiar `tools/concepts-money/` (la plantilla más simple) en
   `tools/<new-slug>/`. Si la actividad solo necesita `app.js` +
   `strings.*.js`, se pueden omitir `data.js` y `styles.css` — la
   mayoría reutilizan `assets/css/activities.css` y `activity-runtime.js`
   compartidos.
2. Añadir `agente` y `agenteName` a cada caso de `app.js` para que el
   runtime pinte la tarjeta del agente.
3. Añadir las claves en los dos `strings.<locale>.js` y comprobar con
   `scripts/check.js`.
4. Añadir el slug a `DATA.activities` en `data.js` (raíz) con
   `available: true` y un `theme` que coincida con uno de
   `DATA.learnThemes` (`concepts` / `daily` / `safety` — añadir una
   entrada de tema nueva ahí, con un `accent` que apunte a uno de los
   tokens `--acento*` en `assets/css/tokens.css`, solo si de verdad no
   encaja en ninguna sección existente) para que el catálogo de la
   página de inicio y la pestaña Aprender lo muestren en la sección
   correcta.
5. Añadir los archivos de la actividad a `sw.js` `FILES` y bumpear
   `VERSION`.

---

## 11. Licencia

MIT — ver [`LICENSE`](../../LICENSE).

## 12. Patrón de la suite — cómo se construye cada app de Miralante

> 🌐 **Other language:** [English](../en/technical.md#8-suite-pattern-how-every-app-of-miralante-is-built)

Esta sección es la **guía canónica y transversal** de cómo se
construye y mantiene cada app de la [suite Miralante](https://apptonomia.uk).
Es la fuente de verdad que prevalece sobre el `technical.md`
(tecnico.md) de cualquier repo cuando entran en conflicto,
porque el objetivo es mantener las siete apps hermanas
(Apptonomia, Calculia, Memofun, Okeymoney, Sinonimia, Teclatlon,
Routime) consistentes: misma forma, mismas convenciones,
mismo deploy, mismo i18n, mismo comportamiento offline.

Un cambio en esta sección es un **cambio transversal a la
suite** y debe aplicarse a todos los repos. Un cambio en
otras secciones de este archivo es específico del proyecto y
se queda ahí.

> **Fuente de verdad de las reglas de producto** en este
> repo: [`SPEC.md`](SPEC.md).
> **Fuente de verdad del i18n**: [`I18N.md`](I18N.md).
> Esta sección **no** redefine esas; codifica el patrón que
> todas comparten.

### 12.0 El patrón en un párrafo

Cada app de la suite Miralante es una **PWA estática, sin
dependencias y offline-first**, construida a partir del mismo
esqueleto mínimo:

1. Un conjunto pequeño de **páginas HTML standalone** en la
   raíz del repo (una sola actividad) o bajo `tools/<slug>/`
   (hubs multi-actividad).
2. Cada página es una **URL real y navegable** — **no hay
   routing SPA**, ni cambio de vista en la misma página, ni
   `pushState`. Cada página se recarga al entrar; la
   navegación entre páginas es un clic normal en un `<a>`.
3. Las rutas ocultas (`about/`, `team/`, `legal/`, `config/`)
   comparten la misma forma: `index.html` + `styles.css` + par
   `strings.<locale>.js`, con **interlinking en el pie** para
   que cualquiera de ellas esté a un clic de cualquier otra.
4. Un **service worker** (`sw.js`, network-first) cachea el
   shell (lista `FILES`, `VERSION` bumped) para que la app
   funcione offline.
5. **Sin paso de build**, sin `package.json`, sin frameworks,
   sin bundlers, sin CDNs de JS. La raíz del repo es el
   output de deploy.

### 12.1 La forma de las páginas standalone

Este es el patrón que siguen todas las rutas ocultas y todas
las rutas públicas. La forma es idéntica en la suite; solo
cambian los contenidos.

#### 12.1.1 El esqueleto de cinco carpetas

Cada app expone las mismas cinco carpetas:

```
<app>/
  index.html              # Entrada pública (la actividad)
  app.js                  # Lógica
  data.js                 # Layouts sin locale + contenido por locale
  strings.es.js           # Textos UI en español (fuente de verdad)
  strings.en.js           # Textos UI en inglés
  styles.css              # Estilos específicos de la app
  assets/
    css/{tokens,base,components}.css
    fonts/                # Atkinson Hyperlegible + Nunito autohospedados
    img/                  # Icono de la app + imágenes decorativas
    js/{utils,i18n,tts,storage,feedback}.js
  about/                  # Ruta oculta: presentación
    index.html
    styles.css
    strings.es.js
    strings.en.js
  team/                   # Ruta oculta: quiénes la hacen
    index.html
    styles.css
    strings.es.js
    strings.en.js
  legal/                  # Página de protección de datos (enlazada desde el pie)
    index.html
    styles.css
    strings.es.js
    strings.en.js
  config/                 # Ajustes (solo en apps que lo necesitan)
    index.html
    app.js
    styles.css
    strings.es.js
    strings.en.js
  manifest.json
  sw.js
  _headers
  404.html
  robots.txt
  sitemap.xml
```

Las apps de una sola actividad (Teclatlon, Okeymoney) ponen el
`index.html` en la raíz del repo. Las apps multi-actividad
(Apptonomia, Calculia) ponen `tools/<slug>/index.html` por
actividad y un landing `site/index.html`; las cuatro carpetas
ocultas viven en la raíz del repo.

#### 12.1.2 La concha HTML de una página standalone

Cada página standalone abre con el mismo boilerplate. Abajo,
la **plantilla**; las desviaciones se indican donde apliquen.

```html
<!DOCTYPE html>
<html lang="es" data-i18n-title="pageTitle">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Okeymoney — Sobre este proyecto</title>
  <!-- Hidden route: not linked from the main menu and should not be
       indexed. Aimed at anyone who wants to know what Teclatlon is:
       families, professionals, journalists, funders, contributors. -->
  <meta name="robots" content="noindex, nofollow">
  <meta name="description" content="…">
  <meta name="theme-color" content="#FAF7F2">
  <link rel="stylesheet" href="../assets/css/tokens.css">
  <link rel="stylesheet" href="../assets/css/base.css">
  <link rel="stylesheet" href="../assets/css/components.css">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container {legal|about}">
    <header class="cabecera-{legal|about}">
      <div class="idioma-selector" role="group" aria-label="Elegir idioma">
        <button type="button" class="btn-idioma" id="btnIdiomaEs"
                data-locale="es" aria-pressed="false">🇪🇸 Español</button>
        <button type="button" class="btn-idioma" id="btnIdiomaEn"
                data-locale="en" aria-pressed="false">🇬🇧 English</button>
      </div>
      <img src="../assets/img/icono.svg" alt="" width="80" height="80"
           class="logo-{legal|about}">
      <h1>…</h1>
      <p class="lema" data-i18n="tagline">…</p>
      <p class="entradilla" data-i18n="lead">…</p>
      <nav class="indice">…opcional, solo en páginas largas…</nav>
    </header>

    <main class="pila">
      <section class="card">…</section>
    </main>

    <footer class="pie-{legal|about}">
      <a class="btn btn-secundario" href="../"
         data-i18n="footerActivities">Ir a la aplicación</a>
      <a class="btn btn-secundario" href="../legal/"
         data-i18n="footerDataProtection">Protección de datos</a>
      <a class="btn btn-secundario" href="../about/"
         data-i18n="footerAbout">Sobre este proyecto</a>
      <a class="btn btn-secundario" href="../team/"
         data-i18n="footerTeamGuide">Quiénes la hacen</a>
      <a class="btn btn-secundario" href="../config/"
         data-i18n="footerSettings">Ajustes</a>
    </footer>
  </div>

  <script src="../assets/js/utils.js"></script>
  <script src="../assets/js/i18n.js"></script>
  <script src="strings.es.js"></script>
  <script src="strings.en.js"></script>
  <script>
    (function () {
      'use strict';
      function paintLanguageSelector() {
        var active = App.i18n.locale();
        document.getElementById('btnIdiomaEs')
          .setAttribute('aria-pressed', String(active === 'es'));
        document.getElementById('btnIdiomaEn')
          .setAttribute('aria-pressed', String(active === 'en'));
      }
      document.getElementById('btnIdiomaEs')
        .addEventListener('click', function () { App.i18n.setLocale('es'); });
      document.getElementById('btnIdiomaEn')
        .addEventListener('click', function () { App.i18n.setLocale('en'); });
      paintLanguageSelector();
    })();
  </script>
  <script>
    /* Register the SW from this entry point so it is active for any
       later navigation, matching what the main index.html and the
       other standalone pages already do. */
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('../sw.js').catch(function () {});
    }
  </script>
</body>
</html>
```

**Notas:**

- `data-i18n-title="pageTitle"` en `<html>` permite que
  `assets/js/i18n.js` rellene `document.title` durante
  `init()`. El `<title>` hardcoded es el fallback que la
  pestaña del navegador mostraría antes de que i18n.js se
  ejecute (y el fallback de la cache del SW).
- La clase propia de la página en el wrapper
  `<div class="container …">` es bajo la que `styles.css` de
  la página scopea sus reglas (`legal-page`, `about-page`,
  `team-page`). Sin prefijos ancestro `.sp-*` (eran residuo
  de la fusión SPA, retirado en 2026-09; ver `git log`).
- El pie es **siempre** los mismos cinco enlaces (en el mismo
  orden) en `about/`, `team/` y `legal/`. `config/` tiene un
  pie reducido que solo vuelve a la SPA. La raíz de la app
  (`index.html`) **no** renderiza este pie (tiene su propio
  pie con el botón de reset y el enlace a protección de datos
  — ver §2 arriba).

#### 12.1.3 El par de strings

Cada carpeta standalone trae su propio par `strings.es.js` /
`strings.en.js`. Siguen el patrón **clave plana,
IIFE-register**; `scripts/check.js` extrae el diccionario vía
`vm.createContext` con un stub `App.i18n.register` y verifica
la paridad de claves entre locales.

```javascript
/* legal/strings.es.js — texto de la página (ES). */
(function () {
  'use strict';
  App.i18n.register({
    pageTitle: 'Protección de datos',
    pageDescription: 'Teclatlon: qué datos guarda, dónde y por qué. …',
    routeNotice: 'Esta página no se enlaza desde la aplicación. …',
    tagline: 'Sin registro. Sin cookies. Sin analítica.',
    lead: 'Teclatlon no pide tus datos personales. …',
    navResponsible: 'Quién trata tus datos',
    navData: 'Qué guardamos',
    /* …más claves… */
    footerActivities: 'Ir a la aplicación',
    footerAbout: 'Sobre este proyecto',
    footerTeamGuide: 'Quiénes la hacen',
    footerSettings: 'Ajustes'
  }, 'es');
})();
```

Las claves son planas (sin namespacing tipo
`legal.pageTitle`); la página **es** el namespace, porque el
archivo vive en su propia carpeta. Las claves comunes
(`core.back`, `core.listen`, `core.dataProtection`) ya vienen
en `assets/js/i18n.js` y no se redefinen aquí.

#### 12.1.4 La hoja de estilos standalone

Cada carpeta standalone trae su propio `styles.css`. Es **el
antiguo `assets/css/subpages.css` dividido por página**, con
los prefijos ancestro `.sp-legal` / `.sp-about` eliminados
(eran residuo de la fusión SPA). La clase wrapper de la
página (`<div class="legal-page">`, `<div class="about-page">`,
etc.) es la que usa el CSS para scope:

```css
.legal-page { max-width: 880px; }
.legal-page .cabecera-legal { … }
.legal-page .indice a { … }
.legal-page section { … }
```

**No** introduzcas nombres de clase por página que colisionen
con los componentes compartidos (`base.css` ya define
`.cabecera`, `.lema`, `.indice`, `.btn`, `.card`, `.pila`, …).
Cuando la página standalone necesite un aspecto distinto,
scopea la regla bajo la clase de la página — nunca bajo un
`.cabecera` o `.indice` genérico.

### 12.2 El núcleo compartido

Cada app de la suite trae los mismos seis ficheros bajo
`assets/js/`, en el mismo orden de carga, con la misma forma
exportada. Adelgazar está permitido; **añadir** funcionalidad
de vuelta está prohibido a menos que sirva a una necesidad
concreta (las notas de adelgazamiento en §2.1 arriba son la
justificación canónica).

| Módulo | Superficie | Requerido por |
|---|---|---|
| `utils.js` | `App.utils.shuffle / $ / $$ / reducedMotion / wakeLock` | cada página |
| `i18n.js` | `App.i18n.{locale, setLocale, lang, register, t, pick, apply, SUPPORTED, DEFAULT_LOCALE, LABEL, FLAG}` | cada página |
| `tts.js` | `App.tts.speak` | solo páginas que leen en voz alta (la mayoría) |
| `storage.js` | `App.storage.{get, set, remove}` | solo páginas que leen o escriben `localStorage` (`index.html`, `config/`) |
| `feedback.js` | `App.feedback.{success, encourage, celebrate}` | solo el `app.js` de la actividad |

El orden de carga es `utils.js → i18n.js → tts.js → storage.js →
feedback.js → strings.<locale>.js → data.js → app.js`. `i18n.js`
debe cargar **antes** que `tts.js` y `feedback.js`, que leen
el idioma activo.

Tanto `strings.es.js` como `strings.en.js` cargan siempre (no
están gateados por `locale`); `App.i18n.locale()` decide cuál
está activo. El locale se elige primero de
`localStorage['teclatlon:locale']`, luego de `navigator.language`
(fallback `'es'`).

### 12.3 El contrato de la PWA

El service worker es **network-first, cache-fallback**,
declarado en `sw.js` y commiteado junto a `manifest.json`. El
contrato:

```javascript
var VERSION = 'teclatlon-vN';
var FILES = [
  './index.html',
  './404.html',
  './manifest.json',
  './app.js',
  './data.js',
  './strings.es.js',
  './strings.en.js',
  './styles.css',
  /* una entrada por fichero del shell, incluyendo cada
     index.html / styles.css / par strings.<locale>.js de las
     páginas standalone */
  './legal/index.html',
  './legal/styles.css',
  './legal/strings.es.js',
  './legal/strings.en.js',
  /* …about/, team/, config/ igual… */
  './assets/css/tokens.css',
  './assets/css/base.css',
  './assets/css/components.css',
  './assets/fonts/…woff2',
  './assets/js/utils.js',
  './assets/js/i18n.js',
  './assets/js/tts.js',
  './assets/js/storage.js',
  './assets/js/feedback.js',
  './assets/img/icono.svg'
];
```

Dos reglas gobiernan cambios en `FILES`:

1. **Fichero nuevo → añadirlo a `FILES`.** El handler
   `install` mete cada fichero individualmente (nunca
   `cache.addAll`, que aborta en el primer fallo y rompe la
   cache para todos).
2. **Cualquier cambio en un fichero cacheado → bumpear
   `VERSION`** (`'teclatlon-vN'` → `'teclatlon-vN+1'`). Sin el
   bump, un usuario offline queda atascado en la versión
   vieja para siempre, porque el handler `activate` solo
   purga caches con un nombre distinto.

`scripts/check-version-bump.js` aplica (2): hace
`git show HEAD:sw.js` para ver qué `VERSION` había en el
último commit, lo compara contra el `VERSION` actual, y
verifica que `FILES` y el diff contra HEAD coincidan. Si no
coinciden, el script falla y el job `cache-bump` de CI
también falla.

Cada página standalone también ejecuta
`navigator.serviceWorker.register('../sw.js')` desde su
script inline, así una visita directa a `/legal/`,
`/about/` o `/team/` prima el SW para la raíz de la SPA del
mismo modo que hace `index.html`.

### 12.4 Invariantes de i18n

Estas son no negociables en toda la suite. Un cambio de
locale está incompleto hasta que **todos** los ficheros de
esta lista estén actualizados:

1. `assets/js/i18n.js#SUPPORTED` y `#DEFAULT_LOCALE`.
2. `assets/js/i18n.js#BCP47` (para selección de voz en
   `speechSynthesis`).
3. El detector pre-paint en `index.html` (el `<script>`
   inline que elige el locale antes del primer paint — ver
   §2.5 arriba).
4. `strings.<locale>.js` y cada par `strings.<locale>.js`
   por carpeta (`legal/`, `about/`, `team/`, `config/`).
5. `data.js`: cada array dividido por locale
   (`DATA.lessons.<locale>`, `DATA.words.<locale>`,
   `DATA.templates.<locale>`, `DATA.numpadSteps.<locale>`).
6. `sw.js`: añadir los nuevos `strings.<locale>.js` a
   `FILES` y bumpear `VERSION`.
7. `scripts/check.js`: la verificación de paridad funciona
   en N locales sin cambios de código (los coge todos vía
   `fs.readdirSync`); confirmar que el script sigue pasando
   tras añadir el locale.

La receta paso a paso completa (con código de ejemplo) está
en [`I18N.md`](I18N.md).

### 12.5 Lo que está **prohibido** (en toda la suite)

Estos son antipatrones observados en algún momento y
retirados explícitamente; el historial de commits es la fuente
de verdad de cada retirada. La regla es: "si te ves tentado
de usar uno de estos, para y vuelve a leer esta sección".

- **Sin SPA / sin `pushState` / sin secciones `view-*`.**
  Cada página es su propia URL. No fusionar `legal/`,
  `about/`, `team/` dentro de `index.html` como secciones
  ocultas, ni siquiera con un redirect shim. Se intentó en
  2026-09 (`spa: merge`) y se revirtió en la misma release;
  ver `git log` para las lecciones aprendidas. La
  navegación entre páginas debe ser siempre un clic real en
  un `<a>`, y cada ruta oculta debe estar a un clic de
  cualquier otra vía el pie compartido.
- **Sin `App.goLegal` / `App.goAbout` / `view-legal` /
  `view-about` / `sp-legal` / `sp-about` / `sp-idioma` /
  `subpages.css`.** Todos pertenecen al modelo de fusión
  SPA retirado.
- **Sin `_redirects` SPA catch-all.** Cloudflare lo
  rechaza como loop; documentado en `CLOUDFLARE.md` y en
  la receta de deploy.
- **Sin flash de `data-app-blocked="mobile"`.** El script
  pre-paint es un único `<script>` inline en `<head>`; no
  lo dividas en un `.js` aparte (CSP `script-src 'self'`
  lo permitiría, pero la garantía de timing síncrono solo
  se cumple con scripts inline en la cabeza).
- **Sin `package.json`, sin `node_modules`.** El repo es
  el output de build. Un package manifest forzaría a
  Cloudflare a ejecutar `npm install` en cada build,
  sobrepasando el límite de 25 MiB de assets.
- **Sin CDNs de JS.** Todas las fuentes, iconos y JS
  vienen en `assets/`.
- **Sin imports de ES modules** (`<script type="module">`).
  La app debe funcionar desde `file://` para uso offline;
  los ES modules rompen eso.
- **Sin base de datos en tiempo real, sin login, sin
  cookies, sin analítica.** La persistencia es solo
  `localStorage`.
- **Sin teclado en pantalla táctil** en apps que apuntan
  al teclado físico del ordenador (Teclatlon, importes
  tipeados de Okeymoney, palabras tipeadas de Sinonimia).
  El teclado en pantalla es solo decorativo.

### 12.6 Checklist de validación

Ejecutar esto en cada PR que toque cualquiera de los
ficheros de superficie (`*.html`, `*.js`, `*.css`, `sw.js`,
`manifest.json`, `data.js`):

```bash
node scripts/check.js           # debe reportar OK (N checks, sin fallos)
node scripts/check-version-bump.js   # debe pasar
```

Después abrir las páginas afectadas en un navegador en
`http://localhost:<puerto>/<ruta>` y recorrer el smoke
manual:

- `index.html` arranca en la pantalla de nombre o en el menú
  según el estado guardado; el roundtrip de `localStorage`
  funciona; el botón "🗑️ Borrar mi progreso" resetea tanto
  los datos como la UI.
- `/legal/` carga con el h1, lema y pie localizados; el
  selector de idioma cambia `lang`, `document.title` y cada
  texto `data-i18n` sin parpadeo de valores antiguos.
- `/about/` y `/team/` igual; sus enlaces del pie navegan
  entre ellos y a `/legal/` y `/config/` sin recargas
  antes de que el SW se prime.
- `/config/` lista el estado guardado y sus dos botones de
  reset funcionan (confirmación en dos pasos).
- Refrescar una vez tras la primera carga y verificar que
  `navigator.serviceWorker.controller` no es null.

Si algo falla, el cambio no encaja con el patrón de la suite
y debe revisarse antes de aterrizarlo.

### 12.7 Diferencias entre repos (lo que esta sección **no** cubre)

Cada app es una variante de una sola actividad del patrón de
arriba. Las diferencias por app — qué se comparte con la
suite, qué se adelgaza, y qué es intencionalmente distinto —
se documentan en el `tecnico.md` § "Other apps of the suite:
real differences" (la "diferencia específica del proyecto")
de cada repo. Usa esa sección para decidir si una
desviación en un repo es intencional antes de copiarla a
otro.

Esta sección canónica vive en el `tecnico.md` /
`technical.md` de **todos los repos** de la suite, mantenida
en sincronía. Si la cambias en un repo, espejéala en los
demás en el mismo PR.

### 12.8 Ver también

- §2 arriba — Recetas y contratos específicos de Teclatlon
  que se construyen sobre este patrón.
- [`I18N.md`](I18N.md) — Cómo añadir un idioma manteniendo
  las invariantes de i18n intactas.
- [`CLOUDFLARE.md`](../../CLOUDFLARE.md) — Contratos de
  deploy y SW/headers a nivel de Cloudflare Workers.
- [`SPEC.md`](SPEC.md) §"Mandatory rule" — Las invariantes
  de accesibilidad y "ninguna mención clínica" que cada
  página debe respetar.

---


