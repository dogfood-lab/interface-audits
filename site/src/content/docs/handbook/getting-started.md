---
title: Getting Started
description: Clone, install verify tooling, invoke your first audit.
sidebar:
  order: 1
---

This guide takes you from cloning the repo to invoking your first audit — about 15 minutes if you have Node 20+ and a Claude account.

## Requirements

- **Node.js ≥ 20** for the local verify tooling (schema validation, link check, shipcheck audit).
- **Git** to clone the repo.
- **[Claude](https://claude.ai)** (or a compatible AI runner) with browser-navigation MCP tools to actually invoke an audit. The audits themselves are markdown rubrics — they don't execute natively.

## Clone and install

```bash
git clone https://github.com/dogfood-lab/interface-audits.git
cd interface-audits
npm install
```

`npm install` brings in three dev dependencies (`ajv`, `ajv-formats`, `glob`) used by the verify scripts. No production deps — the audits themselves are plain markdown.

## Run the verify tooling

```bash
npm run verify
```

This runs three checks in sequence:

1. **`verify:schemas`** — every `*-scorecard.json` under `audits/*/evidence/<run-id>/` validates against `shared/schemas/scorecard.base.schema.json`, and every finding inside validates against `shared/schemas/finding.base.schema.json`.
2. **`verify:links`** — every relative markdown link in every `*.md` file resolves to an existing file. Skips external links, anchors, and links inside fenced or inline code blocks.
3. **`shipcheck audit`** — hard gates A–D of [the ship gate](https://github.com/dogfood-lab/interface-audits/blob/main/SHIP_GATE.md) must pass before any release is cut.

On a clean repo, all three exit 0.

## Invoke your first audit

The first audit is **Cognitive Load**. Tell Claude:

> Run cognitive-load audit on `<target-url-or-surface>`

Pick a target — a docs site, a dashboard, an internal tool. Claude will:

1. Walk the 8 sections of the rubric ([`audits/cognitive-load/RUBRIC.md`](https://github.com/dogfood-lab/interface-audits/blob/main/audits/cognitive-load/RUBRIC.md)).
2. Probe each section against your target's live state (via browser-navigation MCP tools).
3. Produce three outputs under `audits/cognitive-load/evidence/<run-id>/`:
   - `cognitive-load-findings.md` — the full finding report
   - `cognitive-load-scorecard.json` — per-section pass/warn/fail + summary
   - `remediation-priority-list.md` — findings ordered by severity × leverage

See [Usage](../usage/) for what to do with those outputs.

## Read past evidence

The repo ships with four completed audit runs you can browse:

- **`evidence/pt0/`** — Pressure Test 0 on claude.ai (produced the v0.1 rubric patches)
- **`evidence/pt1-github-narrow/`** — Pressure Test 1 on GitHub's responsive layout (produced the v0.2 Section 5 taxonomy)
- **`evidence/pt2-outlook-doc-fallback/`** — Pressure Test 2 on Outlook's Simplified Ribbon, run as documentation-fallback. First draft overclaimed Removed findings; honest reclassification moved them to Hidden. The calibration record is in the auditor notes.
- **`evidence/dogfood-1-research-os-handbook/`** — Dogfood Run 1 on the research-os handbook. Healthy result: 8 findings + 4 positive observations, no rubric churn.

Each run is three files. Start with `*-findings.md`.

## What's next

- **[Usage](../usage/)** — invoking audits in detail, reading scorecards, interpreting remediation lists
- **[Reference](../reference/)** — the rubric format, finding format, full load-displaced-to enum
- **[Architecture](../architecture/)** — how audits are structured, the lifecycle, the four-thing rule
