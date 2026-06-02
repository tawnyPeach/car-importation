export interface ImportCostBreakdown {
  carPrice: number;
  transportCost: number;
  cif: number;
  ageMultiplier: number;
  customsValue: number;
  dutyRate: number;
  dutyAmount: number;
  vatBase: number;
  vatAmount: number;
  feesMAD: number;
  feesEUR: number;
  totalEUR: number;
  totalMAD: number;
  eurToMadRate: number;
}

export function calculateImportCost(
  price: number,
  age: number,
  fuelType: "petrol" | "diesel"
): ImportCostBreakdown {
  // Input validation: reject negative price
  if (price < 0) {
    return {
      carPrice: 0,
      transportCost: 0,
      cif: 0,
      ageMultiplier: 1,
      customsValue: 0,
      dutyRate: fuelType === "petrol" ? 0.25 : 0.3,
      dutyAmount: 0,
      vatBase: 0,
      vatAmount: 0,
      feesMAD: 0,
      feesEUR: 0,
      totalEUR: 0,
      totalMAD: 0,
      eurToMadRate: 11,
    };
  }

  // Clamp negative age to 0
  const clampedAge = Math.max(0, age);

  const eurToMadRate = 11;

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

  // Duty rate based on fuel type
  const dutyRate = fuelType === "petrol" ? 0.25 : 0.3;
  const dutyAmount = customsValue * dutyRate;

  // VAT
  const vatBase = customsValue + dutyAmount;
  const vatAmount = vatBase * 0.2;

  // Fixed fees
  const feesMAD = 3000;
  const feesEUR = feesMAD / eurToMadRate;

  // Total
  const totalEUR = cif + dutyAmount + vatAmount + feesEUR;
  const totalMAD = totalEUR * eurToMadRate;

  return {
    carPrice: price,
    transportCost: Math.round(transportCost * 100) / 100,
    cif: Math.round(cif * 100) / 100,
    ageMultiplier,
    customsValue: Math.round(customsValue * 100) / 100,
    dutyRate,
    dutyAmount: Math.round(dutyAmount * 100) / 100,
    vatBase: Math.round(vatBase * 100) / 100,
    vatAmount: Math.round(vatAmount * 100) / 100,
    feesMAD,
    feesEUR: Math.round(feesEUR * 100) / 100,
    totalEUR: Math.round(totalEUR * 100) / 100,
    totalMAD: Math.round(totalMAD * 100) / 100,
    eurToMadRate,
  };
}
