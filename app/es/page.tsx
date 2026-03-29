import type { Metadata } from "next";
import { getAllStates, getNationalAverages } from "@/lib/db";
import { formatCost, getDataYear } from "@/lib/format";

export const metadata: Metadata = {
  title: "ElderCarePeek - Costos de Cuidado de Ancianos en EE.UU.",
  description: "Compare costos de cuidado de ancianos en los 50 estados. Hogar de ancianos, vivienda asistida, asistencia en casa y m&aacute;s.",
  alternates: {
    canonical: "/es/",
    languages: { en: "/", es: "/es/", "x-default": "/" },
  },
};

export default function HomeEs() {
  const states = getAllStates();
  const natAvg = getNationalAverages();
  const year = getDataYear();

  return (
    <>
      <h1 className="text-3xl font-bold text-slate-900 mb-4">
        Costos de Cuidado de Ancianos en EE.UU. ({year + 2})
      </h1>
      <p className="text-slate-600 mb-2">
        Compare costos de cuidado de ancianos en los 50 estados. Hogar de ancianos, vivienda asistida,
        asistencia de salud en casa y m&aacute;s.
      </p>
      <p className="text-xs text-slate-400 mb-8">
        <a href="/" className="text-blue-500 hover:underline">English version</a>
      </p>

      {/* Promedios nacionales */}
      <section className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="border border-teal-200 bg-teal-50 rounded-lg p-4 text-center">
          <div className="text-xs text-slate-500 uppercase">Hogar de Ancianos (Privado)</div>
          <div className="text-2xl font-bold text-teal-700">{formatCost(natAvg.nursing_home_private)}<span className="text-sm font-normal">/mes</span></div>
        </div>
        <div className="border border-emerald-200 bg-emerald-50 rounded-lg p-4 text-center">
          <div className="text-xs text-slate-500 uppercase">Vivienda Asistida</div>
          <div className="text-2xl font-bold text-emerald-700">{formatCost(natAvg.assisted_living)}<span className="text-sm font-normal">/mes</span></div>
        </div>
        <div className="border border-blue-200 bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-xs text-slate-500 uppercase">Guard&iacute;a para Adultos</div>
          <div className="text-2xl font-bold text-blue-700">{formatCost(natAvg.adult_day_care)}<span className="text-sm font-normal">/mes</span></div>
        </div>
      </section>

      {/* Todos los estados */}
      <section>
        <h2 className="text-xl font-bold mb-4">Costos por Estado</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {states.map((s) => (
            <a
              key={s.slug}
              href={`/es/state/${s.slug}`}
              className="p-3 border border-slate-200 rounded-lg hover:border-teal-300 hover:shadow-sm transition-all text-center"
            >
              <div className="font-medium text-sm">{s.state}</div>
              <div className="text-xs text-slate-500 mt-1">{formatCost(s.nursing_home_private)}/mes</div>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
