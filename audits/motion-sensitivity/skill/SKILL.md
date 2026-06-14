---
name: motion-sensitivity-audit
description: Motion Sensitivity Audit — 7-section rubric for auditing vestibular triggers, animation respect, prefers-reduced-motion handling, and flash/seizure thresholds. Invoke when the user says "motion sensitivity audit", "audit this for motion", "check prefers-reduced-motion", "does this respect reduce motion", "check for flashing / seizure risk", "is this parallax accessible", "audit the autoplay / carousel", "scroll-jacking audit", or asks to evaluate a surface for vestibular triggers, animation safety, or photosensitive-seizure risk. NOT a general accessibility scan (use axe / Lighthouse for WCAG conformance), NOT a low-vision / zoom / contrast audit (that is the Low-Vision audit — its Section 5 owns forced-colors / high-contrast; this audit's Section 3 owns prefers-reduced-motion), and NOT a screen-reader / blindness audit.
---

# Motion Sensitivity Audit — Skill

This skill executes the rubric in [`../RUBRIC.md`](../RUBRIC.md). It does not invent criteria. The rubric is canonical; if this file and the rubric disagree, the rubric wins.

## Doctrine to honor on every run

- **The rubric is canonical.** Every finding traces to a section and audit question in `RUBRIC.md`. If a finding doesn't map to one of the 7 sections, it is not a finding produced by this skill.
- **Flash/seizure is physical harm, not discomfort.** Section 0's `MO-FLASH` is the only hard *physical-injury* Critical in the repo. Content flashing > 3 times/sec over the area + luminance threshold, OR any saturated-red flash above the red-flash threshold, is an automatic Critical — and a single Critical fails the whole audit. Test the red-flash threshold *independently* of luminance. Never downgrade a flash finding for being "probably fine."
- **`prefers-reduced-motion` is the one signal the user can send in advance.** Honoring it is the floor (Section 3 / Section 5). A page with decorative motion and no `@media (prefers-reduced-motion: reduce)` block is an automatic High. A CSS reduce block that JS / WAAPI / canvas motion ignores is *also* High — the CSS block creates a false impression of compliance.
- **Weight axis-count and area, not the mere presence of motion.** Vection is necessary but not sufficient for sickness. A single-axis gentle pan is Low; decoupled multi-axis / large-area / fast motion is High. Do not blanket-flag every animation — that over-fires (Section 2).
- **Identify where the cost moved.** Every finding must populate `Load displaced to:` using one or more values from the shared enum in [`../../../shared/finding-format.md`](../../../shared/finding-format.md). This audit adds no new displacement values; map motion failures onto the shared 11 (see the mapping table in `RUBRIC.md`). A vague displacement target is a weak finding.
- **Evidence required, and capture motion *in motion*.** Findings carry an evidence state: **Observed** (seen directly, in motion, with the OS Reduce Motion toggle state recorded), **Inferred** (strongly implied by fetched CSS/JS or framework class), or **Open question** (plausible but unconfirmed). A flash/fast/large-area claim with no analysis-tool pass is an **open finding**, never a clean pass (Section 6). See [`../../../shared/evidence-states.md`](../../../shared/evidence-states.md).
- **Use the right tool for the medium.** PEAT for web/software; Harding FPA for broadcast/film/gaming/home-entertainment. Using PEAT on gaming/broadcast content is itself a finding (Section 6). Visual inspection alone is insufficient evidence for any flash claim.
- **Section 3 is a sibling of Low-Vision Section 5, not a duplicate.** Low-Vision Section 5 owns `forced-colors` / high-contrast / dark-theme respect; this skill's Section 3 owns `prefers-reduced-motion`. They read different media queries and target different physiology. If a finding touches both, file the motion half here and cross-list via `secondary_section`. Do not re-derive the color half.
- **Loading motion is grounded in 2.3.3, not 2.2.2.** WCAG 2.2.2 exempts standalone preloaders. Score spinners/shimmer under Section 1 (vestibular trigger taxonomy), not under Section 4's pause requirement.

## Inputs

```yaml
input_types:
  - url                       # live or staging URL (preferred — CSS/HTML fetchable, motion observable)
  - stylesheet_or_html        # fetched CSS/HTML when live navigation is blocked
  - screenshot_or_capture     # still or screen-capture of a specific surface (motion ideally captured as a clip)
  - component_code            # JSX/Vue/HTML/CSS/JS for a single animated component
  - app_flow_description      # prose describing a multi-step flow and its motion
  - product_surface_notes     # auditor's notes on what was observed in motion
```

At least one input is required. Live navigation with the OS Reduce Motion preference flipped on and off produces the densest evidence and is strongly preferred for the autoplay, scroll-jacking, and reduce-respect sections — those are runtime. Fetched CSS/HTML is sufficient to detect the single highest-value signal: the presence or absence of a `@media (prefers-reduced-motion: reduce)` block.

## Optional context

```yaml
optional_context:
  test_path:            "fetched_css | live_observation | tool_analysis | combination"
  reduce_motion_states: "OS Reduce Motion states tested, e.g. off, on"
  flash_tool:           "PEAT | Harding FPA | none — which analysis tool was run on flashing/fast media"
  medium:               "web | software | broadcast | film | gaming | home-entertainment (selects PEAT vs Harding)"
  motion_state:         "the realistic state captured: hero first-paint, loader, carousel mid-rotation, scroll-jacked section"
  conformance_target:   "AA | AAA | safety-critical (AAA / safety-critical raises the 2.3.2 flash bar)"
  task:                 "what the user is trying to do on this surface"
  prior_audit_id:       "if this is a re-audit, the previous audit id"
```

If `flash_tool` is `none` and any flashing / fast / large-area media is present, warn that Section 6 cannot pass and the flash claim is an open finding. If the OS Reduce Motion preference was never toggled on, warn that Sections 3 and 5 cannot Pass.

## Outputs

```yaml
outputs:
  - motion-sensitivity-findings.md       # full findings in rubric format
  - motion-sensitivity-scorecard.json    # per-section pass/warn/fail + summary
  - remediation-priority-list.md         # findings ordered by severity × leverage
```

Write all three under `evidence/<run-id>/` where `run-id` is a short slug for the run (e.g. `pt0`, `pt1-marketing-hero`). No evidence directory exists yet — the first pressure test creates `evidence/pt0/`.

## Scorecard schema

Conforms to [`../../../shared/schemas/scorecard.base.schema.json`](../../../shared/schemas/scorecard.base.schema.json). Section keys are snake_case and match the RUBRIC sections.

```json
{
  "audit_id": "mo-YYYYMMDD-{slug}",
  "rubric_version": "v0.1 (Draft)",
  "rubric_path": "../../RUBRIC.md",
  "target": {
    "type": "url|stylesheet_or_html|screenshot_or_capture|component_code|app_flow_description|product_surface_notes",
    "value": "...",
    "surfaces_audited": ["..."]
  },
  "context": {
    "test_path": "fetched_css | live_observation | tool_analysis | combination",
    "reduce_motion_states": ["off", "on"],
    "flash_tool": "PEAT | Harding FPA | none",
    "medium": "web | software | broadcast | film | gaming | home-entertainment",
    "motion_state": "...",
    "conformance_target": "AA | AAA | safety-critical",
    "task": "...",
    "method": "Path 1 | Path 2",
    "session_continuous_minutes": 0,
    "viewport_render_limitation": "optional — describe any rig constraint that forced Inferred (CSS-only) evidence"
  },
  "sections": {
    "animation":                    { "status": "pass|warn|fail", "finding_ids": [], "open_questions": [], "notes": "..." },
    "loading_motion":               { "status": "pass|warn|fail", "finding_ids": [], "notes": "..." },
    "vestibular_trigger_patterns":  { "status": "pass|warn|fail", "finding_ids": [], "notes": "..." },
    "reduced_motion_respect":       { "status": "pass|warn|fail", "finding_ids": [], "notes": "..." },
    "autoplaying_media":            { "status": "pass|warn|fail", "finding_ids": [], "notes": "..." },
    "configuration_cost":           { "status": "pass|warn|fail", "finding_ids": [], "notes": "..." },
    "evidence":                     { "status": "pass|warn|fail", "finding_ids": [], "open_questions": [], "notes": "..." }
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
      "flash_seizure": null,
      "unstoppable_motion": null,
      "reduced_motion_ignored": null,
      "opt_in_only_safety": null
    }
  },
  "findings": [ /* full finding objects: id, severity, section, surface, load_displaced_to, evidence_state, evidence_summary. May set mo_trigger_pattern and wcag_sc. */ ],
  "open_questions": [ /* { id, section, summary, resolution_path } */ ],
  "positive_observations": [ /* { id, section, summary } */ ],
  "exit_criteria_check": { /* see below */ }
}
```

The optional domain fields `mo_trigger_pattern` and `wcag_sc` (from [`../schemas/finding.extensions.json`](../schemas/finding.extensions.json)) classify the trigger type and the mapped success criterion. Both are additive; neither replaces a base field, and the audit does not extend the shared `load_displaced_to` enum.

## Procedure

1. **Validate inputs.** Require at least one input type. Warn if `flash_tool` is `none` while flashing/fast media is present (Section 6 cannot pass), or if the OS Reduce Motion preference was never toggled on (Sections 3 and 5 cannot Pass).
2. **Walk sections 0 through 6 in order.** For each section:
   - Read the section's purpose, failure modes, and audit questions from the rubric.
   - Probe the available evidence (live observation with Reduce Motion off and on, fetched CSS/HTML for the `prefers-reduced-motion` block and `@keyframes` / autoplay declarations, PEAT/Harding analysis for flash) against those questions.
   - Where evidence is insufficient, record the gap as an open question rather than guessing. ("Evidence required: PEAT analysis of the hero video to confirm/deny the flash rate.")
   - Produce zero or more findings per section. Apply Section 0's `MO-FLASH` Critical precondition (physical harm; test red-flash independently). Apply Section 2's axis-count/area weighting (do not blanket-flag). Apply the Section 3 `MO-JS-REINTRO` rule (CSS reduce block present but JS ignores it = High). For loading motion, score under Section 1 (2.3.3), not Section 4 (2.2.2 exempts preloaders).
   - For CSS-only / fetch-limited audits where live motion can't be observed, mark findings Inferred and record the limitation; the `prefers-reduced-motion` block presence/absence is still a strong Inferred signal.
3. **Score each section.** Pass / Warn / Fail per the shared severity model in [`../../../shared/severity-model.md`](../../../shared/severity-model.md):
   - **Fail** = 1 Critical OR 3+ Highs in the section (a single `MO-FLASH` Critical fails Section 0 and the whole audit)
   - **Warn** = any finding below the Fail threshold, or an unresolved open question
   - **Pass** = no findings and no open questions
4. **Emit outputs.** All three files. Findings must include the Evidence line with test path and OS Reduce Motion state; findings without evidence are downgraded to open questions. Every finding's `Load displaced to:` field uses the shared enum.
5. **Cite the rubric, not training data.** Every finding traces to a section and audit question in `RUBRIC.md`. The skill must not introduce criteria that aren't in the rubric.

## Evidence states

| State | Meaning | When to use |
|---|---|---|
| **Observed** | Seen directly, in motion, with the OS Reduce Motion toggle state recorded, or measured by an analysis tool (PEAT/Harding) | Default for findings collected on live observation or tool analysis |
| **Inferred** | Strongly implied by fetched CSS/JS (a `@keyframes` with no reduce override, an `autoplay` attr, a missing `prefers-reduced-motion` block) or framework class, but not directly observed in motion | Use sparingly; explain the inference chain in the Evidence line; required when the rig can't render/observe live motion |
| **Open question** | Plausible issue, but evidence is insufficient — especially any flash claim with no tool pass | Default for findings missing direct observation; resolve before promoting to confirmed |

A finding with no clear evidence state defaults to Open question. A flash/fast/large-area claim with no PEAT/Harding pass is an open finding, not a clean pass. See [`../../../shared/evidence-states.md`](../../../shared/evidence-states.md).

## Exit criteria check

Every audit run must verify and report:

- At least 5 findings produced (or explicit "fewer findings because target was clean — list of sections that passed")
- Every finding maps to one of the 7 sections
- At least one finding identifies a scanner-invisible failure (flash measured by tool, JS-reintroduced motion, scroll-jacking, autoplay with no stop, opt-in-only safety) — not just a CSS-detectable declaration
- The `prefers-reduced-motion` block presence/absence was checked in the fetched CSS
- If any flashing / fast / large-area media is present, a tool-analysis pass (PEAT/Harding) was run or the claim is recorded as an open finding
- The surface was observed in motion with the OS Reduce Motion preference both off and on (or the limitation recorded)
- Evidence gaps preserved as open questions
- Report obeys plain-language / structured-heading conventions, and does not itself use motion the audit would flag
- No new rubric section is obviously missing (if one is, log it as a candidate for the next version cut; do not invent one)

Include the check in the scorecard JSON under `exit_criteria_check`.

## What the skill must not do

- **Invent severity criteria** not defined in `RUBRIC.md`.
- **Downgrade a flash finding** because it "looks fine." `MO-FLASH` is an automatic Critical; the harm is a physical seizure. Test the red-flash threshold independently of luminance.
- **Score Pass on a section where evidence was not collected.** Pass requires no findings AND no open questions.
- **Claim "no flashing" from visual inspection alone.** A flash claim with no PEAT/Harding analysis pass is an open finding (Section 6).
- **Use PEAT on broadcast/film/gaming content.** PEAT is prohibited there; Harding FPA is correct. Wrong-tool use is itself a finding.
- **Blanket-flag every animation as High.** Weight axis-count and area; single-axis gentle motion is Low (Section 2). Over-firing is a failure mode.
- **Score loading spinners under Section 4.** WCAG 2.2.2 exempts preloaders; loading motion belongs to Section 1 (2.3.3).
- **Duplicate the Low-Vision audit's `forced-colors` checks.** Section 3 owns `prefers-reduced-motion` only. The color/contrast OS preferences belong to Low-Vision Section 5.
- **Add new load-displaced-to values.** The shared 11-value enum is fixed. Map motion failures onto it (see the mapping table in `RUBRIC.md`).
- **Treat positive observations as findings.** A correctly-honored reduce block goes in `positive_observations`, not `findings`.
- **Launder open questions into Observed findings.** A finding designed to fit the test's scope but lacking evidence is an open question. Reclassification on second pass is the audit working.

## Failure-mode patterns the rubric is meant to catch

A useful motion-sensitivity audit should be able to detect at least these four patterns. Record which were exercised on each target in the scorecard's `hard_failure_patterns_validated` block (`true` = exercised, `false` = passed cleanly, `null` = not exercisable on this target):

1. **`flash_seizure`.** Content flashes > 3 times/sec over the area + luminance (or red-flash) threshold. → Section 0 Animation (Critical — physical harm)
2. **`unstoppable_motion`.** Autoplay / parallax / scroll-jack / zoom with no pause or disable mechanism. → Section 2 Vestibular trigger patterns + Section 4 Auto-playing media
3. **`reduced_motion_ignored`.** No `prefers-reduced-motion` handling, or a CSS reduce block that JS / WAAPI motion ignores. → Section 3 prefers-reduced-motion respect
4. **`opt_in_only_safety`.** Motion safety gated behind a toggle the undiagnosed majority will not find, instead of honoring the OS preference. → Section 5 Configuration cost

## Where to file each output

```
motion-sensitivity/
├── RUBRIC.md          # canonical rubric
├── skill/
│   └── SKILL.md                     # this file
└── evidence/
    ├── PT0-candidates.md            # ranked PT0 target shortlist (exists)
    └── pt0/                         # created by the first pressure test
        ├── motion-sensitivity-findings.md
        ├── motion-sensitivity-scorecard.json
        ├── remediation-priority-list.md
        └── *.png / *.mp4            # captures of the surface in motion at the tested Reduce Motion state
```

End of skill spec.
