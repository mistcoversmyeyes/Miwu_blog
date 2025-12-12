# 🍥Fuwari  
![Node.js >= 20](https://img.shields.io/badge/node.js-%3E%3D20-brightgreen) 
![pnpm >= 9](https://img.shields.io/badge/pnpm-%3E%3D9-blue) 
[![DeepWiki](https://img.shields.io/badge/DeepWiki-saicaca%2Ffuwari-blue.svg?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAyCAYAAAAnWDnqAAAAAXNSR0IArs4c6QAAA05JREFUaEPtmUtyEzEQhtWTQyQLHNak2AB7ZnyXZMEjXMGeK/AIi+QuHrMnbChYY7MIh8g01fJoopFb0uhhEqqcbWTp06/uv1saEDv4O3n3dV60RfP947Mm9/SQc0ICFQgzfc4CYZoTPAswgSJCCUJUnAAoRHOAUOcATwbmVLWdGoH//PB8mnKqScAhsD0kYP3j/Yt5LPQe2KvcXmGvRHcDnpxfL2zOYJ1mFwrryWTz0advv1Ut4CJgf5uhDuDj5eUcAUoahrdY/56ebRWeraTjMt/00Sh3UDtjgHtQNHwcRGOC98BJEAEymycmYcWwOprTgcB6VZ5JK5TAJ+fXGLBm3FDAmn6oPPjR4rKCAoJCal2eAiQp2x0vxTPB3ALO2CRkwmDy5WohzBDwSEFKRwPbknEggCPB/imwrycgxX2NzoMCHhPkDwqYMr9tRcP5qNrMZHkVnOjRMWwLCcr8ohBVb1OMjxLwGCvjTikrsBOiA6fNyCrm8V1rP93iVPpwaE+gO0SsWmPiXB+jikdf6SizrT5qKasx5j8ABbHpFTx+vFXp9EnYQmLx02h1QTTrl6eDqxLnGjporxl3NL3agEvXdT0WmEost648sQOYAeJS9Q7bfUVoMGnjo4AZdUMQku50McDcMWcBPvr0SzbTAFDfvJqwLzgxwATnCgnp4wDl6Aa+Ax283gghmj+vj7feE2KBBRMW3FzOpLOADl0Isb5587h/U4gGvkt5v60Z1VLG8BhYjbzRwyQZemwAd6cCR5/XFWLYZRIMpX39AR0tjaGGiGzLVyhse5C9RKC6ai42ppWPKiBagOvaYk8lO7DajerabOZP46Lby5wKjw1HCRx7p9sVMOWGzb/vA1hwiWc6jm3MvQDTogQkiqIhJV0nBQBTU+3okKCFDy9WwferkHjtxib7t3xIUQtHxnIwtx4mpg26/HfwVNVDb4oI9RHmx5WGelRVlrtiw43zboCLaxv46AZeB3IlTkwouebTr1y2NjSpHz68WNFjHvupy3q8TFn3Hos2IAk4Ju5dCo8B3wP7VPr/FGaKiG+T+v+TQqIrOqMTL1VdWV1DdmcbO8KXBz6esmYWYKPwDL5b5FA1a0hwapHiom0r/cKaoqr+27/XcrS5UwSMbQAAAABJRU5ErkJggg==)](https://deepwiki.com/saicaca/fuwari)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fsaicaca%2Ffuwari.svg?type=shield&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2Fsaicaca%2Ffuwari?ref=badge_shield&issueType=license)

一个使用 [Astro](https://astro.build) 构建的静态博客模板。

[**🖥️ 在线演示 (Vercel)**](https://fuwari.vercel.app)

![Preview Image](https://raw.githubusercontent.com/saicaca/resource/main/fuwari/home.png)

🌏 多语言 README：
[**中文**](https://github.com/saicaca/fuwari/blob/main/docs/README.zh-CN.md) /
[**日本語**](https://github.com/saicaca/fuwari/blob/main/docs/README.ja.md) /
[**한국어**](https://github.com/saicaca/fuwari/blob/main/docs/README.ko.md) /
[**Español**](https://github.com/saicaca/fuwari/blob/main/docs/README.es.md) /
[**ไทย**](https://github.com/saicaca/fuwari/blob/main/docs/README.th.md) /
[**Tiếng Việt**](https://github.com/saicaca/fuwari/blob/main/docs/README.vi.md) /
[**Bahasa Indonesia**](https://github.com/saicaca/fuwari/blob/main/docs/README.id.md) （社区提供，可能不是最新）

## ✨ 特性

- [x] 基于 [Astro](https://astro.build) 与 [Tailwind CSS](https://tailwindcss.com)
- [x] 流畅的动画与页面切换
- [x] 明 / 暗色模式
- [x] 可自定义主题色与横幅
- [x] 响应式设计
- [x] 集成 [Pagefind](https://pagefind.app/) 的搜索功能
- [x] [增强 Markdown 语法](https://github.com/saicaca/fuwari?tab=readme-ov-file#-markdown-extended-syntax)
- [x] 目录生成
- [x] RSS 订阅

## 🚀 快速开始

1. 创建你的博客仓库：
    - 从模板 [生成新仓库](https://github.com/saicaca/fuwari/generate) 或 fork 本仓库。
    - 或执行以下任一命令：
       ```sh
       npm create fuwari@latest
       yarn create fuwari
       pnpm create fuwari@latest
       bun create fuwari@latest
       deno run -A npm:create-fuwari@latest
       ```
2. 本地编辑：克隆仓库后执行 `pnpm install` 安装依赖。
    - 如未安装 [pnpm](https://pnpm.io)，可先运行 `npm install -g pnpm`。
3. 编辑配置文件 `src/config.ts` 来定制你的博客。
4. 运行 `pnpm new-post <slug>` 创建新文章，并在 `src/content/posts/` 中编辑。
5. 按 [部署指南](https://docs.astro.build/en/guides/deploy/) 部署到 Vercel、Netlify、GitHub Pages 等。部署前记得在 `astro.config.mjs` 中填写站点配置。

## 📝 文章 Frontmatter 示例

```yaml
---
title: 我的第一篇博客
published: 2023-09-09
description: 这是我新的 Astro 博客的第一篇文章。
image: ./cover.jpg
tags: [Foo, Bar]
category: 前端
draft: false
lang: jp      # 仅当文章语言与 `config.ts` 中站点语言不同时设置
---
```

## 🧩 扩展的 Markdown 语法

除了 Astro 默认支持的 [GitHub Flavored Markdown](https://github.github.com/gfm/)，还包含：

- 提示块（Admonitions）示例：[预览与用法](https://fuwari.vercel.app/posts/markdown-extended/#admonitions)
- GitHub 仓库卡片：[预览与用法](https://fuwari.vercel.app/posts/markdown-extended/#github-repository-cards)
- Expressive Code 增强代码块：[预览](https://fuwari.vercel.app/posts/expressive-code/) / [文档](https://expressive-code.com/)

## ⚡ 常用命令

以下命令均在项目根目录终端执行：

| Command                    | Action                                    |
|:---------------------------|:------------------------------------------|
| `pnpm install`             | 安装依赖                                   |
| `pnpm dev`                 | 启动本地开发服务器（默认 `localhost:4321`）|
| `pnpm build`               | 构建生产站点到 `./dist/`                   |
| `pnpm preview`             | 本地预览生产构建                           |
| `pnpm check`               | 运行代码检查                               |
| `pnpm format`              | 使用 Biome 格式化代码                      |
| `pnpm new-post <slug>` | 以文件夹形式创建新文章                     |
| `pnpm astro ...`           | 运行 Astro CLI（如 `astro add`、`astro check`） |
| `pnpm astro --help`        | 查看 Astro CLI 帮助                        |

## ✏️ 贡献

请参阅 [贡献指南](https://github.com/saicaca/fuwari/blob/main/CONTRIBUTING.md) 了解如何参与项目。

## 📄 许可证

本项目使用 MIT License。

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fsaicaca%2Ffuwari.svg?type=large&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2Fsaicaca%2Ffuwari?ref=badge_large&issueType=license)
