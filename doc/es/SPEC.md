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

## 3. Principios innegociables

1. **Autonomía** — usable sin que haya un profesional o familiar delante.
   La persona escribe sus propios números y ve su propio dinero, con sus
   propias palabras.
2. **Sin presión** — sin cronómetros, sin puntuaciones negativas, sin
   "fin del juego", sin castigo por una entrada equivocada. Un error se
   corrige fácilmente (borrar el último dígito, volver atrás un paso),
   nunca se presenta como un fallo.
3. **Privacidad** — sin inicio de sesión, sin cuentas, sin cookies, sin
   analítica, sin servidor. Lo único que se guarda (saldo, gastos, metas,
   idioma) vive en el `localStorage` de este navegador y nunca sale del
   dispositivo. Ver [`legal/`](../../legal/index.html).
4. **Lectura fácil** — frases cortas, una idea por pantalla, lenguaje
   sencillo, sin jerga financiera ni clínica ("saldo", "desviación
   presupuestaria", "discapacidad") en nada que la persona lea.
5. **Metáforas visuales antes que números abstractos** — cada cantidad se
   muestra siempre como un precio con formato ("3,50 €") **y** como
   monedas y billetes dibujados en pantalla, nunca como un decimal en
   crudo que haya que interpretar mentalmente.
6. **Accesibilidad** — botones ≥ 64×64 px, espaciado ≥ 16 px, contraste
   WCAG AA, navegación completa por teclado, ARIA en botones de icono y
   zonas de feedback, respeta `prefers-reduced-motion`.
7. **Tecnología sobria** — HTML5 + CSS3 + JavaScript sin frameworks, sin
   paso de compilación, sin dependencias npm, PWA con soporte sin
   conexión.

## 4. Forma de la navegación (máximo 3 niveles, siempre predecible)

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

## 5. Módulos (alcance actual)

### 5.1 Mi dinero (panel principal)

Muestra, en el centro de la pantalla, cuánto dinero tiene la persona
ahora mismo, como un número grande **y** como monedas y billetes. Tocar
el número abre un asistente de un solo paso para recontar el dinero y
actualizarlo — es el sustituto deliberadamente sencillo de "registrar un
ingreso" en la v1 (ver §7). Debajo, los cinco últimos movimientos (gastos
y aportaciones a metas), cada uno con su icono, nombre e importe con
signo.

### 5.2 Mis metas (Mi hucha)

Una lista de metas (icono + nombre + precio objetivo, elegidos por la
persona), cada una con una barra de progreso y los importes exactos
("3,00 € de 8,00 €"). Crear una meta son dos pasos (elegir un dibujo y un
nombre; escribir el precio). Añadir dinero a una meta reutiliza el mismo
asistente de un paso que todo lo demás, y la aportación se resta del
dinero mostrado en Mi dinero — ahorrar significa apartar ese dinero, no
gastarlo libremente. Alcanzar el objetivo marca la meta como conseguida
con una pequeña celebración; las metas conseguidas no se borran nunca
automáticamente.

### 5.3 Registrar un gasto

El flujo insignia de tres pasos (especificado al detalle en `tecnico.md`
§6, y ya implementado en `app.js`): elegir una categoría, escribir el
precio, confirmar y guardar. Ver el §6 de abajo para la razón exacta de
cada paso.

### 5.4 Aprender

Marcador de posición en esta primera versión: una tarjeta honesta de
"muy pronto" más una lista de las primeras actividades previstas
(calcular la vuelta, hacer un presupuesto sencillo, lo que necesito
frente a lo que quiero). Nunca debe parecer terminado ni interactivo
hasta que lo esté — nada de botones falsos.

## 6. El flujo "Registrar un gasto", paso a paso

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
   `paintTokens`) — la metáfora visual del principio 5, actualizada en
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

## 7. Simplificaciones deliberadas de esta primera versión

Documentadas aquí para que se traten como decisiones priorizadas, no como
carencias descubiertas por accidente:

- **No hay un flujo separado de "registrar un ingreso".** Tocar el saldo
  en Mi dinero abre un asistente "¿cuánto dinero tienes ahora?" que
  recalcula el punto de partida para que el historial quede intacto. Un
  flujo de ingresos dedicado (paga recibida, dinero de bolsillo) es el
  siguiente paso natural, construido sobre el mismo componente de
  importe.
- **No se puede retirar dinero de una meta.** Una vez aportado, el ahorro
  queda comprometido con esa meta en la v1. Necesario antes de lanzar un
  caso de uso real de "gastar de mi hucha".
- **Todavía no hay pantalla de ajustes** (tamaño de texto, sonido
  sí/no). `storage.js` ya lee una clave `okeymoney:prefs` igual que las
  apps hermanas, así que añadirla después es aditivo, no una reescritura.
- **Aprender todavía no tiene actividades funcionando** — ver §5.4.

## 8. Política de idiomas

La interfaz es bilingüe (`es`/`en`); `es` es el idioma por defecto y la
fuente de verdad cuando falta una clave. Los cambios de contenido de
producto (categorías, textos de pantalla, iconos de metas) deben
publicarse en los dos idiomas — ver `tecnico.md` §5. El código
(identificadores, comentarios, mensajes de commit) es siempre en inglés.
