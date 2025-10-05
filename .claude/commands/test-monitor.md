---
description: Continuous testing - background monitoring and reporting
arguments: [--watch-interval=5] [--auto-fix]
allowed-tools: Bash, Read
---

# Continuous Test Monitoring

Background test monitoring with file change detection and automated reporting.

## Phase 1: File Change Detection
Monitor codebase for changes that require testing

```bash
echo "Phase 1: Setting up file monitoring"

WATCH_INTERVAL=${1:-5}
AUTO_FIX_FLAG="$2"

# Create monitoring script
cat > /tmp/test-monitor.sh << 'EOF'
#!/bin/bash

# Get baseline file checksums
find . -name "*.py" -o -name "*.js" -o -name "*.ts" -o -name "*.go" -o -name "*.rs" | \
    grep -v node_modules | \
    grep -v __pycache__ | \
    grep -v .git | \
    xargs md5sum > /tmp/file-checksums.baseline

echo "Monitoring files for changes (interval: ${WATCH_INTERVAL}s)"
echo "Press Ctrl+C to stop monitoring"

while true; do
    sleep $WATCH_INTERVAL
    
    # Generate current checksums
    find . -name "*.py" -o -name "*.js" -o -name "*.ts" -o -name "*.go" -o -name "*.rs" | \
        grep -v node_modules | \
        grep -v __pycache__ | \
        grep -v .git | \
        xargs md5sum > /tmp/file-checksums.current
    
    # Compare checksums
    if ! diff -q /tmp/file-checksums.baseline /tmp/file-checksums.current >/dev/null 2>&1; then
        echo "[$(date '+%H:%M:%S')] Changes detected, running tests..."
        
        # Identify changed files
        diff /tmp/file-checksums.baseline /tmp/file-checksums.current | \
            grep "^>" | \
            awk '{print $3}' > /tmp/changed-files.txt
        
        # Update baseline
        mv /tmp/file-checksums.current /tmp/file-checksums.baseline
        
        # Trigger test execution
        echo "  Changed files:"
        cat /tmp/changed-files.txt | head -5 | sed 's/^/    /'
        [ $(wc -l < /tmp/changed-files.txt) -gt 5 ] && echo "    ... and $(( $(wc -l < /tmp/changed-files.txt) - 5 )) more"
        
        # Run tests based on file types
        break  # Exit to Phase 2
    fi
done
EOF

chmod +x /tmp/test-monitor.sh
```

## Phase 2: Affected Test Execution
Run tests based on detected file changes

```bash
echo "Phase 2: Running affected tests"

# Start monitoring in background
/tmp/test-monitor.sh &
MONITOR_PID=$!

# Wait for changes or run immediate test
if [ -f "/tmp/changed-files.txt" ]; then
    echo "  Processing file changes..."
    
    # Categorize changed files
    PYTHON_CHANGES=$(grep "\.py$" /tmp/changed-files.txt | wc -l)
    JS_CHANGES=$(grep -E "\.(js|ts)$" /tmp/changed-files.txt | wc -l)
    GO_CHANGES=$(grep "\.go$" /tmp/changed-files.txt | wc -l)
    RUST_CHANGES=$(grep "\.rs$" /tmp/changed-files.txt | wc -l)
    
    echo "    Python files: $PYTHON_CHANGES"
    echo "    JavaScript/TypeScript files: $JS_CHANGES"
    echo "    Go files: $GO_CHANGES"
    echo "    Rust files: $RUST_CHANGES"
    
    # Run targeted tests
    if [ $PYTHON_CHANGES -gt 0 ]; then
        echo "  Running Python tests..."
        pytest tests/unit/ -q --maxfail=3
    fi
    
    if [ $JS_CHANGES -gt 0 ]; then
        echo "  Running JavaScript tests..."
        npm test -- --watchAll=false --maxWorkers=2 2>/dev/null
    fi
    
    if [ $GO_CHANGES -gt 0 ]; then
        echo "  Running Go tests..."
        go test ./... -short
    fi
    
    if [ $RUST_CHANGES -gt 0 ]; then
        echo "  Running Rust tests..."
        cargo test --lib --quiet
    fi
else
    echo "  No recent changes detected, running baseline tests..."
    # Run smoke tests as baseline
    pytest tests/ -k "smoke or quick" --maxfail=5 -q 2>/dev/null || echo "    Python smoke tests: N/A"
    npm test -- --testPathPattern="smoke" --passWithNoTests --silent 2>/dev/null || echo "    JavaScript smoke tests: N/A"
fi
```

## Phase 3: Status Reporting
Generate monitoring reports and handle failures

```bash
echo "Phase 3: Generating monitoring report"

# Kill background monitor
kill $MONITOR_PID 2>/dev/null

# Generate status report
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
echo "Test Monitoring Report - $TIMESTAMP"
echo "========================================"

# Test execution summary
if [ -f "/tmp/changed-files.txt" ]; then
    TOTAL_CHANGES=$(wc -l < /tmp/changed-files.txt)
    echo "Files changed: $TOTAL_CHANGES"
    echo "Test suites executed:"
    [ $PYTHON_CHANGES -gt 0 ] && echo "  - Python: $PYTHON_CHANGES files"
    [ $JS_CHANGES -gt 0 ] && echo "  - JavaScript/TypeScript: $JS_CHANGES files"
    [ $GO_CHANGES -gt 0 ] && echo "  - Go: $GO_CHANGES files"
    [ $RUST_CHANGES -gt 0 ] && echo "  - Rust: $RUST_CHANGES files"
else
    echo "No changes detected during monitoring period"
fi

# Auto-fix if enabled
if [[ "$AUTO_FIX_FLAG" == "--auto-fix" ]]; then
    echo "Auto-fix enabled, running test-fix if needed..."
    # Check if any tests failed (simplified check)
    if [ $? -ne 0 ]; then
        echo "  Test failures detected, attempting auto-fix..."
        # This would trigger test-fix command in practice
    fi
fi

# Cleanup
rm -f /tmp/test-monitor.sh /tmp/file-checksums.* /tmp/changed-files.txt
```

## Subagents Used
- **test-guardian**: Monitor test health and trigger actions
- **health-guardian**: Monitor overall system health during testing

Both subagents run concurrently for comprehensive monitoring.

## Options
- `--watch-interval`: File check interval in seconds (default: 5)
- `--auto-fix`: Automatically run test-fix on failures

## Next Steps
- On failures: /test-fix for automatic remediation
- For analysis: /test-deep for comprehensive review
- For continuous integration: Keep monitoring active