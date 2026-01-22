import * as React from "react"

import { cn } from "@/utils"

export interface InputProps extends React.ComponentProps<"input"> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-colors",
          "placeholder:text-gray-400",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-0",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error 
            ? "border-[#c87872] focus-visible:ring-[#c87872] focus-visible:border-[#c87872]"
            : "focus-visible:ring-[#52a8eccc] focus-visible:border-[#52a8eccc]",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
