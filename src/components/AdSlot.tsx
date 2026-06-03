interface AdSlotProps {
  position: "top" | "middle" | "bottom" | "sidebar";
  className?: string;
}

const sizeConfig = {
  top: {
    label: "Leaderboard 728x90",
    desktop: "w-[728px] h-[90px]",
    responsive: "max-w-full",
  },
  middle: {
    label: "Medium Rectangle 300x250",
    desktop: "w-[300px] h-[250px]",
    responsive: "max-w-full",
  },
  bottom: {
    label: "Large Banner 970x90",
    desktop: "w-[970px] h-[90px]",
    responsive: "max-w-full",
  },
  sidebar: {
    label: "Skyscraper 160x600",
    desktop: "w-[160px] h-[600px]",
    responsive: "max-w-full",
  },
};

export default function AdSlot({ position, className = "" }: AdSlotProps) {
  const config = sizeConfig[position];

  return (
    <div
      data-ad-slot={position}
      className={`mx-auto border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm ${config.desktop} ${config.responsive} ${className}`}
      aria-hidden="true"
    >
      {/* Replace this placeholder with your Google AdSense ad unit code */}
      <span>Ad Space - {config.label}</span>
    </div>
  );
}
