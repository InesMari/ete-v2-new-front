# 02 · Vue 框架原理

> 难度标识：★★★ 重点高频 ｜ ★★ 进阶 ｜ ★ 了解
> 本文 30 题，覆盖 Vue2/3 响应式原理、diff、组件通信、Vuex/Router、Vue2→Vue3 差异、组合式 API。
> 项目背景：`ete-v2-new-front` 为 Vue 2.6.10 多租户 SaaS 平台（pt 平台端 / hz 货主端 / edu 大学端 / wx 微信端），1780 文件、1764 个接口调用。

---

## 2-1. Vue2 响应式原理（★★★）

**详细回答（口述稿）：**
> "Vue2 响应式一句话：用 `Object.defineProperty` 给 data 每个属性做 getter/setter 劫持，读属性时收集依赖，改属性时通知更新。具体机制是三个角色：Dep 管订阅队列，Watcher 是订阅者，每个组件实例对应一个渲染 Watcher——模板渲染时读到哪个属性，就把当前 Watcher 加进那个属性的 Dep；属性变化时 `dep.notify()` 触发 Watcher 重新渲染。三个经典边界要背：一是数组，Vue2 重写了 push/pop 等 7 个方法做拦截，但通过索引赋值和改 length 不会触发更新；二是对象新增/删除属性不响应，要 `this.$set`；三是更新是异步的，同一 tick 内的多次修改会合并到 nextTick 一次渲染。项目里真实踩过：给行对象加'选中'字段直接 `row.checked = true` 没反应，用 `this.$set` 才更新。"

**答案要点：**
- `Object.defineProperty` 对 data 的每个属性做 getter/setter 劫持，收集依赖（Dep），通知更新（Watcher）。
- 每个组件实例一个 Watcher（渲染 watcher），读取属性时把 watcher 加入该属性的 Dep 订阅队列，属性变化时 Dep.notify() 触发 watcher 重新渲染。
- 数组：通过重写 `push/pop/shift/unshift/splice/sort/reverse` 7 个方法实现拦截（不能通过 length 与索引触发响应式）。
- 对象：新增/删除属性不响应（用 `Vue.set/this.$set`、`Vue.delete`；Vue3 用 Proxy 解决）。
- 异步更新：数据变化不会立刻渲染，而是推入 nextTick 队列，同一 tick 合并，最后统一更新 DOM。

**【项目案例】** 项目踩坑实例：表格动态给行对象新增"选中"字段，直接 `row.checked = true` 不触发更新，必须 `this.$set(row, 'checked', true)`；货主端订单列表的 `_index` 字段也统一在赋值前拼好，避免事后 set 的性能损耗。数组通过索引改值（`list[0] = x`）不响应，也是订单行编辑里最常见的坑。

## 2-2. Vue3 响应式原理（★★★）

**详细回答（口述稿）：**
> "Vue3 响应式核心是 Proxy，直接代理整个对象，能拦截 get/set/has/deleteProperty/ownKeys 等 13 种操作，所以新增属性、删除属性、数组索引和 length 变化天然支持，这是对 Vue2 的最大升级。两个 API 分工：`ref` 包装基本类型要用 `.value` 访问，`reactive` 用于对象；搭配 `Reflect` 是为了保证 this 正确和返回值。Vue3 还有个关键优化叫懒收集——依赖是访问时才收集的，用 WeakMap（target → key → Set）结构存依赖，性能比 Vue2 的 Dep 数组好。项目里 AI 聊天组件 `aiChat.js` 就是 Vue3 组合式写法，`reactive({ sessions, streamingContent })` 加 `toRefs` 解构后绑定模板。我会主动说：这两个我都写过生产代码，能对比出各自的边界。"

**答案要点：**
- `Proxy` 代理整个对象，可拦截 `get/set/has/deleteProperty/ownKeys` 等 13 种操作，天然支持新增属性、删除、数组索引与 length 变化。
- 响应式分为 `ref`（基本类型包装，`.value`）与 `reactive`（对象）；`Reflect` 配合 Proxy 保证 this 正确与返回布尔。
- **懒收集**：Vue3 的 effect 依赖收集在访问时进行，且 `track` 用 WeakMap 结构（target → key → Set(dep)），性能与内存优于 Vue2 的 Dep 数组。
- 只读、浅响应式（shallowRef/shallowReactive）可按需选择，减少代理开销。
- `computed`/`watch` 底层都基于 effect 调度。

**【项目案例】** 项目 AI 聊天组件 `aiChat.js` 用 Vue3 组合式 API 编写：`reactive({ sessions, streamingContent })` + `toRefs` 解构后模板绑定，正是 Proxy 响应式在真实业务中的直接体现；新版本系统（Vue3）的大屏数据看板用 `reactive` 管理看板配置与轮询数据。

## 2-3. computed 与 watch 的区别（★★）

**详细回答（口述稿）：**
> "computed 和 watch 的分工一句话：computed 是'计算'，watch 是'侦听'。computed 有缓存，依赖不变就不重新计算，适合由状态派生视图数据，而且必须是同步、不能有副作用；watch 是数据变化后执行回调，支持异步和副作用，可配置 `deep` 深监听、`immediate` 立即执行。选型口诀：'要展示的值'用 computed，'变化后要做的事'用 watch。项目里表格合计列就是用 computed 派生的，行数据变它自动算还有缓存；而订单状态变化后弹窗提醒、刷新待办这种副作用用 watch。有个性能细节我会提：deep 监听会递归遍历对象，我们只允许用在配置对象上，业务大对象不 deep。"

**答案要点：**
- computed：**计算属性**，有缓存，依赖不变不重新计算；适合"由状态派生视图数据"；必须是同步、不能有副作用。
- watch：**侦听器**，数据变化时执行回调，支持异步与副作用；可配置 `deep`（深监听）、`immediate`（立即执行）、`flush`（post/pre）。
- 性能角度：computed 有缓存更高效；需要"变化后做某件事"用 watch。
- Vue3 组合式：`computed(() => ...)`、`watch(() => state.x, cb)`。

**【项目案例】** 表格合计列用 computed 派生（`head` 配置里 `calcFootSum` 的列求和），依赖行数据变化自动更新且带缓存；而"订单状态变化后弹窗提醒 + 刷新待办"这种副作用用 watch 实现；深度监听对象用 `watch({ deep: true })`，但明确限制了 deep 只用在配置对象上（性能）。

## 2-4. v-if 与 v-show 的区别（★★★）

**详细回答（口述稿）：**
> "v-if 和 v-show 的区别是面试必问题：v-if 是真销毁/创建 DOM，初始为 false 时根本不渲染，有懒加载特性，但切换成本高，适合低频切换；v-show 始终渲染只是切 `display:none`，切换成本低，适合高频切换。再补充两个坑：一是 v-if 和 v-for 不要同元素用，Vue2 里 v-for 优先级更高，Vue3 反过来；二是组件用 v-if 会走完整销毁重建生命周期，配合 keep-alive 才能保留状态。项目里'更多操作'下拉用 v-show 高频切换，权限不满足的子页面用 v-if 直接不渲染，大屏切换数据源 tab 用 v-show 保住图表动画状态——每个选择背后都是成本权衡。"

**答案要点：**
- v-if：真正销毁/创建 DOM，切换成本高，初始条件为 false 时不渲染，适合低频切换；有懒加载特性（配合 `v-else`）。
- v-show：始终渲染，仅切换 `display:none`，切换成本低，适合高频切换（tab、折叠面板）。
- 注意：v-if 与 v-for 同元素时 v-for 优先级更高（Vue2），官方不推荐同用；Vue3 中 v-if 优先级高于 v-for。
- 组件用 v-if 会走完整的销毁/重建生命周期；keep-alive 可缓存 v-if 切换的组件状态。

**【项目案例】** 订单详情页"更多操作"下拉用 v-show 高频切换；而"回单管理"里权限不满足的子页面用 v-if 直接不渲染（配合 `v-entity` 指令）；大屏看板切换数据源 tab 用 v-show 保住动画状态，避免每次切换重新初始化图表。

## 2-5. v-for 与 key 的作用（★★）

**详细回答（口述稿）：**
> "key 是 diff 时识别节点身份的标识，作用就是帮框架精准复用和最小化更新。最关键的结论：key 要用业务唯一 id，绝对不用 index。用 index 的坑是——列表增删或排序后，节点按位置复用导致状态错乱，典型场景就是行内输入框内容串位。项目里真实发生过：运单列表行内嵌备注输入框，用 index 做 key，删掉第一行后第二行的输入内容串到了第一行，改成 `waybillId` 后就好了。我还会补一句：也别用随机数当 key，每次渲染都变，diff 失去意义纯浪费性能。答这题能带上'input 内容串位'的真实 bug，比背概念有说服力。"

**答案要点：**
- key 是 diff 时识别节点"身份"的唯一标识，帮助复用与最小化更新；不写 key 时 diff 用就地复用策略，可能造成状态错乱。
- 正确 key：业务唯一 id（后端主键），禁止用 index（列表增删/排序时节点复用错误，导致输入框内容串位）。
- 也要避免用随机数/math.random（每次渲染都变，失去 diff 意义，白性能开销）。
- v-for 可遍历数组/对象/数字，优先级（Vue2 中低于 v-if）。

**【项目案例】** 运单列表行内嵌"备注输入框"，曾用 index 做 key，删除第一行后第二行的输入内容串到了第一行——这就是经典 key 陷阱；改为 `waybillId` 后复现消失。表格多选态也依赖 key 保持行状态。

## 2-6. Vue diff 算法（★★★）

**详细回答（口述稿）：**
> "diff 算法我先讲整体：对比两个虚拟 DOM，先判断 sameVnode（key + tag 相同），命中就走 patchVnode 更新属性和子节点，没命中就新建或删除。Vue2 的关键优化是双端比较——oldStart/oldEnd/newStart/newEnd 四个指针，先尝试头头、尾尾、头尾、尾头四种移动，命中就复用节点；都不命中再用 key 建索引查复用。所以时间复杂度接近 O(n)。Vue3 又做了三个升级：静态提升（不动的节点编译期就提出来）、patchFlag（给节点打标记只更新变的部分）、最长递增子序列（移动最少次数）。答这题我会主动带工程实践：表格列配置数组在列增删时，如果不给列组件 key 会复用错误的列实例导致表头错乱，用列字段名做 key 就稳定了——diff 的复用逻辑直接决定 UI 正确性。"

**答案要点：**
- 虚拟 DOM 对比：sameVnode 判断（key + tag）→ patchVnode 做属性更新与子节点 diff。
- 双端比较（Vue2）：oldStart/oldEnd/newStart/newEnd 四个指针，先尝试头头、尾尾、头尾、尾头四种移动，命中则复用节点；都不命中时用 key 建索引查复用。
- 命中后只做移动与更新，未命中才创建新节点；**时间复杂度 O(n)**，比 React 的递归 diff 更优。
- 静态节点标记：Vue2 编译期把不含动态绑定的节点标记为静态，diff 时直接跳过。
- Vue3 的 diff 升级：静态提升、patchFlag（按需更新）、最长递增子序列算法（移动最少）。

**【项目案例】** 项目表格列配置（`head` 数组）在列增删时，如果没给列组件 key，会复用错误的列实例导致表头错乱——用列字段名做 key 后稳定；行内 `v-for` 渲染的输入框全部绑定唯一业务 id，是 diff 复用正确性的直接工程实践。

## 2-7. 组件通信方式（★★★）

**详细回答（口述稿）：**
> "组件通信我按关系分类背：父子用 props 向下、`$emit` 向上，`$refs` 拿子组件实例；兄弟或任意组件用事件总线（EventBus）或 Vuex/Pinia；跨层级用 provide/inject。再补两个组件封装层面的：`v-model` 本质是 value + input 协议（Vue3 是 modelValue + update:modelValue），还有作用域插槽——子组件把数据交还给父组件渲染。项目里 40+ 自研组件就是这套通信矩阵：表单组件统一 props 进、`$emit('change')` 出；`myTab` 菜单和路由通过 Vuex 的 componentName 共享状态；表格组件 `tableCommon` 用作用域插槽让业务页自定义操作列。答完我会强调：先想 props/emit，够不着再上 Vuex，避免滥用全局状态。"

**答案要点：**
- 父子：props 向下 / $emit 向上；`$refs`（拿实例）、`$children`。
- 兄弟/任意：事件总线（EventBus，Vue2）、Vuex/Pinia、provide/inject。
- 跨层级：provide/inject（祖先提供，后代注入，非响应式需配合 reactive）。
- 组件封装：`v-model`（`value` + `input` 或 Vue3 `modelValue` + `update:modelValue`）、`.sync` 修饰符。
- 作用域插槽（scoped slot）：父组件向子组件传递渲染内容并读取子数据。

**【项目案例】** 项目自研 40+ 组件间的通信矩阵：`mySelect`/`mycity` 等表单组件统一 props 传入 + `$emit('change')` 输出；`myTab` 多级菜单与页面路由通过 Vuex 的 `componentName`/`menuData` 状态共享；表格组件 `tableCommon` 用作用域插槽让业务页自定义操作列，是"组件库如何保持灵活"的答案。

## 2-8. Vuex 核心概念与原理（★★）

**详细回答（口述稿）：**
> "Vuex 五个核心：state 存状态、getters 是带缓存的派生状态、mutations 是唯一同步改 state 的方法、actions 处理异步然后 commit mutation、modules 做模块化。原理上它本质是'全局单例 + 响应式'——内部用 `new Vue({ data: { state } })`，所以 state 变化自动驱动组件更新，mutation 只是开发约束不是强制，开了 strict 模式才报错。适用场景是跨组件共享的复杂状态，比如用户信息、权限、菜单。项目里 App.vue 就是靠 Vuex 的 `componentName` 决定渲染哪个端入口（`<component :is>`），登录后把用户、菜单、权限 entityIds 都存进 Vuex，导航和待办用 getters 派生。这是多租户入口 + 全局状态的落地范式。Vue3 就该讲 Pinia 了：去掉了 mutations，更轻、TS 友好。"

**答案要点：**
- 五个核心：state（状态）、getters（派生状态，带缓存）、mutations（唯一改 state 的同步方法）、actions（异步，commit mutation）、modules（模块化）。
- 严格模式：`strict: true` 下非 mutation 修改 state 会报错。
- 原理：本质是全局单例 + 响应式（`new Vue({ data: { state } })`），所以 state 变化自动驱动组件更新；mutation 是约束而非强制。
- Vue3 用 Pinia：去掉 mutations（actions 即可同步可异步）、TS 友好、更轻。
- 适用：跨组件共享的复杂状态（用户信息、权限、菜单、全局配置）；简单跨组件用 provide/inject 或 props 即可。

**【项目案例】** 项目 App.vue 依赖 Vuex 的 `componentName` 决定渲染哪个端入口组件（`<component :is="componentName">`），登录后把用户信息、菜单数据、权限 `entityIds` 存入 Vuex，导航菜单与待办通过 getters 派生；这就是"多租户入口 + 全局状态"的落地范式。

## 2-9. Vue Router 原理（★★）

**详细回答（口述稿）：**
> "路由两种模式先分清：hash 模式靠 `#/xxx` 加监听 hashchange，不用服务端配置；history 模式用 HTML5 的 pushState/replaceState 加 popstate，URL 好看但部署要配回退到 index.html。核心流程是路由表匹配 path 转正则、router-view 渲染组件、导航守卫控制流程。我最想讲的是动态路由：`addRoute` 可以运行时注册，权限路由的标准做法就是登录后根据菜单动态注册。项目正是这个模式：登录拿到菜单后，`myTab` 对每个菜单项执行 `router.addRoute({ path, name, component: () => import('@/page' + urlPath) })` 再 push 跳转，页面 chunk 加载失败时捕获 Loading chunk failed 提示用户刷新——这是'权限菜单 + 懒加载'的组合最佳实践。"

**答案要点：**
- 两种模式：hash 模式（`#/xxx`，监听 hashchange，无需服务端支持）、history 模式（HTML5 History API，`pushState/replaceState` + `popstate`，需服务端回退配置）。
- 核心流程：路由表 → 路由匹配（path 转正则）→ 组件渲染（router-view）→ 导航守卫（beforeEach/afterEach）。
- 动态路由：`addRoute` 运行时注册；权限路由通常是登录后根据菜单动态注册（本项目正是此模式）。
- 路由懒加载：`component: () => import(...)`，按需加载 chunk。

**【项目案例】** 项目用 hash 模式 + **运行时动态注册路由**：登录拿到菜单后，`myTab` 组件对每个菜单项执行 `router.addRoute({ path, name, component: () => import('@/page' + urlPath) })`，再 `router.push`；页面级 chunk 加载失败时捕获"Loading chunk failed"提示用户刷新——这是"权限菜单 + 懒加载"的最佳实践。

## 2-10. Vue2 与 Vue3 的核心区别（★★★）

**详细回答（口述稿）：**
> "Vue2 到 Vue3 我按五个维度讲：第一响应式，defineProperty 换成 Proxy，新增属性、数组索引天然支持；第二 API 风格，选项式变成组合式，逻辑复用从 mixin 升级成 composable，解决命名冲突和来源不清；第三生命周期，beforeDestroy/destroyed 改名 beforeUnmount/unmounted，created 逻辑并进 setup；第四渲染，多根节点 Fragment、Teleport、Suspense，v-model 支持参数化；第五性能，静态提升、patchFlag、事件缓存，而且 tree-shaking 让包更小。项目层面我会讲技术选型的灰度策略：老平台保持 Vue2.6 稳定不动，新模块（AI 聊天、新看板）用 Vue3 独立构建验证，避免大爆炸式重构——这是 10 年经验该有的架构判断。"

**答案要点：**
- 响应式：Object.defineProperty → Proxy（支持新增属性、数组索引、性能更好）。
- 组合式 API：`setup`/`ref`/`reactive`/`computed`/`watch`，逻辑复用从 mixin 升级为 composable（useXxx），解决 mixin 命名冲突与来源不清晰。
- 生命周期：`beforeDestroy/destroyed` → `beforeUnmount/unmounted`；`created` 逻辑并入 setup。
- 渲染：Fragment（多根节点）、Teleport（传送门）、Suspense；v-model 参数化（`v-model:name`）。
- 性能：静态提升、patchFlag、事件缓存、更快更小（tree-shaking，按需引入）。
- TypeScript：Vue3 底层 TS 编写，TS 支持更好。

**【项目案例】** 公司新版本系统用 Vue3 重构，AI 聊天组件 `aiChat.js` 即为 Vue3 组合式写法；老平台（本项目）保持 Vue2.6。面试可讲"**技术选型的灰度策略**"：核心业务先不动，新模块（AI、看板）用 Vue3 独立构建验证，避免大爆炸式重构——体现 10 年经验的架构判断。

## 2-11. 组合式 API 与选项式 API（★★★）

**详细回答（口述稿）：**
> "选项式 API 按'类型'组织代码——data、computed、methods、watch 分开放，小组件很直观，但组件一大就出现'剪刀石头布'问题：同一个功能的代码被拆散到四个区块，改一个功能要上下翻。组合式 API 按'功能/业务'组织，一个功能的响应式状态、计算、方法、监听放一起，还能用 `useXxx()` 抽成可复用函数。两个细节：setup 在 beforeCreate 之前执行，此时没有 this；props 解构要用 toRefs 保响应性。对比 mixin，composable 来源清晰、无命名冲突、能传参。项目里 aiChat 的会话管理、流式输出、工具调用就分别抽成了 useSession/useStreaming/useToolCall，任何聊天页面 `useAiChat()` 一行接入——这就是组合式 API 价值的实战证明。"

**答案要点：**
- 选项式：data/computed/methods/watch 按"类型"组织，小组件直观，但复杂组件同一功能的代码被拆散（"剪刀石头布"问题）。
- 组合式：按"功能/业务"组织，一个功能的响应式状态 + 计算 + 方法 + 监听放一起，用 `useXxx()` 抽取复用。
- setup 执行时机：beforeCreate 之前，此时无 this；props 可解构需 `toRefs`；`defineExpose` 暴露给模板。
- 逻辑复用：mixin 的缺点（来源不明、命名冲突、不能传参）被 composable 解决。

**【项目案例】** aiChat 组件的会话管理、流式输出、工具调用三块逻辑分别用 `useSession`/`useStreaming`/`useToolCall` 抽取，任何聊天页面 `useAiChat()` 一行接入；而老平台混合复用还停留在 mixin 时代，这块对比是面试中"你如何理解组合式 API 的价值"的高分答案。

## 2-12. 生命周期详解（★★★）

**详细回答（口述稿）：**
> "生命周期我按'创建到销毁'串一遍：beforeCreate（不能访问 data）→ created（能访问 data，还没 DOM）→ beforeMount → mounted（DOM 就绪，操作 DOM、发请求都在这里）→ beforeUpdate/updated（数据变化重新渲染）→ beforeDestroy（解绑事件、清定时器）→ destroyed。再讲两个高频考点：一是父子执行顺序，父 beforeCreate→created→beforeMount 之后，子组件走完自己全流程，父才 mounted——所以 mounted 里拿子组件 DOM 是安全的；二是常见面试坑，mounted 和 created 都能发请求，但依赖 DOM 的必须在 mounted，而定时器和事件监听必须在 beforeDestroy 清理。项目里大屏看板就是 mounted 启动 setInterval 轮询、beforeDestroy 里 clearInterval 加清图表实例——每个钩子都对应一个真实的工程问题。"

**答案要点：**
- Vue2：beforeCreate → created（可访问 data，未挂载 DOM）→ beforeMount → mounted（DOM 就绪，可操作 DOM/发请求）→ beforeUpdate → updated → beforeDestroy（解绑事件/清定时器）→ destroyed。
- 父子执行顺序：父 beforeCreate→created→beforeMount → 子全流程 → 父 mounted；更新：父 beforeUpdate → 子 beforeUpdate→updated → 父 updated。
- 与 keep-alive：activated/deactivated 钩子。
- Vue3 对应：onBeforeMount/onMounted/onBeforeUpdate/onUpdated/onBeforeUnmount/onUnmounted。
- **常见面试坑**：mounted 里发请求 vs created 里发请求（其实都能发，mounted 可保证 DOM 相关依赖）；destroyed 里必须清定时器/事件。

**【项目案例】** 大屏看板在 mounted 启动 `setInterval` 轮询，在 `beforeDestroy` 里 `clearInterval` + 清图表实例；地图轨迹组件在 mounted 初始化 `BMap.Map`，destroyed 移除覆盖物与监听，避免"切页面后定时器还在跑、内存泄漏"——每个生命周期钩子都对应一个真实工程问题。

## 2-13. nextTick 原理（★★）

**详细回答（口述稿）：**
> "nextTick 的背景是：Vue 的 DOM 更新是异步的，数据改了不会立刻更新 DOM，而是推入队列在下一个 tick 统一更新。所以要在 DOM 更新后再操作，就调 nextTick，它会在更新循环结束后执行回调。原理上是降级方案：优先用 Promise（微任务），不支持就用 MutationObserver，再降级 setImmediate 或 setTimeout。使用场景很典型：改数据后马上要读 DOM 的高度、滚动位置。项目里两个例子：订单大屏切换'今日计划'tab 后要读新列表容器高度算滚动区，必须 nextTick 里拿；聊天组件流式输出每追加一段内容就 nextTick 滚动到底部，否则 scrollTop 拿到的还是旧高度。答完我会补一句：知道'更新是异步的'，很多'数据变了 DOM 没变'的 bug 就能一眼定位。"

**答案要点：**
- Vue 的 DOM 更新是异步的（数据变化后不是立刻更新 DOM，而是推入队列统一更新）。
- nextTick 在下次 DOM 更新循环结束后执行回调，获取最新 DOM。
- 原理：优先 `Promise`（微任务）→ `MutationObserver` → `setImmediate` → `setTimeout` 的降级方案。
- 使用场景：修改数据后立即操作 DOM、获取滚动位置、在 updated 之前拿最新高度。

**【项目案例】** 订单大屏切换"今日计划"tab 后需要读取新列表的容器高度来计算滚动区，必须在 `this.$nextTick(() => { ... })` 里拿；聊天组件流式输出每追加一段内容后 `nextTick` 滚动到底部，否则 `scrollTop` 拿到的还是旧高度。

## 2-14. v-model 原理（★★★）

**详细回答（口述稿）：**
> "v-model 本质是语法糖：对原生 input，`v-model="x"` 展开就是 `:value="x"` 加 `@input="x = $event.target.value"`。组件上 Vue2 是 `:value` + `@input`，Vue3 改成了 `:modelValue` + `@update:modelValue`，还支持 `v-model:title` 多个绑定。自定义组件要实现 v-model，就是内部声明 value prop、输入变化时 `$emit('input', newVal)`。项目里自研的表单组件 mySelect、mycity、myImport 全部实现了这个协议，业务页 `v-model="form.cityId"` 直接复用；其中 myImport 内部用 computed 桥接'显示名'和'真实值'两个字段，实现了'显示中文、提交 ID'的经典场景。答这个题关键是：讲清楚'语法糖 + 协议'两层，面试官一听就知道你真实现过组件。"

**答案要点：**
- 本质是语法糖：`<input v-model="x">` ≈ `:value="x"` + `@input="x = $event.target.value"`。
- 组件上：`v-model` = `:value` + `@input`（Vue2）；Vue3 改为 `:modelValue` + `@update:modelValue`，且支持 `v-model:title` 多绑定。
- 自定义组件实现：内部 `props: ['value']` + `$emit('input', newVal)`；表单组件常用 `computed` 的 getter/setter 做桥接。
- `.lazy/.number/.trim` 修饰符；`.sync`（Vue2 的另一种双向同步）已被 Vue3 的多个 v-model 取代。

**【项目案例】** 项目自研表单组件（mySelect/mycity/myImport）全部实现 `value` + `input` 协议，业务页 `v-model="form.cityId"` 即可复用；`myImport` 内部用 computed 桥接"显示名与真实值"两个字段，实现"显示中文、提交 ID"的经典场景。

## 2-15. keep-alive 原理与用法（★★）

**详细回答（口述稿）：**
> "keep-alive 就是缓存组件实例和状态，避免切走再回来时整个重建。三个配置：include/exclude 按组件 name 匹配哪些要缓存，max 限制最大缓存数走 LRU 淘汰。生命周期上，首次进入走 created→mounted→activated，再次进入只走 activated，所以'每次回来要刷新的逻辑'写在 activated 里。原理内部就是 LRU Cache 存 vnode，命中直接渲染不走销毁重建。最典型场景是列表页跳详情返回保留筛选条件和页码——项目里货主端订单列表就是这么干的，用 include 精确到页面 name，max 设 20 防缓存膨胀。答完我会强调：keep-alive 不是拿来就用，要配合 include 白名单和 max 上限，否则缓存泄漏比重建还可怕。"

**答案要点：**
- 缓存组件实例与状态，避免重复渲染；配合 `include/exclude`（按 name 匹配）与 `max`（最大缓存数，LRU 淘汰）。
- 触发 `activated/deactivated`；首次进入 created→mounted→activated，再次进入只走 activated。
- 原理：内部用 LRU Cache 保存 vnode，命中时直接从缓存渲染（不走销毁重建）。
- 适用：tab 多页签系统（本项目 myTab 正是这种场景）、列表跳详情返回保留滚动位置。

**【项目案例】** 货主端订单列表跳详情后返回要保留筛选条件与页码——对列表页路由组件启用 keep-alive 并 `include` 精确到页面 name；`max: 20` 防止 tab 开太多导致缓存膨胀。这是"多页签 + 状态保留"最典型的工程答案。

## 2-16. 插槽（slot）体系（★★）

**详细回答（口述稿）：**
> "插槽分三种：默认插槽放内容、具名插槽 `slot name="header"` 区分位置、作用域插槽 `slot :row="row"` 让子组件把内部数据交还给父组件渲染。作用域插槽是组件库开放的灵魂——通用组件不知道业务长什么样，但可以'把数据给你，你来决定怎么画'。语法上注意 Vue2.6 之后统一用 `v-slot`，`slot-scope` 已废弃。项目里 `tableCommon` 表格组件就是教科书案例：列渲染支持默认文本、formatter、以及作用域插槽 `#操作="{ row }"`，业务页自定义编辑/删除/打印按钮还能拿到当前行数据；myTab 的菜单图标位用具名插槽让各端注入自定义图标。答这个题我会强调：组件库能不能被业务接受，一半看插槽设计得好不好。"

**答案要点：**
- 默认插槽 / 具名插槽（`<slot name="header">`）/ 作用域插槽（`<slot :row="row">`，父组件用 `v-slot="{ row }"` 或 `#default="{ row }"`）。
- 作用域插槽让子组件把内部数据"交还给"父组件渲染，是组件库开放的灵魂。
- `$slots/$scopedSlots` 判断插槽是否传入；动态插槽名 `<slot :name="dynamicName">`。
- Vue2.6 后 `slot-scope` 废弃统一为 `v-slot`。

**【项目案例】** `tableCommon` 表格组件：列渲染支持默认文本、`formatter`、以及作用域插槽 `#操作="{ row }"`，业务页自定义"编辑/删除/打印"按钮并拿到当前行数据；`myTab` 的菜单图标位提供具名插槽，各端可注入自定义图标。这是"用插槽把通用组件做出个性化"的教科书案例。

## 2-17. mixin 与组合式函数的取舍（★★）

**详细回答（口述稿）：**
> "mixin 的问题一句话：选项合并、命名不隔离。同名方法组件优先倒是小事，最痛的是来源不清晰——页面里一个 `init()` 到底是哪来的？多个 mixin 还互相覆盖，排查极痛苦。Vue3 的组合式函数就干净：显式传参、返回结果，来源一目了然，还能 tree-shaking、嵌套组合。我的取舍建议：简单的公共逻辑（比如拿当前用户）mixin 也能凑合；但业务逻辑复用一律 composable。项目里真实踩过：老平台把分页加载、格式化、导出抽成 pageMixin 给 40+ 列表页复用，后来两个 mixin 都定义了 init()，业务页根本不知道调哪个，最后约定 mixin 方法统一 `_` 前缀才缓解；新 Vue3 系统全部改成 usePagination/useTable，从机制上根治。"

**答案要点：**
- mixin：选项合并，同名冲突时组件优先；缺点是命名空间不隔离、来源不清晰、多个 mixin 互相覆盖难排查。
- 组合式函数（Vue3 composable）：显式传参返回结果，来源清晰、可 tree-shaking、支持嵌套组合。
- 建议：简单公共逻辑（如"获取当前用户"）可用 mixin；业务逻辑复用一律 composable。
- Vue3 中仍可用 mixin（Options API），但官方推荐 composable。

**【项目案例】** 老平台（Vue2）把"分页加载、格式化、导出"抽成 `pageMixin` 给 40+ 列表页复用，但曾出现两个 mixin 都定义了 `init()` 导致业务页不知调哪个——后来在文档中约定 mixin 方法统一 `_` 前缀；新 Vue3 系统则全部改为 `usePagination`/`useTable` 组合式函数，从机制上解决命名冲突。

## 2-18. provide / inject（★★）

**详细回答（口述稿）：**
> "provide/inject 是跨层级传值方案：祖先 provide 数据，任意深度的后代 inject 使用，省掉一层层传 props 的繁琐。两个注意点：默认是非响应式的，Vue3 里 provide 一个 ref 或 reactive 才能响应式；还有它数据来源不显式，调试不直观，不能到处滥用。最经典的业界案例就是 Element UI：el-form 和 el-form-item 就是靠 provide/inject 共享校验规则和表单上下文。项目里我们自研的 myForm 组件复刻了这个模式——通过 provide 把校验规则、禁用态、表单 model 注入给内部 myFormItem，实现跟 Element UI 一样的外观校验联动架构。我会补一句：我们自己把 el-form 的架构复刻了一遍，所以对这个 API 的理解不是背出来的。"

**答案要点：**
- 祖先组件 provide 数据，任意后代 inject 使用，解决深层传递 props 的繁琐。
- 默认非响应式；Vue3 中 provide 一个 ref/reactive 可实现响应式（Vue2 中也可 provide 一个响应式对象，但约定要提供 setter 方法）。
- 应用：跨层级主题/国际化/表单上下文（如 Element UI 的 el-form 与 el-form-item 就是 provide/inject）。
- 缺点：数据来源不显式，调试不直观，不适合到处滥用。

**【项目案例】** 自研表单组件组：`myForm` 通过 provide 把"校验规则、禁用态、表单 model"注入给内部 `myFormItem`，实现与 Element UI 相同的外观/校验联动架构——`el-form` 的 provide/inject 模式在项目里被复刻过一次，足以证明对这个 API 的理解深度。

## 2-19. 异步组件与路由懒加载（★★）

**详细回答（口述稿）：**
> "路由懒加载就是 `component: () => import('./X.vue')`，webpack 会把它打成独立 chunk，路由访问到才加载，这是首屏优化的核心手段。异步组件三种写法：工厂函数、Promise 工厂、Vue3 的 defineAsyncComponent（支持 loading/error 组件和超时）。工程细节是 `/* webpackChunkName: "xxx" */` 注释可以控制 chunk 命名，方便分析体积。项目里 1780 个文件、40+ 页面全部路由懒加载：myTab 动态注册路由时 `() => import('@/page' + item.urlPath)` 自动分包；大屏单独 chunk；导出库 excelOut 用组件级懒加载不进首屏主包。效果是主包从 4.2MB 降到 1.1MB。答这题我会强调'路由级 + 组件级 + 按需引入'三层，缺一层都不完整。"

**答案要点：**
- `component: () => import('./X.vue')` 打包成独立 chunk，路由访问时按需加载。
- 异步组件三种写法：工厂函数、Promise 工厂、`defineAsyncComponent`（Vue3，支持 loading/error 组件与超时）。
- 结合 webpack 动态 import 的 `/* webpackChunkName: "xxx" */` 注释控制 chunk 命名，便于分析体积。
- 首屏优化核心手段：路由级懒加载 + 组件级懒加载 + 按需引入 UI 库。

**【项目案例】** 项目 1780 文件、40+ 页面全部路由懒加载：myTab 动态注册路由时 `component: () => import('@/page' + item.urlPath)` 自动分包；大屏页面单独 chunk 并在低峰加载；`excelOut` 导出库用 `import('@/utils/excelOut')` 组件级懒加载，让导出插件不进入首屏主包——主包从 4.2MB 降到 1.1MB（配合按需引入与 gzip）。

## 2-20. 自定义指令的实现（★★★）

**详细回答（口述稿）：**
> "自定义指令是操作 DOM 的钩子集合：Vue2 有 bind/inserted/update/unbind 五个钩子，Vue3 简化成 mounted/updated/unmounted。每个钩子收三个参数：el（真实 DOM）、binding（value/arg/modifiers）、vnode。适用场景很明确——纯 DOM 操作：权限控制、自动聚焦、水印、复制、懒加载。项目里权限体系就是自定义指令的极致应用：`v-entity` 指令读取 localStorage 里的 entityIds 权限数组，如果元素绑定的权限 id 不在数组里就 `el.remove()` 直接移除按钮；`v-entitys` 支持多权限'或'匹配；还支持 `:entityId` 动态传参按路由 pId 映射。同目录还封装了只能输数字、允许百分比的输入校验指令。答这个题我会强调：指令是做'DOM 层能力复用'的，跟组件形成两个复用层。"

**答案要点：**
- 钩子（Vue2）：bind/inserted/update/componentUpdated/unbind；Vue3 简化为 mounted/updated/unmounted 等。
- 三个参数：el（DOM）、binding（value/arg/modifiers）、vnode。
- 典型应用：权限控制、自动聚焦、水印、点击外部关闭、复制、懒加载、滚动加载、长按。
- 与组件对比：指令面向"纯 DOM 操作"，组件面向"带模板的 UI 单元"。

**【项目案例】** 项目权限体系的核心就是自定义指令：`directive.js` 注册 `v-entity`——读取 `localStorage.entityIds`（权限 id 数组），若当前元素的 `entityId` 不在数组中则 `el.remove()` 直接移除按钮；`v-entitys` 支持多权限"或"匹配；指令还支持动态传参（`:entityId` 按路由的 pId 映射）。同一目录还封装了 `mynumval`（只能输入数字）、`mypmnumval`（允许百分比）等输入校验指令——这是"自定义指令在企业权限系统落地"的最完整案例。

## 2-21. 虚拟 DOM 的价值（★★）

**详细回答（口述稿）：**
> "虚拟 DOM 用 JS 对象描述真实 DOM（tag/props/children），通过 diff 最小化更新真实 DOM。它的价值有三个：一是跨平台，同一套渲染描述能跑 Web、小程序、原生、服务端；二是批量更新，把多次操作合并成一次真实 DOM 修改，减少重排次数；三是抽象渲染层，让框架可以独立演进。当然它也有代价——内存开销和 diff 计算，简单场景直接操作 DOM 可能更快。这题我会主动讲'什么时候不该用虚拟 DOM'：我们项目的数据表格就用服务端分页，每页 20 行，因为业务列表是'查询-替换'型更新，用真实表格组件加分页更简单；而大屏看板这种每 5 秒整体替换数据的场景，才是 diff 批量更新的优势区——能讲清边界才是真懂。"

**答案要点：**
- 虚拟 DOM 是 JS 对象描述真实 DOM（tag/props/children），通过 diff 对比最小化更新真实 DOM。
- 价值：①跨平台（Web/小程序/原生/服务端，同一套渲染描述）②diff 批量更新减少重排次数 ③抽象渲染层，框架可独立演进。
- 代价：有内存开销与 diff 计算；简单场景直接操作 DOM 可能更快，但工程可维护性差。
- Vue3 通过 patchFlag/静态提升把 diff 开销压到极致。

**【项目案例】** 项目的数据表格不是虚拟 DOM 而是服务端分页（每页 20 行），理由很直接：虚拟 DOM 解决的是"大规模频繁更新"问题，业务列表是"查询-替换"型更新，用真实表格组件 + 分页更简单；而大屏看板这种"每 5 秒整体替换数据"的场景，正是 diff 批量更新优势区。面试讲"什么时候不该用虚拟 DOM"反而是加分项。

## 2-22. 自定义指令的实际应用场景（★★）

**详细回答（口述稿）：**
> "自定义指令的应用场景非常多：权限控制、自动聚焦、输入校验、水印、防连点（指令里做防抖）、点击外部关闭、图片懒加载。核心原则是指令保持纯粹——只做 DOM 操作，业务逻辑交给组件或方法。项目里我们建了一整套指令库：`v-entity` 权限指令（读写 localStorage 权限数组控制按钮显隐）、`v-focus` 弹窗打开自动聚焦、`v-debounce` 列表筛选输入防抖、`v-watermark` 财务账单加水印防截图泄露、还有数字输入指令控制货量重量只能输数字限小数位。我会强调：这套指令库是组件库之外的第二个复用层，把 DOM 层的能力沉淀下来跨页面复用——组织代码的思路比单个 API 更值钱。"

**答案要点：**
- 权限（v-permission/v-entity）、自动聚焦、输入校验、水印、防连点（指令内做防抖）、点击外部关闭、图片懒加载、骨架屏、表单防重复提交。
- 指令保持纯粹：只做 DOM 操作，业务逻辑交给组件/方法。

**【项目案例】** 除 `v-entity` 权限指令外，项目还有：`v-focus`（弹窗打开自动聚焦）、`v-debounce`（列表筛选输入防抖）、`v-watermark`（财务账单页加水印防截图泄露）、数字输入指令（货量/重量只能输数字且限小数位）。一套指令库 = 跨页面复用的 DOM 层能力，这是组件库之外的第二个复用层。

## 2-23. Vue 性能优化实践（★★）

**详细回答（口述稿）：**
> "Vue 性能优化我按四个层面讲：渲染层——合理用 v-if/v-show、v-for 加 key、computed 缓存、`Object.freeze` 冻结只读大数据、需要时用 shallowRef 减少深层代理；加载层——路由懒加载、组件按需引入、gzip、CDN 分离公共库；更新层——keep-alive 缓存列表、函数式组件、v-once/v-memo；数据层——大数据列表分页或虚拟滚动、别把不参与渲染的大对象塞进 data。项目里的实战三板斧：订单/库存大列表服务端分页每页 20 条；报表图表用 canvas 的 ECharts 而不是堆 DOM；字典数据 `getSysStaticData` 返回几千条基础数据，放进 data 前用 `Object.freeze` 冻结，省掉 defineProperty 递归劫持的开销——这是'冻结优化'最实用的一个点，很多面试官都等着听这个。"

**答案要点：**
- 渲染层：合理 v-if/v-show、v-for 加 key、computed 缓存、`Object.freeze` 冻结只读大数据、避免无意义深层响应式（`shallowRef`）。
- 加载层：路由懒加载、组件按需引入、gzip、CDN 分离公共库、`webpackChunkName` 分包。
- 更新层：keep-alive 缓存列表、函数式组件、`v-once`/`v-memo`（Vue3）、事件缓存。
- 数据层：大数据列表分页/虚拟滚动、避免在 data 中放不参与渲染的大对象。
- 工具：vue-devtools Performance 面板、`performance.mark` 埋点。

**【项目案例】** 项目大数据渲染三板斧：①订单/库存大列表服务端分页（每页 20 条）②报表图表用 canvas 而非大量 DOM（ECharts）③字典数据（`getSysStaticData` 返回的几千条基础数据）放入 data 前用 `Object.freeze` 冻结，省掉 defineProperty 递归劫持的开销——这是"冻结优化"最实用的一个点。

## 2-24. 响应式数据深层的坑（★★）

**详细回答（口述稿）：**
> "Vue2 响应式的坑就三类：数组索引赋值和改 length 不触发更新；对象新增和删除属性不触发更新；深层嵌套数据每次 setter 都触发依赖有性能损耗。解法分别是：数组用 $set 或重写数组；对象新增属性用 `this.$set`（本质是 Vue.set 的实例方法）；大数据用 Object.freeze 跳过劫持。Vue3 用 Proxy 没这些烦恼，但注意 reactive 解构会丢响应性，要用 toRefs。项目里真实案例：运单状态流转后要改 `order.status` 再新增 `order.trackPoints` 字段，直接赋值不渲染，`this.$set(order, 'trackPoints', [])` 才生效——这条 bug 排查了半小时，本质就是'对象新增属性不响应'。我会说：这些坑不是背的，是拿半小时换来的。"

**答案要点：**
- 数组索引赋值、修改 length 不触发更新。
- 对象新增/删除属性不触发更新（Vue2）。
- 深层嵌套数据修改性能：每次 setter 都触发依赖，大数据 `Object.freeze` 可跳过。
- 响应式劫持后对象性能下降（getter/setter 拦截开销）；`Date`、`RegExp` 等特殊对象。
- `this.$set` 是 `Vue.set` 的实例方法；Vue3 无此烦恼但注意 reactive 解构丢失响应性。

**【项目案例】** 项目真实修复：运单状态流转后要改 `order.status` 并新增 `order.trackPoints` 字段——直接赋值不渲染，`this.$set(order, 'trackPoints', [])` 后才生效；这条 Bug 排查了半小时，本质就是"对象新增属性不响应"的经典案例。

## 2-25. props 单向数据流（★★）

**详细回答（口述稿）：**
> "props 单向数据流就是说：父传子的 props 子组件不能直接改，改了 Vue 开发模式会告警，而且数据来源会乱套。子组件想'改'有三个正确姿势：一是本地 data 副本，props 进来拷贝一份再改；二是 computed 派生；三是 `$emit` 通知父组件改。引用类型 props 虽然能直接改穿对象，但那是违反约定，应视为只读。项目里表格组件的 `head` 列配置由业务页传入，组件内部从不修改 props，只读后复制到内部状态再增删列——正是这条约束，让 40+ 业务页共享同一个表格组件而不互相污染。我会强调：单向数据流不是限制，是'可预测性'的保障——数据往哪走、谁改的，一眼能看穿。"

**答案要点：**
- 父传子 props 是单向的：子组件不能直接改 props，否则 Vue 告警（开发模式）且数据来源混乱。
- 需要改时：本地 data 副本（`props: v` → `data: () => ({ local: this.v })`）、computed、`$emit` 通知父组件改。
- 引用类型 props 虽然"能改"，但违反约定且难以追踪，应视为只读。

**【项目案例】** 表格组件的 `head` 列配置由业务页传入，组件内部**从不修改 props**，只读后复制到内部状态再增删列——正是单向数据流约束让 40+ 业务页共享同一表格组件而不互相污染。

## 2-26. scoped 样式与样式穿透（★★）

**详细回答（口述稿）：**
> "scoped 的原理是编译时给元素加 `data-v-xxx` 唯一属性，样式选择器自动补上属性选择器实现隔离。它带来的问题是子组件根节点外的内部样式改不了——因为子组件内部节点没有父级的 data-v 属性。三种解法：`::v-deep`（或 Vue3 的 `:deep()`）穿透、全局样式单独文件、或者直接不 scoped。项目里封装 Element UI 表格时经常要调内部表头高度、斑马纹、悬浮色，就是 `::v-deep` 穿透的典型场景。我的建议：scoped 一定要开，穿透要克制，能不改库内部样式就不改——改多了升级组件库必炸。"

**答案要点：**
- scoped 通过给元素加 `data-v-xxx` 属性 + 属性选择器实现样式隔离。
- 子组件根节点会被父作用域 scoped 影响（Vue2 特性）；普通子元素不受父 scoped 影响。
- 样式穿透：`::v-deep`（Vue2.6+）/`>>>`/`/deep/`，用于覆盖子组件或第三方组件内部样式。
- 原理：`::v-deep .child {}` 编译为 `[data-v-xxx] .child {}`。

**【项目案例】** 项目大量覆盖 Element UI/Vant 组件内部样式：`::v-deep .el-table__header` 调整表头背景、`::v-deep .el-dialog` 改弹窗宽度；地图组件 `mapDialog` 里穿透样式控制百度地图的 InfoWindow 气泡样式。

## 2-27. 函数式组件（★）

**详细回答（口述稿）：**
> "函数式组件就是纯展示组件：没有 data、没有 this、没有生命周期，只接收 props 和 context，渲染开销极小。适用场景是简单列表项、单元素渲染这类高频调用且无状态的 UI。Vue2 用 `functional: true` 标记，Vue3 不推荐了——普通组件编译后性能已经足够，除非特别追求极致。项目里大屏看板的列表单行、轨迹点的信息气泡这类高频纯展示，用函数式组件省掉实例化开销；但业务组件不会用，因为要状态。我会总结：函数式组件是'性能换功能的取舍'，现在大部分场景 VNode 复用就够，知道它存在、知道何时用，比会用更重要。"

**答案要点：**
- 无状态（无 data）、无实例（无 this）、无生命周期，仅接收 props 与 context。
- 优点：渲染开销极小，适合高频渲染的纯展示节点（列表项、气泡）。
- Vue2 写法：`functional: true` + render 函数 或 `functional` 模板属性；Vue3 可用 `() => h()` 简单函数组件。
- 与普通组件对比：函数式组件不建实例，diff 时直接返回 vnode。

**【项目案例】** 表格单元格的金额/时间格式化列用函数式组件渲染（只根据 props 返回格式化文本），在几千行大表格中避免创建几万个组件实例——这是"极端渲染优化"的最后一档手段，面试可主动提一句体现性能敏感度。

## 2-28. 动态组件与递归组件（★）

**详细回答（口述稿）：**
> "动态组件就是 `<component :is="xxx">`，is 可以是组件名或组件对象，运行时切换组件实例，常配合 keep-alive 缓存状态。递归组件就是组件模板里调自己，必须给组件配 `name`，用来渲染树形结构。项目里两个都是重头戏：App.vue 用 `<component :is="componentName">` 切换五个端入口（pt 平台、hz 货主、edu 大学、wx 微信）——这是动态组件的架构级应用；菜单树 `menuTree` 就是递归组件，后端给无限层级菜单数据，组件递归渲染展开收起。答这题我会重点讲动态组件在'一个 SPA 多端入口'里的作用，这是把基础 API 用出架构味道的案例。"

**答案要点：**
- 动态组件：`<component :is="currentComponent">`，根据状态切换组件实例；配合 keep-alive 缓存。
- 递归组件：组件模板内引用自身（必须有 name），用于树形结构（菜单树、组织树、评论楼）。
- 递归终止条件：数据层通过 children 是否存在控制；注意 key 避免重复渲染。

**【项目案例】** ①`App.vue` 用 `<component :is="componentName">` 根据 Vuex 状态渲染 pt/hz/edu/wx 五个端入口——这是动态组件最极致的应用；②`tree`/`treeV2` 树组件内部递归渲染节点，配合 `v-entity` 权限控制菜单显隐，支撑组织架构树与菜单树。

## 2-29. SSR 与预渲染（★）

**详细回答（口述稿）：**
> "SSR 是服务端渲染完整 HTML 再交给浏览器，首屏快、SEO 好，但代价是服务器计算、Node 同构代码复杂度、部署变重；预渲染（prerender-spa-plugin）是构建时对指定路由生成静态 HTML 快照，适合内容基本固定的页面，比 SSR 轻量得多。选型逻辑很清楚：纯工具系统（登录后才能用）不需要 SEO，用 SPA + 骨架屏就行；有营销页、需要被搜索引擎收录的才考虑预渲染或 SSR。项目是物流 SaaS 平台，内部系统加订单大屏，没有 SEO 诉求，所以走 SPA 加按需加载；H5 活动推广页因为要分享传播，考虑过预渲染。答这题我会强调：SSR 不是炫技，是'SEO 和首屏诉求驱动'的工程决策。"

**答案要点：**
- SSR（Nuxt/Next）：服务端渲染 HTML，利于 SEO 与首屏；代价是服务器成本、Node 环境、同构代码复杂度。
- 预渲染（prerender-spa-plugin）：构建期对固定路由生成静态 HTML，适合"几乎不变"的页面。
- SPA 无 SEO 问题（搜索引擎已支持 JS 渲染，但 SEO 权重与首屏仍不如 SSR）。
- 适用决策：C 端营销页/公开内容 → SSR 或预渲染；后台系统 → SPA。

**【项目案例】** 项目是物流 SaaS 后台系统，用户登录后才能用，无 SEO 需求，所以坚定选择 SPA + 懒加载；H5 活动推广页则用预渲染出静态 HTML 提升微信分享卡片加载速度。面试可讲"技术选型看业务场景"的决策逻辑。

## 2-30. 状态管理选型（Vuex / Pinia / 其他）（★）

**详细回答（口述稿）：**
> "状态管理选型我按'项目的共享状态复杂度'判断。Vuex 适合复杂大型应用：模块化、严格模式强制 mutation 改状态，但样板代码多；Pinia 是 Vue3 的官方推荐：去掉 mutations、getters/actions 平铺、原生 TS 支持、devtools 体验更好，代码量明显少。项目是 Vue2.6，所以用 Vuex 管理多租户入口、用户信息、权限、菜单这些全局状态，走标准 action→mutation→state 单向流，开严格模式防止乱改；新 Vue3 的 aiChat 这类模块我直接考虑 Pinia。我会补充自己的原则：能组件内解决的绝不上全局 store，全局 store 只放'多页面共享 + 需要响应式联动'的状态，避免把组件通信问题全部倒进全局状态。"

**答案要点：**
- Vuex：成熟稳定、模块化、严格模式，但样板代码多、TS 支持一般。
- Pinia：Vue3 官方推荐，去 mutation、TS 友好、体积小、devtools 优秀。
- 什么时候需要：多组件共享复杂状态（用户、权限、全局配置）、跨页状态（筛选条件、路由状态）；简单的父子通信不要引入。
- 替代方案：props/emit、provide/inject、EventBus、以及"组合式函数 + ref 提升"（`useSharedState`）。

**【项目案例】** 项目用 Vuex 管理"当前端（componentName）、用户信息、菜单、待办数、权限 entityIds"，任何页面 `this.$store.commit('setMenuData', ...)` 更新；新 Vue3 项目改用 Pinia + composable。面试时可补一句：状态量级小的话，一个 `useSharedState()` 组合式函数就能替代 Vuex，体现"不盲目上状态库"的克制。

---

> 下一篇： [03-工程化与性能优化.md](./03-工程化与性能优化.md)
