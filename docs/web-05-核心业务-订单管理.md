# 核心业务 — 订单管理

> **关联文档**：

| 关联文档 | 关联说明 |
|----------|---------|
| [web-00-项目总览.md](./web-00-项目总览.md) | 业务全景 |
| [web-02-公共组件库.md](./web-02-公共组件库.md) | 页面使用的基础组件 |
| [web-04-状态管理与路由.md](./web-04-状态管理与路由.md) | 页面跳转机制 |
| [api-00-接口清单.md](./api-00-接口清单.md) | 接口事实源（`pt/ord` 分组） |

## 1. 业务概述

**订单管理**（`src/page/pt/ord`）是平台核心业务域之一，覆盖物流订单全生命周期：

```
客户下单 → 订单调度（派车/分单） → 生成运单 → 在途运输（节点跟踪）
   → 回单上传/确认 → 费用变更 → 车辆检查 → 运单审核 → 结算
```

同时支持：订单计划（批量建单/认领）、协同区域单（CDT）、车辆匹配、里程管理、运单终止、回单扫描等扩展能力。

- 页面数量：约 **77 个 .vue 页面**
- 核心服务标识（BeanName）：`orderTF`、`ordWaybillTF`、`ordDispatchTF`、`ordPlanTF`、`scheduleService`、`transitManageTF`、`receiptsTF`、`orderService`、`ordCatlOrderTF`、`resVehicleInfoTF`

## 2. 模块划分

| 子模块 | 目录 | 说明 |
|--------|------|------|
| 订单管理 | `order/` | 下单、编辑、复制、订单列表、订单详情、订单收入变更、回单费用管理 |
| 订单调度 | `dispatch/` | 调度派车、调度管理、分单/选单、调度子页面（费用/库存/回单/在途运单/作业） |
| 运单管理 | `waybill/` | 运单列表、运单详情、运单修改、费用变更、里程管理、终止管理、回单扫描 |
| 在途运输 | `transit/` | 在途列表、在途管理（费用调整）、在途跟踪记录 |
| 订单计划 | `plan/` | 计划管理、新增计划、认领订单、计划详情 |
| 回单管理 | `receipts/` | 回单录入、回单列表（确认/取消/删除） |
| 车辆检查 | `vehicleCheck/` | 车辆检查管理、检查详情、自有车检查 |
| 区域协同单 | `cdt/` | 区域订单协同、协同仓储、协同发起 |
| 调度计划 | `scheduleManage.vue` 等 | 调度计划管理、计划匹配、待办 |
| 车辆匹配 | `catlVehicle/`、`ownVehicleScheduleManage.vue` | 车联网车辆信息、自有车调度计划 |
| 时限配置 | `ordTimeLimitManage.vue` | 订单时限管理 |

## 3. 核心页面清单

### 3.1 订单（order）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `order/orderManage.vue` | 订单列表：查询、下单、编辑、复制、取消、审核、费用变更、回单录入、车辆查询 | `orderTF.queryOrderInfoList`、`orderTF.cancelOrder`、`orderTF.verifyOrder` |
| `order/addOrder.vue` | 新增订单 | `orderTF.saveOrUpdateOrder`、`ordCatlOrderTF.getOrdCatlOrderInfo` |
| `order/updateOrder.vue` | 编辑订单 | `orderTF.queryOrderInfo`、`orderTF.saveOrUpdateOrder` |
| `order/copyOrder.vue` | 复制订单 | `orderTF.queryOrderInfo`、`orderTF.saveOrUpdateOrder` |
| `order/orderDetail/orderDetail.vue` | 订单详情（主页面） | `orderTF.queryOrderInfo` |
| `order/orderDetail/orderInfo.vue` | 订单信息（含接单/拒单） | `orderService.rceiveOrder`、`orderService.refuseOrder` |
| `order/orderDetail/operateLog.vue` | 订单操作日志 | `orderTF.loadOrderOpLogData` |
| `order/orderDetail/modifyRecord.vue` | 订单修改记录 | `modifyRecordTF.loadOrderModifyRecordData` |
| `order/orderPrint.vue` | 订单打印 | `orderTF.queryOrderInfo` |
| `order/incomeChange.vue` | 收入变更（收款方） | `orderTF.saveOrdOrderFeeIncomeStatement` |
| `order/incomeChangeCustomer.vue` | 收入变更（客户） | `orderTF.loadOrderIncomeChangeData` |
| `order/incomeFeeStatementManage.vue` | 收入费用单管理（审核/作废） | `incomeTF.verifyPass`、`incomeTF.verifyNoPass` |
| `order/ordStockManage.vue` | 订单库存查看 | `orderTF.queryOrdStockData` |
| `order/ordWaybillVehicleManage.vue` | 订单运单车辆匹配 | `ordWaybillTF.queryOrdWaybillVehiclePage` |
| `order/orderReturnManage.vue` | 订单退单管理 | `orderService.queryOrderInfoListForReceive` |
| `order/orderReturnFeeManage.vue` | 退单费用管理 | `orderService.cancelReceiveFeeByOrderIds` |
| `order/todo/receiveOrRefuseOrderManage.vue` | 接单/拒单待办 | `orderTF.queryOrderInfoList`、`orderTF.receiveOrder` |

### 3.2 调度（dispatch）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `dispatch/dispatch.vue` | 订单调度：选库存、分派运单 | `ordDispatchTF.addOrdDispatchInfo` |
| `dispatch/dispatchManage.vue` | 调度管理列表 | `ordDispatchTF.queryOrdDispatchPage` |
| `dispatch/selStock.vue` | 选择库存 | `ordDispatchTF.queryOrdStockPage` |
| `dispatch/subpage/waybillInfo.vue` | 运单信息子页（选供应商/车辆/司机） | `resVehicleInfoTF.selVehicleInfoListByCond`、`driverTF.selDriverInfoListByCond` |
| `dispatch/subpage/orderStock.vue` | 订单库存详情 | `ordDispatchTF.queryOrdStockGoodsDetailList` |
| `dispatch/subpage/transitWaybillInfo.vue` | 在途运单信息 | `quoteLDNewTF.querySupplierLDBestQuote` |
| `dispatch/subpage/sectionFee.vue` | 分段费用 | `commonTF.getSysStaticDataByCodeTypes` |

### 3.3 运单（waybill）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `waybill/waybillManage.vue` | 运单列表：审核、取消、换供应商、同步、短信提醒、回单 | `ordWaybillTF.queryOrdWaybillPage`、`ordWaybillTF.verifyWaybill`、`ordWaybillTF.smsReminderDriverDeliver` |
| `waybill/detail/waybillDetail.vue` | 运单详情 | `ordWaybillTF.queryWaybillInfo` |
| `waybill/update/updateWaybill.vue` | 修改运单 | `ordWaybillTF.queryWaybillInfo`、`ordWaybillTF.updateWaybill` |
| `waybill/feeChange/feeChange.vue` | 运单费用变更 | `ordWaybillTF.feeChange` |
| `waybill/feeChangeManage.vue` | 费用变更申请管理（审核） | `ordWaybillTF.verifyOrdWaybillFeeCostApply` |
| `waybill/waybillMileageManage.vue` | 运单里程管理 | `ordWaybillTF.confirmMileage`、`ordWaybillTF.saveMileage` |
| `waybill/waybillTerminateManage.vue` | 运单终止管理 | `ordWaybillTF.verifyOrdWaybillTerminate` |
| `waybill/receiptScan.vue` | 回单扫描签收 | `ordWaybillTF.receiveReceiptByIds` |
| `waybill/subpage/workNode.vue` | 作业节点操作 | `ordWaybillTF.opWorkNode` |
| `waybill/detail/subpage/waybillLog.vue` | 运单日志 | - |

### 3.4 在途（transit）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `transit/transitManage.vue` | 在途管理：费用调整、附加账单、节点日志 | `transitManageTF.queryOrdTransitDetail`、`transitManageTF.ordTransitChg`、`ordWaybillTransitLogTF.saveTransitLog` |
| `transit/transitList.vue` | 在途列表 | `transitManageTF.queryOrdTransitPage`、`ordWaybillTF.verifyWaybill` |
| `transit/transitTrackRecord.vue` | 在途跟踪记录 | `ordWaybillTransitLogTF.queryOrdWaybillTransitLogPage` |
| `transit/transitDetailMain.vue` | 在途详情主框架 | - |

### 3.5 其他

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `plan/ordPlanManage.vue` | 订单计划管理（同步/取消/删除） | `ordPlanTF.syncOrder`、`ordPlanTF.cancelPlanInfo` |
| `plan/addPlan.vue` | 新增计划（匹配报价/路线/车辆） | `ordPlanTF.saveOrdPlanInfo`、`routeTF.loadRouteById` |
| `plan/claimOrder.vue` | 认领计划订单 | `orderTF.saveOrUpdateOrder` |
| `receipts/receiptsManage.vue` | 回单管理（确认/取消/删除） | `receiptsTF.sureReceipts`、`receiptsTF.addReceipts` |
| `receipts/addReceipt.vue` | 新增回单 | `receiptsTF.insertReceipts` |
| `vehicleCheck/vehicleCheckManage.vue` | 车辆检查管理 | `ordWaybillTF.queryOrdWaybillVehicleCheckPage` |
| `vehicleCheck/vehicleCheckDetail.vue` | 车辆检查详情 | `ordWaybillTF.confirmOrdWaybillVehicleCheck` |
| `catlVehicle/catlVehicleManage.vue` | 车联网车辆信息管理 | `catlVehicleService.queryCatlVehiclePage` |
| `ownVehicleScheduleManage.vue` | 自有车辆调度计划 | `resOwnVehicleScheduleTF.queryOwnVehicleSchedulePage` |
| `scheduleManage.vue` | 调度计划管理 | `scheduleService.querySchedulePage`、`scheduleService.syncMatch` |
| `scheduleTodoManage.vue` | 调度待办 | `scheduleService.queryUnMatchListGroupByRouteId` |
| `ordTimeLimitManage.vue` | 订单时限配置 | `orderService.queryOrderTimeLimitPage` |

## 4. 核心接口速查

| BeanName | 主要方法 | 用途 |
|----------|---------|------|
| `orderTF` | queryOrderInfoList / queryOrderInfo / saveOrUpdateOrder / cancelOrder / verifyOrder / receiveOrder / refuseOrder | 订单 CRUD 与状态流转 |
| `ordWaybillTF` | queryOrdWaybillPage / queryWaybillInfo / updateWaybill / verifyWaybill / cancelWaybills / feeChange / changeSupplier / smsReminderDriverDeliver / receiveReceiptByIds | 运单全生命周期 |
| `ordDispatchTF` | queryOrdDispatchPage / addOrdDispatchInfo / queryOrdStockPage / queryOrdStockGoodsDetailList | 调度与库存分配 |
| `ordPlanTF` | queryOrdPlanData / saveOrdPlanInfo / loadPlanInfoByPlanId / syncOrder / cancelPlanInfo | 订单计划 |
| `scheduleService` | querySchedulePage / saveOrUpdateSchedule / syncMatch / queryScheduleData | 调度计划 |
| `transitManageTF` | queryOrdTransitPage / queryOrdTransitDetail / ordTransitChg / loadWaybillStatementList | 在途管理 |
| `receiptsTF` | queryReceiptsInfoData / addReceipts / sureReceipts / cancelSureReceipts / deleteReceipts | 回单管理 |
| `incomeTF` | loadIncomeFeeStatementPage / verifyPass / verifyNoPass / cancelStatement | 收入费用单 |
| `resVehicleInfoTF` | selVehicleInfoListByCond / queryVehicleInfoList / confirmVehicleCheck | 车辆资源查询 |
| `driverTF` | selDriverInfoListByCond | 司机查询 |

## 5. 业务流程说明

### 5.1 订单主流程

1. **建单**：`addOrder.vue` 录入订单（客户、起止地、货物、时效、费用），保存到 `orderTF.saveOrUpdateOrder`
2. **审核**：订单列表 `verifyOrder` 审核
3. **接单/拒单**：`receiveOrRefuseOrderManage.vue` 待办处理（`receiveOrder`/`refuseOrder`）
4. **调度**：`dispatch.vue` 选择库存、分配车辆/司机/供应商，生成运单
5. **运单执行**：运单列表管理，作业节点操作（`opWorkNode`），在途跟踪记录
6. **回单**：`receiptsManage.vue` / `receiptScan.vue` 上传并确认回单
7. **费用结算**：费用变更（`feeChange`）、收入费用单审核（`incomeFeeStatementManage`）

### 5.2 订单计划流程

`ordPlanManage.vue` 创建运力计划 → `addPlan.vue` 按路线匹配车辆/司机/报价 → 计划认领（`claimOrder.vue`）转为正式订单 → `syncOrder` 同步。

### 5.3 协同区域单（CDT）

`cdtRegionOrderMain.vue` / `coInitiated.vue` / `collaborativeWarehousing.vue`：区域间订单协同与协同仓储，通过 `orderCdtRegionServiceImpl.*` 接口交互。

---

> 相关接口完整清单见 [api-00-接口清单.md](./api-00-接口清单.md) 的 `pt/ord` 分组。
