"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { AuthHeading } from "./auth-heading";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  CheckmarkCircle02Icon,
  Loading03Icon,
} from "@hugeicons/core-free-icons";
import { LOGIN_ROUTE } from "@/lib/auth";
import { MIN_PASSWORD_LENGTH } from "@/lib/config";

const empty = { password: "", confirm: "" };
type Fields = typeof empty;
type Errors = Partial<Record<keyof Fields, string>>;

function validate(values: Fields): Errors {
  const errors: Errors = {};

  if (!values.password) {
    errors.password = "Enter a new password.";
  } else if (values.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  if (!values.confirm) {
    errors.confirm = "Confirm your new password.";
  } else if (values.confirm !== values.password) {
    errors.confirm = "Passwords do not match.";
  }

  return errors;
}

export function ResetPasswordForm() {
  const router = useRouter();
  const [values, setValues] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  const setField = (key: keyof Fields) => (value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setPending(true);
    setDone(true);
    setTimeout(() => router.push(LOGIN_ROUTE), 1200);
  }

  if (done) {
    return (
      <div className="grid gap-6 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-border bg-muted/40">
          <HugeiconsIcon
            icon={CheckmarkCircle02Icon}
            className="size-6 text-status-good"
          />
        </div>
        <div className="grid gap-2">
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
            Password updated
          </h1>
          <p className="text-sm text-muted-foreground">
            Taking you back to sign in…
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => router.push(LOGIN_ROUTE)}
        >
          Go to sign in
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <AuthHeading
        title="Set a new password"
        description="Choose a password you haven't used on this account before."
      />

      <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
        <PasswordInput
          label="New password"
          value={values.password}
          onChange={setField("password")}
          error={errors.password}
          hint={`At least ${MIN_PASSWORD_LENGTH} characters.`}
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

        <Button type="submit" className="w-full" disabled={pending}>
          {pending && (
            <HugeiconsIcon
              icon={Loading03Icon}
              className="size-4 animate-spin"
            />
          )}
          {pending ? "Updating…" : "Update password"}
        </Button>
      </form>

      <Link
        href={LOGIN_ROUTE}
        className="inline-flex items-center justify-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
        Back to sign in
      </Link>
    </div>
  );
}
