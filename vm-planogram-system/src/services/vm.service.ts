import { PlacementRule, VmZone, Point, StoreFixture } from '../types';

interface VMPlacementConfig {
  prioritizeProfit: boolean;
  maintainTrafficFlow: boolean;
  maximizeVisibility: boolean;
}

interface VMZoneSpec {
  name: VmZone;
  heightRange: [number, number]; // in inches
  description: string;
  priority: number;
}

export class VMService {
  private static readonly VM_ZONES: VMZoneSpec[] = [
    {
      name: 'EYE',
      heightRange: [60, 72],
      description: 'Eye level - premium placement for bestsellers and high-margin items',
      priority: 1
    },
    {
      name: 'REACH',
      heightRange: [48, 60],
      description: 'Reach zone - accessible placement for everyday items',
      priority: 2
    },
    {
      name: 'STRETCH',
      heightRange: [72, 84],
      description: 'Stretch zone - aspirational items and seasonal displays',
      priority: 3
    },
    {
      name: 'STOOP',
      heightRange: [0, 48],
      description: 'Stoop zone - bulk items, clearance, and children\'s products',
      priority: 4
    }
  ];

  private static readonly TRAFFIC_FLOW_PATTERNS = {
    rightHanded: true, // Most people favor right-hand turns
    entryAttention: 10, // feet from entrance where attention is highest
    powerWall: 'right', // Right wall typically gets most attention
    decompression: 5 // feet from entrance before engaging shoppers
  };

  static getOptimalZone(rule: PlacementRule): VmZone {
    switch (rule.action) {
      case 'eye_level':
      case 'promote':
        return 'EYE';
      case 'feature':
        return rule.type === 'profitability' ? 'EYE' : 'REACH';
      case 'clear':
        return 'STOOP';
      case 'adjacent_to':
        return 'REACH'; // Default for cross-sell items
      default:
        return 'REACH';
    }
  }

  static calculatePlacementPriority(rule: PlacementRule, config: VMPlacementConfig): number {
    let priority = rule.confidence * 100;

    // Adjust based on rule type and configuration
    if (config.prioritizeProfit && rule.type === 'profitability') {
      priority += 50;
    }

    if (config.maximizeVisibility && (rule.action === 'eye_level' || rule.action === 'promote')) {
      priority += 30;
    }

    // Sales trend impact
    if (rule.type === 'sales_trend') {
      priority += 20;
    }

    // Urgency gets immediate priority
    if (rule.type === 'clearance') {
      priority += 40;
    }

    return Math.min(priority, 200); // Cap at 200
  }

  static optimizeTrafficFlow(storeLayout: StoreFixture[], entryPoints: Point[]): Point[] {
    const mainPath: Point[] = [];

    if (entryPoints.length === 0) {
      return mainPath;
    }

    const mainEntry = entryPoints[0];

    // Start decompression zone
    mainPath.push({
      x: mainEntry.x + this.TRAFFIC_FLOW_PATTERNS.decompression,
      y: mainEntry.y
    });

    // Right-hand traffic pattern (counter-clockwise)
    const fixtures = storeLayout.filter(f => f.fixture);
    if (fixtures.length > 0) {
      // Create perimeter path avoiding fixtures
      const sortedByX = [...fixtures].sort((a, b) => a.x - b.x);
      const sortedByY = [...fixtures].sort((a, b) => a.y - b.y);

      // Right wall path
      mainPath.push({
        x: sortedByX[sortedByX.length - 1].x + 5,
        y: mainEntry.y
      });

      // Back wall path
      mainPath.push({
        x: sortedByX[sortedByX.length - 1].x + 5,
        y: sortedByY[sortedByY.length - 1].y + 5
      });

      // Left wall path
      mainPath.push({
        x: sortedByX[0].x - 5,
        y: sortedByY[sortedByY.length - 1].y + 5
      });

      // Return to front
      mainPath.push({
        x: sortedByX[0].x - 5,
        y: mainEntry.y
      });
    }

    return mainPath;
  }

  static generateSightLineAnalysis(storeLayout: StoreFixture[], viewPoint: Point): string[] {
    const analysis: string[] = [];
    const viewRadius = 15; // feet

    const visibleFixtures = storeLayout.filter(fixture => {
      const distance = Math.sqrt(
        Math.pow(fixture.x - viewPoint.x, 2) +
        Math.pow(fixture.y - viewPoint.y, 2)
      );
      return distance <= viewRadius;
    });

    if (visibleFixtures.length === 0) {
      analysis.push('No fixtures within optimal viewing distance');
      return analysis;
    }

    // Check for blocking fixtures
    const potentialBlocks = visibleFixtures.filter(fixture => {
      const fixtureHeight = fixture.fixture.dimensions.height;
      return fixtureHeight > 60; // Fixtures over 5 feet can block sight lines
    });

    if (potentialBlocks.length > 0) {
      analysis.push(`${potentialBlocks.length} tall fixtures may block sight lines`);
    }

    // Identify prime visibility zones
    const eyeLevelFixtures = visibleFixtures.filter(fixture =>
      fixture.vmZone === 'EYE'
    );

    if (eyeLevelFixtures.length > 0) {
      analysis.push(`${eyeLevelFixtures.length} fixtures optimally positioned at eye level`);
    }

    // Power wall analysis
    const rightSideFixtures = visibleFixtures.filter(fixture =>
      fixture.x > viewPoint.x
    );

    if (rightSideFixtures.length > 0) {
      analysis.push(`${rightSideFixtures.length} fixtures positioned on power wall (right side)`);
    }

    return analysis;
  }

  static validateVMCompliance(storeLayout: StoreFixture[], rules: PlacementRule[]): string[] {
    const violations: string[] = [];

    // Check zone distribution
    const zoneDistribution = storeLayout.reduce((acc, fixture) => {
      acc[fixture.vmZone] = (acc[fixture.vmZone] || 0) + 1;
      return acc;
    }, {} as Record<VmZone, number>);

    // Eye level should have high-priority items
    const eyeLevelCount = zoneDistribution.EYE || 0;
    const totalFixtures = storeLayout.length;

    if (eyeLevelCount < totalFixtures * 0.2) {
      violations.push('Insufficient eye-level placement - should be 20% of total fixtures');
    }

    // Stoop zone shouldn't exceed 30%
    const stoopCount = zoneDistribution.STOOP || 0;
    if (stoopCount > totalFixtures * 0.3) {
      violations.push('Excessive stoop-level placement - should not exceed 30%');
    }

    // Check for clustering issues
    const clusters = this.findClusters(storeLayout);
    if (clusters.some(cluster => cluster.length > 5)) {
      violations.push('Fixture clustering detected - may create dead zones');
    }

    return violations;
  }

  private static findClusters(fixtures: StoreFixture[]): StoreFixture[][] {
    const clusters: StoreFixture[][] = [];
    const visited = new Set<string>();
    const clusterDistance = 8; // feet

    fixtures.forEach(fixture => {
      if (visited.has(fixture.id)) return;

      const cluster = [fixture];
      visited.add(fixture.id);

      // Find nearby fixtures
      fixtures.forEach(other => {
        if (visited.has(other.id)) return;

        const distance = Math.sqrt(
          Math.pow(fixture.x - other.x, 2) +
          Math.pow(fixture.y - other.y, 2)
        );

        if (distance <= clusterDistance) {
          cluster.push(other);
          visited.add(other.id);
        }
      });

      if (cluster.length > 1) {
        clusters.push(cluster);
      }
    });

    return clusters;
  }

  static getZoneRecommendations(): VMZoneSpec[] {
    return [...this.VM_ZONES];
  }

  static calculateFacings(rule: PlacementRule): number {
    let baseFacings = 1;

    // High-velocity items get more facings
    if (rule.type === 'sales_trend' && rule.confidence > 0.8) {
      baseFacings = 3;
    }

    // High-margin items get premium facings
    if (rule.type === 'profitability') {
      baseFacings = Math.max(baseFacings, 2);
    }

    // Clearance items get reduced facings
    if (rule.type === 'clearance') {
      baseFacings = 1;
    }

    return baseFacings;
  }
}