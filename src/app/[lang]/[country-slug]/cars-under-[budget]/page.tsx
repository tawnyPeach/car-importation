import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import countries from "@/data/countries.json";
import cars from "@/data/cars.json";
import { calculateImportCost } from "@/lib/calculator";
import Breadcrumbs from "@/components/Breadcrumbs";

const BUDGET_TIERS = [5000, 10000, 15000, 20000, 25000, 30000, 40000, 50000, 80000];

export function generateStaticParams() {
  const params: { lang: string; "country-slug": string; budget: string }[] = [];
  for (const lang of ["en", "fr"]) {
    for (const country of countries) {
      for (const budget of BUDGET_TIERS) {
        params.push({
          lang,
          "country-slug": country.slug,
          budget: budget.toString(),
        });
      }
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; "country-slug": string; budget: string }>;
}): Promise<Metadata> {
  const { "country-slug": countrySlug, budget } = await params;
  const country = countries.find((c) => c.slug === countrySlug);
  const budgetNum = parseInt(budget, 10);

  if (!country || isNaN(budgetNum)) {
    return { title: "Not Found" };
  }

  const title = `Cars Under \u20AC${budgetNum.toLocaleString()} to Import to ${country.name} | Car Import Calculator`;
  const description = `Find cars you can import to ${country.name} for under \u20AC${budgetNum.toLocaleString()} total cost including customs duty, VAT, and fees.`;

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

export default async function BudgetPage({
  params,
}: {
  params: Promise<{ lang: string; "country-slug": string; budget: string }>;
}) {
  const { lang, "country-slug": countrySlug, budget } = await params;
  const country = countries.find((c) => c.slug === countrySlug);
  const budgetNum = parseInt(budget, 10);

  if (!country || isNaN(budgetNum)) {
    notFound();
  }

  const breadcrumbs = [
    { label: lang === "fr" ? "Accueil" : "Home", href: `/${lang}` },
    { label: country.name, href: `/${lang}/${countrySlug}` },
    {
      label: lang === "fr" ? `Voitures sous \u20AC${budgetNum.toLocaleString()}` : `Cars Under \u20AC${budgetNum.toLocaleString()}`,
      href: `/${lang}/${countrySlug}/cars-under-${budget}`,
    },
  ];

  // Filter cars where total import cost is under budget
  const affordableCars = cars
    .map((car) => {
      const cost = calculateImportCost(
        car.averagePrice,
        car.ageEstimate,
        car.fuelType as "petrol" | "diesel",
        countrySlug
      );
      return { car, cost };
    })
    .filter(({ cost }) => cost.totalEUR <= budgetNum)
    .sort((a, b) => a.cost.totalEUR - b.cost.totalEUR);

  // Other budget tiers for internal links
  const otherTiers = BUDGET_TIERS.filter((t) => t !== budgetNum);

  // Schema.org ItemList JSON-LD
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Cars Under \u20AC${budgetNum.toLocaleString()} to Import to ${country.name}`,
    numberOfItems: affordableCars.length,
    itemListElement: affordableCars.map(({ car, cost }, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: car.name,
      url: `https://carimport.com/${lang}/${countrySlug}/import/${car.slug}`,
      item: {
        "@type": "Product",
        name: car.name,
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
            ? `Voitures sous \u20AC${budgetNum.toLocaleString()} a importer en ${country.name}`
            : `Cars Under \u20AC${budgetNum.toLocaleString()} to Import to ${country.name}`}
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl">
          {lang === "fr"
            ? `${affordableCars.length} vehicule(s) disponible(s) avec un cout total d'importation inferieur a \u20AC${budgetNum.toLocaleString()}.`
            : `${affordableCars.length} vehicle(s) available with a total import cost under \u20AC${budgetNum.toLocaleString()}.`}
        </p>
      </section>

      {/* Results */}
      {affordableCars.length > 0 ? (
        <section className="mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {affordableCars.map(({ car, cost }) => (
              <Link
                key={car.slug}
                href={`/${lang}/${countrySlug}/import/${car.slug}`}
                className="group block bg-white rounded-xl shadow-md border border-gray-100 p-5 hover:shadow-xl hover:border-[#f59e0b]/30 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600 uppercase">
                    {car.category}
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
            <p className="text-gray-600 text-lg mb-4">
              {lang === "fr"
                ? `Aucun vehicule disponible sous \u20AC${budgetNum.toLocaleString()} pour ${country.name}.`
                : `No vehicles available under \u20AC${budgetNum.toLocaleString()} for ${country.name}.`}
            </p>
            <p className="text-gray-500">
              {lang === "fr" ? "Essayez un budget plus eleve :" : "Try a higher budget:"}
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {BUDGET_TIERS.filter((t) => t > budgetNum).map((tier) => (
                <Link
                  key={tier}
                  href={`/${lang}/${countrySlug}/cars-under-${tier}`}
                  className="inline-block px-4 py-2 bg-[#10b981] text-white rounded-lg font-medium hover:bg-[#059669] transition"
                >
                  &euro;{tier.toLocaleString()}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Other Budget Tiers */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-[#1a1f36] mb-4">
          {lang === "fr" ? "Autres budgets" : "Other Budget Tiers"}
        </h2>
        <div className="flex flex-wrap gap-2">
          {otherTiers.map((tier) => (
            <Link
              key={tier}
              href={`/${lang}/${countrySlug}/cars-under-${tier}`}
              className="inline-block px-4 py-2 bg-white border border-gray-200 rounded-lg text-[#1a1f36] font-medium hover:border-[#f59e0b] hover:text-[#f59e0b] transition"
            >
              {lang === "fr" ? "Sous" : "Under"} &euro;{tier.toLocaleString()}
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
