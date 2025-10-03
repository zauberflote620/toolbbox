# Gallery Keeper - Task Handoff

**Branch**: master
**Worktree**: /Volumes/pi_ext_drive/obsidian/Toolbox
**Current dir**: /Volumes/pi_ext_drive/obsidian/Toolbox
**Task Progress File**: _KANBAN_Gallery_Keeper.md
**Status**: Planning complete, ready for Phase 0 execution

---

## Session Objective

Build **The Gallery Keeper** - a cozy museum management game that secretly teaches AI interaction concepts (prompt engineering, multi-constraint optimization, output validation) through satisfying drag-and-drop gameplay. Non-gamers must be able to play and learn without frustration.

---

## ✅ Completed

### Planning & Architecture (2 hours)
- **Comprehensive 30-hour execution plan** created with 7 phases
- **Autonomous execution framework** designed (validation loops, rollback system, time banking)
- **Kanban board** initialized with all phases broken into tasks
- **Technology decision framework** established (Phaser vs Pixi vs Canvas API)
- **MVP definition** clear (2 levels minimum, 4 levels stretch goal)
- **Historical mentor personalities** researched and documented
- **Validation rubric** created (9 criteria, target 8.2/10)
- **Risk assessment** completed with mitigation strategies

### Architecture Designed
```
toolbox/
  index.html                  (Navigation hub - needs update)
  shop-reset-kit/             (Existing, complete)
  gallery-keeper/             (NEW - to be built)
    index.html
    core/                     (Game engine)
    levels/                   (4 self-contained levels)
    assets/                   (Sprites, sounds, backgrounds)
    data/                     (Mentors, visitors, artifacts JSON)
    docs/                     (Progress tracking, decisions)
```

### Game Design Finalized

**4 Levels (Different Game Genres):**
1. **Greeting Hall** (Carnegie) - Rhythm/routing game teaching input classification
2. **Arrangement Room** (Bach) - Puzzle game teaching multi-constraint optimization
3. **Living Gallery** (Feynman) - Sandbox game teaching emergent systems
4. **Question Corner** (Turing) - Deduction game teaching output validation

**Historical Mentors:**
- Andrew Carnegie (telegraph efficiency, routing, service)
- Johann Sebastian Bach (harmony, mathematical patterns, balance)
- Richard Feynman (curiosity, experimentation, emergent discovery)
- Alan Turing (validation, human judgment, collaboration)
- Albert Einstein (optional - thought experiments, perspective shifts)

**Core Philosophy:**
- Cozy and satisfying (like Animal Crossing, not like Dark Souls)
- Accessible to non-gamers (drag-drop only, can't fail)
- Learning invisible (no lectures, concepts emerge through play)
- Emotionally resonant (serving others, historical connection)

---

## 📁 Key Files

### Created This Session
- `_KANBAN_Gallery_Keeper.md` - Project kanban (committed and pushed)
- `.artifacts/251003_GALLERY_KEEPER_HANDOFF.md` - This handoff document

### To Be Created Next Session
- Full execution plan document with all phase details
- `gallery-keeper/` directory structure
- `docs/PROGRESS.md` - Phase completion tracking
- `docs/DECISIONS.md` - Technical decisions log

### Reference Files
- `/Volumes/pi_ext_drive/obsidian/Toolbox/shop-reset-kit/` - Example of completed tool in toolbox
- `/Volumes/pi_ext_drive/obsidian/Toolbox/index.html` - Navigation hub to update

---

## ⚠️ Current State & Critical Context

### What Works
- Complete project plan validated at 8.2/10
- Architecture designed for clean separation and extensibility
- MVP clearly defined (can ship with 2 levels if time tight)
- All risks identified with mitigation strategies

### What's NOT Started
- No code written yet
- No directories created yet
- No technology stack selected yet
- No assets sourced yet

### Critical Design Decisions

**Technology Stack (Phase 0 Decision):**
- Start with **HTML5 Canvas + Vanilla JS** (simplest, no dependencies)
- Migrate to Phaser 3 only if needed for advanced features
- Use colored shapes + emoji icons initially (upgrade to pixel art if time permits)

**Asset Strategy:**
- Phase 1-2: Geometric shapes with emoji overlays
- Phase 3+: Upgrade to CC0 sprites from OpenGameArt.org or Kenney.nl
- Audio: freesound.org (SFX), incompetech.com (music)

**Scope Flexibility:**
- **Must-Have**: Core engine + Level 1 + Level 2
- **Should-Have**: Level 3 + Level 4 + meta-narrative
- **Nice-to-Have**: Polish, mobile, speedrun mode

### Success Criteria (Non-Negotiable)
1. Non-gamer can complete tutorial without help
2. Player can articulate ≥1 AI concept learned after playing
3. Game feels relaxing and satisfying, not frustrating
4. Runs at 60fps with 100+ entities on mid-range device
5. Complete in ≤30 hours (±10% acceptable)

---

## 📍 Exact Stopping Point

Completed comprehensive planning and kanban setup. Ready to begin Phase 0 (Architecture & Foundation) in next session.

**Next immediate action**: Begin Phase 0 following the execution plan framework.

---

## 🔄 Next Steps (Sequential Order)

### PRIORITY 1: Phase 0 - Architecture & Foundation (3 hours)

**Start Timer** and execute these deliverables:

1. **Create Directory Structure**
   ```bash
   cd /Volumes/pi_ext_drive/obsidian/Toolbox
   mkdir -p gallery-keeper/{core,levels,assets/{sprites,sounds,backgrounds},data,docs}
   ```

2. **Technology Stack Decision**
   - Benchmark: Canvas API vs Phaser 3 for 100 sprites at 60fps
   - Document choice in `docs/DECISIONS.md` with rationale
   - Set up basic HTML scaffold with chosen framework

3. **Navigation Hub Update**
   - Update `index.html` to show both shop-reset-kit and gallery-keeper
   - Create gallery-keeper card with description and launch button
   - Test navigation between tools

4. **Execution Framework Setup**
   - Create `docs/PROGRESS.md` for phase tracking
   - Initialize time tracking log (allocated vs actual)
   - Set up git snapshot system for rollbacks
   - Create validation checklist for Phase 0

5. **Validation Checkpoint**
   - [ ] Directory structure exists and organized
   - [ ] Tech stack chosen and documented
   - [ ] Navigation hub shows both tools
   - [ ] Rollback system tested
   - [ ] Phase 0 time logged

**End Timer**, commit with message: "Complete Phase 0: Architecture & Foundation"

### PRIORITY 2: Phase 1 - Core Game Engine (6 hours)

Only start after Phase 0 validation passes. Build:
- 60fps game loop
- Sprite rendering system
- Drag-and-drop mechanics
- Particle effects
- Audio system
- Save/load with localStorage

### PRIORITY 3: Phase 2 - Level 1 (6 hours)

Build complete playable Greeting Hall level with Carnegie tutorial.

### PRIORITY 4: Phase 3-7 (Remaining hours)

Follow execution plan, cutting scope to MVP if time tight.

---

## 🛠️ Commands & Context

```bash
# Navigate to project
cd /Volumes/pi_ext_drive/obsidian/Toolbox

# Check git status
git status

# View kanban
cat _KANBAN_Gallery_Keeper.md

# Start Phase 0 work
mkdir -p gallery-keeper/{core,levels,assets/{sprites,sounds,backgrounds},data,docs}

# Initialize progress tracking
echo "# Gallery Keeper Progress Log" > gallery-keeper/docs/PROGRESS.md
echo "# Technical Decisions" > gallery-keeper/docs/DECISIONS.md

# Create index file
touch gallery-keeper/index.html

# Update navigation hub
code index.html  # or your editor of choice
```

---

## 💡 Critical Context to Remember

### Design Philosophy (Never Compromise)
- **Cozy, not challenging** - Players should relax, not stress
- **Show, don't tell** - Tutorial through doing, not reading
- **Can't fail, only optimize** - No game-over screens
- **Learning invisible** - AI concepts emerge naturally through play
- **Emotionally resonant** - About serving others, not technology

### What This Game Is NOT
- ❌ Not an RPG with dialogue trees
- ❌ Not a puzzle game for puzzle-lovers
- ❌ Not educational in an obvious way
- ❌ Not complex or mentally taxing
- ❌ Not for gamers only

### What This Game IS
- ✅ Like Animal Crossing meets museum work
- ✅ Satisfying drag-drop with immediate rewards
- ✅ Pretty to look at (particles, animations, cozy aesthetic)
- ✅ Teaches real AI skills through gameplay
- ✅ For retail/visitor services workers (non-technical)

### Historical Accuracy Matters
- Carnegie: Telegraph messenger boy (1850s), built 2,509 libraries
- Bach: Church musician serving congregation, mathematical composer
- Feynman: Playful teacher, bongo player, Nobel laureate
- Turing: "Can machines think?" became "Can humans and machines think together?"

These aren't just characters - they're role models for serving others with tools.

---

## 🚨 Things to AVOID

### Scope Creep
- No additional levels beyond 4
- No multiplayer features
- No advanced AI integration (keep it simple)
- No custom art in first iteration (shapes + emoji is fine)

### Over-Engineering
- Don't build a complex framework - build a simple game
- Don't optimize prematurely - make it work, then make it fast
- Don't add features not in MVP - ship complete over feature-rich
- Don't use subagents unless actually blocked

### Quality Compromises
- Don't skip playtesting (Phase 7 is mandatory)
- Don't ignore accessibility (colorblind mode, keyboard nav required)
- Don't ship broken levels (2 complete levels > 4 incomplete)
- Don't skip validation checkpoints (they prevent wasted time)

### Time Management
- Don't exceed 150% of phase budget without scope cuts
- Don't force through fatigue (take breaks)
- Don't batch commits (commit after each deliverable)
- Don't skip documentation (PROGRESS.md and DECISIONS.md essential)

---

## 📊 Execution Framework Summary

### Time Banking (30 hours total)
- Phase 0: 3h (Architecture)
- Phase 1: 6h (Core Engine)
- Phase 2: 6h (Level 1)
- Phase 3: 6h (Level 2)
- Phase 4: 5h (Level 3)
- Phase 5: 4h (Level 4)
- Phase 6: 3h (Meta/Polish)
- Phase 7: 2h (Testing)
- Buffer: 10% for overruns

### Validation Gates (Must Pass)
Every phase requires:
- [ ] All deliverables completed
- [ ] Core functionality works
- [ ] No breaking bugs
- [ ] Documentation updated
- [ ] Git committed
- [ ] Within 150% time budget (or justified)

### Rollback Triggers
- If validation fails → Allocate buffer time (max 90min), retry
- If still fails → Document, defer, continue with workaround
- If critical blocker → Emergency rollback to last good commit

### Emergency Protocols
- **Time overrun** → Cut scope, not quality
- **Technical blocker** → Document, workaround, continue
- **Loss of direction** → Re-read this handoff, recalibrate
- **Burnout** → Take 15min break, return fresh

---

## 🎯 Success Metrics (Final Validation)

### Development Metrics
- Total time: ≤30 hours (± 10%)
- Phases completed: Minimum 5/7 (Phase 0-1-2-3-7)
- Commits: ≥20 (one per deliverable)
- Documentation: PROGRESS.md + DECISIONS.md + README complete

### Quality Metrics
- Performance: 60fps with 100+ entities
- Load time: <3 seconds
- Bugs: Zero game-breaking, <5 minor
- Accessibility: WCAG 2.1 AA compliant

### User Metrics (Playtesting Required)
- Tutorial completion: 3/3 non-gamers succeed independently
- Learning validation: 3/3 can articulate ≥1 AI concept
- Satisfaction: 3/3 report enjoying experience
- Completion: 3/3 finish ≥2 levels
- Recommendation: 2/3 would recommend

### Feature Metrics (MVP Checklist)
- Core engine: 100% complete
- Level 1: 100% complete
- Level 2: 100% complete
- Level 3: ≥70% (acceptable if time tight)
- Level 4: ≥50% (acceptable if time tight)
- Meta-narrative: ≥80%
- Testing: 100% (non-negotiable)

---

## 🏁 Ready to Begin?

**When you start next session:**

1. Read this entire handoff again (don't skip)
2. Set up timer for Phase 0 (3 hour budget)
3. Execute Phase 0 deliverables sequentially
4. Validate before proceeding to Phase 1
5. Update kanban as you complete tasks
6. Log everything in PROGRESS.md
7. Commit frequently

**Remember**: This is autonomous execution. You're in control. Follow the plan, validate at checkpoints, adjust when needed, but keep moving forward. Ship a complete cozy game that teaches AI concepts invisibly.

**The goal**: Non-gamers play, enjoy, learn, and don't even realize they were being trained.

---

**Status**: Ready for Phase 0 execution
**Next Session Priority**: Architecture & Foundation (3 hours)
**Critical Success Factor**: Keep it simple, cozy, and satisfying

Good luck! 🎨✨
