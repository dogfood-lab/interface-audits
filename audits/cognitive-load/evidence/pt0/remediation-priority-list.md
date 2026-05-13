# Pressure Test 0 — Remediation Priority

**Audit:** cla-20260512-claude-ai-pt0
**Target:** https://claude.ai

Ordered by severity, then by leverage (how many findings + sections each fix addresses).

---

## Priority 1 — Response provenance and source-recovery (fixes CL-03 + CL-04)

**Severity:** Critical × 2
**Sections improved:** AI Compression Risk (4) — converts Fail → Pass

**The shape of the fix.** Every AI response gets a provenance footer that distinguishes three states:
- **Generated from training** — soft confidence indicator, no sources needed
- **Web search used** — list of retrieved domains with one-click expansion to the cited paragraphs
- **Mixed** — the response is partly training, partly web; explicit per-claim source markers where retrieval contributed

For widget-style numeric output: label assumptions as Claude's choices (visually distinct from user-supplied values), and add a "show calculation" affordance that reveals the underlying formula and inputs.

**Why this is Priority 1.** Two Criticals in one section. One source-recovery + provenance layer addresses both. The same UI affordance (an "expand to see sources / assumptions" pattern) serves text responses, retrieval-augmented responses, and generated artifacts. Highest leverage per implementation surface.

---

## Priority 2 — In-chat reading / display quick-control (fixes CL-02 and partially CL-05, CL-07)

**Severity:** Critical (CL-02) + High (CL-05) + Medium (CL-07)
**Sections improved:** State Shift (3) — converts Fail → Pass. Configuration Cost (6) — softens Warn.

**The shape of the fix.** Add a one-button "Reading" control on the chat surface — visible near the model selector or compose box. Clicking opens a small inline panel with the highest-leverage display toggles:
- Font (default / sans / dyslexic-friendly)
- Text size (default / large / extra-large)
- Density (default / comfortable)
- Theme (system / light / dark)
- Hide suggestions chips

Persist the user's choice. Make every toggle reversible in one click. Do NOT replace the full Settings page — but surface the most-used 4-5 toggles where the user already is.

**Why this is Priority 2.** Eliminates the "4-click + full-page-nav" path for the most common accessibility need. Addresses the audit's strongest single test (State Shift): can the interface degrade gracefully into its own configuration? Currently no. After this fix: yes.

---

## Priority 3 — Sidebar-collapse mini-labels or quick-history (fixes CL-01)

**Severity:** High
**Sections improved:** Hidden Load (2) — Warn → Pass

**The shape of the fix.** When the sidebar collapses, do one of:
- Show truncated labels under each icon at small size (still icon-driven, but recognition-supporting)
- OR show a "Recent: [N]" pill above the rail with the 3 most-recent chat titles abbreviated, hoverable to expand
- OR keep tooltips on hover but ALSO show a one-line label fade-in on focus

Hover-only tooltips alone are not sufficient — they fail for keyboard users and they require precise mouse positioning, which is itself a fine-motor / attention cost. The mini-label option is the cheapest and most universally accessible.

**Why this is Priority 3.** Significant displacement-to-recall in a high-traffic UI element. Affects every user who collapses the sidebar (a sizeable fraction). Self-contained fix — no architectural change required.

---

## Priority 4 — Settings as drawer / overlay (fixes CL-06)

**Severity:** Medium
**Sections improved:** Configuration Cost (6) — softens further toward Pass

**The shape of the fix.** Open Settings as a right-side drawer or full-screen modal that preserves the chat surface behind it. Closing restores exact scroll position, selection, and any in-progress message text.

Reserve full-page route navigation for billing, account deletion, and operations that genuinely warrant exit from the task.

**Why this is Priority 4.** Smaller cognitive impact than P1-P3 but pairs naturally with P2 (in-chat quick-control) — most users will reach the full settings page less often once P2 ships, and when they do, preserving task context matters most.

---

## Priority 5 — Add "Accessibility" or "Reading" section in Settings (fixes CL-07)

**Severity:** Medium
**Sections improved:** Configuration Cost (6) — completes the section softening

**The shape of the fix.** Add a top-level "Accessibility" or "Reading" entry to the Settings left-nav. Move font, theme, density, motion-reduction, and any future contrast/animation controls into it. Keep links from General → Preferences for backward compatibility.

Add a "Save as preset" button so users can name configurations ("Brain fog day," "Reviewing dense docs," "Default") and switch between them in one click.

**Why this is Priority 5.** Discoverability fix. Pairs with P2 — when users do reach Settings looking for accessibility controls, the section name should match what they're searching for.

---

## Priority 6 — Auto-title transparency (fixes CL-08)

**Severity:** Low
**Sections improved:** AI Compression Risk (4) — already Fail without this; this is a polish fix once P1 lands

**The shape of the fix.** When Claude auto-titles a chat, show a small "auto-titled — rename" inline affordance on the chat header for the first N sessions, until the user either renames or dismisses. Alternatively, use the user's first prompt verbatim (truncated to ~60 chars) as the default title.

**Why this is Priority 6.** Low-impact, polish-tier. Worth fixing because it's a near-zero-cost improvement to source-faithfulness, and source-faithfulness is the entire AI Compression Risk family.

---

## Quick-win bundle

If shipping P1–P6 over time is too slow, the **highest-leverage single sprint** is **P1 + P2**: response provenance + in-chat reading control. These alone convert two section Fails into two Passes, and they share no UI surface (response area vs. compose-adjacent), so they can be built in parallel without integration conflicts.

After P1 + P2, the audit's overall status moves from Fail to Warn. After P1–P5, it moves to Pass on all measured sections (with Section 1 still gated on the unrun scanner pass — OQ-01).

---

## Out of scope for this remediation list

- **Section 1 measurement (OQ-01)** is a process item, not a code change. Run Lighthouse/axe against the production build and attach results to the next audit pass.
- **OQ-02 (summary-of-source recovery)** depends on P1 — once provenance UI ships, the summary case is covered automatically.
- **OQ-03 (cross-session state persistence)** likely already works; should be confirmed but probably needs no code change.
- **OQ-04 (human auditor in constrained state)** is an audit-process item, not a product fix.

End of remediation priority list.
