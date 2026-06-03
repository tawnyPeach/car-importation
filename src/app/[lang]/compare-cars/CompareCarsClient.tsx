"use client";

import { useState } from "react";
import countries from "@/data/countries.json";
import cars from "@/data/cars.json";
import { calculateImportCost, type ImportCostBreakdown } from "@/lib/calculator";

interface ComparisonResult {
  carName: string;
  breakdown: ImportCostBreakdown;
}

export default function CompareCarsClient({ lang }: { lang: string }) {
  const [selectedCountry, setSelectedCountry] = useState(countries[0].slug);
  const [selectedCars, setSelectedCars] = useState<string[]>(["", "", ""]);
  const [results, setResults] = useState<ComparisonResult[]>([]);
  const [error, setError] = useState("");

  const handleCarChange = (index: number, value: string) => {
    const updated = [...selectedCars];
    updated[index] = value;
    setSelectedCars(updated);
  };

  const handleCompare = () => {
    const chosen = selectedCars.filter((slug) => slug !== "");

    if (chosen.length < 2) {
      setError(
        lang === "fr"
          ? "Veuillez selectionner au moins 2 vehicules a comparer."
          : "Please select at least 2 vehicles to compare."
      );
      setResults([]);
      return;
    }

    setError("");

    const comparisons: ComparisonResult[] = chosen.map((carSlug) => {
      const car = cars.find((c) => c.slug === carSlug)!;
      const breakdown = calculateImportCost(
        car.averagePrice,
        car.ageEstimate,
        car.fuelType as "petrol" | "diesel",
        selectedCountry
      );
      return { carName: car.name, breakdown };
    });

    setResults(comparisons);
  };

  const cheapestIndex =
    results.length > 0
      ? results.reduce(
          (minIdx, curr, idx, arr) =>
            curr.breakdown.totalEUR < arr[minIdx].breakdown.totalEUR ? idx : minIdx,
          0
        )
      : -1;

  const formatEUR = (value: number) =>
    new Intl.NumberFormat("en-EU", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {lang === "fr" ? "Pays de destination" : "Destination Country"}
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10b981]"
            >
              {countries.map((country) => (
                <option key={country.slug} value={country.slug}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {selectedCars.map((selected, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {lang === "fr" ? `Vehicule ${index + 1}` : `Vehicle ${index + 1}`}
                {index < 2 && <span className="text-red-500 ml-1">*</span>}
              </label>
              <select
                value={selected}
                onChange={(e) => handleCarChange(index, e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10b981]"
              >
                <option value="">
                  {lang === "fr" ? "-- Choisir --" : "-- Select --"}
                </option>
                {cars.map((car) => (
                  <option key={car.slug} value={car.slug}>
                    {car.name} ({formatEUR(car.averagePrice)})
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <button
          onClick={handleCompare}
          className="px-8 py-3 bg-[#10b981] text-white font-semibold rounded-lg hover:bg-[#059669] transition"
        >
          {lang === "fr" ? "Comparer" : "Compare"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#1a1f36] text-white">
                <th className="px-4 py-3 font-semibold">
                  {lang === "fr" ? "Critere" : "Criteria"}
                </th>
                {results.map((r, i) => (
                  <th key={i} className="px-4 py-3 font-semibold">
                    {r.carName}
                    {i === cheapestIndex && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-[#10b981] text-white rounded-full">
                        {lang === "fr" ? "Moins cher" : "Cheapest"}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="px-4 py-3 text-gray-600 font-medium">
                  {lang === "fr" ? "Prix UE" : "EU Price"}
                </td>
                {results.map((r, i) => (
                  <td key={i} className="px-4 py-3">
                    {formatEUR(r.breakdown.carPrice)}
                  </td>
                ))}
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-3 text-gray-600 font-medium">
                  {lang === "fr" ? "Droits de douane" : "Customs Duty"}
                </td>
                {results.map((r, i) => (
                  <td key={i} className="px-4 py-3">
                    {formatEUR(r.breakdown.dutyAmount)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-600 font-medium">
                  {lang === "fr" ? "TVA" : "VAT"}
                </td>
                {results.map((r, i) => (
                  <td key={i} className="px-4 py-3">
                    {formatEUR(r.breakdown.vatAmount)}
                  </td>
                ))}
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-3 text-gray-600 font-medium">
                  {lang === "fr" ? "Frais fixes" : "Fixed Fees"}
                </td>
                {results.map((r, i) => (
                  <td key={i} className="px-4 py-3">
                    {formatEUR(r.breakdown.feesEUR)}
                  </td>
                ))}
              </tr>
              <tr className="font-bold text-lg">
                <td className="px-4 py-4 text-[#1a1f36]">
                  {lang === "fr" ? "Cout total d'importation" : "Total Import Cost"}
                </td>
                {results.map((r, i) => (
                  <td
                    key={i}
                    className={`px-4 py-4 ${
                      i === cheapestIndex ? "text-[#10b981]" : "text-[#1a1f36]"
                    }`}
                  >
                    {formatEUR(r.breakdown.totalEUR)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
