import React from 'react';
import { StoreFixture } from '../../types';
import { Settings, RotateCw, Move, Ruler } from 'lucide-react';

interface PropertiesPanelProps {
  selectedFixture: StoreFixture | null;
  onFixtureUpdate: (fixture: StoreFixture | null) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedFixture,
  onFixtureUpdate
}) => {
  const handlePropertyChange = (property: string, value: any) => {
    if (!selectedFixture) return;

    const updatedFixture = {
      ...selectedFixture,
      [property]: value
    };

    onFixtureUpdate(updatedFixture);
  };

  if (!selectedFixture) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4 text-center">
        <Settings className="w-12 h-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Fixture Selected</h3>
        <p className="text-gray-500">
          Click on a fixture in the canvas to view and edit its properties
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 space-y-6">
      {/* Fixture Info */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Fixture Properties</h3>

        <div className="space-y-3">
          <div>
            <label className="form-label">Name</label>
            <input
              type="text"
              value={selectedFixture.fixture.name}
              readOnly
              className="input-field w-full bg-gray-50"
            />
          </div>

          <div>
            <label className="form-label">Category</label>
            <input
              type="text"
              value={selectedFixture.fixture.category}
              readOnly
              className="input-field w-full bg-gray-50"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="form-label text-xs">Width</label>
              <input
                type="text"
                value={`${selectedFixture.fixture.dimensions.width}"`}
                readOnly
                className="input-field w-full bg-gray-50 text-xs"
              />
            </div>
            <div>
              <label className="form-label text-xs">Depth</label>
              <input
                type="text"
                value={`${selectedFixture.fixture.dimensions.depth}"`}
                readOnly
                className="input-field w-full bg-gray-50 text-xs"
              />
            </div>
            <div>
              <label className="form-label text-xs">Height</label>
              <input
                type="text"
                value={`${selectedFixture.fixture.dimensions.height}"`}
                readOnly
                className="input-field w-full bg-gray-50 text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Position & Rotation */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
          <Move className="w-4 h-4 mr-2" />
          Position & Rotation
        </h4>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="form-label text-xs">X Position (ft)</label>
              <input
                type="number"
                value={selectedFixture.x}
                onChange={(e) => handlePropertyChange('x', parseFloat(e.target.value) || 0)}
                step="0.1"
                className="input-field w-full text-xs"
              />
            </div>
            <div>
              <label className="form-label text-xs">Y Position (ft)</label>
              <input
                type="number"
                value={selectedFixture.y}
                onChange={(e) => handlePropertyChange('y', parseFloat(e.target.value) || 0)}
                step="0.1"
                className="input-field w-full text-xs"
              />
            </div>
          </div>

          <div>
            <label className="form-label text-xs">Rotation (degrees)</label>
            <input
              type="number"
              value={selectedFixture.rotation}
              onChange={(e) => handlePropertyChange('rotation', parseFloat(e.target.value) || 0)}
              step="15"
              min="0"
              max="360"
              className="input-field w-full text-xs"
            />
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => handlePropertyChange('rotation', (selectedFixture.rotation + 90) % 360)}
              className="btn-secondary flex-1 flex items-center justify-center text-xs"
            >
              <RotateCw className="w-3 h-3 mr-1" />
              Rotate 90°
            </button>
          </div>
        </div>
      </div>

      {/* VM Zone */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
          <Ruler className="w-4 h-4 mr-2" />
          VM Zone
        </h4>

        <div>
          <select
            value={selectedFixture.vmZone}
            onChange={(e) => handlePropertyChange('vmZone', e.target.value)}
            className="input-field w-full"
          >
            <option value="EYE">Eye Level (60-72")</option>
            <option value="REACH">Reach Zone (48-60")</option>
            <option value="STRETCH">Stretch Zone (72+")</option>
            <option value="STOOP">Stoop Zone (0-48")</option>
          </select>

          <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
            {selectedFixture.vmZone === 'EYE' && 'Premium placement for bestsellers and high-margin items'}
            {selectedFixture.vmZone === 'REACH' && 'Accessible placement for everyday items'}
            {selectedFixture.vmZone === 'STRETCH' && 'Aspirational items and seasonal displays'}
            {selectedFixture.vmZone === 'STOOP' && 'Bulk items, clearance, and children\'s products'}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-3">Actions</h4>
        <div className="space-y-2">
          <button className="w-full btn-secondary text-sm">
            Duplicate Fixture
          </button>
          <button className="w-full btn-secondary text-sm text-red-600 border-red-200 hover:bg-red-50">
            Remove Fixture
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;