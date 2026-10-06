# 06 · HTML 与 CSS

> 难度标识：★★★ 重点高频 ｜ ★★ 进阶 ｜ ★ 了解
> 本文 11 题，覆盖盒模型/BFC、层叠上下文、flex/grid 布局、垂直居中与经典布局、移动端适配深度、动画性能、样式隔离、响应式布局与预处理器。
> 项目背景：Vue2 物流 SaaS 多租户平台（PC 后台 + H5 + 小程序 + 大屏四端），40+ 自研组件，H5 采用 rem 适配，大屏 1920x1080 等比缩放。
> 关联篇：本系列 01-1-16 渲染机制（重排重绘）、02-2-26 scoped 样式穿透、03-3-15 移动端适配方案，与本篇互为补充。

---

## 6-1. 盒模型与 BFC（★★★）

**详细回答（口述稿）：**
> "盒模型我一句话讲清：所有元素都是盒子，由 content、padding、border、margin 四部分组成。关键在标准盒模型 `content-box` 的 width 只算内容，加 padding/border 会把盒子撑大；而 `box-sizing: border-box` 的 width 包含 padding 和 border，宽度可控不撑破——所以我做组件库规范时统一要求 border-box，列宽计算、栅格布局才不会出偏差。BFC 是块级格式化上下文，一句话：一个独立的渲染区域，内部布局不影响外部。触发方式主要有 `overflow` 非 visible、`float`、absolute/fixed 定位、`display: inline-block/flex/grid`、`contain` 等。它解决三类经典问题：一是清除浮动，父元素 `overflow: hidden` 触发 BFC 把浮动子元素包住；二是防止 margin 塌陷，父子 margin 合并时给父级开 BFC；三是两栏自适应，左栏浮动 + 右栏 BFC，右栏就不会被浮动覆盖。项目里表格组件列宽拉伸就靠 border-box 保证表头表体对齐，列表页清除浮动、防 margin 塌陷也都是 BFC 的应用。"

**答案要点：**
- 盒模型构成：content / padding / border / margin。
- 标准盒模型 `content-box`：width = content；怪异盒模型 `border-box`：width = content + padding + border（推荐全局统一）。
- BFC（Block Formatting Context）：块级格式化上下文，内部元素布局不影响外部，可看作隔离的渲染区域。
- 触发 BFC：`overflow` 非 visible、`float`、`position: absolute/fixed`、`display: inline-block/flex/grid/table-cell`、`contain`。
- BFC 三大作用：清除浮动、防止 margin 塌陷、实现两栏自适应（不被浮动覆盖）。

**【项目案例】** 组件库全局样式统一 `box-sizing: border-box`（`*{box-sizing:border-box}`）；tableCommon 表格的列宽计算、表头表体对齐都依赖 border-box；列表页父容器用 `overflow: hidden` 触发 BFC 清除浮动、防止底部 margin 塌陷导致间距错乱。

## 6-2. 层叠上下文与 z-index（★★★）

**详细回答（口述稿）：**
> "层叠上下文是浏览器决定元素前后遮挡关系的规则，最核心的一句话是：z-index 只有在同一层叠上下文内比较才有意义。创建层叠上下文的方式很多：position + z-index（非 auto）、flex/grid 子元素且 z-index 非 auto、transform、opacity 小于 1、filter、will-change、contain 等——所以'明明设了 z-index: 9999 还是不生效'，八成是某个父级创建了层叠上下文，子元素的 z-index 只能在父级内部比较，出不了这个圈。同一上下文内层叠顺序从低到高：背景和边框 → 负 z-index → 块级元素 → 浮动 → 行内元素 → z-index: 0/auto → 正 z-index。项目里最典型的坑是地图组件：百度地图 InfoWindow 气泡想盖过我们的弹窗，结果层级压不过，原因就是地图容器自身创建了层叠上下文，气泡的 z-index 出不去；解法是让地图和弹窗处于同一层，或对地图容器避免加 transform/filter，保证弹窗能盖住气泡。我答这题一定强调：先看父级有没有建上下文，再看数值。"

**答案要点：**
- 层叠上下文创建条件：`position + z-index`（非 auto）、flex/grid 子元素 + z-index、`transform`、`opacity < 1`、`filter`、`will-change`、`mix-blend-mode` 等。
- 层叠顺序（同一上下文内）：背景/边框 < 负 z-index < 块级 < 浮动 < 行内 < z-index:0/auto < 正 z-index。
- **z-index 不生效排查三步**：①元素没设 position ②父级创建了层叠上下文被整体比较 ③同级别数值相同被 DOM 顺序覆盖。
- `z-index: auto` 不创建层叠上下文；`z-index: 0` 创建但层级与 auto 相同。
- 工程建议：全项目统一层级规范（遮罩 1000 / 弹窗 2000 / 通知 3000），避免魔数。

**【项目案例】** 地图选点弹窗 mapDialog 与百度地图 InfoWindow 气泡的层级冲突——地图容器自带层叠上下文导致气泡 z-index 无法盖过业务弹窗，通过调整地图容器属性 + 统一弹窗 z-index 规范解决；大屏看板 ECharts tooltip 与切换按钮的层级管理也是同一套思路。

## 6-3. flex 布局核心（★★★）

**详细回答（口述稿）：**
> "flex 布局核心就两件事：主轴与交叉轴的排列，和剩余空间的分配。主轴方向由 `flex-direction` 决定（默认 row），`justify-content` 管主轴对齐、`align-items` 管交叉轴对齐。真正容易考深的是 flex 伸缩三个属性：`flex-grow` 控制放大比例、`flex-shrink` 控制缩小比例、`flex-basis` 是基准尺寸。`flex: 1` 是缩写，等于 `flex-grow: 1; flex-shrink: 1; flex-basis: 0%`，意思是基准为 0、剩余空间全部分给当前项——这是'撑满剩余空间'的标准写法。注意 flex-basis 优先级高于 width，所以容器宽度变化时是按基准算的。项目里典型场景：后台主布局左侧菜单固定、右侧内容区 `flex: 1` 自动撑开并独立滚动；底部操作栏固定、中间内容 `flex: 1` 撑开；表格操作列用 `flex-shrink: 0` 防止按钮被压缩。答这题我会主动画图讲'剩余空间怎么分'：剩余空间 = 容器尺寸 − 各项 flex-basis 之和，再按 grow 比例分配。"

**答案要点：**
- 容器属性：`flex-direction`（主轴方向）、`justify-content`（主轴对齐）、`align-items`（交叉轴对齐）、`flex-wrap`、`gap`。
- 项目属性：`flex-grow`（放大比例）、`flex-shrink`（缩小比例）、`flex-basis`（基准尺寸，优先于 width）、`order`、`align-self`。
- **`flex: 1` = `grow:1; shrink:1; basis:0%`**：基准 0、剩余空间全部分配，实现"撑满剩余空间"。
- `flex: auto` = `basis:auto`（按内容大小）；`flex: none` = 不伸缩（固定尺寸）。
- 经典场景：两栏（左定宽右 flex:1）、三栏、底部固定（主区 flex:1 + 滚动）、垂直水平居中（flex + margin:auto）。

**【项目案例】** 后台主布局：左侧菜单固定 220px，右侧内容区 `flex: 1` + 独立滚动；页面底部操作栏固定、中间内容 `flex: 1` 撑开；表格操作列 `flex-shrink: 0` 防止编辑/删除按钮被压缩；表单 label 用固定 flex-basis 保证多表单对齐。

## 6-4. CSS Grid 布局（★★）

**详细回答（口述稿）：**
> "Grid 是二维布局系统，适合整体页面骨架和网格类场景，和 flex 的一维排列正好互补。核心 API：`display: grid` 之后，`grid-template-columns/rows` 定义行列，支持 `fr` 单位（剩余空间分配）、`repeat()`、`minmax()`；`gap` 统一行列间距；`grid-template-areas` 可以给区域命名，布局语义化直接写成 header / main / aside / footer，一眼看懂结构。选型逻辑很清晰：一维列表、导航、按钮组用 flex，二维网格骨架用 grid。项目里大屏看板就是用 Grid 排布：`grid-template-columns: repeat(3, 1fr)` 三列等分，配合 `grid-template-areas` 排出订单、仓储、车辆监控各模块的位置，比手写绝对定位好维护得多，加模块只改模板不改定位。我还会补一个进阶点：grid 和 flex 不冲突，外层 grid 定骨架、内层 flex 做元素对齐，是实战中最常用的组合。"

**答案要点：**
- Grid 是二维布局（行列同时控制）；flex 是一维（单方向），两者互补。
- 核心属性：`grid-template-columns/rows`、`fr`（剩余空间分数）、`repeat()`、`minmax()`、`gap`、`grid-template-areas`、`grid-column/row`（项目定位）、`place-items`（单元格内对齐）。
- 自适应列：`repeat(auto-fill, minmax(160px, 1fr))` 根据容器宽度自动换列。
- 常用布局：区域命名布局（areas）、三栏圣杯、等分卡片墙。
- 选型：一维排列用 flex，二维骨架用 grid；两者可嵌套使用。

**【项目案例】** 6 个大屏看板（订单/预约/仓储/计划/配送/车辆监控）用 `grid-template-areas` 排布模块位置，等比缩放容器内 Grid 自动适配；H5 商城商品卡片列表用 `repeat(auto-fill, minmax(160px, 1fr))` 在不同屏宽自动决定列数。

## 6-5. 垂直居中与经典布局（★★★）

**详细回答（口述稿）：**
> "垂直居中的方案我按场景分四类：一是 flex 最省事，父级 `display: flex; align-items: center; justify-content: center`，现代布局首选；二是 grid 更简洁，`place-items: center` 一行搞定；三是绝对定位方案，子元素 `top: 50%; left: 50%; transform: translate(-50%, -50%)`，适合不知道子元素尺寸的浮层，因为 transform 百分比是相对自身；四是老方案 `display: table-cell; vertical-align: middle`，兼容老浏览器。经典布局题里，两栏"左固定右自适应"最优雅的是左 `float: left` 定宽 + 右 `margin-left`，或者 flex 版左 `flex-basis` 固定 + 右 `flex: 1`；三栏圣杯/双飞翼考的是中间优先渲染 + 两侧定宽，现在用 flex 或 grid 都能秒杀。项目里登录页卡片居中、弹窗组件、大屏标题、loading 浮层都是这些方案的落地。我会强调：没有银弹，flex 优先，遇到老系统或尺寸未知的浮层用绝对定位 + translate。"

**答案要点：**
- 垂直居中四方案：flex（`align-items: center`）、grid（`place-items: center`）、absolute + `transform: translate(-50%,-50%)`（尺寸未知浮层）、table-cell + `vertical-align: middle`（老兼容）。
- 水平居中：定宽块 `margin: 0 auto`、行内 `text-align: center`、flex/grid 布局。
- 两栏布局：左固定右自适应（float + margin / flex-basis + flex:1）。
- 三栏圣杯/双飞翼：中间优先渲染、两侧定宽，flex/grid 简化实现。
- 粘性 footer：外层 flex 列布局 + 主内容 `flex: 1`（或 `min-height: 100vh`），footer 自动贴底。

**【项目案例】** 登录页卡片居中（absolute + translate）、弹窗组件（尺寸未知浮层居中）、大屏标题栏与 loading 浮层（flex 居中）；后台列表页布局：主内容 `flex: 1` 撑开 + footer 贴底。

## 6-6. 移动端适配深度（★★★）

**详细回答（口述稿）：**
> "适配问题的根源是物理像素和 CSS 像素不一致——设备像素比 dpr = 物理像素 / CSS 像素，iPhone 6 是 2、iPhone X 是 3。viewport 的作用就是把 CSS 像素映射到物理屏，`width=device-width` 让布局视口等于设备宽度，这是所有适配方案的地基。rem 方案的原理：把 html 根字号设为屏宽的一个比例（如 1rem = 屏宽 / 10），所有尺寸用 rem，屏宽变字号跟着变、整体等比缩放，配合 postcss-pxtorem 自动把设计稿 px 转成 rem。1px 问题：dpr 大于 1 时 CSS 的 1px 在物理屏上是 2px 或 3px 宽，实现方案是 `transform: scale(0.5)` 按 dpr 缩放，或用媒体查询按 dpr 区分样式。vw 方案的坑：vh 在移动端受地址栏收起影响不稳定、极小屏上 vw 字号会过小，要配合 `clamp()` 兜底。还有 iPhone 刘海屏的安全区要 `env(safe-area-inset-bottom)`。项目里 H5 商城 750 设计稿 rem 适配，1px 边框用 scale，小程序端 rpx 和 rem 一个思想，同一套设计稿两处落地。这题和 3-15 移动端适配方案互补：3-15 讲方案总览，这题深挖原理。"

**答案要点：**
- dpr（设备像素比）= 物理像素 / CSS 像素；Retina 屏 2x/3x；图片清晰度用 @2x/@3x。
- viewport：`width=device-width, initial-scale=1, viewport-fit=cover`；layout viewport vs visual viewport。
- rem 方案原理：根字号 = 屏宽比例，尺寸等比缩放；flexible.js 动态设置 + postcss-pxtorem 自动转换。
- 1px 实现：`transform: scale(0.5)`（配合 dpr 媒体查询）或 border-image。
- vw/vh 的坑：vh 受移动端地址栏影响不稳定、vw 字号极小屏过小 → `clamp()` 兜底。
- 安全区：`env(safe-area-inset-bottom)` 适配 iPhone 刘海屏。

**【项目案例】** H5 活动页/商城 750 设计稿 rem 适配（postcss-pxtorem + flexible），1px 细线用 `transform: scale`；`viewport-fit=cover` + 安全区 padding 适配刘海屏；小程序 rpx（750rpx = 屏宽）与 H5 rem 同一设计稿双端落地，证明了对适配体系的理解。

## 6-7. 选择器优先级与权重（★★）

**详细回答（口述稿）：**
> "CSS 权重核心一句话：!important > 行内样式 > id > class/属性/伪类 > 元素/伪元素。权重可以用四位数表示：id 是 (0,1,0,0)，class/属性/伪类是 (0,0,1,0)，元素/伪元素是 (0,0,0,1)，同级相加、不进位比较。常见坑有两个：一是十个 class 的权重 (0,0,10,0) 也不如一个 id (0,1,0,0)，别想靠数量堆过 id；二是 !important 是最后的底牌，一旦用了后续只能靠更多 !important 覆盖，我在项目里基本禁止业务代码用。实际高频场景是覆盖第三方组件库样式：组件库用 scoped + 类名，我们要么写更高权重的选择器，要么用 `::v-deep` 配合父级类名限定作用域。选择器性能也有讲究：越靠右的选择器匹配代价越高，`.list .item span` 比直接 `.item` 慢，但现代浏览器下一般不是瓶颈——优先保证可读性和约束性，而不是过度优化。"

**答案要点：**
- 权重计算：`!important` > 行内样式 > ID（0,1,0,0）> class/属性/伪类（0,0,1,0）> 元素/伪元素（0,0,0,1）。
- 同级权重相加、不进位；同权重下后写的覆盖先写的（层叠顺序）。
- `!important` 滥用问题：破坏可覆盖性，组件库/主题定制场景要谨慎。
- 覆盖第三方组件样式策略：提高权重选择器 / `::v-deep` + 父级限定 / 行内样式（不推荐）。
- 选择器性能：最右侧选择器匹配代价最高，避免超长链式选择器和通配符滥用。

**【项目案例】** 覆盖 Element UI 表格表头样式用 `::v-deep .el-table__header`（关联 2-26 样式穿透）；主题色定制用 CSS 变量 + 权重控制；总结了一套"组件库样式覆盖四步排查法"（scoped → 权重 → 全局污染 → !important）。

## 6-8. CSS 动画与性能（★★）

**详细回答（口述稿）：**
> "CSS 动画性能的核心是'尽量只动合成器属性'。浏览器渲染分重排、重绘、合成三档代价（关联 1-16 渲染机制），transform 和 opacity 只触发合成，完全不碰布局和绘制，所以动画优先用它们——位移用 transform 代替 top/left，淡入淡出用 opacity。will-change 是提前告诉浏览器'这个元素要变'，让它单独建合成层，动画更流畅，但要克制用，建多了反而吃内存。另一条经验：触发重排的动画（改宽高、字体、布局属性）在低端机上必卡，优化思路是让动画元素脱离文档流或单独合成层，动画过程中避免读布局属性造成强制同步布局（layout thrashing）。CSS 动画和 requestAnimationFrame 怎么选：简单位移/淡入淡出用 CSS 够用且性能最好；依赖滚动位置、需要交互打断、逐帧逻辑的用 rAF。项目里大屏看板的滚动容器用 `transform: translate3d()` 只走合成层，数据刷新用 opacity 过渡避免整屏闪烁；表格列宽拉伸用 rAF 批量更新样式，避免一次拖拽触发几十次重排。"

**答案要点：**
- 渲染代价三档：重排（layout）> 重绘（paint）> 合成（composite）。
- 合成器友好属性：`transform`、`opacity`（可 GPU 加速）；`top/left/width/height` 触发重排，动画禁用。
- `will-change`：提前建合成层提升流畅度，但过量使用占用内存。
- 强制同步布局（layout thrashing）：动画中读写布局属性会卡顿；读写分离、用 rAF 批量更新。
- CSS 动画 vs rAF：简单位移用 CSS（原生合成优化），依赖滚动/交互/逐帧逻辑用 rAF；JS 动画记得 cancel 防止内存泄漏。

**【项目案例】** 大屏看板滚动容器 `transform: translate3d()` 只触发合成层；数据刷新 opacity 过渡避免整屏闪；订单表格列宽拉伸用 `requestAnimationFrame` 批量更新样式，避免一次拖拽几十次重排；地图轨迹回放 Polyline 动画控制帧率。

## 6-9. 样式隔离方案：scoped / CSS Modules / BEM（★★）

**详细回答（口述稿）：**
> "样式隔离四种主流方案，我按原理和适用场景对比讲。scoped 是 Vue 自带，编译时给元素加 data-v 属性、选择器自动补属性选择器，实现简单，但有两个问题——属性选择器会让权重变高，且改不了子组件内部样式（要配合 `::v-deep`，这点和 2-26 联动）；CSS Modules 是编译时把类名转成带 hash 的全局唯一名，天然无副作用，React 生态用得多；BEM 靠命名约定（block__element--modifier）约束，不用构建工具也能用，缺点是类名长；CSS-in-JS 是运行时隔离，适合组件库做动态主题。选型建议：Vue 项目 scoped 完全够用，跨团队大项目可以上 CSS Modules 或 BEM + 设计规范双保险；全局通用样式（reset、主题变量）放公共文件，不进 scoped。项目里组件库的规范是：业务组件一律 scoped，全局主题用 CSS 自定义属性（--primary-color 等）挂根节点，换肤只改变量；样式冲突的排查流程：先看 scoped 是否生效、再看权重、最后查全局污染。"

**答案要点：**
- 四种方案：scoped（data-v 属性 + 属性选择器）、CSS Modules（类名 hash 化）、BEM（命名约定）、CSS-in-JS（运行时隔离）。
- scoped 局限：子组件内部改不了（配合 `::v-deep`）、属性选择器使权重变高。（关联 2-26）
- CSS Modules：编译期类名唯一，无作用域污染，React 生态常用。
- BEM：`block__element--modifier`，适合无构建环境 / 大团队规范约束。
- 工程实践：业务组件 scoped + 全局主题用 CSS 变量挂根节点；冲突排查四步（scoped → 权重 → 全局污染 → !important）。

**【项目案例】** 组件库 40+ 组件全部 scoped 隔离；主题定制用 CSS 变量（--primary-color / --success-color 等）实现一键换肤；排查 Element UI 样式冲突时沉淀了"scoped → 权重 → 全局污染"三步定位法。

## 6-10. 响应式布局方案对比（★★）

**详细回答（口述稿）：**
> "响应式布局本质是'一套代码适配多端'，方案分四层：一是流式布局，用百分比和弹性尺寸让元素随屏宽伸缩，不改变结构；二是媒体查询断点，在小、中、大屏切换布局（配合栅格 12 列），是框架层的标配；三是 rem/vw 等比缩放，适合内容型 H5；四是大屏/特宽屏的等比缩放适配。选型要看业务：内容型页面（H5 活动页、商城）用 rem 等比缩放，工具型后台用固定栅格 + 最小宽度 + 弹性收缩，大屏看板用 1920 基准等比。项目里是典型的多端混合：PC 后台固定 1280 栅格、浏览器缩小时走流式收缩；H5 商城 rem 适配；6 个大屏看板 1920x1080 基准等比缩放——三套方案并存，因为三端的交互形态完全不同。我会强调：响应式不是把断点写满，而是先想清楚'内容形态在不同宽度下应该怎么变'，断点是结构变化的时机，不是样式堆砌的借口。"

**答案要点：**
- 四种方案：流式布局（% / flex 弹性）、媒体查询断点（栅格系统）、rem/vw 等比缩放、大屏等比缩放。
- 断点设计：参考 <576（手机）/ 768（平板）/ 992（桌面）/ 1200（大屏）；先定义"何时变结构"再写断点。
- 桌面优先 vs 移动优先：移动优先强制思考最小屏约束，性能更优。
- 与纯 rem 方案区别：媒体查询是"结构性变化"，rem 是"整体缩放"，两者可组合。
- 多端选型：内容型页面等比缩放、工具型系统弹性收缩、大屏独立适配。

**【项目案例】** PC 后台固定 1280 栅格 + 弹性收缩（窄屏时侧栏收起）；H5 活动页 rem 等比；大屏看板 1920x1080 基准 transform 等比缩放——三套方案按业务场景并存，并在技术方案评审中沉淀为团队规范。

## 6-11. Less/Sass 实战价值（★）

**详细回答（口述稿）：**
> "Less/Sass 的核心价值是让 CSS 有了编程能力，我按使用频率排：一是变量——主题色、间距、字号统一定义，改主题只改一处；二是嵌套——选择器层级和 HTML 结构对应，可读性翻倍，但嵌套别超过三层，否则生成的选择器又长又难覆盖；三是 mixin（混合）——复用带参数的能力，比如 1px 边框、文字省略、清除浮动、flex 居中，传参就能出不同样式，这是我用得最多的；四是函数与运算——颜色加深减淡、尺寸计算；五是 extend 继承——公共样式复用。和 CSS 原生变量的区别：CSS 变量是运行时变量、支持动态切换（适合主题换肤），Less/Sass 变量是编译期静态替换；两者不冲突，我的做法是设计规范层用 Less 变量生成默认值，运行时主题切换用 CSS 变量覆盖。工程实践：变量文件统一管理（colors、size、spacing 分层），mixin 库按业务域拆分，禁止写死魔法值，样式与逻辑三文件分离。"

**答案要点：**
- 核心能力：变量、嵌套（≤3 层）、mixin（带参复用）、函数/运算、extend 继承、@import 拆分。
- 与 CSS 变量区别：编译期静态替换 vs 运行时动态值（主题切换用 CSS 变量）。
- 常用 mixin：1px 边框、文字单行/多行省略、清除浮动、flex 居中、三角形。
- 工程规范：变量文件分层（color/size/spacing）、mixin 按域拆分、嵌套 ≤3 层、禁止魔法值。
- 选型：Vue2 老项目多用 Less，与简历"精通 Less/Sass"呼应。

**【项目案例】** 组件库样式统一走预处理器变量（主题色、间距 scale），运行时主题换肤用 CSS 变量覆盖；沉淀 mixin 库（1px 边框、省略号、清除浮动）被 40+ 组件引用；样式独立成文件三文件分离管理，变量文件按 colors/size/spacing 分层。
