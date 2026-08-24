"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userProfile } from "@/mock-data/dashboard";
import {
  CheckmarkCircle02Icon,
  Delete02Icon,
  Upload01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useId, useRef, useState } from "react";
import {
  ACCEPTED_IMAGE_LABEL,
  ACCEPTED_IMAGE_TYPES,
  MAX_AVATAR_BYTES,
  MAX_AVATAR_MB,
} from "@/lib/constants";

type Errors = Partial<Record<"name" | "email" | "phone", string>>;

function validate(values: {
  name: string;
  email: string;
  phone: string;
}): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = "Name is required.";
  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  if (values.phone.trim() && !/^[+\d][\d\s()-]{6,}$/.test(values.phone.trim())) {
    errors.phone = "Enter a valid phone number.";
  }
  return errors;
}

export function GeneralTab() {
  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [values, setValues] = useState({
    name: userProfile.name,
    email: userProfile.email,
    phone: userProfile.phone,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [saved, setSaved] = useState(false);

  const [avatarSrc, setAvatarSrc] = useState(userProfile.avatarUrl);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const setField = (key: keyof typeof values) => (value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  function handleFile(file: File | undefined) {
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setAvatarError(`Choose a ${ACCEPTED_IMAGE_LABEL} image.`);
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setAvatarError(`Image must be ${MAX_AVATAR_MB} MB or smaller.`);
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setAvatarSrc(url);
    setAvatarError(null);
    setSaved(false);
  }

  function removeAvatar() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setAvatarSrc(userProfile.avatarUrl);
    setAvatarError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setSaved(false);
      return;
    }
    setSaved(true);
  }

  function handleReset() {
    setValues({
      name: userProfile.name,
      email: userProfile.email,
      phone: userProfile.phone,
    });
    setErrors({});
    setSaved(false);
    removeAvatar();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6" noValidate>
      <section className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Avatar className="size-20 border border-border">
          <AvatarImage src={avatarSrc} alt="" />
          <AvatarFallback className="text-lg">
            {userProfile.initials}
          </AvatarFallback>
        </Avatar>

        <div className="grid gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="gap-1.5"
            >
              <HugeiconsIcon icon={Upload01Icon} className="size-4" />
              Upload photo
            </Button>
            {previewUrl && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={removeAvatar}
                className="gap-1.5 text-muted-foreground"
              >
                <HugeiconsIcon icon={Delete02Icon} className="size-4" />
                Remove
              </Button>
            )}
          </div>
          <p
            className={
              avatarError
                ? "text-xs text-destructive"
                : "text-xs text-muted-foreground"
            }
          >
            {avatarError ??
              `${ACCEPTED_IMAGE_LABEL}. Up to ${MAX_AVATAR_MB} MB.`}
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          className="sr-only"
          aria-label="Upload profile photo"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor={nameId}>Name</Label>
          <Input
            id={nameId}
            value={values.name}
            onChange={(e) => setField("name")(e.target.value)}
            autoComplete="name"
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

        <div className="grid gap-2">
          <Label htmlFor={phoneId}>Phone number</Label>
          <Input
            id={phoneId}
            type="tel"
            value={values.phone}
            onChange={(e) => setField("phone")(e.target.value)}
            autoComplete="tel"
            placeholder="+1 555 000 0000"
            aria-invalid={Boolean(errors.phone) || undefined}
            aria-describedby={errors.phone ? `${phoneId}-error` : undefined}
          />
          {errors.phone && (
            <p id={`${phoneId}-error`} className="text-xs text-destructive">
              {errors.phone}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t pt-4">
        <Button type="submit" size="sm">
          Save changes
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={handleReset}>
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
            Profile updated
          </p>
        )}
      </div>
    </form>
  );
}
