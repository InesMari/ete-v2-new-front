/**
 * localStorage 存储适配器
 * 实现统一的 storage 接口
 */
const MAX_SESSIONS = 50
const MAX_MESSAGES = 200

const STORAGE_KEYS = {
  SESSIONS: 'ai_chat_sessions',
  API_KEY: 'ai_chat_api_key',
  getMessagesKey: (sessionId) => `ai_chat_messages_${sessionId}`
}

export function createLocalStorageAdapter() {
  return {
    /** 加载会话列表 */
    loadSessions() {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.SESSIONS)
        return data ? JSON.parse(data) : []
      } catch (e) {
        console.error('加载会话列表失败:', e)
        return []
      }
    },

    /** 保存会话列表 */
    saveSessions(sessions) {
      try {
        const toSave = sessions.slice(0, MAX_SESSIONS)
        localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(toSave))
      } catch (e) {
        console.error('保存会话列表失败:', e)
      }
    },

    /** 加载指定会话的消息 */
    loadMessages(sessionId) {
      try {
        const key = STORAGE_KEYS.getMessagesKey(sessionId)
        const data = localStorage.getItem(key)
        return data ? JSON.parse(data) : []
      } catch (e) {
        console.error('加载消息失败:', e)
        return []
      }
    },

    /** 保存指定会话的消息 */
    saveMessages(sessionId, messages) {
      try {
        const key = STORAGE_KEYS.getMessagesKey(sessionId)
        const toSave = messages.slice(-MAX_MESSAGES)
        localStorage.setItem(key, JSON.stringify(toSave))
      } catch (e) {
        console.error('保存消息失败:', e)
      }
    },

    /** 删除指定会话的消息 */
    removeMessages(sessionId) {
      try {
        const key = STORAGE_KEYS.getMessagesKey(sessionId)
        localStorage.removeItem(key)
      } catch (e) {
        console.error('删除消息失败:', e)
      }
    },

    /** 加载 API Key */
    loadApiKey() {
      try {
        return localStorage.getItem(STORAGE_KEYS.API_KEY) || ''
      } catch (e) {
        return ''
      }
    },

    /** 保存 API Key */
    saveApiKey(key) {
      try {
        localStorage.setItem(STORAGE_KEYS.API_KEY, key)
      } catch (e) {
        console.error('保存API Key失败:', e)
      }
    }
  }
}
