---
allowed-tools: Task(git-coordinator)
description: Intelligently resolve merge conflicts with auto-resolution for safe patterns
argument-hint: [conflict-type]
---

## Intelligent Conflict Resolution

Resolve merge conflicts using intelligent pattern recognition and auto-resolution for safe conflict types.

**Usage:** `/resolve-conflicts [type]`

**Conflict Types:**
- `all` - Resolve all conflicts (auto + manual review)
- `auto` - Only auto-resolvable conflicts
- `package` - Package lock and dependency conflicts
- `formatting` - Code formatting conflicts
- `generated` - Generated and build artifact conflicts

**Auto-Resolved Patterns:**
- **Package locks:** `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`
- **Generated files:** Build artifacts, compiled assets
- **Formatting conflicts:** Whitespace, style differences
- **Import ordering:** Automatic import reorganization

**Manual Review Required:**
- Logic conflicts in source code
- Configuration conflicts with business impact
- Database schema conflicts
- API contract changes

**Safety Features:**
- Creates backup branches before resolution
- Validates syntax after auto-resolution
- Provides detailed conflict analysis reports
- Rollback capability for failed resolutions