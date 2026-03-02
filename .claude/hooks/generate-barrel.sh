#!/bin/bash
set -euo pipefail

# Resolve project root from CLAUDE_PROJECT_DIR or git
PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(git -C "$(dirname "${BASH_SOURCE[0]}")" rev-parse --show-toplevel)}"
LIB_DIR="$PROJECT_DIR/src/lib"

# Files excluded from barrel export:
#   stubProductRepository   — test-only stub with hardcoded fixtures; not for production use
#   inMemoryProductRepository — test infrastructure; imported directly in tests, not via barrel
#   prismaProductRepository — server-only; importing via barrel would pull Prisma into client bundles
#   signatureDishes         — imported directly at its specific path, not via barrel
EXCLUDED=(
  "stubProductRepository"
  "inMemoryProductRepository"
  "prismaProductRepository"
  "signatureDishes"
)

is_excluded() {
  local module="$1"
  for excluded in "${EXCLUDED[@]}"; do
    if [[ "$module" == "$excluded" ]]; then
      return 0
    fi
  done
  return 1
}

{
  echo "// Auto-generated barrel export. Do not edit manually."
  echo "// Run .claude/hooks/generate-barrel.sh to regenerate."
  echo ""
  find "$LIB_DIR" -maxdepth 1 -name "*.ts" \
    ! -name "*.test.ts" \
    ! -name "*.spec.ts" \
    ! -name "index.ts" \
    | sort \
    | while read -r file; do
        module="${file##*/}"
        module="${module%.ts}"
        if ! is_excluded "$module"; then
          echo "export * from \"./${module}\";"
        fi
      done
} > "$LIB_DIR/index.ts"

echo "Barrel regenerated: src/lib/index.ts"
