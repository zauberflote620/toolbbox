# /complete-and-review

EXECUTE_SEQUENCE:
0. use blind-validator subagent to validate complation of all items on issue ticket. 
1. RUN quality_pipeline --security-scan --lint --test --fail-fast
IMPORTANT!!! Check completion status of workflow steps: 
DO NOT COMMIT if ALL are not complete.
   - Look for "✅ Linting complete" - If not found: suggest "/lint first"
   - Look for "✅ Code review complete" - If not found: suggest "/review-code next"  
   - Look for "✅ Testing complete" - If not found: suggest "/test next"
   - Look for "✅ Dependency audit complete" - If not found: suggest "/dependency-audit" 
2. VALIDATE staged_changes --no-task-files --no-emojis --no-coauthor --functional-only
3. COMMIT with_format "[MOS|PNX][type] description" --no-coauthor --no-emojis --auto-detect-project
4. PUSH current_branch to_remote
5. CHECK_PR_EXISTS --current-branch --skip-if-exists
6. CREATE_PR --auto-base --link-issue --title-from-ticket --if-not-exists
7. UPDATE_ISSUE status:in-progress->status:review
8. CREATE_FOLLOWUPS --scan-todos --functional-only --github-issues

PROHIBITIONS: [coauthor, emojis, task_files, non_functional_files, documentation_files]

COMMIT_MESSAGE_FORMAT:
✅ CORRECT:
[MOS][fix] resolve security vulnerabilities in error scanner
[MOS][feat] add input validation to workflow handlers  
[MOS][chore] update pre-commit configuration
[PNX][feat] add diabetes management workflow
[PNX][fix] resolve glucose tracking calculation
[MOS][perf] optimize database connection pooling
[MOS][test] add comprehensive security integration tests
[MOS][docs] update API documentation (only if explicitly requested)

❌ INCORRECT:
- "[fix] resolve security issues" (missing project indicator)
- "[MOS]🚀[feat] add new features" (contains emoji)
- "[MOS][fix] resolve issues\n\nCo-Authored-By: Claude <noreply@anthropic.com>" (coauthor)
- "[PNX] Update stuff" (no type prefix, vague)
- "[MOS][feat] Add cool new thing" (unprofessional language)

OPTIONS:
--skip-quality: Skip step 1
--base=branch: Override PR base branch
--reviewers=list: Add PR reviewers
--draft: Create draft PR
--no-followups: Skip step 7

VALIDATION_CHECKS:
pre_execution:
  - staged_files ∉ [tasks/, .tasks/, notes/, docs/]
  - commit_message ∉ ["Co-Authored-By", emoji_chars]
  - new_files ∈ [functional_code, config, tests, scripts]
post_execution:
  - pr_body ∉ [coauthor, emojis]
  - issue_labels = [status:review]
  - no_task_files_created = true

ERROR_HANDLING:
quality_fail: maintain status:in-progress, create quality-fix issue
git_fail: rollback, provide manual commands
pr_exists: skip PR creation, use existing PR, continue workflow
pr_fail: update issue anyway, provide manual template
followup_fail: continue main workflow, log missing items