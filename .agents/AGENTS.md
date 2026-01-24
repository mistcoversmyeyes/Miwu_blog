# MiWu 博客项目指南

本文档为 AI 助手提供上下文信息，用于协助创建和管理博客文章。

## 作者信息（已去除敏感信息）

### 1. 核心身份与定位

- **基本信息**：国内某985高校软件工程专业本科在读（预计 2027 年毕业）。
- **GitHub ID**：[mistcoversmyeyes](https://www.google.com/search?q=https://github.com/mistcoversmyeyes)
- **自我定位**：一名处于成长期、兴趣驱动的学生开发者。我不是行业专家，也不自诩对计算机的某个方面又强烈的热爱或者强烈的讨厌，我只是一个感兴趣就学的、喜欢探究"为什么"而非"怎么做"的热爱软件工程专业，同时具有较为扎实的数理基础的大三学生。我的博客内容应当反映这种**探索、踩坑、总结、再优化**的学习过程，而非高高在上的教学。
- **兴趣领域**：
    - **主要兴趣**：TCS（理论计算机科学）
    - **次要兴趣**：人工智能（仅限于入门级了解）、系统编程（操作系统内核、数据库内核）、高性能计算、后端开发
    - **不感兴趣领域**：前端开发、移动开发
### 2. 技术栈与能力边界（真实水平）

- **主力语言**：**C++** 和 **Rust**。目前能熟练使用这两门语言进行算法解题和系统级功能的开发，但仍在持续精进其高级特性（如 C++ 的模板元编程、Rust 的生命周期深层机制）。

#### 后端开发方向（入门级）

#### System 方向（当前探索）

- **操作系统**：正在学习 OS 原理。作为 contributor 参与了 **DragonOS**（一个 Rust 编写的 Unikernel/Linux 兼容内核）的开发。
  - 具体贡献：实现了 `pwritev` 系统调用；修复了 gvisor 兼容性测试中关于 `PartialWrite` 导致的 SIGSEGV/SIGBUS 内存错误；负责移植和调试 `lmbench` 性能测试基准工具。

- **数据库**：正在跟随 **CMU 15-445** 课程系统学习数据库内核实现（Buffer Pool, B+ Tree 等），目前处于理论与 Lab 实践结合的阶段。

- **高性能计算**：正在跟随 **CS149** 课程系统学习并行程序设计，目前初步接触了指令集优化（AVX-512）和并行计算架构（ISPC），仅限于了解概念和简单尝试，尚未在生产环境中大规模应用。

#### Theory 方向（较为感兴趣）

- 不定时在 LeetCode 刷题。
- 不满足于表面现象，而是尝试理解算法的本质和底层原理（如时间复杂度分析、空间复杂度权衡、数学归纳法证明等）。

#### AI 方向（入门级）

- 具备机器学习基础理论知识（从线性回归到神经网络）。

### 3. 开发环境与工具美学

- **环境偏好**：坚定的 CLI（命令行）拥趸，主力开发环境为 **Windows + WSL2**。
- **编辑器**：**VsCode** 深度用户。
- **其他兴趣**：对高质量音视频播放技术（如本地高码率播放、P2P 串流软件 Miru/KikoPlay）。

### 4. 近期经历与职业规划

- **求职方向**：C++ 客户端开发（Client Development）。近期经历过大厂（如腾讯 WXG）的面试流程，对计算机网络、C++ 对象模型、操作系统基础面试题有实战复习经验。
- **学术意向**：对科研保持开放态度，曾关注加拿大 Mitacs Globalink 等科研实习项目，有志于探索更前沿的技术领域。

### 5. 博客内容偏好与风格指南

#### 文章类型

- **硬核笔记**：记录 OS 内核开发中的具体 Bug 调试过程（如 GDB 调试记录）。
- **理论推导**：对算法题目进行形式化证明或归纳。
- **工具折腾**：Neovim 配置心得、WSL2 调优指南。
- **面试复盘**：从学生角度分享技术面试中的盲点与收获。

#### 语气风格

- **严谨客观**：技术细节不含糊，不懂的地方承认不懂。
- **逻辑清晰**：偏好结构化的表达（背景-问题-尝试-解决-原理）。
- **人文感性**：偶尔可以穿插对个人喜好（如动画《四月是你的谎言》）的隐喻或感悟，让技术文章不那么冰冷。


## 项目概述

**项目名称**: MiWu Blog
**技术栈**: Astro 5.x + Svelte + Tailwind CSS
**博客主题**: Fuwari（基于 Astro 的个人博客主题）
**作者**: MiWu (来自中国大陆的某985 CS 本科生)

**项目定位**: 技术博客，主要分享计算机科学、编程语言、操作系统等技术相关的学习和思考。

## 文章结构

### 文件组织方式

本项目使用**文件夹模式**组织文章，每篇文章都是一个独立的文件夹：

```
src/content/posts/
├── 文章标题一/
│   └── index.md
├── 文章标题二/
│   └── index.md
│   └── image.png  # 可选：文章相关图片
└── ...
```

**关键点**:
- 每篇文章必须有自己的文件夹
- 文章内容必须放在 `index.md` 中
- 文件夹名即为文章的 URL 路径（slug）
- 支持中文文件夹名（项目会自动处理）

### Frontmatter 字段规范

所有文章必须包含以下 frontmatter 字段（按顺序）：

```yaml
---
title: "文章标题"           # 必需，字符串，用引号包裹
published: 2025-01-06       # 必需，日期格式 YYYY-MM-DD
description: "文章描述"     # 可选，字符串，用于 SEO 和列表展示
image: ""                   # 可选，封面图片路径
tags: [标签1, 标签2]        # 可选，数组，多个标签
category: "分类名"          # 可选，字符串，主分类
draft: false                # 必需，布尔值，true=草稿，false=已发布
lang: ""                    # 可选，语言代码，如 zh_CN, en, ja
---
```

**字段说明**:
1. **title**: 文章标题，建议使用简洁明确的标题
2. **published**: 发布日期，格式必须为 `YYYY-MM-DD`
3. **description**: 文章摘要，建议 50-150 字，用于文章列表和 SEO
4. **image**: 封面图片，相对路径（如 `assets/images/cover.png`）或空字符串
5. **tags**: 标签数组，建议 3-5 个标签，用于关联相关文章
6. **category**: 主分类，建议配合标签使用，建立清晰的知识体系
7. **draft**: 草稿标记，`true` 时不显示在公开页面
8. **lang**: 语言代码，仅当文章语言与站点默认语言不同时需要设置

**注意事项**:
- 所有字符串值都应使用**双引号**包裹
- tags 必须是数组格式：`[标签1, 标签2]`
- draft 在发布前必须设为 `false`
- 字段顺序应与上述示例保持一致

## 创建新文章

### 使用 new-post 脚本（推荐）

项目提供了便捷的脚本工具来创建新文章：

```bash
# 基本用法：使用文章标题作为文件夹名
pnpm new-post "文章标题"

# 自定义文件夹名（适合中文标题使用英文 URL）
pnpm new-post "中文标题" --folder "english-slug"

# 创建嵌套目录
pnpm new-post "文章标题" --folder "技术/编程/JavaScript"

# 创建单文件模式（不推荐，项目使用文件夹模式）
pnpm new-post "文章标题" --single-file

# 设置草稿状态和发布日期
pnpm new-post "文章标题" --draft false --published "2025-01-06"

# 设置分类和标签
pnpm new-post "技术文章" --field "category=技术" --field "tags=编程,Astro,JavaScript"
```

**脚本功能**:
- 自动创建文章文件夹（支持嵌套目录）
- 生成符合规范的 frontmatter 模板
- 自动设置默认值（draft: true, published: 今天）
- 支持自定义字段（`--field` 参数）

### 手动创建文章

如果需要手动创建文章：

1. 在 `src/content/posts/` 下创建新文件夹
2. 在文件夹中创建 `index.md` 文件
3. 添加 frontmatter 和文章内容
4. 确保 draft 字段为 `false` 才会显示

## 开发工作流

### 本地开发

```bash
# 安装依赖（首次使用）
pnpm install

# 启动开发服务器
pnpm dev

# 访问 http://localhost:4321
```

### 查看草稿文章

- 在开发模式下，draft: true 的文章会显示在列表中
- 生产构建时，草稿文章会被自动排除

### 构建和预览

```bash
# 构建生产版本
pnpm build

# 本地预览生产版本
pnpm preview
```

### 代码检查和格式化

```bash
# 运行类型检查
pnpm check

# 格式化代码
pnpm format

# 代码检查
pnpm lint
```

## 关键配置文件

### 站点配置: `src/config.ts`

**主要内容**:
- `siteConfig`: 站点标题、副标题、语言、主题色等
- `navBarConfig`: 导航栏链接
- `profileConfig`: 个人资料（头像、简介、社交链接）
- `licenseConfig`: 文章版权协议

**修改建议**:
- 创建文章前通常不需要修改配置
- 如需新增社交链接，在 `profileConfig.links` 中添加

### Frontmatter 配置: `frontmatter.json`

VS Code 的 Frontmatter 插件配置文件，定义了文章的字段类型和默认值。

### 脚本文档

- `scripts/README.md`: 英文版脚本工具文档
- `scripts/README.zh-CN.md`: 中文版脚本工具文档

## 文章写作指南

### Markdown 语法支持

项目支持标准 Markdown + Astro 扩展：

```markdown
# 一级标题（通常不使用，文章标题已在 frontmatter 中）

## 二级标题

### 三级标题

**粗体强调**
*斜体*

`行内代码`

\`\`\`javascript
// 代码块
const x = 1;
\`\`\`

- 列表项 1
- 列表项 2

> 引用块

[链接文字](https://example.com)

![图片描述](image.png)
```

### 数学公式支持

项目支持 KaTeX 数学公式：

行内公式：`$E = mc^2$`

块级公式：
```markdown
$$
\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
$$
```

### 代码高亮

项目使用 Expressive Code 进行代码高亮，支持：
- 语法高亮
- 行号（自动显示）
- 可折叠代码块
- 复制按钮

## 发布流程

### 检查清单

发布文章前确认：
- [ ] frontmatter 字段完整且格式正确
- [ ] draft 字段设为 `false`
- [ ] 文章在本地预览正常（`pnpm dev`）
- [ ] 代码块语法高亮正常
- [ ] 图片链接正确（如有）
- [ ] 文章在移动端显示正常

### Git 提交

示例：
```bash
git add src/content/posts/your-post/
git commit -m "blog(draft): 添加文章 “文章标题” "
```

### 部署

项目已配置 Github Actions，推送到 blog 分支后自动部署到给定的 URL 下作为 Github Pages。

## 常见问题

### Q: 文章创建后不显示？

**A**: 检查以下几点：
1. draft 字段是否为 `false`
2. 是否在开发模式下运行（`pnpm dev`）
3. 文件路径是否正确（必须在 `src/content/posts/` 下）
4. 文件名是否为 `index.md`

### Q: 如何添加图片？

**A**: 有两种方式：
1. 放在文章文件夹内：`src/content/posts/your-post/image.png`，引用时 `./image.png`
2. 放在公共资源目录：`public/assets/images/xxx.png`，引用时 `/assets/images/xxx.png`

### Q: 如何修改文章的 URL？

**A**: 文章 URL 由文件夹名决定，重命名文件夹即可：
```bash
mv "src/content/posts/旧标题/" "src/content/posts/新标题/"
```

### Q: 标签和分类的区别？

**A**:
- **category**: 主分类，每篇文章一个，用于建立知识体系（如"技术思考"、"教程"）
- **tags**: 标签，每篇文章多个，用于描述具体技术点（如"C++", "内存管理"）

建议两者结合使用，保持分类体系的清晰性。

## 项目相关命令速查

```bash
# 开发
pnpm dev              # 启动开发服务器
pnpm build            # 构建生产版本
pnpm preview          # 预览生产版本

# 文章
pnpm new-post "标题"  # 创建新文章

# 代码质量
pnpm check            # 类型检查
pnpm format           # 格式化代码
pnpm lint             # 代码检查

# Astro CLI
pnpm astro ...        # 运行 Astro 命令
```

