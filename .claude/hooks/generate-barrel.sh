#!/bin/bash
set -euo pipefail

# Resolve project root from CLAUDE_PROJECT_DIR or git
PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(git -C "$(dirname "${BASH_SOURCE[0]}")" rev-parse --show-toplevel)}"
LIB_DIR="$PROJECT_DIR/src/lib"

{
  echo "// Auto-generated barrel export. Do not edit manually."
  echo "// Run .claude/hooks/generate-barrel.sh to regenerate."
  echo ""
  find "$LIB_DIR" -maxdepth 1 -name "*.ts" \
    ! -name "*.test.ts" \
    ! -name "*.spec.ts" \
    ! -name "index.ts" \
    ! -name "defaultProductRepository.ts" \
    ! -name "prismaProductRepository.ts" \
    | sort \
    | while read -r file; do
        module="${file##*/}"
        module="${module%.ts}"
        echo "export * from \"./${module}\";"
      done
} > "$LIB_DIR/index.ts"

echo "Barrel regenerated: src/lib/index.ts"
