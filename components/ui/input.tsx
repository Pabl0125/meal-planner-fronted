import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm text-on-background placeholder:text-outline focus-visible:outline-none focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
          error && "border-error focus-visible:border-error",
          className
        )}
        ref={ref}
        aria-invalid={error ? "true" : "false"}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
