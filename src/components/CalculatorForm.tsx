"use client";

import { useState } from "react";
import countries from "@/data/countries.json";
import cars from "@/data/cars.json";
import { calculateImportCost, type ImportCostBreakdown } from "@/lib/calculator";
import CostBreakdown from "@/components/CostBreakdown";

export default function CalculatorForm({ lang }: { lang: string }) {
  const [country, setCountry] = useState(countries[0].slug);
  const [selectedCar, setSelectedCar] = useState("");
  const [price, setPrice] = useState<number>(15000);
  const [age, setAge] = useState<number>(4);
  const [fuel, setFuel] = useState<"petrol" | "diesel">("petrol");
  const [results, setResults] = useState<ImportCostBreakdown | null>(null);

  const handleCarSelect = (slug: string) => {
    setSelectedCar(slug);
    if (slug) {
      const car = cars.find((c) => c.slug === slug);
      if (car) {
        setPrice(car.averagePrice);
        setAge(car.ageEstimate);
        setFuel(car.fuelType as "petrol" | "diesel");
      }
    }
  };

  const handleCalculate = () => {
    const result = calculateImportCost(price, age, fuel, country);
    setResults(result);
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass =
    "w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent transition";

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>
              {lang === "fr" ? "Pays de destination" : "Destination Country"}
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className={inputClass}
            >
              {countries.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>
              {lang === "fr" ? "Choisir un vehicule" : "Select a Car"}
            </label>
            <select
              value={selectedCar}
              onChange={(e) => handleCarSelect(e.target.value)}
              className={inputClass}
            >
              <option value="">
                {lang === "fr" ? "-- Prix personnalise --" : "-- Custom Price --"}
              </option>
              {cars.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name} ({c.averagePrice.toLocaleString()} EUR)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>
              {lang === "fr" ? "Prix (EUR)" : "Price (EUR)"}
            </label>
            <input
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              {lang === "fr" ? "Age (annees)" : "Age (years)"}
            </label>
            <input
              type="number"
              min={0}
              max={30}
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              {lang === "fr" ? "Type de carburant" : "Fuel Type"}
            </label>
            <select
              value={fuel}
              onChange={(e) => setFuel(e.target.value as "petrol" | "diesel")}
              className={inputClass}
            >
              <option value="petrol">{lang === "fr" ? "Essence" : "Petrol"}</option>
              <option value="diesel">Diesel</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleCalculate}
              className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              {lang === "fr" ? "Calculer" : "Calculate"}
            </button>
          </div>
        </div>
      </div>

      {results && <CostBreakdown results={results} lang={lang} />}
    </div>
  );
}
