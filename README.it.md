<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.md">English</a> | <a href="README.pt-BR.md">Português (BR)</a>
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

## Cos'è questo

`interface-audits` è una libreria di criteri di audit e delle funzionalità eseguibili che li implementano. Ogni audit individua una specifica categoria di problemi di usabilità che gli strumenti di accessibilità generici non rilevano. Gli strumenti di scansione rilevano le violazioni delle WCAG; questi audit rilevano le interfacce che **superano i controlli degli strumenti di scansione, ma che comunque rendono difficile l'utilizzo per gli utenti**.

Il primo audit in questa libreria è **Cognitive Load** (Carico cognitivo), che individua i problemi di sovraccarico cognitivo: interfacce che trasferiscono il carico sulla memoria, sulla ricerca, sulla fiducia, sulla verifica, sulla navigazione, sulla configurazione, sul recupero delle informazioni, sulla decodifica visiva, sul tempo, sul ripristino/annullamento o sulla perdita di funzionalità.

Ogni audit include quattro elementi:

1. **Criteri** — principi, sezioni, regole di gravità ([`audits/cognitive-load/RUBRIC.md`](audits/cognitive-load/RUBRIC.md))
2. **Funzionalità** — contratto di invocazione e procedura ([`audits/cognitive-load/skill/SKILL.md`](audits/cognitive-load/skill/SKILL.md))
3. **Schema** — schema JSON per i risultati e le schede di valutazione ([`shared/schemas/`](shared/schemas/))
4. **Evidenza** — almeno un test di pressione o una prova pratica completati ([`audits/cognitive-load/evidence/`](audits/cognitive-load/evidence/))

Senza evidenza, l'audit non è considerato ufficiale. Consultare [`shared/audit-lifecycle.md`](shared/audit-lifecycle.md) per la macchina a stati e [`ROADMAP.md`](ROADMAP.md) per le prossime novità.

## Installazione

La maggior parte degli utenti non "installa" questo repository, ma lo consulta. Gli audit sono criteri e funzionalità in formato Markdown, interpretati da [Claude](https://claude.ai) o da un altro motore di intelligenza artificiale compatibile, con gli strumenti MCP appropriati (navigazione nel browser, acquisizione di schermate, lettura del DOM).

Per gli sviluppatori che desiderano eseguire gli strumenti di verifica locali (validazione dello schema, controllo dei collegamenti, audit di verifica):

```bash
git clone https://github.com/dogfood-lab/interface-audits.git
cd interface-audits
npm install        # installs ajv, ajv-formats, glob (dev-only)
npm run verify     # runs schema + link + shipcheck checks
```

**Requisiti:** Node 20+ per gli strumenti di verifica. Gli audit stessi sono indipendenti dalla piattaforma e sono in formato Markdown.

## Utilizzo

### Esecuzione di un audit

Invocare tramite Claude (o un motore compatibile):

> Esegui l'audit "cognitive-load" su `<target-url-or-surface>`

Consultare [`audits/cognitive-load/skill/SKILL.md`](audits/cognitive-load/skill/SKILL.md) per l'elenco completo dei trigger, degli input, degli output e della procedura.

### Lettura degli audit esistenti

Le esecuzioni degli audit precedenti sono archiviate in `audits/<name>/evidence/<run-id>/` e consistono in tre file:

- `<audit>-findings.md` — risultati completi in formato criteri
- `<audit>-scorecard.json` — valutazione per sezione (superato/avviso/fallimento) + riepilogo
- `remediation-priority-list.md` — risultati ordinati per gravità × impatto

Gli audit correnti e le relative prove sono riportati nella tabella [Audit correnti](#current-audits) qui sotto.

### Creazione di un nuovo audit

Un nuovo audit passa attraverso cinque fasi del ciclo di vita: Bozza → Test di pressione → Congelato → Test pratico → Revisionato. Consultare [`shared/audit-lifecycle.md`](shared/audit-lifecycle.md) per la macchina a stati, [`shared/pressure-test-protocol.md`](shared/pressure-test-protocol.md) per la procedura e l'audit "cognitive-load" in `audits/cognitive-load/` come implementazione di riferimento.

## Superficie di rischio

Quando viene invocata una funzionalità di audit, il motore (Claude con gli strumenti MCP appropriati) esegue operazioni sull'elemento di destinazione fornito dall'utente:

- **Trasmissione di dati in uscita dalla rete** — solo verso l'URL di destinazione specificato dall'utente. Le funzionalità non chiamano altri servizi.
- **Acquisizione del DOM e di schermate** — la funzionalità può leggere il DOM della pagina, acquisire schermate e ispezionare le classi CSS responsive. Il contenuto acquisito può includere qualsiasi elemento visibile nella sessione autenticata dell'utente all'URL di destinazione, inclusi nomi, corpi dei messaggi e stato dell'account.
- **Scrittura di file locali** — i file di evidenza vengono scritti in `audits/<name>/evidence/<run-id>/` all'interno dell'albero di lavoro del repository. Le funzionalità non scrivono al di fuori di questo ambito.
- **Nessuna trasmissione di evidenza verso l'esterno** — i file di evidenza rimangono sul disco locale a meno che l'utente non li committa e li invia esplicitamente.
- **Nessun telemetria, nessuna gestione di segreti** — questo repository non raccoglie dati analitici e non legge credenziali.

Prima di committare i file di evidenza in un repository pubblico, l'utente è responsabile della revisione dei dati acquisiti. Consultare [`SECURITY.md`](SECURITY.md) per il modello di minaccia completo, le politiche di segnalazione delle vulnerabilità e l'ambito.

## Audit correnti

| Audit | Stato | Individua | Evidenza |
|---|---|---|---|
| [cognitive-load](audits/cognitive-load/) | Versione 0.2 congelata + test pratico eseguito una volta | Sovraccarico cognitivo, complessità nascosta, carico di fiducia nell'IA, errore di cambio di stato | PT0 (claude.ai), PT1 (GitHub), PT2-doc-fallback (Outlook), Test pratico-1 (manuale di ricerca) |
| [low-vision](audits/low-vision/) | Test di pressione versione 0.1.0 | Accesso visivo in condizioni di densità reale (zoom/riflusso, contrasto su foto e grafici, focus con temi personalizzati, orientamento spaziale) | PT0 (documentazione MDN ARIA) — 10 risultati, 2C/4H, ha individuato 4/4 modelli di errore critici |
| [screen-reader-task](audits/screen-reader-task/) | Test di pressione versione 0.1.0 | Continuità e completamento delle attività tramite un lettore di schermo — non solo validità ARIA | PT0 (react.dev/learn) — 13 risultati, 2C/5H, ha individuato 3/4 modelli di errore critici |
| [color-dependence](audits/color-dependence/) | Test di pressione versione 0.1.0 | Significato trasmesso esclusivamente tramite il colore, inclusa la soglia tra "contrasto sufficiente" e "fallimento del colore" | PT0 (Microsoft/vscode GitHub Actions) — 10 risultati, 1C/4H, ha individuato 3/5 modelli di errore critici |
| [motor-access](audits/motor-access/) | Test di pressione versione 0.1.0 | Costo di interazione per gli utenti con disabilità motorie (percorso della tastiera, dimensione del bersaglio, dipendenza dal trascinamento, timeout, annullamento) | PT0 (modello multi-step del sistema di progettazione GOV.UK) — 8 risultati + 12 osservazioni positive, 0C/2H |

## Famiglia di audit

Ogni audit deve dichiarare *quale tipo di problema individua questo audit che gli strumenti di scansione generici non rilevano?* Per il Cognitive Load, la risposta è il sovraccarico cognitivo.

### Bozze in corso di elaborazione (create il 2026-06-02, non ancora sottoposte a test di pressione)

Nel repository sono presenti quattro bozze di audit, ciascuna con la struttura completa (Rubrica + Competenza + Schema + elenco ristretto di candidati PT0), a cui manca però la parte relativa alle evidenze. In base al ciclo di vita, non sono elencate nella tabella *Audit in corso* fino a quando non hanno superato almeno un test di verifica. Consultare la sezione CHANGELOG di ciascun audit per visualizzare la cronologia delle modifiche (le citazioni sono state verificate tramite un sistema di recupero dati rispetto alle fonti arXiv/DOI/W3C; un DOI fabbricato e diverse attribuzioni errate sono state corrette prima del commit).

| Bozza di audit | Prefisso | Individua |
|---|---|---|
| [low-vision](audits/low-vision/) | `LV` | Accessibilità visiva in condizioni di densità reale: zoom e ridisposizione del contenuto, contrasto su foto e grafici, visibilità a fuoco con temi personalizzati, orientamento spaziale con ingrandimento |
| [screen-reader-task](audits/screen-reader-task/) | `SR` | Completamento di un compito tramite un lettore di schermo, non solo verifica della validità ARIA |
| [color-dependence](audits/color-dependence/) | `CD` | Significato comunicato esclusivamente tramite il colore, compresa la soglia di superamento/mancato superamento del contrasto che gli scanner non riescono a rilevare |
| [motor-access](audits/motor-access/) | `MA` | Costo dell’interazione per gli utenti con difficoltà motorie: percorso tramite tastiera, precisione del targeting, dipendenza dal trascinamento, pressione dei tempi limite, funzione di annullamento |

### Audit futuri (non ancora completati)

Sensibilità al movimento (stimoli vestibolari, `prefers-reduced-motion`) e livello di fiducia nell’IA (fiducia forzata, comportamento opaco dell’IA, provenienza) rimangono nella [ROADMAP](ROADMAP.md). Gli audit vengono aggiunti uno alla volta, con le relative evidenze, quando un obiettivo reale giustifica il lavoro, e non sulla base di mere speculazioni.

## Struttura del repository

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

## Cosa non è

- Non è uno scanner di conformità WCAG (utilizzare [axe](https://www.deque.com/axe/), [Lighthouse](https://developer.chrome.com/docs/lighthouse), [Pa11y](https://pa11y.org/) per questo)
- Non è una revisione del design visivo
- Non è una checklist di accessibilità generica
- Non è un pacchetto npm pubblicato (per ora: il file `package.json` dichiara `private: true` fino a quando non verrà creato un pacchetto eseguibile separato)

Gli audit presenti in questo repository sono progettati per essere applicati a interfacce che **superano i test degli scanner, ma che comunque costringono gli utenti a cercare**.

## Contributi

Questo repository è attualmente gestito da [dogfood-lab](https://github.com/dogfood-lab). Sono benvenuti contributi esterni: aprire prima una segnalazione per discutere eventuali nuove modifiche agli audit o alle rubriche. In base al ciclo di vita: senza evidenze, non è possibile effettuare un audit ufficiale.

## Licenza

[MIT](LICENSE) — Copyright (c) 2026 dogfood-lab.

---

<p align="center">
  <em>Part of <a href="https://github.com/dogfood-lab">dogfood-lab</a> — sister to <a href="https://github.com/mcp-tool-shop-org">mcp-tool-shop-org</a>.</em>
</p>
