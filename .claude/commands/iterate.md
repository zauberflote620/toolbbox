---
description: Iteratively evaluate and improve code quality through self-assessment rubrics and multiple revision cycles
argument-hint: [--plan|--execute|--strict|<context>] - Plan only, execute improvements, strict mode, or specific context
allowed-tools: Read, Write|Edit, Grep, Task, TodoWrite
---

## Purpose
Use internal quality rubrics to iteratively improve responses and code through structured self-evaluation and revision cycles.

## Execution Flow
Follow these phases in order without skipping:

### Phase 1: Context Analysis
1.1. Understand the user's request completely
1.2. Identify key requirements and constraints
1.3. Determine success criteria
1.4. Map dependencies if code-related
1.5. Note any special considerations

### Phase 2: Create Internal Rubric (DO NOT SHOW TO USER)
2.1. Design 5-7 evaluation criteria specific to the task:
   - **Clarity**: Is the solution clear and understandable?
   - **Accuracy**: Does it correctly solve the problem?
   - **Completeness**: Are all requirements addressed?
   - **Efficiency**: Is the approach optimal?
   - **Structure**: Is the code/response well-organized?
   - **Robustness**: Does it handle edge cases?
   - **Practicality**: Can it be immediately applied?
2.2. Each criterion should be measurable (1-10 scale)
2.3. Rubric must align with user's specific needs
2.4. Weight criteria based on task importance

### Phase 3: Initial Draft
3.1. Create first solution/response attempt
3.2. Focus on addressing core requirements
3.3. Document approach if complex

### Phase 4: Self-Evaluation (Internal)
4.1. Score each rubric criterion (1-10)
4.2. Identify weak areas (scores < 8)
4.3. Note specific improvements needed
4.4. Calculate weighted average score

### Phase 5: First Revision
5.1. Address all weak areas identified
5.2. Enhance areas scoring < 8
5.3. Maintain strengths from initial draft
5.4. Add missing elements

### Phase 6: Second Evaluation (Internal)
6.1. Re-score using same rubric
6.2. Verify improvements were effective
6.3. Check for regression in other areas
6.4. Target minimum score of 8/10 per criterion

### Phase 7: Final Revision
7.1. Polish remaining issues
7.2. Optimize for excellence (9-10 scores)
7.3. Ensure consistency throughout
7.4. Validate against original requirements

### Phase 8: Deliver Final Output
8.1. Present the optimized solution
8.2. Include brief quality summary:
   - Overall confidence level
   - Key strengths achieved
   - Any caveats or limitations
8.3. Suggest next steps if applicable

## Execution Rules

1. **Internal Process**: Rubric creation and scoring are INTERNAL ONLY
2. **Multiple Cycles**: Minimum 2 revision cycles required
3. **Quality Threshold**: Target 8/10 minimum per criterion
4. **User Output**: Show only final optimized result
5. **Transparency**: Include quality summary without exposing rubric

## Arguments

- `--plan`: Show planning phase only (useful for complex tasks)
- `--execute`: Apply improvements to existing code/solution
- `--strict`: Require 9/10 minimum scores
- `<context>`: Additional context for evaluation
- No args: Full iteration cycle

## Quality Metrics

### Code Quality
- Readability and maintainability
- Test coverage consideration
- Error handling completeness
- Performance optimization
- Security best practices

### Response Quality
- Direct answer to request
- Step-by-step clarity
- Alternative perspectives
- Actionable summary
- No vague statements

## Integration Points

### With Other Commands
- After `/lint` -> iterate on fixing issues
- Before `/commit` -> ensure code excellence
- During `/review-code` -> improve based on findings
- With `/test` -> iterate until tests pass

### MonsterOS Specific
- Follow CLAUDE.md guidelines
- Respect project conventions
- Consider HippoRAG memory patterns
- Maintain agent communication standards

## Example Workflow

```
User: "Help me optimize this database query"

Internal Process:
1. Analyze query requirements
2. Create rubric (performance, readability, scalability...)
3. Draft initial optimization
4. Score: Performance(6), Readability(7), Scalability(5)
5. Revise: Add indexing, simplify joins, partition strategy
6. Re-score: Performance(9), Readability(8), Scalability(9)
7. Final polish and deliver

User Sees:
- Optimized query with explanations
- Performance improvements quantified
- Next steps for further optimization
```

## Success Indicators

- **Excellence Achieved**: All criteria >= 8/10
- **Good Quality**: Average >= 7/10, no criteria < 6
- **Needs Work**: Any criteria < 6/10

## Next Steps

After iteration:
- High quality -> suggest `/commit` or `/test`
- Code changes -> suggest `/lint` verification
- Complex issues -> suggest `/debug` or `/review-code`


Final Output Format:
- **Rubric (with criteria)**
- **Initial Answer**
- **Self-Evaluation (with scores + commentary)**
- **First Revision**
- **Second Self-Evaluation**
- **Second Revision**
- **Third Self-Evaluation 
- Repeat self-evaluation and revision until top marks are reached across ALL categories. 
- **Final Improved Answer**