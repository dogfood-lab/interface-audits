# Dogfood Run 1 — research-os Handbook Remediation

**Audit:** cla-20260512-dogfood-1-research-os-handbook
**Target:** https://mcp-tool-shop-org.github.io/research-os/handbook/
**This is dogfood — the user owns this surface and can act on it directly.**

Below: a punch list ordered by leverage (severity × effort × user-impact). Items P1–P4 are small enough to ship in one follow-up patch. P5–P7 are larger but still bounded. The bigger artifact is the **positive pattern** at the bottom — worth propagating across the org.

---

## P1 — Add `aria-label` to the mobile menu trigger (fixes CL-25)

**Severity:** High · **Effort:** ~1 line of code or theme override
**The fix.** The Starlight `<starlight-menu-button>` custom element renders with no `aria-label`. Add one — either via Starlight's theming override or by patching the template:

```html
<starlight-menu-button aria-label="Open navigation menu">…</starlight-menu-button>
```

Pick up Starlight's localized string if i18n is in play.

**Why P1.** The only real accessibility regression in the audit. One-line fix. Ships invisibly to sighted users; restores parity for screen reader users on mobile.

---

## P2 — Add an intro paragraph to Getting Started (fixes CL-23)

**Severity:** Low · **Effort:** one markdown edit
**The fix.** Between `# Getting Started` and `## Requirements`, add a single line of orientation:

> This guide walks you from install to your first research-pack — a structured local repo built from a research question. About 30 minutes end-to-end.

(Adjust the time estimate as appropriate.)

**Why P2.** Tiny fix, real onboarding improvement. A first-time user currently lands on "Requirements: Node.js >= 20" with no sense of what they're about to do.

---

## P3 — Inline-define `Cowork`, `research-pack`, `swarm` on first use, OR add an overview-page glossary (fixes CL-22)

**Severity:** Medium · **Effort:** one markdown edit on the overview page
**The fix.** On `/handbook/`, the first sentence uses three domain terms (`research-pack`, `Cowork`, `swarm`) before defining any of them. Options:

- **Inline definitions on first use**, with a "see Workflow Chain" link:
  > `research-os` turns an open-ended research question into a **research-pack** (a structured local repo of sources, claims, and contradiction maps), where Claude, **Cowork** (a runtime contract — see `[Workflow Chain](workflow)`), or a swarm can work for hours…
- **Or** a small `<dl>` glossary at the bottom of the overview page covering the 5–8 most-used proper nouns.
- **Or** move Workflow Chain to be the second sidebar item (currently 4th) so first-time readers hit definitions earlier.

**Why P3.** Search mitigates the cost (P-07 is real — Cowork is findable in 6 pages), but a reader's first impression is still 3 undefined terms in 30 words.

---

## P4 — Rename first sidebar item from "research-os" to "Overview" (fixes CL-21)

**Severity:** Low · **Effort:** one config / frontmatter edit
**The fix.** Starlight sidebar config: change the title of the index page entry from `research-os` to `Overview` or `Introduction`. Avoids brand/H1/sidebar-item three-way name collision.

**Why P4.** Tiny edit; resolves a subtle "where am I?" moment on first load.

---

## P5 — At narrow widths, replace the right rail with an expandable "On this page" widget (fixes CL-28)

**Severity:** Medium · **Effort:** small Starlight component override
**The fix.** Below 72em, Starlight currently removes the on-this-page rail entirely. For dense pages like Operator Playbook (19 anchors), this loses the user's in-page nav. Replace the removal with an injected `<details>`-style "On this page (19 sections)" widget at the top of the article body. Could be open-by-default or closed-by-default with a count badge.

**Why P5.** Largest UX gain per effort for users reading dense docs on tablet / narrow desktop. Hits every page, not just one.

---

## P6 — Reduce density of the Operator Playbook on-this-page rail (fixes CL-24)

**Severity:** Medium · **Effort:** Starlight customization OR content split
**The fix.** Two approaches, pick one:

- **(a)** Customize the on-this-page rail to show only H2 anchors by default; reveal H3s on hover or on click of the parent H2.
- **(b)** Split Operator Playbook into 2–3 sub-pages at the natural fissure (the doctrine is 10 H2s — they probably cluster into themes like "source format" / "discovery & detection" / "model environment" / "session hygiene").

**Why P6.** This is the densest page in the handbook by a wide margin. Splitting it would also help with deep-linking and changelog tracking.

---

## P7 — Group the 13-item sidebar into 3-4 conceptual buckets (fixes CL-27)

**Severity:** Low · **Effort:** Starlight sidebar config edit
**The fix.** Replace the flat "Handbook" group with bucketed groups, e.g.:

- **Start here** — Overview, Getting Started
- **Doctrine** — The 16 Laws, The Workflow Chain
- **Operating** — Operator Playbook, Reviewer Calibration, Source-Card Audit
- **Surfaces** — pack publish, contradict map, Section-scoped source waivers
- **Reference** — CLI Reference, Known Limitations, Recovery Runbook

**Why P7.** Reduces flat scan length from 13 items to 4 groups of 2–4 items. Improves first-load orientation.

---

## Not addressed in this pass

- **CL-26 (font-size control)** — Starlight doesn't ship a font-size affordance and Ctrl+/Cmd+ browser zoom works fine. Soft finding; leave for a future polish pass unless user feedback specifically calls it out.
- **OQ-DOG-01 (Lighthouse / axe scan)** — process step, not a code change. Recommend running once and attaching the report to the next handbook release.

---

## Positive pattern worth propagating across the org

The Operator Playbook page header reads:

> *Canonical source: `research-packs/docs/operator-playbook.md` — update there first; this page is a full mirror.*

This is **exemplary** AI Compression Risk discipline (Section 4). It's the opposite of PT0's CL-03 + CL-04 findings on claude.ai. Propose: adopt this pattern across all mirrored docs in mcp-tool-shop-org repos. A one-line frontmatter convention (`canonical_source: <path>`) rendered as a stylable callout would generalize it.

---

## Verdict on the dogfood

The handbook is in healthy shape. **No Critical, no section Fail, no Removed.** v0.2 of the rubric stands unchanged. The audit produced a small, shippable punch-list (P1–P4 are ~1 hour of editing) plus two structural upgrades (P5–P6) that pay off broadly. Plus a positive pattern (P-06) worth promoting beyond this single repo.

The audit also worked as intended: it didn't manufacture findings, it surfaced four positive observations, and it caught one real a11y regression (CL-25) that's worth a same-day fix.

End of Dogfood Run 1 remediation.
