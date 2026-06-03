import type { Metadata } from "next";
import { getTranslation, type Lang } from "@/lib/i18n";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorForm from "@/components/CalculatorForm";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "fr" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const t = (key: string) => getTranslation(lang as Lang, key);

  return {
    title: t("seo.calculatorTitle"),
    description: t("seo.calculatorDesc"),
    openGraph: {
      title: t("seo.calculatorTitle"),
      description: t("seo.calculatorDesc"),
      type: "website",
    },
    alternates: {
      languages: {
        en: "/en/calculator",
        fr: "/fr/calculator",
      },
    },
  };
}

export default async function CalculatorPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = (key: string) => getTranslation(lang as Lang, key);

  const breadcrumbs = [
    { label: t("nav.home"), href: `/${lang}` },
    { label: t("nav.calculator"), href: `/${lang}/calculator` },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1a1f36] mb-3">
          {t("calculator.title")}
        </h1>
        <p className="text-lg text-gray-600">
          {t("calculator.subtitle")}
        </p>
      </div>

      <CalculatorForm lang={lang} />

      {/* FAQ JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: lang === "fr"
                  ? "Comment le cout d'importation est-il calcule?"
                  : "How is the import cost calculated?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: lang === "fr"
                    ? "Le cout total inclut le prix CIF (cout + assurance + fret), les droits de douane selon le type de carburant, la TVA sur la valeur en douane plus les droits, et les frais fixes du pays."
                    : "The total cost includes the CIF price (cost + insurance + freight), customs duties based on fuel type, VAT on the customs value plus duties, and the country fixed fees.",
                },
              },
              {
                "@type": "Question",
                name: lang === "fr"
                  ? "L'age du vehicule affecte-t-il le cout?"
                  : "Does the vehicle age affect the cost?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: lang === "fr"
                    ? "Oui, les vehicules plus anciens ont un multiplicateur d'age plus eleve qui augmente la valeur en douane. Les voitures de plus de 8 ans ont un multiplicateur de 1.5x."
                    : "Yes, older vehicles have a higher age multiplier that increases the customs value. Cars over 8 years old have a 1.5x multiplier.",
                },
              },
              {
                "@type": "Question",
                name: lang === "fr"
                  ? "Quels pays sont pris en charge?"
                  : "Which countries are supported?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: lang === "fr"
                    ? "Nous couvrons actuellement 10 pays: Maroc, Algerie, Tunisie, Senegal, Cote d'Ivoire, Turquie, Egypte, Nigeria, Ghana et Arabie Saoudite."
                    : "We currently cover 10 countries: Morocco, Algeria, Tunisia, Senegal, Ivory Coast, Turkey, Egypt, Nigeria, Ghana, and Saudi Arabia.",
                },
              },
            ],
          }),
        }}
      />
    </>
  );
}
