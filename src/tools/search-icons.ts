import type { Tool } from "@modelcontextprotocol/sdk/types.js";

export const searchIconsTool: Tool = {
  name: "search_icons",
  description:
    "Search for SVG icons by keyword using semantic search. Returns URLs of matching SVG icons from a library of over 100,000 infographic icons.",
  inputSchema: {
    type: "object",
    properties: {
      keyword: {
        type: "string",
        description:
          'The search keyword or phrase to find relevant icons (e.g. "data analysis", "cloud computing", "security").',
      },
      topK: {
        type: "number",
        description:
          "The number of icons to return. Must be between 1 and 20. Defaults to 5.",
        default: 5,
        minimum: 1,
        maximum: 20,
      },
    },
    required: ["keyword"],
  },
};
