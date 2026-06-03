import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import countries from "@/data/countries.json";
import cars from "@/data/cars.json";
import { calculateWithLiveRates } from "@/lib/calculate-with-live-rates";
import Breadcrumbs from "@/components/Breadcrumbs";

type Car = (typeof cars)[number];

const COUNTRY_PAIRS = [
  "morocco-vs-algeria",
  "morocco-vs-tunisia",
  "algeria-vs-tunisia",
  "morocco-vs-turkey",
  "morocco-vs-egypt",
  "nigeria-vs-ghana",
  "senegal-vs-ivory-coast",
  "turkey-vs-saudi-arabia",
];

export function generateStaticParams() {
  const params: { lang: string; "countryA-vs-countryB": string; carSlug: string }[] = [];
  for (const lang of ["en", "fr"]) {
    for (const pair of COUNTRY_PAIRS) {
      for (const car of cars) {
        params.push({ lang, "countryA-vs-countryB": pair, carSlug: car.slug });
      }
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; "countryA-vs-countryB": string; carSlug: string }>;
}): Promise<Metadata> {
  const { lang, "countryA-vs-countryB": pairSlug, carSlug } = await params;
  const [slugA, slugB] = pairSlug.split("-vs-");
  const countryA = countries.find((c) => c.slug === slugA);
  const countryB = countries.find((c) => c.slug === slugB);
  const car = cars.find((c) => c.slug === carSlug);

  if (!countryA || !countryB || !car) {
    return { title: "Not Found" };
  }

  const title =
    lang === "fr"
      ? `Importer ${car.name}: ${countryA.name} vs ${countryB.name} - Comparaison des couts`
      : `Import ${car.name}: ${countryA.name} vs ${countryB.name} - Cost Comparison`;

  const description =
    lang === "fr"
      ? `Comparez le cout d'importation d'une ${car.name} entre ${countryA.name} et ${countryB.name}. Droits de douane, TVA et frais compares.`
      : `Compare the cost of importing a ${car.name} to ${countryA.name} vs ${countryB.name}. Customs duty, VAT, and fees compared side by side.`;

  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    alternates: {
      languages: {
        en: `/en/compare/${pairSlug}/${carSlug}`,
        fr: `/fr/compare/${pairSlug}/${carSlug}`,
      },
    },
  };
}

function getFAQs(
  car: Car,
  countryAName: string,
  countryBName: string,
  cheaperName: string,
  savingsEUR: number,
  lang: string
) {
  if (lang === "fr") {
    return [
      {
        question: `Est-il moins cher d'importer une ${car.name} en ${countryAName} ou en ${countryBName} ?`,
        answer: `Il est moins cher d'importer une ${car.name} en ${cheaperName}. Vous economisez environ ${savingsEUR.toLocaleString()} EUR par rapport a l'autre pays.`,
      },
      {
        question: `Pourquoi les couts d'importation different-ils entre ${countryAName} et ${countryBName} ?`,
        answer: `Les differences proviennent des taux de droits de douane, de TVA et des frais administratifs fixes qui varient d'un pays a l'autre.`,
      },
      {
        question: `Les frais de transport sont-ils les memes pour ${countryAName} et ${countryBName} ?`,
        answer: `Dans cette estimation, les frais de transport et d'assurance sont calcules a 5% du prix du vehicule pour les deux pays, car les couts reels varient selon le port d'arrivee.`,
      },
    ];
  }
  return [
    {
      question: `Is it cheaper to import a ${car.name} to ${countryAName} or ${countryBName}?`,
      answer: `It is cheaper to import a ${car.name} to ${cheaperName}. You save approximately ${savingsEUR.toLocaleString()} EUR compared to the other country.`,
    },
    {
      question: `Why do import costs differ between ${countryAName} and ${countryBName}?`,
      answer: `The differences come from varying customs duty rates, VAT rates, and fixed administrative fees that each country sets independently.`,
    },
    {
      question: `Are transport costs the same for ${countryAName} and ${countryBName}?`,
      answer: `In this estimate, transport and insurance costs are calculated at 5% of the vehicle price for both countries, as actual costs vary depending on the destination port.`,
    },
  ];
}

export default async function CompareCarPage({
  params,
}: {
  params: Promise<{ lang: string; "countryA-vs-countryB": string; carSlug: string }>;
}) {
  const { lang, "countryA-vs-countryB": pairSlug, carSlug } = await params;
  const [slugA, slugB] = pairSlug.split("-vs-");
  const countryA = countries.find((c) => c.slug === slugA);
  const countryB = countries.find((c) => c.slug === slugB);
  const car = cars.find((c) => c.slug === carSlug);

  if (!countryA || !countryB || !car) {
    notFound();
  }

  const costA = await calculateWithLiveRates(
    car.averagePrice,
    car.ageEstimate,
    car.fuelType as "petrol" | "diesel",
    countryA.slug
  );

  const costB = await calculateWithLiveRates(
    car.averagePrice,
    car.ageEstimate,
    car.fuelType as "petrol" | "diesel",
    countryB.slug
  );

  const difference = Math.abs(costA.totalEUR - costB.totalEUR);
  const cheaperCountry = costA.totalEUR <= costB.totalEUR ? countryA : countryB;
  const cheaperLabel = costA.totalEUR <= costB.totalEUR ? "A" : "B";

  const faqs = getFAQs(car, countryA.name, countryB.name, cheaperCountry.name, difference, lang);

  const breadcrumbs = [
    { label: lang === "fr" ? "Accueil" : "Home", href: `/${lang}` },
    { label: lang === "fr" ? "Comparer" : "Compare", href: `/${lang}/compare` },
    { label: `${countryA.name} vs ${countryB.name}`, href: `/${lang}/compare/${pairSlug}/${carSlug}` },
    { label: car.name, href: `/${lang}/compare/${pairSlug}/${carSlug}` },
  ];

  // Other cars in this same comparison pair
  const otherCars = cars.filter((c) => c.slug !== car.slug).slice(0, 6);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const rows = [
    {
      label: lang === "fr" ? "Prix du vehicule" : "Car Price",
      valueA: `\u20AC${costA.carPrice.toLocaleString()}`,
      valueB: `\u20AC${costB.carPrice.toLocaleString()}`,
      same: true,
    },
    {
      label: lang === "fr" ? "Transport & Assurance" : "Transport Cost",
      valueA: `\u20AC${costA.transportCost.toLocaleString()}`,
      valueB: `\u20AC${costB.transportCost.toLocaleString()}`,
      same: true,
    },
    {
      label: "CIF",
      valueA: `\u20AC${costA.cif.toLocaleString()}`,
      valueB: `\u20AC${costB.cif.toLocaleString()}`,
      same: true,
    },
    {
      label: lang === "fr" ? "Multiplicateur d'age" : "Age Multiplier",
      valueA: `x${costA.ageMultiplier}`,
      valueB: `x${costB.ageMultiplier}`,
      same: true,
    },
    {
      label: lang === "fr" ? "Valeur en douane" : "Customs Value",
      valueA: `\u20AC${costA.customsValue.toLocaleString()}`,
      valueB: `\u20AC${costB.customsValue.toLocaleString()}`,
      same: true,
    },
    {
      label: lang === "fr" ? "Taux de douane" : "Duty Rate",
      valueA: `${(costA.dutyRate * 100).toFixed(0)}%`,
      valueB: `${(costB.dutyRate * 100).toFixed(0)}%`,
      same: false,
    },
    {
      label: lang === "fr" ? "Montant des droits" : "Duty Amount",
      valueA: `\u20AC${costA.dutyAmount.toLocaleString()}`,
      valueB: `\u20AC${costB.dutyAmount.toLocaleString()}`,
      same: false,
    },
    {
      label: lang === "fr" ? "Taux de TVA" : "VAT Rate",
      valueA: `${(costA.vatRate * 100).toFixed(0)}%`,
      valueB: `${(costB.vatRate * 100).toFixed(0)}%`,
      same: false,
    },
    {
      label: lang === "fr" ? "Montant TVA" : "VAT Amount",
      valueA: `\u20AC${costA.vatAmount.toLocaleString()}`,
      valueB: `\u20AC${costB.vatAmount.toLocaleString()}`,
      same: false,
    },
    {
      label: lang === "fr" ? "Frais fixes" : "Fixed Fees",
      valueA: `\u20AC${costA.feesEUR.toLocaleString()}`,
      valueB: `\u20AC${costB.feesEUR.toLocaleString()}`,
      same: false,
    },
    {
      label: "TOTAL",
      valueA: `\u20AC${costA.totalEUR.toLocaleString()}`,
      valueB: `\u20AC${costB.totalEUR.toLocaleString()}`,
      same: false,
      isTotal: true,
    },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      {/* H1 Title */}
      <section className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1a1f36] mb-3">
          {car.name}: {lang === "fr" ? "Importer en" : "Import to"} {countryA.name} vs {countryB.name}
        </h1>
        <p className="text-lg text-gray-600">
          {lang === "fr"
            ? "Comparaison cote a cote des couts d'importation"
            : "Side-by-side import cost comparison"}
        </p>
      </section>

      {/* Savings Highlight */}
      <section className="mb-8">
        <div className="bg-gradient-to-r from-[#10b981] to-[#059669] rounded-xl p-6 text-white">
          <p className="text-xl font-bold">
            {lang === "fr"
              ? `Vous economisez \u20AC${difference.toLocaleString()} en important en ${cheaperCountry.name}`
              : `You save \u20AC${difference.toLocaleString()} by importing to ${cheaperCountry.name}`}
          </p>
          <p className="text-white/80 mt-1 text-sm">
            {lang === "fr"
              ? `Cout total: \u20AC${cheaperLabel === "A" ? costA.totalEUR.toLocaleString() : costB.totalEUR.toLocaleString()} vs \u20AC${cheaperLabel === "A" ? costB.totalEUR.toLocaleString() : costA.totalEUR.toLocaleString()}`
              : `Total cost: \u20AC${cheaperLabel === "A" ? costA.totalEUR.toLocaleString() : costB.totalEUR.toLocaleString()} vs \u20AC${cheaperLabel === "A" ? costB.totalEUR.toLocaleString() : costA.totalEUR.toLocaleString()}`}
          </p>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[#1a1f36] mb-6">
          {lang === "fr" ? "Comparaison detaillee" : "Detailed Comparison"}
        </h2>
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#1a1f36] text-white">
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    {lang === "fr" ? "Element" : "Item"}
                  </th>
                  <th className={`px-4 py-3 text-right text-sm font-semibold ${cheaperLabel === "A" ? "bg-[#10b981]/20" : "bg-[#f59e0b]/20"}`}>
                    {countryA.name}
                  </th>
                  <th className={`px-4 py-3 text-right text-sm font-semibold ${cheaperLabel === "B" ? "bg-[#10b981]/20" : "bg-[#f59e0b]/20"}`}>
                    {countryB.name}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`border-t border-gray-100 ${row.isTotal ? "bg-gray-50 font-bold" : ""}`}
                  >
                    <td className="px-4 py-3 text-sm text-gray-700">{row.label}</td>
                    <td className={`px-4 py-3 text-sm text-right ${row.isTotal ? (cheaperLabel === "A" ? "text-[#10b981]" : "text-[#f59e0b]") : row.same ? "text-gray-600" : cheaperLabel === "A" ? "text-[#10b981]" : "text-[#f59e0b]"}`}>
                      {row.valueA}
                    </td>
                    <td className={`px-4 py-3 text-sm text-right ${row.isTotal ? (cheaperLabel === "B" ? "text-[#10b981]" : "text-[#f59e0b]") : row.same ? "text-gray-600" : cheaperLabel === "B" ? "text-[#10b981]" : "text-[#f59e0b]"}`}>
                      {row.valueB}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-[#1a1f36] mb-6">
          {lang === "fr" ? "Questions frequentes" : "Frequently Asked Questions"}
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group bg-white rounded-xl shadow-md border border-gray-100 p-5"
            >
              <summary className="cursor-pointer font-semibold text-[#1a1f36] group-open:text-[#10b981] transition-colors list-none flex items-center justify-between">
                {faq.question}
                <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">
                  &#9662;
                </span>
              </summary>
              <p className="mt-3 text-gray-600 leading-relaxed">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Links to full cost pages */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-[#1a1f36] mb-4">
          {lang === "fr" ? "Voir le detail complet" : "View Full Details"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href={`/${lang}/${countryA.slug}/import/${car.slug}`}
            className="flex items-center justify-between bg-white rounded-xl shadow-md border border-gray-100 p-5 hover:border-[#10b981]/30 hover:shadow-lg transition-all"
          >
            <div>
              <p className="font-semibold text-[#1a1f36]">{car.name}</p>
              <p className="text-sm text-gray-500">{lang === "fr" ? "Importation en" : "Import to"} {countryA.name}</p>
            </div>
            <span className="text-lg font-bold text-[#10b981]">
              &euro;{costA.totalEUR.toLocaleString()}
            </span>
          </Link>
          <Link
            href={`/${lang}/${countryB.slug}/import/${car.slug}`}
            className="flex items-center justify-between bg-white rounded-xl shadow-md border border-gray-100 p-5 hover:border-[#10b981]/30 hover:shadow-lg transition-all"
          >
            <div>
              <p className="font-semibold text-[#1a1f36]">{car.name}</p>
              <p className="text-sm text-gray-500">{lang === "fr" ? "Importation en" : "Import to"} {countryB.name}</p>
            </div>
            <span className="text-lg font-bold text-[#10b981]">
              &euro;{costB.totalEUR.toLocaleString()}
            </span>
          </Link>
        </div>
      </section>

      {/* Other cars in this comparison */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-[#1a1f36] mb-4">
          {lang === "fr"
            ? `Autres voitures: ${countryA.name} vs ${countryB.name}`
            : `Other Cars: ${countryA.name} vs ${countryB.name}`}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {await Promise.all(otherCars.map(async (c) => {
            const cCostA = await calculateWithLiveRates(
              c.averagePrice,
              c.ageEstimate,
              c.fuelType as "petrol" | "diesel",
              countryA.slug
            );
            const cCostB = await calculateWithLiveRates(
              c.averagePrice,
              c.ageEstimate,
              c.fuelType as "petrol" | "diesel",
              countryB.slug
            );
            const cCheaper = cCostA.totalEUR <= cCostB.totalEUR ? countryA.name : countryB.name;
            return (
              <Link
                key={c.slug}
                href={`/${lang}/compare/${pairSlug}/${c.slug}`}
                className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:border-[#f59e0b]/30 hover:shadow-md transition-all"
              >
                <p className="font-medium text-[#1a1f36] mb-1">{c.name}</p>
                <p className="text-xs text-gray-500">
                  {lang === "fr" ? "Moins cher en" : "Cheaper in"} {cCheaper}
                </p>
              </Link>
            );
          }))}
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
