// Shipping and delivery configurations
export interface ShippingRate {
  city: string;
  baseFee: number;
  perKmFee?: number;
}

export const standardShippingRates: Record<string, ShippingRate> = {
  "Addis Ababa": { city: "Addis Ababa", baseFee: 150 },
  "Hawassa": { city: "Hawassa", baseFee: 300 },
  "Adama": { city: "Adama", baseFee: 250 },
  "Bahir Dar": { city: "Bahir Dar", baseFee: 350 },
};
