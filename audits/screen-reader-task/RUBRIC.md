# Screen Reader Task Audit

> **Screen Reader Task Law**
>
> A screen reader experience is not accessible because it is valid. It is accessible only when an assistive-technology user can **complete the task** — find what to do, do it, recover when it fails, and always know where they are. Valid ARIA that does not complete the task is not access. It is the appearance of access.

> This audit does not ask whether an interface passes axe. It asks whether a screen reader user can **finish the job**.

## Purpose

Automated checkers answer "is the ARIA valid?" This audit answers "can a screen reader user complete a real task end to end?" — through the heading structure, the action path, the view transitions, the async updates, and the error states.

It is intended for:
- Product reviews of task-flow surfaces walked by a screen reader (forms, multi-step flows, dashboards, search, route-driven single-page apps, modal dialogs)
- Self-audits by teams who ship "passes-axe" interfaces and want to know whether the task actually completes
- Calling out conformance dressed up as access — ARIA present but misapplied

It is **not**:
- A WCAG conformance scan (use axe, Lighthouse, Pa11y, ARC for that)
- A subjective "feels accessible" review
- A check of ARIA *validity* — that is a solved, automatable problem; this audit starts where the scanner stops

**Boundary rule (read before every run).** Axe and the other ARIA validators check whether the markup is *valid*: does the role exist, is the attribute spelled right, is the name non-empty. This audit checks whether the experience **completes the task** — a fundamentally different question. A screen reader walking a form that *passes axe* may still be unable to submit it: the submit button may be reachable but unannounced, the validation error may fire into a region nobody hears, the success state may replace the page with no signal that anything changed. Valid markup is necessary and not sufficient. Every section below keeps the completion framing: not "is this valid?" but "can the user finish, recover, and stay oriented?"

## How to use this audit

1. Define the **target**: URL, app flow, screen, or component.
2. Define the **task**: one concrete thing a user is trying to accomplish end to end (complete and submit a form; find and open a record; correct a validation error and retry). The audit is run against a *task*, not a page.
3. Define the **AT/browser pairs**: the result is pair-dependent. Name them (e.g. NVDA+Firefox, JAWS+Chrome, VoiceOver+Safari). A finding that reproduces on one pair and not another is still a finding — record which pairs.
4. Walk the eight sections in order. Each section produces zero or more findings.
5. Score each section: **Pass / Warn / Fail** per the shared severity model. A Fail in any section blocks "Screen Reader Task Audited" status.
6. Output findings in the format specified at the end of this document.

Sections are ordered from orientation (can you read the page) through action (can you do the thing) to recovery (can you tell when it breaks).

---

## Research grounding

This audit's existence is an empirical claim, not a preference. Conformance-only auditing systematically misses the majority of real screen reader task failures. Each finding below is verified; the number is referenced from the section whose doctrine it justifies.

1. **Automated tools find only 57% of accessibility issues by volume and cover only ~32% of WCAG 2.1 AA success criteria.** Deque Systems 2021 ([Automated Accessibility Coverage Report](https://www.deque.com/automated-accessibility-coverage-report/)). Justifies the Automatable-vs-judgment cut and the `MANUAL_ONLY` tag on Sections 0–6: a green axe run cannot gate this audit, because the audit's whole subject is the 43% no scanner reaches.
2. **49.6% of real task problems encountered by blind users map to no WCAG Success Criterion, and 16.7% persist even when the recommended WCAG technique is implemented.** Power et al. 2012 ([DOI:10.1145/2207676.2207736](https://pure.york.ac.uk/portal/en/publications/guidelines-are-only-half-of-the-story-accessibility-problems-enco/)). Justifies the framing line and the rule that every section question is grounded in observed task behavior, not in SC mapping. Sections may note where a check has no WCAG anchor and is included anyway.
3. **Lab blind-user testing found ~50% of real problems; automated tools found under 20%.** Mankoff et al. 2005 ([DOI:10.1145/1054972.1054979](https://dl.acm.org/doi/10.1145/1054972.1054979)). Justifies positioning this as a task-walkthrough methodology verified by an AT user completing a task, not as a scanner supplement.
4. **An LLM traversal-aware checker reached 69.2% issue coverage versus 31.3% for a rule-based checker — a 38-point gap on semantic, traversal-dependent problems.** Zhong et al. 2025 ([arXiv:2504.02110](https://arxiv.org/abs/2504.02110)). The 38-point delta is the class of failure Sections 2–5 target: missing context announcements, ambiguous action names, dynamic-update handling, task-path coherence — none of which static DOM inspection sees.
5. **Heading navigation is the dominant primary strategy: 71.6% of screen reader users scan headings first on a long page (78% among advanced users).** WebAIM 2024 ([Screen Reader User Survey #10](https://webaim.org/projects/screenreadersurvey10/)). Makes heading quality the single highest-leverage structural decision — Section 0, SR-H1.
6. **Landmark usage is a secondary, unreliable layer: only 31.8% use landmarks "always or often" in 2024, down from 43.8% in 2014, attributed to infrequent or incorrect implementation in the wild.** WebAIM 2024 ([Screen Reader User Survey #10](https://webaim.org/projects/screenreadersurvey10/)) — the 31.8%-in-2024 figure was misattributed to Survey #9 in the initial draft; corrected 2026-06-02 during external-verifier hardening. Justifies the Section 0 rule that landmark *presence* earns no credit without working headings and correct labels — SR-L1.
7. **When structure is absent or ambiguous, users "scan with their ears" at high speech rates, jumping heading to heading to predict page value; non-descriptive headings cause premature abandonment on structurally valid pages.** Theofanos & Redish 2003 ([DOI:10.1145/947226.947227](https://dl.acm.org/doi/10.1145/947226.947227)). Justifies Section 0 heading *informativeness* — SR-H2.
8. **Misbehaving interactive elements and unexpected screen changes rank #2 and #4 most problematic for screen reader users, unchanged across 14 years of surveys.** WebAIM 2024 ([Survey #10](https://webaim.org/projects/screenreadersurvey10/)). Dynamic-UI failure is structural, not edge-case — Section 3, SR-D1.
9. **Screen reader power users switch browsing strategy by task — heading scan, Tab jump, character inspection — and fall back to JAWS Find, HTML-source review, and early abandonment when structural cues fail.** Borodin et al. 2010 ([DOI:10.1145/1805986.1806005](https://dl.acm.org/doi/10.1145/1805986.1806005)). Power-user fallbacks are not a defense; the audit must cover the non-expert case where structure alone must reach the action — Section 1, SR-T1.
10. **On Fortune 500 job applications, screen reader users completed only 55.6% of task attempts; one-third of added ARIA features made the experience worse, not better.** Reuschel, McDonnall & Burton 2023 ([DOI:10.1177/0145482X231216757](https://pmc.ncbi.nlm.nih.gov/articles/PMC10961918/)). Justifies the Section 1 high-severity classification for "ARIA present but misapplied" and the rule that any custom date picker, autocomplete, or multi-step form is a mandatory manual target.
11. **Blind users lost 30.4% of their online time to barriers — confusing layout, screen-reader/application conflict, unlabeled forms — largely invisible to automated checkers.** Lazar et al. 2007 ([DOI:10.1080/10447310709336964](https://www.tandfonline.com/doi/abs/10.1080/10447310709336964)). Justifies Section 2's reading-order/feedback-match questions and Section 4's emphasis on labeled, associated error text — structural-layout failures escape scanners but directly cause time loss.
12. **A systematic mapping of 38 studies found automated tools detected under 40% of problem types on web and under 20% on mobile; the mobile gap is larger and cannot be closed by static analysis.** Mateus et al. 2021 ([DOI:10.5753/jis.2021.1778](https://journals-sol.sbc.org.br/index.php/jis/article/view/1778)). Justifies tagging mobile-specific checks (focus on modal open/close, custom-gesture alternatives, dynamic-content notifications) as user-testing-only verifiable.
13. **When a task fails, blind users frequently cannot tell whether content is inaccessible or simply not yet found — "Not Knowing What You Don't Know" (NKWYDK) — causing wasted effort sighted users in the same study did not experience.** Bigham et al. 2017 ([DOI:10.1145/3132525.3132533](https://dl.acm.org/doi/10.1145/3132525.3132533)). Justifies Section 4's core question: is the error/empty state unambiguously distinguishable from a loading state or absent content? — SR-E1.
14. **aria-live regions fail silently when the container is pre-populated at insertion time, because the ARIA spec does not define whether initial content is announced; Firefox+NVDA and Firefox+Orca routinely drop it.** Lauke 2024 ([TetraLogical, May 2024](https://tetralogical.com/blog/2024/05/01/why-are-my-live-regions-not-working/)). Justifies Section 3 SR-DU-1: a live region whose content is set at render time is FAIL regardless of the `aria-live` value.
15. **aria-live timing is governed by two independent scheduling layers — the browser AX event loop and the screen reader's speech queue — and React batching, heavy reflow, or animation can drop or coalesce announcements silently.** Weakley 2025 ([Max Design, Dec 2025](https://www.maxdesign.com.au/articles/aria-live-timing.html)). Justifies Section 3 SR-DU-2: an announcement must survive realistic render load; test continuity on at least one heavy-animation or large-list page.
16. **In unmanaged single-page apps, focus stays on the link that triggered a route change after the new page loads; the transition is silent, so users assume navigation failed.** Sutton / Fable Tech Labs 2019 ([Gatsby blog, July 2019](https://www.gatsbyjs.com/blog/2019-07-11-user-testing-accessible-client-routing/)). Justifies Section 2 SR-TC-1: after a client-side route change the user must receive an unambiguous signal that context changed.
17. **Moving focus to a wrapper div on route change announced nothing on NVDA+Firefox and VoiceOver+Safari — the two most common pairs — proving focus placement alone is insufficient without a parallel live-region announcement.** Parker 2020 ([Gatsby blog, Feb 2020](https://www.gatsbyjs.com/blog/2020-02-10-accessible-client-side-routing-improvements/)). Justifies Section 2 SR-TC-2: focus to a non-heading wrapper on route change is FAIL; sufficient implementation needs focus-to-h1 AND an assertive announcement.
18. **Most SPA routers destroy keyboard focus when removing previous-screen markup, resetting focus to `body` with no title announcement and sometimes leaving a "ghost focus" at a removed element's position.** BBC GEL 2021 ([Foundations: Routing](https://bbc.github.io/gel/foundations/routing/)). Justifies Section 2 SR-TC-3: verify `document.title` updates, focus lands on h1 not body, and no ghost-focus artifact survives tabbing.
19. **`aria-modal="true"` alone does not reliably contain screen reader navigation: JAWS exposes background links/headings via element listing and VoiceOver on macOS leaks background content; only NVDA contained it correctly.** O'Hara 2019 ([FreedomScientific standards-support #179](https://github.com/FreedomScientific/standards-support/issues/179)). Justifies Section 5 SR-FT-1: test modal containment with JAWS element listing and the VoiceOver rotor; sufficient implementation needs `aria-hidden="true"` on background containers, toggled on open/close.
20. **Real cross-AT testing shows `aria-describedby` is more reliable than `aria-errormessage` for inline errors; `aria-errormessage` fails on VoiceOver macOS, NVDA+Edge, and JAWS+Firefox as of mid-2024.** Roselli 2023 ([Exposing Field Errors](https://adrianroselli.com/2023/04/exposing-field-errors.html)). Justifies Section 4 SR-E2: `aria-errormessage` alone is FAIL under the current support landscape; the preferred pattern is `aria-invalid="true"` plus `aria-describedby` to a visible error container.
21. **35.5% of form inputs across the top 1 million home pages lack proper labels, and pages using ARIA average 34.2% more detected errors than pages without it.** WebAIM 2024 ([WebAIM Million 2024](https://webaim.org/projects/million/2024)). Population-scale calibration: unlabeled inputs and ARIA misuse are the dominant failure class. Justifies Section 7's rule that a scanner reporting an attribute "present" does not close a Section 1 or Section 4 finding — the audit must verify *announced behavior at runtime*.

Citations are load-bearing only where connected to a section. The connection is the point; an uncited rubric is improvisation, and a cited rubric with no architectural link is noise.

---

## Section 0 — Landmark quality

**Purpose.** Whether the heading and landmark structure *tells the story of the task* — so a user can orient, predict, and reach the next action by reading the page, not by exhausting it. Completion framing: not "do landmarks exist?" but "can the user build an accurate mental model of where the task lives?"

**Failure modes.**
- Heading levels chosen for visual size, not document structure (an `h3` that is really the page's main heading)
- Generic, non-differentiating heading text ("Section 1", "More information", repeated "Details") on sections that contain distinct task paths [7]
- Skipped or out-of-order heading levels that break heading-key navigation
- Landmark presence treated as sufficient while headings are broken — landmarks are a minority strategy and unreliable in the wild [6]
- Unlabeled `<section>`/`<nav>`, duplicate `nav`/`main` regions, or `<div>` where a landmark belongs
- No `<h1>`, or multiple competing `<h1>`s, so the user cannot find the task's anchor

**Audit questions.**
- Heading-first is how 71.6% of users orient [5]: can a user reach the next task action by pressing the heading key twice or fewer from any prior heading?
- Does every heading *uniquely predict* the content or action below it, independent of surrounding context? [7] (Heading text that does not differentiate sibling sections fails when those sections hold distinct task paths.)
- Do heading levels reflect document structure, not visual treatment?
- Are landmarks correct and labeled — and is the audit *withholding credit* for landmark presence when headings are broken or labels are missing/duplicated? [6]
- Is there exactly one `<h1>` that names the task's anchor?

**Severity guidance.** A heading gap that blocks forward task progress is **Critical** (the user cannot reach the action by the dominant strategy [5]). Heading text that does not differentiate sibling sections holding distinct task paths is **High** [7]. Absent `main` landmark is **High**; unlabeled complementary region is **Low** [6].

**Standards / research anchors.** WebAIM Survey #10 (2024) [5][6][8]; Theofanos & Redish 2003 [7]. WCAG 2.2 1.3.1, 2.4.1, 2.4.6 partially anchor this, but heading *informativeness* (SR-H2) has no clean SC anchor and is included on the strength of [7] per [2].

**Automation.** `MANUAL_ONLY` for the load-bearing checks. A scanner can flag a missing `h1`, skipped levels, unlabeled regions, and duplicate landmarks. It cannot judge whether a heading *predicts* its section or *tells the task's story* — that is the audit's contribution [1][4].

---

## Section 1 — Action discoverability

**Purpose.** Whether a screen reader user can find *what to do next* and do it, without sighted help. Completion framing: the question is not "does the button have a name?" but "can the user locate and operate the primary action, and would a non-expert reach it?"

**Failure modes.**
- Primary action reachable but unannounced, or named ambiguously ("Submit" with no object, repeated "Click here", icon-only control with no accessible name)
- Custom widgets (date pickers, comboboxes/autocomplete, multi-step wizards) that read as valid but cannot be operated to completion [10]
- ARIA *present but misapplied* — roles or states that mislead the user about what the control does [10]
- The only path to the action depends on a power-user fallback (Find, source view) rather than structure or Tab order [9]
- Action ordering in the accessibility tree that does not match the task's logical sequence

**Audit questions.**
- Can the task's primary action (submit, primary CTA, "next") be reached by heading scan or Tab from page start within a reasonable keystroke budget — for a non-expert, not just a power user? [9]
- Is every interactive control's accessible name a verb-or-object phrase that says what it does, independent of visual context?
- For each custom widget on the task path, can an AT user operate it end to end (open, choose, confirm) — tested, not assumed? [10]
- Is any ARIA applied in a way that *worsens* the announcement versus no ARIA at all? [10][21]
- Does the action order in the AT reading match the visible task order?

**Severity guidance.** A primary action that cannot be operated to completion is **Critical** (task-blocking; the 55.6% real-world completion rate is evidence of abandonment, not hypothetical risk [10]). "ARIA present but misapplied" on a task control is **High** [10]. Any custom date picker, autocomplete, or multi-step form on the task path is a **mandatory manual test target**, not a scanner pass [10].

**Standards / research anchors.** Reuschel et al. 2023 [10]; Borodin et al. 2010 [9]; WebAIM Million 2024 [21]. WCAG 2.2 4.1.2, 2.4.4, 2.5.3.

**Automation.** `MANUAL_ONLY` for operability. A scanner flags missing accessible names and empty buttons. It cannot confirm a combobox can be *operated to a chosen value*, nor that ARIA helps rather than harms [1][4].

---

## Section 2 — Task path continuity

**Purpose.** Whether navigating to a related view preserves *where the user was* — orientation, focus, and the thread of the task — instead of silently dropping them. This is the section that single-page apps fail most often: the route changes, the DOM swaps, and the screen reader is left behind. Completion framing: after moving between views, can the user tell they moved, and pick the task back up?

**Failure modes.**
- Client-side route change leaves focus on the triggering link; the transition is silent and the user assumes navigation failed [16]
- Focus moved to a non-heading wrapper `<div>` on route change — announces nothing on the two most common AT pairs [17]
- SPA router destroys focus when removing the previous screen; focus resets to `body` with no title announcement [18]
- "Ghost focus" persists at a removed element's DOM position, so Tab jumps unpredictably [18]
- Sequential reading order that does not reflect the logical task flow; screen-reader feedback at a step does not match the visible affordance [11]
- Back/forward or breadcrumb navigation that loses scroll, selection, or the user's place in a multi-step flow

**Audit questions.**
- After any client-side route change, does the user receive an unambiguous signal that context changed? Pass requires **(a)** programmatic focus to the new `h1` (with `tabindex="-1"`), **OR** ideally **(b)** an assertive `aria-live` announcement naming the new page — and on the NVDA+Firefox / VoiceOver+Safari pairs, *both*, because either alone is fragile [16][17].
- Is focus moved to a heading or interactive target, never to a bare wrapper `div` or left on the trigger? [17]
- After route change: does `document.title` update, does focus land on `h1` not `body`, and is there no ghost-focus artifact when tabbing? [18]
- Does sequential reading order reflect the logical task flow, and does feedback at each step match the visible affordance? [11]
- Returning to a related view (back, breadcrumb, tab), is the user's place preserved or silently reset?

**Severity guidance.** Focus moved to a non-heading wrapper, or left on the trigger, on route change is **High** (silent on the majority pairs [17]). A ghost-focus artifact is **High** — a silent task-path failure where the user believes they are at position X while the DOM has them orphaned [18]. Reading order that contradicts task flow on a core task is **High** [11].

**Standards / research anchors.** Sutton / Fable 2019 [16]; Parker 2020 [17]; BBC GEL 2021 [18]; Lazar et al. 2007 [11]. WCAG 2.2 2.4.3, 1.3.2; note that "context changed silently after a route swap" has weak SC coverage and is included per [2].

**Automation.** `MANUAL_ONLY`. Route-change focus and announcement behavior is runtime and AT-pair-dependent; static analysis cannot see it [1][4][12].

---

## Section 3 — Dynamic update handling

**Purpose.** Whether asynchronous and route-driven changes are *announced and managed* — live regions that actually fire, focus moved when it should be. Misbehaving interactive elements and unexpected screen changes are the #2 and #4 most-reported problems and have been for 14 years [8]. Completion framing: when the page changes under the user, do they hear it, or do they keep working against stale state?

**Failure modes.**
- Status, search-result, cart, or error containers with no `aria-live` and no focus management — the update is invisible [8]
- `aria-live` container *pre-populated at insertion time*: the spec does not define whether initial content is announced, and major pairs drop it [14]
- Announcements lost or coalesced under render load — React/Vue batching, heavy reflow, or animation starving the AX event loop and speech queue [15]
- Interactive widgets (menus, tabs, dialogs) that change state without announcing the new state [8]
- Modal/dialog open or close on mobile that moves nothing and announces nothing [12]

**Audit questions.**
- Does every status message, search-result container, and error zone have a working `aria-live` (or managed focus)? [8]
- SR-DU-1: Is every `aria-live` container injected **empty** before content is inserted? A live region whose content is set at render time scores **FAIL** regardless of the `aria-live` value [14].
- SR-DU-2: When an async update fires an announcement, does it survive realistic render load? Test continuity on at least one heavy-animation or large-list page; a dropped announcement under normal use scores **FAIL** [15].
- After a dynamic update, can the user re-locate the changed region without re-reading the whole page? [8]
- On mobile, do modal open/close and dynamic-content notifications announce — verified by an AT user, since this is the largest scanner gap? [12]

**Severity guidance.** A dynamic result area with no live region and no focus management is **Critical** — the change is wholly invisible [8][14]. A pre-populated live region (SR-DU-1) is **Critical** [14]. An announcement dropped under realistic load (SR-DU-2) is **High** to **Critical** depending on whether the dropped content is task-blocking [15].

**Standards / research anchors.** WebAIM Survey #10 (2024) [8]; Lauke 2024 [14]; Weakley 2025 [15]; Mateus et al. 2021 [12]. WCAG 2.2 4.1.3 (Status Messages) anchors part of this, but timing/load fragility (SR-DU-2) has no SC and is included per [2].

**Automation.** `MANUAL_ONLY`. A scanner can confirm an `aria-live` attribute *exists*. It cannot confirm the region was empty at insertion, that the message *fired*, or that it survived render load — those require an AT user at runtime [1][4][21].

---

## Section 4 — Error recovery

**Purpose.** Whether, when something goes wrong, the user can *tell* — and can correct it and retry. This is where the highest real-world abandonment lives. Completion framing: an error the user cannot perceive is, for that user, a dead end.

**Failure modes.**
- Error or empty state with no landmark, no live region, and no heading — indistinguishable from a loading state or from absent content (NKWYDK) [13]
- Validation errors implemented with `aria-errormessage` alone, which fails on VoiceOver macOS, NVDA+Edge, and JAWS+Firefox as of mid-2024 [20]
- Error text not programmatically associated with its field, or not reachable by Tab (only by virtual-cursor browse) [20][11]
- Form re-displayed after a failed submit with no perceivable indication that submission failed [11]
- No recovery path visible from the heading outline when a task fails [13]

**Audit questions.**
- SR-E1: Is the error or empty-state message unambiguously distinguishable from a loading state or absent content — by landmark, live region, or heading? An error/empty state with **none** of these scores **FAIL** [13].
- SR-E2: Are errors implemented with `aria-invalid="true"` plus `aria-describedby` to a visible error container — not `aria-errormessage` alone, which is unsupported on major pairs? [20]
- Are errors discoverable via **Tab** navigation (not only virtual-cursor browse) across NVDA, JAWS, and VoiceOver? [20]
- Is every error message text-based, uniquely labeled, and programmatically associated with its field? A missing association is an automatic task-continuity FAIL [11].
- When a task fails, is there a recovery path the user can find from the heading outline — or does the page leave them unable to tell whether they failed or simply missed something? [13]

**Severity precondition for this section.** An error or empty state with no landmark, no live region, **and** no heading is **Critical** — under NKWYDK the user cannot distinguish failure from "not found yet" and abandons [13]. A form whose labels/errors are not programmatically associated is **Critical** (task-blocking), not a mere WCAG flag — the 55.6% real-world completion rate is evidence of abandonment [10]. `aria-errormessage` used alone, with no `aria-describedby` fallback, is **High** because it is silent on the majority of pairs [20].

**Standards / research anchors.** Bigham et al. 2017 [13]; Roselli 2023 [20]; Reuschel et al. 2023 [10]; Lazar et al. 2007 [11]. WCAG 2.2 3.3.1, 3.3.3, 4.1.3; NKWYDK (SR-E1) has no SC and is included per [2].

**Automation.** `MANUAL_ONLY`. A scanner sees the attribute, not the announcement. `aria-errormessage` reports as "present" and passes the check while being silent on real pairs — this is exactly the trap the audit exists to catch [1][21].

---

## Section 5 — Mode switching

**Purpose.** Whether moving between interaction modes — modal vs page, virtual-cursor (browse) vs focus/forms mode, expanded vs collapsed widget — keeps the user in the right mode and contains them where they belong. Completion framing: when the UI changes mode, can the user still tell what is operable and what is out of bounds?

**Failure modes.**
- `aria-modal="true"` relied on alone: JAWS exposes background links/headings via element listing, and VoiceOver on macOS leaks background content; the containment contract is broken for a substantial share of users [19]
- Background content not hidden with `aria-hidden="true"` while a dialog is open, so browse-mode wanders behind the modal [19]
- Widgets that should switch the user into forms/focus mode but leave them in browse mode (or the reverse), so keystrokes do the wrong thing [8]
- A mode change with no announcement that the mode changed (expanded/collapsed, dialog opened/closed)
- Focus not returned to the triggering control when a modal closes, dropping the user out of the task thread

**Audit questions.**
- SR-FT-1: Test every modal dialog with JAWS element listing (Insert+F6 for headings) and the VoiceOver rotor (VO+U). If background headings or links are reachable, score **FAIL**. Sufficient implementation requires `aria-hidden="true"` on all background containers while the dialog is open, toggled on open and removed on close — `aria-modal` alone is an incomplete control [19].
- When a widget changes interaction mode (browse → forms, collapsed → expanded), is the new mode announced and correct for the next keystroke? [8]
- On modal close, is focus returned to the control that opened it, so the user is back on the task thread?
- Does any mode switch leave the user operating the wrong layer (typing into a page behind a dialog, arrowing through a collapsed widget)?

**Severity guidance.** A modal that leaks background content under JAWS element listing or the VoiceOver rotor is **High** — the user can wander out of the dialog and lose the task [19]. Focus not returned on modal close, dropping the user off the task thread, is **High**.

**Standards / research anchors.** O'Hara 2019 [19]; WebAIM Survey #10 (2024) [8]. WCAG 2.2 2.4.3, 4.1.2; WAI-ARIA APG dialog pattern. The `aria-modal` containment gap [19] is a known-incomplete-control case with no clean SC, included per [2].

**Automation.** `MANUAL_ONLY`. Modal containment is AT-feature-dependent (element listing, rotor) and cannot be confirmed by static analysis [1][19].

---

## Section 6 — Configuration cost

**Purpose.** Whether the controls a screen reader user needs to complete the task — verbosity, hint level, table/heading navigation modes, announcement settings exposed by the product — are reachable and usable *with a screen reader, from inside the task*. The recursive trap: accessibility affordances that themselves require sighted setup. Completion framing: can the user reach the control they need without leaving the task or asking for help?

**Failure modes.**
- Product-level accessibility or announcement preferences buried behind unlabeled controls or deep navigation a screen reader user cannot traverse efficiently
- A "skip to content" or "skip navigation" mechanism that is absent, mispronounced, or itself not reachable — forcing the user to wade through navigation on every task [7]
- Settings that open in a new context and lose the user's task position, with no announced return path
- Per-view configuration with no global preset, so the user re-configures on every screen
- Density / verbosity controls that, once changed, do not persist across the session

**Audit questions.**
- Is there a working skip mechanism (skip link or equivalent) that is reachable and correctly announced — given that navigation overhead competes directly with task time for these users? [7][9]
- From the task surface, can a screen reader user reach the product's accessibility/announcement controls by heading or landmark, without sighted help?
- Do those controls have correct accessible names and operate to completion (not just exist)?
- When the user changes a setting, do they return to their task position with an announced confirmation — or are they dropped elsewhere?
- Can a setting be saved once rather than re-applied per view?

**Severity guidance.** No reachable skip mechanism on a navigation-heavy task surface is **High** — it taxes every task with avoidable navigation time [7]. Accessibility controls that exist but cannot be operated with a screen reader are **High** (the recursive trap).

**Standards / research anchors.** Theofanos & Redish 2003 [7]; Borodin et al. 2010 [9]. WCAG 2.2 2.4.1 (Bypass Blocks).

**Automation.** Partial. A scanner can detect the *presence* of a skip link and unlabeled controls. Whether the skip link is *announced correctly* and whether the controls *operate to completion* is `MANUAL_ONLY` [1].

---

## Section 7 — Evidence

**Purpose.** Whether the audit tested a real task on real AT/browser pairs — not a scanner pass, not a single-pair assumption, not a marketing screenshot. The process gate, and the brake against laundering a green axe run into "accessible."

**Failure modes.**
- Findings collected from a scanner report only ("axe is green, ship it") — the scanner covers ~32% of criteria and ~57% of issues by volume [1]
- A scanner reporting an attribute "present" (e.g. `aria-describedby`, `aria-live`) treated as closing a finding, when the attribute may be applied in a silently-failing pattern [21]
- Single AT/browser pair tested, when behavior diverges sharply across pairs (e.g. `aria-errormessage`, modal containment, route-change focus) [17][19][20]
- Web-only testing for a product with a mobile surface, where the scanner gap is larger and user-testing-only [12]
- "We tested it" with no record of which task, which AT, which browser, which evidence state

**Audit questions.**
- Was the audit run against a **real task completed end to end**, by an AT user (or live AT session), not a scanner pass? [3]
- Are the **AT/browser pairs** named per finding, given that results are pair-dependent? [17][19][20]
- For any finding where a scanner reported an attribute as present, was the **announced behavior verified at runtime** rather than inferred from the attribute? [21]
- If the product has a mobile surface, was it tested with a mobile screen reader (VoiceOver iOS / TalkBack), recognizing this is the largest scanner gap and user-testing-only? [12]
- Is the task, the pairs, the evidence state (Observed / Inferred / Open question), and the keystroke path documented per finding?

**Evidence-mode note.** Live AT observation (Path 1) is preferred and produces Observed findings. When a live AT session is not available, DOM/ARIA inspection and vendor/spec documentation are acceptable **Inferred** evidence per `../../shared/evidence-states.md`, provided the limitation is recorded in the scorecard's `context.viewport_render_limitation` (or an equivalent context field) and the inference cites the specific attribute pattern, framework behavior, or spec clause. A doc-fallback run is labeled `<pt-id>-doc-fallback` and does not carry the evidence strength of a live AT run.

**Standards / research anchors.** Deque 2021 [1]; Mankoff et al. 2005 [3]; Mateus et al. 2021 [12]; WebAIM Million 2024 [21]; pair-divergence evidence [17][19][20].

**Automation.** No. Process gate.

---

## Finding format

Each finding produced by this audit takes the shape defined in `../../shared/finding-format.md`:

```
## Finding SR-{NN} — {short title}

Severity: {Critical | High | Medium | Low}
Section: {section name}
Surface: {where in the product}
Load displaced to: {one or more from the shared enum below}
Evidence state: {Observed | Inferred | Open question}
AT/browser pairs: {e.g. NVDA+Firefox, JAWS+Chrome, VoiceOver+Safari}   ← record which pairs reproduced this

Issue:
{One paragraph describing what the interface does — in completion terms,
not validity terms.}

Why it matters:
{One paragraph naming the task cost. Reference the Screen Reader Task Law
if the displacement is non-obvious.}

Evidence:
{Task, surface, AT/browser pair, keystroke path, screenshot or transcript
reference. If this line is empty, the finding fails Section 7 and is an
open question, not a finding.}

Fix:
{One paragraph. Should make the task completable, recoverable, and
orientation-preserving — not merely valid.}
```

`AT/browser pairs:` is an additive field declared in this audit's [`schemas/finding.extensions.json`](schemas/finding.extensions.json). It does not replace any base field.

**Severity definitions.** This audit uses the shared four-level model in `../../shared/severity-model.md` unchanged — Critical / High / Medium / Low — and the shared section-Fail threshold: **a single Critical OR three Highs in any one section produces a section-level Fail**, and any section Fail produces an overall Fail.

| Severity | Meaning in this audit |
|---|---|
| Critical | A screen reader user cannot complete the core task on the tested pair. E.g. an invisible dynamic update [8][14], a pre-populated live region [14], an unoperable primary action [10], or an error/empty state with no landmark, live region, or heading [13]. |
| High | Significant task-completion displacement in a common flow. E.g. focus lost or left on the trigger after a route change [17][18], `aria-errormessage` alone [20], modal background leakage [19], non-differentiating headings on distinct task paths [7], no reachable skip mechanism [7]. |
| Medium | Friction that slows but does not block the task on the tested pair; non-core surfaces. |
| Low | Polish-level. Unlabeled secondary region [6], wording, edge-case states. |

The **Section 4 precondition** (error/empty state with none of landmark, live region, or heading = Critical; unassociated form labels/errors = Critical) lives in this rubric, not in `../../shared/severity-model.md`, exactly as the cognitive-load audit keeps its Section 4 precondition local.

**Load-displaced-to enum.** The `Load displaced to:` field uses one or more of the eleven shared values from `../../shared/finding-format.md`. This enum is fixed and shared; this audit does not add to it. Map screen reader failures onto it:

- Lost focus on a route change, or a silent view transition → `navigation` + `time`
- A dynamic update that never announces → `verification` + `memory` (the user must re-read to confirm state)
- An error the user cannot perceive (NKWYDK) → `recovery / undo` + `verification`
- A primary action reachable only by Find or source view → `search` + `time`
- Heading text that does not predict its section → `memory` + `search`
- A modal that leaks background content → `navigation` + `memory`
- A custom widget that cannot be operated to completion → `feature loss` (the capability is, for this user, unavailable)
- Re-configuring announcement settings on every view → `configuration`

| Enum value | Typical screen reader trigger |
|---|---|
| `search` | Action only reachable via Find / command palette / source inspection [9] |
| `memory` | User must remember an icon's meaning, a section's location, or unannounced state |
| `trust` | User must accept that an action succeeded with no announced confirmation |
| `verification` | User must re-read the page to confirm a state the UI did not announce |
| `navigation` | Lost focus, silent route change, modal leakage, no skip mechanism |
| `configuration` | User must change announcement/verbosity settings to complete the task |
| `source recovery` | Original content stripped or hidden from the AT (rare in this audit) |
| `visual decoding` | Out of scope for SR — present in the shared enum, seldom used here |
| `time` | Task that should be near-instant costs measurable extra keystrokes/seconds |
| `recovery / undo` | User cannot perceive or correct an error; must reconstruct the attempt |
| `feature loss` | A widget cannot be operated by AT to completion — capability unavailable for this user |

Findings with vague displacement targets are weaker findings. "Other" is not an option.

---

## Automatable vs judgment cut

| Section | Scanner-checkable | `MANUAL_ONLY` (AT-user / runtime judgment) |
|---|---|---|
| 0. Landmark quality | Partial (missing h1, skipped levels, unlabeled/duplicate landmarks) | Yes — does a heading *predict* its section and tell the task's story? [5][7] |
| 1. Action discoverability | Partial (missing accessible names, empty buttons) | Yes — can the primary action and custom widgets be *operated to completion*? [10] |
| 2. Task path continuity | No | Yes — route-change focus/announcement is runtime, pair-dependent [16][17][18] |
| 3. Dynamic update handling | Partial (attribute presence only) | Yes — did the announcement *fire*, was the region empty at insertion, did it survive load? [14][15] |
| 4. Error recovery | Partial (attribute presence only) | Yes — is the error *perceivable and announced* across pairs? [13][20] |
| 5. Mode switching | No | Yes — modal containment via element listing / rotor [19] |
| 6. Configuration cost | Partial (skip-link presence, unlabeled controls) | Yes — is the skip link *announced* and do controls *operate*? [7] |
| 7. Evidence | No | Yes — process check |

This audit is **not** "run axe and call it done." Automated tools cover ~57% of issues by volume and ~32% of WCAG 2.1 AA criteria [1]; an LLM traversal checker still left a 38-point gap against semantic, task-level failures [4]. The leverage of this audit is precisely the `MANUAL_ONLY` rows — the part no scanner reaches. Per [2], several checks here have no WCAG Success Criterion anchor at all and are included on the strength of observed task behavior; each such check names that fact in its section.

---

## Running this as a skill

The skill that runs this audit lives at [`skill/SKILL.md`](skill/SKILL.md). It walks the rubric defined above and produces three outputs: `screen-reader-task-findings.md`, `screen-reader-task-scorecard.json`, `remediation-priority-list.md`, written to `evidence/<run-id>/`.

**Hierarchy.** The rubric is canonical. The skill never invents criteria. If the rubric and the skill disagree, the rubric wins. Updates to audit criteria go in this file first; the skill is updated to match. Pressure-test outputs live under `evidence/<run-id>/`.

This audit is currently **Draft** — the rubric is authored and research-grounded, but it has not yet been pressure-tested against a live target. The PT0 candidate shortlist is in [`evidence/PT0-candidates.md`](evidence/PT0-candidates.md).

---

## References

- Deque Systems. (2021). *Automated Accessibility Coverage Report.* https://www.deque.com/automated-accessibility-coverage-report/
- Power, C., Freire, A., Petrie, H., & Swallow, D. (2012). *Guidelines Are Only Half of the Story: Accessibility Problems Encountered by Blind Users on the Web.* CHI '12. DOI:10.1145/2207676.2207736
- Mankoff, J., Fait, H., & Tran, T. (2005). *Is Your Web Page Accessible? A Comparative Study of Methods for Assessing Web Page Accessibility for the Blind.* CHI '05. DOI:10.1145/1054972.1054979
- Mateus, D. A., et al. (2021). *Accessibility of Mobile Applications: A Systematic Mapping.* Journal on Interactive Systems. DOI:10.5753/jis.2021.1778
- Zhong, M., et al. (2025). *ScreenAudit: Detecting Screen Reader Accessibility Errors in Mobile Apps Using Large Language Models.* arXiv:2504.02110
- WebAIM. (2024). *Screen Reader User Survey #10.* https://webaim.org/projects/screenreadersurvey10/
- WebAIM. (2024). *The WebAIM Million 2024.* https://webaim.org/projects/million/2024
- Theofanos, M. F., & Redish, J. (2003). *Bridging the Gap: Between Accessibility and Usability.* interactions. DOI:10.1145/947226.947227
- Borodin, Y., Bigham, J. P., Dausch, G., & Ramakrishnan, I. V. (2010). *More Than Meets the Eye: A Survey of Screen-Reader Browsing Strategies.* W4A '10. DOI:10.1145/1805986.1806005
- Bigham, J. P., Lin, I., & Savage, S. (2017). *The Effects of "Not Knowing What You Don't Know" on Web Accessibility for Blind Web Users.* ASSETS '17. DOI:10.1145/3132525.3132533
- Reuschel, W., McDonnall, M. C., & Burton, D. (2023). *Accessibility of Online Job Applications for Screen Reader Users at Fortune 500 Companies.* Journal of Visual Impairment & Blindness. DOI:10.1177/0145482X231216757
- Lazar, J., Allen, A., Kleinman, J., & Malarkey, C. (2007). *What Frustrates Screen Reader Users on the Web: A Study of 100 Blind Users.* International Journal of Human–Computer Interaction. DOI:10.1080/10447310709336964
- Lauke, P. H. (2024). *Why Are My Live Regions Not Working?* TetraLogical. https://tetralogical.com/blog/2024/05/01/why-are-my-live-regions-not-working/
- Weakley, R. (2025). *ARIA Live Region Timing.* Max Design. https://www.maxdesign.com.au/articles/aria-live-timing.html
- Sutton, M. (2019). *User Testing Accessible Client-Side Routing.* Gatsby / Fable Tech Labs. https://www.gatsbyjs.com/blog/2019-07-11-user-testing-accessible-client-routing/
- Parker, M. (2020). *Accessible Client-Side Routing Improvements.* Gatsby. https://www.gatsbyjs.com/blog/2020-02-10-accessible-client-side-routing-improvements/
- BBC GEL. (2021). *Foundations: Routing.* https://bbc.github.io/gel/foundations/routing/
- O'Hara, S. (2019). *aria-modal does not contain virtual cursor (standards-support #179).* https://github.com/FreedomScientific/standards-support/issues/179
- Roselli, A. (2023). *Exposing Field Errors.* https://adrianroselli.com/2023/04/exposing-field-errors.html
- World Wide Web Consortium. (2024). *Web Content Accessibility Guidelines (WCAG) 2.2.*

---

*v0.1 (Draft) — rubric authored 2026-06-02 via study-swarm (research-grounded). Eight sections, the Screen Reader Task Law, a Section 4 severity precondition (error perceivability + form association), and the `AT/browser pairs` finding field. Not yet pressure-tested. The boundary from axe/ARIA validators is the discriminator: those tools check ARIA validity; this audit checks task completion. PT0 candidate shortlist: [`evidence/PT0-candidates.md`](evidence/PT0-candidates.md). See [`CHANGELOG.md`](CHANGELOG.md) for status.*
