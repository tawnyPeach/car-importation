// Script to fetch car prices from AutoScout24
// Run: npx tsx scripts/fetch-prices.ts
// Or via npm script: npm run fetch-prices

import * as fs from 'fs';
import * as path from 'path';

interface Car {
  name: string;
  slug: string;
  averagePrice: number;
  fuelType: string;
  ageEstimate: number;
  category: string;
  brand: string;
}

interface PriceResult {
  slug: string;
  name: string;
  scrapedPrice: number | null;
  fallbackPrice: number;
  source: string;
  lastUpdated: string;
}

// Build search URL from car brand and name
function buildSearchUrl(car: Car): string {
  const brand = car.brand.toLowerCase();
  // Extract model from name (remove brand prefix and year)
  const model = car.name
    .replace(car.brand, '')
    .replace(/\d{4}/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-');

  return `https://www.autoscout24.com/lst/${brand}/${model}?sort=standard&desc=0&cy=D%2CA%2CB%2CE%2CF%2CI%2CL%2CNL&fregfrom=${2024 - car.ageEstimate - 1}&fregto=${2024 - car.ageEstimate + 1}&atype=C&`;
}

async function fetchPriceForCar(car: Car): Promise<PriceResult> {
  const url = buildSearchUrl(car);

  try {
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();

    // Parse prices from the HTML
    // AutoScout24 shows prices in elements - look for price patterns
    const priceRegex = /€\s*([\d.,]+)/g;
    const prices: number[] = [];
    let match;

    while ((match = priceRegex.exec(html)) !== null) {
      const priceStr = match[1].replace(/\./g, '').replace(',', '.');
      const price = parseFloat(priceStr);
      if (price > 1000 && price < 200000) { // Reasonable car price range
        prices.push(price);
      }
    }

    if (prices.length >= 3) {
      // Calculate median price (more robust than average)
      prices.sort((a, b) => a - b);
      const median = prices[Math.floor(prices.length / 2)];

      return {
        slug: car.slug,
        name: car.name,
        scrapedPrice: Math.round(median),
        fallbackPrice: car.averagePrice,
        source: 'autoscout24',
        lastUpdated: new Date().toISOString().split('T')[0],
      };
    }

    throw new Error('Not enough prices found');
  } catch (error) {
    console.log(`  [FALLBACK] ${car.name}: using hardcoded price \u20AC${car.averagePrice}`);
    return {
      slug: car.slug,
      name: car.name,
      scrapedPrice: null,
      fallbackPrice: car.averagePrice,
      source: 'fallback',
      lastUpdated: new Date().toISOString().split('T')[0],
    };
  }
}

async function main() {
  console.log('Fetching car prices from AutoScout24...\n');

  const carsPath = path.join(__dirname, '..', 'src', 'data', 'cars.json');
  const cars: Car[] = JSON.parse(fs.readFileSync(carsPath, 'utf-8'));

  const results: PriceResult[] = [];
  let successCount = 0;

  // Process sequentially with delays
  for (let i = 0; i < cars.length; i++) {
    const car = cars[i];
    console.log(`[${i + 1}/${cars.length}] Fetching ${car.name}...`);
    const result = await fetchPriceForCar(car);
    results.push(result);
    if (result.scrapedPrice) successCount++;
  }

  // Save results
  const outputPath = path.join(__dirname, '..', 'src', 'data', 'live-prices.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

  console.log(`\nDone! ${successCount}/${cars.length} prices fetched successfully.`);
  console.log(`Results saved to src/data/live-prices.json`);
}

main().catch(console.error);
