#!/bin/bash
set -euo pipefail

FILE="$1"
PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(git -C "$(dirname "${BASH_SOURCE[0]}")" rev-parse --show-toplevel)}"
LIB_DIR="$PROJECT_DIR/src/lib"

# Skip if already imports from @/lib
grep -q 'from "@/lib"' "$FILE" 2>/dev/null && exit 0

TYPES=()
VALUES=()

for lib_file in "$LIB_DIR"/*.ts; do
  [[ "$lib_file" =~ (index|test|spec)\.ts$ ]] && continue

  # Type exports: "export type Foo" and "export interface Foo"
  while IFS= read -r name; do
    [[ -n "$name" ]] && TYPES+=("$name")
  done < <(grep -E "^export (type|interface) " "$lib_file" \
    | sed -E 's/^export (type|interface) ([A-Za-z_][A-Za-z0-9_]*).*/\2/' 2>/dev/null || true)

  # Value exports: "export const/function/async function/class/enum"
  while IFS= read -r name; do
    [[ -n "$name" ]] && VALUES+=("$name")
  done < <(grep -E "^export (const|async function|function|class|enum) " "$lib_file" \
    | sed -E 's/^export (async function|function|const|class|enum) ([A-Za-z_][A-Za-z0-9_]*).*/\2/' 2>/dev/null || true)
done

[[ ${#TYPES[@]} -eq 0 && ${#VALUES[@]} -eq 0 ]] && exit 0

IMPORT_BLOCK=""
if [[ ${#TYPES[@]} -gt 0 ]]; then
  TYPE_LIST=$(printf '%s, ' "${TYPES[@]}" | sed 's/, $//')
  IMPORT_BLOCK+="import type { $TYPE_LIST } from \"@/lib\";"$'\n'
fi
if [[ ${#VALUES[@]} -gt 0 ]]; then
  VALUE_LIST=$(printf '%s, ' "${VALUES[@]}" | sed 's/, $//')
  IMPORT_BLOCK+="import { $VALUE_LIST } from \"@/lib\";"$'\n'
fi

TMP=$(mktemp)
FIRST_LINE=$(head -1 "$FILE")

# Respect "use client" / "use server" — must stay as the very first line
if [[ "$FIRST_LINE" =~ ^[\"\']use\ (client|server)[\"\'] ]]; then
  head -1 "$FILE" > "$TMP"
  printf '\n%s' "$IMPORT_BLOCK" >> "$TMP"
  tail -n +2 "$FILE" >> "$TMP"
else
  printf '%s\n' "$IMPORT_BLOCK" > "$TMP"
  cat "$FILE" >> "$TMP"
fi

mv "$TMP" "$FILE"
echo "Lib imports prepended to: $(basename "$FILE")"
