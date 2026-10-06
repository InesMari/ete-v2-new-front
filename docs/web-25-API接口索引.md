# 辅助模块 — API 接口索引

> 本文档是 EDB 前端全部后端接口调用的**索引视图**：按端（pt/hz/edu/wx/sh/demo）与业务域汇总，说明接口分布、统计与常用服务。完整明细（每个接口的 beanName/methodName/引用文件）见 [api-00-接口清单](api-00-接口清单.md)（唯一事实源）。

## 关联文档

| 文档 | 说明 |
|------|------|
| [api-00-接口清单](api-00-接口清单.md) | 唯一事实源：全部接口明细（脚本生成） |
| [web-01-开发规范](web-01-开发规范.md) | postUrl 调用规范 |
| [web-00-项目总览](web-00-项目总览.md) | 多租户架构 |

## 一、接口提取方式

### 1.1 扫描规则

- 扫描范围：`src/` 下全部 `.js` / `.vue` 文件
- 匹配模式：`common.postUrl("beanName","methodName", ...)` 与 `$refs.xxx.load("beanName","methodName", ...)`
- 按 `src/page/<端>/<业务域>/` 路径归类，同 bean+method 去重
- 输出：`docs/api-00-接口清单.md`（脚本 `docs/tools/extract-api.js` 生成）

### 1.2 重新生成

```powershell
node docs/tools/extract-api.js
```

> 脚本零依赖、可在任意环境直接运行；对变量拼接的调用（如 `postUrl(url, ...)`）无法静态解析，会归入清单末尾「动态调用（需人工核对）」列表。

## 二、接口总量统计

| 维度 | 数量 |
|------|------|
| 扫描文件数 | 1780 |
| 接口调用（去重后） | 1764 |
| 业务分组数 | 122 |
| 动态调用（需人工核对） | 18 处 |

## 三、按端分布

| 端 | 分组数 | 接口数（去重） | 说明 |
|----|--------|----------------|------|
| pt 平台端 | 21 | 1585 | 核心业务，含 ord/fc/wms/res 四个大域 |
| hz 货主端 | 11 | 62 | 货主视角的订单/仓储/财务简化接口 |
| edu 易迁易大学 | 4 | 56 | 课程/考试/图书/班级 |
| wx 微信端 | 1 | 4 | 二维码下单 |
| sh 试运行端 | 1 | 7 | 基础配置 |
| demo 示例页 | 42 | 14 | 多为演示页面，少数调用真实接口 |
| components 公共组件 | 40 | 32 | 组件内部调用（auth/dbTable/mycity/myImport/table 等） |
| utils 工具函数 | 1 | 4 | common.js 下载/文件工具 |

## 四、pt 平台端业务域接口分布

| 业务域 | 接口数 | 主要服务 beanName |
|--------|--------|-------------------|
| base 基础数据 | 61 | `commonTF`、`permissionService`、`menuTF`、`entityTF`、`hcQuestionTF` |
| biz 业务协同 | 42 | `orderTF`、`orderCdtRegionServiceImpl`、`wmsTF` |
| cm 客户管理 | 105 | `customerTF`、`regionOrgTF`、`commonTF` |
| dataReport 数据报表 | 78 | `rptTF`、`orderTF`、`kanbanTF` |
| device 设备管理 | 51 | `deviceBaseService`、`resMonitorDeviceTF`、`sensorTF` |
| exc 异常处理 | 10 | `orderTF`、`commonTF` |
| fc 财务管理 | 303 | `fc*TF`、`incomeTF`、`expenseTF`、`invoiceTF`、`customerTF` |
| home 主框架 | 27 | `userTF`、`menuTF`、`todoTF` |
| hr 人力资源 | 20 | `regionOrgTF`、`staffTF`、`userTF` |
| login 登录 | 3 | `userTF` |
| ord 订单管理 | 155 | `orderTF`、`ordDispatchTF`、`ordWaybillTF`、`incomeTF`、`driverTF` |
| pkg 包裹管理 | 37 | `pkgTF`、`orderTF`、`wmsTF` |
| proj 项目管理 | 42 | `projTF`、`supplierTF`、`orderTF` |
| purchase 采购管理 | 90 | `purchaseTF`、`supplierTF`、`assetTF` |
| res 资源管理 | 202 | `resVehicleInfoTF`、`driverTF`、`resMonitorDeviceTF`、`monitorTF` |
| rpt 报表中心 | 21 | `rptTF`、`orderTF` |
| sp 供应商管理 | 35 | `supplierTF`、`customerTF`、`commonTF` |
| wms 仓储管理 | 303 | `wms*TF`、`deviceRecordService`、`sensorTF`、`resMonitorDeviceTF` |

## 五、hz 货主端业务域接口分布

| 业务域 | 接口数 | 主要服务 beanName |
|--------|--------|-------------------|
| base 基础数据 | 7 | `commonTF`、`menuTF` |
| baseInfo 基础资料 | 1 | `customerTF` |
| bigScreen 看板 | 4 | `kanbanTF`、`workGoodsTF`、`commonTF` |
| fc 财务管理 | 5 | `fcCustBillTF`、`customerTF` |
| home 主框架 | 6 | `userTF`、`menuTF` |
| login 登录 | 4 | `userTF` |
| ord 订单 | 10 | `orderTF`、`receiptsTF`、`ordWaybillTF` |
| pkg 包裹 | 3 | `pkgTF` |
| res 资源 | 1 | `driverTF` |
| subCompany 子公司 | 6 | `customerTF`、`routeTF` |
| wms 仓储 | 15 | `wmsMaterialPickTF`、`wmsCustAppointTF`、`wmsInOrderTF`、`wmsOutOrderTF`、`sensorTF` |

## 六、edu / wx / sh 接口分布

| 端 | 业务域 | 接口数 | 主要服务 |
|----|--------|--------|----------|
| edu | admin 管理端 | 36 | `eduCourseService`、`eduUserService`、`eduBookService`、`eduHomeService`、`eduTestService` |
| edu | login 登录 | 5 | `userTF`、`eduUserService` |
| edu | main 门户 | 5 | `eduHomeService`、`eduCourseService`、`eduBookService` |
| edu | student 学员端 | 10 | `eduCourseService`、`eduTestService`、`eduUserService` |
| wx | order 下单 | 4 | `orderService`、`commonTF` |
| sh | base 基础 | 7 | `commonTF`、`menuTF` |

## 七、高频公共服务 TOP 10

| beanName | 用途 | 出现分组数 |
|----------|------|-----------|
| `commonTF` | 静态字典（getSysStaticData）、地址拆分（getSplitAddress）、日期校验等 | 20+ |
| `orderTF` | 订单 CRUD、货主单查询、消息 | 15+ |
| `customerTF` | 客户查询/详情 | 15+ |
| `userTF` | 登录/登出/密码/用户角色 | 12+ |
| `menuTF` | 菜单树加载 | 8+ |
| `regionOrgTF` | 组织/岗位/人员数据 | 8+ |
| `fileCommonTF` | 文件上传/删除/预览 token | 6+ |
| `wmsBaseTF` / `wms*TF` | 仓储基础/出入库/预约/盘点 | 6+ |
| `resMonitorDeviceTF` | 监控设备/视频流 | 5+ |
| `driverTF` / `resVehicleInfoTF` | 司机/车辆数据 | 5+ |

## 八、接口命名约定

| 命名特征 | 含义 | 示例 |
|----------|------|------|
| `query*Page` | 分页查询 | `queryCustomerPage` |
| `query*List` / `query*Data` | 列表/下拉数据 | `queryCustomerListNoPage` |
| `load*` | 加载详情/数据（常配合回填） | `loadOrderMessagePageHZ` |
| `saveOrUpdate*` | 新增或编辑（通用保存） | `saveOrUpdateOrder` |
| `del*` / `delete*` | 删除 | `deleteDictionaryDataById` |
| `*ForCust` / `*HZ` | 货主端专用变体 | `queryConsignorOrderInfoList` |
| `*ForScreen` | 大屏数据接口 | `queryPrepDispatchOrderListForScreen` |
| `*SaaS` | SaaS 多租户变体 | `vehicleMonitorSaaS` |
| `check*` / `verify*` | 校验 | `checkQRCodeID`、`verifyPass` |

## 九、注意事项

1. **以 api-00 为事实源**：本文档的分布统计由脚本汇总，若源码变更，重新运行脚本并核对本表数字。
2. **大屏接口**：`*ForScreen` / `query*KanbanPage` 系列服务于大屏展示，多返回聚合/图表数据，业务接口勿混淆。
3. **动态调用需人工核对**：清单末尾列出了 `postUrl(url, ...)` 等变量拼接调用（共 18 处），涉及新接口变更时务必检查这些调用点。
4. **组件接口集中在 components 分组**：`dbTable`、`table`、`searchList` 的列头/搜索配置、`mycity` 省市区、`myTab` 菜单标签、`officeViewer` 文件 token 等组件级接口，改动公共组件时留意影响面。
