# Gallery Keeper Architecture

```excalidraw-svg
# Gallery Keeper - System Architecture Diagram

## High-Level System

+-----------------------------------------------------------+
|                    Gallery Keeper                         |
|               (Browser-Based HTML5 Game)                  |
+-----------------------------------------------------------+
                            |
        +-------------------+-------------------+
        |                   |                   |
   +----v----+         +----v----+        +----v-----+
   |  Core   |         | Levels  |        |   Data   |
   | Engine  |         | (1-4+)  |        |  Assets  |
   +---------+         +---------+        +----------+


## Core Engine Components

+---------------------+
|   GameEngine        |
|---------------------|
| - gameLoop()        |
| - update(dt)        |
| - render(ctx)       |
| - addEntity()       |
| - removeEntity()    |
+---------------------+
           |
           | uses
           v
+---------------------+     +---------------------+
|   SpriteFactory     |     |   ParticleSystem    |
|---------------------|     |---------------------|
| - createVisitor()   |     | - pool (500)        |
| - createArtifact()  |     | - createSparkle()   |
| - render()          |     | - createBurst()     |
+---------------------+     +---------------------+
           |                         |
           v                         v
+---------------------+     +---------------------+
|   InputSystem       |     |   AudioSystem       |
|---------------------|     |---------------------|
| - handleDrag()      |     | - playTone()        |
| - handleClick()     |     | - procedural gen    |
| - touch/mouse       |     | - Web Audio API     |
+---------------------+     +---------------------+
           |                         |
           v                         v
+---------------------+     +---------------------+
|   UISystem          |     |   StorageSystem     |
|---------------------|     |---------------------|
| - showMessage()     |     | - save()            |
| - renderHUD()       |     | - load()            |
| - pauseMenu()       |     | - LocalStorage      |
+---------------------+     +---------------------+


## Level Architecture

+----------------------------------------------------+
|                    Level Base                      |
|----------------------------------------------------|
| - constructor(engine, ui, audio, particles)        |
| - init()                                           |
| - update(dt)                                       |
| - render(ctx)                                      |
| - handleInput(event)                               |
+----------------------------------------------------+
                        |
        +---------------+----------------+
        |                                |
+-------v---------+              +-------v---------+
| Level 1:        |              | Level 2:        |
| Greeting Hall   |              | Arrangement     |
|-----------------|              |-----------------|
| - Carnegie NPC  |              | - Bach NPC      |
| - Visitors (6)  |              | - Artworks (8)  |
| - Doors (6)     |              | - Walls (3)     |
| - Routing       |              | - Preferences   |
| - Wave mode     |              | - Harmony score |
+-----------------+              +-----------------+


## Data Flow: Game Loop

+---------------------------+
| requestAnimationFrame     |
+---------------------------+
            |
            v
+---------------------------+
| Calculate dt (1/60s)      |
+---------------------------+
            |
            v
+---------------------------+
| UPDATE PHASE              |
|---------------------------|
| 1. level.update(dt)       |
| 2. ui.update(dt)          |
| 3. particles.update(dt)   |
+---------------------------+
            |
            v
+---------------------------+
| RENDER PHASE              |
|---------------------------|
| 1. ctx.clearRect()        |
| 2. level.render(ctx)      |
| 3. particles.render(ctx)  |
| 4. ui.render(ctx)         |
+---------------------------+
            |
            v
+---------------------------+
| Loop (60fps)              |
+---------------------------+


## User Interaction Flow

+---------------------------+
| User Action               |
| (click/drag/touch)        |
+---------------------------+
            |
            v
+---------------------------+
| Input System              |
| - Capture event           |
| - Calculate coordinates   |
+---------------------------+
            |
            v
+---------------------------+
| Level.handleInput()       |
| - Validate action         |
| - Update game state       |
+---------------------------+
            |
      +-----+-----+
      |           |
      v           v
+----------+ +----------+
| Audio    | | Particles|
| Feedback | | Spawn    |
+----------+ +----------+
      |           |
      +-----+-----+
            |
            v
+---------------------------+
| UI Update                 |
| - Score                   |
| - Messages                |
+---------------------------+
            |
            v
+---------------------------+
| Next Frame Renders        |
+---------------------------+


## File Structure

gallery-keeper/
├── index.html              ← Navigation hub
├── level1.html             ← Level 1 interface
├── level2.html             ← Level 2 interface
│
├── core/                   ← Reusable engine
│   ├── engine.js          (235 lines)
│   ├── sprites.js         (320 lines)
│   ├── sprites-modern.js  (500 lines)
│   ├── input.js           (215 lines)
│   ├── particles.js       (280 lines)
│   ├── audio.js           (245 lines)
│   ├── ui.js              (260 lines)
│   └── storage.js         (240 lines)
│
├── levels/                 ← Self-contained levels
│   ├── level1-greeting-hall.js      (460 lines)
│   └── level2-arrangement-room.js   (600 lines)
│
├── data/                   ← JSON data (planned)
│   ├── mentors.json
│   ├── visitors.json
│   └── artifacts.json
│
├── assets/                 ← Media (future)
│   ├── sprites/
│   ├── sounds/
│   └── backgrounds/
│
└── docs/                   ← Documentation
    ├── DECISIONS.md
    ├── PROGRESS.md
    └── tech-benchmark.html


## Level 1: Greeting Hall - Component Diagram

+--------------------------------------+
|         Greeting Hall                |
+--------------------------------------+
|                                      |
|  +--------------------------------+  |
|  | Carnegie NPC                   |  |
|  | - Tutorial messages (6)        |  |
|  | - Encouragement at milestones  |  |
|  +--------------------------------+  |
|                                      |
|  +--------------------------------+  |
|  | Visitor Spawn System           |  |
|  | - 6 types with needs           |  |
|  | - Progressive spawn rate       |  |
|  | - Wave mode (2 at once)        |  |
|  | - Max 8 on screen              |  |
|  +--------------------------------+  |
|                                      |
|  +--------------------------------+  |
|  | Door System                    |  |
|  | - 6 doors with icons           |  |
|  | - Match logic                  |  |
|  | - Visual feedback              |  |
|  +--------------------------------+  |
|                                      |
|  +--------------------------------+  |
|  | Scoring System                 |  |
|  | - Base points: 10              |  |
|  | - Time bonus: up to 5          |  |
|  | - Victory: 25 visitors         |  |
|  | - Game over: 8 simultaneous    |  |
|  +--------------------------------+  |
|                                      |
+--------------------------------------+


## Level 2: Arrangement Room - Component Diagram

+--------------------------------------+
|       Arrangement Room               |
+--------------------------------------+
|                                      |
|  +--------------------------------+  |
|  | Bach NPC                       |  |
|  | - Tutorial messages (6)        |  |
|  | - Helpful suggestions          |  |
|  | - Musical chime feedback       |  |
|  +--------------------------------+  |
|                                      |
|  +--------------------------------+  |
|  | Artwork System                 |  |
|  | - 8 types (themes/styles)      |  |
|  | - Progressive: 1-4 per round   |  |
|  | - Color-coded                  |  |
|  +--------------------------------+  |
|                                      |
|  +--------------------------------+  |
|  | Gallery Walls                  |  |
|  | - Left wall                    |  |
|  | - Center wall                  |  |
|  | - Right wall                   |  |
|  | - Drag-drop placement          |  |
|  +--------------------------------+  |
|                                      |
|  +--------------------------------+  |
|  | Visitor Preferences            |  |
|  | - Random theme preference      |  |
|  | - Random style preference      |  |
|  | - Colored glow reactions       |  |
|  | - Green/Yellow/Red feedback    |  |
|  +--------------------------------+  |
|                                      |
|  +--------------------------------+  |
|  | Harmony Scoring                |  |
|  | - Theme match: 40 pts          |  |
|  | - Style match: 40 pts          |  |
|  | - Grouping bonus: 20 pts       |  |
|  | - Victory: 20 stars            |  |
|  +--------------------------------+  |
|                                      |
+--------------------------------------+


## Performance Architecture

+--------------------------------------+
| Performance Optimization             |
+--------------------------------------+
|                                      |
| Object Pooling                       |
| +--------------------------------+   |
| | Particle Pool (500 objects)    |   |
| | - Reuse instead of create      |   |
| | - Prevent GC spikes            |   |
| +--------------------------------+   |
|                                      |
| Fixed Timestep                       |
| +--------------------------------+   |
| | 60fps game loop                |   |
| | - Consistent physics           |   |
| | - dt = 1/60 seconds            |   |
| +--------------------------------+   |
|                                      |
| Render Optimization                  |
| +--------------------------------+   |
| | - Only visible entities        |   |
| | - Skip off-screen particles    |   |
| | - Batch draw calls             |   |
| +--------------------------------+   |
|                                      |
| Asset Strategy                       |
| +--------------------------------+   |
| | - Procedural graphics          |   |
| | - Procedural audio             |   |
| | - No network requests          |   |
| | - Load time: <100ms            |   |
| +--------------------------------+   |
|                                      |
+--------------------------------------+

Target: 60fps with 100+ entities
Actual: 60fps stable (16.5ms frame time)
```

---

**Notes:**
- This is a text-based architecture diagram
- For visual Excalidraw editing, open this file in Obsidian with Excalidraw plugin
- All measurements based on Phase 1-2 actual implementation
- Updated: 2025-10-03
