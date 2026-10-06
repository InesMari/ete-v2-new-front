# 核心业务 — 采购管理

> **关联文档**：

| 关联文档 | 关联说明 |
|----------|---------|
| [web-00-项目总览.md](./web-00-项目总览.md) | 业务全景 |
| [web-07-核心业务-财务管理.md](./web-07-核心业务-财务管理.md) | 付款结算 |
| [web-09-核心业务-客户管理.md](./web-09-核心业务-客户管理.md) | 供应商合同 |
| [api-00-接口清单.md](./api-00-接口清单.md) | 接口事实源（`pt/purchase` 分组） |

## 1. 业务概述

**采购管理**（`src/page/pt/purchase`）是平台核心业务域之一（约 **39 个 .vue 页面**），覆盖非运输类采购（设备、耗材、固定资产、服务费用）全流程：

```
采购申请 → 采购订单（审核） → 到货入库 → 库存管理 → 分配/领用
   → 费用申请（审核/核销） → 付款计划 → 成本汇总
固定资产：资产信息（折旧）→ 资产费用 → 领用/归还/报废
```

- 核心服务标识（BeanName）：`purPurchaseService`、`purPurchaseOrderDeliveryService`、`purStockService`、`purFeeApplyTF`、`purFeeBaseService`、`purPayPlanTF`、`assetTF`、`deviceContractService`、`purBranchCfgService`

## 2. 模块划分

| 子模块 | 目录 | 说明 |
|--------|------|------|
| 采购订单 | `purOrder/` | 采购申请、采购订单、订单明细、到货入库 |
| 费用申请 | `feeApply/` | 费用申请（申请/审核/核销）、流程设置 |
| 费用信息 | `feeInfo/` | 费用类别基础数据 |
| 采购出入库 | `inOrder/`、`outOrder/` | 采购入库单、采购出库单 |
| 采购库存 | `inventory/` | 采购库存查询 |
| 分配 | `allot/` | 采购库存分配、归还 |
| 领用 | `consuming/` | 耗材领用管理 |
| 固定资产 | `asset/` | 资产信息、折旧、资产费用、领用归还、操作日志 |
| 付款计划 | `paymentPlan/` | 付款计划、按费用类型/作业组织汇总 |
| 成本汇总 | `costSum/` | 成本汇总 |

## 3. 核心页面清单

### 3.1 采购订单（purOrder）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `purOrder/purchaseOrderManage.vue` | 采购订单列表（审核/取消审核/删除/附件） | `purPurchaseService.queryPurPurchasePage`、`purPurchaseService.verifyPurPurchase`、`purPurchaseService.cancelVerifyPurPurchase`、`purPurchaseService.savePurPurchaseFile` |
| `purOrder/addPurOrder.vue` | 新增/编辑采购订单（费用类型/合同/设备） | `purPurchaseService.loadPurPurchaseById`、`purPurchaseService.saveOrUpdatePurPurchase`、`purPurchaseService.verifyPurPurchase`、`deviceContractService.queryContractTenant` |
| `purOrder/purchaseOrderDtlManage.vue` | 采购订单明细 | `purPurchaseService.queryPurPurchaseDtlPage` |
| `purOrder/purchaseOrderInWarehouse.vue` | 采购到货入库 | `purPurchaseOrderDeliveryService.savePurPurchaseOrderDelivery`、`assetTF.getAssetSubClassData` |
| `purOrder/printPurOrder.vue` | 采购订单打印 | `purPurchaseService.loadPurPurchaseById` |

### 3.2 费用申请（feeApply）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `feeApply/feeApplyManage.vue` | 费用申请列表 | `purFeeApplyTF.queryPurFeeApplyInfoPage`、`purFeeApplyTF.delPurFeeApplyInfo` |
| `feeApply/addFeeApply.vue` | 新增费用申请 | `purFeeApplyTF.savePurFeeApplyInfo`、`purFeeBaseService.queryPurFeeList`、`userTF.loadCurrentOrgUserList` |
| `feeApply/examFeeApply.vue` | 费用申请审核 | `purFeeApplyTF.verifyInfo` |
| `feeApply/writeOffFeeApply.vue` | 费用核销 | `purFeeApplyTF.writeOffFeeApply` |
| `feeApply/processSet.vue` | 流程设置（分支配置） | `purBranchCfgService.loadPurchaseBranchCfgByBranchTypeOrderDefault`、`purBranchCfgService.saveOrUpdateBranchCfg` |

### 3.3 费用信息（feeInfo）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `feeInfo/feeInfoManage.vue` | 费用类别管理 | `purFeeBaseService.queryPurFeePage`、`purFeeBaseService.deletePurFeeById` |
| `feeInfo/purFeeInfo.vue` | 费用类别详情（银行/合同/设备关联） | `purFeeBaseService.loadPurFeeById`、`purFeeBaseService.saveOrUpdatePurFee` |

### 3.4 出入库与库存

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `inOrder/purchaseInOrderManage.vue` | 采购入库单管理（确认） | `purPurchaseOrderDeliveryService.queryPurInStockPage`、`purPurchaseOrderDeliveryService.savePurPurchaseOrderDeliveryConfirm` |
| `inOrder/inOrderDetail.vue` | 入库单详情 | `purPurchaseOrderDeliveryService.loadPurPurchaseOrderDeliveryById` |
| `outOrder/purchaseOutOrderManage.vue` | 采购出库单管理 | `purPurchaseOrderDeliveryService.queryPurOutStockPage` |
| `outOrder/outOrderDetail.vue` | 出库单详情 | `purStockService.loadPurPurchaseOutById` |
| `inventory/inventoryManage.vue` | 采购库存管理（分配） | `purStockService.queryPurStockPage`、`purStockService.savePurAllocate` |
| `inventory/inventoryDetail.vue` | 库存详情 | `purStockService.loadPurStockById` |

### 3.5 分配与领用

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `allot/allotManage.vue` | 采购分配管理（审核/归还） | `purStockService.queryPurAllocatePage`、`purStockService.saveAllotReturn`、`purStockService.verifyPurAllocat`、`purStockService.updatePurAllocate` |
| `consuming/consumingManage.vue` | 耗材领用管理 | `purStockService.queryPurConsumingPage`、`purStockService.saveConsumingBack`、`purStockService.verifyConsuming` |

### 3.6 固定资产（asset）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `asset/assetInfoManage.vue` | 资产信息管理（领用/归还/删除） | `assetTF.queryAssetInfoPage`、`assetTF.returnBorrowAsset`、`purStockService.savePurAllocate` |
| `asset/saveAssetInfo.vue` | 资产信息维护（折旧/审核/停用） | `assetTF.saveAssetInfo`、`assetTF.getAssetDepreciation`、`assetTF.autoGenerateAssetFeeDetails`、`assetTF.verifyAssetInfo` |
| `asset/assetDepreciationManage.vue` | 资产折旧管理 | `assetTF.queryAssetDepreciationDetailPage` |
| `asset/assetDepreciationDetail.vue` | 折旧明细 | `assetTF.getAssetDepreciationDetailInfo` |
| `asset/assetFeeManage.vue` | 资产费用管理 | `assetTF.queryAssetFeeDetailPage` |
| `asset/assetFeeSumManage.vue` | 资产费用汇总 | `assetTF.queryAssetFeeSumPage` |
| `asset/assetConsumingDetail.vue` | 资产领用明细 | `purStockService.queryPurConsumingListByAssetId` |
| `asset/assetInfoOpLog.vue` | 资产操作日志 | `assetTF.loadOpLog` |

### 3.7 付款计划与成本汇总

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `paymentPlan/paymentPlanManage.vue` | 付款计划管理 | `purPayPlanTF.queryPurPayPlanInfoPage` |
| `paymentPlan/paymentPlanDetail.vue` | 付款计划详情 | `purPayPlanTF.getPurPayPlanInfo` |
| `paymentPlan/paymentPlanSummaryFee.vue` | 付款计划汇总（按费用类型） | `purPayPlanTF.queryPurPayPlanInfoGroupFeeTypePage` |
| `paymentPlan/paymentPlanSummaryWork.vue` | 付款计划汇总（按作业组织） | `purPayPlanTF.queryPurPayPlanInfoGroupOrgPage` |
| `costSum/costSumManage.vue` | 成本汇总 | `purPayPlanTF.queryPurPayPlanInfoCostSumPage` |
| `costSum/costSumDetailManage.vue` | 成本汇总明细 | `purPayPlanTF.queryPurPayPlanInfoCostSumDetailPage` |

## 4. 核心接口速查

| BeanName | 主要方法 | 用途 |
|----------|---------|------|
| `purPurchaseService` | queryPurPurchasePage / saveOrUpdatePurPurchase / loadPurPurchaseById / verifyPurPurchase / cancelVerifyPurPurchase / deletePurPurchaseById / savePurPurchaseFile / queryPurPurchaseDtlPage / queryPurPurchaseList | 采购订单 |
| `purPurchaseOrderDeliveryService` | queryPurInStockPage / queryPurOutStockPage / savePurPurchaseOrderDelivery / savePurPurchaseOrderDeliveryConfirm / loadPurPurchaseOrderDeliveryById | 采购出入库 |
| `purStockService` | queryPurStockPage / loadPurStockById / savePurAllocate / queryPurAllocatePage / verifyPurAllocat / saveAllotReturn / queryPurConsumingPage / saveConsumingBack / verifyConsuming / deleteConsuming | 采购库存/分配/领用 |
| `purFeeApplyTF` | queryPurFeeApplyInfoPage / savePurFeeApplyInfo / getPurFeeApplyInfo / verifyInfo / writeOffFeeApply / delPurFeeApplyInfo / loadPurFeeApplyData / loadPurFeeApplyDtlData | 费用申请 |
| `purFeeBaseService` | queryPurFeePage / loadPurFeeById / saveOrUpdatePurFee / queryPurFeeList / getSysStaticDataForSpecify | 费用基础 |
| `purPayPlanTF` | queryPurPayPlanInfoPage / getPurPayPlanInfo / queryPurPayPlanInfoGroupFeeTypePage / queryPurPayPlanInfoGroupOrgPage / queryPurPayPlanInfoCostSumPage / queryPurPayPlanInfoCostSumDetailPage | 付款计划/成本汇总 |
| `assetTF` | queryAssetInfoPage / saveAssetInfo / getAssetInfo / getAssetDepreciation / autoGenerateAssetFeeDetails / verifyAssetInfo / discontinueAssetInfo / returnBorrowAsset / queryAssetDepreciationDetailPage / queryAssetFeeDetailPage / queryAssetFeeSumPage / loadOpLog | 固定资产 |
| `purBranchCfgService` | loadPurchaseBranchCfgByBranchTypeOrderDefault / saveOrUpdateBranchCfg | 流程配置 |
| `deviceContractService` | queryContractTenant / queryContractDeviceDtlList / queryDeviceContractList | 设备合同 |

## 5. 业务流程说明

### 5.1 采购主流程

```
费用类别维护（feeInfoManage）→ 新增采购订单（addPurOrder：选费用类别/合同）
   → 采购订单审核（purchaseOrderManage：verifyPurPurchase）
   → 到货入库（purchaseOrderInWarehouse：savePurPurchaseOrderDelivery）
   → 入库确认（purchaseInOrderManage：savePurPurchaseOrderDeliveryConfirm）
   → 库存分配（allotManage：savePurAllocate）→ 领用/归还（consumingManage）
```

### 5.2 费用申请流程

```
新增费用申请（addFeeApply：savePurFeeApplyInfo）
   → 费用审核（examFeeApply：verifyInfo）
   → 费用核销（writeOffFeeApply：writeOffFeeApply）
   → 付款计划（paymentPlanManage）→ 汇总分析（按费用类型/作业组织）
```

### 5.3 固定资产流程

```
资产信息录入（saveAssetInfo：自动生成折旧/费用）→ 资产审核（verifyAssetInfo）
   → 资产费用汇总（assetFeeSumManage）→ 折旧明细（assetDepreciationManage）
   → 领用（assetInfoManage：savePurAllocate）→ 归还（returnBorrowAsset）→ 停用/删除
```

---

> 相关接口完整清单见 [api-00-接口清单.md](./api-00-接口清单.md) 的 `pt/purchase` 分组。
