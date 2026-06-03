import type { Metadata } from "next";
import Link from "next/link";
import countries from "@/data/countries.json";
import cars from "@/data/cars.json";
import { getTranslation, type Lang } from "@/lib/i18n";
import HeroSection from "@/components/HeroSection";
import CountryCard from "@/components/CountryCard";
import SearchBar from "@/components/SearchBar";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "fr" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const t = (key: string) => getTranslation(lang as Lang, key);

  return {
    title: t("seo.homeTitle"),
    description: t("seo.homeDesc"),
    openGraph: {
      title: t("seo.homeTitle"),
      description: t("seo.homeDesc"),
      type: "website",
    },
    alternates: {
      languages: {
        en: "/en",
        fr: "/fr",
      },
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = (key: string) => getTranslation(lang as Lang, key);
  const popularCars = cars.slice(0, 12);

  return (
    <>
      <HeroSection
        title={t("seo.homeTitle")}
        subtitle={t("seo.homeDesc")}
        ctaText={t("nav.calculator")}
        ctaHref={`/${lang}/calculator`}
      />

      {/* Search */}
      <section className="mb-12">
        <SearchBar lang={lang} />
      </section>

      {/* Countries Grid */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-[#1a1f36] mb-6">
          {t("nav.countries")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {countries.map((country) => (
            <CountryCard
              key={country.slug}
              name={country.name}
              slug={country.slug}
              currency={country.currency}
              lang={lang}
            />
          ))}
        </div>
      </section>

      {/* Popular Cars */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#1a1f36]">
            {t("country.popularCars")}
          </h2>
          <Link
            href={`/${lang}/calculator`}
            className="text-sm font-medium text-[#10b981] hover:underline"
          >
            {t("common.viewAll")} &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {popularCars.map((car) => (
            <Link
              key={car.slug}
              href={`/${lang}/morocco/import/${car.slug}`}
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
                <span className="text-lg font-bold text-[#10b981]">
                  &euro;{car.averagePrice.toLocaleString()}
                </span>
                <span className="text-xs text-gray-400">
                  {car.fuelType === "petrol"
                    ? lang === "fr" ? "Essence" : "Petrol"
                    : "Diesel"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-12 bg-gradient-to-r from-[#1a1f36] to-[#2d3354] rounded-2xl mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          {lang === "fr"
            ? "Calculez votre cout d'importation maintenant"
            : "Calculate Your Import Cost Now"}
        </h2>
        <p className="text-gray-300 mb-6 max-w-lg mx-auto">
          {t("calculator.subtitle")}
        </p>
        <Link
          href={`/${lang}/calculator`}
          className="inline-block bg-[#10b981] hover:bg-[#059669] text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all"
        >
          {t("nav.calculator")} &rarr;
        </Link>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Car Import Cost Calculator",
            description: t("seo.homeDesc"),
            url: `https://carimport.com/${lang}`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "All",
          }),
        }}
      />
    </>
  );
}
