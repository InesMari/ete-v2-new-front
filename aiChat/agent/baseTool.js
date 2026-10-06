/**
 * baseTool - 工具创建工厂 & 统一格式化
 *
 * 所有查询类工具的通用的声明式工厂：
 *   只需提供字段配置 + API 调用函数，自动完成注册、格式化、错误处理、权限校验。
 *
 * 使用示例：
 *   import { createQueryTool } from '../baseTool.js'
 *
 *   export function registerQueryStaffHRTool() {
 *     createQueryTool({
 *       name: 'queryStaffHR',
 *       description: '查询员工人事信息...',
 *       displayFields: [{ key: 'staffName', label: '姓名' }, ...],
 *       briefFields:   [{ key: 'staffName', label: '姓名' }, ...],
 *       queryFn: (p) => common.postUrl('hrService', 'queryHRPage', { ... }),
 *       checkPermission: (p) => true   // 可选
 *     })
 *   }
 */

import { registerTool } from './toolRegistry.js'

/**
 * 创建并注册一个查询类工具（声明式配置）
 *
 * @param {object} config
 * @param {string} config.name            - 工具唯一名称
 * @param {string} config.description     - AI 可读描述（供 Function Calling 使用）
 * @param {Array<{key:string, label:string}>} config.displayFields - 单条结果时的展示字段
 * @param {Array<{key:string, label:string}>} config.briefFields   - 多条结果时的简要字段
 * @param {function} config.queryFn       - 查询函数 (params) => Promise<{totalNum, items}>
 * @param {function} [config.checkPermission]  - 可选：权限校验 (params) => boolean | string
 * @param {object} [config.paramsSchema]  - 可选：自定义 JSON Schema，不传则自动生成
 *   默认生成：{ type:'object', properties:{ keyword:{ type:'string', description:'查询关键词' } }, required:['keyword'] }
 */
export function createQueryTool(config) {
  const {
    name,
    description,
    displayFields,
    briefFields,
    queryFn,
    checkPermission,
    paramsSchema
  } = config

  // 自动推导 paramsSchema
  const parameters = paramsSchema || {
    type: 'object',
    properties: {
      keyword: {
        type: 'string',
        description: '查询关键词'
      }
    },
    required: ['keyword']
  }

  async function execute(params) {
    // 权限校验
    if (typeof checkPermission === 'function') {
      const permResult = checkPermission(params)
      if (permResult === false) {
        return '❌ 您没有权限执行此操作'
      }
      if (typeof permResult === 'string') {
        return `❌ ${permResult}`
      }
    }

    try {
      const result = await queryFn(params)
      const items = result?.items || result
      const totalNum = result?.totalNum || (Array.isArray(items) ? items.length : 0)

      if (!Array.isArray(items) || items.length === 0) {
        return '❌ 未找到匹配的记录，请确认查询条件'
      }

      return formatToMarkdown(items, displayFields, briefFields)
    } catch (e) {
      console.error(`[${name}] 查询失败:`, e)
      return `❌ 查询失败：${e.message || '系统异常，请稍后重试'}`
    }
  }

  registerTool({ name, description, parameters, execute })
  return { name, execute }
}

/**
 * 将数据格式化为 Markdown
 * @param {Array<object>} items        - 数据列表
 * @param {Array<{key,label}>} displayFields - 单条展示字段
 * @param {Array<{key,label}>} briefFields   - 多条简要字段
 * @returns {string} Markdown 文本
 */
export function formatToMarkdown(items, displayFields, briefFields) {
  if (items.length === 1) {
    return formatSingle(items[0], displayFields)
  }
  return formatMulti(items, briefFields || displayFields.slice(0, 5))
}

/**
 * 单条记录：键值对表格
 */
export function formatSingle(item, fields) {
  const title = item[fields[0]?.key] || '-'
  let md = `### 👤 ${title}\n\n`
  md += '| 字段 | 信息 |\n'
  md += '|------|------|\n'

  for (const f of fields) {
    const v = item[f.key]
    md += `| ${f.label} | ${v ?? '-'} |\n`
  }
  return md
}

/**
 * 多条记录：横向表格
 */
export function formatMulti(items, fields) {
  let md = `### 🔍 查询到 ${items.length} 条记录\n\n`
  md += '| ' + fields.map(f => f.label).join(' | ') + ' |\n'
  md += '|' + fields.map(() => '------').join('|') + '|\n'

  for (const item of items) {
    md += '| ' + fields.map(f => item[f.key] ?? '-').join(' | ') + ' |\n'
  }

  md += '\n> 请提供更精确的查询条件以查看详细信息'
  return md
}
