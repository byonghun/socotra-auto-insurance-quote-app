import { ReactNode } from "react";
import { Label } from "./label";

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}

export function FormField({ label, error, required, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-900">
        {label}
        {required && <span className="ml-1 text-gray-500 text-xs">(required)</span>}
      </Label>
      {children}
      {error && <p className="text-sm" style={{ color: "#f2545b" }}>{error}</p>}
    </div>
  );
}
