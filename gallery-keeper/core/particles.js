/**
 * Gallery Keeper - Particle System
 *
 * Handles:
 * - Particle emission and lifecycle
 * - Various particle types (sparkles, hearts, trails, confetti)
 * - Efficient pooling and rendering
 */

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.active = false;
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.life = 1.0;
        this.decay = 0.02;
        this.size = 5;
        this.color = '#FFFFFF';
        this.type = 'circle';
        this.rotation = 0;
        this.rotationSpeed = 0;
        this.gravity = 0;
    }

    update(dt) {
        if (!this.active) return;

        // Update position
        this.x += this.vx * dt * 60; // Scale by 60 for frame-independent movement
        this.y += this.vy * dt * 60;

        // Apply gravity
        this.vy += this.gravity * dt * 60;

        // Update rotation
        this.rotation += this.rotationSpeed * dt * 60;

        // Decay life
        this.life -= this.decay;

        // Deactivate when dead
        if (this.life <= 0) {
            this.active = false;
        }
    }

    render(ctx) {
        if (!this.active) return;

        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        switch (this.type) {
            case 'circle':
                this.renderCircle(ctx);
                break;
            case 'star':
                this.renderStar(ctx);
                break;
            case 'heart':
                this.renderHeart(ctx);
                break;
            case 'sparkle':
                this.renderSparkle(ctx);
                break;
            case 'square':
                this.renderSquare(ctx);
                break;
        }

        ctx.restore();
    }

    renderCircle(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    renderStar(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
            const x = Math.cos(angle) * this.size;
            const y = Math.sin(angle) * this.size;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
    }

    renderHeart(ctx) {
        ctx.fillStyle = this.color;
        const size = this.size;
        ctx.beginPath();
        ctx.moveTo(0, size / 4);
        ctx.bezierCurveTo(-size, -size / 2, -size, -size, 0, -size / 4);
        ctx.bezierCurveTo(size, -size, size, -size / 2, 0, size / 4);
        ctx.fill();
    }

    renderSparkle(ctx) {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        const size = this.size;

        // Draw + shape
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.lineTo(0, size);
        ctx.moveTo(-size, 0);
        ctx.lineTo(size, 0);
        ctx.stroke();
    }

    renderSquare(ctx) {
        ctx.fillStyle = this.color;
        const half = this.size / 2;
        ctx.fillRect(-half, -half, this.size, this.size);
    }
}

class ParticleSystem {
    constructor(maxParticles = 500) {
        this.maxParticles = maxParticles;
        this.particles = [];

        // Create particle pool
        for (let i = 0; i < maxParticles; i++) {
            this.particles.push(new Particle());
        }

        this.active = true;
    }

    /**
     * Emit particles with configuration
     */
    emit(x, y, config = {}) {
        const count = config.count || 10;

        for (let i = 0; i < count; i++) {
            const particle = this.getInactiveParticle();
            if (!particle) break; // Pool exhausted

            particle.active = true;
            particle.x = x;
            particle.y = y;

            // Velocity
            const angle = config.angle !== undefined ? config.angle : Math.random() * Math.PI * 2;
            const speed = config.speed !== undefined ? config.speed : 2 + Math.random() * 3;
            particle.vx = Math.cos(angle) * speed;
            particle.vy = Math.sin(angle) * speed;

            // Appearance
            particle.size = config.size || (3 + Math.random() * 5);
            particle.color = config.color || '#FFFFFF';
            particle.type = config.type || 'circle';

            // Lifecycle
            particle.life = config.life || 1.0;
            particle.decay = config.decay || 0.02;

            // Physics
            particle.gravity = config.gravity !== undefined ? config.gravity : 0;
            particle.rotation = config.rotation || 0;
            particle.rotationSpeed = config.rotationSpeed || (Math.random() - 0.5) * 0.2;
        }
    }

    /**
     * Emit sparkle burst (for successful actions)
     */
    emitSparkles(x, y) {
        this.emit(x, y, {
            count: 20,
            type: 'sparkle',
            color: '#FFD700',
            speed: 3,
            life: 1.0,
            decay: 0.03,
            size: 6
        });
    }

    /**
     * Emit hearts (for happy visitors)
     */
    emitHearts(x, y) {
        this.emit(x, y, {
            count: 5,
            type: 'heart',
            color: '#FF6B9D',
            speed: 2,
            life: 1.5,
            decay: 0.015,
            gravity: -0.05,
            size: 8
        });
    }

    /**
     * Emit confetti (for level completion)
     */
    emitConfetti(x, y) {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];

        for (let i = 0; i < 50; i++) {
            this.emit(x, y, {
                count: 1,
                type: Math.random() > 0.5 ? 'square' : 'circle',
                color: colors[Math.floor(Math.random() * colors.length)],
                speed: 4 + Math.random() * 4,
                life: 2.0,
                decay: 0.01,
                gravity: 0.15,
                size: 4 + Math.random() * 4,
                rotationSpeed: (Math.random() - 0.5) * 0.3
            });
        }
    }

    /**
     * Emit trail particles (following sprite)
     */
    emitTrail(x, y, color = '#FFFFFF') {
        this.emit(x, y, {
            count: 3,
            type: 'circle',
            color: color,
            speed: 0.5,
            life: 0.8,
            decay: 0.05,
            size: 4
        });
    }

    /**
     * Get inactive particle from pool
     */
    getInactiveParticle() {
        for (let particle of this.particles) {
            if (!particle.active) {
                return particle;
            }
        }
        return null;
    }

    /**
     * Update all active particles
     */
    update(dt) {
        if (!this.active) return;

        for (let particle of this.particles) {
            if (particle.active) {
                particle.update(dt);
            }
        }
    }

    /**
     * Render all active particles
     */
    render(ctx) {
        if (!this.active) return;

        for (let particle of this.particles) {
            if (particle.active) {
                particle.render(ctx);
            }
        }
    }

    /**
     * Clear all particles
     */
    clear() {
        for (let particle of this.particles) {
            particle.active = false;
        }
    }

    /**
     * Get active particle count
     */
    getActiveCount() {
        let count = 0;
        for (let particle of this.particles) {
            if (particle.active) count++;
        }
        return count;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ParticleSystem;
}
