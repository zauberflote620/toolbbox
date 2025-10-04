/**
 * Level 2: Arrangement Room - Bach's Harmony Challenge
 *
 * Teaches: Multi-constraint optimization through artwork arrangement
 * Mentor: Johann Sebastian Bach (composer, music director)
 *
 * Gameplay: Arrange 1-4 artworks to satisfy visitor preferences.
 * Progressive difficulty: Start with 1 artwork, gradually add more.
 * Learning: Discover that grouping similar items creates broader satisfaction.
 */

class ArrangementRoom {
    constructor(engine, ui, audio, particles) {
        this.engine = engine;
        this.ui = ui;
        this.audio = audio;
        this.particles = particles;

        // Game state
        this.round = 0;
        this.maxRounds = 20;
        this.starsEarned = 0;
        this.score = 0;

        // Artwork types with properties
        this.artworkTypes = [
            { id: 'portrait1', label: 'Portrait 1', color: '#8B4513', theme: 'people', style: 'classical' },
            { id: 'portrait2', label: 'Portrait 2', color: '#A0522D', theme: 'people', style: 'classical' },
            { id: 'landscape1', label: 'Landscape 1', color: '#228B22', theme: 'nature', style: 'classical' },
            { id: 'landscape2', label: 'Landscape 2', color: '#32CD32', theme: 'nature', style: 'classical' },
            { id: 'abstract1', label: 'Abstract 1', color: '#FF4500', theme: 'shapes', style: 'modern' },
            { id: 'abstract2', label: 'Abstract 2', color: '#FF6347', theme: 'shapes', style: 'modern' },
            { id: 'still-life1', label: 'Still Life 1', color: '#DAA520', theme: 'objects', style: 'classical' },
            { id: 'still-life2', label: 'Still Life 2', color: '#FFD700', theme: 'objects', style: 'classical' }
        ];

        // Current round artworks (which artworks are in play this round)
        this.currentArtworks = [];

        // Placed artworks (where player has positioned them)
        this.placedArtworks = [];

        // Current visitor
        this.currentVisitor = null;
        this.visitorReaction = null; // 'happy', 'neutral', 'unhappy'
        this.visitorTimer = 0;

        // Bach mentor NPC
        this.bach = {
            x: 100,
            y: 100,
            visible: true,
            message: '',
            messageTimer: 0
        };

        // Tutorial state
        this.tutorialStep = 0;
        this.tutorialMessages = [
            "Welcome to the Arrangement Room. I am Johann Sebastian Bach.",
            "I once directed concerts for audiences with many different tastes.",
            "Your task: arrange artworks to please museum visitors.",
            "Each visitor has preferences. Watch their reaction as you arrange.",
            "Green glow means happy. Yellow means neutral. Red means unhappy.",
            "We'll start simple - just one artwork. Drag it to find the best spot."
        ];

        // Gallery walls (zones where artworks can be placed)
        this.walls = [
            { id: 'left', x: 150, y: 300, width: 200, height: 300, label: 'Left Wall' },
            { id: 'center', x: 400, y: 300, width: 200, height: 300, label: 'Center Wall' },
            { id: 'right', x: 650, y: 300, width: 200, height: 300, label: 'Right Wall' }
        ];

        this.init();
    }

    init() {
        // Show Bach
        this.bach.visible = true;
        this.showTutorial();
    }

    showTutorial() {
        if (this.tutorialStep < this.tutorialMessages.length) {
            const message = this.tutorialMessages[this.tutorialStep];
            this.bach.message = message;
            this.bach.messageTimer = 5000;
            this.ui.showMessage(message, 5.0);
            this.tutorialStep++;

            // Auto-advance to next tutorial message after delay
            setTimeout(() => {
                this.showTutorial();
            }, 5000);
        } else if (this.tutorialStep === this.tutorialMessages.length) {
            // Tutorial complete, start first round
            this.tutorialStep++;
            this.startNextRound();
        }
    }

    startNextRound() {
        this.round++;

        if (this.round > this.maxRounds) {
            this.handleVictory();
            return;
        }

        // Determine how many artworks this round
        let artworkCount;
        if (this.round <= 5) {
            artworkCount = 1;
        } else if (this.round <= 10) {
            artworkCount = 2;
        } else if (this.round <= 15) {
            artworkCount = 3;
        } else {
            artworkCount = 4;
        }

        // Select random artworks for this round
        this.currentArtworks = [];
        const shuffled = [...this.artworkTypes].sort(() => Math.random() - 0.5);
        for (let i = 0; i < artworkCount; i++) {
            this.currentArtworks.push({ ...shuffled[i] });
        }

        // Clear previous placements
        this.placedArtworks = [];

        // Spawn visitor
        this.spawnVisitor();

        // Bach encouragement
        if (this.round === 1) {
            this.showBachMessage("Let's begin with one artwork. Find where it looks best.");
        } else if (this.round === 6) {
            this.showBachMessage("Now two artworks. Try placing similar themes together.");
        } else if (this.round === 11) {
            this.showBachMessage("Three artworks now. Like composing - each voice needs space.");
        } else if (this.round === 16) {
            this.showBachMessage("Four artworks. Balance is key, as in a fugue.");
        }

        this.ui.showMessage(`Round ${this.round}/${this.maxRounds}: Arrange ${artworkCount} artwork${artworkCount > 1 ? 's' : ''}`, 3.0);
    }

    spawnVisitor() {
        // Generate visitor with random preferences
        const themes = ['people', 'nature', 'shapes', 'objects'];
        const styles = ['classical', 'modern'];

        this.currentVisitor = {
            x: 50,
            y: 500,
            preferredTheme: themes[Math.floor(Math.random() * themes.length)],
            preferredStyle: styles[Math.floor(Math.random() * styles.length)],
            satisfaction: 0 // Will be calculated based on arrangement
        };

        this.visitorReaction = null;
        this.visitorTimer = 0;
    }

    evaluateArrangement() {
        if (this.placedArtworks.length === 0) {
            this.visitorReaction = 'waiting';
            this.currentVisitor.satisfaction = 0;
            return;
        }

        let satisfaction = 0;
        let matchCount = 0;

        // Evaluate each placed artwork
        this.placedArtworks.forEach(artwork => {
            // Theme match
            if (artwork.theme === this.currentVisitor.preferredTheme) {
                satisfaction += 40;
                matchCount++;
            }

            // Style match
            if (artwork.style === this.currentVisitor.preferredStyle) {
                satisfaction += 40;
                matchCount++;
            }
        });

        // Harmony bonus: artworks grouped by similar theme or style
        if (this.placedArtworks.length >= 2) {
            const themes = this.placedArtworks.map(a => a.theme);
            const styles = this.placedArtworks.map(a => a.style);

            // Check if artworks are similar (simple: if more than half match)
            const themeCounts = {};
            const styleCounts = {};

            themes.forEach(t => themeCounts[t] = (themeCounts[t] || 0) + 1);
            styles.forEach(s => styleCounts[s] = (styleCounts[s] || 0) + 1);

            const maxThemeCount = Math.max(...Object.values(themeCounts));
            const maxStyleCount = Math.max(...Object.values(styleCounts));

            if (maxThemeCount >= 2 || maxStyleCount >= 2) {
                satisfaction += 20; // Harmony bonus
            }
        }

        // Normalize satisfaction to 0-100
        const maxPossible = this.placedArtworks.length * 80 + 20;
        satisfaction = Math.min(100, (satisfaction / maxPossible) * 100);

        this.currentVisitor.satisfaction = satisfaction;

        // Determine reaction
        if (satisfaction >= 70) {
            this.visitorReaction = 'happy';
        } else if (satisfaction >= 40) {
            this.visitorReaction = 'neutral';
        } else {
            this.visitorReaction = 'unhappy';
        }
    }

    confirmArrangement() {
        // Player confirms this arrangement
        this.evaluateArrangement();

        if (this.visitorReaction === 'happy') {
            // Success!
            this.starsEarned++;
            this.score += 100;
            this.particles.createBurst(this.currentVisitor.x + 20, this.currentVisitor.y, '#FFD700', 20);
            this.audio.playTone(523.25, 0.2); // C5 - musical chime

            setTimeout(() => {
                this.audio.playTone(659.25, 0.2); // E5
            }, 150);

            this.ui.showMessage('Visitor satisfied! Star earned.', 2.0);

            // Start next round after delay
            setTimeout(() => {
                this.startNextRound();
            }, 2000);

        } else if (this.visitorReaction === 'neutral') {
            // Acceptable, but no star
            this.score += 50;
            this.ui.showMessage('Visitor is okay with this. Try again or continue?', 2.0);
            this.showBachMessage("The audience is polite. You could try rearranging.");

            // Auto-continue after delay (cozy - no punishment)
            setTimeout(() => {
                this.startNextRound();
            }, 3000);

        } else {
            // Unhappy, but still can continue (cozy - can't fail)
            this.score += 10;
            this.ui.showMessage('Visitor seems confused. Rearrange or try next visitor?', 2.0);
            this.showBachMessage("Perhaps group similar themes together?");

            // Auto-continue (cozy approach)
            setTimeout(() => {
                this.startNextRound();
            }, 3000);
        }
    }

    placeArtwork(artwork, wall) {
        // Find existing placement
        const existingIndex = this.placedArtworks.findIndex(a => a.id === artwork.id);

        if (existingIndex >= 0) {
            // Move existing artwork
            this.placedArtworks[existingIndex].wall = wall.id;
            this.placedArtworks[existingIndex].x = wall.x + wall.width / 2 - 40;
            this.placedArtworks[existingIndex].y = wall.y + wall.height / 2 - 60;
        } else {
            // New placement
            this.placedArtworks.push({
                ...artwork,
                wall: wall.id,
                x: wall.x + wall.width / 2 - 40,
                y: wall.y + wall.height / 2 - 60
            });
        }

        // Instant feedback
        this.evaluateArrangement();
        this.audio.playTone(440, 0.1); // A4 - placement sound
        this.particles.createSparkle(wall.x + wall.width / 2, wall.y + wall.height / 2);
    }

    showBachMessage(message) {
        this.bach.message = message;
        this.bach.messageTimer = 4000;
    }

    handleVictory() {
        this.ui.showMessage(`Level Complete! ${this.starsEarned}/20 stars earned. Score: ${this.score}`, 5.0);

        this.bach.message = "Wonderful! Like a complete composition - each artwork found its voice in the harmony.";
        this.bach.messageTimer = 8000;

        // Victory stats
        setTimeout(() => {
            const accuracy = Math.round((this.starsEarned / this.maxRounds) * 100);
            this.ui.showMessage(`Visitor Satisfaction: ${accuracy}%`, 5.0);
        }, 3000);
    }

    handleInput(event) {
        // Handle drag-drop of artworks to walls
        // This will be implemented with engine's input system
    }

    update(dt) {
        // Update Bach message timer
        if (this.bach.messageTimer > 0) {
            this.bach.messageTimer -= dt * 1000;
            if (this.bach.messageTimer <= 0) {
                this.bach.message = '';
            }
        }

        // Update visitor evaluation continuously
        if (this.currentVisitor && this.placedArtworks.length > 0) {
            this.evaluateArrangement();
        }
    }

    render(ctx) {
        // Render gallery background
        ctx.fillStyle = '#F5E6D3'; // Warm gallery beige
        ctx.fillRect(0, 0, this.engine.canvas.width, this.engine.canvas.height);

        // DEBUG: Test rendering
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(100, 100, 100, 100);
        ctx.fillStyle = '#000';
        ctx.font = '20px Arial';
        ctx.fillText('DEBUG: Render working', 250, 150);
        console.log('Rendering... walls:', this.walls.length, 'current artworks:', this.currentArtworks.length);

        // Render walls
        this.walls.forEach(wall => {
            ctx.fillStyle = '#D2B48C'; // Tan wall
            ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
            ctx.strokeStyle = '#8B7355';
            ctx.lineWidth = 3;
            ctx.strokeRect(wall.x, wall.y, wall.width, wall.height);

            // Wall label
            ctx.fillStyle = '#666';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(wall.label, wall.x + wall.width / 2, wall.y - 10);
        });

        // Render placed artworks
        this.placedArtworks.forEach(artwork => {
            // Frame
            ctx.fillStyle = '#654321';
            ctx.fillRect(artwork.x - 5, artwork.y - 5, 90, 130);

            // Artwork
            ctx.fillStyle = artwork.color;
            ctx.fillRect(artwork.x, artwork.y, 80, 120);

            // Label
            ctx.fillStyle = '#FFF';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(artwork.label, artwork.x + 40, artwork.y + 60);
        });

        // Render available artworks (not yet placed)
        const unplacedArtworks = this.currentArtworks.filter(
            art => !this.placedArtworks.find(p => p.id === art.id)
        );

        unplacedArtworks.forEach((artwork, index) => {
            const x = 50;
            const y = 150 + (index * 140);

            // Frame
            ctx.fillStyle = '#654321';
            ctx.fillRect(x - 5, y - 5, 90, 130);

            // Artwork
            ctx.fillStyle = artwork.color;
            ctx.fillRect(x, y, 80, 120);

            // Label
            ctx.fillStyle = '#FFF';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(artwork.label, x + 40, y + 60);
        });

        // Render visitor
        if (this.currentVisitor) {
            // Visitor sprite (simple circle for now)
            ctx.fillStyle = '#8B4513';
            ctx.beginPath();
            ctx.arc(this.currentVisitor.x + 20, this.currentVisitor.y + 20, 25, 0, Math.PI * 2);
            ctx.fill();

            // Reaction glow
            if (this.visitorReaction === 'happy') {
                ctx.strokeStyle = '#00FF00';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.arc(this.currentVisitor.x + 20, this.currentVisitor.y + 20, 30, 0, Math.PI * 2);
                ctx.stroke();
            } else if (this.visitorReaction === 'neutral') {
                ctx.strokeStyle = '#FFFF00';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.arc(this.currentVisitor.x + 20, this.currentVisitor.y + 20, 30, 0, Math.PI * 2);
                ctx.stroke();
            } else if (this.visitorReaction === 'unhappy') {
                ctx.strokeStyle = '#FF0000';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.arc(this.currentVisitor.x + 20, this.currentVisitor.y + 20, 30, 0, Math.PI * 2);
                ctx.stroke();
            }

            // Simple face based on reaction
            ctx.fillStyle = '#FFF';
            if (this.visitorReaction === 'happy') {
                // Happy face (simplified, no emoji)
                ctx.beginPath();
                ctx.arc(this.currentVisitor.x + 15, this.currentVisitor.y + 15, 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(this.currentVisitor.x + 25, this.currentVisitor.y + 15, 2, 0, Math.PI * 2);
                ctx.fill();
                // Smile
                ctx.strokeStyle = '#FFF';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(this.currentVisitor.x + 20, this.currentVisitor.y + 20, 8, 0, Math.PI, false);
                ctx.stroke();
            } else if (this.visitorReaction === 'neutral') {
                // Neutral face
                ctx.beginPath();
                ctx.arc(this.currentVisitor.x + 15, this.currentVisitor.y + 15, 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(this.currentVisitor.x + 25, this.currentVisitor.y + 15, 2, 0, Math.PI * 2);
                ctx.fill();
                // Straight mouth
                ctx.strokeStyle = '#FFF';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(this.currentVisitor.x + 12, this.currentVisitor.y + 28);
                ctx.lineTo(this.currentVisitor.x + 28, this.currentVisitor.y + 28);
                ctx.stroke();
            } else if (this.visitorReaction === 'unhappy') {
                // Unhappy face
                ctx.beginPath();
                ctx.arc(this.currentVisitor.x + 15, this.currentVisitor.y + 15, 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(this.currentVisitor.x + 25, this.currentVisitor.y + 15, 2, 0, Math.PI * 2);
                ctx.fill();
                // Frown
                ctx.strokeStyle = '#FFF';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(this.currentVisitor.x + 20, this.currentVisitor.y + 32, 8, 0, Math.PI, true);
                ctx.stroke();
            }
        }

        // Render Bach
        if (this.bach.visible) {
            // Bach sprite
            ctx.fillStyle = '#2C3E50';
            ctx.beginPath();
            ctx.arc(this.bach.x, this.bach.y, 30, 0, Math.PI * 2);
            ctx.fill();

            // Musical note icon (simple)
            ctx.fillStyle = '#FFF';
            ctx.font = '24px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('♪', this.bach.x, this.bach.y);

            // Message bubble
            if (this.bach.message) {
                const lines = this.wrapText(ctx, this.bach.message, 300);
                const bubbleHeight = lines.length * 20 + 20;

                ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
                ctx.strokeStyle = '#2C3E50';
                ctx.lineWidth = 2;
                this.roundRect(ctx, this.bach.x - 160, this.bach.y - 80, 320, bubbleHeight, 10);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = '#000';
                ctx.font = '14px Arial';
                ctx.textAlign = 'center';
                lines.forEach((line, i) => {
                    ctx.fillText(line, this.bach.x, this.bach.y - 70 + (i * 20));
                });
            }
        }

        // Render HUD
        ctx.fillStyle = '#000';
        ctx.font = '18px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Round: ${this.round}/${this.maxRounds}`, 10, 30);
        ctx.fillText(`Stars: ${this.starsEarned}/20`, 10, 55);
        ctx.fillText(`Score: ${this.score}`, 10, 80);

        // Render confirm button if all artworks placed
        if (this.placedArtworks.length === this.currentArtworks.length && this.currentArtworks.length > 0) {
            ctx.fillStyle = '#4CAF50';
            ctx.fillRect(700, 500, 120, 40);
            ctx.fillStyle = '#FFF';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Confirm', 760, 525);
        }
    }

    wrapText(ctx, text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';

        words.forEach(word => {
            const testLine = currentLine + (currentLine ? ' ' : '') + word;
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && currentLine) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        });
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
}
