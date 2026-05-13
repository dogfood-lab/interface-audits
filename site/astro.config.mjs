// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://dogfood-lab.github.io',
  base: '/interface-audits',
  integrations: [
    starlight({
      title: 'interface-audits',
      description: 'Proof-backed audits for human-facing product surfaces. Catches load displacement, hidden complexity, AI trust burden, and state-shift failure — failures that pass generic accessibility scanners.',
      disable404Route: true,
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/dogfood-lab/interface-audits' },
      ],
      sidebar: [
        {
          label: 'Handbook',
          autogenerate: { directory: 'handbook' },
        },
      ],
      customCss: ['./src/styles/starlight-custom.css'],
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
