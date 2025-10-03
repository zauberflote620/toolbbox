/**
 * Gallery Keeper - Modern Sprite System with Enhanced Visuals
 *
 * Features:
 * - Detailed character sprites with clothing and accessories
 * - Realistic museum artifact rendering
 * - Modern shadows and lighting effects
 * - Smooth animations and transitions
 */

class ModernSprite {
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
        this.type = options.type || 'generic';
        this.subtype = options.subtype || 'default';

        // State
        this.active = true;
        this.visible = true;
        this.draggable = options.draggable || false;
        this.dragging = false;

        // Animation
        this.rotation = 0;
        this.scale = 1;
        this.alpha = 1;
        this.bounce = 0; // For idle animation

        // Metadata
        this.id = options.id || `sprite_${Date.now()}_${Math.random()}`;
        this.data = options.data || {};
    }

    update(dt) {
        if (!this.active || this.dragging) return;

        // Update position
        this.x += this.vx * dt;
        this.y += this.vy * dt;

        // Idle bounce animation
        this.bounce = Math.sin(Date.now() / 500) * 3;
    }

    render(ctx) {
        if (!this.visible) return;

        ctx.save();
        ctx.translate(this.x, this.y + this.bounce);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale, this.scale);
        ctx.globalAlpha = this.alpha;

        // Render shadow
        this.renderShadow(ctx);

        // Render based on type
        if (this.type === 'visitor') {
            this.renderVisitor(ctx);
        } else if (this.type === 'artifact') {
            this.renderArtifact(ctx);
        } else if (this.type === 'door') {
            this.renderDoor(ctx);
        }

        ctx.restore();
    }

    renderShadow(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(0, this.height * 0.4, this.width * 0.35, this.height * 0.1, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    renderVisitor(ctx) {
        const visitorRenderers = {
            default: () => this.renderDefaultVisitor(ctx, '#FF6B6B', '#8B0000'),
            elder: () => this.renderElderVisitor(ctx),
            child: () => this.renderChildVisitor(ctx),
            artist: () => this.renderArtistVisitor(ctx),
            scholar: () => this.renderScholarVisitor(ctx),
            tourist: () => this.renderTouristVisitor(ctx)
        };

        const renderer = visitorRenderers[this.subtype] || visitorRenderers.default;
        renderer();
    }

    renderDefaultVisitor(ctx, bodyColor, hairColor) {
        // Body (torso)
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.ellipse(0, 5, 15, 18, 0, 0, Math.PI * 2);
        ctx.fill();

        // Head
        ctx.fillStyle = '#FDBCB4'; // Skin tone
        ctx.beginPath();
        ctx.arc(0, -12, 12, 0, Math.PI * 2);
        ctx.fill();

        // Hair
        ctx.fillStyle = hairColor;
        ctx.beginPath();
        ctx.arc(0, -18, 13, 0, Math.PI);
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-4, -12, 2, 0, Math.PI * 2);
        ctx.arc(4, -12, 2, 0, Math.PI * 2);
        ctx.fill();

        // Smile
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, -8, 5, 0.2, Math.PI - 0.2);
        ctx.stroke();

        // Arms
        ctx.strokeStyle = '#FDBCB4';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-15, 0);
        ctx.lineTo(-10, 10);
        ctx.moveTo(15, 0);
        ctx.lineTo(10, 10);
        ctx.stroke();
    }

    renderElderVisitor(ctx) {
        // Elderly person with walking stick
        this.renderDefaultVisitor(ctx, '#9B59B6', '#E0E0E0');

        // Walking stick
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(12, 10);
        ctx.lineTo(12, 25);
        ctx.stroke();

        // Glasses
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(-4, -12, 3, 0, Math.PI * 2);
        ctx.arc(4, -12, 3, 0, Math.PI * 2);
        ctx.moveTo(-1, -12);
        ctx.lineTo(1, -12);
        ctx.stroke();
    }

    renderChildVisitor(ctx) {
        // Smaller child with backpack
        ctx.save();
        ctx.scale(0.75, 0.75);

        this.renderDefaultVisitor(ctx, '#6BCB77', '#2C3E50');

        // Backpack
        ctx.fillStyle = '#E74C3C';
        ctx.beginPath();
        ctx.roundRect(-8, 8, 16, 12, 4);
        ctx.fill();

        ctx.restore();
    }

    renderArtistVisitor(ctx) {
        // Artist with beret and palette
        this.renderDefaultVisitor(ctx, '#A084DC', '#2C3E50');

        // Beret
        ctx.fillStyle = '#8B0000';
        ctx.beginPath();
        ctx.ellipse(0, -20, 12, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Palette (holding)
        ctx.fillStyle = '#D4A574';
        ctx.beginPath();
        ctx.arc(-15, 5, 6, 0, Math.PI * 2);
        ctx.fill();

        // Paint spots
        ['#FF0000', '#00FF00', '#0000FF'].forEach((color, i) => {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(-15 + (i - 1) * 3, 5, 2, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    renderScholarVisitor(ctx) {
        // Scholar with book
        this.renderDefaultVisitor(ctx, '#4D96FF', '#654321');

        // Book
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(-6, 8, 12, 8);
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 1;
        ctx.strokeRect(-6, 8, 12, 8);
        ctx.beginPath();
        ctx.moveTo(0, 8);
        ctx.lineTo(0, 16);
        ctx.stroke();
    }

    renderTouristVisitor(ctx) {
        // Tourist with camera
        this.renderDefaultVisitor(ctx, '#FFA07A', '#DAA520');

        // Camera
        ctx.fillStyle = '#333';
        ctx.fillRect(-8, 2, 10, 8);
        ctx.fillStyle = '#555';
        ctx.beginPath();
        ctx.arc(-3, 6, 3, 0, Math.PI * 2);
        ctx.fill();

        // Camera strap
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-3, 10);
        ctx.lineTo(-10, -5);
        ctx.stroke();
    }

    renderArtifact(ctx) {
        const artifactRenderers = {
            painting: () => this.renderPainting(ctx),
            sculpture: () => this.renderSculpture(ctx),
            vase: () => this.renderVase(ctx),
            scroll: () => this.renderScroll(ctx),
            mask: () => this.renderMask(ctx),
            urn: () => this.renderUrn(ctx)
        };

        const renderer = artifactRenderers[this.subtype] || artifactRenderers.painting;
        renderer();
    }

    renderPainting(ctx) {
        // Ornate frame
        ctx.fillStyle = '#8B7355';
        ctx.strokeStyle = '#DAA520';
        ctx.lineWidth = 3;
        ctx.fillRect(-25, -25, 50, 40);
        ctx.strokeRect(-25, -25, 50, 40);

        // Canvas
        ctx.fillStyle = '#F5E6D3';
        ctx.fillRect(-20, -20, 40, 30);

        // Abstract art
        const gradient = ctx.createLinearGradient(-20, -20, 20, 10);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        ctx.fillStyle = gradient;
        ctx.fillRect(-18, -18, 36, 26);

        // Accent strokes
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-10, -10);
        ctx.lineTo(10, 5);
        ctx.stroke();
    }

    renderSculpture(ctx) {
        // Pedestal
        ctx.fillStyle = '#A9A9A9';
        ctx.fillRect(-12, 10, 24, 15);

        // Bust
        const gradient = ctx.createRadialGradient(-5, -5, 0, 0, 0, 20);
        gradient.addColorStop(0, '#E0E0E0');
        gradient.addColorStop(1, '#808080');
        ctx.fillStyle = gradient;

        // Head
        ctx.beginPath();
        ctx.ellipse(0, -10, 12, 14, 0, 0, Math.PI * 2);
        ctx.fill();

        // Shoulders
        ctx.beginPath();
        ctx.ellipse(0, 8, 18, 8, 0, 0, Math.PI);
        ctx.fill();

        // Facial features (minimal)
        ctx.fillStyle = '#555';
        ctx.beginPath();
        ctx.arc(-4, -12, 1, 0, Math.PI * 2);
        ctx.arc(4, -12, 1, 0, Math.PI * 2);
        ctx.fill();
    }

    renderVase(ctx) {
        const gradient = ctx.createLinearGradient(-15, -20, 15, 20);
        gradient.addColorStop(0, '#E8C4A0');
        gradient.addColorStop(0.5, '#D4A574');
        gradient.addColorStop(1, '#C19A6B');

        ctx.fillStyle = gradient;

        // Vase body
        ctx.beginPath();
        ctx.moveTo(0, -20);
        ctx.bezierCurveTo(-8, -20, -12, -10, -15, 0);
        ctx.bezierCurveTo(-15, 10, -10, 18, -8, 20);
        ctx.lineTo(8, 20);
        ctx.bezierCurveTo(10, 18, 15, 10, 15, 0);
        ctx.bezierCurveTo(12, -10, 8, -20, 0, -20);
        ctx.fill();

        // Decorative pattern
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-12, -5);
        ctx.bezierCurveTo(0, -10, 0, 0, 12, -5);
        ctx.stroke();
    }

    renderScroll(ctx) {
        // Paper
        ctx.fillStyle = '#F5DEB3';
        ctx.fillRect(-20, -15, 40, 30);

        // Scroll ends
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(-25, -15, 5, 30);
        ctx.fillRect(20, -15, 5, 30);

        // Text lines
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 1;
        for (let i = -10; i < 10; i += 5) {
            ctx.beginPath();
            ctx.moveTo(-15, i);
            ctx.lineTo(15, i);
            ctx.stroke();
        }
    }

    renderMask(ctx) {
        // Mask base
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 20);
        gradient.addColorStop(0, '#FFD700');
        gradient.addColorStop(1, '#DAA520');
        ctx.fillStyle = gradient;

        // Face shape
        ctx.beginPath();
        ctx.ellipse(0, 0, 18, 22, 0, 0, Math.PI * 2);
        ctx.fill();

        // Eye holes
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.ellipse(-6, -5, 4, 6, 0, 0, Math.PI * 2);
        ctx.ellipse(6, -5, 4, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Decorative lines
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-15, 5);
        ctx.lineTo(15, 5);
        ctx.moveTo(-12, 10);
        ctx.lineTo(12, 10);
        ctx.stroke();
    }

    renderUrn(ctx) {
        const gradient = ctx.createLinearGradient(0, -25, 0, 25);
        gradient.addColorStop(0, '#A0A0A0');
        gradient.addColorStop(0.5, '#808080');
        gradient.addColorStop(1, '#606060');

        ctx.fillStyle = gradient;

        // Urn body
        ctx.beginPath();
        ctx.moveTo(0, -25);
        ctx.bezierCurveTo(-10, -25, -12, -20, -15, -10);
        ctx.bezierCurveTo(-15, 0, -12, 15, -10, 20);
        ctx.lineTo(10, 20);
        ctx.bezierCurveTo(12, 15, 15, 0, 15, -10);
        ctx.bezierCurveTo(12, -20, 10, -25, 0, -25);
        ctx.fill();

        // Handles
        ctx.strokeStyle = '#505050';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(-12, -15, 5, Math.PI, Math.PI * 1.5);
        ctx.arc(12, -15, 5, Math.PI * 1.5, 0);
        ctx.stroke();
    }

    renderDoor(ctx) {
        // Door background
        const gradient = ctx.createLinearGradient(-30, -40, 30, 40);
        gradient.addColorStop(0, '#8B4513');
        gradient.addColorStop(1, '#654321');
        ctx.fillStyle = gradient;
        ctx.fillRect(-30, -40, 60, 80);

        // Door panels
        ctx.strokeStyle = '#A0522D';
        ctx.lineWidth = 3;
        ctx.strokeRect(-25, -35, 50, 35);
        ctx.strokeRect(-25, 5, 50, 30);

        // Door knob
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(20, 20, 4, 0, Math.PI * 2);
        ctx.fill();

        // Door label
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.data.doorLabel || 'A', 0, -15);
    }

    // Utility methods (same as before)
    containsPoint(px, py) {
        const dx = px - this.x;
        const dy = py - this.y;
        const halfWidth = this.width / 2;
        const halfHeight = this.height / 2;
        return Math.abs(dx) <= halfWidth && Math.abs(dy) <= halfHeight;
    }

    moveTo(x, y) {
        this.x = x;
        this.y = y;
    }

    animateTo(property, targetValue, duration) {
        const startValue = this[property];
        const startTime = performance.now();

        const animate = () => {
            const elapsed = (performance.now() - startTime) / 1000;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            this[property] = startValue + (targetValue - startValue) * eased;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    destroy() {
        this.active = false;
        this.visible = false;
    }
}

// Modern Sprite Factory
class ModernSpriteFactory {
    static createVisitor(x, y, type = 'default') {
        return new ModernSprite(x, y, {
            type: 'visitor',
            subtype: type,
            width: 50,
            height: 60,
            draggable: true
        });
    }

    static createArtifact(x, y, artifactType = 'painting') {
        return new ModernSprite(x, y, {
            type: 'artifact',
            subtype: artifactType,
            width: 60,
            height: 70,
            draggable: true
        });
    }

    static createDoor(x, y, label = 'A') {
        return new ModernSprite(x, y, {
            type: 'door',
            subtype: 'standard',
            width: 80,
            height: 100,
            draggable: false,
            data: { doorLabel: label }
        });
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ModernSprite, ModernSpriteFactory };
}
