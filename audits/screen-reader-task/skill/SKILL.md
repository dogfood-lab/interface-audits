---
name: screen-reader-task-audit
description: Screen Reader Task Audit — 8-section rubric for auditing whether a screen reader user can complete a task, not whether the ARIA is valid. Invoke when the user says "screen reader task audit", "audit this for screen reader task completion", "can a screen reader finish this flow", "run the screen reader task rubric", "check this against task continuity", or asks to evaluate a surface for landmark quality, action discoverability, task-path continuity through a screen reader, dynamic-update handling, or error recovery. NOT an ARIA validity scan (use axe / Lighthouse / ARC for WCAG conformance) and NOT a visual design review.
---

# Screen Reader Task Audit — Skill

This skill executes the rubric in [`../RUBRIC.md`](../RUBRIC.md). It does not invent criteria. The rubric is canonical; if this file and the rubric disagree, the rubric wins.

## Doctrine to honor on every run

- **The rubric is canonical.** Every finding traces to a section and audit question in `RUBRIC.md`. If a finding doesn't map to one of the 8 sections, it is not a finding produced by this skill.
- **Completion, not validity.** Axe checks whether the ARIA is valid; this skill checks whether the task *completes*. A surface that passes axe can still fail this audit. Never treat a green scanner run as a pass — the scanner covers ~32% of WCAG 2.1 AA criteria and ~57% of issues by volume; this audit's whole subject is the rest.
- **Identify where the load moved.** Every finding must populate `Load displaced to:` using one or more values from the shared load-displaced-to enum in `../../shared/finding-format.md`. A vague displacement target is a weak finding.
- **Record the AT/browser pairs.** Results are pair-dependent (`aria-errormessage`, modal containment, and route-change focus all diverge across NVDA+Firefox, JAWS+Chrome, VoiceOver+Safari). Every finding sets `AT/browser pairs:` to the pairs that reproduced it. A finding on one pair and not another is still a finding — name the pairs.
- **Evidence required.** Findings carry an evidence state: **Observed** (seen directly in a live AT session), **Inferred** (strongly implied by DOM/ARIA pattern, framework behavior, or spec clause), or **Open question** (plausible but unconfirmed). Findings without evidence are recorded as open questions, not laundered into confirmed issues. A scanner reporting an attribute as "present" is **not** Observed evidence of correct behavior — verify the announcement at runtime.
- **The report obeys its own audit.** Output must meet plain-language, short-sentence, structured-heading conventions. No adaptive simplification of the report itself.
- **Section 4 has a severity precondition.** An error or empty state with **none** of landmark, live region, or heading is Critical (the NKWYDK pattern — the user cannot tell failure from "not found"). A form whose labels/errors are not programmatically associated is Critical (task-blocking), not a mere WCAG flag. `aria-errormessage` used alone, with no `aria-describedby` fallback, is High. See Section 4 of the rubric.
- **Run against a task, on real pairs.** The unit of audit is a task completed end to end (open and submit a form; find and open a record; correct an error and retry), not a page. If no task and no AT/browser pair are defined, warn that the audit cannot pass Section 7.

## Inputs

```yaml
input_types:
  - url                       # live or staging URL
  - screenshot                # PNG/JPG of a specific surface (weaker; cannot confirm announcements)
  - component_code            # JSX/Vue/HTML for a single component
  - app_flow_description      # prose describing a multi-step task flow
  - product_surface_notes     # auditor's notes on what was observed via AT
  - at_session_transcript     # screen reader speech transcript / log from a live session
```

At least one input is required. A live AT session (Path 1) produces denser, Observed evidence than screenshots or code review and is required for the interaction-dependent sections (Task path continuity, Dynamic update handling, Mode switching). Multiple inputs of different types may be combined.

## Optional context

```yaml
optional_context:
  task:                "the one task being completed end to end on this surface"
  at_browser_pairs:    "list of AT/browser pairs in scope, e.g. [NVDA+Firefox, JAWS+Chrome, VoiceOver+Safari]"
  mobile_at:           "VoiceOver iOS / TalkBack, if a mobile surface is in scope"
  dense_state:         "description of the worst-case data state tested (long list, full form, many results)"
  spa:                 "is the target a client-side-routed single-page app? (drives Section 2 emphasis)"
  ai_features_present: "any AI-mediated features in scope (announcements, summaries)"
  prior_audit_id:      "if this is a re-audit, the previous audit id"
```

If `task` is empty, warn that the audit cannot be scored — this audit is run against a task, not a page. If `at_browser_pairs` is empty, warn that Section 7 cannot pass and findings default to Inferred.

## Outputs

```yaml
outputs:
  - screen-reader-task-findings.md       # full findings in rubric format
  - screen-reader-task-scorecard.json    # per-section pass/warn/fail + summary
  - remediation-priority-list.md         # findings ordered by severity × leverage
```

Write all three under `evidence/<run-id>/` where `run-id` is a short slug for the run (e.g. `pt0`, `pt0-sr-spa-form`, `dogfood-1-handbook`). The scorecard conforms to `../../shared/schemas/scorecard.base.schema.json`; findings conform to `../../shared/schemas/finding.base.schema.json` plus this audit's `../schemas/finding.extensions.json`.

## Scorecard schema

Section keys are snake_case and match the rubric sections in order.

```json
{
  "audit_id": "sra-YYYYMMDD-{slug}",
  "rubric_version": "v0.1 (Draft)",
  "rubric_path": "../../RUBRIC.md",
  "target": {
    "type": "url|screenshot|component_code|app_flow_description|product_surface_notes|documentation",
    "value": "...",
    "platform": "web | iOS | Android | desktop",
    "surfaces_audited": ["..."]
  },
  "context": {
    "task": "the task completed end to end",
    "at_browser_pairs": ["NVDA+Firefox", "JAWS+Chrome", "VoiceOver+Safari"],
    "dense_state": "...",
    "spa": false,
    "method": "Path 1 (live AT) | Path 2 (screenshots) | doc-fallback",
    "session_continuous_minutes": 0,
    "viewport_render_limitation": "optional — describe any rig/AT constraint that forced Inferred evidence"
  },
  "sections": {
    "landmark_quality":         { "status": "pass|warn|fail", "finding_ids": [], "positive_observations": [], "open_questions": [], "notes": "..." },
    "action_discoverability":   { "status": "pass|warn|fail", "finding_ids": [], "open_questions": [], "notes": "..." },
    "task_path_continuity":     { "status": "pass|warn|fail", "finding_ids": [], "open_questions": [], "notes": "..." },
    "dynamic_update_handling":  { "status": "pass|warn|fail", "finding_ids": [], "open_questions": [], "notes": "..." },
    "error_recovery":           { "status": "pass|warn|fail", "finding_ids": [], "open_questions": [], "notes": "..." },
    "mode_switching":           { "status": "pass|warn|fail", "finding_ids": [], "notes": "..." },
    "configuration_cost":       { "status": "pass|warn|fail", "finding_ids": [], "notes": "..." },
    "evidence":                 { "status": "pass|warn|fail", "finding_ids": [], "open_questions": [], "notes": "..." }
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
    "hard_failure_patterns_validated": {
      "passes_axe_cannot_submit": null,
      "view_changed_sr_left_behind": null,
      "dynamic_update_never_announced": null,
      "cannot_tell_failure_from_not_found": null
    }
  },
  "findings": [ /* full finding objects with id, severity, section, surface, load_displaced_to, evidence_state, evidence_summary, and at_browser_pairs */ ],
  "open_questions": [ /* { id, section, summary, resolution_path } */ ],
  "positive_observations": [ /* { id, section, summary } */ ],
  "exit_criteria_check": { /* see below */ }
}
```

## Procedure

1. **Validate inputs.** Require at least one input type. Require a `task`. Warn if `at_browser_pairs` is missing (findings default to Inferred and Section 7 cannot pass).
2. **Walk sections 0 through 7 in order.** For each section:
   - Read the section's purpose, failure modes, and audit questions from the rubric.
   - Drive the task on each named AT/browser pair and probe the available evidence against the questions — by live AT session where possible, DOM/ARIA inspection otherwise.
   - For attribute-dependent checks (live regions, `aria-errormessage`/`aria-describedby`, `aria-modal`), verify the **announced behavior at runtime**, not the presence of the attribute. A scanner-reported "present" attribute does not close the finding.
   - Where evidence is insufficient, record the gap as an open question rather than guessing. ("Evidence required: live NVDA+Firefox pass on {surface} to confirm the route-change announcement.")
   - Produce zero or more findings per section, each with `AT/browser pairs:` populated. Apply Section 4's severity precondition where the section is Error recovery.
   - Where a live AT session is not available (no rig, auth gate), use the documentation/DOM-pattern fallback per `../../shared/evidence-states.md` — mark findings Inferred, cite the specific attribute pattern or spec clause, and record the limitation in `context.viewport_render_limitation`.
3. **Score each section.** Pass / Warn / Fail per `../../shared/severity-model.md`:
   - **Fail** = 1 Critical OR 3+ Highs in the section
   - **Warn** = any finding below the Fail threshold, or an unresolved open question
   - **Pass** = no findings and no open questions
4. **Emit outputs.** All three files. Findings must include the Evidence line and the AT/browser pairs; findings without evidence are downgraded to open questions. Every finding's `Load displaced to:` field uses the shared enum.
5. **Cite the rubric, not training data.** Every finding traces to a section and audit question in `RUBRIC.md`. The skill must not introduce criteria that aren't in the rubric.

## Evidence states

| State | Meaning | When to use |
|---|---|---|
| **Observed** | Seen directly in a live AT session, with speech transcript, keystroke path, or screenshot | Default for findings collected on Path 1 (live AT) |
| **Inferred** | Strongly implied by DOM/ARIA pattern, framework behavior, or spec clause, but not directly heard on the run | Use sparingly; the inference chain (which attribute, which spec clause, which framework default) must be explicit in the Evidence line |
| **Open question** | Plausible issue, but evidence is insufficient | Default for findings missing direct AT observation; resolve before promoting to confirmed |

A finding with no clear evidence state defaults to Open question. See `../../shared/evidence-states.md`.

## Exit criteria check

Every audit run must verify and report:

- At least 5 findings produced (or explicit "fewer findings because the task completed cleanly — list of sections that passed")
- Every finding maps to one of the 8 sections
- Every finding records its AT/browser pairs
- At least one finding identifies a task-completion failure (not just an ARIA-validity defect)
- Evidence gaps preserved as open questions
- Report obeys plain-language / short-sentence / structured-heading conventions
- No new rubric section is obviously missing (if one is, log it as a candidate for the next version cut; do not invent one)

Include the check in the scorecard JSON under `exit_criteria_check`.

## What the skill must not do

- **Invent severity criteria** not defined in `RUBRIC.md`.
- **Treat a green scanner run as a pass.** Axe/Lighthouse/ARC check ARIA validity; this audit checks task completion. A passes-axe surface can fail every section here.
- **Close a finding on attribute presence.** A scanner-reported `aria-live`, `aria-describedby`, or `aria-errormessage` is not evidence the announcement fired. Verify at runtime or mark the finding Inferred/Open question.
- **Score Pass on a section where evidence was not collected.** Pass requires no findings AND no open questions.
- **Test a single AT/browser pair and report it as general.** Behavior diverges across pairs; record which pairs reproduced each finding.
- **Audit a page instead of a task.** The unit is a task completed end to end. A page with no task defined cannot be scored.
- **Skip the AT/browser-pairs field.** Every finding must populate it. An empty pairs field downgrades the finding to an open question.
- **Skip the load-displacement field.** Every finding must populate `Load displaced to:` from the shared enum in `../../shared/finding-format.md`. "Other" is not an option.
- **Treat positive observations as findings.** Positive observations (a section that completes the task cleanly) go in the `positive_observations` array, not `findings`.
- **Adaptively simplify the audit report itself.** The output is for humans under varying constraint and must obey the plain-language conventions.

## Failure-mode patterns the rubric is meant to catch

A useful run should be able to detect at least these four patterns. Record which were exercised on each target in the scorecard's `hard_failure_patterns_validated` block (`true` = exercised, `false` = passed cleanly, `null` = not exercisable on this target):

1. **Passes axe, cannot be submitted.** → Section 1 Action discoverability + Section 4 Error recovery
2. **The view changed and the screen reader was left behind.** → Section 2 Task path continuity
3. **The page changed under the user and they never heard it.** → Section 3 Dynamic update handling
4. **The user cannot tell whether they failed or simply missed it.** → Section 4 Error recovery (NKWYDK)

## Where to file each output

```
screen-reader-task/
├── RUBRIC.md          # canonical rubric
├── skill/
│   └── SKILL.md                       # this file
└── evidence/
    ├── PT0-candidates.md              # PT0 target shortlist (pre-run)
    └── <run-id>/                      # one folder per pressure test / dogfood run
        ├── screen-reader-task-findings.md
        ├── screen-reader-task-scorecard.json
        ├── remediation-priority-list.md
        └── *.jpeg / *.txt             # screenshots, AT transcripts
```

End of skill spec.
