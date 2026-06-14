state: Pressure-tested v0.1.0
audit_prefix: MO
catches: vestibular triggers, animation respect, prefers-reduced-motion handling, flash/seizure thresholds

# Motion Sensitivity Audit

## What burden this catches

This audit catches interfaces that move in ways that physically harm a sizable fraction of their users, and that ignore the one signal those users can send the page in advance. It catches content flashing above the seizure threshold (a physical-harm Critical), parallax and scroll-jacking with no way to stop them, autoplay carousels that nobody clicks but everyone is forced to watch, and — most often — a surface that runs decorative motion while quietly ignoring the user's operating-system `prefers-reduced-motion` setting.

Generic accessibility audits stop at contrast and labels. This audit answers a different question: *can a user who is dizzy, migraine-prone, or photosensitive use this surface without being made sick by it?* — under autoplay, under parallax, under scroll-jacking, and under the OS preference the user already set.

The audit's law:

> A surface that moves without the user's consent, and gives no way to stop it, displaces the cost of that motion onto the user's vestibular system — dizziness, nausea, migraine, and in the worst case a seizure. Honoring the motion the user has already asked their operating system to reduce is the floor, not a feature. Flashing above the seizure threshold is not a design choice; it is harm.

## State

**Pressure-tested v0.1.0.** The seven sections are written, grounded in 33 verified empirical findings, and validated by one pressure test against a real target — the rubric did not change. PT0 ([`evidence/pt0-linear/`](evidence/pt0-linear/), 2026-06-14) ran against **linear.app** (Path 2 — fetched HTML + all 17 stylesheets): **1 High / 2 Low, 4 open questions, 4 positive observations, overall `warn`** (no section Fail, no Critical). `unstoppable_motion` (autoplay video with no Pause/Stop/Hide) and `reduced_motion_ignored` were exercised; `flash_seizure` was honestly `null` (no flashing asset present). Four findings downgraded on second pass (the discipline rule firing — e.g. a grid-dot field High→Low once confirmed opacity-only).

Per [`../../shared/audit-lifecycle.md`](../../shared/audit-lifecycle.md), this audit is now listed in the root README's "Current audits" table. The PT0 target shortlist is in [`evidence/PT0-candidates.md`](evidence/PT0-candidates.md). See [`CHANGELOG.md`](CHANGELOG.md) for version history, the hardening trail, and the PT0 result.

## Sections

| # | Key | What it checks |
|---|---|---|
| 0 | `animation` | Large-area movement, transitions, and especially flash/seizure thresholds (the only physical-harm Critical in the repo) |
| 1 | `loading_motion` | Spinners, skeleton shimmer, continuous loading motion — grounded in 2.3.3, not 2.2.2 (which exempts preloaders) |
| 2 | `vestibular_trigger_patterns` | The named taxonomy: scaling/zoom, spinning, multi-speed parallax, plane-shift, peripheral motion, scroll-jacking |
| 3 | `reduced_motion_respect` | Does the surface honor `(prefers-reduced-motion: reduce)`, including JS / WAAPI / canvas motion? |
| 4 | `autoplaying_media` | Auto-starting animation, video, carousels, sliders with no pause/stop/hide |
| 5 | `configuration_cost` | Is motion safety automatic via the OS preference, or opt-in behind a toggle the undiagnosed majority won't find? |
| 6 | `evidence` | Was flashing/fast media verified with an analysis tool (PEAT for web; Harding FPA for broadcast/gaming), not just eyeballed? |

## Boundary with the Low-Vision audit

This audit is net-new motion / vestibular territory. The one adjacency worth naming: the [Low-Vision audit's Section 5 — Mode switching](../low-vision/RUBRIC.md) and **this audit's Section 3 (`reduced_motion_respect`) are siblings** — both check whether a surface honors an OS accessibility preference — but **non-overlapping**: Low-Vision Section 5 owns `forced-colors` / contrast / theme, and this audit's Section 3 owns `prefers-reduced-motion`. They read different media queries and target different physiology; a surface can pass one and fail the other. Do not duplicate — cross-reference only. The **flash / seizure thresholds (WCAG 2.3.1 / 2.3.2)** in Section 0 are unique to this audit and touch no existing audit.

## Research grounding

The rubric's doctrine is anchored in 33 verified empirical findings (the WCAG flash / animation / pause criteria, the WebKit and A11Y Project vestibular-trigger taxonomies, the VIMS and parallax/scroll-jacking research, the Epilepsy Foundation seizure-threshold review, and the vestibular-disorder prevalence literature). Each finding is connected to the specific section, question, or severity rule it justifies. See the **Research grounding** section near the top of [`RUBRIC.md`](RUBRIC.md). The citations were checked by an external retrieval oracle plus two non-Claude groundedness families; fabricated, misattributed, contradicted, and duplicate candidates were dropped (see [`CHANGELOG.md`](CHANGELOG.md)).

## Hard-failure patterns this audit detects

1. **`flash_seizure`** — content flashes more than 3 times per second over the area + luminance (or red-flash) threshold (Section 0 — Critical, physical harm).
2. **`unstoppable_motion`** — autoplay / parallax / scroll-jack / zoom with no pause or disable mechanism (Sections 2 / 4).
3. **`reduced_motion_ignored`** — no `prefers-reduced-motion` handling, or a CSS reduce block that JS / WAAPI motion ignores (Section 3).
4. **`opt_in_only_safety`** — motion safety gated behind a toggle the undiagnosed majority will not find, instead of honoring the OS preference (Section 5).

At PT0 (linear.app), `unstoppable_motion` and `reduced_motion_ignored` were exercised (`true`), `opt_in_only_safety` was looked for and passed clean (`false`), and `flash_seizure` was not exercisable on the target (`null`). See [`evidence/pt0-linear/`](evidence/pt0-linear/).

## Files

| Path | What |
|---|---|
| [`RUBRIC.md`](RUBRIC.md) | Canonical audit doctrine — 7 sections, Motion Sensitivity Law, severity preconditions, research grounding |
| [`skill/SKILL.md`](skill/SKILL.md) | Executable skill that runs the audit |
| [`schemas/finding.extensions.json`](schemas/finding.extensions.json) | Motion-specific extension to the base finding schema (`mo_trigger_pattern`, `wcag_sc`) |
| [`CHANGELOG.md`](CHANGELOG.md) | Version history and hardening trail |
| [`evidence/PT0-candidates.md`](evidence/PT0-candidates.md) | Ranked PT0 target shortlist + exit criteria |

## How to invoke

If running through Claude Code or the skill harness:

> Run motion-sensitivity audit on `<target>`

See [`skill/SKILL.md`](skill/SKILL.md) for the full trigger list, inputs, outputs, and procedure.

## Lifecycle reminder

Per [`../../shared/audit-lifecycle.md`](../../shared/audit-lifecycle.md), this audit reached **Pressure-tested** when PT0 landed in [`evidence/pt0-linear/`](evidence/pt0-linear/) with findings + scorecard + remediation and the rubric did not change. The next transition — **Pressure-tested → Frozen** — requires a *second* pressure test (PT1) on a different target where the rubric again does not change. A motion-heavy site with flashing media (to exercise the Section 0 seizure Critical with a PEAT pass) is the natural PT1 candidate.
