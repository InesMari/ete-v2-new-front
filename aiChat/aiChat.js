/**
 * AI Chat 可复用组件 — 核心逻辑
 *
 * 通过 props 配置 provider / storage / apiKey 等，支持切换 AI 和存储方案
 *
 * Props:
 *   provider        - 'qwen' | 'deepseek' | 'dify' | 自定义 provider 对象
 *   apiKey          - 写死的 key（不为空则直接使用，隐藏设置按钮）
 *   apiKeyEditable  - 是否允许用户自行填写 API Key（默认 true）
 *   storage         - 'local' | { type:'remote', baseURL:'/api/chat' } | 自定义 storage 对象
 *   title           - 标题（默认 "AI 智能助手"）
 *   welcomeText     - 欢迎描述
 *   quickPrompts    - 快捷提示列表
 *   systemPrompt    - 系统提示词
 *   typeDelay       - 逐字打印速度 ms（默认 40）
 *   showSidebar     - 是否显示侧边栏（默认 true）
 */

import { reactive, toRefs, nextTick, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { renderMarkdown } from './markdown.js'
import { createProvider } from './providers/index.js'
import { createStorage } from './storage/index.js'
import { routeMessage, executeAIToolCalls } from './agent/agentRouter.js'
import { executeDifyToolCalls, registerDefaultInterfaces } from './dify/difyExecutor.js'
import { extractToolCallsFromAnswer } from './providers/dify.js'

// ==================== Props 定义 ====================
export const aiChatProps = {
  provider:       { type: [String, Object], default: 'qwen' },
  apiKey:         { type: String, default: '' },
  apiKeyEditable: { type: Boolean, default: true },
  storage:        { type: [String, Object], default: 'local' },
  title:          { type: String, default: 'AI 智能助手' },
  welcomeText:    { type: String, default: '' },
  quickPrompts:   { type: Array, default: null },
  systemPrompt:   { type: String, default: '' },
  typeDelay:      { type: Number, default: 40 },
  showSidebar:    { type: Boolean, default: true }
}

export function useAiChat(props = {}) {
  // ==================== 初始化 provider & apiKey & storage ====================
  const provider = createProvider(props.provider)
  const storage = createStorage(props.storage)

  // provider → 默认 API Key 映射表（未配置的 provider 保持原值）
  const DEFAULT_API_KEYS = {
    qwen: 'sk-ws-H.ERYIHHX.4Sic.MEUCIFvX2ChCLvqB2QZbcT9Dzw1ajZ1-BnupYSB2BQrDRvTKAiEAhkh3si9cOGymj-LKzFc80z4rrWS9qrCamX3m0pU6iCk',
    dify: 'app-nxLNCroHgIl71uDhOAnZvdPd'
  }
  props.apiKey = DEFAULT_API_KEYS[props.provider] ?? props.apiKey

  // 注册默认的 Dify 可调接口白名单（仅 provider 为 dify 时使用）
  if (provider.name === 'dify') {
    registerDefaultInterfaces()
  }

  /** sessionId → Dify conversation_id 映射（保证多轮上下文连续） */
  const conversationMap = {}

  // 取 apiKey(props) 或 localStorage 缓存的 key（复用同一函数）
  function getEffectiveApiKey() {
    if (props.apiKey) return props.apiKey
    return storage.loadApiKey()
  }

  // ==================== 响应式状态 ====================
  const bindData = reactive({
    sessions: [],                          // 所有会话列表
    currentSessionId: '',                  // 当前激活的会话 ID
    messages: [],                          // 当前会话的消息列表
    inputText: '',                         // 输入框文本
    isStreaming: false,                    // 是否正在流式接收 AI 回复
    streamingContent: '',                  // 流式输出的当前累积文本（用于界面渲染）
    apiKey: getEffectiveApiKey(),          // 当前生效的 API Key
    showApiKeyDialog: false,               // API Key 设置弹窗是否显示
    apiKeyInput: '',                       // API Key 弹窗中的输入值
    messageContainer: null,                // 消息区域 DOM 引用
    loading: false,                        // 是否正在加载（非流式的加载态）
    abortController: null,                 // 用于中止 fetch 请求的 AbortController
    playbackStopped: false,                // 停止信号：true 时逐字播放循环立即退出
    sidebarVisible: props.showSidebar,     // 左侧会话侧边栏是否展开
    editingSessionId: '',                  // 正在编辑标题的会话 ID（空 = 无编辑态）
    editingSessionTitle: ''                // 编辑中的会话标题临时值
  })

  /** 欢迎描述：优先取 props，其次取 provider 默认 */
  const welcomeDesc = computed(() =>
    props.welcomeText || provider.defaultWelcomeText || '基于 AI 的智能助手'
  )

  /** 快捷提示 */
  const prompts = computed(() => {
    if (props.quickPrompts) return props.quickPrompts
    return provider.defaultQuickPrompts || []
  })

  /** 系统提示词 */
  const sysPromptContent = computed(() =>
    props.systemPrompt || provider.defaultSystemPrompt || '你是一个专业的AI助手。'
  )

  /** AI 名称标签 */
  const aiLabel = computed(() => provider.label || 'AI 助手')

  /** 当前会话标题 */
  const currentSessionTitle = computed(() => {
    const session = bindData.sessions.find(s => s.id === bindData.currentSessionId)
    return session ? session.title : ''
  })

  /** 标题（优先 props） */
  const headerTitle = computed(() => props.title || aiLabel.value)

  // ==================== 挂载初始化 ====================

  async function initSessions() {
    try {
      const data = storage.loadSessions()
      bindData.sessions = data instanceof Promise ? await data : data
    } catch (e) {
      console.error('加载会话列表失败:', e)
      bindData.sessions = []
    }
  }

  onMounted(() => { initSessions() })

  // ==================== 持久化操作 ====================

  async function saveSessions() {
    try {
      storage.saveSessions(bindData.sessions)
    } catch (e) {
      console.error('保存会话列表失败:', e)
    }
  }

  async function loadMessages(sessionId) {
    try {
      const data = storage.loadMessages(sessionId)
      return data instanceof Promise ? await data : data
    } catch (e) {
      console.error('加载消息失败:', e)
      return []
    }
  }

  async function saveCurrentMessages() {
    try {
      storage.saveMessages(bindData.currentSessionId, bindData.messages)
      // 如果是 Promise，静默 fire-and-forget
    } catch (e) {
      console.error('保存消息失败:', e)
    }
  }

  async function removeCurrentSessionMessages(sessionId) {
    try {
      storage.removeMessages(sessionId)
    } catch (e) {
      console.error('删除消息失败:', e)
    }
  }

  // ==================== 会话管理 ====================

  function createNewSession() {
    if (bindData.isStreaming) {
      ElMessage.warning('请等待当前回复完成后再创建新会话')
      return
    }
    const session = {
      id: generateId(),
      title: '新会话',
      createTime: Date.now(),
      lastTime: Date.now()
    }
    bindData.sessions.unshift(session)
    saveSessions()
    bindData.currentSessionId = session.id
    bindData.messages = []
    bindData.inputText = ''
    nextTick(() => scrollToBottom())
  }

  async function switchSession(sessionId) {
    if (bindData.isStreaming) {
      ElMessage.warning('请等待当前回复完成后再切换会话')
      return
    }
    if (bindData.currentSessionId && bindData.messages.length > 0) {
      saveCurrentMessages()
    }
    bindData.currentSessionId = sessionId
    bindData.messages = await loadMessages(sessionId)
    bindData.inputText = ''
    nextTick(() => scrollToBottom())
  }

  function deleteSession(sessionId) {
    ElMessageBox.confirm('确定要删除该会话吗？所有聊天记录将被清除。', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      bindData.sessions = bindData.sessions.filter(s => s.id !== sessionId)
      saveSessions()
      removeCurrentSessionMessages(sessionId)
      delete conversationMap[sessionId]
      if (bindData.currentSessionId === sessionId) {
        bindData.messages = []
        bindData.currentSessionId = ''
      }
      ElMessage.success('会话已删除')
    }).catch(() => {})
  }

  // ==================== 会话重命名 ====================

  function startRenameSession(sessionId) {
    const session = bindData.sessions.find(s => s.id === sessionId)
    if (!session) return
    bindData.editingSessionId = sessionId
    bindData.editingSessionTitle = session.title
    // 下一帧聚焦输入框
    nextTick(() => {
      const input = document.querySelector(`.rename-input[data-sid="${sessionId}"]`)
      if (input) {
        input.focus()
        input.select()
      }
    })
  }

  function confirmRenameSession() {
    const title = bindData.editingSessionTitle.trim()
    if (!title) {
      cancelRenameSession()
      return
    }
    const session = bindData.sessions.find(s => s.id === bindData.editingSessionId)
    if (session) {
      session.title = title
      saveSessions()
    }
    bindData.editingSessionId = ''
    bindData.editingSessionTitle = ''
  }

  function cancelRenameSession() {
    bindData.editingSessionId = ''
    bindData.editingSessionTitle = ''
  }

  function handleRenameKeydown(event) {
    if (event.key === 'Enter') {
      event.preventDefault()
      confirmRenameSession()
    } else if (event.key === 'Escape') {
      event.preventDefault()
      cancelRenameSession()
    }
  }

  // ==================== 消息发送 ====================

  /** 当前 provider 是否为 Dify */
  function isDify() {
    return provider.name === 'dify'
  }

  async function sendMessage() {
    const text = bindData.inputText.trim()
    if (!text) return

    if (bindData.isStreaming) {
      stopStreaming()
      return
    }

    if (!bindData.apiKey) {
      ElMessage.warning(`请先设置 ${aiLabel.value} API Key`)
      bindData.showApiKeyDialog = true
      bindData.apiKeyInput = ''
      return
    }

    // 自动创建会话
    if (!bindData.currentSessionId) {
      const session = {
        id: generateId(),
        title: text.length > 20 ? text.substring(0, 20) + '...' : text,
        createTime: Date.now(),
        lastTime: Date.now()
      }
      bindData.sessions.unshift(session)
      bindData.currentSessionId = session.id
    } else {
      const session = bindData.sessions.find(s => s.id === bindData.currentSessionId)
      if (session && bindData.messages.length === 0) {
        session.title = text.length > 20 ? text.substring(0, 20) + '...' : text
      }
      if (session) session.lastTime = Date.now()
    }

    // 添加用户消息
    bindData.messages.push({
      role: 'user',
      content: text,
      timestamp: Date.now()
    })
    bindData.inputText = ''
    nextTick(() => scrollToBottom())

    // ---- Agent 中间层：关键词匹配 → 工具调用 ----
    // Dify 模式下跳过本地 agent，直接走 Dify 知识库/流式链路
    const agentResult = isDify() ? { type: 'ai', tools: [] } : await routeMessage(text)
    if (agentResult.type === 'direct') {
      // 本地关键词命中，直接展示结果
      const assistantMessage = {
        role: 'assistant',
        content: agentResult.content,
        timestamp: Date.now(),
        agentDirect: true   // 标记为 Agent 直接返回（可选，用于 UI 样式区分）
      }
      bindData.messages.push(assistantMessage)
      saveCurrentMessages()
      saveSessions()
      nextTick(() => scrollToBottom())
      return
    }

    // 未命中关键词，走 AI 模型（携带 tools 供 Function Calling）
    // 开始流式
    bindData.isStreaming = true
    bindData.streamingContent = ''

    const assistantMessage = {
      role: 'assistant',
      content: '',
      timestamp: Date.now()
    }
    bindData.messages.push(assistantMessage)

    try {
      await streamChatCompletion(assistantMessage, agentResult.tools || [])
    } catch (e) {
      console.error('AI 请求失败:', e)
      if (e.name !== 'AbortError') {
        assistantMessage.content = '抱歉，请求失败：' + (e.message || '网络错误，请稍后重试')
        ElMessage.error('AI 请求失败，请检查网络或 API Key')
      } else {
        if (!assistantMessage.content) assistantMessage.content = '(已中断)'
      }
    } finally {
      bindData.isStreaming = false
      bindData.streamingContent = ''
      bindData.abortController = null
      saveCurrentMessages()
      saveSessions()
      nextTick(() => scrollToBottom())
    }
  }

  // ==================== 流式调用 ====================

  async function streamChatCompletion(assistantMsg, tools = []) {
    bindData.abortController = new AbortController()
    const recentMessages = buildContextMessages()

    // 通过 provider 构建请求（传入 tools）
    const { url, options } = provider.buildRequest({
      messages: recentMessages,
      apiKey: bindData.apiKey,
      signal: bindData.abortController.signal,
      tools,
      // Dify：多轮上下文通过 conversation_id 回传
      conversationId: isDify() ? (conversationMap[bindData.currentSessionId] || '') : undefined,
      user: 'web-ai-chat'
    })

    const response = await fetch(url, options)
    console.log('response', response)

    if (!response.ok) {
      const errorText = await response.text()
      let errorMsg = `HTTP ${response.status}`
      try {
        const errData = JSON.parse(errorText)
        errorMsg = errData.message || errData.code || errorMsg
      } catch (e) {}
      throw new Error(errorMsg)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    let previousLen = 0           // 累计模式下跟踪已处理长度
    const charQueue = []
    let playPromise = null
    let isPlaying = false
    let streamEnded = false       // 流读取是否已结束（不依赖 isStreaming，避免死循环）
    let hasExecutedToolCall = false // 流中是否已通过 message_end.outputs 执行过工具调用（兜底时避免重复执行）
    bindData.playbackStopped = false   // 重置停止信号

    /** 后台逐字播放器 */
    function startPlay() {
      if (isPlaying) return
      isPlaying = true
      playPromise = (async () => {
        while (!bindData.playbackStopped && (!streamEnded || charQueue.length > 0)) {
          if (charQueue.length > 0) {
            const char = charQueue.shift()
            assistantMsg.content += char
            bindData.streamingContent = assistantMsg.content
            await new Promise(r => setTimeout(r, props.typeDelay || 40))
          } else {
            await new Promise(r => setTimeout(r, 30))
          }
          nextTick(() => scrollToBottom())
        }
        // 用户主动停止时，清空剩余字符
        if (bindData.playbackStopped) charQueue.length = 0
      })()
    }

    try {
      while (true) {
        const { done, value } = await reader.read()
        console.log('done', done, 'value', value)
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        console.log('buffer', buffer)
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed) continue

          // 兼容常见 SSE 格式：有 "data:" 前缀或无前缀的纯 JSON
          let jsonStr = trimmed
          if (jsonStr.startsWith('data:')) {
            jsonStr = jsonStr.substring(5).trim()
          }
          if (!jsonStr || jsonStr === '[DONE]') continue

          let data
          try { data = JSON.parse(jsonStr) } catch (e) { continue }

          // Dify：捕获流中返回的 conversation_id 以维持多轮上下文
          if (data && data.conversation_id && bindData.currentSessionId) {
            conversationMap[bindData.currentSessionId] = data.conversation_id
          }

          const content = provider.parseStreamLine(data)
          if (!content) continue

          // 处理 Function Calling / Dify 结构化调用的 tool_calls 响应
          if (typeof content === 'object' && content.type === 'tool_calls') {
            // Dify：走结构化执行器；其他 provider：走既有 Function Calling 执行器
            const toolResults = isDify()
              ? await executeDifyToolCalls(content.toolCalls)
              : await executeAIToolCalls(content.toolCalls)
            if (isDify()) hasExecutedToolCall = true
            if (toolResults.length > 0) {
              // 将工具结果注入消息，展示给用户
              for (const tr of toolResults) {
                charQueue.push(...(tr.content || ''))
              }
              startPlay()
            }
            continue
          }

          if (provider.accumulatedContent) {
            // 累积模式（Qwen）：每次返回完整文本，需计算增量
            if (content.length > previousLen) {
              const delta = content.slice(previousLen)
              previousLen = content.length
              for (const ch of delta) charQueue.push(ch)
              startPlay()
            }
          } else {
            // 增量模式（DeepSeek）：content 即为增量
            for (const ch of content) charQueue.push(ch)
            startPlay()
          }
        }
      }

      // 处理流结束后剩余的 buffer
      if (buffer.trim()) {
        let jsonStr = buffer.trim()
        if (jsonStr.startsWith('data:')) jsonStr = jsonStr.substring(5).trim()
        if (jsonStr && jsonStr !== '[DONE]') {
          let data
          try { data = JSON.parse(jsonStr) } catch (e) { data = null }
          if (data) {
            // Dify：捕获流中返回的 conversation_id 以维持多轮上下文
            if (data.conversation_id && bindData.currentSessionId) {
              conversationMap[bindData.currentSessionId] = data.conversation_id
            }
            const content = provider.parseStreamLine(data)
            if (content) {
              // 处理 Function Calling / Dify 结构化调用的 tool_calls 响应
              if (typeof content === 'object' && content.type === 'tool_calls') {
                const toolResults = isDify()
                  ? await executeDifyToolCalls(content.toolCalls)
                  : await executeAIToolCalls(content.toolCalls)
                if (isDify()) hasExecutedToolCall = true
                for (const tr of toolResults) {
                  charQueue.push(...(tr.content || ''))
                }
                startPlay()
              } else if (provider.accumulatedContent) {
                if (content.length > previousLen) {
                  for (const ch of content.slice(previousLen)) charQueue.push(ch)
                }
              } else {
                for (const ch of content) charQueue.push(ch)
              }
              startPlay()
            }
          }
        }
      }

      // 通知播放器流已结束，等待播放完毕
      streamEnded = true
      if (playPromise) await playPromise

      // ---- Dify 兜底：message_end.outputs 未携带 tool_calls 时，
      // 从累积的完整 answer 文本中容错解析 JSON 并执行工具调用 ----
      if (isDify() && !hasExecutedToolCall) {
        const fullText = assistantMsg.content || ''
        const fallbackCalls = extractToolCallsFromAnswer(fullText)
        if (fallbackCalls && fallbackCalls.length > 0) {
          const toolResults = await executeDifyToolCalls(fallbackCalls)
          if (toolResults.length > 0) {
            for (const tr of toolResults) {
              assistantMsg.content += (assistantMsg.content ? '\n\n' : '') + (tr.content || '')
            }
            bindData.streamingContent = assistantMsg.content
            nextTick(() => scrollToBottom())
          }
        }
      }
    } finally {
      streamEnded = true   // 中断场景下也通知播放器退出
      try { reader.releaseLock() } catch (e) {}
    }
  }

  // ==================== 上下文构建 ====================

  function buildContextMessages() {
    const systemPrompt = {
      role: 'system',
      content: sysPromptContent.value
    }
    const recentMessages = bindData.messages
      .filter(m => m.content !== '')
      .slice(-20)
      .map(m => ({ role: m.role, content: m.content }))
    return [systemPrompt, ...recentMessages]
  }

  // ==================== API Key 管理 ====================

  function openApiKeyDialog() {
    bindData.apiKeyInput = bindData.apiKey || ''
    bindData.showApiKeyDialog = true
  }

  function confirmApiKey() {
    const key = bindData.apiKeyInput.trim()
    if (!key) {
      ElMessage.warning('请输入 API Key')
      return
    }
    storage.saveApiKey(key)
    bindData.apiKey = key
    bindData.showApiKeyDialog = false
    ElMessage.success('API Key 已保存')
  }

  // ==================== 停止 ====================

  function stopStreaming() {
    bindData.playbackStopped = true       // 先通知播放循环退出
    if (bindData.abortController) {
      bindData.abortController.abort()
      bindData.abortController = null
    }
  }

  // ==================== 工具函数 ====================

  function generateId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9)
  }

  function scrollToBottom() {
    nextTick(() => {
      const el = bindData.messageContainer
      if (el) el.scrollTop = el.scrollHeight
    })
  }

  function setMessageContainer(el) {
    bindData.messageContainer = el
  }

  function formatTime(timestamp) {
    const diff = Date.now() - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days < 7) return `${days}天前`
    const date = new Date(timestamp)
    return `${date.getMonth() + 1}月${date.getDate()}日`
  }

  function handleKeydown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  function clearCurrentSession() {
    if (bindData.isStreaming) {
      ElMessage.warning('请等待当前回复完成后再清空')
      return
    }
    ElMessageBox.confirm('确定要清空当前会话的所有消息吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      bindData.messages = []
      if (bindData.currentSessionId) saveCurrentMessages()
      ElMessage.success('已清空')
    }).catch(() => {})
  }

  // ==================== 返回 ====================
  return {
    ...toRefs(bindData),
    // 常量 / 计算属性
    prompts,
    welcomeDesc,
    aiLabel,
    headerTitle,
    currentSessionTitle,
    apiKeyEditable: props.apiKeyEditable !== false,
    apiKeyLocked: computed(() => !!props.apiKey),
    // 方法
    createNewSession,
    switchSession,
    deleteSession,
    startRenameSession,
    confirmRenameSession,
    cancelRenameSession,
    handleRenameKeydown,
    sendMessage,
    stopStreaming,
    openApiKeyDialog,
    confirmApiKey,
    setMessageContainer,
    formatTime,
    handleKeydown,
    clearCurrentSession,
    renderMarkdown,
    // 暴露 provider 信息给模板（API Key 弹窗用）
    providerApiKeyUrl: provider.apiKeyUrl
  }
}

/** 导出为 Options API mixin 格式（兼容 .vue 文件中的 ...aiChat 展开） */
export default {
  props: aiChatProps,
  setup(props) {
    return useAiChat(props)
  }
}
