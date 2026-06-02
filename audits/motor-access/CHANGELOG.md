# Changelog — Motor Access Audit

All notable changes to the **Motor Access Audit** rubric and skill.

This file follows [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/). Rubric versions are independent of the monorepo version. The current rubric is `0.1.0` and is in **Draft** state — authored, not yet pressure-tested.

The rubric ([`RUBRIC.md`](RUBRIC.md)) is canonical. The skill ([`skill/SKILL.md`](skill/SKILL.md)) follows. Pressure-test evidence under `evidence/<run-id>/` is frozen against the rubric version it ran on and is not rewritten when the rubric advances.

## [Unreleased]

### Pressure-tested — 2026-06-02 PT0 on GOV.UK Design System

**Status:** Draft → **Pressure-tested**. Rubric `0.1.0` unchanged; revision candidates parked.

**Run:** [`evidence/pt0-govuk-multi-step-form/`](evidence/pt0-govuk-multi-step-form/) · `ma-20260602-govuk-multi-step-form-pt0` · target: `https://design-system.service.gov.uk/patterns/complete-multiple-tasks/` (the original `/patterns/multi-step-form/` URL returned 404; the canonical equivalent is `/patterns/complete-multiple-tasks/` — noted for the PT0 candidate file). Path 2 / WebFetch DOM-fallback; component examples fetched as rendered iframes; `govuk-frontend` CSS + JS source fetched from the live site and npm CDN.

**Findings:** 8 (Critical 0 · High 2 · Medium 2 · Low 4) + 4 open questions + **12 positive observations**. Sections: 2 pass, 6 warn, **0 fail**. Overall: **warn** (the only audit of the four to land sub-Fail).

**Calibration result: a healthy target.** GOV.UK is a motor-access-conscious design system. The two High findings are at the *pattern/guidance level* (no session-timeout mechanism documented; no post-submission undo distinct from in-flow Back links), not at the component-markup level. Twelve positive observations recorded: semantic HTML throughout, 44×44px radio/checkbox inputs, full-row task-list touch targets, click-event (up-event) button binding, plain-text date input (no calendar picker), native file upload. This is the analog of cog-load's Dogfood-1 result — *the audit produces honest bounded findings on a healthy target without inventing drama*. PT0 evidence on a healthy target is exactly the calibration signal that the rubric is not over-firing.

**Hard-failure patterns exercised (2):** `target_too_small_or_crowded` (Medium — MA-02, MA-03), `misactivation_no_recovery` (High — MA-05, post-submit). `keyboard_trap` and `drag_only_no_alternative` correctly absent — GOV.UK forms have no drag and no traps.

**Rubric-revision candidates surfaced (parked for next PT, NOT applied):**

- **RC-MA-01.** Section 3 — pattern-level vs implementation-level timeout distinction; when auditing a design pattern that is silent on timeouts (not a live service), the current rubric gives no scoring guidance.
- **RC-MA-02.** Section 4 — explicitly address post-submission undo as distinct from in-flow Back links; the current language covers reversible actions but the check-your-answers submission shape is a distinct failure.
- **RC-MA-03.** Section 7 — clarify that CSS-computed height is weaker evidence than live `getBoundingClientRect()`; both are Inferred but at different confidence levels.
- **RC-MA-04.** `interaction_cost_class` extension field should be *recommended* (not default `n/a`) to prompt active classification on every finding.

### Hardened — 2026-06-02 external-verifier pass

Two-stage citation hardening per the research-grounded-advisor protocol (Step 4). 26 unique citations checked; 22 existence-confirmed, **0 fabricated, 0 misattributed, 0 unsupported**. No rubric changes required — the MA citations passed cleanly.

The 4 cannot_confirm verdicts (Bi et al. 2013 *FFitts Law*, Kim et al. 2022 tremor/Fitts, Trewin & Pain 1999 keyboard/mouse errors, and one further paywall) reflect ACM/IEEE/ScienceDirect paywall blocks on well-established, secondary-literature-confirmed papers; per protocol, paywall ≠ fabrication. PT0 may attach institutional-access fetches to upgrade these from `cannot_confirm` to `exists`.

### Added — draft rubric

- Initial 8-section rubric: Keyboard Path, Pointer Precision, Drag Dependence, Timeout Pressure, Undo / Recovery, Error Recovery, Configuration Cost, Evidence.
- **Motor Access Law** and framing line: *"This audit does not ask whether an interface can be operated. It asks how much motor effort, precision, and time the operation costs — and whether the same task is cheaper by another path."*
- **Boundary rule** distinguishing **exclusion** (impossible without a mouse / a drag / a fast hand — Critical) from **cost** (possible but high-effort, high-precision, or time-pressured — Low to High by task centrality). Runs through every section.
- **Research grounding section** with 29 verified findings from the motor-access literature, each tied to the section / question / severity it justifies. Sources include Chen 2013 (target-size error multipliers), Bi 2013 (FFitts absolute-precision floor), Trewin & Pain 1999 (55% drag-failure rate), MacKenzie/Sellen 1991 (3–5x drag error penalty), Koester & Arthanat 2018 (~1.7 WPM switch-scan input), Reuschel 2023 (27x form-completion exposure ratio), and MotorEase / ICSE 2024 (scanner recalls only ~50.85% of visual touch-target violations).
- **Section 0 keyboard-trap precondition.** A single inescapable focus is an automatic section Fail and a page-level blocker on its own, because WCAG Non-Interference (SC 2.1.2) makes it a full-page failure regardless of the 3-High threshold.
- Uses the shared severity model (Critical / High / Medium / Low; section-Fail at 1 Critical OR 3 Highs) and the shared 11-value `Load displaced to:` enum, with a mapping table from MA failure shapes onto the shared values. No new displacement values introduced.
- **`interaction_cost_class` finding extension** (`exclusion | cost | n/a`) in `schemas/finding.extensions.json` — additive only; does not redefine base fields.
- Standalone `skill/SKILL.md` split from the rubric. Rubric is canonical; skill follows.

### Known thin spots (for the first pressure test to calibrate)

- **Sections 4 (Undo / Recovery) and 5 (Error Recovery)** are grounded in fewer independent findings than Sections 0–3, and they share two sources (Mott 2016 on touch miscalibration, Krishnavajjala 2024 on close icons / disappearing elements). PT0 should weight a target that exercises accidental activation and recovery so these two sections gain independent calibration. Until then, treat their severity defaults as provisional.
- **No live-observed evidence exists yet.** Every pattern in the rubric is research-grounded but not yet validated against a real target. The five hard-failure patterns in the README are detection hypotheses until PT0.

### Pending — candidates parked for the first version cut

- **Split `interaction_cost_class` exclusion into AT-population subtypes** (keyboard-only / single-pointer / switch / eye-gaze) once a pressure test shows the populations need different severity treatment. Parked until evidence justifies it — do not add speculatively.
- **A `wcag_sc` field on findings** recording the specific success criterion (2.1.2, 2.5.7, 2.5.8, 2.2.1, etc.) for cross-referencing. Parked; the section already names the SC in prose.

[Unreleased]: https://github.com/dogfood-lab/interface-audits/compare/HEAD...HEAD
