export const seriesIds = ['personal-blog', 'yingdao-agent-development', 'excel-functions', 'ecommerce-operation-learning', 'python-basics'] as const;

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
  {
    id: 'python-basics',
    title: 'Python 零基础到简单脚本',
    description: '用订单、SKU、文件和 JSON 贯穿 8 篇练习，从看懂一份数据开始，逐步写出能判断、循环、整理和输出结果的简单脚本。',
    order: 5,
    learningStages: [
      {
        range: '01–03',
        title: '先看懂数据',
        description: '建立运行直觉，认清变量、类型和常用容器。',
      },
      {
        range: '04–05',
        title: '让代码开始工作',
        description: '用判断、循环和函数组织可重复的处理步骤。',
      },
      {
        range: '06–07',
        title: '接入真实任务',
        description: '处理文件、JSON、异常，并理解够用的对象组织方式。',
      },
      {
        range: '08',
        title: '完成一次自测',
        description: '用 20 道题检查是否已经能独立读写基础脚本。',
      },
    ],
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
  learningStages?: readonly {
    range: string;
    title: string;
    description: string;
  }[];
}[];

export function getSeriesMeta(seriesId: SeriesId) {
  return seriesMetaList.find((series) => series.id === seriesId);
}
