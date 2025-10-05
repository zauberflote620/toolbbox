---
allowed-tools: bash, read
description: load context for a new agent session by analyzing codebase structure and README
This command loads essential context for a new agent session by examining the codebase structure and obtaining codebase overview from second-brain.
---

# Prime

Run the commands under the `Execute` section to gather information about the project, and then review the files listed under `Read` to understand the project.
ASK the second-brain agent for a BRIEF overview of the project, and subagent-registrar to optimize subagent usage.
findings.

## Execute
- `git ls-files`
- `/docs` (slash command)
- !'eza . --tree' (-Codebase structure all:)

## Read
- PROJECT_INDEX.json
- READMD.md
- CLAUDE.md
-docs/_CODEBASE_REFS/architecture/architecture_250730.md
-docs/_CODEBASE_REFS/API_250724.md

## Instructions
- Run 'git ls-files' to understand the codebase structure and file organization
- Read the README.md and CLAUDE.md to understand the project purpose, setup instructions, and key information
- Provide a concise overview of the project based on the gathered context

## Context
- Codebase structire git accessible: !'git ls-files'
-Codebase structure all: !'eza . --tree'

## Report
- Provide a summary of your understand of the project 