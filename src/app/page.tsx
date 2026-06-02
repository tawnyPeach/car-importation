import type { Metadata } from "next";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import cars from "@/data/cars.json";

export const metadata: Metadata = {
  title: "Morocco Car Import Cost Calculator - Calculate Import Costs from Europe",
  description:
    "Calculate the total cost of importing a car from Europe to Morocco. Get instant estimates including customs duty, VAT, transport, and administrative fees for 30+ popular European cars.",
  openGraph: {
    title: "Morocco Car Import Cost Calculator - Calculate Import Costs from Europe",
    description:
      "Calculate the total cost of importing a car from Europe to Morocco. Get instant estimates including customs duty, VAT, transport, and fees.",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-green-600 text-white py-16 px-4 rounded-2xl mb-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Morocco Car Import Cost Calculator
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8">
            Calculate the total cost of importing your car from Europe to Morocco.
            Get instant estimates for customs duty, VAT, transport, and all fees.
          </p>
          <Link
            href="/calculator"
            className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-blue-50 transition"
          >
            Open Calculator
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="mb-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            How Car Import Costs Are Calculated
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Importing a car from Europe to Morocco involves several costs beyond the purchase price.
            You will need to account for transport and insurance (approximately 5% of car value),
            customs duties (25% for petrol or 30% for diesel vehicles), VAT at 20%, and
            administrative fees of around 3,000 MAD. The total cost also depends on the age of the
            vehicle, with older cars attracting higher customs valuations.
          </p>
        </div>
      </section>

      {/* Search and Car Grid */}
      <section className="mb-10 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Popular Cars to Import to Morocco
          </h2>
          <SearchBar cars={cars} />
        </div>
      </section>
    </div>
  );
}
