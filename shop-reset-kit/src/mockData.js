// Enhanced mock data for various retail scenarios
export const retailScenarios = {
  winterSeasonal: {
    shopName: "Winter Fashion Boutique",
    lastUpdated: "2024-01-15",
    methodology: "Anchor-and-Spokes",
    scenario: "Winter Seasonal Reset",
    sections: [
      {
        name: "Front Window",
        vmZone: "Prime Visibility",
        items: [
          { name: "Premium Winter Coats (Primary Anchor)", priority: "high", margin: "65%", velocity: "high" },
          { name: "Designer Scarves (Spoke)", priority: "medium", margin: "45%", velocity: "medium" },
          { name: "Winter Sale Banner", priority: "high", margin: "0%", velocity: "n/a" }
        ]
      },
      {
        name: "Main Floor - Center",
        vmZone: "Eye Level (60-72 inches)",
        items: [
          { name: "Cashmere Sweaters (Secondary Anchor)", priority: "high", margin: "70%", velocity: "medium" },
          { name: "Wool Accessories (Spoke)", priority: "medium", margin: "50%", velocity: "high" },
          { name: "Boot Display (Spoke)", priority: "medium", margin: "40%", velocity: "high" },
          { name: "Gift Card Station (Impulse)", priority: "high", margin: "100%", velocity: "high" }
        ]
      },
      {
        name: "Side Wall - Reach Zone",
        vmZone: "Reach Zone (48-60 inches)",
        items: [
          { name: "Mid-Range Jackets", priority: "medium", margin: "35%", velocity: "medium" },
          { name: "Thermal Underwear", priority: "low", margin: "25%", velocity: "low" },
          { name: "Winter Hats", priority: "medium", margin: "55%", velocity: "medium" }
        ]
      },
      {
        name: "Back Wall - Clearance",
        vmZone: "Stoop Zone (Below 48 inches)",
        items: [
          { name: "Summer Clearance Items", priority: "low", margin: "10%", velocity: "very low" },
          { name: "Bulk Storage Bins", priority: "low", margin: "0%", velocity: "n/a" }
        ]
      },
      {
        name: "Checkout Counter",
        vmZone: "Impulse Purchase Zone",
        items: [
          { name: "Hand Warmers (Impulse)", priority: "high", margin: "80%", velocity: "very high" },
          { name: "Lip Balm Display", priority: "medium", margin: "60%", velocity: "high" },
          { name: "Shopping Bags", priority: "high", margin: "90%", velocity: "high" }
        ]
      }
    ],
    vmRecommendations: [
      "Position winter coat anchors at eye level for maximum visibility",
      "Create winter vignettes with coat + scarf + boot combinations",
      "Use warm lighting to enhance winter merchandise appeal",
      "Maintain 36-inch clearance for heavy winter clothing shoppers",
      "Position impulse items near checkout for cold weather needs",
      "Review weekly - adjust based on temperature forecasts"
    ],
    trafficFlow: {
      primaryPath: "Main entrance → Front window → Center display → Checkout",
      secondaryPath: "Side entrance → Side wall → Center display → Back wall",
      dwellZones: ["Front window (2-3 min)", "Center display (5-7 min)", "Checkout (1-2 min)"],
      bottlenecks: ["Checkout counter during peak hours"]
    }
  },

  newArrivalsFocus: {
    shopName: "Trendy Fashion Hub",
    lastUpdated: "2024-01-15",
    methodology: "Anchor-and-Spokes",
    scenario: "New Arrivals Focus",
    sections: [
      {
        name: "Front Window",
        vmZone: "Prime Visibility",
        items: [
          { name: "Latest Designer Collection (Hero Anchor)", priority: "high", margin: "75%", velocity: "high" },
          { name: "Trend Accessories (Spoke)", priority: "high", margin: "55%", velocity: "high" },
          { name: "New Arrival Banner", priority: "high", margin: "0%", velocity: "n/a" }
        ]
      },
      {
        name: "Center Stage",
        vmZone: "Eye Level (60-72 inches)",
        items: [
          { name: "Signature Pieces (Primary Anchor)", priority: "high", margin: "70%", velocity: "medium" },
          { name: "Coordinating Separates (Spoke)", priority: "high", margin: "45%", velocity: "high" },
          { name: "Statement Jewelry (Spoke)", priority: "medium", margin: "65%", velocity: "medium" },
          { name: "Lookbook Display", priority: "medium", margin: "0%", velocity: "n/a" }
        ]
      },
      {
        name: "Try-On Zone",
        vmZone: "Interactive Experience",
        items: [
          { name: "Mix & Match Station", priority: "high", margin: "50%", velocity: "high" },
          { name: "Style Consultation Area", priority: "medium", margin: "0%", velocity: "n/a" },
          { name: "Social Media Photo Spot", priority: "medium", margin: "0%", velocity: "n/a" }
        ]
      }
    ],
    vmRecommendations: [
      "Position newest items at eye level in prime traffic zones",
      "Create complete outfit displays with anchor + spoke coordination",
      "Use dynamic lighting to highlight new arrival sections",
      "Implement social media integration for trend amplification",
      "Update displays weekly to maintain freshness perception",
      "Track conversion rates by new arrival category"
    ]
  },

  profitabilityFocus: {
    shopName: "Premium Retail Store",
    lastUpdated: "2024-01-15",
    methodology: "Anchor-and-Spokes",
    scenario: "High-Margin Profitability Focus",
    sections: [
      {
        name: "Luxury Showcase",
        vmZone: "Premium Zone (Stretch Level 72+ inches)",
        items: [
          { name: "Luxury Handbags (Premium Anchor)", priority: "high", margin: "85%", velocity: "low" },
          { name: "Designer Sunglasses (Spoke)", priority: "high", margin: "75%", velocity: "medium" },
          { name: "Silk Scarves (Spoke)", priority: "medium", margin: "70%", velocity: "low" }
        ]
      },
      {
        name: "Main Floor",
        vmZone: "Eye Level (60-72 inches)",
        items: [
          { name: "Premium Jewelry (High-Margin Anchor)", priority: "high", margin: "80%", velocity: "medium" },
          { name: "Luxury Watches (Spoke)", priority: "high", margin: "75%", velocity: "low" },
          { name: "Artisan Crafts (Spoke)", priority: "medium", margin: "65%", velocity: "low" }
        ]
      },
      {
        name: "Service Counter",
        vmZone: "Consultation Zone",
        items: [
          { name: "Personal Shopping Service", priority: "high", margin: "90%", velocity: "medium" },
          { name: "Gift Wrapping Station", priority: "medium", margin: "70%", velocity: "high" },
          { name: "Loyalty Program Sign-up", priority: "high", margin: "100%", velocity: "medium" }
        ]
      }
    ],
    vmRecommendations: [
      "Position highest-margin items in stretch zone for aspirational appeal",
      "Use premium display materials (glass, metal) for high-value items",
      "Implement security measures without compromising accessibility",
      "Train staff for consultative selling approach",
      "Track margin per square foot metrics weekly",
      "Create exclusive atmosphere with controlled lighting and spacing"
    ]
  }
};

export const vmPrinciples = {
  eyeLevel: {
    height: "60-72 inches",
    purpose: "Prime visibility for bestsellers and high-margin items",
    products: ["Anchor products", "Bestsellers", "High-margin items", "New arrivals"]
  },
  stretchZone: {
    height: "72+ inches",
    purpose: "Aspirational and premium positioning",
    products: ["Luxury items", "Premium brands", "Seasonal displays", "Decorative elements"]
  },
  reachZone: {
    height: "48-60 inches",
    purpose: "Everyday items and spoke products",
    products: ["Complementary items", "Accessories", "Medium-velocity products", "Cross-sell items"]
  },
  stoopZone: {
    height: "Below 48 inches",
    purpose: "Bulk items and clearance",
    products: ["Clearance items", "Bulk products", "Storage", "Low-velocity items"]
  }
};

export const trafficPatterns = {
  rightHandRule: "Customers naturally move to the right upon entering",
  dwellTime: {
    frontWindow: "2-3 minutes",
    mainDisplay: "5-7 minutes",
    checkout: "1-2 minutes",
    browsingArea: "3-5 minutes"
  },
  conversionZones: {
    high: ["Eye level center", "Checkout counter", "Front window"],
    medium: ["Side displays", "Secondary aisles", "Try-on areas"],
    low: ["Back walls", "Storage areas", "Clearance sections"]
  }
};

export function generateScenarioBasedPlan(goals, currentPlan) {
  const lowercaseGoals = goals.toLowerCase();

  if (lowercaseGoals.includes('winter') || lowercaseGoals.includes('seasonal')) {
    return {
      ...retailScenarios.winterSeasonal,
      originalPlan: currentPlan,
      generatedBy: "Scenario-Based AI"
    };
  }

  if (lowercaseGoals.includes('new') || lowercaseGoals.includes('arrival') || lowercaseGoals.includes('latest')) {
    return {
      ...retailScenarios.newArrivalsFocus,
      originalPlan: currentPlan,
      generatedBy: "Scenario-Based AI"
    };
  }

  if (lowercaseGoals.includes('profit') || lowercaseGoals.includes('margin') || lowercaseGoals.includes('premium')) {
    return {
      ...retailScenarios.profitabilityFocus,
      originalPlan: currentPlan,
      generatedBy: "Scenario-Based AI"
    };
  }

  // Default enhanced plan
  return enhanceExistingPlan(currentPlan, goals);
}

function enhanceExistingPlan(plan, goals) {
  const enhanced = JSON.parse(JSON.stringify(plan));
  enhanced.methodology = "Anchor-and-Spokes";
  enhanced.generatedBy = "Enhanced Planning AI";
  enhanced.vmRecommendations = [
    "Apply anchor-and-spokes methodology for improved customer flow",
    "Position high-velocity items at eye level (60-72 inches)",
    "Create cross-merchandising opportunities with spoke products",
    "Maintain clear sight lines throughout the store",
    "Review and adjust weekly based on performance metrics"
  ];

  return enhanced;
}