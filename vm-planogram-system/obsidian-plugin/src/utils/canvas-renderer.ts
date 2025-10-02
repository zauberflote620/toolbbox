/**
 * Enhanced Canvas Renderer - v2.0.0
 * Professional-grade rendering with precise measurements and compliance visualization
 */

import {
  Fixture,
  Product,
  Planogram,
  VMZone,
  ComplianceLevel,
  Point,
  EnhancedVMPlanogramSettings
} from '../types';

export interface RenderOptions {
  showGrid: boolean;
  showRulers: boolean;
  showCompliance: boolean;
  showMeasurements: boolean;
  scaleRatio: number;
  gridSize: number;
  snapToGrid: boolean;
  measurementUnit: string;
}

export class CanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private settings: EnhancedVMPlanogramSettings;
  private options: RenderOptions;
  private scale: number = 1;
  private offset: Point = { x: 0, y: 0 };
  private selectedFixtures: Set<string> = new Set();

  // VM Zone colors (professional retail standards)
  private vmZoneColors = {
    eye: '#10b981',      // Green - Eye level (best performance)
    reach: '#3b82f6',    // Blue - Reach zone (good performance)
    stretch: '#f59e0b',  // Amber - Stretch zone (premium placement)
    stoop: '#6b7280',    // Gray - Stoop zone (value items)
    strike: '#ef4444'    // Red - Strike zone (impulse items)
  };

  // Compliance colors
  private complianceColors = {
    compliant: '#10b981',
    warning: '#f59e0b',
    violation: '#ef4444'
  };

  constructor(canvas: HTMLCanvasElement, settings: EnhancedVMPlanogramSettings) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.settings = settings;

    this.options = {
      showGrid: settings.showGrid,
      showRulers: true,
      showCompliance: settings.showComplianceAlerts,
      showMeasurements: true,
      scaleRatio: settings.scaleRatio,
      gridSize: settings.gridSize || 12,
      snapToGrid: settings.snapToGrid,
      measurementUnit: settings.measurementUnit
    };

    this.setupCanvas();
    this.bindEvents();
  }

  private setupCanvas(): void {
    // Set canvas dimensions based on store size
    const storeWidth = this.settings.defaultStoreWidth;
    const storeHeight = this.settings.defaultStoreHeight;

    this.canvas.width = storeWidth * this.options.scaleRatio;
    this.canvas.height = storeHeight * this.options.scaleRatio;

    // Configure canvas for high-DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';

    this.ctx.scale(dpr, dpr);
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
  }

  private bindEvents(): void {
    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.canvas.addEventListener('wheel', this.handleWheel.bind(this));
    this.canvas.addEventListener('contextmenu', this.handleContextMenu.bind(this));
  }

  /**
   * Main render method - renders complete planogram
   */
  public render(planogram: Planogram): void {
    this.clearCanvas();

    if (this.options.showGrid) {
      this.renderGrid();
    }

    if (this.options.showRulers) {
      this.renderRulers();
    }

    // Render fixtures
    for (const fixture of planogram.layout.fixtures) {
      this.renderFixture(fixture);
    }

    // Render products
    for (const product of planogram.layout.products) {
      this.renderProduct(product, planogram.layout.fixtures);
    }

    // Render compliance overlays
    if (this.options.showCompliance) {
      this.renderComplianceOverlays(planogram);
    }

    // Render measurements
    if (this.options.showMeasurements) {
      this.renderMeasurements(planogram);
    }

    // Render selection indicators
    this.renderSelectionIndicators(planogram.layout.fixtures);
  }

  /**
   * Render precision grid with measurement accuracy
   */
  private renderGrid(): void {
    const gridSize = this.options.gridSize * this.options.scaleRatio;
    const width = this.canvas.width;
    const height = this.canvas.height;

    this.ctx.save();
    this.ctx.strokeStyle = 'rgba(100, 116, 139, 0.2)';
    this.ctx.lineWidth = 0.5;
    this.ctx.setLineDash([2, 2]);

    // Vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, height);
      this.ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(width, y);
      this.ctx.stroke();
    }

    this.ctx.restore();
  }

  /**
   * Render measurement rulers for precise layout
   */
  private renderRulers(): void {
    const rulerSize = 25;
    const unit = this.options.measurementUnit;
    const scale = this.options.scaleRatio;

    this.ctx.save();
    this.ctx.fillStyle = 'rgba(248, 250, 252, 0.95)';
    this.ctx.strokeStyle = 'rgba(100, 116, 139, 0.5)';
    this.ctx.lineWidth = 1;
    this.ctx.font = '10px -apple-system, BlinkMacSystemFont, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    // Horizontal ruler (top)
    this.ctx.fillRect(0, 0, this.canvas.width, rulerSize);
    this.ctx.strokeRect(0, 0, this.canvas.width, rulerSize);

    let interval = this.calculateRulerInterval(this.canvas.width, scale);
    for (let x = 0; x <= this.canvas.width; x += interval * scale) {
      const measurement = Math.round((x / scale) * 10) / 10;
      this.ctx.fillStyle = 'rgba(51, 65, 85, 0.8)';
      this.ctx.fillText(`${measurement}${unit}`, x, rulerSize / 2);

      // Tick marks
      this.ctx.strokeStyle = 'rgba(100, 116, 139, 0.7)';
      this.ctx.beginPath();
      this.ctx.moveTo(x, rulerSize - 5);
      this.ctx.lineTo(x, rulerSize);
      this.ctx.stroke();
    }

    // Vertical ruler (left)
    this.ctx.fillStyle = 'rgba(248, 250, 252, 0.95)';
    this.ctx.fillRect(0, rulerSize, rulerSize, this.canvas.height - rulerSize);
    this.ctx.strokeRect(0, rulerSize, rulerSize, this.canvas.height - rulerSize);

    for (let y = rulerSize; y <= this.canvas.height; y += interval * scale) {
      const measurement = Math.round(((y - rulerSize) / scale) * 10) / 10;

      this.ctx.save();
      this.ctx.translate(rulerSize / 2, y);
      this.ctx.rotate(-Math.PI / 2);
      this.ctx.fillStyle = 'rgba(51, 65, 85, 0.8)';
      this.ctx.fillText(`${measurement}${unit}`, 0, 0);
      this.ctx.restore();

      // Tick marks
      this.ctx.strokeStyle = 'rgba(100, 116, 139, 0.7)';
      this.ctx.beginPath();
      this.ctx.moveTo(rulerSize - 5, y);
      this.ctx.lineTo(rulerSize, y);
      this.ctx.stroke();
    }

    this.ctx.restore();
  }

  /**
   * Render fixture with VM zone color coding and precise dimensions
   */
  private renderFixture(fixture: Fixture): void {
    const x = fixture.position.x * this.options.scaleRatio;
    const y = fixture.position.y * this.options.scaleRatio;
    const width = fixture.dimensions.width * this.options.scaleRatio;
    const height = fixture.dimensions.depth * this.options.scaleRatio;

    this.ctx.save();

    // Apply rotation if needed
    if (fixture.rotation !== 0) {
      this.ctx.translate(x + width / 2, y + height / 2);
      this.ctx.rotate((fixture.rotation * Math.PI) / 180);
      this.ctx.translate(-width / 2, -height / 2);
    }

    // Draw fixture background with VM zone color
    const zoneColor = this.vmZoneColors[fixture.vmZone] || '#e5e7eb';
    this.ctx.fillStyle = zoneColor + '20'; // 20% opacity
    this.ctx.fillRect(fixture.rotation === 0 ? x : -width / 2, fixture.rotation === 0 ? y : -height / 2, width, height);

    // Draw fixture border
    this.ctx.strokeStyle = fixture.color || zoneColor;
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(fixture.rotation === 0 ? x : -width / 2, fixture.rotation === 0 ? y : -height / 2, width, height);

    // Draw fixture type indicator
    this.drawFixtureTypeIndicator(fixture, width, height);

    // Draw fixture label
    this.ctx.fillStyle = 'rgba(17, 24, 39, 0.8)';
    this.ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    const labelX = fixture.rotation === 0 ? x + width / 2 : 0;
    const labelY = fixture.rotation === 0 ? y + height / 2 : 0;
    this.ctx.fillText(fixture.name || fixture.type, labelX, labelY);

    // Draw VM zone indicator
    this.drawVMZoneIndicator(fixture, width, height);

    // Draw compliance indicator
    if (this.options.showCompliance) {
      this.drawComplianceIndicator(fixture, width, height);
    }

    this.ctx.restore();
  }

  /**
   * Render product placement with cross-merchandising indicators
   */
  private renderProduct(product: Product, fixtures: Fixture[]): void {
    const fixture = fixtures.find(f => f.id === product.placement.fixtureId);
    if (!fixture) return;

    const baseX = fixture.position.x * this.options.scaleRatio;
    const baseY = fixture.position.y * this.options.scaleRatio;
    const fixtureWidth = fixture.dimensions.width * this.options.scaleRatio;
    const fixtureHeight = fixture.dimensions.depth * this.options.scaleRatio;

    // Calculate product position within fixture
    const productWidth = Math.min(fixtureWidth / 4, 20);
    const productHeight = 12;
    const x = baseX + (product.placement.position * productWidth);
    const y = baseY + (product.placement.shelfLevel * 15);

    this.ctx.save();

    // Product role color coding
    let roleColor = '#6b7280';
    switch (product.role) {
      case 'anchor':
        roleColor = '#dc2626'; // Red for anchors
        break;
      case 'spoke':
        roleColor = '#059669'; // Green for spokes
        break;
      case 'promotional':
        roleColor = '#7c3aed'; // Purple for promotional
        break;
    }

    // Draw product rectangle
    this.ctx.fillStyle = roleColor + '80'; // 50% opacity
    this.ctx.fillRect(x, y, productWidth, productHeight);
    this.ctx.strokeStyle = roleColor;
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(x, y, productWidth, productHeight);

    // Draw facings indicators
    for (let i = 0; i < product.placement.facings; i++) {
      const facingX = x + (i * 2);
      this.ctx.strokeStyle = roleColor;
      this.ctx.beginPath();
      this.ctx.moveTo(facingX, y);
      this.ctx.lineTo(facingX, y + productHeight);
      this.ctx.stroke();
    }

    // Draw product SKU if space allows
    if (productWidth > 30) {
      this.ctx.fillStyle = 'white';
      this.ctx.font = '8px monospace';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(product.sku.substring(0, 6), x + productWidth / 2, y + productHeight / 2);
    }

    this.ctx.restore();
  }

  /**
   * Render compliance overlays for violations and warnings
   */
  private renderComplianceOverlays(planogram: Planogram): void {
    for (const violation of planogram.compliance.violations) {
      this.renderComplianceViolation(violation, planogram.layout.fixtures);
    }

    for (const warning of planogram.compliance.warnings) {
      this.renderComplianceWarning(warning, planogram.layout.fixtures);
    }
  }

  /**
   * Render measurement annotations and dimensions
   */
  private renderMeasurements(planogram: Planogram): void {
    for (const fixture of planogram.layout.fixtures) {
      if (this.selectedFixtures.has(fixture.id)) {
        this.renderFixtureMeasurements(fixture);
      }
    }
  }

  /**
   * Render selection indicators for selected fixtures
   */
  private renderSelectionIndicators(fixtures: Fixture[]): void {
    for (const fixture of fixtures) {
      if (this.selectedFixtures.has(fixture.id)) {
        this.renderSelectionIndicator(fixture);
      }
    }
  }

  // === Utility Methods ===

  private calculateRulerInterval(dimension: number, scale: number): number {
    const totalUnits = dimension / scale;
    if (totalUnits <= 10) return 1;
    if (totalUnits <= 50) return 5;
    if (totalUnits <= 100) return 10;
    return 20;
  }

  private drawFixtureTypeIndicator(fixture: Fixture, width: number, height: number): void {
    const iconSize = 16;
    const iconX = (fixture.rotation === 0 ? 0 : -width / 2) + 5;
    const iconY = (fixture.rotation === 0 ? 0 : -height / 2) + 5;

    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    this.ctx.fillRect(iconX, iconY, iconSize, iconSize);
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    this.ctx.strokeRect(iconX, iconY, iconSize, iconSize);

    // Draw type-specific icon
    this.ctx.fillStyle = 'rgba(17, 24, 39, 0.8)';
    this.ctx.font = '10px -apple-system, BlinkMacSystemFont, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    const iconText = this.getFixtureIcon(fixture.type);
    this.ctx.fillText(iconText, iconX + iconSize / 2, iconY + iconSize / 2);
  }

  private drawVMZoneIndicator(fixture: Fixture, width: number, height: number): void {
    const zoneSize = 8;
    const zoneX = (fixture.rotation === 0 ? 0 : -width / 2) + width - zoneSize - 2;
    const zoneY = (fixture.rotation === 0 ? 0 : -height / 2) + 2;

    this.ctx.fillStyle = this.vmZoneColors[fixture.vmZone];
    this.ctx.fillRect(zoneX, zoneY, zoneSize, zoneSize);
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(zoneX, zoneY, zoneSize, zoneSize);
  }

  private drawComplianceIndicator(fixture: Fixture, width: number, height: number): void {
    if (fixture.complianceStatus === 'compliant') return;

    const indicatorSize = 12;
    const indicatorX = (fixture.rotation === 0 ? 0 : -width / 2) + width - indicatorSize - 2;
    const indicatorY = (fixture.rotation === 0 ? 0 : -height / 2) + height - indicatorSize - 2;

    const color = this.complianceColors[fixture.complianceStatus];

    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(indicatorX + indicatorSize / 2, indicatorY + indicatorSize / 2, indicatorSize / 2, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = 'white';
    this.ctx.font = '8px -apple-system, BlinkMacSystemFont, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('!', indicatorX + indicatorSize / 2, indicatorY + indicatorSize / 2);
  }

  private getFixtureIcon(type: string): string {
    const icons = {
      gondola: 'G',
      endcap: 'E',
      wall: 'W',
      table: 'T',
      rack: 'R',
      tower: 'O'
    };
    return icons[type] || '?';
  }

  private clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // === Event Handlers ===

  private handleMouseDown(event: MouseEvent): void {
    // Mouse handling implementation
  }

  private handleMouseMove(event: MouseEvent): void {
    // Mouse movement handling implementation
  }

  private handleMouseUp(event: MouseEvent): void {
    // Mouse up handling implementation
  }

  private handleWheel(event: WheelEvent): void {
    // Zoom handling implementation
    event.preventDefault();
  }

  private handleContextMenu(event: MouseEvent): void {
    event.preventDefault();
    // Context menu implementation
  }

  // === Public API ===

  public updateOptions(options: Partial<RenderOptions>): void {
    this.options = { ...this.options, ...options };
  }

  public selectFixture(fixtureId: string): void {
    this.selectedFixtures.add(fixtureId);
  }

  public deselectFixture(fixtureId: string): void {
    this.selectedFixtures.delete(fixtureId);
  }

  public clearSelection(): void {
    this.selectedFixtures.clear();
  }

  public exportAsImage(): string {
    return this.canvas.toDataURL('image/png');
  }

  public getCanvasCoordinates(clientX: number, clientY: number): Point {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left) / this.options.scaleRatio,
      y: (clientY - rect.top) / this.options.scaleRatio
    };
  }
}