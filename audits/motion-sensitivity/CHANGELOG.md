# Changelog — Motion Sensitivity Audit

All notable changes to the **Motion Sensitivity Audit** rubric and skill.

This file follows [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/). Rubric versions are independent of the monorepo version. The current rubric is **Pressure-tested** (`0.1.0`) — one PT0 landed and the rubric did not change.

The rubric ([`RUBRIC.md`](RUBRIC.md)) is canonical. The skill ([`skill/SKILL.md`](skill/SKILL.md)) follows. Pressure-test evidence under `evidence/<run-id>/` is frozen against the rubric version it ran on and is not rewritten when the rubric advances.

## [Unreleased]

### Added — Draft rubric authored (study-swarm, research-grounded); externally verified; not yet pressure-tested — 2026-06-13

- Initial 7-section rubric: Animation (flash/seizure), Loading motion, Vestibular trigger patterns, prefers-reduced-motion respect, Auto-playing media, Configuration cost, Evidence.
- **Motion Sensitivity Law** and framing line: *"This audit does not ask whether the animation 'looks smooth.' It asks whether a user who is dizzy, migraine-prone, or photosensitive can use the surface without being made sick by it — under autoplay, under parallax, under scroll-jacking, and under the operating-system preference the user has already set."*
- **Research grounding** section anchoring doctrine in **33 verified empirical findings** (WCAG flash/animation/pause criteria; the WebKit and A11Y Project vestibular-trigger taxonomies; the VIMS, parallax, and scroll-jacking research; the Epilepsy Foundation seizure-threshold review; and the vestibular-disorder prevalence literature). Each finding is connected to a specific section, question, or severity rule.
- **Finding format** referencing the shared contract in [`../../shared/finding-format.md`](../../shared/finding-format.md), with the `Load displaced to:` field using the **shared, fixed 11-value enum** — the audit adds no new displacement values and maps motion failures onto the shared enum via a mapping table (e.g. must-wait-out → `time`; scroll-jack place loss → `navigation`; toggle hunt → `configuration`).
- **Severity definitions** referencing [`../../shared/severity-model.md`](../../shared/severity-model.md) (Critical / High / Medium / Low; section-Fail = 1 Critical OR 3 Highs), with the domain's distinguishing precondition:
  - **Section 0 flash/seizure precondition:** content flashing > 3 times/sec that exceeds the general flash threshold (>=10% luminance delta, darker state < 0.80, over ~25% of a 10-degree field) OR the red-flash threshold is an **automatic Critical** — the only hard *physical-injury* Critical in the repo, because the harm is a seizure, not discomfort. The red-flash threshold is tested independently of luminance.
  - **Section 2 / 4 vestibular precondition:** documented vertigo/nausea patterns (large-area parallax, scroll-jacking, autoplay zoom/spin) default to High given ~35% of adults 40+ have measurable vestibular dysfunction and ~1 in 20 adults/year experience vestibular vertigo; single-axis gentle motion is Low, decoupled multi-axis / large-area / fast motion is High (weight axis-count and area, not mere presence of motion — prevents over-firing).
- **Sibling boundary with the Low-Vision audit's Section 5** resolved by cross-reference only: Low-Vision Section 5 owns `forced-colors` / high-contrast / theme respect; this audit's Section 3 owns `prefers-reduced-motion`. Non-overlapping; different media queries, different physiology. The flash/seizure thresholds (2.3.1 / 2.3.2) are unique to this audit.
- **Four hard-failure patterns** defined: `flash_seizure` (Section 0), `unstoppable_motion` (Sections 2/4), `reduced_motion_ignored` (Section 3), `opt_in_only_safety` (Section 5).
- **`mo_trigger_pattern` and `wcag_sc` extension fields** ([`schemas/finding.extensions.json`](schemas/finding.extensions.json)) — optional classification of the motion trigger (flash_seizure / large_area_motion / parallax / scroll_jack / autoplay / spin_zoom / loading_motion / multi_axis / n/a) and the mapped WCAG success criterion. Additive only; neither redefines a base field, and the audit does not extend the shared load-displaced-to enum.
- **Automatable-vs-judgment cut table** documenting the scanner gap: axe / Lighthouse detect almost none of this — the flash layer needs a frame-level tool (PEAT/Harding), the vestibular layer needs observation, and the JS-reintroduction failure is invisible to a CSS scan. The single highest-value automatable signal is the **presence or absence of a `@media (prefers-reduced-motion: reduce)` block** in the fetched stylesheets.
- Standalone [`skill/SKILL.md`](skill/SKILL.md) split from the rubric. Rubric is canonical; skill follows.
- PT0 target shortlist in [`evidence/PT0-candidates.md`](evidence/PT0-candidates.md).

### Hardened — 2026-06-13 external-verifier pass

Two-stage citation hardening per the research-grounded-advisor protocol (Step 4). The grounding ran a Stage-1 retrieval oracle (live WebFetch on all 29 unique sources) plus Stage-2 groundedness review by **two decorrelated non-Claude families: `granite4.1:30b` and `mistral-small:24b`**. 39 candidate findings resolved to **33 verified KEEP** after dropping 1 on groundedness and 5 as duplicates.

**Stage-1 oracle result:** every source EXISTS with the stated title, authors, and year — zero fabrications, zero misattributions.

**Stage-2 groundedness result:** `granite4.1:30b` supported all pairs; `mistral-small:24b` was over-strict (NOT_SUPPORTED on five pairs and UNSURE on five more — all cases where the retrieved source text verbatim confirms the claim, e.g. the SC 2.2.2 preloader exemption and the Diels ~20% effect are quoted directly in the abstracts). Per the adjudication rule, no item was NOT_SUPPORTED by *both* families, so all confirmed findings KEEP. The over-strictness is a correlated small-model judge blind spot (under-crediting standards/legalese paraphrase), not evidence against the claims.

**Attribution corrections the verifier baked in:**

- **Finding 27 (Frederick et al. parallax study).** The journal page lists a spurious "Admin" artifact in the author list; this is not a real coauthor and was corrected silently — the finding credits Frederick, Mohler, Vorvoreanu, Glotzbach.
- **Finding 14 (G15) soft caveat.** G15 lists PEAT / Harding FPA as "related resources" rather than mandating one tool per medium. The strict PEAT-vs-Harding split is normative on the PEAT page itself, so the design implication for the tool split is anchored on finding 15, and the caveat is recorded inline in finding 14.

**Dropped citations and why (from the grounding `dropped` array):**

- **F39 — Bisdorff age-gradient claim** ("vertigo/dizziness symptom prevalence climbs steeply with age, concentrating the affected population among older adults"; attributed to Bisdorff et al. 2013, DOI:10.3389/fneur.2013.00029). **Dropped: contradicted by source.** The retrieval oracle found the Bisdorff paper actually reports prevalence relatively stable across age groups and *decreasing* in those over 70, explicitly attributing the lack of an age gradient to recruitment bias (healthier elderly self-presenting). The distinctive load-bearing "climbs steeply with age" claim is contradicted by the source. The *supported* portion of Bisdorff (the ~48% symptom-prevalence vs <5% diagnosis gap) is retained as verified finding 31. This was the single genuine groundedness failure, caught by the oracle, not the lens.
- **F37 — duplicate WCAG SC 2.3.3 statement** (parallax/interaction motion causes nausea/migraine/bed rest; prefers-reduced-motion sufficient; via the WCAG21 Understanding URL). **Dropped: duplicate** of verified finding 1 (the WCAG22 canonical page). Existence and groundedness confirmed; merged to avoid double-counting the same standard.
- **F28 — duplicate WCAG SC 2.3.3 (WCAG 2.1 variant).** **Dropped: duplicate** of verified finding 1. Confirmed-existent and supported, but folded into finding 1 so the same standard is not counted three times.
- **F31 (MO-Q5 instance) — duplicate Agrawal NHANES statistic** (35.4% of US adults 40+, 69M, 12-fold fall odds). **Dropped: duplicate** of verified finding 24 (cited under two questions). Confirmed and supported; counted once.
- **F36 — duplicate WCAG SC 2.3.1 flash-threshold restatement** (>3 flashes/sec; 10% luminance; red flash; ~25% field), cited as the "normative anchor" for the Fisher epidemiology. **Dropped: duplicate** of verified findings 10 and 11. Confirmed and supported; merged to avoid restating the same standard.

Net: 33 verified KEEP findings (rendered F1–F33 in the rubric), 1 groundedness drop, 5 duplicate merges. This is the audit's hardening trail; no citation in the rubric is uncited or unverified.

### Parked — candidates for the first version cut (need calibrating evidence)

These ride along with the first real revision once a pressure test produces calibrating evidence. None justifies a version cut on its own:

- **Section 0 large-area-motion severity threshold.** The "high % of viewport" cut between Low (small localized transform) and High (full-screen wipe) is grounded qualitatively in Head 2015 [F3] but has no live-observed calibration point. PT0 should confirm where the area cut should sit.
- **Section 2 axis-count weighting.** The single-axis-Low / multi-axis-High split [F9] is sound in theory but uncalibrated against a real example; PT0 should produce one of each.
- **The `feature_loss` displacement for this domain.** A "reduced" mode that *drops* a capability motion-sensitive users need rather than substituting a fade [F20, F23]. Analogous to the Low-Vision audit's still-uncalibrated `simple_mode_removes_power` pattern. No section owns it cleanly yet; decide at PT0 whether it belongs in Section 3 (reduce-block correctness) or warrants its own treatment.
- **Section 6 tool-availability caveat.** A WebFetch / CSS-only PT0 cannot run PEAT or Harding FPA against rendered frames; the flash layer will be an open finding by necessity. Carry forward the question of whether a fetch-only run can ever Pass Section 0, or only Warn.

### Pressure-tested — PT0 (linear.app) — 2026-06-14

**Draft → Pressure-tested. The rubric did not change.** Run id [`evidence/pt0-linear/`](evidence/pt0-linear/). Evidence mode: Path 2 (fetched HTML — 2.38 MB — plus all 17 external stylesheets — 544 KB — grepped). Target: the **linear.app** marketing homepage.

**Result: 1 High / 2 Low / 0 Critical, 4 open questions, 4 positive observations, overall `warn`** (no section Fail). The High (MO-01) is an autoplay video that runs > 5s with no Pause / Stop / Hide control (WCAG 2.2.2 Level A). `unstoppable_motion` and `reduced_motion_ignored` were exercised (`true`); `opt_in_only_safety` passed clean (`false`); `flash_seizure` was honestly `null` — no flashing asset on the target (the Section 0 seizure Critical is not exercisable by a CSS-only fetch, exactly as the parked Section 6 caveat predicted).

**Discipline rule (no over-firing) — four second-pass downgrades, recorded in the run's reclassification trail:** the ungated inline grid-dot field started as a candidate High under the no-reduce-block auto-High [F18], then downgraded to **Low** once all 175 inline keyframes were confirmed opacity-only with zero transform/translate/scale/rotate — opacity motion of stationary elements is Low/Pass [F3, F9]; the marquee was first eyed as a large-area-parallax High and narrowed to single-axis; plus two more. Refusing to score opacity-only motion as a vestibular High is the audit working.

**Parked candidates exercised:** the Section 6 tool-availability caveat held — a fetch-only run cannot run PEAT/Harding against rendered frames, so the flash layer stays an open finding by necessity (Section 0 `warn`, not a forced Pass nor a fabricated Critical). The other three parked candidates (large-area threshold, axis-count weighting, `feature_loss` displacement) await a motion-heavier PT1 target.

### Next

- **PT1 (Pressure-tested → Frozen).** A second pressure test on a different, motion-heavier target where the rubric again does not change freezes the rubric at v0.1.0. A site with flashing media + a PEAT pass (to exercise the Section 0 seizure Critical on real evidence) and a live-browser run with the OS Reduce Motion toggle flipped (to resolve the JS-reintroduction open questions) is the strongest PT1.

[Unreleased]: https://github.com/dogfood-lab/interface-audits/commits/main
