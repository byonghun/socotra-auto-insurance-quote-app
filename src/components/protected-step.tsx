import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import { getQuote } from "../api/quote";
import { getCompletionByStep } from "../utils/quote";
import type { Quote } from "../types/quote";

type ProtectedStepProps = {
  children: React.ReactNode;
  requiredStep: "personal" | "address" | "vehicle" | "coverage";
};

const ProtectedStep = ({ children, requiredStep }: ProtectedStepProps) => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getQuote()
      .then(setQuote)
      .finally(() => setIsLoading(false));
  }, []);

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