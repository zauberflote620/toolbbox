# Code Integration Command

Intelligent code integration to resolve fragmentation and conflicts.

## Usage
- `/integrate` - Analyze and show integration opportunities
- `/integrate functions` - Merge duplicate functions
- `/integrate classes` - Consolidate similar classes
- `/integrate imports` - Unify import statements
- `/integrate configs` - Centralize configuration files

## What This Does

1. **Duplicate Detection**:
   - Finds duplicate functions across files
   - Identifies similar classes with overlapping methods
   - Detects redundant import patterns
   - Locates scattered configuration files

2. **Smart Merging**:
   - Chooses best implementation (most complete)
   - Preserves functionality and tests
   - Creates backup files automatically
   - Updates all references

3. **Conflict Resolution**:
   - Analyzes method signatures
   - Calculates similarity scores
   - Suggests merge strategies
   - Provides rollback options

## Integration Strategies

**Function Merging**:
- Keep most complete implementation
- Preserve all functionality
- Update import references
- Maintain backward compatibility

**Class Consolidation**:
- Merge similar method sets
- Resolve inheritance conflicts
- Update instantiation patterns
- Preserve type signatures

**Import Unification**:
- Remove duplicate imports
- Standardize import patterns
- Optimize import order
- Fix broken references

## Safety Features

- **Dry-run mode**: Test changes without applying
- **Automatic backups**: `.backup.timestamp` files created
- **Validation tests**: Run tests after integration
- **Rollback capability**: Restore from backups if needed

## Example Output
```
🔍 Found 15 duplicate function groups
📦 Found 8 similar class groups  
📝 Found 12 import conflicts
🏗️  Generated 6 integration plans

Integration Plan 1: merge_functions
  Target: app/agents/base_agent.py
  Sources: 3 duplicate implementations
  Strategy: keep_most_complete
  Confidence: 95%
```

!python scripts/claude_agents/intelligent_integration.py $ARGUMENTS