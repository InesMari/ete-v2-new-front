# 核心业务 — 客户管理

> **关联文档**：

| 关联文档 | 关联说明 |
|----------|---------|
| [web-00-项目总览.md](./web-00-项目总览.md) | 业务全景 |
| [web-08-核心业务-资源管理.md](./web-08-核心业务-资源管理.md) | 供应商报价 |
| [web-07-核心业务-财务管理.md](./web-07-核心业务-财务管理.md) | 客户账单 |
| [api-00-接口清单.md](./api-00-接口清单.md) | 接口事实源（`pt/cm` 分组） |

## 1. 业务概述

**客户管理**（`src/page/pt/cm`）是平台核心业务域之一（约 **54 个 .vue 页面**），覆盖客户从准入到经营的完整生命周期：

```
客户准入（建档/审核） → 基础配置（工作点/库房/货物/线路/报价）
   → 商务合作（合同/评审/报价单） → 经营支撑（应用/接口/时限/子公司）
```

- 核心服务标识（BeanName）：`customerTF`、`workGoodsTF`、`storeHouseBizTF`、`routeTF`、`quoteLDNewTF`、`ZCQuoteNewTF`、`quoteSheetTF`、`contractService`、`contractReviewTF`、`regionOrgTF`、`applicationService`、`interfaceService`、`workDetailService`、`cmBusinessCooperationTF`

## 2. 模块划分

| 子模块 | 目录 | 说明 |
|--------|------|------|
| 客户档案 | `customer/` | 客户管理、临时客户、子公司、客户详情 |
| 库房管理 | `customer/` | 库房管理、库房用户、库房出售 |
| 工作点 | `customer/` | 工作点（营业网点）管理 |
| 货物管理 | `customer/` | 货物信息管理 |
| 线路管理 | `customer/route/` | 客户线路（起讫地）管理 |
| 客户报价 | `customer/quote/` | 零担(LD)/整车(ZC)客户报价 |
| 合同管理 | `contract/` | 客户合同、供应商合同、内部合同、保险/包装容器/仓储设备合同 |
| 合同评审 | `contract/review/` | 合同评审、审核、登记 |
| 报价单 | `quoteSheet/` | 客户报价单（询价/报价/确认）、报价报表 |
| 其他 | `applicationManage.vue`、`interfaceManage.vue`、`cmCustTimeLimitManage.vue`、`cmBusinessCooperationManage.vue` | 应用、接口、时限、业务协同 |

## 3. 核心页面清单

### 3.1 客户档案

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `customer/customerManage.vue` | 客户管理列表（新增/停用/审核） | `customerTF.queryCustomerList`、`customerTF.updateCustomerState` |
| `customer/customerManageMain.vue` | 客户管理主框架 | - |
| `customer/addCustomer.vue` | 新增客户（营业执照 OCR） | `customerTF.getCustomerDetailInfo`、`supplierTF.getBusinessLicenseInfo`、`regionOrgTF.getOrgInfoList` |
| `customer/customerDetail.vue` | 客户详情（汇总） | `customerTF.queryCustomerCollect` |
| `customer/customerSubCompany.vue` | 客户子公司管理 | `customerTF.queryCustomerList`、`customerTF.updateCustomerState` |
| `customer/temporaryCustomerManage.vue` | 临时客户管理 | `customerTF.queryCustomerList`、`customerTF.updateCustomerState` |
| `customer/addTemporaryCustomer.vue` | 新增临时客户 | `customerTF.getCustomerDetailInfo`、`supplierTF.getBusinessLicenseInfo` |

### 3.2 库房与工作点

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `customer/storehouseManage.vue` | 库房管理（库房信息/用户/启用停用） | `storeHouseBizTF.queryStoreHouseList`、`workGoodsTF.queryStorehouseData`、`workGoodsTF.disableWorkStorehouseInfo` |
| `customer/addStorehouse.vue` | 新增库房（省市区定位） | `workGoodsTF.addStorehouse`、`workGoodsTF.checkWorkDistance`、`storeHouseBizTF.queryStoreHouseList` |
| `customer/workInfoManage.vue` | 工作点管理（地址拆分） | `workGoodsTF.queryWorkData`、`workGoodsTF.addWorkInfo`、`commonTF.getSplitAddress` |
| `customer/workInfoManageDetail.vue` | 工作点明细（收货/发货点） | `workDetailService.queryWorkDetailPage`、`workDetailService.saveOrUpdateWorkDetail` |
| `customer/goodsInfoManage.vue` | 货物信息管理 | `workGoodsTF.queryGoodsData`、`workGoodsTF.addGoodsInfo` |

### 3.3 线路与报价

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `customer/route/routeManage.vue` | 线路管理 | `routeTF.loadRouteDataByTenantId`、`routeTF.changeRouteSts` |
| `customer/route/addRoute.vue` | 新增线路 | `routeTF.addRoute` |
| `customer/route/updateRoute.vue` | 编辑线路 | `routeTF.loadRouteById`、`routeTF.updateRoute` |
| `customer/quote/quoteManageLD.vue` | 客户零担报价管理 | `quoteLDNewTF.queryLDQuoteData`、`quoteLDNewTF.cancelVerifyQuote`、`quoteLDNewTF.delQuoteInfo` |
| `customer/quote/quoteManageVerifyLD.vue` | 客户零担报价审核 | `quoteLDNewTF.verifyQuote` |
| `customer/quote/addQuoteInfoLD.vue` | 新增客户零担报价 | `quoteLDNewTF.queryQuoteInfoById`、`workGoodsTF.queryGoodsDataByTenantId` |
| `customer/quote/customerZCQuoteManage.vue` | 客户整车报价管理 | `ZCQuoteNewTF.queryQuote`、`ZCQuoteNewTF.verifyQuote`、`ZCQuoteNewTF.cancelVerifyQuote` |
| `customer/quote/addCustomerZCQuote.vue` | 新增客户整车报价 | `ZCQuoteNewTF.saveCmSectionQuoteData`、`customerTF.loadCustomerList` |

### 3.4 报价单（quoteSheet）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `quoteSheet/tsQuoteSheetManage.vue` | 报价单管理（生成/确认/审核/取消） | `quoteSheetTF.queryQuoteSheetPage`、`quoteSheetTF.generateQuoteSheet`、`quoteSheetTF.confirmQuoteSheet`、`quoteSheetTF.verifyQuoteSheet`、`quoteSheetTF.delQuoteSheet` |
| `quoteSheet/addQuoteSheet.vue` | 新增报价单 | `quoteSheetTF.saveQuoteSheet` |
| `quoteSheet/quoteSheetDetail.vue` | 报价单详情 | `quoteSheetTF.queryQuoteSheet` |
| `quoteSheet/tsQuoteSheetRptManage.vue` | 报价单报表 | `quoteSheetTF.queryQuoteSheetRptPage` |

### 3.5 合同管理（contract）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `contract/contractManageMain.vue` | 合同管理主框架 | - |
| `contract/customerContract.vue` | 客户合同（统计） | `contractService.queryCustomerStatisticsData`、`customerTF.queryCustomerListNoPage` |
| `contract/supplierContract.vue` | 供应商合同 | - |
| `contract/innerContract.vue` | 内部合同 | - |
| `contract/insuranceContract.vue` | 保险类合同 | - |
| `contract/packingContainerContract.vue` | 包装容器合同 | - |
| `contract/storageEquipmentContract.vue` | 仓储设备合同 | - |
| `contract/otherContract.vue` | 其他合同 | - |
| `contract/contractDetail.vue` | 合同详情 | `contractService.getContractDetail` |

### 3.6 合同评审（contract/review）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `contract/review/customerContractReviewManage.vue` | 客户合同评审列表（删除/取消/登记） | `contractReviewTF.queryCustomerContractReviewPage`、`contractReviewTF.sendOffRegisterContractReviewInfo` |
| `contract/review/customerContractInfo.vue` | 客户合同评审（保存/送审） | `contractReviewTF.saveContractReviewInfo`、`contractReviewTF.reviewContractInfo`、`contractReviewTF.addPrintTimes` |
| `contract/review/supplierContractReviewManage.vue` | 供应商合同评审列表（撤销） | `contractReviewTF.querySupplierContractReviewPage`、`contractReviewTF.revokeContractReviewInfo` |
| `contract/review/supplierContractInfo.vue` | 供应商合同评审 | `contractReviewTF.saveContractReviewInfo`、`contractReviewTF.reviewContractInfo` |

### 3.7 应用与接口

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `customer/applicationManage.vue` | 客户应用管理 | `applicationService.queryApplicationPage`、`applicationService.saveOrUpdateApplication` |
| `customer/interfaceManage.vue` | 外部接口管理 | `interfaceService.queryInterfacePage`、`interfaceService.saveOrUpdateInterface`、`interfaceService.getApplicationExternalInterfaceList` |
| `customer/cmCustTimeLimitManage.vue` | 客户时限管理 | `cmCustTimeLimitTF.queryCmCustTimeLimitInfoPage`、`cmCustTimeLimitTF.delCmCustTimeLimitInfo` |
| `customer/cmBusinessCooperationManage.vue` | 客户业务协同处理 | `cmBusinessCooperationTF.queryCmBusinessCooperationInfoPage`、`cmBusinessCooperationTF.dealCmBusinessCooperationInfo` |

## 4. 核心接口速查

| BeanName | 主要方法 | 用途 |
|----------|---------|------|
| `customerTF` | queryCustomerList / getCustomerDetailInfo / updateCustomerState / queryCustomerCollect / queryCustomerListNoPage / loadCustomerList | 客户档案 |
| `workGoodsTF` | queryWorkData / addWorkInfo / queryGoodsData / addGoodsInfo / addStorehouse / queryStorehouseData / checkWorkDistance / queryWorkDataSelect | 工作点/库房/货物 |
| `storeHouseBizTF` | queryStoreHouseList / queryStoreHouseUserList / delStoreHouseUser | 库房 |
| `routeTF` | loadRouteDataByTenantId / addRoute / updateRoute / loadRouteById / changeRouteSts | 线路 |
| `quoteLDNewTF` | queryLDQuoteData / verifyQuote / cancelVerifyQuote / upQuoteInfo / delQuoteInfo | 客户零担报价 |
| `ZCQuoteNewTF` | queryQuote / verifyQuote / cancelVerifyQuote / saveCmSectionQuoteData / loadQuoteDataByQuoteId | 客户整车报价 |
| `quoteSheetTF` | queryQuoteSheetPage / saveQuoteSheet / generateQuoteSheet / confirmQuoteSheet / verifyQuoteSheet / cancelConfirmQuoteSheet / delQuoteSheet / queryQuoteSheetRptPage | 报价单 |
| `contractService` | getContractDetail / queryCustomerStatisticsData / queryStorageEquipmentContractList | 合同 |
| `contractReviewTF` | queryCustomerContractReviewPage / querySupplierContractReviewPage / saveContractReviewInfo / reviewContractInfo / cancelReviewContractInfo / revokeContractReviewInfo / sendOffRegisterContractReviewInfo / addPrintTimes | 合同评审 |
| `regionOrgTF` | getOrgInfoList / getRegionInfoList / getStaffInfoList / queryStaffData | 组织区域人员 |
| `applicationService` / `interfaceService` | 应用/接口 CRUD | 客户应用与接口 |

## 5. 业务流程说明

### 5.1 客户准入流程

```
新增客户（addCustomer：OCR 营业执照）→ 客户列表管理（customerManage）
   → 维护客户子公司/临时客户 → 客户详情汇总（customerDetail）
```

### 5.2 客户商务配置流程

```
维护工作点（workInfoManage）与库房（storehouseManage）
   → 维护货物（goodsInfoManage）与线路（routeManage）
   → 制定客户报价（零担 quoteManageLD / 整车 customerZCQuoteManage）
   → 报价单（tsQuoteSheetManage：生成→确认→审核）
   → 签订合同（customerContract）→ 合同评审（customerContractReviewManage）
```

### 5.3 合同评审流程

```
录入合同信息（customerContractInfo：saveContractReviewInfo）
   → 送审（reviewContractInfo）→ 评审列表跟踪（customerContractReviewManage）
   → 取消/删除/撤销 → 登记归档（sendOffRegisterContractReviewInfo）
```

---

> 相关接口完整清单见 [api-00-接口清单.md](./api-00-接口清单.md) 的 `pt/cm` 分组。
