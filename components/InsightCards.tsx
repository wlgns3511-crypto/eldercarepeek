import { formatCost, formatHourly } from "@/lib/format";

interface InsightCardsProps {
  cityName: string;
  nursing_home_private: number;
  assisted_living: number;
  home_health_aide_hourly: number;
  adult_day_care: number;
  nationalAvgs: {
    nursing_home_private: number;
    assisted_living: number;
    home_health_aide_hourly: number;
    adult_day_care: number;
  };
  costPercentile: number;
}

export function InsightCards({
  cityName,
  nursing_home_private,
  assisted_living,
  home_health_aide_hourly,
  adult_day_care,
  nationalAvgs,
  costPercentile,
}: InsightCardsProps) {
  // Card 1: Affordability Tier
  const tierColor =
    costPercentile >= 60
      ? { border: "border-emerald-200", bg: "bg-emerald-50", text: "text-emerald-700" }
      : costPercentile >= 30
        ? { border: "border-amber-200", bg: "bg-amber-50", text: "text-amber-700" }
        : { border: "border-red-200", bg: "bg-red-50", text: "text-red-700" };
  const tierLabel =
    costPercentile >= 60 ? "Affordable" : costPercentile >= 30 ? "Moderate" : "Expensive";

  // Card 2: Cheapest Option
  const hhaMonthly = home_health_aide_hourly * 8 * 22;
  const careOptions = [
    { name: "Adult Day Care", cost: adult_day_care },
    { name: "Assisted Living", cost: assisted_living },
    { name: "Home Health Aide", cost: hhaMonthly },
    { name: "Nursing Home", cost: nursing_home_private },
  ];
  const cheapest = careOptions.reduce((a, b) => (a.cost < b.cost ? a : b));

  // Card 3: Monthly Budget Range
  const costs = [nursing_home_private, assisted_living, hhaMonthly, adult_day_care];
  const minCost = Math.min(...costs);
  const maxCost = Math.max(...costs);

  // Card 4: vs National
  const diff = nursing_home_private - nationalAvgs.nursing_home_private;
  const vsColor =
    diff <= 0
      ? { border: "border-emerald-200", bg: "bg-emerald-50", text: "text-emerald-700" }
      : diff <= 500
        ? { border: "border-amber-200", bg: "bg-amber-50", text: "text-amber-700" }
        : { border: "border-red-200", bg: "bg-red-50", text: "text-red-700" };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      {/* Affordability Tier */}
      <div className={`rounded-xl border p-4 ${tierColor.border} ${tierColor.bg}`}>
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
          Affordability Tier
        </div>
        <div className={`text-2xl font-bold ${tierColor.text} mb-1`}>{tierLabel}</div>
        <p className="text-sm text-slate-600 leading-snug">
          Cheaper than {costPercentile}% of US cities for nursing home care.
        </p>
      </div>

      {/* Cheapest Option */}
      <div className="rounded-xl border p-4 border-emerald-200 bg-emerald-50">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
          Cheapest Option
        </div>
        <div className="text-2xl font-bold text-emerald-700 mb-1">{cheapest.name}</div>
        <p className="text-sm text-slate-600 leading-snug">
          Starting at {formatCost(cheapest.cost)}/mo in {cityName}.
        </p>
      </div>

      {/* Monthly Budget */}
      <div className="rounded-xl border p-4 border-amber-200 bg-amber-50">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
          Monthly Budget Range
        </div>
        <div className="text-2xl font-bold text-amber-700 mb-1">
          {formatCost(minCost)} – {formatCost(maxCost)}
        </div>
        <p className="text-sm text-slate-600 leading-snug">
          Range across all 4 care types in {cityName}.
        </p>
      </div>

      {/* vs National */}
      <div className={`rounded-xl border p-4 ${vsColor.border} ${vsColor.bg}`}>
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
          vs National Average
        </div>
        <div className={`text-2xl font-bold ${vsColor.text} mb-1`}>
          {diff > 0 ? "+" : ""}{formatCost(diff)}
        </div>
        <p className="text-sm text-slate-600 leading-snug">
          Nursing home cost {diff > 0 ? "above" : "below"} the national avg of{" "}
          {formatCost(nationalAvgs.nursing_home_private)}/mo.
        </p>
      </div>
    </div>
  );
}
