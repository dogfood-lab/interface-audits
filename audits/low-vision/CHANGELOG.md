# Changelog — Low-Vision Audit

All notable changes to the **Low-Vision Audit** rubric and skill.

This file follows [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/). Rubric versions are independent of the monorepo version. The current rubric is a Draft (`0.1.0`, unreleased — not yet pressure-tested).

The rubric ([`RUBRIC.md`](RUBRIC.md)) is canonical. The skill ([`skill/SKILL.md`](skill/SKILL.md)) follows. Pressure-test evidence under `evidence/<run-id>/` is frozen against the rubric version it ran on and is not rewritten when the rubric advances.

## [Unreleased]

### Pressure-tested — 2026-06-02 PT0 on MDN ARIA docs

**Status:** Draft → **Pressure-tested**. Rubric `0.1.0` unchanged; revision candidates parked for the next PT.

**Run:** [`evidence/pt0-mdn-aria/`](evidence/pt0-mdn-aria/) · `lv-20260602-mdn-aria-pt0` · target: `https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA` · Path 2 / WebFetch DOM-fallback (no live browser, no zoom interaction, no Windows High Contrast Mode). All findings Inferred; raw HTML (170 KB) and all seven MDN Yari CSS files fetched and analyzed statically.

**Findings:** 10 (Critical 2 · High 4 · Medium 3 · Low 0) + 5 open questions. Sections: 1 pass, 5 warn, **2 fail** (`focus_visibility`, `mode_switching`).

**Headline finding (single root cause for both Criticals):** **zero `forced-colors` media queries anywhere in MDN Yari CSS**. The canonical web-docs site that low-vision users actually read for hours ships custom interactive-state CSS but never adapts to Windows High Contrast Mode. LV-05 (Section 2) and LV-08 (Section 5) are the same root cause cross-listed; one fix — a `@media (forced-colors: active)` block on every interactive-element selector — addresses both.

**Hard-failure patterns exercised (4/4):** `text_disappears_on_reflow`, `contrast_fails_on_real_surfaces`, `focus_vanishes_in_high_contrast`, `place_lost_on_reflow` — full coverage on this single target.

**Rubric-revision candidates surfaced (parked for next PT, NOT applied):**

- **RC-LV-01.** Reflow check at the user's zoom-induced effective viewport width, not only the 320 CSS px WCAG floor — catches "TOC disappears at 200% zoom" failures that pass the 320 px check.
- **RC-LV-02.** Promotional / ad banner above nav as a distinct sticky pattern contributing to compound `LV-STICKY-BLOCK` height.
- **RC-LV-03.** Generalize the `forced-colors` failure-mode: absence of any `forced-colors` media query on a site with custom interactive-state CSS could be a High/Critical pattern, not just the specific `box-shadow` case. The MDN PT0 surfaced the broader class.

### Hardened — 2026-06-02 external-verifier pass

Two-stage citation hardening per the research-grounded-advisor protocol (Step 4). 23 unique citations checked; all 23 existence-confirmed against the live source.

- **F15 Billah 2018 figure softened.** The original draft cited "up to 2.4× longer completion" alongside the confirmed "5.6 back-and-forth context trips per task" figure; the 2.4× multiplier was not confirmable in the open-access PMC abstract (which reports 20–40% task-time improvements when locality was preserved). The grounding entry was rewritten to use the PMC-confirmed 20–40% range. The substantive Section 3 claim (magnification destroys spatial locality) is independently supported by F22 and Billah's headline 5.6-trips figure.

### Added — Draft rubric authored (study-swarm, research-grounded); not yet pressure-tested

- Initial 8-section rubric: Zoom & Reflow at 200%/400%, Contrast under real density, Focus visibility under custom themes, Spatial orientation, Font + spacing defaults (low-vision extensions), Mode switching, Configuration cost, Evidence.
- **Low-Vision Access Law** and framing line: *"This audit does not ask whether contrast passes at 100%. It asks whether the interface still works at 200%, 400%, and beyond — under real density, real photos, real charts, and real themes."*
- **Research grounding** section anchoring doctrine in 25 verified empirical findings (WebAIM low-vision surveys 2018 + Million 2024, W3C Low Vision Task Force user-need model 2016, CHI/ASSETS/ETRA magnifier studies, WCAG reflow/contrast/focus criteria). Each finding is connected to a specific section, question, or severity rule. Citations passed an external retrieval-oracle verifier.
- **Finding format** referencing the shared contract in [`../../shared/finding-format.md`](../../shared/finding-format.md), with the `Load displaced to:` field using the **shared, fixed 11-value enum** — the audit adds no new displacement values and maps low-vision failures onto the shared enum via a mapping table.
- **Severity definitions** referencing [`../../shared/severity-model.md`](../../shared/severity-model.md) (Critical / High / Medium / Low; section-Fail = 1 Critical OR 3 Highs), with two domain preconditions:
  - **Section 1 contrast precondition:** a WCAG AA (4.5:1) pass alone is not sufficient evidence of low-vision support; body-weight text below 7:1 on dense small-font surfaces is High, grounded in contrast-sensitivity loss at ~20/80 acuity and contrast-reserve theory. Text on photos and marks on charts are MANUAL-ONLY / scanner-invisible.
  - **Section 2 / 5 forced-colors focus rule:** a focus indicator that relies on `box-shadow` is invisible in Windows High Contrast Mode (forced-colors strips `box-shadow`); this is Critical because it is invisible under default testing and targets the population that enables high-contrast.
- **Boundary resolution with Cognitive Load Section 1** (Measurable Defaults): reference-and-extend. Cognitive Load owns the WCAG-floor size/spacing/reflow checks; Low-Vision Section 4 adds only the low-vision extensions (7:1 dense-surface threshold, computed-style verification of viewport-unit fonts, spacing under sustained magnification). No duplication.
- **`lv_reflow_pattern` extension field** ([`schemas/finding.extensions.json`](schemas/finding.extensions.json)) — optional classification of Section 0 reflow findings (text_loss / horizontal_scroll / reflow_content_loss / sticky_block / overlap / spacing_collapse). Additive only; does not redefine any base field and does not extend the shared load-displaced-to enum.
- **Automatable-vs-judgment cut table** documenting the scanner gap: the only automated rule touching the reflow layer (ACT 59br37) tests a single `overflow:hidden` case on text nodes; the other seven sections are scanner-invisible.
- Standalone [`skill/SKILL.md`](skill/SKILL.md) split from the rubric. Rubric is canonical; skill follows.
- PT0 target shortlist in [`evidence/PT0-candidates.md`](evidence/PT0-candidates.md).

### Parked — candidates for the first version cut (need calibrating evidence)

These ride along with the first real revision once a pressure test produces calibrating evidence. None justifies a version cut on its own:

- **Section 0 `LV-STICKY-BLOCK` threshold.** The ~30%-of-viewport-height threshold for flagging sticky chrome at 400% is taken from the C34 advisory framing but is not yet calibrated against a live-observed example. PT0 should confirm whether 30% is the right cut or whether it should be relative to the focused component's position.
- **Section 3 "focus reset to top on every reflow" Critical bump.** The rubric bumps point-of-regard loss from High to Critical when it recurs on every reflow event and blocks task completion. This bump has no live-observed example yet; calibrate at PT0.
- **Simplified-mode feature-loss pattern (the `feature_loss` displacement for this domain).** A mobile or "simplified" mode that drops a capability low-vision users specifically need (e.g. a zoom-friendly layout that removes a control present on desktop). Analogous to the Cognitive Load audit's still-uncalibrated `simple_mode_removes_power` pattern. No section currently owns it cleanly; decide at PT0 whether it belongs in Section 0 (reflow loss) or warrants its own treatment.
- **OQ-LV-01** — Lighthouse / axe scanner pass on a production target, attached as Section 1's CSS-detectable-contrast measurement (the 81%-prevalence layer), distinct from the MANUAL-ONLY photo/chart checks. Carry forward until a real target is audited.

[Unreleased]: https://github.com/dogfood-lab/interface-audits/commits/main
