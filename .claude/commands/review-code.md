---
description: Perform systematic code review with MonsterOS standards
argument-hint: @file-to-review.ts or feature name
allowed-tools:
  - Read
  - Grep
  - Bash(ppnpm test*)
  - Bash(ppnpm lint*)
---

# Review Code Command

Reviewing: $ARGUMENTS

## Code Review Checklist

### 1. Functionality
- [ ] Code accomplishes the intended goal
- [ ] Edge cases handled
- [ ] Error scenarios covered
- [ ] No regressions introduced

### 2. Code Quality
- [ ] Follows project conventions
- [ ] DRY principle applied
- [ ] Functions are single-purpose
- [ ] Clear variable/function names
- [ ] No dead code
- [ ] No commented-out code

### 3. Performance
- [ ] No unnecessary re-renders (React)
- [ ] Efficient algorithms used
- [ ] Database queries optimized
- [ ] Proper caching implemented
- [ ] Bundle size impact minimal

### 4. Security
- [ ] Input validation present
- [ ] No hardcoded secrets
- [ ] SQL injection prevented
- [ ] XSS vulnerabilities addressed
- [ ] Authentication/authorization correct

### 5. Testing
- [ ] Unit tests present and passing
- [ ] Integration tests for APIs
- [ ] E2E tests for user flows
- [ ] Test coverage adequate (>80%)
- [ ] Edge cases tested

**To validate/fix issues, run:**
- `/test unit` for unit tests only
- `/test integration` for integration tests
- `/test e2e` for end-to-end tests
- `/test --smoke` for quick validation
- `/test --parallel` for concurrent execution
- `/test --deep` for comprehensive coverage analysis
- `/test --fix` for auto-remediation of failures
- `/test --generate` for creating missing tests
- `/test --property` for property-based testing
- `/test --monitor` for continuous monitoring
- `/test --pipeline` for full automation workflow
- `/test --auto` for auto-fix without confirmation

### 6. Documentation
- [ ] Code comments where needed
- [ ] API documentation updated
- [ ] README updated if needed
- [ ] Complex logic explained
- [ ] JSDoc for public functions

### 7. Accessibility
- [ ] Semantic HTML used
- [ ] ARIA labels present
- [ ] Keyboard navigation works
- [ ] Screen reader friendly
- [ ] Color contrast passes

### 8. Best Practices
- [ ] TypeScript types properly used
- [ ] No any types without justification
- [ ] Promises handled correctly
- [ ] Memory leaks prevented
- [ ] Event listeners cleaned up

## Review Output Format

in-line message to user, 
DO NOT CREATE NEW FILE
## Code Review Summary

### ✅ Strengths
- Well-structured components
- Good error handling
- Clear naming conventions

### 🔧 Issues Found
1. **Performance**: Unnecessary re-renders in ComponentX
   - Solution: Add useMemo for expensive calculation
2. **Security**: Missing input validation
   - Solution: Add zod schema validation

### 📝 Suggestions
- Consider extracting shared logic to custom hook
- Add loading states for better UX

### ⚠️ Must Fix Before Merge
- Remove console.log statements
- Add missing TypeScript types
- Fix failing test in ComponentY
```

Always provide actionable feedback with solutions.
Suggest next steps. Provide detailed reports and findings, in message (not new file) then suggest next steps. 
(ex.: /test? /review-code? /quality-pipeline? /quality-check? /debug? /generate-tasks? something else?)

✅ Code review complete. Next: /test