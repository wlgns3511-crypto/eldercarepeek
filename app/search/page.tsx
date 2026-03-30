import type { Metadata } from 'next';
import { searchStates, searchCities, getCareTypes, getAllStates } from '@/lib/db';
import { formatCost, formatHourly } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Search Elder Care Costs - Nursing Homes, Assisted Living & More',
  description: 'Search elder care costs by state or city. Find nursing home rates, assisted living costs, and home health aide prices across the US.',
  alternates: { canonical: '/search/' },
};

const POPULAR_SEARCHES = [
  'California', 'Florida', 'Texas', 'New York', 'nursing home',
  'assisted living', 'home health aide', 'Arizona', 'Colorado',
];

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = '' } = await searchParams;
  const query = q.trim();

  const stateResults = query.length >= 2 ? searchStates(query, 10) : [];
  const cityResults = query.length >= 2 ? searchCities(query, 20) : [];
  const totalResults = stateResults.length + cityResults.length;

  const careTypes = getCareTypes();
  const featuredStates = !query ? getAllStates().slice(0, 12) : [];

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Search Elder Care Costs</h1>
      <p className="text-slate-600 mb-6">Find nursing home, assisted living, and home care costs by state or city.</p>

      {/* Search form */}
      <form method="GET" action="/search/" className="mb-8">
        <div className="flex gap-2">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search by state name or city..."
            className="flex-1 border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            autoFocus={!query}
          />
          <button
            type="submit"
            className="bg-teal-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* Care type quick links */}
      <div className="mb-8">
        <p className="text-sm font-semibold text-slate-500 mb-3">Browse by Care Type</p>
        <div className="flex flex-wrap gap-2">
          {careTypes.map(ct => (
            <a
              key={ct.slug}
              href={`/care/${ct.slug}`}
              className="text-sm px-3 py-1.5 bg-teal-50 text-teal-700 border border-teal-200 rounded-full hover:bg-teal-100 transition-colors"
            >
              {ct.name}
            </a>
          ))}
        </div>
      </div>

      {/* Popular searches */}
      {!query && (
        <div className="mb-8">
          <p className="text-sm font-semibold text-slate-500 mb-3">Popular Searches</p>
          <div className="flex flex-wrap gap-2">
            {POPULAR_SEARCHES.map(term => (
              <a
                key={term}
                href={`/search/?q=${encodeURIComponent(term)}`}
                className="text-sm px-3 py-1.5 bg-slate-100 text-slate-600 border border-slate-200 rounded-full hover:bg-slate-200 transition-colors"
              >
                {term}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {query.length >= 2 && (
        <div>
          <p className="text-sm text-slate-500 mb-4">
            {totalResults > 0
              ? `Found ${totalResults} result${totalResults !== 1 ? 's' : ''} for "${query}"`
              : `No results found for "${query}"`}
          </p>

          {stateResults.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-3">States</h2>
              <div className="space-y-3">
                {stateResults.map(state => (
                  <a
                    key={state.slug}
                    href={`/state/${state.slug}`}
                    className="block border border-slate-200 rounded-xl p-4 hover:border-teal-300 hover:bg-teal-50 transition-colors"
                  >
                    <div className="font-semibold text-slate-900 mb-2">{state.state}</div>
                    <div className="flex flex-wrap gap-4 text-xs text-slate-600">
                      <span>Nursing Home: <strong>{formatCost(state.nursing_home_private)}/mo</strong></span>
                      <span>Assisted Living: <strong>{formatCost(state.assisted_living)}/mo</strong></span>
                      <span>Home Health Aide: <strong>{formatHourly(state.home_health_aide_hourly)}/hr</strong></span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {cityResults.length > 0 && (
            <div>
              <h2 className="text-lg font-bold mb-3">Cities</h2>
              <div className="space-y-3">
                {cityResults.map(city => (
                  <a
                    key={city.slug}
                    href={`/city/${city.slug}`}
                    className="block border border-slate-200 rounded-xl p-4 hover:border-teal-300 hover:bg-teal-50 transition-colors"
                  >
                    <div className="font-semibold text-slate-900 mb-2">{city.city_name}, {city.state_abbr}</div>
                    <div className="flex flex-wrap gap-4 text-xs text-slate-600">
                      <span>Nursing Home: <strong>{formatCost(city.nursing_home_private)}/mo</strong></span>
                      <span>Assisted Living: <strong>{formatCost(city.assisted_living)}/mo</strong></span>
                      <span>Home Health Aide: <strong>{formatHourly(city.home_health_aide_hourly)}/hr</strong></span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {totalResults === 0 && (
            <div className="text-center py-12 text-slate-500">
              <p className="text-lg mb-2">No results found</p>
              <p className="text-sm">Try searching for a state name like "California" or "Texas"</p>
            </div>
          )}
        </div>
      )}

      {query.length === 1 && (
        <p className="text-sm text-slate-500">Please enter at least 2 characters to search.</p>
      )}

      {/* Featured states when no query */}
      {!query && featuredStates.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Browse All States</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {featuredStates.map(state => (
              <a
                key={state.slug}
                href={`/state/${state.slug}`}
                className="block border border-slate-200 rounded-lg p-3 hover:border-teal-300 hover:bg-teal-50 transition-colors"
              >
                <div className="font-medium text-slate-900 text-sm">{state.state}</div>
                <div className="text-xs text-slate-500 mt-1">{formatCost(state.nursing_home_private)}/mo avg</div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
