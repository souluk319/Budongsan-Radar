import "server-only";

import { getDataIngestionConfig } from "@/lib/env";

export type NaverNewsItem = {
  title: string;
  description: string;
  link: string;
  originallink?: string;
  pubDate?: string;
};

export type NaverNewsSearchResult = {
  total: number;
  items: NaverNewsItem[];
};

function stripHtml(value: string) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export async function searchNaverNews(
  query = "부동산 정책 대출 청약 전세",
  display = 10,
): Promise<NaverNewsSearchResult> {
  const config = getDataIngestionConfig();

  if (!config.naverClientId || !config.naverClientSecret) {
    throw new Error("네이버 검색 API env가 필요합니다.");
  }

  const url = new URL("https://openapi.naver.com/v1/search/news.json");
  url.searchParams.set("query", query);
  url.searchParams.set("display", String(Math.min(Math.max(display, 1), 30)));
  url.searchParams.set("sort", "date");

  const response = await fetch(url.toString(), {
    headers: {
      "X-Naver-Client-Id": config.naverClientId,
      "X-Naver-Client-Secret": config.naverClientSecret,
    },
    cache: "no-store",
  });
  const text = await response.text();

  if (!response.ok) {
    throw new Error(`네이버 뉴스 검색 실패 ${response.status}: ${text.slice(0, 180)}`);
  }

  const payload = JSON.parse(text) as {
    total?: number;
    items?: Array<{
      title?: string;
      description?: string;
      link?: string;
      originallink?: string;
      pubDate?: string;
    }>;
  };

  return {
    total: payload.total ?? 0,
    items: (payload.items ?? [])
      .flatMap((item) => {
        const link = item.originallink || item.link;

        if (!item.title || !link) {
          return [];
        }

        const normalized: NaverNewsItem = {
          title: stripHtml(item.title),
          description: stripHtml(item.description ?? ""),
          link,
        };

        if (item.originallink) {
          normalized.originallink = item.originallink;
        }

        if (item.pubDate) {
          normalized.pubDate = item.pubDate;
        }

        return [normalized];
      }),
  };
}
