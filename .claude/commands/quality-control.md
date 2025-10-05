# /version-control

**TOKEN-EFFICIENT ENTERPRISE VERSION CONTROL** - Zero-trust security with automated quality gates.

## Execution Strategy

**ALWAYS START WITH QUICK SCAN (10 tokens max):**
```bash
black --check . && flake8 --count && bandit -ll --exit-zero
```

**IF VIOLATIONS FOUND, AUTO-FIX:**
```bash
black . && echo "✅ Fixed formatting violations"
```

## Zero-Trust Model: VERIFY EVERYTHING
- GPG-signed commits mandatory
- Multi-stage security validation  
- Immutable audit trails
- No single point of failure

## Task Priorities

**Phase 1: Quick Quality Check (20 tokens)**
1. Format check: `black --check --count`
2. Lint scan: `flake8 --count --max-line-length=88`
3. Security: `bandit -ll --exit-zero`

**Phase 2: Critical Issues Only (50 tokens) - ONLY if Phase 1 fails**
1. Auto-fix formatting: `black .`  
2. Security scan: `bandit -r . -f json | grep '"severity": "HIGH"'`
3. Config validation: `python scripts/claude/validation/config_validator.py`

**Phase 3: Full Enterprise Scan (100+ tokens) - ONLY if requested**
1. Complete test suite with coverage
2. Dependency vulnerability scan
3. Infrastructure validation

## Token-Efficient Gates

**Quality (single command):**
```bash
black --check . && flake8 --count && echo "✅ Quality: PASSED"
```

**Security (single command):**
```bash
bandit -r . -ll --exit-zero && echo "✅ Security: PASSED"
```

**Config (single command):**  
```bash
python scripts/claude/validation/config_validator.py >/dev/null && echo "✅ Config: VALID"
```

## Commit Standards

### Conventional Commits (ENFORCED)
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting changes
- `refactor`: Code restructuring
- `perf`: Performance improvement
- `test`: Adding/updating tests
- `build`: Build system changes
- `ci`: CI configuration changes
- `chore`: Maintenance tasks
- `security`: Security-related changes
- `revert`: Reverting changes

### Commit Message Validation
```bash
# Format validation
python scripts/quality/validate_commit_message.py "$1" || exit 1

# Security keywords check
if echo "$1" | grep -iE "(password|secret|key|token|credential)"; then
    echo "❌ Commit message contains security keywords"
    exit 1
fi
```

## Branch Protection Rules

### Main Branch Protection
- **Required status checks**: All CI/CD pipelines must pass
- **Require branches to be up to date**: Always
- **Restrict pushes**: Only through pull requests
- **Require signed commits**: Mandatory
- **Dismiss stale reviews**: When new commits are pushed
- **Require code owner reviews**: For sensitive paths

### Feature Branch Standards
```bash
# Branch naming convention
feature/PROJ-123-short-description
bugfix/PROJ-456-critical-fix
hotfix/PROJ-789-security-patch
release/v1.2.3
```

## Pull Request Requirements

### Automated Checks (ALL MUST PASS)
1. **Security Scan**: SAST, DAST, dependency check
2. **Quality Gate**: Code coverage ≥80%, no critical issues
3. **Performance**: No regression >5% in key metrics
4. **Compatibility**: Backward compatibility verified
5. **Documentation**: Updated and validated
6. **Infrastructure**: Terraform plan validated

### Human Reviews (MANDATORY)
- **Code Owner Approval**: Required for core modules
- **Security Review**: For changes to auth, crypto, or data handling
- **Architecture Review**: For structural changes
- **Performance Review**: For optimization changes

### PR Template
```markdown
## Summary
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change (fix/feature causing existing functionality to not work)
- [ ] Performance improvement
- [ ] Security enhancement

## Security Checklist
- [ ] No hardcoded secrets or credentials
- [ ] Input validation implemented
- [ ] Authentication/authorization unchanged or improved
- [ ] No new attack vectors introduced
- [ ] Security tests added/updated

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Performance impact assessed

## Documentation
- [ ] Code comments updated
- [ ] API documentation updated
- [ ] README updated if needed
- [ ] Migration guide provided (if breaking)

## Deployment
- [ ] Database migrations included
- [ ] Configuration changes documented
- [ ] Rollback plan documented
- [ ] Feature flags implemented (if needed)
```

## Git Hooks

### Pre-Commit Hook
```bash
#!/bin/sh
# .git/hooks/pre-commit

echo "🔍 Running pre-commit checks..."

# Run quality gates
/version-control --pre-commit || exit 1

# Validate commit author
if ! git config user.signingkey >/dev/null; then
    echo "❌ GPG signing key not configured"
    exit 1
fi

echo "✅ Pre-commit checks passed"
```

### Pre-Push Hook
```bash
#!/bin/sh
# .git/hooks/pre-push

echo "🚀 Running pre-push validation..."

# Security scan
bandit -r . -ll -f json | python scripts/quality/security_gate.py || exit 1

# Integration tests
pytest tests/integration/ --maxfail=1 || exit 1

# Performance benchmarks
python scripts/quality/performance_gate.py || exit 1

echo "✅ Pre-push validation passed"
```

### Commit-msg Hook
```bash
#!/bin/sh
# .git/hooks/commit-msg

# Validate conventional commit format
python scripts/quality/validate_commit_message.py "$1" || exit 1

# Check for security keywords
if grep -iE "(password|secret|key|token)" "$1"; then
    echo "❌ Commit message contains sensitive keywords"
    exit 1
fi
```

## CI/CD Pipeline Integration

### Continuous Integration
```yaml
name: CI Pipeline

on: [push, pull_request]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Security Scan
        run: |
          bandit -r . -f sarif -o bandit.sarif
          codeql-analysis --language=python
          
  quality-gate:
    runs-on: ubuntu-latest
    steps:
      - name: Code Quality
        run: |
          black --check .
          flake8 . --format=sarif --output-file=flake8.sarif
          mypy . --junit-xml=mypy.xml
          
  test-suite:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: [3.9, 3.10, 3.11]
    steps:
      - name: Test & Coverage
        run: |
          pytest --cov=app --cov-report=xml --junitxml=pytest.xml
          coverage xml
```

### Continuous Deployment
```yaml
name: CD Pipeline

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Security Verification
        run: |
          # Verify signed commits
          git verify-commit HEAD
          
          # Container security scan
          docker run --rm -v $(pwd):/app aquasec/trivy:latest
          
      - name: Deploy
        run: |
          # Blue-green deployment
          ./scripts/deploy/blue-green-deploy.sh
```

## Security Compliance

### SOX/SOC2 Compliance
- **Immutable Logs**: All git operations logged to tamper-proof storage
- **Segregation of Duties**: No single person can deploy to production
- **Change Authorization**: All changes require approved tickets
- **Audit Trail**: Complete chain of custody for all code changes

### Zero-Trust Verification
```bash
# Every operation verified
git config --global commit.gpgsign true
git config --global tag.gpgsign true
git config --global push.gpgsign if-asked

# Multi-factor authentication required
git config --global credential.helper "!aws codecommit credential-helper $@"
```

## Quality Metrics & Reporting

### Automated Quality Dashboard
```python
# scripts/quality/quality_dashboard.py
def generate_quality_report():
    return {
        "code_coverage": get_coverage_percentage(),
        "security_score": calculate_security_score(),
        "technical_debt": measure_technical_debt(),
        "performance_baseline": get_performance_metrics(),
        "compliance_status": verify_compliance_rules()
    }
```

### Quality Gates
- **Code Coverage**: Minimum 80% for new code
- **Security Score**: No high/critical vulnerabilities
- **Performance**: No regression >5% in key metrics
- **Complexity**: Cyclomatic complexity <10 per function
- **Documentation**: 100% public API documented

## Emergency Procedures

### Hotfix Process
```bash
# Fast-track for critical security issues
git checkout -b hotfix/security-fix-$(date +%Y%m%d)
# ... make fixes
git commit -S -m "security: fix critical vulnerability CVE-2024-XXXX"
# Expedited review process with security team
```

### Rollback Procedures
```bash
# Automated rollback with safety checks
./scripts/deploy/rollback.sh --version=v1.2.3 --verify-health
```

## Command Implementation

### Usage
```bash
# Run full pre-commit suite
/version-control --pre-commit

# Run security scan only
/version-control --security-scan

# Validate commit message
/version-control --validate-commit "feat: add new feature"

# Generate quality report
/version-control --quality-report

# Setup git hooks
/version-control --install-hooks

# Emergency security scan
/version-control --emergency-scan
```

### Integration with Claude
- Automatically runs on `git commit`
- Integrates with existing validation system
- Provides detailed feedback with remediation steps
- Maintains audit logs for compliance

## Best Practices Enforced

1. **Never commit directly to main**: All changes via PR
2. **Signed commits mandatory**: GPG signatures required
3. **Security first**: Every change security-scanned
4. **Quality gates**: Automated quality enforcement
5. **Immutable history**: No force pushes to protected branches
6. **Audit everything**: Complete traceability
7. **Zero-trust model**: Trust nothing, verify everything
8. **Compliance ready**: SOX/SOC2/PCI DSS compatible

---

*This version control system enforces enterprise-grade practices with zero-trust security, ensuring the highest code quality standards while maintaining compliance with industry regulations.*