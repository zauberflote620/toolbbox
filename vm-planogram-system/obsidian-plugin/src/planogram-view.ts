/**
 * Enhanced Planogram View - v2.0.0
 * Professional VM Planogram interface with Shop Reset integration
 */

import { ItemView, WorkspaceLeaf, Notice } from 'obsidian';
import { CanvasRenderer } from './utils/canvas-renderer';
import { EditorController } from './utils/editor-controller';
import { DataManager } from './utils/data-manager';
import { EnhancedVMPlanogramSettings } from './settings';
import { Planogram, Store, Fixture } from './types';

export const VIEW_TYPE_PLANOGRAM = "planogram-view";

export class PlanogramView extends ItemView {
  private dataManager: DataManager;
  private settings: EnhancedVMPlanogramSettings;
  private renderer?: CanvasRenderer;
  private editor?: EditorController;
  private currentPlanogram?: Planogram;
  private currentStore?: Store;

  // UI Elements
  private canvas?: HTMLCanvasElement;
  private toolbar?: HTMLElement;
  private propertiesPanel?: HTMLElement;
  private statusBar?: HTMLElement;

  constructor(leaf: WorkspaceLeaf, dataManager: DataManager, settings: EnhancedVMPlanogramSettings) {
    super(leaf);
    this.dataManager = dataManager;
    this.settings = settings;
  }

  getViewType(): string {
    return VIEW_TYPE_PLANOGRAM;
  }

  getDisplayText(): string {
    return "VM Planogram Enhanced";
  }

  getIcon(): string {
    return "layout-grid";
  }

  async onOpen() {
    try {
      await this.loadEnhancedHTML();
      await this.initializeComponents();
      await this.setupEventHandlers();
      await this.loadDefaultContent();

      // Auto-load Shop Reset configuration if enabled
      if (this.settings.shopResetIntegration && this.settings.autoLoadShopResetFiles) {
        await this.loadShopResetConfiguration();
      }

      new Notice('VM Planogram Enhanced ready');
    } catch (error) {
      console.error('Error initializing VM Planogram view:', error);
      new Notice('Error initializing VM Planogram view');
    }
  }

  async onClose() {
    // Cleanup resources
    if (this.editor) {
      // Save current work if auto-save is enabled
      if (this.settings.autoSave && this.currentPlanogram) {
        await this.savePlanogram();
      }
    }
  }

  private async loadEnhancedHTML(): Promise<void> {
    // In a real implementation, this would load the enhanced HTML template
    // For now, we'll create a basic structure and enhance it
    const container = this.containerEl.children[1];
    container.empty();
    container.addClass('vm-planogram-view');

    // Create main layout
    const mainContainer = container.createEl('div', { cls: 'vm-planogram-container' });

    // Header with title and actions
    const header = mainContainer.createEl('div', { cls: 'vm-planogram-header' });
    header.createEl('h1', { text: 'Enhanced VM Planogram Canvas', cls: 'vm-planogram-title' });

    const headerActions = header.createEl('div', { cls: 'vm-planogram-header-actions' });
    headerActions.createEl('button', { text: 'New Store', cls: 'mod-cta' });
    headerActions.createEl('button', { text: 'New Planogram' });
    headerActions.createEl('button', { text: 'Settings' });

    // Toolbar
    this.toolbar = mainContainer.createEl('div', { cls: 'vm-planogram-toolbar' });
    this.createToolbar();

    // Canvas container
    const canvasContainer = mainContainer.createEl('div', { cls: 'vm-planogram-canvas-container' });
    this.canvas = canvasContainer.createEl('canvas', { cls: 'vm-planogram-canvas' });

    // Properties panel
    this.propertiesPanel = mainContainer.createEl('div', { cls: 'vm-planogram-properties' });
    this.createPropertiesPanel();

    // Status bar
    this.statusBar = mainContainer.createEl('div', { cls: 'vm-planogram-status' });
    this.createStatusBar();

    // Apply styles
    this.applyStyles();
  }

  private createToolbar(): void {
    if (!this.toolbar) return;

    // Mode buttons
    const modeSection = this.toolbar.createEl('div', { cls: 'toolbar-section' });
    modeSection.createEl('button', { text: 'Select', cls: 'mode-button active', attr: { 'data-mode': 'select' } });
    modeSection.createEl('button', { text: 'Add Fixture', cls: 'mode-button', attr: { 'data-mode': 'add_fixture' } });
    modeSection.createEl('button', { text: 'Measure', cls: 'mode-button', attr: { 'data-mode': 'measure' } });

    // View controls
    const viewSection = this.toolbar.createEl('div', { cls: 'toolbar-section' });
    viewSection.createEl('button', { text: 'Grid', cls: 'toggle-button', attr: { 'data-toggle': 'grid' } });
    viewSection.createEl('button', { text: 'Snap', cls: 'toggle-button', attr: { 'data-toggle': 'snap' } });
    viewSection.createEl('button', { text: 'Rulers', cls: 'toggle-button', attr: { 'data-toggle': 'rulers' } });

    // Fixture controls
    const fixtureSection = this.toolbar.createEl('div', { cls: 'toolbar-section' });
    const fixtureSelect = fixtureSection.createEl('select', { cls: 'fixture-type-select' });
    ['gondola', 'endcap', 'wall', 'table', 'rack', 'tower'].forEach(type => {
      fixtureSelect.createEl('option', { value: type, text: type.charAt(0).toUpperCase() + type.slice(1) });
    });

    // Compliance and export
    const actionSection = this.toolbar.createEl('div', { cls: 'toolbar-section' });
    actionSection.createEl('button', { text: 'Validate', cls: 'action-button', attr: { 'data-action': 'validate' } });
    actionSection.createEl('button', { text: 'Export PDF', cls: 'action-button', attr: { 'data-action': 'export_pdf' } });
  }

  private createPropertiesPanel(): void {
    if (!this.propertiesPanel) return;

    this.propertiesPanel.style.display = 'none';
    this.propertiesPanel.createEl('h4', { text: 'Fixture Properties' });

    const form = this.propertiesPanel.createEl('div', { cls: 'properties-form' });

    // Basic properties
    this.createPropertyField(form, 'Name', 'text', 'fixture-name');
    this.createPropertyField(form, 'Type', 'select', 'fixture-type', ['gondola', 'endcap', 'wall', 'table', 'rack', 'tower']);
    this.createPropertyField(form, 'Section', 'select', 'fixture-section', ['entrance', 'main', 'back', 'pos']);

    // Dimensions
    const dimensionsGroup = form.createEl('div', { cls: 'property-group' });
    dimensionsGroup.createEl('h5', { text: 'Dimensions' });
    this.createPropertyField(dimensionsGroup, 'Width (ft)', 'number', 'fixture-width');
    this.createPropertyField(dimensionsGroup, 'Depth (ft)', 'number', 'fixture-depth');
    this.createPropertyField(dimensionsGroup, 'Height (in)', 'number', 'fixture-height');

    // VM Zone
    this.createPropertyField(form, 'VM Zone', 'select', 'vm-zone', ['eye', 'reach', 'stretch', 'stoop']);

    // Action buttons
    const actions = form.createEl('div', { cls: 'property-actions' });
    actions.createEl('button', { text: 'Apply', cls: 'mod-cta', attr: { 'data-action': 'apply_properties' } });
    actions.createEl('button', { text: 'Delete', cls: 'mod-warning', attr: { 'data-action': 'delete_fixture' } });
    actions.createEl('button', { text: 'Duplicate', attr: { 'data-action': 'duplicate_fixture' } });
  }

  private createPropertyField(
    container: HTMLElement,
    label: string,
    type: string,
    id: string,
    options?: string[]
  ): void {
    const field = container.createEl('div', { cls: 'property-field' });
    field.createEl('label', { text: label, attr: { for: id } });

    if (type === 'select' && options) {
      const select = field.createEl('select', { attr: { id } });
      options.forEach(option => {
        select.createEl('option', { value: option, text: option.charAt(0).toUpperCase() + option.slice(1) });
      });
    } else {
      field.createEl('input', { type, attr: { id } });
    }
  }

  private createStatusBar(): void {
    if (!this.statusBar) return;

    const leftStatus = this.statusBar.createEl('div', { cls: 'status-left' });
    leftStatus.createEl('span', { text: 'Mode: Select', cls: 'status-mode' });
    leftStatus.createEl('span', { text: 'Fixtures: 0', cls: 'status-fixtures' });
    leftStatus.createEl('span', { text: 'Selected: None', cls: 'status-selected' });

    const rightStatus = this.statusBar.createEl('div', { cls: 'status-right' });
    rightStatus.createEl('span', { text: 'Scale: 1:12', cls: 'status-scale' });
    rightStatus.createEl('span', { text: 'Compliant', cls: 'status-compliance' });
  }

  private async initializeComponents(): Promise<void> {
    if (!this.canvas) throw new Error('Canvas not initialized');

    // Initialize renderer
    this.renderer = new CanvasRenderer(this.canvas, this.settings);

    // Initialize editor controller
    this.editor = new EditorController(this.renderer, this.dataManager, this.settings);

    // Set up editor event listeners
    this.editor.addEventListener('fixture_added', this.onFixtureAdded.bind(this));
    this.editor.addEventListener('fixture_removed', this.onFixtureRemoved.bind(this));
    this.editor.addEventListener('selection_changed', this.onSelectionChanged.bind(this));
    this.editor.addEventListener('show_fixture_properties', this.onShowFixtureProperties.bind(this));
    this.editor.addEventListener('hide_fixture_properties', this.onHideFixtureProperties.bind(this));
  }

  private async setupEventHandlers(): Promise<void> {
    // Toolbar event delegation
    this.toolbar?.addEventListener('click', this.handleToolbarClick.bind(this));

    // Properties panel event delegation
    this.propertiesPanel?.addEventListener('click', this.handlePropertiesClick.bind(this));
    this.propertiesPanel?.addEventListener('change', this.handlePropertiesChange.bind(this));

    // Canvas events (handled by editor controller)
    this.canvas?.addEventListener('click', this.handleCanvasClick.bind(this));
    this.canvas?.addEventListener('mousedown', this.handleCanvasMouseDown.bind(this));
    this.canvas?.addEventListener('mousemove', this.handleCanvasMouseMove.bind(this));
    this.canvas?.addEventListener('contextmenu', this.handleCanvasContextMenu.bind(this));
  }

  private async loadDefaultContent(): Promise<void> {
    try {
      // Load or create default store
      const stores = await this.dataManager.loadStores();
      if (stores.length > 0) {
        this.currentStore = stores[0];
      } else {
        this.currentStore = await this.dataManager.createStore(
          'Default Store',
          {
            width: this.settings.defaultStoreWidth,
            height: this.settings.defaultStoreHeight,
            ceilingHeight: 10
          }
        );
      }

      // Create default planogram
      this.currentPlanogram = await this.dataManager.createPlanogram(
        this.currentStore.id,
        'Default Planogram'
      );

      // Set planogram in editor
      this.editor?.setPlanogram(this.currentPlanogram);

      this.updateStatusBar();
    } catch (error) {
      console.error('Error loading default content:', error);
      new Notice('Error loading default content');
    }
  }

  private async loadShopResetConfiguration(): Promise<void> {
    try {
      const config = await this.dataManager.loadShopResetConfigFromVault();

      if (config.constraints || config.config) {
        if (this.currentStore && config.constraints) {
          await this.dataManager.updateStore(this.currentStore.id, {
            constraints: config.constraints
          });
        }

        if (this.currentStore && config.config) {
          await this.dataManager.updateStore(this.currentStore.id, {
            config: config.config
          });
        }

        new Notice('Shop Reset configuration loaded');
      }
    } catch (error) {
      console.error('Error loading Shop Reset configuration:', error);
    }
  }

  // === Event Handlers ===

  private handleToolbarClick(event: Event): void {
    const target = event.target as HTMLElement;
    const button = target.closest('button');
    if (!button) return;

    const mode = button.getAttribute('data-mode');
    const toggle = button.getAttribute('data-toggle');
    const action = button.getAttribute('data-action');

    if (mode) {
      this.setMode(mode);
      this.updateModeButtons(mode);
    } else if (toggle) {
      this.handleToggle(toggle, button);
    } else if (action) {
      this.handleAction(action);
    }
  }

  private handlePropertiesClick(event: Event): void {
    const target = event.target as HTMLElement;
    const button = target.closest('button');
    if (!button) return;

    const action = button.getAttribute('data-action');
    if (action) {
      this.handlePropertiesAction(action);
    }
  }

  private handlePropertiesChange(event: Event): void {
    // Handle property changes
    if (this.settings.autoSave) {
      this.applyPropertiesChanges();
    }
  }

  private handleCanvasClick(event: MouseEvent): void {
    const rect = this.canvas!.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Convert to planogram coordinates
    const planogramCoords = this.renderer!.getCanvasCoordinates(x, y);

    if (this.editor?.mode === 'add_fixture') {
      const fixtureSelect = this.toolbar?.querySelector('.fixture-type-select') as HTMLSelectElement;
      const fixtureType = fixtureSelect?.value || 'gondola';
      this.editor.addFixture(fixtureType as any, planogramCoords);
    }
  }

  private handleCanvasMouseDown(event: MouseEvent): void {
    // Handled by editor controller
  }

  private handleCanvasMouseMove(event: MouseEvent): void {
    // Update mouse position in status bar
    const rect = this.canvas!.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const coords = this.renderer!.getCanvasCoordinates(x, y);

    const mouseStatus = this.statusBar?.querySelector('.status-mouse') as HTMLElement;
    if (mouseStatus) {
      mouseStatus.textContent = `${Math.round(coords.x)}, ${Math.round(coords.y)}`;
    }
  }

  private handleCanvasContextMenu(event: MouseEvent): void {
    event.preventDefault();
    // Show context menu
  }

  // === Action Handlers ===

  private setMode(mode: string): void {
    this.editor?.setMode(mode as any);
  }

  private handleToggle(toggle: string, button: HTMLElement): void {
    const isActive = button.classList.contains('active');

    switch (toggle) {
      case 'grid':
        this.renderer?.updateOptions({ showGrid: !isActive });
        break;
      case 'snap':
        this.settings.snapToGrid = !isActive;
        break;
      case 'rulers':
        this.renderer?.updateOptions({ showRulers: !isActive });
        break;
    }

    button.classList.toggle('active');
    this.rerenderPlanogram();
  }

  private async handleAction(action: string): Promise<void> {
    switch (action) {
      case 'validate':
        await this.validateCompliance();
        break;
      case 'export_pdf':
        await this.exportToPDF();
        break;
    }
  }

  private handlePropertiesAction(action: string): void {
    switch (action) {
      case 'apply_properties':
        this.applyPropertiesChanges();
        break;
      case 'delete_fixture':
        this.deleteSelectedFixture();
        break;
      case 'duplicate_fixture':
        this.editor?.duplicateSelected();
        break;
    }
  }

  // === Editor Event Handlers ===

  private onFixtureAdded(data: { fixture: Fixture }): void {
    this.updateStatusBar();
  }

  private onFixtureRemoved(data: { fixtureId: string }): void {
    this.updateStatusBar();
  }

  private onSelectionChanged(data: { selectedFixtures: string[] }): void {
    const count = data.selectedFixtures.length;
    const selectedStatus = this.statusBar?.querySelector('.status-selected') as HTMLElement;
    if (selectedStatus) {
      selectedStatus.textContent = count === 0 ? 'Selected: None' : `Selected: ${count}`;
    }
  }

  private onShowFixtureProperties(data: { fixture: Fixture }): void {
    this.showPropertiesPanel(data.fixture);
  }

  private onHideFixtureProperties(): void {
    this.hidePropertiesPanel();
  }

  // === UI Updates ===

  private updateModeButtons(activeMode: string): void {
    const modeButtons = this.toolbar?.querySelectorAll('.mode-button');
    modeButtons?.forEach(button => {
      const mode = button.getAttribute('data-mode');
      button.classList.toggle('active', mode === activeMode);
    });

    const modeStatus = this.statusBar?.querySelector('.status-mode') as HTMLElement;
    if (modeStatus) {
      modeStatus.textContent = `Mode: ${activeMode.charAt(0).toUpperCase() + activeMode.slice(1)}`;
    }
  }

  private updateStatusBar(): void {
    if (!this.currentPlanogram) return;

    const fixtureCount = this.currentPlanogram.layout.fixtures.length;
    const fixturesStatus = this.statusBar?.querySelector('.status-fixtures') as HTMLElement;
    if (fixturesStatus) {
      fixturesStatus.textContent = `Fixtures: ${fixtureCount}`;
    }

    const complianceScore = this.currentPlanogram.compliance.score;
    const complianceStatus = this.statusBar?.querySelector('.status-compliance') as HTMLElement;
    if (complianceStatus) {
      complianceStatus.textContent = complianceScore >= 95 ? 'Compliant' : `${complianceScore}% Compliant`;
      complianceStatus.className = complianceScore >= 95 ? 'status-compliance compliant' : 'status-compliance warning';
    }
  }

  private showPropertiesPanel(fixture: Fixture): void {
    if (!this.propertiesPanel) return;

    this.propertiesPanel.style.display = 'block';

    // Populate fields
    this.setFieldValue('fixture-name', fixture.name);
    this.setFieldValue('fixture-type', fixture.type);
    this.setFieldValue('fixture-width', fixture.dimensions.width.toString());
    this.setFieldValue('fixture-depth', fixture.dimensions.depth.toString());
    this.setFieldValue('fixture-height', fixture.dimensions.height.toString());
    this.setFieldValue('vm-zone', fixture.vmZone);
  }

  private hidePropertiesPanel(): void {
    if (this.propertiesPanel) {
      this.propertiesPanel.style.display = 'none';
    }
  }

  private setFieldValue(id: string, value: string): void {
    const field = this.propertiesPanel?.querySelector(`#${id}`) as HTMLInputElement | HTMLSelectElement;
    if (field) {
      field.value = value;
    }
  }

  private getFieldValue(id: string): string {
    const field = this.propertiesPanel?.querySelector(`#${id}`) as HTMLInputElement | HTMLSelectElement;
    return field?.value || '';
  }

  private applyPropertiesChanges(): void {
    // Implementation for applying property changes
    // This would update the selected fixture with new values
  }

  private deleteSelectedFixture(): void {
    this.editor?.deleteSelected();
  }

  private rerenderPlanogram(): void {
    if (this.currentPlanogram) {
      this.renderer?.render(this.currentPlanogram);
    }
  }

  private async validateCompliance(): Promise<void> {
    if (!this.currentPlanogram) return;

    try {
      const validation = await this.dataManager.validateCompliance(this.currentPlanogram);

      if (validation.isValid) {
        new Notice('Planogram is compliant!');
      } else {
        new Notice(`Compliance issues found: ${validation.errors.length} errors, ${validation.warnings.length} warnings`);
      }

      this.updateStatusBar();
      this.rerenderPlanogram();
    } catch (error) {
      new Notice('Error validating compliance');
    }
  }

  private async exportToPDF(): Promise<void> {
    if (!this.currentPlanogram) return;

    try {
      // PDF export implementation would go here
      new Notice('PDF export feature coming soon');
    } catch (error) {
      new Notice('Error exporting to PDF');
    }
  }

  private async savePlanogram(): Promise<void> {
    if (!this.currentPlanogram) return;

    try {
      // Save implementation would go here
      new Notice('Planogram saved');
    } catch (error) {
      new Notice('Error saving planogram');
    }
  }

  private applyStyles(): void {
    // Apply comprehensive CSS styles for the plugin
    const style = document.createElement('style');
    style.textContent = `
      .vm-planogram-view {
        height: 100%;
        display: flex;
        flex-direction: column;
        font-family: var(--font-interface);
      }

      .vm-planogram-container {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .vm-planogram-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        border-bottom: 1px solid var(--background-modifier-border);
      }

      .vm-planogram-title {
        margin: 0;
        font-size: 18px;
        color: var(--text-accent);
      }

      .vm-planogram-header-actions {
        display: flex;
        gap: 8px;
      }

      .vm-planogram-toolbar {
        display: flex;
        gap: 10px;
        padding: 10px;
        background: var(--background-secondary);
        border-bottom: 1px solid var(--background-modifier-border);
        flex-wrap: wrap;
      }

      .toolbar-section {
        display: flex;
        gap: 5px;
        align-items: center;
        padding: 0 10px;
        border-right: 1px solid var(--background-modifier-border);
      }

      .toolbar-section:last-child {
        border-right: none;
      }

      .mode-button, .toggle-button, .action-button {
        padding: 5px 10px;
        border: 1px solid var(--background-modifier-border);
        background: var(--background-primary);
        color: var(--text-normal);
        cursor: pointer;
        border-radius: 3px;
        font-size: 12px;
      }

      .mode-button.active, .toggle-button.active {
        background: var(--interactive-accent);
        color: white;
      }

      .vm-planogram-canvas-container {
        flex: 1;
        position: relative;
        overflow: auto;
        background: var(--background-primary);
      }

      .vm-planogram-canvas {
        border: 1px solid var(--background-modifier-border);
        cursor: crosshair;
      }

      .vm-planogram-properties {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 250px;
        background: var(--background-primary);
        border: 1px solid var(--background-modifier-border);
        border-radius: 6px;
        padding: 15px;
        box-shadow: var(--shadow-s);
        z-index: 100;
      }

      .properties-form {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .property-field {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .property-field label {
        font-size: 12px;
        font-weight: 500;
        color: var(--text-muted);
      }

      .property-field input, .property-field select {
        padding: 4px 6px;
        border: 1px solid var(--background-modifier-border);
        border-radius: 3px;
        background: var(--background-primary);
        color: var(--text-normal);
      }

      .property-group {
        border-top: 1px solid var(--background-modifier-border);
        padding-top: 10px;
        margin-top: 10px;
      }

      .property-group h5 {
        margin: 0 0 8px 0;
        font-size: 13px;
        color: var(--text-accent);
      }

      .property-actions {
        display: flex;
        gap: 5px;
        margin-top: 15px;
        padding-top: 10px;
        border-top: 1px solid var(--background-modifier-border);
      }

      .vm-planogram-status {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 10px;
        background: var(--background-secondary);
        border-top: 1px solid var(--background-modifier-border);
        font-size: 12px;
        color: var(--text-muted);
      }

      .status-left, .status-right {
        display: flex;
        gap: 15px;
        align-items: center;
      }

      .status-compliance.compliant {
        color: var(--color-green);
      }

      .status-compliance.warning {
        color: var(--color-orange);
      }
    `;

    document.head.appendChild(style);
  }
}