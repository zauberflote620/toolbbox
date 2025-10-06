# Task Handoff: Gallery Keeper UI Improvement Initiative
**Date:** 2025-10-06
**Status:** Planning Complete - Ready for Execution
**Worktree:** /Volumes/pi_ext_drive/obsidian/Toolbox
**Branch:** master (3 commits ahead of origin)

---

## QUICK START

Target Aesthetic: **Warm Educational Sketch Gallery** - Hand-drawn museum with brown earth tones, custom fonts (Angelinas/mOS Black), glassmorphism, educational NPCs teaching retail/AI concepts.

**Current Score:** 5.6/10 → **Target:** 8.3/10 → **Projected:** 8.7/10

**Weakest Areas:** Visual Consistency (4/10), Component Reusability (4/10), Typography (5/10), Accessibility (5/10), Asset Organization (6/10)

---

## 45-HOUR AUTONOMOUS EXECUTION FRAMEWORK

### Phase 0: Analysis & Foundation (8h)
- **Hours 1-2:** Comprehensive audit, baseline screenshots
- **Hours 3-4:** Design tokens (brown palette, Angelinas/mOS fonts, spacing scale)
- **Hours 5-6:** Typography implementation, font loading
- **Hours 7-8:** Grid system, glassmorphism utilities
- **CHECKPOINT:** design-tokens.css validates, fonts load <500ms

### Phase 1: Component Library (10h)
- **Hours 9-11:** Core components (buttons, panels, HUD, speech bubbles)
- **Hours 12-13:** HUD components (score, progress, resources, combo)
- **Hours 14-15:** Modals (toast, overlay, tutorial, loading)
- **Hours 16-17:** Character speech system
- **Hour 18:** Animation library (easing, particles)
- **CHECKPOINT:** Component showcase working, visual regression pass

### Phase 2: Asset Pipeline (6h)
- **Hours 19-20:** Export 40+ Excalidraw SVGs to gallery-keeper/assets
- **Hours 21-22:** SVGO optimization (30-50% reduction)
- **Hours 23-24:** Asset loader with lazy loading
- **CHECKPOINT:** 100+ images loaded, no memory leaks

### Phase 3: Level Refactoring (14h)
- **Hours 25-27:** Level 1 (yellow→brown, fonts, components, remove circles)
- **Hours 28-30:** Level 2 (integrate components, standardize)
- **Hours 31-33:** Level 3 (modularize 900-line monolith)
- **Hours 34-36:** Index/navigation polish
- **Hours 37-38:** Cross-level consistency check
- **CHECKPOINT:** All levels playable, rubric 8+/10

### Phase 4: Accessibility & Performance (4h)
- **Hours 39-40:** WCAG AA (keyboard nav, ARIA, contrast 4.5:1)
- **Hours 41-42:** Performance (60fps, <3s load, lazy loading)
- **CHECKPOINT:** WCAG AA compliant, 60fps maintained

### Phase 5: Polish & Future-Proofing (3h)
- **Hour 43:** UX flow (transitions, feedback, polish)
- **Hour 44:** Mobile responsiveness (44px touch targets)
- **Hour 45:** Level 4 template, DESIGN_SYSTEM.md
- **FINAL:** Rubric 8.3+/10 achieved

---

## CRITICAL EXECUTION RULES

### MUST DO
- Commit at EVERY validation checkpoint
- Test all 3 levels after each phase
- Maintain 60fps performance
- Preserve game mechanics exactly
- Use existing assets (40+ SVGs in Excalidraw/assets/, 2 fonts in gallery-keeper/assets/fonts/)
- Keep vanilla JavaScript (no build tools)

### NEVER DO
- Rewrite core game engine
- Change game mechanics
- Introduce dependencies/build tools
- Break localStorage compatibility
- Create new assets (use existing)
- Download fonts (already present)

### RECOVERY PROTOCOL
- Checkpoint fails → Rollback to last commit
- Stuck 30+ min → Document blocker, skip task
- 3 failures in row → Pause for manual review
- Performance drop → Revert optimization
- User test fails → Iterate UX

---

## FILE LOCATIONS

**Existing Assets:**
- `/Volumes/pi_ext_drive/obsidian/Toolbox/Excalidraw/assets/` - 40+ SVG files
- `/Volumes/pi_ext_drive/obsidian/Toolbox/gallery-keeper/assets/fonts/` - Angelinas.otf, mOS-Black.otf
- `/Volumes/pi_ext_drive/obsidian/Toolbox/gallery-keeper/core/` - Game engine modules

**Levels to Refactor:**
- `gallery-keeper/level1.html` - Yellow theme → brown conversion needed
- `gallery-keeper/level2.html` - Closest to target aesthetic
- `gallery-keeper/level3.html` - Best palette, needs modularization (900+ lines inline JS)

**Create During Execution:**
- `gallery-keeper/core/design-tokens.css` (Phase 0)
- `gallery-keeper/core/typography.css` (Phase 0)
- `gallery-keeper/core/utilities.css` (Phase 0)
- `gallery-keeper/components/*.js` (Phase 1)
- `gallery-keeper/core/asset-loader.js` (Phase 2)
- `gallery-keeper/DESIGN_SYSTEM.md` (Phase 5)

---

## SUCCESS CRITERIA

All must be true:
- ✅ Rubric score 8.3+/10 achieved
- ✅ Visual consistency across all levels
- ✅ Code duplication reduced 50%+
- ✅ WCAG 2.1 AA compliance
- ✅ 60fps gameplay, <3s load time
- ✅ Non-gamer completes Level 1 independently

---

## VALIDATION CHECKPOINTS

**Phase 0:** Design tokens validate, fonts load <500ms
**Phase 1:** Component showcase working, visual regression pass
**Phase 2:** Asset loader handles 100+ images, no memory leaks
**Phase 3:** All levels playable, rubric improvement visible
**Phase 4:** WCAG AA compliance, 60fps maintained
**Phase 5:** Rubric 8.3+/10, non-gamer completes Level 1

---

## COLOR PALETTE (Design Tokens)

**Primary Browns:**
- --color-brown-900: #3E2723
- --color-brown-800: #4E342E
- --color-brown-700: #5D4037
- --color-brown-600: #6D4C41
- --color-brown-500: #8B4513
- --color-brown-400: #A0522D

**Secondary Tans:**
- --color-tan-700: #A1887F
- --color-tan-600: #BCAAA4
- --color-tan-500: #D7CCC8
- --color-tan-400: #ECF0F1

**Accent Greens:**
- --color-green-500: #4CAF50
- --color-green-300: #66BB6A

**Accent Reds:**
- --color-red-500: #e74c3c

**Nature Palette:**
- --color-nature-light-green: #E8F5E9
- --color-nature-cream: #F1F8E9
- --color-nature-yellow: #FFF9C4

---

## TYPOGRAPHY SCALE

**Font Families:**
- --font-display: 'Angelinas', cursive
- --font-ui: 'mOS', -apple-system, sans-serif
- --font-body: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif

**Sizes:**
- --text-xs: 12px
- --text-sm: 14px
- --text-base: 16px
- --text-lg: 18px
- --text-xl: 24px
- --text-2xl: 36px
- --text-3xl: 48px

---

## START COMMANDS

```bash
# Verify location
pwd  # Should be: /Volumes/pi_ext_drive/obsidian/Toolbox

# Create checkpoint
git add -A
git commit -m "Checkpoint: Before Phase 0 - UI improvement initiative start"

# Create working directories
mkdir -p gallery-keeper/screenshots/baseline
mkdir -p gallery-keeper/docs
mkdir -p gallery-keeper/components

# Begin Phase 0 Hour 1: Comprehensive audit
# Task: Document current state of all 3 levels, capture baseline screenshots
```

---

## RECOMMENDED SUBAGENTS

- **worktree-verifier** - MANDATORY first step
- **code-reviewer** - After each phase
- **security-auditor** - Phase 4 accessibility
- **performance-guardian** - Phase 4 optimization
- **test-guardian** - After Phase 3

---

**NEXT SESSION:** Start Phase 0 Hour 1 - Comprehensive audit and baseline documentation
