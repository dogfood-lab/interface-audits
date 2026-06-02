# Changelog

All notable changes to **interface-audits** (the monorepo).

This file follows [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/) and uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html). Per-audit changelogs live at `audits/<name>/CHANGELOG.md` and track each audit's rubric version independently of the monorepo version.

## [Unreleased]

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

[Unreleased]: https://github.com/dogfood-lab/interface-audits/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/dogfood-lab/interface-audits/releases/tag/v0.1.0
