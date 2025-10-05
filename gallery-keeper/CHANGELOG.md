# Gallery Keeper - Changelog

All notable changes to the Gallery Keeper project will be documented in this file.

## [Unreleased]

### Known Issues
- None - Level 2 MVP complete and playable

## [2025-10-04] - Level 2 Complete MVP + Major Game Mechanics Overhaul

### Added
- **Start Screen with User-Initiated Gameplay**
  - Large title screen with "Arrangement Room" and "Bach's Harmony Challenge"
  - Animated "Start Game" button with hover effects (scale, glow, color change)
  - Preview instructions on start screen
  - Images load only after user clicks start (better UX)

- **On-Screen UI Controls**
  - Restart button (upper left corner) - circular arrow icon, always visible
  - Pause button (upper right corner) - play/pause icons with state changes
  - Both buttons have rounded corners, gold borders, hover effects
  - Removed HTML buttons in favor of canvas-based UI

- **Jazz Style as Rare 3rd Aesthetic** (10% chance)
  - Added "jazz" style alongside classical and modern
  - Weighted appearance: 45% classical, 45% modern, 10% jazz
  - 12 total artwork types (4 themes × 3 styles)
  - Special message when matching jazz preferences

- **Victory Screen Improvements**
  - Clickable restart button on victory screen
  - Letter grades (S/A/B/C) based on performance
  - Stats display with stars, satisfaction percentage, final score
  - Confetti and fireworks celebration effects

### Changed
- **Game Mechanics Redesign - Style > Theme Philosophy**
  - **Flipped scoring weights**: Style match (60pts) > Theme match (40pts)
  - Rationale: Style preference is deeper knowledge (like knowing someone's music taste)
  - Theme = surface observation (easy to see), Style = aesthetic understanding (valuable)
  - Teaches AI concept: deeper pattern recognition yields better recommendations

- **Weighted Matching System** (25% perfect / 75% partial)
  - Only 25% of rounds include perfect match artwork
  - 75% of rounds have partial matches only (theme OR style, not both)
  - Creates meaningful challenge and decision-making
  - Previous system: 100% perfect matches always available

- **Time-Based Scoring** (Patience Factor)
  - Bonus points for faster matches: up to +50 based on remaining patience
  - Formula: patienceBonus = Math.floor(patience * 0.5)
  - Rewards confident, quick decisions
  - Teaches speed/accuracy balance

- **Improved Scoring Breakdown**
  - Perfect match (theme + style): 100 base + patience bonus + combo bonus
  - Style match only: 60 base + patience bonus
  - Theme match only: 40 base + patience bonus
  - No match: 10 base + patience bonus

### Fixed
- **Critical Rendering Bugs**
  - Fixed duplicate pause button issue (removed HTML button, kept canvas button)
  - Fixed broken image paths (brain.png, music_notes.png moved to subdirectories)
  - Fixed CSS background from neon purple/pink to soft pastels
  - Fixed `const` reassignment error in visitor artwork selection
  - Fixed broken restartBtn event listener causing game crash on load

- **Canvas Background**
  - Changed from bright neon gradient to soft pastels (matching in-game background)
  - Fallback CSS now matches JavaScript-rendered background

### Technical
- Renamed level2-new.html → level2.html (consolidated files)
  - Moved old level2.html to levels/legacy/
  - Updated all references and imports
  - Cleaned up kanban board references

- Added safety checks for missing artwork combinations
- Improved hover detection for all canvas buttons
- Refactored artwork selection logic with weighted probability

### Documentation
- Updated kanban with completed tasks and refactor notes
- Added suggestions for component library system (.excalidrawlib files)
- Created Gallery_Keeper_Overview.excalidraw visual documentation

### Performance
- Game loads instantly but waits for user interaction
- 18 image assets load on demand (after start button click)
- 60fps maintained throughout gameplay
- No memory leaks detected

## [2025-10-03] - Level 2 Initial Implementation

### Added
- **Level 2: Arrangement Room (Bach's Harmony Challenge)**
  - Complete game logic implementation (600+ lines)
  - Progressive difficulty system (1-4 artworks per round)
  - 8 artwork types with theme/style properties
  - Visitor preference system with colored glow reactions
  - Harmony scoring rewards grouping similar artworks
  - Bach mentor NPC with workplace-framed guidance
  - Drag-and-drop artwork placement on three gallery walls
  - Musical chime audio feedback for satisfied visitors
  - Auto-advancing tutorial system (6 messages, 30 seconds total)
  - 20-round victory condition with star collection
  - Level interface (level2.html) with instructions
  - Updated main navigation to include Level 2 link

### Changed
- Main index.html now displays both Level 1 and Level 2 with descriptions
- Removed religious references from Bach's dialogue (workplace framing)
- Tutorial auto-advances every 5 seconds (cozy, no clicking required)
- Canvas centered with responsive sizing

### Technical
- Files created: `levels/level2-arrangement-room.js`, `level2.html`
- Debug logging added for troubleshooting rendering issue

## [2025-10-03] - Level 1 Complete

### Added
- **Level 1: Greeting Hall (Carnegie's Routing Challenge)**
  - Complete visitor routing gameplay
  - 6 visitor types (Archives, Education Wing, Guided Tours, Museum, Cafe, General Admission)
  - 6 door destinations with icon-based matching
  - Progressive difficulty (spawn interval decreases with each success)
  - Wave mode (2 visitors at once after 3rd round)
  - Carnegie mentor NPC with tutorial messages
  - Efficiency scoring with time bonuses
  - Victory condition (25 satisfied visitors)
  - Game over condition (hall fills up - 8 visitors max)
  - Particle effects for successful matches
  - Musical feedback for correct/incorrect routing
  - Natural visitor movement (walk down + random drift)
  - Clean door design (circles without shadows)

### Changed
- Reduced visitor goal from 50 to 25 (less repetitive)
- Spawn interval starts at 1s, reduces to 0.5s minimum
- Wave mode activates after 3 visitors (was 10)
- Visitors slow down near doors instead of stopping abruptly
- Doors render as clean circles (no text labels, icons only)
- Background color: dark museum gray (#2C3E50)

### Fixed
- Door rendering bug (doors now render correctly in level's render method)
- Visitor movement feels natural (added drift mechanics)
- Door markers no longer have shadows underneath

### Documentation
- Created Level 1 completion handoff document
- Documented gameplay mechanics and tutorial system

## [2025-10-03] - Phase 1 Complete (Core Engine)

### Added
- **Core Game Engine** (HTML5 Canvas + Vanilla JS)
  - 60fps game loop with requestAnimationFrame
  - Fixed timestep (1/60s) for consistent physics
  - Entity management system
  - Sprite rendering with modern hand-drawn style
  - Particle effects system (sparkles, hearts, confetti)
  - Drag-and-drop input handling (mouse + touch)
  - Audio system (Web Audio API with procedural sounds)
  - UI framework (HUD, pause menu, settings, messages)
  - Save/load with LocalStorage
  - Interactive demo page

- **Modern Sprite System**
  - 6 visitor types with detailed designs:
    - Default visitor
    - Elder (cane, glasses)
    - Child (backpack)
    - Artist (palette)
    - Scholar (book)
    - Tourist (camera)
  - 6 artifact types with frames
  - Shadow rendering and idle animations

### Technical Details
- Files created:
  - `core/engine.js` (235 lines)
  - `core/sprites.js` (320 lines)
  - `core/sprites-modern.js` (500+ lines)
  - `core/input.js` (215 lines)
  - `core/particles.js` (280 lines)
  - `core/audio.js` (245 lines)
  - `core/ui.js` (260 lines)
  - `core/storage.js` (240 lines)
  - `index.html` (220 lines)
- Total code: ~2,015 lines across 8 files
- Performance: 60fps stable with 100+ entities
- Load time: <100ms (zero dependencies)

### Performance
- 60fps maintained with 100+ sprites
- Frame time: ~16.5ms (target: <16.67ms)
- Particle pool size: 500 (50 active average)
- Memory: Stable (no leaks detected)

## [2025-10-03] - Phase 0 Complete (Architecture & Foundation)

### Added
- **Project Structure**
  - Created `gallery-keeper/` directory with subdirectories:
    - `core/` - Game engine files
    - `levels/` - Self-contained level implementations
    - `assets/` - Sprites, sounds, backgrounds (future)
    - `data/` - JSON data for mentors, visitors, artifacts
    - `docs/` - Documentation and progress tracking

- **Documentation**
  - `DECISIONS.md` - Technical decisions with rationale
  - `PROGRESS.md` - Phase completion tracking
  - `tech-benchmark.html` - Performance testing
  - Navigation hub (`index.html`) with toolbox overview

### Decisions
- **D001**: Canvas API + Vanilla JavaScript (zero dependencies)
- **D002**: Geometric shapes + emoji for Phase 1-2 (fast iteration)
- **D003**: Modular architecture with single-file levels

### Time Tracking
- Phase 0: 40 minutes (3h allocated, 67% under budget)
- Phase 1: 110 minutes (6h allocated, 69% under budget)

## Project Information

### Technology Stack
- HTML5 Canvas API
- Vanilla JavaScript (ES6+)
- Web Audio API
- LocalStorage

### Architecture
- Modular core engine
- Self-contained levels
- Data-driven design
- Zero build dependencies

### Design Philosophy
- Cozy and satisfying (like Animal Crossing)
- Accessible to non-gamers
- Learning invisible (concepts emerge through play)
- Can't fail - only optimize
- Emotionally resonant (serving others)
