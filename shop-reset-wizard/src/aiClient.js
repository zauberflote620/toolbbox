// Enhanced AI client for shop reset planning with comprehensive analytics processing
import { generateScenarioBasedPlan, vmPrinciples, trafficPatterns } from './mockData.js';

export async function generateNewPlan(currentPlan, goals, apiKey) {
  // If no API key provided, return comprehensive scenario-based plan
  if (!apiKey || apiKey.trim() === '') {
    console.log("No API key provided. Using comprehensive scenario-based planning.");
    return generateScenarioBasedPlan(goals, currentPlan);
  }

  const MODEL_API_BASE_URL = 'https://api.openai.com/v1';
  const MODEL_NAME = 'gpt-3.5-turbo';

  const prompt = `You are a professional visual merchandising consultant specializing in the Anchor-and-Spokes methodology. Based on the current store plan and goals, generate an optimized plan following these VM principles:

VM ZONE GUIDELINES:
- Eye Level (60-72 inches): Bestsellers, high-margin items, anchor products
- Stretch Zone (72+ inches): Premium/aspirational items, seasonal displays
- Reach Zone (48-60 inches): Everyday items, spoke products, accessories
- Stoop Zone (Below 48 inches): Bulk items, clearance, storage

ANCHOR-AND-SPOKES METHODOLOGY:
- Anchor: Key products positioned in high-traffic zones
- Spokes: Complementary products clustered around anchors
- Traffic Flow: Right-hand traffic preference with clear sight lines
- Cross-Merchandising: Create complete solution displays

SAFETY & ACCESSIBILITY:
- Minimum 36-inch walkway clearance
- Secure display mounting
- Emergency exit accessibility

Current Plan: ${JSON.stringify(currentPlan, null, 2)}

User Goals: "${goals}"

Return ONLY the updated JSON object with methodology, vmRecommendations, trafficFlow, and enhanced section details:`;

  try {
    const response = await fetch(`${MODEL_API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Clean and parse the JSON response
    const jsonString = content.substring(content.indexOf('{'), content.lastIndexOf('}') + 1);
    const aiPlan = JSON.parse(jsonString);

    // Enhance with additional metadata
    return {
      ...aiPlan,
      generatedBy: 'OpenAI GPT-3.5-turbo',
      methodology: 'Anchor-and-Spokes',
      lastUpdated: new Date().toISOString().split('T')[0]
    };

  } catch (error) {
    console.error('Error fetching from AI API:', error);
    // Fallback to comprehensive scenario-based plan
    return generateScenarioBasedPlan(goals, currentPlan);
  }
}

// Analytics pattern recognition with advanced retail intelligence
export function analyzeRetailGoals(goals) {
  const lowercaseGoals = goals.toLowerCase();

  const patterns = {
    seasonal: {
      regex: /seasonal|winter|summer|spring|fall|holiday|christmas|valentine|easter/i,
      weight: 0.9,
      vmStrategy: 'seasonal_anchor_placement'
    },
    newArrivals: {
      regex: /new|arrival|latest|fresh|launch|debut|premiere/i,
      weight: 0.8,
      vmStrategy: 'front_and_center_positioning'
    },
    profitability: {
      regex: /profit|margin|expensive|premium|luxury|high.?end|upscale/i,
      weight: 0.95,
      vmStrategy: 'premium_zone_placement'
    },
    clearance: {
      regex: /clear|sale|discount|liquidate|markdown|closeout/i,
      weight: 0.6,
      vmStrategy: 'back_wall_positioning'
    },
    traffic: {
      regex: /flow|movement|entrance|path|circulation|navigation/i,
      weight: 0.7,
      vmStrategy: 'traffic_optimization'
    },
    safety: {
      regex: /safe|secure|accessible|clear|emergency|compliance/i,
      weight: 1.0,
      vmStrategy: 'safety_first_layout'
    },
    crossSell: {
      regex: /cross.?sell|upsell|basket|bundle|complement|pair/i,
      weight: 0.75,
      vmStrategy: 'anchor_spoke_clustering'
    },
    brandFocus: {
      regex: /brand|signature|feature|highlight|showcase|spotlight/i,
      weight: 0.8,
      vmStrategy: 'brand_hero_positioning'
    }
  };

  const detectedPatterns = Object.entries(patterns)
    .filter(([key, pattern]) => pattern.regex.test(lowercaseGoals))
    .map(([key, pattern]) => ({
      type: key,
      weight: pattern.weight,
      strategy: pattern.vmStrategy
    }))
    .sort((a, b) => b.weight - a.weight);

  return detectedPatterns;
}

// Generate VM recommendations based on goal analysis
export function generateVMRecommendations(goals, patterns) {
  const recommendations = [];

  patterns.forEach(pattern => {
    switch (pattern.strategy) {
      case 'seasonal_anchor_placement':
        recommendations.push('Position seasonal anchors at eye level (60-72 inches) for maximum visibility');
        recommendations.push('Create seasonal vignettes with coordinated spoke products');
        recommendations.push('Use seasonal lighting and color schemes to enhance appeal');
        break;

      case 'front_and_center_positioning':
        recommendations.push('Position new arrivals in front window and center floor locations');
        recommendations.push('Use "New Arrival" signage with clear sight lines from entrance');
        recommendations.push('Create complete outfit displays featuring new items as anchors');
        break;

      case 'premium_zone_placement':
        recommendations.push('Place high-margin items in stretch zone (72+ inches) for aspirational appeal');
        recommendations.push('Use premium display materials and controlled lighting');
        recommendations.push('Implement security measures without compromising accessibility');
        break;

      case 'back_wall_positioning':
        recommendations.push('Position clearance items in back wall stoop zone');
        recommendations.push('Use clear pricing and promotional signage');
        recommendations.push('Maintain organization to avoid cluttered appearance');
        break;

      case 'traffic_optimization':
        recommendations.push('Design right-hand traffic flow with clear sight lines');
        recommendations.push('Position anchors 8-12 feet from main entrance');
        recommendations.push('Create natural stopping points with anchor displays');
        break;

      case 'safety_first_layout':
        recommendations.push('Maintain minimum 36-inch walkway clearance');
        recommendations.push('Secure all displays with proper mounting hardware');
        recommendations.push('Ensure emergency exits remain clearly visible and accessible');
        break;

      case 'anchor_spoke_clustering':
        recommendations.push('Group complementary products around primary anchors');
        recommendations.push('Position cross-sell items within arm\'s reach of anchors');
        recommendations.push('Create complete solution displays to increase basket size');
        break;

      case 'brand_hero_positioning':
        recommendations.push('Feature signature brand items as primary anchors');
        recommendations.push('Use brand-consistent display materials and lighting');
        recommendations.push('Create brand story narrative through spoke product selection');
        break;
    }
  });

  // Add universal VM best practices
  recommendations.push('Review anchor placement weekly for effectiveness');
  recommendations.push('Monitor customer dwell time around anchor zones');
  recommendations.push('Track conversion rates by product category and position');
  recommendations.push('Adjust lighting to highlight key merchandise throughout the day');

  return [...new Set(recommendations)]; // Remove duplicates
}

// Performance metrics calculation
export function calculatePerformanceMetrics(plan) {
  const metrics = {
    anchorCount: 0,
    spokeCount: 0,
    eyeLevelUtilization: 0,
    premiumZoneItems: 0,
    trafficFlowScore: 0,
    crossSellOpportunities: 0,
    safetyCompliance: 100 // Default to compliant, would need actual assessment
  };

  plan.sections.forEach(section => {
    section.items.forEach(item => {
      if (item.name.includes('Anchor')) metrics.anchorCount++;
      if (item.name.includes('Spoke')) metrics.spokeCount++;
      if (item.priority === 'high') metrics.eyeLevelUtilization++;
      if (item.margin && parseFloat(item.margin) > 60) metrics.premiumZoneItems++;
    });
  });

  metrics.crossSellOpportunities = Math.min(metrics.anchorCount * 2, metrics.spokeCount);
  metrics.trafficFlowScore = Math.min((metrics.anchorCount / plan.sections.length) * 100, 100);

  return metrics;
}

// Export utility functions for testing
export { vmPrinciples, trafficPatterns };