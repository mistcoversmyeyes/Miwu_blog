# MiWu Blog
![Node.js >= 20](https://img.shields.io/badge/node.js-%3E%3D20-brightgreen)
![pnpm >= 9](https://img.shields.io/badge/pnpm-%3E%3D9-blue)

一个基于 Astro + Svelte + Tailwind CSS 的技术博客，记录我在计算机科学、编程语言、操作系统等方向的学习与思考。主题使用 Fuwari：https://github.com/saicaca/fuwari

## 关于我

我是 MiWu，一名计算机科学与技术专业的学生，热爱编程与技术研究。

## 文章与结构

- 文章目录：`src/content/posts/`
- 文章组织：每篇文章一个文件夹，内容写在 `index.md`
- 草稿与发布：通过 frontmatter 的 `draft: true/false` 区分。


## 写作与发布流程

### 分支约定

- `blog`：仅写作相关提交（文章、草稿、配图、排版调整），不做工具或配置改动
- `main`：只保留“完整文章”或“完整功能”的提交（每篇文章 1 个提交）
- `feat/*`：工具或配置变更的开发分支，完成后 squash 合入 `main`

### 写作阶段（在 `blog` 分支）

1. 创建文章并多次提交小改动，确保每次提交只涉及单篇文章
2. 提交命名建议：
   - `blog(posts/[draft | publish]): 添加文章「标题」`
   - `blog(posts/[draft | publish]): 修订「标题」`
3. 草稿阶段保持 `draft: true`，不做发布动作

### 功能更新同步

- 当 `main` 有新功能时，`blog` 定期 `rebase main`，保持线性历史
- 避免在 `blog` 上做 `merge main`，减少分叉与噪音

### 发布阶段（在 `blog` 分支 → `main` 分支）

1. 在 `blog` 上把同一篇文章的提交 squash 成 1 个发布提交
2. 提交信息建议：
   - `blog(posts/publish): 发布文章「标题」`
   - 根据被 squash 的提交，撰写文章修改历史的描述（多行）：
     - `- 修改1`
     - `- 修改2`
     - `- 修改3`
3. 检查文章内容与 frontmatter，确保 `draft: false`
4. 将发布提交 `cherry-pick` 到 `main`

### 工具与配置改动

1. 从 `main` 切出 `feat/*` 分支开发
2. 完成后 squash 合入 `main`
3. `blog` 再 `rebase main` 获取最新功能

## 脚本与命令

脚本与命令用法请参阅：

- `scripts/README.md`
- `scripts/README.zh-CN.md`

## 许可证

本项目使用 MIT License。
