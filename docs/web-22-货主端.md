# 辅助模块 — 货主端（hz）

> 本文档覆盖 EDB 系统货主端（`hz`）全部功能：货主登录、下单/订单跟踪、回单、仓储预约与出入库、账单确认、看板大屏、子公司管理。货主端是面向货主企业用户的业务入口，UI 与平台端（pt）共库，但菜单与业务范围按货主视角裁剪。

## 关联文档

| 文档 | 说明 |
|------|------|
| [web-20-登录与主框架](web-20-登录与主框架.md) | hz 登录与主框架机制 |
| [web-05-核心业务-订单管理](web-05-核心业务-订单管理.md) | 订单域核心服务说明 |
| [web-06-核心业务-仓储管理](web-06-核心业务-仓储管理.md) | wms 服务说明 |
| [web-07-核心业务-财务管理](web-07-核心业务-财务管理.md) | fc 账单服务说明 |
| [web-21-大屏看板](web-21-大屏看板.md) | 货主大屏 kanban |
| [api-00-接口清单](api-00-接口清单.md) | hz 端接口事实源 |

## 模块总览

| 业务域 | 代码路径 | 页面数 | 核心功能 |
|--------|----------|--------|----------|
| 登录 | `hz/login` | 3 | 账号/短信验证码登录、忘记密码、多公司选择（selectTenant） |
| 主框架 | `hz/home` | 3 | 布局、菜单（`menuTF.loadMenuTree`）、消息中心、改密、登出 |
| 订单 | `hz/ord` | 11 | 货主下单/改单/复制单、订单管理、订单消息、回单、运单详情 |
| 仓储 | `hz/wms` | 10 | 库存分配（物料/储位）、预约、出入库、传感器数据 |
| 财务 | `hz/fc` | 3 | 客户账单列表、已确认账单、未确认账单（确认操作） |
| 大屏 | `hz/bigScreen` | 1 | 货主看板大屏（kanban） |
| 子公司 | `hz/subCompany` | 1 | 子公司维护 + 线路绑定 |

## 目录树

```
src/page/hz/
├── login/
│   ├── login.vue / login.js         # 货主登录
│   ├── forgetPassword.vue           # 忘记密码（短信验证）
│   └── selectTenant.vue             # 多公司选择
├── home/
│   ├── home.vue / home.js           # 货主主框架
│   ├── navMenu.vue                  # 货主菜单
│   └── toMain.vue                   # 首页
├── ord/
│   ├── order/                       # 订单相关（下单/改单/复制/列表/消息/打印/详情）
│   ├── receipts/receiptsManage.vue  # 回单管理
│   └── waybill/detail/              # 运单详情 + 操作日志
├── wms/
│   ├── allocat/                     # 库存分配（物料/储位）
│   ├── appoint/custAppointManage.vue# 客户预约
│   ├── ord/                         # 入库单/出库单管理
│   └── sensor/                      # 传感器数据
├── fc/bill/                         # 客户账单（已/未确认）
├── bigScreen/kanban.vue             # 货主大屏
└── subCompany/subCompanyManage.vue  # 子公司与线路
```

## 一、登录与主框架

### 1.1 登录（hz/login）

- `userTF.webHzLogin`（密码登录）与 `userTF.webHzSendLoginSmsValidCode`（短信验证码）双模式
- `userTF.webHzgetShowCode` 判断是否需要图形验证码；密码经 `$getRsaCode` RSA 加密
- 忘记密码：`userTF.webHzSendPasswordSmsValidCode` 发送短信 → 重置密码
- 多公司：登录成功后若关联多公司，进入 `selectTenant.vue`，`userTF.selTenant` 切换公司并刷新 token

### 1.2 主框架（hz/home）

结构同平台端（见 [web-20](web-20-登录与主框架.md)）：
- 左侧 `navMenu`（`menuTF.loadMenuTree` 拉取货主菜单树）
- 顶部消息中心下拉（`userTF.loadMessageHZ` 加载数量），按 `v-entity` 权限点显示订单/回单/账单/器具/仓储消息入口
- 用户菜单：基础资料、修改密码、注销退出
- 初次登录强制改密（`modifyPasswordFirst`）；常规改密走短信验证（`webHzSendPasswordSmsValidCode` + `smsModifyPassword`）

## 二、订单域（hz/ord）

### 2.1 订单管理（orderManage.vue）

货主侧订单列表。核心接口：

| 接口 | 用途 |
|------|------|
| `orderTF.queryConsignorOrderInfoList` | 货主视角订单列表（按发货人查询） |
| `orderTF.cancelOrder` | 取消订单 |
| `commonTF.getSysStaticData` | 静态枚举（订单状态等） |

列表支持按状态、时间、车牌等条件筛选，详情进入 `orderDetail`。

### 2.2 下单 / 改单 / 复制（addOrderHZ / updateOrderHZ / copyOrderHZ）

| 页面 | 接口 | 说明 |
|------|------|------|
| `addOrderHZ` | `orderTF.saveOrUpdateOrder` | 新建订单：发货/收货地址、业务类型、装货时间、货物、车型车长、结算方式、回单、报价等 |
| `updateOrderHZ` | `orderTF.queryOrderInfo` → 回填 → `orderTF.saveOrUpdateOrder` | 修改订单 |
| `copyOrderHZ` | 同 updateOrderHZ | 复制已有订单为新订单 |

### 2.3 订单消息（orderMessageManage.vue）

货主订单消息中心：

| 接口 | 用途 |
|------|------|
| `orderTF.loadOrderMessagePageHZ` | 分页加载货主订单消息 |
| `orderTF.batchReadMessage` | 批量标记已读 |
| `orderTF.batchDeleteMessage` | 批量删除消息 |

### 2.4 回单管理（receiptsManage.vue）

- `receiptsTF.queryReceiptsInfoData`：回单信息查询
- 支持查看回单状态、下载/预览回单图片

### 2.5 运单详情（waybill/detail/waybillDetail.vue）

- `ordWaybillTF.queryOpLogList`：运单操作日志时间线（下单 → 派车 → 出车 → 到达 → 签收等）
- `subpage/waybillLog.vue`：日志明细子页

## 三、仓储域（hz/wms）

### 3.1 库存分配（allocat/）

| 页面 | 接口 | 说明 |
|------|------|------|
| `stockMaterialManageHZ` | `wmsMaterialPickTF.queryStockMaterialPage` + `wmsBaseTF.getAllWorkStore` | 按物料维度查库存 |
| `stockStorageManageHZ` | `wmsMaterialPickTF.queryStockStoragePage` + `wmsBaseTF.getAllWorkStore` | 按储位维度查库存 |
| `capaStockManageMainHZ` | - | 容量库存入口页 |

### 3.2 预约（appoint/custAppointManage.vue）

货主预约车辆到库：

| 接口 | 用途 |
|------|------|
| `wmsCustAppointTF.queryWmsAppointInfoPageForCust` | 货主视角预约分页 |
| `wmsCustAppointTF.saveWmsAppoint` | 新增预约 |
| `wmsCustAppointTF.delWmsAppoint` | 删除预约 |
| `wmsCustAppointTF.getCustRelWorkStore` | 客户关联仓库下拉 |

### 3.3 出入库（ord/）

| 页面 | 接口 | 说明 |
|------|------|------|
| `inOrderManage` | `wmsInOrderTF.queryInOrderPage` | 入库单列表 |
| `inOrderDetail` | `wmsInOrderTF.queryWmsInOrderInfoForView` + `queryStockQrcodeList` | 入库单详情 + 二维码/库位 |
| `inOrderDtlManage` | `wmsInOrderTF.queryInOrderDtlPage` | 入库明细 |
| `outOrderManage` | `wmsOutOrderTF.queryOutOrderPage` | 出库单列表 |
| `outOrderDetail` | `wmsOutOrderTF.queryWmsOutOrderInfoForView` + `queryStockQrcodeList` | 出库单详情 |

### 3.4 传感器数据（sensor/custSensorDataInfoManage.vue）

- `sensorTF.querySensorDataPage`：货主查看温湿度等传感器数据记录

## 四、财务域（hz/fc）

### 4.1 账单确认（bill/）

| 页面 | 接口 | 说明 |
|------|------|------|
| `billManageMain` | - | 账单管理入口（Tab 容器） |
| `unconfirmedBill` | `fcCustBillTF.queryCustomerBillPage`（未确认）<br>`queryCustomerBillDetailList`（明细）<br>`sureFcCustomerBill`（确认）<br>`customerTF.queryCustomerData` | 未确认账单列表 + 查看明细 + 确认操作 |
| `confirmedBill` | `fcCustBillTF.queryCustomerBillPage`（已确认） | 已确认账单列表 |

**货主确认账单流程**：货主登录 → 财务 → 未确认账单 → 查看账单明细（仓储/配送/其他费用）→ 确认 → 状态变为已确认，平台财务据此开票结算。

## 五、货主大屏（hz/bigScreen/kanban.vue）

货主侧数据看板（详情见 [web-21](web-21-大屏看板.md) 通用约定）：

| 接口 | 用途 |
|------|------|
| `kanbanTF.loadKanbanPage` | 看板分页数据 |
| `kanbanTF.loadKanbanSum` | 看板汇总数据 |
| `workGoodsTF.queryWorkDataSelect` | 工作流数据下拉 |
| `commonTF.getSysStaticData` | 静态枚举 |

## 六、子公司管理（hz/subCompany/subCompanyManage.vue）

货主维护子公司与线路关系：

| 接口 | 用途 |
|------|------|
| `customerTF.queryCustomerList` | 货主客户（子公司）列表 |
| `customerTF.getCustomerDetailInfo` | 子公司详情 |
| `routeTF.loadRouteTenantData` | 线路-租户关系数据 |
| `routeTF.loadRouteDataByTenantId` | 按租户查线路 |
| `routeTF.saveOrUpdateRouteTenantRel` | 保存线路绑定关系 |

**典型用法**：货主企业有多家子公司（发货主体），在此为每家子公司绑定可用的运输线路。

## 七、货主端典型流程

```
货主登录(密码/短信) → 多公司选择(可选)
   ├─ 下单：新增订单 → 填地址/货物/车型/报价 → 提交（orderTF.saveOrUpdateOrder）
   ├─ 跟踪：订单管理 → 运单详情 → 操作日志（ordWaybillTF.queryOpLogList）
   ├─ 回单：回单管理 → 查看回单
   ├─ 仓储：预约到库 → 入库单/出库单 → 库存查看 → 传感器数据
   ├─ 结算：未确认账单 → 查看明细 → 确认账单
   ├─ 大屏：货主看板实时数据
   └─ 子公司：维护子公司与线路绑定
```

## 八、注意事项

1. **接口命名**：货主端接口普遍带 `ForCust` / `HZ` 后缀（如 `queryConsignorOrderInfoList`、`loadOrderMessagePageHZ`），与平台端接口区分，勿混用。
2. **权限控制**：货主端顶部消息入口、菜单项均以 `v-entity` 权限点控制（如 `2010002` 订单消息），新增功能需在后台配置权限点。
3. **主题与样式**：货主主框架复用平台端 `home.scss`，仅通过 `homeHzPage` 类名微调，样式修改注意两端影响。
4. **多公司切换**：切换公司（`userTF.selTenant`）后 token 会刷新，页面数据需重新加载。
5. **仓库范围**：货主 wms 数据均以当前登录客户（`localStorage.userInfo` 中的客户 ID）为维度过滤，接口层自动带条件。
