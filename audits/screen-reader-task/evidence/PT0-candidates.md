# PT0 candidate shortlist — Screen Reader Task Audit

This file is the pre-run target shortlist for the **first pressure test (PT0)** of the Screen Reader Task Audit. It is **candidates, not a completed run** — there is no PT0 evidence yet, and this audit is in `Draft` state.

PT0's job (per `../../shared/pressure-test-protocol.md`): does the rubric survive contact with a real task on real AT/browser pairs, and does it produce honest task-completion findings without inventing drama or over-firing on mere ARIA-validity noise? PT0 may revise the rubric; the revision (if any) earns the move from Draft → Pressure-tested, and a later non-revising PT earns Frozen.

The discriminating question for *every* candidate: it must be a target where the ARIA likely passes a scanner **but the task can still fail** — otherwise PT0 is just re-running axe and learns nothing about what this audit adds.

---

## Targets, ranked by likely calibration value

Ranked by how cleanly each exercises the four hard-failure patterns the rubric claims to catch, and how reproducible it is on a Windows + NVDA / web rig without special access.

### 1. A client-side-routed SPA with a multi-step form — e.g. a public, no-login flow on a React/Vue/Angular SPA (a newsletter signup wizard, a multi-step contact or feedback form, a public job-application step-1)

**Why it's the strongest PT0 target.** It exercises three of the four hard-failure patterns at once and the two highest-leverage sections (2 and 3):

- **Section 2 Task path continuity** — a client-side route between wizard steps is exactly where focus is left on the trigger or dropped to `body` with no announcement (findings 16–18). This is the audit's signature failure and the hardest for a scanner to see.
- **Section 1 + Section 4 — passes-axe-cannot-submit** — multi-step forms are where "ARIA present but misapplied" lives, and where validation errors fire (or fail to fire) into a live region (findings 10, 20).
- **Section 3 Dynamic update handling** — async validation and "step N of M" status updates test whether live regions are empty-at-insertion and survive render load (findings 14, 15).

**Calibration value.** If the audit can distinguish a *valid-but-silent* route change (High) from a *managed* one (Pass), and can catch a submit that completes for sighted users but is unannounced for AT, PT0 has proven the audit's core claim. **Reproducible** on NVDA+Firefox and JAWS+Chrome without auth. Pick one real public SPA flow; do not audit a page, audit the task "complete and submit the form."

**Risk to watch.** Over-firing: a route change that *does* announce correctly must score Pass, not a manufactured finding. Apply the `Inferred`/reclassification discipline from `../../shared/pressure-test-protocol.md`.

### 2. A public search-results surface with live-region result counts — e.g. a documentation site search, a library/catalog search, or a store search with "N results" status

**Why it's a good target.** Tight, focused exercise of **Section 3 Dynamic update handling**. Search is the canonical case for finding 14 (pre-populated live region) and finding 8 (results change with no announcement). It also tests **Section 0** (do result headings predict their content) and the NKWYDK edge of **Section 4** (empty results vs still-loading vs nothing-there, finding 13).

**Calibration value.** Calibrates SR-DU-1 (empty-at-insertion) and SR-DU-2 (survives load) against a real result container — the difference between an `aria-live` region that fires and one that is set at render time and stays silent. **Reproducible** on a single pair; a clean PT0 for the dynamic-update section specifically.

**Risk to watch.** This target may under-exercise Sections 2, 5, 6. Good for depth on Section 3, weaker for breadth. Consider pairing it with target 1 rather than running it alone.

### 3. A modal-heavy task flow — e.g. a public checkout, settings, or "add item" flow that opens dialogs (confirmations, pickers, sub-forms)

**Why it's a good target.** The cleanest exercise of **Section 5 Mode switching** — specifically SR-FT-1 (`aria-modal` alone does not contain navigation; JAWS element listing and the VoiceOver rotor leak background content, finding 19). Also tests focus-return-on-close and whether the dialog's task can be completed.

**Calibration value.** Section 5 is otherwise hard to exercise on flat pages; modals are where it lives. Confirms whether the audit correctly requires `aria-hidden` on background containers, not just `aria-modal`. Best run with JAWS (element listing, Insert+F6/F7) and VoiceOver (rotor) — needs at least one of those pairs, slightly higher rig cost than targets 1–2.

**Risk to watch.** Requires the specific AT navigation features (element listing, rotor) to observe the leak. On NVDA alone the background is correctly hidden (finding 19), so an NVDA-only run will *miss* the failure and could wrongly score Pass — record the pair, and treat an NVDA-only result as Inferred/Open question for Section 5.

### 4. The repo's own Starlight handbook search + nav — `https://dogfood-lab.github.io/interface-audits/`

**Why it's a candidate (and a fair self-test).** It is a maintainer-owned surface, so it doubles as an early read on whether the audit produces honest, bounded findings on a friendly target (the role a dogfood run plays later). Tests **Section 0** (heading/landmark story of the docs), **Section 2** (Starlight client-side nav between pages), and **Section 6** (skip link, in-page nav).

**Calibration value.** Lower than 1–3 for the dramatic patterns — a static docs site is unlikely to have an unsubmittable form or a silent error state — but high for proving the audit does **not** invent drama on a healthy target. Useful as a *second* PT or as the eventual dogfood-1, not as the primary PT0, because a clean target can't calibrate the Critical bar.

**Risk to watch.** A clean result is the *expected* result and is not a rubric failure — do not reach for findings to justify the run. If the handbook genuinely completes the task, record positive observations and pass the sections.

---

## Recommended PT0 plan

Run **target 1 (SPA multi-step form)** as PT0 primary — it exercises the most patterns and the highest-leverage sections, on a reproducible NVDA+Firefox / JAWS+Chrome rig. Hold **target 2** as a focused Section 3 follow-up and **target 3** as the Section 5 calibrator (JAWS/VoiceOver). Reserve **target 4** for an early dogfood read once the rubric is Frozen.

Audit a **task**, not a page. Name the AT/browser pairs. Start every finding at the most conservative evidence state and re-check after the run.

---

## PT0 exit criteria

PT0 is complete when the run in `evidence/<pt0-id>/` produces all three output files (`screen-reader-task-findings.md`, `screen-reader-task-scorecard.json`, `remediation-priority-list.md`) and:

- At least 5 findings produced (or an explicit, honest "fewer findings because the task completed cleanly" with the passing sections listed).
- Every finding maps to one of the 8 rubric sections — no orphans.
- Every finding records its **AT/browser pairs**; no finding claims general behavior from a single-pair observation.
- At least one finding identifies a **task-completion failure** (the experience does not finish the job), not merely an ARIA-validity defect — this is the proof the audit adds something axe does not.
- At least one of the four hard-failure patterns is exercised and recorded `true`/`false`/`null` in the scorecard's `hard_failure_patterns_validated` block.
- Every attribute-dependent finding (live region, `aria-errormessage`/`aria-describedby`, `aria-modal`) verifies **announced behavior at runtime**, or is marked Inferred/Open question — a scanner "present" reading does not close it.
- Evidence gaps are preserved as open questions, not laundered into Observed findings.
- The reclassification trail (any finding that started conservative and was confirmed or downgraded on second pass) is recorded in the findings file's auditor-notes section, per `../../shared/pressure-test-protocol.md`.
- If PT0 reveals a missing rubric section or a needed severity refinement, it is logged as a `0.2` candidate in [`../CHANGELOG.md`](../CHANGELOG.md) and the rubric is revised — moving the audit from Draft → Pressure-tested. If PT0 needs **no** rubric change, the next non-revising PT earns Frozen.
