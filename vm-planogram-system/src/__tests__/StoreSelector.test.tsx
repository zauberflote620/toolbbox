import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StoreSelector from '../components/stores/StoreSelector';
import { Store } from '../types';

// Mock axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({
      data: [
        {
          id: '1',
          name: 'Test Store 1',
          location: 'Location 1',
          dimensions: { width: 50, height: 30 },
          constraints: {},
          trafficPatterns: []
        },
        {
          id: '2',
          name: 'Test Store 2',
          location: 'Location 2',
          dimensions: { width: 60, height: 40 },
          constraints: {},
          trafficPatterns: []
        }
      ]
    })),
    post: vi.fn(() => Promise.resolve({ data: {} })),
    put: vi.fn(() => Promise.resolve({ data: {} })),
    delete: vi.fn(() => Promise.resolve({ data: {} })),
  }
}));

describe('StoreSelector', () => {
  const mockOnStoreSelect = vi.fn();
  const mockOnStoreCreate = vi.fn();
  const mockOnStoreEdit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders store selector with stores list', async () => {
    render(
      <StoreSelector
        selectedStore={null}
        onStoreSelect={mockOnStoreSelect}
        onStoreCreate={mockOnStoreCreate}
        onStoreEdit={mockOnStoreEdit}
      />
    );

    expect(screen.getByText('Store Selection')).toBeInTheDocument();
    expect(screen.getByText('Create New Store')).toBeInTheDocument();

    // Wait for stores to load
    await waitFor(() => {
      expect(screen.getByText('Test Store 1')).toBeInTheDocument();
      expect(screen.getByText('Test Store 2')).toBeInTheDocument();
    });
  });

  it('displays store information correctly', async () => {
    render(
      <StoreSelector
        selectedStore={null}
        onStoreSelect={mockOnStoreSelect}
        onStoreCreate={mockOnStoreCreate}
        onStoreEdit={mockOnStoreEdit}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Location 1')).toBeInTheDocument();
      expect(screen.getByText('50\' × 30\'')).toBeInTheDocument();
      expect(screen.getByText('Location 2')).toBeInTheDocument();
      expect(screen.getByText('60\' × 40\'')).toBeInTheDocument();
    });
  });

  it('calls onStoreSelect when store is clicked', async () => {
    const user = userEvent.setup();
    render(
      <StoreSelector
        selectedStore={null}
        onStoreSelect={mockOnStoreSelect}
        onStoreCreate={mockOnStoreCreate}
        onStoreEdit={mockOnStoreEdit}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Test Store 1')).toBeInTheDocument();
    });

    const storeCard = screen.getByText('Test Store 1').closest('.cursor-pointer');
    if (storeCard) {
      await user.click(storeCard);
      expect(mockOnStoreSelect).toHaveBeenCalled();
    }
  });

  it('calls onStoreCreate when create button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <StoreSelector
        selectedStore={null}
        onStoreSelect={mockOnStoreSelect}
        onStoreCreate={mockOnStoreCreate}
        onStoreEdit={mockOnStoreEdit}
      />
    );

    const createButton = screen.getByText('Create New Store');
    await user.click(createButton);
    expect(mockOnStoreCreate).toHaveBeenCalled();
  });

  it('highlights selected store', async () => {
    const selectedStore: Store = {
      id: '1',
      name: 'Test Store 1',
      location: 'Location 1',
      dimensions: { width: 50, height: 30 },
      constraints: {},
      trafficPatterns: []
    };

    render(
      <StoreSelector
        selectedStore={selectedStore}
        onStoreSelect={mockOnStoreSelect}
        onStoreCreate={mockOnStoreCreate}
        onStoreEdit={mockOnStoreEdit}
      />
    );

    await waitFor(() => {
      const selectedCard = screen.getByText('Test Store 1').closest('.border-blue-500');
      expect(selectedCard).toBeInTheDocument();
    });
  });

  it('shows loading state initially', () => {
    render(
      <StoreSelector
        selectedStore={null}
        onStoreSelect={mockOnStoreSelect}
        onStoreCreate={mockOnStoreCreate}
        onStoreEdit={mockOnStoreEdit}
      />
    );

    expect(screen.getByText('Loading stores...')).toBeInTheDocument();
  });
});