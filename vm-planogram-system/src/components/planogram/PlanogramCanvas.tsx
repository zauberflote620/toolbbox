import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Store, Planogram, StoreFixture } from '../../types';

interface PlanogramCanvasProps {
  store: Store;
  planogram: Planogram | null;
  zoom: number;
  gridVisible: boolean;
  mode: 'select' | 'place' | 'measure';
  selectedFixture: StoreFixture | null;
  onFixtureSelect: (fixture: StoreFixture | null) => void;
}

const PlanogramCanvas: React.FC<PlanogramCanvasProps> = ({
  store,
  planogram,
  zoom,
  gridVisible,
  mode,
  selectedFixture,
  onFixtureSelect
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [fixtures, setFixtures] = useState<StoreFixture[]>([]);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [draggedFixture, setDraggedFixture] = useState<StoreFixture | null>(null);

  // Scale factor for rendering (pixels per foot)
  const SCALE = 20;

  useEffect(() => {
    if (planogram?.layoutData?.fixtures) {
      setFixtures(planogram.layoutData.fixtures);
    }
  }, [planogram]);

  useEffect(() => {
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  useEffect(() => {
    drawCanvas();
  }, [fixtures, zoom, gridVisible, selectedFixture, canvasSize, store]);

  const updateCanvasSize = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setCanvasSize({
        width: rect.width,
        height: rect.height
      });
    }
  }, []);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Save context for transformations
    ctx.save();

    // Apply zoom and center the store
    const storeWidth = store.dimensions.width * SCALE * zoom;
    const storeHeight = store.dimensions.height * SCALE * zoom;
    const offsetX = (canvas.width - storeWidth) / 2;
    const offsetY = (canvas.height - storeHeight) / 2;

    ctx.translate(offsetX, offsetY);
    ctx.scale(zoom, zoom);

    // Draw grid
    if (gridVisible) {
      drawGrid(ctx);
    }

    // Draw store boundary
    drawStoreBoundary(ctx);

    // Draw constraints (pillars, utilities, etc.)
    drawConstraints(ctx);

    // Draw traffic patterns
    drawTrafficPatterns(ctx);

    // Draw fixtures
    drawFixtures(ctx);

    // Draw VM zones overlay
    drawVMZones(ctx);

    ctx.restore();
  }, [canvasSize, store, fixtures, zoom, gridVisible, selectedFixture]);

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    const gridSize = SCALE; // 1 foot grid
    const width = store.dimensions.width * SCALE;
    const height = store.dimensions.height * SCALE;

    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 0.5;

    // Vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawStoreBoundary = (ctx: CanvasRenderingContext2D) => {
    const width = store.dimensions.width * SCALE;
    const height = store.dimensions.height * SCALE;

    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, width, height);

    // Add store info
    ctx.fillStyle = '#2563eb';
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText(`${store.name} (${store.dimensions.width}' × ${store.dimensions.height}')`, 10, -10);
  };

  const drawConstraints = (ctx: CanvasRenderingContext2D) => {
    if (!store.constraints) return;

    const { pillars = [], utilities = [] } = store.constraints;

    // Draw pillars
    ctx.fillStyle = '#6b7280';
    pillars.forEach((pillar: any) => {
      ctx.fillRect(
        pillar.x * SCALE,
        pillar.y * SCALE,
        pillar.width * SCALE,
        pillar.height * SCALE
      );
    });

    // Draw utilities
    ctx.fillStyle = '#dc2626';
    utilities.forEach((utility: any) => {
      ctx.fillRect(
        utility.x * SCALE,
        utility.y * SCALE,
        utility.width * SCALE,
        utility.height * SCALE
      );
    });
  };

  const drawTrafficPatterns = (ctx: CanvasRenderingContext2D) => {
    if (!store.trafficPatterns || store.trafficPatterns.length === 0) return;

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    store.trafficPatterns.forEach((pattern: any) => {
      if (pattern.path && pattern.path.length > 1) {
        ctx.beginPath();
        ctx.moveTo(pattern.path[0].x * SCALE, pattern.path[0].y * SCALE);

        for (let i = 1; i < pattern.path.length; i++) {
          ctx.lineTo(pattern.path[i].x * SCALE, pattern.path[i].y * SCALE);
        }

        ctx.stroke();
      }
    });

    ctx.setLineDash([]);
  };

  const drawFixtures = (ctx: CanvasRenderingContext2D) => {
    fixtures.forEach(storeFixture => {
      const { fixture } = storeFixture;
      if (!fixture) return;

      const x = storeFixture.x * SCALE;
      const y = storeFixture.y * SCALE;
      const width = fixture.dimensions.width * SCALE;
      const height = fixture.dimensions.depth * SCALE;

      ctx.save();
      ctx.translate(x + width/2, y + height/2);
      ctx.rotate((storeFixture.rotation * Math.PI) / 180);
      ctx.translate(-width/2, -height/2);

      // Fixture color based on VM zone
      const zoneColors = {
        EYE: '#10b981',
        REACH: '#3b82f6',
        STRETCH: '#f59e0b',
        STOOP: '#6b7280'
      };

      ctx.fillStyle = zoneColors[storeFixture.vmZone] || '#6b7280';
      ctx.strokeStyle = selectedFixture?.id === storeFixture.id ? '#dc2626' : '#374151';
      ctx.lineWidth = selectedFixture?.id === storeFixture.id ? 3 : 1;

      ctx.fillRect(0, 0, width, height);
      ctx.strokeRect(0, 0, width, height);

      // Fixture label
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        fixture.name.substring(0, 12),
        width / 2,
        height / 2 + 3
      );

      ctx.restore();
    });
  };

  const drawVMZones = (ctx: CanvasRenderingContext2D) => {
    // This would show height-based VM zones as overlay
    // Implementation depends on fixture heights and store layout
    const storeWidth = store.dimensions.width * SCALE;
    const storeHeight = store.dimensions.height * SCALE;

    // Semi-transparent overlay showing VM zones
    ctx.globalAlpha = 0.1;

    // Eye level zone (most valuable real estate)
    ctx.fillStyle = '#10b981';
    ctx.fillRect(0, storeHeight * 0.2, storeWidth, storeHeight * 0.6);

    ctx.globalAlpha = 1.0;
  };

  // Helper function to convert screen coordinates to store coordinates
  const screenToStoreCoords = (screenX: number, screenY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const x = screenX - rect.left;
    const y = screenY - rect.top;

    const storeWidth = store.dimensions.width * SCALE * zoom;
    const storeHeight = store.dimensions.height * SCALE * zoom;
    const offsetX = (canvas.width - storeWidth) / 2;
    const offsetY = (canvas.height - storeHeight) / 2;

    return {
      x: (x - offsetX) / (SCALE * zoom),
      y: (y - offsetY) / (SCALE * zoom)
    };
  };

  // Find fixture at given coordinates
  const findFixtureAt = (storeX: number, storeY: number): StoreFixture | null => {
    return fixtures.find(storeFixture => {
      const fixture = storeFixture.fixture;
      if (!fixture) return false;

      return (
        storeX >= storeFixture.x &&
        storeX <= storeFixture.x + fixture.dimensions.width &&
        storeY >= storeFixture.y &&
        storeY <= storeFixture.y + fixture.dimensions.depth
      );
    }) || null;
  };

  // Check collision with other fixtures
  const checkCollision = (fixture: StoreFixture, newX: number, newY: number): boolean => {
    if (!fixture.fixture) return false;

    const width = fixture.fixture.dimensions.width;
    const depth = fixture.fixture.dimensions.depth;

    // Check store boundaries
    if (newX < 0 || newY < 0 ||
        newX + width > store.dimensions.width ||
        newY + depth > store.dimensions.height) {
      return true;
    }

    // Check collision with other fixtures
    return fixtures.some(otherFixture => {
      if (otherFixture.id === fixture.id || !otherFixture.fixture) return false;

      const otherWidth = otherFixture.fixture.dimensions.width;
      const otherDepth = otherFixture.fixture.dimensions.depth;

      return !(
        newX >= otherFixture.x + otherWidth ||
        newX + width <= otherFixture.x ||
        newY >= otherFixture.y + otherDepth ||
        newY + depth <= otherFixture.y
      );
    });
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode !== 'select') return;

    const coords = screenToStoreCoords(event.clientX, event.clientY);
    const clickedFixture = findFixtureAt(coords.x, coords.y);

    if (clickedFixture) {
      setIsDragging(true);
      setDraggedFixture(clickedFixture);
      setDragOffset({
        x: coords.x - clickedFixture.x,
        y: coords.y - clickedFixture.y
      });
      onFixtureSelect(clickedFixture);
    } else {
      onFixtureSelect(null);
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !draggedFixture) return;

    const coords = screenToStoreCoords(event.clientX, event.clientY);
    const newX = coords.x - dragOffset.x;
    const newY = coords.y - dragOffset.y;

    // Check for collisions
    if (!checkCollision(draggedFixture, newX, newY)) {
      // Update fixture position
      setFixtures(prev => prev.map(fixture =>
        fixture.id === draggedFixture.id
          ? { ...fixture, x: newX, y: newY }
          : fixture
      ));
    }
  };

  const handleMouseUp = () => {
    if (isDragging && draggedFixture) {
      setIsDragging(false);
      setDraggedFixture(null);
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    // Click is handled in mouseDown for drag functionality
  };

  return (
    <div ref={containerRef} className=\"w-full h-full overflow-hidden relative\">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`${isDragging ? 'cursor-grabbing' : mode === 'select' ? 'cursor-grab' : 'cursor-crosshair'}`}
        style={{ width: '100%', height: '100%' }}
      />

      {/* Canvas overlay info */}\n      <div className=\"absolute top-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 text-sm\">\n        <div className=\"font-medium\">Mode: {mode}</div>\n        <div>Zoom: {Math.round(zoom * 100)}%</div>\n        <div>Fixtures: {fixtures.length}</div>\n      </div>\n\n      {/* VM Zone Legend */}\n      <div className=\"absolute bottom-4 right-4 bg-white bg-opacity-90 rounded-lg p-3\">\n        <h4 className=\"text-sm font-medium mb-2\">VM Zones</h4>\n        <div className=\"space-y-1 text-xs\">\n          <div className=\"flex items-center\">\n            <div className=\"w-3 h-3 bg-green-500 rounded mr-2\"></div>\n            <span>Eye Level (60-72\")</span>\n          </div>\n          <div className=\"flex items-center\">\n            <div className=\"w-3 h-3 bg-blue-500 rounded mr-2\"></div>\n            <span>Reach Zone (48-60\")</span>\n          </div>\n          <div className=\"flex items-center\">\n            <div className=\"w-3 h-3 bg-yellow-500 rounded mr-2\"></div>\n            <span>Stretch Zone (72+\")</span>\n          </div>\n          <div className=\"flex items-center\">\n            <div className=\"w-3 h-3 bg-gray-500 rounded mr-2\"></div>\n            <span>Stoop Zone (0-48\")</span>\n          </div>\n        </div>\n      </div>\n    </div>\n  );\n};\n\nexport default PlanogramCanvas;