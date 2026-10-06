# 状态管理与路由 — EDB 企业数字化管理平台

> **关联文档**：

| 关联文档 | 关联说明 |
|----------|---------|
| [web-00-项目总览.md](./web-00-项目总览.md) | 核心机制概览 |
| [web-01-开发规范.md](./web-01-开发规范.md) | 页面打开与开发规范 |
| [web-02-公共组件库.md](./web-02-公共组件库.md) | myTab 标签页组件 |
| [web-20-登录与主框架.md](./web-20-登录与主框架.md) | App.vue 入口逻辑 |

## 1. 状态管理（Vuex）

ETE 使用 **单文件 Vuex Store**（`src/store/index.js`），不按模块拆分。全局状态仅保留跨页面/跨端共享的数据，业务数据一律保存在页面组件内。

### 1.1 State 清单

| State | 类型 | 说明 |
|-------|------|------|
| `componentName` | String | 当前端入口组件名（由 App.vue 根据 URL 识别后写入，驱动 `<component :is>` 动态切换） |
| `token` | String | 登录令牌；标签页切换时对比 token 判断是否在别的标签做过登录操作 |
| `routeId` | String | 当前页面 ID（侧边栏定位使用，因 `this.$route.meta.id` 获取不可靠，故存 Vuex） |
| `keepAlivePage` | Array | 需要 keep-alive 缓存的页面列表 |
| `visitPageInfo` | Object | 访问链接信息 |
| `cityRegExp` | RegExp | 城市名称后缀匹配正则（用于地址省市区解析） |

### 1.2 Mutations

| Mutation | 参数 | 说明 |
|----------|------|------|
| `resetData` | `{ name, data }` | 通用状态设置：`state[name] = data` |

### 1.3 使用示例

```js
// 写入
this.$store.commit('resetData', { name: 'routeId', data: 'detail123' })
// 读取
const componentName = this.$store.state.componentName
```

## 2. 路由机制

ETE 的路由设计与传统 SPA 差异较大，采用 **"空路由 + 运行时动态注册"** 模式：

```
main.js: new Router({ mode:'history', routes: [] })   ← 初始路由为空
   ↓
App.vue: 根据 URL 动态挂载入口组件（componentName）     ← 登录/主框架/大屏
   ↓
主框架内: myTab.openTab(item) → router.addRoute()      ← 动态注册业务页面路由
   ↓
router.config.js: 外部带参链接 → 打开指定页面            ← 消息/通知跳转
```

### 2.1 路由实例（src/router/index.js + main.js）

```js
// main.js
Vue.use(Router)
const router = new Router({
  mode: "history",   // 路径不展示 # 号
  routes: []         // 空路由，全部页面在运行时动态注册
});
```

> `src/router/index.js` 仅做 `Vue.use(Router)` 引入（保留扩展位）；实际实例创建在 `main.js`。

### 2.2 全局守卫

| 钩子 | 逻辑 |
|------|------|
| `beforeEach` | 调用 `common.setTableTitle()` 生成表格标题；定时修复表格固定列定位（`resetTableTopLeft` 处理 tableCommonComponents / scrollTableComponents 的 `#js_my_fixtable`、`.fixed-thead` 位置） |
| `afterEach` | 调用 `common.setSearchIsshowAll()` 恢复搜索栏展示状态 |

```js
// 重写 push：避免重复打开相同页面时报 NavigationDuplicated 错
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}
```

### 2.3 动态路由注册（myTab）

业务页面**不是**静态注册的，而是通过 `myTab` 组件的 `openTab(item)` 动态添加：

```js
// myTab.openTab(item) 核心逻辑
this.$router.addRoute({
  path: item.urlPathName + '_' + item.urlId,          // 如 /orderManage_order001
  name: item.urlName,
  params: item.params,
  component: () => import(`@/page${item.urlPath}`),   // 懒加载页面组件
  meta: {
    keep: true,
    id: item.urlId,
    path: item.formerPath,
    menuPath: item.urlPath,
    parentPath: this.$route.path,
    parentId: this.$route.meta.id
  }
})
this.$router.push({ path: item.urlPathName + '_' + item.urlId, query: item.query })
```

**openTab 入参结构**：

| 字段 | 说明 |
|------|------|
| `urlPath` | 页面 .vue 路径（如 `/pt/ord/order/orderManage.vue`），可带 `?a=1&b=2` 参数 |
| `urlPathName` | 路由路径名（缺省时从 urlPath 自动截取） |
| `urlName` | 标签页标题 |
| `urlId` | 页面实例 ID（区分同一页面的多个实例，如 `add123`/`detail456`） |
| `query` / `params` | 路由参数 |
| `urlType` | 页面类型标记 |

**典型调用方式**（页面内打开另一个页面）：

```js
this.$refs.myTab.openTab({
  urlPath: '/pt/ord/order/orderDetail.vue',
  urlId: 'detail' + orderId,
  urlName: '订单详情'
})
```

### 2.4 路由异常处理

myTab 监听 `router.onError`：

- **JS chunk 加载失败**（提示"发现系统更新"）：弹窗确认后刷新页面（`/?ver=时间戳` 强制重新加载）
- **页面未找到**：自动关闭该标签

### 2.5 外部链接映射（src/router/config.js）

用于**站外带参链接直达页面**（如消息通知、推送链接）。启动时解析 URL 参数，按链接关键字映射到页面：

| 关键字 | 打开页面 | 路径 |
|--------|----------|------|
| `questionDetail` | 查看问题 | `/pt/base/hc/qa/questionDetail.vue` |
| `viewRequirement` | 需求详情 | `/pt/proj/requirement/requirementDetail.vue` |
| `orderManage` | 订单管理 | `/pt/ord/order/orderManage.vue` |
| `waybillManage` | 派车单管理 | `/pt/ord/waybill/waybillManage.vue` |

### 2.6 页面缓存（keep-alive）

- `main.js` 中注册的页面组件与 `meta.keep: true` 的动态路由配合
- Vuex `keepAlivePage` 记录需要缓存的页面列表
- 关闭标签时从 keep-alive 列表移除对应页面，实现页面销毁

## 3. 页面打开全流程

```
用户点击菜单/按钮
   ↓
调用 this.$refs.myTab.openTab(item)（或 home.js 的 openTab 封装）
   ↓
myTab.openTab：
  1. 解析 urlPath 带参 → query
  2. router.addRoute 动态注册路由（懒加载组件）
  3. router.push 跳转
  4. 维护 tabs 标签列表 + 保存 tab 信息（saveTab）
  5. keep-alive 缓存管理（addKeepaliveRoute）
  6. calcTab 处理标签溢出
   ↓
目标页面组件加载，通过 this.$route.query / params 读取参数
```

## 4. 常见问题

| 问题 | 原因 | 处理 |
|------|------|------|
| 重复打开同一页面报 NavigationDuplicated | vue-router 重复 push | 已重写 `Router.prototype.push` 捕获 |
| 打开页面白屏并提示"发现系统更新" | 新构建后旧 chunk 失效 | 点击刷新页面，带时间戳强刷 |
| 侧边栏定位不准 | 无法获取 meta.id | 通过 Vuex `routeId` 辅助定位 |

---

> 主框架（菜单、标签页、iframe 通信）的完整说明见 [web-20-登录与主框架.md](./web-20-登录与主框架.md)。
