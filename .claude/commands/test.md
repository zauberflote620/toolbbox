---
description: Run tests with detailed results (auto-fix enabled by default)
arguments: [unit/integration/e2e] [--parallel] [--smoke] [--deep] [--generate] [--fix] [--property] [--monitor] [--pipeline] [--no-fix]
---

# Run Tests

**Output Format: Inline MD text only. NEVER create MD files.**

**Default**: `/test` = Run standard test suite with auto-fix enabled

**Test Scope Options:**
- `/test unit` = Run unit tests only
- `/test integration` = Run integration tests only  
- `/test e2e` = Run end-to-end tests only

**Execution Mode Options:**
- `/test --smoke` = Execute `/test-smoke` for quick validation
- `/test --parallel` = Execute `/test-parallel` for concurrent testing
- `/test --deep` = Execute `/test-deep` for comprehensive analysis

**Fix & Generation Options (auto-fix is default):**
- `/test --fix` = Execute `/test-fix` for auto-remediation
- `/test --generate` = Execute `/test-generate` for test creation
- `/test --no-fix` = Disable auto-fixing (if you need manual control)

**Advanced Testing Options:**
- `/test --property` = Execute `/test-property-based` for property testing
- `/test --monitor` = Execute `/test-monitor` for continuous monitoring
- `/test --pipeline` = Execute `/test-pipeline` for full automation

## Test Execution

### Python Tests
```bash
echo "=== PYTHON TESTS ==="
# Unit tests
pytest tests/unit/ -v --tb=short --cov=app --cov-report=term-missing --cov-report=json

# Integration tests  
pytest tests/integration/ -v --tb=short --maxfail=5

# Coverage analysis
python -c "
import json
try:
    with open('coverage.json') as f:
        cov = json.load(f)
    total = cov['totals']['percent_covered']
    print(f'Coverage: {total:.1f}%')
    files = cov['files']
    low_cov = {f: d['summary']['percent_covered'] for f, d in files.items() if d['summary']['percent_covered'] < 80}
    for file, pct in sorted(low_cov.items(), key=lambda x: x[1])[:5]:
        print(f'❌ Low coverage: {file} ({pct:.1f}%)')
except:
    print('⚠️ Coverage data not available')
"
```

### Frontend Tests
```bash
echo "=== FRONTEND TESTS ==="
if [ -d "ui/monsteros_observatory_ui" ]; then
  cd ui/monsteros_observatory_ui
  # Jest tests
  pnpm test --coverage --watchAll=false --verbose
  
  # E2E tests
  if [ -f "playwright.config.js" ]; then
    npx playwright test --reporter=line
  fi
fi
```

### Performance Testing
```bash
echo "=== PERFORMANCE TESTS ==="
# Find slow tests
python -c "
import subprocess, json
result = subprocess.run(['pytest', 'tests/', '--tb=no', '-q', '--durations=10'], 
                       capture_output=True, text=True)
lines = result.stdout.split('\n')
for line in lines:
    if 'slowest' in line.lower():
        print(line)
"
```

## Test Results 📊
**Run Time**: XXs
**Pass Rate**: XX/XX (XX%)
**Coverage**: XX.X%

## Suite Breakdown 📋
| Suite | Tests | Pass | Fail | Skip |
|-------|-------|------|------|------|
| Unit | XX | XX | X | X |
| Integration | XX | XX | X | X |
| E2E | XX | XX | X | X |

## Failures 🔴
```
test_name (file:line)
  AssertionError: expected X but got Y
```

## Coverage Gaps ⚠️
- [Files with <80% coverage]
- [Uncovered critical functions]

## Performance Issues 🐌
- [Tests taking >5s]

## Next Commands (Confidence: High/Medium/Low)
**If PASS**: `/quality-pipeline` → `/commit`
**If FAIL**: `/debug` → `/test --fix` → `/test --auto`
**If LOW_COV**: `/test-coverage-enforcer` → `/test --auto`

**Recommended Next**: `/[specific-command]` (Confidence: [High/Medium/Low])
**Run next command automatically?** [Y/n]

✅ Testing complete. Next: /quality-pipeline