/**
 * World Loader Service - v2.0.0
 * High-performance loading and management for large planogram datasets
 */

import { Planogram, Fixture, Product, ShopResetConstraints, ShopResetConfig } from '../types';
import { PerformanceOptimizer } from './performance-optimizer';

export interface LoadingState {
  isLoading: boolean;
  progress: number;
  stage: string;
  error?: string;
}

export interface WorldData {
  planogram: Planogram;
  constraints: ShopResetConstraints;
  config: ShopResetConfig;
  metadata: {
    loadedAt: Date;
    fixtureCount: number;
    productCount: number;
    totalSKUs: number;
    estimatedMemoryUsage: number;
  };
}

/**
 * Service for efficiently loading and managing large planogram datasets
 */
export class WorldLoaderService {
  private optimizer: PerformanceOptimizer;
  private loadingState: LoadingState;
  private loadedData: WorldData | null = null;
  private cache: Map<string, WorldData> = new Map();
  private maxCacheSize: number = 5;

  constructor() {
    this.optimizer = new PerformanceOptimizer();
    this.loadingState = {
      isLoading: false,
      progress: 0,
      stage: 'idle'
    };
  }

  /**
   * Load planogram with progressive loading and optimization
   */
  async loadPlanogram(
    planogramData: any,
    constraints?: ShopResetConstraints,
    config?: ShopResetConfig,
    onProgress?: (state: LoadingState) => void
  ): Promise<WorldData> {
    this.setLoadingState({
      isLoading: true,
      progress: 0,
      stage: 'initializing'
    });

    try {
      // Stage 1: Parse and validate data
      this.setLoadingState({
        isLoading: true,
        progress: 10,
        stage: 'parsing data'
      });

      const planogram = await this.parsePlanogramData(planogramData);

      // Stage 2: Load constraints and config
      this.setLoadingState({
        isLoading: true,
        progress: 30,
        stage: 'loading configuration'
      });

      const finalConstraints = constraints || await this.loadDefaultConstraints();
      const finalConfig = config || await this.loadDefaultConfig();

      // Stage 3: Optimize data structures
      this.setLoadingState({
        isLoading: true,
        progress: 50,
        stage: 'optimizing data structures'
      });

      await this.optimizePlanogramData(planogram);

      // Stage 4: Build spatial index
      this.setLoadingState({
        isLoading: true,
        progress: 70,
        stage: 'building spatial index'
      });

      await this.optimizer.loadPlanogramProgressively(
        planogram,
        (progress) => {
          this.setLoadingState({
            isLoading: true,
            progress: 70 + (progress * 20),
            stage: 'building spatial index'
          });
        }
      );

      // Stage 5: Calculate metadata
      this.setLoadingState({
        isLoading: true,
        progress: 90,
        stage: 'calculating metadata'
      });

      const metadata = this.calculateMetadata(planogram);

      // Stage 6: Complete
      const worldData: WorldData = {
        planogram,
        constraints: finalConstraints,
        config: finalConfig,
        metadata
      };

      this.loadedData = worldData;
      this.cacheWorldData(this.generateCacheKey(planogramData), worldData);

      this.setLoadingState({
        isLoading: false,
        progress: 100,
        stage: 'complete'
      });

      return worldData;

    } catch (error) {
      this.setLoadingState({
        isLoading: false,
        progress: 0,
        stage: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  /**
   * Load from cache if available
   */
  loadFromCache(cacheKey: string): WorldData | null {
    return this.cache.get(cacheKey) || null;
  }

  /**
   * Preload multiple planograms for quick access
   */
  async preloadPlanograms(
    planogramList: Array<{ id: string; data: any }>,
    onProgress?: (overall: number, current: string) => void
  ): Promise<void> {
    for (let i = 0; i < planogramList.length; i++) {
      const { id, data } = planogramList[i];

      if (onProgress) {
        onProgress((i / planogramList.length) * 100, id);
      }

      try {
        await this.loadPlanogram(data);
      } catch (error) {
        console.warn(`Failed to preload planogram ${id}:`, error);
      }
    }

    if (onProgress) {
      onProgress(100, 'complete');
    }
  }

  /**
   * Stream large planogram data in chunks
   */
  async streamPlanogramData(
    dataSource: AsyncIterable<any> | any[],
    onChunk?: (chunk: any, progress: number) => void
  ): Promise<Planogram> {
    const planogram: Planogram = {
      id: '',
      name: '',
      storeId: '',
      sections: [],
      fixtures: [],
      metadata: {
        createdAt: new Date(),
        modifiedAt: new Date(),
        version: '2.0.0',
        shopResetMethod: 'anchor-and-spokes'
      }
    };

    let processedCount = 0;
    const chunks: any[] = Array.isArray(dataSource) ? dataSource : [];

    // Convert AsyncIterable to array if needed
    if (!Array.isArray(dataSource)) {
      for await (const chunk of dataSource) {
        chunks.push(chunk);
      }
    }

    const totalChunks = chunks.length;

    for (const chunk of chunks) {
      await this.processDataChunk(chunk, planogram);
      processedCount++;

      if (onChunk) {
        onChunk(chunk, (processedCount / totalChunks) * 100);
      }

      // Yield control periodically
      if (processedCount % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }

    return planogram;
  }

  /**
   * Get current loading state
   */
  getLoadingState(): LoadingState {
    return { ...this.loadingState };
  }

  /**
   * Get loaded world data
   */
  getLoadedData(): WorldData | null {
    return this.loadedData;
  }

  /**
   * Unload current data and free memory
   */
  unloadData(): void {
    this.loadedData = null;
    this.optimizer.optimizeMemory();
  }

  /**
   * Get memory usage statistics
   */
  getMemoryStats(): {
    cacheSize: number;
    optimizerMetrics: any;
    estimatedUsage: number;
  } {
    let estimatedUsage = 0;
    this.cache.forEach(data => {
      estimatedUsage += data.metadata.estimatedMemoryUsage;
    });

    return {
      cacheSize: this.cache.size,
      optimizerMetrics: this.optimizer.getMetrics(),
      estimatedUsage
    };
  }

  private async parsePlanogramData(data: any): Promise<Planogram> {
    // Handle different data formats
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (error) {
        throw new Error('Invalid JSON data');
      }
    }

    // Validate required fields
    if (!data.id || !data.name) {
      throw new Error('Planogram data missing required fields (id, name)');
    }

    // Convert to our internal format
    const planogram: Planogram = {
      id: data.id,
      name: data.name,
      storeId: data.storeId || '',
      sections: data.sections || [],
      fixtures: data.fixtures || [],
      metadata: {
        createdAt: data.metadata?.createdAt ? new Date(data.metadata.createdAt) : new Date(),
        modifiedAt: new Date(),
        version: '2.0.0',
        shopResetMethod: data.metadata?.shopResetMethod || 'anchor-and-spokes'
      }
    };

    return planogram;
  }

  private async loadDefaultConstraints(): Promise<ShopResetConstraints> {
    // Return sensible defaults for Shop Reset constraints
    return {
      physical: {
        maxWeight: 50,
        minClearance: 36,
        maxHeight: 96,
        aisleWidth: 48
      },
      safety: {
        egressPaths: true,
        emergencyAccess: true,
        weightDistribution: true,
        fragileItemHeight: 60
      },
      regulatory: {
        adaCompliance: true,
        fireCode: true,
        localOrdnances: []
      }
    };
  }

  private async loadDefaultConfig(): Promise<ShopResetConfig> {
    // Return sensible defaults for Shop Reset configuration
    return {
      goals: {
        primary: 'increase_sales',
        metrics: ['revenue_per_sqft', 'inventory_turns']
      },
      parameters: {
        anchorCount: 3,
        spokeRadius: 8,
        priorityWeights: {
          sales: 0.4,
          margin: 0.3,
          inventory: 0.3
        }
      }
    };
  }

  private async optimizePlanogramData(planogram: Planogram): Promise<void> {
    // Sort fixtures by position for better spatial locality
    planogram.fixtures.sort((a, b) => {
      if (a.position.y !== b.position.y) {
        return a.position.y - b.position.y;
      }
      return a.position.x - b.position.x;
    });

    // Optimize product data for each fixture
    for (const fixture of planogram.fixtures) {
      if (fixture.products) {
        // Sort products by facing count and importance
        fixture.products.sort((a, b) => {
          const aScore = (a.facings || 1) * (a.salesVelocity || 1);
          const bScore = (b.facings || 1) * (b.salesVelocity || 1);
          return bScore - aScore;
        });
      }
    }
  }

  private calculateMetadata(planogram: Planogram): WorldData['metadata'] {
    let productCount = 0;
    let totalSKUs = 0;

    planogram.fixtures.forEach(fixture => {
      if (fixture.products) {
        productCount += fixture.products.length;
        totalSKUs += fixture.products.reduce((sum, product) => sum + (product.facings || 1), 0);
      }
    });

    // Estimate memory usage (rough calculation)
    const fixtureMemory = planogram.fixtures.length * 1000; // ~1KB per fixture
    const productMemory = productCount * 500; // ~500 bytes per product
    const estimatedMemoryUsage = fixtureMemory + productMemory;

    return {
      loadedAt: new Date(),
      fixtureCount: planogram.fixtures.length,
      productCount,
      totalSKUs,
      estimatedMemoryUsage
    };
  }

  private async processDataChunk(chunk: any, planogram: Planogram): Promise<void> {
    if (chunk.type === 'fixture') {
      planogram.fixtures.push(chunk.data);
    } else if (chunk.type === 'section') {
      planogram.sections.push(chunk.data);
    } else if (chunk.type === 'metadata') {
      Object.assign(planogram.metadata, chunk.data);
    }
  }

  private generateCacheKey(data: any): string {
    // Generate a cache key based on data characteristics
    const keyData = {
      id: data.id,
      checksum: this.simpleChecksum(JSON.stringify(data))
    };
    return `${keyData.id}_${keyData.checksum}`;
  }

  private simpleChecksum(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  private cacheWorldData(key: string, data: WorldData): void {
    // Implement LRU cache behavior
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, data);
  }

  private setLoadingState(state: Partial<LoadingState>): void {
    this.loadingState = { ...this.loadingState, ...state };
  }

  /**
   * Dispose of resources
   */
  dispose(): void {
    this.cache.clear();
    this.optimizer.dispose();
    this.loadedData = null;
  }
}