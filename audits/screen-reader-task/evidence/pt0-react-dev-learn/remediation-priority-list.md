# Remediation Priority List — PT0 react.dev/learn

**Audit:** sr-20260602-react-dev-learn-pt0  
**Date:** 2026-06-02  
**Total findings:** 13 (2 Critical, 5 High, 4 Medium, 1 Low) + 1 Low  
**Ordering principle:** Severity x surface centrality x ease of fix.

Within each severity band, findings are ordered by: (1) how many users are affected, (2) whether the fix is self-contained, and (3) whether the fix closes multiple findings at once.

---

## Critical (2 findings)

Critical findings block "Screen Reader Task Audited" status. Fix before any other work.

### 1. SR-08 / SR-10 — Sandpack error state invisible to AT (NKWYDK pattern)

**Finding IDs:** SR-08 (Section 3: Dynamic update handling), SR-10 (Section 4: Error recovery)  
**Sections failed:** dynamic_update_handling, error_recovery  
**Single root cause, single fix.**

These two Critical findings share one root cause (no `aria-live` region on Sandpack error output) and one fix. Every code example on `/learn` is affected — approximately 10 Sandpack editors per page. A screen reader user who edits the code and introduces an error hears nothing. They cannot tell whether the preview failed, is loading, or their code is broken.

Fix: In `src/components/MDX/Sandpack/Preview.tsx`, add a persistent (always-in-DOM, initially empty) `aria-live="assertive"` container that receives the error title and message when `error` is non-null, and is cleared when `error` returns to null. The container must be rendered unconditionally — not inside the `{error && ...}` conditional — so the DOM presence is established before content insertion (per SR-DU-1, Lauke 2024). Also add a persistent `aria-live="polite"` container for the loading-to-ready transition announcement.

```jsx
// In Preview.tsx, outside the conditional render:
<div
  aria-live="assertive"
  aria-atomic="true"
  className="sr-only"
  id="sandpack-error-announce">
  {error ? `${error.title}: ${error.message}` : ''}
</div>
```

Additionally, give the error container a visible heading ("Error") and wrap it in a `role="region" aria-label="Code example error"` so a user who navigated away can find it by landmark scan.

---

## High (5 findings)

High findings cause significant task displacement for screen reader users. Fix in this order.

### 2. SR-12 — No skip navigation link

**Finding ID:** SR-12  
**Section:** configuration_cost

The entire react.dev site has no skip link. Every page visit and every route change forces keyboard users to Tab through 8+ navigation elements before reaching main content. This compounds SR-06 (no route-change focus management) — after every client-side navigation the user is left on the sidebar with no way to jump directly to the new page content.

Fix: Add a visually hidden skip link as the first focusable element in `src/components/Layout/TopNav/TopNav.tsx` (or in `_document.tsx` before `<Main>`):

```jsx
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:start-0 focus:z-50 focus:p-4 focus:bg-wash dark:focus:bg-wash-dark focus:text-link">
  Skip to main content
</a>
```

Add `id="main-content"` to the `<main>` element in `src/components/Layout/Page.tsx`. The skip link must appear before the hamburger/menu button in DOM order.

---

### 3. SR-06 — Client-side route change silent — focus stays on triggering link

**Finding ID:** SR-06  
**Section:** task_path_continuity

After any client-side navigation (sidebar link, top nav link, prev/next footer), focus remains on the clicked link in the old view. The screen reader receives no signal that the route changed. On VoiceOver+Safari, `document.title` updates are not announced, so the transition is completely silent.

Fix: In `src/pages/_app.tsx`, on `routeChangeComplete`, move focus to the page `<h1>`. The `<h1>` needs `tabindex="-1"` so it can receive programmatic focus without entering the Tab order. Pass a ref from `Page.tsx` to the `H1` component via React context, and call `.focus()` on it from the `_app.tsx` handler. Additionally, inject a brief `aria-live="assertive"` announcement with the new page title to serve as a backup on pairs where focus-to-h1 may not announce reliably:

```jsx
// _app.tsx routeChangeComplete:
const handleRouteChange = (url: string) => {
  // existing gtag call...
  // New: focus the page h1
  const h1 = document.querySelector('h1');
  if (h1) { h1.focus(); }
  // New: live-region backup announcement
  const region = document.getElementById('route-announce');
  if (region) {
    region.textContent = '';
    setTimeout(() => {
      region.textContent = document.title;
    }, 100);
  }
};
```

Add `<div id="route-announce" aria-live="assertive" aria-atomic="true" className="sr-only"></div>` as a persistent element in `_document.tsx`.

---

### 4. SR-11 — Search modal background not hidden with aria-hidden

**Finding ID:** SR-11  
**Section:** mode_switching

The DocSearch modal relies on `aria-modal="true"` alone for containment. JAWS users can escape via element listing; VoiceOver users can escape via the rotor. Background page content is accessible while the modal is visually open.

Fix: In `src/components/Search.tsx`, add a `useEffect` that toggles `aria-hidden="true"` on all `document.body` direct children except the modal portal on `isOpen` changes:

```jsx
useEffect(() => {
  const bodyChildren = Array.from(document.body.children);
  bodyChildren.forEach((child) => {
    if (!child.hasAttribute('data-docsearch-portal')) {
      child.setAttribute('aria-hidden', isOpen ? 'true' : 'false');
      // Or remove the attribute when false:
      if (!isOpen) child.removeAttribute('aria-hidden');
    }
  });
}, [isOpen]);
```

The DocSearch portal needs a stable identifier (`data-docsearch-portal` or similar) to be excluded from the hidden set.

---

### 5. SR-02 — Sidebar expand/collapse button missing aria-expanded

**Finding ID:** SR-02  
**Section:** landmark_quality

The sidebar section buttons show a visual arrow indicating expanded/collapsed state but expose no `aria-expanded` attribute. Screen reader users cannot query the current state of a section without pressing the button.

Fix: In `src/components/Layout/Sidebar/SidebarButton.tsx`, add `aria-expanded={isExpanded}` to the `<button>` element:

```jsx
<button
  aria-expanded={isExpanded}
  // ... existing props
  onClick={onClick}>
  {title}
  ...
</button>
```

This is a one-line change. Also consider adding `aria-controls={collapseId}` pointing to the collapse wrapper's id for a complete ARIA disclosure pattern.

---

### 6. SR-04 — Sandpack multi-file picker button accessible name is filename only

**Finding ID:** SR-04  
**Section:** action_discoverability

The file picker dropdown button in multi-file Sandpack examples has an accessible name derived from the filename alone. There is no indication it opens a file selector.

Fix: In `src/components/MDX/Sandpack/NavigationBar.tsx`, add an `aria-label` to the Listbox.Button:

```jsx
<Listbox.Button as={Fragment}>
  {({open}) => (
    <button
      aria-label={`Select file, currently ${getFileName(activeFile)}`}
      // ... existing props
    >
      ...
    </button>
  )}
</Listbox.Button>
```

Alternatively, add a visually hidden label before the button: `<label id="file-picker-label" className="sr-only">Select file</label>` and reference it with `aria-labelledby="file-picker-label"`.

---

## Medium (4 findings)

Medium findings cause friction but do not block task completion on all pairs. Fix after Criticals and Highs.

### 7. SR-03 — Sandpack Clear/Reload/Download buttons use title-only accessible name

**Finding ID:** SR-03  
**Section:** action_discoverability

Replace `title` with `aria-label` on the three Sandpack toolbar buttons. The `title` attribute can remain for tooltip hover behavior — `aria-label` will override it in the accessible name computation.

- `ClearButton.tsx`: add `aria-label="Clear edits and reload"`
- `ReloadButton.tsx`: add `aria-label="Reload sandbox"`
- `DownloadButton.tsx`: add `aria-label="Download sandbox"`

---

### 8. SR-07 — document.title update insufficient as route-change signal on VoiceOver+Safari

**Finding ID:** SR-07  
**Section:** task_path_continuity

This finding is resolved as a side effect of the SR-06 fix (focus-to-h1 + aria-live announcement). No separate fix required once SR-06 is implemented. Closing condition: live VoiceOver+Safari session confirms route-change announcement on navigation.

---

### 9. SR-05 — CopyAsMarkdown "Copied!" state change not announced via live region

**Finding ID:** SR-05  
**Section:** action_discoverability

In `PageHeading.tsx` `CopyAsMarkdownButton`, add a visually hidden `aria-live="polite"` region that is empty at render and populated with "Copied!" on success:

```jsx
<span aria-live="polite" className="sr-only">
  {copied ? 'Copied!' : ''}
</span>
```

The span must be always in the DOM (not conditionally rendered) and initially empty to ensure the announcement fires when `copied` becomes true.

---

### 10. SR-09 — Search modal dynamic updates delegate entirely to @docsearch/react

**Finding ID:** SR-09  
**Section:** dynamic_update_handling

Audit the `@docsearch/react` library's rendered output for SR-DU-1 compliance (live region empty at insertion). If the library pre-populates the result-count region, open an issue with Algolia and explore wrapping with a host-managed backup announcement. As an interim measure, verify in a live session that the count announcement fires on NVDA+Firefox before closing this finding.

---

## Low (1 finding)

Low findings are polish-level. Address after all higher-severity work is complete.

### 11. SR-13 — Theme toggle lacks confirmation announcement

**Finding ID:** SR-13  
**Section:** configuration_cost

Add a brief `aria-live="polite"` announcement on theme change. In `TopNav.tsx`, add a persistent empty span near the theme toggle buttons and populate it on `__setPreferredTheme` call:

```jsx
<span aria-live="polite" className="sr-only">
  {themeAnnouncement}
</span>
```

Set `themeAnnouncement` to "Dark mode enabled" or "Light mode enabled" on click, cleared after a short timeout.

---

## SR-01 — Three nav landmarks lack distinguishing aria-label

**Finding ID:** SR-01  
**Section:** landmark_quality  
**Severity:** Medium (listed here at end of Medium band)

Add `aria-label` to each navigation landmark. Low-effort, high-leverage:

- `TopNav.tsx` `<nav>`: add `aria-label="Site navigation"`
- `SidebarNav.tsx` `<nav>`: add `aria-label="Documentation navigation"`
- `Toc.tsx` `<nav>`: change to `aria-labelledby={headingId}` pointing to the existing "On this page" `<h2>`, which already provides a descriptive name

---

## Summary table

| Priority | ID | Severity | Sections | Fix effort |
|---|---|---|---|---|
| 1 | SR-08 + SR-10 | Critical | dynamic_update_handling, error_recovery | Medium — requires persistent live region in Sandpack Preview |
| 2 | SR-12 | High | configuration_cost | Low — one skip link added to TopNav or _document |
| 3 | SR-06 | High | task_path_continuity | Medium — focus management in _app.tsx + aria-live region |
| 4 | SR-11 | High | mode_switching | Low — aria-hidden toggling on modal open/close |
| 5 | SR-02 | High | landmark_quality | Trivial — one line: aria-expanded={isExpanded} on button |
| 6 | SR-04 | High | action_discoverability | Low — aria-label on Listbox.Button |
| 7 | SR-03 | Medium | action_discoverability | Trivial — replace title with aria-label on 3 buttons |
| 8 | SR-07 | Medium | task_path_continuity | Resolved by SR-06 fix |
| 9 | SR-05 | Medium | action_discoverability | Trivial — sr-only aria-live span in CopyAsMarkdownButton |
| 10 | SR-09 | Medium | dynamic_update_handling | Low — audit @docsearch/react, open upstream issue if needed |
| 11 | SR-01 | Medium | landmark_quality | Trivial — aria-label on 3 nav elements |
| 12 | SR-13 | Low | configuration_cost | Trivial — aria-live span near theme toggle |
