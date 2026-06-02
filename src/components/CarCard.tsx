import Link from "next/link";

interface CarCardProps {
  name: string;
  slug: string;
  averagePrice: number;
  fuelType: string;
}

export default function CarCard({ name, slug, averagePrice, fuelType }: CarCardProps) {
  return (
    <Link
      href={`/import/${slug}`}
      className="block bg-white rounded-xl shadow-md border border-gray-100 p-5 hover:shadow-lg hover:border-blue-200 transition group"
    >
      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition">
        {name}
      </h3>
      <div className="mt-2 flex items-center gap-3">
        <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded">
          {fuelType === "diesel" ? "Diesel" : "Petrol"}
        </span>
        <span className="text-sm text-gray-500">
          ~&euro;{averagePrice.toLocaleString()}
        </span>
      </div>
      <p className="mt-3 text-sm text-blue-600 font-medium group-hover:underline">
        Calculate import cost &rarr;
      </p>
    </Link>
  );
}
