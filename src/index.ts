#!/usr/bin/env node
import { parseArgs } from "node:util";
import { logger } from "./utils/logger";
import { runSSEServer, runStdioServer, runStreamableServer } from "./server";

const { values } = parseArgs({
  options: {
    transport: { type: "string", short: "t", default: "stdio" },
    host: { type: "string", short: "h", default: "localhost" },
    port: { type: "string", short: "p", default: "3456" },
    endpoint: { type: "string", short: "e", default: "" },
    help: { type: "boolean", short: "H" },
  },
});

if (values.help) {
  console.log(`
mcp-icon CLI

Options:
  --transport, -t  Transport protocol: "stdio", "sse", or "streamable" (default: "stdio")
  --host, -h       Host for SSE or streamable transport (default: localhost)
  --port, -p       Port for SSE or streamable transport (default: 3456)
  --endpoint, -e   Endpoint path:
                   - For SSE: default is "/sse"
                   - For streamable: default is "/mcp"
  --help, -H       Show this help message
`);
  process.exit(0);
}

const transport = (values.transport as string).toLowerCase();
const port = Number.parseInt(values.port as string, 10);
const host = values.host as string;

if (transport === "sse") {
  logger.setIsStdio(false);
  const endpoint = (values.endpoint as string) || "/sse";
  runSSEServer(host, port, endpoint).catch(console.error);
} else if (transport === "streamable") {
  logger.setIsStdio(false);
  const endpoint = (values.endpoint as string) || "/mcp";
  runStreamableServer(host, port, endpoint).catch(console.error);
} else {
  logger.setIsStdio(true);
  runStdioServer().catch(console.error);
}
