import { describe, expect, it } from 'vitest';
import { promptEntries } from '../src/data/prompts';

describe('prompt library', () => {
  it('contains 16 reusable audit prompts with unique identifiers and complete text', () => {
    expect(promptEntries).toHaveLength(16);
    expect(new Set(promptEntries.map((entry) => entry.id)).size).toBe(16);
    for (const entry of promptEntries) {
      expect(entry.title.length).toBeGreaterThan(5);
      expect(entry.description.length).toBeGreaterThan(10);
      expect(entry.content.length).toBeGreaterThan(150);
      expect(entry.content).toContain('不');
    }
  });
});
