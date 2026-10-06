# 核心业务 — 数据报表

> **关联文档**：

| 关联文档 | 关联说明 |
|----------|---------|
| [web-00-项目总览.md](./web-00-项目总览.md) | 业务全景 |
| [web-07-核心业务-财务管理.md](./web-07-核心业务-财务管理.md) | 经营分析报表 |
| [web-21-大屏看板.md](./web-21-大屏看板.md) | 数据大屏 |
| [api-00-接口清单.md](./api-00-接口清单.md) | 接口事实源（`pt/dataReport`、`pt/rpt` 分组） |

## 1. 业务概述

**数据报表**（`src/page/pt/dataReport` + `src/page/pt/rpt`）是平台的分析决策域（共约 **63 个 .vue 页面**），提供：

```
看板类：数据大屏（订单/仓储作业/检验/成本收入/客户留存/无库存预警）
经营数据：运输/车辆/作业(zy)/汇总 四类经营数据（预算、实际、月度明细）
销售管理：销售预算、销售实际、预算达成
报表类（rpt）：应收/回款、客户/供应商经营、运输经营、预算差异
问卷类：客户满意度问卷（模板/发布/答卷/统计）
考核类：仓储考核（wmsExamine）与财务考核（examineCenter）
```

- 核心服务标识（BeanName）：`fcTF`、`fcAnalysisTF`、`fcBudgetSalesTF`、`fcActualSalesTF`、`rptFeeReportTF`、`rptCustOperationTF`、`transportReportTF`、`rptBudgetInfoTF`、`orderService`、`wmsDataReportService`、`wmsCostService`、`wmsInspectionSummaryService`、`wmsExamineTF`、`questionnaireService`、`answerService`

## 2. 模块划分

| 子模块 | 目录 | 说明 |
|--------|------|------|
| 数据大屏 | `dataReport/kanban/` | 订单大屏、仓储作业、检验数据、仓库成本收入、客户留存、无库存预警 |
| 经营数据 | `dataReport/operatingData/` | 运输/车辆/作业经营数据与汇总 |
| 销售管理 | `dataReport/sales/` | 销售预算、销售实际、预算达成 |
| 仓储考核 | `dataReport/wmsExamine/` | 仓储考核项配置、考核统计、明细 |
| 问卷 | `dataReport/questionnaire/` | 问卷模板、发布、答卷、统计 |
| 报表（rpt） | `rpt/feeReport/` | 应收/回款/逾期费用报表 |
| 报表（rpt） | `rpt/transportReport/` | 客户/供应商/订单运输经营报表 |
| 报表（rpt） | `rpt/custOperation/`、`rpt/operationBudgetDiff/`、`rpt/base/` | 客户经营、预算差异、预算管理 |
| 系统数据 | `dataReport/systemData.vue` | 系统数据驾驶舱（订单/运单/应收/应付/出勤） |

## 3. 核心页面清单

### 3.1 数据大屏（kanban）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `kanban/orderBoard.vue` | 订单大屏（已派/待派/调度） | `orderService.queryOrderListForScreen`、`orderService.queryDispatchOrderListForScreen`、`orderService.queryPrepDispatchOrderListForScreen` |
| `kanban/wmsOperate.vue` | 仓储作业看板 | `wmsDataReportService.loadWmsDataByCondition` |
| `kanban/inspectData.vue` | 检验数据看板 | `wmsInspectionSummaryService.loadInspectionTaskByCondition`、`loadInspectionTaskGroupByWorkBarData` |
| `kanban/warehouseCostIncome.vue` | 仓库成本收入分析（柱/线/饼） | `wmsCostService.loadWarehouseCostIncomeBarData`、`loadWarehouseCostIncomeLineData`、`loadWarehouseCostIncomePieData` |
| `kanban/retentionCustomer.vue` | 客户留存看板 | `orderService.saveOrUpdateUserCustomerViewRelList` |
| `kanban/uninventoryStockStorageManage.vue` | 无库存货位预警 | `wmsDataReportService.queryWmsUninventoryStockDtlPage` |

### 3.2 经营数据（operatingData）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `operatingData/operatingDataMain.vue` | 经营数据主框架 | - |
| `operatingData/summary/operatingDataSummary.vue` | 经营数据汇总 | `fcAnalysisTF.queryFcAnalysisSummaryInfoPage` |
| `operatingData/summary/operatingDataSummaryDetail.vue` | 汇总明细 | `fcAnalysisTF.queryFcAnalysisSummaryInfoDtl` |
| `operatingData/transport/transportOperatingData.vue` | 运输经营数据（预算/实际） | - |
| `operatingData/transport/transportMonthDetail.vue` | 运输月度明细 | - |
| `operatingData/transport/transportMonthFinanceDetail.vue` | 运输月度财务明细 | - |
| `operatingData/vehicle/vehicleOperatingData.vue` | 车辆经营数据 | - |
| `operatingData/zy/zyOperatingData.vue` | 作业中心(zy)经营数据 | - |

### 3.3 销售管理（sales）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `sales/fcSalesMain.vue` | 销售管理主框架 | - |
| `sales/budget/fcBudgetSalesManage.vue` | 销售预算管理 | `fcBudgetSalesTF.queryFcBudgetSalesPage`、`fcBudgetSalesTF.delFcBudgetSalesInfo` |
| `sales/budget/fcBudgetSalesDetail.vue` | 销售预算编制（审核） | `fcBudgetSalesTF.getFcBudgetSalesInfo`、`fcBudgetSalesTF.verifyFcBudgetSalesInfo` |
| `sales/actual/fcActualSalesManage.vue` | 销售实际管理 | `fcActualSalesTF.queryFcActualSalesPage`、`fcActualSalesTF.delFcActualSalesInfo` |
| `sales/actual/fcActualSalesDetail.vue` | 销售实际录入 | `fcActualSalesTF.getFcActualSalesInfo` |
| `sales/budgetAchievement/budgetAchievement.vue` | 预算达成率 | `fcActualSalesTF.queryAllSalesStatisticsInfo` |

### 3.4 仓储考核（wmsExamine）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `wmsExamine/wmsExamineItemCfgManage.vue` | 考核项配置 | `wmsExamineTF.queryWmsExamineItemCfgPage`、`wmsExamineTF.saveWmsExamineItemCfg` |
| `wmsExamine/wmsExamineStatisticsManage.vue` | 考核统计 | `wmsExamineTF.queryWmsExamineStatisticsPage` |
| `wmsExamine/wmsExamineItemStatisticsManage.vue` | 考核项统计 | `wmsExamineTF.queryWmsExamineItemStatisticsPage` |
| `wmsExamine/wmsExamineDTLStatisticsManage.vue` | 考核明细统计 | `wmsExamineTF.queryWmsExamineItemDtlPage`、`wmsExamineTF.queryWmsExamineItemStatistics` |
| `wmsExamine/wmsOrderExamineDetail.vue` | 订单考核详情 | `wmsExamineTF.getOrderDetail` |
| `examineCenter.vue` | 考核中心（本年考核） | `fcExamineTF.getThisYearFcExamineInfo`、`wmsExamineTF.queryWmsExamineInfoId` |

### 3.5 问卷（questionnaire）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `questionnaire/questionnaireManager.vue` | 问卷管理（发布/删除） | `questionnaireService.queryQuestionnairePage`、`questionnaireService.putQuestionnaire` |
| `questionnaire/addQuestionnaire.vue` | 新增问卷（基于模板） | `questionnaireService.saveOrUpdateQuestionnaire`、`questionnaireTemplateService.loadQuestionnaireTemplateById` |
| `questionnaire/template/questionnaireTemplateManager.vue` | 问卷模板管理 | `questionnaireTemplateService.queryQuestionnaireTemplatePage` |
| `questionnaire/answerSheetManager.vue` | 答卷管理 | `answerService.queryAnswerPage` |
| `questionnaire/answerSheetStatistics.vue` | 答卷统计 | `answerService.loadAnswerQuestionDataByQuestionnaireId` |
| `questionnaire/answerSheetStatisticsByCustomerService.vue` | 按客户服务商统计 | `answerService.queryAnswerPageGroupByPutUser` |

### 3.6 财务报表（rpt/feeReport）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `feeReport/receivableReportMain.vue` | 应收报表主框架 | - |
| `feeReport/receivableTotalReport.vue` | 应收汇总报表 | `rptFeeReportTF.queryReceivableTotalReportPage` |
| `feeReport/receivableDetailReport.vue` | 应收明细报表 | `rptFeeReportTF.queryReceivableDetailReportPage` |
| `feeReport/overdueFeeDetailReport.vue` | 逾期费用明细报表 | `rptFeeReportTF.queryOverdueFeeDetailReportPage` |
| `feeReport/meetTotalReport.vue` | 回款汇总报表 | `rptFeeReportTF.queryMeetTotalReportData` |
| `feeReport/meetDetailReport.vue` | 回款明细报表 | `rptFeeReportTF.queryMeetDetailReportData` |

### 3.7 经营报表（rpt）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `transportReport/orderOperationReport.vue` | 订单经营报表 | `transportReportTF.loadOrderOperationReportPage` |
| `transportReport/customerOperationSummary.vue` | 客户经营汇总 | `transportReportTF.loadCustomerOperationSummaryPage` |
| `transportReport/customerOperationDetail.vue` | 客户经营明细 | `transportReportTF.loadCustomerOperationDetailPage` |
| `transportReport/supplierOperationSummary.vue` | 供应商经营汇总 | `transportReportTF.loadSupplierOperationSummaryPage` |
| `transportReport/supplierOperationDetail.vue` | 供应商经营明细 | `transportReportTF.loadSupplierOperationDetailPage` |
| `custOperation/custOperationReport.vue` | 客户经营报表 | `rptCustOperationTF.queryRptCustOperationInfoPage` |
| `operationBudgetDiff/diffMonthReport.vue` | 预算差异（月度） | `rptCustOperationTF.queryOperationBudgetDiffMonthPage` |
| `operationBudgetDiff/diffCustReport.vue` | 预算差异（客户） | `rptCustOperationTF.queryOperationBudgetDiffCustPage` |
| `base/budgetManage.vue` | 报表预算管理 | `rptBudgetInfoTF.queryRptBudgetInfoPage`、`addModifyRptBudgetInfoDetail` |

### 3.8 系统数据

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `systemData.vue` | 系统数据驾驶舱 | `orderService.loadOrderCount`、`ordWaybillTF.loadWaybillCount`、`rptFeeReportTF.loadReceivableCount`、`rptFeeReportTF.loadPayableCount`、`vehicleBenefitAccountingService.loadOwnVehicleAttendanceData` |
| `dataReport.vue` | 数据报表首页（统计） | `fcTF.queryDataReportStatisticsInfo` |
| `storageFeeSummarManage.vue` | 仓储费用汇总 | `wmsCostService.queryWmsCostReportPage` |
| `sysLogInfoManage.vue` | 系统日志 | `sysLogTF.querySysLogPage` |

## 4. 核心接口速查

| BeanName | 主要方法 | 用途 |
|----------|---------|------|
| `fcAnalysisTF` | queryFcAnalysisSummaryInfoPage / queryFcAnalysisSummaryInfoDtl | 经营数据汇总 |
| `fcBudgetSalesTF` | queryFcBudgetSalesPage / getFcBudgetSalesInfo / verifyFcBudgetSalesInfo | 销售预算 |
| `fcActualSalesTF` | queryFcActualSalesPage / getFcActualSalesInfo / queryAllSalesStatisticsInfo | 销售实际 |
| `rptFeeReportTF` | queryReceivableTotalReportPage / queryReceivableDetailReportPage / queryOverdueFeeDetailReportPage / queryMeetTotalReportData / queryMeetDetailReportData / loadReceivableCount / loadPayableCount | 应收/回款报表 |
| `transportReportTF` | loadOrderOperationReportPage / loadCustomerOperationSummaryPage / loadCustomerOperationDetailPage / loadSupplierOperationSummaryPage / loadSupplierOperationDetailPage | 运输经营报表 |
| `rptCustOperationTF` | queryRptCustOperationInfoPage / queryOperationBudgetDiffMonthPage / queryOperationBudgetDiffCustPage | 客户经营/预算差异 |
| `orderService` | queryOrderListForScreen / queryDispatchOrderListForScreen / loadOrderCount | 订单大屏/数据 |
| `wmsDataReportService` | loadWmsDataByCondition / queryWmsUninventoryStockDtlPage | 仓储作业看板 |
| `wmsCostService` | loadWarehouseCostIncomeBarData / loadWarehouseCostIncomeLineData / loadWarehouseCostIncomePieData / queryWmsCostReportPage | 仓库成本收入 |
| `wmsInspectionSummaryService` | loadInspectionTaskByCondition / loadInspectionTaskGroupByWorkBarData / loadHasDoneInspectionTaskData | 检验数据看板 |
| `wmsExamineTF` | queryWmsExamineItemCfgPage / saveWmsExamineItemCfg / queryWmsExamineStatisticsPage / queryWmsExamineItemDtlPage | 仓储考核 |
| `questionnaireService` / `questionnaireTemplateService` / `answerService` | 问卷/模板/答卷 CRUD 与统计 | 满意度问卷 |

## 5. 业务说明

- **经营数据**：运输/车辆/作业三类经营数据（预算 vs 实际）→ 汇总 → 月度明细，支撑成本利润分析
- **销售管理**：销售预算编制（审核）→ 销售实际录入 → 预算达成率，支撑销售团队考核
- **满意度问卷**：模板维护 → 创建问卷（引用模板）→ 发布（putQuestionnaire）→ 客户答卷 → 按题目/按客服统计
- **报表体系**：应收/回款（汇总+明细+逾期）→ 客户/供应商/订单经营 → 预算差异（月度/客户）
- **数据大屏**：订单、仓储作业、检验、成本收入等实时看板（进入方式见 [web-21-大屏看板.md](./web-21-大屏看板.md)）

---

> 相关接口完整清单见 [api-00-接口清单.md](./api-00-接口清单.md) 的 `pt/dataReport`、`pt/rpt` 分组。
