---
description: Run comprehensive tests for MonsterOS code
argument-hint: [specific test file or component]
allowed-tools:
  - Bash(pnpm test*)
  - Bash(pnpm lint*)
  - Bash(pnpm tsc*)
  - Bash(pnpm playwright*)
  - Read
---

# Test Code Command

Testing: $ARGUMENTS

## Always Run These Tests

### 1. Type Checking
```bash
pnpm tsc --noEmit
```

### 2. Linting
```bash
pnpm lint
pnpm lint:fix  # Auto-fix issues
```

### 3. Unit Tests
```bash
pnpm test
pnpm test:watch  # Watch mode
pnpm test:coverage  # With coverage
```

### 4. E2E Tests
```bash
pnpm playwright test
pnpm playwright test --ui  # Interactive mode
```

### 5. Component Tests
```bash
pnpm test:components
```

## Testing Checklist

Before marking any task complete:
- [ ] All TypeScript errors resolved
- [ ] ESLint passes with no errors
- [ ] Unit tests written and passing
- [ ] Integration tests for API endpoints
- [ ] E2E tests for critical user flows
- [ ] No console.log statements left
- [ ] Error handling tested
- [ ] Loading states tested
- [ ] Edge cases covered

## Quick Test Commands

```bash
# Test everything
pnpm test:all

# Test specific file
pnpm test path/to/file.test.ts

# Test with debugging
pnpm test:debug
```

## Performance Testing
- Check bundle size: `pnpm analyze`
- Lighthouse scores for web vitals
- API response times < 200ms

## Security Testing
- No exposed secrets
- Input validation on all forms
- SQL injection prevention verified
- XSS protection in place

Always run tests before committing!