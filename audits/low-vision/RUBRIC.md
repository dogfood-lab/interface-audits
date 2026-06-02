# Low-Vision Audit

> **Low-Vision Access Law**
>
> A surface is only accessible to a low-vision user if it remains readable, navigable, and orientable at the user's real magnification — not at 100% zoom on a designer's monitor. Any layout that loses content, breaks reading flow, hides focus, or strips the user's place when text is enlarged has not "passed contrast." It has displaced the cost of seeing onto the user's eyes, working memory, and panning hand.

> This audit does not ask whether contrast passes at 100%. It asks **whether the interface still works at 200%, 400%, and beyond — under real density, real photos, real charts, and real themes**.

## Purpose

Most accessibility audits answer "does the contrast pass at default zoom?" This one answers "can a low-vision user still read, find, and stay oriented when the page is enlarged to the level they actually use?" — at the reflow layer, the contrast-under-density layer, the focus-visibility layer, and the spatial-orientation layer.

It is intended for:
- Product reviews of dense surfaces low-vision users have to operate (dashboards, data tables, editors, forms, documentation, control planes)
- Self-audits by teams who passed an axe / Lighthouse scan and assume that closes low-vision risk
- Catching the failures that are structurally invisible to scanners: text over photos, data marks on chart backgrounds, focus rings that vanish in high-contrast mode, content that disappears on reflow, and place loss under magnification

It is **not**:
- A WCAG conformance scan (use axe, Lighthouse, Pa11y for the CSS-detectable layer — see the scanner-gap framing below)
- A blindness / screen-reader audit (that is the Screen Reader Task audit's job; this audit is for users who read visually with magnification or enlargement)
- A general "looks readable" review

**Who this audit is for, in numbers.** Browser zoom (44%) and OS-level magnification (45%) are now more common among low-vision users than dedicated screen-magnifier software (19%); 47.6% regularly enlarge to 200–400% or beyond [F1, F2]. This audit therefore tests **browser zoom as the primary path**, not just dedicated magnifiers. A surface that passes in ZoomText but fails at Chrome 400% still fails this audit.

## How to use this audit

1. Define the **target**: URL, app flow, screen, or component.
2. Define the **state**: empty, normal, dense, worst-case (a dashboard with 47 active rows, a form with 30 fields, a chart with 8 overlaid series). The audit must run against the realistic dense state — this is Section 7.
3. Define the **test path**: browser zoom (preferred — covers the largest user population) and, where available, a dedicated magnifier (ZoomText / OS magnifier) for the panning-and-orientation sections.
4. Walk the eight sections in order. Each produces zero or more findings.
5. Score each section: **Pass / Warn / Fail**. A Fail in any section blocks "Low-Vision Audited" status.
6. Output findings in the format specified later in this document.

Sections are ordered from what scanners partly cover and the team most directly controls (zoom, contrast) toward what is most behavioral and scanner-invisible (orientation, mode switching, evidence).

---

## Research grounding

This rubric's load-bearing doctrine is anchored in verified empirical findings. Each line is `N. **<finding>.** <authors> <year> (<identifier>). <design implication>.` Doctrine throughout the sections cites these by number. Citations without an architectural connection are noise; every number below is referenced by at least one section.

1. **Browser zoom (44%) and OS magnification (45%) now dominate over dedicated magnifier software (19%) among low-vision users.** WebAIM 2018 (Survey of Users with Low Vision #2). Justifies testing browser zoom as the primary path (Section 0), not niche AT; a pass in ZoomText that fails at Chrome 400% is still a failure.
2. **47.6% of low-vision users regularly use 200–400%+ magnification; 17.9% use 400% or larger.** WebAIM 2018 (Survey of Users with Low Vision #2). Sets Section 0's range to the full 200%–400%+ band, not just the 200% floor; failures at 400% hit a distinct, larger-impact population, justifying the 400% severity step.
3. **SC 1.4.4 (Resize, 200%) and SC 1.4.10 (Reflow, 320 px) are distinct: 1.4.4 only forbids text being lost; 1.4.10 additionally forbids two-directional scrolling.** Eggert 2022 (yatil.net, "Resize Text & Reflow"). Splits Section 0 into two never-collapsed checks — `LV-200-LOSS` (text clipped at 200%) vs `LV-320-SCROLL` (horizontal scroll forced at 320 px); a page can pass one and fail the other.
4. **F102 enumerates five concrete disappearing-content patterns at 320 px: removed sidebar nav, label-as-placeholder-only, hidden sections with no disclosure, removed informational images, removed search.** W3C WAI 2021 (WCAG 2.1 Failure F102). Grounds Section 0's reachability check: at 320 px, every nav, search, filter, label, and section visible at full width must be *reachable*, not merely present in the DOM.
5. **The 1.4.10 exceptions (tables, maps, video, toolbars) cover only the excepted element; surrounding pagination, search, and filter controls must still reflow, and a scanner cannot tell an exempt table scroll from a non-compliant page scroll.** W3C WAI 2018 (Understanding SC 1.4.10). Grounds Section 0's table/dashboard check and its High severity: adjacent controls must each reflow independently.
6. **Sticky/fixed headers and toolbars can consume a disproportionate share of viewport height at 400% zoom, failing 1.4.10 even without horizontal scroll.** W3C WAI 2021 (WCAG 2.2 Technique C34). Grounds the `LV-STICKY-BLOCK` check in Section 0: measure the % of viewport height consumed by sticky chrome at 400%; scanners cannot simulate sticky behavior at zoom.
7. **Sticky headers, footers, cookie banners, and chatbot popovers are the primary class of content that obscures the keyboard-focused component, and magnification compounds the obstruction.** W3C WAI 2023 (WCAG 2.2 SC 2.4.11). Makes "sticky element fully covers the focused component at 400%" an automatic High in Sections 0 and 2.
8. **The only automated rule touching 1.4.4 at 200% (ACT 59br37) tests only `overflow:hidden/clip` on text nodes; it excludes SVG text, overlap, 2D scroll, sticky occlusion, and functional inaccessibility.** W3C ACT Rules CG 2026 (ACT Rule 59br37). Anchors the scanner-gap framing: any failure not reducible to "a text node clipped by overflow:hidden at 200%" is invisible to tooling, so all reflow/resize items are mandatory-manual or AT-assisted.
9. **The W3C Low Vision Task Force specifies that text blocks must rewrap to a single scroll direction; poor resize support causes columns to overlap, line spacing to collapse, and text to disappear.** Allan et al. 2016 (W3C WD-low-vision-needs). Grounds the three distinct reflow failure modes — overlap, spacing collapse, disappearance — that Sections 0 and 4 each check separately rather than as one "zoom test."
10. **The WCAG 7:1 AAA threshold (SC 1.4.6) compensates for the contrast-sensitivity loss of ~20/80 vision (users who still read without AT); 4.5:1 AA compensates only for ~20/40.** W3C WAI 2018 (SC 1.4.6); tracing to Gittings & Fozard 1986 and Arditi & Knoblauch 1994/1996. Grounds Section 1's body-text precondition: body text below 7:1 at small sizes is High for this audit, not Low; an AA pass alone is not sufficient evidence of low-vision support.
11. **Contrast reserve — displayed contrast over the user's personal threshold — must exceed 10:1 for fluent reading; reading rate degrades below it regardless of magnification.** Whittaker & Lovie-Kitchin 1993 (DOI:10.1097/00006324-199301000-00010). Justifies the AAA severity bump in Section 1 as reserve-based reasoning, not optional polish: a surface at 4.5:1 can still impose a subthreshold reserve on a pathological eye.
12. **WCAG 1.4.3 and 1.4.11 explicitly carve out photographs and real-life scenes, and scanners parse CSS/HTML not pixels — so hero text over photos and data marks on gradient chart backgrounds are structurally invisible to automated tools.** W3C WAI 2018 (SC 1.4.11; 1.4.3 incidental-text exemption). Grounds Section 1's MANUAL-ONLY sub-checklist for photos, gradients, and charts, at High severity.
13. **Low-contrast text appears on 81% of the top million home pages, averaging 34.5 instances per page — the single most prevalent scanner-detectable barrier — yet scanners still miss the photo/gradient/chart cases entirely.** WebAIM 2024 (WebAIM Million 2024). Provides the threat-model justification for treating contrast as High base severity throughout: contrast is the dominant live-web failure mode, not an edge case.
14. **8 of 10 low-vision users abandoned visual focus tracking under ZoomText and fell back on audio; task workload was 3x higher than with an accessible prototype (NASA-TLX 58.03 vs 17.55).** Lee et al. 2021 (DOI:10.1145/3457144). Makes Section 2's focus check Critical when focus is undetectable at ≥4x zoom: users empirically abandon visual navigation when focus tracking fails.
15. **High-magnification web navigation caused 5.6 back-and-forth context trips per task; a locality-preserving alternative reduced task time by 20–40%.** Billah et al. 2018 (DOI:10.1145/3173574.3173594). Grounds Section 3's "after reflow/magnification, is my prior focus still in viewport" check; severity Major when a context jump forces back-and-forth to re-establish position. *(2026-06-02: an initial draft figure of "up to 2.4×" was not confirmable in the open-access abstract during external-verifier hardening and was replaced with the PMC-confirmed 20–40% task-time-improvement range.)*
16. **Retracing — panning back to the start of the next line — consumed 18% of total reading time on average for magnifier users.** Tang et al. 2023 (DOI:10.1145/3597638.3608383). Quantifies why Section 0's single-column / short-line reflow check is not cosmetic: failures here cut effective reading speed by nearly one fifth.
17. **Magnification creates a gaze-text mismatch: text moves under the pointer as the user pans, so there is no stable one-to-one relation between gaze and document position.** Heo et al. 2024 (DOI:10.1145/3649902.3656493). Grounds Section 3's reading-anchor check: on re-render (resize, orientation change), scroll must anchor to the reading-point element, not the document top.
18. **The W3C LVTF defined "point of regard" preservation as a core requirement: when text is enlarged or formatting changes, loss of viewing location makes it very difficult to find one's place; pop-ups that extend beyond the viewport lose focus and disappear on scroll.** Allan et al. 2016 (W3C WD-low-vision-needs, §3.6.1). The standards-body articulation of the "where am I" class; grounds Section 3's post-zoom / post-theme focus-and-viewport check.
19. **Focus indicators styled with `box-shadow` become invisible in Windows High Contrast Mode, because forced-colors sets `box-shadow: none` — so a design that passes 2.4.13 under normal themes fails silently under the theme low-vision users specifically enable.** Underhill 2023 (tempertemper.net). Makes Section 2's forced-colors focus test Critical: the failure is invisible under default testing and targets the exact population that enables high-contrast.
20. **SC 2.4.13 Focus Appearance exempts browser-default indicators and only requires contrast against the component's unfocused state — not against the page background — so a conformant indicator can still vanish on a dark or custom background.** W3C WAI 2023 (WCAG 2.2 SC 2.4.13). Grounds Section 2's rule: test focus against the actual rendered background under dark/custom themes; the standard's own exemption is the gap to fill.
21. **Magnification and contrast enhancement both improve reading speed, but independently — neither substitutes for the other, and the contrast benefit generalizes across vision-loss types.** Christen & Abegg 2016 (DOI:10.16910/jemr.10.2.5). Grounds the cross-cutting rule that Sections 0 and 1 are *both* required: an interface cannot trade adequate zoom support against high contrast (or vice versa).
22. **Magnification destroys spatial locality, severing the visual relationships between labels, inputs, headings, and results that users can no longer see simultaneously.** Billah et al. 2018 (DOI:10.1145/3173574.3173594). Grounds Section 3's relationship check ("at 400%, can a user tell which label belongs to which input without panning?") at High severity — relationship loss causes task failure, not just slowdown.
23. **All 16 magnifier users in a data-table study could not hold attribute values in working memory across panning sweeps, producing 26 selection errors at baseline; a locality-preserving design cut errors to 2 and time by 72.9%.** Lee et al. 2020 (DOI:10.1145/3373625.3417030). Grounds Section 3's data-table check at High: wide tables with no sticky headers or summary rows force working-memory load across pans; rubric requires single-column reflow or per-cell visible labels at zoom.
24. **Viewport-unit font sizing (vw/vh/vmin/vmax) prevents browser text-resize from working at all, and axe/Lighthouse/Pa11y do not flag it.** W3C WAI 2018 (WCAG Failure F94). Grounds Section 4's computed-style check at Medium: test computed font-size at 200% zoom in DevTools, not authored CSS, because frameworks introduce vw sizing indirectly.
25. **Hover-triggered tooltips and popovers close before a magnifier user can pan to read them, because moving the pointer to the content removes the trigger's hover state.** BBC Accessibility 2021 (ZoomText Windows testing guide). Grounds Section 2's hover-disclosure check at High: tooltips that close on pointer-leave with no delay or persistent option are a failure; the pan-to-read failure is scanner-invisible.

---

## Boundary with the Cognitive Load audit (Section 1)

Font and spacing defaults overlap with the Cognitive Load audit's [Section 1 — Measurable Defaults](../cognitive-load/RUBRIC.md). This audit **references and extends** that section; it does not re-derive it.

- **Cognitive Load Section 1 owns the WCAG-floor checks:** body ≥ 16px web / 14pt desktop, line-height ≥ 1.5×, WCAG 1.4.12 spacing minimums, contrast ≥ 4.5:1, reflow at 320 px, 200% zoom. Run those there.
- **Low-Vision Section 4 (this audit) owns the low-vision-specific extensions:** the 7:1 body-text threshold on dense small-font surfaces [F10, F11], computed-style (not authored-CSS) verification of font units [F24], and spacing under sustained magnification. Where Cognitive Load says 4.5:1 is fine, this audit may demand 7:1 for body text on dense surfaces — that delta is the reason this section exists.

Do not duplicate the Cognitive Load Section 1 checklist here. Section 4 below states only the extensions.

---

## Section 0 — Zoom & Reflow at 200% / 400%

**Purpose.** The largest and most settled low-vision surface: whether the layout survives the magnification the user actually applies. Browser zoom is the primary test path [F1].

**Failure modes.**
- Text clipped or hidden via `overflow:hidden` / `clip` at 200% (`LV-200-LOSS`) [F3]
- Two-directional (horizontal + vertical) scrolling forced at 320 CSS px / 400% zoom (`LV-320-SCROLL`) [F3]
- Content that disappears on reflow with no alternative path: sidebar nav removed, labels replaced by placeholder-only, sections hidden without a disclosure, informational images dropped, search removed (`LV-REFLOW-LOSS`) [F4, F9]
- Surrounding controls of an exempt element (table pagination, search, column filters) failing to reflow even though the table itself is exempt [F5]
- Sticky / fixed headers, footers, or toolbars consuming a disproportionate share of viewport height at 400% (`LV-STICKY-BLOCK`) [F6, F7]
- Long line length forcing horizontal panning to read a single line of body text (retracing cost) [F16]
- Columns or sections overlapping when enlarged; line spacing collapsing [F9]

**Audit questions.**
- At **200%** browser zoom: is any text clipped or hidden by `overflow:hidden`/`clip`? (`LV-200-LOSS`) [F3, F8]
- At **320 CSS px / 400%** zoom: is horizontal scrolling required to read body content? (`LV-320-SCROLL`) [F3]
- At 320 px, enumerate every nav, search, filter, label, and section visible at full width — is each one *reachable* (via scroll, disclosure, or link), not merely present in the DOM? [F4]
- For any 1.4.10-exempt element (data table, map, video, toolbar): do the *surrounding* pagination, search, and filter controls each reflow independently? [F5]
- At 400% zoom, what percentage of viewport height is consumed by sticky chrome (nav, app header, banners, panel toolbars)? Does any sticky element fully cover the body or the focused component? [F6, F7]
- Does line length / column structure force horizontal panning to complete a single line of body text at 320 px? [F16]

**Severity hooks (this section).**
- `LV-320-SCROLL` (horizontal scroll required to read a line of body text at 320 px) — **High** (maps to WCAG 2.1 SC 1.4.10) [F3, F16].
- `LV-STICKY-BLOCK` — flag as **High** when sticky chrome exceeds ~30% of visible viewport height at 400%, or when any sticky element fully covers the focused component [F6, F7].
- `LV-REFLOW-LOSS` (content unreachable, not merely restyled, at 320 px) — **High**; **Critical** if a core-task control (primary action, the only search, required-field labels) is the lost element [F4].

**Standards / research anchors.** WCAG 2.2 1.4.4, 1.4.10; Failure F102; Technique C34; SC 2.4.11. Research: [F1, F2, F3, F4, F5, F6, F7, F9, F16].

**Automation.** No (mandatory-manual / AT-assisted). The only automated rule touching this layer tests `overflow:hidden` on text nodes alone; overlap, 2D scroll, sticky occlusion, reorganization loss, and functional inaccessibility are all outside it [F8].

---

## Section 1 — Contrast under real density (text on photos, charts, dynamic content)

**Purpose.** The contrast failures that survive a scanner pass: text over photographs, data marks on chart backgrounds, and dense small-font surfaces where the WCAG AA floor is empirically insufficient for low vision.

**Failure modes.**
- Hero / overlay text on a photograph or gradient with no scrim, band, or per-pixel computed contrast [F12]
- Chart data marks (lines, dots, bars) below 3:1 against their *local* background at some data points, even if they pass against white [F12]
- Body-weight text on dense surfaces (data tables, form labels, fine-print disclaimers) at small sizes meeting only 4.5:1, not 7:1 [F10, F11]
- Dynamic / state-driven content (toasts, validation text, live values) whose contrast is only verified in one state [F13]

**Audit questions.**
- Is text overlaid on a photograph or gradient backed by a solid color band, scrim, or sufficient *computed* contrast at every pixel of the text bounding box? (MANUAL-ONLY) [F12]
- Do chart data marks meet 3:1 against their local background at every data point, not just against the page background? (MANUAL-ONLY) [F12]
- Is body-text contrast at least **7:1** for body-weight text at or below ~16px / under 18pt (14pt bold)? [F10, F11]
- Is dynamic content (toast, inline validation, live-updating value) contrast-checked in every state it can render, not only the default? [F13]

**Severity precondition (this section).**

WCAG AA pass alone is **not** sufficient evidence of low-vision support. The threshold that governs this section is the AAA 7:1 ratio for body text on dense small-font surfaces, grounded in contrast-sensitivity loss at ~20/80 acuity [F10] and contrast-reserve theory (reserve must exceed 10:1 for fluent reading) [F11].

| Case | Default severity |
|---|---|
| Body-weight text below 7:1 at ≤16px on a dense surface (table, form, fine print) | **High** [F10, F11] |
| Text on a photograph / gradient with no scrim or sufficient computed contrast | **High** (scanner-invisible) [F12] |
| Chart data mark below 3:1 against its local background | **High** (scanner-invisible) [F12] |
| Body text 4.5:1–7:1 at normal size on a low-density surface | **Medium** |
| Dynamic content failing contrast in a non-default state only | **Medium / High** by reach |

Contrast and magnification are independent and neither substitutes for the other [F21]; an interface cannot trade high contrast against poor zoom support. This section and Section 0 are both required.

**Standards / research anchors.** WCAG 2.2 1.4.3, 1.4.6, 1.4.11. Research: [F10, F11, F12, F13, F21].

**Automation.** Partial. Scanners flag CSS-computable contrast (the dominant detectable barrier, 81% of pages [F13]) but cannot measure text over photos or marks on chart backgrounds — those are MANUAL-ONLY [F12].

---

## Section 2 — Focus visibility under custom themes

**Purpose.** Whether the keyboard-focus indicator stays visible at the user's magnification and under the themes low-vision users actually enable — not just on a default light theme at 100%.

**Failure modes.**
- Focus indicator implemented via `box-shadow`, which forced-colors strips to `none` in Windows High Contrast Mode (`LV-WHCM-FOCUS`) [F19]
- Focus ring contrasting only against the component's unfocused state, not the page background — vanishing on dark or custom backgrounds [F20]
- Focus indicator too thin or low-contrast to detect at ≥4x zoom, where only a fraction of the page is visible [F14]
- Sticky element fully covering the currently focused interactive component at high zoom [F7]
- Hover-triggered tooltip / popover that closes before the user can pan to read it [F25]

**Audit questions.**
- Under `forced-colors: active` (Windows High Contrast Mode): does the focus indicator survive, or does it rely on `box-shadow` and disappear? (`LV-WHCM-FOCUS`) [F19]
- Test focus against the *actual rendered background* — including dark and custom themes — not just against the component's unfocused color. Does it remain visible? [F20]
- At ≥4x zoom, with only a fraction of the viewport visible, is the focus indicator detectable? [F14]
- At 400% zoom, does any sticky/fixed element fully cover the currently focused component (under both Tab navigation and programmatic focus, e.g. skip-link activation)? [F7]
- Does any tooltip / popover / hover-disclosure remain visible while the user moves the pointer into it or pans the magnified viewport to read it? [F25]

**Severity hooks (this section).**
- `LV-WHCM-FOCUS` (focus relies on `box-shadow`, invisible in WHCM) — **Critical**: invisible under default testing, and it targets exactly the population that enables high-contrast themes [F19].
- Focus undetectable at ≥4x zoom — **Critical**: users empirically abandon visual focus tracking when this fails [F14].
- Sticky element fully covering the focused component at 400% — **High** [F7].
- Hover-only disclosure that closes on pointer-leave with no delay/persist — **High** (scanner-invisible) [F25].

**Standards / research anchors.** WCAG 2.2 2.4.11, 2.4.13; forced-colors media feature. Research: [F7, F14, F19, F20, F25].

**Automation.** No. Forced-colors behavior, focus visibility against rendered backgrounds at zoom, sticky occlusion, and pan-to-read tooltip behavior are all runtime, theme-dependent, and scanner-invisible [F8, F19, F25].

---

## Section 3 — Spatial orientation (where am I after reflow?)

**Purpose.** Whether the user keeps their place — their point of regard — after the page reflows, re-renders, or magnifies. This is the "where am I" failure class, well characterized in the low-vision literature.

**Failure modes.**
- After zoom, reflow, or theme change, focus is silently reset to the top of the page and the prior element leaves the viewport [F18]
- Re-render (resize, orientation change) anchors scroll to the document top instead of the reading-point element [F17]
- Magnification severs the visual relationship between a label and its input, a heading and its block — the user cannot tell which belongs to which without panning [F22]
- Wide data tables with no sticky column headers or summary rows, forcing the user to hold attribute values in working memory across pans [F23]
- A context jump that forces repeated back-and-forth panning to re-establish position [F15]
- Pop-up content that extends beyond the visible area and loses focus / disappears on scroll [F18]

**Audit questions.**
- After zoom, reflow, or theme change, does the previously active element remain within the viewport, with focus *not* silently reset to the top? [F18]
- When the page re-renders (viewport resize, orientation change), does scroll anchor to the reading-point element rather than the document top? [F17]
- At 400% zoom, can a user identify which label belongs to which input, and which heading belongs to which content block, *without panning*? [F22]
- For data tables: can a user compare two rows (or two fields) without holding values in working memory across a pan? Are there sticky column headers or visible per-cell labels at zoom? [F23]
- After any content reflow or magnification event, is the previously focused element still visible without extra panning — or does a context jump force back-and-forth navigation? [F15]

**Severity hooks (this section).**
- Focus silently reset to top / prior element off-viewport after zoom or theme change — **High** (the standards-body "point of regard" failure [F18]); **Critical** if it recurs on every reflow event and blocks task completion.
- Label–input or heading–block relationship unresolvable without panning at 400% — **High**: relationship loss causes task failure, not just slowdown [F22].
- Wide table with no sticky headers / summary rows forcing cross-pan memory — **High** [F23].
- Reading anchor lost on re-render (scroll jumps to top) — **High** [F17].

**Standards / research anchors.** W3C WD-low-vision-needs §3.6.1 (point of regard). Research: [F15, F17, F18, F22, F23].

**Automation.** No. Place-keeping, focus-after-reflow, relationship preservation under magnification, and reading-anchor behavior are all runtime and magnifier-dependent.

---

## Section 4 — Font + spacing defaults (low-vision extensions)

**Purpose.** The low-vision-specific extensions to typographic defaults. **This section references the Cognitive Load audit's [Section 1 — Measurable Defaults](../cognitive-load/RUBRIC.md) and does not duplicate it.** See the boundary note above. Run the WCAG-floor spacing and size checks in Cognitive Load Section 1; this section adds only what low vision requires beyond that floor.

**Failure modes (extensions only).**
- Body or UI font sizes defined in viewport units (vw/vh/vmin/vmax), which prevent browser text-resize from working at all [F24]
- Authored CSS that looks compliant but whose *computed* size does not scale at 200% zoom (framework-introduced vw sizing) [F24]
- Body text on dense small-font surfaces meeting only the 4.5:1 AA floor where 7:1 is empirically required [F10, F11] (severity owned by Section 1 of this audit)
- Line spacing that collapses or overlaps specifically under sustained magnification, beyond the static 1.5× check [F9]

**Audit questions.**
- Are any body-text or UI-label font sizes defined purely in viewport units? Test by zooming the browser to 200% and reading the **computed** `font-size` in DevTools — if it is unchanged, this fails. [F24]
- Does line spacing hold without collapse or overlap under sustained magnification, not just at the static WCAG 1.4.12 check? [F9]
- (Deferred to Cognitive Load Section 1: the WCAG 1.4.12 spacing minimums, the ≥16px / ≥14pt size floor, and the static 1.5× line-height check. Do not re-run them here.)

**Severity hooks (this section).**
- Font sized in viewport units, computed size unchanged at 200% zoom — **Medium** (scanner-invisible; check computed styles, not authored CSS) [F24].
- Spacing collapse / overlap appearing only under magnification — **Medium / High** by reading impact [F9].

**Standards / research anchors.** WCAG Failure F94; WCAG 2.2 1.4.12 (owned by Cognitive Load Section 1). Research: [F9, F10, F11, F24].

**Automation.** Partial. The viewport-unit failure requires reading computed styles at zoom, which axe / Lighthouse / Pa11y do not do [F24]; the static spacing floor is automatable but is owned by Cognitive Load Section 1.

---

## Section 5 — Mode switching (high-contrast / dark / OS theme respect)

**Purpose.** Whether the surface honors the OS-level and browser-level accommodations low-vision users have already turned on — high-contrast mode, dark mode, forced colors — instead of overriding or breaking under them.

**Failure modes.**
- Hard-coded colors that ignore `forced-colors` and survive into Windows High Contrast Mode, breaking the user's chosen palette [F19]
- Focus, borders, or state indicators that depend on properties forced-colors strips (`box-shadow`, background images) [F19]
- A dark theme whose focus / contrast was never tested against the rendered dark background [F20]
- Custom theme switching that resets the user's place or focus when applied [F18]
- Content disappearing or reorganizing when display settings change (the user expects all elements to remain visible) [F9]

**Audit questions.**
- Under `forced-colors: active`, does the surface adopt the system palette, or does it fight it with hard-coded colors? [F19]
- Do borders, focus, and state indicators survive forced-colors (i.e. not depend on `box-shadow` / background images that get stripped)? [F19]
- Was focus and contrast validated against the *rendered* dark / high-contrast background, not just the light default? [F20]
- When a theme is switched, do all interface elements remain visible, with the user's place and focus preserved? [F9, F18]

**Severity hooks (this section).**
- Indicator reliant on a forced-colors-stripped property (`box-shadow`), invisible in WHCM — **Critical** (cross-listed with Section 2 `LV-WHCM-FOCUS`) [F19].
- Hard-coded colors overriding the user's chosen high-contrast palette — **High** [F19].
- Theme switch that loses place / focus — **High** [F18].

**Standards / research anchors.** forced-colors media feature; WCAG 2.2 2.4.13; W3C WD-low-vision-needs (all elements remain visible after display-setting change). Research: [F9, F18, F19, F20].

**Automation.** Partial. Presence of `forced-colors` media handling can be statically checked; whether the rendered result is actually usable is judgment + runtime.

---

## Section 6 — Configuration cost

**Purpose.** Whether the controls for enabling low-vision accommodations are themselves reachable from a constrained, already-magnified state. The recursive trap: zoom / contrast / theme controls that require sight or precision to find.

**Failure modes.**
- Zoom, contrast, theme, or text-size controls buried several menus deep, unreachable at high magnification without extensive panning [F15]
- A settings surface that does not itself pass Sections 0–2 (its own controls clip at 200%, its focus vanishes, its labels are below 7:1)
- Settings that open in a new context, losing the user's place [F18]
- Per-surface configuration with no global preset, forcing reconfiguration on each panel
- Controls whose discovery cost is itself a barrier at the magnification the user already needs to navigate [F22]

**Audit questions.**
- From the main working surface at 400% zoom, how many panning sweeps and clicks reach the most-used accommodation control (text size, contrast/theme, zoom-related layout toggle)? [F15]
- Does the settings UI itself pass Sections 0–2 (reflow at 320 px, 7:1 labels, visible focus under forced-colors)?
- Does opening settings preserve the user's place, or does it reset focus / scroll? [F18]
- Can the user save and recall a named configuration, so a user who configured under strain isn't reconfiguring every visit?
- At the magnification the user already needs, can they even *find* the accommodation controls without sighted help? [F22]

**Severity hooks (this section).**
- Accommodation controls unreachable from a constrained / magnified state — **High** [F15, F22].
- Settings UI itself fails Sections 0–2 — **High** (an accessibility control that is itself inaccessible).

**Standards / research anchors.** The recursive form of the Low-Vision Access Law: configuration is itself a surface that must pass the audit. Research: [F15, F18, F22].

**Automation.** Partial. Click / pan depth to accommodation controls can be measured; control quality under magnification is judgment.

---

## Section 7 — Evidence

**Purpose.** Whether the audit tested the real dense product state at real magnification — not a marketing screenshot at 100%. The process gate.

**Failure modes.**
- All findings collected at 100% zoom on a designer's high-DPI monitor
- "We tested zoom" with no record of which level (200% vs 400%), which path (browser zoom vs ZoomText), or which state
- Contrast claims based on the design token only, never measured against the rendered photo / chart / dynamic state [F12, F13]
- Reflow claims based on a responsive preview that never reached 320 CSS px
- Single-theme testing (light only), with no forced-colors / dark / high-contrast pass [F19, F20]

**Audit questions.**
- Was the audit run at **both** 200% and 400% (320 CSS px), against the realistic dense state? [F2]
- Is the test path recorded per finding (browser zoom vs dedicated magnifier), since browser zoom covers the largest population? [F1]
- Were contrast claims measured against the *rendered* surface (photo, chart, dynamic state), not just the design token? [F12, F13]
- Was a forced-colors / Windows High Contrast pass run, given that it is the theme low-vision users most enable? [F19]
- Are screenshots in findings from the worst-case state at real magnification, not the marketing state?

**Responsive / narrow-mode evidence caveat.**

When the rig cannot render the actual narrow viewport (DPI-scaled Windows + Chrome min-window clamp, as documented in the Cognitive Load audit's PT1), **DOM and CSS-class analysis is acceptable Inferred evidence**, provided:

- Findings are marked **Inferred** (not Observed) — see [`../../shared/evidence-states.md`](../../shared/evidence-states.md)
- The rig limitation is documented in the scorecard's `context.viewport_render_limitation` field
- The inference cites the specific framework class or component pattern interpreted

The cleaner paths — preferred when available — are a non-DPI-scaled rig, a headless browser (Playwright / Puppeteer) with explicit `setViewport({width, height})`, or DevTools device emulation. The CSS-class fallback is a documented escape hatch, not a default. Browser-zoom testing (the primary path) is usually achievable without these workarounds; the caveat applies mainly to true mobile-width reflow.

**Standards / research anchors.** Research: [F1, F2, F12, F13, F19].

**Automation.** No. Process gate.

---

## Finding format

Each finding produced by this audit takes the shape defined in [`../../shared/finding-format.md`](../../shared/finding-format.md):

```
## Finding LV-{NN} — {short title}

Severity: {Critical | High | Medium | Low}
Section: {section name}
Surface: {where in the product}
Load displaced to: {one or more from the shared enum below}
Evidence state: {Observed | Inferred | Open question}

Issue:
{One paragraph describing what the interface does.}

Why it matters:
{One paragraph naming the cost in seeing, reading flow, place, or working memory.
Reference the Low-Vision Access Law if the displacement is non-obvious.}

Evidence:
{Zoom level (200% / 400%), test path (browser zoom / ZoomText), state, surface,
dataset, screenshot reference. If this line is empty, the finding fails Section 7
and is not yet a finding.}

Fix:
{One paragraph. Should restore readability, reflow, focus visibility, or place
without trading off contrast against magnification.}
```

**Severity definitions** (per [`../../shared/severity-model.md`](../../shared/severity-model.md) — Critical / High / Medium / Low; domain preconditions in this rubric):

| Severity | Meaning (low-vision specialization) |
|---|---|
| Critical | A low-vision user cannot complete a core task at their real magnification. Focus invisible in Windows High Contrast Mode (`box-shadow`-only) [F19]. Focus undetectable at ≥4x zoom [F14]. Core-task control lost on reflow with no reachable path [F4]. |
| High | Significant access displacement in common workflows: horizontal scroll forced to read a line at 320 px [F3, F16]; body text below 7:1 on a dense surface [F10, F11]; text/marks below contrast on photos or charts [F12]; label–input relationship lost under magnification [F22]; sticky chrome covering the focused component [F7]; point-of-regard lost on reflow [F18]. |
| Medium | Viewport-unit font sizing that blocks resize [F24]; spacing collapse under magnification [F9]; dynamic content failing contrast in a non-default state; body text 4.5:1–7:1 at normal size on a low-density surface. |
| Low | Polish-level. Wording, edge-case states, secondary surfaces. |

**Section-Fail threshold** (shared, unchanged from [`../../shared/severity-model.md`](../../shared/severity-model.md)): **a single Critical OR three Highs in any one section produces a section-level Fail.** Any section Fail produces an overall audit Fail.

**Load-displaced-to enum.** The `Load displaced to:` field uses one or more values from the shared enum in [`../../shared/finding-format.md`](../../shared/finding-format.md). This audit does **not** add new displacement values. Low-vision failures map onto the shared enum as follows:

| Low-vision failure | Maps to |
|---|---|
| Content disappears on reflow; user must hunt for it | `search`, `navigation` |
| Lost focus / lost place on reflow or theme change | `navigation`, `time` |
| Wide table forces holding values across a pan | `memory`, `time` |
| Label–input relationship severed by magnification | `memory`, `visual decoding` |
| Text on photo / chart / low contrast forces decoding effort | `visual decoding` |
| Horizontal panning / retracing to read a line | `time`, `visual decoding` |
| Accommodation controls buried, require configuration to use surface | `configuration`, `navigation` |
| Focus invisible in WHCM; user falls back to non-visual tracking | `visual decoding`, `navigation` |
| Hover tooltip closes before it can be panned to (content lost) | `recovery / undo`, `time` |
| Capability unavailable in a simplified / mobile mode | `feature loss` |

Findings with vague displacement targets are weaker findings. "Other" is not an option.

---

## Automatable vs judgment cut

| Section | Scanner-checkable | Skill / judgment required |
|---|---|---|
| 0. Zoom & Reflow | No — only `overflow:hidden` on text nodes is automatable [F8] | Yes (reflow loss, 2D scroll, sticky occlusion, reachability) |
| 1. Contrast under density | Partial (CSS-computable contrast [F13]) | Yes (text on photos, marks on charts — MANUAL-ONLY [F12]) |
| 2. Focus visibility under themes | No | Yes (forced-colors, focus at zoom, sticky occlusion) |
| 3. Spatial orientation | No | Yes (place-keeping, relationship preservation) |
| 4. Font + spacing extensions | Partial (static spacing — owned by Cog-Load S1) | Yes (computed-style vw check at zoom [F24]) |
| 5. Mode switching | Partial (presence of forced-colors handling) | Yes (rendered result usable?) |
| 6. Configuration cost | Partial (pan/click depth) | Yes (control quality at magnification) |
| 7. Evidence | No | Yes (process check) |

This audit is not "run axe and call it done." The only automated rule touching the reflow layer tests a single overflow case [F8]; contrast scanners miss the photo / chart / theme cases that are the highest-impact low-vision failures [F12]. The leverage is the seven sections scanners cannot touch.

---

## Running this as a skill

The skill that runs this audit lives at [`skill/SKILL.md`](skill/SKILL.md). It walks the rubric defined above and produces three outputs: `low-vision-findings.md`, `low-vision-scorecard.json`, `remediation-priority-list.md`.

**Hierarchy.** The rubric is canonical. The skill never invents criteria. If the rubric and the skill disagree, the rubric wins. Updates to audit criteria go in this file first; the skill is updated to match. Pressure-test outputs live under `evidence/<run-id>/`. The PT0 target shortlist is in [`evidence/PT0-candidates.md`](evidence/PT0-candidates.md).

---

## References

- WebAIM. (2018). *Survey of Users with Low Vision #2*. https://webaim.org/projects/lowvisionsurvey2/
- WebAIM. (2024). *The WebAIM Million 2024*. https://webaim.org/projects/million/2024
- Eggert, E. (2022). *WCAG SC 1.4.4 Resize Text & 1.4.10 Reflow*. https://yatil.net/blog/resize-text-reflow
- W3C WAI. (2021). *WCAG 2.1 Failure Technique F102*. https://www.w3.org/WAI/WCAG21/Techniques/failures/F102
- W3C WAI. (2018). *Understanding Success Criterion 1.4.10: Reflow*. https://www.w3.org/WAI/WCAG21/Understanding/reflow.html
- W3C WAI. (2021). *WCAG 2.2 Advisory Technique C34*. https://www.w3.org/WAI/WCAG22/Techniques/css/C34
- W3C ACT Rules Community Group. (2026). *ACT Rule 59br37 — Zoomed text node is not clipped with CSS overflow*. https://www.w3.org/WAI/standards-guidelines/act/rules/59br37/proposed/
- Allan, J., et al. (2016). *Accessibility Requirements for People with Low Vision* (W3C WD-low-vision-needs-20160317). https://www.w3.org/TR/low-vision-needs/
- W3C WAI. (2018). *Understanding Success Criterion 1.4.6: Contrast (Enhanced)*. https://www.w3.org/WAI/WCAG21/Understanding/contrast-enhanced.html
- Whittaker, S. G., & Lovie-Kitchin, J. (1993). *Visual requirements for reading*. Optometry and Vision Science. DOI:10.1097/00006324-199301000-00010. https://pubmed.ncbi.nlm.nih.gov/8430009/
- W3C WAI. (2018). *Understanding Success Criterion 1.4.11: Non-text Contrast*. https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- Lee, S., et al. (2021). *Real-time, structure-aware accessibility for low-vision screen-magnifier users*. DOI:10.1145/3457144. https://pmc.ncbi.nlm.nih.gov/articles/PMC8871469/
- Billah, S. M., et al. (2018). *Accessing the web with low vision* (CHI 2018). DOI:10.1145/3173574.3173594. https://pmc.ncbi.nlm.nih.gov/articles/PMC6029856/
- Tang, et al. (2023). *Reading with screen magnification* (ASSETS 2023). DOI:10.1145/3597638.3608383. https://pmc.ncbi.nlm.nih.gov/articles/PMC10923554/
- Heo, et al. (2024). *Gaze behavior under screen magnification* (ETRA 2024). DOI:10.1145/3649902.3656493. https://pmc.ncbi.nlm.nih.gov/articles/PMC11257655/
- Lee, S., et al. (2020). *TableView: data tables for low-vision users* (ASSETS 2020). DOI:10.1145/3373625.3417030. https://pmc.ncbi.nlm.nih.gov/articles/PMC7936724/
- W3C WAI. (2023). *Understanding Success Criterion 2.4.11: Focus Not Obscured (Minimum)*. https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html
- W3C WAI. (2023). *Understanding Success Criterion 2.4.13: Focus Appearance*. https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html
- W3C WAI. (2018). *WCAG Failure Technique F94* (SC 1.4.4). https://www.w3.org/WAI/WCAG21/Techniques/failures/F94
- Underhill, M. (2023). *Windows High Contrast Mode and focus outlines*. https://www.tempertemper.net/blog/windows-high-contrast-mode-and-focus-outlines
- Christen, M., & Abegg, M. (2016). *The effect of magnification and contrast on reading speed in low vision*. Journal of Eye Movement Research. DOI:10.16910/jemr.10.2.5. https://pmc.ncbi.nlm.nih.gov/articles/PMC7141081/
- BBC Accessibility. (2021). *ZoomText (Windows) testing steps*. https://bbc.github.io/accessibility-news-and-you/assistive-technology/testing-steps/zoomtext-windows.html
- World Wide Web Consortium. (2024). *Web Content Accessibility Guidelines (WCAG) 2.2*.

---

*v0.1 — Draft. Rubric authored via study-swarm (research-grounded); not yet pressure-tested. PT0 target shortlist in [`evidence/PT0-candidates.md`](evidence/PT0-candidates.md). The boundary with the Cognitive Load audit's Section 1 is resolved by reference-and-extend (see boundary note). The `simple_mode_removes_power`-analogue for this domain — a mobile / simplified mode that drops a capability low-vision users need — is a candidate to calibrate at first pressure test. See [`CHANGELOG.md`](CHANGELOG.md).*
