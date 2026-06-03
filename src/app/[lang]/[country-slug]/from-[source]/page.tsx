import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import countries from "@/data/countries.json";
import sourceCountries from "@/data/source-countries.json";
import cars from "@/data/cars.json";
import { calculateWithLiveRates } from "@/lib/calculate-with-live-rates";
import Breadcrumbs from "@/components/Breadcrumbs";

type Params = {
  lang: string;
  "country-slug": string;
  source: string;
};

export function generateStaticParams() {
  const params: Params[] = [];
  for (const lang of ["en", "fr"]) {
    for (const country of countries) {
      for (const source of sourceCountries) {
        params.push({ lang, "country-slug": country.slug, source: source.slug });
      }
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { lang, "country-slug": countrySlug, source: sourceSlug } = await params;
  const country = countries.find((c) => c.slug === countrySlug);
  const source = sourceCountries.find((s) => s.slug === sourceSlug);

  if (!country || !source) {
    return { title: "Not Found" };
  }

  const title =
    lang === "fr"
      ? `Importer une voiture de ${source.name} vers ${country.name} - Couts & Guide`
      : `Import Car from ${source.name} to ${country.name} - Costs & Guide`;

  const description =
    lang === "fr"
      ? `Guide complet pour importer une voiture de ${source.name} vers ${country.name}. Estimation des couts de transport, droits de douane et delais de livraison.`
      : `Complete guide to importing a car from ${source.name} to ${country.name}. Transport cost estimates, customs duties, and shipping timelines.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    alternates: {
      languages: {
        en: `/en/${countrySlug}/from-${sourceSlug}`,
        fr: `/fr/${countrySlug}/from-${sourceSlug}`,
      },
    },
  };
}

function getFAQs(
  source: (typeof sourceCountries)[number],
  country: (typeof countries)[number],
  lang: string
) {
  if (lang === "fr") {
    return [
      {
        question: `Combien coute le transport d'une voiture de ${source.name} vers ${country.name} ?`,
        answer: `Le cout de transport de ${source.name} vers ${country.name} represente environ ${(5 * source.transportMultiplier).toFixed(1)}% de la valeur du vehicule, incluant le fret maritime et l'assurance. Le delai de livraison est estime entre ${source.shippingDays} jours.`,
      },
      {
        question: `Quels documents sont necessaires pour importer une voiture de ${source.name} ?`,
        answer: `Vous aurez besoin du certificat d'immatriculation original, du certificat de conformite europeen (COC), de la facture d'achat, du controle technique valide, et du certificat de non-gage. Ces documents doivent etre traduits et legalises.`,
      },
      {
        question: `Quel est le delai total pour importer une voiture de ${source.name} vers ${country.name} ?`,
        answer: `Le delai total comprend ${source.shippingDays} jours de transport maritime, plus 2 a 4 semaines pour le dedouanement et l'immatriculation locale en ${country.name}. Prevoyez 4 a 8 semaines au total.`,
      },
    ];
  }

  return [
    {
      question: `How much does it cost to ship a car from ${source.name} to ${country.name}?`,
      answer: `Shipping from ${source.name} to ${country.name} costs approximately ${(5 * source.transportMultiplier).toFixed(1)}% of the vehicle value, including sea freight and insurance. Estimated delivery time is ${source.shippingDays} days.`,
    },
    {
      question: `What documents are needed to import a car from ${source.name}?`,
      answer: `You will need the original registration certificate, European Certificate of Conformity (COC), purchase invoice, valid technical inspection report, and certificate of non-encumbrance. These documents must be translated and legalized.`,
    },
    {
      question: `What is the total timeline to import a car from ${source.name} to ${country.name}?`,
      answer: `The total timeline includes ${source.shippingDays} days of sea transport, plus 2 to 4 weeks for customs clearance and local registration in ${country.name}. Plan for 4 to 8 weeks total.`,
    },
  ];
}

export default async function FromSourcePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { lang, "country-slug": countrySlug, source: sourceSlug } = await params;
  const country = countries.find((c) => c.slug === countrySlug);
  const source = sourceCountries.find((s) => s.slug === sourceSlug);

  if (!country || !source) {
    notFound();
  }

  const faqs = getFAQs(source, country, lang);
  const popularCars = cars.slice(0, 20);
  const transportPercent = (5 * source.transportMultiplier).toFixed(1);

  const breadcrumbs = [
    { label: lang === "fr" ? "Accueil" : "Home", href: `/${lang}` },
    { label: country.name, href: `/${lang}/${countrySlug}` },
    {
      label: lang === "fr" ? `Depuis ${source.name}` : `From ${source.name}`,
      href: `/${lang}/${countrySlug}/from-${sourceSlug}`,
    },
  ];

  const faqJsonLd = {
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

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      {/* Hero */}
      <section className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1a1f36] mb-4">
          {source.flag}{" "}
          {lang === "fr"
            ? `Importer une voiture de ${source.name} vers ${country.name}`
            : `Import a Car from ${source.name} to ${country.name}`}
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl">
          {lang === "fr"
            ? `Estimez les couts complets d'importation depuis ${source.name}, incluant le transport maritime, les droits de douane et les frais d'immatriculation en ${country.name}.`
            : `Estimate the full import costs from ${source.name}, including sea transport, customs duties, and registration fees in ${country.name}.`}
        </p>
      </section>

      {/* Route Info Card */}
      <section className="mb-12">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-[#1a1f36] mb-4">
            {lang === "fr" ? "Informations sur la route" : "Shipping Route Info"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">
                {lang === "fr" ? "Itineraire" : "Route"}
              </p>
              <p className="text-lg font-semibold text-[#1a1f36]">
                {source.flag} {source.name} &rarr; {country.name}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">
                {lang === "fr" ? "Delai estime" : "Estimated Delivery"}
              </p>
              <p className="text-lg font-semibold text-[#10b981]">
                {source.shippingDays} {lang === "fr" ? "jours" : "days"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">
                {lang === "fr" ? "Cout transport" : "Transport Cost"}
              </p>
              <p className="text-lg font-semibold text-[#f59e0b]">
                {transportPercent}%{" "}
                <span className="text-sm font-normal text-gray-500">
                  {lang === "fr" ? "de la valeur" : "of value"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cars Grid */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-[#1a1f36] mb-6">
          {lang === "fr"
            ? `Couts d'importation depuis ${source.name}`
            : `Import Costs from ${source.name}`}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {await Promise.all(popularCars.map(async (car) => {
            const baseCost = await calculateWithLiveRates(
              car.averagePrice,
              car.ageEstimate,
              car.fuelType as "petrol" | "diesel",
              countrySlug
            );
            // Adjust transport cost by source multiplier
            const adjustedTransport = baseCost.transportCost * source.transportMultiplier;
            const transportDifference = adjustedTransport - baseCost.transportCost;
            const adjustedTotalEUR = Math.round((baseCost.totalEUR + transportDifference) * 100) / 100;
            const adjustedTotalLocal = Math.round(adjustedTotalEUR * baseCost.eurToLocalRate * 100) / 100;

            return (
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
                      &euro;{adjustedTotalEUR.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {adjustedTotalLocal.toLocaleString()} {baseCost.currency}
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
            );
          }))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-[#1a1f36] mb-6">
          {lang === "fr"
            ? `FAQ - Import depuis ${source.name}`
            : `FAQ - Importing from ${source.name}`}
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

      {/* Other Source Countries */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-[#1a1f36] mb-6">
          {lang === "fr"
            ? `Importer depuis d'autres pays`
            : `Import from Other Countries`}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {sourceCountries
            .filter((s) => s.slug !== sourceSlug)
            .map((otherSource) => (
              <Link
                key={otherSource.slug}
                href={`/${lang}/${countrySlug}/from-${otherSource.slug}`}
                className="flex items-center gap-2 bg-white rounded-xl shadow-md border border-gray-100 p-4 hover:shadow-xl hover:border-[#10b981]/30 transition-all duration-300"
              >
                <span className="text-2xl">{otherSource.flag}</span>
                <div>
                  <p className="font-medium text-[#1a1f36] text-sm">
                    {otherSource.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {otherSource.shippingDays} {lang === "fr" ? "jours" : "days"}
                  </p>
                </div>
              </Link>
            ))}
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
