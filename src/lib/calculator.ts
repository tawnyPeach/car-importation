import countries from "@/data/countries.json";

export interface ImportCostBreakdown {
  carPrice: number;
  transportCost: number;
  cif: number;
  ageMultiplier: number;
  customsValue: number;
  dutyRate: number;
  dutyAmount: number;
  vatRate: number;
  vatBase: number;
  vatAmount: number;
  feesLocal: number;
  feesEUR: number;
  totalEUR: number;
  totalLocal: number;
  currency: string;
  eurToLocalRate: number;
  countryName: string;
}

export function calculateImportCost(
  price: number,
  age: number,
  fuelType: "petrol" | "diesel",
  countrySlug: string,
  liveRate?: number
): ImportCostBreakdown {
  const country = countries.find((c) => c.slug === countrySlug);

  if (!country) {
    throw new Error(`Country not found: ${countrySlug}`);
  }

  // Input validation: reject negative price
  if (price < 0) {
    const eurToLocalRate = liveRate ?? country.eurRate;
    return {
      carPrice: 0,
      transportCost: 0,
      cif: 0,
      ageMultiplier: 1,
      customsValue: 0,
      dutyRate: fuelType === "petrol" ? country.dutyPetrol : country.dutyDiesel,
      dutyAmount: 0,
      vatRate: country.vat,
      vatBase: 0,
      vatAmount: 0,
      feesLocal: country.fixedFees,
      feesEUR: country.fixedFees / eurToLocalRate,
      totalEUR: 0,
      totalLocal: 0,
      currency: country.currency,
      eurToLocalRate,
      countryName: country.name,
    };
  }

  // Clamp negative age to 0
  const clampedAge = Math.max(0, age);

  const eurToLocalRate = liveRate ?? country.eurRate;

  // CIF = price * 1.05 (includes ~5% transport/insurance)
  const cif = price * 1.05;
  const transportCost = cif - price;

  // Age multiplier
  let ageMultiplier: number;
  if (clampedAge <= 3) {
    ageMultiplier = 1.0;
  } else if (clampedAge <= 5) {
    ageMultiplier = 1.1;
  } else if (clampedAge <= 8) {
    ageMultiplier = 1.25;
  } else {
    ageMultiplier = 1.5;
  }

  // Customs value
  const customsValue = cif * ageMultiplier;

  // Duty rate based on fuel type and country
  const dutyRate = fuelType === "petrol" ? country.dutyPetrol : country.dutyDiesel;
  const dutyAmount = customsValue * dutyRate;

  // VAT
  const vatRate = country.vat;
  const vatBase = customsValue + dutyAmount;
  const vatAmount = vatBase * vatRate;

  // Fixed fees
  const feesLocal = country.fixedFees;
  const feesEUR = feesLocal / eurToLocalRate;

  // Total
  const totalEUR = cif + dutyAmount + vatAmount + feesEUR;
  const totalLocal = totalEUR * eurToLocalRate;

  return {
    carPrice: price,
    transportCost: Math.round(transportCost * 100) / 100,
    cif: Math.round(cif * 100) / 100,
    ageMultiplier,
    customsValue: Math.round(customsValue * 100) / 100,
    dutyRate,
    dutyAmount: Math.round(dutyAmount * 100) / 100,
    vatRate,
    vatBase: Math.round(vatBase * 100) / 100,
    vatAmount: Math.round(vatAmount * 100) / 100,
    feesLocal,
    feesEUR: Math.round(feesEUR * 100) / 100,
    totalEUR: Math.round(totalEUR * 100) / 100,
    totalLocal: Math.round(totalLocal * 100) / 100,
    currency: country.currency,
    eurToLocalRate,
    countryName: country.name,
  };
}
