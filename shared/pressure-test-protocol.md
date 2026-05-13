# Pressure-test protocol

Every audit advances through pressure tests (PTs) and dogfood runs. This file defines the common protocol. Audit-specific rubric content lives in `audits/<name>/RUBRIC.md`.

## What each run answers

- **Pressure test:** does the audit's rubric survive contact with a real target, and does it produce honest findings without inventing drama?
- **Dogfood run:** does the audit produce actionable findings on a surface the maintainer owns, without requiring rubric churn?

Pressure tests can revise the rubric. Dogfood runs should not — if a dogfood run triggers a rubric change, that's a signal to elevate it to a pressure test and run a real PT.

## Setup

1. **Define the target.** URL, app flow, screen, or component. One concrete surface.
2. **Define the state.** Empty, normal, dense, worst-case. Audits should be run against the realistic dense state, not the marketing state.
3. **Define the evidence mode.**
   - Path 1 (live navigation) is preferred.
   - Path 2 (screenshots only) is acceptable but weaker.
   - Documentation fallback (vendor docs only, no live session) is acceptable when access is blocked; findings default to Inferred and the run is labeled `<pt-id>-doc-fallback`.

## Procedure

For each section in the audit's rubric, in order:

1. Read the section's purpose, failure modes, and audit questions.
2. Probe the available evidence against the questions.
3. Where evidence is insufficient, record the gap as an Open question — do not guess.
4. Produce zero or more findings per section, in the format specified in [`finding-format.md`](finding-format.md).
5. Score the section: Pass / Warn / Fail per the rules in [`severity-model.md`](severity-model.md).

Findings must trace to a section and audit question in the audit's RUBRIC.md. The audit must not introduce criteria that aren't in the rubric.

## Outputs

Every PT and dogfood run produces three files in `audits/<name>/evidence/<run-id>/`:

- `<audit-name>-findings.md` — full findings in the rubric format
- `<audit-name>-scorecard.json` — per-section pass/warn/fail + summary; conforms to `shared/schemas/scorecard.base.schema.json`
- `remediation-priority-list.md` — findings ordered by severity × leverage

## Exit criteria

Every run must verify:

- Findings map to rubric sections (no orphans)
- Evidence states recorded on every finding
- Open questions preserved (not laundered into confirmed findings)
- The report itself obeys the audit's own conventions (typography, plain language, structured headings)
- No new rubric section is obviously missing — if one is, log it as a candidate for the next version cut; don't invent one during the audit

## The discipline rule

A pressure test designed to find a specific failure shape (e.g. "find a Removed-power case") is at structural risk of over-fitting. Treat that as a flag for extra reclassification discipline:

- Start each finding with the most conservative evidence state (Inferred or Open question)
- Re-check findings against the rubric's actual criteria after the run completes
- If a finding gets downgraded on second pass, **that's the audit working** — record it in the calibration notes section of the findings file

Findings that survive second-pass reclassification are the real output. The reclassification trail itself is calibration evidence and belongs in the run's auditor-notes section.

This rule was earned the hard way: PT2 first overclaimed two "Removed" findings, then honest reclassification moved both to Hidden. The earlier draft was preserved as `pt2-outlook-doc-fallback` and the discipline lesson is the rule above.

## Run IDs

- Pressure tests: `pt0`, `pt1-<target-slug>`, `pt2-<target-slug>`, etc.
- Documentation fallbacks: `pt<N>-<target>-doc-fallback`
- Dogfood runs: `dogfood-<N>-<target-slug>`

Audit IDs in scorecards follow the convention `<prefix>-YYYYMMDD-<run-id>`, e.g. `cla-20260512-claude-ai-pt0` for the cognitive-load audit's PT0 (where `cla` is its scorecard prefix; the audit's finding-ID prefix is `CL`).
