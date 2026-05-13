---
title: Welcome
description: Proof-backed audits for human-facing product surfaces.
sidebar:
  order: 0
---

`interface-audits` is a library of audit rubrics and the executable skills that run them. Each audit catches a specific class of user-facing failure that **generic accessibility scanners miss**. Scanners catch WCAG violations; these audits catch interfaces that **pass scanners but still make users hunt**.

## The law

> A product may reduce visible complexity only when it preserves user control, source access, task progress, and feature discoverability. Any simplification that forces the user to search, trust, remember, verify under strain, or lose access to necessary functions is not load reduction. It is **load displacement**.

This is the Cognitive Load Law, the first audit's foundational doctrine. Every audit in this library names where the load went — using a fixed enum (search, memory, trust, verification, navigation, configuration, source recovery, visual decoding, time, recovery/undo, feature loss) — so findings stay comparable across runs.

## The four-thing rule

Each audit must ship four things before it counts:

1. **Rubric** — doctrine and sections (markdown)
2. **Skill** — invocation contract and procedure (markdown with YAML frontmatter)
3. **Schema** — JSON Schema for findings and scorecards
4. **Evidence** — at least one completed pressure test or dogfood run

**No evidence, no official audit.** See [Architecture](../architecture/) for the lifecycle that enforces this.

## Current audits

| Audit | State | Catches |
|---|---|---|
| Cognitive Load | Frozen v0.2 + Dogfooded once | Load displacement, hidden complexity, AI trust burden, state-shift failure |

Future audits in this family may include Low-Vision, Screen Reader Task, Color Dependence, Motor Access, Motion Sensitivity, and AI Trust Surface. Audits are added one at a time, with evidence, when a real target justifies the work.

## Where to go from here

- **[Getting started](../getting-started/)** — clone the repo, run the verify tooling, invoke your first audit
- **[Usage](../usage/)** — invoking audits, reading evidence, interpreting scorecards
- **[Reference](../reference/)** — rubric format, finding format, schema details, load-displaced-to enum
- **[Architecture](../architecture/)** — the four-thing rule, lifecycle state machine, shared norms, schema extension model
- **[Security](../security/)** — threat surface during audit runs, evidence privacy, vulnerability reporting

## Not a generic accessibility scanner

These audits are not a replacement for [axe](https://www.deque.com/axe/), [Lighthouse](https://developer.chrome.com/docs/lighthouse), or [Pa11y](https://pa11y.org/). Those tools catch WCAG violations. This library catches what they miss — interfaces that pass automated scans but still impose hidden burden on the user.

The two should run together. The audits in this library start where the scanners stop.
