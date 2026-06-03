import Link from "next/link";
import countries from "@/data/countries.json";
import sourceCountries from "@/data/source-countries.json";
import { getTranslation, type Lang } from "@/lib/i18n";
import EmailCapture from "@/components/EmailCapture";

export default function Footer({ lang }: { lang: string }) {
  const t = (key: string) => getTranslation(lang as Lang, key);

  return (
    <footer className="bg-[#1a1f36] text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* About */}
          <div className="lg:col-span-2">
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

          {/* Tools */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              {lang === "fr" ? "Outils" : "Tools"}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${lang}/calculator`} className="hover:text-[#10b981] transition">
                  {t("nav.calculator")}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/financing`} className="hover:text-[#10b981] transition">
                  {lang === "fr" ? "Calculateur de Financement" : "Financing Calculator"}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/compare`} className="hover:text-[#10b981] transition">
                  {lang === "fr" ? "Comparer les Pays" : "Compare Countries"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              {lang === "fr" ? "Ressources" : "Resources"}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${lang}/blog`} className="hover:text-[#10b981] transition">
                  Blog
                </Link>
              </li>
              {sourceCountries.map((sc) => (
                <li key={sc.slug}>
                  <Link href={`/${lang}/morocco/from-${sc.slug}`} className="hover:text-[#10b981] transition">
                    {lang === "fr" ? `Depuis ${sc.name}` : `From ${sc.name}`}
                  </Link>
                </li>
              ))}
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

        <div className="border-t border-gray-700 mt-10 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <EmailCapture compact />
          </div>
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Car Import Calculator. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
