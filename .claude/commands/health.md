# System Health Command

Comprehensive health check and monitoring for MonsterOS.

## Usage
- `/health` - Full system health report
- `/health quick` - Fast health check (30 seconds)
- `/health services` - Check all services status
- `/health agents` - Agent system status
- `/health tokens` - Token usage and budget status
- `/health creds` - Detailed credential validation
- `/health creds-reset` - Clear session cache and revalidate

## What This Checks

1. **Core Services**:
   - PostgreSQL database connection
   - Redis cache status
   - Qdrant vector database
   - API server health

2. **Agent System**:
   - Agent registry status
   - Background restoration processes
   - Scheduled task execution
   - Memory usage and performance

3. **Development Environment**:
   - Node.js and Python versions
   - Package manager status (ppnpm)
   - Git repository health
   - Docker container status

4. **Token Management**:
   - Daily token usage tracking
   - Budget remaining
   - Scheduled task efficiency
   - Cost optimization recommendations

## Emergency Recovery

If system appears broken:
```bash
# Emergency health check
!python scripts/workflow/simple_error_monitor.py --check --interactive

# Restore from backup
!python scripts/dev_command/commands/save_command.py --restore

# Restart core services
!startall
```

source scripts/claude/context/load_context.sh 2>/dev/null || true

# Handle credential-specific commands
if [[ "$ARGUMENTS" == "creds" ]]; then
    echo "🔐 Credential Status:"
    python -m app.utils.credential_validator --status
    exit 0
elif [[ "$ARGUMENTS" == "creds-reset" ]]; then
    echo "🔄 Resetting credential cache..."
    python -m app.utils.credential_validator --clear-cache
    python -m app.utils.credential_validator
    exit 0
fi

# Default health check including credentials
!echo "🔐 Credential Status:"
!python -m app.utils.credential_validator --status --json 2>/dev/null | python -c "
import sys, json
try:
    data = json.load(sys.stdin)
    source = data.get('source', 'unknown')
    validated = data.get('validated', False)
    icon = '✅' if validated else '⏳'
    print(f'{icon} Source: {source}')
    if validated:
        print('   Session cache: Active')
except:
    print('⚠️ Could not check credentials')
"

!echo ""
!python scripts/workflow/simple_error_monitor.py $ARGUMENTS