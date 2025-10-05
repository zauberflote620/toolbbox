---
allowed-tools: Read, Bash(python:*), Task
description: Ingest document into HippoRAG memory system
argument-hint: <file-path> [--chunk-size 512] [--collection main]
---

## Ingest File into Memory System

Ingest a document into the MonsterOS HippoRAG memory system with intelligent chunking and embedding.

### Ingest the file:
!`python -c "
import sys
import json
from pathlib import Path
from app.database.ingestion_processor import IngestionProcessor
from app.hipporag.core.memory_system import MemorySystem

# Parse arguments
args = '$ARGUMENTS'.split()
file_path = args[0] if args else ''
chunk_size = 512
collection = 'main'

# Parse optional arguments
for i, arg in enumerate(args):
    if arg == '--chunk-size' and i+1 < len(args):
        chunk_size = int(args[i+1])
    elif arg == '--collection' and i+1 < len(args):
        collection = args[i+1]

if not file_path or not Path(file_path).exists():
    print(f'Error: File not found: {file_path}')
    sys.exit(1)

# Initialize processors
processor = IngestionProcessor()
memory = MemorySystem()

# Read and process file
with open(file_path, 'r') as f:
    content = f.read()

# Ingest into database
chunks = processor.chunk_text(content, chunk_size=chunk_size)
print(f'Processing {len(chunks)} chunks from {file_path}')

# Store in memory system
for i, chunk in enumerate(chunks):
    metadata = {
        'source': file_path,
        'chunk_index': i,
        'total_chunks': len(chunks),
        'collection': collection
    }
    memory.store(chunk, metadata=metadata)

print(f'Successfully ingested {file_path} into collection: {collection}')
print(f'Total chunks: {len(chunks)}')
print(f'Chunk size: {chunk_size} tokens')
"`

### Supported file formats:
- Text files: `.txt`, `.md`, `.rst`
- Documents: `.pdf`, `.docx`, `.odt` (requires additional processing)
- Code files: `.py`, `.js`, `.ts`, `.jsx`, `.tsx`
- Data files: `.json`, `.csv`, `.xml`, `.yaml`
- Log files: `.log`

### Options:
- `--chunk-size [number]` - Set chunk size in tokens (default: 512)
- `--overlap [number]` - Set chunk overlap in tokens (default: 50)
- `--collection [name]` - Target collection name (default: main)
- `--metadata [json]` - Add custom metadata as JSON string
- `--embedding-model [name]` - Choose embedding model

### Examples:
```
/ingest-file docs/api_reference.md
/ingest-file app/agents/characters/neo_agent.py --chunk-size 256
/ingest-file data/knowledge/concepts.txt --collection knowledge
```