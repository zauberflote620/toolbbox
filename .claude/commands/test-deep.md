---
description: Comprehensive analysis - deep testing with coverage, performance, and security
arguments: [--coverage-threshold=80] [--performance-threshold=5]
allowed-tools: Bash, Read, Grep
---

# Comprehensive Test Analysis

Deep testing with coverage, performance profiling, and security scanning.

## Phase 1: Full Test Execution
Run complete test suites with detailed reporting

```bash
echo "Phase 1: Executing full test suites"

# Python tests with coverage
if [ -f "pytest.ini" ] || [ -d "tests" ]; then
    echo "  Running Python tests with coverage..."
    pytest tests/ -v --cov --cov-report=json --cov-report=term
fi

# JavaScript tests with coverage
if [ -f "package.json" ]; then
    echo "  Running JavaScript tests with coverage..."
    npm test -- --coverage --verbose
fi

# Rust tests with coverage
if [ -f "Cargo.toml" ]; then
    echo "  Running Rust tests with coverage..."
    cargo tarpaulin --out Json
fi
```

## Phase 2: Coverage Analysis
Analyze code coverage and identify gaps

```bash
echo "Phase 2: Analyzing coverage"

COVERAGE_THRESHOLD=${1:-80}

# Python coverage analysis
if [ -f "coverage.json" ]; then
    python -c "
import json
with open('coverage.json') as f:
    data = json.load(f)
    total = data['totals']['percent_covered']
    print(f'  Python coverage: {total:.1f}%')
    if total < $COVERAGE_THRESHOLD:
        print('  Warning: Below threshold')
        files = data['files']
        gaps = [(f, d['summary']['percent_covered']) 
                for f, d in files.items() 
                if d['summary']['percent_covered'] < 70]
        for file, cov in sorted(gaps, key=lambda x: x[1])[:5]:
            print(f'    Gap: {file} ({cov:.1f}%)')
"
fi

# JavaScript coverage analysis
if [ -d "coverage" ]; then
    echo "  JavaScript coverage: $(grep -o '"pct":[0-9.]*' coverage/coverage-summary.json | head -1 | cut -d: -f2)%"
fi
```

## Phase 3: Performance Profiling
Profile test execution and identify slow tests

```bash
echo "Phase 3: Performance profiling"

PERF_THRESHOLD=${2:-5}

# Find slow Python tests
if command -v pytest >/dev/null 2>&1; then
    echo "  Identifying slow tests..."
    pytest tests/ --durations=10 --quiet | grep -E "[0-9]+\.[0-9]+s" | while read line; do
        TIME=$(echo $line | grep -oE '[0-9]+\.[0-9]+' | head -1)
        if (( $(echo "$TIME > $PERF_THRESHOLD" | bc -l) )); then
            echo "    Slow test: $line"
        fi
    done
fi

# Profile memory usage
if command -v python >/dev/null 2>&1; then
    echo "  Memory profiling..."
    python -m memory_profiler --precision 1 2>/dev/null || echo "    Memory profiler not available"
fi
```

## Phase 4: Security Scanning
Perform security analysis on code and dependencies

```bash
echo "Phase 4: Security scanning"

# Python security scan
if command -v bandit >/dev/null 2>&1; then
    echo "  Running Python security scan..."
    bandit -r . -f json -o security-report.json 2>/dev/null
    python -c "import json; data=json.load(open('security-report.json')); print(f'    Issues found: {len(data[\"results\"])}')"
fi

# Dependency vulnerability scan
if command -v safety >/dev/null 2>&1; then
    echo "  Scanning Python dependencies..."
    safety check --json 2>/dev/null | python -c "import sys, json; data=json.load(sys.stdin); print(f'    Vulnerabilities: {len(data)}')"
fi

# JavaScript security scan
if [ -f "package.json" ]; then
    echo "  Running npm audit..."
    npm audit --json 2>/dev/null | python -c "import sys, json; data=json.load(sys.stdin); print(f'    Vulnerabilities: {data.get(\"metadata\", {}).get(\"vulnerabilities\", {}).get(\"total\", 0)}')"
fi
```

## Subagents Used
- **test-coverage-enforcer**: Analyze and enforce coverage requirements
- **performance-guardian**: Profile and optimize performance
- **security-auditor**: Comprehensive security analysis

All three subagents run concurrently for comprehensive analysis.

## Options
- `--coverage-threshold`: Minimum coverage percentage (default: 80)
- `--performance-threshold`: Maximum test duration in seconds (default: 5)

## Next Steps
- If gaps found: /test-generate
- If security issues: /security-fix
- If performance issues: /optimize
- For auto-fix: /test-fix