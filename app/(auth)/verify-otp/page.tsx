import { Suspense } from "react";
import type { Metadata } from "next";
import { VerifyOtpForm } from "@/components/auth/verify-otp-form";

export const metadata: Metadata = {
  title: "Verify code",
  description: "Enter the verification code sent to your email",
};

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyOtpForm />
    </Suspense>
  );
}
