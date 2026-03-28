import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllCityComparisonSlugs, getCityComparisonBySlug, getNationalAverages } from "@/lib/db";
import { formatCost, formatHourly } from "@/lib/format";
import { AdSlot } from "@/components/AdSlot";
import { Breadcrumb } from "@/components/Breadcrumb";
import { faqSchema, breadcrumbSchema } from "@/lib/schema";

interface Props { params: Promise<{ slug: string }> }

export const dynamicParams = true;
export const revalidate = 86400;

export async function generateStaticParams() {
  return getAllCityComparisonSlugs(300).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = getCityComparisonBySlug(slug);
  if (!data) return {};
  const { a, b } = data;
  return {
    title: `${a.city_name}, ${a.state_abbr} vs ${b.city_name}, ${b.state_abbr} Senior Care Costs 2025`,
    description: `Compare elder care costs: ${a.city_name} nursing home ${formatCost(a.nursing_home_private)}/mo vs ${b.city_name} ${formatCost(b.nursing_home_private)}/mo. Assisted living, home health aide, and adult day care compared.`,
    alternates: { canonical: `/city-compare/${slug}/` },
  };
}

export default async function CityComparePage({ params }: Props) {
  const { slug } = await params;
  const data = getCityComparisonBySlug(slug);
  if (!data) notFound();
  const { a, b } = data;
  const national = getNationalAverages();

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "City Compare", href: "/city-compare/" },
    { label: `${a.city_name} vs ${b.city_name}`, href: `/city-compare/${slug}/` },
  ];
  const schemaBreadcrumbs = [
    { name: "Home", url: "/" },
    { name: "City Compare", url: "/city-compare/" },
    { name: `${a.city_name} vs ${b.city_name}`, url: `/city-compare/${slug}/` },
  ];

  const rows = [
    { label: "Nursing Home (Private)", aVal: formatCost(a.nursing_home_private), bVal: formatCost(b.nursing_home_private), natVal: formatCost(national.nursing_home_private), unit: "/mo" },
    { label: "Assisted Living", aVal: formatCost(a.assisted_living), bVal: formatCost(b.assisted_living), natVal: formatCost(national.assisted_living), unit: "/mo" },
    { label: "Home Health Aide", aVal: formatHourly(a.home_health_aide_hourly), bVal: formatHourly(b.home_health_aide_hourly), natVal: formatHourly(national.home_health_aide_hourly), unit: "/hr" },
    { label: "Adult Day Care", aVal: formatCost(a.adult_day_care), bVal: formatCost(b.adult_day_care), natVal: formatCost(national.adult_day_care), unit: "/mo" },
  ];

  const cheaper = a.nursing_home_private <= b.nursing_home_private ? a : b;
  const pricier = a.nursing_home_private > b.nursing_home_private ? a : b;
  const diff = Math.abs(a.nursing_home_private - b.nursing_home_private);

  const faqs = [
    {
      question: `Is ${a.city_name} or ${b.city_name} cheaper for senior care?`,
      answer: `${cheaper.city_name}, ${cheaper.state_abbr} is cheaper for nursing home care at ${formatCost(cheaper.nursing_home_private)}/mo vs ${formatCost(pricier.nursing_home_private)}/mo in ${pricier.city_name}, ${pricier.state_abbr} — a difference of ${formatCost(diff)}/mo.`,
    },
    {
      question: `What does assisted living cost in ${a.city_name} vs ${b.city_name}?`,
      answer: `Assisted living in ${a.city_name}, ${a.state_abbr} costs ${formatCost(a.assisted_living)}/mo. In ${b.city_name}, ${b.state_abbr} it costs ${formatCost(b.assisted_living)}/mo. The national average is ${formatCost(national.assisted_living)}/mo.`,
    },
    {
      question: `What is the home health aide rate in ${a.city_name} vs ${b.city_name}?`,
      answer: `Home health aides in ${a.city_name}, ${a.state_abbr} charge ${formatHourly(a.home_health_aide_hourly)}/hr. In ${b.city_name}, ${b.state_abbr} the rate is ${formatHourly(b.home_health_aide_hourly)}/hr.`,
    },
    {
      question: `How do ${a.city_name} senior care costs compare to the national average?`,
      answer: `The national average nursing home cost is ${formatCost(national.nursing_home_private)}/mo. ${a.city_name}, ${a.state_abbr} at ${formatCost(a.nursing_home_private)}/mo is ${a.nursing_home_private > national.nursing_home_private ? 'above' : 'below'} average. ${b.city_name}, ${b.state_abbr} at ${formatCost(b.nursing_home_private)}/mo is ${b.nursing_home_private > national.nursing_home_private ? 'above' : 'below'} average.`,
    },
  ];

  return (
    <div>
      <Breadcrumb items={breadcrumbs} />
      <h1 className="text-3xl font-bold mb-2 mt-4">
        {a.city_name}, {a.state_abbr} vs {b.city_name}, {b.state_abbr}
      </h1>
      <p className="text-slate-600 mb-8">Elder Care Cost Comparison 2025</p>

      <AdSlot id="city-compare-top" />

      <div className="bg-teal-50 rounded-xl p-6 mb-8">
        <h2 className="font-semibold mb-3">Quick Answer</h2>
        <p className="text-slate-700">
          <strong>{a.city_name}, {a.state_abbr}</strong>: Nursing home {formatCost(a.nursing_home_private)}/mo ·
          Assisted living {formatCost(a.assisted_living)}/mo · Home aide {formatHourly(a.home_health_aide_hourly)}/hr
        </p>
        <p className="text-slate-700 mt-2">
          <strong>{b.city_name}, {b.state_abbr}</strong>: Nursing home {formatCost(b.nursing_home_private)}/mo ·
          Assisted living {formatCost(b.assisted_living)}/mo · Home aide {formatHourly(b.home_health_aide_hourly)}/hr
        </p>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Side-by-Side Cost Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="p-3 text-left border border-slate-200">Care Type</th>
                <th className="p-3 text-left border border-slate-200 text-teal-700">{a.city_name}, {a.state_abbr}</th>
                <th className="p-3 text-left border border-slate-200 text-teal-700">{b.city_name}, {b.state_abbr}</th>
                <th className="p-3 text-left border border-slate-200 text-slate-500">National Avg</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="p-3 border border-slate-200 font-medium">{row.label}</td>
                  <td className="p-3 border border-slate-200">{row.aVal}<span className="text-slate-400 text-xs">{row.unit}</span></td>
                  <td className="p-3 border border-slate-200">{row.bVal}<span className="text-slate-400 text-xs">{row.unit}</span></td>
                  <td className="p-3 border border-slate-200 text-slate-500">{row.natVal}<span className="text-slate-400 text-xs">{row.unit}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {[a, b].map((city) => (
          <div key={city.slug} className="border border-slate-200 rounded-xl p-5">
            <h3 className="font-bold text-lg mb-3">{city.city_name}, {city.state_abbr}</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-slate-600">Nursing Home</dt><dd className="font-semibold">{formatCost(city.nursing_home_private)}/mo</dd></div>
              <div className="flex justify-between"><dt className="text-slate-600">Assisted Living</dt><dd className="font-semibold">{formatCost(city.assisted_living)}/mo</dd></div>
              <div className="flex justify-between"><dt className="text-slate-600">Home Health Aide</dt><dd className="font-semibold">{formatHourly(city.home_health_aide_hourly)}/hr</dd></div>
              <div className="flex justify-between"><dt className="text-slate-600">Adult Day Care</dt><dd className="font-semibold">{formatCost(city.adult_day_care)}/mo</dd></div>
            </dl>
            <a href={`/city/${city.slug}/`} className="mt-4 block text-center text-sm text-teal-600 hover:underline border border-teal-200 rounded-lg py-2">
              Full {city.city_name} profile →
            </a>
          </div>
        ))}
      </div>

      <AdSlot id="city-compare-mid" />

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
        {faqs.map((faq, i) => (
          <details key={i} className="border border-slate-200 rounded-lg mb-2" open={i === 0}>
            <summary className="p-4 cursor-pointer font-medium">{faq.question}</summary>
            <div className="px-4 pb-4 text-slate-600 text-sm">{faq.answer}</div>
          </details>
        ))}
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(schemaBreadcrumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqs)) }} />
    </div>
  );
}
