# 核心业务 — 设备管理

> **关联文档**：

| 关联文档 | 关联说明 |
|----------|---------|
| [web-00-项目总览.md](./web-00-项目总览.md) | 业务全景 |
| [web-06-核心业务-仓储管理.md](./web-06-核心业务-仓储管理.md) | 设备出入库（wms） |
| [web-08-核心业务-资源管理.md](./web-08-核心业务-资源管理.md) | 电子锁/RFID 设备 |
| [api-00-接口清单.md](./api-00-接口清单.md) | 接口事实源（`pt/device` 分组） |

## 1. 业务概述

**设备管理**（`src/page/pt/device`）是平台核心业务域之一（约 **24 个 .vue 页面**），管理仓储类设备（托盘、周转器具、包装设备等）与电子设备的全生命周期：

```
设备采购（合同/订单） → 采购入库 → 库存汇总（分布地图监控）
   → 业务使用（出库登记/回收/清理） → 设备调拨
   → 费用（设备成本/收入） → 维护管理 → 记录/日志
```

- 核心服务标识（BeanName）：`devPurchaseOrderService`、`deviceContractService`、`stockDeviceService`、`deviceRecordService`、`devAllocatDeviceService`、`devCostService`、`devIncomeService`、`deviceBaseService`、`palletRecordService`、`deviceMaintainService`、`purFeeApplyTF`、`purchaseApplyServiceImpl`

## 2. 模块划分

| 子模块 | 目录 | 说明 |
|--------|------|------|
| 设备采购 | `devicePurchaseManage/` | 设备采购订单（审核/上传PO/打印） |
| 设备合同 | `contract/` | 设备采购合同管理 |
| 设备库存 | `deviceSummaryManage/` | 库存汇总、分布监控地图、库存明细（历史） |
| 设备业务 | `deviceBusinessManage/` | 设备出库/回收业务 |
| 设备调拨 | `deviceAllocateManage/` | 设备调拨（审核/归还/打印） |
| 设备费用 | `deviceFeeMain/` | 设备成本、设备收入 |
| 出库记录 | `record/` | 出库登记、回收、清理确认、费用明细/汇总 |
| 托盘记录 | `palletRecord/` | 托盘流转记录 |
| 维护管理 | `maintenance/` | 设备信息维护 |
| 操作日志 | `deviceOpLog/` | 设备操作记录 |

## 3. 核心页面清单

### 3.1 设备采购与合同

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `devicePurchaseManage/devicePurchaseManage.vue` | 设备采购订单（自确认/删除/上传PO） | `devPurchaseOrderService.queryDevPurchaseOrderPage`、`devPurchaseOrderService.selfConfirmPurchaseOrderInfo`、`devPurchaseOrderService.uploadPoOrderFile`、`devPurchaseOrderService.getPurchaseOrderDtl`、`devPurchaseOrderService.delDevPurchaseOrderInfo` |
| `devicePurchaseManage/addDevicePurchase.vue` | 新增设备采购（合同/费用申请/采购申请） | `devPurchaseOrderService.getDevPurchaseOrderInfo`、`deviceContractService.queryContractDeviceList`、`purFeeApplyTF.getFeeApply`、`purchaseApplyServiceImpl.getPurchaseApply` |
| `devicePurchaseManage/printDevicePurOrder.vue` | 打印设备采购订单 | `devPurchaseOrderService.getDevPurchaseOrderInfo` |
| `contract/deviceContractManage.vue` | 设备合同管理（删除） | `deviceContractService.queryDeviceContractPage`、`deviceContractService.saveOrUpdateDevContract`、`deviceContractService.queryDevContractDeviceDtlListByContractId`、`deviceContractService.deleteDevContract`、`deviceBaseService.queryDeviceInfoList` |

### 3.2 设备库存与监控

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `deviceSummaryManage/deviceSummaryManage.vue` | 设备库存汇总 | `stockDeviceService.queryDeviceStockSummaryPage` |
| `deviceSummaryManage/deviceMonitor.vue` | 设备分布监控（地图） | `stockDeviceService.queryDeviceStockSummaryDetailPageForMap` |
| `deviceSummaryManage/deviceStoreDetailManage.vue` | 设备库存明细 | `stockDeviceService.queryDeviceStockSummaryDetailPage` |
| `deviceSummaryManage/deviceStoreDetailHisManage.vue` | 设备库存明细（历史） | `stockDeviceService.queryDeviceStockSummaryDetailHisPage` |

### 3.3 设备业务与调拨

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `deviceBusinessManage/deviceBusinessManage.vue` | 设备业务（出库登记/回收/库存） | `stockDeviceService.queryDeviceStockPage`、`stockDeviceService.saveDeviceReovery`、`devPurchaseOrderService.queryPurchaseOrderData`、`deviceContractService.queryContractTenant` |
| `deviceAllocateManage/deviceAllocateManage.vue` | 设备调拨（审核/归还/删除） | `devAllocatDeviceService.queryAllocatDevicePage`、`devAllocatDeviceService.verifyAllocatDevice`、`devAllocatDeviceService.returnAllocatDevice`、`devAllocatDeviceService.delAllocatDevice`、`devAllocatDeviceService.queryAllPurchaseOrderDevices` |
| `deviceAllocateManage/deviceAllocatePrint.vue` | 设备调拨打印 | - |

### 3.4 设备费用

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `deviceFeeMain/deviceFeeMain.vue` | 设备费用主框架 | - |
| `deviceFeeMain/deviceCostManage.vue` | 设备成本管理 | `devCostService.queryDeviceCostPage` |
| `deviceFeeMain/deviceIncomeManage.vue` | 设备收入管理 | `devIncomeService.queryDeviceIncomePage` |

### 3.5 出库记录

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `record/outDeviceRegisterRecordManage.vue` | 设备出库登记记录 | `deviceRecordService.queryDeviceRecordPage` |
| `record/outDeviceReoveryRecordManage.vue` | 设备回收记录（确认） | `deviceRecordService.queryDeviceRecordPage`、`deviceRecordService.saveOutDeviceRecordConfirmById` |
| `record/outDeviceClearUpRecordManage.vue` | 设备清理记录（确认） | `deviceRecordService.queryDeviceRecordPage`、`deviceRecordService.saveOutDeviceRecordConfirmById` |
| `record/outDeviceFeeDtlManage.vue` | 出库费用明细 | `deviceRecordService.queryDeviceRecordFeeDtlPage` |
| `record/outDeviceFeeSumManage.vue` | 出库费用汇总 | `deviceRecordService.queryDeviceRecordFeeSumPage` |
| `record/deviceRegisterRecordManage.vue` | 设备登记记录 | `deviceRecordService.queryDeviceRecordPage`、`wmsPackMaterialTF.deletePackMaterialRecord` |

### 3.6 托盘记录与维护

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `palletRecord/palletRecordManage.vue` | 托盘流转记录管理（删除） | `palletRecordService.queryPalletRecordPage`、`palletRecordService.deletePalletRecordById` |
| `palletRecord/palletRecordInfo.vue` | 托盘记录维护 | `palletRecordService.loadPalletRecordInfoById`、`palletRecordService.getPalletRecordList`、`palletRecordService.savePalletRecord` |
| `maintenance/maintenanceManage.vue` | 设备信息维护（删除） | `deviceBaseService.queryDeviceInfoPage`、`deviceBaseService.delDeviceInfo` |
| `deviceOpLog/deviceOpLog.vue` | 设备操作日志 | `deviceRecordService.queryDeviceRecordPage` |

## 4. 核心接口速查

| BeanName | 主要方法 | 用途 |
|----------|---------|------|
| `devPurchaseOrderService` | queryDevPurchaseOrderPage / getDevPurchaseOrderInfo / selfConfirmPurchaseOrderInfo / uploadPoOrderFile / delDevPurchaseOrderInfo / queryDevPurchaseOrderDeliveryDtl / queryDeliveryWorkId / queryPurchaseOrderData / querySupplierTenants / getPurchaseOrderDtl | 设备采购订单 |
| `deviceContractService` | queryDeviceContractPage / saveOrUpdateDevContract / queryDevContractDeviceDtlListByContractId / deleteDevContract / queryContractTenant / queryContractDeviceList / queryContractDeviceDtlList | 设备合同 |
| `stockDeviceService` | queryDeviceStockSummaryPage / queryDeviceStockSummaryDetailPage / queryDeviceStockSummaryDetailHisPage / queryDeviceStockSummaryDetailPageForMap / queryDeviceStockPage / saveDeviceReovery / saveDeviceInventory | 设备库存 |
| `deviceRecordService` | queryDeviceRecordPage / saveOutDeviceRecordConfirmById / queryDeviceRecordFeeDtlPage / queryDeviceRecordFeeSumPage / loadDeviceRecordById / saveOrUpdateOutDeviceRecord | 设备记录与费用 |
| `devAllocatDeviceService` | queryAllocatDevicePage / verifyAllocatDevice / returnAllocatDevice / delAllocatDevice / queryAllPurchaseOrderDevices | 设备调拨 |
| `devCostService` / `devIncomeService` | queryDeviceCostPage / queryDeviceIncomePage | 设备成本/收入 |
| `deviceBaseService` | queryDeviceInfoPage / queryDeviceInfoList / delDeviceInfo / queryMaintainContractList | 设备信息 |
| `palletRecordService` | queryPalletRecordPage / loadPalletRecordInfoById / savePalletRecord / deletePalletRecordById / getPalletRecordList | 托盘记录 |

## 5. 业务流程说明

### 5.1 设备采购与使用流程

```
设备合同（deviceContractManage）→ 设备采购订单（addDevicePurchase）
   → 采购审核/自确认（devicePurchaseManage）→ 打印（printDevicePurOrder）
   → 采购入库 → 库存汇总（deviceSummaryManage）
   → 业务出库（deviceBusinessManage）→ 回收/清理确认（outDeviceReoveryRecordManage）
   → 费用归集（设备成本/收入）→ 调拨（deviceAllocateManage）
```

### 5.2 托盘流转

```
登记托盘记录（palletRecordInfo：savePalletRecord）→ 流转记录管理（palletRecordManage）
```

---

> 相关接口完整清单见 [api-00-接口清单.md](./api-00-接口清单.md) 的 `pt/device` 分组。
