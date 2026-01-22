import { Link } from "react-router-dom";
import { useQuoteQuery, useDeleteQuoteMutation } from "../hooks";
import { Button } from "../components/ui/button";
import { steps, getCompletionByStep } from "../utils/quote";

const HomePage = () => {
  const quoteQuery = useQuoteQuery();
  const deleteMutation = useDeleteQuoteMutation();
  const hasQuote = !!quoteQuery.data;

  const handleStartNew = async () => {
    try {
      await deleteMutation.mutateAsync();
      localStorage.removeItem('quoteSubmissionResult');
      window.location.href = "/quote/personal";
    } catch (err) {
      // Error already handled by mutation
      console.error(err)
    }
  };

  // Find the next incomplete step
  const getNextRoute = () => {
    if (!quoteQuery.data) return "/quote/personal";
    
    const completion = getCompletionByStep(quoteQuery.data);
    
    // Find first incomplete step
    for (const step of steps) {
      if (step.id === "review") continue; // Skip review, we check if all previous are complete
      if (!completion[step.id as keyof typeof completion]) {
        return step.path;
      }
    }
    
    // All steps complete, go to review
    return "/quote/review";
  };

  const getContinueButtonText = () => {
    if (!quoteQuery.data) return "Continue Quote";
    
    // Check if quote was already submitted
    const submissionResult = localStorage.getItem('quoteSubmissionResult');
    if (submissionResult) {
      return "View Submitted Quote";
    }
    
    const completion = getCompletionByStep(quoteQuery.data);
    
    // Check if all steps are complete
    if (completion.personal && completion.address && completion.vehicle && completion.coverage) {
      return "Review & Submit";
    }
    
    return "Continue Quote";
  };

  const getContinueRoute = () => {
    // Check if quote was already submitted
    const submissionResult = localStorage.getItem('quoteSubmissionResult');
    if (submissionResult) {
      return "/success";
    }
    return getNextRoute();
  };

  const renderSteps = () => {
    const completion = getCompletionByStep(quoteQuery.data);
    const stepLabels = [
      { label: "Personal Info", completed: completion?.personal || false },
      { label: "Address", completed: completion?.address || false },
      { label: "Vehicle", completed: completion?.vehicle || false },
      { label: "Coverage", completed: completion?.coverage || false },
      { label: "Review", completed: completion?.review || false },
    ];

    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="flex justify-around items-center gap-2 text-sm">
          {stepLabels.map((step, index) => (
            <div key={step.label} className="flex items-center gap-2">
              {step.completed ? (
                <span className="font-semibold text-green-700 flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {step.label}
                </span>
              ) : (
                <span className="text-slate-700">{step.label}</span>
              )}
              {index < stepLabels.length - 1 && (
                <span className="text-slate-400">→</span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
      <div className="max-w-3xl flex flex-col rounded-lg border border-slate-200 bg-white p-8 shadow-md">
        <h1 className="text-2xl font-bold text-slate-900">
          Auto Insurance Quote
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Get a quick quote by answering a few questions. Your progress will be
          saved as you go.
        </p>

        <div className="mt-6">
          <p className="text-sm font-medium text-slate-700 mb-2">Steps:</p>
          {renderSteps()}
        </div>

        {quoteQuery.isLoading ? (
          <div className="mt-6 flex justify-end gap-3">
            <div className="text-sm text-slate-600">Loading...</div>
          </div>
        ) : (
          <div className="mt-6 flex justify-end gap-3">
            {hasQuote ? (
              <>
                <Button
                  onClick={handleStartNew}
                  variant="outline"
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? "Resetting..." : "Start New Quote"}
                </Button>
                <Link to={getContinueRoute()}>
                  <Button>{getContinueButtonText()}</Button>
                </Link>
              </>
            ) : (
              <Link to="/quote/personal">
                <Button>Start Quote</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;