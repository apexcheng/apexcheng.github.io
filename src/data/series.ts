export const seriesIds = ['personal-blog', 'yingdao-agent-development', 'excel-functions', 'ecommerce-operation-learning'] as const;

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
    description: '从函数知识地图、基础案例到查找匹配、通配符和中级函数案例，用真实表格和配套练习工作簿掌握常用 Excel 函数。',
    order: 3,
    resource: {
      title: 'Excel 函数学习系列练习工作簿',
      description: '15 个工作表、71 道练习，覆盖 39 个基础函数、18 个中级函数、通配符和综合应用，并附参考答案。',
      href: '/files/excel-functions/excel-functions-practice-workbook.xlsx',
      meta: 'XLSX · 15 个工作表 · 含参考答案',
    },
  },
  {
    id: 'ecommerce-operation-learning',
    title: '电商运营从入门到实战',
    description: '从消费者购买链路出发，逐步理解千牛后台、商品、价格、活动、订单、履约、售后和经营分析，帮助零基础读者建立完整的电商运营认知。',
    order: 4,
  },
] as const satisfies readonly {
  id: SeriesId;
  title: string;
  description: string;
  order: number;
  resource?: {
    title: string;
    description: string;
    href: string;
    meta: string;
  };
}[];

export function getSeriesMeta(seriesId: SeriesId) {
  return seriesMetaList.find((series) => series.id === seriesId);
}
