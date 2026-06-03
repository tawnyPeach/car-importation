import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import countries from "@/data/countries.json";
import cars from "@/data/cars.json";
import { calculateWithLiveRates } from "@/lib/calculate-with-live-rates";
import Breadcrumbs from "@/components/Breadcrumbs";

// Extract unique brands and create slugs
const BRANDS = [...new Set(cars.map((car) => car.brand))];

function brandToSlug(brand: string): string {
  return brand.toLowerCase().replace(/\s+/g, "-");
}

function slugToBrand(slug: string): string | undefined {
  return BRANDS.find((b) => brandToSlug(b) === slug);
}

export function generateStaticParams() {
  const params: { lang: string; "country-slug": string; "brand-slug": string }[] = [];
  for (const lang of ["en", "fr"]) {
    for (const country of countries) {
      for (const brand of BRANDS) {
        params.push({
          lang,
          "country-slug": country.slug,
          "brand-slug": brandToSlug(brand),
        });
      }
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; "country-slug": string; "brand-slug": string }>;
}): Promise<Metadata> {
  const { "country-slug": countrySlug, "brand-slug": brandSlug } = await params;
  const country = countries.find((c) => c.slug === countrySlug);
  const brand = slugToBrand(brandSlug);

  if (!country || !brand) {
    return { title: "Not Found" };
  }

  const title = `Import ${brand} Cars to ${country.name} - All Models & Costs`;
  const description = `Discover all ${brand} models available for import to ${country.name}. Compare prices, customs duty, VAT, and total import costs.`;

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

export default async function BrandPage({
  params,
}: {
  params: Promise<{ lang: string; "country-slug": string; "brand-slug": string }>;
}) {
  const { lang, "country-slug": countrySlug, "brand-slug": brandSlug } = await params;
  const country = countries.find((c) => c.slug === countrySlug);
  const brand = slugToBrand(brandSlug);

  if (!country || !brand) {
    notFound();
  }

  const breadcrumbs = [
    { label: lang === "fr" ? "Accueil" : "Home", href: `/${lang}` },
    { label: country.name, href: `/${lang}/${countrySlug}` },
    { label: brand, href: `/${lang}/${countrySlug}/brand/${brandSlug}` },
  ];

  // Filter cars by brand and calculate costs
  const brandCars = (await Promise.all(
    cars
      .filter((car) => car.brand === brand)
      .map(async (car) => {
        const cost = await calculateWithLiveRates(
          car.averagePrice,
          car.ageEstimate,
          car.fuelType as "petrol" | "diesel",
          countrySlug
        );
        return { car, cost };
      })
  )).sort((a, b) => a.cost.totalEUR - b.cost.totalEUR);

  // Other brands for internal linking
  const otherBrands = BRANDS.filter((b) => b !== brand);

  // Schema.org ItemList with Brand type
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${brand} Cars to Import to ${country.name}`,
    numberOfItems: brandCars.length,
    itemListElement: brandCars.map(({ car, cost }, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: car.name,
      url: `https://carimport.com/${lang}/${countrySlug}/import/${car.slug}`,
      item: {
        "@type": "Product",
        name: car.name,
        brand: {
          "@type": "Brand",
          name: brand,
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
            ? `Importer des voitures ${brand} vers ${country.name}`
            : `Import ${brand} Cars to ${country.name}`}
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl">
          {lang === "fr"
            ? `Explorez ${brandCars.length} modele(s) ${brand} disponible(s) a l'importation vers ${country.name}. Tous les prix incluent les droits de douane, la TVA et les frais.`
            : `Explore ${brandCars.length} ${brand} model(s) available for import to ${country.name}. All prices include customs duty, VAT, and fees.`}
        </p>
      </section>

      {/* Car Grid */}
      {brandCars.length > 0 ? (
        <section className="mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {brandCars.map(({ car, cost }) => (
              <Link
                key={car.slug}
                href={`/${lang}/${countrySlug}/import/${car.slug}`}
                className="group block bg-white rounded-xl shadow-md border border-gray-100 p-5 hover:shadow-xl hover:border-[#f59e0b]/30 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#f59e0b]/10 text-[#f59e0b] uppercase">
                    {car.category}
                  </span>
                  <span className="text-xs text-gray-400">
                    {car.fuelType === "petrol"
                      ? lang === "fr"
                        ? "Essence"
                        : "Petrol"
                      : "Diesel"}
                  </span>
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
                    ~{car.ageEstimate} {lang === "fr" ? "ans" : "years"}
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
                ? `Aucun modele ${brand} disponible pour ${country.name}.`
                : `No ${brand} models available for ${country.name}.`}
            </p>
          </div>
        </section>
      )}

      {/* Other Brands */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-[#1a1f36] mb-4">
          {lang === "fr" ? "Autres marques" : "Other Brands"}
        </h2>
        <div className="flex flex-wrap gap-2">
          {otherBrands.map((b) => (
            <Link
              key={b}
              href={`/${lang}/${countrySlug}/brand/${brandToSlug(b)}`}
              className="inline-block px-4 py-2 bg-white border border-gray-200 rounded-lg text-[#1a1f36] font-medium hover:border-[#f59e0b] hover:text-[#f59e0b] transition"
            >
              {b}
            </Link>
          ))}
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
