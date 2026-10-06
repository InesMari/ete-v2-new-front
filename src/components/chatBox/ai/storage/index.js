/**
 * 存储工厂：根据配置创建对应的存储适配器
 *
 * 支持的 storage 配置值：
 *   - 'local' | 'localStorage'  → localStorage 适配器
 *   - { type: 'remote', baseURL: '/api/chat' }  → 后端 API 适配器
 *   - 直接传入实现了 storage 接口的对象 → 原样返回
 */

import { createLocalStorageAdapter } from './localStorage.js'
import { createRemoteStorageAdapter } from './remote.js'

/** 内置 localStorage 单例，避免重复创建 */
let localStorageInstance = null

export function createStorage(config) {
  // 已经是 storage 实例（实现了接口的对象），直接返回
  if (config && typeof config === 'object' && typeof config.loadSessions === 'function') {
    return config
  }

  const type = (typeof config === 'string' ? config : config?.type) || 'local'

  switch (type) {
    case 'local':
    case 'localStorage':
      if (!localStorageInstance) {
        localStorageInstance = createLocalStorageAdapter()
      }
      return localStorageInstance

    case 'remote':
    case 'api':
      return createRemoteStorageAdapter(config)

    default:
      console.warn(`未知存储类型: ${type}，回退到 localStorage`)
      if (!localStorageInstance) {
        localStorageInstance = createLocalStorageAdapter()
      }
      return localStorageInstance
  }
}
