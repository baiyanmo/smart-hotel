import './chatDialog.css'
import { sendChat, type WeatherData } from '../api/client'

export interface ChatCallbacks {
  /** Live2D 表情 */
  onEmotion?: (name: string) => void
  /** Live2D 动作 */
  onAction?: (name: string) => void
  /** 天气更新 */
  onWeatherData?: (data: WeatherData) => void
}

export class ChatDialog {
  readonly element: HTMLDivElement

  private _sessionId: string
  private _messagesEl!: HTMLElement
  private _inputEl!: HTMLInputElement
  private _sendBtn!: HTMLButtonElement
  private _voiceBtn!: HTMLButtonElement
  private _sending = false
  private _recording = false

  constructor(private callbacks: ChatCallbacks = {}) {
    this._sessionId = this._genSessionId()

    const el = (this.element = document.createElement('div'))
    el.id = 'chat-dialog'
    el.innerHTML = `
      <div class="chat-header">
        <span class="online-dot"></span>
        💬 AI 管家
      </div>
      <div class="chat-messages" id="cd-messages">
        <div class="msg ai">
          <div class="msg-label">AI 管家</div>
          欢迎光临智慧酒店！我是您的 AI 管家，请问有什么可以帮您的？😊
        </div>
      </div>
      <div class="chat-input-area">
        <button class="btn-voice" id="cd-voice" title="语音输入">🎤</button>
        <input type="text" id="cd-input" placeholder="输入消息..." autocomplete="off">
        <button id="cd-send">📨 发送</button>
      </div>
    `

    this._messagesEl = el.querySelector('#cd-messages')!
    this._inputEl = el.querySelector('#cd-input')!
    this._sendBtn = el.querySelector('#cd-send')!
    this._voiceBtn = el.querySelector('#cd-voice')!

    this._bindEvents()
  }

  private _genSessionId(): string {
    return 'web_' + Math.random().toString(36).slice(2, 10)
  }

  private _bindEvents() {
    this._sendBtn.addEventListener('click', () => this._send())
    this._inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this._send()
    })
    this._voiceBtn.addEventListener('click', () => this._toggleVoice())
  }

  private _toggleVoice() {
    if (this._recording) {
      this._stopRecording()
    } else {
      this._startRecording()
    }
  }

  private _startRecording() {
    this._recording = true
    this._voiceBtn.textContent = '⏹'
    this._voiceBtn.classList.add('recording')
    this._inputEl.placeholder = '🎤 正在聆听...'
    // TODO: 接入火山引擎 ASR
  }

  private _stopRecording() {
    this._recording = false
    this._voiceBtn.textContent = '🎤'
    this._voiceBtn.classList.remove('recording')
    this._inputEl.placeholder = '输入消息...'
    // TODO: 发送识别结果
  }

  private async _send() {
    const text = this._inputEl.value.trim()
    if (!text || this._sending) return

    this._sending = true
    this._inputEl.value = ''
    this._sendBtn.disabled = true
    this._sendBtn.textContent = '⏳...'

    // 用户消息
    this._appendMessage('user', text)

    // 显示 AI 输入中
    const thinkingEl = this._appendMessage('ai', '...')
    this._scrollBottom()

    try {
      const data = await sendChat([{ role: 'user', content: text }])

      // 表情 / 动作 — 先于内容渲染，防止 passthrough 时表情被等待
      if (data.emotion) this.callbacks.onEmotion?.(data.emotion)
      if (data.action) this.callbacks.onAction?.(data.action)

      // 替换 "..." 为实际回复
      thinkingEl.querySelector('.msg-text')!.textContent = data.content || '(AI 回复为空)'

      // 天气（如有）
      // if (data.weather_data) this.callbacks.onWeatherData?.(data.weather_data)
    } catch (err) {
      thinkingEl.querySelector('.msg-text')!.textContent =
        '抱歉，AI 服务暂时不可用，请稍后再试 😥'
      console.error('[chat] 发送失败:', err)
    } finally {
      this._sending = false
      this._sendBtn.disabled = false
      this._sendBtn.textContent = '📨 发送'
      this._inputEl.focus()
      this._scrollBottom()
    }
  }

  private _appendMessage(role: 'user' | 'ai', text: string): HTMLElement {
    const div = document.createElement('div')
    div.className = `msg ${role}`
    div.innerHTML = `
      <div class="msg-label">${role === 'user' ? '我' : 'AI 管家'}</div>
      <span class="msg-text">${text}</span>
    `
    this._messagesEl.appendChild(div)
    return div
  }

  private _scrollBottom() {
    this._messagesEl.scrollTop = this._messagesEl.scrollHeight
  }

  /** 外部添加 AI 消息 */
  addAiMessage(text: string) {
    this._appendMessage('ai', text)
    this._scrollBottom()
  }

  /** 聚焦输入框 */
  focus() {
    this._inputEl.focus()
  }

  /** 销毁 */
  destroy() {
    // 暂无需要清理的资源
  }
}
