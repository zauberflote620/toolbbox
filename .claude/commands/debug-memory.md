---
allowed-tools: Bash(python:*), Read, Grep
description: Debug HippoRAG memory operations
argument-hint: [operation] [query]
---

## Debug HippoRAG Memory System

Analyze and debug the HippoRAG neurobiological memory system.

### Check memory system status:
!`python -c "
from app.hipporag.core.memory_system import MemorySystem
import json

memory = MemorySystem()
status = {
    'total_memories': memory.count_memories(),
    'collections': memory.list_collections(),
    'vector_db_status': memory.check_vector_db_health(),
    'graph_db_status': memory.check_graph_db_health(),
    'cache_size': memory.get_cache_size()
}
print(json.dumps(status, indent=2))
"`

### Debug specific operation:
```python
from app.hipporag.core.memory_system import MemorySystem
from app.hipporag.core.orchestrator import Orchestrator
import logging

# Enable debug logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger('hipporag')

memory = MemorySystem()
orchestrator = Orchestrator()

# Debug based on operation type
operation = "$ARGUMENTS".split()[0] if "$ARGUMENTS" else "status"

if operation == "store":
    # Debug memory storage
    test_data = "Test memory content for debugging"
    result = memory.store_with_debug(test_data)
    print(f"Storage result: {result}")
    
elif operation == "retrieve":
    # Debug memory retrieval
    query = " ".join("$ARGUMENTS".split()[1:]) if len("$ARGUMENTS".split()) > 1 else "test query"
    results = memory.retrieve_with_debug(query)
    print(f"Retrieved {len(results)} memories")
    for r in results[:5]:
        print(f"- Score: {r.score}, Content: {r.content[:100]}...")
        
elif operation == "graph":
    # Debug knowledge graph
    graph_stats = orchestrator.get_graph_statistics()
    print(f"Graph statistics: {graph_stats}")
    
elif operation == "performance":
    # Performance analysis
    perf_metrics = memory.get_performance_metrics()
    print(f"Performance metrics: {perf_metrics}")
```

### Available operations:
- `status` - Overall system status
- `store [content]` - Debug storage operation
- `retrieve [query]` - Debug retrieval operation
- `graph` - Knowledge graph statistics
- `performance` - Performance metrics
- `clear-cache` - Clear memory cache
- `repair` - Run diagnostic and repair

### Examples:
```
/debug-memory status
/debug-memory retrieve "authentication flow"
/debug-memory performance
```