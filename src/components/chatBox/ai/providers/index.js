/**
 * AI Provider 注册与工厂
 *
 * 支持的 provider 配置值：
 *   - 'qwen'        → 通义千问
 *   - 'deepseek'    → DeepSeek
 *   - 自定义对象      → 直接作为 provider 使用（需实现接口）
 */

import { qwenProvider } from './qwen.js'
import { deepseekProvider } from './deepseek.js'
import { difyProvider } from './dify.js'

/** 内置 provider 注册表 */
const registry = {
  qwen: qwenProvider,
  deepseek: deepseekProvider,
  dify: difyProvider
}

/**
 * 注册自定义 provider
 * @param {object} provider - 需包含 name, label, buildRequest(), parseStreamLine()
 */
export function registerProvider(provider) {
  if (!provider || !provider.name) {
    console.error('注册 provider 失败: 缺少 name 属性')
    return
  }
  registry[provider.name] = provider
}

/**
 * 根据配置创建/获取 provider 实例
 * @param {string|object} config - provider 名称、或自定义 provider 对象
 * @returns {object} provider 实例
 */
export function createProvider(config) {
  // 已经是 provider 实例（实现了接口的对象），直接返回
  if (config && typeof config === 'object' && typeof config.buildRequest === 'function') {
    return config
  }

  const name = (typeof config === 'string' ? config : config?.name) || 'qwen'

  const provider = registry[name]
  if (provider) return provider

  console.warn(`未知 provider: ${name}，回退到 qwen`)
  return registry.qwen
}

/**
 * 获取所有已注册的 provider 列表
 * @returns {Array<{name: string, label: string}>}
 */
export function getProviderList() {
  return Object.values(registry).map(p => ({ name: p.name, label: p.label }))
}
