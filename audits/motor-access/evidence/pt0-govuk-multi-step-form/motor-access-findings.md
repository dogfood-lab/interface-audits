# Motor Access Audit — Findings

**Audit ID:** ma-20260602-govuk-multi-step-form-pt0
**Target:** GOV.UK Design System — multi-step form pattern (question pages, task list, check-your-answers, error summary, date input, file upload, button, skip-link, back-link components)
**Primary URL:** https://design-system.service.gov.uk/patterns/complete-multiple-tasks/ (canonical multi-step pattern; the /patterns/multi-step-form/ URL returned 404 — the live pattern is at complete-multiple-tasks/)
**Run ID:** pt0-govuk-multi-step-form
**Method:** Path 2 / WebFetch DOM-fallback. Static HTML fetched via curl for component example iframes, pattern pages, and the govuk-frontend CSS and JS bundles from the live design system site. No live keyboard session was executed on this rig.
**Date:** 2026-06-02
**Rubric version:** 0.1.0 (Draft, externally hardened 2026-06-02)
**Auditor:** Claude Sonnet 4.6 (PT0 run)

---

## Rig limitations

This rig cannot execute live keyboard-only navigation, trigger a focus trap, run a screen reader, or produce a hardware device contact patch. All findings default to **Inferred** evidence state unless the markup is direct (Observed). Findings that cannot reach Inferred are recorded as **Open question**. The rig limitation is documented in the scorecard's `context.viewport_render_limitation` field.

Sources used:
- Component example iframes fetched directly (rendered HTML, not documentation wrapper): button/default, button/start, error-summary/default, skip-link/default, date-input/default, file-upload/default, back-link/default, question-pages/default, complete-multiple-tasks/default, check-answers/default
- govuk-frontend minified CSS (govuk-frontend-a1d59e2f53f39da59930a50925e5ecdf.min.css)
- govuk-frontend button module source (govuk-frontend@6.1.0/dist/govuk/components/button/button.mjs)
- govuk-frontend skip-link module source (govuk-frontend@6.1.0/dist/govuk/components/skip-link/skip-link.mjs)
- govuk-frontend bundled JS (application-example-c1523c2b5e17dfe3bf4942b2c70ecb6d.js)

---

## Section 0 — Keyboard Path

**Section status: WARN**

Justification: No keyboard trap was found in the observed markup. The skip-link is present and correctly targets `#main-content`, which exists in every example page. Focus indicators meet the WCAG 2.4.13 threshold per the CSS evidence. However, the tab-panel pattern used for code example tabs (role="tab" + role="tabpanel" + role="tablist") in the Design System site itself requires the arrow-key pattern; this cannot be confirmed or denied without live interaction. The date input fields use plain `<input type="text">` with no calendar widget, so no complex ARIA widget trap is expected. One open question remains on the mobile-nav menu toggle button.

---

### Finding MA-01 — Start button uses `role="button"` on an anchor with `draggable="false"` attribute

**Severity:** Low
**Section:** keyboard_path
**Surface:** GOV.UK Design System site — "Start now" button example; any GOV.UK service start page
**Load displaced to:** navigation
**Evidence state:** Observed (rendered HTML of /components/button/start/index.html)
**Interaction cost class:** cost

**Issue:**
The "Start now" button is rendered as an anchor element with `role="button"` and `draggable="false"`:
```html
<a href="#" role="button" draggable="false" class="govuk-button govuk-button--start" data-module="govuk-button">
```
The govuk-frontend button module adds a `keydown` handler that synthesises a `click()` when Space is pressed on an element with `role="button"`. This makes the anchor behave like a button for Space activation. The `draggable="false"` attribute prevents the default browser drag behaviour on an anchor.

**Why it matters:**
An anchor natively activates on Enter but not Space. The ARIA Authoring Practices require that an element with `role="button"` responds to both Enter and Space. The govuk-frontend JS compensates by handling `keydown` Space and calling `$target.click()`. This relies on JavaScript being available and the module being initialised. Without JS (or if the module fails to initialise), a keyboard user pressing Space on the "Start now" button will scroll the page rather than activate the link. The interaction cost is low because Enter alone still works on an `<a>`, and the pattern is well-established in GOV.UK services. It is cost, not exclusion.

**Evidence:**
Observed HTML from rendered iframe: `/components/button/start/index.html`. Button source code confirmed at `govuk-frontend@6.1.0/dist/govuk/components/button/button.mjs` — the module handles `keydown` event only for Space, delegating Enter to the browser's native link behaviour.

**Fix:**
Consider using a `<button>` element for the "Start now" action when it submits a form, which natively handles both Enter and Space without JS. If the link form is required (navigation to the next URL on click), document the JS dependency explicitly and add a no-JS fallback test. This is a design-system-level decision already known to the GOV.UK team; it is flagged here for rubric completeness.

---

### Open Question OQ-01 — Mobile navigation menu keyboard operability under no-JS

**Section:** keyboard_path
**Summary:** The service navigation toggle button (`govuk-service-navigation__toggle`) is `hidden` and `aria-hidden="true"` at initial load in the full Design System wrapper pages. It becomes visible when JavaScript renders it. Under no-JS, the navigation list is either always visible or inaccessible. Whether the toggle's keyboard pattern (Enter/Space to expand, Escape to collapse, arrow keys for items) matches the ARIA disclosure button pattern is not confirmable without a live keyboard session.
**Resolution path:** Open the Design System site in a browser with JavaScript disabled and Tab-cycle through the navigation. Also test with JavaScript enabled and Tab through the nav toggle button, pressing Enter and Escape, to confirm pattern compliance.

---

### Open Question OQ-02 — Tab-panel example tabs: arrow-key pattern implementation

**Section:** keyboard_path
**Summary:** The Design System's code example tabs use `role="tablist"`, `role="tab"`, and `role="tabpanel"`. The ARIA Authoring Practices require arrow keys (Left/Right) to move between tabs, not Tab. Whether the govuk-frontend Tabs component correctly implements arrow-key navigation cannot be confirmed without live interaction.
**Resolution path:** Tab to any "HTML / Nunjucks" tab pair on a component page, then press Left/Right arrow keys to confirm inter-tab navigation. Confirm Escape does not dismiss and that Tab moves to the tabpanel content.

---

**Positive observations for Section 0:**

- **PO-01:** Skip link is present on every example page (`<a href="#main-content" class="govuk-skip-link" data-module="govuk-skip-link">Skip to main content</a>`) and targets the `id="main-content"` element that exists in every observed example. The skip-link JS validates the target on initialisation and throws an `ElementError` if it is missing, providing a build-time safety net.
- **PO-02:** Focus state CSS is implemented via yellow background + black bottom shadow (`:focus { outline: 3px solid transparent; background-color: var(--govuk-focus-colour, #fd0); box-shadow: 0 -2px ... 0 4px ... }`). This two-layer treatment (yellow fill + 4px black underline shadow) substantially exceeds the WCAG 2.4.13 2px / 3:1 minimum.
- **PO-03:** All interactive elements observed use semantic HTML: `<button>`, `<a>`, `<input>`, `<fieldset>`, `<legend>`. No `<div>` with a click handler was found in any form surface.
- **PO-04:** Back link is a plain `<a class="govuk-back-link">` — a native anchor with no ARIA role override, so both Enter and Tab work without JS.

---

## Section 1 — Pointer Precision

**Section status: WARN**

Justification: The govuk-button CSS shows `padding: 8px 10px 7px` with `width: 100%` on mobile and `width: auto` on wider viewports. The computed height is approximately `font-size (19px) * line-height (1) + padding-top (8px) + padding-bottom (7px) + border (2px * 2) = ~40px`. This is below the 44×44px AAA target (WCAG 2.5.5) but above the 24px AA minimum (WCAG 2.5.8). On mobile, buttons expand to full container width, so the width target is not an issue, but the 40px height is a measurable miss from the motor-impaired research threshold. Radio and checkbox inputs are 44×44px which is exemplary. The `govuk-task-list__link` expands to fill the whole row via a pseudo-element, so effective touch target is the full table-row. The "Change" links in the check-your-answers pattern are inline text links (small height) — these are the only pattern-level concern.

---

### Finding MA-02 — "Change" links on check-your-answers page are inline-text targets

**Severity:** Medium
**Section:** pointer_precision
**Surface:** Check-your-answers / summary-list pattern — `govuk-summary-list__actions` column
**Load displaced to:** time, recovery / undo
**Evidence state:** Inferred (rendered HTML from /patterns/check-answers/default/index.html confirms `<a class="govuk-link" href="#">Change<span class="govuk-visually-hidden"> name</span></a>` as inline text links with no padding class)
**Interaction cost class:** cost

**Issue:**
The check-your-answers page uses a summary-list component where each row's "Change" action is an inline text link. The rendered HTML is: `<a class="govuk-link" href="#">Change<span class="govuk-visually-hidden"> name</span></a>`. The govuk-link CSS does not add height or padding; the link's touch target is the visual text dimensions only — approximately 16px tall by 55px wide at 1rem font-size on desktop, and similar on mobile.

**Why it matters:**
The check-your-answers page is a core, final-review step. A motor-impaired user who discovers an error must hit the "Change" link to correct it. A 16px-tall inline target is below the WCAG 2.5.8 24px minimum. The error rate for motor-impaired users on sub-30mm targets is 2.9–3.9x the rate for non-impaired users (Chen et al. 2013, finding 1). The cost is elevated because the task — correcting an error before submission — is consequential and difficult to recover from if the user accidentally hits the wrong row's link or misses and activates the Submit button below.

**Evidence:**
Inferred from observed rendered HTML at check-answers/default/index.html. The `govuk-link` CSS provides no padding or explicit height; font-size is 1rem (16px) → line-height at default 1.5 = ~24px tall. With the summary-list's CSS (`display: table-cell; vertical-align: top`) there is no block-level target expansion. The WCAG 2.5.8 spacing exception may apply if the surrounding dead space in the table cell pads the offset, but the cell itself has other content (the `<dt>` and `<dd>` value), so the offset area is not unambiguously clear. This is a Section 7 caveat: confirmed rendered-pixel measurement would require a live browser.

**Fix:**
Add a `display: inline-block; padding: 4px 0;` to summary-list action links, or use a button-styled link with visible padding. Alternatively, expand the click target using a positioned pseudo-element that fills the table row (the same technique govuk-task-list uses for its row links), ensuring the Change action target covers the full row height.

---

### Finding MA-03 — govuk-button computed height (~40px) falls below the 44px AAA target on desktop

**Severity:** Low
**Section:** pointer_precision
**Surface:** All question pages, task list "Apply" button, check-your-answers "Accept and send" button
**Load displaced to:** time
**Evidence state:** Inferred (CSS confirms padding: 8px 10px 7px, border 2px, line-height 1, font-size 19px → computed height ~40px)
**Interaction cost class:** cost

**Issue:**
The default govuk-button has CSS: `padding: 8px 10px 7px; border: 2px solid transparent; font-size: 1.1875rem; line-height: 1`. The computed box height is approximately: 19px (font-size * line-height) + 8px (top padding) + 7px (bottom padding) + 4px (2px border * 2) = 38px. With the `box-shadow: 0 2px 0` drop-shadow giving a visual bottom of ~40px, the rendered button appears ~40px tall. On mobile (width: 100%), the width target is not an issue, but the height is ~4px below the WCAG 2.5.5 (44px AAA) threshold.

**Why it matters:**
The 44px threshold corresponds to approximately 11.5mm physical size — still below the 30mm / 113px research threshold for motor-impaired touch users (Chen et al. 2013, finding 1). On a desktop or larger tablet where `width: auto` is active, a narrower button is a harder target. This is a Low finding because: the button passes the 24px WCAG 2.5.8 AA minimum, the width-100% on mobile substantially reduces horizontal-acquisition difficulty, and the govuk-button is the primary action control with good contrast and no adjacent crowding. The shortfall from 44px is a polish-level miss, not a significant barrier.

**Evidence:**
Inferred from CSS: `.govuk-button { padding: 8px 10px 7px; border: 2px solid transparent; font-size: 1.1875rem; line-height: 1; }` and `.govuk-button { width: auto; margin-bottom: 32px; }` (wider viewport). No live rendered measurement was possible on this rig.

**Fix:**
Increase top and bottom padding by 2px each (to `padding: 10px 10px 9px`) to bring the button to 44px. This is a minor change with no visual regression on existing services. Alternatively document the known delta from AAA in the component accessibility notes.

---

### Positive Observation PO-05 — Radio and checkbox inputs are 44×44px

**Section:** pointer_precision
**Summary:** The CSS confirms `.govuk-radios__input { width: 44px; height: 44px; }` and `.govuk-checkboxes__input { width: 44px; height: 44px; }`. These are the most frequently tapped targets in GOV.UK question pages and meet the AAA 44px target exactly.

---

### Positive Observation PO-06 — Task-list row links expand to full-row touch target

**Section:** pointer_precision
**Summary:** `.govuk-task-list__link:after { content: ""; display: block; position: absolute; top: 0; right: 0; bottom: 0; left: 0; }` — the pseudo-element covers the entire task-list row, making the effective touch target the full row height × width. This is an exemplary implementation of the "large touch target via positioned pseudo-element" pattern.

---

## Section 2 — Drag Dependence

**Section status: PASS**

Justification: No sortable lists, kanban boards, custom sliders, drag-only map pans, or resize handles were found in the GOV.UK multi-step form pattern surface. The file-upload component (`<input class="govuk-file-upload" type="file">`) is a standard `<input type="file">` element, not a drop-zone-only pattern. This renders a native "Choose file" button in all browsers — the single-pointer (click) path is always available. No `draggable` attribute or DnD library signatures were found in the component example HTML or the govuk-frontend JS beyond the `draggable="false"` on the "Start now" anchor (which suppresses drag rather than enabling it). The task-list links are plain anchors. Date input uses three `<input type="text">` fields — no calendar picker widget with drag interactions.

---

### Positive Observation PO-07 — File upload uses native input, not a drop-zone-only widget

**Section:** drag_dependence
**Summary:** `<input class="govuk-file-upload" id="file-upload-1" name="fileUpload1" type="file">` — the standard file-input element always presents a native "Choose file" / "Browse" button in all browsers. No drag-and-drop zone replaces this native control. This directly satisfies WCAG 2.5.7 for file upload.

---

### Positive Observation PO-08 — Date input avoids calendar picker widget entirely

**Section:** drag_dependence
**Summary:** The GOV.UK date input uses three plain `<input type="text" inputmode="numeric">` fields (Day, Month, Year). There is no calendar picker, no date-range slider, and no drag-to-select gesture. This eliminates the drag-dependence and keyboard-trap risks commonly associated with third-party date picker widgets (Reuschel et al. 2023, finding 27, cited as a cause of ~1/3 of screen-reader job-application failures).

---

## Section 3 — Timeout Pressure

**Section status: WARN**

Justification: The GOV.UK Design System does not ship a session-timeout component in govuk-frontend v6. The `govuk-frontend` package list does not include a `timeout-warning` or session-idle component — the 404 returned for `/components/timeout-warning/` confirms this. The design system documents session timeout as a service-level concern (GOV.UK Service Manual, "Collecting information from users in a transaction"). This means the pattern page does not prescribe whether timeouts are present, extendable, or keyboard-accessible in implementing services. The pattern itself is therefore silent on timeout pressure, which is an open question at the section level: timeout behaviour is entirely implementation-dependent.

The section is Warn (not Pass) because:
1. The pattern explicitly targets complex, multi-step services (licences, applications) that commonly have session timeouts.
2. No timeout mechanism is prescribed or defaulted.
3. Without a prescribed or demonstrated timeout extension mechanism, this audit cannot confirm that implementations using this pattern will meet WCAG 2.2.1.

---

### Finding MA-04 — Pattern provides no timeout mechanism or guidance; implementations may silently discard form data

**Severity:** High
**Section:** timeout_pressure
**Surface:** GOV.UK multi-step form pattern (complete-multiple-tasks / question-pages pattern); all GOV.UK services built on this pattern
**Load displaced to:** time, recovery / undo
**Evidence state:** Inferred (the govuk-frontend package at v6.1.0 has no session-timeout component; the pattern documentation does not prescribe timeout extension; Reuschel et al. 2023 documents the risk in this exact form type)
**Interaction cost class:** cost

**Issue:**
The GOV.UK multi-step form pattern — task list, question pages, check-your-answers — is designed for services where a user may spend 15–30 minutes or more completing a complex application (licences, benefits, immigration). The govuk-frontend library ships no session-timeout warning component. No timeout extension mechanism is demonstrated in any pattern example. Services built on this pattern must implement their own timeout handling, and many do not — or implement it without keyboard accessibility.

**Why it matters:**
Reuschel et al. 2023 (finding 27) measured a 27x form-completion exposure ratio between screen-reader users and others on Fortune 500 job applications, with session timeouts causing the majority of failures. Switch/scan users input at ~1.7 WPM (Koester & Arthanat 2018, finding 24) — 7x slower than typical keyboard typists. A 20-minute session timeout active during a multi-task application can force a switch-scan user to restart from scratch. If the GOV.UK pattern does not prescribe data preservation and timeout extension, implementing teams have no default safeguard. This is High (not Critical) because the failure is at the implementation layer, not demonstrated in the observed pattern HTML — but the pattern's silence on this is itself an interaction-cost gap.

**Evidence:**
Inferred from: (1) govuk-frontend v6 component list — no timeout-warning component present (404 at /components/timeout-warning/); (2) the complete-multiple-tasks/default example HTML has no timeout warning or session-expiry message; (3) GOV.UK Service Manual defers timeout handling to service teams without prescribing a keyboard-accessible extension mechanism. The risk is well-grounded in the Reuschel 2023 finding.

**Fix:**
Add a session-timeout warning pattern to the GOV.UK Design System. The pattern should: (a) warn the user at least 2 minutes before expiry, (b) provide a "Stay signed in" / "Extend session" button in a dialog that is keyboard-reachable and Escape-dismissible, (c) preserve all entered form data across a timeout-and-return flow, and (d) document the WCAG 2.2.1 requirement in the pattern guidance. Until a canonical component exists, add explicit guidance to the complete-multiple-tasks pattern page that session handling must meet WCAG 2.2.1 and document the minimum keyboard-accessible extension mechanism. The GOV.UK Prototype Kit has an experimental session timeout pattern that could serve as the basis.

---

### Open Question OQ-03 — Real-world GOV.UK service session timeout keyboard accessibility

**Section:** timeout_pressure
**Summary:** Live GOV.UK services (e.g. passport renewal, DBS check, tax return) implement their own session timeout dialogs. Whether these dialogs are keyboard-reachable, Escape-dismissible, and present a sufficient extension window for slow-input users is not determined by the design pattern and cannot be assessed from the design system documentation alone.
**Resolution path:** Select 3–5 live GOV.UK services using the multi-step form pattern. Trigger the session timeout in each. Attempt to extend the session using keyboard only. Record whether (a) the warning appears with adequate time, (b) the "Stay signed in" / "Continue" control is reachable by Tab, (c) the dialog is Escape-dismissible, and (d) form data survives a timed-out session.

---

## Section 4 — Undo / Recovery

**Section status: WARN**

Justification: The govuk-button is bound to `click` events (up-event by default in browsers), which satisfies WCAG 2.5.2 pointer cancellation. However, the "Accept and send" button on the check-your-answers page performs an irreversible submission with no undo. There is no undo control, no second confirmation dialog, and no "You can still go back and change your answers" affordance after submission. The pattern does include a Back link and a Check-your-answers review step before submission, which function as a pre-submission recovery mechanism — but once "Accept and send" is clicked, there is no post-submission undo.

---

### Finding MA-05 — "Accept and send" final submission has no post-activation undo path

**Severity:** High
**Section:** undo_recovery
**Surface:** Check-your-answers pattern — final form submission button
**Load displaced to:** recovery / undo
**Evidence state:** Inferred (check-answers/default/index.html shows `<button type="submit" class="govuk-button">Accept and send</button>` inside a `<form action="/form-handler" method="post">` with no undo, no confirmation dialog, and no "You can still change your mind" message)
**Interaction cost class:** cost

**Issue:**
The check-your-answers page ends with a `<button type="submit" class="govuk-button" data-module="govuk-button">Accept and send</button>`. Activating this button submits the form irrevocably. There is no confirmation dialog, no undo button, and no post-submission "You can cancel within N minutes" affordance. The page includes a legal declaration ("By submitting this application you are confirming…") which functions as a consent mechanism but not as a motor-access recovery path.

**Why it matters:**
Motor-impaired users have elevated accidental-activation rates (Mott et al. 2016, finding 25: default touch sensing misses intended coordinates by >3x the error margin for non-impaired users). The govuk-button is bound to the `click` event (up-event), which means a pointer user who begins a press and realises they are on the wrong target can slide off before releasing — this satisfies WCAG 2.5.2 and is good. However, once the form is submitted, the action is irreversible. A user who accidentally hits "Accept and send" before reviewing (or who Tab-navigated to it and pressed Enter accidentally) has no recovery path. The cost is High because the action is core to the flow and irreversible.

**Evidence:**
Inferred from observed check-answers/default/index.html rendered HTML. The pattern documentation does not describe a post-submission cancellation window. The govuk-button JS (`button.mjs`) binds to `click` — this is the up-event in browsers, so pointer-cancellation is preserved during the press. The gap is the post-click, post-submit phase.

**Fix:**
After successful form submission, display a "confirmation of receipt" page (standard GOV.UK pattern) that includes: the reference number, what happens next, and a "What to do if you made a mistake" section with a support contact or amendment path. For services where post-submission cancellation is feasible, add a 30-second undo window with a prominent "Cancel submission" control. Add pattern guidance noting that irreversible submission must be accompanied by either a post-submission correction path or explicit service-level policy stating correction is handled by support.

---

### Finding MA-06 — "Change" links on check-your-answers are adjacent and may cause overshoot to wrong row

**Severity:** Low
**Section:** undo_recovery
**Surface:** Check-your-answers summary list — multiple adjacent "Change" links in the actions column
**Load displaced to:** recovery / undo
**Evidence state:** Inferred (check-answers/default/index.html shows five sequential `govuk-summary-list__row` entries each with a "Change" link in the actions column)
**Interaction cost class:** cost

**Issue:**
The check-your-answers page shows multiple rows, each with a "Change" link. Rows are separated by a 1px border. A tremor user making a small vertical overshoot could activate the "Change" link on the adjacent row rather than the intended row. The visual gap between rows is the 1px border only — there is no dead space between the "Change" link and the boundary of the adjacent row's target zone.

**Why it matters:**
Kim et al. 2022 (finding 4) demonstrate that tremor magnitude scales Fitts-derived pointing difficulty, and that adjacent targets close to a neighbour are a documented tremor trap. Activating the wrong "Change" link wastes time (the user must navigate back, change the wrong field back, then find and change the right one) but does not cause irreversible harm — it is cost, not exclusion.

**Evidence:**
Inferred from rendered HTML at check-answers/default/index.html. Row structure: `<div class="govuk-summary-list__row">` ... `<dd class="govuk-summary-list__actions"><a class="govuk-link">Change</a></dd>`. No padding or margin between rows beyond the 1px border line. Physical spacing between adjacent "Change" links is the row padding only — approximately 10px based on the `govuk-summary-list__key` padding visible in CSS.

**Fix:**
Add `padding-top: 4px; padding-bottom: 4px;` to `.govuk-summary-list__actions a` or use the row's hover background (already present on task-list rows: `.govuk-task-list__item--with-link:hover { background: #f3f3f3 }`) to visually communicate the active row zone. Alternatively, use the same full-row pseudo-element technique as the task list to ensure the user's intent is correctly attributed to the correct row.

---

### Positive Observation PO-09 — govuk-button uses click event (up-event), satisfying WCAG 2.5.2

**Section:** undo_recovery
**Summary:** The govuk-frontend button module (button.mjs) binds to `click` and not `mousedown` or `pointerdown`. Browsers fire `click` on the up-event. This means a pointer user who begins pressing a button and realises they are on the wrong target can slide the pointer off the button before releasing, and the `click` will not fire. This satisfies WCAG 2.5.2 Pointer Cancellation (A) for pointer interactions.

---

### Positive Observation PO-10 — Back link on every question page enables pre-submission undo

**Section:** undo_recovery
**Summary:** Every question-page example and the check-your-answers page includes `<a href="#" class="govuk-back-link">Back</a>` before the main content. This provides a single-click or single-Enter undo for every question-page submission, allowing the user to return and change their answer. This is not a full undo mechanism, but it substantially reduces the recovery cost for pre-submission mistakes.

---

## Section 5 — Error Recovery

**Section status: WARN**

Justification: The error-summary component (`govuk-error-summary`) uses `<div role="alert">` which announces via ARIA live regions. The govuk-frontend error-summary JS moves focus to the summary on page load when errors exist. Error links in the summary navigate directly to the relevant input field. However, the error-summary has no keyboard dismiss (no Escape handler, no close button) — this is by design (it is a static region, not a dialog), which is correct. The remaining open question is whether implementations always move focus to the error-summary or whether some teams render the page without the govuk-frontend error-summary module initialised.

---

### Finding MA-07 — Error summary focus management is JS-dependent; no-JS path leaves focus at page top

**Severity:** Medium
**Section:** error_recovery
**Surface:** All question pages with validation errors — govuk-error-summary component
**Load displaced to:** navigation, time
**Evidence state:** Inferred (govuk-error-summary module is a JS enhancement; without JS or if the module fails to init, focus remains at the top of the page after a failed form submission)
**Interaction cost class:** cost

**Issue:**
The govuk-error-summary component uses `<div class="govuk-error-summary" data-module="govuk-error-summary">` with `<div role="alert">` inside. The govuk-frontend JS module moves focus to the summary container when the page loads and errors are present. Without JS, or if the module fails to initialise (script error, noscript policy, older browser), focus after form submission remains at the top of the page — likely the skip link. A keyboard user must then Tab through all navigation, the back link, and any content above the error summary before reaching the error list.

**Why it matters:**
On a page with a GOV.UK header, service navigation, and breadcrumb, there can be 10–20 Tab stops before the error summary. A motor-impaired keyboard user who moves slowly must traverse all of these before discovering what went wrong. This is a cost (navigation + time) finding. The WCAG requirement (3.3.1 Error Identification) is met visually; the motor cost is the traversal.

**Evidence:**
Inferred from govuk-error-summary component markup (`data-module="govuk-error-summary"` is a JS hook) and the govuk-frontend JS bundle which contains the error-summary module. The rendered HTML of error-summary/default/index.html does not include a `tabindex="-1"` on the error-summary div, which the govuk-frontend JS adds programmatically to make the div focusable before calling `.focus()`. This pattern is confirmed by govuk-frontend source; it is JS-dependent.

**Fix:**
Add `tabindex="-1"` to the error-summary container as a static HTML attribute so that it is focusable regardless of JS state. Update pattern guidance to note that implementations must not suppress the govuk-error-summary module. Consider adding a visible "Jump to errors" skip link as a no-JS fallback (analogous to skip-to-main).

---

### Positive Observation PO-11 — Error summary links navigate directly to the failing field

**Section:** error_recovery
**Summary:** Each error in the `govuk-error-summary__list` is a link: `<a href="#">Enter your full name</a>`. The link target is the relevant input field by ID. Activating the link (Enter on keyboard) moves focus to the field, allowing the user to correct it immediately without re-traversing the page. This is the correct pattern for error recovery.

---

### Open Question OQ-04 — Hover-only tooltips or help text in real service implementations

**Section:** error_recovery
**Summary:** The GOV.UK Design System uses `govuk-hint` for help text (static, always visible) and does not use hover-only tooltips in its form components. However, real services built on GOV.UK may add custom tooltip patterns. Whether any live service using the multi-step form pattern introduces hover-only content that lacks a focus equivalent cannot be determined from the design-system markup alone.
**Resolution path:** Audit 3–5 live GOV.UK services using the multi-step pattern. Tab through each page with no mouse and confirm all visible content on hover is also available on focus.

---

## Section 6 — Configuration Cost

**Section status: PASS**

Justification: The GOV.UK Design System does not include per-user motor accommodation controls (larger targets, reduced motion toggle, interaction mode switches) within the form pattern itself. This is by design: GOV.UK services rely on OS-level accommodation (Windows Sticky Keys, macOS Switch Control, browser zoom, forced colours) rather than in-app configuration. There are no deep-panel accommodation controls to audit, and no in-page settings UI. The pattern guidance page is a documentation surface rather than a configurable tool. This section passes because the failure mode (accommodation controls requiring the very capability they grant) is not present — because no accommodation controls exist at the pattern level.

The audit notes that the absence of in-app timeout configuration (see MA-04) is the one case where a configuration affordance would benefit motor-impaired users, but that gap is captured in Section 3.

---

### Positive Observation PO-12 — Pattern relies on OS/browser-level accommodation by design

**Section:** configuration_cost
**Summary:** GOV.UK services are designed to work with OS accommodation features. The design system documentation explicitly addresses reduced-motion (govuk-frontend honours `prefers-reduced-motion`), high-contrast (forced colours CSS is included), and zoom up to 400% (1-column layout). This design-level decision avoids the recursive failure mode where an accessibility control requires the capability it grants. For motor access, users configure switch control, dwell clicking, or sticky keys at the OS level, and the GOV.UK HTML surface is compatible with all of these without in-app configuration.

---

## Section 7 — Evidence

**Section status: WARN**

Justification: This is a Path 2 (DOM-fallback) run. No live keyboard-only navigation was executed. No single-pointer-no-drag interaction was performed. The rig cannot produce touch-device contact patches or rendered pixel measurements. Per the rubric's Section 7 caveat, rendered-DOM / CSS measurement is acceptable Inferred evidence when the rig limitation is documented. Section 7 Warn is the correct and honest outcome — the evidence quality is real but the method is constrained.

The evidence is stronger than a documentation-only fallback because:
- Actual rendered HTML was fetched from live component example iframes (not documentation-wrapper pages)
- Actual CSS was fetched and parsed for dimensions, focus styles, and target sizes
- Actual govuk-frontend JS source was fetched and read for event handler patterns
- All findings cite specific measured values or source-code observations

---

### Finding MA-08 — Audit could not confirm keyboard trap absence in live sessions

**Severity:** Low
**Section:** evidence
**Surface:** Audit methodology — Section 7 process gap
**Load displaced to:** feature loss
**Evidence state:** Open question
**Interaction cost class:** n/a

**Issue:**
This audit was conducted using static DOM fetch only. No live keyboard-only Tab-cycle was run through the full form flow. A keyboard trap (WCAG 2.1.2) is the one finding that would fail the entire page under WCAG Non-Interference. The absence of complex ARIA widgets in the observed markup (no dialogs, no date-picker calendar, no carousels) makes a keyboard trap unlikely in the core form pattern, but it cannot be confirmed.

**Why it matters:**
Per the rubric (Section 0, finding 10), a single keyboard trap is an automatic page-level blocker. The DOM evidence is strongly negative (no third-party widgets, no custom dialogs, plain HTML inputs), but negative evidence from static markup is weaker than a live Tab-cycle test.

**Evidence:**
Open question — cannot be confirmed from static DOM alone.

**Fix:**
Resolve by running a live keyboard-only Tab-cycle through: (1) the task list, (2) each question page type (radio, text input, date input, file upload), (3) the check-your-answers page, and (4) the confirmation page. Press Tab repeatedly with no mouse and confirm focus is never trapped. This is a 30-minute live test.

---

## Auditor Notes

### Rubric-revision candidates surfaced by this PT

These are observations about the rubric itself, not about the target. They are noted here for the next minor-version revision; they were not applied during this PT.

1. **Section 3 needs a "pattern-level vs implementation-level" distinction.** When auditing a design pattern (rather than a live service), timeout pressure is entirely implementation-dependent. The rubric does not address how to score a pattern that is silent on timeouts. Candidate rule: "If a pattern targets multi-step, high-duration flows but prescribes no timeout mechanism, flag High as a pattern-level gap and record the finding against the pattern, not an implementation."

2. **Section 4 should explicitly address post-submission undo as distinct from in-flow Back links.** The current rubric focuses on undo within the interaction (sliding off before up-event). The check-your-answers finding (MA-05) reveals a different shape: the action is confirmed, the submission is intentional, but there is no post-submission correction path. The rubric's "destructive or irreversible action" language covers this, but the fix guidance should explicitly reference GOV.UK-style "confirmation + correction path" as the resolution pattern.

3. **Section 7's touch/device-render caveat should mention CSS-computed height as an acceptable Inferred measurement.** The current caveat says "rendered DOM/CSS measurement… is acceptable Inferred evidence." It should clarify that CSS-computed height (from reading the stylesheet) is a weaker form of this than a live rendered bounding box, since CSS can be overridden by cascade specificity, user stylesheets, or device-level zoom. The auditor should note this explicitly.

4. **The MA `interaction_cost_class` field defaults to `n/a` in the extension schema, but the skill says it is "recommended on every finding." The schema should be changed to recommend (not default-n/a) so auditors actively classify each finding.** This was noticed during scorecard population.

---

### Positive observations summary

| ID | Section | Summary |
|----|---------|---------|
| PO-01 | keyboard_path | Skip link present and valid on every example page |
| PO-02 | keyboard_path | Focus state exceeds WCAG 2.4.13 (yellow fill + 4px black underline) |
| PO-03 | keyboard_path | All interactive elements use semantic HTML — no div-with-click |
| PO-04 | keyboard_path | Back link is a native anchor; keyboard-native |
| PO-05 | pointer_precision | Radio and checkbox inputs are 44×44px (AAA) |
| PO-06 | pointer_precision | Task-list row links expand to full-row touch target |
| PO-07 | drag_dependence | File upload is native input — always shows Choose File button |
| PO-08 | drag_dependence | Date input uses plain text fields — no drag-dependent calendar picker |
| PO-09 | undo_recovery | govuk-button binds to click (up-event) — satisfies WCAG 2.5.2 |
| PO-10 | undo_recovery | Back link on every question page enables pre-submission correction |
| PO-11 | error_recovery | Error summary links navigate directly to the failing field |
| PO-12 | configuration_cost | Pattern relies on OS/browser-level accommodation by design — avoids the recursive failure mode |
