import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllStates, getStateBySlug, getCitiesByState, getNationalAverages } from "@/lib/db";
import { formatCost, formatHourly, formatPercent, getDataYear } from "@/lib/format";
import { Breadcrumb } from "@/components/Breadcrumb";
import { AdSlot } from "@/components/AdSlot";
import { DataFeedback } from "@/components/DataFeedback";
import { FreshnessTag } from "@/components/FreshnessTag";
import { FAQ } from "@/components/FAQ";
import { ElderCareCalculator } from "@/components/ElderCareCalculator";
import { faqSchema, breadcrumbSchema } from "@/lib/schema";
import { CiteButton } from "@/components/CiteButton";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;
export const revalidate = 86400;

export async function generateStaticParams() {
  const states = getAllStates();
  return states.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const state = getStateBySlug(slug);
  if (!state) return {};
  const year = getDataYear();
  return {
    title: `Senior Care Costs in ${state.state} (${year + 2}) - Nursing Home, Assisted Living`,
    description: `Compare senior care costs in ${state.state}: nursing homes (${formatCost(state.nursing_home_private)}/mo), assisted living (${formatCost(state.assisted_living)}/mo), home health aides (${formatHourly(state.home_health_aide_hourly)}/hr). Medicaid coverage info included.`,
    alternates: { canonical: `/state/${slug}` },
  };
}

export default async function StatePage({ params }: Props) {
  const { slug } = await params;
  const state = getStateBySlug(slug);
  if (!state) notFound();

  const cities = getCitiesByState(state.abbr);
  const natAvg = getNationalAverages();
  const year = getDataYear();

  const diffNursing = state.nursing_home_private - natAvg.nursing_home_private;
  const diffPctNursing = ((diffNursing / natAvg.nursing_home_private) * 100).toFixed(1);

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: state.state, url: `/state/${slug}` },
  ];

  const faqs = [
    {
      question: `How much does a nursing home cost in ${state.state}?`,
      answer: `A private room in a nursing home in ${state.state} costs approximately ${formatCost(state.nursing_home_private)}/month (${formatCost(state.nursing_home_private * 12)}/year). A semi-private room averages ${formatCost(state.nursing_home_semi)}/month. This is ${diffNursing > 0 ? `${formatCost(Math.abs(diffNursing))} above` : `${formatCost(Math.abs(diffNursing))} below`} the national average.`,
    },
    {
      question: `What is the cost of assisted living in ${state.state}?`,
      answer: `Assisted living in ${state.state} costs approximately ${formatCost(state.assisted_living)}/month (${formatCost(state.assisted_living * 12)}/year). Costs vary by city and facility amenities.`,
    },
    {
      question: `Does ${state.state} Medicaid cover nursing home care?`,
      answer: state.medicaid_coverage_notes,
    },
    {
      question: `How much does a home health aide cost in ${state.state}?`,
      answer: `Home health aides in ${state.state} charge approximately ${formatHourly(state.home_health_aide_hourly)}/hour. For full-time care (8 hours/day, 22 days/month), that totals about ${formatCost(state.home_health_aide_monthly)}/month.`,
    },
    {
      question: `What percentage of ${state.state}'s population is 65 or older?`,
      answer: `Approximately ${formatPercent(state.senior_population_pct)} of ${state.state}'s population is 65 years or older. The state's median household income is ${formatCost(state.median_household_income)}.`,
    },
  ];

  return (
    <div>
      <Breadcrumb items={breadcrumbs.map((b) => ({ label: b.name, href: b.url }))} />

      <h1 className="text-3xl font-bold mb-2">
        Senior Care Costs in {state.state} ({year + 2})
      </h1>
      <p className="text-slate-500 mb-6">
        Complete guide to nursing home, assisted living, and home care costs in {state.state}.
        {diffNursing > 0
          ? ` Costs are ${diffPctNursing}% above the national average.`
          : ` Costs are ${Math.abs(Number(diffPctNursing))}% below the national average.`}
      </p>

      {/* Cost overview cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="border border-teal-200 bg-teal-50 rounded-lg p-4">
          <h2 className="font-semibold text-teal-800 text-sm">Nursing Home (Private)</h2>
          <p className="text-2xl font-bold text-teal-700">{formatCost(state.nursing_home_private)}<span className="text-sm font-normal text-slate-500">/mo</span></p>
          <p className="text-xs text-slate-500">National avg: {formatCost(natAvg.nursing_home_private)}</p>
        </div>
        <div className="border border-teal-200 bg-teal-50 rounded-lg p-4">
          <h2 className="font-semibold text-teal-800 text-sm">Nursing Home (Semi-Private)</h2>
          <p className="text-2xl font-bold text-teal-700">{formatCost(state.nursing_home_semi)}<span className="text-sm font-normal text-slate-500">/mo</span></p>
          <p className="text-xs text-slate-500">National avg: {formatCost(natAvg.nursing_home_semi)}</p>
        </div>
        <div className="border border-emerald-200 bg-emerald-50 rounded-lg p-4">
          <h2 className="font-semibold text-emerald-800 text-sm">Assisted Living</h2>
          <p className="text-2xl font-bold text-emerald-700">{formatCost(state.assisted_living)}<span className="text-sm font-normal text-slate-500">/mo</span></p>
          <p className="text-xs text-slate-500">National avg: {formatCost(natAvg.assisted_living)}</p>
        </div>
        <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
          <h2 className="font-semibold text-blue-800 text-sm">Home Health Aide</h2>
          <p className="text-2xl font-bold text-blue-700">{formatHourly(state.home_health_aide_hourly)}<span className="text-sm font-normal text-slate-500">/hr</span></p>
          <p className="text-xs text-slate-500">{formatCost(state.home_health_aide_monthly)}/mo (8hr/day)</p>
        </div>
        <div className="border border-purple-200 bg-purple-50 rounded-lg p-4">
          <h2 className="font-semibold text-purple-800 text-sm">Adult Day Care</h2>
          <p className="text-2xl font-bold text-purple-700">{formatCost(state.adult_day_care)}<span className="text-sm font-normal text-slate-500">/mo</span></p>
          <p className="text-xs text-slate-500">National avg: {formatCost(natAvg.adult_day_care)}</p>
        </div>
        <div className="border border-rose-200 bg-rose-50 rounded-lg p-4">
          <h2 className="font-semibold text-rose-800 text-sm">Homemaker Services</h2>
          <p className="text-2xl font-bold text-rose-700">{formatHourly(state.homemaker_services_hourly)}<span className="text-sm font-normal text-slate-500">/hr</span></p>
          <p className="text-xs text-slate-500">{formatCost(state.homemaker_services_monthly)}/mo (8hr/day)</p>
        </div>
      </div>

      <AdSlot id="state-mid-1" />

      {/* City breakdown */}
      {cities.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">Senior Care Costs by City in {state.state}</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-100">
                  <th className="text-left p-3 font-semibold">City</th>
                  <th className="text-right p-3 font-semibold">Nursing Home</th>
                  <th className="text-right p-3 font-semibold">Assisted Living</th>
                  <th className="text-right p-3 font-semibold">Home Health Aide</th>
                  <th className="text-right p-3 font-semibold">Adult Day Care</th>
                </tr>
              </thead>
              <tbody>
                {cities.map((city) => (
                  <tr key={city.slug} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="p-3">
                      <a href={`/city/${city.slug}`} className="text-teal-600 hover:underline">{city.city_name}</a>
                    </td>
                    <td className="p-3 text-right">{formatCost(city.nursing_home_private)}/mo</td>
                    <td className="p-3 text-right">{formatCost(city.assisted_living)}/mo</td>
                    <td className="p-3 text-right">{formatHourly(city.home_health_aide_hourly)}/hr</td>
                    <td className="p-3 text-right">{formatCost(city.adult_day_care)}/mo</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Medicaid coverage */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">Medicaid &amp; Medicare Coverage in {state.state}</h2>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
          <p className="text-slate-700">{state.medicaid_coverage_notes}</p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold mb-1">Medicare Coverage (Federal)</h3>
              <ul className="list-disc list-inside text-slate-600 space-y-1">
                <li>Up to 100 days skilled nursing after hospital stay</li>
                <li>Home health services if homebound</li>
                <li>Does NOT cover custodial/long-term care</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-1">How to Pay for Care in {state.state}</h3>
              <ul className="list-disc list-inside text-slate-600 space-y-1">
                <li>Long-term care insurance</li>
                <li>Medicaid (income/asset eligible)</li>
                <li>VA benefits for veterans</li>
                <li>Personal savings and investments</li>
                <li>Reverse mortgage proceeds</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <AdSlot id="state-mid-2" />

      {/* State demographics */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">{state.state} Senior Demographics</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="border border-slate-200 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-slate-800">{formatPercent(state.senior_population_pct)}</p>
            <p className="text-sm text-slate-500">Population 65+</p>
          </div>
          <div className="border border-slate-200 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-slate-800">{formatCost(state.median_household_income)}</p>
            <p className="text-sm text-slate-500">Median Household Income</p>
          </div>
          <div className="border border-slate-200 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-slate-800">{formatCost(state.nursing_home_private * 12)}</p>
            <p className="text-sm text-slate-500">Annual Nursing Home Cost</p>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <ElderCareCalculator defaultState={state.abbr} />

      {/* Related Data Resources */}
      <section className="mt-6 p-4 bg-slate-50 rounded-lg">
        <h3 className="text-sm font-semibold text-slate-500 mb-2">Related Data Resources</h3>
        <div className="flex flex-wrap gap-3 text-sm">
          <a href="https://medcheckwize.com" className="text-teal-600 hover:underline">MedCheckWize - Medicare costs by state &rarr;</a>
          <a href="https://costbycity.com" className="text-teal-600 hover:underline">CostByCity - Cost of living comparison &rarr;</a>
        </div>
      </section>

      <FAQ items={faqs} />
      <DataFeedback />
      <FreshnessTag source="Genworth Cost of Care Survey" />

      <div className="flex items-center gap-4 mt-4">
        <CiteButton title={`Senior Care Costs in ${state.state}`} url={`https://eldercarepeek.com/state/${slug}`} source="ElderCarePeek" />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema(breadcrumbs.map((b) => ({ name: b.name, url: b.url })))),
        }}
      />
    </div>
  );
}
