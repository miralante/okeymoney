# Roles del proyecto

Okeymoney tiene **tres roles diferenciados**, igual que el resto de la
familia de proyectos (Apptonomia, Calculia, Memofun, Sinonimia,
Teclatlon):

| Rol | Quién es | Cómo participa | Dónde mira primero |
|---|---|---|---|
| 👤 **Persona usuaria** (alguien con discapacidad intelectual o del desarrollo que aprende finanzas personales, y en particular personas que se benefician de la lectura fácil) | Practica el saldo, las metas y el registro de gastos | Abre `index.html` en un navegador y usa la app de forma autónoma. **No lee código**, no toca el libro contable directamente. | La aplicación — no hace falta leer nada más |
| ❤️ **Apoyo**: familia, cuidador/a, profesional de apoyo | Inicializa el libro contable y acompaña los primeros gastos | Define el saldo inicial y las primeras metas de ahorro en `Mi dinero` / `Mis metas`; acompaña el primer registro de gasto en `Registrar un gasto`; supervisa el progreso con el tiempo. | [`CONTRIBUTING.es.md`](../../CONTRIBUTING.es.md) (la sección "Apoyo") |
| 💻 **Construcción**: desarrollador/a | Mantiene el libro contable compartido y el catálogo | Edita `app.js`, los datos por actividad y la home de catálogo-primero descrita en [`PRODUCT-DESIGN.md`](PRODUCT-DESIGN.md); ejecuta [`scripts/check.js`](../../scripts/check.js), sube el `VERSION` en `sw.js` y despliega. | [`CLAUDE.md`](../../CLAUDE.md) · [`tecnico.md`](tecnico.md) |

> 💡 La persona usuaria final es siempre alguien que se beneficia de la
> lectura fácil, un ritmo sin presión y pantallas sin ruido — ver
> [`SPEC.md`](SPEC.md) §2. Las decisiones de contenido, lenguaje e
> interfaz se piensan siempre desde su experiencia. Lo que queda fuera
> de su participación son las decisiones puramente técnicas (el esquema
> de `localStorage`, el invariante del libro único, GitHub) — no por
> exclusión, sino porque es el ámbito de apoyo/construcción.

## Por dónde empezar, según tu perfil

| Si eres… | Empieza por… |
|---|---|
| 👤 Persona usuaria o familiar directo | La aplicación — no hace falta leer nada técnico |
| ❤️ Profesional de apoyo que configura el libro contable por primera vez | [`README.es.md`](../../README.es.md) (la sección "Preparar / Ampliar contenido") |
| ❤️ Persona de apoyo que reporta una categoría que falta o una redacción poco clara | [`CONTRIBUTING.es.md`](../../CONTRIBUTING.es.md) (la sección "Apoyo") |
| 🤔 Solo quiero entender qué es Okeymoney | [`README.es.md`](../../README.es.md) |
| 💻 Desarrollador/a | [`CLAUDE.md`](../../CLAUDE.md) · [`tecnico.md`](tecnico.md) · [`PRODUCT-DESIGN.md`](PRODUCT-DESIGN.md) |

## 🤝 Un proyecto pequeño y enfocado

A diferencia de un producto con varios equipos, Okeymoney es
deliberadamente pequeño: un libro contable compartido
(`okeymoney:data` + `okeymoney:practiceWallet`), un shell de PWA, sin
backend. El rol de **apoyo** suele solaparse con el de
**construcción** — la misma persona que configura el saldo para quien
aprende es también quien abre el PR — y eso es esperable. Los tres
roles se documentan por separado para que quien se incorpore al
proyecto sepa qué se espera de cada perfil, no porque tengan que
hacerlo tres personas distintas.
