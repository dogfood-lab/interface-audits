---
title: Reference
description: Rubric format, finding format, severity model, evidence states, load-displaced-to enum.
sidebar:
  order: 3
---

This is the contract reference. For doctrine and rationale, see [Architecture](../architecture/).

## Rubric structure

Every audit's `RUBRIC.md` follows this shape:

```
# <Audit name>

> The audit's law (one sentence)
> A framing line for the auditor

## Purpose
## How to use this audit

## Section 0 — <name>
**Purpose.**
**Failure modes.**
**Audit questions.**
**Standards / research anchors.**
**Severity classification for this section** (optional, audit-specific)
**Automation.** (Yes / Partial / No)

## Section 1 — <name>
...
## Section 7 — Evidence (always last; the process gate)

## Finding format
## Severity definitions
## Load-displaced-to enum
## Automatable vs judgment cut
## Running this as a skill (pointer to skill/SKILL.md)
## References
```

Sections are ordered from "what the team most directly controls" to "what is most architectural / process."

## Finding format

Every finding produced by any audit follows the same contract:

```
## Finding <PREFIX>-NN — <short title>

Severity: Critical | High | Medium | Low
Section: <section name>
Surface: <where in the product>
Load displaced to: <one or more enum values>
Evidence state: Observed | Inferred | Open question
Section 5 taxonomy: compressed | delayed | hidden | removed   (Section 5 only)

Issue:
<one paragraph>

Why it matters:
<one paragraph naming the cognitive cost>

Evidence:
<state, surface, dataset, screenshot ref — required>

Fix:
<one paragraph; preserves power, control, source access, discoverability>
```

The `<PREFIX>` is the audit's `audit_prefix` declared in its README header. Cognitive Load uses `CL`. Findings without an Evidence line are downgraded to Open questions.

## Severity model

| Severity | Base meaning |
|---|---|
| **Critical** | Users in low-bandwidth states cannot complete core tasks. Or: AI compression with no source recovery path **when source was promised, claimed, fetched, or replaced**. |
| **High** | Significant load displacement in common workflows. Configuration cost prevents reaching adaptation controls. Provenance ambiguity in confident model output. |
| **Medium** | Measurable defaults miss WCAG 2.2 thresholds. Hidden load in non-core surfaces. |
| **Low** | Polish-level. Wording, edge-case states, secondary surfaces. |

**Section-Fail threshold: one Critical or three Highs in any one section.** Any section Fail produces an overall Fail.

Audits may add severity preconditions for specific sections (the Cognitive Load audit's Section 4 has one). Preconditions live in the audit's RUBRIC.md, not in the shared model.

## Evidence states

| State | Meaning | When to use |
|---|---|---|
| **Observed** | Seen directly in live session, with screenshot, click path, or direct interaction | Default for Path 1 (live navigation) findings |
| **Inferred** | Strongly implied by observed behavior or by documented design (DOM/CSS classes, framework patterns, vendor documentation) but not directly proven | Use sparingly; inference chain must be explicit in Evidence line |
| **Open question** | Plausible issue, but evidence is insufficient | Any finding that doesn't meet Observed or Inferred. Resolution path must be documented. |

The Inferred fallback is the brake against manufacturing findings. See [Architecture / The discipline rule](../architecture/#the-discipline-rule).

## Load-displaced-to enum

The `Load displaced to:` field uses **one or more** of these values (no "Other"):

| Value | Means |
|---|---|
| `search` | user must run a query instead of recognizing |
| `memory` | user must remember a label, location, or icon meaning |
| `trust` | user must accept output without ability to verify |
| `verification` | user must leave the surface to confirm a claim |
| `navigation` | user must traverse multiple pages or surfaces |
| `configuration` | user must change settings to use the surface |
| `source recovery` | original source is hidden or stripped from output |
| `visual decoding` | typography, density, or contrast force decoding effort |
| `time` | task that should be near-instant takes measurable seconds |
| `recovery / undo` | user must reconstruct work after a destructive or lossy action |
| `feature loss` | capability is removed rather than compressed |

This is the audit's heart. Findings with vague displacement targets are weaker findings.

## Cognitive Load — Section 5 sub-taxonomy

Section 5 (Power Preservation) findings additionally classify against four sub-states:

| Category | Meaning | Default severity |
|---|---|---|
| **Compressed** | Same capability, lower visual load (smaller icons, condensed labels) | Pass / Low |
| **Delayed** | Same capability, more steps or scrolling to reach | Medium |
| **Hidden** | Same capability, discoverability drops (moves into overflow menu) | High |
| **Removed** | Capability unavailable in simplified mode — feature gap, not compression | Critical / High |

Auditors may override defaults with justification. Required for every Section 5 finding; omitted (`n/a`) for findings in other sections.

## Scorecard structure

The scorecard JSON conforms to `shared/schemas/scorecard.base.schema.json`. Key fields:

```json
{
  "audit_id": "<prefix>-YYYYMMDD-<run-id>",
  "rubric_version": "v0.2 (frozen 2026-05-12)",
  "target": { "type": "url|screenshot|...", "value": "..." },
  "context": { "user_type": "...", "dense_state": "...", "...": "..." },
  "sections": {
    "text_load": { "status": "pass|warn|fail", "finding_ids": [], "notes": "..." }
  },
  "summary": {
    "overall_status": "audited_clean|warn|fail",
    "critical_count": 0,
    "high_count": 0,
    "hard_failure_patterns_validated": { "...": true }
  },
  "findings": [],
  "open_questions": [],
  "positive_observations": []
}
```

CI validates every scorecard on every push. Malformed scorecards block the build.

## Audit prefixes in this repo

| Audit | Finding prefix | Scorecard ID prefix |
|---|---|---|
| cognitive-load | `CL` | `cla` |

New audits should declare both in their README's `audit_prefix:` header.
