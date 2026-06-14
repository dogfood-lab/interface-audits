# Motion Sensitivity Audit — PT0 remediation priority (linear.app homepage)

Findings ordered by severity x leverage. Leverage = how many users the fix protects and how cheap the fix is. Run: `pt0-linear` · Audit ID: `mo-20260613-pt0-linear` · Rubric v0.1 (Draft).

Overall: **Warn** — 0 Critical, 1 High, 2 Low, 4 open questions, 4 positive observations, 0 section Fails. A mostly-healthy target with a thorough CSS reduced-motion implementation and a small set of real, fetch-visible gaps.

---

## Priority 1 — High · do first

### MO-01 — Add a pause control to the auto-scrolling logos marquee
- **Section:** autoplaying_media · **WCAG:** 2.2.2 (Level A) · **Pattern:** `unstoppable_motion`
- **Why first:** the only finding that fails a Level-A success criterion, and it affects *every* visitor who has not set OS Reduce Motion (the undiagnosed majority, ~48% symptomatic vs <5% diagnosed [F31]) — the largest affected population on the page. The marquee runs `translateX` 30s infinite with no pause/stop/hide control at all (the homepage instance does not even carry the existing `Marquee_pauseOnHover` class).
- **Leverage:** very high. Protects the broadest cohort; the fix is small and the component already has the hooks.
- **Fix:** add a visible, keyboard-reachable Pause/Play toggle that flips `animation-play-state` (present on touch, not hover-only). As a stopgap, apply the existing `Marquee_pauseOnHover` class for desktop pointer users — but hover-pause alone does not satisfy 2.2.2, so ship the real control. Keep the existing `no-preference` reduce-gating; the control is additive for non-reduce users.
- **Evidence state:** Inferred (loop + missing control read from CSS/HTML). Confirm area/speed via OQ-03 before treating the High as runtime-final.

---

## Priority 2 — Low · cheap correctness fixes

### MO-03 — Fix the typo'd reduced-motion media value (`reduced` -> `reduce`)
- **Section:** reduced_motion_respect · **WCAG:** 2.3.3 · **Pattern:** n/a
- **Why second despite Low severity:** it is the single cheapest fix in the run (one character) and the only **Observed** finding — fully confirmed from the CSS text. `@media (prefers-reduced-motion:reduced){...}` never matches any browser, so the marquee's duplicate-track cleanup is dead. No motion is re-exposed (the animation is stopped by a separate, correct gate), so impact is a redundant static duplicate band under reduce — but the *class* of bug (a reduce rule that silently never fires) is worth eliminating, and the same typo on a load-bearing rule would be invisible and dangerous.
- **Leverage:** high per unit effort (one character); low absolute impact.
- **Fix:** change `reduced` to `reduce`. Add a lint/grep guard for invalid media-feature values across the codebase.

### MO-02 — Guard the inline grid-dot animation under prefers-reduced-motion
- **Section:** reduced_motion_respect · **WCAG:** 2.3.3 · **Pattern:** `reduced_motion_ignored` (mild)
- **Why third:** a real gap — the inline grid-dot field (175 `@keyframes`, ~150 `<circle>` instances) is the one place on the page that ignores the OS reduce preference (zero reduce guards in the inline HTML). It ranks last because the motion is **opacity-only** with `steps(1,end)` (no transform/translate/scale/rotate), which the rubric scores Low/Pass [F3, F9] — twinkling dots, not vestibular movement. Closes the consistency gap so the whole page honors the preference.
- **Leverage:** medium effort, low impact — affects only reduce-motion users, and the effect they are exposed to is benign opacity pulsing.
- **Fix:** emit the inline `animation:` lines only inside `@media (prefers-reduced-motion: no-preference)`, or add `@media (prefers-reduced-motion: reduce){ [class*="grid-dot-"]{animation:none} }`. Mirrors the pattern already used in the external CSS.

---

## Open questions — resolve before the next PT (require live observation)

These are NOT findings; they are evidence gaps a fetched-DOM/CSS run cannot close. Each could change a severity if resolved against the page.

| ID | Section | Gap | Resolution path | If confirmed |
|----|---------|-----|-----------------|--------------|
| OQ-01 | reduced_motion_respect | JS/WAAPI motion ignoring `matchMedia` (`MO-JS-REINTRO`) | Headless browser, force `prefers-reduced-motion: reduce`, watch for residual motion | Promote to **High** [F21] |
| OQ-02 | vestibular_trigger_patterns | JS scroll-jacking of the section narrative (only native scroll-snap/sticky is fetch-visible) | Live scroll; check whether wheel/trackpad input is intercepted/remapped | **Medium** desktop / **High** mobile or over reading [F28] |
| OQ-03 | animation | Rendered motion area % + speed of the marquee | Live capture; measure band height as % of viewport + px/s | Confirms MO-01 at **High** vs Medium |
| OQ-04 | animation | `flash_seizure` — no flashing asset exists on this surface | n/a for this target (no candidate); would need a strobing asset + PEAT | Not exercisable here (recorded `null`) |

---

## What passed (do not regress)

- **PO-01..PO-03** — the external-CSS reduced-motion implementation is thorough and correct: 18 guards across 7 files (`no-preference` to gate, `reduce` to reset), the video-background substitutes a still under reduce (not deletes), and view transitions are neutralized under reduce. This is the baseline that keeps the overall result at Warn rather than Fail. Any refactor must preserve these guards.
- **PO-04** — motion safety is honored automatically from the OS preference, not gated behind an opt-in toggle (the `opt_in_only_safety` failure pattern passed cleanly). Do not regress to a custom in-page-toggle-only model.
