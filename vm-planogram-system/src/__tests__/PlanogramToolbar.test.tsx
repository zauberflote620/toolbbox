import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PlanogramToolbar from '../components/planogram/PlanogramToolbar';

describe('PlanogramToolbar', () => {
  const mockOnModeChange = vi.fn();
  const mockOnZoomChange = vi.fn();
  const mockOnGridToggle = vi.fn();
  const mockOnSave = vi.fn();
  const mockOnExport = vi.fn();

  const defaultProps = {
    mode: 'select' as const,
    zoom: 1,
    gridVisible: true,
    onModeChange: mockOnModeChange,
    onZoomChange: mockOnZoomChange,
    onGridToggle: mockOnGridToggle,
    onSave: mockOnSave,
    onExport: mockOnExport,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders toolbar with all controls', () => {
    render(<PlanogramToolbar {...defaultProps} />);

    expect(screen.getByText('Select')).toBeInTheDocument();
    expect(screen.getByText('Place')).toBeInTheDocument();
    expect(screen.getByText('Measure')).toBeInTheDocument();
    expect(screen.getByText('Grid')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Export')).toBeInTheDocument();
  });

  it('highlights active mode', () => {
    render(<PlanogramToolbar {...defaultProps} mode="place" />);

    const placeButton = screen.getByText('Place');
    expect(placeButton.closest('button')).toHaveClass('bg-blue-600');

    const selectButton = screen.getByText('Select');
    expect(selectButton.closest('button')).not.toHaveClass('bg-blue-600');
  });

  it('calls onModeChange when mode buttons are clicked', async () => {
    const user = userEvent.setup();
    render(<PlanogramToolbar {...defaultProps} />);

    await user.click(screen.getByText('Place'));
    expect(mockOnModeChange).toHaveBeenCalledWith('place');

    await user.click(screen.getByText('Measure'));
    expect(mockOnModeChange).toHaveBeenCalledWith('measure');
  });

  it('displays current zoom level', () => {
    render(<PlanogramToolbar {...defaultProps} zoom={1.5} />);

    expect(screen.getByText('150%')).toBeInTheDocument();
  });

  it('calls onZoomChange when zoom buttons are clicked', async () => {
    const user = userEvent.setup();
    render(<PlanogramToolbar {...defaultProps} />);

    const zoomInButton = screen.getByLabelText('Zoom in');
    await user.click(zoomInButton);
    expect(mockOnZoomChange).toHaveBeenCalledWith(1.1);

    const zoomOutButton = screen.getByLabelText('Zoom out');
    await user.click(zoomOutButton);
    expect(mockOnZoomChange).toHaveBeenCalledWith(0.9);
  });

  it('calls onGridToggle when grid button is clicked', async () => {
    const user = userEvent.setup();
    render(<PlanogramToolbar {...defaultProps} />);

    await user.click(screen.getByText('Grid'));
    expect(mockOnGridToggle).toHaveBeenCalled();
  });

  it('highlights grid button when grid is visible', () => {
    render(<PlanogramToolbar {...defaultProps} gridVisible={true} />);

    const gridButton = screen.getByText('Grid');
    expect(gridButton.closest('button')).toHaveClass('bg-gray-200');
  });

  it('calls onSave when save button is clicked', async () => {
    const user = userEvent.setup();
    render(<PlanogramToolbar {...defaultProps} />);

    await user.click(screen.getByText('Save'));
    expect(mockOnSave).toHaveBeenCalled();
  });

  it('calls onExport when export button is clicked', async () => {
    const user = userEvent.setup();
    render(<PlanogramToolbar {...defaultProps} />);

    await user.click(screen.getByText('Export'));
    expect(mockOnExport).toHaveBeenCalled();
  });

  it('limits zoom to reasonable bounds', async () => {
    const user = userEvent.setup();

    // Test max zoom
    render(<PlanogramToolbar {...defaultProps} zoom={3} />);
    const zoomInButton = screen.getByLabelText('Zoom in');
    await user.click(zoomInButton);
    expect(mockOnZoomChange).not.toHaveBeenCalled();

    // Test min zoom
    vi.clearAllMocks();
    render(<PlanogramToolbar {...defaultProps} zoom={0.1} />);
    const zoomOutButton = screen.getByLabelText('Zoom out');
    await user.click(zoomOutButton);
    expect(mockOnZoomChange).not.toHaveBeenCalled();
  });

  it('has proper accessibility attributes', () => {
    render(<PlanogramToolbar {...defaultProps} />);

    expect(screen.getByLabelText('Zoom in')).toBeInTheDocument();
    expect(screen.getByLabelText('Zoom out')).toBeInTheDocument();
    expect(screen.getByLabelText('Reset zoom')).toBeInTheDocument();
  });
});