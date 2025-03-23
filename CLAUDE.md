# CLAUDE.md Guidelines for Habistat

## 🚀 Commands

```bash
# Development
bun run dev                # Run Next.js dev server with Turbopack
bun run tauri dev          # Run Tauri development build
bun run build              # Build production Next.js app
bun run tauri build        # Build Tauri production app

# Code Quality
bun run lint               # Run ESLint
bun run format             # Format all files with Prettier
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

Use `bun` exclusively for this project.
