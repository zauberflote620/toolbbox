---
allowed-tools: Bash(python:*), Read
description: Check all agent health metrics and status
argument-hint: [agent-name|all] [--verbose]
---

## Agent Status Monitor

Check the health metrics and status of MonsterOS character agents.

### Get comprehensive agent status:
!`python -c "
import json
from app.agents.agent_registry import AgentRegistry
from app.monitoring.connectors.agent_monitor_connector import AgentMonitorConnector
from app.api.routes.agent_monitoring import get_agent_metrics

registry = AgentRegistry()
monitor = AgentMonitorConnector()

# Get agent list
agents = registry.list_all_agents()
target = '$ARGUMENTS'.split()[0] if '$ARGUMENTS' else 'all'
verbose = '--verbose' in '$ARGUMENTS'

status_report = {
    'timestamp': datetime.now().isoformat(),
    'total_agents': len(agents),
    'agents': {}
}

for agent_id in agents:
    if target != 'all' and target != agent_id:
        continue
        
    agent_status = {
        'active': registry.is_agent_active(agent_id),
        'health': monitor.get_agent_health(agent_id),
        'memory_usage': monitor.get_memory_usage(agent_id),
        'response_time_ms': monitor.get_avg_response_time(agent_id),
        'total_interactions': monitor.get_interaction_count(agent_id),
        'error_rate': monitor.get_error_rate(agent_id),
        'last_active': monitor.get_last_activity(agent_id)
    }
    
    if verbose:
        # Add detailed metrics
        agent_status['detailed_metrics'] = get_agent_metrics(agent_id)
        agent_status['resource_usage'] = {
            'cpu_percent': monitor.get_cpu_usage(agent_id),
            'memory_mb': monitor.get_memory_mb(agent_id),
            'thread_count': monitor.get_thread_count(agent_id)
        }
    
    status_report['agents'][agent_id] = agent_status

print(json.dumps(status_report, indent=2))
"`

### Monitor real-time agent activity:
```python
from app.monitoring.realtime.pipeline_integration import RealtimePipeline
from app.agents.monitoring.agent_performance_monitor import AgentPerformanceMonitor

pipeline = RealtimePipeline()
monitor = AgentPerformanceMonitor()

# Stream real-time metrics
for metric in monitor.stream_metrics(limit=10):
    print(f"[{metric.timestamp}] {metric.agent_id}: {metric.event_type} - {metric.value}")
```

### Health check summary:
!`python -c "
from app.agents.agent_registry import AgentRegistry

registry = AgentRegistry()
health_summary = registry.health_check_all()

for agent, status in health_summary.items():
    status_emoji = '✅' if status['healthy'] else '❌'
    print(f'{status_emoji} {agent}: {status['status']} - {status.get('message', 'OK')}')"
`

### Examples:
```
/agent-status all
/agent-status neo --verbose
/agent-status owl
```