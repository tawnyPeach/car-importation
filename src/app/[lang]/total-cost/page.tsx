import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import TotalCostClient from "./TotalCostClient";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "fr" }];
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Total Cost of Ownership - 5 Year Import Car Cost",
    description:
      "Calculate the total cost of owning an imported car over 1-10 years. Includes depreciation, insurance, fuel, maintenance, and residual value estimation.",
    openGraph: {
      title: "Total Cost of Ownership - 5 Year Import Car Cost",
      description:
        "Calculate the total cost of owning an imported car over 1-10 years including all running costs and depreciation.",
      type: "website",
    },
    alternates: {
      languages: {
        en: "/en/total-cost",
        fr: "/fr/total-cost",
      },
    },
  };
}

export default async function TotalCostPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  const breadcrumbs = [
    { label: lang === "fr" ? "Accueil" : "Home", href: `/${lang}` },
    {
      label: lang === "fr" ? "Cout total de possession" : "Total Cost of Ownership",
      href: `/${lang}/total-cost`,
    },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1a1f36] mb-3">
          {lang === "fr"
            ? "Cout total de possession"
            : "Total Cost of Ownership"}
        </h1>
        <p className="text-lg text-gray-600">
          {lang === "fr"
            ? "Calculez le cout total de possession de votre vehicule importe sur 1 a 10 ans, incluant depreciation, assurance, carburant et entretien."
            : "Calculate the total cost of owning your imported vehicle over 1 to 10 years, including depreciation, insurance, fuel, and maintenance."}
        </p>
      </div>

      <TotalCostClient lang={lang} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Total Cost of Ownership Calculator",
            description:
              "Calculate the total cost of owning an imported car including depreciation, insurance, fuel, and maintenance",
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "EUR",
            },
            featureList: [
              "Year-by-year cost breakdown",
              "Depreciation calculation",
              "Running cost estimation",
              "Residual value projection",
              "Cost per month calculation",
            ],
          }),
        }}
      />
    </>
  );
}
