import { describe, it, expect } from 'vitest';
import { analyticsService } from '../services/analytics.service';

describe('Analytics Service', () => {
  describe('parseAnalyticsText', () => {
    it('should parse sales trends correctly', () => {
      const text = 'Winter coats up 47%, scarves up 23%';
      const insights = analyticsService.parseAnalyticsText(text);

      expect(insights).toHaveLength(2);
      expect(insights[0]).toMatchObject({
        type: 'sales_trend',
        confidence: expect.any(Number),
        action: 'eye_level',
        zone: 'EYE'
      });
      expect(insights[0].reasoning).toContain('47%');
    });

    it('should parse profitability insights', () => {
      const text = 'Leather goods are highest margin items';
      const insights = analyticsService.parseAnalyticsText(text);

      expect(insights).toHaveLength(1);
      expect(insights[0]).toMatchObject({
        type: 'profitability',
        action: 'eye_level',
        zone: 'EYE'
      });
    });

    it('should parse product relationships', () => {
      const text = 'Customers who buy coats usually buy accessories';
      const insights = analyticsService.parseAnalyticsText(text);

      expect(insights).toHaveLength(1);
      expect(insights[0]).toMatchObject({
        type: 'relationship',
        action: 'adjacent',
        zone: 'EYE'
      });
    });

    it('should handle complex analytics with multiple insights', () => {
      const text = `Winter coats up 47%, scarves up 23%
      Leather goods are highest margin items
      Customers who buy coats usually buy accessories`;

      const insights = analyticsService.parseAnalyticsText(text);
      expect(insights.length).toBeGreaterThanOrEqual(3);
    });

    it('should return empty array for empty input', () => {
      const insights = analyticsService.parseAnalyticsText('');
      expect(insights).toEqual([]);
    });
  });

  describe('generateVMRules', () => {
    it('should generate VM placement rules from insights', () => {
      const insights = [
        {
          type: 'sales_trend' as const,
          confidence: 0.9,
          productIds: [],
          action: 'eye_level' as const,
          zone: 'EYE' as const,
          reasoning: 'High sales growth'
        }
      ];

      const rules = analyticsService.generateVMRules(insights);
      expect(rules).toHaveLength(1);
      expect(rules[0]).toMatchObject({
        zone: 'EYE',
        priority: 'high',
        rule: expect.stringContaining('Place')
      });
    });

    it('should prioritize rules correctly', () => {
      const insights = [
        {
          type: 'sales_trend' as const,
          confidence: 0.9,
          productIds: [],
          action: 'eye_level' as const,
          zone: 'EYE' as const,
          reasoning: 'High sales'
        },
        {
          type: 'profitability' as const,
          confidence: 0.8,
          productIds: [],
          action: 'reach' as const,
          zone: 'REACH' as const,
          reasoning: 'Good margin'
        }
      ];

      const rules = analyticsService.generateVMRules(insights);
      expect(rules[0].priority).toBe('high');
      expect(rules[1].priority).toBe('medium');
    });
  });
});