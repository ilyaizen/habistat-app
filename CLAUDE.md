# CLAUDE.md Guidelines for Habistat

## 🚀 Commands

```bash
# Development
pnpm run dev                # Run Next.js dev server with Turbopack
pnpm run tauri dev          # Run Tauri development build
pnpm run build              # Build production Next.js app
pnpm run tauri build        # Build Tauri production app

# Code Quality
pnpm run lint               # Run ESLint
pnpm run format             # Format all files with Prettier
```

## 🎨 Code Style

- **Formatting**: 2 spaces, 120 char line length, semicolons, double quotes
- **TypeScript**: Strict typing, no unused locals/parameters
- **Naming**: React components in PascalCase, variables/functions in camelCase, files in kebab-case
- **Imports**: Group and sort by: @core > @server > @ui > relative paths
- **Components**: Prefer functional components with hooks
- **Error Handling**: Use try/catch for async operations, provide meaningful error messages
- **Comments**: Focus on explaining "why" not "what", document complex logic or non-obvious behavior

## 🛠️ Project Structure

- `/src-next/app` - Next.js pages and routes
- `/src-next/components` - React components
- `/src-next/i18n` - Internationalization
- `/src-next/lib` - Shared utilities
- `/src-next/hooks` - Custom React hooks
- `/src-tauri` - Tauri native app code

Always use `bun` for this project.
