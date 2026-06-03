"use client";

import { useState } from "react";

interface YearBreakdown {
  year: number;
  startValue: number;
  depreciation: number;
  endValue: number;
  insurance: number;
  fuel: number;
  maintenance: number;
  yearCost: number;
  cumulativeCost: number;
}

interface TotalCostResult {
  years: YearBreakdown[];
  totalCost: number;
  costPerMonth: number;
  residualValue: number;
}

export default function TotalCostClient({ lang }: { lang: string }) {
  const [importCost, setImportCost] = useState(25000);
  const [annualInsurance, setAnnualInsurance] = useState(500);
  const [annualFuel, setAnnualFuel] = useState(1200);
  const [annualMaintenance, setAnnualMaintenance] = useState(800);
  const [depreciationRate, setDepreciationRate] = useState(15);
  const [ownershipYears, setOwnershipYears] = useState(5);
  const [result, setResult] = useState<TotalCostResult | null>(null);

  const handleCalculate = () => {
    const years: YearBreakdown[] = [];
    let currentValue = importCost;
    let cumulativeCost = importCost;

    for (let year = 1; year <= ownershipYears; year++) {
      const depreciation = currentValue * (depreciationRate / 100);
      const endValue = currentValue - depreciation;
      const yearRunningCost = annualInsurance + annualFuel + annualMaintenance;
      cumulativeCost += yearRunningCost;

      years.push({
        year,
        startValue: Math.round(currentValue),
        depreciation: Math.round(depreciation),
        endValue: Math.round(endValue),
        insurance: annualInsurance,
        fuel: annualFuel,
        maintenance: annualMaintenance,
        yearCost: Math.round(yearRunningCost),
        cumulativeCost: Math.round(cumulativeCost),
      });

      currentValue = endValue;
    }

    const residualValue = Math.round(currentValue);
    const totalCost = Math.round(cumulativeCost);
    const costPerMonth = Math.round(totalCost / (ownershipYears * 12));

    setResult({ years, totalCost, costPerMonth, residualValue });
  };

  const formatEUR = (value: number) =>
    new Intl.NumberFormat("en-EU", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {lang === "fr" ? "Cout d'importation (EUR)" : "Import Cost (EUR)"}
            </label>
            <input
              type="number"
              value={importCost}
              onChange={(e) => setImportCost(Number(e.target.value))}
              min={0}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10b981]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {lang === "fr"
                ? "Assurance annuelle (EUR)"
                : "Annual Insurance (EUR)"}
            </label>
            <input
              type="number"
              value={annualInsurance}
              onChange={(e) => setAnnualInsurance(Number(e.target.value))}
              min={0}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10b981]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {lang === "fr"
                ? "Cout carburant annuel (EUR)"
                : "Annual Fuel Cost (EUR)"}
            </label>
            <input
              type="number"
              value={annualFuel}
              onChange={(e) => setAnnualFuel(Number(e.target.value))}
              min={0}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10b981]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {lang === "fr"
                ? "Entretien annuel (EUR)"
                : "Annual Maintenance (EUR)"}
            </label>
            <input
              type="number"
              value={annualMaintenance}
              onChange={(e) => setAnnualMaintenance(Number(e.target.value))}
              min={0}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10b981]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {lang === "fr"
                ? "Depreciation annuelle (%)"
                : "Annual Depreciation (%)"}
            </label>
            <input
              type="number"
              value={depreciationRate}
              onChange={(e) => setDepreciationRate(Number(e.target.value))}
              min={0}
              max={100}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10b981]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {lang === "fr"
                ? "Periode de possession (ans)"
                : "Ownership Period (years)"}
            </label>
            <select
              value={ownershipYears}
              onChange={(e) => setOwnershipYears(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10b981]"
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((yr) => (
                <option key={yr} value={yr}>
                  {yr} {lang === "fr" ? (yr === 1 ? "an" : "ans") : (yr === 1 ? "year" : "years")}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleCalculate}
          className="px-8 py-3 bg-[#10b981] text-white font-semibold rounded-lg hover:bg-[#059669] transition"
        >
          {lang === "fr" ? "Calculer" : "Calculate"}
        </button>
      </div>

      {result && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 text-center">
              <p className="text-sm text-gray-500 mb-1">
                {lang === "fr" ? "Cout total" : "Total Cost"}
              </p>
              <p className="text-2xl font-bold text-[#1a1f36]">
                {formatEUR(result.totalCost)}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {lang === "fr"
                  ? `sur ${ownershipYears} ans`
                  : `over ${ownershipYears} years`}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 text-center">
              <p className="text-sm text-gray-500 mb-1">
                {lang === "fr" ? "Cout par mois" : "Cost Per Month"}
              </p>
              <p className="text-2xl font-bold text-[#f59e0b]">
                {formatEUR(result.costPerMonth)}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {lang === "fr" ? "moyenne mensuelle" : "monthly average"}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 text-center">
              <p className="text-sm text-gray-500 mb-1">
                {lang === "fr" ? "Valeur residuelle" : "Residual Value"}
              </p>
              <p className="text-2xl font-bold text-[#10b981]">
                {formatEUR(result.residualValue)}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {lang === "fr"
                  ? `apres ${ownershipYears} ans`
                  : `after ${ownershipYears} years`}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#1a1f36] text-white">
                  <th className="px-4 py-3 font-semibold">
                    {lang === "fr" ? "Annee" : "Year"}
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    {lang === "fr" ? "Valeur debut" : "Start Value"}
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    {lang === "fr" ? "Depreciation" : "Depreciation"}
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    {lang === "fr" ? "Couts annuels" : "Annual Costs"}
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    {lang === "fr" ? "Valeur fin" : "End Value"}
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    {lang === "fr" ? "Cout cumule" : "Cumulative Cost"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {result.years.map((yr) => (
                  <tr key={yr.year} className={yr.year % 2 === 0 ? "bg-gray-50" : ""}>
                    <td className="px-4 py-3 font-medium">{yr.year}</td>
                    <td className="px-4 py-3">{formatEUR(yr.startValue)}</td>
                    <td className="px-4 py-3 text-red-500">
                      -{formatEUR(yr.depreciation)}
                    </td>
                    <td className="px-4 py-3">{formatEUR(yr.yearCost)}</td>
                    <td className="px-4 py-3">{formatEUR(yr.endValue)}</td>
                    <td className="px-4 py-3 font-semibold">
                      {formatEUR(yr.cumulativeCost)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="font-semibold text-[#1a1f36] mb-3">
              {lang === "fr" ? "Detail des couts annuels" : "Annual Cost Breakdown"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex justify-between sm:block">
                <span className="text-sm text-gray-500">
                  {lang === "fr" ? "Assurance" : "Insurance"}
                </span>
                <span className="font-medium">{formatEUR(annualInsurance)}</span>
              </div>
              <div className="flex justify-between sm:block">
                <span className="text-sm text-gray-500">
                  {lang === "fr" ? "Carburant" : "Fuel"}
                </span>
                <span className="font-medium">{formatEUR(annualFuel)}</span>
              </div>
              <div className="flex justify-between sm:block">
                <span className="text-sm text-gray-500">
                  {lang === "fr" ? "Entretien" : "Maintenance"}
                </span>
                <span className="font-medium">{formatEUR(annualMaintenance)}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
