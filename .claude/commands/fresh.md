# Fresh Session Command

# MANDATORY: MUST use worktree-verifier subagent BEFORE any task work
# Include worktree location in fresh session instructions

Start a fresh Claude Code session with clean context while preserving current state.

## Usage
```bash
/fresh [optional-context-note]
```

## What it does
1. **Saves current state** to temp/session-state.md
2. **Captures key context**: branch, recent work, next steps  
3. **Provides restart instructions** for seamless continuation
4. **Exits current session** to clear context window

## Examples
```bash
# Basic fresh start
/fresh

# With context note
/fresh "About to execute Phoenix integration plan"
```

## Implementation
This command creates, with input from subagent context-manager, a state snapshot and provides instructions for clean restart. 

When invoked, Claude will:
- Document current branch and status
- Save the active plan and next steps
- Create restart instructions
- Recommend ending the session for fresh context
- Provide in reply, short concise copy-paste for new session. 

## Use Cases
- After finalizing complex plans
- Before major operations  
- When context window is cluttered
- For clean execution starts
