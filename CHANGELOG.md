# Changelog

All notable changes to **interface-audits** (the monorepo).

This file follows [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/) and uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html). Per-audit changelogs live at `audits/<name>/CHANGELOG.md` and track each audit's rubric version independently of the monorepo version.

## [Unreleased]

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
