# Scorecard

**Repo:** `dogfood-lab/interface-audits`
**Date:** 2026-05-12
**Type tags:** `[all]` (markdown library with verify tooling). Tags `[npm]`, `[cli]`, `[mcp]`, `[vsix]`, `[desktop]` apply prospectively when those surfaces ship; see SHIP_GATE.md "Future applicability."

## Pre-Remediation Assessment (initial Stage 2 push, before full treatment)

| Category | Score | Notes |
|----------|-------|-------|
| A. Security | 3/10 | SECURITY.md template not filled. No threat model in README. No telemetry/safety statement. |
| B. Error Handling | 5/10 | Schemas existed but no validation script. Some scorecards had inconsistent `load_displaced_to` types (string vs array). |
| C. Operator Docs | 5/10 | README existed; no LICENSE; CHANGELOG informal (not Keep a Changelog). No HANDBOOK. |
| D. Shipping Hygiene | 1/10 | No verify script, no CI, no Dependabot, no package.json. |
| E. Identity (soft) | 1/10 | No logo, no badges, no landing page, no translations, no topics. |
| **Overall** | **15/50** | Stage 2 was "first push to GitHub." Full treatment was the planned follow-up. |

## Key Gaps

1. **No verify script and no CI** — schema violations and broken links in evidence files were not caught. Two real consistency bugs latent in the v0.1-era scorecards (PT0 `load_displaced_to` as strings, Dogfood-1 `F-DOG-*` IDs violating the audit-prefix pattern).
2. **No LICENSE and SECURITY.md was a template** — repo not legally clean and no threat surface documented.
3. **No landing page, no logo, no translations, no GitHub metadata** — soft-gate identity all empty.
4. **CHANGELOGs not in Keep a Changelog format** — version provenance scattered, "Pending" section mixed into prose.
5. **README not threat-model'd** — first-time visitor had no answer to "what does this thing capture about my target."

## Remediation Priority

| Priority | Item | Estimated effort | Status |
|----------|------|-----------------|--------|
| 1 | Verify script + schemas + CI + Dependabot | ~1 hour | Done (Phase 0) |
| 2 | LICENSE + SECURITY.md fill | ~20 min | Done (Phase 0) |
| 3 | CHANGELOGs → KaC format | ~30 min | Done (Phase 0) |
| 4 | Fix latent schema violations in evidence (PT0 + Dogfood-1) | ~30 min | Done (Phase 0) |
| 5 | README polish (logo, badges, threat model, footer) | ~30 min | Done (Phase 1) |
| 6 | Landing page + Starlight handbook | ~1 hour | Done (Phase 2-3) |
| 7 | GitHub metadata + repo-knowledge entry | ~20 min | Done (Phase 4-5) |
| 8 | Translations | ~5 min user time + ~10 min local Ollama | Pending — user runs locally |
| 9 | Tag v1.0.0 + verify deploy | ~10 min | Done (Phase 7) |

## Post-Remediation

After full treatment (Phases 0–7):

| Category | Before | After | Notes |
|----------|--------|-------|-------|
| A. Security | 3/10 | 9/10 | SECURITY.md filled with real threat surface. README threat model paragraph. No-telemetry stated. Skill file-write scope documented. 1 point short of 10 because A5 / A7 / A8 are SKIP-with-future-applicability (re-check when CLI/MCP ships). |
| B. Error Handling | 5/10 | 8/10 | Schemas validated by CI on every push. Skill output contract enforced. Two latent scorecard violations fixed (PT0 string→array, Dogfood-1 ID renames). 2 points short because B2/B3 hard-check requires the future runner CLI. |
| C. Operator Docs | 5/10 | 9/10 | LICENSE (MIT). CHANGELOGs in KaC. README has install + usage + threat model + footer. Starlight handbook live. 1 point short because C4-C6 await CLI/MCP. |
| D. Shipping Hygiene | 1/10 | 9/10 | verify.sh + CI + Dependabot + package.json with engines + lockfile committed. 1 point short because the repo is `"private": true` (not npm-published yet); D5 awaits first runner package. |
| E. Identity (soft) | 1/10 | 9/10 | Logo, badges, landing page, handbook, GitHub topics + homepage all in place. 1 point short until translations land. |
| **Overall** | **15/50** | **44/50** | Treated. Translations and CLI/MCP follow-on items are the remaining headroom. |

## Notes on the score

This is honest, not flattering. A 50/50 would require:
- A runner CLI (or MCP server) with `--help`, exit codes, logging levels, structured errors, safety flags
- Publishing at least one runner package on npm (which removes the `"private": true`)
- Translations completed (`npm run` cannot run them; user runs locally via polyglot-mcp / TranslateGemma)

None of those are blockers for v1.0.0 of the audit library itself. The audit is a contract + skill + evidence package, and at 44/50 it ships clean. The remaining 6 points are about extending the package surface, not fixing what's here.
