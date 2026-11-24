import type { CollectionEntry } from 'astro:content';

export function selectHomeReading(posts: CollectionEntry<'posts'>[]) {
  const reading = posts.filter((post) => post.data.category !== '视觉实验室');
  const recommended = reading.find((post) => post.data.featured) ?? reading[0];
  const rest = reading.filter((post) => post.slug !== recommended?.slug);

  return {
    recommended,
    recent: rest.slice(0, 3),
    more: rest.slice(3, 7),
  };
}
