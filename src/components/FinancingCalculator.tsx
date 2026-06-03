"use client";

import { useState } from "react";

interface FinancingResult {
  monthlyPayment: number;
  totalAmountPaid: number;
  totalInterestPaid: number;
  loanAmount: number;
}

function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  termMonths: number
): FinancingResult {
  const loanAmount = principal;

  if (loanAmount <= 0) {
    return {
      monthlyPayment: 0,
      totalAmountPaid: 0,
      totalInterestPaid: 0,
      loanAmount: 0,
    };
  }

  if (annualRate === 0) {
    const monthlyPayment = loanAmount / termMonths;
    return {
      monthlyPayment,
      totalAmountPaid: loanAmount,
      totalInterestPaid: 0,
      loanAmount,
    };
  }

  const monthlyRate = annualRate / 100 / 12;
  const factor = Math.pow(1 + monthlyRate, termMonths);
  const monthlyPayment = loanAmount * (monthlyRate * factor) / (factor - 1);
  const totalAmountPaid = monthlyPayment * termMonths;
  const totalInterestPaid = totalAmountPaid - loanAmount;

  return {
    monthlyPayment,
    totalAmountPaid,
    totalInterestPaid,
    loanAmount,
  };
}

export default function FinancingCalculator() {
  const [totalCost, setTotalCost] = useState<number>(20000);
  const [downPayment, setDownPayment] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(7);
  const [loanTerm, setLoanTerm] = useState<number>(48);
  const [results, setResults] = useState<FinancingResult | null>(null);

  const handleCalculate = () => {
    const principal = totalCost - downPayment;
    if (principal <= 0) {
      setResults({
        monthlyPayment: 0,
        totalAmountPaid: 0,
        totalInterestPaid: 0,
        loanAmount: 0,
      });
      return;
    }
    const result = calculateMonthlyPayment(principal, interestRate, loanTerm);
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
            <label className={labelClass}>Total Import Cost (EUR)</label>
            <input
              type="number"
              min={0}
              value={totalCost}
              onChange={(e) => setTotalCost(Number(e.target.value))}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Down Payment (EUR)</label>
            <input
              type="number"
              min={0}
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Interest Rate (% annual)</label>
            <input
              type="number"
              min={0}
              max={50}
              step={0.1}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Loan Term (months)</label>
            <select
              value={loanTerm}
              onChange={(e) => setLoanTerm(Number(e.target.value))}
              className={inputClass}
            >
              <option value={12}>12 months</option>
              <option value={24}>24 months</option>
              <option value={36}>36 months</option>
              <option value={48}>48 months</option>
              <option value={60}>60 months</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <button
              onClick={handleCalculate}
              className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              Calculate Monthly Payment
            </button>
          </div>
        </div>
      </div>

      {results && (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-[#1a1f36] mb-4">Payment Summary</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-[#1a1f36] rounded-lg p-4 text-center">
              <p className="text-sm text-gray-300 mb-1">Monthly Payment</p>
              <p className="text-2xl font-bold text-[#10b981]">
                {results.monthlyPayment.toLocaleString("en", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                EUR
              </p>
            </div>

            <div className="bg-[#1a1f36] rounded-lg p-4 text-center">
              <p className="text-sm text-gray-300 mb-1">Total Amount Paid</p>
              <p className="text-2xl font-bold text-white">
                {results.totalAmountPaid.toLocaleString("en", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                EUR
              </p>
            </div>

            <div className="bg-[#1a1f36] rounded-lg p-4 text-center">
              <p className="text-sm text-gray-300 mb-1">Total Interest Paid</p>
              <p className="text-2xl font-bold text-[#f59e0b]">
                {results.totalInterestPaid.toLocaleString("en", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                EUR
              </p>
            </div>

            <div className="bg-[#1a1f36] rounded-lg p-4 text-center">
              <p className="text-sm text-gray-300 mb-1">Loan Amount</p>
              <p className="text-2xl font-bold text-white">
                {results.loanAmount.toLocaleString("en", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                EUR
              </p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-lg font-semibold text-[#1a1f36] mb-3">
              Amortization Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Import Cost</span>
                <span className="font-medium text-[#1a1f36]">
                  {totalCost.toLocaleString("en", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  EUR
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Down Payment</span>
                <span className="font-medium text-[#10b981]">
                  -{downPayment.toLocaleString("en", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  EUR
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Amount Financed</span>
                <span className="font-medium text-[#1a1f36]">
                  {results.loanAmount.toLocaleString("en", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  EUR
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Interest Cost</span>
                <span className="font-medium text-[#f59e0b]">
                  +{results.totalInterestPaid.toLocaleString("en", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  EUR
                </span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
                <span className="text-gray-900 font-semibold">Total You Pay</span>
                <span className="font-bold text-[#1a1f36] text-lg">
                  {(results.totalAmountPaid + downPayment).toLocaleString("en", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  EUR
                </span>
              </div>
            </div>

            {/* Visual bar comparing cost vs what you pay */}
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded bg-[#10b981]"></div>
                <span className="text-xs text-gray-600">
                  Principal ({((results.loanAmount / (results.totalAmountPaid)) * 100).toFixed(1)}%)
                </span>
                <div className="w-3 h-3 rounded bg-[#f59e0b] ml-2"></div>
                <span className="text-xs text-gray-600">
                  Interest ({((results.totalInterestPaid / (results.totalAmountPaid)) * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="w-full h-4 rounded-full overflow-hidden bg-gray-200 flex">
                <div
                  className="h-full bg-[#10b981]"
                  style={{
                    width: `${results.totalAmountPaid > 0 ? (results.loanAmount / results.totalAmountPaid) * 100 : 100}%`,
                  }}
                ></div>
                <div
                  className="h-full bg-[#f59e0b]"
                  style={{
                    width: `${results.totalAmountPaid > 0 ? (results.totalInterestPaid / results.totalAmountPaid) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
