import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getQuote, patchQuote, submitQuote } from "../api/quote";
import type { Quote } from "../types/quote";

const QUOTE_KEY = ["quote"] as const;

export function useQuoteQuery() {
  return useQuery({
    queryKey: QUOTE_KEY,
    queryFn: getQuote,
  });
}

export function usePatchQuoteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<Quote>) => patchQuote(payload),
    onSuccess: (updatedQuote: Partial<Quote>) => {
      queryClient.setQueryData(QUOTE_KEY, updatedQuote);
    },
    onError: (error: any) => {
      console.error("Failed to update quote:", error);
      if (error.validationErrors) {
        const errors = Object.entries(error.validationErrors);
        errors.forEach(([field, messages]) => {
          const errorMessages = messages as string[];
          toast.error(`${field}: ${errorMessages[0]}`);
        });
      } else {
        toast.error(error.message || "Failed to update quote");
      }
    },
  });
}

export function useSubmitQuoteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (quote: Quote) => submitQuote(quote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUOTE_KEY });
    },
    onError: (error: any) => {
      console.error("Failed to submit quote:", error);
      if (error.validationErrors) {
        const errors = Object.entries(error.validationErrors);
        errors.forEach(([field, messages]) => {
          const errorMessages = messages as string[];
          toast.error(`${field}: ${errorMessages[0]}`);
        });
      } else {
        toast.error(error.message || "Failed to submit quote");
      }
    },
  });
}
