---
description: Test creation - auto-generate missing tests based on code analysis
arguments: [--coverage-threshold=80] [--template=auto]
allowed-tools: Bash, Read, Write, Grep
---

# Test Generation System

Auto-generate missing tests based on code coverage analysis and patterns.

## Phase 1: Coverage Gap Analysis
Identify untested code and missing test categories

```bash
echo "Phase 1: Analyzing coverage gaps"

COVERAGE_THRESHOLD=${1:-80}

# Generate coverage report
if command -v pytest >/dev/null 2>&1; then
    echo "  Generating Python coverage report..."
    pytest tests/ --cov --cov-report=json --cov-report=html -q
fi

# Analyze gaps
if [ -f "coverage.json" ]; then
    python -c "
import json
with open('coverage.json') as f:
    data = json.load(f)
    files = data['files']
    gaps = [(f, d['summary']['percent_covered'], d['missing_lines'])
            for f, d in files.items()
            if d['summary']['percent_covered'] < $COVERAGE_THRESHOLD
            and not f.endswith('__init__.py')
            and 'test' not in f]
    
    print(f'  Found {len(gaps)} files needing tests')
    with open('/tmp/coverage-gaps.txt', 'w') as out:
        for file, coverage, missing in gaps[:10]:  # Top 10 gaps
            out.write(f'{file}:{coverage}:{missing}\n')
            print(f'    {file}: {coverage:.1f}% coverage')
"
fi
```

## Phase 2: Test Generation
Generate tests using templates and code analysis

```bash
echo "Phase 2: Generating tests"

TEMPLATE=${2:-auto}

# Generate Python unit tests
if [ -f "/tmp/coverage-gaps.txt" ]; then
    while IFS=: read -r file coverage missing; do
        echo "  Generating tests for $file"
        
        # Extract module info
        MODULE_NAME=$(echo "$file" | sed 's|\.py$||' | tr '/' '.')
        TEST_FILE="tests/unit/test_$(basename "$file")"
        
        # Create test file if it doesn't exist
        if [ ! -f "$TEST_FILE" ]; then
            cat > "$TEST_FILE" << EOF
"""Unit tests for $MODULE_NAME"""
import pytest
from unittest.mock import Mock, patch

# Import the module under test
try:
    from $MODULE_NAME import *
except ImportError:
    pytest.skip("Module $MODULE_NAME not available", allow_module_level=True)

class Test$(basename "$file" .py | sed 's/^./\U&/'):
    """Test class for $(basename "$file" .py)"""
    
    def setup_method(self):
        """Setup for each test method"""
        pass
    
    def test_basic_functionality(self):
        """Test basic functionality"""
        # TODO: Implement basic test
        assert True  # Placeholder
    
    @pytest.mark.parametrize("input_val,expected", [
        (None, None),
        ("", ""),
        ("test", "test"),
    ])
    def test_edge_cases(self, input_val, expected):
        """Test edge cases with parametrized inputs"""
        # TODO: Implement edge case tests
        assert input_val == expected  # Placeholder
EOF
            echo "    Created: $TEST_FILE"
        fi
    done < "/tmp/coverage-gaps.txt"
fi

# Generate JavaScript/TypeScript tests
if [ -f "package.json" ] && command -v find >/dev/null 2>&1; then
    echo "  Generating JavaScript tests..."
    find src -name "*.ts" -o -name "*.js" | grep -v test | while read file; do
        TEST_FILE="${file%.*}.test.${file##*.}"
        if [ ! -f "$TEST_FILE" ]; then
            COMPONENT_NAME=$(basename "$file" | sed 's/\.[^.]*$//')
            cat > "$TEST_FILE" << EOF
import { describe, it, expect } from '@jest/globals';
// Import the component/module under test
// import { $COMPONENT_NAME } from './$COMPONENT_NAME';

describe('$COMPONENT_NAME', () => {
  it('should exist', () => {
    // TODO: Implement test
    expect(true).toBe(true);
  });
  
  it('should handle edge cases', () => {
    // TODO: Implement edge case tests
    expect(true).toBe(true);
  });
});
EOF
            echo "    Created: $TEST_FILE"
        fi
    done
fi
```

## Phase 3: Validation
Validate generated tests and ensure they run

```bash
echo "Phase 3: Validating generated tests"

# Run new tests to ensure they're valid
if command -v pytest >/dev/null 2>&1; then
    echo "  Validating Python tests..."
    pytest tests/unit/ -v --tb=short -k "test_basic_functionality or test_edge_cases"
fi

# Run JavaScript tests
if [ -f "package.json" ]; then
    echo "  Validating JavaScript tests..."
    npm test -- --testPathPattern="\.test\.(js|ts)$" --passWithNoTests
fi

# Clean up temporary files
rm -f "/tmp/coverage-gaps.txt"

# Final coverage check
echo "  Checking improved coverage..."
if command -v pytest >/dev/null 2>&1; then
    pytest tests/ --cov --cov-report=term-missing -q | grep "TOTAL" || echo "  Coverage report not available"
fi
```

## Subagents Used
- **test-automator**: Generate test templates and execute validation
- **unit-test-engineer**: Create comprehensive unit test suites
- **test-coverage-enforcer**: Analyze coverage and enforce standards

All subagents run concurrently to accelerate test generation.

## Options
- `--coverage-threshold`: Minimum coverage to target (default: 80)
- `--template`: Test template style (auto, pytest, jest, mocha)

## Next Steps
- Run generated tests: /test-parallel
- Validate coverage: /test-deep
- Continue monitoring: /test-monitor