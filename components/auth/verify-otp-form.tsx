"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/ui/otp-input";
import { AuthHeading } from "./auth-heading";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Loading03Icon } from "@hugeicons/core-free-icons";
import {
  FORGOT_PASSWORD_ROUTE,
  LOGIN_ROUTE,
  RESET_PASSWORD_ROUTE,
} from "@/lib/auth";
import { OTP_LENGTH } from "@/lib/config";

const RESEND_SECONDS = 30;

export function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [code, setCode] = useState("");
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (code.length < OTP_LENGTH) {
      setError(`Enter all ${OTP_LENGTH} digits.`);
      return;
    }

    setError(undefined);
    setPending(true);
    const query = email ? `?email=${encodeURIComponent(email)}` : "";
    router.push(`${RESET_PASSWORD_ROUTE}${query}`);
  }

  return (
    <div className="grid gap-6">
      <AuthHeading
        title="Check your email"
        description={
          email ? (
            <>
              We sent a {OTP_LENGTH}-digit code to{" "}
              <span className="font-medium text-foreground">{email}</span>.
            </>
          ) : (
            `Enter the ${OTP_LENGTH}-digit code we sent to your email.`
          )
        }
      />

      <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
        <div className="grid gap-2">
          <OtpInput
            length={OTP_LENGTH}
            value={code}
            onValueChange={(next) => {
              setCode(next);
              setError(undefined);
            }}
            invalid={Boolean(error)}
            autoFocus
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={pending}>
          {pending && (
            <HugeiconsIcon
              icon={Loading03Icon}
              className="size-4 animate-spin"
            />
          )}
          {pending ? "Verifying…" : "Verify code"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        {secondsLeft > 0 ? (
          <>Resend code in {secondsLeft}s</>
        ) : (
          <>
            Didn&apos;t get it?{" "}
            <button
              type="button"
              onClick={() => setSecondsLeft(RESEND_SECONDS)}
              className="font-medium text-foreground underline-offset-4 hover:underline cursor-pointer"
            >
              Resend code
            </button>
          </>
        )}
      </p>

      <Link
        href={email ? FORGOT_PASSWORD_ROUTE : LOGIN_ROUTE}
        className="inline-flex items-center justify-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
        {email ? "Use a different email" : "Back to sign in"}
      </Link>
    </div>
  );
}
