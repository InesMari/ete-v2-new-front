# 公共组件库 — EDB 企业数字化管理平台

> **关联文档**：

| 关联文档 | 关联说明 |
|----------|---------|
| [web-00-项目总览.md](./web-00-项目总览.md) | 组件在架构中的位置 |
| [web-01-开发规范.md](./web-01-开发规范.md) | 组件开发与使用规范 |
| [web-03-工具函数库.md](./web-03-工具函数库.md) | 组件依赖的工具函数 |

## 1. 组件总览

公共组件位于 `src/components/`，共约 **47 个组件目录**，按功能可分为 9 类：

| 分类 | 组件 |
|------|------|
| 页面框架与导航 | `myTab`、`innerTab` |
| 搜索与筛选 | `searchList`、`filterSelect`、`dataPicker`、`dateRange`、`monthsPicker`、`seasonPicker`、`myElDatePicker` |
| 表单输入 | `myElSelect`（空）、`mySelect`、`nativeSelect`、`lazySelect`、`scrollSelect`、`myAutocomplete`、`mycity`、`mycityH5`、`myTag`、`myWangEditor`、`wangEditor` |
| 数据表格 | `table`、`scrollTable`、`simpleTable`、`dbTable`、`iptTable` |
| 文件与上传 | `myImport`、`myImportDown`、`myFile`、`myFileModel`、`imgsUpload`、`officeViewer`、`videoPlayer` |
| 地图 | `mapDialog`、`mapTrack` |
| 树形与权限 | `tree`、`treeV2`（空）、`myElTree`、`auth`（authRoleTree/userRoleList） |
| 业务辅助 | `operateLog`、`commonOpLog`、`printSet`、`trackScheduleDialog`、`areaMatch`、`rankChart` |

> 说明：`myElSelect`、`treeV2` 目前为空目录（遗留），实际下拉/树组件请使用 `mySelect`、`tree`。

---

## 2. 页面框架与导航

### 2.1 myTab（多标签页容器）

| 项 | 内容 |
|----|------|
| 路径 | `src/components/myTab/myTab.vue` |
| name | `myTab` |
| 用途 | 主框架核心组件：管理多标签页（类似浏览器标签），支持打开/切换/关闭/刷新标签、动态注册路由、页面缓存、路由异常处理 |
| 核心方法 | `openTab(item)` 打开页面（动态 addRoute + push）；`closeTab()` / `closeOthers()` / `closeAll()` 关闭标签；`refreshTab()` 刷新；`saveTab()` 持久化标签；`calcTab()` 处理标签溢出；`doParentMethod()` 调用父页面方法 |
| 使用方式 | `<myTab ref="myTab" />`，页面内 `this.$refs.myTab.openTab({urlPath, urlName, urlId, query})` |

> 详见 [web-04-状态管理与路由.md](./web-04-状态管理与路由.md)。

### 2.2 innerTab（页面内 Tab 切换）

| 项 | 内容 |
|----|------|
| 路径 | `src/components/innerTab/innerTab.vue` |
| name | `innerTab` |
| 用途 | 页面内部的多 Tab 切换（数据详情页中切换"基本信息/详情/日志"等） |
| Props | `tabs`：tab 数组（label/title 标题） |
| 方法 | `changeTab(id)` 切换 tab；`closeTab(id)` 关闭 |

---

## 3. 搜索与筛选

### 3.1 searchList（搜索条件栏）

| 项 | 内容 |
|----|------|
| 路径 | `src/components/searchList/searchList.vue` |
| name | `searchList` |
| 用途 | 列表页标准搜索栏：根据配置渲染搜索项（输入框/下拉/日期/弹窗选人等），支持展开/收起 |
| Props | `searchConfig`：搜索项配置数组；`formData`：搜索数据对象（v-model）；`searchKey`：搜索按钮文案 |
| 事件 | `@search` 点击搜索（携带表单数据） |

```vue
<searchList v-model="searchData" :searchConfig="searchConfig" @search="loadData" />
```

### 3.2 filterSelect（筛选下拉）

| 项 | 内容 |
|----|------|
| 路径 | `src/components/filterSelect/filterSelect.vue` |
| 用途 | 带过滤功能的下拉选择器，支持输入关键字过滤选项 |
| Props | 含 `options`（选项列表）、`filterable`（可过滤）、`value` 等 |

### 3.3 日期选择器组

| 组件 | 路径 | 用途 |
|------|------|------|
| `dataPicker` | `components/dataPicker/` | 单日期选择（`type` 支持 date/datetime 等） |
| `dateRange` | `components/dateRange/` | 日期区间选择（开始/结束日期） |
| `monthsPicker` | `components/monthsPicker/` | 月份选择器 |
| `seasonPicker` | `components/seasonPicker/` | 季度选择器 |
| `myElDatePicker` | `components/myElDatePicker/` | ElementUI DatePicker 二次封装（含快捷选项、禁用日期、默认值） |

---

## 4. 表单输入

### 4.1 mySelect（下拉选择）

| 项 | 内容 |
|----|------|
| 路径 | `src/components/mySelect/mySelect.vue` |
| 用途 | 下拉选择器，支持远程搜索、多选、可清空 |
| 特点 | 与 `el-select` 用法兼容，扩展了远程搜索（`remote` 时调用 `postUrl`） |

### 4.2 nativeSelect（原生下拉）

| 项 | 内容 |
|----|------|
| 路径 | `src/components/nativeSelect/nativeSelect.vue` |
| 用途 | 原生 `<select>` 封装，用于特殊场景（如移动端、大数据量） |

### 4.3 lazySelect（懒加载下拉）

| 项 | 内容 |
|----|------|
| 路径 | `src/components/lazySelect/lazySelect.vue` |
| 用途 | 懒加载下拉：展开时动态加载选项（按关键字/分页），适合选项量大的场景 |

### 4.4 scrollSelect（滚动选择器）

| 项 | 内容 |
|----|------|
| 路径 | `src/components/scrollSelect/scrollSelect.vue` |
| 用途 | 滚动加载更多选项的下拉选择器 |

### 4.5 myAutocomplete（自动补全）

| 项 | 内容 |
|----|------|
| 路径 | `src/components/myAutocomplete/myAutocomplete.vue` |
| 用途 | 输入联想（el-autocomplete 封装），输入关键字远程匹配选项 |

### 4.6 mycity / mycityH5（城市选择）

| 组件 | 路径 | 用途 |
|------|------|------|
| `mycity` | `components/mycity/` | PC 端省市区级联选择 |
| `mycityH5` | `components/mycityH5/` | 移动端省市区级联选择 |

### 4.7 myTag（标签）

| 项 | 内容 |
|----|------|
| 路径 | `src/components/myTag/myTag.vue` |
| 用途 | 状态标签/可编辑标签，常用于列表状态列（`type` 映射颜色） |

### 4.8 富文本

| 组件 | 路径 | 用途 |
|------|------|------|
| `wangEditor` | `components/wangEditor/` | wangeditor 富文本编辑器封装 |
| `myWangEditor` | `components/myWangEditor/` | 富文本封装（含图片上传） |

---

## 5. 数据表格

### 5.1 table（标准表格 — 最核心）

| 项 | 内容 |
|----|------|
| 路径 | `src/components/table/tableCommon.vue` + `tableCommon.js` |
| name | `tableCommonComponents`（内部实际组件名） |
| 用途 | 业务列表页**标准表格**：分页、多选、排序、列设置、合计、行点击、加载态等一体化 |
| Props | `head`（列配置）、`tableName`（表格名）、`singleSelect`（单选）、`showSelect`（多选框）、`showSetTable`（列设置按钮）、`showNum`（序号列）、`hideScale`（隐藏缩放）、`doSum`（合计行）、`doQrySum`（查询合计） |
| 方法 | `load(bean, method, params)` 加载数据；`refresh()` 刷新；`clearSelection()` 清空选中 |
| 事件 | `@rowClick` 行点击、`@selectionChange` 选中变化 |

```vue
<table ref="table" :columns="columns" :data="dataList" showSetTable :doSum="['amount']" @rowClick="handleRow" />
```

### 5.2 scrollTable（滚动表格）

| 项 | 内容 |
|----|------|
| 路径 | `src/components/scrollTable/scrollTable.vue` |
| 用途 | 无分页的大数据滚动表格（加载更多/滚动到底自动加载） |
| Props | `head`（列配置）、`height`（高度）、`maxHeight`、`doSum`/`doQrySum`（合计）、`isShowSelect`（多选）、`isShowNum`（序号） |

### 5.3 simpleTable（简单表格）

| 项 | 内容 |
|----|------|
| 路径 | `src/components/simpleTable/simpleTable.vue` |
| 用途 | 轻量只读表格（无分页/无交互），用于详情页、子表展示 |
| Props | `head`（列配置）、`height`、`doSum` |

### 5.4 dbTable（详情表格）

| 项 | 内容 |
|----|------|
| 路径 | `src/components/dbTable/dbTable.vue` |
| 用途 | 详情页信息表格（键值对展示） |

### 5.5 iptTable（可编辑表格）

| 项 | 内容 |
|----|------|
| 路径 | `src/components/iptTable/iptTable.vue` |
| 用途 | 支持单元格输入的编辑表格，用于录单/批量录入场景 |

---

## 6. 文件与上传

### 6.1 myImport（导入弹窗）

| 项 | 内容 |
|----|------|
| 路径 | `src/components/myImport/myImport.vue` |
| 用途 | Excel 导入弹窗：上传文件 → 校验 → 导入；支持下载模板、导入历史 |
| Props | `importUrl` / `beanName`/`methodName`（导入接口）、`templateUrl`（模板下载地址） |

### 6.2 myImportDown（导入+下载模板）

| 项 | 内容 |
|----|------|
| 路径 | `src/components/myImportDown/myImportDown.vue` |
| 用途 | 导入弹窗的变体，内置模板下载按钮与导入说明 |

### 6.3 myFile / myFileModel（文件上传）

| 组件 | 路径 | 用途 |
|------|------|------|
| `myFile` | `components/myFile/` | 单文件上传组件（图片/文档），含预览、下载 |
| `myFileModel` | `components/myFileModel/` | 文件列表模型：支持多文件、类型限制、大小限制 |

### 6.4 imgsUpload（图片上传）

| 项 | 内容 |
|----|------|
| 路径 | `src/components/imgsUpload/imgsUpload.vue` |
| 用途 | 多图上传（拖拽/选择/预览/删除），返回文件路径数组 |

### 6.5 officeViewer / videoPlayer

| 组件 | 路径 | 用途 |
|------|------|------|
| `officeViewer` | `components/officeViewer/` | Office 文档在线预览 |
| `videoPlayer` | `components/videoPlayer/` | 视频播放器 |

---

## 7. 地图

### 7.1 mapDialog（地图弹窗）

| 项 | 内容 |
|----|------|
| 路径 | `src/components/mapDialog/mapDialog.vue` |
| 用途 | 地图弹窗：选点/展示定位（百度地图），用于地址定位、配送范围 |

### 7.2 mapTrack（轨迹回放）

| 项 | 内容 |
|----|------|
| 路径 | `src/components/mapTrack/mapTrack.vue` |
| 用途 | 车辆行驶轨迹地图展示/回放（百度地图 + 坐标转换） |

---

## 8. 树形与权限

### 8.1 tree（树形控件）

| 项 | 内容 |
|----|------|
| 路径 | `src/components/tree/tree.vue` |
| 用途 | 树形组件（el-tree 封装）：菜单树/组织树/分类树，支持勾选、展开、搜索过滤 |

### 8.2 myElTree（Element 树封装）

| 项 | 内容 |
|----|------|
| 路径 | `src/components/myElTree/myElTree.vue` |
| 用途 | el-tree 二次封装，扩展节点勾选联动、懒加载 |

### 8.3 auth（权限树）

| 项 | 内容 |
|----|------|
| 路径 | `src/components/auth/authRoleTree.vue`、`userRoleList.vue` |
| 用途 | 角色-权限树分配（authRoleTree）；用户-角色分配（userRoleList） |

---

## 9. 业务辅助

### 9.1 operateLog / commonOpLog（操作日志）

| 组件 | 路径 | 用途 |
|------|------|------|
| `operateLog` | `components/operateLog/` | 操作日志查看弹窗（按操作人/时间/类型筛选） |
| `commonOpLog` | `components/commonOpLog/` | 通用操作日志组件 |

### 9.2 printSet（打印设置）

| 项 | 内容 |
|----|------|
| 路径 | `src/components/printSet/printSet.vue` |
| 用途 | 打印参数设置弹窗（打印机选择、份数、模板），配合 LODOP 使用 |

### 9.3 trackScheduleDialog（派车单调度弹窗）

| 项 | 内容 |
|----|------|
| 路径 | `src/components/trackScheduleDialog/trackScheduleDialog.vue` |
| 用途 | 订单调度派车弹窗（分配车辆/司机/装货时间） |

### 9.4 areaMatch（区域匹配）

| 项 | 内容 |
|----|------|
| 路径 | `src/components/areaMatch/areaMatch.vue` |
| 用途 | 省市区地址匹配/选择 |

### 9.5 rankChart（排名图表）

| 项 | 内容 |
|----|------|
| 路径 | `src/components/rankChart/rankChart.vue` |
| 用途 | 排名/排行条形图（echarts 封装），用于报表页 |

---

## 10. 组件使用建议

1. **列表页**：优先使用 `searchList` + `table` 组合，统一体验
2. **详情页**：使用 `dbTable` / `simpleTable` 展示只读数据
3. **表单页**：下拉用 `mySelect`/`lazySelect`，日期用 `dataPicker`/`dateRange`，城市用 `mycity`
4. **文件处理**：上传用 `myFile`/`myFileModel`/`imgsUpload`，导入用 `myImport`，预览用 `officeViewer`/`videoPlayer`
5. **地图**：定位/选点用 `mapDialog`，轨迹用 `mapTrack`
6. **新组件**：放置于 `src/components/<名称>/`，采用 `.vue + .js` 双文件结构，`name` 与目录名一致

---

> 组件 props 详细事实表（脚本生成）见 `docs/_facts/components-props.md`（内部维护用）。
