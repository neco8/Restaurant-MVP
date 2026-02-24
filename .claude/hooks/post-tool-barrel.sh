#!/bin/bash
set -euo pipefail

# Read tool use info from stdin (provided by Claude Code)
INPUT=$(cat)

# Extract the file path and tool name
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty' 2>/dev/null || true)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty' 2>/dev/null || true)

# Trigger 1: non-test, non-index .ts file inside src/lib/ written → regenerate barrel
if [[ "$FILE_PATH" =~ src/lib/[^/]+\.ts$ ]] \
  && [[ ! "$FILE_PATH" =~ \.(test|spec)\.ts$ ]] \
  && [[ ! "$FILE_PATH" =~ /index\.ts$ ]]; then
    "$(dirname "${BASH_SOURCE[0]}")/generate-barrel.sh"
fi

# Trigger 2: new non-test component .ts/.tsx file written → prepend lib imports
if [[ "$TOOL_NAME" == "Write" ]] \
  && [[ "$FILE_PATH" =~ src/components/[^/]+\.tsx?$ ]] \
  && [[ ! "$FILE_PATH" =~ \.(test|spec)\.tsx?$ ]]; then
    "$(dirname "${BASH_SOURCE[0]}")/prepend-lib-imports.sh" "$FILE_PATH"
fi
