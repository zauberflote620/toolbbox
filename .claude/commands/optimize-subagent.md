# optimize-subagent

Optimize existing AI subagents for better performance, accuracy, and integration.

## Usage
```
/optimize-subagent <subagent-name> [optimization-focus]
```

## Examples
```
/optimize-subagent code-reviewer "reduce verbosity and improve security focus"
/optimize-subagent test-automator "enhance parallelization capabilities"
/optimize-subagent lint-fixer "better pipeline integration with git-workflow-manager"
```

## Required Context

Provide the following for best results:

1. **Target Subagent**: Exact name (e.g., `code-reviewer`, `test-automator`)
2. **Current Issues**: Performance problems, incorrect behavior, missing features
3. **Optimization Goals**: Specific improvements needed
4. **Usage Context**: How you currently use the subagent

## What Gets Analyzed

- **Configuration**: System prompts, tool selection, capabilities
- **Performance**: Token usage, speed, error rates
- **Behavior**: Usage patterns, common errors, integration issues
- **Integration**: Pipeline compatibility, input/output formats

## Common Optimizations

### Reduce Verbosity
```
/optimize-subagent code-reviewer "make responses concise while thorough"
```

### Improve Accuracy
```
/optimize-subagent test-automator "better edge case coverage"
```

### Enhance Speed
```
/optimize-subagent security-hardener "faster scanning without missing issues"
```

### Fix Integration
```
/optimize-subagent deployment-validator "work better in pipelines"
```

## Context Template

Use this template when optimizing:

```
Optimize [SUBAGENT_NAME]

Current Issues:
- [specific problems]

Goals:
- [what to improve]

Current Usage:
- [how it's used in workflow]
- [other agents it works with]

Success Looks Like:
- [desired behavior]
```

## Tips for Best Results

1. Include specific examples of problematic behavior
2. Mention performance metrics if available
3. Describe your development workflow
4. Note any constraints or requirements
5. Share current configuration if you have it