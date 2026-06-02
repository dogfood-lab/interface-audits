# Remediation Priority List — Low-Vision PT0 (MDN ARIA Page)

Findings ordered by severity × surface centrality. Within each severity tier, ranked by ease of fix and breadth of impact. All findings are Inferred (Path 2 DOM-fallback); fix recommendations should be validated against a live 200%/400% zoom session before shipping.

---

## Critical (2 findings)

These failures block low-vision users operating in Windows High Contrast Mode. They affect every page on MDN, not just this one.

---

### LV-05 / LV-08 — No forced-colors media query

**Finding IDs:** LV-05 (Section: focus_visibility), LV-08 (Section: mode_switching) — same root cause, cross-listed.

**Headline:** MDN Yari has no `@media (forced-colors: active)` block in any CSS file. Interactive states relying on background-color changes become invisible in Windows High Contrast Mode.

**Suggested fix:**

Add a `@media (forced-colors: active)` block to the following CSS files: `styles-navigation`, `styles-left-sidebar`, `styles-breadcrumbs-bar`, `styles-a11y-menu`, and the shadow DOM CSS for `mdn-color-theme` and `mdn-language-switcher`. Within this block, for every interactive element that currently uses `background-color` as its focus/hover indicator:

1. Add `outline: 2px solid ButtonText` on `:focus-visible`. This uses the system high-contrast foreground color, which WHCM guarantees is visible.
2. For icon-masked elements (navigation icons use `mask-image`): add `forced-color-adjust: auto` so icons adopt the CanvasText system color.
3. For the navigation button active/selected states (e.g., current menu tab): replace `background-color` with `border-inline-start: 3px solid ButtonText` or an equivalent border-based indicator.

This is a targeted addition that does not change the light/dark theme appearance. It is the highest-impact single change possible: it fixes every interactive element on every MDN page for the most constrained low-vision population.

---

## High (4 findings)

These findings cause significant access displacement in common workflows.

---

### LV-01 — Sticky header consumes ≥36% of viewport at 400% zoom

**Headline:** The stacked sticky navigation bar + breadcrumbs bar total ~6.125rem, consuming approximately 36% of the effective viewport at 400% zoom on a 1080p display.

**Suggested fix:**

Use a CSS `@media (max-width: 480px)` or equivalent zoom-detection query to collapse the breadcrumbs bar into the navigation bar at high-zoom conditions. Rather than two separate sticky rows, condense to a single sticky row at small viewport widths:

- Merge the breadcrumbs into the navigation bar or replace them with a "current section" text indicator.
- Alternatively, make the breadcrumbs bar non-sticky (remove `position:sticky`) at viewport widths below 768px so it scrolls away, returning full viewport height to reading content.

The fix should reduce the sticky chrome to at most the navigation bar alone (4.125rem) at high zoom — approximately 24% of the 270px viewport at 400% on 1080p, within the rubric's ~30% guideline.

---

### LV-03 — Code syntax token contrast ~5.2:1 in light mode (dense monospace)

**Headline:** The property/function/selector token color `#d30038` on background `#edeef0` achieves ~5.2:1 contrast — below the 7:1 threshold required for dense small-font surfaces on this audit.

**Suggested fix:**

Darken the light-mode syntax token to a shade that achieves 7:1 against `#edeef0` (luminance ≈ 0.853). The required foreground luminance for 7:1 is `(0.853 + 0.05) / 7 - 0.05` = approximately `0.08` max luminance. A suitable replacement in the red hue family: `#a6001f` (approximate luminance 0.04) achieves roughly 7.7:1 against `#edeef0`. Update the `light-dark(#d30038, ...)` value in `styles-content-section.d72b98b58747a002.css`. Separately verify the dark-mode token `#ff97a0` against the dark secondary background (see OQ-02).

---

### LV-06 — Navigation toolbar focus uses only background-color

**Headline:** The navigation menu tab buttons show focus only via a background-color change, which (a) disappears in forced-colors mode and (b) provides insufficient cue at 400% zoom where only a fraction of the toolbar is visible.

**Suggested fix:**

Add `:focus-visible { outline: 2px solid currentcolor; outline-offset: 0 }` to the shadow DOM CSS for `mdn-dropdown`, and to the `.navigation__button` rule in `styles-navigation`. This adds a visible focus ring that works under all themes (it inherits the button's text color, which survives forced-colors as `ButtonText`). The `outline-offset: 0` ensures the ring is visible within the button boundaries and does not clip against adjacent tab buttons.

---

### LV-07 — In-page TOC disappears at 200% zoom

**Headline:** The "In this article" TOC is hidden (`display:none`) at the ~768px viewport breakpoint, which is triggered at 200% zoom on a 1440px monitor. No alternative path to in-page navigation is provided at that zoom level.

**Suggested fix:**

Inline a minimal TOC disclosure at the top of the article body, visible at all viewport widths. Implementation options (in descending order of implementation effort):

1. **Preferred:** Add a collapsed `<details>/<summary>` block at the top of the article body, above the first `<section>`. The summary text "In this article" contains the same 7 links as the right-sidebar TOC. This is always visible, does not depend on viewport width, and does not require any navigation UI changes.

2. **Alternative:** In the sticky breadcrumbs bar (which is always visible at zoom), show a "Contents" icon-button at widths below 768px that opens the existing sidebar as an overlay. This reuses the existing sidebar toggle infrastructure.

3. **Partial fix:** Show the current h2 heading text in the sticky breadcrumbs bar as a location indicator at all widths. This does not provide navigation to other sections but does give the user their current position.

---

## Medium (3 findings)

These findings cause measurable decoding effort or configuration friction in common workflows.

---

### LV-04 — Secondary text color ~5.5:1 (blockquotes, labels, secondary copy)

**Headline:** `--color-text-secondary` resolves to `#51565d` in light mode, achieving ~5.5:1 on white — below the 7:1 threshold for dense reference copy.

**Suggested fix:**

Darken the `--color-gray-40` token from `#51565d` to approximately `#404247` (luminance ≈ 0.053; contrast on white ≈ 7.2:1). Verify that the change does not introduce contrast issues against secondary backgrounds. Since `--color-gray-40` is used widely in the design system, an alternative is to introduce a dedicated `--color-text-secondary-accessible: #3d4045` for low-vision contexts, applied to all user-facing secondary body text while preserving the original value for purely decorative elements.

---

### LV-09 — Dark-theme navigation focus states not validated (~1.5:1)

**Headline:** In dark mode, the navigation button hover/focus background (`#2d3034`) against the page background (`#18191b`) is estimated at ~1.5:1 — below the WCAG 2.4.11 minimum for non-text contrast of interactive components.

**Suggested fix:**

In the navigation shadow DOM CSS and `styles-navigation`, for the dark-theme `:focus-visible` state, replace or supplement the `background-color` indicator with `outline: 2px solid var(--color-link-normal)` (which resolves to `--color-blue-80: #a4cefe` in dark mode — a high-contrast blue on dark backgrounds). The existing `background-color` change can remain as an additional cue; the outline provides the contrast-compliant focus signal.

---

### LV-10 — Theme toggle moves two clicks deep at 200% zoom

**Headline:** At 200% zoom on a 1440px monitor, the viewport falls below 769px, causing the `mdn-color-theme` toggle to disappear from the breadcrumbs bar. Users must open the hamburger navigation to access it — two interaction steps deeper than at 100% zoom.

**Suggested fix:**

Pin a minimal icon-only theme toggle to the breadcrumbs bar at all viewport widths. The toggle button is 1–2 rem wide at icon-only size. Use `aria-label="Switch color theme"` (which is already the label on the full toggle). At viewports below 769px, hide the label text but keep the icon visible. This requires a targeted addition to `styles-breadcrumbs-bar.css`:

```css
@media (width <= 769px) {
  .breadcrumbs-bar mdn-color-theme {
    display: flex; /* override any display:none at this breakpoint */
  }
}
```

Verify that the resulting icon-only button has adequate touch/click target size (minimum 24px, recommended 44px).

---

## Low (0 findings)

No Low severity findings produced in this run. All identified issues reached Medium or above.

---

## Prioritized action plan

| Priority | Finding | Owner area | Estimated effort |
|---|---|---|---|
| 1 | LV-05/LV-08 — Add forced-colors media queries | Yari CSS system-wide | Medium (template change, cascades to all pages) |
| 2 | LV-07 — Inline TOC at article top | MDN doc template / Yari component | Low (add details/summary block to reference layout template) |
| 3 | LV-06 — Add outline to nav toolbar focus | Navigation shadow DOM component | Low (targeted CSS addition) |
| 4 | LV-03 — Darken code syntax token | styles-content-section.css | Low (single token value change, verify dark mode too) |
| 5 | LV-01 — Reduce sticky chrome height at high zoom | styles-navigation + styles-breadcrumbs-bar | Medium (responsive layout change) |
| 6 | LV-09 — Dark-theme nav focus outline | Navigation component CSS | Low (add outline to dark-theme focus state) |
| 7 | LV-04 — Darken secondary text token | Design system color tokens | Low–Medium (token change, audit all uses) |
| 8 | LV-10 — Keep theme toggle visible at 200% zoom | styles-breadcrumbs-bar.css | Low (one CSS rule) |
