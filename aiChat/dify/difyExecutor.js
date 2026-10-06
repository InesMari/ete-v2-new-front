/**
 * Dify 结构化调用执行器
 *
 * 职责：解析 Dify 返回的结构化 JSON（{ beanName, methodName, params }），
 * 通过现有统一网关 common.postUrl(beanName, methodName, params) 调用后端接口，
 * 复用 baseTool.formatToMarkdown 将结果格式化为 Markdown 表格后返回。
 *
 * 设计：
 *  - 接口白名单注册表：每个可调接口需先注册（含字段映射），避免 Dify 返回异常值时误调任意接口。
 *  - 未注册的接口名直接拒绝，返回安全提示。
 */

import common from '/src/utils/common.js'
import { formatToMarkdown } from '../agent/baseTool.js'

/**
 * 接口注册表：key 为 "beanName.methodName"。
 * 每个条目配置展示字段，供 formatToMarkdown 使用。
 */
const interfaceRegistry = new Map()

/**
 * 注册一个可由 Dify 调用的后端接口
 * @param {object} cfg
 * @param {string} cfg.beanName   - 网关 bean 名（如 'staffService'）
 * @param {string} cfg.methodName - 网关方法名（如 'queryStaffPage'）
 * @param {Array<{key,label}>} cfg.displayFields - 单条结果展示字段
 * @param {Array<{key,label}>} [cfg.briefFields]  - 多条结果简要字段（缺省取 displayFields 前 5 个）
 * @param {string} [cfg.title]     - 结果标题前缀
 */
export function registerInterface(cfg) {
  if (!cfg || !cfg.beanName || !cfg.methodName) {
    console.error('[DifyExecutor] 注册接口失败: 缺少 beanName/methodName')
    return
  }
  const key = `${cfg.beanName}.${cfg.methodName}`
  if (interfaceRegistry.has(key)) {
    console.warn(`[DifyExecutor] 接口 "${key}" 已注册，将被覆盖`)
  }
  interfaceRegistry.set(key, {
    displayFields: cfg.displayFields || [],
    briefFields: cfg.briefFields || (cfg.displayFields || []).slice(0, 5),
    title: cfg.title || ''
  })
}

/**
 * 执行单个结构化调用
 * @param {{beanName:string, methodName:string, params:object}} call
 * @returns {Promise<string>} 格式化后的 Markdown 文本
 */
async function executeCall(call) {
  const { beanName, methodName, params } = call
  const key = `${beanName}.${methodName}`
  const meta = interfaceRegistry.get(key)

  // 白名单校验
  if (!meta) {
    console.warn(`[DifyExecutor] 接口 "${key}" 未注册，拒绝调用`)
    return `> ⚠️ 该接口 \`${key}\` 暂未开放调用，请联系管理员配置。`
  }

  try {
    const result = await common.postUrl(beanName, methodName, params || {})
    const items = result?.items || result
    const totalNum = result?.totalNum || (Array.isArray(items) ? items.length : 0)

    if (!Array.isArray(items) || items.length === 0) {
      return '> 未查询到相关数据，请确认查询条件是否准确。'
    }

    const md = formatToMarkdown(items, meta.displayFields, meta.briefFields)
    return meta.title ? `${md}` : md
  } catch (e) {
    console.error(`[DifyExecutor] 调用接口 ${key} 失败:`, e)
    return `> ❌ 查询失败：${e?.message || '系统异常，请稍后重试'}`
  }
}

/**
 * 执行一组 Dify 结构化调用
 * @param {Array<{beanName:string, methodName:string, params:object}>} toolCalls
 * @returns {Promise<Array<{tool_call_id:string, role:string, content:string}>>}
 *         返回与 aiChat 既有 executeAIToolCalls 相同结构的消息列表
 */
export async function executeDifyToolCalls(toolCalls) {
  if (!toolCalls || toolCalls.length === 0) return []

  const results = []
  for (const call of toolCalls) {
    const content = await executeCall(call)
    results.push({
      tool_call_id: call.id || '',
      role: 'tool',
      content
    })
  }
  return results
}

/**
 * 获取接口白名单列表（供调试/展示）
 */
export function getRegisteredInterfaces() {
  return Array.from(interfaceRegistry.keys())
}

/** 注册常用业务接口（按需在此扩展） */
export function registerDefaultInterfaces() {
  // 员工查询
  registerInterface({
    beanName: 'staffService',
    methodName: 'queryStaffPage',
    title: '员工信息',
    displayFields: [
      { key: 'staffName', label: '姓名' },
      { key: 'workNum', label: '工号' },
      { key: 'sexName', label: '性别' },
      { key: 'billId', label: '手机号' },
      { key: 'orgNames', label: '部门' },
      { key: 'positionNames', label: '岗位' },
      { key: 'staffRankName', label: '职级' },
      { key: 'entryDate', label: '入职日期' }
    ],
    briefFields: [
      { key: 'staffName', label: '姓名' },
      { key: 'workNum', label: '工号' },
      { key: 'orgNames', label: '部门' },
      { key: 'positionNames', label: '岗位' }
    ]
  })
}
