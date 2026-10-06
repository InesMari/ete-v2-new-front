<template>
  <div class="chat-box-wrapper">
    <!-- 悬浮按钮 -->
    <div class="chat-float-btn" @click="toggleChat" v-show="!visible">
      <i class="el-icon-chat-dot-round"></i>
      <span>在线咨询</span>
    </div>

    <!-- 聊天窗口 -->
    <div class="chat-panel" v-show="visible">
      <!-- 顶部标题栏 -->
      <div class="chat-header">
        <div class="header-left">
          <button class="toggle-sidebar-btn" @click="sidebarVisible = !sidebarVisible" title="会话列表">
            <i :class="sidebarVisible ? 'el-icon-fold' : 'el-icon-expand'"></i>
          </button>
          <span class="header-title">{{ currentSessionTitle || headerTitle }}</span>
        </div>
        <div class="header-right">
          <i
            v-if="currentSessionId && messages.length > 0"
            class="el-icon-delete header-action"
            title="清空会话"
            @click="clearCurrentSession"
          ></i>
          <i
            v-if="!apiKeyLocked"
            class="el-icon-setting header-action"
            title="API Key"
            @click="openApiKeyDialog"
          ></i>
          <i class="el-icon-close header-action" title="关闭" @click="toggleChat"></i>
        </div>
      </div>

      <!-- 主体：侧边栏 + 消息区 -->
      <div class="chat-body">
        <!-- 会话侧边栏 -->
        <div class="chat-sidebar" :class="{ collapsed: !sidebarVisible }">
          <div class="sidebar-header">
            <el-button type="primary" size="mini" class="new-chat-btn" @click="createNewSession" :disabled="isStreaming">
              <i class="el-icon-plus"></i>
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
                <div v-if="session.id === editingSessionId" class="session-title-edit" @click.stop>
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
              <div v-if="session.id !== editingSessionId" class="session-actions" @click.stop>
                <i class="el-icon-edit rename-btn" title="重命名" @click="startRenameSession(session.id)"></i>
                <i class="el-icon-delete delete-btn" title="删除" @click="deleteSession(session.id)"></i>
              </div>
            </div>
            <div v-if="sessions.length === 0" class="empty-sessions">
              <p>暂无会话记录</p>
              <p class="sub-text">点击上方按钮开始新会话</p>
            </div>
          </div>
        </div>

        <!-- 消息区域 -->
        <div class="message-area" ref="messageContainer">
          <!-- 空状态引导 -->
          <div v-if="messages.length === 0" class="welcome-area">
            <div class="welcome-icon">
              <i class="el-icon-chat-dot-round"></i>
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
              <i :class="msg.role === 'user' ? 'el-icon-user' : 'el-icon-cpu'"></i>
            </div>
            <div class="message-body">
              <div class="message-role">
                {{ msg.role === 'user' ? '我' : aiLabel }}
                <span v-if="msg.role === 'assistant' && msg.agentDirect" class="agent-badge">系统查询</span>
              </div>
              <!-- 用户消息：文字 + 图片 -->
              <div class="message-content" v-if="msg.role === 'user'">
                <div v-if="msg.content" class="user-text">{{ msg.content }}</div>
                <div v-if="msg.images && msg.images.length > 0" class="msg-images">
                  <img
                    v-for="(img, i) in msg.images"
                    :key="i"
                    :src="img"
                    alt="图片"
                    @click="previewImage(img)"
                  />
                </div>
              </div>
              <!-- AI 消息：Markdown -->
              <div
                class="message-content markdown-body"
                v-else
                v-html="renderMarkdown(msg.content)"
              ></div>
              <!-- 流式输出光标 -->
              <span
                v-if="isStreaming && index === messages.length - 1 && msg.role === 'assistant'"
                class="streaming-cursor"
              >▍</span>
              <div class="msg-time">{{ formatTime(msg.timestamp) }}</div>
            </div>
          </div>

          <!-- 加载提示 -->
          <div v-if="isStreaming && !streamingContent" class="loading-indicator">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </div>
      </div>

      <!-- 图片预览条 -->
      <div class="img-preview-bar" v-show="previewImages.length > 0">
        <div class="preview-item" v-for="(img, idx) in previewImages" :key="idx">
          <img :src="img" alt="preview" />
          <i class="el-icon-close" @click="removePreviewImage(idx)"></i>
        </div>
      </div>

      <!-- 底部输入区域 -->
      <div class="chat-footer">
        <el-input
          type="textarea"
          :rows="2"
          v-model="inputText"
          placeholder="请输入消息...（Enter 发送 / Ctrl+V 粘贴图片）"
          resize="none"
          @keydown.native="handleKeydown"
          @paste.native="handlePaste"
        ></el-input>
        <div class="tool-bar">
          <div class="tool-left">
            <el-upload
              class="img-upload"
              action="#"
              :auto-upload="false"
              :show-file-list="false"
              accept="image/*"
              :on-change="handleImageSelect"
              multiple
            >
              <i class="el-icon-picture-outline" title="发送图片"></i>
            </el-upload>
            <span class="input-hint">Enter 发送 / Shift+Enter 换行</span>
          </div>
          <el-button v-if="!isStreaming" type="primary" size="mini" @click="sendMessage" :disabled="!canSend">
            <i class="el-icon-promotion"></i> 发送
          </el-button>
          <el-button v-else type="danger" size="mini" @click="stopStreaming">
            <i class="el-icon-video-pause"></i> 停止
          </el-button>
        </div>
      </div>
    </div>

    <!-- 图片预览大图 -->
    <el-dialog :visible.sync="dialogVisible" append-to-body width="600px">
      <img :src="dialogImageUrl" style="width: 100%;" />
    </el-dialog>

    <!-- API Key 设置弹窗 -->
    <el-dialog
      :visible.sync="showApiKeyDialog"
      :title="'设置 ' + aiLabel + ' API Key'"
      width="480px"
      :close-on-click-modal="false"
      append-to-body
    >
      <div class="api-key-dialog-content">
        <el-alert title="如何获取 API Key？" type="info" :closable="false" show-icon>
          <p>
            请访问
            <a :href="provider.apiKeyUrl" target="_blank" style="color: #409EFF;">控制台</a>
            创建并获取 {{ aiLabel }} 的 API Key
          </p>
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="showApiKeyDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmApiKey">确认保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import chatBox from './chatBox.js'
  export default chatBox
</script>

<style lang="scss" src="./chatBox.scss" scoped>
</style>
