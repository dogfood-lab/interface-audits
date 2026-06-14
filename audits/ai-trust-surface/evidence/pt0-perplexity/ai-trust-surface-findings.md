# AI Trust Surface Audit — PT0 Findings
## Perplexity.ai — citation-forward AI search

| Field | Value |
|---|---|
| Audit | AI Trust Surface Audit v0.1 (Draft) |
| Run ID | pt0-perplexity |
| Audit ID | at-20260613-pt0-perplexity |
| Target | https://www.perplexity.ai/ (consumer AI-search answer surface) + documented answer/search architecture at https://docs.perplexity.ai/ |
| Method | Path 2 / documented-architecture (doc-fallback). Live answer DOM was 403-walled to WebFetch; evidence is drawn from Perplexity's own API/response-schema documentation + the rubric's empirical floors |
| Date | 2026-06-13 |
| Auditor | Claude Opus 4.8 (PT0 run) |
| Rubric | [`../../RUBRIC.md`](../../RUBRIC.md) |

---

## Evidence-mode limitation (read first)

This pressure test could **not** run against the live rendered Perplexity answer surface. `https://www.perplexity.ai/` and every `www.perplexity.ai/hub/*` help/blog/legal page returned **HTTP 403** to WebFetch (bot-walled), and the bare app shell exposes no server-rendered answer content. The auditor has **no live browser, no AT, no OS toggles, and no pixel/render access** — identical in class to the prior doc-fallback PTs in this repo (`pt2-outlook-doc-fallback`).

What **did** resolve (HTTP 200) was the `docs.perplexity.ai` API documentation, which describes the **response contract** that backs the rendered answer surface — the `citations` array, the `search_results` objects, and the absence of any confidence field. This is **documented-architecture evidence**: it tells us what the product's answer pipeline returns, and therefore what the rendered UI has available to display, but it is not the rendered DOM itself.

**Consequences for evidence state:**
- Findings about the **answer/citation/search contract** (S0, S2, S3) are **Inferred** from the documented response schema, with the inference chain stated per finding. They describe what the surface *can* show given what the pipeline returns.
- Findings about **rendered-UI specifics** (is provenance inline-glanceable or click-gated; is there an undo; does a control change output) that I could not fetch are **Open questions** with explicit resolution paths.
- **No finding is Observed.** Nothing was captured from the live rendered surface in this run.

The cleaner path — a signed-in live session that triggers a wrong/fabricated answer on a fast-moving topic, then checks whether each rendered citation resolves and supports the specific claim — is the preferred PT and should replace this run for the S0 faithfulness and S2 inline-grounding confirmations.

**What was checked and NOT found (discipline note up front):** I specifically looked for a "hallucination-free / eliminates hallucinations / fully grounded / no errors" overclaim in the fetched marketing/docs copy. The fetched pages did **not** contain one — the strongest fetched claim was *"unparalleled real-time, web-wide research and Q&A capabilities"* and *"raw, ranked web search results... real-time data."* Therefore the **S0 Critical-via-overclaim precondition does not trigger** in this run. I did not manufacture it. See AT-09 (open question) and the calibration notes.

---

## Surface summary

**What the AI does here:** Perplexity is a citation-forward AI search / answer engine. The user asks a question; the system retrieves web sources, generates a synthesized answer, and renders inline numbered citation markers plus a "Sources" list. The consequential action the AI drives is **the user adopting a synthesized factual claim as true** — often a fast-moving, news-, health-, legal-, or purchase-adjacent question where being wrong has real cost. The action is **low-to-medium friction to take but the downstream decision can be high-stakes**; the answer itself is **non-destructive** (reading an answer doesn't delete anything), so most reversibility weight sits on the *decision the user makes off the answer*, not on an AI-driven edit.

**Documented response contract (from `docs.perplexity.ai`, HTTP 200):**
- `citations` — *"Array of citations - URLs of sources used to generate the response"* — a **flat list of URL strings attached to the whole completion**.
- `search_results[]` — each object: `title`, `url`, `snippet` (*"Text snippet from the search result"*), `date`, `last_updated`, source type (web/attachment).
- **No** confidence, certainty, reliability, or quality field anywhere in the response schema.
- **No** per-claim / span-level mapping between a sentence and its source.
- **No** field indicating whether a listed source was actually *used* to generate a given claim vs merely retrieved.

**Strongest fetched product claim:** *"Power your products with unparalleled real-time, web-wide research and Q&A capabilities"* / *"Get raw, ranked web search results with advanced filtering and real-time data."* (No accuracy/grounding/hallucination claim found in fetched copy.)

---

## Section 0 — Source provenance

**Status: WARN**

Two findings: one High (AT-01 — citation faithfulness is uncheckable at the contract level), one Medium (AT-02 — no documented up-front error-profile statement on the fetched surfaces). One open question (AT-09) parks the unfetched "grounded/accurate" marketing-overclaim check. Section does not reach the 3-High / 1-Critical Fail threshold.

### Finding AT-01 — Citations are a flat URL list with no span-level grounding; faithfulness is uncheckable

Severity: **High**
Section: source_provenance
Surface: Answer + "Sources" list (rendered surface, inferred from documented response contract)
Load displaced to: `verification`, `source recovery`, `trust`
Evidence state: **Inferred**
at_trust_pattern: invalid_provenance
hax_phase: when_wrong

Issue:
Perplexity's documented answer contract returns `citations` as *"Array of citations - URLs of sources used to generate the response"* — a single flat list attached to the whole answer — and `search_results[]` carrying `title`/`url`/`snippet`/`date`. There is no documented field that ties a *specific sentence or claim* to the *specific source span* that supports it, and no field indicating whether the model actually relied on a listed source versus retrieving it and answering from prior knowledge. The rendered UI inherits this: a numbered marker points the user to a source *document*, not to the *passage* that backs the claim it is attached to.

Why it matters:
This is the correctness-vs-faithfulness gap the AIS framework and the RAG-faithfulness literature name directly. Per [F14] a claim is grounded only if attributable to a *specific supporting span*, and per [F17] up to 57% of RAG citations are post-rationalized — the model answers from prior knowledge and back-fills a plausible source — so a flat, document-level citation that *looks* valid gives the user no way to check whether it actually supports the claim. The user is asked to accept the answer because a source is *listed*, not because the source was shown to *support the specific statement*. Per the AI Trust Surface Law, the cost of a topically-relevant-but-unsupporting citation is displaced onto the user, who must leave the surface, open the source, and hunt for the supporting passage themselves — exactly the verification the inline marker implies has already been done.

Evidence:
**Inferred** from the documented response schema at `docs.perplexity.ai/api-reference/chat-completions-post` (HTTP 200): `citations` = *"Array of citations - URLs of sources used to generate the response"* (flat list); `search_results[]` fields = title/url/snippet/date/last_updated, with **no claim-support, relevance, or faithfulness field** (confirmed against `docs.perplexity.ai/api-reference/search-post`: *"no field indicating faithfulness, claim verification, or whether a result supports a specific assertion"*). The failure case — a citation that resolves and is topically relevant but does not support the specific claim — was **not exercised live** (it requires a triggered wrong/fabricated answer on the rendered surface; see AT-08 open question). The finding is about the *contract's inability to express span-level grounding*, which is structural and documented; the per-answer faithfulness rate is the open question.

Fix:
Render span-level grounding: tie each inline citation marker to the *specific quoted passage* in the source that supports the *specific clause* it annotates, shown inline on hover/expand (demarcated as retrieved evidence, not model prose — per S2 [F19]), so the user can check faithfulness without leaving the surface. Where the pipeline cannot establish span-level support for a claim, surface that the claim is un-grounded rather than attaching a document-level citation that implies it is.

---

### Finding AT-02 — No up-front error-profile / fallibility statement on the fetched surfaces

Severity: **Medium**
Section: source_provenance
Surface: Product landing / docs (fetched), pending the rendered answer surface
Load displaced to: `trust`
Evidence state: **Inferred**
at_trust_pattern: invalid_provenance
hax_phase: initially

Issue:
Across the fetched product/docs pages, the surface states capability — *"unparalleled real-time, web-wide research"* — but no fetched page stated, before use, what the feature is and is **not** reliable at, or its expected error profile (e.g., "answers on fast-moving news are more often wrong," "citations can be topically relevant without supporting the claim"). Capability is asserted; fallibility is not.

Why it matters:
Per [F28], setting expectations about AI imperfection *before* use significantly raises appropriate acceptance and shifts perceived accuracy independent of real accuracy; the absence of any expected-error-profile statement leaves the user to calibrate from confident, capability-forward copy alone. The HAX "Initially" phase (G1/G2) treats this as load-bearing. This is the lower-severity provenance axis — there is no *false* grounding claim here (that would be S0 High/Critical), only an *absent* fallibility statement — so it classifies Medium, not High.

Evidence:
**Inferred** from fetched copy: `docs.perplexity.ai/getting-started/overview` (HTTP 200) yields capability claims (*"real-time, web-wide research and Q&A"*) and **"No claims are made regarding accuracy levels, reliability guarantees, hallucination prevention, the possibility that answers could be wrong."** The consumer-facing help/onboarding pages (`www.perplexity.ai/hub/*`) were **403-walled** and could not be checked for an in-product "AI can make mistakes"-style disclaimer; whether one appears on the rendered answer surface is **AT-10 (open question)**. The finding is scoped to the surfaces actually fetched.

Fix:
State the expected error profile at the point of first use and near the answer: name the topics/conditions where citation error is highest [F16], and frame it as "verify before relying," not as marketing reassurance. A single honest fallibility line outperforms confident capability copy for appropriate reliance [F28].

---

## Section 1 — Reversibility

**Status: WARN**

One Medium finding (AT-03 — feedback-loop effect invisibility, contract-inferred). The core reversibility questions for this surface are mostly **not applicable or open**: Perplexity's answer flow is non-destructive (reading an answer changes no user state), so the classic "irreversible AI edit with no undo" [F8/F13] does not cleanly apply, and "can you stop a streaming answer" is an unfetched open question. This section is deliberately *not* over-fired.

### Finding AT-03 — Thumbs-up/down feedback with no documented visible state change (ask-then-swallow risk)

Severity: **Medium**
Section: reversibility
Surface: Per-answer feedback controls (thumbs / "rewrite" affordances, inferred)
Load displaced to: `recovery / undo`, `trust`
Evidence state: **Open question → Medium (provisional)**
at_trust_pattern: no_recovery
hax_phase: when_wrong

Issue:
Consumer AI-answer surfaces of this class typically expose per-answer feedback (thumbs up/down, "this is wrong," report) and a regenerate/rewrite action. Whether submitting that feedback produces any *visible* change — a corrected answer, an acknowledgment that the prior answer was wrong, a re-grounded result — is not established by anything fetched. The documented contract carries no feedback-effect field, and the rendered behavior was not observable.

Why it matters:
Per [F11], soliciting human-in-the-loop correction feedback that produces no visible state change actually *lowers* trust and perceived accuracy — the "ask for feedback then swallow it" pattern. If the only recovery path Perplexity offers on a wrong answer is feedback that disappears into a backend, the user has corrected nothing and learned nothing. This is held at Medium (not High) precisely because (a) the surface is non-destructive — there is no irreversible AI action to undo — and (b) the existence and behavior of the feedback control on the rendered surface is an open question, not observed. Promoting this to High would require observing that feedback is the *only* recovery path AND that it swallows the input.

Evidence:
**Open question, held provisionally at Medium.** No fetched artifact confirms the feedback control's presence or its post-submit behavior on the rendered surface. The Medium reflects the documented absence of any feedback-effect field in the response contract plus the literature's named failure mode [F11], not a live observation. Resolution: see AT-11.

Fix:
When a user flags an answer as wrong, show the effect — re-run the query with the flagged claim de-weighted, present a corrected/re-grounded answer, or at minimum acknowledge the prior answer is disputed — rather than accepting the click silently [F11]. A correction that changes nothing visible is worse than no correction control.

---

## Section 2 — Inspection affordances

**Status: WARN**

One High finding (AT-04 — provenance reachable only by click-out, no inline span-level grounding). This is the S2 sibling of AT-01: S0 owns "the contract can't express span grounding"; S2 owns "the user can't cheaply verify because grounding isn't glanceable inline."

### Finding AT-04 — Provenance gated behind a click-out, no inline glanceable supporting evidence

Severity: **High**
Section: inspection_affordances
Surface: Inline citation markers + "Sources" list (rendered, inferred from contract)
Load displaced to: `verification`, `source recovery`, `navigation`
Evidence state: **Inferred**
at_trust_pattern: invalid_provenance
hax_phase: when_wrong

Issue:
The documented contract returns a `url` and a `snippet` per search result but no claim-to-span mapping, so the rendered surface's verification path is: read the answer, notice a numbered marker, *click out* to the source document, then hunt for the passage that supports the claim. The supporting evidence is not rendered inline next to the claim in a form the user can check at a glance.

Why it matters:
Per [F18], clicking on sources remains infrequent across *all* citation-design conditions — higher-visibility presentations raise hovering and attention but do not convert users into clicking through and verifying. Provenance gated behind a click the literature shows users overwhelmingly will not make is effectively invisible: the answer is adopted on the *presence* of a citation, not its *content*. Per [F19], if the click-out (or a hover panel) shows the model's confident restatement rather than the *retrieved evidence*, verification accuracy can drop below the no-AI baseline. The audited bar [F18, F5] is inline supporting evidence visible without navigation; a click-to-verify link is the pattern the literature shows goes unused. This sits one notch above AT-01's contract-structural High because it is the *user-facing* verification-cost failure: even a faithful citation is uncheckable in-flow if the supporting span isn't glanceable.

Evidence:
**Inferred** from the documented contract: `citations` are URL strings and `search_results[]` carry only a `snippet` (a page-level extract, not a claim-aligned span) — so the cheapest documented verification path is a click-out to the source page. Whether the rendered UI shows an inline hover panel with the *claim-aligned* supporting passage (vs the whole-page snippet or a model restatement) was **not observable** (403 wall) and is **AT-12 (open question)**. The finding is scoped to what the contract makes available: a page-level snippet and a URL, not a claim-aligned inline span.

Fix:
Show the claim-aligned supporting passage inline — on hover/expand of each citation marker, render the exact sentence(s) from the source that support the annotated clause, visually demarcated as *retrieved source text* (not model prose) per [F19], so verification is cheaper than blind acceptance [F5] and does not require a click-out the literature shows users skip [F18].

---

## Section 3 — Confidence communication

**Status: WARN**

One High finding (AT-05 — no per-decision confidence/uncertainty signal in the documented contract). I deliberately did **not** fire the higher-severity S3 patterns (placebic explanation [F3], uncalibrated *displayed* number [F2], one-sided steering [F6]) because those require *observing a confidence display* — and the documented contract shows there is *no* confidence field to display. The failure here is *absence* of a signal [F1], not a *miscalibrated* one. Firing F2/F3 would be manufacturing a finding about a display I never saw.

### Finding AT-05 — No per-decision confidence or uncertainty signal on a consequential answer

Severity: **High**
Section: confidence_communication
Surface: Rendered answer (inferred from documented response contract)
Load displaced to: `trust`, `verification`
Evidence state: **Inferred**
at_trust_pattern: forced_trust
hax_phase: when_wrong

Issue:
The documented response schema carries **no** confidence, certainty, reliability, or quality field per answer — and no documented per-claim uncertainty marking. The synthesized answer is rendered in uniform, fluent, declarative prose regardless of whether a given claim is well-supported by a strong source or thinly inferred from a weak one. Every clause wears the same confident voice.

Why it matters:
Per [F1], a per-decision confidence signal is the minimum bar for a consequential AI output, and its absence is an S3 finding. Uniform confident prose is itself a calibration failure in the over-trust direction [F2, F7]: the user cannot tell the model's strong claims from its weak ones, so they over-rely on the weak ones. This is forced trust — the surface gives the user no uncertainty handle to calibrate against, while presenting fast-moving and error-prone answers [F16] in the same authoritative register as settled facts. It is held at High (not Critical) because the answer action is non-destructive: there is no high-stakes *irreversible* AI action that the overconfidence is driving (the Critical precondition for S3 requires high-stakes AND irreversible, cross-link S1), only a high-stakes *decision the user may make* off the answer.

Evidence:
**Inferred** from the documented response contract (`docs.perplexity.ai/api-reference/*`, HTTP 200): no confidence/certainty/reliability field exists in the chat-completions or search response schema (*"No confidence, certainty, or reliability fields exist... There are no per-answer quality indicators"*). Whether the *rendered UI* layers any uncertainty language ("this is contested," "limited sources") on top of the API answer was **not observable** and is **AT-10 (open question)**. The finding is that the answer pipeline produces no confidence signal for the UI to render; the absence of a *contract* field strongly implies the absence of a *rendered* calibrated signal, but does not prove the UI adds no hedging.

Fix:
Surface a per-answer (and ideally per-claim) uncertainty signal **backed by a measurement or hedged as heuristic** [F1, F2] — e.g., flag claims supported only by a single weak/low-authority source, or where retrieved sources disagree, distinct from claims with strong corroboration. Do **not** ship a bare confidence number with no calibration evidence — that is itself High [F2] and would convert this absence-finding into a manufactured-trust finding. Calibrated, content-bearing uncertainty only.

---

## Section 4 — Adaptation transparency

**Status: WARN**

One open question only (AT-13). No finding is fired. Whether Perplexity personalizes answers from account history/activity, and whether that fact is disclosed, was **not establishable** from the fetched surfaces (the privacy/personalization pages were 403-walled). The honest output here is an open question, not an inferred silent-adaptation High.

*(No findings. See AT-13.)*

---

## Section 5 — User control

**Status: WARN**

One open question (AT-14) on the placebo-control test, and one Medium (AT-06) on the opt-out discoverability axis — scoped narrowly to what is defensible without the fetched settings/legal pages.

### Finding AT-06 — Personalization/data opt-out discoverability not surfaced on fetched surfaces; placebo-control test not runnable

Severity: **Medium**
Section: user_control
Surface: Settings / privacy controls (not fetched — 403)
Load displaced to: `configuration`, `navigation`
Evidence state: **Open question → Medium (provisional)**
at_trust_pattern: placebo_control
hax_phase: over_time

Issue:
For a consumer AI-search product that (per its category and the rubric's adaptation concern) plausibly personalizes from account activity, the rubric requires a *discoverable* opt-out not buried in policy text [F26], and behavioral proof that any personalization control actually changes output (the placebo test [F23]). Neither could be established: the settings and privacy pages returned 403, so the location and reachability of an opt-out, and whether any control measurably changes results, are unverified.

Why it matters:
Per [F26] (GDPR Art. 22 floor), a consequential automated-decision/personalization surface must offer a discoverable opt-out, and per [F23] a control with no observable effect on output is a placebo that self-reported satisfaction cannot validate — behavioral proof is required. The audit *cannot* assert either failure here because the control surface was not fetched; it can only record that the opt-out's discoverability is unverified and the placebo test was not runnable. This is held at Medium and flagged provisional precisely to avoid manufacturing a placebo-control High on an unfetched surface. If a live run finds the opt-out buried in policy text [F26] or finds a personalization toggle that does not change output [F23], this promotes to High.

Evidence:
**Open question, held provisionally at Medium.** `www.perplexity.ai/hub/legal/privacy-policy` and `www.perplexity.ai/settings/*` were **403-walled**; no opt-out location, no control behavior was observed. The Medium reflects the *unverified* state of a required affordance on a consequential surface, not an observed failure. Resolution: AT-14.

Fix:
Provide a discoverable, in-product opt-out from personalization/automated tailoring — reachable from the answer surface, not only from policy text [F26] — and pair each personalization control with a visible preview of how toggling it changes results [F22, F23] so the user can confirm the control is real and form intent.

---

## Section 6 — Configuration cost

**Status: WARN**

One Medium finding (AT-07 — verification is rational to skip given the click-out cost). This is the recursive-trap reading of AT-04: not just "grounding is click-gated" but "the cost of verifying is high enough that non-use is rational."

### Finding AT-07 — Verification cost (click-out per claim) makes non-verification rational

Severity: **Medium**
Section: configuration_cost
Surface: Answer → citation → source-page verification path (inferred)
Load displaced to: `time`, `verification`, `navigation`
Evidence state: **Inferred**
at_trust_pattern: invalid_provenance
hax_phase: when_wrong

Issue:
Given the documented contract (URL + page-level snippet, no claim-aligned span), the per-claim verification path costs the user a context-switch out to the source page and a manual hunt for the supporting passage — for each claim they want to check. The trust affordance (the source) is reachable, but its operation cost at the moment of a consequential decision is high.

Why it matters:
Per [F5], explanations/verification reduce over-reliance only when they make verifying *cheaper* than blind acceptance; when verification cost is high or payoff low, users rationally skip it and over-rely. Per [F18], this is exactly why click-gated sources go unchecked. The cost here is in `time` (a click-out and a passage-hunt per claim) and `navigation` (leaving the answer surface). This is the configuration-cost / recursive-trap framing of the same root cause as AT-04; it is Medium because it is the cost dimension of an already-counted High, not a second independent High.

Evidence:
**Inferred** from the documented contract: verification requires resolving a `url` and reading a source page to locate support, since no claim-aligned inline span is provided. The exact number of interaction steps on the rendered surface, and whether a hover panel reduces the cost, were not observable (403) — see AT-12. Scoped to the documented contract's verification path.

Fix:
Collapse verification cost to near-zero: inline claim-aligned supporting passages (per AT-04's fix) remove the click-out and the passage-hunt, making verification cheaper than blind acceptance [F5] and reachable in-flow at the decision point [F18].

---

## Section 7 — Evidence

**Status: FAIL (process)**

This run did **not** exercise a sub-optimal / wrong / fabricated AI output on the live surface — the rendered answer surface was 403-walled, so no failure case could be triggered or observed. Per the rubric, **"No failure case exercised at all on a consequential surface — section Fail on process grounds."** Every finding above is Inferred from the documented architecture or held as an open question; none was validated against a triggered wrong answer with its citations checked for existence and support. This is the honest process state of a doc-fallback run and it is recorded as a Fail, not laundered into a pass.

The findings remain useful — they identify *structural* trust-surface gaps in the documented contract that hold regardless of any single answer's correctness — but per Section 7 every affordance "scored as passing" is provisional, and here nothing is scored as passing on a failure case. The live PT that triggers a wrong answer (AT-08) is the standing next step.

*(No findings; this is a process gate. See AT-08 open question.)*

---

## Open questions

These are genuine evidence gaps, preserved rather than laundered into findings. Each has a resolution path that a live, signed-in session would close.

### AT-08 — Failure case never exercised (Section 7 blocker)
No wrong/fabricated answer was triggered on the live surface; no citation was checked for existence or support. **Resolution:** signed-in live session — query a fast-moving news or niche topic where citation error is highest [F16], capture the answer, then for each citation confirm (a) the link resolves and (b) the linked content supports the *specific* claim it annotates. Promotes AT-01/AT-04 from Inferred to Observed and unblocks Section 7.

### AT-09 — "Grounded / accurate / hallucination-free" overclaim not checkable on walled marketing pages
The S0 Critical-via-overclaim precondition could not be evaluated against the consumer marketing copy (`www.perplexity.ai/hub/*` 403). Fetched docs made **no** such claim, so the precondition does not trigger on what was seen — but the consumer-facing landing/marketing surface was not readable. **Resolution:** fetch the rendered marketing homepage and feature pages via a live session; if a "hallucination-free / fully grounded / no errors" claim appears, S0 escalates per [F15] (High, or Critical paired with a high-stakes irreversible action).

### AT-10 — Does the rendered UI add any per-answer confidence/uncertainty language?
The API contract has no confidence field, but the rendered UI might layer hedging ("this is contested," "limited sources"). **Resolution:** live session — inspect the rendered answer for any uncertainty signal; if a confidence display exists, re-run S3 against [F2]/[F3] (is it calibrated? placebic?). If absent, confirms AT-05 as Observed.

### AT-11 — Does answer feedback (thumbs/report) produce a visible state change?
**Resolution:** live session — submit "this is wrong" on a wrong answer; observe whether the answer updates, is re-grounded, or the input vanishes silently [F11]. Promotes/resolves AT-03.

### AT-12 — Is provenance shown inline-glanceable (hover panel with claim-aligned span) or only click-out?
**Resolution:** live session — hover/expand a citation marker; record whether the panel shows the claim-aligned supporting passage (retrieved evidence) vs the model's restatement [F19] vs only a page-level snippet/link [F18]. Promotes/resolves AT-04.

### AT-13 — Does Perplexity personalize from account activity, and is that disclosed? (S4)
**Resolution:** live signed-in session across repeated/varied queries + read the (walled) privacy page; determine whether answers are tailored to history and whether the *fact* of adaptation is disclosed [F20]. If personalization is silent, S4 fires a High [F20].

### AT-14 — Is there a discoverable personalization opt-out, and does any control change output? (S5 placebo test)
**Resolution:** live session — locate the personalization/data control; confirm it is reachable outside policy text [F26]; toggle it and verify output changes (the behavioral placebo test [F23]). Promotes/resolves AT-06.

---

## Positive observations

### PO-01 — Citations and retrieved search results are part of the answer contract at all
Unlike a bare chat completion, Perplexity's documented contract returns `citations` (source URLs) and `search_results[]` (title/url/snippet/date) as first-class fields. Source URLs being present and machine-addressable is the *precondition* for provenance — the gap (AT-01/AT-04) is span-level grounding and inline glanceability, not the total absence of sources. This is a meaningfully better starting point than a no-citation answer surface.

### PO-02 — `date` / `last_updated` are carried per source
The search-result schema carries `date` and `last_updated` per source, giving the surface the *material* to signal source recency on fast-moving topics (where citation error is highest [F16]). Whether the rendered UI uses it is unverified, but the data is in the contract.

---

## Auditor notes / Calibration trail

This is the **reclassification record** — the audit working. Per the discipline rule, every finding started at the most conservative state and was re-checked against the rubric's actual criteria.

**The headline discipline call: I did NOT fire an S0 Critical.** The lead candidate's expected headline was an invalid-provenance Critical. The S0 Critical precondition requires a *claimed/implied verifiable basis* (cited / "based on your data" / hallucination-free) that is *not inspectable or not faithful*. On the fetched evidence: (a) the marketing/docs copy I could read makes **no** "hallucination-free / grounded" overclaim — so the overclaim path does not trigger (parked as AT-09, because the consumer marketing page was walled); and (b) the faithfulness gap (AT-01) is real and structural but, absent a *triggered wrong answer with a checked-unfaithful citation*, it is **Inferred High**, not Critical. Asserting a Critical from the *absence* of span-grounding plus the *absence* of a checked failure case would be manufacturing drama. **This is the rubric's S0 precondition doing exactly its job** — it stopped a candidate-driven Critical that the evidence does not earn.

**S3: absence ≠ miscalibration.** The richest S3 findings ([F2] uncalibrated displayed number, [F3] placebic explanation, [F6] one-sided steering) all require *observing a confidence display*. The documented contract has **no** confidence field, so there is nothing displayed to mis-calibrate. I fired only [F1] (no per-decision signal — High) and explicitly did **not** invent an F2/F3 finding about a display I never saw. The rendered-UI hedging question is parked as AT-10.

**Reclassification trail (conservative-start → final):**
- **AT-01** (faithfulness): started *Open question* (is any answer actually unfaithful?) → re-checked → the *contract-level inability to express span grounding* is documented and structural, so the **structural** finding is **Inferred High**; the *per-answer faithfulness rate* stays an Open question (AT-08). Split honestly rather than promoted whole.
- **AT-03** (feedback swallow): started *Open question* → held *Medium provisional*, NOT promoted to High, because the surface is non-destructive and the control's behavior is unobserved. Promoting to High would require observing feedback as the only recovery path AND that it swallows input.
- **AT-05** (no confidence): started *Open question* (maybe the UI hedges) → the *contract* unambiguously has no confidence field, so **Inferred High** on the pipeline-produces-no-signal basis; the *rendered-UI-might-hedge* possibility stays Open (AT-10). Held at High not Critical (non-destructive action, S3 Critical needs high-stakes + irreversible).
- **AT-06** (opt-out / placebo): started *Open question* → held *Medium provisional*, NOT a placebo-control High, because the control surface was 403-walled and no placebo behavior was observed. Manufacturing a placebo High on an unfetched control is exactly the over-fit this rule guards against.
- **S4** (adaptation): produced **zero findings** — only AT-13 open question — because nothing about personalization disclosure was fetchable. A silent-adaptation High [F20] would have been pure invention here.

**Hard-failure patterns (this target):**

| Pattern | This run | Why |
|---|---|---|
| `forced_trust` | **true** (Inferred) | AT-05: uniform confident prose, no uncertainty handle; AT-04: verification click-gated. The user must accept the answer with no cheap inspect/calibrate path. |
| `invalid_provenance` | **partial / Inferred** | AT-01 + AT-04: the *structure* (flat citations, no span grounding) is the documented invalid-provenance *risk*; the *confirmed* unfaithful-citation case is unexercised (AT-08). Marked true-with-caveat in the scorecard's structural sense, but the live faithfulness check is the open blocker. |
| `manufactured_trust` | **false / null** | No confidence display was observed to be placebic — there is no confidence display at all (AT-05). Cannot validate manufactured_trust on a surface that surfaces no confidence. `null` (not exercisable on the fetched surface). |
| `placebo_control` | **null** | Control surface 403-walled (AT-06/AT-14). Not exercisable this run. |

**Evidence-mode caveat:** this is a **doc-fallback / documented-architecture** run. The `docs.perplexity.ai` API reference is strong evidence for the *response contract* (what the pipeline returns, hence what the UI can render) but is **not** the rendered DOM and **not** a triggered failure case. Section 7 is correctly a Fail. The live PT that triggers a wrong answer and checks its citations (AT-08) is the standing next step and should replace this run for the S0-faithfulness and S2-inline-grounding confirmations.

---

## Parked rubric-revision candidates (NOT applied — PT0 leaves the rubric unchanged)

Surfaced during the run; logged for a future version cut, not edited into the rubric now.

1. **A "documented-contract" evidence sub-lane.** This run leaned on the product's *own API/response schema* as evidence about its rendered trust surface — stronger than generic vendor marketing docs, weaker than rendered DOM. The evidence-states doc names "vendor documentation"; it could name "first-party response/API contract" as a distinct, slightly-stronger Inferred sub-lane, since it describes what the UI *can* render rather than what marketing *claims*.
2. **An explicit "absence-of-confidence-field" vs "miscalibrated-confidence-display" split in S3.** The run had to be careful that [F1] (no signal) is a different, lower-ceiling finding than [F2]/[F3] (bad signal). S3's severity hooks list both but a reader could conflate them; a one-line note that *absence* caps at High [F1] while a *displayed-but-uncalibrated* number is also High [F2] but opens the Critical path (overconfident + irreversible) would sharpen the discipline.
3. **S0/S2 split guidance for the same root cause.** AT-01 (S0: contract can't express span grounding) and AT-04 (S2: user can't cheaply verify inline) are the same root cause scored in two sections. The rubric already cross-links S0↔S2, but explicit guidance on *when to split one root cause across S0 and S2 vs counting once* would prevent double-counting toward a section Fail.

---

*End of PT0 (Perplexity, documented-architecture / doc-fallback). Live-session PT triggering a wrong answer is the standing next step (AT-08).*
