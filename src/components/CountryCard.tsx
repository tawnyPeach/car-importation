import Link from "next/link";

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

interface CountryCardProps {
  name: string;
  slug: string;
  currency: string;
  lang: string;
}

export default function CountryCard({ name, slug, currency, lang }: CountryCardProps) {
  return (
    <Link
      href={`/${lang}/${slug}`}
      className="group block bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-xl hover:border-[#10b981]/30 hover:-translate-y-1 transition-all duration-300"
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{flags[slug] || "\u{1F30D}"}</span>
        <h3 className="text-lg font-bold text-[#1a1f36] group-hover:text-[#10b981] transition-colors">
          {name}
        </h3>
      </div>
      <p className="text-sm text-gray-500">
        {lang === "fr" ? "Devise" : "Currency"}: {currency}
      </p>
      <div className="mt-4 flex items-center gap-1 text-sm font-medium text-[#10b981]">
        <span>{lang === "fr" ? "Voir les details" : "View details"}</span>
        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
