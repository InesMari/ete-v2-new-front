/**
 * DeepSeek API 适配器（示例）
 *
 * 如果你需要对接 DeepSeek，配置 vite 代理后切换 provider 即可：
 *   provider: 'deepseek'
 *
 * API 文档: https://platform.deepseek.com/api-docs/
 */
export const deepseekProvider = {
  name: 'deepseek',
  label: 'DeepSeek',

  /** 流式返回的是增量文本（content 即为 delta，无需计算） */
  accumulatedContent: false,

  apiKeyUrl: 'https://platform.deepseek.com/api_keys',

  defaultSystemPrompt: '你是一个专业、友好的AI助手。请用中文回答用户的问题。',

  defaultQuickPrompts: [
    '帮我写一段 JavaScript 排序算法',
    '解释一下 Vue 3 的 Composition API',
    '什么是 RESTful API？'
  ],

  defaultWelcomeText: '我是基于 DeepSeek 的 AI 助手，可以帮你解答问题、编写代码、分析数据等',

  /** 构建 fetch 请求配置 */
  buildRequest({ messages, apiKey, signal }) {
    return {
      url: '/deepseek-api/v1/chat/completions',
      options: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages,
          stream: true
        }),
        signal
      }
    }
  },

  /**
   * DeepSeek SSE 流式解析
   * 格式: data:{"choices":[{"delta":{"content":"..."}}]}
   * 返回的是增量文本
   */
  parseStreamLine(data) {
    try {
      const choices = data?.choices
      if (!choices || choices.length === 0) return null
      const content = choices[0]?.delta?.content
      return typeof content === 'string' ? content : null
    } catch (e) {
      return null
    }
  }
}
