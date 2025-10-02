/**
 * Performance Optimizer - v2.0.0
 * Optimizations for large planograms (100+ SKUs) and complex layouts
 */

import { Fixture, Product, Planogram, Point } from '../types';

export interface ViewportBounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface PerformanceMetrics {
  renderTime: number;
  lastFrameTime: number;
  avgFrameTime: number;
  skippedFrames: number;
  visibleFixtures: number;
  totalFixtures: number;
  memoryUsage: number;
}

/**
 * Spatial index for efficient fixture lookups
 */
class SpatialIndex {
  private buckets: Map<string, Fixture[]> = new Map();
  private bucketSize: number = 100; // pixels

  constructor(bucketSize: number = 100) {
    this.bucketSize = bucketSize;
  }

  private getBucketKey(x: number, y: number): string {
    const bx = Math.floor(x / this.bucketSize);
    const by = Math.floor(y / this.bucketSize);
    return `${bx},${by}`;
  }

  addFixture(fixture: Fixture): void {
    const keys = this.getFixtureBuckets(fixture);
    keys.forEach(key => {
      if (!this.buckets.has(key)) {
        this.buckets.set(key, []);
      }
      this.buckets.get(key)!.push(fixture);
    });
  }

  removeFixture(fixture: Fixture): void {
    const keys = this.getFixtureBuckets(fixture);
    keys.forEach(key => {
      const bucket = this.buckets.get(key);
      if (bucket) {
        const index = bucket.indexOf(fixture);
        if (index !== -1) {
          bucket.splice(index, 1);
        }
        if (bucket.length === 0) {
          this.buckets.delete(key);
        }
      }
    });
  }

  getFixturesInBounds(bounds: ViewportBounds): Fixture[] {
    const fixtures = new Set<Fixture>();

    const startBx = Math.floor(bounds.left / this.bucketSize);
    const endBx = Math.floor(bounds.right / this.bucketSize);
    const startBy = Math.floor(bounds.top / this.bucketSize);
    const endBy = Math.floor(bounds.bottom / this.bucketSize);

    for (let bx = startBx; bx <= endBx; bx++) {
      for (let by = startBy; by <= endBy; by++) {
        const key = `${bx},${by}`;
        const bucket = this.buckets.get(key);
        if (bucket) {
          bucket.forEach(fixture => {
            if (this.fixtureIntersectsBounds(fixture, bounds)) {
              fixtures.add(fixture);
            }
          });
        }
      }
    }

    return Array.from(fixtures);
  }

  private getFixtureBuckets(fixture: Fixture): string[] {
    const keys: string[] = [];
    const left = fixture.position.x;
    const top = fixture.position.y;
    const right = left + fixture.width;
    const bottom = top + fixture.height;

    const startBx = Math.floor(left / this.bucketSize);
    const endBx = Math.floor(right / this.bucketSize);
    const startBy = Math.floor(top / this.bucketSize);
    const endBy = Math.floor(bottom / this.bucketSize);

    for (let bx = startBx; bx <= endBx; bx++) {
      for (let by = startBy; by <= endBy; by++) {
        keys.push(`${bx},${by}`);
      }
    }

    return keys;
  }

  private fixtureIntersectsBounds(fixture: Fixture, bounds: ViewportBounds): boolean {
    const left = fixture.position.x;
    const top = fixture.position.y;
    const right = left + fixture.width;
    const bottom = top + fixture.height;

    return !(right < bounds.left || left > bounds.right ||
             bottom < bounds.top || top > bounds.bottom);
  }

  clear(): void {
    this.buckets.clear();
  }
}

/**
 * Performance optimizer for large planogram rendering
 */
export class PerformanceOptimizer {
  private spatialIndex: SpatialIndex;
  private metrics: PerformanceMetrics;
  private frameBuffer: OffscreenCanvas | null = null;
  private frameCtx: OffscreenCanvasRenderingContext2D | null = null;
  private lastUpdate: number = 0;
  private renderCache: Map<string, ImageData> = new Map();
  private maxCacheSize: number = 50;

  constructor() {
    this.spatialIndex = new SpatialIndex(100);
    this.metrics = {
      renderTime: 0,
      lastFrameTime: 0,
      avgFrameTime: 0,
      skippedFrames: 0,
      visibleFixtures: 0,
      totalFixtures: 0,
      memoryUsage: 0
    };

    this.initializeFrameBuffer();
  }

  private initializeFrameBuffer(): void {
    if (typeof OffscreenCanvas !== 'undefined') {
      this.frameBuffer = new OffscreenCanvas(800, 600);
      this.frameCtx = this.frameBuffer.getContext('2d');
    }
  }

  /**
   * Update spatial index with new planogram data
   */
  updateSpatialIndex(planogram: Planogram): void {
    const startTime = performance.now();

    this.spatialIndex.clear();
    planogram.fixtures.forEach(fixture => {
      this.spatialIndex.addFixture(fixture);
    });

    this.metrics.totalFixtures = planogram.fixtures.length;
    this.updateMetrics(performance.now() - startTime);
  }

  /**
   * Get fixtures visible in viewport for optimized rendering
   */
  getVisibleFixtures(
    planogram: Planogram,
    viewportBounds: ViewportBounds,
    scale: number
  ): Fixture[] {
    // Expand bounds slightly to include partially visible fixtures
    const margin = 50 / scale;
    const expandedBounds: ViewportBounds = {
      left: viewportBounds.left - margin,
      top: viewportBounds.top - margin,
      right: viewportBounds.right + margin,
      bottom: viewportBounds.bottom + margin
    };

    const visibleFixtures = this.spatialIndex.getFixturesInBounds(expandedBounds);
    this.metrics.visibleFixtures = visibleFixtures.length;

    return visibleFixtures;
  }

  /**
   * Level-of-detail optimization based on zoom level
   */
  getLODLevel(scale: number): 'high' | 'medium' | 'low' {
    if (scale >= 1.0) return 'high';
    if (scale >= 0.5) return 'medium';
    return 'low';
  }

  /**
   * Cache fixture rendering for performance
   */
  getCachedFixture(
    fixtureId: string,
    renderer: () => ImageData
  ): ImageData {
    let cached = this.renderCache.get(fixtureId);

    if (!cached) {
      cached = renderer();

      // Manage cache size
      if (this.renderCache.size >= this.maxCacheSize) {
        const firstKey = this.renderCache.keys().next().value;
        this.renderCache.delete(firstKey);
      }

      this.renderCache.set(fixtureId, cached);
    }

    return cached;
  }

  /**
   * Debounced rendering for smooth performance
   */
  requestOptimizedRender(
    renderFn: () => void,
    immediate: boolean = false
  ): void {
    const now = performance.now();

    if (immediate || now - this.lastUpdate > 16) { // ~60fps
      this.lastUpdate = now;
      renderFn();
    } else {
      requestAnimationFrame(() => {
        this.requestOptimizedRender(renderFn, true);
      });
    }
  }

  /**
   * Batch operations for efficiency
   */
  batchOperations<T>(
    items: T[],
    operation: (item: T) => void,
    batchSize: number = 10
  ): Promise<void> {
    return new Promise((resolve) => {
      let index = 0;

      const processBatch = () => {
        const end = Math.min(index + batchSize, items.length);

        for (let i = index; i < end; i++) {
          operation(items[i]);
        }

        index = end;

        if (index < items.length) {
          requestAnimationFrame(processBatch);
        } else {
          resolve();
        }
      };

      processBatch();
    });
  }

  /**
   * Memory usage optimization
   */
  optimizeMemory(): void {
    // Clear render cache if getting too large
    if (this.renderCache.size > this.maxCacheSize) {
      this.renderCache.clear();
    }

    // Force garbage collection hint
    if (typeof window !== 'undefined' && (window as any).gc) {
      (window as any).gc();
    }

    this.updateMemoryUsage();
  }

  /**
   * Progressive loading for large planograms
   */
  async loadPlanogramProgressively(
    planogram: Planogram,
    onProgress: (progress: number) => void
  ): Promise<void> {
    const totalFixtures = planogram.fixtures.length;
    let loadedCount = 0;

    await this.batchOperations(
      planogram.fixtures,
      (fixture) => {
        this.spatialIndex.addFixture(fixture);
        loadedCount++;
        onProgress(loadedCount / totalFixtures);
      },
      20 // Load 20 fixtures per frame
    );
  }

  /**
   * Adaptive quality based on performance
   */
  getAdaptiveQuality(): {
    useAntialiasing: boolean;
    useDropShadows: boolean;
    useGradients: boolean;
    detailLevel: number;
  } {
    const avgFrameTime = this.metrics.avgFrameTime;

    if (avgFrameTime < 8) { // < 8ms = very good performance
      return {
        useAntialiasing: true,
        useDropShadows: true,
        useGradients: true,
        detailLevel: 1.0
      };
    } else if (avgFrameTime < 16) { // < 16ms = good performance
      return {
        useAntialiasing: true,
        useDropShadows: false,
        useGradients: true,
        detailLevel: 0.8
      };
    } else { // > 16ms = poor performance, reduce quality
      return {
        useAntialiasing: false,
        useDropShadows: false,
        useGradients: false,
        detailLevel: 0.6
      };
    }
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Reset performance tracking
   */
  resetMetrics(): void {
    this.metrics = {
      renderTime: 0,
      lastFrameTime: 0,
      avgFrameTime: 0,
      skippedFrames: 0,
      visibleFixtures: 0,
      totalFixtures: 0,
      memoryUsage: 0
    };
  }

  private updateMetrics(frameTime: number): void {
    this.metrics.lastFrameTime = frameTime;
    this.metrics.renderTime += frameTime;

    // Exponential moving average for frame time
    if (this.metrics.avgFrameTime === 0) {
      this.metrics.avgFrameTime = frameTime;
    } else {
      this.metrics.avgFrameTime = this.metrics.avgFrameTime * 0.9 + frameTime * 0.1;
    }
  }

  private updateMemoryUsage(): void {
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      const memory = (performance as any).memory;
      this.metrics.memoryUsage = memory.usedJSHeapSize;
    }
  }

  /**
   * Cleanup resources
   */
  dispose(): void {
    this.spatialIndex.clear();
    this.renderCache.clear();
    this.frameBuffer = null;
    this.frameCtx = null;
  }
}