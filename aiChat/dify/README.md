# Dify 对接说明（demo 验证链路）

本文档说明前端 `aiChat` 组件如何与本地 Dify Chatflow（对话流）应用打通，
实现"聊天输入 → Dify 知识库/LLM 语义匹配 → 返回结构化 JSON（含接口+参数）→
前端经 `common.postUrl` 调用现有后端接口 → 结果展示"的完整链路。

## 一、整体架构

```
用户聊天输入
   ↓
aiChat.vue 消息区
   ↓
aiChat.js sendMessage
   ↓  (provider: 'dify')
providers/dify.js  buildRequest
   ↓
fetch /dify-api/v1/chat-messages（SSE 流式，走 vite 代理到本地 Dify）
   ↓
parseStreamLine 解析 SSE
   ├─ message 事件      → 增量 answer 文本，逐字播放
   └─ message_end 事件  → 提取 outputs.tool_calls 结构化 JSON
        ↓
dify/difyExecutor.js  executeDifyToolCalls
        ↓
common.postUrl(beanName, methodName, params) 调用后端统一网关
        ↓
baseTool.formatToMarkdown 格式化为 Markdown 表格
        ↓
追加到 AI 回复展示
```

## 二、Dify 端配置约定（重要）

前端依赖 Dify Chatflow 应用在 `message_end` 事件中通过 **`outputs.tool_calls`** 变量输出结构化调用 JSON。

### 1. Chatflow 编排建议

在本地 Dify 中创建 **Chatflow 应用**，编排大致如下：

1. **开始节点**：接收 `sys.query`（用户输入）
2. **知识库检索节点（Retrieval）**：挂载你的知识库，用 `sys.query` 检索
3. **LLM 节点**：把检索结果 + 用户问题作为上下文，让 LLM 判断该调用哪个业务接口，并输出结构化 JSON
4. **结束节点**：将 LLM 输出写入变量 **`tool_calls`**（结束节点变量名必须为 `tool_calls`）

### 2. LLM 输出 Schema 约定

LLM 节点必须输出**固定 schema**，前端才能解析。推荐在 LLM 节点系统提示词中强制约定：

```text
你是业务接口调用助手。请根据用户问题和检索到的知识，判断需要调用哪个业务接口。
只输出 JSON，不要输出任何解释文字。输出格式如下：

[
  {
    "beanName": "后端服务bean名",
    "methodName": "服务方法名",
    "params": { "参数1": "值1", "参数2": "值2" }
  }
]

示例：
[{"beanName":"staffService","methodName":"queryStaffPage","params":{"staffName":"张三","page":1,"rows":5}}]

如果无法确定调用哪个接口，输出空数组 []。
```

前端在 `providers/dify.js` 中已做 JSON 容错解析：
- 兼容数组 / 单对象
- 兼容 markdown 代码块 ` ```json ... ``` ` 包裹
- 兼容字符串被多余前后文本包裹

### 3. `outputs.tool_calls` 结构

```json
[
  { "beanName": "staffService", "methodName": "queryStaffPage", "params": { "staffName": "张三", "page": 1, "rows": 5 } }
]
```

## 三、前端接口白名单

出于安全考虑，前端**只允许调用已在 `dify/difyExecutor.js` 中注册的接口**（白名单机制）。
未注册的接口名会被拒绝，返回安全提示。

当前已注册接口（见 `registerDefaultInterfaces()`）：

| beanName      | methodName       | 说明     |
|---------------|------------------|----------|
| staffService  | queryStaffPage   | 员工查询 |

如需开放更多接口，在 `dify/difyExecutor.js` 的 `registerDefaultInterfaces()` 中追加
`registerInterface({ beanName, methodName, displayFields, briefFields, title })` 即可。

## 四、前端配置

### 1. vite 代理（vite.config.js）

已新增 `/dify-api` 代理到本地 Dify 服务：

```js
"/dify-api":{
  target: "http://localhost",   // 本地 Dify 服务地址，按实际部署调整
  changeOrigin: true,
  rewrite: (path) => path.replace(/^\/dify-api/, ''),
}
```

### 2. demo 页接入

`src/page/demo/aiChat/aiChat.vue` 已默认以 `provider: 'dify'` 接入。
启动后需要填写 Dify 的 API Key（右上角"API Key"按钮），Key 形如 `app-xxxxx`。

## 五、本地 Dify 请求格式参考

前端实际发送的请求（`providers/dify.js` 的 `buildRequest`）：

```http
POST /dify-api/v1/chat-messages
Authorization: Bearer {api_key}
Content-Type: application/json

{
  "inputs": {},
  "query": "用户当前提问",
  "response_mode": "streaming",
  "conversation_id": "",        // 多轮会话 ID，首轮为空，之后回传
  "user": "web-ai-chat",
  "files": []
}
```

## 六、验证步骤

1. 确保本地 Dify 服务已启动，Chatflow 应用已按第二节配置好
2. 启动前端：`npm run dev`
3. 打开 `aiChat` 菜单，点击右上角"API Key"填入 Dify API Key
4. 输入如"查询员工张三的基本信息"，观察：
   - Dify 知识库检索命中 → LLM 输出 `outputs.tool_calls`
   - 前端解析后调用 `staffService.queryStaffPage`
   - 结果以 Markdown 表格展示
