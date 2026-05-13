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

## Qu'est-ce que c'est ?

`interface-audits` est une bibliothèque de grilles d'audit et des compétences exécutables qui les mettent en œuvre. Chaque audit détecte une catégorie spécifique de problèmes rencontrés par les utilisateurs que les outils d'accessibilité génériques ne détectent pas. Les outils d'analyse détectent les violations des directives WCAG ; ces audits détectent les interfaces qui **réussissent les analyses mais qui obligent toujours les utilisateurs à chercher et à tâtonner**.

Le premier audit de cette bibliothèque est **Charge cognitive**, qui détecte les situations où la charge est transférée : interfaces qui imposent une charge excessive en termes de mémoire, de recherche, de confiance, de vérification, de navigation, de configuration, de récupération de données, de décodage visuel, de temps, de correction/annulation ou de perte de fonctionnalités.

Chaque audit comprend quatre éléments :

1. **Grille d'évaluation** — principes, sections, règles de gravité ([`audits/cognitive-load/RUBRIC.md`](audits/cognitive-load/RUBRIC.md))
2. **Compétence** — contrat d'invocation et procédure ([`audits/cognitive-load/skill/SKILL.md`](audits/cognitive-load/skill/SKILL.md))
3. **Schéma** — Schéma JSON pour les résultats et les tableaux de bord ([`shared/schemas/`](shared/schemas/))
4. **Preuves** — au moins un test de charge complet ou une phase de test utilisateur ([`audits/cognitive-load/evidence/`](audits/cognitive-load/evidence/))

Sans preuve, il n'y a pas d'audit officiel. Consultez [`shared/audit-lifecycle.md`](shared/audit-lifecycle.md) pour l'état de la machine.

## Installation

La plupart des utilisateurs ne "installent" pas ce dépôt ; ils le consultent. Les audits sont des grilles d'évaluation et des compétences en Markdown interprétées par [Claude](https://claude.ai) ou un autre outil d'IA compatible, avec les outils MCP appropriés (navigation dans le navigateur, capture d'écran, lecture du DOM).

Pour les responsables de la maintenance qui souhaitent exécuter les outils de vérification locaux (validation du schéma, vérification des liens, audit shipcheck) :

```bash
git clone https://github.com/dogfood-lab/interface-audits.git
cd interface-audits
npm install        # installs ajv, ajv-formats, glob (dev-only)
npm run verify     # runs schema + link + shipcheck checks
```

**Prérequis :** Node 20+ pour les outils de vérification. Les audits eux-mêmes sont en Markdown, ce qui les rend indépendants de la plateforme.

## Utilisation

### Exécution d'un audit

Exécutez l'audit via Claude (ou un outil compatible) :

> Exécutez l'audit de charge cognitive sur `<URL ou interface cible>`

Consultez [`audits/cognitive-load/skill/SKILL.md`](audits/cognitive-load/skill/SKILL.md) pour la liste complète des déclencheurs, les entrées, les sorties et la procédure.

### Consultation des audits existants

Les exécutions d'audit précédentes se trouvent dans le répertoire `audits/<nom>/evidence/<run-id>/` et consistent en trois fichiers :

- `<audit>-findings.md` — résultats complets au format de la grille d'évaluation
- `<audit>-scorecard.json` — évaluation par section (réussi/avertissement/échec) + résumé
- `remediation-priority-list.md` — résultats classés par gravité × impact

Les audits actuels et leurs preuves correspondantes se trouvent dans le tableau [Audits actuels](#current-audits) ci-dessous.

### Création d'un nouvel audit

Un nouvel audit passe par cinq états du cycle de vie : Brouillon → Testé en charge → Figé → Test utilisateur → Révisé. Consultez [`shared/audit-lifecycle.md`](shared/audit-lifecycle.md) pour l'état de la machine, [`shared/pressure-test-protocol.md`](shared/pressure-test-protocol.md) pour la procédure, et l'audit de charge cognitive situé dans `audits/cognitive-load/` comme exemple.

## Surface d'attaque

Lorsqu'une compétence d'audit est invoquée, l'exécuteur (Claude avec les outils MCP appropriés) effectue des opérations sur la cible fournie par l'utilisateur :

- **Sortie réseau** : uniquement vers l'URL cible spécifiée par l'utilisateur. Les modules ne font appel à aucun autre service.
- **Capture du DOM et des captures d'écran** : le module peut lire le DOM de la page, prendre des captures d'écran et examiner les classes CSS réactives. Le contenu capturé peut inclure tout ce qui est visible lors de la session authentifiée de l'utilisateur à l'URL cible, y compris les noms, le contenu des messages et l'état du compte.
- **Écriture de fichiers locaux** : les fichiers de preuve sont écrits dans le répertoire `audits/<nom>/evidence/<run-id>/` de l'arborescence de travail du dépôt. Les modules n'écrivent rien en dehors de cette portée.
- **Aucune transmission de données de preuve vers l'extérieur** : les fichiers de preuve restent sur le disque local, sauf si l'utilisateur les valide et les envoie explicitement.
- **Aucune télémétrie, aucune gestion de secrets** : ce dépôt ne collecte aucune donnée analytique et ne lit aucune information d'identification.

Avant de valider les fichiers de preuve dans un dépôt public, l'utilisateur est responsable de vérifier ce qui a été capturé. Consultez le fichier [`SECURITY.md`](SECURITY.md) pour connaître le modèle de menace complet, la politique de signalement des vulnérabilités et la portée.

## Audits en cours

| Audit | État | Problèmes détectés | Données de preuve |
|---|---|---|---|
| [cognitive-load](audits/cognitive-load/) | Version stable v0.2 + testé en interne une fois | Charge cognitive, complexité cachée, charge de confiance liée à l'IA, échec de transition d'état | PT0 (claude.ai), PT1 (GitHub), PT2-doc-fallback (Outlook), Dogfood-1 (manuel de recherche-os) |

## Famille d'audits

Chaque audit doit déclarer *quel problème cet audit détecte que les scanners génériques ne détectent pas ?* Pour la charge cognitive, la réponse est la surcharge cognitive.

Les audits futurs de cette famille pourraient inclure les thèmes suivants : accessibilité pour les personnes malvoyantes (accès visuel avec une densité réelle), tâches pour lecteurs d'écran (continuité des tâches, et non seulement la validité ARIA), dépendance aux couleurs, accessibilité pour les personnes à mobilité réduite, sensibilité au mouvement et surface de confiance de l'IA. Les audits sont ajoutés un par un, avec des données de preuve, lorsqu'une cible réelle justifie le travail, et non par simple spéculation.

## Structure du dépôt

```
interface-audits/
├── README.md
├── CHANGELOG.md                       # monorepo events
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

## Ce que ce n'est pas

- Ce n'est pas un scanner de conformité WCAG (utilisez [axe](https://www.deque.com/axe/), [Lighthouse](https://developer.chrome.com/docs/lighthouse), [Pa11y](https://pa11y.org/) pour cela).
- Ce n'est pas une revue de conception visuelle.
- Ce n'est pas une liste de contrôle d'accessibilité générique.
- Ce n'est pas un paquet npm publié (pour l'instant : le fichier `package.json` déclare `private: true` jusqu'à ce qu'un paquet d'exécution soit créé).

Les audits de ce dépôt sont conçus pour être exécutés sur des interfaces qui **réussissent les analyses mais qui obligent toujours les utilisateurs à faire des efforts**.

## Contributions

Ce dépôt est actuellement maintenu par [dogfood-lab](https://github.com/dogfood-lab). Les contributions externes sont les bienvenues : ouvrez d'abord un problème pour discuter de tout nouvel audit ou modification de la grille d'évaluation. Conformément au cycle de vie : sans données de preuve, pas d'audit officiel.

## Licence

[MIT](LICENSE) — Copyright (c) 2026 dogfood-lab.

---

<p align="center">
  <em>Part of <a href="https://github.com/dogfood-lab">dogfood-lab</a> — sister to <a href="https://github.com/mcp-tool-shop-org">mcp-tool-shop-org</a>.</em>
</p>
