# Error Handling

## Guideline: Handle errors appropriately for context

### MonsterOS Error Patterns

```python
# FastAPI - Return HTTP errors
try:
    result = await operation()
    return result
except ValueError as e:
    raise HTTPException(status_code=400, detail=str(e))
except Exception as e:
    logger.error(f"Operation failed: {e}")
    raise HTTPException(status_code=500, detail="Internal error")

# Streamlit - User-friendly messages
try:
    data = client.get_agents()
except Exception as e:
    st.error("Could not load agents. Please try again.")
    return {"agents": [], "error": str(e)}  # Fallback data

# Background tasks - Log and continue
try:
    await process_task()
except Exception as e:
    logger.error(f"Task failed: {e}", exc_info=True)
    # Continue processing other tasks
```

### Context-Specific Handling
- **API Routes**: HTTPException with appropriate status codes
- **UI Code**: User-friendly messages + fallback behavior
- **Agents**: Return error in response format, don't crash
- **Background**: Log errors, metrics, continue operation
- **Critical Path**: Fail fast with clear errors

### Avoid
- Silent failures (always log or notify)
- Generic "Something went wrong" without context
- Catching Exception when specific errors expected