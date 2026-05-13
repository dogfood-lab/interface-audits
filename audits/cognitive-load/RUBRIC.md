# Cognitive Load Audit

> **Cognitive Load Law**
>
> A product may reduce visible complexity only when it preserves user control, source access, task progress, and feature discoverability. Any simplification that forces the user to search, trust, remember, verify under strain, or lose access to necessary functions is not load reduction. It is **load displacement**.

> This audit does not ask whether an interface looks simple. It asks **where the cognitive work went**.

## Purpose

Most accessibility audits answer "is this readable?" This one answers "is this *governable* under cognitive constraint?" — at the typography layer, the architecture layer, the AI layer, and the configuration layer.

It is intended for:
- Product reviews of tools where power matters (creative software, research systems, dev tools, AI workbenches, dashboards, editors, control planes)
- Self-audits by teams shipping interfaces used in dense, real-world conditions
- Calling out load displacement disguised as minimalism

It is **not**:
- A WCAG conformance scan (use axe, Lighthouse, Pa11y for that)
- A subjective "looks clean" review
- A neurodivergent-only feature list — cognitive bandwidth varies for every user across illness, fatigue, stress, recovery, and time of day; this audit treats state-variation as the baseline, not the edge case

## How to use this audit

1. Define the **target**: URL, app flow, screen, or component.
2. Define the **state**: empty, normal, dense, worst-case (e.g. a dashboard with 47 active items, an inbox with 12k unread, a doc with 8 tracked-change layers). The audit must be run against the realistic dense state — this is Section 7.
3. Walk the eight sections in order. Each section produces zero or more findings.
4. Score each section: **Pass / Warn / Fail**. A Fail in any section blocks "Cognitive Load Audited" status.
5. Output findings in the format specified at the end of this document.

Sections are ordered by what the team most directly controls (text, defaults) to what is most architectural (power preservation, evidence).

---

## Section 0 — Text Load

**Purpose.** The intrinsic-load surface the team actually controls: labels, errors, hints, empty states, onboarding, confirmation copy, system messages.

**Failure modes.**
- Jargon or internal terminology surfaced to users
- Sentences over ~20 words in interface copy
- Error messages that describe the system's state instead of the user's next action
- Multi-clause confirmations ("Are you sure you want to discard your changes and...")
- Empty states that explain marketing instead of the next step

**Audit questions.**
- Are system messages, button labels, error texts, and hints under 14 words where possible? (Comprehension drops sharply above 20.)
- Does every error tell the user what to *do*, not just what went wrong?
- Is there a single owner for UX copy, or does it leak across PM/designer/engineer with no consistency?
- Are confirmations scoped to one decision per dialog?
- Could a tired user, reading the screen for the first time today, act without rereading?

**Standards / research anchors.**
- WCAG 2.2 3.1.5 Reading Level (AAA, but a useful target)
- Graesser et al. 2011 on sentence complexity; comprehension falls from ~90% at 14 words to <10% at 43

**Automation.** Partial. Sentence length and reading grade can be linted on extracted strings. Tone, specificity, and action-orientation require judgment.

---

## Section 1 — Measurable Defaults

**Purpose.** The empirically settled layer. Typography, spacing, contrast, size, reflow, line length. These are quantifiable and codified.

**Failure modes.**
- Body text under 16px on web, under 14pt on desktop, with no resize affordance
- Line height under 1.5× font size for body text
- Letter tracking, word spacing, or paragraph spacing below WCAG 1.4.12 minimums
- Contrast ratios under 4.5:1 for body text
- Line length over ~80 characters with no reflow control
- Decorative typefaces in work-critical surfaces (errors, form labels, primary actions)
- Layout breaks at 200% text zoom

**Audit questions.**
- Does body text meet WCAG 2.2 1.4.12 spacing minimums? (line-height ≥ 1.5×, paragraph ≥ 2×, letter-tracking ≥ 0.12×, word-spacing ≥ 0.16× of font size)
- Does the layout reflow without horizontal scroll at 320 CSS px? (WCAG 2.2 1.4.10)
- Does text scale to 200% without content loss or overlap? (WCAG 2.2 1.4.4)
- Is contrast ≥ 4.5:1 for body, ≥ 3:1 for large text and meaningful non-text? (WCAG 2.2 1.4.3, 1.4.11)
- Is the default font a clean, familiar sans-serif or serif at readable size — or did marketing pick a decorative face for the work UI?

**Standards / research anchors.**
- WCAG 2.2 1.4.3, 1.4.4, 1.4.8, 1.4.10, 1.4.11, 1.4.12
- Nielsen Norman Group on legibility (2015)

**Automation.** Yes. axe-core, Lighthouse, Pa11y, and the WCAG 2.2 spacing-bookmarklet cover most of this. This section is the cheapest half of the audit — the leverage is the next six sections.

---

## Section 2 — Hidden Load

**Purpose.** Where visual simplicity creates searching, remembering, guessing, or mode confusion. The Sarkar critique: minimalism that hides essential functions doesn't reduce load — it displaces it into the user's working memory.

**Failure modes.**
- Core task actions behind an icon-only rail with no labels (Gmail-style collapsed nav for tasks the user does hourly)
- Right-click or hover-only affordances for non-decorative features
- Mystery-meat icons without tooltips, aria-labels, or first-use labels
- Mode switches with no visible indicator of current mode
- Search-only navigation in dense data products (forcing recall over recognition)
- Settings, switches, or filters that ghost back to default after page reload without warning

**Audit questions.**
- For the five most common tasks, how many clicks/keystrokes/scans does a user need to reach the action? Are any hidden behind hover, right-click, or unlabeled icons?
- Is there any feature the team would consider "core" that a new user could not locate within 60 seconds of inspection?
- Does the interface have modes (edit/view, read/write, public/private)? Is the current mode unambiguously visible?
- If a user came back after a week away, would they need to relearn where anything lives?
- Does anything important live *only* in search results, command palette, or keyboard shortcut?

**Standards / research anchors.**
- Sarkar 2023, *Should Computers Be Easy To Use?*
- Nielsen heuristic #6: Recognition rather than recall

**Automation.** Partial. Click-depth, icon-only buttons without aria-label, hover-only triggers, and missing landmarks can be flagged statically. "Is this feature core?" requires judgment.

---

## Section 3 — State Shift

**Purpose.** Whether the same user can downshift today, from inside the current task, in one action. Cognitive bandwidth varies by state, not just by user type. The audit's strongest single test: can the interface degrade gracefully into its own configuration?

**Failure modes.**
- Density / focus / simplified modes that require navigating to Settings → Preferences → Display → ... to toggle
- "Quiet mode" or "focus mode" features that exist but live three menus deep
- Configuration that requires re-login, restart, or page reload to take effect
- Preference changes that don't persist across sessions (forcing reconfiguration each time bandwidth dips)
- No way to revert a state-shift action without redoing it manually

**Audit questions.**
- Is there a one-action path from the working surface to a simplified / lower-density / focus mode? (Keyboard shortcut, persistent toggle, or single-click control near the work itself counts. A buried settings page does not.)
- Once activated, does the simplified state persist across sessions until the user reverts it?
- Can the user enter the simplified state *from within* a task without losing position, scroll, or selection?
- Does the interface remember the user's previous preference set, so a user who reconfigured at 8am with brain fog isn't reconfiguring again at 8pm?
- Is the control to *exit* the simplified state as discoverable as the entry? (Asymmetry traps users in the wrong mode.)

**Standards / research anchors.**
- Anderson 2025 on within-individual cognitive-state variation
- Salyha & Sytnyk 2025 on user-controlled interface adaptation

**Automation.** No. Runtime, behavioral check.

---

## Section 4 — AI Compression Risk

**Purpose.** Whether AI simplification preserves source access, omissions, reversibility, and user control. The failure mode unique to AI-mediated interfaces: load is displaced from "read the dense source" to "trust the compression."

**Failure modes.**
- AI summary with no link to the source, or a link that loses position within the source
- No indication of what the AI removed, paraphrased, or merged
- Single-click expansion of source not available — user must re-find original
- AI "simplify" or "shorten" actions that overwrite the original instead of producing a reviewable side-by-side
- No confidence indicator, no provenance for claims, no way to flag hallucination
- Adaptive behavior (e.g. interface auto-simplifying based on detected state) without user awareness or opt-out

**Audit questions.**
- Is every AI-generated summary, paraphrase, or simplification reversible in one action, with the original recovered at full fidelity?
- Is the source of any AI claim reachable in one action, scrolled to the relevant section?
- Can the user inspect what was removed or compressed? ("Show me what you cut.")
- For any adaptive behavior (auto-simplification, content reduction, layout change based on detected state): is the adaptation visible, attributable, and opt-out-able?
- If the AI is wrong, how does the user know? How do they recover?

**Standards / research anchors.**
- Anderson 2025 on opt-in adaptation and transparency
- The Cognitive Load Law: forced trust is displaced load

**Severity classification for this section.**

AI Compression Risk is **Critical** when the user provided a source, the system fetched a source, the UI implies source grounding, or the output replaces an inspectable source with an uninspectable summary. For general model generation without a claimed or visible source, classify as **provenance ambiguity** (Medium / High) unless source recovery was promised.

| Case | Classification |
|---|---|
| User uploads/pastes source, AI summarizes, no source return | Critical |
| AI uses web search / research mode, no citations or source recovery | Critical |
| UI suggests source-grounded mode is active, no evidence path | High / Critical depending on the promise |
| General model answer with no source claim, no recovery affordances | Medium / High provenance ambiguity |
| AI summary with "show source / show removed / revert" | Pass or Low |

This prevents the audit from over-firing on every unsourced model answer while preserving the Critical bar for the cases that genuinely displace load to forced trust.

**Automation.** No. Requires inspecting the AI feature design.

---

## Section 5 — Power Preservation

**Purpose.** Whether low-load modes compress the same product power, or quietly become a weaker product. The architectural commitment: density modes are profiles over one surface, not separate products.

**Failure modes.**
- "Simple mode" or "beginner mode" that removes features rather than compressing their presentation
- Mobile version that is a strict feature subset, with no path to desktop functionality from mobile
- "Lite" or "basic" tier where lower cognitive overhead requires giving up capability
- Power features only accessible to users who can tolerate the dense default — a tax on bandwidth
- Two separate codebases for the same product at different complexity levels (the giveaway: they drift)

**Audit questions.**
- If a user toggles to a simpler view, can they still complete every task they could in the dense view? (Slower is fine. Impossible is not.)
- Is there any feature a user must accept high cognitive load to access? If so, justify it.
- Do simplified, focus, and dense modes operate on the same data, the same shortcuts, the same primitives — or are they parallel products?
- Are power users penalized in the simplified mode (e.g. losing keyboard shortcuts, batch actions, advanced filters)?

**Standards / research anchors.**
- Salyha & Sytnyk 2025 on the minimalism-vs-functionality dilemma
- Sarkar 2023

**Severity classification for this section (v0.2).**

Section 5 findings classify the power-feature delta against four sub-states. This is the result of PT1 validating that the v0.1 single-bucket Section 5 collapsed behaviors that needed different severity treatment.

| Category | Meaning | Default severity |
|---|---|---|
| **Compressed** | Same capability available with lower visual load (smaller icons, condensed labels, count truncation) | Pass / Low |
| **Delayed** | Same capability remains, but requires more steps or scrolling to reach | Medium |
| **Hidden** | Same capability remains, but discoverability drops (moves into overflow menu, gets toggled behind a button, requires recall) | High |
| **Removed** | Capability is unavailable in the simplified mode — feature gap, not compression | Critical / High depending on task centrality |

Auditors may override these defaults with justification. Each Section 5 finding **must** populate `Section 5 taxonomy:` in the finding format.

Section-Fail threshold is unchanged: 1 Critical OR 3 Highs. In practice this means a single Removed finding (Critical) or three Hidden findings on common workflows produces Fail. Compressed and Delayed findings warn the section but do not fail it.

**Automation.** No. Requires feature-set understanding across modes.

---

## Section 6 — Configuration Cost

**Purpose.** Whether the controls for reducing load are themselves easy to find and use under constraint. The recursive trap: accessibility settings that require accessibility to reach them.

**Failure modes.**
- Density / typography / contrast / theme controls buried in Settings → Account → Preferences → Display → Advanced
- Configuration UI that doesn't itself meet Section 1 (Measurable Defaults)
- Settings page that opens in a new context, losing the user's task position
- Controls scattered across multiple panels (font in one place, density in another, theme in a third)
- Per-feature configuration with no global preset (e.g. user has to set density on every panel separately)

**Audit questions.**
- From the main working surface, how many clicks to reach the most-used adaptation control (font size, density, focus mode, theme)?
- Does the settings UI itself pass Section 1? Or are accessibility controls rendered in 12px gray text?
- Can a user save a configuration as a named preset and recall it? (Critical for state-shift users.)
- Are controls *contextual to the work* (selection-aware, view-aware) rather than global-only? Global settings should be the fallback, not the only path.
- If the user is in a constrained state right now, can they reach the controls they need without leaving the constrained state?

**Standards / research anchors.**
- The recursive form of the Cognitive Load Law: configuration is itself a surface that must obey it

**Automation.** Partial. Click-depth from primary surface to accessibility controls can be measured. Quality of the controls is judgment.

---

## Section 7 — Evidence

**Purpose.** Whether the audit tested the real dense product state, not empty states or marketing screenshots. The process gate.

**Failure modes.**
- All audit findings collected against a fresh-install, empty, demo state
- "We tested it" with no record of which state, which task, which user profile
- Lab-only testing on continuous text (the cognitive load literature's known gap), not on actual dense UI
- Short-session evaluation (5-10 min) with no account for prolonged-use cognitive drift
- Single-user-type testing (typical readers only, no users in constrained states)

**Audit questions.**
- Was the audit run against the realistic dense state of the product? (Full inbox, long thread, dense dashboard, ten open panels.)
- Is the state documented per finding ("Observed in X surface with Y data volume / Z active items")?
- Did the audit include at least one user in a self-reported constrained state (post-illness, sleep-deprived, multitasking, end-of-day) — not as a proxy for neurodivergence, but as a check on the state-shift sections?
- Was the product used for more than 20 minutes continuously by the auditor? (Cognitive drift over time is invisible in short sessions.)
- Are screenshots in findings from the worst-case state, not the marketing state?

**Standards / research anchors.**
- Known gap in cognitive load literature: short-session, continuous-text bias (acknowledged in Salyha & Sytnyk 2025)
- Anderson 2025 on within-individual state variation as a baseline requirement

**Responsive / narrow-mode evidence caveat (v0.2).**

When auditing responsive layouts, the rig may not be able to render the actual narrow viewport. PT1 surfaced this: Chrome on a high-DPI Windows display clamps the window minimum well above mobile breakpoints, and `window.resizeTo()` does not reduce the inner viewport below the clamp. In these cases, **DOM and CSS-class analysis is acceptable evidence**, provided:

- Findings are marked as **Inferred** evidence state (not Observed)
- The rig limitation is documented in the scorecard's `context.viewport_render_limitation` field
- The inference cites the specific Primer / Bootstrap / framework class or component pattern being interpreted (e.g., "Primer `UnderlineWrapper` overflow component," "Bootstrap grid stacking below md breakpoint")

The cleaner paths — preferred when available — are a non-DPI-scaled rig, a headless browser (Playwright / Puppeteer) with explicit `setViewport({width, height})`, or Chrome DevTools device emulation toggled via the DevTools toolbar. Use those when feasible. The CSS-class fallback is a documented escape hatch, not a default.

**Automation.** No. Process gate.

---

## Finding format

Each finding produced by this audit takes the following shape:

```
## Finding CL-{NN} — {short title}

Severity: {Critical | High | Medium | Low}
Section: {section name}
Surface: {where in the product}
Load displaced to: {one or more from the enum below}
Section 5 taxonomy: {compressed | delayed | hidden | removed}   ← required only for Section 5 findings

Issue:
{One paragraph describing what the interface does.}

Why it matters:
{One paragraph naming the cognitive cost. Reference the Cognitive Load Law
if the displacement is non-obvious.}

Evidence:
{State, surface, dataset, user profile, screenshot reference. If this line
is empty, the finding fails Section 7 and is not yet a finding.}

Fix:
{One paragraph. Should preserve power, control, source access, and discoverability.}
```

**Severity definitions.**

| Severity | Meaning |
|---|---|
| Critical | Users in low-bandwidth states cannot complete core tasks. Or: AI compression with no source recovery path **when source was promised, claimed, fetched, or replaced** (see Section 4 severity classification). |
| High | Significant load displacement in common workflows. Configuration cost prevents reaching adaptation controls. Provenance ambiguity in confident model output. |
| Medium | Measurable defaults miss WCAG 2.2 thresholds. Hidden load in non-core surfaces. |
| Low | Polish-level. Wording, edge-case states, secondary surfaces. |

A single Critical or three Highs in any one section produces a section-level Fail.

**Load-displaced-to enum.** The `Load displaced to:` field on a finding must use one or more of:

- `search` — user must run a query instead of recognizing
- `memory` — user must remember a label, location, or icon meaning
- `trust` — user must accept output without ability to verify
- `verification` — user must leave the surface to confirm a claim
- `navigation` — user must traverse multiple pages or surfaces
- `configuration` — user must change settings to use the surface
- `source recovery` — original source is hidden or stripped from output
- `visual decoding` — typography, density, or contrast force decoding effort
- `time` — task that should be near-instant takes measurable seconds
- `recovery / undo` — user must reconstruct work after a destructive or lossy action
- `feature loss` — capability is removed rather than compressed

This is the audit's heart. Findings with vague displacement targets are weaker findings.

---

## Automatable vs judgment cut

| Section | Scanner-checkable | Skill / judgment required |
|---|---|---|
| 0. Text Load | Partial (sentence length, reading grade) | Yes (tone, action-orientation, ownership) |
| 1. Measurable Defaults | Yes (axe, Lighthouse, WCAG 2.2 1.4.12) | Partial (face choice, line length) |
| 2. Hidden Load | Partial (click-depth, missing labels) | Yes ("is this core?") |
| 3. State Shift | No | Yes |
| 4. AI Compression Risk | No | Yes |
| 5. Power Preservation | No | Yes |
| 6. Configuration Cost | Partial (click-depth to settings) | Yes (control quality, contextuality) |
| 7. Evidence | No | Yes (process check) |

This audit is not "run axe and call it done." Existing accessibility scanners already cover much of Section 1 and parts of 0, 2, and 6. The leverage is the six sections they cannot touch.

---

## Running this as a skill

The skill that runs this audit lives at [`skill/SKILL.md`](skill/SKILL.md). It walks the rubric defined above and produces three outputs: `cognitive-load-findings.md`, `cognitive-load-scorecard.json`, `remediation-priority-list.md`.

**Hierarchy.** The rubric is canonical. The skill never invents criteria. If the rubric and the skill disagree, the rubric wins. Updates to audit criteria go in this file first; the skill is updated to match. Pressure-test outputs live under `evidence/<pt-id>/`.

---

## References

- Salyha, P., & Sytnyk, O. (2025). *Interface Design Based on Cognitive Load Theory*. Demiurge: Ideas, Technologies, Perspectives of Design, 8(2).
- Anderson, K. (2025). *Adaptive UX Frameworks for Neurodivergent Users: Integrating Cognitive Load Management into AI-Driven Interfaces*.
- Sarkar, A. (2023). *Should Computers Be Easy To Use? Questioning the Doctrine of Simplicity in User Interface Design*. CHI EA '23.
- Sweller, J. (2011). *Cognitive Load Theory*. Psychology of Learning and Motivation, 55.
- Nielsen, J. (2015). *Legibility, Readability, and Comprehension*. Nielsen Norman Group.
- World Wide Web Consortium. (2024). *Web Content Accessibility Guidelines (WCAG) 2.2*.

---

*v0.2 — frozen 2026-05-12 after Pressure Test 1 (GitHub narrow / responsive audit on research-os). Three patches over v0.1: Section 5 sub-taxonomy (Compressed/Delayed/Hidden/Removed), `Section 5 taxonomy:` finding field, and Section 7 responsive-evidence caveat. Section 5 threshold unchanged. See [`CHANGELOG.md`](CHANGELOG.md) for the diff and provenance. Pressure Test 2 candidate: a target with an explicit "lite / simple / focus" mode that actually removes features (calibrates Removed against a real example, not absence).*
