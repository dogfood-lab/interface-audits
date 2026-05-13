# Ship Gate

> Detected tags: `[all]`
>
> This repo currently has no CLI, MCP server, vsix, or desktop artifact. Items tagged `[cli]`, `[mcp]`, `[vsix]`, or `[desktop]` are SKIP'd with a "not-yet-applicable; revisit when X is added" reason. They are tracked in the "Future applicability" section at the bottom so they get unchecked when those surfaces ship.

**Tags:** `[all]` every repo · `[npm]` `[pypi]` `[vsix]` `[desktop]` `[container]` published artifacts · `[mcp]` MCP servers · `[cli]` CLI tools

---

## A. Security Baseline

- [x] `[all]` SECURITY.md exists (2026-05-12) — see [`SECURITY.md`](SECURITY.md), includes report email, supported versions, response timeline, threat-surface section
- [x] `[all]` README includes threat model paragraph (2026-05-12) — see "Threat surface" section of the README
- [x] `[all]` No secrets, tokens, or credentials in source or diagnostics output (2026-05-12) — verified via `git log` and `grep -R` over the repo at first push; no `.env`, no `.key`, no inline tokens
- [x] `[all]` No telemetry by default (2026-05-12) — stated explicitly in [`SECURITY.md`](SECURITY.md). No skill in this repo collects or transmits telemetry of any kind.

### Default safety posture

- [ ] `[cli|mcp|desktop]` SKIP: this repo currently has no CLI, MCP server, or desktop artifact. The audit skills are markdown contracts interpreted by Claude; they do not natively execute. Tracked under "Future applicability" below.
- [x] `[cli|mcp|desktop]` File operations constrained to known directories (2026-05-12) — documented in [`SECURITY.md`](SECURITY.md): skill file writes are scoped to `audits/<name>/evidence/<run-id>/`. This applies today to skill-driven runs even though no native CLI exists.
- [ ] `[mcp]` SKIP: no MCP server in this repo. When a runner MCP ships, this gate must be re-checked.
- [ ] `[mcp]` SKIP: no MCP server in this repo. The skill's output contract (findings + scorecard) is structured by design — see [`shared/finding-format.md`](shared/finding-format.md) and JSON schemas — so when an MCP runner ships, the structured-error rule is already satisfied at the data layer.

## B. Error Handling

- [x] `[all]` Errors follow the Structured Error Shape (2026-05-12) — applies to skill outputs. Every finding carries required fields (`id`, `severity`, `section`, `surface`, `load_displaced_to`, `evidence_state`, `evidence_summary`). The Open-question state is the "I lack evidence" failure shape. Schemas enforce the shape ([`shared/schemas/finding.base.schema.json`](shared/schemas/finding.base.schema.json), [`shared/schemas/scorecard.base.schema.json`](shared/schemas/scorecard.base.schema.json)). The `verify-schemas.mjs` script validates conformance on every commit.
- [ ] `[cli]` SKIP: no CLI yet. When a runner CLI ships, exit-code policy must follow shipcheck B2 (0 ok, 1 user error, 2 runtime error, 3 partial success). Note: the existing `verify.sh` already follows this — exits 0 on success, 1 on validation failures, 2 on unexpected errors.
- [ ] `[cli]` SKIP: no CLI yet. When a runner CLI ships, this must be re-checked. Note: `verify-schemas.mjs` and `verify-links.mjs` print structured error lines (no raw stacks) by design; only the AJV `errors` array is rendered, not a thrown `Error.stack`.
- [ ] `[mcp]` SKIP: no MCP server. When one ships, re-check.
- [ ] `[mcp]` SKIP: no MCP server. The audit's Inferred / Open-question evidence states already encode the "degrade gracefully" doctrine at the data layer — an audit with insufficient evidence produces Open questions, not crashes. Reference for the future MCP design.
- [ ] `[desktop]` SKIP: no desktop artifact.
- [ ] `[vscode]` SKIP: no VS Code extension.

## C. Operator Docs

- [x] `[all]` README current (2026-05-12) — what it does, install/setup (`npm install` for dev verify; audits otherwise consumed as plain markdown), usage (skills invoked via Claude or compatible runner), supported platforms (Node 20+ for verify tooling; markdown-only consumption is platform-agnostic). See [`README.md`](README.md).
- [x] `[all]` CHANGELOG.md (Keep a Changelog format) (2026-05-12) — see [`CHANGELOG.md`](CHANGELOG.md) (monorepo) and [`audits/cognitive-load/CHANGELOG.md`](audits/cognitive-load/CHANGELOG.md) (per-audit). Both use `[version] - YYYY-MM-DD` headings with `Added` / `Changed` / `Security` / `Status` / `Evidence` subsections.
- [x] `[all]` LICENSE file present and repo states support status (2026-05-12) — MIT. See [`LICENSE`](LICENSE). Supported versions stated in [`SECURITY.md`](SECURITY.md): `1.x` Yes, `< 1.0` No.
- [ ] `[cli]` SKIP: no CLI yet. When a runner CLI ships, `--help` must be accurate per shipcheck C4.
- [ ] `[cli|mcp|desktop]` SKIP: no CLI/MCP/desktop yet. Skill output verbosity is documented per-skill in `audits/<name>/skill/SKILL.md`; when a runner CLI ships, this gate must be re-checked with secrets-redaction discipline.
- [ ] `[mcp]` SKIP: no MCP server. Skill tools are documented in their `SKILL.md` under "Inputs / Optional context / Outputs / Procedure"; the same contract format will apply when an MCP runner ships.
- [x] `[complex]` HANDBOOK.md / operator docs (2026-05-12, partial) — the Starlight handbook scaffolded under `site/` ships in this release at https://dogfood-lab.github.io/interface-audits/handbook/. Daily-ops coverage is light because the audit framework has no daemons or recovery scenarios yet. Will expand as runners ship.

## D. Shipping Hygiene

- [x] `[all]` `verify` script exists (2026-05-12) — [`verify.sh`](verify.sh) runs schema validation + link check + shipcheck audit in one command. Also exposed as `npm run verify`.
- [x] `[all]` Version in manifest matches git tag (2026-05-12, on release) — [`package.json`](package.json) version `0.1.0`; tag `v0.1.0` cut at the end of the full-treatment pass (Phase 7). This is initial public release; future audits and schema refinements may bring breaking changes. v1.0.0 is reserved for when the schema and shared norms are stable enough that breaking changes warrant a major bump.
- [x] `[all]` Dependency scanning runs in CI (2026-05-12) — `npm audit` runs as part of `npm ci` in CI (`.github/workflows/verify.yml`), Dependabot opens PRs weekly on vulnerabilities (`.github/dependabot.yml`).
- [x] `[all]` Automated dependency update mechanism exists (2026-05-12) — [`.github/dependabot.yml`](.github/dependabot.yml) covers `github-actions` and `npm` ecosystems, weekly schedule.
- [ ] `[npm]` SKIP: `package.json` declares `"private": true`. This repo is not currently published to npm. When/if a runner package is split out and published, this gate must be re-checked.
- [x] `[npm]` `engines.node` set (2026-05-12) — `engines.node: ">=20"` in [`package.json`](package.json).
- [x] `[npm]` Lockfile committed (2026-05-12) — `package-lock.json` committed at repo root.
- [ ] `[vsix]` SKIP: not a VS Code extension.
- [ ] `[desktop]` SKIP: not a desktop app.

## E. Identity (soft gate — does not block ship)

- [x] `[all]` Logo in README header (2026-05-12) — `.brand/readme.png` (interface-audits beagle), wired into README at width=400, centered.
- [x] `[all]` Translations (polyglot-mcp, 8 languages) (2026-05-12) — `README.{ja,zh,es,fr,hi,it,pt-BR}.md` produced via local TranslateGemma 12B (Ollama); language nav bar injected into source `README.md`. Per CLAUDE.md hard rule, translations executed locally — never from Claude's context.
- [x] `[org]` Landing page (@mcptoolshop/site-theme) (2026-05-12) — landing page scaffolded under `site/`, deployed via GitHub Pages at https://dogfood-lab.github.io/interface-audits/.
- [x] `[all]` GitHub repo metadata: description, homepage, topics (2026-05-12) — `gh repo view` confirms description, homepage, and topics set.

---

## Gate Rules

**Hard gate (A–D):** Must pass before any version is tagged or published.
If a section doesn't apply, mark `SKIP:` with justification — don't leave it unchecked.

**Soft gate (E):** Should be done. Product ships without it, but isn't "whole."

---

## Future applicability

Items currently SKIP'd that will need to be re-checked when the corresponding surface ships:

| When | Items to re-check |
|------|-------------------|
| First runner CLI ships | A5 (`--allow-*` flags), B2 (exit codes), B3 (no stack traces without `--debug`), C4 (`--help` accuracy), C5 (logging levels) |
| First runner MCP server ships | A5 (default safety posture), A7 (network egress off), A8 (no stack traces), B4 (structured tool errors), B5 (graceful degradation), C6 (tool documentation) |
| First npm-published package | D5 (`npm pack --dry-run` contents), `"private": true` removed from `package.json` |
| First desktop/vsix artifact | D8, D9, B6, B7 |

This list is the working punch-list for future shipcheck reaudits — not optional items left vague.
