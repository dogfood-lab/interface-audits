# AI Trust Surface — PT0 (Bing) Remediation Priority List

Findings ordered by **severity × leverage**. Leverage = how many users / surfaces the fix reaches and how directly it restores the ability to inspect, undo, trace, or control. Run: `pt0-bing` (`at-20260613-pt0-bing`). Rubric: [`../../RUBRIC.md`](../../RUBRIC.md) v0.1 (Draft), unchanged by this run.

**Severity distribution:** 0 Critical · 5 High · 4 Medium · 0 Low. **Overall: WARN** (multiple Highs, no section Fail — the worst section, User control, holds 2 Highs, below the 3-High Fail threshold). **Section 7: PASS** (failure case exercised; this run supersedes the Section-7-failing `pt0-perplexity` doc-fallback).

---

## Tier 1 — High severity, highest leverage (fix first)

### 1. AT-01 — Couple the AI provenance label to a per-instance confidence signal (S3, High, Observed)
**Surface:** Bing SSR results footer — "Content was generated with AI. Learn more."
**Leverage: maximal.** This is a page-level affordance on a top-3 global search engine; the fix reaches every query. It is also the run's **observable failure case** — the label fires byte-identically on a clean query and on a hard health-query misfire, so the fix directly closes the gap where trust should drop but the signal does not.
**Fix:** Either pair the label with a measured (not unmeasured — an unmeasured number is itself a High [F2]) per-answer confidence/uncertainty signal that visibly degrades on weak retrieval / ambiguous / false-premise queries, or suppress the AI assertion entirely in low-confidence states. The label must become a signal, not a constant.

### 2. AT-02 — Add a graceful-failure path for ambiguous / false-premise / misfiring queries (S1, High, Observed)
**Surface:** Bing query interpretation.
**Leverage: high.** Same page-level reach as AT-01; pairs with it (the confidence signal and the disambiguation are the same recovery surface).
**Fix:** Fire "did you mean…" disambiguation on ambiguous queries, a "no confident answer" state instead of stamping AI provenance on a misfire, and premise-correction (or decline) on detectable false premises. Stop proceeding as if a failed query succeeded.

### 3. AT-05 — Provide a discoverable opt-out from core AI Overviews (S5, High, Inferred)
**Surface:** Google AI Overviews. "Features cannot be turned off."
**Leverage: high.** Reaches every Google Search user who wants unmediated results; the current Labs toggle governs only experimental features.
**Fix:** Surface a per-query or persistent "show results without AI Overview" control, reachable in-flow rather than in a separate Labs surface [F26]. If the feature is positioned as core, the minimum is a per-query bypass at the result.

### 4. AT-07 — De-gate and granularize the recommender opt-out (S5, High, Inferred)
**Surface:** TikTok / YouTube / Netflix personalization controls.
**Leverage: high, broad.** Three of the largest recommender surfaces; the fix restores agency for the global majority currently outside the opt-out.
**Fix:** Offer a discoverable, **non-geo-gated** opt-out from personalized recommendations (TikTok's is EU+Kazakhstan-only; Netflix has none) and granular per-signal control instead of all-or-nothing [F26, F24].

### 5. AT-03 — Scope the platformed "10% → 0% hallucination" claim to the empirical floor (S0, High, Observed)
**Surface:** Anthropic Citations blog — Endex customer testimonial.
**Leverage: medium-high.** First-party announcement page; a copy fix, low cost, high credibility impact.
**Fix:** Contextualize/qualify the platformed customer elimination claim ("on this customer's workload") and add a one-line fallibility statement that Citations reduces but does not eliminate hallucination [F28, F15]. Keep the (correct, qualified) first-party framing.

---

## Tier 2 — Medium severity (fix after Tier 1)

### 6. AT-09 — Surface inline, glanceable grounding instead of click-gated sources (S6, Medium, Inferred)
**Surface:** Google AI Overviews / Bing / DuckDuckGo.
**Leverage: high, cross-surface** — but Medium because it is the cost dimension of provenance already present.
**Fix:** Show supporting evidence inline (visible without navigation) rather than a click-to-verify link the literature shows goes unused [F18, F5].

### 7. AT-08 — Add "why this was recommended" inspection (S2, Medium, Inferred)
**Surface:** YouTube / Netflix recommendation surfaces.
**Fix:** Pair the recommendation control with a per-item explanation naming the driving signals, so the user can see *and* steer (the inspect-plus-control Pass pattern) [F21].

### 8. AT-06 — Make recommender feedback effects previewable/visible (S4, Medium, Inferred)
**Surface:** TikTok / YouTube / Netflix.
**Fix:** When a user gives feedback, preview or highlight the effect on future output immediately [F22] rather than relying on "helps improve" language a user cannot verify [F23]. (Adaptation is already disclosed — PO-03 — so this is the next layer, not a silent-adaptation fix.)

### 9. AT-04 — Anchor instant-answer citations to the supporting span (S2, Medium, Observed)
**Surface:** DuckDuckGo instant answer.
**Fix:** Deep-link or inline-quote the cited span so faithfulness is checkable in-place [F17, F18]. (The faithfulness check passed for this instance — PO-01 — so this is about letting the user verify the *next* one, not fixing an exercised failure.)

---

## What was NOT remediated (and why) — calibration

- **No Critical issued.** Every audited surface drives a non-destructive, reversible AI action, so the S0/S1/S3 Critical preconditions (high-stakes AND irreversible) never opened. Issuing a Critical here would manufacture drama the evidence does not earn.
- **No silent-adaptation [F20] High.** All three recommenders disclose the fact of adaptation (PO-03); firing it would contradict the evidence.
- **No manufactured-trust [F3] / placebo-control [F23] finding claimed true.** No placebic confidence display was found, and the behavioral placebo test (toggle a control, watch output) was not run live — parked as AT-OQ-02, not asserted.
- **Recommender Highs/Mediums held Inferred.** Documented scope justifies the severities; promotion to Observed (and possible escalation of AT-07) requires the live behavioral tests in AT-OQ-02.

This run supersedes the `pt0-perplexity` doc-fallback (0 Observed findings, Section 7 Fail). Here: 4 Observed findings and a Section 7 Pass on a real, reproducible failure case.
