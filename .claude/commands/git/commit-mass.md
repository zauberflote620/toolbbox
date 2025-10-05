---
allowed-tools: Task(git-coordinator)
description: Intelligently organize and commit large numbers of uncommitted files
argument-hint: [commit-strategy]
---

## Mass File Commit Organization

Organize hundreds or thousands of uncommitted files into logical, atomic commits using intelligent categorization.

**Usage:** `/commit-mass [strategy]`

**Strategies:**
- `auto` - Automatic categorization and commit grouping (default)
- `interactive` - Present plan for review before execution
- `by-type` - Group by file type and functionality
- `by-component` - Group by system component/module

**Features:**
- Analyzes file changes by type, location, and purpose
- Creates focused commits with appropriate messages
- Prevents massive, unfocused commits
- Follows conventional commit format
- Respects user preferences (no co-authorship)

**Example:**
- 917 uncommitted files → 15 logical commits
- Groups: dependencies, config, API, agents, database, tests, docs, etc.