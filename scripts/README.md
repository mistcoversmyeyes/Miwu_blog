# Script Tools Documentation

This directory contains script tools for managing the Fuwari blog project.

## Currently Available Scripts

### `new-post.js` - Create New Post Script

#### NAME
`new-post.js` - A scaffolding tool for creating new blog posts with flexible configuration options.

#### SYNOPSIS
```bash
pnpm new-post <title> [OPTION]
```

#### DESCRIPTION
This script is used to create new blog post files in the Fuwari blog project. It supports two article structure modes (folder mode and single-file mode) and allows users to customize Frontmatter fields through command-line parameters, such as draft status, publication date, category, and tags. The script generates Markdown files that comply with project standards based on the provided parameters and ensures correct Frontmatter formatting.

#### OPTIONS
| Parameter               | Short | Description                                   | Default   |
| ----------------------- | ----- | --------------------------------------------- | --------- |
| `<title>`               | -     | **Required**: Article title, also used as default folder name | - |
| `--folder <string>`     | `-f`  | Custom folder name, supports nested directories | Article title |
| `--single-file`         | `-S`  | Create single file instead of folder structure | `false` |
| `--draft <boolean>`     | `-d`  | Draft status (true/false)                     | `true` |
| `--published <date>`    | `-p`  | Publication date (format: YYYY-MM-DD)         | Today's date |
| `--field <key=value>`   | `-F`  | Custom Frontmatter field, can be used multiple times | - |
| `--help`                | `-h`  | Show help information                         | - |

#### EXAMPLES
```bash
# Basic usage: use article title as folder name
pnpm new-post "Article Title"

# Custom folder name
pnpm new-post "Article Title" --folder "custom-folder-name"

# Create nested directories
pnpm new-post "Article Title" --folder "technology/programming/JavaScript"

# Single file mode
pnpm new-post "Article Title" --single-file

# Set draft status
pnpm new-post "Article Title" --draft false

# Custom publication date
pnpm new-post "Article Title" --published "2023-12-31"

# Set category and tags
pnpm new-post "Technical Article" --field "category=Technology" --field "tags=Programming,Astro,JavaScript"
```

#### GENERATED FRONTMATTER STRUCTURE

The script generates Frontmatter that complies with Fuwari blog template standards, maintaining field order consistent with existing articles:

```yaml
---
title: "Article Title"
published: 2023-12-12
description: ""
image: ""
tags: []
category: ""
draft: true
lang: ""
# Custom fields...
---
```

#### FAQ
- **Q**: How to create multi-level directories?
  - **A**: Use the `--folder "category/subcategory/article-name"` parameter.

---

## PROJECT INTEGRATION

All scripts are registered as npm scripts in `package.json` for easy execution:

```json
{
  "scripts": {
    "new-post": "node scripts/new-post.js"
  }
}
```

## FUTURE PLANS

Plans to add more script tools, such as:
- Article batch processing tools
- Image resource management scripts
- Site statistics generation tools
- Content migration assistant tools

Welcome contributions for new script tools!