## Context-Aware Codebase Explorer

# Session context check
echo "Branch: $(git branch --show-current) | Task: $(grep -m1 "Task:" CLAUDE_SESSION_CONTEXT.md 2>/dev/null || echo "None")"
git status --porcelain | head -5

please explore the entire codebase to understand the codebase from multiple angles: as a software architect, software developer, and product manager. 
ASK FIRST IF I require documentation, if yes, please compile your findings into a very extensive markdown document in the docs/developer/architecture_YYMMDD.md file. For describing technical concepts, you should include Mermaid diagrams in this markdown file. 

Context-aware exploration - reads session state, recent changes, task progress before architecture analysis. FOR CONTEXT ONLY - never write architecture docs unless explicitly requested. 