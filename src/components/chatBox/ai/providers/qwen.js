/**
 * 通义千问 (DashScope) 适配器
 *
 * API 文档: https://help.aliyun.com/zh/dashscope/
 *
 * 流式返回：每行是纯 JSON，内容为累积文本（非增量）
 * 结构: { output: { choices: [{ message: { content, role } }] } }
 */
export const qwenProvider = {
  name: 'qwen',
  label: '通义千问',

  /** 流式返回的是累积内容而非增量（需由调用方计算 delta） */
  accumulatedContent: true,

  /** 获取 API Key 的地址 */
  apiKeyUrl: 'https://dashscope.console.aliyun.com/apiKey',

  /** 默认系统提示词 */
  defaultSystemPrompt: '你是一个专业、友好的AI助手。请用中文回答用户的问题。如果用户问代码相关问题，请提供详细的代码示例和解释。',

  /** 默认快捷提示 */
  defaultQuickPrompts: [
    '帮我写一段 JavaScript 排序算法',
    '解释一下 Vue 3 的 Composition API',
    '帮我分析一下这段代码的性能问题',
    '什么是 RESTful API？',
    '写一个 Python 爬虫示例'
  ],

  /** 默认欢迎描述 */
  defaultWelcomeText: '我是基于通义千问的 AI 助手，可以帮你解答问题、编写代码、分析数据等',

  /** 构建 fetch 请求配置 */
  buildRequest({ messages, apiKey, signal, tools }) {
    const body = {
      model: 'qwen-plus',
      input: { messages },
      parameters: {
        result_format: 'message',
        incremental_output: true
      }
    }

    // 支持 Function Calling: tools 参数
    if (tools && tools.length > 0) {
      body.parameters.tools = tools
    }

    return {
      url: '/qwen-api/api/v1/services/aigc/text-generation/generation',
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
   * 从流式 JSON 行中提取文本内容
   * 千问返回的是累积内容（非增量），由调用方做增量计算
   *
   * @param {object} data - 解析后的 JSON 对象
   * @returns {string|null|object} - 累积的完整文本，无内容则返回 null；
   *   若包含 tool_calls，返回 { type: 'tool_calls', toolCalls: [...] }
   */
  parseStreamLine(data) {
    try {
      const choices = data?.output?.choices
      if (!choices || choices.length === 0) return null

      const message = choices[0]?.message

      // 检查是否有 tool_calls（Function Calling 响应）
      if (message?.tool_calls && message.tool_calls.length > 0) {
        const finishReason = choices[0]?.finish_reason
        // 只在流结束时返回 tool_calls，避免中途重复
        if (finishReason === 'tool_calls') {
          return {
            type: 'tool_calls',
            toolCalls: message.tool_calls
          }
        }
        return null
      }

      const content = message?.content
      return typeof content === 'string' ? content : null
    } catch (e) {
      return null
    }
  }
}
