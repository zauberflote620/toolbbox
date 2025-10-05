---
description: Concurrent test orchestrator - executes multiple test suites in parallel
arguments: [--max-workers=8] [--timeout=300]
allowed-tools: Bash, Grep, Glob
---

# Concurrent Test Orchestrator

Execute multiple test suites concurrently using parallel subagents.

## Phase 1: Discovery
Detect all available test frameworks and test directories

```bash
# Detect test frameworks
FRAMEWORKS=""
[ -f "pytest.ini" ] && FRAMEWORKS="$FRAMEWORKS pytest"
[ -f "package.json" ] && grep -q "jest" package.json && FRAMEWORKS="$FRAMEWORKS jest"
[ -f "playwright.config.ts" ] && FRAMEWORKS="$FRAMEWORKS playwright"
[ -f "Cargo.toml" ] && FRAMEWORKS="$FRAMEWORKS cargo-test"
[ -f "go.mod" ] && FRAMEWORKS="$FRAMEWORKS go-test"

echo "Phase 1: Detected frameworks: $FRAMEWORKS"
```

## Phase 2: Distribution
Launch concurrent subagents for parallel execution

```bash
echo "Phase 2: Launching concurrent test execution"

# Launch test-automator subagents (x4) for different test suites
# Launch integration-test-runner subagents (x2) for integration tests
# Launch unit-test-engineer subagents (x2) for unit tests

# Python tests
if [ -d "tests" ]; then
    pytest tests/unit/ -n auto --maxfail=10 &
    PID_UNIT=$!
    pytest tests/integration/ -n 2 --maxfail=5 &
    PID_INT=$!
fi

# JavaScript/TypeScript tests
if [ -f "package.json" ]; then
    npm test -- --maxWorkers=4 &
    PID_JS=$!
fi

# E2E tests
if [ -f "playwright.config.ts" ]; then
    npx playwright test --workers=2 &
    PID_E2E=$!
fi
```

## Phase 3: Aggregation
Collect and report results from all parallel executions

```bash
echo "Phase 3: Aggregating results"

# Wait for all background processes
wait $PID_UNIT $PID_INT $PID_JS $PID_E2E

# Collect exit codes
EXIT_CODES="$?"

# Generate unified report
echo "Test Execution Summary:"
echo "  Unit Tests: $([ $PID_UNIT ] && echo 'Completed' || echo 'N/A')"
echo "  Integration Tests: $([ $PID_INT ] && echo 'Completed' || echo 'N/A')"
echo "  JavaScript Tests: $([ $PID_JS ] && echo 'Completed' || echo 'N/A')"
echo "  E2E Tests: $([ $PID_E2E ] && echo 'Completed' || echo 'N/A')"
```

## Subagents Used
- **test-automator** (x4): Parallel test execution across domains
- **integration-test-runner** (x2): Complex integration test suites
- **unit-test-engineer** (x2): Unit test analysis and execution

## Options
- `--max-workers`: Maximum parallel workers (default: 8)
- `--timeout`: Timeout in seconds (default: 300)

## Next Steps
- On success: /quality-pipeline
- On failure: /test-fix
- For details: /test-deep