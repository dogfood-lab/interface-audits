# Remediation Priority List

**Audit:** ma-20260602-govuk-multi-step-form-pt0
**Target:** GOV.UK Design System — multi-step form pattern
**Date:** 2026-06-02

Findings are ordered by severity × leverage. Within each severity tier, findings are ranked by surface centrality (how often users encounter the surface) and ease of fix.

---

## Critical — None

No Critical findings. No keyboard traps, no drag-only paths, no non-extendable timeouts were confirmed in the observed markup.

---

## High

### MA-04 — Pattern provides no timeout mechanism; implementations may silently discard form data

**Section:** timeout_pressure | **Severity:** High | **Surface:** GOV.UK multi-step form pattern (complete-multiple-tasks, question-pages, check-answers)

**Why this ranks first among Highs:** This finding affects every GOV.UK service built on the multi-step pattern that implements a session timeout — which is most of them. The pattern is explicitly designed for long-duration, high-consequence transactions (licence applications, benefit claims). Switch/scan users, who input at ~1.7 WPM, can take 7x longer than typical typists on the same form. A 20-minute timeout with no extension mechanism excludes them from completing the task and discards all entered data. Unlike the other High (MA-05), this gap affects every page of the flow, not just the final step.

**Suggested fix:** Add a session-timeout warning pattern to the GOV.UK Design System that: (a) warns the user at least 2 minutes before session expiry via a keyboard-accessible dialog (`role="dialog"`, keyboard-reachable "Stay signed in" button, Escape-dismissible), (b) extends the session by at least 10x the remaining time on activation, (c) preserves all entered form data if the session expires before the user extends it (server-side save on each question-page submit), and (d) adds explicit WCAG 2.2.1 compliance guidance to the complete-multiple-tasks pattern page. The GOV.UK Prototype Kit's experimental session timeout pattern is a useful starting point. Implementation effort: Medium (new component + documentation). Impact: High (every long-form service).

---

### MA-05 — "Accept and send" final submission has no post-activation undo path

**Section:** undo_recovery | **Severity:** High | **Surface:** Check-your-answers pattern — final form submission button

**Why this ranks second:** The "Accept and send" button is the only irreversible, consequential action in the multi-step flow. A motor-impaired user who accidentally activates it — or who Tab-navigates to it and presses Enter before reviewing — has no recovery path from the interface itself. The check-your-answers page and the Back link address pre-submission review, but they do not help once the form is submitted. This affects a smaller moment in the flow than MA-04 (only the final submit step) but has higher consequence per instance.

**Suggested fix:** After successful submission, display a confirmation page that includes: (1) the reference number and what happens next (already standard in GOV.UK services), (2) a "What to do if you made a mistake" section with a support contact path or an amendment URL. For services where post-submission cancellation is technically feasible within a short window, add a "Cancel this submission" control on the confirmation page (valid for up to 5 minutes after submission). Add pattern guidance to the check-answers page documentation noting that irreversible submission must be accompanied by a post-submission correction path. Implementation effort: Low (documentation + confirmation-page update). Impact: Medium (one step, but consequential).

---

## Medium

### MA-02 — "Change" links on check-your-answers are inline-text targets (~16-24px tall)

**Section:** pointer_precision | **Severity:** Medium | **Surface:** Check-your-answers / summary-list — govuk-summary-list__actions column

**Why this ranks first among Mediums:** The check-your-answers page is a review step — the moment when the user most needs to be able to change an answer without errors. Motor-impaired users have 2.9–3.9x higher miss rates on sub-30mm targets (Chen et al. 2013). An inline text link with no padding expansion is the most common pattern-level target-size failure in GOV.UK services, and the summary-list component is used on nearly every multi-step service's review page.

**Suggested fix:** Add `padding: 4px 0;` to `.govuk-summary-list__actions a` (or the equivalent summary-list CSS rule) so the link has at least a 24px touch height. Alternatively, expand the effective touch target by adding a positioned pseudo-element that covers the full table row, matching the task-list row-link technique:
```css
.govuk-summary-list__actions a {
  position: relative;
}
.govuk-summary-list__actions a::after {
  content: "";
  position: absolute;
  top: 0; right: 0; bottom: 0; left: 0;
}
```
This expands the hit area without changing the visual layout. Implementation effort: Very low (CSS-only). Impact: Medium-High (present on every check-your-answers page).

---

### MA-07 — Error summary focus management is JS-dependent; no-JS path leaves focus at page top

**Section:** error_recovery | **Severity:** Medium | **Surface:** All question pages with validation errors — govuk-error-summary component

**Why this ranks second among Mediums:** Validation errors are a common state on multi-step forms — a user with slow input is more likely to make entry errors and encounter this path. Without JS, a keyboard user must Tab through the full page from the top before reaching the error summary. On a page with a GOV.UK header, service navigation, and breadcrumb, this can mean 15+ Tab stops before reaching the error list.

**Suggested fix:** Add `tabindex="-1"` to the error-summary container as a static HTML attribute in the govuk-error-summary template so it is focusable without JS:
```html
<div class="govuk-error-summary" data-module="govuk-error-summary" tabindex="-1">
```
The govuk-frontend JS already adds this programmatically; making it static provides the no-JS fallback without breaking anything. Additionally, add pattern guidance that error pages should redirect or reload with the error summary at the top of the page content (after skip link and nav), not buried mid-page. Implementation effort: Very low (one attribute in one template). Impact: Medium (benefits no-JS and partial-JS environments).

---

## Low

### MA-01 — Start button uses `role="button"` on anchor with JS Space-key compensation

**Section:** keyboard_path | **Severity:** Low | **Surface:** Start now button — any GOV.UK service start page

**Suggested fix:** Where the Start now button triggers navigation (not a form submit), it is correctly implemented as an `<a>`. The JS Space-key compensation is appropriate and well-tested. The low finding is: document the JS dependency explicitly in the component's accessibility notes and add a no-JS test to the component's test suite confirming Enter still works when the module is not initialised. No markup change is required. Implementation effort: Very low (documentation + test). Impact: Low (Enter still works without JS; Space is the only gap).

---

### MA-03 — govuk-button computed height (~40px) below 44px AAA target on desktop

**Section:** pointer_precision | **Severity:** Low | **Surface:** All question pages, task list Apply button, check-your-answers Accept and send button

**Suggested fix:** Increase top and bottom padding by 2px each: `padding: 10px 10px 9px`. This brings the computed height to 42px, and with the 2px drop-shadow, the visual height to ~44px. Alternatively, accept the 40px height with documentation noting the delta from AAA (the button passes 2.5.8 AA). Implementation effort: Very low (single CSS rule change). Impact: Low (button height is already well above 2.5.8 minimum; this is polish-level).

---

### MA-06 — Adjacent Change links on check-your-answers may cause tremor overshoot to wrong row

**Section:** undo_recovery | **Severity:** Low | **Surface:** Check-your-answers summary list — multiple adjacent Change links

**Suggested fix:** Two options. (1) Add `padding: 4px 0;` to summary-list action links (which also fixes MA-02) — this increases the vertical spacing between adjacent Change links from near-zero to 8px, which is the minimum gap for adjacent actionable icons per the rubric (finding 4, Kim et al. 2022). (2) Implement the row-hover pattern from the task-list on the summary-list, so the active row is visually highlighted and the user can visually confirm which row's Change they are about to activate. Implementation effort: Very low (CSS). Impact: Low (consequential for tremor users, but not exclusive).

---

### MA-08 — Keyboard trap absence not confirmable from static DOM alone

**Section:** evidence | **Severity:** Low | **Surface:** Audit methodology gap

**Suggested fix:** This is a methodology finding, not a product finding. Resolve by running a 30-minute live keyboard-only Tab-cycle through the full form flow: task list → each question page type → check-your-answers → confirmation page. Press Tab repeatedly with no mouse throughout. If no trap is found, close MA-08 as a false positive (confirmed clean). If a trap is found, escalate to Critical. Implementation effort: Very low (live test). Impact: Process quality.

---

## Summary table

| ID | Severity | Section | Fix effort | Impact |
|----|----------|---------|-----------|--------|
| MA-04 | High | timeout_pressure | Medium | High |
| MA-05 | High | undo_recovery | Low | Medium |
| MA-02 | Medium | pointer_precision | Very low | Medium-High |
| MA-07 | Medium | error_recovery | Very low | Medium |
| MA-01 | Low | keyboard_path | Very low | Low |
| MA-03 | Low | pointer_precision | Very low | Low |
| MA-06 | Low | undo_recovery | Very low | Low |
| MA-08 | Low | evidence | Very low | Process |
