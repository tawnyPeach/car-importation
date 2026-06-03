import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import countries from "@/data/countries.json";
import cars from "@/data/cars.json";
import { calculateImportCost } from "@/lib/calculator";
import { calculateWithLiveRates } from "@/lib/calculate-with-live-rates";
import Breadcrumbs from "@/components/Breadcrumbs";

type Car = (typeof cars)[number];
type Country = (typeof countries)[number];

export function generateStaticParams() {
  const params: { lang: string; "country-slug": string; "car-slug": string }[] = [];
  for (const lang of ["en", "fr"]) {
    for (const country of countries) {
      for (const car of cars) {
        params.push({ lang, "country-slug": country.slug, "car-slug": car.slug });
      }
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; "country-slug": string; "car-slug": string }>;
}): Promise<Metadata> {
  const { lang, "country-slug": countrySlug, "car-slug": carSlug } = await params;
  const country = countries.find((c) => c.slug === countrySlug);
  const car = cars.find((c) => c.slug === carSlug);

  if (!country || !car) {
    return { title: "Not Found" };
  }

  const cost = await calculateWithLiveRates(
    car.averagePrice,
    car.ageEstimate,
    car.fuelType as "petrol" | "diesel",
    countrySlug
  );

  const title =
    lang === "fr"
      ? `Importer ${car.name} en ${country.name} - Cout: ${cost.totalEUR.toLocaleString()}EUR | Calculateur Import`
      : `Import ${car.name} to ${country.name} - Cost: \u20AC${cost.totalEUR.toLocaleString()} | Car Import Calculator`;

  const description =
    lang === "fr"
      ? `Le cout total d'importation d'une ${car.name} depuis l'Europe vers ${country.name} est d'environ ${cost.totalEUR.toLocaleString()}EUR. Droits de douane, TVA et frais inclus.`
      : `The total cost of importing a ${car.name} from Europe to ${country.name} is approximately \u20AC${cost.totalEUR.toLocaleString()}. Includes customs duty, VAT, and fees.`;

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
        en: `/en/${countrySlug}/import/${carSlug}`,
        fr: `/fr/${countrySlug}/import/${carSlug}`,
      },
    },
  };
}

function getFAQs(car: Car, country: Country, cost: ReturnType<typeof calculateImportCost>, lang: string) {
  if (lang === "fr") {
    return [
      {
        question: `Combien coute l'importation d'une ${car.name} en ${country.name} ?`,
        answer: `Le cout total d'importation d'une ${car.name} en ${country.name} est d'environ ${cost.totalEUR.toLocaleString()} EUR (${cost.totalLocal.toLocaleString()} ${cost.currency}), incluant le prix du vehicule, le transport, les droits de douane, la TVA et les frais administratifs.`,
      },
      {
        question: `Quels sont les droits de douane pour une ${car.name} ${car.fuelType === "petrol" ? "essence" : "diesel"} en ${country.name} ?`,
        answer: `Les droits de douane pour une ${car.name} (${car.fuelType === "petrol" ? "essence" : "diesel"}) en ${country.name} sont de ${(cost.dutyRate * 100).toFixed(0)}%, soit ${cost.dutyAmount.toLocaleString()} EUR sur la valeur en douane.`,
      },
      {
        question: `La ${car.name} est-elle soumise a une majoration d'age en ${country.name} ?`,
        answer: `${car.ageEstimate > 5 ? `Oui, avec un age estime de ${car.ageEstimate} ans, un multiplicateur de ${cost.ageMultiplier}x est applique a la valeur CIF.` : `Non, avec un age estime de ${car.ageEstimate} ans, le multiplicateur standard de ${cost.ageMultiplier}x est applique.`}`,
      },
      {
        question: `Quel est le prix de la ${car.name} en Europe avant importation ?`,
        answer: `Le prix moyen d'une ${car.name} en Europe est d'environ ${car.averagePrice.toLocaleString()} EUR. Ce prix sert de base au calcul des frais d'importation.`,
      },
      {
        question: `Quels documents sont necessaires pour importer une ${car.name} en ${country.name} ?`,
        answer: `Pour importer une ${car.name} en ${country.name}, vous aurez besoin de la carte grise originale, du certificat de conformite, d'une attestation d'achat, d'un certificat de controle technique et des documents d'expedition maritime.`,
      },
    ];
  }

  return [
    {
      question: `How much does it cost to import a ${car.name} to ${country.name}?`,
      answer: `The total cost of importing a ${car.name} to ${country.name} is approximately ${cost.totalEUR.toLocaleString()} EUR (${cost.totalLocal.toLocaleString()} ${cost.currency}), including the vehicle price, transport, customs duty, VAT, and administrative fees.`,
    },
    {
      question: `What are the customs duties for a ${car.fuelType} ${car.name} in ${country.name}?`,
      answer: `The customs duty for a ${car.name} (${car.fuelType}) in ${country.name} is ${(cost.dutyRate * 100).toFixed(0)}%, which amounts to ${cost.dutyAmount.toLocaleString()} EUR on the customs value.`,
    },
    {
      question: `Is the ${car.name} subject to an age surcharge in ${country.name}?`,
      answer: `${car.ageEstimate > 5 ? `Yes, with an estimated age of ${car.ageEstimate} years, a ${cost.ageMultiplier}x multiplier is applied to the CIF value.` : `No, with an estimated age of ${car.ageEstimate} years, the standard ${cost.ageMultiplier}x multiplier applies.`}`,
    },
    {
      question: `What is the price of a ${car.name} in Europe before import?`,
      answer: `The average price of a ${car.name} in Europe is approximately ${car.averagePrice.toLocaleString()} EUR. This price serves as the base for calculating import costs.`,
    },
    {
      question: `What documents are needed to import a ${car.name} to ${country.name}?`,
      answer: `To import a ${car.name} to ${country.name}, you will need the original registration document, certificate of conformity, proof of purchase, technical inspection certificate, and shipping documentation.`,
    },
  ];
}

function getBudgetTier(totalEUR: number): string {
  if (totalEUR <= 15000) return "15000";
  if (totalEUR <= 20000) return "20000";
  if (totalEUR <= 25000) return "25000";
  if (totalEUR <= 30000) return "30000";
  if (totalEUR <= 40000) return "40000";
  if (totalEUR <= 50000) return "50000";
  return "80000";
}

export default async function CarImportPage({
  params,
}: {
  params: Promise<{ lang: string; "country-slug": string; "car-slug": string }>;
}) {
  const { lang, "country-slug": countrySlug, "car-slug": carSlug } = await params;
  const country = countries.find((c) => c.slug === countrySlug);
  const car = cars.find((c) => c.slug === carSlug);

  if (!country || !car) {
    notFound();
  }

  const cost = await calculateWithLiveRates(
    car.averagePrice,
    car.ageEstimate,
    car.fuelType as "petrol" | "diesel",
    countrySlug
  );

  const faqs = getFAQs(car, country, cost, lang);

  const breadcrumbs = [
    { label: lang === "fr" ? "Accueil" : "Home", href: `/${lang}` },
    { label: country.name, href: `/${lang}/${countrySlug}` },
    { label: car.name, href: `/${lang}/${countrySlug}/import/${carSlug}` },
  ];

  // Cost breakdown items for visual display
  const breakdownItems = [
    {
      label: lang === "fr" ? "Prix du vehicule" : "Car Price",
      valueEUR: cost.carPrice,
      valueLocal: cost.carPrice * cost.eurToLocalRate,
      color: "#1a1f36",
    },
    {
      label: lang === "fr" ? "Transport & Assurance" : "Transport & Insurance",
      valueEUR: cost.transportCost,
      valueLocal: cost.transportCost * cost.eurToLocalRate,
      color: "#6366f1",
    },
    {
      label: lang === "fr" ? "Droits de douane" : "Customs Duty",
      valueEUR: cost.dutyAmount,
      valueLocal: cost.dutyAmount * cost.eurToLocalRate,
      color: "#f59e0b",
    },
    {
      label: lang === "fr" ? "TVA" : "VAT",
      valueEUR: cost.vatAmount,
      valueLocal: cost.vatAmount * cost.eurToLocalRate,
      color: "#10b981",
    },
    {
      label: lang === "fr" ? "Frais fixes" : "Fixed Fees",
      valueEUR: cost.feesEUR,
      valueLocal: cost.feesLocal,
      color: "#ec4899",
    },
  ];

  // Same brand cars in this country
  const sameBrandCars = cars
    .filter((c) => c.brand === car.brand && c.slug !== car.slug)
    .slice(0, 4);

  // Same car in other countries
  const otherCountries = countries.filter((c) => c.slug !== countrySlug).slice(0, 5);

  // Budget page link
  const budgetTier = getBudgetTier(cost.totalEUR);

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Car",
        name: car.name,
        brand: {
          "@type": "Brand",
          name: car.brand,
        },
        fuelType: car.fuelType === "petrol" ? "Gasoline" : "Diesel",
        vehicleModelDate: String(new Date().getFullYear() - car.ageEstimate),
        offers: {
          "@type": "Offer",
          price: cost.totalEUR,
          priceCurrency: "EUR",
          description: `Total import cost to ${country.name}`,
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      {/* H1 Title */}
      <section className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1a1f36] mb-3">
          {lang === "fr"
            ? `Importer ${car.name} en ${country.name}`
            : `Import ${car.name} to ${country.name}`}
        </h1>
        <p className="text-lg text-gray-600">
          {lang === "fr"
            ? `Cout total estime: `
            : `Total estimated cost: `}
          <span className="font-bold text-[#10b981] text-xl">
            &euro;{cost.totalEUR.toLocaleString()}
          </span>
          <span className="text-gray-400 ml-2">
            ({cost.totalLocal.toLocaleString()} {cost.currency})
          </span>
        </p>
      </section>

      {/* Car Info Card */}
      <section className="mb-10">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-[#1a1f36] mb-4">
            {lang === "fr" ? "Informations du vehicule" : "Vehicle Information"}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">
                {lang === "fr" ? "Prix Europe" : "EU Price"}
              </p>
              <p className="text-lg font-semibold text-[#1a1f36]">
                &euro;{car.averagePrice.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">
                {lang === "fr" ? "Carburant" : "Fuel Type"}
              </p>
              <p className="text-lg font-semibold text-[#1a1f36]">
                {car.fuelType === "petrol"
                  ? lang === "fr" ? "Essence" : "Petrol"
                  : "Diesel"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">
                {lang === "fr" ? "Age estime" : "Estimated Age"}
              </p>
              <p className="text-lg font-semibold text-[#1a1f36]">
                {car.ageEstimate} {lang === "fr" ? "ans" : "years"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">
                {lang === "fr" ? "Categorie" : "Category"}
              </p>
              <p className="text-lg font-semibold text-[#1a1f36] capitalize">
                {car.category}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">
                {lang === "fr" ? "Marque" : "Brand"}
              </p>
              <p className="text-lg font-semibold text-[#1a1f36]">{car.brand}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Full Cost Breakdown */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-[#1a1f36] mb-6">
          {lang === "fr" ? "Detail complet des couts" : "Full Cost Breakdown"}
        </h2>
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          {/* Summary row */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <div>
              <p className="text-sm text-gray-500">
                {lang === "fr" ? "Valeur CIF" : "CIF Value"}
              </p>
              <p className="text-lg font-semibold text-[#1a1f36]">
                &euro;{cost.cif.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">
                {lang === "fr" ? "Valeur en douane" : "Customs Value"}
              </p>
              <p className="text-lg font-semibold text-[#1a1f36]">
                &euro;{cost.customsValue.toLocaleString()}
                <span className="text-xs text-gray-400 ml-1">
                  (x{cost.ageMultiplier})
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">
                {lang === "fr" ? "Taux de change" : "Exchange Rate"}
              </p>
              <p className="text-lg font-semibold text-[#1a1f36]">
                1 EUR = {cost.eurToLocalRate} {cost.currency}
              </p>
            </div>
          </div>

          {/* Visual breakdown bars */}
          <div className="space-y-4">
            {breakdownItems.map((item) => {
              const percentage = (item.valueEUR / cost.totalEUR) * 100;
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {item.label}
                    </span>
                    <span className="text-sm font-semibold text-[#1a1f36]">
                      &euro;{Math.round(item.valueEUR).toLocaleString()}
                      <span className="text-xs text-gray-400 ml-1">
                        ({Math.round(item.valueLocal).toLocaleString()} {cost.currency})
                      </span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div
                      className="h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(percentage, 1)}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {percentage.toFixed(1)}% {lang === "fr" ? "du total" : "of total"}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Total */}
          <div className="mt-6 pt-4 border-t-2 border-[#10b981]">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-[#1a1f36]">
                {lang === "fr" ? "COUT TOTAL" : "TOTAL COST"}
              </span>
              <div className="text-right">
                <p className="text-2xl font-bold text-[#10b981]">
                  &euro;{cost.totalEUR.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  {cost.totalLocal.toLocaleString()} {cost.currency}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Paragraph */}
      <section className="mb-10">
        <div className="bg-gradient-to-r from-[#1a1f36] to-[#2d3250] rounded-xl p-6 text-white">
          <p className="leading-relaxed">
            {lang === "fr"
              ? `Le cout total d'importation d'une ${car.name} depuis l'Europe vers ${country.name} est d'environ ${cost.totalEUR.toLocaleString()} EUR (${cost.totalLocal.toLocaleString()} ${cost.currency}). Ce montant comprend le prix du vehicule (${car.averagePrice.toLocaleString()} EUR), le transport et l'assurance (${cost.transportCost.toLocaleString()} EUR), les droits de douane de ${(cost.dutyRate * 100).toFixed(0)}% (${cost.dutyAmount.toLocaleString()} EUR), la TVA de ${(cost.vatRate * 100).toFixed(0)}% (${cost.vatAmount.toLocaleString()} EUR), et les frais administratifs fixes (${cost.feesEUR.toLocaleString()} EUR). Le vehicule etant une ${car.fuelType === "petrol" ? "essence" : "diesel"} d'environ ${car.ageEstimate} ans, un multiplicateur d'age de ${cost.ageMultiplier}x est applique a la valeur CIF.`
              : `The total cost of importing a ${car.name} from Europe to ${country.name} is approximately \u20AC${cost.totalEUR.toLocaleString()} (${cost.totalLocal.toLocaleString()} ${cost.currency}). This includes the vehicle price (\u20AC${car.averagePrice.toLocaleString()}), transport and insurance (\u20AC${cost.transportCost.toLocaleString()}), customs duty at ${(cost.dutyRate * 100).toFixed(0)}% (\u20AC${cost.dutyAmount.toLocaleString()}), VAT at ${(cost.vatRate * 100).toFixed(0)}% (\u20AC${cost.vatAmount.toLocaleString()}), and fixed administrative fees (\u20AC${cost.feesEUR.toLocaleString()}). As a ${car.fuelType} vehicle approximately ${car.ageEstimate} years old, an age multiplier of ${cost.ageMultiplier}x is applied to the CIF value.`}
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-[#1a1f36] mb-6">
          {lang === "fr"
            ? `FAQ - ${car.name} en ${country.name}`
            : `FAQ - ${car.name} to ${country.name}`}
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

      {/* Internal Links: Same car in other countries */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-[#1a1f36] mb-4">
          {lang === "fr"
            ? `Importer ${car.name} dans d'autres pays`
            : `Import ${car.name} to Other Countries`}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {await Promise.all(otherCountries.map(async (c) => {
            const otherCost = await calculateWithLiveRates(
              car.averagePrice,
              car.ageEstimate,
              car.fuelType as "petrol" | "diesel",
              c.slug
            );
            return (
              <Link
                key={c.slug}
                href={`/${lang}/${c.slug}/import/${car.slug}`}
                className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:border-[#f59e0b]/30 hover:shadow-md transition-all"
              >
                <span className="font-medium text-[#1a1f36]">{c.name}</span>
                <span className="text-sm font-bold text-[#10b981]">
                  &euro;{otherCost.totalEUR.toLocaleString()}
                </span>
              </Link>
            );
          }))}
        </div>
      </section>

      {/* Internal Links: Same brand cars in this country */}
      {sameBrandCars.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#1a1f36] mb-4">
            {lang === "fr"
              ? `Autres ${car.brand} a importer en ${country.name}`
              : `Other ${car.brand} Cars to Import to ${country.name}`}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {await Promise.all(sameBrandCars.map(async (c) => {
              const brandCost = await calculateWithLiveRates(
                c.averagePrice,
                c.ageEstimate,
                c.fuelType as "petrol" | "diesel",
                countrySlug
              );
              return (
                <Link
                  key={c.slug}
                  href={`/${lang}/${countrySlug}/import/${c.slug}`}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:border-[#f59e0b]/30 hover:shadow-md transition-all"
                >
                  <p className="font-medium text-[#1a1f36] mb-1">{c.name}</p>
                  <p className="text-sm text-[#10b981] font-bold">
                    &euro;{brandCost.totalEUR.toLocaleString()}
                  </p>
                </Link>
              );
            }))}
          </div>
        </section>
      )}

      {/* Budget page link */}
      <section className="mb-10">
        <Link
          href={`/${lang}/${countrySlug}/cars-under-${budgetTier}`}
          className="block bg-gradient-to-r from-[#f59e0b] to-[#f97316] rounded-xl p-5 text-white hover:opacity-90 transition-opacity"
        >
          <p className="font-bold text-lg">
            {lang === "fr"
              ? `Voir toutes les voitures de moins de ${Number(budgetTier).toLocaleString()} EUR a importer en ${country.name}`
              : `See All Cars Under \u20AC${Number(budgetTier).toLocaleString()} to Import to ${country.name}`}
          </p>
          <p className="text-sm text-white/80 mt-1">
            {lang === "fr"
              ? "Comparez les options dans votre budget"
              : "Compare options within your budget"}
          </p>
        </Link>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
