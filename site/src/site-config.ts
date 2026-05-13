import type { SiteConfig } from '@mcptoolshop/site-theme';

export const config: SiteConfig = {
  title: 'interface-audits',
  description: 'Proof-backed audits for human-facing product surfaces. Catches load displacement, hidden complexity, AI trust burden, and state-shift failure — failures that pass generic accessibility scanners.',
  logoBadge: 'IA',
  brandName: 'interface-audits',
  repoUrl: 'https://github.com/dogfood-lab/interface-audits',
  footerText: 'MIT Licensed — part of <a href="https://github.com/dogfood-lab" style="color:var(--color-muted);text-decoration:underline">dogfood-lab</a>, sister to <a href="https://github.com/mcp-tool-shop-org" style="color:var(--color-muted);text-decoration:underline">mcp-tool-shop-org</a>',

  hero: {
    badge: 'v0.1.0 · MIT',
    headline: 'Reduce the Burden.',
    headlineAccent: 'Improve the Experience.',
    description: 'Proof-backed audits for human-facing product surfaces. Generic scanners catch WCAG violations. These audits catch interfaces that pass scanners but still make users hunt — load displacement, hidden complexity, AI trust burden, state-shift failure.',
    primaryCta: { href: 'https://github.com/dogfood-lab/interface-audits', label: 'View on GitHub' },
    secondaryCta: { href: 'handbook/', label: 'Read the Handbook' },
    previews: [
      { label: 'Invoke', code: 'Run cognitive-load audit on https://example.com' },
      { label: 'Outputs', code: 'audits/cognitive-load/evidence/<run-id>/\n├── cognitive-load-findings.md\n├── cognitive-load-scorecard.json\n└── remediation-priority-list.md' },
      { label: 'Verify', code: 'npm run verify  # schemas + links + shipcheck' },
    ],
  },

  sections: [
    {
      kind: 'features',
      id: 'features',
      title: 'What makes these different',
      subtitle: 'Catches the failures generic scanners miss.',
      features: [
        {
          title: 'Names where the load went',
          desc: 'Every finding declares one or more values from an 11-item enum (search, memory, trust, source recovery, navigation, configuration, visual decoding, time, recovery/undo, feature loss, verification). No vague "this is hard to use" findings.',
        },
        {
          title: 'Schema-validated outputs',
          desc: 'Findings and scorecards conform to JSON Schema (shared/schemas/). CI rejects malformed evidence. The audit walks its own talk.',
        },
        {
          title: 'No evidence, no official audit',
          desc: 'Each audit must ship four things: Rubric, Skill, Schema, and at least one Evidence run. Lifecycle states (Draft → Pressure-tested → Frozen → Dogfooded → Revised) are declared in each audit\'s README.',
        },
        {
          title: 'Honest evidence states',
          desc: 'Findings are marked Observed, Inferred, or Open question. Findings without evidence are downgraded to Open questions, not laundered into confirmed issues. The Inferred fallback is the brake against manufacturing findings.',
        },
        {
          title: 'Sub-taxonomy for power preservation',
          desc: 'Section 5 distinguishes Compressed (Pass), Delayed (Medium), Hidden (High), and Removed (Critical) — separating "the icon got smaller" from "the feature is unavailable in this mode."',
        },
        {
          title: 'AI compression risk, calibrated',
          desc: 'Section 4 has a severity precondition: Critical only when a source was promised, claimed, fetched, or replaced. Generic unsourced model output is High/Medium provenance ambiguity. Prevents over-firing on every chatbot.',
        },
      ],
    },
    {
      kind: 'code-cards',
      id: 'audits',
      title: 'Current audits',
      cards: [
        {
          title: 'cognitive-load',
          code: 'state: Frozen v0.2 + Dogfooded once\naudit_prefix: CL\ncatches: load displacement\n\n# 4 evidence runs:\n#   pt0/                       claude.ai live\n#   pt1-github-narrow/         responsive audit\n#   pt2-outlook-doc-fallback/  vendor docs + reclassification\n#   dogfood-1-research-os/     own tool — clean Warn',
        },
        {
          title: 'Invoke via Claude',
          code: '> Run cognitive-load audit on https://your.app/dashboard\n\n# Produces:\n#   findings.md  scorecard.json  remediation-priority-list.md',
        },
      ],
    },
    {
      kind: 'code-cards',
      id: 'usage',
      title: 'Local verify tooling',
      cards: [
        {
          title: 'Clone + install',
          code: 'git clone https://github.com/dogfood-lab/interface-audits.git\ncd interface-audits\nnpm install',
        },
        {
          title: 'Run all checks',
          code: 'npm run verify  # schemas + links + shipcheck audit\nnpm run verify:schemas\nnpm run verify:links',
        },
      ],
    },
  ],
};
