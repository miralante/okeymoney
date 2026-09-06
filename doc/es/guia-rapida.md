# Guía rápida

> 🌐 **Otro idioma:** [English](../en/quick-guide.md)

Esta guía explica paso a paso cómo usar Okeymoney: desde cómo
abrirla hasta cómo recorrer el itinerario de aprendizaje, cambiar de
idioma o instalarla en el móvil. Incluye también **cuatro formas de
abrir la aplicación**, ordenadas de la más fácil a la más
elaborada.

> 📦 La versión detallada paso a paso (con el recorrido completo de
> instalación PWA y una sección completa de resolución de problemas)
> vive en la guía canónica transversal:
> [`routime/doc/es/guia-rapida.md`](https://github.com/thenkdframe/routime/blob/main/doc/es/guia-rapida.md).
> El **flujo de apertura, instalación PWA, cambio de idioma y
> resolución de problemas son idénticos** en todas las apps de la
> suite Miralante. Este documento solo recoge lo específico de
> Okeymoney.

---

## 1. Cómo abrir Okeymoney

Hay **cuatro formas**, ordenadas de la más fácil a la más
elaborada. El recorrido completo está en la guía canónica enlazada
arriba. La versión corta:

| # | Método | Qué necesitas | ¿Sin conexión? | ¿Instalable como PWA? |
|---|---|---|---|---|
| **A** | Desde internet ([okeymoney.apptonomia.uk](https://okeymoney.apptonomia.uk)) | Un navegador | ❌ | ✅ |
| **B** | Descargando el ZIP de GitHub | Un navegador | ❌ | ❌ |
| **C** | Servidor local con Python | Python 3 | ❌ | ✅ |
| **D** | Servidor local con Node.js | Node.js | ✅ | ✅ |

> 💡 Si solo quieres **probar la app**, usa el método **A** o **B**.
> Para la **experiencia completa** (PWA, modo sin conexión, "Añadir
> a pantalla de inicio"), usa **C** o **D**.

---

## 2. La pantalla principal

La pantalla de inicio muestra **dos pasos**:

- **1. Aprende**: elige una de las cinco unidades. Lee una idea y haz
  una actividad relacionada.
- **2. Úsalo**: registra tu saldo, tus ingresos, tus gastos y tus metas.

El orden recomendado está en [`SPEC.md`](SPEC.md) §7.4 y
[`actividades.md`](actividades.md).

## 3. Elegir una unidad o actividad

Toca una unidad para ver su explicación y sus actividades. Elige una
actividad para empezar. Puedes repetirla cuando quieras.

## 4. Botones en cada actividad

Botones habituales: **inicio**, **reiniciar nivel**, **anterior /
siguiente**, **audio** (cuando la actividad lo necesite),
**teclado numérico** (para introducir importes) y **ajustes**
(icono de engranaje, dentro de la app, no la página global).

## 5. Dinero e importes

Los importes se introducen en **euros** con separador decimal según
el idioma (`I18N.formatCurrency`). Internamente la app guarda
**céntimos** para evitar problemas de coma flotante. El teclado
numérico incluye un **conmutador coma / punto** cuando el idioma
lo requiere.

## 6. Cómo funciona el audio

El audio se reproduce automáticamente cuando la actividad lo
necesita (p. ej. leer el precio en voz alta). Toca el botón 🔊
para repetirlo. Okeymoney respeta `prefers-reduced-motion` y la
preferencia de audio de los ajustes.

## 7. Mensajes de respuesta

Acierto → mensaje de ánimo y **okeys**; error → mensaje de ánimo y
reintento ilimitado. **No hay cambio negativo de saldo en ningún
sitio** — ver [`SPEC.md`](SPEC.md) §3.1.

## 8. Ganar fichas (okeys)

Cada nivel completado recompensa una cantidad fija de okeys (🔑),
desde **🔑 8,00** (actividades pequeñas) hasta **🔑 60,00** (mi
compra del día). **Las fichas nunca bajan.** Consulta
[`equipo.md`](equipo.md) para la tabla completa de recompensas.

## 9. Cambiar idioma

Abre el menú de idioma desde la cabecera (icono del globo 🌐).
Disponibles: **Español (predeterminado)** e **Inglés**. Consulta
[`I18N.md`](I18N.md) para ver cómo añadir un nuevo idioma.

## 10. Ajustes personales

Abre `/settings`. Desde allí puedes:

- Ver **Mi progreso** (okeys y niveles por actividad).
- Restablecer progreso (con confirmación, porque es destructivo).
- Gestionar las preferencias de audio y de movimiento reducido.

## 11. Instalar la app en el móvil

Los pasos completos (Android / iOS / escritorio) están en la guía
canónica. Versión corta: abre Okeymoney en el navegador, elige
"Añadir a pantalla de inicio" / "Instalar", confirma.

## 12. Resolución de problemas

Consulta **§11 Resolución de problemas** de la guía canónica —
esos apartados aplican idénticamente a Okeymoney.

## 13. Más ayuda

- Producto: [`SPEC.md`](SPEC.md).
- Recorrido de aprendizaje: [`SPEC.md`](SPEC.md) §7.4 y
  [`actividades.md`](actividades.md).
- Arquitectura: [`tecnico.md`](tecnico.md).
- Catálogo de actividades: [`actividades.md`](actividades.md).
- Para familias y terapeutas: [`equipo.md`](equipo.md).

## 14. Resumen rápido

1. Abre Okeymoney (4 métodos; el más fácil es **A**).
2. Sigue el recorrido: explicar → comprobar → aplicar.
3. Elige una actividad en la cuadrícula de inicio; usa el teclado
   numérico para los importes.
4. Gana **okeys** por nivel; sin fallos, sin penalización de saldo.
5. Cambia idioma con 🌐; instala como PWA para uso sin conexión.
