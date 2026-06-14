state: Pressure-tested v0.1.0
audit_prefix: AT
catches: forced trust, opaque AI behavior, no recovery from AI mistakes, no provenance

# AI Trust Surface Audit

## What burden this catches

This audit catches AI-mediated surfaces that work beautifully when the model is right and abandon the user when it is wrong. It catches forced trust (AI output with no way to inspect, undo, or trace it), opaque AI behavior (silent adaptation, manufactured confidence, placebic explanations), no recovery from AI mistakes (irreversible actions with no undo, correction loops that swallow feedback), and no provenance (un-attributable claims, citations shown but unverified or unfaithful, "hallucination-free" overclaims retrieval does not earn).

Most "AI quality" reviews answer "is the model good?" This audit answers "can a user safely depend on this surface *when the model is wrong* — which it will be?"

The audit's law:

> A surface that asks a user to accept AI output it gives them no way to inspect, undo, or trace has not earned trust — it has displaced the cost of the AI being wrong onto the user. Forced trust is not trust; it is unrecoverable risk wearing a confident face.

## Sections

| # | Key | What it asks |
|---|---|---|
| 0 | `source_provenance` | Is every consequential factual claim attributable to an identified, inspectable source? |
| 1 | `reversibility` | Can the user undo, cancel, or recover from an AI-driven action? |
| 2 | `inspection_affordances` | Can the user see what the AI used / retrieved / removed, cheaply enough to actually verify? |
| 3 | `confidence_communication` | Is uncertainty surfaced, calibrated, and actionable — or manufactured? |
| 4 | `adaptation_transparency` | When the AI adapts, is the user told, and can they see + preview the effect? |
| 5 | `user_control` | Is there granular, real control and a discoverable opt-out for consequential automated decisions? |
| 6 | `configuration_cost` | Can the user reach the trust/provenance/control affordances without excessive cost? |
| 7 | `evidence` | Was the audit run against realistic AI *failure*, not just the happy path? |

## State

**Pressure-tested v0.1.0.** The eight sections are written, grounded in 30 verified empirical findings, and validated by one pressure test against a real target — the rubric did not change. PT0 ([`evidence/pt0-bing/`](evidence/pt0-bing/), 2026-06-14) ran against **Bing SSR search** plus fetch-verified first-party AI-trust docs (Google AI Overviews, DuckDuckGo, the TikTok/YouTube/Netflix recommender-transparency triad, the Anthropic Citations announcement): **5 High / 4 Medium, 4 Observed findings, 2 open questions, overall `warn`** (no section Fail, no Critical). Section 7 passed on a reproducible Bing misfire (a query returned dictionary results while still rendering the "Content was generated with AI" label with no confidence cue).

An earlier attempt against Perplexity ([`evidence/pt0-perplexity/`](evidence/pt0-perplexity/)) hit a 403 wall and could only produce a doc-fallback that failed Section 7's process gate; a target-discovery study swarm re-targeted to the fetchable Bing surface, which supersedes it. Per [`../../shared/audit-lifecycle.md`](../../shared/audit-lifecycle.md), this audit is now listed in the root README's "Current audits" table.

The PT0 target shortlist is in [`evidence/PT0-candidates.md`](evidence/PT0-candidates.md). See [`CHANGELOG.md`](CHANGELOG.md) for version history, the external-verification trail, the PT0 result, and dropped citations.

## Boundary with the Cognitive Load audit

Source provenance overlaps the [Cognitive Load audit's Section 4 — AI Compression Risk](../cognitive-load/RUBRIC.md). The boundary is resolved by **reference-and-extend**:

- **Cognitive Load Section 4 owns the AI-summary source-provenance check**, with its severity precondition: Critical only when the user provided a source, the system fetched one, the UI implies grounding, or the output replaces an inspectable source with an uninspectable summary.
- **AI Trust Surface Section 0 extends it into a full provenance doctrine** — attribution as a testable property [F14], the "RAG does not eliminate fabrication" floor [F15], citation existence/support [F16], correctness-vs-faithfulness [F17], data/training provenance [F29] — and **adopts the same Critical precondition** so it does not over-fire on generic unsourced output. See the boundary note in [`RUBRIC.md`](RUBRIC.md).

## Files

| Path | What |
|---|---|
| [`RUBRIC.md`](RUBRIC.md) | Canonical audit doctrine — 8 sections, AI Trust Surface Law, severity preconditions, research grounding |
| [`skill/SKILL.md`](skill/SKILL.md) | Executable skill that runs the audit |
| [`schemas/finding.extensions.json`](schemas/finding.extensions.json) | AI-trust-specific extension to the base finding schema (`at_trust_pattern`, `hax_phase`) |
| [`CHANGELOG.md`](CHANGELOG.md) | Version history, external-verification trail, dropped citations |
| [`evidence/PT0-candidates.md`](evidence/PT0-candidates.md) | Ranked PT0 target shortlist + exit criteria |

## Research grounding

The rubric's doctrine is anchored in 30 verified empirical findings (the HAX and PAIR human-AI guideline frameworks, the trust-in-automation calibration model, AI-assisted-decision-making and over-reliance studies, the AIS attribution framework, RAG-faithfulness and AI-search-citation studies, adaptation-transparency and placebo-control studies, and GDPR Art. 22). Each finding is connected to the specific section, question, or severity rule it justifies. The citations were checked by an external retrieval-oracle verifier plus two non-Claude groundedness families; one misattributed-duplicate candidate was dropped (see [`CHANGELOG.md`](CHANGELOG.md)). See the **Research grounding** section near the top of [`RUBRIC.md`](RUBRIC.md).

## Hard-failure patterns this audit detects

1. **forced_trust** — no inspect/undo/trace path; the user must accept AI output as-is (Sections 1 / 2 / 5).
2. **manufactured_trust** — confidence or explanation that raises trust without conveying decision-relevant information; placebic (Section 3).
3. **invalid_provenance** — a citation or source shown but unverified or unfaithful, or a "hallucination-free" overclaim (Sections 0 / 2).
4. **placebo_control** — a control present but with no observable effect on output, or silent adaptation (Sections 4 / 5).

At PT0 (Bing SSR), `forced_trust` and `invalid_provenance` were exercised (`true`); `manufactured_trust` and `placebo_control` were looked for and not exercised on these targets (`false`). See [`evidence/pt0-bing/`](evidence/pt0-bing/).

## How to invoke

If running through Claude Code or the skill harness:

> Run AI trust surface audit on `<target>`

See [`skill/SKILL.md`](skill/SKILL.md) for the full trigger list, inputs, outputs, and procedure. Remember to exercise a wrong/fabricated AI output — Section 7 cannot pass on the happy path alone.
