---
name: debt-crush
description: Unleash all agents to automatically fix technical debt across the entire codebase. Runs multiple agents in intelligent sequence to clean up linting, security, tests, and more.
---

Systematic technical debt elimination using parallel agent execution.

## Usage
```
/debt-crush              # Full technical debt elimination
/debt-crush lint         # Just linting fixes
/debt-crush security     # Security fixes only
/debt-crush test         # Test coverage only
/debt-crush quick        # Fast fixes only (lint + format)
```

## Execution Plan (INTELLIGENT SEQUENCING)

**Stage 1: Analysis (1 agent)**
- debug-detective: Full codebase analysis and debt report

**Stage 2: Critical Fixes (Parallel - 5 agents)**
- security-hardener: Fix security vulnerabilities
- sast-scanner: Deep security analysis and fixes

**Stage 3: Code Quality (Parallel - 5 agents)**
- lint-fixer-auto: Fix ALL linting issues across codebase
- code-quality-guardian: Refactor problem areas
- conflict-resolver: Handle any conflicts from parallel work

**Stage 4: Dependencies (1 agent)**
- dependency-manager: Update outdated packages safely

**Stage 5: Testing (Parallel - 2 agents)**
- test-coverage-enforcer: Ensure coverage standards
- unit-test-engineer: Write missing tests

**Stage 6: Performance (1 agent)**
- performance-guardian: Optimize bottlenecks

**Stage 7: Documentation (1 agent)**
- documentation-specialist: Update all docs

**Stage 8: Final Steps (Sequential)**
- git-workflow-manager: Create organized commits
- pr-creator: Create PR with all improvements

## Live Progress
```
🚀 Technical Debt Crusher
├─ [1] Analysis
│  ✓ Found: 342 lint issues, 12 security risks, 45% test coverage
├─ [2] Security (2 agents...)
│  ✓ Fixed: 10/12 vulnerabilities
│  ⚠️ Manual review needed: 2 items
├─ [3] Code Quality (3 agents...)
│  ✓ Lint: 342→0 issues fixed
│  ✓ Quality: 15 functions refactored
│  ✓ Conflicts: All resolved
├─ [4] Dependencies
│  ✓ Updated: 23 packages (no breaking changes)
├─ [5] Testing (2 agents...)
│  ✓ Coverage: 45%→85%
│  ✓ New tests: 67 added
├─ [6] Performance
│  ✓ Optimized: 3 bottlenecks
├─ [7] Documentation
│  ✓ Updated: 12 files
└─ [8] PR #456 created: "Technical Debt Elimination"
```

## What Gets Fixed

### Automatic Fixes
- All linting violations (ESLint, Flake8, Black)
- Formatting issues (Prettier, isort)
- Simple security issues (hardcoded strings, etc.)
- Missing tests for simple functions
- Outdated dependencies (minor/patch)
- Basic documentation gaps

### Manual Review Required
- Complex security vulnerabilities
- Major dependency updates
- Architectural refactoring
- Breaking changes

## Safety Features
- Each stage creates separate commits
- Automatic rollback on test failures
- No force operations allowed
- Comprehensive PR for review