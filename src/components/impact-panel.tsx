import type { AudienceImpact } from "@/lib/radar-data";

type ImpactPanelProps = {
  impact: AudienceImpact;
};

const impactItems: Array<{
  key: keyof AudienceImpact;
  label: string;
  tone: string;
}> = [
  {
    key: "homelessBuyer",
    label: "무주택자",
    tone: "border-emerald-200 bg-emerald-50",
  },
  {
    key: "oneHomeOwner",
    label: "1주택자",
    tone: "border-sky-200 bg-sky-50",
  },
  {
    key: "renter",
    label: "전세 세입자",
    tone: "border-amber-200 bg-amber-50",
  },
  {
    key: "investor",
    label: "투자자",
    tone: "border-rose-200 bg-rose-50",
  },
];

export function ImpactPanel({ impact }: ImpactPanelProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {impactItems.map((item) => (
        <section
          key={item.key}
          className={`rounded-md border p-4 ${item.tone}`}
        >
          <h3 className="text-sm font-semibold text-zinc-950">{item.label}</h3>
          <p className="mt-2 text-sm leading-6 text-zinc-700">
            {impact[item.key]}
          </p>
        </section>
      ))}
    </div>
  );
}
