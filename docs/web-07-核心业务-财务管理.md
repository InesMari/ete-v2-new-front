# 核心业务 — 财务管理

> **关联文档**：

| 关联文档 | 关联说明 |
|----------|---------|
| [web-00-项目总览.md](./web-00-项目总览.md) | 业务全景 |
| [web-05-核心业务-订单管理.md](./web-05-核心业务-订单管理.md) | 收入/费用单来源 |
| [web-06-核心业务-仓储管理.md](./web-06-核心业务-仓储管理.md) | 仓储账单来源 |
| [api-00-接口清单.md](./api-00-接口清单.md) | 接口事实源（`pt/fc` 分组） |

## 1. 业务概述

**财务管理**（`src/page/pt/fc`）是平台核心业务域之一（约 **131 个 .vue 页面**），覆盖物流财务全流程：

```
收入侧：订单收入 → 客户账单（暂估/确认） → 应收登记 → 收款核销 → 开票
成本侧：运单成本 → 供应商账单（暂估/确认） → 应付登记 → 付款申请 → 付款核销
辅助：计提（保险/折旧）、标准成本、经营分析（预算/实际/报表）、零星收入（保险返点/废料处置）
```

- 核心服务标识（BeanName）：`fcCustBillTF`、`fcSupplierBillTF`、`fcPayTF`、`requestServiceImpl`、`fcCollectionRegistrationTF`、`fcExpenditureRegisterTF`、`fcApplyInvoiceTF`、`fcSubmitInvoiceTF`、`fcBudgetTF`、`fcActualTF`、`fcReportTF`、`fcThirdPayFeeTF`、`fcAccrualTF`、`ownVehicleBillTF`、`fcAdvanceTF`

## 2. 模块划分

| 子模块 | 目录 | 说明 |
|--------|------|------|
| 财务中心 | `financialCenter/` | 财务中心驾驶舱、费用变更 |
| 客户账单 | `custBill/` | 客户账单（暂估/确认）、账单补费、佣金 |
| 供应商账单 | `supplierBill/` | 供应商账单（暂估/确认）、费用变更 |
| 收付款 | `receipts/` | 付款单、申请费用（收款单）、付款记录 |
| 应收应付登记 | `register/` | 收款登记、付款登记、预收/预付、AR/AP |
| 发票 | `invoice/` | 开票申请、提交开票、成本科目 |
| 标准成本 | `standardCost/` | 运输成本、仓储成本、作业成本、油费、操作费 |
| 经营分析 | `businessAnalysis/` | 预算、实际、经营报表 |
| 第三方代付 | `g7Bill/`、`gdBill/` | G7/广东油卡代付 |
| 自有车账单 | `ownVehicleBill/` | 自有车辆账单 |
| 计提 | `accrual/` | 计提信息、计提统计、保险 |
| 零星收入 | `sporadic/` | 保险返点、废料处置、报废 |
| 仓储账单 | `storehouse/` | 仓储费用收入、租金 |
| 考核 | `examine/` | 考核管理、考核项 |
| 其他 | `billMakeup/`、`sundry/` | 账单补费、项目杂费 |

## 3. 核心页面清单

### 3.1 客户账单（custBill）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `custBill/unconfirmedBill.vue` | 未确认客户账单：暂估、确认、删除、补费 | `fcCustBillTF.queryCustomerBillPage`、`fcCustBillTF.sureFcCustomerBill`、`fcCustBillTF.deleteFcCustomerBill` |
| `custBill/confirmedBill.vue` | 已确认客户账单：开票、核销、撤销 | `fcCustBillTF.saveBillApplyInvoice`、`fcCustBillTF.saveWriteoffFee`、`fcCustBillTF.revokeBillConfirm` |
| `custBill/add/addCustomerBillMain.vue` | 新增客户账单 | `fcCustBillTF.saveOrUpdateCustBill` |
| `custBill/update/updateCustomerBillMain.vue` | 编辑客户账单 | `fcCustBillTF.saveOrUpdateCustBill` |
| `custBill/detail/billDetail.vue` | 账单详情 | `fcCustBillTF.queryCustomerBillPage` |
| `custBill/detail/confirmBillDetail.vue` | 账单确认详情 | `fcCustBillTF.queryCustomerBillPage` |
| `custBill/commissionManage.vue` | 佣金管理 | `commissionService.queryCommissionPage`、`commissionService.payRegistration` |
| `custBill/commissionDtlManage.vue` | 佣金明细 | `commissionService.queryCommissionDtlPage` |
| `billMakeup/billMakeupFeeList.vue` | 账单补费列表 | `fcCustBillTF.saveMakeupInfo`、`fcCustBillTF.verifyMakeupInfo` |

### 3.2 供应商账单（supplierBill）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `supplierBill/unconfirmedBill.vue` | 未确认供应商账单 | `fcSupplierBillTF.querySupplierBillPage`、`fcSupplierBillTF.sureFcSupplierBill` |
| `supplierBill/confirmedBill.vue` | 已确认供应商账单 | `fcSupplierBillTF.loadSupplierBillInvoiceInfo` |
| `supplierBill/add/addSupplierBillMain.vue` | 新增供应商账单 | `fcSupplierBillTF.saveOrUpdateFcSupplierBill` |
| `supplierBill/feeChangeManage.vue` | 供应商账单费用变更 | `fcSupplierBillTF.verifySupplierBillFeeChange` |

### 3.3 收付款（receipts）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `receipts/fcPayManage.vue` | 付款单管理：付款、撤销、作废、收款回单 | `fcPayTF.queryFcPayInfoPage`、`fcPayTF.payRegist`、`fcPayTF.receiveReceiptById` |
| `receipts/add/addPayOrder.vue` | 新增付款单（多业务来源：运费/采购/费用） | `fcPayTF.saveFcPayInfo`、`purchaseApplyServiceImpl.loadPurchaseApplyListByIds` |
| `receipts/requestFeeManage.vue` | 申请费用（收款单）管理 | `requestServiceImpl.loadRequestFeePage`、`requestServiceImpl.refundConfirm` |
| `receipts/add/addRequestFee.vue` | 新增申请费用 | `requestServiceImpl.saveOrUpdateRequestFee` |
| `receipts/payRecordManage.vue` | 付款记录 | `requestServiceImpl.loadPayRecordPage` |
| `receipts/detail/payOrderDetail.vue` | 付款单详情 | `fcPayTF.loadFcPayInfoForPrintById`、`fcPayTF.applyFcPayInfo` |
| `receipts/detail/requestFeeDetail.vue` | 申请费用详情（审核） | `requestServiceImpl.verifyRequestFeeById` |

### 3.4 应收应付登记（register）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `register/collectionRegistration.vue` | 收款登记（确认收款/核销） | `fcCollectionRegistrationTF.sureReceiveNew`、`fcCollectionRegistrationTF.batchSureReceive` |
| `register/collectionRegistrationRecord.vue` | 收款登记记录 | `fcCollectionRegistrationTF.queryReceiveRecord` |
| `register/expenditureRegisterManage.vue` | 付款登记 | `fcExpenditureRegisterTF.saveSupplierBillRegister`、`fcExpenditureRegisterTF.batchSaveSupplierBillRegister` |
| `register/expenditureRegisterRecord.vue` | 付款登记记录 | `fcExpenditureRegisterTF.querySupplierAllPayData` |
| `register/payAdvanceManage.vue` | 预付管理 | `fcAdvanceTF.savePayInfo`、`fcAdvanceTF.saveVerificationPay` |
| `register/receiveAdvanceManage.vue` | 预收管理 | `fcAdvanceTF.queryReceiveVancePage` |
| `register/ARManage.vue` | 应收总览（AR） | `fcCollectionRegistrationTF.loadBillNoReceiveData` |
| `register/APManage.vue` | 应付总览（AP） | `fcSupplierBillTF.queryNoPayFcSupplierBillInfo` |

### 3.5 发票（invoice）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `invoice/applyInvoiceManage.vue` | 开票申请管理（审核/开票） | `fcApplyInvoiceTF.queryApplyInvoicePage`、`fcApplyInvoiceTF.verifyInvoice`、`fcApplyInvoiceTF.verifySure` |
| `invoice/submitInvoiceManage.vue` | 提交开票 | `fcSubmitInvoiceTF.querySubmitInvoicePage`、`fcSubmitInvoiceTF.verifyInvoice` |
| `invoice/costAccountManage.vue` | 成本科目管理 | `fcCostAccountTF.queryCostAccountPage`、`fcCostAccountTF.saveCostAccount` |

### 3.6 标准成本（standardCost）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `standardCost/standardCostMain.vue` | 标准成本主框架 | - |
| `standardCost/transportationCostMain.vue` | 运输成本（外协） | `fcStandardCostTF.queryTransportationCostPage` |
| `standardCost/transportationCostOwnManage.vue` | 运输成本（自有车） | `fcStandardCostTF.queryOwnTransportationCostPage` |
| `standardCost/warehousingCostManage.vue` | 仓储成本 | `fcStandardCostTF.queryWarehousingCostPage` |
| `standardCost/workCostManage.vue` | 作业成本 | `fcStandardCostTF.queryWorkCostPage` |
| `standardCost/oilManage.vue` | 油费标准 | `fcStandardCostTF.queryOilPage` |
| `standardCost/operateFeeManage.vue` | 操作费标准 | `fcStandardCostTF.queryOperateFeePage` |
| `standardCost/storehouseCostInfo.vue` | 仓库成本信息 | `fcStandardCostTF.loadStorehouseCostInfo` |

### 3.7 经营分析（businessAnalysis）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `businessAnalysis/budget/budgetManage.vue` | 预算管理 | `fcBudgetTF.queryFcBudgetInfoPage` |
| `businessAnalysis/budget/budgetModify.vue` | 预算编制 | `fcBudgetTF.saveFcBudgetInfo`、`fcBudgetTF.calTotalMap` |
| `businessAnalysis/actual/actualManage.vue` | 实际数据管理 | `fcActualTF.queryFcActualInfoPage` |
| `businessAnalysis/actual/addActual.vue` | 实际数据录入 | `fcActualTF.saveFcActualInfo` |
| `businessAnalysis/report/reportCenter.vue` | 报表中心 | `fcBudgetTF.queryWorkOrgList` |
| `businessAnalysis/report/incomeCostReport.vue` | 收入成本报表 | `fcReportTF.getFcIncomeCostReportInfo` |
| `businessAnalysis/report/monthlySummaryReport.vue` | 月度汇总报表 | `fcReportTF.getFcMonthlySummaryReportInfo` |
| `businessAnalysis/report/netProfitAchievementReport.vue` | 净利润达成报表 | `fcReportTF.getFcNetProfitAchievementReportInfo` |
| `businessAnalysis/report/cumulativeAnalysisReport.vue` | 累计分析报表 | `fcReportTF.getFcCumulativeAnalysisReportInfo` |
| `businessAnalysis/report/compareAnalysisSummary.vue` | 同期对比分析 | `fcReportTF.loadSameMonthComparisonAnalysis` |

### 3.8 计提与其他

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `accrual/accrualInfoManage.vue` | 计提信息管理 | `fcAccrualTF.queryFcAccrualInfoPage` |
| `accrual/accrualStatisticsManage.vue` | 计提统计 | `fcAccrualTF.queryFcAccrualStatisticsInfoPage` |
| `accrual/insuranceManage.vue` | 保险管理 | `fcInsuranceTF.queryInsuranceInfoPage` |
| `accrual/saveInsuranceInfo.vue` | 保险信息（审核） | `fcInsuranceTF.saveInsuranceInfo`、`fcInsuranceTF.verifyInsuranceInfo` |
| `sporadic/insuranceRebate.vue` | 保险返点 | `fcSporadicIncomeTF.saveInsuranceRebate` |
| `sporadic/wasteDisposal.vue` | 废料处置收入 | `fcSporadicIncomeTF.saveWasteDisposalIncome` |
| `sporadic/scrapManage.vue` | 报废管理 | `fcSporadicIncomeTF.queryScrapPage` |
| `g7Bill/payApplyManage.vue` | G7 代付申请管理 | `fcThirdPayFeeTF.queryFcThirdPayFeeInfoPage` |
| `gdBill/payApplyVerify.vue` | 广东油卡代付审核 | `fcThirdPayFeeTF.verifyFcThirdPayFeeInfo` |
| `ownVehicleBill/ownVehicleConfirmedBill.vue` | 自有车已确认账单（付款） | `ownVehicleBillTF.payOwnVehicleFee` |
| `financialCenter/financialCenter.vue` | 财务中心驾驶舱 | `fcTF.queryStatisticsInfo` |
| `examine/fcExamineInfoManage.vue` | 考核管理 | `fcExamineTF.queryFcExamineInfoPage` |

## 4. 核心接口速查

| BeanName | 主要方法 | 用途 |
|----------|---------|------|
| `fcCustBillTF` | queryCustomerBillPage / saveOrUpdateCustBill / sureFcCustomerBill / saveBillApplyInvoice / saveWriteoffFee / saveMakeupInfo / verifyMakeupInfo | 客户账单全流程 |
| `fcSupplierBillTF` | querySupplierBillPage / saveOrUpdateFcSupplierBill / sureFcSupplierBill / queryPaySupplierBillPage / querySupplierBankDataNoPage | 供应商账单全流程 |
| `fcPayTF` | queryFcPayInfoPage / saveFcPayInfo / payRegist / cancelFcPayInfo / revokePayById / receiveReceiptById / loadOpLog | 付款单 |
| `requestServiceImpl` | loadRequestFeePage / saveOrUpdateRequestFee / verifyRequestFeeById / cancelPayRegist / refundConfirm / loadPayRecordPage | 申请费用（收款） |
| `fcCollectionRegistrationTF` | sureReceiveNew / batchSureReceive / cancleReceiveFee / queryReceiveRecord | 收款登记 |
| `fcExpenditureRegisterTF` | saveSupplierBillRegister / batchSaveSupplierBillRegister / querySupplierBillPayData | 付款登记 |
| `fcApplyInvoiceTF` | queryApplyInvoicePage / verifyInvoice / verifySure / revokeInvoicingBatch | 开票申请 |
| `fcSubmitInvoiceTF` | querySubmitInvoicePage / saveUpSubmitInvoice / verifyInvoice | 提交开票 |
| `fcBudgetTF` | queryFcBudgetInfoPage / saveFcBudgetInfo / calTotalMap / queryFcAttrInfoList | 预算 |
| `fcActualTF` | queryFcActualInfoPage / saveFcActualInfo / verifyFcActualDtl | 实际数据 |
| `fcReportTF` | getFcIncomeCostReportInfo / getFcMonthlySummaryReportInfo / loadBusinessResultsAnalysis | 经营报表 |
| `fcThirdPayFeeTF` | queryFcThirdPayFeeInfoPage / addFcThirdPayFeeInfo / payFcThirdPayFeeInfo / verifyFcThirdPayFeeInfo | 第三方代付 |
| `fcAccrualTF` | queryFcAccrualInfoPage / queryFcAccrualStatisticsInfo | 计提 |
| `fcStandardCostTF` | queryTransportationCostPage / queryWarehousingCostPage / queryOilPage | 标准成本 |
| `fcAdvanceTF` | savePayInfo / saveVerificationPay / queryPayVancePage | 预收预付 |
| `ownVehicleBillTF` | queryOwnVehicleBillPage / saveOwnVehicleBill / sureOwnVehicleBill / payOwnVehicleFee | 自有车账单 |
| `fcInsuranceTF` | queryInsuranceInfoPage / saveInsuranceInfo / verifyInsuranceInfo | 保险 |

## 5. 业务流程说明

### 5.1 客户收入流程

```
订单收入/仓储费用 → 生成客户账单（暂估）
   → unconfirmedBill 暂估账单确认（sureFcCustomerBill）
   → confirmedBill 已确认账单：申请开票（saveBillApplyInvoice）/ 核销（saveWriteoffFee）
   → 收款登记（collectionRegistration：sureReceiveNew）
   → 开票申请审核（applyInvoiceManage） → 提交开票（submitInvoiceManage）
```

### 5.2 供应商成本流程

```
运单成本/仓储成本 → 生成供应商账单（暂估）
   → 供应商账单确认（sureFcSupplierBill）
   → 付款登记（expenditureRegisterManage）
   → 新增付款单（addPayOrder：可关联供应商账单/采购申请/申请费用）
   → 付款（fcPayManage：payRegist） → 回单（receiveReceiptById）
```

### 5.3 第三方代付（G7/广东）

```
运单按 G7/广东油卡费用生成代付申请（payApply：addFcThirdPayFeeInfo）
   → 代付审核（payApplyVerify：verifyFcThirdPayFeeInfo）
   → 代付登记（payApplyRegister：payFcThirdPayFeeInfo） → 打印（payApplyPrint）
```

### 5.4 经营分析

```
编制预算（budgetModify：saveFcBudgetInfo） → 录入实际（addActual：saveFcActualInfo）
   → 报表中心（reportCenter）查看收入成本/月度汇总/净利润/累计分析报表
```

---

> 相关接口完整清单见 [api-00-接口清单.md](./api-00-接口清单.md) 的 `pt/fc` 分组。
