#!/usr/bin/env bash
# verify.sh
#
# Single-command verification for interface-audits. Runs:
#   1. JSON Schema validation for every scorecard
#   2. Relative-link check for every markdown file
#   3. Shipcheck audit (hard gates A–D)
#
# Exits 0 only if all three succeed.
#
# Run: `bash verify.sh`  or  `npm run verify`

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$REPO_ROOT"

step() {
  echo ""
  echo "==> $1"
}

# Ensure node deps are present (ajv, glob).
if [ ! -d node_modules ]; then
  step "Installing dev dependencies (first run)"
  npm install --no-audit --no-fund --silent
fi

step "1/3 — JSON Schema validation (scorecards)"
node scripts/verify-schemas.mjs

step "2/3 — Markdown relative-link check"
node scripts/verify-links.mjs

step "3/3 — Shipcheck audit (hard gates A–D)"
npx -y @mcptoolshop/shipcheck audit

echo ""
echo "verify.sh — all checks passed."
