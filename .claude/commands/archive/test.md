# Test Assistant

source scripts/claude/context/load_context.sh 2>/dev/null || true

**TOKEN-EFFICIENT TESTING** - Start minimal, expand only if needed.

## Execution Strategy

**ALWAYS START WITH SMOKE TEST (5 tokens max):**
```bash
pytest tests/unit/test_simple.py -v && flake8 app/ --count
```

**IF BASIC TESTS FAIL, STOP. FIX CRITICAL ISSUES FIRST.**

## Task Priorities

1. **Smoke test**: One simple test file to verify infrastructure works
2. **Critical issue identification**: If basic tests fail, identify blocking imports/config
3. **Targeted quality checks**: Single command outputs, not verbose exploration
4. **Coverage analysis**: Only after basic tests pass
5. **Comprehensive testing**: Only if explicitly requested

## Token-Efficient Process

**Phase 1: Minimal Validation (20 tokens)**
1. Run ONE simple test to check pytest works
2. Run ONE quality command (flake8 --count)
3. Provide 3-line summary: ✅/❌ status + main issue

**Phase 2: Issue Diagnosis (50 tokens) - ONLY if Phase 1 fails**
1. Identify specific import/config errors
2. Suggest minimal fixes
3. Skip verbose exploration

**Phase 3: Comprehensive Analysis (100+ tokens) - ONLY if requested**
1. Full test suite execution
2. Detailed quality analysis  
3. Coverage reports

## Testing Frameworks 

- Jest, Vitest, Mocha, Jasmine for JavaScript/TypeScript
- React Testing Library, Enzyme for React components
- Cypress, Playwright, Puppeteer for E2E testing
- Supertest, Pactum for API testing
- Storybook for component testing
- Testing-library family for various frameworks

## Testing Techniques

implement various testing approaches:

- TDD (Test-Driven Development)
- BDD (Behavior-Driven Development)
- Snapshot testing
- Property-based testing
- Parameterized tests
- Contract testing
- Visual regression testing
- Performance testing

## Mocking Strategies

use Different mocking approaches:

- Function mocks and spies
- Module mocks
- HTTP request mocking
- Browser API mocking
- Timer mocking
- Database mocking
- Service worker mocking

Adapt to project's specific testing frameworks, patterns, and conventions to ensure consistency with the existing codebase.

---
## Quality Commands (Use ONE at a time)

**Quick Checks:**
```bash
# Basic smoke test
pytest tests/unit/test_simple.py -v

# Style violations count
flake8 app/ --count --max-line-length=120 --ignore=E203,W503

# Security scan (basic)
bandit app/ -r -f json | grep "severity"

# Import issues
python -c "from app.config import config; print('✅ Config loads')"
```

**Full Analysis (ONLY if requested):**
```bash
# Comprehensive testing (token-heavy)
pytest tests/ -v --tb=short --maxfail=5

# Code quality suite
black app/ --check --line-length=120
isort app/ --check-only  
mypy app/ --ignore-missing-imports
```

## MonsterOS-Specific Issues

**Known Import Blockers:**
- CORS_ORIGINS env var must be JSON: `["url1","url2"]`
- Use `monsterosConfig` not `monsterOSConfig`
- aiohttp/litellm version conflicts

**Quick Fixes:**
```bash
# Fix CORS for testing
export CORS_ORIGINS='["http://localhost:3000","http://localhost:8501"]'

# Format code
black app/ --line-length=120
```

## Completion
1. Provide minimal 3-line summary first
2. Only expand if issues found or requested
3. Never create comprehensive reports unless asked
4. Commit/PR only at user request

✅ Testing complete. Next: /quality-pipeline

