---
description: Handle commit process
argument-hint: [--message "msg"] [--push] [--cleanup] [--worktree path]
allowed-tools:
  - Read
  - Write
  - Grep
  - LS
  - Bash
sub agent: git-workflow-manager

---
# Commit

/commit [--message "[type] [msg]"] [--push] [--cleanup] [--worktree path]

!! never add co-author/claude/cursor/agent to commmit messages
!! DO NOT use emojis

0. Check completion status of workflow steps: DO NOT COMMIT if ALL are not complete.
   - Look for "✅ Linting complete" - If not found: suggest "/lint first"
   - Look for "✅ Code review complete" - If not found: suggest "/review-code next"  
   - Look for "✅ Testing complete" - If not found: suggest "/test next"
   - Look for "✅ Dependency audit compelte" - If not found: suggest "/dependency-audit" 
   - Look fir "✅ Blind validation compelte" - If not found: suggest: "/blind-validation" 

## Process
1. Validate worktree
2. Stage all changes made
2.1: run final pre-commit
2.2: fix found issues (if any)
2.3: add new modified files (if any)
3. Generate commit message (include task reference if detected)
**pause and prompt user to approve message, user may choose to commit message and commit themselves**
4. Execute commit (if approved by user)
   - **Automation will detect task completion patterns**
   - **Will suggest task file updates based on commit**
5. Push (prompt user: to push or not push)
6. Cleanup
7. Check `/ts` to see updated task status

**ask whether to /draft-pr or not**
8. If /draft-pr, then draft a PR
9. Suggest next steps 


## Usage
/commit              # review user input and draft commit without coauthor
/commit --message "[feat]: new feature" # Custom message
/commit --push       # Commit and push
/commit --cleanup    # Commit with cleanup

## What It Does
- Checks worktree is clean & ready
- Creates descriptive commit message
- Executes git commit
- Pushes to remote (if requested)
- Cleans up temporary files

✅ Commit complete. Task automation active - check `/ts` for status updates. 