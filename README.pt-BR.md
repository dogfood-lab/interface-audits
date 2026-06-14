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

`interface-audits` é uma biblioteca de critérios de auditoria e as ferramentas executáveis que os aplicam. Cada auditoria identifica uma classe específica de falhas na interface do usuário que os verificadores de acessibilidade genéricos não detectam. Os verificadores detectam violações do WCAG; estas auditorias detectam interfaces que **passam nos verificadores, mas ainda assim dificultam a vida dos usuários**.

A primeira auditoria nesta biblioteca é **Carga Cognitiva**, que detecta o deslocamento da carga: interfaces que transferem o fardo para a memória, pesquisa, confiança, verificação, navegação, configuração, recuperação da fonte, decodificação visual, tempo, recuperação/desfazer ou perda de recursos.

Cada auditoria inclui quatro elementos:

1. **Critérios** — doutrina, seções, regras de severidade ([`audits/cognitive-load/RUBRIC.md`](audits/cognitive-load/RUBRIC.md))
2. **Ferramenta** — contrato de invocação e procedimento ([`audits/cognitive-load/skill/SKILL.md`](audits/cognitive-load/skill/SKILL.md))
3. **Esquema** — Esquema JSON para os resultados e painéis de controle ([`shared/schemas/`](shared/schemas/))
4. **Evidências** — pelo menos um teste de pressão ou execução em ambiente de teste concluído ([`audits/cognitive-load/evidence/`](audits/cognitive-load/evidence/))

Sem evidências, não há auditoria oficial. Consulte [`shared/audit-lifecycle.md`](shared/audit-lifecycle.md) para o diagrama de estados e [`ROADMAP.md`](ROADMAP.md) para o que está por vir.

## Instalação

A maioria dos usuários não "instala" este repositório — eles o leem. As auditorias são critérios em formato Markdown e ferramentas interpretadas por [Claude](https://claude.ai) ou outro executor de IA compatível com as ferramentas MCP apropriadas (navegação no navegador, captura de tela, leitura do DOM).

Para os responsáveis que desejam executar as ferramentas de verificação local (validação de esquema, verificação de links, auditoria de envio):

```bash
git clone https://github.com/dogfood-lab/interface-audits.git
cd interface-audits
npm install        # installs ajv, ajv-formats, glob (dev-only)
npm run verify     # runs schema + link + shipcheck checks
```

**Requisitos:** Node 20+ para as ferramentas de verificação. As próprias auditorias são independentes da plataforma e estão em formato Markdown.

## Uso

### Executando uma auditoria

Invocar através do Claude (ou um executor compatível):

> Executar a auditoria de carga cognitiva em `<target-url-or-surface>`

Consulte [`audits/cognitive-load/skill/SKILL.md`](audits/cognitive-load/skill/SKILL.md) para a lista completa de gatilhos, entradas, saídas e procedimento.

### Lendo auditorias existentes

As execuções de auditoria anteriores estão localizadas em `audits/<name>/evidence/<run-id>/` e consistem em três arquivos:

- `<audit>-findings.md` — resultados completos no formato de critérios
- `<audit>-scorecard.json` — resultados por seção (passou/alerta/falhou) + resumo
- `remediation-priority-list.md` — resultados ordenados por severidade × impacto

As auditorias atuais e seus registros de evidências estão na tabela [Auditorias atuais](#current-audits) abaixo.

### Criando uma nova auditoria

Uma nova auditoria passa por cinco estados do ciclo de vida: Rascunho → Teste de pressão → Congelada → Testada em ambiente de teste → Revisada. Consulte [`shared/audit-lifecycle.md`](shared/audit-lifecycle.md) para o diagrama de estados, [`shared/pressure-test-protocol.md`](shared/pressure-test-protocol.md) para o procedimento e a auditoria de carga cognitiva em `audits/cognitive-load/` como uma implementação de referência.

## Superfície de ameaças

Quando uma ferramenta de auditoria é invocada, o executor (Claude com as ferramentas MCP apropriadas) executa operações no destino fornecido pelo usuário:

- **Saída de rede** — apenas para a URL de destino especificada pelo usuário. As ferramentas não chamam outros serviços.
- **Captura do DOM e da captura de tela** — a ferramenta pode ler o DOM da página, tirar capturas de tela e inspecionar classes CSS responsivas. O conteúdo capturado pode incluir qualquer coisa visível na sessão autenticada do usuário na URL de destino, incluindo nomes, corpos de mensagens e o estado da conta.
- **Escrita de arquivos locais** — os arquivos de evidência são gravados em `audits/<name>/evidence/<run-id>/` na árvore de trabalho do repositório. As ferramentas não gravam fora deste escopo.
- **Nenhuma transmissão de evidências para fora** — os arquivos de evidência permanecem no disco local, a menos que o usuário os envie e os inclua explicitamente.
- **Nenhuma telemetria, nenhum tratamento de segredos** — este repositório não coleta nenhuma análise e não lê nenhuma credencial.

Antes de enviar os arquivos de evidência para um repositório público, o usuário é responsável por revisar o que foi capturado. Consulte [`SECURITY.md`](SECURITY.md) para o modelo completo de ameaças, a política de relatório de vulnerabilidades e o escopo.

## Auditorias atuais

| Auditoria | Estado | Detecta | Evidências |
|---|---|---|---|
| [cognitive-load](audits/cognitive-load/) | Congelada v0.2 + Testada uma vez em ambiente de teste | Deslocamento da carga, complexidade oculta, fardo de confiança em IA, falha de mudança de estado | PT0 (claude.ai), PT1 (GitHub), PT2-doc-fallback (Outlook), Dogfood-1 (manual do research-os) |
| [low-vision](audits/low-vision/) | Testada em ambiente de teste v0.1.0 | Acesso visual em densidade real (zoom/redimensionamento, contraste em fotos e gráficos, foco em temas personalizados, orientação espacial) | PT0 (documentação MDN ARIA) — 10 resultados, 2C/4H, atingiu 4/4 padrões de falha grave |
| [screen-reader-task](audits/screen-reader-task/) | Testada em ambiente de teste v0.1.0 | Continuidade e conclusão da tarefa por meio de um leitor de tela — não apenas validade ARIA | PT0 (react.dev/learn) — 13 resultados, 2C/5H, atingiu 3/4 padrões de falha grave |
| [color-dependence](audits/color-dependence/) | Testada em ambiente de teste v0.1.0 | Significado transmitido apenas pela cor, incluindo a fronteira entre contraste aprovado e cor falha | PT0 (microsoft/vscode GitHub Actions) — 10 resultados, 1C/4H, atingiu 3/5 padrões de falha grave |
| [motor-access](audits/motor-access/) | Testada em ambiente de teste v0.1.0 | Custo de interação para usuários com deficiência motora (caminho do teclado, tamanho do alvo, dependência de arrastar, tempo limite, desfazer) | PT0 (sistema de design GOV.UK, padrão de várias etapas) — 8 resultados + 12 observações positivas, 0C/2H |
| [ai-trust-surface](audits/ai-trust-surface/) | Testada em ambiente de teste v0.1.0 | Confiança imposta, comportamento opaco da IA, sem possibilidade de correção de erros da IA, sem rastreabilidade. | PT0 (Bing SSR + documentação interna sobre confiança em IA) — 9 descobertas (5H/4M), 4 observadas, a seção 7 foi aprovada com base em um erro reproduzível. |
| [motion-sensitivity](audits/motion-sensitivity/) | Testada em ambiente de teste v0.1.0 | Gatilhos vestibulares, respeito à animação, preferência por movimento reduzido, limites de flash/convulsões. | PT0 (linear.app) — 3 descobertas (1H/2L) + 4 observações positivas, 0C. |

## Família de auditorias

Cada auditoria deve declarar *que fardo esta auditoria detecta que os verificadores genéricos não detectam?* Para Carga Cognitiva, a resposta é o deslocamento da carga.

### Auditorias futuras (ainda não criadas)

As sete auditorias atualmente especificadas estão agora no repositório e foram **testadas sob pressão ou melhor** (veja *Auditorias atuais* acima) — não há auditorias em fase de rascunho pendentes. As duas mais recentes, **Superfície de Confiança da IA** (`AT`) e **Sensibilidade ao Movimento** (`MO`), foram elaboradas por um grupo de estudo (pesquisa → verificação de citações externas → autor) e testadas sob pressão da mesma forma que as quatro anteriores. Auditorias adicionais são solicitadas conforme a necessidade, não especulativas — adicionadas uma de cada vez, com evidências, quando um objetivo real e uma rubrica baseada em pesquisa justificam o trabalho. O [ROADMAP](ROADMAP.md) acompanha os candidatos e o trabalho de avanço do ciclo de vida (PT1 → Congelamento) para as auditorias já existentes.

## Estrutura do repositório

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

## O que isto não é

- Não é um scanner de conformidade WCAG (use [axe](https://www.deque.com/axe/), [Lighthouse](https://developer.chrome.com/docs/lighthouse), [Pa11y](https://pa11y.org/) para isso)
- Não é uma revisão de design visual
- Não é uma lista de verificação de acessibilidade genérica
- Não é um pacote npm publicado (ainda — `package.json` declara `private: true` até que um pacote de execução seja separado)

As auditorias neste repositório têm como objetivo serem aplicadas em interfaces que **passam nos scanners, mas ainda assim fazem com que os usuários tenham que procurar**.

## Contribuições

Este repositório é atualmente mantido por [dogfood-lab](https://github.com/dogfood-lab). Contribuições externas são bem-vindas — abra um problema primeiro para discutir qualquer nova auditoria ou alteração nos critérios. De acordo com o ciclo de vida: sem evidências, sem auditoria oficial.

## Licença

[MIT](LICENSE) — Copyright (c) 2026 dogfood-lab.

---

<p align="center">
  <em>Part of <a href="https://github.com/dogfood-lab">dogfood-lab</a> — sister to <a href="https://github.com/mcp-tool-shop-org">mcp-tool-shop-org</a>.</em>
</p>
