# 核心业务 — 包裹管理

> **关联文档**：

| 关联文档 | 关联说明 |
|----------|---------|
| [web-00-项目总览.md](./web-00-项目总览.md) | 业务全景 |
| [web-06-核心业务-仓储管理.md](./web-06-核心业务-仓储管理.md) | 包装材料基础（wms） |
| [web-14-核心业务-设备管理.md](./web-14-核心业务-设备管理.md) | 包材设备 |
| [api-00-接口清单.md](./api-00-接口清单.md) | 接口事实源（`pt/pkg` 分组） |

## 1. 业务概述

**包裹管理**（`src/page/pt/pkg`）是平台的包装材料（包裹/器具）业务域（约 **14 个 .vue 页面**），管理包装材料的商务与流转：

```
包材合同 → 包材采购（收货/费用计算） → 包材业务（使用/监控/库存明细）
   → 包材费用（成本分摊/收入） → 包材汇总（PDA/人工操作日志）
```

- 核心服务标识（BeanName）：`pkgContractTF`、`purchaseTF`、`pkgBusinessTF`、`pkgFeeTF`、`pkgPackInfoTF`、`pkgLogTF`、`workGoodsTF`、`customerTF`、`supplierTF`

## 2. 模块划分

| 子模块 | 目录 | 说明 |
|--------|------|------|
| 包材业务 | `business/` | 包材业务（使用/库存）、监控、对象、操作日志（人工/PDA） |
| 包材合同 | `contract/` | 包材合同管理 |
| 包材费用 | `fc/` | 包材成本、包材收入 |
| 包材汇总 | `summary/` | 包材汇总（包材信息） |
| 包材采购 | `packPurchaseManage.vue` | 包材采购（收货/费用计算/删除） |

## 3. 核心页面清单

### 3.1 包材采购

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `packPurchaseManage.vue` | 包材采购管理（保存/收货/费用计算/删除） | `purchaseTF.queryPurchasePage`、`purchaseTF.saveOrUpdatePurchase`、`purchaseTF.sureReceivedByTableData`、`purchaseTF.beginCalculateFee`、`purchaseTF.deletePurchase`、`purchaseTF.loadPackNameData`、`purchaseTF.loadPurchaseDeliverWorkData` |

### 3.2 包材业务（business）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `business/packBusinessManage.vue` | 包材业务（使用/出库） | `pkgBusinessTF.queryPkgBusinessPage`、`pkgBusinessTF.queryAllPkgNameNoPage`、`pkgBusinessTF.queryPkgCustomerList`、`workGoodsTF.queryWorkDataSelect` |
| `business/packMonitor.vue` | 包材监控 | `pkgBusinessTF.queryCustWorkPackPage` |
| `business/packObjectManage.vue` | 包材对象管理 | `pkgBusinessTF.queryPkgObjectPage` |
| `business/packStoreDetailManage.vue` | 包材库存明细 | `pkgBusinessTF.queryPackStoreDetailPage` |
| `business/opLog/PackOpLogMain.vue` | 操作日志主框架 | - |
| `business/opLog/artificialOp.vue` | 人工操作日志 | `pkgBusinessTF.queryOpLogPage` |
| `business/opLog/PDAOpLogBase.vue` | PDA 操作日志（基础） | `pkgLogTF.queryPkgLogBase` |
| `business/opLog/PDAOpLogDetail.vue` | PDA 操作日志（明细） | `pkgLogTF.queryPkgLogRel`、`pkgBusinessTF.queryAllPkgNameNoPage` |

### 3.3 包材合同与费用

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `contract/packContractManage.vue` | 包材合同管理（删除） | `pkgContractTF.queryPkgContractPage`、`pkgContractTF.queryPkgContractDtlPage`、`pkgContractTF.getPackCust`、`pkgContractTF.getPackInfo`、`pkgContractTF.delContract` |
| `fc/packFeeMain.vue` | 包材费用主框架 | - |
| `fc/packCostManage.vue` | 包材成本（分摊） | `pkgFeeTF.queryPackCostPage`、`pkgFeeTF.queryCostShareInfo` |
| `fc/packIncomeManage.vue` | 包材收入 | `pkgFeeTF.queryPackIncomePage`、`pkgFeeTF.addPackIncome`、`pkgFeeTF.getPackContractCust` |

### 3.4 包材汇总

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `summary/pkgSummaryManage.vue` | 包材汇总（删除） | `pkgPackInfoTF.queryPkgPackInfoPage`、`pkgPackInfoTF.delPkgPackInfo`、`pkgPackInfoTF.getPkgOutWorkNodeList`、`pkgContractTF.getPackContractCust`、`pkgContractTF.getContractPackInfoByCustId` |

## 4. 核心接口速查

| BeanName | 主要方法 | 用途 |
|----------|---------|------|
| `pkgContractTF` | queryPkgContractPage / queryPkgContractDtlPage / getPackCust / getPackInfo / delContract / getPackContractCust / getContractPackInfoByCustId | 包材合同 |
| `purchaseTF` | queryPurchasePage / saveOrUpdatePurchase / sureReceivedByTableData / beginCalculateFee / deletePurchase / loadPackNameData / loadPurchaseDeliverData / loadPurchaseDeliverWorkData | 包材采购 |
| `pkgBusinessTF` | queryPkgBusinessPage / queryPackStoreDetailPage / queryPkgObjectPage / queryCustWorkPackPage / queryOpLogPage / queryAllPkgNameNoPage / queryPkgCustomerList | 包材业务 |
| `pkgFeeTF` | queryPackCostPage / queryPackIncomePage / queryCostShareInfo / addPackIncome / getPackContractCust | 包材费用 |
| `pkgPackInfoTF` | queryPkgPackInfoPage / delPkgPackInfo / getPkgOutWorkNodeList | 包材信息 |
| `pkgLogTF` | queryPkgLogBase / queryPkgLogRel | PDA 日志 |

## 5. 业务流程说明

### 5.1 包材全流程

```
签订包材合同（packContractManage）→ 包材采购（packPurchaseManage：收货 sureReceivedByTableData）
   → 费用计算（beginCalculateFee）→ 包材业务使用（packBusinessManage）
   → 包材监控（packMonitor）→ 库存明细（packStoreDetailManage）
   → 包材成本分摊（packCostManage）/ 包材收入（packIncomeManage）
   → 包材汇总（pkgSummaryManage）
```

---

> 相关接口完整清单见 [api-00-接口清单.md](./api-00-接口清单.md) 的 `pt/pkg` 分组。
