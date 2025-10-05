---
description: Fast unit tests - pure functions, utilities, models
arguments: [--parallel] [--coverage] [--fix]
allowed-tools: Bash
---

# Unit Tests - Fast & Parallel

Run isolated unit tests across all domains. Optimized for maximum parallelization.

## Execution
```bash
echo "🧪 Running unit tests (parallel)..."

# Python unit tests with parallel execution
pytest tests/unit/ app/*/tests/unit/ \
  -v --tb=short \
  -n auto \
  --maxfail=10 \
  --cov=app \
  --cov-report=term-missing \
  -m "not slow and not integration"

# TypeScript/Jest unit tests
if [ -d "ui/monsteros_observatory_ui" ]; then
  cd ui/monsteros_observatory_ui
  pnpm test:unit --maxWorkers=4 --coverage
fi

echo "✅ Unit tests complete"
```

## Coverage Focus
- Pure functions
- Model validation
- Utility functions  
- Input sanitization
- Message formatting

## Auto-Fix (--fix)
```bash
if [[ "$*" == *"--fix"* ]]; then
  black app/ tests/
  isort app/ tests/
  cd ui/monsteros_observatory_ui && pnpm lint --fix
fi
```