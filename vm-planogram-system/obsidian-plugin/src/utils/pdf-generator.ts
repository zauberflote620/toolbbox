/**
 * Production-Grade PDF Generator - v2.0.0
 * Precise measurement accuracy and professional output for retail use
 */

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import {
  Planogram,
  Store,
  Fixture,
  Product,
  PDFExportOptions,
  ExecutionMaterials,
  ComplianceViolation,
  EnhancedVMPlanogramSettings
} from '../types';

export interface PDFGenerationResult {
  success: boolean;
  pdfBlob?: Blob;
  pdfDataURL?: string;
  error?: string;
  metadata: {
    pageCount: number;
    fileSize: number;
    generationTime: number;
    scale: number;
  };
}

export class PDFGenerator {
  private settings: EnhancedVMPlanogramSettings;

  // Professional paper sizes (in inches)
  private paperSizes = {
    letter: { width: 8.5, height: 11 },
    legal: { width: 8.5, height: 14 },
    tabloid: { width: 11, height: 17 },
    a4: { width: 8.27, height: 11.69 },
    a3: { width: 11.69, height: 16.54 }
  };

  // Professional margins (in inches)
  private margins = {
    top: 0.5,
    right: 0.5,
    bottom: 0.5,
    left: 0.5
  };

  constructor(settings: EnhancedVMPlanogramSettings) {
    this.settings = settings;
  }

  /**
   * Generate comprehensive PDF with planogram, compliance, and execution materials
   */
  async generateCompletePDF(
    planogram: Planogram,
    store: Store,
    options: PDFExportOptions
  ): Promise<PDFGenerationResult> {
    const startTime = Date.now();

    try {
      const paperSize = this.paperSizes[options.format];
      const pdf = new jsPDF({
        orientation: options.orientation,
        unit: 'in',
        format: [paperSize.width, paperSize.height]
      });

      let pageCount = 0;

      // Cover page
      this.addCoverPage(pdf, planogram, store, options);
      pageCount++;

      // Main planogram page
      pdf.addPage();
      await this.addPlanogramPage(pdf, planogram, store, options);
      pageCount++;

      // Compliance report
      if (options.includeCompliance && planogram.compliance.violations.length > 0) {
        pdf.addPage();
        this.addCompliancePage(pdf, planogram, options);
        pageCount++;
      }

      // Execution materials
      if (options.includeExecutionMaterials) {
        const materials = await this.generateExecutionMaterials(planogram, store);

        // Pick lists
        if (materials.pickLists.length > 0) {
          pdf.addPage();
          this.addPickListsPage(pdf, materials.pickLists, options);
          pageCount++;
        }

        // Task cards
        if (materials.taskCards.length > 0) {
          pdf.addPage();
          this.addTaskCardsPage(pdf, materials.taskCards, options);
          pageCount++;
        }

        // Compliance checklist
        if (materials.complianceChecklist.length > 0) {
          pdf.addPage();
          this.addComplianceChecklistPage(pdf, materials.complianceChecklist, options);
          pageCount++;
        }
      }

      // Add footer to all pages
      this.addFootersToAllPages(pdf, pageCount, planogram, options);

      // Generate output
      const pdfBlob = pdf.output('blob');
      const pdfDataURL = pdf.output('datauristring');

      const endTime = Date.now();
      const generationTime = endTime - startTime;

      return {
        success: true,
        pdfBlob,
        pdfDataURL,
        metadata: {
          pageCount,
          fileSize: pdfBlob.size,
          generationTime,
          scale: options.scale
        }
      };
    } catch (error) {
      console.error('PDF generation error:', error);
      return {
        success: false,
        error: error.message,
        metadata: {
          pageCount: 0,
          fileSize: 0,
          generationTime: Date.now() - startTime,
          scale: options.scale
        }
      };
    }
  }

  /**
   * Generate planogram-only PDF with precise measurements
   */
  async generatePlanogramPDF(
    planogram: Planogram,
    store: Store,
    options: PDFExportOptions
  ): Promise<PDFGenerationResult> {
    const startTime = Date.now();

    try {
      const paperSize = this.paperSizes[options.format];
      const pdf = new jsPDF({
        orientation: options.orientation,
        unit: 'in',
        format: [paperSize.width, paperSize.height]
      });

      await this.addPlanogramPage(pdf, planogram, store, options);

      const pdfBlob = pdf.output('blob');
      const pdfDataURL = pdf.output('datauristring');

      return {
        success: true,
        pdfBlob,
        pdfDataURL,
        metadata: {
          pageCount: 1,
          fileSize: pdfBlob.size,
          generationTime: Date.now() - startTime,
          scale: options.scale
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        metadata: {
          pageCount: 0,
          fileSize: 0,
          generationTime: Date.now() - startTime,
          scale: options.scale
        }
      };
    }
  }

  private addCoverPage(
    pdf: jsPDF,
    planogram: Planogram,
    store: Store,
    options: PDFExportOptions
  ): void {
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;

    // Title
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('VM Planogram', pageWidth / 2, 2, { align: 'center' });

    // Subtitle
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'normal');
    pdf.text(planogram.name, pageWidth / 2, 2.5, { align: 'center' });

    // Store information
    pdf.setFontSize(12);
    const storeInfoY = 3.5;
    pdf.text(`Store: ${store.name}`, this.margins.left, storeInfoY);
    pdf.text(`Address: ${store.address || 'Not specified'}`, this.margins.left, storeInfoY + 0.3);
    pdf.text(`Dimensions: ${store.dimensions.width}' × ${store.dimensions.height}'`, this.margins.left, storeInfoY + 0.6);

    // Planogram metadata
    const metadataY = 5;
    pdf.text(`Version: ${planogram.version}`, this.margins.left, metadataY);
    pdf.text(`Status: ${planogram.status}`, this.margins.left, metadataY + 0.3);
    pdf.text(`Reset Type: ${planogram.metadata.resetType}`, this.margins.left, metadataY + 0.6);
    pdf.text(`Created: ${planogram.metadata.created.toLocaleDateString()}`, this.margins.left, metadataY + 0.9);
    pdf.text(`Last Modified: ${planogram.metadata.lastModified.toLocaleDateString()}`, this.margins.left, metadataY + 1.2);

    // Compliance summary
    const complianceY = 7;
    pdf.setFont('helvetica', 'bold');
    pdf.text('Compliance Summary', this.margins.left, complianceY);
    pdf.setFont('helvetica', 'normal');

    const complianceColor = planogram.compliance.score >= 95 ? [0, 128, 0] :
                           planogram.compliance.score >= 80 ? [255, 165, 0] : [255, 0, 0];
    pdf.setTextColor(complianceColor[0], complianceColor[1], complianceColor[2]);
    pdf.text(`Overall Score: ${planogram.compliance.score}%`, this.margins.left, complianceY + 0.3);

    pdf.setTextColor(0, 0, 0);
    pdf.text(`Violations: ${planogram.compliance.violations.length}`, this.margins.left, complianceY + 0.6);
    pdf.text(`Warnings: ${planogram.compliance.warnings.length}`, this.margins.left, complianceY + 0.9);

    // Layout summary
    const layoutY = 9;
    pdf.setFont('helvetica', 'bold');
    pdf.text('Layout Summary', this.margins.left, layoutY);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Total Fixtures: ${planogram.layout.fixtures.length}`, this.margins.left, layoutY + 0.3);
    pdf.text(`Total Products: ${planogram.layout.products.length}`, this.margins.left, layoutY + 0.6);
    pdf.text(`Anchor Points: ${planogram.layout.anchors.length}`, this.margins.left, layoutY + 0.9);

    // Scale and measurement info
    const scaleY = pageHeight - 3;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'italic');
    pdf.text(`Scale: 1:${Math.round(12 / options.scale)} | Unit: ${this.settings.measurementUnit}`, this.margins.left, scaleY);
    pdf.text(`Print Date: ${new Date().toLocaleDateString()}`, this.margins.left, scaleY + 0.2);

    // Watermark if specified
    if (options.watermark) {
      this.addWatermark(pdf, options.watermark);
    }
  }

  private async addPlanogramPage(
    pdf: jsPDF,
    planogram: Planogram,
    store: Store,
    options: PDFExportOptions
  ): Promise<void> {
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;
    const availableWidth = pageWidth - this.margins.left - this.margins.right;
    const availableHeight = pageHeight - this.margins.top - this.margins.bottom - 1; // Reserve space for title

    // Page title
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Store Layout Planogram', pageWidth / 2, this.margins.top + 0.3, { align: 'center' });

    // Calculate scale to fit planogram on page
    const storeAspectRatio = store.dimensions.width / store.dimensions.height;
    const pageAspectRatio = availableWidth / availableHeight;

    let planogramWidth, planogramHeight;
    if (storeAspectRatio > pageAspectRatio) {
      // Store is wider relative to page
      planogramWidth = availableWidth;
      planogramHeight = availableWidth / storeAspectRatio;
    } else {
      // Store is taller relative to page
      planogramHeight = availableHeight;
      planogramWidth = availableHeight * storeAspectRatio;
    }

    const scaleX = planogramWidth / store.dimensions.width;
    const scaleY = planogramHeight / store.dimensions.height;
    const scale = Math.min(scaleX, scaleY) * options.scale;

    // Position planogram in center of available space
    const planogramX = this.margins.left + (availableWidth - planogramWidth) / 2;
    const planogramY = this.margins.top + 0.8 + (availableHeight - planogramHeight) / 2;

    // Draw store outline
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.02);
    pdf.rect(planogramX, planogramY, planogramWidth, planogramHeight);

    // Add measurement rulers
    this.addMeasurementRulers(pdf, planogramX, planogramY, planogramWidth, planogramHeight, store, scale);

    // Draw fixtures
    for (const fixture of planogram.layout.fixtures) {
      this.drawFixture(pdf, fixture, planogramX, planogramY, scale, options);
    }

    // Draw VM zone legend
    this.addVMZoneLegend(pdf, pageWidth - 3, this.margins.top + 1);

    // Add scale indicator
    this.addScaleIndicator(pdf, planogramX, planogramY + planogramHeight + 0.2, scale);

    // Add compliance indicators
    if (options.includeCompliance) {
      this.addComplianceIndicators(pdf, planogram, planogramX, planogramY, scale);
    }
  }

  private addMeasurementRulers(
    pdf: jsPDF,
    x: number,
    y: number,
    width: number,
    height: number,
    store: Store,
    scale: number
  ): void {
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');

    // Horizontal ruler (top)
    const rulerHeight = 0.2;
    pdf.setFillColor(240, 240, 240);
    pdf.rect(x, y - rulerHeight, width, rulerHeight, 'F');

    // Vertical ruler (left)
    const rulerWidth = 0.3;
    pdf.rect(x - rulerWidth, y, rulerWidth, height, 'F');

    // Add measurement marks and labels
    const unit = this.settings.measurementUnit;
    const interval = this.calculateRulerInterval(store.dimensions.width);

    // Horizontal measurements
    for (let i = 0; i <= store.dimensions.width; i += interval) {
      const markX = x + (i * scale);

      // Tick mark
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.005);
      pdf.line(markX, y - 0.05, markX, y);

      // Label
      if (i > 0) {
        pdf.text(`${i}${unit}`, markX, y - 0.1, { align: 'center' });
      }
    }

    // Vertical measurements
    for (let i = 0; i <= store.dimensions.height; i += interval) {
      const markY = y + (i * scale);

      // Tick mark
      pdf.line(x - 0.05, markY, x, markY);

      // Label
      if (i > 0) {
        pdf.text(`${i}${unit}`, x - 0.15, markY, { align: 'center', angle: 90 });
      }
    }
  }

  private drawFixture(
    pdf: jsPDF,
    fixture: Fixture,
    offsetX: number,
    offsetY: number,
    scale: number,
    options: PDFExportOptions
  ): void {
    const x = offsetX + (fixture.position.x * scale);
    const y = offsetY + (fixture.position.y * scale);
    const width = fixture.dimensions.width * scale;
    const height = fixture.dimensions.depth * scale;

    // VM zone color mapping
    const vmZoneColors = {
      eye: [16, 185, 129],      // Green
      reach: [59, 130, 246],    // Blue
      stretch: [245, 158, 11],  // Amber
      stoop: [107, 114, 128],   // Gray
      strike: [239, 68, 68]     // Red
    };

    const zoneColor = vmZoneColors[fixture.vmZone] || [156, 163, 175];

    // Draw fixture with VM zone color
    pdf.setFillColor(zoneColor[0], zoneColor[1], zoneColor[2], 0.3);
    pdf.setDrawColor(zoneColor[0], zoneColor[1], zoneColor[2]);
    pdf.setLineWidth(0.01);
    pdf.rect(x, y, width, height, 'FD');

    // Add fixture label
    pdf.setFontSize(6);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);

    const labelText = fixture.name || fixture.type;
    const labelX = x + width / 2;
    const labelY = y + height / 2;

    // Ensure text fits within fixture
    if (width > 0.5 && height > 0.3) {
      pdf.text(labelText, labelX, labelY, { align: 'center', maxWidth: width - 0.1 });
    }

    // Add fixture type indicator
    if (width > 0.3 && height > 0.2) {
      const typeIndicator = this.getFixtureTypeIndicator(fixture.type);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.text(typeIndicator, x + 0.05, y + 0.15);
    }

    // Add compliance indicator if there are issues
    if (fixture.complianceStatus !== 'compliant' && options.includeCompliance) {
      const indicatorColor = fixture.complianceStatus === 'violation' ? [255, 0, 0] : [255, 165, 0];
      pdf.setFillColor(indicatorColor[0], indicatorColor[1], indicatorColor[2]);
      pdf.circle(x + width - 0.1, y + 0.1, 0.05, 'F');
    }
  }

  private addVMZoneLegend(pdf: jsPDF, x: number, y: number): void {
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('VM Zone Legend', x, y);

    const zones = [
      { name: 'Eye Level (60-72")', color: [16, 185, 129], description: 'Best sellers' },
      { name: 'Reach Zone (48-60")', color: [59, 130, 246], description: 'Everyday items' },
      { name: 'Stretch Zone (72"+)', color: [245, 158, 11], description: 'Premium items' },
      { name: 'Stoop Zone (<48")', color: [107, 114, 128], description: 'Bulk/value items' }
    ];

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);

    zones.forEach((zone, index) => {
      const itemY = y + 0.3 + (index * 0.25);

      // Color square
      pdf.setFillColor(zone.color[0], zone.color[1], zone.color[2]);
      pdf.rect(x, itemY - 0.05, 0.1, 0.1, 'F');

      // Zone text
      pdf.setTextColor(0, 0, 0);
      pdf.text(zone.name, x + 0.15, itemY);
      pdf.text(zone.description, x + 0.15, itemY + 0.1);
    });
  }

  private addScaleIndicator(pdf: jsPDF, x: number, y: number, scale: number): void {
    const scaleBarLength = 1; // 1 inch on paper
    const actualLength = scaleBarLength / scale; // Actual length in store units

    // Draw scale bar
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.02);
    pdf.line(x, y, x + scaleBarLength, y);

    // Tick marks
    pdf.line(x, y - 0.05, x, y + 0.05);
    pdf.line(x + scaleBarLength, y - 0.05, x + scaleBarLength, y + 0.05);

    // Label
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${actualLength.toFixed(1)} ${this.settings.measurementUnit}`, x + scaleBarLength / 2, y - 0.1, { align: 'center' });
    pdf.text('Scale', x + scaleBarLength / 2, y + 0.15, { align: 'center' });
  }

  private addCompliancePage(pdf: jsPDF, planogram: Planogram, options: PDFExportOptions): void {
    const pageWidth = pdf.internal.pageSize.width;

    // Page title
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Compliance Report', pageWidth / 2, this.margins.top + 0.3, { align: 'center' });

    let currentY = this.margins.top + 0.8;

    // Overall compliance score
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    const scoreColor = planogram.compliance.score >= 95 ? [0, 128, 0] :
                      planogram.compliance.score >= 80 ? [255, 165, 0] : [255, 0, 0];
    pdf.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    pdf.text(`Overall Compliance Score: ${planogram.compliance.score}%`, this.margins.left, currentY);
    pdf.setTextColor(0, 0, 0);
    currentY += 0.5;

    // Violations
    if (planogram.compliance.violations.length > 0) {
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Critical Violations', this.margins.left, currentY);
      currentY += 0.3;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);

      planogram.compliance.violations.forEach((violation, index) => {
        if (currentY > pdf.internal.pageSize.height - 1) {
          pdf.addPage();
          currentY = this.margins.top;
        }

        pdf.setTextColor(255, 0, 0);
        pdf.text(`${index + 1}. ${violation.description}`, this.margins.left, currentY);
        currentY += 0.2;

        pdf.setTextColor(0, 0, 0);
        pdf.text(`   Recommendation: ${violation.recommendation}`, this.margins.left, currentY);
        currentY += 0.3;
      });
    }

    // Warnings
    if (planogram.compliance.warnings.length > 0) {
      currentY += 0.2;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Warnings', this.margins.left, currentY);
      currentY += 0.3;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);

      planogram.compliance.warnings.forEach((warning, index) => {
        if (currentY > pdf.internal.pageSize.height - 1) {
          pdf.addPage();
          currentY = this.margins.top;
        }

        pdf.setTextColor(255, 165, 0);
        pdf.text(`${index + 1}. ${warning.description}`, this.margins.left, currentY);
        currentY += 0.2;

        pdf.setTextColor(0, 0, 0);
        pdf.text(`   Recommendation: ${warning.recommendation}`, this.margins.left, currentY);
        currentY += 0.3;
      });
    }
  }

  private addPickListsPage(pdf: jsPDF, pickLists: any[], options: PDFExportOptions): void {
    // Implementation for pick lists page
  }

  private addTaskCardsPage(pdf: jsPDF, taskCards: any[], options: PDFExportOptions): void {
    // Implementation for task cards page
  }

  private addComplianceChecklistPage(pdf: jsPDF, checklist: any[], options: PDFExportOptions): void {
    // Implementation for compliance checklist page
  }

  private addFootersToAllPages(
    pdf: jsPDF,
    pageCount: number,
    planogram: Planogram,
    options: PDFExportOptions
  ): void {
    const totalPages = pdf.getNumberOfPages();

    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);

      const pageWidth = pdf.internal.pageSize.width;
      const pageHeight = pdf.internal.pageSize.height;
      const footerY = pageHeight - this.margins.bottom + 0.2;

      // Footer line
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.005);
      pdf.line(this.margins.left, footerY - 0.1, pageWidth - this.margins.right, footerY - 0.1);

      // Footer content
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(128, 128, 128);

      // Left side - planogram info
      pdf.text(`${planogram.name} v${planogram.version}`, this.margins.left, footerY);

      // Center - page number
      pdf.text(`Page ${i} of ${totalPages}`, pageWidth / 2, footerY, { align: 'center' });

      // Right side - generation info
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - this.margins.right, footerY, { align: 'right' });

      // Plugin attribution
      pdf.setFontSize(6);
      pdf.text('Generated with VM Planogram Enhanced for Obsidian', pageWidth - this.margins.right, footerY + 0.15, { align: 'right' });
    }
  }

  private addWatermark(pdf: jsPDF, watermarkText: string): void {
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(48);
    pdf.setTextColor(200, 200, 200, 0.3);

    // Rotate and center the watermark
    pdf.text(watermarkText, pageWidth / 2, pageHeight / 2, {
      align: 'center',
      angle: 45
    });
  }

  private addComplianceIndicators(
    pdf: jsPDF,
    planogram: Planogram,
    offsetX: number,
    offsetY: number,
    scale: number
  ): void {
    // Add visual indicators for compliance violations on the planogram
    planogram.compliance.violations.forEach(violation => {
      if (violation.fixtureId) {
        const fixture = planogram.layout.fixtures.find(f => f.id === violation.fixtureId);
        if (fixture) {
          const x = offsetX + (fixture.position.x * scale);
          const y = offsetY + (fixture.position.y * scale);

          // Red border for violations
          pdf.setDrawColor(255, 0, 0);
          pdf.setLineWidth(0.02);
          pdf.rect(x - 0.02, y - 0.02,
                  (fixture.dimensions.width * scale) + 0.04,
                  (fixture.dimensions.depth * scale) + 0.04);
        }
      }
    });
  }

  // === Utility Methods ===

  private calculateRulerInterval(dimension: number): number {
    if (dimension <= 10) return 1;
    if (dimension <= 50) return 5;
    if (dimension <= 100) return 10;
    return 20;
  }

  private getFixtureTypeIndicator(type: string): string {
    const indicators = {
      gondola: 'G',
      endcap: 'E',
      wall: 'W',
      table: 'T',
      rack: 'R',
      tower: 'O',
      custom: 'C'
    };
    return indicators[type] || '?';
  }

  private async generateExecutionMaterials(planogram: Planogram, store: Store): Promise<ExecutionMaterials> {
    // Generate execution materials based on planogram
    return {
      pickLists: [],
      taskCards: [],
      complianceChecklist: [],
      validationForm: []
    };
  }

  /**
   * Export planogram as high-resolution image
   */
  async exportAsImage(canvasElement: HTMLCanvasElement, format: 'png' | 'jpeg' = 'png'): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const dataURL = canvasElement.toDataURL(`image/${format}`, 1.0);
        resolve(dataURL);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Export planogram data as JSON
   */
  exportAsJSON(planogram: Planogram, store: Store): string {
    const exportData = {
      version: '2.0.0',
      exportDate: new Date().toISOString(),
      planogram,
      store
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Create printable measurement verification sheet
   */
  generateMeasurementVerificationPDF(
    planogram: Planogram,
    store: Store,
    options: PDFExportOptions
  ): PDFGenerationResult {
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'in',
        format: 'letter'
      });

      // Title
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Measurement Verification Sheet', 4.25, 1, { align: 'center' });

      // Instructions
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      let y = 1.5;

      const instructions = [
        'Use this sheet to verify the accuracy of your printed planogram:',
        '1. Print this page at 100% scale (no fitting to page)',
        '2. Use a ruler to measure the test squares below',
        '3. Each square should measure exactly 1 inch × 1 inch',
        '4. If measurements are incorrect, adjust your printer settings'
      ];

      instructions.forEach(instruction => {
        pdf.text(instruction, 0.5, y);
        y += 0.2;
      });

      // Test squares
      y = 3;
      pdf.setFont('helvetica', 'bold');
      pdf.text('Test Squares (Each should be 1" × 1"):', 0.5, y);

      // Draw test squares
      const squareSize = 1; // 1 inch
      const startX = 1;
      const startY = 3.5;

      for (let i = 0; i < 3; i++) {
        const x = startX + (i * 2);

        // Square outline
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.02);
        pdf.rect(x, startY, squareSize, squareSize);

        // Label
        pdf.setFontSize(8);
        pdf.text(`Square ${i + 1}`, x + squareSize / 2, startY + squareSize / 2, { align: 'center' });
      }

      // Scale information
      y = 6;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Scale Information:', 0.5, y);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      y += 0.3;
      pdf.text(`Planogram Scale: 1:${Math.round(12 / options.scale)}`, 0.5, y);
      y += 0.2;
      pdf.text(`Measurement Unit: ${this.settings.measurementUnit}`, 0.5, y);
      y += 0.2;
      pdf.text(`Print Scale: ${options.scale}`, 0.5, y);

      const pdfBlob = pdf.output('blob');
      const pdfDataURL = pdf.output('datauristring');

      return {
        success: true,
        pdfBlob,
        pdfDataURL,
        metadata: {
          pageCount: 1,
          fileSize: pdfBlob.size,
          generationTime: 0,
          scale: 1
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        metadata: {
          pageCount: 0,
          fileSize: 0,
          generationTime: 0,
          scale: 1
        }
      };
    }
  }
}