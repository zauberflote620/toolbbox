# Deploy

Unified deployment command for MonsterOS with flag-based operations and full observability.

## Usage
```
/deploy                    # Interactive deployment (default)
/deploy --status          # Show current deployment state
/deploy --canary owl      # Deploy to specific agent first
/deploy --rollback        # Emergency rollback to last stable
/deploy --health          # Health check only (no deployment)
/deploy --observe         # Start monitoring mode
/deploy --force           # Skip safety checks
/deploy --phoenix         # Deploy to deploy_phoenix branch
/deploy --dev             # Deploy to deploy_dev branch (default)
```

## DIRECTIVES FOR ASSISTANT

When executing this command, the assistant MUST:

1. **Parse flags correctly** and determine operation mode
2. **Use deployment-orchestrator subagent** as the primary coordinator
3. **Launch appropriate subagents** based on the operation:
   - health-guardian for health checks
   - observability-agent for monitoring
   - rollback-specialist for rollbacks
4. **Show comprehensive status** before any deployment action
5. **Coordinate between subagents** for complex operations

## What Each Flag Does

### --status
Shows current deployment state without making changes:
- Current branch and last deployment
- Agent switch status
- System health summary
- Available rollback targets
- Deployment readiness assessment

### --canary [agent_name]
Deploys to specific agents first for testing:
- Updates agent switches for canary mode
- Deploys only to specified agents
- Monitors canary performance for 15 minutes
- Auto-promotes or rolls back based on health
- Full deployment if canary succeeds

### --rollback
Emergency rollback to last stable deployment:
- Uses rollback-specialist for immediate recovery
- Force pushes last stable tag to deploy branch
- Resets agent switches to safe state
- Validates system recovery
- Generates rollback report

### --health
Comprehensive health check without deployment:
- Launches health-guardian for full assessment
- Checks all system components
- Validates agent availability
- Assesses deployment readiness
- Provides recommendations

### --observe
Starts real-time monitoring dashboard:
- Launches observability-agent in monitor mode
- Shows live deployment metrics
- Tracks agent performance
- Monitors session impact
- Provides alerts for issues

### --force
Skips safety checks for emergency deployments:
- Bypasses health checks
- Ignores agent switch states
- Immediate deployment execution
- Higher risk but faster deployment
- Use only in emergencies

### --phoenix
Deploys to deploy_phoenix branch:
- Testing/experimental deployment branch
- Cloudflare Pages deploys automatically
- Used for testing risky changes
- Does not affect main deploy_dev environment

### --dev (default)
Deploys to deploy_dev branch:
- Main deployment branch
- Production-like environment
- Cloudflare Pages deploys automatically
- Default if no branch specified

## Required Information Display

### ALWAYS show before any deployment action:
```bash
echo "=== DEPLOYMENT COMMAND PARSED ==="
echo "Operation: $OPERATION_MODE"
echo "Target Branch: $TARGET_BRANCH"
echo "Flags: $PARSED_FLAGS"
echo "Current Branch: $(git branch --show-current)"
echo "Uncommitted: $(git status --porcelain | wc -l) files"
echo ""
```

## Subagent Coordination Examples

### Standard Deployment Flow
```bash
# 1. Parse flags and show status
/deploy --dev

# 2. Launch health-guardian for pre-deployment check
→ "Using health-guardian to assess deployment readiness..."

# 3. Use deployment-orchestrator to coordinate
→ "Using deployment-orchestrator to manage deployment..."

# 4. Launch observability-agent for monitoring
→ "Using observability-agent to track deployment progress..."

# 5. Show results and provide rollback command
→ "Deployment complete. Rollback command: /deploy --rollback"
```

### Canary Deployment Flow
```bash
# 1. Parse canary target
/deploy --canary owl scout

# 2. Health check first
→ "Using health-guardian to verify canary targets..."

# 3. Configure canary deployment
→ "Using deployment-orchestrator for canary deployment..."

# 4. Monitor canary performance
→ "Using observability-agent to monitor canary agents..."

# 5. Auto-decision or manual confirmation
→ "Canary successful. Proceeding with full deployment..."
```

### Emergency Rollback Flow
```bash
# 1. Immediate rollback trigger
/deploy --rollback

# 2. Launch rollback specialist
→ "🚨 EMERGENCY ROLLBACK - Using rollback-specialist..."

# 3. Monitor recovery
→ "Using health-guardian to validate recovery..."

# 4. Generate rollback report
→ "Using observability-agent to analyze rollback impact..."
```

## Command Processing Logic

The assistant should process the command as follows:

1. **Parse Flags**: Determine primary operation mode
2. **Show Status**: Always display current state first
3. **Launch Primary Subagent**: Use deployment-orchestrator as coordinator
4. **Launch Supporting Subagents**: Based on operation requirements
5. **Coordinate Actions**: Ensure subagents work together
6. **Provide Results**: Show outcomes and next steps

## Error Handling

If deployment fails:
1. **Automatic rollback** for critical failures
2. **Partial rollback** for agent-specific issues
3. **Manual intervention** for complex problems
4. **Clear error messages** with suggested actions

## Safety Mechanisms

### Pre-Deployment Checks
- System health validation
- Agent availability verification
- Deployment readiness assessment
- Resource availability check

### During Deployment
- Real-time health monitoring
- Automatic failure detection
- Progressive rollout validation
- Performance threshold monitoring

### Post-Deployment
- System health validation
- Agent performance verification
- Session impact analysis
- Success/failure reporting

## Integration Requirements

### Git Operations
- Tag management for stable deployments
- Branch operations for Cloudflare Pages
- Rollback target identification
- Deployment history tracking

### Agent System
- Agent switch configuration
- Individual agent health monitoring
- Canary agent selection
- Performance tracking

### Monitoring
- Real-time metrics collection
- Deployment progress tracking
- Alert generation
- Trend analysis

## Output Format Requirements

### Status Display
```
=== MONSTEROS DEPLOYMENT STATUS ===
Current Branch: dev_prime_2508_local
Target Branch: deploy_dev
Last Deployment: deploy-20250817-1430 (1 day ago)
System Health: ✅ Healthy (11/12 agents)
Deployment Ready: ✅ Yes
```

### Progress Monitoring
```
=== DEPLOYMENT IN PROGRESS ===
[2m 15s] Deploying to deploy_dev...
Agents: 9/12 deployed ✅
Health: All systems green ✅ 
Progress: ████████████████░░░ 80%
ETA: 45 seconds
```

### Completion Summary
```
=== DEPLOYMENT COMPLETE ===
Status: ✅ SUCCESSFUL
Duration: 4m 32s
Branch: deploy_dev
Agents: 12/12 healthy
Rollback: /deploy --rollback (if needed)
Monitor: /deploy --observe
```

Remember: The /deploy command is the unified interface for all MonsterOS deployment operations. Use the appropriate subagents to provide comprehensive deployment management with full observability.

$ARGUMENTS