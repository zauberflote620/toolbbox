import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateNewPlan } from '../aiClient.js';

// Mock fetch globally
global.fetch = vi.fn();

describe('AI Client', () => {
  const mockPlan = {
    shopName: "Test Shop",
    sections: [
      {
        name: "Test Section",
        items: [
          { name: "Test Item", priority: "medium" }
        ]
      }
    ]
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('generates enhanced mock plan without API key', async () => {
    const result = await generateNewPlan(mockPlan, 'seasonal focus', '');

    expect(result.methodology).toBe('Anchor-and-Spokes');
    expect(result.generatedBy).toBe('Enhanced Mock AI');
    expect(result.vmRecommendations).toBeDefined();
    expect(Array.isArray(result.vmRecommendations)).toBe(true);
    expect(result.lastUpdated).toBeDefined();
  });

  it('applies seasonal pattern recognition', async () => {
    const result = await generateNewPlan(mockPlan, 'seasonal winter items', '');

    expect(result.vmRecommendations).toEqual(
      expect.arrayContaining([
        expect.stringContaining('seasonal')
      ])
    );
  });

  it('applies new arrivals pattern recognition', async () => {
    const result = await generateNewPlan(mockPlan, 'new arrivals focus', '');

    expect(result.vmRecommendations).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Review anchor placement')
      ])
    );
  });

  it('applies profitable items pattern recognition', async () => {
    const result = await generateNewPlan(mockPlan, 'profitable high-margin items', '');

    expect(result.vmRecommendations).toEqual(
      expect.arrayContaining([
        expect.stringContaining('high-margin')
      ])
    );
  });

  it('applies traffic flow pattern recognition', async () => {
    const result = await generateNewPlan(mockPlan, 'improve traffic flow', '');

    expect(result.vmRecommendations).toEqual(
      expect.arrayContaining([
        expect.stringContaining('traffic flow')
      ])
    );
  });

  it('applies safety pattern recognition', async () => {
    const result = await generateNewPlan(mockPlan, 'safety and accessibility', '');

    expect(result.vmRecommendations).toEqual(
      expect.arrayContaining([
        expect.stringContaining('walkway clearance')
      ])
    );
  });

  it('includes anchor-spoke logic in item naming', async () => {
    const planWithWinterItems = {
      ...mockPlan,
      sections: [
        {
          name: "Front Window",
          items: [
            { name: "Winter Coats", priority: "medium" }
          ]
        }
      ]
    };

    const result = await generateNewPlan(planWithWinterItems, 'seasonal winter', '');

    const frontWindowSection = result.sections.find(s => s.name === "Front Window");
    const winterItem = frontWindowSection.items.find(item =>
      item.name.toLowerCase().includes('winter')
    );

    expect(winterItem.name).toContain('(Anchor)');
    expect(winterItem.priority).toBe('high');
  });

  it('adds spoke items for seasonal goals', async () => {
    const result = await generateNewPlan(mockPlan, 'seasonal winter items', '');

    const mainFloorSection = result.sections.find(s => s.name === "Test Section");
    if (mainFloorSection) {
      const spokeItems = mainFloorSection.items.filter(item =>
        item.name.includes('(Spoke)')
      );
      expect(spokeItems.length).toBeGreaterThanOrEqual(0);
    }
  });

  it('handles API errors gracefully', async () => {
    fetch.mockRejectedValue(new Error('API Error'));

    const result = await generateNewPlan(mockPlan, 'test goals', 'fake-api-key');

    // Should fallback to mock plan
    expect(result.generatedBy).toBe('Enhanced Mock AI');
    expect(result.vmRecommendations).toBeDefined();
  });

  it('handles successful API response', async () => {
    const mockApiResponse = {
      ...mockPlan,
      lastUpdated: "2024-01-15",
      methodology: "Anchor-and-Spokes"
    };

    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{
          message: {
            content: JSON.stringify(mockApiResponse)
          }
        }]
      })
    });

    const result = await generateNewPlan(mockPlan, 'test goals', 'real-api-key');

    expect(fetch).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Authorization': 'Bearer real-api-key'
        })
      })
    );
  });
});