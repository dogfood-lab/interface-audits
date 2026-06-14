# Motion Sensitivity Audit — PT0 target shortlist

This is the ranked candidate list for **Pressure Test 0** of the Motion Sensitivity Audit. It mirrors the structure of [`../../../ROADMAP.md`](../../../ROADMAP.md)'s NT-1 shortlist: candidate targets, why each is a good calibration target, the sections it exercises, and the PT0 exit criteria.

These are **candidates, not completed runs.** No PT0 has been run yet. This audit is `state: Draft` (see [`../README.md`](../README.md)). When PT0 runs, its outputs land in `evidence/pt0/` and this audit advances to Pressure-tested.

## What PT0 needs to calibrate

PT0 exists to prove the rubric survives contact with a real, motion-heavy target without inventing drama, and to exercise the four hard-failure patterns:

1. **`flash_seizure`** — content flashes over the area + luminance (or red-flash) threshold (Section 0)
2. **`unstoppable_motion`** — autoplay / parallax / scroll-jack / zoom with no stop (Sections 2 / 4)
3. **`reduced_motion_ignored`** — no `prefers-reduced-motion` block, or a CSS reduce block that JS ignores (Section 3)
4. **`opt_in_only_safety`** — motion safety opt-in only, not honored from the OS preference (Section 5)

### The fetch-auditability constraint (read first)

A WebFetch DOM/CSS audit can only see what ships in the fetched HTML and stylesheets. For this audit that is *unusually powerful for one signal and weak for another*:

- **Strong, grep-able:** the presence or absence of a `@media (prefers-reduced-motion: reduce)` block; CSS `@keyframes` declarations (rotation, translate, scale); `animation: ... infinite`; `<video autoplay>` attributes; `background-attachment: fixed` and transform-on-scroll parallax hints. **This is the single most load-bearing signal in the audit and it is directly fetch-visible.**
- **Weak / not fetch-visible:** JS-driven motion (GSAP, Framer Motion, Lottie, canvas loops) that ignores `matchMedia`; the actual flash *rate* (needs a frame-level tool — PEAT/Harding — over rendered frames, which a fetch cannot run); scroll-jacking that lives entirely in JS scroll handlers; the *severity* multipliers (area %, speed, axis-count) that need observation.

**Ranking principle:** rank PT0 candidates by how much of their motion is observable in *fetched CSS/HTML* — especially whether the `prefers-reduced-motion` reduce block is present or absent in the stylesheets — because that is what a WebFetch run can actually adjudicate. JS-driven targets are still valuable but their findings will be more Inferred than Observed; note the fetch limitation per candidate.

## Target shortlist, ranked by fetch-auditability

### 1. A marketing / product site with CSS `@keyframes` + parallax + autoplay video

Examples in the wild: a Stripe / Linear-style product marketing site, an Awwwards-style scroll-animation landing page, a developer-tool homepage with an animated hero.

- **Why it's a good calibration target:** the densest *fetch-visible* motion surface. CSS `@keyframes` (fade-ups, scaling pulses), `background-attachment: fixed` or transform-on-scroll parallax, and `<video autoplay loop muted>` heroes are all declared in the fetched HTML/CSS. Critically, the `@media (prefers-reduced-motion: reduce)` block — if present — is right there in the stylesheet, and its *absence* is an automatic High [F18]. This exercises the audit's highest-leverage signal directly.
- **Sections exercised:** S2 (parallax, scale `@keyframes`), S3 (presence/absence of the reduce block), S4 (autoplay video / hero), S0 (large-area transform motion area %).
- **Expected headline finding:** "decorative parallax + autoplay hero with no `@media (prefers-reduced-motion: reduce)` block" — `reduced_motion_ignored` + `unstoppable_motion`.
- **Risk:** a well-built modern marketing site may ship a correct reduce block — which would produce a *healthy* result. That is acceptable and calibrates the rubric's honesty (a clean PT0 that correctly finds few issues is a valid outcome). The strongest sites (Stripe, Linear) often *do* honor reduce; pick a flashier Awwwards-style site if the goal is to exercise the failure path.

### 2. An Apple product page (canonical scroll-jacking / parallax)

Examples: an Apple iPhone / Mac / AirPods product page, or any site openly modeled on Apple's choreographed scroll storytelling.

- **Why it's a good calibration target:** the canonical, textbook example of scroll-jacking and pinned scroll-driven parallax — the exact patterns NN/g found disorient a majority of users [F28] and that the WebKit taxonomy names as triggers [F2]. If any target exercises `unstoppable_motion` via scroll-jacking, this is it.
- **Sections exercised:** S2 (scroll-jacking — High, escalates on mobile/reading [F28]; multi-speed parallax), S3 (does the choreography honor reduce?), S4 (autoplay product animations).
- **Expected headline finding:** "scroll-jacked product narrative drives multi-axis motion; reduce handling is JS-side and unverifiable from fetch" — `unstoppable_motion`, with S3 as an open finding if the motion is JS-driven.
- **Risk / fetch limitation:** **the motion is overwhelmingly JS-driven** (scroll-event handlers, canvas, WebGL), so a WebFetch run sees little of it in CSS. Most findings here will be **Inferred** (from script presence and known pattern) or **open questions**, not Observed. Apple *does* ship `prefers-reduced-motion` handling in places — but whether the JS choreography respects it is exactly the `MO-JS-REINTRO` case [F21] that fetch cannot confirm. Note the limitation explicitly; this target is better for a *live-observation* PT than a fetch-only one.

### 3. A site with an auto-rotating hero carousel

Examples: a news/media homepage, an e-commerce storefront, a hotel/travel landing page, a university or municipal homepage — anything with a rotating banner slider.

- **Why it's a good calibration target:** the cleanest, most isolated test of Section 4's autoplay rules. An auto-rotating carousel is both a Level-A failure if it runs > 5 s with no pause control [F25] and a documented effectiveness defect (~1% engagement, later slides near-invisible [F29]). The carousel library config and `<video autoplay>` / interval markers are often partly fetch-visible.
- **Sections exercised:** S4 (auto-rotation — High [F25, F29]), S3 (does it pause under reduce?), S2 (if slides transition with slide/zoom motion).
- **Expected headline finding:** "auto-rotating hero carousel with no pause/stop/hide control, advancing every N seconds" — `unstoppable_motion`, `autoplay` trigger pattern, maps to WCAG 2.2.2.
- **Risk:** narrow — likely produces mostly Section 4 findings and is weaker on the flash and reduce-respect layers. Best as a focused supplement if a multi-section target proves too noisy for a first run. Carousel rotation is frequently JS-timer-driven, so the *interval* and *pause control* may need observation to confirm.

### 4. A site with a known flashing / strobing animated element

Examples: a game or entertainment landing page with a strobing hero, a "loud" promo page with flashing CTAs, an animated GIF/video banner with rapid color changes.

- **Why it's a good calibration target:** the only shortlist entry that directly targets the **flash/seizure Critical** (Section 0). This is the one pattern that justifies the audit's existence as a *physical-safety* tool rather than a comfort tool.
- **Sections exercised:** S0 (flash rate, luminance, red-flash — Critical [F10, F11, F12, F33]), S6 (was it run through PEAT/Harding?).
- **Expected headline finding:** "hero strobes above 3 flashes/sec over a large viewport area; not verified with PEAT" — `flash_seizure`, recorded as an **open finding** because a fetch-only run cannot run the analysis tool.
- **Risk / fetch limitation:** **a WebFetch run cannot measure the flash rate** — that needs PEAT (web) or Harding FPA (broadcast/gaming) over rendered frames [F14, F15]. Fetch can flag a suspicious `animation: ... infinite` with a fast duration on a large element as an Inferred trigger, but the Critical determination requires the tool pass. This target best demonstrates the Section 6 evidence gate: an unverified flash claim is an open finding, never a clean pass. Pair with a live + PEAT pass if a true Critical is the goal.

## Recommended PT0 pick

**Target 1 (a marketing/product site with CSS `@keyframes` + parallax + autoplay video)** is the recommended primary, because it puts the audit's highest-leverage, most fetch-visible signal — the presence or absence of a `@media (prefers-reduced-motion: reduce)` block — directly under the lens, and exercises three of the four patterns (`reduced_motion_ignored`, `unstoppable_motion`, and S2 vestibular triggers) in one reproducible run. **Target 4 (a flashing element + PEAT pass)** is the strongest *complement* if PT0 is split across two surfaces, because it is the only reliable way to exercise the flash/seizure Critical and the Section 6 tool-evidence gate — but it requires a live capture + PEAT analysis, not a fetch-only run.

## PT0 exit criteria

PT0 is complete when, per [`../../../shared/pressure-test-protocol.md`](../../../shared/pressure-test-protocol.md):

- The run produced `evidence/pt0/motion-sensitivity-findings.md`, `evidence/pt0/motion-sensitivity-scorecard.json` (conforming to [`../../../shared/schemas/scorecard.base.schema.json`](../../../shared/schemas/scorecard.base.schema.json)), and `evidence/pt0/remediation-priority-list.md`.
- At least 5 findings, every one mapped to a rubric section, each with a recorded test path (fetched CSS / live observation / tool analysis) and OS Reduce Motion state.
- The `@media (prefers-reduced-motion: reduce)` block presence/absence was checked in the fetched CSS — the single most load-bearing signal.
- At least one **scanner-invisible** finding (flash measured by tool, JS-reintroduced motion, scroll-jacking, autoplay with no stop, opt-in-only safety) — not just a CSS-detectable declaration. This is the discriminator from a generic scan.
- At least two of the four hard-failure patterns marked `true` (exercised) or `false` (passed cleanly) in `hard_failure_patterns_validated` — not all `null`.
- If any flashing / fast / large-area media is present, a tool-analysis pass (PEAT for web; Harding FPA for broadcast/gaming) was run, or the flash claim is recorded as an **open finding** — never laundered into a clean pass.
- The surface was observed in motion with the OS Reduce Motion preference both off and on, OR the fetch-only limitation is documented in `context.viewport_render_limitation`.
- Evidence gaps preserved as open questions (not laundered into Observed findings).
- The findings report obeys its own audit: plain language, short sentences, structured headings, no motion the audit would itself flag.
- **Reclassification discipline applied:** any finding designed to fit the test's scope starts at the most conservative evidence state and is re-checked after the run. A second-pass downgrade is the audit working, and the reclassification trail belongs in the findings file's auditor-notes section.

If PT0 forces a rubric change, that change earns the first version cut and is recorded in [`../CHANGELOG.md`](../CHANGELOG.md), advancing the audit toward Frozen per [`../../../shared/audit-lifecycle.md`](../../../shared/audit-lifecycle.md).
