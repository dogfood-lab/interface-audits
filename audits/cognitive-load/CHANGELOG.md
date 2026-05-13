# Changelog — Cognitive Load Audit

All notable changes to the **Cognitive Load Audit** rubric and skill.

This file follows [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/). Rubric versions are independent of the monorepo version. The current frozen rubric is `0.2.0`.

The rubric ([`RUBRIC.md`](RUBRIC.md)) is canonical. The skill ([`skill/SKILL.md`](skill/SKILL.md)) follows. Pressure-test evidence under `evidence/<run-id>/` is frozen against the rubric version it ran on and is not rewritten when the rubric advances.

## [Unreleased]

### Pending — parked, not yet versioned

The current frozen rubric remains `0.2.0`. None of the candidates below justify a version cut on their own; they ride along with the next real revision when a future pressure test produces calibrating evidence.

- **Section 5 Removed clarification:** *"A feature is not Removed if it remains available through a documented alternate path; classify it as Hidden or Delayed based on discoverability and task cost."* Surfaced by PT2-doc-fallback's overclaim and reclassification. Defers the `removed_with_workaround` vs `removed_without_equivalent` sub-distinction proposed by an earlier PT2 draft.
- **"Vendor reference guide as Hidden meta-evidence" pattern** (CL-20 from PT2-doc-fallback): when a vendor publishes a separate documentation artifact whose purpose is to help users find moved features, that itself is structural evidence of Hidden classification severity. Worth folding into Section 5's failure-modes list when 0.3.0 cuts.
- **OQ-01** — Lighthouse / axe scanner pass on a production target. Section 1 (Measurable Defaults) cannot fully Pass without it. Carried forward through PT0, PT1, PT2-doc-fallback, Dogfood-1.

### Post-v0.2.0 evidence record

- **PT2-doc-fallback** (`evidence/pt2-outlook-doc-fallback/`, audit ID `cla-20260512-outlook-doc-fallback-pt2`) — Outlook Simplified Ribbon, vendor-documentation evidence only (no live session). Run as a calibration note about audit honesty, not a rubric upgrade trigger. First draft overclaimed two findings as Removed; honest reclassification moved both to Hidden because alternate access paths exist. No live-observed Removed case produced. The `simple_mode_removes_power` hard-failure pattern remains uncalibrated.
- **Dogfood Run 1** (`evidence/dogfood-1-research-os-handbook/`, audit ID `cla-20260512-dogfood-1-research-os-handbook`) — research-os handbook. Produced 8 actionable findings + 4 positive observations. No rubric churn. Validated that the audit produces honest bounded findings on a friendly target without inventing drama.

### PT3 target candidates (for real Removed calibration)

A future PT3 needs a target where the vendor or UI explicitly says a capability is unavailable in the simplified mode/tier/platform. Ranked roughly by likely calibration value:

1. Mobile vs desktop GitHub / Slack / Notion — strong chance of real admin, workflow, or review gaps named by the vendor.
2. A product with "Basic editor" vs "Advanced editor" — best conceptual fit if a clean example exists.
3. Android Easy Mode / Samsung Easy Mode — strong "simplified mode removes power" candidate at OS level.
4. SaaS Free / Basic vs Pro — clean "feature unavailable" evidence, but pricing-tier removal not necessarily cognitive-load simplification. Lower-fit for Section 5's intent.

## [0.2.0] - 2026-05-12

### Status

**Frozen + Dogfooded once.**

### Added

- **Section 5 sub-taxonomy.** Power Preservation findings classify against four sub-states:
  - Compressed — same capability, lower visual load (default severity: Pass / Low)
  - Delayed — more steps or scrolling to reach (Medium)
  - Hidden — discoverability drops, often via overflow menu (High)
  - Removed — capability unavailable in the simplified mode (Critical / High)
- **`Section 5 taxonomy:` finding field.** Required for every Section 5 finding. Optional / omitted (`n/a`) for findings in other sections.
- **Section 7 responsive-evidence caveat.** When the rig cannot render the actual narrow viewport (e.g., DPI-scaled Windows + Chrome min-window clamp), DOM/CSS-class analysis is acceptable Inferred evidence, provided the limitation is documented in the scorecard's `context.viewport_render_limitation` field and the inference cites the specific framework class or component pattern.

### Unchanged

- Section 5 Fail threshold (1 Critical OR 3 Highs).
- Severity definitions table.
- Load-displaced-to enum.
- Section 4 severity precondition.
- All 8 sections, in order.

### Evidence

- **PT1** (`evidence/pt1-github-narrow/`, audit ID `cla-20260512-github-narrow-pt1`) — GitHub `research-os` narrow / responsive audit. Validated the 4-way Section 5 sub-taxonomy against 12 power-feature deltas. No Removed findings observed on GitHub web (correctly — strong responsive behavior); the taxonomy correctly distinguished Compressed / Delayed / Hidden behaviors that 0.1.0 would have collapsed. Surfaced the viewport-render limitation that drove the Section 7 caveat.

## [0.1.0] - 2026-05-12

### Status

**Frozen** (superseded by 0.2.0).

### Added

- Initial 8-section rubric: Text Load, Measurable Defaults, Hidden Load, State Shift, AI Compression Risk, Power Preservation, Configuration Cost, Evidence.
- Cognitive Load Law and framing line: *"This audit does not ask whether an interface looks simple. It asks where the cognitive work went."*
- Finding format with `Load displaced to:` field.
- Severity definitions table (Critical / High / Medium / Low) and section-Fail threshold (1 Critical OR 3 Highs).
- **Section 4 severity precondition.** AI Compression Risk is Critical only when source was promised, claimed, fetched, or replaced. Generic unsourced model output classifies as High / Medium provenance ambiguity.
- **Load-displaced-to enum** (11 values): `search`, `memory`, `trust`, `verification`, `navigation`, `configuration`, `source recovery`, `visual decoding`, `time`, `recovery / undo`, `feature loss`.
- Standalone `skill/SKILL.md` split from the rubric. Rubric is canonical; skill follows.

### Evidence

- **PT0** (`evidence/pt0/`, audit ID `cla-20260512-claude-ai-pt0`) — claude.ai live audit. Produced 8 findings against the draft rubric. Surfaced the Section 4 severity precondition (first-pass over-fired on every unsourced model answer as Critical) and the load-enum requirement (freeform field allowed overlapping terms). Both patches landed before 0.1.0 freeze.

[Unreleased]: https://github.com/dogfood-lab/interface-audits/compare/cognitive-load-v0.2.0...HEAD
[0.2.0]: https://github.com/dogfood-lab/interface-audits/releases/tag/cognitive-load-v0.2.0
[0.1.0]: https://github.com/dogfood-lab/interface-audits/releases/tag/cognitive-load-v0.1.0
