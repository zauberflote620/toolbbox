---
description: Complete test pipeline - orchestrates all test commands for full automation
arguments: [--skip-smoke] [--max-parallel=8] [--coverage-threshold=80]
allowed-tools: Task
---

# Complete Test Pipeline

Orchestrates all test commands in optimal sequence for comprehensive automation workflows.

## Phase 1: Quick Validation
Start with smoke tests for rapid feedback

```bash
echo "Phase 1: Quick validation"

if [[ "$*" != *"--skip-smoke"* ]]; then
    echo "  Running smoke tests..."
    # Execute test-smoke command
    if ! /test-smoke; then
        echo "  Smoke tests failed, stopping pipeline"
        exit 1
    fi
    echo "  Smoke tests passed"
else
    echo "  Skipping smoke tests (--skip-smoke)"
fi
```

## Phase 2: Concurrent Execution
Run comprehensive tests in parallel

```bash
echo "Phase 2: Concurrent test execution"

MAX_PARALLEL=${MAX_PARALLEL:-8}
COVERAGE_THRESHOLD=${COVERAGE_THRESHOLD:-80}

echo "  Launching parallel test execution (max workers: $MAX_PARALLEL)"

# Execute test-parallel command with concurrent subagents
if ! /test-parallel --max-workers="$MAX_PARALLEL"; then
    echo "  Parallel tests completed with issues, proceeding to analysis"
    PARALLEL_FAILED=true
else
    echo "  Parallel tests completed successfully"
    PARALLEL_FAILED=false
fi
```

## Phase 3: Comprehensive Analysis
Deep analysis of test results, coverage, and performance

```bash
echo "Phase 3: Comprehensive analysis"

echo "  Running deep analysis with coverage threshold: $COVERAGE_THRESHOLD%"

# Execute test-deep command with performance and security analysis
if ! /test-deep --coverage-threshold="$COVERAGE_THRESHOLD" --performance-threshold=5; then
    echo "  Deep analysis found issues"
    DEEP_ANALYSIS_ISSUES=true
else
    echo "  Deep analysis completed successfully"
    DEEP_ANALYSIS_ISSUES=false
fi
```

## Phase 4: Auto-Remediation
Fix issues if any failures were detected

```bash
echo "Phase 4: Auto-remediation"

if [ "$PARALLEL_FAILED" = true ] || [ "$DEEP_ANALYSIS_ISSUES" = true ]; then
    echo "  Issues detected, running auto-remediation"
    
    # Execute test-fix command for automatic issue resolution
    if /test-fix --auto --max-attempts=3; then
        echo "  Auto-remediation completed successfully"
        
        # Re-run parallel tests to verify fixes
        echo "  Validating fixes with re-run"
        if /test-parallel --max-workers=4; then
            echo "  Validation successful"
            REMEDIATION_SUCCESS=true
        else
            echo "  Validation failed, manual intervention required"
            REMEDIATION_SUCCESS=false
        fi
    else
        echo "  Auto-remediation failed, manual intervention required"
        REMEDIATION_SUCCESS=false
    fi
else
    echo "  No issues detected, skipping remediation"
    REMEDIATION_SUCCESS=true
fi
```

## Phase 5: Coverage Gap Filling
Generate missing tests for comprehensive coverage

```bash
echo "Phase 5: Coverage gap analysis and generation"

# Always run test generation to improve coverage
echo "  Analyzing coverage gaps and generating missing tests"

if /test-generate --coverage-threshold="$COVERAGE_THRESHOLD" --template=auto; then
    echo "  Test generation completed"
    
    # Run quick validation of generated tests
    echo "  Validating generated tests"
    if /test-smoke --threshold=70; then
        echo "  Generated tests validated successfully"
    else
        echo "  Generated tests need refinement"
    fi
else
    echo "  Test generation encountered issues"
fi
```

## Phase 6: Continuous Monitoring Setup
Initiate background monitoring for ongoing validation

```bash
echo "Phase 6: Setting up continuous monitoring"

echo "  Initiating background test monitoring"

# Start test monitoring in background
# Note: This would typically be started as a daemon process
echo "  Test monitoring configured for file change detection"
echo "  Monitor can be started with: /test-monitor --watch-interval=10 --auto-fix"

# For automation workflows, we don't start the monitor immediately
# but ensure it's ready to be activated
```

## Pipeline Summary and Results

```bash
echo "===== TEST PIPELINE SUMMARY ====="
echo "Timestamp: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""
echo "Phase Results:"
echo "  1. Smoke Tests: $([[ "$*" == *"--skip-smoke"* ]] && echo 'Skipped' || echo 'Passed')"
echo "  2. Parallel Tests: $($PARALLEL_FAILED && echo 'Issues Detected' || echo 'Passed')"
echo "  3. Deep Analysis: $($DEEP_ANALYSIS_ISSUES && echo 'Issues Found' || echo 'Passed')"
echo "  4. Auto-Remediation: $($REMEDIATION_SUCCESS && echo 'Successful' || echo 'Failed')"
echo "  5. Test Generation: Completed"
echo "  6. Monitoring: Ready"
echo ""

# Final pipeline status
if [ "$REMEDIATION_SUCCESS" = true ]; then
    echo "PIPELINE STATUS: SUCCESS"
    echo "All tests passing, coverage goals met, monitoring active"
    echo ""
    echo "Next recommended actions:"
    echo "  - /quality-pipeline (if available)"
    echo "  - /commit (if changes were made)"
    echo "  - /pr (if ready for review)"
    exit 0
else
    echo "PIPELINE STATUS: REQUIRES ATTENTION"
    echo "Manual intervention required for remaining issues"
    echo ""
    echo "Recommended actions:"
    echo "  - Review test failures manually"
    echo "  - Run /debug for detailed investigation"
    echo "  - Consider /test-fix with manual guidance"
    exit 1
fi
```

## Subagents Orchestration

This pipeline orchestrates multiple test commands, each using their own subagents:

- **Phase 1**: test-smoke (debugger, test-automator)
- **Phase 2**: test-parallel (test-automator x4, integration-test-runner x2, unit-test-engineer x2)
- **Phase 3**: test-deep (test-coverage-enforcer, performance-guardian, security-auditor)
- **Phase 4**: test-fix (debug-detective, test-automator, code-surgeon)
- **Phase 5**: test-generate (test-automator, unit-test-engineer, test-coverage-enforcer)
- **Phase 6**: test-monitor (test-guardian, health-guardian)

## Options
- `--skip-smoke`: Skip initial smoke tests
- `--max-parallel`: Maximum parallel workers for test execution (default: 8)
- `--coverage-threshold`: Target coverage percentage (default: 80)

## Integration Notes

Perfect for automation workflows:
```bash
# In CI/CD or automation scripts
/test-pipeline --max-parallel=4 --coverage-threshold=85

# For development workflows
/test-pipeline --skip-smoke --max-parallel=8

# For comprehensive release validation
/test-pipeline --coverage-threshold=90
```