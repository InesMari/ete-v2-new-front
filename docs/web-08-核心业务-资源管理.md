# 核心业务 — 资源管理

> **关联文档**：

| 关联文档 | 关联说明 |
|----------|---------|
| [web-00-项目总览.md](./web-00-项目总览.md) | 业务全景 |
| [web-05-核心业务-订单管理.md](./web-05-核心业务-订单管理.md) | 订单调度使用资源 |
| [web-07-核心业务-财务管理.md](./web-07-核心业务-财务管理.md) | 资源成本核算 |
| [web-21-大屏看板.md](./web-21-大屏看板.md) | 车辆监控大屏 |
| [api-00-接口清单.md](./api-00-接口清单.md) | 接口事实源（`pt/res` 分组） |

## 1. 业务概述

**资源管理**（`src/page/pt/res`）是平台核心业务域之一（约 **99 个 .vue 页面**），统一管理运力资源与运力交易：

```
运力资源：车辆（外协/自有）、司机（外协/自有）、挂车、押运员
资源成本：维修、年检、固定成本、运单成本、人员成本、效益核算
运力交易：零担报价(LD)、整车报价(ZC)、仓储报价、分段报价（招投标）
监控调度：车辆监控（GPS/轨迹）、车辆调度计划、车辆作业、设备（RFID/电子锁）
```

- 核心服务标识（BeanName）：`resVehicleInfoTF`、`driverTF`、`vehicleScheduleService`、`vehicleWorkService`、`quoteLDNewTF`、`ZCQuoteNewTF`、`quoteService`、`sectionQuoteService`、`equipmentTF`、`monitorTF`、`vehicleBenefitAccountingService`、`vehicleRepairCostService`、`vehicleFixedCostService`、`vehicleWaybillCostService`、`fcPersonnelCostTF`、`workContractService`、`wmsStorehouseTF`、`storeHouseBizTF`

## 2. 模块划分

| 子模块 | 目录 | 说明 |
|--------|------|------|
| 外协车辆 | `vehicle/`、`vehicleManage.vue` | 外协车辆信息、状态管理、GPS 设备绑定 |
| 外协司机 | `driverManage.vue`、`driverInfo.vue` | 司机信息、OCR 认证、状态管理 |
| 自有车管理 | `ownVehicle/` | 自有车辆、自有司机、挂车、押运员、考核、里程、统计 |
| 自有车成本 | `ownVehicleCost/` | 维修费、年检、固定成本、运单成本、人员成本、效益核算 |
| 报价 | `quote/` | 零担报价(LD)、整车报价(ZC)、仓储报价(WMS)、报价审核 |
| 分段报价 | `sectionQuote/` | 分段报价（区域招投标）、批量生成 |
| 车辆监控 | `vehicleMonitor*.vue` | 车辆实时监控（地图/位置/轨迹）、无 GPS 车辆 |
| 车辆调度计划 | `vehicleSchedule*.vue` | 调度计划管理、历史 |
| 车辆作业 | `vehicleWork*.vue` | 车辆作业、作业监控、作业记录 |
| 设备管理 | `equipment*.vue` | 电子锁、RFID 卡、设备绑定 |
| 仓储业务 | `wmsStorehouse/`、`storeHouseSale*.vue` | 仓储费用、库房出售 |
| 工作合同 | `workContract/`、`supplierWmsWorkContractManage.vue` | 供应商作业合同 |
| 其他 | `bankManage.vue` | 银行账户管理 |

## 3. 核心页面清单

### 3.1 外协车辆与司机

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `vehicle/vehicleInfo.vue` | 车辆信息（新增/编辑，OCR 行驶证） | `resVehicleInfoTF.queryVehicleInfoById`、`resVehicleInfoTF.saveVehicleInfo`、`resVehicleInfoTF.getVehicleLicenseInfo` |
| `vehicleManage.vue` | 车辆管理列表（同步/停用/GPS绑定） | `resVehicleInfoTF.queryVehicleInfoListByCond`、`resVehicleInfoTF.syncVehicleInfo`、`resVehicleInfoTF.updateVehicleState`、`equipmentTF.saveVehicleEquipment` |
| `driverInfo.vue` | 司机信息（OCR 身份证/驾驶证） | `driverTF.getIdCardOcrData`、`driverTF.getDrivingLicenseOcrData`、`driverTF.saveDriverProcess` |
| `driverManage.vue` | 司机管理列表（同步/状态/密码） | `driverTF.queryDriverInfoList`、`driverTF.syncDriver`、`driverTF.updateDriverState`、`driverTF.getDriverPassword` |

### 3.2 自有车管理（ownVehicle）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `ownVehicle/ownVehicleManage.vue` | 自有车辆管理（设备绑定） | `resVehicleInfoTF.queryOwnVehicleInfoListByCond`、`resVehicleInfoTF.updateVehicleState`、`equipmentTF.saveVehicleEquipment` |
| `ownVehicle/ownVehicleInfo.vue` | 自有车辆信息（证件 OCR） | `resVehicleInfoTF.queryVehicleInfoById`、`resVehicleInfoTF.saveVehicleInfo`、`resVehicleInfoTF.getRoadTransportCertificate` |
| `ownVehicle/ownVehicleRecord.vue` | 车辆档案 | `resVehicleInfoTF.loadVehicleInfoById` |
| `ownVehicle/ownVehicleMileage.vue` | 车辆里程管理 | `vehicleMileageService.queryVehicleMileagePage`、`vehicleMileageService.updateVehicleMileageInfo` |
| `ownVehicle/ownDriverManage.vue` | 自有司机管理 | `driverTF.queryOwnDriverInfoList`、`driverTF.resignForDriver`、`driverTF.delDriver` |
| `ownVehicle/ownDriverInfo.vue` | 自有司机信息 | `driverTF.loadDriverByIdCard`、`driverTF.saveDriverProcess` |
| `ownVehicle/ownTrailerManage.vue` | 挂车管理 | `resVehicleInfoTF.queryOwnVehicleInfoListByCond`、`resVehicleInfoTF.updateVehicleState` |
| `ownVehicle/supercargoManage.vue` | 押运员管理 | `supercargoService.querySupercargoPage`、`supercargoService.resignForSupercargo` |
| `ownVehicle/driverAssessmentManage.vue` | 司机考核 | `driverAssessmentService.queryDriverAssessmentPage`、`driverAssessmentService.saveOrUpdateDriverAssessment` |
| `ownVehicle/ownVehicleStatistics.vue` | 自有车统计（收益/疲劳驾驶/离线） | `vehicleBenefitAccountingService.getOwnVehicleStatisticInfo`、`vehicleMileageService.loadVehicleMileageSumData` |

### 3.3 自有车成本（ownVehicleCost）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `ownVehicleCost/vehicleRepairCostManage.vue` | 车辆维修费管理 | `vehicleRepairCostService.queryVehicleRepairCostPage`、`vehicleRepairCostService.recognizeReceiptNumber` |
| `ownVehicleCost/vehicleRepairCostInfo.vue` | 维修费登记（发票识别） | `vehicleRepairCostService.saveOrUpdateVehicleRepairCost`、`vehicleRepairCostService.verifyVehicleRepairCostById` |
| `ownVehicleCost/vehicleAnnualInspectionManage.vue` | 车辆年检管理 | `vehicleAnnualInspectionTF.queryVehicleAnnualInspectionPage` |
| `ownVehicleCost/vehicleFixedCostManage.vue` | 固定成本管理 | `vehicleFixedCostService.queryVehicleFixedCostPage`、`vehicleFixedCostService.verifyVehicleFixedCostById` |
| `ownVehicleCost/vehicleWaybillCostManage.vue` | 运单成本管理 | `vehicleWaybillCostService.queryVehicleWaybillCostPage`、`vehicleWaybillCostService.verifyVehicleWaybillCostById` |
| `ownVehicleCost/staffCostManage.vue` | 人员成本管理 | `fcPersonnelCostTF.queryFcPersonnelCostPage`、`fcPersonnelCostTF.saveFcPersonnelCostInfo` |
| `ownVehicleCost/ownVehicleBenefitAccounting.vue` | 车辆效益核算 | `vehicleBenefitAccountingService.queryVehicleBenefitAccountingPage` |
| `ownVehicleCost/ownVehicleBenefitAccountingPrint.vue` | 效益核算打印 | `vehicleBenefitAccountingService.getOwnVehicleBenefitAccountingInfo` |

### 3.4 报价（quote）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `quote/quoteManageLD.vue` | 零担报价（LD）管理 | `quoteLDNewTF.queryLDQuoteData`、`quoteLDNewTF.delQuoteInfo` |
| `quote/quoteManageVerifyLD.vue` | 零担报价审核 | `quoteLDNewTF.verifyQuote` |
| `quote/addQuoteInfoLD.vue` | 新增零担报价 | `quoteLDNewTF.queryQuoteInfoById`、`workGoodsTF.addWorkInfo`、`workGoodsTF.checkWorkDistance` |
| `quote/upQuoteInfoLD.vue` | 编辑零担报价 | `quoteLDNewTF.upQuoteInfo` |
| `quote/supplierZCQuoteManage.vue` | 整车报价（ZC）管理 | `ZCQuoteNewTF.queryQuote`、`ZCQuoteNewTF.updateQuoteExpireDate` |
| `quote/supplierZCQuoteVerify.vue` | 整车报价审核 | `ZCQuoteNewTF.verifyQuote` |
| `quote/addSupplierZCQuote.vue` | 新增整车报价 | `ZCQuoteNewTF.saveCmSectionQuoteData`、`contractService.queryStorageEquipmentContractList` |
| `quote/addSupplierWMSQuote.vue` | 新增仓储报价 | `quoteService.saveCmSectionQuoteBase` |
| `quote/supplierWMSQuoteManage.vue` | 仓储报价管理 | `quoteService.queryWmsQuotePage`、`quoteService.verifyWmsQuote` |

### 3.5 分段报价（sectionQuote，招投标）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `sectionQuote/sectionQuoteManage.vue` | 分段报价管理（删除/投标数） | `sectionQuoteService.querySectionQuotePage`、`sectionQuoteService.queryBidCountBySectionQuoteId` |
| `sectionQuote/addSectionQuote.vue` | 新增分段报价 | `sectionQuoteService.saveOrUpdateSectionQuote` |
| `sectionQuote/batchSectionQuote.vue` | 批量生成分段报价 | `sectionQuoteService.batchSectionQuote` |
| `sectionQuote/generateSectionQuote.vue` | 生成供应商报价 | `sectionQuoteService.generateSupplierQuote` |
| `sectionQuote/sectionQuoteDetail.vue` | 分段报价详情（发起审核/审核） | `sectionQuoteService.initiateAudit`、`sectionQuoteService.audit` |

### 3.6 车辆监控（vehicleMonitor）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `vehicleMonitor.vue` | 车辆监控（列表+地图） | `monitorTF.vehicleMonitor` |
| `vehicleMonitorSaaS.vue` | 车辆监控大屏（SaaS） | `monitorTF.vehicleMonitorSaaS` |
| `vehicleMonitorPosition.vue` | 车辆位置监控 | `monitorTF.vehicleMonitor` |
| `vehicleMonitorTrack.vue` | 车辆轨迹 | `monitorTF.getAllGpsInfoList` |
| `vehicleNoGpsManage.vue` | 无 GPS 车辆管理 | `resVehicleInfoTF.queryVehicleNoGpsInfoList` |
| `vehiclePositionManage.vue` | 车辆位置查询 | `sinoiovBusinessTF.queryVehiclePositionPage` |

### 3.7 车辆调度计划与作业

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `vehicleScheduleManage.vue` | 车辆调度计划管理 | `vehicleScheduleService.queryVehicleSchedulePage`、`vehicleScheduleService.queryVehicleScheduleData` |
| `vehicleScheduleHistoryManage.vue` | 调度计划历史 | `vehicleScheduleService.queryVehicleSchedulePage` |
| `vehicleWorkManage.vue` | 车辆作业管理 | `vehicleWorkService.queryVehicleWorkPage`、`vehicleWorkService.saveOrUpdateVehicleWork` |
| `vehicleWorkMonitor.vue` | 作业监控 | `vehicleWorkService.loadVehicleWorkRecordInfoById` |
| `vehicleWorkRecordManage.vue` | 作业记录 | `vehicleWorkService.queryVehicleWorkRecordPage` |

### 3.8 设备（equipment）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `equipmentInfoManage.vue` | 设备管理（电子锁/RFID卡/远程开锁） | `equipmentTF.queryEquipmentData`、`equipmentTF.remoteOpenLockByEquipmentNumber`、`equipmentTF.remoteOpenSubLockByLockId`、`equipmentTF.checkOpenLockStateByEquipmentNumber`、`JT70TF.qryRfidCard` |
| `equipment/storeEquipmentManage.vue` | 仓储设备采购管理 | `wmsEquipmentPurchaseService.queryWmsEquipmentPurchasePage` |
| `equipment/storeEquipmentInfo.vue` | 仓储设备采购信息 | `wmsEquipmentPurchaseService.saveOrUpdateWmsEquipmentPurchase` |

### 3.9 仓储业务与合同

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `wmsStorehouse/wmsStoreHouseFeeManage.vue` | 仓储费用管理 | `wmsStorehouseTF.queryStorehouseFeePage`、`wmsStorehouseTF.delStorehouseFee` |
| `wmsStorehouse/saveStorehouseFee.vue` | 仓储费用生成 | `wmsStorehouseTF.saveStorehouseFee`、`wmsStorehouseTF.autoGenerateStorehouseFeeDetails` |
| `wmsStorehouse/wmsStoreHouseFeeDetailManage.vue` | 仓储费用明细 | `wmsStorehouseTF.queryStorehouseFeeDetailPage` |
| `storeHouseSaleManage.vue` | 库房出售管理（续期/作废） | `storeHouseBizTF.queryCmStoreHouseSaleRelPage`、`storeHouseBizTF.renewal`、`storeHouseBizTF.updateStateToInvalid` |
| `workContract/workContractInfo.vue` | 工作合同（供应商作业合同） | `workContractService.loadWorkContractById`、`workContractService.saveOrUpdateWorkContract` |
| `supplierWmsWorkContractManage.vue` | 仓储作业合同管理（审核） | `workContractService.queryWorkContractPage`、`workContractService.verifyWorkContractById` |
| `bankManage.vue` | 银行账户管理 | `bankTF.queryBankManageData`、`bankTF.saveBankInfo`、`bankTF.cancleBankInfo` |

## 4. 核心接口速查

| BeanName | 主要方法 | 用途 |
|----------|---------|------|
| `resVehicleInfoTF` | queryVehicleInfoListByCond / queryOwnVehicleInfoListByCond / saveVehicleInfo / updateVehicleState / syncVehicleInfo / getVehicleLicenseInfo / getRoadTransportCertificate / queryVehicleNoGpsInfoList / queryAllVehicleNoPage | 车辆资源全生命周期 |
| `driverTF` | queryDriverInfoList / queryOwnDriverInfoList / saveDriverProcess / updateDriverState / syncDriver / resignForDriver / getIdCardOcrData / getDrivingLicenseOcrData | 司机资源 |
| `quoteLDNewTF` | queryLDQuoteData / verifyQuote / upQuoteInfo / delQuoteInfo / queryQuoteInfoById | 零担报价 |
| `ZCQuoteNewTF` | queryQuote / verifyQuote / saveCmSectionQuoteData / loadQuoteDataByQuoteId / deleteQuoteByQuoteId / updateQuoteExpireDate | 整车报价 |
| `quoteService` | queryWmsQuotePage / verifyWmsQuote / saveCmSectionQuoteBase / loadWmsQuoteDataByQuoteId | 仓储报价 |
| `sectionQuoteService` | querySectionQuotePage / saveOrUpdateSectionQuote / batchSectionQuote / generateSupplierQuote / initiateAudit / audit / queryBidCountBySectionQuoteId | 分段报价招投标 |
| `monitorTF` | vehicleMonitor / vehicleMonitorSaaS / getAllGpsInfoList | 车辆监控 |
| `vehicleScheduleService` | queryVehicleSchedulePage / queryVehicleScheduleData | 调度计划 |
| `vehicleWorkService` | queryVehicleWorkPage / saveOrUpdateVehicleWork / queryVehicleWorkRecordPage / loadVehicleWorkRecordInfoById | 车辆作业 |
| `equipmentTF` | queryEquipmentData / remoteOpenLockByEquipmentNumber / remoteOpenSubLockByLockId / saveVehicleEquipment / queryVehicleEquipment / bandEquipment / sellEquipment | 电子锁与设备 |
| `vehicleBenefitAccountingService` | queryVehicleBenefitAccountingPage / getOwnVehicleStatisticInfo / getOwnVehicleBenefitAccountingInfo | 效益核算 |
| `vehicleRepairCostService` / `vehicleFixedCostService` / `vehicleWaybillCostService` | 各类成本查询/保存/审核 | 自有车成本 |
| `workContractService` | queryWorkContractPage / loadWorkContractById / saveOrUpdateWorkContract / verifyWorkContractById | 作业合同 |
| `wmsStorehouseTF` | queryStorehouseFeePage / saveStorehouseFee / autoGenerateStorehouseFeeDetails | 仓储费用 |
| `storeHouseBizTF` | queryCmStoreHouseSaleRelPage / renewal / updateStateToInvalid / queryStoreHouseList | 库房出售 |

## 5. 业务流程说明

### 5.1 运力报价流程

```
外协报价：
  新增零担报价（addQuoteInfoLD：录入线路/货物/报价明细）
    → 报价管理（quoteManageLD）→ 审核（quoteManageVerifyLD：verifyQuote）
    → 报价生效，供订单调度匹配
整车报价：ZCQuote 同流程；仓储报价：supplierWMSQuoteManage
分段报价（招投标）：
  新增分段报价（addSectionQuote）→ 批量生成（batchSectionQuote）
    → 供应商报价（generateSectionQuote）→ 发起审核（initiateAudit）→ 审核（audit）
```

### 5.2 车辆资源管理流程

```
外协车辆：车辆信息登记（OCR 证件）→ 车辆管理（同步/停用/GPS 绑定）
自有车：车辆/司机/挂车/押运员档案 → 里程管理 → 作业调度 → 成本归集
  （维修费/年检/固定成本/运单成本/人员成本）→ 效益核算（ownVehicleBenefitAccounting）
```

### 5.3 车辆监控调度

```
车辆监控（vehicleMonitor：GPS 实时位置）→ 车辆调度计划（vehicleScheduleManage）
  → 车辆作业（vehicleWorkManage）→ 作业监控（vehicleWorkMonitor）
```

---

> 相关接口完整清单见 [api-00-接口清单.md](./api-00-接口清单.md) 的 `pt/res` 分组。
