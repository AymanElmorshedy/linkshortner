#!/usr/bin/env bash

set -euo pipefail

tool_name="$(
  sed -n 's/^[[:space:]]*"toolName"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' |
    head -n 1
)"

if [[ "$tool_name" == "create" || "$tool_name" == "edit" ]]; then
  npx prettier --write .
fi
