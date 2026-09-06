# Okeymoney

**Aplicación web que enseña finanzas personales y autonomía financiera cotidiana: saber cuánto dinero tienes, gastarlo con consciencia y ahorrar hacia algo que quieres.**

---

## ¿Qué es Okeymoney?

Okeymoney es una herramienta digital para practicar decisiones cotidianas sobre dinero, en el navegador, sin coste. **No** es un banco, ni un asesor financiero, ni un juego — no mueve dinero real y no te pone nota.

Okeymoney es **una sola app con estado compartido**: el saldo, las metas de ahorro, los gastos registrados y el monedero de prácticas leen y escriben el mismo libro contable local, así todo se mantiene coherente. La lista completa de funciones está en [`actividades.md`](actividades.md).

---

## Características principales

### ✅ Diseñada para la autonomía

- **Sin presión**: no hay cronómetros, ni notas negativas, ni castigos
- **Refuerzo positivo**: celebra un saldo sano y el progreso hacia una meta
- **Lectura Fácil**: frases cortas, vocabulario cotidiano, una idea por pantalla

### ✅ Accesible para todos

- **Botones grandes**: mínimo 64×64 píxeles
- **Texto grande**: letra clara y legible (Atkinson Hyperlegible)
- **Alto contraste**: ratios AAA verificados en los tokens principales
- **Asistentes paso a paso** para cada acción que pide una cifra, una categoría o una fecha

### ✅ Privacidad por defecto

Sin cuentas, sin cookies, sin analítica, sin servicios externos. Todos tus números viven en `localStorage` en tu propio dispositivo, y puedes borrarlos en cualquier momento desde la ruta de **Ajustes**.

### ✅ En dos idiomas

- 🇪🇸 **Español** (predeterminado)
- 🇬🇧 **English** (se puede cambiar desde el menú)

---

## Cómo empezar

### 1. Abrir la aplicación

Visita **[okeymoney.apptonomia.uk](https://okeymoney.apptonomia.uk)** o abre `index.html` desde un servidor local. El paso a paso completo con **cuatro formas de abrir Okeymoney** (internet, ZIP, Python, Node.js) está en [`guia-rapida.md`](guia-rapida.md).

### 2. Define un saldo inicial

La primera vez que abras Okeymoney, **Mi dinero** te pedirá un saldo inicial (cuánto dinero tienes ahora). A partir de ahí, cada movimiento que registres actualiza ese mismo saldo.

### 3. Prueba el monedero de prácticas

Antes de registrar movimientos reales, puedes usar el **monedero de prácticas** para experimentar: registra algunas entradas de "recibir dinero" y "registrar gasto", mira cómo cambia el saldo, crea una meta, véala llenarse. Nada de lo que hagas aquí es destructivo.

### 4. Cambiar el idioma

Toca el botón del idioma (🇪🇸 o 🇬🇧) en la parte superior de la pantalla.

---

## Ejemplo de uso

Imagina que te han pagado esta semana. Abre **🫴 Recibir dinero**, elige "Trabajo", escribe `25`, confirma. El saldo de **💼 Mi dinero** se actualiza al instante. Luego compras el almuerzo: abre **🧾 Registrar gasto**, elige "Comida", escribe `6`, confirma. El saldo se actualiza otra vez. Al final de la semana, abre **📚 Movimientos recientes** y ves toda la semana de un vistazo.

---

## Funciones destacadas

### 💼 Mi dinero

El panel de saldo compartido. Un número — tu saldo actual — que todas las demás funciones leen y escriben. Ábrelo cuando quieras saber "¿cuánto tengo ahora?".

### 🫴 Recibir dinero

Registra paga extra, trabajo, regalos o devoluciones. Cada entrada se suma al saldo con una categoría y una fecha.

### 🎯 Mis metas

Seguimiento de metas de ahorro. Elige una meta ("un juego nuevo", "un viaje"), pon una cantidad, y mira cómo se llena tu progreso conforme ahorras. El saldo se actualiza en sincronía.

### 🧾 Registrar gasto

Un asistente paso a paso: elige categoría, escribe la cantidad, elige cómo pagaste (efectivo, tarjeta, online), confirma. La cantidad se resta del saldo automáticamente.

### 📚 Movimientos recientes

Una vista local sencilla de ingresos, gastos y ahorro — qué pasó, cuándo y en qué categoría.

### 📌 Pagos previstos

Recuerda pagos con fecha (un recibo, una suscripción) y revisa los vencidos sin alterar el saldo automáticamente.

### 🧭 Brújula del dinero

Una tarjeta resumen que muestra ingresos, gastos, ahorro y tu categoría principal de gasto, usando los datos que ya has registrado.

### 📦 Ciclo de compra

Practica el ciclo completo: pedido, albarán, factura y pago. Solo el paso de **pago** registra el gasto — el pedido y el albarán son solo pasos previos.

### 📊 Foto del dinero

Explica activos, deudas previstas, ingresos y gastos con los datos que ya has registrado, en lenguaje llano.

---

## Más información

- [Guía rápida de uso](guia-rapida.md) — Paso a paso (cuatro formas de abrir Okeymoney)
- [Catálogo de funciones](actividades.md) — Lista completa de cada función
- [Guía para profesionales](equipo.md) — Cómo usar Okeymoney en terapia
- [Información técnica](tecnico.md) — Para desarrolladores

---

## Créditos y licencia

Okeymoney es un proyecto de código abierto, distribuido bajo la licencia MIT. **No** es un banco, ni un asesor financiero, ni una evaluación clínica, ni un juego competitivo, y no ejecuta pagos.
