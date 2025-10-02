import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create sample user
  const user = await prisma.user.upsert({
    where: { email: 'demo@vmplanogram.com' },
    update: {},
    create: {
      email: 'demo@vmplanogram.com',
      password: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj7.k19Wstwy', // "password123"
      firstName: 'Demo',
      lastName: 'User',
      role: 'ADMIN',
    },
  });

  console.log('👤 Created demo user:', user.email);

  // Extended Uline fixture catalog - 27+ fixtures
  const fixtureCategories = [
    {
      category: 'Wire Shelving',
      fixtures: [
        {
          name: 'Chrome Wire Shelf Unit - 48"W x 18"D x 72"H',
          ulineSku: 'H-1848-CHROME',
          dimensions: { width: 48, depth: 18, height: 72 },
          capacity: { units: 50, weight: 500 },
          material: 'Chrome Wire',
          priceCents: 18500
        },
        {
          name: 'Stainless Steel Wire Shelf - 36"W x 24"D x 54"H',
          ulineSku: 'H-2436-SS',
          dimensions: { width: 36, depth: 24, height: 54 },
          capacity: { units: 40, weight: 600 },
          material: 'Stainless Steel',
          priceCents: 25000
        },
        {
          name: 'Heavy Duty Wire Unit - 60"W x 24"D x 84"H',
          ulineSku: 'H-6024-HEAVY',
          dimensions: { width: 60, depth: 24, height: 84 },
          capacity: { units: 75, weight: 800 },
          material: 'Chrome Wire',
          priceCents: 28500
        },
        {
          name: 'Mobile Wire Cart - 24"W x 18"D x 48"H',
          ulineSku: 'H-2418-MOBILE',
          dimensions: { width: 24, depth: 18, height: 48 },
          capacity: { units: 30, weight: 200 },
          material: 'Chrome Wire',
          priceCents: 15500
        },
        {
          name: 'Corner Wire Unit - 36"W x 36"D x 72"H',
          ulineSku: 'H-3636-CORNER',
          dimensions: { width: 36, depth: 36, height: 72 },
          capacity: { units: 60, weight: 600 },
          material: 'Chrome Wire',
          priceCents: 22000
        }
      ]
    },
    {
      category: 'Clothing Racks',
      fixtures: [
        {
          name: 'Heavy Duty Garment Rack - 48"W',
          ulineSku: 'H-4858-CHROME',
          dimensions: { width: 48, depth: 24, height: 64 },
          capacity: { units: 100, weight: 200 },
          material: 'Chrome Steel',
          priceCents: 12500
        },
        {
          name: 'Double Rail Clothing Rack - 60"W',
          ulineSku: 'H-6024-DOUBLE',
          dimensions: { width: 60, depth: 24, height: 68 },
          capacity: { units: 150, weight: 300 },
          material: 'Powder Coated Steel',
          priceCents: 18900
        },
        {
          name: 'Circular Clothing Rack - 42" Diameter',
          ulineSku: 'H-4242-CIRCULAR',
          dimensions: { width: 42, depth: 42, height: 60 },
          capacity: { units: 80, weight: 150 },
          material: 'Chrome Steel',
          priceCents: 16500
        },
        {
          name: 'Adjustable Height Rack - 48"W',
          ulineSku: 'H-4824-ADJUST',
          dimensions: { width: 48, depth: 24, height: 72 },
          capacity: { units: 120, weight: 250 },
          material: 'Stainless Steel',
          priceCents: 21000
        },
        {
          name: 'Kids Clothing Rack - 36"W',
          ulineSku: 'H-3618-KIDS',
          dimensions: { width: 36, depth: 18, height: 48 },
          capacity: { units: 60, weight: 100 },
          material: 'Powder Coated Steel',
          priceCents: 9500
        }
      ]
    },
    {
      category: 'Display Tables',
      fixtures: [
        {
          name: 'Folding Display Table - 48"W x 30"D',
          ulineSku: 'H-4830-FOLD',
          dimensions: { width: 48, depth: 30, height: 30 },
          capacity: { units: 25, weight: 100 },
          material: 'Plastic Top',
          priceCents: 8500
        },
        {
          name: 'Glass Display Table - 36"W x 24"D',
          ulineSku: 'H-3624-GLASS',
          dimensions: { width: 36, depth: 24, height: 32 },
          capacity: { units: 15, weight: 75 },
          material: 'Tempered Glass',
          priceCents: 24500
        },
        {
          name: 'Round Display Table - 42" Diameter',
          ulineSku: 'H-4242-ROUND',
          dimensions: { width: 42, depth: 42, height: 30 },
          capacity: { units: 20, weight: 100 },
          material: 'Wood Laminate',
          priceCents: 18000
        },
        {
          name: 'Nested Display Tables Set of 3',
          ulineSku: 'H-NEST-SET3',
          dimensions: { width: 36, depth: 24, height: 28 },
          capacity: { units: 12, weight: 60 },
          material: 'Metal Frame',
          priceCents: 14500
        },
        {
          name: 'Counter Height Display Table - 48"W',
          ulineSku: 'H-4824-COUNTER',
          dimensions: { width: 48, depth: 24, height: 42 },
          capacity: { units: 30, weight: 150 },
          material: 'Laminate Top',
          priceCents: 19500
        }
      ]
    },
    {
      category: 'Storage Bins',
      fixtures: [
        {
          name: 'Stackable Storage Bin - 18"W x 12"D x 8"H',
          ulineSku: 'S-1812-STACK',
          dimensions: { width: 18, depth: 12, height: 8 },
          capacity: { units: 10, weight: 25 },
          material: 'High Density Plastic',
          priceCents: 1200
        },
        {
          name: 'Clear Storage Container - 24"W x 16"D x 12"H',
          ulineSku: 'S-2416-CLEAR',
          dimensions: { width: 24, depth: 16, height: 12 },
          capacity: { units: 20, weight: 50 },
          material: 'Clear Polycarbonate',
          priceCents: 2800
        },
        {
          name: 'Rolling Storage Cart - 18"W x 24"D x 36"H',
          ulineSku: 'S-1824-ROLL',
          dimensions: { width: 18, depth: 24, height: 36 },
          capacity: { units: 25, weight: 75 },
          material: 'Metal Frame',
          priceCents: 8500
        },
        {
          name: 'Modular Storage Cubes - 12"x12"x12"',
          ulineSku: 'S-1212-CUBE',
          dimensions: { width: 12, depth: 12, height: 12 },
          capacity: { units: 8, weight: 20 },
          material: 'Fabric Covered',
          priceCents: 3500
        },
        {
          name: 'Under-Counter Storage Bin Set',
          ulineSku: 'S-UNDER-SET',
          dimensions: { width: 30, depth: 18, height: 6 },
          capacity: { units: 15, weight: 30 },
          material: 'High Density Plastic',
          priceCents: 4200
        }
      ]
    },
    {
      category: 'Jewelry Displays',
      fixtures: [
        {
          name: 'Rotating Jewelry Display - 12"W x 12"D x 16"H',
          ulineSku: 'J-1212-ROTATE',
          dimensions: { width: 12, depth: 12, height: 16 },
          capacity: { units: 50, weight: 10 },
          material: 'Acrylic',
          priceCents: 8500
        },
        {
          name: 'Jewelry Display Case - 24"W x 18"D x 8"H',
          ulineSku: 'J-2418-CASE',
          dimensions: { width: 24, depth: 18, height: 8 },
          capacity: { units: 30, weight: 15 },
          material: 'Glass & Velvet',
          priceCents: 15500
        },
        {
          name: 'Jewelry Tower Display - 12"W x 12"D x 48"H',
          ulineSku: 'J-1212-TOWER',
          dimensions: { width: 12, depth: 12, height: 48 },
          capacity: { units: 80, weight: 20 },
          material: 'Acrylic & Chrome',
          priceCents: 18500
        },
        {
          name: 'Counter Jewelry Display - 18"W x 12"D x 6"H',
          ulineSku: 'J-1812-COUNTER',
          dimensions: { width: 18, depth: 12, height: 6 },
          capacity: { units: 24, weight: 8 },
          material: 'Velvet Lined',
          priceCents: 12000
        },
        {
          name: 'Wall Mount Jewelry Board - 24"W x 18"H',
          ulineSku: 'J-2418-WALL',
          dimensions: { width: 24, depth: 2, height: 18 },
          capacity: { units: 40, weight: 5 },
          material: 'Fabric Covered',
          priceCents: 8500
        }
      ]
    },
    {
      category: 'Specialty Displays',
      fixtures: [
        {
          name: 'Slatwall Panel System - 48"W x 96"H',
          ulineSku: 'SP-4896-SLAT',
          dimensions: { width: 48, depth: 1, height: 96 },
          capacity: { units: 100, weight: 200 },
          material: 'Melamine Finish',
          priceCents: 28000
        },
        {
          name: 'Gridwall Panel - 24"W x 72"H',
          ulineSku: 'SP-2472-GRID',
          dimensions: { width: 24, depth: 1, height: 72 },
          capacity: { units: 60, weight: 120 },
          material: 'Chrome Wire Grid',
          priceCents: 15500
        }
      ]
    }
  ];

  for (const category of fixtureCategories) {
    for (const fixtureData of category.fixtures) {
      await prisma.fixture.upsert({
        where: { ulineSku: fixtureData.ulineSku },
        update: {},
        create: {
          ...fixtureData,
          category: category.category,
          isCustom: false,
          availabilityStatus: 'available'
        },
      });
    }
  }

  const totalFixtures = fixtureCategories.reduce((sum, cat) => sum + cat.fixtures.length, 0);
  console.log('🏪 Created fixture catalog with', totalFixtures, 'fixtures');

  // Create sample store
  const store = await prisma.store.upsert({
    where: { id: 'demo-store-1' },
    update: {},
    create: {
      id: 'demo-store-1',
      name: 'Downtown Fashion Boutique',
      address: '123 Main Street, Downtown, NY 10001',
      phone: '(555) 123-4567',
      storeNumber: '001',
      dimensions: {
        width: 40,
        height: 30,
        ceilingHeight: 12
      },
      constraints: {
        entryPoints: [{ x: 2, y: 0 }],
        pillars: [{ x: 20, y: 15, width: 2, height: 2 }],
        utilities: [{ x: 38, y: 28, width: 2, height: 2 }],
        safetyRequirements: ['Emergency exit clearance', 'ADA compliance']
      },
      trafficPatterns: [
        {
          name: 'Main Flow',
          path: [
            { x: 2, y: 5 },
            { x: 35, y: 5 },
            { x: 35, y: 25 },
            { x: 5, y: 25 },
            { x: 5, y: 5 }
          ],
          intensity: 0.8
        }
      ],
      createdBy: user.id,
    },
  });

  console.log('🏬 Created demo store:', store.name);

  // Create sample planogram
  const planogram = await prisma.planogram.upsert({
    where: { id: 'demo-planogram-1' },
    update: {},
    create: {
      id: 'demo-planogram-1',
      storeId: store.id,
      name: 'Winter Fashion Reset 2024',
      version: 1,
      status: 'DRAFT',
      analyticsInput: 'Winter coats up 47%, scarves up 23%\nLeather goods are highest margin items\nCustomers who buy coats usually buy accessories',
      parsedInsights: [
        {
          type: 'sales_trend',
          confidence: 0.9,
          productIds: [],
          action: 'eye_level',
          zone: 'EYE',
          reasoning: 'Winter coats showing strong sales growth (+47%) - promote to eye level for maximum visibility'
        },
        {
          type: 'profitability',
          confidence: 0.85,
          productIds: [],
          action: 'eye_level',
          zone: 'EYE',
          reasoning: 'Leather goods identified as high-margin item - place at eye level to maximize profit'
        }
      ],
      layoutData: {
        fixtures: [],
        products: [],
        trafficFlow: {
          primaryPath: [{ x: 2, y: 5 }, { x: 35, y: 5 }],
          secondaryPaths: [],
          hotspots: [{ x: 10, y: 10 }, { x: 30, y: 20 }]
        }
      },
      notes: 'Focus on winter merchandise with high-margin leather goods featured prominently.',
      createdBy: user.id,
    },
  });

  console.log('📋 Created demo planogram:', planogram.name);

  // Create sample products
  const products = [
    {
      name: 'Winter Coat - Premium',
      sku: 'WC-PREM-001',
      category: 'Outerwear',
      subcategory: 'Coats',
      brand: 'FashionBrand',
      attributes: {
        margin: 45,
        velocity: 47,
        seasonality: 'winter',
        size: 'large',
        profitability: 'high'
      },
      dimensions: { width: 24, depth: 2, height: 48 },
      weightGrams: 1500
    },
    {
      name: 'Leather Handbag',
      sku: 'LB-LUX-001',
      category: 'Accessories',
      subcategory: 'Handbags',
      brand: 'LuxuryLeather',
      attributes: {
        margin: 65,
        velocity: 23,
        seasonality: 'year-round',
        size: 'medium',
        profitability: 'high'
      },
      dimensions: { width: 12, depth: 6, height: 10 },
      weightGrams: 800
    },
    {
      name: 'Wool Scarf',
      sku: 'WS-WARM-001',
      category: 'Accessories',
      subcategory: 'Scarves',
      brand: 'WarmWear',
      attributes: {
        margin: 35,
        velocity: 23,
        seasonality: 'winter',
        size: 'small',
        profitability: 'medium'
      },
      dimensions: { width: 8, depth: 1, height: 60 },
      weightGrams: 200
    }
  ];

  for (const productData of products) {
    await prisma.product.upsert({
      where: { sku: productData.sku },
      update: {},
      create: productData,
    });
  }

  console.log('👕 Created', products.length, 'sample products');

  console.log('✅ Database seed completed successfully!');
  console.log(`📊 FINAL COUNTS: ${totalFixtures} fixtures, ${products.length} products, 1 store, 1 planogram`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });