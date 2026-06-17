import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "집집",
    short_name: "집집",
    description:
      "오늘 부동산 이슈를 내 상황 기준으로 쉽게 집어주는 데일리 브리프",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#eef3f4",
    theme_color: "#eef3f4",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
