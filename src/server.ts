import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { searchIconsTool } from "./tools/search-icons";
import { searchIcons } from "./utils/api";
import { logger } from "./utils/logger";
import {
  startSSEServer,
  startStdioServer,
  startStreamableServer,
} from "./services/index";

export { startSSEServer, startStdioServer, startStreamableServer };

export function createServer(): Server {
  const server = new Server(
    { name: "mcp-icon", version: "1.0.0" },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [searchIconsTool],
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args = {} } = request.params;

    if (name !== "search_icons") {
      throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }

    const { keyword, topK = 5 } = args as { keyword?: string; topK?: number };

    if (!keyword || typeof keyword !== "string") {
      throw new McpError(
        ErrorCode.InvalidParams,
        "The 'keyword' parameter is required and must be a string."
      );
    }

    const clampedTopK = Math.min(20, Math.max(1, Math.round(topK)));

    logger.info(`Searching icons: keyword="${keyword}", topK=${clampedTopK}`);

    try {
      const { urls } = await searchIcons(keyword, clampedTopK);

      return {
        content: [
          {
            type: "text",
            text: urls.join("\n"),
          },
        ],
        _meta: {
          description:
            "SVG icon URLs matching the search keyword. Each URL points to an SVG file that can be embedded using an <img> tag or rendered inline.",
          urls,
          keyword,
          topK: clampedTopK,
        },
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      logger.error(`Failed to search icons: ${message}`);
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to search icons: ${message}`
      );
    }
  });

  server.onerror = (err: Error) => {
    logger.error("Server error", err);
  };

  process.on("SIGINT", async () => {
    await server.close();
    process.exit(0);
  });

  return server;
}

export async function runStdioServer(): Promise<void> {
  const server = createServer();
  await startStdioServer(server);
}

export async function runSSEServer(
  host = "localhost",
  port = 3456,
  endpoint = "/sse"
): Promise<void> {
  await startSSEServer(createServer, endpoint, port, host);
}

export async function runStreamableServer(
  host = "localhost",
  port = 3456,
  endpoint = "/mcp"
): Promise<void> {
  await startStreamableServer(createServer, endpoint, port, host);
}
