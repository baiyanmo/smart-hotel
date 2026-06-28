# 智慧酒店课设 - 项目长期记忆

## 项目概述
三端智慧酒店系统：Flutter Android 端 + Web 端(JS+Live2D) + 微信小程序端，FastAPI 后端，SQLite 数据库，部署在云服务器。

## 三端结构
- **后端**: FastAPI + SQLAlchemy + SQLite (数据库文件独立于项目)
- **Android 端**: Flutter + Provider (待搭建)
- **Web 端**: 纯 JS + PixiJS + Live2D Cubism 4（科幻主题风格）
- **微信小程序端**: 微信原生框架（科幻风格全局样式）

## 核心功能模块
1. 用户认证: bcrypt + JWT (从 equipment_manager 复用)
2. 房间管理: CRUD 完整实现
3. 订单系统: 预订/状态管理
4. AI 对话: 豆包大模型 + Function Calling (天气查询)
5. 语音识别: 火山引擎 ASR 代理
6. Live2D 互动: AI 输出 [emotion:xxx][action:xxx] 标签控制数字人

## 复用来源
- `参考/equipment_manager`: auth.py / database 模式 / schemas.common / routes.dependencies / Flutter services
- `参考/easy_bill`: 小程序 request.js / app.js 会话管理模式 / SQLite 参考
- `参考/2dlive`: Live2D loader / pointer / config 转写为 JS

## 技术栈
| 组件 | 技术 |
|---|---|
| 后端框架 | FastAPI + Uvicorn |
| ORM | SQLAlchemy 2.0 |
| 数据库 | SQLite (WAL 模式) |
| 认证 | bcrypt + python-jose JWT |
| AI | 豆包大模型 API |
| 语音 | 火山引擎 ASR |
| 天气 | wttr.in 免费 API / 和风天气 (可选) |
| Web 渲染 | PixiJS 6 + pixi-live2d-display |
| Live2D | Cubism 4 Core (CDN) |
| 移动端 | Flutter + Provider |
| 小程序 | 微信原生框架 |

## 部署
- 云服务器: Linux
- 后端: uvicorn + systemd
- Web 端: Nginx 静态文件 + 反向代理
- 数据库: `/data/hotel.db` (独立目录)
- 不用 Docker

## 当前进度
- [x] 阶段 A: FastAPI 后端 (完成)
- [x] 阶段 B: Web 端 + Live2D (完成 → 2dlive 方案，8000 端口)
- [x] 阶段 D: 微信小程序端 (完成)
- [x] 豆包 API Key (已配置)
- [ ] 火山引擎 ASR 凭证 (未配置)
- [ ] 阶段 C: Flutter Android 端 (Flutter 3.41.5 已安装)
- [ ] 阶段 E: 部署到云服务器

## 已知问题
- `水色小狗.zip` 文件名含中文，构建复制时可能因编码问题导致 JSZip 无法解析 → 默认使用 `waifu-flat.zip`
- Web 端构建 base 路径必须为 `/web/`，`loader.ts` 中模型路径使用 `import.meta.env.BASE_URL` 动态拼接

## 下一步
1. 配置火山引擎 ASR 凭证 (VOLCANO_ASR_APP_ID + VOLCANO_ASR_TOKEN)
2. 搭建 Flutter Android 端
3. 部署到云服务器
