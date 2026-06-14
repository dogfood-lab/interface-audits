# AI Trust Surface — PT0 (Bing SSR search + first-party trust-doc triangulation)

**Run ID:** `pt0-bing`
**Audit ID:** `at-20260613-pt0-bing`
**Rubric:** [`../../RUBRIC.md`](../../RUBRIC.md) — v0.1 (Draft). Findings trace to its sections and audit questions; the rubric is canonical and is **unchanged** by this run.
**Method:** Path 2 — fetched server-rendered DOM (Bing SSR search) + first-party vendor trust documentation. Several findings are **Observed** (the trust affordance, or its absence, is literally in the returned bytes); affordances a first-party doc describes but that could not be exercised are **Inferred**; runtime behaviors that could not be reached are **Open questions**.
**Date:** 2026-06-13.

> **This run supersedes [`../pt0-perplexity/`](../pt0-perplexity/).** That earlier PT0 hit an HTTP 403 bot-wall on the live Perplexity answer surface and fell back to documented-architecture evidence. It produced **zero Observed findings** and a **Section 7 process Fail** — no wrong/fabricated AI output could be exercised, so no affordance was tested under failure. A target-discovery study swarm then vetted *fetchable* targets by actually WebFetching them. This run uses those targets to produce real Observed findings and a real, reproducible failure case. The pt0-perplexity directory is retained as the calibration record of the doc-fallback that the discipline rule correctly refused to launder into Observed claims.

---

## Target and state

**Primary surface — Bing SSR search** (`https://www.bing.com/search?q=...`). Bing returns a server-rendered results page in the HTTP body, so the page-level provenance affordance — the verbatim string **"Content was generated with AI. Learn more"** — is present in the fetched bytes. That makes it **Observed**, not Inferred. This is the central reason this run is stronger than the Perplexity doc-fallback: the trust label is in the markup, and so is its *absence of* any accompanying confidence signal.

Four queries were fetched to test the affordance across answer states (this is Section 7 — the affordance must be exercised under *failure*, not only the happy path):

| Query | Result state | AI label present? | Confidence/uncertainty cue? |
|---|---|---|---|
| `how does mRNA vaccine work` | **Misfire** — returned grammar/dictionary results for the word *"does"*, not vaccine content | **Yes** — "Content was generated with AI. Learn more" | **None** |
| `does` | Ambiguous single word (verb vs. plural of *doe*); no disambiguation offered | **Yes** | **None** |
| `why did the roman empire adopt the euro currency` | **False premise** (euro is a 1999 currency); engine neither corrected nor engaged the premise | **Yes** | **None** |
| `what year did the berlin wall fall` | Clean, well-formed factual query | **Yes** | **None** |

The label renders **identically** across a clean query, an ambiguous query, a false-premise query, and a hard misfire. It is a static page-footer element, not tied to answer quality. That invariance is the finding: a provenance label that fires whether the AI is right or catastrophically wrong, with no confidence channel beside it, tells the user *that* AI touched the page but nothing about *whether to trust this instance* — and persists, unchanged, on the exact outputs where trust should drop. **The misfire on `how does mRNA vaccine work` is the Section 7 observable failure case the Perplexity run could not produce.**

**Complementary first-party sources** (primary_sources — used for sections Bing's footer markup does not reach; first-party vendor docs, stronger than marketing copy):

- **Google AI Overviews help** — `https://support.google.com/websearch/answer/14901683`. Source for an Observed fallibility statement [F28], an Observed buried/absent opt-out [F26], Observed click-gated provenance [F18], and absent confidence framing.
- **DuckDuckGo HTML instant answer** — `https://html.duckduckgo.com/html/?q=what+is+retrieval+augmented+generation`. Source for a **citation-faithfulness check** [F17] against the cited Wikipedia article (an S2/S0 finding), and the absence of any AI label / confidence cue on the instant answer (S0/S3).
- **Recommender-transparency triad** — TikTok / YouTube / Netflix help pages. Source for S4 silent-adaptation and feedback-effect findings [F20, F22] and S5 opt-out / granularity / geo-gating findings [F26, F24].
- **Anthropic Claude Citations blog** — `https://claude.com/blog/introducing-citations-api`. Source for the S0 overclaim **judgment** case [F15]: first-party copy stays qualified ("minimize hallucinations") so this is *not* a Critical, but it platforms a customer "10% → 0% hallucination" claim that collides with the empirical floor.

**Stakes / reversibility (gates the S0/S1/S3 Critical preconditions).** The action these surfaces drive — reading a synthesized answer / adopting a recommended item — is **non-destructive and reversible** (reading an answer changes no user state; no AI-initiated edit/send/delete is present on any audited surface). The downstream *decision* the answer informs can be medium-to-high stakes (the mRNA-vaccine query is health-adjacent), but the AI **action itself is reversible**. Therefore the S0/S1/S3 Critical preconditions (which require a high-stakes AND **irreversible** AI-driven action) do **not** trigger on these surfaces. No Critical is fired in this run; doing so would manufacture drama the evidence does not earn.

---

## Findings

## Finding AT-01 — AI provenance label persists on misfiring output with no confidence channel

Severity: High
Section: Confidence communication
Surface: Bing SSR search results page — page-footer label "Content was generated with AI. Learn more"
Load displaced to: trust, verification
Evidence state: Observed
at_trust_pattern: forced_trust
hax_phase: when_wrong

Issue:
Bing's server-rendered results page carries a fixed footer label, "Content was generated with AI. Learn more." Across four fetched queries — a clean factual query, an ambiguous single word, a false-premise query, and a hard misfire — the label renders **identically** and is the **only** AI-trust signal on the page. There is no per-result, per-answer, or page-level confidence value, certainty score, uncertainty hedge, or "AI can make mistakes" disclaimer accompanying it. The label communicates *that* AI is involved; it communicates nothing about *whether to rely on this particular result set*.

Why it matters:
This is the failure mode S3 exists to catch in its absence form [F1]: there is no per-decision confidence or uncertainty signal on consequential output. A provenance label with no calibration channel is the worst of both — it asserts AI involvement (which invites the user to weight the output) while withholding the one signal (calibrated uncertainty) that would let the user weight it *correctly*. Per the AI Trust Surface Law, a surface that announces AI authorship but gives the user no way to calibrate reliance has displaced the cost of the model being wrong onto the user. The label's *invariance across answer quality* is the sharp edge: it does not change when the answer is wrong, so it cannot help the user notice that the answer is wrong.

Evidence:
Observed in the fetched bytes of four queries (2026-06-13). On `q=how+does+mRNA+vaccine+work` the page returned grammar/dictionary results for the word "does" — a complete misfire on a health query — and still rendered "Content was generated with AI. Learn more" with, verbatim, no confidence indicator, certainty score, or uncertainty hedge present. Identical label, identical absence of a confidence cue, confirmed on `q=does`, `q=why+did+the+roman+empire+adopt+the+euro+currency`, and the clean `q=what+year+did+the+berlin+wall+fall`. The affordance was exercised on a **sub-optimal/wrong** output, satisfying Section 7. Source: `https://www.bing.com/search?q=how+does+mRNA+vaccine+work` (and the three sibling queries above).

Fix:
Either (a) pair the AI label with a per-answer confidence/uncertainty signal that is *backed by measurement* (not an unmeasured number — an unmeasured confidence display is itself a High under [F2]), and that visibly degrades or suppresses the synthesized answer when retrieval is weak or the query is ambiguous/false-premise; or (b) if no calibrated signal is available, gate the AI synthesis behind a low-confidence state (show traditional results without an AI assertion) rather than presenting a uniform "AI generated this" stamp on outputs the system has no confidence basis for. The label must stop being a constant and start being a signal.

---

## Finding AT-02 — No disambiguation or false-premise handling; AI label renders on top of unhandled query failures

Severity: High
Section: Reversibility
Secondary section: Confidence communication
Surface: Bing SSR search — query interpretation on ambiguous / false-premise / misfiring queries
Load displaced to: recovery / undo, trust
Evidence state: Observed
at_trust_pattern: no_recovery
hax_phase: when_wrong

Issue:
On three of the four queries the surface failed to engage the user's actual intent and offered **no graceful-failure path**. `how does mRNA vaccine work` silently collapsed to results about the grammar word "does"; `does` returned a flat list of dictionary entries with no "did you mean the verb / the plural of *doe*?" disambiguation; `why did the roman empire adopt the euro currency` returned unrelated definitions and song lyrics with no flag that the premise is historically impossible. In every case the page proceeded as if it had succeeded — and stamped "Content was generated with AI" on the failed output. There is no inspect-and-correct loop, no "this looks like a parsing error — refine your query," and no surfaced uncertainty that would let the user recover from the misinterpretation.

Why it matters:
This is the S1 graceful-failure failure mode [F30] crossed with the S3 absence-of-signal mode [F1]: when the AI-mediated surface is wrong, it assumes correctness and offers the user nothing to recover with. The cost lands on the user as `recovery / undo` — they must notice the misfire themselves (the surface will not tell them), reconstruct what went wrong, and re-query, all while the AI label nudges them to *trust* the very output that failed. A false-premise query that returns confidently-framed irrelevance with no premise-correction is the most dangerous shape, because a less-attentive user may read the AI stamp as endorsement.

Evidence:
Observed (2026-06-13). `q=how+does+mRNA+vaccine+work` → dictionary/grammar results for "does," no vaccine content, no error or disambiguation surfaced, AI label present. `q=does` → no "did you mean" disambiguation despite genuine verb/noun ambiguity. `q=why+did+the+roman+empire+adopt+the+euro+currency` → unrelated results, no false-premise warning, AI label present. The graceful-failure path was tested directly on failure cases (Section 7). Source: the three query URLs above.

Fix:
Add a graceful-failure path that fires on the conditions the surface already encounters: low retrieval confidence, recognized ambiguity, and detectable false premises. At minimum, surface a "did you mean…" disambiguation for ambiguous queries and a "we could not find a confident answer for this" state instead of stamping AI provenance on a misfire. For false-premise queries, the AI synthesis should engage and correct the premise or decline — not return unrelated results under an AI label.

---

## Finding AT-03 — Anthropic Citations: first-party copy qualified, but platforms a customer "10% → 0% hallucination" claim that collides with the empirical floor

Severity: High
Section: Source provenance
Surface: claude.com Citations API blog post — customer testimonial (Endex)
Load displaced to: trust, verification
Evidence state: Observed
at_trust_pattern: invalid_provenance
hax_phase: initially

Issue:
Anthropic's own first-party copy in the Citations announcement stays **qualified**: "Cited text will reference source documents to **minimize hallucinations**" (and a Thomson Reuters quote about minimizing "hallucination risk"). Qualified language is the correct, S0-compliant framing. However, the same post platforms a customer testimonial that makes a far stronger, absolute numeric claim: Endex states it "reduced source hallucinations and formatting issues **from 10% to 0%**." A "to 0%" hallucination claim is an elimination claim. The post carries **no fallibility statement** noting that Claude can still err with Citations enabled.

Why it matters:
Per [F15], retrieval grounding does **not** eliminate fabrication — leading commercial legal RAG tools marketed as reducing or eliminating hallucination still hallucinated 17–33% of the time. A platformed "to 0%" claim collides directly with that empirical floor. Even though Anthropic's *own* voice is qualified, hosting an unqualified elimination claim in a first-party announcement lends it first-party credibility; a reader does not parse the byline distinction. This is invalid-provenance by overclaim: the surface implies a reliability (zero hallucination) that retrieval cannot deliver, which sets the user up to under-verify. The honest call here is the calibration the rubric demands — this is exactly where the auditor must *not* reach for Critical.

Evidence:
Observed (2026-06-13). Quoted verbatim from `https://claude.com/blog/introducing-citations-api`: first-party claim "minimize hallucinations" (qualified); customer (Endex) claim "we reduced source hallucinations and formatting issues from 10% to 0%" (absolute/elimination); no fallibility statement that Claude can still be wrong with Citations enabled was present in the fetched bytes. The empirical floor is [F15] (Magesh, Surani et al. 2024, arXiv:2405.20362).

Fix:
Per the S0 doctrine, scope the claim to the empirical floor. The platformed customer claim should be contextualized or qualified ("on this customer's document set / workload"), and the post should carry a one-line fallibility statement that Citations reduces but does not eliminate hallucination [F28] — the empirical floor is double-digit even with retrieval [F15]. This restores honest provenance without weakening the (qualified, correct) first-party framing.

Severity note:
**High, not Critical.** The S0 Critical precondition requires that the surface *itself* claim/imply a verifiable basis that is not inspectable/faithful AND (for the Critical escalation) be paired with a high-stakes irreversible action. Anthropic's first-party copy is qualified, so the Critical-via-first-party-overclaim path does not open; the overclaim that exists is a *platformed customer* claim, and no irreversible action is driven on this surface. High under [F15] is the calibrated call.

---

## Finding AT-04 — DuckDuckGo instant answer: citation is top-level only (no span-level grounding) and carries no AI label or confidence cue

Severity: Medium
Section: Inspection affordances
Secondary section: source_provenance
Surface: DuckDuckGo HTML instant-answer box (Wikipedia-sourced definition)
Load displaced to: verification, source recovery
Evidence state: Observed
at_trust_pattern: invalid_provenance
hax_phase: when_wrong

Issue:
The DuckDuckGo instant answer for "what is retrieval augmented generation" renders a definitional block sourced to a single citation — "Retrieval-augmented generation - Wikipedia" linking to the article's main page. The citation is **top-level only**: it points at the whole article, not the specific span the definition is drawn from, so a user cannot check *faithfulness* (whether the answer actually tracks the cited text) without opening the article and hunting for the passage. The instant answer also carries **no "AI-generated" label and no confidence/uncertainty cue** of any kind.

Why it matters:
Per [F17], citation *correctness* (the document supports the statement) is not citation *faithfulness* (the model relied on it), and a top-level link with no span anchoring makes faithfulness uncheckable — high link validity creates a false sense of trust. Per [F18], provenance reachable only by a click-out goes unverified across all citation designs. The cost is `verification` and `source recovery`: to confirm the claim the user must leave the surface and re-locate the span themselves.

**Calibration / faithfulness check performed (this is the part the Perplexity run could not do).** I fetched the cited Wikipedia article and compared. The instant answer reads: "Retrieval-augmented generation is a technique that enables large language models to retrieve and incorporate new information from external data sources." The Wikipedia lead reads: "Retrieval-augmented generation (RAG) is a technique that enables large language models (LLMs) to retrieve and incorporate new information from external data sources." **In this instance the citation is both correct and faithful** — the answer is a near-verbatim lift of the cited lead sentence. That is an honest *positive* result (recorded as PO-01); I am **not** manufacturing a faithfulness failure where the check passed. The finding is the *structural* gap that survives even when this instance passes: the surface gives the user no span anchor to *run that check themselves*, and offers no way to know whether the next instant answer is as faithful as this one.

Evidence:
Observed (2026-06-13). Instant-answer text and single top-level Wikipedia citation from `https://html.duckduckgo.com/html/?q=what+is+retrieval+augmented+generation`; cited lead sentence from `https://en.wikipedia.org/wiki/Retrieval-augmented_generation`. Faithfulness check: near-verbatim match — correct and faithful for this instance. No AI label or confidence cue present on the instant answer.

Fix:
Anchor the citation to the supporting span (deep-link or inline-quote the lead sentence) so faithfulness is checkable in-place [F17], and surface the source provenance inline-glanceable rather than as a single top-level link [F18]. The faithfulness being good *here* is not a substitute for letting the user verify it themselves on the next query.

---

## Finding AT-05 — Google AI Overviews: core feature has no opt-out; only an experimental-features Labs toggle exists

Severity: High
Section: User control
Surface: Google AI Overviews help page — opt-out / control documentation
Load displaced to: configuration, feature loss
Evidence state: Inferred
at_trust_pattern: forced_trust
hax_phase: over_time
Secondary section: configuration_cost

Issue:
Google's own help page states, verbatim, that AI Overviews are a "core Google Search feature, like knowledge panels" and that "Features cannot be turned off." The only documented opt-out — toggling "AI in Search" in Google Labs — applies, per the same page, only to *experimental* AI features, not to the core AI Overviews, and requires a signed-in account on desktop with Incognito off. So a user who wants ordinary search results without an AI-synthesized answer over them has **no opt-out from the core feature**: they can disable experimental extras but not the AI Overview itself.

Why it matters:
Per [F26] (GDPR Art. 22 floor and the S5 doctrine), for a consequential AI-mediated surface there should be a discoverable opt-out, not none. "Features cannot be turned off" is the absent-opt-out failure mode in its starkest form — the user cannot govern whether AI mediates their results. The cost is `feature loss` (plain unmediated search is removed as an option) and `configuration` (the only available lever governs a different, narrower thing). Under the AI Trust Surface Law, a user who cannot opt out of AI mediation is forced to accept it.

Evidence:
Inferred from first-party vendor documentation (2026-06-13), not exercised live. Verbatim from `https://support.google.com/websearch/answer/14901683`: "AI Overviews are a core Google Search feature, like knowledge panels"; "Features cannot be turned off"; the Labs opt-out toggles "AI in Search" but "applies only to experimental features, not the core AI Overviews." Marked Inferred because the documented behavior was read, not the live opt-out flow exercised; the doc is first-party, which is the strongest non-runtime evidence available for a control's existence/scope.

Fix:
Provide a discoverable opt-out from AI Overviews that returns the user to unmediated results, reachable in-flow (not buried in a separate Labs surface that governs only experimental features) [F26]. If a legal/product position is that the feature is core, the minimum is a per-query "show results without AI Overview" control surfaced at the result.

---

## Finding AT-06 — Recommender feeds adapt but describe feedback effects only vaguely; no previewable effect

Severity: Medium
Section: Adaptation transparency
Surface: TikTok / YouTube / Netflix recommendation help pages
Load displaced to: memory, trust
Evidence state: Inferred
at_trust_pattern: placebo_control
hax_phase: over_time
Secondary section: user_control

Issue:
All three recommenders **disclose the fact of adaptation** (a genuine positive — TikTok: the For You feed "ranks them based on the system's prediction of how likely you'll be interested"; Netflix: "our systems have ranked titles… to present the best possible ordering"; YouTube: "data from your Google Account activity… influence your recommendations"). But when it comes to the *effect of user feedback*, all three describe it only vaguely. TikTok: liking "helps TikTok suggest similar content" and "we'll show you less content like that." YouTube: feedback "helps us improve your YouTube experience in the future." Netflix: signals "improve the accuracy of their prediction." **None describes an immediate, visible, or previewable effect** of a single feedback action on future output.

Why it matters:
Per [F22], a control is adequate only if the user can preview or see the effect of their feedback; feedback whose downstream effect is neither immediate nor highlighted scores Medium even if the control technically exists, because the user cannot form intent. Per [F23], the deeper risk is the placebo: because feedback that *feels* effective raises satisfaction whether or not it does anything, "helps improve" language cannot be taken as evidence the control works. The cost is `memory` (the user must track what they've fed the algorithm with no confirmation it landed) and `trust` (they must believe the effect on faith).

Evidence:
Inferred from first-party docs (2026-06-13). Verbatim feedback-effect language quoted above from `support.tiktok.com/en/using-tiktok/exploring-videos/how-tiktok-recommends-content`, `support.google.com/youtube/answer/6342839`, and `help.netflix.com/en/node/100639`. Marked Inferred: the docs describe the feedback mechanism but the live previewable-effect behavior (the [F22]/[F23] behavioral test) was not exercised. The *disclosure of adaptation* is Observed in the doc text and recorded as a positive (PO-02), so S4 does not fire the silent-adaptation High [F20] — these surfaces are not silent.

Fix:
When a user gives feedback (like / not-interested / thumbs), preview or highlight the effect on future recommendations immediately [F22] — show what changes — rather than relying on "helps improve" language a user cannot verify [F23].

---

## Finding AT-07 — Recommender controls are all-or-nothing, and the full opt-out is geo-gated

Severity: High
Section: User control
Surface: TikTok / YouTube / Netflix recommendation controls
Load displaced to: configuration, feature loss
Evidence state: Inferred
at_trust_pattern: placebo_control
hax_phase: over_time

Issue:
Across the triad the personalization controls are coarse and, in one case, geographically restricted. TikTok documents a full personalization off-switch but states it shows non-personalized content only when enabled and — verbatim scope — it is "Limited to EU and Kazakhstan." Outside those regions there is no full opt-out, and the page describes no granular per-signal control (e.g., allow watch-time but block location). YouTube offers history pausing and per-item "Not interested" / "Don't recommend channel," but, per its own page, disabling history does not disable Google-Account-activity-based recommendations — so there is **no complete algorithmic opt-out**. Netflix documents **no opt-out mechanism at all** for personalized recommendations — only indirect levers (ratings, profiles).

Why it matters:
Per [F26], for consequential automated decisioning a discoverable opt-out should exist and not be regionally gated for everyone else; a geo-gated full opt-out means most users have none. Per [F24], system-driven adaptation with no user-authored (adaptable) alternative is slower and disliked; per the S5 granularity rule, all-or-nothing control (the user can switch the AI fully on/off but not tune *what* it does) is the weaker pattern. The cost is `configuration` and `feature loss`: a user who wants unpersonalized recommendations cannot get them (Netflix), or can only get them inside two jurisdictions (TikTok), or cannot fully get them at all (YouTube's Account-activity floor).

Evidence:
Inferred from first-party docs (2026-06-13). TikTok full opt-out "Limited to EU and Kazakhstan" and no granular per-signal toggle (`support.tiktok.com/.../how-tiktok-recommends-content`); YouTube "disabling history doesn't disable Google Activity-based recommendations," no complete opt-out (`support.google.com/youtube/answer/6342839`); Netflix "does not describe any opt-out mechanism for personalized recommendations" (`help.netflix.com/en/node/100639`). Marked Inferred: documented scope of the controls, not the behavioral placebo test [F23] run live. The Netflix no-opt-out and TikTok geo-gating are the load-bearing observations.

Fix:
Provide a discoverable, non-geo-gated opt-out from personalized recommendations [F26], and offer granular per-signal control (an adaptable alternative to fully-automatic adaptation) rather than an all-or-nothing switch [F24]. Netflix in particular should expose any opt-out at all.

---

## Finding AT-08 — No "why this" inspection on recommender surfaces; the signal driving the output is not inspectable

Severity: Medium
Section: Inspection affordances
Surface: YouTube / Netflix recommendation surfaces (per help docs)
Load displaced to: trust, verification
Evidence state: Inferred
at_trust_pattern: forced_trust
hax_phase: over_time
Secondary section: user_control

Issue:
Per their own help pages, neither YouTube nor Netflix documents a "why am I seeing this" / "why this title is recommended" inspection feature. The user can act on a recommendation (or give feedback on it) but cannot inspect the signal that produced it — what in their history, profile, or account activity drove this specific item to the top.

Why it matters:
Per [F21], inspect-plus-control is the Pass pattern: control without inspection of the signal it acts on scores worse than the paired pattern, because the user can steer but not see *what they are steering*. The cost is `trust` and `verification` — the user must accept the ranking without any way to see why it was produced, and any feedback they give is aimed at a target they cannot inspect. This pairs with AT-07: an all-or-nothing control over an uninspectable signal is the weakest combination.

Evidence:
Inferred from first-party docs (2026-06-13). YouTube help "contains no 'why am I seeing this' explanation feature or inspection tool"; Netflix help "contains no mechanism for users to inspect why specific titles appear or are ranked." Sources: `support.google.com/youtube/answer/6342839`, `help.netflix.com/en/node/100639`. Marked Inferred (documented absence, not a live attempt to locate an undocumented inspection control).

Fix:
Pair the recommendation control with inspection of the signal it acts on — a per-item "why this was recommended" that names the driving signals [F21] — so the user can see and steer, not just steer.

---

## Finding AT-09 — Provenance and AI answers are click-gated; no inline glanceable grounding

Severity: Medium
Section: Configuration cost
Surface: Google AI Overviews (sources behind a click) + Bing/DuckDuckGo (source verification via click-out)
Load displaced to: navigation, time, verification
Evidence state: Inferred
at_trust_pattern: invalid_provenance
hax_phase: when_wrong

Issue:
On Google AI Overviews, sources appear behind a click — the page describes "an AI-generated snapshot with key information and **links** to dig deeper" and instructs the user to "click the links to supporting information from the web." On Bing and DuckDuckGo, the synthesized/instant content carries no inline span-anchored citation, so confirming any claim means a click-out to the source page and a manual passage-hunt. In every case, the cheapest path to grounding requires leaving the answer surface.

Why it matters:
Per [F18], provenance gated behind a click is effectively invisible — across all citation designs users overwhelmingly will not click through to verify, even when given the means. Per [F5], an inspection affordance counts only if it makes verification *cheaper* than blind acceptance; a click-out plus passage-hunt makes non-verification the rational choice. The cost is `navigation`, `time`, and `verification`. This is the recursive trap S6 names: the control for trusting the AI is itself costly enough to reach that, at the moment of decision, the user rationally skips it.

Evidence:
Inferred from first-party docs and fetched markup (2026-06-13). Google: "click the links to supporting information from the web" (`support.google.com/websearch/answer/14901683`). Bing/DuckDuckGo: no inline span-anchored citation in the fetched answer markup, so verification requires a click-out (`bing.com/search`, `html.duckduckgo.com/html`). Marked Inferred for the cost dimension (the step-count was reasoned from the documented/observed structure, not timed live).

Fix:
Surface inline, glanceable grounding — the supporting evidence visible without navigation — rather than a click-to-verify link the literature shows goes unused [F18], so that verification is cheaper than blind acceptance [F5].

---

## Auditor notes — calibration, reclassification, and parked revision candidates

**This run supersedes `pt0-perplexity`.** That doc-fallback produced zero Observed findings and a Section 7 process Fail because the live answer surface was 403-walled and no failure case could be exercised. This run's central improvement is that Bing's SSR markup puts the trust label — and the absence of any confidence cue beside it — directly in the fetched bytes, and the `how does mRNA vaccine work` misfire gives a **real, reproducible observable failure case**. Section 7 is unblocked.

**The discipline rule was applied per-finding.** Each finding started at the most conservative state and was re-checked after the first pass:

- **AT-01** started as Inferred (is the label maybe tied to answer quality?). Re-check across four queries (clean / ambiguous / false-premise / misfire) showed the label is byte-identical and answer-quality-invariant — promoted to **Observed**. It fires [F1] (absence of a per-decision confidence signal), **not** [F2]/[F3], because there is *no* confidence display to be miscalibrated or placebic; the failure is absence, which caps at High. Held High, not Critical: the AI action is non-destructive/reversible, so the S3 Critical precondition (high-stakes AND irreversible) does not open.
- **AT-03 (Anthropic Citations)** is the explicit calibration case. The candidate-shaped temptation was a Critical "hallucination-free overclaim." Held to **High** and re-scoped honestly: Anthropic's *first-party* copy is qualified ("minimize"), so the S0 first-party-overclaim Critical path does **not** open; the unqualified "10% → 0%" claim is a *platformed customer* testimonial, and no irreversible action is driven here. High under [F15] is the calibrated call, not Critical.
- **AT-04 (DDG faithfulness)** is the discipline rule's mirror image — the temptation to *manufacture a failure*. I ran the actual faithfulness check (fetched the cited Wikipedia lead and compared) and it **passed** — the instant answer is a near-verbatim, faithful lift. I recorded that as a positive (PO-01) and did **not** invent a faithfulness failure. The finding that survives is the *structural* one: no span anchor for the user to run the check themselves, held at **Medium** [F17/F18].
- **AT-06 vs S4 silent-adaptation [F20].** All three recommenders *disclose* the fact of adaptation (Observed in doc text → PO-02), so the silent-adaptation **High [F20] was NOT fired** — firing it would contradict the evidence. AT-06 fires the weaker, accurate [F22]/[F23] feedback-effect finding at Medium instead.
- **Recommender findings held at Inferred, not Observed.** The docs describe the controls and feedback mechanisms, but the behavioral placebo test [F23] and previewable-effect test [F22] were not run live. Promotion to Observed/High-with-behavioral-proof requires a live session toggling a control and watching output change. AT-07's load-bearing observations (Netflix no-opt-out, TikTok geo-gating) are documented *scope*, which the first-party doc states plainly — High is justified on the documented absence/restriction even without the live toggle.

**Section 7 status: PASS (process).** A sub-optimal/wrong AI-adjacent output was exercised (the Bing mRNA-vaccine misfire and the false-premise query), and the page-level AI affordance was tested *on* that failure — it persisted unchanged with no confidence cue. The DDG citation was validated for existence AND faithfulness against its source (not merely observed as present). This is the gate the Perplexity run failed.

**S0 Critical precondition: evaluated, does NOT trigger.** No surface in this run pairs a claimed/implied verifiable basis that is not inspectable/faithful with a high-stakes *irreversible* action. The Anthropic overclaim (AT-03) is a platformed customer claim on a non-destructive surface → High. No Critical is fired anywhere; the section-Fail threshold is reached only via accumulated Highs (see scorecard).

**Parked revision candidates (PT0 leaves the rubric UNCHANGED — these are logged for a future version cut, not applied):**

1. **An "answer-quality-invariant provenance label" sub-pattern in S0/S3.** A provenance label that renders identically whether the AI output is correct or a hard misfire (Bing's footer) is a distinct, common shape: it is *not* an absent label (S0 has provenance) and *not* a miscalibrated confidence display (there is no number), but a *decoupled* label that asserts AI authorship without coupling to instance quality. Currently it is scored via the S3 [F1] absence-of-signal rule; a named sub-pattern would sharpen it.
2. **A "platformed third-party overclaim" note in S0.** The Anthropic case (first-party copy qualified, customer testimonial absolute) is a recurring marketing shape the current S0 overclaim language (which centers the surface's *own* claim) does not explicitly name. A one-line note that a platformed customer claim inherits first-party credibility would close the gap.
3. **A "geo-gated opt-out" refinement under S5 [F26].** [F26] currently scores buried/absent opt-outs; the TikTok "EU and Kazakhstan only" case is a third shape — *present but regionally restricted*, which functionally equals absent for most users. Worth an explicit clause.
4. **Evidence-strength ladder for first-party vendor docs vs SSR markup vs live runtime.** This run mixes Observed (SSR bytes) and Inferred (first-party docs). A short note distinguishing "first-party doc states the control's scope" (strong Inferred) from "vendor marketing implies it" (weak Inferred) would help future Path-2 runs calibrate consistently.

None of the above changed any finding's severity in this run; they are candidates only.
