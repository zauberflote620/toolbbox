// Enhanced Shop Reset Kit - Basic Monitoring and Analytics
// This script provides client-side monitoring capabilities

class ShopResetMonitoring {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
        this.events = [];
        this.metrics = {
            pageViews: 0,
            planGenerations: 0,
            exports: 0,
            errors: 0,
            featureUsage: {},
            performanceMetrics: {}
        };

        this.init();
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    init() {
        // Page load monitoring
        this.recordPageView();

        // Performance monitoring
        this.monitorPerformance();

        // Error monitoring
        this.setupErrorHandling();

        // User interaction monitoring
        this.setupInteractionTracking();

        // Periodic reporting
        this.startPeriodicReporting();
    }

    recordPageView() {
        this.metrics.pageViews++;
        this.logEvent('page_view', {
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: Date.now(),
            sessionId: this.sessionId
        });
    }

    monitorPerformance() {
        // Monitor Core Web Vitals
        if ('PerformanceObserver' in window) {
            // Largest Contentful Paint
            new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    this.metrics.performanceMetrics.LCP = entry.startTime;
                    this.logEvent('performance_metric', {
                        metric: 'LCP',
                        value: entry.startTime,
                        timestamp: Date.now()
                    });
                }
            }).observe({ entryTypes: ['largest-contentful-paint'] });

            // First Input Delay
            new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    this.metrics.performanceMetrics.FID = entry.processingStart - entry.startTime;
                    this.logEvent('performance_metric', {
                        metric: 'FID',
                        value: entry.processingStart - entry.startTime,
                        timestamp: Date.now()
                    });
                }
            }).observe({ entryTypes: ['first-input'] });

            // Cumulative Layout Shift
            new PerformanceObserver((entryList) => {
                let clsValue = 0;
                for (const entry of entryList.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                this.metrics.performanceMetrics.CLS = clsValue;
                this.logEvent('performance_metric', {
                    metric: 'CLS',
                    value: clsValue,
                    timestamp: Date.now()
                });
            }).observe({ entryTypes: ['layout-shift'] });
        }

        // Monitor application-specific performance
        this.monitorFeaturePerformance();
    }

    monitorFeaturePerformance() {
        // Plan generation timing
        const originalGeneratePlan = window.generatePlan;
        if (originalGeneratePlan) {
            window.generatePlan = (...args) => {
                const startTime = performance.now();
                this.metrics.planGenerations++;

                try {
                    const result = originalGeneratePlan.apply(this, args);
                    const endTime = performance.now();
                    const duration = endTime - startTime;

                    this.logEvent('plan_generation', {
                        duration: duration,
                        success: true,
                        timestamp: Date.now()
                    });

                    this.trackFeatureUsage('plan_generation');
                    return result;
                } catch (error) {
                    const endTime = performance.now();
                    const duration = endTime - startTime;

                    this.logEvent('plan_generation', {
                        duration: duration,
                        success: false,
                        error: error.message,
                        timestamp: Date.now()
                    });

                    this.recordError(error, 'plan_generation');
                    throw error;
                }
            };
        }

        // Export timing
        const originalExportPlan = window.exportPlan;
        if (originalExportPlan) {
            window.exportPlan = (...args) => {
                const startTime = performance.now();
                this.metrics.exports++;

                try {
                    const result = originalExportPlan.apply(this, args);
                    const endTime = performance.now();
                    const duration = endTime - startTime;

                    this.logEvent('plan_export', {
                        duration: duration,
                        success: true,
                        timestamp: Date.now()
                    });

                    this.trackFeatureUsage('plan_export');
                    return result;
                } catch (error) {
                    const endTime = performance.now();
                    const duration = endTime - startTime;

                    this.logEvent('plan_export', {
                        duration: duration,
                        success: false,
                        error: error.message,
                        timestamp: Date.now()
                    });

                    this.recordError(error, 'plan_export');
                    throw error;
                }
            };
        }
    }

    setupErrorHandling() {
        // Global error handler
        window.addEventListener('error', (event) => {
            this.recordError({
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error ? event.error.stack : null
            }, 'global_error');
        });

        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            this.recordError({
                message: event.reason.message || 'Unhandled promise rejection',
                promise: event.promise,
                reason: event.reason
            }, 'unhandled_promise');
        });
    }

    setupInteractionTracking() {
        // Track button clicks
        document.addEventListener('click', (event) => {
            if (event.target.tagName === 'BUTTON') {
                const buttonText = event.target.textContent.trim();
                this.logEvent('button_click', {
                    buttonText: buttonText,
                    buttonClass: event.target.className,
                    timestamp: Date.now()
                });

                this.trackFeatureUsage('button_click_' + buttonText.toLowerCase().replace(/\s+/g, '_'));
            }
        });

        // Track form interactions
        document.addEventListener('input', (event) => {
            if (event.target.tagName === 'TEXTAREA' || event.target.tagName === 'INPUT') {
                this.logEvent('form_interaction', {
                    fieldId: event.target.id,
                    fieldType: event.target.type || event.target.tagName.toLowerCase(),
                    valueLength: event.target.value.length,
                    timestamp: Date.now()
                });

                this.trackFeatureUsage('form_interaction');
            }
        });
    }

    trackFeatureUsage(featureName) {
        if (!this.metrics.featureUsage[featureName]) {
            this.metrics.featureUsage[featureName] = 0;
        }
        this.metrics.featureUsage[featureName]++;
    }

    recordError(error, context) {
        this.metrics.errors++;
        this.logEvent('error', {
            message: error.message || 'Unknown error',
            context: context,
            stack: error.stack,
            userAgent: navigator.userAgent,
            url: window.location.href,
            timestamp: Date.now()
        });
    }

    logEvent(eventType, data) {
        const event = {
            type: eventType,
            sessionId: this.sessionId,
            timestamp: Date.now(),
            ...data
        };

        this.events.push(event);

        // Keep only last 100 events to prevent memory issues
        if (this.events.length > 100) {
            this.events = this.events.slice(-100);
        }

        // Log to console in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('ShopResetKit Event:', event);
        }
    }

    startPeriodicReporting() {
        // Report metrics every 5 minutes
        setInterval(() => {
            this.generateReport();
        }, 5 * 60 * 1000);

        // Report on page unload
        window.addEventListener('beforeunload', () => {
            this.generateReport(true);
        });
    }

    generateReport(isPageUnload = false) {
        const report = {
            sessionId: this.sessionId,
            reportType: isPageUnload ? 'session_end' : 'periodic',
            sessionDuration: Date.now() - this.startTime,
            metrics: { ...this.metrics },
            events: this.events.slice(-20), // Last 20 events
            timestamp: Date.now(),

            // Browser and environment info
            environment: {
                userAgent: navigator.userAgent,
                url: window.location.href,
                referrer: document.referrer,
                screenResolution: `${screen.width}x${screen.height}`,
                viewportSize: `${window.innerWidth}x${window.innerHeight}`,
                connectionType: navigator.connection ? navigator.connection.effectiveType : 'unknown',
                language: navigator.language,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            },

            // Application state
            applicationState: {
                currentPlanSections: this.getCurrentPlanState(),
                featuresUsed: Object.keys(this.metrics.featureUsage),
                errorRate: this.metrics.errors / Math.max(1, this.events.length),
                avgPerformance: this.calculateAveragePerformance()
            }
        };

        // Store in localStorage for later retrieval
        this.storeReport(report);

        // Log summary in console
        console.log('ShopResetKit Session Report:', {
            sessionDuration: Math.round(report.sessionDuration / 1000) + 's',
            planGenerations: this.metrics.planGenerations,
            exports: this.metrics.exports,
            errors: this.metrics.errors,
            topFeatures: this.getTopFeatures()
        });

        return report;
    }

    getCurrentPlanState() {
        try {
            // Try to get current plan sections count
            const sectionsGrid = document.getElementById('sectionsGrid');
            if (sectionsGrid) {
                return sectionsGrid.children.length;
            }
            return 0;
        } catch (error) {
            return 0;
        }
    }

    calculateAveragePerformance() {
        const perfMetrics = this.metrics.performanceMetrics;
        if (Object.keys(perfMetrics).length === 0) return null;

        return {
            LCP: perfMetrics.LCP || null,
            FID: perfMetrics.FID || null,
            CLS: perfMetrics.CLS || null
        };
    }

    getTopFeatures() {
        const features = Object.entries(this.metrics.featureUsage)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([feature, count]) => ({ feature, count }));

        return features;
    }

    storeReport(report) {
        try {
            const storageKey = 'shopResetKit_reports';
            const existingReports = JSON.parse(localStorage.getItem(storageKey) || '[]');

            // Keep only last 10 reports
            const updatedReports = [report, ...existingReports].slice(0, 10);

            localStorage.setItem(storageKey, JSON.stringify(updatedReports));
        } catch (error) {
            console.warn('Could not store monitoring report:', error);
        }
    }

    // Public methods for external access
    getMetrics() {
        return { ...this.metrics };
    }

    getEvents() {
        return [...this.events];
    }

    getStoredReports() {
        try {
            return JSON.parse(localStorage.getItem('shopResetKit_reports') || '[]');
        } catch (error) {
            return [];
        }
    }

    exportMonitoringData() {
        const exportData = {
            currentSession: this.generateReport(),
            historicalReports: this.getStoredReports(),
            exportedAt: new Date().toISOString()
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = `shop-reset-kit-analytics-${Date.now()}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();

        this.logEvent('monitoring_export', {
            reportCount: exportData.historicalReports.length,
            timestamp: Date.now()
        });
    }

    // Health check method
    healthCheck() {
        const health = {
            status: 'healthy',
            checks: {
                localStorage: this.testLocalStorage(),
                performance: this.testPerformanceAPI(),
                eventLogging: this.events.length > 0,
                errorRate: (this.metrics.errors / Math.max(1, this.events.length)) < 0.05
            },
            metrics: this.getMetrics(),
            uptime: Date.now() - this.startTime
        };

        // Determine overall health
        const failedChecks = Object.values(health.checks).filter(check => !check).length;
        if (failedChecks > 0) {
            health.status = failedChecks > 2 ? 'unhealthy' : 'degraded';
        }

        return health;
    }

    testLocalStorage() {
        try {
            const test = 'test';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            return false;
        }
    }

    testPerformanceAPI() {
        return 'performance' in window && 'now' in window.performance;
    }
}

// Initialize monitoring when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.shopResetMonitoring = new ShopResetMonitoring();
    });
} else {
    window.shopResetMonitoring = new ShopResetMonitoring();
}

// ES6 export for modern module systems
export default ShopResetMonitoring;
export { ShopResetMonitoring };