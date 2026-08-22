# 内容索引

本文件只索引公开正式文章。草稿、私密文章和视觉实验不在这里维护；视觉 Demo 统一查看 `docs/writing/VISUAL_LAB.md`。

需要参考旧文章时，先按主题选择 1 到 3 篇最相关正文，不默认通读全部文章。

## 正文文章索引

| 文件 | 分类 | 主题概览 | 适合什么时候参考 |
| --- | --- | --- | --- |
| `src/content/posts/yingdao-enterprise-rpa-flow-notes.mdx` | `实践` | 影刀企业案例、RPA业务流程、普通版与企业版决策、Mermaid流程图 | 写影刀RPA、企业自动化、普通版/企业版选型、流程图笔记时参考 |
| `src/content/posts/ulike-customer-service-rpa-flow-detail.mdx` | `实践` | Ulike 客服售后自动化细节拆解，覆盖静默单推送、已发货仅退款、赠品发货留言三条 RPA 实操流程 | 写电商客服售后RPA、订单/物流/ERP跨系统流程、客服自动化动作拆解时参考 |
| `src/content/posts/how-to-use-yingdao-rpa-correctly.mdx` | `实践` | 从 40+ 个影刀小应用出发，复盘影刀正确用法、人机协作、经营看板、供应链预警和企业版判断，并用深色决策树风展示新需求是否值得做影刀 | 写影刀RPA复盘、正确使用影刀、日报升级经营看板、自动化治理、需求判断决策树时参考 |
| `src/content/posts/yingdao-daily-report-to-business-dashboard.mdx` | `实践` | 从 40+ 个零散影刀应用复盘人机协作、维护责任、日报边界和经营看板升级方向 | 写影刀应用治理、日报自动化、经营看板、人机协作和维护责任文章时参考 |
| `src/content/posts/yingdao-agent-development-knowledge-base.mdx` | `教程` | 影刀 × Agent 开发总览，覆盖开发知识库、问题查询、真实项目规则、浏览器元素探索、代码同步和知识库更新闭环 | 写影刀编码版、Agent 辅助开发、影刀知识库、浏览器元素探索和外部代码同步时参考 |
| `src/content/posts/automation-agent-workflow.mdx` | `实践` | Agent 执行系统图解手册，统一任务分流、状态管理、权限边界、执行循环和失败恢复 | 写 Agent 流程、自动化协作、任务拆解决策、大任务阶段管理和失败恢复文章时参考 |
| `src/content/posts/browser-agent-shared-chrome-runtime.mdx` | `实践` | 共享 Chrome 运行时架构手册，覆盖固定 Profile、CDP、ensure 状态机、接入顺序、页面隔离、操作清单和故障分流 | 写浏览器自动化基础设施、Playwright CDP、共享登录状态、Chrome 生命周期和多 Agent 复用时参考 |
| `src/content/posts/gbrain-openclaw-long-term-brain-setup.mdx` | `实践` | GBrain 接入 OpenClaw 的完整实战，覆盖 Context Engine 自动召回、Signal Detector 后台写入、PostgreSQL 多会话并发、Brain source 路由，以及状态、检索、写入、同步、维护和接入验收命令 | 写 Agent 长期记忆、GBrain CLI、OpenClaw Context Engine、自动记忆闭环、知识库运维和分层排障时参考 |
| `src/content/posts/blog-project-architecture.mdx` | `实践` | 维护者视角的博客系统蓝图，覆盖仓库职责、内容分区、规则控制面、写作公开流程和静态发布边界 | 写本博客说明、仓库结构、内容维护规则和发布边界时参考 |
| `src/content/posts/blog-code-structure-runtime.mdx` | `实践` | 开发者视角的博客运行蓝图，覆盖 URL 路由、Content Collection、MDX 渲染栈、静态构建、本地与 Pages 链路和代码定位 | 写本博客代码结构、运行流程、Astro 项目拆解和故障定位时参考 |
| `src/content/posts/css-selector-for-automation-beginners.mdx` | `教程` | CSS 定位图解手册，覆盖稳定定位层级、属性匹配、关系与伪类、影刀文字定位、唯一性验证、排错路线和坏定位改造 | 写 CSS 选择器教学、网页元素定位、影刀编码版自动化、动态 class 处理和定位排错文章时参考 |
| `src/content/posts/xpath-practical-guide.mdx` | `教程` | XPath 实战速查，覆盖基础路径、属性和文本定位、ancestor/following-sibling 关系定位、表格定位、动态网页选择器和稳定定位原则 | 写 XPath、浏览器自动化、影刀元素定位和 RPA 新人培训时参考 |
| `src/content/posts/python-basic-assessment-20-questions.mdx` | `教程` | Python 基础考核题，包含 17 道基础编码题和 3 道基础理解题，覆盖类型转换、循环、字典、函数、文件、JSON、类、浅拷贝与默认参数，并提供可下载附件 | 写 Python 入门考核、基础练习题、编程能力检查和培训测验文章时参考 |
| `src/content/posts/excel-functions-from-basic-to-intermediate.mdx` | `教程` | Excel 函数知识地图，把 57 个常用函数整理成 9 个函数家族，并说明基础函数、中级函数、综合应用和系列阅读路线 | 写 Excel / WPS 函数学习地图、函数分类、系列入口和表格能力分层文章时参考 |
| `src/content/posts/excel-basic-functions-case-guide.mdx` | `教程` | Excel 基础函数案例教程，使用订单明细和商品资料两张示例表，逐个演示 39 个统计、条件、查找、文本、逻辑和日期函数的公式、结果与组合练习 | 写 Excel 基础函数实操、函数案例讲解、订单明细统计和新手练习文章时参考 |
| `src/content/posts/excel-wildcards-functions-guide.mdx` | `教程` | Excel 通配符专题，讲清 *、?、~ 的匹配规则，整理条件统计、查找匹配和文本搜索函数的支持方式，并用 K161 前缀平均值案例对比复杂数组公式 | 写 Excel 模糊匹配、条件统计、XLOOKUP 通配符模式、编码前缀和文本搜索文章时参考 |
| `src/content/posts/excel-lookup-functions-visual-guide.mdx` | `教程` | Excel 查找匹配函数专题，用五张内容相同、标注不同的独立案例表，逐个展示 VLOOKUP、XLOOKUP、INDEX、MATCH、XMATCH 的参数、查找过程、位置与返回结果 | 写 Excel 查找函数教学、单函数可视化案例、VLOOKUP 与 XLOOKUP 对比、INDEX + MATCH / XMATCH 组合和位置返回文章时参考 |
| `src/content/posts/excel-intermediate-functions-case-guide.mdx` | `教程` | Excel 中级函数案例教程，使用编码日期表、运营明细表和七天销量表，讲解 18 个文本日期、动态数组与批量计算函数 | 写 Excel 动态数组、日期周期、LET、BYROW、MAP、REDUCE 和减少下拉公式的教学文章时参考 |
| `src/content/posts/excel-functions-visual-handbook.mdx` | `教程` | 可持续扩展的 Excel 函数图解手册，当前用六张独立信息图讲清 VALUE 文本转数值、NUMBERVALUE 分隔符解析、TEXT 格式化输出、XLOOKUP 行位置映射、IF 条件分支和 FILTER 动态筛选 | 写 Excel 单函数原理图解、文本与数值转换、格式代码、条件判断、查找映射、动态数组筛选或需要“一章一张信息图”的函数教程时参考 |
| `src/content/posts/excel-wps-weird-issues.mdx` | `教程` | 持续记录 Excel、WPS 和影刀表格自动化中的少见问题；当前收录 WPS `set_range()` 写入以等号开头文本时触发 COM 异常的原因与修复方式 | 写 Excel/WPS 踩坑记录、影刀表格自动化异常、`set_range()` COM 错误和文本公式识别问题时参考 |
| `src/content/posts/excel-groupby-xlookup-high-performance-summary.mdx` | `教程` | 从大量 SUMIFS 重复汇总同一源表的性能问题出发，讲清 GROUPBY 一次汇总、XLOOKUP 批量查回、组合 Key、TAKE 拆列和 FILTER 日期范围汇总 | 写 Excel 大数据公式优化、GROUPBY、XLOOKUP、组合 Key、SUMIFS 重构和动态数组性能文章时参考 |
| `src/content/posts/qianniu-ecommerce-operation-learning-map.mdx` | `教程` | 从一条商品链接出发，把 SKU、价格体系、营销推广、订单 ERP、物流售后、评价与运营优化串成完整电商经营链路，并补充面对陌生后台功能的学习方法 | 写千牛工作台、电商运营入门、新人培训、商品从上架到售后的全链路教学文章时参考 |
| `src/content/posts/ecommerce-price-hierarchy-target-price-planning.mdx` | `教程` | 先解释单品宝、活动和营销工具让利（非活动让利），再讲当前标价如何生效、活动如何校验、覆盖叠加与活动优先级、消费端到手价检查、价盘补差，以及平时价与活动价一致时的标价反推方法 | 写电商价格体系、优惠叠加优先级、营销工具让利、活动卡控价、普惠卷后价、活动标价反推和价盘目标到手价教程时参考 |
| `src/content/posts/ecommerce-dashboard-from-daily-report-to-management-board.mdx` | `实践` | 多店铺电商经营看板设计，覆盖店铺对比、型号退款率、链接退款率、推广分析、库存周转和保护套专题 | 写电商数据看板、影刀RPA经营分析、日报升级方案时参考 |
| `src/content/posts/ecommerce-link-profit-model-rebuild.mdx` | `实践` | 从同批订单、时间、成本性质和计算粒度四类错位解释旧利润模型，并重构为 T-21～T-8 成熟金额退款率、包裹级沉没成本、拍单与售后损耗、三类推广费和 5% 保留统一汇总的近 7 天链接利润表 | 写电商链接利润、广告投放盈亏、订单级成本、退款率口径和利润模型重构时参考 |
| `src/content/posts/ecommerce-review-analysis-agent-workflow.mdx` | `实践` | 电商评价分析 Agent 整页视觉案例，以滚动叙事方式展示两张评价表统一、Python 事实包、日报与周期对比、钉钉交付闸门和发送成功后的分表状态回写 | 写电商评价分析、钉钉 AI 表格、事实包、Agent 报告、Webhook 交付闭环、状态回写和整页数据故事时参考 |
| `src/content/posts/southeast-asia-warehouse-shipping-rules.mdx` | `实践` | 东南亚仓网与发货决策信息图，覆盖三国雅仓、同国双平台共享、跨国隔离、本地优先、深圳兜底和后台核对口径 | 写东南亚海外仓、双平台库存共用、跨境兜底和仓储发货规则时参考 |
| `src/content/posts/ai-product-image-agent-workflow.mdx` | `实践` | AI 商品图工作流重构复盘，覆盖从逐张临场决策到规划前移、Art Direction、同组差异化、纯执行生成、人工审查和规则单一来源 | 写商品图生成、Agent 工作流重构、视觉规划、Prompt 设计和执行边界时参考 |
| `src/content/posts/ai-product-image-workflow-in-practice.mdx` | `实践` | 以一次脱敏后的真实新品项目为背景，讲清输入资料、四个 Skill 分工、竞品链接抓取、可选评价分析、Art Direction 前移、真实产品图边界、纯执行生成和定向整改 | 写 AI 商品图真实使用流程、Skill 协作、竞品分析、视觉规划、补拍边界和单图执行时参考 |
| `src/content/posts/github-pages-deployment-guide.mdx` | `实践` | GitHub Pages 部署原理图解手册，覆盖访问链路、Astro 构建、Actions artifact、站点路径映射、发布检查和分层排障 | 写部署说明、构建发布、静态站点原理和 Pages 故障排查时参考 |
| `src/content/posts/wsl-devspace-caddy-chmlfrp-chatgpt.mdx` | `实践` | 在 WSL 中用 DevSpace、Caddy 和 ChmlFrp 暴露公网 HTTPS MCP 地址，包含完整配置、systemd 常驻、Windows KeepAlive、验证命令和常见配置坑 | 写 WSL 本地 MCP 公网接入、DevSpace、Caddy、ChmlFrp、ChatGPT 连接教程时参考 |
| `src/content/posts/wsl-devspace-tailscale-funnel-chatgpt.mdx` | `实践` | 通用 DevSpace + Tailscale Funnel 教程，覆盖 Linux、WSL、Windows 和 macOS 的环境选择，并按本地 401、OAuth metadata、Funnel 和 ChatGPT 真实调用逐层验收 | 写本地 MCP 公网接入、跨平台 DevSpace 启动方式、Tailscale Funnel、ChatGPT OAuth 连接和分层排查时参考 |
| `src/content/posts/repetitive-reporting-is-not-execution.mdx` | `实践` | 从全平台商品退款率和抖音每日报表两套制度出发，批评把重复下载、筛选、填写和刷新当作执行力，并提出统一订单数据源、自动日期口径和异常驱动的人机分工 | 写数据报表流程优化、RPA 自动化、重复劳动治理、执行力与人才评价文章时参考 |
| `src/content/posts/performance-review-should-recognize-talent.mdx` | `生活` | 从运营助理分级考核表出发，批评统一能力清单如何用短板限制长板，并提出共同底线加专项晋升路线 | 写职场观察、绩效考核、人才管理、专人专项和制度批评类文章时参考 |
| `src/content/posts/everyone-wants-to-be-landlord-at-work.mdx` | `生活` | 用“人人都是农民，人人都想当地主”的隐喻讨论职场权力膨胀，从 A/B/C 任务分派案例拆解权力上收、责任下沉、越级指挥和“你应该懂”的管理逻辑 | 写职场权力、管理责任、上下级协作、任务分派和权责边界类文章时参考 |
| `src/content/posts/h-pylori-acid-drink-note.mdx` | `生活` | 幽门螺杆菌、胃酸过多和气泡饮料的个人判断笔记 | 写生活判断清单、风险边界提醒、个人健康记录类文章时参考 |
