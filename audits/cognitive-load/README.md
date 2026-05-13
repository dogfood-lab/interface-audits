state: Frozen v0.2 + Dogfooded once
audit_prefix: CL
catches: load displacement (memory, search, trust, verification, navigation, configuration, source recovery, visual decoding, time, recovery/undo, feature loss)

# Cognitive Load Audit

## What burden this catches

This audit catches interfaces that pass standard accessibility scanners but still displace work onto the user — interfaces that hide power behind overflow menus, AI summaries that force trust without source access, low-load modes that require the bandwidth the user doesn't have, configuration controls that themselves require configuration.

Generic accessibility audits answer "is this readable?" This audit answers "is this *governable* under cognitive constraint?"

The audit's law:

> A product may reduce visible complexity only when it preserves user control, source access, task progress, and feature discoverability. Any simplification that forces the user to search, trust, remember, verify under strain, or lose access to necessary functions is not load reduction. It is **load displacement**.

## State

**Frozen v0.2 + Dogfooded once.** Three pressure tests + one dogfood run completed. Rubric is stable; a v0.3 candidate (the Removed sub-distinction) is parked pending live-observed evidence.

See [`CHANGELOG.md`](CHANGELOG.md) for full version history and pending changes.

## Files

| Path | What |
|---|---|
| [`RUBRIC.md`](RUBRIC.md) | Canonical audit doctrine — 8 sections, Cognitive Load Law, severity preconditions, Section 5 taxonomy |
| [`skill/SKILL.md`](skill/SKILL.md) | Executable skill that runs the audit |
| [`schemas/finding.extensions.json`](schemas/finding.extensions.json) | Cognitive-load-specific extension to the base finding schema |
| [`CHANGELOG.md`](CHANGELOG.md) | Version history and parked patches |
| [`evidence/`](evidence/) | Pressure tests and dogfood runs |

## Evidence

| Run | Type | Target | Outcome |
|---|---|---|---|
| [`pt0/`](evidence/pt0/) | Pressure test | claude.ai live | 8 findings; produced v0.1 patches (Section 4 precondition + load enum) |
| [`pt1-github-narrow/`](evidence/pt1-github-narrow/) | Pressure test | github.com/.../research-os | 6 findings; produced v0.2 patches (Section 5 taxonomy + responsive caveat) |
| [`pt2-outlook-doc-fallback/`](evidence/pt2-outlook-doc-fallback/) | Doc-fallback PT | Outlook Simplified Ribbon | 6 findings; no rubric change. Calibration record about audit honesty (first draft overclaimed Removed; reclassified to Hidden on honest read). |
| [`dogfood-1-research-os-handbook/`](evidence/dogfood-1-research-os-handbook/) | Dogfood | research-os handbook | 8 findings + 4 positive observations; healthy result; no rubric change. |

## Hard-failure patterns this audit detects

1. **UI looks simple but makes the user hunt** (Section 2 Hidden Load)
2. **AI output reduces reading but increases trust burden** (Section 4 AI Compression Risk)
3. **Low-load mode is unreachable from a constrained state** (Section 3 State Shift + Section 6 Configuration Cost)
4. **Simple mode removes power instead of compressing it** (Section 5 Power Preservation)

Each pattern has been pressure-tested at least once. See [`evidence/`](evidence/) for which run exercised which pattern.

## How to invoke

If running through Claude Code or the skill harness:

> Run cognitive-load audit on `<target>`

See [`skill/SKILL.md`](skill/SKILL.md) for the full trigger list, inputs, outputs, and procedure.
