import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { useDeleteQuoteMutation } from "../hooks";

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const deleteMutation = useDeleteQuoteMutation();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Try to get result from navigation state first, then from localStorage
  let result = location.state?.result;
  if (!result) {
    const storedResult = localStorage.getItem('quoteSubmissionResult');
    if (storedResult) {
      try {
        result = JSON.parse(storedResult);
      } catch (err) {
        console.error('Failed to parse stored result:', err);
      }
    }
  }

  // Redirect to home if no confirmation ID is found
  useEffect(() => {
    if (!result) {
      navigate("/", { replace: true });
    }
  }, [result, navigate]);

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const handleStartNewQuoteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmStartNew = async () => {
    try {
      await deleteMutation.mutateAsync();
      localStorage.removeItem('quoteSubmissionResult');
      setShowDeleteDialog(false);
      navigate("/quote/personal");
    } catch (err) {
      // Error already handled by mutation
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="mx-auto max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quote Submitted Successfully!</h1>
            <p className="mt-2 text-gray-600">
              Your auto insurance quote has been submitted and processed.
            </p>
          </div>

          {result && (
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Quote Details</h2>
              <div className="grid grid-cols-1 gap-4 text-left">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-600">Quote ID:</span>
                  <span className="font-semibold text-gray-900">{result.quoteId}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-600">Total Premium:</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(result.totalPremiumCents)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Term:</span>
                  <span className="font-semibold text-gray-900">{result.term}</span>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 space-y-3">
            <Button onClick={() => navigate("/")} className="w-full">
              Return to Home
            </Button>
            <Button
              onClick={handleStartNewQuoteClick}
              variant="outline"
              className="w-full"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Resetting..." : "Start New Quote"}
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start New Quote?</DialogTitle>
            <DialogDescription>
              This will clear all your current form data and start a new quote from scratch. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmStartNew}
              disabled={deleteMutation.isPending}
              variant="destructive"
            >
              {deleteMutation.isPending ? "Resetting..." : "Clear & Start New"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SuccessPage;