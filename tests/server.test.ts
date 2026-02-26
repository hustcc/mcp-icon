import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { createServer } from "../src/server";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";

async function connectClient() {
  const server = createServer();
  const client = new Client(
    { name: "test-client", version: "1.0.0" },
    { capabilities: {} }
  );
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await Promise.all([
    client.connect(clientTransport),
    server.connect(serverTransport),
  ]);
  return { server, client };
}

describe("MCP server", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("lists the search_icons tool", async () => {
    const { client } = await connectClient();
    const { tools } = await client.listTools();
    expect(tools).toHaveLength(1);
    expect(tools[0].name).toBe("search_icons");
    expect(tools[0].inputSchema.required).toContain("keyword");
  });

  it("calls search_icons and returns icon URLs", async () => {
    const mockUrls = ["https://example.com/icon1.svg"];
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: true,
        message: "success",
        data: { success: true, data: mockUrls },
      }),
    } as Response);

    const { client } = await connectClient();
    const result = await client.callTool({
      name: "search_icons",
      arguments: { keyword: "finance", topK: 1 },
    });

    expect(result.isError).toBeFalsy();
    expect(result.content).toHaveLength(mockUrls.length);
    expect((result.content[0] as { text: string }).text).toBe(
      "https://example.com/icon1.svg"
    );
  });

  it("returns an error for unknown tools", async () => {
    const { client } = await connectClient();
    await expect(
      client.callTool({ name: "unknown_tool", arguments: {} })
    ).rejects.toThrow();
  });

  it("returns an error when keyword is missing", async () => {
    const { client } = await connectClient();
    await expect(
      client.callTool({ name: "search_icons", arguments: {} })
    ).rejects.toThrow();
  });

  it("clamps topK to valid range", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: true,
        message: "success",
        data: { success: true, data: [] },
      }),
    } as Response);

    const { client } = await connectClient();
    await client.callTool({
      name: "search_icons",
      arguments: { keyword: "tree", topK: 100 },
    });

    const calledUrl = vi.mocked(fetch).mock.calls[0][0] as string;
    expect(calledUrl).toContain("topK=20");
  });
});
