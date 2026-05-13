#!/usr/bin/env node
/**
 * verify-schemas.mjs
 *
 * Validates every *-scorecard.json under audits/<audit>/evidence/<run-id>/ against
 * the base scorecard schema (shared/schemas/scorecard.base.schema.json) and every
 * embedded finding against the base finding schema. Audit-specific extensions are
 * allowed (the base schema sets additionalProperties: true).
 *
 * Exits 0 if all scorecards validate. Exits 1 if any do not.
 *
 * Run: `node scripts/verify-schemas.mjs`  or  `npm run verify:schemas`
 */

import { readFile } from 'node:fs/promises';
import { glob } from 'glob';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');

const FINDING_SCHEMA_PATH = path.join(REPO_ROOT, 'shared/schemas/finding.base.schema.json');
const SCORECARD_SCHEMA_PATH = path.join(REPO_ROOT, 'shared/schemas/scorecard.base.schema.json');
const SCORECARD_GLOB = 'audits/*/evidence/*/*-scorecard.json';

async function loadJson(p) {
  return JSON.parse(await readFile(p, 'utf8'));
}

async function main() {
  const findingSchema = await loadJson(FINDING_SCHEMA_PATH);
  const scorecardSchema = await loadJson(SCORECARD_SCHEMA_PATH);

  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats.default ? addFormats.default(ajv) : addFormats(ajv);

  // Register finding schema so $ref "finding.base.schema.json" resolves
  ajv.addSchema(findingSchema, 'finding.base.schema.json');
  const validateScorecard = ajv.compile(scorecardSchema);
  const validateFinding = ajv.compile(findingSchema);

  const files = await glob(SCORECARD_GLOB, { cwd: REPO_ROOT, absolute: true });

  if (files.length === 0) {
    console.error('No scorecards found matching:', SCORECARD_GLOB);
    process.exit(1);
  }

  let failed = 0;
  for (const file of files) {
    const rel = path.relative(REPO_ROOT, file);
    let doc;
    try {
      doc = await loadJson(file);
    } catch (err) {
      console.error(`[FAIL] ${rel} — JSON parse error: ${err.message}`);
      failed++;
      continue;
    }

    const ok = validateScorecard(doc);
    if (!ok) {
      failed++;
      console.error(`[FAIL] ${rel} — scorecard schema:`);
      for (const e of validateScorecard.errors) {
        console.error(`    ${e.instancePath || '/'} ${e.message}` + (e.params ? ` (${JSON.stringify(e.params)})` : ''));
      }
    }

    if (Array.isArray(doc.findings)) {
      doc.findings.forEach((finding, i) => {
        const ok2 = validateFinding(finding);
        if (!ok2) {
          failed++;
          console.error(`[FAIL] ${rel} — finding[${i}] (${finding.id || '?'}):`);
          for (const e of validateFinding.errors) {
            console.error(`    ${e.instancePath || '/'} ${e.message}` + (e.params ? ` (${JSON.stringify(e.params)})` : ''));
          }
        }
      });
    }

    if (failed === 0 || (validateScorecard(doc) && (doc.findings || []).every((f) => validateFinding(f)))) {
      console.log(`[ok]   ${rel}`);
    }
  }

  if (failed > 0) {
    console.error(`\n${failed} validation failure(s).`);
    process.exit(1);
  }
  console.log(`\nAll ${files.length} scorecard(s) valid against base schemas.`);
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(2);
});
