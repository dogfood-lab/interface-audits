# Pressure Test 2 (documentation fallback) — Outlook Simplified Ribbon

**Audit ID:** cla-20260512-outlook-doc-fallback-pt2
**Target:** Microsoft Outlook — Classic Ribbon vs Simplified Ribbon (desktop + new Outlook)
**Rubric:** `../../cognitive-load-audit.md` v0.2 (frozen)

## Evidence mode

> **This is a documentation fallback, not a full pressure test.** Live access to `outlook.live.com` was blocked by an auth gate (no cached session, marketing redirect). The audit pivoted to canonical Microsoft Support documentation as the primary evidence source.
>
> - Vendor documentation only
> - No live authenticated Outlook session
> - No private content captured
> - Findings default to **Inferred** unless a Microsoft doc gives an explicit before/after command path
> - This run **does not replace live observation of Outlook under real task state**. It calibrates Section 5 conceptually but does not carry the same evidence strength as PT0 or PT1.

Primary sources used:
- `support.microsoft.com/en-us/office/use-the-simplified-ribbon-44bef9c3-295d-4092-b7f0-f471fa629a98` (incl. Microsoft's side-by-side comparison image)
- `support.microsoft.com/en-us/office/simplified-ribbon-reference-792ddf33-8b10-4265-a001-8e81cdfeb74a` (the Classic→Simplified reference guide)
- Microsoft documentation on recall-message paths in both ribbon modes
- Microsoft documentation on add-ins / More apps / pinning
- Microsoft Q&A community discussions on new Outlook ribbon customization

## Summary

**Section 5 result: Fail on three Highs (Hidden classification), not on Removed.**

This is the substantive correction to the earlier draft of PT2: **no clean Removed case was produced.** Microsoft's documentation supports a reading of the Simplified Ribbon as a **delayed / hidden power model**, not a removed-power model. Every command Microsoft documents as "not on the Simplified Ribbon" is reachable via at least one alternate path (Tell Me search, dropdown arrow on a related button, `...` overflow, right-click in the navigation pane). The path costs vary, but the capability is preserved.

Six findings. Distribution: **0 Critical, 4 High, 2 Medium.** Two open questions. Section 5 fails on the 3-High threshold, not on a Critical.

Hard-failure pattern check:
- ✅ UI looks simple, user hunts (CL-16 Tell Me search, CL-17 `...` overflow, CL-15 Folder-tab discoverability loss)
- ⚪ AI summary increases trust burden — not exercised
- partial Low-load mode unreachable from constrained state (CL-18 unlabeled toggle caret)
- ⚪ **Simple mode removes power** — **not conclusively observed on this evidence base.** Outlook may not be a true Removed target. v0.3's Removed sub-distinction recommendation is **deferred** pending a live-observed Removed case on a different target.

---

## Classic vs Simplified comparison (per Microsoft's documented mapping)

| Feature | Classic path | Simplified path | v0.2 taxonomy | Severity |
|---|---|---|---|---|
| Frequently used commands | Visible across grouped rows | Single line, most-used commands inline | **Compressed** | Pass / Low (design intent) |
| New Email + New Items | Two separate buttons | `New Email` with dropdown arrow exposing "New Items" | **Compressed** | Low |
| Recall this message | Message → Actions → Recall This Message | Message → **More commands `...`** → Actions → Recall This Message | **Delayed** | Medium |
| Less-used commands generally | Visible inline on relevant tab | Behind `...` overflow OR Tell Me search OR dropdown arrow | **Hidden** | High |
| Read Aloud / Rules / Respond with Meeting | Inline on Home tab | Inside `...` overflow per Microsoft | **Hidden** | High |
| Add-ins | Inline ribbon or action-bar access | Behind "More apps" / Apps; pinnable to ribbon | **Hidden → restorable** | Medium |
| Ribbon-tab "Folder" | Present on Classic tab row | Absent from Simplified tab row; commands reachable via right-click, `...`, Tell Me | **Hidden** (tab-level layout change; capability preserved) | High |
| Ribbon customization (granular) | File → Options → Customize Ribbon (custom tabs, groups, reorder) | New Outlook: "customize commands shown in the simplified ribbon" via pin/unpin | **Hidden / reduced customization shape** (not Removed; basic customize-by-pin remains) | Medium |
| Toggle Simplified ↔ Classic | n/a | Downward caret in lower-right of ribbon (unlabeled) | **Configuration cost** | Medium |

**Distribution: 2 Compressed, 1 Delayed, 5 Hidden, 0 Removed, 1 configuration-cost.** No Removed observations from this evidence base.

---

## Finding CL-15 — Folder tab is absent from Simplified Ribbon tab row

Severity: **High**
Section: Power Preservation (Section 5)
Surface: Outlook ribbon tab row
Load displaced to: `memory` + `search` + `navigation`
**Section 5 taxonomy: hidden** (tab-level layout change; capabilities preserved via other entry points)

Issue:
Microsoft's official Classic-vs-Simplified comparison image shows Classic with seven tabs — File / Home / Send-Receive / **Folder** / View / Developer / Help. Simplified has six — File / Home / Send-Receive / View / Developer / Help. The Folder tab is not present in Simplified. Folder commands (New Folder, Rename, Move, Mark All Read, Run Rules on This Folder, Recover Deleted Items, Properties) remain reachable via right-click on the folder in the navigation pane, via the `...` overflow on Home, or via Tell Me search.

Why it matters:
This was previously classified as Removed-with-workaround. The honest reading per the Microsoft documentation is **Hidden** — the tab is gone as a visual entry point but every capability under it is reachable via alternate paths. Discoverability for users who learned "Folder operations live on the Folder tab" drops; capability is preserved. The displacement is from recognition (scan the tab row) to recall (know where the right-click is, or what to type into Tell Me).

Evidence:
**Observed** — Microsoft's comparison image at the "Use the Simplified Ribbon" Support article. Direct visual inspection confirms tab-row difference.

Fix:
Restore the Folder tab in Simplified Ribbon, OR provide a persistent labeled affordance equivalent to it (e.g., a "Folder actions" pill near the navigation pane). Right-click in the nav pane is acceptable as a power-user path but is not a discoverable substitute for a labeled tab.

---

## Finding CL-16 — Hidden commands reachable only via "Tell me what you want to do" search

Severity: **High**
Section: Power Preservation (Section 5) + Hidden Load (Section 2)
Surface: Simplified Ribbon, all Outlook views
Load displaced to: `memory` + `search`
**Section 5 taxonomy: hidden**

Issue:
Microsoft's documented first-line guidance for "buttons that don't fit on Simplified Ribbon" is: "Type the command you need in the Tell me what you want to do box at the top of your screen." For commands not visible on the Simplified Ribbon, the first-documented path is to know the command's name and type it.

Why it matters:
The user must **recall** the command's name to find it. Recognition is impossible — there's no visible affordance to scan. For a user who learned Outlook in the Classic Ribbon era, every command they used to scan for visually now requires typing. For a new user, the command effectively doesn't exist until someone tells them what it's called.

Evidence:
**Observed** — Microsoft documentation explicitly: "If you don't see a button that you need on the Simplified Ribbon, you have several options. Type the command you need in the Tell me what you want to do box at the top of your screen."

Fix:
Treat Tell Me as a SUPPORT mechanism, not a primary access path. Every command discoverable only through Tell Me should ALSO be available via visible affordance (dropdown arrow, `...` overflow, or a "more actions" panel that opens without requiring command-name recall).

---

## Finding CL-17 — `...` overflow at far right of Simplified Ribbon contains Rules, Respond with Meeting, Read Aloud

Severity: **High**
Section: Power Preservation (Section 5) + Hidden Load (Section 2)
Surface: Simplified Ribbon `...` overflow
Load displaced to: `memory` + `search`
**Section 5 taxonomy: hidden**

Issue:
Microsoft documents that "other commands can be found by clicking the three dots at the far right of the Simplified Ribbon. For example, from the Inbox, you can find a variety of buttons like Rules, Respond with Meeting, and Read Aloud." Rules is a power feature for inbox automation; Respond with Meeting is a common email-to-meeting workflow; Read Aloud is an accessibility feature.

Why it matters:
Two of the three named commands behind the `...` are themselves cognitive-load-relevant: **Rules** is how power users automate inbox triage, and **Read Aloud** is an accessibility feature for users who need audio. Hiding an accessibility feature behind a `...` menu in a UI that is sold as "simplified" creates a recursive Cognitive Load Law trap — the user with a reading difficulty must do MORE recall to reach the feature designed to help them.

Mitigation worth noting: Microsoft does support pin/unpin on the Simplified Ribbon. A user can pin Read Aloud out of `...` overflow and onto the visible ribbon. This is a Hidden-with-restoration shape — the discoverability problem is real for first-encounter users; experienced users can fix it for themselves.

Evidence:
**Observed** — Microsoft documentation, see CL-16 source.

Fix:
Pin accessibility features (Read Aloud, Immersive Reader, high-contrast toggles) outside the `...` overflow by default. The pin/unpin mechanism already exists; the default state for accessibility-critical commands should be pinned.

---

## Finding CL-18 — Switch-back to Classic Ribbon is an unlabeled caret in lower-right of ribbon

Severity: **Medium**
Section: Configuration Cost (Section 6) + State Shift (Section 3)
Surface: Simplified Ribbon top chrome
Load displaced to: `memory` + `visual decoding`
**Section 5 taxonomy: n/a**

Issue:
Microsoft documents the switch path between Classic and Simplified as: "click the downward pointing caret in the lower right corner of the full, classic ribbon to collapse it to the Simplified Ribbon ... You can turn off the Simplified Ribbon and return to the expanded, classic ribbon by clicking the downward caret on the right side of the ribbon." Both paths rely on finding a small caret icon in a ribbon corner. It is unlabeled.

Why it matters:
A user in Simplified Ribbon who decides they need the full ribbon must find an unlabeled caret in a specific corner. Section 6: "Are controls *contextual to the work* rather than global-only?" The caret IS contextual (on the ribbon itself), which is good. But unlabeled + small fails the visual-decoding aspect.

Evidence:
**Inferred** — Microsoft documentation describes the caret position; no screenshot of just the caret. Unlabeled inferred from absence of label description.

Fix:
Replace the caret with a labeled toggle button. Or surface the toggle in the View tab where users expect display options.

---

## Finding CL-19 — Granular ribbon customization is reduced (not removed) in new Outlook + Simplified

Severity: **Medium**
Section: Configuration Cost (Section 6) + Power Preservation (Section 5)
Surface: ribbon customization affordances
Load displaced to: `configuration` + `feature loss` (partial)
**Section 5 taxonomy: hidden** (basic customization preserved via pin/unpin; granular custom-tab / custom-group authoring is reduced)

Issue:
Classic Outlook desktop offers a full Customize Ribbon dialog (File → Options → Customize Ribbon) where users can create custom tabs, custom command groups, reorder ribbon elements, and export/import configurations. In **new Outlook** with the default Simplified Ribbon, customization is reduced to **pin/unpin of individual buttons** on the Simplified row. Per Microsoft's docs, users "can customize commands shown in the simplified ribbon" — meaning the basic customization affordance exists, just in reduced form.

Why it matters:
This was previously classified as Removed-without-equivalent / Critical. That was an overclaim. The honest reading: **customization exists, but only in a reduced shape** (pin/unpin instead of custom-tab authoring). For power users who built Classic Outlook ribbon configurations over years, the migration path is constrained — they can pin/unpin individual buttons but not re-create custom tabs or groups. This is a meaningful capability gap, but it is not "Removed" — it is **a reduced-shape Hidden case**, where the granular authoring path is gone but the basic customization concept still operates.

Evidence:
**Inferred** — based on Microsoft Q&A community responses ("The new Outlook defaults to a Simplified ribbon and has more limited ribbon customization today - primarily switching between Simplified and Classic") and Microsoft documentation on what pin/unpin offers. Direct verification would require a signed-in new Outlook session.

Fix:
Surface a "Customize Simplified Ribbon" dialog in new Outlook that supports at least: create a custom group of pinned buttons under a custom name; reorder pinned buttons; export/import pin configurations. Custom tabs (full new top-level tab) can be deferred. The middle-tier customization is what power users notice as missing.

---

## Finding CL-20 — Vendor-published "Simplified Ribbon reference" guide is meta-evidence of Hidden classification

Severity: **Medium**
Section: Power Preservation (Section 5) + Hidden Load (Section 2)
Surface: Microsoft Support documentation surrounding Simplified Ribbon
Load displaced to: `memory` + `search` + `verification`
**Section 5 taxonomy: hidden** (meta — vendor publishing a compensation doc IS structural evidence of Hidden severity)

Issue:
Microsoft publishes a separate Support article — `support.microsoft.com/en-us/office/simplified-ribbon-reference-792ddf33-...` — titled "Simplified Ribbon reference" whose stated purpose is to help users find buttons that moved when they switched from Classic to Simplified. Five command categories (Inbox / Message / Calendar / Contact / Task) each pair Classic-named menu items with Simplified Ribbon locations via screenshot.

Why it matters:
The very existence of this guide is an admission by the vendor that recognition has been displaced to recall. If Microsoft believed the Simplified Ribbon preserved discoverability, no reference guide would be needed. The guide exists because users cannot find their buttons. This is the Cognitive Load Law turned into a documented vendor artifact — load was moved from the working interface to documentation. This is the **meta-evidence pattern** worth naming in the rubric: a vendor's external how-to docs are structural evidence of Hidden classification.

Evidence:
**Observed** — direct read of the reference guide. Five command-category tables exist, each mapping Classic to Simplified.

Fix:
Inline the reference-guide mappings — first-run tooltips, "you used to find X here" annotations, Tell Me search results that highlight on-ribbon locations with a visual pulse, a Simplified Ribbon onboarding tour. The reference-guide-as-PDF is a documentation patch over a UI issue.

---

## Section 5 taxonomy validation — second pass, honest version

The earlier draft of PT2 produced two "Removed" findings (CL-15 Folder tab, CL-19 ribbon customization) and treated them as calibration evidence for splitting Removed into `removed_with_workaround` and `removed_without_equivalent`. **That was an overclaim.** Both findings reclassified above:

- **CL-15** is Hidden — Folder commands remain reachable through right-click, `...`, and Tell Me. The tab-row layout is the only thing that changed.
- **CL-19** is Hidden / reduced-shape — pin/unpin customization exists; the gap is in the granular custom-tab / custom-group authoring that Classic Outlook desktop provided.

**Outlook's Simplified Ribbon, on this evidence base, is a delayed / hidden power model — not a removed-power model.** No clean Removed observation was produced.

**Implication for v0.3:** the proposed `removed_with_workaround` / `removed_without_equivalent` sub-distinction is **deferred**. It may still be the right refinement, but it has not been validated by a real live-observed Removed case. PT2-doc-fallback cannot calibrate the Removed severity because it did not produce a Removed finding.

**The four hard-failure patterns across PT0 / PT1 / PT2:**

| Pattern | PT0 | PT1 | PT2-doc-fallback |
|---|---|---|---|
| UI looks simple, user hunts | ✅ | ✅ | ✅ |
| AI summary increases trust burden | ✅ | ⚪ | ⚪ |
| Low-load mode unreachable from constrained state | ✅ | ⚪ | partial |
| **Simple mode removes power** | ⚪ | ⚪ | **not conclusively observed** |

The fourth pattern is still uncalibrated. A future PT3 on a target that exhibits true Removed (a strict-subset "lite" tier, a feature-stripped mobile app, an enterprise vs free split, etc.) is needed before v0.3 commits to the sub-distinction.

---

## Open question OQ-06 — CL-19 not verified via signed-in new Outlook session

The reclassification of CL-19 from Critical Removed to Medium Hidden/reduced rests on Microsoft Q&A community responses describing pin/unpin as the documented customization path in new Outlook. Direct verification (sign in, attempt to create a custom tab in Simplified Ribbon, confirm absence) was not performed. The Hidden classification is defensible from the docs, but the precise shape of the reduced customization (does new Outlook allow group naming? group reordering? what exactly is gone vs preserved?) is not pinned down.

Resolution path: sign into new Outlook (consumer or business), enable Simplified Ribbon, traverse File → Options / Settings for customization affordances, attempt to create a custom tab or group. Promote CL-19's evidence state from Inferred to Observed and refine the Hidden-vs-reduced description.

## Open question OQ-07 — Live Outlook surface not exercised

All findings draw on Microsoft's canonical documentation (Observed for Microsoft articles) plus community support discussions (Inferred). Per-button measurements, keyboard-shortcut behavior, edge-case interactions (e.g., Tell Me search failure modes, what right-click on folders actually exposes in new Outlook vs Classic), and the felt cost of the various overflow paths were not directly tested.

Resolution path: re-run with a signed-in Outlook session. Capture screenshots of the actual Simplified Ribbon, exercise the toggle, the Tell Me search, the `...` overflow, per-command pin/unpin, and the customization affordances. Update findings to Observed where possible.

---

## Auditor notes / Rubric calibration

**This run is doc-fallback, not full PT2.** The auth gate changed the evidence class. Microsoft's docs are valid vendor-authoritative evidence — strong for what they cover — but they do not replace live observation of Outlook under real task state. Findings are documentation-grounded but not dense-state verified.

**The first draft of PT2 overclaimed Removed.** I produced CL-15 and CL-19 as Removed findings (one with-workaround, one without-equivalent) and treated them as v0.3 calibration evidence. On the user's correction-pass, both reclassify to Hidden — the underlying capabilities are preserved through alternate paths. Outlook's Simplified Ribbon is a Hidden/Delayed power model, not a Removed one. **The audit's discipline must be to not manufacture findings.** The Inferred evidence state is precisely the brake against this — if I had marked CL-19 Inferred from the start and re-checked against the docs, I would have seen the pin/unpin path that disqualifies the Critical / Removed-without-equivalent reading.

**Section 5's "Removed" category still needs a real calibration target.** v0.3's sub-distinction recommendation is deferred. A future pressure test on a target with true feature subsetting — likely a "lite" SaaS tier, an enterprise-vs-consumer split, or a feature-stripped mobile app — is the standing next step before v0.3 commits to splitting Removed into two shapes.

**The Cognitive Load Law moment in CL-20 still stands.** Microsoft publishing a separate reference guide because users couldn't find their buttons IS structural evidence of Hidden classification, regardless of how the per-command findings reclassify. This is worth folding into the rubric as a documented Hidden meta-evidence pattern.

End of PT2 (documentation fallback).
