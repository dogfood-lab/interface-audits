# Pressure Test 2 (doc fallback) — Remediation Priority

**Audit:** cla-20260512-outlook-doc-fallback-pt2
**Target:** Microsoft Outlook (Classic vs Simplified Ribbon)
**Evidence mode:** Documentation fallback. No live observation. **Do not treat this remediation list as a final calibration of Section 5.** The bigger artifact is the **negative result**: Outlook Simplified Ribbon, on documented evidence, is a Hidden/Delayed power model — not a Removed one. The rubric still needs a future live-observed Removed target before v0.3 can commit to splitting the Removed sub-category.

---

## Priority 1 — Pin accessibility features outside the `...` overflow by default (fixes CL-17)

**Severity:** High · **Section 5 taxonomy:** Hidden
**The shape of the fix.** Pin Read Aloud, Immersive Reader, and high-contrast toggles to the visible Simplified Ribbon by default. Surface a one-click "pin to ribbon" affordance per command that users discover in `...`. The pin/unpin mechanism already exists; the defaults should respect accessibility-critical commands.

**Why this is Priority 1.** Hiding accessibility features behind `...` overflow in a UI sold as "simplified" creates a recursive Cognitive Load Law trap — the users who most need Read Aloud are the users least equipped to discover it.

---

## Priority 2 — Restore the Folder tab as a labeled affordance (fixes CL-15)

**Severity:** High · **Section 5 taxonomy:** Hidden
**The shape of the fix.** Restore the Folder tab in Simplified Ribbon, OR provide a persistent "Folder" overflow group at the right end of the Simplified Home tab that mirrors Classic Folder tab contents, OR surface a "Folder actions" pill near the navigation pane.

**Why this is Priority 2.** Folder-tab commands are reachable via right-click on a folder in the nav pane (capability preserved — that's why this is Hidden, not Removed), but right-click is not a discoverable substitute for a labeled tab.

---

## Priority 3 — Treat Tell Me as support, not a primary access path (fixes CL-16)

**Severity:** High · **Section 5 taxonomy:** Hidden
**The shape of the fix.** Every command discoverable only through Tell Me search should ALSO be available via visible affordance — a dropdown arrow on a related button, OR `...` overflow, OR a "more actions" panel that opens without requiring the user to know the command name. Tell Me stays as a power-user shortcut; it doesn't carry the primary discovery burden.

**Why this is Priority 3.** Recall (typing the command name) should not be the only path to a feature. Recognition (scanning visible options) is the lower-cognitive-load discovery mode.

---

## Priority 4 — Expand new Outlook customization options (fixes CL-19)

**Severity:** Medium · **Section 5 / Section 6**
**The shape of the fix.** Surface a "Customize Simplified Ribbon" dialog in new Outlook that supports: create a custom group of pinned buttons under a custom name; reorder pinned buttons; export/import pin configurations. Full custom-tab creation can be a stretch goal; the middle-tier customization gap is what power users notice.

**Why this is Priority 4.** Pin/unpin is the documented baseline. The gap is in the middle (custom groups, reordering, naming) — the layer between "pin a button" and "make a custom tab." Filling this is straightforward and addresses the power-user complaints in community Q&A.

---

## Priority 5 — Label the ribbon-toggle caret (fixes CL-18)

**Severity:** Medium · **Section 6 / Section 3**
**The shape of the fix.** Replace the unlabeled caret in the ribbon's lower-right corner with a labeled toggle button ("Switch to Classic Ribbon" / "Switch to Simplified Ribbon"). Or surface the toggle in the View tab where users expect display options.

**Why this is Priority 5.** Small fix, low surface area; addresses the State Shift discoverability issue.

---

## Priority 6 — Inline the reference-guide mappings (fixes CL-20)

**Severity:** Medium · **Section 5 taxonomy:** Hidden (meta)
**The shape of the fix.** Microsoft's separate "Simplified Ribbon reference" Support article maps every Classic command to its Simplified location. Those same mappings could live INLINE in the product — first-run tooltips, Tell Me results that highlight on-ribbon locations with a "show me" visual pulse, or a Simplified-Ribbon onboarding tour.

**Why this is Priority 6.** Addresses the meta-evidence finding — Microsoft is using documentation to compensate for UI displacement. The fix is to put the documentation INTO the UI.

---

## Bigger artifact: v0.3 rubric recommendations (revised)

PT2-doc-fallback's primary deliverable is **what it did NOT produce**: no clean Removed observation, despite the target being chosen specifically to exercise Removed.

1. **The Removed sub-distinction is DEFERRED.** PT2-doc-fallback did not produce live-observed Removed cases. The earlier draft overclaimed two findings as Removed; honest reclassification moves both to Hidden. The rubric should not adopt `removed_with_workaround` vs `removed_without_equivalent` based on this evidence base.

2. **A future PT3 should target a product with strict feature subsetting.** Candidates: a SaaS lite/free tier with documented absent premium features; a feature-stripped mobile app (Slack Mobile vs Slack Desktop has feature gaps in admin/workflow tools); an enterprise-vs-consumer split (Notion Free vs Notion Plus). Outlook Simplified Ribbon was the wrong target for Removed — it is mostly Hidden/Delayed, not Removed.

3. **The "vendor reference guide as Hidden meta-evidence" pattern (CL-20) IS worth folding into the rubric.** When a vendor publishes a separate documentation artifact whose purpose is to help users find moved features, that itself is structural evidence of Hidden classification. Add to Section 5's failure-modes list in v0.3.

4. **The audit discipline lesson from PT2-doc-fallback is the bigger deliverable than the findings.** I overclaimed Removed in the first draft because the test was specifically scoped to find Removed. The Inferred evidence state is precisely the brake against this kind of over-fitting. Future audits should treat "test designed to find X" as a flag for extra reclassification discipline.

5. **OQ-01 still open across all three PTs.** Lighthouse / axe scanner pass on at least one production target remains pending.

End of PT2-doc-fallback remediation list.
