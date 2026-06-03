"use client";

import { useState } from "react";
import Link from "next/link";
import cars from "@/data/cars.json";

interface SearchBarProps {
  lang: string;
  countrySlug?: string;
}

export default function SearchBar({ lang, countrySlug = "morocco" }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  const filtered = query.length >= 2
    ? cars.filter((car) =>
        car.name.toLowerCase().includes(query.toLowerCase()) ||
        car.brand.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : [];

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          placeholder={lang === "fr" ? "Rechercher une voiture..." : "Search for a car..."}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent text-gray-900 placeholder-gray-400 transition"
        />
      </div>

      {showResults && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 max-h-80 overflow-y-auto">
          {filtered.map((car) => (
            <Link
              key={car.slug}
              href={`/${lang}/${countrySlug}/import/${car.slug}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">{car.name}</p>
                <p className="text-xs text-gray-500">{car.brand} - {car.category}</p>
              </div>
              <span className="text-sm font-semibold text-[#10b981]">
                &euro;{car.averagePrice.toLocaleString()}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
