// optimization-worker.js
// Web Worker for background optimization processing

const WEIGHTS = {
    salesPerSqFt: 0.5,
    crossSell: 0.3,
    visualFlow: 0.2
};

const IMPROVEMENT_THRESHOLD = 0.01;

// Handle messages from main thread
self.onmessage = function(e) {
    const { type, data } = e.data;

    if (type === 'OPTIMIZE') {
        const { products, fixtures, layout, maxIterations } = data;
        runOptimization(products, fixtures, layout, maxIterations);
    }
};

// Main optimization function
function runOptimization(products, fixtures, layout, maxIterations) {
    const startTime = Date.now();

    let iterations = 0;
    let swapsMade = 0;
    let currentLayout = layout;
    let currentObjective = calculateObjectiveFunction(currentLayout, products, fixtures);
    let bestLayout = currentLayout;
    let bestObjective = currentObjective;

    postMessage({
        type: 'LOG',
        message: `Starting optimization with ${products.length} products`
    });

    let improved = true;

    while (improved && iterations < maxIterations) {
        improved = false;
        iterations++;

        // Send progress update every 10 iterations
        if (iterations % 10 === 0) {
            const progress = Math.min((iterations / maxIterations) * 100, 100);
            postMessage({
                type: 'PROGRESS',
                progress: progress,
                iteration: iterations,
                currentScore: currentObjective.total
            });
        }

        // Try swapping products between fixtures
        const swapAttempts = Math.min(currentLayout.length * 2, 500);

        for (let attempt = 0; attempt < swapAttempts; attempt++) {
            // Random swap strategy for larger datasets
            const i = Math.floor(Math.random() * currentLayout.length);
            let j = Math.floor(Math.random() * currentLayout.length);

            // Ensure different indices and fixtures
            if (i === j || currentLayout[i].fixtureId === currentLayout[j].fixtureId) {
                continue;
            }

            // Create trial layout with swap
            const trialLayout = JSON.parse(JSON.stringify(currentLayout));
            const tempFixture = trialLayout[i].fixtureId;
            trialLayout[i].fixtureId = trialLayout[j].fixtureId;
            trialLayout[j].fixtureId = tempFixture;

            // Check constraints
            if (!meetsConstraints(trialLayout, products, fixtures)) {
                continue;
            }

            // Calculate new objective
            const trialObjective = calculateObjectiveFunction(trialLayout, products, fixtures);

            // Accept if improvement
            if (trialObjective.total > currentObjective.total + IMPROVEMENT_THRESHOLD) {
                currentLayout = trialLayout;
                currentObjective = trialObjective;
                swapsMade++;
                improved = true;

                if (currentObjective.total > bestObjective.total) {
                    bestLayout = currentLayout;
                    bestObjective = currentObjective;
                }

                break; // Move to next iteration after successful swap
            }
        }

        // Early termination check
        if (!improved) {
            break;
        }
    }

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    // Send final results
    postMessage({
        type: 'COMPLETE',
        result: {
            layout: bestLayout,
            objective: bestObjective,
            iterations: iterations,
            swapsMade: swapsMade,
            duration: duration
        }
    });
}

// Objective function calculation
function calculateObjectiveFunction(layout, products, fixtures) {
    const salesScore = calculateSalesPerSqFt(layout, products, fixtures);
    const crossSellScore = calculateCrossSellOpportunities(layout, products, fixtures);
    const visualFlowScore = calculateVisualFlow(layout, products, fixtures);

    const totalScore =
        (salesScore * WEIGHTS.salesPerSqFt) +
        (crossSellScore * WEIGHTS.crossSell) +
        (visualFlowScore * WEIGHTS.visualFlow);

    return {
        total: totalScore,
        sales: salesScore,
        crossSell: crossSellScore,
        visualFlow: visualFlowScore
    };
}

function calculateSalesPerSqFt(layout, products, fixtures) {
    let score = 0;

    fixtures.forEach(fixture => {
        const fixtureProducts = layout.filter(item => item.fixtureId === fixture.id);
        const fixtureArea = (fixture.width * fixture.height) / 100;

        let totalValue = 0;
        fixtureProducts.forEach(item => {
            const productValue = item.product.price * item.product.margin * item.product.salesVelocity;

            let trafficMultiplier = 1.0;
            if (fixture.trafficZone === 'high') trafficMultiplier = 1.5;
            else if (fixture.trafficZone === 'medium') trafficMultiplier = 1.2;

            totalValue += productValue * trafficMultiplier;
        });

        score += totalValue / fixtureArea;
    });

    return score;
}

function calculateCrossSellOpportunities(layout, products, fixtures) {
    let score = 0;

    layout.forEach(item1 => {
        const fixture1 = fixtures.find(f => f.id === item1.fixtureId);

        item1.product.crossSellWith.forEach(crossSellSku => {
            const item2 = layout.find(item => item.product.sku === crossSellSku);
            if (!item2) return;

            const fixture2 = fixtures.find(f => f.id === item2.fixtureId);

            const dx = fixture1.x - fixture2.x;
            const dy = fixture1.y - fixture2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) score += 100;
            else if (distance < 200) score += 50;
            else if (distance < 300) score += 20;
        });
    });

    return score;
}

function calculateVisualFlow(layout, products, fixtures) {
    let score = 100;

    const entranceFixtures = fixtures.filter(f => f.trafficZone === 'high');

    entranceFixtures.forEach(fixture => {
        const fixtureProducts = layout.filter(item => item.fixtureId === fixture.id);
        const highValueProducts = fixtureProducts.filter(item =>
            item.product.margin > 0.4 && item.product.salesVelocity > 50
        );

        const ratio = highValueProducts.length / (fixtureProducts.length || 1);
        score += ratio * 100;
    });

    const categoriesPerFixture = {};
    fixtures.forEach(fixture => {
        const fixtureProducts = layout.filter(item => item.fixtureId === fixture.id);
        const categories = new Set(fixtureProducts.map(item => item.product.category));
        categoriesPerFixture[fixture.id] = categories.size;
    });

    const avgCategories = Object.values(categoriesPerFixture).reduce((a, b) => a + b, 0) / fixtures.length;
    score += avgCategories * 20;

    return score;
}

function meetsConstraints(layout, products, fixtures) {
    for (let fixture of fixtures) {
        const fixtureProducts = layout.filter(item => item.fixtureId === fixture.id);
        const totalWeight = fixtureProducts.reduce((sum, item) => sum + item.product.weight, 0);

        if (totalWeight > fixture.capacity) {
            return false;
        }
    }

    return true;
}
