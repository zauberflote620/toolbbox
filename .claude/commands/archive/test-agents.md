---
description: Agent system tests - characters, communication, tools
arguments: [agent-name] [--mock-memory] [--parallel]
allowed-tools: Bash
---

# Agent System Tests

Test MonsterOS character agents, communication, and orchestration.

## Execution
```bash
echo "🤖 Testing agent systems..."

AGENT_NAME=${1:-all}

# Test specific agent or all agents
if [ "$AGENT_NAME" = "all" ]; then
  pytest tests/unit/agents/ app/agents/*/tests/ \
    -v --tb=short \
    -n 4 \
    --maxfail=5
else
  pytest tests/unit/agents/test_${AGENT_NAME}_agent.py \
    app/agents/characters/test_${AGENT_NAME}.py \
    -v --tb=short
fi

# Agent communication tests
pytest tests/integration/agent_communication/ \
  -v --tb=short \
  -m "not slow"

# Tool execution tests
pytest app/tools/tests/ \
  -v --tb=short \
  -n 2

echo "✅ Agent tests complete"
```

## Test Coverage
- Character agents (Neo, Owl, Patchushka, Quark)
- Agent messaging and communication
- Tool execution and registry
- Agent orchestration (lightweight)
- Consciousness layer tests

## Mock Options (--mock-memory)
```bash
if [[ "$*" == *"--mock-memory"* ]]; then
  export HIPPORAH_MOCK=true
  export REDIS_MOCK=true
fi
```