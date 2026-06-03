import Link from "next/link";
import countries from "@/data/countries.json";
import { getTranslation, type Lang } from "@/lib/i18n";

export default function Footer({ lang }: { lang: string }) {
  const t = (key: string) => getTranslation(lang as Lang, key);

  return (
    <footer className="bg-[#1a1f36] text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">CarImport Calculator</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              {lang === "fr"
                ? "Calculateur gratuit pour estimer le cout total d'importation d'une voiture depuis l'Europe vers plusieurs pays. Droits de douane, TVA, transport et frais inclus."
                : "Free calculator to estimate the total cost of importing a car from Europe to multiple countries. Customs duty, VAT, transport, and fees included."}
            </p>
          </div>

          {/* Countries */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t("nav.countries")}</h3>
            <ul className="space-y-2 text-sm">
              {countries.map((c) => (
                <li key={c.slug}>
                  <Link href={`/${lang}/${c.slug}`} className="hover:text-[#10b981] transition">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t("footer.quickLinks")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${lang}`} className="hover:text-[#10b981] transition">
                  {t("nav.home")}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/calculator`} className="hover:text-[#10b981] transition">
                  {t("nav.calculator")}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/blog`} className="hover:text-[#10b981] transition">
                  {t("nav.blog")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              {lang === "fr" ? "Mentions Legales" : "Legal"}
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              {t("footer.disclaimer")}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Car Import Calculator. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
