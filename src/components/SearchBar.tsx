"use client";

import { useState } from "react";
import CarCard from "./CarCard";

interface Car {
  name: string;
  slug: string;
  averagePrice: number;
  fuelType: string;
  ageEstimate: number;
}

interface SearchBarProps {
  cars: Car[];
}

export default function SearchBar({ cars }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const filteredCars = cars.filter((car) =>
    car.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <div className="relative mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search cars (e.g. BMW, Golf, Peugeot...)"
          className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-lg"
        />
        <svg
          className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
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
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCars.map((car) => (
          <CarCard
            key={car.slug}
            name={car.name}
            slug={car.slug}
            averagePrice={car.averagePrice}
            fuelType={car.fuelType}
          />
        ))}
      </div>
      {filteredCars.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          No cars found matching &quot;{query}&quot;. Try a different search term.
        </p>
      )}
    </div>
  );
}
