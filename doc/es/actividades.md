# Catálogo de actividades

> Okeymoney incluye **8 actividades de práctica**, enlazadas desde la
> fase de test de sus unidades didácticas (ver `DATA.learningIndex` en
> `data.js`). La segunda parte de la portada reúne la guía para actuar
> y las simulaciones (ver [`PRODUCT-DESIGN.md`](PRODUCT-DESIGN.md)):
> *Conceptos básicos* (2 actividades, el núcleo educativo), *Vida
> cotidiana* (5 actividades, de menor a mayor dificultad, simulación y
> práctica) y *Seguridad* (1 actividad, la última porque es la
> habilidad práctica de mayor consecuencia real). Cada actividad es una
> carpeta `tools/<slug>/` independiente que reutiliza el bucle
> socrático de
> [`assets/js/activity-runtime.js`](../../assets/js/activity-runtime.js)
> (o la variante con teclado numérico de `change-back`).

## Recorrido didáctico completo

El orden recomendado es **explicar → comprobar → aplicar**. Las
actividades de test no se bloquean: la persona puede elegir libremente,
pero la home presenta los bloques en ese orden para reducir la carga y
facilitar la transferencia a la vida diaria.

| Concepto que se explica | Test que lo comprueba | Aplicación posterior en euros |
|---|---|---|
| Valor de monedas y billetes | `concepts-money` | Consultar y actualizar el saldo |
| Necesidades y deseos | `needs-vs-wants` | Decidir antes de registrar un gasto |
| Prioridades y presupuesto | `budget-first` | Planificar una meta y revisar el saldo |
| Comprar sin pasarse | `go-shopping` | Registrar una compra con su importe |
| Pagar y calcular la vuelta | `change-back` | Revisar el importe antes de guardar el gasto |
| Integrar una compra completa | `my-shopping-day` | Secuencia saldo → gasto → consecuencia visible |
| Ahorrar para una meta | `my-shopping-day` (ronda 5) | Crear una meta y añadir dinero |
| Seguridad ante engaños | `safe-money` | Criterio transversal antes de cualquier pago |

La última columna describe la transferencia disponible hoy. El bloque de
simulación también incluye ahora una práctica de vuelta con importes en
euros y tres decisiones de seguridad antes de enviar dinero. Ninguna de
las dos actividades da Tokens ni modifica el ledger: primero se ensaya,
después se decide si se quiere registrar el gasto real.

## Los tres agentes básicos

Cada caso se sitúa con uno de los **tres agentes básicos** que una
persona encuentra en su vida cotidiana con el dinero. Las actividades
reutilizan el mismo conjunto de agentes definido en
[`assets/js/activity-runtime.js`](../../assets/js/activity-runtime.js)
y nunca inventan emojis sobre la marcha.

| Agente | Avatar | Español | Inglés | Qué representa |
|---|---|---|---|---|
| Persona | 👤 | Persona | Person | Tú, tu familia, alguien que conoces |
| Empresa | 🏪 | Empresa | Shop | Supermercado, farmacia, bus, tienda de ropa |
| Banco | 🏦 | Banco | Bank | Tu banco (tarjeta, ahorro, transferencias) |

Cada caso nombra al agente concreto que interviene (p. ej. *"El bus"*,
*"La farmacia"*, *"El banco"*) para que la persona vea **con quién** está
haciendo la transacción.

## Actividades, en orden

### Tema: Conceptos básicos (`theme: 'concepts'`)

| # | Slug | Título (es / en) | Agentes | Casos | Recompensa (okeys) |
|---|---|---|---|---|---|
| 1 | `concepts-money` | ¿Qué es el dinero? / What is money? | — (identificación de objetos) | 8 | 🔑 5,00 |
| 2 | `needs-vs-wants` | Necesito o quiero / Need or want | persona | 8 | 🔑 8,00 |

### Tema: Vida cotidiana (`theme: 'daily'`)

| # | Slug | Título (es / en) | Agentes | Casos | Recompensa (okeys) |
|---|---|---|---|---|---|
| 3 | `budget-first` | ¿Qué compro primero? / What do I buy first? | persona, empresa, banco | 8 | 🔑 12,00 |
| 4 | `before-buying` | Cuatro preguntas antes de comprar / Four questions before buying | persona | 4 | 🔑 10,00 |
| 5 | `go-shopping` | Ir a la tienda / Go shopping | persona, empresa, banco | 8 | 🔑 20,00 |
| 6 | `change-back` | Calcular la vuelta / Working out change | empresa | 6 | 🔑 30,00 |
| 7 | `my-shopping-day` | Mi compra del día / My shopping day | persona, empresa, banco | 5 | 🔑 60,00 |

### Tema: Seguridad (`theme: 'safety'`)

| # | Slug | Título (es / en) | Agentes | Casos | Recompensa (okeys) |
|---|---|---|---|---|---|
| 8 | `safe-money` | Mi dinero está seguro / My money is safe | — (escenarios de estafa) | 6 | 🔑 15,00 |

**Total al completar todas: 🔑 160,00.**

Las actividades mantienen esos tres temas como metadatos pedagógicos,
pero la portada las presenta dentro de cada unidad didáctica. Las
unidades siguen el orden de `DATA.didacticLessons`; *Conceptos básicos*
va primero por ser el núcleo educativo, *Vida cotidiana* aumenta la
dificultad y *Seguridad* cierra el recorrido por su mayor consecuencia
práctica. La guía para actuar ofrece el contexto práctico y las
simulaciones de cada unidad (ver [`tecnico.md`](tecnico.md) §10.3).

## 1. Conceptos: ¿qué es el dinero? (`tools/concepts-money/`)

Identificar monedas y billetes por su valor. Cada caso muestra un token
visual (renderizado por `App.money.createToken()`) y pregunta *"¿cuánto
vale?"*, con tres opciones de múltiplo elección. Enseña el **CATALOG** de
[`assets/js/money.js`](../../assets/js/money.js): 5c, 10c, 20c, 50c, 1 €,
2 €, 5 €, 10 €, 20 €, 50 €.

## 2. Necesito o quiero (`tools/needs-vs-wants/`)

Clasifica ocho objetos cotidianos: ¿el objeto es una necesidad, un
deseo, o las dos cosas? El agente es siempre **Tú** o **Tu familia**,
porque esta decisión es personal.

## 3. ¿Qué compro primero? (`tools/budget-first/`)

Con un presupuesto pequeño y tres o cuatro compras candidatas, decidir
cuál comprar **primero** y reconocer gastos fijos o prescindibles. El agente
cambia según el caso (familia, farmacia, bus, banco) para que el alumno
practique clasificación y priorización bajo restricciones reales. Ocho casos.

## 3.1 Cuatro preguntas antes de comprar (`tools/before-buying/`)

Esta unidad adapta, con redacción propia y situaciones sencillas, la técnica
de las cuatro preguntas para frenar compras impulsivas descrita en
[Preahorro](https://preahorro.com/como-ahorrar/4-preguntas-que-debes-hacerte-antes-de-comprar-cualquier-cosa/).
Practica comprobar necesidad, deuda, alternativas de precio y utilidad futura.

## 4. Ir a la tienda (`tools/go-shopping/`)

Con un presupuesto, elegir los **dos** objetos que caben. Cada caso usa
una tienda real (Mercadona, farmacia, bus, tienda de ropa, banco) para
que el alumno vea al mismo agente con el que se encontraría en la calle.

## 5. Calcular la vuelta (`tools/change-back/`)

Mecánica con teclado numérico. Pagas con una moneda o billete, compras
algo más barato, escribes la vuelta (`pagado − coste`). El agente es
siempre una **empresa** porque es con quien te encuentras en la caja.
Seis casos, fácil → difícil.

## 6. Mi compra del día (`tools/my-shopping-day/`)

La actividad final del tema *Vida cotidiana*: cinco casos que recorren una
compra realista de principio a fin — pensar antes de salir, priorizar,
elegir en la tienda, calcular la vuelta en la caja y guardar para una meta. La secuencia de
agentes refleja la vida real: persona → empresa → empresa → banco.

## 7. Mi dinero está seguro (`tools/safe-money/`)

El tema *Seguridad*. Seis situaciones reales de estafa (Bizum
inesperado, SMS de phishing, una llamada suplantando al banco, un
"familiar" urgente pidiendo dinero, una ganga de segunda mano
demasiado buena) — la persona elige la acción segura en cada caso
(p. ej. llamar al banco, no pinchar el enlace, colgar y comprobar). Sin
tarjeta de agente: la propia escena (un mensaje, una llamada, un
anuncio) es el antagonista.

## Cómo es un caso

Cada caso es un objeto dentro del `app.js` de la actividad:

```js
{
  id: 'b1',
  agente: 'persona',          // persona | empresa | banco (opcional)
  agenteName: 'shopFamilia',  // clave i18n en strings.<locale>.js
  instruccionKey: 'b1instr',  // consigna mostrada sobre el escenario
  escenaHtml: '<p>🍞 2 € · 🎮 30 € · 💧 1 €</p>',
  opciones: ['opAgua', 'opPan', 'opJuego'],  // 3 claves i18n, barajadas
  correctaIndex: 1,
  pistaKey: 'b1pista',         // se muestra en el primer fallo
  explicacionKey: 'b1expl'    // se muestra en el segundo fallo + opción correcta
}
```

El runtime compartido
([`assets/js/activity-runtime.js`](../../assets/js/activity-runtime.js))
se encarga de:

- Pintar la tarjeta del agente (avatar + etiqueta + nombre).
- Mostrar los 3 botones de opción barajados.
- Primer fallo → pista; segundo fallo → se revela la opción correcta + explicación.
- Tras el último caso: acredita el **monedero de práctica** con `App.wallet.credit(...)`
  (idempotente) y marca la actividad como `done`.

## Monedero de práctica

Completar una actividad acredita el **monedero de práctica** de la
persona (la moneda inventada *"okey"*, 🔑). Este es un libro de
movimientos **completamente independiente** del saldo real de Mi dinero:

- Monedero de práctica: `localStorage['okeymoney:practiceWallet']`, céntimos enteros en okeys.
- Libro real: `localStorage['okeymoney:data']`, céntimos enteros en euros.

**No hay conversión ni transferencia** entre los dos. El alumno ve
ambos saldos en pantalla (Mi dinero muestra los dos; Aprender muestra
el de práctica) y entiende que lo que gana practicando no afecta a su
dinero real.
