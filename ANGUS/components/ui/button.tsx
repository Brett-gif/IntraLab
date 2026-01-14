import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-medium transition",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-600",
          "disabled:opacity-60 disabled:pointer-events-none",
          variant === "primary" &&
            "bg-ink-900 text-mist-50 hover:bg-ink-700 shadow-soft",
          variant === "secondary" &&
            "bg-white text-ink-900 border border-mist-200 hover:border-ink-900",
          variant === "ghost" && "bg-transparent text-ink-900 hover:bg-mist-200",
          size === "sm" && "h-9 px-4 text-sm",
          size === "md" && "h-11 px-6 text-sm",
          size === "lg" && "h-12 px-7 text-base",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
