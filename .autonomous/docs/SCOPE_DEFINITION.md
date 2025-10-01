# SCOPE DEFINITION - MVP LOCKED

**Status**: LOCKED for 30-hour autonomous execution
**Date**: 2025-10-01
**Base Codebase**: shop-reset-kit

## MVP SCOPE - IN SCOPE

### 1. Excalidraw-React Integration
- PostMessage communication bridge between Excalidraw and React iframe
- Eight message types: LAYOUT_DATA, PRODUCT_LIST, OPTIMIZATION_REQUEST, OPTIMIZATION_RESULT, VISUAL_UPDATE, USER_ACTION, ERROR, HEALTH_CHECK
- Message validation with JSON schema
- Retry logic and timeout handling
- Health check system with 5-second ping interval
- Fallback: Export-import JSON model if postMessage fails

### 2. Anchor-and-Spokes Methodology (ONLY)
- Rule-based anchor selection using margin, cross-sell, prominence criteria
- Spoke assignment logic with distance calculations (5ft primary, 10ft secondary)
- Manual anchor override via drag-and-drop
- Constraint validation engine with 5 core constraints:
  - Minimum 42-inch aisle width
  - Maximum shelf weight capacity
  - Emergency exit clearance
  - Eye-level preference for high-margin items
  - Restricted product placement rules
- Real-time visual feedback: green valid, yellow warning, red error
- Layout quality scoring 0-100

### 3. Mathematical Optimization
- Library-based implementation (Google OR-Tools) OR greedy heuristic fallback
- Objective function with 3 weighted components:
  - Sales per square foot (weight 0.5)
  - Cross-sell opportunity (weight 0.3)
  - Visual flow (weight 0.2)
- User-adjustable weights
- Performance requirement: <3 seconds for 50 products, <10 seconds for 200 products
- Web Worker implementation for UI responsiveness
- Quality requirement: 20% better than random baseline across 10 trials

### 4. User Interface and Workflow
- Five-minute setup wizard: store dimensions, product CSV upload, methodology selection, optimization preferences
- CSV import with validation and example template
- Drag-and-drop layout editing with snap-to-grid (6-inch increments)
- Real-time constraint validation during drag
- Undo-redo with 20 action history
- Responsive design: 375px phone, 768px tablet, 1366px laptop

### 5. Export Functionality
- Three export formats:
  - Excalidraw JSON for visual layout
  - CSV product placement list with coordinates
  - PDF visual planogram with product images
- All exports immediately usable without additional formatting

### 6. Testing and Quality
- 75% code coverage minimum
- 85% coverage for critical paths
- Unit tests: <2 seconds execution
- Integration tests: <10 seconds execution
- End-to-end tests: <60 seconds execution
- Performance benchmarks on 2020 MacBook Air
- Zero critical accessibility violations (axe-core)
- Zero high-severity security vulnerabilities

### 7. Documentation
- Five Excalidraw visual guides:
  - Quick start
  - Methodology guide
  - Constraint reference
  - Troubleshooting flowchart
  - Architecture diagram
- Written documentation: README, CONTRIBUTING, API, MAINTENANCE
- 10-minute video walkthrough

## EXPLICITLY DEFERRED - OUT OF SCOPE

### Future Phase 1 (16 hours estimated)
- Grid Layout methodology
- Vertical Merchandising methodology
- Color Blocking methodology
- Zone-Based methodology

### Future Phase 2 (12 hours estimated)
- 3D visualization with Three.js
- Camera controls and viewpoints
- Zone visualization in 3D
- 3D product models

### Future Phase 3 (16 hours estimated)
- Photo compliance computer vision system
- Image upload and preprocessing
- Vision API integration
- Compliance scoring and reporting
- Visual diff system

### Future Phase 4 (8 hours estimated)
- Full mobile PWA optimization
- Service worker for offline functionality
- Offline photo queueing
- Conflict resolution for offline edits

### Future Phase 5 (6 hours estimated)
- Performance metrics dashboard
- Sales per square foot tracking
- GMROI calculation engine
- Customer dwell time estimation
- Trend analysis and before/after comparison

**Total Future Development**: 58 hours estimated

## SCOPE CHANGE PROTOCOL

Any request to add features during autonomous execution triggers:
1. Automatic pause of autonomous system
2. Human approval required
3. Time impact assessment
4. Simplification trigger evaluation
5. Documentation update to this file

## SIMPLIFICATION TRIGGERS

If phase exceeds allocated time by 25%, auto-reduce scope:

**Phase 1 (>5 hours)**: Switch from postMessage to export-import model (saves 2 hours)
**Phase 3 (>6 hours)**: Skip library optimization, implement greedy-only (saves 3 hours)
**Phase 4 (>6 hours)**: Reduce to 1 export format (CSV only) (saves 1.5 hours)
**Phase 5 (>6 hours)**: Reduce test coverage to 60%, critical paths only (saves 2 hours)

## CRITICAL SUCCESS METRICS

1. Setup time: <5 minutes from launch to export
2. Optimization quality: ≥20% better than random baseline
3. Performance: <3 seconds for 50 products on 2020 MacBook Air
4. Reliability: 99% communication success rate
5. Test coverage: ≥75% overall, ≥85% critical paths
6. Accessibility: Zero critical violations
7. Security: Zero high-severity vulnerabilities
8. Memory: <200MB normal, <500MB optimization
9. Browser compatibility: Chrome 90+, Firefox 88+, Safari 14+
10. Error handling: All errors have helpful messages

## TIME ALLOCATION

- Phase 0: Infrastructure (3h base + 0.5h buffer)
- Phase 1: Excalidraw Bridge (4h base + 1h buffer)
- Phase 2: Methodology (4h base + 0.5h buffer)
- Phase 3: Optimization (5h base + 1h buffer)
- Phase 4: UI/Workflow (5h base + 1h buffer)
- Phase 5: Testing (5h base + 1h buffer)
- Phase 6: Documentation (4h base + 0.5h buffer)

**Total**: 30h base + 5.5h contingency = 35.5h maximum
**Minimum viable**: 16h for core functionality only
