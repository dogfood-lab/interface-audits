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

`interface-audits`は、監査の基準とそれを実行する実行可能なスキルのライブラリです。各監査では、一般的なアクセシビリティスキャナーが見逃す、ユーザーが直面する特定の種類の問題点を検出します。スキャナーはWCAG違反を検出し、これらの監査は**スキャナーをパスしても、依然としてユーザーに手間をかけさせるインターフェース**を検出します。

このライブラリの最初の監査は「認知負荷」であり、これは負荷の偏りを検出します。具体的には、記憶、検索、信頼、検証、ナビゲーション、構成、ソースからの復元、視覚的な解釈、時間、回復/取り消し、または機能の喪失に負担をかけるインターフェースです。

各監査には、以下の4つの要素が含まれます。

1. **基準** — 原則、セクション、重大度ルール（[`audits/cognitive-load/RUBRIC.md`](audits/cognitive-load/RUBRIC.md））
2. **スキル** — 呼び出し契約と手順（[`audits/cognitive-load/skill/SKILL.md`](audits/cognitive-load/skill/SKILL.md））
3. **スキーマ** — 検出結果とスコアカードのJSONスキーマ（[`shared/schemas/`](shared/schemas/））
4. **証拠** — 少なくとも1つの完了したプレッシャーテストまたは実環境でのテスト（[`audits/cognitive-load/evidence/`](audits/cognitive-load/evidence/））

証拠がなければ、正式な監査は行われません。状態遷移図については[`shared/audit-lifecycle.md`](shared/audit-lifecycle.md)を、今後の計画については[`ROADMAP.md`](ROADMAP.md)を参照してください。

## インストール

ほとんどのユーザーは、このリポジトリを「インストール」するのではなく、「参照」します。監査はマークダウン形式の基準とスキルであり、[Claude](https://claude.ai)または適切なMCPツールを備えた他の互換性のあるAIランナーによって解釈されます（ブラウザナビゲーション、スクリーンショット、DOM読み取り）。

ローカル検証ツール（スキーマ検証、リンクチェック、出荷前監査）を実行したい開発者向け：

```bash
git clone https://github.com/dogfood-lab/interface-audits.git
cd interface-audits
npm install        # installs ajv, ajv-formats, glob (dev-only)
npm run verify     # runs schema + link + shipcheck checks
```

**要件:** 検証ツールのためにNode 20以上が必要です。監査自体はプラットフォームに依存しないマークダウン形式です。

## 使用方法

### 監査の実行

Claude（または互換性のあるランナー）を通じて呼び出します。

> `<target-url-or-surface>`に対して認知負荷監査を実行してください。

完全なトリガーリスト、入力、出力、および手順については、[`audits/cognitive-load/skill/SKILL.md`](audits/cognitive-load/skill/SKILL.md)を参照してください。

### 既存の監査の参照

過去の監査実行結果は、`audits/<name>/evidence/<run-id>/`に保存され、3つのファイルで構成されます。

- `<audit>-findings.md` — 基準形式での完全な検出結果
- `<audit>-scorecard.json` — セクションごとの合格/警告/不合格 + 要約
- `remediation-priority-list.md` — 重大度×影響力で並べ替えられた検出結果

現在の監査とその証拠は、以下の[現在の監査](#current-audits)テーブルに示されています。

### 新しい監査の作成

新しい監査は、ドラフト→プレッシャーテスト済み→フリーズ→実環境テスト済み→改訂という5つのライフサイクル状態を経ます。状態遷移図については[`shared/audit-lifecycle.md`](shared/audit-lifecycle.md)を、手順については[`shared/pressure-test-protocol.md`](shared/pressure-test-protocol.md)を参照し、認知負荷監査を`audits/cognitive-load/`の参照実装として使用してください。

## 脅威サーフェス

監査スキルが呼び出されると、ランナー（適切なMCPツールを備えたClaude）は、ユーザーが指定したターゲットに対して以下の操作を実行します。

- **ネットワークからのデータ送信** — ユーザーが指定したターゲットURLのみに送信されます。スキルは他のサービスを呼び出しません。
- **DOMとスクリーンショットのキャプチャ** — スキルはページのDOMを読み取り、スクリーンショットを撮影し、レスポンシブCSSクラスを検査する場合があります。キャプチャされたコンテンツには、ターゲットURLでユーザーが認証されたセッション中に表示されるもの（名前、メッセージ本文、アカウントの状態など）が含まれる可能性があります。
- **ローカルファイルへの書き込み** — 証拠ファイルは、リポジトリのワーキングツリー内の`audits/<name>/evidence/<run-id>/`にのみ書き込まれます。スキルはこの範囲外に書き込みません。
- **証拠の外部への送信はありません** — 証拠ファイルはローカルディスクに残ります。ユーザーが明示的にコミットしてプッシュしない限り、外部には送信されません。
- **テレメトリや機密情報の処理はありません** — このリポジトリは分析データを収集せず、資格情報を読み取りません。

証拠ファイルを公開リポジトリにコミットする前に、ユーザーはキャプチャされた内容を確認する必要があります。完全な脅威モデル、脆弱性報告ポリシー、および範囲については[`SECURITY.md`](SECURITY.md)を参照してください。

## 現在の監査

| 監査 | 状態 | 検出対象 | 証拠 |
|---|---|---|---|
| [cognitive-load](audits/cognitive-load/) | フリーズv0.2 + 実環境で1回テスト済み | 負荷の偏り、隠れた複雑さ、AIへの過剰な信頼、状態の変化による失敗 | PT0（claude.ai）、PT1（GitHub）、PT2-doc-fallback（Outlook）、Dogfood-1（research-os handbook） |
| [low-vision](audits/low-vision/) | プレッシャーテスト済み v0.1.0 | 実際の密度下での視覚的なアクセス（ズーム/リフロー、写真とグラフのコントラスト、カスタムテーマ下のフォーカス、空間的配置） | PT0（MDN ARIAドキュメント）— 10件の検出結果、2C/4H、4つの重大な失敗パターンを検出 |
| [screen-reader-task](audits/screen-reader-task/) | プレッシャーテスト済み v0.1.0 | スクリーンリーダーを使用したタスクの継続性と完了 — 単なるARIAの有効性だけでなく | PT0（react.dev/learn）— 13件の検出結果、2C/5H、4つの重大な失敗パターンを検出 |
| [color-dependence](audits/color-dependence/) | プレッシャーテスト済み v0.1.0 | 色だけで意味が伝わる場合、特にコントラスト合格/色相不合格の境界線 | PT0（microsoft/vscode GitHub Actions）— 10件の検出結果、1C/4H、5つの重大な失敗パターンのうち3つを検出 |
| [motor-access](audits/motor-access/) | プレッシャーテスト済み v0.1.0 | 運動機能に障害のあるユーザーに対するインタラクションコスト（キーボード操作、ターゲットサイズ、ドラッグ依存性、タイムアウト、取り消し） | PT0（GOV.UK Design Systemの多段階パターン）— 8件の検出結果 + 12件の肯定的な観察結果、0C/2H |
| [ai-trust-surface](audits/ai-trust-surface/) | プレッシャーテスト済み v0.1.0 | 強制的な信頼、不透明なAIの動作、AIのエラーからの回復手段がない、証拠がない | PT0（Bing SSR + ファーストパーティのAI信頼ドキュメント）— 9件の検出結果（5H/4M）、4件の観察結果、セクション7で再現可能な誤動作が発生 |
| [motion-sensitivity](audits/motion-sensitivity/) | プレッシャーテスト済み v0.1.0 | 平衡感覚のトリガー、アニメーションへの配慮、モーション量の少ない表現を優先、点滅・発作閾値 | PT0（linear.app）—3つの検出結果（1H/2L）+4つの肯定的な観察事項、0C |

## 監査対象ファミリー

各監査では、「この監査が一般的なスキャナーが見逃す問題をどのように特定するか」を必ず明記する必要があります。認知負荷の場合、その答えは「負荷の分散」です。

### 今後の監査（まだ作成中）

現在仕様されている7つの監査はすべてリポジトリに登録されており、「十分なテスト済み」またはそれ以上の状態です（上記の「現在の監査」を参照）。未完成の監査はありません。最近追加された2つの監査、「AI信頼領域」（`AT`）と「モーション感度」（`MO`）は、研究チームによって作成され（調査→外部引用検証→著者）、以前の4つの監査と同様にテストされました。今後の監査は、推測ではなく、実際の対象と研究に基づいた評価基準に基づいて追加されます。必要に応じて、1つずつ追加し、証拠を提示します。[ロードマップ](ROADMAP.md)には、候補となる監査と、すでに存在する監査のライフサイクルにおける進捗状況（PT1→フリーズ）が記載されています。

## リポジトリ構造

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

## これは以下のものではありません

- WCAG適合性スキャナーではありません（[axe](https://www.deque.com/axe/)、[Lighthouse](https://developer.chrome.com/docs/lighthouse/)、[Pa11y](https://pa11y.org/)を使用してください）
- 視覚デザインのレビューではありません
- 一般的なアクセシビリティチェックリストではありません
- 公開されたnpmパッケージではありません（まだ。`package.json`には`private: true`と記載されており、実行ファイルが分割されるまでは公開されません）

このリポジトリ内の監査は、**スキャナーを通過するものの、ユーザーが依然として探し回る必要があるインターフェースに対して実行することを目的としています。**

## 貢献方法

このリポジトリは現在、[dogfood-lab](https://github.com/dogfood-lab)によって管理されています。外部からの貢献は大歓迎です。新しい監査または評価基準の変更について議論するために、まずIssueを開いてください。ライフサイクルに従い、証拠がない場合は、公式な監査は行われません。

## ライセンス

[MIT](LICENSE) — Copyright (c) 2026 dogfood-lab.

---

<p align="center">
  <em>Part of <a href="https://github.com/dogfood-lab">dogfood-lab</a> — sister to <a href="https://github.com/mcp-tool-shop-org">mcp-tool-shop-org</a>.</em>
</p>
