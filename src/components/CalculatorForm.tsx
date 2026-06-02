"use client";

import { useState } from "react";
import { calculateImportCost, ImportCostBreakdown } from "@/lib/calculator";
import ResultsCard from "./ResultsCard";

interface CalculatorFormProps {
  defaultPrice?: number;
  defaultAge?: number;
  defaultFuelType?: "petrol" | "diesel";
}

export default function CalculatorForm({
  defaultPrice,
  defaultAge,
  defaultFuelType,
}: CalculatorFormProps) {
  const [price, setPrice] = useState<string>(defaultPrice?.toString() || "");
  const [age, setAge] = useState<string>(defaultAge?.toString() || "");
  const [fuelType, setFuelType] = useState<"petrol" | "diesel">(
    defaultFuelType || "petrol"
  );
  const [results, setResults] = useState<ImportCostBreakdown | null>(
    defaultPrice && defaultAge
      ? calculateImportCost(defaultPrice, defaultAge, defaultFuelType || "petrol")
      : null
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(price);
    const ageNum = parseFloat(age);
    if (isNaN(priceNum) || isNaN(ageNum) || priceNum <= 0 || ageNum < 0) return;
    const result = calculateImportCost(priceNum, ageNum, fuelType);
    setResults(result);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Car Price (EUR)
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 15000"
              min="0"
              step="100"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
              Car Age (years)
            </label>
            <input
              type="number"
              id="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g. 5"
              min="0"
              max="30"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
          <div>
            <label htmlFor="fuelType" className="block text-sm font-medium text-gray-700 mb-1">
              Fuel Type
            </label>
            <select
              id="fuelType"
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value as "petrol" | "diesel")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            >
              <option value="petrol">Petrol (Essence)</option>
              <option value="diesel">Diesel (Gasoil)</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition shadow-md hover:shadow-lg"
        >
          Calculate Import Cost
        </button>
      </form>
      {results && <ResultsCard results={results} />}
    </div>
  );
}
