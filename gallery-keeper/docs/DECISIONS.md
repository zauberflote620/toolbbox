# Technical Decisions

This document tracks all major technical decisions made during the Gallery Keeper project development.

## Decision Log

### D001: Technology Stack Selection
**Date**: 2025-10-03
**Phase**: 0 - Architecture & Foundation
**Decision**: Use HTML5 Canvas API + Vanilla JavaScript

**Context**:
- Need to render 100+ sprites at 60fps
- Project requirements: cozy, accessible, fast-loading game
- Target audience: non-gamers, retail workers (may have older devices)
- Development timeline: 30 hours total

**Options Considered**:
1. **Canvas API + Vanilla JavaScript**
   - Pros: Zero dependencies, ~0KB overhead, direct control, simple debugging
   - Cons: Manual implementation of game loop, input, audio

2. **Phaser 3 Framework**
   - Pros: Built-in scenes, physics, animations, large community
   - Cons: ~700KB bundle size, steeper learning curve, potential over-engineering

3. **Pixi.js**
   - Pros: WebGL acceleration, excellent sprite performance
   - Cons: ~350KB bundle, overkill for simple 2D rendering

**Benchmark Results**:
- Canvas API: Handles 100 sprites at consistent 60fps (16.67ms frame time)
- Load time: <100ms (no external dependencies)
- Bundle size: 0KB additional overhead

**Decision Rationale**:
1. ✅ Performance requirement met (100 sprites at 60fps)
2. ✅ Zero dependencies = faster load times = better accessibility
3. ✅ Simpler codebase = easier debugging within 30-hour timeline
4. ✅ Direct control enables custom cozy animations (particles, ease-in/out)
5. ✅ Smaller bundle = better experience on older/slower devices
6. ⚠️ Phaser/Pixi add complexity without clear benefits for this scope

**Implementation Plan**:
- Use `requestAnimationFrame` for 60fps game loop
- Implement custom sprite class with position, velocity, draw methods
- Build drag-and-drop with mouse/touch event listeners
- Create particle system using Canvas paths and transforms
- Use Web Audio API for sound (simpler than Howler.js)

**Rollback Trigger**:
If we encounter need for:
- Complex physics (springs, constraints, collision resolution)
- Advanced scene management (fade transitions, complex state)
- Tilemap rendering or sprite atlases

Then consider migration to Phaser 3 (estimated 4-hour refactor).

**Validated By**: Performance benchmark (tech-benchmark.html)
**Status**: ✅ Approved for implementation

---

### D002: Initial Asset Strategy
**Date**: 2025-10-03
**Phase**: 0 - Architecture & Foundation
**Decision**: Use geometric shapes + emoji for Phase 1-2, upgrade if time permits

**Context**:
- 30-hour timeline requires fast iteration
- Cozy aesthetic is priority over pixel-perfect art
- Need to focus development time on mechanics, not assets

**Options Considered**:
1. **Custom Pixel Art**
   - Pros: Professional appearance, full control
   - Cons: 8-10 hours for 4 levels worth of sprites (33% of budget)

2. **CC0 Asset Packs** (OpenGameArt.org, Kenney.nl)
   - Pros: Professional quality, ready to use
   - Cons: May not match cozy aesthetic, licensing complexity

3. **Geometric Shapes + Emoji Icons**
   - Pros: Instant implementation, surprising charm, zero licensing
   - Cons: Less polished appearance

**Decision Rationale**:
1. ✅ Saves 8-10 hours for core mechanics development
2. ✅ Emoji are universally recognized (accessibility bonus)
3. ✅ Geometric shapes with gradients can look cozy (see Monument Valley)
4. ✅ Easy to replace later if time permits (asset swapping = 2 hours max)
5. ✅ Forces focus on gameplay feel, not visual distraction

**Implementation Plan**:
- **Visitors**: Colored circles with emoji faces (👨‍🦰👩‍🦱🧑‍🎨👵🧒👨‍💼)
- **Artifacts**: Rectangles with emoji icons (🖼️🗿🏺📜🎭⚱️)
- **Environment**: Simple gradients, CSS-like color palettes
- **Particles**: Colored circles with alpha fade (sparkles ✨)

**Upgrade Path** (if time remains in Phase 6):
1. Download CC0 sprite pack from Kenney.nl
2. Replace emoji with proper sprites (2-hour task)
3. Add walk cycles if time permits (1-hour task)

**Validated By**: Design philosophy (cozy over complex)
**Status**: ✅ Approved for Phase 1-2

---

### D003: File Structure & Architecture
**Date**: 2025-10-03
**Phase**: 0 - Architecture & Foundation
**Decision**: Modular architecture with single-file levels

**Structure**:
```
gallery-keeper/
├── index.html                 # Entry point
├── core/
│   ├── engine.js             # Game loop, render, input
│   ├── sprites.js            # Sprite base class
│   ├── particles.js          # Particle system
│   ├── audio.js              # Sound manager
│   └── ui.js                 # UI components
├── levels/
│   ├── level1-greeting.js    # Carnegie - Greeting Hall
│   ├── level2-arrangement.js # Bach - Arrangement Room
│   ├── level3-living.js      # Feynman - Living Gallery
│   └── level4-question.js    # Turing - Question Corner
├── data/
│   ├── mentors.json          # Historical figure data
│   ├── visitors.json         # Visitor types and preferences
│   └── artifacts.json        # Museum piece metadata
├── assets/
│   ├── sprites/              # (Future: replace emoji)
│   ├── sounds/               # SFX and music
│   └── backgrounds/          # Background images
└── docs/
    ├── PROGRESS.md           # Phase completion tracking
    ├── DECISIONS.md          # This file
    └── tech-benchmark.html   # Performance testing
```

**Decision Rationale**:
1. ✅ Each level is self-contained (easy to add/remove/test)
2. ✅ Core systems reusable across all levels
3. ✅ Data-driven design (easy to add visitors/artifacts)
4. ✅ Clear separation enables parallel development
5. ✅ Simple deployment (single folder, no build step)

**Validated By**: Successful shop-reset-kit structure
**Status**: ✅ Implemented

---

## Decision Validation Checklist

Before marking a decision as approved:
- [ ] Aligns with project goals (cozy, accessible, educational)
- [ ] Fits within 30-hour timeline
- [ ] Has clear rollback/upgrade path
- [ ] Documented with rationale and alternatives
- [ ] Performance validated where applicable
- [ ] Discussed trade-offs explicitly

---

## Future Decisions to Document

- [ ] **Audio Library**: Web Audio API vs Howler.js vs Tone.js
- [ ] **Save System**: LocalStorage vs IndexedDB
- [ ] **Tutorial Design**: Interactive vs Video vs Text
- [ ] **Accessibility**: Colorblind mode implementation
- [ ] **Mobile Support**: Touch controls and responsive breakpoints
- [ ] **Analytics**: What metrics to track (optional)

---

**Last Updated**: 2025-10-03 (Phase 0)
