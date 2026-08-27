"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthHeading } from "./auth-heading";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Loading03Icon } from "@hugeicons/core-free-icons";
import { LOGIN_ROUTE, VERIFY_OTP_ROUTE } from "@/lib/auth";

export function ForgotPasswordForm() {
  const router = useRouter();
  const emailId = useId();

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const trimmed = email.trim();
    if (!trimmed) {
      setError("Email is required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Enter a valid email address.");
      return;
    }

    setError(undefined);
    setPending(true);
    router.push(`${VERIFY_OTP_ROUTE}?email=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div className="grid gap-6">
      <AuthHeading
        title="Forgot your password?"
        description="Enter the email on your account and we'll send a verification code."
      />

      <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
        <div className="grid gap-2">
          <Label htmlFor={emailId}>Email</Label>
          <Input
            id={emailId}
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(undefined);
            }}
            placeholder="you@company.com"
            autoComplete="email"
            autoFocus
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={error ? `${emailId}-error` : undefined}
          />
          {error && (
            <p id={`${emailId}-error`} className="text-xs text-destructive">
              {error}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={pending}>
          {pending && (
            <HugeiconsIcon
              icon={Loading03Icon}
              className="size-4 animate-spin"
            />
          )}
          {pending ? "Sending code…" : "Send verification code"}
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
