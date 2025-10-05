# Quick Start - Daily Workflow

## Morning Startup Sequence
```bash
# 1. Load session context (if continuing work)
cat CLAUDE_SESSION_CONTEXT.md
workrecover

# 2. Start services
startall                        # Start all MonsterOS services
daily                          # View daily workflow guide  

# 3. Check system status
health                         # API health check
agentinfo                      # Agent system status
monitorstatus                  # System monitoring status
```

## Essential Commands

### Service Management
```bash
startall                       # Start all services
stopall                        # Stop all services  
killall                        # Emergency stop all services
apirestart                     # Restart API server
health                         # Check API health
```

### Navigation & Info  
```bash
daily                          # Daily workflow guide
help                           # Complete help reference
docs                           # Documentation quick access
info                           # Workspace status
ports                          # Port configuration
```

### Development Workflow
```bash
testquick                      # Run quick tests
quality                        # Run code quality checks
gst                           # Git status (short)
gdf                           # Git diff (short)
```

### Agent Management
```bash
agentinfo                      # Agent status dashboard
agentstart                     # Start autonomous agents
agentstop                      # Stop autonomous agents
agentconfig                    # Configure agents
selfheal                       # Start self-healing (protected)
```

## File Navigation Rules

### Primary Documentation Locations
- `.claude/` - All Claude documentation and rules
- `DAILY.md` - Daily workflow and current status
- `CLAUDE_SESSION_CONTEXT.md` - Last session context
- `project_rules/` - Execution standards and protocols

### Quick Access Aliases
```bash
claude                         # Open claude documentation
commands                       # Development commands  
architecture                   # System architecture
testing                        # Testing standards
security                       # Security guidelines
troubleshoot                   # Troubleshooting guide
```

## Session Management

### Save Your Work  
```bash
claudesave "task description"  # Save session context
worksave                       # Create work checkpoint
quicksave                      # Quick backup
```

### Browser Access
```bash
openui                         # React UI (localhost:5173)
openapi                        # API docs (localhost:8000)
openstreamlit                  # Streamlit (localhost:8501)
openall                        # Open all UIs
```

## Common Workflows

### Starting New Work
1. Load previous context: `claudecontext`  
2. Check git status: `gst`
3. Start services: `startall`
4. Save new session: `claudesave "new task"`

### Debugging Issues
1. Check health: `health`
2. Check agents: `agentinfo` 
3. View logs: `apilogs`
4. Check monitoring: `monitorstatus`

### Before Ending Session
1. Save context: `claudesave "current progress"`
2. Check git status: `gst`
3. Stop services: `stopall` (optional)
4. Create checkpoint: `worksave`

*Most commands are available as aliases - see `help` for complete list*