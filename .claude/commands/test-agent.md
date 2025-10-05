---
allowed-tools: Bash(python:*), Read, Task
description: Test specific character agent behavior
argument-hint: <agent-name> [test-type]
---

## Test Character Agent

Test the behavior and responses of a specific MonsterOS character agent.

### Current agent status:
!`python -c "from app.agents.agent_registry import AgentRegistry; registry = AgentRegistry(); print(registry.list_active_agents())"`

### Run agent test:
```python
from app.agents.characters.$ARGUMENTS import ${ARGUMENTS}Agent
from app.hipporag.core.memory_system import MemorySystem

# Initialize agent with memory
agent = ${ARGUMENTS}Agent()
memory = MemorySystem()
agent.set_memory(memory)

# Test basic interaction
test_prompt = "Hello, introduce yourself and your capabilities"
response = agent.process(test_prompt)
print(f"Agent Response: {response}")

# Test memory recall
memory_test = "What do you remember from our previous conversations?"
memory_response = agent.process(memory_test)
print(f"Memory Response: {memory_response}")

# Test personality consistency
personality_test = "How would you approach solving a complex problem?"
personality_response = agent.process(personality_test)
print(f"Personality Response: {personality_response}")
```

### Available test types:
- `basic` - Basic interaction test
- `memory` - Memory system integration test
- `personality` - Personality consistency test
- `tools` - Tool usage capabilities test
- `communication` - Inter-agent communication test
- `performance` - Response time and resource usage

### Examples:
```
/test-agent neo basic
/test-agent owl memory
/test-agent quark personality
```