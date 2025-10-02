/**
 * Advanced Compliance Engine - v2.0.0
 * Implements VM principles and automated compliance validation
 */

import {
  Planogram,
  Store,
  Fixture,
  Product,
  ComplianceViolation,
  PlacementRule,
  ShopResetConstraints,
  VMZone,
  ComplianceLevel,
  ValidationResult
} from '../types';

export interface ComplianceRuleSet {
  vmPrinciples: VMPrincipleRule[];
  safetyRules: SafetyRule[];
  shopResetRules: ShopResetRule[];
  regulatoryRules: RegulatoryRule[];
}

export interface VMPrincipleRule {
  id: string;
  name: string;
  description: string;
  category: 'height_zones' | 'sight_lines' | 'traffic_flow' | 'cross_merchandising';
  priority: number;
  validate: (planogram: Planogram, store: Store) => ComplianceViolation[];
}

export interface SafetyRule {
  id: string;
  name: string;
  description: string;
  severity: 'critical' | 'major' | 'minor';
  validate: (planogram: Planogram, store: Store) => ComplianceViolation[];
}

export interface ShopResetRule {
  id: string;
  name: string;
  description: string;
  basedOnConstraint: string;
  validate: (planogram: Planogram, store: Store) => ComplianceViolation[];
}

export interface RegulatoryRule {
  id: string;
  name: string;
  description: string;
  regulation: string;
  jurisdiction: string;
  validate: (planogram: Planogram, store: Store) => ComplianceViolation[];
}

export interface ComplianceScore {
  overall: number;
  vmPrinciples: number;
  safety: number;
  shopResetCompliance: number;
  regulatory: number;
  breakdown: {
    [category: string]: {
      score: number;
      violations: number;
      warnings: number;
    };
  };
}

export class ComplianceEngine {
  private ruleSet: ComplianceRuleSet;

  constructor() {
    this.ruleSet = this.initializeRuleSet();
  }

  /**
   * Perform comprehensive compliance validation
   */
  async validateCompliance(planogram: Planogram, store: Store): Promise<ValidationResult & { score: ComplianceScore }> {
    const violations: ComplianceViolation[] = [];
    const warnings: ComplianceViolation[] = [];

    // Validate VM principles
    const vmViolations = await this.validateVMPrinciples(planogram, store);
    violations.push(...vmViolations.filter(v => v.severity === 'critical' || v.severity === 'major'));
    warnings.push(...vmViolations.filter(v => v.severity === 'minor'));

    // Validate safety rules
    const safetyViolations = await this.validateSafetyRules(planogram, store);
    violations.push(...safetyViolations.filter(v => v.severity === 'critical' || v.severity === 'major'));
    warnings.push(...safetyViolations.filter(v => v.severity === 'minor'));

    // Validate Shop Reset constraints
    const shopResetViolations = await this.validateShopResetRules(planogram, store);
    violations.push(...shopResetViolations.filter(v => v.severity === 'critical' || v.severity === 'major'));
    warnings.push(...shopResetViolations.filter(v => v.severity === 'minor'));

    // Validate regulatory compliance
    const regulatoryViolations = await this.validateRegulatoryRules(planogram, store);
    violations.push(...regulatoryViolations.filter(v => v.severity === 'critical' || v.severity === 'major'));
    warnings.push(...regulatoryViolations.filter(v => v.severity === 'minor'));

    // Calculate compliance scores
    const score = this.calculateComplianceScore(planogram, violations, warnings);

    // Update planogram compliance
    planogram.compliance = {
      score: score.overall,
      violations,
      warnings
    };

    return {
      isValid: violations.length === 0,
      errors: violations.map(v => v.description),
      warnings: warnings.map(w => w.description),
      score
    };
  }

  /**
   * Validate VM principles (eye level, reach zones, etc.)
   */
  private async validateVMPrinciples(planogram: Planogram, store: Store): Promise<ComplianceViolation[]> {
    const violations: ComplianceViolation[] = [];

    for (const rule of this.ruleSet.vmPrinciples) {
      const ruleViolations = rule.validate(planogram, store);
      violations.push(...ruleViolations);
    }

    return violations;
  }

  /**
   * Validate safety rules
   */
  private async validateSafetyRules(planogram: Planogram, store: Store): Promise<ComplianceViolation[]> {
    const violations: ComplianceViolation[] = [];

    for (const rule of this.ruleSet.safetyRules) {
      const ruleViolations = rule.validate(planogram, store);
      violations.push(...ruleViolations);
    }

    return violations;
  }

  /**
   * Validate Shop Reset specific constraints
   */
  private async validateShopResetRules(planogram: Planogram, store: Store): Promise<ComplianceViolation[]> {
    const violations: ComplianceViolation[] = [];

    for (const rule of this.ruleSet.shopResetRules) {
      const ruleViolations = rule.validate(planogram, store);
      violations.push(...ruleViolations);
    }

    return violations;
  }

  /**
   * Validate regulatory compliance
   */
  private async validateRegulatoryRules(planogram: Planogram, store: Store): Promise<ComplianceViolation[]> {
    const violations: ComplianceViolation[] = [];

    for (const rule of this.ruleSet.regulatoryRules) {
      const ruleViolations = rule.validate(planogram, store);
      violations.push(...ruleViolations);
    }

    return violations;
  }

  /**
   * Calculate detailed compliance scores
   */
  private calculateComplianceScore(
    planogram: Planogram,
    violations: ComplianceViolation[],
    warnings: ComplianceViolation[]
  ): ComplianceScore {
    const totalFixtures = planogram.layout.fixtures.length;
    const totalProducts = planogram.layout.products.length;
    const totalItems = totalFixtures + totalProducts;

    if (totalItems === 0) {
      return {
        overall: 100,
        vmPrinciples: 100,
        safety: 100,
        shopResetCompliance: 100,
        regulatory: 100,
        breakdown: {}
      };
    }

    // Calculate category scores
    const categories = ['vm_principle', 'safety', 'constraint', 'regulation'];
    const breakdown: any = {};

    categories.forEach(category => {
      const categoryViolations = violations.filter(v => v.type === category);
      const categoryWarnings = warnings.filter(v => v.type === category);

      // Score calculation: start at 100, deduct points for violations
      let score = 100;
      score -= categoryViolations.filter(v => v.severity === 'critical').length * 15;
      score -= categoryViolations.filter(v => v.severity === 'major').length * 10;
      score -= categoryWarnings.length * 2;

      breakdown[category] = {
        score: Math.max(0, score),
        violations: categoryViolations.length,
        warnings: categoryWarnings.length
      };
    });

    // Calculate overall and category scores
    const vmPrinciples = breakdown.vm_principle?.score || 100;
    const safety = breakdown.safety?.score || 100;
    const shopResetCompliance = breakdown.constraint?.score || 100;
    const regulatory = breakdown.regulation?.score || 100;

    // Weighted overall score (safety is most important)
    const overall = Math.round(
      (safety * 0.4) +
      (vmPrinciples * 0.3) +
      (shopResetCompliance * 0.2) +
      (regulatory * 0.1)
    );

    return {
      overall,
      vmPrinciples,
      safety,
      shopResetCompliance,
      regulatory,
      breakdown
    };
  }

  /**
   * Generate recommendations for improving compliance
   */
  generateRecommendations(planogram: Planogram, store: Store): string[] {
    const recommendations: string[] = [];

    // Analyze violations and generate specific recommendations
    planogram.compliance.violations.forEach(violation => {
      if (violation.autoFixAvailable) {
        recommendations.push(`Auto-fix available: ${violation.recommendation}`);
      } else {
        recommendations.push(violation.recommendation);
      }
    });

    // Add proactive recommendations based on layout analysis
    const proactiveRecommendations = this.generateProactiveRecommendations(planogram, store);
    recommendations.push(...proactiveRecommendations);

    return recommendations;
  }

  /**
   * Attempt to auto-fix compliance violations where possible
   */
  async autoFixViolations(planogram: Planogram, store: Store): Promise<{
    fixed: ComplianceViolation[];
    cannotFix: ComplianceViolation[];
  }> {
    const fixed: ComplianceViolation[] = [];
    const cannotFix: ComplianceViolation[] = [];

    for (const violation of planogram.compliance.violations) {
      if (violation.autoFixAvailable) {
        const success = await this.attemptAutoFix(violation, planogram, store);
        if (success) {
          fixed.push(violation);
        } else {
          cannotFix.push(violation);
        }
      } else {
        cannotFix.push(violation);
      }
    }

    return { fixed, cannotFix };
  }

  private async attemptAutoFix(
    violation: ComplianceViolation,
    planogram: Planogram,
    store: Store
  ): Promise<boolean> {
    try {
      switch (violation.type) {
        case 'vm_principle':
          return await this.autoFixVMViolation(violation, planogram);
        case 'safety':
          return await this.autoFixSafetyViolation(violation, planogram);
        default:
          return false;
      }
    } catch (error) {
      console.error('Auto-fix failed:', error);
      return false;
    }
  }

  private async autoFixVMViolation(violation: ComplianceViolation, planogram: Planogram): Promise<boolean> {
    // Implementation for auto-fixing VM violations
    // Example: moving products to appropriate VM zones
    return false;
  }

  private async autoFixSafetyViolation(violation: ComplianceViolation, planogram: Planogram): Promise<boolean> {
    // Implementation for auto-fixing safety violations
    // Example: ensuring clearance paths
    return false;
  }

  private generateProactiveRecommendations(planogram: Planogram, store: Store): string[] {
    const recommendations: string[] = [];

    // Analyze fixture distribution
    const vmZoneDistribution = this.analyzeVMZoneDistribution(planogram);
    if (vmZoneDistribution.eye < 0.3) {
      recommendations.push('Consider placing more high-margin products at eye level (60-72")');
    }

    // Analyze traffic flow
    const trafficFlowIssues = this.analyzeTrafficFlow(planogram, store);
    recommendations.push(...trafficFlowIssues);

    // Analyze anchor placement
    const anchorRecommendations = this.analyzeAnchorPlacement(planogram, store);
    recommendations.push(...anchorRecommendations);

    return recommendations;
  }

  private analyzeVMZoneDistribution(planogram: Planogram) {
    const total = planogram.layout.fixtures.length;
    if (total === 0) return { eye: 0, reach: 0, stretch: 0, stoop: 0 };

    const distribution = { eye: 0, reach: 0, stretch: 0, stoop: 0 };

    planogram.layout.fixtures.forEach(fixture => {
      distribution[fixture.vmZone]++;
    });

    // Convert to percentages
    Object.keys(distribution).forEach(zone => {
      distribution[zone] = distribution[zone] / total;
    });

    return distribution;
  }

  private analyzeTrafficFlow(planogram: Planogram, store: Store): string[] {
    const recommendations: string[] = [];

    // Check for bottlenecks
    const bottlenecks = this.findTrafficBottlenecks(planogram, store);
    bottlenecks.forEach(bottleneck => {
      recommendations.push(`Traffic bottleneck detected near ${bottleneck.location}. Consider widening the aisle or relocating fixtures.`);
    });

    // Check for dead zones
    const deadZones = this.findDeadZones(planogram, store);
    deadZones.forEach(zone => {
      recommendations.push(`Dead zone detected in ${zone.area}. Consider adding an anchor display to drive traffic.`);
    });

    return recommendations;
  }

  private analyzeAnchorPlacement(planogram: Planogram, store: Store): string[] {
    const recommendations: string[] = [];

    const anchors = planogram.layout.anchors;
    const sections = store.constraints.shop_layout.sections;

    // Check anchor distribution across sections
    sections.forEach(section => {
      const sectionAnchors = anchors.filter(anchor => anchor.section === section.name);
      const expectedAnchors = store.config.focal_anchors_per_section;

      if (sectionAnchors.length < expectedAnchors) {
        recommendations.push(`Section "${section.name}" has ${sectionAnchors.length} anchors but should have ${expectedAnchors} according to configuration.`);
      }
    });

    return recommendations;
  }

  private findTrafficBottlenecks(planogram: Planogram, store: Store): Array<{ location: string }> {
    // Simplified bottleneck detection
    return [];
  }

  private findDeadZones(planogram: Planogram, store: Store): Array<{ area: string }> {
    // Simplified dead zone detection
    return [];
  }

  /**
   * Initialize the comprehensive rule set
   */
  private initializeRuleSet(): ComplianceRuleSet {
    return {
      vmPrinciples: this.createVMPrincipleRules(),
      safetyRules: this.createSafetyRules(),
      shopResetRules: this.createShopResetRules(),
      regulatoryRules: this.createRegulatoryRules()
    };
  }

  private createVMPrincipleRules(): VMPrincipleRule[] {
    return [
      {
        id: 'vm-001',
        name: 'Eye Level Optimization',
        description: 'Best-selling products should be placed at eye level (60-72 inches)',
        category: 'height_zones',
        priority: 1,
        validate: (planogram: Planogram, store: Store) => {
          const violations: ComplianceViolation[] = [];

          // Check if high-velocity products are at eye level
          planogram.layout.products.forEach(product => {
            if (product.attributes.velocity > 0.8 && product.role === 'anchor') {
              const fixture = planogram.layout.fixtures.find(f => f.id === product.placement.fixtureId);
              if (fixture && fixture.vmZone !== 'eye') {
                violations.push({
                  id: `vm-001-${product.id}`,
                  type: 'vm_principle',
                  severity: 'major',
                  productId: product.id,
                  fixtureId: fixture.id,
                  description: `High-velocity product "${product.name}" should be placed at eye level`,
                  recommendation: 'Move this product to a fixture in the eye level zone (60-72")',
                  autoFixAvailable: true
                });
              }
            }
          });

          return violations;
        }
      },
      {
        id: 'vm-002',
        name: 'Stretch Zone Premium Placement',
        description: 'Premium/high-margin products should be placed in stretch zone (72+ inches)',
        category: 'height_zones',
        priority: 2,
        validate: (planogram: Planogram, store: Store) => {
          const violations: ComplianceViolation[] = [];

          planogram.layout.products.forEach(product => {
            if (product.attributes.margin > 0.6 && product.role !== 'filler') {
              const fixture = planogram.layout.fixtures.find(f => f.id === product.placement.fixtureId);
              if (fixture && fixture.vmZone === 'stoop') {
                violations.push({
                  id: `vm-002-${product.id}`,
                  type: 'vm_principle',
                  severity: 'minor',
                  productId: product.id,
                  fixtureId: fixture.id,
                  description: `High-margin product "${product.name}" is placed too low`,
                  recommendation: 'Consider moving to stretch zone to create aspirational appeal',
                  autoFixAvailable: false
                });
              }
            }
          });

          return violations;
        }
      },
      {
        id: 'vm-003',
        name: 'Sight Line Clearance',
        description: 'Maintain clear sight lines from entrance to key areas',
        category: 'sight_lines',
        priority: 1,
        validate: (planogram: Planogram, store: Store) => {
          const violations: ComplianceViolation[] = [];

          // Check entrance zone fixtures for height violations
          store.constraints.shop_layout.sections.forEach(section => {
            if (section.name.toLowerCase().includes('entrance')) {
              const entranceFixtures = planogram.layout.fixtures.filter(f =>
                f.shopSection === section.name && f.dimensions.height > 48
              );

              entranceFixtures.forEach(fixture => {
                violations.push({
                  id: `vm-003-${fixture.id}`,
                  type: 'vm_principle',
                  severity: 'major',
                  fixtureId: fixture.id,
                  description: `Fixture "${fixture.name}" blocks sight lines from entrance`,
                  recommendation: 'Use lower fixtures (<48") in entrance zone or relocate to maintain sight lines',
                  autoFixAvailable: false
                });
              });
            }
          });

          return violations;
        }
      },
      {
        id: 'vm-004',
        name: 'Cross-Merchandising Proximity',
        description: 'Related products should be placed in proximity for cross-selling',
        category: 'cross_merchandising',
        priority: 3,
        validate: (planogram: Planogram, store: Store) => {
          const violations: ComplianceViolation[] = [];

          // Check if cross-sell products are placed too far from each other
          planogram.layout.products.forEach(product => {
            if (product.crossSells.length > 0) {
              const productFixture = planogram.layout.fixtures.find(f => f.id === product.placement.fixtureId);
              if (!productFixture) return;

              product.crossSells.forEach(crossSellSku => {
                const crossSellProduct = planogram.layout.products.find(p => p.sku === crossSellSku);
                if (crossSellProduct) {
                  const crossSellFixture = planogram.layout.fixtures.find(f => f.id === crossSellProduct.placement.fixtureId);
                  if (crossSellFixture) {
                    const distance = this.calculateDistance(productFixture.position, crossSellFixture.position);
                    if (distance > 8) { // More than 8 feet apart
                      violations.push({
                        id: `vm-004-${product.id}-${crossSellProduct.id}`,
                        type: 'vm_principle',
                        severity: 'minor',
                        productId: product.id,
                        description: `Cross-sell products "${product.name}" and "${crossSellProduct.name}" are too far apart`,
                        recommendation: 'Place cross-sell products within 8 feet of each other',
                        autoFixAvailable: false
                      });
                    }
                  }
                }
              });
            }
          });

          return violations;
        }
      }
    ];
  }

  private createSafetyRules(): SafetyRule[] {
    return [
      {
        id: 'safety-001',
        name: 'Emergency Egress Clearance',
        description: 'Maintain clear egress paths to all emergency exits',
        severity: 'critical',
        validate: (planogram: Planogram, store: Store) => {
          const violations: ComplianceViolation[] = [];

          // Check for fixtures blocking egress paths
          // This is a simplified implementation
          planogram.layout.fixtures.forEach(fixture => {
            // Check if fixture is too close to store boundaries (assuming exits are at boundaries)
            if (fixture.position.x < 3 || fixture.position.y < 3 ||
                fixture.position.x > store.dimensions.width - 3 ||
                fixture.position.y > store.dimensions.height - 3) {

              // Check if it creates a bottleneck
              const clearanceWidth = Math.min(
                fixture.position.x,
                fixture.position.y,
                store.dimensions.width - fixture.position.x,
                store.dimensions.height - fixture.position.y
              );

              if (clearanceWidth < 3) {
                violations.push({
                  id: `safety-001-${fixture.id}`,
                  type: 'safety',
                  severity: 'critical',
                  fixtureId: fixture.id,
                  description: `Fixture "${fixture.name}" may block emergency egress path`,
                  recommendation: 'Maintain at least 3 feet clearance to emergency exits',
                  autoFixAvailable: true
                });
              }
            }
          });

          return violations;
        }
      },
      {
        id: 'safety-002',
        name: 'Weight Distribution',
        description: 'Heavy items should be placed on lower shelves',
        severity: 'major',
        validate: (planogram: Planogram, store: Store) => {
          const violations: ComplianceViolation[] = [];

          planogram.layout.products.forEach(product => {
            if (product.attributes.weight > 5 && product.placement.shelfLevel > 2) {
              violations.push({
                id: `safety-002-${product.id}`,
                type: 'safety',
                severity: 'major',
                productId: product.id,
                description: `Heavy product "${product.name}" (${product.attributes.weight}lbs) is placed too high`,
                recommendation: 'Place heavy items (>5lbs) on lower shelves for safety',
                autoFixAvailable: true
              });
            }
          });

          return violations;
        }
      },
      {
        id: 'safety-003',
        name: 'Fragile Item Placement',
        description: 'Fragile items should be placed on stable surfaces',
        severity: 'major',
        validate: (planogram: Planogram, store: Store) => {
          const violations: ComplianceViolation[] = [];

          // Check Shop Reset constraints for fragile item rules
          store.constraints.constraints.safety.forEach(constraint => {
            if (constraint.rule === 'no_fragile_items') {
              const fixtureType = constraint.fixture_type;

              planogram.layout.products.forEach(product => {
                if (product.attributes.is_fragile) {
                  const fixture = planogram.layout.fixtures.find(f => f.id === product.placement.fixtureId);
                  if (fixture && fixture.type === fixtureType) {
                    violations.push({
                      id: `safety-003-${product.id}`,
                      type: 'safety',
                      severity: 'major',
                      productId: product.id,
                      fixtureId: fixture.id,
                      description: `Fragile product "${product.name}" is placed on unstable ${fixtureType}`,
                      recommendation: constraint.description,
                      autoFixAvailable: true
                    });
                  }
                }
              });
            }
          });

          return violations;
        }
      }
    ];
  }

  private createShopResetRules(): ShopResetRule[] {
    return [
      {
        id: 'shop-001',
        name: 'Visibility Constraint Compliance',
        description: 'Fixtures must comply with visibility constraints',
        basedOnConstraint: 'visibility',
        validate: (planogram: Planogram, store: Store) => {
          const violations: ComplianceViolation[] = [];

          store.constraints.constraints.visibility.forEach(constraint => {
            if (constraint.rule === 'no_higher_than_4ft') {
              const zoneFixtures = planogram.layout.fixtures.filter(f =>
                f.shopSection === constraint.zone && f.dimensions.height > 48
              );

              zoneFixtures.forEach(fixture => {
                violations.push({
                  id: `shop-001-${fixture.id}`,
                  type: 'constraint',
                  severity: 'major',
                  fixtureId: fixture.id,
                  description: `Fixture "${fixture.name}" violates height constraint in ${constraint.zone}`,
                  recommendation: constraint.description,
                  autoFixAvailable: false
                });
              });
            }
          });

          return violations;
        }
      },
      {
        id: 'shop-002',
        name: 'Lighting Constraint Compliance',
        description: 'Product placement must consider lighting conditions',
        basedOnConstraint: 'lighting',
        validate: (planogram: Planogram, store: Store) => {
          const violations: ComplianceViolation[] = [];

          store.constraints.constraints.lighting.forEach(constraint => {
            if (constraint.tactic === 'high_contrast_packaging') {
              const zoneProducts = planogram.layout.products.filter(product => {
                const fixture = planogram.layout.fixtures.find(f => f.id === product.placement.fixtureId);
                return fixture && fixture.shopSection === constraint.zone;
              });

              zoneProducts.forEach(product => {
                if (product.attributes.packaging_contrast === 'low') {
                  violations.push({
                    id: `shop-002-${product.id}`,
                    type: 'constraint',
                    severity: 'minor',
                    productId: product.id,
                    description: `Product "${product.name}" has low contrast packaging in dim ${constraint.zone}`,
                    recommendation: constraint.description,
                    autoFixAvailable: false
                  });
                }
              });
            }
          });

          return violations;
        }
      }
    ];
  }

  private createRegulatoryRules(): RegulatoryRule[] {
    return [
      {
        id: 'reg-001',
        name: 'ADA Compliance - Aisle Width',
        description: 'Aisles must be at least 36 inches wide for ADA compliance',
        regulation: 'Americans with Disabilities Act',
        jurisdiction: 'United States',
        validate: (planogram: Planogram, store: Store) => {
          const violations: ComplianceViolation[] = [];

          // Simplified aisle width checking
          // In a real implementation, this would use more sophisticated spatial analysis
          const fixtures = planogram.layout.fixtures;

          for (let i = 0; i < fixtures.length; i++) {
            for (let j = i + 1; j < fixtures.length; j++) {
              const distance = this.calculateDistance(fixtures[i].position, fixtures[j].position);
              const minDistance = (fixtures[i].dimensions.width + fixtures[j].dimensions.width) / 2 + 3; // 3 feet minimum aisle

              if (distance < minDistance && this.areFixturesAdjacent(fixtures[i], fixtures[j])) {
                violations.push({
                  id: `reg-001-${fixtures[i].id}-${fixtures[j].id}`,
                  type: 'regulation',
                  severity: 'critical',
                  fixtureId: fixtures[i].id,
                  description: `Aisle between "${fixtures[i].name}" and "${fixtures[j].name}" is too narrow for ADA compliance`,
                  recommendation: 'Maintain at least 36" (3 feet) aisle width for accessibility',
                  autoFixAvailable: true
                });
              }
            }
          }

          return violations;
        }
      }
    ];
  }

  // === Utility Methods ===

  private calculateDistance(pos1: { x: number, y: number }, pos2: { x: number, y: number }): number {
    return Math.sqrt(Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2));
  }

  private areFixturesAdjacent(fixture1: Fixture, fixture2: Fixture): boolean {
    // Simplified adjacency check
    const distance = this.calculateDistance(fixture1.position, fixture2.position);
    const maxDistance = Math.max(fixture1.dimensions.width, fixture1.dimensions.depth) +
                       Math.max(fixture2.dimensions.width, fixture2.dimensions.depth);
    return distance <= maxDistance * 2; // Within 2x the fixture size
  }

  /**
   * Get human-readable compliance summary
   */
  getComplianceSummary(score: ComplianceScore): string {
    if (score.overall >= 95) {
      return 'Excellent compliance - planogram meets all major requirements';
    } else if (score.overall >= 85) {
      return 'Good compliance - minor issues that should be addressed';
    } else if (score.overall >= 70) {
      return 'Fair compliance - several issues require attention';
    } else {
      return 'Poor compliance - major issues must be resolved before execution';
    }
  }

  /**
   * Export compliance report as text
   */
  exportComplianceReport(planogram: Planogram, score: ComplianceScore): string {
    const report: string[] = [];

    report.push('VM PLANOGRAM COMPLIANCE REPORT');
    report.push('================================');
    report.push('');
    report.push(`Planogram: ${planogram.name} v${planogram.version}`);
    report.push(`Generated: ${new Date().toLocaleString()}`);
    report.push('');
    report.push('COMPLIANCE SCORES');
    report.push('-----------------');
    report.push(`Overall Score: ${score.overall}%`);
    report.push(`VM Principles: ${score.vmPrinciples}%`);
    report.push(`Safety: ${score.safety}%`);
    report.push(`Shop Reset Compliance: ${score.shopResetCompliance}%`);
    report.push(`Regulatory: ${score.regulatory}%`);
    report.push('');
    report.push(`Summary: ${this.getComplianceSummary(score)}`);
    report.push('');

    if (planogram.compliance.violations.length > 0) {
      report.push('CRITICAL VIOLATIONS');
      report.push('------------------');
      planogram.compliance.violations.forEach((violation, index) => {
        report.push(`${index + 1}. ${violation.description}`);
        report.push(`   Recommendation: ${violation.recommendation}`);
        report.push('');
      });
    }

    if (planogram.compliance.warnings.length > 0) {
      report.push('WARNINGS');
      report.push('--------');
      planogram.compliance.warnings.forEach((warning, index) => {
        report.push(`${index + 1}. ${warning.description}`);
        report.push(`   Recommendation: ${warning.recommendation}`);
        report.push('');
      });
    }

    return report.join('\n');
  }
}