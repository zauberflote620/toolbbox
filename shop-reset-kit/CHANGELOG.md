# Changelog

## 2025-10-02 - Fixture System Overhaul & Gift Shop Dataset

### Added
- Fully customizable fixture system
  - Custom name/ID for each fixture
  - Configurable dimensions (width, height, depth in inches)
  - Variable levels/shelves/bars (1-50+)
  - Adjustable capacity per level
  - Auto-calculated total capacity
  - Optional configuration notes field
  - 6 visual types for planogram rendering
- Calculator functionality for all dimension fields
  - Store width/length fields accept math expressions (e.g., "5*24", "3*48+2*36")
  - Fixture dimension fields support calculations
  - Auto-evaluates on blur with visual confirmation
  - Supports +, -, *, /, parentheses, decimals
- Visual planogram with heat zones
  - 4-zone heat map (entrance, high-traffic, mid-store, checkout)
  - Fixture placement visualization
  - Color-coded fixture types
  - Entrance indicator
  - Golden triangle traffic flow overlay
  - Interactive legend
- Fixture template loader
  - 6 pre-configured templates (gondola, slatwall, rack, shelving, table, counter)
  - Load and customize templates
- Arts venue gift shop test dataset (50 products)
  - 8 paper goods items
  - 13 stationery items
  - 10 collectibles
  - 7 bags/totes
  - 8 homeware items
  - 4 apparel items
  - Realistic pricing ($4-$85 range)
  - Appropriate margins (48-80%)
  - Arts-focused styles and categories

### Changed
- Replaced generic apparel test data with arts venue gift shop inventory
- Store dimension inputs changed from number to text type to support calculations
- Fixture dimension inputs changed from number to text type to support calculations
- Test data alert message updated to describe gift shop inventory

### Technical
- File size: 134KB (3,192 lines)
- New functions: calculateDimension(), addCustomFixture(), renderFixtureList(), generatePlanogram()
- Custom fixtures stored in customFixtures array
- Visual merchandising features validated and production-ready (100/100 score)

## 2025-10-02 - Visual Merchandising Features

### Added
- Price Point Ladder Analysis
  - 6 price tiers with gap detection
  - Severity-based recommendations
  - HTML histogram visualization
  - Integrated into placement algorithm (15% weight)
- Golden Triangle Traffic Flow
  - Entrance/focal/cashwrap path calculation
  - Decompression zone validation (15 feet)
  - On-path/near-path/off-path scoring
  - SVG visualization
  - Integrated into placement algorithm (30% weight)
- Infrastructure
  - Emergency rollback system (5 snapshots)
  - Validation framework (14 automated checks)
  - localStorage state persistence (4MB limit)
  - Time banking system
  - Global error handler with auto-rollback

### Technical
- Phase 0 validation executes on DOMContentLoaded
- VM scores actively influence product placement
- 11-factor placement algorithm implemented
