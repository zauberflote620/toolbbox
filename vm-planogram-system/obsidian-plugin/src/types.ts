/**
 * Enhanced VM Planogram Types - v2.0.0
 * Integrates Shop Reset Toolbox Anchor-and-Spokes methodology
 * with professional VM planogram requirements
 */

// === Shop Reset Toolbox Integration Types ===

export interface ShopResetConstraints {
  shop_layout: {
    description: string;
    sections: ShopSection[];
  };
  constraints: {
    visibility: VisibilityConstraint[];
    safety: SafetyConstraint[];
    lighting: LightingConstraint[];
  };
  inventory_taxonomy?: {
    categories: string[];
    attributes: InventoryAttribute[];
  };
  custom_scoring_weights?: ScoringWeights;
}

export interface ShopSection {
  name: string;
  description: string;
  fixtures: string[];
  priority?: number;
  vm_zone?: VMZone;
}

export interface VisibilityConstraint {
  zone: string;
  rule: string;
  description: string;
}

export interface SafetyConstraint {
  fixture_type?: string;
  zone?: string;
  rule: string;
  description: string;
}

export interface LightingConstraint {
  zone: string;
  condition: string;
  tactic: string;
  description: string;
}

export interface InventoryAttribute {
  name: string;
  type: 'boolean' | 'string' | 'number';
}

export interface ScoringWeights {
  safety_accommodation: number;
  visibility_accommodation: number;
  journey_coherence: number;
  visual_legibility: number;
  reusability: number;
}

export interface ShopResetConfig {
  anchor_selection_criteria: 'high_margin' | 'new_arrival' | 'high_velocity' | 'seasonal_theme';
  focal_anchors_per_section: number;
  spoke_density: number;
  novelty_ratio: number;
  pos_contrast_tactic: 'high_contrast_packaging' | 'bold_color_blocking' | 'illuminated_display';
  section_weights: Record<string, number>;
}

// === Enhanced VM Planogram Types ===

export type VMZone = 'eye' | 'reach' | 'stretch' | 'stoop' | 'strike';
export type FixtureType = 'gondola' | 'endcap' | 'wall' | 'table' | 'rack' | 'tower' | 'custom';
export type ProductRole = 'anchor' | 'spoke' | 'filler' | 'promotional';
export type ComplianceLevel = 'compliant' | 'warning' | 'violation';

export interface VMPlanogramSettings {
  defaultStoreWidth: number;
  defaultStoreHeight: number;
  autoSave: boolean;
  measurementUnit: 'inches' | 'feet' | 'cm' | 'meters';
  scaleRatio: number; // pixels per unit (default: 10px = 1 inch)
  shopResetIntegration: boolean;
  showComplianceAlerts: boolean;
  enablePDFExport: boolean;
}

export interface Store {
  id: string;
  name: string;
  address?: string;
  dimensions: {
    width: number;
    height: number;
    ceilingHeight: number;
    unit: string;
  };
  constraints: ShopResetConstraints;
  config: ShopResetConfig;
  trafficPatterns: TrafficFlow[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TrafficFlow {
  id: string;
  name: string;
  path: Point[];
  intensity: number; // 0-1 scale
  direction: 'bidirectional' | 'clockwise' | 'counterclockwise';
}

export interface Point {
  x: number;
  y: number;
}

export interface Fixture {
  id: string;
  name: string;
  type: FixtureType;
  position: Point;
  dimensions: {
    width: number;
    depth: number;
    height: number;
  };
  rotation: number;
  vmZone: VMZone;
  capacity: {
    units: number;
    weight: number;
  };
  ulineSKU?: string;
  color: string;
  shopSection?: string;
  complianceStatus: ComplianceLevel;
  complianceIssues: string[];
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  role: ProductRole;
  attributes: {
    margin: number;
    velocity: number;
    seasonality: string;
    size: 'small' | 'medium' | 'large';
    weight: number;
    is_fragile: boolean;
    is_new_arrival: boolean;
    packaging_contrast: 'low' | 'medium' | 'high';
  };
  placement: {
    fixtureId: string;
    shelfLevel: number;
    position: number;
    facings: number;
  };
  crossSells: string[];
  complianceStatus: ComplianceLevel;
}

export interface Planogram {
  id: string;
  storeId: string;
  name: string;
  version: number;
  status: 'draft' | 'approved' | 'executed';
  metadata: {
    created: Date;
    lastModified: Date;
    author: string;
    resetType: 'full' | 'partial' | 'seasonal';
  };
  layout: {
    fixtures: Fixture[];
    products: Product[];
    anchors: AnchorConfiguration[];
  };
  compliance: {
    score: number;
    violations: ComplianceViolation[];
    warnings: ComplianceViolation[];
  };
  analytics: {
    insights: string[];
    parsedRules: PlacementRule[];
    recommendations: string[];
  };
}

export interface AnchorConfiguration {
  id: string;
  fixtureId: string;
  anchorProduct: Product;
  spokeProducts: Product[];
  section: string;
  rationale: string;
  performance: {
    trafficGeneration: number;
    crossSellOpportunity: number;
    marginContribution: number;
  };
}

export interface PlacementRule {
  id: string;
  type: 'height' | 'adjacency' | 'weight' | 'visibility' | 'safety';
  description: string;
  priority: number;
  applicableProducts: string[];
  applicableFixtures: string[];
}

export interface ComplianceViolation {
  id: string;
  type: 'safety' | 'vm_principle' | 'constraint' | 'regulation';
  severity: 'critical' | 'major' | 'minor';
  fixtureId?: string;
  productId?: string;
  description: string;
  recommendation: string;
  autoFixAvailable: boolean;
}

export interface PDFExportOptions {
  format: 'letter' | 'legal' | 'tabloid' | 'a4' | 'a3';
  orientation: 'portrait' | 'landscape';
  scale: number;
  includeCompliance: boolean;
  includeExecutionMaterials: boolean;
  watermark?: string;
}

export interface ExecutionMaterials {
  pickLists: PickList[];
  taskCards: TaskCard[];
  complianceChecklist: ComplianceChecklistItem[];
  validationForm: ValidationFormItem[];
}

export interface PickList {
  id: string;
  section: string;
  team: string;
  products: {
    sku: string;
    name: string;
    fromLocation: string;
    toLocation: string;
    quantity: number;
    priority: number;
  }[];
  estimatedTime: number;
}

export interface TaskCard {
  id: string;
  title: string;
  description: string;
  section: string;
  beforeImage?: string;
  afterImage?: string;
  instructions: string[];
  safetyNotes: string[];
  estimatedTime: number;
  completionCriteria: string[];
}

export interface ComplianceChecklistItem {
  id: string;
  category: string;
  item: string;
  requirement: string;
  checkMethod: string;
  severity: 'critical' | 'major' | 'minor';
}

export interface ValidationFormItem {
  id: string;
  section: string;
  checkpoint: string;
  expectedOutcome: string;
  actualOutcome?: string;
  photos?: string[];
  notes?: string;
  status: 'pass' | 'fail' | 'needs_review';
}

// === Event Types for Plugin Architecture ===

export interface PlanogramEvent {
  type: 'fixture_added' | 'fixture_moved' | 'product_placed' | 'compliance_check' | 'export_pdf';
  timestamp: Date;
  data: any;
  user?: string;
}

export interface UndoableAction {
  id: string;
  type: string;
  description: string;
  undo: () => void;
  redo: () => void;
  timestamp: Date;
}

// === Utility Types ===

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  fixtureCount: number;
  productCount: number;
  complexityScore: number;
}