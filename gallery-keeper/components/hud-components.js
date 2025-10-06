/**
 * Gallery Keeper HUD Components
 *
 * Heads-Up Display elements for game interfaces
 * Includes: Score, timer, resources, combo meters, objective trackers
 *
 * Usage:
 *   const hud = new GalleryHUD(canvas, ctx);
 *   hud.drawScore(x, y, score);
 *   hud.drawTimer(x, y, timeRemaining);
 */

class GalleryHUD {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;

        // Load design tokens
        this.tokens = this.loadDesignTokens();

        // Animation state
        this.animations = new Map();
    }

    /**
     * Load design tokens from CSS
     */
    loadDesignTokens() {
        const styles = getComputedStyle(document.documentElement);

        return {
            colors: {
                brown900: styles.getPropertyValue('--color-brown-900').trim() || '#3E2723',
                brown800: styles.getPropertyValue('--color-brown-800').trim() || '#4E342E',
                brown700: styles.getPropertyValue('--color-brown-700').trim() || '#5D4037',
                brown600: styles.getPropertyValue('--color-brown-600').trim() || '#6D4C41',
                tan700: styles.getPropertyValue('--color-tan-700').trim() || '#A1887F',
                tan600: styles.getPropertyValue('--color-tan-600').trim() || '#BCAAA4',
                tan500: styles.getPropertyValue('--color-tan-500').trim() || '#D7CCC8',
                tan400: styles.getPropertyValue('--color-tan-400').trim() || '#ECF0F1',
                success: styles.getPropertyValue('--color-success').trim() || '#4CAF50',
                warning: styles.getPropertyValue('--color-warning').trim() || '#FFD700',
                error: styles.getPropertyValue('--color-error').trim() || '#e74c3c',
                info: styles.getPropertyValue('--color-info').trim() || '#3498DB',
            }
        };
    }

    /**
     * Draw score display
     */
    drawScore(x, y, score, options = {}) {
        const {
            label = 'SCORE',
            icon = null,
            showChange = true,
            previousScore = null
        } = options;

        const ctx = this.ctx;

        // Draw background panel
        const panelWidth = 150;
        const panelHeight = 70;

        ctx.save();
        ctx.fillStyle = 'rgba(62, 39, 35, 0.9)'; // brown900 with alpha
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 4;
        this.roundRect(ctx, x, y, panelWidth, panelHeight, 8);
        ctx.fill();
        ctx.restore();

        // Draw icon if provided
        let labelX = x + 12;
        if (icon) {
            ctx.fillStyle = this.tokens.colors.tan700;
            ctx.font = '24px sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(icon, x + 12, y + panelHeight / 2);
            labelX += 32;
        }

        // Draw label
        ctx.fillStyle = this.tokens.colors.tan600;
        ctx.font = '600 11px mOS, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(label, labelX, y + 10);

        // Draw score value
        ctx.fillStyle = this.tokens.colors.tan700;
        ctx.font = '900 28px mOS, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        ctx.fillText(score.toString(), labelX, y + panelHeight - 10);

        // Draw score change indicator
        if (showChange && previousScore !== null && score > previousScore) {
            const change = score - previousScore;
            ctx.fillStyle = this.tokens.colors.success;
            ctx.font = '600 14px mOS, sans-serif';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillText(`+${change}`, x + panelWidth - 12, y + panelHeight / 2);
        }
    }

    /**
     * Draw timer display
     */
    drawTimer(x, y, timeRemaining, options = {}) {
        const {
            label = 'TIME',
            format = 'seconds', // seconds, minutes, countdown
            warning = 10, // seconds remaining to show warning color
            critical = 5
        } = options;

        const ctx = this.ctx;
        const panelWidth = 120;
        const panelHeight = 70;

        // Determine color based on time remaining
        let valueColor = this.tokens.colors.tan700;
        if (timeRemaining <= critical) {
            valueColor = this.tokens.colors.error;
        } else if (timeRemaining <= warning) {
            valueColor = this.tokens.colors.warning;
        }

        // Draw background panel
        ctx.save();
        ctx.fillStyle = 'rgba(62, 39, 35, 0.9)';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 4;
        this.roundRect(ctx, x, y, panelWidth, panelHeight, 8);
        ctx.fill();
        ctx.restore();

        // Draw label
        ctx.fillStyle = this.tokens.colors.tan600;
        ctx.font = '600 11px mOS, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(label, x + 12, y + 10);

        // Format time
        let timeString;
        if (format === 'minutes') {
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = Math.floor(timeRemaining % 60);
            timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        } else {
            timeString = Math.ceil(timeRemaining).toString();
        }

        // Draw time value
        ctx.fillStyle = valueColor;
        ctx.font = '900 28px mOS, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        ctx.fillText(timeString, x + 12, y + panelHeight - 10);

        // Add pulse animation if critical
        if (timeRemaining <= critical) {
            const pulse = Math.sin(Date.now() / 200) * 0.1 + 0.9;
            ctx.globalAlpha = pulse;
            ctx.fillStyle = this.tokens.colors.error;
            ctx.fillText(timeString, x + 12, y + panelHeight - 10);
            ctx.globalAlpha = 1;
        }
    }

    /**
     * Draw resource meter (e.g., energy, stamina, mana)
     */
    drawResource(x, y, current, max, options = {}) {
        const {
            label = 'RESOURCE',
            icon = null,
            color = this.tokens.colors.info,
            backgroundColor = this.tokens.colors.brown800,
            width = 200,
            height = 30,
            showValue = true
        } = options;

        const ctx = this.ctx;

        // Draw label if provided
        if (label) {
            ctx.fillStyle = this.tokens.colors.tan600;
            ctx.font = '600 11px mOS, sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'bottom';
            ctx.fillText(label, x, y - 4);
        }

        // Draw background bar
        ctx.fillStyle = backgroundColor;
        this.roundRect(ctx, x, y, width, height, 999);
        ctx.fill();

        // Draw fill bar
        const fillWidth = (current / max) * width;
        if (fillWidth > 0) {
            const gradient = ctx.createLinearGradient(x, y, x + fillWidth, y);
            gradient.addColorStop(0, color);
            gradient.addColorStop(1, this.adjustColorBrightness(color, -15));

            ctx.fillStyle = gradient;
            ctx.beginPath();
            this.roundRect(ctx, x, y, fillWidth, height, 999);
            ctx.fill();
        }

        // Draw value text
        if (showValue) {
            ctx.fillStyle = 'white';
            ctx.font = '600 14px mOS, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${Math.round(current)}/${max}`, x + width / 2, y + height / 2);
        }

        // Draw icon if provided
        if (icon) {
            ctx.fillStyle = 'white';
            ctx.font = '20px sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(icon, x + 8, y + height / 2);
        }
    }

    /**
     * Draw combo meter
     */
    drawCombo(x, y, combo, options = {}) {
        const {
            label = 'COMBO',
            maxCombo = 100,
            showMultiplier = true
        } = options;

        const ctx = this.ctx;
        const panelWidth = 100;
        const panelHeight = 80;

        // Determine color based on combo level
        let comboColor = this.tokens.colors.tan700;
        if (combo >= maxCombo * 0.75) {
            comboColor = this.tokens.colors.success;
        } else if (combo >= maxCombo * 0.5) {
            comboColor = this.tokens.colors.warning;
        }

        // Draw background panel
        ctx.save();
        ctx.fillStyle = 'rgba(62, 39, 35, 0.9)';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 4;
        this.roundRect(ctx, x, y, panelWidth, panelHeight, 8);
        ctx.fill();
        ctx.restore();

        // Draw label
        ctx.fillStyle = this.tokens.colors.tan600;
        ctx.font = '600 11px mOS, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(label, x + panelWidth / 2, y + 10);

        // Draw combo value
        ctx.fillStyle = comboColor;
        ctx.font = '900 32px mOS, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(combo.toString(), x + panelWidth / 2, y + panelHeight / 2 + 5);

        // Draw multiplier
        if (showMultiplier && combo > 0) {
            const multiplier = Math.floor(combo / 10) + 1;
            ctx.fillStyle = this.tokens.colors.tan600;
            ctx.font = '600 12px mOS, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText(`×${multiplier}`, x + panelWidth / 2, y + panelHeight - 8);
        }

        // Add glow effect for high combos
        if (combo >= maxCombo * 0.75) {
            const glow = Math.sin(Date.now() / 150) * 0.3 + 0.7;
            ctx.globalAlpha = glow;
            ctx.shadowColor = comboColor;
            ctx.shadowBlur = 20;
            ctx.fillStyle = comboColor;
            ctx.fillText(combo.toString(), x + panelWidth / 2, y + panelHeight / 2 + 5);
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
        }
    }

    /**
     * Draw objective tracker
     */
    drawObjective(x, y, objectives, options = {}) {
        const {
            title = 'OBJECTIVES',
            width = 250,
            collapsible = true,
            collapsed = false
        } = options;

        const ctx = this.ctx;
        const lineHeight = 24;
        const padding = 12;
        const headerHeight = 40;
        const panelHeight = collapsed ? headerHeight : headerHeight + objectives.length * lineHeight + padding;

        // Draw background panel
        ctx.save();
        ctx.fillStyle = 'rgba(62, 39, 35, 0.95)';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 12;
        ctx.shadowOffsetY = 4;
        this.roundRect(ctx, x, y, width, panelHeight, 8);
        ctx.fill();
        ctx.restore();

        // Draw header
        ctx.fillStyle = this.tokens.colors.tan700;
        ctx.font = '900 14px mOS, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(title, x + padding, y + headerHeight / 2);

        // Draw expand/collapse indicator if collapsible
        if (collapsible) {
            ctx.fillStyle = this.tokens.colors.tan600;
            ctx.font = '16px sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText(collapsed ? '▼' : '▲', x + width - padding, y + headerHeight / 2);
        }

        // Draw objectives if not collapsed
        if (!collapsed) {
            let currentY = y + headerHeight + padding;

            objectives.forEach(objective => {
                const completed = objective.completed || false;
                const icon = completed ? '✓' : '○';
                const color = completed ? this.tokens.colors.success : this.tokens.colors.tan600;

                // Draw checkbox/icon
                ctx.fillStyle = color;
                ctx.font = '18px sans-serif';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'middle';
                ctx.fillText(icon, x + padding, currentY);

                // Draw objective text
                ctx.fillStyle = completed ? this.tokens.colors.tan600 : this.tokens.colors.tan500;
                ctx.font = `${completed ? '400' : '600'} 13px mOS, sans-serif`;
                ctx.textAlign = 'left';

                // Strike through if completed
                if (completed) {
                    ctx.save();
                    ctx.globalAlpha = 0.6;
                }

                ctx.fillText(objective.text, x + padding + 28, currentY);

                if (completed) {
                    ctx.strokeStyle = this.tokens.colors.tan600;
                    ctx.lineWidth = 1;
                    const textWidth = ctx.measureText(objective.text).width;
                    ctx.beginPath();
                    ctx.moveTo(x + padding + 28, currentY);
                    ctx.lineTo(x + padding + 28 + textWidth, currentY);
                    ctx.stroke();
                    ctx.restore();
                }

                currentY += lineHeight;
            });
        }

        return { x, y, width, height: panelHeight, collapsed };
    }

    /**
     * Draw mini-map/radar
     */
    drawMinimap(x, y, size, entities, player, options = {}) {
        const {
            backgroundColor = this.tokens.colors.brown800,
            borderColor = this.tokens.colors.brown600,
            playerColor = this.tokens.colors.success,
            entityColor = this.tokens.colors.info,
            worldWidth = 800,
            worldHeight = 600,
            radius = 8
        } = options;

        const ctx = this.ctx;

        // Draw background
        ctx.fillStyle = backgroundColor;
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 2;
        this.roundRect(ctx, x, y, size, size, radius);
        ctx.fill();
        ctx.stroke();

        // Calculate scale
        const scale = size / Math.max(worldWidth, worldHeight);

        // Draw entities
        ctx.fillStyle = entityColor;
        entities.forEach(entity => {
            const ex = x + entity.x * scale;
            const ey = y + entity.y * scale;
            ctx.beginPath();
            ctx.arc(ex, ey, 3, 0, Math.PI * 2);
            ctx.fill();
        });

        // Draw player
        ctx.fillStyle = playerColor;
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        const px = x + player.x * scale;
        const py = y + player.y * scale;
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }

    /**
     * Draw notification toast
     */
    drawToast(message, options = {}) {
        const {
            duration = 3000,
            position = 'top', // top, bottom, center
            type = 'info', // info, success, warning, error
            icon = null
        } = options;

        // Determine position
        let x, y;
        const width = 300;
        const height = 60;

        switch (position) {
            case 'top':
                x = (this.canvas.width - width) / 2;
                y = 20;
                break;
            case 'bottom':
                x = (this.canvas.width - width) / 2;
                y = this.canvas.height - height - 20;
                break;
            case 'center':
            default:
                x = (this.canvas.width - width) / 2;
                y = (this.canvas.height - height) / 2;
        }

        // Determine colors based on type
        let bgColor, textColor;
        switch (type) {
            case 'success':
                bgColor = this.tokens.colors.success;
                textColor = 'white';
                break;
            case 'warning':
                bgColor = this.tokens.colors.warning;
                textColor = this.tokens.colors.brown900;
                break;
            case 'error':
                bgColor = this.tokens.colors.error;
                textColor = 'white';
                break;
            default:
                bgColor = this.tokens.colors.info;
                textColor = 'white';
        }

        const ctx = this.ctx;

        // Draw background
        ctx.save();
        ctx.fillStyle = bgColor;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 16;
        ctx.shadowOffsetY = 4;
        this.roundRect(ctx, x, y, width, height, 8);
        ctx.fill();
        ctx.restore();

        // Draw icon if provided
        let textX = x + 20;
        if (icon) {
            ctx.fillStyle = textColor;
            ctx.font = '24px sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(icon, x + 16, y + height / 2);
            textX += 32;
        }

        // Draw message
        ctx.fillStyle = textColor;
        ctx.font = '600 14px mOS, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(message, textX, y + height / 2);
    }

    /**
     * Helper: Draw rounded rectangle
     */
    roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.arcTo(x + width, y, x + width, y + height, radius);
        ctx.arcTo(x + width, y + height, x, y + height, radius);
        ctx.arcTo(x, y + height, x, y, radius);
        ctx.arcTo(x, y, x + width, y, radius);
        ctx.closePath();
    }

    /**
     * Helper: Adjust color brightness
     */
    adjustColorBrightness(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;

        return '#' + (
            0x1000000 +
            (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
            (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
            (B < 255 ? (B < 1 ? 0 : B) : 255)
        ).toString(16).slice(1);
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GalleryHUD };
}
