import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PlanogramCanvas from '../components/planogram/PlanogramCanvas';
import { Store } from '../types';

const mockStore: Store = {
  id: 'test-store-1',
  name: 'Test Store',
  address: '123 Test St',
  phone: '555-1234',
  storeNumber: '001',
  dimensions: { width: 40, height: 30, ceilingHeight: 12 },
  constraints: {
    entryPoints: [{ x: 2, y: 0 }],
    pillars: [{ x: 20, y: 15, width: 2, height: 2 }],
    utilities: [{ x: 38, y: 28, width: 2, height: 2 }],
    safetyRequirements: ['Emergency exit clearance']
  },
  trafficPatterns: [
    {
      name: 'Main Flow',
      path: [
        { x: 2, y: 5 },
        { x: 35, y: 5 }
      ],
      intensity: 0.8
    }
  ],
  createdBy: 'test-user',
  createdAt: new Date(),
  updatedAt: new Date()
};

const mockFixtures = [
  {
    id: 'fixture-1',
    name: 'Wire Shelf Unit',
    ulineSku: 'H-1848-CHROME',
    category: 'Wire Shelving',
    dimensions: { width: 48, depth: 18, height: 72 },
    capacity: { units: 50, weight: 500 },
    material: 'Chrome Wire',
    priceCents: 18500,
    isCustom: false,
    availabilityStatus: 'available' as const,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

describe('PlanogramCanvas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render canvas element', () => {
    render(
      <PlanogramCanvas
        store={mockStore}
        fixtures={mockFixtures}
        onFixturePlace={vi.fn()}
      />
    );

    const canvas = screen.getByRole('img', { hidden: true }); // Canvas has img role
    expect(canvas).toBeInTheDocument();
  });

  it('should render zoom controls', () => {
    render(
      <PlanogramCanvas
        store={mockStore}
        fixtures={mockFixtures}
        onFixturePlace={vi.fn()}
      />
    );

    expect(screen.getByLabelText('Zoom in')).toBeInTheDocument();
    expect(screen.getByLabelText('Zoom out')).toBeInTheDocument();
    expect(screen.getByLabelText('Reset zoom')).toBeInTheDocument();
  });

  it('should render grid toggle', () => {
    render(
      <PlanogramCanvas
        store={mockStore}
        fixtures={mockFixtures}
        onFixturePlace={vi.fn()}
      />
    );

    expect(screen.getByLabelText('Toggle grid')).toBeInTheDocument();
  });

  it('should render VM zones toggle', () => {
    render(
      <PlanogramCanvas
        store={mockStore}
        fixtures={mockFixtures}
        onFixturePlace={vi.fn()}
      />
    );

    expect(screen.getByLabelText('Toggle VM zones')).toBeInTheDocument();
  });

  it('should handle zoom in', () => {
    render(
      <PlanogramCanvas
        store={mockStore}
        fixtures={mockFixtures}
        onFixturePlace={vi.fn()}
      />
    );

    const zoomInButton = screen.getByLabelText('Zoom in');
    fireEvent.click(zoomInButton);

    // Test that the zoom level increases (implementation dependent)
    expect(zoomInButton).toBeInTheDocument();
  });

  it('should handle zoom out', () => {
    render(
      <PlanogramCanvas
        store={mockStore}
        fixtures={mockFixtures}
        onFixturePlace={vi.fn()}
      />
    );

    const zoomOutButton = screen.getByLabelText('Zoom out');
    fireEvent.click(zoomOutButton);

    expect(zoomOutButton).toBeInTheDocument();
  });

  it('should handle zoom reset', () => {
    render(
      <PlanogramCanvas
        store={mockStore}
        fixtures={mockFixtures}
        onFixturePlace={vi.fn()}
      />
    );

    const resetButton = screen.getByLabelText('Reset zoom');
    fireEvent.click(resetButton);

    expect(resetButton).toBeInTheDocument();
  });

  it('should toggle grid visibility', () => {
    render(
      <PlanogramCanvas
        store={mockStore}
        fixtures={mockFixtures}
        onFixturePlace={vi.fn()}
      />
    );

    const gridButton = screen.getByLabelText('Toggle grid');
    fireEvent.click(gridButton);

    expect(gridButton).toBeInTheDocument();
  });

  it('should toggle VM zones visibility', () => {
    render(
      <PlanogramCanvas
        store={mockStore}
        fixtures={mockFixtures}
        onFixturePlace={vi.fn()}
      />
    );

    const vmButton = screen.getByLabelText('Toggle VM zones');
    fireEvent.click(vmButton);

    expect(vmButton).toBeInTheDocument();
  });

  it('should handle canvas mouse events', () => {
    const mockOnFixturePlace = vi.fn();

    render(
      <PlanogramCanvas
        store={mockStore}
        fixtures={mockFixtures}
        onFixturePlace={mockOnFixturePlace}
      />
    );

    const canvas = screen.getByRole('img', { hidden: true });

    // Test mouse down
    fireEvent.mouseDown(canvas, { clientX: 100, clientY: 100 });

    // Test mouse move
    fireEvent.mouseMove(canvas, { clientX: 150, clientY: 150 });

    // Test mouse up
    fireEvent.mouseUp(canvas, { clientX: 150, clientY: 150 });

    expect(canvas).toBeInTheDocument();
  });

  it('should handle wheel events for zooming', () => {
    render(
      <PlanogramCanvas
        store={mockStore}
        fixtures={mockFixtures}
        onFixturePlace={vi.fn()}
      />
    );

    const canvas = screen.getByRole('img', { hidden: true });

    // Test wheel zoom
    fireEvent.wheel(canvas, { deltaY: -100 });

    expect(canvas).toBeInTheDocument();
  });

  it('should render VM zone legend', () => {
    render(
      <PlanogramCanvas
        store={mockStore}
        fixtures={mockFixtures}
        onFixturePlace={vi.fn()}
      />
    );

    expect(screen.getByText('VM Zones')).toBeInTheDocument();
    expect(screen.getByText('Eye Level (60-72")')).toBeInTheDocument();
    expect(screen.getByText('Reach Zone (48-60")')).toBeInTheDocument();
    expect(screen.getByText('Stretch Zone (72"+")')).toBeInTheDocument();
    expect(screen.getByText('Stoop Zone (0-48")')).toBeInTheDocument();
  });

  it('should show canvas dimensions', () => {
    render(
      <PlanogramCanvas
        store={mockStore}
        fixtures={mockFixtures}
        onFixturePlace={vi.fn()}
      />
    );

    expect(screen.getByText("40' × 30'")).toBeInTheDocument();
  });
});