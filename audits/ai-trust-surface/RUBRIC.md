# AI Trust Surface Audit

> **AI Trust Surface Law**
>
> A surface that asks a user to accept AI output it gives them no way to inspect, undo, or trace has not earned trust — it has displaced the cost of the AI being wrong onto the user. Forced trust is not trust; it is unrecoverable risk wearing a confident face.

> This audit does not ask whether the AI is accurate. It asks **what happens when it is wrong** — whether the user can see what the model used, undo what it did, calibrate how much to rely on it, and trace any claim back to a source they can check.

## Purpose

Most "AI quality" reviews answer "is the model good?" This one answers "can a user safely depend on this surface *when the model is wrong* — which it will be?" — at the provenance layer, the reversibility layer, the inspection layer, the confidence layer, the adaptation layer, and the control layer.

It is intended for:
- Product reviews of AI-mediated surfaces where the output drives a consequential decision or action (AI search, research assistants, RAG copilots, summarizers, recommenders, agentic workflows, personalized feeds, automated decisioning)
- Self-audits by teams who measured model accuracy on a benchmark and assume that closes the trust question — it does not, because trust is about the *failure* path, not the average case
- Catching the failures that are invisible to an accuracy metric: a confidence number nobody calibrated, a citation that looks valid but does not support the claim, an "undo" that does not exist, a personalization the user never knew was happening, and a control that changes nothing

It is **not**:
- A model-accuracy or eval-set benchmark (measure that separately; this audit assumes the model is sometimes wrong and tests the surface around it)
- A general "is this AI feature useful?" review
- The Cognitive Load audit's AI-summary check — that audit owns the source-provenance question for AI *summaries* (its Section 4); this audit references and extends it into a full provenance and recovery doctrine (see the boundary note below)

## How to use this audit

1. Define the **target**: URL, app flow, AI feature, or component.
2. Define the **state**: the realistic decision-driving state, *and the failure state* — an output that is sub-optimal, wrong, or fabricated. An affordance demoed only on correct AI output is untested [F27]. This is Section 7.
3. Define the **stakes and reversibility** of the action the AI drives: a low-stakes draft suggestion and an irreversible automated decision are scored differently (the severity preconditions below gate on stakes × reversibility).
4. Walk the eight sections in order. Each produces zero or more findings.
5. Score each section: **Pass / Warn / Fail**. A Fail in any section blocks "AI Trust Surface Audited" status.
6. Output findings in the format specified later in this document.

Sections are ordered from the most settled and inspectable trust surface (provenance) toward the most behavioral and process-bound (control, configuration cost, evidence).

---

## Research grounding

This rubric's load-bearing doctrine is anchored in verified empirical findings. Each line is `N. **<finding>.** <authors> <year> (<identifier>). <design implication>.` Doctrine throughout the sections cites these by number. Citations without an architectural connection are noise; every number below is referenced by at least one section. These citations passed an external retrieval-oracle verifier plus two non-Claude groundedness families (see [`CHANGELOG.md`](CHANGELOG.md)); dropped and misattributed candidates were excluded.

1. **Displaying per-instance model confidence improved users' trust calibration, but calibration alone did not improve joint human-AI accuracy unless the human held complementary domain knowledge; local feature explanations added no calibration value.** Zhang, Liao & Bellamy 2020 (arXiv:2001.02114). Grounds S3's positive rule — a per-decision confidence signal is the minimum bar for any consequential AI output, and its absence is an S3 finding — but because calibration alone is insufficient, S3 does NOT score a confidence display as fully passing unless the user also has an inspection/override path (cross-links S2 and S5); a bare confidence number with no actionable affordance is a partial pass at best.
2. **Miscalibrated confidence harms decisions asymmetrically: overconfident displays inflate reliance on incorrect recommendations, while underconfident displays suppress reliance on correct ones, and both degrade decision efficacy.** Li et al. 2024 (arXiv:2402.07632). Makes a displayed confidence number not backed by a calibration claim or measurement an automatic High in S3 — surfacing confidence is actively harmful if it is miscalibrated. Overconfidence is the higher-severity direction (it inflates wrong-answer reliance) and warrants Critical when stakes are high and the action is irreversible (cross-links S1).
3. **Placebic explanations — fluent justifications conveying zero real information about how the system decided — produced self-reported trust statistically indistinguishable from genuine explanations, showing the mere form of an explanation, not its content, drives perceived trust.** Eiband, Buschek, Kremer & Hussmann 2019 (DOI:10.1145/3290607.3312787). Establishes the core failure mode S3 must catch: a confidence/explanation UI that raises trust without conveying decision-relevant information is a dark pattern. Makes generic content-free reassurance ("I'm confident this is right") an automatic High, flagged as manufactured trust rather than transparency.
4. **Adding explanations to AI recommendations did not reduce overreliance and in some conditions increased it (the explanation acted as a competence heuristic); only cognitive forcing functions reduced overreliance, but those designs were rated least favorably and helped higher-Need-for-Cognition users disproportionately.** Buçinca, Malaya & Gajos 2021 (arXiv:2102.09692). Contradicts the naive "more explanation = better trust" assumption across S2/S3: an explanation/confidence display presented as a fait accompli (answer first, rationale as justification) is a known over-reliance pattern (Medium-High). Justifies recommending friction (show-your-work-first / on-demand reveal) for high-stakes decisions while warning that friction is inequitable, so heavyweight confirmation should gate on action consequence and reversibility, not be applied uniformly.
5. **Explanations reduced overreliance only when they sufficiently lowered the cognitive cost of verifying the answer; when explanation difficulty was high or the payoff low, users rationally skipped verification and over-relied.** Vasconcelos et al. 2022 (arXiv:2212.06823). Sets the S2/S3 quality bar: a confidence/explanation affordance counts as a pass only if it makes verification CHEAPER than blind acceptance. The audit judges explanations on verification cost, not mere presence; a dense, hard-to-check rationale is effectively no mitigation (Medium). Ties S2 to S0, since the cheapest verification is usually showing the source.
6. **Explanations did not help users distinguish correct from incorrect AI recommendations; reliance shifted based on which features the explanation surfaced, independent of correctness, so explanations steered reliance without improving discrimination and could be weaponized via feature selection.** Schoeffer, De-Arteaga & Kühl 2024 (DOI:10.1145/3613904.3642621). Adds a manipulation axis to S3: the audit must check that confidence/explanation surfaces are not selectively framed to push a desired reliance outcome. Makes feature-cherry-picked or one-sided rationales a High in S3, and motivates an S3 rule to surface disconfirming evidence and contrastive framing ("you may have assumed X; the model chose Y because…") rather than only confirmatory cues.
7. **The foundational trust-in-automation model defines appropriate reliance as trust calibration matching true system capability; poor calibration produces two failures — misuse (over-reliance from overtrust) and disuse (rejecting capable automation from undertrust) — both shiftable by display and feedback.** Lee & See 2004 (DOI:10.1518/hfes.46.1.50.30392). Provides the conceptual backbone for S3's severity model: the goal is calibration, so the audit scores BOTH over-trust (no friction or recovery on confident-but-wrong output → S1/S3) AND under-trust (capable AI hidden or hedged into uselessness). Justifies treating disuse-inducing design (excessive, undifferentiated uncertainty warnings) as a real S3 finding, not only over-reliance.
8. **Mixed-initiative principles require interfaces to allow efficient direct invocation and termination of automated services (including "directly undoing or backtracking"), minimize the cost of poor guesses, scope service precision to match uncertainty, and support efficient agent-user refinement.** Horvitz 1999 (DOI:10.1145/302979.303030). Anchor doctrine for S1 Reversibility: an AI action with no efficient undo or termination path is a hard defect. Makes "irreversible AI-driven action with no undo/cancel" an automatic High and "cannot terminate a running automated service" an automatic High.
9. **Amershi et al. synthesized 18 human-AI guidelines (G1–G18) in four temporal phases — Initially (G1–G2), During (G3–G6), When wrong (G7–G11, incl. G9 "support efficient correction" with undo), Over time (G12–G18, incl. G16 convey consequences, G17 global controls, G18 notify about changes) — validated by 49 practitioners against 20 products yielding 785 examples.** Amershi et al. 2019 (DOI:10.1145/3290605.3300233). The four-phase spine is the audit's section map: G1/G2/G16 → S0 + S3; G9 → S1 (absence of undo for an automated action is a named G9 violation, High); G11/G17 → S2 + S5 (no global opt-out/customization of what the AI monitors is an automatic High); G14/G18 → S4 (a system that adapts without ever notifying the user is an automatic High); G16 makes any feedback action whose downstream effect is invisible at least Medium. A product missing a phase-spanning affordance is an automatic High because all four phases are load-bearing.
10. **Interactive refinement tools (refine-by-region/example/concept) that let users correct an imperfect ML image-search on the fly increased BOTH the diagnostic utility of results AND user trust; users repurposed the tools to disambiguate ML errors from their own.** Cai et al. 2019 (arXiv:1902.02960). Positive evidence that correction affordances improve both task outcome and appropriate trust, justifying treating absence of any inspect-and-correct loop as a defect rather than cosmetic. Grounds S1's link to S2 and sets the bar that recovery should also help users locate AI error.
11. **Merely soliciting human-in-the-loop correction feedback LOWERED users' trust and their perceived model accuracy, regardless of whether the system's accuracy actually improved in response.** Honeycutt, Nourani & Ragan 2020 (arXiv:2008.12735). Key failure mode: a correction UI is not automatically trust-positive. Adds an S1 sub-rule flagging correction loops that solicit effort without showing the resulting improvement (no visible state change after correction) — the known-broken "ask for feedback then swallow it" pattern.
12. **Feature-importance explanations raised relative AI reliance on correct advice (29.6% → 38.9%, p=0.05) without significantly increasing reliance on incorrect advice, yielding appropriate reliance rather than indiscriminate over-reliance.** Schemmer et al. 2023 (arXiv:2302.02187). Nuances the "explanations cause over-reliance" caution: a well-targeted explanation can support correction without inflating blind trust. Grounds S2's requirement that an inspection affordance expose decision-relevant features (not generic confidence text) so users correct the RIGHT cases, keeping S1's recovery path informative rather than rubber-stamping.
13. **Nielsen's heuristic 3, "User control and freedom," requires a clearly marked emergency exit and support for Undo and Redo so users can leave an unwanted state caused by a mistake without an extended process.** Nielsen 1994 (https://www.nngroup.com/articles/ten-usability-heuristics/). Establishes that undo/cancel is a baseline usability expectation, not an AI-specific luxury, so an AI feature that removes or bypasses an existing undo/cancel path is a regression. Grounds the S1 minimum: every AI-initiated state change MUST offer a discoverable undo or cancel, Medium baseline and High when the action is irreversible.
14. **The "Attributable to Identified Sources" (AIS) framework formalizes attribution as a testable property: a generated statement is acceptable only if it is verifiable against an independent, explicitly provided source, validated via a two-stage human annotation pipeline.** Rashkin et al. 2021 (arXiv:2112.12870). Provides the operational definition for S0: every factual AI claim must be attributable to an identified source the user can inspect. Makes an un-attributable factual claim (no inspectable source) an automatic High when a verifiable basis is implied, and sets the pass criterion as "supported by a specific source span," not merely "a source is listed somewhere."
15. **Leading commercial legal RAG tools marketed as reducing or eliminating hallucination (Lexis+ AI, Westlaw AI-Assisted Research, Ask Practical Law AI) still hallucinated 17–33% of the time despite retrieval grounding; the authors concluded reliability claims are overstated and user verification remains essential.** Magesh, Surani et al. 2024 (arXiv:2405.20362). Retrieval grounding does not eliminate fabrication, so the audit must NOT treat "uses RAG" as evidence of trustworthy provenance. Makes a UI that claims or implies "hallucination-free" / "eliminates hallucinations" an automatic High in S0, since the empirical floor is double-digit error even with retrieval.
16. **Across 1,600 queries on eight consumer AI search engines, citations were wrong in over 60% of tests; the worst performer was wrong ~94% of the time and produced fabricated or broken links, and premium tools were MORE confidently incorrect than free ones, presenting wrong answers without disclaimers.** Jaźwińska & Chandrasekar (Tow Center, CJR) 2025 (https://www.cjr.org/tow_center/we-compared-eight-ai-search-engines-theyre-all-bad-at-citing-news.php). A rendered citation/link is NOT evidence the source exists or supports the claim. Makes "citation/link shown but not validated for existence or support" a High in S0, and confident presentation of un-verified citations (no disclaimer, no resolvability check) a High in S2; the audit requires that displayed source links resolve and back the specific claim.
17. **Distinguishing citation correctness (the cited document supports the statement) from citation faithfulness (the model actually relied on it), up to 57% of RAG citations were post-rationalized — the model answered from prior knowledge and back-filled a plausible source — so high link validity and topical relevance create a false sense of trust.** Wallat, Heuss, de Rijke & Anand 2024 (arXiv:2412.18004). Names the failure mode the audit must catch: a citation that LOOKS valid but does not genuinely support/ground the claim. Makes a top-level/source-list citation not tied to the specific supporting span (unverifiable faithfulness) a Medium-to-High in S2, motivating a requirement for span-level grounding so the user can check actual support rather than trust the presence of a footnote.
18. **In a controlled study of source-presentation formats in conversational search, clicking on sources remained infrequent across ALL citation-design conditions; higher-visibility presentations increased hovering and attention but did not convert users into clicking through and verifying.** He & Liu 2025 (arXiv:2512.12207). Provenance gated behind a click is effectively invisible — users overwhelmingly will not verify even when given the means. Makes "provenance only reachable by clicking out (footnote/citation drawer) with no inline glanceable grounding" a Medium in S2, and sets the affordance bar at inline supporting evidence visible without navigation, not a click-to-verify link the literature shows goes unused.
19. **When LLM explanations are wrong but fluent/confident, humans over-rely on them and verification accuracy DROPS below the no-AI baseline; contrastive explanations only partly mitigate this, while showing the underlying retrieved evidence (so the human judges the source, not the model's prose) helps more.** Si et al. 2023 (arXiv:2310.12558). Documented backfire mode: an inspection panel that shows the model's confident EXPLANATION instead of the retrieved evidence increases over-reliance on wrong output. Makes "inspection affordance shows model-generated rationale with no retrieved evidence" a High in S2 for high-stakes surfaces, and requires that S2 inspection expose the source/evidence the model used (clearly demarcated from model prose), not a persuasive restatement.
20. **In a study of 40 Facebook users, 62.5% were unaware the News Feed was algorithmically curated at all (some believed they saw every friend's post); after a tool revealed the curation, most ended more satisfied and engaged once they understood the adaptation.** Eslami et al. 2015 (DOI:10.1145/2702123.2702556). Quantifies the default failure: silent adaptation leaves a majority of users with a false mental model. Sets S4 severity: an adaptive system with zero disclosure of the fact of adaptation is High (not Medium) because most users will not infer it. Revealing it improved (not harmed) satisfaction, so S4 rejects the "transparency only adds burden" counter-argument.
21. **Adding inspectability (explaining how recommendations arose) and control jointly increased users' perceived understanding, perceived control, recommendation-quality rating, AND satisfaction (N=267 Facebook music recommender).** Knijnenburg et al. 2012 (DOI:10.1145/2365952.2365966). Positive evidence grounding the S2/S4/S5 working state: inspect-plus-control is the Pass pattern. Establishes that S5 should require BOTH visibility of the personalization signal and a lever, not one alone (control without inspection scores worse), justifying pairing S2 inspection with S5 control rather than scoring them independently.
22. **Making the consequences of feedback both immediate and visibly highlighted (preview the impact, highlight the change) produced higher reported transparency, an overall user preference, and greater selectivity in which items users "liked" (better control input).** Schnabel et al. 2020 (DOI:10.1145/3397271.3401117). Operationalizes G16 for S4: a control is only adequate if the user can preview or see the effect of their feedback. Sets the S5 threshold — a like/dismiss/preference control whose effect on future output is neither immediate nor highlighted scores Medium even if the control technically exists, because users cannot form intent.
23. **News-feed control settings functioned as placebos: users reported higher satisfaction with their feed when controls were present whether or not the controls actually did anything.** Vaccaro et al. 2018 (DOI:10.1145/3173574.3173590). The key negative finding for S5. Because fake controls raise satisfaction, self-reported satisfaction CANNOT verify a control works, so the audit requires behavioral proof that toggling the control changes output. Makes "control present but no observable effect on results" an automatic High (placebo/manipulative-control), defeating the "users seem happy" defense.
24. **In a 27-user study of static, adaptive (system-controlled), and adaptable (user-controlled) split menus, the system-controlled adaptive menu was significantly slower than static and least preferred; users favored the adaptable (user-controlled) version.** Findlater & McGrenere 2004 (DOI:10.1145/985692.985704). Grounds the control-granularity rule in S5: system-driven adaptation with no user authorship is both slower and disliked. Sets a rule that fully automatic adaptation without an adaptable (user-set) alternative scores Medium-High, and supports preferring user-initiated personalization (adaptable) as the safer default.
25. **A crawl of ~53,000 product pages on ~11,000 shopping sites found 1,818 dark-pattern instances across 15 types, many "covert" or "misdirecting" (steering via cognitive-bias exploitation without restricting choices), and identified third-party vendors selling dark patterns as turnkey personalization features.** Mathur et al. 2019 (arXiv:1907.07032). Defines the manipulative-personalization failure mode S4/S5 must catch: adaptation that covertly steers (urgency/scarcity/misdirection tuned to the user) rather than informs. Makes personalization whose mechanism is hidden AND benefits the operator over the user an automatic High (manipulative-personalization), and justifies an S0/S4 rule that the adaptation's intent and beneficiary must be disclosable.
26. **GDPR Article 22(1) grants the data subject "the right not to be subject to a decision based solely on automated processing, including profiling" that produces legal or similarly significant effects, coupled (Arts. 13–15) with a right to meaningful information about the logic involved.** European Parliament & Council (EU) 2016 (Regulation (EU) 2016/679, Art. 22). Provides the legal floor for S5 opt-out: for consequential automated/personalized decisions an opt-out must exist and be discoverable (not buried in policy text). Makes "no opt-out from significant automated decisioning" or "opt-out hidden in policy text" an automatic High, and ties S4 (logic disclosure) to a regulatory requirement, not just a usability nicety.
27. **A 2×2 factorial-survey study (guideline applied vs violated × optimal vs sub-optimal AI performance) found applying a human-AI guideline generally improved user perception, but the size and sometimes direction of the effect depended on AI performance, so guideline benefits were not uniform and degraded AI changed which guidelines helped.** Li, Vorvoreanu, DeBellis & Amershi 2022 (DOI:10.1145/3511605). Forbids the audit from awarding credit for a present-but-inert affordance. The Evidence section must require the affordance be evaluated under realistic (sub-optimal) AI performance, not just the happy path; a confidence/explanation feature only demoed on correct outputs is a Medium finding ("untested under failure").
28. **Setting end-user expectations about AI imperfection BEFORE use significantly increased acceptance and satisfaction of an only-50%-accurate scheduling assistant; framing which error type to expect (false positives vs false negatives) shifted perceived accuracy and acceptance even at identical real accuracy.** Kocielnik, Amershi & Bennett 2019 (DOI:10.1145/3290605.3300641). Operationalizes G1/G2 for the Initially phase: a consequential AI feature that ships with no up-front statement of expected fallibility/error profile is an automatic High in S3 (confidence) and S0 (provenance of capability claims). Forbids over-promising marketing copy as the only "expectation setting."
29. **A unified survey of 200+ guidelines from Apple, Google and Microsoft found systematic gaps in emphasis: Google heavily emphasized training-data and model considerations while Apple and Microsoft barely covered them, so no single industry guideline set is complete on its own.** Wright et al. 2020 (arXiv:2010.11761). Justifies the audit triangulating across HAX + PAIR rather than anchoring on one set: where Microsoft HAX is thin (data/provenance), pull S0 rules from the data-collection emphasis attributed to Google. Prevents inheriting the anchor framework's blind spots; data/training provenance is a first-class S0 axis, not an afterthought.
30. **Google PAIR's People+AI Guidebook codifies six chapters (User Needs+Defining Success, Data Collection+Evaluation, Mental Models, Explainability+Trust, Feedback+Controls, Errors+Graceful Failure), explicitly pairing trust with calibration and treating graceful failure and user feedback/control as required, co-equal design surfaces.** Google PAIR 2019 (https://pair.withgoogle.com/guidebook/). Cross-validates the audit's S1 and S5 as mandatory, not optional: a second independent industry framework names Errors+Graceful Failure and Feedback+Controls as standalone required chapters. An AI surface with no graceful-failure path (S1) or no feedback/control channel (S5) is a High under two converging frameworks, hardening the severity.

---

## Boundary with the Cognitive Load audit (Section 0)

Source provenance for AI output overlaps the Cognitive Load audit's [Section 4 — AI Compression Risk](../cognitive-load/RUBRIC.md). This audit **references and extends** that section; it does not re-derive it.

- **Cognitive Load Section 4 owns the AI-summary source-provenance check WITH its severity precondition.** Critical applies there only when the user provided a source, the system fetched a source, the UI implies source grounding, or the output replaces an inspectable source with an uninspectable summary. Generic unsourced model output classifies as **provenance ambiguity (Medium / High)**. Run that check there for AI *summaries and compressions*.
- **AI Trust Surface Section 0 (this audit) extends it into a full provenance doctrine.** Beyond the summary case, S0 treats attribution as a *testable property* per the AIS framework [F14]: a claim is grounded only if it is supported by a specific, inspectable source span. S0 adds the empirical floors Cognitive Load Section 4 does not state: retrieval grounding does NOT eliminate fabrication [F15], a rendered citation is not evidence the source exists or supports the claim [F16], and citation *correctness* is not citation *faithfulness* [F17]. It also covers data/training provenance as a first-class axis [F29].

**Adopt the same Critical precondition.** So AT does not over-fire on generic unsourced output, S0 takes Critical **only** when the AI claims or implies a verifiable basis — it cites a source, says "based on your data," or is marketed as grounded / hallucination-free — and that basis is not inspectable or not faithful. Generic unsourced output with no claimed basis is High/Medium provenance ambiguity, exactly as Cognitive Load Section 4 classifies it. Do not duplicate the Cognitive Load Section 4 AI-summary checklist here; S0 states only the extensions.

---

## Section 0 — Source provenance

**Purpose.** Whether every consequential factual claim is attributable to an identified, inspectable source — and whether retrieval-grounding and "hallucination-free" claims are earned. The most settled and most inspectable trust surface.

**Failure modes.**
- A consequential factual claim with no inspectable source — un-attributable output presented as fact [F14].
- A citation or source link shown but never validated for existence or for supporting the specific claim (fabricated or broken links, topically plausible but unsupporting) [F16].
- A citation that is *correct* (the document supports the statement) but *unfaithful* (the model did not rely on it — post-rationalized after answering from prior knowledge) [F17].
- A product UI that claims or implies "hallucination-free," "eliminates hallucinations," or "grounded" reliability that retrieval does not earn [F15].
- A consequential AI feature shipped with no up-front statement of its fallibility / error profile — capability claims with no provenance [F28].
- Adaptation or personalization whose intent and beneficiary are not disclosable (the data/training-provenance axis) [F29, F25].

**Audit questions.**
- For each consequential factual claim, is there an identified source the user can inspect, tied to the specific supporting span — not merely a source listed somewhere on the page? [F14, F17]
- When a citation or source link is shown, does it actually resolve, and does the cited content support the specific claim it is attached to? [F16]
- Does the surface claim or imply "hallucination-free," "no errors," "fully grounded," or similar reliability that the retrieval architecture cannot deliver? [F15]
- Does the feature state, before use, what it is and is not reliable at — its expected error profile — rather than relying on marketing copy? [F28]
- Where the AI draws on user data or training data to personalize, is the fact and the beneficiary of that adaptation disclosable? [F29, F25]

**Severity hooks / preconditions (this section).**
- **Critical precondition (adopted from Cognitive Load Section 4):** Critical applies **only** when the AI claims or implies a verifiable basis — cites a source, says "based on your data," or is marketed grounded / hallucination-free — and that basis is not inspectable or not faithful. This is forced trust on a promise the surface cannot keep.
- A consequential factual claim with no inspectable source, where a verifiable basis is implied — **High** (un-attributable claim, [F14]); **Medium** when no basis is claimed (generic provenance ambiguity, per the Cognitive Load Section 4 precondition).
- A "hallucination-free" / "eliminates hallucinations" overclaim — **High** (the empirical floor is double-digit error even with retrieval, [F15]); **Critical** when paired with a high-stakes irreversible action (cross-link S1).
- A citation shown but not validated for existence or support — **High** [F16].
- A correct-but-unfaithful citation (no span-level grounding to check faithfulness) — **Medium-to-High** [F17] (inspection mechanics owned by S2).

**Standards / research anchors.** AIS attribution framework; HAX G1/G2/G16; PAIR Data Collection + Evaluation. Research: [F14, F15, F16, F17, F25, F28, F29].

**Automation.** Partial. Whether a citation link resolves (HTTP existence) is automatable; whether the cited content *supports* the specific claim (correctness) and whether the model *relied* on it (faithfulness) are judgment, and "hallucination-free" overclaim detection is a copy/marketing review.

---

## Section 1 — Reversibility

**Purpose.** Whether the user can undo, cancel, terminate, or recover from an AI-driven action — and whether correction loops actually change the state they solicit effort to change. The graceful-failure surface.

**Failure modes.**
- An irreversible AI-driven action (an automated edit, send, delete, apply, commit) with no undo or cancel path [F8, F13].
- A running automated service the user cannot terminate or backtrack out of [F8].
- An AI feature that removes or bypasses an existing undo/cancel path (a regression against a baseline usability expectation) [F13].
- A correction loop that solicits effort but swallows it — feedback is requested, but no visible accuracy/state change follows, which empirically *lowers* trust [F11].
- No inspect-and-correct loop at all, so the user cannot disambiguate AI error from their own and cannot repair an imperfect result [F10].
- No graceful-failure path when the AI is wrong — the surface only handles the happy path [F30].

**Audit questions.**
- For every AI-initiated state change, is there a discoverable undo or cancel that returns the user to the prior state? [F8, F13]
- Can the user terminate or backtrack a running automated service efficiently, without waiting it out or fighting it? [F8]
- Does any AI feature remove or weaken an undo/cancel path that exists elsewhere in the product? [F13]
- When the user corrects the AI, is the resulting change visible — does the output actually update — or is the feedback solicited and then swallowed? [F11]
- Is there an inspect-and-correct loop that lets the user repair an imperfect result and tell AI error apart from their own? [F10]
- When the AI is wrong, is there a graceful-failure path, or does the surface assume correctness? [F30]

**Severity hooks / preconditions (this section).**
- Irreversible AI-driven action with no undo/cancel — **High** [F8, F13]; **Critical** when the action is both high-stakes and irreversible (cross-link S3 overconfidence: a confident-but-wrong irreversible action is the worst case).
- Cannot terminate a running automated service — **High** [F8].
- AI feature removes/bypasses an existing undo path — **High** (regression, [F13]).
- Correction loop that solicits feedback with no visible state change — **Medium** (the "ask then swallow" pattern, [F11]); **High** if it is the only recovery path the surface offers.
- No graceful-failure path on a consequential surface — **High** [F30].

**Standards / research anchors.** Horvitz mixed-initiative principles; Nielsen heuristic 3; HAX G9 (support efficient correction); PAIR Errors + Graceful Failure. Research: [F8, F10, F11, F13, F30].

**Automation.** No. Presence of an undo control in the DOM is weakly checkable, but whether it actually reverses the AI action, whether a service can be terminated, and whether correction changes state are all runtime and behavioral.

---

## Section 2 — Inspection affordances

**Purpose.** Whether the user can see what the AI used, retrieved, or removed — cheaply enough to actually verify, and showing the *evidence* rather than persuasive model prose. The verification-cost surface.

**Failure modes.**
- An inspection panel that shows the model's confident *explanation* / rationale instead of the retrieved evidence, which empirically increases over-reliance on wrong output [F19].
- Provenance gated behind a click users will not make (footnote, citation drawer, "view sources" link) with no inline glanceable grounding [F18].
- An inspection affordance whose verification cost is higher than blind acceptance — dense, hard-to-check rationale that is effectively no mitigation [F5].
- Inspection that exposes generic confidence text rather than the decision-relevant features the user would need to correct the right cases [F12].
- A top-level or source-list citation not tied to the specific supporting span, so faithfulness cannot be checked [F17].
- Confident presentation of un-verified citations with no disclaimer or resolvability check [F16].

**Audit questions.**
- Does the inspection affordance show the *retrieved evidence / source the model used*, clearly demarcated from model prose — not a persuasive restatement of the model's rationale? [F19]
- Is grounding visible inline and glanceable, or is it reachable only by a click-out the literature shows users overwhelmingly will not make? [F18]
- Does inspecting make verification *cheaper* than blind acceptance, or is the rationale so dense the user rationally skips it? [F5]
- Does inspection expose decision-relevant features (so the user can correct the right cases), not generic confidence text? [F12]
- Is each citation tied to a specific supporting span the user can check for faithfulness, not just a source listed at the bottom? [F17]
- Are displayed citations validated for existence and support, or presented confidently and unchecked? [F16]

**Severity hooks / preconditions (this section).**
- Inspection shows model-generated rationale with no retrieved evidence, on a high-stakes surface — **High** (documented backfire mode, [F19]).
- Provenance only reachable by a click-out with no inline grounding — **Medium** [F18].
- Citation not tied to a specific supporting span (faithfulness uncheckable) — **Medium-to-High** [F17].
- Citation shown but confidently un-verified (no resolvability check, no disclaimer) — **High** [F16].
- Dense rationale where verification cost exceeds blind acceptance — **Medium** [F5].

**Standards / research anchors.** HAX G11; PAIR Explainability + Trust. Research: [F5, F12, F16, F17, F18, F19].

**Automation.** Partial. Presence of a "view sources" control and whether links resolve are checkable; whether the panel shows evidence vs prose, whether grounding is glanceable inline, and whether verification is actually cheap are judgment.

---

## Section 3 — Confidence communication

**Purpose.** Whether uncertainty is surfaced, calibrated, and actionable — or manufactured. The calibration surface: the goal is *appropriate* reliance, scoring both over-trust and under-trust.

**Failure modes.**
- A displayed confidence value with no calibration evidence — a number nobody measured, which is actively harmful because miscalibration degrades decisions asymmetrically [F2].
- A placebic / manufactured-trust explanation: fluent reassurance that raises trust without conveying decision-relevant information [F3].
- One-sided or feature-cherry-picked framing that steers reliance toward a desired outcome rather than improving discrimination [F6].
- A confidence/explanation presented as a fait accompli (answer first, rationale as justification), a known over-reliance pattern [F4].
- No per-decision confidence/uncertainty signal at all on a consequential output [F1].
- Over-hedging — excessive, undifferentiated uncertainty warnings that induce disuse of capable AI [F7].
- No up-front statement of the feature's expected fallibility / error profile [F28].

**Audit questions.**
- Is there a per-decision confidence or uncertainty signal on consequential output, and is it backed by calibration evidence (or hedged as heuristic), not an unmeasured number? [F1, F2]
- Are explanations content-bearing — do they convey *how the system decided* — or are they fluent placebos that raise trust without information? [F3]
- Is the framing balanced (surfacing disconfirming evidence, contrastive "you may have assumed X; the model chose Y because…"), or one-sided/cherry-picked to steer reliance? [F6]
- Is the confidence/explanation a fait accompli (answer-then-justify), or does the design create appropriate friction for high-stakes decisions? [F4]
- Does the surface avoid over-hedging that buries capable output under undifferentiated warnings (the disuse direction)? [F7]
- Does the feature state its expected error profile before use, rather than relying on marketing copy? [F28]

**Severity hooks / preconditions (this section).**
- A displayed confidence value with NO calibration evidence — **High** (miscalibration is actively harmful, [F2]). Overconfidence is the higher-severity direction; it is **Critical** when the action is high-stakes AND irreversible (cross-link S1).
- A placebic / manufactured-trust explanation — **High** (manufactured trust, [F3]).
- One-sided / cherry-picked framing that steers reliance — **High** [F6].
- Answer-then-justify fait accompli on a high-stakes decision — **Medium-High** [F4].
- No per-decision confidence signal on consequential output — **High** [F1].
- Over-hedging that induces disuse — **Medium** (the under-trust direction; real but lower-severity than misuse, [F7]).
- No up-front fallibility statement on a consequential feature — **High** [F28].

**Standards / research anchors.** Trust-in-automation calibration model (misuse/disuse); HAX G1/G2; PAIR Explainability + Trust. Research: [F1, F2, F3, F4, F6, F7, F28].

**Automation.** No. Presence of a confidence number is checkable; whether it is *calibrated*, whether an explanation is content-bearing or placebic, and whether framing is balanced are all judgment.

---

## Section 4 — Adaptation transparency

**Purpose.** When the AI personalizes or adapts, whether the user is told it is happening, and can see and preview the effect — and whether the adaptation is honest rather than covertly manipulative.

**Failure modes.**
- Silent adaptation: the system personalizes or curates with zero disclosure of the fact of adaptation, leaving most users with a false mental model [F20].
- Feedback whose downstream effect is invisible — the user acts (likes, dismisses, corrects) but cannot see or preview how it changes future output [F22].
- Covert manipulative personalization: adaptation whose mechanism is hidden AND benefits the operator over the user (urgency/scarcity/misdirection tuned to the individual) [F25].
- A system that adapts without ever notifying the user of the change (HAX G18 violation) [F9].

**Audit questions.**
- Does the surface disclose the *fact* that it is adapting/personalizing/curating, rather than presenting curated output as if it were complete or neutral? [F20]
- When the user gives feedback, can they preview or see the effect on future output immediately and visibly, so they can form intent? [F22]
- Is the adaptation's intent and beneficiary disclosable, or is the personalization covert and operator-serving (a dark pattern)? [F25]
- When the system changes its behavior over time, does it notify the user of the change? [F9]

**Severity hooks / preconditions (this section).**
- Adaptive system with zero disclosure of the fact of adaptation — **High** (not Medium; most users will not infer it, [F20]).
- Covert manipulative personalization (hidden mechanism + operator benefit) — **High** (manipulative-personalization, [F25]); escalates toward Critical where it drives a consequential decision against the user's interest.
- Feedback whose downstream effect is neither immediate nor highlighted — **Medium** (control exists but users cannot form intent, [F22]).
- System adapts without ever notifying the user of the change — **High** [F9].

**Standards / research anchors.** HAX G14/G18; PAIR Mental Models; dark-patterns literature. Research: [F9, F20, F22, F25].

**Automation.** No. Whether adaptation is disclosed, whether feedback effects are previewable, and whether personalization is covert/manipulative are all behavioral and intent-laden.

---

## Section 5 — User control

**Purpose.** Whether the user has granular, *real* control over consequential automated decisions, plus a discoverable opt-out — and whether the controls actually do anything. The agency surface.

**Failure modes.**
- A placebo control: present but with no observable effect on output, which still raises self-reported satisfaction and so cannot be validated by asking users [F23].
- All-or-nothing control with no granularity — the user cannot tune what the AI does, only switch it fully on or off.
- System-driven adaptation with no user-authored (adaptable) alternative — personalization done *to* the user rather than *by* them, which is slower and disliked [F24].
- Control without inspection — a lever with no visibility of the personalization signal it acts on, which scores worse than the paired inspect-plus-control pattern [F21].
- A buried or absent opt-out from consequential automated decisioning — hidden in policy text or not offered at all [F26].
- No global controls / customization of what the AI monitors (HAX G17/G11 violation) [F9].

**Audit questions.**
- For each control, is there behavioral proof that toggling it changes the output — or is it a placebo that cannot be validated by user satisfaction? [F23]
- Is control granular (the user can tune *what* the AI does), or all-or-nothing?
- Is there a user-authored (adaptable) alternative to system-driven adaptation, given that automatic adaptation without one is slower and disliked? [F24]
- Is each control paired with inspection of the signal it acts on, so the user can see *and* steer (the Pass pattern)? [F21]
- For consequential automated decisions, is there a discoverable opt-out — not buried in policy text? [F26]
- Are there global controls and customization of what the AI monitors? [F9]

**Severity hooks / preconditions (this section).**
- **A control with no observable effect on output is an automatic High** (placebo, [F23]) — self-reported satisfaction cannot verify a control works; the audit requires behavioral proof.
- No opt-out from significant automated decisioning, or opt-out buried in policy text — **High** (regulatory floor, [F26]).
- System-driven adaptation with no adaptable (user-authored) alternative — **Medium-High** [F24].
- Control present without inspection of the signal it acts on — **Medium** (worse than the paired inspect+control Pass pattern, [F21]).
- No global controls / customization of what the AI monitors — **High** [F9].

**Standards / research anchors.** HAX G11/G17; PAIR Feedback + Controls; GDPR Art. 22 (opt-out floor). Research: [F9, F21, F23, F24, F26].

**Automation.** Partial. Presence of a control and of an opt-out link is checkable; whether the control *actually changes output* (the placebo test) requires behavioral verification, and opt-out discoverability is judgment.

---

## Section 6 — Configuration cost

**Purpose.** Whether the user can reach the trust, provenance, and control affordances without excessive cost. The recursive trap: controls for trusting the AI that are themselves hard to find or operate.

**Failure modes.**
- Provenance, confidence, inspection, or opt-out controls buried several menus deep, unreachable in the flow of a consequential decision [F5, F26].
- An inspection/verification affordance whose discovery and operation cost exceeds blind acceptance — making non-use rational [F5, F18].
- An opt-out reachable only by leaving the surface and hunting through policy text [F26].
- Per-surface trust controls with no global preset, forcing reconfiguration on each feature.
- Trust affordances (the "view sources," "why this," confidence toggle) that are themselves undiscoverable at the moment of decision.

**Audit questions.**
- From the point of a consequential AI decision, how many steps reach the most relevant trust control (view sources, confidence, opt-out, correction)? Is it reachable in-flow? [F5, F18]
- Is the opt-out from automated decisioning reachable without leaving the surface and parsing policy text? [F26]
- Can the user set a global trust/provenance/control preference, or must they reconfigure per surface?
- Are the trust affordances discoverable at the moment they matter — at the decision — or only if the user already knows to look? [F18]

**Severity hooks / preconditions (this section).**
- Trust/provenance/control affordances unreachable in-flow at the decision point — **High** [F5, F18].
- Opt-out reachable only via policy text — **High** (cross-listed with S5, [F26]).
- Verification cost so high non-use is rational — **Medium** [F5].

**Standards / research anchors.** The recursive form of the AI Trust Surface Law: configuration is itself a surface that must pass the audit. Research: [F5, F18, F26].

**Automation.** Partial. Click/step depth to a trust control can be measured; whether the control is *usable in-flow at the decision* is judgment.

---

## Section 7 — Evidence

**Purpose.** Whether the audit was run against realistic AI *failure* — sub-optimal, wrong, or fabricated output — not just the happy path. The process gate.

**Failure modes.**
- All findings collected against correct AI output, so an affordance only ever demoed on right answers is recorded as passing [F27].
- "We tested the AI feature" with no record of whether a wrong/fabricated output was exercised, or which decision/stakes it drove.
- Confidence/explanation claims based on the feature appearing to work, never stressed against a miscalibrated or wrong case [F2, F27].
- Provenance claims based on a citation being *present*, never validated for existence, support, or faithfulness [F16, F17].
- Single-state testing (one happy-path output) with no failure case, no high-stakes case, and no irreversible-action case.

**Audit questions.**
- Was the audit run against at least one sub-optimal / wrong / fabricated AI output, not only correct output? [F27]
- For each affordance scored as passing (undo, inspection, confidence, control), was it exercised on a *failure* case, not just a success case? [F27]
- Were provenance claims validated (links resolve, content supports the claim, span-level faithfulness checkable), not just observed as present? [F16, F17]
- Was the realistic decision-driving state — including the stakes and reversibility of the action — recorded per finding?
- Is the evidence state (Observed / Inferred / Open question) recorded on every finding, with the failure case that exercised it documented?

**Severity hooks / preconditions (this section).**
- An affordance scored as passing but only demoed on correct AI output — **Medium** ("untested under failure," [F27]); the section warns and the affordance's pass is provisional.
- No failure case exercised at all on a consequential surface — section **Fail** on process grounds.

**Standards / research anchors.** Factorial-survey evidence that guideline benefits depend on AI performance [F27]. Research: [F2, F16, F17, F27].

**Automation.** No. Process gate.

---

## Hard-failure patterns this audit detects

A useful AI Trust Surface audit should be able to detect at least these four patterns:

1. **forced_trust** — no inspect, undo, or trace path; the user must accept AI output as-is. (Sections S1 / S2 / S5.)
2. **manufactured_trust** — confidence or explanation that raises trust without conveying decision-relevant information; placebic. (Section S3.)
3. **invalid_provenance** — a citation or source shown but unverified or unfaithful, or a "hallucination-free" overclaim retrieval does not earn. (Sections S0 / S2.)
4. **placebo_control** — a control present but with no observable effect on output, or silent adaptation the user cannot see. (Sections S4 / S5.)

These patterns are candidates to exercise at first pressure test. No pattern has been validated yet — this is a Draft.

---

## Finding format

Each finding produced by this audit takes the shape defined in [`../../shared/finding-format.md`](../../shared/finding-format.md):

```
## Finding AT-{NN} — {short title}

Severity: {Critical | High | Medium | Low}
Section: {section name}
Surface: {where in the product}
Load displaced to: {one or more from the shared enum below}
Evidence state: {Observed | Inferred | Open question}

Issue:
{One paragraph describing what the AI surface does.}

Why it matters:
{One paragraph naming the cost in forced trust, unrecoverable risk, or lost agency.
Reference the AI Trust Surface Law if the displacement is non-obvious.}

Evidence:
{The AI output tested (correct vs sub-optimal/wrong/fabricated), the decision/action
it drove, stakes and reversibility, surface, screenshot/click-path reference. If this
line is empty, the finding fails Section 7 and is not yet a finding.}

Fix:
{One paragraph. Should restore the ability to inspect, undo, trace, or control —
without manufacturing trust the surface cannot back.}
```

The optional domain fields `at_trust_pattern` and `hax_phase` (from [`schemas/finding.extensions.json`](schemas/finding.extensions.json)) classify the finding by its trust-failure pattern and by which of the HAX four phases (Initially / During / When-wrong / Over-time) it lands in. They are additive; they do not replace any base field.

**Severity definitions** (per [`../../shared/severity-model.md`](../../shared/severity-model.md) — Critical / High / Medium / Low; domain preconditions in this rubric):

| Severity | Meaning (AI-trust specialization) |
|---|---|
| Critical | The user is forced to accept consequential AI output with no inspect, undo, or trace path, AND the action is high-stakes and irreversible. Overconfident confidence on a high-stakes irreversible action [F2]. A "hallucination-free" overclaim paired with an irreversible action [F15]. Provenance Critical applies only when a verifiable basis is claimed/implied and is not inspectable or not faithful (S0 precondition). |
| High | Significant forced-trust or lost-agency displacement: displayed confidence with no calibration evidence [F2]; placebic/manufactured-trust explanation [F3]; un-attributable claim where a basis is implied [F14]; citation shown but unverified [F16]; irreversible AI action with no undo [F8, F13]; inspection that shows prose not evidence [F19]; silent adaptation [F20]; placebo control [F23]; buried/absent opt-out [F26]; one-sided steering framing [F6]. |
| Medium | Provenance ambiguity with no claimed basis (generic unsourced output); correction loop that swallows feedback [F11]; provenance gated behind an unused click [F18]; feedback whose effect is invisible [F22]; over-hedging that induces disuse [F7]; affordance untested under failure [F27]; control without inspection [F21]. |
| Low | Polish-level. Wording of a disclaimer, edge-case states, secondary surfaces. |

**Section-Fail threshold** (shared, unchanged from [`../../shared/severity-model.md`](../../shared/severity-model.md)): **a single Critical OR three Highs in any one section produces a section-level Fail.** Any section Fail produces an overall audit Fail.

**Load-displaced-to enum.** The `Load displaced to:` field uses one or more values from the shared enum in [`../../shared/finding-format.md`](../../shared/finding-format.md). This audit does **not** add new displacement values. AI-trust failures map onto the shared 11-value enum as follows:

| AI-trust failure | Maps to |
|---|---|
| User must accept AI output with no way to verify | `trust` |
| User must leave the surface to confirm an AI claim | `verification` |
| Source/citation hidden, stripped, or unfaithful to the output | `source recovery` |
| User must undo or rebuild after a wrong AI-driven action | `recovery / undo` |
| Trust/opt-out controls buried; must reconfigure to govern the AI | `configuration` |
| Opt-out or correction reachable only by traversing other surfaces | `navigation` |
| User must remember what the AI adapted, removed, or merged | `memory` |
| User must hunt (search/command palette) for the source or control | `search` |
| Dense rationale forces decoding effort to verify | `visual decoding` |
| Verification that should be instant takes measurable seconds | `time` |
| A capability removed when "trust mode"/automation is on, not compressed | `feature loss` |

Findings with vague displacement targets are weaker findings. "Other" is not an option.

---

## Automatable vs judgment cut

| Section | Scanner / tool-checkable | Skill / judgment required |
|---|---|---|
| 0. Source provenance | Partial — citation-link existence (HTTP resolve) is checkable [F16] | Yes — claim support (correctness), faithfulness [F17], "hallucination-free" overclaim [F15] |
| 1. Reversibility | Partial — presence of an undo control in the DOM | Yes — whether it reverses the AI action, service termination, correction-swallowing [F8, F11] |
| 2. Inspection affordances | Partial — presence of "view sources," link resolution | Yes — evidence-vs-prose, glanceable grounding, verification cost [F5, F18, F19] |
| 3. Confidence communication | Partial — presence of a confidence number | Yes — calibration, placebic-vs-content, balanced framing [F2, F3, F6] |
| 4. Adaptation transparency | No | Yes — disclosure, previewable effect, covert manipulation [F20, F22, F25] |
| 5. User control | Partial — presence of controls / opt-out link | Yes — the placebo test (does it change output?) [F23], opt-out discoverability [F26] |
| 6. Configuration cost | Partial — step depth to a trust control | Yes — usability in-flow at the decision [F5, F18] |
| 7. Evidence | No | Yes — process check (was failure exercised?) [F27] |

This audit is not "run a scanner and call it done." The highest-impact failures — a confidence number nobody calibrated [F2], a citation that looks valid but is unfaithful [F17], a control that changes nothing [F23], a silent adaptation [F20] — are all judgment and behavioral. The leverage is the trust surface a scanner cannot touch.

---

## Running this as a skill

The skill that runs this audit lives at [`skill/SKILL.md`](skill/SKILL.md). It walks the rubric defined above and produces three outputs: `ai-trust-surface-findings.md`, `ai-trust-surface-scorecard.json`, `remediation-priority-list.md`.

**Hierarchy.** The rubric is canonical. The skill never invents criteria. If the rubric and the skill disagree, the rubric wins. Updates to audit criteria go in this file first; the skill is updated to match. Pressure-test outputs live under `evidence/<run-id>/`. The PT0 target shortlist is in [`evidence/PT0-candidates.md`](evidence/PT0-candidates.md).

---

## References

- Zhang, Y., Liao, Q. V., & Bellamy, R. K. E. (2020). *Effect of Confidence and Explanation on Accuracy and Trust Calibration in AI-Assisted Decision Making*. arXiv:2001.02114. https://arxiv.org/abs/2001.02114
- Li, J., et al. (2024). *Understanding the Effects of Miscalibrated AI Confidence on User Trust, Reliance, and Decision Efficacy*. arXiv:2402.07632. https://arxiv.org/abs/2402.07632
- Eiband, M., Buschek, D., Kremer, A., & Hussmann, H. (2019). *The Impact of Placebic Explanations on Trust in Intelligent Systems*. CHI EA '19. DOI:10.1145/3290607.3312787. https://dl.acm.org/doi/10.1145/3290607.3312787
- Buçinca, Z., Malaya, M. B., & Gajos, K. Z. (2021). *To Trust or to Think: Cognitive Forcing Functions Can Reduce Overreliance on AI in AI-assisted Decision-making*. arXiv:2102.09692. https://arxiv.org/abs/2102.09692
- Vasconcelos, H., et al. (2022). *Explanations Can Reduce Overreliance on AI Systems During Decision-Making*. arXiv:2212.06823. https://arxiv.org/abs/2212.06823
- Schoeffer, J., De-Arteaga, M., & Kühl, N. (2024). *Explanations, Fairness, and Appropriate Reliance in Human-AI Decision-Making*. CHI '24. DOI:10.1145/3613904.3642621. https://arxiv.org/abs/2209.11812
- Lee, J. D., & See, K. A. (2004). *Trust in Automation: Designing for Appropriate Reliance*. Human Factors, 46(1). DOI:10.1518/hfes.46.1.50.30392. https://journals.sagepub.com/doi/10.1518/hfes.46.1.50_30392
- Horvitz, E. (1999). *Principles of Mixed-Initiative User Interfaces*. CHI '99. DOI:10.1145/302979.303030. https://dl.acm.org/doi/10.1145/302979.303030
- Amershi, S., et al. (2019). *Guidelines for Human-AI Interaction*. CHI '19. DOI:10.1145/3290605.3300233. https://www.microsoft.com/en-us/research/publication/guidelines-for-human-ai-interaction/
- Cai, C. J., et al. (2019). *Human-Centered Tools for Coping with Imperfect Algorithms during Medical Decision-Making*. arXiv:1902.02960. https://arxiv.org/abs/1902.02960
- Honeycutt, D., Nourani, M., & Ragan, E. (2020). *Soliciting Human-in-the-Loop User Feedback for Interactive Machine Learning Reduces User Trust and Impressions of Model Accuracy*. arXiv:2008.12735. https://arxiv.org/abs/2008.12735
- Schemmer, M., et al. (2023). *Appropriate Reliance on AI Advice: Conceptualization and the Effect of Explanations*. arXiv:2302.02187. https://arxiv.org/abs/2302.02187
- Nielsen, J. (1994). *10 Usability Heuristics for User Interface Design*. Nielsen Norman Group. https://www.nngroup.com/articles/ten-usability-heuristics/
- Rashkin, H., et al. (2021). *Measuring Attribution in Natural Language Generation Models*. arXiv:2112.12870. https://arxiv.org/abs/2112.12870
- Magesh, V., Surani, F., et al. (2024). *Hallucination-Free? Assessing the Reliability of Leading AI Legal Research Tools*. arXiv:2405.20362. https://arxiv.org/abs/2405.20362
- Jaźwińska, K., & Chandrasekar, A. (2025). *AI Search Has a Citation Problem*. Tow Center for Digital Journalism, Columbia Journalism Review. https://www.cjr.org/tow_center/we-compared-eight-ai-search-engines-theyre-all-bad-at-citing-news.php
- Wallat, J., Heuss, M., de Rijke, M., & Anand, A. (2024). *Correctness is not Faithfulness in RAG Attributions*. arXiv:2412.18004. https://arxiv.org/abs/2412.18004
- He, J., & Liu, Z. (2025). *Not All Transparency Is Equal: Source Presentation Effects on Attention, Interaction, and Persuasion in Conversational Search*. arXiv:2512.12207. https://arxiv.org/abs/2512.12207
- Si, C., et al. (2023). *Large Language Models Help Humans Verify Truthfulness — Except When They Are Convincingly Wrong*. arXiv:2310.12558. https://arxiv.org/abs/2310.12558
- Eslami, M., et al. (2015). *"I always assumed that I wasn't really that close to [her]": Reasoning about Invisible Algorithms in News Feeds*. CHI '15. DOI:10.1145/2702123.2702556. https://dl.acm.org/doi/10.1145/2702123.2702556
- Knijnenburg, B. P., et al. (2012). *Inspectability and control in social recommenders*. UMUAI / RecSys. DOI:10.1145/2365952.2365966. https://dl.acm.org/doi/10.1145/2365952.2365966
- Schnabel, T., et al. (2020). *The Impact of More Transparent Interfaces on Behavior in Personalized Recommendation*. SIGIR '20. DOI:10.1145/3397271.3401117. https://www.microsoft.com/en-us/research/publication/the-impact-of-more-transparent-interfaces-on-behavior-in-personalized-recommendation/
- Vaccaro, K., et al. (2018). *The Illusion of Control: Placebo Effects of Control Settings*. CHI '18. DOI:10.1145/3173574.3173590. https://dl.acm.org/doi/10.1145/3173574.3173590
- Findlater, L., & McGrenere, J. (2004). *A Comparison of Static, Adaptive, and Adaptable Menus*. CHI '04. DOI:10.1145/985692.985704. https://dl.acm.org/doi/10.1145/985692.985704
- Mathur, A., et al. (2019). *Dark Patterns at Scale: Findings from a Crawl of 11K Shopping Websites*. arXiv:1907.07032. https://arxiv.org/abs/1907.07032
- European Parliament & Council (EU). (2016). *Art. 22 GDPR — Automated individual decision-making, including profiling*. Regulation (EU) 2016/679. https://gdpr-info.eu/art-22-gdpr/
- Li, T., Vorvoreanu, M., DeBellis, D., & Amershi, S. (2022). *Assessing Human-AI Interaction Early through Factorial Surveys: A Study on the Guidelines for Human-AI Interaction*. ACM TOCHI. DOI:10.1145/3511605. https://www.microsoft.com/en-us/research/publication/assessing-human-ai-interaction-early-through-factorial-surveys-a-study-on-the-guidelines-for-human-ai-interaction/
- Kocielnik, R., Amershi, S., & Bennett, P. N. (2019). *Will You Accept an Imperfect AI? Exploring Designs for Adjusting End-user Expectations of AI Systems*. CHI '19. DOI:10.1145/3290605.3300641. https://dl.acm.org/doi/10.1145/3290605.3300641
- Wright, A. P., et al. (2020). *A Comparative Analysis of Industry Human-AI Interaction Guidelines*. arXiv:2010.11761. https://arxiv.org/abs/2010.11761
- Google PAIR (People + AI Research). (2019). *People + AI Guidebook: Explainability + Trust; Errors + Graceful Failure; Feedback + Controls*. https://pair.withgoogle.com/guidebook/

---

*v0.1 — Draft. Rubric authored via study-swarm (research-grounded), externally verified (retrieval oracle + two non-Claude groundedness families); not yet pressure-tested. PT0 target shortlist in [`evidence/PT0-candidates.md`](evidence/PT0-candidates.md). The boundary with the Cognitive Load audit's Section 4 (AI Compression Risk) is resolved by reference-and-extend (see boundary note); S0 adopts that section's Critical precondition so it does not over-fire on generic unsourced output. The four hard-failure patterns (forced_trust, manufactured_trust, invalid_provenance, placebo_control) are candidates to validate at first pressure test. See [`CHANGELOG.md`](CHANGELOG.md).*
