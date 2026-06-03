export default function RatesBadge({
  lastUpdated,
  isLive,
  lang,
}: {
  lastUpdated: string;
  isLive: boolean;
  lang: string;
}) {
  if (isLive) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-xs text-green-700">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        {lang === "fr"
          ? `Taux de change mis a jour : ${lastUpdated}`
          : `Exchange rates updated: ${lastUpdated}`}
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs text-amber-700">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
      {lang === "fr"
        ? "Taux de change : estimations"
        : "Exchange rates: estimates"}
    </div>
  );
}
