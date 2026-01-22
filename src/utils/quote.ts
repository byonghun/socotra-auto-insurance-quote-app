import type { StepId, QuoteProp } from "../types/quote";

export const steps: Array<{ id: StepId; label: string; path: string }> = [
  { id: "personal", label: "Personal Info", path: "/quote/personal" },
  { id: "address", label: "Address", path: "/quote/address" },
  { id: "vehicle", label: "Vehicle", path: "/quote/vehicle" },
  { id: "coverage", label: "Coverage", path: "/quote/coverage" },
  { id: "review", label: "Review", path: "/quote/review" },
];

export function isPersonalComplete(q: QuoteProp): boolean {
  return Boolean(q?.firstName && q?.lastName && q?.email && q?.phoneNumber && q?.dob);
}

export function isAddressComplete(q: QuoteProp): boolean {
  return Boolean(q?.address && q?.city && q?.state && q?.zipCode);
}

export function isVehicleComplete(q: QuoteProp): boolean {
  return Boolean(q?.vehicleYear && q?.vehicleMake && q?.vehicleModel && q?.vehicleVin);
}

export function isCoverageComplete(q: QuoteProp): boolean {
  return Boolean(q?.coverageType && q?.liabilityLimits && q?.collisionDeductibleInCents);
}

export function getCompletionByStep(q: QuoteProp) {
  return {
    personal: isPersonalComplete(q),
    address: isAddressComplete(q),
    vehicle: isVehicleComplete(q),
    coverage: isCoverageComplete(q),
    review:
      isPersonalComplete(q) &&
      isAddressComplete(q) &&
      isVehicleComplete(q) &&
      isCoverageComplete(q),
  } as const;
}
