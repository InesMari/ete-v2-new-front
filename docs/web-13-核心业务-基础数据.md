# 核心业务 — 基础数据

> **关联文档**：

| 关联文档 | 关联说明 |
|----------|---------|
| [web-00-项目总览.md](./web-00-项目总览.md) | 业务全景 |
| [web-01-开发规范.md](./web-01-开发规范.md) | v-entity 权限指令 |
| [web-18-核心业务-人力资源.md](./web-18-核心业务-人力资源.md) | 员工组织 |
| [api-00-接口清单.md](./api-00-接口清单.md) | 接口事实源（`pt/base` 分组） |

## 1. 业务概述

**基础数据**（`src/page/pt/base`）是平台的系统支撑域（约 **18 个 .vue 页面**），提供权限、字典、组织、缓存、帮助等平台级基础能力：

```
权限体系：角色管理 → 实体按钮授权 → 权限项 → 员工绑定权限
组织体系：区域组织（树）→ 岗位 → 员工 → 人员变动
系统基础：数据字典、缓存刷新、帮助中心（QA）、股东管理
```

- 核心服务标识（BeanName）：`roleTF`、`entityTF`、`permissionService`、`regionOrgTF`、`staffTF`、`positionService`、`commonTF`、`cacheRefreshTF`、`hcQuestionTF`、`shShareholderTF`、`menuTF`、`userTF`

## 2. 模块划分

| 子模块 | 目录 | 说明 |
|--------|------|------|
| 角色管理 | `auth/role/` | 角色维护、角色-实体关系、实体对比、树对比 |
| 权限管理 | `auth/permission/` | 权限项、权限管理（绑定用户） |
| 实体按钮 | `auth/entityButton/` | 实体按钮授权（v-entity 数据源） |
| 区域组织 | `usr/regionOrg/` | 区域组织树、人员变动 |
| 岗位 | `usr/position/` | 岗位管理 |
| 员工 | `usr/staff/` | 员工管理（启用/停用/删除/踢下线） |
| 数据字典 | `dictionary/` | 字典项维护、费用变更开关 |
| 缓存 | `cache/` | 缓存刷新（单条/全部） |
| 帮助中心 | `hc/qa/` | 问题发布与解答 |
| 股东 | `sh/` | 股东信息管理 |

## 3. 核心页面清单

### 3.1 角色与权限（auth）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `auth/role/roleManage.vue` | 角色管理（删除） | `roleTF.loadRoleInfoList`、`roleTF.loadRoleInfoListNoPage`、`roleTF.deleteRoleInfo` |
| `auth/role/addRoleEntity.vue` | 角色-实体授权 | `entityTF.loadEntityTree`、`roleTF.commonSaveRoleOrEntity` |
| `auth/role/entityCompare.vue` | 实体对比 | `entityTF.loadEntityTree`、`roleTF.commonSaveRoleOrEntity` |
| `auth/role/treeCompare.vue` | 树对比 | - |
| `auth/permission/permissionManage.vue` | 权限管理（绑定用户/删除） | `permissionService.loadPermissionPage`、`permissionService.bindUserPermissionById`、`permissionService.deletePermissionById` |
| `auth/permission/permissionInfo.vue` | 权限项维护（菜单/操作） | `permissionService.loadPermissionById`、`permissionService.saveOrUpdatePermission`、`menuTF.queryAuthMenuList` |
| `auth/entityButton/entityButton.vue` | 实体按钮授权 | `entityTF.loadEntityTreeNew`、`roleTF.loadCurrentEntityIdAllRoleList`、`roleTF.saveRoleEntityRel` |

### 3.2 组织与人员（usr）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `usr/regionOrg/regionOrgManage.vue` | 区域组织管理（增删改/人员） | `regionOrgTF.getOrgTreeList`、`regionOrgTF.queryOrgData`、`regionOrgTF.addOrgInfo`、`regionOrgTF.upOrgInfo`、`regionOrgTF.delRegionInfo`、`regionOrgTF.addStaffInfo`、`regionOrgTF.queryStaffData` |
| `usr/regionOrg/changeRegionOrg.vue` | 人员调动组织 | `regionOrgTF.queryOrgData`、`regionOrgTF.queryRegionSelect`、`customerTF.queryCustomerListNoPage` |
| `usr/position/positionManage.vue` | 岗位管理 | `positionService.queryPositionPage`、`positionService.saveOrUpdatePosition`、`positionService.deletePosition`、`positionService.loadPositionStaff` |
| `usr/staff/staffManage.vue` | 员工管理（启用/停用/删除/踢下线/密码） | `staffTF.queryStaffs`、`staffTF.getStaff`、`staffTF.changeUserSts`、`staffTF.delStaff`、`userTF.kickAllUserEnds` |

### 3.3 系统基础

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `dictionary/dictionaryManage.vue` | 数据字典管理 | `commonTF.loadSysStaticDataGroupByCodeType`、`commonTF.queryDictionaryDataPage`、`commonTF.saveOrUpdateDictionary`、`commonTF.deleteDictionaryDataById`、`commonTF.getFeeChangeSwitch`、`commonTF.switchFeeChange` |
| `cache/cacheRefresh.vue` | 缓存刷新 | `cacheRefreshTF.queryAllRefreshCaches`、`cacheRefreshTF.refreshCache`、`cacheRefreshTF.refreshAllCaches` |
| `hc/qa/questionManage.vue` | 问题管理（删除） | `hcQuestionTF.queryQuestionInfoPage`、`hcQuestionTF.delQuestionInfo` |
| `hc/qa/addQuestion.vue` | 新增/编辑问题 | `hcQuestionTF.getQuestionInfoDetail`、`hcQuestionTF.saveQuestionInfo` |
| `hc/qa/questionDetail.vue` | 问题详情（外链直达） | `hcQuestionTF.getQuestionInfoDetail` |
| `sh/shareholderManage.vue` | 股东管理（停用/删除） | `shShareholderTF.queryShareholderInfoPage`、`shShareholderTF.updateShareholderState`、`shShareholderTF.delShareholderInfo` |
| `sh/addShareholder.vue` | 新增股东 | `shShareholderTF.getShareholderDetailInfo`、`shShareholderTF.saveShareholderInfo` |

## 4. 核心接口速查

| BeanName | 主要方法 | 用途 |
|----------|---------|------|
| `roleTF` | loadRoleInfoList / loadRoleInfoListNoPage / deleteRoleInfo / commonSaveRoleOrEntity / loadCurrentEntityIdAllRoleList / saveRoleEntityRel / loadRoleInfoListNoAdmin | 角色与授权 |
| `entityTF` | loadEntityTree / loadEntityTreeNew | 实体树 |
| `permissionService` | loadPermissionPage / loadPermissionById / saveOrUpdatePermission / bindUserPermissionById / deletePermissionById / loadPermissionList | 权限项 |
| `regionOrgTF` | getOrgTreeList / queryOrgData / addOrgInfo / upOrgInfo / delRegionInfo / addStaffInfo / queryStaffData / queryRegionSelect / queryAllRegionOrgs / getOrgInfoList / bidRelSubsidiary | 区域组织与人员 |
| `staffTF` | queryStaffs / getStaff / changeUserSts / delStaff / getStaffDetail / getStaffUser | 员工 |
| `positionService` | queryPositionPage / saveOrUpdatePosition / deletePosition / loadPositionStaff / queryPositionList | 岗位 |
| `commonTF` | loadSysStaticDataGroupByCodeType / queryDictionaryDataPage / saveOrUpdateDictionary / deleteDictionaryDataById / getFeeChangeSwitch / switchFeeChange / getSplitAddress / getGrowthNum | 字典与通用 |
| `cacheRefreshTF` | queryAllRefreshCaches / refreshCache / refreshAllCaches | 缓存刷新 |
| `hcQuestionTF` | queryQuestionInfoPage / saveQuestionInfo / getQuestionInfoDetail / delQuestionInfo | 帮助中心 |
| `shShareholderTF` | queryShareholderInfoPage / getShareholderDetailInfo / saveShareholderInfo / updateShareholderState / delShareholderInfo | 股东 |
| `userTF` | kickAllUserEnds / loadCurrentOrgUserList / loadAllUser / getUserName | 用户会话 |

## 5. 业务说明

- **权限数据流**：`v-entity` 指令读取 `localStorage.entityIds` 判断按钮显隐，权限码来源即 `auth/entityButton` 的「实体按钮授权」（`roleTF.saveRoleEntityRel` 保存角色与实体按钮关系）
- **员工绑定权限**：`staffManage` 可对员工绑定特殊权限（`permissionService.bindUserPermissionById`）
- **组织变动**：`changeRegionOrg` 支持员工组织调动；`regionOrgManage` 维护组织树并支持挂靠子公司（`bidRelSubsidiary`）
- **缓存刷新**：后端缓存（如枚举、配置）变更后，可在 `cacheRefresh` 单条或批量刷新，无需重启服务

---

> 相关接口完整清单见 [api-00-接口清单.md](./api-00-接口清单.md) 的 `pt/base` 分组。
