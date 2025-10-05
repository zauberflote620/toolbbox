# review-pr

Comprehensive PR review with enterprise-grade analysis

## Usage
```bash
/review-pr [PR_NUMBER] [--security] [--performance] [--full]
```

## Quick Commands
```bash
# List open PRs by date
gh pr list --state open --limit 10 --json number,title,createdAt,author --template '{{range .}}{{.number}} | {{.title}} | {{.author.login}} | {{timeago .createdAt}}{{"\n"}}{{end}}'

# Get PR diff summary
gh pr diff [PR_NUMBER] --name-only | wc -l

# Check PR status
gh pr view [PR_NUMBER] --json state,mergeable,statusCheckRollup

# Fast review commands
gh pr diff [PR_NUMBER] | head -100  # Quick diff preview
gh pr view [PR_NUMBER] --json additions,deletions,files  # Size metrics
```

## Description
Performs comprehensive code review analyzing security, performance, architecture, and deployment readiness. Provides actionable feedback with specific recommendations and approval/rejection decision.

## Arguments
- `PR_NUMBER`: GitHub PR number to review
- `--security`: Focus on security analysis  
- `--performance`: Focus on performance analysis
- `--full`: Complete analysis (default)

## Process

### 1. List & Select PR (30sec)
```bash
# Get current open PRs by date
gh pr list --state open --limit 10 --json number,title,createdAt,isDraft,labels --template '{{range .}}{{.number}} {{if .isDraft}}(DRAFT){{end}} | {{.title}} | {{timeago .createdAt}}{{"\n"}}{{end}}'
```

### 2. PR Analysis (2min)
```bash
# Fetch PR metadata
gh pr view [PR_NUMBER] --json title,body,state,additions,deletions,changedFiles,mergeable

# Get changed files list
gh pr diff [PR_NUMBER] --name-only

# Check file types
gh pr diff [PR_NUMBER] --name-only | grep -E '\.(py|js|ts|sql|yaml)$' | wc -l
```

### 3. Code Quality Review (3min)
- **Security**: Vulnerabilities, injection risks, auth issues
- **Performance**: Bottlenecks, memory leaks, optimization opportunities  
- **Architecture**: Design patterns, maintainability, coupling
- **Testing**: Coverage, quality, edge cases
- **Documentation**: Completeness, accuracy, examples

### 4. Quick Validation Commands
```bash
# Check for security patterns
gh pr diff [PR_NUMBER] | grep -i -E "(password|secret|token|api.key|sql|exec|eval)"

# Check for performance patterns  
gh pr diff [PR_NUMBER] | grep -i -E "(timeout|async|await|cache|pool|batch)"

# Check test coverage
gh pr diff [PR_NUMBER] | grep -E "test_|_test\.py|\.spec\.|\.test\."
```

### 5. Decision & Report (1min)
- Provide clear APPROVE/REQUEST CHANGES/COMMENT
- List specific action items with priorities
- Include quality scores and risk assessment
- Suggest follow-up tasks

## Output Format

```markdown
# PR Review: [TITLE] (#[NUMBER])

## Decision: [APPROVED/CHANGES REQUESTED/COMMENTED] 

**Quality Score: X/100** | **Security Score: X/100** | **Risk: [LOW/MED/HIGH]**

### Critical Issues
- Issue 1 with fix recommendation
- Issue 2 with fix recommendation

### Recommendations  
- Improvement 1 with implementation details
- Improvement 2 with implementation details

### Validation Results
- Metric 1: PASS/FAIL Status
- Metric 2: PASS/FAIL Status

### Deployment Readiness
- Backward compatibility: PASS/FAIL
- Performance impact: PASS/FAIL  
- Security review: PASS/FAIL
```

## Token-Efficient Commands

### Quick Analysis
```bash
# PR overview
gh pr view [PR_NUMBER] | head -20

# Size check
gh pr view [PR_NUMBER] --json additions,deletions

# Risk assessment  
gh pr diff [PR_NUMBER] --name-only | grep -E "(security|auth|api|database)" | wc -l
```

### Focused Reviews
```bash
# Security files only
gh pr diff [PR_NUMBER] | grep -A5 -B5 -E "(auth|security|validation|sanitize)"

# Performance files only  
gh pr diff [PR_NUMBER] | grep -A5 -B5 -E "(cache|timeout|async|performance)"

# Critical files only
gh pr diff [PR_NUMBER] | grep -A10 -B5 -E "(server\.py|__init__\.py|config\.py)"
```

## Examples

```bash
# List PRs and review latest
gh pr list --state open --limit 5
/review-pr 94

# Security-focused review  
/review-pr 83 --security

# Performance-focused review
/review-pr 57 --performance
```

## Integration
- Links to GitHub PR for context
- Validates against issue requirements  
- Checks CI/CD status
- Analyzes test results and coverage