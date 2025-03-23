# Habistat

A modern desktop application for tracking daily app usage and building better habits. Built with Tauri, Next.js, and TypeScript.

## Features

- 📊 Visual uptime tracking with a 90-day view
- 🌙 Dark mode support
- 🌐 Internationalization ready
- 💾 Offline-first with IndexedDB storage
- 🔄 Future cloud sync support

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Rust](https://www.rust-lang.org/tools/install)
- [Bun](https://bun.sh/) package manager

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/habistat-app.git
cd habistat-app
```

2. Install dependencies:

```bash
bun install
```

3. Start the development server:

```bash
bun run tauri dev
```

## Development

- `src-next/`: Next.js frontend code
- `src-tauri/`: Rust backend code
- `src-next/components/`: React components
- `src-next/lib/`: Utility functions and database setup

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
