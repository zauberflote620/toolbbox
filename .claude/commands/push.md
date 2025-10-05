---
name: push
description: Enterprise-grade one-shot pipeline - lint, test, security, review, commit, PR. Intelligently coordinates agents with pre-commit hooks for zero redundancy.
---

Complete development pipeline with parallel execution.

## Usage
```
/push              # Full parallel pipeline
/push quick        # Skip tests, minimal checks
/push draft        # Create draft PR
/push dry-run      # Preview only
/push no-pr        # Stop after commit
```

## Execution (INTELLIGENT PIPELINE)

**Pre-Stage: Environment Setup**
- Set AGENT_PIPELINE_MODE=true
- Create .agent-pipeline-status file
- Determine staged files: `git diff --cached --name-only`

**Stage 1: Code Quality (Parallel - 3 agents):**
- lint-fixer (ENHANCED: runs exact pre-commit tools)
- security-hardener 
- dependency-manager

**Stage 2: Testing & Review (Parallel - 2 agents):**  
- test-coverage-enforcer
- code-quality-guardian

**Stage 3: Documentation (1 agent):**
- documentation-specialist (check/update)

**Stage 4: Git Operations (Sequential):**
- Check .agent-pipeline-status for lint-fixer success
- If SUCCESS: git-workflow-manager (uses --no-verify) → changelog-generator → pr-creator
- If FAILURE: Show errors and abort OR fallback to standard commit

**Stage 5: Validation (1 agent):**
- deployment-validator

## Live Progress
```
🚀 Push Pipeline (PARALLEL MODE)
├─ [1] Quality & Security (3 agents...)
│  ✓ Lint: 5 files fixed
│  ✓ Security: No vulnerabilities
│  ⚠️ Dependencies: 2 outdated
├─ [2] Tests & Review (2 agents...)
│  ✓ Tests: 45/45 pass, 87% coverage
│  ✓ Review: No breaking changes
├─ [3] Documentation
│  ✓ Docs updated: 2 files
├─ [4] Commit
│  Message: "fix: auth edge case"
│  Edit? (y/N): 
├─ [5] PR #234 created
└─ [6] Deploy ready: 95/100
```

## Options
- `--message "msg"` - Custom commit message
- `--no-tests` - Skip test stage
- `--no-review` - Skip code review
- `--draft` - Create draft PR
- `--reviewers @user1,@user2` - PR reviewers
- `--max-agents N` - Parallel limit (default: 3)

## Prompts
- Edit commit message? (y/n)
- Push to remote? (y/n)
- Create PR? (y/n/draft)

## Important
- Runs up to 3 agents simultaneously
- All stages must pass to continue
- Shows real-time progress
- Full security + code review included
- **One-Shot Pipeline**: If lint-fixer succeeds, pre-commit hooks are skipped
- **Zero Redundancy**: Agents run the SAME tools as pre-commit config
- **Smart Fallback**: On agent failure, can fallback to traditional flow