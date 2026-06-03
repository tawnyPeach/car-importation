import { getExchangeRates, getRateForCurrency } from './exchange-rates';
import { calculateImportCost, type ImportCostBreakdown } from './calculator';
import countries from '@/data/countries.json';

export async function calculateWithLiveRates(
  price: number,
  age: number,
  fuelType: "petrol" | "diesel",
  countrySlug: string
): Promise<ImportCostBreakdown> {
  const ratesData = await getExchangeRates();
  const country = countries.find(c => c.slug === countrySlug);
  const liveRate = country ? getRateForCurrency(ratesData.rates, country.currency) : undefined;
  return calculateImportCost(price, age, fuelType, countrySlug, liveRate);
}
