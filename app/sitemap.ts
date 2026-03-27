import type { MetadataRoute } from "next";
import { getAllStates, getAllCities, getCareTypes, getTopComparisons } from "@/lib/db";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://eldercarepeek.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const states = getAllStates();
  const cities = getAllCities();
  const careTypes = getCareTypes();
  const comparisons = getTopComparisons(200);

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1.0 },
    { url: `${SITE_URL}/calculator`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/about`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const statePages: MetadataRoute.Sitemap = states.map((s) => ({
    url: `${SITE_URL}/state/${s.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  const cityPages: MetadataRoute.Sitemap = cities.map((c) => ({
    url: `${SITE_URL}/city/${c.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const carePages: MetadataRoute.Sitemap = careTypes.map((ct) => ({
    url: `${SITE_URL}/care/${ct.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const comparisonPages: MetadataRoute.Sitemap = comparisons.map((c) => ({
    url: `${SITE_URL}/compare/${c.slug_a}-vs-${c.slug_b}-senior-care`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...statePages, ...cityPages, ...carePages, ...comparisonPages];
}
