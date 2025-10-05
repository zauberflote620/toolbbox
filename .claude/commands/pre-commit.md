---
description: Complete pre-commit workflow
argument-hint: [--strict] [--quick] [--fix]
allowed-tools:
  - Read
  - Write
  - Grep
  - LS
  - Bash
---

# Pre-Commit

/pre-commit [--strict|--quick|--fix]

## Process
1. Check if individual steps completed (look for completion markers):
   - Look for "✅ Linting complete" - If not found: suggest "/lint first"
   - Look for "✅ Code review complete" - If not found: suggest "/review-code next"  
   - Look for "✅ Testing complete" - If not found: suggest "/test next"
   - Look for "✅ Quality pipeline complete" - If not found: suggest "/quality-pipeline next"
2. If all steps completed: Proceed with final commit preparation for session files
3. run security checks:  
python scripts/security_update_handler.py
4. Fix any remaining issues automatically when possible  
5. Update current task lists (md file) & /generate-tasks list for remaining large issues as
     /tasks/YYMMDD_tasks_followup_[short-descriptive-task-name]
6. **Task automation ready** - next commit will auto-detect completions

✅ Pre-commit checks complete. Next: /commit (with task auto-detection)

DO NOT ADD CO-AUTHOR to commit messages. include ONLY changes made. 

If pre-commit hooks made formatting or other changes, review those changes, then git add all changes made and try again. 

## Usage
/pre-commit          # Standard workflow
/pre-commit --strict # Comprehensive checks
/pre-commit --quick  # Essential checks only
/pre-commit --fix    # Auto-fix issues 