---

kanban-plugin: board
date: 2025-10-03
last-modified: 2025-10-06
project: Gallery Keeper
status: ui-improvement-planned
estimated-hours: 30
additional-hours: 45 (UI improvement initiative)
time-spent: 2.5
time-banked: 6.17

---

## UI Improvement Initiative (45h) - READY TO START

### Phase 0: Analysis & Foundation (8h)
- [ ] Hour 1-2: Comprehensive audit with baseline screenshots
- [ ] Hour 3-4: Design system specification (CSS tokens, color palette, typography)
- [ ] Hour 5-6: Typography implementation (Angelinas, mOS Black fonts)
- [ ] Hour 7-8: Grid system and layout utilities
- [ ] CHECKPOINT: Design tokens validate, fonts load <500ms

### Phase 1: Component Library (10h)
- [ ] Hour 9-11: Core UI components (buttons, panels, HUD, speech bubbles)
- [ ] Hour 12-13: HUD components (score, progress, resources, combo)
- [ ] Hour 14-15: Modal & message system (toast, overlay, tutorial, loading)
- [ ] Hour 16-17: Character speech system enhancements
- [ ] Hour 18: Animation library with easing functions
- [ ] CHECKPOINT: Component showcase working, visual regression pass

### Phase 2: Asset Pipeline (6h)
- [ ] Hour 19-20: Export 40+ Excalidraw SVGs to gallery-keeper
- [ ] Hour 21-22: Optimize with SVGO (30-50% reduction target)
- [ ] Hour 23-24: Asset loader with lazy loading system
- [ ] CHECKPOINT: Asset loader handles 100+ images, no memory leaks

### Phase 3: Level Refactoring (14h)
- [ ] Hour 25-27: Level 1 complete refactor (yellow→brown, fonts, components)
- [ ] Hour 28-30: Level 2 component integration
- [ ] Hour 31-33: Level 3 modularization (900 lines→modules)
- [ ] Hour 34-36: Index and navigation polish
- [ ] Hour 37-38: Cross-level consistency verification
- [ ] CHECKPOINT: All levels playable, rubric improvement visible

### Phase 4: Accessibility & Performance (4h)
- [ ] Hour 39-40: WCAG AA compliance (keyboard, ARIA, contrast)
- [ ] Hour 41-42: Performance optimization (60fps, <3s load)
- [ ] CHECKPOINT: WCAG AA compliance, 60fps maintained

### Phase 5: Polish & Future-Proofing (3h)
- [ ] Hour 43: UX flow enhancements
- [ ] Hour 44: Mobile responsiveness
- [ ] Hour 45: Level 4 template and documentation
- [ ] FINAL CHECKPOINT: Rubric score 8.3+/10 achieved

### Quality Metrics
- **Current Rubric Score:** 5.6/10 (50/90)
- **Target Rubric Score:** 8.3/10 (75/90)
- **Projected Final Score:** 8.7/10 (78/90)

### Success Criteria
- [ ] Visual consistency across all levels
- [ ] Code duplication reduced 50%+
- [ ] WCAG 2.1 AA compliance
- [ ] 60fps gameplay, <3s load time
- [ ] Non-gamer completes Level 1 independently

## Backlog

- [ ] Post-30h: Polish pass (upgrade pixel art, more particle effects)
- [ ] Post-30h: Content expansion (more artifacts, additional visitor types)
- [ ] Post-30h: Level 5 - Exhibition Hall (Einstein mentor: experimentation & discovery)
  - Sandbox laboratory feel - try wild exhibit combinations
  - Hidden connection discovery system (combo unlocks)
  - Multi-perspective mechanics (same exhibit, different value per visitor type)
  - "Breakthrough moment" rewards with visual effects
  - NO tutorial feeling - pure experimentation and surprise
  - Teaching: cross-selling, unexpected correlations, context-dependent optimization
- [ ] Post-30h: Feature additions (speedrun mode, leaderboards)
- [ ] Post-30h: Mobile optimization (touch controls, responsive)
- [ ] Post-30h: Educational extensions (teacher mode, quiz system)
- [ ] 

## Bugs / todo
- [ ] MOVED TO PHASE 3: lvl 1 rm circles around "doors" (Hour 25-27)
- [ ] MOVED TO PHASE 3: refactor long files - level3.html 900+ lines (Hour 31-33)
- [ ] MOVED TO PHASE 1: Create shared component library (Hour 9-18)
- [ ] MOVED TO PHASE 2: Integrate Excalidraw SVG assets (Hour 19-20)
- [ ] MOVED TO PHASE 0: Design tokens and typography system (Hour 3-6)

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


## Level 2 - Arrangement Room (Phase 3 - 6h) - ✅ COMPLETE (Oct 4, 2025)

- [x] Build Bach tutorial (arrangement mechanics)
- [x] Create artwork inventory system (12 types - 4 themes × 3 styles including jazz)
- [x] Implement drag-and-drop artwork placement
- [x] Add visitor preference system with weighted matching (25% perfect, 75% partial)
- [x] Build weighted scoring system (Style 60pts > Theme 40pts)
- [x] Design Bach spirit NPC (musical chimes)
- [x] Set victory condition (20 satisfied visitors)
- [x] Fix rendering bugs (duplicate pause button, image paths, CSS background)
- [x] Debug image loading (fixed brain.png, music_notes.png paths to subdirectories)
- [x] Modernize UI/UX (start screen, canvas buttons, hover effects, victory screen)
- [x] Test drag-and-drop functionality with PNG assets
- [x] Verify all images loading correctly
- [x] Add time-based scoring (patience bonus up to +50 points)
- [x] Add jazz as rare 3rd style (10% chance)
- [x] Create start screen with user-initiated gameplay
- [x] Implement canvas-based UI controls (restart upper left, pause upper right)
- [x] Validation checkpoint: Level 2 MVP COMPLETE AND PLAYABLE


## Level 3 - Living Gallery (Phase 4 - 5h) - ✅ COMPLETE + ENHANCED (Oct 5, 2025)

### Core Implementation (Complete)
- [x] Build Feynman tutorial (environmental interaction)
- [x] Create plant system (watering, growth, bloom with glow effects)
- [x] Implement lighting system (redesigned to emanate from tree with visible aura)
- [x] Add cleanliness system (dirt spawns, cleaning tool)
- [x] Build visitor pathfinding AI (intelligent 8-candidate evaluation)
- [x] Create emergent behavior (visitors gravitate to well-maintained areas)
- [x] Design Feynman spirit NPC (celebrates discoveries with 4 discovery types)
- [x] Set victory condition (75% happiness for 3 minutes - balanced from original 80%/5min)
- [x] Add visual polish (plant glow, lighting flash, movement trails)
- [x] Implement Feynman discovery reactions (synergy, blooming, clean, lighting)
- [x] Balance game difficulty (adjusted timers, happiness targets)
- [x] Update index.html with Level 3 link

### Enhancements & Polish (Oct 5, 2025)
- [x] Add surprise elements (chickens, thunder cloud with progressive watering)
- [x] Create helper character (stick_hands_hip with tutorial-to-gameplay transition)
- [x] Redesign lighting system (tree-emanating aura instead of zones)
- [x] Improve game balance (50% slower decay, 60% Groot bonus, increased happiness bonuses)
- [x] Add victory screen buttons (pulsating restart, learn more with AI/retail education)
- [x] Add text shadows and glow effects to start/victory screens
- [x] Implement progressive rain mechanics (cloud waters as it passes, leaves dirt trail)
- [x] Integrate 12+ Excalidraw assets (chickens, cloud, helper, etc.)
- [x] Fix critical bugs (restart button, green box, game over positioning)
- [x] Validation checkpoint: Level 3 POLISHED AND PRODUCTION-READY


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
- [x] Level 2: UI/UX modernization STARTED (Oct 4) - level2.html modernized with new UI
- [x] Assets: Organized into thematic directories (shapes/, nature/, objects/, symbols/, frames/, robots/)
- [x] Shop-reset-kit documentation cleanup


## Blocked / Issues

- [x] Level 2 rendering bug: RESOLVED - rebuilt as level2.html with modern architecture
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