"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { AuthHeading } from "./auth-heading";
import { HugeiconsIcon } from "@hugeicons/react";
import { Loading03Icon } from "@hugeicons/core-free-icons";
import { AFTER_LOGIN_ROUTE, LOGIN_ROUTE, signIn } from "@/lib/auth";
import { MIN_PASSWORD_LENGTH } from "@/lib/config";

const empty = { name: "", email: "", password: "", confirm: "" };
type Fields = typeof empty;
type Errors = Partial<Record<keyof Fields | "terms", string>>;

function validate(values: Fields, terms: boolean): Errors {
  const errors: Errors = {};

  if (!values.name.trim()) errors.name = "Name is required.";

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.password) {
    errors.password = "Password is required.";
  } else if (values.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  if (!values.confirm) {
    errors.confirm = "Confirm your password.";
  } else if (values.confirm !== values.password) {
    errors.confirm = "Passwords do not match.";
  }

  if (!terms) errors.terms = "Accept the terms to continue.";

  return errors;
}

export function RegisterForm() {
  const router = useRouter();
  const nameId = useId();
  const emailId = useId();
  const termsId = useId();

  const [values, setValues] = useState<Fields>(empty);
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [pending, setPending] = useState(false);

  const setField = (key: keyof Fields) => (value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors = validate(values, terms);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setPending(true);
    signIn();
    router.replace(AFTER_LOGIN_ROUTE);
    router.refresh();
  }

  return (
    <div className="grid gap-6">
      <AuthHeading
        title="Create your account"
        description="Start organising your projects in a couple of minutes."
      />

      <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
        <div className="grid gap-2">
          <Label htmlFor={nameId}>Full name</Label>
          <Input
            id={nameId}
            value={values.name}
            onChange={(e) => setField("name")(e.target.value)}
            placeholder="Jane Cooper"
            autoComplete="name"
            autoFocus
            aria-invalid={Boolean(errors.name) || undefined}
            aria-describedby={errors.name ? `${nameId}-error` : undefined}
          />
          {errors.name && (
            <p id={`${nameId}-error`} className="text-xs text-destructive">
              {errors.name}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor={emailId}>Email</Label>
          <Input
            id={emailId}
            type="email"
            value={values.email}
            onChange={(e) => setField("email")(e.target.value)}
            placeholder="you@company.com"
            autoComplete="email"
            aria-invalid={Boolean(errors.email) || undefined}
            aria-describedby={errors.email ? `${emailId}-error` : undefined}
          />
          {errors.email && (
            <p id={`${emailId}-error`} className="text-xs text-destructive">
              {errors.email}
            </p>
          )}
        </div>

        <PasswordInput
          label="Password"
          value={values.password}
          onChange={setField("password")}
          error={errors.password}
          hint={`At least ${MIN_PASSWORD_LENGTH} characters.`}
          placeholder="Create a password"
          autoComplete="new-password"
        />

        <PasswordInput
          label="Confirm password"
          value={values.confirm}
          onChange={setField("confirm")}
          error={errors.confirm}
          placeholder="Re-enter your password"
          autoComplete="new-password"
        />

        <div className="grid gap-1.5">
          <div className="flex items-start gap-2">
            <Checkbox
              id={termsId}
              checked={terms}
              onCheckedChange={(checked) => {
                setTerms(Boolean(checked));
                setErrors((prev) => ({ ...prev, terms: undefined }));
              }}
              aria-invalid={Boolean(errors.terms) || undefined}
              className="mt-0.5"
            />
            <Label htmlFor={termsId} className="text-sm font-normal">
              I agree to the Terms of Service and Privacy Policy
            </Label>
          </div>
          {errors.terms && (
            <p className="text-xs text-destructive">{errors.terms}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={pending}>
          {pending && (
            <HugeiconsIcon
              icon={Loading03Icon}
              className="size-4 animate-spin"
            />
          )}
          {pending ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href={LOGIN_ROUTE}
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
