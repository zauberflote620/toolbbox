---
description: Auto-remediation - detect and fix failing tests automatically
arguments: [--auto] [--max-attempts=3]
allowed-tools: Bash, Read, Edit, MultiEdit
---

# Auto-Remediation Testing

Detect and automatically fix failing tests with intelligent analysis.

## Phase 1: Failure Identification
Analyze test failures and categorize issues

```bash
echo "Phase 1: Identifying test failures"

# Run tests and capture failures
FAILURES_FILE="/tmp/test-failures.txt"

# Python test failures
if command -v pytest >/dev/null 2>&1; then
    echo "  Analyzing Python test failures..."
    pytest tests/ --tb=short -v 2>&1 | grep -E "FAILED|ERROR" > "$FAILURES_FILE"
fi

# JavaScript test failures
if [ -f "package.json" ]; then
    echo "  Analyzing JavaScript test failures..."
    npm test 2>&1 | grep -E "FAIL|FAILED" >> "$FAILURES_FILE"
fi

# Categorize failure types
echo "  Failure categories:"
grep -c "AssertionError" "$FAILURES_FILE" && echo "    Assertion failures: $(grep -c 'AssertionError' '$FAILURES_FILE')"
grep -c "ImportError" "$FAILURES_FILE" && echo "    Import failures: $(grep -c 'ImportError' '$FAILURES_FILE')"
grep -c "SyntaxError" "$FAILURES_FILE" && echo "    Syntax failures: $(grep -c 'SyntaxError' '$FAILURES_FILE')"
```

## Phase 2: Root Cause Analysis
Analyze underlying causes of test failures

```bash
echo "Phase 2: Root cause analysis"

# Import error fixes
if grep -q "ImportError\|ModuleNotFoundError" "$FAILURES_FILE"; then
    echo "  Fixing import errors..."
    # Extract missing modules
    grep -oE "No module named '[^']*'" "$FAILURES_FILE" | cut -d"'" -f2 | while read module; do
        echo "    Missing module: $module"
        # Attempt to install missing dependencies
        pip install "$module" 2>/dev/null || npm install "$module" 2>/dev/null
    done
fi

# Syntax error fixes
if grep -q "SyntaxError" "$FAILURES_FILE"; then
    echo "  Fixing syntax errors..."
    # Run code formatters
    black . 2>/dev/null || echo "    Black formatter not available"
    isort . 2>/dev/null || echo "    isort not available"
    npx prettier --write . 2>/dev/null || echo "    Prettier not available"
fi
```

## Phase 3: Fix Generation
Generate and apply fixes for common failure patterns

```bash
echo "Phase 3: Generating fixes"

MAX_ATTEMPTS=${2:-3}
ATTEMPT=1

while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
    echo "  Fix attempt $ATTEMPT/$MAX_ATTEMPTS"
    
    # Fix deprecated assertions
    find . -name "*.py" -exec sed -i 's/assertEquals/assertEqual/g' {} \;
    find . -name "*.py" -exec sed -i 's/assertNotEquals/assertNotEqual/g' {} \;
    
    # Fix async test patterns
    find . -name "*.py" -exec sed -i 's/def test_async/async def test_async/g' {} \;
    
    # Update import statements
    find . -name "*.py" -exec sed -i 's/from unittest.mock import Mock/from unittest.mock import Mock, patch/g' {} \;
    
    # Fix JavaScript test patterns
    find . -name "*.test.js" -o -name "*.test.ts" -exec sed -i 's/it\.only/it/g' {} \;
    find . -name "*.test.js" -o -name "*.test.ts" -exec sed -i 's/describe\.only/describe/g' {} \;
    
    # Re-run tests to check if fixes worked
    pytest tests/ --maxfail=1 -q >/dev/null 2>&1 && break
    
    ((ATTEMPT++))
done
```

## Phase 4: Validation
Validate that fixes resolve the original failures

```bash
echo "Phase 4: Validating fixes"

# Re-run failed tests
if [ -f "$FAILURES_FILE" ]; then
    echo "  Re-running previously failed tests..."
    
    # Extract test names and re-run
    grep -oE "test_[a-zA-Z0-9_]*" "$FAILURES_FILE" | sort -u | while read test_name; do
        echo "    Validating: $test_name"
        pytest -k "$test_name" -q >/dev/null 2>&1 && echo "      Fixed" || echo "      Still failing"
    done
fi

# Clean up temporary files
rm -f "$FAILURES_FILE"

# Final validation run
echo "  Running final validation..."
pytest tests/ --maxfail=5 -q && echo "  All tests passing" || echo "  Some tests still failing"
```

## Subagents Used
- **debug-detective**: Analyze failure patterns and root causes
- **test-automator**: Execute test fixes and validation
- **code-surgeon**: Apply surgical fixes to code

Subagents run sequentially to ensure proper fix validation.

## Options
- `--auto`: Skip confirmations for automatic fixes
- `--max-attempts`: Maximum fix attempts (default: 3)

## Next Steps
- If fixes successful: /test-parallel
- If fixes incomplete: /debug for manual investigation
- For prevention: /test-generate to add missing tests