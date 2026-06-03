import Link from "next/link";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaHref?: string;
}

export default function HeroSection({ title, subtitle, ctaText, ctaHref }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1f36] via-[#2d3354] to-[#10b981] text-white py-16 px-6 md:px-12 mb-12">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative max-w-3xl mx-auto text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">{title}</h1>
        <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">{subtitle}</p>
        {ctaText && ctaHref && (
          <Link
            href={ctaHref}
            className="inline-block bg-white text-[#1a1f36] font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-gray-100 hover:shadow-xl transition-all"
          >
            {ctaText}
          </Link>
        )}
      </div>
    </section>
  );
}
