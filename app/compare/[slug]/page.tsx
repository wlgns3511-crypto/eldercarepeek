import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTopComparisons, getComparisonBySlugs, getStateBySlug, getNationalAverages } from "@/lib/db";
import { formatCost, formatHourly, getDataYear } from "@/lib/format";
import { Breadcrumb } from "@/components/Breadcrumb";
import { AdSlot } from "@/components/AdSlot";
import { DataFeedback } from "@/components/DataFeedback";
import { FreshnessTag } from "@/components/FreshnessTag";
import { FAQ } from "@/components/FAQ";
import { faqSchema, breadcrumbSchema } from "@/lib/schema";
import { ComparisonBar } from "@/components/ComparisonBar";

interface Props {
  params: Promise<{ slug: string }>;
}

function parseSlugs(slug: string): { slugA: string; slugB: string } | null {
  const match = slug.match(/^(.+)-vs-(.+)-senior-care$/);
  if (!match) return null;
  return { slugA: match[1], slugB: match[2] };
}

export async function generateStaticParams() {
  const comparisons = getTopComparisons(200);
  return comparisons.map((c) => ({
    slug: `${c.slug_a}-vs-${c.slug_b}-senior-care`,
  }));
}

export const dynamicParams = true;
export const revalidate = 86400;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseSlugs(slug);
  if (!parsed) return {};

  const stateA = getStateBySlug(parsed.slugA);
  const stateB = getStateBySlug(parsed.slugB);
  if (!stateA || !stateB) return {};

  const year = getDataYear();

  return {
    title: `${stateA.state} vs ${stateB.state} Senior Care Costs (${year + 2})`,
    description: `Compare senior care costs: ${stateA.state} (nursing home ${formatCost(stateA.nursing_home_private)}/mo) vs ${stateB.state} (${formatCost(stateB.nursing_home_private)}/mo). Side-by-side assisted living, home health aide, and adult day care costs.`,
    alternates: { canonical: `/compare/${slug}` },
  };
}

function CostRow({ label, valA, valB, format }: { label: string; valA: number; valB: number; format: "cost" | "hourly" }) {
  const diff = valA - valB;
  const fmtFn = format === "hourly" ? formatHourly : formatCost;
  const suffix = format === "hourly" ? "/hr" : "/mo";
  return (
    <tr className="border-b border-slate-200 hover:bg-slate-50">
      <td className="p-3 font-medium">{label}</td>
      <td className="p-3 text-right">{fmtFn(valA)}{suffix}</td>
      <td className="p-3 text-right">{fmtFn(valB)}{suffix}</td>
      <td className="p-3 text-right">
        <span className={diff > 0 ? "text-red-600" : diff < 0 ? "text-green-600" : "text-slate-500"}>
          {diff > 0 ? "+" : ""}{fmtFn(Math.abs(diff))}
        </span>
      </td>
    </tr>
  );
}

export default async function ComparePage({ params }: Props) {
  const { slug } = await params;
  const parsed = parseSlugs(slug);
  if (!parsed) notFound();

  const stateA = getStateBySlug(parsed.slugA);
  const stateB = getStateBySlug(parsed.slugB);
  if (!stateA || !stateB) notFound();

  const natAvg = getNationalAverages();
  const year = getDataYear();

  const nursingDiff = stateA.nursing_home_private - stateB.nursing_home_private;
  const cheaperState = nursingDiff > 0 ? stateB.state : stateA.state;

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Compare", url: "/" },
    { name: `${stateA.state} vs ${stateB.state}`, url: `/compare/${slug}` },
  ];

  const faqs = [
    {
      question: `Which state has cheaper nursing homes: ${stateA.state} or ${stateB.state}?`,
      answer: `${cheaperState} has lower nursing home costs. ${stateA.state} averages ${formatCost(stateA.nursing_home_private)}/month while ${stateB.state} averages ${formatCost(stateB.nursing_home_private)}/month, a difference of ${formatCost(Math.abs(nursingDiff))}/month.`,
    },
    {
      question: `How do assisted living costs compare between ${stateA.state} and ${stateB.state}?`,
      answer: `Assisted living in ${stateA.state} costs ${formatCost(stateA.assisted_living)}/month compared to ${formatCost(stateB.assisted_living)}/month in ${stateB.state}.`,
    },
    {
      question: `What about home health aide costs?`,
      answer: `Home health aides charge ${formatHourly(stateA.home_health_aide_hourly)}/hour in ${stateA.state} and ${formatHourly(stateB.home_health_aide_hourly)}/hour in ${stateB.state}.`,
    },
    {
      question: `Which state has better Medicaid coverage for senior care?`,
      answer: `Both states offer Medicaid coverage for nursing home care. ${stateA.state}: ${stateA.medicaid_coverage_notes.substring(0, 120)}... ${stateB.state}: ${stateB.medicaid_coverage_notes.substring(0, 120)}...`,
    },
  ];

  return (
    <div>
      <Breadcrumb items={breadcrumbs.map((b) => ({ label: b.name, href: b.url }))} />

      <h1 className="text-3xl font-bold mb-2">
        {stateA.state} vs {stateB.state}: Senior Care Cost Comparison ({year + 2})
      </h1>
      <p className="text-slate-500 mb-6">
        Side-by-side comparison of nursing home, assisted living, and home care costs.
      </p>

      {/* Hero cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-5">
          <h2 className="text-lg font-bold text-teal-800 mb-1">
            <a href={`/state/${stateA.slug}`} className="hover:underline">{stateA.state}</a>
          </h2>
          <div className="text-3xl font-bold text-teal-700 mb-1">{formatCost(stateA.nursing_home_private)}<span className="text-base font-normal">/mo</span></div>
          <p className="text-sm text-slate-500">Nursing home (private room)</p>
          <p className="text-sm text-slate-500 mt-1">Senior population: {stateA.senior_population_pct}%</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5">
          <h2 className="text-lg font-bold text-emerald-800 mb-1">
            <a href={`/state/${stateB.slug}`} className="hover:underline">{stateB.state}</a>
          </h2>
          <div className="text-3xl font-bold text-emerald-700 mb-1">{formatCost(stateB.nursing_home_private)}<span className="text-base font-normal">/mo</span></div>
          <p className="text-sm text-slate-500">Nursing home (private room)</p>
          <p className="text-sm text-slate-500 mt-1">Senior population: {stateB.senior_population_pct}%</p>
        </div>
      </div>

      {/* Which is cheaper */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 mb-8">
        <h2 className="text-xl font-bold mb-2">Which State is More Affordable for Senior Care?</h2>
        <p className="text-slate-700">
          <strong>{cheaperState}</strong> has lower nursing home costs by{" "}
          <strong>{formatCost(Math.abs(nursingDiff))}/month</strong> ({formatCost(Math.abs(nursingDiff) * 12)}/year).
          Over 5 years, that&apos;s a difference of {formatCost(Math.abs(nursingDiff) * 60)}.
        </p>
      </div>

      <AdSlot id="compare-mid" />

      {/* Detailed comparison table */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">Detailed Cost Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="text-left p-3 font-semibold">Care Type</th>
                <th className="text-right p-3 font-semibold text-teal-700">{stateA.state}</th>
                <th className="text-right p-3 font-semibold text-emerald-700">{stateB.state}</th>
                <th className="text-right p-3 font-semibold">Difference</th>
              </tr>
            </thead>
            <tbody>
              <CostRow label="Nursing Home (Private)" valA={stateA.nursing_home_private} valB={stateB.nursing_home_private} format="cost" />
              <CostRow label="Nursing Home (Semi-Private)" valA={stateA.nursing_home_semi} valB={stateB.nursing_home_semi} format="cost" />
              <CostRow label="Assisted Living" valA={stateA.assisted_living} valB={stateB.assisted_living} format="cost" />
              <CostRow label="Home Health Aide" valA={stateA.home_health_aide_hourly} valB={stateB.home_health_aide_hourly} format="hourly" />
              <CostRow label="Adult Day Care" valA={stateA.adult_day_care} valB={stateB.adult_day_care} format="cost" />
              <CostRow label="Homemaker Services" valA={stateA.homemaker_services_hourly} valB={stateB.homemaker_services_hourly} format="hourly" />
            </tbody>
          </table>
        </div>
      </section>

      {/* Visual Comparison Bars */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">Visual Cost Comparison</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", margin: "24px 0" }}>
          {stateA.nursing_home_private != null && stateB.nursing_home_private != null && (
            <div>
              <h3 className="text-sm font-medium text-slate-600 mb-2">Nursing Home (Private Room) /mo</h3>
              <ComparisonBar
                bars={[{ label: stateA.state, value: stateA.nursing_home_private }, { label: stateB.state, value: stateB.nursing_home_private }]}
                format={(v) => "$" + v.toLocaleString()}
                referenceValue={natAvg?.nursing_home_private}
              />
            </div>
          )}
          {stateA.assisted_living != null && stateB.assisted_living != null && (
            <div>
              <h3 className="text-sm font-medium text-slate-600 mb-2">Assisted Living /mo</h3>
              <ComparisonBar
                bars={[{ label: stateA.state, value: stateA.assisted_living }, { label: stateB.state, value: stateB.assisted_living }]}
                format={(v) => "$" + v.toLocaleString()}
                referenceValue={natAvg?.assisted_living}
              />
            </div>
          )}
          {stateA.home_health_aide_hourly != null && stateB.home_health_aide_hourly != null && (
            <div>
              <h3 className="text-sm font-medium text-slate-600 mb-2">Home Health Aide /hr</h3>
              <ComparisonBar
                bars={[{ label: stateA.state, value: stateA.home_health_aide_hourly }, { label: stateB.state, value: stateB.home_health_aide_hourly }]}
                format={(v) => "$" + v.toLocaleString()}
                referenceValue={natAvg?.home_health_aide_hourly}
              />
            </div>
          )}
          {stateA.adult_day_care != null && stateB.adult_day_care != null && (
            <div>
              <h3 className="text-sm font-medium text-slate-600 mb-2">Adult Day Care /mo</h3>
              <ComparisonBar
                bars={[{ label: stateA.state, value: stateA.adult_day_care }, { label: stateB.state, value: stateB.adult_day_care }]}
                format={(v) => "$" + v.toLocaleString()}
                referenceValue={natAvg?.adult_day_care}
              />
            </div>
          )}
        </div>
      </section>

      {/* Annual cost comparison */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">Annual Cost Comparison</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[stateA, stateB].map((s, idx) => (
            <div key={s.abbr} className={`border ${idx === 0 ? "border-teal-200" : "border-emerald-200"} rounded-lg p-4`}>
              <h3 className={`font-semibold ${idx === 0 ? "text-teal-700" : "text-emerald-700"} mb-2`}>{s.state} Annual Costs</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Nursing Home (Private)</span><span className="font-medium">{formatCost(s.nursing_home_private * 12)}/yr</span></div>
                <div className="flex justify-between"><span>Assisted Living</span><span className="font-medium">{formatCost(s.assisted_living * 12)}/yr</span></div>
                <div className="flex justify-between"><span>Home Health Aide (8hr/day)</span><span className="font-medium">{formatCost(s.home_health_aide_monthly * 12)}/yr</span></div>
                <div className="flex justify-between"><span>Adult Day Care</span><span className="font-medium">{formatCost(s.adult_day_care * 12)}/yr</span></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <AdSlot id="compare-bottom" />

      {/* High CPC section */}
      <section className="mt-8 bg-slate-50 border border-slate-200 rounded-lg p-5">
        <h2 className="text-lg font-bold mb-3">Senior Care Planning Resources</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="p-3 bg-white rounded border border-slate-100">
            <h3 className="font-semibold mb-1">Long-Term Care Insurance Quotes</h3>
            <p className="text-slate-500 text-xs">Protect your savings with affordable LTC insurance coverage.</p>
          </div>
          <div className="p-3 bg-white rounded border border-slate-100">
            <h3 className="font-semibold mb-1">Medicaid Planning Services</h3>
            <p className="text-slate-500 text-xs">Navigate Medicaid eligibility and asset protection strategies.</p>
          </div>
          <div className="p-3 bg-white rounded border border-slate-100">
            <h3 className="font-semibold mb-1">Medicare Part A Coverage</h3>
            <p className="text-slate-500 text-xs">Understand what Medicare covers for skilled nursing facility care.</p>
          </div>
          <div className="p-3 bg-white rounded border border-slate-100">
            <h3 className="font-semibold mb-1">Elder Law Attorneys</h3>
            <p className="text-slate-500 text-xs">Get legal help with estate planning and Medicaid spend-down rules.</p>
          </div>
        </div>
      </section>

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
