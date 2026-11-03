import { describe, expect, it } from 'vitest';
import { orderedPromptEntries, promptEntries } from '../src/data/prompts';

describe('prompt library', () => {
  it('contains 19 reusable prompts with unique identifiers, practice cases and complete text', () => {
    expect(promptEntries).toHaveLength(19);
    expect(new Set(promptEntries.map((entry) => entry.id)).size).toBe(19);
    for (const entry of promptEntries) {
      expect(entry.title.length).toBeGreaterThan(5);
      expect(entry.description.length).toBeGreaterThan(10);
      expect(entry.usedCase.length).toBeGreaterThan(15);
      expect(entry.content.length).toBeGreaterThan(150);
      expect(entry.content).toContain('不');
    }
  });

  it('puts the information hierarchy prompt first while retaining order for other entries', () => {
    expect(orderedPromptEntries[0].id).toBe('ui-information-hierarchy-redesign');
    expect(orderedPromptEntries[0].pinned).toBe(true);
    expect(orderedPromptEntries.slice(1).map((entry) => entry.id)).toEqual(
      promptEntries.filter((entry) => !entry.pinned).map((entry) => entry.id),
    );
  });
});
