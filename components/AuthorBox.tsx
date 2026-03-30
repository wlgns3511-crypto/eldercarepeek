export function AuthorBox() {
  return (
    <div className="mt-10 flex gap-4 p-5 bg-teal-50 border-teal-200 border rounded-xl">
      <div className="flex-shrink-0 w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-2xl">
        <span>🏥</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="font-semibold text-slate-900 text-sm">ElderCarePeek Editorial Team</span>
          <span className="text-xs px-2 py-0.5 bg-teal-100 text-teal-800 rounded-full font-medium">Senior Living & Elder Care Research</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed mb-2">
          Our team of elder care specialists, social workers, and healthcare cost analysts tracks nursing home rates, assisted living costs, and Medicare/Medicaid data across all 50 states. Data sourced from Genworth surveys, CMS Medicare data, and state regulatory filings.
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs bg-teal-100 text-teal-800 px-2 py-0.5 rounded">✓ CMS Data Verified</span>
          <span className="text-xs bg-teal-100 text-teal-800 px-2 py-0.5 rounded">✓ Annual Survey Updated</span>
          <span className="text-xs bg-teal-100 text-teal-800 px-2 py-0.5 rounded">✓ 50-State Coverage</span>
        </div>
      </div>
    </div>
  );
}
