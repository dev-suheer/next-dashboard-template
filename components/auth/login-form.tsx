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
import {
  AFTER_LOGIN_ROUTE,
  FORGOT_PASSWORD_ROUTE,
  REGISTER_ROUTE,
  signIn,
} from "@/lib/auth";

type Errors = Partial<Record<"email" | "password", string>>;

function validate(values: { email: string; password: string }): Errors {
  const errors: Errors = {};

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.password) {
    errors.password = "Password is required.";
  }

  return errors;
}

export function LoginForm() {
  const router = useRouter();
  const emailId = useId();
  const rememberId = useId();

  const [values, setValues] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<Errors>({});
  const [pending, setPending] = useState(false);

  const setField = (key: keyof typeof values) => (value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setPending(true);
    signIn(remember);
    router.replace(AFTER_LOGIN_ROUTE);
    router.refresh();
  }

  return (
    <div className="grid gap-6">
      <AuthHeading
        title="Welcome back"
        description="Sign in to pick up where you left off."
      />

      <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
        <div className="grid gap-2">
          <Label htmlFor={emailId}>Email</Label>
          <Input
            id={emailId}
            type="email"
            value={values.email}
            onChange={(e) => setField("email")(e.target.value)}
            placeholder="you@company.com"
            autoComplete="email"
            autoFocus
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
          placeholder="Enter your password"
          autoComplete="current-password"
          labelAction={
            <Link
              href={FORGOT_PASSWORD_ROUTE}
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Forgot password?
            </Link>
          }
        />

        <div className="flex items-center gap-2">
          <Checkbox
            id={rememberId}
            checked={remember}
            onCheckedChange={(checked) => setRemember(Boolean(checked))}
          />
          <Label htmlFor={rememberId} className="text-sm font-normal">
            Keep me signed in
          </Label>
        </div>

        <Button type="submit" className="w-full" disabled={pending}>
          {pending && (
            <HugeiconsIcon
              icon={Loading03Icon}
              className="size-4 animate-spin"
            />
          )}
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href={REGISTER_ROUTE}
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
