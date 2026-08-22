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

Hoy existen cuatro tipos de asistente, todos construidos sobre el mismo
componente reutilizable de entrada de importe (`renderAmountStep`,
SPEC.md §6):

| `wizard.type` | Pasos | Desde dónde se abre |
|---|---|---|
| `expense` | categoría → importe → confirmar | El botón "+", desde cualquier pestaña |
| `setBalance` | solo importe | Tocar el saldo en Mi dinero |
| `goalNew` | icono+nombre → importe objetivo | "+ Nueva meta" en Mis metas |
| `goalAdd` | solo importe | "+ Añadir dinero" en una tarjeta de meta |

---

## 3. Esquema de datos

Todo vive bajo una única clave de `localStorage`, `okeymoney:data` (se
lee con `App.storage.get('data')` / `set('data', …)`), más dos claves
pequeñas que siguen la convención de las apps hermanas: `okeymoney:locale`
(idioma activo) y `okeymoney:prefs` (reservada para ajustes futuros —
tamaño de texto, sonidos — todavía no expuestos en la interfaz, ver
SPEC.md §8).

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
  // - suma(gastos) - suma(ahorros). No existe el tipo de movimiento
  // "ingreso" en la interfaz de la v1 (ver SPEC.md §8), pero el esquema
  // ya lo admite para cuando se construya ese flujo.
  "movements": [
    {
      "id": "m3k2j1abc",          // App.utils.uid()
      "type": "expense",          // 'expense' | 'income' | 'saving'
      "categoryId": "food",       // solo si type === 'expense'
                                   // — una de DATA.categories en data.js
      "goalId": null,             // solo si type === 'saving'
                                   // — id de la meta en `goals` de abajo
      "amountCents": 350,         // siempre positivo; `type` da el signo
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
  ]
}
```

```jsonc
// localStorage['okeymoney:locale']
"es"   // o "en" — cadena simple, no envuelta en JSON más allá de las comillas

// localStorage['okeymoney:prefs']  (reservada, la interfaz todavía no la escribe)
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

### 10.3 Catálogo de actividades

Siete actividades viven bajo `tools/<slug>/`. Cada una es una carpeta
independiente con `index.html`, `app.js`, `strings.es.js`,
`strings.en.js`, más `data.js` y `styles.css` opcionales. Todas
reutilizan el bucle socrático compartido de
`assets/js/activity-runtime.js` (`App.activity.run(opts)`);
`change-back` es la única que usa una mecánica propia con teclado
numérico.

Según [`PRODUCT-DESIGN.md`](PRODUCT-DESIGN.md), el catálogo se pinta en
la **página de inicio** (debajo de las tarjetas Mi dinero y Mis metas)
y, de forma redundante, en la pestaña Aprender — las dos llaman a la
misma `renderActivityThemes(container)` de `app.js`. Las actividades se
agrupan en **tres secciones temáticas** (`DATA.learnThemes` en
`data.js`, una `<section class="learn-theme">` por tema), al estilo
Apptonomia: cada sección fija `--acento`/`--acento-suave` localmente a
uno de los tokens de acento por pestaña (`--acento` verde / `--acento-2`
azul / `--acento-3` ámbar, de `assets/css/tokens.css`), de modo que el
componente `.activity-card` existente cambia de color por tema sin
lógica extra por tarjeta — esta sustitución es necesaria porque las
tres secciones se pintan juntas en la página de inicio, así que ninguna
pestaña está "activa". Las secciones se pintan en un orden pedagógico
fijo: `concepts` (conceptos básicos) → `daily` (vida cotidiana) →
`safety` (seguridad).

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
