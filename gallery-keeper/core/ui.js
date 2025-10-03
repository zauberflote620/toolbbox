/**
 * Gallery Keeper - UI Framework
 *
 * Handles:
 * - Score display
 * - Pause menu
 * - Settings panel
 * - Simple button system
 * - HUD elements
 */

class UI {
    constructor(canvas, engine, audioManager) {
        this.canvas = canvas;
        this.engine = engine;
        this.audio = audioManager;

        // UI state
        this.showPauseMenu = false;
        this.showSettings = false;

        // Game state
        this.score = 0;
        this.level = 1;
        this.message = '';
        this.messageTime = 0;

        // Button regions (for click detection)
        this.buttons = [];
    }

    /**
     * Update UI state
     * @param {number} dt - Delta time
     */
    update(dt) {
        // Fade out messages
        if (this.messageTime > 0) {
            this.messageTime -= dt;
        }
    }

    /**
     * Render UI overlays
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        this.renderHUD(ctx);

        if (this.showPauseMenu) {
            this.renderPauseMenu(ctx);
        }

        if (this.showSettings) {
            this.renderSettings(ctx);
        }

        if (this.messageTime > 0) {
            this.renderMessage(ctx);
        }
    }

    /**
     * Render HUD (score, level, controls)
     */
    renderHUD(ctx) {
        const width = this.canvas.width;

        ctx.save();

        // Score (top-left)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(100, 5, 200, 30);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Score: ${this.score}`, 110, 27);

        // Level (top-center)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(width / 2 - 60, 5, 120, 30);

        ctx.fillStyle = '#FFD700';
        ctx.textAlign = 'center';
        ctx.fillText(`Level ${this.level}`, width / 2, 27);

        // Pause button (top-right)
        const pauseBtn = { x: width - 70, y: 5, width: 60, height: 30, label: 'Pause' };
        this.drawButton(ctx, pauseBtn);

        // Sound toggle (top-right, next to pause)
        const soundBtn = {
            x: width - 140,
            y: 5,
            width: 60,
            height: 30,
            label: this.audio.isMuted() ? '🔇' : '🔊'
        };
        this.drawButton(ctx, soundBtn);

        // Register buttons for click detection
        this.buttons = [pauseBtn, soundBtn];

        ctx.restore();
    }

    /**
     * Render pause menu
     */
    renderPauseMenu(ctx) {
        const width = this.canvas.width;
        const height = this.canvas.height;

        ctx.save();

        // Dim background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, width, height);

        // Menu box
        const menuX = width / 2 - 150;
        const menuY = height / 2 - 120;
        const menuWidth = 300;
        const menuHeight = 240;

        ctx.fillStyle = '#2C3E50';
        ctx.fillRect(menuX, menuY, menuWidth, menuHeight);

        ctx.strokeStyle = '#4ECDC4';
        ctx.lineWidth = 3;
        ctx.strokeRect(menuX, menuY, menuWidth, menuHeight);

        // Title
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 28px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Paused', width / 2, menuY + 50);

        // Buttons
        const resumeBtn = {
            x: width / 2 - 100,
            y: menuY + 90,
            width: 200,
            height: 40,
            label: 'Resume'
        };
        const settingsBtn = {
            x: width / 2 - 100,
            y: menuY + 145,
            width: 200,
            height: 40,
            label: 'Settings'
        };
        const mainMenuBtn = {
            x: width / 2 - 100,
            y: menuY + 200,
            width: 200,
            height: 40,
            label: 'Main Menu'
        };

        this.drawButton(ctx, resumeBtn, '#4ECDC4');
        this.drawButton(ctx, settingsBtn, '#45B7D1');
        this.drawButton(ctx, mainMenuBtn, '#F44336');

        this.buttons = [resumeBtn, settingsBtn, mainMenuBtn];

        ctx.restore();
    }

    /**
     * Render settings panel
     */
    renderSettings(ctx) {
        const width = this.canvas.width;
        const height = this.canvas.height;

        ctx.save();

        // Dim background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, width, height);

        // Settings box
        const menuX = width / 2 - 150;
        const menuY = height / 2 - 150;
        const menuWidth = 300;
        const menuHeight = 300;

        ctx.fillStyle = '#2C3E50';
        ctx.fillRect(menuX, menuY, menuWidth, menuHeight);

        ctx.strokeStyle = '#45B7D1';
        ctx.lineWidth = 3;
        ctx.strokeRect(menuX, menuY, menuWidth, menuHeight);

        // Title
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 28px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Settings', width / 2, menuY + 50);

        // Volume sliders (simplified for now)
        ctx.font = '16px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('SFX Volume:', menuX + 20, menuY + 100);
        ctx.fillText('Music Volume:', menuX + 20, menuY + 150);

        // Close button
        const closeBtn = {
            x: width / 2 - 60,
            y: menuY + 240,
            width: 120,
            height: 40,
            label: 'Close'
        };
        this.drawButton(ctx, closeBtn, '#4ECDC4');

        this.buttons = [closeBtn];

        ctx.restore();
    }

    /**
     * Render temporary message
     */
    renderMessage(ctx) {
        if (!this.message) return;

        const width = this.canvas.width;
        const height = this.canvas.height;

        ctx.save();

        // Calculate alpha based on remaining time
        const alpha = Math.min(1, this.messageTime / 0.5);

        ctx.globalAlpha = alpha;

        // Message box
        const boxWidth = 400;
        const boxHeight = 80;
        const boxX = width / 2 - boxWidth / 2;
        const boxY = height / 2 - boxHeight / 2;

        ctx.fillStyle = '#2C3E50';
        ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

        ctx.strokeStyle = '#4ECDC4';
        ctx.lineWidth = 3;
        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

        // Message text
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.message, width / 2, height / 2);

        ctx.restore();
    }

    /**
     * Draw button
     */
    drawButton(ctx, btn, color = '#4ECDC4') {
        ctx.fillStyle = color;
        ctx.fillRect(btn.x, btn.y, btn.width, btn.height);

        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.strokeRect(btn.x, btn.y, btn.width, btn.height);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(btn.label, btn.x + btn.width / 2, btn.y + btn.height / 2);
    }

    /**
     * Check if click hit a button
     */
    handleClick(x, y) {
        for (let btn of this.buttons) {
            if (x >= btn.x && x <= btn.x + btn.width &&
                y >= btn.y && y <= btn.y + btn.height) {
                this.onButtonClick(btn.label);
                return true;
            }
        }
        return false;
    }

    /**
     * Handle button click
     */
    onButtonClick(label) {
        this.audio.playSFX('click');

        switch (label) {
            case 'Pause':
                this.togglePause();
                break;
            case '🔊':
            case '🔇':
                this.audio.toggleMute();
                break;
            case 'Resume':
                this.togglePause();
                break;
            case 'Settings':
                this.showSettings = true;
                this.showPauseMenu = false;
                break;
            case 'Close':
                this.showSettings = false;
                break;
            case 'Main Menu':
                console.log('Return to main menu (not implemented)');
                break;
        }
    }

    /**
     * Toggle pause menu
     */
    togglePause() {
        this.showPauseMenu = !this.showPauseMenu;
        this.engine.paused = this.showPauseMenu;
    }

    /**
     * Update score
     */
    addScore(points) {
        this.score += points;
        this.audio.playSFX('success');
    }

    /**
     * Set level
     */
    setLevel(level) {
        this.level = level;
    }

    /**
     * Show temporary message
     */
    showMessage(text, duration = 2.0) {
        this.message = text;
        this.messageTime = duration;
    }

    /**
     * Reset UI state
     */
    reset() {
        this.score = 0;
        this.level = 1;
        this.message = '';
        this.messageTime = 0;
        this.showPauseMenu = false;
        this.showSettings = false;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UI;
}
