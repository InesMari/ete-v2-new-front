# 辅助模块 — 易迁易大学（edu）

> 本文档覆盖 EDB 系统的在线学习平台「易迁易大学」（`edu`）：管理员端（课程/考试/图书/班级/学员管理）、学员端（选课学习/在线考试/学分查询）、公共登录与首页。该平台独立于物流业务，面向企业内部培训与考核。

## 关联文档

| 文档 | 说明 |
|------|------|
| [web-20-登录与主框架](web-20-登录与主框架.md) | edu 登录与主框架机制 |
| [web-04-状态管理与路由](web-04-状态管理与路由.md) | 动态路由注册 |
| [api-00-接口清单](api-00-接口清单.md) | edu 端接口事实源 |

## 模块总览

| 端 | 代码路径 | 页面数 | 核心功能 |
|----|----------|--------|----------|
| 登录 | `edu/login` | 2 | 学员/管理员双模式登录、忘记密码 |
| 学员首页 | `edu/main` | 3 | 横幅、课程分类导航、热门课程、学习排名、公告（`eduHome`） |
| 学员端 | `edu/student` | 7 | 我的课程、课程学习、在线考试、考试记录、学分 |
| 管理端 | `edu/admin` | 20 | 课程/考试/图书/班级/学员/首页栏目/系统日志管理 |

## 目录树

```
src/page/edu/
├── login/
│   ├── login.vue / login.js         # 双模式登录（学员/管理员）
│   └── forgetPassword.vue           # 忘记密码
├── main/                            # 学员端首页（未登录也可浏览）
│   ├── home/home.vue / toMain.vue   # 门户首页
│   └── books/bookDetail.vue         # 图书详情
├── student/                         # 学员端（登录后）
│   ├── home/                        # 学员主框架 + 个人中心首页
│   ├── course/
│   │   ├── myCourse.vue             # 我的课程
│   │   └── courseDetail.vue         # 课程详情/学习
│   └── exam/
│       ├── examination.vue          # 在线考试
│       └── examRecord.vue           # 考试记录/学分
└── admin/                           # 管理端
    ├── home/                        # 管理主框架 + 首页
    ├── base/                        # 图书/班级/首页栏目/系统日志
    ├── course/                      # 课程管理/成绩查看/学习记录
    ├── exam/                        # 考试管理
    └── student/                     # 学员管理/简答题批阅
```

## 一、登录（edu/login）

### 1.1 双模式登录

| 模式 | 登录方法 | 跳转 |
|------|----------|------|
| 学员 | `eduUserService.studentLoginForWeb` | `/edu/main/home/toMain.vue`（门户首页） |
| 管理员 | `eduUserService.adminLoginForWeb` | `/edu/admin/home/home.vue`（管理端） |

- Tab 切换登录模式，`loginType` 标记
- 短信验证码：`userTF.webPtSendLoginSmsValidCode` + `webPtgetShowCode`（是否需要图形验证码）
- 密码 RSA 加密（`$getRsaCode`），记住账号（base64）存 `localStorage.rememberAccount`
- 忘记密码：`userTF.webPtSendPasswordSmsValidCode` 发短信 → `userTF.checkSmsValidCode` 校验 → `userTF.smsModifyPassword` 重置

### 1.2 管理员首次登录保护

`adminLoginForWeb` 返回含 `noAuthHome` 标识时，管理端强制拒绝进入管理首页（仅学员端可访问），防止未授权账号访问管理功能。

## 二、学员门户（edu/main）

### 2.1 门户首页（home/toMain.vue）

| 区域 | 数据来源 | 说明 |
|------|----------|------|
| 顶部横幅 | `eduHomeService.queryHomeColumn` + 轮播图 | `homeData[0]` 横幅滑动，点击跳热门课程 |
| 课程分类导航 | `eduHomeService.getSysStaticData`（课程分类） | 横向菜单，支持二级分类，点击过滤课程 |
| 热门课程 | `eduCourseService.getAllEduCourseInfos` | `homeData[1]` 课程卡片 |
| 学习排名 | `eduCourseService.queryEduCourseInfoPage`（或学分排行） | `homeData[2]` 部门/用户名/学分排名表 |
| 课程列表 | `eduCourseService.queryEduCourseInfoPage` | 按分类查询课程列表 |

- 右上角「个人中心」进入学员端（`toStudent`）

### 2.2 图书详情（books/bookDetail.vue）

- `eduBookService.getEduBookInfo`：电子书详情展示（书名、封面、简介、章节）

## 三、学员端（edu/student）

### 3.1 主框架（home/）

- `home.vue`（`studentHome`）：左侧 `navMenu` + 顶部用户信息 + 注销退出（`userTF.logout`）
- `toMain.vue`（`toMainStudent`）：个人中心首页
  - `eduUserService.loadStudentHomeData`：个人数据（学习进度、待考试、学分等）
  - `eduCourseService.loadLastLearningCourseData`：最近学习课程

### 3.2 我的课程（course/myCourse.vue）

- `eduCourseService.queryCoursePageForStudent`：已选课程列表
- 点击进入 `courseDetail` 学习

### 3.3 课程学习（course/courseDetail.vue）

- `eduCourseService.getEduCourseInfo`：课程详情（章节、资料）
- `eduCourseService.studyCourse`：上报学习进度（记录学习时长/完成章节）

### 3.4 在线考试（exam/examination.vue）

- `eduCourseService.getEduTestInfo`：获取考试题目
- `eduTestService.exam`：提交考试答案
- 支持客观题自动判分；管理员批阅的简答题见管理端

### 3.5 考试记录与学分（exam/examRecord.vue）

- `eduTestService.queryUserTestRecordPage`：考试记录分页（成绩、时间）
- `eduCourseService.loadStudentCreditData`：学分累计数据

## 四、管理端（edu/admin）

### 4.1 主框架（home/）

- `home.vue`（`adminHome`）：侧边栏 + 顶部（操作教程 SOP + 注销退出）+ myTab 多标签
- `navMenu.vue`：`menuTF.loadMenuTree` 拉取管理端菜单树
- `toMain.vue`：`eduUserService.loadAdminHomeData` 管理首页统计（课程数/学员数/考试数等）
- `logout`：`userTF.logout` → 清 localStorage → 跳回 `/edu`

### 4.2 课程管理（course/）

| 页面 | 接口 | 说明 |
|------|------|------|
| `courseManage` | `eduCourseService.queryEduCourseInfoPage` 等 | 课程列表：查询/删除/置顶（`updateTopFlag`）/指派班级（`updateEduCourseInfoClass`）/发布安排（`updateCourseAppoint`）/删除考试（`delEduTestInfo`） |
| `addCourse` | `saveEduCourseInfo` + `getAllPositions`/`getAllSetPositions`（岗位）+ `regionOrgTF.queryStaffData` | 新增/编辑课程：标题、封面、分类、岗位范围、班级指派、资料上传 |
| `courseDetail` | `getEduCourseInfo` | 课程详情预览 |
| `learnRecord` | `eduCourseService.queryEduUserCourseInfoPage` | 学员学习记录（进度/时长） |
| `checkScore` | `eduCourseService.queryEduUserTestInfoPage` | 成绩查看（按课程/班级） |

### 4.3 考试管理（exam/）

| 页面 | 接口 | 说明 |
|------|------|------|
| `addExam` | `saveEduTestInfo` / `getEduTestInfo` | 新增/编辑考试：关联课程、试卷题目（单选/多选/判断/简答）、考试时长 |
| `examDetail` | `getEduTestInfo` | 考试详情预览 |

### 4.4 学员管理（student/）

| 页面 | 接口 | 说明 |
|------|------|------|
| `studentList` | `eduUserService.queryEduUserCreditInfoPage` | 学员列表 + 学分明细 |
| `examination` | `eduCourseService.getEduTestInfo` | 查看学员试卷 |
| `shortAnswerExamination` | `getEduTestInfo` + `eduTestService.shortAnswerMark` | 简答题人工批阅打分 |
| `examScore` | `eduUserService.queryEduUserTestInfoPage` | 学员考试成绩汇总 |

### 4.5 基础管理（base/）

| 页面 | 接口 | 说明 |
|------|------|------|
| `bookManage` / `addBook` / `bookDetail` | `eduBookService.queryEduBookInfoPage` / `saveEduBookInfo` / `getEduBookInfo` + `regionOrgTF.getOrgInfoList` | 电子图书库管理（书名、封面、附件、所属组织） |
| `classSet` | `eduHomeService.getClassTree`（班级树）/ `saveCourseClass` / `delCourseClass` | 班级/组织架构维护 |
| `homeManage` | `eduHomeService.queryHomeColumn` / `setHomeColumn` + `queryAllEduBookInfo` / `getAllEduCourseInfos` | 首页栏目配置（横幅、热门课程、公告位） |
| `sysLogInfoManage` | `sysLogTF.queryEduSysLogPage` | 系统操作日志 |

## 五、关键服务与接口

| 服务 beanName | 用途 |
|---------------|------|
| `eduUserService` | 登录（学员/管理员）、首页数据、学分、成绩 |
| `eduCourseService` | 课程 CRUD、岗位分配、学习记录、考试信息 |
| `eduTestService` | 考试提交、简答批阅、考试记录 |
| `eduBookService` | 电子图书 CRUD |
| `eduHomeService` | 班级树、首页栏目配置、静态数据 |
| `sysLogTF` | 系统日志（`queryEduSysLogPage`） |

## 六、典型流程

```
学员：扫码/账号登录 → 门户首页浏览课程分类 → 选课 → 课程学习（上报进度）
      → 在线考试（eduTestService.exam）→ 考试记录/学分查询
管理员：账号登录 → 首页统计 → 课程管理（新增/指派班级/置顶）
      → 考试管理（组卷）→ 学员管理（学分/成绩）→ 简答题批阅 → 图书/班级/首页配置
```

## 七、注意事项

1. **接口前缀**：大学端服务集中在 `edu*Service` 与 `userTF` 登录族方法，登录短信复用平台端 `webPtSendLoginSmsValidCode`。
2. **双端隔离**：学员端（`edu/main` + `edu/student`）与管理端（`edu/admin`）组件与菜单完全分离，通过登录模式区分入口。
3. **课程与考试关系**：考试挂在课程下（`addExam` 需选择关联课程），删除课程会连带删除其考试（`delEduCourseInfo` + `delEduTestInfo`）。
4. **批阅闭环**：含简答题的考试需管理员在「学员管理 → shortAnswerExamination」人工批阅后，学员成绩才完整。
5. **首页配置**：门户横幅/热门课程等由管理端 `homeManage` 配置，改后学员端即时生效。
