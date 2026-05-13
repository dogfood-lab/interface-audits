<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.md">English</a>
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

## O que é isso

`interface-audits` é uma biblioteca de critérios de auditoria e das habilidades executáveis que os implementam. Cada auditoria detecta uma classe específica de falhas que afetam diretamente o usuário, que os scanners de acessibilidade genéricos não conseguem identificar. Os scanners detectam violações do WCAG; estas auditorias detectam interfaces que **passam nos scanners, mas ainda fazem com que os usuários tenham dificuldades**.

A primeira auditoria desta biblioteca é a **Carga Cognitiva**, que detecta situações em que a interface impõe uma carga excessiva na memória, na busca, na confiança, na verificação, na navegação, na configuração, na recuperação de dados, na decodificação visual, no tempo, na recuperação/desfazer ou na perda de funcionalidades.

Cada auditoria inclui quatro elementos:

1. **Critérios** — princípios, seções e regras de severidade ([`audits/cognitive-load/RUBRIC.md`](audits/cognitive-load/RUBRIC.md))
2. **Habilidade** — contrato e procedimento de execução ([`audits/cognitive-load/skill/SKILL.md`](audits/cognitive-load/skill/SKILL.md))
3. **Esquema** — Esquema JSON para resultados e relatórios ([`shared/schemas/`](shared/schemas/))
4. **Evidências** — pelo menos um teste de pressão concluído ou um teste interno ([`audits/cognitive-load/evidence/`](audits/cognitive-load/evidence/))

Sem evidências, não há auditoria oficial. Consulte [`shared/audit-lifecycle.md`](shared/audit-lifecycle.md) para o diagrama de estados.

## Instalação

A maioria dos usuários não "instala" este repositório; eles o leem. As auditorias são critérios e habilidades em formato Markdown, interpretados por [Claude](https://claude.ai) ou outro sistema de IA compatível, com as ferramentas MCP apropriadas (navegação no navegador, captura de tela, leitura do DOM).

Para os responsáveis pela manutenção que desejam executar as ferramentas de verificação local (validação de esquema, verificação de links, auditoria shipcheck):

```bash
git clone https://github.com/dogfood-lab/interface-audits.git
cd interface-audits
npm install        # installs ajv, ajv-formats, glob (dev-only)
npm run verify     # runs schema + link + shipcheck checks
```

**Requisitos:** Node 20+ para as ferramentas de verificação. As próprias auditorias são em Markdown, independentes da plataforma.

## Uso

### Executando uma auditoria

Execute através do Claude (ou um sistema compatível):

> Execute a auditoria de carga cognitiva em `<URL ou interface alvo>`

Consulte [`audits/cognitive-load/skill/SKILL.md`](audits/cognitive-load/skill/SKILL.md) para a lista completa de gatilhos, entradas, saídas e procedimentos.

### Analisando auditorias existentes

As auditorias anteriores estão localizadas em `audits/<nome>/evidence/<run-id>/` e consistem em três arquivos:

- `<auditoria>-findings.md` — resultados completos em formato de critérios
- `<auditoria>-scorecard.json` — resultado de cada seção (aprovado/alerta/falha) + resumo
- `remediation-priority-list.md` — resultados ordenados por severidade × impacto

As auditorias atuais e seus respectivos registros de evidências estão na tabela [Auditorias atuais](#current-audits) abaixo.

### Criando uma nova auditoria

Uma nova auditoria passa por cinco estados do ciclo de vida: Rascunho → Teste de pressão → Congelada → Teste interno → Revisada. Consulte [`shared/audit-lifecycle.md`](shared/audit-lifecycle.md) para o diagrama de estados, [`shared/pressure-test-protocol.md`](shared/pressure-test-protocol.md) para o procedimento e a auditoria de carga cognitiva em `audits/cognitive-load/` como um exemplo.

## Superfície de risco

Quando uma habilidade de auditoria é executada, o sistema (Claude com as ferramentas MCP apropriadas) realiza operações no alvo fornecido pelo usuário:

- **Saída da rede** — apenas para a URL de destino especificada pelo usuário. As funcionalidades não chamam outros serviços.
- **Captura de DOM e screenshots** — a funcionalidade pode ler o DOM da página, tirar screenshots e inspecionar classes CSS responsivas. O conteúdo capturado pode incluir qualquer coisa visível na sessão autenticada do usuário na URL de destino, incluindo nomes, corpos de mensagens e estado da conta.
- **Escrita de arquivos locais** — os arquivos de evidência são escritos no diretório `audits/<nome>/evidence/<id_da_execução>/` dentro da árvore de trabalho do repositório. As funcionalidades não escrevem fora deste escopo.
- **Nenhuma transmissão de evidências para fora** — os arquivos de evidência permanecem no disco local, a menos que o usuário os envie explicitamente.
- **Sem telemetria, sem tratamento de segredos** — este repositório não coleta análises e não lê credenciais.

Antes de enviar os arquivos de evidência para um repositório público, o usuário é responsável por revisar o que foi capturado. Consulte o arquivo [`SECURITY.md`](SECURITY.md) para o modelo de ameaças completo, a política de relatório de vulnerabilidades e o escopo.

## Auditorias atuais

| Auditoria | Estado | Detecções | Evidências |
|---|---|---|---|
| [cognitive-load](audits/cognitive-load/) | Versão 0.2 (congelada) + Testada internamente uma vez | Sobrecarga de processamento, complexidade oculta, ônus de confiança em IA, falha na mudança de estado | PT0 (claude.ai), PT1 (GitHub), PT2-doc-fallback (Outlook), Dogfood-1 (manual de pesquisa-os) |

## Família de auditorias

Cada auditoria deve declarar *qual problema esta auditoria detecta que os scanners genéricos não detectam?* Para Sobrecarga de Processamento, a resposta é sobrecarga de processamento.

Auditorias futuras nesta família podem incluir Visão Reduzida (acessibilidade visual sob densidade real), Tarefa de Leitor de Tela (continuidade da tarefa, não apenas validade ARIA), Dependência de Cores, Acesso Motor, Sensibilidade a Movimentos e Superfície de Confiança em IA. As auditorias são adicionadas uma a uma, com evidências, quando um alvo real justifica o trabalho — não por especulação.

## Estrutura do repositório

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

## O que isso não é

- Não é um scanner de conformidade com o WCAG (use [axe](https://www.deque.com/axe/), [Lighthouse](https://developer.chrome.com/docs/lighthouse), [Pa11y](https://pa11y.org/) para isso).
- Não é uma revisão de design visual.
- Não é uma lista de verificação genérica de acessibilidade.
- Não é um pacote npm publicado (ainda — o arquivo `package.json` declara `private: true` até que um pacote de execução seja separado).

As auditorias neste repositório são projetadas para serem executadas em interfaces que **passam nos scanners, mas ainda dificultam o uso para os usuários**.

## Contribuições

Este repositório é atualmente mantido por [dogfood-lab](https://github.com/dogfood-lab). Contribuições externas são bem-vindas — abra um problema primeiro para discutir qualquer nova auditoria ou alteração na rubrica. De acordo com o ciclo de vida: sem evidências, sem auditoria oficial.

## Licença

[MIT](LICENSE) — Copyright (c) 2026 dogfood-lab.

---

<p align="center">
  <em>Part of <a href="https://github.com/dogfood-lab">dogfood-lab</a> — sister to <a href="https://github.com/mcp-tool-shop-org">mcp-tool-shop-org</a>.</em>
</p>
