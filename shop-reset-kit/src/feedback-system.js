// Enhanced Shop Reset Kit - Feedback Collection System
// Provides user feedback collection and analysis capabilities

class FeedbackCollectionSystem {
    constructor() {
        this.feedbackData = [];
        this.feedbackTypes = {
            usability: 'Usability & User Experience',
            functionality: 'Feature Functionality',
            performance: 'Performance & Speed',
            accuracy: 'Recommendation Accuracy',
            design: 'Visual Design & Layout',
            documentation: 'Documentation & Help',
            general: 'General Feedback'
        };

        this.init();
    }

    init() {
        this.createFeedbackWidget();
        this.loadStoredFeedback();
        this.setupAutomaticFeedbackCollection();
    }

    createFeedbackWidget() {
        // Create feedback button
        const feedbackButton = document.createElement('button');
        feedbackButton.id = 'feedback-widget-button';
        feedbackButton.innerHTML = '💬 Feedback';
        feedbackButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            background: #3498db;
            color: white;
            border: none;
            border-radius: 25px;
            padding: 12px 20px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
            transition: all 0.3s ease;
        `;

        feedbackButton.addEventListener('mouseenter', () => {
            feedbackButton.style.transform = 'translateY(-2px)';
            feedbackButton.style.boxShadow = '0 6px 20px rgba(52, 152, 219, 0.4)';
        });

        feedbackButton.addEventListener('mouseleave', () => {
            feedbackButton.style.transform = 'translateY(0)';
            feedbackButton.style.boxShadow = '0 4px 12px rgba(52, 152, 219, 0.3)';
        });

        feedbackButton.addEventListener('click', () => {
            this.showFeedbackModal();
        });

        document.body.appendChild(feedbackButton);
    }

    showFeedbackModal() {
        // Create modal backdrop
        const backdrop = document.createElement('div');
        backdrop.id = 'feedback-modal-backdrop';
        backdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1001;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        // Create modal content
        const modal = document.createElement('div');
        modal.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 30px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        `;

        modal.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3 style="margin: 0; color: #2c3e50;">💬 Share Your Feedback</h3>
                <button id="feedback-close-btn" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #7f8c8d;">×</button>
            </div>

            <form id="feedback-form">
                <div style="margin-bottom: 20px;">
                    <label style="display: block; font-weight: bold; margin-bottom: 8px; color: #2c3e50;">
                        Feedback Category:
                    </label>
                    <select id="feedback-type" style="width: 100%; padding: 10px; border: 2px solid #ecf0f1; border-radius: 6px; font-size: 14px;">
                        ${Object.entries(this.feedbackTypes).map(([key, value]) =>
                            `<option value="${key}">${value}</option>`
                        ).join('')}
                    </select>
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="display: block; font-weight: bold; margin-bottom: 8px; color: #2c3e50;">
                        Your Experience Rating:
                    </label>
                    <div id="rating-container" style="display: flex; gap: 5px; margin-bottom: 10px;">
                        ${[1,2,3,4,5].map(i =>
                            `<button type="button" class="rating-star" data-rating="${i}" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #ddd;">⭐</button>`
                        ).join('')}
                    </div>
                    <small style="color: #7f8c8d;">1 = Poor, 5 = Excellent</small>
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="display: block; font-weight: bold; margin-bottom: 8px; color: #2c3e50;">
                        Your Feedback:
                    </label>
                    <textarea id="feedback-message" rows="4" placeholder="Tell us about your experience with the Shop Reset Kit..." style="width: 100%; padding: 12px; border: 2px solid #ecf0f1; border-radius: 6px; font-size: 14px; font-family: inherit; resize: vertical;"></textarea>
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="display: block; font-weight: bold; margin-bottom: 8px; color: #2c3e50;">
                        How did you use the application? (Optional)
                    </label>
                    <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                        <label style="display: flex; align-items: center; font-weight: normal;">
                            <input type="checkbox" name="usage" value="planning"> Planning store reset
                        </label>
                        <label style="display: flex; align-items: center; font-weight: normal;">
                            <input type="checkbox" name="usage" value="training"> Training purposes
                        </label>
                        <label style="display: flex; align-items: center; font-weight: normal;">
                            <input type="checkbox" name="usage" value="evaluation"> Evaluating for business
                        </label>
                        <label style="display: flex; align-items: center; font-weight: normal;">
                            <input type="checkbox" name="usage" value="other"> Other
                        </label>
                    </div>
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="display: flex; align-items: center; font-weight: normal;">
                        <input type="checkbox" id="feedback-contact" style="margin-right: 8px;">
                        I'd like to be contacted about my feedback (optional)
                    </label>
                    <input type="email" id="feedback-email" placeholder="your.email@example.com" style="width: 100%; padding: 10px; border: 2px solid #ecf0f1; border-radius: 6px; font-size: 14px; margin-top: 8px; display: none;">
                </div>

                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button type="button" id="feedback-cancel-btn" style="padding: 12px 20px; border: 2px solid #bdc3c7; background: white; color: #7f8c8d; border-radius: 6px; cursor: pointer; font-weight: bold;">
                        Cancel
                    </button>
                    <button type="submit" style="padding: 12px 20px; border: none; background: #3498db; color: white; border-radius: 6px; cursor: pointer; font-weight: bold;">
                        Send Feedback
                    </button>
                </div>
            </form>
        `;

        backdrop.appendChild(modal);
        document.body.appendChild(backdrop);

        // Setup modal interactions
        this.setupModalInteractions(backdrop);
    }

    setupModalInteractions(backdrop) {
        // Rating stars
        const stars = backdrop.querySelectorAll('.rating-star');
        let selectedRating = 0;

        stars.forEach((star, index) => {
            star.addEventListener('mouseenter', () => {
                stars.forEach((s, i) => {
                    s.style.color = i <= index ? '#f39c12' : '#ddd';
                });
            });

            star.addEventListener('mouseleave', () => {
                stars.forEach((s, i) => {
                    s.style.color = i < selectedRating ? '#f39c12' : '#ddd';
                });
            });

            star.addEventListener('click', () => {
                selectedRating = index + 1;
                stars.forEach((s, i) => {
                    s.style.color = i < selectedRating ? '#f39c12' : '#ddd';
                });
            });
        });

        // Contact checkbox
        const contactCheckbox = backdrop.querySelector('#feedback-contact');
        const emailInput = backdrop.querySelector('#feedback-email');

        contactCheckbox.addEventListener('change', () => {
            emailInput.style.display = contactCheckbox.checked ? 'block' : 'none';
            if (!contactCheckbox.checked) {
                emailInput.value = '';
            }
        });

        // Close handlers
        const closeBtn = backdrop.querySelector('#feedback-close-btn');
        const cancelBtn = backdrop.querySelector('#feedback-cancel-btn');

        [closeBtn, cancelBtn].forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeFeedbackModal(backdrop);
            });
        });

        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
                this.closeFeedbackModal(backdrop);
            }
        });

        // Form submission
        const form = backdrop.querySelector('#feedback-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitFeedback(backdrop, selectedRating);
        });
    }

    closeFeedbackModal(backdrop) {
        backdrop.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(backdrop);
        }, 300);
    }

    submitFeedback(backdrop, rating) {
        const form = backdrop.querySelector('#feedback-form');
        const formData = new FormData(form);

        const feedback = {
            id: 'feedback_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            timestamp: Date.now(),
            type: formData.get('feedback-type') || backdrop.querySelector('#feedback-type').value,
            rating: rating,
            message: backdrop.querySelector('#feedback-message').value,
            usage: Array.from(backdrop.querySelectorAll('input[name="usage"]:checked')).map(cb => cb.value),
            contactRequested: backdrop.querySelector('#feedback-contact').checked,
            email: backdrop.querySelector('#feedback-email').value,

            // Technical context
            context: {
                userAgent: navigator.userAgent,
                url: window.location.href,
                sessionDuration: window.shopResetMonitoring ?
                    Date.now() - window.shopResetMonitoring.startTime : null,
                planGenerations: window.shopResetMonitoring ?
                    window.shopResetMonitoring.metrics.planGenerations : null,
                viewport: `${window.innerWidth}x${window.innerHeight}`,
                language: navigator.language
            }
        };

        // Validate required fields
        if (!feedback.message.trim()) {
            alert('Please provide your feedback message.');
            return;
        }

        if (feedback.rating === 0) {
            alert('Please select a rating.');
            return;
        }

        // Store feedback
        this.storeFeedback(feedback);

        // Show success message
        this.showSuccessMessage(backdrop);

        // Auto-close after success
        setTimeout(() => {
            this.closeFeedbackModal(backdrop);
        }, 2000);
    }

    showSuccessMessage(backdrop) {
        const modal = backdrop.querySelector('div > div');
        modal.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <div style="font-size: 48px; color: #27ae60; margin-bottom: 20px;">✅</div>
                <h3 style="color: #2c3e50; margin-bottom: 10px;">Thank You!</h3>
                <p style="color: #7f8c8d; margin: 0;">
                    Your feedback has been collected and will help improve the Shop Reset Kit.
                </p>
            </div>
        `;
    }

    storeFeedback(feedback) {
        this.feedbackData.push(feedback);

        try {
            const storageKey = 'shopResetKit_feedback';
            const existingFeedback = JSON.parse(localStorage.getItem(storageKey) || '[]');
            const updatedFeedback = [...existingFeedback, feedback];
            localStorage.setItem(storageKey, JSON.stringify(updatedFeedback));

            // Log for monitoring
            if (window.shopResetMonitoring) {
                window.shopResetMonitoring.logEvent('feedback_submitted', {
                    feedbackType: feedback.type,
                    rating: feedback.rating,
                    hasMessage: feedback.message.length > 0,
                    usage: feedback.usage
                });
            }

            console.log('Feedback stored successfully:', feedback.id);
        } catch (error) {
            console.error('Failed to store feedback:', error);
        }
    }

    loadStoredFeedback() {
        try {
            const storageKey = 'shopResetKit_feedback';
            const storedFeedback = JSON.parse(localStorage.getItem(storageKey) || '[]');
            this.feedbackData = storedFeedback;
        } catch (error) {
            console.warn('Could not load stored feedback:', error);
            this.feedbackData = [];
        }
    }

    setupAutomaticFeedbackCollection() {
        // Collect implicit feedback based on user behavior

        // Time-based feedback prompt
        setTimeout(() => {
            if (window.shopResetMonitoring &&
                window.shopResetMonitoring.metrics.planGenerations > 0) {
                this.showQuickFeedbackPrompt();
            }
        }, 2 * 60 * 1000); // After 2 minutes if user has generated plans

        // Exit intent feedback
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                this.recordImplicitFeedback('session_end', {
                    sessionDuration: window.shopResetMonitoring ?
                        Date.now() - window.shopResetMonitoring.startTime : null,
                    actionsCompleted: window.shopResetMonitoring ?
                        window.shopResetMonitoring.metrics.planGenerations : 0
                });
            }
        });
    }

    showQuickFeedbackPrompt() {
        // Non-intrusive feedback prompt
        const prompt = document.createElement('div');
        prompt.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            background: white;
            border: 2px solid #3498db;
            border-radius: 12px;
            padding: 15px;
            max-width: 300px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            z-index: 999;
            animation: slideIn 0.3s ease-out;
        `;

        prompt.innerHTML = `
            <div style="margin-bottom: 15px;">
                <strong style="color: #2c3e50;">How's your experience so far?</strong>
                <button style="float: right; background: none; border: none; font-size: 18px; cursor: pointer; color: #7f8c8d;" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
            <div style="display: flex; gap: 5px; margin-bottom: 10px;">
                ${[1,2,3,4,5].map(i =>
                    `<button onclick="window.feedbackSystem.recordQuickRating(${i}); this.parentElement.parentElement.parentElement.remove();" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #ddd;">⭐</button>`
                ).join('')}
            </div>
            <small style="color: #7f8c8d;">Quick rating helps us improve!</small>
        `;

        document.body.appendChild(prompt);

        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (prompt.parentElement) {
                prompt.remove();
            }
        }, 10000);
    }

    recordQuickRating(rating) {
        const quickFeedback = {
            id: 'quick_' + Date.now(),
            timestamp: Date.now(),
            type: 'quick_rating',
            rating: rating,
            context: {
                userAgent: navigator.userAgent,
                sessionDuration: window.shopResetMonitoring ?
                    Date.now() - window.shopResetMonitoring.startTime : null,
                planGenerations: window.shopResetMonitoring ?
                    window.shopResetMonitoring.metrics.planGenerations : null
            }
        };

        this.storeFeedback(quickFeedback);
    }

    recordImplicitFeedback(action, data) {
        const implicitFeedback = {
            id: 'implicit_' + Date.now(),
            timestamp: Date.now(),
            type: 'implicit',
            action: action,
            data: data
        };

        this.feedbackData.push(implicitFeedback);

        if (window.shopResetMonitoring) {
            window.shopResetMonitoring.logEvent('implicit_feedback', implicitFeedback);
        }
    }

    // Analytics and reporting methods
    getFeedbackSummary() {
        const summary = {
            totalFeedback: this.feedbackData.length,
            averageRating: 0,
            typeBreakdown: {},
            recentFeedback: [],
            trends: {}
        };

        // Calculate average rating
        const ratingsOnly = this.feedbackData.filter(f => f.rating);
        if (ratingsOnly.length > 0) {
            summary.averageRating = ratingsOnly.reduce((sum, f) => sum + f.rating, 0) / ratingsOnly.length;
        }

        // Type breakdown
        this.feedbackData.forEach(feedback => {
            if (feedback.type) {
                summary.typeBreakdown[feedback.type] = (summary.typeBreakdown[feedback.type] || 0) + 1;
            }
        });

        // Recent feedback (last 7 days)
        const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        summary.recentFeedback = this.feedbackData.filter(f => f.timestamp > weekAgo);

        return summary;
    }

    exportFeedbackData() {
        const exportData = {
            summary: this.getFeedbackSummary(),
            allFeedback: this.feedbackData,
            exportedAt: new Date().toISOString()
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = `shop-reset-kit-feedback-${Date.now()}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    // Public API
    showFeedbackForm() {
        this.showFeedbackModal();
    }

    getAllFeedback() {
        return [...this.feedbackData];
    }
}

// Initialize feedback system
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.feedbackSystem = new FeedbackCollectionSystem();
    });
} else {
    window.feedbackSystem = new FeedbackCollectionSystem();
}

// CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// ES6 export for modern module systems
export default FeedbackCollectionSystem;
export { FeedbackCollectionSystem };