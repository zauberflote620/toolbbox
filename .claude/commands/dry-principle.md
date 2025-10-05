# DRY Principle

## Guideline: Extract code appearing 2+ times (when it makes sense)

### Common Patterns in MonsterOS
```python
# Colors/Icons → utils/styles.py
get_status_color(status)  # Used in agents, notifications
get_agent_icon(animal)    # Centralized emoji mapping

# API patterns → api/backend_client.py
try:
    response = self.session.get(url)
    response.raise_for_status()
    return response.json()
except Exception as e:
    return {"error": str(e)}
```

### Where to Extract (suggestions)
- **Styles** → `utils/styles.py` (if used across components)
- **API calls** → `api/backend_client.py` (for backend communication)
- **Constants** → Consider if truly constant across app
- **Components** → Only if genuinely reusable

### When NOT to Extract
- One-off styling specific to a component
- Logic tightly coupled to a specific page
- Simple 2-3 line patterns (overhead > benefit)