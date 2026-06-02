state: Pressure-tested v0.1.0 (PT0 on GOV.UK Design System, 2026-06-02)
audit_prefix: MA
catches: interaction cost for motor-impaired users (keyboard-path completeness, pointer precision / target size, drag dependence, timeout pressure, undo/error recovery)

# Motor Access Audit

## What burden this catches

This audit catches interfaces that pass standard accessibility scanners but still cost motor-impaired users more effort, more precision, or more speed than the task should require — controls reachable only by mouse, targets too small to hit without a steady hand, reorder and kanban interactions that only work by drag, session timeouts a switch-input user cannot beat, and mis-activations with no way back.

Generic accessibility audits answer "is this perceivable and labelled?" This audit answers "is this *operable* without precise hands, sustained holds, or a fast clock?" — and crucially, a scanner pass does not settle the question: Google's Accessibility Scanner recalls only ~50.85% of real visual touch-target violations, because it checks metadata bounds, not rendered bounds (MotorEase / ICSE 2024).

The audit's law:

> A task that is completable only with precise, sustained, or fast pointer input is not accessible — it is *expensive*. Any interface that requires a mouse, a drag, a small-target hit, or an act-within-N-seconds where a single click, a keyboard path, a larger target, or more time would do has not made the task harder to understand. It has made it harder to *perform*.

## State

**Draft — rubric authored, not yet pressure-tested.** The rubric exists and is research-grounded (29 verified findings from the motor-access literature), but no pressure test has been run against a real target yet. Per the lifecycle rule, a Draft audit is not an official audit until it has at least one pressure test in `evidence/<pt-id>/`. The PT0 target shortlist is in [`evidence/PT0-candidates.md`](evidence/PT0-candidates.md).

See [`CHANGELOG.md`](CHANGELOG.md) for version history and [`../../shared/audit-lifecycle.md`](../../shared/audit-lifecycle.md) for the state machine.

## Files

| Path | What |
|---|---|
| [`RUBRIC.md`](RUBRIC.md) | Canonical audit doctrine — 8 sections, the Motor Access Law, research grounding, severity preconditions |
| [`skill/SKILL.md`](skill/SKILL.md) | Executable skill that runs the audit |
| [`schemas/finding.extensions.json`](schemas/finding.extensions.json) | Motor-access-specific extension to the base finding schema |
| [`CHANGELOG.md`](CHANGELOG.md) | Version history and pending changes |
| [`evidence/PT0-candidates.md`](evidence/PT0-candidates.md) | Ranked shortlist of PT0 calibration targets |

## Research grounding

This audit is grounded in the empirical motor-access literature rather than first-principles improvisation. The full numbered finding list — target-size error multipliers for motor-impaired users (Chen 2013), the absolute-precision floor that defeats "slow down and aim" (Bi 2013, FFitts Law), the 55% drag-failure rate (Trewin & Pain 1999), the 3–5x drag error penalty (MacKenzie/Sellen 1991), switch-scan input at ~1.7 WPM (Koester & Arthanat 2018), and the scanner recall gap (MotorEase / ICSE 2024) — is in the "Research grounding" section of [`RUBRIC.md`](RUBRIC.md), with each finding tied to the section, question, or severity it justifies.

## Hard-failure patterns this audit detects

1. **A control works only with a mouse** — no keyboard path, or a keyboard trap (Section 0 Keyboard Path)
2. **A target is too small or too crowded to hit reliably** under tremor or limited fine control (Section 1 Pointer Precision)
3. **A reorder, slider, board, or upload only works by drag** with no single-pointer alternative (Section 2 Drag Dependence)
4. **A timeout or auto-advance moves faster than the user can act**, and cannot be extended (Section 3 Timeout Pressure)
5. **A mis-activation has no cheap way back** — no up-event activation, no confirmation, no undo (Section 4 Undo / Recovery + Section 5 Error Recovery)

The boundary that runs through all five: distinguish **exclusion** (impossible without a mouse / a drag / a fast hand — Critical) from **cost** (possible but high-effort, high-precision, or time-pressured — scales Low to High). See the boundary rule in [`RUBRIC.md`](RUBRIC.md).

None of these patterns has been pressure-tested yet — this is a Draft. The PT0 shortlist in [`evidence/PT0-candidates.md`](evidence/PT0-candidates.md) names the targets that would exercise each one.

## How to invoke

If running through Claude Code or the skill harness:

> Run motor-access audit on `<target>`

See [`skill/SKILL.md`](skill/SKILL.md) for the full trigger list, inputs, outputs, and procedure.
