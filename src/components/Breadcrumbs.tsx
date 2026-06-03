interface BreadcrumbItem {
  label: string;
  href: string;
}

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `https://carimport.com${item.href}`,
    })),
  };

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
          {items.map((item, i) => (
            <li key={item.href} className="flex items-center gap-1">
              {i > 0 && <span className="mx-1">/</span>}
              {i === items.length - 1 ? (
                <span className="text-gray-900 font-medium">{item.label}</span>
              ) : (
                <a href={item.href} className="hover:text-[#10b981] transition">
                  {item.label}
                </a>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
