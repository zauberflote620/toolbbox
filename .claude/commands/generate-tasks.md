---
description: Generate comprehensive task list from a feature description or PRD
argument-hint: feature description or @[YYMMDD]_prd-filename.md or "from discussion"
allowed-tools:
  - Read
  - Write
  - Grep
  - LS
---

# Generate Tasks Command

Create a detailed task list from: $ARGUMENTS

## Goal

To guide an AI assistant in creating a detailed, step-by-step task list in Markdown format based on an existing Product Requirements Document (PRD). The task list should guide a developer through implementation.

## Output

- **Format:** in message reply to user 
- **Location:** message to user
- **Final Output:** slash command: /create-tickets 

## Process

1. **Receive PRD Reference:** The user points the AI to a specific PRD file, provides a feature description, or indicates "from discussion" to use the current conversation context as the PRD.
2. **Analyze PRD:** If "from discussion" is specified, analyze the current conversation to extract requirements, goals, and constraints. Otherwise, read and analyze the functional requirements, user stories, and other sections of the specified PRD.
3. **Assess Current State:** Review the existing codebase to understand existing infrastructure, architectural patterns and conventions. Also, identify any existing components or features that already exist and could be relevant to the PRD requirements. Then, identify existing related files, components, and utilities that can be leveraged or need modification.
4. **Phase 1: Generate Parent Tasks:** Based on the PRD analysis and current state assessment, create the file and generate the main, high-level tasks required to implement the feature. Use your judgement on how many high-level tasks to use. It's likely to be about 
5. Present these tasks to the user in the specified format (without sub-tasks yet). Inform the user: "I have generated the high-level tasks based on the PRD. Ready to generate the sub-tasks? Respond with 'Go' to proceed."
6. **Wait for Confirmation:** Pause and wait for the user to respond with "Go".
7. **Phase 2: Generate Sub-Tasks:** Once the user confirms, break down each parent task into smaller, actionable sub-tasks necessary to complete the parent task. Ensure sub-tasks logically follow from the parent task, cover the implementation details implied by the PRD, and consider existing codebase patterns where relevant without being constrained by them.
8. **Identify Relevant Files:** Based on the tasks and PRD, identify potential files that will need to be created or modified. List these under the `Relevant Files` section, including corresponding test files if applicable.
9. Present these tasks with sub-tasks to the user in the specified format. Inform the user: "I have generated the high-level tasks based on the PRD|discussion and generated sub-tasks for each high-level task. Ready to /create-tickets? Respond with 'Go' to proceed."
10. **Generate Final Output:** Combine the parent tasks, sub-tasks, relevant files, and notes into git tickets following instructions in /create-tickets.
11. **Save Task List:** Save the generated master ticket document in the `/temp/master_tickets/` directory with the filename `[git_issue_#]<project> <type> <area> <priority> <number> <date> <title>.md`, where `[git_issue_#]` matches the git issue # of the master git issue for contents of 9. Add to top of file: see git ticket # 
12. **/create-tickets:** 

## Output Format

The generated task list _must_ follow this structure:

```markdown
## Objective
- short, concise description of task objective.

## Relevant Files

- `path/to/potential/file1.ts` - Brief description of why this file is relevant (e.g., Contains the main component for this feature).
- `path/to/file1.test.ts` - Unit tests for `file1.ts`.
- `path/to/another/file.tsx` - Brief description (e.g., API route handler for data submission).
- `path/to/another/file.test.tsx` - Unit tests for `another/file.tsx`.
- `lib/utils/helpers.ts` - Brief description (e.g., Utility functions needed for calculations).
- `lib/utils/helpers.test.ts` - Unit tests for `helpers.ts`.

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory).
- Use `pnpm test [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.

## Phases
- [ ] 1.0 Parent Task Title
- [ ] 2.0 Parent Task Title
- [ ] 3.0 Parent Task Title 


## Tasks

- [ ] 1.0 Parent Task Title
  - [ ] 1.1 [Sub-task description 1.1]
  - [ ] 1.2 [Sub-task description 1.2]
- [ ] 2.0 Parent Task Title
  - [ ] 2.1 [Sub-task description 2.1]
- [ ] 3.0 Parent Task Title (may not require sub-tasks if purely structural or configuration)
```

## Interaction Model

The process explicitly requires a pause after generating parent tasks to get user confirmation ("Go") before proceeding to generate the detailed sub-tasks. This ensures the high-level plan aligns with user expectations before diving into details.

## Target Audience

Assume the primary reader of the task list is a **junior developer** who will implement the feature with awareness of the existing codebase context.