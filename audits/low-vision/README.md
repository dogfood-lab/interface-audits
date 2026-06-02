state: Draft
audit_prefix: LV
catches: visual access under real density (zoom/reflow, contrast on photos & charts, focus visibility under custom themes, spatial orientation on reflow, magnifier behavior)

# Low-Vision Audit

## What burden this catches

This audit catches interfaces that pass a contrast scanner at 100% zoom but break for a low-vision user at the magnification they actually use. It catches text that disappears on reflow, hero text over a photograph that no scanner can measure, chart marks that vanish against their own background, focus rings that go invisible in Windows High Contrast Mode, and the "where am I" disorientation that strikes when content reflows and the user loses their place.

Generic accessibility audits answer "does the contrast pass at default zoom?" This audit answers "can a low-vision user still read, find, and stay oriented at 200%, 400%, and beyond — under real density, real photos, real charts, and real themes?"

The audit's law:

> A surface is only accessible to a low-vision user if it remains readable, navigable, and orientable at the user's real magnification — not at 100% zoom on a designer's monitor. Any simplification that loses content, breaks reading flow, hides focus, or strips the user's place when text is enlarged has not "passed contrast." It has displaced the cost of seeing onto the user's eyes, working memory, and panning hand.

## State

**Draft — rubric authored, not yet pressure-tested.** The eight sections are written and grounded in verified empirical findings, but no pressure test has been run against a real target yet. Per [`../../shared/audit-lifecycle.md`](../../shared/audit-lifecycle.md), a Draft audit is not an official audit and is not listed in the root README's "Current audits" table until it has at least one pressure test in `evidence/<pt-id>/`.

The PT0 target shortlist — the candidate surfaces to calibrate this rubric against — is in [`evidence/PT0-candidates.md`](evidence/PT0-candidates.md).

See [`CHANGELOG.md`](CHANGELOG.md) for version history and parked candidates.

## Files

| Path | What |
|---|---|
| [`RUBRIC.md`](RUBRIC.md) | Canonical audit doctrine — 8 sections, Low-Vision Access Law, severity preconditions, research grounding |
| [`skill/SKILL.md`](skill/SKILL.md) | Executable skill that runs the audit |
| [`schemas/finding.extensions.json`](schemas/finding.extensions.json) | Low-vision-specific extension to the base finding schema |
| [`CHANGELOG.md`](CHANGELOG.md) | Version history and parked candidates |
| [`evidence/PT0-candidates.md`](evidence/PT0-candidates.md) | Ranked PT0 target shortlist + exit criteria |

## Research grounding

The rubric's doctrine is anchored in 25 verified empirical findings (WebAIM low-vision surveys, the W3C Low Vision Task Force user-need model, CHI / ASSETS / ETRA magnifier studies, and the WCAG reflow / contrast / focus criteria). Each finding is connected to the specific section, question, or severity rule it justifies. See the **Research grounding** section near the top of [`RUBRIC.md`](RUBRIC.md). The citations were checked by an external retrieval-oracle verifier; uncited claims and dropped citations were excluded.

The boundary with the [Cognitive Load audit's Section 1](../cognitive-load/RUBRIC.md) (font + spacing defaults) is resolved by **reference-and-extend**: this audit reuses Cognitive Load's WCAG-floor checks and adds only the low-vision-specific thresholds (e.g. 7:1 body-text contrast on dense surfaces, where 4.5:1 is fine for Cognitive Load).

## Hard-failure patterns this audit detects

1. **Text disappears on reflow** — content present at full width is unreachable at 320 px (Section 0 Zoom & Reflow).
2. **Contrast passes the scanner but fails on real surfaces** — text over photos, marks on chart backgrounds (Section 1 Contrast under real density).
3. **Focus vanishes under the theme low-vision users enable** — `box-shadow` focus rings invisible in Windows High Contrast Mode (Section 2 Focus visibility + Section 5 Mode switching).
4. **The user loses their place when the page reflows** — point-of-regard loss, focus reset to top, severed label–input relationships under magnification (Section 3 Spatial orientation).

These patterns are candidates to exercise at first pressure test. No pattern has been validated yet — this is a Draft.

## How to invoke

If running through Claude Code or the skill harness:

> Run low-vision audit on `<target>`

See [`skill/SKILL.md`](skill/SKILL.md) for the full trigger list, inputs, outputs, and procedure.
