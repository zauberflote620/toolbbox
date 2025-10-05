---
allowed-tools: Read, Bash(python:*), Glob, Task
description: Batch ingest multiple documents into memory
argument-hint: <directory> [--pattern "*.md"] [--recursive]
---

## Batch Ingest Documents

Batch ingest multiple documents from a directory into the MonsterOS memory system.

### Scan and ingest files:
!`python -c "
import os
import json
from pathlib import Path
from glob import glob
from app.database.ingestion_processor import IngestionProcessor
from app.hipporag.core.memory_system import MemorySystem

# Parse arguments
args = '$ARGUMENTS'.split()
directory = args[0] if args else '.'
pattern = '*.md'
recursive = False

# Parse optional arguments
for i, arg in enumerate(args):
    if arg == '--pattern' and i+1 < len(args):
        pattern = args[i+1].strip('\"')
    elif arg == '--recursive':
        recursive = True

# Initialize processors
processor = IngestionProcessor()
memory = MemorySystem()

# Find files
if recursive:
    files = list(Path(directory).rglob(pattern))
else:
    files = list(Path(directory).glob(pattern))

print(f'Found {len(files)} files matching pattern: {pattern}')

# Process each file
total_chunks = 0
failed_files = []

for file_path in files:
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        # Skip empty files
        if not content.strip():
            continue
            
        # Chunk and store
        chunks = processor.chunk_text(content, chunk_size=512)
        
        for i, chunk in enumerate(chunks):
            metadata = {
                'source': str(file_path),
                'chunk_index': i,
                'total_chunks': len(chunks),
                'file_type': file_path.suffix
            }
            memory.store(chunk, metadata=metadata)
        
        total_chunks += len(chunks)
        print(f'✅ {file_path.name}: {len(chunks)} chunks')
        
    except Exception as e:
        failed_files.append((str(file_path), str(e)))
        print(f'❌ {file_path.name}: {e}')

# Summary
print(f'\\n=== Batch Ingestion Summary ===')
print(f'Total files processed: {len(files) - len(failed_files)}')
print(f'Total chunks created: {total_chunks}')
if failed_files:
    print(f'Failed files: {len(failed_files)}')
    for file, error in failed_files[:5]:
        print(f'  - {file}: {error}')
"`

### Supported patterns:
- `*.md` - All markdown files
- `*.py` - All Python files
- `*.{js,ts,jsx,tsx}` - All JavaScript/TypeScript files
- `**/*.txt` - All text files recursively
- `test_*.py` - All test files

### Options:
- `--pattern [glob]` - File pattern to match (default: *.md)
- `--recursive` - Search subdirectories recursively
- `--chunk-size [number]` - Chunk size in tokens (default: 512)
- `--skip-existing` - Skip files already in memory
- `--max-files [number]` - Maximum files to process

### Examples:
```
/ingest-batch docs/
/ingest-batch app/agents/ --pattern "*.py" --recursive
/ingest-batch data/knowledge/ --pattern "*.{txt,md}"
```