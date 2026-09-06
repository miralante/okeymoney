# Contenidos detallados — Okeymoney

> 🌐 **Otro idioma:** [English](../en/CONTENTS.md)

Este documento es un **índice didáctico detallado** de Okeymoney.
Amplía [`actividades.md`](actividades.md),
[`INDICE-APRENDIZAJE.md`](INDICE-APRENDIZAJE.md),
[`PRODUCT-DESIGN.md`](PRODUCT-DESIGN.md) y
[`guia-crear-elementos.md`](guia-crear-elementos.md) dando,
para cada actividad, tema y concepto pedagógico que se distribuye
con la app:

- Su **nombre** (tal y como aparece en la UI).
- Su **tema** (`concepts`, `daily` o `safety`).
- Su **slug** (`tools/`).
- Su **objetivo didáctico** (qué trabaja).
- Su **recompensa** (okeys que entrega al completarse).
- Su **vocabulario / tema clave** (usado en `strings.es.js` /
  `strings.en.js`).
- Su **referencia** (documento canónico y sección).

Usa este documento como el **workbook de Okeymoney**: cuando se
proponga una actividad nueva, cuando se revise contenido, o cuando
se reequilibre el catálogo, este es el documento que hay que leer
primero.

> **Fuente de verdad para las reglas de producto**:
> [`SPEC.md`](SPEC.md). **Fuente de verdad para la pedagogía**:
> [`guia-crear-elementos.md`](guia-crear-elementos.md). Este
> documento **no** redefine reglas; indexa el contenido que esas
> reglas producen.

---

## 0. Cómo se organiza este documento

1. Los tres temas (`concepts`, `daily`, `safety`).
2. Los tres agentes básicos (Persona, Empresa, Banco).
3. Actividades, tema a tema, en orden didáctico.
4. El recorrido de aprendizaje (enseñar → comprobar → aplicar).
5. Conceptos pedagógicos (qué trabaja cada actividad).
6. Restricciones y contenido prohibido.

---

## 1. Temas

Okeymoney distribuye **8 actividades** organizadas en **3 temas**.
El tema es la metadato pedagógica que mueve la cuadrícula de
inicio y el recorrido de aprendizaje:

| Tema | Slug | Emoji | Qué hace |
|---|---|---|---|
| **Conceptos básicos** | `concepts` | 💡 | Enseña una idea cada vez. 3 pasos cortos + un ejemplo concreto + un test. El núcleo educativo. |
| **Vida cotidiana** | `daily` | 🛒 | 5 actividades de simulación de dificultad creciente. La fase de "aplicar". |
| **Seguridad** | `safety` | 🛡️ | 1 actividad de alto riesgo: reconocimiento de estafas. Colocada al final porque siempre requiere supervisión profesional o familiar. |

---

## 2. Los tres agentes básicos

Cada caso en Okeymoney se apoya en uno de **tres agentes
básicos**. Las actividades reutilizan el mismo conjunto de
agentes definido en `assets/js/activity-runtime.js` y nunca
inventan emojis ad-hoc.

| Agente | Avatar | Español | Inglés | Qué representa |
|---|---|---|---|---|
| Persona | 👤 | Persona | Person | Tú, tu familia, alguien que conoces. |
| Empresa | 🏪 | Empresa | Shop | Supermercado, farmacia, autobús, tienda de ropa. |
| Banco | 🏦 | Banco | Bank | Tu banco (tarjeta, ahorros, transferencias). |

Cada caso nombra al agente implicado (p. ej. "El bus", "La
farmacia", "El banco") para que la persona vea *con quién* está
haciendo la transacción.

---

## 3. Actividades

### 3.1 Tema — Conceptos básicos (`concepts`)

| # | Slug | Título (es / en) | Casos | Recompensa (okeys) | Agentes |
|---|---|---|---|---|---|
| 1 | `concepts-money/` | Cuenta tu dinero / Count your money | 29 | 🔑 12,00 | — (monedas y billetes) |
| 2 | `needs-vs-wants/` | Necesito o quiero / Need or want | 30 | 🔑 8,00 | persona |

### 3.2 Tema — Vida cotidiana (`daily`)

| # | Slug | Título (es / en) | Casos | Recompensa (okeys) | Agentes |
|---|---|---|---|---|---|
| 3 | `budget-first/` | ¿Qué compro primero? / What do I buy first? | 8 | 🔑 12,00 | persona, empresa, banco |
| 4 | `before-buying/` | Cuatro preguntas antes de comprar / Four questions before buying | 4 | 🔑 10,00 | persona |
| 5 | `go-shopping/` | Ir a la tienda / Go shopping | 8 | 🔑 20,00 | persona, empresa, banco |
| 6 | `change-back/` | Calcular la vuelta / Working out change | 6 | 🔑 30,00 | empresa |
| 7 | `my-shopping-day/` | Mi compra del día / My shopping day | 5 | 🔑 60,00 | persona, empresa, banco |

### 3.3 Tema — Seguridad (`safety`)

| # | Slug | Título (es / en) | Casos | Recompensa (okeys) | Agentes |
|---|---|---|---|---|---|
| 8 | `safe-money/` | Mi dinero está seguro / My money is safe | 6 | 🔑 15,00 | — (escenarios de estafa) |

**Total si se completan todas las actividades: 🔑 167,00.**

---

## 4. El recorrido de aprendizaje (enseñar → comprobar → aplicar)

El orden recomendado es **explicar → comprobar → aplicar**:

| Orden | Concepto enseñado | Test | Dónde se practica |
|---:|---|---|---|
| 1 | Contar el dinero y conocer el saldo | `concepts-money` | Comprobar el saldo y registrar entradas de dinero. |
| 2 | Necesidades y deseos | `needs-vs-wants` | Decidir si una compra puede esperar. |
| 3 | Prioridades y presupuesto | `budget-first` | Fijar un límite y recordar pagos previstos. |
| 4 | Pausar antes de comprar | `before-buying` | Planificar una compra y registrar el gasto. |
| 5 | Pagar y comprobar la vuelta | `change-back` | Ensayar pagos con euros. |
| 6 | Ahorrar para una meta | `my-shopping-day` | Crear una meta y añadir dinero. |
| 7 | Proteger tu dinero | `safe-money` | Comprobar mensajes, peticiones y ayuda. |
| 8 | Guardar comprobantes de compras | `go-shopping` | Seguir una compra de pedido a pago. |

La secuencia oficial de test-bloques es:

1. `concepts-money`
2. `needs-vs-wants`
3. `budget-first`
4. `before-buying`
5. `go-shopping`
6. `change-back`
7. `my-shopping-day`
8. `safe-money`

La actividad integrada `my-shopping-day` viene después de las
habilidades parciales y añade el ahorro como su quinta ronda.
`safe-money` queda al final porque es la habilidad de protección.

La referencia completa está en
[`INDICE-APRENDIZAJE.md`](INDICE-APRENDIZAJE.md).

---

## 5. Conceptos pedagógicos (qué trabaja cada actividad)

### 5.1 Reconocimiento de dinero

- Valor de monedas y billetes (`concepts-money/`).
- Contar un saldo (`concepts-money/`).
- Traducir entre euros y céntimos (representación interna; ver
  [`guia-crear-elementos.md`](guia-crear-elementos.md) §2.3).

### 5.2 Toma de decisiones

- Necesidad vs deseo (`needs-vs-wants/`).
- Priorizar compras (`budget-first/`).
- Pausar antes de comprar (`before-buying/`).

### 5.3 Transacciones cotidianas

- Ir a la tienda (`go-shopping/`).
- Calcular vueltas (`change-back/`).
- Un día completo de compra (`my-shopping-day/`).

### 5.4 Ahorro

- Ahorrar hacia una meta (`my-shopping-day/` ronda 5).

### 5.5 Seguridad

- Reconocer estafas (`safe-money/`).
- Proteger el dinero y los datos personales (`safe-money/`).

---

## 6. Restricciones y contenido prohibido

Estas reglas se aplican a **toda** actividad y **nunca** se rompen
(justificación completa en [`SPEC.md`](SPEC.md) §3 y en
[`guia-crear-elementos.md`](guia-crear-elementos.md) §2):

- **Sin penalización de saldo por errores** — ninguna entrada
  incorrecta resta saldo, estrellas, progreso o consecución de
  objetivo. El producto optimiza para autonomía, no para
  precisión.
- **Sin cronómetros, sin puntuación, sin castigo** — el feedback es
  ánimo, no "incorrecto".
- **Sin etiquetas clínicas** sobre la persona usuaria (discapacidad
  intelectual o del desarrollo, terapia ocupacional, menores)
  dentro de la UI.
- **Sin escenarios de banco real o dinero real** — Okeymoney
  simula. Nunca se piden cuentas reales, transferencias reales ni
  datos personales reales.
- **Ubicación de la seguridad**: `safe-money` va **siempre al
  final** del recorrido porque toca riesgo real; está pensado
  como conversación, no como examen.
- **Sin tracking, sin login, sin analítica** — el progreso vive
  solo en `localStorage`.
- **Sin contenido de odio, sexual, político o violento** en el
  producto que ve quien usa la app.

---

## 7. Ver también

- Producto: [`SPEC.md`](SPEC.md).
- Recorrido de aprendizaje: [`INDICE-APRENDIZAJE.md`](INDICE-APRENDIZAJE.md).
- Razonamiento de diseño de producto:
  [`PRODUCT-DESIGN.md`](PRODUCT-DESIGN.md).
- Arquitectura: [`tecnico.md`](tecnico.md).
- Catálogo de actividades (resumen): [`actividades.md`](actividades.md).
- Guía pedagógica (larga):
  [`guia-crear-elementos.md`](guia-crear-elementos.md).
- Idiomas: [`I18N.md`](I18N.md).
- Para familias y terapeutas: [`equipo.md`](equipo.md).
