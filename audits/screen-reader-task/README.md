state: Draft
audit_prefix: SR
catches: task continuity and completion through a screen reader (landmark quality, action discoverability, task-path continuity, dynamic-update handling, error recovery) — not just ARIA validity

# Screen Reader Task Audit

## What burden this catches

This audit catches interfaces that pass ARIA validators but still cannot be *finished* with a screen reader — forms that read as valid but cannot be submitted, single-page apps that swap views and leave the screen reader behind, dynamic updates that fire into a region nobody hears, errors the user cannot perceive, and modals that leak the page behind them.

Automated checkers answer "is the ARIA valid?" This audit answers "can a screen reader user complete the task?" — find what to do, do it, recover when it fails, and always know where they are.

The audit's law:

> A screen reader experience is not accessible because it is valid. It is accessible only when an assistive-technology user can **complete the task** — find what to do, do it, recover when it fails, and always know where they are. Valid ARIA that does not complete the task is not access. It is the appearance of access.

## The discriminator from axe / ARIA validators

Axe and the other validators check ARIA **validity**: does the role exist, is the attribute spelled right, is the accessible name non-empty. This audit checks whether the experience **completes the task** — a fundamentally different question. A screen reader walking a form that *passes axe* may still be unable to submit it. Validity is necessary and not sufficient; every section keeps the completion framing.

## State

**Draft — rubric authored, not yet pressure-tested.** The rubric is written and research-grounded (21 verified findings). It has not yet survived contact with a live target. No pressure tests, no dogfood runs, no frozen version. The PT0 candidate shortlist is in [`evidence/PT0-candidates.md`](evidence/PT0-candidates.md).

Per [`../../shared/audit-lifecycle.md`](../../shared/audit-lifecycle.md), a Draft audit is not listed in the root README's "Current audits" table until it reaches Pressure-tested.

See [`CHANGELOG.md`](CHANGELOG.md) for version history.

## Files

| Path | What |
|---|---|
| [`RUBRIC.md`](RUBRIC.md) | Canonical audit doctrine — 8 sections, the Screen Reader Task Law, Section 4 severity precondition, `AT/browser pairs` field, Research grounding |
| [`skill/SKILL.md`](skill/SKILL.md) | Executable skill that runs the audit |
| [`schemas/finding.extensions.json`](schemas/finding.extensions.json) | Screen-reader-specific extension to the base finding schema (`AT/browser pairs`) |
| [`CHANGELOG.md`](CHANGELOG.md) | Version history |
| [`evidence/PT0-candidates.md`](evidence/PT0-candidates.md) | Ranked PT0 target shortlist and exit criteria |

## Research grounding

The audit's existence is an empirical claim. Conformance-only auditing systematically misses the majority of real screen reader task failures: automated tools find ~57% of issues by volume and cover ~32% of WCAG 2.1 AA criteria (Deque 2021), 49.6% of real task problems map to no WCAG Success Criterion (Power et al. 2012), and a traversal-aware LLM checker still left a 38-point coverage gap against semantic, task-level failures (Zhong et al. 2025). The full grounding — 21 verified findings, each connected to the section it justifies — is in [`RUBRIC.md`](RUBRIC.md#research-grounding).

## Hard-failure patterns this audit detects

1. **Passes axe, cannot be submitted** — a form reads as valid but the action is unannounced or the validation error is silent (Section 1 Action discoverability + Section 4 Error recovery)
2. **The view changed and the screen reader was left behind** — a client-side route change leaves focus on the trigger or on a bare wrapper, announcing nothing (Section 2 Task path continuity)
3. **The page changed under the user and they never heard it** — a dynamic update with no live region, or a live region pre-populated at insertion (Section 3 Dynamic update handling)
4. **The user cannot tell whether they failed or simply missed it** — an error/empty state with no landmark, live region, or heading (Section 4 Error recovery, the NKWYDK pattern)

None of these has been pressure-tested yet. The PT0 shortlist in [`evidence/PT0-candidates.md`](evidence/PT0-candidates.md) is chosen to exercise them.

## How to invoke

If running through Claude Code or the skill harness:

> Run screen-reader-task audit on `<target>`

See [`skill/SKILL.md`](skill/SKILL.md) for the full trigger list, inputs, outputs, and procedure. The audit is run against a **task** (complete and submit a form; find and open a record; correct an error and retry), on **named AT/browser pairs**, not against a page in the abstract.
