import { describe, expect, it } from 'vitest';
import { getRelatedPosts, groupTocHeadings } from '../src/utils/article-reading';

const heading = (depth: number, slug: string) => ({ depth, slug, text: slug });

describe('mobile TOC grouping', () => {
  it('keeps H2/H3 order, including H2s without children', () => {
    const headings = [heading(2, 'a'), heading(3, 'a-1'), heading(3, 'a-2'), heading(2, 'b'), heading(2, 'c'), heading(3, 'c-1')];
    const groups = groupTocHeadings(headings);
    expect(groups.map(({ heading, children }) => [heading?.slug, children.map(({ slug }) => slug)]))
      .toEqual([['a', ['a-1', 'a-2']], ['b', []], ['c', ['c-1']]]);
    expect(groups.flatMap(({ heading, children }) => [...(heading ? [heading] : []), ...children])).toEqual(headings);
  });
  it('retains leading H3s and articles with no H2', () => {
    const leading = heading(3, 'opening');
    expect(groupTocHeadings([leading, heading(2, 'main')])[0]).toEqual({ children: [leading] });
    expect(groupTocHeadings([leading, heading(3, 'second')])).toEqual([{ children: [leading, heading(3, 'second')] }]);
    expect(groupTocHeadings([])).toEqual([]);
  });
});

const post = (id: string, data = {}) => ({ id, data: { category: '实践', tags: ['工具'], date: new Date('2026-01-01'), ...data } });

describe('continued reading selection', () => {
  it('ranks shared tags above category-only matches and returns at most two posts', () => {
    const current = post('current');
    const posts = [post('category', { tags: [] }), post('both'), post('tag', { category: '教程' })];
    expect(getRelatedPosts(current, posts).map(({ id }) => id)).toEqual(['both', 'tag']);
    expect(posts.map(({ id }) => id)).toEqual(['category', 'both', 'tag']);
  });
  it('excludes current, draft, private and unrelated articles', () => {
    const current = post('current');
    expect(getRelatedPosts(current, [current, post('draft', { draft: true }), post('private', { private: true }), post('unrelated', { category: '生活', tags: [] })])).toEqual([]);
  });
  it('breaks ties by publication date and then stable ID, independent of input order', () => {
    const posts = [post('z'), post('b', { date: new Date('2026-02-01') }), post('a', { date: new Date('2026-02-01') })];
    expect(getRelatedPosts(post('current'), posts).map(({ id }) => id)).toEqual(['a', 'b']);
    expect(getRelatedPosts(post('current'), [...posts].reverse()).map(({ id }) => id)).toEqual(['a', 'b']);
  });
  it('preserves series navigation and does not count duplicate tags twice', () => {
    expect(getRelatedPosts(post('current', { series: 'guide' }), [post('a')])).toEqual([]);
    expect(getRelatedPosts(post('current'), [post('z', { tags: ['工具', '工具'] }), post('a')]).map(({ id }) => id)).toEqual(['a', 'z']);
  });
});
