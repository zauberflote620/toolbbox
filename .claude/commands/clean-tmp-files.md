---
allowed-tools: Bash, Glob, LS, Read
description: Quick cleanup of common temporary files
argument-hint: [aggressive|safe|dry-run]
---

Perform a cleanup of temporary files based on the mode:
- **safe** (default): Remove only obviously temporary files older than 7 days
- **aggressive**: Remove all matching temporary patterns regardless of age  
- **dry-run**: Show what would be removed without actually deleting

Target patterns:
- Root directory: test_*.py, temp_*.py, debug_*.py, fix_*.py
- Reports outside .sast-reports/
- Old backup files (*_old.*, *_backup.*)
- Orphaned test results

$ARGUMENTS