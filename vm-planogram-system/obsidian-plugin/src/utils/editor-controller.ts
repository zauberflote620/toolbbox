/**
 * Enhanced Editor Controller - v2.0.0
 * Advanced editing capabilities with Obsidian workflow integration
 */

import { Notice } from 'obsidian';
import {
  Fixture,
  Product,
  Planogram,
  Point,
  UndoableAction,
  PlanogramEvent,
  EnhancedVMPlanogramSettings,
  VMZone,
  FixtureType
} from '../types';
import { CanvasRenderer } from './canvas-renderer';
import { DataManager } from './data-manager';

export type EditorMode = 'select' | 'add_fixture' | 'measure' | 'pan' | 'zoom';

export interface DragState {
  isDragging: boolean;
  dragStart: Point;
  dragCurrent: Point;
  dragTarget?: Fixture;
  multiSelect: boolean;
}

export interface SelectionState {
  selectedFixtures: Set<string>;
  selectionBounds?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export class EditorController {
  private renderer: CanvasRenderer;
  private dataManager: DataManager;
  private settings: EnhancedVMPlanogramSettings;
  private currentPlanogram?: Planogram;

  // Editor state
  private mode: EditorMode = 'select';
  private dragState: DragState = {
    isDragging: false,
    dragStart: { x: 0, y: 0 },
    dragCurrent: { x: 0, y: 0 },
    multiSelect: false
  };
  private selectionState: SelectionState = {
    selectedFixtures: new Set()
  };

  // Undo/Redo system
  private undoStack: UndoableAction[] = [];
  private redoStack: UndoableAction[] = [];
  private maxUndoStackSize = 50;

  // Event callbacks
  private eventCallbacks: Map<string, Function[]> = new Map();

  // Keyboard shortcuts
  private keyboardShortcuts = new Map([
    ['KeyS', () => this.savePlanogram()],
    ['KeyZ', () => this.undo()],
    ['KeyY', () => this.redo()],
    ['KeyA', () => this.selectAll()],
    ['Delete', () => this.deleteSelected()],
    ['Escape', () => this.clearSelection()],
    ['KeyC', () => this.copySelected()],
    ['KeyV', () => this.pasteSelected()],
    ['KeyD', () => this.duplicateSelected()]
  ]);

  constructor(
    renderer: CanvasRenderer,
    dataManager: DataManager,
    settings: EnhancedVMPlanogramSettings
  ) {
    this.renderer = renderer;
    this.dataManager = dataManager;
    this.settings = settings;

    this.setupEventListeners();
  }

  // === Public API ===

  public setMode(mode: EditorMode): void {
    this.mode = mode;
    this.clearSelection();
    this.updateCursor();
    this.emitEvent('mode_changed', { mode });
  }

  public setPlanogram(planogram: Planogram): void {
    this.currentPlanogram = planogram;
    this.clearSelection();
    this.clearUndoHistory();
    this.renderer.render(planogram);
  }

  public addFixture(type: FixtureType, position: Point): void {
    if (!this.currentPlanogram) return;

    const fixture: Fixture = {
      id: this.generateId(),
      name: `${type} ${this.currentPlanogram.layout.fixtures.length + 1}`,
      type,
      position: this.snapToGrid(position),
      dimensions: this.getDefaultFixtureDimensions(type),
      rotation: 0,
      vmZone: this.determineVMZone(position),
      capacity: { units: 50, weight: 1000 },
      color: this.getDefaultFixtureColor(type),
      complianceStatus: 'compliant',
      complianceIssues: []
    };

    const action: UndoableAction = {
      id: this.generateId(),
      type: 'add_fixture',
      description: `Add ${type} fixture`,
      undo: () => this.removeFixture(fixture.id),
      redo: () => this.addFixtureToLayout(fixture),
      timestamp: new Date()
    };

    this.executeAction(action);
    this.selectFixture(fixture.id);
    this.emitEvent('fixture_added', { fixture });
  }

  public removeFixture(fixtureId: string): void {
    if (!this.currentPlanogram) return;

    const fixture = this.currentPlanogram.layout.fixtures.find(f => f.id === fixtureId);
    if (!fixture) return;

    const action: UndoableAction = {
      id: this.generateId(),
      type: 'remove_fixture',
      description: `Remove ${fixture.type} fixture`,
      undo: () => this.addFixtureToLayout(fixture),
      redo: () => this.removeFixtureFromLayout(fixtureId),
      timestamp: new Date()
    };

    this.executeAction(action);
    this.deselectFixture(fixtureId);
    this.emitEvent('fixture_removed', { fixtureId });
  }

  public moveFixture(fixtureId: string, newPosition: Point): void {
    if (!this.currentPlanogram) return;

    const fixture = this.currentPlanogram.layout.fixtures.find(f => f.id === fixtureId);
    if (!fixture) return;

    const oldPosition = { ...fixture.position };
    const snappedPosition = this.snapToGrid(newPosition);

    const action: UndoableAction = {
      id: this.generateId(),
      type: 'move_fixture',
      description: `Move ${fixture.type} fixture`,
      undo: () => this.updateFixturePosition(fixtureId, oldPosition),
      redo: () => this.updateFixturePosition(fixtureId, snappedPosition),
      timestamp: new Date()
    };

    this.executeAction(action);
    this.emitEvent('fixture_moved', { fixtureId, oldPosition, newPosition: snappedPosition });
  }

  public selectFixture(fixtureId: string, multiSelect: boolean = false): void {
    if (!multiSelect) {
      this.selectionState.selectedFixtures.clear();
    }

    this.selectionState.selectedFixtures.add(fixtureId);
    this.renderer.selectFixture(fixtureId);
    this.updateSelectionBounds();
    this.emitEvent('selection_changed', { selectedFixtures: Array.from(this.selectionState.selectedFixtures) });
    this.showFixtureProperties(fixtureId);
  }

  public deselectFixture(fixtureId: string): void {
    this.selectionState.selectedFixtures.delete(fixtureId);
    this.renderer.deselectFixture(fixtureId);
    this.updateSelectionBounds();
    this.emitEvent('selection_changed', { selectedFixtures: Array.from(this.selectionState.selectedFixtures) });
  }

  public clearSelection(): void {
    this.selectionState.selectedFixtures.clear();
    this.renderer.clearSelection();
    this.selectionState.selectionBounds = undefined;
    this.emitEvent('selection_changed', { selectedFixtures: [] });
    this.hideFixtureProperties();
  }

  public selectAll(): void {
    if (!this.currentPlanogram) return;

    this.selectionState.selectedFixtures.clear();
    for (const fixture of this.currentPlanogram.layout.fixtures) {
      this.selectionState.selectedFixtures.add(fixture.id);
      this.renderer.selectFixture(fixture.id);
    }

    this.updateSelectionBounds();
    this.emitEvent('selection_changed', { selectedFixtures: Array.from(this.selectionState.selectedFixtures) });
  }

  public deleteSelected(): void {
    const selectedIds = Array.from(this.selectionState.selectedFixtures);
    if (selectedIds.length === 0) return;

    const action: UndoableAction = {
      id: this.generateId(),
      type: 'delete_multiple',
      description: `Delete ${selectedIds.length} fixtures`,
      undo: () => {
        // Implementation for restoring deleted fixtures
      },
      redo: () => {
        selectedIds.forEach(id => this.removeFixtureFromLayout(id));
      },
      timestamp: new Date()
    };

    this.executeAction(action);
    this.clearSelection();
    this.emitEvent('fixtures_deleted', { fixtureIds: selectedIds });
  }

  public duplicateSelected(): void {
    const selectedIds = Array.from(this.selectionState.selectedFixtures);
    if (selectedIds.length === 0) return;

    const newFixtures: Fixture[] = [];

    selectedIds.forEach(id => {
      const original = this.currentPlanogram?.layout.fixtures.find(f => f.id === id);
      if (original) {
        const duplicate: Fixture = {
          ...original,
          id: this.generateId(),
          name: `${original.name} Copy`,
          position: {
            x: original.position.x + 2,
            y: original.position.y + 2
          }
        };
        newFixtures.push(duplicate);
      }
    });

    const action: UndoableAction = {
      id: this.generateId(),
      type: 'duplicate_fixtures',
      description: `Duplicate ${selectedIds.length} fixtures`,
      undo: () => {
        newFixtures.forEach(f => this.removeFixtureFromLayout(f.id));
      },
      redo: () => {
        newFixtures.forEach(f => this.addFixtureToLayout(f));
      },
      timestamp: new Date()
    };

    this.executeAction(action);

    // Select the new fixtures
    this.clearSelection();
    newFixtures.forEach(f => this.selectFixture(f.id, true));

    this.emitEvent('fixtures_duplicated', { originalIds: selectedIds, newFixtures });
  }

  // === Undo/Redo System ===

  public undo(): void {
    if (this.undoStack.length === 0) {
      new Notice('Nothing to undo');
      return;
    }

    const action = this.undoStack.pop()!;
    action.undo();
    this.redoStack.push(action);

    if (this.currentPlanogram) {
      this.renderer.render(this.currentPlanogram);
    }

    new Notice(`Undid: ${action.description}`);
    this.emitEvent('action_undone', { action });
  }

  public redo(): void {
    if (this.redoStack.length === 0) {
      new Notice('Nothing to redo');
      return;
    }

    const action = this.redoStack.pop()!;
    action.redo();
    this.undoStack.push(action);

    if (this.currentPlanogram) {
      this.renderer.render(this.currentPlanogram);
    }

    new Notice(`Redid: ${action.description}`);
    this.emitEvent('action_redone', { action });
  }

  private executeAction(action: UndoableAction): void {
    action.redo();
    this.undoStack.push(action);
    this.redoStack.length = 0; // Clear redo stack

    // Limit undo stack size
    if (this.undoStack.length > this.maxUndoStackSize) {
      this.undoStack.shift();
    }

    if (this.currentPlanogram) {
      this.renderer.render(this.currentPlanogram);
    }

    this.emitEvent('action_executed', { action });
  }

  private clearUndoHistory(): void {
    this.undoStack.length = 0;
    this.redoStack.length = 0;
  }

  // === Event System ===

  public addEventListener(event: string, callback: Function): void {
    if (!this.eventCallbacks.has(event)) {
      this.eventCallbacks.set(event, []);
    }
    this.eventCallbacks.get(event)!.push(callback);
  }

  public removeEventListener(event: string, callback: Function): void {
    const callbacks = this.eventCallbacks.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emitEvent(event: string, data: any): void {
    const callbacks = this.eventCallbacks.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  // === Event Handlers ===

  private setupEventListeners(): void {
    // Canvas event listeners are handled by the renderer
    // Document-level event listeners for keyboard shortcuts
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  private handleKeyDown(event: KeyboardEvent): void {
    // Only handle shortcuts when the plugin is active
    if (!this.isPluginActive()) return;

    const key = event.code;
    const isModifier = event.ctrlKey || event.metaKey;

    if (isModifier && this.keyboardShortcuts.has(key)) {
      event.preventDefault();
      this.keyboardShortcuts.get(key)!();
    } else if (!isModifier && this.keyboardShortcuts.has(key)) {
      event.preventDefault();
      this.keyboardShortcuts.get(key)!();
    }
  }

  private handleKeyUp(event: KeyboardEvent): void {
    // Handle key up events if needed
  }

  // === Utility Methods ===

  private snapToGrid(position: Point): Point {
    if (!this.settings.snapToGrid) return position;

    const gridSize = this.settings.gridSize || 12;
    return {
      x: Math.round(position.x / gridSize) * gridSize,
      y: Math.round(position.y / gridSize) * gridSize
    };
  }

  private determineVMZone(position: Point): VMZone {
    // Simple VM zone determination based on Y position
    // In a real implementation, this would consider fixture height and store layout
    if (position.y < 20) return 'stretch';
    if (position.y < 40) return 'eye';
    if (position.y < 60) return 'reach';
    return 'stoop';
  }

  private getDefaultFixtureDimensions(type: FixtureType) {
    const defaults = {
      gondola: { width: 4, depth: 2, height: 72 },
      endcap: { width: 2, depth: 2, height: 72 },
      wall: { width: 8, depth: 1, height: 96 },
      table: { width: 3, depth: 2, height: 36 },
      rack: { width: 2, depth: 2, height: 60 },
      tower: { width: 1.5, depth: 1.5, height: 84 },
      custom: { width: 2, depth: 2, height: 48 }
    };
    return defaults[type] || defaults.custom;
  }

  private getDefaultFixtureColor(type: FixtureType): string {
    const colors = {
      gondola: '#3b82f6',
      endcap: '#059669',
      wall: '#6b7280',
      table: '#f59e0b',
      rack: '#7c3aed',
      tower: '#dc2626',
      custom: '#64748b'
    };
    return colors[type] || colors.custom;
  }

  private updateCursor(): void {
    const canvas = this.renderer.canvas;
    switch (this.mode) {
      case 'select':
        canvas.style.cursor = 'default';
        break;
      case 'add_fixture':
        canvas.style.cursor = 'crosshair';
        break;
      case 'measure':
        canvas.style.cursor = 'crosshair';
        break;
      case 'pan':
        canvas.style.cursor = 'grab';
        break;
      case 'zoom':
        canvas.style.cursor = 'zoom-in';
        break;
    }
  }

  private updateSelectionBounds(): void {
    if (this.selectionState.selectedFixtures.size === 0) {
      this.selectionState.selectionBounds = undefined;
      return;
    }

    if (!this.currentPlanogram) return;

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    this.selectionState.selectedFixtures.forEach(fixtureId => {
      const fixture = this.currentPlanogram!.layout.fixtures.find(f => f.id === fixtureId);
      if (fixture) {
        minX = Math.min(minX, fixture.position.x);
        minY = Math.min(minY, fixture.position.y);
        maxX = Math.max(maxX, fixture.position.x + fixture.dimensions.width);
        maxY = Math.max(maxY, fixture.position.y + fixture.dimensions.depth);
      }
    });

    this.selectionState.selectionBounds = {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }

  private showFixtureProperties(fixtureId: string): void {
    const fixture = this.currentPlanogram?.layout.fixtures.find(f => f.id === fixtureId);
    if (!fixture) return;

    this.emitEvent('show_fixture_properties', { fixture });
  }

  private hideFixtureProperties(): void {
    this.emitEvent('hide_fixture_properties', {});
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private isPluginActive(): boolean {
    // Check if the VM Planogram view is currently active
    return document.querySelector('.vm-planogram-view') !== null;
  }

  // === Data Operations ===

  private addFixtureToLayout(fixture: Fixture): void {
    if (!this.currentPlanogram) return;
    this.currentPlanogram.layout.fixtures.push(fixture);
    this.markPlanogramModified();
  }

  private removeFixtureFromLayout(fixtureId: string): void {
    if (!this.currentPlanogram) return;
    const index = this.currentPlanogram.layout.fixtures.findIndex(f => f.id === fixtureId);
    if (index > -1) {
      this.currentPlanogram.layout.fixtures.splice(index, 1);
      this.markPlanogramModified();
    }
  }

  private updateFixturePosition(fixtureId: string, position: Point): void {
    if (!this.currentPlanogram) return;
    const fixture = this.currentPlanogram.layout.fixtures.find(f => f.id === fixtureId);
    if (fixture) {
      fixture.position = position;
      this.markPlanogramModified();
    }
  }

  private markPlanogramModified(): void {
    if (!this.currentPlanogram) return;
    this.currentPlanogram.metadata.lastModified = new Date();

    if (this.settings.autoSave) {
      this.savePlanogram();
    }
  }

  private async savePlanogram(): Promise<void> {
    if (!this.currentPlanogram) return;

    try {
      await this.dataManager.savePlanogram(this.currentPlanogram);
      new Notice('Planogram saved');
      this.emitEvent('planogram_saved', { planogram: this.currentPlanogram });
    } catch (error) {
      new Notice('Error saving planogram: ' + error.message);
    }
  }

  // === Copy/Paste Operations ===

  private copySelected(): void {
    const selectedIds = Array.from(this.selectionState.selectedFixtures);
    if (selectedIds.length === 0) return;

    const fixtures = selectedIds
      .map(id => this.currentPlanogram?.layout.fixtures.find(f => f.id === id))
      .filter(f => f !== undefined) as Fixture[];

    // Store in local storage for cross-session persistence
    localStorage.setItem('vm-planogram-clipboard', JSON.stringify(fixtures));
    new Notice(`Copied ${fixtures.length} fixtures`);
    this.emitEvent('fixtures_copied', { fixtures });
  }

  private pasteSelected(): void {
    const clipboardData = localStorage.getItem('vm-planogram-clipboard');
    if (!clipboardData) {
      new Notice('Nothing to paste');
      return;
    }

    try {
      const fixtures: Fixture[] = JSON.parse(clipboardData);
      const newFixtures = fixtures.map(f => ({
        ...f,
        id: this.generateId(),
        name: `${f.name} Pasted`,
        position: {
          x: f.position.x + 2,
          y: f.position.y + 2
        }
      }));

      const action: UndoableAction = {
        id: this.generateId(),
        type: 'paste_fixtures',
        description: `Paste ${newFixtures.length} fixtures`,
        undo: () => {
          newFixtures.forEach(f => this.removeFixtureFromLayout(f.id));
        },
        redo: () => {
          newFixtures.forEach(f => this.addFixtureToLayout(f));
        },
        timestamp: new Date()
      };

      this.executeAction(action);

      // Select the pasted fixtures
      this.clearSelection();
      newFixtures.forEach(f => this.selectFixture(f.id, true));

      new Notice(`Pasted ${newFixtures.length} fixtures`);
      this.emitEvent('fixtures_pasted', { fixtures: newFixtures });
    } catch (error) {
      new Notice('Error pasting fixtures');
    }
  }
}