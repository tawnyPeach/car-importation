import type { Metadata } from "next";
import Link from "next/link";
import articles from "@/data/blog-articles.json";
import Breadcrumbs from "@/components/Breadcrumbs";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "fr" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  const title =
    lang === "fr"
      ? "Blog Import Voiture - Guides & Conseils"
      : "Car Import Blog - Guides & Tips";
  const description =
    lang === "fr"
      ? "Decouvrez nos guides et conseils pour importer une voiture depuis l'etranger."
      : "Discover our guides and tips for importing a car from abroad.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  const breadcrumbs = [
    { label: lang === "fr" ? "Accueil" : "Home", href: `/${lang}` },
    { label: "Blog", href: `/${lang}/blog` },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <section className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1a1f36] mb-4">
          {lang === "fr" ? "Blog Import Voiture" : "Car Import Blog"}
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl">
          {lang === "fr"
            ? "Guides, conseils et comparaisons pour vous aider a importer votre voiture."
            : "Guides, tips, and comparisons to help you import your car."}
        </p>
      </section>

      <section className="mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => {
            const title =
              lang === "fr" ? article.title_fr : article.title_en;
            const excerpt =
              lang === "fr" ? article.excerpt_fr : article.excerpt_en;

            return (
              <Link
                key={article.slug}
                href={`/${lang}/blog/${article.slug}`}
                className="group block bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-xl hover:border-[#10b981]/30 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#f59e0b]/10 text-[#f59e0b] uppercase">
                    {article.category}
                  </span>
                  <span className="text-xs text-gray-400">
                    {article.date}
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-[#1a1f36] group-hover:text-[#10b981] transition-colors mb-2">
                  {title}
                </h2>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {excerpt}
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
