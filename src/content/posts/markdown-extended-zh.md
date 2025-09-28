---
title: Markdown 扩展功能
published: 2024-05-01
updated: 2024-11-29
description: '了解更多 Fuwari 中的 Markdown 功能特性'
image: ''
tags: [示例, 演示, Markdown, Fuwari]
category: '示例'
draft: false 
---

## GitHub 仓库卡片
你可以添加链接到 GitHub 仓库的动态卡片，在页面加载时，仓库信息会从 GitHub API 获取。

::github{repo="Fabrizz/MMM-OnSpotify"}

使用代码 `::github{repo="<owner>/<repo>"}` 创建 GitHub 仓库卡片。

```markdown
::github{repo="saicaca/fuwari"}
```

## 告诫框

支持以下类型的告诫框：`note` `tip` `important` `warning` `caution`

:::note
突出显示用户应该考虑的信息，即使在浏览时也是如此。
:::

:::tip
帮助用户更成功的可选信息。
:::

:::important
用户成功必需的关键信息。
:::

:::warning
由于潜在风险需要立即引起用户注意的关键内容。
:::

:::caution
某个操作的负面潜在后果。
:::

### 基本语法

```markdown
:::note
突出显示用户应该考虑的信息，即使在浏览时也是如此。
:::

:::tip
帮助用户更成功的可选信息。
:::
```

### 自定义标题

告诫框的标题可以自定义。

:::note[我的自定义标题]
这是一个带有自定义标题的提示框。
:::

```markdown
:::note[我的自定义标题]
这是一个带有自定义标题的提示框。
:::
```

### GitHub 语法

> [!TIP]
> 也支持 [GitHub 语法](https://github.com/orgs/community/discussions/16925)。

```
> [!NOTE]
> 也支持 GitHub 语法。

> [!TIP]
> 也支持 GitHub 语法。
```

### 剧透

你可以为文本添加剧透效果。文本也支持 **Markdown** 语法。

内容 :spoiler[被隐藏了 **哎呀**]！

```markdown
内容 :spoiler[被隐藏了 **哎呀**]！
```