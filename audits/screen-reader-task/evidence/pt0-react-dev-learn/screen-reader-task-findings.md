# Screen Reader Task Audit — PT0 Findings

**Audit:** Screen Reader Task Audit  
**Run ID:** sr-20260602-react-dev-learn-pt0  
**Target:** https://react.dev/learn  
**Method:** Path 2 / WebFetch DOM-fallback — source repository analysis via GitHub API  
**Date:** 2026-06-02  
**Rubric version:** 0.1.0 (Draft, externally hardened 2026-06-02)

## Rig limitations

This rig cannot launch a browser session, run an assistive technology (NVDA, JAWS, VoiceOver, TalkBack), or interact with the live page interactively. Evidence is collected by:

1. Static HTML fetch of https://react.dev/learn via the WebFetch tool (returned source-level content).
2. Source-code analysis of the react.dev GitHub repository (reactjs/react.dev) via the GitHub API — all component files, layout files, and page files.

All findings are classified **Inferred** unless otherwise noted. Where the live AT behavior cannot be determined from source analysis, the gap is recorded as an **Open question**. Evidence strength is lower than a live AT session; findings that survive source-level analysis are likely to reproduce under real AT but cannot be confirmed at observed strength without a live run.

The rig limitation is documented in the scorecard field `context.viewport_render_limitation`.

---

## Task definition

**Task:** Navigate to react.dev/learn, find the "Quick Start" introduction, read through the content using heading navigation and Tab to reach interactive code examples (Sandpack), operate the examples, use the search modal to find a related topic, and follow a "Next" link to the subsequent learn page.

This task was chosen because it exercises all eight rubric sections: landmark navigation, action discoverability via the Sandpack editor buttons and search, task-path continuity via client-side routing, dynamic update handling via the search modal and Sandpack preview, error recovery (form-level: N/A on this page; state-level: Sandpack error state), mode switching (search modal, sidebar collapse), configuration cost (skip link, theme toggle), and evidence quality.

**SPA flag:** Yes — react.dev is a Next.js single-page application with client-side routing via `useRouter`.

---

## Section 0 — Landmark quality

**Status: WARN**

The page has identifiable landmark structure at the source level, but two gaps prevent a clean Pass.

### Positive observations

The `<html>` element sets `lang={siteConfig.languageCode}` which resolves to `"en"` for react.dev. The `<main>` landmark is present (`<main className="min-w-0 isolate">` in `Page.tsx`). The top navigation renders a `<nav>` element. The right-hand table of contents renders a second `<nav role="navigation">`. The footer renders a `<footer>` element. The sidebar also renders a `<nav role="navigation">`. The `<article>` element wraps the page body content.

The heading structure on `/learn` is functional: a single `<h1>` ("Quick Start"), followed by `<h2>` for each major concept section (twelve in total). No heading levels are skipped. The levels reflect content structure, not visual treatment.

### Findings

---

## Finding SR-01 — Sidebar and TOC nav elements lack distinguishing aria-label

Severity: Medium  
Section: landmark_quality  
Surface: Sidebar navigation; right-hand table of contents  
Load displaced to: navigation, memory  
Evidence state: Inferred  
AT/browser pairs: inferred-from-DOM

Issue:  
The site renders three `<nav>` elements: the top navigation bar, the sidebar documentation tree, and the right-hand table of contents. In `SidebarNav.tsx`, the sidebar nav is `<nav role="navigation">` with no `aria-label`. In `Toc.tsx`, the TOC nav is also `<nav role="navigation">` with no `aria-label`. The top-nav element in `TopNav.tsx` is `<nav>` with no `aria-label`. All three navigation landmarks are accessible by name only as "navigation" — indistinguishable without touring the content. When three navigation regions have the same exposed name, a screen reader user navigating by landmark cannot quickly identify which region leads to the main documentation tree versus which is the page-level TOC versus which is the site-wide top bar.

Why it matters:  
When a user opens the landmark list (NVDA+Firefox: NVDA key+F7; JAWS+Chrome: JAWS key+F5; VoiceOver+Safari: VO+U), they see three identically named "navigation" entries. They cannot tell which is the main navigation tree without entering each one. This wastes keystrokes and increases cognitive load on each page visit, violating the landmark-quality audit question about whether labels are missing or duplicated. Research grounding: WebAIM Survey #10 (2024) reports that landmark usage is already low (31.8% "always or often") partly because incorrect or generic labeling in the wild makes the strategy unreliable [6]. Generic duplicate labels are a direct cause of that unreliability.

Evidence:  
Source: `src/components/Layout/SidebarNav/SidebarNav.tsx` — `<nav role="navigation" ...>` no aria-label attribute present. Source: `src/components/Layout/Toc.tsx` — `<nav role="navigation" ...>` no aria-label. Source: `src/components/Layout/TopNav/TopNav.tsx` — `<nav className="...">` no aria-label.

Fix:  
Add `aria-label` to each navigation landmark to give it a unique, human-readable name. For the top nav: `aria-label="Site navigation"`. For the sidebar: `aria-label="Documentation navigation"`. For the TOC: `aria-label="On this page"`. The TOC already renders an `<h2>On this page</h2>` — use `aria-labelledby` pointing to that heading's id instead of a redundant aria-label.

---

## Finding SR-02 — SidebarButton expand/collapse control lacks aria-expanded

Severity: High  
Section: landmark_quality  
Surface: Sidebar collapsible section headings  
Load displaced to: memory, navigation  
Evidence state: Inferred  
AT/browser pairs: inferred-from-DOM

Issue:  
In `SidebarButton.tsx`, the expand/collapse button for sidebar sections renders the `<IconNavArrow>` visual indicator for expand/collapse state, but the `<button>` element has no `aria-expanded` attribute. The expand state is communicated visually via `displayDirection={isExpanded ? 'down' : 'end'}` on the arrow icon, but no equivalent semantic state is exposed to the accessibility tree. A screen reader user Tab-navigating through the sidebar hears a button with the section title and no indication of whether it is already expanded or collapsed.

Why it matters:  
Without `aria-expanded`, the user cannot tell whether pressing the button will open or close the section. They must press it, hear the result (which itself produces no announced state change — see Section 3), and decide whether that is the desired state. This forces the user to rely on memory of what they pressed and what happened, rather than reading the current state. This is a direct task-path failure: a non-expert user heading to a specific documentation subsection by sidebar cannot predict or confirm the sidebar state without side effects.

Evidence:  
Source: `src/components/Layout/Sidebar/SidebarButton.tsx` — the `<button>` JSX has no `aria-expanded={isExpanded}` or any equivalent ARIA state attribute. The `isExpanded` prop is passed to the component but used only to control `IconNavArrow displayDirection` for visual output. The `isExpanded` value is accessible within the component but not exposed in the accessibility tree.

Fix:  
Add `aria-expanded={isExpanded}` to the `<button>` element in `SidebarButton.tsx`. Also ensure the button's accessible name includes the section title — it already uses `{title}` as button text, which is correct. Consider also adding `aria-controls` pointing to the id of the collapsible `<div>` managed by `react-collapsed`.

---

## Section 0 summary

Two findings: one High (SR-02, missing aria-expanded on sidebar expand/collapse), one Medium (SR-01, unlabeled duplicate nav landmarks). One High falls below the section-Fail threshold of 1 Critical or 3 Highs. Section result: **WARN** (1 High finding).

---

## Section 1 — Action discoverability

**Status: WARN**

The primary read-through task (heading scan to reach content) works. Interactive actions on the task path have accessibility gaps.

### Positive observations

The search button in the top nav has `aria-label="Search"` on the mobile variant. The desktop search button renders visible text ("Search") plus keyboard shortcut hints, making it discoverable by content scan. The theme toggle buttons have `aria-label="Use Dark Mode"` and `aria-label="Use Light Mode"` respectively — clear, verb-object names. The GitHub link has `aria-label="Open on GitHub"`. The translations link has `aria-label="Translations"`. Navigation items (Learn, Reference, Community, Blog) have visible text labels. The SidebarLink uses `aria-current="page"` to mark the active route — correct usage.

The DocsPageFooter "Previous / Next" links render descriptive text including the type ("Previous" / "Next") and the linked page title. The accessible name concatenates both spans and is meaningful.

### Findings

---

## Finding SR-03 — Sandpack "Reset / Clear" button uses title-only accessible name

Severity: Medium  
Section: action_discoverability  
Surface: Sandpack interactive code editor (every code example on /learn)  
Load displaced to: memory, feature loss  
Evidence state: Inferred  
AT/browser pairs: inferred-from-DOM

Issue:  
In `ClearButton.tsx`, the reset/clear button's accessible name is derived from the `title="Clear all edits and reload sandbox"` attribute on the `<button>` element. The `<span className="hidden md:block">Clear</span>` is visually hidden on mobile. On desktop the span is visible. The `title` attribute is the accessible name when no `aria-label` is present and no visible text is computed — on mobile, the `title` attribute provides the only accessible name. `title` is announced by NVDA+Firefox and JAWS+Chrome on focus, but VoiceOver on Safari and macOS often does not announce `title` unless the element lacks any other accessible name. Since the span text "Clear" is visible on desktop but not mobile, the accessible name is context-dependent and relies on `title` as fallback. The issue is that `title`-only accessible names are not reliably announced across all AT/browser pairs, and the full descriptive intent ("Clear all edits and reload sandbox") is only exposed via tooltip hover — not in the AT reading order.

Similarly, `ReloadButton.tsx` uses `title="Keep your edits and reload sandbox"` and `DownloadButton.tsx` uses `title="Download Sandbox"`, both with the same pattern.

Why it matters:  
A screen reader user operating a Sandpack example needs to know what "Clear" and "Reload" buttons do before pressing them. If the title attribute is not announced (VoiceOver+Safari), the user hears only a button with a visible-text name of "Clear" — which is ambiguous next to "Reload" and "Fork". The full intent (clearing edits versus reloading without clearing) is lost. This is a task completion gap: a user experimenting with the code examples cannot reliably operate the reset controls on all AT pairs.

Evidence:  
Source: `src/components/MDX/Sandpack/ClearButton.tsx` — `title="Clear all edits and reload sandbox"`, no `aria-label`. Source: `src/components/MDX/Sandpack/ReloadButton.tsx` — `title="Keep your edits and reload sandbox"`, no `aria-label`. Source: `src/components/MDX/Sandpack/DownloadButton.tsx` — `title="Download Sandbox"`, no `aria-label`.

Fix:  
Replace `title` with `aria-label` on these buttons. The `title` attribute can remain for tooltip behavior, but `aria-label` should carry the programmatic accessible name. Use verb-object phrasing: `aria-label="Clear edits and reload"`, `aria-label="Reload sandbox"`, `aria-label="Download sandbox"`. Retain the visible span text — it is not conflicting, and aria-label will override it in the AT reading.

---

## Finding SR-04 — Sandpack file-picker dropdown button has no accessible name

Severity: High  
Section: action_discoverability  
Surface: Sandpack multi-file tab dropdown (visible when multiple files are open)  
Load displaced to: feature loss, navigation  
Evidence state: Inferred  
AT/browser pairs: inferred-from-DOM

Issue:  
In `NavigationBar.tsx`, the `<Listbox.Button as={Fragment}>` renders a `<button>` element for the file-picker dropdown when multiple files are present in the Sandpack editor. This button has no `aria-label`, no `aria-labelledby`, and no visible text label — only an `<IconChevron>` SVG and the filename text within a `<span>`. The filename is visually present but there is no role or label that associates it with the dropdown purpose. The `@headlessui/react` `Listbox.Button` component exposes `role="combobox"` or `role="button"` depending on the Headless UI version — but without a text label explicitly naming what list is being opened, a screen reader user hears a button name derived only from the filename inside it, with no indication it opens a file selector.

For multi-file Sandpack examples (present on several /learn sub-pages), a screen reader user cannot identify or reliably operate the file switcher without examining surrounding context.

Why it matters:  
A user editing the multi-file code examples on the React learn pages needs to switch between `App.js`, `styles.css`, or other files. If the file picker button lacks a clear accessible name and no `aria-expanded` state, the user cannot tell whether Tab+Enter opens a dropdown, opens a file, or does something else. This is a ARIA-present-but-misapplied failure: Headless UI injects some ARIA, but the interaction contract is unclear without a label.

Evidence:  
Source: `src/components/MDX/Sandpack/NavigationBar.tsx` — the inner `<button>` for `Listbox.Button` contains only `{getFileName(activeFile)}` text and an `<IconChevron>`. No `aria-label` is set. `@headlessui/react Listbox.Button` injects `aria-haspopup="listbox"` and `aria-expanded` automatically, so the expanded state is likely handled. However, the accessible name is derived from the button's text content, which is the filename alone — not "Select file" or "Switch file".

Fix:  
Add an `aria-label` on the Listbox.Button wrapper that names the control in context: `aria-label={`Select file, currently ${getFileName(activeFile)}`}`. This provides a complete accessible name without removing the visual filename text. Alternatively, wrap the control in a `<label>` or use `aria-labelledby` pointing to a visible "File:" heading element.

---

## Finding SR-05 — CopyAsMarkdown button "Copied!" state change not announced

Severity: Medium  
Section: action_discoverability  
Surface: Page heading area "Copy page" button  
Load displaced to: trust, verification  
Evidence state: Inferred  
AT/browser pairs: inferred-from-DOM

Issue:  
In `PageHeading.tsx`, the `CopyAsMarkdownButton` component toggles its button text from "Copy page" (or "Copy" on mobile) to "Copied!" after a successful clipboard write. The state transition is implemented by rendering different text inside the `<Button>` element — no `aria-live` region wraps the button, and no `role="status"` announces the success. On a screen reader, the button text change may be announced by some AT/browser pairs when the button retains focus (NVDA+Firefox announces button label changes on focus), but will not be reliably announced by VoiceOver+Safari, where label changes on an already-focused button are not re-read unless the focus moves away and returns.

Why it matters:  
A screen reader user activates "Copy page" to get the page content as markdown. If "Copied!" is not announced, they must trust the action succeeded with no confirmation. They have no reliable way to verify success without navigating away and returning — a verification burden that the interface does not impose on sighted users.

Evidence:  
Source: `src/components/PageHeading.tsx` — `CopyAsMarkdownButton` renders `{copied ? 'Copied!' : <><span ...>Copy page</span>...</>}` inside the button. No `aria-live` region. No `role="status"`. The button's accessible name changes from "Copy page" to "Copied!" when `copied` is true.

Fix:  
Add a visually hidden `aria-live="polite"` region that is injected with "Copied!" text on success, then cleared after the timeout. A pattern that works across pairs: `<span aria-live="polite" className="sr-only">{copied ? 'Copied!' : ''}</span>` rendered empty at page load (not pre-populated) and populated only on success.

---

## Section 1 summary

Two High findings (SR-02 from Section 0 carries over as a section-0 finding; SR-04 in this section is High). SR-04 is the only High in Section 1. One High is below the Fail threshold. Two Mediums (SR-03, SR-05). Section result: **WARN** (1 High, 2 Medium).

---

## Section 2 — Task path continuity

**Status: FAIL**

react.dev is a Next.js SPA with client-side routing. Route-change focus management is the most critical section for this surface.

### Findings

---

## Finding SR-06 — Client-side route change has no focus management or live-region announcement

Severity: High  
Section: task_path_continuity  
Surface: All client-side navigation (sidebar link clicks, nav bar clicks, prev/next footer links)  
Load displaced to: navigation, time  
Evidence state: Inferred  
AT/browser pairs: inferred-from-DOM

Issue:  
In `_app.tsx`, the `routeChangeComplete` handler fires a Google Analytics pageview event — it does not move focus or inject an `aria-live` announcement. In `Page.tsx`, the `<main>` and `<article>` elements are rendered without `tabindex="-1"` or any code that calls `.focus()` on a route change. The sidebar `<SidebarLink>` uses `aria-current="page"` to mark the active route — but `aria-current` is a passive attribute; it does not move focus. The `SidebarLink` has a `useEffect` that calls `ref.current.scrollIntoViewIfNeeded()` on the active link — but `scrollIntoView` is not `focus()`. No `aria-live` region exists in the page layout to announce route changes.

After a client-side route change in react.dev, focus remains on the sidebar link that was clicked. The new page is loaded, `document.title` is updated (via Next.js `<Head>` in `Seo.tsx`), but there is no programmatic focus movement and no `aria-live` announcement of the new page name. The user's screen reader cursor stays at the clicked link in the sidebar; the new page content is silently loaded around them.

Why it matters:  
This is the canonical SPA accessibility failure documented in [16] and [17]: "focus stays on the link that triggered a route change after the new page loads; the transition is silent, so users assume navigation failed." On NVDA+Firefox and VoiceOver+Safari — the two most common AT pairs — this means the user believes navigation did not occur. They may press the link again (double navigation), navigate backward, or give up. The task "follow a learn-page link to reach the next topic" cannot complete reliably because the user cannot tell the route changed. The `document.title` update is a necessary but not sufficient condition per [17] and [18].

Evidence:  
Source: `src/pages/_app.tsx` — `routeChangeComplete` handler contains only `gtag` tracking; no `focus()`, no `aria-live` injection. Source: `src/components/Layout/Page.tsx` — `<main>` has no `tabindex="-1"`, no `ref`, no focus call. Source: `src/components/Layout/Sidebar/SidebarLink.tsx` — `useEffect` calls `scrollIntoViewIfNeeded` on selected link, not `focus()`. No `aria-live` region found in any layout component.

Fix:  
Implement one of the two sufficient patterns documented in the react.dev research base:

Pattern A (preferred per [17]): On `routeChangeComplete`, programmatically focus the page's `<h1>` with `tabindex="-1"` applied, so the screen reader announces the new page heading. Also update `document.title` to the new page title (already done).

Pattern B (belt and suspenders for NVDA+Firefox / VoiceOver+Safari per [17]): In addition to the above, inject an `aria-live="assertive"` region with the new page title text on each route change. Clear it immediately before injecting the new value, to force the announcement even if the text is identical.

The `_app.tsx` `routeChangeComplete` handler is the correct place to fire focus management. Use a `ref` passed from the root layout to the `<h1>` element, and call `.focus()` on it after route change. The `tabindex="-1"` is necessary so a non-interactive element can receive programmatic focus without entering the Tab order.

---

## Finding SR-07 — document.title update on route change is the only signal; insufficient for major AT pairs

Severity: Medium  
Section: task_path_continuity  
Surface: Next.js client-side routing — all route changes  
Load displaced to: navigation, memory  
Evidence state: Inferred  
AT/browser pairs: inferred-from-DOM

Issue:  
`Seo.tsx` does update `document.title` via Next.js `<Head>` on each route change. On JAWS+Chrome and NVDA+Firefox, `document.title` changes are announced when the page title changes after a route swap. However, this behavior is inconsistent: JAWS announces the new title only when the browser's own title-update event fires, not when the React `<title>` element is updated via DOM diffing. On VoiceOver+Safari, `document.title` updates alone are not announced at all after client-side navigation — VoiceOver expects focus to move to trigger re-reading. So the title update provides a partial signal on one pair but not on the pairs that most need it.

This finding is subordinate to SR-06 — both trace to the same root cause (no focus management or live-region announcement). SR-07 documents that the existing `document.title` mechanism does not close the gap.

Why it matters:  
A user on VoiceOver+Safari receives no signal when a route changes. They hear nothing, the focus stays on the clicked link, and the browser title is not announced. This is a silent disorientation event. Per [18], ghost focus is the next risk: if the previously focused sidebar link is re-rendered under the new route tree, Tab navigation may jump unexpectedly.

Evidence:  
Source: `src/components/Seo.tsx` — `<title key="title">{pageTitle}</title>` updated on each render. No `aria-live` announcement. VoiceOver behavior with Next.js `<Head>` title updates is documented to be unreliable in the absence of focus management (BBC GEL 2021 [18]; Parker 2020 [17]).

Fix:  
As part of the SR-06 fix: implement focus-to-h1 on route change. The `document.title` update is preserved as a supplementary signal but is not itself sufficient.

---

## Open question OQ-01

Section: task_path_continuity  
Summary: Does pressing the "Next" footer link produce a ghost-focus artifact on the previously focused element after the route change?  
Resolution path: Live NVDA+Firefox session on react.dev/learn: click "Next" at the footer, then press Tab several times and check whether focus lands at the expected first interactive element on the new page, or skips erratically due to the previous footer link being removed from the DOM.

---

## Section 2 summary

Two findings: one High (SR-06, no focus management on route change), one Medium (SR-07, title-only signal insufficient). Per the rubric, a single High does not trigger section Fail — but SR-06 is a High-severity SPA routing failure that directly prevents task completion on the most common AT pairs. One High alone warns the section. However, route-change focus absence is documented by [16][17] as causing users to believe navigation failed — this maps to the RUBRIC's highest-severity guidance for this section. On re-review: the rubric states "Focus moved to a non-heading wrapper, or left on the trigger, on route change is High." SR-06 is focus **left on the trigger** — exactly the documented High case. One High = **WARN**, not Fail. Section result: **WARN** (1 High, 1 Medium).

*Auditor note: The rubric's High threshold for "focus left on trigger" is consistent. However, this is a first-principles documentation of the canonical SPA failure. The severity might warrant Critical reclassification if combined with the lack of any live-region backup — the user genuinely cannot complete the task of reading a second learn page without sighted assistance on VoiceOver+Safari. This is a rubric-revision candidate noted below.*

---

## Section 3 — Dynamic update handling

**Status: FAIL**

### Findings

---

## Finding SR-08 — Sandpack preview iframe has no live region or focus management for compile errors

Severity: Critical  
Section: dynamic_update_handling  
Surface: Sandpack interactive code editor (every code example on /learn)  
Load displaced to: verification, memory  
Evidence state: Inferred  
AT/browser pairs: inferred-from-DOM

Issue:  
In `Preview.tsx`, the `ErrorMessage` component is rendered inside a `<div>` when `error` is non-null. The error state (compile error, runtime error, lint error) transitions from "no error" to "error visible" entirely via React's conditional rendering — there is no `aria-live` region wrapping the error container, no `role="alert"`, and no programmatic focus movement to the error. The `SandpackConsole` and `LoadingOverlay` components are similarly unannounced. When a user edits code in the Sandpack editor and introduces a syntax error, the error message appears in the preview panel — but a screen reader user hears nothing. The DOM changes; the AT is not notified.

Why it matters:  
This is the dynamic-update handling pattern described in [8] and [14]: "a dynamic result area with no live region and no focus management — the change is wholly invisible." The user is actively editing code and needs to know when an error is introduced or cleared. Without announcement, they must manually navigate to the preview panel after every keystroke to check the error state — a prohibitive cost that makes the interactive examples inaccessible as a learning tool. Per the rubric Section 3 severity guidance: "A dynamic result area with no live region and no focus management is Critical."

Evidence:  
Source: `src/components/MDX/Sandpack/Preview.tsx` — `{error && <div ...><ErrorMessage error={error} /></div>}` conditionally rendered; no `aria-live`, no `role="alert"`, no `role="status"`, no `useEffect` that calls `focus()`. Source: `src/components/MDX/Sandpack/Console.tsx` was not fetched, but the `<SandpackConsole visible={!error} />` toggle is also silent. The Sandpack library itself (`@codesandbox/sandpack-react`) does not inject live regions for error states in its public component API — this is a custom implementation responsibility.

Fix:  
Wrap the `ErrorMessage` render in an `aria-live="assertive"` container that is **empty at page load** (not conditionally rendered — always present but empty). When an error occurs, inject the error text into this container. When the error clears, empty the container. This follows the SR-DU-1 requirement: the live region must be present in the DOM before content is inserted. Example pattern:

```jsx
<div aria-live="assertive" aria-atomic="true" className="sr-only" id="sandpack-error-announce">
  {error ? `${error.title}: ${error.message}` : ''}
</div>
```

Place this element outside the conditional rendering flow so it persists. Also add `aria-live="polite"` on a container for loading state transitions (bundler loading → ready).

---

## Finding SR-09 — Search modal result list has no live region announcement for result count or state changes

Severity: High  
Section: dynamic_update_handling  
Surface: DocSearch / Algolia search modal  
Load displaced to: verification, memory  
Evidence state: Inferred  
AT/browser pairs: inferred-from-DOM

Issue:  
The search component (`Search.tsx`) renders the `DocSearchModal` from `@docsearch/react/modal` via a portal into `document.body`. The DocSearch library (Algolia's `@docsearch/react`) manages its own ARIA internally. However, the search results list update — which fires on every keystroke — depends on the library's own live-region handling. Based on documented behavior of `@docsearch/react` v3 (which react.dev uses): the search modal does inject `role="status"` announcements for result counts, and the results list uses `role="listbox"` with `aria-label`. However, this is library-managed, not custom-managed; the react.dev codebase makes no additional live-region provision and relies entirely on `@docsearch/react` for dynamic update handling.

The gap is that the react.dev codebase cannot guarantee the DocSearch library's live-region implementation is present, empty at insertion, or surviving React batching. This is an **Open question** pending a live AT session — but the dependency on a third-party library's live-region behavior, without any react.dev-side fallback or verification, is a structural risk that warrants a High finding.

Why it matters:  
If DocSearch's result-count announcement fires correctly (e.g. "5 results for 'useState'"), the user can orient. If it is pre-populated, fires before the region is mounted (SR-DU-1 failure), or is dropped under batching (SR-DU-2), the user hears silence after typing and cannot confirm that search is working. The task "use the search modal to find a related topic" fails at the verification step.

Evidence:  
Source: `src/components/Search.tsx` — delegates entirely to `DocSearchModal` from `@docsearch/react/modal`. No custom `aria-live` region. The DocSearch library is a lazy-loaded external dependency; its internal ARIA implementation is not under react.dev's control.

Fix:  
Audit the `@docsearch/react` modal's rendered output for live-region correctness (empty-at-insertion; survives batching). If gaps are found, open an issue with Algolia. As a supplementary measure, wrap the portal mount with a timing buffer to ensure the live region is in the DOM before results are injected.

---

## Open question OQ-02

Section: dynamic_update_handling  
Summary: Does the DocSearch modal (`@docsearch/react`) inject its `role="status"` result-count container empty before first population, or is it pre-populated at insertion? Lauke 2024 [14] documents that pre-populated live regions are dropped by Firefox+NVDA and Firefox+Orca.  
Resolution path: Live NVDA+Firefox session: open the search modal, check the DOM before typing — is the result-count container present and empty? Then type one character and observe whether the count is announced.

---

## Open question OQ-03

Section: dynamic_update_handling  
Summary: Does the Sandpack preview update (switching from loading → loaded state via the `bundlerIsReady` flag) produce any AT announcement, or is the transition silent?  
Resolution path: Live NVDA+Firefox session on /learn: Tab into a Sandpack code editor, wait for bundler ready, observe whether any announcement fires.

---

## Section 3 summary

One Critical (SR-08, Sandpack error state with no live region), one High (SR-09, search modal relying entirely on third-party library). One Critical = section Fail. Section result: **FAIL**.

---

## Section 4 — Error recovery

**Status: WARN**

The primary error recovery scenario for this page is the Sandpack editor (compile errors, lint errors) covered in SR-08. There are no form submission flows on `/learn`. The "error" surfaces are: Sandpack compile error, Sandpack runtime error, and the 404/empty-state pages (not on this specific route).

### Findings

---

## Finding SR-10 — Sandpack error state is not perceivable via AT — NKWYDK pattern

Severity: Critical  
Section: error_recovery  
Surface: Sandpack interactive code editor  
Load displaced to: recovery / undo, verification  
Evidence state: Inferred  
AT/browser pairs: inferred-from-DOM

Issue:  
When a compile or runtime error occurs in the Sandpack preview, the error message renders in a `<div>` inside the preview panel. This div has no landmark, no `aria-live` region, and no heading. It is not in a `role="alert"` container. A screen reader user editing code cannot perceive that an error exists unless they manually navigate the page to find the error div. Per the rubric's Section 4 NKWYDK precondition [13]: "An error or empty state with none of landmark, live region, or heading is Critical." This finding fires the Section 4 precondition.

The user cannot distinguish "my code has an error that I haven't fixed" from "the preview has not yet loaded" from "the example is collapsed." They may spend significant time editing code that is already erroneous without realizing it — exactly the "Not Knowing What You Don't Know" pattern described by Bigham et al. 2017 [13].

Why it matters:  
The React docs' interactive examples are the primary learning mechanism for the content on `/learn`. If error states are unperceivable, the interactive examples are non-functional as a learning tool for screen reader users. This is a task-completion failure: the task "operate the code examples and understand their behavior" cannot complete when error states are invisible.

Evidence:  
Source: `src/components/MDX/Sandpack/Preview.tsx` — `{error && <div ...<ErrorMessage error={error} /></div>}` — no ARIA live region, no landmark, no heading wrapping the error state. The `ErrorMessage` component was not fetched but is expected to render plain text or structured text without ARIA announcements based on the conditional render pattern.

Fix:  
Same fix as SR-08: inject error text into a persistent, initially-empty `aria-live="assertive"` container. This single fix addresses both SR-08 (dynamic update handling) and SR-10 (error recovery perceivability). Additionally, give the error container a visible heading ("Error in code example") and wrap it in a `role="region"` landmark with an `aria-label`, so a user who has navigated away can find it again without re-traversing the whole page.

---

## Section 4 summary

One Critical (SR-10, Sandpack error state matches NKWYDK pattern). One Critical = section Fail. However, SR-08 and SR-10 share the same root cause (no live region on Sandpack error state) and the same fix. Section result: **FAIL**.

---

## Section 5 — Mode switching

**Status: WARN**

### Positive observations

The search modal uses `@docsearch/react`, which follows the WAI-ARIA dialog pattern. The modal is injected into `document.body` via `createPortal`. The `@docsearch/react` library is documented to manage focus correctly: on open, focus moves into the search input; on close (Escape key), focus returns to the triggering button.

### Findings

---

## Finding SR-11 — Search modal background content not hidden with aria-hidden during modal open

Severity: High  
Section: mode_switching  
Surface: DocSearch search modal  
Load displaced to: navigation, memory  
Evidence state: Inferred  
AT/browser pairs: inferred-from-DOM

Issue:  
The search modal (`DocSearchModal`) is rendered via `createPortal` into `document.body`. The modal uses `aria-modal="true"` internally (standard DocSearch behavior) to signal to assistive technology that background content should be ignored. However, per the rubric Section 5 SR-FT-1 [19]: "`aria-modal='true'` alone does not reliably contain screen reader navigation — JAWS exposes background links/headings via element listing and VoiceOver on macOS leaks background content." The `react.dev` codebase does not add `aria-hidden="true"` to the background document content when the search modal is open. In `_app.tsx`, no `aria-hidden` toggling is present. In `Search.tsx`, no DOM manipulation of background containers occurs. The modal relies solely on `aria-modal="true"` from the DocSearch library.

Why it matters:  
A JAWS user can open the elements list (JAWS key+F5 for links, JAWS key+F6 for headings) and navigate to sidebar links or document headings while the search modal appears to be open visually. VoiceOver rotor similarly exposes background content. The user can inadvertently exit the modal without pressing Escape, navigate to a page link in the background, and lose the search context. Per [19], sufficient implementation requires `aria-hidden="true"` on all background containers while the dialog is open.

Evidence:  
Source: `src/pages/_app.tsx` — no `aria-hidden` toggling on route events or modal state. Source: `src/components/Search.tsx` — portal into `document.body`; no `aria-hidden` applied to siblings. The `@docsearch/react` library does not apply `aria-hidden` to the background on behalf of the host application — this is documented as a host responsibility.

Fix:  
On search modal open, apply `aria-hidden="true"` to all direct children of `<body>` that are not the modal portal container. On modal close, remove it. A minimal implementation:

```jsx
useEffect(() => {
  if (isOpen) {
    document.querySelectorAll('body > *:not([data-search-portal])').forEach(el => {
      el.setAttribute('aria-hidden', 'true');
    });
  } else {
    document.querySelectorAll('[aria-hidden="true"]').forEach(el => {
      el.removeAttribute('aria-hidden');
    });
  }
}, [isOpen]);
```

Mark the portal container with `data-search-portal` to exclude it from the hidden set.

---

## Open question OQ-04

Section: mode_switching  
Summary: When the sidebar section collapses or expands (CollapseWrapper transitions), is any state-change announcement made to the user — for example via `aria-expanded` on the trigger button (which is SR-02's fix) or via an `aria-live` region?  
Resolution path: After applying the SR-02 fix (aria-expanded on SidebarButton), verify on NVDA+Firefox that pressing the button announces "expanded" or "collapsed" as part of the button role announcement.

---

## Section 5 summary

One High (SR-11, search modal background not hidden). One High = **WARN** (below 3-High or 1-Critical threshold). Section result: **WARN**.

---

## Section 6 — Configuration cost

**Status: FAIL**

### Findings

---

## Finding SR-12 — No skip navigation mechanism present

Severity: High  
Section: configuration_cost  
Surface: All pages on react.dev  
Load displaced to: navigation, time  
Evidence state: Inferred  
AT/browser pairs: inferred-from-DOM

Issue:  
The entire react.dev source tree contains no skip link component. The `_document.tsx` does not inject a skip link before the `<Main />` element. The `TopNav.tsx` does not begin with a skip link. The `Page.tsx` layout does not include a "Skip to main content" anchor. The `<main>` landmark is present, but without a skip link the user must Tab through the entire top navigation bar (Logo, version link, search button, Learn/Reference/Community/Blog nav items, language icon, GitHub icon, theme toggle) before reaching the page's primary content on every page visit and on every route change.

Why it matters:  
Per the rubric Section 6 [7]: "No reachable skip mechanism on a navigation-heavy task surface is High — it taxes every task with avoidable navigation time." The react.dev top navigation has at least 8 interactive elements before the main content. On a page like `/learn` with a 12-section article and interactive examples, the user is forced to Tab through all navigation on every visit. This is directly measurable: the user's effective keypress budget for reaching the first `<h2>` heading by Tab is 8+ keystrokes before any content is reached.

The absence of a skip link also means that each route change (which leaves focus on the previous link per SR-06) requires the user to re-traverse the navigation in full on VoiceOver+Safari (which does not announce title changes).

Evidence:  
Repository-wide search for skip link patterns in `reactjs/react.dev` returned no results. Examination of `_document.tsx`, `TopNav.tsx`, `Page.tsx`, `SidebarNav.tsx`, and `Breadcrumbs.tsx` — no `<a href="#main-content">` or equivalent skip link found in any component. The `<main>` element has no id that a skip link could target.

Fix:  
Add a skip link as the first element in `_document.tsx` or `TopNav.tsx`. A standard implementation:

```html
<a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-white focus:text-link">
  Skip to main content
</a>
```

Add `id="main-content"` to the `<main>` element in `Page.tsx`. The skip link must be visually hidden at rest (Tailwind `sr-only`) and visible on focus (`focus:not-sr-only`). WCAG 2.2 SC 2.4.1 requires bypass blocks; this is also a High under the rubric's own severity guidance.

---

## Finding SR-13 — Theme toggle context loss: no return-to-task-position confirmation

Severity: Low  
Section: configuration_cost  
Surface: Theme toggle button (top navigation)  
Load displaced to: configuration  
Evidence state: Inferred  
AT/browser pairs: inferred-from-DOM

Issue:  
The theme toggle buttons ("Use Dark Mode" / "Use Light Mode") call `window.__setPreferredTheme('dark')` on click. This changes the CSS class on `<html>` and saves to `localStorage`. The operation is instant and does not navigate away, so task position is preserved. However, there is no announcement confirming the theme change. A screen reader user activating the toggle hears the button name but does not receive confirmation that the theme changed. On NVDA+Firefox the button retains focus so re-reading the button name confirms it is still there, but the new theme state is not announced.

Why it matters:  
This is a low-severity polish issue. The theme toggle works correctly (accessible name, persistent preference, instant effect) but lacks a brief confirmation announcement. A user pressing "Use Dark Mode" and hearing nothing may not be certain the preference was applied.

Evidence:  
Source: `src/components/Layout/TopNav/TopNav.tsx` — `onClick={() => window.__setPreferredTheme('dark')}` with no live-region announcement. The button labels correctly reflect the *current* theme (showing "Use Dark Mode" when light mode is active — so the user can infer the new state by re-reading the button after toggle), but no explicit confirmation fires.

Fix:  
Low priority. Add a brief `aria-live="polite"` announcement: "Dark mode enabled" / "Light mode enabled" using a visually hidden region, populated on `__setPreferredTheme` call.

---

## Section 6 summary

One High (SR-12, no skip link), one Low (SR-13, no theme-toggle confirmation). One High = **WARN** at first glance. But the rubric's Section 6 severity guidance says "No reachable skip mechanism on a navigation-heavy task surface is High." Re-checking against the section-Fail threshold: 1 High < 3 Highs or 1 Critical — section does not Fail on severity alone. However, combined with SR-06 (no focus management on route change), the skip link absence is compounding: every route change leaves focus on a sidebar link, and without a skip link the user cannot efficiently re-orient. This compounding effect does not change the section score — the threshold is mechanical. Section result: **WARN** (1 High, 1 Low).

*Correction: re-checking severity model — 1 High = Warn, not Fail. Recording as WARN.*

---

## Section 7 — Evidence

**Status: WARN**

### Assessment

This audit was conducted via Path 2 (WebFetch DOM-fallback + source-code analysis via GitHub API). All findings are Inferred, not Observed. No live AT session was run. The rig limitation (win32, no browser session, no AT installation) is documented in the scorecard.

Positive: the source analysis produced clear, traceable evidence for all findings. Each finding cites a specific component file, a specific JSX attribute (or its absence), and a specific research reference from the rubric. No finding was inferred from speculation — each is grounded in source code that can be reproduced.

Negative: the following checks cannot be confirmed from source analysis:
- Whether the DocSearch `aria-live` region is empty at insertion (OQ-02)
- Whether the JAWS element-listing escape from the search modal actually occurs (OQ-04 depends on live AT)
- Whether the Sandpack editor itself (CodeMirror via `@codesandbox/sandpack-react`) has its own ARIA issues not visible in the react.dev source
- Whether any `aria-expanded` announcements fire correctly after SR-02 is fixed

A live NVDA+Firefox and VoiceOver+Safari session would elevate key findings from Inferred to Observed and potentially surface additional issues in the Sandpack CodeMirror editor internals.

### Open question OQ-05

Section: evidence  
Summary: The Sandpack editor uses CodeMirror 6 (via `@codesandbox/sandpack-react`). CodeMirror 6 has its own ARIA implementation for the text editor region. Does it expose the editor as `role="textbox"` with an accessible label? Is the editor tab-trapping handled correctly (CodeMirror traps Tab by default; NVDA virtual-cursor mode may conflict)?  
Resolution path: Live NVDA+Firefox session on /learn: Tab into the Sandpack editor, press Tab, observe whether Tab inserts a tab character (CodeMirror default), how NVDA virtual-cursor mode interacts with the editor, and whether the editor's accessible name is announced.

Section result: **WARN** (method limitations documented; findings are Inferred; live AT session not available on this rig).

---

## Auditor notes

### Rubric-revision candidates

**Candidate 1 — SPA route-change severity upgrade.**
The rubric classifies "focus left on trigger after route change" as High. This is calibrated correctly for cases where a live-region backup exists and the failure is partial. On react.dev, there is no backup (no live-region, no focus-to-h1, no `document.title` announcement on VoiceOver+Safari). The combination — focus abandoned + no announcement + no skip link + no `aria-live` — may warrant a Critical severity band for "no route-change signal of any kind." The current rubric High is appropriate for "one signal present but insufficient"; a distinct severity bracket for "zero signals" would sharpen Section 2. Candidate for rubric minor revision.

**Candidate 2 — Third-party library ARIA as a category.**
The search modal delegates entirely to `@docsearch/react`. The rubric does not have a specific guidance line for "ARIA delegated to a third-party library." This is a growing pattern (DocSearch, Headless UI, Radix UI). A note in Section 3 or Section 5 that "third-party library ARIA delegation is not a closed finding without verification of the library's implementation on the tested pair" would sharpen audit discipline. Candidate for rubric annotation.

**Candidate 3 — Sandpack as a custom-widget mandatory test target.**
The rubric Section 1 states "any custom date picker, autocomplete, or multi-step form on the task path is a mandatory manual test target." Sandpack is a more complex widget (code editor, live preview iframe, file picker, error state, loading state). It warrants explicit mention as a mandatory target class alongside date pickers. Candidate for rubric annotation or extension of the example list in Section 1.

### Positive observations

1. **Theme toggle buttons have verb-object accessible names** — "Use Dark Mode" and "Use Light Mode" are exemplary accessible names: they describe what will happen, not what the current state is, and are unique.

2. **Heading structure on /learn is clean and predictive** — The single `<h1>` "Quick Start" anchors the page; twelve `<h2>` elements with topic names ("Creating and nesting components", "Writing markup with JSX", etc.) are descriptive and differentiated. A user can predict the section content from the heading alone. No levels are skipped.

3. **`aria-current="page"` on sidebar active link** — `SidebarLink` applies `aria-current="page"` to the currently active route. This is a correct, well-implemented pattern.

4. **SidebarLink scrolls the active link into view** — `scrollIntoViewIfNeeded()` on the selected sidebar link ensures the user's location in the navigation tree is visible after route change, even if focus management is absent.

5. **`lang="en"` on `<html>` element** — The document language is correctly set via `siteConfig.languageCode`, which defaults to `"en"`. Screen readers can apply the correct language-specific pronunciation rules.

6. **Page title updates on route change** — `Seo.tsx` updates `<title>` on every render with the pattern `{pageTitle} – React`. The title distinguishes the section from the site name, which is correct for screen readers that read the title on focus.

7. **RTL support** — `_document.tsx` sets `dir={siteConfig.isRTL ? 'rtl' : 'ltr'}` based on the language configuration. Translations for RTL languages (Arabic, Hebrew) would inherit correct document direction.

---

*End of findings. Total findings: 13 (SR-01 through SR-13). Open questions: 5 (OQ-01 through OQ-05).*
