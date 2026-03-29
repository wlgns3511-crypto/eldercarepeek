import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllZipEldercare, getZipEldercareBySlug, getZipEldercareByState, getStateByAbbr, getNationalAverages } from "@/lib/db";
import { faqSchema, breadcrumbSchema } from "@/lib/schema";
import { Breadcrumb } from "@/components/Breadcrumb";
import { AdSlot } from "@/components/AdSlot";
import { FreshnessTag } from "@/components/FreshnessTag";

interface Props { params: Promise<{ slug: string }> }

function fmt(v: number | null | undefined): string { return v ? '$' + v.toLocaleString('en-US') : 'N/A'; }

export const dynamicParams = true;
export const revalidate = 86400;

export async function generateStaticParams() {
  const zips = getAllZipEldercare().slice(0, 500);
  return zips.map((z) => ({ slug: z.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const z = getZipEldercareBySlug(slug);
  if (!z) return {};
  return {
    title: `Senior Care Costs in ${z.zip_code} ${z.city}, ${z.state} - ElderCarePeek`,
    description: `Senior care costs in ${z.zip_code} ${z.city}, ${z.state}: nursing home ${fmt(z.nursing_home_private)}/mo, assisted living ${fmt(z.assisted_living)}/mo, home health aide $${z.home_health_aide_hourly}/hr.`,
    alternates: { canonical: `/zip/${slug}` },
  };
}

export default async function ZipEldercarePage({ params }: Props) {
  const { slug } = await params;
  const z = getZipEldercareBySlug(slug);
  if (!z) notFound();

  const state = getStateByAbbr(z.state);
  const national = getNationalAverages();
  const nearbyZips = getZipEldercareByState(z.state)
    .filter((nz) => nz.zip_code !== z.zip_code)
    .slice(0, 10);

  const crumbs = [
    { label: "Home", href: "/" },
    { label: state?.state || z.state, href: `/state/${state?.slug || z.state.toLowerCase()}/` },
    { label: `${z.zip_code} ${z.city}` },
  ];

  const faqs = [
    {
      question: `How much does a nursing home cost in ${z.zip_code} ${z.city}?`,
      answer: `A private room nursing home in ${z.zip_code} ${z.city}, ${z.state} costs approximately ${fmt(z.nursing_home_private)} per month.`,
    },
    {
      question: `What is the cost of assisted living in ${z.zip_code}?`,
      answer: `Assisted living in ${z.zip_code} ${z.city}, ${z.state} costs approximately ${fmt(z.assisted_living)} per month.`,
    },
    {
      question: `How affordable is senior care in ${z.zip_code}?`,
      answer: z.care_affordability_pct
        ? `Senior care (assisted living) in ${z.zip_code} would cost approximately ${z.care_affordability_pct}% of the area's median household income.`
        : `Affordability data is not available for ${z.zip_code}.`,
    },
  ];

  return (
    <article className="max-w-4xl mx-auto">
      <Breadcrumb items={crumbs} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs.map(c => ({ name: c.label, url: c.href || "" })))) }} />

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-teal-700 mb-3">
          Senior Care Costs in {z.zip_code} {z.city}, {z.state}
        </h1>
        <FreshnessTag source="Genworth Cost of Care Survey & CMS Data" />
      </header>

      <AdSlot id="top" />

      {/* Key costs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-teal-50 rounded-lg p-4 text-center">
          <div className="text-xl font-bold text-teal-700">{fmt(z.nursing_home_private)}</div>
          <div className="text-xs text-slate-500">Nursing Home (Private)</div>
        </div>
        <div className="bg-teal-50 rounded-lg p-4 text-center">
          <div className="text-xl font-bold text-teal-700">{fmt(z.assisted_living)}</div>
          <div className="text-xs text-slate-500">Assisted Living</div>
        </div>
        <div className="bg-teal-50 rounded-lg p-4 text-center">
          <div className="text-xl font-bold text-teal-700">${z.home_health_aide_hourly}/hr</div>
          <div className="text-xs text-slate-500">Home Health Aide</div>
        </div>
        <div className="bg-teal-50 rounded-lg p-4 text-center">
          <div className="text-xl font-bold text-teal-700">{fmt(z.adult_day_care)}</div>
          <div className="text-xs text-slate-500">Adult Day Care</div>
        </div>
      </div>

      {/* Comparison table */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Cost Comparison</h2>
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-4 py-3 text-left font-semibold">Care Type</th>
                <th className="px-4 py-3 text-right font-semibold">{z.zip_code} {z.city}</th>
                <th className="px-4 py-3 text-right font-semibold">National Avg</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="px-4 py-3">Nursing Home (Private)</td>
                <td className="px-4 py-3 text-right font-medium">{fmt(z.nursing_home_private)}/mo</td>
                <td className="px-4 py-3 text-right text-slate-500">{fmt(national.nursing_home_private)}/mo</td>
              </tr>
              <tr className="border-t bg-slate-50/50">
                <td className="px-4 py-3">Assisted Living</td>
                <td className="px-4 py-3 text-right font-medium">{fmt(z.assisted_living)}/mo</td>
                <td className="px-4 py-3 text-right text-slate-500">{fmt(national.assisted_living)}/mo</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-3">Home Health Aide</td>
                <td className="px-4 py-3 text-right font-medium">${z.home_health_aide_hourly}/hr</td>
                <td className="px-4 py-3 text-right text-slate-500">${national.home_health_aide_hourly}/hr</td>
              </tr>
              <tr className="border-t bg-slate-50/50">
                <td className="px-4 py-3">Adult Day Care</td>
                <td className="px-4 py-3 text-right font-medium">{fmt(z.adult_day_care)}/mo</td>
                <td className="px-4 py-3 text-right text-slate-500">{fmt(national.adult_day_care)}/mo</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {z.care_affordability_pct && (
        <section className="mb-8 p-5 bg-amber-50 rounded-lg">
          <h2 className="text-lg font-bold text-slate-900 mb-2">Care Affordability</h2>
          <p className="text-sm text-slate-700">
            Assisted living in {z.zip_code} {z.city} costs approximately <strong>{z.care_affordability_pct}%</strong> of
            the area&apos;s median household income ({fmt(z.median_income)}/year).
            {z.care_affordability_pct > 50
              ? " This is a significant financial burden for most families."
              : " This is within a manageable range for median-income households."}
          </p>
        </section>
      )}

      <AdSlot id="middle" />

      {nearbyZips.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Other ZIP Codes in {state?.state || z.state}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {nearbyZips.map((nz) => (
              <a key={nz.zip_code} href={`/zip/${nz.slug}/`}
                className="block p-3 border border-slate-200 rounded-lg hover:border-teal-300 hover:shadow-sm transition-all text-sm">
                <span className="font-medium text-teal-700">{nz.zip_code}</span>{" "}
                <span className="text-slate-600">{nz.city}</span>
                <div className="text-xs text-slate-400 mt-1">Nursing: {fmt(nz.nursing_home_private)}/mo</div>
              </a>
            ))}
          </div>
        </section>
      )}

      <AdSlot id="bottom" />

      <section className="mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-4">FAQ</h2>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <details key={faq.question} className="border border-slate-200 rounded-lg">
              <summary className="px-4 py-3 font-medium cursor-pointer hover:bg-slate-50">{faq.question}</summary>
              <p className="px-4 pb-3 text-sm text-slate-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </article>
  );
}
