import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-xl border border-mist-200 bg-white/80 px-4 text-sm",
        "placeholder:text-ink-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-600",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
