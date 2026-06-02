import { ImportCostBreakdown } from "@/lib/calculator";

interface ResultsCardProps {
  results: ImportCostBreakdown;
}

export default function ResultsCard({ results }: ResultsCardProps) {
  const formatEUR = (val: number) =>
    val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formatMAD = (val: number) =>
    val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mt-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Cost Breakdown</h3>

      {/* Intermediate values section */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Valuation (for duty calculation)
        </p>
        <div className="space-y-2 pl-2 border-l-2 border-gray-200">
          <div className="flex justify-between py-1">
            <span className="text-gray-500 text-sm">Car Price (Europe)</span>
            <span className="font-medium text-sm text-gray-600">&euro;{formatEUR(results.carPrice)}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-500 text-sm">Transport &amp; Insurance (5%)</span>
            <span className="font-medium text-sm text-gray-600">&euro;{formatEUR(results.transportCost)}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-500 text-sm">CIF Value</span>
            <span className="font-medium text-sm text-gray-600">&euro;{formatEUR(results.cif)}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-500 text-sm">Age Multiplier</span>
            <span className="font-medium text-sm text-gray-600">x{results.ageMultiplier}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-500 text-sm">Customs Value</span>
            <span className="font-medium text-sm text-gray-600">&euro;{formatEUR(results.customsValue)}</span>
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 h-px bg-gray-200"></div>
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Costs you pay
        </span>
        <div className="flex-1 h-px bg-gray-200"></div>
      </div>

      {/* Actual cost components */}
      <div className="space-y-3">
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-gray-600">Car Price (Europe)</span>
          <span className="font-medium">&euro;{formatEUR(results.carPrice)}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-gray-600">Transport &amp; Insurance (5%)</span>
          <span className="font-medium">&euro;{formatEUR(results.transportCost)}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-gray-600">
            Import Duty ({(results.dutyRate * 100).toFixed(0)}%)
          </span>
          <span className="font-medium">&euro;{formatEUR(results.dutyAmount)}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-gray-600">VAT (20%)</span>
          <span className="font-medium">&euro;{formatEUR(results.vatAmount)}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-gray-600">Administrative Fees</span>
          <span className="font-medium">&euro;{formatEUR(results.feesEUR)} ({results.feesMAD} MAD)</span>
        </div>

        {/* Total */}
        <div className="flex justify-between py-3 mt-2 bg-blue-50 rounded-lg px-4">
          <span className="text-lg font-bold text-blue-800">Total Cost</span>
          <div className="text-right">
            <p className="text-lg font-bold text-blue-800">&euro;{formatEUR(results.totalEUR)}</p>
            <p className="text-sm text-blue-600">{formatMAD(results.totalMAD)} MAD</p>
          </div>
        </div>
      </div>

      {/* Exchange rate note - clearly visible */}
      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm text-amber-800 font-medium">
          Exchange rate: 1 EUR = {results.eurToMadRate} MAD (approximate)
        </p>
        <p className="text-xs text-amber-600 mt-1">
          Estimates may vary based on actual market conditions.
        </p>
      </div>
    </div>
  );
}
