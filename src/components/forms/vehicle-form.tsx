import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { usePatchQuoteMutation, useQuoteQuery } from "../../hooks";
import { Input } from "../ui/input";
import { FormField } from "../ui/form-field";
import { Button } from "../ui/button";

const vehicleSchema = z.object({
  vehicleYear: z
    .string()
    .min(1, "Year is required")
    .refine(
      (val) => {
        const num = parseInt(val);
        return (
          !isNaN(num) && num >= 1900 && num <= new Date().getFullYear() + 1
        );
      },
      `Year must be between 1900 and ${new Date().getFullYear() + 1}`,
    ),
  vehicleMake: z.string().min(1, "Make is required"),
  vehicleModel: z.string().min(1, "Model is required"),
  vehicleVin: z
    .string()
    .regex(/^[A-HJ-NPR-Z0-9]{17}$/i, "VIN must be exactly 17 characters"),
});

type TVehicleForm = z.output<typeof vehicleSchema>;

export function VehicleForm() {
  const navigate = useNavigate();
  const quoteQuery = useQuoteQuery();
  const patchMutation = usePatchQuoteMutation();

  const form = useForm<TVehicleForm>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      vehicleYear: "",
      vehicleMake: "",
      vehicleModel: "",
      vehicleVin: "",
    },
    mode: "onBlur",
  });

  // Autofill when quote loads
  useEffect(() => {
    const q = quoteQuery.data;
    if (!q) return;

    form.reset({
      vehicleYear: q.vehicleYear ? String(q.vehicleYear) : "",
      vehicleMake: q.vehicleMake ?? "",
      vehicleModel: q.vehicleModel ?? "",
      vehicleVin: q.vehicleVin ?? "",
    });
  }, [quoteQuery.data, form]);

  async function onSubmit(values: TVehicleForm) {
    const payload = {
      vehicleYear: parseInt(values.vehicleYear),
      vehicleMake: values.vehicleMake,
      vehicleModel: values.vehicleModel,
      vehicleVin: values.vehicleVin,
    };

    try {
      await patchMutation.mutateAsync(payload);
      navigate("/quote/coverage");
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
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Vehicle Information
      </h2>

      {quoteQuery.isLoading && <div>Loading…</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Year" error={formState.errors.vehicleYear?.message}>
          <Input
            type="number"
            {...register("vehicleYear")}
            error={!!formState.errors.vehicleYear}
            placeholder="Enter vehicle year"
            min={1900}
            max={new Date().getFullYear() + 1}
          />
        </FormField>

        <FormField label="Make" error={formState.errors.vehicleMake?.message}>
          <Input
            {...register("vehicleMake")}
            error={!!formState.errors.vehicleMake}
            placeholder="Enter vehicle make"
          />
        </FormField>

        <FormField label="Model" error={formState.errors.vehicleModel?.message}>
          <Input
            {...register("vehicleModel")}
            error={!!formState.errors.vehicleModel}
            placeholder="Enter vehicle model"
          />
        </FormField>

        <FormField label="VIN" error={formState.errors.vehicleVin?.message}>
          <Input
            {...register("vehicleVin")}
            error={!!formState.errors.vehicleVin}
            placeholder="Enter vehicle VIN"
            maxLength={17}
          />
        </FormField>

        <div className="pt-4 flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/quote/address")}
            className="w-full"
          >
            Back
          </Button>
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
