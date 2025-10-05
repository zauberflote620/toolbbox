---
allowed-tools: Bash(python:*), Read
description: Query the HippoRAG memory system
argument-hint: <query> [--limit 10] [--threshold 0.7]
---

## Query HippoRAG Memory

Query the MonsterOS neurobiological memory system for stored knowledge.

### Execute memory query:
!`python -c "
import json
from app.hipporag.core.memory_system import MemorySystem
from app.hipporag.core.orchestrator import Orchestrator

# Parse arguments
query_text = '$ARGUMENTS'.split('--')[0].strip() if '$ARGUMENTS' else ''
args = '$ARGUMENTS'.split()
limit = 10
threshold = 0.7

# Parse optional arguments
for i, arg in enumerate(args):
    if arg == '--limit' and i+1 < len(args):
        limit = int(args[i+1])
    elif arg == '--threshold' and i+1 < len(args):
        threshold = float(args[i+1])

if not query_text:
    print('Error: No query provided')
    exit(1)

# Initialize memory system
memory = MemorySystem()
orchestrator = Orchestrator()

# Perform query with HippoRAG retrieval
results = memory.query(
    query_text,
    limit=limit,
    similarity_threshold=threshold
)

print(f'Query: \"{query_text}\"')
print(f'Found {len(results)} relevant memories\\n')

# Display results
for i, result in enumerate(results, 1):
    print(f'--- Result {i} (Score: {result.score:.3f}) ---')
    print(f'Content: {result.content[:300]}...' if len(result.content) > 300 else f'Content: {result.content}')
    if hasattr(result, 'metadata') and result.metadata:
        print(f'Source: {result.metadata.get(\"source\", \"unknown\")}')
        print(f'Chunk: {result.metadata.get(\"chunk_index\", \"?\")} of {result.metadata.get(\"total_chunks\", \"?\")}')
    print()

# Show knowledge graph connections
if len(results) > 0:
    print('\\n=== Related Knowledge Graph Entities ===')
    entities = orchestrator.extract_entities(query_text)
    for entity in entities[:5]:
        connections = orchestrator.get_entity_connections(entity)
        if connections:
            print(f'• {entity}: {len(connections)} connections')
"`

### Query types:
- **Semantic search**: Find similar content by meaning
- **Keyword search**: Find exact matches
- **Entity search**: Find memories related to specific entities
- **Temporal search**: Find memories from specific time periods

### Options:
- `--limit [number]` - Maximum results to return (default: 10)
- `--threshold [float]` - Similarity threshold 0-1 (default: 0.7)
- `--collection [name]` - Search specific collection
- `--include-metadata` - Include full metadata in results
- `--graph-expand` - Expand results using knowledge graph

### Examples:
```
/query-memory "How does authentication work?"
/query-memory "character agent implementation" --limit 20
/query-memory "HippoRAG memory system" --threshold 0.8
```