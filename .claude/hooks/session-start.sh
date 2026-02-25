#!/bin/bash
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

# Install dependencies
npm install

# Regenerate barrel export so src/lib/index.ts is always up to date
"$CLAUDE_PROJECT_DIR/.claude/hooks/generate-barrel.sh"
