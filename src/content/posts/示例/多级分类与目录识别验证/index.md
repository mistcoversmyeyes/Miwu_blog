---
title: "多级分类与目录识别验证样例"
published: 2026-05-05
description: "用于验证 categories 多级分类与 posts 多层目录识别的示例草稿。"
image: ""
tags: ["Astro", "内容系统", "分类"]
category: ""
categories: ["系统编程", "操作系统", "内存管理"]
draft: true
lang: "zh_CN"
---

## 验证目的

这篇文章用于验证以下两项功能：

1. `categories` 字段支持多级分类路径；
2. `src/content/posts/` 下多层目录文章可被 Astro Content Collections 正常识别。

## 验证点

- 目录路径：`src/content/posts/示例/多级分类与目录识别验证/index.md`
- 分类路径：`["系统编程", "操作系统", "内存管理"]`

该文章保持 `draft: true`，仅用于开发验证，不参与正式发布。
