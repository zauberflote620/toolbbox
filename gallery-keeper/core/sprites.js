/**
 * Gallery Keeper - Sprite System
 *
 * Handles:
 * - Sprite base class with position, velocity, rendering
 * - Geometric shapes + emoji icon rendering
 * - Collision detection (AABB)
 * - Simple animation support
 */

class Sprite {
    constructor(x, y, options = {}) {
        // Position and movement
        this.x = x;
        this.y = y;
        this.vx = options.vx || 0;
        this.vy = options.vy || 0;

        // Size
        this.width = options.width || 40;
        this.height = options.height || 40;

        // Visual properties
        this.color = options.color || '#4ECDC4';
        this.shape = options.shape || 'circle'; // 'circle', 'rect', 'roundRect'
        this.emoji = options.emoji || null; // Optional emoji overlay
        this.emojiSize = options.emojiSize || 24;

        // State
        this.active = true;
        this.visible = true;
        this.draggable = options.draggable || false;
        this.dragging = false;

        // Animation
        this.rotation = 0;
        this.scale = 1;
        this.alpha = 1;

        // Metadata
        this.id = options.id || `sprite_${Date.now()}_${Math.random()}`;
        this.type = options.type || 'generic';
        this.data = options.data || {};
    }

    /**
     * Update sprite logic
     * @param {number} dt - Delta time in seconds
     */
    update(dt) {
        if (!this.active || this.dragging) return;

        // Update position based on velocity
        this.x += this.vx * dt;
        this.y += this.vy * dt;
    }

    /**
     * Render sprite to canvas
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        if (!this.visible) return;

        ctx.save();

        // Apply transformations
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale, this.scale);
        ctx.globalAlpha = this.alpha;

        // Draw shape based on type
        switch (this.shape) {
            case 'circle':
                this.drawCircle(ctx);
                break;
            case 'rect':
                this.drawRect(ctx);
                break;
            case 'roundRect':
                this.drawRoundRect(ctx);
                break;
        }

        // Draw emoji overlay if present
        if (this.emoji) {
            this.drawEmoji(ctx);
        }

        ctx.restore();
    }

    /**
     * Draw circular sprite
     */
    drawCircle(ctx) {
        const radius = this.width / 2;

        // Gradient fill for depth
        const gradient = ctx.createRadialGradient(0, -radius * 0.3, 0, 0, 0, radius);
        gradient.addColorStop(0, this.lightenColor(this.color, 20));
        gradient.addColorStop(1, this.color);

        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Subtle outline
        ctx.strokeStyle = this.darkenColor(this.color, 10);
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    /**
     * Draw rectangular sprite
     */
    drawRect(ctx) {
        const halfWidth = this.width / 2;
        const halfHeight = this.height / 2;

        ctx.fillStyle = this.color;
        ctx.fillRect(-halfWidth, -halfHeight, this.width, this.height);

        // Outline
        ctx.strokeStyle = this.darkenColor(this.color, 10);
        ctx.lineWidth = 2;
        ctx.strokeRect(-halfWidth, -halfHeight, this.width, this.height);
    }

    /**
     * Draw rounded rectangle sprite
     */
    drawRoundRect(ctx) {
        const halfWidth = this.width / 2;
        const halfHeight = this.height / 2;
        const radius = 8;

        ctx.beginPath();
        ctx.moveTo(-halfWidth + radius, -halfHeight);
        ctx.lineTo(halfWidth - radius, -halfHeight);
        ctx.arcTo(halfWidth, -halfHeight, halfWidth, -halfHeight + radius, radius);
        ctx.lineTo(halfWidth, halfHeight - radius);
        ctx.arcTo(halfWidth, halfHeight, halfWidth - radius, halfHeight, radius);
        ctx.lineTo(-halfWidth + radius, halfHeight);
        ctx.arcTo(-halfWidth, halfHeight, -halfWidth, halfHeight - radius, radius);
        ctx.lineTo(-halfWidth, -halfHeight + radius);
        ctx.arcTo(-halfWidth, -halfHeight, -halfWidth + radius, -halfHeight, radius);
        ctx.closePath();

        ctx.fillStyle = this.color;
        ctx.fill();

        ctx.strokeStyle = this.darkenColor(this.color, 10);
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    /**
     * Draw emoji overlay
     */
    drawEmoji(ctx) {
        ctx.font = `${this.emojiSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.emoji, 0, 0);
    }

    /**
     * Check if point is inside sprite (for click detection)
     * @param {number} px - Point X
     * @param {number} py - Point Y
     */
    containsPoint(px, py) {
        if (this.shape === 'circle') {
            const dx = px - this.x;
            const dy = py - this.y;
            const radius = this.width / 2;
            return (dx * dx + dy * dy) <= (radius * radius);
        } else {
            // Rectangle bounds
            const halfWidth = this.width / 2;
            const halfHeight = this.height / 2;
            return px >= this.x - halfWidth &&
                   px <= this.x + halfWidth &&
                   py >= this.y - halfHeight &&
                   py <= this.y + halfHeight;
        }
    }

    /**
     * Check collision with another sprite (AABB)
     * @param {Sprite} other
     */
    collidesWith(other) {
        return this.x < other.x + other.width &&
               this.x + this.width > other.x &&
               this.y < other.y + other.height &&
               this.y + this.height > other.y;
    }

    /**
     * Move sprite to position
     * @param {number} x
     * @param {number} y
     */
    moveTo(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Animate property over time (simple tween)
     * @param {string} property - Property to animate ('x', 'y', 'scale', 'rotation', etc.)
     * @param {number} targetValue - Target value
     * @param {number} duration - Duration in seconds
     */
    animateTo(property, targetValue, duration) {
        const startValue = this[property];
        const startTime = performance.now();

        const animate = () => {
            const elapsed = (performance.now() - startTime) / 1000;
            const progress = Math.min(elapsed / duration, 1);

            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            this[property] = startValue + (targetValue - startValue) * eased;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    /**
     * Utility: Lighten color by percentage
     */
    lightenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.min(255, (num >> 16) + amt);
        const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
        const B = Math.min(255, (num & 0x0000FF) + amt);
        return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
    }

    /**
     * Utility: Darken color by percentage
     */
    darkenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.max(0, (num >> 16) - amt);
        const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
        const B = Math.max(0, (num & 0x0000FF) - amt);
        return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
    }

    /**
     * Destroy sprite
     */
    destroy() {
        this.active = false;
        this.visible = false;
    }
}

/**
 * Sprite factory for creating common sprite types
 */
class SpriteFactory {
    static createVisitor(x, y, type = 'default') {
        const visitorTypes = {
            default: { color: '#FF6B6B', emoji: '👨‍🦰' },
            elder: { color: '#FFD93D', emoji: '👵' },
            child: { color: '#6BCB77', emoji: '🧒' },
            artist: { color: '#A084DC', emoji: '🧑‍🎨' },
            scholar: { color: '#4D96FF', emoji: '👨‍💼' },
            tourist: { color: '#FFA07A', emoji: '👩‍🦱' }
        };

        const config = visitorTypes[type] || visitorTypes.default;

        return new Sprite(x, y, {
            shape: 'circle',
            width: 50,
            height: 50,
            color: config.color,
            emoji: config.emoji,
            emojiSize: 28,
            type: 'visitor',
            draggable: true,
            data: { visitorType: type }
        });
    }

    static createArtifact(x, y, artifactType = 'painting') {
        const artifactTypes = {
            painting: { color: '#8B7355', emoji: '🖼️', shape: 'rect' },
            sculpture: { color: '#A9A9A9', emoji: '🗿', shape: 'circle' },
            vase: { color: '#E8C4A0', emoji: '🏺', shape: 'circle' },
            scroll: { color: '#F5DEB3', emoji: '📜', shape: 'rect' },
            mask: { color: '#DAA520', emoji: '🎭', shape: 'circle' },
            urn: { color: '#8B8B83', emoji: '⚱️', shape: 'roundRect' }
        };

        const config = artifactTypes[artifactType] || artifactTypes.painting;

        return new Sprite(x, y, {
            shape: config.shape,
            width: 60,
            height: 60,
            color: config.color,
            emoji: config.emoji,
            emojiSize: 32,
            type: 'artifact',
            draggable: true,
            data: { artifactType }
        });
    }

    static createDoor(x, y, label = 'A') {
        return new Sprite(x, y, {
            shape: 'roundRect',
            width: 80,
            height: 100,
            color: '#8B4513',
            emoji: label,
            emojiSize: 24,
            type: 'door',
            draggable: false,
            data: { doorLabel: label }
        });
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Sprite, SpriteFactory };
}
