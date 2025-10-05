# Agent Management Command

Manage MonsterOS autonomous agents and restoration system.

## Usage
- `/agents` - Show all agent status
- `/agents start` - Start agent scheduler
- `/agents stop` - Stop agent scheduler  
- `/agents schedule` - View task schedule
- `/agents budget` - Token budget management
- `/agents logs` - Recent agent activity

## Agent Types

1. **Restoration Agents**:
   - Fragmentation detector
   - Code consolidator
   - Configuration centralizer
   - Import optimizer

2. **Monitoring Agents**:
   - Health checker
   - Performance monitor
   - Error detector
   - Quality assurance

3. **Maintenance Agents**:
   - Backup creator
   - Log cleaner
   - Cache optimizer
   - Security auditor

## Token-Efficient Design

The agent system is designed for **zero continuous token usage**:

- **Local Analysis**: All scanning and detection is done locally
- **Smart Scheduling**: Priority-based execution (critical → maintenance)
- **Budget Protection**: Hard daily limits with usage tracking
- **Selective Claude Usage**: Only for complex conflict resolution

## Scheduling

- **Critical tasks**: Every 30 minutes (health checks)
- **High priority**: Every 2 hours (fragmentation analysis)
- **Medium priority**: Every 6 hours (code optimization)
- **Low priority**: Daily at 2 AM (maintenance)
- **Maintenance**: Weekly on Sunday at 3 AM (backups)

## Commands
```bash
# Start agent scheduler in background
!python scripts/claude_agents/claude_scheduler.py --daemon &

# Check specific task
!python scripts/claude_agents/claude_scheduler.py --run-task health_check

# View detailed status
!python scripts/claude_agents/claude_scheduler.py --status
```

!python scripts/claude_agents/claude_scheduler.py $ARGUMENTS