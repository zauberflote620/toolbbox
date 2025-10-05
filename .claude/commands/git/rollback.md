---
allowed-tools: Task(git-coordinator)  
description: Emergency rollback system with multiple recovery levels
argument-hint: [level] - commit|session|emergency
---

## Multi-Level Git Rollback System

**⚠️ REVERSIBILITY GUARANTEED: All git operations can be undone**

Safe rollback system with multiple recovery levels to ensure no work is ever lost.

**Usage:** `/rollback [level]`

**Rollback Levels:**

### 1. Commit Rollback (`/rollback commit`)
- **What it does:** Undoes the last commit, keeps changes staged
- **Safety:** Changes remain in working directory
- **Reversible:** `git cherry-pick` to restore commit
- **Use case:** Fix commit message, add forgotten files

### 2. Session Rollback (`/rollback session`)
- **What it does:** Restores to the state at coordinator startup
- **Safety:** All session changes backed up in recovery branch
- **Reversible:** Checkout recovery branch to restore all work
- **Use case:** Major mistakes during the session

### 3. Emergency Rollback (`/rollback emergency`)
- **What it does:** Nuclear option - restore from emergency backup
- **Safety:** Multiple emergency backup branches created
- **Reversible:** All changes preserved in timestamped branches
- **Use case:** Repository corruption, severe conflicts

**Backup Strategy (Created Automatically):**
- `coordinator-backup-YYYYMMDD-HHMMSS` - Emergency backup branch
- `session-backup-YYYYMMDD-HHMMSS` - Session recovery point
- `pre-operation-backup-HHMMSS` - Before each major operation

**Recovery Commands:**
- `git branch --all` - List all backup branches
- `git checkout coordinator-backup-[timestamp]` - Restore specific backup
- `git reflog` - See complete history of operations
- `git cherry-pick [commit]` - Restore specific commits

**GUARANTEE:** Every git operation creates multiple recovery points. Work cannot be lost.