---
allowed-tools: Bash(python:*), Read
description: Semantic search in Qdrant vector database
argument-hint: <query> [--collection main] [--limit 10]
---

## Query Vector Database

Perform semantic similarity search in the Qdrant vector database.

### Execute vector search:
!`python -c "
import json
import numpy as np
from app.database.qdrant_client import QdrantClient
from app.hipporag.embedding_store import EmbeddingStore
from sentence_transformers import SentenceTransformer

# Parse arguments
query_text = '$ARGUMENTS'.split('--')[0].strip() if '$ARGUMENTS' else ''
args = '$ARGUMENTS'.split()
collection = 'hipporag_memories'
limit = 10

# Parse optional arguments
for i, arg in enumerate(args):
    if arg == '--collection' and i+1 < len(args):
        collection = args[i+1]
    elif arg == '--limit' and i+1 < len(args):
        limit = int(args[i+1])

if not query_text:
    print('Error: No query provided')
    exit(1)

# Initialize clients
qdrant = QdrantClient(
    host='localhost',
    port=6333,
    collection_name=collection
)

# Generate embedding for query
model = SentenceTransformer('all-MiniLM-L6-v2')
query_embedding = model.encode(query_text)

# Perform vector search
results = qdrant.search(
    query_vector=query_embedding.tolist(),
    limit=limit
)

print(f'Query: \"{query_text}\"')
print(f'Collection: {collection}')
print(f'Found {len(results)} similar vectors\\n')

# Display results
for i, result in enumerate(results, 1):
    print(f'--- Result {i} ---')
    print(f'Score: {result.score:.4f}')
    print(f'ID: {result.id}')
    
    # Show payload/metadata
    if result.payload:
        print(f'Content: {result.payload.get(\"content\", \"\")[:300]}...')
        print(f'Source: {result.payload.get(\"source\", \"unknown\")}')
        if 'metadata' in result.payload:
            meta = result.payload['metadata']
            print(f'Metadata: {json.dumps(meta, indent=2)}')
    print()

# Show collection statistics
stats = qdrant.get_collection_stats()
print(f'\\n=== Collection Statistics ===')
print(f'Total vectors: {stats.get(\"vectors_count\", 0)}')
print(f'Indexed vectors: {stats.get(\"indexed_vectors_count\", 0)}')
print(f'Points count: {stats.get(\"points_count\", 0)}')
"`

### Search modes:
- **Semantic similarity**: Find conceptually similar content
- **Exact match**: Find vectors with specific metadata
- **Hybrid search**: Combine vector and metadata filtering
- **Range search**: Find vectors within distance threshold

### Options:
- `--collection [name]` - Target collection (default: hipporag_memories)
- `--limit [number]` - Maximum results (default: 10)
- `--filter [json]` - Metadata filter as JSON
- `--with-payload` - Include full payload in results
- `--score-threshold [float]` - Minimum similarity score

### Available collections:
- `hipporag_memories` - Main memory storage
- `agent_interactions` - Agent conversation history
- `knowledge_base` - Ingested documents
- `embeddings_cache` - Cached embeddings

### Examples:
```
/query-vector "user authentication flow"
/query-vector "character agent behavior" --limit 20
/query-vector "memory system" --collection knowledge_base
```