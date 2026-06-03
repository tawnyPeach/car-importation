import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import countries from "@/data/countries.json";
import cars from "@/data/cars.json";
import { calculateImportCost } from "@/lib/calculator";
import Breadcrumbs from "@/components/Breadcrumbs";

const CATEGORIES = ["sedan", "suv", "hatchback", "luxury", "compact"] as const;
type Category = (typeof CATEGORIES)[number];

const CATEGORY_LABELS: Record<Category, { en: string; fr: string }> = {
  sedan: { en: "Sedan", fr: "Berline" },
  suv: { en: "SUV", fr: "SUV" },
  hatchback: { en: "Hatchback", fr: "Compacte" },
  luxury: { en: "Luxury", fr: "Luxe" },
  compact: { en: "Compact", fr: "Citadine" },
};

export function generateStaticParams() {
  const params: { lang: string; "country-slug": string; category: string }[] = [];
  for (const lang of ["en", "fr"]) {
    for (const country of countries) {
      for (const category of CATEGORIES) {
        params.push({
          lang,
          "country-slug": country.slug,
          category,
        });
      }
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; "country-slug": string; category: string }>;
}): Promise<Metadata> {
  const { "country-slug": countrySlug, category, lang } = await params;
  const country = countries.find((c) => c.slug === countrySlug);

  if (!country || !CATEGORIES.includes(category as Category)) {
    return { title: "Not Found" };
  }

  const categoryLabel = CATEGORY_LABELS[category as Category][lang as "en" | "fr"] || category;
  const title = `Import ${categoryLabel} Cars to ${country.name} - Prices & Costs`;
  const description =
    lang === "fr"
      ? `Decouvrez les couts d'importation de voitures ${categoryLabel.toLowerCase()} vers ${country.name}. Prix, droits de douane, TVA et frais inclus.`
      : `Discover import costs for ${categoryLabel.toLowerCase()} cars to ${country.name}. Prices include customs duty, VAT, and fees.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ lang: string; "country-slug": string; category: string }>;
}) {
  const { lang, "country-slug": countrySlug, category } = await params;
  const country = countries.find((c) => c.slug === countrySlug);

  if (!country || !CATEGORIES.includes(category as Category)) {
    notFound();
  }

  const categoryLabel = CATEGORY_LABELS[category as Category][lang as "en" | "fr"] || category;

  const breadcrumbs = [
    { label: lang === "fr" ? "Accueil" : "Home", href: `/${lang}` },
    { label: country.name, href: `/${lang}/${countrySlug}` },
    {
      label: lang === "fr" ? `Voitures ${categoryLabel}` : `${categoryLabel} Cars`,
      href: `/${lang}/${countrySlug}/import-${category}`,
    },
  ];

  // Filter cars by category and calculate costs
  const categoryCars = cars
    .filter((car) => car.category === category)
    .map((car) => {
      const cost = calculateImportCost(
        car.averagePrice,
        car.ageEstimate,
        car.fuelType as "petrol" | "diesel",
        countrySlug
      );
      return { car, cost };
    })
    .sort((a, b) => a.cost.totalEUR - b.cost.totalEUR);

  // Other categories for internal linking
  const otherCategories = CATEGORIES.filter((c) => c !== category);

  // Schema.org ItemList JSON-LD
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${categoryLabel} Cars to Import to ${country.name}`,
    numberOfItems: categoryCars.length,
    itemListElement: categoryCars.map(({ car, cost }, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: car.name,
      url: `https://carimport.com/${lang}/${countrySlug}/import/${car.slug}`,
      item: {
        "@type": "Product",
        name: car.name,
        brand: {
          "@type": "Brand",
          name: car.brand,
        },
        offers: {
          "@type": "Offer",
          price: cost.totalEUR,
          priceCurrency: "EUR",
        },
      },
    })),
  };

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      {/* Hero */}
      <section className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1a1f36] mb-4">
          {lang === "fr"
            ? `Importer des voitures ${categoryLabel} vers ${country.name}`
            : `Import ${categoryLabel} Cars to ${country.name}`}
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl">
          {lang === "fr"
            ? `Explorez ${categoryCars.length} voiture(s) ${categoryLabel.toLowerCase()} disponible(s) a l'importation vers ${country.name}. Tous les prix incluent les droits de douane, la TVA et les frais.`
            : `Explore ${categoryCars.length} ${categoryLabel.toLowerCase()} car(s) available for import to ${country.name}. All prices include customs duty, VAT, and fees.`}
        </p>
      </section>

      {/* Car Grid */}
      {categoryCars.length > 0 ? (
        <section className="mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categoryCars.map(({ car, cost }) => (
              <Link
                key={car.slug}
                href={`/${lang}/${countrySlug}/import/${car.slug}`}
                className="group block bg-white rounded-xl shadow-md border border-gray-100 p-5 hover:shadow-xl hover:border-[#f59e0b]/30 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#f59e0b]/10 text-[#f59e0b] uppercase">
                    {categoryLabel}
                  </span>
                  <span className="text-xs text-gray-400">{car.brand}</span>
                </div>
                <h3 className="font-semibold text-[#1a1f36] group-hover:text-[#10b981] transition-colors mb-1">
                  {car.name}
                </h3>
                <div className="flex items-center justify-between mt-3">
                  <div>
                    <p className="text-xs text-gray-400">
                      {lang === "fr" ? "Prix EU" : "EU Price"}
                    </p>
                    <span className="text-sm font-medium text-gray-700">
                      &euro;{car.averagePrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">
                      {lang === "fr" ? "Cout total" : "Total Cost"}
                    </p>
                    <span className="text-lg font-bold text-[#10b981]">
                      &euro;{cost.totalEUR.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {cost.totalLocal.toLocaleString()} {cost.currency}
                  </span>
                  <span className="text-xs text-gray-400">
                    {car.fuelType === "petrol"
                      ? lang === "fr"
                        ? "Essence"
                        : "Petrol"
                      : "Diesel"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <section className="mb-12">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 text-center">
            <p className="text-gray-600 text-lg">
              {lang === "fr"
                ? `Aucune voiture ${categoryLabel.toLowerCase()} disponible pour ${country.name}.`
                : `No ${categoryLabel.toLowerCase()} cars available for ${country.name}.`}
            </p>
          </div>
        </section>
      )}

      {/* Other Categories */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-[#1a1f36] mb-4">
          {lang === "fr" ? "Autres categories" : "Other Categories"}
        </h2>
        <div className="flex flex-wrap gap-2">
          {otherCategories.map((cat) => {
            const label = CATEGORY_LABELS[cat][lang as "en" | "fr"] || cat;
            return (
              <Link
                key={cat}
                href={`/${lang}/${countrySlug}/import-${cat}`}
                className="inline-block px-4 py-2 bg-white border border-gray-200 rounded-lg text-[#1a1f36] font-medium hover:border-[#f59e0b] hover:text-[#f59e0b] transition"
              >
                {label}
              </Link>
            );
          })}
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
    </>
  );
}
