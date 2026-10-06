# 核心业务 — 仓储管理

> **关联文档**：

| 关联文档 | 关联说明 |
|----------|---------|
| [web-00-项目总览.md](./web-00-项目总览.md) | 业务全景 |
| [web-02-公共组件库.md](./web-02-公共组件库.md) | 页面使用的基础组件 |
| [web-21-大屏看板.md](./web-21-大屏看板.md) | 仓储看板 |
| [api-00-接口清单.md](./api-00-接口清单.md) | 接口事实源（`pt/wms` 分组） |

## 1. 业务概述

**仓储管理**（`src/page/pt/wms`）是平台**体量最大**的核心业务域（约 **152 个 .vue 页面**），覆盖仓库作业全流程：

```
预约到仓 → 入库收货（确认/分配/上架） → 库存管理（库区货位/分配/二维码）
   → 拣货/出库（出库单/分配策略） → 仓储运单 → 回单 → 费用结算
   → 盘点/检验/工单/设备/传感器温湿度监控
```

同时提供仓储报价、计费项、预警、拜访、扫描日志、时限管控等扩展能力。

- 核心服务标识（BeanName）：`wmsInOrderTF`、`wmsOutOrderTF`、`wmsAllocatTF`、`wmsStockMaterialTF`、`wmsMaterialPickTF`、`wmsReservoirTF`、`wmsWaybillService`、`wmsAppointTF`、`wmsTenantTF`、`wmsInventoryTF`、`wmsInspectionTaskService`、`wmsBaseTF`、`wmsFeeItemService`

## 2. 模块划分

| 子模块 | 目录 | 说明 |
|--------|------|------|
| 仓储首页/中心 | `warehousingCenter.vue` | 仓储中心驾驶舱（库存/出入库/预警汇总） |
| 预约管理 | `appoint/` | 预约到仓、客户预约 |
| 入库单 | `ord/`（InOrder） | 入库单、确认、费用、二维码、时限 |
| 出库单 | `ord/`（OutOrder） | 出库单、确认分配、拣货、费用 |
| 库存分配 | `allocat/` | 库存分配、冻结、库存明细、二维码（生成/合并/批量） |
| 基础数据 | `base/` | 物料、拣货策略、库区、货位、预警、租户、计费项、包装材料、车辆 |
| 仓储运单 | `waybill/` | 仓储运单管理、详情、打印 |
| 盘点 | `inventory/` | 库存盘点、设备盘点、盘点配置 |
| 检验 | `inspect/` | 检验标准、任务、登记、汇总、统计、指派 |
| 费用 | `fee/` | 费用操作、固定人员成本、劳务成本 |
| 工单 | `workOrder/` | 工单管理、结算汇总 |
| 设备 | `device/`、`monitor/` | 设备出入库、设备库存、监控 |
| 传感器 | `sensor/` | 温湿度传感器、数据报表、打印 |
| 报价 | `quoteSheet/` | 仓储报价单、报表 |
| 回单 | `receipts/` | 仓储回单 |
| 其他 | `board/`、`deliveryNoticeManage.vue`、`visit/`、`scancodeLog/`、`sysLogInfoManage.vue` | 看板、到货通知、拜访、扫码日志、系统日志 |

## 3. 核心页面清单

### 3.1 仓储中心（驾驶舱）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `warehousingCenter.vue` | 仓储中心首页：库存、出入库、外调数据、预警、二维码 | `wmsBaseTF.queryHomeCollectData`、`wmsBaseTF.queryHomeInStokeData`、`wmsBaseTF.queryHomeOutStokeData` |
| `board/appointmentBoard.vue` | 预约大屏 | `wmsAppointTF.queryWmsAppointInfoPage` |
| `board/warehousingCenterBoard.vue` | 仓储中心大屏 | `wmsBaseTF.queryHomeCollectData` |
| `board/todayPlanBoard.vue` | 今日计划大屏 | `wmsOutOrderTF.queryOutOrderKanbanPage` |
| `board/deliveryBoard.vue` | 配送大屏 | `wmsOutOrderTF.queryWmsWaybillKanbanPage` |

### 3.2 预约管理（appoint）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `appoint/appointManage.vue` | 预约管理：查询、取消、签到 | `wmsAppointTF.queryWmsAppointInfoPage`、`wmsAppointTF.wmsAppointInfoCheckInByStaff`、`wmsAppointTF.updateWmsAppointInfoState` |
| `appoint/custAppointManage.vue` | 客户预约管理 | `wmsCustAppointTF.queryWmsAppointInfoPage` |

### 3.3 入库单（ord - InOrder）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `ord/inOrderManage.vue` | 入库单列表：新增、删除、状态更新 | `wmsInOrderTF.queryInOrderPage`、`wmsInOrderTF.addOrUpdateInOrder`、`wmsInOrderTF.updateInOrderState` |
| `ord/addOrUpdateInOrder.vue` | 新增/编辑入库单（选物料/供应商/预约） | `wmsInOrderTF.addOrUpdateInOrder` |
| `ord/inOrderConfirm.vue` | 入库确认（扫码收货/分配货位） | `wmsInOrderTF.inOrderDeal`、`wmsReservoirTF.queryBlankStorageList` |
| `ord/inOrderDetail.vue` | 入库单详情（扫码查看） | `wmsInOrderTF.queryWmsInOrderInfoForView` |
| `ord/inOrderFeeConfirm.vue` | 入库费用确认 | `wmsInOrderTF.feeConfirm` |
| `ord/inOrderModify.vue` | 入库单修改 | `wmsInOrderTF.inOrderModify` |
| `ord/inOrderDtlManage.vue` | 入库明细管理 | `wmsInOrderTF.queryInOrderDtlPage` |
| `ord/printInOrder.vue` | 入库单打印 | `wmsInOrderTF.queryWmsInOrderInfoForPrint` |
| `ord/timeLimitManage.vue` | 出入库时限配置 | `wmsTimeLimitTF.saveWmsTimeLimitInfo` |

### 3.4 出库单（ord - OutOrder）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `ord/outOrderManage.vue` | 出库单列表 | `wmsOutOrderTF.queryOutOrderPage`、`wmsOutOrderTF.checkFeeConfirm` |
| `ord/addOrUpdateOutOrder.vue` | 新增/编辑出库单（选物料/库存） | `wmsOutOrderTF.addOrUpdateOutOrder`、`wmsMaterialPickTF.queryStockStorageSelPage` |
| `ord/outOrderConfirm.vue` | 出库确认（分配/拣货/库存分配策略） | `wmsOutOrderTF.outOrderDeal`、`wmsOutOrderTF.outOrderAllocat`、`wmsOutOrderTF.queryStockListForTactics` |
| `ord/outOrderFeeConfirm.vue` | 出库费用确认 | `wmsOutOrderTF.feeConfirm`、`wmsOutOrderTF.getOutCostList` |
| `ord/outOrderDetail.vue` | 出库单详情 | `wmsOutOrderTF.queryWmsOutOrderInfoForView` |
| `ord/outOrderDtlManage.vue` | 出库明细管理 | `wmsOutOrderTF.queryOutOrderDtlPage` |
| `ord/printOutOrder.vue` | 出库单打印 | `wmsOutOrderTF.queryWmsOutOrderInfoForPrint` |

### 3.5 库存分配与二维码（allocat）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `allocat/stockStorageManage.vue` | 库存分配（库区/货位、冻结/解冻） | `wmsAllocatTF.saveAllocatNew`、`wmsAllocatTF.freeze`、`wmsAllocatTF.unfreeze` |
| `allocat/stockMaterialManage.vue` | 物料库存查询 | `wmsMaterialPickTF.queryStockMaterialPage` |
| `allocat/stockDtlManage.vue` | 库存明细 | `wmsMaterialPickTF.queryStockDtlPage` |
| `allocat/wmsAllocatMaterialManage.vue` | 分配物料管理 | `wmsAllocatTF.saveAllocat` |
| `allocat/qrcode/qrcodeManage.vue` | 二维码管理（修改） | `wmsStockMaterialTF.queryStockMaterialQrcodePage` |
| `allocat/qrcode/generateBar.vue` | 生成二维码 | `wmsStockMaterialTF.generateBar` |
| `allocat/qrcode/batchGenerateBar.vue` | 批量生成二维码 | `wmsStockMaterialTF.batchGenerateBar` |
| `allocat/qrcode/mergeGenerateBar.vue` | 合并生成二维码 | `wmsStockMaterialTF.mergeGenerateBar` |
| `allocat/qrcode/viewQrcodeBars.vue` | 查看二维码 | `wmsStockMaterialTF.getStockMaterialQrcodeInfo` |
| `allocat/printAllocatOrder.vue` | 打印分配单 | `wmsAllocatTF.loadAllocatInfo` |

### 3.6 基础数据（base）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `base/materialInfoManage.vue` | 物料信息管理 | `wmsMaterialPickTF.queryMaterialPage`、`wmsMaterialPickTF.saveMaterial` |
| `base/reservoirInfoManage.vue` | 库区管理 | `wmsReservoirTF.queryReservoirPage`、`wmsReservoirTF.saveReservoir` |
| `base/storageInfoManage.vue` | 货位管理 | `wmsReservoirTF.queryStoragePage`、`wmsReservoirTF.saveStorage` |
| `base/pickTacticsInfoManage.vue` | 拣货策略管理 | `wmsMaterialPickTF.queryPickTacticsPage`、`wmsMaterialPickTF.savePickTactics` |
| `base/warningManage.vue` | 库存预警 | `wmsWarningTF.queryWarningPage` |
| `base/wmsConsignorTenantManage.vue` | 委托方（租户）管理 | `wmsTenantTF.queryConsignorTenantPage` |
| `base/wmsArrivalManufacturerTenantManage.vue` | 到货方管理 | `wmsTenantTF.queryArrivalManufacturerTenantPage` |
| `base/wmsFeeItemManage.vue` | 计费项目 | `wmsFeeItemService.queryFeeItemPage` |
| `base/wmsPackMaterialBaseManage.vue` | 包装材料基础 | `wmsPackMaterialTF.queryPackMaterialBasePage` |
| `base/wmsInteriorMaterialManage.vue` | 内包装材料 | `wmsInteriorMaterialTF.queryInteriorMaterialPage` |
| `base/wmsVehicleManage.vue` | 仓储车辆管理 | `wmsVehicleTF.queryWmsVehicleInfoPage` |
| `base/wmsConsignorTenantCenter.vue` | 委托方中心（统计） | `wmsBaseTF.queryHomeCollectData` |

### 3.7 仓储运单（waybill）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `waybill/wmsWaybillManage.vue` | 仓储运单列表 | `wmsWaybillService.queryWmsWaybillPage`、`wmsWaybillService.sureWmsWaybillInfoById` |
| `waybill/wmsWaybill.vue` | 运单编辑（匹配费用） | `wmsWaybillService.saveOrUpdateWmsWaybill`、`quoteService.matchCost` |
| `waybill/wmsWaybillDetail.vue` | 运单详情 | `wmsWaybillService.loadWmsWaybillInfoByWmsWaybillId` |
| `waybill/wmsWaybillInfo.vue` | 运单信息 | `wmsWaybillService.getWmsWaybillAbleCostList` |
| `waybill/printWaybill.vue` | 运单打印 | `wmsWaybillService.loadWmsWaybillInfoByWmsWaybillId` |

### 3.8 盘点（inventory）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `inventory/inventoryManage.vue` | 盘点管理 | `wmsInventoryTF.qryWmsInventoryPage`、`wmsInventoryTF.delWmsInventory` |
| `inventory/stock/addStockInventory.vue` | 库存盘点单 | `wmsStockInventoryService.saveOrUpdateWmsStockInventory`、`wmsStockInventoryService.inventoryWmsStock` |
| `inventory/stock/stockInventoryManage.vue` | 盘点单列表（审核） | `wmsStockInventoryService.queryWmsStockInventoryPage`、`wmsStockInventoryService.verifyWmsStockInventory` |
| `inventory/inventoryCfgManage.vue` | 盘点配置 | `wmsInventoryTF.qryWmsInventoryCfgPage` |
| `inventory/device/deviceInventoryManage.vue` | 设备盘点 | `stockDeviceService.saveDeviceInventory` |

### 3.9 检验（inspect）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `inspect/inspectNorm/inspectNormManage.vue` | 检验标准管理 | `wmsInspectionStandardService.queryWmsInspectionStandardPage` |
| `inspect/inspectTask/inspectTaskManage.vue` | 检验任务管理 | `wmsInspectionTaskService.queryWmsInspectionTaskPage` |
| `inspect/inspectReg/inspectRegGoods.vue` | 检验异常登记 | `wmsInspectionExceptionRecordService.queryWmsInspectionExceptionRecordPage` |
| `inspect/inspectReg/inspectRegIncome.vue` | 检验收入登记 | `wmsInspectionIncomeRecordService.queryWmsInspectionIncomeRecordPage` |
| `inspect/inspectSummary/inspectSummaryManage.vue` | 检验汇总 | `wmsInspectionSummaryService.queryWmsInspectionSummaryPage` |
| `inspect/inspectSummary/inspectStatisticsManageByMonth.vue` | 月度检验统计 | `wmsInspectionTaskService.queryWmsInspectionTaskStatisticsPage` |
| `inspect/inspectAssign/inspectAssignManage.vue` | 检验指派 | `wmsInspectionAppointService.queryWmsInspectionAppointPage` |

### 3.10 费用与工单

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `fee/feeOpManage.vue` | 费用操作（成本） | `wmsCostService.queryWmsFeeCostOperatePage` |
| `fee/fixPersonCostManage.vue` | 固定人员成本 | `wmsPersonCostService.queryFixWmsPersonCostPage` |
| `fee/personServiceCostManage.vue` | 劳务成本 | `wmsPersonCostService.queryLaborWmsPersonCostPage` |
| `workOrder/wmsWorkOrderManage.vue` | 工单管理 | `workOrderService.queryWorkOrderPage`、`workOrderService.confirmWorkOrderById` |
| `workOrder/wmsWorkOrderSettleSumManage.vue` | 工单结算汇总 | `workOrderService.queryWorkOrderGroupByPage` |

### 3.11 其他

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `quoteSheet/wmsQuoteSheetManage.vue` | 仓储报价单（审核/确认/作废） | `wmsQuoteSheetTF.queryQuoteSheetPage`、`wmsQuoteSheetTF.verifyQuoteSheet` |
| `device/outDeviceRegister.vue` | 设备出库登记 | `deviceRecordService.saveOrUpdateOutDeviceRecord` |
| `device/outDeviceReovery.vue` | 设备回收 | `deviceRecordService.loadDeviceRecordById` |
| `monitor/deviceMonitorManage.vue` | 设备监控 | `resMonitorDeviceTF.queryMonitorPage` |
| `sensor/sensorInfoManage.vue` | 温湿度传感器管理 | `sensorTF.querySensorPage`、`sensorTF.saveSensorInfo` |
| `sensor/sensorDataInfoManage.vue` | 传感器数据 | `sensorTF.querySensorDataPage` |
| `receipts/receiptsManage.vue` | 仓储回单 | `wmsReceiptsService.queryWmsReceiptsPage` |
| `visit/visitManage.vue` | 拜访管理 | `wmsVisitService.queryWmsVisitPage` |
| `deliveryNoticeManage.vue` | 到货通知（邮件抓取） | `wmsDeliveryNoticeTF.processWmsDeliveryNotice` |
| `scancodeLog/orderScanQrcodeManage.vue` | 订单扫码日志 | `wmsStockMaterialTF.queryOrderScanQrcodePage` |
| `sysLogInfoManage.vue` | 仓储系统日志 | `sysLogTF.querySysLogPage` |

## 4. 核心接口速查

| BeanName | 主要方法 | 用途 |
|----------|---------|------|
| `wmsInOrderTF` | queryInOrderPage / addOrUpdateInOrder / inOrderDeal / inOrderModify / feeConfirm / queryWmsInOrderInfoForView | 入库单全流程 |
| `wmsOutOrderTF` | queryOutOrderPage / addOrUpdateOutOrder / outOrderDeal / outOrderAllocat / sureAllocat / feeConfirm / queryStockListForTactics | 出库单全流程 |
| `wmsAllocatTF` | saveAllocat / saveAllocatNew / freeze / unfreeze / loadAllocatInfo | 库存分配 |
| `wmsStockMaterialTF` | generateBar / batchGenerateBar / mergeGenerateBar / queryStockMaterialQrcodePage / qrcodeModify | 物料二维码 |
| `wmsMaterialPickTF` | queryMaterialPage / queryStockPage / queryPickTacticsPage / savePickTactics | 物料与拣货 |
| `wmsReservoirTF` | queryReservoirPage / queryStoragePage / saveReservoir / saveStorage / queryBlankStorageList | 库区货位 |
| `wmsWaybillService` | queryWmsWaybillPage / saveOrUpdateWmsWaybill / sureWmsWaybillInfoById / loadWmsWaybillInfoByWmsWaybillId | 仓储运单 |
| `wmsAppointTF` | queryWmsAppointInfoPage / updateWmsAppointInfoState / wmsAppointInfoCheckInByStaff | 预约 |
| `wmsTenantTF` | queryConsignorTenantPage / queryArrivalManufacturerTenantPage / saveOrUpdateConsignor | 租户（委托方/到货方） |
| `wmsInventoryTF` | qryWmsInventoryPage / qryWmsInventoryCfgPage / delWmsInventory | 盘点 |
| `wmsStockInventoryService` | queryWmsStockInventoryPage / saveOrUpdateWmsStockInventory / inventoryWmsStock / verifyWmsStockInventory | 库存盘点单 |
| `wmsBaseTF` | queryHomeCollectData / queryHomeInStokeData / queryHomeOutStokeData / getAllWorkStore | 仓储中心驾驶舱 |
| `wmsFeeItemService` | queryFeeItemPage / saveOrUpdateFeeItem / verifyFeeItem | 计费项 |

## 5. 业务流程说明

### 5.1 入库流程

```
预约（appointManage） → 新增入库单（addOrUpdateInOrder）
   → 到仓扫码收货（inOrderConfirm：inOrderDeal + 分配货位）
   → 生成物料二维码（generateBar/batchGenerateBar）
   → 库存分配（stockStorageManage：saveAllocatNew/freeze）
   → 入库费用确认（inOrderFeeConfirm：feeConfirm） → 打印入库单
```

### 5.2 出库流程

```
新增出库单（addOrUpdateOutOrder） → 出库确认（outOrderConfirm）
   → 拣货策略分配（queryStockListForTactics + sureAllocat）
   → 生成仓储运单（wmsWaybill） → 出库费用确认（outOrderFeeConfirm）
   → 回单（receiptsManage） → 打印出库单
```

### 5.3 盘点流程

```
配置盘点规则（inventoryCfgManage） → 创建盘点单（addStockInventory）
   → 盘点执行（inventoryWmsStock） → 盘点审核（stockInventoryManage：verifyWmsStockInventory）
```

### 5.4 检验流程

```
维护检验标准（inspectNormManage） → 检验指派（inspectAssignManage）
   → 生成检验任务（inspectTaskManage） → 登记检验结果（异常/收入）
   → 检验汇总（inspectSummaryManage） → 月度/年度统计
```

---

> 相关接口完整清单见 [api-00-接口清单.md](./api-00-接口清单.md) 的 `pt/wms` 分组。
