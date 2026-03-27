import { getAllStates, getHighestCostStates, getLowestCostStates, getCareTypes, getNationalAverages } from "@/lib/db";
import { formatCost, formatHourly, getDataYear } from "@/lib/format";
import { ElderCareCalculator } from "@/components/ElderCareCalculator";
import { AdSlot } from "@/components/AdSlot";
import { FAQ } from "@/components/FAQ";
import { FreshnessTag } from "@/components/FreshnessTag";
import { DataFeedback } from "@/components/DataFeedback";
import { faqSchema, datasetSchema } from "@/lib/schema";

export default function Home() {
  const states = getAllStates();
  const highCost = getHighestCostStates(5);
  const lowCost = getLowestCostStates(5);
  const careTypes = getCareTypes();
  const natAvg = getNationalAverages();
  const year = getDataYear();

  const faqs = [
    {
      question: "What is the average cost of a nursing home in the US?",
      answer: `The national average cost of a private room in a nursing home is approximately ${formatCost(natAvg.nursing_home_private)} per month (${formatCost(natAvg.nursing_home_private * 12)} annually) as of ${year}. Costs vary significantly by state, ranging from about $6,000/month in the most affordable states to over $14,000/month in the most expensive.`,
    },
    {
      question: "How much does assisted living cost per month?",
      answer: `The national average cost of assisted living is approximately ${formatCost(natAvg.assisted_living)} per month. States like Mississippi, Missouri, and Louisiana tend to be the most affordable, while Connecticut, Massachusetts, and Alaska have the highest costs.`,
    },
    {
      question: "Does Medicare pay for nursing home care?",
      answer: "Medicare covers up to 100 days of skilled nursing facility care after a qualifying 3-day hospital stay. The first 20 days are fully covered, and days 21-100 require a daily copayment. Medicare does NOT cover long-term custodial nursing home care.",
    },
    {
      question: "What is the difference between a nursing home and assisted living?",
      answer: "Nursing homes provide 24-hour skilled nursing care for residents with complex medical needs. Assisted living facilities offer housing, meals, and personal care assistance for seniors who need help with daily activities but not continuous medical supervision. Nursing homes are typically more expensive due to the higher level of care.",
    },
    {
      question: "How can I pay for senior care?",
      answer: "Common payment sources include: personal savings, long-term care insurance, Medicaid (for those who qualify based on income/assets), Medicare (limited skilled nursing coverage), VA benefits for veterans, reverse mortgages, and life insurance policy conversions. Many families use a combination of these sources.",
    },
    {
      question: "What is a home health aide and how much does it cost?",
      answer: `A home health aide provides personal care services in the senior's home, including bathing, dressing, meal preparation, and companionship. The national average cost is approximately ${formatHourly(natAvg.home_health_aide_hourly)}/hour. For 8 hours/day, 5 days/week, that averages about ${formatCost(natAvg.home_health_aide_hourly * 8 * 22)}/month.`,
    },
  ];

  return (
    <div>
      <section className="mb-12">
        <h1 className="text-3xl font-bold mb-3">
          Senior Care &amp; Elder Care Costs by State ({year + 2})
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl">
          Compare nursing home, assisted living, home health aide, and adult day care costs
          across all 50 US states and 200+ cities. Find affordable senior care options near you.
        </p>
      </section>

      {/* National average cost cards */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">National Average Senior Care Costs</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="border border-teal-200 bg-teal-50 rounded-lg p-5">
            <h3 className="font-semibold text-teal-800 mb-1">Nursing Home (Private)</h3>
            <p className="text-3xl font-bold text-teal-700">{formatCost(natAvg.nursing_home_private)}<span className="text-base font-normal text-slate-500">/mo</span></p>
            <p className="text-sm text-slate-500 mt-1">{formatCost(natAvg.nursing_home_private * 12)}/year</p>
          </div>
          <div className="border border-emerald-200 bg-emerald-50 rounded-lg p-5">
            <h3 className="font-semibold text-emerald-800 mb-1">Assisted Living</h3>
            <p className="text-3xl font-bold text-emerald-700">{formatCost(natAvg.assisted_living)}<span className="text-base font-normal text-slate-500">/mo</span></p>
            <p className="text-sm text-slate-500 mt-1">{formatCost(natAvg.assisted_living * 12)}/year</p>
          </div>
          <div className="border border-blue-200 bg-blue-50 rounded-lg p-5">
            <h3 className="font-semibold text-blue-800 mb-1">Home Health Aide</h3>
            <p className="text-3xl font-bold text-blue-700">{formatHourly(natAvg.home_health_aide_hourly)}<span className="text-base font-normal text-slate-500">/hr</span></p>
            <p className="text-sm text-slate-500 mt-1">{formatCost(natAvg.home_health_aide_hourly * 8 * 22)}/mo (8hr/day)</p>
          </div>
          <div className="border border-purple-200 bg-purple-50 rounded-lg p-5">
            <h3 className="font-semibold text-purple-800 mb-1">Adult Day Care</h3>
            <p className="text-3xl font-bold text-purple-700">{formatCost(natAvg.adult_day_care)}<span className="text-base font-normal text-slate-500">/mo</span></p>
            <p className="text-sm text-slate-500 mt-1">{formatCost(natAvg.adult_day_care * 12)}/year</p>
          </div>
          <div className="border border-amber-200 bg-amber-50 rounded-lg p-5">
            <h3 className="font-semibold text-amber-800 mb-1">Nursing Home (Semi-Private)</h3>
            <p className="text-3xl font-bold text-amber-700">{formatCost(natAvg.nursing_home_semi)}<span className="text-base font-normal text-slate-500">/mo</span></p>
            <p className="text-sm text-slate-500 mt-1">{formatCost(natAvg.nursing_home_semi * 12)}/year</p>
          </div>
          <div className="border border-rose-200 bg-rose-50 rounded-lg p-5">
            <h3 className="font-semibold text-rose-800 mb-1">Homemaker Services</h3>
            <p className="text-3xl font-bold text-rose-700">{formatHourly(natAvg.homemaker_services_hourly)}<span className="text-base font-normal text-slate-500">/hr</span></p>
            <p className="text-sm text-slate-500 mt-1">{formatCost(natAvg.homemaker_services_hourly * 8 * 22)}/mo (8hr/day)</p>
          </div>
        </div>
      </section>

      <AdSlot id="home-mid-1" />

      {/* Most/Least expensive states */}
      <section className="mb-12">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-bold mb-3 text-red-700">Most Expensive States for Nursing Homes</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-red-50">
                    <th className="text-left p-3 font-semibold">State</th>
                    <th className="text-right p-3 font-semibold">Private Room/mo</th>
                  </tr>
                </thead>
                <tbody>
                  {highCost.map((s) => (
                    <tr key={s.abbr} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-3">
                        <a href={`/state/${s.slug}`} className="text-teal-600 hover:underline">{s.state}</a>
                      </td>
                      <td className="p-3 text-right font-medium">{formatCost(s.nursing_home_private)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-3 text-green-700">Most Affordable States for Nursing Homes</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-green-50">
                    <th className="text-left p-3 font-semibold">State</th>
                    <th className="text-right p-3 font-semibold">Private Room/mo</th>
                  </tr>
                </thead>
                <tbody>
                  {lowCost.map((s) => (
                    <tr key={s.abbr} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-3">
                        <a href={`/state/${s.slug}`} className="text-teal-600 hover:underline">{s.state}</a>
                      </td>
                      <td className="p-3 text-right font-medium">{formatCost(s.nursing_home_private)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Care type comparison table */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Care Type Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="text-left p-3 font-semibold">Care Type</th>
                <th className="text-right p-3 font-semibold">Avg. Cost</th>
                <th className="text-left p-3 font-semibold hidden md:table-cell">Best For</th>
              </tr>
            </thead>
            <tbody>
              {careTypes.map((ct) => (
                <tr key={ct.slug} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="p-3">
                    <a href={`/care/${ct.slug}`} className="text-teal-600 hover:underline font-medium">{ct.name}</a>
                  </td>
                  <td className="p-3 text-right font-medium">
                    {ct.slug === "home-health-aide" || ct.slug === "homemaker-services"
                      ? `${formatHourly(ct.avg_national_cost)}/hr`
                      : `${formatCost(ct.avg_national_cost)}/mo`}
                  </td>
                  <td className="p-3 text-slate-500 hidden md:table-cell">{ct.who_needs_it.substring(0, 100)}...</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <AdSlot id="home-mid-2" />

      {/* Calculator */}
      <section className="mb-12">
        <ElderCareCalculator />
      </section>

      {/* Browse by state */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Senior Care Costs by State</h2>
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 text-sm">
          {states.map((s) => (
            <div key={s.abbr} className="mb-1">
              <a
                href={`/state/${s.slug}`}
                className="text-slate-600 hover:text-teal-600 hover:underline"
              >
                {s.state}
              </a>
              <span className="text-slate-400 ml-1">{formatCost(s.nursing_home_private)}/mo</span>
            </div>
          ))}
        </div>
      </section>

      <FAQ items={faqs} />

      {/* High-CPC keywords section */}
      <section className="mt-8 bg-slate-50 border border-slate-200 rounded-lg p-5">
        <h2 className="text-lg font-bold mb-3">Senior Care Resources</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
          <div className="p-3 bg-white rounded border border-slate-100">
            <h3 className="font-semibold mb-1">Long-Term Care Insurance</h3>
            <p className="text-slate-500 text-xs">Compare long-term care insurance quotes to protect your retirement savings.</p>
          </div>
          <div className="p-3 bg-white rounded border border-slate-100">
            <h3 className="font-semibold mb-1">Medicare Supplement Plans</h3>
            <p className="text-slate-500 text-xs">Find Medigap plans that help cover costs Medicare doesn&apos;t pay.</p>
          </div>
          <div className="p-3 bg-white rounded border border-slate-100">
            <h3 className="font-semibold mb-1">Elder Law Attorneys</h3>
            <p className="text-slate-500 text-xs">Get legal help with Medicaid planning, estate planning, and senior care rights.</p>
          </div>
          <div className="p-3 bg-white rounded border border-slate-100">
            <h3 className="font-semibold mb-1">Senior Living Communities</h3>
            <p className="text-slate-500 text-xs">Browse independent living, assisted living, and continuing care retirement communities.</p>
          </div>
          <div className="p-3 bg-white rounded border border-slate-100">
            <h3 className="font-semibold mb-1">Home Health Care Agencies</h3>
            <p className="text-slate-500 text-xs">Find licensed home health aides and caregivers in your area.</p>
          </div>
          <div className="p-3 bg-white rounded border border-slate-100">
            <h3 className="font-semibold mb-1">Veteran Care Benefits</h3>
            <p className="text-slate-500 text-xs">Explore VA Aid and Attendance and other veteran benefits for senior care.</p>
          </div>
        </div>
      </section>

      {/* Cross-site links */}
      <section className="mt-6 bg-slate-50 border border-slate-200 rounded-lg p-5">
        <h2 className="text-lg font-bold mb-3">Related Resources</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <a href="https://costbycity.com" className="text-teal-600 hover:underline">Cost of Living by City</a>
          <a href="https://propertytaxpeek.com" className="text-teal-600 hover:underline">Property Tax by State</a>
          <a href="https://salarybycity.com" className="text-teal-600 hover:underline">Salary Data by City</a>
        </div>
      </section>

      <DataFeedback />
      <FreshnessTag source="Genworth Cost of Care Survey, CMS Medicare Data" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(datasetSchema(
            "US Senior Care Costs by State and City",
            "Comprehensive database of nursing home, assisted living, home health aide, and adult day care costs across all 50 US states and 200+ cities."
          )),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqs)) }}
      />
    </div>
  );
}
