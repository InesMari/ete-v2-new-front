# 核心业务 — 业务协同

> **关联文档**：

| 关联文档 | 关联说明 |
|----------|---------|
| [web-00-项目总览.md](./web-00-项目总览.md) | 业务全景 |
| [web-10-核心业务-采购管理.md](./web-10-核心业务-采购管理.md) | 采购申请 |
| [web-08-核心业务-资源管理.md](./web-08-核心业务-资源管理.md) | 报价 |
| [api-00-接口清单.md](./api-00-接口清单.md) | 接口事实源（`pt/biz` 分组） |

## 1. 业务概述

**业务协同**（`src/page/pt/biz`）是平台的企业内部协同业务域（约 **28 个 .vue 页面**），主要承载与采购/资产/营销相关的审批协同：

```
资产调拨：调拨申请 → 审核 → 调拨执行
物品领用：领用申请（流程设置）→ 审核 → 领用
采购申请：申请（流程设置）→ 审核 → 生成付款检查 → 完成
营销礼品：礼品方案（二维码分享）→ 领取登记 → 核销
车辆报价：整车/零担 收入/成本 报价入口（业务协同侧）
```

- 核心服务标识（BeanName）：`assetsAllocatServiceImpl`、`claimApplyServiceImpl`、`purchaseApplyServiceImpl`、`schemeService`、`branchCfgService`、`commonTF`、`userTF`、`regionOrgTF`

## 2. 模块划分

| 子模块 | 目录 | 说明 |
|--------|------|------|
| 资产调拨 | `allocat/` | 资产调拨申请、审核、详情、日志 |
| 物品领用 | `claim/` | 领用申请（含流程设置）、审核、详情、日志 |
| 采购申请 | `purchase/` | 采购申请（含流程设置）、审核、打印、详情、日志 |
| 礼品方案 | `gift/` | 礼品方案管理、二维码分享、领取登记 |
| 车辆报价 | `quote/` | 整车收入/成本报价、零担收入/成本报价 |

## 3. 核心页面清单

### 3.1 资产调拨（allocat）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `allocat/assetsAllocatManage.vue` | 资产调拨管理（审核/删除） | `assetsAllocatServiceImpl.loadAssetsAllocatPage`、`assetsAllocatServiceImpl.verifyAssetsAllocatById`、`assetsAllocatServiceImpl.deleteAssetsAllocatById` |
| `allocat/add/addAssetsAllocat.vue` | 新增资产调拨申请 | `commonTF.getGrowthNum` |
| `allocat/detail/assetsAllocatDetail.vue` | 调拨详情 | - |
| `allocat/detail/assetsAllocatOpLog.vue` | 调拨操作日志 | `assetsAllocatServiceImpl.loadOpLog` |

### 3.2 物品领用（claim）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `claim/itemClaimApplyManage.vue` | 领用申请管理（审核/删除） | `claimApplyServiceImpl.loadClaimApplyPage`、`claimApplyServiceImpl.verifyClaimApplyById`、`claimApplyServiceImpl.deleteClaimApplyById` |
| `claim/add/addItemClaimApply.vue` | 新增领用申请 | `commonTF.getGrowthNum` |
| `claim/processSet.vue` | 领用流程设置 | `branchCfgService.loadClaimBranchCfgByBranchTypeOrderDefault`、`branchCfgService.saveOrUpdateBranchCfg`、`userTF.loadAllUser` |
| `claim/detail/itemClaimApplyOpLog.vue` | 领用操作日志 | `claimApplyServiceImpl.loadOpLog` |

### 3.3 采购申请（purchase）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `purchase/purchaseApplyManage.vue` | 采购申请管理（审核/完成/生成付款检查/删除） | `purchaseApplyServiceImpl.loadPurchaseApplyPage`、`purchaseApplyServiceImpl.verifyPurchaseApplyById`、`purchaseApplyServiceImpl.donePurchaseApply`、`purchaseApplyServiceImpl.generatePayApplyCheck`、`purchaseApplyServiceImpl.deletePurchaseApplyById` |
| `purchase/add/addPurchaseApply.vue` | 新增采购申请 | - |
| `purchase/processSet.vue` | 采购流程设置（按组织） | `branchCfgService.loadPurchaseBranchCfgByBranchTypeOrderDefault`、`branchCfgService.saveOrUpdateBranchCfg`、`regionOrgTF.getOrgInfoList`、`userTF.loadAllUser` |
| `purchase/purchaseApplyPrint.vue` | 采购申请打印 | - |
| `purchase/detail/purchaseApplyOpLog.vue` | 采购申请操作日志 | `purchaseApplyServiceImpl.loadOpLog` |

### 3.4 礼品方案（gift）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `gift/giftManage.vue` | 礼品方案管理（删除） | `schemeService.loadGiftSchemePage`、`schemeService.deleteGiftSchemeById` |
| `gift/addGift.vue` | 新增/编辑礼品方案 | `schemeService.loadGiftSchemeById`、`schemeService.saveOrUpdateGiftScheme` |
| `gift/giftReg.vue` | 礼品领取登记（记录发放） | `schemeService.loadGiftSchemeById`、`schemeService.loadGiftSchemeShareListBySchemeId`、`schemeService.recordGiftSchemeDelivery` |
| `gift/shareGift.vue` | 礼品分享（生成二维码） | `schemeService.generateShareQrCode`、`schemeService.loadGiftSchemeSubInfoListBySchemeId` |

### 3.5 车辆报价（quote）

| 页面 | 功能 | 说明 |
|------|------|------|
| `quote/quoteManageMain.vue` | 报价管理主框架 | 整车/零担报价入口 |
| `quote/completeVehicleIncomeQuote.vue` | 整车收入报价 | 整车报价（收入侧） |
| `quote/completeVehicleCostQuote.vue` | 整车成本报价 | 整车报价（成本侧） |
| `quote/lessThanTruckloadVehicleIncomeQuote.vue` | 零担收入报价 | 零担报价（收入侧） |
| `quote/lessThanTruckloadVehicleCostQuote.vue` | 零担成本报价 | 零担报价（成本侧） |

## 4. 核心接口速查

| BeanName | 主要方法 | 用途 |
|----------|---------|------|
| `assetsAllocatServiceImpl` | loadAssetsAllocatPage / verifyAssetsAllocatById / deleteAssetsAllocatById / loadOpLog | 资产调拨 |
| `claimApplyServiceImpl` | loadClaimApplyPage / verifyClaimApplyById / deleteClaimApplyById / loadOpLog | 物品领用 |
| `purchaseApplyServiceImpl` | loadPurchaseApplyPage / verifyPurchaseApplyById / donePurchaseApply / generatePayApplyCheck / deletePurchaseApplyById / loadOpLog | 采购申请 |
| `schemeService` | loadGiftSchemePage / saveOrUpdateGiftScheme / generateShareQrCode / recordGiftSchemeDelivery / loadGiftSchemeShareListBySchemeId | 礼品方案 |
| `branchCfgService` | loadClaimBranchCfgByBranchTypeOrderDefault / loadPurchaseBranchCfgByBranchTypeOrderDefault / saveOrUpdateBranchCfg | 流程分支配置 |

## 5. 业务流程说明

### 5.1 审批协同流程

```
（资产调拨/物品领用/采购申请通用）
配置流程（processSet：按作业组织配置审批分支）
   → 提交申请（addAssetsAllocat / addItemClaimApply / addPurchaseApply）
   → 审核（verifyXxxById）→ 打印（采购申请）
   → 完成（donePurchaseApply）→ 生成付款检查（generatePayApplyCheck，对接财务付款）
   → 全程操作日志（loadOpLog）
```

### 5.2 礼品营销流程

```
维护礼品方案（addGift）→ 分享（shareGift：生成二维码，外部扫码查看礼品）
   → 领取登记（giftReg：记录发放，绑定分享记录）
```

---

> 相关接口完整清单见 [api-00-接口清单.md](./api-00-接口清单.md) 的 `pt/biz` 分组。
