---

kanban-plugin: board
date: 2025-10-03
last-modified: 2025-10-03
project: Gallery Keeper
status: phase-1-complete
estimated-hours: 30
time-spent: 2.5
time-banked: 6.17

---

## Backlog

- [ ] Post-30h: Polish pass (upgrade pixel art, more particle effects)
- [ ] Post-30h: Content expansion (Einstein level, more artifacts)
- [ ] Post-30h: Feature additions (speedrun mode, leaderboards)
- [ ] Post-30h: Mobile optimization (touch controls, responsive)
- [ ] Post-30h: Educational extensions (teacher mode, quiz system)
- [ ] 

## Bugs / todo
- [ ] lvl 1 rm circles around "doors"
- [ ] Additional planning tools (TBD)
- [ ] refactor long files (levels)

## Level 2 UI/UX Improvements (Oct 4) - IN PROGRESS

### Asset Integration (Code Complete)
- [x] Add shadow to Bach character
- [x] Remove PNG frames - reverted to clean look (user preferred)
- [x] Rotate visitor characters each round (14 characters: robots + stick figures)
- [x] Use bubble-thinking-duo.png for visitor thought bubbles
- [x] Use banner-red.png for Bach speech with text overlay
- [x] Add 5 new stick figure characters to visitor pool
- [x] Organize assets into directories (shapes/, nature/, objects/, symbols/, frames/)
- [x] Move Bach speech bubble down to avoid overlap with character

### Visual Polish (Code Complete)
- [x] Add gradient backgrounds (body, canvas, buttons)
- [x] Add glassmorphism effect to HUD
- [x] Remove yellow circle outline (replaced with animated sparkle effect)
- [x] Improve text contrast in thought bubbles (dark red/blue on cream background)
- [x] Add shadows to all major elements

### Critical Bugs to Debug
- [ ] Figure out PNG transparency issue (white boxes around icons in paintings)
  - Code changed to skip colored background when PNG present
  - Need to test if icons (branches, clouds, toolbox, people) now show transparently
  - If still broken, may need to check PNG files themselves
- [ ] Verify all images loading correctly (check browser console for errors)
- [ ] Verify PNG paths correct for organized directories

### Testing & Validation Needed
- [ ] Test drag-and-drop with new layout and spacing
- [ ] Verify all animations working (sparkles, glow, floating, bobbing)
- [ ] Test visitor character rotation (should change each round)
- [ ] Verify speech bubbles display text correctly
- [ ] Verify 3 paintings show correctly (not just 1)

### Additional Polish (Not Started)
- [ ] Overall layout and spacing refinement
- [ ] Color scheme review and adjustments
- [ ] Additional shadows and depth where needed
- [ ] Performance optimization if needed

## Planning (Phase 0 - 3h)



## Core Engine (Phase 1 - 6h)

- [ ] Implement 60fps game loop (requestAnimationFrame)
- [ ] Build sprite loading and rendering system
- [ ] Create drag-and-drop input handling (mouse + touch)
- [ ] Develop particle effect system (sparkles, hearts, trails)
- [ ] Build audio system (SFX queue, background music)
- [ ] Design UI framework (score, pause, settings)
- [ ] Implement save/load with LocalStorage
- [ ] Validation checkpoint: Core mechanics functional


## Level 1 - Greeting Hall (Phase 2 - 6h)

- [x] Build Carnegie tutorial (5-minute onboarding)
- [x] Create visitor spawn system (6 types with icons)
- [x] Implement door routing (6 doors with signage)
- [x] Add efficiency scoring (speed bonuses, combos)
- [x] Design Carnegie spirit NPC (appears at milestones)
- [x] Set victory condition (25 happy visitors)
- [x] Add progressive difficulty (speed increases, wave mode)
- [x] Visual polish (clean door markers, natural movement)
- [ ] Test with non-gamer (tutorial clarity)
- [x] Validation checkpoint: Level 1 playable


## Level 2 - Arrangement Room (Phase 3 - 6h)

- [x] Build Bach tutorial (arrangement mechanics)
- [x] Create artwork inventory system (8 types, progressive 1-4)
- [x] Implement drag-and-drop artwork placement
- [x] Add visitor preference system (colored glow reactions)
- [x] Build harmony scoring (color/style matching)
- [x] Design Bach spirit NPC (musical chimes)
- [x] Set victory condition (20 satisfied visitors)
- [ ] Fix rendering bugs in level2-new.html (only 1 painting shows, robots not visible)
- [ ] Debug image loading (PNG paths, console errors)
- [ ] Modernize UI/UX (see "Level 2 UI/UX Improvements" section - IN PROGRESS)
- [ ] Test drag-and-drop functionality with new PNG assets
- [ ] Verify all images loading correctly
- [ ] Replace old level2.html with level2-new.html when bugs fixed
- [ ] Validation checkpoint: Level 2 playable


## Level 3 - Living Gallery (Phase 4 - 5h)

- [ ] Build Feynman tutorial (environmental interaction)
- [ ] Create plant system (watering, growth, bloom)
- [ ] Implement lighting system (3 adjustable zones)
- [ ] Add cleanliness system (dirt spawns, cleaning tool)
- [ ] Build visitor pathfinding AI
- [ ] Create emergent behavior (visitors gather at pretty areas)
- [ ] Design Feynman spirit NPC (celebrates discoveries)
- [ ] Set victory condition (80% happiness for 5 minutes)
- [ ] Validation checkpoint: Level 3 playable


## Level 4 - Question Corner (Phase 5 - 4h)

- [ ] Build Turing tutorial (response selection)
- [ ] Create question bank (20 retail scenarios)
- [ ] Implement response card system (3 options per question)
- [ ] Add visitor reaction system (happy/neutral/confused)
- [ ] Enable iteration mechanic (retry without penalty)
- [ ] Design Turing spirit NPC (approves validation)
- [ ] Set victory condition (15 perfect responses)
- [ ] Validation checkpoint: Level 4 playable


## Meta & Polish (Phase 6 - 3h)

- [ ] Build artifact unlock system (museum plaques)
- [ ] Create historical timeline (Carnegie → modern AI)
- [ ] Design ending sequence (player visits own gallery)
- [ ] Build spirit gallery finale (all mentors together)
- [ ] Create credits screen (thank historical figures)
- [ ] Design main menu (level select, continue, settings)
- [ ] Validation checkpoint: Story complete


## Testing & Release (Phase 7 - 2h)

- [ ] Execute playtesting protocol (3 non-gamers)
- [ ] Document bugs (severity ratings)
- [ ] Run performance audit (load time, FPS, memory)
- [ ] Check accessibility (colorblind, keyboard, screen reader)
- [ ] Test mobile responsiveness (touch, screen sizes)
- [ ] Write documentation (README, setup, rationale)
- [ ] Final validation: Non-gamer completes independently
- [ ] Commit to git and push to GitHub


## Done

- [x] Execution plan created (GALLERY_KEEPER_EXECUTION_PLAN.md)
- [x] Kanban board initialized
- [x] Architecture designed (7 phases, 30 hours)
- [x] MVP defined (2 levels minimum, 4 stretch)
- [x] Historical mentors researched (Carnegie, Bach, Feynman, Turing)
- [x] Validation rubric established (9 criteria, 8.2/10 target)
- [x] Phase 0: Create toolbox navigation hub (index.html)
- [x] Phase 0: Build directory structure (gallery-keeper/ with subdirs)
- [x] Phase 0: Select technology stack (Canvas API chosen)
- [x] Phase 0: Document tech decisions in DECISIONS.md
- [x] Phase 0: Initialize autonomous execution framework
- [x] Phase 0: Set up time tracking system (PROGRESS.md)
- [x] Phase 0: Create PROGRESS.md for phase tracking
- [x] Phase 0: Validation checkpoint passed (40min / 3h budget)
- [x] Level 1: Complete implementation (visitor routing, Carnegie NPC, progressive difficulty)
- [x] Level 1: Victory condition and game over states
- [x] Level 1: Task handoff document created
- [x] Level 2: Core implementation (Bach tutorial, artwork system, harmony scoring)
- [x] Level 2: File structure created (level2.html, level2-arrangement-room.js)
- [x] Level 2: UI/UX modernization STARTED (Oct 4) - level2-new.html created but has critical bugs
- [x] Assets: Organized into thematic directories (shapes/, nature/, objects/, symbols/, frames/, robots/)
- [x] Shop-reset-kit documentation cleanup


## Blocked / Issues

- [x] Level 2 rendering bug: RESOLVED - rebuilt as level2-new.html with modern architecture
- [ ] Level 2: Waiting for conversation bubble assets for speech
- [ ] Level 2: Need to verify PNG transparency (branches, clouds, toolbox, people)
- [ ] Level 2: Test robots showing up correctly (check browser console logs)
- [ ] Need asset sources finalized (OpenGameArt vs custom)
- [ ] Playtester recruitment (need 3 non-gamers)
- [ ] Mobile testing devices (iPhone/Android access)




%% kanban:settings
```
{"kanban-plugin":"board","list-collapse":[false,false,false,false,false,false,false,false,false,false]}
```
%%