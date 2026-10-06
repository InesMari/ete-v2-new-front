/**
 * 本地 Dify Chatflow（对话流）适配器
 *
 * 对接本地 Dify 的 Chatflow 应用（含知识库检索 + LLM），通过 /v1/chat-messages 流式接口交互。
 * 用于：聊天输入 → Dify 知识库/LLM 语义匹配 → 返回结构化 JSON（含接口+参数）→ 前端调用现有后端接口。
 *
 * API: POST /v1/chat-messages
 *   headers: Authorization: Bearer <api_key>
 *   body: {
 *     inputs: {},                // 对话流输入变量
 *     query: "用户提问",          // 用户当前问题
 *     response_mode: "streaming",
 *     conversation_id: "",       // 多轮会话 ID（首轮为空）
 *     user: "前端用户标识"
 *   }
 *
 * 流式 SSE 事件：
 *   - message       → data.answer 为增量文本
 *   - message_end   → data.outputs 包含对话流最终变量（如 outputs.tool_calls 结构化 JSON）
 */
export const difyProvider = {
  name: 'dify',
  label: 'Dify 知识库',

  /** Dify 流式返回的是增量文本（answer 即 delta） */
  accumulatedContent: false,

  /** API Key 获取地址（本地 Dify 应用访问凭证） */
  apiKeyUrl: 'http://localhost/console/apis/keys',

  defaultSystemPrompt: '',

  defaultQuickPrompts: [
    '查询员工张三的基本信息',
    '我想了解社保缴纳的相关政策',
    '帮我查一下员工的薪资结构'
  ],

  defaultWelcomeText: '我是接入本地 Dify 知识库的智能助手，可以通过聊天匹配知识库并调用业务接口帮你查询',

  /** 构建 fetch 请求配置 */
  buildRequest({ messages, apiKey, signal, conversationId, user, extraInputs }) {
    // 取最后一条用户消息作为本次 query（兼容现有 aiChat 传 messages 的契约）
    let query = ''
    if (Array.isArray(messages) && messages.length > 0) {
      for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].role === 'user' && messages[i].content) {
          query = messages[i].content
          break
        }
      }
    }

    const body = {
      inputs: extraInputs || {},
      query,
      response_mode: 'streaming',
      conversation_id: conversationId || '',
      user: user || 'web-ai-chat',
      files: []
    }

    return {
      // 通过 /dify-api 代理访问本地 Dify（vite.config.js 中配置）
      url: '/dify-api/v1/chat-messages',
      options: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(body),
        signal
      }
    }
  },

  /**
   * 从 Dify 流式 SSE 行中提取内容
   *
   * @param {object} data - 解析后的 JSON 对象
   * @returns {string|null|object}
   *   - message 事件        → 返回增量 answer 文本
   *   - message_end 事件    → 返回 { type:'tool_calls', toolCalls:[...] }（结构化调用）
   *   - 其他事件/异常        → 返回 null
   */
  parseStreamLine(data) {
    if (!data || typeof data !== 'object') return null

    try {
      const event = data.event

      // 增量文本事件
      if (event === 'message') {
        const answer = data.answer
        return typeof answer === 'string' ? answer : null
      }

      // 流结束事件：从 outputs 提取结构化调用 JSON
      if (event === 'message_end') {
        const toolCalls = extractToolCalls(data)
        if (toolCalls && toolCalls.length > 0) {
          return { type: 'tool_calls', toolCalls }
        }
        return null
      }

      return null
    } catch (e) {
      console.error('[Dify] parseStreamLine 解析失败:', e)
      return null
    }
  }
}

/**
 * 从 Dify message_end 事件中提取结构化调用列表
 *
 * 约定：Dify Chatflow 的 LLM 节点输出固定 schema 到 outputs.tool_calls，形如：
 *   [ { "beanName":"staffService", "methodName":"queryStaffPage", "params":{...} } ]
 * 兼容单对象 / 数组 / JSON 字符串 / markdown 代码块包裹 / outputs 嵌套等多种形态。
 *
 * @param {object} messageEndData - message_end 事件数据
 * @returns {Array<{beanName:string, methodName:string, params:object}>|null}
 */
function extractToolCalls(messageEndData) {
  console.log('messageEndData', messageEndData)
  const outputs = messageEndData?.outputs || messageEndData?.data?.outputs || {}
  if (!outputs) return null

  // 优先取约定变量 tool_calls，其次兜底遍历 outputs 找可解析字段
  const raw = outputs.tool_calls ?? outputs.toolCall ?? outputs.tool_calls_json

  let parsed = null
  if (typeof raw === 'string') {
    parsed = parseJsonFuzzy(raw)
  } else {
    parsed = raw
  }

  if (!parsed) return null

  // 归一化为数组并校验每个调用是否具备 beanName/methodName
  const list = Array.isArray(parsed) ? parsed : [parsed]
  const calls = list.filter(c => c && typeof c === 'object' && c.beanName && c.methodName)
  if (calls.length > 0) return calls

  // 嵌套结构兜底（如 outputs.tool_calls 又包了一层）：递归收集
  return collectToolCalls(parsed)
}

/**
 * 递归收集对象树中所有具备 beanName + methodName 的调用对象
 * 兼容 {outputs:{tool_calls:{...}}} 等多层嵌套形态（避免深遍历死循环限制 6 层）
 */
function collectToolCalls(node, depth = 0, result = []) {
  if (!node || typeof node !== 'object' || depth > 6) return result
  if (node.beanName && node.methodName) {
    result.push(node)
    return result
  }
  if (Array.isArray(node)) {
    for (const item of node) collectToolCalls(item, depth + 1, result)
  } else {
    for (const key of Object.keys(node)) collectToolCalls(node[key], depth + 1, result)
  }
  return result
}

/**
 * 兜底：从流式累积的完整 answer 文本中提取结构化调用列表
 *
 * 当 Dify 编排未把 LLM 输出映射到 message_end.outputs.tool_calls 时，
 * JSON 会以普通文本形式拼在 answer 里，这里对完整文本做容错解析：
 *   1) 整体容错解析（支持 markdown 代码块包裹 / 前后多余文本 / outputs 嵌套）
 *   2) 含 call_api/beanName 特征时，截取最外层 {...} 或 [...] 片段再解析
 *
 * @param {string} fullAnswer - 累积的完整回答文本
 * @returns {Array<{beanName:string, methodName:string, params:object}>|null}
 */
function extractToolCallsFromAnswer(fullAnswer) {
  if (typeof fullAnswer !== 'string' || !fullAnswer.trim()) return null

  // 1) 整体容错解析 + 递归收集（兼容 {outputs:{tool_calls:{...}}} 嵌套）
  const parsed = parseJsonFuzzy(fullAnswer)
  if (parsed && typeof parsed === 'object') {
    const calls = collectToolCalls(parsed)
    if (calls.length > 0) return calls
  }

  // 2) 兜底：含 call_api/beanName 特征时截取 JSON 片段
  if (/call_api|beanName/.test(fullAnswer)) {
    const objMatch = fullAnswer.match(/(\{[\s\S]*\}|\[[\s\S]*\])/)
    if (objMatch) {
      const nested = parseJsonFuzzy(objMatch[1])
      const calls = collectToolCalls(nested)
      if (calls.length > 0) return calls
    }
  }

  return null
}

/**
 * 容错解析 JSON：兼容字符串被 markdown 代码块包裹、或包含多余前后文本
 * @param {string} str - 原始字符串
 * @returns {any|null}
 */
function parseJsonFuzzy(str) {
  if (typeof str !== 'string' || !str.trim()) return null

  let text = str.trim()
  // 去掉 markdown 代码块 ```json ... ```
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (fenceMatch) text = fenceMatch[1].trim()

  try {
    return JSON.parse(text)
  } catch (e) {
    // 定位最外层 {...} 或 [...] 再尝试
    const objMatch = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/)
    if (objMatch) {
      try {
        return JSON.parse(objMatch[1])
      } catch (e2) {
        return null
      }
    }
    return null
  }
}

/** 导出供测试/复用 */
export { parseJsonFuzzy, extractToolCalls, extractToolCallsFromAnswer }
