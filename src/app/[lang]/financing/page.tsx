import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import FinancingCalculator from "@/components/FinancingCalculator";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "fr" }];
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Car Import Financing Calculator - Monthly Payment Estimator",
    description:
      "Estimate your monthly loan payments for importing a car. Calculate total interest, compare loan terms, and plan your car import financing with our free calculator.",
    openGraph: {
      title: "Car Import Financing Calculator - Monthly Payment Estimator",
      description:
        "Estimate your monthly loan payments for importing a car. Calculate total interest, compare loan terms, and plan your car import financing.",
      type: "website",
    },
    alternates: {
      languages: {
        en: "/en/financing",
        fr: "/fr/financing",
      },
    },
  };
}

export default async function FinancingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  const breadcrumbs = [
    { label: lang === "fr" ? "Accueil" : "Home", href: `/${lang}` },
    {
      label: lang === "fr" ? "Calculateur de Financement" : "Financing Calculator",
      href: `/${lang}/financing`,
    },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1a1f36] mb-3">
          {lang === "fr"
            ? "Calculateur de Financement Auto"
            : "Car Import Financing Calculator"}
        </h1>
        <p className="text-lg text-gray-600">
          {lang === "fr"
            ? "Estimez vos mensualites pour financer l'importation de votre vehicule. Comparez les durees de pret et planifiez votre budget."
            : "Estimate your monthly loan payments for your car import. Compare loan terms, see total interest costs, and plan your financing budget."}
        </p>
      </div>

      <FinancingCalculator />

      {/* Schema.org WebApplication JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Car Import Financing Calculator",
            description:
              "Calculate monthly loan payments for car imports with amortization breakdown",
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "EUR",
            },
            featureList: [
              "Monthly payment calculation",
              "Total interest estimation",
              "Amortization summary",
              "Multiple loan term options",
            ],
          }),
        }}
      />
    </>
  );
}
