# Motion Sensitivity Audit

> **Motion Sensitivity Law**
>
> A surface that moves without the user's consent, and gives no way to stop it, displaces the cost of that motion onto the user's vestibular system — dizziness, nausea, migraine, and in the worst case a seizure. Honoring the motion the user has already asked their operating system to reduce is the floor, not a feature. Flashing above the seizure threshold is not a design choice; it is harm.

> This audit does not ask whether the animation "looks smooth." It asks **whether a user who is dizzy, migraine-prone, or photosensitive can use the surface without being made sick by it** — under autoplay, under parallax, under scroll-jacking, and under the operating-system preference the user has already set.

## Purpose

Most accessibility audits stop at contrast and labels. This one answers a different question: *does this surface move in ways that physically harm a sizable fraction of its users, and does it respect the one signal those users can send the page in advance?* It tests the flash/seizure layer (the only hard-physical-harm class in any of these audits), the vestibular-trigger layer (parallax, zoom, spin, scroll-jacking), the `prefers-reduced-motion` respect layer (does the OS preference actually suppress the motion, including JS-driven motion), and the configuration-cost layer (is safety automatic, or buried behind a toggle the undiagnosed majority will never find).

It is intended for:
- Product reviews of motion-heavy surfaces (marketing/landing pages, hero animations, onboarding, dashboards with live-animated widgets, anything with parallax or scroll-jacking)
- Self-audits by teams who passed an axe / Lighthouse scan and assume that closes motion risk — it does not; most motion failures are scanner-invisible
- Catching the failures that physically harm users: flashing above the seizure threshold, autoplay with no stop, parallax with no reduce block, and reduce blocks that JS quietly ignores

It is **not**:
- A WCAG conformance scan (axe / Lighthouse detect almost none of this; the flash, vestibular, and JS-reintroduction layers are runtime and pixel-level)
- A blindness / screen-reader audit (that is the [Screen Reader Task audit](../screen-reader-task/RUBRIC.md)'s job)
- A general "is the animation tasteful" review — taste is not the axis; *consent and physical safety* are

**Who this audit is for, in numbers.** Roughly 35% of US adults aged 40+ have measurable vestibular dysfunction [F24]; about 1 in 20 adults experiences vestibular vertigo in any given year [F30]; vestibular migraine adds a separate 1–3% cohort for whom visual motion is a documented migraine trigger [F32]. Most of these people are undiagnosed — symptom prevalence runs near 48% while formal diagnosis sits below 5% [F31] — so the audit cannot rely on users self-identifying. On the flash side, light flashes can provoke a seizure in up to 1 in 4000 people [F33]. This is a mass-population concern, not an edge case.

## How to use this audit

1. Define the **target**: URL, app flow, screen, or component.
2. Define the **state**: the realistic state the user lands in — hero on first paint, the loading state, the carousel mid-rotation, the scroll-jacked section mid-scroll. Motion is a *temporal* property; capture it in motion, not as a still.
3. Define the **test path**: fetched CSS/HTML (the `@media (prefers-reduced-motion: reduce)` block is grep-able in stylesheets), live browser observation with the OS Reduce Motion toggle flipped, and — for any flashing or fast/large-area media — an analysis tool (PEAT for web, Harding FPA for broadcast/gaming) per Section 6.
4. Walk the seven sections in order. Each produces zero or more findings.
5. Score each section: **Pass / Warn / Fail**. A Fail in any section blocks "Motion-Sensitivity Audited" status.
6. Output findings in the format specified later in this document.

Sections are ordered by physical-harm severity first (flash/seizure is S0, the only hard-physical-harm class), then by the breadth of the vestibular-trigger surface, then toward the behavioral and process layers (configuration cost, evidence) that scanners cannot touch.

---

## Research grounding

This rubric's load-bearing doctrine is anchored in verified empirical findings. Each line is `N. **<finding>.** <authors> <year> (<identifier>). <design implication>.` Doctrine throughout the sections cites these by number. Citations without an architectural connection are noise; every number below is referenced by at least one section.

1. **WCAG SC 2.3.3 (Level AAA) states that interaction-triggered movement beyond essential scrolling — explicitly parallax — can trigger vestibular reactions (dizziness, nausea, migraine, bed rest) and requires a mechanism to disable non-essential animation unless it is essential to functionality or information.** W3C WAI (AGWG) 2023 (https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html). Anchors S3: any non-essential interaction-triggered animation (parallax, scroll-jacked movement) with no disable mechanism and no `prefers-reduced-motion` handling is an automatic High in S0/S2/S3; the "essential" carve-out is the exception clause.
2. **James Craig (WebKit) enumerates the vestibular trigger motion patterns — scaling/zoom, spinning/vortex, multi-speed/multi-directional (parallax) movement, dimensionality/plane shifts, and peripheral motion — and explains zoom triggers symptoms because it gives the illusion of moving forward or backward in physical space; direct user-controlled manipulation (pinch-to-zoom) is exempt because it is predictable.** Craig (WebKit) 2017 (https://webkit.org/blog/7551/responsive-design-for-motion/). Provides the S2 trigger taxonomy verbatim: zoom/scale, spin, parallax, plane-shift, peripheral movement each become a named flagged pattern; the "predictable, user-controlled" test sets the exemption rule (pinch-to-zoom is not a finding, auto-playing scale/spin/parallax are).
3. **Val Head establishes the area threshold qualitatively — a small button with a 3D rotation probably will not cause trouble but a full-screen wipe covering the entire screen likely would; animations on non-moving properties (opacity, color, blur of stationary elements) are unlikely to be problematic — isolating large-area spatial movement as the critical factor, and cites ~8M US adults with chronic balance problems plus 2.4M with chronic dizziness.** Head (A List Apart) 2015 (https://alistapart.com/article/designing-safer-web-animation-for-motion-sensitivity/). Grounds the S0 movement-area severity scale: large-area transform/translate motion is High; small localized transforms and opacity/color-only animation are Low/Pass. Justifies "movement area as % of viewport" as the primary S0 severity axis.
4. **Diels, Ukai & Howarth found that forced eccentric gaze (16 degrees off the focus of expansion) while viewing radial optic flow increased accumulated motion-sickness ratings by ~20% versus free-viewing or central fixation, showing peripheral radial/zoom optic flow measurably raises sickness.** Diels et al. 2007 (PMID:17679562). Empirically grounds why peripheral/full-bleed radial/zoom motion is worse: gives S2 a measured ~20% effect for off-center radial flow, supporting higher severity for viewport-spanning zoom/scale backgrounds that fill the unavoidable periphery.
5. **Keshavarz, Riecke, Hettinger & Campos review the VIMS literature and conclude vection (illusory self-motion) is a likely necessary precursor to visually induced motion sickness, and that large field of view, higher stimulus speed, acceleration/velocity changes, and dual-axis (vs single-axis) motion each increase VIMS severity.** Keshavarz et al. 2015 (DOI:10.3389/fpsyg.2015.00472). Gives S2 three measurable severity multipliers beyond raw area — speed, acceleration/easing changes, and multi-axis motion — making large+fast+multi-axis (spinning zooming parallax hero) the canonical automatic-High example.
6. **Fulvio, Ji & Rokers found that an individual's psychophysical sensitivity to motion-parallax cues (from small head movements) predicted the severity of their motion sickness in VR — better parallax detection correlated with worse symptoms — implicating multi-speed parallax motion as a per-individual trigger.** Fulvio et al. 2021 (DOI:10.1016/j.entcom.2021.100423). Empirical basis for treating parallax as a first-class S2 trigger and for the premise that susceptibility varies per user, justifying the S5 configuration-cost argument that honoring `prefers-reduced-motion` is the only safe default rather than guessing a universal-safe level.
7. **web.dev's accessibility motion guidance states developers cannot predict what level of movement will cause issues and that even a small amount of motion can trigger dizziness, blurred vision, or worse, and pairs this with the WCAG limit of no more than three flashes per second.** web.dev (Chrome) Learn Accessibility 2022 (https://web.dev/learn/accessibility/motion). Defeats the "small enough to be safe" rationalization: because no universally safe threshold exists, S3 makes a missing `prefers-reduced-motion` path a finding regardless of how subtle the motion is, and anchors the >3 flashes/sec automatic-High sub-rule.
8. **The A11Y Project primer (Gaebel) recommends never auto-starting animations, sliders, videos, or rapid movement; always allowing motion to be turned off at any point; and giving an advance indicator of movement before a user acts; and cites ~35% of US adults aged 40+ having experienced vestibular dysfunction.** Gaebel (The A11Y Project) 2013 (https://www.a11yproject.com/posts/understanding-vestibular-disorders/). Grounds S4 (auto-playing media): any animation/slider/video/carousel that starts automatically is an automatic finding, and the ~35% prevalence sizes the affected population to justify High rather than Advisory.
9. **Keshavarz et al. document the key negative case: vection is necessary but NOT sufficient for VIMS — many people perceive strong illusory self-motion without becoming sick, and dual-axis rotation produces more sickness than single-axis despite similar vection — so motion strength alone does not predict harm; sensory-conflict magnitude does.** Keshavarz et al. 2015 (DOI:10.3389/fpsyg.2015.00472). Prevents an S2 false-positive rule: do not score every motion-evoking animation as High. Weight axis-count and conflict over mere vection, so a single-axis gentle pan is Low while decoupled multi-axis parallax is High — calibrating S0/S2 tiers instead of a blanket flag.
10. **WCAG SC 2.3.1 (Level A) is met one of two ways: content flashes no more than three times in any one-second period, OR the flash stays below the general and red flash thresholds — so more than three flashes/sec in a non-trivial area is the bright-line failure.** W3C WAI (Kirkpatrick et al., eds.) 2018 (https://www.w3.org/WAI/WCAG21/Understanding/three-flashes-or-below-threshold.html). Sets the S0 hard rule: any element flashing more than 3 times in any 1-second window that is not below the area/luminance threshold is an automatic finding (Level A failure); the "3 per second" count is the load-bearing trigger checked first.
11. **The general flash threshold is a pair of opposing changes in relative luminance of 10% or more where the darker image is below 0.80; the area exemption applies only when concurrent flashes occupy no more than 0.006 steradians (~25% of any 10-degree visual field, ~341x256 px at 1024x768).** W3C WAI (WCAG 2.0 Working Group) 2016 (https://www.w3.org/TR/UNDERSTANDING-WCAG20/seizure-does-not-violate.html). Gives S0 its exact numeric escape hatch: a flash is safe-by-area only if under ~25% of a 10-degree field (~341x256 px reference) AND under the 10% luminance delta; the audit flags any flash exceeding both as a hard failure rather than relying on subjective brightness.
12. **The red flash threshold is separate and stricter: any pair of opposing transitions involving a saturated red — saturated red defined as R/(R+G+B) >= 0.8 and the change in (R-G-B)x320 > 20 — is hazardous even when the luminance change alone would pass.** W3C WAI (WCAG 2.0 Working Group) 2016 (https://www.w3.org/TR/UNDERSTANDING-WCAG20/seizure-does-not-violate.html). Makes saturated-red flashing a distinct trigger in S0: a red strobe that passes the luminance test still fails the red-flash test, so the audit tests red transitions independently rather than folding them into one brightness check.
13. **WCAG SC 2.3.2 Three Flashes (Level AAA) removes every exception: no flashing above three times per second is permitted regardless of brightness or size — even a single small below-threshold flash fails at AAA.** W3C WAI 2023 (https://www.w3.org/WAI/WCAG22/Understanding/three-flashes.html). Defines the AAA tier of S0: products targeting AAA or safety-critical/medical/children's contexts get a Medium finding for ANY >3 Hz flash even when small or dim, since 2.3.1's area/luminance exemptions no longer apply.
14. **WCAG technique G15 (sufficient for 2.3.1) calls for running an analysis tool over captured content and removing or modifying content that violates the general or red flash thresholds, and names the Trace Center PEAT and Harding FPA tools as related resources.** W3C WAI 2023 (https://www.w3.org/WAI/WCAG22/Techniques/general/G15). Establishes S6 Evidence: a passing claim on flashing media is only credible if backed by a tool analysis pass; the audit treats unverified motion-heavy media as an open finding, not a pass — visual inspection is insufficient evidence. (G15 lists the tools as related resources rather than mandating one per medium; the strict PEAT-vs-Harding split is normative on the PEAT page, [F15].)
15. **PEAT (Photosensitive Epilepsy Analysis Tool — free, Trace Center / University of Maryland, engine by Cambridge Research Systems) analyzes web/software content for luminance and red flash sequences against the general and red flash thresholds; it is explicitly prohibited for commercial broadcast/film/home-entertainment/gaming content, where Harding FPA must be used.** Trace Center / University of Maryland 2020 (https://trace.umd.edu/peat/). Names the concrete verifier the audit recommends for S6: web UI motion/video should be checked with PEAT (free), and the audit flags the failure mode of using PEAT on gaming/broadcast content (prohibited) where Harding FPA is correct.
16. **Jordan & Vanderheiden's gap analysis reports the shared SDR luminance threshold across standards as a >=20 cd/m2 opposing change with the darker state below 160 cd/m2, and that the empirical EEG response peaks near 16 Hz with ~90% of photosensitive individuals responding — motivating the conservative 3 Hz design limit.** Jordan & Vanderheiden 2024 (DOI:10.1145/3694790). Grounds why S0's 3 Hz limit is a floor not the danger zone: the EEG-confirmed peak is ~16 Hz, so flashing in 15–20 Hz escalates severity; the cd/m2 figures give a measurable luminance rule for non-web/native UI.
17. **Jordan & Vanderheiden document that the legacy 25%-of-screen area threshold (set for 1990s CRT viewing distances) under-protects modern close-viewed devices, where WCAG's 10-degree field-of-view (0.006 steradians) rule is more protective, and that PWM/OLED dimming can reintroduce hazardous flicker missed by frame-by-frame analysis.** Jordan & Vanderheiden 2024 (DOI:10.1145/3694790). A documented S0 failure mode: full-bleed flashing on a phone/VR viewport is more dangerous than the same flash on a 1990s TV, so the audit applies the WCAG 10-degree-field rule (not the looser 25%-of-screen rule) and flags near-fullscreen flashes on close-viewed devices as a hard failure.
18. **W3C Technique C39 "Using the CSS prefers-reduced-motion query to prevent motion" is a sufficient technique for 2.3.3; its test passes if the animation is essential OR is suppressed under (prefers-reduced-motion: reduce) — it addresses non-essential motion only.** W3C WAI (AGWG) 2023 (https://www.w3.org/WAI/WCAG21/Techniques/css/C39). Makes "has a (prefers-reduced-motion: reduce) block disabling non-essential motion" the primary S3 pass condition; absence of any reduce block on a page with decorative animation is an automatic High, presence satisfies the sufficient-technique bar.
19. **prefers-reduced-motion has roughly 94% global support; Safari shipped it first (10.1, 2017), Firefox in 63 (2018), Chrome in 74, and Edge in 79 — broad cross-browser coverage existed by early 2020.** Deveria et al. (caniuse) 2026 (https://caniuse.com/prefers-reduced-motion). Removes "support is too new/spotty" as an excuse: S3 treats a missing reduce block as a defect; with ~94% support and 6+ years of availability the query can be required unconditionally and its absence rated a real (not theoretical) gap.
20. **The WebKit announcement warns against wholesale removal: if a vestibular-trigger animation conveys essential meaning, removing it entirely may make the interface confusing or unusable, and advises serving an alternate simpler animation or another visual indicator; it names scaling/zoom, spinning/vortex, multi-speed parallax, and peripheral motion as triggers.** Craig (WebKit) 2017 (https://webkit.org/blog/7551/responsive-design-for-motion/). Grounds the "replace, don't remove" rule: S3 should flag reduce blocks that delete state-change feedback (e.g. removing a success animation leaving no indicator) as a correctness failure, not a pass.
21. **Google's web.dev guidance (Steiner) documents that CSS media queries do not govern JavaScript-driven motion — the developer must listen for changes via window.matchMedia('(prefers-reduced-motion: reduce)') and manually stop in-flight animations — and that CSS hacks cannot stop motion initiated by the Web Animations API.** Steiner 2019 (https://web.dev/articles/prefers-reduced-motion). Defines the "motion re-introduced by JS" failure mode: a page with a correct CSS reduce block that still runs JS/WAAPI/canvas animation ignoring matchMedia is an automatic High in S3, since the CSS block creates a false impression of compliance. S3 must check JS libraries (Framer Motion, GSAP, Lottie, canvas loops) for a matchMedia guard.
22. **CSS-Tricks (Coyier) documents a partial-honoring failure: a global reset like animation-duration: 0.001s under reduce can have the opposite effect and make animations super fast and dizzying; the recommended approach keeps helpful contextual/fade transitions and removes only jarring movement.** Coyier 2022 (https://css-tricks.com/nuking-motion-with-prefers-reduced-motion/). Catches the over-aggressive global override anti-pattern: S3 flags blanket animation:none / near-zero-duration resets as a Medium because they can produce faster, more dizzying motion and strip functional feedback; the correct reduce target is cross-fade/opacity, not duration:0.
23. **MDN shows the canonical correct pattern: override default animation inside (prefers-reduced-motion: reduce) by swapping a motion animation for a non-translating alternative (e.g. replacing a scaling pulse with an opacity "dissolve"), and documents the OS mappings the query reads (macOS/iOS Reduce Motion, Windows Show animations / Animation effects).** MDN contributors (Mozilla) 2025 (https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion). Defines what S3 should expect inside a reduce block — substitution of opacity/color transitions for translate/scale/rotate, not deletion. Because the query maps to an OS toggle, S3 can recommend S5 treat the OS preference as the zero-cost default and a visible in-page toggle as the AAA override.
24. **Agrawal et al. found that 35.4% of US adults aged 40+ (~69 million) had measurable vestibular dysfunction by objective postural testing in NHANES 2001-2004, and symptomatic individuals had a 12-fold increase in the odds of falling.** Agrawal et al. 2009 (DOI:10.1001/archinternmed.2009.66). Sets the threat-model population floor: with ~1 in 3 adults over 40 affected, motion triggers are a mass-population concern not an edge case, so any motion-triggering UI pattern defaults to at least High severity and `prefers-reduced-motion` is a required check, not best-practice.
25. **WCAG SC 2.2.2 Pause, Stop, Hide (Level A) requires that any moving/blinking/scrolling content that starts automatically, lasts more than five seconds, and is presented in parallel with other content have a mechanism to pause, stop, or hide it unless the movement is essential.** W3C WAI 2023 (https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html). S4: an auto-carousel or auto-playing media that runs >5s alongside other content with no pause control is an automatic High (Level-A failure).
26. **WCAG SC 2.2.2 explicitly exempts loading animations (a preloader is not presented in parallel with other content), so loading spinners are not covered by 2.2.2.** W3C WAI 2023 (https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html). S1: ground spinner/shimmer rules in 2.3.3 / the vestibular trigger taxonomy, not 2.2.2, since the Level-A pause requirement does not apply to standalone loading motion.
27. **A controlled parallax-scrolling study (N=86) found no significant UX gains except perceived fun (p=.008); two participants experienced motion sickness and one became nauseated, and the authors urged screening participants for motion sickness and vestibular disorders.** Frederick, Mohler, Vorvoreanu, Glotzbach 2015 (UXPA Journal v10 i2). S2: parallax delivered no measured benefit beyond "fun" while inducing sickness, so parallax without a reduced-motion fallback is High — the cost/benefit is documented as net-negative for sensitive users.
28. **NN/g (Sara Paul) found a majority of usability-study participants were at least mildly disoriented by scrolljacking, with the worst issues when scroll manipulation was combined with required reading; task-oriented users were far less tolerant, and the article advises avoiding scrolljacking on mobile.** Sara Paul (NN/g) 2023 (https://www.nngroup.com/articles/scrolljacking-101/). S2: scroll-hijacking is an automatic finding, escalated to High on mobile or when combined with reading content.
29. **Runyon found that on the Notre Dame homepage carousel (2012-13) only ~1% of visitors clicked any carousel feature, with 84% of those clicks landing on slide 1 and the other four slides receiving ~4% each.** Erik Runyon 2013 (https://erikrunyon.com/2013/01/carousel-interaction-stats/). S4: auto-rotating carousels combine a motion trigger with near-zero effectiveness (~1% CTR, later slides effectively hidden), so the audit recommends user-controlled non-auto carousels and flags auto-rotation as both an accessibility and effectiveness defect.
30. **Neuhauser et al. found in a German population-based neurotologic survey that vestibular vertigo had a lifetime prevalence of 7.4%, a one-year prevalence of 4.9%, and an annual incidence of 1.4%, concluding the symptom is common and its healthcare impact underestimated.** Neuhauser et al. 2005 (DOI:10.1212/01.wnl.0000175987.59991.3d). Establishes a defensible severity baseline for S2: roughly 1 in 20 adults experiences vestibular vertigo in any given year, so documented vertigo/nausea-provoking patterns (parallax, large-area scroll-jacking, autoplay zoom) score High by default.
31. **Bisdorff et al. reported very high one-year symptom prevalences (vertigo 48.3%, unsteadiness 39.1%, dizziness 35.6%), with 59.2% of participants reporting at least one such symptom in the prior 12 months, while the combined prevalence of formally diagnosed vestibular disorders was well below 5% — indicating most affected people are undiagnosed.** Bisdorff et al. 2013 (DOI:10.3389/fneur.2013.00029). The gap between ~48% symptom prevalence and <5% diagnosis means the audit cannot rely on users self-identifying as vestibular patients, grounding S5 (configuration cost): the reduced-motion baseline must be honored automatically via `prefers-reduced-motion`, not gated behind an opt-in toggle the undiagnosed majority would never find.
32. **Paz-Tamayo et al.'s systematic review found vestibular migraine population prevalence ranging from 0.89% (Germany) to 2.70% (US), an overall estimate of ~1-3%, making it the most common cause of recurrent spontaneous vertigo and frequently underdiagnosed.** Paz-Tamayo et al. 2020 (DOI:10.3389/fgene.2020.00954). Adds a second large affected cohort (1–3%) distinct from peripheral vestibular disease, where visual motion is a documented migraine trigger, justifying S0/S4 rules flagging autoplaying motion and parallax as High because they can precipitate a migraine attack, not merely momentary discomfort.
33. **The Epilepsy Foundation's updated review (Fisher et al.) reports that light flashes, patterns, or color changes can provoke seizures in up to 1 in 4000 persons, with highest risk from flashes brighter than 20 cd/m2 at 3-60 Hz (particularly 15-20 Hz) covering at least 10-25% of the visual field, and from saturated-red flashes or oscillating stripes.** Fisher et al. 2022 (DOI:10.1111/epi.17175). Provides the quantitative seizure threshold that makes flash content a hard Critical (not merely High): because the harm is a physical seizure, content exceeding ~3 flashes/sec, >20 cd/m2, or red-flash thresholds over 10–25% of the field is an automatic Critical in S0/S2 — these Hz/luminance/area numbers become the measurable pass/fail line.

---

## Relationship to the Low-Vision audit

This audit is net-new motion / vestibular territory; it does not re-derive any existing audit. There is one adjacency worth naming explicitly:

The [Low-Vision audit's Section 5 — Mode switching](../low-vision/RUBRIC.md) and **this audit's Section 3 (`reduced_motion_respect`) are siblings** — both check whether a surface honors an operating-system accessibility preference the user has already set — but they are **non-overlapping**:

- **Low-Vision Section 5** owns `forced-colors` / high-contrast / dark-theme respect (the color/contrast OS preferences).
- **Motion-Sensitivity Section 3** (this audit) owns `prefers-reduced-motion` respect (the motion OS preference).

A surface can pass one and fail the other; they read different media queries, target different physiology, and have different correct-implementation patterns. Do not duplicate — cross-reference only. If a finding touches both (e.g. an animated focus indicator that also relies on `box-shadow`), file the motion half here and the color half in Low-Vision, and cross-list via `secondary_section`.

The **flash / seizure thresholds (WCAG 2.3.1 / 2.3.2)** in Section 0 are unique to this audit and touch no existing audit. No other audit in this repo addresses photosensitive seizure risk; that layer is owned here exclusively.

---

## Section 0 — Animation

`animation`

**Purpose.** The hardest-physical-harm layer in any audit in this repo: large-area movement, transitions, and — above all — flash/seizure thresholds. This section catches flashing that can trigger a seizure (a physical-harm Critical, not a discomfort finding), saturated-red flashing (tested independently of luminance), and large-area transform motion. Flash is checked *first* because it is the only failure here that is dangerous on first paint, before the user can react.

**Failure modes.**
- Content flashing more than three times in any one-second window over the area + luminance threshold (`MO-FLASH`) [F10, F11, F33]
- Saturated-red flashing that passes the luminance test but fails the red-flash test independently [F12]
- Flashing in the 15–20 Hz band (the EEG-confirmed peak), more dangerous than the bare 3 Hz floor implies [F16]
- Near-fullscreen flashing on a close-viewed phone/VR viewport, where the legacy 25%-of-screen rule under-protects and the 10-degree-field rule applies [F17]
- Large-area transform/translate animation (full-screen wipes, viewport-spanning hero movement) covering a high % of the viewport [F3, F5]
- Any >3 Hz flash at all, when the product targets AAA / safety-critical / medical / children's contexts (2.3.2 removes the area/luminance exemptions) [F13]

**Audit questions.**
- Does any element flash **more than three times in any one-second window**? If so, does the flash stay below BOTH the general flash threshold (10% luminance delta, darker state < 0.80) AND the area exemption (~25% of a 10-degree field, ~341x256 px reference)? If it exceeds either, it fails. (`MO-FLASH`) [F10, F11]
- Tested **independently of luminance**: does any flash involve a saturated red transition (R/(R+G+B) >= 0.8, change in (R-G-B)x320 > 20)? [F12]
- Is any flashing in the 15–20 Hz band, or brighter than ~20 cd/m2 over 10–25% of the field? [F16, F33]
- Is the flashing surface near-fullscreen on a phone or close-viewed device (apply the 10-degree-field rule, not 25%-of-screen)? [F17]
- For large-area transform motion: what percentage of the viewport does the moving area cover? Is it a full-screen wipe / viewport-spanning movement, or a small localized transform? Opacity/color/blur of stationary elements is not a finding. [F3]
- Does the product target AAA / a safety-critical context, making ANY >3 Hz flash a finding even if small/dim? [F13]

**Severity hooks / preconditions (this section).**
- `MO-FLASH` (content flashing > 3 times/sec that exceeds the general flash threshold OR the red-flash threshold OR the area exemption) — **automatic Critical**. The harm is a physical seizure, not discomfort [F33]. Test the red-flash threshold independently of luminance — a red strobe that passes the brightness test still fails [F12].
- Large-area transform motion (full-screen wipe, viewport-spanning translate/scale) — **High**; small localized transforms and opacity/color-only motion — **Low / Pass** [F3, F9].
- Any >3 Hz flash on an AAA / safety-critical target, even below the area/luminance threshold — **Medium** (2.3.2 tier) [F13].

**Standards / research anchors.** WCAG 2.2 SC 2.3.1 (Level A), SC 2.3.2 (Level AAA); technique G15. Research: [F3, F5, F9, F10, F11, F12, F13, F16, F17, F33].

**Automation.** Partial. Flash analysis is automatable *with a tool* (PEAT / Harding FPA over captured frames — see S6), but only over rendered, captured content; a static CSS scan cannot compute luminance/red-flash transitions or movement area. Large-area transform motion is judgment-assisted (the CSS declares the transform; the viewport-coverage percentage and speed require observation).

---

## Section 1 — Loading motion

`loading_motion`

**Purpose.** Spinners, skeleton shimmer, and continuous loading motion. This is its own section because of a precise standards boundary: WCAG 2.2.2 *exempts* standalone preloaders (a loading animation is not "presented in parallel with other content") [F26], so loading motion is grounded in the **vestibular-trigger taxonomy and 2.3.3**, not 2.2.2. The catch is continuous/looping loading motion with no reduced-motion alternative.

**Failure modes.**
- A continuously spinning/rotating loader with no `prefers-reduced-motion` alternative [F26, F2]
- Skeleton shimmer that sweeps a large area continuously, or at speed, with no reduce path [F3, F5]
- A loader that is also a vestibular trigger by shape (vortex/spin, scaling pulse) rather than a simple opacity fade [F2]
- Loading motion that runs for a long, indefinite period (slow connections), compounding exposure [F7]

**Audit questions.**
- Is the loading motion continuous/looping (spinner, shimmer) rather than a discrete opacity fade? [F26]
- Is there a `prefers-reduced-motion: reduce` alternative for the loader (a static or fading state), or does it spin regardless of the OS preference? [F2, F26]
- By shape, is the loader a vestibular trigger (spin/vortex, scaling pulse) or a benign opacity/color change? Opacity-only is Pass [F3].
- Does the shimmer sweep a large viewport area, or is it confined to small content placeholders? [F3, F5]

**Severity hooks / preconditions (this section).**
- Continuous looping loading motion (spinner/shimmer) that is a vestibular trigger by shape AND has no reduce alternative — **Medium** (escalates to **High** if large-area or fast) [F2, F3, F5]. Loading motion is *not* covered by 2.2.2's pause requirement [F26]; do not score it under S4.
- Opacity-only / benign fade loaders — **Pass**.

**Standards / research anchors.** WCAG 2.2 SC 2.3.3 (Animation from Interactions); SC 2.2.2 exemption for preloaders [F26]. Research: [F2, F3, F5, F7, F26].

**Automation.** Partial. Presence of a CSS `@keyframes` rotation/translate on a loader class and the presence/absence of a reduce override are grep-able; whether the shape is a vestibular trigger and the area covered is judgment.

---

## Section 2 — Vestibular trigger patterns

`vestibular_trigger_patterns`

**Purpose.** The named trigger taxonomy: scaling/zoom, spinning, multi-speed parallax, plane-shift, peripheral/large-area motion, scroll-jacking [F2]. Severity scales with movement **area, speed, acceleration, and axis-count** — multi-axis is worse than single-axis — not with the mere presence of motion.

**Failure modes.**
- Auto-playing scale/zoom backgrounds (illusion of moving through space) [F2, F4]
- Spinning/vortex decorative motion [F2]
- Multi-speed parallax (decoupled layers moving at different rates) [F2, F6, F27]
- Plane-shift / dimensionality transitions [F2]
- Peripheral / large-area / full-bleed motion filling the unavoidable periphery [F3, F4]
- Scroll-jacking — hijacking native scroll to drive choreographed motion [F28]
- Fast or accelerating motion, or decoupled multi-axis motion (the worst case) [F5, F9]

**Audit questions.**
- Is there auto-playing scale/zoom, spin, parallax, plane-shift, or peripheral large-area motion? (The user-controlled, predictable case — pinch-to-zoom — is exempt [F2].)
- Is the parallax multi-speed (decoupled layers)? Parallax delivered no measured UX benefit beyond "fun" while inducing sickness [F27], and per-individual parallax sensitivity predicts symptom severity [F6].
- Does the page scroll-jack — override native scroll to drive motion? Escalate on mobile or when combined with required reading [F28].
- How large is the moving area (% of viewport), how fast is it, does it accelerate, and how many axes does it move on? Weight axis-count and area, not mere presence [F5, F9].
- Is the motion single-axis and gentle (Low), or decoupled multi-axis / large-area / fast (High)? [F9]

**Severity hooks / preconditions (this section).**
- Documented vertigo/nausea patterns — large-area parallax, scroll-jacking, autoplay zoom/spin — default to **High**, given ~35% of adults 40+ have measurable vestibular dysfunction [F24] and ~1 in 20 adults/year experience vestibular vertigo [F30].
- **Single-axis gentle motion is Low; decoupled multi-axis / large-area / fast motion is High.** Weight axis-count and area, not the mere presence of motion — vection is necessary but not sufficient for sickness, so a blanket flag over-fires [F9].
- Scroll-jacking — **High** on mobile or when combined with reading; otherwise **Medium** [F28].

**Standards / research anchors.** WCAG 2.2 SC 2.3.3. Research: [F2, F3, F4, F5, F6, F9, F24, F27, F28, F30].

**Automation.** Partial. Parallax (decoupled `background-attachment: fixed` / transform-on-scroll), scale/spin `@keyframes`, and scroll-jacking JS handlers are partially detectable in CSS/JS; the *severity* (area, speed, axis-count) is observation-and-judgment.

---

## Section 3 — prefers-reduced-motion respect

`reduced_motion_respect`

**Purpose.** Does the surface honor `(prefers-reduced-motion: reduce)` — the one signal a motion-sensitive user can send the page in advance, mapped to an OS toggle [F23]? This is the highest-leverage section: with ~94% browser support and 6+ years of availability [F19], a missing reduce block is a real defect, not a theoretical one. **Sibling to Low-Vision Section 5** (which owns `forced-colors`); see the relationship note above.

**Failure modes.**
- No `@media (prefers-reduced-motion: reduce)` block at all on a page with decorative motion (`MO-NO-REDUCE`) [F1, F18, F19]
- Motion re-introduced by JS / WAAPI / canvas that ignores `matchMedia` even though a CSS reduce block exists (the CSS block creates a false impression of compliance) (`MO-JS-REINTRO`) [F21]
- An over-aggressive global reset (`animation-duration: 0.001s` / blanket `animation: none`) that makes motion *faster and more dizzying*, not safer [F22]
- A reduce block that *deletes* functional state-change feedback instead of *substituting* a fade — leaving no indicator of what changed [F20, F23]

**Audit questions.**
- Is there a `@media (prefers-reduced-motion: reduce)` block that suppresses the non-essential motion? Absence on a page with decorative animation is an automatic finding (`MO-NO-REDUCE`) [F18, F1]. Support is ~94% / 6+ years — "too new" is not a defense [F19].
- Does any JS / WAAPI / canvas / library motion (Framer Motion, GSAP, Lottie, canvas loops) check `window.matchMedia('(prefers-reduced-motion: reduce)')` and stop in-flight, or does it run regardless of the CSS reduce block? (`MO-JS-REINTRO`) [F21]
- Is the reduce block a blanket `duration: 0` / `animation: none` reset (which can make motion faster and more dizzying), or a targeted swap to opacity/cross-fade? [F22]
- Inside the reduce block, is functional feedback *substituted* (motion → opacity dissolve) or *deleted* (success animation removed leaving no indicator)? Deletion of functional feedback is a correctness failure, not a pass [F20, F23].

**Severity hooks / preconditions (this section).**
- `MO-NO-REDUCE` (no reduce block on a page with non-essential decorative motion) — **High** [F1, F18]; the C39 sufficient-technique bar is "essential OR suppressed under reduce" [F18].
- `MO-JS-REINTRO` (CSS reduce block present but JS/WAAPI motion ignores `matchMedia`) — **High**: the CSS block creates a false impression of compliance [F21].
- Over-aggressive global reset (`duration: 0` makes motion faster/dizzier) — **Medium** [F22].
- Reduce block that deletes functional feedback instead of substituting a fade — **Medium / High** by feedback importance [F20, F23].

**Standards / research anchors.** WCAG 2.2 SC 2.3.3; technique C39. Research: [F1, F7, F18, F19, F20, F21, F22, F23].

**Automation.** Partial. The *presence* of a `prefers-reduced-motion` media block is grep-able in fetched CSS (the single most load-bearing automatable signal in this audit). Whether JS/WAAPI/canvas motion *also* honors the preference, and whether the reduce block substitutes vs deletes feedback, is runtime + judgment.

---

## Section 4 — Auto-playing media

`autoplaying_media`

**Purpose.** Auto-starting animation, video, carousels, and sliders — motion the user did not initiate and may not be able to stop. The line WCAG draws is sharp: auto-playing motion that runs > 5 s in parallel with other content must have a pause/stop/hide mechanism [F25]; the broader accessibility guidance is stronger still — never auto-start [F8].

**Failure modes.**
- Auto-playing animation/video that runs > 5 s with no pause/stop/hide mechanism (Level A failure) (`MO-AUTOPLAY`) [F25]
- Auto-rotating carousels / sliders — a motion trigger combined with near-zero effectiveness (~1% CTR, later slides effectively hidden) [F29]
- Any auto-start motion at all — the A11Y Project baseline is "never auto-start" [F8]
- Autoplay zoom/spin/parallax (compounds S2 trigger with S4 autoplay), a documented migraine precipitant [F32]

**Audit questions.**
- Does any animation/video/carousel start automatically and run more than 5 s in parallel with other content? Is there a pause/stop/hide mechanism? (`MO-AUTOPLAY`) [F25]
- Is there an auto-rotating carousel/slider? (Auto-rotation is both an accessibility defect and an effectiveness defect — ~1% engagement, later slides near-invisible [F29].)
- Does ANY motion auto-start without the user initiating it? The baseline guidance is never auto-start [F8].
- Does the autoplay motion also carry an S2 vestibular trigger (zoom/spin/parallax)? Cross-list to S2; this can precipitate a migraine attack, not merely momentary discomfort [F32].

**Severity hooks / preconditions (this section).**
- `MO-AUTOPLAY` (auto-playing motion > 5 s, in parallel, no pause/stop/hide) — **High** (Level-A failure) [F25].
- Auto-rotating carousel — **High** (trigger + near-zero effectiveness) [F29].
- Any other auto-start motion under 5 s — **Medium** (the "never auto-start" baseline) [F8]; escalate to **High** if it also carries an S2 trigger [F32].

**Standards / research anchors.** WCAG 2.2 SC 2.2.2 Pause, Stop, Hide (Level A). Research: [F8, F25, F29, F32].

**Automation.** Partial. Autoplay attributes (`<video autoplay>`, carousel auto-rotate config, CSS infinite `@keyframes`) are partially detectable in fetched markup; whether a pause/stop/hide control exists and is reachable is observation.

---

## Section 5 — Configuration cost

`configuration_cost`

**Purpose.** Is motion safety honored *automatically* via the OS preference, or gated behind an in-page toggle the undiagnosed majority will never find? The recursive trap of the Motion Sensitivity Law: the safe state must be the default, not an opt-in.

**Failure modes.**
- The only motion-safety control is a custom in-page "reduce animations" toggle; the page ignores `prefers-reduced-motion` [F31, F18]
- Motion safety is opt-in (default = full motion) rather than honoring the OS preference as the baseline [F23, F6]
- A toggle buried deep in settings, requiring the user to endure the motion to reach the control that stops it [F8]
- Per-surface toggles with no persistence, forcing reconfiguration on every page [F31]

**Audit questions.**
- Is the reduced-motion baseline honored *automatically* from the OS `prefers-reduced-motion` preference, or only via an in-page toggle? The undiagnosed majority (symptom prevalence ~48% vs <5% diagnosis [F31]) will never find a toggle. [F18, F31]
- If an in-page toggle exists, is it an *override on top of* the honored OS preference (good — the AAA layer [F23]), or the *only* mechanism (bad)?
- How far must the user travel — through how much motion — to reach the control that stops the motion? [F8]
- Does the preference persist across pages/sessions, or must the user reconfigure each time? [F31]

**Severity hooks / preconditions (this section).**
- Motion safety opt-in only (OS `prefers-reduced-motion` ignored; safety gated behind a toggle) — **High**: the reduced-motion baseline must be the default, because susceptibility varies per user [F6] and most affected users are undiagnosed and will not find the toggle [F31].
- In-page toggle present *and* OS preference honored (toggle as AAA override) — **Pass** [F23].
- Toggle buried / non-persistent — **Medium** [F8, F31].

**Standards / research anchors.** The recursive form of the Motion Sensitivity Law; WCAG 2.2 SC 2.3.3 / technique C39 (OS preference as the honored signal). Research: [F6, F8, F18, F23, F31].

**Automation.** Partial. Whether the OS preference is honored is the grep-able `prefers-reduced-motion` block (shared with S3); the *discovery cost* and persistence of any in-page toggle is judgment.

---

## Section 6 — Evidence

`evidence`

**Purpose.** Was motion-heavy / flashing media verified with an analysis tool — not just eyeballed? This is the process gate. Per technique G15, a passing claim on flashing media is only credible if backed by a tool analysis pass [F14]; unverified flashing media is an **open finding, not a pass**.

**Failure modes.**
- A "no flashing" claim based on visual inspection alone, with no PEAT / Harding FPA analysis pass [F14]
- Using PEAT on broadcast/film/gaming content, where PEAT is prohibited and Harding FPA is the correct tool [F15]
- Motion claims captured as a still screenshot at 100% with the OS Reduce Motion toggle never flipped
- Flash/luminance claims made without measuring against the rendered, captured frames (PWM/OLED flicker can be missed by frame-by-frame analysis) [F17]
- No record of which test path produced each finding (fetched CSS vs live observation vs tool analysis)

**Audit questions.**
- Was any flashing or fast/large-area media run through an analysis tool (PEAT for web/software; Harding FPA for broadcast/film/gaming/home-entertainment), or only eyeballed? [F14, F15]
- Was the correct tool used for the medium? (PEAT is prohibited on gaming/broadcast content [F15].)
- Was the surface observed *in motion* with the OS Reduce Motion preference both off and on, not captured as a single still? [F23]
- Were flash/luminance claims measured against the rendered captured frames, accounting for the device viewport and close-viewing distance [F17]?
- Is the test path recorded per finding (fetched CSS / live observation / tool analysis)?

**Severity hooks / preconditions (this section).**
- Unverified flashing or fast/large-area media (no tool analysis pass) — recorded as an **open finding**, never a clean pass [F14]. This is a process gate: the section *Fails* if a flash/seizure claim was made on visual inspection alone.
- Wrong tool for the medium (PEAT on gaming/broadcast) — finding [F15].

**Standards / research anchors.** WCAG 2.2 technique G15; PEAT (web/software) vs Harding FPA (broadcast/gaming) split. Research: [F14, F15, F17, F23].

**Automation.** No. Process gate.

---

## Hard-failure patterns this rubric must catch

A useful motion-sensitivity audit should detect at least these four patterns:

1. **`flash_seizure`** — content flashes more than 3 times per second over the area + luminance (or red-flash) threshold (Section 0 — **Critical**, physical harm) [F10, F11, F12, F33].
2. **`unstoppable_motion`** — autoplay / parallax / scroll-jack / zoom with no pause or disable mechanism (Sections 2 / 4) [F25, F28, F2].
3. **`reduced_motion_ignored`** — no `prefers-reduced-motion` handling, or a CSS reduce block that JS / WAAPI motion ignores (Section 3) [F18, F21].
4. **`opt_in_only_safety`** — motion safety gated behind a toggle the undiagnosed majority will not find, instead of honoring the OS preference (Section 5) [F31, F18].

---

## Finding format

Each finding produced by this audit takes the shape defined in [`../../shared/finding-format.md`](../../shared/finding-format.md):

```
## Finding MO-{NN} — {short title}

Severity: {Critical | High | Medium | Low}
Section: {section name}
Surface: {where in the product}
Load displaced to: {one or more from the shared enum below}
Evidence state: {Observed | Inferred | Open question}

Issue:
{One paragraph describing what the interface does — the motion, where, and when it fires.}

Why it matters:
{One paragraph naming the cost on the user's vestibular system or seizure risk —
dizziness, nausea, migraine, or physical seizure. Reference the Motion Sensitivity
Law if the displacement is non-obvious.}

Evidence:
{Test path (fetched CSS / live observation / PEAT / Harding FPA), OS Reduce Motion
state (on/off), the specific CSS/JS declaration or measured flash rate, surface,
screenshot or stylesheet reference. If this line is empty, the finding fails
Section 6 and is not yet a finding.}

Fix:
{One paragraph. Should restore consent over motion — honor prefers-reduced-motion,
provide a pause/stop, or remove the flash — without deleting functional feedback.}
```

Optional audit-specific fields from [`schemas/finding.extensions.json`](schemas/finding.extensions.json): `mo_trigger_pattern` (classifies the trigger) and `wcag_sc` (the success criterion the finding maps to, e.g. `"2.3.1"`). These are additive; they do not replace any base field.

**Severity definitions** (per [`../../shared/severity-model.md`](../../shared/severity-model.md) — Critical / High / Medium / Low; domain preconditions in this rubric):

| Severity | Meaning (motion-sensitivity specialization) |
|---|---|
| Critical | Physical harm. Content flashing > 3 times/sec over the area + luminance threshold, or any saturated-red flash above the red-flash threshold — a seizure trigger [F10, F11, F12, F33]. This is the only audit in the repo with a hard *physical-injury* Critical. |
| High | Significant vestibular displacement in common workflows: autoplay > 5 s with no stop [F25]; auto-rotating carousel [F29]; large-area / multi-axis / scroll-jacking motion [F5, F28]; no `prefers-reduced-motion` block on decorative motion [F18]; CSS reduce block that JS ignores [F21]; motion safety opt-in only [F31]; large-area transform motion [F3]. |
| Medium | Over-aggressive `duration: 0` reduce reset [F22]; reduce block that deletes functional feedback [F20]; continuous loading-motion trigger with no reduce path [F2, F26]; any >3 Hz flash on an AAA/safety-critical target below the 2.3.1 threshold [F13]; buried / non-persistent motion toggle [F8]; sub-5s auto-start motion [F8]. |
| Low | Single-axis gentle motion with a reduce path [F9]; small localized transforms; opacity/color-only animation [F3]. Polish-level, edge-case states. |

**Section-Fail threshold** (shared, unchanged from [`../../shared/severity-model.md`](../../shared/severity-model.md)): **a single Critical OR three Highs in any one section produces a section-level Fail.** Any section Fail produces an overall audit Fail. (Note: a single `MO-FLASH` Critical in Section 0 fails the whole audit — by design, because the harm is a physical seizure.)

**Load-displaced-to mapping.** The `Load displaced to:` field uses one or more values from the shared enum in [`../../shared/finding-format.md`](../../shared/finding-format.md). This audit adds **no** new displacement values. Because the shared enum is cognitive-load-centric and has no perfect "vestibular" value, motion failures map onto the fixed 11-value enum as follows:

| Motion failure | Maps to |
|---|---|
| User must wait out / avoid the motion before acting (autoplay, loader) | `time` |
| Motion forces the user to visually decode through movement (parallax under reading, shimmer) | `visual decoding` |
| User must hunt for a "reduce animations" toggle to make the surface usable | `configuration` |
| Scroll-jacking destroys the user's sense of place / position | `navigation` |
| Motion-induced dizziness/nausea forces the user to abandon the task | `time`, `visual decoding` |
| Carousel auto-advances content out of view before it can be read | `time`, `recovery / undo` |
| Reduce block deletes functional feedback, so the user can't tell what changed | `memory`, `verification` |
| A capability is dropped in a "reduced" mode rather than substituted | `feature loss` |

Findings with vague displacement targets are weaker findings. "Other" is not an option.

---

## Automatable vs judgment cut

| Section | Scanner / fetch-checkable | Skill / judgment required |
|---|---|---|
| 0. Animation | Partial — flash requires a *tool* (PEAT/Harding) over captured frames; static CSS cannot compute luminance/red-flash/area | Yes (movement area %, speed, the flash rate itself) |
| 1. Loading motion | Partial — `@keyframes` on a loader class + reduce override are grep-able | Yes (is the shape a vestibular trigger? area covered?) |
| 2. Vestibular trigger patterns | Partial — parallax / scale-spin `@keyframes` / scroll-jack handlers partly detectable | Yes (area, speed, axis-count → severity) |
| 3. prefers-reduced-motion respect | Partial — **presence of the `prefers-reduced-motion` block is the single most load-bearing grep-able signal** | Yes (does JS/WAAPI also honor it? substitute vs delete?) |
| 4. Auto-playing media | Partial — `autoplay` attrs / carousel config / infinite `@keyframes` partly detectable | Yes (is a pause/stop/hide control present and reachable?) |
| 5. Configuration cost | Partial — OS-preference honoring is the grep-able reduce block | Yes (toggle discovery cost, persistence) |
| 6. Evidence | No | Yes (process check — was a tool run, the right one?) |

This audit is not "run axe and call it done." Axe / Lighthouse detect almost none of this — the flash layer needs a frame-level tool, the vestibular layer needs observation, and the JS-reintroduction failure is invisible to a CSS scan. The single highest-value automatable signal is the **presence or absence of a `@media (prefers-reduced-motion: reduce)` block** in the fetched stylesheets; everything else is observation and judgment.

---

## Running this as a skill

The skill that runs this audit lives at [`skill/SKILL.md`](skill/SKILL.md). It walks the rubric defined above and produces three outputs: `motion-sensitivity-findings.md`, `motion-sensitivity-scorecard.json`, `remediation-priority-list.md`.

**Hierarchy.** The rubric is canonical. The skill never invents criteria. If the rubric and the skill disagree, the rubric wins. Updates to audit criteria go in this file first; the skill is updated to match. Pressure-test outputs live under `evidence/<run-id>/`. The PT0 target shortlist is in [`evidence/PT0-candidates.md`](evidence/PT0-candidates.md).

---

## References

- W3C WAI (AGWG). (2023). *Understanding Success Criterion 2.3.3: Animation from Interactions*. https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
- Craig, J. (WebKit). (2017). *Responsive Design for Motion*. https://webkit.org/blog/7551/responsive-design-for-motion/
- Head, V. (A List Apart). (2015). *Designing Safer Web Animation For Motion Sensitivity*. https://alistapart.com/article/designing-safer-web-animation-for-motion-sensitivity/
- Diels, C., Ukai, K., & Howarth, P. A. (2007). *Visually induced motion sickness with radial displays: effects of gaze angle and fixation*. PMID:17679562. https://pubmed.ncbi.nlm.nih.gov/17679562/
- Keshavarz, B., Riecke, B. E., Hettinger, L. J., & Campos, J. L. (2015). *Vection and visually induced motion sickness: how are they related?* DOI:10.3389/fpsyg.2015.00472. https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2015.00472/full
- Fulvio, J. M., Ji, M., & Rokers, B. (2021). *Variations in visual sensitivity predict motion sickness in virtual reality*. DOI:10.1016/j.entcom.2021.100423. https://www.sciencedaily.com/releases/2021/03/210309153820.htm
- web.dev (Chrome) Learn Accessibility. (2022). *Animation and motion*. https://web.dev/learn/accessibility/motion
- Gaebel, F. (The A11Y Project). (2013). *Background: A primer to vestibular disorders*. https://www.a11yproject.com/posts/understanding-vestibular-disorders/
- W3C WAI (Kirkpatrick, A., et al., eds.). (2018). *Understanding Success Criterion 2.3.1: Three Flashes or Below Threshold*. https://www.w3.org/WAI/WCAG21/Understanding/three-flashes-or-below-threshold.html
- W3C WAI (WCAG 2.0 Working Group). (2016). *Understanding Success Criterion 2.3.1 (general & red flash thresholds)*. https://www.w3.org/TR/UNDERSTANDING-WCAG20/seizure-does-not-violate.html
- W3C WAI. (2023). *Understanding Success Criterion 2.3.2: Three Flashes*. https://www.w3.org/WAI/WCAG22/Understanding/three-flashes.html
- W3C WAI. (2023). *G15: Using a tool to ensure that content does not violate the general flash threshold or red flash threshold*. https://www.w3.org/WAI/WCAG22/Techniques/general/G15
- Trace Center / University of Maryland. (2020). *Photosensitive Epilepsy Analysis Tool (PEAT)*. https://trace.umd.edu/peat/
- Jordan, J. B., & Vanderheiden, G. C. (2024). *International Guidelines for Photosensitive Epilepsy: Gap Analysis and Recommendations* (ACM TACCESS 17(3)). DOI:10.1145/3694790. https://pmc.ncbi.nlm.nih.gov/articles/PMC11872230/
- W3C WAI (AGWG). (2023). *C39: Using the CSS prefers-reduced-motion query to prevent motion*. https://www.w3.org/WAI/WCAG21/Techniques/css/C39
- Deveria, A., et al. (caniuse). (2026). *Can I use: prefers-reduced-motion media query*. https://caniuse.com/prefers-reduced-motion
- Steiner, T. (2019). *prefers-reduced-motion: Sometimes less movement is more*. https://web.dev/articles/prefers-reduced-motion
- Coyier, C. (2022). *No Motion Isn't Always prefers-reduced-motion*. https://css-tricks.com/nuking-motion-with-prefers-reduced-motion/
- MDN contributors (Mozilla). (2025). *prefers-reduced-motion — CSS media feature*. https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
- Agrawal, Y., et al. (2009). *Disorders of balance and vestibular function in US adults: NHANES 2001-2004*. DOI:10.1001/archinternmed.2009.66. https://pubmed.ncbi.nlm.nih.gov/19468085/
- W3C WAI. (2023). *Understanding Success Criterion 2.2.2: Pause, Stop, Hide*. https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html
- Frederick, D. E., Mohler, J., Vorvoreanu, M., & Glotzbach, R. (2015). *The Effects of Parallax Scrolling on User Experience in Web Design*. Journal of Usability Studies v10 i2. https://uxpajournal.org/the-effects-of-parallax-scrolling-on-user-experience-in-web-design/
- Paul, S. (NN/g). (2023). *Scrolljacking 101*. https://www.nngroup.com/articles/scrolljacking-101/
- Runyon, E. (2013). *Carousel Interaction Stats*. https://erikrunyon.com/2013/01/carousel-interaction-stats/
- Neuhauser, H. K., et al. (2005). *Epidemiology of vestibular vertigo: a neurotologic survey of the general population*. DOI:10.1212/01.wnl.0000175987.59991.3d. https://pubmed.ncbi.nlm.nih.gov/16186531/
- Bisdorff, A., et al. (2013). *The Epidemiology of Vertigo, Dizziness, and Unsteadiness and Its Links to Co-Morbidities*. DOI:10.3389/fneur.2013.00029. https://pmc.ncbi.nlm.nih.gov/articles/PMC3605504/
- Paz-Tamayo, A., et al. (2020). *Systematic Review of Prevalence Studies and Familial Aggregation in Vestibular Migraine*. DOI:10.3389/fgene.2020.00954. https://pmc.ncbi.nlm.nih.gov/articles/PMC7489493/
- Fisher, R. S., et al. (2022). *Visually sensitive seizures: An updated review by the Epilepsy Foundation*. DOI:10.1111/epi.17175. https://pubmed.ncbi.nlm.nih.gov/35132632/
- World Wide Web Consortium. (2024). *Web Content Accessibility Guidelines (WCAG) 2.2*.

---

*v0.1 — Draft. Rubric authored via study-swarm (research-grounded), externally verified (retrieval oracle + two non-Claude groundedness families); not yet pressure-tested. PT0 target shortlist in [`evidence/PT0-candidates.md`](evidence/PT0-candidates.md). The sibling boundary with the Low-Vision audit's Section 5 (`forced-colors`) vs this audit's Section 3 (`prefers-reduced-motion`) is resolved by cross-reference only (see the relationship note). The four hard-failure patterns — `flash_seizure`, `unstoppable_motion`, `reduced_motion_ignored`, `opt_in_only_safety` — are candidates to exercise at first pressure test. See [`CHANGELOG.md`](CHANGELOG.md).*
