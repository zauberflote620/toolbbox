import React, { useState, useEffect } from 'react';
import { Fixture } from '../../types';
import { fixtureService } from '../../services/fixture.service';
import LoadingSpinner from '../ui/LoadingSpinner';
import { Search, Package, Plus } from 'lucide-react';

const FixturePanel: React.FC = () => {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    loadFixtures();
    loadCategories();
  }, []);

  useEffect(() => {
    loadFixtures();
  }, [searchTerm, selectedCategory]);

  const loadFixtures = async () => {
    try {
      setLoading(true);
      const response = await fixtureService.getFixtures({
        search: searchTerm || undefined,
        category: selectedCategory || undefined,
        limit: 50
      });
      setFixtures(response.data);
    } catch (error) {
      console.error('Failed to load fixtures:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fixtureService.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const handleFixtureDragStart = (event: React.DragEvent<HTMLDivElement>, fixture: Fixture) => {
    event.dataTransfer.setData('application/json', JSON.stringify(fixture));
    event.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className=\"h-full flex flex-col\">\n      {/* Search and Filters */}\n      <div className=\"p-4 border-b border-gray-200 space-y-3\">\n        <div className=\"relative\">\n          <Search className=\"absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400\" />\n          <input\n            type=\"text\"\n            placeholder=\"Search fixtures...\"\n            value={searchTerm}\n            onChange={(e) => setSearchTerm(e.target.value)}\n            className=\"w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent\"\n          />\n        </div>\n\n        <select\n          value={selectedCategory}\n          onChange={(e) => setSelectedCategory(e.target.value)}\n          className=\"w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent\"\n        >\n          <option value=\"\">All Categories</option>\n          {categories.map((category) => (\n            <option key={category.name} value={category.name}>\n              {category.name} ({category.count})\n            </option>\n          ))}\n        </select>\n\n        <button className=\"w-full btn-secondary flex items-center justify-center\">\n          <Plus className=\"w-4 h-4 mr-2\" />\n          Create Custom\n        </button>\n      </div>\n\n      {/* Fixtures List */}\n      <div className=\"flex-1 overflow-y-auto p-4\">\n        {loading ? (\n          <div className=\"flex items-center justify-center h-32\">\n            <LoadingSpinner size=\"md\" />\n          </div>\n        ) : fixtures.length === 0 ? (\n          <div className=\"text-center py-8 text-gray-500\">\n            <Package className=\"w-8 h-8 mx-auto mb-2\" />\n            <p>No fixtures found</p>\n          </div>\n        ) : (\n          <div className=\"space-y-3\">\n            {fixtures.map((fixture) => (\n              <div\n                key={fixture.id}\n                draggable\n                onDragStart={(e) => handleFixtureDragStart(e, fixture)}\n                className=\"bg-white border border-gray-200 rounded-lg p-3 cursor-move hover:shadow-md transition-shadow\"\n              >\n                <div className=\"flex items-start justify-between\">\n                  <div className=\"flex-1\">\n                    <h4 className=\"font-medium text-gray-900 text-sm mb-1\">\n                      {fixture.name}\n                    </h4>\n                    {fixture.ulineSku && (\n                      <p className=\"text-xs text-gray-500 mb-1\">\n                        SKU: {fixture.ulineSku}\n                      </p>\n                    )}\n                    <p className=\"text-xs text-gray-600\">\n                      {fixture.dimensions.width}\" × {fixture.dimensions.depth}\" × {fixture.dimensions.height}\"\n                    </p>\n                  </div>\n                  <div className=\"ml-2\">\n                    <div className=\"w-8 h-8 bg-gray-100 rounded flex items-center justify-center\">\n                      <Package className=\"w-4 h-4 text-gray-600\" />\n                    </div>\n                  </div>\n                </div>\n\n                <div className=\"mt-2 flex items-center justify-between text-xs\">\n                  <span className=\"px-2 py-1 bg-gray-100 text-gray-700 rounded\">\n                    {fixture.category}\n                  </span>\n                  {fixture.priceCents && (\n                    <span className=\"text-gray-500\">\n                      ${(fixture.priceCents / 100).toFixed(2)}\n                    </span>\n                  )}\n                </div>\n              </div>\n            ))}\n          </div>\n        )}\n      </div>\n\n      {/* Usage Instructions */}\n      <div className=\"p-4 border-t border-gray-200 bg-gray-50\">\n        <p className=\"text-xs text-gray-600\">\n          💡 Drag fixtures onto the canvas to place them in your store layout\n        </p>\n      </div>\n    </div>\n  );\n};\n\nexport default FixturePanel;