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
    <section className="grid gap-4 rounded-md border border-[#cbd3d5] bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-[#596366]">관심 기준</p>
            <h2 className="mt-1 text-xl font-black text-[#14110f]">
              흐름 좁혀보기
            </h2>
          </div>
          <Link
            href="/"
            className="h-8 rounded-full border border-[#cbd3d5] bg-[#f8fbfb] px-3 py-1.5 text-xs font-bold text-[#4d575a] hover:border-[#11140f] hover:text-[#11140f]"
          >
            전체 보기
          </Link>
        </div>

        <div className="grid gap-3">
          <div className="filter-scroll flex gap-2 overflow-x-auto pb-1">
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

          <div className="filter-scroll flex gap-2 overflow-x-auto pb-1">
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
    </section>
  );
}
