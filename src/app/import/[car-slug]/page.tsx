import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CalculatorForm from "@/components/CalculatorForm";
import FAQSection from "@/components/FAQSection";
import cars from "@/data/cars.json";
import { calculateImportCost } from "@/lib/calculator";

interface PageProps {
  params: Promise<{ "car-slug": string }>;
}

export async function generateStaticParams() {
  return cars.map((car) => ({
    "car-slug": car.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { "car-slug": slug } = await params;
  const car = cars.find((c) => c.slug === slug);
  if (!car) return { title: "Car Not Found" };

  return {
    title: `Import ${car.name} to Morocco - Cost Calculator & Guide`,
    description: `Calculate the total cost of importing a ${car.name} from Europe to Morocco. Average price: ${car.averagePrice.toLocaleString()} EUR. Includes customs duty, VAT, and all fees.`,
    openGraph: {
      title: `Import ${car.name} to Morocco - Cost Calculator & Guide`,
      description: `Calculate the total cost of importing a ${car.name} from Europe to Morocco. Get instant cost breakdown.`,
    },
  };
}

export default async function CarImportPage({ params }: PageProps) {
  const { "car-slug": slug } = await params;
  const car = cars.find((c) => c.slug === slug);
  if (!car) notFound();

  const results = calculateImportCost(
    car.averagePrice,
    car.ageEstimate,
    car.fuelType as "petrol" | "diesel"
  );

  const faqs = [
    {
      question: `How much does it cost to import a ${car.name} to Morocco?`,
      answer: `Based on an average European price of ${car.averagePrice.toLocaleString()} EUR, the total estimated cost to import a ${car.name} to Morocco is approximately ${results.totalEUR.toLocaleString()} EUR (${results.totalMAD.toLocaleString()} MAD), including all customs duties, VAT, transport, and administrative fees.`,
    },
    {
      question: `What is the customs duty rate for a ${car.name}?`,
      answer: `The ${car.name} uses ${car.fuelType} fuel, so the customs duty rate is ${car.fuelType === "diesel" ? "30%" : "25%"}. This is applied to the customs value (CIF adjusted for vehicle age).`,
    },
    {
      question: `How long does it take to import a ${car.name} from Europe to Morocco?`,
      answer: `The import process for a ${car.name} typically takes 2 to 4 weeks from purchase to registration in Morocco. This includes shipping (5-10 days), customs clearance (3-7 days), and vehicle registration (3-5 days).`,
    },
    {
      question: `What documents are needed to import a ${car.name} to Morocco?`,
      answer: `To import a ${car.name}, you will need: the original vehicle registration document, bill of sale, certificate of conformity, insurance certificate, passport copy, and a completed customs declaration form (DUM).`,
    },
    {
      question: `Is it worth importing a ${car.name} from Europe to Morocco?`,
      answer: `A ${car.name} purchased in Europe for around ${car.averagePrice.toLocaleString()} EUR will cost approximately ${results.totalEUR.toLocaleString()} EUR total after import. Compare this with local Moroccan market prices to determine if importing offers savings. European models often have better equipment and maintenance history.`,
    },
  ];

  const schemaOrg = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Car",
        name: car.name,
        fuelType: car.fuelType === "diesel" ? "Diesel" : "Gasoline",
        offers: {
          "@type": "Offer",
          price: car.averagePrice,
          priceCurrency: "EUR",
          description: `Average European market price for ${car.name}`,
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />

      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
        Import {car.name} to Morocco - Cost Calculator
      </h1>
      <p className="text-gray-600 mb-8 text-lg">
        Calculate the complete cost of importing a {car.name} from Europe to Morocco.
        The calculator below is pre-filled with average market values for this model.
      </p>

      <CalculatorForm
        defaultPrice={car.averagePrice}
        defaultAge={car.ageEstimate}
        defaultFuelType={car.fuelType as "petrol" | "diesel"}
      />

      {/* SEO Content Section */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Import {car.name} from Europe to Morocco Cost
        </h2>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 leading-relaxed">
            The {car.name} is one of the most popular European cars imported to Morocco. With an
            average purchase price of {car.averagePrice.toLocaleString()} EUR in Europe, this{" "}
            {car.fuelType} vehicle attracts a customs duty of{" "}
            {car.fuelType === "diesel" ? "30%" : "25%"}. Including transport, insurance, VAT at
            20%, and administrative fees of 3,000 MAD, the total import cost comes to approximately{" "}
            {results.totalEUR.toLocaleString()} EUR ({results.totalMAD.toLocaleString()} MAD).
          </p>
          <p className="text-gray-600 leading-relaxed mt-4">
            With an estimated age of {car.ageEstimate} years, the age multiplier applied to this
            vehicle is {results.ageMultiplier}x, which affects the customs valuation. Newer vehicles
            (under 3 years) receive no age adjustment, while older vehicles attract progressively
            higher customs values.
          </p>
        </div>
      </section>

      <FAQSection faqs={faqs} />
    </div>
  );
}
