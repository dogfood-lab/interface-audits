# Roadmap

This file is the forward plan for `interface-audits`. It is **not** a marketing roadmap; it is the working punch list for "what we pick up when we sit back down at this repo."

Maintenance rule: when a roadmap item ships, **move it to `CHANGELOG.md`** under the version that shipped it; remove it from here. The roadmap should always reflect "what's pending," never "what we did."

---

## Vision

A library of audits that catch the user-burden failures **generic accessibility scanners miss**. Scanners catch WCAG violations. Each audit in this library catches a specific shape of failure that passes scanners but still imposes real cost on users.

Each audit ships four things — Rubric, Skill, Schema, Evidence — and advances through five lifecycle states — Draft → Pressure-tested → Frozen → Dogfooded → Revised. **No evidence, no official audit.**

---

## Current state (v0.1.0)

| Audit | State | Catches | Calibration evidence |
|---|---|---|---|
| cognitive-load | Frozen v0.2 + Dogfooded once | Load displacement, hidden complexity, AI trust burden, state-shift failure | PT0, PT1, PT2-doc-fallback, Dogfood-1 |
| low-vision | Draft (authored 2026-06-02, externally hardened) | Visual access under real density (zoom/reflow, contrast on photos & charts, focus under custom themes, spatial orientation, magnifier behavior) | — (PT0 pending) |
| screen-reader-task | Draft (authored 2026-06-02, externally hardened) | Task continuity and completion through a screen reader (landmarks, action discoverability, route changes, dynamic updates, error recovery) — not just ARIA validity | — (PT0 pending) |
| color-dependence | Draft (authored 2026-06-02, externally hardened) | Meaning conveyed by color alone, including the contrast-pass / hue-fail boundary scanners cannot see | — (PT0 pending) |
| motor-access | Draft (authored 2026-06-02, externally hardened) | Interaction cost for motor-impaired users (keyboard path, target size, drag dependence, timeout pressure, undo) | — (PT0 pending) |

The 4 new Draft audits were authored by a parallel study swarm (16 research agents, 4 verifier agents, 4 author agents) and then hardened by a two-stage external-verifier pass: a retrieval oracle (WebFetch against every arXiv/DOI/W3C source, family-independent) and a decorrelated different-family LLM lens (Mistral + IBM Granite, via local Ollama). The oracle caught one fabricated DOI (CD F13 Sajek, resolving to an unrelated dental paper), five misattributions, and one ungrounded numeric figure — all fixed in the same commit. The LLM lenses produced only false positives, again confirming the protocol's prior receipt that parametric LLMs miss what retrieval catches. Per the lifecycle, Drafts are not listed in the [README](README.md)'s "Current audits" table until pressure-tested.

---

## Near-term — next sit-down

### NT-1 · Pressure Test 3 → cognitive-load v0.3

The `simple_mode_removes_power` hard-failure pattern remains uncalibrated. PT2 was Outlook Simplified Ribbon (doc-fallback) and produced no live-observed Removed case. v0.3 candidate sub-split (`removed_with_workaround` High vs `removed_without_equivalent` Critical) is parked.

**Target shortlist, ranked by likely calibration value:**

1. **Mobile vs desktop GitHub / Slack / Notion** — strong chance of real admin/workflow/review gaps named by the vendor.
2. **A product with explicit "Basic editor" vs "Advanced editor"** — best conceptual fit if a clean example exists.
3. **Android Easy Mode / Samsung Easy Mode** — strong OS-level "simplified mode removes power" candidate.
4. **SaaS Free vs Pro tier** — clean "feature unavailable" evidence; weakest cognitive-load fit (pricing-tier removal isn't quite the same as simplification).

**Exit criteria:** at least one Section 5 finding classified `removed` with severity assigned per the sub-split, observed live (not via vendor docs).

### NT-2 · Close OQ-01 (Lighthouse / axe scanner pass)

Carried forward through PT0, PT1, PT2-doc-fallback, Dogfood-1. Section 1 (Measurable Defaults) cannot fully Pass without quantitative WCAG conformance numbers. Plan: add `npm run verify:wcag` step that runs Lighthouse + axe-core against the repo's own handbook URL, attaches a JSON report to `audits/cognitive-load/evidence/<run-id>/scanner-pass.json`. Treat scanner output as Section 1 measurement, not Section 1 judgment.

### NT-3 · First PT0 against one of the 4 new Drafts

Four Draft audits now exist: [low-vision](audits/low-vision/), [screen-reader-task](audits/screen-reader-task/), [color-dependence](audits/color-dependence/), [motor-access](audits/motor-access/). The next step for each is **its first pressure test**, which advances it Draft → Pressure-tested. Each audit ships a ranked PT0 target shortlist in `audits/<slug>/evidence/PT0-candidates.md`.

Recommended ordering (cheapest calibration first):
1. **Color-dependence** — the Contrast-Pass / Hue-Fail boundary rule is the audit's load-bearing claim and needs a live target to calibrate. Candidate: a CI dashboard or monitoring tool with red/green status badges and a multi-series chart.
2. **Motor-access** — best target is a long government / banking multi-step form with a session timeout (Reuschel 2023's 27× exposure ratio); calibrates Sections 3 and 4 in one run.
3. **Low-vision** — the `LV-STICKY-BLOCK` 30% threshold and the "focus reset on every reflow" Critical bump are parked candidates waiting on a real target.
4. **Screen-reader-task** — needs AT/browser-pair coverage on a route-driven SPA to exercise SR-TC-1/2/3 (the route-change announcement gap).

Each PT0 is independent and can run in any order; this is the recommended ordering by calibration value, not a hard sequence.

---

## Audit family — medium-term

Each audit declares the same three header fields in its README: `state:`, `audit_prefix:`, `catches:`. Each audit adds its own extension schema; it does not redefine base fields.

The 4 Draft audits (`low-vision`, `screen-reader-task`, `color-dependence`, `motor-access`) authored 2026-06-02 used to live in this section as proposals; they are now real Drafts in the repo (see **Current state** above). The remaining medium-term proposals are:

### AI Trust Surface Audit (prefix: `AT`)

**Catches:** Forced trust, opaque AI behavior, no recovery from AI mistakes, no provenance.

Proposed sections:

0. Source provenance (the cognitive-load audit's Section 4 generalized)
1. Reversibility (can the user undo or revert an AI-driven action?)
2. Inspection affordances (can the user see what the AI used? what it removed?)
3. Confidence communication (is uncertainty visible, or hidden behind confident phrasing?)
4. Adaptation transparency (when the AI adapts, is the user told? can they opt out?)
5. User control (granular vs all-or-nothing)
6. Configuration cost
7. Evidence

**Reference inputs:** Microsoft HAX Toolkit (Amershi et al. CHI 2019 — Guidelines for Human-AI Interaction, G1–G18 across four phases: Initially / During / When Wrong / Over Time), Anthropic's safety/policy guidance, the cognitive-load audit's Section 4 (already calibrated by PT0 + the severity precondition).

### Motion Sensitivity Audit (prefix: `MO`)

**Catches:** Vestibular triggers, animation respect, prefers-reduced-motion handling.

Proposed sections:

0. Animation (parallax, scroll-jacking, transitions over 250ms)
1. Loading motion (spinners, skeletons, progress)
2. Vestibular trigger patterns (large area movement, depth illusions)
3. `prefers-reduced-motion` respect
4. Auto-playing media
5. Configuration cost
6. Evidence

**Reference inputs:** WCAG 2.3 (Seizures and Physical Reactions), Vestibular Disorders Association motion-trigger taxonomies.

---

## Tooling — long-term

### TL-1 · Runner CLI

Currently audits are invoked by asking Claude "Run cognitive-load audit on `<target>`." A real CLI replaces that with `audit run cognitive-load --target <url>` and produces evidence files directly. Probably `@dogfood-lab/audit-cli` on npm. Removes the `"private": true` flag on `package.json` when this lands. Triggers `SHIP_GATE.md` "Future applicability" items — re-check A5 / A6 / B2 / B3 / C4 / C5.

### TL-2 · Runner MCP server

An MCP server that exposes each audit as a tool. Claude (or any MCP-compatible runner) invokes it natively without prompt-engineering. Probably `@dogfood-lab/audit-mcp` on npm. Triggers `[mcp]`-tagged shipcheck items — re-check A7 / A8 / B4 / B5 / C6.

### TL-3 · Schema v2

Candidates that have accumulated and need a real version cut:

- Section 5 sub-shape split (`removed_with_workaround` / `removed_without_equivalent`) — adopt after PT3 produces live-observed Removed evidence
- `vendor_documented` field on Inferred findings (for doc-fallback runs — flag that the inference is from vendor docs not framework class)
- Audit-prefix collision check (across all audits at validation time)
- Optional `screenshot_refs[]` field on findings for evidence file references

### TL-4 · Self-audit cadence

The repo's own handbook should be re-audited by its own cognitive-load audit on a schedule — quarterly, or after substantial structural changes. Already mentioned in `.github/workflows/verify.yml` as a reminder; should become a `.github/workflows/self-audit.yml` that creates an issue listing findings (not a PR — findings inform manual remediation).

### TL-5 · WCAG 3.0 alignment

W3C WCAG 3.0 is in working draft and will eventually supersede WCAG 2.x. When it stabilizes, the "Measurable Defaults" section of cognitive-load (and the Low-Vision audit's full doctrine) will need to evolve. Park until WCAG 3 hits Candidate Recommendation status.

### TL-6 · Translations for handbook pages

Currently only `README.md` is translated. As the handbook grows, the 7 Starlight pages may need translations too. Polyglot-mcp handles it locally on TranslateGemma 12B. Not urgent until the handbook content matures.

---

## Process rules (load-bearing)

These are the rules that keep the audit honest. Carried forward from doctrine ratchets earned during v0.1.0:

1. **Never apply `v0.x → v1.0.0` mechanically.** That rule was written for mcp-tool-shop-org tool repos shipping their first stable release. A new monorepo or audit at v0.1.0 stays at v0.1.0 until breaking changes warrant a major bump. v1.0.0 is reserved for "schema and shared norms are stable enough that breaking changes warrant a major bump."

2. **Verify scripts must be real, not stubs.** `scripts/verify-schemas.mjs` and `scripts/verify-links.mjs` are working AJV + filesystem validators. Anything new added to the repo should be schema-valid and link-clean on every PR. The verify pipeline caught two real bugs in v0.1.0 evidence; that's the floor.

3. **`Inferred` is the brake against overclaiming.** A pressure test designed to find a specific failure shape (e.g. "find a Removed-power case") is at structural risk of over-fitting. Start findings at the most conservative evidence state and re-check after the run completes. Reclassification on second pass is the audit working, not the audit failing.

4. **SKIP items get applicability reasons + a Future applicability punch list.** Don't blanket-SKIP "because it's just docs." Don't write "N/A." Treat SKIP'd `[mcp]` `[cli]` `[vsix]` `[desktop]` items as a working list of "re-check when this surface ships." `SHIP_GATE.md` has the table.

5. **Translations run locally.** Per `~/.claude/CLAUDE.md` standing rule. Advisor sessions have permission; Sonnet kickoff sessions defer to user. Either way: never inside Claude's context.

6. **Each audit must declare what it catches.** README header line: `catches: <one-line description>`. If an audit can't crisply name what burden it catches that generic scanners miss, it's not ready for Draft state.

7. **Past evidence is frozen.** When a rubric advances, evidence from past runs is not rewritten. Each `evidence/<run-id>/` is a historical record of what the rubric caught at that point in time. Use `original_rubric_note` field if the rubric path moved (as it did during the migration into the monorepo).

---

## Pressure-test cadence rule

| To enter state | Required |
|---|---|
| Pressure-tested | At least 1 PT in `evidence/<pt-id>/` |
| Frozen | A PT where the rubric did **not** change |
| Dogfooded | At least 1 dogfood run with no rubric change |
| Revised (new version) | A PT or dogfood produced calibrating evidence |

A pressure test that revises the rubric earns a new minor version. A dogfood run that triggers a rubric change is a signal to elevate it to a pressure test and run again with the PT framing.

---

## External dependencies (parked, monitor)

- **WCAG 3.0** — W3C working draft. When it stabilizes, revisit Measurable Defaults across audits.
- **Microsoft HAX Toolkit** (Amershi et al. CHI 2019, "Guidelines for Human-AI Interaction") — informs AI Trust Surface audit doctrine. 18 guidelines across four phases (Initially / During interaction / When wrong / Over time).
- **Apple Human Interface Guidelines (Accessibility section)** and **Google Material Design (Accessibility)** — informs platform-specific extensions of Low-Vision / Motor Access audits.

---

## How to use this roadmap when sitting back down

1. **Pick a near-term item** (NT-1, NT-2, NT-3) and load the relevant context. Most of the context lives in `audits/cognitive-load/evidence/` (calibration records) and `shared/` (norms).
2. **If picking up a new audit:** read `shared/pressure-test-protocol.md` first, then `audits/cognitive-load/RUBRIC.md` as a reference implementation. Author the new audit's `RUBRIC.md` in `audits/<name>/` with `state: Draft` in the README header.
3. **If picking up tooling (TL-*):** scan `SHIP_GATE.md` "Future applicability" — those SKIP'd items become the work surface when the tooling ships.
4. **When something ships, move its entry from this file to `CHANGELOG.md`** under the version that shipped it. The roadmap stays a working list.

---

*Last updated: 2026-05-12. v0.1.0 ship state.*
