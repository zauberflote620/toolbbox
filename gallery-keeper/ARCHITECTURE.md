# Gallery Keeper - Architecture Documentation

## Overview

Gallery Keeper is a cozy museum management game that teaches AI concepts through gameplay. Built with HTML5 Canvas and Vanilla JavaScript for maximum accessibility and zero build dependencies.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Gallery Keeper                        │
│                  (Browser Game - HTML5)                 │
└─────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼────┐       ┌────▼────┐      ┌─────▼─────┐
   │  Core   │       │ Levels  │      │   Data    │
   │ Engine  │       │ (1-4+)  │      │  Assets   │
   └────┬────┘       └────┬────┘      └─────┬─────┘
        │                 │                  │
        └─────────────────┴──────────────────┘
```

## Directory Structure

```
gallery-keeper/
├── index.html                   # Navigation hub & engine demo
├── level1.html                  # Level 1: Greeting Hall interface
├── level2.html                  # Level 2: Arrangement Room interface
├── CHANGELOG.md                 # Version history
├── ARCHITECTURE.md              # This file
│
├── core/                        # Reusable game engine
│   ├── engine.js               # Game loop, entity management
│   ├── sprites.js              # Sprite system (geometric + emoji)
│   ├── sprites-modern.js       # Hand-drawn sprite renderer
│   ├── input.js                # Drag-and-drop, mouse/touch
│   ├── particles.js            # Particle effects system
│   ├── audio.js                # Web Audio API wrapper
│   ├── ui.js                   # HUD, menus, messages
│   └── storage.js              # LocalStorage save/load
│
├── levels/                      # Self-contained level implementations
│   ├── level1-greeting-hall.js      # Carnegie: Input classification
│   └── level2-arrangement-room.js   # Bach: Multi-constraint optimization
│
├── assets/                      # Media files (future)
│   ├── sprites/                # Sprite sheets (placeholder)
│   ├── sounds/                 # SFX and music (placeholder)
│   └── backgrounds/            # Background images (placeholder)
│
├── data/                        # JSON data files
│   ├── mentors.json            # Historical figures (planned)
│   ├── visitors.json           # Visitor types (planned)
│   └── artifacts.json          # Museum pieces (planned)
│
└── docs/                        # Documentation
    ├── DECISIONS.md            # Technical decisions log
    ├── PROGRESS.md             # Phase completion tracking
    └── tech-benchmark.html     # Performance testing
```

## Core Engine Components

### 1. Game Engine (engine.js)

**Responsibilities:**
- Fixed timestep game loop (60fps)
- Entity management (add, remove, update)
- Global state management
- Canvas rendering coordination

**Key Classes:**
- `GameEngine`: Main engine class
  - `update(dt)`: Updates all entities
  - `render(ctx)`: Renders all entities
  - `addEntity(entity)`: Adds entity to scene
  - `removeEntity(entity)`: Removes entity from scene

**Architecture Pattern:**
- Entity-component-system (lightweight)
- Fixed timestep loop for consistent physics
- Separation of update and render phases

### 2. Sprite System (sprites.js, sprites-modern.js)

**Responsibilities:**
- Sprite creation and rendering
- Collision detection
- Animation states (idle, walking)
- Factory pattern for visitor/artifact creation

**Key Classes:**
- `SpriteFactory`: Creates sprites with consistent properties
- Modern sprite renderers for each visitor type

**Rendering Strategy:**
- Geometric shapes with gradients (base)
- Hand-drawn overlays with shadows (modern)
- Emoji icons for accessibility

### 3. Input System (input.js)

**Responsibilities:**
- Mouse and touch event handling
- Drag-and-drop mechanics
- Click detection
- Gesture support

**Event Flow:**
```
User Input
    │
    ├─ mousedown/touchstart → Start drag
    ├─ mousemove/touchmove  → Update drag position
    └─ mouseup/touchend     → Drop at target
```

### 4. Particle System (particles.js)

**Responsibilities:**
- Visual feedback effects
- Particle pooling for performance
- Sparkles, hearts, confetti, trails

**Architecture:**
- Object pooling (500 particle pool)
- Automatic lifecycle management
- Alpha blending for smooth fade

### 5. Audio System (audio.js)

**Responsibilities:**
- Procedural sound generation
- Sound queue management
- Volume control
- User-initiated audio unlock

**Technical Details:**
- Web Audio API for low-latency playback
- Frequency-based tone generation
- No external audio files (all procedural)

### 6. UI System (ui.js)

**Responsibilities:**
- HUD rendering (score, time, progress)
- Message overlays
- Pause menu
- Settings panel

**UI Components:**
- Messages (timed, auto-dismiss)
- Score display
- Progress indicators
- Button overlays

### 7. Storage System (storage.js)

**Responsibilities:**
- LocalStorage wrapper
- Settings persistence
- Save/load game state

**Data Format:**
- JSON serialization
- Namespaced keys (`gallery-keeper-*`)

## Level Architecture

### Level Structure Pattern

Each level is a self-contained class that follows this pattern:

```javascript
class LevelName {
    constructor(engine, ui, audio, particles) {
        // Dependencies injected
        this.engine = engine;
        this.ui = ui;
        this.audio = audio;
        this.particles = particles;

        // Level state
        this.score = 0;
        this.round = 0;

        // Mentor NPC
        this.mentor = { ... };

        // Tutorial
        this.tutorialStep = 0;
        this.tutorialMessages = [...];

        this.init();
    }

    init() {
        // Level initialization
    }

    update(dt) {
        // Per-frame logic updates
    }

    render(ctx) {
        // Custom rendering
    }

    handleInput(event) {
        // Input handling
    }
}
```

### Level 1: Greeting Hall

**AI Concept:** Input Classification
**Gameplay:** Route visitors to correct doors based on their needs
**Mentor:** Andrew Carnegie (telegraph messenger, library founder)

**Architecture:**
- Visitor spawn system with progressive difficulty
- Door matching logic (6 types)
- Drag-and-drop routing
- Wave mode for increased challenge
- Success/failure feedback loop

**Key Mechanics:**
```
Visitor spawns → Player drags to door →
Match check → Feedback (particles + sound) →
Score update → Next visitor
```

### Level 2: Arrangement Room

**AI Concept:** Multi-Constraint Optimization
**Gameplay:** Arrange artworks to satisfy visitor preferences
**Mentor:** Johann Sebastian Bach (composer, music director)

**Architecture:**
- Artwork inventory system (8 types with properties)
- Three gallery walls (placement zones)
- Visitor preference evaluation
- Harmony scoring (grouping bonus)
- Progressive difficulty (1-4 artworks per round)

**Key Mechanics:**
```
Round starts → Artworks available → Player arranges →
Visitor reacts (colored glow) → Player confirms →
Score + star → Next round
```

**Evaluation Algorithm:**
```
Satisfaction = (theme_match + style_match) * count + harmony_bonus
Reaction = happy(>70%) | neutral(40-70%) | unhappy(<40%)
```

## Data Flow

### Game Loop Data Flow

```
┌─────────────────────────────────────────────────┐
│  requestAnimationFrame                          │
│  ┌──────────────────────────────────────────┐  │
│  │  Game Loop (60fps fixed timestep)        │  │
│  │                                           │  │
│  │  1. Calculate dt (delta time)            │  │
│  │  2. Update Phase:                        │  │
│  │     - level.update(dt)                   │  │
│  │     - ui.update(dt)                      │  │
│  │     - particles.update(dt)               │  │
│  │                                           │  │
│  │  3. Render Phase:                        │  │
│  │     - ctx.clearRect()                    │  │
│  │     - level.render(ctx)                  │  │
│  │     - particles.render(ctx)              │  │
│  │     - ui.render(ctx)                     │  │
│  │                                           │  │
│  │  4. requestAnimationFrame(gameLoop)      │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### User Interaction Flow

```
User Action (click/drag)
    │
    ▼
Input System captures event
    │
    ▼
Level.handleInput(event)
    │
    ├─ Validate action
    ├─ Update game state
    ├─ Trigger audio feedback
    ├─ Spawn particles
    └─ Update UI
    │
    ▼
Next frame renders changes
```

## Performance Considerations

### Optimization Strategies

1. **Object Pooling**
   - Particle system uses 500-object pool
   - Prevents garbage collection spikes

2. **Fixed Timestep**
   - Consistent physics at 60fps
   - Decoupled from render rate

3. **Render Culling**
   - Only render visible entities
   - Skip off-screen particles

4. **Asset Strategy**
   - Procedural graphics (no image loading)
   - Procedural audio (no file decoding)
   - Zero network requests after page load

### Performance Targets

- **FPS:** 60fps stable with 100+ entities
- **Frame Time:** <16.67ms
- **Load Time:** <3 seconds
- **Memory:** Stable (no leaks)

**Actual Performance (Phase 1 validation):**
- FPS: 60 (stable)
- Frame Time: ~16.5ms
- Load Time: <100ms
- Memory: Stable

## Technology Stack

### Core Technologies
- **HTML5 Canvas API**: 2D rendering
- **Vanilla JavaScript (ES6+)**: No frameworks
- **Web Audio API**: Sound generation
- **LocalStorage**: Data persistence

### Why Vanilla JavaScript?

**Pros:**
- Zero dependencies (0KB overhead)
- Faster load times
- Direct control over rendering
- Easier debugging
- Simpler deployment

**Cons:**
- Manual implementation of game loop
- No built-in physics engine
- No scene management framework

**Decision Rationale:**
- Project scope is manageable without framework
- Target audience may have older/slower devices
- Load time is critical for accessibility
- 30-hour timeline favors simplicity over features

## Extension Points

### Future Enhancements

1. **Asset Upgrade Path**
   - Replace geometric shapes with sprite sheets
   - Add walk cycles and animations
   - Implement particle textures

2. **Additional Levels**
   - Level 3: Living Gallery (Feynman)
   - Level 4: Question Corner (Turing)
   - Einstein bonus level (optional)

3. **Meta Features**
   - Artifact unlock system
   - Historical timeline
   - Main menu with level select
   - Speedrun mode

4. **Technical Improvements**
   - Mobile optimization
   - Accessibility enhancements
   - Analytics integration
   - Multiplayer mode (stretch)

## Design Principles

### Core Philosophy
1. **Cozy, not challenging** - Relax, don't stress
2. **Show, don't tell** - Learn through doing
3. **Can't fail, only optimize** - No game-over screens
4. **Learning invisible** - AI concepts emerge naturally
5. **Emotionally resonant** - About serving others

### Technical Principles
1. **Simplicity over complexity** - Ship complete over feature-rich
2. **Performance over polish** - 60fps is non-negotiable
3. **Accessibility over aesthetics** - Everyone can play
4. **Modularity over monolith** - Levels are independent
5. **Documentation over comments** - Explain decisions

## Security Considerations

- No user data collection
- No external API calls
- LocalStorage only (client-side)
- No authentication required
- Safe for offline play

## Browser Compatibility

**Tested:**
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

**Requirements:**
- HTML5 Canvas support
- ES6+ JavaScript
- Web Audio API
- LocalStorage

**Graceful Degradation:**
- Audio requires user interaction (standard)
- Touch events fallback to mouse
- No critical dependencies on modern APIs

## Deployment

**Build Process:**
- None required (static HTML/JS/CSS)

**Hosting:**
- Any static file server
- GitHub Pages compatible
- No server-side processing needed

**Files to Deploy:**
```
gallery-keeper/
├── index.html
├── level1.html
├── level2.html
├── core/*.js
├── levels/*.js
└── assets/* (future)
```

---

**Last Updated:** 2025-10-03
**Architecture Version:** 1.0
**Status:** Phase 2 Complete (Level 1 + Level 2 implementation)
