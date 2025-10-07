/**
 * Rough UI Component Library for Gallery Keeper
 *
 * A modern, hand-drawn UI system using Rough.js for consistent Excalidraw-style visuals
 * across all levels. Implements golden ratio design principles for harmonious layouts.
 *
 * Usage:
 *   1. Include Rough.js CDN in HTML
 *   2. Include this file after Rough.js
 *   3. Initialize: const ui = new RoughUI(canvas, ctx);
 *   4. Use components: ui.button(...), ui.panel(...), etc.
 */

// Golden Ratio constant
const PHI = 1.618;
const BASE_UNIT = 8;

// Design system constants
const COLORS = {
    background: {
        cream: '#FFF9DB',
        lightGray: '#F5F5F5',
        darkGray: '#2C2C2C',
        canvas: '#F8F9FA'
    },
    primary: {
        black: '#1E1E1E',
        sketch: '#495057',
        accent: '#5F3DC4',
        accentHover: '#7048E8'
    },
    feedback: {
        success: '#51CF66',
        successHover: '#40C057',
        warning: '#FFD43B',
        error: '#E22237',  // From Excalidraw palette
        info: '#339AF0',
        infoHover: '#228BE6'
    },
    neutral: {
        gray100: '#F8F9FA',
        gray200: '#E9ECEF',
        gray300: '#DEE2E6',
        gray600: '#868E96',
        gray700: '#495057',
        gray900: '#212529'
    }
};

// Spacing system based on golden ratio
const SPACING = {
    xs: BASE_UNIT,                    // 8px
    sm: Math.round(BASE_UNIT * PHI),  // 13px
    md: Math.round(BASE_UNIT * PHI * PHI),  // 21px
    lg: Math.round(BASE_UNIT * Math.pow(PHI, 3)), // 34px
    xl: Math.round(BASE_UNIT * Math.pow(PHI, 4))  // 55px
};

// Typography
const FONTS = {
    heading: '"mOS", -apple-system, sans-serif',  // mOS Black for UI
    body: '"mOS", -apple-system, system-ui, sans-serif',  // mOS Black for body
    mono: '"Courier New", "Consolas", monospace',
    display: '"Angelinas", cursive'  // Angelinas for handwriting/script
};

/**
 * Main Rough UI class
 */
class RoughUI {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;

        // Initialize Rough.js canvas
        this.rc = rough.canvas(canvas);

        // Track interactive elements for hit testing
        this.buttons = new Map();
        this.hoveredButton = null;
    }

    /**
     * Draw a rough-styled button
     * Returns bounds for hit testing
     */
    button(id, x, y, width, height, text, options = {}) {
        const {
            variant = 'primary',  // primary, secondary, success, warning, danger
            hovered = false,
            pressed = false,
            disabled = false,
            icon = null,
            fontSize = 18,
            roughness = 1.2
        } = options;

        // Determine colors based on variant and state
        let bgColor, textColor, borderColor;

        if (disabled) {
            bgColor = COLORS.neutral.gray300;
            textColor = COLORS.neutral.gray600;
            borderColor = COLORS.neutral.gray600;
        } else {
            switch (variant) {
                case 'primary':
                    bgColor = hovered ? COLORS.primary.accentHover : COLORS.primary.accent;
                    textColor = '#FFFFFF';
                    borderColor = COLORS.primary.black;
                    break;
                case 'secondary':
                    bgColor = hovered ? COLORS.neutral.gray600 : COLORS.neutral.gray700;
                    textColor = '#FFFFFF';
                    borderColor = COLORS.primary.black;
                    break;
                case 'success':
                    bgColor = hovered ? COLORS.feedback.successHover : COLORS.feedback.success;
                    textColor = '#FFFFFF';
                    borderColor = COLORS.primary.black;
                    break;
                case 'warning':
                    bgColor = COLORS.feedback.warning;
                    textColor = COLORS.primary.black;
                    borderColor = COLORS.primary.black;
                    break;
                case 'danger':
                    bgColor = COLORS.feedback.error;
                    textColor = '#FFFFFF';
                    borderColor = COLORS.primary.black;
                    break;
                default:
                    bgColor = COLORS.primary.accent;
                    textColor = '#FFFFFF';
                    borderColor = COLORS.primary.black;
            }
        }

        // Apply pressed offset (subtle, only when clicked)
        const offsetX = pressed ? 2 : 0;
        const offsetY = pressed ? 2 : 0;

        // Draw shadow FIRST (behind button) - only if not pressed
        if (!pressed && !disabled) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
            this.ctx.fillRect(x + 3, y + 3, width, height);
        }

        // Draw button rectangle with Rough.js - STABLE, no seed randomization
        this.rc.rectangle(x + offsetX, y + offsetY, width, height, {
            fill: bgColor,
            fillStyle: 'solid',
            roughness: roughness,
            stroke: borderColor,
            strokeWidth: hovered ? 3 : 2.5,
            fillWeight: 2,
            seed: 1 // Fixed seed for stable rendering
        });

        // Draw text
        this.ctx.fillStyle = textColor;
        this.ctx.font = `bold ${fontSize}px ${FONTS.heading}`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        // Calculate text position (adjust for icon if present)
        const textX = x + offsetX + width / 2 + (icon ? 10 : 0);
        const textY = y + offsetY + height / 2;

        // Draw icon if provided
        if (icon && !disabled) {
            this.ctx.font = `${fontSize * 1.2}px ${FONTS.heading}`;
            this.ctx.fillText(icon, x + offsetX + 20, textY);
        }

        this.ctx.font = `bold ${fontSize}px ${FONTS.heading}`;
        this.ctx.fillText(text, textX, textY);

        // Store button bounds for hit testing
        const bounds = { x, y, width, height, id, disabled };
        this.buttons.set(id, bounds);

        return bounds;
    }

    /**
     * Draw a rough-styled panel/box
     */
    panel(x, y, width, height, options = {}) {
        const {
            fill = COLORS.background.cream,
            stroke = COLORS.primary.sketch,
            strokeWidth = 3,
            roughness = 2,
            fillStyle = 'hachure',
            hachureGap = 8,
            cornerBrackets = false
        } = options;

        // Draw main panel - STABLE with fixed seed
        this.rc.rectangle(x, y, width, height, {
            fill,
            fillStyle,
            fillWeight: 2,
            hachureGap,
            roughness,
            stroke,
            strokeWidth,
            seed: 1 // Fixed seed prevents re-drawing variations
        });

        // Draw decorative corner brackets if requested
        if (cornerBrackets) {
            const bracketSize = 20;
            const ctx = this.ctx;

            ctx.strokeStyle = stroke;
            ctx.lineWidth = strokeWidth;
            ctx.lineCap = 'round';

            // Top-left bracket
            this.drawBracket(x, y, bracketSize, 'tl');
            // Top-right bracket
            this.drawBracket(x + width, y, bracketSize, 'tr');
            // Bottom-left bracket
            this.drawBracket(x, y + height, bracketSize, 'bl');
            // Bottom-right bracket
            this.drawBracket(x + width, y + height, bracketSize, 'br');
        }
    }

    /**
     * Helper to draw corner brackets
     */
    drawBracket(x, y, size, corner) {
        const ctx = this.ctx;
        ctx.beginPath();

        switch (corner) {
            case 'tl': // top-left
                ctx.moveTo(x + size, y);
                ctx.lineTo(x, y);
                ctx.lineTo(x, y + size);
                break;
            case 'tr': // top-right
                ctx.moveTo(x - size, y);
                ctx.lineTo(x, y);
                ctx.lineTo(x, y + size);
                break;
            case 'bl': // bottom-left
                ctx.moveTo(x, y - size);
                ctx.lineTo(x, y);
                ctx.lineTo(x + size, y);
                break;
            case 'br': // bottom-right
                ctx.moveTo(x, y - size);
                ctx.lineTo(x, y);
                ctx.lineTo(x - size, y);
                break;
        }

        ctx.stroke();
    }

    /**
     * Draw a progress bar with hand-drawn style
     */
    progressBar(x, y, width, height, progress, options = {}) {
        const {
            fillColor = COLORS.feedback.success,
            bgColor = COLORS.neutral.gray200,
            borderColor = COLORS.primary.sketch,
            showPercentage = true,
            roughness = 1.5
        } = options;

        // Clamp progress between 0 and 1
        progress = Math.max(0, Math.min(1, progress));

        // Draw background bar - STABLE
        this.rc.rectangle(x, y, width, height, {
            fill: bgColor,
            fillStyle: 'solid',
            roughness,
            stroke: borderColor,
            strokeWidth: 2,
            seed: 1
        });

        // Draw progress fill - STABLE
        if (progress > 0) {
            const fillWidth = width * progress;
            this.rc.rectangle(x, y, fillWidth, height, {
                fill: fillColor,
                fillStyle: 'solid',
                roughness,
                stroke: borderColor,
                strokeWidth: 2,
                seed: 2 // Different seed from bg, but still stable
            });
        }

        // Draw percentage text if requested
        if (showPercentage) {
            this.ctx.fillStyle = COLORS.primary.black;
            this.ctx.font = `bold 14px ${FONTS.body}`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(`${Math.round(progress * 100)}%`, x + width / 2, y + height / 2);
        }
    }

    /**
     * Draw a dialog/modal window
     */
    dialog(x, y, width, height, title, content, buttons = [], options = {}) {
        const {
            closable = true,
            roughness = 1.5
        } = options;

        // Semi-transparent overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Dialog background - STABLE
        this.panel(x, y, width, height, {
            fill: COLORS.background.cream,
            stroke: COLORS.primary.black,
            strokeWidth: 4,
            roughness: roughness * 1.2,
            cornerBrackets: true
        });

        // Title bar - STABLE
        const titleHeight = SPACING.xl;
        this.rc.rectangle(x, y, width, titleHeight, {
            fill: COLORS.primary.accent,
            fillStyle: 'solid',
            roughness,
            stroke: COLORS.primary.black,
            strokeWidth: 3,
            seed: 10
        });

        // Title text
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = `bold 24px ${FONTS.heading}`;
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(title, x + SPACING.md, y + titleHeight / 2);

        // Close button if closable
        if (closable) {
            const closeX = x + width - titleHeight;
            const closeY = y;
            this.button('dialog_close', closeX, closeY, titleHeight, titleHeight, '×', {
                variant: 'danger',
                fontSize: 28
            });
        }

        // Content area
        const contentY = y + titleHeight + SPACING.md;
        const contentHeight = height - titleHeight - SPACING.xl - SPACING.md;

        this.ctx.fillStyle = COLORS.primary.black;
        this.ctx.font = `16px ${FONTS.body}`;
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';

        // Wrap text content
        this.wrapText(content, x + SPACING.md, contentY, width - SPACING.md * 2, 24);

        // Draw buttons at bottom
        if (buttons.length > 0) {
            const buttonY = y + height - SPACING.lg;
            const buttonWidth = Math.round((width - SPACING.md * (buttons.length + 1)) / buttons.length);
            const buttonHeight = SPACING.lg - SPACING.sm;

            buttons.forEach((btn, i) => {
                const btnX = x + SPACING.md + (buttonWidth + SPACING.md) * i;
                this.button(
                    `dialog_btn_${i}`,
                    btnX,
                    buttonY - buttonHeight,
                    buttonWidth,
                    buttonHeight,
                    btn.text,
                    {
                        variant: btn.variant || 'primary',
                        hovered: btn.hovered || false
                    }
                );
            });
        }
    }

    /**
     * Wrap text to fit within a width
     */
    wrapText(text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        let currentY = y;

        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = this.ctx.measureText(testLine);
            const testWidth = metrics.width;

            if (testWidth > maxWidth && n > 0) {
                this.ctx.fillText(line, x, currentY);
                line = words[n] + ' ';
                currentY += lineHeight;
            } else {
                line = testLine;
            }
        }
        this.ctx.fillText(line, x, currentY);
    }

    /**
     * Draw a score/stats display
     */
    scorePanel(x, y, label, value, options = {}) {
        const {
            width = 150,
            height = 60,
            icon = null,
            variant = 'default'
        } = options;

        // Determine color based on variant
        let fillColor;
        switch (variant) {
            case 'success':
                fillColor = COLORS.feedback.success;
                break;
            case 'warning':
                fillColor = COLORS.feedback.warning;
                break;
            case 'danger':
                fillColor = COLORS.feedback.error;
                break;
            default:
                fillColor = COLORS.primary.accent;
        }

        // Draw panel background
        this.panel(x, y, width, height, {
            fill: fillColor + '20', // Add transparency
            stroke: fillColor,
            strokeWidth: 3,
            roughness: 1.3
        });

        // Draw label
        this.ctx.fillStyle = COLORS.primary.black;
        this.ctx.font = `14px ${FONTS.body}`;
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText(label, x + SPACING.sm, y + SPACING.xs);

        // Draw value
        this.ctx.fillStyle = fillColor;
        this.ctx.font = `bold 28px ${FONTS.heading}`;
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'bottom';

        const valueText = icon ? `${icon} ${value}` : value.toString();
        this.ctx.fillText(valueText, x + SPACING.sm, y + height - SPACING.xs);
    }

    /**
     * Draw an icon button (circular)
     */
    iconButton(id, x, y, radius, icon, options = {}) {
        const {
            variant = 'primary',
            hovered = false,
            pressed = false,
            disabled = false,
            roughness = 1.2
        } = options;

        // Determine colors
        let bgColor, iconColor, borderColor;

        if (disabled) {
            bgColor = COLORS.neutral.gray300;
            iconColor = COLORS.neutral.gray600;
            borderColor = COLORS.neutral.gray600;
        } else {
            switch (variant) {
                case 'primary':
                    bgColor = hovered ? COLORS.primary.accentHover : COLORS.primary.accent;
                    iconColor = '#FFFFFF';
                    borderColor = COLORS.primary.black;
                    break;
                case 'secondary':
                    bgColor = hovered ? COLORS.neutral.gray600 : COLORS.neutral.gray700;
                    iconColor = '#FFFFFF';
                    borderColor = COLORS.primary.black;
                    break;
                default:
                    bgColor = COLORS.primary.accent;
                    iconColor = '#FFFFFF';
                    borderColor = COLORS.primary.black;
            }
        }

        const offsetX = pressed ? 2 : 0;
        const offsetY = pressed ? 2 : 0;

        // Draw circle - STABLE
        this.rc.circle(x + offsetX, y + offsetY, radius * 2, {
            fill: bgColor,
            fillStyle: 'solid',
            roughness,
            stroke: borderColor,
            strokeWidth: hovered ? 3 : 2.5,
            seed: 1
        });

        // Draw icon
        this.ctx.fillStyle = iconColor;
        this.ctx.font = `${radius * 1.2}px ${FONTS.heading}`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(icon, x + offsetX, y + offsetY);

        // Store bounds for hit testing
        const bounds = {
            x: x - radius,
            y: y - radius,
            width: radius * 2,
            height: radius * 2,
            id,
            disabled,
            isCircle: true,
            centerX: x,
            centerY: y,
            radius
        };
        this.buttons.set(id, bounds);

        return bounds;
    }

    /**
     * Check if a point is over a button
     */
    hitTest(x, y) {
        for (const [id, bounds] of this.buttons) {
            if (bounds.disabled) continue;

            if (bounds.isCircle) {
                // Circle hit test
                const dx = x - bounds.centerX;
                const dy = y - bounds.centerY;
                if (dx * dx + dy * dy <= bounds.radius * bounds.radius) {
                    return id;
                }
            } else {
                // Rectangle hit test
                if (x >= bounds.x && x <= bounds.x + bounds.width &&
                    y >= bounds.y && y <= bounds.y + bounds.height) {
                    return id;
                }
            }
        }
        return null;
    }

    /**
     * Clear all stored buttons
     */
    clearButtons() {
        this.buttons.clear();
    }


    /**
     * Calculate golden ratio layout points
     */
    static goldenLayout(width, height) {
        return {
            goldenX: width / PHI,
            goldenY: height / PHI,
            goldenWidth: width / PHI,
            goldenHeight: height / PHI,
            complementX: width - (width / PHI),
            complementY: height - (height / PHI)
        };
    }

    /**
     * Get spacing value
     */
    static spacing(size) {
        return SPACING[size] || SPACING.md;
    }

    /**
     * Get color value
     */
    static color(category, shade) {
        return COLORS[category]?.[shade] || COLORS.primary.black;
    }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RoughUI, PHI, SPACING, COLORS, FONTS };
}
