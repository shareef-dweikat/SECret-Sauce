# SECret-Sauce

**SEC filings research and analysis tool.**

> Hi there! Bun and Elysia were new to me, and choosing this stack felt like a good opportunity to explore tools I hadn't worked with before.

## Stack

- **Backend:** Bun, Elysia, TypeScript
- **Frontend:** Vite, React, TypeScript

## Prerequisites

[Bun](https://bun.sh) >= 1.0

### Install Bun

**macOS / Linux (recommended):**

```bash
curl -fsSL https://bun.sh/install | bash
```

Then restart your terminal, or reload your shell config:

```bash
source ~/.zshrc   # or ~/.bashrc
```

**macOS (Homebrew):**

```bash
brew install oven-sh/bun/bun
```

Verify the install:

```bash
bun --version
```

If you see `command not found: bun`, add Bun to your PATH (the installer usually does this in `~/.zshrc`):

```bash
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"
```

## Setup

```bash
bun install
cp .env.example .env
```

## Development

Runs the Elysia API on `:3000` and the Vite dev server on `:5173`. The frontend proxies `/api` requests to the backend.

```bash
bun dev
```

- Frontend: http://localhost:5173
- API health: http://localhost:3000/api/health

## Production

Build the frontend and bundle the backend, then start a single server that serves both the API and static assets.

```bash
bun run build
bun start
```

- App + API: http://localhost:3000
- API health: http://localhost:3000/api/health

## Scripts

| Script | Description |
|--------|-------------|
| `bun dev` | Start backend (watch) + frontend dev server |
| `bun run build` | Build frontend and bundle backend |
| `bun start` | Run production server |
| `bun run typecheck` | Type-check both packages |
