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

以下命令均在项目根目录终端执行：

| Command                    | Action                                    |
|:---------------------------|:------------------------------------------|
| `pnpm install`             | 安装依赖                                   |
| `pnpm dev`                 | 启动本地开发服务器（默认 `localhost:4321`）|
| `pnpm build`               | 构建生产站点到 `./dist/`                   |
| `pnpm preview`             | 本地预览生产构建                           |
| `pnpm check`               | 运行代码检查                               |
| `pnpm format`              | 使用 Biome 格式化代码                      |
| `pnpm new-post <title>` | 创建新文章（支持单文件或文件夹模式）           |
| `pnpm astro ...`           | 运行 Astro CLI（如 `astro add`、`astro check`） |
| `pnpm astro --help`        | 查看 Astro CLI 帮助                        |

**`new-post` 命令选项：**
- `<title>`：文章标题（必需，也作为默认的文件夹名）
- `-f, --folder <string>`：自定义文件夹名（支持嵌套目录，如 `category/subcategory`）
- `-S, --single-file`：创建单文件（`folder.md`）而非文件夹
- `-d, --draft <true|false>`：草稿状态（默认：true）
- `-p, --published <date>`：发布日期（默认：今天）
- `-F, --field <key=value>`：自定义 frontmatter 字段（可多次使用）
- `-h, --help`：显示帮助信息

示例：
```bash
pnpm new-post "我的文章"
pnpm new-post "中文标题" --folder "english-slug"
pnpm new-post "嵌套文章" --folder "技术/编程/JavaScript"
pnpm new-post "文章" --single-file --draft false
pnpm new-post "技术文章" --field "category=技术" --field "tags=编程,Astro"
```


## 许可证

本项目使用 MIT License。
