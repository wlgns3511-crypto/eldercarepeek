import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCareTypes, getCareTypeBySlug, getStatesRankedByCareType, getNationalAverages } from "@/lib/db";
import { formatCost, formatHourly, getDataYear } from "@/lib/format";
import { Breadcrumb } from "@/components/Breadcrumb";
import { AdSlot } from "@/components/AdSlot";
import { DataFeedback } from "@/components/DataFeedback";
import { FreshnessTag } from "@/components/FreshnessTag";
import { FAQ } from "@/components/FAQ";
import { faqSchema, breadcrumbSchema } from "@/lib/schema";
import type { State } from "@/lib/db";
import { AuthorBox } from "@/components/AuthorBox";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;
export const revalidate = 86400;

export async function generateStaticParams() {
  const types = getCareTypes();
  return types.map((ct) => ({ slug: ct.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ct = getCareTypeBySlug(slug);
  if (!ct) return {};
  const year = getDataYear();
  return {
    title: `${ct.name} Costs by State (${year + 2}) - Average Prices & Rankings`,
    description: `${ct.name} costs across all 50 US states. National average: ${ct.slug.includes("aide") || ct.slug.includes("homemaker") ? formatHourly(ct.avg_national_cost) + "/hr" : formatCost(ct.avg_national_cost) + "/mo"}. See state rankings, what's included, and who needs this care.`,
    alternates: { canonical: `/care/${slug}` },
  };
}

function getCostField(slug: string): 'nursing_home_private' | 'assisted_living' | 'home_health_aide_hourly' | 'adult_day_care' | 'homemaker_services_hourly' {
  switch (slug) {
    case 'nursing-home': return 'nursing_home_private';
    case 'assisted-living': return 'assisted_living';
    case 'home-health-aide': return 'home_health_aide_hourly';
    case 'adult-day-care': return 'adult_day_care';
    case 'homemaker-services': return 'homemaker_services_hourly';
    default: return 'nursing_home_private';
  }
}

function getStateCost(state: State, slug: string): number {
  const field = getCostField(slug);
  return state[field] as number;
}

function formatStateCost(cost: number, slug: string): string {
  if (slug === 'home-health-aide' || slug === 'homemaker-services') {
    return formatHourly(cost) + '/hr';
  }
  return formatCost(cost) + '/mo';
}

export default async function CareTypePage({ params }: Props) {
  const { slug } = await params;
  const ct = getCareTypeBySlug(slug);
  if (!ct) notFound();

  const costField = getCostField(slug);
  const states = getStatesRankedByCareType(costField);
  const natAvg = getNationalAverages();
  const year = getDataYear();
  const isHourly = slug === 'home-health-aide' || slug === 'homemaker-services';

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Care Types", url: "/" },
    { name: ct.name, url: `/care/${slug}` },
  ];

  const faqs = [
    {
      question: `What is ${ct.name.toLowerCase()}?`,
      answer: ct.description,
    },
    {
      question: `How much does ${ct.name.toLowerCase()} cost?`,
      answer: `The national average cost is ${isHourly ? formatHourly(ct.avg_national_cost) + "/hour" : formatCost(ct.avg_national_cost) + "/month"}. Costs vary significantly by state and location.`,
    },
    {
      question: `What is included in ${ct.name.toLowerCase()}?`,
      answer: ct.what_included,
    },
    {
      question: `Who needs ${ct.name.toLowerCase()}?`,
      answer: ct.who_needs_it,
    },
    {
      question: `Does Medicare cover ${ct.name.toLowerCase()}?`,
      answer: slug === 'nursing-home'
        ? "Medicare covers up to 100 days of skilled nursing facility care following a qualifying 3-day hospital stay. It does NOT cover long-term custodial care."
        : slug === 'home-health-aide'
        ? "Medicare covers home health aide services when prescribed by a doctor as part of a home health care plan, if the patient is homebound and needs skilled nursing or therapy."
        : "Medicare has limited coverage for this type of care. Medicaid may cover costs for eligible individuals. Long-term care insurance can also help cover expenses.",
    },
  ];

  return (
    <div>
      <Breadcrumb items={breadcrumbs.map((b) => ({ label: b.name, href: b.url }))} />

      <h1 className="text-3xl font-bold mb-2">
        {ct.name} Costs by State ({year + 2})
      </h1>
      <p className="text-slate-500 mb-6">
        {ct.description}
      </p>

      {/* National average */}
      <div className="bg-teal-50 border border-teal-200 rounded-lg p-5 mb-8">
        <h2 className="text-lg font-bold text-teal-800 mb-1">National Average Cost</h2>
        <p className="text-3xl font-bold text-teal-700">
          {isHourly ? formatHourly(ct.avg_national_cost) : formatCost(ct.avg_national_cost)}
          <span className="text-base font-normal text-slate-500">{isHourly ? "/hour" : "/month"}</span>
        </p>
        {!isHourly && (
          <p className="text-sm text-slate-500 mt-1">{formatCost(ct.avg_national_cost * 12)}/year</p>
        )}
      </div>

      {/* What's included */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">What&apos;s Included</h2>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-700">
            {ct.what_included.split(', ').map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-teal-500 mt-0.5">&#10003;</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Who needs it */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">Who Needs {ct.name}?</h2>
        <p className="text-slate-700">{ct.who_needs_it}</p>
      </section>

      <AdSlot id="care-mid" />

      {/* State ranking table */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">{ct.name} Costs by State (Ranked)</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="text-left p-3 font-semibold">Rank</th>
                <th className="text-left p-3 font-semibold">State</th>
                <th className="text-right p-3 font-semibold">Cost</th>
                <th className="text-right p-3 font-semibold">vs. National Avg</th>
              </tr>
            </thead>
            <tbody>
              {states.map((s, i) => {
                const cost = getStateCost(s, slug);
                const natCost = isHourly
                  ? (slug === 'home-health-aide' ? natAvg.home_health_aide_hourly : natAvg.homemaker_services_hourly)
                  : (slug === 'nursing-home' ? natAvg.nursing_home_private : slug === 'assisted-living' ? natAvg.assisted_living : natAvg.adult_day_care);
                const diff = cost - natCost;
                const pct = natCost > 0 ? ((diff / natCost) * 100).toFixed(1) : "0";
                return (
                  <tr key={s.abbr} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="p-3 text-slate-400">#{i + 1}</td>
                    <td className="p-3">
                      <a href={`/state/${s.slug}`} className="text-teal-600 hover:underline">{s.state}</a>
                    </td>
                    <td className="p-3 text-right font-medium">{formatStateCost(cost, slug)}</td>
                    <td className="p-3 text-right">
                      <span className={diff > 0 ? "text-red-600" : "text-green-600"}>
                        {diff > 0 ? "+" : ""}{pct}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <AdSlot id="care-bottom" />

      <AuthorBox />

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
