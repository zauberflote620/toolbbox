---
allowed-tools: Task(git-coordinator)
description: General git coordination - queue any git operation through the single coordinator
argument-hint: [git-command] - any git operation
---

## Git Operation Coordination

**🔒 SINGLE SOURCE OF TRUTH: All git commands must go through the coordinator**

Queue any git operation through the git-coordinator to prevent multi-instance conflicts and chaos.

**Usage:** `/coordinate [git-command]`

**Examples:**
- `/coordinate "git add app/api/"` - Stage specific files
- `/coordinate "git commit -m '[feat] new API endpoint'"` - Create commit
- `/coordinate "git checkout -b feature/new-auth"` - Create branch
- `/coordinate "git merge feature/auth"` - Merge branches
- `/coordinate "git push origin dev"` - Push to remote
- `/coordinate "git stash"` - Stash changes

**Why Use Coordination:**
- **Prevents Conflicts:** Multiple Claude instances can't create git race conditions
- **Operation Queuing:** Commands are processed sequentially in priority order
- **State Broadcasting:** Other instances are notified of changes
- **Safety Backups:** Every operation creates recovery points
- **Lock Management:** Atomic git operations with proper locking

**Operation Priorities:**
- `emergency` - Corruption recovery, emergency operations
- `high` - Critical operations like conflict resolution
- `normal` - Standard commits, branch operations (default)
- `low` - Cleanup, housekeeping operations

**Queue Status:**
The coordinator processes operations in priority order and broadcasts status updates to all Claude instances.

**IMPORTANT:** Never run git commands directly. Always use `/coordinate` or other git coordination commands to maintain repository integrity.