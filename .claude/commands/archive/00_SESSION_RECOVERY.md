# Session Recovery & Context Management

## 🚨 CRASH RECOVERY - START HERE
If Claude/Cursor crashed, run these commands IN ORDER:

```bash
# 1. Load last session context
cat CLAUDE_SESSION_CONTEXT.md

# 2. Check work persistence  
workrecover

# 3. See recent changes
git diff --name-only | head -20

# 4. Check system status
monitorstatus
agentinfo
```

## Session Management Commands

### Save Session Context
```bash
claudesave "task description"     # Save current session context
claudecontext                     # View last saved context
worksave                         # Create work checkpoint  
quicksave                        # Quick backup of current state
```

### Recovery Commands  
```bash
workrecover                      # Recover from last checkpoint
sessionstatus                    # Check session health
sessionrecover                   # Full recovery process
contbackup                       # Start continuous backup
```

## Auto-Recovery Features

1. **CLAUDE_SESSION_CONTEXT.md** - Auto-updated every `claudesave`
   - Git branch and status
   - Recent file changes
   - Task description
   - Resume commands

2. **Work persistence** - Checkpoints every significant change
   - Located in `data/` directory
   - Includes modified files and context

3. **Git state tracking** - Branch, modified files, recent commits
   - Uses `git diff --name-only` for changed files
   - Tracks untracked files with `git ls-files --others`

4. **Monitoring status** - System health at time of save
   - API server status
   - Agent status
   - Service health

## When to Use claudesave

**Always save before:**
- Any risky operation (git operations, major refactoring)
- Every 30 minutes during long sessions  
- Before switching between different tasks
- When system feels unstable or slow
- ALWAYS before ending a session

**Example usage:**
```bash
claudesave "Integrating 3D components into frontend"
claudesave "Fixing autonomous agent ticket generation"  
claudesave "Consolidating .claude folder structure"
```

## Recovery Scenarios

### Scenario 1: Complete Context Loss
```bash
cat .claude/CLAUDE.md            # Read this guide
cat CLAUDE_SESSION_CONTEXT.md    # Load last session
workrecover                      # Restore work files
git status                       # See current changes
```

### Scenario 2: Partial Memory Loss  
```bash
claudecontext                    # Quick context check
git log --oneline -5             # Recent commits
ls -la | head -20               # Current directory
```

### Scenario 3: System State Confusion
```bash  
monitorstatus                    # Check system health
agentinfo                        # Check agent status
health                          # API health check
ports                           # Port configurations
```

## Context File Locations

- `.claude/[YYMMDD]_CLAUDE_SESSION_CONTEXT.md` - Main session context (root)
- `.claude/[YYMMDD]_SESSION_CONTEXT.md` - Backup location  
- `data/` - Work persistence checkpoints
- `logs/` - System and application logs

*Session recovery is critical for maintaining productivity across crashes*