export type QuoteRequest = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dob: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  vehicleYear: number;
  vehicleMake: string;
  vehicleModel: string;
  vehicleVin: string;
  coverageType: "liability_only" | "standard_coverage" | "full_coverage";
  liabilityLimits: string;
  collisionDeductibleInCents: string;
};

export type QuoteResponse = {
  quoteId: string;
  totalPremiumCents: number;
  term: "monthly" | "6_month";
};

export type PricingResponse = {
  liabilityCoverageCents: number;
  collisionCoverageCents: number;
  comprehensiveCoverageCents: number;
};

export type ValidationErrors = {
  errors: Record<string, string[]>;
};
