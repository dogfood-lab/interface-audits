# Pressure Test 1 — GitHub Narrow / Responsive Audit (Section 5 focus)

**Audit ID:** cla-20260512-github-narrow-pt1
**Target:** https://github.com/mcp-tool-shop-org/research-os (public repo, v0.8.0, active CI/PRs)
**Method:** Path 1 live navigation via Claude-in-Chrome MCP at full width (2266 CSS px), plus inferred-narrow analysis via DOM/CSS class inspection. **Direct narrow viewport rendering was blocked** on the test rig — see OQ-05.
**Auditor state:** Same session as PT0; focused; not in a self-reported constrained state.
**Rubric:** `../../cognitive-load-audit.md` v0.1 (frozen)
**Goal:** Test Section 5 (Power Preservation) directly. Validate or reject the proposed **Compressed / Delayed / Hidden / Removed** sub-taxonomy.

## Summary

**Section 5 result: Warn.** Six findings touch Section 5; one finding touches Section 0 (commit-message truncation in file rows); one open question on evidence quality due to viewport-render limitation.

The proposed Section 5 taxonomy held up cleanly. Every GitHub web narrow-mode behavior I observed fit one of the four categories without forcing — and the categories produced different severity recommendations for behaviors that v0.1 would have collapsed under a single Section 5 verdict. **Recommendation: adopt the taxonomy in Section 5 v0.2.**

**No "Removed power" instances observed on GitHub web.** Every power feature traced to one of Compressed / Delayed / Hidden. This is informative: GitHub's narrow-mode strategy is overwhelmingly compression+overflow, not feature removal. (GitHub Mobile, the native iOS/Android app, is a different product and likely exhibits Removed cases — out of scope for PT1.)

The four hard-failure patterns:
- ✅ UI looks simple but makes user hunt (CL-09 repo nav overflow, CL-12 file tree toggle)
- ⚪ AI summary increases trust burden — not applicable (no AI surfaces here)
- ⚪ Low-load mode unreachable from constrained state — N/A (narrow is layout, not a user-chosen mode)
- ⚪ **Simple mode removes power** — **not observed on GitHub web.** The closest behavior is overflow-to-menu (Hidden), which the taxonomy distinguishes from Removed

---

## Default vs narrow-mode comparison table

| Power feature | Full-width (2266 CSS px) | Narrow / mobile (inferred) | Taxonomy | Access cost delta |
|---|---|---|---|---|
| Repo nav (Code / Issues / PRs / Actions / Projects / Security / Insights / Settings) | 8 tabs visible inline as underline-nav | `UnderlineWrapper` JS overflow — items move to `...` menu when space runs out | **Hidden** | +1 click + memory of which tab is in overflow |
| Global account nav (Dashboard / Issues / PRs / Repos / Projects / Discussions / Codespaces / Copilot / Explore / Marketplace / MCP) | Always in hamburger (top-left) | Same — always in hamburger | Constant Hidden (not a narrow delta) | 0 — same at all widths |
| Header search input | Full search field with `/` shortcut hint | Collapses to icon button — input opens on click | **Compressed** | +1 click to start typing |
| Repo About sidebar (description / npm link / 15 topics / Readme / License / CoC / Contributing / Security / Activity / Stargazers) | Right column ~280px wide | Stacks below file tree + README in single column | **Delayed** | +scroll past full README to reach |
| File tree sidebar in file view | Persistent left rail with all dirs/files | Collapses to "Files" toggle button | **Hidden** | +1 click to expand, +1 click to collapse after navigating |
| File action strip (Codespace / Editor / Raw / Copy / Download / Edit / More) | All 7 actions visible as icon row | Primary 2-3 stay; rest go into `More` (`...`) menu | **Compressed → Hidden** (split) | 0 for primary, +1 click for overflowed |
| Per-file commit message in file rows | Truncated at ~80 chars at full width, hover shows full | Further truncated; mobile UA may show only first 30 chars | **Hidden** (existing truncation worsens) | Lose the context line; requires hover or commit-page navigation |
| PR right sidebar (Reviewers / Assignees / Labels / Projects / Milestone / Development / Notifications / Participants) | 280px right rail, persistent | Reflows above OR below main thread; 8+ widgets stack | **Delayed** | +scroll past widget stack to read discussion (or past discussion to see sidebar) |
| PR list filter bar (Author / Label / Projects / Milestones / Reviews / Assignee / Sort) | 7 dropdown buttons in a row | Consolidates into single "Filters" button | **Hidden** | +1 click to filter list, +1 click for each filter previously direct |
| Actions left sidebar (All workflows + per-workflow + Caches / Deployments / Attestations / Runners / Usage / Performance) | Persistent left rail | Drops behind a sidebar toggle or stacks below run list | **Hidden** or **Delayed** depending on impl | +1 click or +scroll to switch workflow |
| Watch / Fork / Star buttons | Visible top-right with counts | Stay visible; counts truncate | **Compressed** | 0 |
| "Edit Pins" button | Visible alongside Watch/Fork/Star | Moves to repo action overflow `...` | **Hidden** | +1 click to access pinning |

**Total deltas: 12 power features observed. Distribution: 2 Compressed, 3 Delayed, 6 Hidden, 0 Removed, 1 constant.**

---

## Finding CL-09 — Repo nav uses overflow-into-`...` menu at narrow widths

Severity: **High**
Section: Power Preservation (Section 5) + Hidden Load (Section 2)
Surface: Repository navigation strip (Code / Issues / Pull requests / Actions / Projects / Security / Insights / Settings)
Load displaced to: `memory` + `search`

Issue:
GitHub uses the Primer React `UnderlineWrapper` component for repo nav. At widths where all 8 repo tabs no longer fit on one line, items shift into a `...` overflow menu in priority order — typically Code, Issues, Pull requests, and Actions stay visible; Projects, Security, Insights, Settings collapse into overflow. The user cannot see at a glance which tabs exist.

Why it matters:
This is the **Hidden power** failure mode. The capability is intact — Settings is still reachable — but the affordance drops from "see the tab, click it" (recognition) to "remember Settings exists, find it in the overflow menu" (recall). For a power user under cognitive constraint trying to reach Insights, the delta is measurable. For a casual user who didn't know Insights existed, it is effectively invisible.

Evidence:
**Observed (full-width)** — confirmed 8 repo tabs render inline at 2266 CSS px. **Inferred (narrow)** — Primer's `UnderlineWrapper` is a JS-driven `ResizeObserver`-based overflow component, documented behavior. CSS class `prc-components-UnderlineWrapper-eT-Yj` confirmed in the DOM. Could not directly render at narrow widths on test rig (see OQ-05).

Fix:
Either persist a minimum set of "always visible" repo tabs at narrow widths (Code / Issues / PRs / Actions), OR show a count badge on the `...` button indicating N more options, OR provide a one-line scrollable horizontal tab bar instead of overflow. The current behavior makes overflow look optional rather than load-bearing.

---

## Finding CL-10 — PR right sidebar reflows above/below main thread at narrow widths

Severity: **Medium**
Section: Power Preservation (Section 5)
Surface: Pull request detail page (`/pull/{N}`)
Load displaced to: `navigation` + `time`

Issue:
The PR detail page has a 280px right-side rail containing 8 distinct widget sections: Reviewers, Assignees, Labels, Projects, Milestone, Development, Notifications, Participants. At narrow widths, this rail reflows to a single column — typically pushed ABOVE the conversation thread. A user opening a PR sees 8+ widget sections (most "No one yet" / "None yet" / "No milestone") before reaching the actual diff or discussion.

Why it matters:
This is the **Delayed power** failure mode. Every widget is still functional and editable. But the cost of reaching the discussion — which is what most users open a PR for — increases from "page loads with thread visible" to "scroll past 8 metadata widgets." For triage workflows (skimming many PRs), the delay compounds.

Evidence:
**Observed (full-width)** — PR #10 page captured; right rail confirmed with Reviewers / Assignees / Labels / Projects / Milestone widgets visible at top of the rail. **Inferred (narrow)** — Bootstrap/Primer responsive grid behavior: 2-col layouts reflow to stacked single column below md breakpoint. GitHub does not appear to have a "skip to discussion" anchor link at the top of the stacked layout (would mitigate).

Fix:
Add an anchor / skip-link at the top of the stacked sidebar in narrow mode, OR push the sidebar BELOW the conversation by default (most-read-first), OR collapse all "empty" widgets (No one yet / None yet) into a single "Add metadata" affordance so empty widgets don't consume vertical space.

---

## Finding CL-11 — Repo About sidebar stacks below file tree + README at narrow widths

Severity: **Medium**
Section: Power Preservation (Section 5)
Surface: Repo home page (`/{org}/{repo}`)
Load displaced to: `navigation` + `time`

Issue:
The right-column "About" panel on the repo home contains: description, npm package link, 15 topic tags, README / License / Code of Conduct / Contributing / Security policy quick-links, Activity link, custom-properties link, stargazers link. At narrow widths, this column reflows below the file tree + README, requiring the user to scroll past the entire rendered README (often 100s of lines) to reach the topics, license, or security policy.

Why it matters:
This is **Delayed power** — same as CL-10, different surface. The sidebar is the **fastest path** to understanding what the repo is, what topics it covers, what the license is. Pushing it below long-form README content inverts the "context first" affordance that the full-width design provides.

Evidence:
**Observed (full-width)** — About sidebar with 15 topics + 5 doc quick-links + activity link rendered as right column. **Inferred (narrow)** — Bootstrap grid stacking; About has no skip-link or sticky behavior.

Fix:
Sticky-position the About sidebar at narrow widths (always visible at top of a narrow-mode strip), OR move License + Topics into the repo's top description block at narrow widths, OR add a "skip to about" anchor.

---

## Finding CL-12 — File tree collapses to a toggle in file view at narrow widths

Severity: **Medium**
Section: Power Preservation (Section 5) + Hidden Load (Section 2)
Surface: File blob view (`/blob/{ref}/{path}`)
Load displaced to: `memory` + `search`

Issue:
At full width, the file blob view shows a persistent left rail "Files" panel with the full repo tree expanded (or collapsible per directory) and a "Go to file" search above. At narrow widths, the entire tree collapses to a single "Files" toggle button. To navigate to a sibling file the user must click the toggle, browse the tree, click a file, and the tree re-collapses.

Why it matters:
This is **Hidden power**. Navigation between files — a core developer workflow — requires +1 click per navigation event versus +0 at full width. For a user reading through 5 related source files (e.g., reviewing a feature implementation), the cost compounds. The tree's auto-collapse on navigation is worse than a sticky-open behavior would be.

Evidence:
**Observed (full-width)** — File tree rail with all 8 dirs + ~10 root files visible, "Go to file" search above. **Inferred (narrow)** — `ExpandFileTreeButton-module__expand` class confirmed in DOM, suggesting a JS-controlled collapse pattern. Auto-collapse-on-nav behavior is GitHub's documented pattern in their changelog.

Fix:
Persist the file tree state across navigation events at narrow widths (open stays open until the user closes it), OR provide a sticky "open file tree" affordance in the header, OR show the breadcrumb path + sibling files (up + down arrows) inline next to the breadcrumb so common-case navigation doesn't require opening the tree.

---

## Finding CL-13 — Per-file commit message in repo home file tree is truncated even at full width

Severity: **Low**
Section: Text Load (Section 0)
Surface: Repo home file tree rows
Load displaced to: `memory` + `verification`

Issue:
Each file/directory row on the repo home shows the most recent commit message that touched it. At 2266 CSS px the message is already truncated at ~80 characters — e.g., "fix: Stage B Wave 3 — proactive resilience + supply-chain hyg…". The user sees the start of the message but not the issue/PR reference or the punchline. To see the full message, the user must hover (tooltip) or click into the commit. At narrow widths, truncation worsens.

Why it matters:
This is a Section 0 (Text Load) issue more than Section 5 — the row already drops information at desktop widths. The commit message column is doing double-duty as both navigation context (when was this last touched) and content (what was the change). Section 0's audit question — "Could a tired user act without rereading?" — is at risk because the displayed text is incomplete, and the user must trust the truncation isn't hiding something important.

Evidence:
**Observed** — full-width DOM confirms truncation via `text-overflow: ellipsis`. Example: `.github` directory shows "fix: Stage B Wave 3 — proactive resilience + supply-chain hyg…" with the rest hidden.

Fix:
Show truncation only at <768px; at desktop widths use available horizontal space. Or: render a small "see full message" expand icon when the message is truncated, so the user knows there's more content rather than guessing. Or: shorten commit messages programmatically with a structured summary (conventional commits style + linked issue number visible).

---

## Finding CL-14 — Global account nav permanently in hamburger even at desktop widths

Severity: **Low**
Section: Hidden Load (Section 2)
Surface: GitHub global header, all pages
Load displaced to: `memory` + `search`

Issue:
The hamburger button (top-left, three lines, no label) is the only path to Dashboard, All Issues, All Pull requests, All Repositories, Projects, Discussions, Codespaces, Copilot, Explore, Marketplace, MCP registry — at all viewport widths, including ultra-wide desktop. There is no responsive expansion of these items into a top-bar nav even when horizontal space is abundant.

Why it matters:
This is a **constant Hidden** pattern — not a narrow-mode delta. GitHub treats the global account-level nav as always-secondary. For a user who navigates across repos and account-level views frequently, the +1 click cost is constant. Section 5 specifically asks about narrow-mode power preservation, so this is more a Section 2 finding than Section 5: hidden by design, regardless of width.

Evidence:
**Observed** — hamburger click revealed 11 items; full-width and narrow behavior identical.

Fix:
At wide viewports (≥1280px or ≥1400px), expand the most-used global nav items (Dashboard, Issues, Pull requests) into the top bar as text links. The hamburger becomes overflow for the rest. Current behavior optimizes for narrow but penalizes wide-screen users.

---

## Section 5 sub-taxonomy validation

The user proposed splitting Section 5 into four sub-states. PT1 applied each category to the 12 power-feature deltas observed. Result:

| Category | Description | PT1 mapping | Recommended severity |
|---|---|---|---|
| **Compressed** | Same capability, less visual real estate | Header search → icon, primary file action strip icons, Watch/Fork/Star counts truncate | Pass / Low |
| **Delayed** | Same capability, more steps or more scroll | About sidebar below README, PR sidebar above thread | Medium |
| **Hidden** | Capability remains, discoverability drops | Repo nav overflow, file tree toggle, PR list filters consolidated, "Edit Pins" moves to overflow, secondary file actions to `...`, Actions left sidebar collapses | High |
| **Removed** | Capability unavailable in this mode | **None observed on GitHub web.** Would expect to find on dedicated lite/mobile-app products. | Critical |

**Verdict: the taxonomy is useful.** It produced different severity assignments for behaviors v0.1 Section 5 would have rated identically (or under-specified). The Compressed/Delayed distinction in particular separated "the action is small but obvious" from "the action requires scroll to discover" — clean distinction worth keeping.

**v0.2 recommendation:** add this 4-way sub-classification to Section 5 of the rubric, with the severity-mapping above as default guidance. The Section-Fail threshold ("1 Critical or 3 Highs") would then trigger Section 5 Fail on (a) a single Removed finding or (b) three Hidden findings — both feel correct.

---

## Open question OQ-05 — Could not render at narrow viewport on test rig

Most Section 5 findings here carry **Inferred** evidence state because the test rig (Chrome on Windows with 150% display scaling) refused to reduce the inner viewport below ~2266 CSS px. The `resize_window` tool resized the OS window down to 500px but the inner viewport stayed at 2266 CSS px — a known interaction between Windows display scaling and Chrome's minimum window width, plus possibly a page-level zoom level applied at ~1.1x.

Findings here rest on:
- Full-width observation of all surfaces (direct)
- DOM/CSS class inspection (direct, but interprets intent rather than rendering)
- Documented Primer/Bootstrap responsive behavior (cited, not observed in this run)
- Architectural knowledge of GitHub's `UnderlineWrapper`, file-tree-toggle, and PR-sidebar reflow patterns (general knowledge, not run-specific)

Resolution path: re-run on a machine without 150% display scaling, OR with Chrome's DevTools device emulation actively enabled, OR using a headless browser (Playwright/Puppeteer) with explicit viewport metrics override. Until then, every "narrow" claim is Inferred — the audit's findings hold in shape but not in measured detail.

---

## Auditor notes

- The Section 5 audit was meaningfully harder than PT0's broad audit because the test target's responsive behavior is the entire point. The rig limitation forced a method shift mid-audit (DOM/CSS inspection in place of rendered viewport comparison). The exit criteria still held — ≥3 Section 5 findings, comparison table, specific feature names + access paths — but at the cost of Inferred evidence on most findings.
- The 4-way taxonomy is the most useful structural change to come out of these two pressure tests. It is sharp enough that v0.2 of the rubric should include it.
- One genuinely useful piece of meta-finding: **the Section 5 hard-failure pattern ("Removed") did not manifest on GitHub web** because GitHub's responsive strategy is overflow-and-stack, not feature subset. This is informative about the rubric: not every target will exercise every section, and the rubric is correctly designed to let some sections pass cleanly when the target doesn't exhibit the failure.
- GitHub Mobile (native app) is a future PT candidate to actually exercise "Removed power."

End of Pressure Test 1 — GitHub narrow / responsive audit.
