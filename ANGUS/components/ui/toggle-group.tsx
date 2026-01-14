import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { cn } from "@/lib/utils";

export const ToggleGroup = ToggleGroupPrimitive.Root;

export const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
  <ToggleGroupPrimitive.Item
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-full border border-transparent px-4 text-sm font-semibold",
      "data-[state=on]:bg-ink-900 data-[state=on]:text-mist-50",
      "data-[state=off]:bg-white/70 data-[state=off]:text-ink-700 data-[state=off]:border-mist-200",
      "transition",
      className
    )}
    {...props}
  />
));
ToggleGroupItem.displayName = "ToggleGroupItem";
