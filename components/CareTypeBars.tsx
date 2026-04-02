/** Pure CSS bar chart — no client JS, no recharts */
import { formatCost, formatHourly } from "@/lib/format";

export function CareTypeBars({
  cityName,
  nursing_home_private,
  assisted_living,
  home_health_aide_hourly,
  adult_day_care,
  nationalAvgs,
}: {
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
}) {
  // Convert hourly to monthly for uniform comparison
  const hhMonthly = home_health_aide_hourly * 8 * 22;
  const natHhMonthly = nationalAvgs.home_health_aide_hourly * 8 * 22;

  const bars = [
    { label: "Nursing Home", value: nursing_home_private, natVal: nationalAvgs.nursing_home_private, color: "#ef4444", display: formatCost(nursing_home_private) },
    { label: "Assisted Living", value: assisted_living, natVal: nationalAvgs.assisted_living, color: "#f59e0b", display: formatCost(assisted_living) },
    { label: "Home Health Aide", value: hhMonthly, natVal: natHhMonthly, color: "#3b82f6", display: `${formatHourly(home_health_aide_hourly)}/hr` },
    { label: "Adult Day Care", value: adult_day_care, natVal: nationalAvgs.adult_day_care, color: "#22c55e", display: formatCost(adult_day_care) },
  ];

  const max = Math.max(...bars.map((b) => Math.max(b.value, b.natVal))) || 1;

  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-4">Monthly Care Costs in {cityName}</h2>
      <div className="bg-white rounded-xl shadow p-6 space-y-5">
        {bars.map((b) => {
          const pct = Math.round((b.value / max) * 100);
          const natPct = Math.round((b.natVal / max) * 100);
          return (
            <div key={b.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">{b.label}</span>
                <span className="font-semibold">{b.display}/mo</span>
              </div>
              <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${pct}%`, backgroundColor: b.color }}
                />
                {/* National avg reference line */}
                <div
                  className="absolute top-0 h-full border-r-2 border-dashed border-gray-500"
                  style={{ left: `${natPct}%` }}
                  title={`National avg: ${formatCost(b.natVal)}/mo`}
                />
              </div>
              <div className="text-xs text-gray-400 mt-0.5">
                National avg: {formatCost(b.natVal)}/mo
              </div>
            </div>
          );
        })}
        <div className="flex items-center gap-4 text-xs text-gray-400 pt-2 border-t border-gray-100">
          <span className="flex items-center gap-1">
            <span className="inline-block w-4 border-t-2 border-dashed border-gray-500" /> National Average
          </span>
        </div>
      </div>
    </section>
  );
}
