# 核心业务 — 项目管理

> **关联文档**：

| 关联文档 | 关联说明 |
|----------|---------|
| [web-00-项目总览.md](./web-00-项目总览.md) | 业务全景 |
| [web-04-状态管理与路由.md](./web-04-状态管理与路由.md) | 外链直达（viewRequirement） |
| [api-00-接口清单.md](./api-00-接口清单.md) | 接口事实源（`pt/proj` 分组） |

## 1. 业务概述

**项目管理**（`src/page/pt/proj`）是平台的研发项目管理域（约 **11 个 .vue 页面**），支持"需求 → 迭代 → 任务 → Bug"的完整研发流程：

```
需求管理（录入/确认/变更）→ 迭代规划 → 任务拆解/执行
   → Bug 管理（登记/转任务/关闭）→ 全过程操作日志与附件
```

- 核心服务标识（BeanName）：`projRequirementTF`、`projTaskTF`、`projBugTF`、`projIterationTF`、`fileCommonTF`、`userTF`、`customerTF`、`regionOrgTF`

## 2. 模块划分

| 子模块 | 目录 | 说明 |
|--------|------|------|
| 需求管理 | `requirement/` | 需求列表（确认/删除）、新增、详情（附件/日志/任务） |
| 任务管理 | `task/` | 任务列表（删除/转Bug）、新增、详情（附件/日志/Bug） |
| Bug 管理 | `bug/` | Bug 列表（删除/转任务）、新增、详情（附件/日志） |
| 迭代管理 | `iteration/` | 迭代（迭代内需求/任务/Bug） |

## 3. 核心页面清单

### 3.1 需求管理（requirement）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `requirement/requirementManage.vue` | 需求列表（确认/删除/字段更新） | `projRequirementTF.queryRequirementPage`、`projRequirementTF.confirmRequirementInfo`、`projRequirementTF.delRequirementInfo`、`projRequirementTF.updateRequirementInfoByField` |
| `requirement/addRequirement.vue` | 新增需求 | `projRequirementTF.addRequirementInfo`、`projIterationTF.queryProjIterationInfoList`、`customerTF.queryCustomerListNoPage`、`fileCommonTF.doDel` |
| `requirement/requirementDetail.vue` | 需求详情（附件/日志/任务） | `projRequirementTF.getRequirementInfoDetail`、`projRequirementTF.addRequirementFile`、`projRequirementTF.delRequirementFile`、`projRequirementTF.queryLogList`、`projRequirementTF.updateRequirementInfoByField`、`projTaskTF.queryProjTaskInfoPage` |

### 3.2 任务管理（task）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `task/taskManage.vue` | 任务列表（删除/转Bug） | `projTaskTF.queryProjTaskInfoPage`、`projTaskTF.delTaskInfo`、`projTaskTF.transTaskToBug`、`projTaskTF.updateTaskInfoByField` |
| `task/addTask.vue` | 新增任务（关联需求） | `projTaskTF.addProjTaskInfo`、`projRequirementTF.getRequirementInfoDetail`、`projRequirementTF.queryRequirementInfoList` |
| `task/taskDetail.vue` | 任务详情（附件/日志/Bug） | `projTaskTF.getProjTaskInfoDetail`、`projTaskTF.addTaskFile`、`projTaskTF.delTaskFile`、`projTaskTF.queryLogList`、`projTaskTF.updateTaskInfoByField`、`projBugTF.queryProjBugInfoPage` |

### 3.3 Bug 管理（bug）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `bug/bugManage.vue` | Bug 列表（删除/转任务） | `projBugTF.queryProjBugInfoPage`、`projBugTF.delBugInfo`、`projBugTF.transBugToTask`、`projBugTF.updateBugInfoByField` |
| `bug/addBug.vue` | 新增 Bug（关联任务） | `projBugTF.addProjBugInfo`、`projTaskTF.queryTaskInfoList`、`projIterationTF.queryProjIterationInfoList` |
| `bug/bugDetail.vue` | Bug 详情（附件/日志） | `projBugTF.getProjBugInfoDetail`、`projBugTF.addBugFile`、`projBugTF.delBugFile`、`projBugTF.queryLogList` |

### 3.4 迭代管理（iteration）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `iteration/iterationManage.vue` | 迭代管理（迭代内事项） | `projIterationTF.queryProjIterationRelItemInfoPage` |
| `projManageMain.vue` | 项目管理主框架 | - |

## 4. 核心接口速查

| BeanName | 主要方法 | 用途 |
|----------|---------|------|
| `projRequirementTF` | queryRequirementPage / addRequirementInfo / getRequirementInfoDetail / confirmRequirementInfo / updateRequirementInfoByField / delRequirementInfo / addRequirementFile / delRequirementFile / queryRequirementInfoList / queryLogList | 需求 |
| `projTaskTF` | queryProjTaskInfoPage / addProjTaskInfo / getProjTaskInfoDetail / updateTaskInfoByField / delTaskInfo / transTaskToBug / addTaskFile / delTaskFile / queryTaskInfoList / queryLogList | 任务 |
| `projBugTF` | queryProjBugInfoPage / addProjBugInfo / getProjBugInfoDetail / updateBugInfoByField / delBugInfo / transBugToTask / addBugFile / delBugFile / queryBugInfoList / queryLogList | Bug |
| `projIterationTF` | queryProjIterationInfoList / queryProjIterationRelItemInfoPage | 迭代 |
| `fileCommonTF` | doDel（删除临时文件） | 附件 |

## 5. 业务流程说明

### 5.1 研发管理流程

```
需求录入（addRequirement）→ 需求确认（requirementManage：confirmRequirementInfo）
   → 迭代规划（iterationManage）→ 任务拆解（addTask：addProjTaskInfo）
   → 任务执行（taskDetail：状态流转 updateTaskInfoByField）
   → Bug 登记（addBug）→ Bug 转任务（transBugToTask）/ 任务转 Bug（transTaskToBug）
   → 关闭
```

- 需求详情可被外部链接直达（`viewRequirement`，见 [web-04-状态管理与路由.md](./web-04-状态管理与路由.md)）

---

> 相关接口完整清单见 [api-00-接口清单.md](./api-00-接口清单.md) 的 `pt/proj` 分组。
