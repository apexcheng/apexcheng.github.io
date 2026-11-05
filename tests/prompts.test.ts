import { describe, expect, it } from 'vitest';
import { orderedPromptEntries, promptCategories, promptEntries } from '../src/data/prompts';

describe('prompt library', () => {
  it('contains 21 reusable prompts with unique identifiers, practice cases and complete text', () => {
    expect(promptEntries).toHaveLength(21);
    expect(new Set(promptEntries.map((entry) => entry.id)).size).toBe(21);
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

  it('puts pinned prompts first while retaining order for other entries', () => {
    expect(orderedPromptEntries[0].id).toBe('system-function-experience-enhancement');
    expect(orderedPromptEntries[0].pinned).toBe(true);
    expect(orderedPromptEntries.filter((entry) => entry.pinned).map((entry) => entry.id)).toEqual(
      promptEntries.filter((entry) => entry.pinned).map((entry) => entry.id),
    );
    expect(orderedPromptEntries.filter((entry) => !entry.pinned).map((entry) => entry.id)).toEqual(
      promptEntries.filter((entry) => !entry.pinned).map((entry) => entry.id),
    );
  });
});
