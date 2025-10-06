/**
 * Gallery Keeper Core Components
 *
 * Reusable UI component library for consistent gallery aesthetic
 * Built on design-tokens.css and typography.css
 *
 * Usage:
 *   Include design system CSS files first, then this JS file
 *   const ui = new GalleryUI(canvas, ctx);
 *   ui.button(x, y, width, height, 'Click Me', { variant: 'primary' });
 */

class GalleryUI {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.buttons = new Map();
        this.hoveredElement = null;
        this.activeModal = null;

        // Get design tokens from CSS
        this.tokens = this.loadDesignTokens();

        // Set up mouse tracking for interactivity
        this.setupMouseTracking();
    }

    /**
     * Load design tokens from CSS custom properties
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
                successHover: styles.getPropertyValue('--color-success-hover').trim() || '#66BB6A',
                warning: styles.getPropertyValue('--color-warning').trim() || '#FFD700',
                error: styles.getPropertyValue('--color-error').trim() || '#e74c3c',
                info: styles.getPropertyValue('--color-info').trim() || '#3498DB',
            },
            spacing: {
                xs: 8,
                sm: 13,
                md: 21,
                lg: 34,
                xl: 55
            },
            radius: {
                sm: 4,
                base: 6,
                md: 8,
                lg: 12,
                xl: 16
            }
        };
    }

    /**
     * Setup mouse tracking for hover effects
     */
    setupMouseTracking() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Check for button hovers
            let foundHover = false;
            for (const [id, button] of this.buttons) {
                if (this.isPointInRect(x, y, button.bounds)) {
                    this.hoveredElement = { type: 'button', id };
                    this.canvas.style.cursor = 'pointer';
                    foundHover = true;
                    break;
                }
            }

            if (!foundHover) {
                this.hoveredElement = null;
                this.canvas.style.cursor = 'default';
            }
        });
    }

    /**
     * Check if point is within rectangle
     */
    isPointInRect(px, py, rect) {
        return px >= rect.x && px <= rect.x + rect.width &&
               py >= rect.y && py <= rect.y + rect.height;
    }

    /**
     * Draw a button component
     *
     * @param {string} id - Unique identifier
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Button width
     * @param {number} height - Button height
     * @param {string} text - Button text
     * @param {object} options - Styling options
     * @returns {object} Button bounds for hit testing
     */
    button(id, x, y, width, height, text, options = {}) {
        const {
            variant = 'primary',  // primary, secondary, info, warning, danger
            disabled = false,
            fontSize = 16,
            icon = null,
            shadow = true
        } = options;

        const hovered = this.hoveredElement?.type === 'button' && this.hoveredElement?.id === id;

        // Determine colors based on variant and state
        let bgColor, textColor;

        switch (variant) {
            case 'primary':
                bgColor = hovered ? this.tokens.colors.successHover : this.tokens.colors.success;
                textColor = 'white';
                break;
            case 'secondary':
                bgColor = hovered ? this.tokens.colors.brown600 : this.tokens.colors.brown700;
                textColor = this.tokens.colors.tan500;
                break;
            case 'info':
                bgColor = hovered ? '#5DADE2' : this.tokens.colors.info;
                textColor = 'white';
                break;
            case 'warning':
                bgColor = hovered ? '#FFC107' : this.tokens.colors.warning;
                textColor = this.tokens.colors.brown900;
                break;
            case 'danger':
                bgColor = hovered ? '#FF6B6B' : this.tokens.colors.error;
                textColor = 'white';
                break;
            default:
                bgColor = this.tokens.colors.brown700;
                textColor = this.tokens.colors.tan500;
        }

        if (disabled) {
            bgColor = this.tokens.colors.brown800;
            textColor = this.tokens.colors.brown600;
        }

        // Apply hover transform
        const yOffset = hovered && !disabled ? -2 : 0;

        // Save context
        this.ctx.save();

        // Draw shadow
        if (shadow && !disabled) {
            this.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
            this.ctx.shadowBlur = hovered ? 16 : 12;
            this.ctx.shadowOffsetX = 0;
            this.ctx.shadowOffsetY = hovered ? 6 : 4;
        }

        // Draw button background with gradient
        const gradient = this.ctx.createLinearGradient(x, y, x, y + height);
        gradient.addColorStop(0, bgColor);
        gradient.addColorStop(1, this.adjustColorBrightness(bgColor, -10));

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.roundRect(x, y + yOffset, width, height, this.tokens.radius.base);
        this.ctx.fill();

        // Reset shadow for text
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;

        // Draw button text
        this.ctx.fillStyle = disabled ? this.tokens.colors.brown600 : textColor;
        this.ctx.font = `600 ${fontSize}px mOS, -apple-system, sans-serif`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        const textY = y + (height / 2) + yOffset;

        if (icon) {
            // Draw icon and text
            const iconX = x + (width / 2) - 30;
            const textX = x + (width / 2) + 10;
            this.ctx.fillText(icon, iconX, textY);
            this.ctx.fillText(text, textX, textY);
        } else {
            // Draw text only
            this.ctx.fillText(text, x + (width / 2), textY);
        }

        // Restore context
        this.ctx.restore();

        // Store button bounds for hit testing
        const bounds = { x, y, width, height };
        this.buttons.set(id, { bounds, disabled, callback: options.onClick });

        return bounds;
    }

    /**
     * Draw a panel/card component
     */
    panel(x, y, width, height, options = {}) {
        const {
            color = this.tokens.colors.brown700,
            borderColor = this.tokens.colors.brown600,
            borderWidth = 0,
            shadow = true,
            radius = this.tokens.radius.md,
            alpha = 1.0
        } = options;

        this.ctx.save();

        // Draw shadow
        if (shadow) {
            this.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
            this.ctx.shadowBlur = 32;
            this.ctx.shadowOffsetX = 0;
            this.ctx.shadowOffsetY = 8;
        }

        // Draw panel background
        this.ctx.globalAlpha = alpha;
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.roundRect(x, y, width, height, radius);
        this.ctx.fill();

        // Draw border if specified
        if (borderWidth > 0) {
            this.ctx.strokeStyle = borderColor;
            this.ctx.lineWidth = borderWidth;
            this.ctx.stroke();
        }

        this.ctx.restore();

        return { x, y, width, height };
    }

    /**
     * Draw a progress bar
     */
    progressBar(x, y, width, height, progress, options = {}) {
        const {
            backgroundColor = this.tokens.colors.brown800,
            fillColor = this.tokens.colors.success,
            text = null,
            textColor = 'white',
            showPercentage = true,
            radius = this.tokens.radius.full
        } = options;

        // Clamp progress between 0 and 1
        progress = Math.max(0, Math.min(1, progress));

        // Draw background
        this.ctx.fillStyle = backgroundColor;
        this.ctx.beginPath();
        this.roundRect(x, y, width, height, radius);
        this.ctx.fill();

        // Draw progress fill
        if (progress > 0) {
            const fillWidth = width * progress;
            this.ctx.fillStyle = fillColor;
            this.ctx.beginPath();
            this.roundRect(x, y, fillWidth, height, radius);
            this.ctx.fill();
        }

        // Draw text
        if (text || showPercentage) {
            this.ctx.fillStyle = textColor;
            this.ctx.font = `600 12px mOS, sans-serif`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';

            const displayText = text || `${Math.round(progress * 100)}%`;
            this.ctx.fillText(displayText, x + width / 2, y + height / 2);
        }
    }

    /**
     * Draw a score/stat display
     */
    statDisplay(x, y, label, value, options = {}) {
        const {
            labelColor = this.tokens.colors.tan600,
            valueColor = this.tokens.colors.tan700,
            labelSize = 12,
            valueSize = 24,
            icon = null
        } = options;

        let currentY = y;

        // Draw icon if provided
        if (icon) {
            this.ctx.font = `${valueSize}px sans-serif`;
            this.ctx.fillStyle = valueColor;
            this.ctx.fillText(icon, x, currentY);
            currentY += valueSize + 4;
        }

        // Draw label
        this.ctx.font = `600 ${labelSize}px mOS, sans-serif`;
        this.ctx.fillStyle = labelColor;
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText(label.toUpperCase(), x, currentY);
        currentY += labelSize + 4;

        // Draw value
        this.ctx.font = `900 ${valueSize}px mOS, sans-serif`;
        this.ctx.fillStyle = valueColor;
        this.ctx.fillText(value.toString(), x, currentY);
    }

    /**
     * Draw a speech bubble
     */
    speechBubble(x, y, width, text, options = {}) {
        const {
            character = 'NPC',
            characterColor = this.tokens.colors.tan700,
            backgroundColor = this.tokens.colors.brown700,
            textColor = this.tokens.colors.tan500,
            padding = this.tokens.spacing.md,
            tailSize = 20,
            tailPosition = 'bottom', // bottom, top, left, right
            radius = this.tokens.radius.lg
        } = options;

        const ctx = this.ctx;
        ctx.save();

        // Calculate bubble height based on text
        const lineHeight = 20;
        const lines = this.wrapText(text, width - padding * 2, '14px mOS, sans-serif');
        const textHeight = lines.length * lineHeight;
        const characterNameHeight = 24;
        const totalHeight = characterNameHeight + textHeight + padding * 2;

        // Draw shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 16;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 4;

        // Draw bubble background
        ctx.fillStyle = backgroundColor;
        ctx.beginPath();
        this.roundRect(x, y, width, totalHeight, radius);
        ctx.fill();

        // Draw tail
        ctx.shadowColor = 'transparent'; // No shadow on tail
        ctx.fillStyle = backgroundColor;
        ctx.beginPath();

        switch (tailPosition) {
            case 'bottom':
                ctx.moveTo(x + width / 2 - tailSize, y + totalHeight);
                ctx.lineTo(x + width / 2, y + totalHeight + tailSize);
                ctx.lineTo(x + width / 2 + tailSize, y + totalHeight);
                break;
            case 'top':
                ctx.moveTo(x + width / 2 - tailSize, y);
                ctx.lineTo(x + width / 2, y - tailSize);
                ctx.lineTo(x + width / 2 + tailSize, y);
                break;
        }
        ctx.closePath();
        ctx.fill();

        // Draw character name
        ctx.shadowColor = 'transparent';
        ctx.fillStyle = characterColor;
        ctx.font = `900 16px Angelinas, cursive`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(character, x + padding, y + padding);

        // Draw text lines
        ctx.fillStyle = textColor;
        ctx.font = '14px mOS, sans-serif';
        let textY = y + padding + characterNameHeight;

        lines.forEach(line => {
            ctx.fillText(line, x + padding, textY);
            textY += lineHeight;
        });

        ctx.restore();

        return { x, y, width, height: totalHeight + tailSize };
    }

    /**
     * Draw a modal overlay
     */
    modal(title, content, options = {}) {
        const {
            buttons = [{ text: 'OK', variant: 'primary', onClick: () => this.closeModal() }],
            width = 400,
            maxWidth = this.canvas.width * 0.9,
            closeButton = true
        } = options;

        const modalWidth = Math.min(width, maxWidth);
        const modalHeight = 300; // Will be calculated based on content

        const x = (this.canvas.width - modalWidth) / 2;
        const y = (this.canvas.height - modalHeight) / 2;

        // Draw overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw modal panel
        this.panel(x, y, modalWidth, modalHeight, {
            shadow: true,
            radius: this.tokens.radius.xl
        });

        // Draw title
        this.ctx.fillStyle = this.tokens.colors.tan700;
        this.ctx.font = `900 24px Angelinas, cursive`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText(title, x + modalWidth / 2, y + this.tokens.spacing.lg);

        // Draw content
        this.ctx.fillStyle = this.tokens.colors.tan500;
        this.ctx.font = '16px mOS, sans-serif';
        const contentY = y + this.tokens.spacing.lg + 40;
        const lines = this.wrapText(content, modalWidth - this.tokens.spacing.lg * 2, '16px mOS, sans-serif');

        lines.forEach((line, index) => {
            this.ctx.fillText(line, x + modalWidth / 2, contentY + index * 24);
        });

        // Draw buttons
        const buttonY = y + modalHeight - 60;
        const buttonWidth = 120;
        const buttonSpacing = 10;
        const totalButtonWidth = buttons.length * buttonWidth + (buttons.length - 1) * buttonSpacing;
        let buttonX = x + (modalWidth - totalButtonWidth) / 2;

        buttons.forEach((btn, index) => {
            const buttonId = `modal-button-${index}`;
            this.button(
                buttonId,
                buttonX,
                buttonY,
                buttonWidth,
                40,
                btn.text,
                {
                    variant: btn.variant || 'secondary',
                    onClick: btn.onClick
                }
            );
            buttonX += buttonWidth + buttonSpacing;
        });

        this.activeModal = { x, y, width: modalWidth, height: modalHeight };
    }

    /**
     * Close the current modal
     */
    closeModal() {
        this.activeModal = null;
    }

    /**
     * Wrap text to fit within a specified width
     */
    wrapText(text, maxWidth, font) {
        this.ctx.save();
        this.ctx.font = font;

        const words = text.split(' ');
        const lines = [];
        let currentLine = '';

        words.forEach(word => {
            const testLine = currentLine + word + ' ';
            const metrics = this.ctx.measureText(testLine);

            if (metrics.width > maxWidth && currentLine !== '') {
                lines.push(currentLine.trim());
                currentLine = word + ' ';
            } else {
                currentLine = testLine;
            }
        });

        if (currentLine !== '') {
            lines.push(currentLine.trim());
        }

        this.ctx.restore();
        return lines;
    }

    /**
     * Draw a rounded rectangle path
     */
    roundRect(x, y, width, height, radius) {
        if (width < 2 * radius) radius = width / 2;
        if (height < 2 * radius) radius = height / 2;

        this.ctx.moveTo(x + radius, y);
        this.ctx.arcTo(x + width, y, x + width, y + height, radius);
        this.ctx.arcTo(x + width, y + height, x, y + height, radius);
        this.ctx.arcTo(x, y + height, x, y, radius);
        this.ctx.arcTo(x, y, x + width, y, radius);
        this.ctx.closePath();
    }

    /**
     * Adjust color brightness
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

    /**
     * Handle canvas click events
     */
    handleClick(x, y) {
        // Check if clicking on a button
        for (const [id, button] of this.buttons) {
            if (!button.disabled && this.isPointInRect(x, y, button.bounds)) {
                if (button.callback) {
                    button.callback();
                }
                return true;
            }
        }

        // Check if clicking outside modal to close
        if (this.activeModal) {
            const modal = this.activeModal;
            if (!this.isPointInRect(x, y, modal)) {
                this.closeModal();
                return true;
            }
        }

        return false;
    }

    /**
     * Clear all buttons (call at start of frame)
     */
    clearButtons() {
        this.buttons.clear();
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GalleryUI };
}
