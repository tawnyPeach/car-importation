import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import CompareCarsClient from "./CompareCarsClient";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "fr" }];
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Compare Car Import Costs Side by Side",
    description:
      "Compare import costs for multiple cars side by side. See duty, VAT, fees, and total cost for up to 3 vehicles in any destination country.",
    openGraph: {
      title: "Compare Car Import Costs Side by Side",
      description:
        "Compare import costs for multiple cars side by side. See duty, VAT, fees, and total cost for up to 3 vehicles.",
      type: "website",
    },
    alternates: {
      languages: {
        en: "/en/compare-cars",
        fr: "/fr/compare-cars",
      },
    },
  };
}

export default async function CompareCarsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  const breadcrumbs = [
    { label: lang === "fr" ? "Accueil" : "Home", href: `/${lang}` },
    {
      label: lang === "fr" ? "Comparer les voitures" : "Compare Cars",
      href: `/${lang}/compare-cars`,
    },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1a1f36] mb-3">
          {lang === "fr"
            ? "Comparer les voitures cote a cote"
            : "Compare Cars Side by Side"}
        </h1>
        <p className="text-lg text-gray-600">
          {lang === "fr"
            ? "Selectionnez un pays de destination et jusqu'a 3 vehicules pour comparer les couts d'importation."
            : "Select a destination country and up to 3 vehicles to compare import costs side by side."}
        </p>
      </div>

      <CompareCarsClient lang={lang} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Car Import Cost Comparison Tool",
            description:
              "Compare import costs for multiple cars side by side including duty, VAT, and fees",
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "EUR",
            },
            featureList: [
              "Side-by-side cost comparison",
              "Multiple country support",
              "Duty and VAT breakdown",
              "Cheapest option highlighting",
            ],
          }),
        }}
      />
    </>
  );
}
