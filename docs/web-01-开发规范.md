# 开发规范 — EDB 企业数字化管理平台

> **关联文档**：

| 关联文档 | 关联说明 |
|----------|---------|
| [web-00-项目总览.md](./web-00-项目总览.md) | 项目架构与核心机制 |
| [web-02-公共组件库.md](./web-02-公共组件库.md) | 表格/搜索/弹窗等公共组件用法 |
| [web-03-工具函数库.md](./web-03-工具函数库.md) | common.js 工具函数用法 |
| [api-00-接口清单.md](./api-00-接口清单.md) | 后端接口事实源 |

## 1. 文件组织规范

### 1.1 目录约定

页面按 **端 → 业务域** 组织，业务域目录下再按业务子域分子目录：

```
src/page/pt/ord/                    # 平台端-订单业务域
├── order/                          # 订单子域
│   ├── order.vue                   # 页面模板 + 样式
│   ├── order.js                    # 页面逻辑（与 .vue 同名的 .js）
│   └── order.css                   # 可选：独立样式（部分页面）
├── dispatch/                       # 调度子域
│   ├── dispatch.vue
│   └── dispatch.js
└── ...
```

### 1.2 命名规范

| 对象 | 规范 |
|------|------|
| 页面目录 | 业务英文简称（order、dispatch、waybill） |
| 页面文件 | 小驼峰命名（orderManage.vue） |
| 页面逻辑文件 | 与 .vue 同名的 .js（orderManage.js） |
| 业务域顶层 | 简称（ord、wms、fc、res、cm、purchase） |
| 组件目录 | 小驼峰（myTab、searchList、mapDialog） |
| API BeanName | 后端服务名（如 orderTF、wmsStockTF） |
| 枚举常量 | 大写下划线（OPEN_PAGE_TYPE.DETAIL） |

### 1.3 页面三文件（双文件）模式

大部分业务页面采用 **.vue（模板）+ .js（逻辑）** 分离模式：`.vue` 仅含模板与样式，所有 methods/data/computed 写在同名的 `.js` 中，通过 `import` 引入。

```vue
<!-- orderManage.vue -->
<template>
  <div class="order-manage">
    <searchList v-model="searchData" :searchConfig="searchConfig" @search="loadData" />
    <table ref="table" :columns="columns" :data="dataList" />
  </div>
</template>
<script>
import orderManage from './orderManage.js'
export default orderManage
</script>
```

```js
// orderManage.js
export default {
  name: 'orderManage',
  data() { return { searchData: {}, columns: [] } },
  methods: {
    loadData() { this.$refs.table.load('orderTF', 'queryOrderList', this.searchData) }
  }
}
```

## 2. API 调用规范

### 2.1 postUrl 签名

所有后端接口统一通过 `common.postUrl` 调用（内部封装 axios，RPC 风格：`beanName + methodName` 定位服务方法）：

```js
postUrl(beanName, methodName, param, successFun, errorFun, type, shadow)
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| beanName | String | 是 | 后端服务标识（如 `orderTF`、`wmsStockTF`） |
| methodName | String | 是 | 服务方法名（如 `queryOrderList`） |
| param | Object | 是 | 请求参数 |
| successFun | Function | 否 | 成功回调 |
| errorFun | Function | 否 | 失败回调 |
| type | String | 否 | 请求方式，默认 `post` |
| shadow | Boolean | 否 | 是否显示全局遮罩，默认 false |

**返回值**：Promise。可使用 `await` 或 `.then()` 链式调用。

### 2.2 调用示例

```js
// 方式一：Promise + await（推荐）
const data = await this.common.postUrl('orderTF', 'queryOrderDetail', { orderId: id });

// 方式二：回调函数
this.common.postUrl('orderTF', 'queryOrderList', params, (res) => {
  this.dataList = res.data;
});

// 方式三：表格组件内置加载（自动绑定分页参数）
this.$refs.table.load('orderTF', 'queryOrderList', this.searchData);

// 方式四：带遮罩的请求
await this.common.postUrl('wmsTF', 'saveStock', params, null, null, 'post', true);
```

### 2.3 调用约定

- 列表查询接口：统一使用 `this.$refs.table.load(beanName, methodName, searchParams)`，表格组件自动携带分页/排序参数
- 保存/删除等写操作：建议加 `shadow=true` 遮罩，防止重复提交
- 参数名使用后端约定字段（下划线命名如 `order_no` 或小驼峰，以接口文档为准）
- 接口异常统一由 `errorFun` 处理，公共错误提示已内置于 postUrl 封装

## 3. 状态管理

- Vuex 为**单文件 Store**（`src/store/index.js`），主要承载：登录态（token）、动态组件名（componentName）、标签页信息（keepAlivePage、visitPageInfo）等**全局性状态**
- 业务页面数据（搜索条件、列表、表单）**不要**放入 Vuex，直接在页面组件 data 中管理
- 跨组件通信使用 **事件总线**（`utils/bus.js`）或 **myTab.doParentMethod** 等机制

## 4. 权限控制

### 4.1 v-entity（按钮级权限）

用户可访问的实体权限码存储在 `localStorage.entityIds`（逗号分隔），通过指令控制元素显隐：

```html
<!-- 单个权限码：无权限时移除元素 -->
<el-button v-entity="'orderAdd'">新增订单</el-button>

<!-- 多个权限码（任一匹配即显示） -->
<el-button v-entitys="'orderAdd,orderCopy'">新增/复制</el-button>

<!-- 动态权限码：根据路由参数 pId 从映射表取值 -->
<el-button v-entity="'orderStatus'" :entityId="[{1:'orderEdit',2:'orderConfirm'}, pId]">操作</el-button>
```

> 注意：`v-entitys` 的值是逗号分隔字符串，`v-entity` 的值是单个权限码；两者都会在无权限时**直接移除 DOM 元素**。

### 4.2 指令清单

| 指令 | 作用 |
|------|------|
| `v-entity="'code'"` | 按单权限码控制显隐 |
| `v-entitys="'a,b'"` | 按多权限码（任一匹配）控制显隐 |
| `v-focus` | 页面加载自动聚焦 |
| `v-mynumval` | 仅允许输入整数 |
| `v-mypmnumval` | 仅允许输入正负整数 |
| `v-mydoubleval` | 仅允许输入两位小数（非负） |
| `v-mypmdoubleval` | 仅允许输入正负两位小数 |
| `v-mypmdoublethousandval` | 正负两位小数，支持千分位 |
| `v-mydouble4val` | 仅允许输入四位小数 |
| `v-mydouble4valNoBlur` | 四位小数（不监听 blur，性能优先） |
| `v-mypmdouble4val` | 正负四位小数 |
| `v-mydouble5val` | 仅允许输入五位小数 |
| `v-mydiyval="n"` | 自定义小数位（n 为位数） |

## 5. 安全机制

| 机制 | 说明 |
|------|------|
| **RSA 加密** | `main.js` 注册全局 `$getRsaCode(明文)`，登录等敏感场景使用后端 RSA 公钥加密参数 |
| **Token 认证** | 登录后 token 写入 localStorage/store，请求头携带校验；`common.js` 检测 token 失效自动跳转登录 |
| **iframe 通信** | 平台通过 iframe 嵌入页面时，使用 postMessage 传递 token；仅接受来自 `https://salary.1000e56.com` 来源的消息 |
| **HTTPS 跳转** | 生产环境（非 localhost）自动将 `http://` 请求重定向到 `https://` |
| **会话超时** | `localStorage.sessionTime` 记录最近操作时间，用于会话过期校验 |

## 6. 精确计算规范

金额计算**必须**使用 `common` 提供的精确计算函数（内部基于 decimal.js），禁止直接使用 JS 浮点运算：

```js
common.accAdd(0.1, 0.2)   // 0.3（非 0.30000000000000004）
common.accSub(1, 0.9)     // 0.1
common.accMul(1.5, 2)     // 3
common.accDiv(1, 3)       // 0.3333333333333333
Number.prototype.myToFixed // 四舍五入并补零（如 (1.005).myToFixed(2)）
```

## 7. 表格组件规范

列表页统一使用 `table` 组件（搜索 + 表格 + 分页一体）：

| 配置项 | 说明 |
|--------|------|
| `:data` | 表格数据（查询后赋值） |
| `:columns` | 列配置（字段/标题/格式化/自定义列） |
| `ref="table"` | 通过 `$refs.table.load(bean, method, params)` 加载数据 |
| `@rowClick` / 操作列 | 行点击/操作按钮事件 |
| `v-entity` | 操作列按钮权限控制 |

详情见 [web-02-公共组件库.md](./web-02-公共组件库.md)。

## 8. 表单验证规范

- 必填校验：el-form rules 使用 `required: true`
- 数字输入：金额/数量输入框按精度加对应指令（`v-mydoubleval` 两位小数等）
- 手机号/电话：使用 `common.validatemobile` / `common.validateTel`
- 提交前校验：`this.$refs.form.validate(valid => {...})`

## 9. 样式规范

### 9.1 CSS 变量（主题）

全局定义 CSS 变量，通过 `common.initTheme()` 动态切换主题色：

```css
:root {
  --theme-color: #1990ff;            /* 主色（平台端） */
  --theme-color-hover: #2e9aff;
}
.edu { --theme-color: #e70b1d; }     /* 易迁易大学主题色 */
```

- 平台端主色 `#1990ff`，易迁易大学主色 `#e70b1d`
- 页面样式中优先引用 `var(--theme-color)` 保证主题一致性

### 9.2 SCSS 全局注入

`vue.config.js` 配置了 `scss.prependData` 全局注入，`_variable.scss`/`mixin.scss` 中的变量与 mixin 可在任何页面的 `<style lang="scss">` 中直接使用，无需重复 import。

### 9.3 布局规范

- 页面根节点使用 `page-container`/`page-content` 等通用 class
- 搜索区使用 `searchList` 组件统一布局
- 弹窗统一使用 `myDialog`/ElementUI `el-dialog` 宽度规范

## 10. 组件开发规范

1. 公共组件放置于 `src/components/<组件名>/`，采用 `组件名.vue + 组件名.js` 双文件结构
2. 组件 `name` 属性必须与目录名一致（便于 keep-alive 与 DevTools 调试）
3. 组件对外通过 props 接收配置、emit 事件回调父页面（如 `table` 组件的 `load` 方法）
4. 可复用的业务子功能优先抽取为公共组件，避免页面间复制粘贴
5. 页面级组件不要放入 `src/components`，应放在所属业务域目录内

## 11. Git 与提交规范

| 项 | 约定 |
|----|------|
| 分支 | 按需求/功能命名（如 `orderBoard`） |
| 提交信息 | 简要描述改动点 |
| 禁止 | 提交 node_modules、dist 产物、本地调试代码 |

---

> 实际开发中如遇规范与代码现状不一致，以业务可运行为准并及时更新本文档。
