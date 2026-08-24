"use client";

import { useId, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon, ViewOffSlashIcon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

export function PasswordInput({
  label,
  value,
  onChange,
  error,
  hint,
  placeholder,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  placeholder?: string;
  autoComplete?: string;
}) {
  const id = useId();
  const hintId = `${id}-hint`;
  const [visible, setVisible] = useState(false);

  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error || hint ? hintId : undefined}
          className={cn("pr-9")}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 flex w-9 items-center justify-center rounded-r-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 cursor-pointer"
        >
          <HugeiconsIcon
            icon={visible ? ViewOffSlashIcon : ViewIcon}
            className="size-4"
          />
        </button>
      </div>
      {(error || hint) && (
        <p
          id={hintId}
          className={cn(
            "text-xs",
            error ? "text-destructive" : "text-muted-foreground"
          )}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
}
