# 辅助模块 — 大屏看板

> 本文档覆盖 EDB 系统全部大屏/看板页面：订单大屏、预约大屏、仓储中心大屏、今日计划大屏、配送大屏、车辆监控。各页面均通过独立 URL 直达（不经登录主框架），由 `App.vue` 顶层组件分发，适合投放到仓库/调度中心电视屏。

## 关联文档

| 文档 | 说明 |
|------|------|
| [web-20-登录与主框架](web-20-登录与主框架.md) | App.vue 大屏路由分发机制 |
| [web-05-核心业务-订单管理](web-05-核心业务-订单管理.md) | 订单域相关服务 |
| [web-06-核心业务-仓储管理](web-06-核心业务-仓储管理.md) | 预约/出入库相关服务 |
| [web-08-核心业务-资源管理](web-08-核心业务-资源管理.md) | 车辆监控相关服务 |
| [api-00-接口清单](api-00-接口清单.md) | 大屏接口事实源 |

## 模块总览

| 大屏 | URL 路径 | 组件 | 核心功能 |
|------|----------|------|----------|
| 订单大屏 | `/orderBoard` | `page/pt/dataReport/kanban/orderBoard.vue` | 待调度/待出车/待卸货列表、运作中订单、订单状态饼图、统计汇总 |
| 预约大屏 | `/appointmentBoard` | `page/pt/wms/board/appointmentBoard.vue` | 车辆预约到库实时列表 |
| 仓储中心大屏 | `/warehousingCenterBoard` | `page/pt/wms/board/warehousingCenterBoard.vue` | 仓储汇总、入库/出库趋势、物料占比、出库流向 |
| 今日计划大屏 | `/todayPlanBoard` | `page/pt/wms/board/todayPlanBoard.vue` | 今日出库单看板列表 |
| 配送大屏 | `/deliveryBoard` | `page/pt/wms/board/deliveryBoard.vue` | 配送运单看板列表 |
| 车辆监控 | `/ahresty` | `page/pt/res/vehicleMonitorSaaS.vue` | 百度地图车辆实时定位监控 |

> 全部大屏共享特征：深色大屏主题、自动刷新、表格自动滚动、F11/Esc 全屏切换、顶部实时时钟与星期。

## 目录树

```
src/page/pt/
├── dataReport/kanban/
│   └── orderBoard.vue / orderBoard.js      # 订单大屏
├── wms/board/
│   ├── appointmentBoard.vue / .js          # 预约大屏
│   ├── warehousingCenterBoard.vue / .js    # 仓储中心大屏
│   ├── todayPlanBoard.vue / .js            # 今日计划大屏
│   └── deliveryBoard.vue / .js             # 配送大屏
└── res/
    └── vehicleMonitorSaaS.vue / .js        # 车辆监控
```

## 一、订单大屏（orderBoard）

调度中心核心看板，投放大屏展示订单全链路状态。

### 1.1 页面分区

| 区域 | 内容 | 数据来源 |
|------|------|----------|
| 顶部 | 大屏标题、订单状态饼图（ECharts）、实时时钟 | `queryOrderListForScreen` 的 `stateList` |
| 左列 | 待调度列表（type=1） | `queryPrepDispatchOrderListForScreen` |
| 中列 | 待出车列表（type=2） | `queryPrepDispatchOrderListForScreen` |
| 右列 | 待卸货列表（type=3） | `queryPrepDispatchOrderListForScreen` |
| 下区 | 运作中订单列表（state 过滤） | `queryDispatchOrderListForScreen` |

### 1.2 核心机制

- **自动刷新**：`refresh` 默认 60 秒，`refreshTimer` 定时重查全部数据
- **数据变化优化**：`isStateListEqual()` 对比上次 `stateList`，数据无变化则跳过饼图重绘，减少性能开销
- **表格自动滚动**：`startScroll()` 每 50ms 滚动 1px，到底暂停 3 秒后回到顶部；hover 暂停；超出可视区才滚动
- **状态过滤**：运作中列表支持勾选状态（`state2` 已出车 / `state3` 超时 / `state4` 已超时），`filteredOperationList` 计算属性实时过滤
- **跳转后台**：点击「订单管理」`window.open("/pt/ord/order/orderManage.vue?orderStates=0")`；「派车单管理」`window.open("/pt/ord/waybill/waybillManage.vue?waybillState="+sts)`
- **饼图**：ECharts 环形图展示各订单状态占比，`resize` 自适应

### 1.3 接口

| beanName | methodName | 用途 |
|----------|------------|------|
| `orderService` | `queryPrepDispatchOrderListForScreen` | 待调度/待出车/待卸货列表（type 区分） |
| `orderService` | `queryDispatchOrderListForScreen` | 运作中订单列表 |
| `orderService` | `queryOrderListForScreen` | 订单状态统计（stateList + totalData） |

## 二、预约大屏（appointmentBoard）

展示仓库车辆预约到库的实时列表，用于收货口调度。

### 2.1 页面要点

- 列表字段：车牌号、仓库、司机、预计到库时间（`expectArriveDate`）、实际签到时间（`checkInDate`）等，时间格式化为「月-日 时:分」
- 仓库切换：`workList` 下拉（`getWorkStoreChildByWorkId` 拉取子仓库），选「全部」时 `isAll=1` 查所有仓库
- 自动刷新：`refresh` 默认 30 秒；列表超过可视高度时开启逐行滚动（`autoScroll()`，50ms/px），滚到底部重新查询
- 顶部时钟每秒更新（`setTimeInterval()`）

### 2.2 接口

| beanName | methodName | 用途 |
|----------|------------|------|
| `wmsAppointTF` | `queryWmsAppointInfoPage` | 预约信息分页查询（rows=999） |
| `wmsBaseTF` | `getWorkStoreChildByWorkId` | 获取仓库下子仓库列表 |

## 三、仓储中心大屏（warehousingCenterBoard）

仓储中心数据可视化大屏，含 5 类图表（Highcharts + ECharts 混合）。

### 3.1 图表区域

| 图表 | 类型 | 接口 |
|------|------|------|
| 首页汇总数据 | 数字卡片（子仓库数、仓库数、累计入库/出库等） | `wmsBaseTF.queryHomeCollectData` |
| 入库量趋势图 | Highcharts 折线（近 7 天） | `wmsBaseTF.queryHomeInStokeData` |
| 出库量趋势图 | Highcharts 折线（近 7 天） | `wmsBaseTF.queryHomeOutStokeData` |
| 库存物料占比 | Highcharts 环形图 | `wmsBaseTF.queryStockMaterialData` |
| 出库物料占比 | Highcharts 环形图 | `wmsBaseTF.queryOutMaterialData` |
| 物料出库流向 | ECharts 柱状图（按条件/维度） | `wmsBaseTF.queryOutMaterialDataByCondition` |

### 3.2 要点

- 深色半透明主题：图表背景 `transparent`，轴线/网格线使用低透明度白色
- 物料占比统一经 `getMaterialData()` 转换为 `{name, y}` 结构
- 窗口 `resize` 时重新初始化图表；`beforeDestroy` 清除时钟定时器
- 近 7 天日期由 `getdays()` 本地计算（从今天往前推 7 天，无接口）

## 四、今日计划大屏（todayPlanBoard）

展示今日出库计划/出库单看板，结构与预约大屏一致（列表 + 自动滚动 + 仓库切换）。

### 接口

| beanName | methodName | 用途 |
|----------|------------|------|
| `wmsOutOrderTF` | `queryOutOrderKanbanPage` | 出库单看板分页（rows=999） |
| `wmsBaseTF` | `getWorkStoreChildByWorkId` | 子仓库列表 |

## 五、配送大屏（deliveryBoard）

展示配送运单看板，用于配送中心监控。

### 接口

| beanName | methodName | 用途 |
|----------|------------|------|
| `wmsOutOrderTF` | `queryWmsWaybillKanbanPage` | 配送运单看板分页（rows=999） |
| `wmsBaseTF` | `getWorkStoreChildByWorkId` | 子仓库列表 |

## 六、车辆监控（vehicleMonitorSaaS）

基于百度地图（BMap）的车辆实时定位监控大屏。

### 6.1 功能

| 功能 | 说明 |
|------|------|
| 实时地图 | 百度地图 `BMap.Map`，默认中心北京（116.404, 39.915），滚轮缩放 |
| 车辆定位 | `monitorTF.vehicleMonitorSaaS` 查询全部车辆经纬度，`setViewport` 自动调整视野包含所有车辆 |
| 车辆标注 | 自定义小车图标（`/static/image/car.png`），车牌号 Label 标签（蓝色背景） |
| 车头朝向 | `rotation` 字段设置 Marker 旋转角度，还原车头方向 |
| 车辆详情 | 点击 Marker 弹出 InfoWindow：车牌号、定位时间、最新位置 |
| 车牌过滤 | 顶部车牌号输入框（`query.plateNumber`）条件查询 |

### 6.2 接口

| beanName | methodName | 用途 |
|----------|------------|------|
| `monitorTF` | `vehicleMonitorSaaS` | 车辆定位监控数据（车牌号过滤，返回经纬度/位置/定位时间/方向角） |

## 七、大屏通用约定

| 约定 | 说明 |
|------|------|
| URL 直达 | 大屏均为独立 URL，无需登录，适合浏览器全屏 / 电视投放 |
| 全屏切换 | F11 进入全屏、Esc 退出全屏（`fullScreen()` / `exitFullScreen()`） |
| 自动刷新 | 页面级定时器按 `refresh`（30/60 秒）重查数据 |
| 自动滚动 | 列表超过可视高度后逐像素滚动，到底重新查询 |
| 时钟 | `setTimeInterval()` 每 500ms 更新「年月日 + 星期」，刷新频率 30/60 秒 |
| 数据兜底 | 接口失败时 `console.error` 记录，不影响页面其他区域渲染 |

## 八、注意事项

1. **大屏无登录校验**：URL 直达意味着依赖服务端接口鉴权（token 参数），部署时勿将大屏 URL 直接暴露公网。
2. **订单大屏跳转**：`openOrderManage` / `openWaybillManage` 使用 `window.open` 打开后台页面路径（`/pt/ord/...`），依赖平台主框架的直达路径支持（router/config.js）。
3. **车辆监控依赖 BMap**：需在 `index.html` 引入百度地图 JS API 且全局可用 `BMap`。
4. **图表性能**：订单大屏通过数据对比避免无变化时重绘；仓储中心大屏在 `beforeDestroy` 清理定时器，避免内存泄漏。
5. **仓库维度**：wms 系列大屏均以当前登录用户仓库（`localStorage.userInfo.workId`）为默认查询范围，切换「全部」需确认用户具备跨仓权限。
