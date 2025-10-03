# Gallery Keeper - Level 1 Complete, Level 2 Ready

**Branch**: master
**Worktree**: /Volumes/pi_ext_drive/obsidian/Toolbox
**Current dir**: /Volumes/pi_ext_drive/obsidian/Toolbox
**Task Progress File**: _KANBAN_Gallery_Keeper.md
**Status**: Level 1 (Greeting Hall) complete, ready for Level 2

---

## Session Summary

Successfully completed **Level 1: Greeting Hall - Carnegie's Routing Challenge**, a fully playable museum visitor routing game teaching AI input classification concepts.

---

## ✅ Level 1 Completed

### Gameplay Mechanics
- **Visitor Routing**: Drag visitors to matching icon destinations
- **6 Visitor Types**: Scholar (📚), Child (🎨), Tourist (📸), Artist (🖼️), Elder (☕), General (👤)
- **6 Destinations**: Clean circular markers with colored backgrounds and icons
- **Natural Movement**: Visitors walk down and drift randomly, move over doors
- **Progressive Difficulty**:
  - Spawn interval: 1s start → 0.5s minimum (decreases 50ms per success)
  - Wave mode activates after 3 visitors (2 spawn at once)
  - Game over if 8+ visitors pile up
- **Victory Condition**: Serve 25 visitors

### Visual Design (Clean & Polished)
- **Background**: Dark museum gray (#2C3E50)
- **Door Markers**: Clean circles with white borders, no shadows, no text labels
- **Sprites**: Modern hand-drawn visitors with idle animations
- **Movement**: Visitors drift naturally as they walk, move over destinations
- **UI**: White text on dark, combo counter, waiting visitor warning (red if >6)

### Carnegie Tutorial System
- 6-step onboarding teaching mechanics
- Spirit NPC appears at milestones with encouragement
- Educational messages linking to AI classification concepts
- Message bubble system with wrapped text

### Scoring System
- Base points: 100 per correct placement
- Time bonuses: 50 (super fast), 30 (fast), 10 (normal), 0 (slow)
- Combo multipliers: +10 points per combo level
- Wrong placement: Resets combo, -20 points penalty

### Technical Implementation
**Files Created:**
- `gallery-keeper/level1.html` (280 lines) - Level interface
- `gallery-keeper/levels/level1-greeting-hall.js` (460 lines) - Complete level logic
- `gallery-keeper/core/sprites-modern.js` (500+ lines) - Modern sprite system

**Time Performance:**
- Phase 2 Budget: 6 hours
- Actual Time: ~3.5 hours (42% under budget!)
- Total Banked: 6.17 hours from Phase 0+1

---

## 📊 Current Project Status

### Phases Complete
- ✅ **Phase 0**: Architecture & Foundation (0.67h / 3h)
- ✅ **Phase 1**: Core Game Engine (1.83h / 6h)
- ✅ **Phase 2**: Level 1 - Greeting Hall (3.5h / 6h)

### Phases Remaining
- ⏳ **Phase 3**: Level 2 - Arrangement Room (6h allocated)
- ⏳ **Phase 4**: Level 3 - Living Gallery (5h allocated)
- ⏳ **Phase 5**: Level 4 - Question Corner (4h allocated)
- ⏳ **Phase 6**: Meta-Narrative & Polish (3h allocated)
- ⏳ **Phase 7**: Testing & Release (2h allocated)

### Time Banking
- **Total Allocated**: 30 hours
- **Time Spent**: 6.0 hours (20% complete)
- **Time Remaining**: 24 hours (80% remaining)
- **Banked Time**: 6.17 hours (from being under budget)
- **Buffer Available**: 3 hours (contingency)

---

## 🎯 Next Priority: Phase 3 - Level 2 (Arrangement Room)

### Level 2 Concept
**Bach's Arrangement Challenge** - Teaches multi-constraint optimization through artwork arrangement

**Core Mechanic**:
- Arrange artworks on wall grid (6x4 snap-to-grid)
- Visitors enter with preferences (visible color/style auras)
- Rearrange artworks to satisfy visitor preferences
- Harmony scoring based on matching preferences
- Victory: Satisfy 20 visitors

**Educational Goal**: Teaches how AI optimizes for multiple constraints simultaneously (like recommendation systems balancing user preferences, content diversity, and business goals)

### Phase 3 Deliverables (6 hours allocated)

1. **Bach Tutorial System** (45 min)
   - 5-step tutorial explaining arrangement mechanics
   - Bach spirit NPC with musical chimes
   - Teach drag-to-rearrange concept

2. **Artwork Inventory** (1 hour)
   - 20 unique artworks with styles/colors
   - Visual representation (frames with shadows)
   - Metadata for preference matching

3. **Wall Grid System** (1.5 hours)
   - 6x4 snap-to-grid positioning
   - Visual grid overlay when dragging
   - Smooth snap animations

4. **Visitor Preference System** (1.5 hours)
   - Visual preference auras (color halos around visitors)
   - Preference calculation (style + color matching)
   - Real-time satisfaction updates

5. **Harmony Scoring** (45 min)
   - Multi-factor scoring algorithm
   - Visual feedback for good/bad arrangements
   - Streak bonuses for consecutive satisfied visitors

6. **Victory & Polish** (45 min)
   - Victory condition: 20 satisfied visitors
   - Bach finale message
   - Level complete screen

### Technical Architecture (Reuse from Level 1)

**Leverage Existing Systems:**
- ✅ Core engine (game loop, rendering, input)
- ✅ Sprite system (visitors, shadows, animations)
- ✅ Particle effects (satisfaction bursts)
- ✅ Audio system (chimes for Bach)
- ✅ UI framework (scoring, messages)
- ✅ Tutorial structure (NPC, messages, progression)

**New Components Needed:**
- Artwork sprite factory (similar to visitor factory)
- Grid positioning system (snap logic)
- Preference matching algorithm
- Rearrangement drag logic

---

## 📁 Key Files & Locations

### Level 1 Files (Reference)
- `/Volumes/pi_ext_drive/obsidian/Toolbox/gallery-keeper/level1.html`
- `/Volumes/pi_ext_drive/obsidian/Toolbox/gallery-keeper/levels/level1-greeting-hall.js`
- `/Volumes/pi_ext_drive/obsidian/Toolbox/gallery-keeper/core/sprites-modern.js`

### Core Engine (Shared)
- `gallery-keeper/core/engine.js` - Game loop, entities
- `gallery-keeper/core/input.js` - Drag-and-drop
- `gallery-keeper/core/particles.js` - Visual effects
- `gallery-keeper/core/audio.js` - Sound system
- `gallery-keeper/core/ui.js` - HUD, menus, messages
- `gallery-keeper/core/storage.js` - Save/load

### Documentation
- `gallery-keeper/docs/PROGRESS.md` - Time tracking, phase status
- `gallery-keeper/docs/DECISIONS.md` - Technical decisions
- `_KANBAN_Gallery_Keeper.md` - Task board
- `.artifacts/251003_GALLERY_KEEPER_HANDOFF.md` - Original handoff

### Main Hub
- `gallery-keeper/index.html` - Demo page with link to Level 1

---

## 🔧 Technical Decisions Log

### Visual Style (Established)
- **Background**: Dark museum gray (#2C3E50) - maintains focus on sprites
- **Sprites**: Modern hand-drawn with shadows and idle animations
- **Destinations**: Clean circles with icons, no text labels (icon matching only)
- **Movement**: Natural drift + downward walk, visitors move over destinations
- **No sprite backgrounds**: Transparent, clean visual separation

### Gameplay Patterns (Established)
- **Tutorial**: Spirit NPC with message bubbles, click to advance
- **Progressive Difficulty**: Spawn speed increases, multi-spawn waves
- **Failure Condition**: Screen fills up (too many entities)
- **Victory**: Fixed goal (serve X visitors/satisfy X visitors)
- **Scoring**: Base + time bonus + combo multipliers

### Code Patterns (Established)
- **Level Structure**:
  - Constructor: Initialize state, data, NPCs
  - `init()`: Set up entities, start tutorial
  - `update(dt)`: Game logic, spawning, victory/failure checks
  - `render(ctx)`: Custom level visuals (doors, NPCs, UI)
  - Event handlers: `onDragEnd()`, etc.

- **Entity Pattern**:
  ```javascript
  const entity = {
      x, y, width, height,
      update: (dt) => {},
      render: (ctx) => {}
  };
  engine.addEntity(entity);
  ```

- **Sprite Factory Pattern**:
  ```javascript
  const visitor = ModernSpriteFactory.createVisitor(x, y, type);
  // Override update/render for custom behavior
  ```

---

## 🚨 Important Learnings & Patterns

### What Works Well
- **Clean visual design**: No text labels, icon-only matching
- **Progressive difficulty**: Speeds up naturally, wave mode adds urgency
- **Natural movement**: Drift + downward walk feels realistic
- **Tutorial pacing**: Click-to-advance, short messages
- **Failure pressure**: Screen fills up creates urgency without frustration

### What to Replicate in Level 2
- Clean circular markers for destinations (wall grid cells)
- Icon-based matching (preference icons above visitors)
- Natural movement patterns (visitors walk through gallery)
- Spirit NPC tutorial system (Bach appears at milestones)
- Progressive difficulty (more visitors, complex preferences)

### What NOT to Do
- ❌ Don't add text labels on interactive elements (icons only)
- ❌ Don't stop entity movement unnaturally (let them move over things)
- ❌ Don't add shadows under every element (only sprites need shadows)
- ❌ Don't make spawn intervals too long (start fast, get faster)
- ❌ Don't wait too long for wave mode (activate early for engagement)

---

## 🎮 Level 2 Design Details

### Artwork System

**Artwork Types** (20 pieces):
- **Styles**: Classical, Modern, Abstract, Portrait, Landscape
- **Colors**: Red, Blue, Green, Yellow, Purple, Neutral

**Visual Representation**:
```javascript
// Clean artwork sprite (similar to doors)
- Rectangular frame (80x100px)
- Colored mat/border indicating color category
- Style icon in center (🎭 classical, 🔲 abstract, 🌄 landscape, etc.)
- Shadow underneath
- No text labels
```

**Data Structure**:
```javascript
const artwork = {
    id: 'art_001',
    style: 'classical',
    color: 'blue',
    icon: '🎭',
    gridX: 0,
    gridY: 0
};
```

### Visitor Preference System

**Preference Auras**:
- Colored glow around visitor (indicates color preference)
- Style icon floating above head (indicates style preference)
- Satisfaction meter (fills when preferences matched)

**Matching Logic**:
```javascript
// Score calculation
const colorMatch = artwork.color === visitor.preferredColor ? 50 : 0;
const styleMatch = artwork.style === visitor.preferredStyle ? 50 : 0;
const satisfaction = colorMatch + styleMatch; // 0, 50, or 100
```

### Grid System

**Grid Layout**:
- 6 columns × 4 rows = 24 slots
- Start with 20 artworks placed randomly
- 4 empty slots for rearranging

**Snap Logic**:
```javascript
const gridCellWidth = 120;
const gridCellHeight = 140;
const gridX = Math.floor(mouseX / gridCellWidth);
const gridY = Math.floor(mouseY / gridCellHeight);
const snapX = gridX * gridCellWidth + gridCellWidth/2;
const snapY = gridY * gridCellHeight + gridCellHeight/2;
```

**Visual Grid**:
- Show grid lines when dragging artwork
- Highlight target cell on hover
- Smooth snap animation (ease to position)

### Bach Tutorial Flow

**Tutorial Steps**:
1. "Welcome! I'm Johann Sebastian Bach, master of harmony."
2. "In music, every note must work together. In this gallery, every artwork must please visitors."
3. "Visitors show their preferences with colored glows and style icons."
4. "Drag artworks to new positions to match what visitors want."
5. "Satisfy 20 visitors to master the art of arrangement!"

**Bach Appearances**:
- Every 5 visitors satisfied: Encouraging message
- Uses musical terminology ("Harmony achieved!", "Perfect composition!")
- Final message: "You understand optimization! This is how AI balances multiple goals."

---

## 🔄 Next Session Workflow

### Step 1: Environment Setup (5 min)
```bash
cd /Volumes/pi_ext_drive/obsidian/Toolbox
git status
git log --oneline -5
cat _KANBAN_Gallery_Keeper.md
```

### Step 2: Create Level 2 Files (10 min)
```bash
# Create level file
touch gallery-keeper/level2.html
touch gallery-keeper/levels/level2-arrangement-room.js

# Update main hub
# Edit gallery-keeper/index.html to add Level 2 link
```

### Step 3: Implement Core Systems (5 hours)
- Reference `level1-greeting-hall.js` for structure
- Reuse sprite system patterns
- Implement artwork factory
- Build grid snap logic
- Create preference matching
- Add Bach tutorial

### Step 4: Validation (45 min)
- [ ] Tutorial completes without confusion
- [ ] Grid snapping feels precise
- [ ] Preference matching is clear (visual feedback)
- [ ] Satisfaction scoring is fair
- [ ] 20 visitors achievable
- [ ] Bach messages are educational

### Step 5: Commit & Handoff (15 min)
- Commit Level 2 completion
- Update PROGRESS.md with time log
- Create handoff for Level 3 if time permits

---

## 💡 Design Philosophy (Do Not Compromise)

### Core Principles
- **Cozy, not challenging** - Relaxing optimization, not stressful puzzle
- **Show, don't tell** - Learn by doing, not reading instructions
- **Can't fail, only optimize** - No wrong answers, just better arrangements
- **Learning invisible** - AI concepts emerge through gameplay
- **Icons over text** - Visual matching, minimal reading

### Level 2 Specific
- **Multiple constraints** = Real AI optimization (color AND style preferences)
- **Rearrangement** = Iterative improvement (like ML training loops)
- **Visitor satisfaction** = Multi-stakeholder optimization
- **Bach's harmony** = Balance and composition (AI balancing trade-offs)

---

## 📈 Success Metrics

### Development Metrics (Phase 3)
- [ ] Total time: ≤6 hours (± 50% acceptable)
- [ ] Code quality: Reuses Level 1 patterns
- [ ] Commits: ≥5 (one per major component)
- [ ] Documentation: PROGRESS.md updated

### Quality Metrics (Level 2)
- [ ] Tutorial: Clear without help
- [ ] Grid: Snapping feels precise
- [ ] Preferences: Visually obvious
- [ ] Scoring: Fair and motivating
- [ ] Victory: Achievable in 5-10 minutes

### User Metrics (Defer to Phase 7)
- [ ] Non-gamer completes tutorial
- [ ] Can explain "optimization" concept
- [ ] Reports enjoying experience
- [ ] Wants to play Level 3

---

## 🔗 Cross-References

### Related Documents
- **Original Handoff**: `.artifacts/251003_GALLERY_KEEPER_HANDOFF.md`
- **Progress Log**: `gallery-keeper/docs/PROGRESS.md`
- **Kanban Board**: `_KANBAN_Gallery_Keeper.md`
- **Tech Decisions**: `gallery-keeper/docs/DECISIONS.md`

### Code References
- **Level 1 Complete**: `gallery-keeper/levels/level1-greeting-hall.js` (template)
- **Sprite System**: `gallery-keeper/core/sprites-modern.js` (extend for artworks)
- **Input System**: `gallery-keeper/core/input.js` (reuse drag logic)
- **Tutorial Pattern**: Level 1 `showTutorial()` method (replicate for Bach)

---

## 🚀 Ready to Begin?

**When you start next session:**

1. Read this entire handoff again (don't skip)
2. Review Level 1 code (`level1-greeting-hall.js`) for patterns
3. Start Phase 3 timer (6 hour budget)
4. Create `level2.html` and `level2-arrangement-room.js`
5. Implement Bach tutorial first (validates understanding)
6. Build artwork system (extend sprite factory)
7. Implement grid snapping (core mechanic)
8. Add preference matching (educational layer)
9. Validate with checklist
10. Commit and create Level 3 handoff

**Critical Success Factors**:
- Keep it cozy (no stress, just satisfaction)
- Icons only (no text labels on artworks/cells)
- Reuse Level 1 patterns (don't reinvent)
- Bach is encouraging (not critical)
- Teach optimization invisibly (through gameplay)

---

**Status**: Level 1 complete, Level 2 ready to build
**Next Session Priority**: Phase 3 - Arrangement Room (6 hours)
**Time Bank**: 6.17 hours ahead of schedule

Good luck! The foundation is solid, Level 2 will be faster. 🎨✨
