import { Navigate } from "react-router-dom";

import { useQuoteQuery } from "../hooks";
import { getCompletionByStep } from "../utils/quote";

type ProtectedStepProps = {
  children: React.ReactNode;
  requiredStep: "personal" | "address" | "vehicle" | "coverage";
};

const ProtectedStep = ({ children, requiredStep }: ProtectedStepProps) => {
  const { data: quote, isLoading } = useQuoteQuery();

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">Loading...</div>
    );
  }

  const completion = getCompletionByStep(quote);

  if (!completion[requiredStep]) {
    return <Navigate to="/quote/personal" replace />;
  }

  return <>{children}</>;
};

export default ProtectedStep;