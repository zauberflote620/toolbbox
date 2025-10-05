# Task List Management

source scripts/claude/context/load_context.sh 2>/dev/null || false
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

## Set up workspace
please check diff and follow industry best practices for git ethics for /commits, /draft-prs, clear separation of responsibilities for branches and worktrees; start with clean workspaces if at all possible. Notify user if there are large diffs that would result in merge conflicts. 

Please start on task 1.1 and use ".claude/commands/process-task-list"

Guidelines for managing task lists in markdown files to track progress on completing a PRD

## Task Implementation

- **One sub-task at a time:** Do **NOT** start the next sub‑task until you ask the user for permission and they say "yes" or "y".
- **Completion protocol:**  
  1. When you finish a **sub‑task**, immediately mark it as completed by changing `[ ]` to `[x]`.
  2. If **all** subtasks underneath a parent task are now `[x]`, follow this sequence:
    - **First**: Run `/test` for full test suite validation
    - **Only if all tests pass**: Stage changes (`git add .`)
    - **Clean up**: Remove any temporary files and temporary code before committing

    /commit --ASK for approval of message first
    - **Commit**: Use a descriptive commit message that:
      - Uses conventional commit format (`feat:`, `fix:`, `refactor:`, etc.)
      - Summarizes what was accomplished in the parent task
      - Lists key changes and additions
      - References the task number and PRD context
      - **Formats the message as a single-line command using `-m` flags**, 
      !! Note: Do NOT add co-author or marketing !!
      e.g.:

        ```
        git commit -m "[feat][YYMMDD]: add payment validation logic" -m "- Validates card type and expiry" -m "- Adds unit tests for edge cases" -m "Related to T123 in PRD" 
         ! Note: Do NOT add co-author or marketing 
        ```
  3. Once all the subtasks are marked completed and changes have been committed, mark the **parent task** as completed.
- Stop after each sub‑task and wait for the user's go‑ahead. (unless otherwise instructed)

## Task List Maintenance

1. **Update the task list as you work:**
   - Mark tasks and subtasks as completed (`[x]`) per the protocol above.
   - Add new tasks as they emerge.
   - /update-ticket if working from git ticket 

2. **Maintain the "Relevant Files" section:**
   - List every file created or modified.
   - Give each file a one‑line description of its purpose.

3. **/blind-validate**
   - MUST use blind-validator subagent to /blind-validate to verify with code all alleged completion before the start of the next high-level task 

4. **Commit Often**
   - As a general rule, /quality-pipeline and /commit after /blind-validate 
   - As a general rule, /draft-pr after 5 or so commits, depending on size of commits and keeping in line with industry best practices for git ethics. 

5. NEVER include co-authors, or emojis in commits, commit messages, comments, nor PRs. 

## AI Instructions

When working with task lists, the AI must:

1. Regularly update the task list file after finishing any significant work.
2. Follow the completion protocol:
   - Mark each finished **sub‑task** `[x]`.
   - Mark the **parent task** `[x]` once **all** its subtasks are `[x]`.
3. Add newly discovered tasks.
4. Keep "Relevant Files" accurate and up to date.
5. Before starting work, check which sub‑task is next.
6. After implementing a sub‑task, update the file and then pause for user approval.

BEFORE STARTING ON TASKS: 
0. **Verify and Confirm Branch and Worktree**
1. **Review Task Files*: Review CURRENT_TASK_FILE and TASK_PROGRESS_FILE_* to understand the current state before proceeding with first task. 
2. **/prime** - please explore the entire codebase to understand the codebase from multiple angles: as a software architect, software developer, and product manager. I want you to get a good understanding of the codebase, so that you can make better decisions when carrying out tasks.
3. **Task automation active** - commits auto-detect completions, use `/ts` for status 