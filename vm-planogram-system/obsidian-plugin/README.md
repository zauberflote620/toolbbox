# VM Planogram Obsidian Plugin v2.0.0

A professional-grade Visual Merchandising planogram creation and management plugin for Obsidian, integrated with the Shop Reset Toolbox's Anchor-and-Spokes methodology.

## 🚀 Features

### Professional VM Capabilities
- **Precise Measurement System**: 10px = 1 inch scaling for print accuracy
- **VM Zone Management**: Eye level, reach, stretch, stoop, and strike zones
- **Fixture Library**: Gondolas, endcaps, wall units, islands, and custom fixtures
- **Product Management**: SKU tracking, facings, pricing, and velocity data
- **Anchor-and-Spokes Integration**: Native support for Shop Reset methodology

### Compliance & Validation
- **VM Principles**: Eye level optimization, sight lines, cross-merchandising
- **Safety Compliance**: Egress paths, weight distribution, ADA requirements
- **Regulatory Validation**: Fire codes, local ordinances, accessibility standards
- **Auto-Fix Capabilities**: Intelligent suggestions and automatic corrections
- **Compliance Scoring**: Weighted scoring system with detailed reporting

### Performance & Accessibility
- **Large Planogram Support**: Optimized for 100+ SKU layouts
- **Spatial Indexing**: Efficient rendering and interaction for complex layouts
- **Screen Reader Support**: Full accessibility with ARIA labels and announcements
- **Keyboard Navigation**: Complete keyboard control with customizable shortcuts
- **High Contrast Mode**: Enhanced visibility for accessibility needs

### Export & Integration
- **Production PDF Export**: Print-ready documents with precise measurements
- **Multiple Paper Sizes**: Support for standard retail formats
- **Measurement Verification**: Built-in rulers and scale indicators
- **Shop Reset Integration**: YAML configuration support for constraints and goals

## 📋 Requirements

- Obsidian v1.0.0 or higher
- Modern web browser with Canvas 2D support
- 4GB RAM minimum (8GB recommended for large planograms)

## 🛠️ Installation

### Method 1: Manual Installation

1. Download the plugin files from the releases page
2. Copy to your Obsidian plugins directory:
   ```
   .obsidian/plugins/vm-planogram/
   ```
3. Enable the plugin in Obsidian Settings > Community Plugins

### Method 2: Development Installation

1. Clone this repository into your Obsidian plugins directory
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the plugin:
   ```bash
   npm run build
   ```
4. Enable in Obsidian Settings

## 🎯 Quick Start Guide

### Creating Your First Planogram

1. **Open the VM Planogram View**
   - Use command palette: `VM Planogram: Create New`
   - Or click the planogram icon in the ribbon

2. **Set Up Your Store Layout**
   - Configure store dimensions and constraints
   - Load Shop Reset configuration (optional)
   - Set measurement units and scale

3. **Add Fixtures**
   - Select fixture type from toolbar
   - Click on canvas to place
   - Drag to resize and position
   - Use properties panel to configure details

4. **Place Products**
   - Select fixtures to add products
   - Configure SKU, facings, and pricing
   - Assign VM zones for optimal placement
   - Use compliance checker for validation

5. **Export and Share**
   - Generate PDF for printing
   - Export measurement sheets
   - Save compliance reports

## 🔧 Configuration

### Plugin Settings

Access settings via `Settings > Plugin Options > VM Planogram`:

- **Display Options**: Grid size, rulers, compliance overlays
- **Measurement System**: Units, scaling, precision
- **Shop Reset Integration**: YAML file paths, method selection
- **Accessibility**: Screen reader, keyboard navigation, contrast
- **Performance**: Large planogram optimizations, caching

### Shop Reset Integration

Configure Shop Reset Toolbox integration:

```yaml
# constraints.yaml
physical:
  maxWeight: 50          # Maximum fixture weight (lbs)
  minClearance: 36       # Minimum aisle clearance (inches)
  maxHeight: 96          # Maximum fixture height (inches)
  aisleWidth: 48         # Standard aisle width (inches)

safety:
  egressPaths: true      # Maintain emergency egress
  emergencyAccess: true  # Emergency equipment access
  weightDistribution: true # Even weight distribution
  fragileItemHeight: 60  # Max height for fragile items

regulatory:
  adaCompliance: true    # ADA accessibility requirements
  fireCode: true         # Local fire code compliance
  localOrdnances: []     # Additional local requirements
```

## 🎨 User Interface Guide

### Toolbar Controls

| Icon | Function | Shortcut |
|------|----------|----------|
| 📐 | Select/Move | `S` |
| 🏪 | Add Fixture | `F` |
| 📦 | Add Product | `P` |
| 📏 | Measure Tool | `M` |
| 🔍 | Zoom Tool | `Z` |
| ✅ | Compliance Check | `C` |

### Keyboard Shortcuts

#### Navigation
- `Arrow Keys`: Move selection
- `Ctrl + Arrow`: Fine movement (1px)
- `Shift + Arrow`: Large movement (10px)
- `Tab` / `Shift+Tab`: Cycle through elements

#### Actions
- `Enter`: Edit selected element
- `Delete`: Remove selected element
- `Ctrl+C` / `Ctrl+V`: Copy/paste
- `Ctrl+Z` / `Ctrl+Y`: Undo/redo
- `Ctrl+A`: Select all

#### View Controls
- `Ctrl++` / `Ctrl+-`: Zoom in/out
- `Ctrl+0`: Reset zoom
- `Ctrl+G`: Toggle grid
- `Ctrl+R`: Toggle rulers

## 📊 VM Zones and Best Practices

### Zone Guidelines

| Zone | Height Range | Best For | Color Code |
|------|--------------|----------|------------|
| **Eye Level** | 60"-72" | High-margin, impulse items | 🟢 Green |
| **Reach** | 48"-60" | Popular, everyday products | 🔵 Blue |
| **Stretch** | 72"+ | Premium, specialty items | 🟡 Amber |
| **Stoop** | <48" | Value items, bulk products | ⚫ Gray |
| **Strike** | Checkout | Impulse, small items | 🔴 Red |

### Anchor-and-Spokes Methodology

1. **Identify Anchors**: High-traffic destination products
2. **Position Strategically**: Place anchors to create natural flow
3. **Create Spokes**: Cluster complementary products around anchors
4. **Optimize Sight Lines**: Ensure clear visibility and navigation
5. **Validate Flow**: Test customer journey and adjust as needed

## 🔍 Compliance Validation

### VM Principles Checked
- Eye level optimization (premium placement)
- Sight line management (no obstructions)
- Cross-merchandising opportunities
- Category adjacencies
- Color coordination
- Price point flow

### Safety Requirements
- Minimum egress clearances (36" minimum)
- Weight distribution limits
- Fragile item height restrictions
- Emergency equipment access
- Structural load limits

### Regulatory Compliance
- ADA accessibility requirements
- Fire code compliance
- Local zoning ordinances
- Retail-specific regulations

## 📈 Performance Optimization

### Large Planogram Tips
- Use viewport culling for 100+ fixtures
- Enable spatial indexing for complex layouts
- Reduce visual detail at low zoom levels
- Batch operations for multiple changes
- Use progressive loading for large datasets

### Memory Management
- Clear cache regularly for large files
- Use level-of-detail rendering
- Optimize image assets
- Monitor performance metrics
- Enable adaptive quality settings

## 🔧 Troubleshooting

### Common Issues

**Plugin won't load**
- Check Obsidian version compatibility
- Verify plugin files are complete
- Check console for error messages
- Try disabling other plugins

**Performance issues**
- Reduce planogram complexity
- Enable performance optimizations
- Check available system memory
- Use simplified rendering mode

**Export problems**
- Verify PDF export permissions
- Check disk space availability
- Try different paper sizes
- Use alternative export formats

**Compliance errors**
- Review fixture dimensions
- Check clearance requirements
- Verify weight calculations
- Update constraint configurations

### Debug Mode

Enable debug mode for detailed logging:

```javascript
// In browser console
window.vmPlanogramDebug = true;
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Clone your fork
3. Install dependencies: `npm install`
4. Start development: `npm run dev`
5. Run tests: `npm run test`

### Code Standards

- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Comprehensive test coverage
- Accessibility compliance

## 📞 Support

- **Documentation**: [Full documentation](docs/)
- **Issues**: [GitHub Issues](https://github.com/your-org/vm-planogram-plugin/issues)
- **Discussions**: [Community Forum](https://github.com/your-org/vm-planogram-plugin/discussions)
- **Email**: support@yourcompany.com

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Obsidian team for the excellent plugin API
- Shop Reset Toolbox methodology contributors
- Visual merchandising industry professionals
- Accessibility testing community

---

**VM Planogram Plugin v2.0.0** - Professional retail planning for the modern age.