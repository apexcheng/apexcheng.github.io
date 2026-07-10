export const seriesIds = ['personal-blog', 'yingdao-agent-development'] as const;

export type SeriesId = (typeof seriesIds)[number];

export const seriesMetaList = [
  {
    id: 'personal-blog',
    title: '这个博客是怎么搭起来的',
    description: '从整体架构、代码运行方式到 GitHub Pages 部署，完整拆解这个个人博客是怎么工作的。',
    order: 1,
  },
  {
    id: 'yingdao-agent-development',
    title: '影刀 × Agent 开发实战',
    description: '从知识库、页面元素探索到真实项目编码和同步验证，记录如何让 Agent 参与影刀开发。',
    order: 2,
  },
] as const satisfies readonly {
  id: SeriesId;
  title: string;
  description: string;
  order: number;
}[];

export function getSeriesMeta(seriesId: SeriesId) {
  return seriesMetaList.find((series) => series.id === seriesId);
}
