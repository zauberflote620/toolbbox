# Update Task List

Rule: Update task list after EVERY task completion

**When to Update**
- ✅ After completing any sub-task → mark `[x]`
- ✅ After completing all sub-tasks → mark parent `[x]`
- ✅ When discovering new tasks → add them
- ✅ When modifying files → update "Relevant Files"

Update Pattern
```markdown

*Tasks*
- [x] 1.0 Parent Task Name
  - [x] 1.1 Completed sub-task
  - [ ] 1.2 Current sub-task  ← Working here
  - [ ] 1.3 Future sub-task

*Relevant Files*
- `path/to/file.py` - Brief description of purpose
- `path/to/config.json` - Configuration file (NEW)
- `path/to/module.py` - Updated with new function (MODIFIED)
```

**Key Points**
- Update IMMEDIATELY after completing work
- Don't wait to batch updates
- File paths should be relative to project root
- Add (NEW) for created files, (MODIFIED) for changed files
- One-line descriptions only

**Work Handoff**
- Provide summary of tasks completed and results of /review-code 
- Add remaining new issues or tasks to be completed
- Provide user with a prompt with robust context for work continuation in new terminal at the completion of last task on task list 
- reference next task list with file path where possible (likely in tasks/ or tasks_*/)

Always provide actionable feedback with solutions.
Suggest next steps. Provide detailed reports and findings, in message (not new file) then suggest next steps. 
(ex.: /test? /review-code? /quality-pipeline? /quality-check? /debug? /generate-tasks? something else?)

✅ Code review complete. Next: /test

✅ Task list updated. Workflow complete!