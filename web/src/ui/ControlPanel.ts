import { SCALE_MIN, SCALE_MAX, SCALE_STEP, clampScale } from '../model/config'
import './controlPanel.css'

export interface PanelCallbacks {
  onPositionChange: (x: number, y: number) => void
  onScaleChange: (scale: number) => void
  onResetPosition: () => void
  onFitToScreen: () => void
  onImportFile: (file: File) => void
}

export class ControlPanel {
  readonly element: HTMLDivElement
  private _xSlider: HTMLInputElement
  private _ySlider: HTMLInputElement
  private _scaleSlider: HTMLInputElement
  private _scaleLabel: HTMLSpanElement
  private _nameSpan: HTMLSpanElement

  constructor(private callbacks: PanelCallbacks) {
    const el = (this.element = document.createElement('div'))
    el.id = 'ctrl-panel'

    el.innerHTML = `
      <h3>🎛️ 控制面板</h3>
      <span class="model-name">模型: 加载中...</span>

      <div class="section">
        <label>位置 X <span></span></label>
        <input type="range" min="-500" max="500" value="0" step="5" data-axis="x">
        <label>位置 Y <span></span></label>
        <input type="range" min="-500" max="500" value="0" step="5" data-axis="y">
        <button id="btn-reset">📍 复位</button>
      </div>

      <div class="section">
        <label>缩放 <span class="scale-val">1.0x</span></label>
        <input type="range" min="${SCALE_MIN * 100}" max="${SCALE_MAX * 100}" value="100" step="${SCALE_STEP * 100}">
        <button id="btn-fit">📐 适配屏幕</button>
      </div>

      <div class="section">
        <label>导入模型</label>
        <span class="btn-file" id="btn-file">📦 选择 .zip 文件</span>
        <input type="file" accept=".zip" style="display:none" id="file-input">
        <div class="drop-hint">或拖放 .zip 到窗口任意位置</div>
      </div>

      <div class="section keybinds" id="keybinds-section" style="display:none">
        <label>⌨ 键盘控制</label>
        <div class="keybinds-list" id="keybinds-list"></div>
      </div>
    `

    // 缓存引用
    this._xSlider = el.querySelector('[data-axis="x"]')!
    this._ySlider = el.querySelector('[data-axis="y"]')!
    this._scaleSlider = el.querySelector('input[type="range"]:not([data-axis])')!
    this._scaleLabel = el.querySelector('.scale-val')!
    this._nameSpan = el.querySelector('.model-name')!

    this._bindEvents()
  }

  private _bindEvents() {
    this._xSlider.addEventListener('input', () => {
      const x = Number(this._xSlider.value)
      const y = Number(this._ySlider.value)
      this.callbacks.onPositionChange(x, y)
    })

    this._ySlider.addEventListener('input', () => {
      const x = Number(this._xSlider.value)
      const y = Number(this._ySlider.value)
      this.callbacks.onPositionChange(x, y)
    })

    this._scaleSlider.addEventListener('input', () => {
      const s = Number(this._scaleSlider.value) / 100
      this._scaleLabel.textContent = s.toFixed(2) + 'x'
      this.callbacks.onScaleChange(s)
    })

    this.element.querySelector('#btn-reset')!.addEventListener('click', () => {
      this._xSlider.value = '0'
      this._ySlider.value = '0'
      this.callbacks.onResetPosition()
    })

    this.element.querySelector('#btn-fit')!.addEventListener('click', () => {
      this.callbacks.onFitToScreen()
    })

    const fileInput = this.element.querySelector('#file-input')! as HTMLInputElement
    this.element.querySelector('#btn-file')!.addEventListener('click', () => {
      fileInput.click()
    })
    fileInput.addEventListener('change', () => {
      const file = fileInput.files?.[0]
      if (file && file.name.endsWith('.zip')) {
        this.callbacks.onImportFile(file)
        fileInput.value = ''
      }
    })
  }

  /** 外部更新滑块值（不触发回调） */
  setPosition(x: number, y: number) {
    this._xSlider.value = String(Math.round(x))
    this._ySlider.value = String(Math.round(y))
  }

  setScale(s: number) {
    const v = clampScale(s)
    this._scaleSlider.value = String(Math.round(v * 100))
    this._scaleLabel.textContent = v.toFixed(2) + 'x'
  }

  setModelName(name: string) {
    this._nameSpan.textContent = '模型: ' + name
  }

  /** 显示动作 & 表情列表 + 按键映射 */
  showMotionExpressionInfo(motionEntries: string[], expressionNames: string[]) {
    const section = this.element.querySelector('#keybinds-section') as HTMLElement
    const listEl = this.element.querySelector('#keybinds-list') as HTMLElement

    if (!motionEntries.length && !expressionNames.length) {
      section.style.display = 'none'
      return
    }

    section.style.display = ''
    let html = ''

    if (motionEntries.length) {
      const items = motionEntries.slice(0, 9)
      html += '<div class="kb-group">🎬 动作 | '
      html += items.map((name, i) => `<kbd>${i + 1}</kbd> ${name}`).join(' &nbsp;')
      html += '</div>'
    }

    if (expressionNames.length) {
      const keys = 'QWERTYUIOP'.split('')
      const items = expressionNames.slice(0, 10)
      html += '<div class="kb-group">😊 表情 | '
      html += items.map((name, i) => `<kbd>${keys[i]}</kbd> ${name}`).join(' &nbsp;')
      html += '</div>'
    }

    html += '<div class="kb-group"><kbd>0</kbd> 停止 / 重置表情</div>'
    listEl.innerHTML = html
  }
}
