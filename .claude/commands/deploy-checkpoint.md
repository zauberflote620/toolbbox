# Deploy Checkpoint

Deploy current stable state to Cloudflare Pages via deploy branches.

## Usage
```
/deploy-checkpoint               # Interactive deployment
/deploy-checkpoint --dev         # Deploy to deploy_dev
/deploy-checkpoint --phoenix     # Deploy to deploy_phoenix  
/deploy-checkpoint --check-only  # Only run checks, don't deploy
```

## DIRECTIVES FOR ASSISTANT

When executing this command, ALWAYS:
1. Show current branch: `git branch --show-current`
2. Show deploy branches: `git branch -a | grep deploy`
3. Show last 5 commits: `git log --oneline -5`
4. Show uncommitted changes: `git status --short`
5. Show last deploy tag: `git tag | grep deploy | tail -1`
6. Check API health: `curl -s http://localhost:8000/api/health || echo "API not running"`
7. Show Cloudflare Pages URL if available in git remote config

## What It Does

Uses the **deployment-orchestrator** subagent to:
1. Run comprehensive pre-deployment checks
2. Create deployment checkpoint
3. Push to appropriate deploy branch
4. Monitor Cloudflare Pages build
5. Provide rollback instructions

## Pre-Deployment Checks

The deployment-orchestrator will verify:
- **Stability**: Basic smoke tests pass
- **No Critical Errors**: Startup without import failures
- **API Health**: Basic endpoints respond
- **Database**: Connections work
- **Recent Changes**: Review uncommitted work

## Required Information Display

### 1. Current State Assessment
```bash
# MUST SHOW:
echo "=== CURRENT STATE ==="
echo "Branch: $(git branch --show-current)"
echo "Uncommitted: $(git status --porcelain | wc -l) files"
echo "Last commit: $(git log -1 --oneline)"
echo "Deploy branches available:"
git branch -a | grep deploy
```

### 2. Deployment History
```bash
# MUST SHOW:
echo "=== DEPLOYMENT HISTORY ==="
echo "Last deploy tag: $(git tag | grep deploy | tail -1)"
echo "Last deploy commit:"
git log --oneline --grep="deploy" -1
echo "Time since last deploy:"
git log -1 --format="%cr" $(git tag | grep deploy | tail -1)
```

### 3. Service Health
```bash
# MUST SHOW:
echo "=== SERVICE HEALTH ==="
curl -s http://localhost:8000/api/health | jq '.status' || echo "❌ API not running"
ps aux | grep -E "uvicorn|streamlit" | grep -v grep | wc -l | xargs -I {} echo "Running services: {}"
echo "Database: $(pg_isready -h localhost -p 5432 2>&1 || echo 'PostgreSQL not running')"
```

## Deployment Flow

1. **Assessment Phase**
   - Check current branch and changes
   - Verify basic stability
   - Identify target deploy branch

2. **Checkpoint Phase**
   - Create tagged checkpoint
   - Document what's working/broken
   - Stage stable changes

3. **Deploy Phase**
   - Push to deploy_dev or deploy_phoenix
   - Monitor Cloudflare build
   - Provide rollback command

## Rollback Safety

Every deployment creates:
- Git tag: `deploy-YYYYMMDD-HHMM`
- Rollback command ready to copy
- State documentation in DEPLOY_NOTES.txt

## Example Session

```
/deploy-checkpoint

=== CURRENT STATE ===
Branch: dev_prime_2508_local
Uncommitted: 3 files
Last commit: ecee8b15 [security] Remove SQLite database files
Deploy branches available:
  remotes/origin/deploy_dev
  remotes/origin/deploy_phoenix

=== DEPLOYMENT HISTORY ===
Last deploy tag: deploy-20250815-1230
Last deploy commit: abc123 checkpoint: deploy to dev
Time since last deploy: 3 days ago

=== SERVICE HEALTH ===
✅ API: healthy
Running services: 2
Database: PostgreSQL accepting connections

> deployment-orchestrator checking stability...
> ✅ All checks passed
> 
> Deploy to: deploy_dev? [Y/n]
> Creating checkpoint...
> Tagged: deploy-20250818-1430
> Pushing to deploy_dev...
> 
> ✅ Deployed! Monitor at: https://dash.cloudflare.com/pages
> 
> Rollback command (if needed):
> git push origin deploy-20250818-1420:deploy_dev --force
```

## Critical Information to Display

**ALWAYS show before deployment:**
- Current branch name
- Number of uncommitted files
- Available deploy branches
- Last deployment timestamp
- Service health status
- Rollback command from previous deploy

## Requirements

- deployment-orchestrator subagent must be configured
- Cloudflare Pages must be set up for deploy_* branches
- Git push access to origin remote

$ARGUMENTS