"use client";

import * as React from "react";
import { OTPField as OTPFieldPrimitive } from "@base-ui/react/otp-field";

import { cn } from "@/lib/utils";

function OtpInput({
  length,
  value,
  onValueChange,
  invalid,
  autoFocus,
  className,
}: {
  length: number;
  value: string;
  onValueChange: (value: string) => void;
  invalid?: boolean;
  autoFocus?: boolean;
  className?: string;
}) {
  return (
    <OTPFieldPrimitive.Root
      data-slot="otp-input"
      length={length}
      value={value}
      onValueChange={(next) => onValueChange(next)}
      className={cn("flex items-center gap-2", className)}
    >
      {Array.from({ length }).map((_, index) => (
        <OTPFieldPrimitive.Input
          key={index}
          autoFocus={autoFocus && index === 0}
          aria-invalid={invalid || undefined}
          inputMode="numeric"
          className={cn(
            "h-11 w-full min-w-0 rounded-md border border-input bg-transparent text-center text-base font-medium shadow-xs outline-none transition-[color,box-shadow]",
            "dark:bg-input/30",
            "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
            "data-[filled]:border-ring/60",
            "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40"
          )}
        />
      ))}
    </OTPFieldPrimitive.Root>
  );
}

export { OtpInput };
