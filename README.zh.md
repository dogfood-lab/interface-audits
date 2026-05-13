<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.md">English</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português (BR)</a>
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

## 这是什么

`interface-audits` 是一个包含审计指南和执行脚本的库。每个审计都能够检测到通用辅助功能扫描器可能遗漏的特定类型的用户界面问题。扫描器可以检测到 WCAG 标准的违规情况，而这些审计可以检测到那些**通过扫描器，但仍然让用户感到困扰**的界面。

这个库中的第一个审计是 **认知负荷 (Cognitive Load)**，它用于检测负荷转移现象：即那些将负担转移到用户记忆、搜索、信任、验证、导航、配置、数据恢复、视觉解码、时间、撤销/恢复或功能缺失上的界面。

每个审计都包含以下四项内容：

1. **指南 (Rubric)** — 包含定义、章节和严重程度规则的文件 ([`audits/cognitive-load/RUBRIC.md`](audits/cognitive-load/RUBRIC.md))
2. **脚本 (Skill)** — 包含调用协议和执行流程的文件 ([`audits/cognitive-load/skill/SKILL.md`](audits/cognitive-load/skill/SKILL.md))
3. **模式 (Schema)** — 用于记录结果和评分卡的 JSON 模式 ([`shared/schemas/`](shared/schemas/))
4. **证据 (Evidence)** — 至少包含一次完整的压力测试或内部测试结果 ([`audits/cognitive-load/evidence/`](audits/cognitive-load/evidence/))

如果没有证据，则不属于正式的审计。请参阅 [`shared/audit-lifecycle.md`](shared/audit-lifecycle.md) 以了解状态机。

## 安装

大多数用户不会“安装”这个仓库，而是会阅读它。这些审计是 Markdown 格式的指南和脚本，由 [Claude](https://claude.ai) 或其他兼容的 AI 运行器，以及相应的 MCP 工具（浏览器导航、截图、DOM 读取）来解释。

对于希望运行本地验证工具（模式验证、链接检查、shipcheck 审计）的维护人员：

```bash
git clone https://github.com/dogfood-lab/interface-audits.git
cd interface-audits
npm install        # installs ajv, ajv-formats, glob (dev-only)
npm run verify     # runs schema + link + shipcheck checks
```

**要求：** 需要 Node 20 或更高版本的环境，用于运行验证工具。 审计本身是平台无关的 Markdown 文件。

## 使用方法

### 运行审计

通过 Claude（或兼容的运行器）调用：

> 运行 `cognitive-load` 审计，目标为 `<target-url-or-surface>`

请参阅 [`audits/cognitive-load/skill/SKILL.md`](audits/cognitive-load/skill/SKILL.md) 以获取完整的触发器列表、输入、输出和执行流程。

### 查看已有的审计结果

之前的审计结果保存在 `audits/<name>/evidence/<run-id>/` 目录下，包含三个文件：

- `<audit>-findings.md` — 完整的审计结果，以指南格式呈现
- `<audit>-scorecard.json` — 每个部分的通过/警告/失败状态，以及摘要
- `remediation-priority-list.md` — 按照严重程度 × 影响程度排序的审计结果

当前的审计及其相关证据保存在下面的 [当前审计](#current-audits) 表格中。

### 创建新的审计

一个新的审计会经历五个生命周期状态：草稿 (Draft) → 压力测试 (Pressure-tested) → 冻结 (Frozen) → 内部测试 (Dogfooded) → 修正 (Revised)。 请参阅 [`shared/audit-lifecycle.md`](shared/audit-lifecycle.md) 以了解状态机，[`shared/pressure-test-protocol.md`](shared/pressure-test-protocol.md) 以了解流程，以及 `audits/cognitive-load/` 目录下的认知负荷审计，作为参考实现。

## 潜在风险

当调用审计脚本时，运行器（Claude 及其相应的 MCP 工具）会对用户提供的目标执行以下操作：

- **网络出站流量** — 仅限于用户指定的目标 URL。技能不会调用其他服务。
- **DOM 和截图** — 技能可以读取页面 DOM，截取屏幕截图，并检查响应式 CSS 类。捕获的内容可能包括在用户已验证会话期间在目标 URL 上显示的所有内容，包括姓名、消息内容和帐户状态。
- **本地文件写入** — 证据文件仅写入到仓库的工作目录下的 `audits/<name>/evidence/<run-id>/` 目录中。技能不会在超出此范围进行写入。
- **不进行证据文件的外部传输** — 除非用户明确提交并推送，否则证据文件将保留在本地磁盘上。
- **不收集任何遥测数据，不处理任何敏感信息** — 此仓库不收集任何分析数据，也不读取任何凭据。

在将证据文件提交到公共仓库之前，用户有责任审查已捕获的内容。请参阅 [`SECURITY.md`](SECURITY.md) 以获取完整的威胁模型、漏洞报告策略和范围说明。

## 当前审计

| 审计 | 状态 | 检测项 | 证据 |
|---|---|---|---|
| [cognitive-load](audits/cognitive-load/) | 已冻结 v0.2 + 已进行一次内部测试 | 负载转移、隐藏的复杂性、人工智能信任负担、状态转移失败 | PT0 (claude.ai), PT1 (GitHub), PT2-doc-fallback (Outlook), Dogfood-1 (research-os handbook) |

## 审计系列

每个审计都必须声明 *此审计能够检测到哪些问题，而通用扫描器无法检测到？* 对于认知负荷，答案是负载转移。

此系列中的未来审计可能包括低视力（在真实密度下的视觉访问）、屏幕阅读器任务（任务连续性，而不仅仅是 ARIA 验证）、颜色依赖性、运动辅助、运动敏感性以及人工智能信任表面。 审计会逐个添加，并在有实际目标能够证明其价值时进行，而不是基于猜测。

## 仓库结构

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

## 这不是什么

- 不是 WCAG 兼容性扫描器（请使用 [axe](https://www.deque.com/axe/)、[Lighthouse](https://developer.chrome.com/docs/lighthouse) 或 [Pa11y](https://pa11y.org/)）
- 不是视觉设计审查
- 不是通用的辅助功能检查清单
- 不是已发布的 npm 包（目前还没有，`package.json` 文件声明 `private: true`，直到分离出一个运行器包）

此仓库中的审计旨在应用于那些 **通过扫描器，但仍然让用户感到困扰的界面**。

## 贡献

此仓库目前由 [dogfood-lab](https://github.com/dogfood-lab) 维护。 欢迎外部贡献 — 在进行任何新的审计或规则更改之前，请先打开一个问题进行讨论。 遵循生命周期：没有证据，就没有官方审计。

## 许可证

[MIT](LICENSE) — 版权所有 (c) 2026 dogfood-lab。

---

<p align="center">
  <em>Part of <a href="https://github.com/dogfood-lab">dogfood-lab</a> — sister to <a href="https://github.com/mcp-tool-shop-org">mcp-tool-shop-org</a>.</em>
</p>
