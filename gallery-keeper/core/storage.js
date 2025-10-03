/**
 * Gallery Keeper - Save/Load System
 *
 * Handles:
 * - Game progress saving to LocalStorage
 * - Level completion tracking
 * - Settings persistence
 * - High scores
 */

class SaveManager {
    constructor(gameId = 'gallery-keeper') {
        this.gameId = gameId;
        this.storageKey = `${gameId}-save`;
        this.settingsKey = `${gameId}-settings`;
    }

    /**
     * Save game progress
     * @param {Object} gameState - Current game state
     */
    saveGame(gameState) {
        try {
            const saveData = {
                version: '1.0.0',
                timestamp: Date.now(),
                currentLevel: gameState.currentLevel || 1,
                levelsCompleted: gameState.levelsCompleted || [],
                totalScore: gameState.totalScore || 0,
                achievements: gameState.achievements || [],
                playTime: gameState.playTime || 0
            };

            localStorage.setItem(this.storageKey, JSON.stringify(saveData));
            console.log('💾 Game saved:', saveData);
            return true;
        } catch (error) {
            console.error('❌ Failed to save game:', error);
            return false;
        }
    }

    /**
     * Load game progress
     * @returns {Object|null} Saved game state or null if no save exists
     */
    loadGame() {
        try {
            const savedData = localStorage.getItem(this.storageKey);

            if (!savedData) {
                console.log('📂 No save data found');
                return null;
            }

            const gameState = JSON.parse(savedData);
            console.log('📂 Game loaded:', gameState);
            return gameState;
        } catch (error) {
            console.error('❌ Failed to load game:', error);
            return null;
        }
    }

    /**
     * Check if save exists
     * @returns {boolean}
     */
    hasSave() {
        return localStorage.getItem(this.storageKey) !== null;
    }

    /**
     * Delete save data
     */
    deleteSave() {
        try {
            localStorage.removeItem(this.storageKey);
            console.log('🗑️ Save data deleted');
            return true;
        } catch (error) {
            console.error('❌ Failed to delete save:', error);
            return false;
        }
    }

    /**
     * Save settings
     * @param {Object} settings - Game settings
     */
    saveSettings(settings) {
        try {
            const settingsData = {
                sfxVolume: settings.sfxVolume || 0.7,
                musicVolume: settings.musicVolume || 0.4,
                muted: settings.muted || false,
                colorblindMode: settings.colorblindMode || false,
                showTutorials: settings.showTutorials !== false // Default true
            };

            localStorage.setItem(this.settingsKey, JSON.stringify(settingsData));
            console.log('⚙️ Settings saved:', settingsData);
            return true;
        } catch (error) {
            console.error('❌ Failed to save settings:', error);
            return false;
        }
    }

    /**
     * Load settings
     * @returns {Object} Settings object (with defaults if no save exists)
     */
    loadSettings() {
        try {
            const savedSettings = localStorage.getItem(this.settingsKey);

            if (!savedSettings) {
                // Return defaults
                return {
                    sfxVolume: 0.7,
                    musicVolume: 0.4,
                    muted: false,
                    colorblindMode: false,
                    showTutorials: true
                };
            }

            const settings = JSON.parse(savedSettings);
            console.log('⚙️ Settings loaded:', settings);
            return settings;
        } catch (error) {
            console.error('❌ Failed to load settings:', error);
            return {
                sfxVolume: 0.7,
                musicVolume: 0.4,
                muted: false,
                colorblindMode: false,
                showTutorials: true
            };
        }
    }

    /**
     * Save level completion
     * @param {number} levelNumber
     * @param {number} score
     * @param {number} timeSeconds
     */
    completeLLevel(levelNumber, score, timeSeconds) {
        const gameState = this.loadGame() || {
            currentLevel: 1,
            levelsCompleted: [],
            totalScore: 0,
            achievements: [],
            playTime: 0
        };

        // Add level to completed list if not already there
        if (!gameState.levelsCompleted.includes(levelNumber)) {
            gameState.levelsCompleted.push(levelNumber);
        }

        // Update total score
        gameState.totalScore += score;

        // Update play time
        gameState.playTime += timeSeconds;

        // Unlock next level
        gameState.currentLevel = Math.max(gameState.currentLevel, levelNumber + 1);

        this.saveGame(gameState);

        console.log(`✅ Level ${levelNumber} completed! Score: ${score}, Time: ${timeSeconds}s`);
    }

    /**
     * Get high scores for a level
     * @param {number} levelNumber
     * @returns {Array} High scores
     */
    getHighScores(levelNumber) {
        const key = `${this.gameId}-highscores-${levelNumber}`;

        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('❌ Failed to load high scores:', error);
            return [];
        }
    }

    /**
     * Add high score for a level
     * @param {number} levelNumber
     * @param {number} score
     * @param {number} timeSeconds
     */
    addHighScore(levelNumber, score, timeSeconds) {
        const scores = this.getHighScores(levelNumber);

        scores.push({
            score,
            time: timeSeconds,
            date: Date.now()
        });

        // Sort by score descending, then by time ascending
        scores.sort((a, b) => {
            if (b.score !== a.score) {
                return b.score - a.score;
            }
            return a.time - b.time;
        });

        // Keep top 10
        const topScores = scores.slice(0, 10);

        const key = `${this.gameId}-highscores-${levelNumber}`;
        localStorage.setItem(key, JSON.stringify(topScores));

        console.log(`🏆 High score added: ${score} (${timeSeconds}s)`);
    }

    /**
     * Export save data as JSON string (for backup)
     * @returns {string|null}
     */
    exportSave() {
        try {
            const gameData = this.loadGame();
            const settings = this.loadSettings();

            const exportData = {
                game: gameData,
                settings: settings,
                exportDate: Date.now()
            };

            return JSON.stringify(exportData, null, 2);
        } catch (error) {
            console.error('❌ Failed to export save:', error);
            return null;
        }
    }

    /**
     * Import save data from JSON string
     * @param {string} jsonString
     * @returns {boolean}
     */
    importSave(jsonString) {
        try {
            const importData = JSON.parse(jsonString);

            if (importData.game) {
                this.saveGame(importData.game);
            }

            if (importData.settings) {
                this.saveSettings(importData.settings);
            }

            console.log('📥 Save data imported successfully');
            return true;
        } catch (error) {
            console.error('❌ Failed to import save:', error);
            return false;
        }
    }

    /**
     * Get storage usage info
     * @returns {Object}
     */
    getStorageInfo() {
        try {
            const gameSize = localStorage.getItem(this.storageKey)?.length || 0;
            const settingsSize = localStorage.getItem(this.settingsKey)?.length || 0;

            return {
                gameDataBytes: gameSize,
                settingsBytes: settingsSize,
                totalBytes: gameSize + settingsSize,
                totalKB: ((gameSize + settingsSize) / 1024).toFixed(2)
            };
        } catch (error) {
            console.error('❌ Failed to get storage info:', error);
            return { gameDataBytes: 0, settingsBytes: 0, totalBytes: 0, totalKB: '0.00' };
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SaveManager;
}
