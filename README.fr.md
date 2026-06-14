<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.md">English</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português (BR)</a>
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

## De quoi il s'agit

`interface-audits` est une bibliothèque de critères d'audit et des outils exécutables qui les mettent en œuvre. Chaque audit détecte un type spécifique de problème rencontré par les utilisateurs, que les analyseurs d'accessibilité génériques ne parviennent pas à identifier. Les analyseurs détectent les violations du WCAG ; ces audits détectent les interfaces qui **passent les tests des analyseurs mais qui restent difficiles à utiliser**.

Le premier audit de cette bibliothèque est **Charge cognitive**, qui détecte le déplacement de la charge : les interfaces qui transfèrent une partie de la charge sur la mémoire, la recherche, la confiance, la vérification, la navigation, la configuration, la récupération des sources, le décodage visuel, le temps, la restauration/annulation ou la perte de fonctionnalités.

Chaque audit comprend quatre éléments :

1. **Critères** — principes, sections, règles de gravité ([`audits/cognitive-load/RUBRIC.md`](audits/cognitive-load/RUBRIC.md))
2. **Outil** — contrat d'invocation et procédure ([`audits/cognitive-load/skill/SKILL.md`](audits/cognitive-load/skill/SKILL.md))
3. **Schéma** — schéma JSON pour les résultats et les tableaux de bord ([`shared/schemas/`](shared/schemas/))
4. **Preuves** — au moins un test sous pression ou une phase de test utilisateur réussie ([`audits/cognitive-load/evidence/`](audits/cognitive-load/evidence/))

Sans preuves, il n'y a pas d'audit officiel. Consultez [`shared/audit-lifecycle.md`](shared/audit-lifecycle.md) pour connaître le diagramme d'état et [`ROADMAP.md`](ROADMAP.md) pour savoir ce qui est prévu ensuite.

## Installation

La plupart des utilisateurs n'« installent » pas ce dépôt ; ils le consultent. Les audits sont des critères et des outils présentés au format Markdown, interprétés par [Claude](https://claude.ai) ou un autre outil d'IA compatible doté des outils MCP appropriés (navigation dans le navigateur, capture d'écran, lecture du DOM).

Pour les responsables qui souhaitent exécuter les outils de vérification locaux (validation du schéma, vérification des liens, audit shipcheck) :

```bash
git clone https://github.com/dogfood-lab/interface-audits.git
cd interface-audits
npm install        # installs ajv, ajv-formats, glob (dev-only)
npm run verify     # runs schema + link + shipcheck checks
```

**Prérequis :** Node 20+ pour les outils de vérification. Les audits eux-mêmes sont indépendants de la plateforme et au format Markdown.

## Utilisation

### Exécution d'un audit

Invoquer via Claude (ou un outil compatible) :

> Exécuter l’audit de charge cognitive sur `<target-url-or-surface>`

Consultez [`audits/cognitive-load/skill/SKILL.md`](audits/cognitive-load/skill/SKILL.md) pour obtenir la liste complète des déclencheurs, des entrées, des sorties et de la procédure.

### Consultation des audits existants

Les exécutions d'audit précédentes se trouvent dans `audits/<name>/evidence/<run-id>/` et consistent en trois fichiers :

- `<audit>-findings.md` — résultats complets au format des critères
- `<audit>-scorecard.json` — nombre de sections réussies/avec avertissement/échouées + résumé
- `remediation-priority-list.md` — résultats classés par gravité × impact

Les audits actuels et leurs preuves sont présentés dans le tableau [Audits actuels](#current-audits) ci-dessous.

### Création d’un nouvel audit

Un nouvel audit passe par cinq états de cycle de vie : Brouillon → Testé sous pression → Figé → Testé en conditions réelles → Révisé. Consultez [`shared/audit-lifecycle.md`](shared/audit-lifecycle.md) pour connaître le diagramme d’état, [`shared/pressure-test-protocol.md`](shared/pressure-test-protocol.md) pour la procédure et l’audit de charge cognitive à `audits/cognitive-load/` comme exemple.

## Surface de menace

Lorsqu'un outil d'audit est invoqué, l'outil (Claude avec les outils MCP appropriés) effectue des opérations sur la cible fournie par l'utilisateur :

- **Échange réseau** — uniquement vers l’URL cible spécifiée par l’utilisateur. Les outils n’appellent pas d’autres services.
- **Capture du DOM et de captures d’écran** — l’outil peut lire le DOM de la page, prendre des captures d’écran et inspecter les classes CSS réactives. Le contenu capturé peut inclure tout ce qui est visible dans la session authentifiée de l’utilisateur sur l’URL cible, y compris les noms, le corps des messages et l’état du compte.
- **Écriture de fichiers locaux** — les fichiers de preuve sont écrits dans `audits/<name>/evidence/<run-id>/` dans l’arborescence de travail du dépôt uniquement. Les outils n’écrivent pas en dehors de cette portée.
- **Aucune transmission externe des preuves** — les fichiers de preuve restent sur le disque local, sauf si l’utilisateur les valide et les publie explicitement.
- **Pas de télémétrie, pas de gestion des secrets** — ce dépôt ne collecte aucune donnée analytique et ne lit aucun identifiant.

Avant de valider les fichiers de preuve dans un référentiel public, l’utilisateur est responsable de la vérification du contenu capturé. Consultez [`SECURITY.md`](SECURITY.md) pour obtenir le modèle de menace complet, la politique de signalement des vulnérabilités et la portée.

## Audits actuels

| Audit | État | Détecte | Preuves |
|---|---|---|---|
| [cognitive-load](audits/cognitive-load/) | Version 0.2 gelée + testé une fois en conditions réelles | Déplacement de la charge, complexité cachée, fardeau de confiance dans l’IA, échec du changement d’état | PT0 (claude.ai), PT1 (GitHub), PT2-doc-fallback (Outlook), Test utilisateur 1 (manuel de recherche) |
| [low-vision](audits/low-vision/) | Testé sous pression v0.1.0 | Accès visuel dans des conditions de densité réelles (zoom/redimensionnement, contraste sur les photos et les graphiques, focus avec des thèmes personnalisés, orientation spatiale) | PT0 (documents MDN ARIA) — 10 résultats, 2C/4H, a détecté 4 des 4 modèles d’échec critiques |
| [screen-reader-task](audits/screen-reader-task/) | Testé sous pression v0.1.0 | Continuité et achèvement des tâches à l’aide d’un lecteur d’écran — pas seulement la validité de l’ARIA | PT0 (react.dev/learn) — 13 résultats, 2C/5H, a détecté 3 des 4 modèles d’échec critiques |
| [color-dependence](audits/color-dependence/) | Testé sous pression v0.1.0 | Signification véhiculée uniquement par la couleur, y compris la limite entre le contraste acceptable et l’échec de la teinte | PT0 (actions GitHub de microsoft/vscode) — 10 résultats, 1C/4H, a détecté 3 des 5 modèles d’échec critiques |
| [motor-access](audits/motor-access/) | Testé sous pression v0.1.0 | Coût d’interaction pour les utilisateurs ayant une déficience motrice (parcours au clavier, taille de la cible, dépendance du glissement, délai d’attente, annulation) | PT0 (modèle en plusieurs étapes du système de conception GOV.UK) — 8 résultats + 12 observations positives, 0C/2H |
| [ai-trust-surface](audits/ai-trust-surface/) | Testé sous pression v0.1.0 | Confiance forcée, comportement opaque de l’IA, pas de récupération des erreurs de l’IA, pas de traçabilité | PT0 (Bing SSR + documents sur la confiance dans l’IA) — 9 résultats (5H/4M), 4 observés, la section 7 a échoué lors d’une erreur reproductible |
| [motion-sensitivity](audits/motion-sensitivity/) | Testé sous pression v0.1.0 | Déclencheurs vestibulaires, respect de l’animation, préférence pour une animation moins rapide, seuils de sensibilité aux scintillements/crises d’épilepsie | PT0 (linear.app) — 3 résultats (1H/2L) + 4 observations positives, 0C |

## Famille d’audits

Chaque audit doit indiquer *quels problèmes cet audit permet de détecter que les outils d’analyse génériques ne détectent pas ?* Pour la charge cognitive, la réponse est le déplacement de la charge.

### Audits futurs (pas encore créés)

Les sept audits actuellement définis sont désormais disponibles dans le dépôt et ont été **testés en conditions réelles ou mieux** (voir *Audits actuels* ci-dessus) — aucun audit n’est en cours d’élaboration. Les deux plus récemment ajoutés, **AI Trust Surface** (`AT`) et **Motion Sensitivity** (`MO`), ont été créés par un groupe de chercheurs (recherche → vérification des citations externes → auteur) et testés de la même manière que les quatre précédents. Les audits suivants sont réalisés à la demande, et non sur une base spéculative — ils sont ajoutés un par un, avec des preuves, lorsqu’un objectif réel et une grille d’évaluation basée sur la recherche justifient le travail. Le [ROADMAP](ROADMAP.md) suit les candidats et l’avancement du cycle de vie (PT1 → Gel) pour les audits déjà présents.

## Structure du dépôt

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
└── audits/                            # one directory per audit; each has the same shape:
    │                                  #   README.md · RUBRIC.md · CHANGELOG.md ·
    │                                  #   skill/SKILL.md · schemas/finding.extensions.json · evidence/
    ├── cognitive-load/                # Frozen v0.2 + Dogfooded
    ├── low-vision/                    # Pressure-tested v0.1.0  (LV)
    ├── screen-reader-task/            # Pressure-tested v0.1.0  (SR)
    ├── color-dependence/              # Pressure-tested v0.1.0  (CD)
    ├── motor-access/                  # Pressure-tested v0.1.0  (MA)
    ├── ai-trust-surface/              # Pressure-tested v0.1.0  (AT)
    └── motion-sensitivity/            # Pressure-tested v0.1.0  (MO)
```

## Ce que ce n’est pas

- Ce n’est pas un outil d’analyse de conformité WCAG (utilisez [axe](https://www.deque.com/axe/), [Lighthouse](https://developer.chrome.com/docs/lighthouse), [Pa11y](https://pa11y.org/) à cette fin)
- Ce n’est pas une évaluation de la conception visuelle
- Ce n’est pas une liste de contrôle d’accessibilité générique
- Ce n’est pas un package npm publié (pour l’instant — `package.json` indique `private: true` jusqu’à ce qu’un package d’exécution soit créé)

Les audits dans ce dépôt sont conçus pour être appliqués aux interfaces qui **passent les tests des outils d’analyse, mais qui obligent toujours les utilisateurs à chercher**.

## Contribution

Ce dépôt est actuellement maintenu par [dogfood-lab](https://github.com/dogfood-lab). Les contributions externes sont les bienvenues — ouvrez d’abord un problème pour discuter de tout nouvel audit ou changement de grille d’évaluation. Conformément au cycle de vie : pas de preuves, pas d’audit officiel.

## Licence

[MIT](LICENSE) — Copyright (c) 2026 dogfood-lab.

---

<p align="center">
  <em>Part of <a href="https://github.com/dogfood-lab">dogfood-lab</a> — sister to <a href="https://github.com/mcp-tool-shop-org">mcp-tool-shop-org</a>.</em>
</p>
