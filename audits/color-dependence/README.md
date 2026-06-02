state: Pressure-tested v0.1.0 (PT0 on GitHub Actions / microsoft/vscode, 2026-06-02)
audit_prefix: CD
catches: meaning conveyed by color alone (status badges, chart/graph encodings, form-validation signals, mode/state indication) and hue-confusion that hides behind a passing luminance-contrast check

# Color Dependence Audit

## What burden this catches

This audit catches interfaces that pass a luminance-contrast scan but still withhold meaning from color-vision-deficient users — status that exists only as a red-vs-green dot, charts where the only difference between series is hue, form errors signaled only by a red border, modes indicated only by a color change. Roughly 1 in 12 men cannot reliably distinguish red from green; for them, a color-only signal is no signal at all.

Generic accessibility scanners answer "is the contrast high enough?" This audit answers a question no scanner can answer: "if the user cannot tell these two hues apart, does the interface still tell them what they need to know?"

The audit's law:

> A product may use color to carry meaning only when that meaning survives the loss of hue. Any status, value, mode, or signal that exists *only* as a difference in color — and collapses for a color-vision-deficient user even after the contrast check passes — is not communicated. It is **communicated to some users and withheld from others**.

## State

**Draft — rubric authored, not yet pressure-tested.** The rubric ([`RUBRIC.md`](RUBRIC.md)) is written and research-grounded, but no pressure test has run against a real target yet. Per the lifecycle, a Draft audit is not listed in the root README's "Current audits" table and makes no Frozen / Dogfooded claim. See [`../../shared/audit-lifecycle.md`](../../shared/audit-lifecycle.md) for the state machine.

The PT0 calibration-target shortlist is in [`evidence/PT0-candidates.md`](evidence/PT0-candidates.md).

## Files

| Path | What |
|---|---|
| [`RUBRIC.md`](RUBRIC.md) | Canonical audit doctrine — 7 sections, the Color Dependence Law, the Contrast-Pass / Hue-Fail boundary rule, the Section 4 methods gate, research grounding |
| [`skill/SKILL.md`](skill/SKILL.md) | Executable skill that runs the audit |
| [`schemas/finding.extensions.json`](schemas/finding.extensions.json) | Color-dependence-specific extension to the base finding schema |
| [`CHANGELOG.md`](CHANGELOG.md) | Version history and pending changes |
| [`evidence/PT0-candidates.md`](evidence/PT0-candidates.md) | Ranked PT0 calibration-target shortlist (candidates, not completed runs) |

## Research grounding

The rubric is grounded in 19 verified findings from the CVD and WCAG literature — population prevalence (Birch 2012; Almustanyir 2025; Hofmann & Palczewski 2015), the scanner gap (W3C SC 1.4.1; SC 1.4.3), chart-encoding failure rates (Angerbauer 2022; Crameri 2020; Nuñez 2018; Tseng 2023; Guha 2022; Wong 2011), the luminance-vs-hue independence that justifies the boundary rule (Sajek 2025; Machado 2009), and the simulation-tooling pitfalls that drive the methods gate (Lillo 2014; DaltonLens 2023; Jamil 2024). Each finding is cited inline in [`RUBRIC.md`](RUBRIC.md) under "Research grounding" and connected to the section, question, or severity rule it justifies.

## Hard-failure patterns this audit detects

1. **Status conveyed only by color** (Section 0) — green/red dot, colored badge, link-by-color-only, with no label, icon, or shape.
2. **Chart that does not read without color** (Section 1) — color-only legends, rainbow/jet or red-green diverging colormaps, >8 color-only categories.
3. **Form error signaled only by hue** (Section 2) — red border with no error text or icon; required marked by color alone.
4. **Mode/state indicated only by color** (Section 3) — active tab, edit/view, record/live shown only as a color change.
5. **The Contrast-Pass / Hue-Fail trap** (every section) — a color pair passes WCAG 1.4.3 luminance contrast yet collapses to one perceived hue under protan/deutan simulation. This is the failure scanners cannot see and the reason the audit exists.

These are the patterns PT0 is meant to exercise. None has been pressure-tested yet — this is a Draft. See [`evidence/PT0-candidates.md`](evidence/PT0-candidates.md) for the candidate targets.

## How to invoke

If running through Claude Code or the skill harness:

> Run color-dependence audit on `<target>`

See [`skill/SKILL.md`](skill/SKILL.md) for the full trigger list, inputs, outputs, and procedure. Note the Section 4 methods gate: the skill will not record CVD findings until the simulation tool is qualified (physiological model + sRGB-linearization check).
