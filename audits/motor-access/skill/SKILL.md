---
name: motor-access-audit
description: Motor Access Audit — 8-section rubric for auditing interfaces by how much motor effort, precision, and time an interaction costs, not whether it is labelled. Invoke when the user says "motor access audit", "audit this for motor accessibility", "can this be done by keyboard", "check this for drag dependence", "run the motor access rubric", "is this target big enough", "check this against interaction cost", or asks to evaluate a product surface for keyboard-path completeness, pointer precision / target size, drag dependence, timeout pressure, or undo / error recovery. NOT a general accessibility scan (use axe / Lighthouse for WCAG conformance — and note a scanner recalls only ~half of real touch-target violations) and NOT a screen-reader / ARIA-validity review.
---

# Motor Access Audit — Skill

This skill executes the rubric in [`../RUBRIC.md`](../RUBRIC.md). It does not invent criteria. The rubric is canonical; if this file and the rubric disagree, the rubric wins.

## Doctrine to honor on every run

- **The rubric is canonical.** Every finding traces to a section and audit question in `RUBRIC.md`. If a finding doesn't map to one of the 8 sections, it is not a finding produced by this skill.
- **Every finding is interaction cost.** Frame each finding as cost or exclusion, never preference. The same task is completable; the barrier is motor effort, precision demand, or time pressure. Distinguish **exclusion** (impossible without a mouse / a drag / a fast hand — Critical) from **cost** (possible but high-effort — Low to High by task centrality). Record the worse of the two when a control is both.
- **Identify where the load moved.** Every finding must populate `Load displaced to:` using one or more values from the shared 11-value enum in [`../../../shared/finding-format.md`](../../../shared/finding-format.md). See the RUBRIC's mapping table for how MA failure shapes map onto the shared values. No new displacement values — the enum is shared and fixed.
- **Evidence required, and input mode recorded.** Findings carry an evidence state: **Observed** (seen directly, with the input mode named), **Inferred** (strongly implied by observed behaviour, rendered measurement, or documented design), or **Open question** (plausible but unconfirmed). Every Observed finding names the input mode tested (keyboard-only, single-pointer-no-drag, touch, switch, eye-gaze). Findings without evidence are recorded as open questions, not laundered into confirmed issues.
- **A scanner pass is not a Motor Access pass.** Google's Accessibility Scanner recalls only ~50.85% of real visual touch-target violations; it reports a valid-markup ARIA widget as passing even when no keyboard user can operate it. Section 1 target checks require rendered measurement, not scanner bounds. Section 0 ARIA-widget and Section 2 drag findings require a human end-to-end completion test, not a markup scan.
- **A keyboard trap is a page-level blocker.** Per Section 0's precondition, a single inescapable focus fails the whole page under WCAG Non-Interference (SC 2.1.2). It is an automatic section Fail on its own, independent of the 3-High threshold.
- **Test the two cheapest paths.** Every interactive task must be attempted **keyboard-only** and **single-pointer-no-drag** — these are the two cheapest paths a motor-impaired user has. Mouse-only auditing cannot produce a valid Motor Access result (Section 7).
- **The report obeys its own audit.** Output must meet plain-language, short-sentence, structured-heading conventions. The report is for humans under varying constraint and must be readable.

## Inputs

```yaml
input_types:
  - url                       # live or staging URL
  - screenshot                # PNG/JPG of a specific surface (rendered measurement only; weaker for interaction)
  - component_code            # JSX/Vue/HTML for a single component
  - app_flow_description      # prose describing a multi-step flow
  - product_surface_notes     # auditor's notes on what was observed
```

At least one input is required. Multiple inputs of different types may be combined for richer coverage. Path 1 (live navigation, with keyboard and single-pointer interaction actually performed) produces denser evidence than Path 2 (screenshots only) and is required for the interaction-dependent sections (Keyboard Path, Drag Dependence, Timeout Pressure, Undo / Recovery, Error Recovery). Screenshots can support Section 1 rendered measurement but cannot prove operability.

## Optional context

```yaml
optional_context:
  input_modes_tested:  "keyboard-only | single-pointer-no-drag | touch | switch/scan | eye-gaze (list which were exercised)"
  user_type:           "professional | casual | first-time | returning"
  task:                "what the user is trying to do on this surface"
  dense_state:         "description of the worst-case interactive state tested (long list, full board, form + timeout)"
  device:              "desktop mouse | trackpad | touchscreen | switch | eye-gaze rig | emulator"
  ai_features_present: "any AI-mediated interaction in scope (rare for MA, but record it)"
  prior_audit_id:      "if this is a re-audit, the previous audit id"
```

If `dense_state` is empty, warn that Section 7 cannot pass. If neither keyboard-only nor single-pointer-no-drag was exercised, warn that Section 7 fails — the audit was run mouse-only.

## Outputs

```yaml
outputs:
  - motor-access-findings.md         # full findings in rubric format
  - motor-access-scorecard.json      # per-section pass/warn/fail + summary
  - remediation-priority-list.md     # findings ordered by severity × leverage
```

Write all three under `evidence/<run-id>/` where `run-id` is a short slug for the run (e.g. `pt0`, `pt1-kanban`). Conform the scorecard to [`../../../shared/schemas/scorecard.base.schema.json`](../../../shared/schemas/scorecard.base.schema.json).

## Scorecard schema

```json
{
  "audit_id": "ma-YYYYMMDD-{run-id}",
  "rubric_version": "v0.1 (Draft)",
  "rubric_path": "../../RUBRIC.md",
  "target": {
    "type": "url|screenshot|component_code|app_flow_description|product_surface_notes",
    "value": "...",
    "surfaces_audited": ["..."]
  },
  "context": {
    "input_modes_tested": ["keyboard-only", "single-pointer-no-drag"],
    "user_type": "...",
    "task": "...",
    "dense_state": "...",
    "device": "...",
    "method": "Path 1 | Path 2",
    "session_continuous_minutes": 0,
    "viewport_render_limitation": "optional — describe any rig constraint that forced Inferred rendered-measurement evidence"
  },
  "sections": {
    "keyboard_path":       { "status": "pass|warn|fail", "finding_ids": [], "positive_observations": [], "open_questions": [], "notes": "..." },
    "pointer_precision":   { "status": "pass|warn|fail", "finding_ids": [], "open_questions": [], "notes": "..." },
    "drag_dependence":     { "status": "pass|warn|fail", "finding_ids": [], "notes": "..." },
    "timeout_pressure":    { "status": "pass|warn|fail", "finding_ids": [], "notes": "..." },
    "undo_recovery":       { "status": "pass|warn|fail", "finding_ids": [], "open_questions": [], "notes": "..." },
    "error_recovery":      { "status": "pass|warn|fail", "finding_ids": [], "notes": "..." },
    "configuration_cost":  { "status": "pass|warn|fail", "finding_ids": [], "notes": "..." },
    "evidence":            { "status": "pass|warn|fail", "finding_ids": [], "open_questions": [], "notes": "..." }
  },
  "summary": {
    "overall_status": "audited_clean | warn | fail",
    "critical_count": 0,
    "high_count": 0,
    "medium_count": 0,
    "low_count": 0,
    "open_question_count": 0,
    "sections_passed": 0,
    "sections_warned": 0,
    "sections_failed": 0,
    "positive_observation_count": 0,
    "hard_failure_patterns_validated": {
      "mouse_only_control_no_keyboard_path": null,
      "target_too_small_or_crowded": null,
      "drag_only_no_single_pointer_alternative": null,
      "timeout_faster_than_user_no_extension": null,
      "misactivation_no_recovery": null
    }
  },
  "findings": [ /* full finding objects: id, severity, section, surface, load_displaced_to (shared enum), evidence_state, evidence_summary. May include the optional motor_access field from finding.extensions.json. */ ],
  "open_questions": [ /* { id, section, summary, resolution_path } */ ],
  "positive_observations": [ /* { id, section, summary } */ ],
  "exit_criteria_check": { /* see below */ }
}
```

Section keys are snake_case and match the RUBRIC sections in order: `keyboard_path`, `pointer_precision`, `drag_dependence`, `timeout_pressure`, `undo_recovery`, `error_recovery`, `configuration_cost`, `evidence`.

## Procedure

1. **Validate inputs.** Require at least one input type. Warn if `dense_state` is missing. Warn (Section 7 will fail) if neither keyboard-only nor single-pointer-no-drag was exercised.
2. **Walk sections 0 through 7 in order.** For each section:
   - Read the section's purpose, failure modes, and audit questions from the rubric.
   - Probe the available evidence against those questions. For Section 0, Tab-cycle every interactive surface with no mouse and try to escape each modal/overlay. For Section 1, measure rendered target sizes and adjacent spacing — not scanner bounds. For Section 2, run a human end-to-end single-click completion of each drag function (detection of `draggable` / DnD libraries is a discovery step only). For Section 3, trigger each timeout / auto-advance and attempt to extend or pause it. For Sections 4 and 5, attempt a mis-activation and a failed gesture and check the recovery path.
   - Where evidence is insufficient, record the gap as an open question rather than guessing. ("Evidence required: keyboard-only attempt of {flow} on {surface}.")
   - Produce zero or more findings per section. Apply Section 0's keyboard-trap precondition (automatic section Fail + page-level blocker). Frame every finding as exclusion or cost.
   - When the rig cannot render the true device viewport / contact patch, use the rendered-measurement fallback in Section 7 — mark findings Inferred, cite the measured value, and record the limitation in `context.viewport_render_limitation`.
3. **Score each section.** Pass / Warn / Fail per the shared severity model:
   - **Fail** = 1 Critical OR 3+ Highs in the section (and, for Section 0, any keyboard trap).
   - **Warn** = any finding below the Fail threshold, or an unresolved open question.
   - **Pass** = no findings and no open questions.
4. **Emit outputs.** All three files. Findings must include the Evidence line and the input mode; findings without evidence are downgraded to open questions. Every finding's `Load displaced to:` field must use the shared enum.
5. **Cite the rubric, not training data.** Every finding must trace to a section and audit question in `RUBRIC.md`. The skill must not introduce criteria that aren't in the rubric.

## Evidence states

| State | Meaning | When to use |
|---|---|---|
| **Observed** | Seen directly in a live session, with the input mode named (keyboard-only, single-pointer-no-drag, touch, switch, eye-gaze) and a screenshot or click/key path | Default for findings collected on Path 1 |
| **Inferred** | Strongly implied by observed behaviour, rendered DOM/CSS measurement, or documented design, but not directly proven on the target run | Use sparingly; the inference chain (e.g., "rendered bounding box 22×22px") must be explicit in the Evidence line |
| **Open question** | Plausible issue, but evidence is insufficient | Default for findings missing direct observation; resolve before promoting to confirmed |

A finding with no clear evidence state defaults to Open question. See [`../../../shared/evidence-states.md`](../../../shared/evidence-states.md).

## Exit criteria check

Every audit run must verify and report:

- At least 5 findings produced (or an explicit "fewer findings because the target was clean — list of sections that passed")
- Every finding maps to one of the 8 sections
- At least one finding identifies an interaction-cost or exclusion barrier (not just a generic accessibility-noncompliance note)
- Both keyboard-only and single-pointer-no-drag were exercised, or Section 7 is failed and the gap recorded
- Evidence gaps preserved as open questions
- Report obeys plain-language / short-sentence / structured-heading conventions
- No new rubric section is obviously missing (if one is, log it as a v0.2 candidate; do not invent one)

Include the check in the scorecard JSON under `exit_criteria_check`.

## What the skill must not do

- **Invent severity criteria** not defined in `RUBRIC.md`.
- **Treat a scanner pass as a Motor Access pass.** A scanner recalls only ~half of visual touch-target violations and passes valid-markup ARIA widgets that no keyboard user can operate. Rendered measurement and human completion tests are required.
- **Pass a drag or ARIA-widget finding on markup detection alone.** Detection of `draggable` / `ondragstart` / DnD libraries locates the interaction; the pass decision requires a human end-to-end single-click (or keyboard) completion.
- **Score Pass on a section where evidence was not collected.** Pass requires no findings AND no open questions.
- **Run mouse-only.** If neither keyboard-only nor single-pointer-no-drag was exercised, Section 7 fails — the audit did not test the cheapest paths a motor-impaired user has.
- **Discount severity for population size.** Motor-disabled users are ~2.2% of AT-survey respondents and rarely report barriers; the silence is a measurement artifact, not low prevalence. Hold findings at their level.
- **Treat exclusion as cost (or cost as exclusion).** A keyboard trap, a drag with no alternative, or a non-extendable timeout is exclusion (Critical). A small target, a drag with a working hidden alternative, or an extendable-but-tight timeout is cost (Low–High). Classify deliberately.
- **Apply the audit to empty / marketing / demo states** without flagging Section 7. The realistic dense, interactive state is the required surface.
- **Adaptively simplify the audit report itself.** The output must stay readable for humans under varying constraint.
- **Introduce a new `Load displaced to:` value.** The enum is shared and fixed at 11 values. Use the RUBRIC's mapping table.
- **Treat positive observations as findings.** Positive findings (Section X passes well) go in `positive_observations`, not `findings`.

## Failure-mode patterns the rubric is meant to catch

A useful audit should be able to detect at least these five patterns. Validate which were exercised on each target:

1. **A control works only with a mouse** — no keyboard path, or a keyboard trap. → Section 0 Keyboard Path
2. **A target is too small or too crowded to hit reliably.** → Section 1 Pointer Precision
3. **A reorder, slider, board, or upload only works by drag.** → Section 2 Drag Dependence
4. **A timeout or auto-advance moves faster than the user can act, with no extension.** → Section 3 Timeout Pressure
5. **A mis-activation has no cheap way back.** → Section 4 Undo / Recovery + Section 5 Error Recovery

Record in the scorecard's `hard_failure_patterns_validated` block which patterns the target exercised (`true`), which it passed cleanly (`false`), and which were not exercisable on the chosen target (`null`).

## Where to file each output

```
motor-access/
├── RUBRIC.md          # canonical rubric
├── skill/
│   └── SKILL.md                     # this file
└── evidence/
    ├── PT0-candidates.md            # PT0 target shortlist
    └── pt0/                         # one folder per pressure test (created on first run)
        ├── motor-access-findings.md
        ├── motor-access-scorecard.json
        ├── remediation-priority-list.md
        └── *.png                    # screenshots
```

End of skill spec.
