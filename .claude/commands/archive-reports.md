---
allowed-tools: Bash, Glob, LS, Read
description: Archive old reports and analysis files to reduce clutter
argument-hint: [days-old]
---

Archive reports and analysis files older than the specified number of days (default: 30).

Moves files from:
- Root directory (*_report.*, *_analysis.*)
- .sast-reports/ (older reports)
- Various scattered locations

To: `.claude/archive/reports/YYYY-MM/`

Preserves directory structure and creates an index of archived files.

Days parameter: $ARGUMENTS (default: 30)