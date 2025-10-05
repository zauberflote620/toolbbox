import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App.jsx';

// Mock the aiClient module
vi.mock('../aiClient.js', () => ({
  generateNewPlan: vi.fn().mockResolvedValue({
    shopName: "Test Shop",
    lastUpdated: "2024-01-15",
    methodology: "Anchor-and-Spokes",
    generatedBy: "Enhanced Mock AI",
    sections: [
      {
        name: "Front Window",
        items: [
          { name: "New Winter Coats (Anchor)", priority: "high" }
        ]
      }
    ],
    vmRecommendations: [
      "Position seasonal anchors at eye level",
      "Create seasonal vignettes with complementary spokes"
    ]
  })
}));

describe('Shop Reset Kit App', () => {
  it('renders the main heading', () => {
    render(<App />);
    expect(screen.getByText('🏪 Shop Reset Kit')).toBeInTheDocument();
  });

  it('displays the methodology information', () => {
    render(<App />);
    expect(screen.getByText(/Anchor-and-Spokes methodology/i)).toBeInTheDocument();
  });

  it('shows the initial plan sections', () => {
    render(<App />);
    expect(screen.getByText('📍 Front Window')).toBeInTheDocument();
    expect(screen.getByText('📍 Main Floor')).toBeInTheDocument();
    expect(screen.getByText('📍 Back Wall')).toBeInTheDocument();
    expect(screen.getByText('📍 Checkout Area')).toBeInTheDocument();
  });

  it('allows editing goals', () => {
    render(<App />);
    const goalsTextarea = screen.getByPlaceholderText(/Emphasize seasonal items/i);
    fireEvent.change(goalsTextarea, {
      target: { value: 'Focus on winter clearance items' }
    });
    expect(goalsTextarea.value).toBe('Focus on winter clearance items');
  });

  it('handles plan generation', async () => {
    render(<App />);
    const generateButton = screen.getByText('🤖 Generate Optimized Plan');

    fireEvent.click(generateButton);

    // Should show loading state
    expect(screen.getByText('🤖 Analyzing...')).toBeInTheDocument();

    // Wait for plan to be generated
    await waitFor(() => {
      expect(screen.getByText('Enhanced Mock AI')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('displays priority badges correctly', () => {
    render(<App />);

    // Check for priority badges
    const highPriorityBadges = screen.getAllByText('HIGH');
    const mediumPriorityBadges = screen.getAllByText('MEDIUM');
    const lowPriorityBadges = screen.getAllByText('LOW');

    expect(highPriorityBadges.length).toBeGreaterThan(0);
    expect(mediumPriorityBadges.length).toBeGreaterThan(0);
    expect(lowPriorityBadges.length).toBeGreaterThan(0);
  });

  it('exports plan when export button is clicked', () => {
    // Mock document.createElement and click
    const mockLink = {
      setAttribute: vi.fn(),
      click: vi.fn()
    };
    vi.spyOn(document, 'createElement').mockReturnValue(mockLink);

    render(<App />);
    const exportButton = screen.getByText('📥 Export Plan');

    fireEvent.click(exportButton);

    expect(mockLink.setAttribute).toHaveBeenCalledWith('href', expect.stringContaining('data:application/json'));
    expect(mockLink.setAttribute).toHaveBeenCalledWith('download', expect.stringContaining('shop-plan-'));
    expect(mockLink.click).toHaveBeenCalled();
  });

  it('shows VM recommendations when available', async () => {
    render(<App />);
    const generateButton = screen.getByText('🤖 Generate Optimized Plan');

    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText('💡 VM Recommendations')).toBeInTheDocument();
      expect(screen.getByText('Position seasonal anchors at eye level')).toBeInTheDocument();
    });
  });
});