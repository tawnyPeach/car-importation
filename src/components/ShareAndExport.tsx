"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";

interface ShareAndExportProps {
  price: number;
  age: number;
  fuelType: "petrol" | "diesel";
  country: string;
  carName?: string;
  lang: string;
  results: {
    carPrice: number;
    transportCost: number;
    cif: number;
    ageMultiplier: number;
    customsValue: number;
    dutyRate: number;
    dutyAmount: number;
    vatRate: number;
    vatAmount: number;
    feesEUR: number;
    totalEUR: number;
    totalLocal: number;
    currency: string;
  };
}

export default function ShareAndExport({
  price,
  age,
  fuelType,
  country,
  carName,
  lang,
  results,
}: ShareAndExportProps) {
  const [copied, setCopied] = useState(false);

  const handleShareLink = async () => {
    const params = new URLSearchParams({
      price: String(price),
      age: String(age),
      fuel: fuelType,
      country: country,
    });
    const url = `${window.location.origin}/${lang}/calculator?${params.toString()}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const formatEUR = (val: number) =>
      val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    let y = 20;

    // Title
    doc.setFontSize(20);
    doc.setTextColor(26, 31, 54); // navy
    doc.text("Car Import Cost Estimate", 20, y);
    y += 15;

    // Car info
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    if (carName) {
      doc.text(`Vehicle: ${carName}`, 20, y);
      y += 8;
    }
    doc.text(`Price: EUR ${formatEUR(price)}`, 20, y);
    y += 8;
    doc.text(`Age: ${age} year${age !== 1 ? "s" : ""}`, 20, y);
    y += 8;
    doc.text(`Fuel Type: ${fuelType.charAt(0).toUpperCase() + fuelType.slice(1)}`, 20, y);
    y += 8;
    doc.text(`Destination: ${country}`, 20, y);
    y += 15;

    // Cost breakdown table header
    doc.setFontSize(14);
    doc.setTextColor(26, 31, 54);
    doc.text("Cost Breakdown", 20, y);
    y += 10;

    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);

    const rows = [
      ["Car Price (EUR)", formatEUR(results.carPrice)],
      ["Transport & Insurance", formatEUR(results.transportCost)],
      ["CIF Value", formatEUR(results.cif)],
      [`Age Multiplier`, `x${results.ageMultiplier}`],
      ["Customs Value", formatEUR(results.customsValue)],
      [`Duty (${(results.dutyRate * 100).toFixed(1)}%)`, formatEUR(results.dutyAmount)],
      [`VAT (${(results.vatRate * 100).toFixed(1)}%)`, formatEUR(results.vatAmount)],
      ["Fixed Fees (EUR)", formatEUR(results.feesEUR)],
    ];

    rows.forEach(([label, value]) => {
      doc.text(label, 20, y);
      doc.text(`EUR ${value}`, 130, y);
      y += 8;
    });

    y += 5;

    // Total
    doc.setFontSize(13);
    doc.setTextColor(16, 185, 129); // emerald
    doc.text("Total (EUR):", 20, y);
    doc.text(`EUR ${formatEUR(results.totalEUR)}`, 130, y);
    y += 8;

    doc.setTextColor(245, 158, 11); // gold
    doc.text(`Total (${results.currency}):`, 20, y);
    doc.text(
      `${results.totalLocal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${results.currency}`,
      130,
      y
    );
    y += 20;

    // Disclaimer
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text("This is an estimate only. Actual costs may vary based on current regulations and exchange rates.", 20, y);
    y += 8;
    doc.text(`Generated on: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, 20, y);

    doc.save("car-import-estimate.pdf");
  };

  return (
    <div className="flex flex-wrap gap-3 mt-4">
      <div className="relative">
        <button
          onClick={handleShareLink}
          className="inline-flex items-center gap-2 bg-[#1a1f36] hover:bg-[#2d3354] text-white font-medium py-2.5 px-5 rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          {lang === "fr" ? "Partager le lien" : "Share Link"}
        </button>
        {copied && (
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#10b981] text-white text-xs font-medium py-1 px-3 rounded-md shadow-lg whitespace-nowrap">
            {lang === "fr" ? "Copie !" : "Copied!"}
          </span>
        )}
      </div>

      <button
        onClick={handleDownloadPDF}
        className="inline-flex items-center gap-2 bg-[#f59e0b] hover:bg-[#d97706] text-white font-medium py-2.5 px-5 rounded-lg shadow-md hover:shadow-lg transition-all"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        {lang === "fr" ? "Telecharger PDF" : "Download PDF"}
      </button>
    </div>
  );
}
