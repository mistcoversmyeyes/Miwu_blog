# Fuwari Blog AI Development Guide

## Project Overview
This is **Fuwari**, an Astro-based static blog template with:
- **Core Stack**: Astro + Svelte components + Tailwind CSS + TypeScript
- **Key Features**: Multi-language i18n, custom Markdown extensions, theme system with dynamic colors, search via Pagefind
- **Architecture**: Content-driven with Astro Content Collections, custom rehype/remark plugins, and SWUP page transitions

## Essential Architecture Patterns

### Configuration System
All site configuration lives in `src/config.ts` with typed interfaces from `src/types/config.ts`:
- `siteConfig`: Core site settings, theme colors, banner, TOC settings
- `navBarConfig`: Navigation using `LinkPreset` enum or custom links  
- `profileConfig`: Author profile with social links using Iconify icons
- Theme colors use HSL hue values (0-360) with CSS custom properties

### Content Structure
```
src/content/
├── posts/           # Blog posts with frontmatter schema
├── spec/           # Special pages (about, etc.)
└── config.ts       # Astro Content Collections schema
```

**Post Frontmatter Pattern**:
```yaml
---
title: string
published: date (YYYY-MM-DD)
updated?: date  
draft?: boolean (false in production)
description?: string
image?: string
tags?: string[]
category?: string
lang?: string (overrides site lang)
---
```

### Custom Markdown Extensions
The project extends Markdown via custom rehype/remark plugins in `src/plugins/`:

**Admonitions**: `:::note`, `:::tip`, `:::important`, `:::warning`, `:::caution`
```markdown
:::note{title="Custom Title"}
Content here
:::
```

**GitHub Cards**: `::github{repo="owner/repo"}` - Auto-fetches repository data

**Enhanced Code Blocks**: Via astro-expressive-code with:
- Custom language badges (`src/plugins/expressive-code/language-badge.ts`)
- Custom copy buttons (`src/plugins/expressive-code/custom-copy-button.js`)
- Collapsible sections and line numbers

### Internationalization System
- Language files in `src/i18n/languages/` (en.ts, zh_CN.ts, etc.)
- Keys defined in `src/i18n/i18nKey.ts` enum
- Usage: `i18n(I18nKey.someKey)` function auto-detects site language
- RTL support via `getDir()` utility for Arabic/Hebrew languages
- URL generation respects language: `getCategoryUrl()`, `getTagUrl()`

### Component Architecture
**Astro Components**: Layout, static components (`.astro` files)
**Svelte Components**: Interactive elements (`.svelte` files)
- `LightDarkSwitch.svelte`: Theme toggle with system preference detection
- `Search.svelte`: Pagefind search integration
- `DisplaySettings.svelte`: User customization panel

**Key Conventions**:
- Use `@/` and `@components/` path aliases (defined in `tsconfig.json`)
- Astro components handle server-side rendering and layout
- Svelte for client-side interactivity and state management

### Styling System
- **Tailwind CSS** with custom configuration in `tailwind.config.cjs`
- **CSS Custom Properties** for theme system in `src/styles/variables.styl`
- **Dynamic theming**: HSL hue rotation based on `siteConfig.themeColor.hue`
- **Typography**: `@tailwindcss/typography` for prose content
- **Page transitions**: SWUP.js handles smooth navigation (configured in `astro.config.mjs`)

## Development Workflows

### Content Management
```bash
pnpm new-post "post-name"     # Creates new post with proper frontmatter
pnpm dev                      # Development server with hot reload
pnpm build                    # Build + search index generation
pnpm preview                  # Preview production build
```

### Code Quality
```bash
pnpm check                    # Astro + TypeScript checks
pnpm format                   # Biome formatting
pnpm lint                     # Biome linting with auto-fix
```

### Build Process
1. `astro build` generates static site to `dist/`
2. `pagefind --site dist` creates search index
3. Both steps combined in `pnpm build`

## Critical Integration Points

### Search Integration
- **Pagefind** generates search index post-build
- Search UI in `src/components/Search.svelte`
- Requires build before search works locally
- Configuration in `pagefind.yml`

### Content Processing Pipeline
1. **Remark plugins**: Transform Markdown AST (directives → components)
2. **Rehype plugins**: Transform HTML AST (add components, autolink headings)
3. **Astro Content Collections**: Validate frontmatter, generate types
4. **Reading time**: Auto-calculated via `remarkReadingTime` plugin

### Asset Handling
- **Images**: Use `src/assets/images/` for processed assets or `/public/` for static
- **Icons**: Iconify via `astro-icon` - use format `"fa6-brands:github"`
- **Fonts**: Fontsource imports in Layout.astro

### Deployment Considerations
- Set `site` and `base` in `astro.config.mjs` before deployment
- Static site works on Vercel, Netlify, GitHub Pages
- Search requires build-time index generation

## Project-Specific Patterns

### URL Generation
Always use utility functions from `src/utils/url-utils.ts`:
- `url("/path")`: Handles base path configuration
- `getCategoryUrl(category)`, `getTagUrl(tag)`: Consistent URL patterns
- `pathsEqual()`: Compare paths accounting for trailing slashes

### Date Handling
Use `src/utils/date-utils.ts` for consistent formatting:
- `formatDateToYYYYMMDD()`: Standard date display format
- Respects locale from `siteConfig.lang`

### Content Utilities
`src/utils/content-utils.ts` handles post processing:
- `getSortedPosts()`: Gets posts, sorts by date, adds prev/next navigation
- Filters drafts in production builds
- Auto-generates post navigation links

### Theme System
- HSL-based color system allows hue rotation while maintaining contrast
- CSS custom properties update dynamically
- Light/dark mode toggles CSS custom properties, not classes
- User preferences persist in localStorage via Svelte components

## Common Gotchas
- **Search**: Requires `pnpm build` to generate index, won't work in dev mode
- **Imports**: Use path aliases (`@/`, `@components/`) defined in `tsconfig.json`
- **Content**: Frontmatter must match schema in `src/content/config.ts`
- **Images**: Relative paths in frontmatter resolve from `src/`, not `public/`
- **i18n**: New languages require both translation file and TypeScript updates