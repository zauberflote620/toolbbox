# Summarize Tasks

Efficiently summarize and create continuation task lists with maximum token efficiency.

## Usage

```bash
/summarize-tasks --file-path <task-file-path>
```

Example:
```bash
/summarize-tasks --file-path tasks_current/250731_tasks-agent-performance-monitoring-remediation.md
```

## Process

1. **Read and analyze** the task file
2. **Extract key data**:
   - Completed phases (% complete)
   - Active tasks (next 3-5 priority items)
   - Blockers/critical issues
   - Recent achievements
3. **Create concise summary** (< 500 tokens)
4. **Generate continuation file** with:
   - Only incomplete tasks
   - Updated status markers
   - Compressed context
5. **Add line to top of origin task list** :
 work continued in path/to/file/of/new/file

## Summary Template

```markdown
# {Project} - Task Summary

**Date**: {YYYY-MM-DD}  
**Source**: {original-file}  
**Progress**: Phase {X}/{Y} ({%} complete)

## ✅ Completed
- Phase 1: {name} (100%)
- Phase 2: {name} (100%)

## 🚧 Active (Phase {X})
- [ ] {X.1} {task} **[CURRENT]**
- [ ] {X.2} {task}
- [ ] {X.3} {task}

## 🔴 Blockers
- {blocker description}

## 📊 Stats
- Tests: {X}/{Y} passing
- Coverage: {%}
- Types: {X} errors remaining

## Next: `tasks_current/{YYMMDD}_tasks-{feature}-cont.md`
```

## Continuation File Template

```markdown
# {Project} - Continuation Tasks

**Continued from**: {previous-file}  
**Generated**: {YYYY-MM-DD}  
**Phase**: {X} of {Y}

## Active Tasks

### Phase {X}: {Phase Name}
- [ ] {X.1} {task description}
- [ ] {X.2} {task description}

### Critical Fixes
- [ ] {ID} {fix description}

## Context
- **Completed**: Phases 1-{X-1}
- **API Base**: `/api/monitoring`
- **UI Path**: `ui/monsteros_observatory_ui/src/`
- **Tests**: {X}/{Y} passing

## Quick Commands
```bash
# Run tests
cd ui/monsteros_observatory_ui && npm test

# Check types
npm run typecheck

# Start dev
npm run dev
```
```

## Optimization Rules

1. **Remove completed items** - Don't carry forward [x] tasks
2. **Compress descriptions** - Keep task descriptions under 10 words
3. **Group by urgency** - Active phase first, then blockers
4. **Minimal context** - Only essential paths/commands
5. **Use abbreviations**:
   - TypeScript → TS
   - WebSocket → WS
   - performance → perf
   - monitoring → mon
   - accessibility → a11y

## Example Output

From a 4000+ token file → 800 token summary + 1200 token continuation

## Implementation

When called:
1. Load the specified task file
2. Parse markdown structure to identify:
   - Task sections (phases, categories)
   - Completion markers ([x] vs [ ])
   - Priority indicators (🔴, 🟡, ✅)
3. Calculate completion percentages
4. Extract only incomplete tasks
5. Write summary to stdout
6. Create continuation file with naming convention:
   - `{YYMMDD}_tasks-{feature}-cont.md`
7. Update TodoWrite with next 3-5 tasks

This maximizes information density while maintaining clarity and actionability.