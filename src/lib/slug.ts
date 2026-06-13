export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

export function createStableId(title: string, url?: string) {
  const base = slugify(title) || "radar-link";
  const source = `${title}:${url ?? ""}`;
  let hash = 0;

  for (let index = 0; index < source.length; index += 1) {
    hash = (hash * 31 + source.charCodeAt(index)) >>> 0;
  }

  return `${base}-${hash.toString(36)}`.slice(0, 80);
}

export function canonicalizeUrl(input: string) {
  const url = new URL(input);
  url.hash = "";

  if (url.pathname !== "/" && url.pathname.endsWith("/")) {
    url.pathname = url.pathname.slice(0, -1);
  }

  return url.toString();
}

export function sourceNameFromUrl(input: string) {
  try {
    const host = new URL(input).hostname.replace(/^www\./, "");

    return host || "사용자 제출";
  } catch {
    return "사용자 제출";
  }
}
