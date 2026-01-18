# MiWu Blog
![Node.js >= 20](https://img.shields.io/badge/node.js-%3E%3D20-brightgreen)
![pnpm >= 9](https://img.shields.io/badge/pnpm-%3E%3D9-blue)

A technical blog built with Astro + Svelte + Tailwind CSS. I write about CS fundamentals, programming languages, and operating systems. Theme: Fuwari https://github.com/saicaca/fuwari

## About Me

I am MiWu, a CS student who cares about fundamentals and practical engineering.

## Posts and Structure

- Posts live in `src/content/posts/`
- Each post has its own folder with content in `index.md`
- Drafts are controlled by frontmatter `draft: true/false`

## Writing and Publishing Workflow

### Branch Rules

- `blog`: writing-only commits (posts, drafts, images, layout tweaks), no tooling/config changes
- `main`: only complete posts or complete features (one post per commit)
- `feat/*`: tool/config changes, squash into `main` when done

### Writing Stage (on `blog`)

1. Create a post and commit in small steps, each commit only touches that post
2. Suggested commit messages:
   - `blog(posts): add post "Title"`
   - `blog(posts): revise "Title"`
3. Keep `draft: true` until publishing

### Sync Feature Updates

- Rebase `blog` onto `main` regularly to keep a linear history
- Avoid merging `main` into `blog`

### Publishing Stage (`blog` -> `main`)

1. Squash all commits for one post into a single publish commit on `blog`
2. Suggested commit format:
   - `blog(posts/publish): Title`
   - Details (multi-line):
     - `- change 1`
     - `- change 2`
     - `- change 3`
3. Check content and frontmatter, ensure `draft: false`
4. `cherry-pick` the publish commit into `main`

### Tooling and Config Changes

1. Create a `feat/*` branch from `main`
2. Squash and merge back into `main`
3. Rebase `blog` onto `main`

## Scripts and Commands

See:

- `scripts/README.md`
- `scripts/README.zh-CN.md`

## License

MIT License.
