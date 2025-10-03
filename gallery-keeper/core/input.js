/**
 * Gallery Keeper - Input System
 *
 * Handles:
 * - Mouse input (click, drag, release)
 * - Touch input (tap, drag, release)
 * - Drag-and-drop for sprites
 * - Input event normalization
 */

class InputManager {
    constructor(canvas, engine) {
        this.canvas = canvas;
        this.engine = engine;

        // Input state
        this.mouseX = 0;
        this.mouseY = 0;
        this.isDown = false;

        // Drag state
        this.draggedSprite = null;
        this.dragOffsetX = 0;
        this.dragOffsetY = 0;

        // Callbacks
        this.onClickCallbacks = [];
        this.onDragStartCallbacks = [];
        this.onDragCallbacks = [];
        this.onDragEndCallbacks = [];

        // Setup event listeners
        this.setupMouseEvents();
        this.setupTouchEvents();
        this.setupKeyboardEvents();
    }

    /**
     * Setup mouse event listeners
     */
    setupMouseEvents() {
        this.canvas.addEventListener('mousedown', (e) => this.handlePointerDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handlePointerMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handlePointerUp(e));
        this.canvas.addEventListener('mouseleave', (e) => this.handlePointerUp(e));
    }

    /**
     * Setup touch event listeners
     */
    setupTouchEvents() {
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.handlePointerDown(touch);
        }, { passive: false });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.handlePointerMove(touch);
        }, { passive: false });

        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.handlePointerUp(e);
        }, { passive: false });
    }

    /**
     * Setup keyboard event listeners
     */
    setupKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            // Pause with Space or P
            if (e.code === 'Space' || e.code === 'KeyP') {
                e.preventDefault();
                this.engine.togglePause();
            }
        });
    }

    /**
     * Normalize pointer coordinates (works for mouse and touch)
     */
    getPointerPosition(event) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        return {
            x: (event.clientX - rect.left) * scaleX,
            y: (event.clientY - rect.top) * scaleY
        };
    }

    /**
     * Handle pointer down (mouse/touch start)
     */
    handlePointerDown(event) {
        const pos = this.getPointerPosition(event);
        this.mouseX = pos.x;
        this.mouseY = pos.y;
        this.isDown = true;

        // Check if clicking on a draggable sprite (reverse order for top-first)
        for (let i = this.engine.entities.length - 1; i >= 0; i--) {
            const sprite = this.engine.entities[i];

            if (sprite.draggable && sprite.active && sprite.containsPoint(this.mouseX, this.mouseY)) {
                this.startDrag(sprite);
                break; // Only drag topmost sprite
            }
        }

        // Trigger click callbacks
        this.onClickCallbacks.forEach(cb => cb(this.mouseX, this.mouseY));
    }

    /**
     * Handle pointer move (mouse/touch move)
     */
    handlePointerMove(event) {
        const pos = this.getPointerPosition(event);
        this.mouseX = pos.x;
        this.mouseY = pos.y;

        // Update dragged sprite position
        if (this.draggedSprite) {
            this.draggedSprite.x = this.mouseX - this.dragOffsetX;
            this.draggedSprite.y = this.mouseY - this.dragOffsetY;

            // Trigger drag callbacks
            this.onDragCallbacks.forEach(cb => cb(this.draggedSprite, this.mouseX, this.mouseY));
        }
    }

    /**
     * Handle pointer up (mouse/touch end)
     */
    handlePointerUp(event) {
        this.isDown = false;

        if (this.draggedSprite) {
            this.endDrag(this.draggedSprite);
        }
    }

    /**
     * Start dragging a sprite
     */
    startDrag(sprite) {
        this.draggedSprite = sprite;
        this.draggedSprite.dragging = true;

        // Calculate offset so sprite doesn't jump to cursor
        this.dragOffsetX = this.mouseX - sprite.x;
        this.dragOffsetY = this.mouseY - sprite.y;

        // Visual feedback
        sprite.animateTo('scale', 1.1, 0.15);

        // Trigger drag start callbacks
        this.onDragStartCallbacks.forEach(cb => cb(sprite));

        console.log(`🖱️ Started dragging: ${sprite.type} (${sprite.id})`);
    }

    /**
     * End dragging a sprite
     */
    endDrag(sprite) {
        if (!sprite) return;

        sprite.dragging = false;
        sprite.animateTo('scale', 1.0, 0.15);

        // Trigger drag end callbacks
        this.onDragEndCallbacks.forEach(cb => cb(sprite, this.mouseX, this.mouseY));

        console.log(`🖱️ Dropped: ${sprite.type} at (${Math.round(sprite.x)}, ${Math.round(sprite.y)})`);

        this.draggedSprite = null;
        this.dragOffsetX = 0;
        this.dragOffsetY = 0;
    }

    /**
     * Register click callback
     */
    onClick(callback) {
        this.onClickCallbacks.push(callback);
    }

    /**
     * Register drag start callback
     */
    onDragStart(callback) {
        this.onDragStartCallbacks.push(callback);
    }

    /**
     * Register drag callback
     */
    onDrag(callback) {
        this.onDragCallbacks.push(callback);
    }

    /**
     * Register drag end callback
     */
    onDragEnd(callback) {
        this.onDragEndCallbacks.push(callback);
    }

    /**
     * Get current mouse position
     */
    getMousePosition() {
        return { x: this.mouseX, y: this.mouseY };
    }

    /**
     * Check if pointer is down
     */
    isPointerDown() {
        return this.isDown;
    }

    /**
     * Get currently dragged sprite
     */
    getDraggedSprite() {
        return this.draggedSprite;
    }

    /**
     * Snap sprite to grid (for level 2 arrangement)
     * @param {Sprite} sprite
     * @param {number} gridSize
     */
    snapToGrid(sprite, gridSize = 50) {
        sprite.x = Math.round(sprite.x / gridSize) * gridSize;
        sprite.y = Math.round(sprite.y / gridSize) * gridSize;
    }

    /**
     * Check if sprite is within bounds
     * @param {Sprite} sprite
     * @param {Object} bounds - {x, y, width, height}
     */
    isWithinBounds(sprite, bounds) {
        return sprite.x >= bounds.x &&
               sprite.x <= bounds.x + bounds.width &&
               sprite.y >= bounds.y &&
               sprite.y <= bounds.y + bounds.height;
    }

    /**
     * Clean up event listeners
     */
    destroy() {
        // Remove all event listeners
        this.canvas.removeEventListener('mousedown', this.handlePointerDown);
        this.canvas.removeEventListener('mousemove', this.handlePointerMove);
        this.canvas.removeEventListener('mouseup', this.handlePointerUp);
        this.canvas.removeEventListener('mouseleave', this.handlePointerUp);

        this.canvas.removeEventListener('touchstart', this.handlePointerDown);
        this.canvas.removeEventListener('touchmove', this.handlePointerMove);
        this.canvas.removeEventListener('touchend', this.handlePointerUp);

        console.log('🗑️ Input manager destroyed');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InputManager;
}
