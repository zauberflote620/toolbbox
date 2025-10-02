interface AnalyticsInsight {
  text: string;
  type: 'sales_trend' | 'profitability' | 'relationship' | 'seasonality' | 'urgency';
  confidence: number;
  entities: string[];
  value?: number;
  timeframe?: string;
}

interface PlacementRule {
  type: 'sales_trend' | 'profitability' | 'cross_sell' | 'seasonality' | 'clearance';
  confidence: number;
  productIds: string[];
  action: 'promote' | 'eye_level' | 'adjacent_to' | 'clear' | 'feature';
  zone?: 'EYE' | 'REACH' | 'STRETCH' | 'STOOP';
  reasoning: string;
}

export class AnalyticsService {
  private keywordWeights = {
    // High impact indicators
    'bestseller': 0.95,
    'top seller': 0.95,
    'highest margin': 0.9,
    'high profit': 0.85,
    'trending': 0.8,
    'popular': 0.7,
    'in demand': 0.75,

    // Relationships
    'cross sell': 0.8,
    'bundle': 0.75,
    'together': 0.7,
    'complement': 0.7,

    // Urgency
    'clearance': 0.9,
    'discontinue': 0.95,
    'liquidate': 0.95,
    'overstocked': 0.8,

    // Seasonal
    'seasonal': 0.7,
    'holiday': 0.75,
    'limited time': 0.8
  };

  private vmZoneStrategy = {
    'high_margin': 'EYE',
    'bestseller': 'EYE',
    'trending': 'EYE',
    'clearance': 'STOOP',
    'slow_moving': 'STOOP',
    'seasonal': 'REACH',
    'complementary': 'REACH',
    'impulse': 'EYE'
  };

  private patterns = {
    salesTrend: [
      /(\w+(?:\s+\w+)*)\s+(?:up|increased?|rose|grew|gaining|trending)\s+(?:by\s+)?(\d+(?:\.\d+)?)%/gi,
      /(\w+(?:\s+\w+)*)\s+(?:down|decreased?|fell|dropped|declining)\s+(?:by\s+)?(\d+(?:\.\d+)?)%/gi,
      /(\d+(?:\.\d+)?)%\s+(?:increase|rise|growth|gain)\s+in\s+(\w+(?:\s+\w+)*)/gi,
      /(\w+(?:\s+\w+)*)\s+sales?\s+(?:are\s+)?(?:up|increasing|growing)\s+(\d+(?:\.\d+)?)%/gi,
      /(\w+(?:\s+\w+)*)\s+(?:is|are)\s+(?:the\s+)?(?:bestselling|top.selling|best.performing)/gi,
    ],
    profitability: [
      /(\w+(?:\s+\w+)*)\s+(?:are|is)\s+(?:the\s+)?(?:highest|best|top|most\s+profitable)\s+(?:margin|profit|revenue)/gi,
      /(?:highest|best|top|most\s+profitable)\s+(?:margin|profit|revenue).*?(?:is|are)\s+(\w+(?:\s+\w+)*)/gi,
      /(\w+(?:\s+\w+)*)\s+(?:margin|profit|markup)\s+(?:of|at|is)\s+(\d+(?:\.\d+)?)%/gi,
      /(\w+(?:\s+\w+)*)\s+(?:generates?|brings?\s+in|makes?)\s+(?:the\s+)?(?:most|highest)\s+(?:profit|revenue|margin)/gi,
    ],
    relationships: [
      /customers?\s+who\s+buy\s+(\w+(?:\s+\w+)*)\s+(?:also\s+|often\s+|usually\s+|typically\s+)?(?:buy|purchase|get)\s+(\w+(?:\s+\w+)*)/gi,
      /(\w+(?:\s+\w+)*)\s+and\s+(\w+(?:\s+\w+)*)\s+(?:are\s+)?(?:bought|purchased|sold)\s+together/gi,
      /(?:cross[- ]sell|bundle|pair|match)\s+(\w+(?:\s+\w+)*)\s+(?:with|and)\s+(\w+(?:\s+\w+)*)/gi,
      /(\w+(?:\s+\w+)*)\s+(?:complements?|goes?\s+well\s+with|pairs?\s+with)\s+(\w+(?:\s+\w+)*)/gi,
    ],
    seasonality: [
      /(winter|summer|spring|fall|autumn|holiday|christmas|thanksgiving|valentine|easter)\s+(\w+(?:\s+\w+)*)/gi,
      /(\w+(?:\s+\w+)*)\s+(?:for|during|in)\s+(winter|summer|spring|fall|autumn|holiday|christmas|thanksgiving)/gi,
      /(\w+(?:\s+\w+)*)\s+(?:is|are)\s+seasonal/gi,
    ],
    urgency: [
      /(?:clear|liquidate|remove|discontinue|phase\s+out)\s+(\w+(?:\s+\w+)*)/gi,
      /(\w+(?:\s+\w+)*)\s+(?:need|needs)\s+(?:to\s+)?(?:be\s+)?(?:cleared|liquidated|removed|discontinued)/gi,
      /(?:overstocked|excess\s+inventory)\s+(?:of\s+)?(\w+(?:\s+\w+)*)/gi,
      /(\w+(?:\s+\w+)*)\s+(?:is|are)\s+(?:slow.moving|not\s+selling|sitting)/gi,
    ],
    location: [
      /(?:place|put|position|locate)\s+(\w+(?:\s+\w+)*)\s+(?:near|next\s+to|beside|by)\s+(\w+(?:\s+\w+)*)/gi,
      /(\w+(?:\s+\w+)*)\s+(?:should\s+be|belongs|goes)\s+(?:in|at|near)\s+(?:the\s+)?(\w+(?:\s+\w+)*)/gi,
      /(?:front|back|entrance|checkout|register|window)\s+(?:display|area|section)/gi,
    ],
    intensity: [
      /(\w+(?:\s+\w+)*)\s+(?:is|are)\s+(?:extremely|very|highly|most|top)\s+(?:popular|important|profitable)/gi,
      /(?:critical|essential|must.have|priority)\s+(\w+(?:\s+\w+)*)/gi,
    ]
  };

  private calculateConfidence(text: string, matches: RegExpMatchArray, type: string): number {
    let baseConfidence = 0.5;

    // Check for specific confidence indicators
    const confidenceBoosts = {
      percentage: /\d+(?:\.\d+)?%/.test(text) ? 0.2 : 0,
      specificity: matches[1]?.split(' ').length > 1 ? 0.1 : 0,
      context: this.hasBusinessContext(text) ? 0.15 : 0,
      keywords: this.calculateKeywordBoost(text)
    };

    return Math.min(0.95, baseConfidence + Object.values(confidenceBoosts).reduce((a, b) => a + b, 0));
  }

  private hasBusinessContext(text: string): boolean {
    const businessTerms = ['sales', 'revenue', 'profit', 'margin', 'customer', 'product', 'inventory', 'performance'];
    return businessTerms.some(term => text.toLowerCase().includes(term));
  }

  private calculateKeywordBoost(text: string): number {
    let boost = 0;
    const lowerText = text.toLowerCase();

    Object.entries(this.keywordWeights).forEach(([keyword, weight]) => {
      if (lowerText.includes(keyword.toLowerCase())) {
        boost += weight * 0.1; // Scale down the boost
      }
    });

    return Math.min(0.3, boost); // Cap the boost
  }

  private determineVMZone(insight: AnalyticsInsight): 'EYE' | 'REACH' | 'STRETCH' | 'STOOP' {
    const text = insight.text.toLowerCase();

    // High priority items go to eye level
    if (insight.type === 'profitability' ||
        text.includes('bestseller') ||
        text.includes('high margin') ||
        (insight.type === 'sales_trend' && insight.value && insight.value > 20)) {
      return 'EYE';
    }

    // Clearance and slow items go to stoop
    if (insight.type === 'urgency' ||
        text.includes('clearance') ||
        text.includes('slow')) {
      return 'STOOP';
    }

    // Seasonal and complementary items in reach zone
    if (insight.type === 'seasonality' ||
        insight.type === 'relationship') {
      return 'REACH';
    }

    // Default to reach zone
    return 'REACH';
  }

  private extractNumericValue(match: RegExpMatchArray): number | undefined {
    for (let i = 1; i < match.length; i++) {
      const num = parseFloat(match[i]);
      if (!isNaN(num)) {
        return num;
      }
    }
    return undefined;
  }

  parseAnalyticsText(text: string): AnalyticsInsight[] {
    const insights: AnalyticsInsight[] = [];
    const processedSentences = new Set<string>();

    // Split into sentences for better parsing
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);

    sentences.forEach(sentence => {
      if (processedSentences.has(sentence.trim())) return;
      processedSentences.add(sentence.trim());

      // Parse each pattern type
      Object.entries(this.patterns).forEach(([patternType, patterns]) => {
        patterns.forEach(pattern => {
          let match;
          while ((match = pattern.exec(sentence)) !== null) {
            const confidence = this.calculateConfidence(sentence, match, patternType);

            if (confidence > 0.3) { // Only include high-confidence insights
              let insight: AnalyticsInsight;

              switch (patternType) {
                case 'salesTrend':
                  const isIncrease = /up|increased?|rose|grew|increase|rise|growth|gaining|trending/i.test(match[0]);
                  const value = this.extractNumericValue(match);
                  insight = {
                    text: match[0],
                    type: 'sales_trend',
                    confidence,
                    entities: [match[1] || match[4]].filter(Boolean),
                    value: value && isIncrease ? value : value ? -value : undefined,
                  };
                  break;

                case 'profitability':
                  insight = {
                    text: match[0],
                    type: 'profitability',
                    confidence,
                    entities: [match[1]].filter(Boolean),
                    value: this.extractNumericValue(match),
                  };
                  break;

                case 'relationships':
                  insight = {
                    text: match[0],
                    type: 'relationship',
                    confidence,
                    entities: [match[1], match[2]].filter(Boolean),
                  };
                  break;

                case 'seasonality':
                  insight = {
                    text: match[0],
                    type: 'seasonality',
                    confidence,
                    entities: [match[2] || match[1]].filter(Boolean),
                    timeframe: match[1] || match[2],
                  };
                  break;

                case 'urgency':
                  insight = {
                    text: match[0],
                    type: 'urgency',
                    confidence,
                    entities: [match[1]].filter(Boolean),
                  };
                  break;

                default:
                  return; // Skip unknown pattern types
              }

              insights.push(insight);
            }
          }
        });
      });
    });

    return insights;
  }

  generatePlacementRules(insights: AnalyticsInsight[]): PlacementRule[] {
    const rules: PlacementRule[] = [];

    // Sort insights by confidence and priority
    const sortedInsights = [...insights].sort((a, b) => {
      const priorityOrder = { profitability: 4, sales_trend: 3, urgency: 2, relationship: 1, seasonality: 0 };
      const aPriority = priorityOrder[a.type] || 0;
      const bPriority = priorityOrder[b.type] || 0;

      if (aPriority !== bPriority) return bPriority - aPriority;
      return b.confidence - a.confidence;
    });

    sortedInsights.forEach(insight => {
      const vmZone = this.determineVMZone(insight);
      let rule: PlacementRule;

      switch (insight.type) {
        case 'sales_trend':
          if (insight.value && Math.abs(insight.value) > 15) {
            const isGrowth = insight.value > 0;
            rule = {
              type: 'sales_trend',
              confidence: insight.confidence,
              productIds: [],
              action: isGrowth ? 'promote' : 'clear',
              zone: isGrowth ? 'EYE' : 'STOOP',
              reasoning: isGrowth
                ? `${insight.entities[0]} showing strong sales growth (+${insight.value}%) - promote to eye level for maximum visibility`
                : `${insight.entities[0]} declining sales (${insight.value}%) - consider clearance positioning`,
            };
          } else {
            rule = {
              type: 'sales_trend',
              confidence: insight.confidence,
              productIds: [],
              action: 'feature',
              zone: vmZone,
              reasoning: `${insight.entities[0]} identified as trending - maintain prominent positioning`,
            };
          }
          break;

        case 'profitability':
          rule = {
            type: 'profitability',
            confidence: insight.confidence,
            productIds: [],
            action: 'eye_level',
            zone: 'EYE',
            reasoning: `${insight.entities[0]} identified as high-margin item - place at eye level to maximize profit${insight.value ? ` (${insight.value}% margin)` : ''}`,
          };
          break;

        case 'relationship':
          if (insight.entities.length >= 2) {
            rules.push({
              type: 'cross_sell',
              confidence: insight.confidence,
              productIds: [],
              action: 'adjacent_to',
              reasoning: `${insight.entities[0]} and ${insight.entities[1]} are frequently bought together - place adjacent for cross-selling`,
            });
          }
          break;

        case 'seasonality':
          const isCurrentSeason = this.isCurrentSeason(insight.timeframe);
          rules.push({
            type: 'seasonality',
            confidence: insight.confidence,
            productIds: [],
            action: isCurrentSeason ? 'feature' : 'clear',
            zone: isCurrentSeason ? 'EYE' : 'STOOP',
            reasoning: `${insight.entities[0]} is ${insight.timeframe} merchandise - ${isCurrentSeason ? 'feature prominently' : 'move to clearance'}`,
          });
          break;

        case 'urgency':
          rules.push({
            type: 'clearance',
            confidence: insight.confidence,
            productIds: [],
            action: 'clear',
            zone: 'STOOP',
            reasoning: `${insight.entities[0]} needs immediate clearance - move to stoop zone with clear pricing`,
          });
          break;
      }
    });

    return rules;
  }

  private isCurrentSeason(timeframe?: string): boolean {
    if (!timeframe) return false;

    const month = new Date().getMonth() + 1; // 1-12
    const season = timeframe.toLowerCase();

    switch (season) {
      case 'winter':
        return month === 12 || month === 1 || month === 2;
      case 'spring':
        return month >= 3 && month <= 5;
      case 'summer':
        return month >= 6 && month <= 8;
      case 'fall':
      case 'autumn':
        return month >= 9 && month <= 11;
      case 'holiday':
        return month === 11 || month === 12;
      default:
        return false;
    }
  }
}