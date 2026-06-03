import type { Metadata } from "next";
import Link from "next/link";
import countries from "@/data/countries.json";
import Breadcrumbs from "@/components/Breadcrumbs";

const COUNTRY_PAIRS = [
  { slug: "morocco-vs-algeria", a: "morocco", b: "algeria" },
  { slug: "morocco-vs-tunisia", a: "morocco", b: "tunisia" },
  { slug: "algeria-vs-tunisia", a: "algeria", b: "tunisia" },
  { slug: "morocco-vs-turkey", a: "morocco", b: "turkey" },
  { slug: "morocco-vs-egypt", a: "morocco", b: "egypt" },
  { slug: "nigeria-vs-ghana", a: "nigeria", b: "ghana" },
  { slug: "senegal-vs-ivory-coast", a: "senegal", b: "ivory-coast" },
  { slug: "turkey-vs-saudi-arabia", a: "turkey", b: "saudi-arabia" },
];

const DEFAULT_CAR_SLUG = "bmw-320d-2019";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "fr" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  const title =
    lang === "fr"
      ? "Comparer les couts d'importation entre pays | Calculateur Import"
      : "Compare Car Import Costs Between Countries | Car Import Calculator";

  const description =
    lang === "fr"
      ? "Comparez les couts d'importation de voitures entre differents pays. Droits de douane, TVA et frais compares cote a cote."
      : "Compare car import costs between different countries. Customs duty, VAT, and fees compared side by side.";

  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    alternates: {
      languages: {
        en: "/en/compare",
        fr: "/fr/compare",
      },
    },
  };
}

export default async function CompareIndexPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  const breadcrumbs = [
    { label: lang === "fr" ? "Accueil" : "Home", href: `/${lang}` },
    { label: lang === "fr" ? "Comparer" : "Compare", href: `/${lang}/compare` },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <section className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1a1f36] mb-3">
          {lang === "fr"
            ? "Comparer les couts d'importation"
            : "Compare Import Costs"}
        </h1>
        <p className="text-lg text-gray-600">
          {lang === "fr"
            ? "Selectionnez une paire de pays pour comparer les couts d'importation cote a cote."
            : "Select a country pair to compare import costs side by side."}
        </p>
      </section>

      <section className="mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {COUNTRY_PAIRS.map((pair) => {
            const countryA = countries.find((c) => c.slug === pair.a);
            const countryB = countries.find((c) => c.slug === pair.b);
            if (!countryA || !countryB) return null;

            return (
              <Link
                key={pair.slug}
                href={`/${lang}/compare/${pair.slug}/${DEFAULT_CAR_SLUG}`}
                className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:border-[#10b981]/30 hover:shadow-lg transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-[#1a1f36] group-hover:text-[#10b981] transition-colors">
                    {countryA.name}
                  </span>
                  <span className="text-sm font-semibold text-[#f59e0b] px-2 py-0.5 bg-[#f59e0b]/10 rounded">
                    vs
                  </span>
                  <span className="text-lg font-bold text-[#1a1f36] group-hover:text-[#10b981] transition-colors">
                    {countryB.name}
                  </span>
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>
                    {countryA.name}: {lang === "fr" ? "Douane" : "Duty"}{" "}
                    {(countryA.dutyPetrol * 100).toFixed(0)}% | TVA{" "}
                    {(countryA.vat * 100).toFixed(0)}%
                  </p>
                  <p>
                    {countryB.name}: {lang === "fr" ? "Douane" : "Duty"}{" "}
                    {(countryB.dutyPetrol * 100).toFixed(0)}% | TVA{" "}
                    {(countryB.vat * 100).toFixed(0)}%
                  </p>
                </div>
                <p className="mt-3 text-sm text-[#10b981] font-medium">
                  {lang === "fr" ? "Comparer maintenant" : "Compare now"} &rarr;
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
