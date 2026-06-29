import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const blogAgentSource = readFileSync('docs/writing/BLOG_AGENT.md', 'utf8');
const mdxExampleSource = readFileSync('src/content/posts/visual-lab/mdx-code-diagrams.md', 'utf8');
const readmeSource = readFileSync('README.md', 'utf8');

describe('static file download convention', () => {
  it('keeps a public files directory placeholder', () => {
    expect(existsSync('public/files/.gitkeep')).toBe(true);
  });

  it('documents that /files/ is public and not for sensitive files', () => {
    expect(blogAgentSource).toContain('/files/');
    expect(blogAgentSource).toContain('public/files/');
    expect(blogAgentSource).toContain('公开文件');
    expect(blogAgentSource).toContain('不能放私密资料');
    expect(blogAgentSource).toContain('private 文章不等于 private 文件');
  });

  it('keeps an article code example for static file download links', () => {
    expect(mdxExampleSource).toContain('/files/example.pdf');
    expect(mdxExampleSource).not.toContain('[下载示例文件](/files/example.pdf)');
    expect(mdxExampleSource).toContain('public/files/');
  });

  it('reminds publish checks that public files are released as static assets', () => {
    expect(readmeSource).toContain('public/files/');
    expect(readmeSource).toContain('没有敏感文件');
    expect(readmeSource).toContain('会被静态发布');
  });
});
