# Communication Bridge Integration Guide

**Status**: Phase 1 Complete - Standalone Demo Validated
**Date**: 2025-10-01
**Demo File**: `communication-bridge-demo.html`

## Overview

This guide explains how to integrate the validated communication bridge from the standalone demo into the main shop-reset-kit React application.

## Demo Features Implemented

### ✓ 8 Message Types

1. **LAYOUT_DATA** - Store dimensions and fixture positions
2. **PRODUCT_LIST** - Product catalog with SKU, pricing, margins
3. **OPTIMIZATION_REQUEST** - Methodology and constraints for optimization
4. **OPTIMIZATION_RESULT** - Optimized product placements with scores
5. **VISUAL_UPDATE** - Highlighting and annotations for Excalidraw
6. **USER_ACTION** - Drag, click, edit actions from user
7. **ERROR** - Error reporting with codes and details
8. **HEALTH_CHECK** - Ping-pong system for connection monitoring

### ✓ Message Validation

- JSON schema validation for all message types
- Required field checking
- Custom validation functions per message type
- Clear error messages with field-level details

### ✓ Retry Logic

- Configurable max retries (default: 3)
- Exponential backoff delay (default: 2 seconds)
- Attempt counting and logging
- Graceful failure handling

### ✓ Health Check System

- 5-second ping interval
- Automatic pong responses
- Connection status indicators
- Start/stop toggle functionality

### ✓ Statistics Tracking

- Messages sent counter
- Messages received counter
- Error counter
- Health check counter

## Integration Steps

### Step 1: Extract Core Communication Module

Create `src/services/communicationBridge.js`:

```javascript
/**
 * Extract the following from communication-bridge-demo.html:
 * - MessageTypes constant
 * - MessageSchemas constant
 * - validateMessage function
 * - sendMessageWithRetry function
 * - Health check functions
 */

export const MessageTypes = {
    LAYOUT_DATA: 'LAYOUT_DATA',
    PRODUCT_LIST: 'PRODUCT_LIST',
    OPTIMIZATION_REQUEST: 'OPTIMIZATION_REQUEST',
    OPTIMIZATION_RESULT: 'OPTIMIZATION_RESULT',
    VISUAL_UPDATE: 'VISUAL_UPDATE',
    USER_ACTION: 'USER_ACTION',
    ERROR: 'ERROR',
    HEALTH_CHECK: 'HEALTH_CHECK'
};

// Copy MessageSchemas, validateMessage, etc. from demo
```

### Step 2: Create React Hook for Communication

Create `src/hooks/useExcalidrawBridge.js`:

```javascript
import { useState, useEffect, useCallback } from 'react';
import { MessageTypes, validateMessage } from '../services/communicationBridge';

export function useExcalidrawBridge() {
    const [isConnected, setIsConnected] = useState(false);
    const [lastMessage, setLastMessage] = useState(null);

    // Set up postMessage listener
    useEffect(() => {
        function handleMessage(event) {
            // Validate origin in production
            // if (event.origin !== expectedOrigin) return;

            const validation = validateMessage(event.data);
            if (validation.valid) {
                setLastMessage(event.data);
                // Handle different message types
                handleReceivedMessage(event.data);
            }
        }

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    // Send message to parent (Excalidraw)
    const sendToExcalidraw = useCallback((message) => {
        const validation = validateMessage(message);
        if (!validation.valid) {
            console.error('Invalid message:', validation.error);
            return;
        }

        window.parent.postMessage(message, '*'); // Use specific origin in production
    }, []);

    return {
        isConnected,
        lastMessage,
        sendToExcalidraw
    };
}
```

### Step 3: Integrate into Main App Component

Update `src/App.jsx`:

```javascript
import { useExcalidrawBridge } from './hooks/useExcalidrawBridge';
import { MessageTypes } from './services/communicationBridge';

function App() {
    const { isConnected, lastMessage, sendToExcalidraw } = useExcalidrawBridge();

    // Handle optimization request
    useEffect(() => {
        if (lastMessage?.type === MessageTypes.OPTIMIZATION_REQUEST) {
            handleOptimization(lastMessage.payload);
        }
    }, [lastMessage]);

    function handleOptimization(payload) {
        // Run optimization algorithm
        const result = runOptimization(payload);

        // Send result back to Excalidraw
        sendToExcalidraw({
            type: MessageTypes.OPTIMIZATION_RESULT,
            payload: result,
            timestamp: Date.now()
        });
    }

    return (
        <div className="app">
            <div className="connection-status">
                {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
            </div>
            {/* Rest of app */}
        </div>
    );
}
```

### Step 4: Create Excalidraw Plugin Script

Create `excalidraw-plugin.js` for Obsidian Excalidraw plugin:

```javascript
// This script runs in the Excalidraw plugin context
const iframe = document.querySelector('iframe.react-app');

// Send layout data to React app
function sendLayoutToReact() {
    const layoutData = {
        type: 'LAYOUT_DATA',
        payload: {
            storeDimensions: extractStoreDimensions(),
            fixtures: extractFixtures()
        },
        timestamp: Date.now()
    };

    iframe.contentWindow.postMessage(layoutData, '*');
}

// Listen for results from React app
window.addEventListener('message', (event) => {
    if (event.data.type === 'OPTIMIZATION_RESULT') {
        // Update Excalidraw drawing with results
        applyOptimizationResults(event.data.payload);
    }
});
```

## Message Type Usage Examples

### Sending from Excalidraw to React

```javascript
// When user draws store layout
sendToReact({
    type: MessageTypes.LAYOUT_DATA,
    payload: {
        storeDimensions: { width: 1200, height: 800, unit: 'inches' },
        fixtures: [/* fixture array */]
    },
    timestamp: Date.now()
});

// When user uploads product list
sendToReact({
    type: MessageTypes.PRODUCT_LIST,
    payload: {
        products: [/* product array */]
    },
    timestamp: Date.now()
});

// When user clicks "Optimize"
sendToReact({
    type: MessageTypes.OPTIMIZATION_REQUEST,
    payload: {
        methodology: 'Anchor-and-Spokes',
        constraints: { minAisleWidth: 42, maxShelfWeight: 500 },
        objectives: { salesPerSqFt: 0.5, crossSell: 0.3, visualFlow: 0.2 }
    },
    timestamp: Date.now()
});
```

### Sending from React to Excalidraw

```javascript
// After optimization completes
sendToExcalidraw({
    type: MessageTypes.OPTIMIZATION_RESULT,
    payload: {
        placements: [/* placement array */],
        score: 0.883,
        metrics: { estimatedSalesPerSqFt: 45.2, crossSellOpportunities: 12 }
    },
    timestamp: Date.now()
});

// To highlight elements
sendToExcalidraw({
    type: MessageTypes.VISUAL_UPDATE,
    payload: {
        updates: [
            { type: 'highlight', elementId: 'fixture-1', color: '#4caf50' }
        ]
    },
    timestamp: Date.now()
});

// To report errors
sendToExcalidraw({
    type: MessageTypes.ERROR,
    payload: {
        code: 'OPTIMIZATION_FAILED',
        message: 'Cannot place all products within constraints',
        details: { failedProducts: ['PROD-004'] }
    },
    timestamp: Date.now()
});
```

## Security Considerations

### Production Implementation

**Origin Validation**:
```javascript
function handleMessage(event) {
    const allowedOrigins = ['https://excalidraw.com', 'http://localhost:5173'];
    if (!allowedOrigins.includes(event.origin)) {
        console.warn('Message from unauthorized origin:', event.origin);
        return;
    }
    // Process message
}
```

**Message Sanitization**:
- All message payloads validated before processing
- No eval() or innerHTML usage with message data
- Size limits on payload data
- Rate limiting on message frequency

## Testing Strategy

### Unit Tests

Test file: `src/__tests__/communicationBridge.test.js`

```javascript
import { validateMessage, MessageTypes } from '../services/communicationBridge';

describe('Communication Bridge', () => {
    test('validates LAYOUT_DATA message correctly', () => {
        const message = {
            type: MessageTypes.LAYOUT_DATA,
            payload: {
                storeDimensions: { width: 1200, height: 800 },
                fixtures: []
            }
        };
        const result = validateMessage(message);
        expect(result.valid).toBe(true);
    });

    test('rejects message with invalid type', () => {
        const message = { type: 'INVALID_TYPE', payload: {} };
        const result = validateMessage(message);
        expect(result.valid).toBe(false);
        expect(result.error).toContain('Invalid message type');
    });
});
```

### Integration Tests

Test file: `src/__tests__/excalidrawBridge.integration.test.js`

```javascript
import { render, waitFor } from '@testing-library/react';
import App from '../App';

describe('Excalidraw Bridge Integration', () => {
    test('receives and processes OPTIMIZATION_REQUEST', async () => {
        render(<App />);

        // Simulate message from parent window
        window.postMessage({
            type: 'OPTIMIZATION_REQUEST',
            payload: {
                methodology: 'Anchor-and-Spokes',
                constraints: {},
                objectives: {}
            }
        }, '*');

        await waitFor(() => {
            // Verify response was sent
            expect(mockPostMessage).toHaveBeenCalledWith(
                expect.objectContaining({ type: 'OPTIMIZATION_RESULT' }),
                '*'
            );
        });
    });
});
```

## Performance Considerations

### Message Queue Management

- Maximum queue size: 100 messages
- Oldest messages dropped when queue full
- Priority queue for health checks
- Batching for high-frequency updates

### Retry Configuration

```javascript
const retryConfig = {
    maxRetries: 3,
    baseDelay: 2000, // 2 seconds
    maxDelay: 10000, // 10 seconds max
    backoffFactor: 1.5 // Exponential backoff
};
```

### Health Check Optimization

- 5-second interval (configurable)
- Suspend during user inactivity
- Resume on user interaction
- Timeout detection: 15 seconds (3 missed pings)

## Troubleshooting

### Common Issues

**Issue**: Messages not received
- Check origin validation
- Verify iframe loaded completely
- Check browser console for errors
- Confirm postMessage target is correct

**Issue**: Validation failures
- Check message structure matches schema
- Verify all required fields present
- Check data types match expectations
- Review validation error message

**Issue**: Health check failures
- Verify health check interval started
- Check if iframe is responsive
- Review network tab for blocking issues
- Confirm event listeners attached

## Next Steps

1. **Phase 2**: Implement Anchor-and-Spokes methodology
2. **Phase 3**: Build optimization algorithm
3. **Phase 4**: Create full UI with setup wizard
4. **Phase 5**: Comprehensive testing

## Demo File Location

**File**: `/Volumes/pi_ext_drive/obsidian/Toolbox/shop-reset-kit/communication-bridge-demo.html`

**How to Test**:
1. Open demo file in browser
2. Click buttons to send different message types
3. Observe message logs in both panels
4. Check statistics counters
5. Toggle health check to see ping-pong
6. Try sending invalid message to test validation

**Expected Behavior**:
- Messages appear in logs within 500ms
- Validation errors show in red
- Health checks run every 5 seconds when enabled
- Statistics update in real-time
- Schema displays for each message sent

---

**Phase 1 Status**: COMPLETE ✓
**Communication Bridge**: VALIDATED ✓
**Ready for Phase 2**: YES ✓
