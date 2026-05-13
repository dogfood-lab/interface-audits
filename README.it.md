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

`interface-audits` è una libreria di linee guida per le verifiche e delle funzionalità che le eseguono. Ogni verifica individua una specifica tipologia di errore che si manifesta all'utente e che i normali strumenti di verifica dell'accessibilità non riescono a rilevare. Gli strumenti di verifica rilevano le violazioni delle linee guida WCAG; queste verifiche individuano le interfacce che **superano le verifiche, ma che comunque rendono difficile l'utilizzo da parte degli utenti**.

La prima verifica in questa libreria è **Carico Cognitivo**, che individua situazioni in cui l'interfaccia impone un carico eccessivo all'utente in termini di memoria, ricerca, fiducia, verifica, navigazione, configurazione, recupero dei dati, interpretazione visiva, tempo, possibilità di annullare azioni o perdita di funzionalità.

Ogni verifica include quattro elementi:

1. **Linee guida** — principi, sezioni, regole di gravità ([`audits/cognitive-load/RUBRIC.md`](audits/cognitive-load/RUBRIC.md))
2. **Funzionalità** — contratto e procedura di esecuzione ([`audits/cognitive-load/skill/SKILL.md`](audits/cognitive-load/skill/SKILL.md))
3. **Schema** — Schema JSON per i risultati e le valutazioni ([`shared/schemas/`](shared/schemas/))
4. **Prove** — almeno un test di carico completato o una sessione di test interni ([`audits/cognitive-load/evidence/`](audits/cognitive-load/evidence/))

Senza prove, non c'è una verifica ufficiale. Consultare [`shared/audit-lifecycle.md`](shared/audit-lifecycle.md) per lo stato della macchina a stati.

## Installazione

La maggior parte degli utenti non "installa" questo repository, ma lo consulta. Le verifiche sono linee guida e funzionalità in formato Markdown, interpretate da [Claude](https://claude.ai) o da un altro sistema di intelligenza artificiale compatibile, dotato degli strumenti MCP appropriati (navigazione web, acquisizione di schermate, lettura del DOM).

Per gli sviluppatori che desiderano eseguire gli strumenti di verifica locali (validazione dello schema, controlli dei link, verifica di integrazione):

```bash
git clone https://github.com/dogfood-lab/interface-audits.git
cd interface-audits
npm install        # installs ajv, ajv-formats, glob (dev-only)
npm run verify     # runs schema + link + shipcheck checks
```

**Requisiti:** Node 20+ per gli strumenti di verifica. Le verifiche stesse sono in formato Markdown, indipendenti dalla piattaforma.

## Utilizzo

### Esecuzione di una verifica

Eseguire la verifica tramite Claude (o un sistema compatibile):

> Esegui la verifica del carico cognitivo su `<URL o sezione di destinazione>`

Consultare [`audits/cognitive-load/skill/SKILL.md`](audits/cognitive-load/skill/SKILL.md) per l'elenco completo dei trigger, degli input, degli output e della procedura.

### Consultazione delle verifiche esistenti

Le esecuzioni delle verifiche precedenti si trovano nella directory `audits/<nome>/evidence/<id_esecuzione>/` e sono composte da tre file:

- `<nome_verifica>-findings.md` — risultati completi in formato di linee guida
- `<nome_verifica>-scorecard.json` — valutazione per sezione (superato/avvertimento/fallito) + riepilogo
- `remediation-priority-list.md` — risultati ordinati per gravità moltiplicata per l'impatto

Le verifiche attuali e le relative prove sono elencate nella tabella "Verifiche attuali" sottostante.

### Creazione di una nuova verifica

Una nuova verifica attraversa cinque stati del ciclo di vita: Bozza → Testata con carico → Congelata → Test interna → Revisionata. Consultare [`shared/audit-lifecycle.md`](shared/audit-lifecycle.md) per lo stato della macchina a stati, [`shared/pressure-test-protocol.md`](shared/pressure-test-protocol.md) per la procedura e la verifica del carico cognitivo in `audits/cognitive-load/` come esempio.

## Superficie di rischio

Quando viene eseguita una funzionalità di verifica, il sistema (Claude con gli strumenti MCP appropriati) esegue operazioni sull'elemento di destinazione fornito dall'utente:

- **Uscita di rete:** solo verso l'URL di destinazione specificato dall'utente. Le funzionalità non chiamano altri servizi.
- **Acquisizione del DOM e screenshot:** la funzionalità può leggere il DOM della pagina, acquisire screenshot e analizzare le classi CSS responsive. Il contenuto acquisito può includere qualsiasi elemento visibile durante la sessione autenticata dell'utente all'URL di destinazione, inclusi nomi, corpi dei messaggi e stato dell'account.
- **Scrittura di file locali:** i file di evidenza vengono scritti nella directory `audits/<nome>/evidence/<id_esecuzione>/` all'interno dell'albero di lavoro del repository. Le funzionalità non scrivono al di fuori di questo ambito.
- **Nessuna trasmissione in uscita dei dati:** i file di evidenza rimangono sul disco locale a meno che l'utente non li committi e li pubblichi esplicitamente.
- **Nessuna telemetria, nessuna gestione di segreti:** questo repository non raccoglie dati analitici e non legge credenziali.

Prima di commettere i file di evidenza in un repository pubblico, l'utente è responsabile della revisione di ciò che è stato acquisito. Consultare il file [`SECURITY.md`](SECURITY.md) per il modello di minacce completo, la politica di segnalazione delle vulnerabilità e l'ambito.

## Audit correnti

| Audit | Stato | Problemi rilevati | Evidenze |
|---|---|---|---|
| [cognitive-load](audits/cognitive-load/) | Versione stabile v0.2 + test interni | Carico cognitivo, complessità nascosta, onere di fiducia nell'IA, errore di transizione di stato | PT0 (claude.ai), PT1 (GitHub), PT2-doc-fallback (Outlook), Dogfood-1 (manuale di research-os) |

## Famiglia di audit

Ogni audit deve dichiarare *quale problema risolve questo audit che i normali scanner non rilevano?* Per il carico cognitivo, la risposta è il carico aggiuntivo.

I futuri audit in questa famiglia potrebbero includere: accessibilità per persone con problemi di vista (accesso visivo in condizioni di densità reale), attività per lettori di schermo (continuità delle attività, non solo validità ARIA), dipendenza dal colore, accesso per persone con disabilità motorie, sensibilità al movimento e superficie di fiducia nell'IA. Gli audit vengono aggiunti uno alla volta, con evidenze, quando un target reale giustifica il lavoro, e non per speculazione.

## Struttura del repository

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

## Cosa questo non è

- Non è uno scanner di conformità WCAG (utilizzare [axe](https://www.deque.com/axe/), [Lighthouse](https://developer.chrome.com/docs/lighthouse), [Pa11y](https://pa11y.org/) per questo).
- Non è una revisione del design visivo.
- Non è una checklist generica di accessibilità.
- Non è un pacchetto npm pubblicato (ancora: il file `package.json` dichiara `private: true` fino a quando non verrà creato un pacchetto di esecuzione).

Gli audit in questo repository sono progettati per essere eseguiti su interfacce che **superano i controlli automatici ma che comunque rendono difficile l'utilizzo da parte degli utenti**.

## Contributi

Questo repository è attualmente mantenuto da [dogfood-lab](https://github.com/dogfood-lab). Sono benvenuti contributi esterni: aprire prima un'issue per discutere eventuali nuovi audit o modifiche alle linee guida. Come previsto dal ciclo di vita: nessuna evidenza, nessun audit ufficiale.

## Licenza

[MIT](LICENSE) — Copyright (c) 2026 dogfood-lab.

---

<p align="center">
  <em>Part of <a href="https://github.com/dogfood-lab">dogfood-lab</a> — sister to <a href="https://github.com/mcp-tool-shop-org">mcp-tool-shop-org</a>.</em>
</p>
