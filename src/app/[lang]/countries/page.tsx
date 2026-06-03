import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import countries from "@/data/countries.json";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "fr" }];
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Import Cars to Africa & Middle East - All Countries",
    description:
      "Compare car import duties, VAT rates, and fees across 10 African and Middle Eastern countries. Find the best destination for your vehicle import.",
    openGraph: {
      title: "Import Cars to Africa & Middle East - All Countries",
      description:
        "Compare car import duties, VAT rates, and fees across 10 African and Middle Eastern countries.",
      type: "website",
    },
    alternates: {
      languages: {
        en: "/en/countries",
        fr: "/fr/countries",
      },
    },
  };
}

const countryFlags: Record<string, string> = {
  morocco: "🇲🇦",
  algeria: "🇩🇿",
  tunisia: "🇹🇳",
  senegal: "🇸🇳",
  "ivory-coast": "🇨🇮",
  turkey: "🇹🇷",
  egypt: "🇪🇬",
  nigeria: "🇳🇬",
  ghana: "🇬🇭",
  "saudi-arabia": "🇸🇦",
};

const countryNamesFr: Record<string, string> = {
  morocco: "Maroc",
  algeria: "Algerie",
  tunisia: "Tunisie",
  senegal: "Senegal",
  "ivory-coast": "Cote d'Ivoire",
  turkey: "Turquie",
  egypt: "Egypte",
  nigeria: "Nigeria",
  ghana: "Ghana",
  "saudi-arabia": "Arabie Saoudite",
};

export default async function CountriesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  const breadcrumbs = [
    { label: lang === "fr" ? "Accueil" : "Home", href: `/${lang}` },
    { label: lang === "fr" ? "Pays" : "Countries", href: `/${lang}/countries` },
  ];

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name:
      lang === "fr"
        ? "Pays pour l'Importation de Voitures"
        : "Countries for Car Import",
    numberOfItems: countries.length,
    itemListElement: countries.map((country, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: country.name,
      url: `https://carimport.com/${lang}/${country.slug}`,
    })),
  };

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1a1f36] mb-3">
          {lang === "fr"
            ? "Tous les Pays pour l'Importation"
            : "All Countries for Car Import"}
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          {lang === "fr"
            ? "Comparez les droits de douane, la TVA et les frais d'importation pour 10 pays d'Afrique et du Moyen-Orient. Cliquez sur un pays pour voir les details complets."
            : "Compare import duties, VAT rates, and fees across 10 African and Middle Eastern countries. Click any country to see full details."}
        </p>
      </div>

      {/* Country Cards Grid */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-[#1a1f36] mb-6">
          {lang === "fr" ? "Destinations Disponibles" : "Available Destinations"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {countries.map((country) => (
            <div
              key={country.slug}
              className="border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-[#10b981] transition group"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{countryFlags[country.slug]}</span>
                <h3 className="font-bold text-[#1a1f36] group-hover:text-[#10b981] transition">
                  {lang === "fr"
                    ? countryNamesFr[country.slug] || country.name
                    : country.name}
                </h3>
              </div>
              <div className="space-y-1 text-sm text-gray-600 mb-4">
                <p>
                  <span className="font-medium">
                    {lang === "fr" ? "Droits (essence)" : "Duty (petrol)"}:
                  </span>{" "}
                  {(country.dutyPetrol * 100).toFixed(0)}%
                </p>
                <p>
                  <span className="font-medium">
                    {lang === "fr" ? "Droits (diesel)" : "Duty (diesel)"}:
                  </span>{" "}
                  {(country.dutyDiesel * 100).toFixed(0)}%
                </p>
                <p>
                  <span className="font-medium">{lang === "fr" ? "TVA" : "VAT"}:</span>{" "}
                  {(country.vat * 100).toFixed(1)}%
                </p>
                <p>
                  <span className="font-medium">
                    {lang === "fr" ? "Frais fixes" : "Fixed fees"}:
                  </span>{" "}
                  {country.fixedFees.toLocaleString()} {country.currency}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <a
                  href={`/${lang}/${country.slug}`}
                  className="text-center text-sm font-medium bg-[#1a1f36] text-white py-2 px-4 rounded-lg hover:bg-[#10b981] transition"
                >
                  {lang === "fr" ? "Voir le pays" : "View Country"}
                </a>
                <a
                  href={`/${lang}/${country.slug}/from-france`}
                  className="text-center text-sm font-medium border border-[#1a1f36] text-[#1a1f36] py-2 px-4 rounded-lg hover:bg-[#1a1f36] hover:text-white transition"
                >
                  {lang === "fr" ? "Importer depuis la France" : "Import from France"}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-[#1a1f36] mb-6">
          {lang === "fr"
            ? "Comparaison des Taux de Douane"
            : "Customs Rates Comparison"}
        </h2>
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#1a1f36] text-white">
                <th className="text-left py-3 px-4 font-semibold">
                  {lang === "fr" ? "Pays" : "Country"}
                </th>
                <th className="text-center py-3 px-4 font-semibold">
                  {lang === "fr" ? "Droits Essence" : "Petrol Duty"}
                </th>
                <th className="text-center py-3 px-4 font-semibold">
                  {lang === "fr" ? "Droits Diesel" : "Diesel Duty"}
                </th>
                <th className="text-center py-3 px-4 font-semibold">
                  {lang === "fr" ? "TVA" : "VAT"}
                </th>
                <th className="text-center py-3 px-4 font-semibold">
                  {lang === "fr" ? "Frais Fixes" : "Fixed Fees"}
                </th>
                <th className="text-center py-3 px-4 font-semibold">
                  {lang === "fr" ? "Devise" : "Currency"}
                </th>
              </tr>
            </thead>
            <tbody>
              {countries.map((country, idx) => (
                <tr
                  key={country.slug}
                  className={`border-t border-gray-100 ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-[#10b981]/5 transition`}
                >
                  <td className="py-3 px-4 font-medium">
                    <a
                      href={`/${lang}/${country.slug}`}
                      className="flex items-center gap-2 hover:text-[#10b981] transition"
                    >
                      <span>{countryFlags[country.slug]}</span>
                      {lang === "fr"
                        ? countryNamesFr[country.slug] || country.name
                        : country.name}
                    </a>
                  </td>
                  <td className="text-center py-3 px-4">
                    {(country.dutyPetrol * 100).toFixed(0)}%
                  </td>
                  <td className="text-center py-3 px-4">
                    {(country.dutyDiesel * 100).toFixed(0)}%
                  </td>
                  <td className="text-center py-3 px-4">
                    {(country.vat * 100).toFixed(1)}%
                  </td>
                  <td className="text-center py-3 px-4">
                    {country.fixedFees.toLocaleString()} {country.currency}
                  </td>
                  <td className="text-center py-3 px-4">{country.currency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#1a1f36] to-[#2d3452] rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">
          {lang === "fr"
            ? "Calculez Vos Frais d'Importation"
            : "Calculate Your Import Fees"}
        </h2>
        <p className="text-gray-300 mb-6">
          {lang === "fr"
            ? "Utilisez notre calculateur pour obtenir une estimation precise pour n'importe quel vehicule."
            : "Use our calculator to get an accurate estimate for any vehicle."}
        </p>
        <a
          href={`/${lang}/calculator`}
          className="inline-block bg-[#f59e0b] hover:bg-[#d97706] text-[#1a1f36] font-bold py-3 px-8 rounded-lg transition shadow-lg"
        >
          {lang === "fr" ? "Ouvrir le Calculateur" : "Open Calculator"}
        </a>
      </section>

      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
    </>
  );
}
