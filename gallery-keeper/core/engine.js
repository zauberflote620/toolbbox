/**
 * Gallery Keeper - Core Game Engine
 *
 * Handles:
 * - 60fps game loop using requestAnimationFrame
 * - Canvas setup and rendering
 * - Game state management
 * - Update/render cycle coordination
 */

class GameEngine {
    constructor(canvasId, width = 800, height = 600) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = width;
        this.canvas.height = height;

        // Game loop timing
        this.lastTime = 0;
        this.deltaTime = 0;
        this.targetFPS = 60;
        this.targetFrameTime = 1000 / this.targetFPS; // 16.67ms
        this.accumulator = 0;

        // FPS tracking
        this.fps = 60;
        this.frameCount = 0;
        this.fpsTime = 0;

        // Game state
        this.running = false;
        this.paused = false;
        this.entities = [];

        // Callbacks
        this.updateCallback = null;
        this.renderCallback = null;

        // Bind methods
        this.gameLoop = this.gameLoop.bind(this);
    }

    /**
     * Main game loop using requestAnimationFrame
     * Implements fixed timestep for consistent physics/updates
     * @param {number} currentTime - High-resolution timestamp from RAF
     */
    gameLoop(currentTime) {
        if (!this.running) return;

        // Calculate delta time (time since last frame)
        this.deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        // Update FPS counter
        this.frameCount++;
        this.fpsTime += this.deltaTime;
        if (this.fpsTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.fpsTime = 0;
        }

        // Fixed timestep update (prevents spiral of death)
        if (!this.paused) {
            this.accumulator += this.deltaTime;

            // Update game logic in fixed timesteps
            while (this.accumulator >= this.targetFrameTime) {
                this.update(this.targetFrameTime / 1000); // Convert to seconds
                this.accumulator -= this.targetFrameTime;
            }
        }

        // Render current state (interpolation could be added here)
        this.render(this.ctx);

        // Continue loop
        requestAnimationFrame(this.gameLoop);
    }

    /**
     * Update game logic (called at fixed timestep)
     * @param {number} dt - Delta time in seconds (0.0167 for 60fps)
     */
    update(dt) {
        // Update all entities
        for (let entity of this.entities) {
            if (entity.update) {
                entity.update(dt);
            }
        }

        // Call custom update callback if provided
        if (this.updateCallback) {
            this.updateCallback(dt);
        }
    }

    /**
     * Render current game state
     * @param {CanvasRenderingContext2D} ctx - Canvas 2D context
     */
    render(ctx) {
        // Clear canvas
        ctx.fillStyle = '#2C3E50';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Render all entities (sorted by z-index if needed)
        for (let entity of this.entities) {
            if (entity.render) {
                entity.render(ctx);
            }
        }

        // Call custom render callback if provided
        if (this.renderCallback) {
            this.renderCallback(ctx);
        }

        // Render FPS counter (top-left corner)
        this.renderFPS(ctx);
    }

    /**
     * Render FPS counter for debugging
     * @param {CanvasRenderingContext2D} ctx
     */
    renderFPS(ctx) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(5, 5, 90, 25);
        ctx.fillStyle = this.fps >= 55 ? '#4CAF50' : '#F44336';
        ctx.font = '14px monospace';
        ctx.fillText(`FPS: ${this.fps}`, 10, 22);
        ctx.restore();
    }

    /**
     * Start the game loop
     */
    start() {
        if (this.running) return;
        this.running = true;
        this.lastTime = performance.now();
        requestAnimationFrame(this.gameLoop);
        console.log('🎮 Game engine started');
    }

    /**
     * Stop the game loop
     */
    stop() {
        this.running = false;
        console.log('🛑 Game engine stopped');
    }

    /**
     * Pause/unpause the game
     */
    togglePause() {
        this.paused = !this.paused;
        console.log(this.paused ? '⏸️ Paused' : '▶️ Resumed');
    }

    /**
     * Add entity to the game world
     * @param {Object} entity - Entity with update/render methods
     */
    addEntity(entity) {
        this.entities.push(entity);
    }

    /**
     * Remove entity from the game world
     * @param {Object} entity - Entity to remove
     */
    removeEntity(entity) {
        const index = this.entities.indexOf(entity);
        if (index > -1) {
            this.entities.splice(index, 1);
        }
    }

    /**
     * Clear all entities
     */
    clearEntities() {
        this.entities = [];
    }

    /**
     * Set custom update callback
     * @param {Function} callback - Function(dt) to call each update
     */
    onUpdate(callback) {
        this.updateCallback = callback;
    }

    /**
     * Set custom render callback
     * @param {Function} callback - Function(ctx) to call each render
     */
    onRender(callback) {
        this.renderCallback = callback;
    }

    /**
     * Get canvas dimensions
     */
    getSize() {
        return {
            width: this.canvas.width,
            height: this.canvas.height
        };
    }

    /**
     * Get current FPS
     */
    getFPS() {
        return this.fps;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameEngine;
}
