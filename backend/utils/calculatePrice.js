export const calculatePrice = (distance, demandFactor = 1) => {
  const baseFare = 5; // Base fare in currency units
  const perKmRate = 2; // Rate per kilometer
  const price = baseFare + distance * perKmRate * demandFactor;
  return Math.round(price * 100) / 100; // Round to 2 decimal places
};
