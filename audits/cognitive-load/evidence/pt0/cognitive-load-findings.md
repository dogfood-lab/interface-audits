# Pressure Test 0 — claude.ai Cognitive Load Findings

**Audit ID:** cla-20260512-claude-ai-pt0
**Target:** https://claude.ai (live web app)
**Method:** Path 1 — live navigation via Claude-in-Chrome MCP, screenshots saved as evidence assets in `./` (sibling files).
**Auditor state:** Focused session, ~1 hour in; not in a self-reported constrained state. This is itself a Section 7 limitation — see OQ-04.
**Rubric:** `../../cognitive-load-audit.md` v0.1
**Goal:** Maximize rubric coverage. Not product actionability.

## Summary

Sections Failed: **State Shift, AI Compression Risk** (2 of 8).
Sections Warned: **Hidden Load, Measurable Defaults, Configuration Cost, Evidence** (4 of 8).
Sections Passed: **Text Load, Power Preservation** (2 of 8).

Overall status: **Fail** (any section Fail = overall Fail per rubric).

Eight findings. **Two Critical, three High, two Medium, one Low.** Four open questions.

**Note on severities (re-rated post-freeze).** First pass wrote CL-03 and CL-04 as High. Mid-audit they were promoted to Critical on a literal reading of the v0.1-draft rubric. Rubric v0.1 was then frozen with a **Section 4 severity precondition** that distinguishes source-claimed cases (Critical) from generic provenance ambiguity (High/Medium). CL-04 remains Critical (web search was active — system fetched a source). CL-03 reverts to High provenance ambiguity (no source was promised, claimed, or fetched). See "Rubric calibration notes" at the bottom for the full story.

The rubric caught three of the four "hard failure" patterns specified for this Pressure Test:
- ✅ The UI looks simple but makes the user hunt (CL-01)
- ✅ AI output reduces reading but increases trust burden (CL-03, CL-04)
- ✅ The low-load mode is unreachable when the user is constrained (CL-02, CL-05)
- ⚪ The simple mode removes power — **not observed on claude.ai.** Collapsed sidebar hides visual access to chat history but does not remove features. Section 5 passes on this target; pattern remains in the rubric for other targets.

---

## Finding CL-01 — Sidebar collapse strips visual labels and removes chat history from view

Severity: **High**
Section: Hidden Load (Section 2)
Surface: Sidebar, both new-chat and active-chat states
Load displaced to: memory + recall + click-cost

Issue:
The sidebar has two states: expanded (with text labels and a scrollable Recents list of past chats) and collapsed (icon-only rail). The collapse toggle is a single click. In the collapsed state, every navigation item drops its visible label and the entire Recents list disappears from view. Visual chat history is no longer browsable — the user must either re-expand the sidebar or click the (now-unlabeled) "Chats" icon to navigate to `/recents`.

Why it matters:
This is the Sarkar / Cognitive Load Law failure in textbook form. Collapse looks like load reduction — fewer pixels, cleaner work area — but the work of identifying which icon is "Chats" vs "Projects" vs "Customize," and the work of recalling which past conversation you want, has been displaced from recognition (reading labels and titles) to recall (remembering icon meanings and chat content). The visual chat history isn't gone; it's hidden behind one more click for sighted users.

Evidence:
**Observed.** Confirmed via baseline screenshot (sidebar expanded showing 16 chat titles) and collapse screenshot (icon rail, no labels, no Recents). Accessibility tree (`read_page filter=interactive`) shows that label names and chat-link names ARE preserved in the DOM during collapse — so screen reader users retain full access. The displacement is specifically for sighted users in cognitively constrained states.

Fix:
On collapse, retain mini-labels under each icon at the next size down, OR show first-letter avatars of recent chats in the rail, OR persist a "last 3 chats" quick-list at the top of the collapsed rail. Any of these keeps recognition possible. Do not rely on tooltips alone — hover-only labels are a Section 2 anti-pattern.

---

## Finding CL-02 — No in-chat one-action low-bandwidth control

Severity: **Critical**
Section: State Shift (Section 3)
Surface: Active chat
Load displaced to: configuration + multi-surface navigation

Issue:
From inside an active chat, there is no one-action affordance to make the interface easier to read or operate. No font-size button, no density toggle, no focus mode, no quick "reduce visual noise" control. The chat surface exposes: + (files/connectors hub), model selector, voice mode, and the message field. None of these change visual or cognitive density.

Why it matters:
This is the audit's strongest single test: can the interface degrade gracefully into its own configuration? On claude.ai, no — a user already in a low-bandwidth state must leave the chat entirely, traverse a profile menu, navigate to a full-page settings route, scroll to find the right section, and operate a dropdown. The path requires the very cognitive bandwidth the user is missing. Sidebar collapse exists (one-click, persistent — see CL-09) but only changes horizontal space; it does not adjust typography, density, or noise.

Evidence:
**Observed.** Full a11y tree of active-chat surface (`/chat/f1fcc100-...`) shows no relevant controls beyond compose, +, model, voice. Confirmed against new-chat surface (`/new`) — same control set. The only chat-adjacent visual control is the sidebar collapse, which does not address typography or content density.

Fix:
Add a single in-chat affordance — keyboard shortcut + visible button — that toggles a "reading mode" with a couple of pre-defined low-bandwidth presets (larger type, higher line-height, no animations, sidebar collapsed, suggestions chips hidden). Persist the chosen preset. The control must be reachable from the chat without traversing settings.

---

## Finding CL-03 — Confident numeric output with no source-recovery or assumption-trace affordance

Severity: **High** (provenance ambiguity per Section 4 severity precondition; not source-claimed, so not Critical)
Section: AI Compression Risk (Section 4)
Surface: Existing chat `/chat/f1fcc100-...` ("How compound interest works")
Load displaced to: trust + external verification

Issue:
The chat renders an interactive widget with confident headline values (`final balance $20,194`, `interest earned $15,194`, `multiplier 4.0×`) backed by slider defaults Claude chose silently (`$5,000 starting amount, 7% annual rate, 20 years, monthly compounding`). The widget is the answer. There is no source citation, no "edit assumptions" hint distinguishing Claude's defaults from the user's question (the user asked "Show me how compound interest works" — no numbers were specified), and no way within the interface to verify the math.

Why it matters:
For numerical or factual output, the Cognitive Load Law says: forced trust is displaced load. The user under cognitive constraint cannot mentally verify $5,000 × (1.07/12)^(12×20) = ~$20,194 in their head. The only verification path is leaving the chat to use an external calculator or spreadsheet. In a low-bandwidth state, the user will simply trust the number — which is the failure mode.

Evidence:
**Observed.** Screenshot of the widget in-flow. Read of the response action bar (Retry / Edit / Copy / Copy / feedback / Retry) — no "show calculation," "show assumptions," or "verify" button. The user's original prompt was the button-styled "Show me how compound interest works"; the slider defaults appear without attribution to user vs. AI choice.

Fix:
For widget-style numeric output, label assumptions explicitly as Claude's choices (visually distinguish "default values Claude picked" from user-provided values). Add a "show calculation" affordance that opens the underlying formula and inputs. Where feasible, expose a "copy as spreadsheet" or "verify with calculator" path. Do not present generated numbers as if they were retrieved facts.

---

## Finding CL-04 — Web search runs by default with no provenance indicator in response

Severity: **Critical**
Section: AI Compression Risk (Section 4)
Surface: + menu (file/connector hub) + chat response area
Load displaced to: trust + retrieval-source ambiguity

Issue:
The + menu's "Web search" toggle is checked by default. This means a given response may have used live web retrieval, used training-data knowledge, or used both — but the response itself contains no indicator of which content was retrieved, no citations, no domain markers, and no provenance trail. The user has no way to tell the difference between "Claude knows this from training" and "Claude pulled this from a website you've never heard of."

Why it matters:
Web search on without citations is the worst case for the Cognitive Load Law's "forced trust" axis. The user cannot estimate confidence (training knowledge has different failure modes than scraped web content), cannot inspect the source's quality, and cannot follow up if they disagree. For factual or current-events questions, this is high-stakes. The setting is also persisted at the workspace level rather than per-prompt — a one-time toggle silently shapes every future response.

Evidence:
**Observed.** Screenshot of + menu with `Web search` shown checked. Inspection of compound-interest response — no citations or source markers visible. The compound-interest topic is computable from training, so this specific response may not have used web at all — but the user has no way to tell from the chat surface.

Fix:
Where a response did use web retrieval, show the retrieved domains inline next to the relevant claim, and surface a "sources" expandable block. Where a response did NOT use web (the toggle was off, or no retrieval was triggered), label the response as "from training" or simply omit the source block. The user must be able to distinguish the two states without leaving the chat.

---

## Finding CL-05 — Reaching the dyslexia-friendly font from a chat takes 4 clicks + scroll + full-page navigation

Severity: **High**
Section: Configuration Cost (Section 6)
Surface: Chat → user profile button → Settings → /settings/general → Chat font dropdown → option
Load displaced to: configuration + memory + navigation

Issue:
To switch a chat to the dyslexia-friendly font from within an active chat, the user must: (1) open the user profile menu, (2) click Settings, (3) wait for full-page navigation to /settings/general, (4) scroll past Profile section to find Preferences → Chat font, (5) open the font dropdown, (6) select "Dyslexic friendly." This is at minimum 4 clicks, one full-page route change, and one scroll. The keyboard shortcut `Ctrl+,` reduces it slightly but is only surfaced in the profile-menu hint, not on the chat surface.

Why it matters:
This is the recursive Cognitive Load Law trap: the controls for reducing load require more cognitive bandwidth to reach than the user has. A reader who needs the dyslexia-friendly font to engage with the response is exactly the reader least equipped to traverse a 4-click setup path through a different visual surface (settings is a different layout than chat). The control exists; reaching it is the problem.

Evidence:
**Observed.** Counted clicks live. Screenshot of the Chat font dropdown with "Dyslexic friendly" option visible (rendered in the OpenDyslexic face — a positive touch). Settings opens at URL `/settings/general`, replacing the chat view entirely.

Fix:
Surface a "Reading" or "Display" quick-control on the chat surface (corner of the chat header, or in the + menu) with the most-used adaptation toggles (font, size, line-height, theme). Keep the full Settings page for less-common configuration. The chat font is the highest-leverage accessibility control claude.ai ships; it should not be the deepest.

---

## Finding CL-06 — Settings opens via full-page navigation, breaking chat task context

Severity: **Medium**
Section: Configuration Cost (Section 6)
Surface: Profile menu → Settings → /settings/general
Load displaced to: navigation + recovery

Issue:
Clicking Settings replaces the chat view with `/settings/general`. The chat surface — including any in-progress message, scroll position, or active widget interaction — is no longer visible. To return, the user clicks browser back or navigates manually to the chat. Settings does not open as an overlay, drawer, or panel.

Why it matters:
Section 6 of the rubric: "Does the settings UI open in a new context, losing the user's task position?" Yes. For a user adjusting reading settings mid-conversation, this means: lose your place, change the setting, navigate back, find your scroll position again. Each step is small in isolation; together they exceed the bandwidth budget of a constrained user.

Evidence:
**Observed.** URL change verified (`/chat/f1fcc100-...` → `/settings/general`). Screenshot of settings page shows it as a full-page route with the chat completely hidden.

Fix:
Open Settings as a modal or right-side drawer overlay. Preserve the chat surface behind it. Closing the drawer should restore exact scroll position and any in-progress message text. Reserve full-page settings navigation for billing/account/destructive operations that genuinely warrant exit from the task.

---

## Finding CL-07 — No dedicated Accessibility section in Settings; reading controls bundled into General → Preferences

Severity: **Medium**
Section: Configuration Cost (Section 6)
Surface: /settings/general — left nav
Load displaced to: discovery + recall

Issue:
The settings left-nav has 9 sections: General, Account, Privacy, Billing, Usage, Capabilities, Connectors, Claude Code, Claude in Chrome. Font, theme, and voice live in General → Preferences, alongside avatar, full name, what-Claude-should-call-you, and instructions. There is no "Accessibility," "Display," "Reading," or "Appearance" top-level entry to direct users searching for adaptation controls.

Why it matters:
A user looking for "how do I make the text easier to read" cannot scan the left nav and find the answer. They must guess that font lives under "General" rather than (more intuitively) somewhere like Accessibility or Display. For users on assistive tech who use heading-level navigation to skim settings, the structure offers no help. This is the audit's "controls scattered, no dedicated hub" failure mode.

Evidence:
**Observed.** Screenshot of /settings/general left-nav. No accessibility-named section visible. Chat font is below Profile section in the General page (scroll required to reach).

Fix:
Add an "Accessibility" or "Reading" section to the settings left-nav containing font, theme, density (if added), motion-reduction, contrast options, and a save-preset affordance. Keep links from General → Preferences for backward navigation, but the primary path should be discoverable by name.

---

## Finding CL-08 — Auto-generated chat title silently rewrites the user's original question

Severity: **Low**
Section: AI Compression Risk (Section 4)
Surface: Chat header + sidebar Recents list
Load displaced to: trust + recall

Issue:
The user's actual prompt was the button-styled "Show me how compound interest works." The chat is titled "How compound interest works" — Claude generated it, the user did not write it. The original prompt is only visible if the user scrolls to the top of the conversation. From the sidebar Recents list, the user sees only the Claude-generated title, not what they asked.

Why it matters:
This is a quiet form of source-replacement. For short conversations, the difference is trivial (and a rename button is provided). For longer conversations months later, the user navigating their Recents list is reading Claude's framing of their own question, not their own framing. Memory and intent both compress through the AI's lens. Mild violation of the Cognitive Load Law: "show me what you cut" should apply to the user's own prompts too.

Evidence:
**Observed.** Compared user-input button "Show me how compound interest works" (visible at chat top after scroll-up) against chat title "How compound interest works" (in title bar and sidebar). Confirmed `button "How compound interest works, rename chat"` in a11y tree — rename is available but not surfaced unless user notices the title.

Fix:
Either (a) use the user's first prompt verbatim as the default title (truncated), or (b) label the auto-generated title visually ("auto-titled by Claude — rename") for the first N visits to the chat, until the user accepts or renames it. Preserve user-authored framing where the cost of doing so is near zero.

---

## Observation P-01 — Sidebar collapse state persists across F5 reload

Section: State Shift (Section 3)
Status: **Pass**

The collapsed/expanded sidebar state persisted across a hard reload (F5). User does not have to re-collapse on each session start. This is the correct behavior and partially offsets CL-02 — though only for the one binary control that exists.

Not tested: cross-session persistence (logout/login), cross-device persistence (mobile/desktop sync). These are open questions.

---

## Observation P-02 — Power Preservation passes on this target

Section: Power Preservation (Section 5)
Status: **Pass**

The + menu compresses 8 substantial features (Add files or photos, Take a screenshot, Add to project, Add from GitHub, Connectors, Research, Web search, Use style) into one one-click hub. The label "Add files, connectors, and more" is honest about it being a hub. Collapsed sidebar mode does not remove features — the same compose, model selector, voice mode, and + features remain. Chat content reflows to use additional horizontal space rather than being hidden.

The Section 5 hard-failure pattern (simple mode removes power) does not manifest on this target.

---

## Observation P-03 — "Dyslexic friendly" font option previews in face

Section: Text Load (Section 0)
Status: **Pass**

The Chat font dropdown renders each option in its own face — including "Dyslexic friendly" rendered in OpenDyslexic. Users can see the typography before choosing. The label uses the descriptive "Dyslexic friendly" rather than the technical name "OpenDyslexic" — better for plain-language scanning. This is a positive UX touch.

(Caveat: the descriptive label means users who specifically know to search for "OpenDyslexic" via browser find-in-page won't locate it.)

---

## Open question OQ-01 — Section 1 measurable defaults not directly instrumented

Could not measure computed CSS for `line-height`, `letter-spacing`, `paragraph-spacing`, `contrast-ratio` against WCAG 2.2 1.4.12 thresholds in this run. Visual inspection of body text in chat suggests readability is acceptable, but unmeasured.

Resolution path: run Lighthouse or axe against `/chat/*` and `/settings/general`, or use `javascript_tool` to extract `getComputedStyle()` on representative body and label elements. Re-audit Section 1 with numeric evidence.

---

## Open question OQ-02 — AI summary-of-source surface not tested

The compound-interest chat is generative (no user-supplied document). The audit did not test the case where a user pastes a long document and asks for a summary, then attempts to recover the original. This is the primary AI Compression Risk scenario and remains untested.

Resolution path: create a fresh test conversation pasting a public document (e.g., a research abstract), request a summary, then audit whether the original text is recoverable, whether omissions are visible, and whether the user can compare summary to source side-by-side. Avoided in this run to not consume the user's billed context budget on synthetic tasks.

---

## Open question OQ-03 — Cross-session persistence not tested

Sidebar state survived F5. State persistence across logout/login or across devices (mobile/desktop) was not exercised.

Resolution path: log out, log in, observe sidebar state. Open claude.ai on mobile (or a second device) signed into the same account, observe sidebar state. Out of scope for Pressure Test 0.

---

## Open question OQ-04 — Auditor not in self-reported constrained state

Section 7 of the rubric specifies that the audit should include at least one user (or auditor) in a self-reported constrained state as a check on the state-shift sections. This run was conducted by an AI auditor — not in a constrained state by any meaningful definition. The CL-02 and CL-05 findings are still observable from any state, but the "felt" cost of the 4-click settings path is not validated.

Resolution path: have a human user in a low-bandwidth state attempt the dyslexia-friendly font change from a chat and time it. Or, simulate constraint via reduced-fidelity browser (zoom, tracking-reduced eyes, fatigue) and re-attempt the same path.

---

## Auditor notes

- Live navigation worked well for Sections 2, 3, 4, 6. The interaction-dependent sections benefited materially from Path 1 over Path 2.
- The audit's Evidence rule held — three observations were revised mid-audit when better evidence arrived (e.g., the initial "chat list links have no a11y labels" claim was retracted after `find` retrieved them).
- The rubric did not develop obvious gaps during the run. Section ordering held; severity rules held; finding format was workable.
- One section (Section 1) collected no first-hand measurements — a Path 1 audit without DevTools / Lighthouse can confirm UI but not metrics. Pair Path 1 with a scanner pass for full Section 1 coverage.

---

## Rubric calibration notes

This is the section that should feed back into `cognitive-load-audit.md` v0.2.

**Severity-line tension (resolved in v0.1 freeze).** First pass wrote CL-03 and CL-04 as High. Mid-audit they were promoted to Critical on a literal reading of the draft Critical definition: *"AI compression with no source recovery path."* That over-fired — every unsourced model answer would have qualified. User feedback added a **Section 4 severity precondition** to the frozen v0.1 rubric: Critical applies only when source was promised, claimed, fetched, or replaced. Under the frozen rule: CL-04 stays Critical (web search active = source fetched), CL-03 is High provenance ambiguity (no source claim). This is the calibration story for v0.1.

**Section-Fail threshold held up.** "1 Critical or 3 Highs = section Fail" produced 2 section Fails (State Shift, AI Compression Risk) — both legitimate. The Configuration Cost section has 1 High + 2 Medium and lands at Warn, which feels right; the friction is real but the user can complete configuration. Threshold did not over- or under-fire.

**Section 7 is doing useful work.** OQ-04 (auditor not in a constrained state) was caught only because Section 7 demands it. Without the section, the audit would have implicitly claimed validation of State Shift findings from a fully-bandwidth-equipped auditor. Worth keeping the section, possibly worth elevating "auditor state" to a required field on the scorecard rather than a soft check.

**One pattern not exercised.** Section 5 (Power Preservation) found no violations on this target. The rubric's framing — "simple mode removes power vs. compresses power" — is correct and would have caught violations on, e.g., a "lite" pricing tier or a feature-stripped mobile app. claude.ai's sidebar-collapse is power-preserving by design. The rubric correctly passes this target on Section 5 rather than forcing a finding.

**No new rubric section seemed obviously missing.** Every finding mapped to one of the eight. The closest candidate for a new section would be something like "Source replacement / prompt provenance" (CL-08), but that fits comfortably under AI Compression Risk as a sub-pattern. Keep at 8 sections for v0.2.

**Load-displaced-to enum (added to v0.1 freeze).** The first-pass findings filled the `Load displaced to:` field with freeform values. User feedback added an 11-value enum to the frozen rubric so findings stay comparable across audits and across teams: `search | memory | trust | verification | navigation | configuration | source recovery | visual decoding | time | recovery / undo | feature loss`. Findings written before the enum used overlapping terms (e.g., "memory + recall" — recall is a form of memory load) — future audits will collapse to the enum.

End of Pressure Test 0 — claude.ai live audit.
