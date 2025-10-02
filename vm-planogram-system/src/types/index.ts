export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'USER' | 'ADMIN' | 'MANAGER';
  isActive: boolean;
  createdAt: string;
}

export interface Store {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  storeNumber?: string;
  dimensions: StoreDimensions;
  constraints: StoreConstraints;
  trafficPatterns: TrafficPattern[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoreDimensions {
  width: number;
  height: number;
  ceilingHeight: number;
}

export interface StoreConstraints {
  entryPoints: Point[];
  pillars: Rectangle[];
  utilities: Rectangle[];
  safetyRequirements: string[];
}

export interface Point {
  x: number;
  y: number;
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TrafficPattern {
  name: string;
  path: Point[];
  intensity: number;
}

export interface Fixture {
  id: string;
  name: string;
  ulineSku?: string;
  category: string;
  subcategory?: string;
  dimensions: FixtureDimensions;
  capacity: FixtureCapacity;
  material?: string;
  color?: string;
  specifications: Record<string, any>;
  priceCents?: number;
  availabilityStatus: string;
  isCustom: boolean;
}

export interface FixtureDimensions {
  width: number;
  depth: number;
  height: number;
}

export interface FixtureCapacity {
  units: number;
  weight: number;
}

export interface StoreFixture {
  id: string;
  storeId: string;
  fixtureId: string;
  x: number;
  y: number;
  rotation: number;
  vmZone: VmZone;
  fixture: Fixture;
}

export interface Product {
  id: string;
  name: string;
  sku?: string;
  category: string;
  subcategory?: string;
  brand?: string;
  attributes: ProductAttributes;
  dimensions?: ProductDimensions;
  weightGrams?: number;
}

export interface ProductAttributes {
  margin?: number;
  velocity?: number;
  seasonality?: string;
  size?: 'small' | 'medium' | 'large';
  profitability?: 'low' | 'medium' | 'high';
}

export interface ProductDimensions {
  width: number;
  depth: number;
  height: number;
}

export interface ProductPlacement {
  id: string;
  productId: string;
  fixtureId: string;
  storeFixtureId: string;
  position: number;
  facings: number;
  product: Product;
}

export interface Planogram {
  id: string;
  storeId: string;
  name: string;
  version: number;
  status: PlanogramStatus;
  analyticsInput?: string;
  parsedInsights: PlacementRule[];
  layoutData: PlanogramLayout;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  executedAt?: string;
  store: Store;
}

export interface PlanogramLayout {
  fixtures: StoreFixture[];
  products: ProductPlacement[];
  trafficFlow: TrafficFlow;
}

export interface TrafficFlow {
  primaryPath: Point[];
  secondaryPaths: Point[][];
  hotspots: Point[];
}

export interface PlacementRule {
  type: 'sales_trend' | 'profitability' | 'cross_sell' | 'seasonality' | 'clearance';
  confidence: number;
  productIds: string[];
  action: 'promote' | 'eye_level' | 'adjacent_to' | 'clear' | 'feature';
  zone?: VmZone;
  reasoning: string;
}

export interface ExecutionTask {
  id: string;
  planogramId: string;
  title: string;
  description?: string;
  section: string;
  priority: number;
  estimatedMinutes?: number;
  status: TaskStatus;
  assignedTo?: string;
  completedAt?: string;
  photoUrl?: string;
  notes?: string;
}

export interface PickList {
  id: string;
  planogramId: string;
  name: string;
  section: string;
  items: PickListItem[];
  assignedTo?: string;
}

export interface PickListItem {
  productId: string;
  productName: string;
  quantity: number;
  fromLocation?: string;
  toLocation: string;
  priority: number;
  completed: boolean;
}

export type VmZone = 'EYE' | 'REACH' | 'STRETCH' | 'STOOP';

export type PlanogramStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'IN_EXECUTION'
  | 'COMPLETED'
  | 'ARCHIVED';

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';

export interface AnalyticsInsight {
  text: string;
  type: 'sales_trend' | 'profitability' | 'relationship' | 'seasonality' | 'urgency';
  confidence: number;
  entities: string[];
  value?: number;
  timeframe?: string;
}

export interface CreateStoreRequest {
  name: string;
  address?: string;
  phone?: string;
  storeNumber?: string;
  dimensions: StoreDimensions;
}

export interface CreatePlanogramRequest {
  storeId: string;
  name: string;
  analyticsInput?: string;
}

export interface GeneratePlanogramRequest {
  storeId: string;
  insights: AnalyticsInsight[];
  preferences?: {
    prioritizeProfit: boolean;
    maintainTrafficFlow: boolean;
    maximizeVisibility: boolean;
  };
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}