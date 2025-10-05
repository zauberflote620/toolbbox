# Token Budget Management

Track and optimize Claude API token usage across MonsterOS.

## Usage
- `/budget` - Current token usage and remaining budget
- `/budget history` - Token usage history and trends
- `/budget optimize` - Suggest optimization strategies
- `/budget set <amount>` - Set daily token budget
- `/budget reset` - Reset daily counter

## Current Status

The MonsterOS agent system is designed for **minimal token usage**:

- **Daily Budget**: 1000 tokens (conservative)
- **Current Usage**: Tracked automatically
- **Reset Time**: Daily at midnight
- **Emergency Reserve**: 200 tokens for critical issues

## Token-Free Operations

Most operations use **0 tokens**:
- Health checks and monitoring
- Fragmentation analysis (local scanning)
- Code integration analysis
- Configuration validation
- System optimization
- Backup creation

## When Tokens Are Used

Only for **complex decision-making**:
- Ambiguous merge conflicts requiring human-like judgment
- Complex refactoring decisions
- Advanced code generation requests
- Error diagnosis requiring AI reasoning

## Optimization Strategies

1. **Batch Operations**: Group similar tasks together
2. **Local Analysis First**: Use token-free scanning before AI
3. **Smart Caching**: Remember previous decisions
4. **Selective Engagement**: Only use Claude for complex cases
5. **Schedule Optimization**: Run during off-peak hours

## Budget Alerts

- **75% usage**: Warning notification
- **90% usage**: Restrict non-critical tasks
- **95% usage**: Emergency mode (critical tasks only)
- **100% usage**: Stop all token-consuming operations

## Historical Tracking

Track usage patterns to optimize:
- Peak usage times
- Most expensive operations
- Optimization opportunities
- Cost-benefit analysis

## Example Output
```
📊 TOKEN BUDGET STATUS
Daily Budget: 150/1000 tokens (15% used)
Remaining: 850 tokens
Time to Reset: 14h 23m

Recent Usage:
- Health checks: 0 tokens (24 runs)
- Fragmentation analysis: 0 tokens (3 runs)  
- Complex merge resolution: 150 tokens (1 run)

Recommendations:
✅ System running efficiently
✅ Well within budget
💡 Consider increasing analysis frequency
```

!python scripts/claude_agents/claude_scheduler.py --budget-status $ARGUMENTS