---
description: Clean workspace intelligently through systematic cleanup phases
argument-hint: [cache|logs|docker|temp|node_modules|all] - Cleanup scope
allowed-tools: Bash(find:*), Bash(rm:*), Bash(docker:*), Read, Grep
---

## Context
- Current directory: !`pwd`
- Disk usage: !`df -h .`
- Python cache: !`find . -name "__pycache__" -type d | wc -l`
- Node modules: !`find . -name "node_modules" -type d | wc -l`
- Docker images: !`docker images --format "table {{.Repository}}\t{{.Size}}" 2>/dev/null | wc -l || echo "0"`

## Your Task

Execute ALL numbered steps in order based on $ARGUMENTS (or smart cleanup if none).

### Step 1: Determine Cleanup Scope
1.1. If $ARGUMENTS = "cache" → Python/JS cache only
1.2. If $ARGUMENTS = "logs" → Log files only  
1.3. If $ARGUMENTS = "docker" → Docker cleanup only
1.4. If $ARGUMENTS = "temp" → Temporary files only
1.5. If $ARGUMENTS = "node_modules" → Node dependencies only
1.6. If $ARGUMENTS = "all" → All cleanup types
1.7. If no $ARGUMENTS → Analyze and suggest what to clean

### Step 2: Safety Check
2.1. Verify we're in MonsterOS directory (check for CLAUDE.md)
2.2. Verify we're in the correct branch: working_phoenix
2.3. If in wrong directory → STOP and warn user
2.4. Calculate total space to be freed
2.5. If >10GB → Ask user confirmation before proceeding

### Step 3: Cache Cleanup (if scope includes cache or all)
3.1. Python cache cleanup:
     - Remove: `find . -name "__pycache__" -type d -exec rm -rf {} +`
     - Remove: `find . -name "*.pyc" -delete`
     - Remove: `find . -name ".pytest_cache" -type d -exec rm -rf {} +`
     - Remove: `find . -name ".mypy_cache" -type d -exec rm -rf {} +`
3.2. JavaScript/TypeScript cache:
     - Remove: `find . -name ".next" -type d -exec rm -rf {} +`
     - Remove: `find . -name ".nuxt" -type d -exec rm -rf {} +`
     - Remove: `rm -rf node_modules/.cache`
3.3. Count space freed in this step

### Step 4: Log Cleanup (if scope includes logs or all)
4.1. Application logs:
     - Remove: `find . -name "*.log" -delete`
     - Remove: `find . -name "npm-debug.log*" -delete`
     - Remove: `rm -rf logs/*.log` (if logs directory exists)
4.2. System temp logs:
     - Remove: `find /tmp -name "*monsteros*" -delete 2>/dev/null`
4.3. Count space freed in this step

### Step 5: Docker Cleanup (if scope includes docker or all)
5.1. Remove dangling images:
     - Run: `docker image prune -f`
5.2. Remove unused volumes:
     - Run: `docker volume prune -f`
5.3. Remove stopped containers:
     - Run: `docker container prune -f`
5.4. Count space freed in this step

### Step 6: Temporary Files (if scope includes temp or all)
6.1. Development temp files:
     - Remove: `find . -name ".DS_Store" -delete`
     - Remove: `find . -name "Thumbs.db" -delete`
     - Remove: `find . -name "*.tmp" -delete`
6.2. Coverage and build artifacts:
     - Remove: `find . -name "htmlcov" -type d -exec rm -rf {} +`
     - Remove: `find . -name "coverage" -type d -exec rm -rf {} +`
     - Remove: `find . -name "dist" -type d -exec rm -rf {} +`
6.3. Count space freed in this step

### Step 7: Node Modules (if scope includes node_modules or all)
7.1. List all node_modules directories:
     - Run: `find . -name "node_modules" -type d`
7.2. Ask user confirmation (these are large)
7.3. If confirmed, remove:
     - Run: `find . -name "node_modules" -type d -exec rm -rf {} +`
7.4. Count space freed in this step

### Step 8: Generate Cleanup Report
8.1. Calculate total space freed
8.2. Show cleanup summary:
     ```
     Cleanup Complete:
     ️ Cache: X MB freed
      Logs: Y MB freed  
      Docker: Z MB freed
      Temp: A MB freed
      Node modules: B MB freed
     
     Total freed: X.X GB
     Available space: Y.Y GB
     ```
8.3. Suggest next steps if space still low

## Execution Rules

1. **ALWAYS run steps 1-8 in order**
2. **STOP at Step 2 if safety check fails**
3. **ASK confirmation for Docker and node_modules cleanup**
4. **SKIP steps that don't match scope from Step 1**
5. **ALWAYS show Step 8 report**

## Arguments

- `cache`: Python/JS cache only
- `logs`: Log files only
- `docker`: Docker cleanup only
- `temp`: Temporary files only
- `node_modules`: Node dependencies only (asks confirmation)
- `all`: Everything (asks confirmation for destructive operations)
- No args: Analyze workspace and suggest cleanup

## Safety Measures

1. Never delete source code files
2. Never delete .git directory
3. Confirm before removing >1GB
4. Verify in correct directory before starting
5. Skip files currently in use

## Next Commands
- If space freed → suggest `/health` to check system
- If still low space → suggest checking large files manually
- If cleaned → suggest `/test` to verify everything works
