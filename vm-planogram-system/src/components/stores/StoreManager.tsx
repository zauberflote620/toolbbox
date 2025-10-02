import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Store, CreateStoreRequest } from '../../types';
import { storeService } from '../../services/store.service';
import LoadingSpinner from '../ui/LoadingSpinner';
import StoreForm from './StoreForm';
import {
  Store as StoreIcon,
  Plus,
  Edit,
  Trash2,
  MapPin,
  Calendar,
  FileText
} from 'lucide-react';

interface StoreManagerProps {
  user: User;
}

const StoreManager: React.FC<StoreManagerProps> = ({ user }) => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [deletingStore, setDeletingStore] = useState<string | null>(null);

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await storeService.getStores();
      setStores(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStore = async (storeData: CreateStoreRequest) => {
    try {
      const response = await storeService.createStore(storeData);
      setStores([response.data, ...stores]);
      setShowCreateForm(false);
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const handleUpdateStore = async (storeData: Partial<Store>) => {
    if (!editingStore) return;

    try {
      const response = await storeService.updateStore(editingStore.id, storeData);
      setStores(stores.map(store =>
        store.id === editingStore.id ? response.data : store
      ));
      setEditingStore(null);
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const handleDeleteStore = async (storeId: string) => {
    try {
      setDeletingStore(storeId);
      await storeService.deleteStore(storeId);
      setStores(stores.filter(store => store.id !== storeId));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeletingStore(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Store Manager</h1>
          <p className="text-gray-600">Manage your store layouts and configurations</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Store
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <h3 className="font-medium">Error</h3>
          <p className="mt-1">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-sm underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Stores Grid */}
      {stores.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <StoreIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No stores yet</h2>
          <p className="text-gray-500 mb-6">Create your first store to start building planograms</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary inline-flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create First Store
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <div key={store.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden card-hover">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <StoreIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-semibold text-gray-900">{store.name}</h3>
                      {store.storeNumber && (
                        <p className="text-sm text-gray-500">#{store.storeNumber}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setEditingStore(store)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded"
                      title="Edit store"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteStore(store.id)}
                      disabled={deletingStore === store.id}
                      className="p-2 text-gray-400 hover:text-red-600 rounded disabled:opacity-50"
                      title="Delete store"
                    >
                      {deletingStore === store.id ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {store.address && (
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {store.address}
                  </div>
                )}

                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Calendar className="w-4 h-4 mr-1" />
                  Created {new Date(store.createdAt).toLocaleDateString()}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-500">Width:</span>
                    <span className="ml-1 font-medium">{store.dimensions.width}ft</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Height:</span>
                    <span className="ml-1 font-medium">{store.dimensions.height}ft</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Link
                    to={`/stores/${store.id}/planogram`}
                    className="flex-1 btn-primary text-center flex items-center justify-center"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Planogram
                  </Link>
                  <button
                    onClick={() => setEditingStore(store)}
                    className="flex-1 btn-secondary text-center"
                  >
                    Configure
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Store Modal */}
      {showCreateForm && (
        <StoreForm
          onSubmit={handleCreateStore}
          onCancel={() => setShowCreateForm(false)}
          title="Create New Store"
        />
      )}

      {/* Edit Store Modal */}
      {editingStore && (
        <StoreForm
          store={editingStore}
          onSubmit={handleUpdateStore}
          onCancel={() => setEditingStore(null)}
          title="Edit Store"
        />
      )}
    </div>
  );
};

export default StoreManager;