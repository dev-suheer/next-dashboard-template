"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { PasswordInput } from "./password-input";

const MIN_LENGTH = 8;

const empty = { current: "", next: "", confirm: "" };
type Fields = typeof empty;
type Errors = Partial<Record<keyof Fields, string>>;

function validate(values: Fields): Errors {
  const errors: Errors = {};

  if (!values.current) {
    errors.current = "Enter your current password.";
  }

  if (!values.next) {
    errors.next = "Enter a new password.";
  } else if (values.next.length < MIN_LENGTH) {
    errors.next = `Use at least ${MIN_LENGTH} characters.`;
  } else if (values.next === values.current) {
    errors.next = "New password must differ from the current one.";
  }

  if (!values.confirm) {
    errors.confirm = "Confirm your new password.";
  } else if (values.confirm !== values.next) {
    errors.confirm = "Passwords do not match.";
  }

  return errors;
}

export function PasswordTab() {
  const [values, setValues] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [saved, setSaved] = useState(false);

  const setField = (key: keyof Fields) => (value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setSaved(false);
      return;
    }
    setValues(empty);
    setSaved(true);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-5 sm:gap-6 max-w-md"
      noValidate
    >
      <div className="grid gap-4">
        <PasswordInput
          label="Current password"
          value={values.current}
          onChange={setField("current")}
          error={errors.current}
          placeholder="Enter current password"
          autoComplete="current-password"
        />
        <PasswordInput
          label="New password"
          value={values.next}
          onChange={setField("next")}
          error={errors.next}
          hint={`At least ${MIN_LENGTH} characters.`}
          placeholder="Enter new password"
          autoComplete="new-password"
        />
        <PasswordInput
          label="Confirm new password"
          value={values.confirm}
          onChange={setField("confirm")}
          error={errors.confirm}
          placeholder="Re-enter new password"
          autoComplete="new-password"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t pt-4">
        <Button type="submit" size="sm">
          Update password
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            setValues(empty);
            setErrors({});
            setSaved(false);
          }}
        >
          Cancel
        </Button>
        {saved && (
          <p
            role="status"
            className="flex items-center gap-1.5 text-sm text-muted-foreground"
          >
            <HugeiconsIcon
              icon={CheckmarkCircle02Icon}
              className="size-4 text-status-good"
            />
            Password updated
          </p>
        )}
      </div>
    </form>
  );
}
