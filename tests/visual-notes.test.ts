import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const componentPaths = [
  'src/components/MetricCard.astro',
  'src/components/FeatureCard.astro',
  'src/components/VisualGrid.astro',
  'src/components/HighlightBox.astro',
  'src/components/DecisionFlow.astro',
];

const examplePath = 'src/content/posts/visual-notes-components.mdx';

describe('visual note components', () => {
  it('adds the visual note component files', () => {
    for (const componentPath of componentPaths) {
      expect(existsSync(componentPath)).toBe(true);
    }
  });

  it('documents the MDX usage in a public example article', () => {
    expect(existsSync(examplePath)).toBe(true);

    const source = readFileSync(examplePath, 'utf8');
    for (const componentName of ['MetricCard', 'FeatureCard', 'VisualGrid', 'HighlightBox', 'DecisionFlow']) {
      expect(source).toContain(`import ${componentName}`);
      expect(source).toContain(`<${componentName}`);
    }

    expect(source).toContain('draft: false');
    expect(source).toContain('private: false');
  });
});
