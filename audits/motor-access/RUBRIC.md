# Motor Access Audit

> **Motor Access Law**
>
> A task that is completable only with precise, sustained, or fast pointer input is not accessible — it is *expensive*. Any interface that requires a mouse, a drag, a small-target hit, or an act-within-N-seconds where a single click, a keyboard path, a larger target, or more time would do has not made the task harder to understand. It has made it harder to *perform*.

> This audit does not ask whether an interface can be operated. It asks **how much motor effort, precision, and time the operation costs** — and whether the same task is cheaper by another path.

## Purpose

Most accessibility audits answer "is this perceivable and labelled?" This one answers "is this *operable* without precise hands, sustained holds, or a fast clock?" — at the keyboard layer, the pointer layer, the drag layer, and the timing layer.

It is intended for:
- Product reviews of tools where interaction is dense — forms, editors, dashboards, boards, file managers, control planes
- Self-audits by teams shipping interfaces used by people with tremor, limited range, switch input, eye-gaze, or one hand busy
- Calling out interaction cost that a scanner reports as "passing" because the bounds metadata is correct even when the rendered control is unreachable

It is **not**:
- A WCAG conformance scan (use axe, Lighthouse, Pa11y for that — and note finding 6: scanners miss roughly half of real touch-target violations)
- A subjective "feels clunky" review
- A disabled-users-only feature list — motor bandwidth varies for every user across injury, fatigue, a phone in one hand, a trackpad on a train, a cast on a wrist; this audit treats motor-state variation as the baseline, not the edge case

## How to use this audit

1. Define the **target**: URL, app flow, screen, or component.
2. Define the **input modes** in scope: keyboard-only, single-pointer-no-drag, touch, switch/scan, eye-gaze. The audit must be run against at least keyboard-only and single-pointer-no-drag — these are the cheapest two paths a motor-impaired user has.
3. Define the **state**: empty, normal, dense, worst-case (a long sortable list, a kanban board with full lanes, a form with a date picker and a session timeout). The audit must be run against the realistic dense, interactive state — this is Section 7.
4. Walk the eight sections in order. Each section produces zero or more findings.
5. Score each section: **Pass / Warn / Fail**. A Fail in any section blocks "Motor Access Audited" status.
6. Output findings in the format specified later in this document.

Sections are ordered from the hardest blocker (no keyboard path at all) to the most architectural (evidence). A keyboard trap (Section 0) excludes a population entirely; a small target (Section 1) raises cost for the same population. Both are findings; they are not the same severity.

**Boundary rule — this whole audit is about interaction cost.** Frame every finding as cost, not preference. The same task is completable; the barrier is the motor effort, the precision demand, or the time pressure it imposes. Distinguish two shapes throughout:

- **Impossible without a mouse / a drag / a fast hand** — there is no other path. This is *exclusion*. A keyboard trap, a drag with no single-pointer alternative, or a timeout that cannot be extended is exclusion, and exclusion is Critical (or Section 0's page-level blocker).
- **Possible but high-cost** — the task completes by an available path, but the path demands precision (small targets), sustained coordination (drag where a click would do), or speed (tight but extendable timeouts). This is *cost*, and it scales from Low to High by how central the task is and how elevated the population's baseline error rate already is.

The same control can be both: a 20px reorder handle that is drag-only is *exclusion* for an eye-gaze user (no drag path) and *high cost* for a tremor user on a mouse (drag plus a sub-30mm target). Record the worse of the two.

---

## Research grounding

This rubric is grounded in the empirical motor-access literature. Each finding below is referenced by number where it justifies a section, a question, or a severity. Citations without an architectural connection are noise; every finding here is load-bearing for at least one rule.

1. **Motor-impaired users made 2.9x more errors and 3.9x more misses than controls on touch targets, and kept improving past the 30mm size where non-disabled performance plateaued at 20mm.** Chen KB et al. 2013 (DOI:10.1016/j.apergo.2012.08.004). Justifies Section 1's High-severity rule for any interactive target below ~30mm physical (~113px at 96dpi): the 20mm / 72px threshold that satisfies typical users underserves this population by a measured factor.
2. **Users with fine or gross motor disabilities exerted measurably different touch forces and dwell times across 10–30mm buttons, confirming target size modulates effort, not just error rate.** Sesto ME et al. 2012 (DOI:10.1177/0018720811433831). Justifies framing Section 1 as an *interaction cost* violation, not merely "error prevention" — captures the effort dimension that pure miss-rate data omits.
3. **Finger-touch endpoints follow a dual distribution with an absolute-precision component (σ_a) independent of movement speed; small targets are harder than classic Fitts predicts and cannot be fixed by moving slowly.** Bi X et al. 2013 (ACM CHI 2013, DOI:10.1145/2470654.2466180). The theoretical anchor for Section 1: there is a hard floor (~7–8mm σ_a footprint) below which no speed-accuracy tradeoff compensates. "Slow down and aim" is not a valid mitigation.
4. **Fitts-derived metrics correlate with tremor severity in essential-tremor patients (spiral outside-area R²=0.57–0.83), so pointing difficulty scales with tremor magnitude beyond what target size alone predicts.** Kim J et al. 2022 (DOI:10.1109/JBHI.2021.3129989). Justifies Section 1's adjacent-target-spacing rule: a small target close to a neighbour is a documented tremor trap (σ_a imprecision plus tremor overshoot).
5. **Parkinson's patients showed prolonged transition and sliding times on touch tasks; medication restored simple tapping but not complex gestures, so gesture complexity is an independent barrier from target size.** De Vleeschhauwer J et al. 2021 (DOI:10.1002/mdc3.13179). Justifies separating Section 2 (drag / gesture dependence) from Section 1 (target size): restoring basic motor function does not restore gesture capability, so the two must be probed independently.
6. **44% of 1,599 production screens had motor-accessibility violations, and Google's Accessibility Scanner recalled only 50.85% of visual touch-target violations — about half of real violations are invisible to scanners.** MotorEase team / Krishnavajjala et al. 2024 (ACM ICSE 2024, DOI:10.1145/3597503.3639167; arXiv:2403.13690). The core justification for this audit's existence and for Section 7: scanner-passing does not imply motor accessibility, because scanners check metadata bounds, not rendered bounds. MA items rely on manual measurement or rendered-UI analysis, not scanner output alone.
7. **WCAG 2.2 SC 2.5.8 (24px AA) has a spacing exception that lets sub-24px targets pass if surrounding dead space pads the offset area, yet the Understanding text admits these remain "very small and difficult to activate."** W3C WAI 2023 (WCAG 2.2 SC 2.5.8). Justifies Section 1's hard rule that a 2.5.8 pass is *not sufficient* to close a finding: measure rendered visual size independently; sub-24px targets riding the spacing exception are flagged Medium.
8. **14 of 20 motor-disabled users had target-acquisition error rates above 10%, and 55% of their drag-and-drop attempts failed entirely; six controls had no equivalent difficulty.** Trewin & Pain 1999 (DOI:10.1006/ijhc.1998.0240). The empirical spine of Sections 1 and 2: drag failure for this population is not degraded experience, it is task-complete failure for the majority. Justifies Section 2's Critical default for drag-only paths and Section 0's blocker for pointer-only affordances with no keyboard path.
9. **Only 17.1% of the top million home pages have any skip-navigation link, and one in ten of those is broken — the standard keyboard shortcut past repeated navigation is absent or non-functional on ~85% of pages.** WebAIM 2026 (WebAIM Million 2026). Justifies Section 0's skip-link check (link exists, is keyboard-reachable, target is present in the DOM) at High severity: absence forces a keyboard user through the full navigation sequence on every page load.
10. **A single component where keyboard focus cannot be escaped fails WCAG Conformance Requirement 5 (Non-Interference), making the entire page non-conformant regardless of all other work.** W3C WAI 2018 (WCAG 2.1 SC 2.1.2). Justifies Section 0's page-level blocker: a keyboard trap is the one finding that single-handedly fails the whole page. Test modals, carousels, date pickers, embedded players, and third-party widgets by Tab-cycling with no mouse; a trap that needs a mouse-click to dismiss is an automatic blocker.
11. **WCAG 2.1 SC 1.4.13 (Content on Hover or Focus) names three motor-specific failure modes for hover-only content: unintentional trigger, inability to move the pointer onto the revealed content before it closes, and content that obscures the focus target.** W3C WAI 2018 (WCAG 2.1 SC 1.4.13). Justifies the hover-only check in Sections 0 and 5: a tooltip, dropdown, or popover with no focus equivalent is High, and the revealed content must be reachable, dismissible (Escape), and persistent until intentionally closed.
12. **WCAG 2.2 SC 2.4.13 (Focus Appearance) sets measurable minimums — a 2 CSS-pixel perimeter and 3:1 contrast — because SC 2.4.7 allowed indicators too faint to locate.** W3C WAI 2023 (WCAG 2.2 SC 2.4.13). Justifies Section 0's focus-visibility check: passing 2.4.7 is insufficient; measure the indicator's size and contrast. A sighted keyboard user cannot operate a page when focus is invisible — High.
13. **MotorEase surveyed 1,599 screens and found systematic failures in four categories automated tools did not measure: touch-target size, expanding-section operability, element persistence, and adjacent-icon spacing.** Krishnavajjala et al. 2024 (arXiv:2403.13690). Justifies dedicated checks beyond scanner output: persistent reachable controls (Section 4), adjacent spacing (Section 1), and keyboard-operable collapsible sections (Section 0). All four categories map to MA checks.
14. **"Lack of keyboard accessibility" ranks 5th among problems for screen-reader users; 67% never or rarely report barriers, and only 2.2% of respondents report motor disabilities — the population is structurally underrepresented in complaint data.** WebAIM 2024 (Screen Reader Survey #10). Justifies Section 7's rule that MA severities are *not* discounted for "low-impact population": the silence is a measurement artifact, so keyboard operability must be found by systematic audit, not by waiting for complaints.
15. **WAI-ARIA declares roles and states but adds no keyboard behaviour; every ARIA widget needs author-implemented keyboard interaction, so a `role="button"` with no keyboard handler is valid markup that a keyboard user cannot activate.** W3C WAI 2023 (WAI-ARIA 1.2). Justifies Section 0's per-widget keyboard check: for every ARIA widget role (button, combobox, dialog, listbox, menu, slider, tab, tree), verify the ARIA Authoring Practices keyboard pattern is implemented — scanners pass the role alone. High for any widget where mouse click is the only activation path.
16. **Dragging shows 3–5x higher error rates than pointing across mouse, stylus, and trackball (10.8% / 13.6% / 17.3% vs ~3.5–4%), so drag is a fundamentally harder motor task than a click.** MacKenzie, Sellen, et al. 1991 (CHI 1991, pp. 161–166). The baseline for Section 2: drag inherits a 3–5x error penalty even for non-impaired users on standard devices, and that baseline compounds with tremor or limited precision. Justifies treating drag-only paths as Critical.
17. **WCAG 2.2 SC 2.5.7 requires every drag-operated function to have a single-pointer non-drag alternative; the "essential" exception is narrow.** W3C WAI 2023 (WCAG 2.2 SC 2.5.7). The normative anchor for all Section 2 items: test each drag function (slider, reorder, file-drop, map pan, kanban transfer) for a functionally equivalent single-pointer path. Absence is a hard gate failure regardless of keyboard accessibility. The Understanding text names trackball, head-pointer, eye-gaze, and speech-emulator users as affected.
18. **W3C Failure F108 enumerates two canonical drag-only failures — list reordering and kanban lane transfer — that fail 2.5.7 with no single-pointer alternative.** W3C WAI 2023 (WCAG 2.2 Technique F108). Justifies Section 2's reorder and kanban questions: attempt the move with single clicks only (no sustained hold); the conforming pattern is a source-element activation plus a destination menu.
19. **Automated scanners can detect `draggable` attributes and DnD libraries but cannot verify a sufficient alternative exists — drag compliance is a manual judgment.** TestParty editorial team 2025 (TestParty 2025 WCAG 2.5.7 Guide). Justifies the Section 2 methodology note: detection (scan for `draggable`, `ondragstart`, Sortable.js / React DnD signatures) is a discovery step only; the pass test is a human end-to-end completion with single clicks. Prevents a false pass from automated-only runs.
20. **The five highest-frequency 2.5.7 failures are file-upload drop zones, custom sliders without track-click, kanban boards, pan-only maps, and sortable lists; each has a specific conforming alternative.** TestParty editorial team 2025 (TestParty 2025 WCAG 2.5.7 Guide). Structures Section 2's checklist around five interaction archetypes, each with a detection signal, a required alternative, and a test procedure.
21. **Drag-and-drop is inaccessible to eye-gaze, head-pointer, switch, and speech-recognition users because sustained hold-and-move needs coordinated input these devices cannot reliably produce.** Accessibility Spark editorial team 2025 (Drag and Drop Accessibility, 2025). Justifies Section 2's Critical (not Medium) severity rationale: drag-only failure is total task exclusion for an identifiable AT population, not mere friction.
22. **Two validated single-pointer drag alternatives are click-to-place (click source, then click destination) and a move-button with a destination menu, both using ARIA live regions to confirm identity and state.** Jesse Hausler 2017 (Salesforce UX, "4 Major Patterns for Accessible Drag and Drop"). The practitioner reference for Section 2 pass criteria: accept a Move/Reorder button with a destination selector, up/down positional buttons with live-region feedback, or a numeric position input. `aria-grabbed` with no pointer alternative fails.
23. **React Aria's accessible drag-and-drop required resolving 13+ browser bugs and original interaction design because no ARIA authoring-practices pattern for DnD existed.** React Aria team (Adobe) 2023 (React Aria Blog, "Taming the dragon"). Context note for Section 2 and Section 7: pre-2023 custom kanban/reorder/carousel implementations are likely bespoke and undertested, so each must be tested from scratch — do not assume a visible drag widget follows any established pattern. Raises the audit-cost estimate for any custom DnD.
24. **Switch-scanning users enter text at ~1.7 WPM on average — about 7x slower than the 12.5 WPM standard-keyboard rate for people with physical disabilities — so any fixed time limit built for typical typists excludes them.** Koester & Arthanat 2018 (DOI:10.1080/10400435.2017.1291544). Justifies Section 3's Critical default: a timeout that cannot be extended or turned off structurally excludes scan-input users regardless of effort. Grounds the "at least 10x the default" expectation.
25. **Default touch sensing misses motor-impaired users' intended coordinates by >3x the error margin of template matching, so accidental activations are the norm without recovery affordances.** Mott et al. 2016 (CHI 2016 Best Paper, DOI:10.1145/2858036.2858390). Justifies Sections 4 and 5: protect destructive or irreversible actions with up-event activation (WCAG 2.5.2 pointer cancellation), a confirmation, or undo. Without one of these, an imprecise contact has no recovery path — High.
26. **Production UIs systematically have close-proximity icons and disappearing/persisting elements that directly cause accidental activation and recovery failure for motor-impaired users.** Krishnavajjala et al. 2024 (arXiv:2403.13690). Justifies Section 4's persistence-and-spacing questions: hover/focus-revealed elements should persist ≥3s before auto-dismissal and adjacent actionable icons need ≥8px spacing. Medium per violation; Critical when combined with no undo (a permanent unrecoverable mis-activation).
27. **Screen-reader users completing Fortune 500 job applications failed 44% of attempts and took up to 2h15m versus under 5 minutes for others — a timeout exposure ratio up to 27x — and date pickers caused over a third of blocking failures.** Reuschel et al. 2023 (DOI:10.1177/0145482X231216757). Justifies Section 3's Critical for session timeouts: a 27x time ratio means standard 15- or 30-minute timeouts actively block slow-input users on complex forms; data must survive a missed timeout, and the limit must be extendable.
28. **Auto-forwarding carousels show content as little as 20% of the time and remove it before slow-input users can act, making them a de facto timed interaction with no extension.** Nielsen 2013 (NN/g, "Auto-Forwarding Carousels and Accordions Annoy Users and Reduce Visibility"). Justifies Section 3's High for any auto-advancing content: it must pause on keyboard focus and offer a persistent pause/stop control reachable without timing pressure.
29. **WCAG 2.2 SC 2.2.1's 10x-extension / 20-second-warning thresholds were chosen from clinical experience, not controlled studies, and the text admits "some users would fail regardless of duration" — the standard is a floor, not a guarantee.** W3C WAI 2023 (WCAG 2.2 SC 2.2.1). Justifies Section 3's calibration note: 2.2.1 conformance is necessary but not sufficient; flag any timeout whose extension mechanism is itself keyboard-inaccessible or demands acting within 20 seconds, even on a technically conformant page.

---

## Section 0 — Keyboard Path

**Purpose.** Whether every interactive action can be completed by keyboard alone, with no trap and a visible, well-ordered focus. This is the exclusion layer: a keyboard user with no usable pointer must be able to reach and operate everything, or the task is impossible — not merely costly.

**Failure modes.**
- A control reachable and operable only by mouse click — no Tab-reach, no Enter/Space activation (finding 15)
- A keyboard trap: focus enters a modal, carousel, date picker, embedded player, or third-party widget and cannot Tab or Escape out (finding 10)
- An ARIA widget with the correct role but no implemented keyboard interaction (`role="button"` with a click-only handler; a custom listbox with no arrow-key handling) (finding 15)
- No skip-to-main link, a skip link that is not keyboard-reachable, or a skip link whose anchor target is missing (finding 9)
- A focus indicator that is invisible, removed (`outline: none` with no replacement), or below the 2px / 3:1 minimum (finding 12)
- Content available only on pointer hover, with no focus equivalent and no keyboard dismissal (finding 11)
- Custom `tabindex` use producing an illogical or circular focus order (finding 9)

**Audit questions.**
- For the five most common tasks, can every step be completed with keyboard only — Tab to reach, Enter/Space (or the documented key) to activate? If any step needs a mouse, it is an exclusion finding. (findings 8, 15)
- Does any modal, carousel, date picker, embedded media player, or third-party chat widget trap focus when Tab-cycled with no mouse available? A trap dismissible only by mouse click is an automatic page-level blocker. (finding 10)
- For every ARIA widget role present (button, combobox, dialog, listbox, menu, slider, tab, tree), is the ARIA Authoring Practices keyboard pattern implemented — not just the role declared? (finding 15)
- Is there a skip-to-main link that is keyboard-reachable, and does its anchor target exist in the DOM? (finding 9)
- Is the keyboard focus indicator always visible, at least a 2px perimeter, and at least 3:1 against the unfocused state — even where the design overrides the browser default outline? (finding 12)
- Is any content available only on pointer hover (tooltips, menus, popovers), or is the same content reachable on focus and dismissible by keyboard? (finding 11)
- Do collapsible/expandable sections open and close by keyboard? (finding 13)

**Standards / research anchors.**
- WCAG 2.2 2.1.1 (Keyboard), 2.1.2 (No Keyboard Trap), 2.4.7 (Focus Visible), 2.4.13 (Focus Appearance), 1.4.13 (Content on Hover or Focus)
- WAI-ARIA 1.2 and the ARIA Authoring Practices Guide (findings 9–15)

**Severity note for this section.** A keyboard trap (finding 10) is the one finding that fails the entire page under WCAG Non-Interference; it is treated as a **Critical** that produces an automatic section Fail, regardless of the 3-High threshold. A mouse-only control with no keyboard path (finding 8, 15) is **Critical** — exclusion, not cost. A missing or broken skip link (finding 9) is **High**. An invisible or sub-threshold focus indicator (finding 12) is **High**. Hover-only content with no focus equivalent (finding 11) is **High**.

**Automation.** Partial. Missing focus indicators, removed outlines, hover-only triggers, missing skip-link targets, and illogical `tabindex` can be flagged statically. Whether an ARIA widget's keyboard pattern actually works, and whether a focus trap escapes, are manual-only — a scanner sees a valid role and a valid attribute (finding 15).

---

## Section 1 — Pointer Precision

**Purpose.** Whether interactive targets are large enough, and spaced far enough apart, to be hit without precise pointer control. This is a cost layer: the target is reachable, but the precision demand raises error rate and effort for anyone with tremor, limited fine control, or a small contact patch.

**Failure modes.**
- Interactive targets below ~24px (the WCAG 2.2 2.5.8 AA minimum) with no spacing exception (finding 7)
- Targets that pass 2.5.8 only via the spacing exception yet remain very small (sub-24px) and hard to activate (finding 7)
- Targets below ~30mm physical (~113px at 96dpi) on touch surfaces where motor-impaired users still benefit from larger sizes (finding 1)
- Adjacent actionable icons with insufficient gap, so a tremor overshoot lands on the neighbour (findings 4, 13)
- A design that assumes "slow down and aim" mitigates a small target — it does not, below the absolute-precision floor (finding 3)

**Audit questions.**
- Does every interactive target meet WCAG 2.2 2.5.5 (44×44px, AAA target) or at minimum 2.5.8 (24×24px, AA)? (finding 7)
- For touch surfaces, are primary targets at least ~30mm physical (~113px at 96dpi)? The 20mm / 72px size that satisfies typical users underserves motor-impaired users by a measured factor. (finding 1)
- Does any target pass 2.5.8 only through the spacing exception while remaining sub-24px? If so, it is flagged regardless of conformance — measure the rendered visual size, not the metadata bounds. (findings 6, 7)
- Do adjacent actionable elements have enough spacing (≥8px is the floor; more for dense icon clusters) that a tremor overshoot does not hit the neighbour? (findings 4, 13)
- Is target size treated as an interaction-cost variable (effort + error), not just a visual-legibility concern? (finding 2)

**Standards / research anchors.**
- WCAG 2.2 2.5.5 (Target Size — Enhanced, AAA), 2.5.8 (Target Size — Minimum, AA)
- FFitts Law and the absolute-precision floor (finding 3); tremor scaling (finding 4); disabled-user size benefit past 30mm (findings 1, 2)

**Severity note for this section.** A target below ~24px with no spacing exception is **Medium** (it misses the AA threshold). A target on a core, frequent action below ~30mm physical on touch is **High** (finding 1: this population's error and miss rates are 2.9–3.9x baseline at typical sizes). Adjacent-icon crowding on a destructive control is **High** when paired with no undo (cross-reference Section 4). A 2.5.8 spacing-exception pass on a sub-24px target is **Medium** — conformance does not close the finding (finding 7).

**Automation.** Partial — and the partial is a trap. A scanner can compare declared element bounds to a threshold, but recalls only ~50.85% of real visual touch-target violations because it checks metadata bounds, not rendered bounds (finding 6). Rendered measurement or computer-vision analysis of the actual UI is required; scanner output alone is not sufficient.

---

## Section 2 — Drag Dependence

**Purpose.** Whether every drag-operated function has a single-pointer, non-drag alternative — and ideally a keyboard one. This is the second exclusion layer: drag requires four coordinated motor actions (press, hold, reposition, release), and a population of AT users cannot produce them at all. Where there is no alternative, the task is impossible, not expensive.

**Failure modes.**
- A sortable list reorderable only by drag, with no single-pointer alternative (findings 18, 20)
- A kanban board where items move between lanes only by drag (findings 18, 20)
- A custom slider with no track-click, no increment/decrement keys, and no numeric input (finding 20)
- A file-upload drop zone with no Browse / Choose File button (finding 20)
- A map or canvas with pan/zoom only by drag, no directional buttons or search (finding 20)
- A resize handle operable only by drag (finding 22)
- An `aria-grabbed` widget exposing drag to assistive tech but offering no pointer alternative (finding 22)

**Audit questions.**
- **MA-D1 (drag baseline).** For every drag-operated function, is there a functionally equivalent single-pointer path that completes the same outcome without a sustained hold? Absence is a hard gate failure regardless of keyboard accessibility. (findings 8, 16, 17)
- **MA-D2 (reorder).** For each reorderable list, can an item be moved using single clicks only — no hold — via a Move/Reorder button with a destination menu, up/down positional buttons, or a numeric position input? (findings 18, 22)
- **MA-D3 (kanban / cross-list).** For each board, can a card move between lanes by a single-pointer series of clicks, and can an eye-gaze / head-pointer / switch user complete it via the offered alternative? (findings 18, 21)
- **Sliders, uploads, maps.** Does each slider support track-click or a numeric input; does each drop zone coexist with a visible Browse button; does each map offer directional buttons or search? (finding 20)
- **Discovery vs proof.** Detection (scan for `draggable`, `ondragstart`, Sortable.js / React DnD signatures) only locates drag; the pass test is a human end-to-end completion with single clicks. Do not pass on automated detection alone. (finding 19)

**Standards / research anchors.**
- WCAG 2.2 2.5.7 (Dragging Movements, AA) and Failure F108 (findings 17, 18)
- Drag error penalty 3–5x over pointing (finding 16); AT exclusion classes (finding 21); conforming patterns (findings 22, 23); gesture complexity as an independent barrier (finding 5)

**Severity note for this section.** A drag-only path with **no** single-pointer alternative is **Critical** — exclusion. 55% of motor-disabled users' drag attempts fail outright (finding 8), and eye-gaze / head-pointer / switch / speech users cannot drag at all (finding 21); the failure is task-complete, not friction (finding 16). A drag function that **has** a single-pointer alternative which is hidden, broken, or harder to discover is **High** (cost, not exclusion). A drag function with a working, discoverable alternative is Pass or Low. Because no ARIA authoring-practices DnD pattern existed before 2023, every custom drag widget must be tested from scratch — a visible drag affordance is not evidence of a conforming alternative (finding 23).

**Automation.** No for the pass decision. A scanner can detect drag listeners and DnD libraries but cannot verify that a sufficient alternative exists or achieves the same outcome — that is human judgment (finding 19). Detection is a discovery step only.

---

## Section 3 — Timeout Pressure

**Purpose.** Whether the user can complete timed interactions at their own pace — extend a session, stop an auto-advance, dismiss a countdown — without losing work. This is a time-cost layer that becomes exclusion at the limit: a timeout that cannot be extended excludes anyone whose input rate is a fraction of a typical typist's.

**Failure modes.**
- A session timeout that cannot be extended or turned off, with no warning or a warning that demands action within seconds (findings 24, 29)
- A form that discards entered data on timeout (finding 27)
- Auto-advancing content (carousel, ticker, auto-play slideshow) that removes content before a slow-input user can act, with no pause control (finding 28)
- A countdown or auto-submit on a flow that a switch/scan user cannot complete in the allotted time (finding 24)
- A timeout that is technically WCAG-conformant but whose extension control is itself keyboard-inaccessible (finding 29)

**Audit questions.**
- Does every timed interaction (session timeout, auto-advance, countdown) allow the user to turn it off, extend it, or adjust it to at least 10x the default? (findings 24, 29)
- If a session times out, is all entered form data preserved, and is the limit extendable to at least 20 minutes of inactivity? A measured exposure ratio of up to 27x means standard 15–30-minute timeouts actively block slow-input users on complex forms. (finding 27)
- Does any auto-advancing content pause on keyboard focus and provide a persistent pause/stop control reachable without timing pressure? (finding 28)
- Is the mechanism to extend or dismiss a timeout itself reachable by keyboard, within a time a slow-input user can meet — not a button that must be hit within 20 seconds? (finding 29)

**Standards / research anchors.**
- WCAG 2.2 2.2.1 (Timing Adjustable, A), 2.2.4 (Interruptions, AAA)
- Switch-scan input rate ~1.7 WPM (finding 24); 27x form-completion exposure ratio (finding 27); auto-forward carousel visibility loss (finding 28); 2.2.1 as a clinical floor, not a guarantee (finding 29)

**Severity note for this section.** A timeout that cannot be extended or turned off is **Critical** — exclusion for scan-input users at any duration (finding 24). A timeout that discards form data on expiry is **Critical** on a multi-step or long form (finding 27). Auto-advancing content with no pause control is **High** (finding 28). A WCAG-conformant timeout whose extension control is keyboard-inaccessible or demands action within 20 seconds is **High** — conformance does not close the finding (finding 29).

**Automation.** No. Runtime, behavioural check — the auditor must trigger the timeout and attempt to extend it, and must let an auto-advance run while attempting to act on the content.

---

## Section 4 — Undo / Recovery

**Purpose.** Whether an action taken by mistake — an accidental click, a mis-aimed tap, a stray activation — can be reversed cheaply, ideally with one key. This is a recovery-cost layer. Motor-impaired users mis-activate by default; the question is whether the interface assumes precision it cannot guarantee.

**Failure modes.**
- A destructive or irreversible action (delete, send, submit, discard) with no undo, no confirmation, and no up-event activation (finding 25)
- Activation on the down-event (pointer-down / touchstart) rather than the up-event, so a contact cannot be aborted by sliding off before release (finding 25, WCAG 2.5.2)
- Interactive elements that appear on hover/focus and auto-dismiss before a slow user can act, so a mis-activation lands on whatever replaced them (findings 13, 26)
- Adjacent actionable icons close enough that a tremor overshoot triggers the wrong, unrecoverable action (findings 4, 26)
- No one-key reverse (Ctrl/Cmd+Z or an Undo control) for the most common reversible actions

**Audit questions.**
- Are destructive or irreversible actions protected by at least one of: up-event activation only (WCAG 2.5.2 pointer cancellation), a confirmation step, or an undo within ~30 seconds? Without one, an imprecise contact has no recovery path. (finding 25)
- Is activation bound to the up-event, so a user who realises mid-press they aimed wrong can slide off the target and release safely? (finding 25)
- Do interactive elements revealed on hover/focus persist for at least ~3 seconds before any auto-dismissal, so a slow user can move to and activate them? (findings 13, 26)
- Is there a one-key reverse (Undo) for the most common reversible actions, reachable by keyboard? (finding 26)
- Are adjacent actionable icons spaced so that an overshoot does not trigger a different, unrecoverable action? (findings 4, 26)

**Standards / research anchors.**
- WCAG 2.2 2.5.2 (Pointer Cancellation, A), 3.3.4 (Error Prevention, AA)
- Default touch sensing misses intended coordinates by >3x (finding 25); production prevalence of close icons and disappearing elements (finding 26); tremor overshoot (finding 4)

**Severity note for this section.** A destructive/irreversible action with no up-event activation, no confirmation, and no undo is **High** — an imprecise contact has no recovery path (finding 25). A persisting/disappearing element failure is **Medium** per violation, escalating to **Critical** when combined with no undo: a permanent, unrecoverable mis-activation (finding 26). Down-event activation on a destructive control is **High** (it removes the one in-flight abort a motor-impaired user has). These are interaction-cost findings: the action is performable, but the cost of an error is high and the recovery path is missing.

**Automation.** Partial. Down-event vs up-event activation and missing-undo affordances can sometimes be inferred from event handlers; whether a confirmation is meaningful and whether an element persists long enough are runtime checks.

---

## Section 5 — Error Recovery

**Purpose.** Whether, when an interaction goes wrong — a wrong target hit, a hover-content lost, an input rejected — the user can tell what happened and get back on the task path without precise, fast, or sustained input. Section 4 is about reversing an action; this section is about recovering the flow.

**Failure modes.**
- Hover-revealed content (a tooltip, a submenu, a popover) that the user cannot move the pointer onto before it closes, so the information needed to recover is unreachable (finding 11)
- Content that obscures the focused element with no keyboard method to dismiss it, leaving the user stuck (finding 11)
- A rejected input or failed gesture with no path back except repeating the same precise/sustained action (findings 5, 26)
- A complex multi-step gesture path where one mis-step forces a restart from the beginning (finding 5)
- An error or status message that the user cannot reach or dismiss without a mouse

**Audit questions.**
- For any hover-triggered content, can the pointer move from the trigger onto the revealed content without it dismissing, and can the content be dismissed by keyboard (Escape)? (finding 11)
- Does any revealed content obscure the element the user was operating, with no keyboard way to clear it? (finding 11)
- When an input is rejected or a gesture fails, is there a recovery path that does not require repeating the same precise or sustained motor action? (findings 5, 26)
- For multi-step gesture paths, does a single mis-step force a full restart, or can the user resume from the failed step? (finding 5)
- Are error and status messages reachable and dismissible by keyboard? (finding 11)

**Standards / research anchors.**
- WCAG 2.2 1.4.13 (Content on Hover or Focus, AA), 3.3.1 (Error Identification, A), 3.3.3 (Error Suggestion, AA)
- Hover-content failure modes (finding 11); gesture complexity as an independent barrier (finding 5); accidental-activation prevalence (finding 26)

**Severity note for this section.** Hover content that cannot be reached or dismissed by keyboard is **High** (finding 11). A failed-gesture path with no recovery except repeating the gesture is **High** when the gesture is complex and the task is core (finding 5). An error message unreachable by keyboard is **High** — the user cannot find out how to recover. The section uses the shared threshold (1 Critical or 3 Highs).

**Automation.** Partial. Missing Escape handling on overlays and unreachable status messages can be flagged statically; whether a recovery path is usable is a runtime, behavioural check.

---

## Section 6 — Configuration Cost

**Purpose.** Whether the controls that reduce interaction cost — larger targets, reduced motion, sticky keys / one-handed modes, disabling timeouts, switching to a non-drag interaction — are themselves reachable and operable under motor constraint. The recursive trap: an accessibility control that requires the precision, drag, or speed it is meant to remove.

**Failure modes.**
- Motor-accommodation controls (target size, timeout extension, reduced-motion, interaction mode) buried several panels deep, reachable only by a long pointer journey
- A settings control that is itself a small target, a drag (a slider with no keyboard step), or behind a hover-only menu (cross-reference Sections 1, 2, 0)
- A settings page that opens in a new context and loses the user's task position, forcing re-navigation
- Per-surface configuration with no global preset, so the user re-applies the accommodation on every panel
- Configuration that requires a precise or timed action to confirm (a modal that auto-dismisses, a confirm button that must be hit quickly)

**Audit questions.**
- From the main working surface, how many keyboard steps / pointer moves to reach the controls that lower interaction cost (timeout extension, reduced motion, target/zoom, interaction mode)?
- Does the settings UI itself pass Sections 0, 1, and 2 — keyboard-operable, large enough targets, no drag-only controls? An accommodation control that demands the very capability it grants is a recursive failure. (cross-reference findings 1, 12, 17)
- Can the user save a configuration as a named preset and recall it, so a one-handed or fatigued user does not reconfigure each session?
- Are controls contextual to the work where possible, rather than global-only behind deep navigation?
- If the user is already constrained (one hand, tremor flare, switch input), can they reach and operate the controls they need without leaving that state?

**Standards / research anchors.**
- The recursive form of the Motor Access Law: configuration is itself an interactive surface that must obey Sections 0–2
- WCAG 2.2 3.2.6 (Consistent Help, A); platform input-accommodation guidance (sticky keys, dwell, switch control)

**Severity note for this section.** A motor-accommodation control reachable only by a path that itself fails Section 0/1/2 is **High** — the user cannot reach the fix without the capability the fix provides. Deeply buried but operable controls are **Medium**. Missing presets are **Low** to **Medium** depending on how often the user must reconfigure. The shared threshold applies.

**Automation.** Partial. Keyboard step-count and pointer-move count from the primary surface to accommodation controls can be measured; whether the controls themselves are operable under constraint is judgment plus the Section 0–2 checks applied recursively.

---

## Section 7 — Evidence

**Purpose.** Whether the audit tested real interaction under real input constraint, not a scanner pass and not mouse-only clicking by a non-impaired auditor. The process gate.

**Failure modes.**
- All findings collected from scanner output, which recalls only ~50.85% of real visual touch-target violations (finding 6)
- "It passed axe / Lighthouse" treated as a Motor Access pass (finding 6)
- The audit run mouse-only, never keyboard-only and never single-pointer-no-drag — the two cheapest paths a motor-impaired user has
- No record of which input modes were tested, which tasks, which dense state
- Severity discounted for "small impact population" — but the population is structurally underrepresented in complaint data, so its silence is a measurement artifact, not evidence of low prevalence (finding 14)
- Drag and ARIA-widget findings inferred from markup without an end-to-end manual completion test (findings 15, 19, 23)

**Audit questions.**
- Was the audit run against the realistic dense, interactive state (a long sortable list, a full kanban board, a form with a date picker and a session timeout) — not an empty or marketing state? (findings 13, 27)
- Was every interactive task attempted **keyboard-only** and attempted **single-pointer-no-drag**, with the input mode recorded per finding? (findings 8, 15, 17)
- For drag and ARIA-widget findings, was a human end-to-end completion test run, not just a markup scan? (findings 15, 19, 23)
- Is the input mode, dense state, and surface documented per finding ("Observed keyboard-only in X surface with Y items")?
- Were severities held at their level rather than discounted for population size? The 2.2% motor-disability share in AT-survey data is structural underrepresentation, not low prevalence. (finding 14)

**Standards / research anchors.**
- Scanner recall gap (finding 6); structural underrepresentation of motor-disabled users in complaint data (finding 14); custom-DnD untestedness (finding 23)

**Touch / device-render evidence caveat.** When auditing target size or touch behaviour on a rig that cannot render the true device viewport or contact patch (a desktop browser cannot reproduce a finger σ_a footprint), **rendered DOM/CSS measurement and computer-vision analysis of the rendered UI are acceptable Inferred evidence** (finding 6), provided:

- Findings are marked **Inferred** (not Observed)
- The rig limitation is documented in the scorecard's `context.viewport_render_limitation` field
- The inference cites the specific measured value (e.g., "rendered button bounding box 22×22px, below the 24px 2.5.8 minimum") or the framework/component pattern interpreted

The cleaner paths — preferred when available — are a touch device or emulator with accurate device-pixel rendering, a headless browser with explicit `setViewport`, and a hardware switch or eye-gaze rig for the exclusion checks. The measurement fallback is a documented escape hatch, not a default — and per finding 6, scanner bounds metadata is **not** an acceptable substitute for rendered measurement.

**Automation.** No. Process gate.

---

## Finding format

Each finding produced by this audit takes the shape defined in [`../../shared/finding-format.md`](../../shared/finding-format.md), with the `Load displaced to:` field drawn from the shared 11-value enum:

```
## Finding MA-{NN} — {short title}

Severity: {Critical | High | Medium | Low}
Section: {section name}
Surface: {where in the product}
Load displaced to: {one or more from the shared enum below}
Evidence state: {Observed | Inferred | Open question}

Issue:
{One paragraph describing what the interface does.}

Why it matters:
{One paragraph naming the interaction cost. Reference the Motor Access Law
if the cost is non-obvious, and the research finding number that grounds it.}

Evidence:
{Input mode tested, surface, dense state, device, screenshot reference. If this
line is empty, the finding fails Section 7 and is not yet a finding.}

Fix:
{One paragraph. Should lower interaction cost while preserving the task — a
keyboard path, a single-pointer alternative, a larger target, more time,
or a recovery affordance.}
```

**Severity definitions.** Severity uses the shared model in [`../../shared/severity-model.md`](../../shared/severity-model.md): Critical / High / Medium / Low, with a section-Fail threshold of **1 Critical OR 3 Highs**. The mapping of MA's failure shapes onto those four levels:

| Severity | Meaning in Motor Access terms |
|---|---|
| Critical | **Exclusion.** The task is impossible by any available path for a population: a keyboard trap (also a page-level blocker, finding 10), a mouse-only control with no keyboard path (finding 8/15), a drag with no single-pointer alternative (findings 8/16/21), a timeout that cannot be extended (findings 24/27), or a persisting-element mis-activation with no undo (finding 26). |
| High | **High cost in a common workflow.** A core touch target below ~30mm (finding 1), a missing/broken skip link (finding 9), an invisible focus indicator (finding 12), hover-only content with no focus equivalent (finding 11), a drag with a hidden/broken alternative, auto-advancing content with no pause (finding 28), or a destructive action with no up-event/confirmation/undo (finding 25). |
| Medium | **Measurable miss.** A target below the 24px 2.5.8 minimum or a sub-24px spacing-exception pass (finding 7), adjacent-icon crowding (findings 4/26), a deeply buried but operable accommodation control. |
| Low | **Polish.** Edge-case targets, secondary surfaces, missing presets where reconfiguration is rare. |

**Section-Fail threshold.** A single Critical or three Highs in any one section produces a section-level Fail, per the shared model. Section 0 has one domain-specific precondition: a **keyboard trap (finding 10) is an automatic section Fail and a page-level blocker** on its own, because WCAG Non-Interference (SC 2.1.2) makes a single inescapable focus a full-page failure regardless of other work. This precondition lives here in the rubric, not in the shared severity model.

**Load-displaced-to enum.** The `Load displaced to:` field uses one or more values from the shared enum in [`../../shared/finding-format.md`](../../shared/finding-format.md). Motor-access failures map onto the shared values as follows — **no new values are introduced**:

| MA failure shape | Maps to shared enum value(s) |
|---|---|
| Keyboard trap; mouse-only control | `navigation`, `feature loss` (the keyboard path to the feature is absent) |
| Missing/broken skip link | `navigation`, `time` (every page load re-traverses the nav) |
| Small target; adjacent-icon crowding | `time`, `recovery / undo` (slower acquisition; mis-hits to recover) |
| Drag with no single-pointer alternative | `feature loss`, `recovery / undo` (capability unreachable; mis-drags to undo) |
| Hover-only content; invisible focus | `memory`, `visual decoding` (recall where focus/affordance is; decode faint state) |
| Timeout that cannot be extended; data lost on timeout | `time`, `recovery / undo` (race the clock; reconstruct lost work) |
| Auto-advancing content | `time` (act before content is removed) |
| Down-event activation; no undo on a mis-activation | `recovery / undo` (reconstruct after a lossy mis-activation) |
| Accommodation control unreachable under constraint | `configuration`, `navigation` (must change settings via an inaccessible path) |
| ARIA widget with no keyboard handler | `feature loss`, `navigation` (the widget's function has no keyboard path) |

This is the audit's heart. A finding with a vague displacement target is a weaker finding.

---

## Automatable vs judgment cut

| Section | Scanner-checkable | Skill / judgment required |
|---|---|---|
| 0. Keyboard Path | Partial (removed outlines, hover-only triggers, missing skip-link targets, illogical tabindex) | Yes (does the ARIA keyboard pattern work; does focus escape a trap) — findings 10, 15 |
| 1. Pointer Precision | Partial — and ~half of real violations are missed (finding 6); rendered measurement required | Yes (rendered size, adjacent spacing, touch-physical size) |
| 2. Drag Dependence | Detection only (`draggable`, DnD-library signatures) | Yes — does a sufficient single-pointer alternative exist (findings 19, 22) |
| 3. Timeout Pressure | No | Yes (trigger and attempt to extend) |
| 4. Undo / Recovery | Partial (down vs up-event, missing-undo affordances) | Yes (is the confirmation meaningful; does the element persist) |
| 5. Error Recovery | Partial (missing Escape on overlays) | Yes (is the recovery path usable) |
| 6. Configuration Cost | Partial (step-count to controls) | Yes (are the controls operable under constraint) |
| 7. Evidence | No | Yes (process check) |

This audit is not "run axe and call it done." A scanner recalls only ~50.85% of visual touch-target violations and reports a valid-markup ARIA widget as passing even when no keyboard user can operate it (findings 6, 15). The leverage is the exclusion checks (Sections 0, 2, 3) and the rendered-measurement checks (Section 1) that scanners cannot make.

---

## Running this as a skill

The skill that runs this audit lives at [`skill/SKILL.md`](skill/SKILL.md). It walks the rubric defined above and produces three outputs: `motor-access-findings.md`, `motor-access-scorecard.json`, `remediation-priority-list.md`, written to `evidence/<run-id>/`.

**Hierarchy.** The rubric is canonical. The skill never invents criteria. If the rubric and the skill disagree, the rubric wins. Updates to audit criteria go in this file first; the skill is updated to match. Pressure-test outputs live under `evidence/<run-id>/`.

The PT0 target shortlist for the first pressure test is in [`evidence/PT0-candidates.md`](evidence/PT0-candidates.md).

---

## References

- Chen, K. B., et al. (2013). *Touchscreen interactions for users with motor-control disabilities.* Applied Ergonomics. DOI:10.1016/j.apergo.2012.08.004. <https://pubmed.ncbi.nlm.nih.gov/23021630/>
- Sesto, M. E., et al. (2012). *Effect of touch screen button size and spacing on touch characteristics of users with and without disabilities.* Human Factors. DOI:10.1177/0018720811433831. <https://pubmed.ncbi.nlm.nih.gov/22768644/>
- Bi, X., et al. (2013). *FFitts Law: Modeling Finger Touch with Fitts' Law.* ACM CHI 2013. DOI:10.1145/2470654.2466180. <https://dl.acm.org/doi/10.1145/2470654.2466180>
- Kim, J., et al. (2022). *Fitts'-law-based quantification of pointing performance in essential tremor.* IEEE JBHI. DOI:10.1109/JBHI.2021.3129989. <https://pubmed.ncbi.nlm.nih.gov/34851839/>
- De Vleeschhauwer, J., et al. (2021). *Manual touchscreen performance in Parkinson's disease on and off medication.* Movement Disorders Clinical Practice. DOI:10.1002/mdc3.13179. <https://pmc.ncbi.nlm.nih.gov/articles/PMC8088105/>
- Krishnavajjala, et al. (2024). *MotorEase: Automated Detection of Motor Impairment Accessibility Issues in Mobile App UIs.* ACM ICSE 2024. DOI:10.1145/3597503.3639167. arXiv:2403.13690. <https://arxiv.org/abs/2403.13690>
- MacKenzie, I. S., Sellen, A., & Buxton, W. (1991). *A Comparison of Input Devices in Element Pointing and Dragging Tasks.* ACM CHI 1991, 161–166. <https://www.billbuxton.com/fitts91.html>
- Trewin, S., & Pain, H. (1999). *Keyboard and mouse errors due to motor disabilities.* International Journal of Human-Computer Studies. DOI:10.1006/ijhc.1998.0240. <https://www.sciencedirect.com/science/article/abs/pii/S1071581998902385>
- Koester, H. H., & Arthanat, S. (2018). *Text entry rate of access interfaces used by people with physical disabilities: A systematic review.* Assistive Technology. DOI:10.1080/10400435.2017.1291544. <https://pubmed.ncbi.nlm.nih.gov/28368689/>
- Mott, M., et al. (2016). *Smart Touch: Improving Touch Accuracy for People with Motor Impairments with Template Matching.* ACM CHI 2016 (Best Paper). DOI:10.1145/2858036.2858390. <https://www.microsoft.com/en-us/research/publication/smart-touch-improving-touch-accuracy-for-people-with-motor-impairments-with-template-matching/>
- Reuschel, W., et al. (2023). *Accessibility of online job applications for screen reader users.* Journal of Visual Impairment & Blindness. DOI:10.1177/0145482X231216757. <https://pmc.ncbi.nlm.nih.gov/articles/PMC10961918/>
- Nielsen, J. (2013). *Auto-Forwarding Carousels and Accordions Annoy Users and Reduce Visibility.* Nielsen Norman Group. <https://www.nngroup.com/articles/auto-forwarding/>
- Hausler, J. (2017). *4 Major Patterns for Accessible Drag and Drop.* Salesforce UX (Medium). <https://medium.com/salesforce-ux/4-major-patterns-for-accessible-drag-and-drop-1d43f64ebf09>
- React Aria team (Adobe). (2023). *Taming the dragon: Accessible drag and drop.* <https://react-aria.adobe.com/blog/drag-and-drop>
- TestParty. (2025). *WCAG 2.5.7 Dragging Movements: 2025 Guide.* <https://testparty.ai/blog/wcag-2-5-7-dragging-movements-2025-guide>
- Accessibility Spark. (2025). *Drag and Drop Accessibility: Best Practices & Tips.* <https://accessibilityspark.com/drag-and-drop-accessibility/>
- WebAIM. (2026). *The WebAIM Million.* <https://webaim.org/projects/million/>
- WebAIM. (2024). *Screen Reader User Survey #10.* <https://webaim.org/projects/screenreadersurvey10/>
- World Wide Web Consortium. (2018). *WCAG 2.1* — SC 2.1.2 No Keyboard Trap <https://www.w3.org/WAI/WCAG21/Understanding/no-keyboard-trap.html>; SC 1.4.13 Content on Hover or Focus <https://www.w3.org/WAI/WCAG21/Understanding/content-on-hover-or-focus>.
- World Wide Web Consortium. (2023). *WCAG 2.2* — SC 2.5.7 Dragging Movements <https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements>; Technique F108 <https://www.w3.org/WAI/WCAG22/Techniques/failures/F108>; SC 2.5.8 Target Size (Minimum) <https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html>; SC 2.4.13 Focus Appearance <https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html>; SC 2.2.1 Timing Adjustable <https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html>.
- World Wide Web Consortium. (2023). *WAI-ARIA 1.2.* <https://www.w3.org/TR/wai-aria-1.2/>

---

*v0.1 (Draft) — rubric authored via the study-swarm protocol (research-grounded), not yet pressure-tested. Eight sections grounded in 29 verified findings from the motor-access literature. PT0 target shortlist: [`evidence/PT0-candidates.md`](evidence/PT0-candidates.md). Sections 4 (Undo / Recovery) and 5 (Error Recovery) are grounded in fewer independent findings than Sections 0–3 (see CHANGELOG note); the first pressure test should weight a target that exercises accidental-activation recovery to calibrate them.*
