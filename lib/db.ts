import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'eldercare.db');

let _db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH, { readonly: true, fileMustExist: true });
  }
  return _db;
}

// --- Types ---

export interface State {
  state: string;
  abbr: string;
  slug: string;
  nursing_home_private: number;
  nursing_home_semi: number;
  assisted_living: number;
  home_health_aide_hourly: number;
  home_health_aide_monthly: number;
  adult_day_care: number;
  homemaker_services_hourly: number;
  homemaker_services_monthly: number;
  median_household_income: number;
  senior_population_pct: number;
  medicaid_coverage_notes: string;
}

export interface City {
  id: number;
  city_name: string;
  state_abbr: string;
  slug: string;
  nursing_home_private: number;
  assisted_living: number;
  home_health_aide_hourly: number;
  adult_day_care: number;
}

export interface CareType {
  id: number;
  name: string;
  slug: string;
  description: string;
  avg_national_cost: number;
  what_included: string;
  who_needs_it: string;
}

export interface Comparison {
  id: number;
  slug_a: string;
  slug_b: string;
  state_a: string;
  state_b: string;
  popularity_score: number;
}

// --- State queries ---

export function getAllStates(): State[] {
  return getDb().prepare('SELECT * FROM states ORDER BY state').all() as State[];
}

export function getStateBySlug(slug: string): State | undefined {
  return getDb().prepare('SELECT * FROM states WHERE slug = ?').get(slug) as State | undefined;
}

export function getStateByAbbr(abbr: string): State | undefined {
  return getDb().prepare('SELECT * FROM states WHERE abbr = ?').get(abbr) as State | undefined;
}

export function getHighestCostStates(limit = 10): State[] {
  return getDb().prepare('SELECT * FROM states ORDER BY nursing_home_private DESC LIMIT ?').all(limit) as State[];
}

export function getLowestCostStates(limit = 10): State[] {
  return getDb().prepare('SELECT * FROM states ORDER BY nursing_home_private ASC LIMIT ?').all(limit) as State[];
}

// --- City queries ---

export function getCitiesByState(stateAbbr: string): City[] {
  return getDb().prepare('SELECT * FROM cities WHERE state_abbr = ? ORDER BY city_name').all(stateAbbr) as City[];
}

export function getCityBySlug(slug: string): City | undefined {
  return getDb().prepare('SELECT * FROM cities WHERE slug = ?').get(slug) as City | undefined;
}

export function getAllCities(): City[] {
  return getDb().prepare('SELECT * FROM cities ORDER BY city_name').all() as City[];
}

// --- Care type queries ---

export function getCareTypes(): CareType[] {
  return getDb().prepare('SELECT * FROM care_types ORDER BY id').all() as CareType[];
}

export function getCareTypeBySlug(slug: string): CareType | undefined {
  return getDb().prepare('SELECT * FROM care_types WHERE slug = ?').get(slug) as CareType | undefined;
}

// --- Comparison queries ---

export function getTopComparisons(limit = 200): Comparison[] {
  return getDb().prepare('SELECT * FROM comparisons ORDER BY popularity_score DESC LIMIT ?').all(limit) as Comparison[];
}

export function getComparisonBySlugs(slugA: string, slugB: string): Comparison | undefined {
  return getDb().prepare(
    'SELECT * FROM comparisons WHERE (slug_a = ? AND slug_b = ?) OR (slug_a = ? AND slug_b = ?)'
  ).get(slugA, slugB, slugB, slugA) as Comparison | undefined;
}

// --- Aggregate queries ---

export function getNationalAverages(): {
  nursing_home_private: number;
  nursing_home_semi: number;
  assisted_living: number;
  home_health_aide_hourly: number;
  adult_day_care: number;
  homemaker_services_hourly: number;
} {
  return getDb().prepare(`
    SELECT
      ROUND(AVG(nursing_home_private)) as nursing_home_private,
      ROUND(AVG(nursing_home_semi)) as nursing_home_semi,
      ROUND(AVG(assisted_living)) as assisted_living,
      ROUND(AVG(home_health_aide_hourly), 2) as home_health_aide_hourly,
      ROUND(AVG(adult_day_care)) as adult_day_care,
      ROUND(AVG(homemaker_services_hourly), 2) as homemaker_services_hourly
    FROM states
  `).get() as {
    nursing_home_private: number;
    nursing_home_semi: number;
    assisted_living: number;
    home_health_aide_hourly: number;
    adult_day_care: number;
    homemaker_services_hourly: number;
  };
}

export function getStatesRankedByCareType(careType: 'nursing_home_private' | 'assisted_living' | 'home_health_aide_hourly' | 'adult_day_care' | 'homemaker_services_hourly'): State[] {
  return getDb().prepare(`SELECT * FROM states ORDER BY ${careType} DESC`).all() as State[];
}

// --- City Comparison queries ---

export interface CityComparison {
  id: number;
  slug: string;
  city_a_slug: string;
  city_b_slug: string;
}

export function getAllCityComparisonSlugs(limit = 50000): CityComparison[] {
  return getDb().prepare('SELECT * FROM city_comparisons ORDER BY id LIMIT ?').all(limit) as CityComparison[];
}

export function getCityComparisonBySlug(slug: string): { a: City; b: City } | undefined {
  const row = getDb().prepare('SELECT city_a_slug, city_b_slug FROM city_comparisons WHERE slug = ?').get(slug) as { city_a_slug: string; city_b_slug: string } | undefined;
  if (!row) return undefined;
  const a = getCityBySlug(row.city_a_slug);
  const b = getCityBySlug(row.city_b_slug);
  if (!a || !b) return undefined;
  return { a, b };
}
