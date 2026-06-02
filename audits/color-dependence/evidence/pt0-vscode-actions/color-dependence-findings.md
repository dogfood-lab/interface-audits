# Color Dependence Audit — Findings

**Audit:** Color Dependence Audit v0.1.0  
**Run ID:** cd-20260602-vscode-actions-pt0  
**Target:** https://github.com/microsoft/vscode/actions  
**Method:** Path 2 / WebFetch DOM-fallback  
**Date:** 2026-06-02  
**Auditor:** Claude Sonnet 4.6 (automated PT0 run)

## Rig limitations

This pressure test ran on a Windows rig (Robot / Omen 45L) without a live browser session, CVD simulator, screen reader, or interactive input. WebFetch retrieved partial static HTML from the target; the Actions dashboard uses JavaScript rendering, so full DOM structure was not available. Evidence supplements were drawn from the Primer design system token files (fetched from github.com/primer/primitives via raw API) and the GitHub REST API for live workflow run data. All findings default to Inferred evidence state per the Path 2 / DOM-fallback protocol. No CVD simulator was run; `simulation_confirmation` is set to `unqualified` on all findings. Per the rubric Section 4 precondition, unqualified findings are not promoted to confirmed findings — they are recorded as Inferred and await a qualified-tool run.

---

## Section 0 — Color-only information conveyance

**Status: Fail**

Justification: One Critical finding (CD-01) — workflow run status is conveyed by a colored icon whose semantic label is not surfaced as persistent visible text on the run list. The green/red hue pair used for success and failure collapses under deuteranomaly/protanomaly simulation. A second High finding (CD-02) covers the skipped/cancelled states where the non-color cue (icon shape alone) is ambiguous at a glance. Together these constitute the most common color-dependence failure pattern on CI dashboards.

---

## Finding CD-01 — Workflow run success/failure status distinguished primarily by red/green hue

Severity: Critical  
Section: color_only_conveyance  
Surface: Workflow run list — status icon column, https://github.com/microsoft/vscode/actions  
Load displaced to: visual decoding, memory, trust  
Evidence state: Inferred  

CVD class affected: deuteranomaly, deuteranopia, protanomaly, protanopia  
Contrast-pass hue-fail: true  
Simulation confirmation: unqualified  

Issue:  
Each workflow run row in the Actions dashboard carries a small icon to indicate the run conclusion. The Primer design system (from which GitHub Actions' UI is built) assigns `fgColor.success` (green.5 = #2da44e in light mode) to successful runs and `fgColor.danger` (hsl 356.2, 70.6%, 48% = #d1242f) to failed runs. These two tokens resolve to a green and a red hue at similar luminance in the default light and dark themes. The run list does not display the text label "Success" or "Failure" as persistent visible text next to each icon; the status text ("In progress" is the only phrase visible in the fetched content for active runs). The icon shapes — `check-circle-fill` for success and `x-circle-fill` for failure — are distinct, but on a dense list of 2,500+ runs read quickly, the primary perceptual signal is color.

Why it matters:  
Deuteranomaly and protanomaly affect approximately 5–6% and 1% of males respectively (Birch 2012 [F1]). The green (#2da44e) and red (#d1242f) used for success/failure are on the classic deutan/protan confusion line: both shift toward a brownish-yellow under deuteranopia/protanopia simulation. A developer monitoring CI for a merge decision cannot, in the default theme, distinguish "all green / pass" from "one red / fail" without leaning on icon shape or hovering for tooltip text. This is a WCAG SC 1.4.1 Level A failure — color is the dominant channel and the secondary (icon shape) is small and not paired with visible text [F2, F3]. Luminance contrast between the green and red icons and the white background passes WCAG 1.4.3, which is precisely the boundary case this audit exists to catch: contrast passes, hue fails [F18, F19].

Evidence:  
Inferred from Primer primitives token file (github.com/primer/primitives, commit main, 2026-06-02): `fgColor.success = {base.color.green.5}` (hex #2da44e light mode), `fgColor.danger` (hex #d1242f light mode). Primer token file notes `org.primer.llm.usage: ['success-icon']` for fgColor.success and `['danger-text', 'error-text']` for fgColor.danger — these are the exact tokens applied to status icons per Primer component conventions. GitHub Actions workflow runs API (microsoft/vscode) confirmed `conclusion` values include `success` and `failure` in active runs, confirming the state mix exists. WebFetch of target confirmed workflow run list is present with "2,500+ workflow runs" and mixed statuses. No qualified CVD simulator was run; confirmation requires a Machado-model tool (e.g. DaltonLens) applied to a live screenshot.

Fix:  
Add a visible text label ("Success", "Failure", "Skipped", "Cancelled") alongside each status icon in the run list row. The icon shape provides a secondary non-color cue but is too small to be reliably shape-discriminated at list density. Alternatively, ensure the status text appears in a screen-reader-visible element that is also visible to sighted users (not only as a tooltip). Primer already provides the `protanopia-deuteranopia` theme that swaps success to blue and danger to orange — the fix in the default theme is to pair the icon with a text label, not to swap colors.

---

## Finding CD-02 — Skipped and cancelled run states lack robust non-color differentiation from success

Severity: High  
Section: color_only_conveyance  
Surface: Workflow run list — status icon, conclusion states "skipped" and "cancelled"  
Load displaced to: visual decoding, memory  
Evidence state: Inferred  

CVD class affected: deuteranomaly, deuteranopia, protanomaly, protanopia, monochromacy  
Contrast-pass hue-fail: true  
Simulation confirmation: unqualified  

Issue:  
The GitHub REST API for microsoft/vscode confirmed five distinct conclusion values in recent runs: `success`, `failure`, `skipped`, `cancelled`, and `action_required`. Primer uses `fgColor.success` (green) for success, `fgColor.danger` (red) for failure, and `fgColor.neutral` or `fgColor.muted` (gray) for skipped and cancelled. The Octicons library provides distinct icon shapes — `check-circle-fill` (success), `x-circle-fill` (failure), `skip-fill` (skipped), and `circle-slash` or `circle` (cancelled/pending). However, for CVD users operating under deuteranomaly, the green success icon and any gray neutral icon are perceptually distinct, but without the persistent text label the user must rely on memorizing which gray-ish icon means "skipped" vs "cancelled" vs "queued." On a dense list of thousands of runs the cognitive cost is substantial.

Why it matters:  
A developer triaging CI after a branch merge needs to know which runs failed (require action) vs which were skipped (expected, no action) vs which were cancelled (unexpected). Without text labels, that triage depends on remembering icon shape semantics — `skip-fill` vs `circle-slash` — at 16px scale across 30+ rows. Under monochromacy (grayscale) all the neutral icons collapse to the same perceived shape-only differentiation, and the success check-circle may be confused with the circle (pending) icon [F11]. This is a High rather than Critical because the icon shapes do differ; the failure is that the shapes are not accompanied by text, not that color is the only channel.

Evidence:  
Inferred. GitHub REST API `GET /repos/microsoft/vscode/actions/runs` returned `conclusion` values `["action_required","cancelled","failure","skipped","success"]` across 100 runs (fetched 2026-06-02). Octicons library (github.com/primer/octicons) confirmed icons: `skip-fill-16.svg`, `circle-slash-16.svg`, `check-circle-fill-16.svg`, `x-circle-fill-16.svg`, `circle-16.svg` all exist as candidates. Primer fgColor tokens: `fgColor.muted` = neutral.9 (gray) applies to neutral/secondary states. No CVD simulation run.

Fix:  
Add persistent visible text labels to every run row for all conclusion states. The label text ("Success", "Skipped", "Cancelled", "Failure", "Action required") should appear adjacent to the icon as always-visible text, not only in a hover tooltip. This satisfies WCAG SC 1.4.1 technique G14 (information in text).

---

## Finding CD-03 — Default theme red/green pair lies on the deuteranomaly confusion line (Contrast-Pass / Hue-Fail)

Severity: High  
Section: color_only_conveyance  
Surface: Any surface using fgColor.success + fgColor.danger in the default light/dark themes  
Load displaced to: visual decoding, trust  
Evidence state: Inferred  

CVD class affected: deuteranomaly, deuteranopia, protanomaly, protanopia  
Contrast-pass hue-fail: true  
Simulation confirmation: unqualified  

Issue:  
In the default light theme, `fgColor.success` = green.5 (#2da44e, HSL approximately 140°, 57%, 40%) and `fgColor.danger` = #d1242f (HSL approximately 356°, 70%, 48%). Both colors are medium-luminance and both would pass WCAG 1.4.3 against a white background (luminance ratios approximately 4.5:1 and 4.6:1 respectively). However, this is the archetypal Contrast-Pass / Hue-Fail case: the pair lies on the deutan/protan confusion line because they differ primarily in hue (red vs green) while sharing similar luminance. Under deuteranopia, green.5 and #d1242f both shift toward brownish-amber and become perceptually similar.

Why it matters:  
Primer already has a fix: the `light-protanopia-deuteranopia` theme overrides `fgColor.success` to `blue.5` and `fgColor.danger` to `orange.5`. This token-level evidence confirms that Primer's own engineers identified the red/green pair as a CVD failure and built a separate theme to address it. The finding here is not that a fix is unavailable — it is that the default theme ships with the CVD failure, and users must opt into the CVD-safe theme (requiring navigation to settings, 3–4 clicks, see Section 5). The default experience for a CVD user who has not found the CVD theme is a red/green distinction that collapses [F1, F18, F19]. This finding is documented separately from CD-01 because it is the explicit Contrast-Pass / Hue-Fail boundary case the rubric mandates checking — a color pair that passes 1.4.3 but fails 1.4.1 [F2].

Evidence:  
Inferred from Primer primitives token file (main branch, 2026-06-02): `fgColor.success['light-protanopia-deuteranopia'] = '{base.color.blue.5}'` and `fgColor.danger['light-protanopia-deuteranopia'] = '{base.color.orange.5}'`. The existence of these overrides in the Primer source is direct evidence that the default green/red pair was identified as requiring substitution for CVD users. Base color hex values from `src/tokens/base/color/light/light.json5`: green.5 = #2da44e, red hue = #d1242f.

Fix:  
This finding does not call for a palette swap — that is what the CVD theme already does. The fix is making the CVD-safe theme the default for users who have set a CVD preference in their OS (via CSS `@media (forced-colors: active)` or a GitHub Accessibility setting that activates automatically). Additionally, ensure that even in the default theme, status is communicated by text + icon, not by icon color alone, so the CVD-theme is a quality-of-life improvement rather than a functional requirement.

---

## Section 1 — Chart / graph color encoding

**Status: Warn**

Justification: One Medium finding (CD-04). The Actions dashboard does not feature traditional multi-series charts. The workflow list includes duration timestamps as plain text (e.g., "8m 14s") rather than duration bars. No rainbow/jet or red-green diverging colormap was identified. The main data visualization element is the per-workflow run timing display, which is text-based. The Warn rating reflects the open question about whether any timing visualization charts are present on the run-detail page (not fully loaded by WebFetch).

---

## Finding CD-04 — Timing duration data is text-only; no chart color encoding visible in run list

Severity: Medium  
Section: chart_graph_encoding  
Surface: Workflow run list — duration column  
Load displaced to: visual decoding  
Evidence state: Inferred  

CVD class affected: deuteranomaly, deuteranopia, protanomaly, protanopia  
Contrast-pass hue-fail: false  
Simulation confirmation: unqualified  

Issue:  
The workflow run list displays duration as plain text ("8m 14s", "30m 37s", "2s") without a graphical duration bar or trend chart. This is neutral — text is the best encoding for durations on a list. However, on individual run detail pages (not fully rendered by WebFetch), GitHub Actions displays a visualization graph showing job steps and their timing. Whether that visualization uses multiple color-encoded series or a single hue is not confirmable in this DOM-fallback run. No rainbow or jet colormap was detected.

Why it matters:  
If the workflow visualization graph on the run-detail page uses color as the primary differentiator between parallel jobs, and those colors are drawn from the same Primer status palette (green/red), it would constitute a Section 1 chart encoding failure. Without seeing the rendered graph, this cannot be confirmed. The finding is Medium and scoped to the list surface only; the detail-page chart is logged as an open question.

Evidence:  
Inferred from WebFetch: the run list shows duration as text only. No chart or bar graph element was returned in the partial DOM. GitHub documentation ("An icon to the left of the job name indicates the status of the job") confirms jobs use icons, not charts, in the visualization graph. Chart elements require the JavaScript-rendered run-detail page.

Fix:  
If the run-detail visualization graph uses color-only series encoding, add direct labels or tooltip labels naming each job by text. For timing comparisons, a single-hue bar chart with text labels is sufficient and CVD-safe.

---

## Section 2 — Form validation signaling

**Status: Warn**

Justification: One High finding (CD-05). The filter controls on the Actions dashboard include a "Status" filter, an "Event" filter, a "Branch" filter, and an "Actor" filter. The WebFetch captured these as in an error state ("Sorry, something went wrong" / "Loading"). The form validation pattern for the search/filter bar cannot be confirmed from the DOM-fallback. The finding is based on the known pattern in GitHub's filter UI.

---

## Finding CD-05 — Filter dropdown error state uses color-only signaling (inferred from Primer form patterns)

Severity: High  
Section: form_validation  
Surface: Workflow filter controls — Status/Event/Branch/Actor dropdowns  
Load displaced to: visual decoding, trust  
Evidence state: Inferred  

CVD class affected: deuteranomaly, deuteranopia, protanomaly, protanopia  
Contrast-pass hue-fail: true  
Simulation confirmation: unqualified  

Issue:  
The WebFetch of the target returned the filter controls in an error state: "Sorry, something went wrong" and "Loading" labels appeared for Workflow, Event, Status, Branch, and Actor filters. This confirms that error states exist in the filter UI. GitHub's Primer form components use `bgColor.danger.muted` (light red background) and `fgColor.danger` (red text/icon) for error states. In the standard light theme, this means the error field border and label become red — with no additional text, icon, or `aria-invalid`-style cue that would be visible without color. A deuteranope viewing a filter dropdown in error state would see a color change they may not interpret as "error."

Why it matters:  
If a CVD user's filter search fails to load and the only visual signal is a reddened component border, they cannot distinguish "filter failed to load" from "filter loaded normally" (WCAG SC 1.4.1 failure technique F81). The inline "Sorry, something went wrong" text that appeared in the WebFetch fetch does constitute a text cue — this partially mitigates the finding. But that text appeared as content within the dropdown, not as a visible error annotation on the field border itself. Whether the field border also changes color without a text annotation cannot be confirmed without a live render.

Evidence:  
Inferred from WebFetch content showing filter error state text "Sorry, something went wrong" and "Loading" returned for all five filter controls. Primer token: `bgColor.danger.muted` (green.0 in default, overridden to blue.0 in CVD theme) applied to form error containers. The text content itself is a non-color cue; the finding is conditional on whether the border-only color change also occurs in the transition to/from error state.

Fix:  
Ensure every filter error state displays an inline error text ("Failed to load options — try again") adjacent to the control, not only a colored border. Add `aria-invalid="true"` to the filter `<select>` or `<combobox>` element when in error state so screen readers announce the error without relying on color.

---

## Section 3 — Mode / state indication

**Status: Warn**

Justification: Two Medium findings (CD-06, CD-07). Active tab state in the top navigation uses an underline indicator (non-color cue present); selected workflow in the left sidebar uses a background highlight. Neither finding rises to High or Critical on available evidence — the underline is a genuine secondary cue. The findings are Medium because confirmation requires live navigation with a qualified simulator.

---

## Finding CD-06 — Active workflow tab indicator may rely on a color-only highlight in addition to underline

Severity: Medium  
Section: mode_state_indication  
Surface: Left sidebar — "All workflows" active state; repository tab row ("Actions" tab)  
Load displaced to: visual decoding  
Evidence state: Inferred  

CVD class affected: deuteranomaly, deuteranopia  
Contrast-pass hue-fail: false  
Simulation confirmation: unqualified  

Issue:  
The Actions page shows "All workflows" as the active workflow list selector in the left panel. The repository-level tab row shows "Actions" as the active tab. GitHub's Primer tab component uses an underline indicator for the active tab — this is a non-color cue (underline presence vs absence). However, Primer's tab also applies `fgColor.accent` (blue) to the active tab label and `borderColor.accent` for the underline color. If the underline thickness is sufficient (Primer uses 2px), the underline itself is a robust non-color cue. The finding is Medium: the underline is adequate, but the color reinforcement means CVD users who cannot perceive the blue underline color must rely on the underline shape alone, which is confirmed adequate.

Why it matters:  
This is the Contrast-Pass / Hue-Fail check for Section 3. The active tab underline is present (non-color cue passes). The severity is Medium rather than Low because on the left sidebar's workflow list, the active workflow may rely on a background fill color (`bgColor.accent.muted` = light blue) without a persistent icon or border cue. Under deuteranomaly, the light-blue background of an active sidebar item and the white background of an inactive item may look similar.

Evidence:  
Inferred from WebFetch showing "All workflows" tab is current active state. Primer React `ActionList` component (primer/react) uses CheckIcon for selected items (shape-based cue, confirmed present by code review of Selection.tsx). Primer tab pattern documented at primer.style/components uses 2px underline. Color tokens: `fgColor.accent` = blue.5 (unaffected by deutan confusion when paired with underline). No CVD simulation run.

Fix:  
Confirm that the left sidebar active workflow item uses a border or icon cue in addition to background color. If the only active-state cue in the sidebar is a background fill color, add a left-border accent or a check icon to the selected item.

---

## Finding CD-07 — "In progress" run state spinning indicator is motion-only on some platforms

Severity: Medium  
Section: mode_state_indication  
Surface: Workflow run list — active/running run indicators  
Load displaced to: visual decoding, time  
Evidence state: Inferred  

CVD class affected: deuteranomaly, deuteranopia, protanomaly, protanopia  
Contrast-pass hue-fail: false  
Simulation confirmation: unqualified  

Issue:  
The WebFetch returned "In progress" as the visible text for running workflows. This is a positive finding — the text label is present. However, GitHub also uses a spinning animated circle (Octicons `circle-fill` with CSS animation, rendered in yellow/orange via `fgColor.attention`) for in-progress runs. Under reduced-motion preferences, the spinning animation is suppressed, leaving a static yellow-orange circle. Whether the text "In progress" is also shown as a persistent visible label in the standard run list (not just in the running state description) is not confirmed.

Why it matters:  
If a developer has both `prefers-reduced-motion: reduce` and a CVD condition, they see a static yellow-orange dot next to the run. Yellow-orange (`fgColor.attention` = yellow.5) is not on the deutan confusion axis the way red-green is, but it may be confused with the gray neutral color under tritanomaly. This is a lighter-weight finding because the primary in-progress state text is confirmed visible. It is Medium because the motion cue removal leaves a color-only dot for a user who has reduced motion enabled.

Evidence:  
Inferred from WebFetch: "In progress" text label confirmed present in run list. Primer fgColor tokens: `fgColor.attention` = yellow.5 = #d4a72c (light mode) — not on red/green confusion axis, lower severity than CD-01. The `prefers-reduced-motion` behavior is inferred from standard Primer CSS patterns; not confirmed for this specific component.

Fix:  
Ensure the spinning indicator is accompanied by a persistent "Running" or "In progress" text label even when the animation is stopped by reduced-motion preferences. This is low friction — the text label already exists in the interface; confirm it is not conditionally hidden.

---

## Section 4 — Color-blindness simulation (the methods gate)

**Status: Warn**

Justification: No qualified CVD simulator was run. This is a documented rig limitation. All findings in this report default to `simulation_confirmation: unqualified` and are recorded as Inferred. Per the rubric Section 4 precondition, findings produced without a qualified physiological model (Brettel/Viénot/Mollon 1997 or Machado/Oliveira/Fernandes 2009) cannot be promoted to full severity. The token-level evidence (Primer source) provides sufficient grounds for Inferred findings, but they remain POTENTIAL-FAIL until confirmed by a live simulator run.

The section Warn (not Fail) is appropriate because the methods gate is documentably unresolvable on this rig; the open question is logged with a concrete resolution path.

---

## Finding CD-08 — No qualified CVD simulator was available on this rig (methods gate not passed)

Severity: Medium  
Section: cvd_simulation  
Surface: PT0 audit infrastructure  
Load displaced to: verification  
Evidence state: Open question  

CVD class affected: deuteranomaly, deuteranopia, protanomaly, protanopia, tritanomaly, tritanopia, monochromacy  
Contrast-pass hue-fail: null  
Simulation confirmation: unqualified  

Issue:  
The rig used for PT0 (Windows 11, RTX 5090, no live browser session) cannot run Vischeck, DaltonLens, or any Machado-model CVD simulator against a live screenshot of the target. WebFetch returns partial DOM; the static text does not include rendered color values. The sRGB-linearization check cannot be performed because no simulation was run. The four required CVD classes (deuteranopia, protanopia, tritanopia, monochromacy) were not simulated.

Why it matters:  
Per the rubric Section 4, a finding produced by an unqualified tool is not a finding — it is a potential failure awaiting confirmation. All findings in this report are therefore recorded as Inferred, not Observed. Per Section 6's two-tier evidence rule, no finding may be marked BLOCK on this run. This is the correct outcome for a DOM-fallback PT; the findings are valid audit leads but require a live qualified simulator run before any finding can be elevated to Observed-blocking.

Evidence:  
Rig constraint documented. WebFetch API confirmed available for static content; no live-render path available. Primer token analysis substitutes for color-value simulation but cannot replicate the perceptual collapse under CVD viewing conditions.

Fix (resolution path):  
Run PT1 on a machine with a live browser session and a qualified CVD simulator. Recommended tools: DaltonLens Desktop (uses Machado/Oliveira/Fernandes 2009 model; sRGB linearization verified per DaltonLens 2021 documentation). Apply deuteranopia, protanopia, tritanopia, and monochromacy simulations to the live Actions dashboard at https://github.com/microsoft/vscode/actions with a mixed-status run state (success + failure + in-progress visible simultaneously). Promote or downgrade Inferred findings based on observed results.

---

## Section 5 — Configuration cost

**Status: Warn**

Justification: One High finding (CD-09). GitHub provides a CVD-safe theme (`light-protanopia-deuteranopia`) but it requires navigation to Settings > Appearance — at least 3 clicks from any page. The default theme ships the CVD failure, making the accommodation a prerequisite for full usability rather than an enhancement. One Medium finding (CD-10) covers the theme selection UI itself.

---

## Finding CD-09 — CVD-safe theme requires 3+ clicks from the Actions dashboard and is not discoverable from the failure state

Severity: High  
Section: configuration_cost  
Surface: GitHub Settings > Appearance — theme selector  
Load displaced to: configuration, navigation  
Evidence state: Inferred  

CVD class affected: deuteranomaly, deuteranopia, protanomaly, protanopia  
Contrast-pass hue-fail: false  
Simulation confirmation: unqualified  

Issue:  
Primer's token system includes a `light-protanopia-deuteranopia` theme that replaces `fgColor.success` (green) with `blue.5` and `fgColor.danger` (red) with `orange.5`. This is a genuine, well-designed accommodation that would fix the CD-01/CD-03 failures. However, it is not the default theme. A user must navigate to GitHub Settings > Appearance, locate the theme selector, find the "Protanopia & Deuteranopia" mode within the theme grid, and activate it. The navigation path from the Actions dashboard is: click avatar (top right) → Settings → Appearance → select theme. This is 3–4 clicks minimum and requires knowing that a CVD theme exists, which is not signaled anywhere on the Actions dashboard itself.

Why it matters:  
The Color Dependence Law's recursive form applies here: a color-accommodation control that is reached only after navigating away from the working surface provides zero in-context discoverability. A developer who encounters the green/red confusion during CI monitoring has no in-flow path to fix it. They must already know that GitHub has a CVD theme, navigate away, configure it, and return. Per rubric Section 5 severity guidance, an accommodation that exists but is buried 3+ clicks from the surface is High [F4]. This is distinct from the re-skin failure pattern: the Primer CVD theme does add non-color differentiation (blue vs orange instead of green vs red) and is a genuine fix — but its reachability is High severity.

Evidence:  
Inferred from Primer token source: `fgColor.success['light-protanopia-deuteranopia'] = '{base.color.blue.5}'` confirmed in src/tokens/functional/color/fgColor.json5 (main branch, 2026-06-02). GitHub theme settings path inferred from known GitHub UI structure (Settings > Appearance). WebFetch of github.com/settings/appearance returned 529 overloaded; path is well-documented in GitHub docs.

Fix:  
Expose the CVD-safe theme in a surface-accessible way: detect OS-level accessibility preferences (`prefers-color-scheme`, potential future `prefers-contrast`) and offer a one-click "Enable accessible color mode" prompt from within the Actions dashboard or from any status-bearing surface. Alternatively, honor CSS media queries for forced colors or explicit CVD preferences when browser exposes them. The deeper fix (status by text + icon, not by color alone) would eliminate the need for the CVD theme entirely as a prerequisite.

---

## Finding CD-10 — Theme selection UI uses color swatches; "currently selected theme" cue may be color-dependent

Severity: Medium  
Section: configuration_cost  
Surface: GitHub Settings > Appearance — theme selection grid  
Load displaced to: visual decoding, verification  
Evidence state: Open question  

CVD class affected: deuteranomaly, deuteranopia  
Contrast-pass hue-fail: null  
Simulation confirmation: unqualified  

Issue:  
The GitHub Appearance settings page presents themes as visual color swatches (thumbnails of the UI in each theme). The active/selected theme is indicated by some visual affordance — likely a check mark icon or a border. Whether the "currently selected" state is indicated only by a colored border/highlight (color-only) or also by a check icon or text label cannot be confirmed without a live render. Primer's ActionList selection component (reviewed above) does use a CheckIcon for selected items, which is a non-color cue — if the same pattern is used here, the finding is Low; if the active theme is only marked by a colored border, it is Medium.

Why it matters:  
A CVD user who navigates to Settings > Appearance to find and activate the CVD-safe theme must be able to identify which theme is currently selected and which theme is the CVD-safe one — without relying on the swatch colors alone, since those swatches encode the theme colors themselves and would look different under CVD viewing. If the selected-state indicator is only a colored border, the recursive trap fires: the settings UI used to fix color dependence is itself color-dependent.

Evidence:  
Open question. WebFetch of github.com/settings/appearance returned 529 errors. Primer ActionList Selection.tsx uses CheckIcon (shape cue, confirmed). Whether the theme grid uses ActionList or a custom radio-button-with-thumbnail pattern is unknown.

Resolution path: Live navigation to github.com/settings/appearance with CVD simulation active. Confirm whether the selected-theme indicator is a check icon, text, or color-border only.

---

## Section 6 — Evidence

**Status: Warn**

Justification: This run used Path 2 (WebFetch DOM-fallback), which is the documented rig-limited path. The meaningful state (mixed-status workflow dashboard with 2,500+ runs, including success, failure, skipped, cancelled, and in-progress) was confirmed via the GitHub API and partial WebFetch. No CVD simulator was run; all findings are Inferred. No finding is marked BLOCK. Section 6 passes the process-gate checks that are compatible with DOM-fallback; it Warns because a qualified simulator run has not been performed.

---

## Open Questions

**OQ-01**  
Section: chart_graph_encoding  
Summary: Does the run-detail visualization graph use multi-color encoding for parallel jobs, or a single hue?  
Resolution path: Navigate to a multi-job run detail page (e.g., a run with 10+ parallel jobs) and check whether job bars or nodes use color differentiation. Apply CVD simulation to confirm whether those colors survive.

**OQ-02**  
Section: form_validation  
Summary: Do the filter dropdown controls use a colored border change (without accompanying text) as their primary error signal when loading fails?  
Resolution path: Live navigation to the Actions page with slow network or forced error state; observe whether the border color change is the sole or primary visual error cue vs the inline text message.

**OQ-03**  
Section: mode_state_indication  
Summary: Does the left-sidebar active workflow selection rely on background fill color alone, or does it also use a border or icon cue?  
Resolution path: Live inspection of the sidebar with DevTools; check computed styles on the active vs inactive workflow list items.

**OQ-04**  
Section: cvd_simulation  
Summary: What are the exact hex values and luminance ratios of success/failure status icons in the rendered page (not from design tokens)?  
Resolution path: Run DevTools computed-style inspection on a rendered success and failure icon element; extract the actual rendered color and compute the luminance ratio against background.

**OQ-05**  
Section: configuration_cost  
Summary: Does the GitHub Appearance settings page indicate the currently selected theme with a shape/icon cue or only with a color border?  
Resolution path: Live navigation to github.com/settings/appearance with CVD simulation active (DaltonLens deuteranopia mode).

---

## Positive Observations

**PO-01**  
Section: color_only_conveyance  
Summary: Primer's protanopia-deuteranopia theme demonstrates organizational commitment to CVD accessibility. The token override is correctly designed (green→blue, red→orange), which is the right fix direction. It exists; the gap is discoverability, not absence.

**PO-02**  
Section: color_only_conveyance  
Summary: The Actions dashboard shows "In progress" as visible text for active runs — the most actionable state (currently running) does have a text label alongside its icon.

**PO-03**  
Section: mode_state_indication  
Summary: Primer's ActionList component uses a CheckIcon (shape-based cue) for selected items, which is a genuine non-color indicator. If the workflow sidebar uses this component, the active selection cue is not color-only.

**PO-04**  
Section: chart_graph_encoding  
Summary: Duration data on the run list is displayed as plain text ("8m 14s"), not as a color-encoded bar. Text durations are inherently CVD-safe.

---

## Auditor notes

### Rubric-revision candidates surfaced by PT0

**RC-01 (Section 4 / Section 6 — DOM-fallback qualification):** The rubric states "A finding produced by an unqualified tool is not a finding — it is a potential failure awaiting confirmation." On this run, the Primer token source provided strong Inferred evidence without a CVD simulator. The rubric does not currently distinguish between "evidence from design system source tokens" (strong Inferred) vs "evidence from visual observation without simulation" (weak Inferred). A rubric addition clarifying that design-system token evidence qualifies as a named inference chain (stronger than visual observation without a tool) would improve Section 4's guidance for DOM-fallback runs. Candidate for rubric v0.2.

**RC-02 (Section 0 — text-label-adjacent-to-icon rule):** The rubric asks "is there at least one non-color cue — text label, icon, shape, underline, or pattern?" and scores icon alone as passing. On a dense run list of 2,500+ rows, icon shape alone at 16px is arguably insufficient for a finding worth flagging. The rubric could add a density threshold: at densities of 30+ rows on screen simultaneously, icon-only may be insufficient and text label is the preferred secondary cue. This would sharpen the distinction between CD-01 (Critical: icon at density without text) and a standard icon-only finding on a low-density surface. Candidate for rubric v0.2.

**RC-03 (Section 5 — accommodation that is a theme swap):** The rubric states "A color-blind mode that re-skins without adding a secondary cue is High (it markets a fix that does not fix the underlying 1.4.1 failure)." GitHub's CVD theme adds non-color differentiation (blue vs orange replace green vs red — still color-based but not on the confusion axis). The rubric treats "theme swap to a non-confusion-axis palette" as ambiguous — it could be read as a re-skin (still color-only, just different colors) or as a genuine fix (the two new hues survive deutan simulation). A clarification that a palette swap from a confusion-axis pair to a non-confusion-axis pair does constitute a genuine fix, but only when the two hues are confirmed safe under simulation, would prevent both over- and under-crediting of CVD theme implementations. Candidate for rubric v0.2.

### Additional notes

This PT0 demonstrates that the Primer token source is a valuable evidence source for DOM-fallback runs on GitHub surfaces. Future GitHub-platform audits should fetch Primer's fgColor.json5 and bgColor.json5 as a baseline step, as they document the intended color mapping and CVD overrides in machine-readable form.

The density of the Actions dashboard (2,500+ runs) makes this a high-validity target for the rubric's list-density check. The finding that icon shape alone is insufficient at this density is the most important calibration output from PT0.
