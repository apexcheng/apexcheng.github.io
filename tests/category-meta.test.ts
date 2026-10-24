import { describe, expect, it } from 'vitest';
import { categoryMetaList, categories } from '../src/data/categories';
import { standardTags } from '../src/data/tags';

describe('category metadata', () => {
  it('provides the agreed tag vocabulary without duplicates', () => {
    expect(standardTags).toHaveLength(25);
    expect(new Set(standardTags).size).toBe(25);
  });
  it('keeps the domain categories in display order', () => {
    expect(categories).toEqual(['技术', '经营与数据', '生活与思考', '视觉实验室']);
    expect(categoryMetaList.map((category) => category.name)).toEqual(categories);
  });

  it('documents every category with a description', () => {
    for (const category of categoryMetaList) {
      expect(category.description.trim().length).toBeGreaterThan(0);
    }
  });

  it('does not keep old topic categories in the whitelist', () => {
    expect(categories).not.toContain('生活');
    expect(categories).not.toContain('实践');
    expect(categories).not.toContain('教程');
    expect(categories).not.toContain('AI Agent');
    expect(categories).not.toContain('影刀RPA');
    expect(categories).not.toContain('Skill');
    expect(categories).not.toContain('数据处理');
  });
});
