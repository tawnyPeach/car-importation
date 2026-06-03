"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

export interface CarWithCost {
  name: string;
  slug: string;
  averagePrice: number;
  fuelType: string;
  ageEstimate: number;
  category: string;
  brand: string;
  totalEUR: number;
  totalLocal: number;
  currency: string;
}

interface CarGridWithFiltersProps {
  cars: CarWithCost[];
  lang: string;
  countrySlug: string;
  showFilters?: boolean;
}

type SortOption = "cheapest" | "expensive" | "name" | "newest";
type FuelFilter = "all" | "petrol" | "diesel";
type CategoryFilter = "all" | "sedan" | "suv" | "hatchback" | "luxury" | "compact";
type PriceFilter = "all" | "under10" | "10to20" | "20to30" | "over30";

export default function CarGridWithFilters({
  cars,
  lang,
  countrySlug,
  showFilters = true,
}: CarGridWithFiltersProps) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("cheapest");
  const [fuelFilter, setFuelFilter] = useState<FuelFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filteredCars = useMemo(() => {
    let result = [...cars];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((car) => car.name.toLowerCase().includes(q));
    }

    // Fuel filter
    if (fuelFilter !== "all") {
      result = result.filter((car) => car.fuelType === fuelFilter);
    }

    // Category filter
    if (categoryFilter !== "all") {
      result = result.filter((car) => car.category === categoryFilter);
    }

    // Price filter
    if (priceFilter !== "all") {
      result = result.filter((car) => {
        const price = car.totalEUR;
        switch (priceFilter) {
          case "under10":
            return price < 10000;
          case "10to20":
            return price >= 10000 && price < 20000;
          case "20to30":
            return price >= 20000 && price < 30000;
          case "over30":
            return price >= 30000;
          default:
            return true;
        }
      });
    }

    // Sort
    switch (sort) {
      case "cheapest":
        result.sort((a, b) => a.totalEUR - b.totalEUR);
        break;
      case "expensive":
        result.sort((a, b) => b.totalEUR - a.totalEUR);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
        result.sort((a, b) => a.ageEstimate - b.ageEstimate);
        break;
    }

    return result;
  }, [cars, search, sort, fuelFilter, categoryFilter, priceFilter]);

  const sortLabels: Record<SortOption, string> = {
    cheapest: lang === "fr" ? "Moins cher d'abord" : "Cheapest first",
    expensive: lang === "fr" ? "Plus cher d'abord" : "Most expensive first",
    name: lang === "fr" ? "Nom A-Z" : "Name A-Z",
    newest: lang === "fr" ? "Plus recent d'abord" : "Newest first",
  };

  const fuelLabels: Record<FuelFilter, string> = {
    all: lang === "fr" ? "Tous" : "All",
    petrol: lang === "fr" ? "Essence" : "Petrol",
    diesel: "Diesel",
  };

  const categoryLabels: Record<CategoryFilter, string> = {
    all: lang === "fr" ? "Toutes" : "All",
    sedan: "Sedan",
    suv: "SUV",
    hatchback: "Hatchback",
    luxury: "Luxury",
    compact: "Compact",
  };

  const priceLabels: Record<PriceFilter, string> = {
    all: lang === "fr" ? "Tous les prix" : "All prices",
    under10: lang === "fr" ? "Moins de 10k\u20AC" : "Under \u20AC10k",
    "10to20": "\u20AC10-20k",
    "20to30": "\u20AC20-30k",
    over30: "\u20AC30k+",
  };

  return (
    <div>
      {showFilters && (
        <>
          {/* Mobile filter toggle */}
          <div className="md:hidden mb-4">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="w-full flex items-center justify-between bg-white rounded-xl shadow-md border border-gray-100 p-4 text-[#1a1f36] font-semibold"
            >
              <span>{lang === "fr" ? "Filtres et tri" : "Filters & Sort"}</span>
              <span
                className={`transition-transform ${filtersOpen ? "rotate-180" : ""}`}
              >
                &#9662;
              </span>
            </button>
          </div>

          {/* Filters panel */}
          <div
            className={`${filtersOpen ? "block" : "hidden"} md:block bg-white rounded-xl shadow-md border border-gray-100 p-5 mb-6`}
          >
            {/* Search */}
            <div className="mb-4">
              <input
                type="text"
                placeholder={
                  lang === "fr" ? "Rechercher un vehicule..." : "Search by car name..."
                }
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10b981]/50 focus:border-[#10b981] text-[#1a1f36]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Sort */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {lang === "fr" ? "Trier par" : "Sort by"}
                </label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm text-[#1a1f36] focus:outline-none focus:ring-2 focus:ring-[#10b981]/50"
                >
                  {Object.entries(sortLabels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fuel type */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {lang === "fr" ? "Carburant" : "Fuel Type"}
                </label>
                <select
                  value={fuelFilter}
                  onChange={(e) => setFuelFilter(e.target.value as FuelFilter)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm text-[#1a1f36] focus:outline-none focus:ring-2 focus:ring-[#10b981]/50"
                >
                  {Object.entries(fuelLabels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {lang === "fr" ? "Categorie" : "Category"}
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) =>
                    setCategoryFilter(e.target.value as CategoryFilter)
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm text-[#1a1f36] focus:outline-none focus:ring-2 focus:ring-[#10b981]/50"
                >
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price range */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {lang === "fr" ? "Budget" : "Price Range"}
                </label>
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value as PriceFilter)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm text-[#1a1f36] focus:outline-none focus:ring-2 focus:ring-[#10b981]/50"
                >
                  {Object.entries(priceLabels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {lang === "fr"
            ? `Affichage de ${filteredCars.length} sur ${cars.length} vehicules`
            : `Showing ${filteredCars.length} of ${cars.length} cars`}
        </p>
      </div>

      {/* Car cards grid */}
      {filteredCars.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">
            {lang === "fr"
              ? "Aucun vehicule ne correspond a vos criteres."
              : "No cars match your filters."}
          </p>
          <button
            onClick={() => {
              setSearch("");
              setFuelFilter("all");
              setCategoryFilter("all");
              setPriceFilter("all");
            }}
            className="mt-4 px-4 py-2 bg-[#10b981] text-white rounded-lg hover:bg-[#059669] transition-colors text-sm font-medium"
          >
            {lang === "fr" ? "Reinitialiser les filtres" : "Reset filters"}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCars.map((car) => (
            <Link
              key={car.slug}
              href={`/${lang}/${countrySlug}/import/${car.slug}`}
              className="group block bg-white rounded-xl shadow-md border border-gray-100 p-5 hover:shadow-xl hover:border-[#f59e0b]/30 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600 uppercase">
                  {car.category}
                </span>
                <span className="text-xs text-gray-400">{car.brand}</span>
              </div>
              <h3 className="font-semibold text-[#1a1f36] group-hover:text-[#10b981] transition-colors mb-1">
                {car.name}
              </h3>
              <div className="flex items-center justify-between mt-3">
                <div>
                  <p className="text-xs text-gray-400">
                    {lang === "fr" ? "Prix EU" : "EU Price"}
                  </p>
                  <span className="text-sm font-medium text-gray-700">
                    &euro;{car.averagePrice.toLocaleString()}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">
                    {lang === "fr" ? "Cout total" : "Total Cost"}
                  </p>
                  <span className="text-lg font-bold text-[#10b981]">
                    &euro;{car.totalEUR.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-50 flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {car.totalLocal.toLocaleString()} {car.currency}
                </span>
                <span className="text-xs text-gray-400">
                  {car.fuelType === "petrol"
                    ? lang === "fr"
                      ? "Essence"
                      : "Petrol"
                    : "Diesel"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
