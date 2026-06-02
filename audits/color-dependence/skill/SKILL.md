---
name: color-dependence-audit
description: Color Dependence Audit — 7-section rubric for auditing interfaces by whether meaning carried by color survives the loss of hue, not whether the contrast is high enough. Invoke when the user says "color dependence audit", "audit this for color-blind users", "color blindness audit", "run the color dependence rubric", "does this read without color", "check this against the use-of-color criterion", or asks to evaluate status badges, chart/graph encodings, form-validation signals, or mode indication for color-only meaning. NOT a WCAG contrast scan (use axe / Lighthouse / Pa11y for SC 1.4.3) and NOT a palette aesthetics review.
---

# Color Dependence Audit — Skill

This skill executes the rubric in [`../RUBRIC.md`](../RUBRIC.md). It does not invent criteria. The rubric is canonical; if this file and the rubric disagree, the rubric wins.

## Doctrine to honor on every run

- **The rubric is canonical.** Every finding traces to a section and audit question in `RUBRIC.md`. If a finding doesn't map to one of the 7 sections, it is not a finding produced by this skill.
- **Use of color is not contrast.** A passing WCAG 1.4.3 luminance-contrast ratio does not satisfy 1.4.1. Every check carries a Contrast-Pass / Hue-Fail test: when a color pair passes contrast, the skill must still ask whether the pair collapses under protan/deutan simulation. A high luminance score never offsets a hue-confusion failure.
- **Qualify the tool before recording findings (the methods gate).** Section 4 is a precondition, not just a section. The CVD simulator must use a physiologically-validated model (Brettel/Viénot/Mollon 1997 or Machado/Oliveira/Fernandes 2009) — desaturation is not CVD simulation — and the pipeline must apply sRGB→linear decode before the CVD matrix. Record the tool name and version. A finding produced by an unqualified tool is not a finding.
- **Identify where the burden moved.** Every finding must populate `Load displaced to:` using one or more values from the shared enum. For this audit the primary value is almost always `visual decoding`, usually combined with `memory`, `trust`, or `verification`. A vague displacement target is a weak finding.
- **Evidence required, with the two-tier BLOCK rule.** Findings carry an evidence state: **Observed**, **Inferred**, or **Open question**. A finding may be scored at its section severity on qualified-simulator evidence as **Inferred**. A finding may only be marked **BLOCK / Observed-blocking** after confirmation by at least one CVD tester — simulation correlates with real quality but is validated only for simulated screenshots, not real-user task performance.
- **Dichromacy-only findings are POTENTIAL-FAIL.** A failure seen only under a dichromacy-only simulator (no anomalous-trichromacy confirmation) is recorded as Medium / POTENTIAL-FAIL, not at full severity, until confirmed by a Machado-model tool at the appropriate severity level. This is the brake against over-reporting. See Section 4 of the rubric.
- **The report obeys its own audit.** Output must meet plain-language, short-sentence, structured-heading conventions. And it must not itself depend on color: do not encode finding severity or section status by color alone in any rendered output — always pair it with text.

## Inputs

```yaml
input_types:
  - url                       # live or staging URL
  - screenshot                # PNG/JPG of a specific surface (will be run through CVD simulation)
  - component_code            # JSX/Vue/HTML/CSS for a single component
  - app_flow_description      # prose describing a multi-step flow with state changes
  - product_surface_notes     # auditor's notes on what was observed
```

At least one input is required. Multiple inputs of different types may be combined for richer coverage. Path 1 (live navigation) produces denser evidence than Path 2 (screenshots only) and is required for state-dependent sections (Mode / State Indication). Screenshots are usable for Sections 0–2 because they can be run through the simulator.

## Optional context

```yaml
optional_context:
  user_type:           "professional | casual | first-time | returning"
  task:                "what the user is trying to do on this surface"
  meaningful_state:    "the state where color actually carries meaning (status mix, multi-series chart, form mid-error, non-default mode)"
  simulation_tool:     "tool name + version used for CVD simulation"
  cvd_classes_tested:  "which of deutan / protan / tritan / monochromacy were simulated"
  cvd_tester_present:  "was a real CVD tester available to confirm blocking findings?"
  prior_audit_id:      "if this is a re-audit, the previous audit id"
```

If `meaningful_state` is empty, warn that Section 6 cannot pass. If `simulation_tool` is missing or unqualified, the Section 4 methods gate fails and CVD findings cannot be recorded.

## Outputs

```yaml
outputs:
  - color-dependence-findings.md       # full findings in rubric format
  - color-dependence-scorecard.json    # per-section pass/warn/fail + summary
  - remediation-priority-list.md       # findings ordered by severity × leverage
```

Write all three under `evidence/<run-id>/` where `run-id` is a short slug for the run (e.g. `pt0`, `pt1-grafana`).

## Scorecard schema

```json
{
  "audit_id": "cda-YYYYMMDD-{slug}",
  "rubric_version": "v0.1 (draft)",
  "rubric_path": "../../RUBRIC.md",
  "target": {
    "type": "url|screenshot|component_code|app_flow_description|product_surface_notes",
    "value": "...",
    "surfaces_audited": ["..."]
  },
  "context": {
    "user_type": "...",
    "task": "...",
    "meaningful_state": "...",
    "method": "Path 1 | Path 2",
    "simulation_tool": "tool name + version",
    "simulation_tool_qualified": false,
    "srgb_linearization_verified": false,
    "cvd_classes_tested": ["deuteranopia", "protanopia", "tritanopia", "monochromacy"],
    "cvd_tester_present": false
  },
  "sections": {
    "color_only_conveyance":   { "status": "pass|warn|fail", "finding_ids": [], "positive_observations": [], "open_questions": [], "notes": "..." },
    "chart_graph_encoding":    { "status": "pass|warn|fail", "finding_ids": [], "open_questions": [], "notes": "..." },
    "form_validation":         { "status": "pass|warn|fail", "finding_ids": [], "notes": "..." },
    "mode_state_indication":   { "status": "pass|warn|fail", "finding_ids": [], "notes": "..." },
    "cvd_simulation":          { "status": "pass|warn|fail", "finding_ids": [], "open_questions": [], "notes": "tool-qualification gate result" },
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
      "status_color_only": null,
      "chart_unreadable_without_color": null,
      "form_error_hue_only": null,
      "mode_state_hue_only": null,
      "contrast_pass_hue_fail": null
    }
  },
  "findings": [ /* full finding objects: id, severity, section, surface, load_displaced_to, evidence_state, evidence_summary. CD findings additionally include cvd_class_affected and contrast_pass_hue_fail */ ],
  "open_questions": [ /* { id, section, summary, resolution_path } */ ],
  "positive_observations": [ /* { id, section, summary } */ ],
  "exit_criteria_check": { /* see below */ }
}
```

Section keys are snake_case and match the rubric's 7 sections in order: `color_only_conveyance`, `chart_graph_encoding`, `form_validation`, `mode_state_indication`, `cvd_simulation`, `configuration_cost`, `evidence`.

## Procedure

1. **Validate inputs.** Require at least one input type. Warn if `meaningful_state` is missing.
2. **Run the Section 4 methods gate first.** Before any CVD finding: confirm the simulator uses a physiologically-validated model and passes the sRGB-linearization check; record tool + version; confirm which CVD classes are available. If the tool is unqualified, the `cvd_simulation` section fails and Sections 0–3 cannot be scored Pass on CVD grounds — record the gap as an open question and stop manufacturing CVD findings.
3. **Walk sections 0 through 6 in order.** For each section:
   - Read the section's purpose, failure modes, and audit questions from the rubric.
   - Probe the available evidence against those questions, including the mandatory Contrast-Pass / Hue-Fail test: where a color pair passes 1.4.3, run it through protan/deutan simulation and check whether the distinction survives.
   - Where evidence is insufficient, record the gap as an open question rather than guessing.
   - Produce zero or more findings per section. Apply Section 4's dichromacy-only POTENTIAL-FAIL precondition. Apply Section 6's two-tier BLOCK rule.
4. **Score each section.** Pass / Warn / Fail per the shared severity model:
   - **Fail** = 1 Critical OR 3+ Highs in the section
   - **Warn** = any finding below the Fail threshold, or an unresolved open question
   - **Pass** = no findings and no open questions
5. **Emit outputs.** All three files. Every finding includes the Evidence line and the CVD class affected; findings without evidence are downgraded to open questions. Every finding's `Load displaced to:` field uses the shared enum.
6. **Cite the rubric, not training data.** Every finding traces to a section and audit question in `RUBRIC.md`. The skill must not introduce criteria that aren't in the rubric.

## Evidence states

| State | Meaning | When to use |
|---|---|---|
| **Observed** | Seen directly under a qualified simulator, with screenshot or click path. **Observed-blocking / BLOCK** additionally requires CVD-tester confirmation. | Default for findings collected on Path 1 with a qualified tool |
| **Inferred** | Strongly implied by a qualified simulation or by documented design (CSS classes, framework patterns, vendor docs), but not confirmed by a real CVD user | Use for simulation-only findings; explain the inference chain in the Evidence line |
| **Open question** | Plausible issue, but evidence is insufficient (e.g. state not exercised, tool unqualified) | Default for any finding that does not meet Observed or Inferred; document the resolution path |

A finding with no clear evidence state defaults to Open question.

## Exit criteria check

Every audit run must verify and report:

- The Section 4 methods gate ran, and its result (qualified / unqualified) is recorded in the scorecard `context`
- At least 5 findings produced (or explicit "fewer findings because target was clean — list of sections that passed")
- Every finding maps to one of the 7 sections
- At least one finding identifies a Contrast-Pass / Hue-Fail case (or an explicit note that no contrast-passing color pair was found to lie on a confusion line)
- Evidence gaps preserved as open questions
- No blocking finding is marked BLOCK without CVD-tester confirmation (two-tier rule)
- Report obeys plain-language conventions and does not encode its own meaning by color alone
- No new rubric section is obviously missing (if one is, log it as a candidate, do not invent one)

Include the check in the scorecard JSON under `exit_criteria_check`.

## What the skill must not do

- **Invent severity criteria** not defined in `RUBRIC.md`.
- **Treat a passing contrast scan as compliance.** A green pass from axe / Lighthouse / Pa11y covers SC 1.4.3, not SC 1.4.1. The audit exists for the failures that hide behind a contrast pass.
- **Record CVD findings from an unqualified tool.** No physiological model or no sRGB-linearization check = no findings. Desaturation is not simulation.
- **Promote a dichromacy-only finding to full severity** without anomalous-trichromacy confirmation. It stays POTENTIAL-FAIL (Medium).
- **Mark a finding BLOCK on simulation alone.** Blocking requires a CVD tester.
- **Score Pass on a section where evidence was not collected.** Pass requires no findings AND no open questions.
- **Apply the audit to empty / marketing / demo states** without flagging Section 6 — color carries no meaning in a state where there is no status, error, or data.
- **Encode the report's own severity or section status by color alone.** The output is for CVD users too; always pair color with text.
- **Skip the load-displacement field.** Every finding populates `Load displaced to:` from the shared enum. "Other" is not an option, and the enum may not be extended.

## Failure-mode patterns the rubric is meant to catch

A useful run should be able to detect at least these five patterns. Validate which were exercised on each target:

1. **Status conveyed only by color.** → Section 0
2. **Chart that does not read without color.** → Section 1
3. **Form error signaled only by hue.** → Section 2
4. **Mode/state indicated only by color.** → Section 3
5. **Contrast-Pass / Hue-Fail** — a color pair passes 1.4.3 but collapses under simulation. → every section's boundary test

Record in the scorecard's `hard_failure_patterns_validated` block which patterns the target exercised (`true`), which it passed cleanly (`false`), and which were not exercisable on the chosen target (`null`).

## Where to file each output

```
color-dependence/
├── RUBRIC.md          # canonical rubric
├── skill/
│   └── SKILL.md                     # this file
└── evidence/
    ├── PT0-candidates.md            # ranked target shortlist (pre-PT)
    └── <run-id>/                    # one folder per pressure test / dogfood run
        ├── color-dependence-findings.md
        ├── color-dependence-scorecard.json
        ├── remediation-priority-list.md
        └── *.png                    # screenshots, including CVD-simulated versions
```

End of skill spec.
