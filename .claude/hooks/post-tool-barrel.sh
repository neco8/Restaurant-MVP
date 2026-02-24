#!/bin/bash
set -euo pipefail

# Read tool use info from stdin (provided by Claude Code)
INPUT=$(cat)

# Extract the file path written by the Write or Edit tool
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty' 2>/dev/null || true)

# Only regenerate when a non-test, non-index .ts file inside src/lib/ was written
if [[ "$FILE_PATH" =~ src/lib/[^/]+\.ts$ ]] \
  && [[ ! "$FILE_PATH" =~ \.(test|spec)\.ts$ ]] \
  && [[ ! "$FILE_PATH" =~ /index\.ts$ ]]; then
    "$(dirname "${BASH_SOURCE[0]}")/generate-barrel.sh"
fi
