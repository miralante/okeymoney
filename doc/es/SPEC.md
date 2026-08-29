# Especificación de producto

> Fuente canónica del alcance del producto, el público y las reglas
> innegociables. La arquitectura técnica y el esquema de datos viven en
> [`tecnico.md`](tecnico.md).

## 1. Qué es Okeymoney

Una aplicación web gratuita, estática y de propósito único que enseña
**finanzas personales y autonomía cotidiana con el dinero** a personas
con discapacidad intelectual o del desarrollo: saber cuánto dinero se
tiene, gastarlo de forma consciente, ahorrar para algo que se quiere
conseguir y, en una futura versión, practicar situaciones cotidianas con
dinero (como calcular la vuelta).

Okeymoney es un proyecto hermano de [Apptonomia](https://apptonomia.pages.dev),
[Calculia](../../../calculia) y [Teclatlon](../../../teclatlon): mismo
lenguaje de diseño centrado en accesibilidad (lectura fácil, sin presión,
alto contraste, botones grandes), misma arquitectura estática sin
servidor, aplicada a un dominio nuevo — el dinero, no las actividades
terapéuticas en general.

## 2. Público objetivo

Personas con discapacidad intelectual o del desarrollo que están
aprendiendo a manejar su propio dinero, y cualquier persona que se
beneficie de la lectura fácil, un ritmo sin presión y pantallas
predecibles y sin sobrecarga: niños, principiantes, personas mayores. Se
usa de forma **autónoma**, sin que un profesional o un familiar maneje el
dispositivo por la persona.

## 3. Restricciones innegociables (de producto)

Estas restricciones vienen del **producto**, no son técnicas. Son las
"leyes" que nunca se rompen, porque definen qué tipo de experiencia
ofrecemos. Okeymoney las comparte con [Apptonomia](../../../apptonomia),
[Calculia](../../../calculia) y [Teclatlon](../../../teclatlon), adaptadas
a su dominio (el dinero, no las actividades terapéuticas).

### 3.1 El error nunca castiga

- Ninguna entrada equivocada resta saldo, estrellas, progreso ni
  consecución de metas.
- Un fallo produce un mensaje de **ánimo** (`App.feedback.encourage`),
  nunca un "incorrecto" ni un saldo fantasma que reste de la pantalla.
- Se puede reintentar sin límite: borrar el último dígito o volver atrás
  un paso es la forma normal de corregir, no una "reacción al error".
- Antes de mostrar la respuesta se ofrece una pista cuando aplica (por
  ejemplo, desglosar el precio en monedas y billetes al teclear, §3.6).

### 3.2 Sin presión temporal

- **No hay cronómetros visibles** en la interfaz.
- No se mide el tiempo que tarda la persona (internamente puede, pero
  no se enseña).
- El ritmo lo marca la persona usuaria: puede tardar un segundo o diez
  minutos en escribir un precio sin que nada cambie.
- No hay "fin del juego", no hay cuenta atrás, no hay rachas que se
  pierdan.

### 3.3 Lectura Fácil siempre

La accesibilidad cognitiva es un principio rector: todo el contenido
sigue las pautas de **lectura fácil** y la norma **UNE 153101:2018 EX**
(estándar español de lectura fácil), alineada con las pautas europeas
de Inclusion Europe. La comprensión prevalece sobre la precisión
técnica expresada con dificultad.

- Frases cortas, una idea por pantalla.
- Vocabulario cotidiano (sin tecnicismos financieros ni clínicos).
- Sin jerga financiera sin explicar. Cuando la persona pide aprender
  términos como "activo", "pasivo" o "contabilidad", aparecen junto a
  una definición cotidiana y un ejemplo.
- El lenguaje técnico no explicado solo se permite en la documentación
  interna del proyecto (`README.md`, `tecnico.md`, `CLAUDE.md`) y en
  [`legal/`](../../legal/index.html).
- **Quien usa la app nunca debe leer nada en ella que la sitúe
  como "discapacitada", "con dificultades cognitivas" o equivalente.**
  Esto se desarrolla en §4.

### 3.4 Privacidad por defecto

- **Sin registro**: no se pide correo, nombre real ni contraseña.
- **Sin cookies ni analítica**: nada de rastreo.
- **Sin datos personales**: el saldo, los gastos y las metas viven en el
  `localStorage` del navegador y nunca salen del dispositivo.
- La aplicación funciona sin conexión a internet.
- **Contrato de datos local**: el almacenamiento en `localStorage` se
  limita a un único libro compartido (`saldo inicial` en céntimos,
  `movimientos[]`, `metas[]`) más las preferencias (`idioma`,
  `okeymoney:prefs`). **Nunca** se guardan: fallos, tiempo tardado,
  número de intentos, comparativas con otras personas, historiales
  detallados de uso ni perfiles identificables. Los datos nunca salen
  del dispositivo; la copia local es responsabilidad de quien gestiona
  el dispositivo. No hay sincronización en la nube ni cruce entre
  dispositivos.

### 3.5 Accesibilidad universal

- Botones ≥ 64×64 px, separación ≥ 16 px.
- Contraste WCAG AA mínimo.
- Audio **solo cuando aporta valor** (ver §5, principio 6): por ejemplo,
  escuchar el precio que se acaba de teclear o celebrar un guardado.
  Nunca se aplica por defecto a cada texto importante.
- Navegación completa por teclado.
- Respeta `prefers-reduced-motion`.
- Máximo 4–6 opciones visibles por pantalla (la cuadrícula de
  categorías tiene 6 botones, §7).
- Compatible con lectores de pantalla (ARIA en botones de icono y
  zonas de feedback).

### 3.6 Entrenar con mini-simulaciones de la vida cotidiana

A diferencia de Apptonomia, Okeymoney no tiene un catálogo de
actividades terapéuticas: tiene **flujos reales** (recibir dinero,
registrar un gasto, crear una meta, añadir dinero a una meta, planificar
un pago y recontar el saldo). También ofrece simulaciones seguras para
derechos, comunicación, seguridad e imprevistos. El
principio es el mismo, pero aplicado al producto que sí tenemos: cada
flujo se construye como una **mini-simulación de la vida cotidiana**, una
escena reconocible (una compra, un ahorrito para algo que se quiere)
en la que la persona toma una **decisión real** y ve su **consecuencia
inmediata** en el espacio seguro de la app (su saldo, su meta, su
historial).

Esto se aplica a todos los flujos que ya tiene la app:

- **Escena + decisión** (p. ej. `Registrar un gasto`: "¿en qué
  gastaste?" → 6 categorías grandes).
- **Paso a paso guiado** (p. ej. `Crear meta`: dibujo + nombre + precio).
- **Refuerzo inmediato** (p. ej. `Añadir dinero a una meta`: la barra de
  progreso avanza en directo y la cantidad se resta del saldo de Mi
  dinero al confirmar).
- **Ensayo reversible** (p. ej. una decisión de seguridad o una
  reclamación): se practica la respuesta, pero no se modifica el ledger.
- **Vida útil de los bienes**: se estima la depreciación con una fórmula
  transparente y se decide cómo responder a la obsolescencia (reparar,
  reutilizar o sustituir), sin registrar un gasto automáticamente.
- **Rentabilidad y riesgo**: se calcula una ganancia hipotética y se revisa
  si encaja con el plazo, la disponibilidad del dinero y la diversificación;
  nunca se presenta una rentabilidad como promesa.
- **Operaciones de inversión**: se distinguen compra o aportación,
  venta o reembolso, cobro de rendimientos y traspaso, sin conectar con un
  bróker ni ejecutar ninguna orden.
- **Tarjetas y cuentas bancarias**: se diferencian débito, crédito, prepago,
  cuenta corriente y cuenta de ahorro según de dónde sale el dinero y cuándo
  se cobra, sin recomendar entidades ni abrir productos.
- **Vivienda**: se comparan alquiler y propiedad revisando gastos iniciales,
  cuotas, mantenimiento, flexibilidad y plazo, sin presentar una opción como
  universalmente mejor.

La anatomía obligatoria de un flujo de Okeymoney es:

1. **Contexto cotidiano**: cada paso abre con una frase corta y concreta
   ("¿En qué gastaste?", "¿Cuánto gastaste?", "¿Cuánto quieres
   ahorrar?") que ancla lo que se va a hacer en la vida real de la
   persona.
2. **Decisión real**: 1–6 opciones grandes y visibles; una decisión clara
   debe costar un toque, no dos.
3. **Vista previa inmediata**: en el paso numérico, la cantidad se
   descompone en monedas y billetes en directo (el principio 11 de
   diseño) — la persona ve la consecuencia visual antes de confirmar.
4. **Confirmación explícita**: siempre hay un último paso con resumen
   + un único botón grande de "Guardar"; nada se guarda en silencio.
5. **Consecuencia visible**: al guardar, la persona vuelve a Mi dinero
   y ve el saldo, la meta y el historial ya actualizados — causa y
   efecto directo de lo que acaba de hacer.

#### 3.6.1 Método socrático y aprendizaje significativo

Okeymoney no entrena "habilidades en abstracto": entrena **la vida
cotidiana con dinero**. Esto se sostiene sobre dos bases que el
producto declara formalmente como innegociables:

- **Aprendizaje significativo** (en el sentido de Ausubel y Novak): la
  práctica se ancla en lo que la persona ya sabe de su casa, su
  barrio y sus routines; nunca en ejemplos abstractos ni vocabulario
  técnico. Lo nuevo se conecta con lo conocido (criterio de
  *relación sustantiva*), y lo practicado se cierra con una frase
  explícita que lo devuelve al momento del día en el que será útil
  — la *transferencia*.
- **Método socrático**: ante una decisión, la persona **elige primero**,
  y solo si falla se le ofrece **una pista** (primer fallo) y, si
  vuelve a fallar, **la explicación** que justifica la respuesta
  correcta (segundo fallo). Nunca se le dice "incorrecto" ni se le
  resta nada: cada error es un paso más hacia la comprensión, no un
  castigo. Esta es la base del patrón `pista → explicación →
  transferencia` que ya usan las actividades de la pestaña Aprender
  (`tools/`) — y que cualquier flujo futuro de práctica debe respetar.

La anatomía socrática completa, paso a paso, es:

1. **Pregunta anclada**: la pantalla abre con una escena cotidiana y
   una pregunta clara y concreta (no retórica, no decorativa).
2. **Decisión de la persona**: 3–6 opciones grandes. La persona elige
   primero.
3. **Acierto**: refuerzo positivo (`App.feedback.success` o
   `App.feedback.celebrate`), sin texto redundante.
4. **Primer fallo**: mensaje de ánimo (`App.feedback.encourage`) +
   **una pista** (`App.feedback.lockUntilAck` o equivalente: pausa
   de lectura y botón de continuar). La persona vuelve a elegir.
5. **Segundo fallo**: la opción correcta se resalta; se muestra la
   **explicación** que justifica por qué esa es la buena; se avanza.
6. **Transferencia**: al cerrar la ronda, una frase conecta lo
   aprendido con un momento del día real en el que será útil (por
   ejemplo, "esto lo vas a usar la próxima vez que vayas a la
   panadería").

En los flujos numéricos de la v1 (registrar gasto, recontar saldo,
crear meta, aportar a meta) este patrón **no se aplica literalmente**
porque son entradas de datos, no ejercicios: la persona no "falla" al
elegir una categoría, está describiendo lo que pasó. Lo que sí se
aplica siempre es la **transferencia**: cada confirmación cierra con
una frase que devuelve la acción al momento del día ("ahora tu hucha
tiene 3,00 € para los auriculares").

#### 3.6.b Decisión de diseño: la moneda ficticia Tokens

Okeymoney maneja internamente **dos planos de dinero** claramente
separados:

- **Plano real** — `okeymoney:data` (€): el saldo en euros de la
  persona, sus gastos y sus metas. Es la verdad contable que la app
  expone y que nunca se mezcla con la moneda ficticia. Lo rigen las
  restricciones de los §3.1–§3.7 anteriores.
- **Plano de práctica** — `okeymoney:practiceWallet` (Tokens 🔑): una
  moneda **ficticia**, sin valor monetario real, que la persona
  **gana** al completar actividades de la pestaña Aprender (cada
  `tools/<slug>/` acredita una cantidad fija, una sola vez por
  actividad, registrada en `App.wallet.markActivityDone`). Los Tokens
  **se pueden gastar o retirar** dentro de la app: una tienda
  simbólica de logros cosméticos (iconos de meta, fondos, pegatinas)
  y un futuro flujo con un representante de entidad (persona/familiar,
  banco, empresa, organización) que ingrese o retire Tokens a la
  persona. Ninguno de los dos planos modifica al otro: un gasto en €
  nunca acredita Tokens, y gastar Tokens nunca toca el saldo en €.

Este doble plano es una **decisión de diseño priorizada**, no una
excepción a justificar caso por caso: permite que la persona practique
situaciones de dinero con consecuencias reales (su saldo cambia) y,
a la vez, acumule un saldo ficticio que refuerza la práctica sin
confundirla con dinero real — preservando el §3.4 (privacidad y
ausencia de datos personales) y el §3.2 (sin presión: los Tokens
solo se suman, no se restan como castigo).

#### 3.6.c Decisión de diseño: ingresos y saldo

Okeymoney ofrece un flujo separado de **recibir dinero** para registrar
un ingreso real (dinero de bolsillo, trabajo, regalo o devolución). Tocar
el saldo sigue abriendo el asistente de recuento: recalcula el punto de
partida sin reescribir el historial. Ambos caminos escriben movimientos
en el mismo ledger y mantienen el saldo coherente.

### 3.7 Comunicación persuasiva al servicio del aprendizaje

Más allá del flujo de mini-simulación, cada pantalla debe comunicar **al
servicio de la persona, nunca al servicio de la presión**. En concreto,
toda la interfaz debe aplicar las disciplinas de comunicación que se
listan abajo.

1. **Muy didáctica** — el objetivo de cada paso se anuncia en una
   frase corta ("¿En qué gastaste?", "¿Cuánto quieres ahorrar?"); los
   botones confirman la elección antes de avanzar; las metas se
   confirman con un resumen antes de guardarse.
2. **Art effects con cuidado** — la animación se usa para **guiar la
   mirada**, no para decorar: intencional y lenta, solo un elemento se
   mueve a la vez, desactivada con `prefers-reduced-motion`, refuerzo
   suave al guardar, **sin destellos, sin fuegos artificiales
   invasivos**.
3. **Micro-relato cercano (storytelling)** — cada flujo se sitúa en una
   escena reconocible (una compra en la tienda, una hucha para algo que
   se quiere conseguir); la celebración al guardar conecta lo
   guardado con su consecuencia ("ya tienes 3,00 € en tu hucha para
   los auriculares").
4. **Buen copy** — frases cortas (≤ 12 palabras), voz activa, segunda
   persona, imperativos positivos, sin sarcasmo, sin dobles sentidos,
   amigable con TTS.
5. **Llamada a la acción clara** — un único CTA visible por paso, verbo
   en imperativo, CTAs finales que **invitan a volver a Mi dinero o
   seguir registrando**, nunca a "compartir" ni a "desbloquear un
   reto".
6. **Gamificación con moderación** — celebración al guardar, marca de
   "conseguida" en una meta alcanzada, **sin leaderboards**, **sin
   restar** estrellas ni progreso en ningún caso.
7. **Patrones de mercado explícitamente prohibidos** — los siguientes
   patrones forman parte de la "presión" que desterramos y **no
   pueden** aparecer en ningún punto de la app:
   - **Escasez**: "¡Solo te queda 1!", "Última oportunidad", "Date
     prisa", cuentas atrás, recompensas que desaparecen.
   - **Falsa urgencia**: cronómetros, carreras, "termina pronto",
     castigar la lentitud (choca con §3.2).
   - **Prueba social convertida en presión**: rankings, posiciones,
     comparativas con otras personas, "otros ya lo han hecho" como
     presión social (choca con §3.1).
   - **Coste irrecuperable / FOMO**: "perderás tu progreso si
     cierras", "no pierdas tu racha", mensajes forzados de retención
     (choca con §3.2).
   - **Reciprocidad manipuladora / dark patterns**: registros
     forzados, casillas premarcadas, costes ocultos, alertas falsas.
   - **Aversión a la pérdida explotadora**: "tenías 5 €, has perdido
     2". El saldo y las metas solo suman, nunca restan como castigo.

El tono por defecto en Okeymoney es **calmo y predecible**: la persona
maneja su dinero porque la app se lo pone fácil, no porque la estemos
empujando.

## 4. Principios de diseño

Estos principios **mandan sobre cualquier otra decisión**. Si una tarea
entra en conflicto con ellos, ganan los principios. Son la brújula del
producto. Okeymoney los comparte con Apptonomia, Calculia y Teclatlon,
adaptados a su dominio.

1. **Lectura Fácil**: frases cortas, una idea por frase, vocabulario
   cotidiano, sin metáforas.
2. **Una acción por pantalla**: la persona usuaria nunca debe decidir
   entre más de 4–6 opciones visibles a la vez.
3. **Objetos táctiles grandes**: botones mínimo **64×64 px**,
   separación mínima 16 px.
4. **Tipografía grande**: base 20 px, títulos 28–36 px, fuente
   legible (Atkinson Hyperlegible o Nunito).
5. **Tema claro único** con alto contraste (WCAG AA mínimo, AAA
   cuando sea posible) — acento verde-azul calmado sobre superficies
   claras (tokens en
   [`assets/css/tokens.css`](../../assets/css/tokens.css)). El acento
   cambia por pestaña mediante `data-tema` en `<body>` (`dinero` =
   verde, `metas` = azul, `aprender` = ámbar) — el `data-tema` no
   alterna entre tema claro y oscuro, solo entre tres acentos sobre
   el mismo tema claro.
6. **Audio solo cuando aporta valor**: el audio (botón 🔊, Web Speech
   API, es-ES / en-US, velocidad 0.9) se utiliza solo cuando la
   gamificación o el diseño del flujo lo requiere (p. ej. escuchar el
   precio que se acaba de teclear, celebrar un guardado). No se aplica
   por defecto a cada texto importante.
7. **Sin presión**: sin cronómetros visibles, sin puntuación negativa,
   sin "fin del juego", sin rachas que se pierdan.
8. **Refuerzo positivo inmediato**: celebración visual + sonora al
   guardar un gasto o una aportación a meta (≤ 2 s).
9. **`prefers-reduced-motion`**: todas las animaciones se desactivan si
   el sistema lo pide.
10. **Autonomía**: funciona offline (PWA), sin login, sin coste, sin
    datos personales.
11. **Metáforas visuales antes que números abstractos**: cada cantidad
    se muestra siempre como un precio con formato ("3,50 €") **y**
    como monedas y billetes dibujados en pantalla, nunca como un
    decimal en crudo que haya que interpretar mentalmente.
12. **Tecnología sobria**: HTML5 + CSS3 + JavaScript sin frameworks,
    sin paso de compilación, sin dependencias npm, PWA con soporte sin
    conexión. Garantiza que la app se pueda servir como un conjunto de
    archivos estáticos y se mantenga durante años sin romperse.
13. **Entrenar con mini-simulaciones de la vida cotidiana**: cada flujo
    se construye como una escena reconocible (una compra, un ahorrito
    para algo que se quiere) en la que la persona toma una decisión y
    ve su consecuencia inmediata en el espacio seguro de la app. La
    anatomía obligatoria y los anclajes viven en §3.6.
14. **Comunicación persuasiva al servicio del aprendizaje**: toda la
    interfaz es muy didáctica (objetivo visible, ejemplo implícito en
    la vista previa, andamiaje en cada paso), aplica art effects con
    cuidado (lentos, de un solo elemento, respetuosos con
    `prefers-reduced-motion`, sin destellos), usa un micro-relato
    cercano, buen copy, una llamada a la acción clara y gamificación
    con moderación — y **nunca** usa escasez, falsa urgencia, prueba
    social como presión, FOMO, dark patterns ni aversión explotadora a
    la pérdida. La lista completa de patrones prohibidos vive en
    §3.7. La persona maneja su dinero porque la app se lo pone fácil,
    no porque la estemos empujando.

## 5. Regla de obligado cumplimiento: cero menciones en el producto

**Ningún texto que vea quien usa la app puede mencionar, directa ni
indirectamente, discapacidad intelectual, terapia ocupacional, menores,
niños, ni expresiones equivalentes** ("dificultades cognitivas",
"necesidades especiales", "capacidades diferentes", "menor de edad",
etc.). Esto incluye todo lo visible en la interfaz: `index.html`,
`app.js`, `data.js`, `strings.<locale>.js` y `legal/`. El motivo es
exactamente el de §1 y §2: que nadie que use la aplicación se sienta
señalado, en inferioridad o discriminado por lo que la propia
aplicación dice sobre su persona.

Dónde se aplica y dónde no:

- **Se aplica** a todo lo que ve quien usa la app: títulos,
  descripciones meta, botones, etiquetas, mensajes, texto alternativo
  de iconos, pies de página.
- **No se aplica** a la documentación interna del proyecto (este
  documento, `README.md`, `CONTRIBUTING.md`, `CLAUDE.md`): esos
  archivos los lee quien mantiene o contribuye al proyecto, no quien
  usa la app, y es exactamente donde debe explicarse el objetivo real
  del producto (ver §2). La mención de §2 sobre el público objetivo es
  contexto interno, no contenido visible para quien usa la app, y es
  justamente la razón por la que esta regla existe.

Esta regla se comprueba automáticamente: `node scripts/check.js`
falla si cualquiera de esos términos aparece en los archivos que ve
quien usa la app.

### 5.1 Eufemismo público: "usuario/a tipo"

Cuando se presenta Okeymoney de cara al **público general** (prensa,
charlas, READMEs públicos que cualquiera pueda leer, el portal
`apptonomia.uk`, notas en redes sociales, marketing), el término
"discapacidad intelectual" **no debe usarse** para describir la
audiencia de la app, ni siquiera cuando el texto que lo rodea sería
público. El eufemismo aceptado en esas superficies para referirse a la
audiencia es **"usuario/a tipo"** (plural "usuarios/as tipo"),
entendido como marcador genérico de perfil, no como etiqueta para
ninguna persona real.

Dónde se aplica y dónde no:

- **Se aplica** a cualquier texto que cualquier persona ajena al
  proyecto pueda leer sin autenticarse: `README.es.md`, `README.md`,
  el portal en `apptonomia.uk`, charlas públicas, copy en redes, notas
  de prensa, material de marketing. En estas superficies se habla de
  la audiencia como "el/la usuario/a tipo" o "los/las usuarios/as
  tipo" de la app.
- **No se aplica** a la documentación interna de este repositorio
  (`CLAUDE.md`, `doc/es/SPEC.md`, `doc/en/SPEC.md`, `tecnico.md`,
  [`roles.md`](roles.md), `CONTRIBUTING.es.md`, `CONTRIBUTING.md`) —
  esos archivos los lee quien mantiene o contribuye al proyecto, y
  "discapacidad intelectual" sigue siendo allí el término canónico,
  porque el proyecto necesita explicar sin ambigüedad su objetivo real
  a quien lo mantiene.
- **No se aplica** al contenido del proyecto que nombra un concepto
  clínico por su nombre real (p. ej. una actividad sobre un trámite
  administrativo real relacionado con discapacidad): eso es contenido,
  no etiquetado de la audiencia.
- **No se aplica** a la UI de la propia app: la regla de §5 sigue
  prohibiendo **cualquier** mención, incluida "usuario/a tipo", en
  `index.html`, `app.js`, `styles.css`, `strings.<locale>.js`,
  `legal/` y cualquier otra superficie visible. El eufemismo es para
  el exterior, no para lo que lee quien visita la app.

Razón: presentar el objetivo real del proyecto en documentación interna
es útil y necesario; presentarlo en superficies de marketing o landing
no es necesario ni respetuoso con la audiencia — "usuario/a tipo"
permite describir en público para qué sirve la app (qué perfil tiene
quien la usa) sin nombrar públicamente un grupo clínico.

## 6. Forma de la navegación (máximo 3 niveles, siempre predecible)

- **Nivel 0 — pestañas**: una barra inferior fija con exactamente tres
  destinos (Mi dinero / Mis metas / Aprender) más un botón grande "+" en
  la misma posición fija que siempre abre "Registrar un gasto". La barra
  nunca cambia de forma ni de posición.
- **Nivel 1 — un asistente paso a paso**: se abre desde el nivel 0
  (registrar un gasto, crear una meta, añadir dinero a una meta, cambiar
  cuánto dinero se tiene). Cada paso muestra puntos de progreso, un "←
  Volver" al paso anterior y una "✕" que cierra el asistente y descarta lo
  que aún no se había guardado, sin preguntar (poco importante — volver a
  escribirlo es fácil).
- No existe un nivel 2. Un paso de un asistente nunca abre otro asistente.

## 7. Módulos (alcance actual)

### 7.1 Mi dinero (panel principal)

Muestra, en el centro de la pantalla, cuánto dinero tiene la persona
ahora mismo, como un número grande **y** como monedas y billetes. Tocar
el número abre un asistente de un solo paso para recontar el dinero y
actualizarlo — es el sustituto deliberadamente sencillo de "registrar un
ingreso" en la v1 (ver §9). Debajo, los cinco últimos movimientos (gastos
y aportaciones a metas), cada uno con su icono, nombre e importe con
signo.

La cabecera también muestra una **chip del monedero de práctica** con
el saldo de Tokens (solo lectura). Los dos libros de movimientos son
independientes: los Tokens ganados en las actividades de práctica
nunca se mezclan con el saldo en €, y no hay conversión ni transferencia
entre ellos.

### 7.2 Mis metas (Mi hucha)

Una lista de metas (icono + nombre + precio objetivo, elegidos por la
persona), cada una con una barra de progreso y los importes exactos
("3,00 € de 8,00 €"). Crear una meta son dos pasos (elegir un dibujo y un
nombre; escribir el precio). Añadir dinero a una meta reutiliza el mismo
asistente de un paso que todo lo demás, y la aportación se resta del
dinero mostrado en Mi dinero — ahorrar significa apartar ese dinero, no
gastarlo libremente. Alcanzar el objetivo marca la meta como conseguida
con una pequeña celebración; las metas conseguidas no se borran nunca
automáticamente.

### 7.3 Registrar un gasto

El flujo insignia de tres pasos (especificado al detalle en `tecnico.md`
§6, y ya implementado en `app.js`): elegir una categoría, escribir el
precio, confirmar y guardar. Ver el §8 de abajo para la razón exacta de
cada paso.

### 7.4 Aprender (plano de práctica)

La pestaña Aprender abre la **biblioteca de actividades de práctica**
del producto. Cada actividad (`tools/<slug>/`) es una mini-simulación
de una situación cotidiana con dinero, construida sobre el patrón
socrático de §3.6.1: pregunta anclada → decisión → acierto/refuerzo,
o primer fallo → pista, segundo fallo → explicación, siempre con
transferencia al final.

Las actividades se agrupan en **secciones temáticas** (al estilo
Apptonomia: un encabezado con un color de acento distinto por tema),
mostradas en un orden fijo del tema más educativo al más práctico:

**Tema: Aprende a manejar tu dinero** — la progresión central, de
concepto a práctica, dificultad creciente:

| Slug | Actividad | Recompensa (Tokens 🔑) |
|---|---|---|
| `concepts-money` | ¿Qué es el dinero? (identificar monedas y billetes) | +5,00 |
| `needs-vs-wants` | Necesito o quiero | +8,00 |
| `budget-first` | ¿Qué compro primero? (priorizar dentro de un presupuesto) | +12,00 |
| `go-shopping` | Ir a la tienda (elegir la pareja que cabe en el presupuesto) | +20,00 |
| `change-back` | Calcular la vuelta | +30,00 |
| `my-shopping-day` | Mi compra del día (integradora: moneda + necesidad/deseo + presupuesto + vuelta) | +60,00 |

**Tema: Tu dinero seguro** — reconocer estafas del mundo real, al
final por ser la habilidad práctica de mayor consecuencia del
catálogo:

| Slug | Actividad | Recompensa (Tokens 🔑) |
|---|---|---|
| `safe-money` | Mi dinero está seguro (transferencias erróneas y estafas: phishing, falsa llamada del banco, Bizum urgente suplantando a un familiar, falsa venta de segunda mano) | +15,00 |

Cada actividad acredita Tokens **una sola vez** por persona
(`App.wallet.markActivityDone`, idempotente). Repetirla no acredita
más, pero sigue siendo posible por si la persona quiere volver a
practicarla. La cantidad de Tokens que muestra cada actividad en su
cabecera viene del campo `rewardCents` de su `data.js` y se formatea
con `App.money.formatPractice`.

> El símbolo 🔑 y los nombres `token` / `tokens` / `subtokens`
> vienen registrados en `App.money.practice` (ver `assets/js/money.js`)
> y se localizan a través de las claves `practice.*` de cada
> `strings.<locale>.js`. Mantener la paridad es/en en esas claves es
> obligatorio (`scripts/check.js`).

#### 7.4.1 Plano de práctica: Tokens

Okeymoney expone, debajo de la vista previa de monedas/billetes € de
Mi dinero, una tarjeta con el **saldo de Tokens** de la persona
(formateado con `App.money.formatPractice`) y dos botones grandes:

- **+ Ganar / ingresar Tokens** — abre un asistente de un paso en el
  que la persona dice cuántos Tokens quiere añadir y, si quiere, qué
  **representante de entidad** se los entrega (ver §9.5). Por
  defecto, el origen es la práctica ("por completar una actividad");
  con representante, es una persona/familiar, un banco, una empresa
  o una organización.
- **− Gastar / retirar Tokens** — abre un asistente de un paso en el
  que la persona dice cuántos Tokens quiere sacar y, si quiere, qué
  representante se los lleva, o si los gasta en la tienda simbólica
  de §9.4.

El saldo de Tokens se calcula en `App.wallet.balance()` a partir de
`okeymoney:practiceWallet` (ver `tecnico.md` §10). **Nunca** se
mezcla con el saldo en €: los dos libros son independientes y se
almacenan en claves separadas de `localStorage`.

## 8. El flujo "Registrar un gasto", paso a paso

Este es el componente que reutiliza cualquier otro flujo de la app que
pida una cantidad, para su paso numérico (`renderAmountStep` en `app.js`).

1. **"¿En qué gastaste?"** — una cuadrícula de 6 botones grandes con
   icono (comida, ocio, transporte, ropa, salud, otros). Tocar uno *es*
   la respuesta: avanza inmediatamente al paso 2. No hay un toque
   separado para "confirmar tu categoría" — una elección única sin
   ambigüedad debe costar un toque, no dos.
2. **"¿Cuánto gastaste?"** — una pantalla grande con el importe formateado
   ("0,00 €") sobre un teclado numérico de botones grandes (0–9, borrar
   el último dígito, borrar todo) y, en vivo debajo, ese mismo importe
   descompuesto en monedas y billetes (`App.money.breakdown` +
   `paintTokens`) — la metáfora visual del principio 11, actualizada en
   cada pulsación. "Siguiente" permanece deshabilitado mientras el
   importe es 0: no hay nada que explicar, el botón sencillamente aún no
   está listo (constructivo, no un mensaje de error).
3. **Confirmar** — una tarjeta resumen (icono, nombre de la categoría,
   importe formateado) y un botón grande "✅ Guardar gasto". Volver atrás
   conserva el importe ya escrito; cerrar descarta toda la entrada en
   silencio.

Al guardar: el gasto se añade al libro de movimientos compartido
(`tecnico.md` §3), suena un mensaje y sonido positivos
(`App.feedback.celebrate`), y la app vuelve a Mi dinero con el saldo y la
vista previa de monedas ya actualizados — la persona ve la causa y el
efecto directo de lo que acaba de hacer.

## 9. Simplificaciones deliberadas de esta primera versión

Documentadas aquí para que se traten como decisiones priorizadas, no como
carencias descubiertas por accidente:

- **Los pagos previstos no descuentan saldo automáticamente.** La persona
  puede anotar un pago comprometido y una fecha opcional para recordarlo;
  la app marca las fechas pasadas, pero solo un gasto confirmado modifica
  el ledger. Así no se crean movimientos fantasma ni cargos automáticos.
- **No se puede retirar dinero de una meta.** Una vez aportado, el ahorro
  queda comprometido con esa meta en la v1. Necesario antes de lanzar un
  caso de uso real de "gastar de mi hucha".
- **No hay ajuste de sonido independiente todavía.** La pantalla Ajustes
  y datos ya permite tamaño de texto, copia/restauración local y borrado
  explícito; el sonido sigue respetando las preferencias del dispositivo.
- **Aprender tiene 8 actividades funcionando** (`tools/`) y se exponen
  dentro de las unidades didácticas. Sus recompensas de Tokens siguen
  separadas del ledger de euros.

### 9.4 Tienda simbólica (priorised design decision, **no implementada en v1**)

Okeymoney contempla una **tienda simbólica** donde la persona puede
"gastar" Tokens en logros cosméticos: cambiar el icono o el color de
una meta conseguida, fondos de pantalla, pegatinas, etc. El catálogo
sería un array fijo en `data.js` (`tokenShop`), con cada logro
declarado por `{id, nameKey, icon, costCents}`. La compra sería un
asistente de un paso (similar al de "Añadir dinero a una meta"):
elegir logro → confirmar.

Decisiones de diseño ya tomadas para cuando se implemente:

- **Sin presión**: ningún logro es "exclusivo por tiempo"; todos son
  opcionales y desbloqueables solo por preferencia.
- **Cosmético, nunca monetario**: nada de la tienda modifica el saldo
  en €. El gasto de Tokens sale del libro de práctica
  (`App.wallet.credit(-costCents, 'shop:<id>')`) y nunca del real.
- **Sin moneda real**: ningún logro se compra con €. Solo Tokens.
- **Sin leaderboards ni scarcity**: ningún mensaje del estilo "último
  disponible" o "solo quedan 3" (§3.7.7).

### 9.5 Representante de entidad (priorised design decision, **no implementado en v1**)

Una persona, un familiar, un banco, una empresa o una organización
pueden actuar como **representante de entidad** que **ingresa** Tokens
a la persona (recompensa externa, transferencia) o **retira** Tokens
de la persona (devolución, cobro simbólico). El flujo previsto tiene
dos pasos: elegir tipo de representante (persona 👤 / banco 🏦 /
empresa 🏢 / organización 🏛) → escribir un nombre libre ("mi prima
Laura", "el banco de mi mamá"). Máximo 4 opciones por pantalla
(regla de accesibilidad §3.5).

Decisiones de diseño ya tomadas para cuando se implemente:

- **Lista cerrada de tipos** en `data.js` (`representativeTypes`), con
  icono y nombre por tipo. El nombre del representante es texto libre
  escrito por la persona.
- **Solo opera sobre Tokens**, nunca sobre €. Es el equivalente
  simbólico de un ingreso o retirada para el plano de práctica, y
  respeta §3.4 (privacidad: el nombre del representante no sale del
  dispositivo, solo se guarda en el historial de Tokens).
- **Historial completo**: cada movimiento de Tokens queda registrado
  en `okeymoney:practiceWallet.history` con su razón
  (`representative:<type>:<name>` o `shop:<id>` o `activity:<slug>`),
  igual que las herramientas (`activity:<slug>`). El historial está
  capado a los últimos 50 movimientos por UX (ver `wallet.js`).
- **Sin presión**: nunca se penaliza por retirar Tokens. Un
  representante puede retirarlos como parte de un intercambio o un
  cobro acordado, no como castigo.

## 10. Política de idiomas

La interfaz es bilingüe (`es`/`en`); `es` es el idioma por defecto y la
fuente de verdad cuando falta una clave. Los cambios de contenido de
producto (categorías, textos de pantalla, iconos de metas) deben
publicarse en los dos idiomas — ver `tecnico.md` §5. El código
(identificadores, comentarios, mensajes de commit) es siempre en inglés.
