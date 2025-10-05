# Token Efficiency

## Guideline: Write concise, focused code

### Token-Saving Patterns

```python
# Use clear, short variable names
# ❌ BAD: user_profile_data_from_database
# ✅ GOOD: user_data

# Combine related operations
# ❌ BAD:
status = agent.get_status()
if status == "active":
    result = True
else:
    result = False

# ✅ GOOD:
result = agent.get_status() == "active"

# Use Python idioms
data = response.json() if response.ok else {}
items = [x for x in data if x.active]
```

### File & Import Efficiency
- Group related imports
- Use relative imports in packages
- Avoid circular imports
- Don't repeat docstrings for obvious functions

### Communication Efficiency
- State file paths once, clearly
- Use concise commit messages
- Avoid verbose explanations unless asked
- Focus on what changed, not why

### When to be Verbose
- Complex algorithms need comments
- API documentation
- Security-critical code
- Non-obvious business logic