import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import VinDecoderClient from "./VinDecoderClient";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "fr" }];
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "VIN Decoder - Decode Any Vehicle Identification Number",
    description:
      "Free VIN decoder tool. Enter any 17-character VIN to instantly decode make, model, year, engine type, fuel type, drive type, and body class.",
    openGraph: {
      title: "VIN Decoder - Decode Any Vehicle Identification Number",
      description:
        "Free VIN decoder tool. Enter any 17-character VIN to instantly decode vehicle details including make, model, year, and engine specifications.",
      type: "website",
    },
    alternates: {
      languages: {
        en: "/en/vin-decoder",
        fr: "/fr/vin-decoder",
      },
    },
  };
}

export default async function VinDecoderPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  const breadcrumbs = [
    { label: lang === "fr" ? "Accueil" : "Home", href: `/${lang}` },
    {
      label: lang === "fr" ? "Decodeur VIN" : "VIN Decoder",
      href: `/${lang}/vin-decoder`,
    },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1a1f36] mb-3">
          {lang === "fr" ? "Decodeur VIN" : "VIN Decoder"}
        </h1>
        <p className="text-lg text-gray-600">
          {lang === "fr"
            ? "Entrez un numero VIN de 17 caracteres pour decoder les informations du vehicule. Utilisez les resultats pour estimer le cout d'importation."
            : "Enter a 17-character VIN to decode vehicle information. Use the results to estimate your import cost."}
        </p>
      </div>

      <VinDecoderClient lang={lang} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "VIN Decoder",
            description:
              "Decode any Vehicle Identification Number to get make, model, year, engine, and fuel type information",
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "EUR",
            },
            featureList: [
              "VIN decoding",
              "Make and model identification",
              "Engine specifications",
              "Fuel type detection",
              "Body class identification",
            ],
          }),
        }}
      />
    </>
  );
}
