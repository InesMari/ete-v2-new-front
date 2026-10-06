# 辅助模块 — 登录与主框架

> 本文档覆盖 EDB 系统的多租户登录体系、入口调度（`App.vue`）、平台/货主/大学主框架、菜单与多标签页、iframe token 通信等前端骨架机制。基于 `src` 源码逐行核实。

## 关联文档

| 文档 | 说明 |
|------|------|
| [web-00-项目总览](web-00-项目总览.md) | 多租户架构总览 |
| [web-04-状态管理与路由](web-04-状态管理与路由.md) | Vuex 状态与动态路由 |
| [web-01-开发规范](web-01-开发规范.md) | postUrl 调用规范、token 机制 |
| [web-02-公共组件库](web-02-公共组件库.md) | myTab、navMenu 等组件 |
| [api-00-接口清单](api-00-接口清单.md) | 登录/主框架相关接口事实源 |

## 模块总览

| 维度 | 说明 |
|------|------|
| 代码路径 | `src/App.vue`、`src/page/pt/{login,home}/`、`src/page/hz/{login,home}/`、`src/page/edu/{login,main,admin,student}/`、`src/components/myTab/` |
| 支持端 | pt 平台端、hz 货主端、edu 易迁易大学、wx 微信公众号下单 H5、大屏看板、fileViewer 文件预览 |
| 入口机制 | `App.vue` 顶层 `<component :is="componentName">`，`componentName` 由 Vuex `store.state.componentName` 驱动 |
| 身份存储 | `localStorage`：`token`、`userInfo`、`entityIds`（权限）、`defaultUrl`、`pageInfo`、`sessionTime` |
| 会话时长 | 会话缓存 4 小时（`sessionTime` + 4h），记住登录 7 天（`rememberTime` + 7d） |

## 目录树

```
src/
├── App.vue                       # 全局入口：组件分发 + iframe token 通信 + token 监听
├── router/config.js              # 外链/直达路径 → pageInfo 映射
├── page/
│   ├── pt/login/                 # 平台端登录
│   │   ├── login.vue / login.js
│   │   ├── forgetPassword.vue    # 忘记密码
│   │   └── selectTenant.vue      # 多公司选择
│   ├── pt/home/                  # 平台端主框架
│   │   ├── home.vue / home.js    # 布局 + openTab/closeTab + 待办 + 会话刷新
│   │   ├── navMenu.vue / navMenu.js  # 左侧菜单树（服务端下发）
│   │   └── ...                   # 头部、面包屑等
│   ├── hz/login/                 # 货主端登录（短信验证码）
│   ├── hz/home/                  # 货主端主框架
│   ├── edu/login/                # 大学端登录（学员/管理员双模式）
│   ├── edu/main/                 # 大学端学员首页
│   ├── edu/admin/home/           # 大学端管理端主框架
│   ├── edu/student/home/         # 大学端学员主框架
│   └── wx/order/addOrder.vue     # 微信公众号扫码下单
└── components/myTab/             # 多标签页组件（动态路由注册）
```

## 一、入口调度（App.vue）

`App.vue` 是唯一 SPA 入口，`mounted` 后依次执行三个初始化：

### 1.1 组件分发逻辑（`init()`）

按 URL path + host 双重判定，确定渲染哪个顶层组件：

| 判定条件 | 组件 | 说明 |
|----------|------|------|
| `pathName == '/hz'` 或 `https://hz.1000e56.com/` | `hzLogin` | 货主端 |
| `pathName == '/ahresty'` | `vehicleMonitorSaaS` | 车辆监控 |
| `pathName == '/appointmentBoard'` | `appointmentBoard` | 预约大屏 |
| `pathName == '/warehousingCenterBoard'` | `warehousingCenterBoard` | 仓库看板大屏 |
| `pathName == '/todayPlanBoard'` | `todayPlanBoard` | 今日计划大屏 |
| `pathName == '/deliveryBoard'` | `deliveryBoard` | 配送大屏 |
| `pathName == '/orderBoard'` | `orderBoard` | 订单大屏 |
| `pathName == '/edu'` 或 `https://edu.1000e56.com/` | `eduLogin` | 易迁易大学 |
| `pathName == '/wxOrder'` | `wxOrder` | 公众号下单 |
| `pathName == '/fileViewer'` | `fileViewer` | OnlyOffice 文件查看 |
| 其他 | 登录页/缓存页 | 见 1.2 |

跨域拦截（防止端间误入）：
- `https://pt.1000e56.com/hz` 或 `/edu` → 跳回 `https://pt.1000e56.com/`
- `https://hz.1000e56.com/pt` 或 `/edu` → 跳回 `https://hz.1000e56.com/`
- `https://edu.1000e56.com/pt` 或 `/hz` → 跳回 `https://edu.1000e56.com/`

### 1.2 登录态判定（默认分支）

```js
let name = localStorage.getItem("defaultUrl");   // 之前访问的缓存页
```

- 访问 `/login`：按 host 含 `hz` / `edu` / 其他分别进入 `hzLogin` / `eduLogin` / `login`
- 非 `/login`：检查 `sessionTime` 是否在 4 小时内有效
  - 有效且存在 `defaultUrl` → 直接进入缓存页（如 `home`）
  - 无效或不存在 → 按 host 进入对应登录页
- `rememberTime`（记住登录）7 天内有效则保留 `defaultUrl`，否则重置为 `login`

### 1.3 会话 token 监听（`listenToken()`）

监听 `visibilitychange`：当页面回到前台时，若 Vuex 中 `token` 与 `localStorage.token` 不一致（多标签页登出/重新登录），弹出提示并刷新页面重新走登录流程。

### 1.4 直达路径支持（router/config.js）

`src/router/config.js` 维护「外链/直达 URL → pageInfo」映射。`init()` 遍历映射，若当前 `href` 包含 key，则把对应配置写入 `localStorage.pageInfo`，主框架 `checkUrl()` 依据它自动打开目标标签页。

### 1.5 环境安全处理

- 生产环境 `http://` 自动升级 `https://`（host 含 `1000e56.com`）
- 微信 PC 浏览器弹窗提示使用谷歌浏览器（`/wxOrder` 除外）
- `appointPage=1` 参数存入 `sessionStorage`，供预约大屏独立打开使用

## 二、登录体系

### 2.1 平台端登录（pt/login/login.js）

| 项 | 说明 |
|----|------|
| 账号密码登录 | `postUrl("userTF", "webPtLogin", {billId, password: $getRsaCode(password), ...})`，密码 RSA 加密 |
| 短信验证码登录 | `webPtSendLoginSmsValidCode` 发送，60 秒倒计时；`webPtgetShowCode` 查询是否需要图形验证码 |
| 图形验证码 | 按需启用（`validCodeShow`），`genCode` 生成随机码 + 图片地址 |
| 记住账号 | 勾选后 base64 编码密码存 `localStorage.rememberAccount`，下次自动填充 |
| 成功后 | 存 `token` / `entityIds` / `userInfo`，提交 Vuex，跳转 `home` 或租户选择页 |

平台登录成功后若账号关联多个公司，进入 `selectTenant` 选择公司；每选一次组织会重新设置 `token`（后台按组织下发）。

### 2.2 货主端登录（hz/login/login.js）

- 与平台端同一 `userTF` 服务，使用 `webHzLogin` / `webHzSendLoginSmsValidCode` 等方法
- 支持账号密码 + 短信验证码两种方式；货主登录后进入 `hzHome`
- 多公司场景进入 `hzSelectTenant`（`selectTenant.vue`）：列表展示公司卡片，选中后进一步选择组织，确认后提交

`selectTenant.vue` 关键界面：公司卡片网格（`tenantList`）+ 组织卡片（`orgList`），选中高亮（`.active`），底部「确认 / 返回」。

### 2.3 易迁易大学登录（edu/login/login.js）

双模式登录（Tab 切换 `loginType`）：

| 模式 | 方法 | 跳转 |
|------|------|------|
| 学员（`loginType=1`） | `eduUserService.studentLoginForWeb` | `eduHome`（`/edu/main/home/toMain.vue`） |
| 管理员（`loginType=2`） | `eduUserService.adminLoginForWeb` | `eduAdminHome`，若 `noAuthHome` 则拒绝进入管理首页 |

- 支持密码登录 + 短信验证码（`sendLoginSmsValidCode`）
- `$getRsaCode` 加密密码，`validCodeShow` 控制图形验证码
- 记住账号密码（base64）存入 `localStorage.rememberAccount`
- 忘记密码跳转 `eduForgetPassword`

### 2.4 微信端

微信端无登录页。`/wxOrder` 由二维码直接进入 `wx/order/addOrder.vue`，先调 `orderService.checkQRCodeID` 校验二维码有效性（`codeValid` 0 失效 / 1 有效），有效才渲染下单表单。

## 三、平台端主框架（pt/home）

### 3.1 框架职责（home.js）

| 方法 | 职责 |
|------|------|
| `openMain()` | 打开首页标签（urlName=首页，urlId=4001002） |
| `openTab(item)` | 通过 `$refs.myTab.openTab(item)` 新增/切换标签页（item 含 urlName/urlId/urlPath/urlPathName/query） |
| `closeTab(id, parentId, isDoParentMethod, parentMethodName)` | 关闭标签，可回调父页面刷新（默认 `doQuery`） |
| `closeOthers() / refreshTab() / refreshAllTab()` | 关闭其他 / 刷新单个 / 刷新全部标签 |
| `checkUrl()` | 依据 `pageInfo` / Vuex `visitPageInfo` 打开直达路径，未配置则回首页 |
| `logout()` | `userTF.logout` → 清空全部 localStorage → 跳回 `/?ver=${timestamp}` |
| 待办加载 | 调用待办服务拉取当前用户待办数量，头部角标展示 |
| 会话刷新 | 定时刷新 `sessionTime`，超过 4 小时会话失效 |

### 3.2 菜单树（navMenu.vue / navMenu.js）

- 菜单由服务端下发（登录后拉取），存 `localStorage` 或 Vuex
- 支持一级/二级/多级菜单渲染；`@click` 打开对应页面标签
- 菜单项可配置权限过滤；`menuSearch` 支持菜单搜索
- 收藏菜单：`tabsCollect` 勾选收藏，`saveCollect` 保存（对话框形式）

### 3.3 多标签页（myTab）

见 [web-02-公共组件库](web-02-公共组件库.md) 中 myTab 章节。要点：

- `myTab.openTab(item)`：已存在同 `urlId` 则激活，否则 `router.addRoute()` 动态注册路由 + 加入 `tabs`
- `refresh(urlId)`：携带防缓存参数重新加载页面
- 右键菜单：关闭当前/其他/全部/左侧/右侧标签
- 标签可拖拽排序（`vuedraggable`）、滚动、一键关闭全部子页面

### 3.4 页面动态注册

业务页面使用「三文件分离」模式（`.vue` + `.js` + 可选 `.scss`），`myTab` 在打开时按 `urlPath` 用 `import()` 懒加载并 `addRoute`，因此**路由表无需预注册每个业务页**（详见 [web-04](web-04-状态管理与路由.md)）。

## 四、货主端 / 大学端主框架

| 端 | 主框架 | 特点 |
|----|--------|------|
| 货主（hz） | `hz/home/home.vue` | 顶部 Logo + 用户信息 + 登出，左侧菜单（业务简化版），myTab 多标签；`common.initTheme('hz')` 加载货主主题 |
| 大学学员（edu） | `edu/main/home/toMain.vue` | 学习平台首页，菜单含课程/考试/图书等（详见 web-23） |
| 大学管理（edu） | `edu/admin/home/home.vue` | 管理端主框架，`openMain()` 打开 `toMain.vue` 首页；`checkUrl()` 支持直达；`logout()` 调 `userTF.logout` 后清缓存跳回 `/edu` |

大学管理端 `logout` 清理项：`defaultUrl`、`token`、`entityIds`、`userInfo`、`rememberAccount`、`pageInfo`，并以 `?ver=${timestamp}` 强制刷新。

## 五、iframe + postMessage 跨域通信

`App.vue.initMessage()` 监听 `window.message`：

```js
if (e.origin !== "https://salary.1000e56.com") return;  // 来源白名单
if (e.data.type === "TOKEN") {
  const token = localStorage.getItem(e.data.key);
  e.source.postMessage({ type: "DATA_RESULT", data: token }, e.origin);
}
```

**机制说明**：
- 主站（如 `https://salary.1000e56.com`）通过 iframe 嵌入 EDB 页面
- 主站向 iframe 发送 `{type:"TOKEN", key:"token"}` 请求读取登录态
- EDB 页面校验来源为白名单后回传 `{type:"DATA_RESULT", data}`，实现跨域单点登录（SSO）
- 安全要求：**仅信任 `https://salary.1000e56.com` 来源**，其他来源一律忽略

## 六、文件查看器入口

`/fileViewer?url=<encodeURIComponent(文件地址)>` 路由由 `App.vue` 分发到 `components/myFile/file-viewer.vue`：

| 文件类型 | 处理方式 |
|----------|----------|
| 图片 / 视频 | 当前页内预览（`showFrame=true`），显示关闭按钮 |
| PDF | 新标签页打开 `fileViewer?url=` 预览 |
| Word / Excel / PPT | 弹「在线预览 / 下载文件」选择框，预览在新标签页 |
| 其他 | 直接调用 `common.downloadFile` 下载 |

## 七、关键接口（登录与主框架）

| 服务 beanName | 方法名 | 用途 | 调用端 |
|---------------|--------|------|--------|
| `userTF` | `webPtLogin` | 平台端密码登录 | pt |
| `userTF` | `webPtSendLoginSmsValidCode` | 平台端发送登录短信 | pt |
| `userTF` | `webPtgetShowCode` | 查询是否需要图形验证码 | pt |
| `userTF` | `webHzLogin` | 货主端登录 | hz |
| `userTF` | `webHzSendLoginSmsValidCode` | 货主端发送登录短信 | hz |
| `userTF` | `logout` | 退出登录（平台/大学通用） | pt/edu |
| `eduUserService` | `studentLoginForWeb` | 大学学员登录 | edu |
| `eduUserService` | `adminLoginForWeb` | 大学管理员登录 | edu |
| `eduUserService` | `webPtSendLoginSmsValidCode` | 大学发送登录短信 | edu |
| `orderService` | `checkQRCodeID` | 校验微信下单二维码 | wx |

> 完整接口以 [api-00-接口清单](api-00-接口清单.md) 为准（pt/home、pt/login、hz/login、hz/home、edu/login、edu/admin/home、wx/order 等分组）。

## 八、注意事项

1. **不要手动改 `componentName`**：顶层组件切换完全由 `App.vue` 的 URL 判定逻辑 + Vuex 状态驱动，登录/登出通过 `$store.commit('resetData', {name:'componentName', data:'xxx'})` 切换。
2. **token 存储位置**：`localStorage.token` 是唯一持久化凭证，Vuex `state.token` 是运行期快照，二者不一致会触发强制刷新。
3. **跨域白名单**：新增 iframe 集成时，`initMessage()` 中的来源白名单必须按需调整，不要放开为 `*`。
4. **会话时效**：登录后 `sessionTime` 4 小时过期；长期挂机需注意刷新频率，页面回到前台会校验 token。
5. **直达路径配置**：新增外链直达入口需在 `router/config.js` 增加映射，并在主框架 `checkUrl()` 支持的范围内。
