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

`interface-audits` 是一个审计规则库，其中包含用于执行这些规则的可执行脚本。每个审计都会检测到一类特定的用户体验问题，而通用的可访问性扫描工具可能会忽略这些问题。扫描工具会检测 WCAG 违规行为；这些审计会检测到那些**通过扫描工具检查，但仍然会给用户带来困扰的界面**。

这个库中的第一个审计是“认知负荷”，它会检测负荷转移：即那些将负担转移到记忆、搜索、信任、验证、导航、配置、源恢复、视觉解码、时间、恢复/撤销或功能损失上的界面。

每个审计都会提供以下四项内容：

1. **规则**——原则、章节、严重程度规则（[`audits/cognitive-load/RUBRIC.md`](audits/cognitive-load/RUBRIC.md)）
2. **脚本**——调用约定和程序（[`audits/cognitive-load/skill/SKILL.md`](audits/cognitive-load/skill/SKILL.md)）
3. **模式**——用于发现结果和评分卡的 JSON 模式（[`shared/schemas/`](shared/schemas/)）
4. **证据**——至少一次完成的压力测试或实际使用测试（[`audits/cognitive-load/evidence/`](audits/cognitive-load/evidence/)）

如果没有证据，则不会进行正式审计。请参阅 [`shared/audit-lifecycle.md`](shared/audit-lifecycle.md) 以了解状态机，并参阅 [`ROADMAP.md`](ROADMAP.md) 以了解下一步计划。

## 安装

大多数用户不会“安装”这个仓库——他们只是阅读它。这些审计是 Markdown 格式的规则和脚本，由 [Claude](https://claude.ai) 或其他兼容的 AI 运行器使用适当的 MCP 工具（浏览器导航、截图、DOM 读取）进行解释。

对于想要运行本地验证工具（模式验证、链接检查、发布前检查审计）的维护者：

```bash
git clone https://github.com/dogfood-lab/interface-audits.git
cd interface-audits
npm install        # installs ajv, ajv-formats, glob (dev-only)
npm run verify     # runs schema + link + shipcheck checks
```

**要求：**验证工具需要 Node 20+。审计本身是与平台无关的 Markdown 格式。

## 使用方法

### 运行审计

通过 Claude（或兼容的运行器）调用：

> 在 `<target-url-or-surface>` 上运行认知负荷审计

请参阅 [`audits/cognitive-load/skill/SKILL.md`](audits/cognitive-load/skill/SKILL.md) 以获取完整的触发器列表、输入、输出和程序。

### 阅读现有的审计

过去的审计运行记录位于 `audits/<name>/evidence/<run-id>/` 下，包含三个文件：

- `<audit>-findings.md`——以规则格式呈现的完整发现结果
- `<audit>-scorecard.json`——每个部分的通过/警告/失败状态 + 摘要
- `remediation-priority-list.md`——按严重程度 × 影响程度排序的发现结果

当前的审计及其证据记录位于下方的 [当前审计](#current-audits) 表中。

### 编写新的审计

新的审计将经历五个生命周期状态：草稿 → 压力测试 → 冻结 → 实际使用测试 → 修改。请参阅 [`shared/audit-lifecycle.md`](shared/audit-lifecycle.md) 以了解状态机，参阅 [`shared/pressure-test-protocol.md`](shared/pressure-test-protocol.md) 以了解程序，并以 `audits/cognitive-load/` 中的认知负荷审计作为参考实现。

## 威胁范围

当调用审计脚本时，运行器（具有适当 MCP 工具的 Claude）会对用户提供的目标执行操作：

- **网络出口**——仅针对用户指定的目标 URL。脚本不会调用其他服务。
- **DOM 和截图捕获**——脚本可以读取页面 DOM、拍摄截图并检查响应式 CSS 类。捕获的内容可能包括用户在目标 URL 处的已身份验证会话中可见的任何内容，包括姓名、消息正文和帐户状态。
- **本地文件写入**——证据文件将写入仓库工作树下的 `audits/<name>/evidence/<run-id>/`。脚本不会写入此范围之外。
- **不将证据向外传输**——除非用户明确提交并推送，否则证据文件将保留在本地磁盘上。
- **不收集遥测数据，不处理敏感信息**——此仓库不收集任何分析数据，也不读取任何凭据。

在将证据文件提交到公共仓库之前，用户有责任查看已捕获的内容。请参阅 [`SECURITY.md`](SECURITY.md) 以了解完整的威胁模型、漏洞报告策略和范围。

## 当前审计

| 审计 | 状态 | 检测内容 | 证据 |
|---|---|---|---|
| [cognitive-load](audits/cognitive-load/) | 冻结 v0.2 + 进行了 1 次实际使用测试 | 负荷转移、隐藏的复杂性、AI 信任负担、状态转移失败 | PT0 (claude.ai)、PT1 (GitHub)、PT2-doc-fallback (Outlook)、Dogfood-1 (research-os 手册) |
| [low-vision](audits/low-vision/) | 已进行压力测试 v0.1.0 | 在实际密度下（缩放/重排、照片和图表上的对比度、自定义主题下的焦点、空间方向）的视觉访问 | PT0 (MDN ARIA 文档)——10 个发现结果，2C/4H，命中 4/4 个严重故障模式 |
| [screen-reader-task](audits/screen-reader-task/) | 已进行压力测试 v0.1.0 | 通过屏幕阅读器实现的任务连续性和完成——不仅仅是 ARIA 有效性 | PT0 (react.dev/learn)——13 个发现结果，2C/5H，命中 3/4 个严重故障模式 |
| [color-dependence](audits/color-dependence/) | 已进行压力测试 v0.1.0 | 仅通过颜色传达的含义，包括对比度通过/色调失败的边界 | PT0 (microsoft/vscode GitHub Actions)——10 个发现结果，1C/4H，命中 3/5 个严重故障模式 |
| [motor-access](audits/motor-access/) | 已进行压力测试 v0.1.0 | 对于运动障碍用户的交互成本（键盘路径、目标大小、拖动依赖、超时、撤销） | PT0 (GOV.UK 设计系统多步骤模式)——8 个发现结果 + 12 个积极的观察结果，0C/2H |

## 审计系列

每个审计都必须声明*此审计检测到的、通用扫描工具忽略的负担是什么？* 对于认知负荷，答案是负荷转移。

### 正在进行中的草稿（于 2026-06-02 编写，尚未进行压力测试）

仓库中包含四个草稿审计，每个审计都包含完整的四要素框架（评分标准 + 技能 + 模式 + PT0 候选人列表），但不包含证据。根据生命周期，在至少进行一次压力测试之前，它们不会列在上面的《当前审计》表中。请查看每个审计的 CHANGELOG，以了解每个审计的改进记录（引文已通过检索工具与 arXiv/DOI/W3C 资源进行验证；在提交之前，已更正了一个伪造的 DOI 和多个错误的归属）。

| 草稿审计 | 前缀 | 检测内容 |
|---|---|---|
| [low-vision](audits/low-vision/) | `LV` | 在实际密度下进行视觉访问——缩放和重排、照片和图表中的对比度、自定义主题下的焦点可见性、放大状态下的空间方向 |
| [screen-reader-task](audits/screen-reader-task/) | `SR` | 通过屏幕阅读器完成任务——不仅仅是 ARIA 验证 |
| [color-dependence](audits/color-dependence/) | `CD` | 仅通过颜色传达的含义——包括扫描器无法识别的对比度合格/色调不合格的边界 |
| [motor-access](audits/motor-access/) | `MA` | 对于运动障碍用户的交互成本——键盘路径、目标精度、拖动依赖性、超时压力、撤销 |

### 未来的审计（尚未编写）

运动敏感性（前庭触发器、`prefers-reduced-motion`）和 AI 可信度（强制信任、不透明的 AI 行为、来源）仍然在 [ROADMAP](ROADMAP.md) 中。审计会逐个添加，并包含证据，只有当实际目标证明了这项工作时才会进行——而不是基于推测。

## 仓库结构

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

## 这不是

- 不是 WCAG 合规性扫描器（请使用 [axe](https://www.deque.com/axe/)、[Lighthouse](https://developer.chrome.com/docs/lighthouse/)、[Pa11y](https://pa11y.org/)）
- 不是视觉设计审查
- 不是通用的可访问性检查清单
- 尚未发布为 npm 包（`package.json` 声明 `private: true`，直到将运行器包拆分出来）

此仓库中的审计旨在针对那些**通过扫描器但仍然让用户感到困惑**的界面。

## 贡献

目前，此仓库由 [dogfood-lab](https://github.com/dogfood-lab) 维护。欢迎外部贡献——首先创建一个 issue，讨论任何新的审计或评分标准更改。根据生命周期：没有证据，就没有正式审计。

## 许可

[MIT](LICENSE) — 版权所有 (c) 2026 dogfood-lab。

---

<p align="center">
  <em>Part of <a href="https://github.com/dogfood-lab">dogfood-lab</a> — sister to <a href="https://github.com/mcp-tool-shop-org">mcp-tool-shop-org</a>.</em>
</p>
