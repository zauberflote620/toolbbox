# Shop Reset Toolbox: Architecture & Visual Index

⚠️ **NOTICE: THIS ARCHITECTURE IS MOCK AND NOT REAL** ⚠️
*This document contains placeholder architecture for demonstration purposes only. The actual implementation may differ significantly.*

This document outlines the structure of the Shop Reset Toolbox and provides a visual index to all its components. The toolbox is designed around the **Anchor-and-Spokes** methodology, providing a set of reusable, visually-driven artifacts for efficient and repeatable shop resets.

## Visual Index

This grid provides a one-glance overview and navigation to all the key artifacts in the toolbox.

| Artifact | Thumbnail (Low-Fi) | Purpose |
|---|---|---|
| **1. Method Comparison** | `[Table]` | Shows the scoring and decision process for selecting the reset methodology. |
| **2. Decision Record** | `[Storyboard]` | Explains *why* the Anchor-and-Spokes method was chosen and how it works. |
| **3. Parameterization Model** | `[Diagram]` | Defines the configurable "knobs" that tune the reset plan. |
| **4. Constraints Intake** | `[Form]` | The user-fillable template to provide shop-specific constraints and priorities. |
| **5. Anchor & Spoke Map** | `[Map]` | The primary visual layout plan, showing where Anchors and Spokes are placed. |
| **6. Product Relationship Card**| `[Card]` | A detailed guide for merchandising a single Anchor and its Spokes. |
| **7. Validation Loop** | `[Checklist]` | A QA checklist and guide for validating the reset and providing feedback. |
| **8. Re-Run Guide** | `[Quickstart]` | A one-page guide for executing subsequent resets quickly. |

---

## Core Artifacts: Templates & Examples

Below are the templates for the core visual artifacts. They are designed to be generated automatically based on the `config.yaml` and `constraints.yaml` files.

### 5. Anchor & Spoke Map (Template)

**Purpose:** This is the master visual plan for the entire shop floor. It shows the placement of each Anchor and its surrounding Spokes, respecting all spatial and visibility constraints.

**How it consumes config:**
*   `focal_anchors_per_section` determines the number of `(A)` markers.
*   `section_weights` influences which sections get the most prominent Anchors.
*   `shop_layout` from `constraints.yaml` provides the base map.
*   `visibility` constraints from `constraints.yaml` are overlaid to ensure sightlines.

**Low-Fi Version (ASCII/Markdown):**

```
# Anchor & Spoke Map: <PLACEHOLDER: Shop Name, Date>

## Section: Entrance Zone (High Priority)

+----------------------------------------------------+
|                        Window                      |
|                                                    |
|   +-----------+         +-----------+              |
|   |           |         |           |              |
|   |  (A1)     |         |   (S)     |              |
|   |           |         |           |              |
|   +-----------+         +-----------+              |
|      Table (Low)           4-Way Rack (<4ft)       |
|                                                    |
+----------------------------------------------------+
  ^ Entrance

## Section: Main Floor

+----------------------------------------------------+
|                                                    |
|   +-----------+   +-------+   +-------+            |
|   |           |   |       |   |       |            |
|   |   (A2)    |   |  (S)  |   |  (S)  |            |
|   |           |   |       |   |       |            |
|   +-----------+   +-------+   +-------+            |
|     Gondola          Table       Table             |
|                                                    |
+----------------------------------------------------+

Legend: (A#) = Anchor, (S) = Spoke
Constraint Overlay: All fixtures in Entrance Zone are < 4ft high.
```

**Hi-Fi-Ready Version (Description for SVG/PNG export):**
*   A layered SVG file.
*   **Layer 1 (Base):** A to-scale floor plan derived from `shop_layout`.
*   **Layer 2 (Fixtures):** Outlines of all fixtures.
*   **Layer 3 (Constraints):** Dashed red lines or shaded areas indicating "no-go" zones or height limits from `constraints.yaml`.
*   **Layer 4 (Anchors & Spokes):** Clearly labeled icons for each Anchor (A1, A2) and Spoke (S), color-coded by their relationship.
*   **Layer 5 (Text):** Labels, legends, and notes.

### 6. Product Relationship Card (Template)

**Purpose:** A portable, 4x6" card for staff to use on the floor. It details the merchandising logic for a single Anchor cluster.

**How it consumes config:**
*   `anchor_selection_criteria` determines the product listed as the Anchor.
*   `spoke_density` determines the number of Spoke slots.
*   Inventory data is used to fill in the product details.

**Low-Fi Version (Markdown):**

```
+----------------------------------------------------+
| ANCHOR CLUSTER: A1 - New Arrival Outerwear         |
| LOCATION: Entrance Zone, Main Table                |
+----------------------------------------------------+
| ANCHOR PRODUCT:                                    |
|   SKU: <PLACEHOLDER: SKU>                          |
|   Name: <PLACEHOLDER: Product Name>                |
|   Visual Cue: Mannequin wearing the jacket.        |
+----------------------------------------------------+
| SPOKES (Density: 4)                                |
|----------------------------------------------------|
| 1. COMPLEMENT:                                     |
|    SKU: <PLACEHOLDER: SKU> - Scarf                 |
|    Reason: Pairs well with the jacket.             |
|----------------------------------------------------|
| 2. ACCESSORIZE:                                    |
|    SKU: <PLACEHOLDER: SKU> - Beanie                |
|    Reason: Completes the winter look.              |
|----------------------------------------------------|
| 3. ALTERNATIVE:                                    |
|    SKU: <PLACEHOLDER: SKU> - Lighter Jacket        |
|    Reason: Offers a different weight/style.        |
|----------------------------------------------------|
| 4. UPSELL:                                         |
|    SKU: <PLACEHOLDER: SKU> - Leather Gloves        |
|    Reason: Premium accessory.                      |
+----------------------------------------------------+
```

**Hi-Fi-Ready Version (Description for PDF/PNG export):**
*   A print-ready PDF, formatted to a standard 4x6" index card size.
*   Uses a clear, bold, sans-serif font.
*   Includes a small, low-res image of the Anchor product.
*   Uses icons (e.g., a plus sign for complement, an arrow up for upsell) for quick scannability.


