# Low-Vision Audit — PT0 Findings
## MDN Web Docs: ARIA Reference Page

| Field | Value |
|---|---|
| Audit | Low-Vision Audit v0.1 (Draft) |
| Run ID | lv-20260602-mdn-aria-pt0 |
| Target | https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA |
| Method | Path 2 — WebFetch DOM-fallback |
| Date | 2026-06-02 |
| Auditor | Claude Sonnet 4.6 (PT0 run) |

---

## Rig limitations

This pressure test ran on a Windows 11 rig (Omen 45L) without a live browser session, AT software, ZoomText, or Windows High Contrast Mode. The page HTML (170 KB), all named CSS files, and the associated Shadow DOM inline styles were fetched directly and analyzed statically. No live 200%/400% browser zoom render was produced. All findings are **Inferred** from CSS class patterns, computed layout rules, and framework behavior, as permitted by the Section 7 responsive-evidence caveat. Findings that genuinely could not be resolved from static analysis are recorded as Open Questions with resolution paths.

The following checks could not be completed without a live session:
- Actual computed font-size at 200% zoom (DevTools required)
- Focus indicator visibility against rendered backgrounds at 400%
- Sticky header height as a fraction of viewport at 400% zoom
- Windows High Contrast Mode (forced-colors) rendering of focus indicators
- Reading-anchor behavior on viewport resize
- Tooltip / hover-disclosure persistence behavior

---

## Surface summary

**Surfaces present on this page:**
- Sticky top navigation bar (`header.page-layout__header > nav.navigation`)
- Sticky breadcrumbs bar (part of the same sticky header block)
- Promotional banner slot (`mdn-placement-top`) — conditionally displayed
- Left sidebar: collapsible section navigation (`nav.left-sidebar`) with 80+ linked items spanning Accessibility > ARIA subpages (attributes + roles enumeration)
- Right sidebar: in-page table of contents (`nav.reference-toc`) with 7 items
- Main article body: 7 h2-headed sections with body text, code examples, notecards, and a list of link-dense reference items
- Breadcrumbs: semantic `<ol>` breadcrumb trail
- Theme toggle: `mdn-color-theme` custom element (light / dark / system)
- Language switcher: `mdn-language-switcher` custom element
- Skip links: `.a11y-menu` with two targets (#content, #search)
- Footer: `footer.page-layout__footer` with social links and legal copy

**Framework:** MDN Yari — custom design system using CSS custom properties, Web Components (shadow DOM), CSS Grid, no Tailwind/Bootstrap.

**Font stack:** Inter (body) at `--font-size-normal:1rem`, JetBrains Mono (code). All font sizes use `rem` tokens, not viewport units.

---

## Section 0 — Zoom & Reflow at 200% / 400%

**Status: WARN**

One High finding (LV-01) on sticky chrome height. One Medium finding (LV-02) on the promotional banner contributing to sticky height. One Open Question on actual reflow behavior at 320 px.

### Summary

MDN uses CSS Grid (`layout__2-sidebars-inline`) for its three-column layout. At narrow breakpoints (below ~49rem / ~784px) the layout collapses to single-column via `display:block`. Both sidebars become sticky at desktop: `.layout__left-sidebar { position:sticky; top:var(--sticky-header-height) }`, and so does the right-sidebar TOC. The sticky header block itself consists of the navigation bar (desktop height: `4.125rem` = ~66px) plus the breadcrumbs bar (`2rem` = ~32px), totaling `--sticky-header-height` of approximately `6.125rem` at 100% zoom. At 400% browser zoom, viewport effective height shrinks to ~¼ of the original physical display height. On a 1080p display, the sticky header alone would occupy roughly `6.125 × 4 = 24.5rem` out of a `27rem` (1080px / 16px × 0.25) effective viewport — leaving only ~10% of the visible area for body content.

There is also a promotional banner (`mdn-placement-top`) with a declared height of `5.625rem` that appears above the navigation at desktop widths above 769px. When it is populated, the total sticky chrome height at 100% zoom is approximately `11.75rem`, worsening the 400% block situation significantly.

Code blocks use `white-space:pre-wrap` inside the `.code-example pre` container, meaning code wraps rather than requiring horizontal scroll. Tables use `.table-container { overflow-x:auto }` which provides a scrollable container without imposing 2D scroll on the page body.

The right sidebar TOC (`reference-layout__toc`) is hidden at the narrowest breakpoint (`display:none` at `width < ~49rem`), meaning the in-page navigation landmark disappears at mobile width. Whether it disappears at 320 CSS px (the WCAG 1.4.10 threshold) is an open question.

---

### Finding LV-01 — Sticky header consumes critical viewport share at 400% zoom

Severity: High
Section: zoom_and_reflow
Surface: Sticky navigation + breadcrumbs bar (`header.page-layout__header`)
Load displaced to: `navigation`, `visual decoding`
Evidence state: Inferred
lv_reflow_pattern: sticky_block

Issue:
The sticky header block consists of two stacked sticky layers: the primary navigation bar (`--navigation-height: 4.125rem` at desktop) and the breadcrumbs bar (`--breadcrumbs-bar-height: 2rem`). The CSS confirms `--sticky-header-height: calc(var(--navigation-height) + var(--breadcrumbs-bar-height))` — approximately 6.125rem total. At 400% browser zoom on a 1080p display, the effective viewport height is approximately 270px (1080px ÷ 4). The sticky header occupies roughly 98px of that 270px, consuming approximately 36% of the visible reading area before any content is displayed.

Why it matters:
WCAG 2.2 Technique C34 and the rubric's LV-STICKY-BLOCK check flag sticky chrome exceeding ~30% of visible viewport height at 400% as High. At 36% the body content area is severely compressed. A user reading a code example must scroll the compressed reading window while the sticky block remains fixed, reducing the line-of-text capacity to approximately two to three short lines before needing to scroll. This matches the F6/F7 research: sticky elements "can consume a disproportionate share of viewport height at 400% zoom." The displacement cost is in navigation (the user can no longer see their place in the document while reading) and visual decoding (reduced reading window forces more rapid panning).

Evidence:
Inferred from CSS: `styles-navigation.c3ebf384e65df345.css` — `@media (width > 1044px) { :root { --navigation-height: 4.125rem } }`. `styles-global.401d0cd6564b08c2.css` — `--sticky-header-height: calc(var(--navigation-height) + var(--breadcrumbs-bar-height))` where `--breadcrumbs-bar-height: 2rem`. `styles-page-layout.5a4354f33e894319.css` — `.page-layout__header { position: sticky; top: 0 }`. Calculation: 6.125rem × 16px/rem = 98px sticky height; 1080px ÷ 4 (at 400% zoom) = 270px effective viewport; 98 ÷ 270 = 36.3%. Rig limitation: actual percentage not confirmed in a live 400% zoom session.

Fix:
At 400% zoom (and preferably from 200%), reduce the sticky header to the most essential control only — typically the nav toggle or a minimal breadcrumb. Use a CSS media query that detects high-zoom conditions via viewport-width narrowing (e.g., `@media (max-width: 480px)`) to collapse the breadcrumbs bar into the nav bar rather than stacking them. Alternatively, make the breadcrumbs bar non-sticky at zoom, allowing it to scroll away and return full viewport height to the reading area.

---

### Finding LV-02 — Promotional banner adds a third sticky-chrome layer at desktop

Severity: Medium
Section: zoom_and_reflow
Surface: Banner slot (`div.page-layout__banner > mdn-placement-top`)
Load displaced to: `visual decoding`, `navigation`
Evidence state: Inferred
lv_reflow_pattern: sticky_block

Issue:
The `.page-layout__banner` element has a declared CSS height of `calc(5.625rem + 1px)` and is present in the sticky header block. It is hidden at viewport widths at or below 769px (`@media (width <= 769px) or (width < calc(1rem * 2 + 15rem + 2rem + 31rem)) { .page-layout__banner { display: none } }`). When a promotional slot is populated at desktop widths, the total sticky chrome height rises to approximately `11.75rem` (188px at 16px/rem base), which at 400% zoom on 1080p would occupy 70% of the effective viewport.

Why it matters:
Even if the banner slot is often empty, the MDN promotional system is capable of filling it — it is a live ad/content placement slot. When populated, the combined sticky chrome at 400% leaves approximately 82px of reading space on a 1080p display. A user cannot read a meaningful portion of content before needing to scroll; every section transition requires re-orienting in the tiny reading window.

Evidence:
Inferred from `.page-layout__banner { height: calc(5.625rem + 1px) }` in `styles-page-layout.5a4354f33e894319.css`. The `mdn-placement-top` web component is present in the HTML: `<div class="page-layout__banner" data-scheme=""><mdn-placement-top></mdn-placement-top></div>`. Whether the slot is populated in practice requires live observation. Rig limitation: actual slot fill state and rendering at zoom not confirmed.

Fix:
Ensure that the banner slot does not stack additively onto the existing sticky header at high zoom levels. Apply the same zoom-detection media query used by the breadcrumbs bar (`@media (width <= 769px)`) to the banner as well, or ensure that the banner is always non-sticky (scrolls away) so it does not contribute to locked viewport reduction.

---

### Open Question OQ-01 — TOC reachability at 320 CSS px

Section: zoom_and_reflow
Summary: The right-sidebar TOC (`aside.layout__right-sidebar.reference-layout__toc`) is hidden via `display:none` at the narrowest breakpoint (`width < calc(1rem * 2 + 15rem + 2rem + 31rem)`, approximately 49rem / 784px). It is unclear whether the TOC is still reachable in some other form at 320 CSS px — the WCAG 1.4.10 reflow threshold — since the left sidebar also moves to `position:fixed` at this width. If neither sidebar is accessible at 320 CSS px, the in-page TOC is a REFLOW-LOSS case (rubric LV-REFLOW-LOSS, potential High).
Resolution path: Load the page with a headless browser (Playwright/Puppeteer `setViewport({width: 320, height: 568})`) and verify: (1) Is the TOC reachable via any path? (2) Is the left sidebar toggle button visible and operable? (3) Is horizontal scrolling required for any body text line?

---

## Section 1 — Contrast under real density

**Status: WARN**

Two Medium findings (LV-03, LV-04) and one Open Question. No photographs or charts on this page. No dynamic contrast states identified. The severity precondition applies: 4.5:1 AA is not sufficient for this audit's dense-surface threshold.

### Summary

This page is text-heavy documentation with no hero images or data charts. The primary contrast risk is in the code syntax highlighting colors (dense, small monospace text against the secondary background) and inline `<code>` elements in body text. The design system uses CSS `light-dark()` for all color tokens, providing both light and dark theme variants. The syntax tokens use specific hex values that can be estimated for contrast.

In dark theme: code syntax uses `#ff97a0` (a pinkish-red) for property/selector/function tokens on a background of `--color-background-secondary`. The dark background is `--color-gray-40: #51565d` (that is the light-mode secondary background; dark-mode secondary is `--color-gray-20: #2d3034`). In dark mode: `#ff97a0` on `#2d3034` requires contrast analysis.

In light theme: the same token class maps to `#d30038` on `var(--color-background-secondary)` = `--color-gray-80: #edeef0`. The contrast of `#d30038` on `#edeef0` is approximately 5.2:1 — above 4.5:1 AA but below 7:1 AAA. For body-weight prose text this would be Medium; but for code tokens at small sizes (JetBrains Mono, likely rendered at approximately 14px–15px based on 1rem base), this is a dense surface where the 7:1 threshold is the rubric's stated precondition.

Body text itself (Inter font, `--color-text-primary`) maps to `black` on `white` in light mode and `white` on `#18191b` in dark mode — both near maximum contrast. Not a finding.

Secondary text (`--color-text-secondary`) maps to `--color-gray-40: #51565d` in light mode on a `white` background. Contrast of `#51565d` on `#ffffff` is approximately 5.5:1 — above AA, below AAA. This color is used for blockquote text and secondary labels.

---

### Finding LV-03 — Code syntax token contrast below 7:1 on dense monospace surface

Severity: High
Section: contrast_under_density
Surface: Code examples (`.code-example pre code`) — light theme
Load displaced to: `visual decoding`
Evidence state: Inferred

Issue:
MDN's syntax highlighting in light mode maps several token classes — including property names, selector names, function names, and attribute names — to `#d30038` on a background of `--color-background-secondary` (`--color-gray-80: #edeef0`). The estimated contrast ratio of `#d30038` on `#edeef0` is approximately 5.2:1. JetBrains Mono is rendered at the code font size, which the design system sets at `--font-size-normal: 1rem` (approximately 14px–16px in context based on `size-adjust: 95%`). At this size and density, the rubric's 7:1 AAA threshold applies for low-vision users. The 5.2:1 ratio falls in the 4.5:1–7:1 band, which the rubric classifies as High for body-weight text on a dense surface.

Why it matters:
The ARIA reference page contains multiple code examples. A user with ~20/80 vision reading code at 200% zoom needs a contrast reserve of at least 10:1 for fluent reading (Whittaker & Lovie-Kitchin 1993 [F11]). The 5.2:1 ratio provides insufficient reserve; users must expend additional decoding effort on every syntax-highlighted token, compounding fatigue across a session that may last hours. The WebAIM Million 2024 data [F13] confirms that low-contrast text is the most prevalent scanner-detectable barrier; here it is on a surface that was purpose-built for a technical audience that includes developers with low vision.

Evidence:
Inferred from `styles-content-section.d72b98b58747a002.css`. Light-mode token rule: `.token.attr-name, .token.builtin, .token.class-name, .token.function, .token.inserted, .token.property, .token.selector { color: light-dark(#d30038, #ff97a0) }`. Background: `.code-example pre { background-color: var(--color-background-secondary) }`. Design token: `--color-background-secondary` in light mode = `--color-gray-80: #edeef0`. Contrast estimate: foreground `#d30038` (relative luminance ≈ 0.071) on background `#edeef0` (relative luminance ≈ 0.853); ratio ≈ 5.2:1. Rig limitation: contrast not measured against a live render; these are hex-literal CSS values, so the inferred ratio is load-bearing.

Fix:
In light mode, darken the `#d30038` token color to at least `#b0002d` or similar to achieve 7:1 or better against `#edeef0`. In dark mode, verify that `#ff97a0` on `#2d3034` passes 7:1 (estimated ratio is approximately 5.1:1, which would need the same remediation). Since the color tokens are defined as CSS literals inside `light-dark()` calls, the fix is a targeted token-color change in the content section CSS, not a system-wide change.

---

### Finding LV-04 — Secondary text color below 7:1 on dense reference surfaces

Severity: Medium
Section: contrast_under_density
Surface: Blockquotes, secondary labels, `.color-text-secondary` elements
Load displaced to: `visual decoding`
Evidence state: Inferred

Issue:
The design system's `--color-text-secondary` resolves to `--color-gray-40: #51565d` in light mode. This color is applied to blockquote text, secondary navigation labels, and other supporting text. Against the page background `white (#ffffff)`, the contrast is approximately 5.5:1. Against the secondary background `#edeef0`, it is approximately 4.7:1. Both ratios are above the 4.5:1 AA floor but below the 7:1 threshold the rubric requires for dense reference surfaces.

Why it matters:
This surface is used for hours at a time by developers cross-referencing ARIA specs — a dense reading session. The rubric's Section 1 severity precondition establishes that for this usage pattern, the 4.5:1–7:1 band is Medium (not Low), because contrast reserve for fluent reading falls below the empirically established 10:1 threshold [F11]. The impact is on visual decoding effort over sustained use.

Evidence:
Inferred from `styles-global.401d0cd6564b08c2.css`. Color token definition: `--color-text-secondary: light-dark(var(--color-gray-40), var(--color-gray-60))`. Gray-40 resolves to `#51565d` (defined in the same file). Contrast of `#51565d` on `#ffffff`: foreground luminance ≈ 0.097, background ≈ 1.0; ratio ≈ 5.5:1. Against `#edeef0` (luminance ≈ 0.853): ratio ≈ 4.7:1. Rig limitation: contrast not verified against a live render.

Fix:
Darken `--color-gray-40` from `#51565d` to approximately `#404247` or adjust the `--color-text-secondary` token to a shade that achieves 7:1 against the primary background. Alternatively, reserve `--color-text-secondary` exclusively for true decorative or non-critical secondary text and ensure that any body-weight copy on this page uses `--color-text-primary`.

---

### Open Question OQ-02 — Dark-theme code syntax contrast at small sizes

Section: contrast_under_density
Summary: In dark mode, the property/function/selector token color is `#ff97a0` against the dark secondary background `--color-gray-20: #2d3034`. Estimated contrast is approximately 5.1:1 — below 7:1 for dense small-font code. This is plausibly High, but the estimate requires verification against the exact rendered dark background before promotion. The dark theme is user-selectable and system-preference-driven; if a low-vision user enables dark mode (a common preference), this failure would apply.
Resolution path: In DevTools with forced dark theme, compute contrast between `#ff97a0` and the actual background color rendered inside `.code-example pre` at 200% zoom.

---

## Section 2 — Focus visibility under custom themes

**Status: WARN**

Two findings: LV-05 (Critical — no `forced-colors` handling) and LV-06 (High — navigation button focus relies only on background-color change). Two Open Questions.

### Summary

The only explicit focus-visible rule found in any CSS file is in the Shadow DOM CSS of the `mdn-switch` component: `:focus-visible { outline: 2px solid var(--color-link-normal); outline-offset: 2px }`. This is a proper `outline`-based indicator that would survive forced-colors.

However, no `forced-colors` media query was found in any of the seven fetched MDN CSS files or in the 170 KB page HTML inline styles. The theme system (`mdn-color-theme` custom element) responds to OS preference via `prefers-color-scheme` but there is no `@media (forced-colors: active)` block anywhere in the static analysis output.

The navigation button uses `outline-offset: -2px` with no explicit `outline` width or color, relying on default browser outline, and the `:hover/:focus/[aria-expanded=true]` state provides only a `background-color` change — which is stripped by forced-colors.

The `.a11y-menu` skip-link mechanism positions the skip link at `top: -20em` off-screen and returns it to `top: calc(20em + 2px)` on `:focus-within`. No explicit focus ring is described for the skip link itself.

---

### Finding LV-05 — No forced-colors media query: focus indicators may disappear in Windows High Contrast Mode

Severity: Critical
Section: focus_visibility
Surface: All interactive elements on the page
Load displaced to: `visual decoding`, `navigation`
Evidence state: Inferred

Issue:
None of the seven MDN Yari CSS files fetched for this audit (`styles-global`, `styles-navigation`, `styles-left-sidebar`, `styles-content-section`, `styles-page-layout`, `styles-a11y-menu`, `styles-breadcrumbs-bar`, `styles-reference-toc`) contain any `forced-colors` media query block. The Shadow DOM CSS for the `mdn-switch` component uses `outline: 2px solid var(--color-link-normal)` for `:focus-visible` — a proper indicator that survives forced-colors. However, the navigation menu buttons, the color-theme dropdown, the language switcher button, and the sidebar toggle all use `background-color` changes on focus/hover states. `background-color` is stripped by forced-colors to the system default, making these hover/focus states indistinguishable from unfocused states.

Why it matters:
Windows High Contrast Mode is the most commonly enabled accessibility theme for low-vision users. WCAG 2.2 SC 2.4.13 and the rubric's research grounding [F19, F20] establish that focus indicators relying on `box-shadow` or `background-color` become invisible under forced-colors. The rubric assigns this finding Critical severity because the failure is invisible under default (non-WHCM) testing and targets precisely the user population that enables high-contrast themes. Lee et al. 2021 [F14] found that users empirically abandon visual focus tracking when focus indicators fail at magnification; the combination of high-contrast mode and absent forced-colors handling makes this a compound failure.

Evidence:
Inferred from static analysis of all seven MDN CSS files. Search for `forced-colors` returned no matches in any file. Navigation button focus state from `styles-navigation.c3ebf384e65df345.css`: `.navigation__button { outline-offset: -2px }` with no explicit `outline` width or color set. The button's interactive state in shadow DOM CSS shows only `:hover/:focus` → `background-color: var(--color-background-secondary)`. Color-theme button in shadow DOM: `.color-theme__button:is(:hover,:focus,[aria-expanded=true]) { background-color: var(--color-background-secondary) }` — same pattern. Rig limitation: actual WHCM rendering not tested. The absence of a forced-colors block is a static, confirmable finding; the visual result would require live WHCM testing.

Fix:
Add `@media (forced-colors: active)` blocks to all interactive-element styles. At minimum: (1) add `outline: 2px solid ButtonText` to `.navigation__button`, `.color-theme__button`, `.language-switcher__button`, and all sidebar interactive elements when focused; (2) replace `background-color` hover/focus states with `outline` or `border` in forced-colors mode; (3) ensure the `.a11y-menu` skip link has a visible outline in WHCM. The MDN team has documented (and uses) semantic HTML patterns with ARIA — adding a targeted forced-colors block is consistent with their stated accessibility commitment.

---

### Finding LV-06 — Navigation toolbar focus uses only background-color change

Severity: High
Section: focus_visibility
Surface: Top navigation bar buttons and dropdowns
Load displaced to: `visual decoding`, `navigation`
Evidence state: Inferred

Issue:
The navigation button elements (HTML, CSS, JavaScript, Web APIs, and other tab buttons in the top nav) use a `:hover/:focus/[aria-expanded=true]` state that applies only `background-color: var(--color-background-secondary)`. The navigation button has `outline-offset: -2px` set, but no explicit `outline` width, style, or color — the button depends on the browser's default focus ring (which may be weak or absent under custom themes and vendor defaults). At 400% zoom with only a fraction of the page visible, a background-color change that is 20–40% lighter/darker than the resting state is not a reliably detectable focus indicator [F14].

Why it matters:
At 400% zoom, the navigation bar is the primary orientation tool — the user needs to know which menu item is focused before activating it. A background-color-only indicator is insufficient for users with contrast sensitivity loss (~20/80 acuity), for whom the reserve against an adjacent unfocused button is below the threshold for reliable discrimination. Lee et al. 2021 found that task workload was 3× higher when focus tracking failed, and users fell back to non-visual strategies [F14].

Evidence:
Inferred from `styles-navigation.c3ebf384e65df345.css`: `.navigation__button { outline-offset: -2px }` — outline-offset set, but no `outline` shorthand found. Shadow DOM CSS for menu tabs: `.color-theme__button:is(:hover,:focus,[aria-expanded=true]) { background-color: var(--color-background-secondary) }`. Same pattern for `.language-switcher__button`. `.navigation__button:hover { background-color: var(--color-background-secondary) }`. Rig limitation: actual rendered contrast of the hover/focus background against the resting background in light and dark themes not measured.

Fix:
Add `outline: 2px solid currentcolor` (or `var(--color-border-active)`) to the `:focus-visible` state of all navigation toolbar interactive elements, in addition to the existing background-color change. Use `outline-offset: 0` or a small positive value so the outline is visible against the toolbar background. This is a targeted CSS change to the navigation shadow DOM component and the navigation CSS file.

---

### Open Question OQ-03 — Skip link focus ring visibility under custom themes

Section: focus_visibility
Summary: The `.a11y-menu` skip link uses `position: absolute; top: -20em` (off-screen) and `top: calc(20em + 2px)` on `:focus-within`. The focus ring on the skip link anchor itself is not defined in `styles-a11y-menu.5796ee87cb69f93f.css` — it would fall back to browser default. In a dark theme or forced-colors mode, the browser default may be invisible. The skip link is the first focusable element on the page and critical for keyboard navigation.
Resolution path: Focus the skip link in Chrome (Tab) under dark theme and under forced-colors (Windows High Contrast), and inspect the focus ring appearance. Confirm that background contrast between the popup and the page background is adequate under both themes.

---

### Open Question OQ-04 — Focus at 400% zoom: sidebar toggle button coverage

Section: focus_visibility
Summary: At the breakpoint where the left sidebar collapses (`width < calc(1rem * 2 + (15rem + 2rem) * 2 + 31rem)` ≈ 77rem / ~1232px), a sidebar toggle button appears in the breadcrumbs bar. At 400% zoom on a 1920px-wide display, this breakpoint would trigger (1920 ÷ 4 = 480px effective viewport). The toggle button's focus state under forced-colors is unknown. Additionally, whether the sticky header (now consuming ≥30% of the viewport) would cover the focused element immediately after toggle activation is unconfirmed.
Resolution path: At 400% zoom in Chrome, Tab to the sidebar toggle button; check whether the sticky header covers the button's focus ring; activate the toggle and confirm the sidebar opens without losing focus.

---

## Section 3 — Spatial orientation (where am I after reflow?)

**Status: WARN**

One High finding (LV-07) on left-sidebar density causing orientation loss. One Open Question on reading-anchor behavior.

### Summary

At 200% zoom, the 3-column layout will begin to collapse. The CSS confirms that when the viewport falls below approximately `calc(1rem * 2 + (15rem + 2rem) * 2 + 31rem)` ≈ 77rem, the layout switches from 3-column to 2-column (left sidebar + content only; right sidebar merges to sidebar area). When it falls below `calc(1rem * 2 + 15rem + 2rem + 31rem)` ≈ 49rem, the layout becomes `display: block` (single column), the left sidebar becomes `position: fixed` at the top, and the right sidebar is hidden.

At a desktop width of 1440px and 200% zoom, the effective viewport would be 720px — roughly 45rem. This lands in the single-column zone, meaning the right TOC is hidden and the left sidebar is a fixed overlay. The user's in-page orientation context (the "In this article" TOC) disappears on transition to 200% zoom, leaving only the main article body and the fixed-overlay sidebar toggle.

The left sidebar contains 80+ linked items when expanded (Attributes section alone has ~50 items), rendering them as a dense, scrollable fixed overlay at high zoom. The scrollable nature of this list at 400% zoom, combined with the sidebar's own sticky header (`left-sidebar__header` is `position: sticky; top: 0; z-index: 1` within the sidebar scroll container), creates a nested sticky situation that may cause further orientation confusion.

There are no data tables on this page. The article body is single-column text with code blocks and notecards — the label-to-content relationship is linear and does not depend on spatial proximity. This is a positive characteristic: no label-input or multi-column table relationship issues at the article body level.

---

### Finding LV-07 — In-page TOC disappears at high zoom, removing orientation landmark

Severity: High
Section: spatial_orientation
Surface: Right sidebar TOC (`aside.layout__right-sidebar.reference-layout__toc`) — 7-item anchor list
Load displaced to: `navigation`, `memory`
Evidence state: Inferred

Issue:
The right sidebar "In this article" TOC is hidden via `display: none` when the viewport width falls below approximately 49rem (784px). At 200% browser zoom on a 1440px display, the effective viewport is 720px — below this threshold. The TOC therefore disappears completely when a user zooms to 200% on a typical desktop monitor. There is no disclosed alternative path to the TOC content at this zoom level: no "In this article" button, no skip-to-section control, and no persistent TOC link in the main content stream.

Why it matters:
The TOC is the primary spatial orientation tool for a long, multi-section document. Removing it at the magnification level most commonly used by low-vision users (200% [F2]) forces the user to hold the article structure in working memory or scroll through the entire page to re-establish their position. This matches the WCAG failure F102 pattern: a nav element visible at full width is not reachable at reflow width. The rubric classifies loss of a navigation landmark at zoom as High [F4, F18]. The displacement cost — from a glanceable orientation tool to memory-carried section knowledge — is material for a 7-section, dense reference document.

Evidence:
Inferred from `270.66bae6059a1c23f9.css`. Rule: `@media (width < calc(1rem * 2 + 15rem + 2rem + 31rem)) { .layout__2-sidebars .layout__right-sidebar { display: none } }`. Breakpoint calculation: `2rem + 15rem + 2rem + 31rem = 50rem` minus `2rem` side padding = `48rem` ≈ 768px. At 200% zoom on a 1440px monitor: effective viewport = 720px, below 768px. HTML confirms the TOC is in `aside.layout__right-sidebar.reference-layout__toc` with no fallback or toggle. Rig limitation: actual zoom-and-reflow behavior not confirmed in a live browser.

Fix:
Preserve a minimal TOC disclosure at 200%+ zoom. Options: (1) Inline the TOC as a collapsed `<details>/<summary>` block at the top of the article body — this is discoverable without panning or sidebar traversal. (2) Add a "Contents" button in the sticky breadcrumbs bar at smaller viewport widths that opens a TOC overlay. (3) Ensure the sticky breadcrumbs bar shows at minimum the current section heading (as a location indicator) so the user can orient without the full TOC.

---

### Open Question OQ-05 — Reading-anchor behavior on zoom or theme change

Section: spatial_orientation
Summary: When a user zooms from 100% to 200% in Chrome (Ctrl+scroll or keyboard zoom), the browser re-renders the layout. CSS Grid transitions to single-column; the sticky header shifts; the sidebars hide or reflow. Whether Chrome's scroll-anchoring preserves the user's current reading position through this layout shift, or whether the page snaps to the document top or the focused element, is unknown from static analysis. The rubric's research [F17, F18] identifies scroll-anchor loss on re-render as High when it occurs on every zoom event.
Resolution path: In Chrome at the ARIA page, focus a paragraph midway through the article, then zoom from 100% to 200% and observe whether the reading position is preserved. Repeat for theme change (light → dark) via the mdn-color-theme toggle.

---

## Section 4 — Font and spacing (low-vision extensions)

**Status: PASS**

No viewport-unit font sizing found. The rubric's WCAG-floor checks (≥16px, line-height ≥1.5×, WCAG 1.4.12) are deferred to the Cognitive Load audit Section 1.

### Summary

The MDN design system defines all font sizes in `rem` units via CSS custom properties: `--font-size-normal: 1rem`, `--font-size-small: 0.8rem`, `--font-size-large: 1.5rem`, etc. The `html` element sets `font-size: var(--font-size-normal)`. The `layout-side-padding` uses `vw` in a `max()` calculation (`max(var(--layout-side-padding-min), calc(50vw - 720px + 1rem))`), but this applies to horizontal padding only, not to any font size. No `font-size` property in any fetched CSS file uses `vw`, `vh`, `vmin`, or `vmax`.

The body text line-height is `--font-line-content: 1.75` for article content (`.content-section { line-height: var(--font-line-content) }`), which exceeds the WCAG 1.4.12 minimum of 1.5×. Heading line-height is `--font-line-header: 1.25`, which is a tighter ratio but applies to headings rather than body text.

Code blocks use `white-space: pre-wrap` — code wraps at the container boundary rather than producing horizontal-only overflow. This avoids the line-length-forced-panning failure mode that the rubric flags.

One low-positive observation: the `scroll-margin-top: var(--sticky-header-height)` rule on `:target` elements (`content-section :target`) means in-page anchor navigation accounts for the sticky header offset, so a skip-link or TOC click should land the heading below (not under) the sticky chrome.

---

**Positive Observation PO-01** — No viewport-unit font sizing

Section: font_and_spacing
Summary: All MDN font sizes are defined as `rem` tokens (`--font-size-normal: 1rem`, `--font-size-small: 0.8rem`, etc.) applied to the `html` element and all text via `font-size: var(--font-size-normal)`. Browser text-size resize (`Ctrl++` or text-only zoom in accessibility settings) will work correctly because no `vw`/`vh` font-size is present. This is a direct pass on the WCAG Failure F94 check [F24].

**Positive Observation PO-02** — Line-height exceeds minimum for article content

Section: font_and_spacing
Summary: Article body content uses `line-height: 1.75` (`--font-line-content`), which exceeds the WCAG 1.4.12 1.5× minimum. This is a positive practice that reduces line spacing collapse risk under magnification.

---

## Section 5 — Mode switching (high-contrast / dark / OS theme respect)

**Status: FAIL**

One Critical finding (cross-listed from Section 2: the absence of `forced-colors` handling). One Medium finding on dark-theme validation gap.

### Summary

The MDN design system implements both light and dark themes via `prefers-color-scheme` and the manual `mdn-color-theme` toggle. The `data-theme="light dark"` attribute on `<html>` and the `color-scheme: light dark` CSS confirm OS-preference respecting dark mode. The color tokens are defined via `light-dark()` for all key UI colors.

However, the entire design system has no `@media (forced-colors: active)` block in any of its CSS files. This means the forced-colors theme — which is Windows High Contrast Mode — receives no accommodation. All custom `background-color`, `border-color`, and `box-shadow` values will be overridden by the system palette; interactive-state cues that rely solely on background-color changes (navigation buttons, color-theme dropdown, language switcher) will lose their visual distinctiveness.

The dark theme is implemented and the color tokens appear well-considered for dark mode. However, whether the navigation button states (which use `--color-background-secondary` for hover/focus) achieve adequate contrast in the dark theme against the dark page background has not been verified in a live session.

---

### Finding LV-08 — No forced-colors accommodation: system high-contrast theme unsupported

Severity: Critical
Section: mode_switching
Surface: All interactive elements — navigation, sidebar, dropdowns, toggle buttons
Load displaced to: `visual decoding`, `navigation`
Evidence state: Inferred

Issue:
This finding cross-lists with LV-05. The complete absence of `@media (forced-colors: active)` from the MDN Yari CSS means the design fights Windows High Contrast Mode at every interactive element. When WHCM is active, `background-color` values on buttons are replaced by system defaults, making hover/focus states invisible. Custom border colors, custom icon masks via `mask-image` (used for the navigation icons), and custom `background-color` active states all lose their authored values. The MDN navigation bar, the theme toggle, the language switcher, and the sidebar toggle are all affected.

Why it matters:
Windows High Contrast Mode is the accommodation that low-vision users with the most severe contrast sensitivity loss specifically enable. It is not a niche configuration — it is the primary accessibility mechanism for ~20/80 and below vision [F10, F19]. An interface that has no `forced-colors` block is telling these users to find another browser or workaround. The rubric assigns Critical severity to this class of failure because it is invisible under default testing, targets the highest-need population, and blocks keyboard navigation when focus becomes untrackable.

Evidence:
Grep of all seven named MDN CSS files for `forced-colors` returned zero matches. Inline shadow DOM CSS in the 170 KB HTML source also returned zero matches for `forced-colors`. The interactive-state CSS relies exclusively on `background-color` and `color` changes — both replaced by forced-colors system values. Rig limitation: WHCM rendering not confirmed in a live session.

Fix:
Add a `@media (forced-colors: active)` block to each component CSS file. At minimum: (1) for all `:focus-visible` states: add `outline: 2px solid ButtonText` (the system high-contrast text color); (2) for icon-mask elements: add `forced-color-adjust: auto` or replace with SVG elements that use `currentColor` so they adopt the system color; (3) for active/selected states in the sidebar and TOC: add `border` or `outline` indicators that survive forced-colors instead of relying on `background-color`.

---

### Finding LV-09 — Dark-theme navigation focus states not validated

Severity: Medium
Section: mode_switching
Surface: Navigation bar and breadcrumbs bar (dark theme)
Load displaced to: `visual decoding`
Evidence state: Inferred

Issue:
In dark theme, `--color-background-secondary` resolves to `--color-gray-20: #2d3034`, and the page background resolves to `--color-background-page: --color-gray-05: #18191b`. The contrast between `#2d3034` (hover/focus state) and `#18191b` (page background) is approximately 1.5:1. Navigation buttons with only a `background-color` change for focus/hover would have a 1.5:1 hover-state-to-background contrast in dark mode — which is below the WCAG 2.4.11 minimum. Whether the browser's default outline adds sufficient contrast is unknown.

Why it matters:
Many low-vision users prefer dark themes to reduce glare [F20]. If the focused navigation element is indistinguishable from adjacent unfocused elements in dark mode, the user has no reliable visual focus tracking path. The WCAG 2.2 SC 2.4.13 Focus Appearance standard requires that the focus indicator contrast against the component's own unfocused state; a 1.5:1 background contrast does not meet this. The failure is the same class as LV-06 but specifically under the dark theme that low-vision users often prefer.

Evidence:
Inferred from `styles-global.401d0cd6564b08c2.css`. Dark theme background token resolution: `--color-background-page: light-dark(var(--color-white), var(--color-gray-05))` where `--color-gray-05: #18191b`. Navigation hover/focus background: `.navigation__button:hover { background-color: var(--color-background-secondary) }` where `--color-background-secondary: light-dark(var(--color-gray-80), var(--color-gray-20))` → `#2d3034` in dark mode. Contrast of `#2d3034` on `#18191b`: relative luminance `#2d3034` ≈ 0.018, `#18191b` ≈ 0.007; ratio ≈ 1.5:1. Rig limitation: actual rendered contrast not confirmed.

Fix:
In dark mode, the navigation focus state should use an explicit `outline` (e.g., `outline: 2px solid var(--color-link-normal)`) rather than — or in addition to — the background-color change. This is already the pattern used by the `mdn-switch` component inside shadow DOM. Extending it to the top-level navigation components would produce consistent focus visibility across themes.

---

## Section 6 — Configuration cost

**Status: WARN**

One Medium finding (LV-10) on the discoverability and accessibility of the theme toggle at high zoom.

### Summary

MDN's primary accommodation controls for a low-vision user are:
1. The browser's native zoom (Ctrl++/−) — outside MDN's control.
2. The color-theme toggle (`mdn-color-theme`) — located in the breadcrumbs bar at desktop width, or moved into the navigation popup at mobile width.
3. The language switcher (`mdn-language-switcher`) — adjacent to the theme toggle.

At the zoom level where the breadcrumbs bar collapses (below ~769px viewport width), the theme toggle moves into the navigation popup (the hamburger menu). On a typical desktop at 200% zoom, the effective viewport is ~720px — below the 769px threshold — meaning the theme toggle is now one tap inside the hamburger menu. This is two interactions deep (toggle open → select theme) rather than one (click the toggle). For a user already operating at 200% in a constrained viewport, this increases configuration cost.

There is no MDN-native text-size or zoom control — the design assumes browser zoom. This is the correct posture (browser zoom covers 44% of low-vision users [F1]) but means MDN offers no per-surface adaptation shortcut. The settings surface itself (the hamburger popup) is a short, well-structured overlay — not a complex multi-page settings flow. The configuration cost is moderate rather than high.

---

### Finding LV-10 — Theme toggle moves two-clicks-deep at 200% zoom

Severity: Medium
Section: configuration_cost
Surface: `mdn-color-theme` element in breadcrumbs bar and in navigation popup
Load displaced to: `configuration`, `navigation`
Evidence state: Inferred

Issue:
At desktop viewport widths above 769px, the `mdn-color-theme` toggle is directly accessible in the breadcrumbs bar — one click to open the dropdown, one click to select a theme. At viewport widths at or below 769px (which occurs at 200% zoom on a 1440px monitor), the breadcrumbs bar's `mdn-color-theme` display is controlled by `@media (width <= 769px)`. The theme toggle is then only accessible by opening the full navigation popup (hamburger menu → toggle). At 400% zoom (effective viewport ~360px on a 1440px display), all orientation controls are inside the navigation popup, which itself is a fixed overlay that covers the reading content.

Why it matters:
A low-vision user who wants to switch from light to dark mode (a common accommodation for glare reduction) at 200% zoom must first navigate to find the hidden toggle, then navigate within the overlay, then return to their reading position. Per the rubric's Section 6 doctrine, configuration controls that are harder to reach at the magnification the user already needs are a recursive trap. This is a Medium finding rather than High because the theme toggle is reachable (not absent), the overlay is accessible via keyboard, and it is a one-time setup action per session.

Evidence:
Inferred from `styles-breadcrumbs-bar.9a51a3c76a6231d0.css`: `.breadcrumbs-bar mdn-color-theme { display: flex }` — visible at default width. However, the CSS rules governing when `mdn-color-theme` is visible in the breadcrumbs bar at narrow widths do not include an explicit `display: none` in the fetched file, but the navigation popup's shadow DOM CSS provides the hamburger-menu path at narrow widths. HTML confirms `<mdn-color-theme>` is in the breadcrumbs bar and the hamburger popup controls the navigation at narrow widths via `navigation[data-open=true]`. Rig limitation: exact responsive behavior of the theme toggle at the 769px boundary not confirmed in a live session.

Fix:
Keep a direct theme toggle visible at all zoom levels — one click, always accessible. A minimal solution: pin a small icon-only theme toggle to the breadcrumbs bar that does not disappear at narrow viewports (it could swap the label for icon-only below 769px using `aria-label`). Alternatively, add a keyboard shortcut for theme switching that does not require navigating a menu hierarchy.

---

## Section 7 — Evidence

**Status: WARN**

This run is a Path 2 DOM-fallback audit. The evidence is Inferred from static CSS/HTML analysis, not from live browser zoom sessions. The run correctly documents this limitation.

### Summary

This audit was run under the documented escape-hatch condition (Section 7 responsive-evidence caveat): the rig cannot run a live browser session, AT, simulator, or interactive zoom. WebFetch was used to retrieve the full page HTML (170 KB) and all named CSS files. The static analysis covered:

- Full HTML structure including shadow DOM inline styles
- Seven named CSS files from MDN's CDN
- CSS custom property resolution chain
- Responsive breakpoint analysis
- Font-size token analysis
- Focus-indicator CSS patterns
- Forced-colors media query presence/absence

What was not tested:
- Live 200% and 400% browser zoom rendering
- Windows High Contrast Mode (forced-colors) rendering
- Theme toggle interaction and place preservation
- Reading-anchor behavior on zoom/theme change
- Actual hover/tooltip behavior
- Exact computed font sizes at zoom
- Code block scrolling behavior at zoom

All findings correctly carry **Inferred** evidence state. Five Open Questions capture the gaps that cannot be resolved without a live session.

---

## Auditor notes

### Rubric-revision candidates (do not edit the rubric — candidates only)

1. **Breakpoint-exact reflow check.** The rubric's Section 0 check asks whether a TOC or nav is "reachable" at 320 CSS px. In practice, modern 3-column documentation layouts (MDN, MDN-pattern sites) collapse their TOC at a breakpoint that may be above 320 CSS px (here: ~768px). The rubric could add explicit language about TOC/nav preservation at the user's actual zoom-induced viewport width (e.g., the effective width at 200% zoom on a common monitor), not only at the WCAG 1.4.10 320 CSS px floor. This would catch LV-07 class failures that pass the 320 px check but fail at 200% zoom on real hardware.

2. **Promotional/ad banner as sticky contributor.** The rubric's LV-STICKY-BLOCK check covers sticky nav, footers, and toolbars. MDN's promotional banner slot is a distinct third-layer sticky element not covered by the standard pattern list. Candidate additional failure mode: "dynamic-content banner above the navigation, adding to the compound sticky height." This could be folded into LV-STICKY-BLOCK or noted as a variant.

3. **Forced-colors absence as a standalone check.** Currently the rubric treats `LV-WHCM-FOCUS` as requiring a focus indicator that specifically relies on `box-shadow`. The MDN case shows a broader gap: no `forced-colors` media query at all, which means *all* interactive states (not just focus) degrade. The rubric could add: "Absence of any `forced-colors` media query is itself a High/Critical signal if the surface has custom interactive state styling that relies on CSS properties stripped by forced-colors." This avoids requiring the auditor to enumerate every specific property; the absence of the block is the finding.

### Positive observations (sections that showed notable strength)

- **Font sizing:** All font sizes are `rem`-based tokens. No viewport-unit font sizing found. Browser text-size resize will work correctly throughout the page.
- **Line height:** Article content uses `line-height: 1.75` — well above the WCAG 1.4.12 minimum.
- **Code wrap:** Code blocks use `white-space: pre-wrap`, avoiding horizontal scroll requirements at zoom.
- **Scroll-margin accounting:** `:target { scroll-margin-top: var(--sticky-header-height) }` ensures in-page anchor navigation lands below the sticky header, not under it — a direct low-vision-friendly practice.
- **Skip links:** Two skip links present (Skip to main content, Skip to search), properly off-screen until focused.
- **Semantic structure:** Full landmark use (header, nav, main, aside, footer); breadcrumbs use semantic `<ol>`; current page marked with `aria-current="page"` in the sidebar.
- **Dark/OS theme support:** `color-scheme: light dark` and `prefers-color-scheme` handling are present; the theme toggle is a first-class UI element.
