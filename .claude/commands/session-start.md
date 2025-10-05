# /session-start

EXECUTE_SEQUENCE:
1. SCAN git_status + completed_todos + priority_issues
2. SELECT highest_impact_task + alternatives
3. OUTPUT concise_handoff_prompt

OUTPUT_FORMAT:
**NEXT**: [issue_num] [title] | [priority] | [time_est]
**CONTEXT**: [last_3_completed_tasks_outcomes]
**STATE**: [branch_status] | [services_status] | [blockers]
**ACTION**: [first_command_to_run]

SCAN_TARGETS:
- git status (staged/unstaged/branch)
- last 5 completed todos from tasks/
- top 3 priority issues from GitHub
- service status (api:8000, streamlit:8501)

PROHIBITIONS: [verbose_output, session_docs, emojis, coauthor]