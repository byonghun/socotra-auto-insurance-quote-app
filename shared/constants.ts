export const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC"
] as const;

export const LIABILITY_LIMITS = [
  "100/300",
  "250/500",
  "500/1000",
  "1000/2000",
] as const;

export const COLLISION_DEDUCTIBLES = ["25000", "50000", "100000", "250000"] as const;

export const COVERAGE_TYPES = [
  "liability_only",
  "standard_coverage",
  "full_coverage",
] as const;