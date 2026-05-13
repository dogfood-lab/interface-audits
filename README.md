# Interface Audits

Proof-backed audits for human-facing product surfaces.

These audits are not generic accessibility scans. They are structured review methods for finding where products displace burden onto users: memory, search, trust, verification, navigation, configuration, recovery, or feature loss. Scanners catch WCAG violations. These audits catch interfaces that pass scanners but still make users hunt.

## Repository structure

```
interface-audits/
├── README.md
├── CHANGELOG.md                      # monorepo events
├── shared/                           # cross-audit norms
│   ├── audit-lifecycle.md
│   ├── evidence-states.md
│   ├── severity-model.md
│   ├── finding-format.md
│   ├── pressure-test-protocol.md
│   └── schemas/
│       ├── finding.base.schema.json
│       └── scorecard.base.schema.json
└── audits/
    └── cognitive-load/               # first audit
        ├── README.md
        ├── RUBRIC.md
        ├── CHANGELOG.md
        ├── skill/SKILL.md
        ├── schemas/finding.extensions.json
        └── evidence/                 # pressure tests + dogfood runs
```

## What counts as an audit

Each audit must ship four things before it counts as an official audit in this repo:

1. **Rubric** — the doctrine and sections
2. **Skill** — the executable audit runner
3. **Schema** — finding and scorecard format (base + any audit-specific extensions)
4. **Evidence** — at least one completed pressure test or dogfood run

No evidence, no official audit. See [`shared/audit-lifecycle.md`](shared/audit-lifecycle.md) for the state machine.

## Audit family

Each audit must declare *what burden does this audit catch that generic scanners miss?* For Cognitive Load, the answer is load displacement.

Future audits in this family may include Low-Vision (visual access under real density), Screen Reader Task (task continuity, not just ARIA validity), Color Dependence, Motor Access, Motion Sensitivity, and AI Trust Surface. Audits are added one at a time, with evidence, when a real target justifies the work. Not by speculation.

## Current audits

| Audit | State | Catches |
|---|---|---|
| [cognitive-load](audits/cognitive-load/) | Frozen v0.2 + Dogfooded once | Load displacement, hidden complexity, AI trust burden, state-shift failure |

## What this is not

- Not a WCAG conformance scanner (use axe, Lighthouse, Pa11y for that)
- Not a visual design review
- Not a generic accessibility checklist

The audits in this repo are intended to fire on interfaces that pass scanners but still make users hunt.
