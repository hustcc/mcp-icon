const ICON_API_BASE = "https://www.weavefox.cn/api/open/v1/icon";

export interface IconSearchResult {
  urls: string[];
}

/**
 * Search for icons by keyword using the Infographic icon API.
 * @param text - The search keyword (e.g. "data analysis")
 * @param topK - Number of icons to return (1-20, default 5)
 */
export async function searchIcons(
  text: string,
  topK: number = 5
): Promise<IconSearchResult> {
  const url = `${ICON_API_BASE}?text=${encodeURIComponent(text)}&topK=${topK}`;

  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(
      `Icon API request failed: ${response.status} ${response.statusText}`
    );
  }

  const json = (await response.json()) as {
    status: boolean;
    message: string;
    data: { success: boolean; data: string[] };
  };

  if (!json.status || !json.data?.success) {
    throw new Error(`Icon API returned an error: ${json.message}`);
  }

  return { urls: json.data.data };
}
