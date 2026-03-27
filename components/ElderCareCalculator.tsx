"use client";

import { useState } from "react";

const STATES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri",
  MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
  NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio",
  OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
};

// Approximate state-level monthly costs for each care type
const STATE_COSTS: Record<string, { nursing: number; assisted: number; hha_hourly: number; daycare: number; homemaker_hourly: number }> = {
  AL: { nursing: 7756, assisted: 3750, hha_hourly: 21, daycare: 1517, homemaker_hourly: 20 },
  AK: { nursing: 13250, assisted: 6488, hha_hourly: 33, daycare: 2167, homemaker_hourly: 31 },
  AZ: { nursing: 8913, assisted: 4500, hha_hourly: 27, daycare: 1733, homemaker_hourly: 25 },
  AR: { nursing: 6844, assisted: 3800, hha_hourly: 21, daycare: 1300, homemaker_hourly: 19.5 },
  CA: { nursing: 11502, assisted: 5750, hha_hourly: 32, daycare: 2017, homemaker_hourly: 30 },
  CO: { nursing: 9963, assisted: 5038, hha_hourly: 29, daycare: 1733, homemaker_hourly: 27 },
  CT: { nursing: 13992, assisted: 5750, hha_hourly: 28, daycare: 2200, homemaker_hourly: 26 },
  DE: { nursing: 10830, assisted: 5750, hha_hourly: 26, daycare: 1833, homemaker_hourly: 24 },
  FL: { nursing: 9963, assisted: 4385, hha_hourly: 26, daycare: 1733, homemaker_hourly: 24 },
  GA: { nursing: 7908, assisted: 3750, hha_hourly: 22, daycare: 1517, homemaker_hourly: 20.5 },
  HI: { nursing: 13250, assisted: 5250, hha_hourly: 33, daycare: 1767, homemaker_hourly: 31 },
  ID: { nursing: 9506, assisted: 4250, hha_hourly: 27, daycare: 1600, homemaker_hourly: 25 },
  IL: { nursing: 7148, assisted: 4750, hha_hourly: 26, daycare: 1650, homemaker_hourly: 24 },
  IN: { nursing: 8304, assisted: 4250, hha_hourly: 24, daycare: 1517, homemaker_hourly: 22 },
  IA: { nursing: 7604, assisted: 4250, hha_hourly: 25, daycare: 1733, homemaker_hourly: 23 },
  KS: { nursing: 7452, assisted: 4500, hha_hourly: 24, daycare: 1650, homemaker_hourly: 22.5 },
  KY: { nursing: 7756, assisted: 3750, hha_hourly: 22, daycare: 1300, homemaker_hourly: 20 },
  LA: { nursing: 6540, assisted: 3500, hha_hourly: 20, daycare: 1383, homemaker_hourly: 18.5 },
  ME: { nursing: 10373, assisted: 5500, hha_hourly: 28, daycare: 2017, homemaker_hourly: 26 },
  MD: { nursing: 10982, assisted: 4750, hha_hourly: 26, daycare: 1833, homemaker_hourly: 24 },
  MA: { nursing: 13992, assisted: 5750, hha_hourly: 30, daycare: 2100, homemaker_hourly: 28 },
  MI: { nursing: 9354, assisted: 4250, hha_hourly: 25, daycare: 1600, homemaker_hourly: 23 },
  MN: { nursing: 10830, assisted: 4750, hha_hourly: 29, daycare: 1900, homemaker_hourly: 27 },
  MS: { nursing: 7300, assisted: 3500, hha_hourly: 19, daycare: 1250, homemaker_hourly: 17.5 },
  MO: { nursing: 6236, assisted: 3263, hha_hourly: 22, daycare: 1383, homemaker_hourly: 20 },
  MT: { nursing: 9506, assisted: 4500, hha_hourly: 28, daycare: 1650, homemaker_hourly: 26 },
  NE: { nursing: 8608, assisted: 4250, hha_hourly: 26, daycare: 1600, homemaker_hourly: 24 },
  NV: { nursing: 9354, assisted: 4250, hha_hourly: 27, daycare: 1517, homemaker_hourly: 25 },
  NH: { nursing: 12167, assisted: 5500, hha_hourly: 29, daycare: 2017, homemaker_hourly: 27 },
  NJ: { nursing: 12167, assisted: 5950, hha_hourly: 27, daycare: 2100, homemaker_hourly: 25 },
  NM: { nursing: 8760, assisted: 4250, hha_hourly: 24, daycare: 1517, homemaker_hourly: 22 },
  NY: { nursing: 13250, assisted: 5500, hha_hourly: 27, daycare: 2350, homemaker_hourly: 25 },
  NC: { nursing: 8304, assisted: 4250, hha_hourly: 23, daycare: 1517, homemaker_hourly: 21 },
  ND: { nursing: 10373, assisted: 4250, hha_hourly: 28, daycare: 1733, homemaker_hourly: 26 },
  OH: { nursing: 8304, assisted: 4500, hha_hourly: 23, daycare: 1650, homemaker_hourly: 21.5 },
  OK: { nursing: 6844, assisted: 3750, hha_hourly: 22, daycare: 1383, homemaker_hourly: 20 },
  OR: { nursing: 10982, assisted: 5500, hha_hourly: 30, daycare: 1900, homemaker_hourly: 28 },
  PA: { nursing: 10068, assisted: 4500, hha_hourly: 25, daycare: 1733, homemaker_hourly: 23 },
  RI: { nursing: 10830, assisted: 5250, hha_hourly: 28, daycare: 2100, homemaker_hourly: 26 },
  SC: { nursing: 7604, assisted: 3750, hha_hourly: 22, daycare: 1383, homemaker_hourly: 20 },
  SD: { nursing: 8304, assisted: 4000, hha_hourly: 26, daycare: 1517, homemaker_hourly: 24 },
  TN: { nursing: 7452, assisted: 4000, hha_hourly: 22, daycare: 1383, homemaker_hourly: 20.5 },
  TX: { nursing: 6083, assisted: 4178, hha_hourly: 23, daycare: 1083, homemaker_hourly: 21 },
  UT: { nursing: 8304, assisted: 3750, hha_hourly: 25, daycare: 1383, homemaker_hourly: 23 },
  VT: { nursing: 10982, assisted: 5500, hha_hourly: 29, daycare: 2017, homemaker_hourly: 27 },
  VA: { nursing: 8913, assisted: 4750, hha_hourly: 24, daycare: 1733, homemaker_hourly: 22.5 },
  WA: { nursing: 10982, assisted: 5750, hha_hourly: 31, daycare: 2017, homemaker_hourly: 29 },
  WV: { nursing: 10068, assisted: 4250, hha_hourly: 22, daycare: 1517, homemaker_hourly: 20 },
  WI: { nursing: 9963, assisted: 4750, hha_hourly: 27, daycare: 1733, homemaker_hourly: 25 },
  WY: { nursing: 9963, assisted: 4500, hha_hourly: 28, daycare: 1650, homemaker_hourly: 26 },
};

const NATIONAL_AVG = {
  nursing: 9541,
  assisted: 4500,
  hha_hourly: 25.5,
  daycare: 1690,
  homemaker_hourly: 23.5,
};

type CareTypeKey = "nursing" | "assisted" | "hha" | "daycare" | "homemaker";

function fmt(n: number): string {
  return "$" + Math.round(n).toLocaleString("en-US");
}

export function ElderCareCalculator({ defaultState, defaultCareType }: { defaultState?: string; defaultCareType?: CareTypeKey }) {
  const [state, setState] = useState(defaultState || "FL");
  const [careType, setCareType] = useState<CareTypeKey>(defaultCareType || "nursing");
  const [hoursPerDay, setHoursPerDay] = useState(8);
  const [durationMonths, setDurationMonths] = useState(12);

  const costs = STATE_COSTS[state] || STATE_COSTS.FL;

  let monthlyCost = 0;
  let careLabel = "";
  let isHourly = false;

  switch (careType) {
    case "nursing":
      monthlyCost = costs.nursing;
      careLabel = "Nursing Home (Private Room)";
      break;
    case "assisted":
      monthlyCost = costs.assisted;
      careLabel = "Assisted Living";
      break;
    case "hha":
      monthlyCost = costs.hha_hourly * hoursPerDay * 22;
      careLabel = "Home Health Aide";
      isHourly = true;
      break;
    case "daycare":
      monthlyCost = costs.daycare;
      careLabel = "Adult Day Care";
      break;
    case "homemaker":
      monthlyCost = costs.homemaker_hourly * hoursPerDay * 22;
      careLabel = "Homemaker Services";
      isHourly = true;
      break;
  }

  const annualCost = monthlyCost * 12;
  const totalCost = monthlyCost * durationMonths;
  const fiveYearCost = monthlyCost * 60;

  // National average for comparison
  let natMonthly = 0;
  switch (careType) {
    case "nursing": natMonthly = NATIONAL_AVG.nursing; break;
    case "assisted": natMonthly = NATIONAL_AVG.assisted; break;
    case "hha": natMonthly = NATIONAL_AVG.hha_hourly * hoursPerDay * 22; break;
    case "daycare": natMonthly = NATIONAL_AVG.daycare; break;
    case "homemaker": natMonthly = NATIONAL_AVG.homemaker_hourly * hoursPerDay * 22; break;
  }
  const diffFromNational = monthlyCost - natMonthly;
  const diffPct = natMonthly > 0 ? ((diffFromNational / natMonthly) * 100).toFixed(1) : "0";

  return (
    <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-6 my-8 border border-teal-200">
      <h2 className="text-xl font-bold text-teal-900 mb-4">Elder Care Cost Calculator</h2>
      <p className="text-sm text-slate-600 mb-4">
        Estimate senior care costs based on your state, care type, and duration needs.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          >
            {Object.entries(STATES)
              .sort((a, b) => a[1].localeCompare(b[1]))
              .map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Care Type</label>
          <select
            value={careType}
            onChange={(e) => setCareType(e.target.value as CareTypeKey)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          >
            <option value="nursing">Nursing Home (Private)</option>
            <option value="assisted">Assisted Living</option>
            <option value="hha">Home Health Aide</option>
            <option value="daycare">Adult Day Care</option>
            <option value="homemaker">Homemaker Services</option>
          </select>
        </div>
        {isHourly && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Hours/Day</label>
            <input
              type="number"
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(Math.max(1, Math.min(24, Number(e.target.value))))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              min={1}
              max={24}
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Duration (months)</label>
          <input
            type="number"
            value={durationMonths}
            onChange={(e) => setDurationMonths(Math.max(1, Number(e.target.value)))}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            min={1}
            step={1}
          />
        </div>
      </div>

      {/* Results */}
      <div className="bg-white rounded-xl p-5 mb-4">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">{careLabel} in {STATES[state]}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider">Monthly Cost</p>
            <p className="text-2xl font-bold text-teal-600">{fmt(monthlyCost)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider">Annual Cost</p>
            <p className="text-2xl font-bold text-teal-600">{fmt(annualCost)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider">5-Year Projection</p>
            <p className="text-2xl font-bold text-teal-600">{fmt(fiveYearCost)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider">Total ({durationMonths}mo)</p>
            <p className="text-2xl font-bold text-teal-600">{fmt(totalCost)}</p>
          </div>
        </div>
      </div>

      {/* National comparison */}
      <div className="bg-white rounded-xl p-5 mb-4">
        <h3 className="font-semibold text-slate-800 mb-3">vs. National Average</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-1">
              <span>{STATES[state]}</span>
              <span className="font-medium">{fmt(monthlyCost)}/mo</span>
            </div>
            <div className="h-4 bg-teal-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-500 rounded-full"
                style={{ width: `${Math.min((monthlyCost / Math.max(monthlyCost, natMonthly)) * 100, 100)}%` }}
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-1">
              <span>National Avg</span>
              <span className="font-medium">{fmt(natMonthly)}/mo</span>
            </div>
            <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-slate-400 rounded-full"
                style={{ width: `${Math.min((natMonthly / Math.max(monthlyCost, natMonthly)) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
        <p className="text-sm text-slate-500 mt-2">
          {diffFromNational > 0
            ? `${fmt(Math.abs(diffFromNational))}/mo higher than national average (+${diffPct}%)`
            : diffFromNational < 0
            ? `${fmt(Math.abs(diffFromNational))}/mo lower than national average (${diffPct}%)`
            : "Same as national average"}
        </p>
      </div>

      {/* Medicare/Medicaid note */}
      <div className="bg-white rounded-xl p-5">
        <h3 className="font-semibold text-slate-800 mb-2">Medicare &amp; Medicaid Coverage</h3>
        <ul className="space-y-1 text-sm text-slate-600">
          <li><strong>Medicare:</strong> Covers up to 100 days of skilled nursing facility care after a qualifying hospital stay (first 20 days fully covered, days 21-100 with copay).</li>
          <li><strong>Medicaid:</strong> May cover nursing home and some home care costs for eligible individuals. Income and asset limits apply and vary by state.</li>
          <li><strong>Long-Term Care Insurance:</strong> Can cover costs not paid by Medicare or Medicaid. Premiums depend on age and coverage level.</li>
          <li><strong>VA Benefits:</strong> Veterans may qualify for Aid and Attendance benefits to help cover care costs.</li>
        </ul>
      </div>

      {/* High-CPC footer keywords */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {[
          "Long-term care insurance quotes",
          "Medicare supplement plans",
          "Elder law attorneys near me",
          "Senior living communities",
          "Home health care agencies",
          "Medicaid planning services",
        ].map((kw) => (
          <div key={kw} className="px-3 py-2 bg-white rounded border border-teal-100 text-xs text-slate-500">
            {kw}
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-400 mt-3">
        * Estimates based on Genworth Cost of Care Survey data. Actual costs may vary by facility, location, and level of care needed.
        Consult a <strong>certified elder care advisor</strong> or <strong>financial planner specializing in senior care</strong> for personalized guidance.
      </p>
    </div>
  );
}
