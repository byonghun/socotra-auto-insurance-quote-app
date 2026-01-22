import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { usePatchQuoteMutation, useQuoteQuery } from "../../hooks";
import {
  COVERAGE_TYPES,
  LIABILITY_LIMITS,
  COLLISION_DEDUCTIBLES,
} from "../../../shared/constants";
import { FormField } from "../ui/form-field";
import { Button } from "../ui/button";

const coverageSchema = z.object({
  coverageType: z.string().min(1, "Coverage type is required"),
  liabilityLimits: z.string().min(1, "Liability limits are required"),
  collisionDeductibleInCents: z.string().min(1, "Deductible is required"),
});

type TCoverageForm = z.output<typeof coverageSchema>;

export function CoverageForm() {
  const navigate = useNavigate();
  const quoteQuery = useQuoteQuery();
  const patchMutation = usePatchQuoteMutation();

  const form = useForm<TCoverageForm>({
    resolver: zodResolver(coverageSchema),
    defaultValues: {
      coverageType: "",
      liabilityLimits: "",
      collisionDeductibleInCents: "",
    },
    mode: "onBlur",
  });

  // Autofill when quote loads
  useEffect(() => {
    const q = quoteQuery.data;
    if (!q) return;

    form.reset({
      coverageType: q.coverageType ?? "",
      liabilityLimits: q.liabilityLimits ?? "",
      collisionDeductibleInCents: q.collisionDeductibleInCents ?? "",
    });
  }, [quoteQuery.data, form]);

  async function onSubmit(values: TCoverageForm) {
    try {
      await patchMutation.mutateAsync(values);
      navigate("/quote/review");
    } catch (err: any) {
      const validationErrors = err?.validationErrors as
        | Record<string, string[]>
        | undefined;
      if (validationErrors) {
        for (const key of Object.keys(validationErrors)) {
          const messages = validationErrors[key];
          form.setError(key as any, {
            type: "server",
            message: messages.join(", "),
          });
        }
      }
    }
  }

  const { register, handleSubmit, formState } = form;

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Coverage Options</h2>

      {quoteQuery.isLoading && <div>Loading…</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          label="Coverage Type"
          error={formState.errors.coverageType?.message}
        >
          <select
            {...register("coverageType")}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          >
            <option value="">Select coverage type...</option>
            {COVERAGE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          label="Liability Limits"
          error={formState.errors.liabilityLimits?.message}
        >
          <select
            {...register("liabilityLimits")}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          >
            <option value="">Select liability limits...</option>
            {LIABILITY_LIMITS.map((limit) => (
              <option key={limit} value={limit}>
                {limit}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          label="Collision Deductible"
          error={formState.errors.collisionDeductibleInCents?.message}
        >
          <select
            {...register("collisionDeductibleInCents")}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          >
            <option value="">Select deductible...</option>
            {COLLISION_DEDUCTIBLES.map((deductible) => (
              <option key={deductible} value={deductible}>
                ${(parseInt(deductible) / 100).toFixed(2)}
              </option>
            ))}
          </select>
        </FormField>

        <div className="pt-4">
          <Button type="submit" disabled={patchMutation.isPending} className="w-full">
            {patchMutation.isPending ? "Saving…" : "Continue"}
          </Button>
        </div>
      </form>
    </div>
  );
}
