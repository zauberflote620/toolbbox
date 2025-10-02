import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StoreManager from '../components/stores/StoreManager';
import { storeService } from '../services/store.service';

// Mock the store service
vi.mock('../services/store.service', () => ({
  storeService: {
    getStores: vi.fn(),
    createStore: vi.fn(),
    updateStore: vi.fn(),
    deleteStore: vi.fn()
  }
}));

const mockStores = [
  {
    id: 'store-1',
    name: 'Downtown Store',
    address: '123 Main St',
    phone: '555-1234',
    storeNumber: '001',
    dimensions: { width: 40, height: 30, ceilingHeight: 12 },
    constraints: {
      entryPoints: [{ x: 2, y: 0 }],
      pillars: [],
      utilities: [],
      safetyRequirements: []
    },
    trafficPatterns: [],
    createdBy: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

describe('StoreManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(storeService.getStores).mockResolvedValue({ data: mockStores });
  });

  it('should render store manager interface', async () => {
    render(<StoreManager />);

    expect(screen.getByText('Store Management')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Downtown Store')).toBeInTheDocument();
    });
  });

  it('should load stores on mount', async () => {
    render(<StoreManager />);

    await waitFor(() => {
      expect(storeService.getStores).toHaveBeenCalled();
      expect(screen.getByText('Downtown Store')).toBeInTheDocument();
    });
  });

  it('should show create store button', () => {
    render(<StoreManager />);

    const createButton = screen.getByText('Create New Store');
    expect(createButton).toBeInTheDocument();
  });

  it('should display store details', async () => {
    render(<StoreManager />);

    await waitFor(() => {
      expect(screen.getByText('Downtown Store')).toBeInTheDocument();
      expect(screen.getByText('123 Main St')).toBeInTheDocument();
      expect(screen.getByText('555-1234')).toBeInTheDocument();
      expect(screen.getByText('Store #001')).toBeInTheDocument();
    });
  });

  it('should show store dimensions', async () => {
    render(<StoreManager />);

    await waitFor(() => {
      expect(screen.getByText('40\' × 30\'')).toBeInTheDocument();
      expect(screen.getByText('12\' ceiling')).toBeInTheDocument();
    });
  });

  it('should handle loading state', () => {
    vi.mocked(storeService.getStores).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<StoreManager />);

    expect(screen.getByText('Loading stores...')).toBeInTheDocument();
  });

  it('should handle error state', async () => {
    vi.mocked(storeService.getStores).mockRejectedValue(
      new Error('Failed to load stores')
    );

    render(<StoreManager />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load stores/)).toBeInTheDocument();
    });
  });

  it('should show edit and delete buttons for each store', async () => {
    render(<StoreManager />);

    await waitFor(() => {
      expect(screen.getByLabelText('Edit store')).toBeInTheDocument();
      expect(screen.getByLabelText('Delete store')).toBeInTheDocument();
    });
  });

  it('should open create store dialog when create button clicked', () => {
    render(<StoreManager />);

    const createButton = screen.getByText('Create New Store');
    fireEvent.click(createButton);

    expect(screen.getByText('Create Store')).toBeInTheDocument();
  });

  it('should filter stores by search query', async () => {
    const multipleStores = [
      ...mockStores,
      {
        id: 'store-2',
        name: 'Uptown Store',
        address: '456 Oak Ave',
        phone: '555-5678',
        storeNumber: '002',
        dimensions: { width: 30, height: 25, ceilingHeight: 10 },
        constraints: {
          entryPoints: [],
          pillars: [],
          utilities: [],
          safetyRequirements: []
        },
        trafficPatterns: [],
        createdBy: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    vi.mocked(storeService.getStores).mockResolvedValue({ data: multipleStores });

    render(<StoreManager />);

    await waitFor(() => {
      expect(screen.getByText('Downtown Store')).toBeInTheDocument();
      expect(screen.getByText('Uptown Store')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search stores...');
    fireEvent.change(searchInput, { target: { value: 'Downtown' } });

    expect(screen.getByText('Downtown Store')).toBeInTheDocument();
    expect(screen.queryByText('Uptown Store')).not.toBeInTheDocument();
  });
});