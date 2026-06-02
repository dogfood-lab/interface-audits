# Low-Vision Audit — PT0 target shortlist

This is the ranked candidate list for **Pressure Test 0** of the Low-Vision Audit. It mirrors the structure of [`../../../ROADMAP.md`](../../../ROADMAP.md)'s NT-1 shortlist: candidate targets, why each is a good calibration target, and the PT0 exit criteria.

These are **candidates, not completed runs.** No PT0 has been run yet. This audit is `state: Draft` (see [`../README.md`](../README.md)). When PT0 runs, its outputs land in `evidence/pt0/` and this audit advances to Pressure-tested.

## What PT0 needs to calibrate

PT0 exists to prove the rubric survives contact with a real, dense target without inventing drama, and to exercise the four hard-failure patterns:

1. **Text disappears on reflow** (Section 0)
2. **Contrast passes the scanner but fails on photos / charts** (Section 1)
3. **Focus vanishes under the theme low-vision users enable** (Section 2 + Section 5)
4. **The user loses their place when the page reflows** (Section 3)

A strong PT0 target is **dense** (so reflow and contrast-under-density have something to bite on), **public** (so the run is reproducible and no auth gate blocks it), and **likely to exercise at least two of the four patterns**. The best target stresses the scanner-invisible sections, not just the CSS-detectable contrast layer.

## Target shortlist, ranked by likely calibration value

### 1. A public analytics / observability dashboard with charts and a dense data table

Examples in the wild: a Grafana public demo, a GitHub Insights / traffic page, a status-page metrics view, an npm package download-stats page.

- **Why it's a good calibration target:** hits the most sections at once. Charts exercise Section 1's MANUAL-ONLY data-mark contrast check (marks on colored backgrounds, scanner-invisible). The data table exercises Section 0's exempt-element rule (the table may be 1.4.10-exempt, but its pagination / filters / search must still reflow) and Section 3's working-memory-across-pans check. Sticky toolbars exercise `LV-STICKY-BLOCK` at 400%.
- **Patterns it likely exercises:** 1 (reflow), 2 (chart contrast), 4 (place loss in the table).
- **Risk:** charts may be canvas/SVG that resists per-pixel inspection — but that *is* the scanner-gap the rubric claims, so documenting the limitation is itself evidence.

### 2. A documentation site at 320 CSS px / 400% browser zoom

Examples: a Starlight / Docusaurus / MkDocs site with a left sidebar nav, an in-page table of contents, and a sticky header. The repo's own handbook is a natural self-audit candidate but should be a *dogfood* run, not PT0 — PT0 should be an external target.

- **Why it's a good calibration target:** docs sites are the cleanest test of Section 0's reachability check (F102's five disappearing-content patterns — does the sidebar nav survive reflow, or vanish with no disclosure?) and Section 3's point-of-regard check (does the in-page ToC anchor hold on reflow?). Sticky doc headers are a reliable `LV-STICKY-BLOCK` source at 400%.
- **Patterns it likely exercises:** 1 (sidebar disappears on reflow), 4 (ToC place loss).
- **Risk:** well-built docs frameworks reflow cleanly — which would produce a *healthy* result. That is acceptable: a clean PT0 that correctly finds few issues still calibrates the rubric's honesty (the Cognitive Load PT1 on GitHub did exactly this).

### 3. A productivity web app tested under Windows High Contrast Mode

Examples: a public-facing project board, a web email client, a calendar app — anything with custom-styled focus rings and a keyboard flow.

- **Why it's a good calibration target:** this is the only shortlist entry that directly targets the **focus-in-WHCM Critical** (Section 2 / 5). Many web apps style focus with `box-shadow`, which forced-colors strips to `none` — the exact scanner-invisible Critical the rubric is built around [F19]. Running under `forced-colors: active` is the single highest-value calibration for the focus sections.
- **Patterns it likely exercises:** 3 (focus vanishes in high-contrast), and possibly 4 (place loss when the theme switches).
- **Risk:** requires the rig to enable Windows High Contrast Mode (or emulate `forced-colors` via DevTools). The Section 7 evidence caveat covers the DOM/CSS-class fallback if live forced-colors rendering isn't reproducible — cite the `box-shadow`-only focus CSS as Inferred evidence.

### 4. A marketing / landing page with hero text over a photograph

Examples: a SaaS landing page, a product hero with overlaid headline text on a full-bleed photo or gradient.

- **Why it's a good calibration target:** the cleanest, most isolated test of Section 1's MANUAL-ONLY photo-contrast check — text over a photograph is explicitly carved out of WCAG 1.4.3/1.4.11 and is structurally invisible to scanners [F12]. A good single-pattern calibration if a multi-section target proves too noisy for a first run.
- **Patterns it likely exercises:** 2 (contrast on photos).
- **Risk:** narrow. Likely produces only a handful of Section 1 findings; weaker on the reflow/orientation sections. Best used as a focused supplement, not the sole PT0.

## Recommended PT0 pick

**Target 1 (a public dashboard with charts + a dense table)** is the recommended primary, because it exercises three of the four patterns in one run and stresses the scanner-invisible sections (chart contrast, table place-loss, sticky occlusion) that justify the audit's existence. **Target 3 (a web app under Windows High Contrast Mode)** is the strongest *complement* if PT0 is split across two surfaces, because it is the only reliable way to exercise the focus-in-WHCM Critical.

## PT0 exit criteria

PT0 is complete when, per [`../../../shared/pressure-test-protocol.md`](../../../shared/pressure-test-protocol.md):

- The run produced `evidence/pt0/low-vision-findings.md`, `evidence/pt0/low-vision-scorecard.json` (conforming to [`../../../shared/schemas/scorecard.base.schema.json`](../../../shared/schemas/scorecard.base.schema.json)), and `evidence/pt0/remediation-priority-list.md`.
- At least 5 findings, every one mapped to a rubric section, each with a recorded zoom level and test path.
- At least one **scanner-invisible** finding (reflow loss, text on photo, chart mark, focus-in-WHCM, or place loss) — not just CSS-detectable contrast. This is the discriminator from a generic scan.
- At least two of the four hard-failure patterns marked `true` (exercised) or `false` (passed cleanly) in `hard_failure_patterns_validated` — not all `null`.
- The audit was run at a real magnification above 100% (200% and, where reachable, 320 CSS px / 400%), against a realistic dense state.
- Evidence gaps preserved as open questions (not laundered into Observed findings).
- The findings report obeys its own audit: plain language, short sentences, structured headings, readable typography.
- **Reclassification discipline applied:** any finding designed to fit the test's scope starts at the most conservative evidence state and is re-checked after the run. A second-pass downgrade is the audit working, and the reclassification trail belongs in the findings file's auditor-notes section.

If PT0 forces a rubric change, that change earns the first version cut and is recorded in [`../CHANGELOG.md`](../CHANGELOG.md), advancing the audit toward Frozen per [`../../../shared/audit-lifecycle.md`](../../../shared/audit-lifecycle.md).
