---
name: agent-readme
description: Documentation for Claude subagents system
model: claude-3-5-sonnet-20241022
tools:
  - Read
---

# Claude Subagents Guide

## Quick Reference

### Core Agents
- **meta-agent** - Creates new subagents
- **claude-specialist** - Optimizes Claude setup
- **dev-container-manager** - Manages dev environments
- **second-brain** - Finds files and remembers code

### Code Quality
- **code-quality-guardian** - Code reviews
- **lint-fixer** - Fixes style issues
- **unit-test-engineer** - Creates tests
- **sast-scanner** - Security analysis

### Workflow
- **git-workflow-manager** - Smart git operations
- **quality-pipeline-orchestrator** - Full quality checks
- **autonomous-ticket-orchestrator** - Ticket automation

### Specialists
- **database-integration-specialist** - Database expert
- **mcp-protocol-engineer** - MCP integration
- **performance-guardian** - Performance optimization

## Non-Disruptive Task Management

### Background Tracking (Zero Interruption)
```bash
# One-time setup
task-monitor --daemon

# Automatically tracks:
- Git branch → Current task
- Commits → Progress updates  
- Claude chats → Task context
- No manual intervention needed
```

### Optional Quick Commands
```bash
ts  # Status (< 1 sec)
td  # Mark done
tn  # Next task
```

### Minimal UI Integration
```bash
# Option 1: Tmux status bar
Task: AUTH-001 | 80% | 2h15m

# Option 2: Nothing visible
# (pure background tracking)
```

## Good Habits

### 1. **Branch = Task**
```bash
git checkout -b feat/AUTH-001-login
# System knows you're on AUTH-001
```

### 2. **Commit = Progress**
```bash
git commit -m "feat: add login form"
# Auto-updates task progress
```

### 3. **Quick Checks**
```bash
ts  # During coffee break
# AUTH-001: 2h15m, 80% done
```

### 4. **End of Day**
```bash
task-summary  # Optional
# Shows what you accomplished
```

## Daily Workflow

### Morning (2 min)
```bash
cd ~/monsterOS
task-resume     # What was I doing?
docker ps       # Services running?
```

### During Work
- Work normally with Claude
- Commit when subtasks complete
- System handles the rest

### Evening (Optional)
- Review progress
- Note blockers
- System saves state

## Setup

```bash
# Add to .bashrc
source ~/.monsteros/task-integration.sh

# Optional: Add to tmux
echo 'set -g status-right "#(task-status)"' >> ~/.tmux.conf
```

## Key Principles

1. **Zero Friction** - Never interrupts flow
2. **Auto-Detection** - Learns from your work
3. **Optional Everything** - Use what helps
4. **Git-Native** - Branches and commits = tasks

Remember: The best system is invisible until you need it.