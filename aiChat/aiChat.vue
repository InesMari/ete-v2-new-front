<template>
  <div class="ai-chat-container">
    <!-- 左侧会话列表侧边栏 -->
    <div class="chat-sidebar" :class="{ collapsed: !sidebarVisible }">
      <div class="sidebar-header">
        <el-button type="primary" class="new-chat-btn" @click="createNewSession" :disabled="isStreaming">
          <el-icon><Plus /></el-icon>
          <span>新建会话</span>
        </el-button>
      </div>
      <div class="session-list">
        <div
          v-for="session in sessions"
          :key="session.id"
          class="session-item"
          :class="{ active: session.id === currentSessionId }"
          @click="session.id === editingSessionId ? null : switchSession(session.id)"
        >
          <div class="session-info">
            <!-- 编辑态：内联输入框 -->
            <div class="session-title-edit" v-if="session.id === editingSessionId" @click.stop>
              <input
                class="rename-input"
                :data-sid="session.id"
                v-model="editingSessionTitle"
                @keydown="handleRenameKeydown"
                @blur="confirmRenameSession"
              />
            </div>
            <!-- 正常态：标题文本 -->
            <template v-else>
              <div class="session-title">{{ session.title }}</div>
              <div class="session-time">{{ formatTime(session.lastTime) }}</div>
            </template>
          </div>
          <div class="session-actions" v-if="session.id !== editingSessionId" @click.stop>
            <el-button
              class="rename-btn"
              text
              size="small"
              @click="startRenameSession(session.id)"
              title="重命名"
            >
              <el-icon><Edit /></el-icon>
            </el-button>
            <el-button
              class="delete-btn"
              text
              size="small"
              @click="deleteSession(session.id)"
              title="删除"
            >
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
        </div>
        <div v-if="sessions.length === 0" class="empty-sessions">
          <p>暂无会话记录</p>
          <p class="sub-text">点击上方按钮开始新会话</p>
        </div>
      </div>
    </div>

    <!-- 右侧聊天主区域 -->
    <div class="chat-main">
      <!-- 顶部标题栏 -->
      <div class="chat-header">
        <div class="header-left">
          <el-button text class="toggle-sidebar-btn" @click="sidebarVisible = !sidebarVisible">
            <el-icon><Expand v-if="!sidebarVisible" /><Fold v-else /></el-icon>
          </el-button>
          <span class="header-title">
            {{ currentSessionTitle || headerTitle }}
          </span>
        </div>
        <div class="header-right">
          <el-button text @click="clearCurrentSession" v-if="currentSessionId && messages.length > 0">
            <el-icon><Delete /></el-icon>
            清空会话
          </el-button>
          <el-button text @click="openApiKeyDialog" v-if="apiKeyEditable && !apiKeyLocked">
            <el-icon><Setting /></el-icon>
            API Key
          </el-button>
        </div>
      </div>

      <!-- 消息区域 -->
      <div class="message-area" ref="setMessageContainer">
        <!-- 空状态引导 -->
        <div v-if="messages.length === 0" class="welcome-area">
          <div class="welcome-icon">
            <el-icon :size="64"><ChatDotRound /></el-icon>
          </div>
          <h2>欢迎使用 {{ headerTitle }}</h2>
          <p class="welcome-desc">{{ welcomeDesc }}</p>
          <div class="quick-prompts">
            <div
              v-for="prompt in prompts"
              :key="prompt"
              class="quick-prompt-item"
              @click="inputText = prompt; sendMessage()"
            >
              {{ prompt }}
            </div>
          </div>
        </div>

        <!-- 消息列表 -->
        <div
          v-for="(msg, index) in messages"
          :key="index"
          class="message-wrapper"
          :class="msg.role"
        >
          <div class="message-avatar">
            <el-avatar :size="36" v-if="msg.role === 'user'">
              <el-icon :size="20"><UserFilled /></el-icon>
            </el-avatar>
            <el-avatar :size="36" v-else style="background: #409EFF;">
              <el-icon :size="20"><Cpu /></el-icon>
            </el-avatar>
          </div>
          <div class="message-body">
            <div class="message-role">
              {{ msg.role === 'user' ? '我' : aiLabel }}
              <span v-if="msg.role === 'assistant' && msg.agentDirect" class="agent-badge">系统查询</span>
            </div>
            <div class="message-content" v-if="msg.role === 'user'">
              {{ msg.content }}
            </div>
            <div
              class="message-content markdown-body"
              v-else
              v-html="renderMarkdown(msg.content)"
            ></div>
            <!-- 流式输出光标 -->
            <span v-if="isStreaming && index === messages.length - 1 && msg.role === 'assistant'" class="streaming-cursor">▍</span>
          </div>
        </div>

        <!-- 加载提示 -->
        <div v-if="isStreaming && !streamingContent" class="loading-indicator">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
      </div>

      <!-- 底部输入区域 -->
      <div class="input-area">
        <div class="input-wrapper">
          <el-input
            v-model="inputText"
            type="textarea"
            :rows="2"
            placeholder="输入消息，Enter 发送，Shift+Enter 换行..."
            resize="none"
            :disabled="false"
            @keydown="handleKeydown"
          />
          <div class="input-actions">
            <span class="input-hint">Enter 发送 / Shift+Enter 换行</span>
            <el-button
              v-if="!isStreaming"
              type="primary"
              :disabled="!inputText.trim()"
              @click="sendMessage"
            >
              <el-icon><Promotion /></el-icon>
              发送
            </el-button>
            <el-button
              v-else
              type="danger"
              @click="stopStreaming"
            >
              <el-icon><VideoPause /></el-icon>
              停止
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- API Key 设置弹窗（provider 感知） -->
    <el-dialog
      v-model="showApiKeyDialog"
      :title="'设置 ' + aiLabel + ' API Key'"
      width="500px"
      :close-on-click-modal="false"
    >
      <div class="api-key-dialog-content">
        <el-alert
          title="如何获取 API Key？"
          type="info"
          :closable="false"
          show-icon
        >
          <template #default>
            <p>
              请访问
              <a :href="providerApiKeyUrl" target="_blank" style="color: #409EFF;">控制台</a>
              创建并获取 {{ aiLabel }} 的 API Key
            </p>
          </template>
        </el-alert>
        <div class="api-key-input-wrap">
          <label>API Key</label>
          <el-input
            v-model="apiKeyInput"
            type="password"
            show-password
            :placeholder="'请输入 ' + aiLabel + ' API Key'"
          />
        </div>
      </div>
      <template #footer>
        <el-button @click="showApiKeyDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmApiKey">确认保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import aiChat from './aiChat.js'
import {
  Plus, Delete, Setting, Promotion, VideoPause, Edit,
  ChatDotRound, UserFilled, Cpu, Expand, Fold
} from '@element-plus/icons-vue'

export default {
  components: {
    Plus, Delete, Setting, Promotion, VideoPause, Edit,
    ChatDotRound, UserFilled, Cpu, Expand, Fold
  },
  ...aiChat,
  // demo 页默认接入本地 Dify Chatflow 验证链路
  props: {
    provider: { type: [String, Object], default: 'dify' },
    apiKey: { type: String, default: '' }
  }
}
</script>

<style lang="scss" scoped>
.ai-chat-container {
  display: flex;
  height: calc(100vh - 86px);
  background: #f5f7fa;
  overflow: hidden;
  flex-direction: row!important;
}

// ========== 左侧边栏 ==========
.chat-sidebar {
  width: 280px;
  min-width: 280px;
  background: #fff;
  border-right: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
  transition: width 0.3s, min-width 0.3s;

  &.collapsed {
    width: 0;
    min-width: 0;
    overflow: hidden;
  }
}

.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid #ebeef5;

  .new-chat-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    height: 40px;
    font-size: 14px;
  }
}

.session-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #dcdfe6;
    border-radius: 2px;
  }
}

.session-item {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 4px;
  transition: background 0.2s;

  &:hover {
    background: #f0f2f5;

    .rename-btn,
    .delete-btn {
      opacity: 1;
    }
  }

  &.active {
    background: #ecf5ff;
  }

  .session-info {
    flex: 1;
    min-width: 0;
  }

  .session-title-edit {
    .rename-input {
      width: 100%;
      padding: 4px 8px;
      border: 1px solid #409EFF;
      border-radius: 4px;
      font-size: 14px;
      color: #303133;
      outline: none;
      background: #fff;
      box-sizing: border-box;
      line-height: 1.5;

      &:focus {
        border-color: #409EFF;
        box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
      }
    }
  }

  .session-actions {
    display: flex;
    align-items: center;
    gap: 2px;
    flex-shrink: 0;
  }

  .rename-btn {
    opacity: 0;
    color: #909399;
    transition: opacity 0.2s;

    &:hover {
      color: #409EFF;
    }
  }

  .session-title {
    font-size: 14px;
    color: #303133;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .session-time {
    font-size: 12px;
    color: #909399;
    margin-top: 2px;
  }

  .delete-btn {
    opacity: 0;
    color: #909399;
    transition: opacity 0.2s;

    &:hover {
      color: #f56c6c;
    }
  }
}

.empty-sessions {
  text-align: center;
  padding: 40px 20px;
  color: #909399;
  font-size: 14px;

  .sub-text {
    font-size: 12px;
    margin-top: 8px;
    color: #c0c4cc;
  }
}

// ========== 右侧主区域 ==========
.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.chat-header {
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  flex-shrink: 0;

  .header-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .header-title {
    font-size: 15px;
    font-weight: 600;
    color: #303133;
  }

  .header-right {
    display: flex;
    gap: 4px;
  }
}

.toggle-sidebar-btn {
  font-size: 18px;
  color: #606266;
}

// ========== 消息区域 ==========
.message-area {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #dcdfe6;
    border-radius: 3px;
  }
}

// 欢迎页
.welcome-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 40px;

  .welcome-icon {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: linear-gradient(135deg, #409EFF, #66B1FF);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    margin-bottom: 20px;
    box-shadow: 0 4px 16px rgba(64, 158, 255, 0.3);
  }

  h2 {
    font-size: 22px;
    font-weight: 600;
    color: #303133;
    margin: 0 0 8px;
  }

  .welcome-desc {
    color: #909399;
    font-size: 14px;
    margin-bottom: 28px;
  }

  .quick-prompts {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    max-width: 600px;
  }

  .quick-prompt-item {
    padding: 8px 16px;
    background: #fff;
    border: 1px solid #e4e7ed;
    border-radius: 20px;
    font-size: 13px;
    color: #606266;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      border-color: #409EFF;
      color: #409EFF;
      background: #ecf5ff;
    }
  }
}

// 消息项
.message-wrapper {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;

  &.user {
    flex-direction: row-reverse;

    .message-body {
      align-items: flex-end;
    }

    .message-content {
      background: #409EFF;
      color: #fff;
      border-radius: 12px 4px 12px 12px;
    }

    .message-role {
      text-align: right;
    }
  }

  &.assistant {
    .message-content {
      background: #fff;
      color: #303133;
      border: 1px solid #e4e7ed;
      border-radius: 4px 12px 12px 12px;
    }
  }
}

.message-avatar {
  flex-shrink: 0;
  padding-top: 4px;
}

.message-body {
  display: flex;
  flex-direction: column;
  max-width: 75%;
  min-width: 100px;
}

.message-role {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}

// Agent 工具调用标识
.agent-badge {
  display: inline-block;
  font-size: 11px;
  color: #67C23A;
  background: #f0f9eb;
  border: 1px solid #e1f3d8;
  border-radius: 3px;
  padding: 1px 6px;
  line-height: 1.5;
}

.message-content {
  padding: 10px 16px;
  font-size: 14px;
  line-height: 1.7;
  word-break: break-word;

  // Markdown 内容样式
  &.markdown-body {
    :deep(p) {
      margin: 0 0 8px;
      &:last-child { margin-bottom: 0; }
    }

    :deep(pre) {
      background: #f6f8fa;
      border-radius: 6px;
      padding: 12px 16px;
      overflow-x: auto;
      margin: 8px 0;
      border: 1px solid #e1e4e8;

      code {
        font-size: 13px;
        font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
      }
    }

    :deep(code) {
      background: rgba(175, 184, 193, 0.2);
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 13px;
    }

    :deep(pre code) {
      background: none;
      padding: 0;
    }

    :deep(ul), :deep(ol) {
      padding-left: 20px;
      margin: 4px 0;
    }

    :deep(li) {
      margin: 2px 0;
    }

    :deep(table) {
      border-collapse: collapse;
      margin: 8px 0;
      width: 100%;
      font-size: 13px;

      th, td {
        border: 1px solid #dfe2e5;
        padding: 8px 12px;
        text-align: left;
      }

      th {
        background: #f0f5ff;
        font-weight: 600;
        color: #409EFF;
        white-space: nowrap;
      }

      td {
        background: #fff;
      }

      tr:nth-child(even) td {
        background: #fafafa;
      }
    }

    :deep(blockquote) {
      border-left: 3px solid #409EFF;
      padding-left: 12px;
      margin: 8px 0;
      color: #606266;
    }

    :deep(h1), :deep(h2), :deep(h3), :deep(h4) {
      margin: 12px 0 6px;
      font-weight: 600;
    }

    :deep(h1) { font-size: 20px; }
    :deep(h2) { font-size: 18px; }
    :deep(h3) { font-size: 16px; }
  }
}

// 流式光标动画
.streaming-cursor {
  display: inline;
  color: #409EFF;
  font-weight: bold;
  animation: blink 1s infinite;
  margin-left: 2px;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

// 加载动画
.loading-indicator {
  display: flex;
  gap: 6px;
  padding: 12px 0 12px 48px;

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #c0c4cc;
    animation: dotPulse 1.4s infinite ease-in-out both;

    &:nth-child(1) { animation-delay: -0.32s; }
    &:nth-child(2) { animation-delay: -0.16s; }
  }
}

@keyframes dotPulse {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

// ========== 底部输入区域 ==========
.input-area {
  padding: 12px 24px 16px;
  background: #fff;
  border-top: 1px solid #e4e7ed;
  flex-shrink: 0;
}

.input-wrapper {
  :deep(.el-textarea__inner) {
    border-radius: 8px;
    font-size: 14px;
    line-height: 1.6;
    background: #f5f7fa;
    border-color: #e4e7ed;

    &:focus {
      border-color: #409EFF;
      background: #fff;
    }
  }
}

.input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.input-hint {
  font-size: 12px;
  color: #c0c4cc;
}

// ========== API Key 弹窗 ==========
.api-key-dialog-content {
  .api-key-input-wrap {
    margin-top: 16px;

    label {
      display: block;
      font-size: 14px;
      color: #606266;
      margin-bottom: 6px;
    }
  }
}
</style>
