import { describe, expect, it } from 'vitest';
import { orderedPromptEntries, promptCategories, promptEntries } from '../src/data/prompts';

describe('prompt library', () => {
  it('contains 20 reusable prompts with unique identifiers, practice cases and complete text', () => {
    expect(promptEntries).toHaveLength(20);
    expect(new Set(promptEntries.map((entry) => entry.id)).size).toBe(20);
    for (const entry of promptEntries) {
      expect(entry.title.length).toBeGreaterThan(5);
      expect(entry.description.length).toBeGreaterThan(10);
      expect(entry.usedCase.length).toBeGreaterThan(15);
      expect(entry.content.length).toBeGreaterThan(150);
      expect(entry.content).toContain('不');
    }
  });

  it('assigns every prompt to an available category and includes the new frontend prompt', () => {
    expect(new Set(promptCategories).size).toBe(promptCategories.length);
    expect(promptCategories).toContain('前端');
    for (const entry of promptEntries) expect(promptCategories).toContain(entry.category);
    for (const category of promptCategories) {
      expect(promptEntries.some((entry) => entry.category === category)).toBe(true);
    }
    expect(promptEntries.find((entry) => entry.id === 'frontend-visual-restraint-consistency')?.category).toBe('前端');
  });

  it('puts the information hierarchy prompt first while retaining order for other entries', () => {
    expect(orderedPromptEntries[0].id).toBe('ui-information-hierarchy-redesign');
    expect(orderedPromptEntries[0].pinned).toBe(true);
    expect(orderedPromptEntries.slice(1).map((entry) => entry.id)).toEqual(
      promptEntries.filter((entry) => !entry.pinned).map((entry) => entry.id),
    );
  });
});
