import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { usePatchQuoteMutation, useQuoteQuery } from "../../hooks";
import { Input } from "../ui/input";
import { FormField } from "../ui/form-field";
import { Button } from "../ui/button";

const personalSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email("Email must be valid"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .refine(
      (v) => v.replace(/\D/g, "").length >= 10,
      "Phone number must be valid",
    ),
  dob: z.string().min(1, "Date of birth is required"), // keep as string in the form (YYYY-MM-DD)
});

type TPersonalForm = z.output<typeof personalSchema>;

export function PersonalForm() {
  const navigate = useNavigate();
  const quoteQuery = useQuoteQuery();
  const patchMutation = usePatchQuoteMutation();

  const form = useForm<TPersonalForm>({
    resolver: zodResolver(personalSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      dob: "",
    },
    mode: "onBlur",
  });

  // Autofill when quote loads
  useEffect(() => {
    const q = quoteQuery.data;
    if (!q) return;

    form.reset({
      firstName: q.firstName ?? "",
      lastName: q.lastName ?? "",
      email: q.email ?? "",
      phoneNumber: q.phoneNumber ?? "",
      dob: q.dob ? q.dob.slice(0, 10) : "", // ISO -> YYYY-MM-DD
    });
  }, [quoteQuery.data, form]);

  async function onSubmit(values: TPersonalForm) {
    // Convert dob back to ISO-like string or store plain date string (your backend coerce.date() will parse it)
    const payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phoneNumber: values.phoneNumber,
      dob: values.dob,
    };

    try {
      await patchMutation.mutateAsync(payload);
      navigate("/quote/address");
    } catch (err: any) {
      // If backend returned field errors, you can map them to react-hook-form
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
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Info</h2>

      {quoteQuery.isLoading && <div>Loading…</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          label="First name"
          error={formState.errors.firstName?.message}
          required
        >
          <Input
            {...register("firstName")}
            error={!!formState.errors.firstName}
            placeholder="Enter your first name"
          />
        </FormField>

        <FormField
          label="Last name"
          error={formState.errors.lastName?.message}
          required
        >
          <Input
            {...register("lastName")}
            error={!!formState.errors.lastName}
            placeholder="Enter your last name"
          />
        </FormField>

        <FormField
          label="Email"
          error={formState.errors.email?.message}
          required
        >
          <Input
            type="email"
            {...register("email")}
            error={!!formState.errors.email}
            placeholder="Enter your email"
          />
        </FormField>

        <FormField
          label="Phone number"
          error={formState.errors.phoneNumber?.message}
          required
        >
          <Input
            type="tel"
            {...register("phoneNumber")}
            error={!!formState.errors.phoneNumber}
            placeholder="(555) 555-5555"
          />
        </FormField>

        <FormField
          label="Date of birth"
          error={formState.errors.dob?.message}
          required
        >
          <Input
            type="date"
            {...register("dob")}
            error={!!formState.errors.dob}
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
