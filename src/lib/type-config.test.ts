import { TYPE_CONFIG } from './type-config';

describe('TYPE_CONFIG', () => {
  it('has all three collection types', () => {
    expect(Object.keys(TYPE_CONFIG)).toEqual(['fundraiser', 'occasion', 'tips']);
  });

  it('each type has required fields', () => {
    for (const [key, config] of Object.entries(TYPE_CONFIG)) {
      expect(config.label).toBeTruthy();
      expect(config.emoji).toBeTruthy();
      expect(config.color).toMatch(/^#/);
      expect(config.categories.length).toBeGreaterThan(0);
      expect(config.heroImage).toMatch(/^https?:\/\//);
    }
  });

  it('fundraiser has showFundUsage enabled', () => {
    expect(TYPE_CONFIG.fundraiser.showFundUsage).toBe(true);
  });

  it('occasion has showEventDate enabled', () => {
    expect(TYPE_CONFIG.occasion.showEventDate).toBe(true);
  });

  it('tips has showTipSuggestions enabled', () => {
    expect(TYPE_CONFIG.tips.showTipSuggestions).toBe(true);
  });
});
