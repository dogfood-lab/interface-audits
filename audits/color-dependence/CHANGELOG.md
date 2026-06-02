# Changelog — Color Dependence Audit

All notable changes to the **Color Dependence Audit** rubric and skill.

This file follows [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/). Rubric versions are independent of the monorepo version.

The rubric ([`RUBRIC.md`](RUBRIC.md)) is canonical. The skill ([`skill/SKILL.md`](skill/SKILL.md)) follows. Pressure-test evidence under `evidence/<run-id>/` is frozen against the rubric version it ran on and is not rewritten when the rubric advances.

## [Unreleased]

Draft rubric authored (study-swarm, research-grounded); not yet pressure-tested.

### Hardened — 2026-06-02 external-verifier pass

Two-stage citation hardening per the research-grounded-advisor protocol (Step 4):

- **Stage 1 (retrieval oracle, family-independent):** WebFetched every arXiv/DOI/W3C source. 18 unique citations checked; 17 existence-confirmed.
- **Stage 2 (decorrelated different-family LLM lenses):** mistral-small:24b + granite4.1:30b, reasoning-stripped. Both produced only false positives or "unfamiliar (recent paper)" non-flags — confirming the protocol's prior receipt that parametric LLMs miss what retrieval catches.

**Findings (all caught by the retrieval oracle, none by the LLM lenses):**
- **F13 Sajek, Korotenko & Kyrychok 2025 — FABRICATED DOI.** The cited DOI `10.3390/app14219931` resolves to an unrelated 2024 dental paper (Samulak et al. on clear aligners). Citation removed; the CIELAB orthogonal-axis claim it supported is preserved via F19 (Machado, Oliveira & Fernandes 2009). No body doctrine lost.
- **F10 Guha 2022 — misattributed.** First author is Tejas Guha (not "A. Guha"); the actual paper title is *Generating colorblind-friendly scatter plots for single-cell data* (scatterHatch is the package introduced, not the title). References entry corrected; substantive pattern-overlay claim is supported by the source.
- **F11 Almustanyir 2025 — misattributed.** Single author (Ali Almustanyir), not "et al."; actual title is *A Global Perspective of Color Vision Deficiency: Awareness, Diagnosis, and Lived Experiences*. Title and attribution corrected. The specific ~5% deuteranomaly / ~1% subtype breakdown could not be confirmed from the open-access abstract; the grounding entry was rewritten to defer the specific percentages to F1 (Birch 2012) and flagged for PT0 confirmation.
- **F15 / F16 DaltonLens — year corrected 2023 → 2021.** The cited pages are dated October 2021, not 2023, and the author is "DaltonLens" (no individual named); the "Simonot et al." attribution was removed. Substantive content (sRGB linearization bug, dichromacy-only over-reporting) is supported.
- **F18 Jamil & Denes 2024 — misattributed title.** Actual arXiv:2401.10357 title is *Investigating Color Blind User Interface Accessibility via Simulated Interfaces*, not *Evaluating website accessibility under simulated color vision deficiency*. References entry corrected; substantive simulation-valid-for-screenshots claim is supported.

### Added

- Initial 7-section rubric: Color-only information conveyance, Chart/graph color encoding, Form validation signaling, Mode/state indication, Color-blindness simulation (the methods gate), Configuration cost, Evidence.
- **Color Dependence Law** and framing line: *"This audit does not ask whether colors have enough contrast. It asks whether the meaning carried by color survives when the color does not."*
- **The Contrast-Pass / Hue-Fail boundary rule.** Separates SC 1.4.3 (luminance) from SC 1.4.1 (use of color), grounded in the mechanistic independence of the CIELAB `L*` axis (luminance) from the `a*`/`b*` axes (hue) and the orthogonality of dichromatic confusion lines to the luminance axis. Every section carries a mandatory Contrast-Pass / Hue-Fail test.
- **Section 4 methods gate (tool-qualification, Gate-A precondition).** CVD findings may only be recorded once the simulator is qualified: a physiologically-validated model (Brettel/Viénot/Mollon 1997 or Machado/Oliveira/Fernandes 2009, not desaturation) with sRGB→linear decode applied before the CVD matrix.
- **Section 4 dichromacy-only POTENTIAL-FAIL precondition.** A failure seen only under a dichromacy-only simulator is scored Medium / POTENTIAL-FAIL until confirmed by an anomalous-trichromacy model, because most CVD users are anomalous trichromats and dichromacy-only tools overstate severity. This audit's analog of the Cognitive Load Audit's Section 4 severity precondition.
- **Section 6 two-tier BLOCK rule.** A finding may be scored at its section severity (Inferred) on qualified-simulator evidence; it may only be marked BLOCK / Observed-blocking after confirmation by at least one CVD tester, because simulation is validated for screenshots, not real-user task performance.
- **Finding format** reusing the shared `Load displaced to:` enum (no new values), with `visual decoding` as the primary displacement for color-dependence failures.
- **Finding extension schema** (`schemas/finding.extensions.json`): additive `cvd_class_affected`, `contrast_pass_hue_fail`, and `simulation_confirmation` fields. The shared `load_displaced_to` enum is not extended.
- **Research-grounding section** with 19 verified findings (Birch 2012; W3C SC 1.4.1 / 1.4.3; Angerbauer 2022; Crameri 2020; Nuñez 2018; Tseng 2023; Guha 2022; Wong 2011; Almustanyir 2025; Hofmann & Palczewski 2015; Sajek 2025; Lillo 2014; Machado 2009; DaltonLens 2023; Jamil 2024; G14/G111), each connected to the section, question, or severity rule it justifies.
- **Standalone `skill/SKILL.md`** split from the rubric. Rubric is canonical; skill follows.
- **PT0 calibration-target shortlist** in [`evidence/PT0-candidates.md`](evidence/PT0-candidates.md).

### Not yet done (Draft → Pressure-tested)

- No pressure test has run. The Contrast-Pass / Hue-Fail boundary rule, the chart-encoding section, and the methods gate are unexercised against a real target.
- The five hard-failure patterns (`status_color_only`, `chart_unreadable_without_color`, `form_error_hue_only`, `mode_state_hue_only`, `contrast_pass_hue_fail`) are uncalibrated.
- Sections 3 (Mode/state indication) and 5 (Configuration cost) rest on the normative WCAG 1.4.1 floor plus cross-referenced doctrine; they have fewer dedicated empirical findings than Sections 1 and 4. PT0 should probe whether they need their own calibrating evidence.
- Entering **Pressure-tested** requires one PT in `evidence/<pt-id>/` with findings + scorecard + remediation, per [`../../shared/audit-lifecycle.md`](../../shared/audit-lifecycle.md).
