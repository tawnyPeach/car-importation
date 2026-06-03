import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import articles from "@/data/blog-articles.json";
import Breadcrumbs from "@/components/Breadcrumbs";

export function generateStaticParams() {
  const params: { lang: string; articleSlug: string }[] = [];
  for (const lang of ["en", "fr"]) {
    for (const article of articles) {
      params.push({ lang, articleSlug: article.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; articleSlug: string }>;
}): Promise<Metadata> {
  const { lang, articleSlug } = await params;
  const article = articles.find((a) => a.slug === articleSlug);

  if (!article) {
    return { title: "Not Found" };
  }

  const title = lang === "fr" ? article.title_fr : article.title_en;
  const description = lang === "fr" ? article.excerpt_fr : article.excerpt_en;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ lang: string; articleSlug: string }>;
}) {
  const { lang, articleSlug } = await params;
  const article = articles.find((a) => a.slug === articleSlug);

  if (!article) {
    notFound();
  }

  const title = lang === "fr" ? article.title_fr : article.title_en;
  const content = lang === "fr" ? article.content_fr : article.content_en;
  const paragraphs = content.split("\n\n");

  const breadcrumbs = [
    { label: lang === "fr" ? "Accueil" : "Home", href: `/${lang}` },
    { label: "Blog", href: `/${lang}/blog` },
    { label: title, href: `/${lang}/blog/${articleSlug}` },
  ];

  const otherArticles = articles.filter((a) => a.slug !== articleSlug);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    datePublished: article.date,
    description: lang === "fr" ? article.excerpt_fr : article.excerpt_en,
  };

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <article className="mb-12">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#f59e0b]/10 text-[#f59e0b] uppercase">
              {article.category}
            </span>
            <span className="text-sm text-gray-400">{article.date}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#1a1f36]">
            {title}
          </h1>
        </header>

        <div className="prose prose-lg max-w-none">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="text-gray-700 mb-4 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </article>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-[#1a1f36] mb-6">
          {lang === "fr" ? "Autres articles" : "Other Articles"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {otherArticles.map((other) => {
            const otherTitle =
              lang === "fr" ? other.title_fr : other.title_en;
            return (
              <Link
                key={other.slug}
                href={`/${lang}/blog/${other.slug}`}
                className="block bg-white rounded-xl shadow-md border border-gray-100 p-4 hover:shadow-lg hover:border-[#10b981]/30 transition-all duration-300"
              >
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#f59e0b]/10 text-[#f59e0b] uppercase">
                  {other.category}
                </span>
                <h3 className="mt-2 font-semibold text-[#1a1f36] hover:text-[#10b981] transition-colors">
                  {otherTitle}
                </h3>
                <span className="text-xs text-gray-400 mt-1 block">
                  {other.date}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
    </>
  );
}
