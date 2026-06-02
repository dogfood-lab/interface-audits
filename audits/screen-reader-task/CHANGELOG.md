# Changelog — Screen Reader Task Audit

All notable changes to the **Screen Reader Task Audit** rubric and skill.

This file follows [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/). Rubric versions are independent of the monorepo version. The current rubric is `0.1.0` and is in **Draft** state — authored but not yet pressure-tested.

The rubric ([`RUBRIC.md`](RUBRIC.md)) is canonical. The skill ([`skill/SKILL.md`](skill/SKILL.md)) follows. Pressure-test evidence under `evidence/<run-id>/` will be frozen against the rubric version it ran on and is not rewritten when the rubric advances.

## [Unreleased]

### Pressure-tested — 2026-06-02 PT0 on react.dev/learn

**Status:** Draft → **Pressure-tested**. Rubric `0.1.0` unchanged; revision candidates parked.

**Run:** [`evidence/pt0-react-dev-learn/`](evidence/pt0-react-dev-learn/) · `sr-20260602-react-dev-learn-pt0` · target: `https://react.dev/learn` · Path 2 (WebFetch + GitHub-API source analysis; no live AT). All findings Inferred from markup / ARIA / framework analysis; `at_browser_pairs` set to `["inferred-from-DOM"]`.

**Findings:** 13 (Critical 2 · High 5 · Medium 4 · Low 1) + 5 open questions. Sections: 0 pass, 6 warn, **2 fail** (`dynamic_update_handling`, `error_recovery`).

**Headline finding (single root cause for both Criticals):** **the Sandpack live-code preview's error state has no `aria-live` region**. SR-08 (Section 3) and SR-10 (Section 4) are the same root cause cross-listed — when a code edit raises a runtime error, the rendered output silently changes; a screen reader user has no signal anything went wrong (the NKWYDK pattern, Bigham et al. 2017 — F13 in the rubric). One fix — wrap Sandpack's error pane in an `aria-live="polite"` region with `role="status"` — closes both. Five remaining open questions require live NVDA+Firefox and VoiceOver+Safari to resolve.

**Hard-failure patterns exercised (3/4):** `passes-axe-cannot-complete-task`, `dynamic-update-never-announced`, `cannot-tell-failure-from-not-found`. The fourth pattern (`view-changed-SR-left-behind`) was tested but couldn't be confirmed via DOM alone — left as an open question for live AT resolution.

**Rubric-revision candidates surfaced (parked for next PT, NOT applied):** noted in the findings file's Auditor notes; 3 candidates around mobile-AT pair coverage, Sandpack-class custom-widget framing, and the boundary between Section 3 (dynamic updates) and Section 4 (error recovery) when they share a root cause.

### Hardened — 2026-06-02 external-verifier pass

Two-stage citation hardening per the research-grounded-advisor protocol (Step 4). 21 unique citations checked; 19 existence-confirmed.

- **Survey-attribution flip (F6).** The "31.8% landmark 'always or often' in 2024" figure was originally attributed to WebAIM Screen Reader User Survey #9 (2021); the retrieval oracle confirmed the 31.8% figure is actually from **Survey #10 (2024)**. Survey #9 reports 25.6% in 2021. F6 retargeted; Survey #9 removed from References (no longer cited).
- The 2 cannot_confirm verdicts (Theofanos & Redish 2003; Borodin et al. 2010) were paywall/access-limited fetches on confirmed-real papers; per protocol, paywall ≠ fabrication.

### Added — Draft rubric authored (research-grounded); not yet pressure-tested

- Initial 8-section rubric: Landmark quality, Action discoverability, Task path continuity, Dynamic update handling, Error recovery, Mode switching, Configuration cost, Evidence.
- **Screen Reader Task Law** and framing line: *"This audit does not ask whether an interface passes axe. It asks whether a screen reader user can finish the job."*
- **Boundary rule** vs axe / ARIA validators: validators check ARIA *validity*; this audit checks task *completion*. A passes-axe form may still be unsubmittable. Every section keeps the completion framing.
- **Research grounding** section near the top — 21 verified findings, each connected to the section it justifies. The audit's existence rests on the conformance-coverage gap (Deque 2021; Power et al. 2012; Mankoff et al. 2005; Mateus et al. 2021; Zhong et al. 2025).
- **`AT/browser pairs:` finding field** (extension schema), because behavior is pair-dependent — `aria-errormessage`, modal containment, and route-change focus all diverge across NVDA+Firefox, JAWS+Chrome, VoiceOver+Safari.
- **Section 4 severity precondition.** An error/empty state with none of landmark, live region, or heading is Critical (the NKWYDK pattern, Bigham et al. 2017). A form whose labels/errors are not programmatically associated is Critical (task-blocking), per the 55.6% real-world completion rate (Reuschel et al. 2023). `aria-errormessage` used alone is High (silent on major pairs, Roselli 2023).
- Severity model and section-Fail threshold (1 Critical OR 3 Highs) referenced from `../../shared/severity-model.md`; load-displaced-to enum referenced from `../../shared/finding-format.md` (shared, fixed — this audit adds no displacement values).
- Standalone `skill/SKILL.md` split from the rubric. Rubric is canonical; skill follows.
- PT0 candidate shortlist authored at [`evidence/PT0-candidates.md`](evidence/PT0-candidates.md).

### Pending — to resolve at PT0 and beyond

- **No evidence yet.** This audit is Draft. It has not been pressure-tested, dogfooded, or frozen. The four hard-failure patterns (passes-axe-cannot-submit, view-changed-SR-left-behind, dynamic-update-never-announced, cannot-tell-failure-from-not-found) are uncalibrated until a live PT exercises them.
- **Mobile coverage is thinner than web.** Per Mateus et al. 2021 the scanner gap is larger on mobile and the relevant findings (modal open/close focus, custom-gesture alternatives, dynamic-content notifications) are user-testing-only. A mobile PT (VoiceOver iOS / TalkBack) is wanted but not yet planned.
- **Section overlaps with cognitive-load and the future Low-Vision audit** (Configuration cost; Evidence process gate). Whether to reference vs duplicate is deferred to the first cross-audit review, mirroring the Low-Vision Section 1 decision parked in `../../ROADMAP.md`.

## How this advances

Per `../../shared/audit-lifecycle.md`:

- **Draft → Pressure-tested**: requires one PT in `evidence/<pt-id>/` with findings + scorecard + remediation.
- **Pressure-tested → Frozen**: requires a later PT where the rubric did **not** change; the version is then cut here.
- **Frozen → Dogfooded**: requires a dogfood run on a maintainer-owned surface with no rubric churn.

The PT0 target shortlist and exit criteria are in [`evidence/PT0-candidates.md`](evidence/PT0-candidates.md).
