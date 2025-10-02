import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AnalyticsInput from '../components/analytics/AnalyticsInput';

describe('AnalyticsInput', () => {
  const mockOnAnalyticsSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders analytics input form', () => {
    render(<AnalyticsInput onAnalyticsSubmit={mockOnAnalyticsSubmit} />);

    expect(screen.getByText('Analytics Insights')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your business analytics insights/)).toBeInTheDocument();
    expect(screen.getByText('Analyze Insights')).toBeInTheDocument();
  });

  it('shows example text initially', () => {
    render(<AnalyticsInput onAnalyticsSubmit={mockOnAnalyticsSubmit} />);

    expect(screen.getByText(/Electronics are our bestsellers/)).toBeInTheDocument();
    expect(screen.getByText(/Customers who buy phones also purchase cases/)).toBeInTheDocument();
  });

  it('allows text input in textarea', async () => {
    const user = userEvent.setup();
    render(<AnalyticsInput onAnalyticsSubmit={mockOnAnalyticsSubmit} />);

    const textarea = screen.getByPlaceholderText(/Enter your business analytics insights/);
    await user.clear(textarea);
    await user.type(textarea, 'Test analytics input');

    expect(textarea).toHaveValue('Test analytics input');
  });

  it('calls onAnalyticsSubmit when form is submitted', async () => {
    const user = userEvent.setup();
    render(<AnalyticsInput onAnalyticsSubmit={mockOnAnalyticsSubmit} />);

    const textarea = screen.getByPlaceholderText(/Enter your business analytics insights/);
    await user.clear(textarea);
    await user.type(textarea, 'Test analytics input');

    const submitButton = screen.getByText('Analyze Insights');
    await user.click(submitButton);

    expect(mockOnAnalyticsSubmit).toHaveBeenCalledWith('Test analytics input');
  });

  it('prevents submission with empty text', async () => {
    const user = userEvent.setup();
    render(<AnalyticsInput onAnalyticsSubmit={mockOnAnalyticsSubmit} />);

    const textarea = screen.getByPlaceholderText(/Enter your business analytics insights/);
    await user.clear(textarea);

    const submitButton = screen.getByText('Analyze Insights');
    await user.click(submitButton);

    // Should not call onAnalyticsSubmit with empty string
    expect(mockOnAnalyticsSubmit).not.toHaveBeenCalled();
  });

  it('shows loading state during analysis', async () => {
    const user = userEvent.setup();

    // Mock a delayed response
    const delayedMock = vi.fn().mockImplementation(() =>
      new Promise(resolve => setTimeout(resolve, 100))
    );

    render(<AnalyticsInput onAnalyticsSubmit={delayedMock} />);

    const textarea = screen.getByPlaceholderText(/Enter your business analytics insights/);
    await user.type(textarea, 'Test analytics input');

    const submitButton = screen.getByText('Analyze Insights');
    await user.click(submitButton);

    // Should show loading state
    expect(screen.getByText('Analyzing...')).toBeInTheDocument();
  });

  it('provides helpful placeholder text', () => {
    render(<AnalyticsInput onAnalyticsSubmit={mockOnAnalyticsSubmit} />);

    const textarea = screen.getByPlaceholderText(/Enter your business analytics insights/);
    expect(textarea.placeholder).toContain('sales trends');
    expect(textarea.placeholder).toContain('profit margins');
    expect(textarea.placeholder).toContain('customer behavior');
  });

  it('has proper accessibility attributes', () => {
    render(<AnalyticsInput onAnalyticsSubmit={mockOnAnalyticsSubmit} />);

    const textarea = screen.getByPlaceholderText(/Enter your business analytics insights/);
    expect(textarea).toHaveAttribute('aria-label');

    const submitButton = screen.getByText('Analyze Insights');
    expect(submitButton).toHaveAttribute('type', 'submit');
  });
});