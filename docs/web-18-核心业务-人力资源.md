# 核心业务 — 人力资源

> **关联文档**：

| 关联文档 | 关联说明 |
|----------|---------|
| [web-00-项目总览.md](./web-00-项目总览.md) | 业务全景 |
| [web-13-核心业务-基础数据.md](./web-13-核心业务-基础数据.md) | 员工/组织/岗位 |
| [api-00-接口清单.md](./api-00-接口清单.md) | 接口事实源（`pt/hr` 分组） |

## 1. 业务概述

**人力资源**（`src/page/pt/hr`）是平台的人力事务域（约 **10 个 .vue 页面**），提供：

```
招聘管理：招聘信息（发布/删除）→ 应聘者管理（状态流转）→ 详情
新闻公告：企业新闻（发布/置顶/删除）→ 详情
管理费用：人事管理费用（月度录入/汇总）→ 密码校验
```

- 核心服务标识（BeanName）：`hrRecruitInfoTF`、`hrNewsTF`、`hrManagementCostTF`

## 2. 模块划分

| 子模块 | 目录 | 说明 |
|--------|------|------|
| 招聘管理 | `recruit/` | 招聘信息、应聘者 |
| 新闻公告 | `news/` | 企业新闻 |
| 管理费用 | `cost/` | 人事管理费用 |

## 3. 核心页面清单

### 3.1 招聘管理（recruit）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `recruit/recruitManage.vue` | 招聘信息管理（发布/删除） | `hrRecruitInfoTF.queryHrRecruitInfoPage`、`hrRecruitInfoTF.publishHrRecruitInfo`、`hrRecruitInfoTF.delHrRecruitInfo` |
| `recruit/addRecruit.vue` | 新增/编辑招聘信息 | `hrRecruitInfoTF.saveHrRecruitInfo`、`hrRecruitInfoTF.queryHrRecruitInfoDetail` |
| `recruit/recruitDetail.vue` | 招聘信息详情 | `hrRecruitInfoTF.queryHrRecruitInfoDetail` |
| `recruit/applicantManage.vue` | 应聘者管理（状态流转） | `hrRecruitInfoTF.queryHrApplicantInfoPage`、`hrRecruitInfoTF.updateHrApplicantInfoState` |
| `recruit/applicantDetail.vue` | 应聘者详情 | `hrRecruitInfoTF.queryHrApplicantInfoDetail` |

### 3.2 新闻公告（news）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `news/newsManage.vue` | 新闻管理（置顶/删除） | `hrNewsTF.queryNewsPage`、`hrNewsTF.setTopFlag`、`hrNewsTF.delNews` |
| `news/addNews.vue` | 新增/编辑新闻 | `hrNewsTF.saveNews`、`hrNewsTF.getNewsDetail` |
| `news/newsDetail.vue` | 新闻详情 | `hrNewsTF.getNewsDetail` |

### 3.3 管理费用（cost）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `cost/hrManagementCostManage.vue` | 管理费用（汇总/删除/密码） | `hrManagementCostTF.queryManagementCostPage`、`hrManagementCostTF.deleteManagementCost`、`hrManagementCostTF.checkPassword`、`hrManagementCostTF.changePassword` |
| `cost/hrManagementCostDetail.vue` | 管理费用明细（录入/保存） | `hrManagementCostTF.queryManagementCostDetail`、`hrManagementCostTF.saveManagementCost` |

## 4. 核心接口速查

| BeanName | 主要方法 | 用途 |
|----------|---------|------|
| `hrRecruitInfoTF` | queryHrRecruitInfoPage / saveHrRecruitInfo / queryHrRecruitInfoDetail / publishHrRecruitInfo / delHrRecruitInfo / queryHrApplicantInfoPage / queryHrApplicantInfoDetail / updateHrApplicantInfoState | 招聘 |
| `hrNewsTF` | queryNewsPage / saveNews / getNewsDetail / delNews / setTopFlag | 新闻公告 |
| `hrManagementCostTF` | queryManagementCostPage / queryManagementCostDetail / saveManagementCost / deleteManagementCost / checkPassword / changePassword | 管理费用 |

## 5. 业务说明

- **招聘流程**：发布招聘信息（`publishHrRecruitInfo`）→ 应聘者投递 → 应聘者状态流转（面试/录用/淘汰，`updateHrApplicantInfoState`）
- **新闻置顶**：`setTopFlag` 控制新闻是否置顶展示
- **管理费用**：按月录入人事管理费用明细，支持汇总查看与密码保护

---

> 相关接口完整清单见 [api-00-接口清单.md](./api-00-接口清单.md) 的 `pt/hr` 分组。
