# Changelog

All notable changes to **interface-audits** (the monorepo).

This file follows [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/) and uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html). Per-audit changelogs live at `audits/<name>/CHANGELOG.md` and track each audit's rubric version independently of the monorepo version.

## [Unreleased]

## [0.3.0] - 2026-06-14

### Added — 2 new Pressure-tested audits (study swarm → external verification → author → PT0)

Two audits authored and pressure-tested in one swarm, taking the family from 5 to **7 audits**. Both are **Pressure-tested v0.1.0** (PT0 landed, rubric unchanged) and are now in the [README](README.md) "Current audits" table.

- **`audits/ai-trust-surface/`** (`AT`) — forced trust, opaque AI behavior, no recovery from AI mistakes, no provenance. 8 sections (Source provenance · Reversibility · Inspection affordances · Confidence communication · Adaptation transparency · User control · Configuration cost · Evidence); **30 verified findings**; `at_trust_pattern` + `hax_phase` extension fields; reference-and-extend boundary with cognitive-load Section 4 — adopts its Critical precondition so it does not over-fire on generic unsourced output.
- **`audits/motion-sensitivity/`** (`MO`) — vestibular triggers, animation respect, `prefers-reduced-motion`, and the flash/seizure thresholds (the only physical-injury Critical in the repo). 7 sections (Animation · Loading motion · Vestibular trigger patterns · prefers-reduced-motion respect · Auto-playing media · Configuration cost · Evidence); **33 verified findings**; `mo_trigger_pattern` + `wcag_sc` extension fields; sibling-but-non-overlapping boundary with low-vision Section 5 (`forced-colors` vs `prefers-reduced-motion`).

### Pressure-tested — 2 PT0s, 2026-06-14

| Audit | Target | Findings | Overall |
|---|---|---|---|
| ai-trust-surface | Bing SSR search + 6 fetch-verified first-party AI-trust docs | 9 (5H / 4M), **4 Observed**, 2 OQ, 3 positive obs | **warn** |
| motion-sensitivity | linear.app (Path 2 — HTML + all 17 stylesheets) | 3 (1H / 2L), 4 OQ, 4 positive obs | **warn** |

Both pressure tests exercised the discipline rule **without over-firing — no Critical fired on either.** AT's Section 0 Critical-precondition was evaluated and correctly did not trigger (the one overclaim candidate, an Anthropic blog post, keeps its first-party copy qualified), and MO downgraded four findings on second pass (e.g. an opacity-only grid-dot field High → Low). The AT run's **Section 7 passed on a reproducible Bing misfire** — a query returned dictionary results while still rendering the "Content was generated with AI" label with no confidence cue — and its DuckDuckGo citation was validated for existence AND faithfulness against the cited Wikipedia source. An initial AT attempt against Perplexity 403-walled WebFetch and is retained as `audits/ai-trust-surface/evidence/pt0-perplexity/` (the doc-fallback that motivated a target-discovery study swarm → the fetchable Bing re-target).

### Grounding + external verification

Authored by a study swarm: **10 parallel research agents** (5 per audit) produced 77 candidate citations; **2 external-verifier agents** then ran the research-grounded-advisor protocol's Step-4 gate — a retrieval oracle (WebFetch against arXiv / DOI / W3C, family-independent) plus two decorrelated non-Claude groundedness families (`mistral-small:24b` + `granite4.1:30b`, reasoning-stripped, receiving only `{claim, source_title, abstract_snippet}`). Result: **63 verified KEEP findings** (AT 30, MO 33), 6 dropped, **0 fabricated, 0 flagged**. The oracle did real work — it dropped a Bisdorff-2013 prevalence claim because the retrieved source reports the *opposite*, caught a misattributed Si-2023 numeric, and baked in several year / author / URL corrections (preserved verbatim in the rubrics). Per-audit hardening + PT0 trails are in each audit's CHANGELOG.

## [0.2.0] - 2026-06-02

### npm

First release on npm under the `@dogfood-lab/interface-audits` package name. Published via OIDC Trusted Publishing from `release.yml` (no long-lived `NPM_TOKEN` secret), with Sigstore provenance attestation. `package.json` `"private": true` flag removed for this cut. The package ships the audit rubrics + skills + shared schemas as read-references; the `audit-cli` and `audit-mcp` runner artifacts remain separate future packages (ROADMAP TL-1 / TL-2).

### Pressure-tested — 4 PT0s, 2026-06-02

Same-day PT0 dogfood swarm on the 4 Draft audits authored earlier in the day. **All 4 audits advanced Draft → Pressure-tested.**

| Audit | Target | Findings | Sections | Overall |
|---|---|---|---|---|
| low-vision | MDN ARIA docs | 10 (2C / 4H / 3M) + 5 OQ | 1 pass · 5 warn · **2 fail** | **fail** |
| screen-reader-task | react.dev/learn | 13 (2C / 5H / 4M / 1L) + 5 OQ | 0 pass · 6 warn · **2 fail** | **fail** |
| color-dependence | microsoft/vscode GitHub Actions | 10 (1C / 4H / 5M) + 5 OQ | 0 pass · 5 warn · **1 fail** | **fail** |
| motor-access | GOV.UK Design System | 8 (0C / 2H / 2M / 4L) + 4 OQ + **12 positive observations** | 2 pass · 6 warn · 0 fail | **warn** |

Totals: 41 findings (5C / 15H / 14M / 5L), 19 open questions. All findings Inferred (Path 2 / WebFetch DOM-fallback — no live browser, AT, or simulator). 13 rubric-revision candidates surfaced and parked per the discipline rule (none load-bearing; each is a polish/refinement for a future PT2). Per-audit headline findings + parked candidates in each audit's CHANGELOG.

**Three headline catches across the 4 PTs:**

- **CD-03 on Primer (vscode-actions):** Primer's own design-token source ships a `light-protanopia-deuteranopia` theme override swapping green→blue and red→orange. *The vendor's own configuration is direct evidence the default red/green pair fails under CVD even when contrast passes* — the audit's central Contrast-Pass / Hue-Fail discriminator, observed in the wild.
- **LV-05 / LV-08 on MDN Yari:** zero `forced-colors` media queries in any MDN Yari CSS file. The canonical web-docs site silently breaks for users in Windows High Contrast Mode.
- **SR-08 / SR-10 on react.dev:** Sandpack's runtime-error pane has no `aria-live` region — a screen reader user gets no signal when their code throws.

The MA result on GOV.UK (0 fails, 12 positive observations) is the calibration anti-control: the audit produces honest bounded findings on a motor-access-conscious design system without inventing drama. Same shape as cog-load's Dogfood-1 result.

### Added — 4 Draft audits (2026-06-02)

- **`audits/low-vision/`** (`LV`) — visual access under real density. 8 sections; 25 research-grounded findings; reference-and-extend boundary with cognitive-load Section 1.
- **`audits/screen-reader-task/`** (`SR`) — task continuity and completion through a screen reader; the validity-vs-completion boundary rule is the load-bearing framing. 8 sections; 21 findings; AT/browser-pair extension field.
- **`audits/color-dependence/`** (`CD`) — meaning conveyed by color alone; the Contrast-Pass / Hue-Fail boundary is the discriminator from WCAG 1.4.3 contrast scans. 7 sections; 18 findings; CVD-class + simulation-confirmation extension fields.
- **`audits/motor-access/`** (`MA`) — interaction cost (exclusion vs cost) for motor-impaired users. 8 sections; 29 findings; `interaction_cost_class` extension field.

Each Draft ships the full four-thing skeleton (Rubric + Skill + Schema + PT0 candidate shortlist) minus evidence. Per the lifecycle ([`shared/audit-lifecycle.md`](shared/audit-lifecycle.md)), they are **not listed in the [README](README.md) "Current audits" table** until at least one pressure test runs.

Authored by a parallel study swarm (16 research agents → 4 same-stage verifiers → 4 author agents) then hardened by an external-verifier pass: a retrieval oracle (WebFetch, family-independent) and a decorrelated different-family LLM lens (Mistral + IBM Granite via Ollama). The oracle caught **one fabricated DOI** (CD F13 — resolved to a 2024 dental paper, not the stated CVD work) and five misattributions/title errors; all corrected before commit. The LLM lenses produced only false positives, again validating the research-grounded-advisor protocol's prior receipt that parametric LLMs miss what retrieval catches. Per-audit hardening trails are recorded in each audit's CHANGELOG.

## [0.1.0] - 2026-05-12

### Added

- Initial public release of the `interface-audits` monorepo at `dogfood-lab/interface-audits`.
- **First audit:** `audits/cognitive-load/` imported at rubric version `0.2.0` (Frozen + Dogfooded once). See [`audits/cognitive-load/CHANGELOG.md`](audits/cognitive-load/CHANGELOG.md) for that audit's history.
- **Shared norms** under `shared/`:
  - [`audit-lifecycle.md`](shared/audit-lifecycle.md) — 5-state machine (Draft → Pressure-tested → Frozen → Dogfooded → Revised)
  - [`evidence-states.md`](shared/evidence-states.md) — Observed / Inferred / Open question
  - [`severity-model.md`](shared/severity-model.md) — Critical / High / Medium / Low + 1-Critical-or-3-Highs section-Fail threshold
  - [`finding-format.md`](shared/finding-format.md) — finding contract + load-displaced-to enum
  - [`pressure-test-protocol.md`](shared/pressure-test-protocol.md) — PT vs dogfood, setup, procedure, exit criteria
  - [`schemas/finding.base.schema.json`](shared/schemas/finding.base.schema.json) and [`schemas/scorecard.base.schema.json`](shared/schemas/scorecard.base.schema.json) — JSON Schema for findings + scorecards
- **Four-thing rule** for official audits: Rubric + Skill + Schema + Evidence.
- **Brand asset** (`.brand/readme.png`) and README header wired with logo + badges + threat model + footer.
- **Quality gates** (Phase 0 shipcheck): SECURITY.md, LICENSE (MIT), SHIP_GATE.md, SCORECARD.md, verify.sh.
- **CI workflow** (`.github/workflows/verify.yml`) running schema validation, markdown lint, link check, and shipcheck audit on every push and PR.
- **Dependabot configuration** for GitHub Actions and npm ecosystems.
- **Repository metadata** — public, MIT-licensed, topics set, homepage pointing to GitHub Pages.

### Security

- Documented threat surface in [`SECURITY.md`](SECURITY.md): skills perform network egress only to the user-supplied target URL; evidence files are local-only; no telemetry; no secret handling.
- Per-audit `private_content_captured: false` field on the scorecard schema documents whether a run captured sensitive content before commit.

[Unreleased]: https://github.com/dogfood-lab/interface-audits/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/dogfood-lab/interface-audits/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/dogfood-lab/interface-audits/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/dogfood-lab/interface-audits/releases/tag/v0.1.0
