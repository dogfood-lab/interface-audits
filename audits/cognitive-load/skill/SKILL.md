---
name: cognitive-load-audit
description: Cognitive Load Audit — 8-section rubric for auditing interfaces by where the cognitive work went, not whether they look simple. Invoke when the user says "cognitive load audit", "audit this UI for hidden load", "where did the load go", "run the cognitive load rubric", "check this against load displacement", or asks to evaluate a product surface for load displacement, AI compression risk, state-shift access, or configuration cost. NOT a general accessibility scan (use axe / Lighthouse for WCAG conformance) and NOT a visual design review.
---

# Cognitive Load Audit — Skill

This skill executes the rubric in [`../RUBRIC.md`](../RUBRIC.md). It does not invent criteria. The rubric is canonical; if this file and the rubric disagree, the rubric wins.

## Doctrine to honor on every run

- **The rubric is canonical.** Every finding traces to a section and audit question in `RUBRIC.md`. If a finding doesn't map to one of the 8 sections, it is not a finding produced by this skill.
- **Identify where the load moved.** Every finding must populate `Load displaced to:` using one or more values from the rubric's load-displaced-to enum. A vague displacement target is a weak finding.
- **Evidence required.** Findings carry an evidence state: **Observed** (seen directly), **Inferred** (strongly implied by observed behavior), or **Open question** (plausible but unconfirmed). Findings without evidence are recorded as open questions, not laundered into confirmed issues.
- **The report obeys its own audit.** Output must meet Section 0 (Text Load) and Section 1 (Measurable Defaults) conventions: plain language, short sentences, structured headings, readable typography. No adaptive simplification of the report itself.
- **Section 4 has a severity precondition.** AI Compression Risk is Critical only when the source was promised, claimed, fetched, or replaced. For general model generation with no source claim, classify as High/Medium provenance ambiguity. See Section 4 of the rubric for the full table.
- **Section 5 findings must classify against the sub-taxonomy** (v0.2). Every Section 5 finding sets `section_5_taxonomy` to one of: `compressed` (same capability, lower visual load — Pass/Low), `delayed` (more steps or scrolling — Medium), `hidden` (discoverability drops — High), or `removed` (capability unavailable — Critical/High). The Section-Fail threshold remains 1 Critical or 3 Highs. See Section 5 of the rubric.
- **Responsive evidence may be Inferred.** When the rig can't reduce the viewport to mobile widths (e.g., DPI-scaling + Chrome min-window clamp), DOM/CSS-class analysis is acceptable evidence — marked as Inferred, with the rig limitation documented in `context.viewport_render_limitation`. The cleaner path (headless browser with explicit viewport, or non-DPI rig) should be preferred when available. See Section 7 responsive caveat.

## Inputs

```yaml
input_types:
  - url                       # live or staging URL
  - screenshot                # PNG/JPG of a specific surface
  - component_code            # JSX/Vue/HTML for a single component
  - app_flow_description      # prose describing a multi-step flow
  - product_surface_notes     # auditor's notes on what was observed
```

At least one input is required. Multiple inputs of different types may be combined for richer coverage. Path 1 (live navigation) produces denser evidence than Path 2 (screenshots only) and is preferred for interaction-dependent sections (State Shift, Configuration Cost).

## Optional context

```yaml
optional_context:
  user_type:           "professional | casual | first-time | returning"
  task:                "what the user is trying to do on this surface"
  dense_state:         "description of the worst-case data state tested"
  low_bandwidth_state: "was the audit run while constrained? how?"
  ai_features_present: "list of AI-mediated features in scope"
  prior_audit_id:      "if this is a re-audit, the previous audit id"
```

If `dense_state` is empty, warn that Section 7 cannot pass.

## Outputs

```yaml
outputs:
  - cognitive-load-findings.md       # full findings in rubric format
  - cognitive-load-scorecard.json    # per-section pass/warn/fail + summary
  - remediation-priority-list.md     # findings ordered by severity × leverage
```

Write all three under `evidence/<pt-id>/` where `pt-id` is a short slug for the run (e.g. `pt0`, `pt1-mobile-lite`).

## Scorecard schema

```json
{
  "audit_id": "cla-YYYYMMDD-{slug}",
  "rubric_version": "v0.1",
  "rubric_path": "../../RUBRIC.md",
  "target": {
    "type": "url|screenshot|component_code|app_flow|notes",
    "value": "...",
    "surfaces_audited": ["..."]
  },
  "context": { "user_type": "...", "dense_state": "...", "low_bandwidth_state": "...", "ai_features_present": ["..."], "method": "Path 1 | Path 2", "session_continuous_minutes": 0, "viewport_render_limitation": "optional — describe any rig constraint that forced Inferred narrow-mode evidence" },
  "sections": {
    "text_load":            { "status": "pass|warn|fail", "finding_ids": [], "positive_observations": [], "open_questions": [], "notes": "..." },
    "measurable_defaults":  { "status": "pass|warn|fail", "finding_ids": [], "open_questions": [], "notes": "..." },
    "hidden_load":          { "status": "pass|warn|fail", "finding_ids": [], "notes": "..." },
    "state_shift":          { "status": "pass|warn|fail", "finding_ids": [], "positive_observations": [], "notes": "..." },
    "ai_compression_risk":  { "status": "pass|warn|fail", "finding_ids": [], "open_questions": [], "notes": "..." },
    "power_preservation":   { "status": "pass|warn|fail", "finding_ids": [], "positive_observations": [], "notes": "..." },
    "configuration_cost":   { "status": "pass|warn|fail", "finding_ids": [], "notes": "..." },
    "evidence":             { "status": "pass|warn|fail", "finding_ids": [], "open_questions": [], "notes": "..." }
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
      "ui_simple_user_hunts": null,
      "ai_summary_increases_trust_burden": null,
      "low_load_mode_unreachable_from_constrained_state": null,
      "simple_mode_removes_power": null
    }
  },
  "findings": [ /* full finding objects with id, severity, section, surface, load_displaced_to, evidence_state, evidence_summary. Section 5 findings additionally include section_5_taxonomy: "compressed" | "delayed" | "hidden" | "removed" */ ],
  "open_questions": [ /* { id, section, summary, resolution_path } */ ],
  "positive_observations": [ /* { id, section, summary } */ ],
  "exit_criteria_check": { /* see below */ }
}
```

## Procedure

1. **Validate inputs.** Require at least one input type. Warn if `dense_state` is missing.
2. **Walk sections 0 through 7 in order.** For each section:
   - Read the section's purpose, failure modes, and audit questions from the rubric.
   - Probe the available evidence (URL via live navigation, screenshot inspection, component code review, or surface notes) against those questions.
   - Where evidence is insufficient, record the gap as an open question rather than guessing. ("Evidence required: dense-state screenshot of {surface} to confirm.")
   - Produce zero or more findings per section. Apply Section 4's severity precondition where the section is AI Compression Risk. Apply Section 5's sub-taxonomy (Compressed / Delayed / Hidden / Removed) and set `section_5_taxonomy` on every Section 5 finding.
   - For responsive / narrow-mode audits where the rig can't render the actual narrow viewport, use the DOM/CSS-class fallback documented in Section 7 — mark findings as Inferred and record the rig limitation.
3. **Score each section.** Pass / Warn / Fail per the rubric severity rules:
   - **Fail** = 1 Critical OR 3+ Highs in the section
   - **Warn** = any finding below the Fail threshold, or unresolved open question
   - **Pass** = no findings and no open questions
4. **Emit outputs.** All three files. Findings must include the Evidence line; findings without evidence are downgraded to open questions. Every finding's `Load displaced to:` field must use the rubric enum.
5. **Cite the rubric, not training data.** Every finding must trace to a section and audit question in `RUBRIC.md`. The skill must not introduce criteria that aren't in the rubric.

## Evidence states

| State | Meaning | When to use |
|---|---|---|
| **Observed** | Seen directly in live session, with screenshot or click path | Default for findings collected on Path 1 |
| **Inferred** | Strongly implied by observed behavior but not directly proven | Use sparingly; explain the inference chain in the Evidence line |
| **Open question** | Plausible issue, but evidence is insufficient | Default for findings missing direct observation; resolve before promoting to confirmed |

A finding with no clear evidence state defaults to Open Question.

## Exit criteria check

Every audit run must verify and report:

- At least 5 findings produced (or explicit "fewer findings because target was clean — list of sections that passed")
- Every finding maps to one of the 8 sections
- At least one finding identifies load displacement (not just accessibility noncompliance)
- Evidence gaps preserved as open questions
- Report obeys Section 0 + Section 1 conventions
- No new rubric section is obviously missing (if one is, log it as a v0.2 candidate, do not invent one)

Include the check in the scorecard JSON under `exit_criteria_check`.

## What the skill must not do

- **Invent severity criteria** not defined in `RUBRIC.md`.
- **Score Pass on a section where evidence was not collected.** Pass requires no findings AND no open questions.
- **Treat WCAG conformance as sufficient.** Section 1 is one of eight.
- **Apply the audit to empty / marketing / demo states** without flagging Section 7.
- **Adaptively simplify the audit report itself.** The output is for humans under varying constraint and must obey Sections 0 and 1.
- **Over-fire on Section 4.** Apply the severity precondition: generic unsourced model output is provenance ambiguity (High / Medium), not Critical. Critical is reserved for source-promised, source-fetched, source-replaced, or source-grounded cases.
- **Skip the Section 5 sub-taxonomy classification.** Every Section 5 finding must populate `section_5_taxonomy`. A Section 5 finding without classification is rejected. The taxonomy is the difference between v0.1 over-collapsing and v0.2 producing useful severity signals.
- **Treat positive observations as findings.** Positive findings (Section X passes well) go in the `positive_observations` array, not the `findings` array.
- **Skip the load-displacement field.** Every finding must populate `Load displaced to:` from the rubric enum. "Other" is not an option.

## Failure-mode patterns the rubric is meant to catch

A useful audit should be able to detect at least these four patterns. Validate which were exercised on each target:

1. **UI looks simple but makes the user hunt.** → Section 2 Hidden Load
2. **AI output reduces reading but increases trust burden.** → Section 4 AI Compression Risk
3. **The low-load mode is unreachable when the user is already constrained.** → Section 3 State Shift + Section 6 Configuration Cost
4. **Beginner / focus mode removes power instead of compressing the same power surface.** → Section 5 Power Preservation

Record in the scorecard's `hard_failure_patterns_validated` block which patterns the target exercised (`true`), which it passed cleanly (`false`), and which were not exercisable on the chosen target (`null`).

## Where to file each output

```
cognitive-load-audit/
├── RUBRIC.md          # canonical rubric
├── skill/
│   └── SKILL.md                     # this file
└── evidence/
    └── pt0/                         # one folder per pressure test
        ├── cognitive-load-findings.md
        ├── cognitive-load-scorecard.json
        ├── remediation-priority-list.md
        └── *.jpeg                   # screenshots
```

End of skill spec.
