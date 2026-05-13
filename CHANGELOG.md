# Interface Audits — Changelog

Monorepo-level events. Per-audit changelogs live at `audits/<name>/CHANGELOG.md` and track that audit's rubric versions independently.

## 2026-05-12 — Repository initialized

- Imported cognitive-load audit at state **Frozen v0.2 + Dogfooded once** from `E:\AI\cognitive-load-audit\` (preserved, not moved).
- Extracted shared norms into `shared/`: audit lifecycle, evidence states, severity model, finding format, pressure-test protocol, base schemas.
- Established four-thing rule for official audits: Rubric + Skill + Schema + Evidence.
- Established audit lifecycle: Draft → Pressure-tested → Frozen → Dogfooded → Revised-with-evidence. Each audit declares its current state in its README.

### Cognitive Load Audit history (summary, full detail in `audits/cognitive-load/CHANGELOG.md`)

- v0.1 (frozen 2026-05-12) — after PT0 (claude.ai live audit)
- v0.2 (frozen 2026-05-12) — after PT1 (GitHub research-os narrow audit)
- PT2 (Outlook Simplified Ribbon) reclassified as doc-fallback; no rubric revision
- Dogfood Run 1 (research-os handbook) produced actionable findings without rubric churn

### Parked at repo level

- A future v0.3 of cognitive-load is parked pending a live-observed Section 5 Removed case. See `audits/cognitive-load/CHANGELOG.md` "Pending — not yet versioned" section.
- A Low-Vision audit is the most-likely second audit. Not started.
