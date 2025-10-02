/**
 * Accessibility Manager - v2.0.0
 * Comprehensive accessibility support for VM Planogram editing
 */

import { Fixture, Product, Point } from '../types';

export interface AccessibilityOptions {
  enableScreenReader: boolean;
  enableKeyboardNavigation: boolean;
  enableHighContrast: boolean;
  enableLargeText: boolean;
  enableMotionReduction: boolean;
  announceChanges: boolean;
  focusIndicatorStyle: 'default' | 'high-contrast' | 'thick';
}

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  description: string;
  action: () => void;
}

export interface AccessibilityState {
  focusedElement: string | null;
  selectionDescription: string;
  lastAnnouncement: string;
  keyboardMode: boolean;
}

/**
 * Manages accessibility features for the planogram editor
 */
export class AccessibilityManager {
  private options: AccessibilityOptions;
  private state: AccessibilityState;
  private shortcuts: Map<string, KeyboardShortcut> = new Map();
  private announcer: HTMLElement | null = null;
  private focusIndicator: HTMLElement | null = null;

  constructor(options: Partial<AccessibilityOptions> = {}) {
    this.options = {
      enableScreenReader: true,
      enableKeyboardNavigation: true,
      enableHighContrast: false,
      enableLargeText: false,
      enableMotionReduction: false,
      announceChanges: true,
      focusIndicatorStyle: 'default',
      ...options
    };

    this.state = {
      focusedElement: null,
      selectionDescription: '',
      lastAnnouncement: '',
      keyboardMode: false
    };

    this.initializeAccessibility();
    this.setupKeyboardShortcuts();
  }

  /**
   * Initialize accessibility features
   */
  private initializeAccessibility(): void {
    this.createScreenReaderAnnouncer();
    this.createFocusIndicator();
    this.setupEventListeners();
    this.applyAccessibilityStyles();
  }

  /**
   * Create hidden element for screen reader announcements
   */
  private createScreenReaderAnnouncer(): void {
    if (!this.options.enableScreenReader) return;

    this.announcer = document.createElement('div');
    this.announcer.setAttribute('aria-live', 'polite');
    this.announcer.setAttribute('aria-atomic', 'true');
    this.announcer.className = 'sr-only';
    this.announcer.style.cssText = `
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    `;

    document.body.appendChild(this.announcer);
  }

  /**
   * Create visual focus indicator
   */
  private createFocusIndicator(): void {
    if (!this.options.enableKeyboardNavigation) return;

    this.focusIndicator = document.createElement('div');
    this.focusIndicator.className = 'planogram-focus-indicator';
    this.updateFocusIndicatorStyle();
    this.focusIndicator.style.display = 'none';

    document.body.appendChild(this.focusIndicator);
  }

  /**
   * Update focus indicator styling based on options
   */
  private updateFocusIndicatorStyle(): void {
    if (!this.focusIndicator) return;

    const baseStyle = `
      position: absolute;
      pointer-events: none;
      z-index: 1000;
      border-radius: 4px;
      transition: all 0.2s ease;
    `;

    let style = baseStyle;

    switch (this.options.focusIndicatorStyle) {
      case 'high-contrast':
        style += `
          border: 3px solid #ffff00;
          background: rgba(255, 255, 0, 0.2);
          box-shadow: 0 0 8px #ffff00;
        `;
        break;
      case 'thick':
        style += `
          border: 4px solid #0066cc;
          background: rgba(0, 102, 204, 0.1);
        `;
        break;
      default:
        style += `
          border: 2px solid #0066cc;
          background: rgba(0, 102, 204, 0.1);
        `;
    }

    this.focusIndicator.style.cssText = style;
  }

  /**
   * Setup keyboard event listeners
   */
  private setupEventListeners(): void {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('keyup', this.handleKeyUp.bind(this));
    document.addEventListener('focusin', this.handleFocusIn.bind(this));
    document.addEventListener('focusout', this.handleFocusOut.bind(this));

    // Detect keyboard usage
    document.addEventListener('keydown', () => {
      this.state.keyboardMode = true;
    });

    document.addEventListener('mousedown', () => {
      this.state.keyboardMode = false;
    });
  }

  /**
   * Apply accessibility-related CSS styles
   */
  private applyAccessibilityStyles(): void {
    const style = document.createElement('style');
    style.textContent = this.generateAccessibilityCSS();
    document.head.appendChild(style);
  }

  /**
   * Generate CSS for accessibility features
   */
  private generateAccessibilityCSS(): string {
    let css = `
      /* Screen reader only text */
      .sr-only {
        position: absolute !important;
        width: 1px !important;
        height: 1px !important;
        padding: 0 !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0, 0, 0, 0) !important;
        white-space: nowrap !important;
        border: 0 !important;
      }

      /* Skip links */
      .skip-link {
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        z-index: 1001;
        border-radius: 4px;
      }

      .skip-link:focus {
        top: 6px;
      }

      /* Focus indicators */
      .planogram-element:focus {
        outline: 2px solid #0066cc;
        outline-offset: 2px;
      }

      /* Keyboard mode enhancements */
      .keyboard-mode .planogram-element:focus {
        outline: 3px solid #0066cc;
        outline-offset: 3px;
      }
    `;

    if (this.options.enableHighContrast) {
      css += `
        .high-contrast {
          filter: contrast(150%) brightness(120%);
        }

        .high-contrast .fixture {
          border-width: 2px !important;
        }

        .high-contrast .product {
          border-width: 1px !important;
        }
      `;
    }

    if (this.options.enableLargeText) {
      css += `
        .large-text {
          font-size: 1.2em !important;
          line-height: 1.5 !important;
        }

        .large-text .fixture-label {
          font-size: 14px !important;
        }

        .large-text .product-label {
          font-size: 12px !important;
        }
      `;
    }

    if (this.options.enableMotionReduction) {
      css += `
        .reduce-motion * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      `;
    }

    return css;
  }

  /**
   * Setup keyboard shortcuts
   */
  private setupKeyboardShortcuts(): void {
    // Navigation shortcuts
    this.addShortcut('ArrowUp', false, false, false, 'Move selection up', () => {
      this.navigateSelection('up');
    });

    this.addShortcut('ArrowDown', false, false, false, 'Move selection down', () => {
      this.navigateSelection('down');
    });

    this.addShortcut('ArrowLeft', false, false, false, 'Move selection left', () => {
      this.navigateSelection('left');
    });

    this.addShortcut('ArrowRight', false, false, false, 'Move selection right', () => {
      this.navigateSelection('right');
    });

    // Action shortcuts
    this.addShortcut('Enter', false, false, false, 'Activate selected element', () => {
      this.activateSelection();
    });

    this.addShortcut('Space', false, false, false, 'Toggle selection', () => {
      this.toggleSelection();
    });

    this.addShortcut('Escape', false, false, false, 'Clear selection', () => {
      this.clearSelection();
    });

    // Zoom shortcuts
    this.addShortcut('=', true, false, false, 'Zoom in', () => {
      this.announceAction('Zooming in');
    });

    this.addShortcut('-', true, false, false, 'Zoom out', () => {
      this.announceAction('Zooming out');
    });

    this.addShortcut('0', true, false, false, 'Reset zoom', () => {
      this.announceAction('Reset zoom to 100%');
    });

    // Help shortcut
    this.addShortcut('h', true, false, false, 'Show help', () => {
      this.showKeyboardHelp();
    });
  }

  /**
   * Add a keyboard shortcut
   */
  private addShortcut(
    key: string,
    ctrlKey: boolean,
    shiftKey: boolean,
    altKey: boolean,
    description: string,
    action: () => void
  ): void {
    const shortcutKey = this.getShortcutKey(key, ctrlKey, shiftKey, altKey);
    this.shortcuts.set(shortcutKey, {
      key,
      ctrlKey,
      shiftKey,
      altKey,
      description,
      action
    });
  }

  /**
   * Handle keyboard events
   */
  private handleKeyDown(event: KeyboardEvent): void {
    const shortcutKey = this.getShortcutKey(
      event.key,
      event.ctrlKey,
      event.shiftKey,
      event.altKey
    );

    const shortcut = this.shortcuts.get(shortcutKey);
    if (shortcut && this.options.enableKeyboardNavigation) {
      event.preventDefault();
      shortcut.action();
    }
  }

  private handleKeyUp(event: KeyboardEvent): void {
    // Handle key up events if needed
  }

  private handleFocusIn(event: FocusEvent): void {
    if (this.state.keyboardMode && event.target instanceof HTMLElement) {
      this.updateFocusIndicator(event.target);
      this.announceElement(event.target);
    }
  }

  private handleFocusOut(event: FocusEvent): void {
    if (this.focusIndicator) {
      this.focusIndicator.style.display = 'none';
    }
  }

  /**
   * Generate shortcut key string
   */
  private getShortcutKey(key: string, ctrlKey: boolean, shiftKey: boolean, altKey: boolean): string {
    const modifiers = [];
    if (ctrlKey) modifiers.push('ctrl');
    if (shiftKey) modifiers.push('shift');
    if (altKey) modifiers.push('alt');

    return `${modifiers.join('+')}-${key.toLowerCase()}`;
  }

  /**
   * Update focus indicator position
   */
  private updateFocusIndicator(element: HTMLElement): void {
    if (!this.focusIndicator) return;

    const rect = element.getBoundingClientRect();
    this.focusIndicator.style.display = 'block';
    this.focusIndicator.style.left = `${rect.left - 4}px`;
    this.focusIndicator.style.top = `${rect.top - 4}px`;
    this.focusIndicator.style.width = `${rect.width + 8}px`;
    this.focusIndicator.style.height = `${rect.height + 8}px`;
  }

  /**
   * Announce element information to screen readers
   */
  announceElement(element: HTMLElement): void {
    if (!this.options.announceChanges || !this.announcer) return;

    const description = this.getElementDescription(element);
    this.announce(description);
  }

  /**
   * Make an announcement to screen readers
   */
  announce(message: string): void {
    if (!this.options.announceChanges || !this.announcer) return;

    this.state.lastAnnouncement = message;
    this.announcer.textContent = message;

    // Clear after a delay to ensure it's read
    setTimeout(() => {
      if (this.announcer) {
        this.announcer.textContent = '';
      }
    }, 1000);
  }

  /**
   * Announce an action being performed
   */
  announceAction(action: string): void {
    this.announce(action);
  }

  /**
   * Get description of an element for screen readers
   */
  private getElementDescription(element: HTMLElement): string {
    const role = element.getAttribute('role') || 'element';
    const label = element.getAttribute('aria-label') ||
                  element.getAttribute('title') ||
                  element.textContent?.trim() ||
                  'unlabeled';

    return `${role}: ${label}`;
  }

  /**
   * Navigation methods
   */
  private navigateSelection(direction: 'up' | 'down' | 'left' | 'right'): void {
    this.announceAction(`Moving selection ${direction}`);
    // Implementation would depend on the specific planogram structure
  }

  private activateSelection(): void {
    this.announceAction('Activating selected element');
    // Implementation would trigger the appropriate action
  }

  private toggleSelection(): void {
    this.announceAction('Toggling selection');
    // Implementation would toggle the current selection
  }

  private clearSelection(): void {
    this.announceAction('Clearing selection');
    // Implementation would clear all selections
  }

  /**
   * Show keyboard help dialog
   */
  private showKeyboardHelp(): void {
    const shortcuts = Array.from(this.shortcuts.values());
    const helpContent = shortcuts.map(shortcut => {
      const keys = [];
      if (shortcut.ctrlKey) keys.push('Ctrl');
      if (shortcut.shiftKey) keys.push('Shift');
      if (shortcut.altKey) keys.push('Alt');
      keys.push(shortcut.key);

      return `${keys.join(' + ')}: ${shortcut.description}`;
    }).join('\n');

    this.announce('Keyboard shortcuts help displayed');
    // Could display in a modal or dedicated help panel
    console.log('Keyboard Shortcuts:\n' + helpContent);
  }

  /**
   * Describe fixture for accessibility
   */
  describeFixture(fixture: Fixture): string {
    const products = fixture.products?.length || 0;
    const zone = fixture.vmZone.replace('_', ' ');
    const compliance = fixture.complianceStatus;

    return `${fixture.type} fixture in ${zone} zone, ${products} products, ${compliance} compliance status`;
  }

  /**
   * Describe product for accessibility
   */
  describeProduct(product: Product): string {
    const facings = product.facings || 1;
    const price = product.price ? `$${product.price.toFixed(2)}` : 'no price';

    return `${product.name}, ${facings} facings, ${price}`;
  }

  /**
   * Update accessibility options
   */
  updateOptions(options: Partial<AccessibilityOptions>): void {
    this.options = { ...this.options, ...options };
    this.updateFocusIndicatorStyle();
    this.applyAccessibilityStyles();
  }

  /**
   * Get current accessibility state
   */
  getState(): AccessibilityState {
    return { ...this.state };
  }

  /**
   * Get available keyboard shortcuts
   */
  getKeyboardShortcuts(): KeyboardShortcut[] {
    return Array.from(this.shortcuts.values());
  }

  /**
   * Check if a feature is enabled
   */
  isFeatureEnabled(feature: keyof AccessibilityOptions): boolean {
    return this.options[feature];
  }

  /**
   * Cleanup resources
   */
  dispose(): void {
    if (this.announcer && this.announcer.parentNode) {
      this.announcer.parentNode.removeChild(this.announcer);
    }

    if (this.focusIndicator && this.focusIndicator.parentNode) {
      this.focusIndicator.parentNode.removeChild(this.focusIndicator);
    }

    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
    document.removeEventListener('keyup', this.handleKeyUp.bind(this));
    document.removeEventListener('focusin', this.handleFocusIn.bind(this));
    document.removeEventListener('focusout', this.handleFocusOut.bind(this));

    this.shortcuts.clear();
  }
}