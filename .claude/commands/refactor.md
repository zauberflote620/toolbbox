# Code Refactoring Assistant

Refactor $ARGUMENTS following modern enterprise-grade standard best practices, including but not limited to: single resonsibility, zero-trust, no code smells, no linting errors, concistency, code sustability, maintability, scalability and observability. 

## Task

refactor code by:

1. Analyzing the current implementation
2. Identifying improvement opportunities
3. Applying modern patterns and practices
4. Maintaining existing functionality
5. Ensuring type safety and test coverage
6. Documenting the changes made

## Process
Follow these steps:
1. Examine the code to understand its purpose and structure
2. Identify code smells, anti-patterns, or outdated approaches
3. Plan the refactoring strategy with clear goals
4. Implement changes incrementally while maintaining behavior
5. Verify refactored code with tests
6. Document improvements and benefits

## Refactoring Techniques
Aapply various refactoring techniques:

- Converting to modern JavaScript/TypeScript features
- Improving type definitions and type safety
- Extracting reusable functions and components
- Applying design patterns appropriately
- Converting callbacks to Promises or async/await
- Simplifying complex conditionals and loops
- Removing duplicate code
- Improving naming and readability
- Optimizing performance
- Enhancing error handling

## Modern Practices One Can Apply

- ES modules and import/export syntax
- Optional chaining and nullish coalescing
- Array and object destructuring
- Spread and rest operators
- Template literals
- Arrow functions
- Class fields and private methods
- TypeScript utility types
- Functional programming patterns
- React hooks (for React components)

Ensure the refactored code maintains compatibility with project's requirements while improving quality and maintainability.

# Enterprise Code Refactoring Workflow

## Setup & Analysis

```bash
git clone [REPO_URL] refactor_[YYMMDD]_2508
cd refactor_[YYMMDD]_2508
git checkout -b refactor_[YYMMDD]_2508
```

**Identify 5 largest files for refactoring using:**

- Files >200 lines, high complexity, code smells (long functions >50 lines, duplication, poor naming)
- Generate report: file path, size, complexity score, issues

## Refactoring Implementation

**Apply these patterns to each file:**

- Extract functions (break >50 line functions)
- Descriptive naming, remove duplication
- Add type hints, improve error handling
- Add docstrings, separate concerns

## Testing & Quality Pipeline

**1. Run comprehensive tests:**

- Unit tests → Integration → E2E → Manual smoke tests → Performance
- Fix failures immediately

**2. Quality checks:**

```bash
flake8 . --max-line-length=88 --extend-ignore=E203,W503
black . --check
isort . --check-only
mypy . --ignore-missing-imports
bandit -r . -f json
radon cc . -a -na
```

**3. Enterprise standards verification:**

- Security (no hardcoded secrets, input validation)
- Performance (efficient algorithms, data structures)
- Scalability (loose coupling, configurable components)
- Maintainability (documentation, consistent patterns)
- Reliability (error handling, logging hooks)

## Completion

1. Update README.md and CHANGELOG.md
1. Commit with descriptive messages 

## Success Criteria

- [ ] All tests pass, no linting errors
- [ ] Code complexity reduced >20%, type coverage >90%
- [ ] Security scans pass, documentation updated
- [ ] Code smells addressed, refactored to modern standards
- [ ] Documentation updated, maintainable
- [ ] Stage all files changed

**Error Handling:** Document issues, maintain git rollback plan, test incrementally, preserve functionality over perfection.

**Final Report:** Include refactored files with before/after metrics, test coverage impact, issues/resolutions, future recommendations.

Always provide actionable feedback with solutions.

Provide detailed reports and findings, in message (not new file) then suggest next steps. 
(ex.: /test? /review-code? /quality-pipeline? /quality-check? /debug? /generate-tasks? something else?)