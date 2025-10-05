# Single Responsibility

## Guideline: Functions should focus on one primary task

### Common Patterns Across MonsterOS

```python
# Pattern 1: Separate I/O from Logic
# FastAPI routes
async def endpoint():
    data = await fetch()      # I/O
    result = process(data)    # Logic
    return format(result)     # Response

# Pattern 2: Delegate Complex Operations
# Agent implementations
async def process_message(self, message):
    parsed = self.parse(message)
    result = await self.execute(parsed)
    return self.format_response(result)

# Pattern 3: Compose UI from Parts
# Any UI framework
def render_view():
    data = get_data()
    render_header(data)
    render_content(data)
    render_actions(data)
```

### Flexible Guidelines
- **Length**: Aim for <30 lines, but complex algorithms can be longer
- **Naming**: Clear intent matters more than avoiding "and"
- **Coupling**: OK to keep tightly related operations together
- **Context**: Agent methods can be larger due to orchestration needs

### When to Split
- Mixed concerns (UI + business logic + data access)
- Multiple levels of abstraction in one function
- Hard to test individual parts
- Reusable logic buried in larger function