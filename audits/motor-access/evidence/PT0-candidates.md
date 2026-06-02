# PT0 target shortlist — Motor Access Audit

This is the ranked shortlist of real targets for the **first pressure test** of the Motor Access Audit. PT0 answers: does the rubric survive contact with a real interface, and does it produce honest findings without inventing drama?

The audit is in **Draft** — none of these runs has happened yet. This file lists candidates, not completed runs. When PT0 runs, its outputs land in `evidence/pt0/` (findings, scorecard, remediation list) and this file's chosen target is recorded there.

Ranked roughly by likely calibration value: a good PT0 target exercises several of the five hard-failure patterns at once, is reachable without a paid account, and lets the auditor actually attempt keyboard-only and single-pointer-no-drag interaction (Path 1), not just read a screenshot.

---

## 1. Trello board (trello.com) — drag dependence + timeout + keyboard path

**Why it calibrates.** Trello is the canonical kanban board, and kanban lane transfer is one of the two W3C F108 drag-only failure cases the rubric tests directly (Section 2, finding 18). A real board lets the auditor attempt to move a card between lanes single-pointer-no-drag and keyboard-only, and to reorder cards within a lane — the MA-D2 and MA-D3 questions in their natural habitat. Card-detail modals exercise the Section 0 keyboard-trap and focus-visibility checks. A free board reaches a realistic dense state quickly (many cards, many lanes).

**Patterns exercised.** `drag_only_no_single_pointer_alternative` (primary), `mouse_only_control_no_keyboard_path`, `target_too_small_or_crowded` (card menus, lane controls).

**Access.** Free account; live Path 1 navigation. Strong fit.

**Calibration value for the thin spots.** Moderate — it is mostly a Section 2 / Section 0 target, not a recovery target.

## 2. A government or bank multi-step form with a session timeout — timeout pressure + undo/recovery + keyboard path

**Why it calibrates.** Section 3 (Timeout Pressure) and Sections 4–5 (the audit's thin spots) need a long form with a real session timeout, a date picker, and destructive/irreversible submit steps. Reuschel 2023 (finding 27) measured a 27x completion-time exposure ratio on exactly this surface class, and date pickers caused over a third of blocking failures — the rubric's Section 3 and Section 0 date-picker checks were written against this evidence. A concrete candidate: a public tax-filing flow, a benefits application, or an account-opening wizard with a visible countdown.

**Patterns exercised.** `timeout_faster_than_user_no_extension` (primary), `misactivation_no_recovery`, `mouse_only_control_no_keyboard_path` (date pickers, combo fields).

**Access.** Public flows exist without authenticating up to the timeout-warning step on many. Path 1 where reachable; documentation/Inferred fallback for the steps behind auth. Pick one whose timeout and date picker are reachable pre-auth.

**Calibration value for the thin spots.** **High** — this is the target that best exercises Sections 4 and 5, which the CHANGELOG flags as under-grounded. Strong reason to prioritise.

## 3. A custom range slider / image editor control (e.g. a photo-tool brightness/crop UI) — drag dependence + pointer precision

**Why it calibrates.** Section 2's slider archetype (finding 20) needs a custom slider that may lack track-click, keyboard step, or a numeric input. Image-editor crop and resize handles are the canonical "resize by drag only" case (finding 22), and small handle targets exercise Section 1 rendered measurement (findings 1, 3) and the FFitts absolute-precision floor argument. A concrete candidate: an in-browser photo editor (a free crop/resize tool) or a pricing-range filter on a shopping site.

**Patterns exercised.** `drag_only_no_single_pointer_alternative` (sliders/handles), `target_too_small_or_crowded` (handles), `mouse_only_control_no_keyboard_path`.

**Access.** Free/public; live Path 1. Good fit for testing the Section 1 rendered-measurement fallback (Section 7 caveat) on a desktop rig.

**Calibration value for the thin spots.** Low — mostly Sections 1 and 2.

## 4. A drag-to-upload file picker (any "drag files here" drop zone) — drag dependence + keyboard path

**Why it calibrates.** Section 2's file-upload archetype (finding 20) tests whether a drop zone coexists with a visible Browse / Choose File button. This is a fast, high-frequency check that appears on countless real forms; a clean PT0 sub-test confirms the rubric correctly passes a drop-zone-with-Browse-button (cost = none) and fails a drop-zone-only (exclusion = Critical). Useful as a calibration of the exclusion-vs-cost boundary on a simple, unambiguous case.

**Patterns exercised.** `drag_only_no_single_pointer_alternative` (primary, simple case).

**Access.** Trivial; many public forms. Best used as a secondary surface within a larger run rather than a standalone PT0.

**Calibration value for the thin spots.** Low — single-pattern.

## 5. The repo's own handbook (dogfood-lab.github.io/interface-audits) — keyboard path + pointer precision (dogfood, later)

**Why it calibrates.** A friendly, owned, mostly-static target to confirm the audit produces honest *bounded* findings without inventing drama — the same role Dogfood-1 played for cognitive-load. Static docs should mostly Pass Sections 2–5 (little drag, no timeouts), exercising Section 0 (skip link, focus visibility) and Section 1 (link/control target sizes). **This is a dogfood candidate, not a PT0 candidate** — per the lifecycle, the rubric must first survive a real external pressure test before a clean dogfood run means anything. Listed here so it is not forgotten.

**Patterns exercised.** Mostly clean passes; `mouse_only_control_no_keyboard_path` and `target_too_small_or_crowded` on nav/links if any.

**Access.** Owned; live Path 1. Reserve for after PT0.

---

## Recommended PT0 pick

**Lead with candidate 2 (the multi-step form with a session timeout), paired with candidate 1 (Trello) as a second surface in the same run.** Together they exercise all five hard-failure patterns and, critically, the form surface is the strongest available calibration for Sections 4 and 5 — the two sections the CHANGELOG flags as under-grounded. Candidate 1 supplies the clean drag-dependence and keyboard-path evidence. Candidate 3 or 4 can be folded in as a focused Section 2 sub-test if time allows.

## PT0 exit criteria

PT0 is complete and the audit advances **Draft → Pressure-tested** when `evidence/pt0/` contains a findings file, a schema-valid scorecard, and a remediation list, and all of the following hold:

- At least 5 findings produced (or an explicit "fewer because the target was clean — sections that passed listed").
- Every finding maps to one of the 8 rubric sections; no orphans.
- Every interactive task was attempted **keyboard-only** and **single-pointer-no-drag**; the input mode is recorded per finding. (If neither was exercised, Section 7 fails and the run does not count.)
- At least one finding is classified `exclusion` and at least one `cost` (`interaction_cost_class`), proving the boundary rule discriminates on a real target.
- Drag and ARIA-widget findings rest on a human end-to-end completion test, not a markup scan (findings 15, 19, 23).
- Evidence gaps preserved as open questions, not laundered into confirmed findings.
- The findings file itself obeys the audit's own conventions (plain language, short sentences, structured headings).
- A note records whether Sections 4 and 5 gained independent calibration; if PT0 did not exercise accidental-activation recovery, that gap is carried forward to PT1.
- If the rubric needed changing to fit the target honestly, that change is the PT0 product and earns rubric `v0.2`; if the rubric did **not** change, PT0 is the freeze candidate per [`../../../shared/audit-lifecycle.md`](../../../shared/audit-lifecycle.md).

A PT0 designed to find a specific failure shape (e.g. "find a drag-only exclusion") is at structural risk of over-fitting. Per [`../../../shared/pressure-test-protocol.md`](../../../shared/pressure-test-protocol.md), start each finding at the most conservative evidence state and re-check after the run; a second-pass downgrade is the audit working, and the reclassification trail belongs in the run's auditor-notes section.
