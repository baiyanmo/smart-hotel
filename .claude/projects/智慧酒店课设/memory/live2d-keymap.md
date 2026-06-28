---
name: live2d-keymap
description: 水色小熊 Live2D 模型动作/表情按键映射表（24个表情 + 2个动作）
metadata:
  type: project
---

# Live2D 按键映射 — 水色小熊

## 动作 (Motion) — 按键 1-2

| 按键 | 函数 | 动作名 |
|------|------|--------|
| 1 | `idle()` | 待机动画 |
| 2 | `doze()` | 打瞌睡 |

## 表情第1页 (Expression) — 按键 Q-P

| 按键 | 函数 | 表情名 |
|------|------|--------|
| Q | `hair_clip()` | 发夹 |
| W | `hair_ornament()` | 发饰 |
| E | `small()` | 变小 |
| R | `hair_back1()` | 后发1 |
| T | `hair_back2()` | 后发2 |
| Y | `coat()` | 外衣 |
| U | `milk_tea()` | 奶茶 |
| I | `bear()` | 小熊 |
| O | `phone()` | 手机 |
| P | `tear()` | 打米 |

## 表情第2页 (Expression) — 按键 Shift+Q ~ Shift+P

| 按键 | 函数 | 表情名 |
|------|------|--------|
| Shift+Q | `side_bang()` | 斜刘海 |
| Shift+W | `star()` | 星星眼 |
| Shift+E | `cry()` | 流泪 |
| Shift+R | `love()` | 爱心 |
| Shift+T | `angry()` | 生气 |
| Shift+Y | `eyepatch()` | 眼罩 |
| Shift+U | `short_hair()` | 短发 |
| Shift+I | `ear_ornament()` | 耳朵发饰 |
| Shift+O | `blush()` | 脸红 |
| Shift+P | `black_face()` | 脸黑 |

## 表情溢出 — 按键 3-4

| 按键 | 函数 | 表情名 |
|------|------|--------|
| 3 | `mic()` | 麦克风 |
| 4 | `black_hair()` | 黑发 |

## 重置

| 按键 | 功能 |
|------|------|
| 0 | 停止动作 / 重置表情 |

## 代码位置

- 后端: `backend/src/tools/actions.py`（26个原子函数）
- 前端: `web/src/main.ts` `setupKeyboard()`
- 前端: `web/src/ui/ControlPanel.ts` `showMotionExpressionInfo()`
