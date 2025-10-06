/**
 * Level 1: Greeting Hall - Carnegie's Routing Challenge
 *
 * Teaches: Input classification through visitor routing
 * Mentor: Andrew Carnegie (telegraph messenger, library builder)
 * Mechanic: Drag visitors to correct doors based on their needs
 */

class GreetingHall {
    constructor(engine, ui, audio, particles) {
        this.engine = engine;
        this.ui = ui;
        this.audio = audio;
        this.particles = particles;

        // Level state
        this.tutorialActive = true;
        this.tutorialStep = 0;
        this.visitorsServed = 0;
        this.visitorGoal = 25;
        this.score = 0;
        this.combo = 0;
        this.maxCombo = 0;
        this.paused = false;
        this.restartButtonBounds = null;
        this.pauseButtonBounds = null;

        // Visitor types (teaching classification)
        this.visitorTypes = [
            { type: 'scholar', need: 'research', icon: '📚', color: '#3498db', door: 0 },
            { type: 'child', need: 'learning', icon: '🎨', color: '#e74c3c', door: 1 },
            { type: 'tourist', need: 'tour', icon: '📸', color: '#f39c12', door: 2 },
            { type: 'artist', need: 'inspiration', icon: '🖼️', color: '#9b59b6', door: 3 },
            { type: 'elder', need: 'rest', icon: '☕', color: '#95a5a6', door: 4 },
            { type: 'default', need: 'general', icon: '👤', color: '#2ecc71', door: 5 }
        ];

        // Doors (6 sections of the hall)
        this.doors = [
            { x: 100, y: 500, label: 'Archives', need: 'research', color: '#3498db' },
            { x: 230, y: 500, label: 'Education\nWing', need: 'learning', color: '#e74c3c' },
            { x: 360, y: 500, label: 'Guided\nTours', need: 'tour', color: '#f39c12' },
            { x: 490, y: 500, label: 'Museum', need: 'inspiration', color: '#9b59b6' },
            { x: 620, y: 500, label: 'Cafe', need: 'rest', color: '#95a5a6' },
            { x: 750, y: 500, label: 'General\nAdmission', need: 'general', color: '#2ecc71' }
        ];

        // Carnegie spirit NPC
        this.carnegie = {
            x: 400,
            y: 100,
            visible: false,
            message: '',
            messageTimer: 0
        };

        // Spawn timer
        this.spawnTimer = 0;
        this.spawnInterval = 1000; // 1 second start (gets faster quickly!)
        this.minSpawnInterval = 500; // Minimum 0.5 seconds
        this.waveMode = false; // Spawn 2 at a time when true
        this.maxVisitorsOnScreen = 8; // Game over if too many visitors pile up

        // Tutorial messages
        this.tutorialMessages = [
            "Welcome to the Greeting Hall! I'm Andrew Carnegie.",
            "In 1850, I was a telegraph messenger. I learned to route messages fast!",
            "Now you'll help route visitors to the right doors based on their needs.",
            "Watch for the icon above each visitor - it shows what they need.",
            "Drag them to the matching door. Speed and accuracy both matter!",
            "Let's practice! Here comes your first visitor..."
        ];
    }

    init() {
        // Store door sprites for rendering
        this.doorSprites = [];

        // Create doors
        this.doors.forEach((door, index) => {
            // Capture visitor type for this door
            const visitorType = this.visitorTypes.find(v => v.need === door.need);

            const doorSprite = {
                x: door.x,
                y: door.y,
                radius: 35,
                color: door.color,
                label: door.label,
                need: door.need,
                isDoor: true,
                doorIndex: index,
                visitorIcon: visitorType ? visitorType.icon : ''
            };

            this.doorSprites.push(doorSprite);
        });

        // Show Carnegie
        this.carnegie.visible = true;
        this.showTutorial();
    }

    showTutorial() {
        if (this.tutorialStep < this.tutorialMessages.length) {
            const message = this.tutorialMessages[this.tutorialStep];
            this.carnegie.message = message;
            this.carnegie.messageTimer = 5000; // 5 seconds per message
            this.ui.showMessage(message, 5.0);
            this.tutorialStep++;
        } else {
            this.tutorialActive = false;
            this.startLevel();
        }
    }

    startLevel() {
        this.ui.showMessage('Level started! Route visitors to their doors!', 2.0);
        this.spawnVisitor();
    }

    spawnVisitor(offsetX = 0) {
        const visitorData = this.visitorTypes[Math.floor(Math.random() * this.visitorTypes.length)];
        const spawnX = 400 + offsetX;
        const visitor = ModernSpriteFactory.createVisitor(spawnX, 50, visitorData.type);

        // Add visitor-specific data
        visitor.visitorNeed = visitorData.need;
        visitor.visitorIcon = visitorData.icon;
        visitor.correctDoor = visitorData.door;
        visitor.spawnTime = Date.now();
        visitor.isVisitor = true;
        visitor.moveSpeed = 30; // pixels per second downward

        // Add random drift direction
        visitor.driftX = (Math.random() - 0.5) * 60; // Random horizontal drift -30 to +30 px/s

        // Override update to move visitor down AND spread out
        const originalUpdate = visitor.update;
        visitor.update = function(dt) {
            if (originalUpdate) originalUpdate.call(this, dt);

            // Move down slowly (emulate walking into the hall)
            this.y += this.moveSpeed * dt;

            // Drift randomly left/right as they walk
            this.x += this.driftX * dt;

            // Keep visitors on screen (bounce off edges)
            if (this.x < 50) {
                this.x = 50;
                this.driftX = Math.abs(this.driftX);
            }
            if (this.x > 800) {
                this.x = 800;
                this.driftX = -Math.abs(this.driftX);
            }

            // Slow down as they approach door area (but keep moving)
            if (this.y > 450) {
                this.moveSpeed = 10; // Slower at destination area
            }
        };

        // Override render to show need icon
        const originalRender = visitor.render;
        visitor.render = function(ctx) {
            originalRender.call(this, ctx);

            // Show need icon above visitor
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(this.visitorIcon, this.x, this.y - 40);
        };

        this.engine.addEntity(visitor);
        this.particles.emitSparkles(spawnX, 50);
        this.audio.playSFX('pickup');
    }

    spawnNextVisitor() {
        // Check if we should spawn in waves (2 at once)
        if (this.waveMode && this.visitorsServed < this.visitorGoal) {
            this.spawnVisitor(-50); // Left visitor
            this.spawnVisitor(50);  // Right visitor
        } else {
            this.spawnVisitor(); // Single visitor
        }
    }

    checkVisitorAtDoor(visitor, x, y) {
        // Check if visitor is over a door marker
        for (let i = 0; i < this.doorSprites.length; i++) {
            const door = this.doorSprites[i];
            const dx = x - door.x;
            const dy = y - door.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Check if within door radius (circles now, not rectangles)
            if (distance < door.radius + 20) {
                // Visitor at this door
                const correct = visitor.correctDoor === i;
                const timeBonus = this.calculateTimeBonus(visitor.spawnTime);

                if (correct) {
                    // Correct door!
                    this.handleCorrectPlacement(visitor, door, timeBonus);
                } else {
                    // Wrong door
                    this.handleWrongPlacement(visitor, door);
                }

                return true;
            }
        }

        return false;
    }

    calculateTimeBonus(spawnTime) {
        const elapsed = Date.now() - spawnTime;
        if (elapsed < 2000) return 50; // Super fast!
        if (elapsed < 4000) return 30; // Fast
        if (elapsed < 6000) return 10; // Normal
        return 0; // Slow
    }

    handleCorrectPlacement(visitor, door, timeBonus) {
        this.visitorsServed++;
        this.combo++;
        this.maxCombo = Math.max(this.maxCombo, this.combo);

        const points = 100 + timeBonus + (this.combo * 10);
        this.score += points;
        this.ui.addScore(points);

        // Speed up spawn interval on success (gets faster!)
        this.spawnInterval = Math.max(this.minSpawnInterval, this.spawnInterval - 50);

        // Enable wave mode after 3 visitors
        if (this.visitorsServed === 3) {
            this.waveMode = true;
            this.ui.showMessage('Wave Mode! Two visitors at once!', 2.5);
        }

        // Visual feedback
        this.particles.emitHearts(door.x, door.y);
        this.audio.playSFX('drop');

        // Combo message
        if (this.combo >= 3) {
            this.ui.showMessage(`${this.combo}x Combo! +${this.combo * 10} bonus`, 1.5);
        }

        // Remove visitor
        this.engine.removeEntity(visitor);

        // Carnegie encouragement at milestones
        if (this.visitorsServed % 7 === 0) {
            this.showCarnegieMessage();
        }

        // Check victory
        if (this.visitorsServed >= this.visitorGoal) {
            this.handleVictory();
        } else {
            // Spawn next visitor(s)
            setTimeout(() => this.spawnNextVisitor(), this.spawnInterval);
        }
    }

    handleWrongPlacement(visitor, door) {
        // Reset combo
        this.combo = 0;

        // Small penalty
        this.score = Math.max(0, this.score - 20);

        // Visual feedback
        this.particles.emitTrail(door.x, door.y, '#e74c3c');
        this.audio.playSFX('pickup'); // Different sound would be better

        this.ui.showMessage('Wrong door! Try again.', 1.5);

        // Don't remove visitor, let player retry
    }

    showCarnegieMessage() {
        const messages = [
            "Excellent routing! Just like telegraph messages!",
            "You're learning fast! Libraries are built on service.",
            "Speed matters, but accuracy matters more!",
            "Keep going! Each visitor finds their place.",
            "You understand classification! This is AI thinking."
        ];

        const message = messages[Math.floor(Math.random() * messages.length)];
        this.carnegie.message = message;
        this.carnegie.messageTimer = 3000;
        this.ui.showMessage(`Carnegie: ${message}`, 3.0);
    }

    handleVictory() {
        this.ui.showMessage(`Level Complete! ${this.visitorsServed} visitors served!`, 5.0);

        // Final Carnegie message
        this.carnegie.message = "You've mastered visitor routing! This is how AI learns to classify inputs.";
        this.carnegie.messageTimer = 8000;

        // Show stats
        setTimeout(() => {
            this.ui.showMessage(`Score: ${this.score} | Max Combo: ${this.maxCombo}x | Ready for Level 2!`, 5.0);
        }, 2000);
    }

    update(dt) {
        // Skip updates when paused
        if (this.paused) {
            return;
        }

        // Count visitors on screen
        const visitorsOnScreen = this.engine.entities.filter(e => e.isVisitor).length;

        // Game over if too many visitors pile up
        if (visitorsOnScreen > this.maxVisitorsOnScreen && !this.tutorialActive) {
            this.handleGameOver();
            return;
        }

        // Update spawn timer if not in tutorial and not at goal
        if (!this.tutorialActive && this.visitorsServed < this.visitorGoal) {
            this.spawnTimer += dt * 1000;
        }

        // Update Carnegie message timer
        if (this.carnegie.messageTimer > 0) {
            this.carnegie.messageTimer -= dt * 1000;
            if (this.carnegie.messageTimer <= 0) {
                this.carnegie.message = '';
            }
        }
    }

    handleGameOver() {
        this.ui.showMessage('Hall is full! Too many waiting visitors!', 5.0);

        // Stop spawning
        this.visitorGoal = this.visitorsServed;

        // Show game over message
        this.carnegie.message = "The hall filled up! Route visitors faster to succeed.";
        this.carnegie.messageTimer = 8000;

        setTimeout(() => {
            this.ui.showMessage('Click Restart to try again!', 5.0);
        }, 2000);
    }

    render(ctx) {
        // Render door markers (icons only, no circles)
        this.doorSprites.forEach(door => {
            // Icon (large and centered)
            if (door.visitorIcon) {
                ctx.font = '50px Arial';  // Slightly larger since no circle
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                // Add subtle glow for visibility
                ctx.shadowColor = door.color;
                ctx.shadowBlur = 10;
                ctx.fillText(door.visitorIcon, door.x, door.y);
                ctx.shadowBlur = 0;  // Reset shadow
            }
        });

        // Render Carnegie if visible
        if (this.carnegie.visible) {
            // Carnegie icon (no circle, just icon with glow)
            ctx.font = '50px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Subtle glow
            ctx.shadowColor = '#8B4513';
            ctx.shadowBlur = 15;
            ctx.fillText('📜', this.carnegie.x, this.carnegie.y);
            ctx.shadowBlur = 0;

            // Message bubble
            if (this.carnegie.message) {
                const lines = this.wrapText(ctx, this.carnegie.message, 300);
                const bubbleHeight = lines.length * 20 + 20;

                ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
                ctx.strokeStyle = '#8B4513';
                ctx.lineWidth = 2;
                this.roundRect(ctx, this.carnegie.x - 160, this.carnegie.y - 80, 320, bubbleHeight, 10);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = '#2C3E50';
                ctx.font = '14px Arial';
                ctx.textAlign = 'center';
                lines.forEach((line, i) => {
                    ctx.fillText(line, this.carnegie.x, this.carnegie.y - 70 + (i * 20));
                });
            }
        }

        // On-screen restart button (upper left corner) - Level 2 style
        const restartBtnX = 20;
        const restartBtnY = 20;
        const restartBtnW = 60;
        const restartBtnH = 50;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        this.roundRect(ctx, restartBtnX, restartBtnY, restartBtnW, restartBtnH, 10);
        ctx.fill();
        ctx.stroke();

        // Restart icon (circular arrow)
        ctx.strokeStyle = '#FFF';
        ctx.fillStyle = '#FFF';
        ctx.lineWidth = 3;
        let centerX = restartBtnX + restartBtnW / 2;
        let centerY = restartBtnY + restartBtnH / 2;

        ctx.beginPath();
        ctx.arc(centerX, centerY, 12, 0.5, Math.PI * 2 - 0.5);
        ctx.stroke();

        // Arrow head
        ctx.beginPath();
        ctx.moveTo(centerX + 12, centerY - 3);
        ctx.lineTo(centerX + 12, centerY + 5);
        ctx.lineTo(centerX + 18, centerY);
        ctx.closePath();
        ctx.fill();

        // Store restart button bounds
        this.restartButtonBounds = { x: restartBtnX, y: restartBtnY, w: restartBtnW, h: restartBtnH };

        // On-screen pause button (upper right corner) - Level 2 style
        const pauseBtnX = 850 - 80;  // canvas width - 80
        const pauseBtnY = 20;
        const pauseBtnW = 60;
        const pauseBtnH = 50;

        ctx.fillStyle = this.paused ? '#4CAF50' : 'rgba(0, 0, 0, 0.6)';
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        this.roundRect(ctx, pauseBtnX, pauseBtnY, pauseBtnW, pauseBtnH, 10);
        ctx.fill();
        ctx.stroke();

        // Pause/Play icon
        ctx.fillStyle = '#FFF';
        if (this.paused) {
            // Play triangle
            ctx.beginPath();
            ctx.moveTo(pauseBtnX + 20, pauseBtnY + 12);
            ctx.lineTo(pauseBtnX + 20, pauseBtnY + 38);
            ctx.lineTo(pauseBtnX + 45, pauseBtnY + 25);
            ctx.closePath();
            ctx.fill();
        } else {
            // Pause bars
            ctx.fillRect(pauseBtnX + 18, pauseBtnY + 12, 8, 26);
            ctx.fillRect(pauseBtnX + 34, pauseBtnY + 12, 8, 26);
        }

        // Store pause button bounds
        this.pauseButtonBounds = { x: pauseBtnX, y: pauseBtnY, w: pauseBtnW, h: pauseBtnH };

        // Level title and stats - moved to center-left area
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 24px Kalam, cursive';
        ctx.textAlign = 'left';
        ctx.fillText('Level 1', 100, 35);

        // Stats to the right of title
        const visitorsOnScreen = this.engine.entities.filter(e => e.isVisitor).length;

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 16px Arial';
        ctx.fillText(`Served: ${this.visitorsServed}/${this.visitorGoal}`, 200, 30);

        // Show waiting visitors (warn if getting full)
        const waitingColor = visitorsOnScreen > 6 ? '#e74c3c' : '#FFFFFF';
        ctx.fillStyle = waitingColor;
        ctx.fillText(`Waiting: ${visitorsOnScreen}/${this.maxVisitorsOnScreen}`, 200, 50);

        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`Combo: ${this.combo}x`, 350, 40);

        // Paused overlay
        if (this.paused) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(0, 0, 850, 600);

            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 48px Kalam, cursive';
            ctx.textAlign = 'center';
            ctx.fillText('PAUSED', 425, 300);

            ctx.font = '20px Kalam, cursive';
            ctx.fillText('Click anywhere to resume', 425, 340);
        }
    }

    wrapText(ctx, text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
            const testLine = currentLine + ' ' + words[i];
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth) {
                lines.push(currentLine);
                currentLine = words[i];
            } else {
                currentLine = testLine;
            }
        }
        lines.push(currentLine);
        return lines;
    }

    roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    // Input handlers
    onDragEnd(visitor, x, y) {
        if (visitor.isVisitor) {
            const placed = this.checkVisitorAtDoor(visitor, x, y);
            if (!placed) {
                this.ui.showMessage('Drag visitors to doors!', 1.5);
            }
        }
    }
}
