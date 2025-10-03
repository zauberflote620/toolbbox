/**
 * Gallery Keeper - Audio System
 *
 * Handles:
 * - Sound effect playback with Web Audio API
 * - Background music management
 * - Volume control and muting
 * - Simple procedural sound generation (for initial development)
 */

class AudioManager {
    constructor() {
        // Web Audio API context
        this.context = null;
        this.masterGain = null;

        // Audio state
        this.sfxVolume = 0.7;
        this.musicVolume = 0.4;
        this.muted = false;

        // Sound pools
        this.sounds = {};
        this.music = null;
        this.musicSource = null;

        // Initialize (requires user interaction)
        this.initialized = false;
    }

    /**
     * Initialize audio context (must be called after user interaction)
     */
    init() {
        if (this.initialized) return;

        try {
            // Create AudioContext
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.context = new AudioContext();

            // Create master gain node
            this.masterGain = this.context.createGain();
            this.masterGain.connect(this.context.destination);
            this.masterGain.gain.value = 1.0;

            this.initialized = true;
            console.log('🔊 Audio system initialized');
        } catch (error) {
            console.warn('⚠️ Web Audio API not supported:', error);
        }
    }

    /**
     * Play procedurally generated sound effect
     * @param {string} type - Sound type: 'click', 'success', 'error', 'drop', 'pickup'
     */
    playSFX(type) {
        if (!this.initialized || this.muted) return;

        switch (type) {
            case 'click':
                this.playClick();
                break;
            case 'success':
                this.playSuccess();
                break;
            case 'error':
                this.playError();
                break;
            case 'drop':
                this.playDrop();
                break;
            case 'pickup':
                this.playPickup();
                break;
            case 'sparkle':
                this.playSparkle();
                break;
            case 'heart':
                this.playHeart();
                break;
            default:
                console.warn(`Unknown SFX type: ${type}`);
        }
    }

    /**
     * Click sound (short beep)
     */
    playClick() {
        this.playTone(800, 0.05, 0.1, 'sine');
    }

    /**
     * Success sound (ascending chime)
     */
    playSuccess() {
        this.playTone(523, 0.1, 0.15, 'sine'); // C
        setTimeout(() => this.playTone(659, 0.1, 0.15, 'sine'), 80); // E
        setTimeout(() => this.playTone(784, 0.15, 0.2, 'sine'), 160); // G
    }

    /**
     * Error sound (buzzer)
     */
    playError() {
        this.playTone(200, 0.2, 0.2, 'sawtooth');
    }

    /**
     * Drop sound (thud)
     */
    playDrop() {
        this.playTone(150, 0.1, 0.15, 'sine');
    }

    /**
     * Pickup sound (blip)
     */
    playPickup() {
        this.playTone(600, 0.05, 0.1, 'square');
    }

    /**
     * Sparkle sound (high chime)
     */
    playSparkle() {
        this.playTone(1200, 0.08, 0.12, 'sine');
    }

    /**
     * Heart sound (cute blip)
     */
    playHeart() {
        this.playTone(800, 0.06, 0.1, 'sine');
        setTimeout(() => this.playTone(1000, 0.06, 0.1, 'sine'), 60);
    }

    /**
     * Play a tone with Web Audio API
     * @param {number} frequency - Frequency in Hz
     * @param {number} duration - Duration in seconds
     * @param {number} volume - Volume (0.0 to 1.0)
     * @param {string} waveType - 'sine', 'square', 'sawtooth', 'triangle'
     */
    playTone(frequency, duration, volume = 0.2, waveType = 'sine') {
        if (!this.initialized || this.muted) return;

        try {
            // Create oscillator
            const oscillator = this.context.createOscillator();
            oscillator.type = waveType;
            oscillator.frequency.value = frequency;

            // Create gain node for volume
            const gainNode = this.context.createGain();
            gainNode.gain.value = volume * this.sfxVolume;

            // Create envelope (fade out)
            gainNode.gain.setValueAtTime(volume * this.sfxVolume, this.context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);

            // Connect nodes
            oscillator.connect(gainNode);
            gainNode.connect(this.masterGain);

            // Play
            oscillator.start(this.context.currentTime);
            oscillator.stop(this.context.currentTime + duration);
        } catch (error) {
            console.warn('Error playing tone:', error);
        }
    }

    /**
     * Play background music (simple ambient loop)
     */
    playMusic() {
        if (!this.initialized || this.muted) return;

        // Simple ambient music using oscillators
        this.playAmbientMusic();
    }

    /**
     * Create ambient background music
     */
    playAmbientMusic() {
        if (this.musicSource) return; // Already playing

        try {
            // Create ambient pad sound
            const oscillator1 = this.context.createOscillator();
            const oscillator2 = this.context.createOscillator();

            oscillator1.type = 'sine';
            oscillator2.type = 'sine';

            // Detuned for richness
            oscillator1.frequency.value = 130.81; // C3
            oscillator2.frequency.value = 196.00; // G3

            // Create gain for music
            const musicGain = this.context.createGain();
            musicGain.gain.value = this.musicVolume;

            // Connect
            oscillator1.connect(musicGain);
            oscillator2.connect(musicGain);
            musicGain.connect(this.masterGain);

            // Start
            oscillator1.start();
            oscillator2.start();

            this.musicSource = { osc1: oscillator1, osc2: oscillator2, gain: musicGain };

            console.log('🎵 Music started');
        } catch (error) {
            console.warn('Error playing music:', error);
        }
    }

    /**
     * Stop background music
     */
    stopMusic() {
        if (this.musicSource) {
            this.musicSource.osc1.stop();
            this.musicSource.osc2.stop();
            this.musicSource = null;
            console.log('🔇 Music stopped');
        }
    }

    /**
     * Set SFX volume
     * @param {number} volume - 0.0 to 1.0
     */
    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        console.log(`🔊 SFX volume: ${Math.round(this.sfxVolume * 100)}%`);
    }

    /**
     * Set music volume
     * @param {number} volume - 0.0 to 1.0
     */
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));

        if (this.musicSource) {
            this.musicSource.gain.gain.value = this.musicVolume;
        }

        console.log(`🎵 Music volume: ${Math.round(this.musicVolume * 100)}%`);
    }

    /**
     * Toggle mute
     */
    toggleMute() {
        this.muted = !this.muted;

        if (this.masterGain) {
            this.masterGain.gain.value = this.muted ? 0 : 1;
        }

        console.log(this.muted ? '🔇 Muted' : '🔊 Unmuted');
        return this.muted;
    }

    /**
     * Get mute state
     */
    isMuted() {
        return this.muted;
    }

    /**
     * Resume audio context (for browsers that suspend it)
     */
    resume() {
        if (this.context && this.context.state === 'suspended') {
            this.context.resume();
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioManager;
}
