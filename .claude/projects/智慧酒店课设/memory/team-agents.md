---
name: team-agents
description: feature-dev 插件配置的三个团队 Agent：code-explorer、code-architect、code-reviewer
metadata:
  type: project
---

# 团队 Agent

本项目安装了 **feature-dev** 插件（`C:\Users\86183\.claude\plugins\marketplaces\claude-plugins-official\plugins\feature-dev\`），提供三个专业 Agent 和一个 7 阶段工作流命令。

## 三个 Agent

| Agent | 模型 | 角色 |
|--------|------|------|
| `code-explorer` | Sonnet | 深度分析代码库——追踪执行路径、映射架构层次、理解模式和抽象、记录依赖 |
| `code-architect` | Sonnet | 设计功能架构——分析现有模式、输出实现蓝图（文件清单、组件设计、数据流、构建序列） |
| `code-reviewer` | Sonnet | 代码审查——查 bug、逻辑错误、安全漏洞、代码质量、项目规范合规（仅报告置信度 ≥80 的问题） |

## `/feature-dev` 工作流

```
Phase 1: 需求发现 → Phase 2: 代码探索 → Phase 3: 澄清问题
→ Phase 4: 架构设计 → Phase 5: 实现 → Phase 6: 代码审查 → Phase 7: 总结
```

### 使用方式

- 完整工作流：`/feature-dev 添加用户OAuth认证`
- 单独调用 Agent：直接说「启动 code-explorer 分析认证流程」即可

### 适用场景

- 涉及多文件的新功能
- 需要架构决策的功能
- 与现有代码的复杂集成
- 需求不太明确的功能

### 不适合

- 单行 bug 修复
- 简单变更
- 紧急热修复
