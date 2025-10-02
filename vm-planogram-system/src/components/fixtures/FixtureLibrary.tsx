import React, { useState, useEffect } from 'react';
import { Search, Plus, Grid3X3, ShoppingCart, Package, Box, Gem, Monitor } from 'lucide-react';

interface Fixture {
  id: string;
  name: string;
  ulineSku: string;
  category: string;
  dimensions: {
    width: number;
    depth: number;
    height: number;
  };
  capacity: {
    units: number;
    weight: number;
  };
  material: string;
  priceCents: number;
  isCustom: boolean;
  availabilityStatus: 'available' | 'out_of_stock' | 'discontinued';
}

const mockFixtures: Fixture[] = [
  {
    id: 'f1',
    name: 'Chrome Wire Shelf Unit - 48"W x 18"D x 72"H',
    ulineSku: 'H-1848-CHROME',
    category: 'Wire Shelving',
    dimensions: { width: 48, depth: 18, height: 72 },
    capacity: { units: 50, weight: 500 },
    material: 'Chrome Wire',
    priceCents: 18500,
    isCustom: false,
    availabilityStatus: 'available'
  },
  {
    id: 'f2',
    name: 'Stainless Steel Wire Shelf - 36"W x 24"D x 54"H',
    ulineSku: 'H-2436-SS',
    category: 'Wire Shelving',
    dimensions: { width: 36, depth: 24, height: 54 },
    capacity: { units: 40, weight: 600 },
    material: 'Stainless Steel',
    priceCents: 25000,
    isCustom: false,
    availabilityStatus: 'available'
  },
  {
    id: 'f3',
    name: 'Heavy Duty Garment Rack - 48"W',
    ulineSku: 'H-4858-CHROME',
    category: 'Clothing Racks',
    dimensions: { width: 48, depth: 24, height: 64 },
    capacity: { units: 100, weight: 200 },
    material: 'Chrome Steel',
    priceCents: 12500,
    isCustom: false,
    availabilityStatus: 'available'
  },
  {
    id: 'f4',
    name: 'Double Rail Clothing Rack - 60"W',
    ulineSku: 'H-6024-DOUBLE',
    category: 'Clothing Racks',
    dimensions: { width: 60, depth: 24, height: 68 },
    capacity: { units: 150, weight: 300 },
    material: 'Powder Coated Steel',
    priceCents: 18900,
    isCustom: false,
    availabilityStatus: 'available'
  },
  {
    id: 'f5',
    name: 'Folding Display Table - 48"W x 30"D',
    ulineSku: 'H-4830-FOLD',
    category: 'Display Tables',
    dimensions: { width: 48, depth: 30, height: 30 },
    capacity: { units: 25, weight: 100 },
    material: 'Plastic Top',
    priceCents: 8500,
    isCustom: false,
    availabilityStatus: 'available'
  },
  {
    id: 'f6',
    name: 'Glass Display Table - 36"W x 24"D',
    ulineSku: 'H-3624-GLASS',
    category: 'Display Tables',
    dimensions: { width: 36, depth: 24, height: 32 },
    capacity: { units: 15, weight: 75 },
    material: 'Tempered Glass',
    priceCents: 24500,
    isCustom: false,
    availabilityStatus: 'available'
  },
  {
    id: 'f7',
    name: 'Stackable Storage Bin - 18"W x 12"D x 8"H',
    ulineSku: 'S-1812-STACK',
    category: 'Storage Bins',
    dimensions: { width: 18, depth: 12, height: 8 },
    capacity: { units: 10, weight: 25 },
    material: 'High Density Plastic',
    priceCents: 1200,
    isCustom: false,
    availabilityStatus: 'available'
  },
  {
    id: 'f8',
    name: 'Clear Storage Container - 24"W x 16"D x 12"H',
    ulineSku: 'S-2416-CLEAR',
    category: 'Storage Bins',
    dimensions: { width: 24, depth: 16, height: 12 },
    capacity: { units: 20, weight: 50 },
    material: 'Clear Polycarbonate',
    priceCents: 2800,
    isCustom: false,
    availabilityStatus: 'available'
  },
  {
    id: 'f9',
    name: 'Rotating Jewelry Display - 12"W x 12"D x 16"H',
    ulineSku: 'J-1212-ROTATE',
    category: 'Jewelry Displays',
    dimensions: { width: 12, depth: 12, height: 16 },
    capacity: { units: 50, weight: 10 },
    material: 'Acrylic',
    priceCents: 8500,
    isCustom: false,
    availabilityStatus: 'available'
  },
  {
    id: 'f10',
    name: 'Jewelry Display Case - 24"W x 18"D x 8"H',
    ulineSku: 'J-2418-CASE',
    category: 'Jewelry Displays',
    dimensions: { width: 24, depth: 18, height: 8 },
    capacity: { units: 30, weight: 15 },
    material: 'Glass & Velvet',
    priceCents: 15500,
    isCustom: false,
    availabilityStatus: 'available'
  },
  {
    id: 'f11',
    name: 'Slatwall Panel System - 48"W x 96"H',
    ulineSku: 'SP-4896-SLAT',
    category: 'Specialty Displays',
    dimensions: { width: 48, depth: 1, height: 96 },
    capacity: { units: 100, weight: 200 },
    material: 'Melamine Finish',
    priceCents: 28000,
    isCustom: false,
    availabilityStatus: 'available'
  },
  {
    id: 'f12',
    name: 'Gridwall Panel - 24"W x 72"H',
    ulineSku: 'SP-2472-GRID',
    category: 'Specialty Displays',
    dimensions: { width: 24, depth: 1, height: 72 },
    capacity: { units: 60, weight: 120 },
    material: 'Chrome Wire Grid',
    priceCents: 15500,
    isCustom: false,
    availabilityStatus: 'available'
  },
  {
    id: 'f13',
    name: 'Heavy Duty Wire Unit - 60"W x 24"D x 84"H',
    ulineSku: 'H-6024-HEAVY',
    category: 'Wire Shelving',
    dimensions: { width: 60, depth: 24, height: 84 },
    capacity: { units: 75, weight: 800 },
    material: 'Chrome Wire',
    priceCents: 28500,
    isCustom: false,
    availabilityStatus: 'available'
  },
  {
    id: 'f14',
    name: 'Mobile Wire Cart - 24"W x 18"D x 48"H',
    ulineSku: 'H-2418-MOBILE',
    category: 'Wire Shelving',
    dimensions: { width: 24, depth: 18, height: 48 },
    capacity: { units: 30, weight: 200 },
    material: 'Chrome Wire',
    priceCents: 15500,
    isCustom: false,
    availabilityStatus: 'available'
  },
  {
    id: 'f15',
    name: 'Corner Wire Unit - 36"W x 36"D x 72"H',
    ulineSku: 'H-3636-CORNER',
    category: 'Wire Shelving',
    dimensions: { width: 36, depth: 36, height: 72 },
    capacity: { units: 60, weight: 600 },
    material: 'Chrome Wire',
    priceCents: 22000,
    isCustom: false,
    availabilityStatus: 'available'
  },
  {
    id: 'f16',
    name: 'Circular Clothing Rack - 42" Diameter',
    ulineSku: 'H-4242-CIRCULAR',
    category: 'Clothing Racks',
    dimensions: { width: 42, depth: 42, height: 60 },
    capacity: { units: 80, weight: 150 },
    material: 'Chrome Steel',
    priceCents: 16500,
    isCustom: false,
    availabilityStatus: 'available'
  },
  {
    id: 'f17',
    name: 'Adjustable Height Rack - 48"W',
    ulineSku: 'H-4824-ADJUST',
    category: 'Clothing Racks',
    dimensions: { width: 48, depth: 24, height: 72 },
    capacity: { units: 120, weight: 250 },
    material: 'Stainless Steel',
    priceCents: 21000,
    isCustom: false,
    availabilityStatus: 'available'
  },
  {
    id: 'f18',
    name: 'Kids Clothing Rack - 36"W',
    ulineSku: 'H-3618-KIDS',
    category: 'Clothing Racks',
    dimensions: { width: 36, depth: 18, height: 48 },
    capacity: { units: 60, weight: 100 },
    material: 'Powder Coated Steel',
    priceCents: 9500,
    isCustom: false,
    availabilityStatus: 'available'
  },
  {
    id: 'f19',
    name: 'Round Display Table - 42" Diameter',
    ulineSku: 'H-4242-ROUND',
    category: 'Display Tables',
    dimensions: { width: 42, depth: 42, height: 30 },
    capacity: { units: 20, weight: 100 },
    material: 'Wood Laminate',
    priceCents: 18000,
    isCustom: false,
    availabilityStatus: 'available'
  },
  {
    id: 'f20',
    name: 'Nested Display Tables Set of 3',
    ulineSku: 'H-NEST-SET3',
    category: 'Display Tables',
    dimensions: { width: 36, depth: 24, height: 28 },
    capacity: { units: 12, weight: 60 },
    material: 'Metal Frame',
    priceCents: 14500,
    isCustom: false,
    availabilityStatus: 'available'
  },
  {
    id: 'f21',
    name: 'Counter Height Display Table - 48"W',
    ulineSku: 'H-4824-COUNTER',
    category: 'Display Tables',
    dimensions: { width: 48, depth: 24, height: 42 },
    capacity: { units: 30, weight: 150 },
    material: 'Laminate Top',
    priceCents: 19500,
    isCustom: false,
    availabilityStatus: 'available'
  },
  {
    id: 'f22',
    name: 'Rolling Storage Cart - 18"W x 24"D x 36"H',
    ulineSku: 'S-1824-ROLL',
    category: 'Storage Bins',
    dimensions: { width: 18, depth: 24, height: 36 },
    capacity: { units: 25, weight: 75 },
    material: 'Metal Frame',
    priceCents: 8500,
    isCustom: false,
    availabilityStatus: 'available'
  },
  {
    id: 'f23',
    name: 'Modular Storage Cubes - 12"x12"x12"',
    ulineSku: 'S-1212-CUBE',
    category: 'Storage Bins',
    dimensions: { width: 12, depth: 12, height: 12 },
    capacity: { units: 8, weight: 20 },
    material: 'Fabric Covered',
    priceCents: 3500,
    isCustom: false,
    availabilityStatus: 'available'
  },
  {
    id: 'f24',
    name: 'Under-Counter Storage Bin Set',
    ulineSku: 'S-UNDER-SET',
    category: 'Storage Bins',
    dimensions: { width: 30, depth: 18, height: 6 },
    capacity: { units: 15, weight: 30 },
    material: 'High Density Plastic',
    priceCents: 4200,
    isCustom: false,
    availabilityStatus: 'available'
  },
  {
    id: 'f25',
    name: 'Jewelry Tower Display - 12"W x 12"D x 48"H',
    ulineSku: 'J-1212-TOWER',
    category: 'Jewelry Displays',
    dimensions: { width: 12, depth: 12, height: 48 },
    capacity: { units: 80, weight: 20 },
    material: 'Acrylic & Chrome',
    priceCents: 18500,
    isCustom: false,
    availabilityStatus: 'available'
  },
  {
    id: 'f26',
    name: 'Counter Jewelry Display - 18"W x 12"D x 6"H',
    ulineSku: 'J-1812-COUNTER',
    category: 'Jewelry Displays',
    dimensions: { width: 18, depth: 12, height: 6 },
    capacity: { units: 24, weight: 8 },
    material: 'Velvet Lined',
    priceCents: 12000,
    isCustom: false,
    availabilityStatus: 'available'
  },
  {
    id: 'f27',
    name: 'Wall Mount Jewelry Board - 24"W x 18"H',
    ulineSku: 'J-2418-WALL',
    category: 'Jewelry Displays',
    dimensions: { width: 24, depth: 2, height: 18 },
    capacity: { units: 40, weight: 5 },
    material: 'Fabric Covered',
    priceCents: 8500,
    isCustom: false,
    availabilityStatus: 'available'
  },
  {
    id: 'f28',
    name: 'Pegboard Wall System - 48"W x 48"H',
    ulineSku: 'SP-4848-PEG',
    category: 'Specialty Displays',
    dimensions: { width: 48, depth: 1, height: 48 },
    capacity: { units: 120, weight: 150 },
    material: 'Metal Pegboard',
    priceCents: 19500,
    isCustom: false,
    availabilityStatus: 'available'
  }
];

const categoryIcons = {
  'Wire Shelving': Grid3X3,
  'Clothing Racks': ShoppingCart,
  'Display Tables': Package,
  'Storage Bins': Box,
  'Jewelry Displays': Gem,
  'Specialty Displays': Monitor
};

const FixtureLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [fixtures, setFixtures] = useState<Fixture[]>(mockFixtures);

  const categories = Array.from(new Set(mockFixtures.map(f => f.category)));

  const filteredFixtures = fixtures.filter(fixture => {
    const matchesSearch = fixture.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fixture.ulineSku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || fixture.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatPrice = (priceCents: number) => {
    return `$${(priceCents / 100).toFixed(2)}`;
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Fixture Library</h1>
        <button className="btn-primary flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add Custom Fixture
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search fixtures or SKUs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10 w-full"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="input-field sm:w-48"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredFixtures.map(fixture => {
          const Icon = categoryIcons[fixture.category as keyof typeof categoryIcons] || Package;

          return (
            <div key={fixture.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <Icon className="w-6 h-6 text-primary flex-shrink-0" />
                <span className={`px-2 py-1 text-xs rounded-full ${
                  fixture.availabilityStatus === 'available'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {fixture.availabilityStatus}
                </span>
              </div>

              <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{fixture.name}</h3>
              <p className="text-sm text-gray-500 mb-3">SKU: {fixture.ulineSku}</p>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Dimensions:</span>
                  <span>{fixture.dimensions.width}" × {fixture.dimensions.depth}" × {fixture.dimensions.height}"</span>
                </div>
                <div className="flex justify-between">
                  <span>Capacity:</span>
                  <span>{fixture.capacity.units} units, {fixture.capacity.weight} lbs</span>
                </div>
                <div className="flex justify-between">
                  <span>Material:</span>
                  <span className="text-right">{fixture.material}</span>
                </div>
                <div className="flex justify-between font-medium text-gray-900 pt-2 border-t">
                  <span>Price:</span>
                  <span>{formatPrice(fixture.priceCents)}</span>
                </div>
              </div>

              <button className="w-full mt-4 btn-secondary text-sm">
                Add to Planogram
              </button>
            </div>
          );
        })}
      </div>

      {filteredFixtures.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No fixtures found</h3>
          <p className="text-gray-500">Try adjusting your search or category filter.</p>
        </div>
      )}

      <div className="mt-8 text-center text-sm text-gray-500">
        Showing {filteredFixtures.length} of {fixtures.length} fixtures from Uline catalog
      </div>
    </div>
  );
};

export default FixtureLibrary;