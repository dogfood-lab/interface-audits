<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.md">English</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português (BR)</a>
</p>

<p align="center">
  <img src="./.brand/readme.png" alt="interface-audits — Reduce the Burden. Improve the Experience." width="400">
</p>

<p align="center">
  <a href="https://github.com/dogfood-lab/interface-audits/actions/workflows/verify.yml"><img src="https://github.com/dogfood-lab/interface-audits/actions/workflows/verify.yml/badge.svg" alt="verify"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT License"></a>
  <a href="https://dogfood-lab.github.io/interface-audits/"><img src="https://img.shields.io/badge/handbook-live-2da44e?logo=github" alt="Handbook"></a>
  <a href="./SHIP_GATE.md"><img src="https://img.shields.io/badge/shipcheck-passed-2da44e" alt="Shipcheck passed"></a>
</p>

<p align="center"><em>Proof-backed audits for human-facing product surfaces.</em></p>

---

## De qué se trata

`interface-audits` es una biblioteca de rúbricas de auditoría y las herramientas ejecutables que las implementan. Cada auditoría detecta una clase específica de fallos en la interfaz de usuario que los analizadores de accesibilidad genéricos no detectan. Los analizadores detectan las violaciones de WCAG; estas auditorías detectan las interfaces que **superan las pruebas de los analizadores, pero que aún así dificultan la tarea a los usuarios**.

La primera auditoría de esta biblioteca es **Carga cognitiva**, que detecta la redistribución de la carga: interfaces que trasladan la carga a la memoria, la búsqueda, la confianza, la verificación, la navegación, la configuración, la recuperación de la fuente, la decodificación visual, el tiempo, la recuperación/deshacer o la pérdida de funciones.

Cada auditoría incluye cuatro elementos:

1. **Rúbrica**: doctrina, secciones, reglas de gravedad ([`audits/cognitive-load/RUBRIC.md`](audits/cognitive-load/RUBRIC.md))
2. **Herramienta**: contrato de invocación y procedimiento ([`audits/cognitive-load/skill/SKILL.md`](audits/cognitive-load/skill/SKILL.md))
3. **Esquema**: esquema JSON para los resultados y las hojas de puntuación ([`shared/schemas/`](shared/schemas/))
4. **Evidencia**: al menos una prueba de estrés o ejecución de prueba completa ([`audits/cognitive-load/evidence/`](audits/cognitive-load/evidence/))

Sin evidencia, no hay auditoría oficial. Consulte [`shared/audit-lifecycle.md`](shared/audit-lifecycle.md) para ver el diagrama de estados y [`ROADMAP.md`](ROADMAP.md) para ver lo que está por venir.

## Instalación

La mayoría de los usuarios no "instalan" este repositorio; simplemente lo leen. Las auditorías son rúbricas y herramientas en formato Markdown que son interpretadas por [Claude](https://claude.ai) u otro motor de IA compatible con las herramientas MCP adecuadas (navegación del navegador, captura de pantalla, lectura del DOM).

Para los mantenedores que deseen ejecutar las herramientas de verificación locales (validación de esquemas, comprobación de enlaces, auditoría de envío):

```bash
git clone https://github.com/dogfood-lab/interface-audits.git
cd interface-audits
npm install        # installs ajv, ajv-formats, glob (dev-only)
npm run verify     # runs schema + link + shipcheck checks
```

**Requisitos:** Node 20+ para las herramientas de verificación. Las propias auditorías son independientes de la plataforma y están en formato Markdown.

## Uso

### Ejecución de una auditoría

Invocación a través de Claude (o un motor compatible):

> Ejecutar la auditoría de carga cognitiva en `<target-url-or-surface>`

Consulte [`audits/cognitive-load/skill/SKILL.md`](audits/cognitive-load/skill/SKILL.md) para obtener la lista completa de activadores, entradas, salidas y procedimientos.

### Lectura de auditorías existentes

Las ejecuciones de auditorías anteriores se encuentran en `audits/<name>/evidence/<run-id>/` y consisten en tres archivos:

- `<audit>-findings.md`: resultados completos en formato de rúbrica
- `<audit>-scorecard.json`: resultados por sección (superado/advertencia/fallo) + resumen
- `remediation-priority-list.md`: resultados ordenados por gravedad × impacto

Las auditorías actuales y sus registros de evidencia se encuentran en la tabla [Auditorías actuales](#current-audits) que se muestra a continuación.

### Creación de una nueva auditoría

Una nueva auditoría pasa por cinco estados del ciclo de vida: Borrador → Probada → Congelada → Probada en producción → Revisada. Consulte [`shared/audit-lifecycle.md`](shared/audit-lifecycle.md) para ver el diagrama de estados, [`shared/pressure-test-protocol.md`](shared/pressure-test-protocol.md) para ver el procedimiento y la auditoría de carga cognitiva en `audits/cognitive-load/` como una implementación de referencia.

## Superficie de amenaza

Cuando se invoca una herramienta de auditoría, el motor (Claude con las herramientas MCP adecuadas) realiza operaciones en el objetivo proporcionado por el usuario:

- **Salida de red**: solo a la URL de destino que especificó el usuario. Las herramientas no llaman a otros servicios.
- **Captura del DOM y de la captura de pantalla**: la herramienta puede leer el DOM de la página, tomar capturas de pantalla e inspeccionar las clases CSS responsivas. El contenido capturado puede incluir cualquier cosa visible en la sesión autenticada del usuario en la URL de destino, incluidos los nombres, el cuerpo de los mensajes y el estado de la cuenta.
- **Escritura de archivos locales**: los archivos de evidencia se escriben en `audits/<name>/evidence/<run-id>/` dentro del árbol de trabajo del repositorio. Las herramientas no escriben fuera de este ámbito.
- **No hay transmisión de evidencia saliente**: los archivos de evidencia permanecen en el disco local a menos que el usuario los confirme y los envíe explícitamente.
- **No hay telemetría, no hay gestión de secretos**: este repositorio no recopila datos analíticos ni lee credenciales.

Antes de confirmar los archivos de evidencia en un repositorio público, el usuario es responsable de revisar lo que se ha capturado. Consulte [`SECURITY.md`](SECURITY.md) para obtener el modelo de amenazas completo, la política de informes de vulnerabilidades y el alcance.

## Auditorías actuales

| Auditoría | Estado | Detecta | Evidencia |
|---|---|---|---|
| [cognitive-load](audits/cognitive-load/) | Congelada v0.2 + Probada una vez en producción | Redistribución de la carga, complejidad oculta, carga de confianza en la IA, fallo de cambio de estado | PT0 (claude.ai), PT1 (GitHub), PT2-doc-fallback (Outlook), Dogfood-1 (manual de investigación) |
| [low-vision](audits/low-vision/) | Probada v0.1.0 | Acceso visual en condiciones de densidad real (zoom/reflujo, contraste en fotos y gráficos, enfoque en temas personalizados, orientación espacial) | PT0 (documentación de MDN ARIA): 10 resultados, 2C/4H, se detectaron 4 de 4 patrones de fallo graves |
| [screen-reader-task](audits/screen-reader-task/) | Probada v0.1.0 | Continuidad y finalización de las tareas a través de un lector de pantalla: no solo la validez de ARIA | PT0 (react.dev/learn): 13 resultados, 2C/5H, se detectaron 3 de 4 patrones de fallo graves |
| [color-dependence](audits/color-dependence/) | Probada v0.1.0 | Significado transmitido únicamente por el color, incluido el límite de contraste-superado/tono-fallido | PT0 (Microsoft/vscode GitHub Actions): 10 resultados, 1C/4H, se detectaron 3 de 5 patrones de fallo graves |
| [motor-access](audits/motor-access/) | Probada v0.1.0 | Coste de interacción para usuarios con movilidad reducida (ruta de teclado, tamaño del objetivo, dependencia del arrastre, tiempo de espera, deshacer) | PT0 (sistema de diseño de GOV.UK, patrón de varios pasos): 8 resultados + 12 observaciones positivas, 0C/2H |

## Familia de auditorías

Cada auditoría debe declarar *¿qué carga detecta esta auditoría que los analizadores genéricos no detectan?* Para la carga cognitiva, la respuesta es la redistribución de la carga.

### Borradores en curso (creados el 2 de junio de 2026, aún no probados)

Hay cuatro borradores de auditorías en el repositorio, cada uno con la estructura completa de cuatro elementos (rúbrica + habilidad + esquema + lista corta de candidatos para PT0), pero sin las pruebas. Según el ciclo de vida, no se incluyen en la tabla de *auditorías actuales* hasta que tengan al menos una prueba de validación. Consulte el archivo CHANGELOG de cada auditoría para ver el historial de mejoras específicas de cada auditoría (las citas fueron verificadas por un oráculo de recuperación en fuentes de arXiv/DOI/W3C; se corrigió un DOI falso y varias atribuciones incorrectas antes de la confirmación).

| Borrador de auditoría | Prefijo | Detecta |
|---|---|---|
| [low-vision](audits/low-vision/) | `LV` | Acceso visual con densidad real: zoom y ajuste automático, contraste en fotos y gráficos, visibilidad del enfoque con temas personalizados, orientación espacial con aumento. |
| [screen-reader-task](audits/screen-reader-task/) | `SR` | *Finalización* de la tarea mediante un lector de pantalla, no solo validación de ARIA. |
| [color-dependence](audits/color-dependence/) | `CD` | Significado transmitido únicamente por el color, incluido el límite de contraste/tono que los escáneres no pueden detectar. |
| [motor-access](audits/motor-access/) | `MA` | Costo de interacción para usuarios con discapacidades motoras: ruta del teclado, precisión del objetivo, dependencia del arrastre, presión de tiempo de espera, función de deshacer. |

### Auditorías futuras (aún no creadas)

Sensibilidad al movimiento (disparadores vestibulares, `prefers-reduced-motion`) y superficie de confianza de la IA (confianza forzada, comportamiento opaco de la IA, procedencia) siguen estando en la [HOJA DE RUTA](ROADMAP.md). Las auditorías se añaden una a la vez, con pruebas, cuando un objetivo real justifica el trabajo, no por especulación.

## Estructura del repositorio

```
interface-audits/
├── README.md
├── CHANGELOG.md                       # monorepo events
├── ROADMAP.md                         # forward plan: audits, tooling, process rules
├── SECURITY.md                        # threat surface + reporting
├── SHIP_GATE.md                       # shipcheck quality gate
├── SCORECARD.md                       # pre/post-treatment scores
├── LICENSE                            # MIT
├── package.json                       # verify tooling + Node engines
├── verify.sh                          # one-command verification
├── scripts/
│   ├── verify-schemas.mjs             # JSON Schema validation
│   └── verify-links.mjs               # markdown relative-link check
├── shared/                            # cross-audit norms
│   ├── audit-lifecycle.md
│   ├── evidence-states.md
│   ├── severity-model.md
│   ├── finding-format.md
│   ├── pressure-test-protocol.md
│   └── schemas/
│       ├── finding.base.schema.json
│       └── scorecard.base.schema.json
└── audits/
    └── cognitive-load/                # first audit
        ├── README.md
        ├── RUBRIC.md
        ├── CHANGELOG.md
        ├── skill/SKILL.md
        ├── schemas/finding.extensions.json
        └── evidence/                  # pressure tests + dogfood runs
```

## Esto no es

- No es un escáner de conformidad con WCAG (utilice [axe](https://www.deque.com/axe/), [Lighthouse](https://developer.chrome.com/docs/lighthouse), [Pa11y](https://pa11y.org/) para ello).
- No es una revisión del diseño visual.
- No es una lista de verificación de accesibilidad genérica.
- No es un paquete npm publicado (todavía; el archivo `package.json` declara `private: true` hasta que se separe un paquete de ejecución).

Las auditorías de este repositorio están diseñadas para aplicarse a interfaces que **superan los escáneres, pero que aún obligan a los usuarios a buscar**.

## Contribuciones

Actualmente, este repositorio es mantenido por [dogfood-lab](https://github.com/dogfood-lab). Se aceptan contribuciones externas; primero, abra un problema para discutir cualquier nueva auditoría o cambio en la rúbrica. Según el ciclo de vida: sin pruebas, no hay auditoría oficial.

## Licencia

[MIT](LICENSE) — Copyright (c) 2026 dogfood-lab.

---

<p align="center">
  <em>Part of <a href="https://github.com/dogfood-lab">dogfood-lab</a> — sister to <a href="https://github.com/mcp-tool-shop-org">mcp-tool-shop-org</a>.</em>
</p>
