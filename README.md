<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português (BR)</a>
</p>

<p align="center">
  <img src="./.brand/readme.png" alt="interface-audits — Reduce the Burden. Improve the Experience." width="400">
</p>

<p align="center">
  <a href="https://github.com/dogfood-lab/interface-audits/actions/workflows/verify.yml"><img src="https://github.com/dogfood-lab/interface-audits/actions/workflows/verify.yml/badge.svg" alt="verify"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT License"></a>
  <a href="https://dogfood-lab.github.io/interface-audits/"><img src="https://img.shields.io/badge/handbook-live-2da44e?logo=github" alt="Handbook"></a>
  <a href="./SHIP_GATE.md"><img src="https://img.shields.io/badge/shipcheck-passed-2da44e" alt="Shipcheck passed"></a>
</p>

<p align="center"><em>Proof-backed audits for human-facing product surfaces.</em></p>

---

## What this is

`interface-audits` is a library of audit rubrics and the executable skills that run them. Each audit catches a specific class of user-facing failure that generic accessibility scanners miss. Scanners catch WCAG violations; these audits catch interfaces that **pass scanners but still make users hunt**.

The first audit in this library is **Cognitive Load**, which catches load displacement: interfaces that displace burden onto memory, search, trust, verification, navigation, configuration, source recovery, visual decoding, time, recovery/undo, or feature loss.

Each audit ships four things:

1. **Rubric** — doctrine, sections, severity rules ([`audits/cognitive-load/RUBRIC.md`](audits/cognitive-load/RUBRIC.md))
2. **Skill** — invocation contract and procedure ([`audits/cognitive-load/skill/SKILL.md`](audits/cognitive-load/skill/SKILL.md))
3. **Schema** — JSON Schema for findings and scorecards ([`shared/schemas/`](shared/schemas/))
4. **Evidence** — at least one completed pressure test or dogfood run ([`audits/cognitive-load/evidence/`](audits/cognitive-load/evidence/))

No evidence, no official audit. See [`shared/audit-lifecycle.md`](shared/audit-lifecycle.md) for the state machine.

## Install

Most consumers do not "install" this repo — they read it. The audits are markdown rubrics and skills interpreted by [Claude](https://claude.ai) or another compatible AI runner with appropriate MCP tools (browser navigation, screenshot, DOM read).

For maintainers who want to run the local verify tooling (schema validation, link checks, shipcheck audit):

```bash
git clone https://github.com/dogfood-lab/interface-audits.git
cd interface-audits
npm install        # installs ajv, ajv-formats, glob (dev-only)
npm run verify     # runs schema + link + shipcheck checks
```

**Requirements:** Node 20+ for the verify tooling. The audits themselves are platform-agnostic markdown.

## Usage

### Running an audit

Invoke through Claude (or a compatible runner):

> Run cognitive-load audit on `<target-url-or-surface>`

See [`audits/cognitive-load/skill/SKILL.md`](audits/cognitive-load/skill/SKILL.md) for the full trigger list, inputs, outputs, and procedure.

### Reading existing audits

Past audit runs live under `audits/<name>/evidence/<run-id>/` and consist of three files:

- `<audit>-findings.md` — full findings in rubric format
- `<audit>-scorecard.json` — per-section pass/warn/fail + summary
- `remediation-priority-list.md` — findings ordered by severity × leverage

The current audits and their evidence trails are in the [Current audits](#current-audits) table below.

### Authoring a new audit

A new audit goes through five lifecycle states: Draft → Pressure-tested → Frozen → Dogfooded → Revised. See [`shared/audit-lifecycle.md`](shared/audit-lifecycle.md) for the state machine, [`shared/pressure-test-protocol.md`](shared/pressure-test-protocol.md) for the procedure, and the cognitive-load audit at `audits/cognitive-load/` as a reference implementation.

## Threat surface

When an audit skill is invoked, the runner (Claude with appropriate MCP tools) performs operations against the target the user supplied:

- **Network egress** — only to the target URL the user named. Skills do not call other services.
- **DOM and screenshot capture** — the skill may read the page DOM, take screenshots, and inspect responsive CSS classes. Captured content may include anything visible on the user's authenticated session at the target URL, including names, message bodies, and account state.
- **Local file writes** — evidence files are written into `audits/<name>/evidence/<run-id>/` under the repo's working tree only. Skills do not write outside this scope.
- **No outbound transmission of evidence** — evidence files stay on local disk unless the user explicitly commits and pushes them.
- **No telemetry, no secrets handling** — this repo collects no analytics and reads no credentials.

Before committing evidence files to a public repository, the user is responsible for reviewing what was captured. See [`SECURITY.md`](SECURITY.md) for the full threat model, vulnerability reporting policy, and scope.

## Current audits

| Audit | State | Catches | Evidence |
|---|---|---|---|
| [cognitive-load](audits/cognitive-load/) | Frozen v0.2 + Dogfooded once | Load displacement, hidden complexity, AI trust burden, state-shift failure | PT0 (claude.ai), PT1 (GitHub), PT2-doc-fallback (Outlook), Dogfood-1 (research-os handbook) |

## Audit family

Each audit must declare *what burden does this audit catch that generic scanners miss?* For Cognitive Load, the answer is load displacement.

Future audits in this family may include Low-Vision (visual access under real density), Screen Reader Task (task continuity, not just ARIA validity), Color Dependence, Motor Access, Motion Sensitivity, and AI Trust Surface. Audits are added one at a time, with evidence, when a real target justifies the work — not by speculation.

## Repository structure

```
interface-audits/
├── README.md
├── CHANGELOG.md                       # monorepo events
├── SECURITY.md                        # threat surface + reporting
├── SHIP_GATE.md                       # shipcheck quality gate
├── SCORECARD.md                       # pre/post-treatment scores
├── LICENSE                            # MIT
├── package.json                       # verify tooling + Node engines
├── verify.sh                          # one-command verification
├── scripts/
│   ├── verify-schemas.mjs             # JSON Schema validation
│   └── verify-links.mjs               # markdown relative-link check
├── shared/                            # cross-audit norms
│   ├── audit-lifecycle.md
│   ├── evidence-states.md
│   ├── severity-model.md
│   ├── finding-format.md
│   ├── pressure-test-protocol.md
│   └── schemas/
│       ├── finding.base.schema.json
│       └── scorecard.base.schema.json
└── audits/
    └── cognitive-load/                # first audit
        ├── README.md
        ├── RUBRIC.md
        ├── CHANGELOG.md
        ├── skill/SKILL.md
        ├── schemas/finding.extensions.json
        └── evidence/                  # pressure tests + dogfood runs
```

## What this is not

- Not a WCAG conformance scanner (use [axe](https://www.deque.com/axe/), [Lighthouse](https://developer.chrome.com/docs/lighthouse), [Pa11y](https://pa11y.org/) for that)
- Not a visual design review
- Not a generic accessibility checklist
- Not a published npm package (yet — `package.json` declares `private: true` until a runner package is split out)

The audits in this repo are intended to fire on interfaces that **pass scanners but still make users hunt**.

## Contributing

This repo is currently maintained by [dogfood-lab](https://github.com/dogfood-lab). External contributions are welcome — open an issue first to discuss any new audit or rubric change. Per the lifecycle: no evidence, no official audit.

## License

[MIT](LICENSE) — Copyright (c) 2026 dogfood-lab.

---

<p align="center">
  <em>Part of <a href="https://github.com/dogfood-lab">dogfood-lab</a> — sister to <a href="https://github.com/mcp-tool-shop-org">mcp-tool-shop-org</a>.</em>
</p>
