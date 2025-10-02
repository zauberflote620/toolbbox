import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { User, Store, Planogram, StoreFixture } from '../../types';
import { storeService } from '../../services/store.service';
import { planogramService } from '../../services/planogram.service';
import LoadingSpinner from '../ui/LoadingSpinner';
import PlanogramCanvas from './PlanogramCanvas';
import FixturePanel from './FixturePanel';
import AnalyticsPanel from './AnalyticsPanel';
import ToolbarPanel from './ToolbarPanel';
import PropertiesPanel from './PropertiesPanel';
import {
  Save,
  Download,
  Share,
  Settings,
  Grid,
  ZoomIn,
  ZoomOut,
  RotateCw
} from 'lucide-react';

interface PlanogramBuilderProps {
  user: User;
}

const PlanogramBuilder: React.FC<PlanogramBuilderProps> = ({ user }) => {
  const { storeId } = useParams<{ storeId: string }>();
  const [store, setStore] = useState<Store | null>(null);
  const [planogram, setPlanogram] = useState<Planogram | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFixture, setSelectedFixture] = useState<StoreFixture | null>(null);
  const [activePanel, setActivePanel] = useState<'fixtures' | 'analytics' | 'properties'>('fixtures');
  const [canvasMode, setCanvasMode] = useState<'select' | 'place' | 'measure'>('select');
  const [zoom, setZoom] = useState(1);
  const [gridVisible, setGridVisible] = useState(true);

  useEffect(() => {
    if (storeId) {
      loadStoreData();
    }
  }, [storeId]);

  const loadStoreData = async () => {
    if (!storeId) return;

    try {
      setLoading(true);
      setError(null);

      const storeResponse = await storeService.getStore(storeId);
      setStore(storeResponse.data);

      // Try to load existing planogram or create new one
      try {
        const planogramsResponse = await planogramService.getPlanograms(storeId);
        if (planogramsResponse.data.length > 0) {
          setPlanogram(planogramsResponse.data[0]);
        } else {
          // Create a new planogram
          const newPlanogram = await planogramService.createPlanogram({
            storeId,
            name: `${storeResponse.data.name} - Planogram`
          });
          setPlanogram(newPlanogram.data);
        }
      } catch (planogramError) {
        console.warn('Could not load/create planogram:', planogramError);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePlanogram = async () => {
    if (!planogram) return;

    try {
      await planogramService.updatePlanogram(planogram.id, {
        layoutData: planogram.layoutData,
        notes: planogram.notes
      });
      // Show success feedback
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleZoomIn = () => {
    setZoom(Math.min(zoom * 1.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom / 1.2, 0.3));
  };

  const handleGridToggle = () => {
    setGridVisible(!gridVisible);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <h3 className="font-medium">Error Loading Store</h3>
          <p className="mt-1">{error || 'Store not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header Toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{store.name}</h1>
            <p className="text-sm text-gray-500">
              {planogram ? planogram.name : 'New Planogram'}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {/* Zoom Controls */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={handleZoomOut}
                className="p-2 hover:bg-white rounded"
                title="Zoom out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="px-2 text-sm font-medium">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-2 hover:bg-white rounded"
                title="Zoom in"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* View Controls */}
            <button
              onClick={handleGridToggle}
              className={`p-2 rounded ${
                gridVisible ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
              title="Toggle grid"
            >
              <Grid className="w-4 h-4" />
            </button>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={handleSavePlanogram}
                className="btn-secondary flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </button>
              <button className="btn-secondary flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <button className="btn-primary flex items-center">
                <Share className="w-4 h-4 mr-2" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Panel Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              {[
                { id: 'fixtures', label: 'Fixtures' },
                { id: 'analytics', label: 'Analytics' },
                { id: 'properties', label: 'Properties' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActivePanel(tab.id as any)}
                  className={`
                    flex-1 px-4 py-3 text-sm font-medium border-b-2
                    ${
                      activePanel === tab.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-hidden">
            {activePanel === 'fixtures' && <FixturePanel />}
            {activePanel === 'analytics' && <AnalyticsPanel />}
            {activePanel === 'properties' && (
              <PropertiesPanel
                selectedFixture={selectedFixture}
                onFixtureUpdate={setSelectedFixture}
              />
            )}
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Canvas Toolbar */}
          <ToolbarPanel
            mode={canvasMode}
            onModeChange={setCanvasMode}
            store={store}
          />

          {/* Canvas */}
          <div className="flex-1 overflow-hidden bg-gray-100">
            <PlanogramCanvas
              store={store}
              planogram={planogram}
              zoom={zoom}
              gridVisible={gridVisible}
              mode={canvasMode}
              selectedFixture={selectedFixture}
              onFixtureSelect={setSelectedFixture}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanogramBuilder;