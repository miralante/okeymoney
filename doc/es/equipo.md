# Guía para profesionales y familias

Esta guía está pensada para terapeutas ocupacionales, familias,
docentes y otros profesionales que quieran usar Okeymoney como
herramienta de apoyo para las finanzas personales y la autonomía
financiera cotidiana.

---

## ¿Para quién es Okeymoney?

Okeymoney está diseñado principalmente para:

- **Personas con discapacidad intelectual o del desarrollo** que
  están aprendiendo a gestionar su propio dinero.
- **Familias** que buscan recursos para ensayar decisiones de dinero
  en casa.
- **Docentes y terapeutas** que necesitan herramientas
  complementarias para la intervención directa.

La aplicación **no sustituye** la intervención profesional, pero
puede servir como:

- Refuerzo entre sesiones.
- Práctica autónoma en casa.
- Una forma de ensayar situaciones de dinero (contar monedas, pagar,
  calcular vueltas) sin riesgo de dinero real.

---

## Cómo usar Okeymoney en las sesiones de apoyo

### Valoración inicial

Antes de usar la aplicación, observa a la persona con estas
preguntas:

1. ¿Cuál es su nivel actual de autonomía con el dinero? (¿Reconoce
   monedas y billetes? ¿Sabe calcular vueltas?)
2. ¿Qué habilidades quiere trabajar? (contar, presupuestar, pagar,
   ahorrar, seguridad ante estafas…)
3. ¿Qué situaciones le son familiares? (supermercado, farmacia,
   autobús, compra familiar, compra online…)
4. ¿Necesita apoyo para manejar dispositivos tecnológicos?

### Recorrido de aprendizaje recomendado

El orden recomendado es **explicar → practicar → aplicar**:

1. **Explicar** — la primera parte de la pantalla de inicio enseña
   una idea cada vez, con tres pasos cortos y un ejemplo concreto.
2. **Practicar** — cinco unidades agrupan las 8 actividades, descritas en
   [`actividades.md`](actividades.md), para practicar la idea.
3. **Aplicar** — la fase de simulación (5 actividades de vida
   cotidiana) permite ensayar situaciones reales.

La referencia completa está en [`SPEC.md`](SPEC.md) §7.4 y
[`actividades.md`](actividades.md).

### Selección de actividades (ejemplos)

#### Para personas que empiezan

| Actividad | Habilidad trabajada |
|-----------|---------------------|
| `concepts-money` | Reconocimiento de monedas y billetes, saldo. |
| `needs-vs-wants` | Distinguir necesidades de deseos. |
| `budget-first` | Prioridades y presupuesto. |

#### Para personas con nivel intermedio

| Actividad | Habilidad trabajada |
|-----------|---------------------|
| `before-buying` | Cuatro preguntas antes de comprar. |
| `go-shopping` | Ir a la tienda. |
| `change-back` | Calcular la vuelta. |

#### Para personas con nivel avanzado

| Actividad | Habilidad trabajada |
|-----------|---------------------|
| `my-shopping-day` | Una compra completa del día (5 rondas). |
| `safe-money` | Reconocer estafas, proteger el dinero. |

### Adaptaciones

#### Nivel de dificultad

Cada actividad tiene **3 niveles** (Fácil → Medio → Difícil). Para
elegir:

- **Nivel 1 (Fácil)**: personas nuevas o con apoyo significativo.
- **Nivel 2 (Medio)**: personas con experiencia moderada.
- **Nivel 3 (Difícil)**: personas autónomas que buscan reto.

#### Ajustes centrados en el dinero

Si los números en pantalla siguen siendo abstractos, puedes:

- Imprimir unas monedas y billetes para manipular físicamente
  mientras la actividad se ejecuta.
- Fijar un pequeño presupuesto real (p. ej. "la compra de hoy son
  5 €") y dejar que la persona elija qué poner en la cesta desde
  una lista impresa.
- Usar la actividad como demostración antes de pedir autonomía.

---

## Seguimiento del progreso

### Fichas (okeys)

Cada actividad recompensa con **okeys** (🔑) al completarse:

- 🔑 8,00 — actividad pequeña (p. ej. necesidades vs deseos).
- 🔑 12,00 — actividad estándar.
- 🔑 20,00 — actividad grande (ir a comprar).
- 🔑 30,00 — práctica de vueltas.
- 🔑 60,00 — mi compra del día (la más compleja).

**Las fichas nunca bajan** — ver [`SPEC.md`](SPEC.md) §3.1.

### Cómo ver el progreso

Abre `/settings` (ver [`guia-rapida.md`](guia-rapida.md) §9) y
consulta **Mi progreso** para el resumen completo.

### Privacidad

El progreso se guarda **solo en el `localStorage` del navegador**.
No sale del dispositivo. Restablecer el progreso es destructivo y
requiere confirmación.

---

## Seguridad ante estafas y supervisión

La actividad `safe-money` se coloca al final del recorrido a
propósito porque toca riesgo real (reconocer estafas, rechazar
peticiones sospechosas). Buena práctica:

- Recorre la actividad junto a la persona la primera vez.
- Úsala como conversación, no como examen.
- Refuerza la regla "pregunta a una persona de confianza antes de
  enviar dinero" (ver [`SPEC.md`](SPEC.md) §3 sobre los principios
  de sin presión y autonomía).

---

## Más recursos

- Catálogo de actividades: [`actividades.md`](actividades.md).
- Recorrido de aprendizaje: [`SPEC.md`](SPEC.md) §7.4 y
  [`actividades.md`](actividades.md).
- Notas pedagógicas y de diseño para profesionales:
  [`guia-crear-elementos.md`](guia-crear-elementos.md).
- Guía transversal para familias sobre habilidades de vida diaria:
  [`equipo.md` de Routime](https://github.com/thenkdframe/routime/blob/main/doc/es/equipo.md).

## Práctica ampliada

Las 11 actividades incluyen tres recorridos nuevos, con seis situaciones cada uno. Cada recorrido avanza de identificar una cantidad a comparar y decidir. Cada actividad nueva acredita 12 Tokens una sola vez. El total del catálogo es 210 Tokens.

- `save-step-by-step`: Ahorra para una meta.
- `compare-prices`: Compara antes de pagar.
- `monthly-payments`: Organiza tus pagos.

Las pistas y explicaciones permanecen hasta pulsar «Entendido». No hay avance por tiempo. Al terminar se recuerda cómo usar lo aprendido. Las actividades no guardan intentos y no modifican el saldo en euros.
