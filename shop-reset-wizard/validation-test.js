const fs = require('fs');
const path = require('path');

// Read HTML file
const htmlPath = path.join(__dirname, 'shop-reset-wizard.html');
const html = fs.readFileSync(htmlPath, 'utf8');

// Extract JavaScript code
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (!scriptMatch) {
    console.error('No script tag found!');
    process.exit(1);
}

const jsCode = scriptMatch[1];

// Basic syntax validation
try {
    new Function(jsCode);
    console.log('✓ JavaScript syntax is valid');
} catch (error) {
    console.error('✗ JavaScript syntax error:', error.message);
    process.exit(1);
}

// Check for critical functions
const criticalFunctions = [
    'runPhase0Validation',
    'calculateSlotScore',
    'runMultiFactorOptimization',
    'trafficFlow.setPoints',
    'priceLadder.analyzePriceDistribution',
    'vmTestData.loadTestData'
];

for (const fn of criticalFunctions) {
    if (jsCode.includes(fn)) {
        console.log('✓ Found critical function: ' + fn);
    } else {
        console.error('✗ Missing critical function: ' + fn);
    }
}

console.log('\nValidation complete!');
