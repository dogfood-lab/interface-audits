# Remediation Priority List

**Audit:** Color Dependence Audit PT0 — GitHub Actions / microsoft/vscode  
**Date:** 2026-06-02  
**Ordered by:** severity × surface centrality × ease of fix

---

## Critical

### CD-01 — Workflow run success/failure status distinguished primarily by red/green hue

Surface: Workflow run list — status icon column (all runs on the main Actions page)  
Ease of fix: Medium. Requires adding persistent text labels to the run list row template.

The Actions run list shows thousands of rows. Each row's conclusion (success vs failure) is encoded by a colored Octicons icon (green check-circle-fill vs red x-circle-fill) without a persistent visible text label. The green (#2da44e) and red (#d1242f) used are on the classic deuteranomaly/protanomaly confusion line — both shift toward brownish-amber under simulation, making pass/fail indistinguishable for the ~8% of male developers with red-green CVD.

Add a persistent text label to every run row — "Success", "Failure", "Skipped", etc. — displayed next to the status icon as always-visible text, not only as a tooltip. The label should be styled with `fgColor.muted` or the status color (the text itself does not need to be colorless) but must be present as text in all render states. This single change satisfies WCAG SC 1.4.1 technique G14 and eliminates the Critical finding. It also resolves CD-02 and makes the CVD-safe theme a quality-of-life upgrade rather than a functional prerequisite.

---

## High

### CD-02 — Skipped and cancelled run states lack robust non-color differentiation from success

Surface: Workflow run list — all run rows with non-success conclusions  
Ease of fix: Easy. The same text-label addition that resolves CD-01 also resolves CD-02.

Five distinct conclusion states (success, failure, skipped, cancelled, action_required) appear in the vscode run list. Under monochromacy (grayscale), the neutral-gray skip/cancel icons and the green success icon lose their color differentiation; only shape remains. Without a text label, a user must memorize which icon shape means "skipped" vs "cancelled" vs "queued" at 16px scale across 30+ visible rows. Adding visible text labels per CD-01's fix resolves this finding at no additional cost.

### CD-03 — Default theme red/green pair is on the deuteranomaly confusion line (Contrast-Pass / Hue-Fail)

Surface: All surfaces using fgColor.success and fgColor.danger in default light/dark themes  
Ease of fix: Hard as a palette change; Easy as a text-label addition.

This is the explicit Contrast-Pass / Hue-Fail boundary finding. The green/red status colors pass WCAG 1.4.3 luminance contrast but collapse to a similar hue under deuteranomaly/protanomaly — the exact failure that WCAG 1.4.1 governs and automated scanners cannot detect. Primer's own engineers documented this by shipping a `light-protanopia-deuteranopia` theme with blue/orange substitutions. The nearest-term fix is not to change the default palette (which affects all of GitHub.com) but to ensure status meaning is never color-only: text + icon pairings on every status surface mean the CVD-safe theme becomes an enhancement, not a requirement.

### CD-05 — Filter dropdown error state uses color-only danger signaling

Surface: Workflow filter controls — Status / Event / Branch / Actor dropdowns  
Ease of fix: Easy. The inline error text already exists ("Sorry, something went wrong") — it just needs to be the primary and always-present signal.

When the filter controls fail to load, the Primer danger styling (red border, red text) appears as the visual error signal. The WebFetch run confirmed that inline error text is present in the error state, which partially mitigates this. The full fix is to ensure: (1) the inline error text is the primary signal, not the border color change; (2) `aria-invalid="true"` is set on the control when in error state; (3) the error text is also announced by screen readers. These are cheap defensive improvements.

### CD-09 — CVD-safe theme requires 3+ clicks and is not discoverable from the failure state

Surface: GitHub Settings > Appearance — theme selector (reached from any GitHub page)  
Ease of fix: Hard for the discovery problem; Easy for the ARIA/OS-preference approach.

A `light-protanopia-deuteranopia` theme exists that correctly fixes the red/green status confusion. A developer who has set an OS accessibility preference for red-green CVD still sees the default (broken) theme unless they navigate to GitHub Settings > Appearance and manually find the CVD theme. Add OS-level preference detection (`@media (prefers-contrast)` when the standard emerges, or browser-based color-preference headers) to automatically activate the accessible theme. In the near term, add a subtle "Having trouble telling statuses apart? Enable the accessible color theme" hint near the run list, linking directly to the relevant Settings section. This surfaces the fix at the point of failure.

---

## Medium

### CD-04 — Timing duration data is text-only; run-detail chart encoding is unconfirmed

Surface: Run-detail visualization graph (unrendered in this run)  
Ease of fix: Confirm first via OQ-01 (live session); fix only if needed.

Duration data on the run list is already text-only — no action needed there. The open question is whether the run-detail visualization graph uses color-encoded parallel job lanes. If it does, add direct text labels on the job nodes and ensure the job color palette is drawn from Primer's data-vis tokens (which are intentionally non-red-green). If not, this finding can be closed.

### CD-06 — Active workflow tab and sidebar rely on color-accent; sidebar may lack icon cue

Surface: Left sidebar workflow selector; repository tab row  
Ease of fix: Easy for tabs (underline already present); requires inspection for sidebar.

Tab active state uses a 2px underline — a robust non-color cue. The potential gap is the left sidebar's active workflow item, where a background fill (`bgColor.accent.muted`) may be the sole differentiator. Confirm via OQ-03 (DevTools inspection). If the sidebar uses ActionList, a CheckIcon is likely already present. If not, add a 2px left-border accent or an icon to the active sidebar item.

### CD-07 — In-progress spinner is motion-only under reduced-motion; static color dot remains

Surface: Run list — running workflow rows  
Ease of fix: Easy. The text label "In progress" already exists; confirm it is not conditionally hidden under reduced-motion.

The "In progress" text label was confirmed in the WebFetch run. Under `prefers-reduced-motion: reduce`, the spinning animation stops and a static yellow-orange dot remains. Confirm that the text label is always visible regardless of motion preference. If the text is conditionally shown alongside the spinner but hidden when the spinner is static, make it unconditionally visible.

### CD-08 — Methods gate not passed (no qualified CVD simulator on this rig)

Surface: PT0 audit infrastructure  
Ease of fix: Run PT1 on a machine with a live browser session and DaltonLens.

All PT0 findings are Inferred and cannot be elevated to Observed without a qualified simulator run. Schedule PT1 using DaltonLens Desktop (Machado/Oliveira/Fernandes 2009 model, sRGB linearization verified) on a live browser session showing the Actions dashboard with a mixed-status run state. Apply deuteranopia, protanopia, tritanopia, and monochromacy simulations. Promote, downgrade, or close PT0 findings based on observed results.

### CD-10 — Theme selection UI uses color swatches; selected-state indicator may be color-dependent

Surface: GitHub Settings > Appearance — theme selection grid  
Ease of fix: Easy if Primer ActionList is already used (CheckIcon present); medium otherwise.

The Appearance settings page was not renderable in this run. Confirm via OQ-05 (live navigation with CVD simulation). If the selected-theme state is indicated only by a colored border around the active swatch thumbnail, add a check icon or text "Current theme" label. This is especially important because a CVD user navigating to this page to activate the CVD-safe theme must be able to identify the current selection without relying on the color of the swatch border.

---

## Implementation sequence recommendation

1. **Immediate (1–2 days):** Add persistent text status labels to the run list row template (fixes CD-01, CD-02 simultaneously; reduces CD-03 severity to Low).
2. **Short term (1 sprint):** Audit filter dropdown error state for `aria-invalid` and ensure inline error text is the primary signal, not color border (CD-05).
3. **Medium term (1 sprint):** Add OS-accessibility-preference detection to auto-activate the CVD theme, or add in-flow discovery hint (CD-09).
4. **PT1 prerequisite:** Run a live qualified CVD simulator session before closing any finding as resolved. All current findings are Inferred; PT1 converts them to Observed or closes them.
