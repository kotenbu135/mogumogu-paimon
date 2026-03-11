#!/bin/bash
# plan-gate.sh — Warning if implementing code without an approved spec
# Source: pm-workspace (https://github.com/gonzalezpazmonica/pm-workspace)
# License: MIT

FILE="${CLAUDE_TOOL_INPUT_FILE:-}"
[ -z "$FILE" ] && exit 0

case "$FILE" in
    *.cs|*.ts|*.tsx|*.js|*.jsx|*.py|*.go|*.rs|*.php|*.rb|*.java|*.kt|*.swift|*.dart|*.vb|*.cbl) ;;
    *) exit 0 ;;
esac

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-.}"

HAS_SPEC=0
if find "$PROJECT_DIR" -name "*.spec.md" -mtime -14 -type f -print -quit 2>/dev/null | grep -q .; then
  HAS_SPEC=1
fi

if [ "$HAS_SPEC" -eq 0 ]; then
    echo ""
    echo "Plan Gate: No recent approved spec found (.spec.md modified in last 14 days)."
    echo "   Consider creating a specification before implementing."
    echo "   (Warning only — does not block the edit)"
    echo ""
fi

exit 0
