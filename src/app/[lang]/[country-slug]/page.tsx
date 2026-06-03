import type { Metadata } from "next";
import { notFound } from "next/navigation";
import countries from "@/data/countries.json";
import cars from "@/data/cars.json";
import { calculateWithLiveRates } from "@/lib/calculate-with-live-rates";
import Breadcrumbs from "@/components/Breadcrumbs";
import CarGridWithFilters from "@/components/CarGridWithFilters";
import type { CarWithCost } from "@/components/CarGridWithFilters";

export function generateStaticParams() {
  const params: { lang: string; "country-slug": string }[] = [];
  for (const lang of ["en", "fr"]) {
    for (const country of countries) {
      params.push({ lang, "country-slug": country.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; "country-slug": string }>;
}): Promise<Metadata> {
  const { lang, "country-slug": countrySlug } = await params;
  const country = countries.find((c) => c.slug === countrySlug);

  if (!country) {
    return { title: "Country Not Found" };
  }

  const title = `Import a Car to ${country.name} - Costs & Guide | Car Import Calculator`;
  const description =
    lang === "fr"
      ? `Calculez les frais d'importation de voiture vers ${country.name}. Droits de douane, TVA, frais fixes et cout total.`
      : `Calculate car import costs to ${country.name}. Customs duty, VAT, fixed fees, and total landed cost.`;

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
        en: `/en/${countrySlug}`,
        fr: `/fr/${countrySlug}`,
      },
    },
  };
}

function getCountryFlag(slug: string): string {
  const flags: Record<string, string> = {
    morocco: "\u{1F1F2}\u{1F1E6}",
    algeria: "\u{1F1E9}\u{1F1FF}",
    tunisia: "\u{1F1F9}\u{1F1F3}",
    senegal: "\u{1F1F8}\u{1F1F3}",
    "ivory-coast": "\u{1F1E8}\u{1F1EE}",
    turkey: "\u{1F1F9}\u{1F1F7}",
    egypt: "\u{1F1EA}\u{1F1EC}",
    nigeria: "\u{1F1F3}\u{1F1EC}",
    ghana: "\u{1F1EC}\u{1F1ED}",
    "saudi-arabia": "\u{1F1F8}\u{1F1E6}",
  };
  return flags[slug] || "\u{1F30D}";
}

function getFAQs(country: typeof countries[number], lang: string) {
  if (lang === "fr") {
    return [
      {
        question: `Quels sont les droits de douane pour importer une voiture en ${country.name} ?`,
        answer: `Les droits de douane en ${country.name} sont de ${(country.dutyPetrol * 100).toFixed(0)}% pour les vehicules essence et ${(country.dutyDiesel * 100).toFixed(0)}% pour les vehicules diesel, appliques sur la valeur CIF du vehicule.`,
      },
      {
        question: `Quel est le taux de TVA sur les voitures importees en ${country.name} ?`,
        answer: `La TVA en ${country.name} est de ${(country.vat * 100).toFixed(0)}%, calculee sur la valeur en douane plus les droits de douane.`,
      },
      {
        question: `Combien coutent les frais fixes d'importation en ${country.name} ?`,
        answer: `Les frais fixes d'importation en ${country.name} sont d'environ ${country.fixedFees.toLocaleString()} ${country.currency}, couvrant l'immatriculation, l'inspection technique et les frais administratifs.`,
      },
      {
        question: `L'age du vehicule affecte-t-il le cout d'importation en ${country.name} ?`,
        answer: `Oui, les vehicules de plus de 5 ans sont soumis a un multiplicateur d'age qui augmente la valeur en douane, ce qui rend l'importation de vehicules plus anciens plus couteuse.`,
      },
    ];
  }

  return [
    {
      question: `What are the customs duties for importing a car to ${country.name}?`,
      answer: `Customs duties in ${country.name} are ${(country.dutyPetrol * 100).toFixed(0)}% for petrol vehicles and ${(country.dutyDiesel * 100).toFixed(0)}% for diesel vehicles, applied on the CIF value of the vehicle.`,
    },
    {
      question: `What is the VAT rate on imported cars in ${country.name}?`,
      answer: `The VAT rate in ${country.name} is ${(country.vat * 100).toFixed(0)}%, calculated on the customs value plus duty amount.`,
    },
    {
      question: `How much are the fixed import fees in ${country.name}?`,
      answer: `Fixed import fees in ${country.name} are approximately ${country.fixedFees.toLocaleString()} ${country.currency}, covering registration, technical inspection, and administrative costs.`,
    },
    {
      question: `Does the vehicle age affect import cost in ${country.name}?`,
      answer: `Yes, vehicles older than 5 years are subject to an age multiplier that increases the customs value, making older vehicle imports more expensive.`,
    },
  ];
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ lang: string; "country-slug": string }>;
}) {
  const { lang, "country-slug": countrySlug } = await params;
  const country = countries.find((c) => c.slug === countrySlug);

  if (!country) {
    notFound();
  }

  const flag = getCountryFlag(countrySlug);
  const faqs = getFAQs(country, lang);

  // Calculate costs for all cars at the server level
  const carsWithCosts: CarWithCost[] = await Promise.all(
    cars.map(async (car) => {
      const cost = await calculateWithLiveRates(
        car.averagePrice,
        car.ageEstimate,
        car.fuelType as "petrol" | "diesel",
        countrySlug
      );
      return {
        name: car.name,
        slug: car.slug,
        averagePrice: car.averagePrice,
        fuelType: car.fuelType,
        ageEstimate: car.ageEstimate,
        category: car.category,
        brand: car.brand,
        totalEUR: cost.totalEUR,
        totalLocal: cost.totalLocal,
        currency: cost.currency,
      };
    })
  );

  const breadcrumbs = [
    { label: lang === "fr" ? "Accueil" : "Home", href: `/${lang}` },
    { label: country.name, href: `/${lang}/${countrySlug}` },
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
          {flag} {lang === "fr" ? `Importer une voiture en ${country.name}` : `Import a Car to ${country.name}`}
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl">
          {lang === "fr"
            ? `Decouvrez les couts complets d'importation de vehicules vers ${country.name}, incluant les droits de douane, la TVA et les frais fixes.`
            : `Discover the full costs of importing vehicles to ${country.name}, including customs duties, VAT, and fixed fees.`}
        </p>
      </section>

      {/* Customs Info */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-[#1a1f36] mb-4">
          {lang === "fr" ? "Informations douanieres" : "Customs Information"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5">
            <p className="text-sm text-gray-500 mb-1">
              {lang === "fr" ? "Droits essence" : "Petrol Duty"}
            </p>
            <p className="text-2xl font-bold text-[#1a1f36]">
              {(country.dutyPetrol * 100).toFixed(0)}%
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5">
            <p className="text-sm text-gray-500 mb-1">
              {lang === "fr" ? "Droits diesel" : "Diesel Duty"}
            </p>
            <p className="text-2xl font-bold text-[#1a1f36]">
              {(country.dutyDiesel * 100).toFixed(0)}%
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5">
            <p className="text-sm text-gray-500 mb-1">
              {lang === "fr" ? "TVA" : "VAT"}
            </p>
            <p className="text-2xl font-bold text-[#10b981]">
              {(country.vat * 100).toFixed(0)}%
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5">
            <p className="text-sm text-gray-500 mb-1">
              {lang === "fr" ? "Frais fixes" : "Fixed Fees"}
            </p>
            <p className="text-2xl font-bold text-[#f59e0b]">
              {country.fixedFees.toLocaleString()} {country.currency}
            </p>
          </div>
        </div>
      </section>

      {/* Cars Grid with Filters */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#1a1f36]">
            {lang === "fr"
              ? `Couts d'importation pour ${cars.length} vehicules`
              : `Import Costs for ${cars.length} Vehicles`}
          </h2>
        </div>
        <CarGridWithFilters
          cars={carsWithCosts}
          lang={lang}
          countrySlug={countrySlug}
          showFilters={true}
        />
      </section>

      {/* FAQ Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-[#1a1f36] mb-6">
          {lang === "fr"
            ? `FAQ - Importation de voiture en ${country.name}`
            : `FAQ - Importing a Car to ${country.name}`}
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

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
