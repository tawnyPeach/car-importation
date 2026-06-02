import type { Metadata } from "next";
import CalculatorForm from "@/components/CalculatorForm";

export const metadata: Metadata = {
  title: "Car Import Cost Calculator for Morocco",
  description:
    "Calculate the exact cost of importing any car from Europe to Morocco. Includes customs duty, VAT, transport fees, and administrative costs with instant results.",
  openGraph: {
    title: "Car Import Cost Calculator for Morocco",
    description:
      "Calculate the exact cost of importing any car from Europe to Morocco. Includes customs duty, VAT, transport fees, and administrative costs.",
  },
};

export default function CalculatorPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
        Car Import Cost Calculator
      </h1>
      <p className="text-gray-600 mb-8 text-lg">
        Enter your car details below to calculate the total import cost from Europe to Morocco,
        including customs duty, VAT, transport, and administrative fees.
      </p>
      <CalculatorForm />
    </div>
  );
}
