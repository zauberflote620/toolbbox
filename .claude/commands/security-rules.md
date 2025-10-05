# Security Rules

## Core Security Principles

### Never Commit Secrets
```python
# ❌ BAD
API_KEY = "sk-1234567890abcdef"
password = "admin123"

# ✅ GOOD
API_KEY = os.getenv("API_KEY")
password = get_secret("db_password")
```

### MonsterOS Security Patterns
- **Cloudflare Auth**: Always enabled, don't bypass
- **Environment Variables**: Use `direnv` (.envrc files)
- **Database Creds**: Via environment or secure vault
- **API Keys**: Never hardcoded, always env vars
- **File Permissions**: Check sensitive files are protected

### Input Validation
```python
# Validate all user inputs
def process_user_data(data: str):
    if not isinstance(data, str):
        raise ValueError("Invalid input type")
    sanitized = clean_input(data)
    return sanitized
```

### API Security
```python
# Always use authentication
@router.get("/endpoint")
async def endpoint(_: str = Depends(verify_authentication)):
    # Endpoint logic

# Rate limiting
from app.api.middleware import rate_limit
@rate_limit(calls=100, period=60)
```

### Least Privilege Principle
```python
# Grant minimum necessary permissions
@requires_permission("users:read")  # Not "admin"
def view_user_profile(user_id, current_user):
    if user_id == current_user.id or has_permission(current_user, "users:read"):
        return get_user(user_id)
    raise PermissionError()

# Use read-only DB connections when possible
read_db = get_db_connection(readonly=True)

# Restrict file access to specific directories
ALLOWED_PATHS = ["/app/uploads", "/app/temp"]
```

### Data Security
- **SQL Injection**: Use parameterized queries only
- **XSS Prevention**: Sanitize all rendered content
- **Path Traversal**: Validate file paths against whitelist
- **CORS**: Configure allowed origins explicitly
- **File Uploads**: Validate type, size, scan for malware

### Enterprise Best Practices
- **Zero Trust**: Verify every request, trust nothing
- **Defense in Depth**: Multiple security layers
- **Audit Everything**: Log access and changes
- **Rotate Credentials**: Regular key/password rotation
- **Incident Response**: Have a plan, test it regularly

### Security Checklist
- [ ] No secrets in code
- [ ] All inputs validated
- [ ] Auth checks on endpoints
- [ ] Least privilege access
- [ ] Error messages don't leak info
- [ ] Logs don't contain sensitive data
- [ ] Dependencies scanned for vulnerabilities
- [ ] File permissions restricted appropriately