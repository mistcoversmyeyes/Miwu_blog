博客撰写指南
=====================

## 项目架构概览

**Fuwari** 是一个现代化的Astro静态博客模板，具有以下特点：

- **框架栈**：Astro + Svelte组件 + Tailwind CSS + TypeScript
- **内容管理**：Astro Content Collections + 自定义Markdown扩展
- **国际化**：完整的多语言支持（i18n）
- **搜索功能**：Pagefind索引
- **主题系统**：HSL动态颜色系统 + 深浅模式切换
- **页面转换**：SWUP.js平滑导航

## 快速开始

### 创建新文章

```bash
pnpm new-post "文章标题"
```

这会在 `src/content/posts/` 创建一个文件夹，包含标准的 `index.md` 文件和正确的前置元数据(frontmatter)。

### 运行开发服务器

```bash
pnpm dev      # 启动开发服务器（热重载）
pnpm build    # 构建 + 生成搜索索引
pnpm preview  # 预览生产版本
```

## 文章前置元数据

每篇文章的 Markdown 文件必须包含以下前置元数据：

```yaml
---
title: "文章标题"
published: 2024-12-12
description: '文章简介（可选）'
image: /path/to/image.jpg  # 文章封面（可选）
tags: [标签1, 标签2]       # 标签列表（可选）
category: 分类名            # 所属分类（可选）
updated: 2024-12-13        # 更新日期（可选）
draft: false                # 草稿模式（可选，默认false）
lang: zh_CN                 # 覆盖站点语言（可选）
---

# 文章内容开始...
```

## Markdown 扩展语法

### 提示框（Admonitions）

支持5种提示框类型：

```markdown
:::note{title="自定义标题"}
这是一个普通提示
:::

:::tip
这是一个提示
:::

:::important
这是重要信息
:::

:::warning
这是警告信息
:::

:::caution
这是注意信息
:::
```

### GitHub 项目卡片

自动获取 GitHub 仓库信息：

```markdown
::github{repo="owner/repo-name"}
```

### 增强代码块

支持语言标识、行号、可折叠代码段等功能：

````markdown
```typescript
// 代码内容
const hello = "world";
```
````

## 内容结构

```
src/content/
├── posts/           # 博客文章（按日期/分类组织）
│   ├── article-1.md
│   └── folder/
│       └── index.md
├── spec/            # 特殊页面（关于、说明等）
│   ├── about-zh.md
│   └── about.md
└── config.ts        # Content Collections 数据库模型定义
```

## 配置说明

### 站点配置

编辑 `src/config.ts` 进行核心配置：

- **siteConfig**：站点基本信息、主题颜色、TOC设置
- **navBarConfig**：导航栏链接配置
- **profileConfig**：作者信息和社交媒体链接
- **主题色**：HSL色调值（0-360）

### 主题系统

颜色使用 HSL 格式在 `src/styles/variables.styl` 中定义：

```stylus
--hue-primary: 220  // 改变此值可旋转整个主题色调
```

支持通过 `LightDarkSwitch` 组件自动检测系统偏好并切换深浅模式。

## 国际化（i18n）

### 添加新语言

1. 在 `src/i18n/languages/` 创建新的语言文件（如 `fr.ts`）
2. 在 `src/i18n/i18nKey.ts` 中定义新的翻译键
3. 更新所有语言文件

### 使用翻译

在 Astro/Svelte 组件中：

```typescript
import { i18n, I18nKey } from "@/i18n/translation";

const text = i18n(I18nKey.someKey);  // 自动检测站点语言
```

## 重要工具函数

### URL 生成

```typescript
import { url, getCategoryUrl, getTagUrl } from "@/utils/url-utils";

url("/path")           // 处理基础路径
getCategoryUrl(category)  // 分类页面 URL
getTagUrl(tag)        // 标签页面 URL
```

### 日期处理

```typescript
import { formatDateToYYYYMMDD } from "@/utils/date-utils";

formatDateToYYYYMMDD(date)  // 格式化为 YYYY-MM-DD
```

### 文章处理

```typescript
import { getSortedPosts } from "@/utils/content-utils";

const posts = await getSortedPosts();  // 获取已排序的文章 + 前后导航
```

## 开发建议

### 路径别名

使用配置在 `tsconfig.json` 中的路径别名：

- `@/` → `src/`
- `@components/` → `src/components/`

### 图片资源

- **处理的图片**：放在 `src/assets/images/`（会经过Astro优化）
- **静态资源**：放在 `public/`（直接复制）

### 图标使用

使用 Iconify 图标库，格式为 `"fa6-brands:github"`：

```astro
<Icon name="fa6-brands:github" />
```

## 搜索功能

- 搜索索引由 `pagefind` 在构建时生成
- 本地开发需要运行 `pnpm build` 才能使用搜索
- 搜索 UI 在 `src/components/Search.svelte` 中

## 代码质量检查

```bash
pnpm check    # Astro + TypeScript 类型检查
pnpm lint     # Biome linting（自动修复）
pnpm format   # Biome 格式化
```

## 常见问题

| 问题 | 解决方案 |
|------|--------|
| 本地搜索不工作 | 需要先运行 `pnpm build` 生成搜索索引 |
| 导入错误 | 检查 `tsconfig.json` 中的路径别名配置 |
| 文章不显示 | 检查前置元数据是否符合 `src/content/config.ts` 的模式 |
| 图片无法显示 | 确认相对路径从 `src/` 开始，不是 `public/` |
| 新语言缺少翻译 | 检查 `i18nKey.ts` 和所有语言文件是否同步 |

---

**提示**：使用 VS Code + Frontmatter CMS 扩展可以获得更好的内容创作体验。
