export const seriesIds = ['personal-blog', 'yingdao-agent-development', 'excel-functions'] as const;

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
  {
    id: 'excel-functions',
    title: 'Excel 函数学习与实战',
    description: '从函数知识地图、基础案例到查找匹配、通配符和中级函数案例，用真实表格掌握常用 Excel 函数。',
    order: 3,
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
