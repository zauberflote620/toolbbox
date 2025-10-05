---
allowed-tools: Bash(python:*), Read
description: Show data ingestion and query statistics
argument-hint: [--verbose]
---

## Data System Status

Display comprehensive statistics about the MonsterOS data ingestion and query systems.

### Get data system status:
!`python -c "
import json
from datetime import datetime
from app.hipporag.core.memory_system import MemorySystem
from app.database.qdrant_client import QdrantClient
from app.database.connection_manager import ConnectionManager

verbose = '--verbose' in '$ARGUMENTS'

# Initialize systems
memory = MemorySystem()
qdrant = QdrantClient()
db = ConnectionManager()

status = {
    'timestamp': datetime.now().isoformat(),
    'systems': {}
}

# HippoRAG Memory Status
try:
    memory_stats = {
        'total_memories': memory.count_memories(),
        'collections': memory.list_collections(),
        'cache_size': memory.get_cache_size(),
        'health': 'healthy' if memory.check_health() else 'degraded'
    }
    status['systems']['hipporag'] = memory_stats
except Exception as e:
    status['systems']['hipporag'] = {'status': 'error', 'message': str(e)}

# Qdrant Vector Database Status
try:
    qdrant_stats = qdrant.get_collection_stats()
    qdrant_stats['health'] = 'healthy' if qdrant.health_check() else 'degraded'
    status['systems']['qdrant'] = qdrant_stats
except Exception as e:
    status['systems']['qdrant'] = {'status': 'error', 'message': str(e)}

# PostgreSQL Status
try:
    pg_stats = {
        'connection_pool': db.get_pool_stats(),
        'active_connections': db.get_active_connections(),
        'database_size': db.get_database_size(),
        'health': 'healthy' if db.health_check() else 'degraded'
    }
    status['systems']['postgresql'] = pg_stats
except Exception as e:
    status['systems']['postgresql'] = {'status': 'error', 'message': str(e)}

# Performance Metrics
if verbose:
    try:
        perf_metrics = memory.get_performance_metrics()
        status['performance'] = {
            'avg_ingestion_time_ms': perf_metrics.get('avg_ingestion_time', 0),
            'avg_query_time_ms': perf_metrics.get('avg_query_time', 0),
            'cache_hit_rate': perf_metrics.get('cache_hit_rate', 0),
            'memory_usage_mb': perf_metrics.get('memory_usage_mb', 0)
        }
    except:
        pass

# Recent Activity
try:
    recent = {
        'last_ingestion': memory.get_last_ingestion_time(),
        'last_query': memory.get_last_query_time(),
        'ingestions_today': memory.get_ingestion_count_today(),
        'queries_today': memory.get_query_count_today()
    }
    status['recent_activity'] = recent
except:
    pass

# Display Status
print('=== MonsterOS Data System Status ===\\n')

for system, stats in status['systems'].items():
    health = stats.get('health', 'unknown')
    emoji = '✅' if health == 'healthy' else '⚠️' if health == 'degraded' else '❌'
    print(f'{emoji} {system.upper()}:')
    
    if 'error' not in stats:
        for key, value in stats.items():
            if key != 'health':
                print(f'  • {key}: {value}')
    else:
        print(f'  Error: {stats.get(\"message\", \"Unknown error\")}')
    print()

if 'recent_activity' in status:
    print('📊 Recent Activity:')
    for key, value in status['recent_activity'].items():
        print(f'  • {key}: {value}')
    print()

if verbose and 'performance' in status:
    print('⚡ Performance Metrics:')
    for key, value in status['performance'].items():
        print(f'  • {key}: {value}')
"`

### Options:
- `--verbose` - Show detailed performance metrics
- `--json` - Output as JSON
- `--collection [name]` - Show stats for specific collection

### Information displayed:
- **HippoRAG**: Memory count, collections, cache status
- **Qdrant**: Vector count, index status, storage usage
- **PostgreSQL**: Connections, database size, health
- **Performance**: Query times, ingestion rates, cache hits
- **Activity**: Recent operations, daily statistics

### Examples:
```
/data-status
/data-status --verbose
```