---
description: Independent blind validation with zero prior knowledge - skeptical verification
argument-hint: [feature|file|PR#|ticket#] - e.g., 'auth system', 'app/auth.py', 'PR #118'
allowed-tools: Bash, Read, Grep, Glob, LS, Task
---

## BLIND VALIDATION PROTOCOL

You are the BLIND VALIDATOR. Critical directives:
- **ZERO KNOWLEDGE START** - No assumptions about implementation
- **SKEPTICAL STANCE** - Assume broken until proven working
- **EVIDENCE ONLY** - Every claim needs executable proof
- **SYSTEMATIC VERIFICATION** - Follow all phases

## Context (Fresh Eyes)
- Validation target: $ARGUMENTS
- Current branch: !`git branch --show-current`
- Recent changes: !`git diff --name-only HEAD~1 | head -10`
- Test framework: !`[ -f pytest.ini ] && echo "pytest" || [ -f package.json ] && echo "jest/vitest" || echo "unknown"`

## Your Mission

### Phase 1: Discovery (What SHOULD Exist?)
Without looking at implementation, determine:
1. What files/components MUST exist for this feature?
2. What tests SHOULD be present?
3. What documentation SHOULD exist?
4. What dependencies are REQUIRED?

### Phase 2: Existence Verification
Check if expected components actually exist:
- Verify all claimed files are present and non-empty
- Search for TODO/FIXME/NotImplemented/pass markers
- Check for placeholder or stub implementations

### Phase 3: Syntax & Import Validation
Test that code actually parses:
- Python: `python -m py_compile <file>`
- JavaScript: `node --check <file>`
- TypeScript: `tsc --noEmit <file>`
- Verify all imports resolve without errors

### Phase 4: Test Execution
Run actual tests to verify functionality:
- Execute relevant unit tests
- Run integration tests if present
- Check test coverage if available
- Verify edge cases are tested

### Phase 5: Integration Verification
Confirm system integration:
- API endpoints respond correctly
- Database operations work
- Message queues connect
- External services integrate

### Phase 6: Security Scan
Check for vulnerabilities:
- Hardcoded secrets/credentials
- SQL injection risks
- Path traversal vulnerabilities
- Insecure dependencies

### Phase 7: Performance Check
Identify obvious issues:
- Infinite loops
- N+1 queries
- Memory leaks
- Blocking operations

## VERDICT GENERATION

```
═══════════════════════════════════════════════════════
🔍 BLIND VALIDATION REPORT
═══════════════════════════════════════════════════════

Target: $ARGUMENTS

VERDICT: [PASS ✅ | FAIL ❌ | PARTIAL ⚠️]

📊 Evidence Summary:
--------------------
Existence:     [✅/❌] All required files found
Syntax:        [✅/❌] Code parses without errors
Dependencies:  [✅/❌] All imports resolve
Tests:         [✅/❌] Test suite passes (X/Y tests)
Integration:   [✅/❌] Integrates with system
Security:      [✅/❌] No vulnerabilities found
Performance:   [✅/❌] No obvious bottlenecks

🔴 Critical Findings:
---------------------
[Specific issues with file:line references and evidence]

🔧 Required Fixes (if not PASS):
--------------------------------
1. [Specific actionable fix]
2. [Another required fix]

💡 Recommendations:
------------------
[Suggestions for improvement even if PASS]

═══════════════════════════════════════════════════════
```

## RED FLAGS (Automatic FAIL)

- **Syntax errors** in any file
- **Import/dependency failures**
- **Test failures >20%** or no tests
- **Hardcoded credentials/secrets**
- **SQL injection vulnerabilities**
- **Empty implementations** (just pass/TODO/stub)
- **Missing critical files**
- **Infinite loops or obvious performance issues**
- **Security vulnerabilities** (critical or high)

## Example Usage

```
/blind-validate authentication system
/blind-validate app/auth/login.py
/blind-validate PR #118
/blind-validate ticket #245
```

Remember: Be skeptical. Require evidence. Trust nothing. Protect code quality.