# AI 支撑 — 平台端页面索引（pages-index.json）

> 本文档描述平台端页面索引事实源 `docs/pages-index.json` 的用途、结构、维护方式与 AI 应用层对接路线。
> 该 JSON 记录了 **平台端（pt）每一个 `.vue` 页面的路径与功能说明**，供"工程 AI 应用层"消费：页面导航跳转、功能问答、本地关键词直达、系统提示词 / RAG 检索。

| 关联文档 | 关联说明 |
|----------|---------|
| [web-00-项目总览.md](./web-00-项目总览.md) | 项目目录与多端结构 |
| [web-04-状态管理与路由.md](./web-04-状态管理与路由.md) | myTab 动态路由与 openTab 机制 |
| [api-00-接口清单.md](./api-00-接口清单.md) | 接口事实源（相关接口字段的来源） |
| [web-05 ~ web-19](./web-README.md) | 各业务模块文档（页面描述抽取来源） |
| [web-README.md](./web-README.md) | 知识库总入口 |

---

## 一、这是什么

平台端页面采用 **myTab 动态路由** 机制（`openTab` → 动态 `import('@/page'+urlPath)`），页面清单分散在：
后端菜单（`menuTF.loadMenuTree`）、`navMenu.js initDevTab()`、`router/config.js`、以及上千个页面源码的 `openTab` 调用中。

`pages-index.json` 把这些分散信息**聚合成一份机器可读的页面清单**：每个页面记录其组件路径、路由名、所属模块、功能描述、别名关键词、相关接口与引用来源，方便 AI 理解"系统里有哪些页面、每个页面干什么用、如何打开"。

## 二、文件形态

- **位置**：`docs/pages-index.json`（与 docs 知识库一起维护，UTF-8，2 空格缩进）
- **生成器**：`docs/tools/extract-pages.js`（零依赖 Node 脚本，仿 `extract-api.js`）
- **覆盖范围**：平台端 `src/page/pt` 下全部 `.vue`（约 742 个）。hz/edu/wx/demo/sh 等端后续扩展（条目 `end` 字段已预留）。
- **重新生成**：`node docs/tools/extract-pages.js`（Node ≥ 14，项目默认 node 过旧时可用 nvm 高版本 node 执行）

## 三、页面条目 schema

```jsonc
{
  "id": "/pt/ord/order/orderManage.vue", // 唯一键 = 相对 src/page 的 .vue 路径
  "name": "订单管理",                     // 中文页面名（可空，待精修）
  "end": "pt",                           // 所属端
  "module": "ord",                       // 所属 pt 顶层目录
  "moduleName": "订单管理",              // 模块中文名
  "filePath": "/pt/ord/order/orderManage.vue", // 同 id（便于检索）
  "urlPath": "/pt/ord/order/orderManage.vue",  // 动态 import 路径（@/page + urlPath）
  "routeNames": ["/order"],              // 候选路由名（代码引用中 urlPathName 集合）
  "nameCandidates": ["订单管理"],        // 中文名候选（来自 openTab urlName / devTab / 文档）
  "type": "page",                        // 页面类型（人工可覆盖）：page | menu | detail | bigScreen | framework | login | ...
  "pageTypeHint": "menu",                // 脚本按文件名启发式推断的类型
  "description": "订单列表：查询、下单、编辑、复制、取消、审核…", // 功能说明（事实源：docs 文档/人工）
  "descSource": "doc",                   // 描述来源：doc(自动文档) | manual(人工) | code | none
  "keywords": [],                        // 别名关键词（人工精修，供问答/关键词直达）
  "relatedApis": ["orderTF.queryOrderInfoList", "…"], // 相关接口（bean.method）
  "queryHint": "",                       // 打开该页常用 query 参数说明（人工精修）
  "referencedBy": ["src/page/pt/…/xx.js", "…"], // 代码中引用该页面的文件（最多 10 个）
  "fileExists": true,                    // 文件是否仍存在（重跑后自动校正）
  "status": "draft"                      // todo | draft | done | fileMissing（见下）
}
```

## 四、status 语义与精修流程约定

| status | 含义 | 谁写入 |
|--------|------|--------|
| `todo` | 尚未有描述，待人工/AI 补 | 脚本自动 |
| `draft` | 已有自动描述（多为 docs 文档抽取），待人工复核 | 脚本自动 |
| `done` | 人工精修完成（name/description/keywords/type/queryHint 已定稿） | 人工修改后标记 |
| `fileMissing` | 对应 .vue 已从源码删除（记录保留，便于追踪） | 脚本自动 |

### 精修约定（人工/AI 分批执行时遵循）

1. **name**：使用系统内习惯叫法（菜单名/标签页标题），如"订单管理"而非"订单列表管理页"。
2. **description**：一句话说清"这页是做什么的"，优先动词开头：查询/新增/审核/打印/配置…；可从对应 `web-0x` 模块文档该页所在小节复制，再精简。
3. **keywords**：2~8 个同义词/别名/易被用户口语化的词，如订单管理页 → `["订单","下单","派车","运单","委托"]`；关键词将用于 AI 关键词直达与问答检索。
4. **type**：仅在下述确有把握时覆盖：
   - 后端菜单直接挂载的主页面 → `menu`
   - 列表详情/弹窗级子页 → `detail`
   - 独立 URL 直达的大屏/看板 → `bigScreen`
   - 登录/主框架/布局页 → `framework`
5. **queryHint**：若该页依赖 query 参数（如 `orderStates=0` 待调度、`id=xx` 详情），注明格式。
6. **精修完成**：上述字段补好后将 `status` 改为 `done`；重跑脚本不会覆盖 `done` 条目的人工字段。

## 五、维护流程

```
修改源码（增/删/改页面）
   ↓
node docs/tools/extract-pages.js        # 重扫源码 + docs，自动刷新机器字段
   ↓（脚本行为）
新增页面 → 追加新条目
删除页面 → 旧条目标 fileMissing（不删除）
字段同步 → routeNames/relatedApis/referencedBy/pageTypeHint 等刷新
人工字段 → status=done 条目的 name/description/keywords/type/queryHint 不被覆盖
   ↓
按需对 status=draft/todo 的条目执行「精修约定」（人工或 AI 分批）
```

- **全量重建**（id 错乱等异常时）：`node docs/tools/extract-pages.js --fresh`（会丢弃既有人工字段，慎用）
- 分布式说明也适用：**以 JSON 为准**，人工不要直接编辑脚本输出结构以外的部分；脚本变更需同步本文档。
- **首批试点（2026-09）**：已完成 ord/wms 共 12 个旗舰页面精修（订单管理、调度管理、订单详情、短驳配送管理等，`status=done`），作为后续分批精修的样例参考；再次运行脚本验证不会覆盖上述人工字段。

## 六、已知局限（务必阅读）

1. **后端菜单不可见**：平台端菜单树由后端 `menuTF.loadMenuTree` 下发，静态扫描只能收录"代码内可发现"的页面（源码 openTab + devTab + router/config + docs）。**菜单页与其层级、是否在后端挂菜单，需人工在 JSON 中补录/核对**（`type=menu`、`queryHint` 字段为此预留）。因此 **pages-index.json ≠ 用户可见菜单清单**，它更接近"全部潜在页面 + 已登记中文名的并集"。
2. **docs 覆盖不全**：各 web-0x 文档只覆盖核心页面；未命中文档的页面 `descSource=none`、`status=todo`，属预期，交由分批精修。
3. **文档未落盘行**：解析文档时出现但磁盘上找不到对应文件的表格行，会写入 `meta.unresolvedRows`（前 200 条），说明文档描述与源码可能已不一致，需人工核对（当前 2 条）。
4. **名称噪音**：`name`/`routeNames` 来自源码引用，部分同一页面在不同业务处打开时 urlName 各异（如"新增/修改/查看"同一页面），`nameCandidates` 保留了全部候选，首项为出现频次最高的。
5. **非页面 .vue**：pt 目录下存在少量被复用的页面内组件（无独立路由意义），也会被收录为 `type=page` + `status=todo`，精修时可将其 `type` 标为 `sub` 或忽略。

## 七、AI 应用层对接路线（后续阶段，schema 已兼容）

| AI 能力 | 消费方式 | 依赖字段 |
|--------|---------|---------|
| 页面导航跳转 | 新工具 `openPage({ urlPath / query })`，走 myTab openTab | `urlPath`、`queryHint`、`routeNames` |
| 功能问答 | 检索 `description/keywords/moduleName` 后回答"XX 功能在哪/做什么" | `description`、`keywords`、`moduleName` |
| 本地关键词直达 | 由 `name/keywords` 批量生成 keywordMatcher 规则（毫秒命中，不耗 AI 额度） | `name`、`keywords`、`urlPath` |
| 系统提示词 / RAG | 整份 JSON（或裁剪字段后）导入 Dify / 拼入 System Prompt | 全字段 |

相关 AI 基建位置（现有雏形）：`src/components/chatBox/ai/agent/`（`agentRouter.js` / `keywordMatcher.js` / `toolRegistry.js` / `baseTool.js` / `tools/`）。

---

> 📅 生成时间：2026-09
> 🔧 维护：源码或 docs 变更后运行 `node docs/tools/extract-pages.js`
