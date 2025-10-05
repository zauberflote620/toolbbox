# fix-pr-issues

Automated PR issue resolution with agent orchestration

## Usage
```bash
/fix-pr-issues [PR_NUMBER] [--auto-fix] [--test] [--docs]
```

## Description
Comprehensive PR issue fixer that automatically:
- Diagnoses CI/CD failures
- Creates missing tests
- Resolves merge conflicts
- Updates documentation
- Integrates with MonsterOS agents for autonomous fixes

## Arguments
- `PR_NUMBER`: GitHub PR number to fix
- `--auto-fix`: Enable automatic fixing without prompts
- `--test`: Focus on test creation and fixes
- `--docs`: Update PR documentation

## Process

### 1. CI/CD Diagnosis (30s)
```bash
# Check failing workflows
gh pr checks {{PR_NUMBER}} --json name,state | jq -r '.[] | select(.state != "SUCCESS")'

# Analyze failure logs
gh run view --log-failed | head -100
```

### 2. Test Generation (2min)
Automatically creates tests for:
- Performance optimizations (lazy_memory_system, fast_validator)
- New components without test coverage
- Integration points

### 3. Conflict Resolution (1min)
```bash
# Auto-resolve common conflicts
git fetch origin
git rebase origin/dev --strategy-option=theirs
```

### 4. Documentation Updates
- Generates PR descriptions
- Updates CHANGELOG.md
- Creates test documentation

## Agent Integration

### Automatic Triggers
- Triggered by `test-guardian` agent after code changes
- `quality-pipeline-orchestrator` runs this before commits
- `pr-creator` uses this for PR preparation

### Agent Commands
```yaml
agents:
  - test-guardian:
      trigger: "after_code_change"
      command: "/fix-pr-issues --test"
  
  - quality-pipeline-orchestrator:
      trigger: "pre_commit"
      command: "/fix-pr-issues --auto-fix"
```

## Examples

```bash
# Fix all issues for PR 94
/fix-pr-issues 94 --auto-fix

# Create tests for performance PR
/fix-pr-issues 94 --test

# Update documentation
/fix-pr-issues 94 --docs
```

## Integration Points

### 1. Test Creation
Connects to `test-guardian` agent for:
- Unit test generation
- Integration test creation
- E2E test scenarios

### 2. CI/CD Fixes
Links with `deployment-orchestrator` for:
- Workflow repair
- Dependency updates
- Build configuration

### 3. Documentation
Works with `documentation-specialist` for:
- API documentation
- Changelog updates
- PR descriptions

## Output Format
```json
{
  "pr_number": 94,
  "fixes_applied": [
    "tests_created",
    "ci_fixed",
    "docs_updated"
  ],
  "test_files": [
    "tests/test_lazy_memory_system.py",
    "tests/test_fast_validator.py"
  ],
  "ci_status": "passing",
  "ready_to_merge": true
}