---
name: ai-trust-surface-audit
description: AI Trust Surface Audit — 8-section rubric for auditing whether a user can safely depend on an AI surface when the model is wrong. Invoke when the user says "AI trust audit", "audit this AI feature for trust", "can the user undo what the AI did", "check the provenance on this AI output", "audit the citations / sources", "is this confidence calibrated", "run the AI trust surface rubric", "check for forced trust / manufactured trust / placebo controls", or asks to evaluate an AI surface for provenance, reversibility, inspection, confidence communication, adaptation transparency, or user control. NOT a model-accuracy benchmark (measure that separately — this audit assumes the model is sometimes wrong and tests the surface around it). NOT the Cognitive Load audit's AI-summary check (that audit's Section 4 owns source provenance for AI summaries; this audit references-and-extends it into a full provenance and recovery doctrine).
---

# AI Trust Surface Audit — Skill

This skill executes the rubric in [`../RUBRIC.md`](../RUBRIC.md). It does not invent criteria. The rubric is canonical; if this file and the rubric disagree, the rubric wins.

## Doctrine to honor on every run

- **The rubric is canonical.** Every finding traces to a section and audit question in `RUBRIC.md`. If a finding doesn't map to one of the 8 sections (S0–S7), it is not a finding produced by this skill.
- **Trust is about the failure path, not the average case.** This audit assumes the model is sometimes wrong. A surface that handles correct output beautifully and provides no inspect/undo/trace path when the output is wrong fails. Model accuracy is measured separately and is not this audit's job.
- **Identify where the trust cost moved.** Every finding must populate `Load displaced to:` using one or more values from the shared enum in [`../../../shared/finding-format.md`](../../../shared/finding-format.md). This audit adds no new displacement values; map AI-trust failures onto the shared 11 (see the mapping table in `RUBRIC.md`). A vague displacement target is a weak finding.
- **Evidence required, and it must include a failure case.** Findings carry an evidence state: **Observed** (seen directly), **Inferred** (strongly implied by observed behavior, DOM/markup, or vendor docs), or **Open question** (plausible but unconfirmed). Findings without evidence are recorded as open questions, not laundered into confirmed issues. An affordance scored as passing must have been exercised on a *sub-optimal / wrong / fabricated* AI output, not just a correct one — that is Section 7. See [`../../../shared/evidence-states.md`](../../../shared/evidence-states.md).
- **The report obeys its own audit.** Output must be plain-language, structured, and itself inspectable — it cites the findings it makes. No manufactured confidence in the audit's own claims.
- **S0 has a Critical precondition (adopted from Cognitive Load Section 4).** Provenance is **Critical only** when the AI claims or implies a verifiable basis — it cites a source, says "based on your data," or is marketed grounded / hallucination-free — and that basis is not inspectable or not faithful. Generic unsourced output with no claimed basis is High/Medium provenance ambiguity. This prevents over-firing on every unsourced model answer. See Section 0 of the rubric and the boundary note.
- **S0 references, does not duplicate, Cognitive Load Section 4.** The AI-summary source-provenance check belongs to the [Cognitive Load audit's Section 4](../../cognitive-load/RUBRIC.md). This skill's S0 produces findings for the *extensions*: attribution as a testable property [F14], the "RAG does not eliminate fabrication" floor [F15], citation existence/support [F16], correctness-vs-faithfulness [F17], and data/training provenance [F29].
- **S3 confidence: a displayed number with no calibration evidence is High.** Surfacing miscalibrated confidence is actively harmful [F2]. Placebic / manufactured-trust explanations are High [F3]. Overconfidence is the higher-severity direction and is Critical when the action is high-stakes AND irreversible (cross-link S1).
- **S5 control: a control with no observable effect on output is an automatic High** (placebo, [F23]). Self-reported satisfaction cannot verify a control works — require behavioral proof that toggling it changes output.
- **Inferred evidence may stand in for live runtime** when the surface's trust affordances are exposed in fetched markup or documented behavior, marked Inferred with the limitation recorded in `context.evidence_mode_limitation`. Live observation of the failure path is preferred when available.

## Inputs

```yaml
input_types:
  - url                       # live or public AI surface (preferred — affordances inspectable)
  - screenshot                # PNG/JPG of an AI surface, ideally on a wrong/fabricated output
  - component_code            # JSX/Vue/HTML for an AI feature (citation panel, confidence badge, undo control)
  - app_flow_description      # prose describing an AI-mediated decision flow
  - product_surface_notes     # auditor's notes on what was observed, including the failure case
```

At least one input is required. Multiple inputs of different types may be combined. Path 1 (live interaction, including triggering or finding a wrong/fabricated AI output) produces denser evidence than Path 2 (screenshots only) and is strongly preferred — the provenance, reversibility, and control sections are runtime and behavioral.

## Optional context

```yaml
optional_context:
  ai_feature:          "what the AI does here (search/RAG, summarize, recommend, automate, personalize)"
  action_stakes:       "low | medium | high — what the AI-driven action affects"
  reversibility:       "reversible | irreversible — can the action be undone?"
  failure_case_tested: "description of the sub-optimal / wrong / fabricated output exercised"
  provenance_claim:    "any grounding/accuracy claim the UI or marketing makes (cited, 'based on your data', hallucination-free)"
  controls_present:    "confidence, citations, undo, opt-out, feedback, personalization toggles observed"
  task:                "what the user is trying to do on this surface"
  prior_audit_id:      "if this is a re-audit, the previous audit id"
```

If `failure_case_tested` is empty, warn that Section 7 cannot pass and any "passing" affordance is provisional. If `provenance_claim` is unknown, S0's Critical precondition cannot be evaluated — record it as an open question rather than assuming.

## Outputs

```yaml
outputs:
  - ai-trust-surface-findings.md      # full findings in rubric format
  - ai-trust-surface-scorecard.json   # per-section pass/warn/fail + summary
  - remediation-priority-list.md      # findings ordered by severity × leverage
```

Write all three under `evidence/<run-id>/` where `run-id` is a short slug for the run (e.g. `pt0`, `pt0-perplexity`). No evidence directory exists yet — the first pressure test creates `evidence/pt0/`.

## Scorecard schema

Conforms to [`../../../shared/schemas/scorecard.base.schema.json`](../../../shared/schemas/scorecard.base.schema.json). Section keys are snake_case and match the RUBRIC sections.

```json
{
  "audit_id": "ats-YYYYMMDD-{slug}",
  "rubric_version": "v0.1 (Draft)",
  "rubric_path": "../../RUBRIC.md",
  "target": {
    "type": "url|screenshot|component_code|app_flow_description|product_surface_notes",
    "value": "...",
    "surfaces_audited": ["..."]
  },
  "context": {
    "ai_feature": "...",
    "action_stakes": "low | medium | high",
    "reversibility": "reversible | irreversible",
    "failure_case_tested": "the sub-optimal/wrong/fabricated output exercised",
    "provenance_claim": "cited | based-on-your-data | hallucination-free | none",
    "task": "...",
    "method": "Path 1 | Path 2",
    "session_continuous_minutes": 0,
    "evidence_mode_limitation": "optional — describe any constraint that forced Inferred evidence"
  },
  "sections": {
    "source_provenance":        { "status": "pass|warn|fail", "finding_ids": [], "open_questions": [], "notes": "..." },
    "reversibility":            { "status": "pass|warn|fail", "finding_ids": [], "notes": "..." },
    "inspection_affordances":   { "status": "pass|warn|fail", "finding_ids": [], "notes": "..." },
    "confidence_communication": { "status": "pass|warn|fail", "finding_ids": [], "notes": "..." },
    "adaptation_transparency":  { "status": "pass|warn|fail", "finding_ids": [], "notes": "..." },
    "user_control":             { "status": "pass|warn|fail", "finding_ids": [], "notes": "..." },
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
      "forced_trust": null,
      "manufactured_trust": null,
      "invalid_provenance": null,
      "placebo_control": null
    }
  },
  "findings": [ /* full finding objects: id, severity, section, surface, load_displaced_to, evidence_state, evidence_summary. May set at_trust_pattern and hax_phase. */ ],
  "open_questions": [ /* { id, section, summary, resolution_path } */ ],
  "positive_observations": [ /* { id, section, summary } */ ],
  "exit_criteria_check": { /* see below */ }
}
```

The optional domain fields `at_trust_pattern` and `hax_phase` (from [`../schemas/finding.extensions.json`](../schemas/finding.extensions.json)) classify a finding by its trust-failure pattern (`forced_trust` / `manufactured_trust` / `invalid_provenance` / `placebo_control` / `manipulative_personalization` / `no_recovery` / `n/a`) and by which HAX phase it lands in (`initially` / `during` / `when_wrong` / `over_time` / `n/a`). They are additive; they do not replace any base field.

## Procedure

1. **Validate inputs.** Require at least one input type. Warn if `failure_case_tested` is missing (Section 7 cannot pass). Record `action_stakes` and `reversibility` — the S0/S1/S3 Critical preconditions gate on them. Capture any `provenance_claim` the UI or marketing makes, because S0's Critical precondition depends on it.
2. **Walk sections 0 through 7 in order.** For each section:
   - Read the section's purpose, failure modes, and audit questions from the rubric.
   - Probe the available evidence (live interaction including a wrong/fabricated output, screenshot inspection, component/markup review, or surface notes) against those questions.
   - Where evidence is insufficient, record the gap as an open question rather than guessing. ("Evidence required: trigger a fabricated citation on {surface} and confirm the link resolves and supports the claim.")
   - Produce zero or more findings per section. Apply S0's Critical precondition (a verifiable basis must be claimed/implied AND not inspectable/faithful). Apply S3's confidence rules (uncalibrated number = High [F2]; placebic explanation = High [F3]; overconfident + high-stakes + irreversible = Critical). Apply S5's placebo rule (control with no observable effect = automatic High [F23]).
3. **Score each section.** Pass / Warn / Fail per the shared severity model in [`../../../shared/severity-model.md`](../../../shared/severity-model.md):
   - **Fail** = 1 Critical OR 3+ Highs in the section
   - **Warn** = any finding below the Fail threshold, or an unresolved open question
   - **Pass** = no findings and no open questions (and, for an affordance scored passing, the failure case was exercised — otherwise the pass is provisional and the section warns via Section 7)
4. **Emit outputs.** All three files. Findings must include the Evidence line naming the AI output tested (correct vs wrong/fabricated), the action it drove, and stakes/reversibility; findings without evidence are downgraded to open questions. Every finding's `Load displaced to:` field uses the shared enum.
5. **Cite the rubric, not training data.** Every finding traces to a section and audit question in `RUBRIC.md`. The skill must not introduce criteria that aren't in the rubric.

## Evidence states

| State | Meaning | When to use |
|---|---|---|
| **Observed** | Seen directly, including on a wrong/fabricated AI output, with screenshot or click path | Default for findings collected on Path 1 (live interaction) |
| **Inferred** | Strongly implied by observed behavior, fetched markup, or vendor docs, but the failure path was not directly exercised | Use sparingly; explain the inference chain in the Evidence line; record the limitation in `context.evidence_mode_limitation` |
| **Open question** | Plausible issue, but evidence is insufficient | Default for findings missing direct observation; resolve before promoting to confirmed |

A finding with no clear evidence state defaults to Open question. See [`../../../shared/evidence-states.md`](../../../shared/evidence-states.md).

## Exit criteria check

Every audit run must verify and report:

- At least 5 findings produced (or explicit "fewer findings because target was clean — list of sections that passed")
- Every finding maps to one of the 8 sections
- At least one finding identifies a judgment/behavioral trust failure (uncalibrated confidence, unfaithful citation, placebo control, silent adaptation, no-undo) — not just the presence/absence of a control
- The audit exercised at least one **sub-optimal / wrong / fabricated** AI output (Section 7) — a happy-path-only run cannot Pass Section 7
- S0's Critical precondition was evaluated against an actual provenance claim (or recorded as an open question if the claim was unknown)
- Evidence gaps preserved as open questions
- Report obeys plain-language / structured-heading conventions
- No new rubric section is obviously missing (if one is, log it as a candidate for the next version cut; do not invent one)

Include the check in the scorecard JSON under `exit_criteria_check`.

## What the skill must not do

- **Invent severity criteria** not defined in `RUBRIC.md`.
- **Score Pass on a section where evidence was not collected.** Pass requires no findings AND no open questions.
- **Over-fire S0 on generic unsourced output.** Critical applies only when a verifiable basis is claimed/implied and is not inspectable or not faithful. Generic unsourced output is High/Medium provenance ambiguity (the Cognitive Load Section 4 precondition).
- **Credit a present-but-inert affordance.** A confidence number with no calibration, a citation never validated, or a control with no observable effect is a finding, not a pass [F2, F16, F23].
- **Score Section 7 Pass on a happy-path-only run.** A "passing" affordance demoed only on correct output is untested under failure [F27].
- **Duplicate Cognitive Load Section 4.** The AI-summary source-provenance check lives there. S0 produces only the provenance-doctrine extensions.
- **Add new load-displaced-to values.** The shared 11-value enum is fixed. Map AI-trust failures onto it (see the mapping table in `RUBRIC.md`).
- **Treat positive observations as findings.** Positive observations (a section passes well) go in the `positive_observations` array, not `findings`.
- **Launder open questions into Observed findings.** A finding designed to fit the test's scope but lacking evidence is an open question. Reclassification on second pass is the audit working.

## Failure-mode patterns the rubric is meant to catch

A useful AI Trust Surface audit should be able to detect at least these four patterns. Record which were exercised on each target in the scorecard's `hard_failure_patterns_validated` block (`true` = exercised, `false` = passed cleanly, `null` = not exercisable on this target):

1. **forced_trust.** No inspect, undo, or trace path; the user must accept AI output as-is. → Sections 1 / 2 / 5
2. **manufactured_trust.** Confidence or explanation that raises trust without conveying decision-relevant information; placebic. → Section 3
3. **invalid_provenance.** A citation or source shown but unverified or unfaithful, or a "hallucination-free" overclaim retrieval does not earn. → Sections 0 / 2
4. **placebo_control.** A control present but with no observable effect on output, or silent adaptation the user cannot see. → Sections 4 / 5

## Where to file each output

```
ai-trust-surface/
├── RUBRIC.md          # canonical rubric
├── skill/
│   └── SKILL.md                     # this file
└── evidence/
    ├── PT0-candidates.md            # ranked PT0 target shortlist (exists)
    └── pt0/                         # created by the first pressure test
        ├── ai-trust-surface-findings.md
        ├── ai-trust-surface-scorecard.json
        ├── remediation-priority-list.md
        └── *.png                    # screenshots, ideally on a wrong/fabricated output
```

End of skill spec.
