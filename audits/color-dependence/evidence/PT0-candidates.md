# PT0 candidates — Color Dependence Audit

This file is the ranked shortlist of **candidate** pressure-test targets for the Color Dependence Audit. These are calibration targets, **not completed runs** — the audit is still `state: Draft`. PT0 is the first contact between this rubric and a real interface.

Mirrors the structure of `ROADMAP.md`'s NT-1 shortlist: ranked targets, why each is a good calibration target, and explicit exit criteria.

When PT0 runs, its evidence lands in `evidence/pt0/` (findings + scorecard + remediation), and the audit advances Draft → Pressure-tested per [`../../../shared/audit-lifecycle.md`](../../../shared/audit-lifecycle.md).

---

## What PT0 must exercise

A good PT0 target must let the audit hit its load-bearing behaviors — especially the ones that distinguish this audit from a contrast scanner:

- **Color-only status or state** that a scanner would pass (Sections 0, 3).
- **A multi-series chart** so the Section 1 grayscale + simulation tests get real work (Section 1).
- **At least one Contrast-Pass / Hue-Fail case** — a color pair that passes WCAG 1.4.3 luminance contrast yet collapses under protan/deutan simulation. This is the single most important thing PT0 must find, because it is the failure scanners cannot see and the reason the audit exists.
- **The Section 4 methods gate** — PT0 must be run through a *qualified* simulator (physiological model + sRGB-linearization check), and the run must record tool + version. PT0 is also where the gate itself first gets tested in practice.

The discipline rule from [`../../../shared/pressure-test-protocol.md`](../../../shared/pressure-test-protocol.md) applies: start each finding at the most conservative evidence state, re-check after the run, and accept downgrades. A PT designed to find color-only failures is at structural risk of over-fitting — dichromacy-only over-reporting is the specific trap here, and the Section 4 POTENTIAL-FAIL rule is the brake.

---

## Ranked target shortlist

### 1. A monitoring / CI / observability dashboard — Grafana, GitHub Actions run list, or a status page

**Why it's the strongest calibration target.** Status dashboards are the densest real source of color-only meaning: green/red/yellow run states, pass/fail badges, up/down indicators, threshold-colored metrics. Many use red-vs-green at similar luminance — the exact Contrast-Pass / Hue-Fail case. They almost certainly pass a contrast scan while failing for ~1 in 12 male users. High chance of a clean Section 0 finding *and* a Section 1 chart finding (time-series panels) in one target.

**What it exercises.** Sections 0 (status badges), 1 (time-series and threshold colormaps), 3 (alerting/firing state), and the Contrast-Pass / Hue-Fail boundary across all three. Grafana specifically ships threshold coloring and several built-in palettes, some of which are red-green diverging — a likely Section 1 hard-fail candidate.

**Risk / caveat.** Grafana and GitHub both have done accessibility work; some status indicators already pair color with icons or text. That is a *good* outcome to record (positive observation), not a reason to skip — a target that passes some checks cleanly and fails others is the healthiest calibration.

### 2. A public data-visualization article or dashboard using a rainbow/jet or red-green colormap

**Why it's a good calibration target.** Section 1 is the audit's strongest evidence base, and the rainbow/jet hard-fail (Critical, unconditional, regardless of contrast) needs a live example to calibrate against. Scientific dashboards, older BI dashboards, and many heatmap-heavy products still default to jet or a red-green "bad-to-good" scale. This is the cleanest way to exercise the "passes the grayscale luminance test yet fails under CVD simulation" finding — the jet colormap is the textbook case (Nuñez 2018).

**What it exercises.** Section 1 in depth: rainbow/jet hard-fail, red-green diverging scale, >8 color-only categories, color-only legend, and the grayscale + simulation double test.

**Risk / caveat.** If the only finding is "uses jet," the run is thin. Pick a target that *also* has categorical series and a legend so Section 1 gets more than one finding, and so the audit isn't reduced to a single hard-fail rule.

### 3. A web form with inline validation — a signup, checkout, or settings form

**Why it's a good calibration target.** Section 2 (form validation) needs a target where error and required state are signaled. Many forms mark errors with a red border and required fields with a red asterisk and nothing else — a direct WCAG F81-shaped failure that passes contrast. This is also where the audit's task-cost framing (a CVD user blocked from completing a form) gets a concrete example.

**What it exercises.** Section 2 (error/required/success signaling), and the Contrast-Pass / Hue-Fail test on the error border specifically (does a contrast-passing red border still read as "error" under deutan simulation, or just as a border?).

**Risk / caveat.** Well-built forms increasingly add error text and `aria-invalid`, which is a Pass. Choose a form observed to color-signal at least one state, or treat a clean result as a positive observation and lean on targets 1–2 for the failing findings.

### 4. An editor or tool with explicit mode/state — a code editor diff view, a kanban board, or a calendar

**Why it's a useful calibration target.** Section 3 (mode/state indication) is one of the two thinner sections (it rests on the WCAG 1.4.1 floor more than on dedicated empirical findings). A target with diff add/remove coloring, kanban column/label colors, or calendar busy/free state lets PT0 test whether Section 3 produces honest, bounded findings or needs its own calibrating evidence. Diff views are a classic red/green-by-hue case.

**What it exercises.** Section 3 (active/inactive, add/remove, owned/shared state), and a likely red-green Contrast-Pass / Hue-Fail case in a diff view.

**Risk / caveat.** Good diff tools pair color with `+`/`-` glyphs (a Pass via G14). Record that as a positive observation. This target is most valuable precisely for stress-testing whether Section 3 over-fires when a secondary cue is present.

---

## Recommended PT0 pick

**Target 1 (a monitoring/CI dashboard), with a data-viz colormap target (target 2) as the fallback if target 1's status indicators turn out already-accommodated.** Target 1 maximizes the chance of exercising Sections 0, 1, and 3 plus the boundary rule in a single run, which is the densest calibration for the least setup. If target 1 comes back healthy, that is a real result worth recording — and target 2 is the backstop for guaranteeing at least one Section 1 hard-fail and one Contrast-Pass / Hue-Fail finding.

---

## PT0 exit criteria

PT0 is complete — and the audit may advance to **Pressure-tested** — when:

1. Evidence exists in `evidence/pt0/`: `color-dependence-findings.md`, `color-dependence-scorecard.json` (valid against the shared scorecard schema), and `remediation-priority-list.md`.
2. The Section 4 methods gate ran and is recorded: simulation tool + version, physiological-model confirmation, and sRGB-linearization check result are all in the scorecard `context`.
3. At least 5 findings produced, **or** an explicit, honest "fewer findings because the target was clean" note listing which sections passed.
4. Every finding maps to one of the 7 rubric sections; none orphaned.
5. **At least one Contrast-Pass / Hue-Fail finding** is produced (a color pair that passes 1.4.3 but collapses under simulation) — or an explicit note that no contrast-passing pair on the target was found to lie on a confusion line. This is the audit's reason for existing; PT0 must confront it.
6. Every finding carries an evidence state. No finding is marked BLOCK without CVD-tester confirmation (the two-tier rule); if no CVD tester was available, blocking-candidate findings stay Inferred and that limitation is documented.
7. Dichromacy-only findings are recorded as POTENTIAL-FAIL (Medium), not promoted to full severity without anomalous-trichromacy confirmation. Any second-pass reclassification is recorded in the run's auditor-notes section (this is the audit working, per the discipline rule).
8. The findings report obeys the audit's own conventions: plain language, structured headings, and — specifically for this audit — it does not encode finding severity or section status by color alone.
9. If a new rubric section appears obviously missing, it is logged as a candidate for the next version cut in [`CHANGELOG.md`](../CHANGELOG.md) — not invented mid-run.

A PT0 that revises the rubric earns the first version cut (Draft → Pressure-tested, and a new `CHANGELOG.md` entry). A PT0 that produces no rubric change is the path toward Frozen on the *next* PT, per [`../../../shared/audit-lifecycle.md`](../../../shared/audit-lifecycle.md).
