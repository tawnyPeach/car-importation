// This module fetches live exchange rates from Frankfurter API
// Falls back to hardcoded rates from countries.json if API fails

interface ExchangeRates {
  [currency: string]: number;
}

export interface RatesData {
  rates: ExchangeRates;
  lastUpdated: string;
  isLive: boolean;
}

// Hardcoded fallback rates (from countries.json)
const FALLBACK_RATES: ExchangeRates = {
  MAD: 11,
  DZD: 145,
  TND: 3.3,
  XOF: 656,
  TRY: 35,
  EGP: 52,
  NGN: 1700,
  GHS: 16,
  SAR: 4.1,
};

let cachedRates: RatesData | null = null;

export async function getExchangeRates(): Promise<RatesData> {
  if (cachedRates) return cachedRates;

  try {
    const res = await fetch(
      "https://api.frankfurter.app/latest?from=EUR&to=MAD,DZD,TND,XOF,TRY,EGP,NGN,GHS,SAR",
      { next: { revalidate: 86400 } } // revalidate every 24h
    );
    if (!res.ok) throw new Error("API response not OK");
    const data = await res.json();
    cachedRates = {
      rates: data.rates,
      lastUpdated: data.date,
      isLive: true,
    };
    return cachedRates;
  } catch {
    cachedRates = {
      rates: FALLBACK_RATES,
      lastUpdated: new Date().toISOString().split("T")[0],
      isLive: false,
    };
    return cachedRates;
  }
}

export function getRateForCurrency(rates: ExchangeRates, currency: string): number {
  return rates[currency] || FALLBACK_RATES[currency] || 1;
}
