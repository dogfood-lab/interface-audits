# Finding format

Every finding produced by any audit in this repo follows the same contract. Audits may add fields via their `schemas/finding.extensions.json`; they may not remove or redefine base fields.

## Required fields

```
## Finding {AUDIT-PREFIX}-{NN} — {short title}

Severity: {Critical | High | Medium | Low}
Section: {section name}
Surface: {where in the product}
Load displaced to: {one or more from the enum below}
Evidence state: {Observed | Inferred | Open question}

Issue:
{One paragraph describing what the interface does.}

Why it matters:
{One paragraph naming the cognitive cost.}

Evidence:
{State, surface, dataset, user profile, screenshot reference. Required.}

Fix:
{One paragraph. Should preserve power, control, source access, and discoverability.}
```

Findings without the Evidence line are downgraded to Open questions. See [`evidence-states.md`](evidence-states.md).

## Load-displaced-to enum

The `Load displaced to:` field uses one or more values from this enum:

- `search` — user must run a query instead of recognizing
- `memory` — user must remember a label, location, or icon meaning
- `trust` — user must accept output without ability to verify
- `verification` — user must leave the surface to confirm a claim
- `navigation` — user must traverse multiple pages or surfaces
- `configuration` — user must change settings to use the surface
- `source recovery` — original source is hidden or stripped from output
- `visual decoding` — typography, density, or contrast force decoding effort
- `time` — task that should be near-instant takes measurable seconds
- `recovery / undo` — user must reconstruct work after a destructive or lossy action
- `feature loss` — capability is removed rather than compressed

This is the audit's heart. Findings with vague displacement targets are weaker findings. "Other" is not an option.

## Audit-specific extensions

Audits may add optional fields to the finding format via their `schemas/finding.extensions.json`. Examples from the cognitive-load audit:

- `Section 5 taxonomy: {compressed | delayed | hidden | removed}` — required for Section 5 (Power Preservation) findings, omitted (or `n/a`) for findings in other sections

Extensions add fields. They do not redefine or remove fields from the base contract. A new audit cannot, for example, replace `Severity` with a different scale or remove `Load displaced to:`.

## Audit ID prefix

Each audit uses a short prefix for its finding IDs to keep references unique across the repo:

- Cognitive Load: `CL`
- Future audits should pick a 2-4 letter prefix and declare it in their README under `audit_prefix:`

The prefix lets a reader say "CL-04 from PT0" or "LV-12 from dogfood-2" without ambiguity.
