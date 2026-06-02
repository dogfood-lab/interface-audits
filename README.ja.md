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

## これは何ですか

`interface-audits`は、監査の基準と、それを実行する実行可能なスキルのライブラリです。各監査は、一般的なアクセシビリティスキャナーが見逃す、特定の種類のユーザーが直面する問題を検出します。スキャナーはWCAG違反を検出しますが、これらの監査は、**スキャナーを通過するものの、依然としてユーザーに手間をかけさせるインターフェース**を検出します。

このライブラリの最初の監査は、**認知負荷**であり、負荷の偏りを検出します。負荷の偏りとは、インターフェースが、記憶、検索、信頼、検証、ナビゲーション、構成、ソースの復元、視覚的な解読、時間、復元/元に戻す、または機能の喪失に負担をかけることです。

各監査には、以下の4つの要素が含まれます。

1. **基準** — 原則、セクション、重大度ルール（[`audits/cognitive-load/RUBRIC.md`](audits/cognitive-load/RUBRIC.md)）
2. **スキル** — 呼び出し契約と手順（[`audits/cognitive-load/skill/SKILL.md`](audits/cognitive-load/skill/SKILL.md)）
3. **スキーマ** — 検出結果とスコアカードのJSONスキーマ（[`shared/schemas/`](shared/schemas/)）
4. **証拠** — 少なくとも1つの完了したプレッシャーテストまたは実環境でのテスト（[`audits/cognitive-load/evidence/`](audits/cognitive-load/evidence/)）

証拠がなければ、正式な監査は行われません。状態遷移図については[`shared/audit-lifecycle.md`](shared/audit-lifecycle.md)を、今後の計画については[`ROADMAP.md`](ROADMAP.md)を参照してください。

## インストール

ほとんどのユーザーは、このリポジトリを「インストール」するのではなく、読みます。監査は、マークダウン形式の基準とスキルであり、[Claude](https://claude.ai)または、適切なMCPツール（ブラウザナビゲーション、スクリーンショット、DOM読み取り）を備えた他の互換性のあるAIランナーによって解釈されます。

ローカルの検証ツール（スキーマ検証、リンクチェック、出荷前監査）を実行したい開発者向け：

```bash
git clone https://github.com/dogfood-lab/interface-audits.git
cd interface-audits
npm install        # installs ajv, ajv-formats, glob (dev-only)
npm run verify     # runs schema + link + shipcheck checks
```

**要件：**検証ツールには、Node 20以上が必要です。監査自体は、プラットフォームに依存しないマークダウンです。

## 使用方法

### 監査の実行

Claude（または互換性のあるランナー）を通じて呼び出します。

> `<target-url-or-surface>`に対して、認知負荷監査を実行します。

完全なトリガーリスト、入力、出力、および手順については、[`audits/cognitive-load/skill/SKILL.md`](audits/cognitive-load/skill/SKILL.md)を参照してください。

### 既存の監査の確認

過去の監査の実行結果は、`audits/<name>/evidence/<run-id>/`に保存され、3つのファイルで構成されます。

- `<audit>-findings.md` — 基準形式での完全な検出結果
- `<audit>-scorecard.json` — セクションごとの合格/警告/不合格 + 要約
- `remediation-priority-list.md` — 重大度×影響度で並べ替えられた検出結果

現在の監査とその証拠は、以下の[現在の監査](#current-audits)表に示されています。

### 新しい監査の作成

新しい監査は、ドラフト→プレッシャーテスト→フリーズ→実環境テスト→修正という、5つのライフサイクル状態を経ます。状態遷移図については[`shared/audit-lifecycle.md`](shared/audit-lifecycle.md)を、手順については[`shared/pressure-test-protocol.md`](shared/pressure-test-protocol.md)を、および認知負荷監査を`audits/cognitive-load/`の参照実装として参照してください。

## 脅威の対象範囲

監査スキルが呼び出されると、ランナー（適切なMCPツールを備えたClaude）は、ユーザーが指定した対象に対して操作を実行します。

- **ネットワークへの送信** — ユーザーが指定したターゲットURLのみ。スキルは他のサービスを呼び出しません。
- **DOMとスクリーンショットのキャプチャ** — スキルは、ページのDOMを読み取り、スクリーンショットを撮影し、レスポンシブCSSクラスを検査できます。キャプチャされたコンテンツには、ターゲットURLのユーザーの認証されたセッションで表示されるもの（名前、メッセージ本文、アカウントの状態など）が含まれる場合があります。
- **ローカルファイルへの書き込み** — 証拠ファイルは、リポジトリのワーキングツリー内の`audits/<name>/evidence/<run-id>/`にのみ書き込まれます。スキルは、この範囲外に書き込みません。
- **証拠の外部への送信はありません** — 証拠ファイルは、ユーザーが明示的にコミットしてプッシュしない限り、ローカルディスクに保存されます。
- **テレメトリや機密情報の処理はありません** — このリポジトリは、分析データを収集せず、資格情報を読み取りません。

証拠ファイルをパブリックリポジトリにコミットする前に、ユーザーはキャプチャされた内容を確認する責任があります。完全な脅威モデル、脆弱性報告ポリシー、および範囲については、[`SECURITY.md`](SECURITY.md)を参照してください。

## 現在の監査

| 監査 | 状態 | 検出対象 | 証拠 |
|---|---|---|---|
| [cognitive-load](audits/cognitive-load/) | フリーズv0.2 + 実環境で1回テスト済み | 負荷の偏り、隠れた複雑さ、AIへの過度な依存、状態の変化による失敗 | PT0（claude.ai）、PT1（GitHub）、PT2-doc-fallback（Outlook）、Dogfood-1（research-os handbook） |
| [low-vision](audits/low-vision/) | プレッシャーテスト済み v0.1.0 | 実際の密度下での視覚的なアクセス（ズーム/リフロー、写真とグラフのコントラスト、カスタムテーマ下でのフォーカス、空間的な方向） | PT0（MDN ARIAドキュメント）— 10件の検出、2C/4H、4つのハードフェイルパターンを検出 |
| [screen-reader-task](audits/screen-reader-task/) | プレッシャーテスト済み v0.1.0 | スクリーンリーダーを使用したタスクの継続性と完了 — ARIAの有効性だけではありません | PT0（react.dev/learn）— 13件の検出、2C/5H、4つのハードフェイルパターンを検出 |
| [color-dependence](audits/color-dependence/) | プレッシャーテスト済み v0.1.0 | 色だけで意味が伝わること、コントラストが十分であるかどうかの境界線を含む | PT0（microsoft/vscode GitHub Actions）— 10件の検出、1C/4H、5つのハードフェイルパターンのうち3つを検出 |
| [motor-access](audits/motor-access/) | プレッシャーテスト済み v0.1.0 | 運動機能に障害のあるユーザーに対するインタラクションコスト（キーボード操作、ターゲットサイズ、ドラッグへの依存、タイムアウト、元に戻す） | PT0（GOV.UK Design Systemの多段階パターン）— 8件の検出 + 12件の肯定的な観察、0C/2H |

## 監査ファミリー

各監査は、*この監査は、一般的なスキャナーが見逃すどのような問題を検出しますか？*を宣言する必要があります。認知負荷の場合、答えは負荷の偏りです。

### 進行中のドラフト（2026年6月2日に作成、まだプレッシャーテストは実施されていません）

リポジトリには、4つのドラフト監査が保存されており、それぞれに完全な4つの要素（評価基準＋スキル＋スキーマ＋PT0候補の絞り込みリスト）が含まれていますが、証拠は含まれていません。ライフサイクルに従い、少なくとも1つの検証が行われるまでは、上記の「現在の監査」テーブルにはリストされません。各監査のCHANGELOGを参照して、監査ごとの改善履歴を確認してください（引用は、arXiv/DOI/W3Cなどの情報源に対して検索エンジンを用いて検証されました。1つの捏造されたDOIと複数の誤った引用が、コミット前に修正されました）。

| ドラフト監査 | プレフィックス | 検出対象 |
|---|---|---|
| [low-vision](audits/low-vision/) | `LV` | 実際の密度下での視覚的なアクセス — ズームとリフロー、写真とグラフのコントラスト、カスタムテーマ下でのフォーカスの視認性、拡大表示下での空間的な方向性 |
| [screen-reader-task](audits/screen-reader-task/) | `SR` | スクリーンリーダーを使用したタスクの「完了」— ARIAの有効性の検証だけではありません |
| [color-dependence](audits/color-dependence/) | `CD` | 色だけで意味が伝わる場合 — スキャナーが見ることができないコントラストの合格/色の不合格の境界線を含む |
| [motor-access](audits/motor-access/) | `MA` | 運動機能に障害のあるユーザーに対するインタラクションのコスト — キーボード操作、ターゲットの精度、ドラッグへの依存、タイムアウトのプレッシャー、アンドゥ |

### 今後の監査（まだ作成されていないもの）

モーションセンシティビティ（前庭刺激、`prefers-reduced-motion`）とAIの信頼性（強制的な信頼、不透明なAIの動作、出所）は、[ROADMAP](ROADMAP.md)に記載されています。監査は、実際の対象が作業を正当化する場合に、証拠とともに1つずつ追加されます。憶測に基づいて追加されることはありません。

## リポジトリの構造

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

## これは何ではないか

- WCAG適合性スキャナーではありません（それには[axe](https://www.deque.com/axe/)、[Lighthouse](https://developer.chrome.com/docs/lighthouse/)、[Pa11y](https://pa11y.org/)を使用してください）
- 視覚的なデザインレビューではありません
- 一般的なアクセシビリティチェックリストではありません
- 公開されたnpmパッケージではありません（まだ — `package.json`は、実行パッケージが分割されるまで`private: true`と宣言しています）

このリポジトリの監査は、**スキャナーには合格するものの、ユーザーが依然として操作に苦労する**インターフェースに対して実行することを目的としています。

## 貢献

このリポジトリは、現在[dogfood-lab](https://github.com/dogfood-lab)によって管理されています。外部からの貢献は大歓迎です。新しい監査または評価基準の変更について議論するために、まずissueを開いてください。ライフサイクルに従い、証拠がない場合は、公式の監査は行われません。

## ライセンス

[MIT](LICENSE) — Copyright (c) 2026 dogfood-lab.

---

<p align="center">
  <em>Part of <a href="https://github.com/dogfood-lab">dogfood-lab</a> — sister to <a href="https://github.com/mcp-tool-shop-org">mcp-tool-shop-org</a>.</em>
</p>
