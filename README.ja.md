<p align="center">
  <a href="README.md">English</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português (BR)</a>
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

## これは何ですか？

`interface-audits`は、監査基準と、それらを実行する実行可能なスキルを含むライブラリです。各監査は、一般的なアクセシビリティスキャナが見逃す可能性のある、特定の種類のユーザーインターフェースの問題を検出します。スキャナはWCAG（Web Content Accessibility Guidelines：ウェブコンテンツアクセシビリティガイドライン）違反を検出しますが、これらの監査は、**スキャナを通過しても、ユーザーが使いづらいと感じるインターフェース**を検出します。

このライブラリで最初の監査は、**認知負荷（Cognitive Load）**です。これは、ユーザーの記憶、検索、信頼、検証、ナビゲーション、設定、元の状態への復元、視覚的な解釈、時間、復元/取り消し、または機能の喪失といった、ユーザーに負担をかけるインターフェースを検出します。

各監査には、以下の4つの要素が含まれています。

1. **基準（Rubric）**：原則、セクション、重要度ルール（[`audits/cognitive-load/RUBRIC.md`](audits/cognitive-load/RUBRIC.md)）
2. **スキル（Skill）**：呼び出し契約と手順（[`audits/cognitive-load/skill/SKILL.md`](audits/cognitive-load/skill/SKILL.md)）
3. **スキーマ（Schema）**：検出結果と評価カードのためのJSONスキーマ（[`shared/schemas/`](shared/schemas/)）
4. **証拠（Evidence）**：少なくとも1つの完了した負荷テストまたは実運用テスト（[`audits/cognitive-load/evidence/`](audits/cognitive-load/evidence/)）

証拠がない場合、公式な監査とは認められません。状態遷移については、[`shared/audit-lifecycle.md`](shared/audit-lifecycle.md)を参照してください。

## インストール

ほとんどのユーザーは、このリポジトリを「インストール」するのではなく、読みます。監査は、マークダウン形式の基準とスキルであり、[Claude](https://claude.ai)または、適切なMCPツール（ブラウザの操作、スクリーンショット、DOMの読み取り）を備えた、互換性のあるAIランナーによって解釈されます。

ローカルの検証ツール（スキーマ検証、リンクチェック、shipcheck監査）を実行したい開発者向けに：

```bash
git clone https://github.com/dogfood-lab/interface-audits.git
cd interface-audits
npm install        # installs ajv, ajv-formats, glob (dev-only)
npm run verify     # runs schema + link + shipcheck checks
```

**要件:** 検証ツールにはNode 20以降が必要です。監査自体は、プラットフォームに依存しないマークダウン形式です。

## 使用方法

### 監査の実行

Claude（または互換性のあるランナー）を通じて呼び出します。

> `<target-url-or-surface>`に対して、認知負荷監査を実行します。

完全なトリガーリスト、入力、出力、および手順については、[`audits/cognitive-load/skill/SKILL.md`](audits/cognitive-load/skill/SKILL.md)を参照してください。

### 既存の監査の確認

過去の監査結果は、`audits/<name>/evidence/<run-id>/`ディレクトリに保存されており、以下の3つのファイルで構成されます。

- `<audit>-findings.md`：基準形式での詳細な検出結果
- `<audit>-scorecard.json`：セクションごとの合否状況と概要
- `remediation-priority-list.md`：重要度と影響度に基づいて並べ替えられた検出結果

現在の監査とその証拠については、以下の[現在の監査](#current-audits)の表を参照してください。

### 新しい監査の作成

新しい監査は、以下の5つのライフサイクル状態を経ます：下書き（Draft）→ 負荷テスト済み（Pressure-tested）→ 凍結（Frozen）→ 実運用テスト済み（Dogfooded）→ 修正（Revised）。状態遷移については、[`shared/audit-lifecycle.md`](shared/audit-lifecycle.md)を参照し、手順については、[`shared/pressure-test-protocol.md`](shared/pressure-test-protocol.md)を参照してください。また、`audits/cognitive-load/`にある認知負荷監査を、参考実装として参照してください。

## 脅威の範囲

監査スキルが呼び出されると、ランナー（適切なMCPツールを備えたClaude）は、ユーザーが指定した対象に対して以下の操作を実行します。

- **ネットワークからの送信**：指定されたURLへの送信のみ。他のサービスへのアクセスは行いません。
- **DOMとスクリーンショットの取得**：この機能は、ページのDOMを読み込み、スクリーンショットを取得し、レスポンシブCSSクラスを検査することができます。取得されるコンテンツには、ユーザーが認証されたセッション中に指定されたURLで表示されるものすべてが含まれる可能性があります。これには、名前、メッセージ本文、アカウントの状態などが含まれます。
- **ローカルファイルへの書き込み**：証拠ファイルは、リポジトリのワーキングツリー内の`audits/<name>/evidence/<run-id>/`ディレクトリにのみ書き込まれます。この範囲外への書き込みは行いません。
- **証拠ファイルの外部への送信なし**：証拠ファイルは、ユーザーが明示的にコミットしてプッシュするまで、ローカルディスクに保持されます。
- **テレメトリーの収集なし、機密情報の取り扱いなし**：このリポジトリは、分析情報を収集せず、認証情報を読み取りません。

ユーザーは、証拠ファイルを公開リポジトリにコミットする前に、取得された内容を確認する責任があります。詳細については、[`SECURITY.md`](SECURITY.md) を参照してください。このファイルには、脅威モデル、脆弱性報告ポリシー、および適用範囲が記載されています。

## 現在の監査

| 監査 | 状態 | 検出項目 | 証拠 |
|---|---|---|---|
| [cognitive-load](audits/cognitive-load/) | Frozen v0.2 + 内部テスト済み | 負荷の分散、隠れた複雑さ、AIに対する信頼の負担、状態遷移の失敗 | PT0 (claude.ai), PT1 (GitHub), PT2-doc-fallback (Outlook), Dogfood-1 (research-os handbook) |

## 監査ファミリー

各監査では、*この監査は、一般的なスキャナが見逃す可能性のある問題をどのように検出するのか？* を明示的に示す必要があります。例えば、認知負荷の場合、その答えは「負荷の分散」です。

このファミリーの今後の監査には、視覚障害者向けの機能（実際の密度での視覚アクセス）、スクリーンリーダータスク（単なるARIAの有効性だけでなく、タスクの継続性）、色の依存性、モーターアクセシビリティ、モーションセンシビリティ、およびAIに対する信頼性の問題などが含まれる可能性があります。監査は、実際のターゲットが存在し、作業の正当性がある場合に、一つずつ追加されます。推測による追加は行いません。

## リポジトリの構造

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

## これは何ではないか

- WCAG準拠のチェックツールではありません（[axe](https://www.deque.com/axe/)、[Lighthouse](https://developer.chrome.com/docs/lighthouse)、[Pa11y](https://pa11y.org/) を使用してください）。
- 視覚デザインのレビューではありません。
- 一般的なアクセシビリティチェックリストではありません。
- まだ公開されていないnpmパッケージです（`package.json` には `private: true` が記述されています。ランナーパッケージが分離されるまでは）。

このリポジトリ内の監査は、**スキャナで問題がないように見えるものの、ユーザーが依然として苦労するインターフェース**に対して実行されることを目的としています。

## 貢献

このリポジトリは、現在 [dogfood-lab](https://github.com/dogfood-lab) によって維持されています。外部からの貢献は大歓迎です。新しい監査や評価基準の変更については、まずIssueを作成して議論してください。ライフサイクルに従い、証拠がない場合は、公式な監査とは認められません。

## ライセンス

[MIT](LICENSE) — Copyright (c) 2026 dogfood-lab.

---

<p align="center">
  <em>Part of <a href="https://github.com/dogfood-lab">dogfood-lab</a> — sister to <a href="https://github.com/mcp-tool-shop-org">mcp-tool-shop-org</a>.</em>
</p>
