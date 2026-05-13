#!/usr/bin/env node
/**
 * verify-links.mjs
 *
 * Verifies that every relative markdown link in every *.md file in the repo
 * resolves to an existing file. Skips:
 *   - External links (http/https/mailto/tel/anchor-only)
 *   - Links inside fenced code blocks (```...```)
 *   - Links inside inline code spans (`...`)
 *
 * Exits 0 if all relative links resolve. Exits 1 if any are broken.
 *
 * Run: `node scripts/verify-links.mjs`  or  `npm run verify:links`
 */

import { readFile, stat } from 'node:fs/promises';
import { glob } from 'glob';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');

const MD_GLOB = '**/*.md';
const IGNORE = [
  'node_modules/**',
  'site/node_modules/**',
  'site/dist/**',
  'site/.astro/**',
  // Starlight handbook content uses URL-style links (e.g. `../architecture/`)
  // that resolve via Astro routing, not filesystem. `npm run build` is the
  // validator for those — broken Starlight links fail the build.
  'site/src/content/docs/**',
  '.git/**',
];

const LINK_RE = /(!?)\[([^\]]*)\]\(([^)\s]+?)(?:\s+"[^"]*")?\)/g;
const FENCED_CODE_RE = /^( {0,3})(`{3,}|~{3,})[^\n]*\n[\s\S]*?\n\1\2\s*$/gm;
const INLINE_CODE_RE = /`+[^`\n]*?`+/g;

function isExternal(href) {
  return /^([a-z]+:)?\/\//i.test(href) || href.startsWith('mailto:') || href.startsWith('tel:');
}

function isAnchor(href) {
  return href.startsWith('#');
}

function stripAnchor(href) {
  const i = href.indexOf('#');
  return i === -1 ? href : href.slice(0, i);
}

function stripCode(content) {
  // Replace fenced and inline code with same-length whitespace to preserve
  // line counts and offsets (useful for future debug).
  return content
    .replace(FENCED_CODE_RE, (m) => m.replace(/[^\n]/g, ' '))
    .replace(INLINE_CODE_RE, (m) => ' '.repeat(m.length));
}

async function pathExists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const files = await glob(MD_GLOB, { cwd: REPO_ROOT, absolute: true, ignore: IGNORE });
  if (files.length === 0) {
    console.error('No markdown files found.');
    process.exit(1);
  }

  let broken = 0;
  let checked = 0;
  for (const file of files) {
    const rel = path.relative(REPO_ROOT, file);
    const raw = await readFile(file, 'utf8');
    const content = stripCode(raw);
    const dir = path.dirname(file);

    let m;
    LINK_RE.lastIndex = 0;
    while ((m = LINK_RE.exec(content)) !== null) {
      const href = m[3];
      if (isExternal(href) || isAnchor(href)) continue;

      checked++;
      const target = path.resolve(dir, stripAnchor(href));
      // eslint-disable-next-line no-await-in-loop
      const exists = await pathExists(target);
      if (!exists) {
        broken++;
        console.error(`[BROKEN] ${rel} -> ${href}`);
      }
    }
  }

  if (broken > 0) {
    console.error(`\n${broken} broken link(s) of ${checked} relative link(s) across ${files.length} markdown file(s).`);
    process.exit(1);
  }
  console.log(`All ${checked} relative link(s) resolve across ${files.length} markdown file(s).`);
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(2);
});
