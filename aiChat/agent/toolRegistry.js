/**
 * 工具注册表 - 统一管理所有可调用工具的注册、查找和执行
 *
 * 每个工具定义：
 *   name        - 唯一标识
 *   description - 描述（供 AI 理解）
 *   parameters  - JSON Schema 参数定义
 *   execute     - 执行函数，返回 { success, data }
 */

/** @type {Map<string, ToolDefinition>} */
const tools = new Map()

/**
 * 注册一个工具
 * @param {ToolDefinition} tool
 */
export function registerTool(tool) {
  if (!tool || !tool.name) {
    console.error('[ToolRegistry] 注册工具失败: 缺少 name 属性')
    return
  }
  if (tools.has(tool.name)) {
    console.warn(`[ToolRegistry] 工具 "${tool.name}" 已存在，将被覆盖`)
  }
  tools.set(tool.name, tool)
}

/**
 * 获取指定工具
 * @param {string} name
 * @returns {ToolDefinition|undefined}
 */
export function getTool(name) {
  return tools.get(name)
}

/**
 * 获取所有已注册的工具列表
 * @returns {ToolDefinition[]}
 */
export function getAllTools() {
  return Array.from(tools.values())
}

/**
 * 执行指定工具
 * @param {string} name 工具名
 * @param {object} params 参数
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export async function executeTool(name, params = {}) {
  const tool = tools.get(name)
  if (!tool) {
    console.error(`[ToolRegistry] 工具 "${name}" 未注册`)
    return { success: false, error: `工具 "${name}" 未注册` }
  }

  try {
    const result = await tool.execute(params)
    return { success: true, data: result }
  } catch (e) {
    console.error(`[ToolRegistry] 工具 "${name}" 执行失败:`, e)
    return { success: false, error: e.message || '工具执行异常' }
  }
}

/**
 * 将已注册工具转换为 OpenAI 兼容的 tools 格式（供 Function Calling 使用）
 * @returns {Array<{type: string, function: {name: string, description: string, parameters: object}}>}
 */
export function getToolsForAI() {
  return getAllTools().map(tool => ({
    type: 'function',
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters
    }
  }))
}

/**
 * 清空所有已注册工具
 */
export function clearTools() {
  tools.clear()
}

/**
 * @typedef {object} ToolDefinition
 * @property {string} name - 工具唯一标识
 * @property {string} description - 工具描述，供 AI 模型理解何时调用
 * @property {object} parameters - JSON Schema 参数定义
 * @property {function(object): Promise<any>} execute - 执行函数，接收参数对象，返回结果
 */
