# 脚本工具说明

本目录包含用于管理 Fuwari 博客项目的脚本工具。

## 当前可用脚本

### `new-post.js` - 创建新文章脚本


#### 名称
`new-post.js` - 一个用于创建新博客文章的脚手架工具，支持灵活的配置选项。


#### 概述

```bash
pnpm new-post <title> [OPTION]
```

#### 描述

该脚本用于在 Fuwari 博客项目中创建新的博客文章文件。它支持两种文章结构模式（文件夹模式和单文件模式），并允许用户通过命令行参数自定义 Frontmatter 字段，如草稿状态、发布日期、分类和标签等。脚本会根据提供的参数生成符合项目标准的 Markdown 文件，并确保 Frontmatter 格式正确。

#### 选项
| 参数                  | 简写 | 说明                                   | 默认值   |
| --------------------- | ---- | -------------------------------------- | -------- |
| `<title>`             | -    | **必需**：文章标题，也作为默认文件夹名 | -        |
| `--folder <string>`   | `-f` | 自定义文件夹名，支持嵌套目录           | 文章标题 |
| `--single-file`       | `-S` | 创建单文件而非文件夹结构               | `false`  |
| `--draft <boolean>`   | `-d` | 草稿状态（true/false）                 | `true`   |
| `--published <date>`  | `-p` | 发布日期（格式：YYYY-MM-DD）           | 当天日期 |
| `--field <key=value>` | `-F` | 自定义 Frontmatter 字段，可多次使用    | -        |
| `--help`              | `-h` | 显示帮助信息                           | -        |

#### 使用示例
```bash
# 基本用法：使用文章标题作为文件夹名
pnpm new-post "文章标题"

# 自定义文件夹名
pnpm new-post "文章标题" --folder "custom-folder-name"

# 创建嵌套目录
pnpm new-post "文章标题" --folder "技术/编程/JavaScript"

# 单文件模式
pnpm new-post "文章标题" --single-file

# 设置草稿状态
pnpm new-post "文章标题" --draft false

# 自定义发布日期
pnpm new-post "文章标题" --published "2023-12-31"

# 设置分类和标签
pnpm new-post "技术文章" --field "category=技术" --field "tags=编程,Astro,JavaScript"
```


#### 生成的 Frontmatter 结构

脚本会生成符合 Fuwari 博客模板标准的 Frontmatter，字段顺序与现有文章保持一致：

```yaml
---
title: "文章标题"
published: 2023-12-12
description: ""
image: ""
tags: []
category: ""
draft: true
lang: ""
# 自定义字段...
---
```




#### 常见问题
- **Q**: 如何创建多级目录？
  - **A**: 使用 `--folder "category/subcategory/article-name"` 参数即可。


---


## 项目集成

所有脚本在 `package.json` 中注册为 npm 脚本，方便执行：

```json
{
  "scripts": {
    "new-post": "node scripts/new-post.js"
  }
}
```

## 未来计划

计划添加更多脚本工具，如：
- 文章批量处理工具
- 图片资源管理脚本
- 站点统计生成工具
- 内容迁移辅助工具

欢迎贡献新的脚本工具！


