---
name: blog-post-assistant
description: 在此 Astro 项目中以交互方式创建 Miwu Blog 文章，包括头脑风暴标题/slug、基于现有文章推荐标签/分类，并运行 new-post 脚本生成 frontmatter。
---

# 博客文章助手

## 概述

帮助用户创建新的 Miwu Blog 文章：一起梳理流程、基于现有文章给出标签/分类建议，并通过 new-post 脚本生成文章骨架。

## 工作流

### 1) 收集输入

**步骤 1.1：询问文章基本信息**
- 使用 AskUserQuestion 收集以下信息：
  - **文章标题**（必需，文本输入）
  - **文章状态**（单选）
    - 选项 1: "草稿" → `draft: true`（保存但不发布）
    - 选项 2: "已发布" → `draft: false`（立即发布）

**步骤 1.2：询问可选信息**
- 使用 AskUserQuestion 询问是否添加可选信息（多选）：
  - 选项 1: "文章摘要" → 收集 description（50-150字）
  - 选项 2: "封面图片" → 收集 image 路径
  - 选项 3: "跳过" → 不添加这些字段
- 根据用户选择继续收集相应信息

**步骤 1.3：生成文件夹名**
- 自动从文章标题生成 `<derived-title-folder>`
  - 分隔符统一为单个 `-`
  - 将 `:`, `：`, `-`, `—`, `–`（含 `--`）及其两侧空格替换为 `-`
  - 多个 `-` 合并为一个，并去掉首尾 `-`

!!! Note
    - 文件夹名由标题自动生成，**不要询问用户**文件夹名称
### 2) 建议标签与分类

**步骤 2.1：分析现有标签/分类**
- 运行统计脚本，列出现有标签与分类：

```bash
python .agents/skills/blog-post-assistant/scripts/suggest_taxonomy.py --posts-dir src/content/posts
```

**步骤 2.2：给出初步建议**
- 基于以下信息给出 1 个分类和 3-5 个标签：
  - 新文章的标题与主题
  - 现有文章的标签/分类
  - 项目规范的分类体系

#### 步骤 2.3：用户确认与迭代
- 使用 AskUserQuestion 询问用户是否接受建议：
  - 选项 1: "接受建议" → 继续创建文章
  - 选项 2: "修改建议" → 收集用户新的分类/标签并重新建议
  - 选项 3: "跳过标签" → 不设置 category 和 tags
- **重复此步骤直到用户明确选择"接受建议"或"跳过标签"**

### 3) 创建文章骨架

- 使用项目的 `pnpm new-post` 脚本生成文章骨架：
  ```bash
  pnpm new-post "<title>" --folder "<category>/<derived-title-folder>" --draft false --field "category=<category>" --field "tags=<tag1,tag2,...>" --field "description=<description>"
  ```
  
- 若分类为空或未设置，则不加分类前缀，使用 `--folder "<folder>"`。
- 用户不想设置的字段就省略；`tags` 用逗号分隔。

!!! Note `new-post` 脚本的详细文档位于 `docs/scripts/README.md`。一旦有任何不清晰的地方，“必须”参考该文档。

### 4) 最终检查

- 打开生成的 `index.md`，确认 frontmatter：
  - 字段顺序符合项目规范：
  ```yaml
  ---
  title: "文章标题"           # 必需，字符串，用引号包裹
  published: 2025-01-06       # 必需，日期格式 YYYY-MM-DD
  description: "文章描述"     # 可选，字符串，用于 SEO 和列表展示
  image: ""                   # 可选，封面图片路径
  tags: [标签1, 标签2]        # 可选，数组，多个标签
  category: "分类名"          # 可选，字符串，主分类
  draft: true                # 必需，布尔值，true=草稿，false=已发布
  lang: ""                    # 可选，语言代码，如 zh_CN, en, ja
  ---
  ```
  - 字符串均为双引号 `"`
  - 文章处于草稿状态 `draft: true`

## 备注

- 当文章有分类时，文章目录必须为 `src/content/posts/<category>/<derived-title-folder>/index.md`。


## 资源

### scripts/
- `suggest_taxonomy.py` — 汇总现有分类/标签与近期标题。
