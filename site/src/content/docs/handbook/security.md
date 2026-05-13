---
title: Security
description: Threat surface during audit runs, evidence privacy, vulnerability reporting.
sidebar:
  order: 5
---

This page summarizes the threat surface and evidence-privacy considerations when running an audit. The full security policy is in [`SECURITY.md`](https://github.com/dogfood-lab/interface-audits/blob/main/SECURITY.md) at the repo root.

## What this repo is

`interface-audits` is a library of audit rubrics and the executable skills that run them. The repo contains:

- **Rubrics** (`audits/<name>/RUBRIC.md`) — doctrine, sections, severity rules. Plain markdown.
- **Skills** (`audits/<name>/skill/SKILL.md`) — invocation contracts and procedures. Plain markdown with YAML frontmatter. Skills are interpreted by Claude (or a compatible runner), not executed natively.
- **Schemas** (`shared/schemas/`, `audits/<name>/schemas/`) — JSON Schema for findings and scorecards.
- **Evidence** (`audits/<name>/evidence/<run-id>/`) — past audit runs. Markdown reports + JSON scorecards.

The repo does not currently ship runtime code. Future iterations may ship npm packages or MCP servers; this policy will be updated when they do.

## Threat surface during an audit run

When a skill is invoked, the runner (Claude with appropriate MCP tools) performs the following operations against the user-supplied target:

- **Network egress** — only to the target URL the user specified. Skills do not call out to any other service.
- **DOM and screenshot capture** — the skill may read the page DOM, take screenshots, and inspect responsive CSS classes for evidence. Captured screenshots may include any content visible on the user's authenticated session at the target URL, including names, message bodies, account state, etc.
- **Local file writes** — the skill writes evidence files into `audits/<name>/evidence/<run-id>/` under the repo's working tree. It does not write anywhere else.
- **No outbound transmission of evidence** — evidence files remain on the user's local disk unless the user commits and pushes them.

The user is responsible for choosing whether the target surface and any captured content is appropriate for a public repository **before committing**. The scorecard schema has a `private_content_captured: false` field for asserting that no sensitive content was captured.

## No secrets in source

This repo does not contain or read at runtime any API keys, tokens, or credentials. Skills do not authenticate to target services on the user's behalf; they assume the user is already signed in at the target if required.

## No telemetry

Skills do not emit telemetry. No usage data, no metrics, no analytics — not by default, not at all. Audit runs are local artifacts.

## Constrained file operations

Skill file writes are scoped to `audits/<name>/evidence/<run-id>/`. A skill that attempts to write outside this path (other than the rubric's own files during a documented rubric revision) is violating the contract documented in the audit's `SKILL.md` and should be filed as a bug.

## Structured outputs only

Skill outputs are structured — findings, scorecards, remediation lists. The runner does not surface raw stack traces in those artifacts. If a skill run errors, the error is recorded as an Open question in the scorecard with a description of the gap, not a raw stack.

## Vulnerability reporting

Email: **64996768+mcp-tool-shop@users.noreply.github.com**

Include:

- Description of the vulnerability
- Steps to reproduce
- Version affected (rubric version, skill version, schema version)
- Potential impact

### Response timeline

| Action | Target |
|---|---|
| Acknowledge report | 48 hours |
| Assess severity | 7 days |
| Release fix | 30 days |

Security issues should be reported privately first. Please do not file public issues for vulnerabilities until a patch ships.

## Privacy guidance for evidence

If you run an audit against a private surface and want to publish the findings:

1. **Review screenshots** before committing. Crop or redact identifying content (names, email addresses, message bodies).
2. **Review the scorecard's `target.value`** — if the URL contains an org name or path you'd rather not publish, replace it with a generic descriptor.
3. **Set `evidence_mode.private_content_captured: true`** in the scorecard if the run captured sensitive content and you intend to keep it local-only. The CI does not check this — it's a documentation discipline.
4. **Consider doc-fallback mode** for high-sensitivity targets. The Outlook PT2 in this repo is an example: vendor documentation as primary evidence, no live session, no private content captured. Findings default to Inferred.

The discipline is: **don't put anything in `evidence/<run-id>/` that you wouldn't want indexed by GitHub search.**
