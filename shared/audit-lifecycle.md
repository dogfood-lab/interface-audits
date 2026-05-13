# Audit lifecycle

Each audit advances through five states. State is declared at the top of the audit's `README.md` as `state: <state>`.

## States

| State | Meaning | Required to enter |
|---|---|---|
| **Draft** | Rubric exists; not yet pressure-tested against a real target | `RUBRIC.md` authored |
| **Pressure-tested** | At least one pressure test completed; findings produced; rubric may have been revised | One PT in `evidence/<pt-id>/` with findings + scorecard + remediation |
| **Frozen** | Rubric version cut; future revisions only via new calibrating evidence | A pressure test where the rubric did NOT change; version frozen in `CHANGELOG.md` |
| **Dogfooded** | Audit has been applied to at least one surface the maintainer owns, without rubric churn | One dogfood run in `evidence/dogfood-<n>-<target>/` |
| **Revised** | A pressure test or dogfood run produced calibration evidence; rubric advanced to next version | New CHANGELOG entry citing the evidence run |

## Transitions

- **Draft → Pressure-tested**: requires real-target evidence
- **Pressure-tested → Frozen**: requires a PT where the rubric did NOT change
- **Frozen → Dogfooded**: requires a dogfood run with no rubric change
- **Dogfooded → Revised**: requires a future PT/dogfood producing calibrating evidence

States can be combined when relevant: an audit can be "Frozen v0.2 + Dogfooded once."

## The "no evidence, no official audit" rule

An audit declared as Frozen/Dogfooded/Revised but missing the corresponding evidence directories is not an official audit. Mechanically inspectable:

- Frozen requires a PT where the rubric was not modified
- Dogfooded requires at least one `evidence/dogfood-*/` run
- Revised requires a new `CHANGELOG.md` entry citing evidence

A Draft-only audit may sit in the repo, but it must be labeled `state: Draft` in its README. Drafts do not get listed in the root README's "Current audits" table.

## Declaring state in README

Each audit's `README.md` starts with three header lines parseable by simple grep:

```
state: Frozen v0.2 + Dogfooded once
audit_prefix: CL
catches: load displacement (memory, search, trust, verification, navigation, configuration, source recovery, visual decoding, time, recovery/undo, feature loss)
```

`grep "^state: " audits/*/README.md` tells you the lifecycle state of every audit at once.
