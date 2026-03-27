import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllCities, getCityBySlug, getStateByAbbr, getCitiesByState, getNationalAverages } from "@/lib/db";
import { formatCost, formatHourly, getDataYear } from "@/lib/format";
import { Breadcrumb } from "@/components/Breadcrumb";
import { AdSlot } from "@/components/AdSlot";
import { DataFeedback } from "@/components/DataFeedback";
import { FreshnessTag } from "@/components/FreshnessTag";
import { FAQ } from "@/components/FAQ";
import { ElderCareCalculator } from "@/components/ElderCareCalculator";
import { faqSchema, breadcrumbSchema } from "@/lib/schema";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const cities = getAllCities();
  return cities.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) return {};
  const year = getDataYear();
  return {
    title: `Senior Care Costs in ${city.city_name}, ${city.state_abbr} (${year + 2})`,
    description: `Nursing home costs ${formatCost(city.nursing_home_private)}/mo, assisted living ${formatCost(city.assisted_living)}/mo, and home health aide ${formatHourly(city.home_health_aide_hourly)}/hr in ${city.city_name}, ${city.state_abbr}.`,
    alternates: { canonical: `/city/${slug}` },
  };
}

export default async function CityPage({ params }: Props) {
  const { slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) notFound();

  const state = getStateByAbbr(city.state_abbr);
  const natAvg = getNationalAverages();
  const year = getDataYear();

  // Nearby cities (same state)
  const stateCities = getCitiesByState(city.state_abbr).filter((c) => c.slug !== city.slug).slice(0, 5);

  const breadcrumbs = [
    { name: "Home", url: "/" },
    ...(state ? [{ name: state.state, url: `/state/${state.slug}` }] : []),
    { name: city.city_name, url: `/city/${slug}` },
  ];

  const diffNursing = city.nursing_home_private - natAvg.nursing_home_private;
  const stateDiffNursing = state ? city.nursing_home_private - state.nursing_home_private : 0;

  const faqs = [
    {
      question: `How much does a nursing home cost in ${city.city_name}, ${city.state_abbr}?`,
      answer: `A private room nursing home in ${city.city_name} costs approximately ${formatCost(city.nursing_home_private)}/month (${formatCost(city.nursing_home_private * 12)}/year). This is ${diffNursing > 0 ? `${formatCost(Math.abs(diffNursing))} above` : `${formatCost(Math.abs(diffNursing))} below`} the national average.`,
    },
    {
      question: `What is the cost of assisted living in ${city.city_name}?`,
      answer: `Assisted living in ${city.city_name}, ${city.state_abbr} costs approximately ${formatCost(city.assisted_living)}/month (${formatCost(city.assisted_living * 12)}/year).`,
    },
    {
      question: `How much do home health aides charge in ${city.city_name}?`,
      answer: `Home health aides in ${city.city_name} charge approximately ${formatHourly(city.home_health_aide_hourly)}/hour. For full-time care (8 hours/day, 22 days/month), that totals about ${formatCost(city.home_health_aide_hourly * 8 * 22)}/month.`,
    },
    {
      question: `Is ${city.city_name} an affordable place for senior care?`,
      answer: city.nursing_home_private < natAvg.nursing_home_private
        ? `Yes, ${city.city_name} has nursing home costs that are below the national average, making it a relatively affordable option for senior care.`
        : `${city.city_name} has nursing home costs above the national average. However, costs vary by facility and care level.`,
    },
  ];

  return (
    <div>
      <Breadcrumb items={breadcrumbs.map((b) => ({ label: b.name, href: b.url }))} />

      <h1 className="text-3xl font-bold mb-2">
        Senior Care Costs in {city.city_name}, {city.state_abbr} ({year + 2})
      </h1>
      <p className="text-slate-500 mb-6">
        Compare nursing home, assisted living, and home care costs in {city.city_name}.
      </p>

      {/* Cost cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="border border-teal-200 bg-teal-50 rounded-lg p-4">
          <h2 className="font-semibold text-teal-800 text-sm">Nursing Home (Private)</h2>
          <p className="text-2xl font-bold text-teal-700">{formatCost(city.nursing_home_private)}<span className="text-sm font-normal text-slate-500">/mo</span></p>
          <p className="text-xs text-slate-500">State avg: {state ? formatCost(state.nursing_home_private) : "N/A"}</p>
        </div>
        <div className="border border-emerald-200 bg-emerald-50 rounded-lg p-4">
          <h2 className="font-semibold text-emerald-800 text-sm">Assisted Living</h2>
          <p className="text-2xl font-bold text-emerald-700">{formatCost(city.assisted_living)}<span className="text-sm font-normal text-slate-500">/mo</span></p>
          <p className="text-xs text-slate-500">State avg: {state ? formatCost(state.assisted_living) : "N/A"}</p>
        </div>
        <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
          <h2 className="font-semibold text-blue-800 text-sm">Home Health Aide</h2>
          <p className="text-2xl font-bold text-blue-700">{formatHourly(city.home_health_aide_hourly)}<span className="text-sm font-normal text-slate-500">/hr</span></p>
          <p className="text-xs text-slate-500">{formatCost(city.home_health_aide_hourly * 8 * 22)}/mo (8hr/day)</p>
        </div>
        <div className="border border-purple-200 bg-purple-50 rounded-lg p-4">
          <h2 className="font-semibold text-purple-800 text-sm">Adult Day Care</h2>
          <p className="text-2xl font-bold text-purple-700">{formatCost(city.adult_day_care)}<span className="text-sm font-normal text-slate-500">/mo</span></p>
          <p className="text-xs text-slate-500">National avg: {formatCost(natAvg.adult_day_care)}</p>
        </div>
      </div>

      {/* Comparison with state and national */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">Cost Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="text-left p-3 font-semibold">Care Type</th>
                <th className="text-right p-3 font-semibold">{city.city_name}</th>
                <th className="text-right p-3 font-semibold">{state?.state || city.state_abbr} Avg</th>
                <th className="text-right p-3 font-semibold">National Avg</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="p-3 font-medium">Nursing Home (Private)</td>
                <td className="p-3 text-right">{formatCost(city.nursing_home_private)}/mo</td>
                <td className="p-3 text-right">{state ? formatCost(state.nursing_home_private) : "N/A"}/mo</td>
                <td className="p-3 text-right">{formatCost(natAvg.nursing_home_private)}/mo</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-3 font-medium">Assisted Living</td>
                <td className="p-3 text-right">{formatCost(city.assisted_living)}/mo</td>
                <td className="p-3 text-right">{state ? formatCost(state.assisted_living) : "N/A"}/mo</td>
                <td className="p-3 text-right">{formatCost(natAvg.assisted_living)}/mo</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-3 font-medium">Home Health Aide</td>
                <td className="p-3 text-right">{formatHourly(city.home_health_aide_hourly)}/hr</td>
                <td className="p-3 text-right">{state ? formatHourly(state.home_health_aide_hourly) : "N/A"}/hr</td>
                <td className="p-3 text-right">{formatHourly(natAvg.home_health_aide_hourly)}/hr</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-3 font-medium">Adult Day Care</td>
                <td className="p-3 text-right">{formatCost(city.adult_day_care)}/mo</td>
                <td className="p-3 text-right">{state ? formatCost(state.adult_day_care) : "N/A"}/mo</td>
                <td className="p-3 text-right">{formatCost(natAvg.adult_day_care)}/mo</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <AdSlot id="city-mid" />

      {/* Nearby cities */}
      {stateCities.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">Nearby Cities in {state?.state}</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {stateCities.map((c) => (
              <a
                key={c.slug}
                href={`/city/${c.slug}`}
                className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors"
              >
                <h3 className="font-semibold text-teal-700">{c.city_name}</h3>
                <div className="flex gap-4 text-sm text-slate-500 mt-1">
                  <span>NH: {formatCost(c.nursing_home_private)}/mo</span>
                  <span>AL: {formatCost(c.assisted_living)}/mo</span>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      <ElderCareCalculator defaultState={city.state_abbr} />

      <FAQ items={faqs} />
      <DataFeedback />
      <FreshnessTag source="Genworth Cost of Care Survey" />

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
