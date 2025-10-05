---
tags:
  - chai
  - memory
  - knowledge-base
  - gamification
parent: [[Hub - AI and Machine Learning]]
related:
  - [[CHAI game]]
  - [[YOUR_VAULT_MAP]]
  - [[ONE-SHOT-COMMANDS-PACK-FOR-CHAI]]
---

**Quick Links**: [[CHAI game]] | [[Hub - AI and Machine Learning]] | [[YOUR_VAULT_MAP]]

# Validated Facts Database

**Last Updated:** [Update when adding facts]

**Purpose:** Ground truth information with timestamps and confidence scores. Your permanent knowledge base.

---

## How to Use

When you discover/verify important information:

1. **Log it here** with full metadata
2. **Include timestamp** when verified
3. **Mark confidence** based on source quality
4. **Note validation method** so you can re-verify later
5. **Update** when information changes (mark as superseded)

---

## Template

```markdown
### [Fact Category]

**Fact:** [The information]
**Source:** [Where it came from]
**Timestamp:** YYYY-MM-DD HH:MM
**Confidence:** High/Medium/Low
**Validation:** [How you confirmed it]
**Status:** Active/Superseded
**Superseded By:** [Link to newer fact if applicable]
```

---

## Project Context

### CHAI Game System

**Fact:** CHAI teaches Copilot memory management through 5 progressive games
**Source:** PRD_CHAI_Game_System.md
**Timestamp:** 2025-10-02 00:30
**Confidence:** High
**Validation:** Created and reviewed PRD document
**Status:** Active

---

**Fact:** Copilot memory degrades over sessions, requiring manual `/memory --showall` refresh
**Source:** Game 1: Memory Keeper mechanics
**Timestamp:** 2025-10-02 00:45
**Confidence:** High
**Validation:** Documented in game design
**Status:** Active

---

## Technical Knowledge

### [Add your technical facts here]

**Example:**
**Fact:** PostgreSQL uses MVCC (Multi-Version Concurrency Control) for transaction isolation
**Source:** PostgreSQL official documentation
**Timestamp:** 2025-10-02 10:00
**Confidence:** High
**Validation:** Read official docs, tested in local environment
**Status:** Active

---

## Decision Log

### [Add important decisions here]

**Decision:** Use markdown-based game files instead of interactive web app
**Rationale:** Better integration with Obsidian, lower complexity, easier to modify
**Timestamp:** 2025-10-02 00:20
**Status:** Active
**Impact:** All 5 games will be markdown files with embedded mechanics

---

## Credentials & Access

**⚠ IMPORTANT:** Never store actual passwords/keys here. Use password manager.

Store **metadata only**:

**System:** AWS Production
**Purpose:** Database access for Phoenix project
**Key ID:** AKIA... (truncated)
**Location:** 1Password vault "Work/Phoenix"
**Expires:** 2025-11-01
**Timestamp:** 2025-10-02
**Confidence:** High

---

## Game Progress Facts

Track what you've learned:

### Game 1: Memory Keeper

- [x] **Learned:** Memory degrades every 10 turns
- [x] **Learned:** `/refresh` resets turn counter to 1
- [x] **Learned:** Config files persist beyond sessions
- [ ] **Completed:** All 5 quests

---

## Temporal Validation Log

Track when facts were last verified:

| Fact | Last Validated | Next Validation | Status |
|------|----------------|-----------------|--------|
| CHAI game count (5 games) | 2025-10-02 | No change expected | ✓ |
| Copilot memory limit (~10 turns) | 2025-10-02 | Re-test monthly | ✓ |

---

## Maintenance Checklist

**Weekly:**
- [ ] Review Active facts for changes
- [ ] Update timestamps on re-validated facts

**Monthly:**
- [ ] Check all High-confidence facts
- [ ] Archive Superseded facts to separate section
- [ ] Update confidence scores based on age

**After Each Game:**
- [ ] Add new facts learned
- [ ] Update Game Progress section
- [ ] Add to Temporal Validation Log

---

## Archived/Superseded Facts

Keep old facts for history:

### [Example]
**Fact:** Original deadline was October 15
**Superseded:** 2025-09-20 by new deadline October 20
**Superseded By:** See "Project Context > Deadlines"
**Reason:** Scope increase required extension
