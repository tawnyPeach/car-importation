import { ImportCostBreakdown } from "@/lib/calculator";

interface CostBreakdownProps {
  results: ImportCostBreakdown;
  lang?: string;
}

export default function CostBreakdown({ results, lang = "en" }: CostBreakdownProps) {
  const total = results.totalEUR;
  const items = [
    { label: lang === "fr" ? "Prix du Vehicule" : "Car Price", value: results.carPrice, color: "bg-blue-500" },
    { label: lang === "fr" ? "Transport & Assurance" : "Transport & Insurance", value: results.transportCost, color: "bg-cyan-500" },
    { label: lang === "fr" ? "Droits de Douane" : "Customs Duty", value: results.dutyAmount, color: "bg-[#10b981]" },
    { label: lang === "fr" ? "TVA" : "VAT", value: results.vatAmount, color: "bg-[#f59e0b]" },
    { label: lang === "fr" ? "Frais Fixes" : "Fixed Fees", value: results.feesEUR, color: "bg-[#1a1f36]" },
  ];

  const formatEUR = (val: number) => val.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const formatLocal = (val: number) => val.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mt-6 animate-fade-in">
      <h3 className="text-xl font-bold text-[#1a1f36] mb-6">
        {lang === "fr" ? "Detail des Couts" : "Cost Breakdown"}
      </h3>

      <div className="space-y-4">
        {items.map((item) => {
          const pct = total > 0 ? (item.value / total) * 100 : 0;
          return (
            <div key={item.label}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">{item.label}</span>
                <span className="text-sm font-semibold text-gray-800">&euro;{formatEUR(item.value)}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div
                  className={`${item.color} h-3 rounded-full transition-all duration-500`}
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>
              <span className="text-xs text-gray-400">{pct.toFixed(1)}%</span>
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className="mt-6 p-4 bg-gradient-to-r from-[#1a1f36] to-[#2d3354] rounded-xl text-white">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">
            {lang === "fr" ? "Cout Total" : "Total Cost"}
          </span>
          <div className="text-right">
            <p className="text-2xl font-bold">&euro;{formatEUR(results.totalEUR)}</p>
            <p className="text-sm text-gray-300">
              {formatLocal(results.totalLocal)} {results.currency}
            </p>
          </div>
        </div>
      </div>

      {/* Exchange rate */}
      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm text-amber-800">
          {lang === "fr" ? "Taux de change" : "Exchange rate"}: 1 EUR = {results.eurToLocalRate} {results.currency}
        </p>
      </div>
    </div>
  );
}
