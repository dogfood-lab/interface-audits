---
name: low-vision-audit
description: Low-Vision Audit — 8-section rubric for auditing visual access under real magnification, not just contrast at 100% zoom. Invoke when the user says "low-vision audit", "audit this for low vision", "check this at 400% zoom", "does this reflow", "run the low-vision rubric", "check focus visibility in high-contrast mode", or asks to evaluate a surface for zoom/reflow loss, contrast on photos and charts, focus visibility under custom themes, or spatial orientation under magnification. NOT a general accessibility scan (use axe / Lighthouse for WCAG conformance) and NOT a screen-reader / blindness audit (that is the Screen Reader Task audit).
---

# Low-Vision Audit — Skill

This skill executes the rubric in [`../RUBRIC.md`](../RUBRIC.md). It does not invent criteria. The rubric is canonical; if this file and the rubric disagree, the rubric wins.

## Doctrine to honor on every run

- **The rubric is canonical.** Every finding traces to a section and audit question in `RUBRIC.md`. If a finding doesn't map to one of the 8 sections, it is not a finding produced by this skill.
- **Identify where the access cost moved.** Every finding must populate `Load displaced to:` using one or more values from the shared enum in [`../../../shared/finding-format.md`](../../../shared/finding-format.md). This audit adds no new displacement values; map low-vision failures onto the shared 11 (see the mapping table in `RUBRIC.md`). A vague displacement target is a weak finding.
- **Evidence required.** Findings carry an evidence state: **Observed** (seen directly at the stated zoom level and test path), **Inferred** (strongly implied by observed behavior or framework class), or **Open question** (plausible but unconfirmed). Findings without evidence are recorded as open questions, not laundered into confirmed issues. See [`../../../shared/evidence-states.md`](../../../shared/evidence-states.md).
- **The report obeys its own audit.** Output must meet plain-language, short-sentence, structured-heading conventions. No tiny gray type, no decorative formatting that the audit itself would flag.
- **Browser zoom is the primary test path.** Test at 200% and 320 CSS px / 400% browser zoom first, because browser zoom and OS magnification cover the largest low-vision population; a dedicated magnifier (ZoomText / OS magnifier) is the secondary path for the panning-and-orientation sections. A surface that passes in a magnifier but fails at Chrome 400% still fails.
- **Section 1 has a severity precondition.** A WCAG AA (4.5:1) pass alone is not sufficient evidence of low-vision support. Body-weight text below 7:1 on dense small-font surfaces is High, not Low. Text over photos and marks on chart backgrounds are MANUAL-ONLY and scanner-invisible. See Section 1 of the rubric.
- **Section 2 / 5 focus-in-WHCM is Critical.** A focus indicator that relies on `box-shadow` disappears in Windows High Contrast Mode (forced-colors sets `box-shadow: none`). Test under `forced-colors: active`. This is Critical because the failure is invisible under default testing and targets the exact population that enables high-contrast.
- **Section 4 references, does not duplicate, Cognitive Load Section 1.** The WCAG-floor size/spacing checks belong to the [Cognitive Load audit's Section 1](../../cognitive-load/RUBRIC.md). This skill's Section 4 produces findings only for the low-vision extensions: viewport-unit font sizing (check computed styles at zoom, not authored CSS), the 7:1 dense-surface threshold, and spacing collapse under sustained magnification.
- **Responsive evidence may be Inferred.** When the rig can't reduce the viewport to mobile widths (DPI-scaling + Chrome min-window clamp), DOM/CSS-class analysis is acceptable evidence — marked Inferred, with the rig limitation documented in `context.viewport_render_limitation`. Browser-zoom testing usually does not need this workaround; the caveat applies mainly to true mobile-width reflow. The cleaner path (headless browser with explicit viewport) should be preferred when available. See the Section 7 caveat.

## Inputs

```yaml
input_types:
  - url                       # live or staging URL (preferred — browser zoom testable)
  - screenshot                # PNG/JPG of a specific surface, ideally at the tested zoom level
  - component_code            # JSX/Vue/HTML/CSS for a single component
  - app_flow_description      # prose describing a multi-step flow
  - product_surface_notes     # auditor's notes on what was observed at zoom
```

At least one input is required. Multiple inputs of different types may be combined for richer coverage. Path 1 (live navigation with real browser zoom) produces denser evidence than Path 2 (screenshots only) and is strongly preferred for the zoom, focus, and orientation sections — those are runtime and magnifier-dependent.

## Optional context

```yaml
optional_context:
  test_path:           "browser_zoom | dedicated_magnifier | both"
  zoom_levels_tested:  "e.g. 200%, 400% (320 CSS px)"
  theme_modes_tested:  "e.g. light, dark, forced-colors / Windows High Contrast"
  dense_state:         "description of the worst-case data state tested"
  task:                "what the user is trying to do on this surface"
  at_software:         "magnifier used, if any (ZoomText, OS magnifier, browser zoom only)"
  prior_audit_id:      "if this is a re-audit, the previous audit id"
```

If `dense_state` is empty, warn that Section 7 cannot pass. If no zoom level above 100% was tested, warn that Sections 0, 3, and 4 cannot pass.

## Outputs

```yaml
outputs:
  - low-vision-findings.md            # full findings in rubric format
  - low-vision-scorecard.json         # per-section pass/warn/fail + summary
  - remediation-priority-list.md      # findings ordered by severity × leverage
```

Write all three under `evidence/<run-id>/` where `run-id` is a short slug for the run (e.g. `pt0`, `pt1-dashboard-zoom`). No evidence directory exists yet — the first pressure test creates `evidence/pt0/`.

## Scorecard schema

Conforms to [`../../../shared/schemas/scorecard.base.schema.json`](../../../shared/schemas/scorecard.base.schema.json). Section keys are snake_case and match the RUBRIC sections.

```json
{
  "audit_id": "lv-YYYYMMDD-{slug}",
  "rubric_version": "v0.1 (Draft)",
  "rubric_path": "../../RUBRIC.md",
  "target": {
    "type": "url|screenshot|component_code|app_flow_description|product_surface_notes",
    "value": "...",
    "surfaces_audited": ["..."]
  },
  "context": {
    "test_path": "browser_zoom | dedicated_magnifier | both",
    "zoom_levels_tested": "200%, 400%",
    "theme_modes_tested": ["light", "dark", "forced-colors"],
    "dense_state": "...",
    "task": "...",
    "at_software": "...",
    "method": "Path 1 | Path 2",
    "session_continuous_minutes": 0,
    "viewport_render_limitation": "optional — describe any rig constraint that forced Inferred narrow-mode evidence"
  },
  "sections": {
    "zoom_and_reflow":         { "status": "pass|warn|fail", "finding_ids": [], "open_questions": [], "notes": "..." },
    "contrast_under_density":  { "status": "pass|warn|fail", "finding_ids": [], "open_questions": [], "notes": "..." },
    "focus_visibility":        { "status": "pass|warn|fail", "finding_ids": [], "notes": "..." },
    "spatial_orientation":     { "status": "pass|warn|fail", "finding_ids": [], "notes": "..." },
    "font_spacing_extensions": { "status": "pass|warn|fail", "finding_ids": [], "notes": "..." },
    "mode_switching":          { "status": "pass|warn|fail", "finding_ids": [], "notes": "..." },
    "configuration_cost":      { "status": "pass|warn|fail", "finding_ids": [], "notes": "..." },
    "evidence":                { "status": "pass|warn|fail", "finding_ids": [], "open_questions": [], "notes": "..." }
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
      "text_disappears_on_reflow": null,
      "contrast_fails_on_real_surfaces": null,
      "focus_vanishes_in_high_contrast": null,
      "place_lost_on_reflow": null
    }
  },
  "findings": [ /* full finding objects: id, severity, section, surface, load_displaced_to, evidence_state, evidence_summary. Section 0 findings may set lv_reflow_pattern. */ ],
  "open_questions": [ /* { id, section, summary, resolution_path } */ ],
  "positive_observations": [ /* { id, section, summary } */ ],
  "exit_criteria_check": { /* see below */ }
}
```

The optional domain field `lv_reflow_pattern` (from [`../schemas/finding.extensions.json`](../schemas/finding.extensions.json)) classifies Section 0 reflow findings as `text_loss` / `horizontal_scroll` / `reflow_content_loss` / `sticky_block` / `overlap` / `spacing_collapse`. It is additive; it does not replace any base field.

## Procedure

1. **Validate inputs.** Require at least one input type. Warn if `dense_state` is missing, or if no zoom level above 100% was tested.
2. **Walk sections 0 through 7 in order.** For each section:
   - Read the section's purpose, failure modes, and audit questions from the rubric.
   - Probe the available evidence (URL via live browser zoom at 200% and 400%, screenshot inspection, component/CSS review, or surface notes) against those questions.
   - Where evidence is insufficient, record the gap as an open question rather than guessing. ("Evidence required: 400% browser-zoom screenshot of {surface} to confirm sticky occlusion.")
   - Produce zero or more findings per section. Apply Section 1's severity precondition (7:1 on dense surfaces; photos/charts MANUAL-ONLY). Apply the Section 2 / 5 forced-colors focus rule (Critical). For Section 4, produce only the low-vision extension findings; defer WCAG-floor size/spacing to Cognitive Load Section 1.
   - For responsive / mobile-width audits where the rig can't render the actual narrow viewport, use the DOM/CSS-class fallback from the Section 7 caveat — mark findings Inferred and record the rig limitation.
3. **Score each section.** Pass / Warn / Fail per the shared severity model in [`../../../shared/severity-model.md`](../../../shared/severity-model.md):
   - **Fail** = 1 Critical OR 3+ Highs in the section
   - **Warn** = any finding below the Fail threshold, or an unresolved open question
   - **Pass** = no findings and no open questions
4. **Emit outputs.** All three files. Findings must include the Evidence line with zoom level and test path; findings without evidence are downgraded to open questions. Every finding's `Load displaced to:` field uses the shared enum.
5. **Cite the rubric, not training data.** Every finding traces to a section and audit question in `RUBRIC.md`. The skill must not introduce criteria that aren't in the rubric.

## Evidence states

| State | Meaning | When to use |
|---|---|---|
| **Observed** | Seen directly at the stated zoom level and test path, with screenshot or click path | Default for findings collected on Path 1 (live browser zoom) |
| **Inferred** | Strongly implied by observed behavior or framework class, but not directly proven on the run | Use sparingly; explain the inference chain in the Evidence line; required when the rig can't render the narrow viewport |
| **Open question** | Plausible issue, but evidence is insufficient | Default for findings missing direct observation; resolve before promoting to confirmed |

A finding with no clear evidence state defaults to Open question. See [`../../../shared/evidence-states.md`](../../../shared/evidence-states.md).

## Exit criteria check

Every audit run must verify and report:

- At least 5 findings produced (or explicit "fewer findings because target was clean — list of sections that passed")
- Every finding maps to one of the 8 sections
- At least one finding identifies a scanner-invisible failure (reflow loss, text on photo, chart marks, focus-in-WHCM, place loss) — not just CSS-detectable contrast
- The audit was run at a real magnification above 100% (zoom level recorded)
- Evidence gaps preserved as open questions
- Report obeys plain-language / structured-heading conventions
- No new rubric section is obviously missing (if one is, log it as a candidate for the next version cut; do not invent one)

Include the check in the scorecard JSON under `exit_criteria_check`.

## What the skill must not do

- **Invent severity criteria** not defined in `RUBRIC.md`.
- **Score Pass on a section where evidence was not collected.** Pass requires no findings AND no open questions.
- **Treat a WCAG AA contrast pass as sufficient.** Section 1's precondition requires 7:1 on dense surfaces, and contrast scanners cannot see text on photos or marks on charts.
- **Test only at 100% zoom.** Sections 0, 3, and 4 require a real magnification above 100%. A 100%-only run cannot Pass them.
- **Test only the light theme.** Section 2 and Section 5 require a forced-colors / high-contrast pass; the `box-shadow` focus failure is invisible otherwise.
- **Duplicate Cognitive Load Section 1.** The WCAG-floor size/spacing checks live there. Section 4 produces only the low-vision extensions.
- **Add new load-displaced-to values.** The shared 11-value enum is fixed. Map low-vision failures onto it (see the mapping table in `RUBRIC.md`).
- **Treat positive observations as findings.** Positive observations (a section passes well) go in the `positive_observations` array, not `findings`.
- **Launder open questions into Observed findings.** A finding designed to fit the test's scope but lacking evidence is an open question. Reclassification on second pass is the audit working.

## Failure-mode patterns the rubric is meant to catch

A useful low-vision audit should be able to detect at least these four patterns. Record which were exercised on each target in the scorecard's `hard_failure_patterns_validated` block (`true` = exercised, `false` = passed cleanly, `null` = not exercisable on this target):

1. **Text disappears on reflow.** → Section 0 Zoom & Reflow
2. **Contrast passes the scanner but fails on photos / charts.** → Section 1 Contrast under real density
3. **Focus vanishes under the theme low-vision users enable.** → Section 2 Focus visibility + Section 5 Mode switching
4. **The user loses their place when the page reflows.** → Section 3 Spatial orientation

## Where to file each output

```
low-vision/
├── RUBRIC.md          # canonical rubric
├── skill/
│   └── SKILL.md                     # this file
└── evidence/
    ├── PT0-candidates.md            # ranked PT0 target shortlist (exists)
    └── pt0/                         # created by the first pressure test
        ├── low-vision-findings.md
        ├── low-vision-scorecard.json
        ├── remediation-priority-list.md
        └── *.png                    # screenshots at the tested zoom level
```

End of skill spec.
