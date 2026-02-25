import type { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express, { type Request, type Response } from "express";
import { logger } from "../utils/logger";

export async function startSSEServer(
  createServer: () => Server,
  endpoint: string = "/sse",
  port: number = 3456,
  host: string = "localhost"
): Promise<void> {
  const app = express();
  app.use(express.json());

  const connections: Record<string, SSEServerTransport> = {};

  app.get(endpoint, async (_req: Request, res: Response) => {
    const server = createServer();
    const transport = new SSEServerTransport("/messages", res);
    connections[transport.sessionId] = transport;

    transport.onclose = () => {
      delete connections[transport.sessionId];
      logger.info(`SSE connection closed: sessionId=${transport.sessionId}`);
    };

    await server.connect(transport);
    logger.info(`SSE connection opened: sessionId=${transport.sessionId}`);
  });

  app.post("/messages", async (req: Request, res: Response) => {
    const sessionId = req.query.sessionId as string;
    if (!sessionId) {
      res.status(400).send("Missing sessionId parameter");
      return;
    }

    const transport = connections[sessionId];
    if (!transport) {
      res.status(404).send("Session not found");
      return;
    }

    try {
      await transport.handlePostMessage(req, res, req.body);
    } catch (e) {
      logger.error("SSE error handling message", e);
      if (!res.headersSent) res.status(500).send("Error handling request");
    }
  });

  app.listen(port, host, () => {
    logger.success(`SSE server listening on http://${host}:${port}${endpoint}`);
  });
}
