import { XMLParser } from "fast-xml-parser";

export type ParsedFeedItem = {
  externalId: string;
  title: string;
  url: string | null;
  summary: string;
  publishedAt: string | null;
  raw: unknown;
};

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text",
  trimValues: true
});

function asArray<T>(value: T | T[] | undefined): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function textValue(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (value && typeof value === "object" && "#text" in value) {
    return textValue((value as { "#text": unknown })["#text"]);
  }
  return "";
}

function linkValue(value: unknown): string | null {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    const alternate = value.find((item) => item && typeof item === "object" && (item as { "@_rel"?: string })["@_rel"] !== "self");
    return linkValue(alternate ?? value[0]);
  }
  if (value && typeof value === "object") {
    const link = value as { "@_href"?: string };
    return link["@_href"] ?? null;
  }
  return null;
}

function parseDate(value: unknown): string | null {
  const raw = textValue(value);
  if (!raw) return null;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function summarize(value: unknown) {
  return textValue(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 420);
}

export function parseFeed(xml: string): ParsedFeedItem[] {
  const parsed = parser.parse(xml);
  const rssItems = asArray(parsed?.rss?.channel?.item);
  const atomItems = asArray(parsed?.feed?.entry);

  return [...rssItems, ...atomItems]
    .map((item) => {
      const title = textValue(item.title);
      const url = linkValue(item.link) ?? textValue(item.guid) ?? null;
      const externalId = textValue(item.guid) || textValue(item.id) || url || title;
      const summary = summarize(item.description ?? item.summary ?? item.content);
      const publishedAt = parseDate(item.pubDate ?? item.published ?? item.updated);

      return {
        externalId,
        title,
        url,
        summary,
        publishedAt,
        raw: item
      };
    })
    .filter((item) => item.externalId && item.title);
}
