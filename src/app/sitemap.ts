import type { MetadataRoute } from "next";
import countries from "@/data/countries.json";
import cars from "@/data/cars.json";
import articles from "@/data/blog-articles.json";

const BASE_URL = "https://car-importation.vercel.app";

const BUDGET_TIERS = [5000, 10000, 15000, 20000, 25000, 30000, 40000, 50000, 80000];
const CATEGORIES = ["sedan", "suv", "hatchback", "luxury", "compact"];
const BRANDS = [...new Set(cars.map((car) => car.brand))];

function brandToSlug(brand: string): string {
  return brand.toLowerCase().replace(/\s+/g, "-");
}

export default function sitemap(): MetadataRoute.Sitemap {
  const langs = ["en", "fr"];
  const entries: MetadataRoute.Sitemap = [];

  // Homepage
  for (const lang of langs) {
    entries.push({
      url: `${BASE_URL}/${lang}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    });
  }

  // Calculator
  for (const lang of langs) {
    entries.push({
      url: `${BASE_URL}/${lang}/calculator`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  // Blog index
  for (const lang of langs) {
    entries.push({
      url: `${BASE_URL}/${lang}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  // Blog articles
  for (const lang of langs) {
    for (const article of articles) {
      entries.push({
        url: `${BASE_URL}/${lang}/blog/${article.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  // Country pages
  for (const lang of langs) {
    for (const country of countries) {
      entries.push({
        url: `${BASE_URL}/${lang}/${country.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.9,
      });
    }
  }

  // Car import pages
  for (const lang of langs) {
    for (const country of countries) {
      for (const car of cars) {
        entries.push({
          url: `${BASE_URL}/${lang}/${country.slug}/import/${car.slug}`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.8,
        });
      }
    }
  }

  // Budget pages
  for (const lang of langs) {
    for (const country of countries) {
      for (const budget of BUDGET_TIERS) {
        entries.push({
          url: `${BASE_URL}/${lang}/${country.slug}/cars-under-${budget}`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    }
  }

  // Category pages
  for (const lang of langs) {
    for (const country of countries) {
      for (const category of CATEGORIES) {
        entries.push({
          url: `${BASE_URL}/${lang}/${country.slug}/import-${category}`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    }
  }

  // Brand pages
  for (const lang of langs) {
    for (const country of countries) {
      for (const brand of BRANDS) {
        entries.push({
          url: `${BASE_URL}/${lang}/${country.slug}/brand/${brandToSlug(brand)}`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    }
  }

  return entries;
}
