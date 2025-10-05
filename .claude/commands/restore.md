# MonsterOS Restoration Command

Analyze and restore MonsterOS codebase fragmentation using intelligent agents.

## Usage
- `/restore` - Full fragmentation analysis and restoration plan
- `/restore analyze` - Quick fragmentation analysis only
- `/restore plan` - Generate restoration plan from previous analysis
- `/restore execute` - Execute restoration with confirmation prompts
- `/restore status` - Check restoration system status

## What This Does

1. **Fragmentation Analysis**: Scans codebase for:
   - Duplicate agent implementations
   - Scattered configuration files  
   - Broken import statements
   - Multiple UI system conflicts

2. **Smart Planning**: Creates restoration plans with:
   - Conflict resolution strategies
   - Rollback procedures
   - Validation tests
   - Token-efficient execution

3. **Safe Execution**: Implements changes with:
   - Automatic backups
   - Dry-run capabilities
   - Step-by-step confirmation
   - Error recovery

## Background System

The restoration system runs on a token-efficient schedule:
- **Health checks**: Every 30 minutes (0 tokens)
- **Analysis**: Every 2 hours (0 tokens) 
- **Maintenance**: Weekly (0 tokens)
- **Only uses tokens for complex conflict resolution when needed**

!python scripts/claude_agents/claude_restoration_agent.py $ARGUMENTS