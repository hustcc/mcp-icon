import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { searchIcons } from "../src/utils/api";

describe("searchIcons", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns icon URLs on success", async () => {
    const mockUrls = [
      "https://example.com/icon1.svg",
      "https://example.com/icon2.svg",
    ];
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: true,
        message: "success",
        data: { success: true, data: mockUrls },
      }),
    } as Response);

    const result = await searchIcons("data analysis", 2);
    expect(result.urls).toEqual(mockUrls);
  });

  it("uses correct API URL with encoded keyword", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: true,
        message: "success",
        data: { success: true, data: [] },
      }),
    } as Response);

    await searchIcons("cloud computing", 3);
    const calledUrl = vi.mocked(fetch).mock.calls[0][0] as string;
    expect(calledUrl).toContain("text=cloud%20computing");
    expect(calledUrl).toContain("topK=3");
  });

  it("uses default topK of 3 when not provided", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: true,
        message: "success",
        data: { success: true, data: [] },
      }),
    } as Response);

    await searchIcons("security");
    const calledUrl = vi.mocked(fetch).mock.calls[0][0] as string;
    expect(calledUrl).toContain("topK=3");
  });

  it("throws on non-ok HTTP response", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    } as Response);

    await expect(searchIcons("test")).rejects.toThrow(
      "Icon API request failed: 500 Internal Server Error"
    );
  });

  it("throws when API returns success=false", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: false,
        message: "rate limit exceeded",
        data: { success: false, data: [] },
      }),
    } as Response);

    await expect(searchIcons("test")).rejects.toThrow(
      "Icon API returned an error: rate limit exceeded"
    );
  });
});
