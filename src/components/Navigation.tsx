"use client";

import { useState } from "react";
import Link from "next/link";
import countries from "@/data/countries.json";
import DarkModeToggle from "@/components/DarkModeToggle";

const flags: Record<string, string> = {
  morocco: "\u{1F1F2}\u{1F1E6}",
  algeria: "\u{1F1E9}\u{1F1FF}",
  tunisia: "\u{1F1F9}\u{1F1F3}",
  senegal: "\u{1F1F8}\u{1F1F3}",
  "ivory-coast": "\u{1F1E8}\u{1F1EE}",
  turkey: "\u{1F1F9}\u{1F1F7}",
  egypt: "\u{1F1EA}\u{1F1EC}",
  nigeria: "\u{1F1F3}\u{1F1EC}",
  ghana: "\u{1F1EC}\u{1F1ED}",
  "saudi-arabia": "\u{1F1F8}\u{1F1E6}",
};

export default function Navigation({ lang }: { lang: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [countriesOpen, setCountriesOpen] = useState(false);
  const otherLang = lang === "en" ? "fr" : "en";

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#0f1218]/80 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800">
      <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href={`/${lang}`} className="flex items-center gap-2">
          <svg viewBox="0 0 200 50" className="h-8 w-auto" aria-label="Car Import Calculator">
            <circle cx="25" cy="25" r="18" stroke="#10b981" strokeWidth="2" fill="none"/>
            <ellipse cx="25" cy="25" rx="8" ry="18" stroke="#10b981" strokeWidth="1.5" fill="none"/>
            <line x1="7" y1="25" x2="43" y2="25" stroke="#10b981" strokeWidth="1.5"/>
            <path d="M55 32c0-1.5 1-3 2.5-3.5l5-2 4-6c1-1.5 2.5-2.5 4.5-2.5h14c2 0 3.5 1 4.5 2.5l4 6 5 2c1.5.5 2.5 2 2.5 3.5v4c0 1-1 2-2 2h-3c0-2.5-2-4.5-4.5-4.5s-4.5 2-4.5 4.5H72c0-2.5-2-4.5-4.5-4.5S63 35.5 63 38h-6c-1 0-2-1-2-2v-4z" fill="#1a1f36"/>
            <circle cx="67.5" cy="38" r="3" fill="#10b981"/>
            <circle cx="87.5" cy="38" r="3" fill="#10b981"/>
          </svg>
          <span className="text-lg font-bold text-[#1a1f36]">CarImport</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href={`/${lang}`} className="text-gray-700 hover:text-[#10b981] font-medium transition">
            {lang === "fr" ? "Accueil" : "Home"}
          </Link>
          <Link href={`/${lang}/calculator`} className="text-gray-700 hover:text-[#10b981] font-medium transition">
            {lang === "fr" ? "Calculateur" : "Calculator"}
          </Link>
          <div className="relative">
            <button
              onClick={() => setCountriesOpen(!countriesOpen)}
              className="text-gray-700 hover:text-[#10b981] font-medium transition flex items-center gap-1"
            >
              {lang === "fr" ? "Pays" : "Countries"}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {countriesOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 py-2 w-56 z-50">
                {countries.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/${lang}/${c.slug}`}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm"
                    onClick={() => setCountriesOpen(false)}
                  >
                    <span>{flags[c.slug] || ""}</span>
                    <span>{c.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link href={`/${lang}/compare`} className="text-gray-700 hover:text-[#10b981] font-medium transition">
            {lang === "fr" ? "Comparer" : "Compare"}
          </Link>
          <Link href={`/${lang}/financing`} className="text-gray-700 hover:text-[#10b981] font-medium transition">
            {lang === "fr" ? "Financement" : "Financing"}
          </Link>
          <Link href={`/${lang}/blog`} className="text-gray-700 hover:text-[#10b981] font-medium transition">
            Blog
          </Link>
          <Link
            href={`/${otherLang}`}
            className="ml-2 px-3 py-1 rounded-full border border-[#10b981] text-[#10b981] text-sm font-semibold hover:bg-[#10b981] hover:text-white transition"
          >
            {otherLang.toUpperCase()}
          </Link>
          <DarkModeToggle />
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          <svg className="w-6 h-6 text-[#1a1f36]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          <Link href={`/${lang}`} className="block text-gray-700 font-medium" onClick={() => setMobileOpen(false)}>
            {lang === "fr" ? "Accueil" : "Home"}
          </Link>
          <Link href={`/${lang}/calculator`} className="block text-gray-700 font-medium" onClick={() => setMobileOpen(false)}>
            {lang === "fr" ? "Calculateur" : "Calculator"}
          </Link>
          <div className="pl-2 space-y-2">
            {countries.map((c) => (
              <Link
                key={c.slug}
                href={`/${lang}/${c.slug}`}
                className="block text-gray-600 text-sm"
                onClick={() => setMobileOpen(false)}
              >
                {flags[c.slug]} {c.name}
              </Link>
            ))}
          </div>
          <Link href={`/${lang}/compare`} className="block text-gray-700 font-medium" onClick={() => setMobileOpen(false)}>
            {lang === "fr" ? "Comparer" : "Compare"}
          </Link>
          <Link href={`/${lang}/financing`} className="block text-gray-700 font-medium" onClick={() => setMobileOpen(false)}>
            {lang === "fr" ? "Financement" : "Financing"}
          </Link>
          <Link href={`/${lang}/blog`} className="block text-gray-700 font-medium" onClick={() => setMobileOpen(false)}>
            Blog
          </Link>
          <Link href={`/${otherLang}`} className="inline-block px-3 py-1 rounded-full border border-[#10b981] text-[#10b981] text-sm font-semibold">
            {otherLang.toUpperCase()}
          </Link>
          <DarkModeToggle />
        </div>
      )}
    </header>
  );
}
