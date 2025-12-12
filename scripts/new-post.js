/* Create a new post scaffold with folder/index.md structure */

import fs from "fs"
import path from "path"

function getDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, "0")
  const day = String(today.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

const args = process.argv.slice(2)

if (args.length === 0) {
  console.error(`Error: No filename argument provided
Usage: npm run new-post -- <slug>`)
  process.exit(1)
}

const rawSlug = args[0]
const slug = rawSlug.replace(/\.(md|mdx)$/i, "") // always use folder/index.md

const targetDir = path.join("./src/content/posts", slug)
const fullPath = path.join(targetDir, "index.md")

if (fs.existsSync(fullPath)) {
  console.error(`Error: File ${fullPath} already exists `)
  process.exit(1)
}

// Ensure nested folders exist for slug paths
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true })
}

const content = `---
title: "${slug}"
published: ${getDate()}
description: ''
image: ''
tags: []
category: ''
draft: false
lang: ''
---
`

fs.writeFileSync(fullPath, content)

console.log(`Post ${fullPath} created`)
