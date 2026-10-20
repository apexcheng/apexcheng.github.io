import type { MarkdownHeading } from 'astro';

export function groupTocHeadings(headings: MarkdownHeading[]) {
  const groups: { heading?: MarkdownHeading; children: MarkdownHeading[] }[] = [];
  for (const heading of headings) {
    if (heading.depth === 2) {
      groups.push({ heading, children: [] });
    } else if (heading.depth === 3) {
      // Preserve H3s before the first H2, including articles with only H3s.
      if (!groups.length) groups.push({ children: [] });
      groups[groups.length - 1].children.push(heading);
    }
  }
  return groups;
}

type ReadingPost = {
  id: string;
  data: {
    category: string;
    tags: string[];
    date: Date;
    draft?: boolean;
    private?: boolean;
    series?: string;
  };
};

export function getRelatedPosts<T extends ReadingPost>(current: T, posts: T[]): T[] {
  if (current.data.series) return [];
  const tags = new Set(current.data.tags);
  return posts
    .filter((post) => post.id !== current.id && !post.data.draft && !post.data.private)
    .map((post) => ({
      post,
      // A shared topic is more specific than a shared category.
      score: Number(post.data.category === current.data.category)
        + [...new Set(post.data.tags)].filter((tag) => tags.has(tag)).length * 2,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score
      || b.post.data.date.valueOf() - a.post.data.date.valueOf()
      || (a.post.id < b.post.id ? -1 : a.post.id > b.post.id ? 1 : 0))
    .slice(0, 2)
    .map(({ post }) => post);
}
