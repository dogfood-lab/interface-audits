# Severity model

Every finding carries one of four severities. Section-level results are computed from the distribution of finding severities within the section.

## Severities

| Severity | Base meaning |
|---|---|
| **Critical** | Users in low-bandwidth states cannot complete core tasks. Audits may add domain-specific Critical preconditions (see below). |
| **High** | Significant load displacement in common workflows. Discoverability or configuration cost prevents reaching adaptation controls. |
| **Medium** | Measurable defaults miss WCAG 2.2 thresholds. Hidden load in non-core surfaces. |
| **Low** | Polish-level. Wording, edge-case states, secondary surfaces. |

## Section-Fail threshold

**A single Critical OR three Highs in any one section produces a section-level Fail.** Any section Fail produces an overall audit Fail (`overall_status: fail`).

Compressed and Delayed findings (where the audit uses a sub-taxonomy) warn the section but do not fail it. Hidden findings can fail a section at 3+ Highs without any Critical present.

This threshold has held up across three pressure tests + one dogfood run on the cognitive-load audit:

- PT0 (claude.ai): Section 3 Fail on one Critical, Section 4 Fail on one Critical — both fired correctly
- PT1 (GitHub): Section 5 Warn on 1 High + 3 Medium — correctly held below threshold
- PT2 (Outlook doc-fallback): Section 5 Fail on 4 Highs after honest reclassification — correctly fired on accumulated Hidden findings
- Dogfood 1 (research-os): Overall Warn, no section Fail — correctly identified a healthy target

## Audit-specific preconditions

Audits may add severity preconditions for specific sections. These are domain refinements, not overrides of the base model. Preconditions live in the audit's `RUBRIC.md`, not in this shared doc.

Examples from the cognitive-load audit:

- **Section 4 (AI Compression Risk)** has a precondition: Critical applies only when source was promised, claimed, fetched, or replaced. Generic unsourced model output classifies as High/Medium provenance ambiguity. This prevents over-firing.
- **Section 5 (Power Preservation)** has a sub-taxonomy mapping (Compressed/Delayed/Hidden/Removed) with default severities per category. Compressed = Pass/Low, Delayed = Medium, Hidden = High, Removed = Critical/High.

Preconditions are validated by pressure tests before they enter a frozen rubric. The cognitive-load Section 4 precondition was earned by PT0; the Section 5 sub-taxonomy was earned by PT1.
