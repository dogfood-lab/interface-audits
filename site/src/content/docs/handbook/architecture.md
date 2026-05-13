---
title: Architecture
description: The four-thing rule, lifecycle state machine, shared norms, schema extension model.
sidebar:
  order: 4
---

This page covers how audits are structured, how they advance through their lifecycle, and how the monorepo holds multiple audits without collapsing them into one mega-rubric.

## The four-thing rule

Each audit ships four things:

1. **Rubric** — `audits/<name>/RUBRIC.md`. Markdown. Sections, audit questions, severity rules, the audit's law. Canonical.
2. **Skill** — `audits/<name>/skill/SKILL.md`. Markdown with YAML frontmatter. Invocation contract, inputs, outputs, procedure. The runner walks the rubric.
3. **Schema** — `audits/<name>/schemas/finding.extensions.json`. JSON Schema. Audit-specific extension fields on top of the base finding contract. Audits add fields; they do not redefine or remove base fields.
4. **Evidence** — `audits/<name>/evidence/<run-id>/`. At least one completed pressure test or dogfood run, in three files: findings, scorecard, remediation list.

**No evidence, no official audit.** A Draft audit may sit in the repo but it's not listed in the top-level README's audit table until it has at least one evidence run.

## Lifecycle state machine

| State | Meaning | Required to enter |
|---|---|---|
| **Draft** | Rubric exists; not yet pressure-tested against a real target | `RUBRIC.md` authored |
| **Pressure-tested** | At least one pressure test completed; findings produced; rubric may have been revised | One PT in `evidence/<pt-id>/` |
| **Frozen** | Rubric version cut; future revisions only via new calibrating evidence | A PT where the rubric did NOT change; version frozen in `CHANGELOG.md` |
| **Dogfooded** | Audit applied to at least one surface the maintainer owns, without rubric churn | One dogfood run |
| **Revised** | A PT or dogfood produced calibration evidence; rubric advanced to next version | New CHANGELOG entry citing the evidence |

States combine: an audit can be "Frozen v0.2 + Dogfooded once."

State is declared in each audit's `README.md` as a header line:

```
state: Frozen v0.2 + Dogfooded once
audit_prefix: CL
catches: load displacement (memory, search, trust, ...)
```

Mechanically inspectable via `grep "^state: " audits/*/README.md`.

## Pressure tests vs dogfood runs

A **pressure test (PT)** answers: does the rubric survive contact with a real target, and does it produce honest findings without inventing drama? Pressure tests can revise the rubric.

A **dogfood run** answers: does the audit produce actionable findings on a surface the maintainer owns, without requiring rubric churn? Dogfood runs should NOT change the rubric. If one does, it's a signal to elevate it to a pressure test and run a real PT.

Both produce the same three output files. They differ in intent and in what they're allowed to change.

## The discipline rule

A pressure test designed to find a specific failure shape (e.g. "find a Removed-power case") is at structural risk of over-fitting. The discipline:

1. Start each finding with the most conservative evidence state (Inferred or Open question).
2. Re-check findings against the rubric's actual criteria after the run completes.
3. If a finding gets downgraded on second pass, **that's the audit working** — record the reclassification in the auditor notes.

Findings that survive second-pass reclassification are the real output. The reclassification trail itself is calibration evidence.

This rule was earned by PT2 (Outlook). The first draft overclaimed two findings as "Removed power"; honest reclassification moved both to "Hidden" because alternate access paths existed. The reclassified file is preserved at `evidence/pt2-outlook-doc-fallback/` as a record.

## Shared norms

Cross-audit norms live in `shared/`. Each file is normative — audits may extend, not override.

| File | What |
|---|---|
| `shared/audit-lifecycle.md` | The five-state machine and transitions |
| `shared/evidence-states.md` | Observed / Inferred / Open question |
| `shared/severity-model.md` | Critical / High / Medium / Low + section-Fail threshold |
| `shared/finding-format.md` | The finding contract + load-displaced-to enum |
| `shared/pressure-test-protocol.md` | PT vs dogfood, setup, procedure, exit criteria, discipline rule |
| `shared/schemas/finding.base.schema.json` | JSON Schema for findings |
| `shared/schemas/scorecard.base.schema.json` | JSON Schema for scorecards |

Audit-specific severity preconditions live in the audit's `RUBRIC.md`, not in `shared/`.

## Schema extension model

Audits add fields via `audits/<name>/schemas/finding.extensions.json`. The cognitive-load audit's extension:

```json
{
  "properties": {
    "section_5_taxonomy": {
      "type": "string",
      "enum": ["compressed", "delayed", "hidden", "removed", "n/a"]
    }
  }
}
```

Extensions add fields. They cannot redefine `severity`, `section`, `load_displaced_to`, or any other base field. The base schema sets `additionalProperties: true` so extensions don't break validation.

A new audit that needs a custom field declares it in `schemas/finding.extensions.json`. CI validates findings against both base + extensions.

## Why "interface audits" instead of one mega-audit

Each audit catches a different shape of failure with a different evidence model:

- Cognitive Load — load displacement under bandwidth constraint
- Low-Vision (future) — visual access under real density, not just contrast
- Screen Reader Task (future) — semantic continuity and task completion, not just ARIA validity
- Color Dependence (future) — meaning conveyed only by color
- Motor Access (future) — interaction cost and error recovery
- Motion Sensitivity (future) — animation, parallax, vestibular triggers
- AI Trust Surface (future) — source traceability and uncertainty display

Folding them all into one rubric would collapse distinctions that matter. Each audit answers "what burden does this catch that generic scanners miss?" with a specific answer. They share the severity model, finding format, lifecycle, and schema base — but each owns its own sections.

Audits are added one at a time, with evidence, when a real target justifies the work. Not by speculation.
