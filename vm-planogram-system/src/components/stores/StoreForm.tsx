import React, { useState, useEffect } from 'react';
import { Store, CreateStoreRequest, StoreDimensions } from '../../types';
import LoadingSpinner from '../ui/LoadingSpinner';
import { X } from 'lucide-react';

interface StoreFormProps {
  store?: Store;
  onSubmit: (data: CreateStoreRequest | Partial<Store>) => Promise<void>;
  onCancel: () => void;
  title: string;
}

const StoreForm: React.FC<StoreFormProps> = ({
  store,
  onSubmit,
  onCancel,
  title
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: store?.name || '',
    address: store?.address || '',
    phone: store?.phone || '',
    storeNumber: store?.storeNumber || '',
    dimensions: {
      width: store?.dimensions.width || 0,
      height: store?.dimensions.height || 0,
      ceilingHeight: store?.dimensions.ceilingHeight || 10
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name.startsWith('dimensions.')) {
      const dimensionKey = name.split('.')[1] as keyof StoreDimensions;
      setFormData({
        ...formData,
        dimensions: {
          ...formData.dimensions,
          [dimensionKey]: parseFloat(value) || 0
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="form-label">
                  Store Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="input-field w-full"
                  placeholder="Enter store name"
                />
              </div>

              <div>
                <label htmlFor="storeNumber" className="form-label">
                  Store Number
                </label>
                <input
                  type="text"
                  id="storeNumber"
                  name="storeNumber"
                  value={formData.storeNumber}
                  onChange={handleInputChange}
                  className="input-field w-full"
                  placeholder="e.g., #001"
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="form-label">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={3}
                className="input-field w-full"
                placeholder="Enter store address"
              />
            </div>

            <div>
              <label htmlFor="phone" className="form-label">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="input-field w-full"
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          {/* Store Dimensions */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Store Dimensions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="dimensions.width" className="form-label">
                  Width (feet) *
                </label>
                <input
                  type="number"
                  id="dimensions.width"
                  name="dimensions.width"
                  value={formData.dimensions.width || ''}\n                  onChange={handleInputChange}
                  required
                  min="1"
                  step="0.1"
                  className="input-field w-full"
                  placeholder="50"
                />
              </div>

              <div>
                <label htmlFor="dimensions.height" className="form-label">
                  Length (feet) *
                </label>
                <input
                  type="number"
                  id="dimensions.height"
                  name="dimensions.height"
                  value={formData.dimensions.height || ''}
                  onChange={handleInputChange}
                  required
                  min="1"
                  step="0.1"
                  className="input-field w-full"
                  placeholder="30"
                />
              </div>

              <div>
                <label htmlFor="dimensions.ceilingHeight" className="form-label">
                  Ceiling Height (feet) *
                </label>
                <input
                  type="number"
                  id="dimensions.ceilingHeight"
                  name="dimensions.ceilingHeight"
                  value={formData.dimensions.ceilingHeight || ''}
                  onChange={handleInputChange}
                  required
                  min="7"
                  step="0.1"
                  className="input-field w-full"
                  placeholder="10"
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded p-4">
              <p className="text-sm text-blue-700">
                <strong>Store Area:</strong> {(formData.dimensions.width * formData.dimensions.height).toFixed(0)} sq ft
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  {store ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                store ? 'Update Store' : 'Create Store'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StoreForm;