# 核心业务 — 异常与日志

> **关联文档**：

| 关联文档 | 关联说明 |
|----------|---------|
| [web-00-项目总览.md](./web-00-项目总览.md) | 业务全景 |
| [web-02-公共组件库.md](./web-02-公共组件库.md) | operateLog/commonOpLog 组件 |
| [api-00-接口清单.md](./api-00-接口清单.md) | 接口事实源（`pt/exc`、`pt/operateLog` 分组） |

## 1. 业务概述

**异常与日志**（`src/page/pt/exc` + `src/page/pt/operateLog`）是平台的异常管控与审计域：

```
异常中心：异常登记（关联客户/订单）→ 异常处理（跟进/完成）→ 异常审核 → 打印
操作日志：全局操作日志查询（按用户/操作/时间）
```

- 核心服务标识（BeanName）：`exceptionTF`、`commonTF`、`customerTF`、`regionOrgTF`、`opLogTF`

## 2. 模块划分

| 子模块 | 目录 | 说明 |
|--------|------|------|
| 异常中心 | `exc/` | 异常登记、处理、审核、打印 |
| 操作日志 | `operateLog/` | 系统操作日志查询 |

## 3. 核心页面清单

### 3.1 异常中心（exc）

| 页面 | 功能 | 关键接口 |
|------|------|---------|
| `exceptionManage.vue` | 异常列表（删除/邮件提醒） | `exceptionTF.queryExceptionInfoPage`、`exceptionTF.delExceptionInfo`、`commonTF.getRemindEmails` |
| `addException.vue` | 新增异常（关联客户） | `exceptionTF.saveExceptionInfo`、`exceptionTF.getExceptionInfo`、`customerTF.loadCustomerList` |
| `exceptionHandle.vue` | 异常处理（完成） | `exceptionTF.doneExceptionInfo`、`exceptionTF.getExceptionInfo` |
| `exceptionDetail.vue` | 异常详情（审核） | `exceptionTF.getExceptionInfo`、`exceptionTF.verifyExceptionInfo` |
| `exceptionPrint.vue` | 异常打印 | `exceptionTF.getExceptionInfo` |

### 3.2 操作日志（operateLog）

| 页面 | 功能 | 说明 |
|------|------|------|
| `operateLog.vue` | 操作日志查询 | 按操作人/时间/关键字查询系统操作记录 |

## 4. 核心接口速查

| BeanName | 主要方法 | 用途 |
|----------|---------|------|
| `exceptionTF` | queryExceptionInfoPage / saveExceptionInfo / getExceptionInfo / doneExceptionInfo / verifyExceptionInfo / delExceptionInfo | 异常全流程 |
| `opLogTF` | queryOpLogPage 等 | 操作日志 |
| `commonTF` | getRemindEmails / getSysStaticData | 提醒邮箱/字典 |

## 5. 业务流程说明

### 5.1 异常管理流程

```
登记异常（addException：saveExceptionInfo，关联客户/订单）
   → 异常处理（exceptionHandle：doneExceptionInfo）
   → 异常审核（exceptionDetail：verifyExceptionInfo）→ 打印（exceptionPrint）
   → 列表管理（exceptionManage：删除/邮件提醒）
```

---

> 相关接口完整清单见 [api-00-接口清单.md](./api-00-接口清单.md) 的 `pt/exc`、`pt/operateLog` 分组。
