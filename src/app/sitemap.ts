import type { MetadataRoute } from "next";
import cars from "@/data/cars.json";

const BASE_URL = "https://morocco-car-import.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = "2024-01-15";

  const carPages = cars.map((car) => ({
    url: `${BASE_URL}/import/${car.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/calculator`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...carPages,
  ];
}
