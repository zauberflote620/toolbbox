/**
 * Enhanced Data Manager - v2.0.0
 * Handles Shop Reset Toolbox integration, YAML parsing, and planogram data persistence
 */

import { Notice } from 'obsidian';
import * as yaml from 'js-yaml';
import {
  ShopResetConstraints,
  ShopResetConfig,
  Store,
  Planogram,
  Fixture,
  Product,
  VMPlanogramSettings,
  ValidationResult,
  ComplianceViolation,
  AnchorConfiguration
} from '../types';

export class DataManager {
  private app: any;
  private plugin: any;
  private stores: Map<string, Store> = new Map();
  private planograms: Map<string, Planogram> = new Map();

  constructor(app: any, plugin: any) {
    this.app = app;
    this.plugin = plugin;
  }

  // === Shop Reset Toolbox Integration ===

  /**
   * Parse Shop Reset constraints from YAML content
   */
  async parseShopResetConstraints(yamlContent: string): Promise<ShopResetConstraints> {
    try {
      const parsed = yaml.load(yamlContent) as any;

      // Validate required structure
      if (!parsed.shop_layout || !parsed.constraints) {
        throw new Error('Invalid constraints format: missing shop_layout or constraints');
      }

      return {
        shop_layout: {
          description: parsed.shop_layout.description || '',
          sections: parsed.shop_layout.sections || []
        },
        constraints: {
          visibility: parsed.constraints.visibility || [],
          safety: parsed.constraints.safety || [],
          lighting: parsed.constraints.lighting || []
        },
        inventory_taxonomy: parsed.inventory_taxonomy,
        custom_scoring_weights: parsed.custom_scoring_weights
      };
    } catch (error) {
      throw new Error(`Failed to parse constraints YAML: ${error.message}`);
    }
  }

  /**
   * Parse Shop Reset configuration from YAML content
   */
  async parseShopResetConfig(yamlContent: string): Promise<ShopResetConfig> {
    try {
      const parsed = yaml.load(yamlContent) as any;

      return {
        anchor_selection_criteria: parsed.anchor_selection_criteria || 'high_margin',
        focal_anchors_per_section: parsed.focal_anchors_per_section || 2,
        spoke_density: parsed.spoke_density || 3,
        novelty_ratio: parsed.novelty_ratio || 0.2,
        pos_contrast_tactic: parsed.pos_contrast_tactic || 'high_contrast_packaging',
        section_weights: parsed.section_weights || {}
      };
    } catch (error) {
      throw new Error(`Failed to parse config YAML: ${error.message}`);
    }
  }

  /**
   * Find and load Shop Reset configuration files from vault
   */
  async loadShopResetConfigFromVault(): Promise<{ constraints?: ShopResetConstraints, config?: ShopResetConfig }> {
    const result: { constraints?: ShopResetConstraints, config?: ShopResetConfig } = {};

    try {
      // Look for constraints.yaml
      const constraintsFile = this.app.vault.getAbstractFileByPath('constraints.yaml');
      if (constraintsFile) {
        const content = await this.app.vault.read(constraintsFile);
        result.constraints = await this.parseShopResetConstraints(content);
      }

      // Look for config.yaml
      const configFile = this.app.vault.getAbstractFileByPath('config.yaml');
      if (configFile) {
        const content = await this.app.vault.read(configFile);
        result.config = await this.parseShopResetConfig(content);
      }

      return result;
    } catch (error) {
      console.error('Error loading Shop Reset config from vault:', error);
      new Notice('Error loading Shop Reset configuration files');
      return {};
    }
  }

  // === Enhanced Store Management ===

  /**
   * Create a new store with Shop Reset integration
   */
  async createStore(
    name: string,
    dimensions: { width: number, height: number, ceilingHeight: number },
    constraints?: ShopResetConstraints,
    config?: ShopResetConfig
  ): Promise<Store> {
    const store: Store = {
      id: this.generateId(),
      name,
      dimensions: {
        ...dimensions,
        unit: 'feet'
      },
      constraints: constraints || this.getDefaultConstraints(),
      config: config || this.getDefaultConfig(),
      trafficPatterns: this.generateDefaultTrafficPatterns(dimensions),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.stores.set(store.id, store);
    await this.saveStore(store);

    return store;
  }

  /**
   * Update store with new constraints or configuration
   */
  async updateStore(storeId: string, updates: Partial<Store>): Promise<Store> {
    const store = this.stores.get(storeId);
    if (!store) {
      throw new Error(`Store ${storeId} not found`);
    }

    const updatedStore = {
      ...store,
      ...updates,
      updatedAt: new Date()
    };

    this.stores.set(storeId, updatedStore);
    await this.saveStore(updatedStore);

    return updatedStore;
  }

  // === Enhanced Planogram Management ===

  /**
   * Create a new planogram with Anchor-and-Spokes methodology
   */
  async createPlanogram(
    storeId: string,
    name: string,
    resetType: 'full' | 'partial' | 'seasonal' = 'full'
  ): Promise<Planogram> {
    const store = this.stores.get(storeId);
    if (!store) {
      throw new Error(`Store ${storeId} not found`);
    }

    const planogram: Planogram = {
      id: this.generateId(),
      storeId,
      name,
      version: 1,
      status: 'draft',
      metadata: {
        created: new Date(),
        lastModified: new Date(),
        author: 'Current User',
        resetType
      },
      layout: {
        fixtures: [],
        products: [],
        anchors: []
      },
      compliance: {
        score: 100,
        violations: [],
        warnings: []
      },
      analytics: {
        insights: [],
        parsedRules: [],
        recommendations: []
      }
    };

    // Apply Shop Reset methodology
    await this.applyAnchorAndSpokesMethodology(planogram, store);

    this.planograms.set(planogram.id, planogram);
    await this.savePlanogram(planogram);

    return planogram;
  }

  /**
   * Apply Anchor-and-Spokes methodology to planogram
   */
  private async applyAnchorAndSpokesMethodology(planogram: Planogram, store: Store): Promise<void> {
    const { config } = store;

    // Generate fixtures based on shop sections
    for (const section of store.constraints.shop_layout.sections) {
      const fixtures = await this.generateFixturesForSection(section, store);
      planogram.layout.fixtures.push(...fixtures);

      // Create anchors for this section
      const anchors = await this.generateAnchorsForSection(section, fixtures, config);
      planogram.layout.anchors.push(...anchors);
    }

    // Generate placement rules from constraints
    planogram.analytics.parsedRules = this.generatePlacementRules(store.constraints);

    // Generate initial recommendations
    planogram.analytics.recommendations = this.generateInitialRecommendations(store);
  }

  /**
   * Generate fixtures for a shop section
   */
  private async generateFixturesForSection(section: any, store: Store): Promise<Fixture[]> {
    const fixtures: Fixture[] = [];

    section.fixtures.forEach((fixtureType: string, index: number) => {
      const fixture: Fixture = {
        id: this.generateId(),
        name: `${section.name} ${fixtureType} ${index + 1}`,
        type: this.mapFixtureType(fixtureType),
        position: this.calculateFixturePosition(section, index),
        dimensions: this.getDefaultFixtureDimensions(fixtureType),
        rotation: 0,
        vmZone: this.determineVMZone(section, fixtureType),
        capacity: this.getDefaultCapacity(fixtureType),
        color: this.getDefaultFixtureColor(fixtureType),
        shopSection: section.name,
        complianceStatus: 'compliant',
        complianceIssues: []
      };

      fixtures.push(fixture);
    });

    return fixtures;
  }

  /**
   * Generate anchor configurations for a section
   */
  private async generateAnchorsForSection(
    section: any,
    fixtures: Fixture[],
    config: ShopResetConfig
  ): Promise<AnchorConfiguration[]> {
    const anchors: AnchorConfiguration[] = [];
    const anchorCount = Math.min(config.focal_anchors_per_section, fixtures.length);

    for (let i = 0; i < anchorCount; i++) {
      const fixture = fixtures[i];
      const anchor: AnchorConfiguration = {
        id: this.generateId(),
        fixtureId: fixture.id,
        anchorProduct: this.generateAnchorProduct(config.anchor_selection_criteria),
        spokeProducts: this.generateSpokeProducts(config.spoke_density),
        section: section.name,
        rationale: `Selected based on ${config.anchor_selection_criteria} criteria`,
        performance: {
          trafficGeneration: 0.8,
          crossSellOpportunity: 0.7,
          marginContribution: 0.6
        }
      };

      anchors.push(anchor);
    }

    return anchors;
  }

  // === Compliance Validation ===

  /**
   * Validate planogram compliance against Shop Reset constraints
   */
  async validateCompliance(planogram: Planogram): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    const violations: ComplianceViolation[] = [];

    const store = this.stores.get(planogram.storeId);
    if (!store) {
      errors.push('Store not found for compliance validation');
      return { isValid: false, errors, warnings };
    }

    // Validate safety constraints
    await this.validateSafetyConstraints(planogram, store, violations);

    // Validate visibility constraints
    await this.validateVisibilityConstraints(planogram, store, violations);

    // Validate VM principles
    await this.validateVMPrinciples(planogram, violations);

    // Update planogram compliance
    planogram.compliance.violations = violations.filter(v => v.severity === 'critical' || v.severity === 'major');
    planogram.compliance.warnings = violations.filter(v => v.severity === 'minor');
    planogram.compliance.score = this.calculateComplianceScore(violations);

    // Convert violations to errors/warnings
    violations.forEach(violation => {
      if (violation.severity === 'critical') {
        errors.push(violation.description);
      } else {
        warnings.push(violation.description);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // === Data Persistence ===

  /**
   * Save store to Obsidian vault
   */
  private async saveStore(store: Store): Promise<void> {
    try {
      const storeData = JSON.stringify(store, null, 2);
      const fileName = `stores/${store.id}.json`;

      // Ensure stores directory exists
      await this.ensureDirectoryExists('stores');

      await this.app.vault.adapter.write(fileName, storeData);
    } catch (error) {
      console.error('Error saving store:', error);
      new Notice('Error saving store data');
    }
  }

  /**
   * Save planogram to Obsidian vault
   */
  private async savePlanogram(planogram: Planogram): Promise<void> {
    try {
      const planogramData = JSON.stringify(planogram, null, 2);
      const fileName = `planograms/${planogram.id}.json`;

      // Ensure planograms directory exists
      await this.ensureDirectoryExists('planograms');

      await this.app.vault.adapter.write(fileName, planogramData);
    } catch (error) {
      console.error('Error saving planogram:', error);
      new Notice('Error saving planogram data');
    }
  }

  /**
   * Load all stores from vault
   */
  async loadStores(): Promise<Store[]> {
    try {
      const storeFiles = await this.app.vault.adapter.list('stores');
      const stores: Store[] = [];

      for (const file of storeFiles.files) {
        if (file.endsWith('.json')) {
          const content = await this.app.vault.adapter.read(file);
          const store = JSON.parse(content) as Store;
          this.stores.set(store.id, store);
          stores.push(store);
        }
      }

      return stores;
    } catch (error) {
      console.error('Error loading stores:', error);
      return [];
    }
  }

  // === Utility Methods ===

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private async ensureDirectoryExists(path: string): Promise<void> {
    try {
      await this.app.vault.adapter.mkdir(path);
    } catch (error) {
      // Directory might already exist, which is fine
    }
  }

  private getDefaultConstraints(): ShopResetConstraints {
    return {
      shop_layout: {
        description: 'Default shop layout',
        sections: [
          {
            name: 'Entrance Zone',
            description: 'First impression area',
            fixtures: ['table', 'rack']
          },
          {
            name: 'Main Floor',
            description: 'Primary shopping area',
            fixtures: ['gondola', 'endcap']
          }
        ]
      },
      constraints: {
        visibility: [],
        safety: [],
        lighting: []
      }
    };
  }

  private getDefaultConfig(): ShopResetConfig {
    return {
      anchor_selection_criteria: 'high_margin',
      focal_anchors_per_section: 2,
      spoke_density: 3,
      novelty_ratio: 0.2,
      pos_contrast_tactic: 'high_contrast_packaging',
      section_weights: {}
    };
  }

  // Additional utility methods would be implemented here...
  // This includes methods for fixture positioning, VM zone determination,
  // compliance validation, and other data management operations
}