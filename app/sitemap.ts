import type { MetadataRoute } from "next";
import { getAllStates, getAllCities, getCareTypes, getTopComparisons, getAllCityComparisonSlugs, getAllZipEldercare } from "@/lib/db";
import { getAllPosts } from "@/lib/blog";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://eldercarepeek.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const states = getAllStates();
  const cities = getAllCities();
  const careTypes = getCareTypes();
  const comparisons = getTopComparisons(200);

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1.0 },
    { url: `${SITE_URL}/calculator/`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/about/`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/privacy/`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/terms/`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/contact/`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const statePages: MetadataRoute.Sitemap = states.map((s) => ({
    url: `${SITE_URL}/state/${s.slug}/`,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  const cityPages: MetadataRoute.Sitemap = cities.map((c) => ({
    url: `${SITE_URL}/city/${c.slug}/`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const carePages: MetadataRoute.Sitemap = careTypes.map((ct) => ({
    url: `${SITE_URL}/care/${ct.slug}/`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const comparisonPages: MetadataRoute.Sitemap = comparisons.map((c) => ({
    url: `${SITE_URL}/compare/${c.slug_a}-vs-${c.slug_b}-senior-care/`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const cityComparisonPages: MetadataRoute.Sitemap = getAllCityComparisonSlugs(11175).map((c) => ({
    url: `${SITE_URL}/city-compare/${c.slug}/`,
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  const zipPages: MetadataRoute.Sitemap = getAllZipEldercare().map((z) => ({
    url: `${SITE_URL}/zip/${z.slug}/`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const blogPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/blog/`, changeFrequency: "weekly" as const, priority: 0.8 },
    ...posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}/`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      lastModified: p.updatedAt ?? p.publishedAt,
    })),
  ];

  const entries: MetadataRoute.Sitemap = [...staticPages, ...statePages, ...cityPages, ...carePages, ...comparisonPages, ...cityComparisonPages, ...zipPages, ...blogPages];

  // Safety: Google limit is 50,000 URLs per sitemap
  if (entries.length > 50000) {
    return entries.slice(0, 50000);
  }

  return entries;
}
