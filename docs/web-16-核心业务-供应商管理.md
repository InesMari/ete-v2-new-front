# 核心业务 — 供应商管理

> **关联文档**：

| 关联文档 | 关联说明 |
|----------|---------|
| [web-00-项目总览.md](./web-00-项目总览.md) | 业务全景 |
| [web-05-核心业务-订单管理.md](./web-05-核心业务-订单管理.md) | 运单供应商 |
| [web-08-核心业务-资源管理.md](./web-08-核心业务-资源管理.md) | 外协车辆/司机 |
| [api-00-接口清单.md](./api-00-接口清单.md) | 接口事实源（`pt/sp` 分组） |

## 1. 业务概述

**供应商管理**（`src/page/pt/sp`）是平台的供应商关系管理域（约 **12 个 .vue 页面**），管理承运商/仓储供应商：

```
供应商建档（OCR 营业执照）→ 审核 → 供应商信息管理（工作点/车辆/司机）
   → 供应商经营详情（运输/仓储数据与图表）→ 状态管理（启用/停用）
```

- 核心服务标识（BeanName）：`supplierTF`、`workGoodsTF`、`storeHouseBizTF`、`workOrderService`、`selectStaticDataTF`、`userTF`

## 2. 模块划分

| 子模块 | 说明 |
|--------|------|
| 供应商管理 | `supplierManage.vue`：供应商列表（停用/详情/新增/编辑） |
| 供应商信息 | `addSupplier.vue` / `updateSupplier.vue` / `showSupplier.vue`：建档、审核、查看 |
| 供应商详情 | `supplierDetail*.vue`：供应商运输经营数据 |
| 仓储供应商 | `storehouseSupplier*.vue`：仓储供应商经营数据（工单费用图表） |
| 供应商车辆/司机 | `subpage/supplierVehicle.vue` / `supplierDriver.vue`：绑定关系 |
| 供应商工作点 | `supplierAddressManage.vue`：收货/发货地址 |

## 3. 核心页面清单

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `supplierManage.vue` | 供应商列表（停用/启用） | `supplierTF.querySupplierList`、`supplierTF.updateSupplierState` |
| `addSupplier.vue` | 新增供应商（营业执照 OCR） | `supplierTF.getBusinessLicenseInfo`、`supplierTF.saveSupplierInfo` |
| `updateSupplier.vue` | 编辑供应商（审核） | `supplierTF.getSupplierDetailInfo`、`supplierTF.verifySupplier` |
| `showSupplier.vue` | 查看供应商 | `supplierTF.getSupplierDetailInfo` |
| `supplierDetail.vue` | 供应商经营详情（运输） | `supplierTF.loadSupplierDataByTenantId`、`supplierTF.loadSupplierSpecifyDayDataByTenantId` |
| `supplierDetailMain.vue` | 供应商详情主框架 | - |
| `storehouseSupplierManage.vue` | 仓储供应商管理（停用） | `supplierTF.querySupplierList`、`supplierTF.updateSupplierDataById` |
| `storehouseSupplierDetail.vue` | 仓储供应商详情（工单费用图表） | `supplierTF.loadStorehouseSupplierDataByTenantId`、`workOrderService.loadRecentHalfAYearWorkOrderBarData`、`workOrderService.loadRecentHalfAYearWorkOrderFeeItemTypeLineData`、`workOrderService.loadRecentHalfAYearWorkOrderFeeLineData`、`workOrderService.loadRecentHalfAYearWorkOrderPieData` |
| `subpage/supplierVehicle.vue` | 供应商车辆绑定 | `supplierTF.querySupplierVehicleInfoListByCond`、`supplierTF.queryVehicleInfoListNoRelByCond`、`supplierTF.addSupplierVehicleRel`、`supplierTF.delSupplierVehicleRel` |
| `subpage/supplierDriver.vue` | 供应商司机绑定 | `supplierTF.querySupplierDriverInfoListByCond`、`supplierTF.queryDriverInfoListNoRelByCond`、`supplierTF.addSupplierDriverRel`、`supplierTF.delSupplierDriverRel` |
| `supplierAddressManage.vue` | 供应商工作点（地址维护） | `supplierTF.queryAllSupplierList`、`workGoodsTF.queryAllSupplierWorkData`、`workGoodsTF.addWorkInfo`、`workGoodsTF.delWorkInfo`、`selectStaticDataTF.selectCity` |

## 4. 核心接口速查

| BeanName | 主要方法 | 用途 |
|----------|---------|------|
| `supplierTF` | querySupplierList / queryAllSupplierList / getSupplierDetailInfo / saveSupplierInfo / verifySupplier / updateSupplierState / updateSupplierDataById / loadSupplierDataByTenantId / loadSupplierSpecifyDayDataByTenantId / loadStorehouseSupplierDataByTenantId / loadStorehouseSupplierSpecifyDayDataByTenantId / querySupplierVehicleInfoListByCond / querySupplierDriverInfoListByCond / queryVehicleInfoListNoRelByCond / queryDriverInfoListNoRelByCond / addSupplierVehicleRel / addSupplierDriverRel / delSupplierVehicleRel / delSupplierDriverRel / queryInvoiceFlgSupplier / getBusinessLicenseInfo | 供应商全生命周期 |
| `workGoodsTF` | queryAllSupplierWorkData / addWorkInfo / delWorkInfo | 供应商工作点 |
| `workOrderService` | loadRecentHalfAYearWorkOrderBarData / loadRecentHalfAYearWorkOrderFeeItemTypeLineData / loadRecentHalfAYearWorkOrderFeeLineData / loadRecentHalfAYearWorkOrderPieData | 仓储供应商经营图表 |

## 5. 业务流程说明

### 5.1 供应商准入流程

```
新增供应商（addSupplier：OCR 营业执照）→ 供应商列表管理（supplierManage）
   → 审核（updateSupplier：verifySupplier）→ 启用/停用（updateSupplierState）
   → 维护供应商车辆/司机绑定（supplierVehicle/supplierDriver）
   → 维护供应商工作点（supplierAddressManage）
```

### 5.2 供应商经营监控

```
运输供应商：supplierDetail（近 N 日运输数据）
仓储供应商：storehouseSupplierDetail（近半年工单费用柱状/折线/饼图分析）
```

---

> 相关接口完整清单见 [api-00-接口清单.md](./api-00-接口清单.md) 的 `pt/sp` 分组。
