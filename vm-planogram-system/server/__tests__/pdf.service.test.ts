import { describe, it, expect, vi, beforeEach } from 'vitest';
import { pdfService } from '../services/pdf.service';
import puppeteer from 'puppeteer';

// Mock Puppeteer
vi.mock('puppeteer', () => ({
  default: {
    launch: vi.fn()
  }
}));

// Mock Prisma
vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => ({
    planogram: {
      findUnique: vi.fn()
    },
    store: {
      findUnique: vi.fn()
    },
    storeFixture: {
      findMany: vi.fn()
    }
  }))
}));

describe('PDF Service', () => {
  const mockBrowser = {
    newPage: vi.fn(),
    close: vi.fn()
  };

  const mockPage = {
    setContent: vi.fn(),
    setViewport: vi.fn(),
    pdf: vi.fn(),
    emulateMediaType: vi.fn(),
    addStyleTag: vi.fn(),
    close: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(puppeteer.launch).mockResolvedValue(mockBrowser as any);
    mockBrowser.newPage.mockResolvedValue(mockPage as any);
    mockPage.pdf.mockResolvedValue(Buffer.from('mock-pdf-content'));
  });

  describe('generatePlanogramPDF', () => {
    const mockPlanogram = {
      id: 'planogram-1',
      name: 'Test Planogram',
      storeId: 'store-1',
      layoutData: {
        fixtures: [
          {
            id: 'fixture-1',
            fixtureId: 'f1',
            x: 10,
            y: 10,
            rotation: 0,
            fixture: {
              name: 'Wire Shelf',
              dimensions: { width: 48, depth: 18, height: 72 }
            }
          }
        ],
        products: [],
        trafficFlow: {
          primaryPath: [{ x: 2, y: 5 }, { x: 35, y: 5 }],
          secondaryPaths: [],
          hotspots: [{ x: 10, y: 10 }]
        }
      },
      parsedInsights: [],
      notes: 'Test notes'
    };

    const mockStore = {
      id: 'store-1',
      name: 'Test Store',
      dimensions: { width: 40, height: 30, ceilingHeight: 12 },
      constraints: {
        entryPoints: [{ x: 2, y: 0 }],
        pillars: [],
        utilities: [],
        safetyRequirements: []
      }
    };

    it('should generate PDF with default options', async () => {
      const options = {
        format: 'letter' as const,
        orientation: 'landscape' as const,
        includeGrid: true,
        includeVMZones: true,
        includeMeasurements: true,
        includePickLists: false
      };

      // Mock database calls
      const { PrismaClient } = await import('@prisma/client');
      const mockPrisma = new PrismaClient() as any;
      mockPrisma.planogram.findUnique.mockResolvedValue(mockPlanogram);
      mockPrisma.store.findUnique.mockResolvedValue(mockStore);

      const result = await pdfService.generatePlanogramPDF('planogram-1', options);

      expect(puppeteer.launch).toHaveBeenCalledWith({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      expect(mockPage.setViewport).toHaveBeenCalledWith({
        width: 1200,
        height: 800
      });

      expect(mockPage.pdf).toHaveBeenCalledWith({
        format: 'letter',
        landscape: true,
        printBackground: true,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px'
        }
      });

      expect(result).toBeInstanceOf(Buffer);
      expect(mockBrowser.close).toHaveBeenCalled();
    });

    it('should generate PDF with A4 format and portrait orientation', async () => {
      const options = {
        format: 'a4' as const,
        orientation: 'portrait' as const,
        includeGrid: false,
        includeVMZones: false,
        includeMeasurements: false,
        includePickLists: false
      };

      const { PrismaClient } = await import('@prisma/client');
      const mockPrisma = new PrismaClient() as any;
      mockPrisma.planogram.findUnique.mockResolvedValue(mockPlanogram);
      mockPrisma.store.findUnique.mockResolvedValue(mockStore);

      await pdfService.generatePlanogramPDF('planogram-1', options);

      expect(mockPage.pdf).toHaveBeenCalledWith({
        format: 'a4',
        landscape: false,
        printBackground: true,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px'
        }
      });
    });

    it('should handle planogram not found', async () => {
      const { PrismaClient } = await import('@prisma/client');
      const mockPrisma = new PrismaClient() as any;
      mockPrisma.planogram.findUnique.mockResolvedValue(null);

      const options = {
        format: 'letter' as const,
        orientation: 'landscape' as const,
        includeGrid: true,
        includeVMZones: true,
        includeMeasurements: true,
        includePickLists: false
      };

      await expect(
        pdfService.generatePlanogramPDF('nonexistent', options)
      ).rejects.toThrow('Planogram not found');
    });

    it('should handle store not found', async () => {
      const { PrismaClient } = await import('@prisma/client');
      const mockPrisma = new PrismaClient() as any;
      mockPrisma.planogram.findUnique.mockResolvedValue(mockPlanogram);
      mockPrisma.store.findUnique.mockResolvedValue(null);

      const options = {
        format: 'letter' as const,
        orientation: 'landscape' as const,
        includeGrid: true,
        includeVMZones: true,
        includeMeasurements: true,
        includePickLists: false
      };

      await expect(
        pdfService.generatePlanogramPDF('planogram-1', options)
      ).rejects.toThrow('Store not found');
    });

    it('should close browser on error', async () => {
      const { PrismaClient } = await import('@prisma/client');
      const mockPrisma = new PrismaClient() as any;
      mockPrisma.planogram.findUnique.mockResolvedValue(mockPlanogram);
      mockPrisma.store.findUnique.mockResolvedValue(mockStore);

      mockPage.pdf.mockRejectedValue(new Error('PDF generation failed'));

      const options = {
        format: 'letter' as const,
        orientation: 'landscape' as const,
        includeGrid: true,
        includeVMZones: true,
        includeMeasurements: true,
        includePickLists: false
      };

      await expect(
        pdfService.generatePlanogramPDF('planogram-1', options)
      ).rejects.toThrow('PDF generation failed');

      expect(mockBrowser.close).toHaveBeenCalled();
    });

    it('should include grid and VM zones when requested', async () => {
      const { PrismaClient } = await import('@prisma/client');
      const mockPrisma = new PrismaClient() as any;
      mockPrisma.planogram.findUnique.mockResolvedValue(mockPlanogram);
      mockPrisma.store.findUnique.mockResolvedValue(mockStore);

      const options = {
        format: 'letter' as const,
        orientation: 'landscape' as const,
        includeGrid: true,
        includeVMZones: true,
        includeMeasurements: true,
        includePickLists: false
      };

      await pdfService.generatePlanogramPDF('planogram-1', options);

      // Verify HTML content includes grid and VM zone styles
      expect(mockPage.setContent).toHaveBeenCalledWith(
        expect.stringContaining('grid')
      );
      expect(mockPage.setContent).toHaveBeenCalledWith(
        expect.stringContaining('vm-zone')
      );
    });
  });

  describe('generatePickListPDF', () => {
    it('should generate pick list PDF', async () => {
      const mockPlanogram = {
        id: 'planogram-1',
        name: 'Test Planogram',
        layoutData: {
          fixtures: [
            {
              fixture: {
                name: 'Wire Shelf',
                ulineSku: 'H-1848-CHROME'
              }
            }
          ]
        }
      };

      const { PrismaClient } = await import('@prisma/client');
      const mockPrisma = new PrismaClient() as any;
      mockPrisma.planogram.findUnique.mockResolvedValue(mockPlanogram);

      const result = await pdfService.generatePickListPDF('planogram-1');

      expect(result).toBeInstanceOf(Buffer);
      expect(mockPage.setContent).toHaveBeenCalledWith(
        expect.stringContaining('Pick List')
      );
    });

    it('should handle planogram not found for pick list', async () => {
      const { PrismaClient } = await import('@prisma/client');
      const mockPrisma = new PrismaClient() as any;
      mockPrisma.planogram.findUnique.mockResolvedValue(null);

      await expect(
        pdfService.generatePickListPDF('nonexistent')
      ).rejects.toThrow('Planogram not found');
    });
  });

  describe('generateTaskCardsPDF', () => {
    it('should generate task cards PDF', async () => {
      const mockPlanogram = {
        id: 'planogram-1',
        name: 'Test Planogram',
        layoutData: {
          fixtures: [
            {
              fixture: {
                name: 'Wire Shelf',
                ulineSku: 'H-1848-CHROME'
              },
              x: 10,
              y: 10
            }
          ]
        }
      };

      const { PrismaClient } = await import('@prisma/client');
      const mockPrisma = new PrismaClient() as any;
      mockPrisma.planogram.findUnique.mockResolvedValue(mockPlanogram);

      const result = await pdfService.generateTaskCardsPDF('planogram-1');

      expect(result).toBeInstanceOf(Buffer);
      expect(mockPage.setContent).toHaveBeenCalledWith(
        expect.stringContaining('Task Cards')
      );
    });

    it('should handle planogram not found for task cards', async () => {
      const { PrismaClient } = await import('@prisma/client');
      const mockPrisma = new PrismaClient() as any;
      mockPrisma.planogram.findUnique.mockResolvedValue(null);

      await expect(
        pdfService.generateTaskCardsPDF('nonexistent')
      ).rejects.toThrow('Planogram not found');
    });
  });
});