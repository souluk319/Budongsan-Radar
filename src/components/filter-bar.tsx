import Link from "next/link";
import {
  categories,
  regions,
  type Category,
  type Region,
} from "@/lib/radar-data";

type FilterBarProps = {
  selectedCategory?: Category;
  selectedRegion?: Region;
};

function buildHref(category?: Category, region?: Region) {
  const params = new URLSearchParams();

  if (category) {
    params.set("category", category);
  }

  if (region) {
    params.set("region", region);
  }

  const query = params.toString();

  return query ? `/?${query}` : "/";
}

export function FilterBar({
  selectedCategory,
  selectedRegion,
}: FilterBarProps) {
  return (
    <section className="border-y border-zinc-200 bg-zinc-50">
      <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-zinc-950">필터</h2>
          <Link
            href="/"
            className="h-8 rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:border-zinc-900"
          >
            초기화
          </Link>
        </div>

        <div className="grid gap-3">
          <div className="flex gap-2 overflow-x-auto pb-1">
            <Link
              href={buildHref(undefined, selectedRegion)}
              className={`filter-chip ${!selectedCategory ? "filter-chip-active" : ""}`}
            >
              전체 카테고리
            </Link>
            {categories.map((category) => (
              <Link
                key={category}
                href={buildHref(category, selectedRegion)}
                className={`filter-chip ${selectedCategory === category ? "filter-chip-active" : ""}`}
              >
                {category}
              </Link>
            ))}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            <Link
              href={buildHref(selectedCategory, undefined)}
              className={`filter-chip ${!selectedRegion ? "filter-chip-active" : ""}`}
            >
              전체 지역
            </Link>
            {regions.map((region) => (
              <Link
                key={region}
                href={buildHref(selectedCategory, region)}
                className={`filter-chip ${selectedRegion === region ? "filter-chip-active" : ""}`}
              >
                {region}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
