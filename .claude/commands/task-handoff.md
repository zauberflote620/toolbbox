# task-handoff

# MANDATORY: MUST use worktree-verifier subagent BEFORE any task work
# Include current worktree/branch info in handoff for next session

DO NOT *CREATE* MD-- 
1. Generate an IN MESSAGE REPLY, a comprehensive, CONCISE but contextually robust handoff summary prompt (NOT new file) for the next terminal session
2. Update by ADDING to top: .claude/.task-handoff/task-handoff*.md (if working on current-task-a, update task-handoff-a.md, if working on current-task-b, update task-handoff-b.md) with the generated content of 1. 
IMPORTANT: FIRST capture current TodoWrite tool state, THEN USE subagent: context-manager
IMPORTANT: DO NOT create a new task file! DO NOT CREATE MD. 

## Usage
```
/task-handoff
```

## Description
creates a structured handoff prompt to be copied and pasted with all context for work continuation in a new session.
- /update-task-list --use the current existing file
- include list of files modified/changed during your session if not yet committed. 

## ARGUMENTS SUPPORT
# --expected-worktree=<path> : Pass to worktree-verifier for location validation
# --expected-branch=<name>   : Pass to worktree-verifier for branch validation  
# --task-a=TASK_PROGRESS_FILE_a : Specify task markdown file to process
# --task-b=TASK_PROGRESS_FILE_b : Specify task markdown file to process
# --task-b=TASK_PROGRESS_FILE_c : Specify task markdown file to process

# --task-list=CURRENT_TASK_FILE : <or in message>

## Task Tracking Dir
TASK_DIR_GLOBAL="/Users/ambienthex/.claude/.task-handoff"
TASK_DIR_PROJ="${CLAUDE_PROJECT_DIR:-.}/.claude/.task-handoff/"
CURRENT_TASK_FILE="$TASK_DIR_PROJ/current-task*.md" 

TASK_PROGRESS_FILE_a="$TASK_DIR_PROJ/task-progress-a.md"
TASK_PROGRESS_FILE_b="$TASK_DIR_PROJ/task-progress-b.md"
TASK_PROGRESS_FILE_b="$TASK_DIR_PROJ/task-progress-c.md"

TASK_TIMER_FILE="$TASK_DIR/task-timer.txt"

## Template

### 📋 Task Handoff Summary

**Date:** [YYMMDD]
**Session ID:** [If applicable]
**Task File:** [Path to current task file if working from one, reference git issue # if exists]
**Branch:** [Current git branch]
**Worktree:** [Current worktree name]
**Current dir:** [Current dir for work done, to be done]
**CURRENT_TASK_FILE:** [
**Task Progress File:** [file/path/to/existing/TASK-PROGRESS-FILE.md]

### Session Objective
[What was the main goal of this session]

### Completed
- [List of completed items]
- [Include specific achievements]
- [Note any critical fixes]

### Key Files Modified
- `path/to/file1` - [What was changed and why]
- `path/to/file2` - [Impact of changes]

### Current State & Issues
- [Active problems or warnings]
- [Partial completions]
- [Known bugs introduced or discovered]
 
### Exact Stopping Point
[Describe precisely where work stopped and what was being done]

### Next Steps
1. [Immediate next action]
2. [Following priorities]
3. [Eventual goals]
 
### Commands & Context
```bash
# Environment verification
[Key commands to verify + state]

# Continue work
[Commands to resume exactly where left off]
```

### Recommended Subagents
- `agent-name` - [Why this agent for what task]
- `agent-name` - [Specific use case]

### Critical Context 
[Any special knowledge, gotchas, or context the next session needs]

