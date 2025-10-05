---
allowed-tools: Task(git-coordinator)
description: Get comprehensive git status from coordinator (safe multi-instance check)
argument-hint: none
---

## Safe Git Status Check

Get repository status through the git-coordinator to avoid multi-instance conflicts.

This command will:
- Check current repository state through the single source of truth
- Display conflicts, uncommitted files, and branch information
- Show coordinator activity and health status
- Provide recommendations for next steps

**Safe for use during multi-instance operations.**