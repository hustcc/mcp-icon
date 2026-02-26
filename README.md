<div align="center">

# 🎨 mcp-icon

**A Model Context Protocol (MCP) server for semantic SVG icon search.**

Generate infographic SVG icons by keyword — over **100,000 icons** with semantic search support, powered by [AntV Infographic](https://infographic.antv.vision/icon).

[![npm version](https://img.shields.io/npm/v/mcp-icon.svg)](https://www.npmjs.com/package/mcp-icon)
[![Build](https://github.com/hustcc/mcp-icon/actions/workflows/build.yml/badge.svg)](https://github.com/hustcc/mcp-icon/actions/workflows/build.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🤖 Usage](#-usage)
- [🚰 Transport Modes](#-transport-modes)
- [🎮 CLI Options](#-cli-options)
- [🔨 Development](#-development)
- [📄 License](#-license)

---

## ✨ Features

- 🔍 **Semantic search** — Find icons by meaning, not just exact names
- 🖼️ **100,000+ SVG icons** — A massive library of high-quality infographic icons
- ⚡ **Three transport modes** — `stdio`, `sse`, and `streamable-http`
- 🪶 **Minimal dependencies** — Clean, focused implementation
- 🧪 **Fully tested** — Unit tests with Vitest

### Available Tool

| Tool | Description |
|------|-------------|
| `search_icons` | Search for SVG icons by keyword. Returns a list of SVG URLs matching the semantic query. |

**`search_icons` parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `keyword` | string | ✅ | — | Search keyword or phrase (e.g. `"data analysis"`, `"cloud"`) |
| `topK` | number | ❌ | `3` | Number of icons to return (1–20) |

---

## 🤖 Usage

Add to your MCP client configuration (e.g. Claude Desktop, VS Code, Cursor):

**macOS / Linux:**

```json
{
  "mcpServers": {
    "mcp-icon": {
      "command": "npx",
      "args": ["-y", "mcp-icon"]
    }
  }
}
```

**Windows:**

```json
{
  "mcpServers": {
    "mcp-icon": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "mcp-icon"]
    }
  }
}
```

---

## 🚰 Transport Modes

`mcp-icon` supports three standard MCP transport protocols.

### stdio (default)

Used by desktop MCP clients (Claude Desktop, Cursor, etc.):

```bash
npx mcp-icon
# or explicitly:
npx mcp-icon --transport stdio
```

### SSE (Server-Sent Events)

```bash
npx mcp-icon --transport sse --port 3456
# Server available at: http://localhost:3456/sse
```

### Streamable HTTP

```bash
npx mcp-icon --transport streamable --port 3456
# Server available at: http://localhost:3456/mcp
```

---

## 🎮 CLI Options

```
mcp-icon CLI

Options:
  --transport, -t  Transport protocol: "stdio", "sse", or "streamable" (default: "stdio")
  --host, -h       Host for SSE or streamable transport (default: localhost)
  --port, -p       Port for SSE or streamable transport (default: 3456)
  --endpoint, -e   Endpoint path:
                   - For SSE: default is "/sse"
                   - For streamable: default is "/mcp"
  --help, -H       Show this help message
```

---

## 🔨 Development

```bash
# Clone the repository
git clone https://github.com/hustcc/mcp-icon.git
cd mcp-icon

# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Start with MCP inspector (for local debugging)
npm start
```

### Project Structure

```
src/
├── index.ts          # CLI entry point
├── server.ts         # MCP server + tool handlers
├── services/
│   ├── stdio.ts      # Stdio transport
│   ├── sse.ts        # SSE transport
│   └── streamable.ts # Streamable HTTP transport
├── tools/
│   └── search-icons.ts  # Tool definition
└── utils/
    ├── api.ts        # Icon search API client
    └── logger.ts     # Logger utility
tests/
├── api.test.ts       # API client unit tests
└── server.test.ts    # MCP server integration tests
```

---

## 📄 License

MIT © [hustcc](https://github.com/hustcc)

