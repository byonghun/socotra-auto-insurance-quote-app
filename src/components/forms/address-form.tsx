import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { usePatchQuoteMutation, useQuoteQuery } from "../../hooks";
import { US_STATES } from "../../../shared/constants";
import { Input } from "../ui/input";
import { FormField } from "../ui/form-field";
import { Button } from "../ui/button";

const addressSchema = z.object({
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().regex(/^\d{5}$/, "ZIP code must be 5 digits"),
});

type TAddressForm = z.output<typeof addressSchema>;

export function AddressForm() {
  const navigate = useNavigate();
  const quoteQuery = useQuoteQuery();
  const patchMutation = usePatchQuoteMutation();

  const form = useForm<TAddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      address: "",
      city: "",
      state: "",
      zipCode: "",
    },
    mode: "onBlur",
  });

  // Autofill when quote loads
  useEffect(() => {
    const q = quoteQuery.data;
    if (!q) return;

    form.reset({
      address: q.address ?? "",
      city: q.city ?? "",
      state: q.state ?? "",
      zipCode: q.zipCode ?? "",
    });
  }, [quoteQuery.data, form]);

  async function onSubmit(values: TAddressForm) {
    try {
      await patchMutation.mutateAsync(values);
      navigate("/quote/vehicle");
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

  const { register, handleSubmit, formState
    // , setValue
  } = form;

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Address Information</h2>

      {quoteQuery.isLoading && <div>Loading…</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          label="Address"
          error={formState.errors.address?.message}
          required
        >
          <Input
            {...register("address")}
            error={!!formState.errors.address}
            placeholder="123 Main Street"
          />
        </FormField>

        <FormField
          label="City"
          error={formState.errors.city?.message}
          required
        >
          <Input
            {...register("city")}
            error={!!formState.errors.city}
            placeholder="Enter your city"
          />
        </FormField>

        <FormField
          label="State"
          error={formState.errors.state?.message}
          required
        >
          <select
            {...register("state")}
            className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:border-brand"
          >
            <option value="">Select state...</option>
            {US_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          label="ZIP Code"
          error={formState.errors.zipCode?.message}
          required
        >
          <Input
            {...register("zipCode")}
            error={!!formState.errors.zipCode}
            placeholder="12345"
            maxLength={5}
          />
        </FormField>

        <div className="pt-4">
          <Button
            type="submit"
            disabled={patchMutation.isPending}
            className="w-full"
          >
            {patchMutation.isPending ? "Saving…" : "Continue"}
          </Button>
        </div>
      </form>
    </div>
  );
}
