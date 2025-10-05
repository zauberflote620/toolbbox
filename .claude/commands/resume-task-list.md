# Resume Task List

source scripts/claude/context/load_context.sh 2>/dev/null || true
# MANDATORY: MUST use worktree-verifier subagent BEFORE any task work
# Claude MUST call worktree-verifier subagent first - NO EXCEPTIONS
# Pass any --expected-worktree= or --expected-branch= args to the subagent
# Only proceed with tasks after explicit verification success


## ARGUMENTS SUPPORT
# --expected-worktree=<path> : Pass to worktree-verifier for location validation
# --expected-branch=<name>   : Pass to worktree-verifier for branch validation  
# --task-a=TASK_PROGRESS_FILE_a : Specify task markdown file to process
# --task-b=TASK_PROGRESS_FILE_b : Specify task markdown file to process
# --task-list=<in-message> 

## Task Tracking Dir
TASK_DIR="${CLAUDE_PROJECT_DIR:-.}/.claude/.task-handoff/"
CURRENT_TASK_FILE="$TASK_DIR/current-task*.md" 
--a or --b
TASK_PROGRESS_FILE_a="$TASK_DIR/task-progress-a.md"
TASK_PROGRESS_FILE_b="$TASK_DIR/task-progress-b.md"
TASK_TIMER_FILE="$TASK_DIR/task-timer.txt"

Please start on task 1.1 and use @process-task-list.md (.claude/commands/process-task-list)

Continue working on existing tasks from current/previous sessions or start new GitHub issues.

## GitHub Issue Discovery:

**From Current/Previous Sessions:**
```bash
git log --oneline --grep="#" -10              # Recent issues worked on
git branch --show-current | grep -E "#\d+"    # Issue in branch name
gh issue list --assignee @me --state open     # Your assigned issues
cat SESSION_HANDOFF.md 2>/dev/null            # Previous session context
```

**Find Next New Issue:**
```bash
gh issue list --state open --label "priority:critical" --limit 5
gh issue list --state open --label "priority:high" --limit 10  
gh issue list --state open --label "ready" --limit 10
```

**Pick Priority (if none specified):**
1. **Resume in-progress** from previous session first
2. **Critical/High Priority** (blocking/security/bugs)  
3. **Ready status** with clear acceptance criteria
4. **Dependencies resolved** (no blocked-by labels)

## Immediate Actions:

0. **Get GitHub issue** (from current session, previous session, or find next priority)
1. **Change status to "in-progress"** via `gh issue edit #123 --add-label "status:in-progress"` 

1. **PRIMARY: GitHub-based tasks** (default when --issue provided):
    - Get issue details from GitHub using `gh issue view`
    - Parse acceptance criteria from issue body as todo items
    - Skip local file searches unless explicitly needed
    - Track progress using TodoWrite tool based on issue criteria

## Command Arguments:
**--expected-worktree=<path>**: Pass to worktree-verifier for location validation
**--expected-branch=<name>**: Pass to worktree-verifier for branch validation
**--issue=<number>**: Resume specific GitHub issue

## Optional Flags:

**--restore-context**: Auto-restore session context from GitHub issue
- Reads "CLAUDE CONTEXT RESTORATION" section from issue body
- Executes "Resume command" if present in issue
- Provides immediate next actions from issue context

**--quick-resume (default)**: Execute resume commands without confirmation
- Automatically runs resume commands found in GitHub issues
- Skips confirmation prompts for faster session restoration

2. **SECONDARY: Local tasks** (only if no --issue provided):
    - Check for local TodoWrite state
    - Search tasks/ directory only if no GitHub issue specified
    
3. **Check recent context**:
    ```bash
    # Activate task automation for this session
    .claude/hooks/automation/github-task-tracker.sh detect
    
    # Check recent commits for context
    git log --oneline -10
    
    # Check for task documentation
    ls tasks/*$(date +%y%m%d)* 2>/dev/null || ls tasks/* | tail -5

    # Check current branch (automation will detect task patterns)
    git branch --show-current

3. Resume work immediately:
    - **Task automation is now active** - commits will auto-detect completions
    - **IMPORTANT** determine which of the available subagents would facilitate efficient workflow for the work and use them PROACTIVELY and in parallel for tasks that would benefit from doing so without duplicating work. 
we    - If no completed tasks, find the first (likely 1.0) task and continue, following instructions in /process-task-list.md
    - If no tasks, always ask for clarification if unclear before starting tasks. 
    - Update task status as you work (automation will suggest updates based on commits)
    - Use `/ts` anytime for quick task status

IMPORTANT! 
- Update IMMEDIATELY after completing work for a task
- Don't wait to batch updates
- File paths should be relative to project root
- Add (NEW) for created files, (MODIFIED) for changed files
- One-line descriptions only
- Add new issues or bugs found that require addressing but not immediately addressed. 

When working with task lists, the AI must:

1. Regularly update the task list file after finishing any significant work.
2. Follow the completion protocol:
   - Mark each finished **sub‑task** `[x]`.
   - Mark the **parent task** `[x]` once **all** its subtasks are `[x]`.
3. Add newly discovered tasks to the bottom of the task list unless otherwise specified.
4. Keep "Relevant Files" accurate and up to date.
5. Before starting work, check which sub‑task is next.
6. After implementing a sub‑task, update the file and then pause for user approval.

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

- BE CONCISE - respond with actions, not long explanations.

---

If the todo list is empty or missing:

  1. Check for task files in tasks/
  directory, or WIP/
  2. Check CLAUDE.md for project goals
  3. Look for TODO/FIXME comments in code
  4. Only then ask: "No active tasks
  found. What should I work on?"

  Task Status Flow:

  pending → in_progress → completed

  Start now by loading the todo list.

  This improved version:
  - Works with your existing `TodoWrite`
  tool
  - Uses real commands to check context
  - Follows your preference for action
  over explanation
  - Integrates with your `tasks/`
  directory structure
  - Handles edge cases (empty todo list)
  - Is concise and actionable

  Usage remains simple:
  ```bash
  claude --continue /resume-task-list