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
- [ ] Fix rendering bug (canvas shows but no elements visible)
- [ ] Test drag-and-drop functionality
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
- [x] Shop-reset-kit documentation cleanup


## Blocked / Issues

- [!] Level 2 rendering bug: Canvas shows but game elements not visible (needs browser console debugging)
- [ ] Need asset sources finalized (OpenGameArt vs custom)
- [ ] Playtester recruitment (need 3 non-gamers)
- [ ] Mobile testing devices (iPhone/Android access)




%% kanban:settings
```
{"kanban-plugin":"board","list-collapse":[false,false,false,false,false,false,false,false,false,false]}
```
%%