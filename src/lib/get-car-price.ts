import cars from '@/data/cars.json';
import livePrices from '@/data/live-prices.json';

interface LivePrice {
  slug: string;
  name: string;
  scrapedPrice: number | null;
  fallbackPrice: number;
  source: string;
  lastUpdated: string;
}

export function getCarPrice(slug: string): { price: number; source: string; lastUpdated: string } {
  const livePrice = (livePrices as LivePrice[]).find(p => p.slug === slug);

  if (livePrice && livePrice.scrapedPrice) {
    return {
      price: livePrice.scrapedPrice,
      source: livePrice.source,
      lastUpdated: livePrice.lastUpdated,
    };
  }

  const car = cars.find(c => c.slug === slug);
  return {
    price: car?.averagePrice || 0,
    source: 'estimate',
    lastUpdated: '2024-01-01',
  };
}

export function getPriceLastUpdated(): string {
  const prices = livePrices as LivePrice[];
  if (prices.length === 0) return 'N/A';
  return prices[0]?.lastUpdated || 'N/A';
}
