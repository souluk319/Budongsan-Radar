import type { AudienceImpact } from "@/lib/radar-data";

type ImpactPanelProps = {
  impact: AudienceImpact;
};

const impactItems: Array<{
  key: keyof AudienceImpact;
  label: string;
}> = [
  {
    key: "homelessBuyer",
    label: "무주택자",
  },
  {
    key: "oneHomeOwner",
    label: "1주택자",
  },
  {
    key: "renter",
    label: "전세 세입자",
  },
  {
    key: "investor",
    label: "투자자",
  },
];

export function ImpactPanel({ impact }: ImpactPanelProps) {
  return (
    <div className="divide-y divide-[#e3d8c8] border-y border-[#d8cdbc]">
      {impactItems.map((item) => (
        <section
          key={item.key}
          className="grid gap-1 py-3 sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:gap-4"
        >
          <h3 className="text-sm font-black text-[#14110f]">{item.label}</h3>
          <p className="text-sm font-semibold leading-6 text-[#51483d]">
            {impact[item.key]}
          </p>
        </section>
      ))}
    </div>
  );
}
