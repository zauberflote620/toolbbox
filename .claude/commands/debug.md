# Debug Assistant

Help me debug the issue with $ARGUMENTS in this project.

## Task

Identify and fix the problem by:

1. Understanding the issue description
2. Analyzing relevant code
3. Identifying potential causes
4. Suggesting and implementing fixes
5. Verifying the solution works

## Process

Follow these steps:

1. Examine error messages, logs, or unexpected behaviors
2. Locate relevant files and code sections
3. Analyze the code flow and potential failure points
4. Identify common JavaScript/TypeScript pitfalls that might apply
5. Suggest specific fixes with explanations
6. Help implement and test the solution

## Debugging Techniques

Apply appropriate debugging techniques such as:

- Static code analysis to find syntax or type errors
- Runtime error analysis from logs or stack traces
- Control flow tracing to understand execution paths
- State inspection to identify incorrect values
- Dependency analysis to find version conflicts
- Network request inspection for API issues
- Browser console analysis for frontend problems
- Database query inspection for data issues

## Common Issues I Can Help With

- Type errors and null/undefined issues
- Asynchronous code problems (Promises, async/await)
- React/Vue/Angular component lifecycle issues
- API integration problems
- State management bugs
- Performance bottlenecks
- Memory leaks
- Build/compilation errors
- Testing failures
- Environment configuration issues

# Context check first
echo "Session: $(git branch --show-current) | Modified: $(git diff --name-only | wc -l) files"
[ -f CLAUDE_SESSION_CONTEXT.md ] && grep -E "^(Date|Task|Branch)" CLAUDE_SESSION_CONTEXT.md | head -3

source scripts/claude/context/load_context.sh 2>/dev/null || true

Adapt approach based on specific project structure, frameworks, and the nature of the problem.