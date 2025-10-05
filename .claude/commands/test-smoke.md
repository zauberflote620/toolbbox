---
description: Quick validation - fast baseline testing across all frameworks
arguments: [--threshold=80]
allowed-tools: Bash, Read
---

# Quick Validation Testing

Fast baseline testing to quickly validate code changes.

## Phase 1: Framework Detection
Identify available test frameworks and quick test targets

```bash
echo "Phase 1: Detecting test frameworks"

# Check for test frameworks
HAS_PYTEST=$(command -v pytest >/dev/null 2>&1 && echo "yes" || echo "no")
HAS_NPM_TEST=$([ -f "package.json" ] && grep -q '"test"' package.json && echo "yes" || echo "no")
HAS_CARGO=$([ -f "Cargo.toml" ] && echo "yes" || echo "no")
HAS_GO=$([ -f "go.mod" ] && echo "yes" || echo "no")

echo "  Python: $HAS_PYTEST"
echo "  Node: $HAS_NPM_TEST"
echo "  Rust: $HAS_CARGO"
echo "  Go: $HAS_GO"
```

## Phase 2: Minimal Test Execution
Run fastest subset of tests for quick validation

```bash
echo "Phase 2: Executing smoke tests"

TOTAL_TESTS=0
PASSED_TESTS=0

# Python smoke tests
if [ "$HAS_PYTEST" = "yes" ]; then
    echo "  Running Python smoke tests..."
    pytest tests/ -k "smoke or quick or basic" --maxfail=3 -q
    [ $? -eq 0 ] && ((PASSED_TESTS++))
    ((TOTAL_TESTS++))
fi

# JavaScript/TypeScript smoke tests
if [ "$HAS_NPM_TEST" = "yes" ]; then
    echo "  Running JavaScript smoke tests..."
    npm test -- --testPathPattern="smoke|quick" --maxWorkers=2 --silent
    [ $? -eq 0 ] && ((PASSED_TESTS++))
    ((TOTAL_TESTS++))
fi

# Rust smoke tests
if [ "$HAS_CARGO" = "yes" ]; then
    echo "  Running Rust smoke tests..."
    cargo test --lib --quiet
    [ $? -eq 0 ] && ((PASSED_TESTS++))
    ((TOTAL_TESTS++))
fi

# Go smoke tests
if [ "$HAS_GO" = "yes" ]; then
    echo "  Running Go smoke tests..."
    go test ./... -short -quiet
    [ $? -eq 0 ] && ((PASSED_TESTS++))
    ((TOTAL_TESTS++))
fi
```

## Phase 3: Status Reporting
Report pass/fail status with threshold checking

```bash
echo "Phase 3: Smoke test results"

if [ $TOTAL_TESTS -eq 0 ]; then
    echo "  No test frameworks detected"
    exit 1
fi

PASS_RATE=$((PASSED_TESTS * 100 / TOTAL_TESTS))
THRESHOLD=${1:-80}

echo "  Passed: $PASSED_TESTS/$TOTAL_TESTS ($PASS_RATE%)"
echo "  Threshold: $THRESHOLD%"

if [ $PASS_RATE -ge $THRESHOLD ]; then
    echo "  Status: PASSED"
    exit 0
else
    echo "  Status: FAILED"
    exit 1
fi
```

## Subagents Used
- **debugger**: Analyze any failures detected
- **test-automator**: Execute quick test subsets

Both subagents run concurrently for rapid validation.

## Options
- `--threshold`: Minimum pass rate percentage (default: 80)

## Next Steps
- On success: /test-parallel for full testing
- On failure: /test-fix for remediation
- For investigation: /debug