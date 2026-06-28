[English](#en) | [中文](#zh)

---

<h1 id="en">Live2D Viewer</h1>

A Live2D Cubism4 model viewer built with PixiJS + pixi-live2d-display.

## Tech Stack

- PixiJS 6 (`pixi.js@^6.5`)
- pixi-live2d-display 0.4 (`cubism4`)
- JSZip 3 — zip reading / custom Cubism4ModelSettings construction
- Vite 5 + TypeScript 5
- Vanilla DOM/CSS control panel (no framework)

## Quick Start

```bash
npm install
npm run dev      # Vite dev server → http://localhost:5173
npm run build    # tsc && vite build
```

Place a Live2D `.zip` model in `src/models/` (currently defaults to `waifu-flat.zip`).

## Features

- **Model display**: loads Cubism4 models from `.zip` files
- **Auto-augmentation**: picks up loose `.motion3.json` / `.exp3.json` files even if `.model3.json` doesn't reference them
- **Eye tracking**: model gaze follows mouse cursor
- **Drag to move**: click and drag the model (>5px threshold)
- **Click body**: random motion playback
- **Keyboard control**: `1-9` motions, `Q-P` expressions, `0` reset
- **Mouse wheel**: zoom (0.1x ~ 3.0x)
- **Drag & drop**: drop any `.zip` model file onto the window
- **Control panel**: position sliders, scale slider, file import, keybinding display

## Project Structure

```
src/
├── main.ts              # Entry: PixiJS app, keyboard/wheel/drop events
├── model/
│   ├── loader.ts        # ZipLoader config, model loading, motion/expression augmentation
│   └── config.ts        # Scale constants, fitToScreen
├── interaction/
│   └── pointer.ts       # Custom pointer handling (drag/tap/focus)
├── ui/
│   ├── ControlPanel.ts  # Floating control panel
│   └── controlPanel.css # Panel styles
├── models/              # .zip model files (gitignored)
└── env.d.ts             # Vite + .zip type declarations
```

## Notes

- Live2D Cubism Core is loaded via CDN in `index.html`
- Model `.zip` files are **not** tracked in git (see `.gitignore`)
- Scale range: 0.1 ~ 3.0, step 0.05
- The `airi/` directory is an unrelated project excluded from Vite watch

---

<h1 id="zh">Live2D 查看器</h1>

基于 PixiJS + pixi-live2d-display 的 Live2D Cubism4 模型浏览器。

## 技术栈

- PixiJS 6 (`pixi.js@^6.5`)
- pixi-live2d-display 0.4 (`cubism4`)
- JSZip 3 — zip 读取 / 手动构造 Cubism4ModelSettings
- Vite 5 + TypeScript 5
- 纯 DOM/CSS 控制面板（无框架）

## 快速开始

```bash
npm install
npm run dev      # Vite 开发服务器 → http://localhost:5173
npm run build    # tsc && vite build
```

将 Live2D `.zip` 模型放入 `src/models/`（当前默认为 `waifu-flat.zip`）。

## 功能

- **模型显示**：从 `.zip` 文件加载 Cubism4 模型
- **自动补全**：即使 `.model3.json` 未引用，也会自动拾取松散 `.motion3.json` / `.exp3.json` 文件
- **视线追踪**：模型眼睛跟随鼠标移动
- **拖拽移动**：按住模型拖动（>5px 阈值）
- **点击身体**：随机播放动作
- **键盘控制**：`1-9` 动作切换，`Q-P` 表情切换，`0` 重置
- **滚轮缩放**：0.1x ~ 3.0x
- **拖放导入**：将 `.zip` 模型文件拖到窗口即可加载
- **控制面板**：位置滑块、缩放滑块、文件导入、按键绑定显示

## 项目结构

```
src/
├── main.ts              # 入口：PixiJS 应用、键盘/滚轮/拖放事件
├── model/
│   ├── loader.ts        # ZipLoader 配置、模型加载、motion/expression 补全
│   └── config.ts        # 缩放常量、fitToScreen
├── interaction/
│   └── pointer.ts       # 自定义指针处理（拖拽/点击/视线追踪）
├── ui/
│   ├── ControlPanel.ts  # 浮动控制面板
│   └── controlPanel.css # 面板样式
├── models/              # .zip 模型文件（gitignore）
└── env.d.ts             # Vite + .zip 类型声明
```

## 注意事项

- Live2D Cubism Core 通过 CDN 加载（`index.html`）
- 模型 `.zip` 文件**不纳入**版本控制（见 `.gitignore`）
- 缩放范围 0.1 ~ 3.0，步进 0.05
- `airi/` 目录是无关项目，已从 Vite watch 排除
