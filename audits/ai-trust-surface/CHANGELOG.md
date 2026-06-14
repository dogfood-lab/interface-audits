# Changelog — AI Trust Surface Audit

All notable changes to the **AI Trust Surface Audit** rubric and skill.

This file follows [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/). Rubric versions are independent of the monorepo version. The current rubric is **Pressure-tested** (`0.1.0`) — one PT0 landed and the rubric did not change.

The rubric ([`RUBRIC.md`](RUBRIC.md)) is canonical. The skill ([`skill/SKILL.md`](skill/SKILL.md)) follows. Pressure-test evidence under `evidence/<run-id>/` is frozen against the rubric version it ran on and is not rewritten when the rubric advances.

## [Unreleased]

### Added — Draft rubric authored (study-swarm, research-grounded); externally verified; not yet pressure-tested — 2026-06-13

- Initial 8-section rubric: Source provenance, Reversibility, Inspection affordances, Confidence communication, Adaptation transparency, User control, Configuration cost, Evidence.
- **AI Trust Surface Law** and framing line: *"This audit does not ask whether the AI is accurate. It asks what happens when it is wrong — whether the user can see what the model used, undo what it did, calibrate how much to rely on it, and trace any claim back to a source they can check."*
- **Research grounding** section anchoring doctrine in **30 verified empirical findings** (HAX and PAIR human-AI guideline frameworks; the Lee & See trust-in-automation calibration model; AI-assisted-decision-making and over-reliance studies; the AIS attribution framework; RAG-faithfulness and AI-search-citation studies; adaptation-transparency, dark-pattern, and placebo-control studies; Horvitz mixed-initiative principles; Nielsen heuristic 3; GDPR Art. 22). Each finding is connected to a specific section, question, or severity rule. Every numbered finding is referenced by at least one section.
- **Finding format** referencing the shared contract in [`../../shared/finding-format.md`](../../shared/finding-format.md), with the `Load displaced to:` field using the **shared, fixed 11-value enum** — the audit adds no new displacement values and maps AI-trust failures onto the shared enum via a mapping table (e.g. forced trust → `trust`; hidden/unfaithful source → `source recovery`; no-undo AI action → `recovery / undo`).
- **Severity definitions** referencing [`../../shared/severity-model.md`](../../shared/severity-model.md) (Critical / High / Medium / Low; section-Fail = 1 Critical OR 3 Highs), with domain preconditions:
  - **Section 0 provenance precondition (adopted from Cognitive Load Section 4):** Critical applies **only** when the AI claims or implies a verifiable basis — cites a source, says "based on your data," or is marketed grounded / hallucination-free — and that basis is not inspectable or not faithful. Generic unsourced output with no claimed basis is High/Medium provenance ambiguity. Prevents over-firing.
  - **Section 3 confidence precondition:** a displayed confidence value with no calibration evidence is High (miscalibration is actively harmful [F2]); a placebic / manufactured-trust explanation is High [F3]; overconfidence is the higher-severity direction and is Critical when the action is high-stakes AND irreversible (cross-link Section 1).
  - **Section 5 control precondition:** a control with no observable effect on output is an automatic High (placebo [F23]) — self-reported satisfaction cannot verify a control works.
- **Boundary resolution with Cognitive Load Section 4** (AI Compression Risk): reference-and-extend. Cognitive Load owns the AI-summary source-provenance check *with* its Critical precondition; AI Trust Surface Section 0 extends it into a full provenance doctrine (attribution as a testable property [F14], retrieval does not eliminate fabrication [F15], citation existence/support [F16], correctness-vs-faithfulness [F17], data/training provenance [F29]) and adopts the same Critical precondition. No duplication.
- **Four hard-failure patterns** the rubric is built to catch: `forced_trust`, `manufactured_trust`, `invalid_provenance`, `placebo_control`. Mirrored in the skill's `hard_failure_patterns_validated` scorecard block.
- **`at_trust_pattern` and `hax_phase` extension fields** ([`schemas/finding.extensions.json`](schemas/finding.extensions.json)) — optional classification of a finding by its trust-failure pattern and by the HAX four-phase temporal spine (Initially / During / When-wrong / Over-time). Additive only; does not redefine any base field and does not extend the shared load-displaced-to enum.
- **Automatable-vs-judgment cut table** documenting the scanner gap: only citation-link existence and the presence of a control are checkable; the highest-impact failures (uncalibrated confidence [F2], unfaithful citation [F17], placebo control [F23], silent adaptation [F20]) are all judgment and behavioral.
- Standalone [`skill/SKILL.md`](skill/SKILL.md) split from the rubric. Rubric is canonical; skill follows.
- PT0 target shortlist in [`evidence/PT0-candidates.md`](evidence/PT0-candidates.md).

### Hardened — external-verifier pass (retrieval oracle + two non-Claude groundedness families)

Two-stage citation hardening per the research-grounded-advisor protocol. The candidate set was de-duplicated from 38 candidates to 30 unique sources (recurring sources — Zhang/Liao/Bellamy, Buçinca, Vasconcelos, Amershi HAX, Si 2023 — counted once). **Existence:** all 30 unique sources resolved as confirmed via WebFetch / WebSearch against arXiv abstract pages, ACM / SAGE / DOI landing pages, nngroup, gdpr-info, pair.withgoogle.com, and the CJR / Tow Center page — none fabricated, none flagged cannot_confirm. **Groundedness:** both decorrelated non-Claude families (`mistral-small:24b` and `granite4.1:30b`) ran reasoning-stripped, receiving only `{claim, source_title, abstract_snippet}` and never the Claude verdicts. Agreement was high (28/30 unanimous SUPPORTED or SUPPORTED+UNSURE). Five items drew a single NOT_SUPPORTED from mistral while granite returned SUPPORTED or UNSURE (Vasconcelos #5, Rashkin #14, He & Liu #18, PAIR #30) — none NOT_SUPPORTED by *both* families, so all KEEP per the OR rule; mistral's lone NOT_SUPPORTEDs read as snippet-thinness false negatives on methods-heavy abstracts. **Result: 30 verified KEEP findings (renumbered 1–30), 1 dropped, 0 flagged.**

**Attribution corrections baked into the grounding by the verifier (preserved verbatim in the rubric):**

- **Li et al. miscalibrated-confidence** year corrected 2025 → **2024** (arXiv submitted Feb 2024).
- **Rashkin AIS** year set to **2021** (arXiv submission; the candidate's 2023 was the ACL publication year). Identifier kept as canonical arXiv:2112.12870.
- **Vasconcelos** year set to **2022** (arXiv; IUI publication 2023).
- **Honeycutt** and **Wallat** author lists expanded to their leading authors.
- **Eiband** DOI url repointed from a dblp record to the ACM DOI.
- **Lee & See** url repointed to the SAGE DOI page.
- **Schoeffer** kept DOI 10.1145/3613904.3642621 with an arXiv mirror as the url.

### Dropped — 1 citation excluded (not in the rubric)

- **Si et al. "fact-checking accuracy" facet (orig candidate #22 / AT-Q3).** **DUPLICATE + misattributed numeric.** It cited the same Si et al. 2023 source as kept finding **F19** (*LLMs Help Humans Verify Truthfulness… Except When Convincingly Wrong*). Its distinctive numeric claim — ~0.74 vs ~0.59 fact-checking accuracy and a "hybrid AI-generated background" manipulation — does not appear in that paper's abstract/scope and reads as misattributed from a different fact-checking-evidence study; one groundedness family returned NOT_SUPPORTED and the other UNSURE. The substantive design implication (expose genuinely-retrieved evidence; label retrieved-source vs AI-paraphrase) is already carried by surviving **F19**, so the facet was dropped rather than kept as a load-bearing but ungrounded numeric. This is the only item that drew NOT_SUPPORTED-or-UNSURE from *both* families, and it was independently dropped as a duplicate.

### Pressure-tested — PT0 (Bing SSR + first-party AI-trust docs) — 2026-06-14

**Draft → Pressure-tested. The rubric did not change.** Run id [`evidence/pt0-bing/`](evidence/pt0-bing/). Evidence mode: Path 2 (fetched SSR markup + first-party trust docs). Primary target **Bing SSR search**; complementary fetch-verified first-party sources: Google AI Overviews help, DuckDuckGo HTML instant answer (+ its cited Wikipedia source, for a real citation-faithfulness check), the TikTok / YouTube / Netflix recommender-transparency triad, and the Anthropic Citations announcement.

**Result: 5 High / 4 Medium / 0 Critical, 2 open questions, 3 positive observations, overall `warn`** (no section Fail). **4 findings reached Observed** — the Bing "Content was generated with AI" provenance label renders byte-identically across clean, ambiguous, false-premise, and outright-misfire queries, and the DuckDuckGo instant-answer citation was validated for existence AND faithfulness against its cited Wikipedia source (passed → PO-01). Worst section is User control (2 Highs: Google AI Overviews has no opt-out for the core feature; recommender opt-out is geo-gated / all-or-nothing) — `warn`, below the 3-High Fail threshold.

**Section 7 passed on a real, reproducible failure case** — the `how does mRNA vaccine work` query misfired to dictionary results for the word "does" while still rendering the AI label with **no confidence / uncertainty cue**. This is the exact gap the first attempt could not produce.

**Discipline rule (no over-firing):** no Critical fired. The S0 Critical-precondition was evaluated and correctly did not trigger — the Anthropic post's first-party copy stays qualified ("minimize hallucinations"), so AT-03 held **High, not Critical** (the absolute "10% → 0%" figure it platforms is a customer testimonial, not first-party copy). The S3 finding fired the absence-of-confidence-signal rule [F1] only, not the miscalibration rule [F2] / [F3], because Bing renders no confidence display to miscalibrate (caps at High). The silent-adaptation High [F20] was explicitly **not** fired because all three recommenders disclose the fact of adaptation (PO-03). `forced_trust` and `invalid_provenance` were exercised; `manufactured_trust` and `placebo_control` were looked for and not exercised on these targets.

**Superseded:** an initial attempt against Perplexity ([`evidence/pt0-perplexity/`](evidence/pt0-perplexity/)) 403-walled WebFetch and fell to a doc-fallback that produced 0 Observed findings and failed Section 7's process gate. A target-discovery study swarm (3 scout agents that actually WebFetched candidates + 1 ranker) re-targeted to the fetchable Bing surface. The Perplexity run is retained as honest evidence of the wall and the re-targeting decision.

**Revision candidates parked** (per the discipline rule — none load-bearing, carried to a future PT): an answer-quality-invariant provenance-label sub-pattern for S0/S3 (Bing's label is decoupled from answer quality — neither absent nor a miscalibrated number); a platformed-third-party-overclaim note for S0; a geo-gated-opt-out refinement under S5/F26 (TikTok's EU + Kazakhstan-only opt-out = functionally absent for most users); and an evidence-strength ladder (first-party doc vs vendor marketing vs SSR markup vs live runtime).

### Next

- **PT1 (Pressure-tested → Frozen).** A second pressure test on a different AI surface where the rubric again does not change freezes the rubric at v0.1.0. A live signed-in session that triggers a wrong answer and inspects its citations end-to-end (converting the open questions AT-OQ-01/02 to Observed) is the strongest PT1.

[Unreleased]: https://github.com/dogfood-lab/interface-audits/commits/main
