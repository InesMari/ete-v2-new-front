/**
 * chatBox 悬浮在线咨询组件 — 核心逻辑
 *
 * 融合能力：
 *  1. AI 对话（qwen / deepseek / dify，SSE 流式 + 逐字播放 + 可停止）
 *  2. Agent 关键词匹配 → 本地工具直出（如员工查询）
 *  3. Dify 结构化调用（message_end.outputs.tool_calls → 后端接口白名单）
 *  4. 多会话管理（新建/切换/重命名/删除，localStorage 持久化）
 *  5. Markdown 渲染（marked + highlight.js）
 *  6. 图片收发（发送/粘贴/预览，仅本地展示，不参与 AI 上下文）
 *
 * 消息模型：{ role: 'user'|'assistant', content, images?, timestamp, agentDirect? }
 *   - 用户消息：content 文字 + images 图片 base64 数组
 *   - AI 消息：content 为 Markdown 文本
 *   - 纯图片消息（content 为空）仅本地展示，不触发 AI
 */

import { renderMarkdown } from './ai/markdown.js'
import { createProvider } from './ai/providers/index.js'
import { createStorage } from './ai/storage/index.js'
import { routeMessage, executeAIToolCalls } from './ai/agent/agentRouter.js'
import { executeDifyToolCalls, registerDefaultInterfaces } from './ai/dify/difyExecutor.js'
import { extractToolCallsFromAnswer } from './ai/providers/dify.js'

// ==================== 配置常量 ====================
/** AI 模型：'qwen' | 'deepseek' | 'dify'（dify 需本地启动 Dify 并配置代理） */
const PROVIDER = 'dify'

/** provider → 默认 API Key 映射表（对应 provider 有默认 key 时，默认隐藏手动设置按钮） */
const DEFAULT_API_KEYS = {
  qwen: 'sk-ws-H.ERYIHHX.4Sic.MEUCIFvX2ChCLvqB2QZbcT9Dzw1ajZ1-BnupYSB2BQrDRvTKAiEAhkh3si9cOGymj-LKzFc80z4rrWS9qrCamX3m0pU6iCk',
  dify: 'app-rouI8nZZuiDSiBda9ZDJkr7L'
}

/** 逐字播放速度 ms */
const TYPE_DELAY = 40

export default {
  name: 'chatBox',
  data() {
    return {
      // ---- 面板 & 图片 ----
      visible: false,
      inputText: '',
      previewImages: [],
      dialogVisible: false,
      dialogImageUrl: '',

      // ---- AI 对话状态 ----
      providerInstance: null,
      sessions: [],                    // 所有会话列表
      currentSessionId: '',            // 当前激活的会话 ID
      messages: [],                    // 当前会话的消息列表
      isStreaming: false,              // 是否正在流式接收 AI 回复
      streamingContent: '',            // 流式输出的当前累积文本
      apiKey: '',                      // 当前生效的 API Key
      apiKeyLocked: false,             // 使用默认 Key 时锁定设置按钮
      showApiKeyDialog: false,         // API Key 设置弹窗是否显示
      apiKeyInput: '',                 // API Key 弹窗中的输入值
      messageContainer: null,          // 消息区域 DOM 引用
      loading: false,                  // 非流式的加载态
      playbackStopped: false,          // 停止信号：true 时逐字播放循环立即退出
      sidebarVisible: true,            // 左侧会话侧边栏是否展开
      editingSessionId: '',            // 正在编辑标题的会话 ID（空 = 无编辑态）
      editingSessionTitle: ''          // 编辑中的会话标题临时值
    }
  },
  computed: {
    canSend() {
      return this.inputText.trim().length > 0 || this.previewImages.length > 0
    },
    provider() {
      return this.providerInstance
    },
    aiLabel() {
      return this.provider.label || 'AI 助手'
    },
    welcomeDesc() {
      return this.provider.defaultWelcomeText || '基于 AI 的智能助手'
    },
    prompts() {
      return this.provider.defaultQuickPrompts || []
    },
    sysPromptContent() {
      return this.provider.defaultSystemPrompt || '你是一个专业的AI助手。'
    },
    headerTitle() {
      return '在线咨询'
    },
    currentSessionTitle() {
      const session = this.sessions.find(s => s.id === this.currentSessionId)
      return session ? session.title : ''
    }
  },
  created() {
    // 初始化 provider / storage / apiKey
    this.providerInstance = createProvider(PROVIDER)
    this.storage = createStorage('local')
    const defaultKey = DEFAULT_API_KEYS[PROVIDER] || ''
    this.apiKeyLocked = !!defaultKey
    this.apiKey = defaultKey || this.storage.loadApiKey() || ''

    // sessionId → Dify conversation_id 映射（保证多轮上下文连续）
    this.conversationMap = {}

    // Dify 模式下注册可调接口白名单
    if (this.provider.name === 'dify') {
      registerDefaultInterfaces()
    }
  },
  mounted() {
    this.initSessions()
  },
  methods: {
    // ==================== 面板开合 ====================
    toggleChat() {
      this.visible = !this.visible
      if (this.visible) {
        this.$nextTick(() => this.scrollToBottom())
      }
    },

    // ==================== 持久化操作 ====================
    async initSessions() {
      try {
        const data = this.storage.loadSessions()
        this.sessions = data instanceof Promise ? await data : data
      } catch (e) {
        console.error('加载会话列表失败:', e)
        this.sessions = []
      }
    },

    saveSessions() {
      try {
        this.storage.saveSessions(this.sessions)
      } catch (e) {
        console.error('保存会话列表失败:', e)
      }
    },

    async loadMessages(sessionId) {
      try {
        const data = this.storage.loadMessages(sessionId)
        return data instanceof Promise ? await data : data
      } catch (e) {
        console.error('加载消息失败:', e)
        return []
      }
    },

    saveCurrentMessages() {
      try {
        this.storage.saveMessages(this.currentSessionId, this.messages)
      } catch (e) {
        console.error('保存消息失败:', e)
      }
    },

    removeCurrentSessionMessages(sessionId) {
      try {
        this.storage.removeMessages(sessionId)
      } catch (e) {
        console.error('删除消息失败:', e)
      }
    },

    // ==================== 会话管理 ====================
    createNewSession() {
      if (this.isStreaming) {
        this.$message.warning('请等待当前回复完成后再创建新会话')
        return
      }
      const session = {
        id: this.generateId(),
        title: '新会话',
        createTime: Date.now(),
        lastTime: Date.now()
      }
      this.sessions.unshift(session)
      this.saveSessions()
      this.currentSessionId = session.id
      this.messages = []
      this.inputText = ''
      this.$nextTick(() => this.scrollToBottom())
    },

    async switchSession(sessionId) {
      if (this.isStreaming) {
        this.$message.warning('请等待当前回复完成后再切换会话')
        return
      }
      if (this.currentSessionId && this.messages.length > 0) {
        this.saveCurrentMessages()
      }
      this.currentSessionId = sessionId
      this.messages = await this.loadMessages(sessionId)
      this.inputText = ''
      this.$nextTick(() => this.scrollToBottom())
    },

    deleteSession(sessionId) {
      this.$confirm('确定要删除该会话吗？所有聊天记录将被清除。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.sessions = this.sessions.filter(s => s.id !== sessionId)
        this.saveSessions()
        this.removeCurrentSessionMessages(sessionId)
        delete this.conversationMap[sessionId]
        if (this.currentSessionId === sessionId) {
          this.messages = []
          this.currentSessionId = ''
        }
        this.$message.success('会话已删除')
      }).catch(() => {})
    },

    // ==================== 会话重命名 ====================
    startRenameSession(sessionId) {
      const session = this.sessions.find(s => s.id === sessionId)
      if (!session) return
      this.editingSessionId = sessionId
      this.editingSessionTitle = session.title
      // 下一帧聚焦输入框
      this.$nextTick(() => {
        const input = document.querySelector(`.rename-input[data-sid="${sessionId}"]`)
        if (input) {
          input.focus()
          input.select()
        }
      })
    },

    confirmRenameSession() {
      const title = this.editingSessionTitle.trim()
      if (!title) {
        this.cancelRenameSession()
        return
      }
      const session = this.sessions.find(s => s.id === this.editingSessionId)
      if (session) {
        session.title = title
        this.saveSessions()
      }
      this.editingSessionId = ''
      this.editingSessionTitle = ''
    },

    cancelRenameSession() {
      this.editingSessionId = ''
      this.editingSessionTitle = ''
    },

    handleRenameKeydown(event) {
      if (event.key === 'Enter') {
        event.preventDefault()
        this.confirmRenameSession()
      } else if (event.key === 'Escape') {
        event.preventDefault()
        this.cancelRenameSession()
      }
    },

    clearCurrentSession() {
      if (this.isStreaming) {
        this.$message.warning('请等待当前回复完成后再清空')
        return
      }
      this.$confirm('确定要清空当前会话的所有消息吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.messages = []
        if (this.currentSessionId) this.saveCurrentMessages()
        this.$message.success('已清空')
      }).catch(() => {})
    },

    // ==================== 消息发送 ====================
    sendMessage(e) {
      if (e && e.shiftKey) return // Shift+Enter 换行
      const text = this.inputText.trim()
      const images = [...this.previewImages]
      if (!text && images.length === 0) return
      if (e) e.preventDefault()

      // 正在流式输出时，按钮切换为「停止」
      if (this.isStreaming) {
        this.stopStreaming()
        return
      }

      const hasText = text.length > 0

      // 有文字内容时校验 API Key（纯图片消息不需要）
      if (hasText && !this.apiKey) {
        this.$message.warning(`请先设置 ${this.aiLabel} API Key`)
        this.showApiKeyDialog = true
        this.apiKeyInput = ''
        return
      }

      // 自动创建/更新会话（纯图片消息不创建会话）
      if (hasText && !this.currentSessionId) {
        const session = {
          id: this.generateId(),
          title: text.length > 20 ? text.substring(0, 20) + '...' : text,
          createTime: Date.now(),
          lastTime: Date.now()
        }
        this.sessions.unshift(session)
        this.currentSessionId = session.id
      } else if (this.currentSessionId) {
        const session = this.sessions.find(s => s.id === this.currentSessionId)
        if (session && this.messages.length === 0 && hasText) {
          session.title = text.length > 20 ? text.substring(0, 20) + '...' : text
        }
        if (session) session.lastTime = Date.now()
      }

      // 添加用户消息（文字 + 图片）
      this.messages.push({
        role: 'user',
        content: text,
        images,
        timestamp: Date.now()
      })
      this.inputText = ''
      this.previewImages = []
      this.$nextTick(() => this.scrollToBottom())

      // 纯图片消息：仅展示并保存，不触发 AI
      if (!hasText) {
        this.saveSessions()
        if (this.currentSessionId) this.saveCurrentMessages()
        return
      }

      this.sendToAI(text)
    },

    async sendToAI(text) {
      // ---- Agent 中间层：关键词匹配 → 工具调用 ----
      // Dify 模式下跳过本地 agent，直接走 Dify 知识库/流式链路
      const isDify = this.provider.name === 'dify'
      const agentResult = isDify ? { type: 'ai', tools: [] } : await routeMessage(text)
      if (agentResult.type === 'direct') {
        // 本地关键词命中，直接展示结果
        this.messages.push({
          role: 'assistant',
          content: agentResult.content,
          timestamp: Date.now(),
          agentDirect: true // 标记为 Agent 直接返回
        })
        this.saveCurrentMessages()
        this.saveSessions()
        this.$nextTick(() => this.scrollToBottom())
        return
      }

      // 未命中关键词，走 AI 模型（携带 tools 供 Function Calling）
      this.isStreaming = true
      this.streamingContent = ''
      const assistantMessage = {
        role: 'assistant',
        content: '',
        timestamp: Date.now()
      }
      this.messages.push(assistantMessage)

      try {
        await this.streamChatCompletion(assistantMessage, agentResult.tools || [])
      } catch (err) {
        console.error('AI 请求失败:', err)
        if (err.name !== 'AbortError') {
          assistantMessage.content = '抱歉，请求失败：' + (err.message || '网络错误，请稍后重试')
          this.$message.error('AI 请求失败，请检查网络或 API Key')
        } else {
          if (!assistantMessage.content) assistantMessage.content = '(已中断)'
        }
      } finally {
        this.isStreaming = false
        this.streamingContent = ''
        this.abortController = null
        this.saveCurrentMessages()
        this.saveSessions()
        this.$nextTick(() => this.scrollToBottom())
      }
    },

    // ==================== 流式调用 ====================
    async streamChatCompletion(assistantMsg, tools = []) {
      this.abortController = new AbortController()
      const recentMessages = this.buildContextMessages()
      const isDify = this.provider.name === 'dify'

      // 通过 provider 构建请求（传入 tools）
      const { url, options } = this.provider.buildRequest({
        messages: recentMessages,
        apiKey: this.apiKey,
        signal: this.abortController.signal,
        tools,
        // Dify：多轮上下文通过 conversation_id 回传
        conversationId: isDify ? (this.conversationMap[this.currentSessionId] || '') : undefined,
        user: 'web-ai-chat'
      })

      const response = await fetch(url, options)
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
      let previousLen = 0             // 累计模式下跟踪已处理长度
      const charQueue = []
      let playPromise = null
      let isPlaying = false
      let streamEnded = false         // 流读取是否已结束（不依赖 isStreaming，避免死循环）
      let hasExecutedToolCall = false // 流中是否已通过 message_end.outputs 执行过工具调用
      this.playbackStopped = false    // 重置停止信号

      /** 后台逐字播放器 */
      const startPlay = () => {
        if (isPlaying) return
        isPlaying = true
        playPromise = (async () => {
          while (!this.playbackStopped && (!streamEnded || charQueue.length > 0)) {
            if (charQueue.length > 0) {
              const char = charQueue.shift()
              assistantMsg.content += char
              this.streamingContent = assistantMsg.content
              await new Promise(r => setTimeout(r, TYPE_DELAY))
            } else {
              await new Promise(r => setTimeout(r, 30))
            }
            this.$nextTick(() => this.scrollToBottom())
          }
          // 用户主动停止时，清空剩余字符
          if (this.playbackStopped) charQueue.length = 0
        })()
      }

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
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
            if (data && data.conversation_id && this.currentSessionId) {
              this.conversationMap[this.currentSessionId] = data.conversation_id
            }

            const content = this.provider.parseStreamLine(data)
            if (!content) continue

            // 处理 Function Calling / Dify 结构化调用的 tool_calls 响应
            if (typeof content === 'object' && content.type === 'tool_calls') {
              // Dify：走结构化执行器；其他 provider：走既有 Function Calling 执行器
              const toolResults = isDify
                ? await executeDifyToolCalls(content.toolCalls)
                : await executeAIToolCalls(content.toolCalls)
              if (isDify) hasExecutedToolCall = true
              if (toolResults.length > 0) {
                // 将工具结果注入消息，展示给用户
                for (const tr of toolResults) {
                  charQueue.push(...(tr.content || ''))
                }
                startPlay()
              }
              continue
            }

            if (this.provider.accumulatedContent) {
              // 累积模式（Qwen）：每次返回完整文本，需计算增量
              if (content.length > previousLen) {
                const delta = content.slice(previousLen)
                previousLen = content.length
                for (const ch of delta) charQueue.push(ch)
                startPlay()
              }
            } else {
              // 增量模式（DeepSeek/Dify）：content 即为增量
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
              if (data.conversation_id && this.currentSessionId) {
                this.conversationMap[this.currentSessionId] = data.conversation_id
              }
              const content = this.provider.parseStreamLine(data)
              if (content) {
                // 处理 Function Calling / Dify 结构化调用的 tool_calls 响应
                if (typeof content === 'object' && content.type === 'tool_calls') {
                  const toolResults = isDify
                    ? await executeDifyToolCalls(content.toolCalls)
                    : await executeAIToolCalls(content.toolCalls)
                  if (isDify) hasExecutedToolCall = true
                  for (const tr of toolResults) {
                    charQueue.push(...(tr.content || ''))
                  }
                  startPlay()
                } else if (this.provider.accumulatedContent) {
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
        if (isDify && !hasExecutedToolCall) {
          const fullText = assistantMsg.content || ''
          const fallbackCalls = extractToolCallsFromAnswer(fullText)
          if (fallbackCalls && fallbackCalls.length > 0) {
            const toolResults = await executeDifyToolCalls(fallbackCalls)
            if (toolResults.length > 0) {
              for (const tr of toolResults) {
                assistantMsg.content += (assistantMsg.content ? '\n\n' : '') + (tr.content || '')
              }
              this.streamingContent = assistantMsg.content
              this.$nextTick(() => this.scrollToBottom())
            }
          }
        }
      } finally {
        streamEnded = true // 中断场景下也通知播放器退出
        try { reader.releaseLock() } catch (e) {}
      }
    },

    // ==================== 上下文构建 ====================
    buildContextMessages() {
      const systemPrompt = {
        role: 'system',
        content: this.sysPromptContent
      }
      const recentMessages = this.messages
        .filter(m => m.content !== '')
        .slice(-20)
        .map(m => ({ role: m.role, content: m.content }))
      return [systemPrompt, ...recentMessages]
    },

    // ==================== API Key 管理 ====================
    openApiKeyDialog() {
      this.apiKeyInput = this.apiKey || ''
      this.showApiKeyDialog = true
    },

    confirmApiKey() {
      const key = this.apiKeyInput.trim()
      if (!key) {
        this.$message.warning('请输入 API Key')
        return
      }
      this.storage.saveApiKey(key)
      this.apiKey = key
      this.apiKeyLocked = false
      this.showApiKeyDialog = false
      this.$message.success('API Key 已保存')
    },

    // ==================== 停止 ====================
    stopStreaming() {
      this.playbackStopped = true // 先通知播放循环退出
      if (this.abortController) {
        this.abortController.abort()
        this.abortController = null
      }
    },

    // ==================== 图片处理 ====================
    handleImageSelect(file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        this.previewImages.push(e.target.result)
      }
      reader.readAsDataURL(file.raw)
    },

    handlePaste(e) {
      const items = e.clipboardData && e.clipboardData.items
      if (!items) return
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          e.preventDefault()
          const file = items[i].getAsFile()
          const reader = new FileReader()
          reader.onload = (ev) => {
            this.previewImages.push(ev.target.result)
          }
          reader.readAsDataURL(file)
        }
      }
    },

    removePreviewImage(index) {
      this.previewImages.splice(index, 1)
    },

    previewImage(url) {
      this.dialogImageUrl = url
      this.dialogVisible = true
    },

    // ==================== 工具函数 ====================
    generateId() {
      return 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9)
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const el = this.messageContainer
        if (el) el.scrollTop = el.scrollHeight
      })
    },

    formatTime(timestamp) {
      if (!timestamp) return ''
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
    },

    handleKeydown(event) {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        this.sendMessage()
      }
    },

    renderMarkdown
  }
}
