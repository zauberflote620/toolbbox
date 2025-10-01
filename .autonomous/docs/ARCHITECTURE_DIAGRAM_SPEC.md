# Architecture Diagram Specification

**Purpose**: Visual reference for system design decisions during autonomous execution
**Format**: Excalidraw diagram
**Location**: To be created in Toolbox/Excalidraw/ directory

## Component 1: Excalidraw Drawing Layer

**Visual Representation**: Large rectangle on left side, colored light blue

**Label**: "Excalidraw Drawing Layer"

**Contents (draw inside rectangle)**:
- Shelf fixture icons (rectangles with horizontal lines)
- Product boxes (small colored squares)
- Zone highlights (semi-transparent overlays)
- Annotations (text labels and arrows)

**User Interaction Text**: "User draws basic store layout here"

**Position**: Left third of diagram

## Component 2: Communication Bridge

**Visual Representation**: Bidirectional arrows in center, colored orange

**Label**: "PostMessage Communication Bridge"

**Arrow Labels** (8 message types):
1. LAYOUT_DATA →
2. PRODUCT_LIST →
3. OPTIMIZATION_REQUEST →
4. ← OPTIMIZATION_RESULT
5. ← VISUAL_UPDATE
6. → USER_ACTION
7. ↔ ERROR
8. ↔ HEALTH_CHECK

**Implementation Notes Box**:
- JSON schema validation
- Retry logic: 3 attempts, 2-second delays
- Timeout: 30 seconds
- Health check: 5-second ping interval
- Fallback: Export-import JSON model

**Position**: Center of diagram connecting left and right components

## Component 3: React Application Container

**Visual Representation**: Large rectangle on right side, colored light green

**Label**: "React Application Container"

**Sub-Component 3a: Product Data Manager**
- Box inside container, top position
- Label: "Product Data Manager"
- Functions:
  - CSV import and validation
  - Product attribute storage
  - Constraint checking
  - Manual placement handling

**Sub-Component 3b: Optimization Engine**
- Box inside container, middle position
- Label: "Optimization Engine"
- Functions:
  - Objective function calculation
  - Algorithm execution (OR-Tools or Greedy)
  - Web Worker background processing
  - Progressive result updates

**Sub-Component 3c: Export Generator**
- Box inside container, bottom position
- Label: "Export Generator"
- Functions:
  - Excalidraw JSON generation
  - CSV placement list creation
  - PDF planogram rendering

**Position**: Right third of diagram

## Component 4: Data Flow Sequence

**Visual Representation**: Numbered sequence overlaid on entire diagram with colored highlights

**Step 1**: Arrow from drawing layer
- Number: "1"
- Text: "User draws store in Excalidraw"
- Color: Blue highlight

**Step 2**: Arrow through communication bridge
- Number: "2"
- Text: "Sends dimensions and fixtures to React"
- Color: Orange highlight

**Step 3**: Processing within React container
- Number: "3"
- Text: "React optimizes and returns product placements"
- Color: Green highlight

**Step 4**: Arrow back through communication bridge
- Number: "4"
- Text: "Excalidraw updates drawing with products"
- Color: Purple highlight

**Step 5**: Export action from React
- Number: "5"
- Text: "User exports final planogram"
- Color: Red highlight

## Component 5: Technology Stack

**Visual Representation**: Box at bottom of diagram, colored light gray

**Label**: "Technology Stack"

**Technologies Listed** (with version numbers):
- React 18.2.0
- Vite 4.5.0
- Tailwind CSS (to be added)
- Vitest 0.34.6
- Playwright (to be added)
- ExcalidrawAutomate
- Optimization: Google OR-Tools OR Greedy Heuristic

**Position**: Bottom of diagram spanning full width

## Additional Elements

**Title**: "Shop Reset Toolbox - MVP Architecture"

**Legend Box** (top right corner):
- Blue: User Interface Layer
- Orange: Communication Layer
- Green: Computation Layer
- Gray: Infrastructure

**Notes Box** (bottom right corner):
- "MVP Focus: Single methodology (Anchor-and-Spokes)"
- "Deferred: 3D viz, photo compliance, multiple methodologies"
- "Performance: <3s for 50 products"
- "Reliability: 99% communication success"

## Diagram Layout Summary

```
+----------------------------------------------------------+
|     Shop Reset Toolbox - MVP Architecture                |
+----------------------------------------------------------+
|                                                    Legend |
|  +----------------+    +----------------+    +---------+ |
|  |                |    |                |    | Compute | |
|  |  Excalidraw    |<-->| Communication  |<-->| React   | |
|  |  Drawing       |    | Bridge         |    | App     | |
|  |  Layer         |    | (PostMessage)  |    |         | |
|  |                |    |                |    |         | |
|  |  [Shelves]     |    | 8 Message      |    | [Data]  | |
|  |  [Products]    |    | Types          |    | [Optim] | |
|  |  [Zones]       |    |                |    | [Export]| |
|  +----------------+    +----------------+    +---------+ |
|                                                           |
|  Flow: 1→2→3→4→5                                         |
|                                                           |
|  +-----------------------------------------------------+  |
|  | Technology Stack                                    |  |
|  | React 18 | Vite 4 | Vitest | Playwright | OR-Tools |  |
|  +-----------------------------------------------------+  |
|                                                     Notes |
+----------------------------------------------------------+
```

## Creation Instructions

1. Open Excalidraw in Obsidian
2. Create new drawing named "MVP_System_Architecture.excalidraw"
3. Use hand-drawn style with rough edges
4. Use color scheme: blue (#E3F2FD), orange (#FFE0B2), green (#E8F5E9), gray (#F5F5F5)
5. Add shadows to main component boxes for depth
6. Use arrows with different line styles: solid for data flow, dashed for fallback paths
7. Group related elements together
8. Add text labels with 14pt font for readability
9. Export as PNG for documentation purposes

## Reference During Implementation

Use this diagram to:
- Understand component boundaries during code organization
- Clarify message types when implementing postMessage API
- Reference fallback approaches when communication fails
- Explain architecture to stakeholders
- Guide testing strategy (test each component and connections)
