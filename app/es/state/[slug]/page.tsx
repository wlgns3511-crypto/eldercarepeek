import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllStates, getStateBySlug, getCitiesByState, getNationalAverages } from "@/lib/db";
import { formatCost, formatHourly, formatPercent, getDataYear } from "@/lib/format";

export const dynamicParams = true;
export const revalidate = 86400;

export function generateStaticParams() {
  return getAllStates().slice(0, 300).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const state = getStateBySlug(slug);
  if (!state) return {};
  const year = getDataYear();
  return {
    title: `Costos de Cuidado de Ancianos en ${state.state} (${year + 2})`,
    description: `Compare costos en ${state.state}: hogar de ancianos (${formatCost(state.nursing_home_private)}/mes), vivienda asistida (${formatCost(state.assisted_living)}/mes), asistencia en casa (${formatHourly(state.home_health_aide_hourly)}/hr).`,
    alternates: {
      canonical: `/es/state/${slug}`,
      languages: { en: `/state/${slug}`, es: `/es/state/${slug}`, "x-default": `/state/${slug}` },
    },
  };
}

export default async function StatePageEs({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const state = getStateBySlug(slug);
  if (!state) notFound();

  const cities = getCitiesByState(state.abbr);
  const natAvg = getNationalAverages();
  const year = getDataYear();

  const diffNursing = state.nursing_home_private - natAvg.nursing_home_private;
  const diffPctNursing = ((diffNursing / natAvg.nursing_home_private) * 100).toFixed(1);

  return (
    <div>
      <nav className="text-sm text-slate-500 mb-4">
        <a href="/es/" className="hover:text-teal-600">Inicio</a>
        {" > "}
        <span>{state.state}</span>
      </nav>

      <h1 className="text-3xl font-bold mb-2">
        Costos de Cuidado de Ancianos en {state.state} ({year + 2})
      </h1>
      <p className="text-slate-500 mb-2">
        Gu&iacute;a completa de costos de hogar de ancianos, vivienda asistida y cuidado en casa en {state.state}.
        {diffNursing > 0
          ? ` Los costos son ${diffPctNursing}% m&aacute;s altos que el promedio nacional.`
          : ` Los costos son ${Math.abs(Number(diffPctNursing))}% m&aacute;s bajos que el promedio nacional.`}
      </p>
      <p className="text-xs text-slate-400 mb-6">
        <a href={`/state/${slug}`} className="text-blue-500 hover:underline">English version</a>
      </p>

      {/* Resumen de costos */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="border border-teal-200 bg-teal-50 rounded-lg p-4">
          <h2 className="font-semibold text-teal-800 text-sm">Hogar de Ancianos (Privado)</h2>
          <p className="text-2xl font-bold text-teal-700">{formatCost(state.nursing_home_private)}<span className="text-sm font-normal text-slate-500">/mes</span></p>
          <p className="text-xs text-slate-500">Promedio nacional: {formatCost(natAvg.nursing_home_private)}</p>
        </div>
        <div className="border border-teal-200 bg-teal-50 rounded-lg p-4">
          <h2 className="font-semibold text-teal-800 text-sm">Hogar de Ancianos (Compartido)</h2>
          <p className="text-2xl font-bold text-teal-700">{formatCost(state.nursing_home_semi)}<span className="text-sm font-normal text-slate-500">/mes</span></p>
          <p className="text-xs text-slate-500">Promedio nacional: {formatCost(natAvg.nursing_home_semi)}</p>
        </div>
        <div className="border border-emerald-200 bg-emerald-50 rounded-lg p-4">
          <h2 className="font-semibold text-emerald-800 text-sm">Vivienda Asistida</h2>
          <p className="text-2xl font-bold text-emerald-700">{formatCost(state.assisted_living)}<span className="text-sm font-normal text-slate-500">/mes</span></p>
          <p className="text-xs text-slate-500">Promedio nacional: {formatCost(natAvg.assisted_living)}</p>
        </div>
        <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
          <h2 className="font-semibold text-blue-800 text-sm">Asistencia de Salud en Casa</h2>
          <p className="text-2xl font-bold text-blue-700">{formatHourly(state.home_health_aide_hourly)}<span className="text-sm font-normal text-slate-500">/hr</span></p>
          <p className="text-xs text-slate-500">{formatCost(state.home_health_aide_monthly)}/mes (8hr/d&iacute;a)</p>
        </div>
        <div className="border border-purple-200 bg-purple-50 rounded-lg p-4">
          <h2 className="font-semibold text-purple-800 text-sm">Guarder&iacute;a para Adultos</h2>
          <p className="text-2xl font-bold text-purple-700">{formatCost(state.adult_day_care)}<span className="text-sm font-normal text-slate-500">/mes</span></p>
          <p className="text-xs text-slate-500">Promedio nacional: {formatCost(natAvg.adult_day_care)}</p>
        </div>
        <div className="border border-rose-200 bg-rose-50 rounded-lg p-4">
          <h2 className="font-semibold text-rose-800 text-sm">Servicios Dom&eacute;sticos</h2>
          <p className="text-2xl font-bold text-rose-700">{formatHourly(state.homemaker_services_hourly)}<span className="text-sm font-normal text-slate-500">/hr</span></p>
          <p className="text-xs text-slate-500">{formatCost(state.homemaker_services_monthly)}/mes (8hr/d&iacute;a)</p>
        </div>
      </div>

      {/* Costos por ciudad */}
      {cities.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">Costos por Ciudad en {state.state}</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-100">
                  <th className="text-left p-3 font-semibold">Ciudad</th>
                  <th className="text-right p-3 font-semibold">Hogar de Ancianos</th>
                  <th className="text-right p-3 font-semibold">Vivienda Asistida</th>
                  <th className="text-right p-3 font-semibold">Asistencia en Casa</th>
                </tr>
              </thead>
              <tbody>
                {cities.map((city) => (
                  <tr key={city.slug} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="p-3">{city.city_name}</td>
                    <td className="p-3 text-right">{formatCost(city.nursing_home_private)}/mes</td>
                    <td className="p-3 text-right">{formatCost(city.assisted_living)}/mes</td>
                    <td className="p-3 text-right">{formatHourly(city.home_health_aide_hourly)}/hr</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Demograf&iacute;a */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3">Demograf&iacute;a de Adultos Mayores en {state.state}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="border border-slate-200 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-slate-800">{formatPercent(state.senior_population_pct)}</p>
            <p className="text-sm text-slate-500">Poblaci&oacute;n 65+</p>
          </div>
          <div className="border border-slate-200 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-slate-800">{formatCost(state.median_household_income)}</p>
            <p className="text-sm text-slate-500">Ingreso Familiar Mediano</p>
          </div>
          <div className="border border-slate-200 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-slate-800">{formatCost(state.nursing_home_private * 12)}</p>
            <p className="text-sm text-slate-500">Costo Anual Hogar de Ancianos</p>
          </div>
        </div>
      </section>

      <section className="mt-6 p-4 bg-slate-50 rounded-lg">
        <h3 className="text-sm font-semibold text-slate-500 mb-2">Recursos Relacionados</h3>
        <div className="flex flex-wrap gap-3 text-sm">
          <a href="https://medcheckwize.com" className="text-teal-600 hover:underline">Costos de Medicare por Estado</a>
          <a href="https://costbycity.com" className="text-teal-600 hover:underline">Costo de Vida</a>
        </div>
      </section>
    </div>
  );
}
