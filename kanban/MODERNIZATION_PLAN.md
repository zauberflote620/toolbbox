# Gallery Keeper Modernization Plan

## Executive Summary
Modernizing Gallery Keeper with professional UI, fixing existing bugs, and completing all levels with beautiful, consistent design using the golden ratio and Rough.js library.

## Current State Analysis

### Existing Levels
- **Level 1 (Greeting Hall)**: Complete, Carnegie mentor, visitor routing
- **Level 2 (Arrangement Room)**: Complete, Bach mentor, artwork matching
- **Level 3 (Living Gallery)**: Complete, Feynman mentor, environmental management
- **Level 4 (Question Corner)**: Not started, Turing mentor planned
- **Level 5 (Exhibition Hall)**: Not started, Einstein mentor (stretch goal)

### Identified Bugs
1. "Back to Gallery" buttons may not be visually clear or positioned well
2. Some restart buttons don't work consistently across levels
3. Tutorial messages may persist when game starts
4. UI elements overlapping (pause/play buttons, objects on same space)
5. Inconsistent spacing and alignment
6. No unified design system

## Technology Stack

### Core Libraries to Integrate
1. **Rough.js** (v4.6.6) - Hand-drawn graphics library (what Excalidraw uses)
   - Creates authentic sketchy/hand-drawn look
   - Lightweight (~50KB minified)
   - Canvas-based rendering

2. **Golden Ratio** (φ = 1.618)
   - Use for spacing, sizing, and layout proportions
   - Apply to button sizes, margins, canvas dimensions
   - Create harmonious visual hierarchy

### Design System Components

#### Colors (Excalidraw-inspired)
```javascript
const COLORS = {
    background: {
        cream: '#FFF9DB',
        lightGray: '#F5F5F5',
        darkGray: '#2C2C2C'
    },
    primary: {
        black: '#1E1E1E',
        sketch: '#495057',
        accent: '#5F3DC4'
    },
    feedback: {
        success: '#51CF66',
        warning: '#FFD43B',
        error: '#FF6B6B',
        info: '#339AF0'
    }
};
```

#### Typography
```javascript
const FONTS = {
    heading: '"Kalam", cursive', // Hand-drawn feel
    body: '"Segoe UI", system-ui',
    mono: '"Courier New", monospace'
};
```

#### Golden Ratio Spacing System
```javascript
const PHI = 1.618;
const BASE_UNIT = 8; // pixels

const SPACING = {
    xs: BASE_UNIT,              // 8px
    sm: BASE_UNIT * PHI,        // ~13px
    md: BASE_UNIT * PHI * PHI,  // ~21px
    lg: BASE_UNIT * PHI ** 3,   // ~34px
    xl: BASE_UNIT * PHI ** 4    // ~55px
};
```

## Implementation Plan

### Phase 1: Create Shared UI System (2-3 hours)

#### 1.1 Rough.js Integration
- Create `shared/rough-ui.js` with reusable components
- Implement rough-styled buttons, panels, frames
- Create consistent sketch effects for all UI elements

#### 1.2 Shared Component Library
```javascript
// Components to create:
- RoughButton (start, restart, back to gallery)
- RoughPanel (tutorial boxes, score panels)
- RoughFrame (decorative borders)
- RoughProgressBar (loading, progress indicators)
- RoughDialog (victory screen, game over)
```

#### 1.3 Layout System
- Apply golden ratio to all canvas sizes
- Standard button sizes and positions
- Consistent spacing throughout

### Phase 2: Bug Fixes (1-2 hours)

#### 2.1 Navigation Fixes
- Ensure "Back to Gallery" button is always visible and clickable
- Add visual feedback on hover
- Test navigation from all levels

#### 2.2 Restart Button Fixes
- Unify restart functionality across all levels
- Add confirmation dialog for in-game restarts
- Clear all game state properly

#### 2.3 Tutorial System Fixes
- Create tutorial state machine
- Ensure tutorials clear before gameplay starts
- Add skip tutorial option
- Persist tutorial completion in localStorage

#### 2.4 UI Overlap Fixes
- Audit all UI element positions
- Implement z-index system
- Use golden ratio for spacing
- Prevent overlapping interactive elements

### Phase 3: Level Modernization (2-3 hours)

#### 3.1 Update Levels 1-3
- Apply new Rough.js UI components
- Implement golden ratio layouts
- Add smooth transitions
- Improve visual feedback

#### 3.2 Consistent Features Across Levels
- Unified pause menu
- Consistent score display
- Standard victory/defeat screens
- Settings menu (volume, difficulty)

### Phase 4: Build Level 4 - Question Corner (3-4 hours)

#### 4.1 Turing Mentor Character
- Turing character sprite with Excalidraw style
- Computer/tech themed environment
- Code-breaking/logic puzzle aesthetic

#### 4.2 Core Mechanics
- Question bank system (20 retail scenarios)
- 3 response cards per question
- Visitor reaction system (happy/confused/upset)
- Iteration mechanic (learn from mistakes)
- Score based on perfect responses

#### 4.3 Visual Design
- Vintage computer aesthetic with hand-drawn look
- Question cards with rough-styled frames
- Response cards with drag-or-click interaction
- Turing spirit appears for validation

#### 4.4 AI/Retail Teaching Concepts
- Decision trees
- Pattern recognition
- Customer service optimization
- Context-aware responses

### Phase 5: Polish & Testing (1-2 hours)

#### 5.1 Visual Polish
- Add micro-animations
- Improve particle effects
- Enhance feedback loops
- Add sound effects (optional)

#### 5.2 Comprehensive Testing
- Test all buttons and navigation
- Verify tutorial flows
- Check for UI overlaps
- Test on different screen sizes
- Performance optimization

#### 5.3 Accessibility
- Keyboard navigation
- Color contrast verification
- Screen reader friendly elements
- Clear focus indicators

## Golden Ratio Application Examples

### Canvas Dimensions
```javascript
// Standard canvas using golden ratio
const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = CANVAS_WIDTH / PHI; // ~556px

// Or for portrait orientation
const CANVAS_HEIGHT = 700;
const CANVAS_WIDTH = CANVAS_HEIGHT / PHI; // ~433px
```

### Button Sizing
```javascript
// Primary button (golden rectangle)
const BUTTON_WIDTH = 144;
const BUTTON_HEIGHT = BUTTON_WIDTH / PHI; // ~89px

// Secondary button (scaled down by PHI)
const SMALL_BUTTON_WIDTH = BUTTON_WIDTH / PHI; // ~89px
const SMALL_BUTTON_HEIGHT = SMALL_BUTTON_WIDTH / PHI; // ~55px
```

### UI Layout Grid
```javascript
// Divide canvas into golden ratio sections
const GOLDEN_POINT_X = CANVAS_WIDTH / PHI; // ~556px
const GOLDEN_POINT_Y = CANVAS_HEIGHT / PHI; // ~344px

// Use these points for focal elements:
// - Main character at golden point
// - Important UI at intersections
// - Score/HUD along golden lines
```

## Rough.js Usage Examples

### Basic Button
```javascript
function drawRoughButton(rc, x, y, width, height, text, hovered) {
    // Button background
    rc.rectangle(x, y, width, height, {
        fill: hovered ? '#5F3DC4' : '#339AF0',
        fillStyle: 'solid',
        roughness: 1.5,
        stroke: '#1E1E1E',
        strokeWidth: 3
    });

    // Button text (drawn with canvas)
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 18px Kalam';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + width/2, y + height/2);
}
```

### Tutorial Panel
```javascript
function drawTutorialPanel(rc, x, y, width, height, message) {
    // Background panel with sketch effect
    rc.rectangle(x, y, width, height, {
        fill: '#FFF9DB',
        fillStyle: 'hachure',
        fillWeight: 2,
        hachureGap: 8,
        roughness: 2,
        stroke: '#495057',
        strokeWidth: 4
    });

    // Decorative corner brackets
    rc.line(x, y + 20, x, y);
    rc.line(x, y, x + 20, y);
    // ... (repeat for all corners)

    // Message text
    drawWrappedText(ctx, message, x + 20, y + 30, width - 40);
}
```

## Success Metrics

### Bug Fixes
- [ ] All "Back to Gallery" buttons functional (100%)
- [ ] All restart buttons working correctly (100%)
- [ ] No tutorial overlap with gameplay (100%)
- [ ] Zero UI element overlaps (100%)
- [ ] Consistent spacing using golden ratio (100%)

### Level Completion
- [ ] Level 4 fully playable
- [ ] All levels use Rough.js UI
- [ ] Golden ratio applied throughout
- [ ] Unified design system across all levels

### Quality Measures
- [ ] 60 FPS on target hardware
- [ ] Loading time < 2 seconds
- [ ] No console errors
- [ ] Responsive to window resizing
- [ ] Accessible (keyboard navigation works)

## Timeline
- **Phase 1**: 2-3 hours (Shared UI System)
- **Phase 2**: 1-2 hours (Bug Fixes)
- **Phase 3**: 2-3 hours (Level Modernization)
- **Phase 4**: 3-4 hours (Level 4)
- **Phase 5**: 1-2 hours (Polish & Testing)

**Total**: 9-14 hours estimated

## Next Steps
1. Create shared/rough-ui.js component library
2. Fix existing bugs in levels 1-3
3. Apply new UI system to all levels
4. Build Level 4
5. Test and iterate
