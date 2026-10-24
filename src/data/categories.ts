export const categories = ['技术', '经营与数据', '生活与思考', '视觉实验室'] as const;

export type CategoryName = (typeof categories)[number];

export const categoryMetaList = [
  {
    name: '技术',
    description: 'AI、Agent、编程、自动化开发、系统架构、基础设施和 Excel 函数等技术内容。',
    order: 1,
  },
  {
    name: '经营与数据',
    description: '电商运营、经营分析、利润核算、报表建模、业务流程及产品体验改善。',
    order: 2,
  },
  {
    name: '生活与思考',
    description: '职场观察、社会事件、健康、个人财务与日常判断。',
    order: 3,
  },
  {
    name: '视觉实验室',
    description:
      '用于测试博客的文章样式、组件、代码块、图表和视觉表达。\n作为独立实验区，不进入正式文章默认列表。',
    order: 4,
  },
] as const satisfies readonly {
  name: CategoryName;
  description: string;
  order: number;
}[];

export function getCategoryMeta(categoryName: CategoryName) {
  return categoryMetaList.find((category) => category.name === categoryName);
}
