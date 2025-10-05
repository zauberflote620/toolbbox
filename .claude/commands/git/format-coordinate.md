---
allowed-tools: Task(git-coordinator)
description: Coordinate formatting operations across codebase with separate formatting commits
argument-hint: [tool] - black|prettier|all
---

## Coordinated Code Formatting

**⚠️ PREVENTS FORMATTING CHAOS: No more 600+ file formatting commits mixed with logic changes**

Coordinate formatting operations intelligently to prevent massive, unfocused commits that make code review impossible.

**Usage:** `/format-coordinate [tool]`

**Formatting Tools:**
- `black` - Python formatting only
- `prettier` - JavaScript/TypeScript formatting
- `eslint` - JavaScript/TypeScript linting fixes  
- `isort` - Python import sorting
- `all` - Run all applicable formatters (default)

**Smart Features:**
- **Separate Commits:** Formatting changes get their own commit
- **Incremental Processing:** Format by component/module, not all at once
- **Tool Detection:** Automatically detects available formatting configs
- **Batch Processing:** Groups related files for efficient formatting
- **Rollback Safety:** Every formatting operation is reversible

**Before/After:**
- **Before:** `black . && git add . && git commit` → 600+ files in one commit ❌
- **After:** Smart grouping → 5-10 focused formatting commits ✅

**Example Output:**
```
[style] apply black formatting to Python API modules (23 files)
[style] apply prettier formatting to React components (31 files)  
[style] apply isort to Python imports (45 files)
[feat] add new user authentication system (8 files)
```

**Integrates with mass commit workflow** - Formatting happens before logical commits to keep them clean.