# AI Trust Surface Audit — PT0 target shortlist

This is the ranked candidate list for **Pressure Test 0** of the AI Trust Surface Audit. It mirrors the structure of [`../../../ROADMAP.md`](../../../ROADMAP.md)'s NT-1 shortlist: candidate targets, why each is a good calibration target, and the PT0 exit criteria.

These are **candidates, not completed runs.** No PT0 has been run yet. This audit is `state: Draft` (see [`../README.md`](../README.md)). When PT0 runs, its outputs land in `evidence/pt0/` and this audit advances to Pressure-tested.

## What PT0 needs to calibrate

PT0 exists to prove the rubric survives contact with a real, public AI surface without inventing drama, and to exercise the four hard-failure patterns:

1. **forced_trust** — no inspect/undo/trace path (Sections 1 / 2 / 5)
2. **manufactured_trust** — placebic confidence/explanation (Section 3)
3. **invalid_provenance** — citation shown but unverified/unfaithful, or "hallucination-free" overclaim (Sections 0 / 2)
4. **placebo_control** — control with no observable effect, or silent adaptation (Sections 4 / 5)

A strong PT0 target is a **real, public AI surface auditable via WebFetch** — its DOM/markup must expose the trust affordances (citations, confidence, "view sources," undo, opt-out) so they can be inspected without an auth gate or a live login. It should be **citation-forward and consequential** (so provenance and inspection have something to bite on), and it must let the auditor reach a **sub-optimal / wrong / fabricated output**, since Section 7 cannot pass on the happy path. The best target stresses the scanner-invisible sections (S0 faithfulness, S3 calibration, S5 placebo), not just the presence of a control.

The ranking axis below is **how much of S0 (provenance), S2 (inspection), and S3 (confidence) is observable in fetched markup** — those are the sections most legible to WebFetch, and the ones the audit's law turns on.

## Target shortlist, ranked by observable S0 / S2 / S3 in fetched markup

### 1. Perplexity.ai — citation-forward AI search

- **Why it's the strongest calibration target:** Perplexity renders inline numbered citations, a source list, and per-answer "sources" affordances directly in the answer DOM — exercising **S0** (is every consequential claim tied to an inspectable source?), **S2** (are sources shown inline and glanceable, or gated behind a click users won't make [F18]; is the panel evidence or model prose [F19]?), and **S3** (is any confidence/quality signal calibrated, or manufactured [F2, F3]?) all in one fetched page. It also has **no undo of an AI-driven edit** in the answer flow, which exercises **S1**.
- **Patterns it likely exercises:** invalid_provenance (citation correctness vs faithfulness [F16, F17]), manufactured_trust (S3), forced_trust (no inspect-deep/undo path).
- **Expected headline finding:** a citation rendered inline and topically relevant but **not tied to the specific supporting span** — faithfulness uncheckable [F17] — and/or a confident answer over an un-verified citation with no disclaimer [F16]. The discriminator is correctness-vs-faithfulness, which a presence-only check misses.
- **How to reach a failure case:** query a fast-moving or niche-news topic where the literature shows citation error is highest [F16], then check whether each linked source actually resolves and supports the claim.

### 2. A consumer AI-search engine with known citation-error rates (You.com, Brave/Leo summary, an AI-answer SERP module)

- **Why it's a good calibration target:** the Tow Center study [F16] measured exactly this class — eight consumer AI search engines, citations wrong in >60% of tests, premium tools *more* confidently incorrect. These surfaces render an AI summary plus citation chips in fetched markup, so **S0** and **S2** are directly observable, and the documented confident-but-wrong behavior makes **S3** (no disclaimer on an un-verified answer) a near-guaranteed finding.
- **Patterns it likely exercises:** invalid_provenance, manufactured_trust.
- **Expected headline finding:** a confidently-presented answer with a citation that does not resolve or does not support the claim, and **no disclaimer / no resolvability check** [F16] — the empirical floor for this class.
- **Risk:** some render the summary client-side after JS; if WebFetch only sees a shell, fall back to documented behavior + screenshot and mark findings Inferred per the evidence caveat.

### 3. Google AI Overviews / Gemini answer module

- **Why it's a good calibration target:** AI Overviews inject a generated answer above organic results with source links, exercising **S0** (provenance of a consequential answer the user may not realize is generated) and **S4** (is the *fact* that this is AI-generated and curated disclosed, or does it read as neutral search output? [F20]). Gemini's chat surface adds **S1** (undo/termination of a running response) and **S5** (controls over what it remembers/personalizes [F9]).
- **Patterns it likely exercises:** invalid_provenance, placebo_control / silent-adaptation (S4).
- **Expected headline finding:** a generated answer presented with insufficient disclosure that it is AI-generated and curated [F20], and/or source links that do not back the specific summarized claim [F16, F17].
- **Risk:** AI Overviews are query- and region-gated and may not render to WebFetch; treat as a documented-behavior + screenshot run if the live module doesn't appear.

### 4. Microsoft Copilot / Bing Copilot (Chat answer with citations)

- **Why it's a good calibration target:** Copilot renders numbered citations and a "see more" source affordance, exercising **S0** and **S2**, and is built on the HAX guidelines this rubric's spine is drawn from [F9] — making it a fair test of whether a HAX-informed product actually delivers inspectable provenance, calibrated confidence, and graceful failure [F30]. It also has explicit feedback controls (thumbs up/down), exercising **S1** (does correction change anything? [F11]) and **S5** (placebo test [F23]).
- **Patterns it likely exercises:** invalid_provenance, forced_trust, placebo_control (feedback with no visible effect).
- **Expected headline finding:** feedback controls whose downstream effect is invisible [F11, F22], or a citation drawer that shows the source but not the supporting span [F17].
- **Risk:** auth/region gating; client-rendered. Documented-behavior fallback applies.

### 5. claude.ai — artifacts + citations (different audit lens from the cognitive-load PT0)

- **Why it's a valid but secondary target:** claude.ai was used for the cognitive-load PT0, but it is a **valid target under a different lens here** — the AI Trust Surface lens asks not "is the summary's source recoverable?" (Cognitive Load Section 4) but "across the whole surface, can the user inspect/undo/trace/control consequential AI output?" Artifacts exercise **S1** (can an AI-driven artifact edit be undone?), citations exercise **S0/S2**, and any personalization/memory exercises **S4/S5**.
- **Patterns it likely exercises:** forced_trust (S1 undo of an artifact edit), invalid_provenance (S0/S2 where citations appear).
- **Expected headline finding:** an AI-driven artifact change with a reversibility path that is present but not discoverable at the moment of the edit [F8, F13], distinct from the cognitive-load summary-provenance lens.
- **Risk:** overlap with the cognitive-load PT0 evidence; keep the lens explicitly the trust-surface one (inspect/undo/trace/control), and avoid re-deriving the AI-summary source-provenance check that Cognitive Load Section 4 owns. Best used as a complement, not the primary PT0.

## Recommended PT0 pick

**Target 1 (Perplexity.ai)** is the recommended primary, because it renders inline citations, a source list, and an answer-quality surface directly in fetched markup — exercising S0, S2, and S3 in one run — and because it lets the auditor reach the correctness-vs-faithfulness discriminator [F17] that separates this audit from a presence-only citation check. **Target 2 (a consumer AI-search engine with documented citation error)** is the strongest *complement* if PT0 is split across two surfaces, because its documented confident-but-wrong behavior [F16] reliably exercises invalid_provenance and manufactured_trust on a target where the failure case is easy to reach.

## PT0 exit criteria

PT0 is complete when, per [`../../../shared/pressure-test-protocol.md`](../../../shared/pressure-test-protocol.md):

- The run produced `evidence/pt0/ai-trust-surface-findings.md`, `evidence/pt0/ai-trust-surface-scorecard.json` (conforming to [`../../../shared/schemas/scorecard.base.schema.json`](../../../shared/schemas/scorecard.base.schema.json)), and `evidence/pt0/remediation-priority-list.md`.
- At least 5 findings, every one mapped to a rubric section, each with a recorded evidence state and the AI output (correct vs sub-optimal/wrong/fabricated) it was tested against.
- At least one **judgment/behavioral** finding (uncalibrated confidence, unfaithful citation, placebo control, silent adaptation, or no-undo) — not just the presence/absence of a control. This is the discriminator from a generic "does it cite sources?" check.
- At least two of the four hard-failure patterns marked `true` (exercised) or `false` (passed cleanly) in `hard_failure_patterns_validated` — not all `null`.
- **A sub-optimal / wrong / fabricated AI output was exercised** (Section 7) — a happy-path-only run cannot pass Section 7. The provenance findings must include at least one citation checked for *existence and support*, not just presence [F16, F17].
- S0's Critical precondition evaluated against an actual provenance claim (cited / "based on your data" / hallucination-free), or recorded as an open question if the claim was unknown — so the audit does not over-fire on generic unsourced output.
- Evidence gaps preserved as open questions (not laundered into Observed findings).
- The findings report obeys its own audit: plain language, structured headings, and itself cites the findings it makes.
- **Reclassification discipline applied:** any finding designed to fit the test's scope starts at the most conservative evidence state and is re-checked after the run. A second-pass downgrade is the audit working, and the reclassification trail belongs in the findings file's auditor-notes section.

If PT0 forces a rubric change, that change earns the first version cut and is recorded in [`../CHANGELOG.md`](../CHANGELOG.md), advancing the audit toward Frozen per [`../../../shared/audit-lifecycle.md`](../../../shared/audit-lifecycle.md).
