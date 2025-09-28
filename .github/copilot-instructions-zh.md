# Fuwari 博客 AI 开发指南

## 项目概述
这是 **Fuwari**，一个基于 Astro 的静态博客模板，具有以下特性：
- **核心技术栈**：Astro + Svelte 组件 + Tailwind CSS + TypeScript
- **主要功能**：多语言国际化、自定义 Markdown 扩展、动态主题系统、Pagefind 搜索
- **架构特点**：内容驱动，使用 Astro Content Collections、自定义 rehype/remark 插件和 SWUP 页面转换

## 核心架构模式

### 配置系统
所有站点配置位于 `src/config.ts`，使用 `src/types/config.ts` 中的类型接口：
- `siteConfig`：核心站点设置、主题颜色、横幅、目录设置
- `navBarConfig`：使用 `LinkPreset` 枚举或自定义链接的导航配置
- `profileConfig`：使用 Iconify 图标的作者档案和社交链接
- 主题颜色使用 HSL 色调值（0-360）配合 CSS 自定义属性

### 内容结构
```
src/content/
├── posts/           # 博客文章，包含前言模式
├── spec/           # 特殊页面（关于页等）
└── config.ts       # Astro Content Collections 模式定义
```

**文章前言模式**：
```yaml
---
title: string
published: date (YYYY-MM-DD)
updated?: date  
draft?: boolean (生产环境为 false)
description?: string
image?: string
tags?: string[]
category?: string
lang?: string (覆盖站点语言)
---
```

### 自定义 Markdown 扩展
项目通过 `src/plugins/` 中的自定义 rehype/remark 插件扩展 Markdown：

**告诫框**：`:::note`、`:::tip`、`:::important`、`:::warning`、`:::caution`
```markdown
:::note{title="自定义标题"}
内容在这里
:::
```

**GitHub 卡片**：`::github{repo="owner/repo"}` - 自动获取仓库数据

**增强代码块**：通过 astro-expressive-code 实现：
- 自定义语言徽章（`src/plugins/expressive-code/language-badge.ts`）
- 自定义复制按钮（`src/plugins/expressive-code/custom-copy-button.js`）
- 可折叠部分和行号

### 国际化系统
- 语言文件位于 `src/i18n/languages/`（en.ts、zh_CN.ts 等）
- 键定义在 `src/i18n/i18nKey.ts` 枚举中
- 使用方式：`i18n(I18nKey.someKey)` 函数自动检测站点语言
- 通过 `getDir()` 工具支持阿拉伯语/希伯来语 RTL
- URL 生成考虑语言：`getCategoryUrl()`、`getTagUrl()`

### 组件架构
**Astro 组件**：布局、静态组件（`.astro` 文件）
**Svelte 组件**：交互元素（`.svelte` 文件）
- `LightDarkSwitch.svelte`：带系统偏好检测的主题切换
- `Search.svelte`：Pagefind 搜索集成
- `DisplaySettings.svelte`：用户自定义面板

**关键约定**：
- 使用 `@/` 和 `@components/` 路径别名（在 `tsconfig.json` 中定义）
- Astro 组件处理服务端渲染和布局
- Svelte 用于客户端交互和状态管理

### 样式系统
- **Tailwind CSS** 配置在 `tailwind.config.cjs`
- **CSS 自定义属性** 主题系统在 `src/styles/variables.styl`
- **动态主题**：基于 `siteConfig.themeColor.hue` 的 HSL 色调旋转
- **排版**：`@tailwindcss/typography` 用于内容样式
- **页面转换**：SWUP.js 处理平滑导航（在 `astro.config.mjs` 中配置）

## 开发工作流

### 内容管理
```bash
pnpm new-post "文章名称"      # 创建带有正确前言的新文章
pnpm dev                      # 带热重载的开发服务器
pnpm build                    # 构建 + 搜索索引生成
pnpm preview                  # 预览生产构建
```

### 代码质量
```bash
pnpm check                    # Astro + TypeScript 检查
pnpm format                   # Biome 格式化
pnpm lint                     # Biome 代码检查和自动修复
```

### 构建流程
1. `astro build` 生成静态站点到 `dist/`
2. `pagefind --site dist` 创建搜索索引
3. `pnpm build` 组合以上两个步骤

## 关键集成点

### 搜索集成
- **Pagefind** 在构建后生成搜索索引
- 搜索 UI 在 `src/components/Search.svelte`
- 本地需要先构建才能使用搜索功能
- 配置在 `pagefind.yml`

### 内容处理管道
1. **Remark 插件**：转换 Markdown AST（指令 → 组件）
2. **Rehype 插件**：转换 HTML AST（添加组件、自动链接标题）
3. **Astro Content Collections**：验证前言、生成类型
4. **阅读时间**：通过 `remarkReadingTime` 插件自动计算

### 资源处理
- **图片**：使用 `src/assets/images/` 处理资源或 `/public/` 静态资源
- **图标**：通过 `astro-icon` 使用 Iconify - 格式如 `"fa6-brands:github"`
- **字体**：在 Layout.astro 中导入 Fontsource

### 部署注意事项
- 部署前在 `astro.config.mjs` 中设置 `site` 和 `base`
- 静态站点适用于 Vercel、Netlify、GitHub Pages
- 搜索需要构建时生成索引

## 项目特定模式

### URL 生成
始终使用 `src/utils/url-utils.ts` 中的工具函数：
- `url("/path")`：处理基础路径配置
- `getCategoryUrl(category)`、`getTagUrl(tag)`：一致的 URL 模式
- `pathsEqual()`：考虑尾部斜杠的路径比较

### 日期处理
使用 `src/utils/date-utils.ts` 进行一致的格式化：
- `formatDateToYYYYMMDD()`：标准日期显示格式
- 遵循 `siteConfig.lang` 的语言环境

### 内容工具
`src/utils/content-utils.ts` 处理文章处理：
- `getSortedPosts()`：获取文章、按日期排序、添加前后导航
- 在生产构建中过滤草稿
- 自动生成文章导航链接

### 主题系统
- 基于 HSL 的颜色系统允许色调旋转同时保持对比度
- CSS 自定义属性动态更新
- 明暗模式切换 CSS 自定义属性，而非类名
- 用户偏好通过 Svelte 组件持久化到 localStorage

## 常见陷阱
- **搜索**：需要 `pnpm build` 生成索引，开发模式下不工作
- **导入**：使用 `tsconfig.json` 中定义的路径别名（`@/`、`@components/`）
- **内容**：前言必须匹配 `src/content/config.ts` 中的模式
- **图片**：前言中的相对路径从 `src/` 解析，而非 `public/`
- **国际化**：新语言需要翻译文件和 TypeScript 更新