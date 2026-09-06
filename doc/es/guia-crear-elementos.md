# Guía para crear actividades

> **Cómo diseñar y construir una actividad nueva en Okeymoney,
> aplicando las reglas de producto de [`SPEC.md`](SPEC.md) §3, las
> reglas de accesibilidad de [`tecnico.md`](tecnico.md) §5, la receta
> técnica de §9, y un conjunto de técnicas **didácticas**, de
> **gamificación**, de **persuasión** y de **neuromarketing**
> adaptadas a la audiencia del proyecto.**
>
> Este documento **no** duplica la guía pedagógica canónica del
> suite; apunta a ella y solo recoge lo específico de Okeymoney. Si
> una regla aquí entra en conflicto con la guía canónica o con
> `tecnico.md`, `tecnico.md` gana.

---

## 1. La guía pedagógica canónica

Las técnicas didácticas, de gamificación, de persuasión y de
neuromarketing completas que comparten todas las apps de la
suite Miralante viven en el repositorio de **Routime** en
[`guia-crear-elementos.md`](https://github.com/thenkdframe/routime/blob/main/doc/es/guia-crear-elementos.md).

Léela antes de diseñar nada. Cubre (entre otras cosas):

- Las 13 reglas obligatorias de accesibilidad (con su porqué).
- La escalera de pistas del método socrático (pista → pista más
  grande → respuesta).
- La paleta de refuerzo positivo (sonidos, animaciones, micro-copy).
- Los patrones de neuromarketing adaptados a la audiencia.
- La lista de comprobación del diseño de niveles (progresión
  Fácil → Medio → Difícil).

## 2. Lo específico de Okeymoney

### 2.1 Foco de dominio

Finanzas personales y autonomía financiera cotidiana. Las
actividades son sobre contar monedas y billetes, necesidades vs
deseos, presupuestar, pagar, calcular vueltas, ahorrar y seguridad
ante estafas — nunca sobre razonamiento general o habilidades de
vida diaria (esas viven en otras apps de la suite).

### 2.2 Los tres agentes básicos

Cada caso en Okeymoney se apoya en uno de **tres agentes básicos**:

| Agente | Avatar | Español | Inglés |
|---|---|---|---|
| Persona | 👤 | Persona | Person |
| Empresa | 🏪 | Empresa | Shop |
| Banco | 🏦 | Banco | Bank |

Las actividades reutilizan el mismo conjunto de agentes definido en
`assets/js/activity-runtime.js` y **nunca inventan emojis
ad-hoc**. Cada caso nombra al agente implicado (p. ej. "El bus",
"La farmacia", "El banco") para que la persona vea *con quién*
está haciendo la transacción.

### 2.3 Dinero e importes

- Los importes se introducen en **euros** en la capa de UI;
  **céntimos** internamente.
- La capa de presentación usa `I18N.formatCurrency` (separador
  decimal según idioma).
- El teclado numérico incluye un **conmutador coma / punto** cuando
  el idioma activo lo requiere.
- La ficha de recompensa es el **okey** (🔑); consulta
  [`equipo.md`](equipo.md) para la tabla de recompensas por
  actividad.

### 2.4 La regla "sin penalización de saldo"

Esta es la regla más importante del producto. **No existe ningún
escenario en el que una entrada incorrecta reste saldo, estrellas,
progreso o consecución de objetivo** (ver [`SPEC.md`](SPEC.md) §3.1).
Cualquier actividad nueva que introduzca un "castigo monetario por
equivocarse" rompe el proyecto y debe rediseñarse.

### 2.5 Ubicación de la seguridad ante estafas

La actividad `safe-money` cubre reconocimiento de estafas. Se
coloca al final del recorrido **a propósito** porque toca riesgo
real. Una actividad nueva que introduzca un escenario de dinero
real o banco real debe ser revisada por el rol de apoyo antes de
publicarse — no es una contribución solo de contenido.

### 2.6 Reutilizar el runtime de actividades

La mayoría de actividades de Okeymoney se construyen sobre el bucle
socrático compartido en `assets/js/activity-runtime.js` (o la
variante de teclado numérico que usa `change-back`). **Antes de
montar una actividad nueva, lee el runtime para entender el esquema
de caso, la paleta de feedback y la progresión de niveles.**
Construir una actividad fuera del runtime es una decisión
deliberada y debe estar justificada.

## 3. La receta técnica

Cómo crear la carpeta, registrar la actividad en `DATA.activities`,
asignarle un `unitId`, añadir las cadenas en ambos idiomas y subir la
versión de caché del service worker se describe paso a paso en
[`tecnico.md`](tecnico.md) §10.5. **Lee
esa sección antes de escribir ningún código.**

## 4. Lista de comprobación antes de abrir un PR

- [ ] Carpeta creada en `tools/<slug>/` con la anatomía estándar
      descrita en [`tecnico.md`](tecnico.md) §5.
- [ ] Actividad reutiliza el runtime compartido cuando aplica.
- [ ] El caso usa uno de los tres agentes básicos (sin emojis
      ad-hoc).
- [ ] Importes introducidos como céntimos internamente; formateados
      con `I18N.formatCurrency`.
- [ ] Ningún error resta saldo, estrellas ni objetivo — ver
      [`SPEC.md`](SPEC.md) §3.1.
- [ ] Cadenas añadidas en AMBOS `tools/<slug>/strings.es.js` **y**
      `tools/<slug>/strings.en.js` con las mismas claves.
- [ ] Niveles (1, 2, 3) configurados con dificultad progresiva.
- [ ] Escalera de pistas con método socrático (ver la guía de
      Routime, §3).
- [ ] Actividad registrada una sola vez en `DATA.activities`, con un
      `unitId` válido; conservar su tema (`concepts`, `daily` o `safety`).
- [ ] Recompensa (okeys) fijada según la tabla de
      [`equipo.md`](equipo.md).
- [ ] Caché del service worker: `VERSION` subida en `sw.js`.
- [ ] `node scripts/check.js` pasa.

## 5. Ver también

- Guía pedagógica canónica (Routime):
  [guia-crear-elementos.md](https://github.com/thenkdframe/routime/blob/main/doc/es/guia-crear-elementos.md).
- Referencia del recorrido de aprendizaje y del diseño de producto:
  [`SPEC.md`](SPEC.md) §7.4 y §11–12.
- Receta técnica: [`tecnico.md`](tecnico.md) §9.
- Reglas innegociables del producto: [`SPEC.md`](SPEC.md) §3.
- Catálogo de actividades: [`actividades.md`](actividades.md).
