import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  useQuoteQuery,
  useSubmitQuoteMutation,
  useDeleteQuoteMutation,
} from "../../../hooks";
import { Button } from "../../../components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";

const ReviewStep = () => {
  const navigate = useNavigate();
  const quoteQuery = useQuoteQuery();
  const submitMutation = useSubmitQuoteMutation();
  const deleteMutation = useDeleteQuoteMutation();
  const [showDialog, setShowDialog] = useState(false);

  const quote = quoteQuery.data;

  if (quoteQuery.isLoading) {
    return <div className="mx-auto max-w-2xl p-6">Loading…</div>;
  }

  if (!quote) {
    return <div className="mx-auto max-w-2xl p-6">No quote data found</div>;
  }

  const handleSubmitClick = () => {
    setShowDialog(true);
  };

  const handleConfirmSubmit = async () => {
    if (!quote) return;

    try {
      const result = await submitMutation.mutateAsync(quote);
      setShowDialog(false);
      // Store submission result in localStorage
      localStorage.setItem('quoteSubmissionResult', JSON.stringify(result));
      navigate("/success", { state: { result } });
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartNew = async () => {
    try {
      await deleteMutation.mutateAsync();
      localStorage.removeItem('quoteSubmissionResult');
      navigate("/quote/personal");
    } catch (err) {
      console.error(err);
    }
  };

  // Helper to format coverage type
  const formatCoverageType = (type: string) => {
    return type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Helper to format deductible
  const formatDeductible = (cents: string) => {
    return `$${(parseInt(cents) / 100).toFixed(2)}`;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b bg-white px-6 py-6">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-bold text-gray-900">
            Review Your Information
          </h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-2xl">
          <Accordion
            type="multiple"
            defaultValue={["personal", "address", "vehicle", "coverage"]}
            className="space-y-4"
          >
            {/* Personal Information */}
            <AccordionItem value="personal" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <h3 className="text-lg font-semibold">
                    Personal Information
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/quote/personal");
                    }}
                  >
                    Edit
                  </Button>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-4 pb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">First Name</p>
                    <p className="font-medium">{quote.firstName || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Name</p>
                    <p className="font-medium">{quote.lastName || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{quote.email || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-medium">{quote.phoneNumber || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p className="font-medium">{quote.dob || "—"}</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Address Information */}
            <AccordionItem value="address" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <h3 className="text-lg font-semibold">Address Information</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/quote/address");
                    }}
                  >
                    Edit
                  </Button>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-4 pb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">{quote.address || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">City</p>
                    <p className="font-medium">{quote.city || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">State</p>
                    <p className="font-medium">{quote.state || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">ZIP Code</p>
                    <p className="font-medium">{quote.zipCode || "—"}</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Vehicle Information */}
            <AccordionItem value="vehicle" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <h3 className="text-lg font-semibold">Vehicle Information</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/quote/vehicle");
                    }}
                  >
                    Edit
                  </Button>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-4 pb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Year</p>
                    <p className="font-medium">{quote.vehicleYear || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Make</p>
                    <p className="font-medium">{quote.vehicleMake || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Model</p>
                    <p className="font-medium">{quote.vehicleModel || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">VIN</p>
                    <p className="font-medium">{quote.vehicleVin || "—"}</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Coverage Information */}
            <AccordionItem value="coverage" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <h3 className="text-lg font-semibold">Coverage Options</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/quote/coverage");
                    }}
                  >
                    Edit
                  </Button>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-4 pb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Coverage Type</p>
                    <p className="font-medium">
                      {quote.coverageType
                        ? formatCoverageType(quote.coverageType)
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Liability Limits</p>
                    <p className="font-medium">
                      {quote.liabilityLimits || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      Collision Deductible
                    </p>
                    <p className="font-medium">
                      {quote.collisionDeductibleInCents
                        ? formatDeductible(quote.collisionDeductibleInCents)
                        : "—"}
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <div className="border-t bg-white p-6">
        <div className="mx-auto max-w-2xl flex gap-3">
          <Button
            onClick={handleStartNew}
            variant="outline"
            disabled={deleteMutation.isPending}
            className="flex-1"
          >
            {deleteMutation.isPending ? "Resetting..." : "Start New Quote"}
          </Button>
          <Button
            onClick={handleSubmitClick}
            disabled={submitMutation.isPending}
            className="flex-1"
          >
            {submitMutation.isPending ? "Submitting…" : "Submit Quote"}
          </Button>
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Your Information</DialogTitle>
            <DialogDescription>
              Please confirm that you have reviewed all the information above and that it is accurate before submitting your quote.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              disabled={submitMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmSubmit}
              disabled={submitMutation.isPending}
            >
              {submitMutation.isPending ? "Submitting…" : "Confirm & Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewStep;
