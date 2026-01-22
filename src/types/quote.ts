export type Quote = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  dob?: string;

  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;

  vehicleYear?: number;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleVin?: string;

  coverageType?: "liability_only" | "standard_coverage" | "full_coverage";
  liabilityLimits?: "100/300" | "250/500" | "500/1000" | "1000/2000";
  collisionDeductibleInCents?: "25000" | "50000" | "100000" | "250000";
};

export type StepId = "personal" | "address" | "vehicle" | "coverage" | "review";

export type QuoteProp = Quote | null | undefined;