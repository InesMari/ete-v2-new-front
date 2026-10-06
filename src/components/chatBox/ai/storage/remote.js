/**
 * 后端 API 存储适配器
 * 通过后台接口持久化会话和消息，需实现具体的 API 调用
 *
 * 使用方式：
 *   import { createRemoteStorageAdapter } from './storage/remote.js'
 *   const storage = createRemoteStorageAdapter({
 *     baseURL: '/api/chat',
 *     // 可选：自定义 headers
 *     headers: {}
 *   })
 */
export function createRemoteStorageAdapter(config = {}) {
  const {
    baseURL = '/api/chat',
    headers = {},
    // 允许外部覆盖各个请求方法
    request = defaultRequest
  } = config

  async function defaultRequest(path, options = {}) {
    const url = `${baseURL}${path}`
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...headers, ...options.headers },
      ...options
    })
    if (!res.ok) throw new Error(`存储请求失败: ${res.status}`)
    return res.json()
  }

  return {
    async loadSessions() {
      const data = await request('/sessions')
      return data.sessions || data || []
    },

    async saveSessions(sessions) {
      await request('/sessions', {
        method: 'POST',
        body: JSON.stringify({ sessions })
      })
    },

    async loadMessages(sessionId) {
      const data = await request(`/sessions/${sessionId}/messages`)
      return data.messages || data || []
    },

    async saveMessages(sessionId, messages) {
      await request(`/sessions/${sessionId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ messages })
      })
    },

    async removeMessages(sessionId) {
      await request(`/sessions/${sessionId}/messages`, {
        method: 'DELETE'
      })
    },

    async loadApiKey() {
      // API Key 不应由后端存储（安全考量），返回空字符串
      return ''
    },

    saveApiKey(key) {
      // 降级到 localStorage 保存 API Key
      try { localStorage.setItem('ai_chat_api_key', key) } catch (e) {}
    }
  }
}
