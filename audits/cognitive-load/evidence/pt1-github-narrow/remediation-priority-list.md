# Pressure Test 1 — Remediation Priority

**Audit:** cla-20260512-github-narrow-pt1
**Target:** https://github.com/mcp-tool-shop-org/research-os
**Note:** GitHub is not your product to remediate. This list is shaped as a remediation list because the rubric expects one — treat it as a model of what fixes would look like if you DID own these surfaces. The bigger artifact here is the v0.2 rubric recommendations below.

---

## Priority 1 — Persist file tree state at narrow widths (fixes CL-12)

**Severity:** Medium · **Section 5 taxonomy:** Hidden → Compressed
**The shape of the fix.** File tree currently auto-collapses on navigation event. Persist the open state across navigation within the same blob view. Users browsing related files keep the tree open without re-clicking. Add a "pin tree" toggle for users who explicitly want it always-open at narrow widths.

**Why this is Priority 1.** File navigation is the most common developer task on a code-hosting surface. The current pattern adds +1 click per file navigation — compounds across a code review.

---

## Priority 2 — Surface repo-nav overflow visibly (fixes CL-09)

**Severity:** High · **Section 5 taxonomy:** Hidden → Compressed
**The shape of the fix.** When the `UnderlineWrapper` moves N items to the overflow `...` menu, show a count badge ("3 more") on the overflow button. OR persist a minimum visible set (Code / Issues / PRs / Actions) and only overflow the remainder. The current behavior makes overflowed tabs feel optional rather than load-bearing.

**Why this is Priority 2.** The repo nav is the most reused navigation surface on GitHub. Hidden navigation taxes recall on every page load.

---

## Priority 3 — Skip-to-discussion anchor on PR mobile layout (fixes CL-10)

**Severity:** Medium · **Section 5 taxonomy:** Delayed → Pass
**The shape of the fix.** Add an anchor link at the top of the stacked sidebar in narrow mode: "Skip to conversation." OR collapse empty sidebar widgets (No one yet / None yet / No milestone) into a single "Add metadata" affordance so empty widgets stop consuming vertical space above the thread.

**Why this is Priority 3.** PR triage workflows hit this surface often; the delayed-scroll cost compounds.

---

## Priority 4 — Sticky / inline About at narrow widths (fixes CL-11)

**Severity:** Medium · **Section 5 taxonomy:** Delayed → Compressed
**The shape of the fix.** Either sticky-position the About sidebar (always visible at top of narrow-mode strip), OR promote the top-3 metadata items (description, primary language, license) into the repo header at narrow widths so they appear before the README. Topics + activity can stay below.

**Why this is Priority 4.** First-time visitors and casual browsers need "what is this repo" before they need the README itself.

---

## Priority 5 — Show truncation indicators on commit-message rows (fixes CL-13)

**Severity:** Low · **Section taxonomy:** Section 0 Text Load
**The shape of the fix.** When a commit message in the file-tree row is truncated, render a small expand affordance (an icon, or a hover-revealed tooltip with the full message). Currently the truncation is invisible — the user doesn't know whether the message ends or continues.

**Why this is Priority 5.** Low-impact, but a one-line CSS / icon change.

---

## Priority 6 — Expand global nav at wide viewports (fixes CL-14)

**Severity:** Low · **Section taxonomy:** Section 2 Hidden Load
**The shape of the fix.** At viewports ≥1280px, expand 3-4 most-used global nav items (Dashboard, Issues, Pull requests, maybe Explore) into the top bar as text links. Hamburger becomes overflow for the rest. Current behavior optimizes for mobile and penalizes wide-screen users.

**Why this is Priority 6.** Low cognitive impact for the typical user; meaningful for power users on ultra-wide displays.

---

## Bigger artifact: v0.2 rubric recommendations

PT1's primary deliverable is not the GitHub fixes — it's the validation of the Section 5 sub-taxonomy. Carry these into `cognitive-load-audit.md` v0.2:

1. **Add the 4-way Section 5 taxonomy to the rubric.** Each Section 5 finding should classify itself: Compressed / Delayed / Hidden / Removed. Default severity mapping: Compressed = Pass/Low, Delayed = Medium, Hidden = High, Removed = Critical. Auditors may override with justification.

2. **Add a `section_5_taxonomy` field** to the finding format and scorecard schema. Optional for non-Section-5 findings (set to `n/a`).

3. **Document the rig limitation in Section 7.** Responsive/narrow-mode audits may require a non-DPI-scaled rig OR headless browser with explicit viewport metrics override. The rubric should not assume every audit can reach the actual narrow viewport — Inferred evidence based on DOM/CSS class analysis is acceptable provided the limitation is documented.

4. **Carry OQ-01 forward.** Lighthouse/axe scanner pass on at least one production target is still pending. Section 1 (Measurable Defaults) cannot fully pass without it.

End of PT1 remediation list.
