# Dogfood Run 1 — research-os Handbook

**Audit ID:** cla-20260512-dogfood-1-research-os-handbook
**Target:** https://mcp-tool-shop-org.github.io/research-os/handbook/ (Starlight docs site)
**Method:** Path 1 live navigation via Claude-in-Chrome MCP. Full-width inspection at 1440×900; narrow-mode behavior inferred from Starlight responsive breakpoints (50em / 72em) per v0.2 Section 7 caveat (rig DPI scaling prevents viewport reduction below ~2266 CSS px).
**Rubric:** `../../cognitive-load-audit.md` v0.2 (frozen)
**Intent:** Apply v0.2 against a real surface the user controls. **Not for rubric revision.** Findings must be actionable.

## Summary

**Overall: Warn.** Healthy result. **1 High, 4 Medium, 3 Low.** No Critical. No section Fail.

The handbook is in a good place. Typography defaults pass WCAG 1.4.12 cleanly. Search is excellent. The Operator Playbook page shows exemplary AI Compression Risk discipline ("Canonical source: ... — update there first; this page is a full mirror" header). Most findings are punch-list polish that can ship in a small follow-up patch.

Four positive observations worth keeping intact while shipping fixes. Eight findings ranked for actionability in the remediation list. Two carried open questions (rig viewport, no scanner pass).

---

## Positive observations (do not regress)

| ID | What | Why it's good |
|---|---|---|
| **P-DOG-01** | Operator Playbook header carries `Canonical source: research-packs/docs/operator-playbook.md — update there first; this page is a full mirror.` | This is the **opposite of CL-03/CL-04** from PT0. Source provenance is surfaced inline at the top of the doc. Auditor's note: this pattern should propagate to other mirrored docs across the org. |
| **P-DOG-02** | Search is prominent (top center, Ctrl+K shortcut visible) and returns rich results with surrounding context (tested with query "Cowork" — 6 results across CLI Reference, Workflow Chain, Getting Started). | Section 2 (Hidden Load) recognition affordance done right. Lowers the cost of jargon terms (see F-DOG-02). |
| **P-DOG-03** | Body typography: 16px font, 28px line-height (1.75 ratio — exceeds WCAG 2.2 1.4.12 minimum of 1.5). System sans-serif stack (`ui-sans-serif, system-ui, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans...`). No decorative faces in work-critical surfaces. | Section 1 (Measurable Defaults) passes by default. |
| **P-DOG-04** | Theme toggle (Auto / Dark / Light) accessible from every page header in one click. | Section 3 (State Shift) — one-action low-bandwidth control. Persists across pages. |

---

## Finding F-DOG-01 — First sidebar item "research-os" duplicates page H1 of the same name

Severity: **Low**
Section: Text Load (Section 0)
Surface: Left sidebar, Handbook overview page
Load displaced to: `memory`

Issue: The left sidebar's first item is labeled "research-os" — identical to the page's H1 title and the brand mark in the top-left. A user landing on the page may wonder whether the sidebar item "research-os" is a different page from where they are. The sidebar item is the page's overview / index.

Fix: Rename the sidebar item to "Overview" or "Introduction" to disambiguate from the brand and the H1.

---

## Finding F-DOG-02 — Domain jargon used on landing page before being defined

Severity: **Medium**
Section: Text Load (Section 0)
Surface: Handbook overview page (`/handbook/`)
Load displaced to: `memory` + `search`

Issue: The first paragraph of the landing page reads "research-os turns an open-ended research question into a research-pack: a structured local repo where Claude, Cowork, or a swarm can work for hours..." The terms `research-pack`, `Cowork`, and `swarm` are domain-specific and used before being defined. Cowork in particular is a non-obvious term (it's defined later on the Workflow Chain page as a "runtime contract" — not standard usage).

Mitigation: search (P-DOG-02) does return useful definitions when the user queries "Cowork." The cost is offloaded onto the user knowing to search.

Fix: Either (a) inline-define the three terms on first use, with a "(see Workflow Chain for full contract)" link, OR (b) add a small `<dl>` glossary block at the bottom of the overview page covering the 5-8 most-used proper-noun terms, OR (c) make Workflow Chain the second sidebar item (currently 4th) so first-time readers reach the term definitions on their natural reading path.

---

## Finding F-DOG-03 — Getting Started jumps from H1 directly to H2 "Requirements" with no intro paragraph

Severity: **Low**
Section: Text Load (Section 0)
Surface: `/handbook/getting-started/`
Load displaced to: `memory` + `time`

Issue: The page renders `# Getting Started` → `## Requirements` → bulleted list (Node.js >= 20, Ollama) without any prose between the H1 and the H2. A new user lands on "Getting Started" and immediately reads "Node.js >= 20" without knowing what they are about to start. The 9-step "Your first research-pack" section lower down is the actual orientation, but it's not introduced before requirements.

Fix: Add a one-line intro paragraph between the H1 and "Requirements," e.g. "This guide walks you from install to your first research-pack — a structured local repo built from a research question. About 30 minutes end-to-end."

---

## Finding F-DOG-04 — Operator Playbook on-this-page rail is dense (10 H2 + 9 H3)

Severity: **Medium**
Section: Text Load (Section 0) + Hidden Load (Section 2)
Surface: `/handbook/operator-playbook/` right-rail "On this page"
Load displaced to: `visual decoding` + `memory`

Issue: The Operator Playbook is 2128 words across 10 H2s and 9 H3s, with 85 inline-code references. The right "On this page" rail renders all 19 anchors as a vertical list, with H3s indented under their parent H2. At normal reading distance this is a small dense block of links — usable, but not scan-friendly for a user in a low-bandwidth state who wants to jump to a section.

Fix: (a) Show only H2 anchors by default, with H3s revealed on hover or on click of the parent H2, OR (b) introduce a "Sections" lightbox shortcut (e.g. shift+/) that opens a denser overview, OR (c) split Operator Playbook into 2-3 sub-pages if the doctrine has reached a natural fissure point.

---

## Finding F-DOG-05 — Mobile menu trigger has no aria-label

Severity: **High**
Section: Hidden Load (Section 2)
Surface: Mobile / narrow header (`starlight-menu-button` custom element)
Load displaced to: `memory` (for screen reader users)

Issue: The Starlight mobile menu trigger (custom element `<starlight-menu-button>`) was inspected via DOM. It has no `aria-label` attribute. Screen reader users on narrow viewports get no announced name for the menu button — it reads as an unlabeled button. This is the only High in the audit because it's a real accessibility regression.

Fix: Add `aria-label="Open navigation menu"` (or pick up the localized Starlight string) on the menu button. This is a small Starlight config / template fix.

Evidence: **Observed** — `document.querySelector('starlight-menu-button').getAttribute('aria-label')` returned `null`.

---

## Finding F-DOG-06 — No in-doc font-size or density control beyond Auto/Dark/Light theme

Severity: **Medium**
Section: State Shift (Section 3) + Configuration Cost (Section 6)
Surface: handbook header (all pages)
Load displaced to: `configuration`

Issue: The theme toggle is excellent (one-click, accessible, persists). But it's the only one-action display control. A user in a low-bandwidth state who needs larger text must use browser zoom — which works (the layout reflows fine) but is not surfaced as a documented affordance in the handbook chrome. There's no "Reading mode" or "Large text" option in the header.

Fix: Either (a) document browser zoom (Ctrl+/Cmd+) in a small "Display tips" footer on every page, OR (b) add a font-size toggle (small / medium / large) next to the theme select in the header. Starlight does not ship this by default; would be a small custom component.

Note: Browser-level zoom is a workable fallback. This is a soft finding — the path exists, it's just not surfaced.

---

## Finding F-DOG-07 — 13-item left sidebar without grouping

Severity: **Low**
Section: Text Load (Section 0) + Hidden Load (Section 2)
Surface: Handbook left sidebar
Load displaced to: `visual decoding`

Issue: The sidebar has one group ("Handbook") with 13 items as a flat list: research-os, Getting Started, The 16 Laws, The Workflow Chain, CLI Reference, Recovery Runbook, Known Limitations, pack publish, Reviewer Calibration, Operator Playbook, Source-Card Audit, contradict map, Section-scoped source waivers. 13 items is on the upper edge of comfortable scan length. The items aren't conceptually ordered by user journey (Getting Started is correctly 2nd, but the 16 Laws comes before The Workflow Chain even though the chain is more concrete).

Fix: Either (a) group into 3-4 conceptual buckets (e.g., "Start here" / "Core concepts" / "Operator references" / "Surfaces"), OR (b) ensure ordering matches the natural reading path (Getting Started → Workflow Chain → The 16 Laws as the doctrine layer → CLI Reference → operator pages → niche references).

---

## Finding F-DOG-08 — Narrow-mode on-this-page rail is hidden entirely (no overflow path)

Severity: **Medium**
Section: Power Preservation (Section 5)
Surface: All handbook pages at viewport <72em (~1152 CSS px)
Load displaced to: `navigation`
**Section 5 taxonomy: hidden**

Issue: Starlight's media query `(min-width: 72em)` gates the on-this-page right rail. Below that breakpoint, the rail is removed from the layout entirely. On dense pages like Operator Playbook (19 anchors), this loses the user's primary in-page navigation tool. No collapse-to-button / overflow / "jump to section" surface replaces it. The capability exists in DOM but isn't reachable through any visible affordance at narrow widths.

Fix: At narrow widths, replace the right rail with a single "On this page (19 sections)" expandable widget at the top of the article body (or beneath the H1). Could be a `<details>` element by default; pin/sticky is optional.

Evidence: **Inferred** — Starlight responsive behavior confirmed via media-query inspection (`min-width: 72em` matches false on standard tablet widths). Direct narrow-render not exercised on the rig (carries OQ-05 from PT1).

---

## Open question OQ-DOG-01 — Lighthouse / axe scanner pass

Carries forward OQ-01 from PT0 / PT1 / PT2-doc-fallback. No quantitative measurement of contrast ratios, color combinations in light theme, focus-visible behavior, or full WCAG 2.2 conformance has been collected on this run. Visual inspection in dark mode looks acceptable.

Resolution path: run Lighthouse against the handbook URL; or `axe-core` against `/handbook/` and 3-4 representative subpages (Operator Playbook for density, Getting Started for onboarding, CLI Reference for code-heavy).

## Open question OQ-DOG-02 — Narrow-mode behavior not directly observed

Same rig limitation as PT1 (DPI scaling prevents viewport reduction below ~2266 CSS px). F-DOG-08 is Inferred from Starlight's documented responsive behavior, not observed in this run.

Resolution path: re-run on a non-DPI-scaled rig or via headless browser with `setViewport({width: 375, height: 667})`. Or have user verify on a mobile device.

---

## Auditor notes

This is a **clean dogfood**. The handbook is in good shape. The audit produced one real accessibility regression worth shipping immediately (F-DOG-05 aria-label), three Section 0 polish items (F-DOG-01, F-DOG-02, F-DOG-03), one structural-but-not-urgent issue (F-DOG-04 on-this-page density on Operator Playbook), one Section 5 narrow-mode issue (F-DOG-08), and two soft / boundary findings (F-DOG-06, F-DOG-07).

Most leverage per fix:
- F-DOG-05 is a one-line template edit.
- F-DOG-02 + F-DOG-03 are small markdown edits.
- F-DOG-08 is a Starlight customization but pays off across every dense page.

The handbook also exhibits a pattern other repos should adopt: **canonical-source attribution at the top of mirrored docs** (P-DOG-01). Worth surfacing in the next CHANGELOG note or doctrine-update across the org.

No rubric revision triggered by this run. v0.2 stands.

End of Dogfood Run 1.
