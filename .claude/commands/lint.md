# Lint Assistant

**Output Format: Inline MD text only. NEVER create MD files.**

**Default**: `/lint` = Lint with confirmation for fixes
- `/lint --auto` = Auto-fix without prompts  
- `/lint --ask` = Confirm each fix

Analyze and fix linting issues in $ARGUMENTS following project conventions.

## Task

I'll help you identify and fix code style and quality issues by:

1. Running appropriate linters for the project
2. Analyzing linting errors and warnings
3. Fixing issues automatically when possible
4. Explaining complex issues that require manual intervention
5. Ensuring code follows project style guidelines

## Process

I'll follow these steps:

1. Identify the linting tools used in the project (ESLint, Prettier, TSLint, etc.)
2. Run the appropriate linting commands
3. Parse and categorize the results
4. Apply automatic fixes for common issues
5. Provide explanations and suggestions for more complex problems
6. Verify fixes don't introduce new issues

## Common Linting Issues I Can Fix

- Code style inconsistencies (spacing, indentation, quotes, etc.)
- Unused variables and imports
- Missing type annotations in TypeScript
- Accessibility (a11y) issues in UI components
- Potential bugs flagged by static analysis
- Performance issues in React/Vue components
- Security vulnerabilities detected by linters
- Deprecated API usage
- Import ordering problems
- Missing documentation

## Linting Tools I Can Work With

- ESLint (with various plugins and configs)
- Prettier
- TSLint (legacy)
- stylelint (for CSS/SCSS)
- commitlint (for commit messages)
- Custom lint rules specific to your project

I'll adapt my approach based on your project's specific linting configuration and style guide requirements.

## Linting Results 📊
**Files Scanned**: XX  
**Issues Found**: XX  
**Auto-Fixed**: XX

## Issues by Severity 📋
| Type | Count | Fixed |
|------|-------|-------|
| Error | X | X |
| Warning | XX | XX |
| Style | XXX | XXX |

## Critical Issues 🔴
```
file.py:123 - E999: Issue description
```

## Next Commands (Confidence: High/Medium/Low)
**If CLEAN**: `/test` → `/commit`  
**If ISSUES**: `/lint --auto` → `/blind-validate`

**Recommended Next**: `/[specific-command]` (Confidence: [High/Medium/Low])  
**Run next command automatically?** [Y/n]