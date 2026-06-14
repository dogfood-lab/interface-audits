# Motion Sensitivity Audit — PT0 findings (linear.app homepage)

- **Audit:** Motion Sensitivity (`MO`)
- **Run ID:** `pt0-linear`
- **Audit ID:** `mo-20260613-pt0-linear`
- **Rubric:** [`../../RUBRIC.md`](../../RUBRIC.md) — v0.1 (Draft)
- **Target:** `https://linear.app/` — the public marketing homepage
- **Surface state:** homepage on first paint + scroll narrative (Intake / Plan / Build / Diffs / Monitor sections), default OS Reduce Motion = off
- **Date:** 2026-06-13
- **Evidence mode:** Path 2 / fetched DOM + CSS. Raw HTML (2.38 MB) fetched via curl; all 17 external stylesheets (`static.linear.app/web/_next/static/css/*.css`, 544 KB total) fetched and grepped. **No live browser, no OS Reduce Motion toggle, no AT, no PEAT/Harding frame analysis was run** — see the evidence-mode limitation note below and the per-finding Evidence lines.

---

## Evidence-mode limitation (read before the findings)

This is a **fetched-DOM/CSS** run, the same class as every prior PT0 in this repo. What that buys and what it cannot reach, for this target specifically:

- **Confirmable from fetched bytes (Observed):** presence/absence and exact text of `@media (prefers-reduced-motion: ...)` blocks across all 17 stylesheets and the inline HTML; the exact CSS of the marquee, grid-dot, VideoBackground, and view-transition rules; which classes are applied to which elements on the homepage; the absence of any `<video autoplay>` element on this surface.
- **Inferred (strongly implied by the fetched CSS/markup but not seen in motion):** the visual behavior of the logos marquee and the decorative grid-dot field; the viewport area each covers.
- **NOT reachable on this run (preserved as Open questions, never laundered into findings):** whether any JavaScript / WAAPI / canvas motion re-introduces movement that ignores `matchMedia` (Linear ships hashed JS chunks; no `framer-motion`/`gsap`/`lottie` name is visible in `src`); whether the scroll narrative JS-scroll-jacks (no wheel-handler or `scrollTrigger` hint is fetch-visible — only native `scroll-snap`/`position:sticky` CSS is present); the actual flash rate of any media (no frame-level tool can run over a fetch); and the rendered-pixel area / speed of any motion. The OS Reduce Motion preference was never toggled, so Sections 3 and 5 are scored on the fetched reduce-block evidence and **cannot earn a clean Pass** where a runtime confirmation is the only way to close the gap.

The preferred path — a headless browser with `prefers-reduced-motion: reduce` forced on and off, plus a PEAT pass over any captured motion — should replace this run before any finding here is treated as runtime-confirmed.

---

## What the target gets right (context for the findings)

Linear's homepage is a **mostly-healthy** motion implementation, which is the honest PT0 outcome the protocol expects from a strong modern marketing site. Before the findings, the positive baseline (also captured in the scorecard's `positive_observations`):

- **Every animation declared in the 17 external stylesheets is wrapped in a `prefers-reduced-motion` guard.** The consistent pattern is `@media (prefers-reduced-motion: no-preference){ ...animation... }` (12 occurrences) plus `@media (prefers-reduced-motion: reduce){ ...animation:none }` resets (6 occurrences). This is the correct C39 sufficient-technique pattern [F18]: motion only runs when the user has *not* asked to reduce it.
- **The video-background component swaps motion for a static image under reduce** — `@media not (prefers-reduced-motion:no-preference){.VideoBackground_video{display:none}}` and the inverse hides the still under no-preference. This is the MDN canonical *substitute, don't delete* pattern [F23], not a blanket removal. (The component class is defined but not instantiated on this homepage — there is no `<video>` on this surface.)
- **View transitions are correctly neutralized under reduce** — `@media (prefers-reduced-motion:reduce){::view-transition-group(*),::view-transition-new(*),::view-transition-old(*){animation:none!important}}`.

The findings below are the gaps *around* that healthy baseline — they are real and fetch-visible, but they are calibrated down from where an over-fitted audit would put them. The reclassification trail is in the auditor notes.

---

## Finding MO-01 — Logos marquee auto-scrolls with no pause/stop/hide control

Severity: High
Section: autoplaying_media
Surface: Homepage customer-logos band (`.Marquee_root .Marquee_content`, `Logos_marqueeItem`)
Load displaced to: time, visual decoding
Evidence state: Inferred
WCAG SC: 2.2.2
Trigger pattern: autoplay

Issue:
The homepage renders a horizontally auto-scrolling band of ~16 customer logos. The motion is a continuous `translateX` loop — `@media (prefers-reduced-motion:no-preference){.Marquee_content{animation:Marquee_scroll var(--Marquee-duration) linear infinite}}` with `--Marquee-duration:30s` — so the band slides leftward forever, in parallel with the rest of the page, well beyond the 5-second WCAG 2.2.2 window. A pause-on-hover capability exists in the stylesheet (`.Marquee_pauseOnHover:hover .Marquee_content{animation-play-state:paused}`, itself gated behind `@media (any-hover:hover)`), but the marquee instance on this homepage is built with the classes `Marquee_root Marquee_noFade Flex_root` — it does **not** carry `Marquee_pauseOnHover`. There is no pause/stop/hide button anywhere near the marquee in the fetched markup.

Why it matters:
Auto-scrolling translate motion is a named vestibular trigger, and the only way a user can stop it is to have set the OS `prefers-reduced-motion` preference in advance — which the undiagnosed majority never do (symptom prevalence ~48% versus formal diagnosis below 5% [F31]). For everyone else, the band scrolls indefinitely with no in-page control. WCAG 2.2.2 (Level A) requires a pause/stop/hide mechanism for any auto-moving content that runs past five seconds in parallel with other content [F25]; this marquee meets every trigger condition and provides no such mechanism. The Motion Sensitivity Law is displaced onto the user's time (they must wait it out or look away) and visual decoding (continuous peripheral motion competes with reading the page).

Evidence:
Test path: fetched CSS + HTML. OS Reduce Motion: not toggled (the reduce-gating is read from the CSS, not observed in motion). `css_3.css`: `@media (prefers-reduced-motion:no-preference){.Marquee_content__n0Vyj{animation:Marquee_scroll__lpjIn var(--Marquee-duration) linear infinite}}`; `Marquee_root__pXJQM{--Marquee-duration:30s}`; the pause rule `@media (any-hover:hover){.Marquee_root.Marquee_pauseOnHover:hover .Marquee_content{animation-play-state:paused}}`. Homepage instance class string: `class="Marquee_root__pXJQM Marquee_noFade__6oc03 Flex_root__DOQCW"` — no `Marquee_pauseOnHover`. Inferred (not Observed) because the loop and its 30s duration are read from CSS, not watched in a live render; the absence of a pause button is confirmed in the fetched markup.

Fix:
Add a visible Pause/Play control to the marquee (one toggle that flips `animation-play-state`), reachable by keyboard and present on touch, satisfying WCAG 2.2.2's pause/stop/hide requirement for the majority of users who have not set the OS preference. At minimum, apply the existing `Marquee_pauseOnHover` class so desktop pointer users can stop it — but hover-only pause does not satisfy 2.2.2 on touch, so a real control is the correct fix. Keep the existing reduce-gating (it already stops the band under `prefers-reduced-motion: reduce`); the control is the additive piece for non-reduce users.

---

## Finding MO-02 — Decorative grid-dot field animates with no reduced-motion guard

Severity: Low
Section: reduced_motion_respect
Surface: Inline-rendered decorative dot grid (`.grid-dot-N-N-{upDown,pong,agent}` on `<circle>` SVG elements)
Load displaced to: visual decoding
Evidence state: Inferred
WCAG SC: 2.3.3
Trigger pattern: n/a (ambient decorative opacity field — not a spatial trigger, not a loader)

Issue:
The homepage injects an inline `<style>` block with 175 `@keyframes` and ~350 `animation:` declarations driving a decorative grid of dots — a 5×5 field with `upDown`, `pong`, and `agent` variants (75 unique classes across ~150 `<circle>` instances), each running e.g. `animation:grid-dot-0-0-upDown 2800ms steps(1, end) infinite`. Unlike every animation in the external stylesheets, this inline block contains **zero** `prefers-reduced-motion` guards (`grep` of the HTML returns 0 for `prefers-reduced-motion`). So this decorative field keeps animating even when the user has set the OS Reduce Motion preference — the CSS reduce-gating that protects the rest of the page does not cover it.

Why it matters:
A page with decorative motion and no reduce path for that motion is a `reduced_motion_ignored` defect in principle [F18]. The reason this is **Low** and not the automatic High the headline pattern implies: every one of these 175 keyframes animates **`opacity` only** (`0%{opacity:0.3} ... {opacity:1}`), with `steps(1, end)` discrete jumps — no `transform`, `translate`, `scale`, or `rotate` anywhere in the inline block. The rubric is explicit that opacity/color/blur changes on stationary elements are *unlikely to be problematic* and score Low/Pass, because the harm axis is spatial movement, not brightness modulation of fixed elements [F3, F9]. The displacement is mild visual decoding (twinkling in the periphery), not vestibular displacement. It is still a real gap — the user asked to reduce motion and this element ignores them — so it is a finding, just a small one.

Evidence:
Test path: fetched HTML (inline `<style>`). OS Reduce Motion: not toggled. Inline application: `<circle class="grid-dot-0-0-upDown" ...>` with `.grid-dot-0-0-upDown{animation:grid-dot-0-0-upDown 2800ms steps(1, end) infinite}`. Keyframe content (representative): `@keyframes grid-dot-0-0-upDown{0%{opacity:0.3}7.14%{opacity:0.3}...}` — property check across all 175 inline keyframes returned `opacity` only, zero transform/translate/scale/rotate. `grep -c prefers-reduced-motion` over the HTML = 0. Inferred: the opacity-only classification is confirmed in the bytes; the *visual* effect (a twinkling grid) is inferred, not watched in motion.

Fix:
Wrap the inline grid-dot keyframes in the same guard the rest of the site uses — emit the `animation:...` lines only inside `@media (prefers-reduced-motion: no-preference)`, or add a `@media (prefers-reduced-motion: reduce){ [class*="grid-dot-"]{animation:none} }` reset. Because the motion is opacity-only this is low-urgency polish, but it closes the one place on the page where the OS preference is silently ignored, removing the inconsistency.

---

## Finding MO-03 — Marquee reduce-cleanup rule disabled by a typo'd media value (`reduced` not `reduce`)

Severity: Low
Section: reduced_motion_respect
Surface: Customer-logos marquee duplicate track (`.Marquee_content[aria-hidden=true]`)
Load displaced to: visual decoding
Evidence state: Observed
WCAG SC: 2.3.3
Trigger pattern: n/a

Issue:
The marquee ships a second, `aria-hidden="true"` copy of its content (the standard seamless-loop duplication trick). A rule is meant to remove that duplicate when motion is reduced — but it is written `@media (prefers-reduced-motion:reduced){.Marquee_content[aria-hidden=true]{display:none}}`. The valid value for this media feature is `reduce`, not `reduced`; `reduced` is not a defined value, so the entire `@media` block never matches any user agent and the rule is dead. (The neighboring, correctly-spelled `no-preference` and `reduce` blocks in the same file do work — this is an isolated typo, not a systemic failure.)

Why it matters:
This is a small correctness bug, not a motion-harm finding, which is why it is **Low**. The marquee's *animation* is already correctly stopped under reduce by the properly-spelled `no-preference` gate (the `translateX` loop only runs in `no-preference`), so a reduce-motion user does not get the moving band. What the dead rule fails to do is hide the now-static duplicate logo set, so a reduce-motion user may see the customer logos rendered twice. The displacement is minor visual decoding (a redundant, duplicated static band), not dizziness. It is recorded because it is a clean, Observed example of the kind of partial-honoring slip the rubric's Section 3 is meant to surface, and because the same typo elsewhere could silently disable a load-bearing reduce rule.

Evidence:
Test path: fetched CSS — Observed directly in the bytes. `css_3.css`: `@media (prefers-reduced-motion:reduced){.Marquee_content__n0Vyj[aria-hidden=true]{display:none}}`. Cross-file count: 6 correctly-spelled `prefers-reduced-motion:reduce`, 12 `no-preference`, and exactly 1 `reduced` typo. The HTML confirms the duplicate exists: `<div class="Marquee_content__n0Vyj" aria-hidden="true">`. This is the one finding here at evidence state Observed because the defect is fully determinable from the static text — no render is needed to know an undefined media value never matches.

Fix:
Change `reduced` to `reduce` in the cleanup rule. One-character fix. It restores the intended behavior (hiding the duplicated track under reduced motion) and removes a latent risk: the same misspelling on a rule that gated an actual motion reset would silently re-expose that motion to reduce-motion users.

---

## Open questions (evidence gaps — not findings)

These are plausible issues the fetched-DOM/CSS run cannot adjudicate. They are preserved as open questions, not promoted to findings, and each carries a resolution path.

### OQ-01 — JS/WAAPI-reintroduced motion that ignores `matchMedia` (`MO-JS-REINTRO`)
Section: reduced_motion_respect. The CSS reduce-gating is thorough, but Linear ships hashed JS chunks and a CSS reduce block creates a false impression of compliance if JavaScript/WAAPI/canvas motion runs regardless of `window.matchMedia('(prefers-reduced-motion: reduce)')` [F21]. No `framer-motion`/`gsap`/`lottie` name is visible in the fetched `src` attributes (chunked/minified), so this is genuinely undetermined from fetch. Resolution: load the page in a headless browser with `prefers-reduced-motion: reduce` forced on; record whether any element still moves (scroll-fade, hero motion, section transitions) after the CSS has been neutralized. If motion persists, this becomes a High.

### OQ-02 — JS scroll-jacking of the section narrative
Section: vestibular_trigger_patterns. The page is a multi-section scroll story (Intake / Plan / Build / Diffs / Monitor) and ships `scroll-snap` (5), `position:sticky` (7), `scroll-behavior:smooth` (1), and `overscroll` (6) in CSS. Those are *native, browser-controlled* scroll affordances — not the wheel-`preventDefault` scroll-hijacking NN/g found disorienting [F28]. No JS wheel handler or `scrollTrigger` hint is fetch-visible. Whether the narrative additionally JS-scroll-jacks (overriding native scroll velocity) cannot be confirmed from fetch. Resolution: live observation — scroll the page and check whether wheel/trackpad input is intercepted and remapped, especially on the sticky/pinned sections. If native scroll is overridden, this is Medium (Desktop) escalating to High on mobile or over reading content [F28].

### OQ-03 — Rendered area and speed of the grid-dot field and marquee
Section: animation / vestibular_trigger_patterns. Severity in S0/S2 scales with viewport-coverage %, speed, and axis-count [F3, F5, F9]. The grid-dot field is opacity-only (already classified Low, area is not load-bearing for opacity), but the marquee's `translateX` motion area as a fraction of the viewport, and its on-screen scroll speed at `--Marquee-duration:30s`, were modeled from CSS, not measured. Resolution: live capture at a known viewport; measure the marquee band height as a % of viewport and its px/s scroll speed to confirm MO-01 sits at High rather than Medium.

### OQ-04 — Flash / seizure (`flash_seizure`, Section 0)
Section: animation. No flashing asset is present on this surface to analyze: no `<video>`, no rapid color-cycling animation, and the only fetch-visible repeating motion is opacity-pulsing dots at 2800ms (≈0.36 Hz — far below the 3 Hz floor) and a 30s linear marquee. There is no candidate for an over-threshold flash. Per the discipline rule, a seizure Critical may not be asserted from absence of evidence; there is simply no flashing media here to run through PEAT, so `flash_seizure` is **not exercisable** on this target (recorded `null`, not `false` — `false` would imply a flash asset was checked and passed). Resolution: n/a for this target; would require a target that actually ships a strobing/rapid-cycling asset.

---

## Positive observations (not findings)

- **PO-01** (`reduced_motion_respect`): Every animation in the 17 external stylesheets is `prefers-reduced-motion`-guarded — 12 `no-preference` gates and 6 `reduce` resets. The site treats the OS preference as the default signal, the C39 sufficient-technique pattern [F18, F23].
- **PO-02** (`reduced_motion_respect`): The video-background component substitutes a static image for the video under reduce (`@media not (prefers-reduced-motion:no-preference){.VideoBackground_video{display:none}}` + inverse), the MDN *substitute, don't delete* pattern [F23] — not a blanket removal. (Component defined; not instantiated on this homepage.)
- **PO-03** (`reduced_motion_respect`): View transitions are explicitly neutralized under reduce — `@media (prefers-reduced-motion:reduce){::view-transition-group(*),::view-transition-new(*),::view-transition-old(*){animation:none!important}}`.
- **PO-04** (`configuration_cost`): Motion safety is honored *automatically* from the OS `prefers-reduced-motion` preference rather than gated behind an opt-in in-page toggle — the correct zero-cost default per the Motion Sensitivity Law and S5 [F23, F31]. (The marquee MO-01 gap is the one element where the OS-honored default still leaves non-reduce users without an in-page control; that is filed under S4, not as an S5 opt-in-only failure, because the OS path *is* honored here.)

---

## Auditor notes / calibration trail

This run was at structural risk of over-fitting: the PT0 brief and the candidates doc both pointed at "decorative parallax + autoplay hero with no reduce block" as the *expected headline*. The honest result is the opposite — Linear ships a thorough reduce implementation — so the discipline rule did real work. The reclassification trail:

1. **The ungated inline grid-dot animation (MO-02) started as a candidate High.** The headline pattern `reduced_motion_ignored` is an automatic High when decorative motion has no reduce path [F18]. First pass flagged 175 ungated inline `@keyframes` and reached for High. **Second pass downgraded it to Low** after checking the actual keyframe properties: all 175 are `opacity`-only with `steps(1,end)`, zero transform/translate/scale/rotate. The rubric explicitly scores opacity/color motion of stationary elements as Low/Pass because the harm axis is spatial movement, not brightness [F3, F9]. An audit that left this at High would be inventing vestibular drama from a twinkling-dots effect. The finding survives (the preference *is* ignored here) but at its true severity. **This downgrade is the audit working.**

2. **The marquee was initially eyed as a possible S2 large-area parallax High.** Second pass: it is single-axis `translateX` (not multi-speed decoupled parallax, not multi-axis), and it is *correctly reduce-gated* (stops under `reduce`). So the vestibular-trigger severity multipliers [F5, F9] do not stack, and the reduce path already protects the highest-risk cohort. The real, surviving defect is narrower and lives in **Section 4**: no pause/stop/hide for the non-reduce majority (WCAG 2.2.2). It stays **High** there on the Level-A pause failure [F25], not inflated to an S2 parallax High it does not earn.

3. **The `reduced` typo (MO-03) was initially a candidate Medium** under the "over-aggressive / broken reduce handling" failure modes [F22]. Second pass: the typo'd rule only governs `display:none` on a *duplicate static track*, and the marquee's actual animation is stopped by a *separate, correctly-spelled* `no-preference` gate. So no motion is re-exposed by the bug — only a redundant static band. That is a correctness slip, not a motion-harm event, so it lands at **Low**, Observed. Resisting the urge to call a broken `prefers-reduced-motion` block a Medium-by-default is the calibration.

4. **No Critical was asserted.** There is no flashing asset on this surface (OQ-04). Per the rubric and the discipline rule, a seizure Critical requires an actually-observed over-threshold flashing asset; absence of a flash asset is recorded as `flash_seizure: null` (not exercisable), never as a Critical-from-absence. The audit produced zero Criticals because the target has no flash hazard — the correct, honest outcome.

5. **JS-reintroduction and scroll-jacking were kept as Open questions, not findings.** Both are runtime behaviors a fetch cannot adjudicate, and there is no fetch-visible hint (no GSAP/Lottie in `src`, no wheel-handler) to push either to Inferred. Promoting them would be laundering an evidence gap. They are filed as OQ-01 and OQ-02 with explicit resolution paths.

**Net:** one High (a real Level-A pause failure), two Low (a real-but-mild ungated opacity animation and a one-character reduce typo), four positive observations, four open questions, zero Criticals. A mostly-healthy target with a few honest, fetch-visible gaps — the successful-calibration outcome, not an invented-drama failure.

### Parked rubric-revision candidates (PT0 leaves the rubric unchanged)

These surfaced during the run and are **parked**, not applied — PT0 does not edit the rubric. Logged for the next version cut's consideration:

- **RC-1 — Misspelled / invalid media-feature values as a named Section 3 sub-pattern.** The `prefers-reduced-motion:reduced` typo is a distinct failure mode (a reduce rule that silently never fires) that the current S3 failure-mode list does not name explicitly — it sits between "no reduce block" and "over-aggressive reset." Worth a one-line addition so auditors grep for invalid values (`reduced`, `reduce-motion`, `no-preferences`), not just presence/absence of the feature.
- **RC-2 — Opacity-only-but-ungated as an explicit Low precondition in Section 3.** The rubric scores opacity motion as Low in S0 (movement-area axis), but S3's `MO-NO-REDUCE` is framed as an automatic High. The interaction — *ungated motion that is itself opacity-only* — resolves to Low, and the rubric could state that precedence explicitly (S0's opacity-is-Low rule caps the S3 severity for that element) so future auditors don't default the ungated-motion High over an opacity-only element. This run applied that reasoning from [F3]+[F18] read together; making it explicit would remove the judgment call.
- **RC-3 — Hover-only / `any-hover`-gated pause as an explicit non-satisfaction of WCAG 2.2.2.** MO-01's near-miss (a pause that exists only behind `:hover` + `@media (any-hover:hover)`, absent on touch) is a common pattern worth naming in S4's failure modes as "pause control present but unreachable on touch / by keyboard = does not satisfy 2.2.2."
