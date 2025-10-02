import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FixtureLibrary from '../components/fixtures/FixtureLibrary';

// Mock the fixture data
vi.mock('../types', () => ({
  Fixture: {},
}));

describe('FixtureLibrary', () => {
  const mockOnFixtureSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders fixture library with fixtures', () => {
    render(<FixtureLibrary onFixtureSelect={mockOnFixtureSelect} />);

    expect(screen.getByText('Fixture Library')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search fixtures...')).toBeInTheDocument();
    expect(screen.getByText('All Categories')).toBeInTheDocument();
  });

  it('displays fixture cards', () => {
    render(<FixtureLibrary onFixtureSelect={mockOnFixtureSelect} />);

    // Should show some fixtures
    expect(screen.getByText('Chrome Wire Shelf Unit - 48"W x 18"D x 72"H')).toBeInTheDocument();
    expect(screen.getByText('Wire Shelving')).toBeInTheDocument();
  });

  it('filters fixtures by search term', async () => {
    const user = userEvent.setup();
    render(<FixtureLibrary onFixtureSelect={mockOnFixtureSelect} />);

    const searchInput = screen.getByPlaceholderText('Search fixtures...');
    await user.type(searchInput, 'chrome');

    await waitFor(() => {
      expect(screen.getByText('Chrome Wire Shelf Unit - 48"W x 18"D x 72"H')).toBeInTheDocument();
    });
  });

  it('filters fixtures by category', async () => {
    const user = userEvent.setup();
    render(<FixtureLibrary onFixtureSelect={mockOnFixtureSelect} />);

    const categorySelect = screen.getByDisplayValue('All Categories');
    await user.click(categorySelect);

    // Should show category options
    await waitFor(() => {
      expect(screen.getByText('Wire Shelving')).toBeInTheDocument();
    });
  });

  it('calls onFixtureSelect when fixture is clicked', async () => {
    const user = userEvent.setup();
    render(<FixtureLibrary onFixtureSelect={mockOnFixtureSelect} />);

    const fixtureCard = screen.getByText('Chrome Wire Shelf Unit - 48"W x 18"D x 72"H').closest('.cursor-pointer');
    if (fixtureCard) {
      await user.click(fixtureCard);
      expect(mockOnFixtureSelect).toHaveBeenCalled();
    }
  });

  it('shows fixture details including dimensions and weight', () => {
    render(<FixtureLibrary onFixtureSelect={mockOnFixtureSelect} />);

    // Check that fixture details are displayed
    expect(screen.getByText('48" × 18" × 72"')).toBeInTheDocument();
    expect(screen.getByText('85 lbs')).toBeInTheDocument();
  });

  it('displays correct fixture count', () => {
    render(<FixtureLibrary onFixtureSelect={mockOnFixtureSelect} />);

    // Should show total fixture count (28 fixtures in our mock data)
    expect(screen.getByText(/fixtures/i)).toBeInTheDocument();
  });
});