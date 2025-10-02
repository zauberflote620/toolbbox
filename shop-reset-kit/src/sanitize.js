/**
 * HTML Sanitization Utility
 * Prevents XSS attacks by sanitizing user input before rendering
 */

/**
 * Escapes HTML special characters to prevent XSS
 * @param {string} text - Raw text that may contain HTML
 * @returns {string} - Safely escaped text
 */
export function escapeHTML(text) {
  if (typeof text !== 'string') return '';

  // Manual escaping to avoid any HTML interpretation
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Creates a safe text node for DOM insertion
 * @param {string} text - Text to insert safely
 * @returns {Text} - DOM text node
 */
export function createSafeTextNode(text) {
  return document.createTextNode(text || '');
}

/**
 * Sanitizes HTML by stripping all tags except safe ones
 * @param {string} html - HTML string to sanitize
 * @returns {string} - Sanitized HTML
 */
export function sanitizeHTML(html) {
  if (typeof html !== 'string') return '';

  // Create temporary element
  const temp = document.createElement('div');
  temp.textContent = html;

  // Get the escaped version
  return temp.innerHTML;
}

/**
 * Creates a safe DOM element with sanitized content
 * @param {string} tagName - Element tag name
 * @param {string} textContent - Text content to set
 * @param {Object} attributes - Attributes to set
 * @returns {HTMLElement} - Safe DOM element
 */
export function createSafeElement(tagName, textContent, attributes = {}) {
  const element = document.createElement(tagName);

  // Set text content safely
  if (textContent) {
    element.textContent = textContent;
  }

  // Set attributes safely
  for (const [key, value] of Object.entries(attributes)) {
    // Only allow safe attributes
    const safeAttributes = ['class', 'id', 'data-', 'aria-', 'role', 'title', 'alt'];
    const isSafe = safeAttributes.some(safe => key.startsWith(safe) || key === safe);

    if (isSafe && typeof value === 'string') {
      element.setAttribute(key, value);
    }
  }

  return element;
}

/**
 * Safely sets inner HTML by escaping all content
 * Use this instead of element.innerHTML for user-generated content
 * @param {HTMLElement} element - Target element
 * @param {string} content - Content to set (will be escaped)
 */
export function setSafeHTML(element, content) {
  element.textContent = content;
}

/**
 * Validates and sanitizes URL to prevent javascript: protocol attacks
 * @param {string} url - URL to validate
 * @returns {string} - Safe URL or empty string
 */
export function sanitizeURL(url) {
  if (typeof url !== 'string') return '';

  const trimmed = url.trim().toLowerCase();

  // Block dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:'];
  if (dangerousProtocols.some(proto => trimmed.startsWith(proto))) {
    return '';
  }

  // Allow http, https, mailto, tel
  const safeProtocols = ['http://', 'https://', 'mailto:', 'tel:', '//', '/'];
  const isValid = safeProtocols.some(proto => trimmed.startsWith(proto)) ||
                  trimmed.match(/^[a-z0-9-]+\./); // domain.com format

  return isValid ? url : '';
}

export default {
  escapeHTML,
  createSafeTextNode,
  sanitizeHTML,
  createSafeElement,
  setSafeHTML,
  sanitizeURL
};