# AI Trust Surface Audit — PT0 Remediation Priority List
## Perplexity.ai (documented-architecture / doc-fallback)

Findings ordered by **severity × leverage** — where leverage = how many trust surfaces one fix repairs and how directly it serves the AI Trust Surface Law (can the user inspect, undo, trace, calibrate). Run ID `pt0-perplexity`; full detail in [`ai-trust-surface-findings.md`](ai-trust-surface-findings.md).

> **Caveat before acting:** this is a doc-fallback run. Every item below is **Inferred from the documented response contract** or held as an **open question** — none was confirmed against a triggered wrong answer on the live surface (Section 7 is a process Fail). Resolve the **P0 evidence blocker (AT-08)** first; it converts the Inferred items to Observed and may re-rank everything below.

---

## P0 — Evidence blocker (do this first; it gates the rest)

### AT-08 — Exercise a real failure case
**Open question · Section 7 (Evidence) · process Fail**
The entire run is Inferred because no wrong/fabricated answer was triggered and no citation was checked for existence or support. **Action:** signed-in live session on a fast-moving / niche topic [F16]; for each citation confirm it resolves and supports the specific claim. This unblocks Section 7 and promotes AT-01 / AT-04 / AT-05 to Observed (or downgrades them — that is the audit working).
**Leverage: maximal** — without it, no finding is more than Inferred.

---

## P1 — Highest severity × leverage (the provenance + calibration core)

### 1. AT-04 — Render claim-aligned supporting evidence inline (High · S2)
**The single highest-leverage product fix.** On hover/expand of each citation marker, show the exact source sentence(s) that support the annotated clause, demarcated as *retrieved source text* (not model prose) [F19]. This one change:
- makes verification cheaper than blind acceptance [F5] (also fixes **AT-07**, Medium S6),
- removes the click-out the literature shows users skip [F18],
- and gives the user the material to check **AT-01**'s faithfulness in-flow.
One fix, three findings (AT-04, AT-07, and the user-facing half of AT-01).

### 2. AT-01 — Tie each citation to its specific supporting span (High · S0)
The structural sibling of AT-04: the answer pipeline must establish and expose *span-level* grounding, and where it cannot establish support for a claim, surface that the claim is un-grounded rather than attaching a document-level citation that implies it is [F14, F17]. Fixing this is what makes AT-04's inline panel honest rather than another confident restatement.

### 3. AT-05 — Add a calibrated per-decision uncertainty signal (High · S3)
Flag claims supported only by a single weak/low-authority source, or where retrieved sources disagree, distinct from well-corroborated claims [F1]. **Constraint:** the signal must be backed by measurement or hedged as heuristic — do **not** ship a bare confidence number with no calibration evidence, which is itself High [F2] and would convert an absence-finding into a manufactured-trust finding. Calibrated, content-bearing uncertainty only.

---

## P2 — Real but lower-severity / expectation-setting

### 4. AT-02 — State the expected error profile up front (Medium · S0)
Name the topics/conditions where citation error is highest [F16] at first use and near the answer; frame as "verify before relying," not marketing reassurance [F28]. Cheap, high-trust-per-word.

### 5. AT-07 — Collapse verification cost (Medium · S6)
Subsumed by AT-04's fix — listed for completeness. If AT-04 ships, this closes.

### 6. AT-03 — Show the effect of answer feedback (Medium · S1, provisional)
When a user flags an answer wrong, show a re-grounded / corrected answer or at minimum acknowledge the dispute — never accept the click silently [F11]. **Verify the control's actual behavior first (AT-11)** before building; it may already do this.

### 7. AT-06 — Discoverable personalization opt-out + previewable controls (Medium · S5, provisional)
Provide an in-product opt-out reachable from the answer surface, not only policy text [F26]; pair each personalization control with a visible preview of how toggling it changes results [F22, F23]. **Resolve AT-13 / AT-14 first** — the control surface was walled, so the existence and behavior of personalization is unconfirmed.

---

## Live-session checklist (resolves the open questions, in priority order)

| Order | OQ | What to check | Promotes / fires |
|---|---|---|---|
| 1 | AT-08 | Trigger a wrong answer; check each citation resolves + supports the claim | Unblocks S7; AT-01/AT-04 → Observed |
| 2 | AT-12 | Hover a citation: inline claim-aligned span, page-snippet, or model prose? | AT-04 |
| 3 | AT-10 | Any rendered per-answer/per-claim uncertainty language? | AT-05; possibly [F2]/[F3] |
| 4 | AT-09 | Does rendered marketing claim 'grounded / hallucination-free'? | S0 escalation [F15] if yes |
| 5 | AT-11 | Does 'this is wrong' feedback change anything visible? | AT-03 |
| 6 | AT-13 | Is answer personalized from history, and disclosed? | S4 High [F20] if silent |
| 7 | AT-14 | Opt-out discoverable + does any control change output? | AT-06; placebo test [F23] |

---

## Severity ledger

| Severity | Count | Findings |
|---|---|---|
| Critical | 0 | — (S0 Critical precondition evaluated and correctly did NOT trigger — no overclaim found, no unfaithful citation exercised) |
| High | 3 | AT-01, AT-04, AT-05 |
| Medium | 4 | AT-02, AT-03, AT-06, AT-07 |
| Low | 0 | — |
| Open questions | 7 | AT-08 … AT-14 |

**Overall: Fail** — on Section 7 process grounds (no failure case exercised), not on a finding-severity section Fail. No single section reached 1 Critical or 3 Highs. The Fail is honest about the evidence gap, not a severity verdict on the product.
