/**
 * AgentRouter - AI Agent 中间层
 *
 * 编排"关键词匹配 → 工具调用 → 结果注入"完整流程，实现双层拦截：
 *   1. 本地关键词匹配（快速，毫秒级，不消耗 AI 额度）
 *   2. AI Function Calling 兜底（处理复杂查询）
 *
 * 导出 routeMessage() 供 aiChat.js 在 sendMessage 前调用。
 */

import { match } from './keywordMatcher.js'
import { executeTool, getToolsForAI } from './toolRegistry.js'
import { registerQueryStaffTool } from './tools/queryStaff.js'

// 初始化：注册 MVP 工具
let initialized = false
function ensureInitialized() {
  if (initialized) return
  registerQueryStaffTool()
  initialized = true
}

/**
 * 路由用户消息：先本地匹配，再决定是否走 AI Function Calling
 *
 * @param {string} userText 用户输入文本
 * @returns {Promise<RouteResult>}
 *   - type: 'direct'  → 本地命中，content 为直接展示的 Markdown 文本
 *   - type: 'ai'      → 未命中，需走 AI 模型，tools 为 Function Calling 工具列表
 */
export async function routeMessage(userText) {
  ensureInitialized()

  // 第一步：本地关键词匹配
  const matchResult = match(userText)
  if (matchResult.hit) {
    console.log(`[AgentRouter] 关键词匹配命中: ${matchResult.toolName}`, matchResult.params)
    const toolResult = await executeTool(matchResult.toolName, matchResult.params)

    if (toolResult.success) {
      return {
        type: 'direct',
        content: toolResult.data
      }
    } else {
      // 工具执行失败，返回错误信息直接展示
      return {
        type: 'direct',
        content: `❌ ${toolResult.error || '查询失败，请稍后重试'}`
      }
    }
  }

  // 第二步：未命中，返回 tools 供 AI Function Calling
  const tools = getToolsForAI()
  console.log('[AgentRouter] 关键词未命中，走 AI Function Calling，tools:', tools.map(t => t.function.name))

  return {
    type: 'ai',
    tools
  }
}

/**
 * 根据 AI 返回的 tool_calls 执行对应工具并返回结果
 * 用于处理 AI Function Calling 场景中的 tool_call 响应
 *
 * @param {Array<{function: {name: string, arguments: string}}>} toolCalls - AI 返回的工具调用
 * @returns {Promise<Array<{tool_call_id: string, role: string, content: string}>>} 工具调用结果消息列表
 */
export async function executeAIToolCalls(toolCalls) {
  ensureInitialized()

  if (!toolCalls || toolCalls.length === 0) {
    return []
  }

  const results = []
  for (const call of toolCalls) {
    const funcName = call.function?.name
    let args = {}

    try {
      args = typeof call.function?.arguments === 'string'
        ? JSON.parse(call.function.arguments)
        : call.function?.arguments || {}
    } catch (e) {
      console.warn('[AgentRouter] 解析 tool_call arguments 失败:', call.function?.arguments)
    }

    console.log(`[AgentRouter] 执行 AI 工具调用: ${funcName}`, args)
    const result = await executeTool(funcName, args)

    results.push({
      tool_call_id: call.id || '',
      role: 'tool',
      content: result.success ? result.data : `工具执行失败: ${result.error}`
    })
  }

  return results
}

/**
 * @typedef {object} RouteResult
 * @property {'direct'|'ai'} type
 * @property {string} [content] - type='direct' 时的直接展示内容
 * @property {Array<object>} [tools] - type='ai' 时的 Function Calling 工具列表
 */
