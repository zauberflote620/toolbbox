---
description: Quality assurance status checker
argument-hint: [--full] [--incremental] [--fix] [--report]
allowed-tools:
  - Read
  - Write
  - Grep
  - LS
  - Bash
---

# Quality Pipeline Status Checker

/quality-pipeline [--full|--incremental|--fix|--report] (default=full fix)

use PROACTIVELY corresponding agent for each part of the process:
use these claude subagents:
/blind-validator --validate completion of all items on ticket
/lint-fixer (run up to 5 in parallel at a time)
/code-reviewer (1)
/test-guardian
/test-coverage-enforcer
/unit-test-engineer
/test-orchestrator
/debug-detective
/dependency-manager
/deployment-validator
/security-auditor
/security-hardener

## Process
1. Check completion status of workflow steps:
   - Look for "✅ Linting complete" - If not found: suggest "/lint first"
   - Look for "✅ Code review complete" - If not found: suggest "/review-code next"  
   - Look for "✅ Testing complete" - If not found: suggest "/test --deep next"
   - Look for "✅ Dependency audit compelte" - If not found: suggest "/dependency-audit" 
2. If all steps completed: Run comprehensive quality validation
3. Generate final quality report IN MESSAGE not md

## Usage
/quality-pipeline          # Full pipeline
/quality-pipeline --full   # Complete QA cycle
/quality-pipeline --incremental # Changed files only
/quality-pipeline --fix    # Auto-fix issues
/quality-pipeline --report # Report only

## What It Does
- Lints code with project rules
- Runs tests & security scans (including hardcoded secret detection)
- Reviews code quality & performance with metrics analysis
- Auto-fixes simple issues
- Re-validates after fixes
- Performs comprehensive error handling analysis

## Output

- **Real-time Progress**: Live updates on each phase
- **Detailed Reports**: Comprehensive analysis of each step
- **Actionable Items**: Clear next steps for any remaining issues
- **Quality Score**: Overall quality assessment

## Usage

```bash
# Full pipeline (all phases)
/quality-pipeline --full

# Incremental (only changed files)
/quality-pipeline --incremental

# Auto-fix mode (fix issues automatically)
/quality-pipeline --auto-fix

# Report only (no fixes)
/quality-pipeline --report-only
```

## Pipeline Phases

### Phase 1: Analysis & Linting
- **File Analysis**: Identify changed files and dependencies
- **Linting**: Run ESLint, Prettier, Black, Flake8
- **Auto-fix**: Apply automatic formatting and simple fixes
- **Report**: Generate linting summary

### Phase 2: Testing & Validation
- **Quick Tests**: Run `/test --smoke` for rapid validation
- **Full Testing**: Run `/test --deep` for comprehensive coverage
- **Security Scan**: Run Bandit, safety checks
- **Type Check**: TypeScript/Python type validation
- **Config Validation**: Validate JSON configs

### Phase 3: Code Review & Analysis
- **Automated Review**: Check code quality patterns
- **Security Assessment**: 
  - Hardcoded secrets detection (password, api_key, secret, token patterns)
  - Dangerous eval/exec usage detection
  - Subprocess shell=True security risks
- **Quality Metrics Analysis**:
  - Code/comment ratio analysis
  - Long line detection (>120 chars)
  - Error handling coverage (try/except ratio)
- **Performance Analysis**: Identify performance issues
- **Documentation Check**: Validate documentation completeness

### Phase 4: Fix & Optimize
- **Auto-fix Issues**: Apply automatic fixes
- **Performance Optimization**: Suggest and apply optimizations
- **Documentation Update**: Auto-update documentation
- **Type Resolution**: Fix type errors

### Phase 5: Final Validation
- **Re-test**: Run tests after fixes
- **Final Lint**: Verify all linting passes
- **Quality Assessment**: Generate final quality score
- **Commit Readiness**: Confirm ready for commit

## Success Criteria

- **All Linting Passes**: No linting errors or warnings
- **All Tests Pass**: 100% test success rate
- **No Security Issues**: Zero security vulnerabilities
- **Type Safety**: All type checks pass
- **Performance Maintained**: No performance regressions
- **Documentation Complete**: All changes documented

## Failure Handling

- **Phase Failures**: Stop pipeline and provide detailed error report
- **Partial Fixes**: Continue with remaining phases for successful fixes
- **Manual Intervention**: Clear guidance for issues requiring manual resolution
- **Rollback**: Automatic rollback of problematic changes

## Integration

- **Git Integration**: Works with git status and staged changes
- **CI/CD Ready**: Compatible with existing CI/CD pipeline
- **IDE Integration**: Can be triggered from IDE
- **Hook Integration**: Can be used as git pre-commit hook

## Quality Metrics

- **Code Coverage**: Maintain or improve test coverage
- **Performance**: No performance regressions
- **Security Score**: Maintain security standards
- **Documentation**: Ensure documentation completeness
- **Type Safety**: Maintain type safety standards 

Always provide actionable feedback with solutions.

Provide detailed reports and findings, in message (not new file) then suggest next steps. 
(ex.: /test? /review-code? /quality-pipeline? /quality-check? /debug? /dependency-audio? /generate-tasks? something else?)

✅ Quality pipeline complete. Next: /pre-commit