import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PDFGenerator from '../components/pdf/PDFGenerator';
import { pdfService } from '../services/pdf.service';
import { Planogram } from '../types';

// Mock the PDF service
vi.mock('../services/pdf.service', () => ({
  pdfService: {
    generatePlanogramPDF: vi.fn(),
    generatePickListPDF: vi.fn(),
    generateTaskCardsPDF: vi.fn()
  }
}));

const mockPlanogram: Planogram = {
  id: 'test-planogram-1',
  storeId: 'test-store-1',
  name: 'Test Planogram',
  version: 1,
  status: 'DRAFT',
  analyticsInput: 'Test analytics',
  parsedInsights: [],
  layoutData: {
    fixtures: [],
    products: [],
    trafficFlow: {
      primaryPath: [],
      secondaryPaths: [],
      hotspots: []
    }
  },
  notes: 'Test notes',
  createdBy: 'test-user',
  createdAt: new Date(),
  updatedAt: new Date()
};

describe('PDFGenerator', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render PDF generator dialog', () => {
    render(<PDFGenerator planogram={mockPlanogram} onClose={mockOnClose} />);

    expect(screen.getByText('Generate PDF')).toBeInTheDocument();
    expect(screen.getByText('Test Planogram')).toBeInTheDocument();
  });

  it('should show all PDF format options', () => {
    render(<PDFGenerator planogram={mockPlanogram} onClose={mockOnClose} />);

    expect(screen.getByDisplayValue('letter')).toBeInTheDocument();
    expect(screen.getByDisplayValue('landscape')).toBeInTheDocument();
  });

  it('should show all content options', () => {
    render(<PDFGenerator planogram={mockPlanogram} onClose={mockOnClose} />);

    expect(screen.getByLabelText(/Include Grid Lines/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Include VM Zone Legend/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Include Measurements & Analysis/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Include Pick Lists/)).toBeInTheDocument();
  });

  it('should update options when changed', () => {
    render(<PDFGenerator planogram={mockPlanogram} onClose={mockOnClose} />);

    const formatSelect = screen.getByDisplayValue('letter');
    fireEvent.change(formatSelect, { target: { value: 'a4' } });

    expect(formatSelect).toHaveValue('a4');
  });

  it('should toggle content options', () => {
    render(<PDFGenerator planogram={mockPlanogram} onClose={mockOnClose} />);

    const gridCheckbox = screen.getByLabelText(/Include Grid Lines/);
    expect(gridCheckbox).toBeChecked();

    fireEvent.click(gridCheckbox);
    expect(gridCheckbox).not.toBeChecked();
  });

  it('should generate PDF when button clicked', async () => {
    const mockBlob = new Blob(['test'], { type: 'application/pdf' });
    vi.mocked(pdfService.generatePlanogramPDF).mockResolvedValue(mockBlob);

    // Mock URL methods
    const mockCreateObjectURL = vi.fn(() => 'mock-url');
    const mockRevokeObjectURL = vi.fn();
    global.URL.createObjectURL = mockCreateObjectURL;
    global.URL.revokeObjectURL = mockRevokeObjectURL;

    // Mock document methods
    const mockClick = vi.fn();
    const mockAppendChild = vi.fn();
    const mockRemoveChild = vi.fn();
    const mockLink = {
      href: '',
      download: '',
      click: mockClick
    } as any;

    vi.spyOn(document, 'createElement').mockReturnValue(mockLink);
    vi.spyOn(document.body, 'appendChild').mockImplementation(mockAppendChild);
    vi.spyOn(document.body, 'removeChild').mockImplementation(mockRemoveChild);

    render(<PDFGenerator planogram={mockPlanogram} onClose={mockOnClose} />);

    const generateButton = screen.getByText('Generate PDF');
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(pdfService.generatePlanogramPDF).toHaveBeenCalledWith(
        'test-planogram-1',
        expect.objectContaining({
          format: 'letter',
          orientation: 'landscape'
        })
      );
    });
  });

  it('should show error message on PDF generation failure', async () => {
    vi.mocked(pdfService.generatePlanogramPDF).mockRejectedValue(
      new Error('PDF generation failed')
    );

    render(<PDFGenerator planogram={mockPlanogram} onClose={mockOnClose} />);

    const generateButton = screen.getByText('Generate PDF');
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText('PDF generation failed')).toBeInTheDocument();
    });
  });

  it('should close dialog when close button clicked', () => {
    render(<PDFGenerator planogram={mockPlanogram} onClose={mockOnClose} />);

    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should close dialog when cancel button clicked', () => {
    render(<PDFGenerator planogram={mockPlanogram} onClose={mockOnClose} />);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });
});