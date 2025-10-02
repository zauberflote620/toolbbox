/**
 * Enhanced VM Planogram Settings - v2.0.0
 * Integrates Shop Reset Toolbox configuration with plugin settings
 */

import { App, PluginSettingTab, Setting, Notice } from 'obsidian';
import { VMPlanogramSettings } from './types';

export interface EnhancedVMPlanogramSettings extends VMPlanogramSettings {
  // Shop Reset Integration
  shopResetIntegration: boolean;
  autoLoadShopResetFiles: boolean;
  shopResetBasePath: string;

  // Measurement & Display
  measurementUnit: 'inches' | 'feet' | 'cm' | 'meters';
  scaleRatio: number;
  showGrid: boolean;
  gridSize: number;
  snapToGrid: boolean;

  // Compliance & Validation
  showComplianceAlerts: boolean;
  autoValidateOnChange: boolean;
  complianceStrictness: 'lenient' | 'normal' | 'strict';

  // PDF Export
  enablePDFExport: boolean;
  defaultPDFFormat: 'letter' | 'legal' | 'tabloid' | 'a4' | 'a3';
  defaultPDFOrientation: 'portrait' | 'landscape';
  includeBranding: boolean;

  // Performance
  maxFixturesPerPlanogram: number;
  enablePerformanceMonitoring: boolean;
  autoSaveInterval: number; // minutes

  // Advanced Features
  enableAIRecommendations: boolean;
  enableCollaboration: boolean;
  exportToExternalFormats: boolean;
}

export const DEFAULT_ENHANCED_SETTINGS: EnhancedVMPlanogramSettings = {
  // Original settings
  defaultStoreWidth: 40,
  defaultStoreHeight: 30,
  autoSave: true,

  // Shop Reset Integration
  shopResetIntegration: true,
  autoLoadShopResetFiles: true,
  shopResetBasePath: '',

  // Measurement & Display
  measurementUnit: 'feet',
  scaleRatio: 10, // 10 pixels = 1 foot
  showGrid: true,
  gridSize: 12, // 12 inches
  snapToGrid: true,

  // Compliance & Validation
  showComplianceAlerts: true,
  autoValidateOnChange: false,
  complianceStrictness: 'normal',

  // PDF Export
  enablePDFExport: true,
  defaultPDFFormat: 'tabloid',
  defaultPDFOrientation: 'landscape',
  includeBranding: false,

  // Performance
  maxFixturesPerPlanogram: 200,
  enablePerformanceMonitoring: true,
  autoSaveInterval: 5,

  // Advanced Features
  enableAIRecommendations: false,
  enableCollaboration: false,
  exportToExternalFormats: true
};

export class EnhancedVMPlanogramSettingTab extends PluginSettingTab {
  plugin: any;
  settings: EnhancedVMPlanogramSettings;

  constructor(app: App, plugin: any) {
    super(app, plugin);
    this.plugin = plugin;
    this.settings = plugin.settings;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl('h1', { text: 'VM Planogram Enhanced Settings' });

    // Shop Reset Integration Section
    this.createShopResetSection(containerEl);

    // Measurement & Display Section
    this.createMeasurementSection(containerEl);

    // Compliance & Validation Section
    this.createComplianceSection(containerEl);

    // PDF Export Section
    this.createPDFSection(containerEl);

    // Performance Section
    this.createPerformanceSection(containerEl);

    // Advanced Features Section
    this.createAdvancedSection(containerEl);

    // Actions Section
    this.createActionsSection(containerEl);
  }

  private createShopResetSection(containerEl: HTMLElement): void {
    const section = containerEl.createEl('div', { cls: 'setting-section' });
    section.createEl('h2', { text: 'Shop Reset Toolbox Integration' });
    section.createEl('p', {
      text: 'Configure integration with the Shop Reset Toolbox methodology and configuration files.',
      cls: 'setting-item-description'
    });

    new Setting(section)
      .setName('Enable Shop Reset Integration')
      .setDesc('Automatically load constraints.yaml and config.yaml files from vault')
      .addToggle(toggle => toggle
        .setValue(this.settings.shopResetIntegration)
        .onChange(async (value) => {
          this.settings.shopResetIntegration = value;
          await this.plugin.saveSettings();
          this.display(); // Refresh to show/hide dependent settings
        }));

    if (this.settings.shopResetIntegration) {
      new Setting(section)
        .setName('Auto-load Shop Reset Files')
        .setDesc('Automatically detect and load Shop Reset configuration files')
        .addToggle(toggle => toggle
          .setValue(this.settings.autoLoadShopResetFiles)
          .onChange(async (value) => {
            this.settings.autoLoadShopResetFiles = value;
            await this.plugin.saveSettings();
          }));

      new Setting(section)
        .setName('Shop Reset Base Path')
        .setDesc('Base path in vault for Shop Reset configuration files (leave empty for vault root)')
        .addText(text => text
          .setPlaceholder('e.g., shop-reset/')
          .setValue(this.settings.shopResetBasePath)
          .onChange(async (value) => {
            this.settings.shopResetBasePath = value;
            await this.plugin.saveSettings();
          }));
    }
  }

  private createMeasurementSection(containerEl: HTMLElement): void {
    const section = containerEl.createEl('div', { cls: 'setting-section' });
    section.createEl('h2', { text: 'Measurement & Display' });

    new Setting(section)
      .setName('Measurement Unit')
      .setDesc('Default unit of measurement for planograms')
      .addDropdown(dropdown => dropdown
        .addOption('feet', 'Feet')
        .addOption('inches', 'Inches')
        .addOption('meters', 'Meters')
        .addOption('cm', 'Centimeters')
        .setValue(this.settings.measurementUnit)
        .onChange(async (value: any) => {
          this.settings.measurementUnit = value;
          await this.plugin.saveSettings();
        }));

    new Setting(section)
      .setName('Scale Ratio')
      .setDesc('Pixels per measurement unit (affects print accuracy)')
      .addSlider(slider => slider
        .setLimits(5, 50, 1)
        .setValue(this.settings.scaleRatio)
        .setDynamicTooltip()
        .onChange(async (value) => {
          this.settings.scaleRatio = value;
          await this.plugin.saveSettings();
        }));

    new Setting(section)
      .setName('Default Store Width')
      .setDesc('Default width for new stores')
      .addText(text => text
        .setValue(this.settings.defaultStoreWidth.toString())
        .onChange(async (value) => {
          const num = parseInt(value);
          if (!isNaN(num) && num > 0) {
            this.settings.defaultStoreWidth = num;
            await this.plugin.saveSettings();
          }
        }));

    new Setting(section)
      .setName('Default Store Height')
      .setDesc('Default height for new stores')
      .addText(text => text
        .setValue(this.settings.defaultStoreHeight.toString())
        .onChange(async (value) => {
          const num = parseInt(value);
          if (!isNaN(num) && num > 0) {
            this.settings.defaultStoreHeight = num;
            await this.plugin.saveSettings();
          }
        }));

    new Setting(section)
      .setName('Show Grid')
      .setDesc('Display grid overlay on planogram canvas')
      .addToggle(toggle => toggle
        .setValue(this.settings.showGrid)
        .onChange(async (value) => {
          this.settings.showGrid = value;
          await this.plugin.saveSettings();
        }));

    new Setting(section)
      .setName('Snap to Grid')
      .setDesc('Automatically snap fixtures to grid when moving')
      .addToggle(toggle => toggle
        .setValue(this.settings.snapToGrid)
        .onChange(async (value) => {
          this.settings.snapToGrid = value;
          await this.plugin.saveSettings();
        }));
  }

  private createComplianceSection(containerEl: HTMLElement): void {
    const section = containerEl.createEl('div', { cls: 'setting-section' });
    section.createEl('h2', { text: 'Compliance & Validation' });

    new Setting(section)
      .setName('Show Compliance Alerts')
      .setDesc('Display real-time compliance warnings and violations')
      .addToggle(toggle => toggle
        .setValue(this.settings.showComplianceAlerts)
        .onChange(async (value) => {
          this.settings.showComplianceAlerts = value;
          await this.plugin.saveSettings();
        }));

    new Setting(section)
      .setName('Auto-validate on Change')
      .setDesc('Automatically run compliance validation when planogram changes')
      .addToggle(toggle => toggle
        .setValue(this.settings.autoValidateOnChange)
        .onChange(async (value) => {
          this.settings.autoValidateOnChange = value;
          await this.plugin.saveSettings();
        }));

    new Setting(section)
      .setName('Compliance Strictness')
      .setDesc('Level of strictness for compliance validation')
      .addDropdown(dropdown => dropdown
        .addOption('lenient', 'Lenient - Warnings only')
        .addOption('normal', 'Normal - Standard validation')
        .addOption('strict', 'Strict - Strict validation')
        .setValue(this.settings.complianceStrictness)
        .onChange(async (value: any) => {
          this.settings.complianceStrictness = value;
          await this.plugin.saveSettings();
        }));
  }

  private createPDFSection(containerEl: HTMLElement): void {
    const section = containerEl.createEl('div', { cls: 'setting-section' });
    section.createEl('h2', { text: 'PDF Export' });

    new Setting(section)
      .setName('Enable PDF Export')
      .setDesc('Enable PDF generation capabilities')
      .addToggle(toggle => toggle
        .setValue(this.settings.enablePDFExport)
        .onChange(async (value) => {
          this.settings.enablePDFExport = value;
          await this.plugin.saveSettings();
          this.display(); // Refresh to show/hide dependent settings
        }));

    if (this.settings.enablePDFExport) {
      new Setting(section)
        .setName('Default PDF Format')
        .setDesc('Default paper size for PDF exports')
        .addDropdown(dropdown => dropdown
          .addOption('letter', 'Letter (8.5" x 11")')
          .addOption('legal', 'Legal (8.5" x 14")')
          .addOption('tabloid', 'Tabloid (11" x 17")')
          .addOption('a4', 'A4 (210mm x 297mm)')
          .addOption('a3', 'A3 (297mm x 420mm)')
          .setValue(this.settings.defaultPDFFormat)
          .onChange(async (value: any) => {
            this.settings.defaultPDFFormat = value;
            await this.plugin.saveSettings();
          }));

      new Setting(section)
        .setName('Default PDF Orientation')
        .setDesc('Default orientation for PDF exports')
        .addDropdown(dropdown => dropdown
          .addOption('portrait', 'Portrait')
          .addOption('landscape', 'Landscape')
          .setValue(this.settings.defaultPDFOrientation)
          .onChange(async (value: any) => {
            this.settings.defaultPDFOrientation = value;
            await this.plugin.saveSettings();
          }));
    }
  }

  private createPerformanceSection(containerEl: HTMLElement): void {
    const section = containerEl.createEl('div', { cls: 'setting-section' });
    section.createEl('h2', { text: 'Performance' });

    new Setting(section)
      .setName('Auto-save')
      .setDesc('Automatically save changes')
      .addToggle(toggle => toggle
        .setValue(this.settings.autoSave)
        .onChange(async (value) => {
          this.settings.autoSave = value;
          await this.plugin.saveSettings();
        }));

    new Setting(section)
      .setName('Auto-save Interval')
      .setDesc('How often to auto-save (in minutes)')
      .addSlider(slider => slider
        .setLimits(1, 30, 1)
        .setValue(this.settings.autoSaveInterval)
        .setDynamicTooltip()
        .onChange(async (value) => {
          this.settings.autoSaveInterval = value;
          await this.plugin.saveSettings();
        }));

    new Setting(section)
      .setName('Max Fixtures per Planogram')
      .setDesc('Maximum number of fixtures allowed in a single planogram')
      .addText(text => text
        .setValue(this.settings.maxFixturesPerPlanogram.toString())
        .onChange(async (value) => {
          const num = parseInt(value);
          if (!isNaN(num) && num > 0) {
            this.settings.maxFixturesPerPlanogram = num;
            await this.plugin.saveSettings();
          }
        }));
  }

  private createAdvancedSection(containerEl: HTMLElement): void {
    const section = containerEl.createEl('div', { cls: 'setting-section' });
    section.createEl('h2', { text: 'Advanced Features' });

    new Setting(section)
      .setName('AI Recommendations')
      .setDesc('Enable AI-powered layout recommendations (experimental)')
      .addToggle(toggle => toggle
        .setValue(this.settings.enableAIRecommendations)
        .onChange(async (value) => {
          this.settings.enableAIRecommendations = value;
          await this.plugin.saveSettings();
        }));

    new Setting(section)
      .setName('Export to External Formats')
      .setDesc('Enable export to external planogram formats')
      .addToggle(toggle => toggle
        .setValue(this.settings.exportToExternalFormats)
        .onChange(async (value) => {
          this.settings.exportToExternalFormats = value;
          await this.plugin.saveSettings();
        }));
  }

  private createActionsSection(containerEl: HTMLElement): void {
    const section = containerEl.createEl('div', { cls: 'setting-section' });
    section.createEl('h2', { text: 'Actions' });

    new Setting(section)
      .setName('Test Shop Reset Integration')
      .setDesc('Test loading Shop Reset configuration files')
      .addButton(button => button
        .setButtonText('Test Integration')
        .onClick(async () => {
          try {
            await this.plugin.dataManager.loadShopResetConfigFromVault();
            new Notice('Shop Reset integration test successful!');
          } catch (error) {
            new Notice(`Shop Reset integration test failed: ${error.message}`);
          }
        }));

    new Setting(section)
      .setName('Clear All Data')
      .setDesc('Clear all planogram and store data (cannot be undone)')
      .addButton(button => button
        .setButtonText('Clear Data')
        .setWarning()
        .onClick(async () => {
          const confirmed = confirm('Are you sure you want to clear all data? This cannot be undone.');
          if (confirmed) {
            try {
              await this.plugin.clearAllData();
              new Notice('All data cleared successfully');
            } catch (error) {
              new Notice(`Error clearing data: ${error.message}`);
            }
          }
        }));

    new Setting(section)
      .setName('Reset to Defaults')
      .setDesc('Reset all settings to default values')
      .addButton(button => button
        .setButtonText('Reset Settings')
        .onClick(async () => {
          const confirmed = confirm('Reset all settings to defaults?');
          if (confirmed) {
            this.settings = { ...DEFAULT_ENHANCED_SETTINGS };
            await this.plugin.saveSettings();
            this.display();
            new Notice('Settings reset to defaults');
          }
        }));
  }
}