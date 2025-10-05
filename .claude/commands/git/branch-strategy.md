---
allowed-tools: Task(git-coordinator)
description: Coordinate branch strategy and merges across multiple Claude instances
argument-hint: [action] [source-branch] [target-branch]
---

## Branch Strategy Coordination

Coordinate branch operations safely across multiple Claude instances with automatic backup and rollback capabilities.

**Usage:** `/branch-strategy [action] [source] [target]`

**Actions:**
- `define` - Establish branch strategy and naming conventions
- `merge` - Coordinate safe merge between branches
- `cleanup` - Clean up stale and duplicate branches
- `status` - Show branch divergence and coordination status

**Safety Features (All Actions Reversible):**
- **Automatic Backups:** Emergency backup branch created before ANY operation
- **Recovery Points:** Multiple restore points with git reflog tracking
- **Rollback Commands:** Simple rollback to any previous state
- **Conflict Prevention:** Checks for ongoing operations by other instances
- **Lock Coordination:** Prevents concurrent branch operations

**Branch Strategy:**
- `main` - Production-ready code
- `dev` - Development integration branch
- `feature/*` - Feature development (auto-delete after merge)
- `fix/*` - Bug fixes (auto-delete after merge)
- `hotfix/*` - Critical production fixes
- `working_*` - Development workspace branches

**Rollback Safety:**
Every operation creates recovery points with commands:
- `/git-rollback commit` - Undo last commit
- `/git-rollback session` - Restore to session start
- `/git-rollback emergency` - Nuclear rollback to emergency backup