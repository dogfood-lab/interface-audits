---
title: Usage
description: Invoking audits, reading evidence, interpreting scorecards.
sidebar:
  order: 2
---

This page covers the day-to-day workflow: how to invoke an audit, how to read the outputs, and how to act on the remediation list.

## Invoking an audit

Through Claude (or a compatible runner with browser MCP tools):

> Run cognitive-load audit on `<target>`

The target can be:

- A live URL (`https://app.example.com/dashboard`)
- A screenshot (drag in)
- A specific component (paste JSX/Vue/HTML)
- A described app flow (prose)
- Your own surface notes from observation

At minimum one input is required. Multiple inputs of different types may be combined for richer coverage. **Path 1 (live navigation)** is preferred for interaction-dependent sections like State Shift and Configuration Cost; **Path 2 (screenshots only)** is acceptable but weaker. **Documentation fallback** is acceptable when access is blocked, and findings default to Inferred — see [Reference / Evidence states](../reference/#evidence-states).

## Optional context

You can pass extra context to sharpen the audit:

| Field | What it does |
|---|---|
| `user_type` | professional, casual, first-time, returning — informs which workflows to weight |
| `task` | what the user is trying to do on this surface |
| `dense_state` | description of the worst-case data state tested (full inbox, dense dashboard, etc.) |
| `low_bandwidth_state` | was the audit run while the auditor was constrained? how? |
| `ai_features_present` | list of AI-mediated features in scope |

If `dense_state` is empty, the skill warns that Section 7 (Evidence) cannot pass — every audit needs to test against a realistic dense state, not the marketing screenshot.

## Reading the findings file

Every finding has the same shape:

```
## Finding CL-NN — short title

Severity: Critical | High | Medium | Low
Section: <section_name>
Surface: <where in the product>
Load displaced to: <enum value(s)>
Evidence state: Observed | Inferred | Open question
Section 5 taxonomy: compressed | delayed | hidden | removed   (Section 5 findings only)

Issue: <what the interface does>
Why it matters: <the cognitive cost>
Evidence: <state, surface, dataset, screenshot ref>
Fix: <preserves power, control, source access, discoverability>
```

The `Load displaced to:` field is the heart of the audit. Findings with vague displacement targets are weaker findings. See [Reference](../reference/#load-displaced-to-enum) for the full enum.

## Reading the scorecard

The scorecard is JSON, conforming to `shared/schemas/scorecard.base.schema.json`. It contains:

- **`summary.overall_status`** — `audited_clean` / `warn` / `fail`
- **`summary.{critical,high,medium,low}_count`** — finding distribution
- **`sections.<name>.status`** — per-section pass / warn / fail
- **`findings[]`** — full finding objects
- **`open_questions[]`** — findings without sufficient evidence, with a resolution path
- **`positive_observations[]`** — what the target does well (don't regress these)
- **`hard_failure_patterns_validated`** — which of the four audit-spanning failure shapes the run exercised

A section fails if it has **one Critical OR three Highs**. Any section fail produces an overall fail.

## Reading the remediation list

Findings ordered by severity × leverage. P1 is "fix this first." Each entry names:

- The finding it fixes (by ID)
- The severity and Section 5 taxonomy (if applicable)
- The shape of the fix — concrete, not a research project
- Why this priority

For dogfood runs (where you own the target), the remediation list is a punch list. For pressure tests (where you don't), it's a model of what the fix would look like.

## When to re-run an audit

After substantial UI changes, after shipping a remediation, after the rubric advances to a new version. Each run goes into its own `evidence/<run-id>/` directory; **past evidence is frozen** — it documents what the rubric caught at that point in time. Don't rewrite history when the rubric advances.

## When NOT to expect findings

Healthy products run clean. Dogfood Run 1 (research-os handbook) produced 1 High + 4 Medium + 3 Low — a Warn overall, no section Fail. That's the audit working: it found real things to fix without inventing drama. If an audit produces zero findings on a real product, double-check that Section 7 (Evidence) was actually exercised against a dense state and not just the marketing screenshot.
