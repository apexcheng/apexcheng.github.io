export interface Project {
  id: string;
  title: string;
  type: string;
  description: string;
  lead: string;
  tags: string[];
  searchKeywords?: string[];
  tone: string;
  category: string;
  parentId?: string;
  challenge: string;
  approach: string;
  decisions: { title: string; description: string }[];
  outcomes: string[];
  boundaries: string[];
  flow: { label: string; detail: string; layer?: string }[];
  links: { title: string; href: string; description: string }[];
}

// Published case-study metadata only. Keep credentials, private URLs, customer data,
// unapproved screenshots and internal implementation details outside this repository.
export const projects: Project[] = [
  {
    id: 'hangqiao',
    title: '航桥 · 电商运营业务平台',
    type: '综合业务平台',
    description: '把分散的运营入口、ERP 数据、业务流程和 AI 能力组织到一套持续演进的工作平台中。',
    lead: '不是用一个巨大页面替代所有工具，而是给分散的数据、规则与执行流程建立清楚的边界。',
    category: '内部系统 · 脱敏案例',
    tags: ['运营平台', '数据集成', 'AI 表格'],
    searchKeywords: ['航桥系统', '电商运营平台'],
    tone: 'teal',
    challenge: '跨平台运营涉及多个店铺、数据口径和自动化流程。独立工具可以处理某一步，但业务人员仍需要在不同入口之间核对状态、追踪异常。',
    approach: '围绕统一工作入口组织 ERP 数据同步与监控、业务数据处理、AI 表格工作台、自动化协同以及后台管理，让各模块承担明确职责。',
    decisions: [
      { title: '先明确业务边界', description: '区分数据采集、业务判断和后续执行；不同模块的职责不靠同一个页面名称含混表达。' },
      { title: '保持独立执行链路', description: '与平台库存有关的 Windows 影刀自动补库存 RPA 另作独立项目介绍，不将两个系统混为一谈。' },
      { title: '持续迭代而非一次性演示', description: '从真实运营问题出发逐步扩充模块，并对异常处理、权限和维护成本持续调整。' },
    ],
    outcomes: ['已经形成涵盖运营入口、数据处理、AI 表格和后台管理的多模块项目。', '各类工作从独立脚本逐步沉淀为可维护的业务功能。'],
    boundaries: ['本文是脱敏架构案例，不提供内部生产系统访问地址。', '模块之间的数据传输关系仅按已确认的职责展示，不推断未核实的调用链。'],
    flow: [
      { label: '运营工作入口', detail: '汇聚日常业务入口与处理状态', layer: '入口' },
      { label: 'ERP 数据与监控', detail: '为库存及运营分析提供数据依据', layer: '数据' },
      { label: '业务处理与分析', detail: '按业务口径组织分析和流程', layer: '处理' },
      { label: 'AI 表格工作台', detail: '字段、视图、权限和 AI 分析能力', layer: '工作台' },
      { label: '后台与自动化协同', detail: '维护配置、任务和执行边界', layer: '管理' },
    ],
    links: [{ title: '深入看 AI 表格工作台', href: '/projects/hangqiao/ai-table/', description: '航桥体系内的重点子系统' }],
  },
  {
    id: 'inventory-rpa',
    title: '多平台库存监控与自动补库存 RPA',
    type: 'Windows · 影刀代码版',
    description: '从拼多多、淘宝和京东的售罄消息出发，核实 ERP 库存与销量，按规则回写平台可售库存。',
    lead: '自动补库存并不意味着向仓库采购货物，而是让平台可售库存的核实、计算与回写成为可以追踪的业务流程。',
    category: '内部自动化 · 脱敏案例',
    tags: ['影刀 RPA', 'ERP', 'SQLite'],
    searchKeywords: ['库存补货', '库存监控', '平台缺货', '自动补库存'],
    tone: 'green',
    challenge: '各平台的售罄通知入口、消息结构和库存操作路径不同。多店铺人工处理需要反复核对商品、库存、补货数量和操作结果。',
    approach: '用平台专属流程扫描预警，结合 ERP 铺货与可售库存、发货销量信息作判断，再执行平台库存回写；以 SQLite 保存跨轮次状态，并由钉钉汇报结果和异常。',
    decisions: [
      { title: '平台差异留在平台层', description: '拼多多、淘宝和京东分别处理各自的通知和回写页面，公共流程负责店铺调度和结果汇总。' },
      { title: '计算结果不等于执行成功', description: '从补货目标到页面回写需要分别验证，异常结果不能被“已计算”代替。' },
      { title: '跨轮次持久化', description: '保存处理状态，用于去重、后续重试和运行汇总；让中途异常不至于抹掉已经完成的结果。' },
    ],
    outcomes: ['代码覆盖拼多多、淘宝、京东的库存预警处理流程。', '形成 ERP/销量同步、库存回写、持久化状态和通知相结合的执行链路。'],
    boundaries: ['回写的是平台可售库存，不代表采购、实物入库或真实仓库库存增加。', '流程图为脱敏业务原理，不展示账号、店铺、库存明细或未经核实的效率数字。', '不同平台的重试、终态及消息读取机制并非完全一致。'],
    flow: [
      { label: '发现售罄或无货消息', detail: '拼多多 / 淘宝 / 京东分别读取店铺通知', layer: '平台' },
      { label: '核实 ERP 数据', detail: '获取商品铺货关系、可售库存与发货销量', layer: '数据' },
      { label: '计算目标库存', detail: '应用业务规则与忽略名单等处理条件', layer: '判断' },
      { label: '更新平台可售库存', detail: '执行各平台的网页库存操作并检查结果', layer: '执行' },
      { label: '记录状态与告警', detail: 'SQLite 保存状态；钉钉汇总结果及运行异常', layer: '追踪' },
    ],
    links: [
      { title: '了解影刀 × AI 开发实践', href: '/projects/yingdao-agent-development/', description: '这类 RPA 项目的开发方法与知识支持' },
    ],
  },
  {
    id: 'yingdao-agent-development',
    title: '影刀 × AI Agent 开发知识库',
    type: 'AI 辅助 RPA 工程',
    description: '把影刀开发规范、API 事实、网页元素探索、编码与部署验证组织成可复用的开发流程。',
    lead: '真正的难点不是让 AI 生成一段 Python，而是让它在真实 RPA 项目里查依据、找到元素、完成改动并验证业务结果。',
    category: '开发方法 · 技术案例',
    tags: ['AI Agent', 'XPath', '影刀 RPA'],
    searchKeywords: ['影刀知识库', 'AI开发', '自动化开发'],
    tone: 'violet',
    challenge: '平台 API、选择器、运行环境和实际部署之间存在大量细节。只依赖模型记忆编写代码，容易遗漏真实约束。',
    approach: '让知识库提供开发依据，浏览器负责路径和元素探索，编码工具修改项目，再通过同步及影刀环境完成业务验证，最后沉淀可复用经验。',
    decisions: [
      { title: '事实先于猜测', description: '需要使用影刀专有 API 时先查询正式知识依据，再进入代码实现。' },
      { title: '把两类验证分开', description: '网页元素或编译验证通过，不等于影刀真实业务流程已经成功。' },
      { title: '经验反哺开发', description: '将稳定的工具规则与已核实的问题解决方式沉淀，降低下一个项目的重复探索。' },
    ],
    outcomes: ['形成从需求与知识查询到代码同步和业务验证的可解释流程。', '相关开发教程已公开，读者可以沿系列了解具体方法。'],
    boundaries: ['此项目侧重开发工程方法，不是替代影刀执行平台的业务调度系统。', '不公开企业项目凭据、内部配置或私有业务源码。'],
    flow: [
      { label: '确认需求与规则', detail: '从知识库找到已验证的 API 和项目规范', layer: '依据' },
      { label: '探索网页元素', detail: '识别真实页面操作路径与选择器', layer: '页面验证' },
      { label: '编写与同步代码', detail: '对真实影刀编码版项目作范围内修改', layer: '开发' },
      { label: '验证业务执行', detail: '在影刀运行环境中确认实际业务结果', layer: '业务验证' },
      { label: '沉淀可复用经验', detail: '更新知识规则、排错说明和项目记录', layer: '积累' },
    ],
    links: [
      { title: '阅读完整开发实践', href: '/articles/yingdao-agent-development-knowledge-base/', description: '知识库及开发工作流介绍' },
      { title: '进入影刀开发系列', href: '/series/yingdao-agent-development/', description: '从元素探索到真实项目' },
    ],
  },
  {
    id: 'review-analysis-agent',
    title: '电商评价分析 Agent',
    type: 'AI Agent · 数据分析',
    description: '将评价数据整理、问题分类、事实汇总、报告生成与钉钉交付连接为业务改善分析流程。',
    lead: '评价不只是简单判好评或差评，更重要的是区分用户反馈、客观事实和可以采取改善措施的业务环节。',
    category: '业务分析 · 公开案例',
    tags: ['AI Agent', 'Python', '钉钉'],
    tone: 'orange',
    challenge: '分散的评价里包含重复问题、主观感受及不确定的原因，仅靠总好评率难以看出哪些业务环节需要改善。',
    approach: '通过采集与分类准备结构化事实，再用 Agent 组织报告；将生成、实际发送与后续状态回写区分开。',
    decisions: [
      { title: '统计为改善服务', description: '分析目标是发现可改善环节，而不是把未经验证的用户描述当作追责结论。' },
      { title: '事实与语言分开', description: '先生成可核对的数据事实，再组织可读的日报和周期分析。' },
      { title: '发送结果具有业务含义', description: '报告生成成功不等于已交付，后续状态需要根据实际发送结果更新。' },
    ],
    outcomes: ['具备完整的可视化技术说明与公开相关代码仓库。', '案例涵盖日报、周期分析、交付与状态回写的设计。'],
    boundaries: ['案例图中的数据与在线状态是说明性内容，不作为实时业务指标。'],
    flow: [
      { label: '收集与归类评价', detail: '从评价记录识别相互独立的问题', layer: '输入' },
      { label: '生成可核对事实', detail: '形成统计依据与问题分布', layer: '事实' },
      { label: '组织分析报告', detail: '生成日报或周期总结', layer: '表达' },
      { label: '确认发送与回写', detail: '钉钉交付后按结果更新状态', layer: '交付' },
    ],
    links: [
      { title: '阅读可视化技术案例', href: '/articles/ecommerce-review-analysis-agent-workflow/', description: '查看评价分析到交付的完整过程' },
      { title: '访问公开 GitHub 仓库', href: 'https://github.com/apexcheng/review-analysis-reporter-skill', description: '查看已公开的相关代码资料' },
    ],
  },
  {
    id: 'hangqiao/ai-table',
    parentId: 'hangqiao',
    title: '航桥 · AI 表格工作台',
    type: '航桥子系统 · 数据工作台',
    description: '围绕字段、视图、协作和 AI 分析打造可维护的数据工作台，是航桥体系的一部分。',
    lead: '从“让 AI 做一张表”到真正处理字段关系、权限边界、共享视图与高密度数据交互。',
    category: '内部子系统 · 脱敏案例',
    tags: ['数据表格', '权限与审计', 'AI 分析'],
    searchKeywords: ['AI表格', 'Vibe Coding'],
    tone: 'blue',
    challenge: '表格工具的难点往往不是渲染单元格，而是跨筛选、编辑、权限、附件和 AI 结果保持一致的用户体验。',
    approach: '在原有业务体系内迭代表格数据与交互模型，围绕字段及视图、协作权限、AI 分析和后台管理完善实际工作场景。',
    decisions: [
      { title: '以工作场景检验交互', description: '将列表筛选、虚拟滚动、字段操作、快捷键和移动端状态放进真实体验验收。' },
      { title: '权限不是隐藏按钮', description: '区分可查看、可编辑和可管理权限，同时考虑删除与操作审计。' },
      { title: '对 AI 的判断保留边界', description: '问题事实无法确定时允许说明不确定，而不是逼模型给出虚假结论。' },
    ],
    outcomes: ['AI 表格的开发、使用体验和多 Agent 迭代过程已有公开技术复盘。', '该工作台属于航桥项目，页面不将其重复包装为独立外部 SaaS。'],
    boundaries: ['本文不是可注册使用的公开 SaaS 入口，不包含内部表格数据和权限配置。', '历史文章中的数据规模、规划功能不直接等于当前运行结果。'],
    flow: [
      { label: '字段与数据', detail: '定义内容与基础关系', layer: '数据' },
      { label: '视图与交互', detail: '筛选、浏览、编辑与导航', layer: '使用' },
      { label: '权限与审计', detail: '控制访问范围并记录操作', layer: '治理' },
      { label: 'AI 分析', detail: '基于业务字段给出结构化结果', layer: '增强' },
    ],
    links: [
      { title: '查看 AI 表格开发复盘', href: '/articles/vibe-coding-ai-table-saas-retrospective/', description: '从原型到复杂表格体验的技术实践' },
      { title: '返回航桥整体案例', href: '/projects/hangqiao/', description: '了解母项目的完整职责范围' },
    ],
  },
  {
    id: 'blog-content-engineering',
    title: '个人博客 · AI 驱动内容工程',
    type: '公开网站 · 内容工程',
    description: '使用 Astro、MDX 和静态站点工作流，把文章、视觉表达和项目案例做成可持续维护的网站。',
    lead: '博客本身也是一个持续迭代的软件作品：不只写内容，还要设计结构、处理复杂排版、做回归验收和稳定发布。',
    category: '公开作品 · 可访问',
    tags: ['Astro', 'MDX', 'GitHub Pages'],
    tone: 'blue',
    challenge: '技术长文、不同类型的学习系列和可视化案例同时存在，需要一致的访问方式，又不能让每篇文章看起来都像同一套模板。',
    approach: '以 Astro 和 MDX 组织内容、共享布局与独立视觉组件；用测试与浏览器验证维护导航、主题和移动阅读体验，部署到 GitHub Pages。',
    decisions: [
      { title: '内容关系决定视觉结构', description: '长文、系列学习与项目复盘采用不同表现方式，不为装饰而堆叠组件。' },
      { title: '多主题共享语义', description: '四种阅读主题共用内容结构，保证手机和桌面均能使用。' },
      { title: '验证也是开发的一部分', description: '将构建、自动化测试与真实浏览器检查结合，不把“代码已生成”等同于交付完成。' },
    ],
    outcomes: ['正式网站、公开 GitHub 仓库、文章及系列学习页均可直接访问。', '从内容组织到发布部署的实践能通过真实网页和源码核对。'],
    boundaries: ['不将演示页面描述为已上线产品功能。', '项目体验指向当前公开网站，不声称提供其他尚未存在的服务。'],
    flow: [
      { label: '编写内容', detail: '文章、系列、项目元数据及 MDX', layer: '内容' },
      { label: '制作页面', detail: '共享组件与具体内容视觉', layer: '表现' },
      { label: '测试与构建', detail: '检查页面、链接与阅读体验', layer: '验证' },
      { label: '公开部署', detail: '通过 GitHub Pages 提供静态访问', layer: '发布' },
    ],
    links: [
      { title: '打开当前博客', href: '/', description: '直接查看公开网站' },
      { title: '查看 GitHub 源码', href: 'https://github.com/apexcheng/apexcheng.github.io', description: '公开站点仓库' },
    ],
  },
];

export const featuredProjectId = 'review-analysis-agent';
export const portfolioMainId = 'hangqiao';
export const portfolioSpotlightIds = ['inventory-rpa', 'yingdao-agent-development'] as const;
export const homepageSecondaryIds = ['hangqiao', 'inventory-rpa', 'yingdao-agent-development', 'blog-content-engineering'] as const;
export const getProject = (id: string) => projects.find((project) => project.id === id);
export const projectPath = (project: Pick<Project, 'id'>) => `/projects/${project.id}/`;
